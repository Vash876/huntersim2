/**
 * Attraction Gem Constants for Gem Planner
 */
import Decimal from 'break_infinity.js';

export const EVOLUTION_GEM = {
  id: 'evolution',
  name: 'Evolution',
  maxLevel: 1,
  color: {
    primary: '#0a3814ff', // Dark Green
    secondary: '#156125', // Light Green
    gradient: 'linear-gradient(135deg, #0a3814ff 0%, #16752aff 100%)'
  },
  
  // Gem Quality costs (level up costs)
  qualityCosts: [
    { level: 1, cost: 5e13 },
    { level: 2, cost: null },
    { level: 3, cost: null }
  ],
  
  // Gem Nodes (no effects, just costs)
  gemNodes: [
    { node: 1, cost: null },
    { node: 2, cost: 1e14 },
    { node: 3, cost: 3e14 }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'all-gens-output',
      name: 'All Gens Output',
      resource: 'allgens',
      baseCost: 1e9,
      costMultiplier: 5,
      maxLevel: 50,
      color: '#fdfdfd',
      unlock: 1,
      costBumps: [
        { startLevel: 14, multiplier: 3 },
      ],
      multiplier: {
        base: 3,
        calculate: (level) => {
          return new Decimal(3).pow(level);
        }
      }
    },
    {
      id: 'mk9-core-stability',
      name: 'MK9 Core Stability',
      resource: 'MK9',
      baseCost: 9e9,
      costMultiplier: 10,
      maxLevel: 36,
      color: '#fd548a',
      unlock: 1,
      type: 'additive',
      multiplier: {
        base: 0.025,
        calculate: (level) => {
          return new Decimal(level).mul(0.025);
        }
      }
    },
    {
      id: 'mk9-core-resonance',
      name: 'MK9 Core Resonance',
      resource: 'MK9',
      baseCost: 1e11,
      costMultiplier: 50,
      maxLevel: 32,
      color: '#52ffff',
      unlock: 1,
      multiplier: {
        base: 1.07,
        calculate: (level, attractionLevel) => {
          const levelDecimal = new Decimal(level);
          const attractionLevelDecimal = new Decimal(attractionLevel);
          const innerBase = new Decimal(1.07).pow(levelDecimal); // Math.pow(1.07, level)
          const outerExponent = new Decimal(1).add(attractionLevelDecimal.mul(0.1)).sub(0.1); // 1 + (attractionLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    },
    {
      id: 'lp-bonus',
      name: 'LP Bonus',
      resource: 'LP',
      baseCost: 1e9,
      costMultiplier: 4,
      maxLevel: 250,
      color: '#9c55ff',
      type: 'additive',
      unlock: 1,
      multiplier: {
        base: 50,
        calculate: (level) => {
          return new Decimal(level).mul(50);
        }
      }
    },
  ]
};

export default EVOLUTION_GEM;
