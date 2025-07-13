/**
 * TR Tracking Resources Configuration
 * Zentrale Definition aller verfügbaren Resources für TR Tracking
 */

// Standard TR Tracking Resources
export const TR_TRACKING_RESOURCES = [

  {
    key: 'timeInTR',
    displayName: 'Hours in TR',
    column: 'E',
    inputType: 'number',
    step: '0.1',
    placeholder: '0',
    colorClass: 'focus:ring-blue-500',
    cellColorClass: 'text-blue-400',
    sheetColumnNames: ['hours in tr']
  },
  
  {
    key: 'oo',
    displayName: 'OO (Accum)',
    column: 'G',
    inputType: 'text',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-purple-500',
    cellColorClass: 'text-purple-400',
    sheetColumnNames: ['oo', 'accum'],
    formatLargeNumbers: true
  },
  {
    key: 'ticks',
    displayName: 'LR Ticks',
    column: 'H',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-red-500',
    cellColorClass: 'text-red-400',
    sheetColumnNames: ['ticks', 'lr ticks'],
    formatLargeNumbers: true
  },
  {
    key: 'lrcount',
    displayName: 'LR Count',
    column: 'I',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-red-500',
    cellColorClass: 'text-red-400',
    sheetColumnNames: ['lr count', 'loop resets'],
    formatLargeNumbers: true
  },
  {
    key: 'loopsfilled',
    displayName: 'Loops Filled',
    column: 'J',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-red-500',
    cellColorClass: 'text-red-400',
    sheetColumnNames: ['loops filled', 'filled loops'],
    formatLargeNumbers: true
  },
  {
    key: 'lmpurchased',
    displayName: 'Loop Mods Purchased',
    column: 'K',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-red-500',
    cellColorClass: 'text-red-400',
    sheetColumnNames: ['lmpurchased', 'loop mods purchased'],
    formatLargeNumbers: true
  },

  {
    key: 'attgn3',
    displayName: 'AttGN3 Buff',
    column: 'L',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-blue-500',
    cellColorClass: 'text-blue-400',
    sheetColumnNames: ['attgn3', 'attgn3 buff'],
    formatLargeNumbers: true
  },
  {
    key: 'playerlevel',
    displayName: 'Player Level',
    column: 'M',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-purple-500',
    cellColorClass: 'text-purple-400',
    sheetColumnNames: ['playerlevel', 'player level'],
    formatLargeNumbers: true
  },

  {
    key: 'cells',
    displayName: 'Cells',
    column: 'N',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-green-500',
    cellColorClass: 'text-green-400',
    sheetColumnNames: ['cells', 'cell'],
    formatLargeNumbers: true
  },
  {
    key: 'mp',
    displayName: 'MP',
    column: 'Q',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-red-500',
    cellColorClass: 'text-red-400',
    sheetColumnNames: ['mp'],
    formatLargeNumbers: true
  },
  {
    key: 'mpaccum',
    displayName: 'MP (Accum)',
    column: 'R',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-red-500',
    cellColorClass: 'text-red-400',
    sheetColumnNames: ['mpaccum', 'mp accumulated'],
    formatLargeNumbers: true
  },
  {
    key: 'shards',
    displayName: 'Shards',
    column: 'U',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-cyan-500',
    cellColorClass: 'text-cyan-400',
    sheetColumnNames: ['shards', 'shard'],
    formatLargeNumbers: true
  },
  {
    key: 'rp',
    displayName: 'RP',
    column: 'X',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-orange-500',
    cellColorClass: 'text-orange-400',
    sheetColumnNames: ['rp'],
    formatLargeNumbers: true
  },
  {
    key: 'ap',
    displayName: 'AP',
    column: 'AA',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-blue-500',
    cellColorClass: 'text-blue-400',
    sheetColumnNames: ['ap'],
    formatLargeNumbers: true
  },
  {
    key: 'blueprints',
    displayName: 'Blueprints',
    column: 'AC',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-indigo-500',
    cellColorClass: 'text-indigo-400',
    sheetColumnNames: ['blueprints', 'blueprint']
  },
  {
    key: 'f1_1_difar',
    displayName: 'F1-1 Difar',
    column: 'AB',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-pink-500',
    cellColorClass: 'text-pink-400',
    sheetColumnNames: ['f1-1 difar', 'difar']
  },
  {
    key: 'inno_cores',
    displayName: 'Inno Cores',
    column: 'AD',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-teal-500',
    cellColorClass: 'text-teal-400',
    sheetColumnNames: ['inno cores', 'cores']
  },
  {
    key: 'frags',
    displayName: 'Daily Farm Frags',
    column: 'AE',
    inputType: 'number',
    step: '1',
    placeholder: '0',
    colorClass: 'focus:ring-violet-500',
    cellColorClass: 'text-violet-400',
    sheetColumnNames: ['frags', 'frag']
  },

  {
    key: 'camp',
    displayName: 'Current Camp',
    column: 'AF',
    inputType: 'text',
    step: null,
    placeholder: 'Current camp',
    colorClass: 'focus:ring-gray-500',
    cellColorClass: 'text-gray-400',
    sheetColumnNames: ['camp']
  },
  {
    key: 'camp_timer',
    displayName: 'Camp Timer',
    column: 'AG',
    inputType: 'text',
    step: null,
    placeholder: '15:30',
    colorClass: 'focus:ring-gray-500',
    cellColorClass: 'text-gray-400',
    sheetColumnNames: ['camp timer', 'timer']
  },
  {
    key: 'notes',
    displayName: 'Notes',
    column: 'AI',
    inputType: 'text',
    step: null,
    placeholder: 'Notes...',
    colorClass: 'focus:ring-gray-500',
    cellColorClass: 'text-white',
    sheetColumnNames: ['notes', 'note']
  }
];

