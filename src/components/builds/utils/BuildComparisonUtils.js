import { IconArrowUp, IconArrowDown, IconEqual } from '@tabler/icons-vue';

// Differenz-Berechnungen
export function getDiffClasses(value, reference, higherIsBetter = true, small = false) {
  if (value == null || reference == null || isNaN(value) || isNaN(reference) || reference === 0) return '';
  
  try {
    const diff = value - reference;
    const percentDiff = (diff / reference) * 100;
    
    let color = 'gray';
    
    if (Math.abs(percentDiff) < 1) {
      color = 'gray';
    } else if (percentDiff > 0) {
      color = higherIsBetter ? 'green' : 'red';
    } else {
      color = higherIsBetter ? 'red' : 'green';
    }
    
    return `inline-flex items-center justify-center ${small ? 'ml-1 px-1 py-0.5 text-xs' : 'ml-2 px-1.5 py-1 text-sm'} font-medium rounded bg-${color}-700/30 text-${color}-400`;
  } catch (error) {
    console.error('Error in getDiffClasses:', error);
    return '';
  }
}

export function getDiffIcon(value, reference, higherIsBetter = true) {
  if (value == null || reference == null || isNaN(value) || isNaN(reference) || reference === 0) return IconEqual;
  
  try {
    const diff = value - reference;
    const percentDiff = (diff / reference) * 100;
    
    if (Math.abs(percentDiff) < 1) return IconEqual;
    if (percentDiff > 0) {
      return higherIsBetter ? IconArrowUp : IconArrowDown;
    } else {
      return higherIsBetter ? IconArrowDown : IconArrowUp;
    }
  } catch (error) {
    console.error('Error in getDiffIcon:', error);
    return IconEqual;
  }
}

export function getDiffText(value, reference, isPercent = true) {
  if (value == null || reference == null || isNaN(value) || isNaN(reference) || reference === 0) return '';
  
  try {
    const diff = value - reference;
    const percentDiff = (diff / reference) * 100;
    return Math.abs(percentDiff).toFixed(1) + '%';
  } catch (error) {
    console.error('Error in getDiffText:', error);
    return '';
  }
}

// Zeit-Differenz
export function getTimeDiffClasses(value, reference) {
  if (!value || !reference) return '';
  
  try {
    const diff = value - reference;
    
    let color = 'gray';
    
    if (Math.abs(diff) < 0.1) {
      color = 'gray';
    } else if (diff > 0) {
      color = 'red';  // Längere Zeit ist schlechter
    } else {
      color = 'green'; // Kürzere Zeit ist besser
    }
    
    return `inline-flex items-center justify-center ml-2 px-1.5 py-1 text-sm font-medium rounded bg-${color}-700/30 text-${color}-400`;
  } catch (error) {
    console.error('Error in getTimeDiffClasses:', error);
    return '';
  }
}

export function getTimeDiffText(value, reference) {
  if (!value || !reference) return '';
  
  try {
    const diff = value - reference;
    return Math.abs(diff).toFixed(1) + 'm';
  } catch (error) {
    console.error('Error in getTimeDiffText:', error);
    return '';
  }
}

// Boss-Statistik Differenz
export function getBossStatDiffClasses(value, reference, higherIsBetter = true) {
  if (!value || !reference || value === '--' || reference === '--') return '';
  
  try {
    const diff = value - reference;
    
    let color = 'gray';
    
    if (Math.abs(diff) < 1) {
      color = 'gray';
    } else if (diff > 0) {
      color = higherIsBetter ? 'green' : 'red';
    } else {
      color = higherIsBetter ? 'red' : 'green';
    }
    
    return `ml-2 text-${color}-400`;
  } catch (error) {
    console.error('Error in getBossStatDiffClasses:', error);
    return '';
  }
}

export function getBossStatDiffText(value, reference) {
  if (!value || !reference || value === '--' || reference === '--') return '';
  
  try {
    const diff = value - reference;
    return diff > 0 ? `+${diff.toFixed(0)}` : diff.toFixed(0);
  } catch (error) {
    console.error('Error in getBossStatDiffText:', error);
    return '';
  }
}

// Absolute Differenz (für Stage)
export function getAbsoluteDiffClasses(value, reference, higherIsBetter = true, small = false) {
  if (value == null || reference == null || isNaN(value) || isNaN(reference)) return '';
  
  try {
    const diff = value - reference;
    
    let color = 'gray';
    
    if (Math.abs(diff) < 0.1) {
      color = 'gray';
    } else if (diff > 0) {
      color = higherIsBetter ? 'green' : 'red';
    } else {
      color = higherIsBetter ? 'red' : 'green';
    }
    
    return `inline-flex items-center justify-center ${small ? 'ml-1 px-1 py-0.5 text-xs' : 'ml-2 px-1.5 py-1 text-sm'} font-medium rounded bg-${color}-700/30 text-${color}-400`;
  } catch (error) {
    console.error('Error in getAbsoluteDiffClasses:', error);
    return '';
  }
}

export function getAbsoluteDiffText(value, reference) {
  if (value == null || reference == null || isNaN(value) || isNaN(reference)) return '';
  
  try {
    const diff = value - reference;
    return (diff >= 0 ? '+' : '') + diff.toFixed(1);
  } catch (error) {
    console.error('Error in getAbsoluteDiffText:', error);
    return '';
  }
}

// Formatting Funktionen
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

export function formatStage(value, showDecimal = false) {
  if (value === undefined || value === null) return '--';
  
  try {
    return showDecimal ? value.toFixed(1) : Math.floor(value);
  } catch (error) {
    console.error('Error in formatStage:', error);
    return '--';
  }
}

export function formatPercent(value) {
  if (value === undefined || value === null || value === '--') return '--';
  
  try {
    return value.toFixed(1) + '%';
  } catch (error) {
    console.error('Error in formatPercent:', error);
    return '--';
  }
}

export function formatTime(minutes) {
  if (minutes === undefined || minutes === null) return '--';
  
  try {
    if (minutes < 60) {
      return minutes.toFixed(1) + 'm';
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = (minutes % 60).toFixed(0);
      return `${hours}h ${mins}m`;
    }
  } catch (error) {
    console.error('Error in formatTime:', error);
    return '--';
  }
}

// Berechnungsfunktionen
export function calculateRunsPerDay(avgTimeInMinutes) {
  if (!avgTimeInMinutes || avgTimeInMinutes <= 0) return 0;
  return (24 * 60) / avgTimeInMinutes;
}

export function calculatePerDay(value, avgTimeInMinutes) {
  if (!value || !avgTimeInMinutes || avgTimeInMinutes <= 0) return 0;
  const runsPerDay = calculateRunsPerDay(avgTimeInMinutes);
  return value * runsPerDay;
}

// Hilfsfunktion für die Chart-Farben
export function getColorRGB(color) {
  const colorMap = {
    'red': '239, 68, 68',
    'blue': '59, 130, 246',
    'green': '34, 197, 94',
    'yellow': '234, 179, 8',
    'purple': '168, 85, 247',
    'pink': '236, 72, 153',
    'indigo': '99, 102, 241'
  };
  
  return colorMap[color] || '255, 255, 255';
}