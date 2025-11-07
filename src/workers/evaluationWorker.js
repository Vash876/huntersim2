import * as Comlink from 'comlink';
import { HUNTERS } from '../constants/hunters';
import { GEM_UPGRADE_MAPPING } from '../constants/gemUpgradeMappings';

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

  // Spezielle Behandlung für Exodus Temporal Evolution Count
  if (param === 'upgrades.gems_nodes.exodus_temporalEvolutionCount') {
    // Borge: Berechnet Temporal + Evolution Upgrades wenn exodus_gem1 aktiv ist
    
    // ZUERST prüfen ob es einen direkten Override für exodus_temporalEvolutionCount gibt
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_temporalEvolutionCount' in buildData.overrides) {
      const overrideValue = buildData.overrides['upgrades.gems_nodes.exodus_temporalEvolutionCount'];
      console.log(`🔥 [Worker] Borge Exodus temporalEvolutionCount Override detected: ${overrideValue}`);
      return overrideValue;
    }
    
    // Ansonsten prüfen ob exodus_gem1 aktiviert ist (entweder via Override oder global)
    let hasExodusNode1;
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_gem1' in buildData.overrides) {
      hasExodusNode1 = buildData.overrides['upgrades.gems_nodes.exodus_gem1'] === 1;
      console.log(`🔥 [Worker] Borge Exodus Node 1 Override detected: ${hasExodusNode1}`);
    } else {
      // Fallback auf globalen Zustand
      const exodusGemState = storeData.gemPlannerStore?.gemStates?.exodus;
      hasExodusNode1 = exodusGemState?.nodes?.[0] || false;
      console.log(`🔥 [Worker] Borge Exodus Node 1 Global state: ${hasExodusNode1}`);
    }
    
    if (!hasExodusNode1) {
      console.log(`🔥 [Worker] Borge Exodus Node 1 not activated, returning 0 for temporalEvolutionCount`);
      return 0; // Node ist nicht aktiviert
    }
    
    // Wenn aktiviert, berechne die Anzahl der Temporal + Evolution Upgrades
    let upgradeCount = 0;
    
    // Count Temporal gem upgrades
    const temporalGemState = storeData.gemPlannerStore?.gemStates?.temporal;
    if (temporalGemState?.upgrades) {
      upgradeCount += Object.values(temporalGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    // Count Evolution gem upgrades
    const evolutionGemState = storeData.gemPlannerStore?.gemStates?.evolution;
    if (evolutionGemState?.upgrades) {
      upgradeCount += Object.values(evolutionGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    console.log(`🔥 [Worker] Borge Exodus temporalEvolutionCount calculated: ${upgradeCount}`);
    return upgradeCount;
  }
  
  if (param === 'upgrades.gems_nodes.exodus_gem3') {
    // Ozzy: Exodus Gem Node 3 - zählt Power + Innovation Upgrades
    
    // ZUERST prüfen ob ein Override existiert
    let hasExodusNode3;
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_gem3' in buildData.overrides) {
      hasExodusNode3 = buildData.overrides['upgrades.gems_nodes.exodus_gem3'] === 1;
      console.log(`🔵 [Worker] Ozzy Exodus Node 3 Override detected: ${hasExodusNode3}`);
    } else {
      // Fallback auf globalen Zustand
      const exodusGemState = storeData.gemPlannerStore?.gemStates?.exodus;
      hasExodusNode3 = exodusGemState?.nodes?.[2] || false; // Node 3 = Index 2
      console.log(`🔵 [Worker] Ozzy Exodus Node 3 Global state: ${hasExodusNode3}`);
    }
    
    if (!hasExodusNode3) {
      console.log(`🔵 [Worker] Ozzy Exodus Gem Node 3 not activated, returning 0`);
      return 0; // Node ist nicht aktiviert
    }
    
    // Wenn aktiviert, berechne die Anzahl der Power + Innovation Upgrades
    let upgradeCount = 0;
    
    // Count Power gem upgrades
    const powerGemState = storeData.gemPlannerStore?.gemStates?.power;
    if (powerGemState?.upgrades) {
      upgradeCount += Object.values(powerGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    // Count Innovation gem upgrades
    const innovationGemState = storeData.gemPlannerStore?.gemStates?.innovation;
    if (innovationGemState?.upgrades) {
      upgradeCount += Object.values(innovationGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    console.log(`🔥 [Worker] Ozzy Exodus Node 3 active - Power + Innovation upgrade count: ${upgradeCount}`);
    return upgradeCount;
  }

  // Spezielle Behandlung für Ozzy Exodus Power Innovation Count
  if (param === 'upgrades.gems_nodes.exodus_powerInnovationCount') {
    // Ozzy: Berechnet Power + Innovation Upgrades wenn exodus_gem3 aktiv ist
    
    // ZUERST prüfen ob es einen direkten Override für exodus_powerInnovationCount gibt
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_powerInnovationCount' in buildData.overrides) {
      const overrideValue = buildData.overrides['upgrades.gems_nodes.exodus_powerInnovationCount'];
      console.log(`🔵 [Worker] Ozzy Exodus powerInnovationCount Override detected: ${overrideValue}`);
      return overrideValue;
    }
    
    // Ansonsten prüfen ob exodus_gem3 aktiviert ist (entweder via Override oder global)
    let hasExodusNode3;
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_gem3' in buildData.overrides) {
      hasExodusNode3 = buildData.overrides['upgrades.gems_nodes.exodus_gem3'] === 1;
      console.log(`🔵 [Worker] Ozzy Exodus Node 3 Override detected: ${hasExodusNode3}`);
    } else {
      // Fallback auf globalen Zustand
      const exodusGemState = storeData.gemPlannerStore?.gemStates?.exodus;
      hasExodusNode3 = exodusGemState?.nodes?.[2] || false; // Node 3 = Index 2
      console.log(`🔵 [Worker] Ozzy Exodus Node 3 Global state: ${hasExodusNode3}`);
    }
    
    if (!hasExodusNode3) {
      console.log(`🔵 [Worker] Ozzy Exodus Node 3 not activated, returning 0 for powerInnovationCount`);
      return 0; // Node ist nicht aktiviert
    }
    
    // Wenn aktiviert, berechne die Anzahl der Power + Innovation Upgrades
    let upgradeCount = 0;
    
    // Count Power gem upgrades
    const powerGemState = storeData.gemPlannerStore?.gemStates?.power;
    if (powerGemState?.upgrades) {
      upgradeCount += Object.values(powerGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    // Count Innovation gem upgrades
    const innovationGemState = storeData.gemPlannerStore?.gemStates?.innovation;
    if (innovationGemState?.upgrades) {
      upgradeCount += Object.values(innovationGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    console.log(`🔵 [Worker] Ozzy Exodus powerInnovationCount calculated: ${upgradeCount}`);
    return upgradeCount;
  }
  
  if (param === 'upgrades.gems_nodes.exodus_gem5') {
    // Knox: Exodus Gem Node 5 - zählt Attraction + Creation Upgrades
    
    // ZUERST prüfen ob ein Override existiert
    let hasExodusNode5;
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_gem5' in buildData.overrides) {
      hasExodusNode5 = buildData.overrides['upgrades.gems_nodes.exodus_gem5'] === 1;
      console.log(`🔶 [Worker] Knox Exodus Node 5 Override detected: ${hasExodusNode5}`);
    } else {
      // Fallback auf globalen Zustand
      const exodusGemState = storeData.gemPlannerStore?.gemStates?.exodus;
      hasExodusNode5 = exodusGemState?.nodes?.[4] || false; // Node 5 = Index 4
      console.log(`🔶 [Worker] Knox Exodus Node 5 Global state: ${hasExodusNode5}`);
    }
    
    if (!hasExodusNode5) {
      console.log(`� [Worker] Knox Exodus Gem Node 5 not activated, returning 0`);
      return 0; // Node ist nicht aktiviert
    }
    
    // Wenn aktiviert, berechne die Anzahl der Attraction + Creation Upgrades
    let upgradeCount = 0;
    
    // Count Attraction gem upgrades
    const attractionGemState = storeData.gemPlannerStore?.gemStates?.attraction;
    if (attractionGemState?.upgrades) {
      upgradeCount += Object.values(attractionGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    // Count Creation gem upgrades
    const creationGemState = storeData.gemPlannerStore?.gemStates?.creation;
    if (creationGemState?.upgrades) {
      upgradeCount += Object.values(creationGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    console.log(`🔥 [Worker] Knox Exodus Node 5 active - Attraction + Creation upgrade count: ${upgradeCount}`);
    return upgradeCount;
  }

  // Spezielle Behandlung für Knox Exodus Attraction Creation Count
  if (param === 'upgrades.gems_nodes.exodus_attractionCreationCount') {
    // Knox: Berechnet Attraction + Creation Upgrades wenn exodus_gem5 aktiv ist
    
    // ZUERST prüfen ob es einen direkten Override für exodus_attractionCreationCount gibt
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_attractionCreationCount' in buildData.overrides) {
      const overrideValue = buildData.overrides['upgrades.gems_nodes.exodus_attractionCreationCount'];
      console.log(`🔶 [Worker] Knox Exodus attractionCreationCount Override detected: ${overrideValue}`);
      return overrideValue;
    }
    
    // Ansonsten prüfen ob exodus_gem5 aktiviert ist (entweder via Override oder global)
    let hasExodusNode5;
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_gem5' in buildData.overrides) {
      hasExodusNode5 = buildData.overrides['upgrades.gems_nodes.exodus_gem5'] === 1;
      console.log(`🔶 [Worker] Knox Exodus Node 5 Override detected: ${hasExodusNode5}`);
    } else {
      // Fallback auf globalen Zustand
      const exodusGemState = storeData.gemPlannerStore?.gemStates?.exodus;
      hasExodusNode5 = exodusGemState?.nodes?.[4] || false; // Node 5 = Index 4
      console.log(`🔶 [Worker] Knox Exodus Node 5 Global state: ${hasExodusNode5}`);
    }
    
    if (!hasExodusNode5) {
      console.log(`🔶 [Worker] Knox Exodus Node 5 not activated, returning 0 for attractionCreationCount`);
      return 0; // Node ist nicht aktiviert
    }
    
    // Wenn aktiviert, berechne die Anzahl der Attraction + Creation Upgrades
    let upgradeCount = 0;
    
    // Count Attraction gem upgrades
    const attractionGemState = storeData.gemPlannerStore?.gemStates?.attraction;
    if (attractionGemState?.upgrades) {
      upgradeCount += Object.values(attractionGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    // Count Creation gem upgrades
    const creationGemState = storeData.gemPlannerStore?.gemStates?.creation;
    if (creationGemState?.upgrades) {
      upgradeCount += Object.values(creationGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    console.log(`🔶 [Worker] Knox Exodus attractionCreationCount calculated: ${upgradeCount}`);
    return upgradeCount;
  }

  // Spezielle Behandlung für CMS Exodus Gem4 Count
  if (param === 'upgrades.cms.exodus_gem4') {
    // Berechnet Construction Milestone Upgrades wenn exodus_gem4 aktiv ist
    
    // ZUERST prüfen ob es einen direkten Override für cms.exodus_gem4 gibt
    if (buildData?.overrides && 'upgrades.cms.exodus_gem4' in buildData.overrides) {
      const overrideValue = buildData.overrides['upgrades.cms.exodus_gem4'];
      console.log(`🟠 [Worker] CMS Exodus_gem4 Override detected: ${overrideValue}`);
      return overrideValue;
    }
    
    // Ansonsten prüfen ob exodus_gem4 aktiviert ist (entweder via Override oder global)
    let hasExodusNode4;
    if (buildData?.overrides && 'upgrades.gems_nodes.exodus_gem4' in buildData.overrides) {
      hasExodusNode4 = buildData.overrides['upgrades.gems_nodes.exodus_gem4'] === 1;
      console.log(`🟠 [Worker] Exodus Node 4 Override detected for CMS: ${hasExodusNode4}`);
    } else {
      // Fallback auf globalen Zustand
      const exodusGemState = storeData.gemPlannerStore?.gemStates?.exodus;
      hasExodusNode4 = exodusGemState?.nodes?.[3] || false; // Node 4 = Index 3
      console.log(`🟠 [Worker] Exodus Node 4 Global state for CMS: ${hasExodusNode4}`);
    }
    
    if (!hasExodusNode4) {
      console.log(`🟠 [Worker] Exodus Node 4 not activated, returning 0 for CMS count`);
      return 0; // Node ist nicht aktiviert
    }
    
    // Wenn aktiviert, berechne die Anzahl der Construction Milestone Upgrades
    let milestoneCount = 0;
    
    // Check Construction Milestone upgrades
    if (storeData.upgrades?.cms) {
      milestoneCount = Object.values(storeData.upgrades.cms).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    console.log(`🟠 [Worker] CMS Exodus_gem4 calculated: ${milestoneCount}`);
    return milestoneCount;
  }

  // Spezielle Behandlung für Creation Gem5 Trinkets Count
  if (param === 'upgrades.gems_nodes.creation_galvTrinketsCount') {
    // Berechnet Trinket-Level wenn creation_gem5 aktiv ist
    
    // ZUERST prüfen ob es einen direkten Override für creation_galvTrinketsCount gibt
    if (buildData?.overrides && 'upgrades.gems_nodes.creation_galvTrinketsCount' in buildData.overrides) {
      const overrideValue = buildData.overrides['upgrades.gems_nodes.creation_galvTrinketsCount'];
      console.log(`🟤 [Worker] Creation galvTrinketsCount Override detected: ${overrideValue}`);
      return overrideValue;
    }
    
    // Ansonsten prüfen ob creation_gem5 aktiviert ist (entweder via Override oder global)
    let hasCreationNode5;
    if (buildData?.overrides && 'upgrades.gems_nodes.creation_gem5' in buildData.overrides) {
      hasCreationNode5 = buildData.overrides['upgrades.gems_nodes.creation_gem5'] === 1;
      console.log(`🟤 [Worker] Creation Node 5 Override detected: ${hasCreationNode5}`);
    } else {
      // Fallback auf globalen Zustand
      const creationGemState = storeData.gemPlannerStore?.gemStates?.creation;
      hasCreationNode5 = creationGemState?.nodes?.[4] || false; // Node 5 = Index 4
      console.log(`🟤 [Worker] Creation Node 5 Global state: ${hasCreationNode5}`);
    }
    
    if (!hasCreationNode5) {
      console.log(`🟤 [Worker] Creation Node 5 not activated, returning 0 for galvTrinketsCount`);
      return 0; // Node ist nicht aktiviert
    }
    
    // Wenn aktiviert, berechne die Anzahl aller Trinket-Level
    let trinketLevelCount = 0;
    
    // Count all trinket levels from upgrades.trinkets
    if (storeData.upgrades?.trinkets) {
      trinketLevelCount = Object.values(storeData.upgrades.trinkets).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    console.log(`🟤 [Worker] Creation galvTrinketsCount calculated: ${trinketLevelCount}`);
    return trinketLevelCount;
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

  // Neue Gem-Parameter direkt behandeln (ohne upgrades. Präfix)
  if (param.startsWith('gems.')) {
    const parts = param.split('.');
    
    if (parts.length === 3) {
      const [_, gemType, property] = parts;
      
      if (property === 'level') {
        return storeData.gemPlannerStore?.gemStates?.[gemType]?.level || 0;
      }
    }
    
    if (parts.length === 4) {
      const [_, gemType, category, key] = parts;
      
      if (category === 'nodes') {
        // gems.creation.nodes.gem1 -> gemStates.creation.nodes[0]
        const nodeMap = {
          gem1: 0,
          gem2: 1, 
          gem3: 2
        };
        const nodeIndex = nodeMap[key];
        if (nodeIndex !== undefined) {
          return storeData.gemPlannerStore?.gemStates?.[gemType]?.nodes?.[nodeIndex] ? 1 : 0;
        }
      } else if (category === 'upgrades') {
        // gems.creation.upgrades.borgeGU -> gemStates.creation.upgrades['borge-stat-bonus']
        const upgradeMap = {
          borgeGU: 'borge-stat-bonus',
          ozzyGU: 'ozzy-stat-bonus', 
          knoxGU: 'knox-stat-bonus',
          catchUp: 'catch-up-power',
          lootBorge: 'borge-loot-bonus',
          lootOzzy: 'ozzy-loot-bonus',
          lootKnox: 'knox-loot-bonus'
        };
        const upgradeKey = upgradeMap[key] || key;
        return storeData.gemPlannerStore?.gemStates?.[gemType]?.upgrades?.[upgradeKey] || 0;
      }
    }
    
    return 0;
  }

  // Verbesserte Upgrades-Extraktion mit Mappings für verschiedene Formate
  if (param.startsWith('upgrades.')) {
    const parts = param.split('.');
    
    // Spezielle Behandlung für gems_nodes Format: upgrades.gems_nodes.attraction_level
    if (parts.length === 4 && parts[1] === 'gems_nodes') {
      const [_, __, gemNodeParam] = parts;
      const underscoreIndex = gemNodeParam.indexOf('_');
      
      if (underscoreIndex > 0) {
        const gemType = gemNodeParam.substring(0, underscoreIndex); // attraction, creation, etc.
        const gemProperty = gemNodeParam.substring(underscoreIndex + 1); // level, lootBorge, etc.
        
        // Reduziertes Logging nur bei fehlenden Daten
        if (!storeData.gemPlannerStore?.gemStates?.[gemType]) {
          console.log(`⚠️ [Worker] Missing gem data for: ${gemType}`);
          return 0;
        }
        
        // Level
        if (gemProperty === 'level') {
          const levelValue = storeData.gemPlannerStore?.gemStates?.[gemType]?.level || 0;
          return levelValue;
        }
        // Nodes (gem1, gem2, gem3)
        else if (gemProperty.startsWith('gem')) {
          const nodeIndex = parseInt(gemProperty.replace('gem', '')) - 1;
          const nodes = storeData.gemPlannerStore?.gemStates?.[gemType]?.nodes || [];
          const nodeValue = nodes[nodeIndex] ? 1 : 0;
          return nodeValue;
        }
        // Upgrades (lootBorge, catchUp, borgeGU etc.)
        else {
          const storeUpgradeKey = GEM_UPGRADE_MAPPING[gemProperty] || gemProperty;
          const upgrades = storeData.gemPlannerStore?.gemStates?.[gemType]?.upgrades || {};
          const upgradeValue = upgrades[storeUpgradeKey] || 0;
          return upgradeValue;
        }
      }
      
      return 0;
    }
    
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
  
  // Debugging: Kurze Parameter-Übersicht
  console.log(`🎯 [Worker] Evaluating ${hunterId}: extracting ${paramConfig.length} parameters`);
  
  // Parameter extrahieren mit reduziertem Logging
  const params = paramConfig.map((param, index) => {
    const value = extractParamValue(storeData, hunterId, buildData, param);
    
    // Nur wichtige gem-Parameter loggen
    if (param.includes('gems_nodes') && value > 0) {
      console.log(`� [Worker] ${param} = ${value}`);
    }
    
    return value;
  });
  
  console.log(`✅ [Worker] Parameter extraction complete`);
  console.log(`🎯 [Worker] Final parameter array:`, params);
  
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