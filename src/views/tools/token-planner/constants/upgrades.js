/**
 * Token Planner Upgrade Definitions
 * 
 * Base Max Cap (defaultMax):
 * - T1: increases by 1000 per max level setting
 * - T2: increases by 500 per max level setting
 * - T3: increases by 500 per max level setting
 * 
 * Cost Formula per level:
 * - baseCost = startingCost + (level * scalingCost)
 * - if level < defaultMax: multiplier = 1
 * - else: multiplier = costBumps[floor((level - defaultMax) / bumpInterval)]
 * 
 * Cost Bumps are CUMULATIVE multipliers applied when exceeding defaultMax
 */

// Cap increase per max level setting
export const CAP_INCREASE = {
  t1: 1000,
  t2: 500,
  t3: 500
};

// Bump interval (levels per cost bump tier)
export const BUMP_INTERVAL = {
  t1: 1000,
  t2: 500,
  t3: 500
};

// T1 Upgrades
// resourceType: 'cells' | 'mp' - what resource this upgrade produces (affects multiplier calculation)
export const T1_UPGRADES = [
  { 
    id: 'mp', 
    name: 'MP', 
    resourceType: 'mp', 
    defaultMax: 200,
    startingCost: 10,
    scalingCost: 2,
    costBumps: [10, 20, 40, 44, 48.4, 53.24, 53.24, 53.24, 53.24, 53.24],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 53.24,
      multiplier: 1.8,
      levelCoeff: 0.0002
    }
  },
  { 
    id: 'mk1_gen', 
    name: 'Mk1 Gen', 
    resourceType: 'cells',  
    defaultMax: 5000,
    startingCost: 1,
    scalingCost: 0.1,
    costBumps: [10, 20, 22, 24.2, 26.62, 29.282, 29.282, 29.282, 29.282, 29.282],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 29.282,
      multiplier: 1.1,
      levelCoeff: 0.0001
    }
  },
  { 
    id: 'mk2_gen', 
    name: 'Mk2 Gen', 
    resourceType: 'cells',
    defaultMax: 5000,
    startingCost: 2,
    scalingCost: 0.12,
    costBumps: [10, 20, 22, 24.2, 26.62, 29.282, 29.282, 29.282, 29.282, 29.282],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 29.282,
      multiplier: 1.1,
      levelCoeff: 0.0001
    }
  },
  { 
    id: 'mk3_gen', 
    name: 'Mk3 Gen', 
    resourceType: 'cells',
    defaultMax: 5000,
    startingCost: 3,
    scalingCost: 0.13,
    costBumps: [10, 20, 22, 24.2, 26.62, 29.282, 29.282, 29.282, 29.282, 29.282],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 29.282,
      multiplier: 1.1,
      levelCoeff: 0.0001
    }
  },
  { 
    id: 'mk4_gen', 
    name: 'Mk4 Gen', 
    resourceType: 'cells',
    defaultMax: 5000,
    startingCost: 4,
    scalingCost: 0.14,
    costBumps: [10, 20, 22, 24.2, 26.62, 29.282, 29.282, 29.282, 29.282, 29.282],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 29.282,
      multiplier: 1.1,
      levelCoeff: 0.0001
    }
  },
  { 
    id: 'mk5_gen', 
    name: 'Mk5 Gen', 
    resourceType: 'cells',
    defaultMax: 5000,
    startingCost: 15,
    scalingCost: 0.15,
    costBumps: [10, 20, 22, 24.2, 26.62, 29.282, 29.282, 29.282, 29.282, 29.282],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 29.282,
      multiplier: 1.1,
      levelCoeff: 0.0001
    }
  },
  { 
    id: 'mk6_gen', 
    name: 'Mk6 Gen', 
    resourceType: 'cells',
    defaultMax: 5000,
    startingCost: 26,
    scalingCost: 0.16,
    costBumps: [10, 20, 22, 24.2, 26.62, 29.282, 29.282, 29.282, 29.282, 29.282],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 29.282,
      multiplier: 1.1,
      levelCoeff: 0.0001
    }
  },
  { 
    id: 'mk7_gen', 
    name: 'Mk7 Gen', 
    resourceType: 'cells',
    defaultMax: 5000,
    startingCost: 37,
    scalingCost: 0.2,
    costBumps: [10, 20, 22, 24.2, 26.62, 29.282, 29.282, 29.282, 29.282, 29.282],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 29.282,
      multiplier: 1.1,
      levelCoeff: 0.0001
    }
  },
  { 
    id: 'mk8_gen', 
    name: 'Mk8 Gen', 
    resourceType: 'cells',
    defaultMax: 5000,
    startingCost: 48,
    scalingCost: 0.3,
    costBumps: [10, 20, 22, 24.2, 26.62, 29.282, 29.282, 29.282, 29.282, 29.282],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 29.282,
      multiplier: 1.1,
      levelCoeff: 0.0001
    }
  },
];

