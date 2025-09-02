import { useTRPlannerStore } from '@/store/orbStore';
import { getGemDataFromLocalStorage, getDefaultGemData } from '@/utils/gemDataUtils.js';
import { useGemPlannerStore } from '@/store/gemPlannerStore';

// Context-aware gem data loading for plan calculations
let currentPlanContext = null;

/**
 * Mapping functions for gemPlannerStore <-> TR Planner localStorage format conversion
 */

// Convert from gemPlannerStore format to TR Planner localStorage format
export function convertFromGemPlannerStore(gemStates) {
  if (!gemStates || typeof gemStates !== 'object') {
    return getDefaultGemData();
  }

  const trPlannerData = {
    levels: {},
    upgrades: {},
    activeNodes: {}
  };

  // Map gem levels, nodes, and upgrades
  for (const [gemKey, gemState] of Object.entries(gemStates)) {
    if (!gemState) continue;

    // Map gem level
    if (typeof gemState.level === 'number') {
      trPlannerData.levels[gemKey] = gemState.level;
    }

    // Map gem nodes (from boolean array to array of active node indices)
    if (Array.isArray(gemState.nodes)) {
      const activeNodeIndices = [];
      gemState.nodes.forEach((isActive, index) => {
        if (isActive) {
          activeNodeIndices.push(index);
        }
      });
      if (activeNodeIndices.length > 0) {
        trPlannerData.activeNodes[gemKey] = activeNodeIndices;
      }
    }

    // Map upgrades (from gemPlannerStore object format {upgradeId: level} to TR Planner object format {upgradeId: boolean})
    if (gemState.upgrades && typeof gemState.upgrades === 'object') {
      trPlannerData.upgrades[gemKey] = {};
      Object.entries(gemState.upgrades).forEach(([upgradeKey, level]) => {
        // Convert level > 0 to boolean true for TR Planner
        trPlannerData.upgrades[gemKey][upgradeKey] = level > 0;
      });
    }
  }

  return trPlannerData;
}

/**
 * Syncs gemPlannerStore data to TR Planner localStorage
 * This ensures that all TR Planner components can access gem data without timing issues
 */
export function ensureGemDataSync() {
  try {
    const gemPlannerStore = useGemPlannerStore();
    
    // Check if gemPlannerStore has data
    if (gemPlannerStore && gemPlannerStore.gemStates && Object.keys(gemPlannerStore.gemStates).length > 0) {
      console.log('🔄 Syncing gemPlannerStore data to TR Planner localStorage');
      
      // Convert gemPlannerStore format to TR Planner format
      const trPlannerGemData = convertFromGemPlannerStore(gemPlannerStore.gemStates);
      
      // Load current TR Planner userStats
      let userStats = {};
      try {
        const stored = localStorage.getItem('trplanner_userstats');
        if (stored) {
          userStats = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Could not load existing userStats:', e);
      }
      
      // Update gemData in userStats
      userStats.gemData = trPlannerGemData;
      
      // Save back to localStorage
      localStorage.setItem('trplanner_userstats', JSON.stringify(userStats));
      
      // Also save to individual gem data storage for backwards compatibility
      localStorage.setItem('gemData', JSON.stringify(trPlannerGemData));
      
      console.log('✅ Gem data synced successfully:', trPlannerGemData);
      
      // Dispatch event for other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gemDataChanged'));
      }
      
      return trPlannerGemData;
    } else {
      console.log('⚠️ gemPlannerStore ist leer oder nicht verfügbar, verwende bestehende localStorage-Daten');
      return getGemDataFromLocalStorage();
    }
  } catch (error) {
    console.warn('Error syncing gem data:', error);
    return getGemDataFromLocalStorage();
  }
}

/**
 * Sets the current plan context for gem-dependent calculations
 * @param {Object|null} context - Plan context containing gem data, or null for local context
 */
export function setPlanContext(context) {
  currentPlanContext = context;
}

