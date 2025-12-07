/**
 * Relic Definitions for Mission & Relic Planner
 * 
 * Relics provide permanent bonuses that scale with level.
 * Effects are applied additively per level unless specified otherwise.
 * 
 * Tier 1 Relics: r1-r20 (20 relics)
 * Tier 2 Relics: t2r1-t2r10 (10 relics)
 * 
 * Cost Types:
 * - FIXED: Cost is a fixed array of values per level
 * - FLOOR: Cost = floor((baseCost + additive * lvl) * exp0^lvl * exp10^(lvl-9 if lvl>=10) * ...)
 * - ROUND: Same as FLOOR but rounded to 3 decimals (for R2, R3, R4)
 */

// Relic parameter data from spreadsheet
// Format: { bonus, baseCost, additive, exp0, exp10, exp20, exp30, exp40, exp50, fixedCosts? }
const RELIC_DATA = {
  r1:  { bonus: 0.004, baseCost: 1,    additive: 0.9,  exp0: 1.17,  exp10: 1.03,  exp20: 1.04,   exp30: 1,     exp40: null, exp50: null },
  r2:  { bonus: 11,    baseCost: 0.6,  additive: 0.2,  exp0: 1.09,  exp10: 1.006, exp20: 1.007,  exp30: 1.022, exp40: null, exp50: null },
  r3:  { bonus: 0.03,  baseCost: 0.7,  additive: 0.5,  exp0: 1.12,  exp10: 1.02,  exp20: 1.04,   exp30: 1.07,  exp40: null,    exp50: null },
  r4:  { bonus: 0.03,  baseCost: 0.8,  additive: 0.4,  exp0: 1.12,  exp10: 1.02,  exp20: 1.015,  exp30: 1,     exp40: null, exp50: null },
  r5:  { bonus: 0.001, baseCost: 1,    additive: 120,  exp0: 4400,  fixedCosts: [1, 120, 4400, 6200, 15200, 18500, 24000, 30000, 44000, 56000, 72000] },
  r6:  { bonus: 2.75,  baseCost: 30,   additive: 450,  exp0: 1070,  fixedCosts: [30, 450, 1070, 2500, 6700, 7000, 7600, 8500, 12000, 16000, 32000] },
  r7:  { bonus: 1.05,  baseCost: 2,    additive: 1.8,  exp0: 1.14,  exp10: 1.01,  exp20: 1.02,   exp30: 1,     exp40: 1,    exp50: null },
  r8:  { bonus: 5,     baseCost: 5,    additive: 4,    exp0: 1.2,   exp10: 1.1,   exp20: 1,      exp30: 1,     exp40: null, exp50: null },
  r9:  { bonus: 1.08,  baseCost: 8,    additive: 1.8,  exp0: 1.18,  exp10: 1.03,  exp20: 1.08,   exp30: 1,     exp40: 1,    exp50: 1 },
  r10: { bonus: 1.08,  baseCost: 2,    additive: 15,   exp0: 72,    fixedCosts: [2, 15, 72, 257, 594, 1691, 3140, 18861] },
  r11: { bonus: 2,     baseCost: 3,    additive: 65,   exp0: 305,   fixedCosts: [3, 65, 305, 2055, 4805, 8555, 15000, 27500] },
  r12: { bonus: 0.5,   baseCost: 50,   additive: 30,   exp0: 1.09,  exp10: 1.01,  exp20: 1,      exp30: 1,     exp40: 1.00372, exp50: null },
  r13: { bonus: 468,   baseCost: 10,   additive: 1.13, exp0: 1.013, exp10: 1.012, exp20: 1,      exp30: 1,     exp40: 1,    exp50: 1.00378, maxLevel: 200 },
  r14: { bonus: 468,   baseCost: 20,   additive: 100,  exp0: 320,   fixedCosts: [20, 100, 320, 880, 2240, 5440, 12800, 29440] },
  r15: { bonus: 1,     baseCost: 30,   additive: 140,  exp0: 440,   fixedCosts: [30, 140, 440, 1200, 3040, 7360, 17280, 39680] },
  r16: { bonus: 0.03,  baseCost: 40,   additive: 5,    exp0: 1.08,  exp10: 1.028, exp20: 1,      exp30: 1,     exp40: null, exp50: null },
  r17: { bonus: 0.03,  baseCost: 50,   additive: 6,    exp0: 1.1,   exp10: 1.037, exp20: 1,      exp30: 1,     exp40: null, exp50: null },
  r18: { bonus: 365,   baseCost: 60,   additive: 6,    exp0: 1.03,  exp10: 1.01,  exp20: 1.02,   exp30: 1,     exp40: null, exp50: null, maxLevel: 200 },
  r19: { bonus: 365,   baseCost: 666,  additive: 1289, exp0: 2446,  fixedCosts: [666, 1289, 2446, 4569, 8428, 15390, 27871, 50121] },
  r20: { bonus: 2,     baseCost: 1000, additive: 50,   exp0: 1.2,   exp10: 1,     exp20: 1,      exp30: 1,     exp40: 1,    exp50: null },
};

