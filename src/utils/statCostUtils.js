// Gemeinsame Basisfunktionen für die Kostenberechnung
// Borge-Formeln sind implementiert, Ozzy und Knox zunächst als Platzhalter

/**
 * Berechnung der HP-Kosten
 */
function calcHP(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const minValueKnox = Math.min(exp, 110);
      return Math.ceil(1 * Math.pow(1.054 + 0.00027 * minValueKnox, exp));
    case 'ozzy':
      // Ozzy-spezifische Formel
      const minValueOzzy = Math.min(exp, 130);
      return Math.ceil(2 * Math.pow(1.061 + 0.000285 * minValueOzzy, exp));
    case 'borge':
    default:
      const minValue = Math.min(exp, 130);
      return Math.ceil(Math.pow(1.061 + 0.00028 * minValue, exp));
  }
}

/**
 * Berechnung der ATK-Kosten
 */
function calcATK(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const minValueKnox = Math.min(exp, 100);
      return Math.ceil(2 * Math.pow(1.068 + 0.00027 * minValueKnox, exp));
    case 'ozzy':
      // Ozzy-spezifische Formel
      const minValueOzzy = Math.min(exp, 120);
      return Math.ceil(3 * Math.pow(1.076 + 0.000285 * minValueOzzy, exp));
    case 'borge':
    default:
      const minValue = Math.min(exp, 120);
      return Math.ceil(3 * Math.pow(1.082 + 0.00028 * minValue, exp));
  }
}

/**
 * Berechnung der HP Regen-Kosten
 */
function calcRegen(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const minValueKnox = Math.min(exp, 70);
      return Math.ceil(4 * Math.pow(1.09 + 0.00027 * minValueKnox, exp));
    case 'ozzy':
      // Ozzy-spezifische Formel
      const minValueOzzy = Math.min(exp, 80);
      return Math.ceil(5 * Math.pow(1.11 + 0.000285 * minValueOzzy, exp));
    case 'borge':
    default:
      const minValue = Math.min(exp, 65);
      return Math.ceil(6 * Math.pow(1.143 + 0.000278 * minValue, exp));
  }
}

/**
 * Berechnung der DMG Reduction-Kosten
 */
function calcDR(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const ceiledInnerKnox = Math.ceil(2 * Math.pow(exp * 0.008 + 1.12, exp));
      return Math.ceil(ceiledInnerKnox * 0.9 * 
        Math.pow(1.2, Math.max(exp - 9, 0)) * 
        Math.pow(1.5, Math.max(exp - 19, 0)) * 
        Math.pow(2, Math.max(exp - 29, 0)) * 
        Math.pow(3, Math.max(exp - 34, 0)) * 
        Math.pow(4, Math.max(exp - 39, 0)) * 
        Math.pow(5, Math.max(exp - 44, 0)));
    case 'ozzy':
      // Ozzy-spezifische Formel
      if (level <= 50) {
        // Formel für Level bis 50
        const ceiledInnerOzzy = Math.ceil(3 * Math.pow(exp * 0.008 + 1.2, exp));
        const factorOzzy1 = Math.pow(2, Math.max(exp - 49, 0));
        const factorOzzy2 = Math.pow(3, Math.max(exp - 51, 0));
        const factorOzzy3 = Math.pow(4, Math.max(exp - 53, 0));
        const factorOzzy4 = Math.pow(5, Math.max(exp - 55, 0));
        const factorOzzy5 = Math.pow(6, Math.max(exp - 57, 0));
        return Math.ceil(ceiledInnerOzzy * factorOzzy1 * factorOzzy2 * factorOzzy3 * factorOzzy4 * factorOzzy5);
      } else {
        // Neue Formel für Level über 50
        // f(x) = (1.04857 × 10^(-55))*(1.987)^x
        return Math.ceil(2.5 * Math.pow(2, exp));
      }
    case 'borge':
    default:
      const ceiledInner = Math.ceil(5 * Math.pow(exp * 0.024 + 1.17, exp));
      const factor1 = Math.pow(3, Math.max(exp - 34, 0));
      const factor2 = Math.pow(4, Math.max(exp - 35, 0));
      const factor3 = Math.pow(6, Math.max(exp - 36, 0));
      const factor4 = Math.pow(8, Math.max(exp - 37, 0));
      const factor5 = Math.pow(100, Math.max(exp - 38, 0));
      return Math.ceil(ceiledInner * factor1 * factor2 * factor3 * factor4 * factor5);
  }
}

/**
 * Berechnung der Evade-Kosten
 */
