/**
 * Exodus Gem Constants for Gem Planner
 */

export const EXODUS_GEM = {
  id: 'exodus',
  name: 'Exodus',
  maxLevel: 5,
  color: {
    primary: '#8b5cf6', // Purple
    secondary: '#ec4899', // Pink
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
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
      resource: 'Cells',
      baseCost: 1,
      costMultiplier: 1.2,
      maxLevel: 999,
      color: '#00b90f',
      unlock: 1, 
      multiplier: {
        calculate: (level, exodusLevel) => Math.pow(Math.pow(4, level), 1 + (exodusLevel * 0.1) - 0.1)
      }
    },
    {
      id: 'shards-bonus',
      name: 'Shards Bonus',
      resource: 'Shards',
      baseCost: 2,
      costMultiplier: 1.8,
      maxLevel: 999,
      color: '#00d9ff',
      unlock: 2, 
      multiplier: {
        calculate: (level, exodusLevel) => Math.pow(Math.pow(5, level), 1 + (exodusLevel * 0.1) - 0.1)
      }
    },
    {
      id: 'rp-bonus',
      name: 'RP Bonus',
      resource: 'RP',
      baseCost: 500,
      costMultiplier: 1.9,
      maxLevel: 999,
      color: '#ffa600',
      unlock: 3, 
      multiplier: {
        calculate: (level, exodusLevel) => Math.pow(Math.pow(8, level), 1 + (exodusLevel * 0.1) - 0.1)
      }
    },
    {
      id: 'mp-bonus',
      name: 'MP Bonus',
      resource: 'MP',
      baseCost: 1e4,
      costMultiplier: 2,
      maxLevel: 999,
      color: '#ff0000',
      unlock: 4, 
      multiplier: {
        calculate: (level, exodusLevel) => Math.pow(Math.pow(4, level), 1 + (exodusLevel * 0.1) - 0.1)
      }
    },
    {
      id: 'ap-bonus',
      name: 'AP Bonus',
      resource: 'AP',
      baseCost: 1e6,
      costMultiplier: 2.1,
      maxLevel: 999,
      color: '#2600ff',
      unlock: 4, 
      multiplier: {
        calculate: (level, exodusLevel) => Math.pow(Math.pow(1.6, level), 1 + (exodusLevel * 0.1) - 0.1)
      }
    }
  ]
};

export default EXODUS_GEM;
