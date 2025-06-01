import { getTraitSphereById } from './index.js';

export const traitSpherePresets = [
  // 4 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4],
  },
  {
    category: 'short',
    spheres: [1, 2, 3],
  }, 
  {
    category: 'long',
    spheres: [1, 5],
  },

  // 6 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4],
  },
  {
    category: 'long',
    spheres: [1, 2, 5],
  },

  // 8 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 8],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5],
  },

  // 10 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 7],
  },
  {
    category: 'long',
    spheres: [1, 2, 7],
  },

  // 12 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 7],
  },
  {
    category: 'long',
    spheres: [1, 5, 7],
  },

  // 14 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 7],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7],
  },

  // 16 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 7, 8],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 7],
  },

  // 18 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 7, 12],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7, 8],
  },
  {
    description: '18 Cores for a Long TR with 6 Floated for TS9 (+1 Ultima).',
    category: 'long',
    spheres: [1, 5, 7, 9],
  },

  // 20 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 7, 12],
  },
  {
    category: 'long',
    spheres: [1, 5, 7, 9],
  },

  // 22 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 12],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7, 9],
  },

  // 24 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 7, 8, 12],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7, 8],
  },
  {
    description: '24 Cores for a Long TR with 5 Floated for TS12 (+1 Ultima).',
    category: 'long',
    spheres: [1, 5, 7, 9, 12],
  },

  // 26 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 12],
  },
  {
    category: 'long',
    spheres: [1, 5, 7, 9, 12],
  },

  // 28 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 9, 12],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 12],
  },

  // 30 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 7, 8, 9, 12],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 7, 9, 12],
  },

  // 32 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 8, 9, 12],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7, 8, 9, 12],
  },

  // 34 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 9, 12, 16],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7, 8, 9, 12],
  },

  // 36 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 7, 8, 9, 14],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 7, 9, 12, 16],
  },
  {
    description: '36 Cores for a Long TR with 11 floated for TS14 (+1 UML)',
    category: 'long',
    spheres: [1, 4, 5, 7, 8, 9, 14],
  },

  // 38 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 6, 7, 9, 11, 12],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7, 8, 9, 12, 14],
  },
  {
    description: '38 Cores for a Long TR with 4 floated for TS11 (+1 UML)',
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 9, 11, 12],
  },

  // 40 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 6, 7, 9, 11, 12],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 7, 8, 9, 14],
  },
  {
    description: '40 Cores for a Long TR with 6 floated for TS11 (+1 UML)',
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 9, 11, 12],
  },

  // 42 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 6, 7, 8, 9, 11, 12],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 9, 11, 12],
  },
  {
    description: '42 Cores for a Long TR with 10 floated for TS14 (+1 UML)',
    category: 'long',
    spheres: [1, 4, 5, 7, 8, 9, 12, 14],
  },

  // 44 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 7, 8, 9, 12, 14],
  },
  {
    category: 'long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 9, 11, 12],
  },
  {
    description: '44 Cores for a Long TR with 12 floated for TS14 (+1 UML)',
    category: 'long',
    spheres: [1, 4, 5, 7, 8, 9, 12, 14],
  },

  // 46 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 8, 9, 12, 14],
  },
  {
    category: 'long',
    spheres: [1, 4, 5, 7, 8, 9, 12, 14],
  },

  // 48 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 8, 9, 12, 14],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 7, 8, 9, 12, 14],
  },

  // 50 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 6, 7, 8, 11, 14],
  },
  {
    category: 'long',
    spheres: [1, 2, 3, 4, 5, 7, 8, 9, 12, 14],
  },

  // 52 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 8, 9, 12, 14, 16],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 16],
  },

  // 53 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 5, 7, 8, 9, 12, 14, 16],
  },
  {
    category: 'long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 16],
  },

  // 55 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 5, 7, 8, 9, 12, 14, 16],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16],
  },

  // 60 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 4, 6, 7, 8, 9, 11, 12, 14, 16],
  },
  {
    category: 'long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 16],
  },

  // 62/64 AMC Presets
  {
    category: 'short',
    spheres: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 14, 16],
  },
  {
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16],
  },

  // 66 AMC Presets
  {
    category: 'short/long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16],
  },

  // 69 AMC Presets
  {
    category: 'short/long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15],
    description: '1 floated for TS3',
  },

  // 71 AMC Presets
  {
    category: 'short/long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15],
  },

  // 75 AMC Presets
  {
    category: 'short/long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16],
    description: '1 floated for TS3',
  },

  // 77 AMC Presets
  {
    category: 'short/long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16],
  },
];

/**
 * Hilfsfunktion zum Abrufen eines Presets anhand der ID
 */
export function getPresetById(id) {
  return traitSpherePresets.find(preset => preset.id === id);
}

/**
 * Berechnet die Gesamtkosten eines Presets
 */
export function calculatePresetCost(preset) {
  return preset.spheres.reduce((total, sphereId) => {
    const sphere = getTraitSphereById(sphereId);
    return total + (sphere?.price || 0);
  }, 0);
}

/**
 * Filtert Presets nach verfügbaren Cores
 */
export function getAffordablePresets(availableCores) {
  return traitSpherePresets.filter(preset => {
    const cost = calculatePresetCost(preset);
    return cost <= availableCores;
  });
}

/**
 * Filtert Presets nach Kategorie
 */
export function getPresetsByCategory(category) {
  return traitSpherePresets.filter(preset => preset.category === category);
}

/**
 * Gruppiert Presets nach AMC-Anzahl für bessere Organisation
 */
export function getPresetsGroupedByAMC() {
  const groups = {};
  
  traitSpherePresets.forEach(preset => {
    // Extract AMC number from name
    const amcMatch = preset.name.match(/(\d+)\s+AMC/);
    if (amcMatch) {
      const amc = parseInt(amcMatch[1]);
      if (!groups[amc]) {
        groups[amc] = [];
      }
      groups[amc].push(preset);
    } else {
      // Legacy presets
      if (!groups['legacy']) {
        groups['legacy'] = [];
      }
      groups['legacy'].push(preset);
    }
  });
  
  return groups;
}