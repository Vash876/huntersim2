import { instantiate } from "@assemblyscript/loader";

// WASM Module für Borge
let wasmModule = null;
let wasmInitialized = false;

async function initWasm() {
  if (wasmInitialized && wasmModule) {
    return wasmModule;
  }
  
  try {
    console.log('WASM: Versuche mit AssemblyScript Loader...');
    
    // AssemblyScript Loader verwenden
    wasmModule = await instantiate(fetch('/build/release.wasm'), {
      // Imports falls benötigt
      env: {
        abort: (message, fileName, lineNumber, columnNumber) => {
          console.error('WASM abort:', { message, fileName, lineNumber, columnNumber });
        }
      }
    });
    
    wasmInitialized = true;
    console.log('WASM: Erfolgreich mit AssemblyScript Loader initialisiert');
    console.log('WASM: Verfügbare Exports:', Object.keys(wasmModule.exports));
    
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
      progress: "{}"
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
        console.log(`WASM: Numerische Stats = ${debugResults.stats}`);
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
        console.log(`WASM: Progress Size = ${progressSize}`);
        
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
          console.log(`WASM: Numerische Progress = ${debugResults.progress}`);
        } else {
          console.log('WASM: Progress-Iterator-Funktionen nicht verfügbar');
        }
      } else {
        console.log('WASM: getProgressSize nicht verfügbar');
      }
    } catch (e) {
      console.error('WASM: Fehler bei numerischer Progress:', e);
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
      debugResults.progress       // 12: Progress
    ]];
    
    console.log('WASM: Finales Ergebnis-Array:', result[0]);
    console.log('WASM: Array-Länge:', result[0].length);
    
    console.log('WASM: Borge Evaluierung abgeschlossen');
    return result;
  } catch (error) {
    console.error('WASM: Fehler bei Borge Evaluierung:', error);
    throw error;
  }
}

export { EVALBORGE_WASM };