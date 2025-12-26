/**
 * TR Planner Boost Definitions
 * 
 * Imported from original TR Planner constants/tr-planner/index.js
 * Categories define how tabs are organized
 */

import { getMaxLevelFromMP, LOOP_MODS } from '@/utils/loopModCostUtils';

// Boost Categories with Labels (defines tabs)
export const boostCategories = [
  { id: 'time', label: 'Time & Loop Mods' },
  { id: 'milestone', label: 'Milestones' },
  { id: 'relic', label: 'Relics' },
  { id: 'inscryption', label: 'Inscryptions' },
  { id: 'boonE', label: 'Boon Eternity' },
  { id: 'boonH', label: 'Boon Hegemony' },
  { id: 'gadget', label: 'Gadgets' },
  { id: 'research', label: 'Researches' },
  { id: 'gemUpgrades', label: 'Gem Upgrades' },
  { id: 'trinkets', label: 'Trinkets' },
  { id: 'cm', label: 'Construction Milestones' },
  { id: 'badge', label: 'Void Badges' },
  { id: 'premium', label: 'Premium' },
];

// General Stats (TR Count, All-Time Orbs)
export const generalStats = [
  { key: 'trCount', label: 'TR Count', type: 'number' },
  { key: 'allTimeOrbs', label: 'All-Time Orbs', type: 'number' }
];

