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
  r5:  { bonus: 0.001, baseCost: 1,    additive: 120,  exp0: 4400,  fixedCosts: [1, 120, 4400, 6200, 15200, 18500, 24000, 30000, 44000, 56000, 72000, 144000, 216000, 288000, 360000, 978000, 1040000, 5760000, 6480000, 720000, 7920000] },
  r6:  { bonus: 2.75,  baseCost: 30,   additive: 450,  exp0: 1070,  fixedCosts: [30, 450, 1070, 2500, 6700, 7000, 7600, 8500, 12000, 16000, 32000, 2510000, 5000000, 11070000, 10000000, 12500000] },
  r7:  { bonus: 1.05,  baseCost: 2,    additive: 1.8,  exp0: 1.14,  exp10: 1.01,  exp20: 1.02,   exp30: 1,     exp40: 1,    exp50: null },
  r8:  { bonus: 5,     baseCost: 5,    additive: 4,    exp0: 1.2,   exp10: 1.1,   exp20: 1,      exp30: 1,     exp40: null, exp50: null },
  r9:  { bonus: 1.08,  baseCost: 8,    additive: 1.8,  exp0: 1.18,  exp10: 1.03,  exp20: 1.08,   exp30: 1,     exp40: 1,    exp50: 1 },
  r10: { bonus: 1.08,  baseCost: 2,    additive: 15,   exp0: 72,    fixedCosts: [2, 15, 72, 257, 594, 1691, 3140, 18861, 139150, 1860000, 2200000, 9000000, 36000000] },
  r11: { bonus: 2,     baseCost: 3,    additive: 65,   exp0: 305,   fixedCosts: [3, 65, 305, 2055, 4805, 8555, 15000, 27500, 575000, 750000, 1400000, 1500000, 2000000] },
  r12: { bonus: 0.5,   baseCost: 50,   additive: 30,   exp0: 1.09,  exp10: 1.01,  exp20: 1,      exp30: 1,     exp40: 1.00372, exp50: 1.0534 },
  r13: { bonus: 468,   baseCost: 10,   additive: 1.13, exp0: 1.013, exp10: 1.012, exp20: 1,      exp30: 1,     exp40: 1,    exp50: 1.00378, maxLevel: 200 },
  r14: { bonus: 468,   baseCost: 20,   additive: 100,  exp0: 320,   fixedCosts: [20, 100, 320, 880, 2240, 5440, 12800, 29440] },
  r15: { bonus: 1,     baseCost: 30,   additive: 140,  exp0: 440,   fixedCosts: [30, 140, 440, 1200, 3040, 7360, 17280, 39680, 89000, 196000, 420000, 880000, 1800000] },
  r16: { bonus: 0.03,  baseCost: 40,   additive: 5,    exp0: 1.08,  exp10: 1.028, exp20: 1,      exp30: 1,     exp40: null, exp50: null },
  r17: { bonus: 0.03,  baseCost: 50,   additive: 6,    exp0: 1.1,   exp10: 1.037, exp20: 1,      exp30: 1,     exp40: null, exp50: null },
  r18: { bonus: 365,   baseCost: 60,   additive: 6,    exp0: 1.03,  exp10: 1.01,  exp20: 1.02,   exp30: 1,     exp40: null, exp50: null, maxLevel: 200 },
  r19: { bonus: 365,   baseCost: 666,  additive: 1289, exp0: 2446,  fixedCosts: [666, 1289, 2446, 4569, 8428, 15390, 27871, 50121, 3140000, 16000000, 17780000, 180000000, 600000000] },
  r20: { bonus: 2,     baseCost: 1000, additive: 50,   exp0: 1.2,   exp10: 1,     exp20: 1,      exp30: 1,     exp40: 1,    exp50: null },
  // Tier 2 Relics - Official formulas from dev
  // Formula: floor((startCost + additive * lvl) * exp0^lvl * iterative^max(0, lvl - threshold))
  t2r1: { bonus: 0, baseCost: 120000, additive: 250000, exp0: 11, iterativeExp: 1.1, iterativeThreshold: 3, maxLevel: 10 },
  t2r2: { bonus: 0, baseCost: 120000, additive: 100000, exp0: 1.085, iterativeExp: 1.04, iterativeThreshold: 20, maxLevel: 100 },
  t2r3: { bonus: 0, baseCost: 550000, additive: 80000, exp0: 1.7, iterativeExp: 1.02, iterativeThreshold: 10, maxLevel: 80 },
  t2r4: { bonus: 0, baseCost: 3000000, additive: 50000, exp0: 1.2, iterativeExp: 1.08, iterativeN: 4, maxLevel: 25 },
  t2r5: { bonus: 0, baseCost: 1300000, additive: 300000, exp0: 1.35, iterativeExp: 1.04, iterativeN: 5, maxLevel: 100 },
  t2r6: { bonus: 0, baseCost: 1000000, additive: 2000000, exp0: 1.11, iterativeExp: 1.06, iterativeN: 4, maxLevel: 40 },
  t2r7: { bonus: 0, baseCost: 300000, additive: 850000, exp0: 1.71, iterativeExp: 1.09, iterativeThreshold: 8, maxLevel: 40 },
  t2r8: { bonus: 1.021, baseCost: 2100000, additive: 840000, exp0: 1.42, iterativeExp: 1.21, iterativeN: 4, maxLevel: 21 },
  t2r9: { baseCost: 800000, additive: 80000, exp0: 1.45, maxLevel: 100 },
  t2r10: { bonus: 0, baseCost: 6000000, additive: 80000, exp0: 15, iterativeExp: 21, iterativeThreshold: 1, maxLevel: 5 },
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
  const { baseCost, additive, exp0, exp5, exp10, exp15, exp20, exp25, exp30, exp35, exp40, exp45, exp50 } = data;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  if (lvl >= 5  && exp5)  cost *= Math.pow(exp5,  lvl - 4);
  if (lvl >= 10 && exp10) cost *= Math.pow(exp10, lvl - 9);
  if (lvl >= 15 && exp15) cost *= Math.pow(exp15, lvl - 14);
  if (lvl >= 20 && exp20) cost *= Math.pow(exp20, lvl - 19);
  if (lvl >= 25 && exp25) cost *= Math.pow(exp25, lvl - 24);
  if (lvl >= 30 && exp30) cost *= Math.pow(exp30, lvl - 29);
  if (lvl >= 35 && exp35) cost *= Math.pow(exp35, lvl - 34);
  if (lvl >= 40 && exp40) cost *= Math.pow(exp40, lvl - 39);
  if (lvl >= 45 && exp45) cost *= Math.pow(exp45, lvl - 44);
  if (lvl >= 50 && exp50) cost *= Math.pow(exp50, lvl - 49);
  
  return Math.floor(cost);
}

