// Random Number Generator (identisch mit Borge)
let seed: u32 = 12345;
function random(): f64 {
  seed = (((seed as u64) * 1664525 + 1013904223) % 4294967296) as u32;
  return (seed as f64) / 4294967296.0;
}

function ck(chance: f64): boolean {
  return chance > 0 && chance > random();
}

// Multi-Funktion (EXAKT wie JS)
function multi(enemyNum: i32): f64 {
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

// Min-Funktion für mehrere Werte
function minAll(a: f64, b: f64, c: f64, d: f64, e: f64, f: f64): f64 {
  return Math.min(Math.min(Math.min(Math.min(Math.min(a, b), c), d), e), f);
}

// Ozzy Enemy-Struktur (EXAKT wie JS simEnemy)
class OzzyEnemy {
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
  maxDps: f64;
  enrage: i32;
  stunEnd: f64;

  constructor(enemyNum: i32) {
    const multiVal = multi(enemyNum);
    const floorDiv = Math.floor(Math.max(0, enemyNum - 1) / 100) as i32;
    const isBoss = enemyNum > 0 && enemyNum % 100 === 0;
    const is300 = enemyNum === 300;
    
    // EXAKT wie JS: (11+6 * enemyNum) * multi(enemyNum)*Math.pow(2.9,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 48 : 1)*(enemyNum === 300 ? .94 : 1)
    this.maxHp = (11 + 6 * enemyNum) * multiVal * Math.pow(2.9, floorDiv as f64) * (isBoss ? 48 : 1) * (is300 ? 0.94 : 1);
    this.hp = 1;
    
    // EXAKT wie JS: (1.35+ .75 * enemyNum) * multi(enemyNum)*Math.pow(2.7,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 3 : 1)*(enemyNum === 300 ? .94 : 1)
    this.atk = (1.35 + 0.75 * enemyNum) * multiVal * Math.pow(2.7, floorDiv as f64) * (isBoss ? 3 : 1) * (is300 ? 0.94 : 1);
    
    // EXAKT wie JS: Math.min(.25,(.0994 + .0006 * enemyNum + (enemyNum>0 && enemyNum%100 === 0 ? .1 : 0)))
    this.critRate = Math.min(0.25, (0.0994 + 0.0006 * enemyNum + (isBoss ? 0.1 : 0)));
    
    // EXAKT wie JS: Math.min(2.5,1.03 + .008 * enemyNum)
    this.critDmg = Math.min(2.5, 1.03 + 0.008 * enemyNum);
    
    // EXAKT wie JS: (1-(enemyNum>=200?(Math.max(0,Math.floor((enemyNum-1)/100)-2))*.02+.04:0)) - (enemyNum>0 && enemyNum%100 === 0 ? .05 : 0)
    if (enemyNum >= 200) {
      this.dr = (1 - (Math.max(0, floorDiv - 2) * 0.02 + 0.04)) - (isBoss ? 0.05 : 0);
    } else {
      this.dr = 1 - (isBoss ? 0.05 : 0);
    }
    
    // EXAKT wie JS: enemyNum>=100?.01+.01*(Math.max(0,(Math.floor((enemyNum-1)/100))-1)):0
    if (enemyNum >= 100) {
      this.evade = 0.01 + 0.01 * Math.max(0, floorDiv - 1);
    } else {
      this.evade = 0;
    }
    
    // EXAKT wie JS: enemyNum>=300?.04+.01*(Math.max(0,(Math.floor((enemyNum-1)/100))-3)) + (enemyNum>0 && enemyNum%100 === 0 ? .04 : 0):0
    if (enemyNum >= 300) {
      this.effect = 0.04 + 0.01 * Math.max(0, floorDiv - 3) + (isBoss ? 0.04 : 0);
    } else {
      this.effect = 0;
    }
    
    // EXAKT wie JS: Math.max(0,-.08 +.1* (enemyNum) * multi(enemyNum)*Math.pow(1.25,Math.floor(Math.max(0,enemyNum-1)/100)))*(enemyNum>0 && enemyNum%100 === 0 ? 6 : 1)*(enemyNum === 300 ? .97 : 1)
    this.regen = Math.max(0, -0.08 + 0.1 * enemyNum * multiVal * Math.pow(1.25, floorDiv as f64)) * (isBoss ? 6 : 1) * (is300 ? 0.97 : 1);
    
    // EXAKT wie JS: (3.2 - .004 * enemyNum)*(enemyNum>0 && enemyNum%100 === 0 ? 2.45 : 1)
    this.atkSpd = (3.2 - 0.004 * enemyNum) * (isBoss ? 2.45 : 1);
    
    // EXAKT wie JS: 999*(1.35+ .75 * enemyNum) * multi(enemyNum)*Math.pow(2.7,Math.floor(Math.max(0,enemyNum-1)/100))*(enemyNum>0 && enemyNum%100 === 0 ? 3 : 1)*Math.min(2.5,1.03 + .008 * enemyNum)/(3.2 - .004 * enemyNum)
    this.maxDps = 999 * (1.35 + 0.75 * enemyNum) * multiVal * Math.pow(2.7, floorDiv as f64) * (isBoss ? 3 : 1) * Math.min(2.5, 1.03 + 0.008 * enemyNum) / (3.2 - 0.004 * enemyNum);
    
    this.enrage = 0;
    this.stunEnd = 0;
  }
}

// Boss Stats Struktur
class OzzyBossStats {
  hp: f64;
  kills: i32;
  
  constructor() {
    this.hp = 0;
    this.kills = 0;
  }
}

// Vorberechnete Enemies
const OZZY_ENEMIES = new StaticArray<OzzyEnemy>(1001);
function initOzzyEnemies(): void {
  for (let i = 0; i <= 1000; i++) {
    OZZY_ENEMIES[i] = new OzzyEnemy(i);
  }
}

// Ozzy Character Struktur (VOLLSTÄNDIG wie JS baseOzzy + getTalents + getPath)
class Ozzy {
  // Base Stats
  lvl: i32;
  maxStage: i32;
  maxHp: f64;
  hp: f64;
  atk: f64;
  regen: f64;
  dr: f64;
  evade: f64;
  effect: f64;
  multistrike: f64;
  multistrikePower: f64;
  reload: f64;
  lifesteal: f64;
  
  // Current Stats
  currentMaxHp: f64;
  currentAtk: f64;
  currentRegen: f64;
  currentDr: f64;
  currentMultistrike: f64;
  currentMultistrikePower: f64;
  evadeStacks: i32;
  revives: i32;
  remainingBullets: i32;
  time: f64;
  
  // Base Stats Record (für Stats-Export)
  basehp: i32;
  baseatk: i32;
  baseregen: i32;
  basedr: i32;
  baseevade: i32;
  baseeffect: i32;
  basecharge: i32;
  basechargeGain: i32;
  basereload: i32;
  
  // Talente (EXAKT wie JS getTalents)
  revival: i32;
  trickster: i32;
  ua: i32;
  thousandNeedles: i32;
  omen: i32;
  ll: i32;
  crippling: i32;
  echoBullets: i32;
  ultimaTalent: i32;
  
  // Pfade (EXAKT wie JS getPath)
  lotl: i32;
  exo: i32;
  scorp: i32;
  dod: i32;
  cat: i32;
  timeless: i32;
  wings: i32;
  exterm: i32;
  medusa: i32;
  scarab: i32;
  vectid: i32;
  snek: i32;
  cod: i32;
  dwd: i32;
  sisters: i32;
  
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
  
  // Boss Stats Array
  bossStats: StaticArray<OzzyBossStats>;
  
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
    this.multistrike = 0;
    this.multistrikePower = 0;
    this.reload = 0;
    this.lifesteal = 0;
    this.currentMaxHp = 0;
    this.currentAtk = 0;
    this.currentRegen = 0;
    this.currentDr = 0;
    this.currentMultistrike = 0;
    this.currentMultistrikePower = 0;
    this.evadeStacks = 0;
    this.revives = 0;
    this.remainingBullets = 0;
    this.time = 0;
    this.basehp = 0;
    this.baseatk = 0;
    this.baseregen = 0;
    this.basedr = 0;
    this.baseevade = 0;
    this.baseeffect = 0;
    this.basecharge = 0;
    this.basechargeGain = 0;
    this.basereload = 0;
    this.revival = 0;
    this.trickster = 0;
    this.ua = 0;
    this.thousandNeedles = 0;
    this.omen = 0;
    this.ll = 0;
    this.crippling = 0;
    this.echoBullets = 0;
    this.ultimaTalent = 0;
    this.lotl = 0;
    this.exo = 0;
    this.scorp = 0;
    this.dod = 0;
    this.cat = 0;
    this.timeless = 0;
    this.wings = 0;
    this.exterm = 0;
    this.medusa = 0;
    this.scarab = 0;
    this.vectid = 0;
    this.snek = 0;
    this.cod = 0;
    this.dwd = 0;
    this.sisters = 0;
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
    
    // Boss Stats initialisieren
    this.bossStats = new StaticArray<OzzyBossStats>(10);
    for (let i = 0; i < 10; i++) {
      this.bossStats[i] = new OzzyBossStats();
    }
    
    // Progress Map initialisieren
    this.progress = new Map<i32, i32>();
    this.deathsByStageAndRevive = new Map<i32, i32>(); 
    this.maxRevives = 0;
  }
}

