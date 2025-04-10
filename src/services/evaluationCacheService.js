/**
 * Evaluierung Cache Service
 * 
 * Bietet Funktionen zum Caching und Abrufen von Build-Evaluierungsergebnissen
 * Berücksichtigt Build-Attribute, Hunter-Stats und Upgrades
 */

import { getHunterById } from '../constants/hunters';

// Speichere eine Liste von ungültigen Cache-Keys
const invalidCacheKeys = {};

let evaluatedBuildsTracking = loadEvaluationTracking();

/**
 * Initialisiert den Memory-Cache aus dem localStorage beim Start
 * @returns {Object} Initialisierter Memory-Cache
 */
function initializeMemoryCacheFromLocalStorage() {
  const cache = {};
  
  try {
    // Alle Cache-Einträge aus dem localStorage laden
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('huntersim_cache_')) continue;
      
      // Format: huntersim_cache_hunterId_cacheKey
      const parts = key.split('_');
      if (parts.length < 4) continue;
      
      try {
        const hunterId = parts[2];
        const cacheKey = parts.slice(3).join('_'); // Falls der Cache-Key Unterstriche enthält
        const data = localStorage.getItem(key);
        
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed && parsed.result) {
            // In Memory-Cache speichern
            cache[cacheKey] = parsed.result;
          }
        }
      } catch (parseErr) {
        console.warn(`[Cache] Could not parse data for ${key}:`, parseErr);
      }
    }
    
    console.log(`[Cache] Initialized memory cache with ${Object.keys(cache).length} entries from localStorage`);
  } catch (e) {
    console.warn('[Cache] Error initializing memory cache from localStorage:', e);
  }
  
  return cache;
}

// In-Memory Cache
let memoryCache = initializeMemoryCacheFromLocalStorage();


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
 * Behandelt die Änderung der Seed-Einstellung für einen Build
 * @param {string} hunterId - Hunter-ID
 * @param {Object} buildData - Build-Daten
 * @param {boolean} oldSeedSetting - Alte Seed-Einstellung
 * @param {boolean} newSeedSetting - Neue Seed-Einstellung
 * @returns {boolean} - True, wenn eine Neuevaluierung erforderlich ist
 */
export function handleSeedSettingChange(hunterId, buildData, oldSeedSetting, newSeedSetting) {
  // Wenn sich die Seed-Einstellung nicht geändert hat, nichts tun
  if (oldSeedSetting === newSeedSetting) return false;
  
  console.log(`[Cache] Seed setting changed for build '${buildData.name || 'unnamed'}' from ${oldSeedSetting} to ${newSeedSetting}`);
  
  // Wenn von Random zu Seeded gewechselt wird, prüfen ob der Build bereits mit Seeded evaluiert wurde
  if (newSeedSetting === true) {
    const alreadyEvaluatedWithSeeded = isBuildEvaluated(hunterId, buildData, true);
    
    if (!alreadyEvaluatedWithSeeded) {
      console.log(`[Cache] Build '${buildData.name || 'unnamed'}' has not been evaluated with seeded mode yet, will force re-evaluation`);
      return true; // Eine Neuevaluierung ist erforderlich
    } else {
      console.log(`[Cache] Build has already been evaluated with seeded mode, can use cached result`);
      return false; // Keine Neuevaluierung erforderlich
    }
  }
  
  // Wenn von Seeded zu Random gewechselt wird, immer neu evaluieren
  if (newSeedSetting === false) {
    console.log(`[Cache] Switched to Random mode, always force re-evaluation`);
    return true; // Immer neu evaluieren bei Random
  }
  
  return false;
}

/**
 * Speichert einen Cache-Key in localStorage, damit er wiederverwendet werden kann
 * @param {string} hunterId - Hunter-ID
 * @param {Object} buildData - Build-Daten
 * @param {number} cacheKey - Der generierte Cache-Key
 */
