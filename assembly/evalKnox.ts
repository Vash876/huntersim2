// Random Number Generator 
let seed: u32 = 12345;
function random(): f64 {
  seed = (((seed as u64) * 1664525 + 1013904223) % 4294967296) as u32;
  return (seed as f64) / 4294967296.0;
}

function ck(chance: f64): boolean {
  return chance > 0 && chance > random();
}

// Multi-Funktion für Knox 
function knoxMulti(enemyNum: i32): f64 {
  return Math.max(1, 1 + (enemyNum - 49) * 0.006 +
    Math.max(0, (enemyNum - 99) * 0.006) +
    Math.max(0, (enemyNum - 119) * 0.01) +
    Math.max(0, (enemyNum - 129) * 0.008) +
    Math.max(0, (enemyNum - 139) * 0.006) +
    Math.max(0, (enemyNum - 149) * 0.006) +
    Math.max(0, (enemyNum - 159) * 0.006) +
    Math.max(0, (enemyNum - 169) * 0.006) +
    Math.max(0, (enemyNum - 179) * 0.006) +
    Math.max(0, (enemyNum - 189) * 0.006) +
    Math.max(0, (enemyNum - 199) * 0.006) +
    Math.max(0, (enemyNum - 219) * 0.02) +
    Math.max(0, (enemyNum - 249) * 0.006) +
    Math.max(0, (enemyNum - 299) * 0.006) +
    Math.max(0, (enemyNum - 309) * 0.003) +
    Math.max(0, (enemyNum - 319) * 0.02) +
    Math.max(0, (enemyNum - 329) * 0.004) +
    Math.max(0, (enemyNum - 339) * 0.004) +
    Math.max(0, (enemyNum - 349) * 0.005) +
    Math.max(0, (enemyNum - 359) * 0.005) +
    Math.max(0, (enemyNum - 369) * 0.006) +
    Math.max(0, (enemyNum - 379) * 0.006) +
    Math.max(0, (enemyNum - 389) * 0.007)
  );
}

// Min-Funktion für mehrere Werte
function knoxMinAll(a: f64, b: f64, c: f64, d: f64, e: f64): f64 {
  return Math.min(Math.min(Math.min(Math.min(a, b), c), d), e);
}

// Knox Enemy-Struktur
class KnoxEnemy {
  maxHp: f64;
  hp: f64;
  atk: f64;
  critRate: f64;
  critDmg: f64;
  dr: f64;
  evade: f64;
  regen: f64;
  atkSpd: f64;
  maxDps: f64;
  enrage: i32;

  constructor(enemyNum: i32) {
    const multiVal = knoxMulti(enemyNum);
    const floorDiv = Math.floor(Math.max(0, enemyNum - 1) / 100) as i32;
    const isBoss = enemyNum > 0 && enemyNum % 100 === 0;
    
    this.maxHp = (7 + 9 * enemyNum) * multiVal * Math.pow(3.2, floorDiv as f64) * (isBoss ? 120 : 1);
    this.hp = (7 + 9 * enemyNum) * multiVal * Math.pow(3.2, floorDiv as f64);
    
    this.atk = (2.4 + 1.4 * enemyNum) * multiVal * Math.pow(2.7, floorDiv as f64) * (isBoss ? 4 : 1);
    
    this.critRate = Math.min(0.25, 0.0994 + 0.0006 * enemyNum + (isBoss ? 0.1 : 0));
    
    this.critDmg = Math.min(2.5, 1.032 + 0.008 * enemyNum);
    
    if (enemyNum >= 200) {
      this.dr = (1 - (Math.max(0, floorDiv - 2) * 0.02 + 0.04)) - (isBoss ? 0.05 : 0);
    } else {
      this.dr = 1 - (isBoss ? 0.05 : 0);
    }
    
    this.evade = 0.01 * Math.floor(enemyNum / 100);
    
    this.regen = 0.04 * enemyNum * multiVal * Math.pow(1.4, floorDiv as f64) * (isBoss ? 2 : 1);
    
    this.atkSpd = (6.005 - 0.005 * enemyNum) * (isBoss ? 2.85 : 1);
    
    this.maxDps = (2.4 + 1.4 * enemyNum) * multiVal * (1.03 + 0.008 * enemyNum) / (6 - 0.005 * enemyNum) * Math.pow(2.7, floorDiv as f64);
    
    this.enrage = 0;
  }
}

// Boss Stats Struktur
class KnoxBossStats {
  hp: f64;
  kills: i32;
  
  constructor() {
    this.hp = 0;
    this.kills = 0;
  }
}

// Vorberechnete Enemies
const KNOX_ENEMIES = new StaticArray<KnoxEnemy>(1001);
function initKnoxEnemies(): void {
  for (let i = 0; i <= 1000; i++) {
    KNOX_ENEMIES[i] = new KnoxEnemy(i);
  }
}

// Knox Character Struktur 
class Knox {
  // Base Stats
  lvl: i32;
  maxStage: i32;
  maxHp: f64;
  hp: f64;
  atk: f64;
  salvo: f64;
  regen: f64;
  dr: f64;
  block: f64;
  effect: f64;
  charge: f64;
  chargeGain: f64;
  reload: f64;
  
