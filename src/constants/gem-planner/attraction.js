/**
 * Attraction Gem Constants for Gem Planner
 */

export const ATTRACTION_GEM = {
  id: 'attraction',
  name: 'Attraction',
  maxLevel: 3,
  color: {
    primary: '#3b82f6', // Blue
    secondary: '#60a5fa', // Light Blue
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
  },
  
  // Gem Quality costs (level up costs)
  qualityCosts: [
    { level: 1, cost: 30 },
    { level: 2, cost: 150 },
    { level: 3, cost: 1e3 }
  ],
  
  // Gem Nodes (no effects, just costs)
  gemNodes: [
    { node: 1, cost: 5e5 },
    { node: 2, cost: 2e5 },
    { node: 3, cost: 6e4 }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'borge-loot-bonus',
      name: 'Borge Loot Bonus',
      resource: 'Borge Loot',
      baseCost: 5,
      costMultiplier: 2.5,
      maxLevel: 50,
      color: '#10b981',
      unlock: 1,
      multiplier: {
        base: 1.07,
        calculate: (level, attractionLevel) => {
          return Math.pow(Math.pow(1.07, level), 1 + (attractionLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'ozzy-loot-bonus',
      name: 'Ozzy Loot Bonus',
      resource: 'Ozzy Loot',
      baseCost: 20,
      costMultiplier: 2.5,
      maxLevel: 50,
      color: '#f59e0b',
      unlock: 2,
      multiplier: {
        base: 1.04,
        calculate: (level, attractionLevel) => {
          return Math.pow(Math.pow(1.04, level), 1 + (attractionLevel * 0.1) - 0.1);
        }
      }
    },
    {
      id: 'catch-up-power',
      name: 'Catch Up Power',
      resource: 'Catch Up',
      baseCost: 1,
      costMultiplier: 100,
      maxLevel: 5,
      color: '#ef4444',
      unlock: 3,
      multiplier: {
        base: 1.08,
        calculate: (level, attractionLevel) => {
          return Math.pow(Math.pow(1.08, level), 1 + (attractionLevel * 0.1) - 0.1);
        }
      }
    }
  ]
};

export default ATTRACTION_GEM;