export function storeCacheKeyMapping(hunterId, buildData, cacheKey) {
  if (!buildData || !buildData.id || !hunterId || !cacheKey) return;
  
  try {
    // Holen der vorhandenen Mappings oder Erstellen eines neuen Mappings
    const mappingKey = `huntersim_keymap_${hunterId}`;
    let existingMappings = {};
    
    try {
      const storedMappings = localStorage.getItem(mappingKey);
      if (storedMappings) {
        existingMappings = JSON.parse(storedMappings);
      }
    } catch (e) {
      console.warn("[Cache] Could not parse existing key mappings", e);
    }
    
    // Nur aktualisieren, wenn der Key sich geändert hat oder neu ist
    const existingEntry = existingMappings[buildData.id];
    if (existingEntry && existingEntry.key === cacheKey) {
      // Nichts zu tun, der Key ist bereits korrekt gespeichert
      return;
    }
    
    // Füge den neuen Schlüssel hinzu oder aktualisiere ihn
    existingMappings[buildData.id] = {
      key: cacheKey,
      timestamp: Date.now(),
      name: buildData.name || 'unnamed'
    };
    
    // Speichere das aktualisierte Mapping
    localStorage.setItem(mappingKey, JSON.stringify(existingMappings));
    
    console.log(`[Cache] Stored cache key mapping for build '${buildData.name || 'unnamed'}': ${cacheKey}`);
  } catch (e) {
    console.warn("[Cache] Could not store cache key mapping:", e);
  }
}

/**
 * Holt einen gespeicherten Cache-Key aus dem localStorage
 * @param {string} hunterId - Hunter-ID
 * @param {Object} buildData - Build-Daten
 * @returns {number|null} - Der gespeicherte Cache-Key oder null
 */
export function getStoredCacheKey(hunterId, buildData) {
  if (!buildData || !buildData.id || !hunterId) return null;
  
  try {
    const mappingKey = `huntersim_keymap_${hunterId}`;
    const storedMappings = localStorage.getItem(mappingKey);
    
    if (storedMappings) {
      const mappings = JSON.parse(storedMappings);
      const buildMapping = mappings[buildData.id];
      
      if (buildMapping && buildMapping.key) {
        console.log(`[Cache] Retrieved stored cache key for build '${buildData.name || 'unnamed'}': ${buildMapping.key}`);
        return buildMapping.key;
      }
    }
  } catch (e) {
    console.warn("[Cache] Could not get stored cache key:", e);
  }
  
  return null;
}

/**
 * Lädt das Tracking für evaluierte Builds aus localStorage
 * @returns {Object} Tracking-Objekt
 */
function loadEvaluationTracking() {
  const tracking = {};
  try {
    const storedTracking = localStorage.getItem('huntersim_evaluated_builds');
    if (storedTracking) {
      return JSON.parse(storedTracking);
    }
  } catch (e) {
    console.warn('[Cache] Could not load evaluation tracking:', e);
  }
  return tracking;
}

/**
 * Speichert das Tracking für evaluierte Builds im localStorage
 */
function saveEvaluationTracking() {
  try {
    localStorage.setItem('huntersim_evaluated_builds', JSON.stringify(evaluatedBuildsTracking));
  } catch (e) {
    console.warn('[Cache] Could not save evaluation tracking:', e);
  }
}

/**
 * Markiert einen Build als evaluiert mit einem bestimmten Seed-Modus
 * 
 * @param {string} hunterId - Hunter-ID
 * @param {Object} buildData - Build-Daten
 * @param {boolean} isSeeded - Ob der Build im Seeded-Modus evaluiert wurde
 */
export function markBuildAsEvaluated(hunterId, buildData, isSeeded) {
  if (!hunterId || !buildData || !buildData.id) return;
  
  try {
    if (!evaluatedBuildsTracking[hunterId]) {
      evaluatedBuildsTracking[hunterId] = {};
    }
    
    if (!evaluatedBuildsTracking[hunterId][buildData.id]) {
      evaluatedBuildsTracking[hunterId][buildData.id] = { seeded: false, random: false };
    }
    
    // Markierung setzen basierend auf dem Seeded-Status
    if (isSeeded) {
      evaluatedBuildsTracking[hunterId][buildData.id].seeded = true;
    } else {
      evaluatedBuildsTracking[hunterId][buildData.id].random = true;
    }
    
    console.log(`[Cache] Marked build '${buildData.name || 'unnamed'}' as evaluated with ${isSeeded ? 'seeded' : 'random'} mode`);
    
    // Tracking speichern
    saveEvaluationTracking();
  } catch (e) {
    console.warn('[Cache] Could not mark build as evaluated:', e);
  }
}

