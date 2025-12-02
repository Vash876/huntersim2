/**
 * Inscryption Definitions for Mission & Relic Planner
 * 
 * Inscryptions provide various bonuses.
 * I = Inscryption (e.g., I58 = Inscryption 58)
 */

export const INSCRYPTIONS = {
  inscryption_58: {
    id: 'inscryption_58',
    name: 'I58: Headstart Max Level',
    description: 'Increases max level of headstart loopmods',
    maxLevel: 10,
    effectType: 'headstart_max_level',
    // +5 max level per inscryption level
    effectPerLevel: 5,
  },
  inscryption_102: {
    id: 'inscryption_102',
    name: 'I102: Farm Fragments',
    description: 'Increases farm fragments (additive)',
    maxLevel: 10,
    effectType: 'farm_fragments_add',
    // +0.003 per level
    effectPerLevel: 0.003,
  },
  inscryption_106: {
    id: 'inscryption_106',
    name: 'I106: T1 Power',
    description: 'Increases T1 personnel power',
    maxLevel: 10,
    effectType: 'personnel_power',
    target: 'T1',
    // +0.8 power per level
    effectPerLevel: 0.8,
  },
  inscryption_107: {
    id: 'inscryption_107',
    name: 'I107: T2 Power',
    description: 'Increases T2 personnel power',
    maxLevel: 10,
    effectType: 'personnel_power',
    target: 'T2',
    // +1.2 power per level
    effectPerLevel: 1.2,
  },
  inscryption_108: {
    id: 'inscryption_108',
    name: 'I108: T3 Power',
    description: 'Increases T3 personnel power',
    maxLevel: 10,
    effectType: 'personnel_power',
    target: 'T3',
    // +1.6 power per level
    effectPerLevel: 1.6,
  },
  inscryption_109: {
    id: 'inscryption_109',
    name: 'I109: T4 Power',
    description: 'Increases T4 personnel power',
    maxLevel: 10,
    effectType: 'personnel_power',
    target: 'T4',
    // +2.0 power per level
    effectPerLevel: 2.0,
  },
  inscryption_110: {
    id: 'inscryption_110',
    name: 'I110: All Fragments',
    description: 'Multiplies all fragment drops (farm + campaign)',
    maxLevel: 10,
    effectType: 'all_fragments',
    // x1.04 per level
    multiplierPerLevel: 1.04,
  },
};

/**
 * Calculate headstart max level bonus from I58
 * @param {number} level - I58 level
 * @returns {number} Bonus max levels for headstart loopmods
 */
export function calculateI58HeadstartBonus(level) {
  if (level <= 0) return 0;
  return level * INSCRYPTIONS.inscryption_58.effectPerLevel;
}

/**
 * Calculate farm fragments additive bonus from I102
 * @param {number} level - I102 level
 * @returns {number} Additive farm fragments bonus
 */
export function calculateI102FarmFrags(level) {
  if (level <= 0) return 0;
  return level * INSCRYPTIONS.inscryption_102.effectPerLevel;
}

/**
 * Calculate personnel power bonuses from I106-I109
 * @param {object} inscryptionLevels - Object with inscryption levels
 * @returns {object} Power bonuses per personnel type { T1, T2, T3, T4 }
 */
export function calculatePersonnelPowerBonuses(inscryptionLevels) {
  const bonuses = {
    T1: 0,
    T2: 0,
    T3: 0,
    T4: 0,
  };
  
  const i106 = inscryptionLevels.inscryption_106 || 0;
  const i107 = inscryptionLevels.inscryption_107 || 0;
  const i108 = inscryptionLevels.inscryption_108 || 0;
  const i109 = inscryptionLevels.inscryption_109 || 0;
  
  if (i106 > 0) bonuses.T1 = i106 * INSCRYPTIONS.inscryption_106.effectPerLevel;
  if (i107 > 0) bonuses.T2 = i107 * INSCRYPTIONS.inscryption_107.effectPerLevel;
  if (i108 > 0) bonuses.T3 = i108 * INSCRYPTIONS.inscryption_108.effectPerLevel;
  if (i109 > 0) bonuses.T4 = i109 * INSCRYPTIONS.inscryption_109.effectPerLevel;
  
  return bonuses;
}

/**
 * Calculate all fragments multiplier from I110
 * @param {number} level - I110 level
 * @returns {number} Multiplier for all fragments (e.g., 1.04^level)
 */
export function calculateI110AllFragsMultiplier(level) {
  if (level <= 0) return 1.0;
  return Math.pow(INSCRYPTIONS.inscryption_110.multiplierPerLevel, level);
}

/**
 * Get all inscryption effects combined
 * @param {object} inscryptionLevels - Object with inscryption IDs and their levels
 * @returns {object} Combined inscryption effects
 */
export function getInscryptionEffects(inscryptionLevels) {
  const i58Level = inscryptionLevels.inscryption_58 || 0;
  const i102Level = inscryptionLevels.inscryption_102 || 0;
  const i110Level = inscryptionLevels.inscryption_110 || 0;
  
  const personnelPowerBonuses = calculatePersonnelPowerBonuses(inscryptionLevels);
  const allFragsMultiplier = calculateI110AllFragsMultiplier(i110Level);
  
  return {
    // I58: Headstart max level bonus
    headstartMaxLevelBonus: calculateI58HeadstartBonus(i58Level),
    
    // I102: Farm fragments additive
    farmFragsAdditive: calculateI102FarmFrags(i102Level),
    
    // I106-I109: Personnel power bonuses
    personnelPowerBonuses,
    
    // I110: All fragments multiplier (applies to both farm and campaign)
    allFragsMultiplier,
    farmFragsMultiplier: allFragsMultiplier,
    campaignFragsMultiplier: allFragsMultiplier,
    
    // Individual levels for reference
    levels: {
      inscryption_58: i58Level,
      inscryption_102: i102Level,
      inscryption_106: inscryptionLevels.inscryption_106 || 0,
      inscryption_107: inscryptionLevels.inscryption_107 || 0,
      inscryption_108: inscryptionLevels.inscryption_108 || 0,
      inscryption_109: inscryptionLevels.inscryption_109 || 0,
      inscryption_110: i110Level,
    },
  };
}
