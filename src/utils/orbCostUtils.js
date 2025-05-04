/**
 * Gemeinsame Basisfunktionen für die Berechnung von Orb-bezogenen Upgradekosten
 */

/**
 * Borge Loot Kosten berechnen (Attraction Gem Node)
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateLootBorge(level) {
  const value = 5 * 
                Math.pow(2.5, level) * 
                Math.pow(1.2, Math.max(0, level - 9)) * 
                Math.pow(1.3, Math.max(0, level - 19)) * 
                Math.pow(1.4, Math.max(0, level - 29)) * 
                Math.pow(2, Math.max(0, level - 39));
  return Math.floor(value);
}

/**
 * Ozzy Loot Kosten berechnen (Attraction Gem Node)
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateLootOzzy(level) {
  const value = 20 * 
                Math.pow(2.5, level) * 
                Math.pow(1.3, Math.max(0, level - 9)) * 
                Math.pow(1.4, Math.max(0, level - 19)) * 
                Math.pow(1.5, Math.max(0, level - 29)) * 
                Math.pow(1.5, Math.max(0, level - 39));
  return Math.floor(value);
}

/**
 * Catch-Up Power Kosten berechnen (Attraction Gem Node)
 * @param {number} level - Das aktuelle Level
 * @returns {number} - Die berechneten Kosten
 */
function calculateCatchUp(level) {
  const value = 1 * Math.pow(100, level);
  return Math.floor(value);
}

/**
 * Berechnet die Kosten für einen bestimmten Orb-Upgrade-Typ basierend auf dem Level
 * @param {string} upgradeType - Typ des Upgrades (lootBorge, lootOzzy, catchUp)
 * @param {number} level - Das Level
 * @returns {number} - Die berechneten Kosten
 */
function getOrbCost(upgradeType, level) {
  if (level <= 0) return 0;
  
  switch (upgradeType) {
    case 'lootBorge':
      return calculateLootBorge(level);
    case 'lootOzzy':
      return calculateLootOzzy(level);
    case 'catchUp':
      return calculateCatchUp(level);
    default:
      console.error(`Unknown orb upgrade type: ${upgradeType}`);
      return 0;
  }
}

/**
 * Berechnet den Kostenunterschied zwischen zwei Levels eines Orb-Upgrades
 * @param {string} upgradeType - Typ des Upgrades (lootBorge, lootOzzy, catchUp)
 * @param {number} fromLevel - Das Ausgangslevel
 * @param {number} toLevel - Das Ziellevel
 * @returns {number} - Der Kostenunterschied (0 wenn toLevel <= fromLevel)
 */
function calcOrbCostDifference(upgradeType, fromLevel, toLevel) {
  if (toLevel <= fromLevel) return 0;
  
  let totalCost = 0;
  for (let i = fromLevel; i <= toLevel - 1; i++) {
    const cost = getOrbCost(upgradeType, i);
    totalCost += cost;
  }
  return totalCost;
}

/**
 * Formatiert einen Orb-Kostenwert in eine lesbare Zeichenkette
 * @param {number} value - Der zu formatierende Kostenwert
 * @returns {string} - Der formatierte Kostenwert
 */
function formatOrbCost(value) {
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

// Einzelexporte der spezifischen Funktionen für direkten Zugriff
export function getLootBorgeCost(lvl) {
  return getOrbCost('lootBorge', lvl);
}

export function getLootOzzyCost(lvl) {
  return getOrbCost('lootOzzy', lvl);
}

export function getCatchUpCost(lvl) {
  return getOrbCost('catchUp', lvl);
}

// Hauptexporte
export { getOrbCost, calcOrbCostDifference, formatOrbCost };