// Globale Variablen für die Simulation
let currentOzzy: Ozzy = new Ozzy();
let currentOzzyEnem: i32 = 0;
let currentOzzyTime: f64 = 0;
let currentOzzyEnemy: OzzyEnemy = new OzzyEnemy(0);
let vectidStacks: i32 = 0;
let cripplingActive: boolean = false;
let hardenEnd: f64 = 0;
let nextOzzyAtk: f64 = 0;
let nextEchoBullet: f64 = 0;
let nextOzzyEnemAtk: f64 = 0;
let nextOzzyRegen: f64 = 0;
let nextMultistrike: f64 = 0;
let nextHarden: f64 = 0;
let currentOzzyAttr: i32 = 0;
let currentOzzyCatchup99gu: i32 = 0;
let currentOzzyMaxStage: i32 = 0;
let bossKillsByRevive = new StaticArray<i32>(11); // Revive 0-10
let bossAttemptsByRevive = new StaticArray<i32>(11); // Revive 0-10
let lastTrackedBossStage: i32 = -1; 
let entryRevivesForRun: i32 = -1; // ← NEU: Global definieren

// Boss-Tracking initialisieren
function initBossTracking(): void {
  for (let i = 0; i < 11; i++) {
    bossKillsByRevive[i] = 0;
    bossAttemptsByRevive[i] = 0;
  }
}

