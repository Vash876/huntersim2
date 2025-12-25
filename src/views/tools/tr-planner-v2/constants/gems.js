/**
 * TR Planner V2 - Gem Definitions
 */

export const GEMS = [
  {
    id: 'exodus',
    name: 'Exodus',
    letter: 'E',
    maxLevel: 5,
    color: 'purple',
    bgClass: 'from-purple-900/50 to-purple-800/30',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
  },
  {
    id: 'temporal',
    name: 'Temporal',
    letter: 'T',
    maxLevel: 3,
    color: 'red',
    bgClass: 'from-red-900/50 to-red-800/30',
    borderClass: 'border-red-500',
    textClass: 'text-red-400',
  },
  {
    id: 'innovation',
    name: 'Innovation',
    letter: 'I',
    maxLevel: 3,
    color: 'lime',
    bgClass: 'from-lime-900/50 to-lime-800/30',
    borderClass: 'border-lime-500',
    textClass: 'text-lime-400',
  },
  {
    id: 'attraction',
    name: 'Attraction',
    letter: 'A',
    maxLevel: 3,
    color: 'cyan',
    bgClass: 'from-cyan-900/50 to-cyan-800/30',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-400',
  },
  {
    id: 'power',
    name: 'Power',
    letter: 'P',
    maxLevel: 3,
    color: 'purple',
    bgClass: 'from-purple-900/50 to-purple-800/30',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-400',
  },
  {
    id: 'creation',
    name: 'Creation',
    letter: 'C',
    maxLevel: 4,
    color: 'orange',
    bgClass: 'from-orange-900/50 to-orange-800/30',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-400',
  },
  {
    id: 'evolution',
    name: 'Evolution',
    letter: 'V',
    maxLevel: 1,
    color: 'green',
    bgClass: 'from-green-900/50 to-green-800/30',
    borderClass: 'border-green-500',
    textClass: 'text-green-400',
  },
];

/**
 * Get gem by ID
 */
export function getGemById(gemId) {
  return GEMS.find(g => g.id === gemId);
}

/**
 * Get all gems with their current levels from gemData
 */
export function getGemsWithLevels(gemData) {
  return GEMS.map(gem => ({
    ...gem,
    level: gemData?.levels?.[gem.id] || 0,
  }));
}

/**
 * Check if a gem is active (level > 0)
 */
export function isGemActive(gemId, gemData) {
  return (gemData?.levels?.[gemId] || 0) > 0;
}
