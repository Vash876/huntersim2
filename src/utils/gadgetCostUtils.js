/**
 * Gemeinsame Basisfunktionen für die Berechnung von Gadget-Kosten
 */

/**
 * Wrench Kosten berechnen
 * Excel-Formel: =ROUNDUP(M6 * N6^B6 * O6^ROUNDDOWN(B6/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateWrench(level) {
  const M6 = 3;
  const N6 = 1.1;
  const O6 = 1.35;
  // ROUNDDOWN(B6/10) entspricht Math.floor(level/10)
  const exponent = Math.floor(level / 10);
  const value = M6 * Math.pow(N6, level-1) * Math.pow(O6, exponent);
  return Math.ceil(value);
}

/**
 * Zaptron Kosten berechnen
 * Excel-Formel: =ROUNDUP(M7 * N7^B7 * O7^ROUNDDOWN(B7/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateZaptron(level) {
  const M7 = 4;
  const N7 = 1.1;
  const O7 = 1.35;
  const exponent = Math.floor(level / 10);
  const value = M7 * Math.pow(N7, level-1) * Math.pow(O7, exponent);
  return Math.ceil(value);
}

/**
 * Anchor Kosten berechnen
 * Excel-Formel: =ROUNDUP(M16 * N16^B16 * O16^ROUNDDOWN(B16/10))
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateAnchor(level) {
  const M16 = 60000;
  const N16 = 1.1;
  const O16 = 1.35;
  const exponent = Math.floor(level / 10);
  const value = M16 * Math.pow(N16, level-1) * Math.pow(O16, exponent);
  return Math.ceil(value);
}

/**
 * Berechnet die Kosten für ein bestimmtes Gadget basierend auf dem Typ und Level
 * @param {string} gadgetType - Typ des Gadgets (wrench, zaptron, anchor, etc.)
 * @param {number} level - Das Level
 * @returns {number} - Die berechneten Kosten
 */
function getGadgetCost(gadgetType, level) {
  if (level <= 0) return 0;
  
  switch (gadgetType) {
    case 'wrench':
      return calculateWrench(level);
    case 'zaptron':
      return calculateZaptron(level);
    case 'anchor':
      return calculateAnchor(level);
    default:
      console.error(`Unknown gadget type: ${gadgetType}`);
      return 0;
  }
}

/**
 * Berechnet den Kostenunterschied zwischen zwei Levels eines Gadgets
 * @param {string} gadgetType - Typ des Gadgets (wrench, zaptron, anchor, etc.)
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

// Hauptexporte
export { getGadgetCost, calcGadgetCostDifference, formatGadgetCost };