  // Current Stats
  currentMaxHp: f64;
  currentAtk: f64;
  currentRegen: f64;
  revives: i32;
  remainingBullets: i32;
  time: f64;
  souls: f64;
  soulCap: f64;
  soulmult: f64;
  sc: f64;
  torpedoLimit: f64;
  charge1: f64;
  charge2: f64;
  totalCharge: f64;
  bonusRegen: i32;
  gbHit: boolean;
  
  // Base Stats Record 
  basehp: i32;
  baseatk: i32;
  basesalvo: i32;
  baseregen: i32;
  basedr: i32;
  baseblock: i32;
  baseeffect: i32;
  basecharge: i32;
  basechargeGain: i32;
  basereload: i32;
  
  // Talente 
  revival: i32;
  calyp: i32;
  ua: i32;
  ghost: i32;
  omen: i32;
  ll: i32;
  pog: i32;
  finish: i32;
  
  // Pfade 
  kraken: i32;
  amp: i32;
  dead: i32;
  sear: i32;
  pirate: i32;
  timeless: i32;
  torpedos: i32;
  charger: i32;
  armory: i32;
  elixer: i32;
  reflect: i32;
  
  // Simulation Results
  loot: f64;
  enem: i32;
  iters: i32;
  minEnem: i32;
  maxEnem: i32;
  mat1: f64;
  mat2: f64;
  mat3: f64;
  xp: f64;
  ls: f64;
  bossKill: i32;
  bossHp: f64;
  minSouls: f64;
  maxedSouls: i32;
  
  // Boss Stats Array
  bossStats: StaticArray<KnoxBossStats>;
  
  // Progress Tracking
  progress: Map<i32, i32> = new Map<i32, i32>();
  deathsByStageAndRevive: Map<i32, i32> = new Map<i32, i32>(); 
  maxRevives: i32 = 0; 
  
  constructor() {
    this.lvl = 0;
    this.maxStage = 0;
    this.maxHp = 0;
    this.hp = 0;
    this.atk = 0;
    this.salvo = 0;
    this.regen = 0;
    this.dr = 0;
    this.block = 0;
    this.effect = 0;
    this.charge = 0;
    this.chargeGain = 0;
    this.reload = 0;
    this.currentMaxHp = 0;
    this.currentAtk = 0;
    this.currentRegen = 0;
    this.revives = 0;
    this.remainingBullets = 0;
    this.time = 0;
    this.souls = 0;
    this.soulCap = 0;
    this.soulmult = 0;
    this.sc = 0;
    this.torpedoLimit = 0;
    this.charge1 = 0;
    this.charge2 = 0;
    this.totalCharge = 0;
    this.bonusRegen = 0;
    this.gbHit = false;
    this.basehp = 0;
    this.baseatk = 0;
    this.basesalvo = 0;
    this.baseregen = 0;
    this.basedr = 0;
    this.baseblock = 0;
    this.baseeffect = 0;
    this.basecharge = 0;
    this.basechargeGain = 0;
    this.basereload = 0;
    this.revival = 0;
    this.calyp = 0;
    this.ua = 0;
    this.ghost = 0;
    this.omen = 0;
    this.ll = 0;
    this.pog = 0;
    this.finish = 0;
    this.kraken = 0;
    this.amp = 0;
    this.dead = 0;
    this.sear = 0;
    this.pirate = 0;
    this.timeless = 0;
    this.torpedos = 0;
    this.charger = 0;
    this.armory = 0;
    this.elixer = 0;
    this.reflect = 0;
    this.loot = 0;
    this.enem = 0;
    this.iters = 0;
    this.minEnem = 5000;
    this.maxEnem = 0;
    this.mat1 = 0;
    this.mat2 = 0;
    this.mat3 = 0;
    this.xp = 0;
    this.ls = 0;
    this.bossKill = 0;
    this.bossHp = 0;
    this.minSouls = 0;
    this.maxedSouls = 0;
    
    // Boss Stats initialisieren
    this.bossStats = new StaticArray<KnoxBossStats>(10);
    for (let i = 0; i < 10; i++) {
      this.bossStats[i] = new KnoxBossStats();
    }
    
    // Progress Map initialisieren
    this.progress = new Map<i32, i32>();
    this.deathsByStageAndRevive = new Map<i32, i32>();
    this.maxRevives = 0; 
  }
}

// Globale Variablen für die Simulation
let currentKnox: Knox = new Knox();
let currentKnoxEnem: i32 = 0;
let currentKnoxTime: f64 = 0;
let currentKnoxEnemy: KnoxEnemy = new KnoxEnemy(0);
let leftoverTorpedos: i32 = 0;
let nextKnoxAtk: f64 = 0;
let nextKnoxBullet: f64 = 0;
let nextKnoxTorpedo: f64 = 0;
let nextKnoxEnemAtk: f64 = 0;
let nextKnoxRegen: f64 = 0;
let currentKnoxRespec: i32 = 0;

