/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/multiWasm
 * @param enemyNum `i32`
 * @returns `f64`
 */
export declare function multiWasm(enemyNum: number): number;
/**
 * assembly/index/testMultiFunction
 * @returns `f64`
 */
export declare function testMultiFunction(): number;
/** assembly/index/HunterType */
export declare enum HunterType {
  /** @type `i32` */
  BORGE,
  /** @type `i32` */
  OZZY,
  /** @type `i32` */
  KNOX,
}
/**
 * assembly/index/getWasmBuildTimestamp
 * @returns `i32`
 */
export declare function getWasmBuildTimestamp(): number;
/**
 * assembly/evalBorge/EVALBORGE_WASM
 * @param lvl `i32`
 * @param maxStage `i32`
 * @param hp `i32`
 * @param atk `i32`
 * @param regen `i32`
 * @param dr `i32`
 * @param evade `i32`
 * @param effect `i32`
 * @param critRate `i32`
 * @param critPower `i32`
 * @param aspd `i32`
 * @param revival `i32`
 * @param life `i32`
 * @param ua `i32`
 * @param impacts `i32`
 * @param omen `i32`
 * @param ll `i32`
 * @param pog `i32`
 * @param ultimaTalent `i32`
 * @param fow `i32`
 * @param ares `i32`
 * @param ylith `i32`
 * @param spartan `i32`
 * @param timeless `i32`
 * @param bfb `i32`
 * @param athena `i32`
 * @param baal `i32`
 * @param sensors `i32`
 * @param atlas `i32`
 * @param mino `i32`
 * @param helltouch `i32`
 * @param punches `i32`
 * @param weakspot `i32`
 * @param hermes `i32`
 * @param inhaler `i32`
 * @param gadget `i32`
 * @param iap `i32`
 * @param special `f64`
 * @param ultima `f64`
 * @param reviveCd `i32`
 * @param trample `i32`
 * @param scavengers `i32`
 * @param m0 `i32`
 * @param r4 `i32`
 * @param r7 `i32`
 * @param r16 `i32`
 * @param r19 `i32`
 * @param i3 `i32`
 * @param i4 `i32`
 * @param i11 `i32`
 * @param i13 `i32`
 * @param i14 `i32`
 * @param i23 `i32`
 * @param i24 `i32`
 * @param i27 `i32`
 * @param i44 `i32`
 * @param i60 `i32`
 * @param i80 `i32`
 * @param i84 `i32`
 * @param i87 `i32`
 * @param i88 `i32`
 * @param i89 `i32`
 * @param i91 `i32`
 * @param creaGN1 `i32`
 * @param creaGN2 `i32`
 * @param creaGN3 `i32`
 * @param innoGN3 `i32`
 * @param attrGN2 `i32`
 * @param attrGN3 `i32`
 * @param attr `i32`
 * @param catchup99gu `i32`
 * @param lootgu `i32`
 * @param card `i32`
 * @param research81 `i32`
 * @param iters `i32`
 * @param cm46 `i32`
 * @param cm47 `i32`
 * @param cm48 `i32`
 * @param cm51 `i32`
 * @param creastat `i32`
 * @returns `f64`
 */
export declare function EVALBORGE_WASM(lvl: number, maxStage: number, hp: number, atk: number, regen: number, dr: number, evade: number, effect: number, critRate: number, critPower: number, aspd: number, revival: number, life: number, ua: number, impacts: number, omen: number, ll: number, pog: number, ultimaTalent: number, fow: number, ares: number, ylith: number, spartan: number, timeless: number, bfb: number, athena: number, baal: number, sensors: number, atlas: number, mino: number, helltouch: number, punches: number, weakspot: number, hermes: number, inhaler: number, gadget: number, iap: number, special: number, ultima: number, reviveCd: number, trample: number, scavengers: number, m0: number, r4: number, r7: number, r16: number, r19: number, i3: number, i4: number, i11: number, i13: number, i14: number, i23: number, i24: number, i27: number, i44: number, i60: number, i80: number, i84: number, i87: number, i88: number, i89: number, i91: number, creaGN1: number, creaGN2: number, creaGN3: number, innoGN3: number, attrGN2: number, attrGN3: number, attr: number, catchup99gu: number, lootgu: number, card: number, research81: number, iters: number, cm46: number, cm47: number, cm48: number, cm51: number, creastat: number): number;
/**
 * assembly/evalBorge/testEnemyCreation
 * @returns `f64`
 */
