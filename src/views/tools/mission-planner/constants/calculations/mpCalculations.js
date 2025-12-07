/**
 * MP-based Loopmod Calculations for Mission & Relic Planner
 * 
 * IMPORTANT: MP is NOT spent like a budget!
 * MP is a THRESHOLD - if you have 500 MP, you can unlock ALL loopmods
 * whose individual level cost is ≤ 500 MP.
 * 
 * Example: With 500 MP you can have:
 * - t1_modifications level 1 (cost 175) ✅
 * - t1_modifications level 2 (cost 184) ✅
 * - t2_modifications level 1 (cost 189) ✅
 * - All at the same time, as long as each level's cost ≤ 500
 */

import { 
  ALL_LOOPMODS,
  PERSONNEL_POWER_MODS,
  PERSONNEL_HEADSTART_MODS,
  MISSION_SPEED_MODS,
  FRAGMENT_MODS,
  getLoopmodLevelCost
} from '../loopmods';

/**
 * Calculate the maximum level reachable for a loopmod given MP threshold
 * A level is unlocked if its individual cost ≤ available MP
 * 
 * @param {object} loopmod - The loopmod definition
 * @param {number} mpThreshold - Available MP (threshold, not budget)
 * @param {number} inscryptionMaxLevelBonus - Bonus max levels from inscryptions
 * @returns {number} Maximum reachable level
 */
export function getMaxReachableLevel(loopmod, mpThreshold, inscryptionMaxLevelBonus = 0) {
  const effectiveMaxLevel = loopmod.maxLevel + inscryptionMaxLevelBonus;
  
  let level = 0;
  
  while (level < effectiveMaxLevel) {
    const nextLevelCost = getLoopmodLevelCost(loopmod, level + 1, inscryptionMaxLevelBonus);
    
    // If the cost of next level exceeds our MP threshold, stop
    if (nextLevelCost > mpThreshold) break;
    
    level++;
  }
  
  return level;
}

/**
 * Calculate all reachable loopmod levels based on MP threshold
 * 
 * @param {number} mpThreshold - Available MP (threshold, not budget)
 * @param {object} inscryptionBonuses - Bonus max levels from inscryptions
 * @returns {object} Object with loopmod levels
 */
export function calculateReachableLoopmods(mpThreshold, inscryptionBonuses = {}) {
  const levels = {};
  
  for (const [id, loopmod] of Object.entries(ALL_LOOPMODS)) {
    const inscryptionBonus = inscryptionBonuses[id] || 0;
    levels[id] = getMaxReachableLevel(loopmod, mpThreshold, inscryptionBonus);
  }
  
  return levels;
}

/**
 * Calculate personnel power bonuses from loopmods
 * 
 * @param {object} loopmodLevels - Object with loopmod IDs and their levels
 * @returns {object} Power bonuses per personnel type { T1: 0.5, T2: 0.3, ... }
 */
export function calculatePersonnelPowerBonuses(loopmodLevels) {
  const bonuses = {
    T1: 0,
    T2: 0,
    T3: 0,
    T4: 0,
  };
  
  for (const [id, loopmod] of Object.entries(PERSONNEL_POWER_MODS)) {
    const level = loopmodLevels[id] || 0;
    if (level <= 0) continue;
    
    const bonus = level * loopmod.effectPerLevel;
    
    if (loopmod.target === 'ALL') {
      bonuses.T1 += bonus;
      bonuses.T2 += bonus;
      bonuses.T3 += bonus;
      bonuses.T4 += bonus;
    } else {
      bonuses[loopmod.target] += bonus;
    }
  }
  
  return bonuses;
}

/**
 * Calculate personnel count bonuses from headstart loopmods
 * 
 * @param {object} loopmodLevels - Object with loopmod IDs and their levels
 * @returns {object} Count bonuses per personnel type { T1: 25, T2: 15, ... }
 */
export function calculatePersonnelCountBonuses(loopmodLevels) {
  const bonuses = {
    T1: 0,
    T2: 0,
    T3: 0,
    T4: 0,
  };
  
  // Headstart mods
  for (const [id, loopmod] of Object.entries(PERSONNEL_HEADSTART_MODS)) {
    const level = loopmodLevels[id] || 0;
    if (level <= 0) continue;
    
    const bonus = level * loopmod.effectPerLevel;
    
    if (loopmod.target === 'ALL') {
      bonuses.T1 += bonus;
      bonuses.T2 += bonus;
      bonuses.T3 += bonus;
      bonuses.T4 += bonus;
    } else {
      bonuses[loopmod.target] += bonus;
    }
  }
  
  // Ultima: Rule of Productivity also gives personnel count bonus
  const productivityLevel = loopmodLevels['ultima_productivity'] || 0;
  if (productivityLevel > 0) {
    const productivityMod = MISSION_SPEED_MODS['ultima_productivity'];
    const bonus = productivityLevel * productivityMod.effects.personnelCountBonus;
    bonuses.T1 += bonus;
    bonuses.T2 += bonus;
    bonuses.T3 += bonus;
    bonuses.T4 += bonus;
  }
  
  return bonuses;
}

/**
 * Calculate mission speed multiplier from loopmods
 * 
 * @param {object} loopmodLevels - Object with loopmod IDs and their levels
 * @returns {number} Total mission speed multiplier (e.g., 1.5 = 150% speed)
 */
