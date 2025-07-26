import * as Comlink from 'comlink';
import { HUNTERS } from '../constants/hunters';

// Direkte Imports der Eval-Funktionen
import { EVALBORGE_WASM } from './wasmBorge.js';  // WASM für Borge
import { EVALOZZY_WASM } from './wasmOzzy.js';    // WASM für Ozzy
import { EVALKNOX_WASM } from './wasmKnox.js';    // WASM für Knox

// Import der EVAL_PARAMS für jeden Hunter
import { EVAL_PARAMS as BORGE_PARAMS } from '../constants/borge.js';
import { EVAL_PARAMS as OZZY_PARAMS } from '../constants/ozzy.js';
import { EVAL_PARAMS as KNOX_PARAMS } from '../constants/knox.js';

// Worker-Zustand
let evalFunctions = {
  borge: EVALBORGE_WASM,  // WASM für Borge
  ozzy: EVALOZZY_WASM,    // WASM für Ozzy
  knox: EVALKNOX_WASM     // WASM für Knox
};

// EVAL_PARAMS aus den importierten Konstanten
const paramsConfig = {
  borge: BORGE_PARAMS,
  ozzy: OZZY_PARAMS,
  knox: KNOX_PARAMS
};

let isInitialized = true;
let initializationPromise = null;

/**
 * Initialisierung wird nicht mehr benötigt, da alles direkt importiert wird
 */
async function initializeWorker() {
  if (isInitialized) return Promise.resolve();
  return Promise.resolve();
}

/**
 * Parameter-Extraktion mit Unterstützung für useSeeded
 */
function extractParamValue(storeData, hunterId, buildData, param) {
  // Spezielle Behandlung für useSeeded-Parameter
  if (param === 'useSeeded') {    
    // Muss explizit prüfen, ob der Wert === false ist
    const seedSetting = storeData.hunterSeedSettings?.[hunterId];
    
    // Korrekte Prüfung für Boolean-Werte
    if (seedSetting === false) {
      return false;
    }
    
    return true;
  }

  // Override-Werte haben höchste Priorität
  if (buildData?.overrides && param in buildData.overrides) {
    // Spezielle Behandlung für diamondspecials.hunterloot in Overrides
    if (param === 'upgrades.diamondspecials.hunterloot') {
      const level = buildData.overrides[param] || 0;
      return 1 + level * 0.025; // Level 10 = 1.25
    } else if (param === 'upgrades.diamondspecials.reviveboost') {
      const level = buildData.overrides[param] || 0;
      return level * 3; // Level 10 = 30
    }
    return buildData.overrides[param];
  }

  // Spezielle Parameter behandeln
  if (param === 'iterations') {
    return storeData.hunterIterations?.[hunterId] || 1000;
  }
  if (param === 'lvl') {
    return buildData.level || 0;
  }
  if (param === 'stage' || param === 'maxStage') {
    return storeData.hunterStats?.[hunterId]?.stage || 0;
  }

  // Build-spezifische Parameter (talents oder attributes)
  if (buildData?.talents && param in buildData.talents) {
    return buildData.talents[param];
  }
  if (buildData?.attributes && param in buildData.attributes) {
    return buildData.attributes[param];
  }

  // Hunter-Stats aus dem Store
  if (storeData.hunterStats?.[hunterId] && param in storeData.hunterStats[hunterId]) {
    return storeData.hunterStats[hunterId][param];
  }

  // Verbesserte Upgrades-Extraktion mit Mappings für verschiedene Formate
  if (param.startsWith('upgrades.')) {
    const parts = param.split('.');
    
    // Unterschiedliche Formate für Upgrade-Pfade abdecken
    let value;
    
    // Format: upgrades.category.key (z.B. upgrades.relics.r17)
    if (parts.length === 3) {
      const [_, category, key] = parts;
      
      // Spezielle Behandlung für diamondspecials.hunterloot
      if (category === 'diamondspecials' && key === 'hunterloot') {
        const level = storeData.upgrades?.[category]?.[key] || 0;
        return 1 + level * 0.025; // Level 10 = 1.25
      } else if (category === 'diamondspecials' && key === 'reviveboost') {
        const level = storeData.upgrades?.[category]?.[key] || 0;
        return level * 3;
      }
      
      value = storeData.upgrades?.[category]?.[key];
      
      // Versuche alternative Formate, wenn nichts gefunden wurde
      if (value === undefined) {
        // Format für Relics könnte anders sein
        if (category === 'relics' && key.startsWith('r')) {
          value = storeData.upgrades?.relics?.[key.substring(1)]; // "r17" -> "17"
        }
        
        // Format für Inscryptions 
        if (category === 'inscryptions' && key.startsWith('i')) {
          value = storeData.upgrades?.inscryptions?.[key.substring(1)]; // "i31" -> "31"
          // Oder möglicherweise als "inscryp31"
          if (value === undefined) {
            value = storeData.upgrades?.inscryptions?.[`inscryp${key.substring(1)}`]; // "i31" -> "inscryp31"
          }
        }
        
        // Format für gems_nodes
        if (category === 'gems_nodes') {
          // Beispiel: "attraction_gem3" -> "attraction.nodes.gem3"
          const nodeParts = key.split('_');
          if (nodeParts.length === 2) {
            value = storeData.upgrades?.gems?.[nodeParts[0]]?.nodes?.[nodeParts[1]];
          }
        }
      }
      
      return value || 0;
    }
    // Format: upgrades.category.subcategory.key (z.B. upgrades.gems.attraction.level)
    else if (parts.length === 4) {
      const [_, category, subcategory, key] = parts;
      return storeData.upgrades?.[category]?.[subcategory]?.[key] || 0;
    }
  }

  // Fallback - für alle sonstigen Parameter
  return 0;
}

