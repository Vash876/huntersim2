/**
 * Evaluierung Cache Service
 * 
 * Bietet Funktionen zum Caching und Abrufen von Build-Evaluierungsergebnissen
 * Berücksichtigt Build-Attribute, Hunter-Stats und Upgrades
 */

import { getHunterById } from '../constants/hunters';
import { GEM_UPGRADE_MAPPING, REVERSE_GEM_UPGRADE_MAPPING } from '../constants/gemUpgradeMappings';

// In-Memory Cache mit LRU (Least Recently Used) System
let memoryCache = {};
let cacheAccessOrder = []; // Tracks access order for LRU
const MAX_CACHE_ENTRIES = 50;

// Speichere eine Liste von ungültigen Cache-Keys
const invalidCacheKeys = {};

/**
 * Manages LRU cache by removing oldest entries when limit is exceeded
 */
function manageCacheSize() {
  if (cacheAccessOrder.length > MAX_CACHE_ENTRIES) {
    // Remove oldest entries
    const entriesToRemove = cacheAccessOrder.length - MAX_CACHE_ENTRIES;
    const keysToRemove = cacheAccessOrder.splice(0, entriesToRemove);
    
    // Remove from memory cache
    keysToRemove.forEach(key => {
      delete memoryCache[key];
    });
    
    console.log(`[Cache] Removed ${entriesToRemove} old cache entries. Current size: ${cacheAccessOrder.length}`);
  }
}

/**
 * Updates access order for LRU management
 * Alle Cache Keys werden als Strings gespeichert für konsistente indexOf() Checks
 */
function updateCacheAccess(cacheKey) {
  // Konvertiere zu String für konsistente Type-Checks
  const keyStr = String(cacheKey);
  
  // Remove from current position if exists
  const existingIndex = cacheAccessOrder.indexOf(keyStr);
  if (existingIndex !== -1) {
    cacheAccessOrder.splice(existingIndex, 1);
  }
  
  // Add to end (most recently used)
  cacheAccessOrder.push(keyStr);
  
  // Manage cache size
  manageCacheSize();
}

/**
 * Generiert einen eindeutigen Hash für einen String
 * @param {string} str - Der zu hashende String
 * @returns {number} Der berechnete Hash
 */
export function stringToHash(str) {
  let hash = 0;
  
  if (!str || str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Konvertiert zu 32bit Integer
  }
  
  return hash;
}

/**
 * Sortiert die Eigenschaften eines Objekts alphabetisch
 * für konsistente JSON-Serialisierung
 * 
 * @param {Object} obj - Das zu sortierende Objekt
 * @returns {Object} Das sortierte Objekt
 */
export function sortObjectProperties(obj) {
  // Null/Undefined direkt zurückgeben
  if (!obj || typeof obj !== 'object') return obj;
  
  // Arrays direkt zurückgeben (nicht konvertieren!)
  if (Array.isArray(obj)) {
    // Rekursiv sortiere Array-Elemente die Objekte sind
    return obj.map(item => sortObjectProperties(item));
  }
  
  // Objekte alphabetisch sortieren
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortObjectProperties(obj[key]);
      return result;
    }, {});
}

/**
 * Extrahiert relevante Upgrade-Parameter aus einem Hunter-Modul
 * 
 * @param {Object} module - Das Hunter-Modul (z.B. borge.js)
 * @returns {string[]} Liste der Upgrade-Parameter
 */
export function extractUpgradeParams(module) {
  if (!module || !module.EVAL_PARAMS) return [];
  
  return module.EVAL_PARAMS.filter(param => 
    typeof param === 'string' && param.startsWith('upgrades.')
  );
}

/**
 * Lädt das Hunter-Modul asynchron
 * 
 * @param {string} hunterId - Die Hunter-ID
 * @returns {Promise<Object>} Das Hunter-Modul
 */
export async function loadHunterModule(hunterId) {
  try {
    const hunter = getHunterById(hunterId);
    if (hunter && hunter.statsModule) {
      const module = await hunter.statsModule();
      return module;
    }
  } catch (error) {
    console.error(`[Cache] Failed to load module for hunter ${hunterId}:`, error);
  }
  return null;
}

/**
 * Holt die aktuellen Werte für relevante Upgrade-Parameter
 * 
 * @param {string[]} upgradeParams - Liste der relevanten Upgrade-Parameter
 * @param {Object} hunterStore - Verweis auf den Hunter Store
 * @returns {Object} Objekt mit aktuellen Upgrade-Werten
 */
export function getCurrentUpgradeValues(upgradeParams, hunterStore) {
  const result = {};
  
  upgradeParams.forEach(fullParam => {
    const parts = fullParam.split('.');
    
    if (parts.length >= 3) {
      const category = parts[1];
      const upgradeId = parts[2];
      
      // Kategorie initialisieren, wenn sie noch nicht existiert
      if (!result[category]) result[category] = {};
      
      // Wert aus dem Store abrufen
      if (hunterStore.upgrades?.[category]?.[upgradeId] !== undefined) {
        result[category][upgradeId] = hunterStore.upgrades[category][upgradeId];
      } else {
        // Standardwert 0, wenn nicht im Store
        result[category][upgradeId] = 0;
      }
    }
  });
  
  return sortObjectProperties(result);
}