// Array-Hilfsfunktionen für JS-äquivalente Operationen
function ozzyArraySum(arr: StaticArray<f64>): f64 {
  let sum: f64 = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

function ozzyArrayAverage(arr: StaticArray<f64>): f64 {
  return ozzyArraySum(arr) / arr.length;
}

// Regen function (EXAKT wie JS)
function ozzyRegen(): void {
  let medDmg: f64 = 0;
  if (currentOzzyEnem % 1000 === 0 && currentOzzyEnem >= 3000) {
    medDmg = currentOzzyEnemy.regen * 0.2 * (currentOzzyTime > hardenEnd ? 1 : 3);
  }
  currentOzzy.hp = Math.min(currentOzzy.currentMaxHp, currentOzzy.hp - medDmg + currentOzzy.currentRegen * (vectidStacks ? (1 + 0.15 * currentOzzy.vectid) : 1));
  if (currentOzzyTime > hardenEnd) {
    currentOzzyEnemy.hp = Math.min(currentOzzyEnemy.maxHp, currentOzzyEnemy.hp + currentOzzyEnemy.regen * (1 - 0.088 * currentOzzy.snek) - 0.06 * currentOzzy.medusa * currentOzzy.currentRegen * (vectidStacks ? (1 + 0.15 * currentOzzy.vectid) : 1));
  }
  nextOzzyRegen = currentOzzyTime + 1;
  
  vectidStacks = Math.max(0, vectidStacks - 1) as i32;
  if (currentOzzyEnemy.hp <= 0) { 
    ozzyKillEnemy();
  }
}

// Harden function (EXAKT wie JS)
function ozzyHarden(): void {
  if (!hardenEnd) {
    hardenEnd = currentOzzyTime + 5;
    nextOzzyEnemAtk += 5 - Math.max(0, currentOzzyEnemy.stunEnd - currentOzzyTime);
    nextHarden = Math.ceil(currentOzzyTime * 3) / 3;
  } else {
    currentOzzyEnemy.hp = Math.min(currentOzzyEnemy.maxHp, currentOzzyEnemy.hp + currentOzzyEnemy.regen * (1 - 0.088 * currentOzzy.snek) - 0.06 * currentOzzy.medusa * currentOzzy.currentRegen * (vectidStacks ? (1 + 0.15 * currentOzzy.vectid) : 1));
    nextHarden = currentOzzyTime + 1/3;
    if (nextHarden > hardenEnd) {
      nextHarden = currentOzzyTime + 25;
      hardenEnd = 0;
      currentOzzyEnemy.enrage += 5;
      nextOzzyEnemAtk = nextOzzyEnemAtk - (Math.max(0.5, currentOzzyEnemy.atkSpd - (currentOzzyEnemy.enrage - 5) * (currentOzzyEnemy.atkSpd / 200)) - Math.max(0.5, currentOzzyEnemy.atkSpd - currentOzzyEnemy.enrage * (currentOzzyEnemy.atkSpd / 200)));
    }
  }
}

// Enemy Attack function (EXAKT wie JS)
function ozzyEnemyAttack(): void {
  let dmg = currentOzzyEnemy.atk;
  
  if (currentOzzyEnem > 0 && currentOzzyEnem % 1000 === 0) {
    currentOzzyEnemy.enrage++;
    if (currentOzzyEnemy.enrage > 200) {
      dmg *= 3;
    }
    nextOzzyEnemAtk = currentOzzyTime + Math.max(0.5, currentOzzyEnemy.atkSpd - currentOzzyEnemy.enrage * (currentOzzyEnemy.atkSpd / 200));
  } else {
    nextOzzyEnemAtk = currentOzzyTime + currentOzzyEnemy.atkSpd;
  }
  
  if (currentOzzy.evadeStacks) {
    dmg = 0;
    currentOzzy.evadeStacks--;
  } else if (ck(currentOzzy.evade)) {
    dmg = 0;
  } else if (currentOzzyEnemy.enrage > 200 || ck(currentOzzyEnemy.critRate)) {
    dmg *= currentOzzyEnemy.critDmg;
    if (ck(currentOzzy.dod * 0.15)) {
      currentOzzy.evadeStacks++;
    }
  }
  
  if (ck(currentOzzyEnemy.effect)) {
    currentOzzy.currentDr = Math.max(0, currentOzzy.currentDr - 0.02);
  }
  
  currentOzzy.hp -= dmg * (1 - currentOzzy.currentDr) * (1 - 0.01 * currentOzzy.scarab);
}

// Kill Enemy function
function ozzyKillEnemy(): void {
  hardenEnd = 0;

  if (currentOzzyEnem > 0 && currentOzzyEnem % 1000 === 0) {
    currentOzzyEnem += 10;
  } else {
    currentOzzyEnem++;
  }

  if (currentOzzyEnem === 1000) {
    currentOzzy.currentAtk /= (Math.pow(Math.pow(1.08, currentOzzyCatchup99gu as f64), 1 + currentOzzyAttr * 0.1 - 0.1));
  }
  
  if (currentOzzyEnem % 1000 === 0 && currentOzzyEnem >= 2000) {
    nextHarden = currentOzzyTime + 25;
  } else {
    nextHarden = 99999999;
  }
  
  if (currentOzzyEnem % 10 === 0) {
    currentOzzyEnemy = OZZY_ENEMIES[Math.floor(currentOzzyEnem / 10) as i32];
  }
  
  currentOzzyEnemy.hp = currentOzzyEnemy.maxHp;
  currentOzzyEnemy.enrage = 0;
  currentOzzyEnemy.stunEnd = 0;
  
  if (currentOzzy.hp < currentOzzy.currentMaxHp && currentOzzy.ua && ck(currentOzzy.effect)) {
    currentOzzy.hp = Math.min(currentOzzy.currentMaxHp, currentOzzy.hp + currentOzzy.currentMaxHp * currentOzzy.ua * 0.02);
    vectidStacks = 5;
  }
  
  if ((currentOzzyEnem > 0 && currentOzzyEnem % 1000 === 0) || (currentOzzyEnemy.maxDps * (1 - currentOzzy.currentDr) > currentOzzy.currentRegen)) {
    nextOzzyEnemAtk = currentOzzyTime + currentOzzyEnemy.atkSpd;
  } else {
    nextOzzyEnemAtk = 9999999;
  }
  
  if (currentOzzyEnemy.hp <= 0) {
    ozzyKillEnemy();
  }
}

// Attack function (EXAKT wie JS - SEHR KOMPLIZIERT!)
function ozzyAtk(skipAtkReset: boolean = false, dmgMod: f64 = 1, isMultistrike: boolean = false): void {
  let evaded = currentOzzyEnemy.evade > 0 && ck(currentOzzyEnemy.evade);
  
  currentOzzyEnemy.hp -= evaded ? 0 : (currentOzzy.currentAtk * dmgMod + currentOzzy.omen * 0.008 * currentOzzyEnemy.hp / (currentOzzyEnem > 0 && currentOzzyEnem % 1000 === 0 ? 10 : 1)) * (cripplingActive ? 1 + 0.03 * currentOzzy.crippling : 1) * (currentOzzyTime < hardenEnd ? 0.05 : currentOzzyEnemy.dr);
  
  if (currentOzzyEnemy.hp <= 0) { 
    ozzyKillEnemy();
  }
  
  let ms = !isMultistrike && ck(currentOzzy.currentMultistrike);
  if (ms) {
    nextMultistrike = currentOzzyTime + 0.3;
  }
  
  currentOzzy.hp = evaded ? currentOzzy.hp : Math.min(currentOzzy.currentMaxHp, currentOzzy.hp + currentOzzy.lifesteal * currentOzzy.currentAtk * dmgMod);
  
  if (!evaded && currentOzzy.crippling) {
    cripplingActive = ck(currentOzzy.effect);
  }
  
  if (!skipAtkReset) {
    if (!evaded) {
      if (currentOzzy.echoBullets && ck(currentOzzy.effect / 2)) {
        nextEchoBullet = currentOzzyTime + 0.3001;
      }
      if (currentOzzy.trickster && ck(currentOzzy.effect / 2)) {
        currentOzzy.evadeStacks++;
      }
      if (currentOzzyTime > hardenEnd && currentOzzy.thousandNeedles && ck(currentOzzy.effect)) {
        nextOzzyEnemAtk += currentOzzy.thousandNeedles * 0.05 / (currentOzzyEnem % 1000 === 0 ? 2 : 1);
        currentOzzyEnemy.stunEnd = currentOzzyTime + currentOzzy.thousandNeedles * 0.05 / (currentOzzyEnem % 1000 === 0 ? 2 : 1);
      }
    }
    let divisor: f64 = 1;
    if (currentOzzyEnem < 1000) {
      divisor = (Math.pow(Math.pow(1.08, currentOzzyCatchup99gu as f64), 1 + currentOzzyAttr * 0.1 - 0.1));
    }
    nextOzzyAtk = currentOzzyTime + currentOzzy.reload / divisor;
  }
}

// Simulation-Funktion (EXAKT wie JS sim)
function ozzySim(ozzy: Ozzy, maxStage: i32, attr: i32, catchup99gu: i32, reviveCd: i32, 
                 special: f64, iap: boolean, ultima: f64, scavengers: i32, m0: i32, r7: i32, 
                 attrGN3: boolean, lootgu: i32, i32_: i32, i81: i32, research81: i32, 
                 cm46: i32, cm47: i32, cm48: i32, cm51: i32, gadgetLootMulti: f64, 
                 card: boolean, i33: i32): void {
  entryRevivesForRun = -1;
  lastTrackedBossStage = -1;

  // Globale Variablen setzen
  currentOzzy = ozzy;
  currentOzzyEnem = 0;
  currentOzzyTime = 0;
  currentOzzyAttr = attr;
  currentOzzyCatchup99gu = catchup99gu;
  currentOzzyMaxStage = maxStage;

  vectidStacks = 0;
  cripplingActive = false;
  hardenEnd = 0;
  
  ozzy.evadeStacks = 0;
  ozzy.hp = ozzy.maxHp;
  ozzy.currentMaxHp = ozzy.maxHp;
  ozzy.currentAtk = ozzy.atk * (Math.pow(Math.pow(1.08, catchup99gu as f64), 1 + attr * 0.1 - 0.1));
  ozzy.currentRegen = ozzy.regen;
  ozzy.currentDr = ozzy.dr;
  ozzy.currentMultistrike = ozzy.multistrike;
  ozzy.currentMultistrikePower = ozzy.multistrikePower;
  ozzy.revives = ozzy.revival + ozzy.sisters;
  ozzy.time += 40 - Math.min(reviveCd, 30);
  ozzy.maxStage = Math.max(ozzy.maxStage, Math.floor(ozzy.maxEnem / 10)) as i32;
  ozzy.remainingBullets = 0;

  if (ozzy.maxRevives === 0) {
    ozzy.maxRevives = ozzy.revival + ozzy.sisters; 
  }
  
  currentOzzyEnemy = OZZY_ENEMIES[0];
  currentOzzyEnemy.hp = currentOzzyEnemy.maxHp;
  
  nextOzzyAtk = ozzy.reload;
  nextEchoBullet = 99999999;
  nextOzzyEnemAtk = currentOzzyEnemy.atkSpd;
  nextOzzyRegen = 1;
  nextMultistrike = 99999999;
  nextHarden = 99999999;
  
  // Haupt-Kampfschleife 
  while (ozzy.hp > 0) {
    // Boss-Encounter-Tracking beim ersten Boss-Frame (UNABHÄNGIG von Revive-Logic)
    if (currentOzzyEnem > 0 && currentOzzyEnem % 1000 === 0) {
      let currentBossStage = Math.floor(currentOzzyEnem / 10) as i32;
      
      // Nur tracken wenn es ein NEUER Boss ist
      if (currentBossStage != lastTrackedBossStage) {
        entryRevivesForRun = ozzy.revives;  // Merke verbleibende Revives
        bossAttemptsByRevive[ozzy.revives]++;
        lastTrackedBossStage = currentBossStage; // Verhindert mehrfaches Tracking
      }
    }

    currentOzzyTime = minAll(nextOzzyAtk, nextEchoBullet, nextMultistrike, nextOzzyEnemAtk, nextOzzyRegen, nextHarden);
    
    if (currentOzzyTime === nextOzzyRegen) {
      ozzyRegen();
    } else if (currentOzzyTime === nextMultistrike) {
      ozzyAtk(true, ozzy.currentMultistrikePower, true);
      nextMultistrike = 99999999;
    } else if (currentOzzyTime === nextEchoBullet) {
      ozzyAtk(true, 0.05 * ozzy.echoBullets);
      nextEchoBullet = 99999999;
    } else if (currentOzzyTime === nextOzzyEnemAtk) {
      ozzyEnemyAttack();
    } else if (currentOzzyTime === nextHarden) {
      ozzyHarden();
    } else if (currentOzzyTime === nextOzzyAtk) {
      ozzyAtk(false, 1);
    }
    
    // Revive Logic 
    if (ozzy.revives && ozzy.hp <= 0) {
      ozzy.hp = 0.8 * ozzy.currentMaxHp;
      
      // NEU: Death Tracking
      let reviveNumber = ozzy.maxRevives - ozzy.revives + 1;
      let currentStage = Math.floor(currentOzzyEnem / 10) as i32;
      let numericKey = currentStage * 1000 + reviveNumber; // Stage 351, Revive 2 → 351002
      
      if (ozzy.deathsByStageAndRevive.has(numericKey)) {
        ozzy.deathsByStageAndRevive.set(numericKey, ozzy.deathsByStageAndRevive.get(numericKey) + 1);
      } else {
        ozzy.deathsByStageAndRevive.set(numericKey, 1);
      }
      
      ozzy.revives--;
      ozzy.currentAtk = ozzy.atk * (1 + 0.02 * ozzy.dwd * (ozzy.revival + ozzy.sisters - ozzy.revives));
      ozzy.currentDr = ozzy.dr + 0.016 * ozzy.dwd * (ozzy.revival + ozzy.sisters - ozzy.revives);
      ozzy.currentMultistrike += 0.023 * ozzy.cod;
      ozzy.currentMultistrikePower += 0.02 * ozzy.cod;
    } 
  }

  // Boss-Kill-Tracking NACH der while-Schleife (wie vorher):
  if (entryRevivesForRun >= 0) {
    // Prüfe ob Boss getötet wurde
    let lastBossStage = (Math.floor(currentOzzyEnem / 10) / 100) as i32 * 100;
    let bossEnemy = lastBossStage * 10;
    let bossKilled = currentOzzyEnem > bossEnemy;
    
    if (bossKilled) {
      bossKillsByRevive[entryRevivesForRun]++;
    }
  }
  
  // Boss Stats Update 
  for (let i = 0; i < 10; i++) {
    if (currentOzzyEnem < (i + 1) * 1000) {
      ozzy.bossStats[i].hp += OZZY_ENEMIES[(i + 1) * 100].maxHp;
    } else if (currentOzzyEnem === (i + 1) * 1000) {
      ozzy.bossStats[i].hp += OZZY_ENEMIES[(i + 1) * 100].hp;
    } else {
      ozzy.bossStats[i].kills += 1;
    }
  }
  
  // Material Calculations 
  const mat1 = new StaticArray<f64>(7);
  mat1[0] = 1; mat1[1] = 1.2; mat1[2] = 1.4; mat1[3] = 1.6; mat1[4] = 1.8; mat1[5] = 2.5; mat1[6] = 3.2;
  
  const mat2 = new StaticArray<f64>(4);
  mat2[0] = 1.1; mat2[1] = 1.3; mat2[2] = 1.4; mat2[3] = 2.8;
  
  const mat3 = new StaticArray<f64>(3);
  mat3[0] = 0.9; mat3[1] = 1; mat3[2] = 1.95;
  
  const xp = new StaticArray<f64>(2);
  xp[0] = 1.2; xp[1] = 1.6;

  let normalized = (3 * ozzyArrayAverage(mat1) + 3 * ozzyArrayAverage(mat2) + 3 * ozzyArrayAverage(mat3) + ozzyArrayAverage(xp)) / 10;

  let stageGrowth: f64 = 1.059;
  let enemiesInSection: i32 = 1010;
  let excludedXpMultis = Math.pow(1.75, i33 as f64) * Math.pow(2, Math.floor((maxStage - 1) / 100) as f64);
  let includedMultis = (1 + ozzy.timeless * 0.16) * (1 + 0.05 * ozzy.scarab) * gadgetLootMulti * (card ? 1.05 : 1);
  let excludedMultis = Math.max(special, 1) * (iap ? 1.25 : 1) * Math.max(ultima, 1) * Math.pow(1.05, scavengers as f64) * Math.pow(1.02, m0 as f64) * Math.pow(1.05, r7 as f64) * (attrGN3 ? 1.25 : 1) * (Math.pow(Math.pow(1.04, lootgu as f64), 1 + attr * 0.1 - 0.1)) * Math.pow(1.5, i32_ as f64) * Math.pow(1.1, i81 as f64) * (research81 >= 2 ? 1.1 : 1) * (research81 >= 5 ? 1.2 : 1) * (cm46 > 0 ? 1.03 : 1) * (cm47 > 0 ? 1.02 : 1) * (cm48 > 0 ? 1.07 : 1) * (cm51 > 0 ? 1.05 : 1);
  
  let loopLoot = normalized * ((Math.pow(stageGrowth, Math.floor(Math.min(currentOzzyEnem, enemiesInSection - 10) / 10) as f64) - 1) / (stageGrowth - 1) * 10 + (Math.min(currentOzzyEnem, enemiesInSection - 10) - Math.floor(Math.min(currentOzzyEnem, enemiesInSection - 10) / 10) * 10) * Math.pow(stageGrowth, Math.floor(Math.min(currentOzzyEnem, enemiesInSection - 10) / 10) as f64)) * includedMultis * (1 + ozzy.ll * 0.2 * ozzy.effect);
  
  let bonusMulti: f64 = 1;
  let tempEnem = currentOzzyEnem;
  
  while (tempEnem >= enemiesInSection) {
    tempEnem -= enemiesInSection;
    enemiesInSection = 1000;

    bonusMulti *= Math.pow(stageGrowth, 100);

    ozzy.mat1 += bonusMulti * mat1[mat1.length - 1] * 800 * includedMultis * excludedMultis;
    ozzy.mat2 += bonusMulti * mat2[mat2.length - 1] * 600 * includedMultis * excludedMultis;
    ozzy.mat3 += bonusMulti * mat3[mat3.length - 1] * 400 * includedMultis * excludedMultis;
    ozzy.xp += bonusMulti * xp[xp.length - 1] * 300 * includedMultis * excludedMultis * excludedXpMultis;

    ozzy.loot += bonusMulti * mat1[mat1.length - 1] * 800 * includedMultis;
    ozzy.loot += bonusMulti * mat2[mat2.length - 1] * 600 * includedMultis;
    ozzy.loot += bonusMulti * mat3[mat3.length - 1] * 400 * includedMultis;
    ozzy.loot += bonusMulti * xp[xp.length - 1] * 300 * includedMultis;

    bonusMulti *= 5;

    loopLoot += bonusMulti * normalized * stageGrowth * ((Math.pow(stageGrowth, Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) as f64) - 1) / (stageGrowth - 1) * 10 + (Math.min(tempEnem, enemiesInSection - 10) - Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) * 10) * Math.pow(stageGrowth, Math.floor(Math.min(tempEnem, enemiesInSection - 10) / 10) as f64)) * includedMultis * (1 + ozzy.ll * 0.2 * ozzy.effect);
  }
  
  ozzy.mat1 += loopLoot * 3 / 10 * ozzyArrayAverage(mat1) / normalized * excludedMultis;
  ozzy.mat2 += loopLoot * 3 / 10 * ozzyArrayAverage(mat2) / normalized * excludedMultis;
  ozzy.mat3 += loopLoot * 3 / 10 * ozzyArrayAverage(mat3) / normalized * excludedMultis;
  ozzy.xp += loopLoot * 1 / 10 * ozzyArrayAverage(xp) / normalized * excludedMultis * excludedXpMultis;
  ozzy.loot += loopLoot;
  ozzy.time += currentOzzyTime;
  ozzy.enem += currentOzzyEnem;
  ozzy.ls = ozzy.loot / ozzy.time;
  ozzy.iters++;
  
  ozzy.minEnem = Math.min(ozzy.minEnem, currentOzzyEnem) as i32; 
  ozzy.maxEnem = Math.max(ozzy.maxEnem, currentOzzyEnem) as i32; 
  
  // Progress tracking
  let stageKey = Math.floor(currentOzzyEnem / 10) as i32;
  if (ozzy.progress.has(stageKey)) {
    ozzy.progress.set(stageKey, ozzy.progress.get(stageKey) + 1);
  } else {
    ozzy.progress.set(stageKey, 1);
  }
}

