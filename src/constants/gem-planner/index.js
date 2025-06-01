// Grundlegende Definitionen für alle Gems
export const gemTypes = [
  {
    id: 'exodus',
    name: 'Exodus',
    letter: 'E',
    description: 'Exodus: the ancient rite to depart, transmute, and tread the endless void. Both the tangible odysseys across galaxies and the sacred wanderings of soul and essence find resonance within.',
    maxLevel: 4,
    color: 'purple',  // Für CSS-Klassen und Farbschemata
    position: {
      angle: 0,  // Bei Exodus irrelevant, da zentriert
      distanceFromCenter: 0
    }
  },
  {
    id: 'temporal',
    name: 'Temporal',
    letter: 'T',
    description: 'The Temporal Gem enhances your ability to manipulate the flow of time and temporal energies.',
    maxLevel: 3,
    color: 'red',
    position: {
      angle: 60,
      distanceFromCenter: 200
    }
  },
  {
    id: 'innovation',
    name: 'Innovation',
    letter: 'I',
    description: 'The Innovation Gem enhances your ability to discover breakthroughs and advance technologies.',
    maxLevel: 3,
    color: 'lime',
    position: {
      angle: 120,
      distanceFromCenter: 200
    }
  },
  {
    id: 'attraction',
    name: 'Attraction',
    letter: 'A',
    description: 'The Attraction Gem enhances your ability to manipulate gravitational forces and attract resources.',
    maxLevel: 3,
    color: 'cyan',
    position: {
      angle: 240,
      distanceFromCenter: 200
    }
  },
  {
    id: 'power',
    name: 'Power',
    letter: 'P',
    description: 'The Power Gem enhances your ability to generate and control energy throughout your systems.',
    maxLevel: 2,
    color: 'purple',
    position: {
      angle: 180,
      distanceFromCenter: 200
    }
  },
  {
    id: 'creation',
    name: 'Creation',
    letter: 'C',
    description: 'The Creation Gem enhances your ability to manifest matter and create complex structures.',
    maxLevel: 4,
    color: 'orange',
    position: {
      angle: 300,
      distanceFromCenter: 200
    }
  },
  {
    id: 'evolution',
    name: 'Evolution',
    letter: 'E',
    description: 'The Evolution Gem enhances your ability to adapt and evolve systems over time.',
    maxLevel: 1,
    color: 'green',
    position: {
      angle: 0,
      distanceFromCenter: 200
    }
  }
];