/**
 * Generiert einen Cache-Schlüssel für einen Build und seine Parameter
 * 
 * @param {Object} params - Die Parameter für den Cache-Key
 * @param {string} params.hunterId - Hunter-ID
 * @param {Object} params.buildData - Build-Daten (level, talents, attributes, overrides)
 * @param {Object} params.hunterStore - Verweis auf den Hunter Store 
 * @returns {Promise<number>} Der generierte Cache-Schlüssel
 */
/**
 * Generiert einen Cache-Schlüssel für einen Build und seine Parameter
 * 
 * @param {Object} params - Die Parameter für den Cache-Key
 * @param {string} params.hunterId - Hunter-ID
 * @param {Object} params.buildData - Build-Daten (level, talents, attributes, overrides)
 * @param {Object} params.hunterStore - Verweis auf den Hunter Store 
 * @param {Object} params.gemPlannerStore - Verweis auf den Gem Planner Store (optional)
 * @returns {Promise<number>} Der generierte Cache-Schlüssel
 */
export async function generateCacheKey({ hunterId, buildData, hunterStore, gemPlannerStore = null }) {
  try {
    // Hunter-Modul laden
    const module = await loadHunterModule(hunterId);
    if (!module) {
      console.warn(`[Cache] No module found for hunter: ${hunterId}`);
      return Date.now(); // Fallback: immer neu evaluieren
    }
    
    // Upgrade-Parameter aus dem Modul extrahieren
    const upgradeParams = extractUpgradeParams(module);
    
    // Aktuelle Werte für Upgrades holen
    const upgradeValues = getCurrentUpgradeValues(upgradeParams, hunterStore);
    
    // Gem-Parameter aus dem Modul extrahieren
    const gemParams = module.EVAL_PARAMS && module.EVAL_PARAMS.filter(param => 
      typeof param === 'string' && (param.startsWith('gems.') || param.startsWith('upgrades.gems_nodes.'))
    );
    
    // Aktuelle Gem-Werte holen (falls Gem-Parameter vorhanden)
    let gemValues = {};
    if (gemParams && gemParams.length > 0 && gemPlannerStore) {
      
      // Nur relevante Gem-Daten basierend auf den Hunter-spezifischen Parametern einbeziehen
      const gemStates = gemPlannerStore.gemStates || {};
      
      console.log('[EVAL] 🔑 gemPlannerStore.gemStates (RAW):', JSON.stringify(gemStates, null, 2));
      
      for (const param of gemParams) {
        const parts = param.split('.');
        
        // Neues Format: upgrades.gems_nodes.attraction_lootBorge
        if (parts[0] === 'upgrades' && parts[1] === 'gems_nodes' && parts.length >= 3) {
          const gemNodeParam = parts[2]; // z.B. "attraction_lootBorge", "creation_gem1"
          const underscoreIndex = gemNodeParam.indexOf('_');
          
          if (underscoreIndex > 0) {
            const gemType = gemNodeParam.substring(0, underscoreIndex); // attraction, creation, etc.
            const gemProperty = gemNodeParam.substring(underscoreIndex + 1); // lootBorge, gem1, etc.
            
            // Gem-Typ in Result initialisieren
            if (!gemValues[gemType]) gemValues[gemType] = {};
            
            const gemState = gemStates[gemType] || {};
            
            console.log(`[EVAL] 🔑 Reading gem param: ${param}, gemType: ${gemType}, gemProperty: ${gemProperty}`);
            console.log(`[EVAL] 🔑 gemState for ${gemType}:`, JSON.stringify(gemState, null, 2));
            
            // Level
            if (gemProperty === 'level') {
              gemValues[gemType].level = gemState.level || 0;
            }
            // Nodes (gem1, gem2, gem3)
            else if (gemProperty.startsWith('gem')) {
              const nodeIndex = parseInt(gemProperty.replace('gem', '')) - 1;
              if (!gemValues[gemType].nodes) gemValues[gemType].nodes = {};
              const nodes = gemState.nodes || [];
              gemValues[gemType].nodes[gemProperty] = nodes[nodeIndex] || false;
            }
            // Upgrades (lootBorge, catchUp, etc.)
            else {
              const upgrades = gemState.upgrades || {};
              
              // Map die Parameter-Namen (upgrades.gems_nodes format) zu Store-Namen (gemPlannerStore format)
              // z.B. 'lootBorge' -> 'borge-loot-bonus'
              const paramKey = `${gemType}_${gemProperty}`; // z.B. 'attraction_lootBorge'
              const storeUpgradeKey = REVERSE_GEM_UPGRADE_MAPPING[paramKey] || gemProperty;
              console.log(`[EVAL] 🔑 Looking for upgrade: ${gemProperty}, paramKey: ${paramKey}, mapped to: ${storeUpgradeKey}`);
              console.log(`[EVAL] 🔑 Available upgrades:`, Object.keys(upgrades));
              console.log(`[EVAL] 🔑 Value for ${storeUpgradeKey}:`, upgrades[storeUpgradeKey]);
              
              if (!gemValues[gemType].upgrades) gemValues[gemType].upgrades = {};
              gemValues[gemType].upgrades[gemProperty] = upgrades[storeUpgradeKey] || 0;
            }
          }
        }
        // Altes Format: gems.attraction.upgrades.lootBorge (für Rückwärtskompatibilität)
        else if (parts.length >= 3 && parts[0] === 'gems') {
          const gemType = parts[1]; // attraction, creation, innovation
          const category = parts[2]; // level, nodes, upgrades
          
          // Gem-Typ in Result initialisieren
          if (!gemValues[gemType]) gemValues[gemType] = {};
          
          if (category === 'level') {
            // Gem Level einbeziehen
            gemValues[gemType].level = gemStates[gemType]?.level || 0;
          } else if (category === 'nodes' && parts.length >= 4) {
            // Spezifische Gem Node einbeziehen
            const nodeId = parts[3];
            if (!gemValues[gemType].nodes) gemValues[gemType].nodes = {};
            gemValues[gemType].nodes[nodeId] = gemStates[gemType]?.nodes?.[nodeId] || 0;
          } else if (category === 'upgrades' && parts.length >= 4) {
            // Spezifisches Gem Upgrade einbeziehen
            const upgradeId = parts[3];
            if (!gemValues[gemType].upgrades) gemValues[gemType].upgrades = {};
            gemValues[gemType].upgrades[upgradeId] = gemStates[gemType]?.upgrades?.[upgradeId] || 0;
          }
        }
      }
      
      gemValues = sortObjectProperties(gemValues);
    }
    
    // Hole effektive Overrides (Category + Build) wenn buildData eine ID hat
    let effectiveOverrides = buildData.overrides || {};
    
    if (buildData.id && hunterStore.getEffectiveBuildOverrides) {
      effectiveOverrides = hunterStore.getEffectiveBuildOverrides(hunterId, buildData.id);
    }
    
    // Relevante Build-Daten extrahieren
    const relevantBuildData = {
      level: buildData.level || 0,
      talents: sortObjectProperties(buildData.talents || {}),
      attributes: sortObjectProperties(buildData.attributes || {}),
      overrides: sortObjectProperties(effectiveOverrides)
    };
    
    // Relevante Store-Daten extrahieren
    const relevantStoreData = {
      iterations: hunterStore.hunterIterations?.[hunterId] || 1000,
      hunterStats: sortObjectProperties(hunterStore.hunterStats?.[hunterId] || {})
    };
    
    // Alle relevanten Daten zum Hashing zusammenfassen
    const dataToHash = {
      hunterId,
      buildData: relevantBuildData,
      storeData: relevantStoreData,
      upgrades: upgradeValues, // Upgrade-Werte
      gems: gemValues // Gem-Werte
      // categoryId und categoryHierarchy NICHT mehr im Cache-Key!
      // Die Category-Overrides sind bereits in effectiveOverrides enthalten
    };
    
    // Hash des JSON-Strings als Cache-Key
    const jsonStr = JSON.stringify(dataToHash);
    const hash = stringToHash(jsonStr);
    
    console.log(`[EVAL] 🔑 Cache key generated for ${hunterId}:`, hash);
    console.log(`[EVAL] 🔑 Gem values in cache key:`, JSON.stringify(gemValues, null, 2));
    
    return hash;
  } catch (error) {
    console.error("[Cache] Error generating cache key:", error);
    return Date.now(); // Fallback: immer neu evaluieren
  }
}