// Array-Hilfsfunktionen 
function knoxArraySum(arr: StaticArray<f64>): f64 {
  let sum: f64 = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function knoxArrayAverage(arr: StaticArray<f64>): f64 {
  return knoxArraySum(arr) / arr.length;
}

// Soul-Multiplier function
function knoxSoulmult(): f64 {
  return 1 + currentKnox.souls * 0.005 * (1 + currentKnox.amp * 0.01);
}

// Regen function
function knoxRegen(): void {
  if (currentKnox.hp < currentKnox.currentMaxHp) {
    currentKnox.hp = Math.min(currentKnox.currentMaxHp, currentKnox.hp + currentKnox.currentRegen * (currentKnox.bonusRegen ? 1 + 0.1 * currentKnox.elixer : 1));
    currentKnox.bonusRegen = Math.max(0, currentKnox.bonusRegen - 1) as i32;
  }
  currentKnoxEnemy.hp = Math.min(currentKnoxEnemy.maxHp, currentKnoxEnemy.hp + currentKnoxEnemy.regen * (1 - 0.08 * currentKnox.omen / (currentKnoxEnem === 1000 ? 2 : 1)));
  nextKnoxRegen = currentKnoxTime + 1;
}

// Enemy Attack function
function knoxEnemyAttack(): void {
  let dmg = currentKnoxEnemy.atk * (1 - currentKnox.pog * 0.03);
  
  if (ck(currentKnoxEnemy.critRate)) {
    dmg *= currentKnoxEnemy.critDmg;
  }
  
  if (currentKnoxEnem > 0 && currentKnoxEnem % 1000 === 0) {
    currentKnoxEnemy.enrage++;
    nextKnoxEnemAtk = currentKnoxTime + Math.max(0.5, currentKnoxEnemy.atkSpd - currentKnoxEnemy.enrage * (currentKnoxEnemy.atkSpd / 200));
  } else {
    nextKnoxEnemAtk = currentKnoxTime + currentKnoxEnemy.atkSpd;
  }
  
  if (ck(currentKnox.block)) {
    dmg /= 2;
    if (currentKnox.elixer) {
      currentKnox.bonusRegen = 5;
    }
    if (currentKnox.reflect) {
      currentKnox.charge1 += 0.1 * currentKnox.reflect;
      currentKnox.charge2 += 0.1 * currentKnox.reflect;
      currentKnox.totalCharge += 0.1 * currentKnox.reflect;
      currentKnoxEnemy.hp -= dmg * currentKnox.reflect * 0.2;
      if (currentKnoxEnemy.hp <= 0) {
        knoxKillEnemy();
      }
    }
  }
  
  currentKnox.hp -= dmg * (1 - currentKnox.dr);
  
  if (currentKnox.revives && currentKnox.hp <= 0) {
    currentKnox.hp = 0.8 * currentKnox.currentMaxHp;
    
    // Death Tracking
    let reviveNumber = currentKnox.maxRevives - currentKnox.revives + 1;
    let currentStage = Math.floor(currentKnoxEnem / 10) as i32;
    let numericKey = currentStage * 1000 + reviveNumber;
    
    if (currentKnox.deathsByStageAndRevive.has(numericKey)) {
      currentKnox.deathsByStageAndRevive.set(numericKey, currentKnox.deathsByStageAndRevive.get(numericKey) + 1);
    } else {
      currentKnox.deathsByStageAndRevive.set(numericKey, 1);
    }
    
    currentKnox.revives--;
  }
}

// Torpedo function 
function knoxTorpedo(): void {
  for (let i = 0; i < 5 + currentKnox.torpedos; i++) {
    currentKnoxEnemy.hp -= currentKnox.currentAtk * 30 * (1 + 0.08 * currentKnox.charger) * (1 + 0.2 * currentKnox.torpedos);
    if (currentKnoxEnemy.hp <= 0) {
      knoxKillEnemy();
    } else {
      leftoverTorpedos = 5 + currentKnox.torpedos - (i + 1);
      nextKnoxTorpedo = 99999999;
      return;
    }
  }
  nextKnoxTorpedo = 99999999;
}

// Kill Enemy function 
function knoxKillEnemy(extraTime: f64 = 0): void {
  if (currentKnoxEnem > 0 && currentKnoxEnem % 1000 === 0) {
    currentKnoxEnem += 10;
  } else {
    currentKnoxEnem++;
  }
  
  if (currentKnoxEnem % 10 === 0) {
    currentKnoxEnemy = KNOX_ENEMIES[Math.floor(currentKnoxEnem / 10) as i32];
  }
  
  if (leftoverTorpedos) {
    currentKnoxEnemy.hp = currentKnoxEnemy.maxHp - currentKnox.currentAtk * 30 * (1 + 0.08 * currentKnox.charger) * (1 + 0.2 * currentKnox.torpedos);
    leftoverTorpedos--;
  } else {
    currentKnoxEnemy.hp = currentKnoxEnemy.maxHp;
  }
  
  currentKnoxEnemy.enrage = 0;
  
  if (currentKnox.calyp && currentKnoxEnem % 10 === 0 && ck(currentKnox.effect * 2.5)) {
    currentKnox.souls = Math.min(currentKnox.soulCap, currentKnox.souls + currentKnox.calyp);
    currentKnox.soulmult = knoxSoulmult();
    currentKnox.currentMaxHp = currentKnox.maxHp * currentKnox.soulmult;
    currentKnox.currentAtk = currentKnox.atk * currentKnox.soulmult;
    currentKnox.currentRegen = currentKnox.regen * currentKnox.soulmult;
  }
  
  if (currentKnox.souls < currentKnox.soulCap && ck(currentKnox.sc)) {
    currentKnox.souls++;
    currentKnox.soulmult = knoxSoulmult();
    currentKnox.currentMaxHp = currentKnox.maxHp * currentKnox.soulmult;
    currentKnox.currentAtk = currentKnox.atk * currentKnox.soulmult;
    currentKnox.currentRegen = currentKnox.regen * currentKnox.soulmult;
  }
  
  if (currentKnox.ua && ck(currentKnox.effect)) {
    currentKnox.hp = Math.min(currentKnox.currentMaxHp, currentKnox.hp + currentKnox.currentMaxHp * currentKnox.ua * 0.02);
  }
  
  if (currentKnox.reflect || (currentKnoxEnem > 0 && currentKnoxEnem % 1000 === 0) || (currentKnoxEnemy.maxDps * (1 - currentKnox.pog * 0.03) * (1 - currentKnox.dr) > currentKnox.currentRegen)) {
    nextKnoxEnemAtk = currentKnoxTime + currentKnoxEnemy.atkSpd + extraTime;
  } else {
    nextKnoxEnemAtk = 9999999;
  }
  
  if (currentKnoxEnemy.hp <= 0) {
    knoxKillEnemy();
  }
}

// Bullet function 
function knoxBullet(): void {
  currentKnox.remainingBullets--;
  currentKnoxEnemy.hp -= currentKnoxEnemy.evade > 0 && ck(currentKnoxEnemy.evade) ? 0 : (currentKnox.finish && (currentKnox.remainingBullets === (currentKnox.gbHit ? 1 : 0)) && ck(currentKnox.effect * 2) ? currentKnox.currentAtk * (1 + currentKnox.finish * 0.2) * currentKnoxEnemy.dr : currentKnox.currentAtk * currentKnoxEnemy.dr);
  
  if (currentKnoxEnemy.hp <= 0) {
    knoxKillEnemy();
  }
  
  if (currentKnox.remainingBullets) {
    nextKnoxBullet = currentKnoxTime + 0.1;
  } else {
    nextKnoxBullet = 999999999;
    if (currentKnox.charge1 > 10 && !currentKnox.remainingBullets) {
      currentKnox.charge1 -= 10;
      currentKnoxTime = currentKnoxTime + 0.1;
      knoxAtk(true);
    }
  }
}

// Attack function
function knoxAtk(skipAtkReset: boolean = false): void {
  currentKnoxEnemy.hp -= currentKnoxEnemy.evade > 0 && ck(currentKnoxEnemy.evade) ? 0 : currentKnox.currentAtk * currentKnoxEnemy.dr;
  
  if (currentKnoxEnemy.hp <= 0) {
    knoxKillEnemy();
  }
  
  currentKnox.gbHit = ck(currentKnox.ghost * 0.0667);
  let totalBullets = currentKnox.salvo + (currentKnox.gbHit ? 1 : 0) + (ck(currentKnox.armory * 0.02) ? 3 : 0);
  
  if (ck(currentKnox.charge)) {
    currentKnox.charge1 += currentKnox.chargeGain;
    currentKnox.charge2 += currentKnox.chargeGain;
    currentKnox.totalCharge += currentKnox.chargeGain;
  }
  
  let nextTime = Math.min(nextKnoxEnemAtk, nextKnoxRegen);
  for (let i = 1; i < totalBullets; i++) {
    if (currentKnoxTime + 0.1 * i < nextTime) {
      currentKnoxEnemy.hp -= currentKnoxEnemy.evade > 0 && ck(currentKnoxEnemy.evade) ? 0 : (currentKnox.finish && i == totalBullets - (currentKnox.gbHit ? 2 : 1) && ck(currentKnox.effect * 2) ? currentKnox.currentAtk * (1 + currentKnox.finish * 0.2) * currentKnoxEnemy.dr : currentKnox.currentAtk * currentKnoxEnemy.dr);
      if (currentKnoxEnemy.hp <= 0) {
        knoxKillEnemy(i * 0.1);
      }
    } else {
      nextKnoxBullet = currentKnoxTime + 0.1 * i;
      currentKnox.remainingBullets = totalBullets - i as i32;
      i = totalBullets as i32;
    }
  }
  
  if (!skipAtkReset) {
    nextKnoxAtk = currentKnoxTime + currentKnox.reload;
    if (currentKnox.charger) {
      currentKnox.charge1 += currentKnox.charger * 0.02 * currentKnox.reload;
      currentKnox.charge2 += currentKnox.charger * 0.02 * currentKnox.reload;
      currentKnox.totalCharge += currentKnox.charger * 0.02 * currentKnox.reload;
    }
  }
  
  if (currentKnox.charge1 > 10 && !currentKnox.remainingBullets) {
    currentKnox.charge1 -= 10;
    currentKnoxTime = currentKnoxTime + totalBullets * 0.1;
    knoxAtk(true);
  }
  
  if (currentKnox.charge2 >= currentKnox.torpedoLimit) {
    nextKnoxTorpedo = currentKnoxTime + 1.5;
    currentKnox.charge2 -= currentKnox.torpedoLimit;
  }
}

// Simulation-Funktion
function knoxSim(knox: Knox, maxStage: i32, respec: i32, gadgetLootMulti: f64, 
                 reviveCd: i32, special: f64, iap: boolean, ultima: f64, 
                 research81: i32, research95: i32, research105: i32, evoGN3: boolean, cm46: i32, 
                 cm47: i32, cm48: i32, cm51: i32, iters: i32, stelzi: i32, i105: i32): void {
  // Globale Variablen setzen
  currentKnox = knox;
  currentKnoxEnem = 0;
  currentKnoxTime = 0;
  currentKnoxRespec = respec;

  leftoverTorpedos = 0;
  
  if (respec && (knox.iters % Math.ceil(respec)) === 0) {
    knox.charge1 = 0;
    knox.charge2 = 0;
  }
  
  knox.hp = knox.maxHp;
  knox.currentMaxHp = knox.maxHp;
  knox.currentAtk = knox.atk;
  knox.currentRegen = knox.regen;
  knox.souls = 0;
  knox.revives = knox.revival;
  knox.time += 40 - Math.min(reviveCd, 30);
  knox.soulmult = 1;
  knox.maxStage = Math.max(knox.maxStage, Math.floor(knox.maxEnem / 10)) as i32;
  knox.torpedoLimit = 100 - (10 * knox.torpedos);
  knox.remainingBullets = 0;
  
  currentKnoxEnemy = KNOX_ENEMIES[0];
  currentKnoxEnemy.hp = currentKnoxEnemy.maxHp;
  
  nextKnoxAtk = knox.reload;
  nextKnoxBullet = 99999999;
  nextKnoxTorpedo = 99999999;
  nextKnoxEnemAtk = currentKnoxEnemy.atkSpd;
  nextKnoxRegen = 1;

  // MaxRevives für Tracking setzen (nur einmal pro Iteration)
  if (knox.maxRevives === 0) {
    knox.maxRevives = knox.revival; 
  }

  // Haupt-Kampfschleife
  while (knox.hp > 0) {
    currentKnoxTime = knoxMinAll(nextKnoxAtk, nextKnoxBullet, nextKnoxTorpedo, nextKnoxEnemAtk, nextKnoxRegen);
    
    if (currentKnoxTime === nextKnoxRegen) {
      knoxRegen();
    } else if (currentKnoxTime === nextKnoxBullet) {
      knoxBullet();
    } else if (currentKnoxTime === nextKnoxEnemAtk) {
      knoxEnemyAttack();
    } else if (currentKnoxTime === nextKnoxAtk) {
      knoxAtk();
    } else if (currentKnoxTime === nextKnoxTorpedo) {
      knoxTorpedo();
    }
  }
  
  // Boss Stats Update
  for (let i = 0; i < 10; i++) {
    if (currentKnoxEnem < (i + 1) * 1000) {
      knox.bossStats[i].hp += KNOX_ENEMIES[(i + 1) * 100].maxHp;
    } else if (currentKnoxEnem === (i + 1) * 1000) {
      knox.bossStats[i].hp += KNOX_ENEMIES[(i + 1) * 100].hp;
    } else {
      knox.bossStats[i].kills += 1;
    }
  }
  
  // Material Calculations
  const mat1 = new StaticArray<f64>(7);
  mat1[0] = 1; mat1[1] = 1.04; mat1[2] = 1.06; mat1[3] = 1.08; mat1[4] = 1.11; mat1[5] = 1.18; mat1[6] = 1.25;
  
  const mat2 = new StaticArray<f64>(4);
  mat2[0] = 0.77; mat2[1] = 0.88; mat2[2] = 0.99; mat2[3] = 1.05;
  
  const mat3 = new StaticArray<f64>(3);
  mat3[0] = 0.6; mat3[1] = 0.7; mat3[2] = 0.8;
  
  const xp = new StaticArray<f64>(2);
  xp[0] = 1.3 * Math.pow(2, Math.floor((maxStage - 1) / 100) as f64);
  xp[1] = 1.4 * Math.pow(2, Math.floor((maxStage - 1) / 100) as f64);

  let normalized = (3 * knoxArrayAverage(mat1) + 3 * knoxArrayAverage(mat2) + 3 * knoxArrayAverage(mat3) + knoxArrayAverage(xp)) / 10;

  let stageGrowth: f64 = 1.074;
  let enemiesInSection: i32 = 1010;
  let excludedXpMultis: f64 = 1; 
  let includedMultis = (1 + knox.timeless * 0.13) * gadgetLootMulti;
  
  // Research95: Kumulativer Multiplier (level 1: 1.02, level 2: 1.02*1.03, etc.)
  let research95Multi: f64 = 1;
  for (let i = 1; i <= research95; i++) {
    research95Multi *= (1 + (i + 1) * 0.01);
  }
  
  let excludedMultis = Math.max(special, 1) * (iap ? 1.25 : 1) * Math.max(ultima, 1) * (research81 >= 3 ? 1.1 : 1) * (research81 >= 6 ? 1.2 : 1) * research95Multi * (research105 >= 3 ? 1.2 : 1) * (research105 >= 6 ? 1.3 : 1) * (cm46 > 0 ? 1.03 : 1) * (cm47 > 0 ? 1.02 : 1) * (cm48 > 0 ? 1.07 : 1) * (cm51 > 0 ? 1.05 : 1) * Math.pow(1.02, stelzi as f64) * Math.pow(1.08, i105 as f64);
  
  let loopLoot = normalized * ((Math.pow(stageGrowth, Math.floor(Math.min(currentKnoxEnem, enemiesInSection - 10) / 10) as f64) - 1) / (stageGrowth - 1) * 10 + (Math.min(currentKnoxEnem, enemiesInSection - 10) - Math.floor(Math.min(currentKnoxEnem, enemiesInSection - 10) / 10) * 10) * Math.pow(stageGrowth, Math.floor(Math.min(currentKnoxEnem, enemiesInSection - 10) / 10) as f64)) * includedMultis * (1 + knox.ll * 0.2 * knox.effect);
  
  let bonusMulti: f64 = 1;
  let tempEnem = currentKnoxEnem;
  
  while (tempEnem >= enemiesInSection) {
    tempEnem -= enemiesInSection;
    enemiesInSection = 1000;

    bonusMulti *= Math.pow(stageGrowth, 100);

    knox.mat1 += bonusMulti * mat1[mat1.length - 1] * 800 * includedMultis * excludedMultis;
    knox.mat2 += bonusMulti * mat2[mat2.length - 1] * 600 * includedMultis * excludedMultis;
    knox.mat3 += bonusMulti * mat3[mat3.length - 1] * 400 * includedMultis * excludedMultis;
    knox.xp += bonusMulti * xp[xp.length - 1] * 300 * includedMultis * excludedMultis * excludedXpMultis;

    knox.loot += bonusMulti * mat1[mat1.length - 1] * 800 * includedMultis;
    knox.loot += bonusMulti * mat2[mat2.length - 1] * 600 * includedMultis;
    knox.loot += bonusMulti * mat3[mat3.length - 1] * 400 * includedMultis;
    knox.loot += bonusMulti * xp[xp.length - 1] * 300 * includedMultis;

    bonusMulti *= 5;

    loopLoot += bonusMulti * normalized * stageGrowth * ((Math.pow(stageGrowth, Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) as f64) - 1) / (stageGrowth - 1) * 10 + (Math.min(tempEnem, enemiesInSection - 10) - Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) * 10) * Math.pow(stageGrowth, Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) as f64)) * includedMultis * (1 + knox.ll * 0.2 * knox.effect);
  }
  
  knox.mat1 += loopLoot * 3 / 10 * knoxArrayAverage(mat1) / normalized * excludedMultis;
  knox.mat2 += loopLoot * 3 / 10 * knoxArrayAverage(mat2) / normalized * excludedMultis;
  knox.mat3 += loopLoot * 3 / 10 * knoxArrayAverage(mat3) / normalized * excludedMultis;
  knox.xp += loopLoot * 1 / 10 * knoxArrayAverage(xp) / normalized * excludedMultis * excludedXpMultis;
  knox.loot += loopLoot;
  knox.time += currentKnoxTime;
  knox.enem += currentKnoxEnem;
  knox.ls = knox.loot / knox.time;
  knox.iters++;
  
  knox.minSouls = Math.min(knox.minSouls || knox.souls, knox.souls);
  if (knox.souls === knox.soulCap) {
    knox.maxedSouls++;
  }
  knox.minEnem = Math.min(knox.minEnem, currentKnoxEnem) as i32;
  knox.maxEnem = Math.max(knox.maxEnem, currentKnoxEnem) as i32;
  
  // Progress tracking
  let stageKey = Math.floor(currentKnoxEnem / 10) as i32;
  if (knox.progress.has(stageKey)) {
    knox.progress.set(stageKey, knox.progress.get(stageKey) + 1);
  } else {
    knox.progress.set(stageKey, 1);
  }
}