// Cost type categorization
const FIXED_RELICS = [5, 6, 10, 11, 14, 15, 19];
const FLOOR_RELICS = [1, 7, 8, 9, 12, 13, 16, 17, 18, 20];
const ROUND_RELICS = [2, 3, 4]; // FLEX = ROUND to 3 decimals

/**
 * Calculate cost using FLOOR formula
 * cost = floor((baseCost + additive * lvl) * exp0^lvl * exp10^(lvl-9) * exp20^(lvl-19) * ...)
 */
function calculateFloorCost(data, lvl) {
  const { baseCost, additive, exp0, exp10, exp20, exp30, exp40, exp50 } = data;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  if (lvl >= 10 && exp10) cost *= Math.pow(exp10, lvl - 9);
  if (lvl >= 20 && exp20) cost *= Math.pow(exp20, lvl - 19);
  if (lvl >= 30 && exp30) cost *= Math.pow(exp30, lvl - 29);
  if (lvl >= 40 && exp40) cost *= Math.pow(exp40, lvl - 39);
  if (lvl >= 50 && exp50) cost *= Math.pow(exp50, lvl - 49);
  
  return Math.floor(cost);
}

/**
 * Calculate cost using ROUND formula (same as FLOOR but rounded to 3 decimals)
 */
function calculateRoundCost(data, lvl) {
  const { baseCost, additive, exp0, exp10, exp20, exp30, exp40, exp50 } = data;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  if (lvl >= 10 && exp10) cost *= Math.pow(exp10, lvl - 9);
  if (lvl >= 20 && exp20) cost *= Math.pow(exp20, lvl - 19);
  if (lvl >= 30 && exp30) cost *= Math.pow(exp30, lvl - 29);
  if (lvl >= 40 && exp40) cost *= Math.pow(exp40, lvl - 39);
  if (lvl >= 50 && exp50) cost *= Math.pow(exp50, lvl - 49);
  
  return Math.round(cost * 1000) / 1000;
}

/**
 * Calculate cost using FIXED formula (lookup from array)
 * Returns "MAX" if level exceeds available fixed costs
 */
function calculateFixedCost(data, lvl) {
  const { fixedCosts } = data;
  if (!fixedCosts || lvl >= fixedCosts.length) return Infinity; // MAX level reached
  return fixedCosts[lvl];
}

/**
 * Get the relic number from relic ID (e.g., 'r5' -> 5, 'r12' -> 12)
 */