/**
 * Calculate cost using ROUND formula (same as FLOOR but rounded to 3 decimals)
 */
function calculateRoundCost(data, lvl) {
  const { baseCost, additive, exp0, exp5, exp10, exp15, exp20, exp25, exp30, exp35, exp40, exp45, exp50 } = data;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  if (lvl >= 5  && exp5)  cost *= Math.pow(exp5,  lvl - 4);
  if (lvl >= 10 && exp10) cost *= Math.pow(exp10, lvl - 9);
  if (lvl >= 15 && exp15) cost *= Math.pow(exp15, lvl - 14);
  if (lvl >= 20 && exp20) cost *= Math.pow(exp20, lvl - 19);
  if (lvl >= 25 && exp25) cost *= Math.pow(exp25, lvl - 24);
  if (lvl >= 30 && exp30) cost *= Math.pow(exp30, lvl - 29);
  if (lvl >= 35 && exp35) cost *= Math.pow(exp35, lvl - 34);
  if (lvl >= 40 && exp40) cost *= Math.pow(exp40, lvl - 39);
  if (lvl >= 45 && exp45) cost *= Math.pow(exp45, lvl - 44);
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
 * Calculate cost for Tier 2 relics
 * Formula: floor((baseCost + additive * lvl) * exp0^lvl * iterativeExp^max(0, lvl - threshold + 1))
 */
function calculateT2Cost(data, lvl) {
  const { baseCost, additive, exp0, iterativeExp, iterativeThreshold } = data;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  // Apply iterative multiplier if level >= threshold
  if (iterativeExp && iterativeThreshold && lvl >= iterativeThreshold) {
    cost *= Math.pow(iterativeExp, lvl - iterativeThreshold + 1);
  }
  
  return Math.floor(cost);
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
  // Tier 2 Relics 
  t2r1: (level) => calculateT2Cost(RELIC_DATA.t2r1, level),
  t2r2: (level) => calculateT2Cost(RELIC_DATA.t2r2, level),
  t2r3: (level) => calculateT2Cost(RELIC_DATA.t2r3, level),
  t2r4: (level) => {
    // Special formula: multiple thresholds every n=4 levels
    const d = RELIC_DATA.t2r4;
    let cost = (d.baseCost + d.additive * level) * Math.pow(d.exp0, level);
    
    // Calculate total iterations: for each threshold 0, 4, 8, ... <= level
    let totalIterations = 0;
    for (let i = 0; i * d.iterativeN <= level; i++) {
      totalIterations += level - (d.iterativeN * i - 1);
    }
    cost *= Math.pow(d.iterativeExp, totalIterations);
    
    return Math.floor(cost);
  },
  t2r5: (level) => {
    // Special formula: multiple thresholds every n=5 levels
    const d = RELIC_DATA.t2r5;
    let cost = (d.baseCost + d.additive * level) * Math.pow(d.exp0, level);
    
    // Calculate total iterations: for each threshold 0, 5, 10, ... <= level
    let totalIterations = 0;
    for (let i = 0; i * d.iterativeN <= level; i++) {
      totalIterations += level - (d.iterativeN * i - 1);
    }
    cost *= Math.pow(d.iterativeExp, totalIterations);
    
    return Math.floor(cost);
  },
  t2r6: (level) => {
    // Special formula: multiple thresholds every n=4 levels
    const d = RELIC_DATA.t2r6;
    let cost = (d.baseCost + d.additive * level) * Math.pow(d.exp0, level);
    
    // Calculate total iterations: for each threshold 0, 4, 8, ... <= level
    let totalIterations = 0;
    for (let i = 0; i * d.iterativeN <= level; i++) {
      totalIterations += level - (d.iterativeN * i - 1);
    }
    cost *= Math.pow(d.iterativeExp, totalIterations);
    
    return Math.floor(cost);
  },
  t2r7: (level) => calculateT2Cost(RELIC_DATA.t2r7, level),
  t2r8: (level) => {
    // Special formula: multiple thresholds every n=4 levels
    const d = RELIC_DATA.t2r8;
    let cost = (d.baseCost + d.additive * level) * Math.pow(d.exp0, level);
    
    // Calculate total iterations: for each threshold 0, 4, 8, ... <= level
    let totalIterations = 0;
    for (let i = 0; i * d.iterativeN <= level; i++) {
      totalIterations += level - (d.iterativeN * i - 1);
    }
    cost *= Math.pow(d.iterativeExp, totalIterations);
    
    return Math.floor(cost);
  },
  t2r9: (level) => calculateFloorCost(RELIC_DATA.t2r9, level),
  t2r10: (level) => calculateT2Cost(RELIC_DATA.t2r10, level),
};

/**
 * Get relic data including bonus value
 */
export function getRelicData(relicId) {
  return RELIC_DATA[relicId] || null;
}

/**
 * Check if a relic has a valid cost formula for a specific level
 * Returns false if the cost would be NaN, Infinity, 0 (for unknown), or undefined
 */
export function hasValidCostForLevel(relicId, level) {
  const costFn = RELIC_COSTS[relicId];
  if (!costFn) return false;
  
  const cost = costFn(level);
  
  // Invalid if: NaN, Infinity, undefined, null, 0 (for T2 relics without formulas), or negative
  if (cost === null || cost === undefined || cost === 0) return false;
  if (Number.isNaN(cost) || !Number.isFinite(cost)) return false;
  if (cost < 0) return false;
  
  return true;
}

/**
 * Get the base max level for a relic (without bonuses like Exodus Node 3)
 * This represents the level up to which we have valid cost data
 */
export function getRelicBaseCostMaxLevel(relicId) {
  const data = RELIC_DATA[relicId];
  if (!data) return 0;
  
  // For FIXED relics, max level is the length of fixedCosts array
  if (data.fixedCosts) return data.fixedCosts.length;
  
  // For relics with explicit maxLevel in data
  if (data.maxLevel) return data.maxLevel;
  
  // For formula-based relics, return 100 (default)
  return 100;
}

/**
 * Get max level for a relic
 * @param {string} relicId - The relic ID (e.g., 'r5', 'r6')
 * @param {number} bonusLevels - Additional max levels from bonuses (e.g., Exodus Node 3, Power Node 1)
 * @returns {number} The maximum achievable level
 */
export function getRelicMaxLevel(relicId, bonusLevels = 0) {
  const relic = RELICS[relicId];
  const data = RELIC_DATA[relicId];
  
  if (!relic && !data) return 0;
  
  // Get base max level from RELICS definition (preferred) or RELIC_DATA
  const baseMax = relic?.maxLevel || data?.maxLevel || 100;
  
  // Apply bonus levels (e.g., from Exodus Node 3, Power Node 1)
  // No cap - upgrades can exceed available cost data
  return baseMax + bonusLevels;
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
    name: 'The Omnicrum Compendium',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r1,
    description: 'Meltdown +0.004',
  },
  r2: {
    id: 'r2',
    name: 'The Omni-Cell',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r2,
    description: 'Cells x1e11',
  },
  r3: {
    id: 'r3',
    name: 'The Time-Glider Engine',
    tier: 1,
    maxLevel: 100, 
    effectType: 'mission_speed',
    // +0.03 per level (additive), so level 10 = 1 + (10 * 0.03) = 1.3x
    effectPerLevel: 0.03,
    isAdditive: true,
    getCost: RELIC_COSTS.r3,
    description: 'Mission Speed +3%',
  },
  r4: {
    id: 'r4',
    name: 'The Disk of Dawn',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r4,
    description: 'Borge & Ozzy HP +1.03x',
  },
  r5: {
    id: 'r5',
    name: 'The Portable Pocket Dimension Storage Unit',
    tier: 1,
    maxLevel: 8,
    canBeUpgraded: true, // Max level can be increased by other upgrades
    effectType: 'farm_fragments_add',
    // +0.001 per level (additive to base farm frags)
    effectPerLevel: 0.001,
    getCost: RELIC_COSTS.r5,
    description: 'Farm Fragments +0.001',
  },
  r6: {
    id: 'r6',
    name: 'The Spaceshop Sized Pocket Dimension Storage Unit',
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
    description: 'Campaign Fragments +2.75 and *1.05',
  },
  r7: {
    id: 'r7',
    name: 'Manifestation Core: Titan',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r7,
    description: 'Borge & Ozzy Loot x1.05',
  },
  r8: {
    id: 'r8',
    name: 'The C.O.O.R.S',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r8,
    description: 'Mechs Cap x1e5',
  },
  r9: {
    id: 'r9',
    name: 'Fractalized Ether Crystal',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r9,
    description: 'OO x1.08',
  },
  r10: {
    id: 'r10',
    name: 'The Feii Constructatron',
    tier: 1,
    maxLevel: 8,
    getCost: RELIC_COSTS.r10,
    description: 'Construction Project Speed +200%',
  },
  r11: {
    id: 'r11',
    name: 'The Lahnarian Fleet Carrier',
    tier: 1,
    maxLevel: 8, 
    effectType: 'campaign_max_crew',
    // +50% per level (additive), so level 2 = 1 + (2 * 0.5) = 2x capacity
    effectPerLevel: 0.5,
    isAdditive: true,
    getCost: RELIC_COSTS.r11,
    description: 'Campaign Max Crew +1.5x',
  },
  r12: {
    id: 'r12',
    name: 'The Sirred Zagreus Circumnavigator',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r12,
    description: 'LR Requirement -80',
  },
  r13: {
    id: 'r13',
    name: 'The C.H.A.D Bank Cap Capacitor',
    tier: 1,
    maxLevel: 200,
    getCost: RELIC_COSTS.r13,
    description: 'Token Bank Increase',
  },
  r14: {
    id: 'r14',
    name: 'The Liquid Luni Lesstrogen Tank',
    tier: 1,
    maxLevel: 8,
    getCost: RELIC_COSTS.r14,
    description: '-1 Tick for Shard Operations',
  },
  r15: {
    id: 'r15',
    name: 'The Tulstandstof Mech Creator Kit',
    tier: 1,
    maxLevel: 8,
    getCost: RELIC_COSTS.r15,
    description: 'Max Lvl Time Upgrades for Mechs +5',
  },
  r16: {
    id: 'r16',
    name: 'The Long-Range Artillery Crawler',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r16,
    description: 'Borge ATK +1.03x',
  },
  r17: {
    id: 'r17',
    name: 'The Bee-Gone Companion Drone',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r17,
    description: 'Ozzy ATK +1.03x',
  },
  r18: {
    id: 'r18',
    name: 'The Cosmic Chromos Communication Cell',
    tier: 1,
    maxLevel: 200,
    getCost: RELIC_COSTS.r18,
    description: 'Token Chest Gain +365',
  },
  r19: {
    id: 'r19',
    name: 'The Book Of Mephisto',
    tier: 1,
    maxLevel: 8,
    getCost: RELIC_COSTS.r19,
    description: 'Borge EXP x2',
  },
  r20: {
    id: 'r20',
    name: 'The Chrystonian Prism',
    tier: 1,
    maxLevel: 100,
    getCost: RELIC_COSTS.r20,
    description: 'Cells, All Gens, MP, Shards, RP, AP & Mats x8',
  },
  
  // ==================== TIER 2 RELICS ====================
  t2r1: {
    id: 't2r1',
    name: 'The Abysuus Amplifier',
    description: '+1 Ultima Level',
    tier: 2,
    maxLevel: 10,
    getCost: RELIC_COSTS.t2r1,
  },
  t2r2: {
    id: 't2r2',
    name: 'Wangbian Wheel of Fortune',
    description: 'Mats x1.8',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r2,
  },
  t2r3: {
    id: 't2r3',
    name: 'Ouroboros Spare Component',
    description: 'Ouro Ship 1 free Level',
    tier: 2,
    maxLevel: 80,
    getCost: RELIC_COSTS.t2r3,
  },
  t2r4: {
    id: 't2r4',
    name: 'The Heavenroad Reactor',
    description: 'Catchup Timer +1.02x',
    tier: 2,
    maxLevel: 25,
    getCost: RELIC_COSTS.t2r4,
  },
  t2r5: {
    id: 't2r5',
    name: 'The Gorgon Eye',
    description: 'Knox Loot x1.08',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r5,
  },
  t2r6: {
    id: 't2r6',
    name: 'Taskmaster Ylith\'s Wisdom',
    description: 'LP Upgrades +0.02^',
    tier: 2,
    maxLevel: 40,
    getCost: RELIC_COSTS.t2r6,
  },
  t2r7: {
    id: 't2r7',
    name: 'Arthur\'s Sword',
    description: 'Borge, Ozzy & Knox ATK x1.02',
    tier: 2,
    maxLevel: 40,
    getCost: RELIC_COSTS.t2r7,
  },
  t2r8: {
    id: 't2r8',
    name: 'The D21',
    description: 'All Frags x1.021',
    tier: 2,
    maxLevel: 21,
    effectType: 'all_fragments_multiplier',
    // x1.021 per level (multiplicative), so level 10 = 1.021^10 = ~1.23x
    effectPerLevel: 1.021,
    isMultiplicative: true,
    getCost: RELIC_COSTS.t2r8,
  },
  t2r9: {
    id: 't2r9',
    name: 'The Exceptional Experience Datalog',
    description: 'LP +100',
    tier: 2,
    maxLevel: 100,
    getCost: RELIC_COSTS.t2r9,
  },
  t2r10: {
    id: 't2r10',
    name: 'Nim\'s Micronebula',
    description: 'OO +0.05% per mech owned',
    tier: 2,
    maxLevel: 5,
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
 * Calculate all fragments multiplier from T2 Relic 8
 * @param {number} level - T2R8 level
 * @returns {number} Fragment multiplier (e.g., 1.021^10 = ~1.23 for level 10)
 */
export function calculateT2R8FragmentMultiplier(level) {
  if (level <= 0) return 1.0;
  // 1.021^level (multiplicative)
  return Math.pow(RELICS.t2r8.effectPerLevel, level);
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
  const t2r8Level = relicLevels.t2r8 || 0;
  
  const relic6Effects = calculateRelic6CampaignFrags(relic6Level);
  const t2r8Multiplier = calculateT2R8FragmentMultiplier(t2r8Level);
  
  return {
    missionSpeedMultiplier: calculateRelic3MissionSpeed(relic3Level),
    farmFragsAdditive: calculateRelic5FarmFrags(relic5Level),
    campaignFragsAdditive: relic6Effects.additive,
    campaignFragsMultiplier: relic6Effects.multiplier,
    campaignMaxCrewMultiplier: calculateRelic11MaxCrew(relic11Level),
    allFragmentsMultiplier: t2r8Multiplier, // T2R8: applies to both farm and campaign
    
    // Individual levels for reference
    levels: {
      r3: relic3Level,
      r5: relic5Level,
      r6: relic6Level,
      r11: relic11Level,
      t2r8: t2r8Level,
    },
  };
}