export declare function testEnemyCreation(): number;
/**
 * assembly/evalBorge/getLastAvgStage
 * @returns `f64`
 */
export declare function getLastAvgStage(): number;
/**
 * assembly/evalBorge/getLastAvgTime
 * @returns `f64`
 */
export declare function getLastAvgTime(): number;
/**
 * assembly/evalBorge/getLastMinStage
 * @returns `f64`
 */
export declare function getLastMinStage(): number;
/**
 * assembly/evalBorge/getLastMaxStage
 * @returns `f64`
 */
export declare function getLastMaxStage(): number;
/**
 * assembly/evalBorge/getLastBossHpPercent
 * @returns `f64`
 */
export declare function getLastBossHpPercent(): number;
/**
 * assembly/evalBorge/getLastBossKillRate
 * @returns `f64`
 */
export declare function getLastBossKillRate(): number;
/**
 * assembly/evalBorge/getLastMat1
 * @returns `f64`
 */
export declare function getLastMat1(): number;
/**
 * assembly/evalBorge/getLastMat2
 * @returns `f64`
 */
export declare function getLastMat2(): number;
/**
 * assembly/evalBorge/getLastMat3
 * @returns `f64`
 */
export declare function getLastMat3(): number;
/**
 * assembly/evalBorge/getLastXp
 * @returns `f64`
 */
export declare function getLastXp(): number;
/**
 * assembly/evalBorge/getLastProgressString
 * @returns `~lib/string/String`
 */
export declare function getLastProgressString(): string;
/**
 * assembly/evalBorge/getLastStatsString
 * @returns `~lib/string/String`
 */
export declare function getLastStatsString(): string;
/**
 * assembly/evalBorge/getLastBorgeMaxHp
 * @returns `f64`
 */
export declare function getLastBorgeMaxHp(): number;
/**
 * assembly/evalBorge/getLastBorgeAtk
 * @returns `f64`
 */
export declare function getLastBorgeAtk(): number;
/**
 * assembly/evalBorge/getLastBorgeRegen
 * @returns `f64`
 */
export declare function getLastBorgeRegen(): number;
/**
 * assembly/evalBorge/getLastBorgeDr
 * @returns `f64`
 */
export declare function getLastBorgeDr(): number;
/**
 * assembly/evalBorge/getLastBorgeEvade
 * @returns `f64`
 */
export declare function getLastBorgeEvade(): number;
/**
 * assembly/evalBorge/getLastBorgeEffect
 * @returns `f64`
 */
export declare function getLastBorgeEffect(): number;
/**
 * assembly/evalBorge/getLastBorgeCritRate
 * @returns `f64`
 */
export declare function getLastBorgeCritRate(): number;
/**
 * assembly/evalBorge/getLastBorgeCritPower
 * @returns `f64`
 */
export declare function getLastBorgeCritPower(): number;
/**
 * assembly/evalBorge/getLastBorgeReload
 * @returns `f64`
 */
export declare function getLastBorgeReload(): number;
/**
 * assembly/evalBorge/getProgressSize
 * @returns `i32`
 */
export declare function getProgressSize(): number;
/**
 * assembly/evalBorge/getProgressStageAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getProgressStageAt(index: number): number;
/**
 * assembly/evalBorge/getProgressCountAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getProgressCountAt(index: number): number;
/**
 * assembly/evalBorge/getDeathsByStageAndReviveSize
 * @returns `i32`
 */
export declare function getDeathsByStageAndReviveSize(): number;
/**
 * assembly/evalBorge/getDeathKeyAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getDeathKeyAt(index: number): number;
/**
 * assembly/evalBorge/getDeathCountAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getDeathCountAt(index: number): number;
/**
 * assembly/evalBorge/getDeathsByStageAndReviveString
 * @returns `~lib/string/String`
 */
