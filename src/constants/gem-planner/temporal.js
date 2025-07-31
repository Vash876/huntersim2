/**
 * Temporal Gem Constants for Gem Planner
 */

export const TEMPORAL_GEM = {
  id: 'temporal',
  name: 'Temporal',
  maxLevel: 3,
  color: {
    primary: '#dc2626', // Red
    secondary: '#ef4444', // Light Red
    gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
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
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const loopResets = gameStats.loopResets || 0;
          return Math.pow(1 + (0.01 * level) * loopResets, 1 + (temporalLevel * 0.1) - 0.1);
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
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const zagRank = gameStats.zagRank || 0;
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
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const zagCrew = gameStats.zagCrew || 0;
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
      multiplier: {
        base: 1,
        calculate: (level, temporalLevel, gameStats = {}) => {
          const loopResets = gameStats.loopResets || 0;
          return Math.pow(Math.pow(1 + (0.005 * level), loopResets), 1 + (temporalLevel * 0.1) - 0.1);
        }
      }
    }
  ]
};

export default TEMPORAL_GEM;
