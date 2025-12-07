/**
 * Research Definitions for Mission & Relic Planner
 * 
 * Researches are unlocked based on RP (Research Points) threshold.
 * Like MP for loopmods, RP is NOT spent - it's a threshold.
 * If you have 500 RP, you can unlock all researches with cost ≤ 500.
 * 
 * Two types:
 * - Normal Researches: Reset after Traversal Reset, use current RP
 * - Dark Researches: Permanent, use All Time Highest RP
 */

// =============================================================================
// NORMAL RESEARCHES (Reset after TR, use current RP)
// =============================================================================

/**
 * Research 58: Mission Speed and Personnel bonuses
 * Each level is a separate unlock
 */
export const RESEARCH_58 = {
  id: 'research_58',
  name: 'Research 58',
  type: 'normal',
  levels: [
    { level: 1, cost: 286, effectType: 'mission_speed', multiplier: 1.05 },
    { level: 2, cost: 331, effectType: 'personnel_count', target: 'T1', bonus: 50 },
    { level: 3, cost: 375, effectType: 'mission_speed', multiplier: 1.05 },
    { level: 4, cost: 417, effectType: 'personnel_count', target: 'T2', bonus: 50 },
    { level: 5, cost: 464, effectType: 'mission_speed', multiplier: 1.05 },
    { level: 6, cost: 508, effectType: 'personnel_count', target: 'T3', bonus: 50 },
  ],
};

/**
 * Research 70: Major Mission Speed boost
 */
export const RESEARCH_70 = {
  id: 'research_70',
  name: 'Research 70',
  type: 'normal',
  levels: [
    { level: 5, cost: 2020, effectType: 'mission_speed', multiplier: 2.0 },
  ],
};

/**
 * Research 80: Mission Speed boost
 */
export const RESEARCH_80 = {
  id: 'research_80',
  name: 'Research 80',
  type: 'normal',
  levels: [
    { level: 5, cost: 4520, effectType: 'mission_speed', multiplier: 1.5 },
  ],
};

/**
 * Research 93: Farm Fragments additive bonus
 */
export const RESEARCH_93 = {
  id: 'research_93',
  name: 'Research 93',
  type: 'normal',
  levels: [
    { level: 1, cost: 4700, effectType: 'farm_fragments_add', bonus: 0.002 },
    { level: 2, cost: 4895, effectType: 'farm_fragments_add', bonus: 0.003 },
    { level: 3, cost: 5090, effectType: 'farm_fragments_add', bonus: 0.004 },
    { level: 4, cost: 5285, effectType: 'farm_fragments_add', bonus: 0.005 },
    { level: 5, cost: 5480, effectType: 'farm_fragments_add', bonus: 0.006 },
    { level: 6, cost: 5675, effectType: 'farm_fragments_add', bonus: 0.007 },
  ],
};

// =============================================================================
// DARK RESEARCHES (Permanent, use All Time Highest RP)
// =============================================================================

/**
 * Research 82: Farm Fragments additive bonus (Dark)
 */
export const RESEARCH_82 = {
  id: 'research_82',
  name: 'Dark Research 82',
  type: 'dark',
  levels: [
    { level: 1, cost: 2675, effectType: 'farm_fragments_add', bonus: 0.001 },
    { level: 2, cost: 2915, effectType: 'farm_fragments_add', bonus: 0.002 },
    { level: 3, cost: 3155, effectType: 'farm_fragments_add', bonus: 0.003 },
    { level: 4, cost: 3395, effectType: 'farm_fragments_add', bonus: 0.004 },
    { level: 5, cost: 3635, effectType: 'farm_fragments_add', bonus: 0.005 },
    { level: 6, cost: 3875, effectType: 'farm_fragments_add', bonus: 0.006 },
  ],
};

/**
 * Research 89: Campaign Fragments multiplier (Dark)
 */