// All Boosts from original index.js
export const allBoosts = [
  // Time and Loop Mods
  {
    key: 'hoursInTR',
    label: 'Hours in TR',
    category: 'time',
    type: 'number',
    orbcalc: true,
    tooltip: '0',
    fastControl: 24,
    multiplier: (value, allValues) => {
      const hoursInTR = value || 0;
      const loopMods = allValues.loopMods || 0;
      const hoursExponent = Math.min(2.42, 1.02 + hoursInTR * 0.00256);
      const loopModsExponent = Math.min(2.42, 1.02 + loopMods * 0.00005);
      const hoursTerm = Math.pow(hoursInTR, hoursExponent);
      const loopModsTerm = Math.pow(loopMods, loopModsExponent);
      return Math.pow(1 + hoursTerm * loopModsTerm, 0.06);
    },
  },
  {
    key: 'loopMods',
    label: 'Loop Mods Count',
    category: 'time',
    type: 'number',
    orbcalc: true,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    multiplier: 1,
  },
  {
    key: 'mp',
    label: 'MP',
    category: 'time',
    unlock: 'temporal',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    tooltip: (value, allValues) => {
      const plusUltima = allValues?.plusUltima || 0;
      const maxConsistencyLevel = 1 + plusUltima;
      const rawConsistencyLevel = getMaxLevelFromMP(LOOP_MODS.RULE_OF_CONSISTENCY, value);
      const consistencyLevel = Math.min(rawConsistencyLevel, maxConsistencyLevel);
      const evolutionLevel = getMaxLevelFromMP(LOOP_MODS.OUROBOROS_SHIP_EVOLUTION, value);
      let tooltip = `Rule of Consistency: Lv ${consistencyLevel}/${maxConsistencyLevel} (×${Math.pow(1.02, consistencyLevel).toFixed(4)})`;
      tooltip += `<br>Ouroboros Ship Evolution: Lv ${evolutionLevel} (×${Math.pow(1.25, evolutionLevel).toFixed(2)})`;
      return tooltip;
    },
    normalControl: 100,
    fastControl: 1000,
    multiplier: (value, allValues) => {
      const plusUltima = allValues?.plusUltima || 0;
      const maxConsistencyLevel = 1 + plusUltima;
      const rawConsistencyLevel = getMaxLevelFromMP(LOOP_MODS.RULE_OF_CONSISTENCY, value);
      const consistencyLevel = Math.min(rawConsistencyLevel, maxConsistencyLevel);
      const consistencyMultiplier = Math.pow(1.02, consistencyLevel);
      const evolutionLevel = getMaxLevelFromMP(LOOP_MODS.OUROBOROS_SHIP_EVOLUTION, value);
      const evolutionMultiplier = Math.pow(1.25, evolutionLevel);
      return consistencyMultiplier * evolutionMultiplier;
    },
  },
  {
    key: 'plusUltima',
    label: '+Ultima',
    category: 'time',
    unlock: 'temporal',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    tooltip: 'Increases the max Lvl of Ultima Loopmods (Rule of Consistency).',
    normalControl: 1,
    fastControl: 5,
    multiplier: 1,
  },

  // Milestones
  {
    key: 'ms0',
    label: 'Milestone #0',
    category: 'milestone',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: 'For Campaign Fragments Multiplier Attraction Gem Level #3 required.',
    multiplier: (value) => Math.pow(1.1, value),
    fragmulti: (value, allValues, gemData) => {
      const attractionLevel = gemData?.levels?.attraction || 0;
      if (attractionLevel >= 3) {
        return Math.pow(1.1, value);
      }
      return 1;
    },
  },

  // Relics
  {
    key: 'r6',
    label: 'Relic #6',
    category: 'relic',
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: (value) => {
      const part1 = 2.75 * value;
      const part2 = Math.pow(1.05, value);
      return part1 * part2;
    },
    max: 11
  },
  {
    key: 'r9',
    label: 'Relic #9',
    category: 'relic',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.08, value),
    max: 100
  },
  {
    key: 't2r4',
    label: 'Tier 2 Relic #4',
    category: 'relic',
    unlock: 'power',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1,
    max: 25
  },
  {
    key: 't2r8',
    label: 'Tier 2 Relic #8',
    category: 'relic',
    unlock: 'power',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    fragmulti: (value) => Math.pow(1.021, value),
    max: 21
  },
  {
    key: 't2r10',
    label: 'Tier 2 Relic #10',
    category: 'relic',
    unlock: 'power',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '',
    multiplier: (value, allValues) => {
      const mechCount = allValues?.mechCount || 0;
      return Math.pow(1 + 0.0005 * mechCount, value);
    },
    max: 25
  },
  {
    key: 'mechCount',
    label: 'Mech Count',
    category: 'relic',
    unlock: 'power',
    unlock_level: 3,
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: 'Total number of Mechs owned. Used for T2R10 calculation.',
    normalControl: 1,
    fastControl: 10,
    multiplier: 1,
  },

  // Inscryptions
  {
    key: 'i52',
    label: 'Inscryp. #52',
    category: 'inscryption',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.03, value),
    max: 8
  },
  {
    key: 'i78',
    label: 'Inscryp. #78',
    category: 'inscryption',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.08, value),
    max: 8
  },
  {
    key: 'i101',
    label: 'Inscryp. #101',
    category: 'inscryption',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.08, value),
    max: 8
  },
  {
    key: 'i110',
    label: 'Inscryp. #110',
    category: 'inscryption',
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: (value) => Math.pow(1.04, value),
    max: 10
  },

  // Construction Milestones
  {
    key: 'cm47',
    label: 'CM #47',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.04,
  },
  {
    key: 'cm49',
    label: 'CM #49',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.08,
  },
  {
    key: 'cm50',
    label: 'CM #50',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.05,
  },
  {
    key: 'cm51',
    label: 'CM #51',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.02,
  },
  {
    key: 'cm52',
    label: 'CM #52',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.1,
  },
  {
    key: 'cm53',
    label: 'CM #53',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.05,
  },
  {
    key: 'cm54',
    label: 'CM #54',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.04,
  },
  {
    key: 'cm55',
    label: 'CM #55',
    category: 'cm',
    unlock: 'power',
    unlock_level: 2,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.2,
  },

  // Boon Eternity
  {
    key: 'boonELevel',
    label: 'Boon E Level',
    category: 'boonE',
    unlock: 'temporal',
    unlock_level: 2,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1,
    max: 2
  },
  {
    key: 'campaigns',
    label: 'Campaigns',
    category: 'boonE',
    unlock: 'temporal',
    unlock_level: 2,
    type: 'number',
    orbcalc: true,
    tooltip: 'Total number of Campaign Missions completed.',
    minRequirement: { boost: 'boonELevel', level: 1 },
    multiplier: (value, allValues) => {
      const boonLevel = allValues.boonELevel || 0;
      if (boonLevel === 0) return 1;
      const baseMultiplier = Math.pow(1.006, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
    fragmulti: (value, allValues) => {
      const boonLevel = allValues.boonELevel || 0;
      if (boonLevel === 0) return 1;
      const baseMultiplier = Math.pow(1.03, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
  },

  // Boon Hegemony
  {
    key: 'boonHLevel',
    label: 'Boon H Level',
    category: 'boonH',
    unlock: 'temporal',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1,
    max: 2
  },
  {
    key: 'shipinstalls',
    label: 'Ship Installs',
    category: 'boonH',
    unlock: 'temporal',
    unlock_level: 3,
    type: 'number',
    orbcalc: true,
    tooltip: 'Total number of ship installs across all ships.',
    normalControl: 100,
    fastControl: 1000,
    minRequirement: { boost: 'boonHLevel', level: 1 },
    multiplier: (value, allValues) => {
      const boonLevel = allValues.boonHLevel || 0;
      if (boonLevel === 0) return 1;
      const baseMultiplier = Math.pow(1.000015, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
  },
  {
    key: 'ouroinstalls',
    label: 'Ouro Installs',
    category: 'boonH',
    unlock: 'temporal',
    unlock_level: 3,
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    minRequirement: { boost: 'boonHLevel', level: 1 },
    fragmulti: (value, allValues) => {
      const boonLevel = allValues.boonHLevel || 0;
      if (boonLevel === 0) return 1;
      const baseMultiplier = Math.pow(1.01, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
  },

  // Gadgets
  {
    key: 'oogadget',
    label: 'Serpents Connection Band',
    category: 'gadget',
    unlock: 'exodus',
    unlock_level: 4,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => {
      const baseMultiplier = Math.pow(1 + 0.0035, value);
      const levelMultiplier = Math.pow(1.04, Math.floor(value / 10));
      return baseMultiplier * levelMultiplier;
    }
  },
  {
    key: 'campfragdet',
    label: 'Galactic Fragment Magnet',
    category: 'gadget',
    unlock: 'exodus',
    unlock_level: 4,
    type: 'number',
    orbcalc: false,
    permanent: true,
    tooltip: '0',
    fragmulti: (value) => {
      const baseMultiplier = Math.pow(1 + 0.01, value);
      const levelMultiplier = Math.pow(1.08, Math.floor(value / 10));
      return baseMultiplier * levelMultiplier;
    }
  },

  // Researches
  {
    key: 'research',
    label: 'Current Research Points',
    category: 'research',
    unlock: 'innovation',
    unlock_level: 2,
    type: 'number',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    multiplier: (value, allValues, gemData) => {
      const innovationGemLevel = gemData?.levels?.innovation || 0;
      // Simplified - full calculation in original index.js
      return 1 + value * 0.001 * innovationGemLevel;
    },
  },
  {
    key: 'research_alltime',
    label: 'All-Time Highest Research Points',
    category: 'research',
    unlock: 'innovation',
    unlock_level: 2,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    normalControl: 100,
    fastControl: 1000,
    multiplier: (value, allValues, gemData) => {
      const innovationGemLevel = gemData?.levels?.innovation || 0;
      // Simplified - full calculation in original index.js
      return 1 + value * 0.001 * innovationGemLevel;
    },
  },

  // Gem Upgrades
  {
    key: 'orbsBonus',
    label: 'Orb Bonus',
    category: 'gemUpgrades',
    unlock: 'exodus',
    unlock_level: 5,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => Math.pow(1.14, value),
  },

  // Trinkets
  {
    key: 'trinket_oo_tier',
    label: 'The Ouro Recursive Index Tier',
    category: 'trinkets',
    unlock: 'creation',
    unlock_level: 4,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1,
  },
  {
    key: 'trinket_oo_level',
    label: 'The Ouro Recursive Index Level',
    category: 'trinkets',
    unlock: 'creation',
    unlock_level: 4,
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value, allValues) => {
      const tier = allValues.trinket_oo_tier || 0;
      const base = 1.01 + tier * 0.01;
      return Math.pow(base, value);
    },
    max: 80
  },

  // Premium
  {
    key: 'tr5Special',
    label: 'Diamond Special',
    category: 'premium',
    type: 'number',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: (value) => 1 + 0.01 * value,
    max: 10
  },
  {
    key: 'iap',
    label: 'IAP Trav. Pack',
    category: 'premium',
    type: 'boolean',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    key: 'iap_frag',
    label: 'IAP Frag. Pack',
    category: 'premium',
    type: 'boolean',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    fragmulti: 1.1,
  },
  {
    key: 'hera',
    label: 'Hera Card',
    category: 'premium',
    type: 'boolean',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1.05,
  },
  {
    key: 'jaxis',
    label: 'Jaxis Card',
    category: 'premium',
    type: 'boolean',
    orbcalc: true,
    permanent: true,
    tooltip: '0',
    multiplier: 1.05,
  },

  // Void Badges
  {
    key: 'vb1',
    label: 'Void Badge #1',
    category: 'badge',
    unlock: 'attraction',
    unlock_level: 1,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    key: 'vb2',
    label: 'Void Badge #2',
    category: 'badge',
    unlock: 'exodus',
    unlock_level: 3,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    key: 'vb3',
    label: 'Void Badge #3',
    category: 'badge',
    unlock: 'exodus',
    unlock_level: 3,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.25,
  },
  {
    key: 'vb4',
    label: 'Void Badge #4',
    category: 'badge',
    unlock: 'exodus',
    unlock_level: 3,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 1.5,
  },
  {
    key: 'vb5',
    label: 'Void Badge #5',
    category: 'badge',
    unlock: 'exodus',
    unlock_level: 3,
    type: 'boolean',
    orbcalc: true,
    permanent: false,
    tooltip: '0',
    multiplier: 2,
  },
];

// Helper: Get boosts grouped by category
export const boostsByCategory = boostCategories.map(category => ({
  ...category,
  boosts: allBoosts.filter(boost => boost.category === category.id)
}));

// Helper: Get boost by key
export function getBoostByKey(key) {
  return allBoosts.find(b => b.key === key);
}

// Helper: Get boosts that affect orb calculation
export function getOrbBoosts() {
  return allBoosts.filter(b => b.orbcalc);
}

// Helper: Get boosts that affect fragment calculation
export function getFragBoosts() {
  return allBoosts.filter(b => b.fragmulti);
}

// Helper: Check if boost is unlocked based on gem levels
export function isBoostUnlocked(boost, gemData) {
  if (!boost.unlock) return true;
  const gemLevel = gemData?.levels?.[boost.unlock] || 0;
  return gemLevel >= (boost.unlock_level || 0);
}

// Helper: Check if boost meets min requirement
export function meetsMinRequirement(boost, allValues) {
  if (!boost.minRequirement) return true;
  const reqValue = allValues[boost.minRequirement.boost] || 0;
  return reqValue >= boost.minRequirement.level;
}
