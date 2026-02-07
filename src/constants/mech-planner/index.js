export const mechs = [
  {
    name: 'Cradler-Unit MK1',
    key: 'cradler_mk1',
    output: 'Cells',
    color: 'green',
    baseMulti: 0.05,
    baseCap: 1e75,
    timeStart: 60 * 60 * 6, 
    timeReduce: 120,
    timeCost: 2,
    timeMaxLevels: 90,
    timeCostTiers: [
      { minLevel: 115, multiplier: 15.552 },
      { minLevel: 110, multiplier: 9.72 },
      { minLevel: 105, multiplier: 6.075 },
      { minLevel: 100, multiplier: 4.05 },
      { minLevel: 95, multiplier: 2.7 },
      { minLevel: 90, multiplier: 1.8 },
      { minLevel: 0, multiplier: 1.2 }
    ],
    multiIncrease: 0.027,
    multiCost: 7.2,
    multiCostMulti: 3.6,
    multiMaxLevels: 10,
    mechCost: 5.4,
    mechCostMulti: 1.8,
    creagn2: true,
  },
  {
    name: 'Zag-Unit MK1',
    key: 'zag_mk1',
    output: 'MP',
    color: 'red',
    baseMulti: 0.04,
    baseCap: 1e25,
    timeStart: 60 * 60 * 10, 
    timeReduce: 180,
    timeCost: 200,
    timeMaxLevels: 60,
    timeCostTiers: [
      { minLevel: 85, multiplier: 16.2 },
      { minLevel: 80, multiplier: 10.125 },
      { minLevel: 75, multiplier: 6.328125 },
      { minLevel: 70, multiplier: 4.21875 },
      { minLevel: 65, multiplier: 2.8125 },
      { minLevel: 60, multiplier: 1.875 },
      { minLevel: 0, multiplier: 1.25 }
    ],
    multiIncrease: 0.026,
    multiCost: 480,
    multiCostMulti: 4.8,
    multiMaxLevels: 7,
    mechCost: 200,
    mechCostMulti: 2,
  },
  {
    name: 'Demshah-Unit MK1',
    key: 'demshah_mk1',
    output: 'Shards',
    color: 'cyan',
    baseMulti: 0.03,
    baseCap: 1e25,
    timeStart: 60 * 60 * 12, 
    timeReduce: 240,
    timeCost: 2e4,
    timeMaxLevels: 30,
    timeCostTiers: [
      { minLevel: 55, multiplier: 16.2 },
      { minLevel: 50, multiplier: 10.125 },
      { minLevel: 45, multiplier: 6.328125 },
      { minLevel: 40, multiplier: 4.21875 },
      { minLevel: 35, multiplier: 2.8125 },
      { minLevel: 30, multiplier: 1.875 },
      { minLevel: 0, multiplier: 1.25 }
    ],
    multiIncrease: 0.016,
    multiCost: 1e5,
    multiCostMulti: 10,
    multiMaxLevels: 6,
    mechCost: 4e4,
    mechCostMulti: 2,
  },
  {
    name: 'Auxbot-S Unit MK1',
    key: 'auxbot_s_mk1',
    output: 'Software Tech',
    color: 'orange',
    baseMulti: 0.03,
    baseCap: 1e25,
    timeStart: 60 * 60 * 16,
    timeReduce: 300,
    timeCost: 3e5,
    timeMaxLevels: 30,
    timeCostTiers: [
      { minLevel: 55, multiplier: 16.2 },
      { minLevel: 50, multiplier: 10.125 },
      { minLevel: 45, multiplier: 6.328125 },
      { minLevel: 40, multiplier: 4.21875 },
      { minLevel: 35, multiplier: 2.8125 },
      { minLevel: 30, multiplier: 1.875 },
      { minLevel: 0, multiplier: 1.25 }
    ],
    multiIncrease: 0.018,
    multiCost: 5e5,
    multiCostMulti: 50,
    multiMaxLevels: 5,
    mechCost: 1e5,
    mechCostMulti: 2,
  },
  {
    name: 'Token-Unit MK1',
    key: 'token_mk1',
    output: 'Tokens',
    color: 'yellow',
    baseMulti: 0,
    baseCap: 0,
    timeStart: 60 * 60 * 24, 
    timeReduce: 600,
    timeCost: 1e5,
    timeMaxLevels: 72,
    timeCostTiers: [
      { minLevel: 97, multiplier: 16.2 },
      { minLevel: 92, multiplier: 10.125 },
      { minLevel: 87, multiplier: 6.328125 },
      { minLevel: 82, multiplier: 5.0625 },
      { minLevel: 77, multiplier: 3.375 },
      { minLevel: 72, multiplier: 2.25 },
      { minLevel: 0, multiplier: 1.5 }
    ],
    multiIncrease: 10000,
    multiCost: 8e5,
    multiCostMulti: 10,
    multiMaxLevels: 10,
    mechCost: 1.8e5,
    mechCostMulti: 1.8,
  },
  {
    name: 'Cradler-Unit MK2',
    key: 'cradler_mk2',
    output: 'Cells',
    color: 'green',
    baseMulti: 0.1,
    baseCap: 1e200,
    timeStart: 60 * 60 * 12,
    timeReduce: 240,
    timeCost: 5e5,
    timeCostMulti: 1.2,
    timeMaxLevels: 120,
    timeCostTiers: [
      { minLevel: 195, multiplier: 16.2 },
      { minLevel: 140, multiplier: 8.991 },
      { minLevel: 135, multiplier: 5.619375 },
      { minLevel: 130, multiplier: 3.74625 },
      { minLevel: 125, multiplier: 2.4975 },
      { minLevel: 120, multiplier: 1.665 },
      { minLevel: 0, multiplier: 1.11 }
    ],
    multiIncrease: 0.068,
    multiCost: 3e5,
    multiCostMulti: 3,
    multiMaxLevels: 12,
    mechCost: 3.6e5,
    mechCostMulti: 1.8,
    creagn2: true,
  },
  {
    name: 'Commander-Unit MK1',
    key: 'commander_mk1',
    output: 'AP',
    color: 'blue',
    baseMulti: 0.02,
    baseCap: 1e1,
    timeStart: 60 * 60 * 24, 
    timeReduce: 300,
    timeCost: 5e9,
    timeMaxLevels: 30,
    timeCostTiers: [
      { minLevel: 55, multiplier: 16.2 },
      { minLevel: 50, multiplier: 10.125 },
      { minLevel: 45, multiplier: 6.328125 },
      { minLevel: 40, multiplier: 4.21875 },
      { minLevel: 35, multiplier: 2.8125 },
      { minLevel: 30, multiplier: 1.875 },
      { minLevel: 0, multiplier: 1.25 }
    ],
    multiIncrease: 0.016,
    multiCost: 7e11,
    multiCostMulti: 70,
    multiMaxLevels: 5,
    mechCost: 1.5e11,
    mechCostMulti: 2.5,
    unlock: 2,
  },
  {
    name: 'Auxbot-H Unit MK1',
    key: 'auxbot_h_mk1',
    output: 'Hardware Tech',
    color: 'orange',
    baseMulti: 0.03,
    baseCap: 1e1,
    timeStart: 60 * 60 * 24, 
    timeReduce: 300,
    timeCost: 1e10,
    timeMaxLevels: 30,
    timeCostTiers: [
      { minLevel: 55, multiplier: 16.2 },
      { minLevel: 50, multiplier: 10.125 },
      { minLevel: 45, multiplier: 6.328125 },
      { minLevel: 40, multiplier: 4.21875 },
      { minLevel: 35, multiplier: 2.8125 },
      { minLevel: 30, multiplier: 1.875 },
      { minLevel: 0, multiplier: 1.25 }
    ],
    multiIncrease: 0.018,
    multiCost: 5e12,
    multiCostMulti: 50,
    multiMaxLevels: 5,
    mechCost: 2e11,
    mechCostMulti: 2,
    unlock: 3,
  },
  {
    name: 'Zag-Unit MK2',
    key: 'zag_mk2',
    output: 'MP',
    color: 'red',
    baseMulti: 10,
    baseCap: 1,
    timeStart: 60 * 60 * 48, 
    timeReduce: 900,
    timeCost: 5e18,
    timeMaxLevels: 30,
    timeCostTiers: [
      { minLevel: 0, multiplier: 1.4 }
    ],
    multiIncrease: 5,
    multiCost: 4e21,
    multiCostMulti: 40,
    multiMaxLevels: 5,
    mechCost: 8e19,
    mechCostMulti: 2,
    unlock: 4,
  },
  {
    name: 'Demshah-Unit MK2',
    key: 'demshah_mk2',
    output: 'Shards',
    color: 'cyan',
    baseMulti: 10,
    baseCap: 1,
    timeStart: 60 * 60 * 72,
    timeReduce: 1200,
    timeCost: 5e18,
    timeMaxLevels: 30,
    timeCostTiers: [
      { minLevel: 0, multiplier: 1.4 }
    ],
    multiIncrease: 5,
    multiCost: 4e21,
    multiCostMulti: 40,
    multiMaxLevels: 5,
    mechCost: 8e19,
    mechCostMulti: 2,
    unlock: 4,
  },
  {
    name: 'Koikoi-Unit MK1',
    key: 'koikoi_mk1',
    output: 'RP',
    color: 'brown',
    baseMulti: 10,
    baseCap: 1,
    timeStart: 60 * 60 * 96,
    timeReduce: 1500,
    timeCost: 5e18,
    timeMaxLevels: 30,
    timeCostTiers: [
      { minLevel: 0, multiplier: 1.4 }
    ],
    multiIncrease: 5,
    multiCost: 4e21,
    multiCostMulti: 40,
    multiMaxLevels: 5,
    mechCost: 8e19,
    mechCostMulti: 2,
    unlock: 4,
  }
];

// Hilfsfunktion für Tier-basierte Cost Berechnung
export const calculateTierCost = (baseCost, currentLevel, tiers) => {
  if (!tiers || tiers.length === 0) {
    return baseCost; // Fallback wenn keine Tiers definiert
  }
  
  let totalCost = baseCost;
  
  for (let level = 0; level < currentLevel; level++) {
    // Finde den passenden Tier für dieses Level
    const tier = tiers.find(t => level >= t.minLevel) || tiers[tiers.length - 1];
    totalCost *= tier.multiplier;
  }
  
  return totalCost;
};

// Vereinfachte Getter für Cost Multiplier
export const getTimeCostMultiplier = (mechKey, level) => {
  const mech = getMechByKey(mechKey);
  if (!mech || !mech.timeCostTiers) return mech?.timeCostMulti || 1.2;
  
  const tier = mech.timeCostTiers.find(t => level >= t.minLevel);
  return tier?.multiplier || mech.timeCostMulti || 1.2;
};

// Hilfsfunktionen für den Mech Planner
export const getMechById = (id) => {
  return mechs.find(mech => mech.id === id);
};

export const getMechByKey = (key) => {
  return mechs.find(mech => mech.key === key);
};