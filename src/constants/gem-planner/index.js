/**
 * Gem Planner Constants - Central Export
 * 
 * This file exports all gem constants for the gem planner tool.
 * Each gem contains quality costs, upgrades with multiplier formulas,
 * and unlock requirements.
 */

import { EXODUS_GEM } from './exodus.js';
import { TEMPORAL_GEM } from './temporal.js';
import { INNOVATION_GEM } from './innovation.js';
import { POWER_GEM } from './power.js';
import { ATTRACTION_GEM } from './attraction.js';
import { CREATION_GEM } from './creation.js';
import { EVOLUTION_GEM } from './evolution.js';

// All available gems
export const GEMS = {
  exodus: EXODUS_GEM,
  temporal: TEMPORAL_GEM,
  innovation: INNOVATION_GEM,
  power: POWER_GEM,
  attraction: ATTRACTION_GEM,
  creation: CREATION_GEM,
  evolution: EVOLUTION_GEM
};

// Array of all gems for iteration
export const GEM_LIST = [
  EXODUS_GEM,
  TEMPORAL_GEM,
  INNOVATION_GEM,
  POWER_GEM,
  ATTRACTION_GEM,
  CREATION_GEM,
  EVOLUTION_GEM
];

// Gem metadata for UI
export const GEM_METADATA = {
  exodus: { order: 1 },
  temporal: { order: 2 },
  innovation: { order: 3 },
  power: { order: 4 },
  attraction: { order: 5 },
  creation: { order: 6 },
  evolution: { order: 7 }
};

// Helper functions
export const getGemById = (id) => GEMS[id];
export const getGemList = () => GEM_LIST;
export const getGemMetadata = (id) => GEM_METADATA[id];

// Export individual gems for direct access
export {
  EXODUS_GEM,
  TEMPORAL_GEM,
  INNOVATION_GEM,
  POWER_GEM,
  ATTRACTION_GEM,
  CREATION_GEM,
  EVOLUTION_GEM
};

export default GEMS;
