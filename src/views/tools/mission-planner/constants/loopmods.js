/**
 * Loopmod Definitions for Mission & Relic Planner
 * 
 * Each loopmod has:
 * - startCost: MP cost for level 1
 * - costIncrement: Additional MP cost per level (cost = startCost + (level-1) * costIncrement)
 * - maxLevel: Maximum level (can be modified by inscryptions)
 * - effect: What the loopmod does
 * - effectPerLevel: The value increase per level
 */

// =============================================================================
// PERSONNEL POWER MODS
// =============================================================================

export const PERSONNEL_POWER_MODS = {
  t1_modifications: {
    id: 't1_modifications',
    name: 'T1 Modifications',
    description: 'Increase Mining Pod power',
    startCost: 175,
    costIncrement: 9,
    maxLevel: 10,
    effectType: 'personnel_power',
    target: 'T1',
    effectPerLevel: 0.1,
  },
  t2_modifications: {
    id: 't2_modifications',
    name: 'T2 Modifications',
    description: 'Increase Fireteam Carrier power',
    startCost: 189,
    costIncrement: 11,
    maxLevel: 20,
    effectType: 'personnel_power',
    target: 'T2',
    effectPerLevel: 0.1,
  },
  t3_modifications: {
    id: 't3_modifications',
    name: 'T3 Modifications',
    description: 'Increase Titan Hauler power',
    startCost: 260,
    costIncrement: 13,
    maxLevel: 30,
    effectType: 'personnel_power',
    target: 'T3',
    effectPerLevel: 0.1,
  },
  t4_modifications: {
    id: 't4_modifications',
    name: 'T4 Modifications',
    description: 'Increase Combat Corvette power',
    startCost: 400,
    costIncrement: 27,
    maxLevel: 40,
    effectType: 'personnel_power',
    target: 'T4',
    effectPerLevel: 0.1,
  },
  t_all_modifications: {
    id: 't_all_modifications',
    name: 'All Modifications',
    description: 'Increase all personnel power',
    startCost: 550,
    costIncrement: 55,
    maxLevel: 10,
    effectType: 'personnel_power',
    target: 'ALL',
    effectPerLevel: 0.1,
  },
};

// =============================================================================
// PERSONNEL HEADSTART MODS (Count bonuses)
// =============================================================================

export const PERSONNEL_HEADSTART_MODS = {
  t1_headstart: {
    id: 't1_headstart',
    name: 'T1 Headstart',
    description: 'Start with additional Mining Pods',
    startCost: 186,
    costIncrement: 10,
    maxLevel: 5,
    // Inscryption can increase max level, then cost increment becomes +20
    inscryptionMaxLevelBonus: 0, // Will be set by inscryption
    inscryptionCostIncrement: 20,
    effectType: 'personnel_count',
    target: 'T1',
    effectPerLevel: 5,
  },
  t2_headstart: {
    id: 't2_headstart',
    name: 'T2 Headstart',
    description: 'Start with additional Fireteam Carriers',
    startCost: 199,
    costIncrement: 12,
    maxLevel: 5,
    inscryptionMaxLevelBonus: 0,
    inscryptionCostIncrement: 27,
    effectType: 'personnel_count',
    target: 'T2',
    effectPerLevel: 5,
  },
  t3_headstart: {
    id: 't3_headstart',
    name: 'T3 Headstart',
    description: 'Start with additional Titan Haulers',
    startCost: 280,
    costIncrement: 14,
    maxLevel: 5,
    inscryptionMaxLevelBonus: 0,
    inscryptionCostIncrement: 39,
    effectType: 'personnel_count',
    target: 'T3',
    effectPerLevel: 5,
  },
  t4_headstart: {
    id: 't4_headstart',
    name: 'T4 Headstart',
    description: 'Start with additional Combat Corvettes',
    startCost: 420,
    costIncrement: 29,
    maxLevel: 5,
    inscryptionMaxLevelBonus: 0,
    inscryptionCostIncrement: 64,
    effectType: 'personnel_count',
    target: 'T4',
    effectPerLevel: 5,
  },
  t_all_headstart: {
    id: 't_all_headstart',
    name: 'All Headstart',
    description: 'Start with additional personnel of all types',
    startCost: 560,
    costIncrement: 35,
    maxLevel: 5,
    inscryptionMaxLevelBonus: 0,
    inscryptionCostIncrement: 75,
    effectType: 'personnel_count',
    target: 'ALL',
    effectPerLevel: 10, // +10 to each type
  },
};