const COLUMN_MAP = {
  // === EXAKTE DISPLAY NAMES aus index.js ===
  'hours in tr': 'D',           // displayName: 'Hours in TR'
  'oo (accumulated)': 'G',     // displayName: 'OO (Accumulated)'
  'lr ticks': 'H',             // displayName: 'LR Ticks'
  'lr count': 'I',             // displayName: 'LR Count'
  'loops filled': 'J',         // displayName: 'Loops Filled'
  'loop mods purchased': 'K',  // displayName: 'Loop Mods Purchased'
  'attgn3 buff': 'L',          // displayName: 'AttGN3 Buff'
  'player level': 'M',         // displayName: 'Player Level'
  'cells': 'N',               // displayName: 'Cells'
  'mp': 'Q',                  // displayName: 'MP'
  'mp (accumulated)': 'R',    // displayName: 'MP (Accumulated)'
  'shards': 'U',              // displayName: 'Shards'
  'rp': 'X',                  // displayName: 'RP'
  'ap': 'AA',                 // displayName: 'AP'
  'f1-1 difar': 'AB',         // displayName: 'F1-1 Difar'
  'blueprints': 'AC',         // displayName: 'Blueprints'
  'inno cores': 'AD',         // displayName: 'Inno Cores'
  'daily farm frags': 'AE',   // displayName: 'Daily Farm Frags'
  'current camp': 'AF',       // displayName: 'Current Camp'
  'camp timer': 'AG',         // displayName: 'Camp Timer'
  'notes': 'AI',              // displayName: 'Notes'
  
  // AUCH KLEINGESCHRIEBEN für die Normalisierung:
  'hours in tr': 'D',
  'oo (accumulated)': 'G',
  'lr ticks': 'H',
  'lr count': 'I',
  'loops filled': 'J',
  'loop mods purchased': 'K',
  'attgn3 buff': 'L',
  'player level': 'M',
  'cells': 'N',
  'mp': 'Q',
  'mp (accumulated)': 'R',
  'shards': 'U',
  'rp': 'X',
  'ap': 'AA',
  'f1-1 difar': 'AB',
  'blueprints': 'AC',
  'inno cores': 'AD',
  'daily farm frags': 'AE',
  'current camp': 'AF',
  'camp timer': 'AG',
  'notes': 'AI'
};

// Default enabled resources für neue Installationen
export const DEFAULT_ENABLED_RESOURCES = [
  'timeInTR',
  'oo',
  'cells',
  'mp',
  'shards',
  'rp',
  'notes'
];

// Helper Functions
export function getResourceByKey(key) {
  if (!key || typeof key !== 'string') {
    return null;
  }
  return TR_TRACKING_RESOURCES.find(resource => resource.key === key);
}

export function getResourceColumn(key) {
  const resource = getResourceByKey(key);
  return resource ? resource.column : null;
}

export function getResourceByColumn(column) {
  return TR_TRACKING_RESOURCES.find(resource => resource.column === column);
}

export function getAllResourceColumns() {
  return TR_TRACKING_RESOURCES
    .filter(resource => resource.column)
    .map(resource => ({
      key: resource.key,
      column: resource.column,
      displayName: resource.displayName
    }));
}

export function getResourceSheetColumnNames(key) {
  const resource = getResourceByKey(key);
  return resource ? resource.sheetColumnNames : [];
}

// Column conversion utilities
export function columnLetterToIndex(column) {
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result;
}

export function columnIndexToLetter(index) {
  let result = '';
  while (index > 0) {
    index--;
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26);
  }
  return result;
}

// Enhanced resource mapping
export function mapResourceKeyToColumn(resourceKey) {
  const resource = getResourceByKey(resourceKey);
  if (resource && resource.column) {
    return resource.column;
  }
  
  // Fallback: Versuche alternative Mappings
  const alternativeMap = {
    'timeInTR': 'D',
    'time_in_tr': 'D',
    'oo': 'G',
    'cells': 'N',
    'mp': 'Q',
    'shards': 'U',
    'rp': 'X',
    'ap': 'AA',
    'notes': 'AI'
  };
  
  return alternativeMap[resourceKey] || null;
}

export function getResourceDisplayName(key) {
  const resource = getResourceByKey(key);
  return resource ? resource.displayName : (key || 'Unknown');
}

export function getResourceColorClass(key) {
  const resource = getResourceByKey(key);
  return resource ? resource.colorClass : 'focus:ring-gray-500';
}

export function getResourceCellColorClass(key) {
  const resource = getResourceByKey(key);
  return resource ? resource.cellColorClass : 'text-white';
}

export function shouldFormatLargeNumbers(key) {
  const resource = getResourceByKey(key);
  return resource ? resource.formatLargeNumbers : false;
}

// Map resource key to sheet column name
export function mapResourceToColumnName(resourceKey) {
  if (!resourceKey || typeof resourceKey !== 'string') {
    console.warn('mapResourceToColumnName: Invalid resourceKey:', resourceKey);
    return resourceKey || '';
  }
  
  const resource = getResourceByKey(resourceKey);
  if (!resource) return resourceKey;
  
  return resource.displayName;
}

// Find resource by sheet column name
export function findResourceByColumnName(columnName) {
  if (!columnName || typeof columnName !== 'string') {
    console.warn('findResourceByColumnName: Invalid columnName:', columnName);
    return null;
  }
  
  const lowerColumnName = columnName.toLowerCase().trim();
  
  return TR_TRACKING_RESOURCES.find(resource => {
    return resource.sheetColumnNames.some(name => 
      lowerColumnName.includes(name.toLowerCase())
    );
  });
}