// Upgrade-Definitionen für jedes Gem
export const gemUpgrades = {
  exodus: [
    { 
      id: 1, 
      unlockLvl: 1,
      name: 'Cells Bonus', 
      type: 'rp', 
      multiplier: 1.2, 
      cost: 1000 
    },
    { 
      id: 2, 
      unlockLvl: 1, 
      name: 'Shard Bonus', 
      type: 'shards', 
      multiplier: 1.3, 
      cost: 2000 
    },
    { 
      id: 3, 
      unlockLvl: 1, 
      name: 'RP Bonus', 
      type: 'cells', 
      multiplier: 1.4, 
      cost: 5000 
    },
    { 
      id: 4, 
      unlockLvl: 1, 
      name: 'MP Bonus', 
      type: 'mp', 
      multiplier: 1.5, 
      cost: 10000 
    },
    { 
      id: 5, 
      unlockLvl: 4, 
      name: 'AP Bonus', 
      type: 'ap', 
      multiplier: 1.6, 
      cost: 20000 
    }
  ],

  temporal: [
    { 
      id: 1, 
      unlockLvl: 1,
      name: 'MP Bonus (LMs)', 
      type: 'mp', 
      multiplier: 1.2, 
      cost: 1000 
    },
    { 
      id: 2, 
      unlockLvl: 1,
      name: 'MP Bonus (Ticks)', 
      type: 'mp', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 3, 
      unlockLvl: 3,
      name: 'MP Bonus (Zag Rank)', 
      type: 'mp', 
      multiplier: 1.3, 
      cost: 10000 
    },
    { 
      id: 4, 
      unlockLvl: 3,
      name: 'LM Max Levels (Low TIER)', 
      type: 'lm', 
      multiplier: 1.4, 
      cost: 20000 
    },
    { 
      id: 5, 
      unlockLvl: 3,
      name: 'MP Bonus (Zag Crew)', 
      type: 'mp', 
      multiplier: 1.6, 
      cost: 40000 
    },
    { 
      id: 6, 
      unlockLvl: 3,
      name: 'MP Bonus (Loop Resets)', 
      type: 'mp', 
      multiplier: 1.8, 
      cost: 80000 
    }
  ],
  innovation: [
    { 
      id: 1, 
      unlockLvl: 1, 
      name: 'Studies per Study', 
      type: 'studies', 
      multiplier: 1.2, 
      cost: 1000 
    },
    { 
      id: 2, 
      unlockLvl: 2,
      name: 'Cells Bonus', 
      type: 'cells', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 3, 
      unlockLvl: 2,
      name: 'MP Bonus', 
      type: 'mp', 
      multiplier: 1.3, 
      cost: 10000 
    },
    { 
      id: 4, 
      unlockLvl: 2,
      name: 'Shards Bonus', 
      type: 'shards', 
      multiplier: 1.4, 
      cost: 20000 
    },
    { 
      id: 5, 
      unlockLvl: 2,
      name: 'RP Bonus',
      type: 'rp', 
      multiplier: 1.6, 
      cost: 40000 
    },
    { 
      id: 6, 
      unlockLvl: 2,
      name: 'AP Bonus',
      type: 'ap', 
      multiplier: 1.8, 
      cost: 80000 
    }

  ],
  attraction: [
    { 
      id: 1, 
      unlockLvl: 1,
      name: 'Loot Borge', 
      type: 'lootBorge', 
      multiplier: 1.2, 
      cost: 1000 
    },
    { 
      id: 2, 
      unlockLvl: 1,
      name: 'Loot Ozzy', 
      type: 'lootOzzy', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 3, 
      unlockLvl: 1,
      name: 'Catch-Up Power', 
      type: 'catchup', 
      multiplier: 1.3, 
      cost: 10000 
    }
  ],

  power: [
    { 
      id: 1, 
      unlockLvl: 1,
      name: 'Cradle Bonus', 
      type: 'ships', 
      multiplier: 1.2, 
      cost: 1000 
    },
    { 
      id: 2, 
      unlockLvl: 1, 
      name: 'Auxesia Bonus', 
      type: 'ships', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 3, 
      unlockLvl: 1,
      name: 'Zagreus Bonus', 
      type: 'ships', 
      multiplier: 1.3, 
      cost: 10000 
    },
    { 
      id: 4, 
      unlockLvl: 1, 
      name: 'Hephasteus Bonus', 
      type: 'ships', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 5, 
      unlockLvl: 1, 
      name: 'Demeter Bonus', 
      type: 'ships', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 6, 
      unlockLvl: 1, 
      name: 'Koios Bonus', 
      type: 'ships', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 7, 
      unlockLvl: 1, 
      name: 'Zeus Bonus', 
      type: 'ships', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 8, 
      unlockLvl: 1, 
      name: 'Blueprints', 
      type: 'blueprints', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 9, 
      unlockLvl: 1, 
      name: 'Innovation Cores', 
      type: 'innocores', 
      multiplier: 1.5, 
      cost: 5000 
    }
  ],

  creation: [
    { 
      id: 1, 
      unlockLvl: 1,
      name: 'Mech Bonus Cap', 
      type: 'mechcap', 
      multiplier: 1.2, 
      cost: 1000 
    },
    { 
      id: 2, 
      unlockLvl: 1,
      name: 'Hardware Bonus', 
      type: 'hardware', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 3, 
      unlockLvl: 1,
      name: 'Software Bonus',
      type: 'software',
      multiplier: 1.3,
      cost: 10000 
    },
    { 
      id: 4, 
      unlockLvl: 1,
      name: 'Cells Bonus', 
      type: 'cells', 
      multiplier: 1.4, 
      cost: 20000 
    },
    { 
      id: 5, 
      unlockLvl: 1,
      name: 'MP Bonus', 
      type: 'mp', 
      multiplier: 1.6, 
      cost: 40000 
    },
    { 
      id: 6, 
      unlockLvl: 1,
      name: 'Shards Bonus', 
      type: 'shards', 
      multiplier: 1.8, 
      cost: 80000 
    },
    {
      id: 7,
      unlockLvl: 1,
      name: 'RP Bonus',
      type: 'rp',
      multiplier: 1.5,
      cost: 5000
    }
  ],

  evolution: [
    { 
      id: 1, 
      name: '???', 
      type: '?', 
      multiplier: 1.2, 
      cost: 1000 
    },
    { 
      id: 2, 
      name: '???', 
      type: '?', 
      multiplier: 1.5, 
      cost: 5000 
    },
    { 
      id: 3, 
      name: '???', 
      type: '?', 
      multiplier: 1.3, 
      cost: 10000 
    }
  ]
};

