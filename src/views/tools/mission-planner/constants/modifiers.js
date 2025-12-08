/**
 * Mission Modifiers for Mission & Relic Planner
 * 
 * These modifiers affect mission duration and efficiency
 * Each modifier has a multiplier that affects mission calculations
 */

export const MODIFIER_CATEGORIES = {
  GAME_PROGRESS: 'gameProgress',
  RELICS: 'relics',
  BADGES: 'badges',
  MODS: 'mods',
  INSCRYPTIONS: 'inscryptions',
  GEMS: 'gems',
  GADGETS: 'gadgets',
  OTHER: 'other'
};

export const MODIFIERS = {
  // Game Progress
  gameProgress: [
    {
      id: 'cells',
      name: 'Cells',
      type: 'number',
      category: MODIFIER_CATEGORIES.GAME_PROGRESS,
      defaultValue: 0,
      min: 0,
      max: 1000000,
      multiplier: 1.0,
      control: 10,
      fastControls: 100,
      icon: 'src/assets/general/cells.png'
    },
    {
      id: 'mp',
      name: 'MP',
      type: 'number',
      category: MODIFIER_CATEGORIES.GAME_PROGRESS,
      defaultValue: 0,
      min: 0,
      max: 1000000,
      multiplier: 1.0,
      control: 10,
      fastControls: 100,
      icon: 'src/assets/general/mp.png'
    },
    {
      id: 'rp',
      name: 'RP',
      type: 'number',
      category: MODIFIER_CATEGORIES.GAME_PROGRESS,
      defaultValue: 0,
      min: 0,
      max: 1000000,
      multiplier: 1.0,
      control: 10,
      fastControls: 100,
      icon: 'src/assets/general/rp.png'
    },
    {
      id: 'all_time_highest_rp',
      name: 'All Time Highest RP',
      type: 'number',
      category: MODIFIER_CATEGORIES.GAME_PROGRESS,
      defaultValue: 0,
      min: 0,
      max: 1000000,
      multiplier: 1.0,
      control: 10,
      fastControls: 100,
      icon: 'src/assets/general/rp.png'
    },
    {
      id: 'plus_ultima',
      name: 'Ultima',
      type: 'number',
      category: MODIFIER_CATEGORIES.GAME_PROGRESS,
      defaultValue: 0,
      min: 0,
      max: 100,
      multiplier: 1.0,
      icon: 'IconPlus'
    }
  ],

  // Space Academy Relics
  relics: [
    {
      id: 'relic_3',
      name: 'Relic 3',
      type: 'number',
      category: MODIFIER_CATEGORIES.RELICS,
      defaultValue: 0,
      min: 0,
      max: 100,
      type: 'speed',
      multiplier: 1.0, 
    },
    {
      id: 'relic_5',
      name: 'Relic 5',
      type: 'number',
      category: MODIFIER_CATEGORIES.RELICS,
      defaultValue: 0,
      min: 0,
      max: 100,
      type: 'farm_frags',
      multiplier: 1.0,
    },
    {
      id: 'relic_6',
      name: 'Relic 6',
      type: 'number',
      category: MODIFIER_CATEGORIES.RELICS,
      defaultValue: 0,
      min: 0,
      max: 100,
      type: 'camp_frags',
      multiplier: 1.0,
    },
    {
      id: 'relic_11',
      name: 'Relic 11',
      type: 'number',
      category: MODIFIER_CATEGORIES.RELICS,
      defaultValue: 0,
      min: 0,
      max: 100,
      type: 'max_crew',
      multiplier: 1.0,
    },
    {
      id: 't2r8',
      name: 'T2 Relic 8',
      type: 'number',
      category: MODIFIER_CATEGORIES.RELICS,
      defaultValue: 0,
      min: 0,
      max: 21,
      type: 'all_frags',
      multiplier: 1.0,
    }
  ],

  // Badges
  badges: [
    {
      id: 'engineering_badge',
      name: 'Engineering Badge',
      type: 'boolean',
      category: MODIFIER_CATEGORIES.BADGES,
      defaultValue: false,
      type: 'speed',
      multiplier: 1.0,
    },
    {
      id: 'fragmentation_badge',
      name: 'Fragmentation Badge',
      type: 'boolean',
      category: MODIFIER_CATEGORIES.BADGES,
      defaultValue: false,
      type: 'farm_frags',
      multiplier: 1.0,
    }
  ],

  // Mod Boons - Levels are calculated from MP, only modifiers need to be set
  mods: [
    {
      id: 'completed_campaigns',
      name: 'Completed Campaigns',
      type: 'number',
      category: MODIFIER_CATEGORIES.MODS,
      defaultValue: 0,
      min: 0,
      max: 10000,
      description: 'Number of completed campaigns (for Boon: Eternity)'
    },
    {
      id: 'ship_installs',
      name: 'Ouroboros Ship Installs',
      type: 'number',
      category: MODIFIER_CATEGORIES.MODS,
      defaultValue: 0,
      min: 0,
      max: 10000,
      description: 'Number of Ouroboros Ship Installs (for Boon: Hegemony)'
    }
  ],

  // Inscryptions
  inscryptions: [
    {
      id: 'inscryption_58',
      name: 'i58: Headstart Max Level',
      type: 'number',
      category: MODIFIER_CATEGORIES.INSCRYPTIONS,
      defaultValue: 0,
      min: 0,
      max: 10,
      description: '+5 max level for headstart loopmods per level'
    },
    {
      id: 'inscryption_102',
      name: 'i102: Farm Fragments',
      type: 'number',
      category: MODIFIER_CATEGORIES.INSCRYPTIONS,
      defaultValue: 0,
      min: 0,
      max: 10,
      description: '+0.003 farm fragments per level'
    },
    {
      id: 'inscryption_106',
      name: 'I106: T1 Power',
      type: 'number',
      category: MODIFIER_CATEGORIES.INSCRYPTIONS,
      defaultValue: 0,
      min: 0,
      max: 10,
      description: '+0.8 power for T1 personnel per level'
    },
    {
      id: 'inscryption_107',
      name: 'i107: T2 Power',
      type: 'number',
      category: MODIFIER_CATEGORIES.INSCRYPTIONS,
      defaultValue: 0,
      min: 0,
      max: 10,
      description: '+1.2 power for T2 personnel per level'
    },
    {
      id: 'inscryption_108',
      name: 'i108: T3 Power',
      type: 'number',
      category: MODIFIER_CATEGORIES.INSCRYPTIONS,
      defaultValue: 0,
      min: 0,
      max: 10,
      description: '+1.6 power for T3 personnel per level'
    },
    {
      id: 'inscryption_109',
      name: 'i109: T4 Power',
      type: 'number',
      category: MODIFIER_CATEGORIES.INSCRYPTIONS,
      defaultValue: 0,
      min: 0,
      max: 10,
      description: '+2.0 power for T4 personnel per level'
    },
    {
      id: 'inscryption_110',
      name: 'i110: All Fragments',
      type: 'number',
      category: MODIFIER_CATEGORIES.INSCRYPTIONS,
      defaultValue: 0,
      min: 0,
      max: 10,
      description: 'x1.04 all fragments (farm + campaign) per level'
    }
  ],

  // Gems (read-only, values from gemPlannerStore)
  gems: [
    // Attraction Gem
    {
      id: 'attraction_node_1',
      name: 'Attraction GN#1',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: 'Campaign frags x1.5'
    },
    {
      id: 'attraction_node_4',
      name: 'Attraction GN#4',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: 'All frags x1.25'
    },
    // Creation Gem
    {
      id: 'creation_node_5',
      name: 'Creation GN#5',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: 'All fragments x1.001 per Mech owned'
    },
    {
      id: 'creation_node_5_mechs',
      name: 'Mechs Owned',
      type: 'number',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: 0,
      min: 0,
      max: 100000,
      description: 'Number of Mechs owned (for Creation GN#5)'
    },
    // Exodus Gem
    {
      id: 'exodus_node_2',
      name: 'Exodus GN#2',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: 'All fragments +1% per 10000 Loopmods owned'
    },
    {
      id: 'exodus_node_2_loopmods',
      name: 'Loopmods Owned',
      type: 'number',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: 0,
      min: 0,
      max: 10000000,
      description: 'Number of Loopmods owned (for Exodus GN#2)'
    },
    {
      id: 'exodus_node_3',
      name: 'Exodus GN#3',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: 'Max level for Tier 1 relics +1 per level (R5: +2, R14: unchanged)'
    },
    {
      id: 'exodus_node_3_level',
      name: 'Exodus GN#3 Level',
      type: 'number',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: 0,
      min: 0,
      max: 5,
      description: 'Level of Exodus GN#3 (increases max relic levels)'
    },
    // Power Gem
    {
      id: 'power_node_1',
      name: 'Power GN#1',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: '+500 T1 personnel, +1 power for T1, max level for Relic 5 & 6: +3'
    },
    {
      id: 'power_node_2',
      name: 'Power GN#2',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: '+300 T2 personnel, +2 power for T2'
    },
    {
      id: 'power_node_3',
      name: 'Power GN#3',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: 'Farm frags +0.012'
    },
    {
      id: 'power_node_4',
      name: 'Power GN#4',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: '+150 T3 personnel, +3 power for T3, farm frags x2'
    },
    {
      id: 'power_node_5',
      name: 'Power GN#5',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.GEMS,
      defaultValue: false,
      description: '+100 T4 personnel, +4 power for T4'
    }
  ],

  // Gadgets
  gadgets: [
    {
      id: 'local_fragment_magnet',
      name: 'Local Fragment Magnet',
      type: 'number',
      category: MODIFIER_CATEGORIES.GADGETS,
      defaultValue: 0,
      min: 0,
      max: 1000,
      description: 'Adds flat farm fragments (level * 0.0001 + milestones * 0.0005)'
    },
    {
      id: 'galactic_fragment_magnet',
      name: 'Galactic Fragment Magnet',
      type: 'number',
      category: MODIFIER_CATEGORIES.GADGETS,
      defaultValue: 0,
      min: 0,
      max: 1000,
      description: 'Multiplies campaign fragments (1.01^level * 1.08^milestones)'
    }
  ],

  // Other
  other: [
    {
      id: 'trait_sphere_07',
      name: 'Trait Sphere 07',
      type: 'boolean',
      category: MODIFIER_CATEGORIES.OTHER,
      defaultValue: false,
      description: 'x2 farm fragments when active'
    },
    {
      id: 'fragmentation_pack',
      name: 'Fragmentation Pack',
      type: 'boolean',
      category: MODIFIER_CATEGORIES.OTHER,
      defaultValue: false,
      description: 'x1.25 all fragments (farm + campaign) when active'
    },
    {
      id: 'eternal_milestone',
      name: '#0 The Eternal Milestone',
      type: 'readonly',
      category: MODIFIER_CATEGORIES.OTHER,
      defaultValue: 0,
      description: 'x1.011 campaign fragments per level (from Milestones)'
    }
  ]
};