export function EVALKNOX_WASM(
  lvl: i32, maxStage: i32, hp: i32, atk: i32, regen: i32, 
  dr: i32, block: i32, effect: i32, charge: i32, chargeGain: i32,
  reload: i32, proj: i32, revival: i32, calyp: i32, ua: i32,
  ghost: i32, omen: i32, ll: i32, pog: i32, finish: i32,
  kraken: i32, amp: i32, dead: i32, sear: i32, pirate: i32,
  timeless: i32, torpedos: i32, charger: i32, armory: i32, elixer: i32,
  reflect: i32, gadget: i32, iters: i32, iap: i32, special: f64,
  ultima: f64, glac: i32, quartz: i32, tess: i32, reviveCd: i32,
  respec: i32, bossLootRate: i32, iterative: i32, glacRate1: i32,
  quartzRate1: i32, tessRate1: i32, xpRate1: i32, hp1: i32, atk1: i32,
  regen1: i32, dr1: i32, block1: i32, effect1: i32, charge1: i32,
  chargeGain1: i32, reload1: i32, proj1: i32, gadget1: i32, lvl1: i32,
  time1: i32, research81: i32, research95: i32, research105: i32, cm46: i32, 
  cm47: i32, cm48: i32, cm51: i32, creastat: i32, evoGN3: i32,
  stelzi: i32, i105: i32
): f64 {
  
  // Enemies initialisieren
  initKnoxEnemies();
  
  // Gadget/Creature Multipliers 
  const gadgetMulti = Math.pow(1.001, gadget as f64) * Math.pow(1.02, Math.floor(gadget / 10) as f64);
  const gadgetLootMulti = Math.pow(1.005, gadget as f64) * Math.pow(1.02, Math.floor(gadget / 10) as f64);
  const crea4GUMulti = 1.0 + (creastat as f64) * 0.01;
  
  // Knox erstellen und konfigurieren 
  const knox = new Knox();
  
  knox.lvl = lvl;
  knox.maxStage = maxStage;
  
  // Base Stats 
  knox.maxHp = (20 + (2 + Math.floor(hp / 5) * 0.1) * hp) * gadgetMulti * crea4GUMulti * (evoGN3 ? 1.0777 : 1);
  knox.hp = knox.maxHp;
  knox.atk = (1.2 + (0.06 + Math.floor(atk / 10) * 0.01) * atk) * gadgetMulti * crea4GUMulti;
  knox.salvo = 3 + proj * 1;
  knox.regen = (0.05 + (0.03 + Math.floor(regen / 30) * 0.02) * regen) * gadgetMulti * crea4GUMulti * (evoGN3 ? 1.0777 : 1);
  knox.dr = 0.0032 * dr;
  knox.block = 0.0055 * block + 0.08;
  knox.effect = 0.0036 * effect + 0.05;
  knox.charge = 0.07 + 0.0025 * charge;
  knox.chargeGain = 0.01 * chargeGain + 0.25;
  knox.reload = 7 - 0.03 * reload;
  
  // Base Stats Record 
  knox.basehp = hp;
  knox.baseatk = atk;
  knox.basesalvo = proj;
  knox.baseregen = regen;
  knox.basedr = dr;
  knox.baseblock = block;
  knox.baseeffect = effect;
  knox.basecharge = charge;
  knox.basechargeGain = chargeGain;
  knox.basereload = reload;
  
  // Talente setzen 
  knox.revival = revival;
  knox.calyp = calyp;
  knox.ua = ua;
  knox.ghost = ghost;
  knox.omen = omen;
  knox.ll = ll;
  knox.pog = pog;
  knox.finish = finish;
  
  // Pfade setzen 
  knox.kraken = kraken;
  knox.amp = amp;
  knox.dead = dead;
  knox.sear = sear;
  knox.pirate = pirate;
  knox.timeless = timeless;
  knox.torpedos = torpedos;
  knox.charger = charger;
  knox.armory = armory;
  knox.elixer = elixer;
  knox.reflect = reflect;
  
  // PrepKnox 
  knox.maxHp *= (1 + 0.005 * knox.kraken);
  knox.regen *= (1 + 0.008 * knox.kraken);
  knox.atk *= (1 + 0.005 * knox.kraken);
  knox.dr += 0.009 * knox.pirate;
  knox.charge += 0.01 * knox.sear + 0.006 * knox.pirate;
  knox.effect += 0.02 * knox.sear + 0.007 * knox.pirate;
  knox.block += 0.01 * knox.elixer + 0.008 * knox.pirate;
  
  knox.sc = 0.02 + 0.0014 * knox.lvl + 0.0008 * knox.maxStage + knox.effect / 3 + 0.02 * Math.floor((knox.maxStage - 1) / 100);
  knox.hp = knox.maxHp;
  knox.souls = 0;
  knox.soulCap = 100 + knox.dead * 10 + 10 * Math.floor((knox.maxStage - 1) / 100);
  
  // Simulation laufen lassen
  for (let i = 0; i < iters; i++) {
    knoxSim(knox, maxStage, respec, gadgetLootMulti, reviveCd, special, iap > 0, ultima, research81, research95, research105, evoGN3 > 0, cm46, cm47, cm48, cm51, iters, stelzi, i105);
  }
  
  // lastKnox für Export-Funktionen setzen
  lastKnox = knox;
  
  // Ergebnis zurückgeben 
  return knox.ls * 60;
}

