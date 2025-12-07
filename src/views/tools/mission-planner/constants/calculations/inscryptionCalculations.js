/**
 * Inscryption Calculations for Mission & Relic Planner
 * 
 * Combines inscryption effects with other bonuses for final calculations.
 */

import { getInscryptionEffects } from '../inscryptions';

/**
 * Get complete inscryption effects breakdown
 * @param {object} inscryptionLevels - Object with inscryption levels
 * @returns {object} Complete breakdown of inscryption effects
 */
export function getInscryptionEffectsBreakdown(inscryptionLevels) {
  const effects = getInscryptionEffects(inscryptionLevels);
  
  return {
    ...effects,
    farmFragsPercent: Math.round(effects.farmFragsMultiplier * 100),
    campaignFragsPercent: Math.round(effects.campaignFragsMultiplier * 100),
    
    // Breakdown for display
    breakdown: {
      inscryption_58: {
        level: effects.levels.inscryption_58,
        effect: effects.levels.inscryption_58 > 0 
          ? `+${effects.headstartMaxLevelBonus} Headstart Max Levels` 
          : 'Inactive',
      },
      inscryption_102: {
        level: effects.levels.inscryption_102,
        effect: effects.levels.inscryption_102 > 0 
          ? `+${effects.farmFragsAdditive.toFixed(3)} Farm Fragments` 
          : 'Inactive',
      },
      inscryption_106: {
        level: effects.levels.inscryption_106,
        effect: effects.levels.inscryption_106 > 0 
          ? `+${effects.personnelPowerBonuses.T1.toFixed(1)} T1 Power` 
          : 'Inactive',
      },
      inscryption_107: {
        level: effects.levels.inscryption_107,
        effect: effects.levels.inscryption_107 > 0 
          ? `+${effects.personnelPowerBonuses.T2.toFixed(1)} T2 Power` 
          : 'Inactive',
      },
      inscryption_108: {
        level: effects.levels.inscryption_108,
        effect: effects.levels.inscryption_108 > 0 
          ? `+${effects.personnelPowerBonuses.T3.toFixed(1)} T3 Power` 
          : 'Inactive',
      },
      inscryption_109: {
        level: effects.levels.inscryption_109,
        effect: effects.levels.inscryption_109 > 0 
          ? `+${effects.personnelPowerBonuses.T4.toFixed(1)} T4 Power` 
          : 'Inactive',
      },
      inscryption_110: {
        level: effects.levels.inscryption_110,
        effect: effects.levels.inscryption_110 > 0 
          ? `x${effects.allFragsMultiplier.toFixed(2)} All Fragments` 
          : 'Inactive',
      },
    },
  };
}

export { getInscryptionEffects };