// EVALOZZY_WASM - EXAKTE JS-ÜBERTRAGUNG
export function EVALOZZY_WASM(
  lvl: i32, maxStage: i32, hp: i32, atk: i32, regen: i32, 
  dr: i32, evade: i32, effect: i32, multistrike: i32, multistrikePower: i32,
  aspd: i32, revival: i32, trickster: i32, ua: i32, thousandNeedles: i32,
  omen: i32, ll: i32, crippling: i32, ultimaTalent: i32, echoBullets: i32,
  lotl: i32, exo: i32, scorp: i32, dod: i32, cat: i32,
  timeless: i32, wings: i32, exterm: i32, medusa: i32, scarab: i32,
  vectid: i32, snek: i32, cod: i32, dwd: i32, sisters: i32,
  gadget: i32, iap: i32, special: f64, ultima: f64, reviveCd: i32,
  scavengers: i32, m0: i32, r4: i32, r7: i32, r17: i32,
  i31: i32, i32_: i32, i33: i32, i36: i32, i37: i32,
  i40: i32, i81: i32, i86: i32, i92: i32, innoGN2: i32,
  innoGN3: i32, attrGN3: i32, attr: i32, catchup99gu: i32,
  lootgu: i32, card: i32, research81: i32, iters: i32,
  cm46: i32, cm47: i32, cm48: i32, cm51: i32, creastat: i32
): f64 {
  
  // Enemies initialisieren
  initOzzyEnemies();
  initBossTracking();
  
  // Gadget/Creature Multipliers (EXAKT WIE JS)
  const gadgetMulti = Math.pow(1.001, gadget as f64) * Math.pow(1.02, Math.floor(gadget / 10) as f64);
  const gadgetLootMulti = Math.pow(1.005, gadget as f64) * Math.pow(1.02, Math.floor(gadget / 10) as f64);
  const crea4GUMulti = 1.0 + (creastat as f64) * 0.01;
  
  // Ozzy erstellen und konfigurieren (EXAKT WIE JS getBaseStats)
  const ozzy = new Ozzy();
  
  ozzy.lvl = lvl;
  ozzy.maxStage = maxStage;
  
  // Base Stats (EXAKT WIE JS getBaseStats)
  ozzy.maxHp = (16 + (2 + Math.floor(hp / 5) * 0.03) * hp) * gadgetMulti * (1 + 0.03 * r4) * (card ? 1.03 : 1) * crea4GUMulti;
  ozzy.atk = (2 + (0.3 + Math.floor(atk / 10) * 0.01) * atk) * gadgetMulti * (1 + 0.03 * r17) * (innoGN3 ? 1.03 : 1) * (card ? 1.03 : 1) * crea4GUMulti;
  ozzy.regen = (0.1 + (0.05 + Math.floor(regen / 30) * 0.01) * regen) * gadgetMulti * (innoGN2 ? 1.25 : 1) * (card ? 1.03 : 1) * crea4GUMulti;
  ozzy.dr = 0.0035 * dr + 0.0111 * i37 + 0.002 * i86;
  ozzy.evade = 0.0062 * evade + 0.05;
  ozzy.effect = 0.0035 * effect + 0.04 + 0.006 * i31 + 0.002 * i92;
  ozzy.multistrike = 0.05 + 0.0038 * multistrike + (innoGN3 ? 0.03 : 0) + 0.005 * i40;
  ozzy.multistrikePower = 0.01 * multistrikePower + 0.25;
  ozzy.reload = 4 - 0.02 * aspd - 0.03 * i36;
  
  // Base Stats Record (für Stats-Export)
  ozzy.basehp = hp;
  ozzy.baseatk = atk;
  ozzy.baseregen = regen;
  ozzy.basedr = dr;
  ozzy.baseevade = evade;
  ozzy.baseeffect = effect;
  ozzy.basecharge = multistrike;
  ozzy.basechargeGain = multistrikePower;
  ozzy.basereload = aspd;
  
  // Talente setzen (EXAKT wie JS getTalents)
  ozzy.revival = revival;
  ozzy.trickster = trickster;
  ozzy.ua = ua;
  ozzy.thousandNeedles = thousandNeedles;
  ozzy.omen = omen;
  ozzy.ll = ll;
  ozzy.crippling = crippling;
  ozzy.echoBullets = echoBullets;
  ozzy.ultimaTalent = ultimaTalent;
  
  // Pfade setzen (EXAKT wie JS getPath)
  ozzy.lotl = lotl;
  ozzy.exo = exo;
  ozzy.scorp = scorp;
  ozzy.dod = dod;
  ozzy.cat = cat;
  ozzy.timeless = timeless;
  ozzy.wings = wings;
  ozzy.exterm = exterm;
  ozzy.medusa = medusa;
  ozzy.scarab = scarab;
  ozzy.vectid = vectid;
  ozzy.snek = snek;
  ozzy.cod = cod;
  ozzy.dwd = dwd;
  ozzy.sisters = sisters;
  
  // PrepOzzy (EXAKT WIE JS prepOzzy)
  ozzy.maxHp *= (1 + 0.02 * ozzy.lotl) * (1 + 0.01 * ozzy.ultimaTalent);
  ozzy.regen *= (1 + 0.02 * ozzy.lotl) * (1 + 0.01 * ozzy.ultimaTalent);
  ozzy.atk *= (1 + 0.012 * ozzy.exo) * (1 + 0.02 * ozzy.cat) * (1 + 0.01 * ozzy.ultimaTalent);
  ozzy.reload -= 0.06 * ozzy.thousandNeedles;
  ozzy.dr += 0.026 * ozzy.wings;
  ozzy.effect += 0.028 * ozzy.exterm;
  ozzy.evade += 0.005 * ozzy.wings;
  ozzy.lifesteal = 0.033 * ozzy.scorp;
  
  ozzy.reload *= (1 - 0.004 * ozzy.cat);
  
  ozzy.hp = ozzy.maxHp;
  
  // Simulation laufen lassen
  for (let i = 0; i < iters; i++) {
    ozzySim(ozzy, maxStage, attr, catchup99gu, reviveCd, special, iap > 0, ultima, scavengers, m0, r7, attrGN3 > 0, lootgu, i32_, i81, research81, cm46, cm47, cm48, cm51, gadgetLootMulti, card > 0, i33);
  }
  
  // lastOzzy für Export-Funktionen setzen
  lastOzzy = ozzy;
  
  // Ergebnis zurückgeben (Loot per minute)
  return ozzy.ls * 60;
}

