/**
 * Attraction Gem Constants for Gem Planner
 */
import Decimal from 'break_infinity.js';
import { max } from 'lodash';

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
    { level: 3, cost: 1e3 },
    { level: 4, cost: 2e13 }
  ],
  
  // Gem Nodes (no effects, just costs)
  gemNodes: [
    { node: 1, cost: 5e5 },
    { node: 2, cost: 2e5 },
    { node: 3, cost: 6e4 },
    // New nodes unlocked when Exodus reaches level 5
    { node: 4, cost: 1.1e14, unlockRequirement: 'exodus-5' },
    { node: 5, cost: 1e20, unlockRequirement: 'exodus-5' },
    { node: 6, cost: 1e24, unlockRequirement: 'exodus-5' }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'borge-loot-bonus',
      name: 'Borge Loot Bonus',
      hunter: true,
      resource: 'Borge',
      weight : 'Borge',
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
      hunter: true,
      resource: 'Ozzy',
      weight : 'Ozzy',
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
      id: 'catch-up-power-borge-ozzy',
      name: 'Catch Up Power',
      hunter: true,
      resource: 'Hunter',
      weight: {
        calculate: (weights) => {
          const borgeWeight = weights.borge || 0;
          const ozzyWeight = weights.ozzy || 0;
          return (borgeWeight + ozzyWeight) / 25;
        }
      },
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
    },
    // {
    //   id: 'knox-loot-bonus',
    //   name: 'Knox Loot Bonus',
    //   hunter: true,
    //   resource: 'Hunter',
    //   weight : 'Knox',
    //   baseCost: 1.2e11,
    //   costMultiplier: 2.66,
    //   costBumps: [
    //     { startLevel: 9, multiplier: 1.2 },
    //     { startLevel: 19, multiplier: 1.3 },
    //     { startLevel: 29, multiplier: 1.4 },
    //     { startLevel: 39, multiplier: 2 }
    //   ],
    //   maxLevel: 50,
    //   color: '#a3f15e',
    //   unlock: 4,
    //   multiplier: {
    //     base: 1.05,
    //     calculate: (level, attractionLevel) => {
    //       const levelDecimal = new Decimal(level);
    //       const attractionLevelDecimal = new Decimal(attractionLevel);
    //       const innerBase = new Decimal(1.05).pow(levelDecimal); // Math.pow(1.05, level)
    //       const outerExponent = new Decimal(1).add(attractionLevelDecimal.mul(0.1)).sub(0.1); // 1 + (attractionLevel * 0.1) - 0.1
    //       return innerBase.pow(outerExponent);
    //     }
    //   }
    // },
    // {
    //   id: 'catch-up-power-knox',
    //   name: 'Catch-Up Power (Knox)',
    //   hunter: true,
    //   resource: 'Hunter',
    //   weight: {
    //     calculate: (weights) => {
    //       const knoxWeight = weights.knox || 0;
    //       return knoxWeight / 25;
    //     }
    //   },
    //   baseCost: 4e10,
    //   costMultiplier: 100,
    //   maxLevel: 5,
    //   color: '#5afff7',
    //   unlock: 4,
    //   costBumps: [], // No cost bumps
    //   multiplier: {
    //     base: 1.08,
    //     calculate: (level, attractionLevel) => {
    //       const levelDecimal = new Decimal(level);
    //       const attractionLevelDecimal = new Decimal(attractionLevel);
    //       const innerBase = new Decimal(1.08).pow(levelDecimal); // Math.pow(1.08, level)
    //       const outerExponent = new Decimal(1).add(attractionLevelDecimal.mul(0.1)).sub(0.1); // 1 + (attractionLevel * 0.1) - 0.1
    //       return innerBase.pow(outerExponent);
    //     }
    //   }
    // },
    // {
    //   id: 'ship-evo-bonus',
    //   name: 'Ship Evolution Bonus',
    //   hunter: false,
    //   resource: 'Ship',
    //   weight: {
    //     calculate: (weights) => {
    //       const shipWeight = weights.ship || 0;
    //       return shipWeight / 25;
    //     }
    //   },
    //   baseCost: 7e10,
    //   costMultiplier: 1.45,
    //   maxLevel: 100,
    //   color: '#a9dded',
    //   unlock: 4,
    //   costBumps: [], // No cost bumps
    //   multiplier: {
    //     base: 1.01,
    //     calculate: (level, attractionLevel) => {
    //       const levelDecimal = new Decimal(level);
    //       const attractionLevelDecimal = new Decimal(attractionLevel);
    //       const innerBase = new Decimal(1.01).pow(levelDecimal); // Math.pow(1.01, level)
    //       const outerExponent = new Decimal(1).add(attractionLevelDecimal.mul(0.1)).sub(0.1); // 1 + (attractionLevel * 0.1) - 0.1
    //       return innerBase.pow(outerExponent);
    //     }
    //   }
    // }
  ]
};

export default ATTRACTION_GEM;
