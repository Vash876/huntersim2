/**
 * Attraction Gem Constants for Gem Planner
 */
import Decimal from 'break_infinity.js';

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
      color: '#a3f15e',
      unlock: 1,
      costBumps: [
        { startLevel: 9, multiplier: 1.2 },
        { startLevel: 19, multiplier: 1.3 },
        { startLevel: 29, multiplier: 1.4 },
        { startLevel: 39, multiplier: 2 }
      ],
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
      id: 'ozzy-loot-bonus',
      name: 'Ozzy Loot Bonus',
      resource: 'Ozzy Loot',
      baseCost: 20,
      costMultiplier: 2.5,
      maxLevel: 50,
      color: '#a3f15e',
      unlock: 2,
      costBumps: [
        { startLevel: 9, multiplier: 1.3 },
        { startLevel: 19, multiplier: 1.4 },
        { startLevel: 29, multiplier: 1.5 },
        { startLevel: 39, multiplier: 1.5 }
      ],
      multiplier: {
        base: 1.04,
        calculate: (level, attractionLevel) => {
          const levelDecimal = new Decimal(level);
          const attractionLevelDecimal = new Decimal(attractionLevel);
          const innerBase = new Decimal(1.04).pow(levelDecimal); // Math.pow(1.04, level)
          const outerExponent = new Decimal(1).add(attractionLevelDecimal.mul(0.1)).sub(0.1); // 1 + (attractionLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
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
      color: '#5afff7',
      unlock: 3,
      costBumps: [], // No cost bumps
      multiplier: {
        base: 1.08,
        calculate: (level, attractionLevel) => {
          const levelDecimal = new Decimal(level);
          const attractionLevelDecimal = new Decimal(attractionLevel);
          const innerBase = new Decimal(1.08).pow(levelDecimal); // Math.pow(1.08, level)
          const outerExponent = new Decimal(1).add(attractionLevelDecimal.mul(0.1)).sub(0.1); // 1 + (attractionLevel * 0.1) - 0.1
          return innerBase.pow(outerExponent);
        }
      }
    }
  ]
};

export default ATTRACTION_GEM;
