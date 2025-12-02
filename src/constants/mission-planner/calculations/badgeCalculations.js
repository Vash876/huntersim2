/**
 * Badge Calculations for Mission & Relic Planner
 * 
 * Combines badge effects with other bonuses for final calculations.
 */

import { getBadgeEffects } from '../badges';

/**
 * Get complete badge effects breakdown
 * @param {object} badgeStates - Object with badge active states { engineering_badge: true, fragmentation_badge: false }
 * @returns {object} Complete breakdown of badge effects
 */
export function getBadgeEffectsBreakdown(badgeStates) {
  const effects = getBadgeEffects(badgeStates);
  
  return {
    ...effects,
    missionSpeedPercent: Math.round(effects.missionSpeedMultiplier * 100),
    farmFragsPercent: Math.round(effects.farmFragsMultiplier * 100),
  };
}

export { getBadgeEffects };
