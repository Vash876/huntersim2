/**
 * Exodus Gem Constants for Gem Planner
 */
import Decimal from 'break_infinity.js';

export const EXODUS_GEM = {
  id: 'exodus',
  name: 'Exodus',
  maxLevel: 4,
  color: {
    primary: '#8b5cf6', // Purple
    secondary: '#ec4899', // Pink
    gradient: 'linear-gradient(135deg, #5a95f5ff 0%, #6326f1ff 40%, #ec4899 100%)'
  },
  
  // Gem Quality costs (level up costs)
  qualityCosts: [
    { level: 1, cost: 1 },
    { level: 2, cost: 5 },
    { level: 3, cost: 5e3 },
    { level: 4, cost: 2e5 },
    { level: 5, cost: null }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'cells-bonus',
      name: 'Cells Bonus',
      weight: 'Cells',
      baseCost: 1,
      costMultiplier: 1.2,
      maxLevel: 999,
      color: '#39ff94',
      unlock: 1,
      costBumps: [
        { startLevel: 14, multiplier: 1.05 },
        { startLevel: 29, multiplier: 1.1 },
        { startLevel: 39, multiplier: 1.2 }
      ],
      multiplier: {
        calculate: (level, exodusLevel) => {
          const levelDecimal = new Decimal(level);
          const exodusLevelDecimal = new Decimal(exodusLevel);
          const innerBase = new Decimal(4).pow(levelDecimal); // Math.pow(4, level)
          const outerExponent = new Decimal(1).add(exodusLevelDecimal.mul(0.1)).sub(0.1); // 1 + (exodusLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    },
    {
      id: 'shards-bonus',
      name: 'Shards Bonus',
      weight: 'Shards',
      baseCost: 2,
      costMultiplier: 1.8,
      maxLevel: 999,
      color: '#39d3ff',
      unlock: 2,
      costBumps: [
        { startLevel: 14, multiplier: 1.1 },
        { startLevel: 29, multiplier: 1.2 },
        { startLevel: 39, multiplier: 1.3 }
      ],
      multiplier: {
        calculate: (level, exodusLevel) => {
          const levelDecimal = new Decimal(level);
          const exodusLevelDecimal = new Decimal(exodusLevel);
          const innerBase = new Decimal(5).pow(levelDecimal); // Math.pow(5, level)
          const outerExponent = new Decimal(1).add(exodusLevelDecimal.mul(0.1)).sub(0.1); // 1 + (exodusLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    },
    {
      id: 'rp-bonus',
      name: 'RP Bonus',
      weight: 'RP',
      baseCost: 500,
      costMultiplier: 1.9,
      maxLevel: 999,
      color: '#ec8e34',
      unlock: 3,
      costBumps: [
        { startLevel: 14, multiplier: 1.1 },
        { startLevel: 29, multiplier: 1.2 },
        { startLevel: 39, multiplier: 1.3 }
      ],
      multiplier: {
        calculate: (level, exodusLevel) => {
          const levelDecimal = new Decimal(level);
          const exodusLevelDecimal = new Decimal(exodusLevel);
          const innerBase = new Decimal(8).pow(levelDecimal); // Math.pow(8, level)
          const outerExponent = new Decimal(1).add(exodusLevelDecimal.mul(0.1)).sub(0.1); // 1 + (exodusLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    },
    {
      id: 'mp-bonus',
      name: 'MP Bonus',
      weight: 'MP',
      baseCost: 1e4,
      costMultiplier: 2,
      maxLevel: 999,
      color: '#ff3842',
      unlock: 4,
      costBumps: [
        { startLevel: 14, multiplier: 1.1 },
        { startLevel: 29, multiplier: 1.2 },
        { startLevel: 39, multiplier: 1.3 }

      ],
      multiplier: {
        calculate: (level, exodusLevel) => {
          const levelDecimal = new Decimal(level);
          const exodusLevelDecimal = new Decimal(exodusLevel);
          const innerBase = new Decimal(4).pow(levelDecimal); // Math.pow(4, level)
          const outerExponent = new Decimal(1).add(exodusLevelDecimal.mul(0.1)).sub(0.1); // 1 + (exodusLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    },
    {
      id: 'ap-bonus',
      name: 'AP Bonus',
      weight: 'AP',
      baseCost: 1e6,
      costMultiplier: 2.1,
      maxLevel: 999,
      color: '#2a47cc',
      unlock: 4,
      costBumps: [
        { startLevel: 14, multiplier: 1.1 },
        { startLevel: 29, multiplier: 1.2 },
        { startLevel: 39, multiplier: 1.3 }
      ], 
      multiplier: {
        calculate: (level, exodusLevel) => {
          const levelDecimal = new Decimal(level);
          const exodusLevelDecimal = new Decimal(exodusLevel);
          const innerBase = new Decimal(1.6).pow(levelDecimal); // Math.pow(1.6, level)
          const outerExponent = new Decimal(1).add(exodusLevelDecimal.mul(0.1)).sub(0.1); // 1 + (exodusLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    }
  ]
};

export default EXODUS_GEM;
