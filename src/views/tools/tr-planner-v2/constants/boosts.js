/**
 * TR Planner V2 - Boost Definitions
 * 
 * WICHTIG: Keine hardcoded `unlock` properties mehr!
 * Gem-abhängige Boosts werden dynamisch über `requiresGem` definiert.
 * Die Sichtbarkeit wird zur Runtime basierend auf aktivierten Gems bestimmt.
 */

import { getMaxLevelFromMP, LOOP_MODS } from '@/utils/loopModCostUtils';

// ============================================
// KATEGORIEN
// ============================================

export const CATEGORIES = [
  { id: 'time', label: 'Time & Loop Mods', icon: 'clock' },
  { id: 'milestone', label: 'Milestones', icon: 'flag' },
  { id: 'relic', label: 'Relics', icon: 'diamond' },
  { id: 'inscryption', label: 'Inscryptions', icon: 'writing' },
  { id: 'boonE', label: 'Boon Eternity', icon: 'infinity' },
  { id: 'boonH', label: 'Boon Hegemony', icon: 'crown' },
  { id: 'gadget', label: 'Gadgets', icon: 'device-desktop' },
  { id: 'research', label: 'Researches', icon: 'flask' },
  { id: 'gemUpgrades', label: 'Gem Upgrades', icon: 'hexagon' },
  { id: 'trinkets', label: 'Trinkets', icon: 'sparkles' },
  { id: 'cm', label: 'Construction Milestones', icon: 'building' },
  { id: 'badge', label: 'Void Badges', icon: 'badge' },
  { id: 'premium', label: 'Premium', icon: 'star' },
];

// ============================================
// BOOST TYPEN
// ============================================

/**
 * Boost Types:
 * - number: Numerischer Wert (Level, Count, etc.)
 * - boolean: An/Aus Toggle
 */
export const BOOST_TYPES = {
  NUMBER: 'number',
  BOOLEAN: 'boolean',
};

// ============================================
// GEM UNLOCK REQUIREMENTS
// ============================================

/**
 * Definiert welches Gem-Level benötigt wird um einen Boost freizuschalten.
 * Format: { gemId: minLevel }
 * 
 * DYNAMISCH: Diese Requirements werden zur Runtime geprüft.
 * Wenn ein User eine Gem aktiviert hat, werden alle zugehörigen Boosts sichtbar.
 */
export const GEM_REQUIREMENTS = {
  // Temporal Gem
  TEMPORAL_2: { temporal: 2 },
  TEMPORAL_3: { temporal: 3 },
  
  // Innovation Gem
  INNOVATION_2: { innovation: 2 },
  INNOVATION_3: { innovation: 3 },
  
  // Attraction Gem
  ATTRACTION_1: { attraction: 1 },
  ATTRACTION_3: { attraction: 3 },
  
  // Power Gem
  POWER_2: { power: 2 },
  POWER_3: { power: 3 },
  
  // Creation Gem
  CREATION_4: { creation: 4 },
  
  // Exodus Gem
  EXODUS_3: { exodus: 3 },
  EXODUS_4: { exodus: 4 },
  EXODUS_5: { exodus: 5 },
};

// ============================================
// ALLE BOOSTS
// ============================================