// =============================================================================
// MISSION SPEED MODS
// =============================================================================

export const MISSION_SPEED_MODS = {
  ultima_productivity: {
    id: 'ultima_productivity',
    name: 'Ultima: Rule of Productivity',
    description: 'Increase mission speed and all personnel count',
    startCost: 600,
    costIncrement: 370,
    maxLevel: 10,
    // +Ultima modifier increases max level by 1 each
    ultimaBonusPerLevel: 1,
    effectType: 'mission_speed_and_personnel',
    // Multiple effects
    effects: {
      missionSpeedMultiplier: 1.1, // *1.1 per level
      personnelCountBonus: 20, // +20 to all 4 types per level
    },
  },
  ultima_swarm: {
    id: 'ultima_swarm',
    name: 'Ultima: Rule of the Swarm',
    description: 'Increase mission speed',
    startCost: 400,
    costIncrement: 60,
    maxLevel: 30,
    // Special cost scaling: after level 39, cost jumps to 3890 and increments by 210
    specialCostBreakpoint: 39,
    specialCostStart: 3890,
    specialCostIncrement: 210,
    // +Ultima modifier increases max level by 1 each
    ultimaBonusPerLevel: 1,
    effectType: 'mission_speed',
    effects: {
      missionSpeedMultiplier: 1.0311, // *1.0311 per level
    },
  },
};

// =============================================================================
// FRAGMENT MODS
// =============================================================================

export const FRAGMENT_MODS = {
  mma_meexe: {
    id: 'mma_meexe',
    name: "MMA: The Me'Exe",
    description: 'Increase farm fragments',
    startCost: 2400,
    costIncrement: 400,
    maxLevel: 8,
    effectType: 'farm_fragments',
    effects: {
      farmFragsMultiplier: 1.04, // *1.04 per level
    },
  },
  // fem: {
  //   id: 'fem',
  //   name: 'Fragment Enhancement Module',
  //   description: 'Increase farm fragments',
  //   startCost: 10000,
  //   costIncrement: 100,
  //   maxLevel: 30,
  //   effectType: 'farm_fragments',
  //   effects: {
  //     farmFragsMultiplier: 1.08, // *1.08 per level
  //   },
  // },
  boon_eternity: {
    id: 'boon_eternity',
    name: 'Boon: Eternity',
    description: 'Increase campaign fragments based on completed campaigns',
    // Level costs: 1=1750, 2=10200
    levelCosts: [1750, 10200],
    maxLevel: 2,
    effectType: 'campaign_fragments',
    // Modifier: Completed Campaigns
    modifierType: 'completed_campaigns',
    // (1 + 0.03 * boon_level) ^ completed_campaigns
    effectBase: 1.03,
  },
  boon_hegemony: {
    id: 'boon_hegemony',
    name: 'Boon: Hegemony',
    description: 'Increase campaign fragments based on Ouroboros Ship Installs',
    // Level costs: 1=4600, 2=12600
    levelCosts: [4600, 12600],
    maxLevel: 2,
    effectType: 'campaign_fragments',
    // Modifier: Ouroboros Ship Installs
    modifierType: 'ship_installs',
    // (1 + 0.01 * boon_level) ^ ship_installs
    effectBase: 1.01,
  },
};

// =============================================================================
// ALL LOOPMODS COMBINED
// =============================================================================

export const ALL_LOOPMODS = {
  ...PERSONNEL_POWER_MODS,
  ...PERSONNEL_HEADSTART_MODS,
  ...MISSION_SPEED_MODS,
  ...FRAGMENT_MODS,
};

/**
 * Get the cost for a specific level of a loopmod
 * @param {object} loopmod - The loopmod definition
 * @param {number} level - The level to calculate cost for
 * @param {number} bonusMaxLevels - Bonus max levels from inscryption or +Ultima
 * @returns {number} The MP cost for that level
 */