/**
 * Gets the current plan context
 * @returns {Object|null} Current plan context or null
 */
export function getCurrentPlanContext() {
  return currentPlanContext;
}

/**
 * Gets gem data based on current plan context
 * For imported plans: uses plan's gem context
 * For local plans: uses user's local gem data
 * @param {string|null} planId - Plan ID to get context for (if any)
 * @returns {Object} Gem data object
 */
export function getContextualGemData(planId = null) {
  try {
    // If we have a plan context set globally, use it
    if (currentPlanContext?.gemData) {
      return currentPlanContext.gemData;
    }
    
    // If we have a planId, try to get its context from the store
    if (planId) {
      try {
        const store = useTRPlannerStore();
        const planGemContext = store.getPlanGemContext(planId);
        if (planGemContext) {
          return planGemContext;
        }
      } catch (error) {
        // Store might not be available in all contexts, continue with local data
        console.warn('Could not access store for plan context:', error);
      }
    }
    
    // Otherwise use local gem data
    const gemData = getGemDataFromLocalStorage();
    
    if (gemData && gemData.levels) {
      return gemData;
    }
    
    // DEFAULT: Fallback values
    return getDefaultGemData();
    
  } catch (error) {
    console.warn('Could not load contextual gem data:', error);
    return getDefaultGemData();
  }
}

