/**
 * Relic Definitions for Mission & Relic Planner
 * 
 * Relics provide permanent bonuses that scale with level.
 * Effects are applied additively per level unless specified otherwise.
 */

export const RELICS = {
  relic_3: {
    id: 'relic_3',
    name: 'Relic 3',
    description: 'Increase mission speed',
    maxLevel: 100, 
    effectType: 'mission_speed',
    // +0.03 per level (additive), so level 10 = 1 + (10 * 0.03) = 1.3x
    effectPerLevel: 0.03,
    isAdditive: true,
  },
  relic_5: {
    id: 'relic_5',
    name: 'Relic 5',
    description: 'Increase farm fragments',
    maxLevel: 8,
    canBeUpgraded: true, // Max level can be increased by other upgrades
    effectType: 'farm_fragments_add',
    // +0.001 per level (additive to base farm frags)
    effectPerLevel: 0.001,
  },
  relic_6: {
    id: 'relic_6',
    name: 'Relic 6',
    description: 'Increase campaign fragments',
    maxLevel: 8,
    canBeUpgraded: true, // Max level can be increased by other upgrades
    effectType: 'campaign_fragments',
    // Complex effect: +2.75 additive AND *1.05 multiplier per level
    effects: {
      additive: 2.75,
      multiplier: 1.05,
    },
  },
  relic_11: {
    id: 'relic_11',
    name: 'Relic 11',
    description: 'Increase campaign max personnel',
    maxLevel: 100, 
    effectType: 'campaign_max_crew',
    // +50% per level (additive), so level 2 = 1 + (2 * 0.5) = 2x capacity
    effectPerLevel: 0.5,
    isAdditive: true,
  },
};

/**
 * Calculate mission speed bonus from Relic 3
 * @param {number} level - Relic 3 level
 * @returns {number} Mission speed multiplier (e.g., 1.3 for level 10)
 */
export function calculateRelic3MissionSpeed(level) {
  if (level <= 0) return 1.0;
  // 1 + (level * 0.03)
  return 1 + (level * RELICS.relic_3.effectPerLevel);
}

/**
 * Calculate farm fragments additive bonus from Relic 5
 * @param {number} level - Relic 5 level
 * @returns {number} Additive farm fragments bonus
 */
export function calculateRelic5FarmFrags(level) {
  if (level <= 0) return 0;
  return level * RELICS.relic_5.effectPerLevel;
}

/**
 * Calculate campaign fragments bonuses from Relic 6
 * @param {number} level - Relic 6 level
 * @returns {object} { additive: number, multiplier: number }
 */
export function calculateRelic6CampaignFrags(level) {
  if (level <= 0) return { additive: 0, multiplier: 1.0 };
  
  const additive = level * RELICS.relic_6.effects.additive;
  const multiplier = Math.pow(RELICS.relic_6.effects.multiplier, level);
  
  return { additive, multiplier };
}

/**
 * Calculate campaign max crew multiplier from Relic 11
 * @param {number} level - Relic 11 level
 * @returns {number} Max crew multiplier (e.g., 2.0 for level 2)
 */
export function calculateRelic11MaxCrew(level) {
  if (level <= 0) return 1.0;
  // 1 + (level * 0.5)
  return 1 + (level * RELICS.relic_11.effectPerLevel);
}

/**
 * Get all relic effects combined
 * @param {object} relicLevels - Object with relic IDs and their levels
 * @returns {object} Combined relic effects
 */
export function getRelicEffects(relicLevels) {
  const relic3Level = relicLevels.relic_3 || 0;
  const relic5Level = relicLevels.relic_5 || 0;
  const relic6Level = relicLevels.relic_6 || 0;
  const relic11Level = relicLevels.relic_11 || 0;
  
  const relic6Effects = calculateRelic6CampaignFrags(relic6Level);
  
  return {
    missionSpeedMultiplier: calculateRelic3MissionSpeed(relic3Level),
    farmFragsAdditive: calculateRelic5FarmFrags(relic5Level),
    campaignFragsAdditive: relic6Effects.additive,
    campaignFragsMultiplier: relic6Effects.multiplier,
    campaignMaxCrewMultiplier: calculateRelic11MaxCrew(relic11Level),
    
    // Individual levels for reference
    levels: {
      relic_3: relic3Level,
      relic_5: relic5Level,
      relic_6: relic6Level,
      relic_11: relic11Level,
    },
  };
}