/**
 * Parst die Evaluierungsergebnisse und extrahiert die relevanten Daten
 */
function parseEvalResults(evalResults, hunterId, buildData, sampleSize) {
  if (!evalResults || !evalResults.length || !evalResults[0]) {
    console.error(`Keine gültigen Evaluierungsergebnisse für ${hunterId}:`, evalResults);
    return {};
  }
  
  const result = evalResults[0];
  
  // Basis-Ergebnis
  const baseResult = {
    lootPerMin: result[0],
    avgStage: result[1],
    avgTime: result[2],
    minStage: result[3],
    maxStage: result[4],
    bossHpPercent: result[5],
    bossKillRate: result[6],
    mat1: result[7],
    mat2: result[8],
    mat3: result[9],
    xp: result[10],
    stats: result[11]
  };
  
  // Stage-Verteilung extrahieren (bestehend)
  let stageDistribution = [];
  
  try {
    const progressString = result[12];
    
    if (typeof progressString === 'string' && progressString.startsWith('{')) {
      const progressObj = JSON.parse(progressString);
      
      stageDistribution = Object.entries(progressObj).map(([stage, count]) => ({
        stage: parseInt(stage),
        count: count,
        percentage: count / (baseResult.iterations || 1000) * 100
      })).sort((a, b) => a.stage - b.stage);
      
      baseResult.stageDistribution = stageDistribution;
    }
  } catch (error) {
    console.error('Fehler beim Parsen der Stage-Verteilung:', error);
    baseResult.stageDistribution = [];
  }
  
  // Death Tracking extrahieren
  let deathDistribution = [];
  
  try {
    // Death Tracking 
    const deathData = result[13];
    
    // Prüfe ob es bereits ein Array ist (neue WASM Version)
    if (Array.isArray(deathData)) {
      deathDistribution = deathData.map(item => ({
        stage: item.stage, // ✅ Als String behalten: "351_1"
        count: item.count,
        percentage: item.count / (baseResult.iterations || 1000) * 100
      }));
      
    }
    // Falls es noch ein JSON String ist (alte Version)
    else if (typeof deathData === 'string' && deathData.startsWith('{')) {
      const deathObj = JSON.parse(deathData);
      
      deathDistribution = Object.entries(deathObj).map(([stage, count]) => ({
        stage: stage, // ✅ Als String behalten: "351_1"
        count: count,
        percentage: count / (baseResult.iterations || 1000) * 100
      }));
      
    }
    
    // Sortierung für "stage_revive" Format anpassen
    deathDistribution.sort((a, b) => {
      const [stageA, reviveA] = a.stage.split('_').map(Number);
      const [stageB, reviveB] = b.stage.split('_').map(Number);
      return stageA - stageB || reviveA - reviveB;
    });
    
    baseResult.deathDistribution = deathDistribution;
    
  } catch (error) {
    console.error('Fehler beim Parsen der Death-Verteilung:', error);
    baseResult.deathDistribution = [];
  }

  // Boss Kill by Revive Tracking extrahieren
  let bossKillsByRevive = [];
  
  try {
    const bossKillData = result[14];
    
    if (Array.isArray(bossKillData)) {
      bossKillsByRevive = bossKillData;
      
      baseResult.bossKillsByRevive = bossKillsByRevive;
      
      // ✅ JETZT funktioniert der postMessage Code:
      if (buildData?.id && bossKillsByRevive.length > 0) {
        self.postMessage({
          type: 'CACHE_BOSS_KILLS',
          data: {
            hunterId: hunterId,
            buildId: buildData.id,
            bossKillData: bossKillsByRevive,
            sampleSize: sampleSize || 1000
          }
        });
      }
    }
    
  } catch (error) {
    console.error('Fehler beim Parsen der Boss Kill by Revive Daten:', error);
    baseResult.bossKillsByRevive = [];
  }
  
  return baseResult;
}

