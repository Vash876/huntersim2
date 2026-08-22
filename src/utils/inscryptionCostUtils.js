/**
 * Gemeinsame Basisfunktionen für die Berechnung von Inscryption-Kosten
 */

/**
 * Konfigurationstabelle für alle Inscryption-Kosten
 * Jede Inscryption hat einen startValue und einen Multiplikator
 */
const INSCRYPTION_CONFIGS = {
  i11: { startValue: 7e1 , multiplier: 4 },
  i13: { startValue: 3.1e2, multiplier: 1.2419354838709677419354838709677 },
  i14: { startValue: 6e2, multiplier: 1.7 },
  i23: { startValue: 3.2e3, multiplier: 1.4 },
  i24: { startValue: 3.4e3, multiplier: 1.2 },
  i27: { startValue: 3.5e4, multiplier: 1.05 },
  i31: { startValue: 8.6e4, multiplier: 1.3 },
  i32: { startValue: 9e4, multiplier: 3 },
  i33: { startValue: 9.12e4, multiplier: 5 },
  i36: { startValue: 9.35e4, multiplier: 1.4 },
  i37: { startValue: 9.5e4, multiplier: 1.3 },
  i40: { startValue: 1e5, multiplier: 1.6 },
  i44: { startValue: 7.77e5, multiplier: 1.75 },
  i52: { startValue: 3e7, multiplier: 2.4 },
  i58: { startValue: 2e9, multiplier: 5 },
  i60: { startValue: 4e9, multiplier: 4 },
  i78: { startValue: 1e16, multiplier: 8 },
  i80: { startValue: 3e16, multiplier: 6 },
  i81: { startValue: 4e16, multiplier: 6 },
  i84: { startValue: 1e17, multiplier: 4 },
  i86: { startValue: 3e17, multiplier: 3 },
  i87: { startValue: 4e17, multiplier: 8 },
  i88: { startValue: 5e17, multiplier: 3 },
  i89: { startValue: 6e17, multiplier: 3 },
  i91: { startValue: 2e18, multiplier: 3 },
  i92: { startValue: 3e18, multiplier: 3 },
  i101: { startValue: 1e20, multiplier: 4 },
  i102: { startValue: 2e20, multiplier: 4 },
  i103: { startValue: 3e20, multiplier: 3 },
  i104: { startValue: 4e20, multiplier: 3 },
  i105: { startValue: 5e20, multiplier: 3 },
  i106: { startValue: 6e20, multiplier: 3 },
  i107: { startValue: 7e20, multiplier: 3 },
  i108: { startValue: 8e20, multiplier: 3 },
  i109: { startValue: 9e20, multiplier: 3 },
  i110: { startValue: 1e21, multiplier: 10 },
  i114: { startValue: 25e27, multiplier: 10 },
  i115: { startValue: 1e29, multiplier: 5 },
};

/**
 * Generische Funktion zur Berechnung von Inscryption-Kosten
 * @param {string} inscryptionId - Die ID der Inscryption (z.B. 'i32', 'i80')
 * @param {number} level - Das Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateInscryptionCost(inscryptionId, level) {
  const config = INSCRYPTION_CONFIGS[inscryptionId];
  if (!config) {
    console.error(`Unbekannte Inscryption ID: ${inscryptionId}`);
    return 0;
  }
  
  if (level <= 1) return config.startValue;
  return config.startValue * Math.pow(config.multiplier, level - 1);
}

/**
 * Wrapper-Funktionen für Abwärtskompatibilität
 * Diese verwenden die generische calculateInscryptionCost Funktion
 */


function calculateI32(level) {
  return calculateInscryptionCost('i32', level);
}

function calculateI33(level) {
  return calculateInscryptionCost('i33', level);
}

function calculateI52(level) {
  return calculateInscryptionCost('i52', level);
}

function calculateI60(level) {
  return calculateInscryptionCost('i60', level);
}

function calculateI78(level) {
  return calculateInscryptionCost('i78', level);
}

function calculateI80(level) {
  return calculateInscryptionCost('i80', level);
}

function calculateI81(level) {
  return calculateInscryptionCost('i81', level);
}

function calculateI84(level) {
  return calculateInscryptionCost('i84', level);
}

function calculateI86(level) {
  return calculateInscryptionCost('i86', level);
}

function calculateI87(level) {
  return calculateInscryptionCost('i87', level);
}

function calculateI88(level) {
  return calculateInscryptionCost('i88', level);
}

function calculateI89(level) {
  return calculateInscryptionCost('i89', level);
}

function calculateI91(level) {
  return calculateInscryptionCost('i91', level);
}

