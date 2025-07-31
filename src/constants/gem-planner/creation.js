/**
 * Creation Gem Constants for Gem Planner
 */

export const CREATION_GEM = {
  id: 'creation',
  name: 'Creation',
  maxLevel: 4,
  color: {
    primary: '#f97316', // Orange
    secondary: '#fb923c', // Light Orange
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
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
      color: '#f97316',
      unlock: 1,
      multiplier: {
        base: 100000000,
        calculate: (level, creationLevel) => {
          return Math.pow(Math.pow(100000000, level), 1 + (creationLevel * 0.1) - 0.1);
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
      color: '#6b7280',
      unlock: 2,
      multiplier: {
        base: 10,
        calculate: (level, creationLevel) => {
          return Math.pow(Math.pow(10, level), 1 + (creationLevel * 0.1) - 0.1);
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
      color: '#3b82f6',
      unlock: 2,
      multiplier: {
        base: 50,
        calculate: (level, creationLevel) => {
          return Math.pow(Math.pow(50, level), 1 + (creationLevel * 0.1) - 0.1);
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
      color: '#00b90f',
      unlock: 3,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel, gameStats = {}) => {
          const techUpgrades = gameStats.techUpgrades || 0;
          return Math.pow(Math.pow(1 + (0.005 * level), techUpgrades), 1 + (creationLevel * 0.1) - 0.1);
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
      color: '#ff0000',
      unlock: 3,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel, gameStats = {}) => {
          const techUpgrades = gameStats.techUpgrades || 0;
          return Math.pow(Math.pow(1 + (0.001 * level), techUpgrades), 1 + (creationLevel * 0.1) - 0.1);
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
      color: '#00d9ff',
      unlock: 3,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel, gameStats = {}) => {
          const techUpgrades = gameStats.techUpgrades || 0;
          return Math.pow(Math.pow(1 + (0.001 * level), techUpgrades), 1 + (creationLevel * 0.1) - 0.1);
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
      multiplier: {
        base: 1,
        calculate: (level, creationLevel, gameStats = {}) => {
          const techUpgrades = gameStats.techUpgrades || 0;
          return Math.pow(Math.pow(1 + (0.0007 * level), techUpgrades), 1 + (creationLevel * 0.1) - 0.1);
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
      color: '#8b5cf6',
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
      resource: 'Borge Stats',
      baseCost: 1e11,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#10b981',
      unlock: 4,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel) => {
          return 1 * (0.01 + (creationLevel - 4) * 0.001);
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
      color: '#f59e0b',
      unlock: 4,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel) => {
          return 1 * (0.01 + (creationLevel - 4) * 0.001);
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
      color: '#6366f1',
      unlock: 4,
      multiplier: {
        base: 1,
        calculate: (level, creationLevel) => {
          return 1 * (0.01 + (creationLevel - 4) * 0.001);
        }
      }
    }
  ]
};

export default CREATION_GEM;
