/**
 * Power Gem Constants for Gem Planner
 */
import Decimal from 'break_infinity.js';

export const POWER_GEM = {
  id: 'power',
  name: 'Power',
  maxLevel: 2,
  color: {
    primary: '#8b5cf6', // Purple
    secondary: '#a78bfa', // Light Purple
    gradient: 'linear-gradient(135deg, #723af5ff 0%, #a78bfa 100%)'
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
      color: '#efebef',
      unlock: 1,
      costBumps: [
        { startLevel: 9, multiplier: 1.5 },
      ],
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const cradleCrew = gameStats.cradleCrew || 0;
          const cradleRank = gameStats.cradleRank || 0;
          const levelDecimal = new Decimal(level);
          const powerLevelDecimal = new Decimal(powerLevel);
          const cradleCrewDecimal = new Decimal(cradleCrew);
          const cradleRankDecimal = new Decimal(cradleRank);
          
          // (1 + (0.0012 * level)) ** cradleCrew
          const crewBase = new Decimal(1).add(levelDecimal.mul(0.0012));
          const crewPower = crewBase.pow(cradleCrewDecimal);
          
          // (1 + (0.02 * level)) ** cradleRank
          const rankBase = new Decimal(1).add(levelDecimal.mul(0.02));
          const rankPower = rankBase.pow(cradleRankDecimal);
          
          // crewPower * rankPower
          const innerResult = crewPower.mul(rankPower);
          
          // Outer exponent: 1 + (powerLevel * 0.1) - 0.1
          const outerExponent = new Decimal(1).add(powerLevelDecimal.mul(0.1)).sub(0.1);
          
          return innerResult.pow(outerExponent);
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
      color: '#fe8e39',
      unlock: 1,
      costBumps: [
        { startLevel: 9, multiplier: 2 },
      ],
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const auxesiaCrew = gameStats.auxesiaCrew || 0;
          const auxesiaRank = gameStats.auxesiaRank || 0;
          const levelDecimal = new Decimal(level);
          const powerLevelDecimal = new Decimal(powerLevel);
          const auxesiaCrewDecimal = new Decimal(auxesiaCrew);
          const auxesiaRankDecimal = new Decimal(auxesiaRank);
          
          // (1 + (0.0014 * level)) ** auxesiaCrew
          const crewBase = new Decimal(1).add(levelDecimal.mul(0.0014));
          const crewPower = crewBase.pow(auxesiaCrewDecimal);
          
          // (1 + (0.02 * level)) ** auxesiaRank
          const rankBase = new Decimal(1).add(levelDecimal.mul(0.02));
          const rankPower = rankBase.pow(auxesiaRankDecimal);
          
          // crewPower * rankPower
          const innerResult = crewPower.mul(rankPower);
          
          // Outer exponent: 1 + (powerLevel * 0.1) - 0.1
          const outerExponent = new Decimal(1).add(powerLevelDecimal.mul(0.1)).sub(0.1);
          
          return innerResult.pow(outerExponent);
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
      color: '#f8363f ',
      unlock: 1,
      costBumps: [
        { startLevel: 9, multiplier: 2.5 },
      ],
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const zagreusCrew = gameStats.zagreusCrew || 0;
          const zagreusRank = gameStats.zagreusRank || 0;
          const levelDecimal = new Decimal(level);
          const powerLevelDecimal = new Decimal(powerLevel);
          const zagreusCrewDecimal = new Decimal(zagreusCrew);
          const zagreusRankDecimal = new Decimal(zagreusRank);
          
          // (1 + (0.002 * level)) ** zagreusCrew
          const crewBase = new Decimal(1).add(levelDecimal.mul(0.002));
          const crewPower = crewBase.pow(zagreusCrewDecimal);
          
          // (1 + (0.03 * level)) ** zagreusRank
          const rankBase = new Decimal(1).add(levelDecimal.mul(0.03));
          const rankPower = rankBase.pow(zagreusRankDecimal);
          
          // crewPower * rankPower
          const innerResult = crewPower.mul(rankPower);
          
          // Outer exponent: 1 + (powerLevel * 0.1) - 0.1
          const outerExponent = new Decimal(1).add(powerLevelDecimal.mul(0.1)).sub(0.1);
          
          return innerResult.pow(outerExponent);
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
      color: '#8bfe4a',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const hephaestusCrew = gameStats.hephaestusCrew || 0;
          const hephaestusRank = gameStats.hephaestusRank || 0;
          const levelDecimal = new Decimal(level);
          const powerLevelDecimal = new Decimal(powerLevel);
          const hephaestusCrewDecimal = new Decimal(hephaestusCrew);
          const hephaestusRankDecimal = new Decimal(hephaestusRank);
          
          // (1 + (0.0012 * level)) ** hephaestusCrew
          const crewBase = new Decimal(1).add(levelDecimal.mul(0.0012));
          const crewPower = crewBase.pow(hephaestusCrewDecimal);
          
          // (1 + (0.02 * level)) ** hephaestusRank
          const rankBase = new Decimal(1).add(levelDecimal.mul(0.02));
          const rankPower = rankBase.pow(hephaestusRankDecimal);
          
          // crewPower * rankPower
          const innerResult = crewPower.mul(rankPower);
          
          // Outer exponent: 1 + (powerLevel * 0.1) - 0.1
          const outerExponent = new Decimal(1).add(powerLevelDecimal.mul(0.1)).sub(0.1);
          
          return innerResult.pow(outerExponent);
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
      color: '#39cbff',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const demeterCrew = gameStats.demeterCrew || 0;
          const demeterRank = gameStats.demeterRank || 0;
          const levelDecimal = new Decimal(level);
          const powerLevelDecimal = new Decimal(powerLevel);
          const demeterCrewDecimal = new Decimal(demeterCrew);
          const demeterRankDecimal = new Decimal(demeterRank);
          
          // (1 + (0.0034 * level)) ** demeterCrew
          const crewBase = new Decimal(1).add(levelDecimal.mul(0.0034));
          const crewPower = crewBase.pow(demeterCrewDecimal);
          
          // (1 + (0.02 * level)) ** demeterRank
          const rankBase = new Decimal(1).add(levelDecimal.mul(0.02));
          const rankPower = rankBase.pow(demeterRankDecimal);
          
          // crewPower * rankPower
          const innerResult = crewPower.mul(rankPower);
          
          // Outer exponent: 1 + (powerLevel * 0.1) - 0.1
          const outerExponent = new Decimal(1).add(powerLevelDecimal.mul(0.1)).sub(0.1);
          
          return innerResult.pow(outerExponent);
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
      color: '#4b643f',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const koiosCrew = gameStats.koiosCrew || 0;
          const koiosRank = gameStats.koiosRank || 0;
          const levelDecimal = new Decimal(level);
          const powerLevelDecimal = new Decimal(powerLevel);
          const koiosCrewDecimal = new Decimal(koiosCrew);
          const koiosRankDecimal = new Decimal(koiosRank);
          
          // (1 + (0.0014 * level)) ** koiosCrew
          const crewBase = new Decimal(1).add(levelDecimal.mul(0.0014));
          const crewPower = crewBase.pow(koiosCrewDecimal);
          
          // (1 + (0.02 * level)) ** koiosRank
          const rankBase = new Decimal(1).add(levelDecimal.mul(0.02));
          const rankPower = rankBase.pow(koiosRankDecimal);
          
          // crewPower * rankPower
          const innerResult = crewPower.mul(rankPower);
          
          // Outer exponent: 1 + (powerLevel * 0.1) - 0.1
          const outerExponent = new Decimal(1).add(powerLevelDecimal.mul(0.1)).sub(0.1);
          
          return innerResult.pow(outerExponent);
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
      color: '#1d4491',
      unlock: 1,
      multiplier: {
        base: 1,
        calculate: (level, powerLevel, gameStats = {}) => {
          const zeusCrew = gameStats.zeusCrew || 0;
          const zeusRank = gameStats.zeusRank || 0;
          const levelDecimal = new Decimal(level);
          const powerLevelDecimal = new Decimal(powerLevel);
          const zeusCrewDecimal = new Decimal(zeusCrew);
          const zeusRankDecimal = new Decimal(zeusRank);
          
          // (1 + (0.0012 * level)) ** zeusCrew
          const crewBase = new Decimal(1).add(levelDecimal.mul(0.0012));
          const crewPower = crewBase.pow(zeusCrewDecimal);
          
          // (1 + (0.02 * level)) ** zeusRank
          const rankBase = new Decimal(1).add(levelDecimal.mul(0.02));
          const rankPower = rankBase.pow(zeusRankDecimal);
          
          // crewPower * rankPower
          const innerResult = crewPower.mul(rankPower);
          
          // Outer exponent: 1 + (powerLevel * 0.1) - 0.1
          const outerExponent = new Decimal(1).add(powerLevelDecimal.mul(0.1)).sub(0.1);
          
          return innerResult.pow(outerExponent);
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
      color: '#0c4b53',
      type: 'additive',
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
      color: '#ffdf39',
      type: 'additive',
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
