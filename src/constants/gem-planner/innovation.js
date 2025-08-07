/**
 * Innovation Gem Constants for Gem Planner
 */
import Decimal from 'break_infinity.js';

export const INNOVATION_GEM = {
  id: 'innovation',
  name: 'Innovation',
  maxLevel: 3,
  color: {
    primary: '#ffa600', // Yellow
    secondary: '#f1ac6d', // Light Yellow
    gradient: 'linear-gradient(135deg, #ff9900ff 0%, #eeb077ff 100%)'
  },
  
  // Gem Quality costs (level up costs)
  qualityCosts: [
    { level: 1, cost: 12 },
    { level: 2, cost: 1e10 },
    { level: 3, cost: 8e12 }
  ],
  
  // Gem Nodes (no effects, just costs)
  gemNodes: [
    { node: 1, cost: 7e3 },
    { node: 2, cost: 3e6 },
    { node: 3, cost: 1.2e4 }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'studies-per-study',
      name: 'Studies per Study',
      weight: null,
      baseCost: 3,
      costMultiplier: 2,
      maxLevel: 50,
      color: '#fdb471',
      unlock: 1,
      costBumps: [
        { startLevel: 9, multiplier: 1.1 },
        { startLevel: 19, multiplier: 1.2 },
        { startLevel: 29, multiplier: 1.3 },
        { startLevel: 39, multiplier: 1.4 }
      ],
      multiplier: {
        base: 2,
        calculate: (level, innovationLevel) => {
          const levelDecimal = new Decimal(level);
          const innovationLevelDecimal = new Decimal(innovationLevel);
          const base = new Decimal(2).mul(levelDecimal); // 2 * level
          const exponent = new Decimal(1).add(innovationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (innovationLevel * 0.1) - 0.1
          return base.pow(exponent).floor();
        }
      }
    },
    {
      id: 'cells-bonus',
      name: 'Cells Bonus',
      weight: 'Cells',
      baseCost: 1e3,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#39ff94',
      unlock: 2,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          const levelDecimal = new Decimal(level);
          const innovationLevelDecimal = new Decimal(innovationLevel);
          const researchLevelDecimal = new Decimal(researchLevel);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.06)); // 1 + (0.06 * level)
          const innerPower = innerBase.pow(researchLevelDecimal); // Math.pow(1 + (0.06 * level), researchLevel)
          const outerExponent = new Decimal(1).add(innovationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (innovationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'mp-bonus',
      name: 'MP Bonus',
      weight: 'MP',
      baseCost: 2e5,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#ff3c39',
      unlock: 2,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          const levelDecimal = new Decimal(level);
          const innovationLevelDecimal = new Decimal(innovationLevel);
          const researchLevelDecimal = new Decimal(researchLevel);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.04)); // 1 + (0.04 * level)
          const innerPower = innerBase.pow(researchLevelDecimal); // Math.pow(1 + (0.04 * level), researchLevel)
          const outerExponent = new Decimal(1).add(innovationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (innovationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'shards-bonus',
      name: 'Shards Bonus',
      weight: 'Shards',
      baseCost: 3e6,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#5ac3ff',
      unlock: 2,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          const levelDecimal = new Decimal(level);
          const innovationLevelDecimal = new Decimal(innovationLevel);
          const researchLevelDecimal = new Decimal(researchLevel);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.04)); // 1 + (0.04 * level)
          const innerPower = innerBase.pow(researchLevelDecimal); // Math.pow(1 + (0.04 * level), researchLevel)
          const outerExponent = new Decimal(1).add(innovationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (innovationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'rp-bonus',
      name: 'RP Bonus',
      weight: 'RP',
      baseCost: 4e7,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#ff9a39',
      unlock: 2,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          const levelDecimal = new Decimal(level);
          const innovationLevelDecimal = new Decimal(innovationLevel);
          const researchLevelDecimal = new Decimal(researchLevel);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.04)); // 1 + (0.04 * level)
          const innerPower = innerBase.pow(researchLevelDecimal); // Math.pow(1 + (0.04 * level), researchLevel)
          const outerExponent = new Decimal(1).add(innovationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (innovationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'ap-bonus',
      name: 'AP Bonus',
      weight: 'AP',
      baseCost: 5e8,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#2a47cc',
      unlock: 2,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          const levelDecimal = new Decimal(level);
          const innovationLevelDecimal = new Decimal(innovationLevel);
          const researchLevelDecimal = new Decimal(researchLevel);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.04)); // 1 + (0.04 * level)
          const innerPower = innerBase.pow(researchLevelDecimal); // Math.pow(1 + (0.04 * level), researchLevel)
          const outerExponent = new Decimal(1).add(innovationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (innovationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'mats-bonus',
      name: 'Mats Bonus',
      weight: 'Mats',
      baseCost: 1e11,
      costMultiplier: 100,
      maxLevel: 50,
      color: '#8b5a3c',
      unlock: 3,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          const levelDecimal = new Decimal(level);
          const innovationLevelDecimal = new Decimal(innovationLevel);
          const researchLevelDecimal = new Decimal(researchLevel);
          
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.01)); // 1 + (0.01 * level)
          const innerPower = innerBase.pow(researchLevelDecimal); // Math.pow(1 + (0.01 * level), researchLevel)
          const outerExponent = new Decimal(1).add(innovationLevelDecimal.mul(0.1)).sub(0.1); // 1 + (innovationLevel * 0.1) - 0.1
          
          return innerPower.pow(outerExponent);
        }
      }
    },
    {
      id: 'bonus-blueprints',
      name: 'Bonus Blueprints',
      weight: null,
      baseCost: 1e8,
      costMultiplier: 1e5,
      maxLevel: 50,
      color: '#0c4b53',
      type: 'additive',
      unlock: 3,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const quantumTechLevels = gameStats.quantumTechLevels || 0;
          return Math.floor(1 * level) * (1 + (0.2 * innovationLevel)) * quantumTechLevels;
        }
      }
    },
    {
      id: 'bonus-innovation-cores',
      name: 'Bonus Innovation Cores',
      weight: null,
      baseCost: 1e8,
      costMultiplier: 1e7,
      maxLevel: 50,
      color: '#ffdf39',
      type: 'additive',
      unlock: 3,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const quantumTechLevels = gameStats.quantumTechLevels || 0;
          return Math.floor(1 * level) * (1 + (0.2 * innovationLevel)) * quantumTechLevels;
        }
      }
    }
  ]
};

export default INNOVATION_GEM;
