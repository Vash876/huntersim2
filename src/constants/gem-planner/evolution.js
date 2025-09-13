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
    { node: 2, cost: 1.15e14 },
    { node: 3, cost: 4e14 },
    // New nodes unlocked when Exodus reaches level 5
    { node: 4, cost: 1.15e15, unlockRequirement: 'exodus-5' },
    { node: 5, cost: 1e15, unlockRequirement: 'exodus-5' },
    { node: 6, cost: 1e24, unlockRequirement: 'exodus-5' }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'all-gens-output',
      name: 'All Gens Output',
      resource: 'allgens',
      weight: {
        calculate: (weights) => {
          const cells = weights.cells || 0;
          const meltdown = weights.meltdown || 0;
          
          return  8 * cells * meltdown;
        }
      },
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
          return new Decimal(1e8).pow(level);
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
        calculate: (level, evolutionLevel) => {
          const levelDecimal = new Decimal(level);
          const evolutionLevelDecimal = new Decimal(evolutionLevel);
          
          // 0.1+(1+(P67)*0.025)^(1+0.1*(P64))-1
          // P67 = level, P64 = evolutionLevel
          const innerBase = new Decimal(1).add(levelDecimal.mul(0.025));
          const exponent = new Decimal(1).add(evolutionLevelDecimal.mul(0.1));
          const powerResult = innerBase.pow(exponent);
          
          return new Decimal(0.1).add(powerResult).sub(1);
        }
      }
    },
    {
      id: 'mk9-core-resonance',
      name: 'MK9 Core Resonance',
      resource: 'MK9',
      weight: 'Shards',
      baseCost: 1e11,
      costMultiplier: 30,
      maxLevel: 8,
      color: '#52ffff',
      unlock: 1,
      costBumps: [
        { startLevel: 1, multiplier: 2.77777777777 },
        { startLevel: 2, multiplier: 0.60009601536 },
        { startLevel: 3, multiplier: 0.9996801023672424824056 },
        { startLevel: 6, multiplier: 1.00051222947880650531438084261 },
      ],
      multiplier: {
        base: 1,
        calculate: (level, evolutionLevel, gameStats = {}) => {
          const mk9Purchased = gameStats.mk9Purchased || 0;
          const stabilityLevel = gameStats.stabilityLevel || 1;
          
          if (level === 0) return new Decimal(1);
          
          const mk9PurchasedDecimal = new Decimal(mk9Purchased);
          const stabilityLevelDecimal = new Decimal(stabilityLevel);
          const levelDecimal = new Decimal(level);
          
          // ChatGPT Formula (recalibrated): value = C · manualMK9^resonanceLevel · (A + B·stability)
          const C = new Decimal(1);
          const A = new Decimal(-5611.25);
          const B = new Decimal(5893.75);
          
          const manualMK9Power = mk9PurchasedDecimal.pow(levelDecimal);
          const stabilityTerm = A.add(B.mul(stabilityLevelDecimal));
          
          // Ensure the result is never negative
          const result = C.mul(manualMK9Power).mul(stabilityTerm);
          return result.gte(1) ? result : new Decimal(1);
        }
      }
    },
    {
      id: 'lp-bonus',
      name: 'LP Bonus',
      resource: 'LP',
      weight: {
        calculate: (weights) => {
          const mp = weights.mp || 0;
          const shards = weights.shards || 0;
          const cells = weights.cells || 0;
          
          return mp + shards + cells;
        }
      },
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
