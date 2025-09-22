import { instantiate } from "@assemblyscript/loader";

// WASM Module für Ozzy
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
          console.error('WASM Ozzy abort:', { message, fileName, lineNumber, columnNumber });
        }
      }
    });
    
    wasmInitialized = true;
    
    return wasmModule;
    
  } catch (error) {
    console.error('WASM Ozzy: AssemblyScript Loader Fehler:', error);
    throw error;
  }
}

async function EVALOZZY_WASM(...params) {
  try {
    const wasm = await initWasm();
    
    // Verwende AssemblyScript Loader Exports
    const wasmResult = wasm.exports.EVALOZZY_WASM(...params);
    
    const debugResults = {
      lootPerMin: wasmResult,
      avgStage: wasm.exports.getLastOzzyAvgStage(),
      avgTime: wasm.exports.getLastOzzyAvgTime(),
      minStage: wasm.exports.getLastOzzyMinStage(),
      maxStage: wasm.exports.getLastOzzyMaxStage(),
      bossHpPercent: wasm.exports.getLastOzzyBossHpPercent(),      
      bossKillRate: wasm.exports.getLastOzzyBossKillRate(), 
      mat1: wasm.exports.getLastOzzyMat1(),
      mat2: wasm.exports.getLastOzzyMat2(),
      mat3: wasm.exports.getLastOzzyMat3(),
      xp: wasm.exports.getLastOzzyXp(),
      stats: "",
      progress: "{}",
      deathTracking: "{}" // NEU: Death Tracking
    };
    
    // Stats: Numerische Fallback-Exports verwenden
    try {
      if (wasm.exports.getLastOzzyMaxHp) {
        const maxHp = wasm.exports.getLastOzzyMaxHp();
        const atk = wasm.exports.getLastOzzyAtk();
        const regen = wasm.exports.getLastOzzyRegen();
        const dr = wasm.exports.getLastOzzyDr();
        const evade = wasm.exports.getLastOzzyEvade();
        const effect = wasm.exports.getLastOzzyEffect();
        const multistrike = wasm.exports.getLastOzzyMultistrike();
        const multistrikePower = wasm.exports.getLastOzzyMultistrikePower();
        const reload = wasm.exports.getLastOzzyReload();
        
        debugResults.stats = `${maxHp},${atk},${regen},${dr},${evade},${effect},${multistrike},${multistrikePower},${reload}`;
      } else {
        console.error('WASM Ozzy: Numerische Ozzy-Funktionen nicht verfügbar!');
      }
    } catch (e) {
      console.error('WASM Ozzy: Fehler bei numerischen Ozzy-Stats:', e);
    }
    
    // Progress: Stage-Verteilung sammeln
    try {
      if (wasm.exports.getOzzyProgressSize) {
        const progressSize = wasm.exports.getOzzyProgressSize();
        
        if (progressSize > 0 && wasm.exports.getOzzyProgressStageAt && wasm.exports.getOzzyProgressCountAt) {
          let progressObj = {};
          
          for (let i = 0; i < progressSize; i++) {
            const stage = wasm.exports.getOzzyProgressStageAt(i);
            const count = wasm.exports.getOzzyProgressCountAt(i);
            if (stage >= 0) {
              progressObj[stage] = count;
            }
          }
          
          debugResults.progress = JSON.stringify(progressObj);
        }
      }
    } catch (e) {
      console.error('WASM Ozzy: Fehler bei numerischer Progress:', e);
    }

    // Death Tracking sammeln
    try {
      if (wasm.exports.getOzzyDeathsByStageAndReviveSize) {
        const deathsSize = wasm.exports.getOzzyDeathsByStageAndReviveSize();
        
        if (deathsSize > 0 && wasm.exports.getOzzyDeathKeyAt && wasm.exports.getOzzyDeathCountAt) {
          let deathsArray = []; // ARRAY statt Object!
          
          for (let i = 0; i < deathsSize; i++) {
            const numericKey = wasm.exports.getOzzyDeathKeyAt(i);
            const count = wasm.exports.getOzzyDeathCountAt(i);
            
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
      console.error('WASM Ozzy: Fehler bei Death Tracking:', e);
      debugResults.deathTracking = [];
    }

    try {
      if (wasm.exports.getOzzyBossKillsByReviveSize) {
        const bossKillSize = wasm.exports.getOzzyBossKillsByReviveSize();
        
        if (bossKillSize > 0) {
          let bossKillsByRevive = [];
          
          for (let i = 0; i < bossKillSize; i++) {
            const revive = wasm.exports.getOzzyBossRemainingReviveAt(i);
            const kills = wasm.exports.getOzzyBossKillCountAt(i);
            const attempts = wasm.exports.getOzzyBossAttemptCountAt(i);
            const finalStage = wasm.exports.getLastOzzyMaxStage ? wasm.exports.getLastOzzyMaxStage(i) : 0;
            
            if (revive >= 0 && attempts > 0) {
              bossKillsByRevive.push({
                revive: revive,
                kills: kills,
                attempts: attempts,
                killRate: ((kills / attempts) * 100).toFixed(1),
                finalStage: finalStage
              });
            }
          }
          
          debugResults.bossKillsByRevive = bossKillsByRevive;
        } else {
          debugResults.bossKillsByRevive = [];
        }
      } else {
        debugResults.bossKillsByRevive = [];
      }
    } catch (e) {
      console.error('WASM Ozzy: Fehler bei Boss Kill by Revive Tracking:', e);
      debugResults.bossKillsByRevive = [];
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
      debugResults.mat1,          // 7: Mat1
      debugResults.mat2,          // 8: Mat2
      debugResults.mat3,          // 9: Mat3
      debugResults.xp,            // 10: XP
      debugResults.stats,         // 11: Stats
      debugResults.progress,      // 12: Progress
      debugResults.deathTracking,  // 13: Detaillierte Death Info
      debugResults.bossKillsByRevive // 14: Boss Kills by Revive
    ]];
    
    return result;
  } catch (error) {
    console.error('WASM Ozzy: Fehler bei Ozzy Evaluierung:', error);
    throw error;
  }
}

export { EVALOZZY_WASM };