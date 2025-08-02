/**
 * Temporal Gem Constants for Gem Planner
 */
import Decimal from 'break_infinity.js';

export const TEMPORAL_GEM = {
  id: 'temporal',
  name: 'Temporal',
  maxLevel: 3,
  color: {
    primary: '#dc2626', // Red
    secondary: '#e67b7bff', // Light Red
    gradient: 'linear-gradient(135deg, #dc2626 0%, #e67b7bff 100%)'
  },
  
  // Gem Quality costs (level up costs)
  qualityCosts: [
    { level: 1, cost: 5 },
    { level: 2, cost: 18 },
    { level: 3, cost: 3e9 }
  ],
  
  // Gem Nodes (no effects, just costs)
  gemNodes: [
    { node: 1, cost: 1 },
    { node: 2, cost: 9e3 },
    { node: 3, cost: 7e6 }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'mp-bonus-lms',
      name: 'MP Bonus (LMs)',
      resource: 'MP',
      baseCost: 1.5,
      costMultiplier: 1.5,
      maxLevel: 50,
      color: '#ff0000',
      unlock: 1,
      costBumps: [
        { startLevel: 14, multiplier: 1.01 },
        { startLevel: 29, multiplier: 1.02 },
        { startLevel: 39, multiplier: 1.03 }
      ],
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const loopMods = gameStats.loopMods || 0;
          const levelDecimal = new Decimal(level);
          const temporalLevelDecimal = new Decimal(temporalLevel);
          const loopModsDecimal = new Decimal(loopMods);

          // 1 + (0.01 * level) * loopMods
          const base = new Decimal(1).add(levelDecimal.mul(0.01).mul(loopModsDecimal));
          // 1 + (temporalLevel * 0.1) - 0.1
          const exponent = new Decimal(1).add(temporalLevelDecimal.mul(0.1)).sub(0.1);
          
          return base.pow(exponent);
        }
      }
    },
    {
      id: 'mp-bonus-ticks',
      name: 'MP Bonus (Ticks)',
      resource: 'MP',
      baseCost: 1.5,
      costMultiplier: 4,
      maxLevel: 50,
      color: '#ff0000',
      unlock: 2,
      costBumps: [
        { startLevel: 14, multiplier: 1.01 },
        { startLevel: 29, multiplier: 1.02 },
        { startLevel: 39, multiplier: 1.03 }
      ],
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const ticks = gameStats.ticks || 0;
          return Math.pow(1 + (0.0005 * level) * ticks, 1 + (temporalLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'mp-bonus-zag-rank',
      name: 'MP Bonus (Zag Rank)',
      resource: 'MP',
      baseCost: 1e3,
      costMultiplier: 100,
      maxLevel: 10,
      color: '#ff0000',
      unlock: 3,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const zagRank = gameStats.zagreusRank || 0;
          return Math.pow(Math.pow(1 + (0.35 * level), zagRank), 1 + (temporalLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'lm-max-levels-low-tier',
      name: 'LM Max Levels (Low Tier)',
      resource: 'LM Levels',
      baseCost: 2e7,
      costMultiplier: 3,
      maxLevel: 100,
      color: '#fc846a',
      unlock: 3,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 5,
        calculate: (level, temporalLevel) => {
          return 5 * level * temporalLevel;
        }
      }
    },
    {
      id: 'mp-bonus-zag-crew',
      name: 'MP Bonus (Zag Crew)',
      resource: 'MP',
      baseCost: 1e5,
      costMultiplier: 3,
      maxLevel: 30,
      color: '#ff0000',
      unlock: 3,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const zagCrew = gameStats.zagreusCrew || 0;
          return Math.pow(Math.pow(1 + (0.003 * level), zagCrew), 1 + (temporalLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'mp-bonus-loop-resets',
      name: 'MP Bonus (Loop Resets)',
      resource: 'MP',
      baseCost: 1e10,
      costMultiplier: 7,
      maxLevel: 30,
      color: '#ff0000',
      unlock: 3,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const loopResets = gameStats.loopResets - 100 || 0;
          return Math.pow(Math.pow(1 + (0.005 * level), loopResets), 1 + (temporalLevel * 0.1) - 0.1);
        }
      }
    }
  ]
};

export default TEMPORAL_GEM;
