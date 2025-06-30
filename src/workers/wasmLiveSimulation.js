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
    
    // Event Type Mapping - exakt wie in WASM definiert
    const EVENT_TYPE_NAMES = [
      "init",       // 0
      "attack",     // 1
      "athena",     // 2
      "enemyAttack", // 3
      "bonusAttack", // 4
      "regen",      // 5
      "revive",     // 6
      "stageComplete", // 7
      "bossKill",   // 8
      "furyStart",  // 9
      "furyEnd",    // 10
      "death"       // 11
    ];
    
    // Event Type ID zu String konvertieren
    const eventTypeId = this.wasm.exports.getLiveLastEventType();
    const eventTypeName = EVENT_TYPE_NAMES[eventTypeId] || "unknown";
    
    console.log(`Live Simulation Event: ID=${eventTypeId}, Name=${eventTypeName}`);
    
    return {
      borge: {
        hp: this.wasm.exports.getLiveBorgeHp(),
        maxHp: this.wasm.exports.getLiveBorgeMaxHp(),
        atk: this.wasm.exports.getLiveBorgeAtk(),
        regen: this.wasm.exports.getLiveBorgeRegen(),
        dr: this.wasm.exports.getLiveBorgeDr(),
        evade: this.wasm.exports.getLiveBorgeEvade(),
        effect: this.wasm.exports.getLiveBorgeEffect(),
        critRate: this.wasm.exports.getLiveBorgeCritRate(),
        critPower: this.wasm.exports.getLiveBorgeCritPower(),
        reload: this.wasm.exports.getLiveBorgeReload(),       
        revives: this.wasm.exports.getLiveBorgeRevives(),
        shieldBreakStacks: this.wasm.exports.getLiveBorgeShieldBreakStacks(),
      },
      timing: {
        currentTime: this.wasm.exports.getLiveCurrentTime(),
        nextAtk: this.wasm.exports.getLiveNextAtk(),
        nextEnemAtk: this.wasm.exports.getLiveNextEnemAtk(),
        nextRegen: this.wasm.exports.getLiveNextRegen(),
        nextAthena: this.wasm.exports.getLiveNextAthena(),
        nextFury: this.wasm.exports.getLiveNextFury(),
        nextBossBonusAtk: this.wasm.exports.getLiveNextBossBonusAtk()
      },
      effects: {
        furyEnabled: this.wasm.exports.getLiveFuryEnabled()
      },
      lastEvent: {
        type: eventTypeName, // ✅ Korrigiert: String statt numerische ID
        damage: this.wasm.exports.getLiveLastEventDamage(),
        healing: this.wasm.exports.getLiveLastEventHealing(),
        stage: this.wasm.exports.getLiveLastEventStage()
      },
      enemy: {
        hp: this.wasm.exports.getLiveEnemyHp(),
        maxHp: this.wasm.exports.getLiveEnemyMaxHp(),
        stage: this.wasm.exports.getLiveCurrentStage(),
        enemyNum: this.wasm.exports.getLiveCurrentEnem(),
        isBoss: this.wasm.exports.getLiveIsBoss(),
        atk: this.wasm.exports.getLiveEnemyAtk(),
        regen: this.wasm.exports.getLiveEnemyRegen(),
        dr: this.wasm.exports.getLiveEnemyDr(),
        evade: this.wasm.exports.getLiveEnemyEvade(),
        effect: this.wasm.exports.getLiveEnemyEffect(),
        critRate: this.wasm.exports.getLiveEnemyCritRate(),
        critDmg: this.wasm.exports.getLiveEnemyCritDmg(),
        atkSpd: this.wasm.exports.getLiveEnemyAtkSpd(),
        enrage: this.wasm.exports.getLiveEnemyEnrage(),
        enrageSpeedReduction: this.wasm.exports.getLiveEnemyEnrageSpeedReduction()
      }
    };
  }
}