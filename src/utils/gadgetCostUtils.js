/**
 * Gemeinsame Basisfunktionen für die Berechnung von Gadget-Kosten
 */

/**
 * G1 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M2 * N2^B2 * O2^ROUNDDOWN(B2/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG1(level) {
  const M2 = 1;
  const N2 = 1.025;
  const O2 = 1.15;
  const exponent = Math.floor((level-1) / 10);
  const value = M2 * Math.pow(N2, level-1) * Math.pow(O2, exponent);
  return Math.ceil(value);
}

/**
 * G2 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M3 * N3^B3 * O3^ROUNDDOWN(B3/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG2(level) {
  const M3 = 1;
  const N3 = 1.025;
  const O3 = 1.15;
  const exponent = Math.floor((level-1) / 10);
  const value = M3 * Math.pow(N3, level-1) * Math.pow(O3, exponent);
  return Math.ceil(value);
}

/**
 * G3 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M4 * N4^B4 * O4^ROUNDDOWN(B4/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG3(level) {
  const M4 = 1;
  const N4 = 1.025;
  const O4 = 1.15;
  const exponent = Math.floor((level-1) / 10);
  const value = M4 * Math.pow(N4, level-1) * Math.pow(O4, exponent);
  return Math.ceil(value);
}

/**
 * G4 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M5 * N5^B5 * O5^ROUNDDOWN(B5/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG4(level) {
  const M5 = 2;
  const N5 = 1.14;
  const O5 = 1.6;
  const exponent = Math.floor((level-1) / 10);
  const value = M5 * Math.pow(N5, level-1) * Math.pow(O5, exponent);
  return Math.ceil(value);
}

/**
 * Wrench Kosten berechnen (G5)
 * Excel-Formel: =ROUNDUP(M6 * N6^B6 * O6^ROUNDDOWN(B6/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateWrench(level) {
  const M6 = 3;
  const N6 = 1.1;
  const O6 = 1.35;
  // ROUNDDOWN(B6/10) entspricht Math.floor(level/10)
  const exponent = Math.floor((level-1) / 10);
  const value = M6 * Math.pow(N6, level-1) * Math.pow(O6, exponent);
  return Math.ceil(value);
}

/**
 * Zaptron Kosten berechnen (G6)
 * Excel-Formel: =ROUNDUP(M7 * N7^B7 * O7^ROUNDDOWN(B7/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateZaptron(level) {
  const M7 = 4;
  const N7 = 1.1;
  const O7 = 1.35;
  const exponent = Math.floor((level-1) / 10);
  const value = M7 * Math.pow(N7, level-1) * Math.pow(O7, exponent);
  return Math.ceil(value);
}

/**
 * G7 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M8 * N8^B8 * O8^ROUNDDOWN(B8/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG7(level) {
  const M8 = 5;
  const N8 = 1.04;
  const O8 = 1.15;
  const exponent = Math.floor((level-1) / 10);
  const value = M8 * Math.pow(N8, level-1) * Math.pow(O8, exponent);
  return Math.ceil(value);
}

/**
 * G8 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M9 * N9^B9 * O9^ROUNDDOWN(B9/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG8(level) {
  const M9 = 6;
  const N9 = 1.1;
  const O9 = 1.35;
  const exponent = Math.floor((level-1) / 10);
  const value = M9 * Math.pow(N9, level-1) * Math.pow(O9, exponent);
  return Math.ceil(value);
}

/**
 * G9 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M10 * N10^B10 * O10^ROUNDDOWN(B10/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG9(level) {
  const M10 = 7;
  const N10 = 1.08;
  const O10 = 1.25;
  const exponent = Math.floor((level-1) / 10);
  const value = M10 * Math.pow(N10, level-1) * Math.pow(O10, exponent);
  return Math.ceil(value);
}

/**
 * G10 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M11 * N11^B11 * O11^ROUNDDOWN(B11/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG10(level) {
  const M11 = 400;
  const N11 = 1.1;
  const O11 = 1.25;
  const exponent = Math.floor((level-1) / 10);
  const value = M11 * Math.pow(N11, level-1) * Math.pow(O11, exponent);
  return Math.ceil(value);
}

/**
 * G11 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M12 * N12^B12 * O12^ROUNDDOWN(B12/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG11(level) {
  const M12 = 1000;
  const N12 = 1.07;
  const O12 = 1.23;
  const exponent = Math.floor((level-1) / 10);
  const value = M12 * Math.pow(N12, level-1) * Math.pow(O12, exponent);
  return Math.ceil(value);
}

/**
 * G12 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M13 * N13^B13 * O13^ROUNDDOWN(B13/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG12(level) {
  const M13 = 60000;
  const N13 = 1.3;
  const O13 = 1.8;
  const exponent = Math.floor((level-1) / 10);
  const value = M13 * Math.pow(N13, level-1) * Math.pow(O13, exponent);
  return Math.ceil(value);
}

/**
 * G13 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M14 * N14^B14 * O14^ROUNDDOWN(B14/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG13(level) {
  const M14 = 60000;
  const N14 = 1.1;
  const O14 = 1.28;
  const exponent = Math.floor((level-1) / 10);
  const value = M14 * Math.pow(N14, level-1) * Math.pow(O14, exponent);
  return Math.ceil(value);
}

/**
 * G14 Kosten berechnen
 * Excel-Formel: =ROUNDUP(M15 * N15^B15 * O15^ROUNDDOWN(B15/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateG14(level) {
  const M15 = 60000;
  const N15 = 1.12;
  const O15 = 1.38;
  const exponent = Math.floor((level-1) / 10);
  const value = M15 * Math.pow(N15, level-1) * Math.pow(O15, exponent);
  return Math.ceil(value);
}

/**
 * Anchor Kosten berechnen (G15)
 * Excel-Formel: =ROUNDUP(M16 * N16^B16 * O16^ROUNDDOWN(B16/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateAnchor(level) {
  const M16 = 60000;
  const N16 = 1.1;
  const O16 = 1.35;
  const exponent = Math.floor((level-1) / 10);
  const value = M16 * Math.pow(N16, level-1) * Math.pow(O16, exponent);
  return Math.ceil(value);
}

/**
 * Berechnet die Kosten für ein bestimmtes Gadget basierend auf dem Typ und Level
 * @param {string} gadgetType - Typ des Gadgets (g1, g2, g3, g4, wrench, zaptron, g7, g8, g9, g10, g11, g12, g13, g14, anchor)
 * @param {number} level - Das Level
 * @returns {number} - Die berechneten Kosten
 */