export function getLoopmodLevelCost(loopmod, level, bonusMaxLevels = 0) {
  if (level <= 0) return 0;
  
  const baseMaxLevel = loopmod.maxLevel;
  const effectiveMaxLevel = baseMaxLevel + bonusMaxLevels;
  
  if (level > effectiveMaxLevel) return Infinity;
  
  // For boons with explicit level costs array
  if (loopmod.levelCosts && level <= loopmod.levelCosts.length) {
    return loopmod.levelCosts[level - 1];
  }
  
  // Special cost scaling (e.g., ultima_swarm after level 39)
  if (loopmod.specialCostBreakpoint && level > loopmod.specialCostBreakpoint) {
    const levelsAfterBreakpoint = level - loopmod.specialCostBreakpoint;
    return loopmod.specialCostStart + (levelsAfterBreakpoint - 1) * loopmod.specialCostIncrement;
  }
  
  // For headstart mods, levels beyond base max use inscryption cost increment
  if (loopmod.inscryptionCostIncrement && level > baseMaxLevel) {
    const lastBaseCost = loopmod.startCost + (baseMaxLevel - 1) * loopmod.costIncrement;
    const levelsAfterBase = level - baseMaxLevel;
    return lastBaseCost + levelsAfterBase * loopmod.inscryptionCostIncrement;
  }
  
  // Normal cost calculation
  return loopmod.startCost + (level - 1) * loopmod.costIncrement;
}

/**
 * Calculate total MP cost to reach a specific level
 * @param {number} startCost - Cost of first level
 * @param {number} increment - Cost increase per level
 * @param {number} levels - Number of levels
 * @returns {number} Total cost for all levels
 */
function calculateTotalCost(startCost, increment, levels) {
  if (levels <= 0) return 0;
  // Sum of arithmetic sequence: n/2 * (2a + (n-1)d)
  return (levels / 2) * (2 * startCost + (levels - 1) * increment);
}

/**
 * Get total MP cost to reach a specific level from level 0
 * @param {object} loopmod - The loopmod definition
 * @param {number} targetLevel - The level to reach
 * @param {number} inscryptionMaxLevelBonus - Bonus max levels from inscryption
 * @returns {number} Total MP cost
 */
export function getLoopmodTotalCost(loopmod, targetLevel, inscryptionMaxLevelBonus = 0) {
  if (targetLevel <= 0) return 0;
  
  const baseMaxLevel = loopmod.maxLevel;
  const effectiveMaxLevel = baseMaxLevel + inscryptionMaxLevelBonus;
  
  if (targetLevel > effectiveMaxLevel) return Infinity;
  
  // For boons with explicit level costs array
  if (loopmod.levelCosts) {
    let total = 0;
    for (let i = 0; i < targetLevel && i < loopmod.levelCosts.length; i++) {
      total += loopmod.levelCosts[i];
    }
    return total;
  }
  
  // For headstart mods with inscryption levels
  if (loopmod.inscryptionCostIncrement && targetLevel > baseMaxLevel) {
    // Cost for levels 1 to baseMaxLevel
    const baseCost = calculateTotalCost(loopmod.startCost, loopmod.costIncrement, baseMaxLevel);
    
    // Cost for extra levels
    const extraLevels = targetLevel - baseMaxLevel;
    const lastBaseCost = loopmod.startCost + (baseMaxLevel - 1) * loopmod.costIncrement;
    const firstExtraCost = lastBaseCost + loopmod.inscryptionCostIncrement;
    const extraCost = calculateTotalCost(firstExtraCost, loopmod.inscryptionCostIncrement, extraLevels);
    
    return baseCost + extraCost;
  }
  
  // Normal calculation
  return calculateTotalCost(loopmod.startCost, loopmod.costIncrement, targetLevel);
}

/**
 * Calculate maximum affordable level for a loopmod given available MP
 * @param {object} loopmod - The loopmod definition
 * @param {number} availableMP - Available MP to spend
 * @param {number} inscryptionMaxLevelBonus - Bonus max levels from inscryption
 * @returns {number} Maximum affordable level
 */
export function getMaxAffordableLevel(loopmod, availableMP, inscryptionMaxLevelBonus = 0) {
  const effectiveMaxLevel = loopmod.maxLevel + inscryptionMaxLevelBonus;
  
  let level = 0;
  let totalCost = 0;
  
  while (level < effectiveMaxLevel) {
    const nextLevelCost = getLoopmodLevelCost(loopmod, level + 1, inscryptionMaxLevelBonus);
    const newTotalCost = getLoopmodTotalCost(loopmod, level + 1, inscryptionMaxLevelBonus);
    
    if (newTotalCost > availableMP) break;
    
    level++;
    totalCost = newTotalCost;
  }
  
  return level;
}