function calcEvade(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const ceiledInnerKnox = Math.ceil(3 * Math.pow(exp * 0.028 + 1.18, exp));
      return Math.ceil(ceiledInnerKnox * 0.9 * 
        Math.pow(1.2, Math.max(exp - 9, 0)) * 
        Math.pow(1.5, Math.max(exp - 19, 0)) * 
        Math.pow(2, Math.max(exp - 29, 0)) * 
        Math.pow(3, Math.max(exp - 34, 0)) * 
        Math.pow(4, Math.max(exp - 39, 0)) * 
        Math.pow(5, Math.max(exp - 44, 0)));
    case 'ozzy':
      // Ozzy-spezifische Formel
      const ceiledInnerOzzy = Math.ceil(5 * Math.pow(exp * 0.028 + 1.3, exp));
      const factorOzzy1 = Math.pow(2, Math.max(exp - 34, 0));
      const factorOzzy2 = Math.pow(3, Math.max(exp - 35, 0));
      const factorOzzy3 = Math.pow(4, Math.max(exp - 36, 0));
      const factorOzzy4 = Math.pow(5, Math.max(exp - 37, 0));
      const factorOzzy5 = Math.pow(10, Math.max(exp - 38, 0));
      return Math.ceil(ceiledInnerOzzy * factorOzzy1 * factorOzzy2 * factorOzzy3 * factorOzzy4 * factorOzzy5);
    case 'borge':
    default:
      const ceiledInner = Math.ceil(Math.pow(exp * 0.015 + 1.23, exp));
      const factor1 = Math.pow(1.5, Math.max(exp - 39, 0));
      const factor2 = Math.pow(2, Math.max(exp - 41, 0));
      const factor3 = Math.pow(2.5, Math.max(exp - 43, 0));
      const factor4 = Math.pow(3, Math.max(exp - 45, 0));
      const factor5 = Math.pow(10, Math.max(exp - 47, 0));
      return Math.ceil(ceiledInner * factor1 * factor2 * factor3 * factor4 * factor5) * 10;
  }
}

/**
 * Berechnung der Effect Chance-Kosten
 */
function calcEffect(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const ceiledInnerKnox = Math.ceil(50 * Math.pow(exp * 0.018 + 1.2, exp));
      return Math.ceil(ceiledInnerKnox * 0.9 * 
        Math.pow(1.2, Math.max(exp - 9, 0)) * 
        Math.pow(1.5, Math.max(exp - 19, 0)) * 
        Math.pow(2, Math.max(exp - 29, 0)) * 
        Math.pow(3, Math.max(exp - 34, 0)) * 
        Math.pow(4, Math.max(exp - 39, 0)) * 
        Math.pow(5, Math.max(exp - 44, 0)));
    case 'ozzy':
      // Ozzy-spezifische Formel
      const ceiledInnerOzzy = Math.ceil(7 * Math.pow(exp * 0.018 + 1.22, exp));
      const factorOzzy1 = Math.pow(1.5, Math.max(exp - 39, 0));
      const factorOzzy2 = Math.pow(2, Math.max(exp - 41, 0));
      const factorOzzy3 = Math.pow(2.5, Math.max(exp - 43, 0));
      const factorOzzy4 = Math.pow(3, Math.max(exp - 45, 0));
      const factorOzzy5 = Math.pow(10, Math.max(exp - 47, 0));
      return Math.ceil(ceiledInnerOzzy * factorOzzy1 * factorOzzy2 * factorOzzy3 * factorOzzy4 * factorOzzy5);
    case 'borge':
    default:
      const ceiledInner = Math.ceil(3 * Math.pow(exp * 0.0095 + 1.32, exp));
      const factor1 = Math.pow(1.5, Math.max(exp - 39, 0));
      const factor2 = Math.pow(2, Math.max(exp - 41, 0));
      const factor3 = Math.pow(2.5, Math.max(exp - 43, 0));
      const factor4 = Math.pow(3, Math.max(exp - 45, 0));
      const factor5 = Math.pow(10, Math.max(exp - 47, 0));
      return Math.ceil(ceiledInner * factor1 * factor2 * factor3 * factor4 * factor5) * 10;
  }
}

/**
 * Berechnung der Crit Chance-Kosten
 */
