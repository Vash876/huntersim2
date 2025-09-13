/**
 * Game Statistics Constants for Gem Planner Multiplier Calculations
 * This file defines all game statistics needed to calculate gem upgrade multipliers
 */

import { max } from "lodash";

export const GAME_STATS_CONFIG = {
  // Game progression stats
  progression: {
    title: 'Game Progression',
    stats: [
      {
        id: 'ticks',
        name: 'TR Ticks',
        max: 1e9,
        step: 1e3,
        faststep:1e4,
        category: 'progression'
      },
      {
        id: 'loopMods',
        name: 'Loop Mods',
        max: 99999,
        step: 10,
        faststep: 1000,
        category: 'progression'
      },
      {
        id: 'loopResets',
        name: 'Loop Resets',
        max: 99999,
        step: 10,
        faststep: 100,
        category: 'progression'
      },
      {
        id: 'researchLevel',
        name: 'Research Level',
        max: 999,
        step: 1,
        faststep: 10,
        category: 'progression'
      },
      {
        id: 'techUpgrades',
        name: 'Tech Upgrades',
        max: 99999,
        step: 100,
        faststep: 1e4,
        category: 'progression'
      },
      {
        id: 'quantumTechLevels',
        name: 'Quantum Tech Levels',
        max: 999,
        step: 1,
        faststep: 10,
        category: 'progression'
      },
      {
        id: 'mk9Purchased',
        name: 'MK9 Purchased',
        max: 99999,
        step: 4,
        faststep: 20,
        category: 'progression'
      }
    ]
  },

  // Ship Ranks
  rank: {
    title: 'Ship Ranks',
    stats: [
      {
        id: 'cradleRank',
        name: 'Cradle Rank',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'rank'
      },
      {
        id: 'auxesiaRank',
        name: 'Auxesia Rank',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'rank '
      },
      {
        id: 'zagreusRank',
        name: 'Zagreus Rank',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'rank'
      },
      {
        id: 'hephaestusRank',
        name: 'Hephaestus Rank',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'rank'
      },
      {
        id: 'demeterRank',
        name: 'Demeter Rank',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'rank'
      },
      {
        id: 'koiosRank',
        name: 'Koios Rank',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'rank'
      },
      {
        id: 'zeusRank',
        name: 'Zeus Rank',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'rank'
      },
    ]
  },

  // Ship Crew
  crew: {
    title: 'Ship Crew',
    stats: [
      {
        id: 'cradleCrew',
        name: 'Cradle Crew',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'crew'
      },
      {
        id: 'auxesiaCrew',
        name: 'Auxesia Crew',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'crew'
      },
      {
        id: 'zagreusCrew',
        name: 'Zagreus Crew',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'crew'
      },
      {
        id: 'hephaestusCrew',
        name: 'Hephaestus Crew',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'crew'
      },
      {
        id: 'demeterCrew',
        name: 'Demeter Crew',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'crew'
      },
      {
        id: 'koiosCrew',
        name: 'Koios Crew',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'crew'
      },
      {
        id: 'zeusCrew',
        name: 'Zeus Crew',
        max: 9999,
        step: 1,
        faststep: 100,
        category: 'crew'
      },
    ]
  },
};

/**
 * Get all stats as a flat array
 */
export function getAllStats() {
  const allStats = [];
  Object.values(GAME_STATS_CONFIG).forEach(category => {
    allStats.push(...category.stats);
  });
  return allStats;
}

/**
 * Get default values for all stats
 */
export function getDefaultStatsValues() {
  const defaults = {};
  getAllStats().forEach(stat => {
    defaults[stat.id] = 0; // Set default to 0 instead of undefined
  });
  return defaults;
}

/**
 * Get stats by category
 */
export function getStatsByCategory(categoryName) {
  return GAME_STATS_CONFIG[categoryName]?.stats || [];
}

/**
 * Get stat configuration by ID
 */
export function getStatConfig(statId) {
  return getAllStats().find(stat => stat.id === statId);
}

export default GAME_STATS_CONFIG;
