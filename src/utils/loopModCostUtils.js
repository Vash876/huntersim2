/**
 * Loop Mod Kosten-Berechnung
 * Implementierung für "Ultima LM: Rule of Consistency" und potentiell weitere
 */

import Decimal from 'break_infinity.js';

// Loop Mod Namen als Konstanten
export const LOOP_MODS = {
  RULE_OF_CONSISTENCY: "Ultima LM: Rule of Consistency",
  OUROBOROS_SHIP_EVOLUTION: "Ouroboros Ship Evolution",
  STELZI: "Stelzi"
};

/**
 * Basis-Kosten und Inkremente für jeden Loop Mod
 */
const LOOP_MOD_CONFIG = {
  [LOOP_MODS.RULE_OF_CONSISTENCY]: {
    baseExp: 5400,   // Basis-Exponent für Level 1: 1e5400
    incExp: 288      // Inkrementeller Exponent pro Level: +1e288
  },
  [LOOP_MODS.OUROBOROS_SHIP_EVOLUTION]: {
    // MP-basierte Kosten (lineare Lookup-Tabelle, da Level 2+ noch unbekannt)
    baseCost: 10624,  // Level 1 kostet 10624 MP
    increment: 0      // Wird später angepasst wenn Level 2 bekannt ist
  },
  [LOOP_MODS.STELZI]: {
    baseCost: 3400,  // Basis-Kosten für Level 1: 3400
    increment: 600   // Increment pro Level: +600
  }
};

/**
 * Lookup-Tabelle für exakte Kosten (nur für Stelzi)
 * Format: [mod_name][level] = kostenstring
 */
