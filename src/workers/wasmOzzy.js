import { instantiate } from "@assemblyscript/loader";

// WASM Module für Ozzy
let wasmModule = null;
let wasmInitialized = false;

async function initWasm() {
  if (wasmInitialized && wasmModule) {
    return wasmModule;
  }
  
  try {
    console.log('WASM Ozzy: Versuche mit AssemblyScript Loader...');
    
    // AssemblyScript Loader verwenden
    wasmModule = await instantiate(fetch('/build/release.wasm'), {
      // Imports falls benötigt
      env: {
        abort: (message, fileName, lineNumber, columnNumber) => {
          console.error('WASM Ozzy abort:', { message, fileName, lineNumber, columnNumber });
        }
      }
    });
    
    wasmInitialized = true;
    console.log('WASM Ozzy: Erfolgreich mit AssemblyScript Loader initialisiert');
    console.log('WASM Ozzy: Verfügbare Exports:', Object.keys(wasmModule.exports));
    
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
        console.log(`WASM Ozzy: Numerische Stats = ${debugResults.stats}`);
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
        console.log(`WASM Ozzy: Progress Size = ${progressSize}`);
        
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
          console.log(`WASM Ozzy: Numerische Progress = ${debugResults.progress}`);
        } else {
          console.log('WASM Ozzy: Progress-Iterator-Funktionen nicht verfügbar');
        }
      } else {
        console.log('WASM Ozzy: getOzzyProgressSize nicht verfügbar');
      }
    } catch (e) {
      console.error('WASM Ozzy: Fehler bei numerischer Progress:', e);
    }

    // NEU: Death Tracking sammeln
    try {
      if (wasm.exports.getOzzyDeathsByStageAndReviveSize) {
        const deathsSize = wasm.exports.getOzzyDeathsByStageAndReviveSize();
        console.log(`WASM Ozzy: Deaths By Stage And Revive Size = ${deathsSize}`);
        
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
          console.log('WASM Ozzy: Death Tracking Array:', deathsArray);
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
      debugResults.deathTracking  // 13: Detaillierte Death Info
    ]];
    
    console.log('WASM Ozzy: Finales Ergebnis-Array:', result[0]);
    console.log('WASM Ozzy: Array-Länge:', result[0].length);
    
    console.log('WASM Ozzy: Ozzy Evaluierung abgeschlossen');
    return result;
  } catch (error) {
    console.error('WASM Ozzy: Fehler bei Ozzy Evaluierung:', error);
    throw error;
  }
}

export { EVALOZZY_WASM };