// T2 Upgrades
// resourceTypes: Array of resources this upgrade produces (all get tier bonus)
// resourceCount: { resource: count } - multiplier is raised to this power (e.g. 2 gens = cells^2)
export const T2_UPGRADES = [
  { 
    id: 'mp_shards', 
    name: 'MP + Shards', 
    resourceTypes: ['mp', 'shards'],
    defaultMax: 500,
    startingCost: 1275,
    scalingCost: 25,
    costBumps: [5, 10, 19, 34.2, 58.14, 87.21, 87.21, 87.21, 87.21, 87.21],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 87.21,
      multiplier: 1,
      levelCoeff: 0.00025
    }
  },
  { 
    id: 'mk1_mk2_gens', 
    name: 'Mk1 + Mk2 Gens', 
    resourceTypes: ['cells'],
    resourceCount: { cells: 2 },
    defaultMax: 2500,
    startingCost: 75,
    scalingCost: 2,
    costBumps: [5, 10, 11, 12.1, 13.31, 14.641, 14.641, 14.641, 14.641, 14.641],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 14.641,
      multiplier: 1.1,
      levelCoeff: 0.0003
    }
  },
  { 
    id: 'mk3_mk4_gens', 
    name: 'Mk3 + Mk4 Gens', 
    resourceTypes: ['cells'],
    resourceCount: { cells: 2 },
    defaultMax: 2500,
    startingCost: 100,
    scalingCost: 3,
    costBumps: [5, 7.5, 8.25, 9.075, 9.9825, 10.98075, 10.98075, 10.98075, 10.98075, 10.98075],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 10.98075,
      multiplier: 1.1,
      levelCoeff: 0.0003
    }
  },
  { 
    id: 'mk5_mk6_gens', 
    name: 'Mk5 + Mk6 Gens', 
    resourceTypes: ['cells'],
    resourceCount: { cells: 2 },
    defaultMax: 2500,
    startingCost: 125,
    scalingCost: 4,
    costBumps: [5, 7.5, 8.25, 9.075, 9.9825, 10.98075, 10.98075, 10.98075, 10.98075, 10.98075],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 10.98075,
      multiplier: 1.1,
      levelCoeff: 0.0003
    }
  },
  { 
    id: 'mk7_mk8_gens', 
    name: 'Mk7 + Mk8 Gens', 
    resourceTypes: ['cells'],
    resourceCount: { cells: 2 },
    defaultMax: 2500,
    startingCost: 150,
    scalingCost: 5,
    costBumps: [5, 7.5, 8.25, 9.075, 9.9825, 10.98075, 10.98075, 10.98075, 10.98075, 10.98075],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 10.98075,
      multiplier: 1.1,
      levelCoeff: 0.0003
    }
  },
];

// T3 Upgrades
// resourceTypes: Array of resources this upgrade produces (all get tier bonus)
// resourceCount: { resource: count } - multiplier is raised to this power (e.g. 8 gens = cells^8)
export const T3_UPGRADES = [
  { 
    id: 'all_gens_mp_rp', 
    name: 'All Gens + MP + RP', 
    resourceTypes: ['cells', 'mp', 'rp'],
    resourceCount: { cells: 8 },
    defaultMax: 2000,
    startingCost: 7000,
    scalingCost: 100,
    costBumps: [2, 2.4, 2.64, 2.64, 2.904, 3.1944, 3.51384, 3.51384, 3.51384, 3.51384],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 3.51384,
      multiplier: 1.2,
      levelCoeff: 0.00045
    }
  },
  { 
    id: 'all_gens_shards_ap', 
    name: 'All Gens + Shards + AP', 
    resourceTypes: ['cells', 'shards', 'ap'],
    resourceCount: { cells: 8 },
    defaultMax: 2000,
    startingCost: 7000,
    scalingCost: 100,
    costBumps: [2, 2.4, 2.64, 2.64, 2.904, 3.1944, 3.51384, 3.51384, 3.51384, 3.51384],
    postBumpFormula: {
      afterBumpIndex: 10,
      baseBump: 3.51384,
      multiplier: 1.2,
      levelCoeff: 0.00045
    }
  },
];

// T4 Max Level Upgrade Costs (hardcoded, not formula-based)
export const T4_MAX_LEVEL_COSTS = {
  t1: [1.00e7, 3.30e7, 5.40e7, 8.19e7, 1.1466e8, 2.4570e8, 3.9312e8, 6.2653e8, 9.9509e8, 1.58e9, 2.99e9, 4.7e9],
  t2: [5.00e7, 1.80e8, 3.15e8, 5.04e8, 7.371e8, 1.23e9, 2.03e9, 3.32e9, 5.39e9, 8.71e9],
  t3: [2.50e8, 6.00e8, 1.05e9, 1.68e9, 2.46e9, 3.28e9, 4.32e9, 5.66e9, 7.36e9, 9.51e9, 14.27e9]
};