const LOOP_MOD_COST_LOOKUP = {
  [LOOP_MODS.OUROBOROS_SHIP_EVOLUTION]: {
    1: 10624,
    // Level 2+ Kosten noch unbekannt - hier hinzufügen wenn bekannt
  },
  [LOOP_MODS.STELZI]: {
    1: 3400,
    2: 4000,
    3: 4600,
    4: 5200,
    5: 5800,
    6: 6400,
    7: 7000,
    8: 7600,
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

  // Wenn exakter Wert in der Lookup-Tabelle vorhanden ist (nur für Stelzi)
  if (LOOP_MOD_COST_LOOKUP[modName] && LOOP_MOD_COST_LOOKUP[modName][level]) {
    return new Decimal(LOOP_MOD_COST_LOOKUP[modName][level]);
  }
  
  // Sonst berechnen nach Formel
  const config = LOOP_MOD_CONFIG[modName];
  
  if (modName === LOOP_MODS.STELZI) {
    // Stelzi: Lineare Kostensteigerung
    // Level 1: 3400, Level 2: 4000 (+600), Level 3: 4600 (+600), etc.
    const cost = config.baseCost + (level - 1) * config.increment;
    return new Decimal(cost);
  } else if (modName === LOOP_MODS.OUROBOROS_SHIP_EVOLUTION) {
    // Ouroboros Ship Evolution: MP-basiert
    // Für jetzt nur Level 1 bekannt, weitere Levels verwenden Lookup oder Formel
    const cost = config.baseCost + (level - 1) * config.increment;
    return new Decimal(cost);
  } else {
    // Rule of Consistency: Exponential
    const exponent = config.baseExp + (level - 1) * config.incExp;
    return new Decimal("1e" + exponent);
  }
}

/**
 * Berechnet nur den Exponenten für Rule of Consistency
 * @param {number} level - Level des Loop Mods
 * @returns {number} - Der Exponent
 */
export function getRuleOfConsistencyExponent(level) {
  if (level <= 0) return 0;
  const config = LOOP_MOD_CONFIG[LOOP_MODS.RULE_OF_CONSISTENCY];
  // Level 1: baseExp (5400)
  // Level 2: baseExp + incExp (5400 + 288 = 5688)
  // Level 3: baseExp + 2*incExp (5400 + 576 = 5976)
  // Formel: baseExp + (level - 1) * incExp
  return config.baseExp + (level - 1) * config.incExp;
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
  
  // Für Stelzi können wir normale Numbers verwenden
  if (modName === LOOP_MODS.STELZI) {
    return decimalCost.toNumber();
  }
  
  // Für Rule of Consistency ist es zu groß für JavaScript-Number
  return Infinity;
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
    if (value === Infinity) return "∞";
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    }
    return value.toLocaleString();
  }
  
  if (value instanceof Decimal) {
    if (value.eq(0)) return "0";
    
    // Für Stelzi normale Zahlenformatierung
    if (value.lt(1e6)) {
      return value.toNumber().toLocaleString();
    }
    
    // Für große Zahlen wissenschaftliche Notation
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

/**
 * Berechnet das maximale Level basierend auf verfügbarer MP
 * @param {string} modName - Name des Loop Mods
 * @param {number} availableMP - Verfügbare MP
 * @returns {number} - Maximales kaufbares Level (0 wenn keines kaufbar)
 */
export function getMaxLevelFromMP(modName, availableMP) {
  if (!availableMP || availableMP <= 0) return 0;
  if (!LOOP_MOD_CONFIG[modName]) return 0;
  
  // Für Rule of Consistency: MP ist der Exponent (z.B. 5400 für 1e5400)
  if (modName === LOOP_MODS.RULE_OF_CONSISTENCY) {
    const config = LOOP_MOD_CONFIG[modName];
    // Formel: exponent = baseExp + (level - 1) * incExp
    // Umgestellt: level = (exponent - baseExp) / incExp + 1
    if (availableMP < config.baseExp) return 0;
    const level = Math.floor((availableMP - config.baseExp) / config.incExp + 1);
    return Math.max(0, level);
  }
  
  // Für Ouroboros Ship Evolution: MP ist die direkte Währung
  if (modName === LOOP_MODS.OUROBOROS_SHIP_EVOLUTION) {
    const lookup = LOOP_MOD_COST_LOOKUP[modName];
    let maxLevel = 0;
    
    // Durchsuche Lookup-Tabelle nach höchstem kaufbaren Level
    for (const [level, cost] of Object.entries(lookup)) {
      if (availableMP >= cost) {
        maxLevel = Math.max(maxLevel, parseInt(level));
      }
    }
    
    return maxLevel;
  }
  
  // Für andere Mods (Stelzi etc.): Lineare Berechnung
  const config = LOOP_MOD_CONFIG[modName];
  if (config.increment === 0) {
    // Nur Level 1 möglich wenn genug MP
    return availableMP >= config.baseCost ? 1 : 0;
  }
  
  // Formel: cost = baseCost + (level - 1) * increment
  // Umgestellt: level = (cost - baseCost) / increment + 1
  if (availableMP < config.baseCost) return 0;
  const level = Math.floor((availableMP - config.baseCost) / config.increment + 1);
  return Math.max(0, level);
}

/**
 * Gibt die MP-Kosten für ein bestimmtes Level zurück
 * @param {string} modName - Name des Loop Mods
 * @param {number} level - Das Level
 * @returns {number} - MP-Kosten (oder Exponent für Rule of Consistency)
 */
export function getMPCostForLevel(modName, level) {
  if (level <= 0) return 0;
  
  // Für Rule of Consistency: Gib den Exponenten zurück
  if (modName === LOOP_MODS.RULE_OF_CONSISTENCY) {
    return getRuleOfConsistencyExponent(level);
  }
  
  // Für andere: Gib die direkten MP-Kosten zurück
  const decimalCost = getLoopModCostDecimal(modName, level);
  return decimalCost.toNumber();
}

// Export der Hilfsfunktionen
export {
  Decimal,
  getLoopModCostDecimal,
  calculateLoopModCostRangeDecimal
};