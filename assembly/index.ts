// Haupt-Index-Datei - nur Imports und Exports

// Borge Imports
import { 
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
} from './evalBorge';

// Ozzy Imports
import {
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
  getOzzyBossKillsByReviveSize,
  getOzzyBossRemainingReviveAt,
  getOzzyBossKillCountAt,
  getOzzyBossAttemptCountAt
} from './evalOzzy';

// Knox Imports
import {
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
  getKnoxDeathsByStageAndReviveString
} from './evalKnox';

export function multiWasm(enemyNum: i32): f64 {
  return Math.max(1, 1 +
    Math.max(0, (enemyNum - 149) * 0.006) +
    Math.max(0, (enemyNum - 199) * 0.006) +
    Math.max(0, (enemyNum - 249) * 0.006) +
    Math.max(0, (enemyNum - 299) * 0.006) +
    Math.max(0, (enemyNum - 309) * 0.003) +
    Math.max(0, (enemyNum - 319) * 0.003) +
    Math.max(0, (enemyNum - 329) * 0.004) +
    Math.max(0, (enemyNum - 339) * 0.004) +
    Math.max(0, (enemyNum - 349) * 0.005) +
    Math.max(0, (enemyNum - 359) * 0.005) +
    Math.max(0, (enemyNum - 369) * 0.006) +
    Math.max(0, (enemyNum - 379) * 0.006) +
    Math.max(0, (enemyNum - 389) * 0.007)
  ) * Math.pow(1.01, Math.max(0, enemyNum - 350) as f64);
}

export function testMultiFunction(): f64 {
  let sum: f64 = 0;
  for (let i = 0; i < 100000; i++) {
    sum += multiWasm(i % 1000);
  }
  return sum;
}

// Re-Export aller BORGE-Funktionen
export { 
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
};

// Re-Export aller OZZY-Funktionen
export {
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
  getOzzyBossKillsByReviveSize,
  getOzzyBossRemainingReviveAt,
  getOzzyBossKillCountAt,
  getOzzyBossAttemptCountAt
};

// Re-Export aller KNOX-Funktionen
export {
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
  getKnoxDeathsByStageAndReviveString
};

// Hunter-Type Enum
export enum HunterType {
  BORGE = 0,
  OZZY = 1,
  KNOX = 2
}

export function getWasmBuildTimestamp(): i32 {
  return 20250613; 
}