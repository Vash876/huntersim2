// Random Number Generator 
let seed: u32 = 12345;
function random(): f64 {
  seed = (((seed as u64) * 1664525 + 1013904223) % 4294967296) as u32;
  return (seed as f64) / 4294967296.0;
}

function ck(chance: f64): boolean {
  return chance > 0 && chance > random();
}

// Multi-Funktion 
function multi(enemyNum: i32): f64 {
  let baseMulti = 1 +
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
    Math.max(0, (enemyNum - 389) * 0.007) +
    Math.max(0, (enemyNum - 400) * 0.005) +
    Math.max(0, (enemyNum - 410) * 0.005) +
    Math.max(0, (enemyNum - 420) * 0.005) +
    Math.max(0, (enemyNum - 430) * 0.004) +
    Math.max(0, (enemyNum - 440) * 0.004) +
    Math.max(0, (enemyNum - 450) * 0.004) +
    Math.max(0, (enemyNum - 460) * 0.006) +
    Math.max(0, (enemyNum - 470) * 0.006) +
    Math.max(0, (enemyNum - 480) * 0.006) +
    Math.max(0, (enemyNum - 490) * 0.006);
  
  let powMulti = Math.pow(1.01, Math.max(0, enemyNum - 350) as f64);
  
  return Math.max(1, baseMulti) * powMulti;
}

// Min-Funktion für mehrere Werte
function minAll(a: f64, b: f64, c: f64, d: f64, e: f64, f: f64, g: f64): f64 {
  return Math.min(Math.min(Math.min(Math.min(Math.min(Math.min(a, b), c), d), e), f), g);
}

// Enemy-Struktur 
class Enemy {
  maxHp: f64;
  hp: f64;
  atk: f64;
  critRate: f64;
  critDmg: f64;
  dr: f64;
  evade: f64;
  effect: f64;
  regen: f64;
  atkSpd: f64;
  enrage: i32;
  stunEnd: f64;
  infernalBulkTimer: f64;
  baseAtk: f64;

  constructor(enemyNum: i32) {
    const multiVal = multi(enemyNum);
    const floorDiv = Math.floor(Math.max(0, enemyNum - 1) / 100) as i32;
    const isBoss = enemyNum > 0 && enemyNum % 100 === 0;
    const is300 = enemyNum === 300;
    const is400 = enemyNum === 400;
    
    this.maxHp = (9 + 4 * enemyNum) 
      * multiVal 
      * Math.pow(2.85, floorDiv as f64) 
      * (isBoss ? 90 : 1) 
      * (is300 ? 0.87 : 1)
      * (is400 ? 0.95 : 1);
    this.hp = 1;
    this.atk = (2.5 + 0.7 * enemyNum) 
      * multiVal 
      * Math.pow(2.85, floorDiv as f64) 
      * (isBoss ? 3.63 : 1) 
      * (is300 ? 0.87 : 1)
      * (is400 ? 0.96 : 1);
    
    // Store base ATK for Infernal Bulk calculations
    this.baseAtk = this.atk;
    
    if (is400) {
      this.infernalBulkTimer = 10.0; 
    } else {
      this.infernalBulkTimer = 0;
    }
    
    this.critRate = Math.min(0.25, 0.0322 + 0.0004 * enemyNum + (isBoss ? 0.04 : 0));
    this.critDmg = Math.min(2.5, 1.212 + 0.008 * enemyNum + (isBoss ? 0.25 : 0));
    
    if (enemyNum >= 200) {
      this.dr = 1 - (Math.max(0, floorDiv - 2) * 0.02 + 0.04) - (isBoss ? 0.05 : 0);
    } else {
      this.dr = 1 - (isBoss ? 0.05 : 0);
    }
    
    if (enemyNum >= 100) {
      this.evade = 0.004 + 0.004 * Math.max(0, floorDiv - 1);
    } else {
      this.evade = 0;
    }
    
    if (enemyNum >= 401) {
      // At Stage 401: 5.5% for normal Enemies, 9.5% for Bosses
      this.effect = 0.055 + (isBoss ? 0.04 : 0);
    } else if (enemyNum >= 300) {
      this.effect = 0.04 + 0.01 * Math.max(0, floorDiv - 3) + (isBoss ? 0.04 : 0);
    } else {
      this.effect = 0;
    }
    
    this.regen = Math.max(0, 
      0.08 * Math.max(0, enemyNum - 1) 
      * multiVal 
      * Math.pow(1.052, floorDiv as f64)
    ) 
      * (isBoss ? 1.92 : 1) 
      * (is300 ? 0.87 : 1)
      * (is400 ? 0.96 : 1);
    this.atkSpd = (4.526 - 0.006 * enemyNum) * (isBoss ? 2.42 : 1);
    this.enrage = 0;
    this.stunEnd = 0;
  }
}

// Boss Stats Structure
class BossStats {
  hp: f64;
  kills: i32;
  
  constructor() {
    this.hp = 0;
    this.kills = 0;
  }
}

// Pre Calculated Enemies
const ENEMIES = new StaticArray<Enemy>(1001);
function initEnemies(): void {
  for (let i = 0; i <= 1000; i++) {
    ENEMIES[i] = new Enemy(i);
  }
}

// Borge Character Structure
class Borge {
  // Basis Stats
  lvl: i32;
  maxStage: i32;
  maxHp: f64;
  hp: f64;
  atk: f64;
  regen: f64;
  dr: f64;
  evade: f64;
  effect: f64;
  critRate: f64;
  critPower: f64;
  reload: f64;
  lifesteal: f64;
  
  // Current Stats
  currentMaxHp: f64;
  currentAtk: f64;
  currentRegen: f64;
  currentDr: f64;
  currentEffect: f64;
  currentCritRate: f64;
  evadeStacks: i32;
  revives: i32;
  remainingBullets: i32;
  time: f64;
  
  // Talents
  revival: i32;
  life: i32;
  ua: i32;
  impacts: i32;
  omen: i32;
  ll: i32;
  pog: i32;
  fow: i32;
  ultimaTalent: i32;
  
  // Attributes
  ares: i32;
  ylith: i32;
  spartan: i32;
  timeless: i32;
  bfb: i32;
  athena: i32;
  baal: i32;
  sensors: i32;
  atlas: i32;
  mino: i32;
  helltouch: i32;
  punches: i32;
  weakspot: i32;
  hermes: i32;
  inhaler: i32;
  
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
  
