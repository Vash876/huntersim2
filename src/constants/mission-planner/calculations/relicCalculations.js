/**
 * Relic Calculations for Mission & Relic Planner
 * 
 * Combines relic effects with other bonuses for final calculations.
 */

import { getRelicEffects } from '../relics';

/**
 * Get complete relic effects breakdown
 * @param {object} relicLevels - Object with relic levels { relic_3: 10, relic_5: 5, ... }
 * @returns {object} Complete breakdown of relic effects
 */
export function getRelicEffectsBreakdown(relicLevels) {
  const effects = getRelicEffects(relicLevels);
  
  return {
    ...effects,
    missionSpeedPercent: Math.round(effects.missionSpeedMultiplier * 100),
    campaignMaxCrewPercent: Math.round(effects.campaignMaxCrewMultiplier * 100),
  };
}

/**
 * Calculate adjusted campaign max crew for a mission
 * @param {number} baseMaxCrew - Base max crew from mission data
 * @param {number} relic11Level - Relic 11 level
 * @returns {number} Adjusted max crew
 */
export function calculateAdjustedCampaignMaxCrew(baseMaxCrew, relic11Level) {
  const effects = getRelicEffects({ relic_11: relic11Level });
  return Math.floor(baseMaxCrew * effects.campaignMaxCrewMultiplier);
}

export { getRelicEffects };