// Node-Definitionen für jedes Gem
export const gemNodes = {
  temporal: [
    { id: 0, description: 'Boosts time-related attributes', cost: 1000, bonusType: 'rp', bonus: 1.2, angle: 50, unlockDependency: null },
    { id: 1, description: 'Enhances time compression', cost: 5000, bonusType: 'mp', bonus: 1.5, angle: 60, unlockDependency: { gemId: 'innovation', nodeId: 0 } },
    { id: 2, description: 'Expands temporal influence', cost: 20000, bonusType: 'shards', bonus: 1.3, angle: 70, unlockDependency: { gemId: 'temporal', nodeId: 1 } }
  ],
  innovation: [
    { id: 0, description: 'Accelerates research progress', cost: 2000, bonusType: 'rp', bonus: 1.3, angle: 110, unlockDependency: null },
    { id: 1, description: 'Enhances technological breakthroughs', cost: 8000, bonusType: 'cells', bonus: 1.4, angle: 120, unlockDependency: { gemId: 'innovation', nodeId: 0 } },
    { id: 2, description: 'Unlocks experimental potential', cost: 25000, bonusType: 'mp', bonus: 1.2, angle: 130, unlockDependency: { gemId: 'innovation', nodeId: 1 } }
  ],
  attraction: [
    { id: 0, description: 'Increases gravitational pull', cost: 3000, bonusType: 'shards', bonus: 1.4, angle: 230, unlockDependency: { gemId: 'temporal', nodeId: 2 } },
    { id: 1, description: 'Enhances material acquisition', cost: 10000, bonusType: 'cells', bonus: 1.6, angle: 240, unlockDependency: { gemId: 'attraction', nodeId: 0 } },
    { id: 2, description: 'Creates resource attraction fields', cost: 30000, bonusType: 'rp', bonus: 1.5, angle: 250, unlockDependency: { gemId: 'attraction', nodeId: 1 } }
  ],
  power: [
    { id: 0, description: 'Amplifies energy output', cost: 4000, bonusType: 'mp', bonus: 1.7, angle: 170, unlockDependency: null },
    { id: 1, description: 'Boosts overall system efficiency', cost: 15000, bonusType: 'rp', bonus: 1.4, angle: 180, unlockDependency: { gemId: 'power', nodeId: 0 } },
    { id: 2, description: 'Stabilizes power grid', cost: 40000, bonusType: 'cells', bonus: 1.3, angle: 190, unlockDependency: { gemId: 'power', nodeId: 1 } }
  ],
  creation: [
    { id: 0, description: 'Enables matter generation', cost: 5000, bonusType: 'cells', bonus: 1.8, angle: 290, unlockDependency: { gemId: 'attraction', nodeId: 1 } },
    { id: 1, description: 'Enhances creative processes', cost: 20000, bonusType: 'shards', bonus: 1.6, angle: 300, unlockDependency: { gemId: 'creation', nodeId: 0 } },
    { id: 2, description: 'Establishes creation nexus', cost: 50000, bonusType: 'mp', bonus: 1.5, angle: 310, unlockDependency: { gemId: 'creation', nodeId: 1 } }
  ],
  evolution: [
    { id: 0, description: 'Unlocks evolutionary potential', cost: 5000, bonusType: 'cells', bonus: 1.8, angle: 350, unlockDependency: null },
    { id: 1, description: 'Enhances adaptive processes', cost: 20000, bonusType: 'shards', bonus: 1.6, angle: 0, unlockDependency: { gemId: 'evolution', nodeId: 0 } },
    { id: 2, description: 'Establishes evolutionary nexus', cost: 50000, bonusType: 'mp', bonus: 1.5, angle: 10, unlockDependency: { gemId: 'evolution', nodeId: 1 } }
  ],
  exodus: []  // Exodus hat keine Nodes
};

// Helper-Funktionen
export const getMainBoostType = (gemId) => {
  switch (gemId) {
    case 'temporal': return 'rp';
    case 'innovation': return 'mp';
    case 'attraction': return 'shards';
    case 'power': return 'mp';
    case 'creation': return 'cells';
    case 'evolution': return 'cells';
    default: return '';
  }
};

export const getSecondaryBoostType = (gemId) => {
  switch (gemId) {
    case 'temporal': return 'mp';
    case 'innovation': return 'cells';
    case 'attraction': return 'rp';
    case 'power': return 'shards';
    case 'creation': return 'rp';
    case 'evolution': return 'mp';
    default: return '';
  }
};

// Bonustypen und ihre Anzeigeeinstellungen
export const bonusTypes = {
  rp: {
    name: 'RP',
    fullName: 'Research Points',
    color: 'orange',
    icon: 'moneybag'
  },
  mp: {
    name: 'MP',
    fullName: 'Mission Points',
    color: 'red',
    icon: 'moneybag'
  },
  cells: {
    name: 'Cells',
    fullName: 'Cells',
    color: 'green',
    icon: 'moneybag'
  },
  shards: {
    name: 'Shards',
    fullName: 'Shards',
    color: 'blue',
    icon: 'moneybag'
  }
};

// Zusammengesetzte Daten für die einfache Verwendung
export const getAllGemData = () => {
  return gemTypes.map(gem => ({
    ...gem,
    upgrades: gemUpgrades[gem.id] || [],
    nodes: gemNodes[gem.id] || [],
    mainBoostType: getMainBoostType(gem.id),
    secondaryBoostType: getSecondaryBoostType(gem.id)
  }));
};

export default {
  gemTypes,
  gemUpgrades,
  gemNodes,
  bonusTypes,
  getMainBoostType,
  getSecondaryBoostType,
  getAllGemData
};