  // Min/Max tracking for materials and XP
  minMat1: f64;
  maxMat1: f64;
  minMat2: f64;
  maxMat2: f64;
  minMat3: f64;
  maxMat3: f64;
  minXp: f64;
  maxXp: f64;
  
  // Boss Stats Array
  bossStats: StaticArray<BossStats>;
  
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
    this.regen = 0;
    this.dr = 0;
    this.evade = 0;
    this.effect = 0;
    this.critRate = 0;
    this.critPower = 0;
    this.reload = 0;
    this.lifesteal = 0;
    this.currentMaxHp = 0;
    this.currentAtk = 0;
    this.currentRegen = 0;
    this.currentDr = 0;
    this.currentEffect = 0;
    this.currentCritRate = 0;
    this.evadeStacks = 0;
    this.revives = 0;
    this.remainingBullets = 0;
    this.time = 0;
    this.revival = 0;
    this.life = 0;
    this.ua = 0;
    this.impacts = 0;
    this.omen = 0;
    this.ll = 0;
    this.pog = 0;
    this.fow = 0;
    this.ultimaTalent = 0;
    this.ares = 0;
    this.ylith = 0;
    this.spartan = 0;
    this.timeless = 0;
    this.bfb = 0;
    this.athena = 0;
    this.baal = 0;
    this.sensors = 0;
    this.atlas = 0;
    this.mino = 0;
    this.helltouch = 0;
    this.punches = 0;
    this.weakspot = 0;
    this.hermes = 0;
    this.inhaler = 0;
    this.loot = 0;
    this.enem = 0;
    this.iters = 0;
    this.minEnem = 50000;
    this.maxEnem = 0;
    this.mat1 = 0;
    this.mat2 = 0;
    this.mat3 = 0;
    this.xp = 0;
    this.ls = 0;
    
    // Min/Max initialisieren
    this.minMat1 = 1e308;
    this.maxMat1 = 0;
    this.minMat2 = 1e308;
    this.maxMat2 = 0;
    this.minMat3 = 1e308;
    this.maxMat3 = 0;
    this.minXp = 1e308;
    this.maxXp = 0;
    
    // Boss Stats initialisieren
    this.bossStats = new StaticArray<BossStats>(10);
    for (let i = 0; i < 10; i++) {
      this.bossStats[i] = new BossStats();
    }
    
    // Progress Map initialisieren
    this.progress = new Map<i32, i32>();
    this.deathsByStageAndRevive = new Map<i32, i32>();
    this.maxRevives = 0;
  }
}

// Globale Variablen für die Simulation
let currentBorge: Borge = new Borge();
let currentEnem: i32 = 0;
let currentTime: f64 = 0;
let currentEnemy: Enemy = new Enemy(0);
let furyEnabled: boolean = false;
let trampleDamage: f64 = 0;
let fowRemaining: f64 = 0;
let nextAtk: f64 = 0;
let nextAthena: f64 = 0;
let nextEnemAtk: f64 = 0;
let nextRegen: f64 = 0;
let nextBossBonusAtk: f64 = 0;
let nextFury: f64 = 0;
let nextInfernalBulk: f64 = 0;
let currentAttr: i32 = 0;
let currentCatchup99gu: i32 = 0;
let currentTrample: boolean = false;
let currentMaxStage: i32 = 0;
let currentEvoGem2: i32 = 0;
let currentTempGN4: i32 = 0;
let currentCreaGem4: i32 = 0;
let currentInnoGem5: i32 = 0;
let currentCreaGem5: i32 = 0;
let currentCreaGalvTrinketsCount: i32 = 0;

// Regen function
function regen(): void {
  currentBorge.hp = Math.min(
    currentBorge.currentMaxHp, 
    currentBorge.hp + currentBorge.currentRegen 
      + currentBorge.inhaler * 0.0008 * (currentBorge.currentMaxHp - currentBorge.hp)
  );
  
  currentEnemy.hp = Math.min(
    currentEnemy.maxHp, 
    currentEnemy.hp + currentEnemy.regen 
      * (1 - currentBorge.omen * 0.08 / (currentEnem > 0 && currentEnem % 1000 === 0 ? 2 : 1))
  );
  nextRegen = currentTime + 1;
  
  if (currentEnemy.hp <= 0) { 
    killEnemy();
  }
}

// Fury function
function fury(enabled: boolean): void {
  furyEnabled = enabled;
  let stunRemaining = Math.max(0, currentEnemy.stunEnd - currentTime);
  if (enabled) {
    nextFury = currentTime + 5;
    nextEnemAtk = currentTime + ((nextEnemAtk - stunRemaining) - currentTime) / 3 + stunRemaining;
    nextBossBonusAtk = currentTime + ((nextBossBonusAtk - stunRemaining) - currentTime) / 3 + stunRemaining;
  } else {
    nextFury = currentTime + 60;
    nextEnemAtk = currentTime + ((nextEnemAtk - stunRemaining) - currentTime) * 3 + stunRemaining;
    nextBossBonusAtk = currentTime + ((nextBossBonusAtk - stunRemaining) - currentTime) * 3 + stunRemaining;
  }
}

// Infernal Bulk function (Boss #400)
function infernalBulk(): void {
  if (currentEnem === 4000) {
    // Add +2778 ATK
    currentEnemy.atk += 2778.595;
    // Next activation in 10 seconds
    nextInfernalBulk = currentTime + 10.0;
  } else {
    // Set to a very high value to disable for non-Boss #400
    nextInfernalBulk = 999999;
  }
}

