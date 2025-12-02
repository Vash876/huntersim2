/**
 * RP-based Research Calculations for Mission & Relic Planner
 * 
 * IMPORTANT: RP is NOT spent like a budget!
 * RP is a THRESHOLD - if you have 500 RP, you can unlock ALL researches
 * whose cost is ≤ 500 RP.
 * 
 * Two RP types:
 * - Current RP: Used for normal researches (reset after TR)
 * - All Time Highest RP: Used for dark researches (permanent)
 */

import {
  NORMAL_RESEARCHES,
  DARK_RESEARCHES,
  ALL_RESEARCHES,
  getUnlockedResearchLevels
} from '../researches';

/**
 * Calculate all unlocked research levels based on RP thresholds
 * 
 * @param {number} currentRP - Current RP (for normal researches)
 * @param {number} allTimeHighestRP - All time highest RP (for dark researches)
 * @returns {object} Object with research IDs and their unlocked levels
 */
export function calculateUnlockedResearches(currentRP, allTimeHighestRP) {
  const unlocked = {};
  
  // Normal researches use current RP
  for (const [id, research] of Object.entries(NORMAL_RESEARCHES)) {
    unlocked[id] = getUnlockedResearchLevels(research, currentRP);
  }
  
  // Dark researches use all time highest RP
  for (const [id, research] of Object.entries(DARK_RESEARCHES)) {
    unlocked[id] = getUnlockedResearchLevels(research, allTimeHighestRP);
  }
  
  return unlocked;
}

/**
 * Calculate personnel count bonuses from researches
 * 
 * @param {object} unlockedResearches - Object with unlocked research levels
 * @returns {object} Count bonuses per personnel type { T1: 50, T2: 50, ... }
 */
export function calculateResearchPersonnelBonuses(unlockedResearches) {
  const bonuses = {
    T1: 0,
    T2: 0,
    T3: 0,
    T4: 0,
  };
  
  for (const [researchId, levels] of Object.entries(unlockedResearches)) {
    for (const level of levels) {
      if (level.effectType === 'personnel_count') {
        bonuses[level.target] += level.bonus;
      }
    }
  }
  
  return bonuses;
}

/**
 * Calculate mission speed multiplier from researches
 * 
 * @param {object} unlockedResearches - Object with unlocked research levels
 * @returns {number} Total mission speed multiplier
 */
export function calculateResearchMissionSpeedMultiplier(unlockedResearches) {
  let multiplier = 1.0;
  
  for (const [researchId, levels] of Object.entries(unlockedResearches)) {
    for (const level of levels) {
      if (level.effectType === 'mission_speed') {
        multiplier *= level.multiplier;
      }
    }
  }
  
  return multiplier;
}

/**
 * Calculate farm fragments bonuses from researches
 * Returns both additive and multiplicative bonuses
 * 
 * @param {object} unlockedResearches - Object with unlocked research levels
 * @returns {object} { additive: number, multiplier: number }
 */
export function calculateResearchFarmFragsBonuses(unlockedResearches) {
  let additive = 0;
  let multiplier = 1.0;
  
  for (const [researchId, levels] of Object.entries(unlockedResearches)) {
    for (const level of levels) {
      if (level.effectType === 'farm_fragments_add') {
        additive += level.bonus;
      }
      if (level.effectType === 'farm_fragments_mult') {
        multiplier *= level.multiplier;
      }
      // All fragments affects farm too
      if (level.effectType === 'all_fragments_mult') {
        multiplier *= level.multiplier;
      }
    }
  }
  
  return { additive, multiplier };
}

/**
 * Calculate campaign fragments bonuses from researches
 * Returns both additive and multiplicative bonuses
 * 
 * @param {object} unlockedResearches - Object with unlocked research levels
 * @returns {object} { additive: number, multiplier: number }
 */
export function calculateResearchCampaignFragsBonuses(unlockedResearches) {
  let additive = 0;
  let multiplier = 1.0;
  
  for (const [researchId, levels] of Object.entries(unlockedResearches)) {
    for (const level of levels) {
      if (level.effectType === 'campaign_fragments_add') {
        additive += level.bonus;
      }
      if (level.effectType === 'campaign_fragments_mult') {
        multiplier *= level.multiplier;
      }
      // All fragments affects campaign too
      if (level.effectType === 'all_fragments_mult') {
        multiplier *= level.multiplier;
      }
    }
  }
  
  return { additive, multiplier };
}

/**
 * Get complete breakdown of research effects
 * 
 * @param {number} currentRP - Current RP
 * @param {number} allTimeHighestRP - All time highest RP
 * @returns {object} Complete breakdown of effects
 */
export function getResearchEffectsBreakdown(currentRP, allTimeHighestRP) {
  const unlockedResearches = calculateUnlockedResearches(currentRP, allTimeHighestRP);
  const personnelBonuses = calculateResearchPersonnelBonuses(unlockedResearches);
  const missionSpeedMultiplier = calculateResearchMissionSpeedMultiplier(unlockedResearches);
  const farmFragsBonuses = calculateResearchFarmFragsBonuses(unlockedResearches);
  const campaignFragsBonuses = calculateResearchCampaignFragsBonuses(unlockedResearches);
  
  // Count unlocked levels and calculate per-research effects
  let totalUnlockedLevels = 0;
  const researchDetails = {};
  
  for (const [id, levels] of Object.entries(unlockedResearches)) {
    totalUnlockedLevels += levels.length;
    
    // Calculate this research's contribution
    let speedMult = 1.0;
    let farmAdd = 0;
    let farmMult = 1.0;
    let campAdd = 0;
    let campMult = 1.0;
    let personnelT1 = 0, personnelT2 = 0, personnelT3 = 0, personnelT4 = 0;
    
    for (const level of levels) {
      if (level.effectType === 'mission_speed') {
        speedMult *= level.multiplier;
      }
      if (level.effectType === 'farm_fragments_add') {
        farmAdd += level.bonus;
      }
      if (level.effectType === 'farm_fragments_mult') {
        farmMult *= level.multiplier;
      }
      if (level.effectType === 'campaign_fragments_add') {
        campAdd += level.bonus;
      }
      if (level.effectType === 'campaign_fragments_mult') {
        campMult *= level.multiplier;
      }
      if (level.effectType === 'all_fragments_mult') {
        farmMult *= level.multiplier;
        campMult *= level.multiplier;
      }
      if (level.effectType === 'personnel_count') {
        if (level.target === 'T1') personnelT1 += level.bonus;
        if (level.target === 'T2') personnelT2 += level.bonus;
        if (level.target === 'T3') personnelT3 += level.bonus;
        if (level.target === 'T4') personnelT4 += level.bonus;
      }
    }
    
    researchDetails[id] = {
      unlockedLevels: levels.length,
      maxLevel: ALL_RESEARCHES[id].levels.length,
      levels: levels,
      // Calculated effects for this research
      effects: {
        speedMult,
        farmAdd,
        farmMult,
        campAdd,
        campMult,
        personnel: { T1: personnelT1, T2: personnelT2, T3: personnelT3, T4: personnelT4 },
      },
    };
  }
  
  return {
    unlockedResearches,
    personnelBonuses,
    missionSpeedMultiplier,
    missionSpeedPercent: Math.round(missionSpeedMultiplier * 100),
    farmFragsBonuses,
    campaignFragsBonuses,
    totalUnlockedLevels,
    researchDetails,
    currentRP,
    allTimeHighestRP,
  };
}
