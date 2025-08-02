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
        category: 'rank'
      },
      {
        id: 'auxesiaRank',
        name: 'Auxesia Rank',
        category: 'rank '
      },
      {
        id: 'zagreusRank',
        name: 'Zagreus Rank',
        category: 'rank'
      },
      {
        id: 'hephaestusRank',
        name: 'Hephaestus Rank',
        category: 'rank'
      },
      {
        id: 'demeterRank',
        name: 'Demeter Rank',
        category: 'rank'
      },
      {
        id: 'koiosRank',
        name: 'Koios Rank',
        category: 'rank'
      },
      {
        id: 'zeusRank',
        name: 'Zeus Rank',
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
        category: 'crew'
      },
      {
        id: 'auxesiaCrew',
        name: 'Auxesia Crew',
        category: 'crew'
      },
      {
        id: 'zagreusCrew',
        name: 'Zagreus Crew',
        category: 'crew'
      },
      {
        id: 'hephaestusCrew',
        name: 'Hephaestus Crew',
        category: 'crew'
      },
      {
        id: 'demeterCrew',
        name: 'Demeter Crew',
        category: 'crew'
      },
      {
        id: 'koiosCrew',
        name: 'Koios Crew',
        category: 'crew'
      },
      {
        id: 'zeusCrew',
        name: 'Zeus Crew',
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