// Enemy Attack function
function enemyAttack(isBonus: boolean = false): void {
  let dmg = currentEnemy.atk 
    * (1 - 0.01 * currentBorge.mino - 0.03 * currentCreaGem4) 
    * (1 - currentBorge.currentDr);
  
  if (currentEnem > 0 && currentEnem % 1000 === 0) {
    currentEnemy.enrage++;
    let speedMod = furyEnabled ? 3 : 1;
    if (isBonus) {
      nextBossBonusAtk = currentTime + Math.max(0.5, currentEnemy.atkSpd * 1.8 / speedMod - currentEnemy.enrage * (currentEnemy.atkSpd * 1.8 / speedMod / 200));
      nextEnemAtk = nextEnemAtk - (Math.max(0.5, currentEnemy.atkSpd / speedMod - (currentEnemy.enrage - 1) * (currentEnemy.atkSpd / speedMod / 200)) - Math.max(0.5, currentEnemy.atkSpd / speedMod - currentEnemy.enrage * (currentEnemy.atkSpd / speedMod / 200)));
    } else {
      nextEnemAtk = currentTime + Math.max(0.5, currentEnemy.atkSpd / speedMod - currentEnemy.enrage * (currentEnemy.atkSpd / speedMod / 200));
      nextBossBonusAtk = nextBossBonusAtk - (Math.max(0.5, currentEnemy.atkSpd * 1.8 / speedMod - (currentEnemy.enrage - 1) * (currentEnemy.atkSpd * 1.8 / speedMod / 200)) - Math.max(0.5, currentEnemy.atkSpd * 1.8 / speedMod - currentEnemy.enrage * (currentEnemy.atkSpd * 1.8 / speedMod / 200)));
    }
  } else {
    nextEnemAtk = currentTime + currentEnemy.atkSpd;
  }
  
  let evaded = false;
  if (ck(currentBorge.evade)) {
    dmg = 0;
    evaded = true;
  } else if (ck(currentEnemy.critRate)) {
    dmg *= currentEnemy.critDmg * (1 - 0.11 * currentBorge.weakspot);
  }
  
  currentBorge.hp -= dmg;
  
  // Helltouch damage calculation (only if not evaded)
  if (!evaded) {
    let helltouchBaseDamage: f64 = 0;
    
    if (currentTempGN4 > 0) {
      // tempGN4 active: use raw enemy attack before any DR or Mino
      helltouchBaseDamage = currentEnemy.atk;
      // Apply crit if enemy crit happened
      if (ck(currentEnemy.critRate)) {
        helltouchBaseDamage *= currentEnemy.critDmg;
      }
    } else {
      // tempGN4 not active: use final damage (after all reductions)
      helltouchBaseDamage = dmg;
    }
    
    currentEnemy.hp -= 0.08 * currentBorge.helltouch 
      * helltouchBaseDamage 
      * (currentEnem > 0 && currentEnem % 1000 === 0 ? 0.1 : 1);
  }
  
  if (currentEnemy.hp <= 0) {
    killEnemy();
  }
  
  // DR Debuff from enemy effect (only if Borge didn't evade)
  if (ck(currentEnemy.effect) && !evaded) {
   currentBorge.currentDr = Math.max(0, currentBorge.currentDr - 0.02);
  }
  
  if (currentBorge.revives && currentBorge.hp <= 0) {
    currentBorge.hp = 0.8 * currentBorge.currentMaxHp;
    
    let reviveNumber = currentBorge.maxRevives - currentBorge.revives + 1;
    let currentStage = Math.floor(currentEnem / 10) as i32;
    
    let numericKey = currentStage * 1000 + reviveNumber; 
    
    if (currentBorge.deathsByStageAndRevive.has(numericKey)) {
      currentBorge.deathsByStageAndRevive.set(numericKey, currentBorge.deathsByStageAndRevive.get(numericKey) + 1);
    } else {
      currentBorge.deathsByStageAndRevive.set(numericKey, 1);
    }
    
    currentBorge.revives--;

    currentBorge.time += 3;
    if (furyEnabled) {
      nextFury -= 3;
    }
    currentBorge.currentDr = currentBorge.dr + (currentEnem % 1000 === 0 ? 0.007 * currentBorge.atlas : 0);
  }
}

// Kill Enemy function
function killEnemy(): void {
  if (currentEnem > 0 && currentEnem % 1000 === 0) {
    currentBorge.currentDr = Math.max(0, currentBorge.currentDr - 0.007 * currentBorge.atlas);
    currentBorge.currentEffect -= 0.014 * currentBorge.atlas;
    currentBorge.currentCritRate -= 0.025 * currentBorge.atlas;
    furyEnabled = false;
    nextFury = 99999999;
    currentEnem += 10;
  } else {
    currentEnem++;
  }
  
  // Create Enemy instance if new enemy
  if (currentEnem % 10 === 0) {
    let enemyIndex = Math.min(1000, Math.floor(currentEnem / 10)) as i32;
    currentEnemy = ENEMIES[enemyIndex]; 
    
    // Reset Infernal Bulk ATK to base value for new enemy
    if (currentEnem === 4000) {
      currentEnemy.atk = currentEnemy.baseAtk; 
    } else {
      currentEnemy.atk = currentEnemy.baseAtk; // Reset to base ATK
    }
  }
  
  // Trample-Logik
  while (trampleDamage >= currentEnemy.maxHp && currentEnem % 10 !== 0) {
    currentEnemy.hp = 0;
    trampleDamage -= currentEnemy.maxHp;
    currentEnem++;
    
    // Nach jedem Enemy-Increment prüfen
    if (currentEnem % 10 === 0) {
      let enemyIndex = Math.min(1000, Math.floor(currentEnem / 10)) as i32;
      currentEnemy = ENEMIES[enemyIndex];
      
      // Reset Infernal Bulk ATK for new enemy during trample
      if (currentEnem === 4000) {
        currentEnemy.atk = currentEnemy.baseAtk; // Pre-combat Infernal Bulk
      } else {
        currentEnemy.atk = currentEnemy.baseAtk; // Reset to base ATK
      }
    }
  }
  
  if (currentEnem === 1000) {
    currentBorge.currentAtk = currentBorge.atk;
  }
  
  trampleDamage = 0;
  currentEnemy.hp = currentEnemy.maxHp 
    * (1 - 0.04 * currentBorge.pog * (currentEnem > 0 && currentEnem % 1000 === 0 ? 0.5 : 1));
  currentEnemy.enrage = 0;
  currentEnemy.stunEnd = 0;
  
  if (currentBorge.hp < currentBorge.currentMaxHp && currentBorge.ua && ck(currentBorge.currentEffect)) {
    currentBorge.hp = Math.min(currentBorge.currentMaxHp, currentBorge.hp + currentBorge.currentMaxHp * currentBorge.ua * 0.02);
  }
  
  nextEnemAtk = currentTime + currentEnemy.atkSpd;
  
  if (currentEnem > 0 && currentEnem % 1000 === 0) {
    currentBorge.currentDr += 0.007 * currentBorge.atlas;
    currentBorge.currentEffect += 0.014 * currentBorge.atlas;
    currentBorge.currentCritRate += 0.025 * currentBorge.atlas;
    if (currentEnem === 1000) {
      currentBorge.currentAtk = currentBorge.atk;
    }
    if (currentEnem >= 2000) {
      nextBossBonusAtk = currentTime + currentEnemy.atkSpd * 1.8;
    }
    if (currentEnem >= 3000) {
      nextFury = currentTime + 60;
    }
    if (currentEnem === 4000) {
      nextInfernalBulk = currentTime + 10.0;
    }
  } else {
    nextBossBonusAtk = 99999999;
    if (currentEnem !== 4000) {
      nextInfernalBulk = 999999999;
    }
  }
}