// Zusätzliche Export-Funktionen für detaillierte Ergebnisse
let lastKnox: Knox = new Knox();

export function getLastKnoxAvgStage(): f64 { 
  if (lastKnox.iters === 0) return 0;
  return (lastKnox.enem as f64) / (lastKnox.iters as f64) / 10.0; 
}

export function getLastKnoxAvgTime(): f64 { 
  if (lastKnox.iters === 0) return 0;
  return lastKnox.time / (lastKnox.iters as f64) / 60.0; 
}

export function getLastKnoxMinStage(): f64 { 
  return (lastKnox.minEnem as f64) / 10.0; 
}

export function getLastKnoxMaxStage(): f64 { 
  return (lastKnox.maxEnem as f64) / 10.0; 
}

export function getLastKnoxBossHpPercent(): f64 {
  if (lastKnox.iters === 0) return 0;
  
  // Finde den ersten Boss, der nicht in allen Runs getötet wurde
  let bossStatsIdx = -1;
  for (let i = 0; i < 10; i++) {
    if (lastKnox.bossStats[i].kills < lastKnox.iters) {
      bossStatsIdx = i;
      break;
    }
  }
  
  if (bossStatsIdx === -1 || lastKnox.maxEnem < (bossStatsIdx + 1) * 1000) {
    return 0; // Kein Boss erreicht oder alle Bosse getötet
  }
  
  // Boss HP Percentage berechnen
  let bossMaxHp = KNOX_ENEMIES[(bossStatsIdx + 1) * 100].maxHp;
  return lastKnox.bossStats[bossStatsIdx].hp / (lastKnox.iters as f64) / bossMaxHp * 100;
}

