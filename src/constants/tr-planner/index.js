// Boost-Kategorien und ihre zugehörigen Boosts
export const boostCategories = [
  {
    id: 'time',
    label: 'Time Related',
  },
  {
    id: 'milestone',
    label: 'Milestones',
  },
  {
    id: 'relic',
    label: 'Relics',
  },
  {
    id: 'inscryption',
    label: 'Inscryptions',
  },
  {
    id: 'boonE',
    label: 'Boon Eternity',
  },
  {
    id: 'boonH',
    label: 'Boon Hegemony',
  },
  {
    id: 'gadget',
    label: 'Gadgets',
  },
  {
    id: 'research',
    label: 'Researches',
  },
  {
    id: 'cm',
    label: 'Construction Milestones',
  },
  {
    id: 'badge',
    label: 'Void Badges',
  },
  {
    id: 'premium',
    label: 'Premium',
  },
  {
    id: 'gem',
    label: 'Gems',
  },
];

// General Stats für das StatsInputModal
export const generalStats = [
  {
    key: 'trCount',
    label: 'TR Count',
    type: 'number',
  },
  {
    key: 'allTimeOrbs',
    label: 'All-Time Orbs',
    type: 'number',
  }
];

// Alle Boosts mit Kategoriezuordnung
export const allBoosts = [
  {
    key: 'hoursInTR',
    label: 'Hours in TR',
    category: 'time',
    type: 'number',
    orbcalc: true,
    tooltip: '0',
    fastControl: 24,
    multiplier: (value, allValues) => {
      const hoursInTR = value || 0;
      const loopMods = allValues.loopMods || 0;
    
      const hoursExponent = Math.min(2.42, 1.02 + hoursInTR * 0.00256);
      const loopModsExponent = Math.min(2.42, 1.02 + loopMods * 0.00005);
  
      const hoursTerm = Math.pow(hoursInTR, hoursExponent);
      const loopModsTerm = Math.pow(loopMods, loopModsExponent);
  
      return Math.pow(1 + hoursTerm * loopModsTerm, 0.06); 
    },
  },
  {
    key: 'loopMods',
    label: 'Loop Mods',
    category: 'time',
    type: 'number',
    orbcalc: true,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    multiplier: 1,
  },

  // Milestones
  {
    key: 'ms0',
    label: 'Milestone #0',
    category: 'milestone',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.1, value),
    fragmulti: (value, allValues) => {
      if (allValues.attr3) {
        return Math.pow(1.011, value);
      }
      
      return 1;
    },
  },

  // Relics
  {
    key: 'r6',
    label: 'Relic #6',
    category: 'relic',
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: (value) => {
      const part1 = 2.75 * value;
      const part2 = Math.pow(1.05, value); 
      return part1 * part2; 
    },
    max: 11
  },
  {
    key: 'r9',
    label: 'Relic #9',
    category: 'relic',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.08, value),
    max: 100
  },

  // Inscriptions
  {
    key: 'i52',
    label: 'Inscryp. #52',
    category: 'inscryption',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.03, value),
    max: 8
  },
  {
    key: 'i78',
    label: 'Inscryp. #78',
    category: 'inscryption',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.08, value),
    max: 8
  },
  {
    key: 'i101',
    label: 'Inscryp. #101',
    category: 'inscryption',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.08, value),
    max: 8
  },

  //Construction Milestones
  {
    key: 'cm47',
    label: 'CM #47',
    category: 'cm',
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.04,
  },

  // Boon E
  {
    key: 'boonELevel',
    label: 'Boon E Level',
    category: 'boonE',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1,
    max: 2
  },
  {
    key: 'campaigns',
    label: 'Campaigns',
    category: 'boonE',
    type: 'number',
    orbcalc: true,
    tooltip: '0',
    // Orb-Multiplikator mit Boon E Level Abhängigkeit
    multiplier: (value, allValues) => {
      const boonLevel = allValues.boonELevel || 0;
      
      // Level 0: Neutral
      if (boonLevel === 0) return 1;
      
      // Basis-Multiplikator
      const baseMultiplier = Math.pow(1.006, value);
      
      // Level 1: Normaler Multiplikator
      if (boonLevel === 1) return baseMultiplier;
      
      // Level 2+: Potenziert mit dem Boon-Level
      return Math.pow(baseMultiplier, boonLevel);
    },
    // Fragment-Multiplikator mit Boon E Level Abhängigkeit
    fragmulti: (value, allValues) => {
      const boonLevel = allValues.boonELevel || 0;
      
      // Level 0: Neutral
      if (boonLevel === 0) return 1;
      
      // Basis-Multiplikator
      const baseMultiplier = Math.pow(1.03, value);
      
      // Level 1: Normaler Multiplikator
      if (boonLevel === 1) return baseMultiplier;
      
      // Level 2+: Potenziert mit dem Boon-Level
      return Math.pow(baseMultiplier, boonLevel);
    },
  },

  // Boon H
  {
    key: 'boonHLevel',
    label: 'Boon H Level',
    category: 'boonH',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1,
    max: 2
  },
  {
    key: 'shipinstalls',
    label: 'Ship Installs',
    category: 'boonH',
    type: 'number',
    orbcalc: true,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    // Orb-Multiplikator mit Boon H Level Abhängigkeit
    multiplier: (value, allValues) => {
      const boonLevel = allValues.boonHLevel || 0;
      
      // Level 0: Neutral
      if (boonLevel === 0) return 1;
      
      // Basis-Multiplikator
      const baseMultiplier = Math.pow(1.000015, value);
      
      // Level 1: Normaler Multiplikator
      if (boonLevel === 1) return baseMultiplier;
      
      // Level 2+: Potenziert mit dem Boon-Level
      return Math.pow(baseMultiplier, boonLevel);
    },
  },
  {
    key: 'ouroinstalls',
    label: 'Ouro Installs',
    category: 'boonH',
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    // Fragment-Multiplikator mit Boon H Level Abhängigkeit
    fragmulti: (value, allValues) => {
      const boonLevel = allValues.boonHLevel || 0;
      
      // Level 0: Neutral
      if (boonLevel === 0) return 1;
      
      // Basis-Multiplikator
      const baseMultiplier = Math.pow(1.01, value);
      
      // Level 1: Normaler Multiplikator
      if (boonLevel === 1) return baseMultiplier;
      
      // Level 2+: Potenziert mit dem Boon-Level
      return Math.pow(baseMultiplier, boonLevel);
    },
  },

  // Gadgets
  {
    key: 'oogadget',
    label: 'Serpents Connection Band',
    category: 'gadget',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => {
      const baseMultiplier = Math.pow(1 + 0.0035, value);
      const levelMultiplier = Math.pow(1.04, Math.floor(value / 10));

      return baseMultiplier * levelMultiplier;
    }
  },
  {
    key: 'campfragdet',
    label: 'Galactic Fragment Magnet',
    category: 'gadget',
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: (value) => {
      const baseMultiplier = Math.pow(1 + 0.01, value);
      const levelMultiplier = Math.pow(1.08, Math.floor(value / 10));

      return baseMultiplier * levelMultiplier;
    }
  },

  // Researches
  {
    key: 'research',
    label: 'Research Points',
    category: 'research',
    type: 'number',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    multiplier: (value) => {
      let overallMultiplier = 1;
    
      // Für jede Research (85, 87, 88, 90)
      for (const research in researchData) {
        let researchMultiplier = 1;
        
        // Iteriere über die Level (aufsteigend sortiert)
        for (const levelData of researchData[research]) {
          if (value >= levelData.price) {
            // Level ist erschwinglich – multiplikatorisch berücksichtigen
            researchMultiplier *= levelData.multiplier;
          } else {
            // Sobald ein Level nicht mehr erschwinglich ist, brechen wir ab
            break;
          }
        }
        
        // Multipliziere das Ergebnis der aktuellen Research mit dem Gesamtwert
        overallMultiplier *= researchMultiplier;
      }
    
      return overallMultiplier;
    },
    max: 4465
  },
  {
    key: 'research89',
    label: 'Research #89',
    category: 'research',
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: (value) => {
      // Array mit Multiplikatoren für Level 1 bis 6
      const multipliers = [1.1, 1.1, 1.14, 1.14, 1.18, 1.18];
      
      // Starte mit 1 als neutralem Multiplikator
      let result = 1;
      
      // Multipliziere alle Multiplikatoren der Levels, die erreicht wurden.
      // Dabei gehen wir von Index 0 bis levelCount - 1
      for (let i = 0; i < value && i < multipliers.length; i++) {
        result *= multipliers[i];
      }
      
      return result;
    },
    max: 6
  },

  // Premium
  {
    key: 'tr5Special',
    label: 'Diamond Special',
    category: 'premium',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => 1 + 0.01 * value,
    max: 10
  },
  {
    key: 'iap',
    label: 'IAP Trav. Pack',
    category: 'premium',
    type: 'boolean',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    key: 'hera',
    label: 'Hera Card',
    category: 'premium',
    type: 'boolean',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1.05,
  },
  {
    key: 'jaxis',
    label: 'Jaxis Card',
    category: 'premium',
    type: 'boolean',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1.05,
  },

  // Gems
  {
    key: 'attr3',
    label: 'Attraction Gem #3',
    category: 'gem',
    type: 'boolean',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
  },
  {
    key: 'attr1',
    label: 'Attraction GN #1',
    category: 'gem',
    type: 'boolean',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: 1.5,
  },
  {
    key: 'pow2',
    label: 'Power GN #2',
    category: 'gem',
    type: 'boolean',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: 2,
  },

  // Void Badges
  {
    key: 'vb1',
    label: 'Void Badge #1',
    category: 'badge',
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    key: 'vb2',
    label: 'Void Badge #2',
    category: 'badge',
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    key: 'vb3',
    label: 'Void Badge #3',
    category: 'badge',
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    key: 'vb4',
    label: 'Void Badge #4',
    category: 'badge',
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.5,
  },
  {
    key: 'vb5',
    label: 'Void Badge #5',
    category: 'badge',
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 2,
  },
];