// Legacy function for backward compatibility
export function getGemDataFromStore() {
  return getContextualGemData();
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

// Alle Boosts mit Kategoriezuordnung und IDs
export const allBoosts = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    key: 'ms0',
    label: 'Milestone #0',
    category: 'milestone',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: 'For Campaign Fragments Multiplier Attraction Gem Level #3 required.',
    multiplier: (value) => Math.pow(1.1, value),
    fragmulti: (value, allValues) => {
      // Context-aware gem data loading - check plan context first
      let gemData;
      if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
        gemData = window.__PLAN_CONTEXT__.gemData;
      } else {
        gemData = getContextualGemData();
      }
      const attractionLevel = gemData.levels.attraction || 0;
      
      // Check if Attraction Level 3 is available
      if (attractionLevel >= 3) {
        return Math.pow(1.011, value);
      }
      
      return 1;
    },
  },

  // Relics
  {
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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
    id: 13,
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
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
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
    id: 21,
    key: 'research',
    label: 'Current Research Points',
    category: 'research',
    unlock: 'innovation',
    unlock_level: 2,
    type: 'number',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    multiplier: (value, allValues) => {
      // Context-aware gem data loading - check plan context first
      let gemData;
      if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
        gemData = window.__PLAN_CONTEXT__.gemData;
      } else {
        gemData = getContextualGemData();
      }
      const innovationGemLevel = gemData.levels.innovation || 0;
      
      if (innovationGemLevel < 2) {
        return 1; // No multiplier if Innovation Gem below Level 2
      }
      
      let overallMultiplier = 1;
      
      // Define which researches are available at each Innovation level
      const availableResearches = {};
      if (innovationGemLevel >= 2) {
        // Innovation Level 2: Original researches
        availableResearches['85'] = researchData['85'];
        availableResearches['87'] = researchData['87'];
        availableResearches['88'] = researchData['88'];
        availableResearches['90'] = researchData['90'];
      }
      if (innovationGemLevel >= 3) {
        // Innovation Level 3: New researches
        availableResearches['98'] = researchData['98'];
        availableResearches['99'] = researchData['99'];
        availableResearches['103'] = researchData['103'];
      }
      
      // Calculate multiplier only for available researches
      for (const research in availableResearches) {
        let researchMultiplier = 1;
        
        for (const levelData of availableResearches[research]) {
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
    // Dynamic max based on Innovation Gem Level
    getMax: () => {
      let gemData;
      if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
        gemData = window.__PLAN_CONTEXT__.gemData;
      } else {
        gemData = getContextualGemData();
      }
      const innovationGemLevel = gemData.levels.innovation || 0;
      
      if (innovationGemLevel >= 3) {
        return 8040; // Innovation Level 3: New research max
      } else if (innovationGemLevel >= 2) {
        return 4465; // Innovation Level 2: Original research max
      }
      
      return 0; // Below Level 2: No research available
    }
  },

  {
    id: 22,
    key: 'research_alltime',
    label: 'All-Time Highest Research Points',
    category: 'research',
    unlock: 'innovation',
    unlock_level: 2,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    multiplier: (value, allValues) => {
      // Context-aware gem data loading - check plan context first
      let gemData;
      if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
        gemData = window.__PLAN_CONTEXT__.gemData;
      } else {
        gemData = getContextualGemData();
      }
      const innovationGemLevel = gemData.levels.innovation || 0;
      
      if (innovationGemLevel < 2) {
        return 1; // No multiplier if Innovation Gem below Level 2
      }
      
      let overallMultiplier = 1;
      
      // Define which researches are available at each Innovation level
      const availableResearches = {};
      if (innovationGemLevel >= 2) {
        // Innovation Level 2: No orb multipliers from permanent researches
      }
      if (innovationGemLevel >= 3) {
        // Innovation Level 3: Only orb multiplier researches
        availableResearches['100'] = researchData_permanent['100'];
        availableResearches['temporal_ultima'] = researchData_permanent['temporal_ultima'];
        // Note: Research 109 and 110 have special functions, not included in multiplier
      }
      
      // Calculate multiplier for available researches
      for (const research in availableResearches) {
        const researchLevels = availableResearches[research];
        
        if (research === '100') {
          // Research 100: Orb multiplier with specific levels only
          for (const levelData of researchLevels) {
            if (value >= levelData.price && levelData.multiplier) {
              overallMultiplier *= levelData.multiplier;
            }
          }
        } else if (research === 'temporal_ultima') {
          // Temporal Ultima Research - standard price-based progression
          for (const levelData of researchLevels) {
            if (value >= levelData.price && levelData.multiplier) {
              overallMultiplier *= levelData.multiplier;
            } else {
              break;
            }
          }
        } else {
          // Other researches: Standard price-based progression
          for (const levelData of researchLevels) {
            if (value >= levelData.price) {
              if (levelData.multiplier) {
                overallMultiplier *= levelData.multiplier;
              }
            } else {
              break;
            }
          }
        }
      }
      
      return overallMultiplier;
    },
    fragmulti: (value, allValues) => {
      // Context-aware gem data loading - check plan context first
      let gemData;
      if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
        gemData = window.__PLAN_CONTEXT__.gemData;
      } else {
        gemData = getContextualGemData();
      }
      const innovationGemLevel = gemData.levels.innovation || 0;
      
      if (innovationGemLevel < 2) {
        return 1; // No multiplier if Innovation Gem below Level 2
      }
      
      let overallMultiplier = 1;
      
      // Define which researches are available at each Innovation level
      const availableResearches = {};
      if (innovationGemLevel >= 2) {
        // Innovation Level 2: Research 89 only
        availableResearches['89'] = researchData_permanent['89'];
      }
      if (innovationGemLevel >= 3) {
        // Innovation Level 3: Fragment-based researches
        availableResearches['97'] = researchData_permanent['97'];
      }
      
      // Calculate fragment multiplier for available researches
      for (const research in availableResearches) {
        const researchLevels = availableResearches[research];
        
        if (research === '89') {
          // Research 89: Fragment multiplier logic with price requirements
          for (const levelData of researchLevels) {
            if (value >= levelData.price && levelData.fragMultiplier) {
              overallMultiplier *= levelData.fragMultiplier;
            } else {
              break;
            }
          }
        } else if (research === '97') {
          // Research 97: Fragment multiplier with price requirements
          for (const levelData of researchLevels) {
            if (value >= levelData.price && levelData.fragMultiplier) {
              overallMultiplier *= levelData.fragMultiplier;
            } else {
              break;
            }
          }
        }
      }
      
      return overallMultiplier;
    },
    // Dynamic max based on Innovation Gem Level
    getMax: () => {
      let gemData;
      if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
        gemData = window.__PLAN_CONTEXT__.gemData;
      } else {
        gemData = getContextualGemData();
      }
      const innovationGemLevel = gemData.levels.innovation || 0;
      
      if (innovationGemLevel >= 3) {
        return 14500; // Innovation Level 3: Highest permanent research requirement
      } else if (innovationGemLevel >= 2) {
        return 4155; // Innovation Level 2: Research 89 max price
      }
      
      return 0; // Below Level 2: No research available
    }
  },

  // Trinkets
  {
    id: 23,
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
    id: 24,
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
      const baseFactor = 0.01;
      const tierBonus = tierLevel * 0.001;
      const totalFactor = baseFactor + tierBonus;
      
      return 1 + totalFactor * value;
    },
    max: 80
  }, 

  // Premium
  {
    id: 25,
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
    id: 26,
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
    id: 34,
    key: 'iap_frag',
    label: 'IAP Frag. Pack',
    category: 'premium',
    type: 'boolean',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    fragmulti: 1.1,
  },
  {
    id: 27,
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
    id: 28,
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
    id: 29,
    key: 'vb1',
    label: 'Void Badge #1',
    category: 'badge',
    unlock: 'attraction',
    unlock_level: 1,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    id: 30,
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
    id: 31,
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
    id: 32,
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
    id: 33,
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

// Utility functions for boost ID management
/**
 * Gets the next available boost ID
 * @returns {number} Next available ID
 */
export function getNextBoostId() {
  const usedIds = allBoosts.map(boost => boost.id);
  const maxId = Math.max(...usedIds);
  return maxId + 1;
}

/**
 * Validates that all boost IDs are unique
 * @returns {Object} Validation result with isValid boolean and any duplicate IDs
 */
export function validateBoostIds() {
  const idCounts = {};
  const duplicates = [];
  
  allBoosts.forEach(boost => {
    if (!boost.id) {
      console.error(`Boost ${boost.key} is missing an ID`);
      return;
    }
    
    idCounts[boost.id] = (idCounts[boost.id] || 0) + 1;
    if (idCounts[boost.id] > 1 && !duplicates.includes(boost.id)) {
      duplicates.push(boost.id);
    }
  });
  
  const isValid = duplicates.length === 0;
  
  if (!isValid) {
    console.error('Duplicate boost IDs found:', duplicates);
    duplicates.forEach(id => {
      const boostsWithSameId = allBoosts.filter(b => b.id === id);
      console.error(`ID ${id} is used by:`, boostsWithSameId.map(b => b.key));
    });
  }
  
  return {
    isValid,
    duplicates,
    nextAvailableId: Math.max(...Object.keys(idCounts).map(Number)) + 1
  };
}

// Run validation in development
if (process.env.NODE_ENV === 'development') {
  const validation = validateBoostIds();
  if (!validation.isValid) {
    console.warn('⚠️ Boost ID validation failed! Check console for details.');
  } else {
    console.log(`✅ Boost IDs validated. Next available ID: ${validation.nextAvailableId}`);
  }
}

// Mapping functions for ID-based export/import
export const boostKeyToId = new Map();
export const boostIdToKey = new Map();

// Initialize mappings and validate
allBoosts.forEach(boost => {
  if (!boost.id) {
    console.error(`Boost ${boost.key} is missing an ID!`);
    return;
  }
  
  if (boostKeyToId.has(boost.key)) {
    console.error(`Duplicate key found: ${boost.key}`);
  }
  
  if (boostIdToKey.has(boost.id)) {
    const existingKey = boostIdToKey.get(boost.id);
    console.error(`Duplicate ID ${boost.id} found! Used by both ${existingKey} and ${boost.key}`);
  }
  
  boostKeyToId.set(boost.key, boost.id);
  boostIdToKey.set(boost.id, boost.key);
});

/**
 * Gets the maximum value for a boost, handling dynamic max functions
 * @param {Object} boost - The boost object
 * @param {Object|null} gemData - Optional gem data context
 * @returns {number|undefined} Maximum value or undefined if no limit
 */
export function getBoostMaxValue(boost, gemData = null) {
  // If boost has a getMax function, use it
  if (typeof boost.getMax === 'function') {
    return boost.getMax(gemData);
  }
  
  // Otherwise use static max property
  return boost.max;
}

/**
 * Gets a boost by its key
 * @param {string} key - Boost key
 * @returns {Object|undefined} Boost object or undefined
 */
export function getBoostByKey(key) {
  return allBoosts.find(boost => boost.key === key);
}

/**
 * Utility function to create a new boost with automatic ID assignment
 * Usage example:
 * const newBoost = createBoost({
 *   key: 'newBoost',
 *   label: 'New Boost',
 *   category: 'milestone',
 *   type: 'number',
 *   orbcalc: true,
 *   multiplier: (value) => Math.pow(1.1, value)
 * });
 * 
 * @param {Object} boostConfig - Boost configuration object
 * @returns {Object} Complete boost object with auto-assigned ID
 */
export function createBoost(boostConfig) {
  const id = getNextBoostId();
  
  return {
    id,
    tooltip: '0', // Default tooltip
    permanent: false, // Default permanent
    ...boostConfig
  };
}

/**
 * Convert boost data from key-based to ID-based format for export
 * @param {Object|Array} boostData - Object with boost keys as properties OR Array with boost objects
 * @returns {Object} - Object with boost IDs as properties
 */
export function convertBoostDataToIds(boostData) {
  const idBasedData = {};
  
  // Handle array format (legacy)
  if (Array.isArray(boostData)) {
    for (const boost of boostData) {
      if (!boost || !boost.key) continue;
      
      const id = boostKeyToId.get(boost.key);
      if (id !== undefined) {
        let actualValue;
        if (boost.type === 'number') {
          actualValue = boost.targetLevel !== undefined ? boost.targetLevel : (boost.value !== undefined ? boost.value : 0);
        } else if (boost.type === 'boolean') {
          actualValue = boost.targetState !== undefined ? boost.targetState : (boost.value !== undefined ? boost.value : false);
        } else {
          actualValue = boost.value !== undefined ? boost.value : 0;
        }
        
        // Include ALL values, even 0 and false
        if (actualValue !== undefined && actualValue !== null && actualValue !== '') {
          idBasedData[id] = actualValue;
        }
      }
    }
  } else {
    // Handle object format (new)
    for (const [key, value] of Object.entries(boostData)) {
      const id = boostKeyToId.get(key);
      if (id !== undefined) {
        // Handle both object format and direct value format
        let actualValue;
        if (typeof value === 'object' && value !== null) {
          // Object format: {type: 'number', targetLevel: 5} or {type: 'boolean', targetState: true}
          if (value.type === 'number') {
            actualValue = value.targetLevel !== undefined ? value.targetLevel : (value.value !== undefined ? value.value : 0);
          } else if (value.type === 'boolean') {
            actualValue = value.targetState !== undefined ? value.targetState : (value.value !== undefined ? value.value : false);
          } else {
            actualValue = value.value !== undefined ? value.value : 0;
          }
        } else {
          // Direct value format
          actualValue = value;
        }
        
        // Include ALL values, even 0 and false - they might be intentional settings
        if (actualValue !== undefined && actualValue !== null && actualValue !== '') {
          idBasedData[id] = actualValue;
        }
      }
    }
  }
  
  return idBasedData;
}

/**
 * Convert boost data from ID-based to key-based format for import
 * @param {Object} idBasedData - Object with boost IDs as properties
 * @returns {Object} - Object with boost keys as properties
 */
export function convertBoostDataFromIds(idBasedData) {
  const keyBasedData = {};
  
  for (const [idStr, value] of Object.entries(idBasedData)) {
    const id = parseInt(idStr);
    const key = boostIdToKey.get(id);
    if (key && value !== undefined) {
      keyBasedData[key] = value;
    }
  }
  
  return keyBasedData;
}

// Research data for multiplier calculations (temporary, resets each TR)
export const researchData = {
  // Innovation Level 2 Researches
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
  ],
  // Innovation Level 3 Researches
  '98': [
    { level: 1, price: 5300, multiplier: 1.02 },
    { level: 2, price: 5530, multiplier: 1.03 },
    { level: 3, price: 5760, multiplier: 1.04 },
    { level: 4, price: 5990, multiplier: 1.05 },
    { level: 5, price: 6220, multiplier: 1.06 },
    { level: 6, price: 6450, multiplier: 1.07 }
  ],
  '99': [
    { level: 1, price: 5350, multiplier: 1.02 },
    { level: 2, price: 5580, multiplier: 1.03 },
    { level: 3, price: 5810, multiplier: 1.04 },
    { level: 4, price: 6040, multiplier: 1.05 },
    { level: 5, price: 6270, multiplier: 1.06 },
    { level: 6, price: 6500, multiplier: 1.07 }
  ],
  '103': [
    { level: 1, price: 6240, multiplier: 1.03 },
    { level: 2, price: 6600, multiplier: 1.05 },
    { level: 3, price: 6960, multiplier: 1.08 },
    { level: 4, price: 7320, multiplier: 1.13 },
    { level: 5, price: 7680, multiplier: 1.21 },
    { level: 6, price: 8040, multiplier: 1.34 }
  ]
};

