import { useTRPlannerStore } from '@/store/orbStore';

// Helper-Funktion um Gem-Daten aus dem Store zu laden
export function getGemDataFromStore() {
  try {
    // 1. Versuche Store-Daten zu laden
    const trPlannerStore = useTRPlannerStore();
    const gemData = trPlannerStore.userStats.gemData;
    
    if (gemData && gemData.levels) {
      return {
        levels: gemData.levels,
        activeNodes: gemData.activeNodes || {
          temporal: [],
          innovation: [],
          attraction: [],
          power: [],
          creation: [],
          evolution: []
        }
      };
    }
    
    // 2. FALLBACK: Versuche Legacy-Daten aus einem aktiven Plan zu migrieren
    const legacyGemData = migrateLegacyGemDataFromPlans();
    if (legacyGemData) {
      console.log('Migrierte Legacy-Gem-Daten:', legacyGemData);
      
      // Speichere migrierte Daten im Store
      trPlannerStore.updateUserStats({ gemData: legacyGemData });
      return legacyGemData;
    }
    
    // 3. DEFAULT: Fallback-Werte
    return getDefaultGemData();
    
  } catch (error) {
    console.warn('Could not load gem data from store:', error);
    return getDefaultGemData();
  }
}

function migrateLegacyGemDataFromPlans() {
  try {
    // Lade TR-Pläne aus localStorage
    const plansData = localStorage.getItem('trplanner_plans');
    if (!plansData) return null;
    
    const plans = JSON.parse(plansData);
    if (!Array.isArray(plans) || plans.length === 0) return null;
    
    // Finde den neuesten Plan mit Legacy-Gem-Daten
    const latestPlan = plans
      .filter(plan => plan.updatedStats || plan.boosts)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0];
    
    if (!latestPlan) return null;
    
    // Extrahiere Gem-Informationen aus dem Plan
    const extractedGemData = {
      levels: {
        exodus: 0,
        temporal: 0,
        innovation: 0,
        attraction: 0,
        power: 0,
        creation: 0,
        evolution: 0
      },
      activeNodes: {
        temporal: [],
        innovation: [],
        attraction: [],
        power: [],
        creation: [],
        evolution: []
      }
    };
    
    // Aus updatedStats extrahieren
    if (latestPlan.updatedStats) {
      const stats = latestPlan.updatedStats;
      
      // Innovation Gem
      if (stats.innogem !== undefined) {
        extractedGemData.levels.innovation = Math.max(0, stats.innogem);
      }
      
      // Attraction Gem Level aus attr3-Boolean ableiten
      if (stats.attr3 === true) {
        extractedGemData.levels.attraction = Math.max(3, extractedGemData.levels.attraction);
      }
      
      // Attraction Node #1 aus attr1-Boolean ableiten
      if (stats.attr1 === true && extractedGemData.levels.attraction >= 1) {
        extractedGemData.activeNodes.attraction.push(0); // Node #1 = Index 0
      }
      
      // Power Node #2 aus pow2-Boolean ableiten
      if (stats.pow2 === true) {
        extractedGemData.levels.power = Math.max(1, extractedGemData.levels.power);
        extractedGemData.activeNodes.power.push(1); // Node #2 = Index 1
      }
    }
    
    // Aus boosts extrahieren (falls verfügbar)
    if (latestPlan.boosts) {
      latestPlan.boosts.forEach(boost => {
        switch (boost.key) {
          case 'innogem':
            if (boost.targetLevel !== undefined) {
              extractedGemData.levels.innovation = Math.max(0, boost.targetLevel);
            }
            break;
          case 'attr3':
            if (boost.targetState === true) {
              extractedGemData.levels.attraction = Math.max(3, extractedGemData.levels.attraction);
            }
            break;
          case 'attr1':
            if (boost.targetState === true && extractedGemData.levels.attraction >= 1) {
              if (!extractedGemData.activeNodes.attraction.includes(0)) {
                extractedGemData.activeNodes.attraction.push(0);
              }
            }
            break;
          case 'pow2':
            if (boost.targetState === true) {
              extractedGemData.levels.power = Math.max(1, extractedGemData.levels.power);
              if (!extractedGemData.activeNodes.power.includes(1)) {
                extractedGemData.activeNodes.power.push(1);
              }
            }
            break;
        }
      });
    }
    
    // Nur zurückgeben wenn mindestens ein Gem > 0 ist
    const hasGemData = Object.values(extractedGemData.levels).some(level => level > 0);
    return hasGemData ? extractedGemData : null;
    
  } catch (error) {
    console.error('Error migrating legacy gem data:', error);
    return null;
  }
}

function getDefaultGemData() {
  return {
    levels: {
      exodus: 0,
      temporal: 0,
      innovation: 0,
      attraction: 0,
      power: 0,
      creation: 0,
      evolution: 0
    },
    activeNodes: {
      temporal: [],
      innovation: [],
      attraction: [],
      power: [],
      creation: [],
      evolution: []
    }
  };
}

