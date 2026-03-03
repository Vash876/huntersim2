/**
 * Gemeinsame Basisfunktionen für die Berechnung von Relics-Kosten
 */

// Tier 1 Relic IDs
const TIER_1_RELIC_IDS = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15', 'r16', 'r17', 'r18', 'r19', 'r20'];

/**
 * Berechnet den Max-Level-Bonus für Tier 1 Relics
 * Gibt +5 zurück wenn Exodus GN3 aktiv ist, sonst 0
 * @param {boolean} exodusNode3Active - Ob Exodus Gem Node 3 aktiv ist
 * @returns {number} - Der Bonus auf das Max-Level (+5 wenn aktiv, sonst 0)
 */
export function getTier1RelicMaxLevelBonus(exodusNode3Active = false) {
  return exodusNode3Active ? 5 : 0;
}

/**
 * Prüft ob ein Relic ein Tier 1 Relic ist
 * @param {string} relicId - Die Relic ID (z.B. 'r4', 'r7', etc.)
 * @returns {boolean} - True wenn Tier 1 Relic
 */
export function isTier1Relic(relicId) {
  return TIER_1_RELIC_IDS.includes(relicId);
}

/**
 * Berechnet das effektive Max-Level für ein Relic unter Berücksichtigung des Exodus GN3 Bonus
 * @param {string} relicId - Die Relic ID (z.B. 'r4', 'r7', etc.)
 * @param {number} baseMaxLevel - Das Basis Max-Level des Relics
 * @param {boolean} exodusNode3Active - Ob Exodus Gem Node 3 aktiv ist
 * @returns {number} - Das effektive Max-Level
 */
export function getEffectiveRelicMaxLevel(relicId, baseMaxLevel, exodusNode3Active = false) {
  if (!isTier1Relic(relicId)) {
    return baseMaxLevel;
  }
  return baseMaxLevel + getTier1RelicMaxLevelBonus(exodusNode3Active);
}

/**
 * Relic 4 Kosten berechnen
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateRelic4(level) {
  const E2 = 0.8, E3 = 0.4, E4 = 1.12;
  const value = (E2 + E3 * (level - 1)) *
                Math.pow(E4, level - 1) *
                Math.pow(1.02, Math.max(0, level - 10)) *
                Math.pow(1.015, Math.max(0, level - 20));
  return level < 10 ? value : Math.floor(value);
}

/**
 * Relic 7 Kosten berechnen
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateRelic7(level) {
  const H2 = 2, H3 = 1.8, H4 = 1.14;
  const value = (H2 + H3 * (level - 1)) *
                Math.pow(H4, level - 1) *
                Math.pow(1.01, Math.max(0, level - 10)) *
                Math.pow(1.02, Math.max(0, level - 20));
  return Math.floor(value);
}

/**
 * Relic 9 Kosten berechnen
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateRelic9(level) {
  const J2 = 8, J3 = 1.8, J4 = 1.18;
  const value = (J2 + J3 * (level - 1)) *
                Math.pow(J4, level - 1) *
                Math.pow(1.03, Math.max(0, level - 10)) *
                Math.pow(1.08, Math.max(0, level - 20));
  return Math.floor(value);
}

/**
 * Relic 16 Kosten berechnen
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateRelic16(level) {
  const Q2 = 40, Q3 = 5, Q4 = 1.08;
  const value = (Q2 + Q3 * (level - 1)) *
                Math.pow(Q4, level - 1) *
                Math.pow(1.028, Math.max(0, level - 10));
  return Math.floor(value);
}

/**
 * Relic 17 Kosten berechnen
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateRelic17(level) {
  const R2 = 50, R3 = 6, R4 = 1.1;
  const value = (R2 + R3 * (level - 1)) *
                Math.pow(R4, level - 1) *
                Math.pow(1.037, Math.max(0, level - 10));
  return Math.floor(value);
}

/**
 * Relic 19 Kosten berechnen
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateRelic19(level) {
  const T2 = 666, T3 = 111, T4 = 1.66;
  const value = (T2 + T3 * (level - 1)) *
                Math.pow(T4, level - 1);
  return Math.floor(value);
}

/**
 * T2 Relic 5 Kosten berechnen (Multi-threshold every 5 levels)
 * @param {number} level - Das aktuelle Level (1-indexed)
 * @returns {number} - Die berechneten Kosten
 */
function calculateT2Relic5(level) {
  const baseCost = 1300000, additive = 300000, exp0 = 1.35;
  const iterativeExp = 1.04, iterativeN = 5;
  
  // Convert to 0-indexed for formula
  const lvl = level - 1;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  // Calculate total iterations: for each threshold 0, 5, 10, ... <= lvl
  let totalIterations = 0;
  for (let i = 0; i * iterativeN <= lvl; i++) {
    totalIterations += lvl - (iterativeN * i - 1);
  }
  cost *= Math.pow(iterativeExp, totalIterations);
  
  return Math.floor(cost);
}

/**
 * T2 Relic 4 Kosten berechnen (Multi-threshold every 4 levels)
 * @param {number} level - Das aktuelle Level (1-indexed)
 * @returns {number} - Die berechneten Kosten
 */
function calculateT2Relic4(level) {
  const baseCost = 3000000, additive = 50000, exp0 = 1.2;
  const iterativeExp = 1.08, iterativeN = 4;
  
  // Convert to 0-indexed for formula
  const lvl = level - 1;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  // Calculate total iterations: for each threshold 0, 4, 8, ... <= lvl
  let totalIterations = 0;
  for (let i = 0; i * iterativeN <= lvl; i++) {
    totalIterations += lvl - (iterativeN * i - 1);
  }
  cost *= Math.pow(iterativeExp, totalIterations);
  
  return Math.floor(cost);
}