// Research data for permanent multiplier calculations (persists across TRs)
export const researchData_permanent = {
  // Innovation Level 2 Research (Fragment multiplier)
  '89': [
    { level: 1, price: 3380, fragMultiplier: 1.1 },
    { level: 2, price: 3535, fragMultiplier: 1.1 },
    { level: 3, price: 3690, fragMultiplier: 1.14 },
    { level: 4, price: 3845, fragMultiplier: 1.14 },
    { level: 5, price: 4000, fragMultiplier: 1.18 },
    { level: 6, price: 4155, fragMultiplier: 1.18 }
  ],
  // Innovation Level 3 Researches
  '97': [
    { level: 1, price: 5275, fragMultiplier: 1.03 },
    { level: 2, price: 5775, fragMultiplier: 1.04 },
    { level: 3, price: 6275, fragMultiplier: 1.05 },
    { level: 4, price: 6775, fragMultiplier: 1.06 },
    { level: 5, price: 7275, fragMultiplier: 1.07 },
    { level: 6, price: 7775, fragMultiplier: 1.08 }
  ],
  '100': [
    { level: 3, price: 6440, multiplier: 1.2 },
    { level: 6, price: 8000, multiplier: 1.4 }
  ],
  'temporal_ultima': [
    { level: 1, price: 4935, multiplier: 1.1 }
    // Additional levels not yet discovered
  ],
  '109': [
    { level: 1, price: 9000,  catchupBonus: 0.02 },
    { level: 2, price: 10000, catchupBonus: 0.03 },
    { level: 3, price: 11000, catchupBonus: 0.05 },
    { level: 4, price: 12000, catchupBonus: 0.08 },
    { level: 5, price: 13000, catchupBonus: 0.13 },
    { level: 6, price: 14000, catchupBonus: 0.21 }
  ],
  '110': [
    { level: 1, price: 9500,  catchupHours: 8 },
    { level: 2, price: 10500, catchupHours: 16 },
    { level: 3, price: 11500, catchupHours: 24 },
    { level: 4, price: 12500, catchupHours: 32 },
    { level: 5, price: 13500, catchupHours: 40 },
    { level: 6, price: 14500, catchupHours: 48 }
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