// Base multiplier per level for each tier
export const TIER_MULTIPLIERS = {
  t1: 1.01,
  t2: 1.02,
  t3: 1.03
};

// Token Ultima multipliers per level (meltdown immune)
export const TOKEN_ULTIMA_MULTIPLIERS = {
  cells: 1.001,
  mp: 1.0005,
  shards: 1.0003,
  rp: 1.0002,
  ap: 1.0001
};

/**
 * Calculate the multiplier for a resource type
 * 
 * @param {number} levels - Total levels in the upgrade
 * @param {number} tierMultiplier - Base multiplier per level (1.01, 1.02, or 1.03)
 * @param {number} meltdown - Meltdown value (0-1, e.g., 0.8 for 80% meltdown)
 * @param {number} tokenUltimaMultiplier - Token Ultima multiplier per level (meltdown immune)
 * @returns {number} Final multiplier
 */
export function calculateMultiplier(levels, tierMultiplier, meltdown, tokenUltimaMultiplier) {
  if (levels <= 0) return 1;
  
  // Standard formula: (tierMult^levels)^meltdown * tokenUltima^levels
  const basePower = Math.pow(tierMultiplier, levels);
  const withMeltdown = Math.pow(basePower, meltdown);
  
  // Token Ultima multiplier (meltdown immune): tokenUltimaMult^levels
  const tokenUltima = Math.pow(tokenUltimaMultiplier, levels);
  
  return withMeltdown * tokenUltima;
}

/**
 * Calculate all resource multipliers for an upgrade, considering its resourceType(s)
 * 
 * Formula for most resources: (tierMult^levels)^meltdown * tokenUltima^levels
 * Formula for CELLS only: tokenUltima^levels * tierMult^(count * levels * meltdown²)
 *   - count is the number of gens (1 for T1, 2 for T2 paired gens, 8 for T3 all gens)
 * 
 * Resources that this upgrade produces get the tier bonus + token ultima
 * All other resources only get the Token Ultima bonus (no tier bonus)
 * 
 * Supports both:
 * - resourceType: 'cells' | 'mp' (single resource - T1 upgrades)
 * - resourceTypes: ['cells', 'mp', 'rp'] (multiple resources - T2/T3 upgrades)
 * 
 * resourceCount: { cells: count } - count is multiplied into the exponent for cells
 * 
 * @param {number} levels - Number of levels (currentMax to nextMax)
 * @param {number} tierMultiplier - Base multiplier per level (1.01, 1.02, or 1.03)
 * @param {number} meltdown - Meltdown value (0-1)
 * @param {string|string[]} resourceType - Single resource or array of resources this upgrade produces
 * @param {Object} resourceCount - Optional: { resource: count } - for cells, count goes into exponent
 * @returns {Object} { cells, mp, shards, rp, ap } multipliers
 */
export function calculateUpgradeMultipliers(levels, tierMultiplier, meltdown, resourceType, resourceCount = {}) {
  if (levels <= 0) {
    return { cells: 1, mp: 1, shards: 1, rp: 1, ap: 1 };
  }
  
  // Normalize to array for easier checking
  const producedResources = Array.isArray(resourceType) 
    ? resourceType 
    : (resourceType ? [resourceType] : []);
  
  // Standard tier multiplier with meltdown: (tierMult^levels)^meltdown
  const basePower = Math.pow(tierMultiplier, levels);
  const tierWithMeltdown = Math.pow(basePower, meltdown);
  
  // Calculate multipliers for each resource
  const multipliers = {};
  
  for (const [resource, tokenUltimaMult] of Object.entries(TOKEN_ULTIMA_MULTIPLIERS)) {
    // Token Ultima bonus (always applied, meltdown immune)
    const tokenUltimaBonus = Math.pow(tokenUltimaMult, levels);
    
    // Get the count for this resource (default 1)
    const count = resourceCount[resource] || 1;
    
    // Tier bonus only applies to resources this upgrade produces
    if (producedResources.includes(resource)) {
      if (resource === 'cells') {
        // CELLS use special formula: tokenUltima^levels * tierMult^(count * levels * meltdown²)
        // count is multiplied INTO the exponent, not as a power of the result
        const cellsTierExponent = count * levels * Math.pow(meltdown, 2);
        const cellsTierBonus = Math.pow(tierMultiplier, cellsTierExponent);
        multipliers[resource] = tokenUltimaBonus * cellsTierBonus;
      } else {
        // Other resources use standard formula: (tierMult^levels)^meltdown * tokenUltima^levels
        multipliers[resource] = tierWithMeltdown * tokenUltimaBonus;
      }
    } else {
      // This upgrade doesn't produce this resource - only token ultima
      multipliers[resource] = tokenUltimaBonus;
    }
  }
  
  return multipliers;
}