/**
 * Evaluiert einen Build
 */
async function evaluate(hunterId, buildData, storeData) {  
  const evalFn = evalFunctions[hunterId];
  const paramConfig = paramsConfig[hunterId];
  
  if (!evalFn) {
    console.error(`Eval-Funktion für ${hunterId} nicht gefunden`);
    throw new Error(`Eval-Funktion für ${hunterId} nicht gefunden`);
  }
  
  if (!paramConfig) {
    console.error(`Parameter-Konfiguration für ${hunterId} nicht gefunden`);
    throw new Error(`Parameter-Konfiguration für ${hunterId} nicht gefunden`);
  }
  
  // Debugging: Ausführliche Parameter-Details
  
  // Parameter extrahieren mit ausführlichen Logs
  const params = paramConfig.map((param, index) => {
    const value = extractParamValue(storeData, hunterId, buildData, param);
    return value;
  });
  
  // Prüfen, ob die Parameter-Anzahl korrekt ist
  if (params.length !== paramConfig.length) {
    console.error(`Parameter-Anzahl stimmt nicht überein! Erwartet: ${paramConfig.length}, Erhalten: ${params.length}`);
  }
  
  // Evaluierung durchführen
  try {
    // Speichere die aktuelle Zeit für Performance-Messung
    const startTime = performance.now();
    
    let evalResults;
    
    // ALLE HUNTER VERWENDEN JETZT WASM!
    evalResults = await evalFn(...params);
    
    // Berechne die Ausführungszeit
    const endTime = performance.now();
    
    // Parsen und Rückgabe der Ergebnisse
    const parsedResults = parseEvalResults(evalResults, hunterId, buildData, storeData.hunterIterations?.[hunterId] || 1000);
    
    return parsedResults;
  } catch (error) {
    console.error(`Worker: Fehler bei der Evaluierung für ${hunterId}:`, error);
    console.error('Parameter:', params);
    throw error;
  }
}

// Worker-API
const evaluationService = {
  // Asynchrone evaluate-Methode
  evaluate
};

// API exponieren
Comlink.expose(evaluationService);