function getRelicNumber(relicId) {
  const match = relicId.match(/^r(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Cost calculation functions for each relic
 * Returns the cost in fragments for the NEXT level (from currentLevel to currentLevel+1)
 */
export const RELIC_COSTS = {
  // Tier 1 Relics
  r1: (level) => calculateFloorCost(RELIC_DATA.r1, level),
  r2: (level) => calculateRoundCost(RELIC_DATA.r2, level),
  r3: (level) => calculateRoundCost(RELIC_DATA.r3, level),
  r4: (level) => calculateRoundCost(RELIC_DATA.r4, level),
  r5: (level) => calculateFixedCost(RELIC_DATA.r5, level),
  r6: (level) => calculateFixedCost(RELIC_DATA.r6, level),
  r7: (level) => calculateFloorCost(RELIC_DATA.r7, level),
  r8: (level) => calculateFloorCost(RELIC_DATA.r8, level),
  r9: (level) => calculateFloorCost(RELIC_DATA.r9, level),
  r10: (level) => calculateFixedCost(RELIC_DATA.r10, level),
  r11: (level) => calculateFixedCost(RELIC_DATA.r11, level),
  r12: (level) => calculateFloorCost(RELIC_DATA.r12, level),
  r13: (level) => calculateFloorCost(RELIC_DATA.r13, level),
  r14: (level) => calculateFixedCost(RELIC_DATA.r14, level),
  r15: (level) => calculateFixedCost(RELIC_DATA.r15, level),
  r16: (level) => calculateFloorCost(RELIC_DATA.r16, level),
  r17: (level) => calculateFloorCost(RELIC_DATA.r17, level),
  r18: (level) => calculateFloorCost(RELIC_DATA.r18, level),
  r19: (level) => calculateFixedCost(RELIC_DATA.r19, level),
  r20: (level) => calculateFloorCost(RELIC_DATA.r20, level),
  // Tier 2 Relics - TODO: Add when formulas are known
  t2r1: (level) => 0,
  t2r2: (level) => 0,
  t2r3: (level) => 0,
  t2r4: (level) => 0,
  t2r5: (level) => 0,
  t2r6: (level) => 0,
  t2r7: (level) => 0,
  t2r8: (level) => 0,
  t2r9: (level) => 0,
  t2r10: (level) => 0,
};

/**
 * Get relic data including bonus value
 */
export function getRelicData(relicId) {
  return RELIC_DATA[relicId] || null;
}

/**
 * Get max level for a relic (for FIXED relics, based on fixedCosts length)
 */
export function getRelicMaxLevel(relicId) {
  const data = RELIC_DATA[relicId];
  if (!data) return 0;
  if (data.fixedCosts) return data.fixedCosts.length;
  if (data.maxLevel) return data.maxLevel;
  return 100; // Default max for formula-based relics
}

/**
 * Calculate total cost to reach a target level from current level
 */
export function calculateTotalCost(relicId, fromLevel, toLevel) {
  const costFn = RELIC_COSTS[relicId];
  if (!costFn) return 0;
  
  let total = 0;
  for (let lvl = fromLevel; lvl < toLevel; lvl++) {
    total += costFn(lvl);
  }
  return total;
}

export const RELICS = {
  // ==================== TIER 1 RELICS ====================
  r1: {
    id: 'r1',
    name: 'Relic 1',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r1,
  },
  r2: {
    id: 'r2',
    name: 'Relic 2',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r2,
  },
  r3: {
    id: 'r3',
    name: 'Relic 3',
    description: 'Increase mission speed',
    tier: 1,
    maxLevel: 100, 
    effectType: 'mission_speed',
    // +0.03 per level (additive), so level 10 = 1 + (10 * 0.03) = 1.3x
    effectPerLevel: 0.03,
    isAdditive: true,
    getCost: RELIC_COSTS.r3,
  },
  r4: {
    id: 'r4',
    name: 'Relic 4',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r4,
  },
  r5: {
    id: 'r5',
    name: 'Relic 5',
    description: 'Increase farm fragments',
    tier: 1,
    maxLevel: 8,
    canBeUpgraded: true, // Max level can be increased by other upgrades
    effectType: 'farm_fragments_add',
    // +0.001 per level (additive to base farm frags)
    effectPerLevel: 0.001,
    getCost: RELIC_COSTS.r5,
  },
  r6: {
    id: 'r6',
    name: 'Relic 6',
    description: 'Increase campaign fragments',
    tier: 1,
    maxLevel: 8,
    canBeUpgraded: true, // Max level can be increased by other upgrades
    effectType: 'campaign_fragments',
    // Complex effect: +2.75 additive AND *1.05 multiplier per level
    effects: {
      additive: 2.75,
      multiplier: 1.05,
    },
    getCost: RELIC_COSTS.r6,
  },
  r7: {
    id: 'r7',
    name: 'Relic 7',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r7,
  },
  r8: {
    id: 'r8',
    name: 'Relic 8',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r8,
  },
  r9: {
    id: 'r9',
    name: 'Relic 9',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r9,
  },
  r10: {
    id: 'r10',
    name: 'Relic 10',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r10,
  },
  r11: {
    id: 'r11',
    name: 'Relic 11',
    description: 'Increase campaign max personnel',
    tier: 1,
    maxLevel: 100, 
    effectType: 'campaign_max_crew',
    // +50% per level (additive), so level 2 = 1 + (2 * 0.5) = 2x capacity
    effectPerLevel: 0.5,
    isAdditive: true,
    getCost: RELIC_COSTS.r11,
  },
  r12: {
    id: 'r12',
    name: 'Relic 12',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r12,
  },
  r13: {
    id: 'r13',
    name: 'Relic 13',
    description: 'TBD',
    tier: 1,
    maxLevel: 200,
    getCost: RELIC_COSTS.r13,
  },
  r14: {
    id: 'r14',
    name: 'Relic 14',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r14,
  },
  r15: {
    id: 'r15',
    name: 'Relic 15',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r15,
  },
  r16: {
    id: 'r16',
    name: 'Relic 16',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r16,
  },
  r17: {
    id: 'r17',
    name: 'Relic 17',
    description: 'TBD',
    tier: 1,
    maxLevel: 200,
    getCost: RELIC_COSTS.r17,
  },
  r18: {
    id: 'r18',
    name: 'Relic 18',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r18,
  },
  r19: {
    id: 'r19',
    name: 'Relic 19',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r19,
  },
  r20: {
    id: 'r20',
    name: 'Relic 20',
    description: 'TBD',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r20,
  },
  
  // ==================== TIER 2 RELICS ====================
  t2r1: {
    id: 't2r1',
    name: 'Tier 2 Relic 1',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r1,
  },
  t2r2: {
    id: 't2r2',
    name: 'Tier 2 Relic 2',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r2,
  },
  t2r3: {
    id: 't2r3',
    name: 'Tier 2 Relic 3',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r3,
  },
  t2r4: {
    id: 't2r4',
    name: 'Tier 2 Relic 4',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r4,
  },
  t2r5: {
    id: 't2r5',
    name: 'Tier 2 Relic 5',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r5,
  },
  t2r6: {
    id: 't2r6',
    name: 'Tier 2 Relic 6',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r6,
  },
  t2r7: {
    id: 't2r7',
    name: 'Tier 2 Relic 7',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r7,
  },
  t2r8: {
    id: 't2r8',
    name: 'Tier 2 Relic 8',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r8,
  },
  t2r9: {
    id: 't2r9',
    name: 'Tier 2 Relic 9',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r9,
  },
  t2r10: {
    id: 't2r10',
    name: 'Tier 2 Relic 10',
    description: 'TBD',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r10,
  },
};

/**
 * Get relics by tier
 */
export function getRelicsByTier(tier) {
  return Object.values(RELICS).filter(r => r.tier === tier);
}

/**
 * Get all Tier 1 relics
 */
export function getTier1Relics() {
  return getRelicsByTier(1);
}

/**
 * Get all Tier 2 relics
 */
export function getTier2Relics() {
  return getRelicsByTier(2);
}

// ==================== LEGACY CALCULATION FUNCTIONS ====================
// These functions use the old relic_X naming convention for backwards compatibility

/**
 * Calculate mission speed bonus from Relic 3
 * @param {number} level - Relic 3 level
 * @returns {number} Mission speed multiplier (e.g., 1.3 for level 10)
 */
export function calculateRelic3MissionSpeed(level) {
  if (level <= 0) return 1.0;
  // 1 + (level * 0.03)
  return 1 + (level * RELICS.r3.effectPerLevel);
}

/**
 * Calculate farm fragments additive bonus from Relic 5
 * @param {number} level - Relic 5 level
 * @returns {number} Additive farm fragments bonus
 */
export function calculateRelic5FarmFrags(level) {
  if (level <= 0) return 0;
  return level * RELICS.r5.effectPerLevel;
}

/**
 * Calculate campaign fragments bonuses from Relic 6
 * @param {number} level - Relic 6 level
 * @returns {object} { additive: number, multiplier: number }
 */
export function calculateRelic6CampaignFrags(level) {
  if (level <= 0) return { additive: 0, multiplier: 1.0 };
  
  const additive = level * RELICS.r6.effects.additive;
  const multiplier = Math.pow(RELICS.r6.effects.multiplier, level);
  
  return { additive, multiplier };
}

/**
 * Calculate campaign max crew multiplier from Relic 11
 * @param {number} level - Relic 11 level
 * @returns {number} Max crew multiplier (e.g., 2.0 for level 2)
 */
export function calculateRelic11MaxCrew(level) {
  if (level <= 0) return 1.0;
  // 1 + (level * 0.5)
  return 1 + (level * RELICS.r11.effectPerLevel);
}

/**
 * Get all relic effects combined
 * @param {object} relicLevels - Object with relic IDs and their levels
 * @returns {object} Combined relic effects
 */
export function getRelicEffects(relicLevels) {
  // Support both old (relic_3) and new (r3) naming
  const relic3Level = relicLevels.r3 || relicLevels.relic_3 || 0;
  const relic5Level = relicLevels.r5 || relicLevels.relic_5 || 0;
  const relic6Level = relicLevels.r6 || relicLevels.relic_6 || 0;
  const relic11Level = relicLevels.r11 || relicLevels.relic_11 || 0;
  
  const relic6Effects = calculateRelic6CampaignFrags(relic6Level);
  
  return {
    missionSpeedMultiplier: calculateRelic3MissionSpeed(relic3Level),
    farmFragsAdditive: calculateRelic5FarmFrags(relic5Level),
    campaignFragsAdditive: relic6Effects.additive,
    campaignFragsMultiplier: relic6Effects.multiplier,
    campaignMaxCrewMultiplier: calculateRelic11MaxCrew(relic11Level),
    
    // Individual levels for reference
    levels: {
      r3: relic3Level,
      r5: relic5Level,
      r6: relic6Level,
      r11: relic11Level,
    },
  };
}