/**
 * Vereinfacht ein Ergebnis für die Speicherung im LocalStorage
 * 
 * @param {Object} result - Das vollständige Ergebnis
 * @returns {Object} Das vereinfachte Ergebnis
 */
export function simplifyResultForStorage(result) {
  if (!result) return null;
  
  try {
    // Tiefe Kopie des Ergebnisses erstellen
    const simplifiedResult = JSON.parse(JSON.stringify(result));
    
    // Große Arrays reduzieren
    if (simplifiedResult.rawData && simplifiedResult.rawData.length > 50) {
      simplifiedResult.rawData = simplifiedResult.rawData.slice(0, 50);
    }
    
    // Stage-Verteilung reduzieren
    if (simplifiedResult.stageDistribution && simplifiedResult.stageDistribution.length > 50) {
      const skip = Math.ceil(simplifiedResult.stageDistribution.length / 50);
      const reduced = [];
      
      for (let i = 0; i < simplifiedResult.stageDistribution.length; i += skip) {
        reduced.push(simplifiedResult.stageDistribution[i]);
      }
      
      simplifiedResult.stageDistribution = reduced;
    }

    if (!simplifiedResult.sampleSize && result.bossKillsByRevive?.length > 0) {
      // Berechne Sample Size aus den Boss Kill Rate Daten
      const totalAttempts = result.bossKillsByRevive.reduce((sum, item) => sum + item.attempts, 0);
      simplifiedResult.sampleSize = totalAttempts;
    }
    
    return simplifiedResult;
  } catch (error) {
    console.warn("[Cache] Error simplifying result for storage:", error);
    return result;
  }
}

/**
 * Prüft, ob ein Build neu evaluiert werden muss oder aus dem Cache verwendet werden kann
 * 
 * @param {Object} params - Parameter für die Prüfung
 * @param {string} params.hunterId - Hunter-ID
 * @param {Object} params.buildData - Build-Daten
 * @param {Object} params.hunterStore - Verweis auf den Hunter Store
 * @param {Object} params.gemPlannerStore - Verweis auf den Gem Planner Store
 * @returns {Promise<{shouldEvaluate: boolean, cachedResult: Object|null, cacheKey: number}>} 
 */
