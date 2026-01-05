/**
 * Formatiert eine Zahl in eine lesbare Form mit Suffixen (k, m, b, etc.)
 * 
 * @param {number} value - Die zu formatierende Zahl
 * @param {number} decimals - Anzahl der Nachkommastellen (Standard: 2)
 * @returns {string} - Die formatierte Zahl als String
 */
export function formatNumber(value, decimals = 2) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  // Sonderbehandlung für Werte sehr nahe bei Null
  if (Math.abs(value) < 0.01) {
    return '0';
  }
  
  // Behandlung für kleine Werte zwischen 0.01 und 1
  if (Math.abs(value) < 1) {
    return value.toFixed(decimals);
  }
  
  const absValue = Math.abs(value);
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','o','n','d'];
  
  // Berechne die Größenordnung korrekt
  let tier = Math.max(0, Math.min(Math.floor(Math.log10(absValue) / 3), suffixes.length - 1));
  
  // Ab 1e36 (größer als "d" = 1e33) verwende wissenschaftliche Notation
  if (absValue >= 1e36) {
    const exponent = Math.floor(Math.log10(absValue));
    const mantissa = value / Math.pow(10, exponent);
    return `${mantissa.toFixed(decimals)}e${exponent}`;
  }
  
  // Für Werte < 1000, zeige ohne Suffix
  if (tier === 0) {
    return value.toFixed(decimals);
  }
  
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  
  // Formatiere die skalierte Zahl mit gewünschten Dezimalstellen + Suffix
  return `${scaledValue.toFixed(decimals)}${suffix}`;
}

/**
 * Formatiert eine Decimal-Zahl in eine lesbare Form mit Suffixen (k, m, b, etc.)
 * Speziell für break_infinity.js Decimal-Objekte
 * 
 * @param {Decimal} value - Die zu formatierende Decimal-Zahl
 * @returns {string} - Die formatierte Zahl als String
 */
export function formatNumberDecimal(value) {
  // Check if value is a Decimal-like object with mantissa/exponent
  if (value && typeof value === 'object' && 
      value.mantissa !== undefined && value.exponent !== undefined) {
    // Handle our custom Decimal-like objects
    const realValue = value.mantissa * Math.pow(10, value.exponent);
    
    // Sonderbehandlung für Werte sehr nahe bei Null
    if (Math.abs(realValue) < 0.01) {
      return '0';
    }
    
    // Behandlung für kleine Werte zwischen 0.01 und 1
    if (Math.abs(realValue) < 1) {
      return realValue.toFixed(2);
    }
    
    const suffixes = ['','k','m','b','t','qa','qu','sx','sp','o','n','d'];
    
    // Berechne die Größenordnung korrekt
    const log10Value = Math.log10(Math.abs(realValue));
    let tier = Math.max(0, Math.min(Math.floor(log10Value / 3), suffixes.length - 1));
    
    // Ab 1e36 (größer als "d" = 1e33) verwende wissenschaftliche Notation
    if (Math.abs(realValue) >= 1e36) {
      // Use scientific notation directly from mantissa/exponent
      return `${value.mantissa.toFixed(2)}e${value.exponent}`;
    }
    
    // Für Werte < 1000, zeige ohne Suffix - immer 2 Dezimalstellen
    if (tier === 0) {
      return realValue.toFixed(2);
    }
    
    const suffix = suffixes[tier];
    const scaledValue = realValue / Math.pow(10, tier * 3);
    
    // Formatiere die skalierte Zahl mit 2 Dezimalstellen + Suffix
    return `${scaledValue.toFixed(2)}${suffix}`;
  }
  
  // Check if value is a Decimal instance
  if (value && typeof value.abs === 'function') {
    // Sonderbehandlung für Werte sehr nahe bei Null
    if (value.abs().lt(0.01)) {
      return '0';
    }
    
    // Behandlung für kleine Werte zwischen 0.01 und 1
    if (value.abs().lt(1)) {
      return value.toFixed(2);
    }
    
    const suffixes = ['','k','m','b','t','qa','qu','sx','sp','o','n','d'];
    
    // Berechne die Größenordnung korrekt mit Decimal
    const log10Value = value.abs().log10();
    let tier = Math.max(0, Math.min(Math.floor(log10Value / 3), suffixes.length - 1));
    
    // Ab 1e36 (größer als "d" = 1e33) verwende wissenschaftliche Notation
    if (value.abs().gte('1e36')) {
      // Remove the + sign from positive exponents
      return value.toExponential(2).replace('e+', 'e');
    }
    
    // Für Werte < 1000, zeige ohne Suffix - immer 2 Dezimalstellen
    if (tier === 0) {
      return value.toFixed(2);
    }
    
    const suffix = suffixes[tier];
    // Create divisor using Decimal constructor
    const Decimal = value.constructor; // Get the Decimal constructor from the value instance
    const divisor = new Decimal(10).pow(tier * 3);
    const scaledValue = value.div(divisor);
    
    // Formatiere die skalierte Zahl mit 2 Dezimalstellen + Suffix
    return `${scaledValue.toFixed(2)}${suffix}`;
  }
  
  // Fallback for regular numbers
  if (typeof value === 'number') {
    return formatNumber(value);
  }
  
  return '0';
}

