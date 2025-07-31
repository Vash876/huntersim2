/**
 * Innovation Gem Constants for Gem Planner
 */

export const INNOVATION_GEM = {
  id: 'innovation',
  name: 'Innovation',
  maxLevel: 3,
  color: {
    primary: '#eab308', // Yellow
    secondary: '#fbbf24', // Light Yellow
    gradient: 'linear-gradient(135deg, #eab308 0%, #fbbf24 100%)'
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
      resource: 'Studies',
      baseCost: 3,
      costMultiplier: 2,
      maxLevel: 50,
      color: '#fbbf24',
      unlock: 1, 
      multiplier: {
        base: 2,
        calculate: (level, innovationLevel) => {
          return Math.floor(Math.pow(2 * level, 1 + (innovationLevel * 0.1) - 0.1));
        }
      }
    },
    {
      id: 'cells-bonus',
      name: 'Cells Bonus',
      resource: 'Cells',
      baseCost: 1e3,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#00b90f',
      unlock: 2,
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          return Math.pow(Math.pow(1 + (0.06 * level), researchLevel), 1 + (innovationLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'mp-bonus',
      name: 'MP Bonus',
      resource: 'MP',
      baseCost: 2e5,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#ff0000',
      unlock: 2,
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          return Math.pow(Math.pow(1 + (0.04 * level), researchLevel), 1 + (innovationLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'shards-bonus',
      name: 'Shards Bonus',
      resource: 'Shards',
      baseCost: 3e6,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#00d9ff',
      unlock: 2,
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          return Math.pow(Math.pow(1 + (0.04 * level), researchLevel), 1 + (innovationLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'rp-bonus',
      name: 'RP Bonus',
      resource: 'RP',
      baseCost: 4e7,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#ffa600',
      unlock: 2,
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          return Math.pow(Math.pow(1 + (0.04 * level), researchLevel), 1 + (innovationLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'ap-bonus',
      name: 'AP Bonus',
      resource: 'AP',
      baseCost: 5e8,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#2600ff',
      unlock: 2,
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          return Math.pow(Math.pow(1 + (0.04 * level), researchLevel), 1 + (innovationLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'mats-bonus',
      name: 'Mats Bonus',
      resource: 'Mats',
      baseCost: 1e11,
      costMultiplier: 100,
      maxLevel: 50,
      color: '#8b5a3c',
      unlock: 3,
      multiplier: {
        base: 1,
        calculate: (level, innovationLevel, gameStats = {}) => {
          const researchLevel = gameStats.researchLevel || 0;
          return Math.pow(Math.pow(1 + (0.01 * level), researchLevel), 1 + (innovationLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'bonus-blueprints',
      name: 'Bonus Blueprints',
      resource: 'Blueprints',
      baseCost: 1e8,
      costMultiplier: 1e5,
      maxLevel: 50,
      color: '#06b6d4',
      unlock: 3, 
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
      resource: 'Innovation Cores',
      baseCost: 1e8,
      costMultiplier: 1e7,
      maxLevel: 50,
      color: '#a855f7',
      unlock: 3, 
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