export async function shouldEvaluate({ hunterId, buildData, hunterStore, gemPlannerStore = null }) {
  try {
    // Generiere den Cache-Schlüssel
    const cacheKey = await generateCacheKey({ hunterId, buildData, hunterStore, gemPlannerStore });
    
    // Prüfe, ob der Key als ungültig markiert wurde
    if (invalidCacheKeys[hunterId] && invalidCacheKeys[hunterId].has(cacheKey)) {
      return {
        shouldEvaluate: true,
        cachedResult: null,
        cacheKey
      };
    }
    
    // Prüfe den In-Memory-Cache
    if (memoryCache[cacheKey]) {
      // Update access order for LRU
      updateCacheAccess(cacheKey);
      
      return { 
        shouldEvaluate: false, 
        cachedResult: memoryCache[cacheKey],
        cacheKey 
      };
    }
    
    // Prüfe den Store-Cache
    if (hunterStore.evaluationCache && 
        hunterStore.evaluationCache[hunterId] && 
        hunterStore.evaluationCache[hunterId][cacheKey]) {
      
      const cachedResult = hunterStore.evaluationCache[hunterId][cacheKey];
      
      // Auch in In-Memory-Cache speichern und Access Order aktualisieren
      memoryCache[cacheKey] = cachedResult;
      updateCacheAccess(cacheKey);
      
      return { 
        shouldEvaluate: false, 
        cachedResult,
        cacheKey 
      };
    }
    
    // Optional: Prüfe localStorage
    try {
      const storageKey = `huntersim_cache_${hunterId}_${cacheKey}`;
      const cachedData = localStorage.getItem(storageKey);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        const cacheAge = Date.now() - (parsedData.timestamp || 0);
        const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 Stunden
        
        if (cacheAge < MAX_CACHE_AGE) {
          // In Memory-Cache speichern und Access Order aktualisieren
          memoryCache[cacheKey] = parsedData.result;
          updateCacheAccess(cacheKey);
          
          // Optional: In Store-Cache speichern
          if (hunterStore.cacheEvaluationResult) {
            hunterStore.cacheEvaluationResult(hunterId, cacheKey, parsedData.result);
          }
          
          return { 
            shouldEvaluate: false, 
            cachedResult: parsedData.result,
            cacheKey 
          };
        }
      }
    } catch (err) {
      console.warn('[Cache] Error accessing localStorage:', err);
    }
    
    // Keine Cache-Treffer gefunden
    return { 
      shouldEvaluate: true,
      cachedResult: null,
      cacheKey 
    };
  } catch (error) {
    console.error('[Cache] Error checking cache:', error);
    return { 
      shouldEvaluate: true,
      cachedResult: null,
      cacheKey: Date.now() 
    };
  }
}

/**
 * Speichert ein Evaluierungsergebnis im Cache
 * 
 * @param {Object} params - Parameter für die Speicherung
 * @param {string} params.hunterId - Hunter-ID
 * @param {Object} params.buildData - Build-Daten
 * @param {Object} params.hunterStore - Verweis auf den Hunter Store
 * @param {Object} params.gemPlannerStore - Verweis auf den Gem Planner Store
 * @param {number} params.cacheKey - Bereits generierter Cache-Key (optional)
 * @param {Object} params.result - Das zu speichernde Ergebnis
 * @returns {Promise<void>}
 */
export async function cacheResult({ hunterId, buildData, hunterStore, gemPlannerStore = null, result, cacheKey = null }) {
  if (!result) return;
  
  try {
    // Cache-Key generieren, wenn nicht vorhanden
    const key = cacheKey || await generateCacheKey({ hunterId, buildData, hunterStore, gemPlannerStore });
    
    // NEU: Sample Size sicherstellen BEVOR wir cachen
    if (!result.sampleSize) {
      const sampleSize = hunterStore.hunterIterations?.[hunterId] || 1000;
      result.sampleSize = sampleSize;
    }
    
    // NEU: Build-ID zum Ergebnis hinzufügen für korrekte Zuordnung
    if (buildData?.id && !result.buildId) {
      result.buildId = buildData.id;
    }
    
    // In Memory-Cache speichern und Access Order aktualisieren
    memoryCache[key] = result;
    updateCacheAccess(key);
    
    // Im Store-Cache speichern
    if (hunterStore.cacheEvaluationResult) {
      hunterStore.cacheEvaluationResult(hunterId, key, result);
    }
    
    // Boss Kill Rate Caching
    if (result.bossKillsByRevive?.length > 0 && buildData?.id) {
      const sampleSize = result.sampleSize; // Verwende die sampleSize aus result
      
      hunterStore.cacheBossKillsByRevive(hunterId, buildData.id, result.bossKillsByRevive, sampleSize);
    }
    
    // Im localStorage speichern
    try {
      const simplifiedResult = simplifyResultForStorage(result);
      const storageKey = `huntersim_cache_${hunterId}_${key}`;
      
      localStorage.setItem(storageKey, JSON.stringify({
        timestamp: Date.now(),
        result: simplifiedResult,
        buildId: buildData?.id // NEU: Build-ID auch in localStorage speichern
      }));
    } catch (e) {
      console.warn('[Cache] Could not save to localStorage:', e);
    }
    
    // WICHTIG: Wenn der Cache-Key erfolgreich gespeichert wurde,
    // entferne ihn aus der Invalid-Liste (falls vorhanden)
    if (invalidCacheKeys[hunterId] && invalidCacheKeys[hunterId].has(key)) {
      invalidCacheKeys[hunterId].delete(key);
    }
    
  } catch (error) {
    console.error('[Cache] Error saving to cache:', error);
  }
}