// Zusätzliche Export-Funktionen für detaillierte Ergebnisse
let lastOzzy: Ozzy = new Ozzy();

export function getLastOzzyAvgStage(): f64 { 
  if (lastOzzy.iters === 0) return 0;
  return (lastOzzy.enem as f64) / (lastOzzy.iters as f64) / 10.0; 
}

export function getLastOzzyAvgTime(): f64 { 
  if (lastOzzy.iters === 0) return 0;
  return lastOzzy.time / (lastOzzy.iters as f64) / 60.0; 
}

export function getLastOzzyMinStage(): f64 { 
  return (lastOzzy.minEnem as f64) / 10.0; 
}

export function getLastOzzyMaxStage(): f64 { 
  return (lastOzzy.maxEnem as f64) / 10.0; 
}

export function getLastOzzyBossHpPercent(): f64 {
  if (lastOzzy.iters === 0) return 0;
  
  // Finde den ersten Boss, der nicht in allen Runs getötet wurde
  let bossStatsIdx = -1;
  for (let i = 0; i < 10; i++) {
    if (lastOzzy.bossStats[i].kills < lastOzzy.iters) {
      bossStatsIdx = i;
      break;
    }
  }
  
  if (bossStatsIdx === -1 || lastOzzy.maxEnem < (bossStatsIdx + 1) * 1000) {
    return 0; // Kein Boss erreicht oder alle Bosse getötet
  }
  
  // Boss HP Percentage berechnen (wie in JS)
  let bossMaxHp = OZZY_ENEMIES[(bossStatsIdx + 1) * 100].maxHp;
  return lastOzzy.bossStats[bossStatsIdx].hp / (lastOzzy.iters as f64) / bossMaxHp * 100;
}