export function getLastKnoxBossKillRate(): f64 {
  if (lastKnox.iters === 0) return 0;
  
  // Finde den ersten Boss, der nicht in allen Runs getötet wurde
  let bossStatsIdx = -1;
  for (let i = 0; i < 10; i++) {
    if (lastKnox.bossStats[i].kills < lastKnox.iters) {
      bossStatsIdx = i;
      break;
    }
  }
  
  if (bossStatsIdx === -1 || lastKnox.maxEnem < (bossStatsIdx + 1) * 1000) {
    return 0; // Kein Boss erreicht oder alle Bosse getötet
  }
  
  // Boss Kill Rate berechnen 
  return (lastKnox.bossStats[bossStatsIdx].kills as f64) / (lastKnox.iters as f64) * 100;
}

export function getLastKnoxMat1(): f64 { 
  if (lastKnox.iters === 0) return 0;
  return lastKnox.mat1 / (lastKnox.iters as f64); 
}

export function getLastKnoxMat2(): f64 { 
  if (lastKnox.iters === 0) return 0;
  return lastKnox.mat2 / (lastKnox.iters as f64); 
}

export function getLastKnoxMat3(): f64 { 
  if (lastKnox.iters === 0) return 0;
  return lastKnox.mat3 / (lastKnox.iters as f64); 
}