// Flatten all modifiers into a single array
export const ALL_MODIFIERS = [
  ...MODIFIERS.gameProgress,
  ...MODIFIERS.relics,
  ...MODIFIERS.badges,
  ...MODIFIERS.mods,
  ...MODIFIERS.inscryptions,
  ...MODIFIERS.gems,
  ...MODIFIERS.gadgets,
  ...MODIFIERS.other
];

/**
 * Get modifier by ID
 * @param {string} id - Modifier ID
 * @returns {object|null} Modifier data
 */
export function getModifierById(id) {
  return ALL_MODIFIERS.find(mod => mod.id === id) || null;
}

/**
 * Get modifiers by category
 * @param {string} category - Category name
 * @returns {array} Array of modifiers in category
 */
export function getModifiersByCategory(category) {
  return MODIFIERS[category] || [];
}

/**
 * Get default modifier values
 * @returns {object} Default values for all modifiers
 */
export function getDefaultModifierValues() {
  const defaults = {};
  ALL_MODIFIERS.forEach(mod => {
    defaults[mod.id] = mod.defaultValue;
  });
  return defaults;
}

/**
 * Calculate total multiplier from active modifiers
 * @param {object} modifierValues - Current modifier values
 * @returns {number} Total multiplier
 */
export function calculateTotalMultiplier(modifierValues) {
  let totalMultiplier = 1.0;
  
  ALL_MODIFIERS.forEach(mod => {
    const value = modifierValues[mod.id];
    
    if (mod.type === 'boolean' && value) {
      totalMultiplier *= mod.multiplier;
    } else if (mod.type === 'number' && value > 0) {
      totalMultiplier *= Math.pow(mod.multiplier, value);
    } else if (mod.type === 'boon' && value) {
      // For boons, use both level and modifier
      if (value.level > 0 || value.modifier > 0) {
        totalMultiplier *= mod.multiplier;
      }
    }
  });
  
  return totalMultiplier;
}

export default {
  MODIFIER_CATEGORIES,
  MODIFIERS,
  ALL_MODIFIERS,
  getModifierById,
  getModifiersByCategory,
  getDefaultModifierValues,
  calculateTotalMultiplier
};
