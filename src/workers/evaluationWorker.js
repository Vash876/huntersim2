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

// Debug-Ausgaben für die Parameter
console.log("Anzahl der Parameter für Borge:", BORGE_PARAMS.length);
console.log("Anzahl der Parameter für Ozzy:", OZZY_PARAMS.length);
console.log("Anzahl der Parameter für Knox:", KNOX_PARAMS.length);

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
  console.log(`Parameter ${param} nicht gefunden, verwende 0`);
  return 0;
}

/**
 * Parst die Evaluierungsergebnisse und extrahiert die relevanten Daten
 */
function parseEvalResults(evalResults, hunterId) {
  if (!evalResults || !evalResults.length || !evalResults[0]) {
    console.error(`Keine gültigen Evaluierungsergebnisse für ${hunterId}:`, evalResults);
    return {};
  }
  
  const result = evalResults[0];
  console.log(`Erhaltene Ergebnisse für ${hunterId}:`, result.length, "Elemente");
  
  // Basis-Ergebnis
  const baseResult = {
    lootPerMin: result[0],
    avgStage: result[1],
    avgTime: result[2],
    minStage: result[3],
    maxStage: result[4],
    bossHpPercent: result[5],
    bossKillRate: result[6]
  };
  
  // Alle Hunter haben jetzt die gleiche Struktur (13 Elemente)
  Object.assign(baseResult, {
    mat1: result[7],  // Mat1 (Borge/Ozzy) oder Glac (Knox)
    mat2: result[8],  // Mat2 (Borge/Ozzy) oder Quartz (Knox)
    mat3: result[9],  // Mat3 (Borge/Ozzy) oder Tess (Knox)
    xp: result[10],   // XP
    stats: result[11] // Stats
  });
  
  // Stage-Verteilung extrahieren - Jetzt aus dem letzten Element (Index 12)
  let stageDistribution = [];
  
  try {
    // Der letzte Eintrag im Array enthält die Stage-Progress-Daten als JSON-String
    const progressString = result[12];
    
    if (typeof progressString === 'string' && progressString.startsWith('{')) {
      const progressObj = JSON.parse(progressString);
      
      // Konvertieren des Progress-Objekts in ein Array für die Anzeige
      stageDistribution = Object.entries(progressObj).map(([stage, count]) => ({
        stage: parseInt(stage),
        count: count,
        percentage: count / (baseResult.iterations || 1000) * 100
      })).sort((a, b) => a.stage - b.stage);
      
      baseResult.stageDistribution = stageDistribution;
    } else if (Array.isArray(progressString)) {
      // Falls es bereits ein Array ist
      baseResult.stageDistribution = progressString;
    }
  } catch (error) {
    console.error('Fehler beim Parsen der Stage-Verteilung:', error);
    baseResult.stageDistribution = [];
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
  console.log(`===== DEBUGGING PARAMETER-ÜBERGABE FÜR ${hunterId} =====`);
  console.log("Anzahl der erwarteten Parameter:", paramConfig.length);
  
  // Parameter extrahieren mit ausführlichen Logs
  const params = paramConfig.map((param, index) => {
    const value = extractParamValue(storeData, hunterId, buildData, param);
    console.log(`Parameter [${index}] ${param} = ${value}`);
    return value;
  });
  
  // Wichtige Parameter für Loot-Berechnung hervorheben
  console.log("\n===== WICHTIGE PARAMETER FÜR LOOT-BERECHNUNG =====");
  
  // Iterations
  const itersIndex = paramConfig.indexOf('iterations');
  console.log(`Iterations: ${itersIndex >= 0 ? params[itersIndex] : 'nicht gefunden'} (Index: ${itersIndex})`);
  
  // Parameter, die möglicherweise die Loot-Berechnung beeinflussen könnten
  const lootRelevantParams = ['ll', 'pog', 'omen', 'fow', 'ultimaTalent', 'scavengers'];
  lootRelevantParams.forEach(param => {
    const index = paramConfig.indexOf(param);
    if (index >= 0) {
      console.log(`${param}: ${params[index]} (Index: ${index})`);
    } else {
      console.log(`${param}: nicht gefunden`);
    }
  });
  
  // Prüfen, ob die Parameter-Anzahl korrekt ist
  if (params.length !== paramConfig.length) {
    console.error(`Parameter-Anzahl stimmt nicht überein! Erwartet: ${paramConfig.length}, Erhalten: ${params.length}`);
  }
  
  // Evaluierung durchführen
  try {
    console.log(`\nWorker: Evaluiere ${hunterId} mit ${params.length} Parametern`);
    
    // Speichere die aktuelle Zeit für Performance-Messung
    const startTime = performance.now();
    
    let evalResults;
    
    // ALLE HUNTER VERWENDEN JETZT WASM!
    console.log(`Worker: WASM-Funktion wird aufgerufen für ${hunterId}...`);
    evalResults = await evalFn(...params);
    
    // Berechne die Ausführungszeit
    const endTime = performance.now();
    console.log(`Evaluierung abgeschlossen in ${(endTime - startTime).toFixed(2)} ms`);
    
    // Debug-Ausgabe der Rohergebnisse
    console.log("\n===== ROHE EVALUIERUNGSERGEBNISSE =====");
    if (evalResults && evalResults.length > 0 && evalResults[0]) {
      console.log(`Loot per minute (raw): ${evalResults[0][0]}`);
      console.log(`Average stage (raw): ${evalResults[0][1]}`);
      console.log(`Average time (raw): ${evalResults[0][2]}`);
      console.log(`Mat1 (raw): ${evalResults[0][7]}`);
      console.log(`Mat2 (raw): ${evalResults[0][8]}`);
      console.log(`Mat3 (raw): ${evalResults[0][9]}`);
    } else {
      console.error("Keine gültigen Evaluierungsergebnisse erhalten!");
    }
    
    // Parsen und Rückgabe der Ergebnisse
    const parsedResults = parseEvalResults(evalResults, hunterId);
    
    // Debug-Ausgabe der geparsten Ergebnisse
    console.log("\n===== GEPARSTE EVALUIERUNGSERGEBNISSE =====");
    console.log(`lootPerMin: ${parsedResults.lootPerMin}`);
    console.log(`avgStage: ${parsedResults.avgStage}`);
    console.log(`mat1: ${parsedResults.mat1}`);
    console.log(`mat2: ${parsedResults.mat2}`);
    console.log(`mat3: ${parsedResults.mat3}`);
    
    console.log("===== ENDE DER PARAMETER-DEBUG-AUSGABE =====\n");
    
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