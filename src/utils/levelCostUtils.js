/**
 * Hilfsfunktionen zur Berechnung der Level-Kosten für alle Hunter
 */

/**
 * Konstanten für die Kostenformeln der Hunter
 * Dies ermöglicht einfache Anpassungen ohne Code-Änderungen
 */
const LEVEL_COST_CONSTANTS = {
  borge: {
    baseCost: 50,
    breakpointLevel: 49,  
    baseMultiplier: 1,
    highLevelMultiplier: 4,
    growthFactor: 1.6,
    highLevelGrowthFactor: 1.2
  },
  ozzy: {
    baseCost: 50,
    breakpointLevel: 49,
    baseMultiplier: 1,
    highLevelMultiplier: 4,
    growthFactor: 1.6,
    highLevelGrowthFactor: 1.22
  },
  knox: {
    baseCost: 50,
    breakpointLevel: 49,
    baseMultiplier: 1,
    highLevelMultiplier: 4,
    growthFactor: 1.6,
    highLevelGrowthFactor: 1.2
  }
};

/**
 * Generische Funktion zur Berechnung von Hunter-Level-Kosten
 * @param {number} level - Aktuelles Level
 * @param {Object} constants - Konstanten für die Berechnung
 * @returns {number} Berechnete Kosten für das Level
 */
function calculateHunterLevelCost(level, constants) {
  if (level <= 1) return 0;
  
  const levelIndex = level - 1;
  const multiplier = levelIndex > constants.breakpointLevel ? constants.highLevelMultiplier : constants.baseMultiplier;
  
  const value = constants.baseCost * 
                multiplier * 
                Math.pow(constants.growthFactor, levelIndex) * 
                Math.pow(constants.highLevelGrowthFactor, Math.max(levelIndex - constants.breakpointLevel, 0));
  
  return Math.floor(value);
}

/**
 * Berechnet die Kosten für ein bestimmtes Hunter-Level
 * @param {string} hunterType - Typ des Hunters (borge, ozzy, knox)
 * @param {number} level - Das Level
 * @returns {number} - Die berechneten Kosten
 */
function getHunterLevelCost(hunterType, level) {
  const constants = LEVEL_COST_CONSTANTS[hunterType.toLowerCase()];
  
  if (!constants) {
    console.error(`Unbekannter Hunter-Typ: ${hunterType}`);
    return 0;
  }
  
  return calculateHunterLevelCost(level, constants);
}

/**
 * Berechnet die Gesamtkosten für den Aufstieg von einem Level zu einem anderen
 * @param {string} hunterType - Typ des Hunters (borge, ozzy, knox)
 * @param {number} fromLevel - Ausgangslevel
 * @param {number} toLevel - Ziellevel
 * @returns {number} - Die Gesamtkosten
 */
function calcLevelCostDifference(hunterType, fromLevel, toLevel) {
  if (toLevel <= fromLevel) return 0;
  
  let totalCost = 0;
  for (let i = fromLevel + 1; i <= toLevel; i++) {
    totalCost += getHunterLevelCost(hunterType, i);
  }
  
  return totalCost;
}

/**
 * Formatiert einen Kostenwert in eine lesbare Zeichenkette mit Einheitssuffixen
 * @param {number} value - Der zu formatierende Kostenwert
 * @returns {string} - Der formatierte Kostenwert
 */
function formatLevelCost(value) {
  if (typeof value !== 'number' || isNaN(value) || value === 0) {
    return '0';
  }
  
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','oc','n','d'];
  let tier = Math.floor(Math.log10(value) / 3);
  
  if (tier === 0) {
    return value.toFixed(0);
  }
  
  if (tier >= suffixes.length) {
    return value.toExponential(2);
  }
  
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  return `${scaledValue.toFixed(2)}${suffix}`;
}

// Spezifische Hilfsfunktionen für direkten Zugriff
export function getBorgeLevelCost(level) {
  return getHunterLevelCost('borge', level);
}

export function getOzzyLevelCost(level) {
  return getHunterLevelCost('ozzy', level);
}

export function getKnoxLevelCost(level) {
  return getHunterLevelCost('knox', level);
}

// Hauptexporte
export { 
  getHunterLevelCost,
  calcLevelCostDifference,
  formatLevelCost,
  LEVEL_COST_CONSTANTS
};