export function getLastKnoxXp(): f64 { 
  if (lastKnox.iters === 0) return 0;
  return lastKnox.xp / (lastKnox.iters as f64); 
}

// Numerische Stats-Exports
export function getLastKnoxMaxHp(): f64 {
  return lastKnox.maxHp;
}

export function getLastKnoxAtk(): f64 {
  return lastKnox.atk;
}

export function getLastKnoxRegen(): f64 {
  return lastKnox.regen;
}

export function getLastKnoxDr(): f64 {
  return lastKnox.dr;
}

export function getLastKnoxBlock(): f64 {
  return lastKnox.block;
}

export function getLastKnoxEffect(): f64 {
  return lastKnox.effect;
}

export function getLastKnoxCharge(): f64 {
  return lastKnox.charge;
}

export function getLastKnoxChargeGain(): f64 {
  return lastKnox.chargeGain;
}

export function getLastKnoxReload(): f64 {
  return lastKnox.reload;
}

export function getLastKnoxSc(): f64 {
  return lastKnox.sc;
}

// Progress-Iterator-Funktionen
export function getKnoxProgressSize(): i32 {
  return lastKnox.progress.size;
}

export function getKnoxProgressStageAt(index: i32): i32 {
  if (index >= lastKnox.progress.size) return -1;
  let keys = lastKnox.progress.keys();
  return keys[index];
}