// Boost-Kategorien und ihre zugehörigen Boosts
export const boostCategories = [
  {
    id: 'time',
    label: 'Time and Loop Mods',
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
    id: 'trinkets',
    label: 'Trinkets',
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
    label: 'Loop Mods Count',
    category: 'time',
    type: 'number',
    orbcalc: true,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    multiplier: 1,
  },
  {
    key: 'lmConsistency',
    label: 'Ultima LM: Rule of Consistency',
    category: 'time',
    unlock: 'temporal',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    tooltip: '0',
    normalControl: 1,
    fastControl: 10,
    multiplier: (value) => Math.pow(1.02, value),
  },
  // Milestones
  {
    key: 'ms0',
    label: 'Milestone #0',
    category: 'milestone',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: 'For Campaign Fragments Multiplier Attraction Gem Level #3 required.',
    multiplier: (value) => Math.pow(1.1, value),
    fragmulti: (value, allValues) => {
      // Store-Integration: Attraction Gem Level und Node direkt aus Store laden
      const gemData = getGemDataFromStore();
      const attractionLevel = gemData.levels.attraction || 0;
      
      // Prüfe ob Attraction Level 3
      if (attractionLevel >= 3) {
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
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.04,
  },
  {
    key: 'cm49',
    label: 'CM #49',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.08,
  },
  {
    key: 'cm50',
    label: 'CM #50',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.05,
  },
  {
    key: 'cm51',
    label: 'CM #51',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.02,
  },

  // Boon E
  {
    key: 'boonELevel',
    label: 'Boon E Level',
    category: 'boonE',
    unlock: 'temporal',
    unlock_level: 2,
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
    unlock: 'temporal',
    unlock_level: 2,
    type: 'number',
    orbcalc: true,
    tooltip: 'Total number of Campaign Missions completed.',
    minRequirement: {
      boost: 'boonELevel', 
      level: 1          
    },
    multiplier: (value, allValues) => {
      // Bestehende Orb-Multiplier-Logik...
      const boonLevel = allValues.boonELevel || 0;
      if (boonLevel === 0) return 1;
      
      const baseMultiplier = Math.pow(1.006, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
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
    unlock: 'temporal',
    unlock_level: 3,
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
    unlock: 'temporal',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    tooltip: 'Total number of ship installs across all ships.',
    normalControl: 100,
    fastControl: 1000,
    minRequirement: {
      boost: 'boonHLevel', 
      level: 1          
    },
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
    unlock: 'temporal',
    unlock_level: 3,
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    minRequirement: {
      boost: 'boonHLevel', 
      level: 1          
    },
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
    unlock: 'exodus',
    unlock_level: 4,
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
    unlock: 'exodus',
    unlock_level: 4,
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
    unlock: 'innovation',
    unlock_level: 2,
    type: 'number',
    orbcalc: true,
    permanent: false,
    tooltip: 'Enter your Research Points...',
    normalControl: 100,
    fastControl: 1000,
    multiplier: (value, allValues) => {
      // Store-Integration: Innovation Gem Level direkt aus Store laden
      const gemData = getGemDataFromStore();
      const innovationGemLevel = gemData.levels.innovation || 0;
      
      if (innovationGemLevel < 2) {
        return 1; // Kein Multiplikator wenn Innovation Gem unter Level 2
      }
      
      let overallMultiplier = 1;
      
      // Rest der Research-Logik bleibt gleich...
      for (const research in researchData) {
        let researchMultiplier = 1;
        
        for (const levelData of researchData[research]) {
          if (value >= levelData.price) {
            researchMultiplier *= levelData.multiplier;
          } else {
            break;
          }
        }
        
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
    unlock: 'innovation',
    unlock_level: 2,
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: (value, allValues) => {
      // Bestehende Research #89 Logik
      const multipliers = [1.1, 1.1, 1.14, 1.14, 1.18, 1.18];
      let result = 1;
      
      for (let i = 0; i < value && i < multipliers.length; i++) {
        result *= multipliers[i];
      }
      
      return result;
    },
    max: 6
  },

  // Trinkets
  {
    key: 'trinket_oo_tier',
    label: 'The Ouro Recursive Index Tier',
    category: 'trinkets',
    unlock: 'creation',
    unlock_level: 4,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1,
  },  
  {
    key: 'trinket_oo_level',
    label: 'The Ouro Recursive Index Level',
    category: 'trinkets',
    unlock: 'creation',
    unlock_level: 4,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value, allValues) => {
      const tierLevel = allValues.trinket_oo_tier || 0;
      const baseFactor = 0.011;
      const tierBonus = tierLevel * 0.001;
      const totalFactor = baseFactor + tierBonus;
      
      return 1 + totalFactor * value;
    },
    max: 80
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

  // Void Badges
  {
    key: 'vb1',
    label: 'Void Badge #1',
    category: 'badge',
    unlock: 'exodus',
    unlock_level: 3,
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
    unlock: 'exodus',
    unlock_level: 3,
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
    unlock: 'exodus',
    unlock_level: 3,
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
    unlock: 'exodus',
    unlock_level: 3,
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
    unlock: 'exodus',
    unlock_level: 3,
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