/**
 * Formatiert einen Multiplikator-Wert für die Anzeige
 * 
 * @param {number} value - Der Multiplikatorwert
 * @returns {string|null} - Der formatierte Wert als String oder null (wenn = 1)
 */
export function formatMultiplier(value) {
  if (typeof value !== 'number') return value;
  if (value === 1) return 'x1.00'; // kein Multiplikator bei 1
  
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
  
  // Für Werte sehr nahe bei Null, immer 0% anzeigen
  if (Math.abs(value) < 0.0001) {
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

/**
 * Parst einen String mit Suffixen (k, m, b, etc.) in eine Zahl
 * 
 * @param {string} input - Der zu parsende String
 * @returns {number|null} - Die geparste Zahl oder null bei ungültigem Input
 */
export function parseNumberWithSuffix(input) {
  if (!input || typeof input !== 'string') {
    return 0;
  }
  
  const trimmedInput = input.trim();
  
  // Nur Ziffern -> direkter Wert
  if (/^\d+(\.\d+)?$/.test(trimmedInput)) {
    return parseFloat(trimmedInput);
  }
  
  // Suffix-Notation wie "1.5b" oder "2k"
  const suffixMatch = trimmedInput.match(/^(\d+(\.\d+)?)([kmbtqsond])([aeixpu])?$/i);
  if (suffixMatch) {
    const num = parseFloat(suffixMatch[1]);
    const primarySuffix = suffixMatch[3].toLowerCase();
    const secondarySuffix = suffixMatch[4]?.toLowerCase() || '';
    
    const suffixMap = {
      'k': 1e3,
      'm': 1e6,
      'b': 1e9,
      't': 1e12,
      'q': secondarySuffix === 'a' ? 1e15 : secondarySuffix === 'i' || secondarySuffix === 'u' ? 1e18 : 1e15,
      's': secondarySuffix === 'x' ? 1e21 : secondarySuffix === 'p' ? 1e24 : 1e21,
      'o': secondarySuffix === 'c' ? 1e27 : 1e27,
      'n': 1e30,
      'd': 1e33
    };
    
    return num * (suffixMap[primarySuffix] || 1);
  }
  
  return null; // Ungültiges Format
}

/**
 * Formatiert einen numerischen Wert in Suffix-Notation für die Anzeige
 * 
 * @param {number} value - Der numerische Wert
 * @returns {string} - Der formatierte Wert mit Suffix (z.B. "3.50t")
 */
export function formatSuffixInput(value) {
  if (typeof value !== 'number' || isNaN(value) || value === 0) {
    return '0.00';
  }
  
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','o','n','d'];
  
  // Für Werte < 1000, zeige ohne Suffix
  if (Math.abs(value) < 1000) {
    return value.toFixed(2);
  }
  
  // Berechne die Größenordnung
  let tier = Math.max(0, Math.min(Math.floor(Math.log10(Math.abs(value)) / 3), suffixes.length - 1));
  
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  
  // Formatiere die skalierte Zahl mit 2 Dezimalstellen + Suffix
  return `${scaledValue.toFixed(2)}${suffix}`;
}

/**
 * Parst eine Suffix-Eingabe und gibt den numerischen Wert zurück
 * 
 * @param {string} input - Der Eingabestring (z.B. "3.5t" oder "1000")
 * @returns {number} - Der geparste numerische Wert
 */
export function parseSuffixInput(input) {
  if (!input || typeof input !== 'string') {
    return 0;
  }
  
  const trimmedInput = input.trim();
  
  // Leerer String oder nur Punkt/Komma
  if (trimmedInput === '' || trimmedInput === '.' || trimmedInput === ',') {
    return 0;
  }
  
  // Nur Ziffern und Dezimaltrennzeichen -> direkter Wert
  const numberMatch = trimmedInput.match(/^(\d+(?:[.,]\d*)?)$/);
  if (numberMatch) {
    return parseFloat(numberMatch[1].replace(',', '.'));
  }
  
  // Suffix-Notation wie "1.5b" oder "2k"
  const suffixMatch = trimmedInput.match(/^(\d+(?:[.,]\d*)?)([kmbtqsond])([aeixpu])?$/i);
  if (suffixMatch) {
    const num = parseFloat(suffixMatch[1].replace(',', '.'));
    const primarySuffix = suffixMatch[2].toLowerCase();
    const secondarySuffix = suffixMatch[3] ? suffixMatch[3].toLowerCase() : '';
    
    const suffixMap = {
      'k': 1e3,
      'm': 1e6,
      'b': 1e9,
      't': 1e12,
      'q': secondarySuffix === 'a' ? 1e15 : secondarySuffix === 'u' ? 1e18 : 1e15,
      's': secondarySuffix === 'x' ? 1e21 : secondarySuffix === 'p' ? 1e24 : 1e21,
      'o': secondarySuffix === 'c' ? 1e27 : 1e27,
      'n': 1e30,
      'd': 1e33
    };
    
    return num * (suffixMap[primarySuffix] || 1);
  }
  
  return 0; // Ungültiges Format
}

// Legacy alias for backwards compatibility
export const formatSuffixNotation = formatSuffixInput;