function calcCritChance(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const ceiledInnerKnox = Math.ceil(1 * Math.pow(exp * 0.016 + 1.18, exp));
      return Math.ceil(ceiledInnerKnox * 0.9 * 
        Math.pow(1.05, Math.max(exp - 9, 0)) * 
        Math.pow(1.05, Math.max(exp - 19, 0)) * 
        Math.pow(1.2, Math.max(exp - 29, 0)) * 
        Math.pow(1.3, Math.max(exp - 39, 0)) * 
        Math.pow(1.4, Math.max(exp - 49, 0)) * 
        Math.pow(1.5, Math.max(exp - 59, 0)));
    case 'ozzy':
      // Ozzy-spezifische Formel
      const ceiledInnerOzzy = Math.ceil(1 * Math.pow(exp * 0.016 + 1.18, exp));
      const factorOzzy1 = Math.pow(1.05, Math.max(exp - 59, 0));
      const factorOzzy2 = Math.pow(1.2, Math.max(exp - 69, 0));
      const factorOzzy3 = Math.pow(1.3, Math.max(exp - 79, 0));
      const factorOzzy4 = Math.pow(1.4, Math.max(exp - 89, 0));
      return Math.ceil(ceiledInnerOzzy * factorOzzy1 * factorOzzy2 * factorOzzy3 * factorOzzy4) * 10;
    case 'borge':
    default:
      const ceiledInner = Math.ceil(5 * Math.pow(exp * 0.004 + 1.19, exp));
      const factor1 = Math.pow(1.05, Math.max(exp - 59, 0));
      const factor2 = Math.pow(1.2, Math.max(exp - 69, 0));
      const factor3 = Math.pow(1.3, Math.max(exp - 79, 0));
      const factor4 = Math.pow(1.4, Math.max(exp - 89, 0));
      return Math.ceil(ceiledInner * factor1 * factor2 * factor3 * factor4);
  }
}

/**
 * Berechnung der Crit Power-Kosten
 */
function calcCritPower(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const ceiledInnerKnox = Math.ceil(1 * Math.pow(exp * 0.025 + 1.35, exp));
      return Math.ceil(ceiledInnerKnox * 0.9 * 
        Math.pow(1.05, Math.max(exp - 9, 0)) * 
        Math.pow(1.05, Math.max(exp - 19, 0)) * 
        Math.pow(1.2, Math.max(exp - 29, 0)) * 
        Math.pow(1.3, Math.max(exp - 39, 0)) * 
        Math.pow(1.4, Math.max(exp - 49, 0)) * 
        Math.pow(1.5, Math.max(exp - 59, 0)));
    case 'ozzy':
      // Ozzy-spezifische Formel
      const ceiledInnerOzzy = Math.ceil(1.1 * Math.pow(exp * 0.025 + 1.4, exp));
      const factorOzzy1 = Math.pow(1.1, Math.max(exp - 59, 0));
      const factorOzzy2 = Math.pow(1.2, Math.max(exp - 69, 0));
      const factorOzzy3 = Math.pow(1.3, Math.max(exp - 79, 0));
      const factorOzzy4 = Math.pow(1.4, Math.max(exp - 89, 0));
      return Math.ceil(ceiledInnerOzzy * factorOzzy1 * factorOzzy2 * factorOzzy3 * factorOzzy4) * 10;
    case 'borge':
    default:
      const ceiledInner = Math.ceil(8 * Math.pow(exp * 0.004 + 1.22, exp));
      const factor1 = Math.pow(1.05, Math.max(exp - 59, 0));
      const factor2 = Math.pow(1.2, Math.max(exp - 69, 0));
      const factor3 = Math.pow(1.3, Math.max(exp - 79, 0));
      const factor4 = Math.pow(1.4, Math.max(exp - 89, 0));
      return Math.ceil(ceiledInner * factor1 * factor2 * factor3 * factor4);
  }
}

/**
 * Berechnung der ATK Speed-Kosten
 */