export function getLastOzzyBossKillRate(): f64 {
  if (lastOzzy.iters === 0) return 0;
  
  // Finde den ersten Boss, der nicht in allen Runs getötet wurde
  let bossStatsIdx = -1;
  for (let i = 0; i < 10; i++) {
    if (lastOzzy.bossStats[i].kills < lastOzzy.iters) {
      bossStatsIdx = i;
      break;
    }
  }
  
  if (bossStatsIdx === -1 || lastOzzy.maxEnem < (bossStatsIdx + 1) * 1000) {
    return 0; // Kein Boss erreicht oder alle Bosse getötet
  }
  
  // Boss Kill Rate berechnen (wie in JS)
  return (lastOzzy.bossStats[bossStatsIdx].kills as f64) / (lastOzzy.iters as f64) * 100;
}

export function getLastOzzyMat1(): f64 { 
  if (lastOzzy.iters === 0) return 0;
  return lastOzzy.mat1 / (lastOzzy.iters as f64); 
}

export function getLastOzzyMat2(): f64 { 
  if (lastOzzy.iters === 0) return 0;
  return lastOzzy.mat2 / (lastOzzy.iters as f64); 
}

export function getLastOzzyMat3(): f64 { 
  if (lastOzzy.iters === 0) return 0;
  return lastOzzy.mat3 / (lastOzzy.iters as f64); 
}

