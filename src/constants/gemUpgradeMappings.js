/**
 * Zentrale Mapping-Datei für Gem Upgrade IDs
 * 
 * Konvertiert zwischen gemPlannerStore upgrade IDs und upgrades.gems_nodes keys
 * 
 * Diese Mappings werden verwendet in:
 * - OverrideModal.vue
 * - useBuildEvaluation.js
 * - evaluationWorker.js
 * - evaluationCacheService.js
 * - BuildCodeModal.vue
 * - BuildImportModal.vue
 */

/**
 * Mapping von gemPlannerStore upgrade IDs zu upgrades.gems_nodes keys
 * 
 * Format:
 * - Key: ID wie sie im gemPlannerStore gespeichert ist (z.B. 'borge-loot-bonus')
 * - Value: Key wie er in upgrades.gems_nodes verwendet wird (z.B. 'attraction_lootBorge')
 */
export const GEM_UPGRADE_MAPPING = {
  // Attraction Gem Upgrades
  'borge-loot-bonus': 'attraction_lootBorge',
  'ozzy-loot-bonus': 'attraction_lootOzzy',
  'knox-loot-bonus': 'attraction_lootKnox',
  'catch-up-power': 'attraction_catchUp',  // ALTE Store-ID (für Kompatibilität mit existierenden Daten)
  'catch-up-power-borge-ozzy': 'attraction_catchUp',  // NEUE ID in attraction.js Definition
  'catch-up-power-knox': 'attraction_catchUp2',
  
  // Creation Gem Upgrades
  'borge-stat-bonus': 'creation_borgeGU',
  'ozzy-stat-bonus': 'creation_ozzyGU',
  'knox-stat-bonus': 'creation_knoxGU',
};

/**
 * Umgekehrtes Mapping: Von upgrades.gems_nodes keys zu gemPlannerStore IDs
 * 
 * Wird automatisch aus GEM_UPGRADE_MAPPING generiert
 */
export const REVERSE_GEM_UPGRADE_MAPPING = Object.entries(GEM_UPGRADE_MAPPING).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

/**
 * Upgrade-Name Mapping: Von kurzem Upgrade-Namen (ohne Gem-Typ) zu gemPlannerStore IDs
 * 
 * Format:
 * - Key: Kurzer Name wie er in upgrades.gems_nodes nach dem Unterstrich kommt (z.B. 'catchUp', 'lootBorge')
 * - Value: ID wie sie im gemPlannerStore gespeichert ist (z.B. 'catch-up-power')
 * 
 * Wird für die Parameter-Extraktion im Worker verwendet
 */
export const UPGRADE_NAME_TO_STORE_ID = {
  // Attraction Gem Upgrades
  'lootBorge': 'borge-loot-bonus',
  'lootOzzy': 'ozzy-loot-bonus',
  'lootKnox': 'knox-loot-bonus',
  'catchUp': 'catch-up-power',  // ALTE Store-ID (für Kompatibilität)
  'catchUp2': 'catch-up-power-knox',
  
  // Creation Gem Upgrades
  'borgeGU': 'borge-stat-bonus',
  'ozzyGU': 'ozzy-stat-bonus',
  'knoxGU': 'knox-stat-bonus',
};

/**
 * Hilfsfunktion: Konvertiert einen gemPlannerStore upgrade key zu einem upgrades.gems_nodes key
 * 
 * @param {string} gemPlannerKey - Der Key aus dem gemPlannerStore (z.B. 'borge-loot-bonus')
 * @returns {string} Der entsprechende upgrades.gems_nodes key (z.B. 'attraction_lootBorge')
 */
export function toUpgradesKey(gemPlannerKey) {
  return GEM_UPGRADE_MAPPING[gemPlannerKey] || gemPlannerKey;
}

/**
 * Hilfsfunktion: Konvertiert einen upgrades.gems_nodes key zu einem gemPlannerStore key
 * 
 * @param {string} upgradesKey - Der Key aus upgrades.gems_nodes (z.B. 'attraction_lootBorge')
 * @returns {string} Der entsprechende gemPlannerStore key (z.B. 'borge-loot-bonus')
 */
export function toGemPlannerKey(upgradesKey) {
  return REVERSE_GEM_UPGRADE_MAPPING[upgradesKey] || upgradesKey;
}