export function calculateMissionSpeedMultiplier(loopmodLevels) {
  let multiplier = 1.0;
  
  // Ultima: Rule of Productivity - *1.1 per level
  const productivityLevel = loopmodLevels['ultima_productivity'] || 0;
  if (productivityLevel > 0) {
    const mod = MISSION_SPEED_MODS['ultima_productivity'];
    multiplier *= Math.pow(mod.effects.missionSpeedMultiplier, productivityLevel);
  }
  
  // Ultima: Rule of the Swarm - *1.0311 per level
  const swarmLevel = loopmodLevels['ultima_swarm'] || 0;
  if (swarmLevel > 0) {
    const mod = MISSION_SPEED_MODS['ultima_swarm'];
    multiplier *= Math.pow(mod.effects.missionSpeedMultiplier, swarmLevel);
  }
  
  return multiplier;
}

/**
 * Calculate farm fragments multiplier from loopmods
 * 
 * @param {object} loopmodLevels - Object with loopmod IDs and their levels
 * @returns {number} Total farm fragments multiplier (e.g., 1.32 = 132%)
 */
export function calculateFarmFragsMultiplier(loopmodLevels) {
  let multiplier = 1.0;
  
  // MMA: The Me'Exe - *1.04 per level
  const meexeLevel = loopmodLevels['mma_meexe'] || 0;
  if (meexeLevel > 0) {
    const mod = FRAGMENT_MODS['mma_meexe'];
    multiplier *= Math.pow(mod.effects.farmFragsMultiplier, meexeLevel);
  }
  
  return multiplier;
}

/**
 * Calculate campaign fragments multiplier from loopmods
 * 
 * @param {object} loopmodLevels - Object with loopmod IDs and their levels
 * @param {object} boonModifiers - Modifiers for boon calculations { completedCampaigns, shipInstalls }
 * @returns {number} Total campaign fragments multiplier
 */
export function calculateCampaignFragsMultiplier(loopmodLevels, boonModifiers = {}) {
  let multiplier = 1.0;
  
  const completedCampaigns = boonModifiers.completedCampaigns || 0;
  const shipInstalls = boonModifiers.shipInstalls || 0;
  
  // Boon: Eternity - x1.03 * completed_campaigns * boon_level
  const eternityLevel = loopmodLevels['boon_eternity'] || 0;
  if (eternityLevel > 0 && completedCampaigns > 0) {
    const mod = FRAGMENT_MODS['boon_eternity'];
    // multiplier = base ^ (campaigns * level)
    multiplier *= Math.pow(mod.effectBase, completedCampaigns * eternityLevel);
  }
  
  // Boon: Hegemony - x1.01 * ship_installs * boon_level
  const hegemonyLevel = loopmodLevels['boon_hegemony'] || 0;
  if (hegemonyLevel > 0 && shipInstalls > 0) {
    const mod = FRAGMENT_MODS['boon_hegemony'];
    // multiplier = base ^ (installs * level)
    multiplier *= Math.pow(mod.effectBase, shipInstalls * hegemonyLevel);
  }
  
  return multiplier;
}

/**
 * Get detailed breakdown of all loopmod effects
 * 
 * @param {number} mpThreshold - Available MP (threshold, not budget)
 * @param {object} inscryptionBonuses - Bonus max levels from inscryptions
 * @param {object} boonModifiers - Modifiers for boon calculations { completedCampaigns, shipInstalls }
 * @returns {object} Complete breakdown of effects
 */
export function getLoopmodEffectsBreakdown(mpThreshold, inscryptionBonuses = {}, boonModifiers = {}) {
  const loopmodLevels = calculateReachableLoopmods(mpThreshold, inscryptionBonuses);
  const powerBonuses = calculatePersonnelPowerBonuses(loopmodLevels);
  const countBonuses = calculatePersonnelCountBonuses(loopmodLevels);
  const missionSpeedMultiplier = calculateMissionSpeedMultiplier(loopmodLevels);
  const farmFragsMultiplier = calculateFarmFragsMultiplier(loopmodLevels);
  const campaignFragsMultiplier = calculateCampaignFragsMultiplier(loopmodLevels, boonModifiers);
  
  return {
    loopmodLevels,
    powerBonuses,
    countBonuses,
    missionSpeedMultiplier,
    missionSpeedPercent: Math.round(missionSpeedMultiplier * 100),
    farmFragsMultiplier,
    farmFragsPercent: Math.round(farmFragsMultiplier * 100),
    campaignFragsMultiplier,
    campaignFragsPercent: Math.round(campaignFragsMultiplier * 100),
    mpThreshold,
    boonModifiers,
    
    // Detailed breakdown per loopmod
    details: Object.entries(ALL_LOOPMODS).map(([id, loopmod]) => ({
      id,
      name: loopmod.name,
      level: loopmodLevels[id] || 0,
      maxLevel: loopmod.maxLevel + (inscryptionBonuses[id] || 0),
      levelCost: getLoopmodLevelCost(loopmod, loopmodLevels[id] || 0, inscryptionBonuses[id] || 0),
      nextLevelCost: getLoopmodLevelCost(loopmod, (loopmodLevels[id] || 0) + 1, inscryptionBonuses[id] || 0),
      effectType: loopmod.effectType,
      target: loopmod.target,
    })),
  };
}

/**
 * Format power bonus for display
 * @param {number} bonus - Power bonus value
 * @returns {string} Formatted string like "+0.5"
 */
export function formatPowerBonus(bonus) {
  if (bonus === 0) return '+0';
  return '+' + bonus.toFixed(1);
}

/**
 * Format count bonus for display
 * @param {number} bonus - Count bonus value
 * @returns {string} Formatted string like "+25"
 */
export function formatCountBonus(bonus) {
  if (bonus === 0) return '+0';
  return '+' + bonus;
}
