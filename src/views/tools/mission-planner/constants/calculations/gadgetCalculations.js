/**
 * Gadget Calculations for Mission & Relic Planner
 * 
 * Combines gadget effects with other bonuses for final calculations.
 */

import { getGadgetEffects, calculateLocalFragmentMagnet, calculateGalacticFragmentMagnet } from '../gadgets';

/**
 * Get complete gadget effects breakdown
 * @param {object} gadgetLevels - Object with gadget levels
 * @returns {object} Complete breakdown of gadget effects
 */
export function getGadgetEffectsBreakdown(gadgetLevels) {
  const effects = getGadgetEffects(gadgetLevels);
  
  const localLevel = gadgetLevels.local_fragment_magnet || 0;
  const galacticLevel = gadgetLevels.galactic_fragment_magnet || 0;
  
  return {
    ...effects,
    campaignFragsPercent: Math.round(effects.campaignFragsMultiplier * 100),
    
    // Breakdown for display
    breakdown: {
      local_fragment_magnet: {
        level: localLevel,
        milestones: Math.floor(localLevel / 10),
        effect: localLevel > 0 
          ? `+${effects.farmFragsAdditive.toFixed(4)} Farm Fragments` 
          : 'Inactive',
      },
      galactic_fragment_magnet: {
        level: galacticLevel,
        milestones: Math.floor(galacticLevel / 10),
        effect: galacticLevel > 0 
          ? `x${effects.campaignFragsMultiplier.toFixed(4)} Campaign Fragments` 
          : 'Inactive',
      },
    },
  };
}

export { getGadgetEffects, calculateLocalFragmentMagnet, calculateGalacticFragmentMagnet };
