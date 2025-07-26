// WASM Wrapper für Borge
let wasmModule = null;
let wasmInitialized = false;

async function initWasm() {
  if (wasmInitialized && wasmModule) {
    return wasmModule;
  }
  
  try {
    // WASM-Modul laden - KORRIGIERT
    const wasmFile = await fetch('/huntersim2/build/release.wasm');
    const wasmBytes = await wasmFile.arrayBuffer();
    
    // WebAssembly.instantiate ohne zweites Argument aufrufen
    const wasmResult = await WebAssembly.instantiate(wasmBytes);
    
    wasmModule = wasmResult;
    wasmInitialized = true;
    
    console.log('WASM successfully initialized');
    return wasmModule;
  } catch (error) {
    console.error('Failed to initialize WASM:', error);
    
    // Fallback: Versuche anderen Pfad
    try {
      const wasmFile = await fetch('/build/release.wasm');
      const wasmBytes = await wasmFile.arrayBuffer();
      const wasmResult = await WebAssembly.instantiate(wasmBytes);
      
      wasmModule = wasmResult;
      wasmInitialized = true;
      
      console.log('WASM successfully initialized (fallback path)');
      return wasmModule;
    } catch (fallbackError) {
      console.error('WASM fallback also failed:', fallbackError);
      throw fallbackError;
    }
  }
}

// Wrapper-Funktion, die die gleiche Signatur wie EVALBORGE hat
export async function EVALBORGE_WASM(
  lvl, maxStage, hp, atk, regen, dr, evade, effect, critRate, critPower,
  aspd, revival, life, ua, impacts, omen, ll, pog, ultimaTalent, fow,
  ares, ylith, spartan, timeless, bfb, athena, baal, sensors, atlas, mino,
  helltouch, punches, weakspot, hermes, inhaler, gadget, iap, special, ultima,
  reviveCd, trample, scavengers,
  m0, r4, r7, r16, r19,
  i3, i4, i11, i13, i14, i23, i24, i27, i44, i60, i80, i84, i87, i88, i89, i91,
  creaGN1, creaGN2, creaGN3, innoGN3, attrGN2, attrGN3, attr, catchup99gu,
  lootgu, card, research81, iterations, cm46, cm47, cm48, cm51, creastat
) {
  
  try {
    const wasm = await initWasm();
    const exports = wasm.instance.exports;
    
    console.log('WASM: Verfügbare Exports:', Object.keys(exports));
    
    // WASM-Funktion aufrufen
    console.log('WASM: Rufe EVALBORGE_WASM auf...');
    const wasmResult = exports.EVALBORGE_WASM(
      lvl, maxStage, hp, atk, regen, dr, evade, effect, critRate, critPower,
      aspd, revival, life, ua, impacts, omen, ll, pog, ultimaTalent, fow,
      ares, ylith, spartan, timeless, bfb, athena, baal, sensors, atlas, mino,
      helltouch, punches, weakspot, hermes, inhaler, gadget, iap, special, ultima,
      reviveCd, trample, scavengers,
      m0, r4, r7, r16, r19,
      i3, i4, i11, i13, i14, i23, i24, i27, i44, i60, i80, i84, i87, i88, i89, i91,
      creaGN1, creaGN2, creaGN3, innoGN3, attrGN2, attrGN3, attr, catchup99gu,
      lootgu, card, research81, iterations, cm46, cm47, cm48, cm51, creastat
    );
    
    console.log('WASM: Hauptergebnis erhalten:', wasmResult);
    
    // Zusätzliche Werte aus WASM holen
    let avgStage = 0, avgTime = 0, minStage = 0, maxStage = 0;
    let bossHpPercent = 0, bossKillRate = 0;
    let mat1 = 0, mat2 = 0, mat3 = 0, xp = 0;
    let stats = "", progressString = "{}";
    
    try {
      if (exports.getLastAvgStage) avgStage = exports.getLastAvgStage();
      if (exports.getLastAvgTime) avgTime = exports.getLastAvgTime();
      if (exports.getLastMinStage) minStage = exports.getLastMinStage();
      if (exports.getLastMaxStage) maxStage = exports.getLastMaxStage();
      if (exports.getLastBossHpPercent) bossHpPercent = exports.getLastBossHpPercent();
      if (exports.getLastBossKillRate) bossKillRate = exports.getLastBossKillRate();
      if (exports.getLastMat1) mat1 = exports.getLastMat1();
      if (exports.getLastMat2) mat2 = exports.getLastMat2();
      if (exports.getLastMat3) mat3 = exports.getLastMat3();
      if (exports.getLastXp) xp = exports.getLastXp();
      if (exports.getLastStatsString) stats = exports.getLastStatsString();
      if (exports.getLastProgressString) progressString = exports.getLastProgressString();
      
      console.log('WASM: Zusätzliche Werte erhalten:', {
        avgStage, avgTime, minStage, maxStage, mat1, mat2, mat3, xp
      });
    } catch (error) {
      console.warn('WASM: Fehler beim Abrufen zusätzlicher Werte:', error);
    }
    
    // Ergebnis im gleichen Format wie die JavaScript-Version zurückgeben
    const result = [[
      wasmResult,    // 0: Loot per minute
      avgStage,      // 1: Avg Stage
      avgTime,       // 2: Avg Time (minutes)
      minStage,      // 3: Min Stage
      maxStage,      // 4: Max Stage  
      bossHpPercent, // 5: Boss HP %
      bossKillRate,  // 6: Boss Kill Rate
      mat1,          // 7: Mat1
      mat2,          // 8: Mat2
      mat3,          // 9: Mat3
      xp,            // 10: XP
      stats,         // 11: Stats
      progressString // 12: Progress
    ]];
    
    console.log('WASM: Endgültiges Ergebnis:', result);
    return result;
    
  } catch (error) {
    console.error('WASM: Fehler in EVALBORGE_WASM:', error);
    throw error;
  }
}