// Research data for multiplier calculations
export const researchData = {
  '85': [
    { level: 1, price: 2840, multiplier: 1.01 },
    { level: 2, price: 2985, multiplier: 1.02 },
    { level: 3, price: 3130, multiplier: 1.03 },
    { level: 4, price: 3275, multiplier: 1.04 },
    { level: 5, price: 3420, multiplier: 1.05 },
    { level: 6, price: 3565, multiplier: 1.06 }
  ],
  '87': [
    { level: 1, price: 3320, multiplier: 1.01 },
    { level: 2, price: 3440, multiplier: 1.02 },
    { level: 3, price: 3560, multiplier: 1.03 },
    { level: 4, price: 3680, multiplier: 1.04 },
    { level: 5, price: 3800, multiplier: 1.05 },
    { level: 6, price: 3920, multiplier: 1.06 }
  ],
  '88': [
    { level: 1, price: 3355, multiplier: 1.01 },
    { level: 2, price: 3530, multiplier: 1.02 },
    { level: 3, price: 3705, multiplier: 1.03 },
    { level: 4, price: 3880, multiplier: 1.04 },
    { level: 5, price: 4055, multiplier: 1.05 },
    { level: 6, price: 4230, multiplier: 1.06 }
  ],
  '90': [
    { level: 1, price: 3490, multiplier: 1.02 },
    { level: 2, price: 3685, multiplier: 1.03 },
    { level: 3, price: 3880, multiplier: 1.05 },
    { level: 4, price: 4075, multiplier: 1.08 },
    { level: 5, price: 4270, multiplier: 1.13 },
    { level: 6, price: 4465, multiplier: 1.21 }
  ]
};

// Helper function to get boosts by category
export const boostsByCategory = boostCategories.map(category => ({
  ...category,
  boosts: allBoosts.filter(boost => boost.category === category.id)
}));

export const alwaysUpdateKeys = [
  ...allBoosts.map(boost => boost.key),
  ...generalStats.map(stat => stat.key),
];