// Attack function
function atk(isAthena: boolean = false): void {
  let evaded = currentEnemy.evade > 0 && ck(currentEnemy.evade);
  let dmg = evaded ? 0 : (
    currentBorge.currentAtk 
    * (1 + 0.1 * currentBorge.bfb * (1 - currentBorge.hp / currentBorge.currentMaxHp)) 
    * (isAthena ? currentBorge.critPower * 1.5 : (ck(currentBorge.currentCritRate) ? currentBorge.critPower : 1))
  );
  
  currentEnemy.hp -= dmg * currentEnemy.dr;
  
  if (dmg > currentEnemy.maxHp * 2 && currentTrample) {
    trampleDamage = dmg - currentEnemy.maxHp;
  }
  
  if (currentEnemy.hp <= 0) { 
    killEnemy();
  }
  
  currentBorge.hp = Math.min(currentBorge.currentMaxHp, currentBorge.hp + currentBorge.lifesteal * dmg);
  
  if (currentBorge.life && ck(currentBorge.currentEffect)) {
    currentBorge.hp = Math.min(currentBorge.currentMaxHp, currentBorge.hp + 0.06 * currentBorge.life * dmg);
  }
  
  if (!evaded) {
    if (currentBorge.impacts && ck(currentBorge.currentEffect)) {
      let stunDuration = currentBorge.impacts * 0.1 
        / (currentEnem > 0 && currentEnem % 1000 === 0 ? 2 : 1);
      let stunRemaining = Math.max(0, currentEnemy.stunEnd - currentTime);
      
      nextEnemAtk += stunDuration - stunRemaining;
      nextBossBonusAtk += stunDuration - stunRemaining;
      currentEnemy.stunEnd = currentTime + stunDuration;
    }
    if (currentBorge.fow && ck(currentBorge.currentEffect)) {
      fowRemaining = currentBorge.fow * 0.1;
    }
  }
  
  let divisor: f64 = 1;
  
  if (currentEnem < 1000 && currentAttr > 0) {
    divisor = Math.pow(Math.pow(1.08, currentCatchup99gu as f64), 1 + currentAttr * 0.1 - 0.1);
  }
  if (currentEnem > 0 && currentEnem % 1000 === 0) {
    divisor = 1 / (1 - 0.04 * currentBorge.atlas);
  }
  
  if (isAthena) {
    nextAthena = currentTime + currentBorge.reload * 6 / divisor;
  } else {
    nextAtk = currentTime + currentBorge.reload / divisor;
  }
  
  if (fowRemaining) {
    let nextReloadTime = Math.min(nextAthena - currentTime, nextAtk - currentTime);
    if (nextReloadTime / 2 >= fowRemaining) {
      nextAthena -= fowRemaining;
      nextAtk -= fowRemaining;
      fowRemaining = 0;
    } else {
      nextAthena -= nextReloadTime / 2;
      nextAtk -= nextReloadTime / 2;
      fowRemaining = fowRemaining - nextReloadTime / 2;
    }
  }
}

