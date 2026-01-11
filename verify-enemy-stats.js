/**
 * Enemy Stats Verification Script
 * Vergleicht die aktuelle Enemy-Implementierung mit den Dev-Werten
 * und testet das neue Scaling für Stages > 400
 */

// Dev-Daten aus dem Screenshot (Stage 390-500)
const devData = [
  { stage: 390, hp: 348634, atk: 61216.5, hpr: 347.78, dr: 6, effect: 4, evade: 1.2, critChance: 18.82, critPower: 2.5, atkSpd: 2.186 },
  { stage: 400, hp: 39237270, atk: 277859.5, hpr: 835.17, dr: 11, effect: 8, evade: 1.2, critChance: 23.22, critPower: 2.5, atkSpd: 5.14492 },
  { stage: 410, hp: 1548932, atk: 271931.98, hpr: 570.57, dr: 8, effect: 5.5, evade: 1.6, critChance: 19.62, critPower: 2.5, atkSpd: 2.066 },
  { stage: 420, hp: 1924673, atk: 337871.92, hpr: 709.11, dr: 8, effect: 5.5, evade: 1.6, critChance: 20.02, critPower: 2.5, atkSpd: 2.006 },
  { stage: 430, hp: 2383734, atk: 418428.78, hpr: 878.40, dr: 8, effect: 5.5, evade: 1.6, critChance: 20.42, critPower: 2.5, atkSpd: 1.946 },
  { stage: 440, hp: 2939812, atk: 516004.42, hpr: 1083.50, dr: 8, effect: 5.5, evade: 1.6, critChance: 20.82, critPower: 2.5, atkSpd: 1.886 },
  { stage: 450, hp: 3611345, atk: 633832.04, hpr: 1331.22, dr: 8, effect: 5.5, evade: 1.6, critChance: 21.22, critPower: 2.5, atkSpd: 1.826 },
  { stage: 460, hp: 4419985, atk: 775708.65, hpr: 1629.56, dr: 8, effect: 5.5, evade: 1.6, critChance: 21.62, critPower: 2.5, atkSpd: 1.766 },
  { stage: 470, hp: 5391126, atk: 946087.11, hpr: 1987.90, dr: 8, effect: 5.5, evade: 1.6, critChance: 22.02, critPower: 2.5, atkSpd: 1.706 },
  { stage: 480, hp: 6554509, atk: 1150182.22, hpr: 2417.22, dr: 8, effect: 5.5, evade: 1.6, critChance: 22.42, critPower: 2.5, atkSpd: 1.646 },
  { stage: 490, hp: 7944919, atk: 1394093.22, hpr: 2930.39, dr: 8, effect: 5.5, evade: 1.6, critChance: 22.82, critPower: 2.5, atkSpd: 1.586 },
  { stage: 500, hp: 864269227, atk: 6116350.29, hpr: 6801.46, dr: 13, effect: 9.5, evade: 1.6, critChance: 25, critPower: 2.5, atkSpd: 3.69292 }
];

// Multi-Funktion mit neuem Scaling ab Stage 400
function multi(enemyNum) {
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
    Math.max(0, (enemyNum - 389) * 0.007) +
    Math.max(0, (enemyNum - 400) * 0.005) +
    Math.max(0, (enemyNum - 410) * 0.005) +
    Math.max(0, (enemyNum - 420) * 0.005) +
    Math.max(0, (enemyNum - 430) * 0.004) +
    Math.max(0, (enemyNum - 440) * 0.004) +
    Math.max(0, (enemyNum - 450) * 0.004) +
    Math.max(0, (enemyNum - 460) * 0.004) +
    Math.max(0, (enemyNum - 470) * 0.004) +
    Math.max(0, (enemyNum - 480) * 0.004) +
    Math.max(0, (enemyNum - 490) * 0.004)
  ) * Math.pow(1.01, Math.max(0, enemyNum - 350));
}