export const BOOSTS = [
  // ==========================================
  // TIME & LOOP MODS
  // ==========================================
  {
    id: 1,
    key: 'hoursInTR',
    label: 'Hours in TR',
    category: 'time',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: false,
    fastControl: 24,
    tooltip: 'Time spent in current TR',
    multiplier: (value, allValues) => {
      const hoursInTR = value || 0;
      const loopMods = allValues?.loopMods || 0;
      const hoursExponent = Math.min(2.42, 1.02 + hoursInTR * 0.00256);
      const loopModsExponent = Math.min(2.42, 1.02 + loopMods * 0.00005);
      const hoursTerm = Math.pow(hoursInTR, hoursExponent);
      const loopModsTerm = Math.pow(loopMods, loopModsExponent);
      return Math.pow(1 + hoursTerm * loopModsTerm, 0.06);
    },
  },
  {
    id: 2,
    key: 'loopMods',
    label: 'Loop Mods Count',
    category: 'time',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: false,
    normalControl: 100,
    fastControl: 1000,
    tooltip: 'Total loop mods purchased',
    multiplier: 1,
  },
  {
    id: 3,
    key: 'mp',
    label: 'MP',
    category: 'time',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.TEMPORAL_3,
    normalControl: 100,
    fastControl: 1000,
    tooltip: (value, allValues) => {
      const plusUltima = allValues?.plusUltima || 0;
      const maxConsistencyLevel = 1 + plusUltima;
      const rawConsistencyLevel = getMaxLevelFromMP(LOOP_MODS.RULE_OF_CONSISTENCY, value);
      const consistencyLevel = Math.min(rawConsistencyLevel, maxConsistencyLevel);
      const evolutionLevel = getMaxLevelFromMP(LOOP_MODS.OUROBOROS_SHIP_EVOLUTION, value);
      return `Rule of Consistency: Lv ${consistencyLevel}/${maxConsistencyLevel} (×${Math.pow(1.02, consistencyLevel).toFixed(4)})\nOuroboros Ship Evolution: Lv ${evolutionLevel} (×${Math.pow(1.25, evolutionLevel).toFixed(2)})`;
    },
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
    id: 42,
    key: 'plusUltima',
    label: '+Ultima',
    category: 'time',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.TEMPORAL_3,
    normalControl: 1,
    fastControl: 5,
    tooltip: 'Increases the max Lvl of Ultima Loopmods (Rule of Consistency)',
    multiplier: 1,
  },

  // ==========================================
  // MILESTONES
  // ==========================================
  {
    id: 4,
    key: 'ms0',
    label: 'Milestone #0',
    category: 'milestone',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    tooltip: 'For Campaign Fragments Multiplier: Attraction Gem Level 3 required',
    multiplier: (value) => Math.pow(1.1, value),
    fragMultiplier: (value, allValues, gemData) => {
      const attractionLevel = gemData?.levels?.attraction || 0;
      if (attractionLevel >= 3) {
        return Math.pow(1.011, value);
      }
      return 1;
    },
  },

  // ==========================================
  // RELICS
  // ==========================================
  {
    id: 5,
    key: 'r6',
    label: 'Relic #6',
    category: 'relic',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: false,
    isPermanent: true,
    max: 11,
    fragMultiplier: (value) => {
      const part1 = 2.75 * value;
      const part2 = Math.pow(1.05, value);
      return part1 * part2;
    },
  },
  {
    id: 6,
    key: 'r9',
    label: 'Relic #9',
    category: 'relic',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    max: 100,
    multiplier: (value) => Math.pow(1.08, value),
  },
  {
    id: 41,
    key: 't2r4',
    label: 'Tier 2 Relic #4',
    category: 'relic',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.POWER_3,
    max: 25,
    multiplier: 1,
  },
  {
    id: 43,
    key: 't2r8',
    label: 'Tier 2 Relic #8',
    category: 'relic',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.POWER_3,
    max: 21,
    fragMultiplier: (value) => Math.pow(1.021, value),
  },
  {
    id: 44,
    key: 't2r10',
    label: 'Tier 2 Relic #10',
    category: 'relic',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.POWER_3,
    max: 25,
    multiplier: (value, allValues) => {
      const mechCount = allValues?.mechCount || 0;
      return Math.pow(1 + 0.0005 * mechCount, value);
    },
  },
  {
    id: 45,
    key: 'mechCount',
    label: 'Mech Count',
    category: 'relic',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: false,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.POWER_3,
    normalControl: 1,
    fastControl: 10,
    tooltip: 'Total number of Mechs owned. Used for T2R10 calculation.',
    multiplier: 1,
  },

  // ==========================================
  // INSCRYPTIONS
  // ==========================================
  {
    id: 7,
    key: 'i52',
    label: 'Inscryp. #52',
    category: 'inscryption',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    max: 8,
    multiplier: (value) => Math.pow(1.03, value),
  },
  {
    id: 8,
    key: 'i78',
    label: 'Inscryp. #78',
    category: 'inscryption',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    max: 8,
    multiplier: (value) => Math.pow(1.08, value),
  },
  {
    id: 9,
    key: 'i101',
    label: 'Inscryp. #101',
    category: 'inscryption',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    max: 8,
    multiplier: (value) => Math.pow(1.08, value),
  },
  {
    id: 35,
    key: 'i110',
    label: 'Inscryp. #110',
    category: 'inscryption',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: false,
    isPermanent: true,
    max: 10,
    fragMultiplier: (value) => Math.pow(1.04, value),
  },

  // ==========================================
  // CONSTRUCTION MILESTONES
  // ==========================================
  {
    id: 10,
    key: 'cm47',
    label: 'CM #47',
    category: 'cm',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.POWER_2,
    multiplier: 1.04,
  },
  {
    id: 11,
    key: 'cm49',
    label: 'CM #49',
    category: 'cm',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.POWER_2,
    multiplier: 1.08,
  },
  {
    id: 12,
    key: 'cm50',
    label: 'CM #50',
    category: 'cm',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.POWER_2,
    multiplier: 1.05,
  },
  {
    id: 13,
    key: 'cm51',
    label: 'CM #51',
    category: 'cm',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.POWER_2,
    multiplier: 1.02,
  },
  {
    id: 37,
    key: 'cm52',
    label: 'CM #52',
    category: 'cm',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.POWER_2,
    multiplier: 1.1,
  },
  {
    id: 38,
    key: 'cm53',
    label: 'CM #53',
    category: 'cm',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.POWER_2,
    multiplier: 1.05,
  },
  {
    id: 39,
    key: 'cm54',
    label: 'CM #54',
    category: 'cm',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.POWER_2,
    multiplier: 1.04,
  },
  {
    id: 40,
    key: 'cm55',
    label: 'CM #55',
    category: 'cm',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.POWER_2,
    multiplier: 1.2,
  },

  // ==========================================
  // BOON ETERNITY
  // ==========================================
  {
    id: 14,
    key: 'boonELevel',
    label: 'Boon E Level',
    category: 'boonE',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.TEMPORAL_2,
    max: 2,
    multiplier: 1,
  },
  {
    id: 15,
    key: 'campaigns',
    label: 'Campaigns',
    category: 'boonE',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.TEMPORAL_2,
    tooltip: 'Total number of Campaign Missions completed',
    dependsOn: { boost: 'boonELevel', minValue: 1 },
    multiplier: (value, allValues) => {
      const boonLevel = allValues?.boonELevel || 0;
      if (boonLevel === 0) return 1;
      const baseMultiplier = Math.pow(1.006, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
    fragMultiplier: (value, allValues) => {
      const boonLevel = allValues?.boonELevel || 0;
      if (boonLevel === 0) return 1;
      const baseMultiplier = Math.pow(1.03, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
  },

  // ==========================================
  // BOON HEGEMONY
  // ==========================================
  {
    id: 16,
    key: 'boonHLevel',
    label: 'Boon H Level',
    category: 'boonH',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.TEMPORAL_3,
    max: 2,
    multiplier: 1,
  },
  {
    id: 17,
    key: 'shipinstalls',
    label: 'Ship Installs',
    category: 'boonH',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.TEMPORAL_3,
    tooltip: 'Total number of ship installs across all ships',
    normalControl: 100,
    fastControl: 1000,
    dependsOn: { boost: 'boonHLevel', minValue: 1 },
    multiplier: (value, allValues) => {
      const boonLevel = allValues?.boonHLevel || 0;
      if (boonLevel === 0) return 1;
      const baseMultiplier = Math.pow(1.000015, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
  },
  {
    id: 18,
    key: 'ouroinstalls',
    label: 'Ouro Installs',
    category: 'boonH',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: false,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.TEMPORAL_3,
    dependsOn: { boost: 'boonHLevel', minValue: 1 },
    fragMultiplier: (value, allValues) => {
      const boonLevel = allValues?.boonHLevel || 0;
      if (boonLevel === 0) return 1;
      const baseMultiplier = Math.pow(1.01, value);
      if (boonLevel === 1) return baseMultiplier;
      return Math.pow(baseMultiplier, boonLevel);
    },
  },

  // ==========================================
  // GADGETS
  // ==========================================
  {
    id: 19,
    key: 'oogadget',
    label: 'Serpents Connection Band',
    category: 'gadget',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.EXODUS_4,
    multiplier: (value) => {
      const baseMultiplier = Math.pow(1 + 0.0035, value);
      const levelMultiplier = Math.pow(1.04, Math.floor(value / 10));
      return baseMultiplier * levelMultiplier;
    },
  },
  {
    id: 20,
    key: 'campfragdet',
    label: 'Galactic Fragment Magnet',
    category: 'gadget',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: false,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.EXODUS_4,
    fragMultiplier: (value) => {
      const baseMultiplier = Math.pow(1 + 0.01, value);
      const levelMultiplier = Math.pow(1.08, Math.floor(value / 10));
      return baseMultiplier * levelMultiplier;
    },
  },

  // ==========================================
  // RESEARCHES
  // ==========================================
  {
    id: 21,
    key: 'research',
    label: 'Current Research Points',
    category: 'research',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.INNOVATION_2,
    normalControl: 100,
    fastControl: 1000,
    // Multiplier wird in separater Funktion berechnet wegen Komplexität
    multiplier: 'research_current',
    getMax: (gemData) => {
      const innovationLevel = gemData?.levels?.innovation || 0;
      if (innovationLevel >= 3) return 8040;
      if (innovationLevel >= 2) return 4465;
      return 0;
    },
  },
  {
    id: 22,
    key: 'research_alltime',
    label: 'All-Time Highest Research Points',
    category: 'research',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.INNOVATION_2,
    normalControl: 100,
    fastControl: 1000,
    // Multiplier wird in separater Funktion berechnet wegen Komplexität
    multiplier: 'research_permanent',
    fragMultiplier: 'research_permanent_frag',
    getMax: (gemData) => {
      const innovationLevel = gemData?.levels?.innovation || 0;
      if (innovationLevel >= 3) return 14500;
      if (innovationLevel >= 2) return 4155;
      return 0;
    },
  },

  // ==========================================
  // GEM UPGRADES
  // ==========================================
  {
    id: 36,
    key: 'orbsBonus',
    label: 'Orb Bonus',
    category: 'gemUpgrades',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.EXODUS_5,
    multiplier: (value) => Math.pow(1.14, value),
  },

  // ==========================================
  // TRINKETS
  // ==========================================
  {
    id: 23,
    key: 'trinket_oo_tier',
    label: 'The Ouro Recursive Index Tier',
    category: 'trinkets',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.CREATION_4,
    multiplier: 1,
  },
  {
    id: 24,
    key: 'trinket_oo_level',
    label: 'The Ouro Recursive Index Level',
    category: 'trinkets',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    requiresGem: GEM_REQUIREMENTS.CREATION_4,
    max: 80,
    multiplier: (value, allValues) => {
      const tierLevel = allValues?.trinket_oo_tier || 0;
      const baseFactor = 0.01;
      const tierBonus = tierLevel * 0.001;
      const totalFactor = baseFactor + tierBonus;
      return 1 + totalFactor * value;
    },
  },

  // ==========================================
  // PREMIUM
  // ==========================================
  {
    id: 25,
    key: 'tr5Special',
    label: 'Diamond Special',
    category: 'premium',
    type: BOOST_TYPES.NUMBER,
    affectsOrbs: true,
    isPermanent: true,
    max: 10,
    multiplier: (value) => 1 + 0.01 * value,
  },
  {
    id: 26,
    key: 'iap',
    label: 'IAP Trav. Pack',
    category: 'premium',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: true,
    multiplier: 1.25,
  },
  {
    id: 34,
    key: 'iap_frag',
    label: 'IAP Frag. Pack',
    category: 'premium',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: true,
    fragMultiplier: 1.1,
  },
  {
    id: 27,
    key: 'hera',
    label: 'Hera Card',
    category: 'premium',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: true,
    multiplier: 1.05,
  },
  {
    id: 28,
    key: 'jaxis',
    label: 'Jaxis Card',
    category: 'premium',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: true,
    multiplier: 1.05,
  },

  // ==========================================
  // VOID BADGES
  // ==========================================
  {
    id: 29,
    key: 'vb1',
    label: 'Void Badge #1',
    category: 'badge',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.ATTRACTION_1,
    multiplier: 1.25,
  },
  {
    id: 30,
    key: 'vb2',
    label: 'Void Badge #2',
    category: 'badge',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.EXODUS_3,
    multiplier: 1.25,
  },
  {
    id: 31,
    key: 'vb3',
    label: 'Void Badge #3',
    category: 'badge',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.EXODUS_3,
    multiplier: 1.25,
  },
  {
    id: 32,
    key: 'vb4',
    label: 'Void Badge #4',
    category: 'badge',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.EXODUS_3,
    multiplier: 1.5,
  },
  {
    id: 33,
    key: 'vb5',
    label: 'Void Badge #5',
    category: 'badge',
    type: BOOST_TYPES.BOOLEAN,
    affectsOrbs: true,
    isPermanent: false,
    requiresGem: GEM_REQUIREMENTS.EXODUS_3,
    multiplier: 2,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Prüft ob ein Boost basierend auf Gem-Daten sichtbar sein soll
 */
export function isBoostAvailable(boost, gemData) {
  if (!boost.requiresGem) return true;
  
  for (const [gemId, minLevel] of Object.entries(boost.requiresGem)) {
    const userLevel = gemData?.levels?.[gemId] || 0;
    if (userLevel < minLevel) return false;
  }
  
  return true;
}

/**
 * Prüft ob ein Boost aktiviert werden kann (dependsOn check)
 */
export function isBoostEnabled(boost, allValues) {
  if (!boost.dependsOn) return true;
  
  const { boost: dependsOnKey, minValue } = boost.dependsOn;
  const currentValue = allValues?.[dependsOnKey] || 0;
  
  return currentValue >= minValue;
}

/**
 * Hole Boost nach Key
 */
export function getBoostByKey(key) {
  return BOOSTS.find(b => b.key === key);
}

/**
 * Hole Boost nach ID
 */
export function getBoostById(id) {
  return BOOSTS.find(b => b.id === id);
}

/**
 * Hole alle Boosts für eine Kategorie
 */
export function getBoostsByCategory(categoryId) {
  return BOOSTS.filter(b => b.category === categoryId);
}

/**
 * Hole alle verfügbaren Boosts basierend auf Gem-Daten
 */
export function getAvailableBoosts(gemData) {
  return BOOSTS.filter(b => isBoostAvailable(b, gemData));
}

/**
 * Hole Boosts gruppiert nach Kategorie
 */
export function getBoostsByCategories(gemData = null) {
  return CATEGORIES.map(category => ({
    ...category,
    boosts: gemData 
      ? BOOSTS.filter(b => b.category === category.id && isBoostAvailable(b, gemData))
      : BOOSTS.filter(b => b.category === category.id),
  })).filter(cat => cat.boosts.length > 0);
}

// ============================================
// ID MAPPINGS (für Import/Export)
// ============================================

export const boostKeyToId = new Map(BOOSTS.map(b => [b.key, b.id]));
export const boostIdToKey = new Map(BOOSTS.map(b => [b.id, b.key]));