export function getLastOzzyXp(): f64 { 
  if (lastOzzy.iters === 0) return 0;
  return lastOzzy.xp / (lastOzzy.iters as f64); 
}

// Numerische Stats-Exports
export function getLastOzzyMaxHp(): f64 {
  return lastOzzy.maxHp;
}

export function getLastOzzyAtk(): f64 {
  return lastOzzy.atk;
}

export function getLastOzzyRegen(): f64 {
  return lastOzzy.regen;
}

export function getLastOzzyDr(): f64 {
  return lastOzzy.dr;
}

export function getLastOzzyEvade(): f64 {
  return lastOzzy.evade;
}

export function getLastOzzyEffect(): f64 {
  return lastOzzy.effect;
}

export function getLastOzzyMultistrike(): f64 {
  return lastOzzy.multistrike;
}

export function getLastOzzyMultistrikePower(): f64 {
  return lastOzzy.multistrikePower;
}

export function getLastOzzyReload(): f64 {
  return lastOzzy.reload;
}

// Progress-Iterator-Funktionen
export function getOzzyProgressSize(): i32 {
  return lastOzzy.progress.size;
}

export function getOzzyProgressStageAt(index: i32): i32 {
  if (index >= lastOzzy.progress.size) return -1;
  let keys = lastOzzy.progress.keys();
  return keys[index];
}

