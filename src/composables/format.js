/**
 * Formatiert eine Zahl in eine lesbare Form mit Suffixen (k, m, b, etc.)
 * 
 * @param {number} value - Die zu formatierende Zahl
 * @returns {string} - Die formatierte Zahl als String
 */
export function formatNumber(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  // Sonderbehandlung für Werte sehr nahe bei Null
  if (Math.abs(value) < 0.01) {
    return value.toExponential(2);
  }
  
  // Behandlung für kleine Werte zwischen 0.01 und 1
  if (Math.abs(value) < 1) {
    return value.toFixed(2);
  }
  
  const absValue = Math.abs(value);
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','oc','n','d'];
  
  // Berechne die Größenordnung korrekt
  let tier = Math.max(0, Math.min(Math.floor(Math.log10(absValue) / 3), suffixes.length - 1));
  
  // Für Werte < 1000, zeige ohne Suffix
  if (tier === 0) {
    // Verwende weniger Dezimalstellen für größere Zahlen
    if (absValue >= 100) {
      return value.toFixed(0);
    } else if (absValue >= 10) {
      return value.toFixed(1);
    } else {
      return value.toFixed(2);
    }
  }
  
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  
  // Formatiere die skalierte Zahl mit 2 Dezimalstellen + Suffix
  return `${scaledValue.toFixed(2)}${suffix}`;
}

/**
 * Formatiert einen Multiplikator-Wert für die Anzeige
 * 
 * @param {number} value - Der Multiplikatorwert
 * @returns {string|null} - Der formatierte Wert als String oder null (wenn = 1)
 */
export function formatMultiplier(value) {
  if (typeof value !== 'number') return value;
  if (value === 1) return null; // kein Multiplikator bei 1
  
  // Für Multiplikatoren verwenden wir das ×-Symbol und den formatierten Wert
  return `×${formatNumber(value)}`;
}

/**
 * Formatiert eine Wachstumsrate (z.B. "+10%")
 * 
 * @param {number} value - Der zu formatierende Wert (z.B. 0.1 für 10%)
 * @param {boolean} includeSign - Ob das Vorzeichen (+/-) angezeigt werden soll
 * @returns {string} - Der formatierte Wert als String
 */
export function formatGrowth(value, includeSign = true) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  // Formatieren als Prozentsatz
  const percentage = value * 100;
  const sign = includeSign && percentage > 0 ? '+' : '';
  
  if (Math.abs(percentage) >= 100) {
    return `${sign}${formatNumber(percentage)}%`;
  } else {
    return `${sign}${percentage.toFixed(1)}%`;
  }
}

/**
 * Formatiert einen Zeitraum in Stunden zu einer lesbaren Zeit
 * 
 * @param {number} hours - Die Anzahl der Stunden
 * @returns {string} - Der formatierte Zeitraum
 */
export function formatTimespan(hours) {
  if (typeof hours !== 'number' || isNaN(hours) || hours < 0) {
    return '0h';
  }
  
  if (hours < 24) {
    // Weniger als ein Tag
    return `${hours}h`;
  } else {
    // Tage und Stunden
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (remainingHours === 0) {
      return `${days}d`;
    } else {
      return `${days}d ${remainingHours}h`;
    }
  }
}