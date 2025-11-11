import { defineStore } from 'pinia';
import { ref, nextTick } from 'vue';
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

  // Boss Kill by Revive Cache 
  const bossKillsByReviveCache = ref({});

  // Pending Build Import - für Cross-Navigation Build Transfer
  const pendingBuildImport = ref(null);

  // Hunter Level Settings - für Advanced Talents Toggle
  const hunterLevelSettings = ref({});

  // Build Categories - verschachtelte Kategorien mit parentId
  const buildCategories = ref({});

  // Reference Builds per Category - { hunterId: { categoryId: buildId } }
  const categoryReferenceBuild = ref({});
  
  // Category Override Update Counter - wird inkrementiert wenn Category-Overrides geändert werden
  const categoryOverrideUpdateCounter = ref(0);

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
    
    // Aktualisiere den Wert und triggere Reactivity durch Objekterstellung
    const newCategoryData = { ...upgrades.value[category], [id]: value };
    upgrades.value = { ...upgrades.value, [category]: newCategoryData };
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

    // Stelle sicher, dass isImported Flag existiert
    if (build.isImported === undefined) {
      build.isImported = false; // Default: false für normale Builds
    }
    
    // Füge den Build mit smooth transition hinzu
    if (document.startViewTransition) {
      // Erst Build hinzufügen
      hunterBuilds.value[hunterId].push(build);
      
      // Setze globales Flag für in-page transition
      document.documentElement.setAttribute('data-in-page-transition', 'true');
      
      // Warte auf Vue's DOM Update PLUS mehr Zeit für Evaluation zu starten
      nextTick().then(() => {
        // Gib Knox mehr Zeit - der gestaffelte Delay + Evaluation-Start
        // Bei index * 100ms brauchen wir mindestens so lange + etwas Buffer
        return new Promise(resolve => setTimeout(resolve, 50));
      }).then(() => {
        document.documentElement.classList.add('in-page-transition');
        const transition = document.startViewTransition(() => {
          // DOM ist bereits aktualisiert UND erste Evaluation könnte bereits laufen
        });
        transition.finished.finally(() => {
          document.documentElement.classList.remove('in-page-transition');
          document.documentElement.removeAttribute('data-in-page-transition');
        });
      });
    } else {
      hunterBuilds.value[hunterId].push(build);
    }

    // Scanne nach höchstem Level nach Build-Hinzufügung
    scanBuildsForHighestLevel(hunterId);
    
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

    // Scanne nach höchstem Level nach Build-Update
    scanBuildsForHighestLevel(hunterId);
    
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
    
    // Entferne den Build mit smooth transition
    if (document.startViewTransition) {
      // Setze globales Flag für in-page transition
      document.documentElement.setAttribute('data-in-page-transition', 'true');
      document.documentElement.classList.add('in-page-transition');
      const transition = document.startViewTransition(() => {
        hunterBuilds.value[hunterId] = hunterBuilds.value[hunterId].filter(build => build.id !== buildId);
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove('in-page-transition');
        document.documentElement.removeAttribute('data-in-page-transition');
      });
    } else {
      hunterBuilds.value[hunterId] = hunterBuilds.value[hunterId].filter(build => build.id !== buildId);
    }
  
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

    clearCachedBossKillsByRevive(hunterId, buildId);
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
   * Räumt den Evaluation Cache auf - behält nur die letzten 100 Einträge pro Hunter
   * Wird automatisch beim Store-Init aufgerufen um Speicher zu sparen
   */
  function cleanupEvaluationCache() {
    try {
      let totalRemoved = 0;
      
      Object.keys(evaluationCache.value).forEach(hunterId => {
        const cacheEntries = evaluationCache.value[hunterId];
        if (!cacheEntries || typeof cacheEntries !== 'object') return;
        
        // Konvertiere zu Array mit Timestamps
        const entriesArray = Object.entries(cacheEntries).map(([key, value]) => ({
          key,
          value,
          timestamp: value.timestamp || 0
        }));
        
        // Wenn mehr als 50 Einträge vorhanden sind
        if (entriesArray.length > 50) {
          // Sortiere nach Timestamp (neueste zuerst)
          entriesArray.sort((a, b) => b.timestamp - a.timestamp);

          // Behalte nur die neuesten 50
          const toKeep = entriesArray.slice(0, 50);
          const removed = entriesArray.length - 50;
          totalRemoved += removed;
          
          // Erstelle neues Cache-Objekt mit nur den neuesten Einträgen
          evaluationCache.value[hunterId] = Object.fromEntries(
            toKeep.map(entry => [entry.key, entry.value])
          );
          
          console.log(`🧹 Cleaned ${removed} old cache entries for ${hunterId}`);
        }
      });
      
      if (totalRemoved > 0) {
        console.log(`✅ Evaluation cache cleanup complete: ${totalRemoved} old entries removed`);
      }
    } catch (error) {
      console.error('❌ Evaluation cache cleanup failed:', error);
    }
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
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} cacheKey - Der Cache-Schlüssel
   * @param {Object} result - Das zu speichernde Ergebnis
   */
  function cacheEvaluationResult(hunterId, cacheKey, result) {
    if (!hunterId || !cacheKey || !result) return;
    
    // Maximale Anzahl an Cache-Einträgen pro Hunter begrenzen
    const MAX_CACHE_ENTRIES_PER_HUNTER = 20;
    
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

/**
 * Speichert Boss Kill by Revive Daten für einen Build
 * @param {string} hunterId - Die ID des Hunters
 * @param {string} buildId - Die ID des Builds
 * @param {Array} bossKillData - Die Boss Kill Daten
 * @param {number} sampleSize - Die Sample Size
 */
function cacheBossKillsByRevive(hunterId, buildId, bossKillData, sampleSize) {
  if (!hunterId || !buildId || !bossKillData) return;
  
  const cacheKey = `${hunterId}_${buildId}`;
  
  bossKillsByReviveCache.value[cacheKey] = {
    data: bossKillData,
    sampleSize: sampleSize,
    timestamp: Date.now()
  };
  
  console.log(`Boss Kill Rate data cached for ${cacheKey}:`, bossKillData);
}

/**
 * Holt Boss Kill by Revive Daten für einen Build
 * @param {string} hunterId - Die ID des Hunters
 * @param {string} buildId - Die ID des Builds
 * @returns {Object|null} - Die gecachten Daten oder null
 */
function getCachedBossKillsByRevive(hunterId, buildId) {
  if (!hunterId || !buildId) return null;
  
  const cacheKey = `${hunterId}_${buildId}`;
  const cached = bossKillsByReviveCache.value[cacheKey];
  
  if (cached) {
    console.log(`Boss Kill Rate data loaded from cache for ${cacheKey}`);
    return cached;
  }
  
  return null;
}

/**
 * Löscht Boss Kill by Revive Daten für einen Build
 * @param {string} hunterId - Die ID des Hunters
 * @param {string} buildId - Die ID des Builds
 */
function clearCachedBossKillsByRevive(hunterId, buildId) {
  if (!hunterId || !buildId) return;
  
  const cacheKey = `${hunterId}_${buildId}`;
  delete bossKillsByReviveCache.value[cacheKey];
  
  console.log(`Boss Kill Rate data cleared for ${cacheKey}`);
}

/**
 * Bereinigt alte Boss Kill by Revive Daten (älter als 1 Woche)
 */
function cleanupOldBossKillsData() {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const keysToRemove = [];
  
  Object.entries(bossKillsByReviveCache.value).forEach(([key, data]) => {
    if (data.timestamp && data.timestamp < oneWeekAgo) {
      keysToRemove.push(key);
    }
  });
  
  keysToRemove.forEach(key => {
    delete bossKillsByReviveCache.value[key];
  });
  
  if (keysToRemove.length > 0) {
    console.log(`Cleaned up ${keysToRemove.length} old Boss Kill Rate entries`);
  }
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
  
  // Initialisiere Hunter Level Settings und scanne vorhandene Builds
  initHunterLevelSettings(hunterId);
  scanBuildsForHighestLevel(hunterId);
  
  return { 
    hunterStats: hunterStats.value, 
    upgrades: upgrades.value, 
    hunterBuilds: hunterBuilds.value, 
    hunterIterations: hunterIterations.value,
    hunterSeedSettings: hunterSeedSettings.value,
    hunterLevelSettings: hunterLevelSettings.value
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

// Pending Build Import Funktionen
function setPendingBuildImport(buildData) {
  pendingBuildImport.value = buildData;
}

function getPendingBuildImport() {
  return pendingBuildImport.value;
}

function clearPendingBuildImport() {
  pendingBuildImport.value = null;
}

// Hunter Level Settings Funktionen
/**
 * Initialisiert die Level-Einstellungen für einen Hunter falls noch nicht vorhanden
 * @param {string} hunterId - Die ID des Hunters
 */
function initHunterLevelSettings(hunterId) {
  if (!hunterId) return;
  
  if (!hunterLevelSettings.value[hunterId]) {
    hunterLevelSettings.value[hunterId] = {
      highestLevelReached: 0,
      showAdvancedTalents: false,
      manualOverride: false
    };
  }
}

/**
 * Aktualisiert das höchste erreichte Level eines Hunters
 * @param {string} hunterId - Die ID des Hunters
 * @param {number} level - Das erreichte Level
 */
function updateHighestLevel(hunterId, level) {
  if (!hunterId || typeof level !== 'number') return;
  
  initHunterLevelSettings(hunterId);
  
  const currentSettings = hunterLevelSettings.value[hunterId];
  const currentHighest = currentSettings.highestLevelReached || 0;
  
  if (level > currentHighest) {
    currentSettings.highestLevelReached = level;
    
    // Automatisch Advanced Talents aktivieren bei Level >= 70
    if (level >= 70 && !currentSettings.manualOverride) {
      currentSettings.showAdvancedTalents = true;
    }
  }
}

/**
 * Scannt alle Builds eines Hunters nach dem höchsten Level
 * @param {string} hunterId - Die ID des Hunters
 */
function scanBuildsForHighestLevel(hunterId) {
  if (!hunterId) return;
  
  const builds = hunterBuilds.value[hunterId] || [];
  let highestLevel = 0;
  let hasUltimaTalent = false;
  
  builds.forEach(build => {
    // Prüfe verschiedene Level-Quellen
    let buildLevel = 0;
    
    // 1. Build overrides (höchste Priorität)
    if (build.overrides && build.overrides.level) {
      buildLevel = parseInt(build.overrides.level);
    }
    // 2. Direkte build data
    else if (build.level) {
      buildLevel = parseInt(build.level);
    }
    // 3. Hunter stats (als Fallback)
    else if (hunterStats.value[hunterId] && hunterStats.value[hunterId].level) {
      buildLevel = parseInt(hunterStats.value[hunterId].level);
    }
    
    if (buildLevel > highestLevel) {
      highestLevel = buildLevel;
    }
    
    // KRITISCH: Prüfe ob irgendein Build das Ultima Talent verwendet
    // Wenn ja, aktiviere automatisch Advanced Talents unabhängig vom Level
    if (build.talents && build.talents.ultima && build.talents.ultima > 0) {
      hasUltimaTalent = true;
    }
    
    // Prüfe auch in Overrides nach Ultima
    if (build.overrides && build.overrides['talents.ultima'] && build.overrides['talents.ultima'] > 0) {
      hasUltimaTalent = true;
    }
  });
  
  if (highestLevel > 0) {
    updateHighestLevel(hunterId, highestLevel);
  }
  
  // SICHERHEITSMASCHNAHME: Wenn Ultima Talent verwendet wird, automatisch aktivieren
  if (hasUltimaTalent) {
    const currentSettings = getHunterLevelSettings(hunterId);
    if (!currentSettings.showAdvancedTalents) {
      console.log(`[SAFETY] Activating advanced talents for ${hunterId} - Ultima talent detected in builds`);
      toggleAdvancedTalents(hunterId, true);
    }
  }
}

/**
 * Manueller Toggle der Advanced Talents Sichtbarkeit
 * @param {string} hunterId - Die ID des Hunters
 * @param {boolean} show - Ob Advanced Talents angezeigt werden sollen
 */
function toggleAdvancedTalents(hunterId, show) {
  if (!hunterId) return;
  
  initHunterLevelSettings(hunterId);
  
  const settings = hunterLevelSettings.value[hunterId];
  settings.showAdvancedTalents = show;
  settings.manualOverride = true; // Markiere als manuell überschrieben
}

/**
 * Gibt die Level-Einstellungen für einen Hunter zurück
 * @param {string} hunterId - Die ID des Hunters
 * @returns {Object} Die Level-Einstellungen
 */
function getHunterLevelSettings(hunterId) {
  if (!hunterId) return null;
  
  initHunterLevelSettings(hunterId);
  return hunterLevelSettings.value[hunterId];
}

/**
 * Prüft ob Advanced Talents für einen Hunter angezeigt werden sollen
 * @param {string} hunterId - Die ID des Hunters
 * @returns {boolean} Ob Advanced Talents angezeigt werden sollen
 */
function shouldShowAdvancedTalents(hunterId) {
  if (!hunterId) return false;
  
  const settings = getHunterLevelSettings(hunterId);
  return settings ? settings.showAdvancedTalents : false;
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
    hunterSeedSettings, 
    bossKillsByReviveCache,
    pendingBuildImport,
    hunterLevelSettings,
    buildCategories,
    categoryOverrideUpdateCounter, // NEU: Export des Counters
    
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
    cleanupEvaluationCache,
    
    // Display-Einstellungen
    saveDisplaySettings,
    getDisplaySettings,
    
    // Seed-Einstellungen 
    getHunterSeedSetting,
    saveHunterSeedSetting,
    loadHunterSeedSettings,

    // Boss Kill by Revive Cache Funktionen
    cacheBossKillsByRevive,
    getCachedBossKillsByRevive,
    clearCachedBossKillsByRevive,
    cleanupOldBossKillsData,

    // Pending Build Import Funktionen
    setPendingBuildImport,
    getPendingBuildImport,
    clearPendingBuildImport,

    // Hunter Level Settings Funktionen
    initHunterLevelSettings,
    updateHighestLevel,
    scanBuildsForHighestLevel,
    toggleAdvancedTalents,
    getHunterLevelSettings,
    shouldShowAdvancedTalents,

    // Build Categories Funktionen
    buildCategories,
    categoryReferenceBuild,
    initBuildCategories,
    createCategory,
    updateCategory,
    updateCategoryOrder,
    deleteCategory,
    getCategories,
    moveBuildToCategory,
    copyBuildToCategory,
    getBuildCategory,
    getBuildsByCategory,
    getSubCategories,
    setCategoryReferenceBuild,
    getCategoryReferenceBuild,
    getCategoryReferenceBuildData,
    updateCategoryOverrides,
    getCategoryOverrides,
    getEffectiveBuildOverrides,
    getCategoryReferenceBuildData
  }

  // ========================
  // BUILD CATEGORIES - Verschachtelte Kategorien
  // ========================

  /**
   * Initialisiert die Build-Kategorien für einen Hunter
   * @param {string} hunterId - Die ID des Hunters
   */
  function initBuildCategories(hunterId) {
    if (!buildCategories.value[hunterId]) {
      buildCategories.value[hunterId] = {
        categories: [
          { id: 'active', name: 'Active', color: 'blue', isSystem: true, parentId: null, order: 0, overrides: {} },
          { id: 'archived', name: 'Archived', color: 'gray', isSystem: true, parentId: null, order: 1, overrides: {} }
        ],
        buildCategoryMap: {} // buildId -> categoryId
      };
    }
    
    // Ensure all existing categories have an overrides object
    buildCategories.value[hunterId].categories.forEach(cat => {
      if (!cat.overrides) {
        cat.overrides = {};
      }
    });
    
    // Rückwärtskompatibilität: Migriere bereits archivierte Builds (läuft bei jedem Init)
    const builds = hunterBuilds.value[hunterId];
    if (builds && builds.length > 0) {
      builds.forEach(build => {
        // Nur migrieren, wenn noch nicht in der Map
        if (build.isArchived && !buildCategories.value[hunterId].buildCategoryMap[build.id]) {
          buildCategories.value[hunterId].buildCategoryMap[build.id] = 'archived';
        }
      });
    }
    
    // Initialize reference builds map for this hunter
    if (!categoryReferenceBuild.value[hunterId]) {
      categoryReferenceBuild.value[hunterId] = {};
    }
    
    return buildCategories.value[hunterId];
  }

  /**
   * Erstellt eine neue Kategorie
   * @param {string} hunterId - Die ID des Hunters  
   * @param {Object} category - { name, color, parentId }
   */
  function createCategory(hunterId, category) {
    initBuildCategories(hunterId);
    
    const newCategory = {
      id: `custom-${Date.now()}`,
      name: category.name,
      color: category.color || 'purple',
      parentId: category.parentId || null,
      isSystem: false,
      order: buildCategories.value[hunterId].categories.length,
      overrides: {} // NEU: Jede Kategorie hat eigene Overrides
    };
    
    buildCategories.value[hunterId].categories.push(newCategory);
    return newCategory;
  }

  /**
   * Aktualisiert eine Kategorie (nur custom categories)
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} categoryId - Die ID der Kategorie
   * @param {Object} updates - { name?, color?, parentId? }
   */
  function updateCategory(hunterId, categoryId, updates) {
    const categories = buildCategories.value[hunterId]?.categories;
    if (!categories) return;
    
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // System categories can only update parentId (for nesting), not name/color
    if (category.isSystem) {
      if (updates.parentId !== undefined) {
        category.parentId = updates.parentId;
      }
      return;
    }
    
    // Custom categories can update everything
    Object.assign(category, updates);
  }

  /**
   * Aktualisiert die Reihenfolge von Kategorien
   * @param {string} hunterId - Die ID des Hunters
   * @param {Array} orderedCategories - Array von Kategorien in neuer Reihenfolge
   * @param {string|null} parentId - Die ID der Parent-Kategorie (null für Root, undefined = nicht ändern)
   * @param {boolean} updateParent - Ob der parentId aktualisiert werden soll (default: true für Kompatibilität)
   */
  function updateCategoryOrder(hunterId, orderedCategories, parentId = null, updateParent = true) {
    const data = buildCategories.value[hunterId];
    if (!data) return;
    
    console.log('updateCategoryOrder called:', {
      hunterId,
      parentId,
      updateParent,
      orderedCategories: orderedCategories.map(c => ({ id: c.id, name: c.name, currentOrder: c.order }))
    });
    
    // Update order property for each category
    orderedCategories.forEach((category, index) => {
      const cat = data.categories.find(c => c.id === category.id);
      if (cat) {
        console.log(`Updating ${cat.name}: order ${cat.order} -> ${index}, parentId ${cat.parentId}${updateParent ? ` -> ${parentId}` : ' (unchanged)'}`);
        cat.order = index;
        // Only update parentId if updateParent is true
        if (updateParent) {
          cat.parentId = parentId;
        }
      } else {
        console.warn(`Category ${category.id} not found in store!`);
      }
    });
    
    // Trigger reactivity by creating a new array reference
    data.categories = [...data.categories];
    
    console.log('Categories after update:', data.categories.map(c => ({ 
      id: c.id, 
      name: c.name, 
      order: c.order,
      parentId: c.parentId 
    })));
  }

  /**
   * Löscht eine Kategorie (nur custom categories)
   * Verschiebt alle Builds in dieser Kategorie zu 'active'
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} categoryId - Die ID der Kategorie
   */
  function deleteCategory(hunterId, categoryId) {
    const data = buildCategories.value[hunterId];
    if (!data) return;
    
    const category = data.categories.find(c => c.id === categoryId);
    if (!category || category.isSystem) {
      console.warn('Cannot delete system category');
      return;
    }
    
    // Verschiebe alle Builds zu 'active'
    Object.keys(data.buildCategoryMap).forEach(buildId => {
      if (data.buildCategoryMap[buildId] === categoryId) {
        data.buildCategoryMap[buildId] = 'active';
      }
    });
    
    // Lösche auch alle Sub-Kategorien
    const subCategories = data.categories.filter(c => c.parentId === categoryId);
    subCategories.forEach(subCat => deleteCategory(hunterId, subCat.id));
    
    // Entferne die Kategorie
    data.categories = data.categories.filter(c => c.id !== categoryId);
  }

  /**
   * Aktualisiert die Overrides einer Kategorie
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} categoryId - Die ID der Kategorie
   * @param {Object} overrides - Die neuen Overrides
   */
  function updateCategoryOverrides(hunterId, categoryId, overrides) {
    initBuildCategories(hunterId);
    
    const category = buildCategories.value[hunterId].categories.find(c => c.id === categoryId);
    if (!category) {
      console.warn(`Category ${categoryId} not found`);
      return;
    }
    
    category.overrides = { ...overrides };
    
    // Inkrementiere den Counter um Re-Evaluation zu triggern
    categoryOverrideUpdateCounter.value++;
  }

  /**
   * Gibt die Overrides einer Kategorie zurück
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} categoryId - Die ID der Kategorie
   * @returns {Object} Die Overrides der Kategorie
   */
  function getCategoryOverrides(hunterId, categoryId) {
    initBuildCategories(hunterId);
    
    const category = buildCategories.value[hunterId].categories.find(c => c.id === categoryId);
    return category?.overrides || {};
  }

  /**
   * Gibt die effektiven Overrides für einen Build zurück (Category + Build)
   * Berücksichtigt auch Parent-Category-Overrides (hierarchisch)
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} buildId - Die ID des Builds
   * @returns {Object} Merged Overrides (Parent-Category-Overrides + Category-Overrides + Build-Overrides)
   */
  function getEffectiveBuildOverrides(hunterId, buildId) {
    const build = getBuildsForHunter(hunterId).find(b => b.id === buildId);
    if (!build) return {};
    
    const categoryId = getBuildCategory(hunterId, buildId);
    if (!categoryId) return build.overrides || {};
    
    // Sammle alle Overrides von der Wurzel bis zur aktuellen Kategorie
    const allCategories = getCategories(hunterId);
    const currentCategory = allCategories.find(c => c.id === categoryId);
    if (!currentCategory) return build.overrides || {};
    
    // Baue die Kategorie-Hierarchie auf (von Root zu aktueller Kategorie)
    const categoryHierarchy = [];
    let category = currentCategory;
    
    while (category) {
      categoryHierarchy.unshift(category); // Am Anfang einfügen (damit Root zuerst kommt)
      
      if (category.parentId) {
        category = allCategories.find(c => c.id === category.parentId);
      } else {
        category = null;
      }
    }
    
    // Merge Overrides: Root -> Sub -> Sub-Sub -> ... -> Build
    // Spätere Overrides überschreiben frühere
    let effectiveOverrides = {};
    
    // 1. Parent-Category-Overrides (von Root bis zur direkten Parent)
    for (const cat of categoryHierarchy) {
      const catOverrides = cat.overrides || {};
      effectiveOverrides = {
        ...effectiveOverrides,
        ...catOverrides
      };
    }
    
    // 2. Build-Overrides (höchste Priorität)
    const buildOverrides = build.overrides || {};
    effectiveOverrides = {
      ...effectiveOverrides,
      ...buildOverrides
    };
    
    return effectiveOverrides;
  }

  /**
   * Gibt alle Kategorien zurück, sortiert nach order
   * @param {string} hunterId - Die ID des Hunters
   * @returns {Array} Array von Kategorien
   */
  function getCategories(hunterId) {
    initBuildCategories(hunterId);
    return buildCategories.value[hunterId].categories.sort((a, b) => a.order - b.order);
  }

  /**
   * Verschiebt einen Build in eine Kategorie
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} buildId - Die ID des Builds
   * @param {string} categoryId - Die ID der Kategorie
   */
  function moveBuildToCategory(hunterId, buildId, categoryId) {
    initBuildCategories(hunterId);
    
    const data = buildCategories.value[hunterId];
    const oldCategoryId = data.buildCategoryMap[buildId];
    
    // Update builds array
    const builds = hunterBuilds.value[hunterId];
    if (!builds) return;
    
    // Nur Reihenfolge ändern, wenn Kategorie gewechselt wurde
    if (oldCategoryId !== categoryId) {
      const buildIndex = builds.findIndex(b => b.id === buildId);
      if (buildIndex === -1) return;
      
      console.log('\n=== MOVE BUILD DEBUG ===');
      console.log('Moving build:', builds[buildIndex].name, 'from index:', buildIndex);
      console.log('From category:', oldCategoryId, 'to:', categoryId);
      console.log('Array BEFORE move (with OLD categories):', builds.map((b, i) => {
        const cat = data.buildCategoryMap[b.id] || (b.isArchived ? 'archived' : 'active');
        return `[${i}] ${b.name} (${cat})`;
      }));
      
      // Finde den letzten Build in der Ziel-Kategorie (AUSSER dem moved Build selbst!)
      let lastTargetIndex = -1;
      for (let i = builds.length - 1; i >= 0; i--) {
        // Überspringe den Build, der verschoben wird (nach ID, nicht Index!)
        if (builds[i].id === buildId) {
          console.log('Skipping moved build at index:', i);
          continue;
        }
        
        const bCategoryId = data.buildCategoryMap[builds[i].id] || (builds[i].isArchived ? 'archived' : 'active');
        if (bCategoryId === categoryId) {
          lastTargetIndex = i;
          console.log('Found last build in target category at index:', i, '(', builds[i].name, ')');
          break;
        }
      }
      
      // Berechne Insert-Position
      let insertIndex;
      if (lastTargetIndex === -1) {
        // Kategorie ist leer: Füge am Ende ein
        insertIndex = builds.length - 1;
        console.log('Target category is EMPTY, insertIndex:', insertIndex);
      } else if (buildIndex < lastTargetIndex) {
        // Build kommt von LINKS: Nach Entfernen wird lastTargetIndex zu lastTargetIndex-1, also einfügen bei lastTargetIndex
        insertIndex = lastTargetIndex;
        console.log('Build comes from LEFT, insertIndex:', insertIndex);
      } else {
        // Build kommt von RECHTS: lastTargetIndex bleibt gleich, einfügen bei lastTargetIndex+1
        insertIndex = lastTargetIndex + 1;
        console.log('Build comes from RIGHT, insertIndex:', insertIndex);
      }
      
      // Jetzt entfernen
      const [movedBuild] = builds.splice(buildIndex, 1);
      console.log('After removal, array length:', builds.length);
      
      // Jetzt erst die Kategorie updaten (NACH dem Entfernen, VOR dem Einfügen)
      data.buildCategoryMap[buildId] = categoryId;
      if (movedBuild) {
        movedBuild.isArchived = categoryId === 'archived';
      }
      
      // Und an korrigierter Position einfügen
      builds.splice(insertIndex, 0, movedBuild);
      console.log('After insert at', insertIndex, ', array:', builds.map((b, i) => {
        const cat = data.buildCategoryMap[b.id] || (b.isArchived ? 'archived' : 'active');
        return `[${i}] ${b.name} (${cat}${b.id === buildId ? ' <- MOVED' : ''})`;
      }));
      console.log('=== END DEBUG ===\n');
      
      // Speichere die neue Reihenfolge
      saveBuildsOrder(hunterId, builds);
    } else {
      // Kategorie ist gleich geblieben, nur Mapping sicherstellen
      data.buildCategoryMap[buildId] = categoryId;
      const build = builds.find(b => b.id === buildId);
      if (build) {
        build.isArchived = categoryId === 'archived';
      }
    }
  }

  /**
   * Kopiert einen Build in eine neue Kategorie (erstellt eine Kopie)
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} buildId - Die ID des zu kopierenden Builds
   * @param {string} categoryId - Die ID der Ziel-Kategorie
   */
  function copyBuildToCategory(hunterId, buildId, categoryId) {
    initBuildCategories(hunterId);
    
    const builds = hunterBuilds.value[hunterId];
    if (!builds) return;
    
    const originalBuild = builds.find(b => b.id === buildId);
    if (!originalBuild) return;
    
    // Erstelle eine tiefe Kopie des Builds
    const buildCopy = JSON.parse(JSON.stringify(originalBuild));
    
    // Generiere neue ID für die Kopie
    buildCopy.id = Date.now().toString();
    
    // Intelligente Namens-Logik (wie bei cloneBuild)
    let baseName = originalBuild.name;
    let copyNumber = 1;
    
    // Prüfe, ob der Name bereits "(Copy)" oder "(Copy X)" enthält
    const copyRegex = /\s*\(Copy(?:\s+(\d+))?\)\s*$/;
    const match = baseName.match(copyRegex);
    
    if (match) {
      // Entferne den "(Copy X)" Teil vom Namen
      baseName = baseName.replace(copyRegex, '');
      
      // Wenn eine Zahl in den Klammern war, verwende sie als Startpunkt
      if (match[1]) {
        copyNumber = parseInt(match[1]) + 1;
      } else {
        copyNumber = 2; // Wenn es nur "(Copy)" war, starte mit "(Copy 2)"
      }
    }
    
    // Suche nach existierenden Kopien mit dem gleichen Basisnamen in ALLEN Builds
    const existingCopies = builds.filter(b => {
      const existingMatch = b.name.match(new RegExp(`^${escapeRegExp(baseName)}\\s*\\(Copy(?:\\s+(\\d+))?\\)\\s*$`));
      return existingMatch !== null;
    });
    
    // Finde die höchste existierende Kopienummer
    existingCopies.forEach(b => {
      const existingMatch = b.name.match(/\(Copy\s+(\d+)\)/);
      if (existingMatch && existingMatch[1]) {
        const num = parseInt(existingMatch[1]);
        if (num >= copyNumber) {
          copyNumber = num + 1;
        }
      }
    });
    
    // Setze den neuen Namen
    if (copyNumber === 1) {
      buildCopy.name = `${baseName} (Copy)`;
    } else {
      buildCopy.name = `${baseName} (Copy ${copyNumber})`;
    }
    
    // Setze Kategorie für die Kopie
    const data = buildCategories.value[hunterId];
    data.buildCategoryMap[buildCopy.id] = categoryId;
    buildCopy.isArchived = categoryId === 'archived';
    
    // Finde Position zum Einfügen (am Ende der Ziel-Kategorie)
    let insertIndex = -1;
    for (let i = builds.length - 1; i >= 0; i--) {
      const bCategoryId = data.buildCategoryMap[builds[i].id] || (builds[i].isArchived ? 'archived' : 'active');
      if (bCategoryId === categoryId) {
        insertIndex = i + 1;
        break;
      }
    }
    
    // Wenn Kategorie leer ist, füge am Ende ein
    if (insertIndex === -1) {
      insertIndex = builds.length;
    }
    
    // Füge die Kopie ein
    builds.splice(insertIndex, 0, buildCopy);
    
    console.log('Build copied:', originalBuild.name, '→', buildCopy.name, 'to category:', categoryId);
    
    // Speichere die neue Reihenfolge
    saveBuildsOrder(hunterId, builds);
  }
  
  // Hilfsfunktion zum Escapen von speziellen Zeichen in RegExp
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Gibt die Kategorie eines Builds zurück
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} buildId - Die ID des Builds
   * @returns {string} Die Kategorie-ID
   */
  function getBuildCategory(hunterId, buildId) {
    initBuildCategories(hunterId);
    
    const categoryId = buildCategories.value[hunterId].buildCategoryMap[buildId];
    if (categoryId) return categoryId;
    
    // Fallback: Wenn nicht gemappt, prüfe isArchived Flag
    const builds = hunterBuilds.value[hunterId];
    if (builds) {
      const build = builds.find(b => b.id === buildId);
      if (build && build.isArchived) {
        return 'archived';
      }
    }
    
    return 'active';
  }

  /**
   * Gibt alle Builds in einer Kategorie zurück (inkl. Sub-Kategorien)
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} categoryId - Die ID der Kategorie
   * @param {boolean} includeSubCategories - Inkludiere Sub-Kategorien (default: false)
   * @returns {Array} Array von Builds
   */
  function getBuildsByCategory(hunterId, categoryId, includeSubCategories = false) {
    initBuildCategories(hunterId);
    
    // WICHTIG: Nutze geordnete Builds, nicht ungeordnete!
    const allBuilds = getOrderedBuildsForHunter(hunterId) || [];
    const categoryIds = [categoryId];
    
    // Füge Sub-Kategorien hinzu wenn gewünscht
    if (includeSubCategories) {
      const subCategories = getSubCategories(hunterId, categoryId);
      categoryIds.push(...subCategories.map(c => c.id));
    }
    
    const filteredBuilds = allBuilds.filter(build => {
      const buildCategoryId = getBuildCategory(hunterId, build.id);
      return categoryIds.includes(buildCategoryId);
    });
    
    return filteredBuilds;
  }

  /**
   * Gibt alle Sub-Kategorien einer Kategorie zurück (rekursiv)
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} parentId - Die ID der Parent-Kategorie
   * @returns {Array} Array von Sub-Kategorien
   */
  function getSubCategories(hunterId, parentId) {
    const categories = getCategories(hunterId);
    const direct = categories.filter(c => c.parentId === parentId);
    const all = [...direct];
    
    // Rekursiv alle Sub-Kategorien sammeln
    direct.forEach(cat => {
      all.push(...getSubCategories(hunterId, cat.id));
    });
    
    return all;
  }

  /**
   * Setzt den Reference Build für eine Kategorie
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} categoryId - Die ID der Kategorie
   * @param {string} buildId - Die ID des Builds
   */
  function setCategoryReferenceBuild(hunterId, categoryId, buildId) {
    if (!categoryReferenceBuild.value[hunterId]) {
      categoryReferenceBuild.value[hunterId] = {};
    }
    categoryReferenceBuild.value[hunterId][categoryId] = buildId;
  }

  /**
   * Gibt den Reference Build für eine Kategorie zurück
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} categoryId - Die ID der Kategorie
   * @returns {string|null} Build ID oder null
   */
  function getCategoryReferenceBuild(hunterId, categoryId) {
    const refBuild = categoryReferenceBuild.value[hunterId]?.[categoryId];
    
    // Wenn kein Reference Build gesetzt ist, nimm den ersten Build der Kategorie
    if (!refBuild) {
      const builds = getBuildsByCategory(hunterId, categoryId, false);
      if (builds.length > 0) {
        return builds[0].id;
      }
      return null;
    }
    
    return refBuild;
  }

  /**
   * Gibt den Reference Build für die aktuelle Kategorie zurück (computed helper)
   * @param {string} hunterId - Die ID des Hunters
   * @param {string} categoryId - Die ID der Kategorie
   * @returns {Object|null} Build Objekt oder null
   */
  function getCategoryReferenceBuildData(hunterId, categoryId) {
    const refBuildId = getCategoryReferenceBuild(hunterId, categoryId);
    if (!refBuildId) return null;
    
    const builds = getBuildsForHunter(hunterId);
    return builds?.find(b => b.id === refBuildId) || null;
  }

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
      'hunterSeedSettings',
      'bossKillsByReviveCache',
      'hunterLevelSettings',
      'buildCategories',
      'categoryReferenceBuild'
    ]
  }
});