export declare function getDeathsByStageAndReviveString(): string;
/**
 * assembly/evalBorge/initLiveSimulation
 * @param lvl `i32`
 * @param maxStage `i32`
 * @param hp `i32`
 * @param atk `i32`
 * @param regen `i32`
 * @param dr `i32`
 * @param evade `i32`
 * @param effect `i32`
 * @param critRate `i32`
 * @param critPower `i32`
 * @param aspd `i32`
 * @param revival `i32`
 * @param life `i32`
 * @param ua `i32`
 * @param impacts `i32`
 * @param omen `i32`
 * @param ll `i32`
 * @param pog `i32`
 * @param ultimaTalent `i32`
 * @param fow `i32`
 * @param ares `i32`
 * @param ylith `i32`
 * @param spartan `i32`
 * @param timeless `i32`
 * @param bfb `i32`
 * @param athena `i32`
 * @param baal `i32`
 * @param sensors `i32`
 * @param atlas `i32`
 * @param mino `i32`
 * @param helltouch `i32`
 * @param punches `i32`
 * @param weakspot `i32`
 * @param hermes `i32`
 * @param inhaler `i32`
 * @param gadget `i32`
 * @param iap `i32`
 * @param special `f64`
 * @param ultima `f64`
 * @param reviveCd `i32`
 * @param trample `i32`
 * @param scavengers `i32`
 * @param m0 `i32`
 * @param r4 `i32`
 * @param r7 `i32`
 * @param r16 `i32`
 * @param r19 `i32`
 * @param i3 `i32`
 * @param i4 `i32`
 * @param i11 `i32`
 * @param i13 `i32`
 * @param i14 `i32`
 * @param i23 `i32`
 * @param i24 `i32`
 * @param i27 `i32`
 * @param i44 `i32`
 * @param i60 `i32`
 * @param i80 `i32`
 * @param i84 `i32`
 * @param i87 `i32`
 * @param i88 `i32`
 * @param i89 `i32`
 * @param i91 `i32`
 * @param creaGN1 `i32`
 * @param creaGN2 `i32`
 * @param creaGN3 `i32`
 * @param innoGN3 `i32`
 * @param attrGN2 `i32`
 * @param attrGN3 `i32`
 * @param attr `i32`
 * @param catchup99gu `i32`
 * @param lootgu `i32`
 * @param card `i32`
 * @param research81 `i32`
 * @param iters `i32`
 * @param cm46 `i32`
 * @param cm47 `i32`
 * @param cm48 `i32`
 * @param cm51 `i32`
 * @param creastat `i32`
 */
export declare function initLiveSimulation(lvl: number, maxStage: number, hp: number, atk: number, regen: number, dr: number, evade: number, effect: number, critRate: number, critPower: number, aspd: number, revival: number, life: number, ua: number, impacts: number, omen: number, ll: number, pog: number, ultimaTalent: number, fow: number, ares: number, ylith: number, spartan: number, timeless: number, bfb: number, athena: number, baal: number, sensors: number, atlas: number, mino: number, helltouch: number, punches: number, weakspot: number, hermes: number, inhaler: number, gadget: number, iap: number, special: number, ultima: number, reviveCd: number, trample: number, scavengers: number, m0: number, r4: number, r7: number, r16: number, r19: number, i3: number, i4: number, i11: number, i13: number, i14: number, i23: number, i24: number, i27: number, i44: number, i60: number, i80: number, i84: number, i87: number, i88: number, i89: number, i91: number, creaGN1: number, creaGN2: number, creaGN3: number, innoGN3: number, attrGN2: number, attrGN3: number, attr: number, catchup99gu: number, lootgu: number, card: number, research81: number, iters: number, cm46: number, cm47: number, cm48: number, cm51: number, creastat: number): void;
/**
 * assembly/evalBorge/liveSimulationStep
 * @returns `bool`
 */
export declare function liveSimulationStep(): boolean;
/**
 * assembly/evalBorge/getLiveBorgeHp
 * @returns `f64`
 */
export declare function getLiveBorgeHp(): number;
/**
 * assembly/evalBorge/getLiveBorgeMaxHp
 * @returns `f64`
 */
export declare function getLiveBorgeMaxHp(): number;
/**
 * assembly/evalBorge/getLiveBorgeAtk
 * @returns `f64`
 */
export declare function getLiveBorgeAtk(): number;
/**
 * assembly/evalBorge/getLiveBorgeRevives
 * @returns `i32`
 */