export function getKnoxProgressCountAt(index: i32): i32 {
  if (index >= lastKnox.progress.size) return 0;
  let keys = lastKnox.progress.keys();
  let stage = keys[index];
  return lastKnox.progress.get(stage);
}

// Death Tracking Export-Funktionen
export function getKnoxDeathsByStageAndReviveSize(): i32 {
  return lastKnox.deathsByStageAndRevive.size;
}

export function getKnoxDeathKeyAt(index: i32): i32 {
  if (index >= lastKnox.deathsByStageAndRevive.size) return -1;
  let keys = lastKnox.deathsByStageAndRevive.keys();
  return keys[index]; 
}

export function getKnoxDeathCountAt(index: i32): i32 {
  if (index >= lastKnox.deathsByStageAndRevive.size) return 0;
  let keys = lastKnox.deathsByStageAndRevive.keys();
  let key = keys[index];
  return lastKnox.deathsByStageAndRevive.get(key);
}

export function getKnoxDeathsByStageAndReviveString(): string {
  if (lastKnox.deathsByStageAndRevive.size === 0) return "{}";
  
  let result = "{";
  let keys = lastKnox.deathsByStageAndRevive.keys();
  
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) result += ",";
    let numericKey = keys[i];
    let count = lastKnox.deathsByStageAndRevive.get(numericKey);
    
    // Konvertiere numericKey zurück zu "stage_revive" Format für JSON
    let stage = Math.floor(numericKey / 1000) as i32;
    let revive = numericKey % 1000;
    
    result += `"${stage}_${revive}":${count}`;
  }
  
  result += "}";
  return result;
}