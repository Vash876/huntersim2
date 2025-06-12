import { instantiate } from "@assemblyscript/loader";

let wasmModule = null;
let wasmInitialized = false;

async function initWasm() {
  if (wasmInitialized && wasmModule) {
    return wasmModule;
  }
  
  try {
    wasmModule = await instantiate(fetch('/wasm/release.wasm'), {
      env: {
        abort: (message, fileName, lineNumber, columnNumber) => {
          console.error('WASM abort:', { message, fileName, lineNumber, columnNumber });
        }
      }
    });
    
    wasmInitialized = true;
    console.log('Live Simulation WASM: Erfolgreich initialisiert');
    return wasmModule;
    
  } catch (error) {
    console.error('Live Simulation WASM: Fehler:', error);
    throw error;
  }
}

export class LiveSimulationWASM {
  constructor() {
    this.wasm = null;
  }

  async initialize() {
    this.wasm = await initWasm();
  }

  initSimulation(params) {
    if (!this.wasm) throw new Error('WASM not initialized');
    // ✅ Jetzt stimmt die Parameter-Reihenfolge mit EVALBORGE_WASM überein
    return this.wasm.exports.initLiveSimulation(...params);
  }

  step() {
    if (!this.wasm) throw new Error('WASM not initialized');
    return this.wasm.exports.liveSimulationStep();
  }

  getState() {
    if (!this.wasm) throw new Error('WASM not initialized');
    
    return {
      borge: {
        hp: this.wasm.exports.getLiveBorgeHp(),
        maxHp: this.wasm.exports.getLiveBorgeMaxHp(),
        atk: this.wasm.exports.getLiveBorgeAtk(),
        revives: this.wasm.exports.getLiveBorgeRevives()
      },
      enemy: {
        hp: this.wasm.exports.getLiveEnemyHp(),
        maxHp: this.wasm.exports.getLiveEnemyMaxHp(),
        stage: this.wasm.exports.getLiveCurrentStage(),
        enemyNum: this.wasm.exports.getLiveCurrentEnem(),
        isBoss: this.wasm.exports.getLiveIsBoss()
      },
      timing: {
        currentTime: this.wasm.exports.getLiveCurrentTime(),
        nextAtk: this.wasm.exports.getLiveNextAtk(),
        nextEnemAtk: this.wasm.exports.getLiveNextEnemAtk(),
        nextRegen: this.wasm.exports.getLiveNextRegen(),
        nextAthena: this.wasm.exports.getLiveNextAthena(),
        nextFury: this.wasm.exports.getLiveNextFury()
      },
      effects: {
        furyEnabled: this.wasm.exports.getLiveFuryEnabled()
      },
      lastEvent: {
        type: this.wasm.exports.getLiveLastEventType(),
        damage: this.wasm.exports.getLiveLastEventDamage(),
        healing: this.wasm.exports.getLiveLastEventHealing(),
        stage: this.wasm.exports.getLiveLastEventStage()
      }
    };
  }
}