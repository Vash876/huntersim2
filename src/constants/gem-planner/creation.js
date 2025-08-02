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
      baseCost: 5e4,
      costMultiplier: 1.8,
      maxLevel: 15,
      color: '#39fd93',
      unlock: 3,
      costBumps: [
        { startLevel: 7, multiplier: 100 }
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
      baseCost: 6e4,
      costMultiplier: 2.2,
      maxLevel: 15,
      color: '#fe4138',
      unlock: 3,
      costBumps: [
        { startLevel: 7, multiplier: 100 }
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
      baseCost: 7e4,
      costMultiplier: 2.8,
      maxLevel: 15,
      color: '#38b1fe',
      unlock: 3,
      costBumps: [
        { startLevel: 7, multiplier: 100 }
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
      baseCost: 8e4,
      costMultiplier: 3.5,
      maxLevel: 15,
      color: '#ffa600',
      unlock: 3,
      costBumps: [
        { startLevel: 7, multiplier: 100 }
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
      baseCost: 7e7,
      costMultiplier: 3.8,
      maxLevel: 80,
      color: '#39ff94',
      type: 'additive',
      unlock: 4,
      costBumps: [
        { startLevel: 7, multiplier: 100 }
      ],
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
      resource: 'Borge Stats',
      baseCost: 1e11,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#db6579 ',
      unlock: 4,
      costBumps: [
        { startLevel: 7, multiplier: 100 }
      ],
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
      resource: 'Ozzy Stats',
      baseCost: 1e6,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#fffb8c',
      unlock: 4,
      costBumps: [
        { startLevel: 7, multiplier: 100 }
      ],
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
      resource: 'Knox Stats',
      baseCost: 1e11,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#7bf7ff',
      unlock: 4,
      costBumps: [
        { startLevel: 7, multiplier: 100 }
      ],
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
