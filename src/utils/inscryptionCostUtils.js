/**
 * Gemeinsame Basisfunktionen für die Berechnung von Inscryption-Kosten
 */

/**
 * Berechnet die Kosten für Inscryption #60
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI32(level) {
  const startValue = 90000;
  const multi = 3;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #60
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI33(level) {
  const startValue = 91200;
  const multi = 5;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #60
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI60(level) {
  const startValue = 4000000000;
  const multi = 4;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #78
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI78(level) {
  const startValue = 10000000000000000;
  const multi = 8;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #80
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI80(level) {
  const startValue = 30000000000000000;
  const multi = 6;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #81
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI81(level) {
  const startValue = 40000000000000000;
  const multi = 6;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #84
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI84(level) {
  const startValue = 100000000000000000;
  const multi = 4;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #86
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI86(level) {
  const startValue = 300000000000000000;
  const multi = 3;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #87
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI87(level) {
  const startValue = 400000000000000000;
  const multi = 8;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #88
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI88(level) {
  const startValue = 500000000000000000;
  const multi = 3;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #89
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI89(level) {
  const startValue = 600000000000000000;
  const multi = 3;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #91
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI91(level) {
  const startValue = 2000000000000000000;
  const multi = 3;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #92
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI92(level) {
  const startValue = 3000000000000000000;
  const multi = 3;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für Inscryption #101
 * @param {number} level - Das aktuelle Level (1-basiert)
 * @returns {number} - Die Kosten für dieses Level
 */
function calculateI101(level) {
  const startValue = 100000000000000000000;
  const multi = 4;
  if (level <= 1) return startValue;
  return startValue * Math.pow(multi, level - 1);
}

/**
 * Berechnet die Kosten für eine bestimmte Inscryption basierend auf der ID und dem Level
 * @param {string} InscryptionId - ID der Inscryption (i80, i81, i84, i86, i87, i88, i89, i91, i92)
 * @param {number} level - Das Level (1-basiert)
 * @returns {number} - Die berechneten Kosten
 */
function getInscryptionCost(InscryptionId, level) {
  if (level <= 0) return 0;
  
  switch (InscryptionId) {
    case 'i32':
      return calculateI32(level);
    case 'i33':
      return calculateI33(level);
    case 'i60':
      return calculateI60(level);
    case 'i78':
      return calculateI78(level);
    case 'i80':
      return calculateI80(level);
    case 'i81':
      return calculateI81(level);
    case 'i84':
      return calculateI84(level);
    case 'i86':
      return calculateI86(level);
    case 'i87':
      return calculateI87(level);
    case 'i88':
      return calculateI88(level);
    case 'i89':
      return calculateI89(level);
    case 'i91':
      return calculateI91(level);
    case 'i92':
      return calculateI92(level);
    case 'i101':
      return calculateI101(level);
    default:
      console.error(`Unbekannte Inscryption ID: ${InscryptionId}`);
      return 0;
  }
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
  
  // Bei kleinen Zahlen normale Formatierung
  if (value < 1e6) {
    return value.toLocaleString();
  }
  
  // Bei mittleren Zahlen Kurznotation mit Suffix
  if (value < 1e15) {
    const suffixes = ['', 'k', 'm', 'b', 't'];
    const tier = Math.floor(Math.log10(value) / 3);
    const suffix = suffixes[tier];
    const scaled = value / Math.pow(10, tier * 3);
    return `${scaled.toFixed(2)}${suffix}`;
  }
  
  // Bei großen Zahlen wissenschaftliche Notation
  const exponent = Math.floor(Math.log10(value));
  const mantissa = value / Math.pow(10, exponent);
  return `${mantissa.toFixed(2)}e${exponent}`;
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

// Hauptexporte
export {
  getInscryptionCost,
  calcInscryptionCostDifference,
  formatInscryptionCost,
  calculateI32,
  calculateI33,
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
};