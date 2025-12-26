import { computed } from 'vue';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';

/**
 * Composable for Orb/Fragment multiplier calculations
 * 
 * Provides reactive computed values for:
 * - Orb multiplier
 * - Fragment multiplier
 * - Total orbs calculation
 * - Individual boost contributions
 */
export function useOrbCalculations() {
  const trPlannerStore = useTRPlannerStore();
  const gemPlannerStore = useGemPlannerStore();
  
  // ==========================================
  // HELPER: Get effective gem level (with overrides)
  // ==========================================
  
  function getEffectiveGemLevel(gemId, planOverrides = {}) {
    // Check for plan override first
    if (planOverrides.gems && gemId in planOverrides.gems) {
      return planOverrides.gems[gemId];
    }
    
    // Fall back to gem planner store
    const gemState = gemPlannerStore.getGemState(gemId);
    return gemState?.level || 0;
  }
  
  // ==========================================
  // HELPER: Get effective boost value (with overrides)
  // ==========================================
  
  function getEffectiveBoostValue(boostKey, planOverrides = {}) {
    // Check for plan override first
    if (planOverrides.boosts && boostKey in planOverrides.boosts) {
      return planOverrides.boosts[boostKey];
    }
    
    // Fall back to store value
    return trPlannerStore.getBoostValue(boostKey);
  }
  
  // ==========================================
  // CALCULATION: Hours in TR multiplier
  // ==========================================
  
  function calculateHoursMultiplier(hoursInTR, loopMods = 0) {
    if (hoursInTR <= 0) return 1;
    
    const hoursExponent = Math.min(2.42, 1.02 + hoursInTR * 0.00256);
    const loopModsExponent = Math.min(2.42, 1.02 + loopMods * 0.00005);
    
    return Math.pow(
      1 + Math.pow(hoursInTR, hoursExponent) * Math.pow(Math.max(1, loopMods), loopModsExponent),
      0.06
    );
  }
  
  // ==========================================
  // CALCULATION: TR Count bonus
  // ==========================================
  
  function calculateTRCountBonus(trCount) {
    if (trCount <= 0) return 1;
    
    // TR bonus formula: 1 + (trCount * 0.1) up to some cap
    return 1 + Math.min(trCount * 0.1, 10);
  }
  
  // ==========================================
  // CALCULATION: All-Time Orbs bonus
  // ==========================================
  
  function calculateAllTimeOrbsBonus(allTimeOrbs) {
    if (allTimeOrbs <= 0) return 1;
    
    // Logarithmic scaling for all-time orbs
    return 1 + Math.log10(Math.max(1, allTimeOrbs)) * 0.1;
  }
  
  // ==========================================
  // CALCULATION: Research multiplier
  // ==========================================
  
  function calculateResearchMultiplier(planOverrides = {}) {
    let totalMultiplier = 1;
    
    // Get innovation gem level (required for research)
    const innovationLevel = getEffectiveGemLevel('innovation', planOverrides);
    
    // Research requires Innovation Gem level 3+
    if (innovationLevel < 3) {
      return 1;
    }
    
    // TODO: Implement actual research calculation based on research levels
    // For now, return placeholder
    const researchKeys = ['research_1', 'research_2', 'research_3', 'research_4', 'research_5'];
    
    researchKeys.forEach(key => {
      const level = trPlannerStore.getResearchLevel(key);
      if (level > 0) {
        // Placeholder formula: each research level adds 5%
        totalMultiplier *= 1 + (level * 0.05);
      }
    });
    
    return totalMultiplier;
  }
  
  // ==========================================
  // CALCULATION: Gem-based multipliers
  // ==========================================
  
  function calculateGemMultipliers(planOverrides = {}) {
    let orbMulti = 1;
    let fragMulti = 1;
    
    // Temporal Gem - affects orb multiplier
    const temporalLevel = getEffectiveGemLevel('temporal', planOverrides);
    if (temporalLevel > 0) {
      orbMulti *= Math.pow(1.1, temporalLevel);
    }
    
    // Power Gem - affects both
    const powerLevel = getEffectiveGemLevel('power', planOverrides);
    if (powerLevel > 0) {
      orbMulti *= Math.pow(1.05, powerLevel);
      fragMulti *= Math.pow(1.05, powerLevel);
    }
    
    // Attraction Gem - affects fragment multiplier
    const attractionLevel = getEffectiveGemLevel('attraction', planOverrides);
    if (attractionLevel > 0) {
      fragMulti *= Math.pow(1.15, attractionLevel);
    }
    
    // TODO: Add more gem effects based on actual game data
    
    return { orbMulti, fragMulti };
  }
  
  // ==========================================
  // MAIN CALCULATION: Total multipliers
  // ==========================================
  
  function calculateMultipliers(options = {}) {
    const {
      hoursInTR = trPlannerStore.modifiers.settings.defaultHoursInTR,
      loopMods = trPlannerStore.modifiers.loopMods.count,
      trCount = trPlannerStore.modifiers.settings.trCount,
      allTimeOrbs = trPlannerStore.modifiers.settings.allTimeOrbs,
      planOverrides = {}
    } = options;
    
    // Base multipliers
    let orbMultiplier = 1;
    let fragMultiplier = 1;
    
    // Hours in TR bonus
    const hoursMulti = calculateHoursMultiplier(hoursInTR, loopMods);
    orbMultiplier *= hoursMulti;
    fragMultiplier *= hoursMulti;
    
    // TR Count bonus
    const trBonus = calculateTRCountBonus(trCount);
    orbMultiplier *= trBonus;
    
    // All-Time Orbs bonus
    const allTimeBonus = calculateAllTimeOrbsBonus(allTimeOrbs);
    orbMultiplier *= allTimeBonus;
    
    // Research multiplier
    const researchMulti = calculateResearchMultiplier(planOverrides);
    orbMultiplier *= researchMulti;
    
    // Gem multipliers
    const gemMultis = calculateGemMultipliers(planOverrides);
    orbMultiplier *= gemMultis.orbMulti;
    fragMultiplier *= gemMultis.fragMulti;
    
    // TODO: Add boost-based multipliers from store
    
    return {
      orbMultiplier,
      fragMultiplier,
      breakdown: {
        hoursMulti,
        trBonus,
        allTimeBonus,
        researchMulti,
        gemOrbMulti: gemMultis.orbMulti,
        gemFragMulti: gemMultis.fragMulti
      }
    };
  }
  
  // ==========================================
  // REACTIVE COMPUTED: Current multipliers
  // ==========================================
  
  const currentMultipliers = computed(() => {
    const plan = trPlannerStore.selectedPlan;
    
    return calculateMultipliers({
      hoursInTR: plan?.settings?.hoursInTR || trPlannerStore.modifiers.settings.defaultHoursInTR,
      loopMods: trPlannerStore.modifiers.loopMods.count,
      trCount: trPlannerStore.modifiers.settings.trCount,
      allTimeOrbs: trPlannerStore.modifiers.settings.allTimeOrbs,
      planOverrides: plan?.overrides || {}
    });
  });
  
  const orbMultiplier = computed(() => currentMultipliers.value.orbMultiplier);
  const fragMultiplier = computed(() => currentMultipliers.value.fragMultiplier);
  const breakdown = computed(() => currentMultipliers.value.breakdown);
  
  // ==========================================
  // HELPERS: Formatting
  // ==========================================
  
  function formatMultiplier(value, decimals = 2) {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + 'M';
    }
    if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + 'K';
    }
    return value.toFixed(decimals);
  }
  
  // ==========================================
  // RETURN
  // ==========================================
  
  return {
    // Calculation functions
    calculateMultipliers,
    calculateHoursMultiplier,
    calculateTRCountBonus,
    calculateAllTimeOrbsBonus,
    calculateResearchMultiplier,
    calculateGemMultipliers,
    
    // Helper functions
    getEffectiveGemLevel,
    getEffectiveBoostValue,
    
    // Reactive computed values
    currentMultipliers,
    orbMultiplier,
    fragMultiplier,
    breakdown,
    
    // Formatting
    formatMultiplier
  };
}