export const RESEARCH_89 = {
  id: 'research_89',
  name: 'Dark Research 89',
  type: 'dark',
  levels: [
    { level: 1, cost: 3380, effectType: 'campaign_fragments_mult', multiplier: 1.10 },
    { level: 2, cost: 3535, effectType: 'campaign_fragments_mult', multiplier: 1.10 },
    { level: 3, cost: 3690, effectType: 'campaign_fragments_mult', multiplier: 1.14 },
    { level: 4, cost: 3845, effectType: 'campaign_fragments_mult', multiplier: 1.14 },
    { level: 5, cost: 4000, effectType: 'campaign_fragments_mult', multiplier: 1.18 },
    { level: 6, cost: 4155, effectType: 'campaign_fragments_mult', multiplier: 1.18 },
  ],
};

/**
 * Research 97: All Fragments multiplier (Dark)
 * Affects both Farm and Campaign fragments
 */
export const RESEARCH_97 = {
  id: 'research_97',
  name: 'Dark Research 97',
  description: 'All fragments multiplier (permanent)',
  type: 'dark',
  levels: [
    { level: 1, cost: 5275, effectType: 'all_fragments_mult', multiplier: 1.03 },
    { level: 2, cost: 5775, effectType: 'all_fragments_mult', multiplier: 1.04 },
    { level: 3, cost: 6275, effectType: 'all_fragments_mult', multiplier: 1.05 },
    { level: 4, cost: 6775, effectType: 'all_fragments_mult', multiplier: 1.06 },
    { level: 5, cost: 7275, effectType: 'all_fragments_mult', multiplier: 1.07 },
    { level: 6, cost: 7775, effectType: 'all_fragments_mult', multiplier: 1.08 },
  ],
};

/**
 * Research 104: Farm Fragments multiplier (Dark)
 */
export const RESEARCH_104 = {
  id: 'research_104',
  name: 'Dark Research 104',
  description: 'Farm fragments multiplier (permanent)',
  type: 'dark',
  levels: [
    { level: 1, cost: 6675, effectType: 'farm_fragments_mult', multiplier: 1.01 },
    { level: 2, cost: 7375, effectType: 'farm_fragments_mult', multiplier: 1.02 },
    { level: 3, cost: 8075, effectType: 'farm_fragments_mult', multiplier: 1.03 },
    { level: 4, cost: 8775, effectType: 'farm_fragments_mult', multiplier: 1.04 },
    { level: 5, cost: 9475, effectType: 'farm_fragments_mult', multiplier: 1.05 },
    { level: 6, cost: 10175, effectType: 'farm_fragments_mult', multiplier: 1.06 },
  ],
};

// =============================================================================
// COMBINED EXPORTS
// =============================================================================

export const NORMAL_RESEARCHES = {
  research_58: RESEARCH_58,
  research_70: RESEARCH_70,
  research_80: RESEARCH_80,
  research_93: RESEARCH_93,
};

export const DARK_RESEARCHES = {
  research_82: RESEARCH_82,
  research_89: RESEARCH_89,
  research_97: RESEARCH_97,
  research_104: RESEARCH_104,
};

export const ALL_RESEARCHES = {
  ...NORMAL_RESEARCHES,
  ...DARK_RESEARCHES,
};

/**
 * Get all unlocked levels for a research based on RP threshold
 * @param {object} research - The research definition
 * @param {number} rpThreshold - Available RP (threshold, not budget)
 * @returns {array} Array of unlocked levels
 */
export function getUnlockedResearchLevels(research, rpThreshold) {
  return research.levels.filter(level => level.cost <= rpThreshold);
}

/**
 * Get the highest unlocked level for a research
 * @param {object} research - The research definition
 * @param {number} rpThreshold - Available RP
 * @returns {number} Highest unlocked level (0 if none)
 */
export function getHighestUnlockedLevel(research, rpThreshold) {
  const unlocked = getUnlockedResearchLevels(research, rpThreshold);
  if (unlocked.length === 0) return 0;
  return Math.max(...unlocked.map(l => l.level));
}