export declare function getLiveBorgeRevives(): number;
/**
 * assembly/evalBorge/getLiveCurrentTime
 * @returns `f64`
 */
export declare function getLiveCurrentTime(): number;
/**
 * assembly/evalBorge/getLiveCurrentEnem
 * @returns `i32`
 */
export declare function getLiveCurrentEnem(): number;
/**
 * assembly/evalBorge/getLiveCurrentStage
 * @returns `i32`
 */
export declare function getLiveCurrentStage(): number;
/**
 * assembly/evalBorge/getLiveEnemyHp
 * @returns `f64`
 */
export declare function getLiveEnemyHp(): number;
/**
 * assembly/evalBorge/getLiveEnemyMaxHp
 * @returns `f64`
 */
export declare function getLiveEnemyMaxHp(): number;
/**
 * assembly/evalBorge/getLiveIsBoss
 * @returns `bool`
 */
export declare function getLiveIsBoss(): boolean;
/**
 * assembly/evalBorge/getLiveNextAtk
 * @returns `f64`
 */
export declare function getLiveNextAtk(): number;
/**
 * assembly/evalBorge/getLiveNextEnemAtk
 * @returns `f64`
 */
export declare function getLiveNextEnemAtk(): number;
/**
 * assembly/evalBorge/getLiveNextRegen
 * @returns `f64`
 */
export declare function getLiveNextRegen(): number;
/**
 * assembly/evalBorge/getLiveNextAthena
 * @returns `f64`
 */
export declare function getLiveNextAthena(): number;
/**
 * assembly/evalBorge/getLiveNextFury
 * @returns `f64`
 */
export declare function getLiveNextFury(): number;
/**
 * assembly/evalBorge/getLiveFuryEnabled
 * @returns `bool`
 */
export declare function getLiveFuryEnabled(): boolean;
/**
 * assembly/evalBorge/getLiveLastEventType
 * @returns `~lib/string/String`
 */
export declare function getLiveLastEventType(): string;
/**
 * assembly/evalBorge/getLiveLastEventDamage
 * @returns `f64`
 */
export declare function getLiveLastEventDamage(): number;
/**
 * assembly/evalBorge/getLiveLastEventHealing
 * @returns `f64`
 */
export declare function getLiveLastEventHealing(): number;
/**
 * assembly/evalBorge/getLiveLastEventStage
 * @returns `i32`
 */
export declare function getLiveLastEventStage(): number;
/**
 * assembly/evalBorge/getLiveIsFinished
 * @returns `bool`
 */
export declare function getLiveIsFinished(): boolean;
/**
 * assembly/evalOzzy/EVALOZZY_WASM
 * @param lvl `i32`
 * @param maxStage `i32`
 * @param hp `i32`
 * @param atk `i32`
 * @param regen `i32`
 * @param dr `i32`
 * @param evade `i32`
 * @param effect `i32`
 * @param multistrike `i32`
 * @param multistrikePower `i32`
 * @param aspd `i32`
 * @param revival `i32`
 * @param trickster `i32`
 * @param ua `i32`
 * @param thousandNeedles `i32`
 * @param omen `i32`
 * @param ll `i32`
 * @param crippling `i32`
 * @param ultimaTalent `i32`
 * @param echoBullets `i32`
 * @param lotl `i32`
 * @param exo `i32`
 * @param scorp `i32`
 * @param dod `i32`
 * @param cat `i32`
 * @param timeless `i32`
 * @param wings `i32`
 * @param exterm `i32`
 * @param medusa `i32`
 * @param scarab `i32`
 * @param vectid `i32`
 * @param snek `i32`
 * @param cod `i32`
 * @param dwd `i32`
 * @param sisters `i32`
 * @param gadget `i32`
 * @param iap `i32`
 * @param special `f64`
 * @param ultima `f64`
 * @param reviveCd `i32`
 * @param scavengers `i32`
 * @param m0 `i32`
 * @param r4 `i32`
 * @param r7 `i32`
 * @param r17 `i32`
 * @param i31 `i32`
 * @param i32_ `i32`
 * @param i33 `i32`
 * @param i36 `i32`
 * @param i37 `i32`
 * @param i40 `i32`
 * @param i81 `i32`
 * @param i86 `i32`
 * @param i92 `i32`
 * @param innoGN2 `i32`
 * @param innoGN3 `i32`
 * @param attrGN3 `i32`
 * @param attr `i32`
 * @param catchup99gu `i32`
 * @param lootgu `i32`
 * @param card `i32`
 * @param research81 `i32`
 * @param iters `i32`
 * @param cm46 `i32`
 * @param cm47 `i32`
 * @param cm48 `i32`
 * @param cm51 `i32`
 * @param creastat `i32`
 * @returns `f64`
 */
