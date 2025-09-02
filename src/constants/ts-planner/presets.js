import { getTraitSphereById } from './index.js';

export const traitSpherePresets = [
  // 4 AM Cores - 2/0/0 Milestones
  {
    cores: 4,
    milestones: "2/0/0",
    category: 'short',
    spheres: [1, 2, 4],
  },
  {
    cores: 4,
    milestones: "2/0/0", 
    category: 'long',
    spheres: [1, 5],
  },

  // 6 AM Cores - 2/1/0 Milestones
  {
    cores: 6,
    milestones: "2/1/0",
    category: 'short',
    spheres: [1, 2, 3, 4],
  },
  {
    cores: 6,
    milestones: "2/1/0",
    category: 'long', 
    spheres: [1, 2, 5],
  },

  // 8 AM Cores - 3/1/0 | 2/1/1 Milestones
  {
    cores: 8,
    milestones: "3/1/0 | 2/1/1",
    category: 'short',
    spheres: [1, 2, 4, 8],
  },
  {
    cores: 8,
    milestones: "3/1/0 | 2/1/1",
    category: 'long',
    spheres: [1, 2, 4, 5],
  },

  // 10 AM Cores - 3/1/1 Milestones
  {
    cores: 10,
    milestones: "3/1/1",
    category: 'short',
    spheres: [1, 2, 7],
  },
  {
    cores: 10,
    milestones: "3/1/1",
    category: 'long',
    spheres: [1, 2, 7],
  },

  // 12 AM Cores - 3/2/1 Milestones
  {
    cores: 12,
    milestones: "3/2/1",
    category: 'short',
    spheres: [1, 2, 4, 7],
  },
  {
    cores: 12,
    milestones: "3/2/1",
    category: 'long',
    spheres: [1, 5, 7],
  },

  // 14 AM Cores - 3/2/2 | 4/2/1 Milestones
  {
    cores: 14,
    milestones: "3/2/2 | 4/2/1",
    category: 'short',
    spheres: [1, 2, 3, 4, 7],
  },
  {
    cores: 14,
    milestones: "3/2/2 | 4/2/1",
    category: 'long',
    spheres: [1, 4, 5, 7],
  },

  // 16 AM Cores - 4/2/2 Milestones
  {
    cores: 16,
    milestones: "4/2/2",
    category: 'short',
    spheres: [1, 2, 4, 7, 8],
  },
  {
    cores: 16,
    milestones: "4/2/2",
    category: 'long',
    spheres: [1, 2, 4, 5, 7],
  },

  // 18 AM Cores - 5/2/2 | 4/2/3 Milestones
  {
    cores: 18,
    milestones: "5/2/2 | 4/2/3",
    category: 'short',
    spheres: [1, 2, 7, 12],
  },
  {
    cores: 18,
    milestones: "5/2/2 | 4/2/3",
    category: 'long',
    spheres: [1, 4, 5, 7, 8],
  },

  // 20 AM Cores - 5/2/3 | 4/3/3 Milestones
  {
    cores: 20,
    milestones: "5/2/3 | 4/3/3",
    category: 'short',
    spheres: [1, 2, 4, 7, 12],
  },
  {
    cores: 20,
    milestones: "5/2/3 | 4/3/3",
    category: 'long',
    spheres: [1, 5, 7, 9],
  },

  // 22 AM Cores - 5/3/3 Milestones
  {
    cores: 22,
    milestones: "5/3/3",
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 12],
  },
  {
    cores: 22,
    milestones: "5/3/3",
    category: 'long',
    spheres: [1, 4, 5, 7, 9],
  },

  // 24 AM Cores - 5/3/4 Milestones
  {
    cores: 24,
    milestones: "5/3/4",
    category: 'short',
    spheres: [1, 2, 4, 7, 8, 12],
  },
  {
    cores: 24,
    milestones: "5/3/4",
    category: 'long',
    spheres: [1, 2, 4, 5, 7, 9],
  },

  // 26 AM Cores - 6/3/4 Milestones
  {
    cores: 26,
    milestones: "6/3/4",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 12],
  },
  {
    cores: 26,
    milestones: "6/3/4",
    category: 'long',
    spheres: [1, 5, 7, 9, 12],
  },

  // 28 AM Cores - 6/4/4 Milestones
  {
    cores: 28,
    milestones: "6/4/4",
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 9, 12],
  },
  {
    cores: 28,
    milestones: "6/4/4",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 12],
  },

  // 30 AM Cores - 7/4/4 | 6/4/5 Milestones
  {
    cores: 30,
    milestones: "7/4/4 | 6/4/5",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 8, 12],
  },
  {
    cores: 30,
    milestones: "7/4/4 | 6/4/5",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 2, 12],
  },

  // 32 AM Cores - 7/4/5 Milestones
  {
    cores: 32,
    milestones: "7/4/5",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 3, 8, 12],
  },
  {
    cores: 32,
    milestones: "7/4/5",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 8, 12],
  },

  // 34 AM Cores - 8/4/5 | 7/5/5 Milestones
  {
    cores: 34,
    milestones: "8/4/5 | 7/5/5",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 3, 12, 16],
  },
  {
    cores: 34,
    milestones: "8/4/5 | 7/5/5",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 2, 8, 12],
  },

  // 36 AM Cores - 8/5/5 Milestones
  {
    cores: 36,
    milestones: "8/5/5",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 8, 14],
  },
  {
    cores: 36,
    milestones: "8/5/5",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 2, 12, 16],
  },

  // 38 AM Cores - 8/5/6 | 9/5/5 Milestones
  {
    cores: 38,
    milestones: "8/5/6 | 9/5/5",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 6, 11, 12],
  },
  {
    cores: 38,
    milestones: "8/5/6 | 9/5/5",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 8, 14],
  },

  // 40 AM Cores - 8/6/6 | 9/5/6 Milestones
  {
    cores: 40,
    milestones: "8/6/6 | 9/5/6",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 3, 6, 11, 12],
  },
  {
    cores: 40,
    milestones: "8/6/6 | 9/5/6",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 2, 8, 14],
  },

  // 42 AM Cores - 9/6/6 Milestones
  {
    cores: 42,
    milestones: "9/6/6",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 6, 8, 11, 12],
  },
  {
    cores: 42,
    milestones: "9/6/6",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 2, 6, 11, 12],
  },

  // 44 AM Cores - 10/6/6 | 9/6/7 Milestones
  {
    cores: 44,
    milestones: "10/6/6 | 9/6/7",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 8, 12, 14],
  },
  {
    cores: 44,
    milestones: "10/6/6 | 9/6/7",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 2, 3, 6, 11, 12],
  },

  // 46 AM Cores - 10/6/7 | 9/7/7 Milestones
  {
    cores: 46,
    milestones: "10/6/7 | 9/7/7",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 3, 8, 12, 14],
  },
  {
    cores: 46,
    milestones: "10/6/7 | 9/7/7",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 8, 12, 14],
  },

  // 48 AM Cores - 10/7/7 Milestones
  {
    cores: 48,
    milestones: "10/7/7",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 3, 8, 12, 14],
  },
  {
    cores: 48,
    milestones: "10/7/7",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 2, 8, 12, 14],
  },

  // 50 AM Cores - 11/7/7 | 10/7/8 Milestones
  {
    cores: 50,
    milestones: "11/7/7 | 10/7/8",
    category: 'short',
    spheres: [1, 2, 4, 7, 9, 3, 6, 8, 11, 14],
  },
  {
    cores: 50,
    milestones: "11/7/7 | 10/7/8",
    category: 'long',
    spheres: [1, 4, 5, 7, 9, 2, 3, 8, 12, 14],
  },

  // 52 AM Cores
  {
    cores: 52,
    milestones: "11/7/8",
    category: 'short',
    spheres: [1, 2, 3, 4, 7, 8, 9, 12, 14, 16],
  },
  {
    cores: 52,
    milestones: "11/7/8",
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 16],
  },

  // 53 AM Cores
  {
    cores: 53,
    milestones: "",
    category: 'short',
    spheres: [1, 2, 4, 5, 7, 8, 9, 12, 14, 16],
  },
  {
    cores: 53,
    milestones: "",
    category: 'long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 16],
  },

  // 55 AM Cores
  {
    cores: 55,
    milestones: "",
    category: 'short',
    spheres: [1, 2, 3, 4, 5, 7, 8, 9, 12, 14, 16],
  },
  {
    cores: 55,
    milestones: "",
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16],
  },

  // 60 AM Cores
  {
    cores: 60,
    milestones: "",
    category: 'short',
    spheres: [1, 2, 4, 6, 7, 8, 9, 11, 12, 14, 16],
  },
  {
    cores: 60,
    milestones: "",
    category: 'long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 16],
  },

  // 62/64 AM Cores
  {
    cores: 62,
    milestones: "",
    category: 'short',
    spheres: [1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 14, 16],
  },
  {
    cores: 62,
    milestones: "",
    category: 'long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16],
  },

  // 66 AM Cores
  {
    cores: 66,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16],
  },

  // 69 AM Cores
  {
    cores: 69,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15],
    description: '1 floated for TS3',
  },

  // 71 AM Cores
  {
    cores: 71,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15],
  },

  // 75 AM Cores
  {
    cores: 75,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16],
  },

  // 77 AM Cores
  {
    cores: 77,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16],
  },

  // 89 AM Cores
  {
    cores: 89,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16, 19],
  },

  // 91 AM Cores
  {
    cores: 91,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 16, 19],
  },

  // 100 AM Cores
  {
    cores: 100,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 19],
  },

  // 102 AM Cores
  {
    cores: 102,
    milestones: "",
    category: 'short/long',
    spheres: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 19],
  }

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