function calcATKSpeed(level, hunterType) {
  const exp = level - 1;
  
  switch (hunterType) {
    case 'knox':
      // Knox-spezifische Formel
      const ceiledInnerKnox = Math.ceil(2 * Math.pow(exp * 0.035 + 1.24, exp));
      return Math.ceil(ceiledInnerKnox * 0.9 * 
        Math.pow(1.02, Math.max(exp - 9, 0)) * 
        Math.pow(1.05, Math.max(exp - 19, 0)) * 
        Math.pow(1.2, Math.max(exp - 29, 0)) * 
        Math.pow(1.3, Math.max(exp - 39, 0)) * 
        Math.pow(1.4, Math.max(exp - 49, 0)) * 
        Math.pow(1.5, Math.max(exp - 59, 0)) *
        Math.pow(1.6, Math.max(exp - 69, 0)) *
        Math.pow(1.7, Math.max(exp - 79, 0)) *
        Math.pow(1.8, Math.max(exp - 89, 0)));
    case 'ozzy':
      // Ozzy-spezifische Formel
      const ceiledInnerOzzy = Math.ceil(1.2 * Math.pow(exp * 0.035 + 1.24, exp));
      const factorOzzy1 = Math.pow(1.06, Math.max(exp - 39, 0));
      const factorOzzy2 = Math.pow(1.07, Math.max(exp - 49, 0));
      const factorOzzy3 = Math.pow(1.08, Math.max(exp - 59, 0));
      const factorOzzy4 = Math.pow(1.1, Math.max(exp - 69, 0));
      return Math.ceil(ceiledInnerOzzy * factorOzzy1 * factorOzzy2 * factorOzzy3 * factorOzzy4) * 10;
    case 'borge':
    default:
      const ceiledInner = Math.ceil(Math.pow(exp * 0.032 + 1.21, exp));
      const factor1 = Math.pow(1.05, Math.max(exp - 39, 0));
      const factor2 = Math.pow(1.06, Math.max(exp - 49, 0));
      const factor3 = Math.pow(1.07, Math.max(exp - 59, 0));
      const factor4 = Math.pow(1.08, Math.max(exp - 69, 0));
      return Math.ceil(ceiledInner * factor1 * factor2 * factor3 * factor4 * 10);
  }
}



/**
 * Berechnet die Kosten für eine bestimmte Statistik
 * @param {string} statKey - Der Statistik-Schlüssel (hp, atk, etc.)
 * @param {number} level - Das aktuelle Level
 * @param {string} hunterType - Der Hunter-Typ ('borge', 'ozzy', 'knox')
 * @returns {number} - Die berechneten Kosten
 */
function calcCost(statKey, level, hunterType) {
  if (level <= 0) return 0;
  
  // HP ist universell
  if (statKey === 'hp') {
    return calcHP(level, hunterType);
  }
  
  // ATK und verwandte Stats
  else if (statKey === 'atk') {
    return calcATK(level, hunterType);
  }
  
  // Regeneration
  else if (statKey === 'regen') {
    return calcRegen(level, hunterType);
  }
  
  // Damage Reduction
  else if (statKey === 'dr') {
    return calcDR(level, hunterType);
  }
  
  // Evasion / Block
  else if (statKey === 'evade' || statKey === 'block') {
    return calcEvade(level, hunterType);
  }
  
  // Effect Chance
  else if (statKey === 'effect') {
    return calcEffect(level, hunterType);
  }
  
  // Critical/Multi/Charge Chance
  else if (statKey === 'critchance' || statKey === 'multichance' || statKey === 'charge') {
    return calcCritChance(level, hunterType);
  }
  
  // Critical/Multi/Charge Power
  else if (statKey === 'critpower' || statKey === 'multipower' || statKey === 'chargeGain') {
    return calcCritPower(level, hunterType);
  }
  
  // Attack/Reload Speed
  else if (statKey === 'atkspeed' || statKey === 'reload') {
    return calcATKSpeed(level, hunterType);
  }
  
  // Unbekannter Stat
  return 0;
}

/**
 * Berechnet den Kostenunterschied zwischen zwei Levels
 * @param {string} statKey - Der Statistik-Schlüssel (hp, atk, etc.)
 * @param {number} fromLevel - Das Ausgangslevel
 * @param {number} toLevel - Das Ziellevel
 * @param {string} hunterType - Der Hunter-Typ ('borge', 'ozzy', 'knox')
 * @returns {number} - Der Kostenunterschied (0 wenn toLevel <= fromLevel)
 */
function calcCostDifference(statKey, fromLevel, toLevel, hunterType) {
  if (toLevel <= fromLevel) return 0;
  
  let totalCost = 0;
  for (let i = fromLevel + 1; i <= toLevel; i++) {
    totalCost += calcCost(statKey, i, hunterType);
  }
  return totalCost;
}

/**
 * Formatiert einen Kostenwert in eine lesbare Zeichenkette
 * @param {number} value - Der zu formatierende Kostenwert
 * @returns {string} - Der formatierte Kostenwert
 */
function formatCost(value) {
  if (typeof value !== 'number' || isNaN(value) || value === 0) {
    return '0'
  }
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','oc','n','d']
  let tier = Math.floor(Math.log10(value) / 3)
  if (tier === 0) {
    return value.toFixed(2)
  }
  if (tier >= suffixes.length) {
    return value.toExponential(2)
  }
  const suffix = suffixes[tier]
  const scaledValue = value / Math.pow(10, tier * 3)
  return `${scaledValue.toFixed(2)}${suffix}`
}

export { calcCost, calcCostDifference, formatCost };