/**
 * Löscht einen Cache-Eintrag für einen bestimmten Build
 * 
 * @param {Object} params - Parameter für das Löschen
 * @param {string} params.hunterId - Hunter-ID
 * @param {Object} params.buildData - Build-Daten
 * @param {Object} params.hunterStore - Verweis auf den Hunter Store
 * @param {Object} params.gemPlannerStore - Verweis auf den Gem Planner Store
 * @returns {Promise<void>}
 */
export async function invalidateCache({ hunterId, buildData, hunterStore, gemPlannerStore = null }) {
  try {
    const cacheKey = await generateCacheKey({ hunterId, buildData, hunterStore, gemPlannerStore });
    
    // Konvertiere zu String für konsistente Type-Checks
    const keyStr = String(cacheKey);
    
    // Aus Memory-Cache löschen
    if (memoryCache[keyStr]) {
      delete memoryCache[keyStr];
      
      // Auch aus Access Order entfernen
      const accessIndex = cacheAccessOrder.indexOf(keyStr);
      if (accessIndex !== -1) {
        cacheAccessOrder.splice(accessIndex, 1);
      }
    }
    
    // Aus Store-Cache löschen
    if (hunterStore.evaluationCache && 
        hunterStore.evaluationCache[hunterId] && 
        hunterStore.evaluationCache[hunterId][keyStr]) {
      delete hunterStore.evaluationCache[hunterId][keyStr];
    }
    
    // Aus localStorage löschen
    try {
      const storageKey = `huntersim_cache_${hunterId}_${keyStr}`;
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('[Cache] Could not remove from localStorage:', e);
    }
    
  } catch (error) {
    console.error('[Cache] Error invalidating cache:', error);
  }
}

/**
 * Löscht einen bestimmten Cache-Eintrag für einen Hunter
 * 
 * @param {string} hunterId - Die ID des Hunters
 * @param {string|number} cacheKey - Der Cache-Schlüssel
 * @returns {Promise<boolean>} - True, wenn der Cache gelöscht wurde
 */
export async function clearCache(hunterId, cacheKey) {
  try {
    if (!cacheKey) {
      console.warn(`Cannot clear cache: No cacheKey provided for hunter ${hunterId}`);
      return false;
    }
    
    // Konvertiere zu String für konsistente Type-Checks
    const keyStr = String(cacheKey);
    
    // In-Memory-Cache löschen (direkt nach Schlüssel)
    if (memoryCache[keyStr]) {
      delete memoryCache[keyStr];
      
      // Auch aus Access Order entfernen
      const accessIndex = cacheAccessOrder.indexOf(keyStr);
      if (accessIndex !== -1) {
        cacheAccessOrder.splice(accessIndex, 1);
      }
    }
    
    // Auch im hunter-spezifischen Memory-Cache nachsehen
    if (memoryCache[hunterId] && memoryCache[hunterId][keyStr]) {
      delete memoryCache[hunterId][keyStr];
    }
    
    // LocalStorage-Cache löschen
    try {
      const localStorageKey = `huntersim_cache_${hunterId}_${keyStr}`;
      localStorage.removeItem(localStorageKey);
    } catch (e) {
      console.warn('[Cache] Error clearing localStorage cache:', e);
    }
    
    return true;
  } catch (error) {
    console.error('[Cache] Error clearing cache:', error);
    return false;
  }
}

/**
 * Löscht alle Cache-Einträge für einen Hunter
 * 
 * @param {string} hunterId - Die ID des Hunters
 * @returns {Promise<boolean>} - True, wenn der Cache gelöscht wurde
 */