// Array-Hilfsfunktionen
function arraySum(arr: StaticArray<f64>): f64 {
  let sum: f64 = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function arrayAverage(arr: StaticArray<f64>): f64 {
  return arraySum(arr) / arr.length;
}

// Simulation-Funktion
function sim(borge: Borge, maxStage: i32, attr: i32, catchup99gu: i32, reviveCd: i32, trample: boolean, 
             special: f64, iap: boolean, ultima: f64, scavengers: i32, m0: i32, r7: i32, r19: i32, 
             attrGN2: boolean, attrGN3: boolean, lootgu: i32, i14: i32, i80: i32, i44: i32, 
             research81: i32, research95: i32, research105: i32, cm46: i32, cm47: i32, cm48: i32, cm51: i32, cm53: i32, cm54: i32, cm57: i32, gadgetLootMulti: f64, 
             card: boolean, i60: i32, evo_gem2: i32, evoGN3: i32, tempGN4: i32, stelzi: i32, i103: i32, exodus_gem1: i32, exodus_temporalEvolutionCount: i32,
             exodus_gem4: i32, exodus_constructionMilestoneCount: i32, temp_gem6: i32, inno_gem5: i32, crea_gem4: i32, crea_gem5: i32,
             crea_galvTrinketsCount: i32
            ): void {
  // Globale Variablen setzen
  currentBorge = borge;
  currentEnem = 0;
  currentTime = 0;
  
  currentAttr = attr;
  currentCatchup99gu = catchup99gu;
  currentTrample = trample;
  currentMaxStage = maxStage;
  currentEvoGem2 = evo_gem2;
  currentTempGN4 = tempGN4;
  currentCreaGem4 = crea_gem4;
  currentInnoGem5 = inno_gem5;
  currentCreaGem5 = crea_gem5;
  currentCreaGalvTrinketsCount = crea_galvTrinketsCount;

  borge.evadeStacks = 0;
  borge.hp = borge.maxHp;
  borge.currentMaxHp = borge.maxHp;
  borge.currentAtk = borge.atk 
    * (attr > 0 ? Math.pow(Math.pow(1.08, catchup99gu as f64), 1 + attr * 0.1 - 0.1) : 1);
  borge.currentRegen = borge.regen;
  borge.currentDr = borge.dr;
  borge.currentEffect = borge.effect;
  borge.currentCritRate = borge.critRate;
  borge.revives = borge.revival;
  borge.time += 40 - Math.min(reviveCd, 30);
  
  borge.maxStage = Math.max(borge.maxStage, Math.floor(borge.maxEnem / 10)) as i32;
  
  borge.remainingBullets = 0;
  
  furyEnabled = false;
  trampleDamage = 0;
  fowRemaining = 0;
  currentEnemy = ENEMIES[0];
  currentEnemy.hp = currentEnemy.maxHp;
  
  nextAtk = borge.reload;
  nextAthena = borge.athena > 0 ? borge.reload * 6 : 999999999;
  nextEnemAtk = currentEnemy.atkSpd;
  nextRegen = 1;
  nextBossBonusAtk = 999999999;
  nextFury = 999999999;
  nextInfernalBulk = 999999999;

  // MaxRevives für Tracking setzen (nur einmal pro Iteration)
  if (currentBorge.maxRevives === 0) {
    currentBorge.maxRevives = borge.revival;
  }
  
  // Main Combat Loop
  while (borge.hp > 0) {
    currentTime = minAll(nextAtk, nextEnemAtk, nextRegen, nextAthena, nextBossBonusAtk, nextFury, nextInfernalBulk);
    
    if (currentTime === nextRegen) {
      regen();
    } else if (currentTime === nextEnemAtk) {
      enemyAttack();
    } else if (currentTime === nextAtk) {
      atk();
    } else if (currentTime === nextAthena) {
      atk(true);
    } else if (currentTime === nextBossBonusAtk) {
      enemyAttack(true);
    } else if (currentTime === nextFury) {
      fury(!furyEnabled);
    } else if (currentTime === nextInfernalBulk) {
      infernalBulk();
    }
  }
  
  // Boss Stats Update
  for (let i = 0; i < 10; i++) {
    if (currentEnem < (i + 1) * 1000) {
      borge.bossStats[i].hp += ENEMIES[(i + 1) * 100].maxHp;
    } else if (currentEnem === (i + 1) * 1000) {
      borge.bossStats[i].hp += ENEMIES[(i + 1) * 100].hp;
    } else {
      borge.bossStats[i].kills += 1;
    }
  }
  
  // Material Calculations
  const mat1 = new StaticArray<f64>(7);
  mat1[0] = 1; mat1[1] = 1.1; mat1[2] = 1.3; mat1[3] = 1.5; mat1[4] = 1.7; mat1[5] = 2; mat1[6] = 3.2;
  
  const mat2 = new StaticArray<f64>(4);
  mat2[0] = 1; mat2[1] = 1.2; mat2[2] = 1.4; mat2[3] = 2.8;
  
  const mat3 = new StaticArray<f64>(3);
  mat3[0] = 0.8; mat3[1] = 1; mat3[2] = 1.8;
  
  const xp = new StaticArray<f64>(2);
  xp[0] = 1; xp[1] = 1.2;

  let normalized = (3 * arrayAverage(mat1) + 3 * arrayAverage(mat2) + 3 * arrayAverage(mat3) + arrayAverage(xp)) / 10;

  let stageGrowth: f64 = 1.051;
  let enemiesInSection: i32 = 1010;
  let excludedXpMultis = (attrGN2 ? 1.5 : 1) 
    * Math.pow(2, Math.floor((currentMaxStage - 1) / 100) as f64) 
    * Math.pow(2, r19 as f64);
  
  let includedMultis = (1 + borge.timeless * 0.14) 
    * gadgetLootMulti 
    * (card ? 1.05 : 1) 
    * (1 + i60 * 0.03) 
    * (temp_gem6 > 0 ? 1.03 : 1);
  
  // Research95: Kumulativer Multiplier (level 1: 1.02, level 2: 1.02*1.03, etc.)
  let research95Multi: f64 = 1;
  for (let i = 1; i <= research95; i++) {
    research95Multi *= (1 + (i + 1) * 0.01);
  }
  
  let excludedMultis = Math.max(special, 1) 
    * (iap ? 1.25 : 1) 
    * Math.max(ultima, 1) 
    * Math.pow(1.05, scavengers as f64) 
    * Math.pow(1.02, m0 as f64) 
    * Math.pow(1.05, r7 as f64) 
    * (attrGN3 ? 1.25 : 1) 
    * (Math.pow(Math.pow(1.07, lootgu as f64), 1 + attr * 0.1 - 0.1)) 
    * Math.pow(1.1, i14 as f64) 
    * Math.pow(1.1, i80 as f64) 
    * Math.pow(1.08, i44 as f64) 
    * (research81 >= 1 ? 1.1 : 1) 
    * (research81 >= 4 ? 1.2 : 1) 
    * research95Multi 
    * (research105 >= 1 ? 1.2 : 1) 
    * (research105 >= 4 ? 1.3 : 1) 
    * (cm46 > 0 ? 1.03 : 1) 
    * (cm47 > 0 ? 1.02 : 1) 
    * (cm48 > 0 ? 1.07 : 1) 
    * (cm51 > 0 ? 1.05 : 1) 
    * (cm53 > 0 ? 1.02 : 1) 
    * (cm54 > 0 ? 1.02 : 1) 
    * (cm57 > 0 ? 1.1 : 1) 
    * Math.pow(1.02, stelzi as f64) 
    * Math.pow(1.08, i103 as f64) 
    * (1 + exodus_temporalEvolutionCount * 0.002) 
    * (inno_gem5 > 0 ? 1.3 : 1) 
    * (evo_gem2 > 0 ? 1.1 : 1);
  
  let loopLoot = normalized 
    * (
      (Math.pow(stageGrowth, Math.floor(Math.min(currentEnem, enemiesInSection - 10) / 10) as f64) - 1) 
      / (stageGrowth - 1) * 10 
      + (Math.min(currentEnem, enemiesInSection - 10) - Math.floor(Math.min(currentEnem, enemiesInSection - 10) / 10) * 10) 
      * Math.pow(stageGrowth, Math.floor(Math.min(currentEnem, enemiesInSection - 10) / 10) as f64)
    ) 
    * includedMultis 
    * (1 + borge.ll * 0.2 * borge.effect);
  
  let bonusMulti: f64 = 1;
  let tempEnem = currentEnem;
  
  // Track bonus materials separately for accurate min/max tracking
  let bonusMat1: f64 = 0;
  let bonusMat2: f64 = 0;
  let bonusMat3: f64 = 0;
  let bonusXp: f64 = 0;
  
  while (tempEnem >= enemiesInSection) {
    tempEnem -= enemiesInSection;
    enemiesInSection = 1000;

    bonusMulti *= Math.pow(stageGrowth, 100);

    let mat1Bonus = bonusMulti 
      * mat1[mat1.length - 1] * 800 
      * includedMultis 
      * excludedMultis;
    
    let mat2Bonus = bonusMulti 
      * mat2[mat2.length - 1] * 600 
      * includedMultis 
      * excludedMultis;
    
    let mat3Bonus = bonusMulti 
      * mat3[mat3.length - 1] * 400 
      * includedMultis 
      * excludedMultis;
    
    let xpBonus = bonusMulti 
      * xp[xp.length - 1] * 300 
      * includedMultis 
      * excludedMultis 
      * excludedXpMultis;
    
    bonusMat1 += mat1Bonus;
    bonusMat2 += mat2Bonus;
    bonusMat3 += mat3Bonus;
    bonusXp += xpBonus;

    borge.loot += bonusMulti * mat1[mat1.length - 1] * 800 * includedMultis;
    borge.loot += bonusMulti * mat2[mat2.length - 1] * 600 * includedMultis;
    borge.loot += bonusMulti * mat3[mat3.length - 1] * 400 * includedMultis;
    borge.loot += bonusMulti * xp[xp.length - 1] * 300 * includedMultis;

    bonusMulti *= 5;

    loopLoot += bonusMulti 
      * normalized 
      * stageGrowth 
      * (
        (Math.pow(stageGrowth, Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) as f64) - 1) 
        / (stageGrowth - 1) * 10 
        + (Math.min(tempEnem, enemiesInSection - 10) - Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) * 10) 
        * Math.pow(stageGrowth, Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) as f64)
      ) 
      * includedMultis 
      * (1 + borge.ll * 0.2 * borge.effect);
  }
  
  // Calculate average materials for accumulation
  let currentMat1 = loopLoot * 3 / 10 
    * arrayAverage(mat1) / normalized 
    * excludedMultis 
    + bonusMat1;
  
  let currentMat2 = loopLoot * 3 / 10 
    * arrayAverage(mat2) / normalized 
    * excludedMultis 
    + bonusMat2;
  
  let currentMat3 = loopLoot * 3 / 10 
    * arrayAverage(mat3) / normalized 
    * excludedMultis 
    + bonusMat3;
  
  let currentXp = loopLoot * 1 / 10 
    * arrayAverage(xp) / normalized 
    * excludedMultis 
    * excludedXpMultis 
    + bonusXp;
  
  borge.mat1 += currentMat1;
  borge.mat2 += currentMat2;
  borge.mat3 += currentMat3;
  borge.xp   += currentXp;
  
  // Track min/max by comparing current iteration values
  borge.minMat1 = Math.min(borge.minMat1, currentMat1);
  borge.maxMat1 = Math.max(borge.maxMat1, currentMat1);
  borge.minMat2 = Math.min(borge.minMat2, currentMat2);
  borge.maxMat2 = Math.max(borge.maxMat2, currentMat2);
  borge.minMat3 = Math.min(borge.minMat3, currentMat3);
  borge.maxMat3 = Math.max(borge.maxMat3, currentMat3);
  borge.minXp = Math.min(borge.minXp, currentXp);
  borge.maxXp = Math.max(borge.maxXp, currentXp);
  
  borge.loot += loopLoot;
  borge.time += currentTime;
  borge.enem += currentEnem;
  borge.ls   = borge.loot / borge.time;
  borge.iters++;
  
  borge.minEnem = Math.min(borge.minEnem, currentEnem) as i32; 
  borge.maxEnem = Math.max(borge.maxEnem, currentEnem) as i32; 
  
  // Progress tracking
  let stageKey = Math.floor(currentEnem / 10) as i32;
  if (borge.progress.has(stageKey)) {
    borge.progress.set(stageKey, borge.progress.get(stageKey) + 1);
  } else {
    borge.progress.set(stageKey, 1);
  }
}

