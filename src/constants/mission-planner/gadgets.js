/**
 * Gadget Definitions for Mission & Relic Planner
 * 
 * Fragment-related gadgets that affect mission calculations.
 * Formulas are based on the main gadgets.js file.
 */

export const MISSION_GADGETS = {
  local_fragment_magnet: {
    id: 'local_fragment_magnet',
    name: 'Local Fragment Magnet',
    description: 'Adds flat farm fragments based on level and milestones',
    effectType: 'farm_fragments_add',
    // Formula: level * 0.0001 + Math.floor(level/10) * 0.0005
    baseMulti: 0.0001,
    mileBonus: 0.0005,
  },
  galactic_fragment_magnet: {
    id: 'galactic_fragment_magnet',
    name: 'Galactic Fragment Magnet',
    description: 'Multiplies campaign fragments based on level and milestones',
    effectType: 'campaign_fragments',
    // Formula: 1.01^level * 1.08^Math.floor(level/10)
    baseMulti: 1.01,
    mileMulti: 1.08,
  },
};

/**
 * Calculate Local Fragment Magnet bonus (additive farm fragments)
 * Formula: level * baseMulti + Math.floor(level/10) * mileBonus
 * @param {number} level - Gadget level
 * @returns {number} Additive farm fragments bonus
 */
export function calculateLocalFragmentMagnet(level) {
  if (level <= 0) return 0;
  
  const gadget = MISSION_GADGETS.local_fragment_magnet;
  const milestones = Math.floor(level / 10);
  
  return level * gadget.baseMulti + milestones * gadget.mileBonus;
}

/**
 * Calculate Galactic Fragment Magnet multiplier (campaign fragments)
 * Formula: baseMulti^level * mileMulti^Math.floor(level/10)
 * @param {number} level - Gadget level
 * @returns {number} Campaign fragments multiplier
 */
export function calculateGalacticFragmentMagnet(level) {
  if (level <= 0) return 1.0;
  
  const gadget = MISSION_GADGETS.galactic_fragment_magnet;
  const milestones = Math.floor(level / 10);
  
  return Math.pow(gadget.baseMulti, level) * Math.pow(gadget.mileMulti, milestones);
}

/**
 * Get all gadget effects combined
 * @param {object} gadgetLevels - Object with gadget IDs and their levels
 * @returns {object} Combined gadget effects
 */
export function getGadgetEffects(gadgetLevels) {
  const localLevel = gadgetLevels.local_fragment_magnet || 0;
  const galacticLevel = gadgetLevels.galactic_fragment_magnet || 0;
  
  return {
    // Local Fragment Magnet: additive farm fragments
    farmFragsAdditive: calculateLocalFragmentMagnet(localLevel),
    
    // Galactic Fragment Magnet: campaign fragments multiplier
    campaignFragsMultiplier: calculateGalacticFragmentMagnet(galacticLevel),
    
    // Individual levels for reference
    levels: {
      local_fragment_magnet: localLevel,
      galactic_fragment_magnet: galacticLevel,
    },
  };
}