// Enemy Stats Berechnung
function calculateEnemyStats(enemyNum) {
  const multiVal = multi(enemyNum);
  const floorDiv = Math.floor(Math.max(0, enemyNum - 1) / 100);
  const isBoss = enemyNum > 0 && enemyNum % 100 === 0;
  const is300 = enemyNum === 300;
  
  const maxHp = (9 + 4 * enemyNum) * multiVal * Math.pow(2.85, floorDiv) * (isBoss ? 90 : 1) * (is300 ? 0.9 : 1);
  const atk = (2.5 + 0.7 * enemyNum) * multiVal * Math.pow(2.85, floorDiv) * (isBoss ? 3.63 : 1) * (is300 ? 0.9 : 1);
  const regen = Math.max(0, 0.08 * Math.max(0, enemyNum - 1) * multiVal * Math.pow(1.052, floorDiv)) * (isBoss ? 1.92 : 1) * (is300 ? 0.9 : 1);
  
  const critRate = Math.min(0.25, 0.0322 + 0.0004 * enemyNum + (isBoss ? 0.04 : 0));
  const critDmg = Math.min(2.5, 1.212 + 0.008 * enemyNum + (isBoss ? 0.25 : 0));
  
  let dr;
  if (enemyNum >= 200) {
    dr = 1 - (Math.max(0, floorDiv - 2) * 0.02 + 0.04) - (isBoss ? 0.05 : 0);
  } else {
    dr = 1 - (isBoss ? 0.05 : 0);
  }
  
  let evade;
  if (enemyNum >= 100) {
    evade = 0.004 + 0.004 * Math.max(0, floorDiv - 1);
  } else {
    evade = 0;
  }
  
  let effect;
  if (enemyNum >= 401) {
    // Ab Stage 401: 5.5% für normale Enemies, 9.5% für Bosse (Dev-Update)
    effect = 0.055 + (isBoss ? 0.04 : 0);
  } else if (enemyNum >= 300) {
    effect = 0.04 + 0.01 * Math.max(0, floorDiv - 3) + (isBoss ? 0.04 : 0);
  } else {
    effect = 0;
  }
  
  const atkSpd = (4.526 - 0.006 * enemyNum) * (isBoss ? 2.42 : 1);
  
  return {
    hp: maxHp,
    atk: atk,
    hpr: regen,
    dr: (1 - dr) * 100, // Convert to percentage
    effect: effect * 100, // Convert to percentage
    evade: evade * 100, // Convert to percentage
    critChance: critRate * 100, // Convert to percentage
    critPower: critDmg,
    atkSpd: atkSpd
  };
}

// Vergleich mit Toleranz
function compareWithTolerance(calculated, dev, tolerance = 0.05) {
  const diff = Math.abs(calculated - dev);
  const percentDiff = (diff / dev) * 100;
  const isMatch = percentDiff <= tolerance * 100;
  
  return {
    calculated,
    dev,
    diff,
    percentDiff,
    isMatch
  };
}

// Hauptanalyse
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('ENEMY STATS VERIFICATION - Implementation vs Dev Data');
console.log('═══════════════════════════════════════════════════════════════════════\n');

let totalMatches = 0;
let totalTests = 0;

devData.forEach(dev => {
  const calc = calculateEnemyStats(dev.stage);
  
  console.log(`\n━━━ STAGE ${dev.stage} ${dev.stage % 100 === 0 ? '(BOSS)' : ''} ━━━`);
  
  const comparisons = [
    { name: 'HP', ...compareWithTolerance(calc.hp, dev.hp, 0.01) },
    { name: 'ATK', ...compareWithTolerance(calc.atk, dev.atk, 0.01) },
    { name: 'HPR', ...compareWithTolerance(calc.hpr, dev.hpr, 0.01) },
    { name: 'DR%', ...compareWithTolerance(calc.dr, dev.dr, 0.1) },
    { name: 'Effect%', ...compareWithTolerance(calc.effect, dev.effect, 0.1) },
    { name: 'Evade%', ...compareWithTolerance(calc.evade, dev.evade, 0.1) },
    { name: 'Crit%', ...compareWithTolerance(calc.critChance, dev.critChance, 0.01) },
    { name: 'CritPwr', ...compareWithTolerance(calc.critPower, dev.critPower, 0.01) },
    { name: 'AtkSpd', ...compareWithTolerance(calc.atkSpd, dev.atkSpd, 0.01) }
  ];
  
  comparisons.forEach(comp => {
    totalTests++;
    if (comp.isMatch) totalMatches++;
    
    const status = comp.isMatch ? '✓' : '✗';
    console.log(`${status} ${comp.name.padEnd(8)}: ${comp.calculated.toFixed(2).padStart(12)} | Dev: ${comp.dev.toFixed(2).padStart(12)} | Diff: ${comp.percentDiff.toFixed(2)}%`);
  });
});

console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log(`Results: ${totalMatches}/${totalTests} matches (${(totalMatches/totalTests*100).toFixed(1)}%)`);
console.log('═══════════════════════════════════════════════════════════════════════\n');

// Multi-Wert Vergleich
console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('Multi() Values:');
console.log('═══════════════════════════════════════════════════════════════════════\n');

[390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500].forEach(stage => {
  const val = multi(stage);
  console.log(`Stage ${stage}: ${val.toFixed(4)}`);
});

console.log('\n═══════════════════════════════════════════════════════════════════════\n');
