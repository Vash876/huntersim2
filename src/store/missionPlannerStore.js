import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { MODIFIERS, getDefaultModifierValues } from '@/views/tools/mission-planner/constants/modifiers';
import {
  calculateAllPersonnelStats,
  formatPower,
  getLoopmodEffectsBreakdown,
  getResearchEffectsBreakdown,
  getRelicEffectsBreakdown,
  getBadgeEffectsBreakdown,
  getInscryptionEffectsBreakdown,
  getGadgetEffectsBreakdown,
  getOtherEffectsBreakdown,
  getGemEffectsBreakdown
} from '@/views/tools/mission-planner/constants/calculations';
import {
  calculateTotalPower,
  calculateCompletionTime,
  calculateMissionStats,
  calculatePowerFor2SecondCap,
  formatCompletionTime,
  formatNumber,
  FARM_MIN_TIME_SECONDS
} from '@/views/tools/mission-planner/constants/missionCalculator';
import { FARM_MISSIONS, CAMPAIGN_MISSIONS, isFarmMission, DEFAULT_FILL_ORDER, CAMPAIGN_FINAL_MULTIPLIERS } from '@/views/tools/mission-planner/constants/missions';
import {
  optimizeFarmMissions,
  calculateFarmMissionStats,
  validateAssignment,
  calculateWastedPower,
  suggestOptimalTier,
  createEmptyPersonnel,
  getTotalPersonnel,
  clonePersonnel,
  subtractPersonnel,
  addPersonnel
} from '@/views/tools/mission-planner/constants/missionOptimizer';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useHunterStore } from '@/store/hunterStore';

