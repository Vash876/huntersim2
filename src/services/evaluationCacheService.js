/**
 * Evaluierung Cache Service
 * 
 * Bietet Funktionen zum Caching und Abrufen von Build-Evaluierungsergebnissen
 * Berücksichtigt Build-Attribute, Hunter-Stats und Upgrades
 */

import { getHunterById } from '../constants/hunters';

// In-Memory Cache
let memoryCache = {};

// Speichere eine Liste von ungültigen Cache-Keys
const invalidCacheKeys = {};

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
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = typeof obj[key] === 'object' && obj[key] !== null 
        ? sortObjectProperties(obj[key]) 
        : obj[key];
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
      console.log(`[Cache] Loaded module for hunter: ${hunterId}`);
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
export async function generateCacheKey({ hunterId, buildData, hunterStore }) {
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
    
    // Relevante Build-Daten extrahieren
    const relevantBuildData = {
      level: buildData.level || 0,
      talents: sortObjectProperties(buildData.talents || {}),
      attributes: sortObjectProperties(buildData.attributes || {}),
      overrides: sortObjectProperties(buildData.overrides || {})
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
      upgrades: upgradeValues // Explizit die Upgrade-Werte einbeziehen
    };
    
    // Hash des JSON-Strings als Cache-Key
    const jsonStr = JSON.stringify(dataToHash);
    const hash = stringToHash(jsonStr);
    
    // Debug-Log
    console.log(`[Cache] Generated cache key for ${buildData.name || 'unnamed'}: ${hash}`);
    
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
 * @returns {Promise<{shouldEvaluate: boolean, cachedResult: Object|null, cacheKey: number}>} 
 */
export async function shouldEvaluate({ hunterId, buildData, hunterStore }) {
  try {
    // Generiere den Cache-Schlüssel
    const cacheKey = await generateCacheKey({ hunterId, buildData, hunterStore });
    
    // Debug-Log
    console.log(`[Cache] Checking if build '${buildData.name || 'unnamed'}' needs evaluation. Key: ${cacheKey}`);
    
    // Prüfe, ob der Key als ungültig markiert wurde
    if (invalidCacheKeys[hunterId] && invalidCacheKeys[hunterId].has(cacheKey)) {
      console.log(`Cache key ${cacheKey} was invalidated, forcing evaluation`);
      return {
        shouldEvaluate: true,
        cachedResult: null,
        cacheKey
      };
    }
    
    // Prüfe den In-Memory-Cache
    if (memoryCache[cacheKey]) {
      console.log(`[Cache] Found result in memory cache for build '${buildData.name || 'unnamed'}'`);
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
      console.log(`[Cache] Found result in store cache for build '${buildData.name || 'unnamed'}'`);
      
      // Auch in In-Memory-Cache speichern
      memoryCache[cacheKey] = cachedResult;
      
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
          console.log(`[Cache] Found result in localStorage for build '${buildData.name || 'unnamed'}'`);
          
          // In Memory-Cache speichern
          memoryCache[cacheKey] = parsedData.result;
          
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
 * @param {number} params.cacheKey - Bereits generierter Cache-Key (optional)
 * @param {Object} params.result - Das zu speichernde Ergebnis
 * @returns {Promise<void>}
 */
export async function cacheResult({ hunterId, buildData, hunterStore, result, cacheKey = null }) {
  if (!result) return;
  
  try {
    // Cache-Key generieren, wenn nicht vorhanden
    const key = cacheKey || await generateCacheKey({ hunterId, buildData, hunterStore });
    
    // In Memory-Cache speichern
    memoryCache[key] = result;
    
    // Im Store-Cache speichern
    if (hunterStore.cacheEvaluationResult) {
      hunterStore.cacheEvaluationResult(hunterId, key, result);
    }
    
    // Im localStorage speichern
    try {
      const simplifiedResult = simplifyResultForStorage(result);
      const storageKey = `huntersim_cache_${hunterId}_${key}`;
      
      localStorage.setItem(storageKey, JSON.stringify({
        timestamp: Date.now(),
        result: simplifiedResult
      }));
    } catch (e) {
      console.warn('[Cache] Could not save to localStorage:', e);
    }
    
    console.log(`[Cache] Stored result for build '${buildData.name || 'unnamed'}'. Key: ${key}`);
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
 * @returns {Promise<void>}
 */
export async function invalidateCache({ hunterId, buildData, hunterStore }) {
  try {
    const cacheKey = await generateCacheKey({ hunterId, buildData, hunterStore });
    
    // Aus Memory-Cache löschen
    if (memoryCache[cacheKey]) {
      delete memoryCache[cacheKey];
    }
    
    // Aus Store-Cache löschen
    if (hunterStore.evaluationCache && 
        hunterStore.evaluationCache[hunterId] && 
        hunterStore.evaluationCache[hunterId][cacheKey]) {
      delete hunterStore.evaluationCache[hunterId][cacheKey];
    }
    
    // Aus localStorage löschen
    try {
      const storageKey = `huntersim_cache_${hunterId}_${cacheKey}`;
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('[Cache] Could not remove from localStorage:', e);
    }
    
    console.log(`[Cache] Invalidated cache for build '${buildData.name || 'unnamed'}'`);
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
    
    console.log(`[Cache] Clearing cache for hunter ${hunterId} with key ${cacheKey}`);
    
    // In-Memory-Cache löschen (direkt nach Schlüssel)
    if (memoryCache[cacheKey]) {
      delete memoryCache[cacheKey];
      console.log(`[Cache] Cleared in-memory cache for key ${cacheKey}`);
    }
    
    // Auch im hunter-spezifischen Memory-Cache nachsehen
    if (memoryCache[hunterId] && memoryCache[hunterId][cacheKey]) {
      delete memoryCache[hunterId][cacheKey];
      console.log(`[Cache] Cleared hunter-specific memory cache for ${hunterId}:${cacheKey}`);
    }
    
    // LocalStorage-Cache löschen
    try {
      const localStorageKey = `huntersim_cache_${hunterId}_${cacheKey}`;
      localStorage.removeItem(localStorageKey);
      console.log(`[Cache] Cleared localStorage cache for ${hunterId}:${cacheKey}`);
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
    console.log(`Clearing all cache for hunter ${hunterId}`);
    
    // In-Memory-Cache löschen
    if (memoryCache[hunterId]) {
      delete memoryCache[hunterId];
      console.log(`Cleared all in-memory cache for ${hunterId}`);
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
      
      console.log(`Cleared ${keysToRemove.length} localStorage cache entries for ${hunterId}`);
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
  
  console.log('[Cache] All caches cleared');
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
    
    console.log(`Invalidated cache key ${cacheKey} for hunter ${hunterId}`);
    return true;
  } catch (error) {
    console.error('Error invalidating cache key:', error);
    return false;
  }
}