function calculateI92(level) {
  return calculateInscryptionCost('i92', level);
}

function calculateI101(level) {
  return calculateInscryptionCost('i101', level);
}

function calculateI103(level) {
  return calculateInscryptionCost('i103', level);
}

function calculateI104(level) {
  return calculateInscryptionCost('i104', level);
}

function calculateI105(level) {
  return calculateInscryptionCost('i105', level);
}



/**
 * Berechnet die Kosten für eine bestimmte Inscryption basierend auf der ID und dem Level
 * @param {string} InscryptionId - ID der Inscryption 
 * @param {number} level - Das Level (1-basiert)
 * @returns {number} - Die berechneten Kosten
 */
function getInscryptionCost(InscryptionId, level) {
  if (level <= 0) return 0;
  
  // Verwendet die generische Funktion basierend auf der Konfiguration
  return calculateInscryptionCost(InscryptionId, level);
}

/**
 * Berechnet den Kostenunterschied zwischen zwei Levels einer inscryption
 * @param {string} InscryptionId - ID der Inscryption (i80, i81, etc.)
 * @param {number} fromLevel - Das Ausgangslevel
 * @param {number} toLevel - Das Ziellevel
 * @returns {number} - Der Kostenunterschied (0 wenn toLevel <= fromLevel)
 */
function calcInscryptionCostDifference(InscryptionId, fromLevel, toLevel) {
  if (toLevel <= fromLevel) return 0;
  
  let totalCost = 0;
  for (let i = fromLevel + 1; i <= toLevel; i++) {
    totalCost += getInscryptionCost(InscryptionId, i);
  }
  return totalCost;
}

/**
 * Formatiert einen Kostenwert in eine wissenschaftliche Notation
 * @param {number} value - Der zu formatierende Kostenwert
 * @returns {string} - Der formatierte Kostenwert
 */
function formatInscryptionCost(value) {
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

// Einzelexporte der spezifischen Inscryption-Funktionen

export function getI32Cost(level) {
  return getInscryptionCost('i32', level);
}

export function getI33Cost(level) {
  return getInscryptionCost('i33', level);
}

export function getI60Cost(level) {
  return getInscryptionCost('i60', level);
}

export function getI78Cost(level) {
  return getInscryptionCost('i78', level);
}

export function getI80Cost(level) {
  return getInscryptionCost('i80', level);
}

export function getI81Cost(level) {
  return getInscryptionCost('i81', level);
}

export function getI84Cost(level) {
  return getInscryptionCost('i84', level);
}

export function getI86Cost(level) {
  return getInscryptionCost('i86', level);
}

export function getI87Cost(level) {
  return getInscryptionCost('i87', level);
}

export function getI88Cost(level) {
  return getInscryptionCost('i88', level);
}

export function getI89Cost(level) {
  return getInscryptionCost('i89', level);
}

export function getI91Cost(level) {
  return getInscryptionCost('i91', level);
}

export function getI92Cost(level) {
  return getInscryptionCost('i92', level);
}

export function getI101Cost(level) {
  return getInscryptionCost('i101', level);
}

export function getI103Cost(level) {
  return getInscryptionCost('i103', level);
}

export function getI104Cost(level) {
  return getInscryptionCost('i104', level);
}

export function getI105Cost(level) {
  return getInscryptionCost('i105', level);
}

/**
 * Berechnet die Kosten für das nächste Level einer Inscryption
 * @param {string} inscryptionId - ID der Inscryption (i80, i81, etc.)
 * @param {number} currentLevel - Das aktuelle Level
 * @returns {number|null} - Die Kosten für das nächste Level oder null wenn kein Upgrade möglich
 */
function getNextLevelCost(inscryptionId, currentLevel) {
  const nextLevel = currentLevel + 1;
  
  // Prüfe ob es eine unterstützte Inscryption ist (basierend auf INSCRYPTION_CONFIGS)
  if (!INSCRYPTION_CONFIGS[inscryptionId]) {
    return null;
  }
  
  return getInscryptionCost(inscryptionId, nextLevel);
}

// Hauptexporte
export {
  INSCRYPTION_CONFIGS,
  getInscryptionCost,
  calcInscryptionCostDifference,
  formatInscryptionCost,
  getNextLevelCost,
  calculateI32,
  calculateI33,
  calculateI52,
  calculateI60,
  calculateI78,
  calculateI80,
  calculateI81,
  calculateI84,
  calculateI86,
  calculateI87,
  calculateI88,
  calculateI89,
  calculateI91,
  calculateI92,
  calculateI101,
  calculateI103,
  calculateI104,
  calculateI105
};