export function EVALBORGE_WASM(
  lvl: i32, maxStage: i32, hp: i32, atk: i32, regen: i32, 
  dr: i32, evade: i32, effect: i32, critRate: i32, critPower: i32,
  aspd: i32, revival: i32, life: i32, ua: i32, impacts: i32,
  omen: i32, ll: i32, pog: i32, ultimaTalent: i32, fow: i32,
  ares: i32, ylith: i32, spartan: i32, timeless: i32, bfb: i32,
  athena: i32, baal: i32, sensors: i32, atlas: i32, mino: i32,
  helltouch: i32, punches: i32, weakspot: i32, hermes: i32,
  inhaler: i32, gadget: i32, iap: i32, special: f64, ultima: f64,
  reviveCd: i32, trample: i32, scavengers: i32,
  m0: i32, r4: i32, r7: i32, r16: i32, r19: i32,
  i3: i32, i4: i32, i11: i32, i13: i32, i14: i32,
  i23: i32, i24: i32, i27: i32, i44: i32, i60: i32,
  i80: i32, i84: i32, i87: i32, i88: i32, i89: i32, i91: i32,
  creaGN1: i32, creaGN2: i32, creaGN3: i32, innoGN3: i32,
  attrGN2: i32, attrGN3: i32, attr: i32, catchup99gu: i32,
  lootgu: i32, card: i32, research81: i32, research95: i32, research105: i32, iters: i32,
  cm46: i32, cm47: i32, cm48: i32, cm51: i32, cm53: i32, cm54: i32, cm57: i32, creaBorgeStat: i32, evo_gem2: i32, evoGN3: i32,
  tempGN4: i32, stelzi: i32, i103: i32, exodus_gem1: i32, exodus_temporalEvolutionCount: i32,
  exodus_gem4: i32, exodus_constructionMilestoneCount: i32, temp_gem6: i32, inno_gem5: i32,
  crea_gem4: i32, crea_gem5: i32, crea_galvTrinketsCount: i32, evo_gem6: i32, t2r7: i32
): f64 {
  
  // Enemies initialisieren
  initEnemies();
  
  // Gadget/Creation Multipliers 
  const gadgetMulti = Math.pow(1.001, gadget as f64) 
    * Math.pow(1.02, Math.floor(gadget / 10) as f64);
  const gadgetLootMulti = Math.pow(1.005, gadget as f64) 
    * Math.pow(1.02, Math.floor(gadget / 10) as f64);
  const crea4GUMulti = 1.0 + (creaBorgeStat as f64) * 0.01;
  
  // Borge erstellen und konfigurieren
  const borge = new Borge();
  
  borge.lvl = lvl;
  borge.maxStage = maxStage;
  
  // Crea Gem 5: HP Bonus basierend auf crea_galvTrinketsCount (0.1% pro Count, Cap bei 100% Bonus = 2.0x)
  let creaGem5HpBonus: f64 = 1;
  if (crea_gem5 > 0) {
    let hpBonusPercent = Math.min(1000, crea_galvTrinketsCount as f64) * 0.001;
    creaGem5HpBonus = 1 + hpBonusPercent;
  }
  
  // Base Stats 
  borge.maxHp = (43 + i3 * 6 + i27 * 24 + (2.5 + Math.floor(hp / 5) * 0.01) * hp) 
    * gadgetMulti 
    * (1 + 0.03 * r4) 
    * (card ? 1.03 : 1) 
    * (creaGN1 ? 1.2 : 1) 
    * (creaGN2 ? 1.02 : 1) 
    * (creaGN3 ? 1 + Math.max(0, (lvl - 39) * 0.015) : 1) 
    * (1 + i60 * 0.03) 
    * (evoGN3 ? 1.0777 : 1) 
    * (1 + 0.05 * i84) 
    * crea4GUMulti 
    * (temp_gem6 > 0 ? 1.03 : 1) 
    * creaGem5HpBonus;
  
  borge.atk = (3 + i13 + 2 * impacts + (0.5 + Math.floor(atk / 10) * 0.01) * atk) 
    * gadgetMulti 
    * (1 + 0.03 * r16) 
    * (innoGN3 ? 1.03 : 1) 
    * (card ? 1.03 : 1) 
    * (creaGN2 ? 1.02 : 1) 
    * (creaGN3 ? 1 + Math.max(0, (lvl - 39) * 0.01) : 1) 
    * (1 + i60 * 0.03) 
    * Math.pow(1.05, i87 as f64) 
    * crea4GUMulti 
    * (temp_gem6 > 0 ? 1.03 : 1) 
    * Math.pow(1.02, t2r7 as f64);
  
  borge.regen = (0.02 + 0.04 * ylith + (0.03 + Math.floor(regen / 30) * 0.01) * regen) 
    * gadgetMulti 
    * (card ? 1.03 : 1) 
    * (creaGN2 ? 1.02 : 1) 
    * (creaGN3 ? 1 + Math.max(0, (lvl - 39) * 0.005) : 1) 
    * (evoGN3 ? 1.0777 : 1) 
    * crea4GUMulti;
  
  borge.dr = 0.0144 * (dr as f64) 
    + (creaGN2 ? 0.02 : 0) 
    + i24 * 0.004 
    + i91 * 0.002;
  
  borge.evade = 0.0034 * (evade as f64) + 0.01;
  
  borge.effect = 0.005 * (effect as f64) 
    + 0.04 
    + (innoGN3 ? 0.03 : 0) 
    + (creaGN2 ? 0.02 : 0) 
    + i11 * 0.02 
    + i89 * 0.002;
  
  borge.critRate = 0.05 
    + 0.0018 * (critRate as f64) 
    + (creaGN2 ? 0.02 : 0) 
    + i4 * 0.0065 
    + i88 * 0.004;
  borge.critPower = 0.01 * (critPower as f64) + 1.3;
  
  // Exodus Gem 4: Construction Milestone ATK Speed Bonus
  let exodusAtkSpeedBonus: f64 = 0;
  if (exodus_gem4 > 0) {
    // Jede 3 Construction Milestones senkt ATK Speed um 0.01s, max 0.25s
    let atkSpeedReduction = Math.floor(exodus_constructionMilestoneCount as f64 / 3) * 0.01;
    exodusAtkSpeedBonus = Math.min(0.25, atkSpeedReduction);
  }
  
  borge.reload = 5 - 0.03 * (aspd as f64) - i23 * 0.04 - exodusAtkSpeedBonus;
  
  // Talente setzen
  borge.revival = revival;
  borge.life = life;
  borge.ua = ua;
  borge.impacts = impacts;
  borge.omen = omen;
  borge.ll = ll;
  borge.pog = pog;
  borge.fow = fow;
  borge.ultimaTalent = ultimaTalent;
  
  // Pfade setzen
  borge.ares = ares;
  borge.ylith = ylith;
  borge.spartan = spartan;
  borge.timeless = timeless;
  borge.bfb = bfb;
  borge.athena = athena;
  borge.baal = baal;
  borge.sensors = sensors;
  borge.atlas = atlas;
  borge.mino = mino;
  borge.helltouch = helltouch;
  borge.punches = punches;
  borge.weakspot = weakspot;
  borge.hermes = hermes;
  borge.inhaler = inhaler;
  
  // PrepBorge
  borge.maxHp *= (1 + 0.01 * borge.ultimaTalent) 
    * (1 + 0.01 * borge.ares);
  
  borge.regen *= (1 + 0.01 * borge.ultimaTalent) 
    * (1 + 0.009 * borge.ylith);
  
  borge.atk *= (1 + 0.01 * borge.ultimaTalent) 
    * (1 + 0.002 * borge.ares) 
    * (1 + 0.01 * borge.mino);
  
  borge.dr += 0.015 * borge.spartan;
  
  borge.critRate += 0.044 * borge.punches 
    + 0.004 * borge.hermes;
  // Evolution GN6: +2% Crit Chance for Borge
  if (evo_gem6 > 0) {
    borge.critRate += 0.02;
  }
  borge.critPower += 0.08 * borge.punches 
    + 0.01 * borge.hermes;
  
  borge.effect += 0.012 * borge.sensors 
    + 0.004 * borge.hermes;
  
  borge.evade += 0.016 * borge.sensors;
  borge.lifesteal = 0.0111 * borge.baal;
  
  // Run simulation
  for (let i = 0; i < iters; i++) {
    sim(borge, maxStage, attr, catchup99gu, reviveCd, trample > 0, special, iap > 0, ultima, scavengers, m0, r7, r19, attrGN2 > 0, attrGN3 > 0, lootgu, i14, i80, i44, research81, research95, research105, cm46, cm47, cm48, cm51, cm53, cm54, cm57, gadgetLootMulti, card > 0, i60, evo_gem2, evoGN3, tempGN4, stelzi, i103, exodus_gem1, exodus_temporalEvolutionCount, exodus_gem4, exodus_constructionMilestoneCount, temp_gem6, inno_gem5, crea_gem4, crea_gem5, crea_galvTrinketsCount);
  }

  // Set lastBorge for export functions
  lastBorge = borge;

  
  // Return result (Loot per minute)
  return borge.ls * 60;
}

