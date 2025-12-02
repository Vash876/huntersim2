/**
 * Other Calculations for Mission & Relic Planner
 * 
 * Miscellaneous modifiers like Trait Sphere 07, Fragmentation Pack, and Eternal Milestone.
 */

export const OTHER_MODIFIERS = {
  trait_sphere_07: {
    id: 'trait_sphere_07',
    name: 'Trait Sphere 07',
    description: 'Doubles farm fragment',
    effectType: 'farm_fragments',
    // When active: x2 farm fragments
    multiplier: 2.0,
  },
  fragmentation_pack: {
    id: 'fragmentation_pack',
    name: 'Fragmentation Pack',
    description: 'Increases all fragment',
    effectType: 'all_fragments',
    // When active: x1.1 all fragments (farm + campaign)
    multiplier: 1.1,
  },
  eternal_milestone: {
    id: 'eternal_milestone',
    name: '#0 The Eternal Milestone',
    description: 'Multiplies campaign fragments per level',
    effectType: 'campaign_fragments',
    // Per level: x1.011 campaign fragments
    multiplierPerLevel: 1.011,
  },
};

/**
 * Calculate farm fragments multiplier from Trait Sphere 07
 * @param {boolean} isActive - Whether TS07 is active
 * @returns {number} Farm fragments multiplier (2.0 if active, 1.0 if not)
 */
export function calculateTS07FarmFrags(isActive) {
  return isActive ? OTHER_MODIFIERS.trait_sphere_07.multiplier : 1.0;
}

/**
 * Calculate all fragments multiplier from Fragmentation Pack
 * @param {boolean} isActive - Whether Fragmentation Pack is active
 * @returns {number} All fragments multiplier (1.25 if active, 1.0 if not)
 */
export function calculateFragmentationPackMultiplier(isActive) {
  return isActive ? OTHER_MODIFIERS.fragmentation_pack.multiplier : 1.0;
}

/**
 * Calculate campaign fragments multiplier from Eternal Milestone
 * Only active when Attraction Gem is Level 3+
 * @param {number} level - Eternal Milestone level
 * @param {boolean} isUnlocked - Whether Attraction Gem is Level 3+
 * @returns {number} Campaign fragments multiplier (1.011^level)
 */
export function calculateEternalMilestoneMultiplier(level, isUnlocked = false) {
  if (!isUnlocked || !level || level <= 0) return 1.0;
  return Math.pow(OTHER_MODIFIERS.eternal_milestone.multiplierPerLevel, level);
}

/**
 * Get all "other" effects combined
 * @param {object} otherStates - Object with modifier states
 * @param {number} eternalMilestoneLevel - Level from hunterStore (optional)
 * @param {number} attractionGemLevel - Attraction Gem level from gemPlannerStore (optional)
 * @returns {object} Combined other effects
 */
export function getOtherEffects(otherStates, eternalMilestoneLevel = 0, attractionGemLevel = 0) {
  const ts07Active = otherStates?.trait_sphere_07 || false;
  const fragPackActive = otherStates?.fragmentation_pack || false;
  
  // Eternal Milestone only active when Attraction Gem is Level 3+
  const eternalMilestoneUnlocked = attractionGemLevel >= 3;
  
  const ts07Multiplier = calculateTS07FarmFrags(ts07Active);
  const fragPackMultiplier = calculateFragmentationPackMultiplier(fragPackActive);
  const eternalMultiplier = calculateEternalMilestoneMultiplier(eternalMilestoneLevel, eternalMilestoneUnlocked);
  
  return {
    // TS07 only affects farm frags
    farmFragsMultiplier: ts07Multiplier * fragPackMultiplier,
    
    // Fragmentation Pack and Eternal Milestone affect campaign frags
    campaignFragsMultiplier: fragPackMultiplier * eternalMultiplier,
    
    // Eternal Milestone info for display
    eternalMilestoneLevel,
    eternalMilestoneMultiplier: eternalMultiplier,
    eternalMilestoneUnlocked,
    attractionGemLevel,
    
    // Active states for reference
    active: {
      trait_sphere_07: ts07Active,
      fragmentation_pack: fragPackActive,
    },
    
    // Breakdown for display
    breakdown: {
      trait_sphere_07: {
        active: ts07Active,
        effect: ts07Active ? 'x2 Farm Fragments' : 'Inactive',
      },
      fragmentation_pack: {
        active: fragPackActive,
        effect: fragPackActive ? 'x1.1 All Fragments' : 'Inactive',
      },
      eternal_milestone: {
        level: eternalMilestoneLevel,
        multiplier: eternalMultiplier,
        unlocked: eternalMilestoneUnlocked,
        effect: !eternalMilestoneUnlocked 
          ? `Locked (Attraction Gem Lv${attractionGemLevel}/3)` 
          : eternalMilestoneLevel > 0 
            ? `x${eternalMultiplier.toFixed(4)} Campaign Fragments` 
            : 'Level 0',
      },
    },
  };
}

/**
 * Get complete other effects breakdown
 * @param {object} otherStates - Object with modifier states
 * @param {number} eternalMilestoneLevel - Level from hunterStore (optional)
 * @param {number} attractionGemLevel - Attraction Gem level from gemPlannerStore (optional)
 * @returns {object} Complete breakdown of other effects
 */
export function getOtherEffectsBreakdown(otherStates, eternalMilestoneLevel = 0, attractionGemLevel = 0) {
  const effects = getOtherEffects(otherStates, eternalMilestoneLevel, attractionGemLevel);
  
  return {
    ...effects,
    farmFragsPercent: Math.round(effects.farmFragsMultiplier * 100),
    campaignFragsPercent: Math.round(effects.campaignFragsMultiplier * 100),
  };
}
