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
    { level: 1, cost: null },
    { level: 2, cost: null },
    { level: 3, cost: null }
  ],
  
  // Gem Nodes (no effects, just costs)
  gemNodes: [
    { node: 1, cost: null },
    { node: 2, cost: null },
    { node: 3, cost: null }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'test',
      name: 'Test Upgrade',
      resource: 'Test Resource',
      baseCost: 5,
      costMultiplier: 2.5,
      maxLevel: 50,
      color: '#a3f15e',
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
  ]
};

export default EVOLUTION_GEM;
