/**
 * Loop Mod Kosten-Berechnung
 * Implementierung für "Ultima LM: Rule of Consistency" und potentiell weitere
 */

import Decimal from 'break_infinity.js';

// Loop Mod Namen als Konstanten
export const LOOP_MODS = {
  RULE_OF_CONSISTENCY: "Ultima LM: Rule of Consistency"
};

/**
 * Basis-Kosten und Inkremente für jeden Loop Mod
 */
const LOOP_MOD_CONFIG = {
  [LOOP_MODS.RULE_OF_CONSISTENCY]: {
    baseExp: 5400,   // Basis-Exponent für Level 1: 1e5400
    incExp: 288      // Inkrementeller Exponent pro Level: +1e288
  }
};

/**
 * Lookup-Tabelle für exakte Kosten (optional, für präzisere Werte)
 * Format: [mod_name][level] = "kostenstring"
 */
const LOOP_MOD_COST_LOOKUP = {
  [LOOP_MODS.RULE_OF_CONSISTENCY]: {
    1: "1e5400",
    2: "1e5688",
    3: "1e5976",
    4: "1e6264",
    5: "1e6552",
    10: "1e8280",
    20: "1e11160",
    50: "1e19800",
    100: "1e34200"
    // Weitere Werte können bei Bedarf hinzugefügt werden
  }
};

/**
 * Berechnet die Kosten für ein bestimmtes Loop Mod-Level
 * @param {string} modName - Name des Loop Mods
 * @param {number} level - Level des Loop Mods
 * @returns {Decimal} - Die Kosten als Decimal-Objekt
 */
function getLoopModCostDecimal(modName, level) {
  if (level <= 0) return new Decimal(0);
  
  // Prüfen ob der Mod existiert
  if (!LOOP_MOD_CONFIG[modName]) {
    console.error(`Unbekannter Loop Mod: ${modName}`);
    return new Decimal(0);
  }

  // Wenn exakter Wert in der Lookup-Tabelle vorhanden ist
  if (LOOP_MOD_COST_LOOKUP[modName] && LOOP_MOD_COST_LOOKUP[modName][level]) {
    return new Decimal(LOOP_MOD_COST_LOOKUP[modName][level]);
  }
  
  // Sonst berechnen nach Formel
  const config = LOOP_MOD_CONFIG[modName];
  const exponent = config.baseExp + (level - 1) * config.incExp;
  
  // Erstelle Decimal mit wissenschaftlicher Notation
  return new Decimal("1e" + exponent);
}

/**
 * Berechnet die Kosten für einen Bereich von Loop Mod-Levels
 * @param {string} modName - Name des Loop Mods
 * @param {number} fromLevel - Startlevel
 * @param {number} toLevel - Ziellevel
 * @returns {Decimal} - Gesamtkosten als Decimal
 */
function calculateLoopModCostRangeDecimal(modName, fromLevel, toLevel) {
  if (toLevel <= fromLevel) return new Decimal(0);
  
  // Bei Loop Mods dominiert immer das höchste Level die Kosten
  // wegen der extremen Kostensteigerung
  return getLoopModCostDecimal(modName, toLevel);
}

/**
 * Hauptfunktion für Loop Mod-Kosten (kompatibel mit bestehendem System)
 * @param {string} modName - Name des Loop Mods
 * @param {number} level - Das Level
 * @returns {number} - Die Kosten als Number (Infinity für sehr große Zahlen)
 */
export function getLoopModCost(modName, level) {
  const decimalCost = getLoopModCostDecimal(modName, level);
  
  // Zu groß für JavaScript-Number
  return Infinity;  // Alle Werte sind zu groß für einen Number-Typ
}

/**
 * Sichere Bereichsberechnung mit Decimal
 * @param {string} modName - Name des Loop Mods
 * @param {number} fromLevel - Startlevel
 * @param {number} toLevel - Ziellevel
 * @returns {string} - Formatierte Gesamtkosten
 */
export function calculateLoopModCostRangeSafe(modName, fromLevel, toLevel) {
  if (toLevel <= fromLevel) return "0";
  
  // Bei Loop Mods dominieren die Kosten des höchsten Levels
  const cost = getLoopModCostDecimal(modName, toLevel);
  return formatLoopModCost(cost);
}

/**
 * Formatiert Loop Mod-Kosten
 * @param {number|Decimal|string} value - Der zu formatierende Wert
 * @returns {string} - Formatierte Kosten
 */
export function formatLoopModCost(value) {
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number') {
    return "∞";  // Alle Loop Mod-Kosten sind zu groß für Number
  }
  
  if (value instanceof Decimal) {
    if (value.eq(0)) return "0";
    
    // Für Loop Mods immer wissenschaftliche Notation
    return value.toExponential(2);
  }
  
  return "0";
}

/**
 * Prüft, ob ein Loop Mod-Level bezahlbar ist
 * @param {string} modName - Name des Loop Mods 
 * @param {number} level - Gewünschtes Level
 * @param {Decimal|string|number} currency - Verfügbare Währung
 * @returns {boolean} - True, wenn bezahlbar
 */
export function isLoopModAffordable(modName, level, currency) {
  const cost = getLoopModCostDecimal(modName, level);
  const currencyDecimal = currency instanceof Decimal ? currency : new Decimal(currency);
  return currencyDecimal.gte(cost);
}

/**
 * Gibt die maximale Anzahl von Loop Mod-Levels zurück, die mit einer bestimmten Währungsmenge kaufbar sind
 * @param {string} modName - Name des Loop Mods
 * @param {number} currentLevel - Aktuelles Level
 * @param {Decimal|string|number} currency - Verfügbare Währung  
 * @returns {number} - Maximales mögliches Level
 */
export function getMaxAffordableLoopModLevel(modName, currentLevel, currency) {
  if (!LOOP_MOD_CONFIG[modName]) return currentLevel;
  
  const currencyDecimal = currency instanceof Decimal ? currency : new Decimal(currency);
  if (currencyDecimal.eq(0)) return currentLevel;
  
  // Wenn die Währung kleiner als die Kosten für das nächste Level ist, kein Upgrade möglich
  if (currencyDecimal.lt(getLoopModCostDecimal(modName, currentLevel + 1))) {
    return currentLevel;
  }
  
  // Berechne das maximale Level basierend auf der Formel
  const config = LOOP_MOD_CONFIG[modName];
  const currencyExp = currencyDecimal.e; // Exponent der Währung
  
  // Löse nach level auf: currencyExp = baseExp + (level - 1) * incExp
  // level = (currencyExp - baseExp) / incExp + 1
  const maxLevel = Math.floor((currencyExp - config.baseExp) / config.incExp + 1);
  
  return Math.max(currentLevel, maxLevel);
}

// Export der Hilfsfunktionen
export {
  Decimal,
  getLoopModCostDecimal,
  calculateLoopModCostRangeDecimal
};