export async function clearAllCacheForHunter(hunterId) {
  try {
    // In-Memory-Cache löschen
    if (memoryCache[hunterId]) {
      delete memoryCache[hunterId];
    }
    
    // LocalStorage-Cache löschen
    try {
      // Alle localStorage-Keys finden, die mit dem Hunter-Präfix beginnen
      const keysToRemove = [];
      const prefix = `huntersim_cache_${hunterId}_`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      
      // Alle gefundenen Keys löschen
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
    } catch (e) {
      console.warn('Error clearing localStorage cache:', e);
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing all cache for hunter:', error);
    return false;
  }
}

/**
 * Löscht den gesamten Cache
 * 
 * @param {Object} hunterStore - Verweis auf den Hunter Store
 * @returns {void}
 */
export function clearAllCache(hunterStore) {
  // Memory-Cache leeren
  memoryCache = {};
  cacheAccessOrder = []; // Access Order auch zurücksetzen
  
  // Store-Cache leeren, wenn möglich
  if (hunterStore.clearEvaluationCache) {
    hunterStore.clearEvaluationCache();
  }
  
  // LocalStorage-Cache leeren
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('huntersim_cache_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.warn('[Cache] Could not clear localStorage:', e);
  }
  
}

/**
 * Invalidiert einen bestimmten Cache-Key, sodass er nicht mehr im Cache gefunden wird
 * 
 * @param {string} hunterId - Die ID des Hunters
 * @param {string|number} cacheKey - Der Cache-Schlüssel der invalidiert werden soll
 * @returns {Promise<boolean>} - True, wenn erfolgreich
 */
export async function invalidateCacheKey(hunterId, cacheKey) {
  try {
    if (!hunterId || !cacheKey) return false;
    
    // Füge den Cache-Key zur Liste der ungültigen Keys hinzu
    if (!invalidCacheKeys[hunterId]) {
      invalidCacheKeys[hunterId] = new Set();
    }
    invalidCacheKeys[hunterId].add(cacheKey);
    
    // Cleanup: Wenn zu viele ungültige Keys, automatisch alte entfernen
    cleanupInvalidCacheKeys(hunterId);
    
    return true;
  } catch (error) {
    console.error('Error invalidating cache key:', error);
    return false;
  }
}

/**
 * Bereinigt die Liste der ungültigen Cache-Keys für einen Hunter
 * Entfernt Keys die älter als 1 Stunde sind oder wenn mehr als 100 Keys vorhanden sind
 * 
 * @param {string} hunterId - Die ID des Hunters
 */
function cleanupInvalidCacheKeys(hunterId) {
  if (!invalidCacheKeys[hunterId]) return;
  
  const maxInvalidKeys = 100;
  const currentSize = invalidCacheKeys[hunterId].size;
  
  // Wenn zu viele Keys, lösche die ältesten (FIFO)
  if (currentSize > maxInvalidKeys) {
    const keysToRemove = currentSize - maxInvalidKeys;
    const keysArray = Array.from(invalidCacheKeys[hunterId]);
    
    // Entferne die ersten N Keys (älteste)
    for (let i = 0; i < keysToRemove; i++) {
      invalidCacheKeys[hunterId].delete(keysArray[i]);
    }
    
    console.log(`[Cache] Cleaned up ${keysToRemove} old invalid cache keys for ${hunterId}`);
  }
}

/**
 * Löscht alle ungültigen Cache-Keys für einen Hunter
 * 
 * @param {string} hunterId - Die ID des Hunters
 */
export function clearInvalidCacheKeys(hunterId) {
  if (invalidCacheKeys[hunterId]) {
    invalidCacheKeys[hunterId].clear();
  }
}

/**
 * Prüft ob sich Upgrade-Werte geändert haben und eine Re-Evaluation notwendig ist
 * Diese Funktion wird von den Watch-Systemen verwendet
 * 
 * @param {string} hunterId - Die ID des Hunters
 * @param {Object} oldUpgrades - Die alten Upgrade-Werte
 * @param {Object} newUpgrades - Die neuen Upgrade-Werte  
 * @param {Object} hunterStore - Verweis auf den Hunter Store
 * @returns {Promise<boolean>} - True, wenn eine Re-Evaluation notwendig ist
 */
export async function shouldUpdateOnUpgradesChange(hunterId, oldUpgrades, newUpgrades, hunterStore) {
  try {
    // Wenn keine alten Werte vorhanden sind, keine Re-Evaluation notwendig
    if (!oldUpgrades) return false;
    
    // Hunter-Modul laden um relevante Parameter zu bekommen
    const module = await loadHunterModule(hunterId);
    if (!module) return false;
    
    // Relevante Upgrade-Parameter extrahieren
    const upgradeParams = extractUpgradeParams(module);
    if (upgradeParams.length === 0) return false;
    
    // Prüfen ob sich relevante Upgrade-Werte geändert haben
    for (const fullParam of upgradeParams) {
      const parts = fullParam.split('.');
      if (parts.length >= 3) {
        const category = parts[1];
        const upgradeId = parts[2];
        
        const oldValue = oldUpgrades?.[category]?.[upgradeId] || 0;
        const newValue = newUpgrades?.[category]?.[upgradeId] || 0;
        
        if (oldValue !== newValue) {
          console.log(`🔧 Relevant upgrade changed: ${category}.${upgradeId} (${oldValue} -> ${newValue})`);
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('[Cache] Error checking upgrade changes:', error);
    return true; // Im Fehlerfall Re-Evaluation auslösen
  }
}

/**
 * Prüft ob sich Gem-Werte geändert haben und eine Re-Evaluation notwendig ist
 * Diese Funktion wird von den Watch-Systemen verwendet
 * 
 * @param {string} hunterId - Die ID des Hunters
 * @param {Object} oldGemStates - Die alten Gem-Werte
 * @param {Object} newGemStates - Die neuen Gem-Werte
 * @param {Object} hunterStore - Verweis auf den Hunter Store
 * @returns {Promise<boolean>} - True, wenn eine Re-Evaluation notwendig ist
 */
export async function shouldUpdateOnGemChange(hunterId, oldGemStates, newGemStates, hunterStore) {
  console.log(`💎 === STARTING shouldUpdateOnGemChange for ${hunterId} ===`);
  console.log(`💎 oldGemStates:`, oldGemStates);
  console.log(`💎 newGemStates:`, newGemStates);
  
  try {
    // Hunter-Modul laden um relevante Parameter zu bekommen
    const module = await loadHunterModule(hunterId);
    if (!module) {
      console.log(`💎 No module found for hunter ${hunterId}`);
      return false;
    }
    
    // Prüfen ob das Hunter-Modul Gem-Parameter verwendet
    const gemParams = module.EVAL_PARAMS && module.EVAL_PARAMS.filter(param => 
      typeof param === 'string' && (param.startsWith('gems.') || param.startsWith('upgrades.gems_nodes.'))
    );
    
    if (!gemParams || gemParams.length === 0) {
      console.log(`💎 No gem parameters found for hunter ${hunterId}`);
      return false;
    }
    
    console.log(`💎 Found ${gemParams.length} gem parameters for ${hunterId}:`, gemParams);
    
    // Wenn keine alten Werte vorhanden sind, prüfen ob die aktuellen Gem-Werte nicht leer sind
    // Das passiert beim ersten Laden der Seite - wenn Gems bereits gesetzt sind, evaluieren
    if (!oldGemStates) {
      console.log(`💎 No old gem states - checking if current gems have values for ${hunterId}`);
      
      // Prüfe ob irgendwelche relevanten Gem-Werte > 0 sind
      for (const param of gemParams) {
        const parts = param.split('.');
        
        // Neues Format: upgrades.gems_nodes.attraction_lootBorge
        if (parts[0] === 'upgrades' && parts[1] === 'gems_nodes' && parts.length >= 3) {
          const gemNodeParam = parts[2]; // z.B. "attraction_lootBorge", "creation_gem1"
          const underscoreIndex = gemNodeParam.indexOf('_');
          
          if (underscoreIndex > 0) {
            const gemType = gemNodeParam.substring(0, underscoreIndex); // attraction, creation, etc.
            const gemProperty = gemNodeParam.substring(underscoreIndex + 1); // lootBorge, gem1, etc.
            
            const currentGemState = newGemStates?.[gemType] || {};
            
            // Level check
            if (gemProperty === 'level') {
              const currentLevel = currentGemState.level || 0;
              if (currentLevel > 0) {
                console.log(`💎 Found gem level ${currentLevel} for ${gemType} - triggering evaluation`);
                return true;
              }
            }
            // Node check (gem1, gem2, gem3)
            else if (gemProperty.startsWith('gem')) {
              const nodeIndex = parseInt(gemProperty.replace('gem', '')) - 1;
              const currentNodes = currentGemState.nodes || [];
              const currentNodeValue = currentNodes[nodeIndex] || false;
              
              if (currentNodeValue) {
                console.log(`💎 Found gem node ${gemProperty} = ${currentNodeValue} for ${gemType} - triggering evaluation`);
                return true;
              }
            }
            // Upgrade check (lootBorge, catchUp, etc.)
            else {
              const currentUpgrades = currentGemState.upgrades || {};
              
              // Map die Parameter-Namen auf die Store-Namen
              const storeUpgradeKey = GEM_UPGRADE_MAPPING[gemProperty] || gemProperty;
              const currentUpgradeValue = currentUpgrades[storeUpgradeKey] || 0;
              
              if (currentUpgradeValue > 0) {
                console.log(`💎 Found gem upgrade ${gemProperty} (${storeUpgradeKey}) = ${currentUpgradeValue} for ${gemType} - triggering evaluation`);
                return true;
              }
            }
          }
        }
        // Altes Format: gems.attraction.upgrades.lootBorge (für Rückwärtskompatibilität)
        else if (parts.length >= 3 && parts[0] === 'gems') {
          const gemType = parts[1]; // attraction, creation, innovation
          const category = parts[2]; // level, nodes, upgrades
          
          const currentGemState = newGemStates?.[gemType] || {};
          
          if (category === 'level') {
            const currentLevel = currentGemState.level || 0;
            if (currentLevel > 0) {
              console.log(`💎 Found gem level ${currentLevel} for ${gemType} - triggering evaluation`);
              return true;
            }
          } else if (category === 'nodes' && parts.length >= 4) {
            const nodeId = parts[3];
            const currentNodes = currentGemState.nodes || {};
            
            let currentNodeValue;
            if (nodeId.startsWith('gem')) {
              const nodeIndex = parseInt(nodeId.replace('gem', '')) - 1;
              currentNodeValue = currentNodes[nodeIndex] || false;
            } else {
              currentNodeValue = currentNodes[nodeId] || false;
            }
            
            if (currentNodeValue) {
              console.log(`💎 Found gem node ${nodeId} = ${currentNodeValue} for ${gemType} - triggering evaluation`);
              return true;
            }
          } else if (category === 'upgrades' && parts.length >= 4) {
            const upgradeId = parts[3];
            const currentUpgrades = currentGemState.upgrades || {};
            const currentUpgradeValue = currentUpgrades[upgradeId] || 0;
            
            if (currentUpgradeValue > 0) {
              console.log(`💎 Found gem upgrade ${upgradeId} = ${currentUpgradeValue} for ${gemType} - triggering evaluation`);
              return true;
            }
          }
        }
      }
      
      console.log(`💎 No relevant gem values found for ${hunterId} - no evaluation needed`);
      return false;
    }
    
    // Normale Vergleichslogik wenn alte Werte vorhanden sind
    console.log(`💎 Old gem states:`, oldGemStates);
    console.log(`💎 New gem states:`, newGemStates);
    
    // Parse die relevanten Gem-Parameter um zu erfahren, welche spezifischen Werte zu prüfen sind
    const relevantGemChecks = new Set();
    
    for (const param of gemParams) {
      // Beispiel: "gems.attraction.level" -> prüfe attraction.level
      // Beispiel: "gems.creation.nodes.gem1" -> prüfe creation.nodes.gem1
      // Beispiel: "gems.attraction.upgrades.catchUp" -> prüfe attraction.upgrades.catchUp
      
      const parts = param.split('.');
      if (parts.length >= 3) {
        const gemType = parts[1]; // attraction, creation, innovation
        const category = parts[2]; // level, nodes, upgrades
        
        if (category === 'level') {
          relevantGemChecks.add(`${gemType}.level`);
        } else if (category === 'nodes' && parts.length >= 4) {
          const nodeId = parts[3]; // gem1, gem2, gem3, etc.
          relevantGemChecks.add(`${gemType}.nodes.${nodeId}`);
        } else if (category === 'upgrades' && parts.length >= 4) {
          const upgradeId = parts[3]; // catchUp, lootBorge, etc.
          relevantGemChecks.add(`${gemType}.upgrades.${upgradeId}`);
        }
      }
    }
    
    console.log(`💎 Relevant gem checks for ${hunterId}:`, Array.from(relevantGemChecks));
    
    // Prüfe nur die relevanten Gem-Parameter
    for (const checkPath of relevantGemChecks) {
      const pathParts = checkPath.split('.');
      const gemType = pathParts[0]; // attraction, creation, innovation
      
      const oldGemState = oldGemStates?.[gemType] || {};
      const newGemState = newGemStates?.[gemType] || {};
      
      console.log(`💎 Checking ${checkPath}: old=${JSON.stringify(oldGemState)}, new=${JSON.stringify(newGemState)}`);
      
      if (pathParts[1] === 'level') {
        // Prüfe Gem Level: gems.attraction.level
        const oldLevel = oldGemState.level || 0;
        const newLevel = newGemState.level || 0;
        
        console.log(`💎 Comparing level for ${gemType}: ${oldLevel} vs ${newLevel}`);
        
        if (oldLevel !== newLevel) {
          console.log(`💎 Relevant gem level changed: ${checkPath} (${oldLevel} -> ${newLevel})`);
          return true;
        }
      } else if (pathParts[1] === 'nodes' && pathParts.length >= 3) {
        // Prüfe Gem Node: gems.creation.nodes.gem1
        const nodeId = pathParts[2];
        const oldNodes = oldGemState.nodes || {};
        const newNodes = newGemState.nodes || {};
        
        // Nodes sind boolean oder können als index-basierte Arrays gespeichert sein
        // Prüfe beide Möglichkeiten: nodes[nodeId] oder nodes[nodeIndex]
        let oldNodeValue, newNodeValue;
        
        if (nodeId.startsWith('gem')) {
          // gem1, gem2, gem3 -> Index 0, 1, 2
          const nodeIndex = parseInt(nodeId.replace('gem', '')) - 1;
          oldNodeValue = oldNodes[nodeIndex] || false;
          newNodeValue = newNodes[nodeIndex] || false;
        } else {
          oldNodeValue = oldNodes[nodeId] || false;
          newNodeValue = newNodes[nodeId] || false;
        }
        
        console.log(`💎 Comparing node ${nodeId} for ${gemType}: ${oldNodeValue} vs ${newNodeValue}`);
        
        if (oldNodeValue !== newNodeValue) {
          console.log(`💎 Relevant gem node changed: ${checkPath} (${oldNodeValue} -> ${newNodeValue})`);
          return true;
        }
      } else if (pathParts[1] === 'upgrades' && pathParts.length >= 3) {
        // Prüfe Gem Upgrade: gems.attraction.upgrades.catchUp
        const upgradeId = pathParts[2];
        const oldUpgrades = oldGemState.upgrades || {};
        const newUpgrades = newGemState.upgrades || {};
        
        const oldUpgradeValue = oldUpgrades[upgradeId] || 0;
        const newUpgradeValue = newUpgrades[upgradeId] || 0;
        
        console.log(`💎 Comparing upgrade ${upgradeId} for ${gemType}: ${oldUpgradeValue} vs ${newUpgradeValue}`);
        
        if (oldUpgradeValue !== newUpgradeValue) {
          console.log(`💎 Relevant gem upgrade changed: ${checkPath} (${oldUpgradeValue} -> ${newUpgradeValue})`);
          return true;
        }
      }
    }
    
    console.log(`💎 No relevant gem changes detected for ${hunterId}`);
    return false;
  } catch (error) {
    console.error('[Cache] Error checking gem changes:', error);
    return true; // Im Fehlerfall Re-Evaluation auslösen
  }
}