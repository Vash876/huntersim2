import { instantiate } from "@assemblyscript/loader";

// WASM Module für Knox
let wasmModule = null;
let wasmInitialized = false;

async function initWasm() {
  if (wasmInitialized && wasmModule) {
    return wasmModule;
  }
  
  try {
    // AssemblyScript Loader verwenden
    const isDev = import.meta.env.DEV;
    const wasmUrl = isDev 
      ? `/build/release.wasm?v=${__BUILD_TIME__}`
      : `/wasm/release.wasm?v=${__BUILD_TIME__}`;
    
    wasmModule = await instantiate(fetch(wasmUrl), {
      // Imports falls benötigt
      env: {
        abort: (message, fileName, lineNumber, columnNumber) => {
          console.error('WASM Knox abort:', { message, fileName, lineNumber, columnNumber });
        }
      }
    });
    
    wasmInitialized = true;
    
    return wasmModule;
    
  } catch (error) {
    console.error('WASM Knox: AssemblyScript Loader Fehler:', error);
    throw error;
  }
}

async function EVALKNOX_WASM(...params) {
  try {
    const wasm = await initWasm();
    
    // Verwende AssemblyScript Loader Exports
    const wasmResult = wasm.exports.EVALKNOX_WASM(...params);
    
    const debugResults = {
      lootPerMin: wasmResult,
      avgStage: wasm.exports.getLastKnoxAvgStage(),
      avgTime: wasm.exports.getLastKnoxAvgTime(),
      minStage: wasm.exports.getLastKnoxMinStage(),
      maxStage: wasm.exports.getLastKnoxMaxStage(),
      bossHpPercent: wasm.exports.getLastKnoxBossHpPercent(),      
      bossKillRate: wasm.exports.getLastKnoxBossKillRate(),      
      mat1: wasm.exports.getLastKnoxMat1(),        
      mat2: wasm.exports.getLastKnoxMat2(),        
      mat3: wasm.exports.getLastKnoxMat3(),        
      xp: wasm.exports.getLastKnoxXp(),
      minMat1: wasm.exports.getLastMinKnoxMat1(),
      maxMat1: wasm.exports.getLastMaxKnoxMat1(),
      minMat2: wasm.exports.getLastMinKnoxMat2(),
      maxMat2: wasm.exports.getLastMaxKnoxMat2(),
      minMat3: wasm.exports.getLastMinKnoxMat3(),
      maxMat3: wasm.exports.getLastMaxKnoxMat3(),
      minXp: wasm.exports.getLastMinKnoxXp(),
      maxXp: wasm.exports.getLastMaxKnoxXp(),
      stats: "",
      progress: "{}",
      deathTracking: "{}" // NEU: Death Tracking
    };
    
    // Stats: Numerische Fallback-Exports verwenden
    try {
      if (wasm.exports.getLastKnoxMaxHp) {
        const maxHp = wasm.exports.getLastKnoxMaxHp();
        const atk = wasm.exports.getLastKnoxAtk();
        const regen = wasm.exports.getLastKnoxRegen();
        const dr = wasm.exports.getLastKnoxDr();
        const block = wasm.exports.getLastKnoxBlock();
        const effect = wasm.exports.getLastKnoxEffect();
        const charge = wasm.exports.getLastKnoxCharge();
        const chargeGain = wasm.exports.getLastKnoxChargeGain();
        const reload = wasm.exports.getLastKnoxReload();
        const sc = wasm.exports.getLastKnoxSc();
        
        debugResults.stats = `${maxHp},${atk},${regen},${dr},${block},${effect},${charge},${chargeGain},${reload},${sc}`;
      } else {
        console.error('WASM Knox: Numerische Knox-Funktionen nicht verfügbar!');
      }
    } catch (e) {
      console.error('WASM Knox: Fehler bei numerischen Knox-Stats:', e);
    }
    
    // Progress: Stage-Verteilung sammeln
    try {
      if (wasm.exports.getKnoxProgressSize) {
        const progressSize = wasm.exports.getKnoxProgressSize();
        
        if (progressSize > 0 && wasm.exports.getKnoxProgressStageAt && wasm.exports.getKnoxProgressCountAt) {
          let progressObj = {};
          
          for (let i = 0; i < progressSize; i++) {
            const stage = wasm.exports.getKnoxProgressStageAt(i);
            const count = wasm.exports.getKnoxProgressCountAt(i);
            if (stage >= 0) {
              progressObj[stage] = count;
            }
          }
          
          debugResults.progress = JSON.stringify(progressObj);
        }
      }
    } catch (e) {
      console.error('WASM Knox: Fehler bei numerischer Progress:', e);
    }

    // NEU: Death Tracking sammeln
    try {
      if (wasm.exports.getKnoxDeathsByStageAndReviveSize) {
        const deathsSize = wasm.exports.getKnoxDeathsByStageAndReviveSize();
        
        if (deathsSize > 0 && wasm.exports.getKnoxDeathKeyAt && wasm.exports.getKnoxDeathCountAt) {
          let deathsArray = []; // ARRAY statt Object!
          
          for (let i = 0; i < deathsSize; i++) {
            const numericKey = wasm.exports.getKnoxDeathKeyAt(i);
            const count = wasm.exports.getKnoxDeathCountAt(i);
            
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
      console.error('WASM Knox: Fehler bei Death Tracking:', e);
      debugResults.deathTracking = [];
    }
    
    // Finales Ergebnis-Array zusammenstellen
    const result = [[
      debugResults.lootPerMin,    // 0: Loot per minute
      debugResults.avgStage,      // 1: Avg Stage  
      debugResults.avgTime,       // 2: Avg Time
      debugResults.minStage,      // 3: Min Stage
      debugResults.maxStage,      // 4: Max Stage
      debugResults.bossHpPercent, // 5: Boss HP %
      debugResults.bossKillRate,  // 6: Boss Kill Rate
      debugResults.mat1,          // 7: Glac
      debugResults.mat2,          // 8: Quartz
      debugResults.mat3,          // 9: Tess
      debugResults.xp,            // 10: XP
      debugResults.stats,         // 11: Stats
      debugResults.progress,      // 12: Progress
      debugResults.deathTracking, // 13: NEU - Detaillierte Death Info
      debugResults.minMat1,       // 14: Min Mat1
      debugResults.maxMat1,       // 15: Max Mat1
      debugResults.minMat2,       // 16: Min Mat2
      debugResults.maxMat2,       // 17: Max Mat2
      debugResults.minMat3,       // 18: Min Mat3
      debugResults.maxMat3,       // 19: Max Mat3
      debugResults.minXp,         // 20: Min XP
      debugResults.maxXp          // 21: Max XP
    ]];
    
    return result;
  } catch (error) {
    console.error('WASM Knox: Fehler bei Knox Evaluierung:', error);
    throw error;
  }
}

export { EVALKNOX_WASM };