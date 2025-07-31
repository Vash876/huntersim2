/**
 * Power Gem Constants for Gem Planner
 */

export const POWER_GEM = {
  id: 'power',
  name: 'Power',
  maxLevel: 2,
  color: {
    primary: '#8b5cf6', // Purple
    secondary: '#a78bfa', // Light Purple
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
  },
  
  // Gem Quality costs (level up costs)
  qualityCosts: [
    { level: 1, cost: 1e8 },
    { level: 2, cost: 1e12 }
  ],
  
  // Gem Nodes (no effects, just costs)
  gemNodes: [
    { node: 1, cost: 7.5e8 },
    { node: 2, cost: 3e9 },
    { node: 3, cost: 1e10 }
  ],
  
  // Upgrades available in this gem
  upgrades: [
    {
      id: 'cradle-bonus',
      name: 'Cradle Bonus',
      resource: 'Cradle',
      baseCost: 1e6,
      costMultiplier: 3,
      maxLevel: 50,
      color: '#8b5cf6',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const cradleCrew = gameStats.cradleCrew || 0;
          const cradleRank = gameStats.cradleRank || 0;
          return Math.pow(
            ((1 + (0.0012 * level)) ** cradleCrew) * ((1 + (0.02 * level)) ** cradleRank),
            1 + (powerLevel * 0.1) - 0.1
          );
        }
      }
    },
    {
      id: 'auxesia-bonus',
      name: 'Auxesia Bonus',
      resource: 'Auxesia',
      baseCost: 2e6,
      costMultiplier: 4,
      maxLevel: 50,
      color: '#8b5cf6',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const auxesiaCrew = gameStats.auxesiaCrew || 0;
          const auxesiaRank = gameStats.auxesiaRank || 0;
          return Math.pow(
            ((1 + (0.0012 * level)) ** auxesiaCrew) * ((1 + (0.02 * level)) ** auxesiaRank),
            1 + (powerLevel * 0.1) - 0.1
          );
        }
      }
    },
    {
      id: 'zagreus-bonus',
      name: 'Zagreus Bonus',
      resource: 'Zagreus',
      baseCost: 3e6,
      costMultiplier: 5,
      maxLevel: 50,
      color: '#8b5cf6',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const zagreusCrew = gameStats.zagreusCrew || 0;
          const zagreusRank = gameStats.zagreusRank || 0;
          return Math.pow(
            ((1 + (0.0012 * level)) ** zagreusCrew) * ((1 + (0.02 * level)) ** zagreusRank),
            1 + (powerLevel * 0.1) - 0.1
          );
        }
      }
    },
    {
      id: 'hephaestus-bonus',
      name: 'Hephaestus Bonus',
      resource: 'Hephaestus',
      baseCost: 4e7,
      costMultiplier: 6,
      maxLevel: 50,
      color: '#8b5cf6',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const hephaestusCrew = gameStats.hephaestusCrew || 0;
          const hephaestusRank = gameStats.hephaestusRank || 0;
          return Math.pow(
            ((1 + (0.0012 * level)) ** hephaestusCrew) * ((1 + (0.02 * level)) ** hephaestusRank),
            1 + (powerLevel * 0.1) - 0.1
          );
        }
      }
    },
    {
      id: 'demeter-bonus',
      name: 'Demeter Bonus',
      resource: 'Demeter',
      baseCost: 5e7,
      costMultiplier: 8,
      maxLevel: 50,
      color: '#8b5cf6',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const demeterCrew = gameStats.demeterCrew || 0;
          const demeterRank = gameStats.demeterRank || 0;
          return Math.pow(
            ((1 + (0.0012 * level)) ** demeterCrew) * ((1 + (0.02 * level)) ** demeterRank),
            1 + (powerLevel * 0.1) - 0.1
          );
        }
      }
    },
    {
      id: 'koios-bonus',
      name: 'Koios Bonus',
      resource: 'Koios',
      baseCost: 6e8,
      costMultiplier: 8,
      maxLevel: 50,
      color: '#8b5cf6',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const koiosCrew = gameStats.koiosCrew || 0;
          const koiosRank = gameStats.koiosRank || 0;
          return Math.pow(
            ((1 + (0.0012 * level)) ** koiosCrew) * ((1 + (0.02 * level)) ** koiosRank),
            1 + (powerLevel * 0.1) - 0.1
          );
        }
      }
    },
    {
      id: 'zeus-bonus',
      name: 'Zeus Bonus',
      resource: 'Zeus',
      baseCost: 7e8,
      costMultiplier: 9,
      maxLevel: 50,
      color: '#8b5cf6',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const zeusCrew = gameStats.zeusCrew || 0;
          const zeusRank = gameStats.zeusRank || 0;
          return Math.pow(
            ((1 + (0.0012 * level)) ** zeusCrew) * ((1 + (0.02 * level)) ** zeusRank),
            1 + (powerLevel * 0.1) - 0.1
          );
        }
      }
    },
    {
      id: 'blueprints',
      name: 'Blueprints',
      resource: 'Blueprints',
      baseCost: 1,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#06b6d4',
      unlock: 1,
      multiplier: {
        base: 8,
        calculate: (level, powerLevel) => {
          return (8 * level) * powerLevel;
        }
      }
    },
    {
      id: 'innovation-cores',
      name: 'Innovation Cores',
      resource: 'Innovation Cores',
      baseCost: 1,
      costMultiplier: 10,
      maxLevel: 50,
      color: '#a855f7',
      unlock: 1,
      multiplier: {
        base: 8,
        calculate: (level, powerLevel) => {
          return (8 * level) * powerLevel;
        }
      }
    }
  ]
};

export default POWER_GEM;