/**
 * T2 Relic 7 Kosten berechnen (Single threshold at level 8)
 * @param {number} level - Das aktuelle Level (1-indexed)
 * @returns {number} - Die berechneten Kosten
 */
function calculateT2Relic7(level) {
  const baseCost = 300000, additive = 850000, exp0 = 1.71;
  const iterativeExp = 1.09, iterativeThreshold = 8;
  
  // Convert to 0-indexed for formula
  const lvl = level - 1;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  // Apply iterative multiplier if lvl >= threshold
  if (lvl >= iterativeThreshold) {
    cost *= Math.pow(iterativeExp, lvl - iterativeThreshold + 1);
  }
  
  return Math.floor(cost);
}

/**
 * T2 Relic 8 Kosten berechnen (Multi-threshold every 4 levels)
 * @param {number} level - Das aktuelle Level (1-indexed)
 * @returns {number} - Die berechneten Kosten
 */
function calculateT2Relic8(level) {
  const baseCost = 2100000, additive = 840000, exp0 = 1.42;
  const iterativeExp = 1.21, iterativeN = 4;
  
  // Convert to 0-indexed for formula
  const lvl = level - 1;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  // Calculate total iterations: for each threshold 0, 4, 8, ... <= lvl
  let totalIterations = 0;
  for (let i = 0; i * iterativeN <= lvl; i++) {
    totalIterations += lvl - (iterativeN * i - 1);
  }
  cost *= Math.pow(iterativeExp, totalIterations);
  
  return Math.floor(cost);
}

/**
 * T2 Relic 10 Kosten berechnen (Single threshold at level 1 with 21x multiplier)
 * @param {number} level - Das aktuelle Level (1-indexed)
 * @returns {number} - Die berechneten Kosten
 */
function calculateT2Relic10(level) {
  const baseCost = 6000000, additive = 80000, exp0 = 15;
  const iterativeExp = 21, iterativeThreshold = 1;
  
  // Convert to 0-indexed for formula
  const lvl = level - 1;
  
  let cost = (baseCost + additive * lvl) * Math.pow(exp0, lvl);
  
  // Apply iterative multiplier if lvl >= threshold
  if (lvl >= iterativeThreshold) {
    cost *= Math.pow(iterativeExp, lvl - iterativeThreshold + 1);
  }
  
  return Math.floor(cost);
}

/**
 * Berechnet die Kosten für ein bestimmtes Relic basierend auf dem Typ und Level
 * @param {string} relicType - Typ des Relics (relic04, relic07, etc.)
 * @param {number} level - Das Level
 * @returns {number|string} - Die berechneten Kosten
 */
function getRelicCost(relicType, level) {
  if (level <= 0) return 0;
  
  switch (relicType) {
    case 'relic04':
    case 'r4':
      return calculateRelic4(level);
    case 'relic07':
    case 'r7':
      return calculateRelic7(level);
    case 'relic09':
    case 'r9':
      return calculateRelic9(level);
    case 'relic16':
    case 'r16':
      return calculateRelic16(level);
    case 'relic17':
    case 'r17':
      return calculateRelic17(level);
    case 'relic19':
    case 'r19':
      return calculateRelic19(level);
    case 't2r5':
      return calculateT2Relic5(level);
    case 't2r7':
      return calculateT2Relic7(level);
    case 't2r4':
      return calculateT2Relic4(level);
    case 't2r8':
      return calculateT2Relic8(level);
    case 't2r10':
      return calculateT2Relic10(level);
    default:
      console.error(`Unknown relic type: ${relicType}`);
      return 0;
  }
}

/**
 * Berechnet den Kostenunterschied zwischen zwei Levels eines Relics
 * @param {string} relicType - Typ des Relics (relic04, relic07, etc.)
 * @param {number} fromLevel - Das Ausgangslevel
 * @param {number} toLevel - Das Ziellevel
 * @returns {number} - Der Kostenunterschied (0 wenn toLevel <= fromLevel)
 */
function calcRelicCostDifference(relicType, fromLevel, toLevel) {
  if (toLevel <= fromLevel) return 0;
  
  let totalCost = 0;
  for (let i = fromLevel + 1; i <= toLevel; i++) {
    const cost = getRelicCost(relicType, i);
    totalCost += cost;
  }
  return totalCost;
}

/**
 * Formatiert einen Kostenwert in eine lesbare Zeichenkette
 * @param {number|string} value - Der zu formatierende Kostenwert
 * @returns {string} - Der formatierte Kostenwert
 */
function formatRelicCost(value) {
  if (typeof value !== 'number' || isNaN(value) || value === 0) {
    return '0';
  }
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','oc','n','d'];
  let tier = Math.floor(Math.log10(value) / 3);
  if (tier === 0) {
    return value.toFixed(2);
  }
  if (tier >= suffixes.length) {
    return value.toExponential(2);
  }
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  return `${scaledValue.toFixed(2)}${suffix}`;
}

// Einzelexporte der spezifischen Relic-Funktionen für Abwärtskompatibilität
export function getRelic4Cost(lvl) {
  return getRelicCost('r4', lvl);
}

export function getRelic7Cost(lvl) {
  return getRelicCost('r7', lvl);
}

export function getRelic9Cost(lvl) {
  return getRelicCost('r9', lvl);
}

export function getRelic16Cost(lvl) {
  return getRelicCost('r16', lvl);
}

export function getRelic17Cost(lvl) {
  return getRelicCost('r17', lvl);
}

export function getRelic19Cost(lvl) {
  return getRelicCost('r19', lvl);
}

// Hauptexporte
export { getRelicCost, calcRelicCostDifference, formatRelicCost };