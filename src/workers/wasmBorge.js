import { instantiate } from "@assemblyscript/loader";

// WASM Module für Borge
let wasmModule = null;
let wasmInitialized = false;

async function initWasm() {
  if (wasmInitialized && wasmModule) {
    return wasmModule;
  }
  
  try {   
    // AssemblyScript Loader verwenden
    const wasmUrl = `/wasm/release.wasm?v=${__BUILD_TIME__}`;
    wasmModule = await instantiate(fetch(wasmUrl), {
      // Imports falls benötigt
      env: {
        abort: (message, fileName, lineNumber, columnNumber) => {
          console.error('WASM abort:', { message, fileName, lineNumber, columnNumber });
        }
      }
    });
    
    wasmInitialized = true;
    
    return wasmModule;
    
  } catch (error) {
    console.error('WASM: AssemblyScript Loader Fehler:', error);
    throw error;
  }
}

async function EVALBORGE_WASM(...params) {
  try {
    const wasm = await initWasm();
    
    // Verwende AssemblyScript Loader Exports
    const wasmResult = wasm.exports.EVALBORGE_WASM(...params);
    
    const debugResults = {
      lootPerMin: wasmResult,
      avgStage: wasm.exports.getLastAvgStage(),
      avgTime: wasm.exports.getLastAvgTime(),
      minStage: wasm.exports.getLastMinStage(),
      maxStage: wasm.exports.getLastMaxStage(),
      bossHpPercent: wasm.exports.getLastBossHpPercent(),     
      bossKillRate: wasm.exports.getLastBossKillRate(),  
      mat1: wasm.exports.getLastMat1(),
      mat2: wasm.exports.getLastMat2(),
      mat3: wasm.exports.getLastMat3(),
      xp: wasm.exports.getLastXp(),
      stats: "",
      progress: "{}",
      deathTracking: "{}" // Death Tracking
    };
    
    // Stats: Numerische Fallback-Exports verwenden
    try {
      if (wasm.exports.getLastBorgeMaxHp) {
        const maxHp = wasm.exports.getLastBorgeMaxHp();
        const atk = wasm.exports.getLastBorgeAtk();
        const regen = wasm.exports.getLastBorgeRegen();
        const dr = wasm.exports.getLastBorgeDr();
        const evade = wasm.exports.getLastBorgeEvade();
        const effect = wasm.exports.getLastBorgeEffect();
        const critRate = wasm.exports.getLastBorgeCritRate();
        const critPower = wasm.exports.getLastBorgeCritPower();
        const reload = wasm.exports.getLastBorgeReload();
        
        debugResults.stats = `${maxHp},${atk},${regen},${dr},${evade},${effect},${critRate},${critPower},${reload}`;
      } else {
        console.error('WASM: Numerische Borge-Funktionen nicht verfügbar!');
      }
    } catch (e) {
      console.error('WASM: Fehler bei numerischen Borge-Stats:', e);
    }
    
    // Progress: Stage-Verteilung sammeln
    try {
      if (wasm.exports.getProgressSize) {
        const progressSize = wasm.exports.getProgressSize();
        
        if (progressSize > 0 && wasm.exports.getProgressStageAt && wasm.exports.getProgressCountAt) {
          let progressObj = {};
          
          for (let i = 0; i < progressSize; i++) {
            const stage = wasm.exports.getProgressStageAt(i);
            const count = wasm.exports.getProgressCountAt(i);
            if (stage >= 0) {
              progressObj[stage] = count;
            }
          }
          
          debugResults.progress = JSON.stringify(progressObj);
        } else {
          console.log('WASM: Progress-Iterator-Funktionen nicht verfügbar');
        }
      } else {
        console.log('WASM: getProgressSize nicht verfügbar');
      }
    } catch (e) {
      console.error('WASM: Fehler bei numerischer Progress:', e);
    }

    // Death Tracking sammeln
    try {
      if (wasm.exports.getDeathsByStageAndReviveSize) {
        const deathsSize = wasm.exports.getDeathsByStageAndReviveSize();
        
        if (deathsSize > 0 && wasm.exports.getDeathKeyAt && wasm.exports.getDeathCountAt) {
          let deathsArray = []; // ARRAY statt Object!
          
          for (let i = 0; i < deathsSize; i++) {
            const numericKey = wasm.exports.getDeathKeyAt(i);
            const count = wasm.exports.getDeathCountAt(i);
            
            if (numericKey >= 0) {
              const stage = Math.floor(numericKey / 1000);
              const revive = numericKey % 1000;
              const key = `${stage}_${revive}`;
              
              // Direkt als Array-Element
              deathsArray.push({
                stage: key,
                count: count
              });
            }
          }
          
          // WICHTIG: Als Array, nicht als JSON String!
          debugResults.deathTracking = deathsArray;
        } else {
          debugResults.deathTracking = [];
        }
      } else {
        debugResults.deathTracking = [];
      }
    } catch (e) {
      debugResults.deathTracking = [];
    }

    // ERSETZE im result Array:
    const result = [[
      debugResults.lootPerMin,           // 0
      debugResults.avgStage,             // 1  
      debugResults.avgTime,              // 2
      debugResults.minStage,             // 3
      debugResults.maxStage,             // 4
      debugResults.bossHpPercent,        // 5
      debugResults.bossKillRate,         // 6
      debugResults.mat1,                 // 7
      debugResults.mat2,                 // 8
      debugResults.mat3,                 // 9
      debugResults.xp,                   // 10
      debugResults.stats,                // 11
      debugResults.progress,             // 12
      debugResults.deathTracking         // 13: Detaillierte Death Info
    ]];
    
    return result;
  } catch (error) {
    console.error('WASM: Fehler bei Borge Evaluierung:', error);
    throw error;
  }
}

export { EVALBORGE_WASM };