function getGadgetCost(gadgetType, level) {
  if (level <= 0) return 0;
  
  switch (gadgetType) {
    case 'g1':
      return calculateG1(level);
    case 'g2':
      return calculateG2(level);
    case 'g3':
      return calculateG3(level);
    case 'oogadget':
    case 'g4':
      return calculateG4(level);
    case 'wrench':
    case 'g5':
      return calculateWrench(level);
    case 'zaptron':
    case 'g6':
      return calculateZaptron(level);
    case 'g7':
      return calculateG7(level);
    case 'g8':
      return calculateG8(level);
    case 'g9':
      return calculateG9(level);
    case 'g10':
      return calculateG10(level);
    case 'g11':
      return calculateG11(level);
    case 'g12':
      return calculateG12(level);
    case 'g13':
      return calculateG13(level);
    case 'campfragdet':
    case 'g14':
      return calculateG14(level);
    case 'anchor':
    case 'g15':
      return calculateAnchor(level);
    default:
      console.error(`Unknown gadget type: ${gadgetType}`);
      return 0;
  }
}

/**
 * Berechnet den Kostenunterschied zwischen zwei Levels eines Gadgets
 * @param {string} gadgetType - Typ des Gadgets (g1, g2, g3, etc.)
 * @param {number} fromLevel - Das Ausgangslevel
 * @param {number} toLevel - Das Ziellevel
 * @returns {number} - Der Kostenunterschied (0 wenn toLevel <= fromLevel)
 */
function calcGadgetCostDifference(gadgetType, fromLevel, toLevel) {
  if (toLevel <= fromLevel) return 0;
  
  let totalCost = 0;
  for (let i = fromLevel + 1; i <= toLevel; i++) {
    totalCost += getGadgetCost(gadgetType, i);
  }
  return totalCost;
}

/**
 * Formatiert einen Kostenwert in eine lesbare Zeichenkette
 * @param {number} value - Der zu formatierende Kostenwert
 * @returns {string} - Der formatierte Kostenwert
 */
function formatGadgetCost(value) {
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

// Einzelexporte der spezifischen Gadget-Funktionen für Abwärtskompatibilität
export function getWrenchCost(level) {
  return getGadgetCost('wrench', level);
}

export function getZaptronCost(level) {
  return getGadgetCost('zaptron', level);
}

export function getAnchorCost(level) {
  return getGadgetCost('anchor', level);
}

export function getG1Cost(level) {
  return getGadgetCost('g1', level);
}

export function getG2Cost(level) {
  return getGadgetCost('g2', level);
}

export function getG3Cost(level) {
  return getGadgetCost('g3', level);
}

export function getG4Cost(level) {
  return getGadgetCost('g4', level);
}

export function getG7Cost(level) {
  return getGadgetCost('g7', level);
}

export function getG8Cost(level) {
  return getGadgetCost('g8', level);
}

export function getG9Cost(level) {
  return getGadgetCost('g9', level);
}

export function getG10Cost(level) {
  return getGadgetCost('g10', level);
}

export function getG11Cost(level) {
  return getGadgetCost('g11', level);
}

export function getG12Cost(level) {
  return getGadgetCost('g12', level);
}

export function getG13Cost(level) {
  return getGadgetCost('g13', level);
}

export function getG14Cost(level) {
  return getGadgetCost('g14', level);
}

// Hauptexporte
export { 
  getGadgetCost, 
  calcGadgetCostDifference, 
  formatGadgetCost,
  calculateG1,
  calculateG2,
  calculateG3,
  calculateG4,
  calculateWrench,
  calculateZaptron,
  calculateG7,
  calculateG8,
  calculateG9,
  calculateG10,
  calculateG11,
  calculateG12,
  calculateG13,
  calculateG14,
  calculateAnchor
};