// Test function
export function testEnemyCreation(): f64 {
  initEnemies();
  let sum: f64 = 0;
  for (let i = 0; i <= 1000; i++) {
    const enemy = ENEMIES[i];
    sum += enemy.maxHp + enemy.atk;
  }
  return sum;
}

// Export functions to get lastBorge stats
let lastBorge: Borge = new Borge();

export function getLastAvgStage(): f64 { 
  if (lastBorge.iters === 0) return 0;
  return (lastBorge.enem as f64) / (lastBorge.iters as f64) / 10.0; 
}

export function getLastAvgTime(): f64 { 
  if (lastBorge.iters === 0) return 0;
  return lastBorge.time / (lastBorge.iters as f64) / 60.0; 
}

export function getLastMinStage(): f64 { 
  return (lastBorge.minEnem as f64) / 10.0; 
}

export function getLastMaxStage(): f64 { 
  return (lastBorge.maxEnem as f64) / 10.0; 
}

export function getLastBossHpPercent(): f64 {
  if (lastBorge.iters === 0) return 0;
  
  // Finde den ersten Boss, der nicht in allen Runs getötet wurde
  let bossStatsIdx = -1;
  for (let i = 0; i < 10; i++) {
    if (lastBorge.bossStats[i].kills < lastBorge.iters) {
      bossStatsIdx = i;
      break;
    }
  }
  
  if (bossStatsIdx === -1 || lastBorge.maxEnem < (bossStatsIdx + 1) * 1000) {
    return 0; // Kein Boss erreicht oder alle Bosse getötet
  }
  
  // Boss HP Percentage berechnen 
  let bossMaxHp = ENEMIES[(bossStatsIdx + 1) * 100].maxHp;
  return lastBorge.bossStats[bossStatsIdx].hp / (lastBorge.iters as f64) / bossMaxHp * 100;
}