/**
 * Prüft, ob ein Build bereits mit einem bestimmten Seed-Modus evaluiert wurde
 * 
 * @param {string} hunterId - Hunter-ID
 * @param {Object} buildData - Build-Daten
 * @param {boolean} isSeeded - Der zu prüfende Seed-Modus
 * @returns {boolean} - True, wenn der Build bereits evaluiert wurde
 */
export function isBuildEvaluated(hunterId, buildData, isSeeded) {
  if (!hunterId || !buildData || !buildData.id) return false;
  
  try {
    if (!evaluatedBuildsTracking[hunterId]) return false;
    if (!evaluatedBuildsTracking[hunterId][buildData.id]) return false;
    
    const result = isSeeded 
      ? evaluatedBuildsTracking[hunterId][buildData.id].seeded 
      : evaluatedBuildsTracking[hunterId][buildData.id].random;
    
    console.log(`[Cache] Build '${buildData.name || 'unnamed'}' evaluated with ${isSeeded ? 'seeded' : 'random'} mode: ${result}`);
    
    return result;
  } catch (e) {
    console.warn('[Cache] Error checking if build was evaluated:', e);
    return false;
  }
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
    
    // Seed-Einstellung holen
    const useSeeded = hunterStore.getHunterSeedSetting ? 
      hunterStore.getHunterSeedSetting(hunterId) :
      hunterStore.hunterSeedSettings?.[hunterId] !== false;
    
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
      hunterStats: sortObjectProperties(hunterStore.hunterStats?.[hunterId] || {}),
      useSeeded: useSeeded // Hier die Seed-Einstellung hinzufügen
    };
    
    // Alle relevanten Daten zum Hashing zusammenfassen
    const dataToHash = {
      hunterId,
      buildData: relevantBuildData,
      storeData: relevantStoreData,
      upgrades: upgradeValues
    };
    
    // Hash des JSON-Strings als Cache-Key
    const jsonStr = JSON.stringify(dataToHash);
    const hash = stringToHash(jsonStr);
    
    // Debug-Log
    console.log(`[Cache] Generated cache key for ${buildData.name || 'unnamed'}: ${hash}, useSeeded=${useSeeded}`);
    
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
    // Neue Builds sofort evaluieren
    if (buildData.isNew === true) {
      console.log(`[Cache] New build detected, will evaluate directly:`, buildData.name || 'unnamed');
      delete buildData.isNew;
      return {
        shouldEvaluate: true,
        cachedResult: null,
        cacheKey: `new_build_${Date.now()}`
      };
    }
    
    // Prüfe den aktuellen Seeded-Status
    const useSeeded = hunterStore.getHunterSeedSetting ? 
      hunterStore.getHunterSeedSetting(hunterId) :
      hunterStore.hunterSeedSettings?.[hunterId] !== false;
    
    // WICHTIG: Prüfe, ob der Build mit diesem Seed-Modus bereits evaluiert wurde
    const alreadyEvaluated = isBuildEvaluated(hunterId, buildData, useSeeded);
    
    // KRITISCHER FIXPUNKT: Wenn noch nicht mit dem aktuellen Modus evaluiert, immer neu evaluieren
    if (!alreadyEvaluated) {
      const seedModeText = useSeeded ? 'seeded' : 'random';
      console.log(`[Cache] Build '${buildData.name || 'unnamed'}' has not been evaluated with ${seedModeText} mode yet, forcing evaluation`);
      
      // KRITISCHE ÄNDERUNG: Bestehenden Cache-Key entfernen, damit er nicht wiederverwendet wird
      const existingKey = getStoredCacheKey(hunterId, buildData);
      if (existingKey) {
        await clearCache(hunterId, existingKey);
        console.log(`[Cache] Cleared existing cache key ${existingKey} because build needs evaluation with new seed mode`);
      }
      
      // Generiere einen neuen Cache-Key für die spätere Verwendung
      const cacheKey = await generateCacheKey({ hunterId, buildData, hunterStore });
      
      return {
        shouldEvaluate: true,
        cachedResult: null,
        cacheKey
      };
    }
    
    // NEUE LOGIK: Versuche zuerst, einen gespeicherten Cache-Key zu verwenden
    const storedKey = getStoredCacheKey(hunterId, buildData);
    if (storedKey) {
      console.log(`[Cache] Using stored cache key ${storedKey} for build '${buildData.name || 'unnamed'}'`);
      
      // Prüfe zuerst den In-Memory-Cache
      if (memoryCache[storedKey]) {
        console.log(`[Cache] Found result in memory cache using stored key for build '${buildData.name || 'unnamed'}'`);
        return { 
          shouldEvaluate: false, 
          cachedResult: memoryCache[storedKey],
          cacheKey: storedKey
        };
      }
      
      // Prüfe den Store-Cache
      if (hunterStore.evaluationCache && 
          hunterStore.evaluationCache[hunterId] && 
          hunterStore.evaluationCache[hunterId][storedKey]) {
        
        const cachedResult = hunterStore.evaluationCache[hunterId][storedKey];
        console.log(`[Cache] Found result in store cache using stored key for build '${buildData.name || 'unnamed'}'`);
        
        // Auch in In-Memory-Cache speichern
        memoryCache[storedKey] = cachedResult;
        
        return { 
          shouldEvaluate: false, 
          cachedResult,
          cacheKey: storedKey
        };
      }
      
      // Prüfe localStorage mit dem gespeicherten Schlüssel
      try {
        const storageKey = `huntersim_cache_${hunterId}_${storedKey}`;
        const cachedData = localStorage.getItem(storageKey);
        
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            
            // Führe eine Gültigkeitsprüfung durch
            if (parsedData.result && 
                typeof parsedData.result === 'object' && 
                parsedData.result.summary) {
              
              console.log(`[Cache] Found result in localStorage using stored key for build '${buildData.name || 'unnamed'}'`);
              
              // In Memory-Cache speichern
              memoryCache[storedKey] = parsedData.result;
              
              // In Store-Cache speichern
              if (hunterStore.cacheEvaluationResult) {
                hunterStore.cacheEvaluationResult(hunterId, storedKey, parsedData.result);
              }
              
              return { 
                shouldEvaluate: false, 
                cachedResult: parsedData.result,
                cacheKey: storedKey
              };
            }
          } catch (parseErr) {
            console.warn('[Cache] Error parsing cached data:', parseErr);
          }
        }
      } catch (err) {
        console.warn('[Cache] Error accessing localStorage:', err);
      }
    }
    
    // Wenn kein gespeicherter Schlüssel gefunden oder er nicht mehr gültig ist,
    // generiere einen neuen wie bisher
    const cacheKey = await generateCacheKey({ hunterId, buildData, hunterStore });
    
    // Speichere den neuen Cache-Key für die Zukunft
    storeCacheKeyMapping(hunterId, buildData, cacheKey);
    
    // Prüfe, ob der Key als ungültig markiert wurde
    if (invalidCacheKeys[hunterId] && invalidCacheKeys[hunterId].has(cacheKey)) {
      console.log(`[Cache] Cache key ${cacheKey} was invalidated, forcing evaluation`);
      return {
        shouldEvaluate: true,
        cachedResult: null,
        cacheKey
      };
    }
    
    // Prüfe den In-Memory-Cache mit dem neuen Schlüssel
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
    
    // Prüfe localStorage
    try {
      const storageKey = `huntersim_cache_${hunterId}_${cacheKey}`;
      const cachedData = localStorage.getItem(storageKey);
      
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          const cacheAge = Date.now() - (parsedData.timestamp || 0);
          const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // Eine Woche
          
          if (cacheAge < MAX_CACHE_AGE) {
            console.log(`[Cache] Found result in localStorage for build '${buildData.name || 'unnamed'}'`);
            
            // WICHTIG: Verifiziere, dass das Ergebnis vollständig und gültig ist
            if (parsedData.result && 
                typeof parsedData.result === 'object' && 
                parsedData.result.summary) {
              
              // In Memory-Cache speichern
              memoryCache[cacheKey] = parsedData.result;
              
              // In Store-Cache speichern
              if (hunterStore.cacheEvaluationResult) {
                hunterStore.cacheEvaluationResult(hunterId, cacheKey, parsedData.result);
              }
              
              return { 
                shouldEvaluate: false, 
                cachedResult: parsedData.result,
                cacheKey 
              };
            } else {
              console.warn(`[Cache] Found incomplete result in localStorage, will re-evaluate`);
            }
          } else {
            console.log(`[Cache] Cache is too old (${Math.round(cacheAge/86400000)} days), will re-evaluate`);
          }
        } catch (parseErr) {
          console.warn('[Cache] Error parsing cached data:', parseErr);
          // Ungültigen Cache-Eintrag entfernen
          localStorage.removeItem(storageKey);
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
  if (!result || !buildData || !buildData.id) return;
  
  try {
    // Wenn kein cacheKey übergeben wurde, versuche zuerst, einen gespeicherten Schlüssel zu verwenden
    let key = cacheKey;
    if (!key) {
      key = getStoredCacheKey(hunterId, buildData) || await generateCacheKey({ hunterId, buildData, hunterStore });
    }
    
    // Key speichern für späteren Gebrauch 
    storeCacheKeyMapping(hunterId, buildData, key);
    
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
      
      // Aktuellen Seeded-Status ermitteln
      const useSeeded = hunterStore.getHunterSeedSetting ? 
        hunterStore.getHunterSeedSetting(hunterId) :
        hunterStore.hunterSeedSettings?.[hunterId] !== false;
      
      // Ergebnis im localStorage speichern
      localStorage.setItem(storageKey, JSON.stringify({
        timestamp: Date.now(),
        result: simplifiedResult,
        buildName: buildData.name || 'unnamed',
        buildId: buildData.id,
        isSeeded: useSeeded // Seeded-Status mit speichern
      }));
      
      // WICHTIG: Build als evaluiert markieren mit dem aktuellen Seeded-Status
      markBuildAsEvaluated(hunterId, buildData, useSeeded);
      
      console.log(`[Cache] Marked build '${buildData.name || 'unnamed'}' as evaluated with ${useSeeded ? 'seeded' : 'random'} mode`);
      
    } catch (e) {
      console.warn('[Cache] Could not save to localStorage:', e);
    }
    
    console.log(`[Cache] Stored result for build '${buildData.name || 'unnamed'}'. Key: ${key}, seeded: ${hunterStore.getHunterSeedSetting ? hunterStore.getHunterSeedSetting(hunterId) : 'unknown'}`);
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

/**
 * Prüft, ob die Build-Evaluierung nach Änderungen an den Hunter-Stats aktualisiert werden sollte
 * @param {Object} options - Optionen mit hunterId, buildData und hunterStore
 * @returns {Promise<boolean>} - True, wenn eine Aktualisierung notwendig ist
 */
export async function shouldUpdateOnStatsChange({ hunterId, buildData, hunterStore }) {
  if (!buildData) return true;

  // Überprüfe, ob dieser Build Overrides hat, die hunter Stats betreffen
  const hasStatOverrides = buildData.overrides && 
    Object.keys(buildData.overrides).some(key => !key.includes('.'));
  
  // Wenn der Build Stats-Overrides hat, Änderungen ignorieren
  if (hasStatOverrides) {
    console.log('Build has stat overrides, ignoring hunter stat changes');
    return false;
  }
  
  // Sonst aktualisieren, da hunter Stats relevant sind
  return true;
}