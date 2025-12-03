import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import { MODIFIERS, getDefaultModifierValues } from '@/constants/mission-planner/modifiers';
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
} from '@/constants/mission-planner/calculations';
import {
  calculateTotalPower,
  calculateCompletionTime,
  calculateMissionStats,
  calculatePowerFor2SecondCap,
  formatCompletionTime,
  formatNumber,
  FARM_MIN_TIME_SECONDS
} from '@/constants/mission-planner/missionCalculator';
import { FARM_MISSIONS, CAMPAIGN_MISSIONS, isFarmMission, DEFAULT_FILL_ORDER, CAMPAIGN_FINAL_MULTIPLIERS } from '@/constants/mission-planner/missions';
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
} from '@/constants/mission-planner/missionOptimizer';
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
  
  // Fill order position for the selected campaign (1-17, inserts before farms at that position)
  // Default is 17 (last position, after all farms)
  const campaignFillOrder = useStorage('mission-planner-campaign-fill-order', 17);
  
  // Campaign manual mode (persistent)
  const campaignManualMode = useStorage('mission-planner-campaign-manual-mode', false);

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
    
    const multiplier = loopmodMult * researchMult * badgeMult * inscryptionMult * otherMult * gemMult;
    
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
    
    const multiplier = loopmodMult * researchMult * relicMult * inscryptionMult * gadgetMult * otherMult * gemMult;
    
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
    
    const multiplier = loopmodMult * researchMult * relicMult * inscryptionMult * gadgetMult * otherMult * gemMult;
    
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
   * @param {Object} assignments - { missionTag: { T1: count, T2: count, ... }, ... }
   * @returns {Array} Array of mission stats
   */
  function getCampaignMissionsWithStats(assignments = {}) {
    return CAMPAIGN_MISSIONS.map(mission => {
      const personnel = assignments[mission.tag] || { T1: 0, T2: 0, T3: 0, T4: 0 };
      return getMissionStats(mission, personnel);
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
    if (result.campaignAssignment && selectedCampaign.value && !campaignManualMode.value) {
      setAssignment(selectedCampaign.value, result.campaignAssignment.personnel, true);
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
   * Get the selected campaign mission data
   */
  function getSelectedCampaignData() {
    if (!selectedCampaign.value) return null;
    return CAMPAIGN_MISSIONS.find(m => m.tag === selectedCampaign.value) || null;
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
    getEffectiveFillOrder,
    getSelectedCampaignData,
    getSelectedCampaignEstimatedTime,
    isCampaignManualMode,
    toggleCampaignManualMode,
    
    // State - Relics
    relicLevels,
    
    // Actions - Relics
    setRelicLevel,
    resetAllRelicLevels,
    
    // Utility exports for components
    formatCompletionTime,
    formatNumber,
    FARM_MIN_TIME_SECONDS,
    createEmptyPersonnel,
    getTotalPersonnel,
    clonePersonnel,
    DEFAULT_FILL_ORDER,
  };
});