export function getLastBossKillRate(): f64 {
  if (lastBorge.iters === 0) return 0;
  
  // Finde den ersten Boss, der nicht in allen Runs getötet wurde
  let bossStatsIdx = -1;
  for (let i = 0; i < 10; i++) {
    if (lastBorge.bossStats[i].kills < lastBorge.iters) {
      bossStatsIdx = i;
      break;
    }
  }
  
  if (bossStatsIdx === -1 || lastBorge.maxEnem < (bossStatsIdx + 1) * 1000) {
    return 0; // Kein Boss erreicht oder alle Bosse getötet
  }
  
  // Boss Kill Rate berechnen 
  return (lastBorge.bossStats[bossStatsIdx].kills as f64) / (lastBorge.iters as f64) * 100;
}

export function getLastMat1(): f64 { 
  if (lastBorge.iters === 0) return 0;
  return lastBorge.mat1 / (lastBorge.iters as f64); 
}

export function getLastMat2(): f64 { 
  if (lastBorge.iters === 0) return 0;
  return lastBorge.mat2 / (lastBorge.iters as f64); 
}

export function getLastMat3(): f64 { 
  if (lastBorge.iters === 0) return 0;
  return lastBorge.mat3 / (lastBorge.iters as f64); 
}

export function getLastXp(): f64 { 
  if (lastBorge.iters === 0) return 0;
  return lastBorge.xp / (lastBorge.iters as f64); 
}

export function getLastMinMat1(): f64 {
  if (lastBorge.iters === 0) return 0;
  return lastBorge.minMat1;
}

export function getLastMaxMat1(): f64 {
  if (lastBorge.iters === 0) return 0;
  return lastBorge.maxMat1;
}

export function getLastMinMat2(): f64 {
  if (lastBorge.iters === 0) return 0;
  return lastBorge.minMat2;
}

export function getLastMaxMat2(): f64 {
  if (lastBorge.iters === 0) return 0;
  return lastBorge.maxMat2;
}

export function getLastMinMat3(): f64 {
  if (lastBorge.iters === 0) return 0;
  return lastBorge.minMat3;
}

export function getLastMaxMat3(): f64 {
  if (lastBorge.iters === 0) return 0;
  return lastBorge.maxMat3;
}

export function getLastMinXp(): f64 {
  if (lastBorge.iters === 0) return 0;
  return lastBorge.minXp;
}

export function getLastMaxXp(): f64 {
  if (lastBorge.iters === 0) return 0;
  return lastBorge.maxXp;
}

export function getLastProgressString(): string {
  if (lastBorge.iters === 0 || lastBorge.progress.size === 0) return "{}";
  
  let result = "{";
  let first = true;
  let keys = lastBorge.progress.keys();
  
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (!first) result += ",";
    result += `"${key}":${lastBorge.progress.get(key)}`;
    first = false;
  }
  
  result += "}";
  return result;
}

export function getLastStatsString(): string {
  if (lastBorge.iters === 0) return "";
  return `${lastBorge.maxHp},${lastBorge.atk},${lastBorge.regen},${lastBorge.dr},${lastBorge.evade},${lastBorge.effect},${lastBorge.critRate},${lastBorge.critPower},${lastBorge.reload}`;
}

export function getLastBorgeMaxHp(): f64 {
  return lastBorge.maxHp;
}

export function getLastBorgeAtk(): f64 {
  return lastBorge.atk;
}

export function getLastBorgeRegen(): f64 {
  return lastBorge.regen;
}

export function getLastBorgeDr(): f64 {
  return lastBorge.dr;
}

export function getLastBorgeEvade(): f64 {
  return lastBorge.evade;
}

export function getLastBorgeEffect(): f64 {
  return lastBorge.effect;
}

export function getLastBorgeCritRate(): f64 {
  return lastBorge.critRate;
}

export function getLastBorgeCritPower(): f64 {
  return lastBorge.critPower;
}

export function getLastBorgeReload(): f64 {
  return lastBorge.reload;
}

export function getProgressSize(): i32 {
  return lastBorge.progress.size;
}

export function getProgressStageAt(index: i32): i32 {
  if (index >= lastBorge.progress.size) return -1;
  let keys = lastBorge.progress.keys();
  return keys[index];
}

export function getProgressCountAt(index: i32): i32 {
  if (index >= lastBorge.progress.size) return 0;
  let keys = lastBorge.progress.keys();
  let stage = keys[index];
  return lastBorge.progress.get(stage);
}

// Death Tracking Export-Funktionen
export function getDeathsByStageAndReviveSize(): i32 {
  return lastBorge.deathsByStageAndRevive.size;
}

export function getDeathKeyAt(index: i32): i32 {
  if (index >= lastBorge.deathsByStageAndRevive.size) return -1;
  let keys = lastBorge.deathsByStageAndRevive.keys();
  return keys[index]; 
}

export function getDeathCountAt(index: i32): i32 {
  if (index >= lastBorge.deathsByStageAndRevive.size) return 0;
  let keys = lastBorge.deathsByStageAndRevive.keys();
  let key = keys[index];
  return lastBorge.deathsByStageAndRevive.get(key);
}

export function getDeathsByStageAndReviveString(): string {
  if (lastBorge.deathsByStageAndRevive.size === 0) return "{}";
  
  let result = "{";
  let keys = lastBorge.deathsByStageAndRevive.keys();
  
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) result += ",";
    let numericKey = keys[i];
    let count = lastBorge.deathsByStageAndRevive.get(numericKey);
    
    let stage = Math.floor(numericKey / 1000) as i32;
    let revive = numericKey % 1000;
    
    result += `"${stage}_${revive}":${count}`;
  }
  
  result += "}";
  return result;
}