async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.setPrototypeOf({
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
    }, Object.assign(Object.create(globalThis), imports.env || {})),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    HunterType: (values => (
      // assembly/index/HunterType
      values[values.BORGE = exports["HunterType.BORGE"].valueOf()] = "BORGE",
      values[values.OZZY = exports["HunterType.OZZY"].valueOf()] = "OZZY",
      values[values.KNOX = exports["HunterType.KNOX"].valueOf()] = "KNOX",
      values
    ))({}),
    getLastProgressString() {
      // assembly/evalBorge/getLastProgressString() => ~lib/string/String
      return __liftString(exports.getLastProgressString() >>> 0);
    },
    getLastStatsString() {
      // assembly/evalBorge/getLastStatsString() => ~lib/string/String
      return __liftString(exports.getLastStatsString() >>> 0);
    },
    getDeathsByStageAndReviveString() {
      // assembly/evalBorge/getDeathsByStageAndReviveString() => ~lib/string/String
      return __liftString(exports.getDeathsByStageAndReviveString() >>> 0);
    },
    liveSimulationStep() {
      // assembly/evalBorge/liveSimulationStep() => bool
      return exports.liveSimulationStep() != 0;
    },
    getLiveIsBoss() {
      // assembly/evalBorge/getLiveIsBoss() => bool
      return exports.getLiveIsBoss() != 0;
    },
    getLiveFuryEnabled() {
      // assembly/evalBorge/getLiveFuryEnabled() => bool
      return exports.getLiveFuryEnabled() != 0;
    },
    getLiveLastEventType() {
      // assembly/evalBorge/getLiveLastEventType() => ~lib/string/String
      return __liftString(exports.getLiveLastEventType() >>> 0);
    },
    getLiveIsFinished() {
      // assembly/evalBorge/getLiveIsFinished() => bool
      return exports.getLiveIsFinished() != 0;
    },
    getOzzyDeathsByStageAndReviveString() {
      // assembly/evalOzzy/getOzzyDeathsByStageAndReviveString() => ~lib/string/String
      return __liftString(exports.getOzzyDeathsByStageAndReviveString() >>> 0);
    },
    getKnoxDeathsByStageAndReviveString() {
      // assembly/evalKnox/getKnoxDeathsByStageAndReviveString() => ~lib/string/String
      return __liftString(exports.getKnoxDeathsByStageAndReviveString() >>> 0);
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  return adaptedExports;
}
export const {
  memory,
  multiWasm,
  testMultiFunction,
  HunterType,
  getWasmBuildTimestamp,
  EVALBORGE_WASM,
  testEnemyCreation,
  getLastAvgStage,
  getLastAvgTime,
  getLastMinStage,
  getLastMaxStage,
  getLastBossHpPercent,
  getLastBossKillRate,
  getLastMat1,
  getLastMat2,
  getLastMat3,
  getLastXp,
  getLastProgressString,
  getLastStatsString,
  getLastBorgeMaxHp,
  getLastBorgeAtk,
  getLastBorgeRegen,
  getLastBorgeDr,
  getLastBorgeEvade,
  getLastBorgeEffect,
  getLastBorgeCritRate,
  getLastBorgeCritPower,
  getLastBorgeReload,
  getProgressSize,
  getProgressStageAt,
  getProgressCountAt,
  getDeathsByStageAndReviveSize,
  getDeathKeyAt,
  getDeathCountAt,
  getDeathsByStageAndReviveString,
  initLiveSimulation,
  liveSimulationStep,
  getLiveBorgeHp,
  getLiveBorgeMaxHp,
  getLiveBorgeAtk,
  getLiveBorgeRevives,
  getLiveCurrentTime,
  getLiveCurrentEnem,
  getLiveCurrentStage,
  getLiveEnemyHp,
  getLiveEnemyMaxHp,
  getLiveIsBoss,
  getLiveNextAtk,
  getLiveNextEnemAtk,
  getLiveNextRegen,
  getLiveNextAthena,
  getLiveNextFury,
  getLiveFuryEnabled,
  getLiveLastEventType,
  getLiveLastEventDamage,
  getLiveLastEventHealing,
  getLiveLastEventStage,
  getLiveIsFinished,
  EVALOZZY_WASM,
  getLastOzzyAvgStage,
  getLastOzzyAvgTime,
  getLastOzzyMinStage,
  getLastOzzyMaxStage,
  getLastOzzyBossHpPercent,
  getLastOzzyBossKillRate,
  getLastOzzyMat1,
  getLastOzzyMat2,
  getLastOzzyMat3,
  getLastOzzyXp,
  getLastOzzyMaxHp,
  getLastOzzyAtk,
  getLastOzzyRegen,
  getLastOzzyDr,
  getLastOzzyEvade,
  getLastOzzyEffect,
  getLastOzzyMultistrike,
  getLastOzzyMultistrikePower,
  getLastOzzyReload,
  getOzzyProgressSize,
  getOzzyProgressStageAt,
  getOzzyProgressCountAt,
  getOzzyDeathsByStageAndReviveSize,
  getOzzyDeathKeyAt,
  getOzzyDeathCountAt,
  getOzzyDeathsByStageAndReviveString,
  EVALKNOX_WASM,
  getLastKnoxAvgStage,
  getLastKnoxAvgTime,
  getLastKnoxMinStage,
  getLastKnoxMaxStage,
  getLastKnoxBossHpPercent,
  getLastKnoxBossKillRate,
  getLastKnoxMat1,
  getLastKnoxMat2,
  getLastKnoxMat3,
  getLastKnoxXp,
  getLastKnoxMaxHp,
  getLastKnoxAtk,
  getLastKnoxRegen,
  getLastKnoxDr,
  getLastKnoxBlock,
  getLastKnoxEffect,
  getLastKnoxCharge,
  getLastKnoxChargeGain,
  getLastKnoxReload,
  getLastKnoxSc,
  getKnoxProgressSize,
  getKnoxProgressStageAt,
  getKnoxProgressCountAt,
  getKnoxDeathsByStageAndReviveSize,
  getKnoxDeathKeyAt,
  getKnoxDeathCountAt,
  getKnoxDeathsByStageAndReviveString,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("release.wasm", import.meta.url));