export const useMissionPlannerStore = defineStore('missionPlanner', () => {
  // ============================================
  // STATE
  // ============================================
  
  // Loading state
  const isLoading = ref(false);
  const error = ref(null);

  // Modifier values (persistent via localStorage with useStorage)
  const modifierValues = useStorage('mission-planner-modifiers', getDefaultModifierValues());
  
  // Settings (persistent via localStorage)
  const settings = useStorage('mission-planner-settings', {
    showDebug: false,
    activeTab: 'gameProgress',
  });

  // Mission assignments (persistent via localStorage)
  // Format: { missionTag: { T1: count, T2: count, T3: count, T4: count } }
  const missionAssignments = useStorage('mission-planner-assignments', {});

  // Manual mode missions (persistent via localStorage)
  // Format: { missionTag: true/false }
  // When true, the mission's assignment is locked and not optimized
  const manualModeMissions = useStorage('mission-planner-manual-missions', {});

  // Fill order for optimization (persistent via localStorage)
  // Format: { missionTag: priority } - lower = higher priority (1-16)
  // Missions are processed in this order during optimization
  const fillOrder = useStorage('mission-planner-fill-order', { ...DEFAULT_FILL_ORDER });

  // Last optimization result (not persisted)
  const lastOptimizationResult = ref(null);

  // Campaign selection state (persistent)
  // Selected campaign for time calculation (e.g., 'C3-8')
  const selectedCampaign = useStorage('mission-planner-selected-campaign', null);
  
  // Relic levels (persistent via localStorage)
  // Format: { r1: level, r2: level, ..., r20: level }
  const relicLevels = useStorage('mission-planner-relic-levels', {
    r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r8: 0, r9: 0, r10: 0,
    r11: 0, r12: 0, r13: 0, r14: 0, r15: 0, r16: 0, r17: 0, r18: 0, r19: 0, r20: 0,
  });
  
  // Relic target levels (persistent via localStorage)
  // Format: { r1: targetLevel, r2: targetLevel, ..., r20: targetLevel }
  const relicTargetLevels = useStorage('mission-planner-relic-target-levels', {
    r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r8: 0, r9: 0, r10: 0,
    r11: 0, r12: 0, r13: 0, r14: 0, r15: 0, r16: 0, r17: 0, r18: 0, r19: 0, r20: 0,
  });
  
  // Current fragments owned (for relic planning time estimates)
  const currentFragments = useStorage('mission-planner-current-fragments', 0);
  
  // Timestamp when fragments were last updated (for auto-growth calculation)
  const fragmentsLastUpdated = useStorage('mission-planner-fragments-last-updated', Date.now());
  
  // Current hours in TR (for relic planning - shows at which hour targets can be afforded)
  const currentHoursInTR = useStorage('mission-planner-current-hours-in-tr', 0);
  
  // Fill order position for the selected campaign (1-17, inserts before farms at that position)
  // Default is 17 (last position, after all farms)
  const campaignFillOrder = useStorage('mission-planner-campaign-fill-order', 17);
  
  // Campaign manual mode (persistent)
  const campaignManualMode = useStorage('mission-planner-campaign-manual-mode', false);
  
  // Active main tab for Mission Planner page ('missions', 'campaigns', 'relics')
  // Used to navigate directly to campaigns tab when notification is clicked
  const activeMainTab = useStorage('mission-planner-active-main-tab', 'missions');

  // ============================================
  // CAMPAIGN TIMER STATE (Global - runs in background)
  // ============================================
  
  // Active timers: { 'C1-1': { startedAt: timestamp, durationSeconds: number }, ... }
  const campaignTimers = useStorage('mission-planner-campaign-timers', {});
  
  // Track which timers have already played their alarm (to avoid repeat alarms)
  const campaignTimersAlarmPlayed = useStorage('mission-planner-campaign-timers-alarms', {});
  
  // Current time for reactive countdown (updated every second)
  const campaignTimerCurrentTime = ref(Date.now());
  
  // Interval reference for cleanup
  let campaignTimerInterval = null;
  
  // Flag to check if timer system is initialized
  const campaignTimersInitialized = ref(false);

  // ============================================
  // COMPUTED - Calculated Effects
  // ============================================
  
  // Loopmod bonuses based on +Ultima and I58 headstart
  const loopmodBonuses = computed(() => {
    const plusUltima = modifierValues.value?.plus_ultima || 0;
    const inscryptionEffects = inscryptionEffectsBreakdown.value;
    
    return {
      'ultima_productivity': plusUltima,
      'ultima_swarm': plusUltima,
      't1_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't2_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't3_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't4_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't_all_headstart': inscryptionEffects.headstartMaxLevelBonus,
    };
  });
  
  // Boon modifiers
  const boonModifiers = computed(() => ({
    completedCampaigns: modifierValues.value?.completed_campaigns || 0,
    shipInstalls: modifierValues.value?.ship_installs || 0,
  }));

  // Individual effect breakdowns
  const loopmodEffectsBreakdown = computed(() => {
    const mpThreshold = modifierValues.value?.mp || 0;
    return getLoopmodEffectsBreakdown(mpThreshold, loopmodBonuses.value, boonModifiers.value);
  });

  const researchEffectsBreakdown = computed(() => {
    const rpThreshold = modifierValues.value?.rp || 0;
    const allTimeHighestRP = modifierValues.value?.all_time_highest_rp || 0;
    return getResearchEffectsBreakdown(rpThreshold, allTimeHighestRP);
  });

  const relicEffectsBreakdown = computed(() => {
    const relicLevels = {
      relic_3: modifierValues.value?.relic_3 || 0,
      relic_5: modifierValues.value?.relic_5 || 0,
      relic_6: modifierValues.value?.relic_6 || 0,
      relic_11: modifierValues.value?.relic_11 || 0,
      t2r8: modifierValues.value?.t2r8 || 0,
    };
    return getRelicEffectsBreakdown(relicLevels);
  });

  const badgeEffectsBreakdown = computed(() => {
    const badgeStates = {
      engineering_badge: modifierValues.value?.engineering_badge || false,
      fragmentation_badge: modifierValues.value?.fragmentation_badge || false,
    };
    return getBadgeEffectsBreakdown(badgeStates);
  });

  const inscryptionEffectsBreakdown = computed(() => {
    const inscryptionLevels = {
      inscryption_58: modifierValues.value?.inscryption_58 || 0,
      inscryption_102: modifierValues.value?.inscryption_102 || 0,
      inscryption_106: modifierValues.value?.inscryption_106 || 0,
      inscryption_107: modifierValues.value?.inscryption_107 || 0,
      inscryption_108: modifierValues.value?.inscryption_108 || 0,
      inscryption_109: modifierValues.value?.inscryption_109 || 0,
      inscryption_110: modifierValues.value?.inscryption_110 || 0,
    };
    return getInscryptionEffectsBreakdown(inscryptionLevels);
  });

  const gadgetEffectsBreakdown = computed(() => {
    const gadgetLevels = {
      local_fragment_magnet: modifierValues.value?.local_fragment_magnet || 0,
      galactic_fragment_magnet: modifierValues.value?.galactic_fragment_magnet || 0,
    };
    return getGadgetEffectsBreakdown(gadgetLevels);
  });

  const otherEffectsBreakdown = computed(() => {
    const otherStates = {
      trait_sphere_07: modifierValues.value?.trait_sphere_07 || false,
      fragmentation_pack: modifierValues.value?.fragmentation_pack || false,
    };
    
    // Get Eternal Milestone level from hunterStore (id: m0)
    let eternalMilestoneLevel = 0;
    try {
      const hunterStore = useHunterStore();
      eternalMilestoneLevel = hunterStore.getUpgradeValue('shardmilestones', 'm0') || 0;
    } catch (error) {
      console.warn('Could not get Eternal Milestone level:', error);
    }
    
    // Get Attraction Gem level from gemPlannerStore (required Level 3 to unlock Eternal Milestone)
    let attractionGemLevel = 0;
    try {
      const gemPlannerStore = useGemPlannerStore();
      attractionGemLevel = gemPlannerStore.gemStates?.attraction?.level || 0;
    } catch (error) {
      console.warn('Could not get Attraction Gem level:', error);
    }
    
    return getOtherEffectsBreakdown(otherStates, eternalMilestoneLevel, attractionGemLevel);
  });

  // Gem effects from gemPlannerStore
  const gemEffectsBreakdown = computed(() => {
    try {
      const gemPlannerStore = useGemPlannerStore();
      const gemStates = gemPlannerStore.gemStates || {};
      const mechCount = modifierValues.value?.creation_node_5_mechs || 0;
      const loopmodsOwned = modifierValues.value?.exodus_node_2_loopmods || 0;
      return getGemEffectsBreakdown(gemStates, mechCount, loopmodsOwned);
    } catch (error) {
      console.error('Error getting gem effects:', error);
      return {
        nodeStates: {},
        personnelBonuses: { T1: 0, T2: 0, T3: 0, T4: 0 },
        powerBonuses: { T1: 0, T2: 0, T3: 0, T4: 0 },
        relicMaxLevelBonuses: { relic_5: 0, relic_6: 0 },
        farmFragsAdditive: 0,
        farmFragsMultiplier: 1.0,
        campaignFragsMultiplier: 1.0,
        mechCount: 0,
        loopmodsOwned: 0,
        breakdown: {},
      };
    }
  });

  // Personnel stats from Cells
  const personnelStats = computed(() => {
    const cellsExponent = modifierValues.value?.cells || 0;
    return calculateAllPersonnelStats(cellsExponent);
  });

  // Combined personnel with all bonuses applied
  const personnelWithBonuses = computed(() => {
    const base = personnelStats.value;
    const loopmod = loopmodEffectsBreakdown.value;
    const research = researchEffectsBreakdown.value;
    const inscryption = inscryptionEffectsBreakdown.value;
    const gem = gemEffectsBreakdown.value;
    
    // Personnel count: base + loopmod + research + gem (Power Gem nodes)
    const t1Count = base.t1.count + loopmod.countBonuses.T1 + research.personnelBonuses.T1 + gem.personnelBonuses.T1;
    const t2Count = base.t2.count + loopmod.countBonuses.T2 + research.personnelBonuses.T2 + gem.personnelBonuses.T2;
    const t3Count = base.t3.count + loopmod.countBonuses.T3 + research.personnelBonuses.T3 + gem.personnelBonuses.T3;
    const t4Count = base.t4.count + loopmod.countBonuses.T4 + research.personnelBonuses.T4 + gem.personnelBonuses.T4;
    
    // Power per unit: base + loopmod + inscryption + gem (Power Gem nodes)
    const t1PowerPerUnit = base.t1.powerPerUnit + loopmod.powerBonuses.T1 + inscryption.personnelPowerBonuses.T1 + gem.powerBonuses.T1;
    const t2PowerPerUnit = base.t2.powerPerUnit + loopmod.powerBonuses.T2 + inscryption.personnelPowerBonuses.T2 + gem.powerBonuses.T2;
    const t3PowerPerUnit = base.t3.powerPerUnit + loopmod.powerBonuses.T3 + inscryption.personnelPowerBonuses.T3 + gem.powerBonuses.T3;
    const t4PowerPerUnit = base.t4.powerPerUnit + loopmod.powerBonuses.T4 + inscryption.personnelPowerBonuses.T4 + gem.powerBonuses.T4;
    
    const t1TotalPower = t1Count * t1PowerPerUnit;
    const t2TotalPower = t2Count * t2PowerPerUnit;
    const t3TotalPower = t3Count * t3PowerPerUnit;
    const t4TotalPower = t4Count * t4PowerPerUnit;
    
    const totalCount = t1Count + t2Count + t3Count + t4Count;
    const totalPower = t1TotalPower + t2TotalPower + t3TotalPower + t4TotalPower;
    
    return {
      t1: { count: t1Count, powerPerUnit: t1PowerPerUnit, totalPower: t1TotalPower },
      t2: { count: t2Count, powerPerUnit: t2PowerPerUnit, totalPower: t2TotalPower },
      t3: { count: t3Count, powerPerUnit: t3PowerPerUnit, totalPower: t3TotalPower },
      t4: { count: t4Count, powerPerUnit: t4PowerPerUnit, totalPower: t4TotalPower },
      totalCount,
      totalPower,
      formatted: {
        t1Power: formatPower(t1TotalPower),
        t2Power: formatPower(t2TotalPower),
        t3Power: formatPower(t3TotalPower),
        t4Power: formatPower(t4TotalPower),
        totalPower: formatPower(totalPower),
      }
    };
  });

  // Combined mission speed multiplier
  const missionSpeedMultiplier = computed(() => {
    return loopmodEffectsBreakdown.value.missionSpeedMultiplier 
      * researchEffectsBreakdown.value.missionSpeedMultiplier 
      * relicEffectsBreakdown.value.missionSpeedMultiplier 
      * badgeEffectsBreakdown.value.missionSpeedMultiplier;
  });

  // Combined farm fragments
  // Formula: (base + additive) * multiplier (same pattern as campaign fragments)
  const farmFragments = computed(() => {
    const baseValue = 0.001;
    const gem = gemEffectsBreakdown.value;
    
    // Individual multipliers
    const loopmodMult = loopmodEffectsBreakdown.value.farmFragsMultiplier;
    const researchMult = researchEffectsBreakdown.value.farmFragsBonuses.multiplier;
    const badgeMult = badgeEffectsBreakdown.value.farmFragsMultiplier;
    const inscryptionMult = inscryptionEffectsBreakdown.value.farmFragsMultiplier;
    const otherMult = otherEffectsBreakdown.value.farmFragsMultiplier;
    const gemMult = gem.farmFragsMultiplier;
    const relicAllFragsMult = relicEffectsBreakdown.value.allFragmentsMultiplier || 1;
    
    const multiplier = loopmodMult * researchMult * badgeMult * inscryptionMult * otherMult * gemMult * relicAllFragsMult;
    
    // Individual additives
    const researchAdd = researchEffectsBreakdown.value.farmFragsBonuses.additive;
    const relicAdd = relicEffectsBreakdown.value.farmFragsAdditive;
    const inscryptionAdd = inscryptionEffectsBreakdown.value.farmFragsAdditive;
    const gadgetAdd = gadgetEffectsBreakdown.value.farmFragsAdditive;
    const gemAdd = gem.farmFragsAdditive;
    
    const additive = researchAdd + relicAdd + inscryptionAdd + gadgetAdd + gemAdd;
    
    // Correct formula: (base + additive) * multiplier
    const value = (baseValue + additive) * multiplier;
    
    // Debug log
    console.log('=== FARM FRAGMENTS CALCULATION ===');
    console.log(`Base Value: ${baseValue}`);
    console.log('--- ADDITIVES ---');
    console.log(`  Research (93): +${researchAdd.toFixed(6)}`);
    console.log(`  Relic 5: +${relicAdd.toFixed(6)}`);
    console.log(`  Inscryption (I102): +${inscryptionAdd.toFixed(6)}`);
    console.log(`  Gadget (Local Magnet): +${gadgetAdd.toFixed(6)}`);
    console.log(`  Gem (Power3): +${gemAdd.toFixed(6)}`);
    console.log(`  Total Additive: +${additive.toFixed(6)}`);
    console.log(`  (Base + Additive): ${(baseValue + additive).toFixed(6)}`);
    console.log('--- MULTIPLIERS ---');
    console.log(`  Loopmod: ×${loopmodMult.toFixed(4)}`);
    console.log(`  Research (97+104): ×${researchMult.toFixed(4)}`);
    console.log(`  Badge: ×${badgeMult.toFixed(4)}`);
    console.log(`  Inscryption (I110): ×${inscryptionMult.toFixed(4)}`);
    console.log(`  Other (TS07+FragPack): ×${otherMult.toFixed(4)}`);
    console.log(`  Gems (Power4+Attr4+Creation+Exodus): ×${gemMult.toFixed(4)}`);
    console.log(`  Relic T2R8: ×${relicAllFragsMult.toFixed(4)}`);
    console.log(`  Total Multiplier: ×${multiplier.toFixed(4)}`);
    console.log('--- RESULT ---');
    console.log(`  Formula: (${baseValue} + ${additive.toFixed(6)}) × ${multiplier.toFixed(4)}`);
    console.log(`  Result: ${value.toFixed(6)}`);
    console.log('==================================');
    
    return {
      baseValue,
      multiplier,
      additive,
      value,
      formatted: value.toFixed(6),
      // Breakdown for debugging in UI
      breakdown: {
        loopmodMult,
        researchMult,
        badgeMult,
        inscryptionMult,
        otherMult,
        gemMult,
        relicAllFragsMult,
        researchAdd,
        relicAdd,
        inscryptionAdd,
        gadgetAdd,
        gemAdd,
      },
    };
  });

  // Combined campaign fragments
  // Formula: (base + r6Add) * (all multipliers)
  // This matches the formula in calculations.js:
  // (2.5 + r6Add) * (m0 * attr1 * attr4 * campfragdet * pow2 * research_alltime * ouroinstalls * iap_frag * i110 * r6Multi)
  const campaignFragments = computed(() => {
    const baseValue = 2.5;
    const gem = gemEffectsBreakdown.value;
    
    // Individual multipliers
    const loopmodMult = loopmodEffectsBreakdown.value.campaignFragsMultiplier;
    const researchMult = researchEffectsBreakdown.value.campaignFragsBonuses.multiplier;
    const relicMult = relicEffectsBreakdown.value.campaignFragsMultiplier;
    const inscryptionMult = inscryptionEffectsBreakdown.value.campaignFragsMultiplier;
    const gadgetMult = gadgetEffectsBreakdown.value.campaignFragsMultiplier;
    const otherMult = otherEffectsBreakdown.value.campaignFragsMultiplier;
    const gemMult = gem.campaignFragsMultiplier;
    const relicAllFragsMult = relicEffectsBreakdown.value.allFragmentsMultiplier || 1;
    
    const multiplier = loopmodMult * researchMult * relicMult * inscryptionMult * gadgetMult * otherMult * gemMult * relicAllFragsMult;
    
    // Additive bonuses are added to base BEFORE multiplying
    const researchAdd = researchEffectsBreakdown.value.campaignFragsBonuses.additive;
    const relicAdd = relicEffectsBreakdown.value.campaignFragsAdditive;
    const additive = researchAdd + relicAdd;
    
    // Correct formula: (base + additive) * multiplier
    const value = (baseValue + additive) * multiplier;
    
    return {
      baseValue,
      multiplier,
      additive,
      value,
      formatted: value.toFixed(4),
      // Breakdown for debugging in UI
      breakdown: {
        loopmodMult,
        researchMult,
        relicMult,
        inscryptionMult,
        gadgetMult,
        otherMult,
        gemMult,
        relicAllFragsMult,
        researchAdd,
        relicAdd,
      },
    };
  });

  // ============================================
  // COMPUTED - Total Campaign Fragments (all 48 campaigns)
  // ============================================
  
  /**
   * Calculate campaign fragments for a specific completed_campaigns value
   * This recalculates the boon effects with the given completed count
   */
  function calculateCampaignFragsForIndex(campaignIndex) {
    const mpThreshold = modifierValues.value?.mp || 0;
    const shipInstalls = modifierValues.value?.ship_installs || 0;
    
    // Recalculate loopmod effects with this campaign's completed count
    const tempBoonModifiers = {
      completedCampaigns: campaignIndex,
      shipInstalls: shipInstalls,
    };
    
    const tempLoopmodEffects = getLoopmodEffectsBreakdown(mpThreshold, loopmodBonuses.value, tempBoonModifiers);
    
    // Calculate campaign fragments with the temp loopmod multiplier
    const baseValue = 2.5;
    const gem = gemEffectsBreakdown.value;
    
    const loopmodMult = tempLoopmodEffects.campaignFragsMultiplier;
    const researchMult = researchEffectsBreakdown.value.campaignFragsBonuses.multiplier;
    const relicMult = relicEffectsBreakdown.value.campaignFragsMultiplier;
    const inscryptionMult = inscryptionEffectsBreakdown.value.campaignFragsMultiplier;
    const gadgetMult = gadgetEffectsBreakdown.value.campaignFragsMultiplier;
    const otherMult = otherEffectsBreakdown.value.campaignFragsMultiplier;
    const gemMult = gem.campaignFragsMultiplier;
    const relicAllFragsMult = relicEffectsBreakdown.value.allFragmentsMultiplier || 1;
    
    const multiplier = loopmodMult * researchMult * relicMult * inscryptionMult * gadgetMult * otherMult * gemMult * relicAllFragsMult;
    
    const researchAdd = researchEffectsBreakdown.value.campaignFragsBonuses.additive;
    const relicAdd = relicEffectsBreakdown.value.campaignFragsAdditive;
    const additive = researchAdd + relicAdd;
    
    return (baseValue + additive) * multiplier;
  }

  /**
   * Optimal campaign order for maximum fragments
   * Strategy: Do final campaigns (CX-12) as late as possible to benefit from higher completed_campaigns multiplier
   * Order: Normal campaigns first, then finals at positions 36, 40, 44, 48
   */
  const OPTIMAL_CAMPAIGN_ORDER = (() => {
    const order = [];
    const finals = ['C1-12', 'C2-12', 'C3-12', 'C4-12'];
    
    // First, add all non-final campaigns (44 campaigns total)
    for (let planet = 1; planet <= 4; planet++) {
      for (let mission = 1; mission <= 12; mission++) {
        const tag = `C${planet}-${mission}`;
        if (!finals.includes(tag)) {
          order.push(tag);
        }
      }
    }
    
    // Now insert finals at optimal positions (36, 40, 44, 48 = indices 35, 39, 43, 47)
    // C1-12 at position 36 (index 35)
    order.splice(35, 0, 'C1-12');
    // C2-12 at position 40 (index 39)
    order.splice(39, 0, 'C2-12');
    // C3-12 at position 44 (index 43)
    order.splice(43, 0, 'C3-12');
    // C4-12 at position 48 (index 47)
    order.splice(47, 0, 'C4-12');
    
    return order;
  })();

  /**
   * Total fragments from all 48 campaigns in one TR
   * Uses optimal order: finals (CX-12) done as late as possible for maximum multiplier benefit
   * Final campaigns have their own multipliers: C1-12=×2, C2-12=×3, C3-12=×13, C4-12=×19
   */
  const totalCampaignFragments = computed(() => {
    let total = 0;
    
    // Process all 48 campaigns in optimal order
    for (let i = 0; i < 48; i++) {
      const tag = OPTIMAL_CAMPAIGN_ORDER[i];
      
      // Calculate fragments for this campaign (with its completed_campaigns index)
      let frags = calculateCampaignFragsForIndex(i);
      
      // Apply final mission multiplier if applicable
      const finalMultiplier = CAMPAIGN_FINAL_MULTIPLIERS[tag] || 1;
      frags *= finalMultiplier;
      
      total += frags;
    }
    
    return {
      value: total,
      formatted: formatNumber(Math.round(total)),
    };
  });

  // All calculated effects combined (for easy access)
  const calculatedEffects = computed(() => ({
    // Personnel
    personnel: personnelWithBonuses.value,
    
    // Mission Effects
    missionSpeed: Math.round(missionSpeedMultiplier.value * 100),
    missionSpeedMultiplier: missionSpeedMultiplier.value,
    
    // Fragments
    farmFragments: farmFragments.value,
    campaignFragments: campaignFragments.value,
    totalCampaignFragments: totalCampaignFragments.value,
    
    // Loopmod levels (calculated from MP)
    loopmodLevels: loopmodEffectsBreakdown.value.loopmodLevels,
    boonEternityLevel: loopmodEffectsBreakdown.value.loopmodLevels?.boon_eternity || 0,
    boonHegemonyLevel: loopmodEffectsBreakdown.value.loopmodLevels?.boon_hegemony || 0,
    
    // Individual breakdowns for debugging
    breakdowns: {
      loopmod: loopmodEffectsBreakdown.value,
      research: researchEffectsBreakdown.value,
      relic: relicEffectsBreakdown.value,
      badge: badgeEffectsBreakdown.value,
      inscryption: inscryptionEffectsBreakdown.value,
      gadget: gadgetEffectsBreakdown.value,
      other: otherEffectsBreakdown.value,
      gem: gemEffectsBreakdown.value,
    },
  }));

  // ============================================
  // COMPUTED - Power per Tier (for mission calculations)
  // ============================================
  
  /**
   * Power per tier for easy access in mission calculations
   * Format: { T1: power, T2: power, T3: power, T4: power }
   */
  const powerPerTier = computed(() => ({
    T1: personnelWithBonuses.value.t1.powerPerUnit,
    T2: personnelWithBonuses.value.t2.powerPerUnit,
    T3: personnelWithBonuses.value.t3.powerPerUnit,
    T4: personnelWithBonuses.value.t4.powerPerUnit,
  }));

  /**
   * Available personnel counts for easy access
   * Format: { T1: count, T2: count, T3: count, T4: count }
   */
  const availablePersonnel = computed(() => ({
    T1: personnelWithBonuses.value.t1.count,
    T2: personnelWithBonuses.value.t2.count,
    T3: personnelWithBonuses.value.t3.count,
    T4: personnelWithBonuses.value.t4.count,
  }));

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Update a single modifier value
   * Triggers auto-optimization after update
   * @param {string} modifierId - The modifier ID
   * @param {any} value - The new value
   */
  function updateModifier(modifierId, value) {
    modifierValues.value[modifierId] = value;
    // Auto-optimize after modifier changes
    optimizeAndApply();
  }

  /**
   * Update multiple modifier values at once
   * Triggers auto-optimization after update
   * @param {Object} values - Object with modifier IDs as keys
   */
  function updateModifiers(values) {
    modifierValues.value = {
      ...modifierValues.value,
      ...values,
    };
    // Auto-optimize after modifier changes
    optimizeAndApply();
  }

  /**
   * Reset all modifiers to default values
   * Triggers auto-optimization after reset
   */
  function resetModifiers() {
    modifierValues.value = getDefaultModifierValues();
    // Auto-optimize after reset
    optimizeAndApply();
  }

  /**
   * Reset a specific category of modifiers
   * Triggers auto-optimization after reset
   * @param {string} category - The category to reset
   */
  function resetCategory(category) {
    const defaults = getDefaultModifierValues();
    const categoryModifiers = MODIFIERS[category] || [];
    
    categoryModifiers.forEach(modifier => {
      modifierValues.value[modifier.id] = defaults[modifier.id];
    });
    // Auto-optimize after category reset
    optimizeAndApply();
  }

  /**
   * Get modifier value by ID
   * @param {string} modifierId - The modifier ID
   * @returns {any} The modifier value
   */
  function getModifier(modifierId) {
    return modifierValues.value[modifierId];
  }

  /**
   * Update settings
   * @param {Object} newSettings - Settings to update
   */
  function updateSettings(newSettings) {
    settings.value = {
      ...settings.value,
      ...newSettings,
    };
  }

  /**
   * Toggle debug mode
   */
  function toggleDebug() {
    settings.value.showDebug = !settings.value.showDebug;
  }

  // ============================================
  // MISSION CALCULATION HELPERS
  // ============================================

  /**
   * Calculate stats for a single mission with given personnel assignment
   * @param {Object} mission - Mission object from FARM_MISSIONS or CAMPAIGN_MISSIONS
   * @param {Object} personnel - { T1: count, T2: count, T3: count, T4: count }
   * @returns {Object} Mission stats including completion time, fragments/hour, etc.
   */
  function getMissionStats(mission, personnel) {
    return calculateMissionStats(
      mission,
      personnel,
      powerPerTier.value,
      missionSpeedMultiplier.value,
      farmFragments.value.value,
      campaignFragments.value.value
    );
  }

  /**
   * Calculate power required to hit 2-second cap for a farm mission
   * @param {Object} mission - Mission object
   * @returns {number} Power required
   */
  function getPowerFor2SecondCap(mission) {
    return calculatePowerFor2SecondCap(mission.timeInMinutes, missionSpeedMultiplier.value);
  }

  /**
   * Calculate how many personnel of a given tier are needed to hit 2-second cap
   * @param {Object} mission - Mission object
   * @param {string} tier - 'T1', 'T2', 'T3', or 'T4'
   * @returns {number} Number of personnel needed (rounded up)
   */
  function getPersonnelNeededForCap(mission, tier = 'T1') {
    const powerNeeded = getPowerFor2SecondCap(mission);
    const tierPower = powerPerTier.value[tier] || 1;
    return Math.ceil(powerNeeded / tierPower);
  }

  /**
   * Check if a mission can be completed (has personnel assigned)
   * @param {Object} personnel - { T1: count, T2: count, T3: count, T4: count }
   * @returns {boolean}
   */
  function hasPersonnelAssigned(personnel) {
    return (personnel.T1 || 0) + (personnel.T2 || 0) + (personnel.T3 || 0) + (personnel.T4 || 0) > 0;
  }

  /**
   * Get all farm missions with stats for given assignments
   * @param {Object} assignments - { missionTag: { T1: count, T2: count, ... }, ... }
   * @returns {Array} Array of mission stats
   */
  function getFarmMissionsWithStats(assignments = {}) {
    return FARM_MISSIONS.map(mission => {
      const personnel = assignments[mission.tag] || { T1: 0, T2: 0, T3: 0, T4: 0 };
      return getMissionStats(mission, personnel);
    });
  }

  /**
   * Get all campaign missions with stats for given assignments
   * Applies R11 bonus to maxCrew
   * @param {Object} assignments - { missionTag: { T1: count, T2: count, ... }, ... }
   * @returns {Array} Array of mission stats
   */
  function getCampaignMissionsWithStats(assignments = {}) {
    // Apply R11 bonus to all campaigns
    const r11Multiplier = relicEffectsBreakdown.value.campaignMaxCrewMultiplier || 1;
    
    return CAMPAIGN_MISSIONS.map(mission => {
      const personnel = assignments[mission.tag] || { T1: 0, T2: 0, T3: 0, T4: 0 };
      
      // Create adjusted mission with R11 bonus
      const adjustedMission = {
        ...mission,
        maxCrew: Math.floor(mission.maxCrew * r11Multiplier),
        baseMaxCrew: mission.maxCrew,
      };
      
      return getMissionStats(adjustedMission, personnel);
    });
  }

  /**
   * Calculate total fragments per hour from all farm missions
   * @param {Object} assignments - { missionTag: { T1: count, T2: count, ... }, ... }
   * @returns {number} Total fragments per hour
   */
  function getTotalFarmFragsPerHour(assignments = {}) {
    const stats = getFarmMissionsWithStats(assignments);
    return stats.reduce((total, mission) => total + (mission.fragsPerHour || 0), 0);
  }

  // ============================================
  // MISSION ASSIGNMENT MANAGEMENT
  // ============================================

  /**
   * Get current assignment for a mission
   * @param {string} missionTag - Mission tag (e.g., 'F1-1')
   * @returns {Object} Personnel assignment { T1, T2, T3, T4 }
   */
  function getAssignment(missionTag) {
    return missionAssignments.value[missionTag] || createEmptyPersonnel();
  }

  /**
   * Set assignment for a mission
   * Only allowed for manual mode missions - triggers auto-optimization
   * @param {string} missionTag - Mission tag
   * @param {Object} personnel - { T1: count, T2: count, T3: count, T4: count }
   * @param {boolean} skipOptimize - If true, skip auto-optimization (used internally)
   */
  function setAssignment(missionTag, personnel, skipOptimize = false) {
    missionAssignments.value = {
      ...missionAssignments.value,
      [missionTag]: { ...personnel }
    };
    // Auto-optimize after manual assignment changes (only for manual mode missions)
    if (!skipOptimize && isManualMode(missionTag)) {
      optimizeAndApply();
    }
  }

  /**
   * Clear assignment for a mission
   * @param {string} missionTag - Mission tag
   */
  function clearAssignment(missionTag) {
    const newAssignments = { ...missionAssignments.value };
    delete newAssignments[missionTag];
    missionAssignments.value = newAssignments;
  }

  /**
   * Clear all assignments and manual modes, reset fill order, clear campaign, then re-optimize
   */
  function clearAllAssignments() {
    missionAssignments.value = {};
    manualModeMissions.value = {};
    lastOptimizationResult.value = null;
    
    // Reset fill order to defaults
    fillOrder.value = { ...DEFAULT_FILL_ORDER };
    
    // Clear campaign selection and reset to defaults
    selectedCampaign.value = null;
    campaignFillOrder.value = 17;
    campaignManualMode.value = false;
    
    // Auto-optimize after clearing
    optimizeAndApply();
  }

  /**
   * Check if mission is in manual mode
   * @param {string} missionTag - Mission tag
   * @returns {boolean}
   */
  function isManualMode(missionTag) {
    return !!manualModeMissions.value[missionTag];
  }

  /**
   * Set manual mode for a mission
   * @param {string} missionTag - Mission tag
   * @param {boolean} isManual - Whether manual mode is enabled
   */
  function setManualMode(missionTag, isManual) {
    manualModeMissions.value = {
      ...manualModeMissions.value,
      [missionTag]: isManual
    };
  }

  /**
   * Toggle manual mode for a mission
   * Triggers auto-optimization after toggling
   * @param {string} missionTag - Mission tag
   */
  function toggleManualMode(missionTag) {
    setManualMode(missionTag, !isManualMode(missionTag));
    // Auto-optimize after toggling manual mode
    optimizeAndApply();
  }

  /**
   * Get all manual mode assignments
   * @returns {Object} { missionTag: personnel, ... }
   */
  function getManualAssignments() {
    const result = {};
    Object.keys(manualModeMissions.value).forEach(tag => {
      if (manualModeMissions.value[tag]) {
        result[tag] = getAssignment(tag);
      }
    });
    return result;
  }

  /**
   * Get remaining personnel after manual assignments
   * @returns {Object} { T1: count, T2: count, T3: count, T4: count }
   */
  function getRemainingPersonnel() {
    let remaining = clonePersonnel(availablePersonnel.value);
    const manualAssigns = getManualAssignments();
    
    Object.values(manualAssigns).forEach(personnel => {
      remaining = subtractPersonnel(remaining, personnel);
    });
    
    return remaining;
  }

  /**
   * Validate a potential assignment
   * @param {string} missionTag - Mission tag
   * @param {Object} personnel - Personnel to assign
   * @returns {Object} { isValid, errors }
   */
  function validateMissionAssignment(missionTag, personnel) {
    const mission = [...FARM_MISSIONS, ...CAMPAIGN_MISSIONS].find(m => m.tag === missionTag);
    if (!mission) {
      return { isValid: false, errors: ['Mission nicht gefunden'] };
    }
    
    // Get available personnel minus other assignments
    let available = clonePersonnel(availablePersonnel.value);
    Object.entries(missionAssignments.value).forEach(([tag, assigned]) => {
      if (tag !== missionTag) {
        available = subtractPersonnel(available, assigned);
      }
    });
    
    return validateAssignment(personnel, available, mission.maxCrew);
  }

  // ============================================
  // OPTIMIZATION
  // ============================================

  /**
   * Run the optimizer for farm missions
   * Uses Fill Order based allocation, respects manual mode missions
   * Also handles campaign if selected
   * @returns {Object} Optimization result
   */
  function runOptimization() {
    const manualAssigns = getManualAssignments();
    
    // Build campaign data if selected
    let campaignData = null;
    if (selectedCampaign.value) {
      const campaignMission = getSelectedCampaignData();
      if (campaignMission) {
        campaignData = {
          mission: campaignMission,
          fillOrder: campaignFillOrder.value,
          isManual: campaignManualMode.value,
          assignment: campaignManualMode.value ? getAssignment(selectedCampaign.value) : null
        };
      }
    }
    
    const result = optimizeFarmMissions({
      available: availablePersonnel.value,
      powerPerTier: powerPerTier.value,
      missionSpeedMultiplier: missionSpeedMultiplier.value,
      baseFarmFrags: farmFragments.value.value,
      manualAssignments: manualAssigns,
      fillOrder: fillOrder.value,
      campaign: campaignData
    });
    
    lastOptimizationResult.value = result;
    return result;
  }

  /**
   * Apply optimization result to assignments
   * Only updates non-manual missions
   */
  function applyOptimization() {
    const result = lastOptimizationResult.value;
    if (!result) {
      console.warn('No optimization result to apply');
      return;
    }
    
    // Apply each assignment from the optimization (with skipOptimize=true to avoid loops)
    Object.entries(result.assignments).forEach(([tag, data]) => {
      // Skip manual missions - they keep their current assignment
      if (!data.isManual) {
        setAssignment(tag, data.personnel, true);
      }
    });
    
    // Apply campaign assignment if not manual
    if (selectedCampaign.value && !campaignManualMode.value) {
      if (result.campaignAssignment) {
        setAssignment(selectedCampaign.value, result.campaignAssignment.personnel, true);
      } else {
        // Clear campaign assignment if no personnel available for it
        clearAssignment(selectedCampaign.value);
      }
    }
    
    // Clear assignments for unassigned missions (not enough personnel)
    result.unassignedMissions.forEach(tag => {
      if (!isManualMode(tag)) {
        clearAssignment(tag);
      }
    });
  }

  /**
   * Run optimization and apply in one step
   * @returns {Object} Optimization result
   */
  function optimizeAndApply() {
    const result = runOptimization();
    applyOptimization();
    return result;
  }

  /**
   * Get calculated stats for current assignments
   * @returns {Object} { missions, totalFragsPerHour }
   */
  function getCurrentMissionStats() {
    // Build assignment map in the format expected by calculateFarmMissionStats
    const assignmentMap = {};
    Object.entries(missionAssignments.value).forEach(([tag, personnel]) => {
      if (isFarmMission(tag)) {
        assignmentMap[tag] = { personnel, isManual: isManualMode(tag) };
      }
    });
    
    return calculateFarmMissionStats(
      assignmentMap,
      powerPerTier.value,
      missionSpeedMultiplier.value,
      farmFragments.value.value
    );
  }

  /**
   * Get total personnel used across all assignments
   * @returns {Object} { T1, T2, T3, T4 }
   */
  function getTotalPersonnelUsed() {
    let total = createEmptyPersonnel();
    Object.values(missionAssignments.value).forEach(personnel => {
      total = addPersonnel(total, personnel);
    });
    return total;
  }

  /**
   * Get wasted power summary for all assignments
   * @returns {Array} Array of { missionTag, wastedPower, wastedPercentage }
   */
  function getWastedPowerSummary() {
    const summary = [];
    
    FARM_MISSIONS.forEach(mission => {
      const personnel = getAssignment(mission.tag);
      if (getTotalPersonnel(personnel) > 0) {
        const waste = calculateWastedPower(
          mission,
          personnel,
          powerPerTier.value,
          missionSpeedMultiplier.value
        );
        if (waste.wastedPower > 0) {
          summary.push({
            missionTag: mission.tag,
            ...waste
          });
        }
      }
    });
    
    return summary;
  }

  /**
   * Get optimization suggestions
   * @returns {Array} Array of suggestions
   */
  function getOptimizationSuggestions() {
    const suggestions = [];
    
    FARM_MISSIONS.forEach(mission => {
      const suggestion = suggestOptimalTier(
        mission,
        powerPerTier.value,
        missionSpeedMultiplier.value
      );
      suggestions.push({
        missionTag: mission.tag,
        ...suggestion
      });
    });
    
    return suggestions;
  }

  // ============================================
  // FILL ORDER MANAGEMENT
  // ============================================

  /**
   * Get fill order for a mission
   * @param {string} missionTag - Mission identifier
   * @returns {number} Fill order priority (1-16, lower = higher priority)
   */
  function getFillOrder(missionTag) {
    return fillOrder.value[missionTag] || DEFAULT_FILL_ORDER[missionTag] || 999;
  }

  /**
   * Set fill order for a mission
   * Shifts other missions to make room (like inserting into a list)
   * Triggers auto-optimization after changing order
   * @param {string} missionTag - Mission identifier
   * @param {number} newOrder - New fill order priority (1-16)
   */
  function setFillOrder(missionTag, newOrder) {
    const currentOrder = getFillOrder(missionTag);
    
    // If setting to same value, do nothing
    if (currentOrder === newOrder) return;
    
    const newFillOrder = { ...fillOrder.value };
    
    if (newOrder > currentOrder) {
      // Moving DOWN (e.g., 7 → 9): Shift missions in between UP
      // Missions with order > currentOrder AND <= newOrder shift UP by 1
      FARM_MISSIONS.forEach(mission => {
        if (mission.tag === missionTag) return;
        const missionOrder = newFillOrder[mission.tag] || DEFAULT_FILL_ORDER[mission.tag] || 999;
        if (missionOrder > currentOrder && missionOrder <= newOrder) {
          newFillOrder[mission.tag] = missionOrder - 1;
        }
      });
      
      // Check campaign
      if (selectedCampaign.value) {
        if (campaignFillOrder.value > currentOrder && campaignFillOrder.value <= newOrder) {
          campaignFillOrder.value = campaignFillOrder.value - 1;
        }
      }
    } else {
      // Moving UP (e.g., 9 → 7): Shift missions in between DOWN
      // Missions with order >= newOrder AND < currentOrder shift DOWN by 1
      FARM_MISSIONS.forEach(mission => {
        if (mission.tag === missionTag) return;
        const missionOrder = newFillOrder[mission.tag] || DEFAULT_FILL_ORDER[mission.tag] || 999;
        if (missionOrder >= newOrder && missionOrder < currentOrder) {
          newFillOrder[mission.tag] = missionOrder + 1;
        }
      });
      
      // Check campaign
      if (selectedCampaign.value) {
        if (campaignFillOrder.value >= newOrder && campaignFillOrder.value < currentOrder) {
          campaignFillOrder.value = campaignFillOrder.value + 1;
        }
      }
    }
    
    // Set the new fill order for the target mission
    newFillOrder[missionTag] = newOrder;
    
    fillOrder.value = newFillOrder;
    
    // Auto-optimize after fill order changes
    optimizeAndApply();
  }

  /**
   * Swap fill order between two missions
   * Triggers auto-optimization after swapping
   * @param {string} missionTag1 - First mission
   * @param {string} missionTag2 - Second mission
   */
  function swapFillOrder(missionTag1, missionTag2) {
    const order1 = getFillOrder(missionTag1);
    const order2 = getFillOrder(missionTag2);
    
    fillOrder.value = {
      ...fillOrder.value,
      [missionTag1]: order2,
      [missionTag2]: order1
    };
    // Auto-optimize after fill order changes
    optimizeAndApply();
  }

  /**
   * Reset fill order to default
   */
  function resetFillOrder() {
    fillOrder.value = { ...DEFAULT_FILL_ORDER };
  }

  /**
   * Get all missions sorted by fill order
   * @returns {Array} Farm missions sorted by priority
   */
  function getMissionsByFillOrder() {
    return [...FARM_MISSIONS].sort((a, b) => {
      const orderA = getFillOrder(a.tag);
      const orderB = getFillOrder(b.tag);
      return orderA - orderB;
    });
  }

  /**
   * Export current configuration
   * @returns {Object} Export data
   */
  function exportConfig() {
    return {
      version: 1,
      timestamp: Date.now(),
      modifiers: { ...modifierValues.value },
      settings: { ...settings.value },
      assignments: { ...missionAssignments.value },
      manualMissions: { ...manualModeMissions.value },
      fillOrder: { ...fillOrder.value },
      selectedCampaign: selectedCampaign.value,
      campaignFillOrder: campaignFillOrder.value,
    };
  }

  /**
   * Import configuration
   * @param {Object} config - Configuration to import
   */
  function importConfig(config) {
    if (config.modifiers) {
      modifierValues.value = {
        ...getDefaultModifierValues(),
        ...config.modifiers,
      };
    }
    if (config.settings) {
      settings.value = {
        ...settings.value,
        ...config.settings,
      };
    }
    if (config.assignments) {
      missionAssignments.value = { ...config.assignments };
    }
    if (config.manualMissions) {
      manualModeMissions.value = { ...config.manualMissions };
    }
    if (config.fillOrder) {
      fillOrder.value = { ...config.fillOrder };
    }
    if (config.selectedCampaign !== undefined) {
      selectedCampaign.value = config.selectedCampaign;
    }
    if (config.campaignFillOrder !== undefined) {
      campaignFillOrder.value = config.campaignFillOrder;
    }
  }

  // ============================================
  // CAMPAIGN SELECTION ACTIONS
  // ============================================

  /**
   * Set the selected campaign for time calculation
   * @param {string|null} campaignTag - Campaign tag (e.g., 'C3-8') or null to clear
   */
  function setSelectedCampaign(campaignTag) {
    selectedCampaign.value = campaignTag;
    // Re-optimize when campaign selection changes
    optimizeAndApply();
  }

  /**
   * Clear the selected campaign
   */
  function clearSelectedCampaign() {
    selectedCampaign.value = null;
    optimizeAndApply();
  }

  /**
   * Set the fill order position for the selected campaign
   * Campaign participates in the same fill order system as farms (positions 1-17)
   * When campaign moves, farms shift accordingly
   * @param {number} position - Fill order position (1-17)
   */
  function setCampaignFillOrder(position) {
    const newPosition = Math.max(1, Math.min(17, position));
    const currentPosition = campaignFillOrder.value;
    
    // If setting to same value, do nothing
    if (currentPosition === newPosition) return;
    
    const newFillOrder = { ...fillOrder.value };
    
    // Campaign is part of the unified fill order system
    // When it moves, everything between old and new position shifts
    
    if (newPosition < currentPosition) {
      // Moving UP (e.g., 17 → 9 or 12 → 9): 
      // Everything at newPosition to currentPosition-1 shifts DOWN by 1
      FARM_MISSIONS.forEach(mission => {
        const missionOrder = newFillOrder[mission.tag] || DEFAULT_FILL_ORDER[mission.tag] || 999;
        if (missionOrder >= newPosition && missionOrder < currentPosition) {
          newFillOrder[mission.tag] = missionOrder + 1;
        }
      });
    } else {
      // Moving DOWN (e.g., 9 → 12): 
      // Everything at currentPosition+1 to newPosition shifts UP by 1
      FARM_MISSIONS.forEach(mission => {
        const missionOrder = newFillOrder[mission.tag] || DEFAULT_FILL_ORDER[mission.tag] || 999;
        if (missionOrder > currentPosition && missionOrder <= newPosition) {
          newFillOrder[mission.tag] = missionOrder - 1;
        }
      });
    }
    
    fillOrder.value = newFillOrder;
    campaignFillOrder.value = newPosition;
    
    optimizeAndApply();
  }

  /**
   * Calculate remaining personnel after the first N farms in fill order
   * Used by Campaigns tab to show what personnel would be available for campaigns
   * @param {number} fillOrderPosition - Position in fill order (1-17, campaigns would start here)
   * @returns {Object} Remaining personnel { T1, T2, T3, T4 }
   */
  function getPersonnelAtFillOrderPosition(fillOrderPosition) {
    // Start with all available personnel
    let remaining = clonePersonnel(availablePersonnel.value);
    
    // Get farms sorted by fill order
    const sortedFarms = FARM_MISSIONS.map(m => ({
      mission: m,
      order: fillOrder.value[m.tag] || 999,
    })).sort((a, b) => a.order - b.order);
    
    // Allocate personnel to farms that come BEFORE the specified position
    for (const { mission, order } of sortedFarms) {
      // Stop when we reach the campaign fill order position
      if (order >= fillOrderPosition) break;
      
      // Calculate minimal personnel needed for 2-second cap
      const powerNeeded = calculatePowerFor2SecondCap(mission.timeInMinutes, missionSpeedMultiplier.value);
      
      // Allocate minimal personnel for this farm
      let powerAllocated = 0;
      const tierOrder = ['T1', 'T2', 'T3', 'T4'];
      
      for (const tier of tierOrder) {
        if (powerAllocated >= powerNeeded) break;
        
        const tierPower = powerPerTier.value[tier] || 0;
        const availableCount = remaining[tier] || 0;
        const maxByCrewLimit = Math.min(availableCount, mission.maxCrew);
        
        // Calculate how many of this tier we need
        const powerStillNeeded = powerNeeded - powerAllocated;
        const countNeeded = Math.ceil(powerStillNeeded / tierPower);
        const toAllocate = Math.min(countNeeded, maxByCrewLimit);
        
        if (toAllocate > 0) {
          remaining[tier] -= toAllocate;
          powerAllocated += toAllocate * tierPower;
        }
      }
    }
    
    return remaining;
  }

  /**
   * Check if campaign manual mode is enabled
   */
  function isCampaignManualMode() {
    return campaignManualMode.value;
  }

  /**
   * Toggle campaign manual mode
   */
  function toggleCampaignManualMode() {
    campaignManualMode.value = !campaignManualMode.value;
    // Re-optimize when manual mode changes
    optimizeAndApply();
  }

  // ============================================
  // RELIC MANAGEMENT
  // ============================================

  /**
   * Set a relic level
   * @param {string} relicId - Relic ID (e.g., 'r1', 'r10')
   * @param {number} level - New level
   */
  function setRelicLevel(relicId, level) {
    const lvl = Math.max(0, parseInt(level) || 0);
    relicLevels.value[relicId] = lvl;
  }

  /**
   * Reset all relic levels to 0
   */
  function resetAllRelicLevels() {
    Object.keys(relicLevels.value).forEach(relicId => {
      relicLevels.value[relicId] = 0;
    });
  }

  /**
   * Update current fragments and reset the timestamp
   * @param {number} fragments - New fragment count
   */
  function setCurrentFragments(fragments) {
    currentFragments.value = Math.max(0, fragments);
    fragmentsLastUpdated.value = Date.now();
  }

  /**
   * Calculate fragments earned since last update based on frags/day rate
   * and add them to current fragments. Also updates hours in TR.
   * Updates the timestamp.
   * @returns {number} Fragments added
   */
  function updateFragmentsFromElapsedTime() {
    const now = Date.now();
    const lastUpdated = fragmentsLastUpdated.value || now;
    const elapsedMs = now - lastUpdated;
    
    // Calculate frags per day from current assignments
    const fragsPerHour = getTotalFarmFragsPerHour(missionAssignments.value);
    const fragsPerDay = fragsPerHour * 24;
    
    if (elapsedMs <= 0) {
      fragmentsLastUpdated.value = now;
      return 0;
    }
    
    // Convert elapsed time to hours and days
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const elapsedDays = elapsedHours / 24;
    
    // Update hours in TR (always, regardless of frags rate)
    currentHoursInTR.value = (currentHoursInTR.value || 0) + elapsedHours;
    
    // Calculate earned fragments (only if we have a rate)
    let earnedFragments = 0;
    if (fragsPerDay > 0) {
      earnedFragments = elapsedDays * fragsPerDay;
      currentFragments.value = (currentFragments.value || 0) + earnedFragments;
    }
    
    fragmentsLastUpdated.value = now;
    
    return earnedFragments;
  }

  /**
   * Purchase a relic level upgrade - deducts cost from current fragments
   * and increases the relic level
   * @param {string} relicId - Relic ID (e.g., 'r1')
   * @param {number} cost - Cost in fragments
   * @returns {boolean} Success status
   */
  function purchaseRelicLevel(relicId, cost) {
    const currentLevel = relicLevels.value[relicId] || 0;
    const newFragments = Math.max(0, (currentFragments.value || 0) - cost);
    
    // Deduct cost (or set to 0 if not enough)
    currentFragments.value = newFragments;
    fragmentsLastUpdated.value = Date.now();
    
    // Increase relic level
    relicLevels.value[relicId] = currentLevel + 1;
    
    // If target was at current level, increase it too
    if (relicTargetLevels.value[relicId] <= currentLevel) {
      relicTargetLevels.value[relicId] = currentLevel + 1;
    }
    
    console.log(`🔧 Purchased ${relicId} level ${currentLevel + 1}, cost: ${cost.toFixed(2)}, remaining: ${newFragments.toFixed(2)}`);
    
    return true;
  }

  /**
   * Get the effective fill order considering the campaign insertion
   * Returns an array of mission tags sorted by effective fill order
   */
  function getEffectiveFillOrder() {
    // Get farm missions sorted by their fill order
    const farms = FARM_MISSIONS.map(m => ({
      tag: m.tag,
      fillOrder: fillOrder.value[m.tag] || 999,
      isCampaign: false,
    })).sort((a, b) => a.fillOrder - b.fillOrder);

    // If no campaign selected, return farm order as-is
    if (!selectedCampaign.value) {
      return farms;
    }

    // Insert campaign at the specified position
    const insertPosition = campaignFillOrder.value - 1; // 0-indexed
    const campaign = {
      tag: selectedCampaign.value,
      fillOrder: campaignFillOrder.value,
      isCampaign: true,
    };

    // Insert campaign and shift farms down
    const result = [...farms];
    result.splice(insertPosition, 0, campaign);

    // Update effective fill orders
    return result.map((item, index) => ({
      ...item,
      effectiveFillOrder: index + 1,
    }));
  }

  /**
   * Get the selected campaign mission data with adjusted maxCrew (R11 bonus applied)
   */
  function getSelectedCampaignData() {
    if (!selectedCampaign.value) return null;
    const baseCampaign = CAMPAIGN_MISSIONS.find(m => m.tag === selectedCampaign.value);
    if (!baseCampaign) return null;
    
    // Apply R11 bonus to maxCrew
    const r11Multiplier = relicEffectsBreakdown.value.campaignMaxCrewMultiplier || 1;
    const adjustedMaxCrew = Math.floor(baseCampaign.maxCrew * r11Multiplier);
    
    return {
      ...baseCampaign,
      maxCrew: adjustedMaxCrew,
      baseMaxCrew: baseCampaign.maxCrew, // Keep original for reference
    };
  }

  /**
   * Calculate estimated time for the selected campaign
   * Based on actually assigned personnel (same as farms)
   */
  function getSelectedCampaignEstimatedTime() {
    const campaign = getSelectedCampaignData();
    if (!campaign) return null;

    // Get the actual assignment for this campaign
    const personnel = getAssignment(selectedCampaign.value);
    
    // Use getMissionStats for consistent calculation with farms
    const stats = getMissionStats(campaign, personnel);
    
    return {
      time: stats.completionTime,
      formatted: stats.completionTimeFormatted,
    };
  }

  /**
   * Initialize the store
   * Runs auto-optimization on startup
   */
  async function initialize() {
    try {
      isLoading.value = true;
      error.value = null;
      
      // Ensure defaults are applied for any missing modifiers
      const defaults = getDefaultModifierValues();
      modifierValues.value = {
        ...defaults,
        ...modifierValues.value,
      };
      
      // Auto-optimize on initialization
      optimizeAndApply();
      
      isLoading.value = false;
    } catch (err) {
      console.error('Failed to initialize mission planner store:', err);
      error.value = 'Failed to initialize. Please try again.';
      isLoading.value = false;
    }
  }

  // ============================================
  // BACKUP / RESTORE
  // ============================================
  
  /**
   * Export all persistent data for backup
   * @returns {Object} All persistent store data
   */
  function exportData() {
    return {
      modifierValues: JSON.parse(JSON.stringify(modifierValues.value)),
      settings: JSON.parse(JSON.stringify(settings.value)),
      missionAssignments: JSON.parse(JSON.stringify(missionAssignments.value)),
      manualModeMissions: JSON.parse(JSON.stringify(manualModeMissions.value)),
      fillOrder: JSON.parse(JSON.stringify(fillOrder.value)),
      selectedCampaign: selectedCampaign.value,
      relicLevels: JSON.parse(JSON.stringify(relicLevels.value)),
      relicTargetLevels: JSON.parse(JSON.stringify(relicTargetLevels.value)),
      currentFragments: currentFragments.value,
      fragmentsLastUpdated: fragmentsLastUpdated.value,
      currentHoursInTR: currentHoursInTR.value,
      campaignFillOrder: campaignFillOrder.value,
      campaignManualMode: campaignManualMode.value,
    };
  }

  /**
   * Import data from backup
   * @param {Object} data - Backup data to restore
   * @returns {boolean} Success status
   */
  function importData(data) {
    try {
      if (!data) {
        console.warn('No Mission Planner data to import');
        return false;
      }

      console.log('📥 Importing Mission Planner data...');

      if (data.modifierValues) {
        Object.assign(modifierValues.value, data.modifierValues);
      }
      if (data.settings) {
        Object.assign(settings.value, data.settings);
      }
      if (data.missionAssignments) {
        Object.assign(missionAssignments.value, data.missionAssignments);
      }
      if (data.manualModeMissions) {
        Object.assign(manualModeMissions.value, data.manualModeMissions);
      }
      if (data.fillOrder) {
        Object.assign(fillOrder.value, data.fillOrder);
      }
      if (data.selectedCampaign !== undefined) {
        selectedCampaign.value = data.selectedCampaign;
      }
      if (data.relicLevels) {
        Object.assign(relicLevels.value, data.relicLevels);
      }
      if (data.relicTargetLevels) {
        Object.assign(relicTargetLevels.value, data.relicTargetLevels);
      }
      if (data.currentFragments !== undefined) {
        currentFragments.value = data.currentFragments;
      }
      if (data.fragmentsLastUpdated !== undefined) {
        fragmentsLastUpdated.value = data.fragmentsLastUpdated;
      }
      if (data.currentHoursInTR !== undefined) {
        currentHoursInTR.value = data.currentHoursInTR;
      }
      if (data.campaignFillOrder !== undefined) {
        campaignFillOrder.value = data.campaignFillOrder;
      }
      if (data.campaignManualMode !== undefined) {
        campaignManualMode.value = data.campaignManualMode;
      }

      console.log('✅ Mission Planner data imported successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to import Mission Planner data:', error);
      return false;
    }
  }

  // ============================================
  // INSCRYPTION COST-BENEFIT ANALYSIS
  // ============================================

  /**
   * Calculate hypothetical farm stats with modified inscryption level
   * @param {string} inscryptionId - The inscryption modifier ID (e.g., 'inscryption_106')
   * @param {number} levelDelta - How much to change the level (+1 typically)
   * @returns {Object} { currentFragsPerHour, newFragsPerHour, deltaFragsPerHour, deltaFragsPerDay }
   */
  function calculateInscryptionBenefit(inscryptionId, levelDelta = 1) {
    // Create modified inscryption levels with the change
    const currentLevels = {
      inscryption_58: modifierValues.value?.inscryption_58 || 0,
      inscryption_102: modifierValues.value?.inscryption_102 || 0,
      inscryption_106: modifierValues.value?.inscryption_106 || 0,
      inscryption_107: modifierValues.value?.inscryption_107 || 0,
      inscryption_108: modifierValues.value?.inscryption_108 || 0,
      inscryption_109: modifierValues.value?.inscryption_109 || 0,
      inscryption_110: modifierValues.value?.inscryption_110 || 0,
    };
    
    const newLevels = { ...currentLevels };
    newLevels[inscryptionId] = (newLevels[inscryptionId] || 0) + levelDelta;
    
    // Get current inscryption effects
    const currentInscryptionEffects = getInscryptionEffectsBreakdown(currentLevels);
    const newInscryptionEffects = getInscryptionEffectsBreakdown(newLevels);
    
    // Calculate current personnel power with current inscryption
    const basePersonnel = personnelStats.value;
    const loopmod = loopmodEffectsBreakdown.value;
    const research = researchEffectsBreakdown.value;
    const gem = gemEffectsBreakdown.value;
    
    // For I58 (headstart), we need to recalculate loopmod effects with new headstart bonus
    // This affects personnel counts via headstart loopmods
    let currentLoopmodEffects = loopmod;
    let newLoopmodEffects = loopmod;
    let currentAvailablePersonnel = availablePersonnel.value;
    let newAvailablePersonnel = availablePersonnel.value;
    
    if (inscryptionId === 'inscryption_58') {
      const plusUltima = modifierValues.value?.plus_ultima || 0;
      const mpThreshold = modifierValues.value?.mp || 0;
      
      // Current loopmod bonuses (with current headstart)
      const currentLoopmodBonuses = {
        'ultima_productivity': plusUltima,
        'ultima_swarm': plusUltima,
        't1_headstart': currentInscryptionEffects.headstartMaxLevelBonus,
        't2_headstart': currentInscryptionEffects.headstartMaxLevelBonus,
        't3_headstart': currentInscryptionEffects.headstartMaxLevelBonus,
        't4_headstart': currentInscryptionEffects.headstartMaxLevelBonus,
        't_all_headstart': currentInscryptionEffects.headstartMaxLevelBonus,
      };
      
      // New loopmod bonuses (with new headstart)
      const newLoopmodBonuses = {
        'ultima_productivity': plusUltima,
        'ultima_swarm': plusUltima,
        't1_headstart': newInscryptionEffects.headstartMaxLevelBonus,
        't2_headstart': newInscryptionEffects.headstartMaxLevelBonus,
        't3_headstart': newInscryptionEffects.headstartMaxLevelBonus,
        't4_headstart': newInscryptionEffects.headstartMaxLevelBonus,
        't_all_headstart': newInscryptionEffects.headstartMaxLevelBonus,
      };
      
      // Recalculate loopmod effects with respective bonuses
      currentLoopmodEffects = getLoopmodEffectsBreakdown(mpThreshold, currentLoopmodBonuses, boonModifiers.value);
      newLoopmodEffects = getLoopmodEffectsBreakdown(mpThreshold, newLoopmodBonuses, boonModifiers.value);
      
      // Calculate personnel counts with respective loopmod effects
      currentAvailablePersonnel = {
        T1: basePersonnel.t1.count + currentLoopmodEffects.countBonuses.T1 + research.personnelBonuses.T1 + gem.personnelBonuses.T1,
        T2: basePersonnel.t2.count + currentLoopmodEffects.countBonuses.T2 + research.personnelBonuses.T2 + gem.personnelBonuses.T2,
        T3: basePersonnel.t3.count + currentLoopmodEffects.countBonuses.T3 + research.personnelBonuses.T3 + gem.personnelBonuses.T3,
        T4: basePersonnel.t4.count + currentLoopmodEffects.countBonuses.T4 + research.personnelBonuses.T4 + gem.personnelBonuses.T4,
      };
      
      newAvailablePersonnel = {
        T1: basePersonnel.t1.count + newLoopmodEffects.countBonuses.T1 + research.personnelBonuses.T1 + gem.personnelBonuses.T1,
        T2: basePersonnel.t2.count + newLoopmodEffects.countBonuses.T2 + research.personnelBonuses.T2 + gem.personnelBonuses.T2,
        T3: basePersonnel.t3.count + newLoopmodEffects.countBonuses.T3 + research.personnelBonuses.T3 + gem.personnelBonuses.T3,
        T4: basePersonnel.t4.count + newLoopmodEffects.countBonuses.T4 + research.personnelBonuses.T4 + gem.personnelBonuses.T4,
      };
    }
    
    // Current power per tier
    const currentPowerPerTier = {
      T1: basePersonnel.t1.powerPerUnit + currentLoopmodEffects.powerBonuses.T1 + currentInscryptionEffects.personnelPowerBonuses.T1 + gem.powerBonuses.T1,
      T2: basePersonnel.t2.powerPerUnit + currentLoopmodEffects.powerBonuses.T2 + currentInscryptionEffects.personnelPowerBonuses.T2 + gem.powerBonuses.T2,
      T3: basePersonnel.t3.powerPerUnit + currentLoopmodEffects.powerBonuses.T3 + currentInscryptionEffects.personnelPowerBonuses.T3 + gem.powerBonuses.T3,
      T4: basePersonnel.t4.powerPerUnit + currentLoopmodEffects.powerBonuses.T4 + currentInscryptionEffects.personnelPowerBonuses.T4 + gem.powerBonuses.T4,
    };
    
    // New power per tier with upgraded inscryption
    const newPowerPerTier = {
      T1: basePersonnel.t1.powerPerUnit + newLoopmodEffects.powerBonuses.T1 + newInscryptionEffects.personnelPowerBonuses.T1 + gem.powerBonuses.T1,
      T2: basePersonnel.t2.powerPerUnit + newLoopmodEffects.powerBonuses.T2 + newInscryptionEffects.personnelPowerBonuses.T2 + gem.powerBonuses.T2,
      T3: basePersonnel.t3.powerPerUnit + newLoopmodEffects.powerBonuses.T3 + newInscryptionEffects.personnelPowerBonuses.T3 + gem.powerBonuses.T3,
      T4: basePersonnel.t4.powerPerUnit + newLoopmodEffects.powerBonuses.T4 + newInscryptionEffects.personnelPowerBonuses.T4 + gem.powerBonuses.T4,
    };
    
    // Calculate farm frags value with current vs new inscryption
    const baseFragValue = 0.001;
    const currentLoopmodMult = currentLoopmodEffects.farmFragsMultiplier;
    const newLoopmodMult = newLoopmodEffects.farmFragsMultiplier;
    const researchMult = researchEffectsBreakdown.value.farmFragsBonuses.multiplier;
    const badgeMult = badgeEffectsBreakdown.value.farmFragsMultiplier;
    const otherMult = otherEffectsBreakdown.value.farmFragsMultiplier;
    const gemMult = gem.farmFragsMultiplier;
    
    const researchAdd = researchEffectsBreakdown.value.farmFragsBonuses.additive;
    const relicAdd = relicEffectsBreakdown.value.farmFragsAdditive;
    const gadgetAdd = gadgetEffectsBreakdown.value.farmFragsAdditive;
    const gemAdd = gem.farmFragsAdditive;
    
    // Current farm frags
    const currentMultiplier = currentLoopmodMult * researchMult * badgeMult * currentInscryptionEffects.farmFragsMultiplier * otherMult * gemMult;
    const currentAdditive = researchAdd + relicAdd + currentInscryptionEffects.farmFragsAdditive + gadgetAdd + gemAdd;
    const currentFarmFragsValue = (baseFragValue + currentAdditive) * currentMultiplier;
    
    // New farm frags with upgraded inscryption
    const newMultiplier = newLoopmodMult * researchMult * badgeMult * newInscryptionEffects.farmFragsMultiplier * otherMult * gemMult;
    const newAdditive = researchAdd + relicAdd + newInscryptionEffects.farmFragsAdditive + gadgetAdd + gemAdd;
    const newFarmFragsValue = (baseFragValue + newAdditive) * newMultiplier;
    
    // Run optimization with current values
    const currentOptResult = optimizeFarmMissions({
      available: currentAvailablePersonnel,
      powerPerTier: currentPowerPerTier,
      missionSpeedMultiplier: missionSpeedMultiplier.value,
      baseFarmFrags: currentFarmFragsValue,
      manualAssignments: getManualAssignments(),
      fillOrder: fillOrder.value,
      campaign: null // Don't consider campaign for this calculation
    });
    
    // Calculate current frags per hour
    const currentStats = calculateFarmMissionStats(
      currentOptResult.assignments,
      currentPowerPerTier,
      missionSpeedMultiplier.value,
      currentFarmFragsValue
    );
    
    // Run optimization with new inscryption values
    const newOptResult = optimizeFarmMissions({
      available: newAvailablePersonnel,
      powerPerTier: newPowerPerTier,
      missionSpeedMultiplier: missionSpeedMultiplier.value,
      baseFarmFrags: newFarmFragsValue,
      manualAssignments: getManualAssignments(),
      fillOrder: fillOrder.value,
      campaign: null
    });
    
    // Calculate new frags per hour
    const newStats = calculateFarmMissionStats(
      newOptResult.assignments,
      newPowerPerTier,
      missionSpeedMultiplier.value,
      newFarmFragsValue
    );
    
    const currentFragsPerHour = currentStats.totalFragsPerHour;
    const newFragsPerHour = newStats.totalFragsPerHour;
    const deltaFragsPerHour = newFragsPerHour - currentFragsPerHour;
    const deltaFragsPerDay = deltaFragsPerHour * 24;
    
    return {
      currentFragsPerHour,
      newFragsPerHour,
      deltaFragsPerHour,
      deltaFragsPerDay
    };
  }

  /**
   * Calculate cost-benefit ratio for an inscryption upgrade
   * @param {string} inscryptionId - The inscryption modifier ID
   * @param {number} cost - The cost for the next level
   * @returns {Object} { deltaFragsPerDay, cost, daysToROI, efficiency }
   */
  function getInscryptionCostBenefit(inscryptionId, cost) {
    const benefit = calculateInscryptionBenefit(inscryptionId, 1);
    
    // Calculate days to ROI (Return on Investment)
    // How many days of farming to earn back the cost
    let daysToROI = null;
    let efficiency = null;
    
    if (benefit.deltaFragsPerDay > 0 && cost > 0) {
      daysToROI = cost / benefit.deltaFragsPerDay;
      // Efficiency = frags gained per unit cost (higher is better)
      efficiency = benefit.deltaFragsPerDay / cost;
    }
    
    return {
      currentFragsPerHour: benefit.currentFragsPerHour,
      newFragsPerHour: benefit.newFragsPerHour,
      deltaFragsPerHour: benefit.deltaFragsPerHour,
      deltaFragsPerDay: benefit.deltaFragsPerDay,
      cost,
      daysToROI,
      efficiency
    };
  }

  // ============================================
  // RELIC COST-BENEFIT ANALYSIS
  // ============================================

  /**
   * Calculate hypothetical farm stats with modified relic level
   * Only for relics that affect farm frags: R3 (mission speed), R5 (farm frags additive), T2R8
   * @param {string} relicId - The relic modifier ID (e.g., 'relic_3', 'relic_5', 't2r8')
   * @param {number} levelDelta - How much to change the level (+1 typically)
   * @returns {Object} { currentFragsPerHour, newFragsPerHour, deltaFragsPerHour, deltaFragsPerDay }
   */
  function calculateRelicBenefit(relicId, levelDelta = 1) {
    // Map modifier IDs to internal relic IDs
    const relicMapping = {
      'relic_3': 'r3',
      'relic_5': 'r5',
      't2r8': 't2r8',
    };
    
    const internalRelicId = relicMapping[relicId] || relicId;
    
    // Only calculate for relics that affect farm frags (R6 and R11 are campaign only)
    const farmAffectingRelics = ['r3', 'r5', 't2r8'];
    if (!farmAffectingRelics.includes(internalRelicId)) {
      return { currentFragsPerHour: 0, newFragsPerHour: 0, deltaFragsPerHour: 0, deltaFragsPerDay: 0 };
    }
    
    // Get current relic levels
    const currentRelicLevels = {
      relic_3: modifierValues.value?.relic_3 || 0,
      relic_5: modifierValues.value?.relic_5 || 0,
      t2r8: modifierValues.value?.t2r8 || 0,
    };
    
    // Create new levels with the delta
    const newRelicLevels = { ...currentRelicLevels };
    newRelicLevels[relicId] = (newRelicLevels[relicId] || 0) + levelDelta;
    
    // Get relic effects for both
    const currentRelicEffects = getRelicEffectsBreakdown(currentRelicLevels);
    const newRelicEffects = getRelicEffectsBreakdown(newRelicLevels);
    
    // Get other effects
    const basePersonnel = personnelStats.value;
    const loopmod = loopmodEffectsBreakdown.value;
    const inscryption = inscryptionEffectsBreakdown.value;
    const gem = gemEffectsBreakdown.value;
    const badge = badgeEffectsBreakdown.value;
    const research = researchEffectsBreakdown.value;
    
    // Power per tier (doesn't change with relics currently, but keep structure for consistency)
    const powerPerTier = {
      T1: basePersonnel.t1.powerPerUnit + loopmod.powerBonuses.T1 + inscryption.personnelPowerBonuses.T1 + gem.powerBonuses.T1,
      T2: basePersonnel.t2.powerPerUnit + loopmod.powerBonuses.T2 + inscryption.personnelPowerBonuses.T2 + gem.powerBonuses.T2,
      T3: basePersonnel.t3.powerPerUnit + loopmod.powerBonuses.T3 + inscryption.personnelPowerBonuses.T3 + gem.powerBonuses.T3,
      T4: basePersonnel.t4.powerPerUnit + loopmod.powerBonuses.T4 + inscryption.personnelPowerBonuses.T4 + gem.powerBonuses.T4,
    };
    
    // Calculate farm frags value
    const baseFragValue = 0.001;
    const loopmodMult = loopmod.farmFragsMultiplier;
    const researchMult = research.farmFragsBonuses.multiplier;
    const badgeMult = badge.farmFragsMultiplier;
    const otherMult = otherEffectsBreakdown.value.farmFragsMultiplier;
    const gemMult = gem.farmFragsMultiplier;
    const inscryptionMult = inscryption.farmFragsMultiplier;
    
    const researchAdd = research.farmFragsBonuses.additive;
    const gadgetAdd = gadgetEffectsBreakdown.value.farmFragsAdditive;
    const gemAdd = gem.farmFragsAdditive;
    const inscryptionAdd = inscryption.farmFragsAdditive;
    
    // Current farm frags (with current relic effects)
    const currentAllFragsMult = currentRelicEffects.allFragmentsMultiplier || 1;
    const currentMultiplier = loopmodMult * researchMult * badgeMult * inscryptionMult * otherMult * gemMult * currentAllFragsMult;
    const currentAdditive = researchAdd + currentRelicEffects.farmFragsAdditive + inscryptionAdd + gadgetAdd + gemAdd;
    const currentFarmFragsValue = (baseFragValue + currentAdditive) * currentMultiplier;
    
    // Calculate current mission speed (need to build it from components to isolate relic effect)
    const loopmodSpeed = loopmod.missionSpeedMultiplier || 1;
    const researchSpeed = research.missionSpeedMultiplier || 1;
    const badgeSpeed = badge.missionSpeedMultiplier || 1;
    const currentMissionSpeed = loopmodSpeed * researchSpeed * currentRelicEffects.missionSpeedMultiplier * badgeSpeed;
    
    // New farm frags (with new relic effects)
    const newAllFragsMult = newRelicEffects.allFragmentsMultiplier || 1;
    const newMultiplier = loopmodMult * researchMult * badgeMult * inscryptionMult * otherMult * gemMult * newAllFragsMult;
    const newAdditive = researchAdd + newRelicEffects.farmFragsAdditive + inscryptionAdd + gadgetAdd + gemAdd;
    const newFarmFragsValue = (baseFragValue + newAdditive) * newMultiplier;
    
    // Calculate new mission speed (with new relic effects)
    const newMissionSpeed = loopmodSpeed * researchSpeed * newRelicEffects.missionSpeedMultiplier * badgeSpeed;
    
    // Run optimization with current values
    const currentOptResult = optimizeFarmMissions({
      available: availablePersonnel.value,
      powerPerTier: powerPerTier,
      missionSpeedMultiplier: currentMissionSpeed,
      baseFarmFrags: currentFarmFragsValue,
      manualAssignments: getManualAssignments(),
      fillOrder: fillOrder.value,
      campaign: null
    });
    
    // Calculate current frags per hour
    const currentStats = calculateFarmMissionStats(
      currentOptResult.assignments,
      powerPerTier,
      currentMissionSpeed,
      currentFarmFragsValue
    );
    
    // Run optimization with new relic values
    const newOptResult = optimizeFarmMissions({
      available: availablePersonnel.value,
      powerPerTier: powerPerTier,
      missionSpeedMultiplier: newMissionSpeed,
      baseFarmFrags: newFarmFragsValue,
      manualAssignments: getManualAssignments(),
      fillOrder: fillOrder.value,
      campaign: null
    });
    
    // Calculate new frags per hour
    const newStats = calculateFarmMissionStats(
      newOptResult.assignments,
      powerPerTier,
      newMissionSpeed,
      newFarmFragsValue
    );
    
    const currentFragsPerHour = currentStats.totalFragsPerHour;
    const newFragsPerHour = newStats.totalFragsPerHour;
    const deltaFragsPerHour = newFragsPerHour - currentFragsPerHour;
    const deltaFragsPerDay = deltaFragsPerHour * 24;
    
    return {
      currentFragsPerHour,
      newFragsPerHour,
      deltaFragsPerHour,
      deltaFragsPerDay
    };
  }

  /**
   * Calculate cost-benefit ratio for a relic upgrade
   * @param {string} relicId - The relic modifier ID (e.g., 'relic_3', 'relic_5')
   * @param {number} cost - The cost for the next level
   * @returns {Object} { deltaFragsPerDay, cost, daysToROI, efficiency }
   */
  function getRelicCostBenefit(relicId, cost) {
    // Skip if cost is 0 or invalid (formula not available yet)
    if (!cost || cost <= 0 || cost === Infinity) {
      return null;
    }
    
    const benefit = calculateRelicBenefit(relicId, 1);
    
    // Calculate days to ROI (Return on Investment)
    let daysToROI = null;
    let efficiency = null;
    
    if (benefit.deltaFragsPerDay > 0 && cost > 0) {
      daysToROI = cost / benefit.deltaFragsPerDay;
      efficiency = benefit.deltaFragsPerDay / cost;
    }
    
    return {
      currentFragsPerHour: benefit.currentFragsPerHour,
      newFragsPerHour: benefit.newFragsPerHour,
      deltaFragsPerHour: benefit.deltaFragsPerHour,
      deltaFragsPerDay: benefit.deltaFragsPerDay,
      cost,
      daysToROI,
      efficiency
    };
  }

  /**
   * Calculate hypothetical farm stats with modified gadget level
   * Only for Local Fragment Magnet (G12) which affects farm frags
   * @param {string} gadgetId - The gadget modifier ID (e.g., 'local_fragment_magnet')
   * @param {number} levelDelta - How much to change the level (+1 or +10 typically)
   * @returns {Object} { currentFragsPerHour, newFragsPerHour, deltaFragsPerHour, deltaFragsPerDay }
   */
  function calculateGadgetBenefit(gadgetId, levelDelta = 1) {
    // Only calculate for Local Fragment Magnet (affects farm frags)
    if (gadgetId !== 'local_fragment_magnet') {
      return { currentFragsPerHour: 0, newFragsPerHour: 0, deltaFragsPerHour: 0, deltaFragsPerDay: 0 };
    }
    
    // Get current gadget levels
    const currentGadgetLevels = {
      local_fragment_magnet: modifierValues.value?.local_fragment_magnet || 0,
      galactic_fragment_magnet: modifierValues.value?.galactic_fragment_magnet || 0,
    };
    
    // Create new levels with the delta
    const newGadgetLevels = { ...currentGadgetLevels };
    newGadgetLevels[gadgetId] = (newGadgetLevels[gadgetId] || 0) + levelDelta;
    
    // Get gadget effects for both
    const currentGadgetEffects = getGadgetEffectsBreakdown(currentGadgetLevels);
    const newGadgetEffects = getGadgetEffectsBreakdown(newGadgetLevels);
    
    // Get other effects
    const basePersonnel = personnelStats.value;
    const loopmod = loopmodEffectsBreakdown.value;
    const inscryption = inscryptionEffectsBreakdown.value;
    const gem = gemEffectsBreakdown.value;
    const research = researchEffectsBreakdown.value;
    const relic = relicEffectsBreakdown.value;
    const badge = badgeEffectsBreakdown.value;
    const other = otherEffectsBreakdown.value;
    
    // Power per tier (doesn't change with gadgets)
    const powerPerTier = {
      T1: basePersonnel.t1.powerPerUnit + loopmod.powerBonuses.T1 + inscryption.personnelPowerBonuses.T1 + gem.powerBonuses.T1,
      T2: basePersonnel.t2.powerPerUnit + loopmod.powerBonuses.T2 + inscryption.personnelPowerBonuses.T2 + gem.powerBonuses.T2,
      T3: basePersonnel.t3.powerPerUnit + loopmod.powerBonuses.T3 + inscryption.personnelPowerBonuses.T3 + gem.powerBonuses.T3,
      T4: basePersonnel.t4.powerPerUnit + loopmod.powerBonuses.T4 + inscryption.personnelPowerBonuses.T4 + gem.powerBonuses.T4,
    };
    
    // Calculate farm frags value
    const baseFragValue = 0.001;
    const loopmodMult = loopmod.farmFragsMultiplier;
    const researchMult = research.farmFragsBonuses.multiplier;
    const badgeMult = badge.farmFragsMultiplier;
    const otherMult = other.farmFragsMultiplier;
    const gemMult = gem.farmFragsMultiplier;
    const inscryptionMult = inscryption.farmFragsMultiplier;
    const relicAllFragsMult = relic.allFragmentsMultiplier || 1;
    
    const multiplier = loopmodMult * researchMult * badgeMult * inscryptionMult * otherMult * gemMult * relicAllFragsMult;
    
    const researchAdd = research.farmFragsBonuses.additive;
    const relicAdd = relic.farmFragsAdditive;
    const inscryptionAdd = inscryption.farmFragsAdditive;
    const gemAdd = gem.farmFragsAdditive;
    
    // Current farm frags (with current gadget additive)
    const currentAdditive = researchAdd + relicAdd + inscryptionAdd + gemAdd + currentGadgetEffects.farmFragsAdditive;
    const currentFarmFragsValue = (baseFragValue + currentAdditive) * multiplier;
    
    // New farm frags (with new gadget additive)
    const newAdditive = researchAdd + relicAdd + inscryptionAdd + gemAdd + newGadgetEffects.farmFragsAdditive;
    const newFarmFragsValue = (baseFragValue + newAdditive) * multiplier;
    
    // Run optimization with current values
    const currentOptResult = optimizeFarmMissions({
      available: availablePersonnel.value,
      powerPerTier: powerPerTier,
      missionSpeedMultiplier: missionSpeedMultiplier.value,
      baseFarmFrags: currentFarmFragsValue,
      manualAssignments: getManualAssignments(),
      fillOrder: fillOrder.value,
      campaign: null
    });
    
    // Calculate current frags per hour
    const currentStats = calculateFarmMissionStats(
      currentOptResult.assignments,
      powerPerTier,
      missionSpeedMultiplier.value,
      currentFarmFragsValue
    );
    
    // Run optimization with new gadget values
    const newOptResult = optimizeFarmMissions({
      available: availablePersonnel.value,
      powerPerTier: powerPerTier,
      missionSpeedMultiplier: missionSpeedMultiplier.value,
      baseFarmFrags: newFarmFragsValue,
      manualAssignments: getManualAssignments(),
      fillOrder: fillOrder.value,
      campaign: null
    });
    
    // Calculate new frags per hour
    const newStats = calculateFarmMissionStats(
      newOptResult.assignments,
      powerPerTier,
      missionSpeedMultiplier.value,
      newFarmFragsValue
    );
    
    const currentFragsPerHour = currentStats.totalFragsPerHour;
    const newFragsPerHour = newStats.totalFragsPerHour;
    const deltaFragsPerHour = newFragsPerHour - currentFragsPerHour;
    const deltaFragsPerDay = deltaFragsPerHour * 24;
    
    return {
      currentFragsPerHour,
      newFragsPerHour,
      deltaFragsPerHour,
      deltaFragsPerDay
    };
  }

  /**
   * Calculate cost-benefit ratio for a gadget upgrade
   * @param {string} gadgetId - The gadget modifier ID (e.g., 'local_fragment_magnet')
   * @param {number} cost - The cost for the upgrade
   * @param {number} levelDelta - How many levels to upgrade (+1 or +10)
   * @returns {Object} { deltaFragsPerDay, cost, daysToROI, efficiency }
   */
  function getGadgetCostBenefit(gadgetId, cost, levelDelta = 1) {
    // Skip if cost is 0 or invalid
    if (!cost || cost <= 0 || cost === Infinity) {
      return null;
    }
    
    const benefit = calculateGadgetBenefit(gadgetId, levelDelta);
    
    // Calculate days to ROI (Return on Investment)
    let daysToROI = null;
    let efficiency = null;
    
    if (benefit.deltaFragsPerDay > 0 && cost > 0) {
      daysToROI = cost / benefit.deltaFragsPerDay;
      efficiency = benefit.deltaFragsPerDay / cost;
    }
    
    return {
      currentFragsPerHour: benefit.currentFragsPerHour,
      newFragsPerHour: benefit.newFragsPerHour,
      deltaFragsPerHour: benefit.deltaFragsPerHour,
      deltaFragsPerDay: benefit.deltaFragsPerDay,
      cost,
      daysToROI,
      efficiency,
      levelDelta
    };
  }

  /**
   * Calculate hypothetical farm stats with modified +Ultima level
   * +Ultima increases max level of ultima_productivity and ultima_swarm loopmods
   * But only if the new loopmod levels are affordable with current MP!
   * @param {number} levelDelta - How much to change +Ultima (+1 typically)
   * @returns {Object} { currentFragsPerHour, newFragsPerHour, deltaFragsPerHour, deltaFragsPerDay, canAfford, newLoopmodLevels }
   */
  function calculatePlusUltimaBenefit(levelDelta = 1) {
    const currentPlusUltima = modifierValues.value?.plus_ultima || 0;
    const newPlusUltima = currentPlusUltima + levelDelta;
    const mpThreshold = modifierValues.value?.mp || 0;
    const inscryptionEffects = inscryptionEffectsBreakdown.value;
    
    // Current loopmod bonuses
    const currentLoopmodBonuses = {
      'ultima_productivity': currentPlusUltima,
      'ultima_swarm': currentPlusUltima,
      't1_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't2_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't3_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't4_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't_all_headstart': inscryptionEffects.headstartMaxLevelBonus,
    };
    
    // New loopmod bonuses (with increased +Ultima)
    const newLoopmodBonuses = {
      'ultima_productivity': newPlusUltima,
      'ultima_swarm': newPlusUltima,
      't1_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't2_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't3_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't4_headstart': inscryptionEffects.headstartMaxLevelBonus,
      't_all_headstart': inscryptionEffects.headstartMaxLevelBonus,
    };
    
    // Calculate loopmod effects with current and new +Ultima
    // The MP threshold determines which loopmod levels are actually reachable
    const currentLoopmodEffects = getLoopmodEffectsBreakdown(mpThreshold, currentLoopmodBonuses, boonModifiers.value);
    const newLoopmodEffects = getLoopmodEffectsBreakdown(mpThreshold, newLoopmodBonuses, boonModifiers.value);
    
    // Check what actually changed - if nothing changed, the new levels aren't affordable
    const currentProductivityLevel = currentLoopmodEffects.loopmodLevels?.ultima_productivity || 0;
    const currentSwarmLevel = currentLoopmodEffects.loopmodLevels?.ultima_swarm || 0;
    const newProductivityLevel = newLoopmodEffects.loopmodLevels?.ultima_productivity || 0;
    const newSwarmLevel = newLoopmodEffects.loopmodLevels?.ultima_swarm || 0;
    
    // Can we actually afford any new levels?
    const canAffordNewLevels = (newProductivityLevel > currentProductivityLevel) || (newSwarmLevel > currentSwarmLevel);
    
    // Get other effects (unchanged by +Ultima)
    const basePersonnel = personnelStats.value;
    const inscryption = inscryptionEffectsBreakdown.value;
    const gem = gemEffectsBreakdown.value;
    const research = researchEffectsBreakdown.value;
    const relic = relicEffectsBreakdown.value;
    const badge = badgeEffectsBreakdown.value;
    const other = otherEffectsBreakdown.value;
    const gadget = gadgetEffectsBreakdown.value;
    
    // Calculate personnel counts with current vs new loopmod effects
    // ultima_productivity affects personnel count
    const currentAvailablePersonnel = {
      T1: basePersonnel.t1.count + currentLoopmodEffects.countBonuses.T1 + research.personnelBonuses.T1 + gem.personnelBonuses.T1,
      T2: basePersonnel.t2.count + currentLoopmodEffects.countBonuses.T2 + research.personnelBonuses.T2 + gem.personnelBonuses.T2,
      T3: basePersonnel.t3.count + currentLoopmodEffects.countBonuses.T3 + research.personnelBonuses.T3 + gem.personnelBonuses.T3,
      T4: basePersonnel.t4.count + currentLoopmodEffects.countBonuses.T4 + research.personnelBonuses.T4 + gem.personnelBonuses.T4,
    };
    
    const newAvailablePersonnel = {
      T1: basePersonnel.t1.count + newLoopmodEffects.countBonuses.T1 + research.personnelBonuses.T1 + gem.personnelBonuses.T1,
      T2: basePersonnel.t2.count + newLoopmodEffects.countBonuses.T2 + research.personnelBonuses.T2 + gem.personnelBonuses.T2,
      T3: basePersonnel.t3.count + newLoopmodEffects.countBonuses.T3 + research.personnelBonuses.T3 + gem.personnelBonuses.T3,
      T4: basePersonnel.t4.count + newLoopmodEffects.countBonuses.T4 + research.personnelBonuses.T4 + gem.personnelBonuses.T4,
    };
    
    // Power per tier (loopmod power bonuses are unchanged by +Ultima, but include them for consistency)
    const currentPowerPerTier = {
      T1: basePersonnel.t1.powerPerUnit + currentLoopmodEffects.powerBonuses.T1 + inscryption.personnelPowerBonuses.T1 + gem.powerBonuses.T1,
      T2: basePersonnel.t2.powerPerUnit + currentLoopmodEffects.powerBonuses.T2 + inscryption.personnelPowerBonuses.T2 + gem.powerBonuses.T2,
      T3: basePersonnel.t3.powerPerUnit + currentLoopmodEffects.powerBonuses.T3 + inscryption.personnelPowerBonuses.T3 + gem.powerBonuses.T3,
      T4: basePersonnel.t4.powerPerUnit + currentLoopmodEffects.powerBonuses.T4 + inscryption.personnelPowerBonuses.T4 + gem.powerBonuses.T4,
    };
    
    const newPowerPerTier = {
      T1: basePersonnel.t1.powerPerUnit + newLoopmodEffects.powerBonuses.T1 + inscryption.personnelPowerBonuses.T1 + gem.powerBonuses.T1,
      T2: basePersonnel.t2.powerPerUnit + newLoopmodEffects.powerBonuses.T2 + inscryption.personnelPowerBonuses.T2 + gem.powerBonuses.T2,
      T3: basePersonnel.t3.powerPerUnit + newLoopmodEffects.powerBonuses.T3 + inscryption.personnelPowerBonuses.T3 + gem.powerBonuses.T3,
      T4: basePersonnel.t4.powerPerUnit + newLoopmodEffects.powerBonuses.T4 + inscryption.personnelPowerBonuses.T4 + gem.powerBonuses.T4,
    };
    
    // Calculate mission speed with current vs new loopmod effects
    const currentMissionSpeed = currentLoopmodEffects.missionSpeedMultiplier * research.missionSpeedMultiplier * relic.missionSpeedMultiplier * badge.missionSpeedMultiplier;
    const newMissionSpeed = newLoopmodEffects.missionSpeedMultiplier * research.missionSpeedMultiplier * relic.missionSpeedMultiplier * badge.missionSpeedMultiplier;
    
    // Calculate farm frags value (unchanged by +Ultima directly)
    const baseFragValue = 0.001;
    const relicAllFragsMult = relic.allFragmentsMultiplier || 1;
    const multiplier = currentLoopmodEffects.farmFragsMultiplier * research.farmFragsBonuses.multiplier * badge.farmFragsMultiplier * inscryption.farmFragsMultiplier * other.farmFragsMultiplier * gem.farmFragsMultiplier * relicAllFragsMult;
    const additive = research.farmFragsBonuses.additive + relic.farmFragsAdditive + inscryption.farmFragsAdditive + gadget.farmFragsAdditive + gem.farmFragsAdditive;
    const farmFragsValue = (baseFragValue + additive) * multiplier;
    
    // Run optimization with current values
    const currentOptResult = optimizeFarmMissions({
      available: currentAvailablePersonnel,
      powerPerTier: currentPowerPerTier,
      missionSpeedMultiplier: currentMissionSpeed,
      baseFarmFrags: farmFragsValue,
      manualAssignments: getManualAssignments(),
      fillOrder: fillOrder.value,
      campaign: null
    });
    
    // Calculate current frags per hour
    const currentStats = calculateFarmMissionStats(
      currentOptResult.assignments,
      currentPowerPerTier,
      currentMissionSpeed,
      farmFragsValue
    );
    
    // Run optimization with new +Ultima values
    const newOptResult = optimizeFarmMissions({
      available: newAvailablePersonnel,
      powerPerTier: newPowerPerTier,
      missionSpeedMultiplier: newMissionSpeed,
      baseFarmFrags: farmFragsValue,
      manualAssignments: getManualAssignments(),
      fillOrder: fillOrder.value,
      campaign: null
    });
    
    // Calculate new frags per hour
    const newStats = calculateFarmMissionStats(
      newOptResult.assignments,
      newPowerPerTier,
      newMissionSpeed,
      farmFragsValue
    );
    
    const currentFragsPerHour = currentStats.totalFragsPerHour;
    const newFragsPerHour = newStats.totalFragsPerHour;
    const deltaFragsPerHour = newFragsPerHour - currentFragsPerHour;
    const deltaFragsPerDay = deltaFragsPerHour * 24;
    
    return {
      currentFragsPerHour,
      newFragsPerHour,
      deltaFragsPerHour,
      deltaFragsPerDay,
      canAffordNewLevels,
      currentLevels: {
        productivity: currentProductivityLevel,
        swarm: currentSwarmLevel,
      },
      newLevels: {
        productivity: newProductivityLevel,
        swarm: newSwarmLevel,
      },
    };
  }

  /**
   * Get cost-benefit analysis for +Ultima
   * Returns null if the new loopmod levels aren't affordable with current MP
   * @returns {Object|null} { deltaFragsPerDay, canAfford, currentLevels, newLevels }
   */
  function getPlusUltimaCostBenefit() {
    const benefit = calculatePlusUltimaBenefit(1);
    
    // Only show benefit if we can actually afford new loopmod levels
    if (!benefit.canAffordNewLevels) {
      return {
        ...benefit,
        message: 'MP zu niedrig für neue Loopmod-Level'
      };
    }
    
    return benefit;
  }

  // ============================================
  // CAMPAIGN TIMER FUNCTIONS (Global background timer system)
  // ============================================

  // Track pending alarms that couldn't play due to no user interaction
  const pendingAlarms = ref([]);

  /**
   * Play alarm sound using Web Audio API (10 alternating beeps)
   * Returns true if sound played, false if blocked
   */
  function playAlarmSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Check if audio context is suspended (no user interaction yet)
      if (audioContext.state === 'suspended') {
        console.warn('🔇 Audio context suspended - waiting for user interaction');
        return false;
      }
      
      // Play 20 beeps with alternating frequencies
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Alternate between 800Hz and 1000Hz for variety
          oscillator.frequency.value = i % 2 === 0 ? 800 : 1000;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.15);
        }, i * 150); // 150ms between each beep
      }
      return true;
    } catch (e) {
      console.warn('Could not play campaign timer alarm sound:', e);
      return false;
    }
  }

  /**
   * Show browser notification for completed timer
   * When clicked, navigates to Mission Planner
   */
  function showNotification(campaignTag) {
    // Check if notifications are supported and permitted
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification('🔔 Campaign Timer Complete!', {
          body: `Campaign ${campaignTag} has finished! Click to open Mission Planner.`,
          icon: '/favicon.ico',
          tag: `campaign-timer-${campaignTag}`,
          requireInteraction: true
        });
        
        // Navigate to Mission Planner when notification is clicked
        notification.onclick = () => {
          // Focus the window/tab
          window.focus();
          
          // Set the active tab to campaigns so it opens there
          activeMainTab.value = 'campaigns';
          
          // Navigate to Mission Planner using proper path
          // The app uses HTML5 history mode, so we navigate to the absolute path
          window.location.href = '/tools/mission-planner';
          
          // Close the notification
          notification.close();
          
          // Try to play the alarm sound now that user interacted
          tryPlayPendingAlarms();
        };
      } else if (Notification.permission !== 'denied') {
        // Request permission for future notifications
        Notification.requestPermission();
      }
    }
  }

  /**
   * Try to play pending alarms (called on user interaction)
   */
  function tryPlayPendingAlarms() {
    if (pendingAlarms.value.length > 0) {
      console.log(`🔔 Playing ${pendingAlarms.value.length} pending alarm(s)...`);
      const success = playAlarmSound();
      if (success) {
        pendingAlarms.value = [];
      }
    }
  }

  /**
   * Check for completed timers and play alarm
   */
  function checkForCompletedTimers() {
    for (const [tag, timer] of Object.entries(campaignTimers.value)) {
      const elapsed = (campaignTimerCurrentTime.value - timer.startedAt) / 1000;
      if (elapsed >= timer.durationSeconds && !campaignTimersAlarmPlayed.value[tag]) {
        // Timer just completed
        console.log(`🔔 Campaign timer completed: ${tag}`);
        
        // Try to play sound
        const soundPlayed = playAlarmSound();
        
        // If sound couldn't play, add to pending and show notification
        if (!soundPlayed) {
          pendingAlarms.value.push(tag);
          console.log(`⏳ Sound blocked - added ${tag} to pending alarms`);
        }
        
        // Always show browser notification as backup
        showNotification(tag);
        
        // Mark as played (even if sound was blocked, we don't want repeated attempts)
        campaignTimersAlarmPlayed.value[tag] = true;
      }
    }
  }

  /**
   * Initialize the campaign timer system (call once from App.vue)
   * Starts the background interval that checks timers every second
   */
  function initCampaignTimers() {
    if (campaignTimersInitialized.value) {
      console.log('Campaign timers already initialized');
      return;
    }
    
    console.log('🕐 Initializing campaign timer system...');
    
    // Request notification permission early
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log(`📢 Notification permission: ${permission}`);
      });
    }
    
    // Add click listener to play pending alarms on first interaction
    const playPendingOnInteraction = () => {
      tryPlayPendingAlarms();
      // Remove listener after first interaction
      document.removeEventListener('click', playPendingOnInteraction);
      document.removeEventListener('keydown', playPendingOnInteraction);
    };
    document.addEventListener('click', playPendingOnInteraction);
    document.addEventListener('keydown', playPendingOnInteraction);
    
    // Start interval to update time and check for completed timers
    campaignTimerInterval = setInterval(() => {
      campaignTimerCurrentTime.value = Date.now();
      checkForCompletedTimers();
    }, 1000);
    
    campaignTimersInitialized.value = true;
    console.log('✅ Campaign timer system initialized');
  }

  /**
   * Stop the campaign timer system (cleanup)
   */
  function stopCampaignTimers() {
    if (campaignTimerInterval) {
      clearInterval(campaignTimerInterval);
      campaignTimerInterval = null;
    }
    campaignTimersInitialized.value = false;
    console.log('🛑 Campaign timer system stopped');
  }

  /**
   * Start a timer for a specific campaign
   */
  function startCampaignTimer(campaignTag, durationMinutes) {
    const durationSeconds = durationMinutes * 60;
    
    campaignTimers.value[campaignTag] = {
      startedAt: Date.now(),
      durationSeconds,
    };
    
    // Clear alarm played state for this timer
    delete campaignTimersAlarmPlayed.value[campaignTag];
    
    console.log(`▶️ Started campaign timer: ${campaignTag} (${durationMinutes} min)`);
  }

  /**
   * Reset/clear a specific campaign timer
   */
  function resetCampaignTimer(campaignTag) {
    delete campaignTimers.value[campaignTag];
    delete campaignTimersAlarmPlayed.value[campaignTag];
    console.log(`⏹️ Reset campaign timer: ${campaignTag}`);
  }

  /**
   * Reset all campaign timers
   */
  function resetAllCampaignTimers() {
    campaignTimers.value = {};
    campaignTimersAlarmPlayed.value = {};
    console.log('⏹️ Reset all campaign timers');
  }

  /**
   * Get the state of a specific campaign timer
   * @returns 'idle' | 'running' | 'completed'
   */
  function getCampaignTimerState(campaignTag) {
    const timer = campaignTimers.value[campaignTag];
    if (!timer) return 'idle';
    
    const elapsed = (campaignTimerCurrentTime.value - timer.startedAt) / 1000;
    if (elapsed >= timer.durationSeconds) {
      return 'completed';
    }
    return 'running';
  }

  /**
   * Get remaining time for a campaign timer in seconds
   */
  function getCampaignRemainingTime(campaignTag) {
    const timer = campaignTimers.value[campaignTag];
    if (!timer) return 0;
    
    const elapsed = (campaignTimerCurrentTime.value - timer.startedAt) / 1000;
    const remaining = timer.durationSeconds - elapsed;
    return Math.max(0, remaining);
  }

  /**
   * Computed: Check if any campaign timer exists
   */
  const hasAnyCampaignTimer = computed(() => {
    return Object.keys(campaignTimers.value).length > 0;
  });

  // ============================================
  // RETURN
  // ============================================
  
  return {
    // State
    isLoading,
    error,
    modifierValues,
    settings,
    missionAssignments,
    manualModeMissions,
    fillOrder,
    lastOptimizationResult,
    selectedCampaign,
    campaignFillOrder,
    activeMainTab,
    
    // Computed - Individual Breakdowns
    loopmodEffectsBreakdown,
    researchEffectsBreakdown,
    relicEffectsBreakdown,
    badgeEffectsBreakdown,
    inscryptionEffectsBreakdown,
    gadgetEffectsBreakdown,
    otherEffectsBreakdown,
    gemEffectsBreakdown,
    
    // Computed - Combined Effects
    personnelStats,
    personnelWithBonuses,
    missionSpeedMultiplier,
    farmFragments,
    campaignFragments,
    totalCampaignFragments,
    calculatedEffects,
    
    // Computed - Mission Calculation Helpers
    powerPerTier,
    availablePersonnel,
    
    // Actions - Modifier Management
    updateModifier,
    updateModifiers,
    resetModifiers,
    resetCategory,
    getModifier,
    updateSettings,
    toggleDebug,
    exportConfig,
    importConfig,
    initialize,
    
    // Backup / Restore
    exportData,
    importData,
    
    // Actions - Mission Calculations
    getMissionStats,
    getPowerFor2SecondCap,
    getPersonnelNeededForCap,
    hasPersonnelAssigned,
    getFarmMissionsWithStats,
    getCampaignMissionsWithStats,
    getTotalFarmFragsPerHour,
    
    // Actions - Assignment Management
    getAssignment,
    setAssignment,
    clearAssignment,
    clearAllAssignments,
    isManualMode,
    setManualMode,
    toggleManualMode,
    getManualAssignments,
    getRemainingPersonnel,
    validateMissionAssignment,
    
    // Actions - Optimization
    runOptimization,
    applyOptimization,
    optimizeAndApply,
    getCurrentMissionStats,
    getTotalPersonnelUsed,
    getWastedPowerSummary,
    getOptimizationSuggestions,
    
    // Actions - Fill Order
    getFillOrder,
    setFillOrder,
    swapFillOrder,
    resetFillOrder,
    getMissionsByFillOrder,
    
    // Actions - Campaign Selection
    setSelectedCampaign,
    clearSelectedCampaign,
    setCampaignFillOrder,
    getPersonnelAtFillOrderPosition,
    getEffectiveFillOrder,
    getSelectedCampaignData,
    getSelectedCampaignEstimatedTime,
    isCampaignManualMode,
    toggleCampaignManualMode,
    
    // State - Relics
    relicLevels,
    relicTargetLevels,
    currentFragments,
    fragmentsLastUpdated,
    currentHoursInTR,
    
    // Actions - Relics
    setRelicLevel,
    resetAllRelicLevels,
    setCurrentFragments,
    updateFragmentsFromElapsedTime,
    purchaseRelicLevel,
    
    // Inscryption Cost-Benefit Analysis
    calculateInscryptionBenefit,
    getInscryptionCostBenefit,
    
    // Relic Cost-Benefit Analysis
    calculateRelicBenefit,
    getRelicCostBenefit,
    
    // Gadget Cost-Benefit Analysis
    calculateGadgetBenefit,
    getGadgetCostBenefit,
    
    // +Ultima Cost-Benefit Analysis
    calculatePlusUltimaBenefit,
    getPlusUltimaCostBenefit,
    
    // Campaign Fragments Calculation
    calculateCampaignFragsForIndex,
    OPTIMAL_CAMPAIGN_ORDER,
    CAMPAIGN_FINAL_MULTIPLIERS,
    
    // Utility exports for components
    formatCompletionTime,
    formatNumber,
    FARM_MIN_TIME_SECONDS,
    createEmptyPersonnel,
    getTotalPersonnel,
    clonePersonnel,
    DEFAULT_FILL_ORDER,
    
    // Campaign Timer System
    campaignTimers,
    campaignTimersAlarmPlayed,
    campaignTimerCurrentTime,
    campaignTimersInitialized,
    initCampaignTimers,
    stopCampaignTimers,
    startCampaignTimer,
    resetCampaignTimer,
    resetAllCampaignTimers,
    getCampaignTimerState,
    getCampaignRemainingTime,
    hasAnyCampaignTimer,
  };
});
