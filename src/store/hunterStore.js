import { defineStore } from 'pinia';
import { ref } from 'vue';
import { HUNTERS } from '../constants/hunters';
import { UPGRADES } from '../constants/upgrades';

/**
 * Zentraler Store für Hunter-Daten und Upgrades
 */
export const useHunterStore = defineStore('hunter', () => {
  // Hunter-spezifische Statistiken
  const hunterStats = ref({});
  
  // Upgrade-Werte, dynamisch aus UPGRADES-Konstante generiert
  const upgrades = ref(generateUpgradesStructure(UPGRADES));
  
  // Hunter-spezifische Builds
  const hunterBuilds = ref({});
  
  // Iterationen für Hunter
  const hunterIterations = ref({});

  // Speichert die Build-Reihenfolge pro Hunter
  const buildOrders = ref({});

  // Neuer Evaluation-Cache
  const evaluationCache = ref({});

  // Stelle sicher, dass der State und die Funktionen im store definiert sind
  const displaySettings = ref({});

  // Seed-Einstellungen pro Hunter
  const hunterSeedSettings = ref({});

  /**
   * Generiert die initiale Upgrades-Struktur basierend auf den UPGRADES-Konstanten
   * @param {Object} upgradesConfig - Die UPGRADES-Konstante
   * @returns {Object} Die initiale Upgrades-Struktur
   */
  function generateUpgradesStructure(upgradesConfig) {
    const structure = {};
    
    // Erstelle für jede Kategorie in UPGRADES ein leeres Objekt
    Object.keys(upgradesConfig).forEach(category => {
      structure[category] = {};
    });
    
    return structure;
  }

  /**
   * Initialisiert die Builds für einen bestimmten Hunter
   * @param {string} hunterId - Die ID des Hunters
   */
  function initHunterBuilds(hunterId) {
    // Wenn die Builds für diesen Hunter bereits initialisiert wurden, nichts tun
    if (hunterBuilds.value[hunterId]) {
      return;
    }
    
    // Erstelle ein leeres Array für die Builds dieses Hunters
    hunterBuilds.value[hunterId] = [];
  }

  /**
   * Initialisiert die Stats für einen bestimmten Hunter
   * @param {string} hunterId - Die ID des Hunters
   */
  async function initHunterStats(hunterId) {
    // Wenn die Stats für diesen Hunter bereits initialisiert wurden, nichts tun
    if (hunterStats.value[hunterId]) {
      return;
    }

    try {
      // Finde Hunter-Konfiguration
      const hunterConfig = HUNTERS.find(h => h.id === hunterId);
      if (!hunterConfig) {
        console.error(`Hunter mit ID ${hunterId} nicht gefunden.`);
        return;
      }

      // Lade Stats-Definition aus dem entsprechenden Modul
      const statsModule = await hunterConfig.statsModule();
      
      // Erstelle leeres Stats-Objekt
      hunterStats.value[hunterId] = {};
      
      // Initialisiere stats mit Standardwerten
      if (statsModule.STATS) {
        statsModule.STATS.forEach(stat => {
          hunterStats.value[hunterId][stat.key] = 0;
        });
      }
      
      // Initialisiere talents mit Standardwerten (falls vorhanden)
      if (statsModule.TALENTS) {
        statsModule.TALENTS.forEach(talent => {
          hunterStats.value[hunterId][talent.key] = 0;
        });
      }
      
      // Initialisiere attributes mit Standardwerten (falls vorhanden)
      if (statsModule.ATTRIBUTES) {
        statsModule.ATTRIBUTES.forEach(attr => {
          hunterStats.value[hunterId][attr.key] = 0;
        });
      }
    } catch (error) {
      console.error(`Fehler beim Initialisieren der Stats für ${hunterId}:`, error);
    }
  }

  /**
   * Aktualisiert einen einzelnen Stat-Wert
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} statKey - Der Schlüssel des Stats
   * @param {any} value - Der neue Wert
   */
  function updateStat(hunterId, statKey, value) {
    if (!hunterStats.value[hunterId]) {
      console.warn(`Hunter ${hunterId} nicht initialisiert.`);
      return;
    }
    
    hunterStats.value[hunterId][statKey] = value;
  }

  /**
   * Setzt alle Stats eines Hunters zurück
   * @param {string} hunterId - Die ID des Hunters
   */
  async function resetStats(hunterId) {
    delete hunterStats.value[hunterId];
    await initHunterStats(hunterId);
  }

  /**
   * Importiert alle Stats für einen Hunter
   * @param {string} hunterId - Die ID des Hunters
   * @param {Object} stats - Das zu importierende Stats-Objekt
   */
  function importStats(hunterId, stats) {
    if (!hunterStats.value[hunterId]) {
      hunterStats.value[hunterId] = {};
    }
    
    // Überschreibe nur vorhandene Eigenschaften
    Object.keys(stats).forEach(key => {
      if (hunterStats.value[hunterId].hasOwnProperty(key)) {
        hunterStats.value[hunterId][key] = stats[key];
      }
    });
  }

  /**
   * Getter für die Stats eines bestimmten Hunters
   * @param {string} hunterId - Die ID des Hunters
   * @returns {Object} Die Stats des Hunters
   */
  function getStats(hunterId) {
    return hunterStats.value[hunterId] || {};
  }

  /**
   * Erstellt eine Kopie der Stats eines Hunters
   * @param {string} hunterId - Die ID des Hunters
   * @returns {Object} Eine tiefe Kopie der Hunter-Stats
   */
  function cloneStats(hunterId) {
    if (!hunterStats.value[hunterId]) {
      return {};
    }
    return JSON.parse(JSON.stringify(hunterStats.value[hunterId]));
  }

  /**
   * Aktualisiert den Wert eines bestimmten Upgrades
   * @param {string} category - Die Kategorie des Upgrades (relics, inscryptions, etc.)
   * @param {string} id - Die ID des Upgrades
   * @param {any} value - Der neue Wert
   */
  function updateUpgrade(category, id, value) {
    // Stelle sicher, dass die Kategorie im Upgrades-Objekt existiert
    if (!upgrades.value[category]) {
      upgrades.value[category] = {};
    }
    
    // Aktualisiere den Wert
    upgrades.value[category][id] = value;
  }

  /**
   * Gibt den Wert eines bestimmten Upgrades zurück
   * @param {string} category - Die Kategorie des Upgrades (relics, inscryptions, etc.)
   * @param {string} id - Die ID des Upgrades
   * @returns {any} Der Wert des Upgrades oder 0/false als Default
   */
  function getUpgradeValue(category, id) {
    if (!upgrades.value[category] || upgrades.value[category][id] === undefined) {
      // Default-Wert basierend auf dem Typ des Upgrades
      const upgradeType = findUpgradeType(category, id);
      return upgradeType === 'boolean' ? false : 0;
    }
    
    return upgrades.value[category][id];
  }

  /**
   * Findet den Typ eines Upgrades in den Konstanten
   * @param {string} category - Die Kategorie des Upgrades
   * @param {string} id - Die ID des Upgrades
   * @returns {string} Der Typ des Upgrades ('level', 'boolean', etc.)
   */
  function findUpgradeType(category, id) {
    if (!UPGRADES[category]) return 'level';  // Default ist 'level'
    
    const upgrade = UPGRADES[category].find(item => item.id === id);
    return upgrade?.type || 'level';
  }

  /**
   * Setzt alle Upgrades einer Kategorie zurück
   * @param {string} category - Die Kategorie der Upgrades
   */
  function resetUpgradeCategory(category) {
    if (upgrades.value[category]) {
      upgrades.value[category] = {};
    }
  }

  /**
   * Setzt alle Upgrades zurück
   */
  function resetAllUpgrades() {
    // Generiere die Struktur neu, aber mit leeren Objekten
    upgrades.value = generateUpgradesStructure(UPGRADES);
  }

  /**
   * Gibt alle Upgrades zurück, die für einen bestimmten Hunter relevant sind
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} category - Die Kategorie der Upgrades (optional)
   * @returns {Object} Die relevanten Upgrades
   */
  function getUpgradesForHunter(hunterId, category = null) {
    if (category) {
      // Wenn eine Kategorie angegeben wurde
      if (!UPGRADES[category] || !upgrades.value[category]) return {};
      
      // Filtern nach relevanten Upgrades für diesen Hunter
      const relevantUpgrades = {};
      
      UPGRADES[category].forEach(upgrade => {
        // Upgrads mit hunter 'all' oder spezifisch für hunterId
        if (upgrade.hunter === 'all' || 
            upgrade.hunter === hunterId || 
            (upgrade.hunter && upgrade.hunter.includes(hunterId))) {
          
          const upgradeId = upgrade.id;
          relevantUpgrades[upgradeId] = getUpgradeValue(category, upgradeId);
        }
      });
      
      return relevantUpgrades;
    }
    
    // Wenn keine Kategorie angegeben wurde, sammle alle relevanten Upgrades
    const result = {};
    
    Object.keys(UPGRADES).forEach(cat => {
      result[cat] = getUpgradesForHunter(hunterId, cat);
    });
    
    return result;
  }

  /**
   * Fügt einen neuen Build für einen Hunter hinzu
   * @param {string} hunterId - Die ID des Hunters
   * @param {Object} build - Der Build, der hinzugefügt werden soll
   */
  function addBuild(hunterId, build) {
    // Stelle sicher, dass build ein Objekt ist
    if (!build || typeof build !== 'object') {
      console.error('Invalid build object:', build);
      return false;
    }
    
    // Stelle sicher, dass hunterBuilds für diesen Hunter initialisiert ist
    if (!hunterBuilds.value[hunterId]) {
      hunterBuilds.value[hunterId] = [];
    }
    
    // Setze hunterId im Build-Objekt
    build.hunterId = hunterId;
    
    // Generiere eine ID für den Build, falls keine vorhanden
    if (!build.id) {
      build.id = Date.now().toString();
    }
    
    // Füge den Build hinzu
    hunterBuilds.value[hunterId].push(build);
    
    // Die Persistenz wird durch Pinia's persist-Plugin automatisch gehandhabt
    
    return true;
  }

  /**
   * Aktualisiert einen bestehenden Build
   * @param {Object} updatedBuild - Der Build, der aktualisiert werden soll
   */
  function updateBuild(updatedBuild) {
    if (!updatedBuild || !updatedBuild.hunter) {
      console.error('Invalid build object', updatedBuild);
      return false;
    }
    
    const hunterId = updatedBuild.hunter;
    
    // Stelle sicher, dass der Hunter im hunterBuilds-Objekt existiert
    if (!hunterBuilds.value[hunterId]) {
      hunterBuilds.value[hunterId] = [];
    }
    
    const index = hunterBuilds.value[hunterId].findIndex(build => build.id === updatedBuild.id);
    if (index !== -1) {
      // Build aktualisieren
      hunterBuilds.value[hunterId][index] = {
        ...updatedBuild,
        timestamp: Date.now()
      };
    } else {
      // Build existiert nicht, füge ihn hinzu (für den Fall eines geklonten Builds)
      addBuild(hunterId, updatedBuild);
    }
    
    return true;
  }

  /**
   * Löscht einen Build
   * @param {string} hunterId - Die Hunter-ID
   * @param {string} buildId - Die ID des Builds, der gelöscht werden soll
   */
  function deleteBuild(hunterId, buildId) {
    if (!hunterBuilds.value[hunterId]) {
      return;
    }
    
    // Entferne den Build aus der Liste
    hunterBuilds.value[hunterId] = hunterBuilds.value[hunterId].filter(build => build.id !== buildId);
  
    // Aktualisiere die Build-Reihenfolge
    const orderIds = loadBuildsOrder(hunterId) || [];
    if (Array.isArray(orderIds)) {
      // Sicherstellen, dass nur gültige IDs gefiltert werden
      const updatedOrder = orderIds.filter(id => id && id !== buildId);
      saveBuildsOrder(hunterId, updatedOrder);
    }
    
    // WICHTIG: Nur den Cache für diesen spezifischen Build löschen
    if (evaluationCache.value[hunterId]) {
      // Durchsuche den Cache nach Einträgen, die zu diesem Build gehören
      const cachesToRemove = [];
      const hunterCache = evaluationCache.value[hunterId];
      
      // Finde alle Cache-Schlüssel, die diesem Build zugeordnet sind
      for (const cacheKey in hunterCache) {
        const cacheEntry = hunterCache[cacheKey];
        // Prüfe, ob der Cache-Eintrag zu diesem Build gehört
        if (cacheEntry && (
          (cacheEntry.buildId === buildId) || 
          (cacheEntry.params && cacheEntry.params.buildId === buildId)
        )) {
          cachesToRemove.push(cacheKey);
        }
      }
      
      // Lösche die gefundenen Cache-Einträge
      cachesToRemove.forEach(key => {
        delete hunterCache[key];
      });
      
      console.log(`Cache entries related to build ${buildId} removed: ${cachesToRemove.length}`);
    }
  }

  /**
   * Gibt alle Builds für einen bestimmten Hunter zurück
   * @param {string} hunterId - Die ID des Hunters
   * @returns {Array} Die Builds für den Hunter
   */
  function getBuildsForHunter(hunterId) {
    if (!hunterBuilds.value[hunterId]) {
      hunterBuilds.value[hunterId] = [];
    }
    return hunterBuilds.value[hunterId];
  }

  /**
   * Gibt einen Build anhand seiner ID und Hunter-ID zurück
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} buildId - Die ID des Builds
   * @returns {Object} Der Build
   */
  function getBuildById(hunterId, buildId) {
    if (!hunterBuilds.value[hunterId]) {
      return null;
    }
    
    return hunterBuilds.value[hunterId].find(build => build.id === buildId);
  }

  /**
   * Stellt sicher, dass die Basisstruktur für einen Hunter existiert
   * @param {string} hunterId - Die ID des Hunters
   * @returns {Object} Die Hunter-Daten
   */
  async function initHunterConfig(hunterId) {
    // Stelle sicher, dass der Hunter in hunterBuilds existiert
    if (!hunterBuilds.value[hunterId]) {
      hunterBuilds.value[hunterId] = [];
    }
    
    // Stelle sicher, dass Iterationen für diesen Hunter existieren
    if (hunterIterations.value[hunterId] === undefined) {
      hunterIterations.value[hunterId] = 1000; // Default-Wert
    }
    
    return { hunterStats: hunterStats.value, upgrades: upgrades.value, hunterBuilds: hunterBuilds.value, hunterIterations: hunterIterations.value };
  }

  /**
   * Iterationen für einen bestimmten Hunter abrufen
   * @param {string} hunterId - Die ID des Hunters
   * @returns {number} Die Anzahl der Iterationen
   */
  function getIterations(hunterId) {
    if (hunterIterations.value[hunterId] === undefined) {
      hunterIterations.value[hunterId] = 1000;
    }
    return hunterIterations.value[hunterId];
  }

  /**
   * Iterationen für einen bestimmten Hunter aktualisieren
   * @param {string} hunterId - Die ID des Hunters
   * @param {number} iterations - Die neue Anzahl der Iterationen
   */
  function updateIterations(hunterId, iterations) {
    hunterIterations.value[hunterId] = iterations;
  }

/**
 * Speichert die Reihenfolge der Builds für einen bestimmten Hunter
 * @param {string} hunterId - Die ID des Hunters
 * @param {Array} builds - Die geordnete Liste der Builds oder Build-IDs
 */
function saveBuildsOrder(hunterId, builds) {
  if (!hunterId || !builds || !Array.isArray(builds)) return;
  
  // Extrahiere nur die IDs für die Reihenfolge
  // Überprüfe, ob builds ein Array von Objekten oder IDs ist
  const orderIds = builds.filter(build => build !== null).map(build => {
    // Wenn build bereits eine ID-Zeichenfolge ist, verwenden wir sie direkt
    if (typeof build === 'string') return build;
    // Wenn build ein Objekt mit id-Eigenschaft ist, verwenden wir diese
    if (build && build.id) return build.id;
    // Andernfalls überspringen wir diesen Build
    return null;
  }).filter(id => id !== null); // Entferne alle null-Werte
  
  // Speichere die Reihenfolge im Store
  buildOrders.value[hunterId] = orderIds;
  
  // Speichere in localStorage
  try {
    const storageKey = `hunter_${hunterId}_build_order`;
    localStorage.setItem(storageKey, JSON.stringify(orderIds));
  } catch (error) {
    console.error('Failed to save build order to localStorage:', error);
  }
}

  /**
   * Lädt die Reihenfolge der Builds für einen bestimmten Hunter
   * @param {string} hunterId - Die ID des Hunters
   * @returns {Array|null} - Die geordnete Liste der Build-IDs oder null
   */
  function loadBuildsOrder(hunterId) {
    if (!hunterId) return null;
    
    // Falls die Reihenfolge bereits im Store ist
    if (buildOrders.value[hunterId]) {
      return buildOrders.value[hunterId];
    }
    
    // Versuche aus localStorage zu laden
    try {
      const storageKey = `hunter_${hunterId}_build_order`;
      const storedOrder = localStorage.getItem(storageKey);
      
      if (storedOrder) {
        const orderIds = JSON.parse(storedOrder);
        buildOrders.value[hunterId] = orderIds;
        return orderIds;
      }
    } catch (error) {
      console.error('Failed to load build order from localStorage:', error);
    }
    
    return null;
  }

  /**
   * Holt und ordnet die Builds für einen Hunter gemäß der gespeicherten Reihenfolge
   * @param {string} hunterId - Die ID des Hunters
   * @returns {Array} - Die geordnete Liste der Builds
   */
  function getOrderedBuildsForHunter(hunterId) {
    // Hole die ungeordneten Builds
    const builds = getBuildsForHunter(hunterId) || [];
    
    // Hole die gespeicherte Reihenfolge
    const orderIds = loadBuildsOrder(hunterId);
    
    if (!orderIds || orderIds.length === 0) {
      return builds; // Rückfall auf ungeordnete Builds
    }
    
    // Erstelle eine Map der Builds für schnellen Zugriff
    const buildMap = builds.reduce((map, build) => {
      map[build.id] = build;
      return map;
    }, {});
    
    // Erstelle die geordnete Liste gemäß der gespeicherten Reihenfolge
    const orderedBuilds = orderIds
      .filter(id => buildMap[id]) // Nur existierende Builds behalten
      .map(id => buildMap[id]);
    
    // Füge Builds hinzu, die in der Reihenfolge fehlen
    const orderedIds = new Set(orderIds);
    const remainingBuilds = builds.filter(build => !orderedIds.has(build.id));
    
    return [...orderedBuilds, ...remainingBuilds];
  }

  /**
   * Speichert ein Evaluierungsergebnis im Cache
   * @param {string} cacheKey - Der Cache-Schlüssel
   * @param {Object} result - Das zu speichernde Ergebnis
   */
  function cacheEvaluationResult(cacheKey, result) {
    if (!cacheKey || !result) return;
    
    // Maximale Anzahl an Cache-Einträgen pro Hunter begrenzen
    const MAX_CACHE_ENTRIES_PER_HUNTER = 20;
    
    // Extrahiere Hunter-ID aus dem Ergebnis
    const hunterId = result.hunterId || extractHunterIdFromResult(result);
    
    if (!hunterId) {
      console.warn('Could not determine hunterId for cache entry');
      return;
    }
    
    // Initialisiere Hunter-spezifischen Cache, falls nicht vorhanden
    if (!evaluationCache.value[hunterId]) {
      evaluationCache.value[hunterId] = {};
    }
    
    // Cache-Größe überprüfen und älteste Einträge entfernen
    const hunterCache = evaluationCache.value[hunterId];
    const cacheKeys = Object.keys(hunterCache);
    
    if (cacheKeys.length >= MAX_CACHE_ENTRIES_PER_HUNTER) {
      // Finde und entferne den ältesten Eintrag
      let oldestKey = cacheKeys[0];
      let oldestTime = hunterCache[oldestKey].timestamp || 0;
      
      cacheKeys.forEach(key => {
        const entryTime = hunterCache[key].timestamp || 0;
        if (entryTime < oldestTime) {
          oldestTime = entryTime;
          oldestKey = key;
        }
      });
      
      // Ältesten Eintrag entfernen
      delete hunterCache[oldestKey];
    }
    
    // Ergebnis im Cache speichern mit Zeitstempel
    evaluationCache.value[hunterId][cacheKey] = {
      ...result,
      timestamp: Date.now()
    };
  }

  /**
   * Extrahiert die Hunter-ID aus einem Ergebnis
   * @param {Object} result - Das Evaluierungsergebnis
   * @returns {string|null} - Die Hunter-ID oder null
   */
  function extractHunterIdFromResult(result) {
    if (result.hunterId) return result.hunterId;
    if (result.hunter) return result.hunter;
    
    // Versuche, die Hunter-ID aus den Ergebnissen zu extrahieren
    // Dies ist ein Fallback und sehr spezifisch für deine Anwendung
    if (result.stats && result.stats.atwill) {
      // Wenn "atwill" vorhanden ist, ist es wahrscheinlich ein Borge
      return 'borge';
    } else if (result.stats && result.stats.multichance !== undefined) {
      // Wenn "multichance" vorhanden ist, ist es wahrscheinlich ein Ozzy
      return 'ozzy';
    } else if (result.stats && result.stats.charge !== undefined) {
      // Wenn "charge" vorhanden ist, ist es wahrscheinlich ein Knox
      return 'knox';
    }
    
    return null;
  }

  /**
   * Holt ein Evaluierungsergebnis aus dem Cache
   * @param {string} cacheKey - Der Cache-Schlüssel
   * @param {string} hunterId - Die ID des Hunters (optional, für bessere Performance)
   * @returns {Object|null} - Das gecachte Ergebnis oder null
   */
  function getCachedEvaluationResult(cacheKey, hunterId = null) {
    if (!cacheKey) return null;
    
    // Wenn Hunter-ID bekannt ist, direkt im Hunter-Cache nachschlagen
    if (hunterId && evaluationCache.value[hunterId]) {
      return evaluationCache.value[hunterId][cacheKey] || null;
    }
    
    // Andernfalls in allen Hunter-Caches suchen
    for (const id in evaluationCache.value) {
      if (evaluationCache.value[id][cacheKey]) {
        return evaluationCache.value[id][cacheKey];
      }
    }
    
    return null;
  }

  /**
   * Löscht den gesamten Evaluierungs-Cache oder für einen bestimmten Hunter
   * @param {string} hunterId - Die ID des Hunters (optional)
   */
  function clearEvaluationCache() {
    // Hier ist wichtig, dass wir den Cache als leeres Objekt neu zuweisen, nicht nur Properties löschen
    evaluationCache.value = {};
    return true;
  }

  /**
   * Überprüft, ob ein ähnliches Evaluierungsergebnis bereits im Cache vorhanden ist
   * @param {Object} buildParams - Die Build-Parameter
   * @param {string} hunterId - Die ID des Hunters
   * @returns {Object|null} - Das gecachte Ergebnis oder null
   */
  function findSimilarCachedResult(buildParams, hunterId) {
    if (!hunterId || !evaluationCache.value[hunterId]) {
      return null;
    }
    
    // Extrahiere nur die wichtigsten Parameter für den Vergleich
    const keyParams = extractKeyParams(buildParams);
    
    // Durchsuche alle Ergebnisse im Hunter-Cache
    const hunterCache = evaluationCache.value[hunterId];
    
    for (const key in hunterCache) {
      const cachedResult = hunterCache[key];
      
      // Überprüfe, ob die wichtigsten Parameter übereinstimmen
      if (cachedResult && isParamsSimilar(keyParams, cachedResult.params)) {
        return cachedResult;
      }
    }
    
    return null;
  }

  /**
   * Extrahiert die wichtigsten Parameter aus einem Build für den Vergleich
   * @param {Object} buildParams - Die Build-Parameter
   * @returns {Object} - Die extrahierten Schlüsselparameter
   */
  function extractKeyParams(buildParams) {
    // Diese Funktion müsstest du an deine spezifischen Anforderungen anpassen
    const result = {};
    
    // Beispiel: Wichtige Parameter für den Cache-Vergleich
    const keyParamsList = [
      'level', 'maxStage', 'hp', 'atk', 'regen', 'dr', 'evade', 'effect',
      'critchance', 'critpower', 'atkspeed', 'revival'
    ];
    
    keyParamsList.forEach(param => {
      if (buildParams[param] !== undefined) {
        result[param] = buildParams[param];
      }
    });
    
    return result;
  }

  /**
   * Überprüft, ob zwei Parameter-Objekte ähnlich sind
   * @param {Object} params1 - Erste Parameter
   * @param {Object} params2 - Zweite Parameter
   * @returns {boolean} - True, wenn die Parameter ähnlich sind
   */
  function isParamsSimilar(params1, params2) {
    if (!params1 || !params2) return false;
    
    // Überprüfe, ob alle Schlüsselparameter übereinstimmen
    for (const key in params1) {
      if (params1[key] !== params2[key]) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Benennt einen Build um
   * @param {string} buildId - Die ID des Builds
   * @param {string} newName - Der neue Name für den Build
   * @returns {boolean} - True bei Erfolg, False bei Fehler
   */
  function renameBuild(buildId, newName) {
    if (!buildId || !newName) return false;

    // Durchsuche alle Hunter und ihre Builds
    for (const hunterId in hunterBuilds.value) {
      const index = hunterBuilds.value[hunterId].findIndex(build => build.id === buildId);
      
      if (index !== -1) {
        // Build gefunden, Namen aktualisieren
        hunterBuilds.value[hunterId][index].name = newName;
        return true;
      }
    }
    
    return false;
  }

  /**
 * Aktualisiert die Overrides für einen bestimmten Build
 * @param {string} buildId - Die ID des Builds
 * @param {Object} overrides - Die neuen Overrides
 * @returns {boolean} - True bei Erfolg, False bei Fehler
 */
function updateBuildOverrides(buildId, overrides) {
  if (!buildId || !overrides) return false;

  // Durchsuche alle Hunter und ihre Builds
  for (const hunterId in hunterBuilds.value) {
    const index = hunterBuilds.value[hunterId].findIndex(build => build.id === buildId);
    
    if (index !== -1) {
      // Build gefunden, Overrides aktualisieren
      hunterBuilds.value[hunterId][index].overrides = { ...overrides };
      
      // WICHTIG: Nicht die globalen hunterStats aktualisieren!
      // Die Overrides sind nur für diesen spezifischen Build
      
      return true;
    }
  }
  
  return false;
}

/**
 * Gibt die Seed-Einstellung für einen bestimmten Hunter zurück
 * @param {string} hunterId - Die ID des Hunters
 * @returns {boolean} - True für seeded (deterministisch), False für random
 */
function getHunterSeedSetting(hunterId) {
  // Default: true (seeded) wenn nicht explizit gesetzt
  return hunterSeedSettings.value[hunterId] !== undefined ? 
    hunterSeedSettings.value[hunterId] : true;
}

/**
 * Speichert die Seed-Einstellung für einen bestimmten Hunter
 * @param {string} hunterId - Die ID des Hunters
 * @param {boolean} useSeeded - Ob die Evaluation mit Seed sein soll
 */
function saveHunterSeedSetting(hunterId, useSeeded) {
  if (!hunterId) return;
  
  hunterSeedSettings.value = {
    ...hunterSeedSettings.value,
    [hunterId]: useSeeded
  };
  
  console.log(`Seed setting saved for ${hunterId}:`, useSeeded);
}

/**
 * Lädt alle Seed-Einstellungen aus dem LocalStorage
 * Diese Methode ist meist nicht nötig, da Pinia mit persist automatisch lädt
 */
function loadHunterSeedSettings() {
  // In der Regel wird dies automatisch durch Pinia's persist-Plugin erledigt
  console.log("Current seed settings:", hunterSeedSettings.value);
}

// Erweitere initHunterConfig, um sicherzustellen, dass eine Seed-Einstellung existiert
async function initHunterConfig(hunterId) {
  // Bestehende Initialisierungen...
  if (!hunterBuilds.value[hunterId]) {
    hunterBuilds.value[hunterId] = [];
  }
  
  if (hunterIterations.value[hunterId] === undefined) {
    hunterIterations.value[hunterId] = 1000;
  }
  
  // Stelle sicher, dass eine Seed-Einstellung existiert
  if (hunterSeedSettings.value[hunterId] === undefined) {
    // Default-Wert: true (seeded)
    hunterSeedSettings.value[hunterId] = true;
  }
  
  return { 
    hunterStats: hunterStats.value, 
    upgrades: upgrades.value, 
    hunterBuilds: hunterBuilds.value, 
    hunterIterations: hunterIterations.value,
    hunterSeedSettings: hunterSeedSettings.value
  };
}

// Display-Einstellungen speichern
function saveDisplaySettings(hunterId, settings) {
  if (!hunterId) return;
  
  // Stelle sicher, dass displaySettings initialisiert ist
  if (!displaySettings.value) {
    displaySettings.value = {};
  }
  
  // Tiefe Kopie des Objekts erstellen, um reaktive Arrays richtig zu speichern
  const settingsCopy = JSON.parse(JSON.stringify(settings));
  
  // Speichere die Einstellungen im Store
  displaySettings.value = {
    ...displaySettings.value,
    [hunterId]: settingsCopy
  };

  console.log("Settings saved to store:", displaySettings.value);
  return true;
}

// Display-Einstellungen abrufen
function getDisplaySettings(hunterId) {
  return displaySettings.value[hunterId] || null;
}


  // Im return-Statement am Ende des Stores:
  return {
    hunterStats,
    upgrades,
    hunterBuilds,
    hunterIterations,
    buildOrders,
    evaluationCache,
    displaySettings,
    hunterSeedSettings, // Die State-Variable
    
    // Hunter Stats Funktionen
    initHunterStats,
    initHunterBuilds,
    updateStat,
    resetStats,
    importStats,
    getStats,
    cloneStats,
    
    // Upgrade Funktionen
    updateUpgrade,
    getUpgradeValue,
    resetUpgradeCategory,
    resetAllUpgrades,
    getUpgradesForHunter,
    
    // Build-Management Funktionen
    addBuild,
    updateBuild,
    deleteBuild,
    renameBuild,
    getBuildsForHunter,
    getBuildById,
    updateBuildOverrides,
    
    // Iterations-Funktionen
    initHunterConfig,
    getIterations,
    updateIterations,
    
    // Build Order Funktionen
    saveBuildsOrder,
    loadBuildsOrder,
    getOrderedBuildsForHunter,
    
    // Cache-Funktionen
    cacheEvaluationResult,
    getCachedEvaluationResult,
    clearEvaluationCache,
    findSimilarCachedResult,
    
    // Display-Einstellungen
    saveDisplaySettings,
    getDisplaySettings,
    
    // Seed-Einstellungen - Hier fehlten die Funktionen
    getHunterSeedSetting,
    saveHunterSeedSetting,
    loadHunterSeedSettings
  };
}, {
  persist: {
    key: 'hunter-data',
    storage: localStorage,
    paths: [
      'hunterStats', 
      'upgrades', 
      'hunterBuilds', 
      'hunterIterations', 
      'buildOrders', 
      'evaluationCache', 
      'displaySettings',
      'hunterSeedSettings'  // Neue Variable zur Persistenz hinzufügen
    ]
  }
});