export declare function EVALOZZY_WASM(lvl: number, maxStage: number, hp: number, atk: number, regen: number, dr: number, evade: number, effect: number, multistrike: number, multistrikePower: number, aspd: number, revival: number, trickster: number, ua: number, thousandNeedles: number, omen: number, ll: number, crippling: number, ultimaTalent: number, echoBullets: number, lotl: number, exo: number, scorp: number, dod: number, cat: number, timeless: number, wings: number, exterm: number, medusa: number, scarab: number, vectid: number, snek: number, cod: number, dwd: number, sisters: number, gadget: number, iap: number, special: number, ultima: number, reviveCd: number, scavengers: number, m0: number, r4: number, r7: number, r17: number, i31: number, i32_: number, i33: number, i36: number, i37: number, i40: number, i81: number, i86: number, i92: number, innoGN2: number, innoGN3: number, attrGN3: number, attr: number, catchup99gu: number, lootgu: number, card: number, research81: number, iters: number, cm46: number, cm47: number, cm48: number, cm51: number, creastat: number): number;
/**
 * assembly/evalOzzy/getLastOzzyAvgStage
 * @returns `f64`
 */
export declare function getLastOzzyAvgStage(): number;
/**
 * assembly/evalOzzy/getLastOzzyAvgTime
 * @returns `f64`
 */
export declare function getLastOzzyAvgTime(): number;
/**
 * assembly/evalOzzy/getLastOzzyMinStage
 * @returns `f64`
 */
export declare function getLastOzzyMinStage(): number;
/**
 * assembly/evalOzzy/getLastOzzyMaxStage
 * @returns `f64`
 */
export declare function getLastOzzyMaxStage(): number;
/**
 * assembly/evalOzzy/getLastOzzyBossHpPercent
 * @returns `f64`
 */
export declare function getLastOzzyBossHpPercent(): number;
/**
 * assembly/evalOzzy/getLastOzzyBossKillRate
 * @returns `f64`
 */
export declare function getLastOzzyBossKillRate(): number;
/**
 * assembly/evalOzzy/getLastOzzyMat1
 * @returns `f64`
 */
export declare function getLastOzzyMat1(): number;
/**
 * assembly/evalOzzy/getLastOzzyMat2
 * @returns `f64`
 */
export declare function getLastOzzyMat2(): number;
/**
 * assembly/evalOzzy/getLastOzzyMat3
 * @returns `f64`
 */
export declare function getLastOzzyMat3(): number;
/**
 * assembly/evalOzzy/getLastOzzyXp
 * @returns `f64`
 */
export declare function getLastOzzyXp(): number;
/**
 * assembly/evalOzzy/getLastOzzyMaxHp
 * @returns `f64`
 */
export declare function getLastOzzyMaxHp(): number;
/**
 * assembly/evalOzzy/getLastOzzyAtk
 * @returns `f64`
 */
export declare function getLastOzzyAtk(): number;
/**
 * assembly/evalOzzy/getLastOzzyRegen
 * @returns `f64`
 */
export declare function getLastOzzyRegen(): number;
/**
 * assembly/evalOzzy/getLastOzzyDr
 * @returns `f64`
 */
export declare function getLastOzzyDr(): number;
/**
 * assembly/evalOzzy/getLastOzzyEvade
 * @returns `f64`
 */
export declare function getLastOzzyEvade(): number;
/**
 * assembly/evalOzzy/getLastOzzyEffect
 * @returns `f64`
 */
export declare function getLastOzzyEffect(): number;
/**
 * assembly/evalOzzy/getLastOzzyMultistrike
 * @returns `f64`
 */
export declare function getLastOzzyMultistrike(): number;
/**
 * assembly/evalOzzy/getLastOzzyMultistrikePower
 * @returns `f64`
 */
