/**
 * Konstanten für die Gadgets mit strukturiertem Boost-Array und Multiplier-Formeln
 * @type {Array<{id: string, label: string, boost: Array<{type: string, description: string, baseMulti: number, mileMulti: number}>}>}
 */
export const GADGETS = [
  { 
    id: 'g1', 
    label: 'Handheld Sonic Scansys-4000', 
    mileMulti: 2,
    boost: [
      { type: 'generators', description: 'All Gens', baseMulti: 1.01 },
      { type: 'rp', description: 'RP', baseMulti: 1.02 }
    ],
    // Formel: (baseMulti^level) * (mileMulti^Math.floor(level/10))
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g2', 
    label: 'Portable Mini MK1 Generator', 
    mileMulti: 2,
    boost: [
      { type: 'cells', description: 'Cells', baseMulti: 1.1 },
      { type: 'rp', description: 'RP', baseMulti: 1.01 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g3', 
    label: 'Flergonator Navigator', 
    mileMulti: 2,
    boost: [
      { type: 'cells', description: 'Cells', baseMulti: 1.03 },
      { type: 'mp', description: 'MP', baseMulti: 1.01 },
      { type: 'shards', description: 'Shards', baseMulti: 1.01 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g4', 
    label: 'Serpents Connection Band', 
    mileMulti: 1.04,
    boost: [
      { type: 'orbs', description: 'Orbs', baseMulti: 1.0035 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'wrench', 
    label: 'The Wrench of Gore', 
    mileMulti: 1.02,
    boost: [
      { type: 'loot', description: 'Borge Loot', baseMulti: 1.005 },
      { type: 'power', description: 'Borge (HP, ATK, Regen)', baseMulti: 1.001 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'zaptron', 
    label: 'Zaptron-533 Bio-Repair Tool', 
    mileMulti: 1.02,
    boost: [
      { type: 'loot', description: 'Ozzy Loot', baseMulti: 1.005 },
      { type: 'power', description: 'Ozzy (HP, ATK, Regen)', baseMulti: 1.001 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g7', 
    label: 'Academy Upgraded Standard Issue Double Barrel Module', 
    mileMulti: 2,
    boost: [
      { type: 'ap', description: 'AP', baseMulti: 1.03 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g8', 
    label: 'Heavy-Duty Auto Extractor-Drill', 
    mileMulti: 1.35,
    boost: [
      { type: 'mats', description: 'Mats', baseMulti: 1.005 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g9', 
    label: 'Anti-Bricking Assistance Device', 
    mileMulti: 1.05,
    boost: [
      { type: 'loop_req', description: 'Loop Req', baseMulti: -5 },
      { type: 'tickloop_reduction', description: 'Tick Loop Reduction', baseMulti: -50 }
    ],
    // Spezielle Formel für dieses Gadget: baseMulti * level * mileMulti^Math.floor(level/10)
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 0;
      return boost.baseMulti * level * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g10', 
    label: 'Chad\'s Custom Tokenium Storage Unit', 
    mileMulti: 1.01,
    boost: [
      { type: 'tokens', description: 'Tokenium Gain', baseMulti: 1.002 },
      { type: 'token_cap', description: 'Tokenium Daily Cap', baseMulti: 1.005 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g11', 
    label: 'Pocket-Dimension Petri Dish', 
    mileMulti: 100,
    boost: [
      { type: 'cells', description: 'Cells', baseMulti: 1.5 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g12', 
    label: 'Local Fragment Magnet', 
    formulaType: 'linear',
    boost: [
      { type: 'farm_fragments', description: 'Farm Fragments', baseMulti: 0.0001, mileBonus: 0.0005 }
    ],
    // Spezielle Formel: level * baseMulti + Math.floor(level/10) * mileBonus
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 0;
      return level * boost.baseMulti + Math.floor(level / 10) * boost.mileBonus;
    }
  },
  { 
    id: 'g13', 
    label: 'Mech Engineer Tool-Pants', 
    mileMulti: 10,
    boost: [
      { type: 'mech_cap', description: 'Mech Cap', baseMulti: 1.4 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'g14', 
    label: 'Galactic Fragment Magnet', 
    mileMulti: 1.08,
    boost: [
      { type: 'campaign_fragments', description: 'Campaign Fragments', baseMulti: 1.01 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  },
  { 
    id: 'anchor', 
    label: 'The Anchor of Ages', 
    mileMulti: 1.02,
    boost: [
      { type: 'loot', description: 'Knox Loot', baseMulti: 1.005 },
      { type: 'power', description: 'Knox (HP, ATK, Regen)', baseMulti: 1.001 }
    ],
    calculateMultiplier: function(level, boostType) {
      const boost = this.boost.find(b => b.type === boostType);
      if (!boost) return 1;
      return Math.pow(boost.baseMulti, level) * Math.pow(this.mileMulti, Math.floor(level / 10));
    }
  }
];

/**
 * Hilfsfunktion zum Abrufen eines Gadgets anhand seiner ID
 * @param {string} id - Die ID des Gadgets
 * @returns {Object|null} - Das gefundene Gadget oder null
 */
export function getGadgetById(id) {
  return GADGETS.find(gadget => gadget.id === id) || null;
}

/**
 * Konvertiert eine Gadget-ID in ein Label
 * @param {string} id - Die ID des Gadgets
 * @returns {string} - Das Label des Gadgets oder die ID, falls nicht gefunden
 */
export function getGadgetLabel(id) {
  const gadget = getGadgetById(id);
  return gadget ? gadget.label : id;
}

/**
 * Berechnet den Multiplikator für einen bestimmten Boost-Typ und Level
 * @param {string} gadgetId - Die ID des Gadgets
 * @param {number} level - Das aktuelle Level des Gadgets
 * @param {string} boostType - Der Typ des Boosts (optional, wenn nicht angegeben, wird der erste Boost-Typ verwendet)
 * @returns {number} - Der berechnete Multiplikator
 */
export function calculateGadgetMultiplier(gadgetId, level, boostType = null) {
  const gadget = getGadgetById(gadgetId);
  if (!gadget) return 1;
  
  if (level <= 0) return 1; // Kein Boost bei Level 0
  
  // Wenn kein spezifischer Boost-Typ angegeben wurde, nehmen wir den ersten
  if (!boostType && gadget.boost && gadget.boost.length > 0) {
    boostType = gadget.boost[0].type;
  }
  
  return gadget.calculateMultiplier(level, boostType);
}

/**
 * Formatiert einen Multiplikator als lesbare Zeichenkette mit Suffixen für große Werte
 * @param {number} multiplier - Der zu formatierende Multiplikator
 * @param {boolean} asPercent - Ob der Wert als Prozent angezeigt werden soll
 * @param {string} gadgetId - Die ID des Gadgets für spezielle Formatierungen
 * @returns {string} - Der formatierte Multiplikator
 */
export function formatMultiplier(multiplier, asPercent = false, gadgetId = null) {
  if (multiplier === 0) return '0';
  
  // Spezialhandling für g9 (Anti-Bricking Assistance Device)
  if (gadgetId === 'g9') {
    return Math.round(multiplier).toString(); // Kein "x" Präfix und ohne Dezimalstellen
  }
  
  // Spezialhandling für g12 (Local Fragment Magnet)
  if (gadgetId === 'g12') {
    return `+${multiplier.toFixed(4)}`;  // "+" Präfix statt "x"
  }
  
  if (asPercent) {
    // Konvertieren zu Prozent (z.B. 1.5 -> +50%)
    const percentValue = (multiplier - 1) * 100;
    return percentValue >= 0 ? 
      `+${formatWithSuffix(percentValue)}%` : 
      `${formatWithSuffix(percentValue)}%`;
  } else {
    // Als Multiplikator anzeigen mit Suffixen für große Zahlen
    return `x${formatWithSuffix(multiplier)}`;
  }
}

/**
 * Formatiert eine Zahl mit Suffixen (k, m, b, etc.) für bessere Lesbarkeit
 * @param {number} value - Die zu formatierende Zahl
 * @returns {string} - Die formatierte Zahl mit Suffix
 */
function formatWithSuffix(value) {
  if (typeof value !== 'number' || isNaN(value) || value === 0) {
    return '0';
  }
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','o','n','d'];
  let tier = Math.floor(Math.log10(Math.abs(value)) / 3);
  if (tier === 0) {
    return value.toFixed(2);
  }
  if (tier >= suffixes.length) {
    return value.toExponential(2);
  }
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  return `${scaledValue.toFixed(2)}${suffix}`;
}

/**
 * Berechnet die Differenz zwischen zwei Multiplikatoren, formatiert als Prozentsatz
 * @param {number} currentMulti - Der aktuelle Multiplikator
 * @param {number} targetMulti - Der Ziel-Multiplikator
 * @returns {string} - Die formatierte Differenz (z.B. "+25.5%")
 */
export function calculateMultiplierDifference(currentMulti, targetMulti) {
  if (currentMulti === targetMulti) return '+0.00%';
  
  const percentIncrease = ((targetMulti / currentMulti) - 1) * 100;
  return `+${percentIncrease.toFixed(2)}%`;
}

/**
 * Generiert eine lesbare Boost-Beschreibung mit Multiplikatoren
 * @param {string} gadgetId - Die ID des Gadgets
 * @param {number} level - Das aktuelle Level des Gadgets
 * @returns {string} - Eine formatierte Beschreibung der Boosts
 */
export function getDetailedBoostDescription(gadgetId, level) {
  const gadget = getGadgetById(gadgetId);
  if (!gadget || !gadget.boost || gadget.boost.length === 0) return '';
  
  return gadget.boost.map(boost => {
    const multiplier = gadget.calculateMultiplier(level, boost.type);
    return `${boost.description}: ${formatMultiplier(multiplier)}`;
  }).join(', ');
}