export function getOzzyProgressCountAt(index: i32): i32 {
  if (index >= lastOzzy.progress.size) return 0;
  let keys = lastOzzy.progress.keys();
  let stage = keys[index];
  return lastOzzy.progress.get(stage);
}

// Death Tracking Export-Funktionen
export function getOzzyDeathsByStageAndReviveSize(): i32 {
  return lastOzzy.deathsByStageAndRevive.size;
}

export function getOzzyDeathKeyAt(index: i32): i32 {
  if (index >= lastOzzy.deathsByStageAndRevive.size) return -1;
  let keys = lastOzzy.deathsByStageAndRevive.keys();
  return keys[index]; // Gib numericKey zurück
}

export function getOzzyDeathCountAt(index: i32): i32 {
  if (index >= lastOzzy.deathsByStageAndRevive.size) return 0;
  let keys = lastOzzy.deathsByStageAndRevive.keys();
  let key = keys[index];
  return lastOzzy.deathsByStageAndRevive.get(key);
}

export function getOzzyDeathsByStageAndReviveString(): string {
  if (lastOzzy.deathsByStageAndRevive.size === 0) return "{}";
  
  let result = "{";
  let keys = lastOzzy.deathsByStageAndRevive.keys();
  
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) result += ",";
    let numericKey = keys[i];
    let count = lastOzzy.deathsByStageAndRevive.get(numericKey);
    
    // Konvertiere numericKey zurück zu "stage_revive" Format für JSON
    let stage = Math.floor(numericKey / 1000) as i32;
    let revive = numericKey % 1000;
    
    result += `"${stage}_${revive}":${count}`;
  }
  
  result += "}";
  return result;
}

// Am Ende der Datei:
export function getOzzyBossKillsByReviveSize(): i32 {
  let count = 0;
  for (let i = 0; i < 11; i++) {
    if (bossAttemptsByRevive[i] > 0) {
      count++;
    }
  }
  return count;
}

export function getOzzyBossRemainingReviveAt(index: i32): i32 {
  let count = 0;
  for (let remaining = 0; remaining < 11; remaining++) {
    if (bossAttemptsByRevive[remaining] > 0) {
      if (count === index) {
        return remaining;    // ← liefert jetzt korrekt 3, 2, 1
      }
      count++;
    }
  }
  return -1;
}

export function getOzzyBossAttemptCountAt(index: i32): i32 {
  let count = 0;
  for (let remaining = 0; remaining < 11; remaining++) {
    if (bossAttemptsByRevive[remaining] > 0) {
      if (count === index) {
        return bossAttemptsByRevive[remaining];
      }
      count++;
    }
  }
  return 0;
}

export function getOzzyBossKillCountAt(index: i32): i32 {
  let count = 0;
  for (let remaining = 0; remaining < 11; remaining++) {
    if (bossAttemptsByRevive[remaining] > 0) {
      if (count === index) {
        return bossKillsByRevive[remaining];
      }
      count++;
    }
  }
  return 0;
}

export function getLastOzzyMaxRevives(): i32 {
  return lastOzzy.maxRevives;
}