export declare function getLastOzzyMultistrikePower(): number;
/**
 * assembly/evalOzzy/getLastOzzyReload
 * @returns `f64`
 */
export declare function getLastOzzyReload(): number;
/**
 * assembly/evalOzzy/getOzzyProgressSize
 * @returns `i32`
 */
export declare function getOzzyProgressSize(): number;
/**
 * assembly/evalOzzy/getOzzyProgressStageAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getOzzyProgressStageAt(index: number): number;
/**
 * assembly/evalOzzy/getOzzyProgressCountAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getOzzyProgressCountAt(index: number): number;
/**
 * assembly/evalOzzy/getOzzyDeathsByStageAndReviveSize
 * @returns `i32`
 */
export declare function getOzzyDeathsByStageAndReviveSize(): number;
/**
 * assembly/evalOzzy/getOzzyDeathKeyAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getOzzyDeathKeyAt(index: number): number;
/**
 * assembly/evalOzzy/getOzzyDeathCountAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getOzzyDeathCountAt(index: number): number;
/**
 * assembly/evalOzzy/getOzzyDeathsByStageAndReviveString
 * @returns `~lib/string/String`
 */
export declare function getOzzyDeathsByStageAndReviveString(): string;
/**
 * assembly/evalKnox/EVALKNOX_WASM
 * @param lvl `i32`
 * @param maxStage `i32`
 * @param hp `i32`
 * @param atk `i32`
 * @param regen `i32`
 * @param dr `i32`
 * @param block `i32`
 * @param effect `i32`
 * @param charge `i32`
 * @param chargeGain `i32`
 * @param reload `i32`
 * @param proj `i32`
 * @param revival `i32`
 * @param calyp `i32`
 * @param ua `i32`
 * @param ghost `i32`
 * @param omen `i32`
 * @param ll `i32`
 * @param pog `i32`
 * @param finish `i32`
 * @param kraken `i32`
 * @param amp `i32`
 * @param dead `i32`
 * @param sear `i32`
 * @param pirate `i32`
 * @param timeless `i32`
 * @param torpedos `i32`
 * @param charger `i32`
 * @param armory `i32`
 * @param elixer `i32`
 * @param reflect `i32`
 * @param gadget `i32`
 * @param iters `i32`
 * @param iap `i32`
 * @param special `f64`
 * @param ultima `f64`
 * @param glac `i32`
 * @param quartz `i32`
 * @param tess `i32`
 * @param reviveCd `i32`
 * @param respec `i32`
 * @param bossLootRate `i32`
 * @param iterative `i32`
 * @param glacRate1 `i32`
 * @param quartzRate1 `i32`
 * @param tessRate1 `i32`
 * @param xpRate1 `i32`
 * @param hp1 `i32`
 * @param atk1 `i32`
 * @param regen1 `i32`
 * @param dr1 `i32`
 * @param block1 `i32`
 * @param effect1 `i32`
 * @param charge1 `i32`
 * @param chargeGain1 `i32`
 * @param reload1 `i32`
 * @param proj1 `i32`
 * @param gadget1 `i32`
 * @param lvl1 `i32`
 * @param time1 `i32`
 * @param research81 `i32`
 * @param cm46 `i32`
 * @param cm47 `i32`
 * @param cm48 `i32`
 * @param cm51 `i32`
 * @param creastat `i32`
 * @returns `f64`
 */
export declare function EVALKNOX_WASM(lvl: number, maxStage: number, hp: number, atk: number, regen: number, dr: number, block: number, effect: number, charge: number, chargeGain: number, reload: number, proj: number, revival: number, calyp: number, ua: number, ghost: number, omen: number, ll: number, pog: number, finish: number, kraken: number, amp: number, dead: number, sear: number, pirate: number, timeless: number, torpedos: number, charger: number, armory: number, elixer: number, reflect: number, gadget: number, iters: number, iap: number, special: number, ultima: number, glac: number, quartz: number, tess: number, reviveCd: number, respec: number, bossLootRate: number, iterative: number, glacRate1: number, quartzRate1: number, tessRate1: number, xpRate1: number, hp1: number, atk1: number, regen1: number, dr1: number, block1: number, effect1: number, charge1: number, chargeGain1: number, reload1: number, proj1: number, gadget1: number, lvl1: number, time1: number, research81: number, cm46: number, cm47: number, cm48: number, cm51: number, creastat: number): number;
/**
 * assembly/evalKnox/getLastKnoxAvgStage
 * @returns `f64`
 */
