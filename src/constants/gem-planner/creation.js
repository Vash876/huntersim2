/**
 * Creation Gem Constants for Gem Planner
 */
import Decimal from 'break_infinity.js';

export const CREATION_GEM = {
  id: 'creation',
  name: 'Creation',
  maxLevel: 4,
  color: {
    primary: '#f97316', // Orange
    secondary: '#fb923c', // Light Orange
    gradient: 'linear-gradient(135deg, #bd5a14ff 0%, #f5994dff 100%)'
  },
  
  // Gem Quality costs (level up costs)
  qualityCosts: [
    { level: 1, cost: 555 },
    { level: 2, cost: 2e5 },
    { level: 3, cost: 4e5 },
    { level: 4, cost: 6e12 }
  ],
  
  // Gem Nodes (no effects, just costs)
  gemNodes: [
    { node: 1, cost: 8e5 },
    { node: 2, cost: 5e8 },
    { node: 3, cost: 3.3e4 }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'mech-bonus-cap',
      name: 'Mech Bonus Cap',
      resource: 'Mech Cap',
      weight: {
        calculate: (weights) => {
          const mp = weights.mp || 0;
          const cells = weights.cells || 0;
          const shards = weights.shards || 0;
          const meltdown = weights.meltdown || 0;
          return mp + cells * 2 + shards + cells * 8 * meltdown;
        }
      },
      baseCost: 1,
      costMultiplier: 10,
      maxLevel: 999,
      color: '#fede63',
      unlock: 1,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 100000000,
        calculate: (level, creationLevel) => {
          const levelDecimal = new Decimal(level);
          const creationLevelDecimal = new Decimal(creationLevel);
          const innerBase = new Decimal(100000000).pow(levelDecimal); // Math.pow(100000000, level)
          const outerExponent = new Decimal(1).add(creationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (creationLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    },
    {
      id: 'hardware-bonus',
      name: 'Hardware Bonus',
      resource: 'Hardware',
      weight: {
        calculate: (weights) => {
          const cells = weights.cells || 0;
          const meltdown = weights.meltdown || 0;
          return 8 * meltdown * cells;
        }
      },
      baseCost: 1e3,
      costMultiplier: 3,
      maxLevel: 20,
      color: '#f7c980',
      unlock: 2,
      costBumps: [
        { startLevel: 14, multiplier: 1.05 }
      ],
      multiplier: {
        base: 10,
        calculate: (level, creationLevel) => {
          const levelDecimal = new Decimal(level);
          const creationLevelDecimal = new Decimal(creationLevel);
          const innerBase = new Decimal(10).pow(levelDecimal); // Math.pow(10, level)
          const outerExponent = new Decimal(1).add(creationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (creationLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    },
    {
      id: 'software-bonus',
      name: 'Software Bonus',
      resource: 'Software',
      weight: {
        calculate: (weights) => {
          const cells = weights.cells || 0;
          const meltdown = weights.meltdown || 0;
          return 8 * meltdown * cells;
        }
      },
      baseCost: 1e4,
      costMultiplier: 4,
      maxLevel: 20,
      color: '#f7c980',
      unlock: 2,
      costBumps: [
        { startLevel: 14, multiplier: 1.05 }
      ],
      multiplier: {
        base: 50,
        calculate: (level, creationLevel) => {
          const levelDecimal = new Decimal(level);
          const creationLevelDecimal = new Decimal(creationLevel);
          const innerBase = new Decimal(50).pow(levelDecimal); // Math.pow(50, level)
          const outerExponent = new Decimal(1).add(creationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (creationLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    },
    {
      id: 'cells-bonus',
      name: 'Cells Bonus',
      resource: 'Cells',
      weight: 'Cells',
      baseCost: 5e4,
      costMultiplier: 1.8,
      maxLevel: 15,
      color: '#39fd93',
      unlock: 3,
      costBumps: [
        { startLevel: 7, multiplier: 100 },
        { startLevel: 10, multiplier: 10 },
        { startLevel: 13, multiplier: 10 }
      ],
      multiplier: {
        base: 1,
        calculate: (level, creationLevel, gameStats = {}) => {
          const techUpgrades = gameStats.techUpgrades || 0;
          const levelDecimal = new Decimal(level);
          const creationLevelDecimal = new Decimal(creationLevel);
          const techUpgradesDecimal = new Decimal(techUpgrades);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.005)); // 1 + (0.005 * level)
          const innerPower = innerBase.pow(techUpgradesDecimal); // Math.pow(1 + (0.005 * level), techUpgrades)
          const outerExponent = new Decimal(1).add(creationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (creationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'mp-bonus',
      name: 'MP Bonus',
      resource: 'MP',
      weight: 'MP',
      baseCost: 6e4,
      costMultiplier: 2.2,
      maxLevel: 15,
      color: '#fe4138',
      unlock: 3,
      costBumps: [
        { startLevel: 7, multiplier: 100 },
        { startLevel: 10, multiplier: 10 },
        { startLevel: 13, multiplier: 10 }
      ],
      multiplier: {
        base: 1,
        calculate: (level, creationLevel, gameStats = {}) => {
          const techUpgrades = gameStats.techUpgrades || 0;
          const levelDecimal = new Decimal(level);
          const creationLevelDecimal = new Decimal(creationLevel);
          const techUpgradesDecimal = new Decimal(techUpgrades);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.001)); // 1 + (0.001 * level)
          const innerPower = innerBase.pow(techUpgradesDecimal); // Math.pow(1 + (0.001 * level), techUpgrades)
          const outerExponent = new Decimal(1).add(creationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (creationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'shards-bonus',
      name: 'Shards Bonus',
      resource: 'Shards',
      weight: 'Shards',
      baseCost: 7e4,
      costMultiplier: 2.8,
      maxLevel: 15,
      color: '#38b1fe',
      unlock: 3,
      costBumps: [
        { startLevel: 7, multiplier: 100 },
        { startLevel: 10, multiplier: 10 },
        { startLevel: 13, multiplier: 10 }
      ],
      multiplier: {
        base: 1,
        calculate: (level, creationLevel, gameStats = {}) => {
          const techUpgrades = gameStats.techUpgrades || 0;
          const levelDecimal = new Decimal(level);
          const creationLevelDecimal = new Decimal(creationLevel);
          const techUpgradesDecimal = new Decimal(techUpgrades);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.001)); // 1 + (0.001 * level)
          const innerPower = innerBase.pow(techUpgradesDecimal); // Math.pow(1 + (0.001 * level), techUpgrades)
          const outerExponent = new Decimal(1).add(creationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (creationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'rp-bonus',
      name: 'RP Bonus',
      resource: 'RP',
      weight: 'RP',
      baseCost: 8e4,
      costMultiplier: 3.5,
      maxLevel: 15,
      color: '#ffa600',
      unlock: 3,
      costBumps: [
        { startLevel: 7, multiplier: 100 },
        { startLevel: 10, multiplier: 10 },
        { startLevel: 13, multiplier: 10 }
      ],
      multiplier: {
        base: 1,
        calculate: (level, creationLevel, gameStats = {}) => {
          const techUpgrades = gameStats.techUpgrades || 0;
          const levelDecimal = new Decimal(level);
          const creationLevelDecimal = new Decimal(creationLevel);
          const techUpgradesDecimal = new Decimal(techUpgrades);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.0007)); // 1 + (0.0007 * level)
          const innerPower = innerBase.pow(techUpgradesDecimal); // Math.pow(1 + (0.0007 * level), techUpgrades)
          const outerExponent = new Decimal(1).add(creationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (creationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'f-trinket-tier-bonus',
      name: 'F-Trinket Tier Bonus',
      resource: 'F-Trinket Tier',
      weight: {
        calculate: (weights) => {
          // Complex weight calculation based on Excel formula:
          // =IF($P$40+$T$40>=4,log(Trinkets!F19)*CellWeight + log(Trinkets!F20)*MpWeight + log(Trinkets!F21)*ShardWeight + log(Trinkets!F22)*RpWeight + log(Trinkets!F25)*ApWeight + log(Trinkets!F26)*MatsWeight,"")
          
          // Extract individual weights
          const cellsWeight = weights.cells || 0;
          const mpWeight = weights.mp || 0;
          const shardsWeight = weights.shards || 0;
          const rpWeight = weights.rp || 0;
          const apWeight = weights.ap || 0;
          const matsWeight = weights.mats || 0;
          
          // For now, we'll use placeholder trinket tier values
          // These should ideally come from the actual game state (Trinkets!F19-F26)
          // Using reasonable default values for common trinket tiers
          const cellsTrinketTier = Math.max(1, weights.cellsTrinketTier || 10);
          const mpTrinketTier = Math.max(1, weights.mpTrinketTier || 8);
          const shardsTrinketTier = Math.max(1, weights.shardsTrinketTier || 8);
          const rpTrinketTier = Math.max(1, weights.rpTrinketTier || 6);
          const apTrinketTier = Math.max(1, weights.apTrinketTier || 5);
          const matsTrinketTier = Math.max(1, weights.matsTrinketTier || 4);
          
          // Calculate the weighted sum using logarithms as in Excel formula
          const weightedSum = 
            Math.log10(cellsTrinketTier) * cellsWeight +
            Math.log10(mpTrinketTier) * mpWeight +
            Math.log10(shardsTrinketTier) * shardsWeight +
            Math.log10(rpTrinketTier) * rpWeight +
            Math.log10(apTrinketTier) * apWeight +
            Math.log10(matsTrinketTier) * matsWeight;
          
          return weightedSum;
        }
      },
      baseCost: 7e7,
      costMultiplier: 3.8,
      maxLevel: 80,
      color: '#39ff94',
      type: 'additive',
      unlock: 4,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel) => {
          return (1 * level) * creationLevel;
        }
      }
    },
    {
      id: 'borge-stat-bonus',
      name: 'Borge Stat Bonus',
      hunter: true,
      resource: 'Borge',
      weight: null,
      baseCost: 1e11,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#db6579 ',
      unlock: 4,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel) => {
          return level * (0.01 + (creationLevel - 4) * 0.001) + 1;
        }
      }
    },
    {
      id: 'ozzy-stat-bonus',
      name: 'Ozzy Stat Bonus',
      hunter: true,
      resource: 'Ozzy',
      weight: null,
      baseCost: 1e6,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#fffb8c',
      unlock: 4,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel) => {
          return level * (0.01 + (creationLevel - 4) * 0.001) + 1;
        }
      }
    },
    {
      id: 'knox-stat-bonus',
      name: 'Knox Stat Bonus',
      hunter: true,
      resource: 'Knox',
      weight: null,
      baseCost: 1e11,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#7bf7ff',
      unlock: 4,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel) => {
          return level * (0.01 + (creationLevel - 4) * 0.001) + 1;
        }
      }
    }
  ]
};

export default CREATION_GEM;