/**
 * Calculate efficiency for each resource
 * 
 * Formula: log10(multiplier) / cost * 1e10
 * 
 * @param {Object} multipliers - { cells, mp, shards, rp, ap } multipliers
 * @param {number} cost - Total cost of the upgrade
 * @returns {Object} { cells, mp, shards, rp, ap } efficiency values
 */
export function calculateEfficiency(multipliers, cost) {
  if (cost <= 0) {
    return { cells: 0, mp: 0, shards: 0, rp: 0, ap: 0 };
  }
  
  const efficiency = {};
  
  for (const [resource, multiplier] of Object.entries(multipliers)) {
    if (multiplier <= 1) {
      efficiency[resource] = 0;
    } else {
      // Efficiency = log10(multiplier) / cost * 1e10
      efficiency[resource] = (Math.log10(multiplier) / cost) * 1e10;
    }
  }
  
  return efficiency;
}

// Color classes for each tier
export const TIER_COLORS = {
  t1: {
    header: 'bg-green-900/50 border-green-700',
    row: 'hover:bg-green-900/20',
    text: 'text-green-400',
    border: 'border-green-800/50'
  },
  t2: {
    header: 'bg-cyan-900/50 border-cyan-700',
    row: 'hover:bg-cyan-900/20',
    text: 'text-cyan-400',
    border: 'border-cyan-800/50'
  },
  t3: {
    header: 'bg-purple-900/50 border-purple-700',
    row: 'hover:bg-purple-900/20',
    text: 'text-purple-400',
    border: 'border-purple-800/50'
  }
};

/**
 * Calculate the cost to upgrade from startLevel to targetLevel
 * 
 * Supports linear scaling within bumps via upgrade.bumpScaling:
 * - startBump: which bump index to start applying scaling
 * - perLevel: multiplier increment per level within the bump
 * 
 * @param {Object} upgrade - The upgrade object with startingCost, scalingCost, defaultMax, costBumps
 * @param {number} bumpInterval - Levels per cost bump tier (1000 for T1, 500 for T2/T3)
 * @param {number} startLevel - Starting level (0 for total cost)
 * @param {number} targetLevel - Target level to calculate cost to
 * @returns {number} Total cost from startLevel to targetLevel
 */
export function calculateCost(upgrade, bumpInterval, startLevel, targetLevel) {
  const { startingCost, scalingCost, defaultMax, costBumps, bumpScaling, postBumpFormula } = upgrade;
  
  let totalCost = 0;
  
  for (let level = startLevel; level < targetLevel; level++) {
    // Base cost for this level
    const baseCost = startingCost + (level * scalingCost);
    
    // Determine multiplier based on whether we're past defaultMax
    let multiplier = 1;
    
    if (level >= defaultMax) {
      // Calculate which cost bump tier we're in
      const levelsOverDefault = level - defaultMax;
      const bumpIndex = Math.floor(levelsOverDefault / bumpInterval);
      
      // Check if postBumpFormula applies (exact dev formula)
      if (postBumpFormula && bumpIndex >= postBumpFormula.afterBumpIndex) {
        // Dev formula: baseBump * multiplier * (1 + level * levelCoeff)
        multiplier = postBumpFormula.baseBump * postBumpFormula.multiplier * (1 + level * postBumpFormula.levelCoeff);
      } else {
        // Use the last bump if we exceed the array
        const baseBumpMultiplier = costBumps[Math.min(bumpIndex, costBumps.length - 1)];
        
        // Apply linear scaling if defined and we're at or past the startBump
        if (bumpScaling && bumpIndex >= bumpScaling.startBump) {
          // Calculate how many levels into the scaling range we are
          const scalingStartLevel = defaultMax + (bumpScaling.startBump * bumpInterval);
          const levelsIntoScaling = level - scalingStartLevel;
          multiplier = baseBumpMultiplier + (levelsIntoScaling * bumpScaling.perLevel);
        } else {
          multiplier = baseBumpMultiplier;
        }
      }
    }
    
    totalCost += baseCost * multiplier;
  }
  
  return totalCost;
}

/**
 * Calculate cost from 0 to targetMax (total cost to max)
 */
export function calculateCostToMax(upgrade, bumpInterval, targetMax) {
  return calculateCost(upgrade, bumpInterval, 0, targetMax);
}

/**
 * Calculate cost from currentMax to nextMax (cost for next bump)
 */
export function calculateCostForNextBump(upgrade, bumpInterval, currentMax, nextMax) {
  return calculateCost(upgrade, bumpInterval, currentMax, nextMax);
}