export declare function getLastKnoxAvgStage(): number;
/**
 * assembly/evalKnox/getLastKnoxAvgTime
 * @returns `f64`
 */
export declare function getLastKnoxAvgTime(): number;
/**
 * assembly/evalKnox/getLastKnoxMinStage
 * @returns `f64`
 */
export declare function getLastKnoxMinStage(): number;
/**
 * assembly/evalKnox/getLastKnoxMaxStage
 * @returns `f64`
 */
export declare function getLastKnoxMaxStage(): number;
/**
 * assembly/evalKnox/getLastKnoxBossHpPercent
 * @returns `f64`
 */
export declare function getLastKnoxBossHpPercent(): number;
/**
 * assembly/evalKnox/getLastKnoxBossKillRate
 * @returns `f64`
 */
export declare function getLastKnoxBossKillRate(): number;
/**
 * assembly/evalKnox/getLastKnoxMat1
 * @returns `f64`
 */
export declare function getLastKnoxMat1(): number;
/**
 * assembly/evalKnox/getLastKnoxMat2
 * @returns `f64`
 */
export declare function getLastKnoxMat2(): number;
/**
 * assembly/evalKnox/getLastKnoxMat3
 * @returns `f64`
 */
export declare function getLastKnoxMat3(): number;
/**
 * assembly/evalKnox/getLastKnoxXp
 * @returns `f64`
 */
export declare function getLastKnoxXp(): number;
/**
 * assembly/evalKnox/getLastKnoxMaxHp
 * @returns `f64`
 */
export declare function getLastKnoxMaxHp(): number;
/**
 * assembly/evalKnox/getLastKnoxAtk
 * @returns `f64`
 */
export declare function getLastKnoxAtk(): number;
/**
 * assembly/evalKnox/getLastKnoxRegen
 * @returns `f64`
 */
export declare function getLastKnoxRegen(): number;
/**
 * assembly/evalKnox/getLastKnoxDr
 * @returns `f64`
 */
export declare function getLastKnoxDr(): number;
/**
 * assembly/evalKnox/getLastKnoxBlock
 * @returns `f64`
 */
export declare function getLastKnoxBlock(): number;
/**
 * assembly/evalKnox/getLastKnoxEffect
 * @returns `f64`
 */
export declare function getLastKnoxEffect(): number;
/**
 * assembly/evalKnox/getLastKnoxCharge
 * @returns `f64`
 */
export declare function getLastKnoxCharge(): number;
/**
 * assembly/evalKnox/getLastKnoxChargeGain
 * @returns `f64`
 */
export declare function getLastKnoxChargeGain(): number;
/**
 * assembly/evalKnox/getLastKnoxReload
 * @returns `f64`
 */
export declare function getLastKnoxReload(): number;
/**
 * assembly/evalKnox/getLastKnoxSc
 * @returns `f64`
 */
export declare function getLastKnoxSc(): number;
/**
 * assembly/evalKnox/getKnoxProgressSize
 * @returns `i32`
 */
export declare function getKnoxProgressSize(): number;
/**
 * assembly/evalKnox/getKnoxProgressStageAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getKnoxProgressStageAt(index: number): number;
/**
 * assembly/evalKnox/getKnoxProgressCountAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getKnoxProgressCountAt(index: number): number;
/**
 * assembly/evalKnox/getKnoxDeathsByStageAndReviveSize
 * @returns `i32`
 */
export declare function getKnoxDeathsByStageAndReviveSize(): number;
/**
 * assembly/evalKnox/getKnoxDeathKeyAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getKnoxDeathKeyAt(index: number): number;
/**
 * assembly/evalKnox/getKnoxDeathCountAt
 * @param index `i32`
 * @returns `i32`
 */
export declare function getKnoxDeathCountAt(index: number): number;
/**
 * assembly/evalKnox/getKnoxDeathsByStageAndReviveString
 * @returns `~lib/string/String`
 */
export declare function getKnoxDeathsByStageAndReviveString(): string;
