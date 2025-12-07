/**
 * Badge Definitions for Mission & Relic Planner
 * 
 * Badges are binary unlocks that provide significant bonuses.
 * They are either active or inactive - no levels.
 */

export const BADGES = {
  engineering_badge: {
    id: 'engineering_badge',
    name: 'Engineering Badge',
    description: 'Double mission speed',
    effectType: 'mission_speed',
    // When active: x2 mission speed
    multiplier: 2.0,
  },
  fragmentation_badge: {
    id: 'fragmentation_badge',
    name: 'Fragmentation Badge',
    description: 'Increase farm fragment drops',
    effectType: 'farm_fragments',
    // When active: x1.25 farm fragments
    multiplier: 1.25,
  },
};

/**
 * Calculate mission speed multiplier from Engineering Badge
 * @param {boolean} isActive - Whether the badge is active
 * @returns {number} Mission speed multiplier (2.0 if active, 1.0 if not)
 */
export function calculateEngineeringBadgeMissionSpeed(isActive) {
  return isActive ? BADGES.engineering_badge.multiplier : 1.0;
}

/**
 * Calculate farm fragments multiplier from Fragmentation Badge
 * @param {boolean} isActive - Whether the badge is active
 * @returns {number} Farm fragments multiplier (1.25 if active, 1.0 if not)
 */
export function calculateFragmentationBadgeFarmFrags(isActive) {
  return isActive ? BADGES.fragmentation_badge.multiplier : 1.0;
}

/**
 * Get all badge effects combined
 * @param {object} badgeStates - Object with badge IDs and their active state
 * @returns {object} Combined badge effects
 */
export function getBadgeEffects(badgeStates) {
  const engineeringActive = badgeStates?.engineering_badge || false;
  const fragmentationActive = badgeStates?.fragmentation_badge || false;
  
  return {
    missionSpeedMultiplier: calculateEngineeringBadgeMissionSpeed(engineeringActive),
    farmFragsMultiplier: calculateFragmentationBadgeFarmFrags(fragmentationActive),
    
    // Active states for reference
    active: {
      engineering_badge: engineeringActive,
      fragmentation_badge: fragmentationActive,
    },
    
    // Breakdown for display
    breakdown: {
      engineering_badge: {
        active: engineeringActive,
        effect: engineeringActive ? 'x2 Mission Speed' : 'Inactive',
      },
      fragmentation_badge: {
        active: fragmentationActive,
        effect: fragmentationActive ? 'x1.25 Farm Fragments' : 'Inactive',
      },
    },
  };
}
