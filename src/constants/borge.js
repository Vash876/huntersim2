export const STATS = [
  { key: 'hp', label: 'MAX HP', max: Infinity },
  { key: 'atk', label: 'ATK Power', max: Infinity },
  { key: 'regen', label: 'HP Regen', max: Infinity },
  { key: 'dr', label: 'DMG Reduction', max: 40 },
  { key: 'evade', label: 'Evade Chance', max: 50 },
  { key: 'effect', label: 'Effect Chance', max: 50 },
  { key: 'critchance', label: 'Crit Chance', max: 100 },
  { key: 'critpower', label: 'Crit Power', max: 100 },
  { key: 'atkspeed', label: 'ATK Speed', max: 100 },
  { key: 'stage', label: 'Highest Stage Reached', max: Infinity },
]

export const TALENTS = [
  { key: 'revival', label: 'Death Is My Companion', max: 2 },
  { key: 'loth', label: "Life of the Hunt", max: 5 },
  { key: 'ua', label: 'The Unfair Advantage', max: 5 },
  { key: 'impeccable', label: 'Impeccable Impacts', max: 10 },
  { key: 'omen', label: 'The Omen Of Defeat', max: 10 },
  { key: 'll', label: 'Call Me Lucky Loot', max: 12 },
  { key: 'pog', label: 'Presence Of A God', max: 15 },
  { key: 'ultima', label: 'The Legacy of Ultima', max: 50 },
  { key: 'tfow', label: 'The Fires of War', max: 15 },
]

export const ATTRIBUTES = [
  { key: 'ares', label: 'Soul Of Ares', max: Infinity, cost: 1 },
  { key: 'ylith', label: 'Essence Of Ylith', max: Infinity, cost: 1 },
  { key: 'spartan', label: 'Spartan Lineage', max: 6, cost: 2 },
  { key: 'timeless', label: 'Timeless Mastery', max: 5, cost: 3 },
  { key: 'baal', label: 'Book Of Baal', max: 6, cost: 3 },
  { key: 'sensors', label: 'Superior Sensors', max: 6, cost: 2 },
  { key: 'htb', label: 'Helltouch Barrier', max: 10, cost: 2 },
  { key: 'lfin', label: 'Lifedrain Inhaler', max: 10, cost: 2 },
  { key: 'exp', label: 'Explosive Punches', max: 6, cost: 3 },
  { key: 'atlas', label: 'The Atlas Protocol', max: 6, cost: 3 },
  { key: 'weak', label: 'Weakspot Analysis', max: 6, cost: 2 },
  { key: 'battle', label: 'Born For Battle', max: 3, cost: 5 },
  { key: 'mino', label: 'Soul Of The Minotaur', max: 20, cost: 2 },
  { key: 'hermes', label: 'Soul Of Hermes', max: 20, cost: 2 },
  { key: 'athena', label: 'Soul Of Athena', max: 1, cost: 15 },
];

export const ATTRIBUTE_DEPENDENCIES = {
  ylith: ['ares'],
  baal: ['ares'],
  htb: ['ares'],
  exp: ['htb'],
  spartan: ['ylith'],
  timeless: ['spartan'],
  sensors: ['baal'],
  lfin: ['htb'],
  atlas: ['sensors'],
  weak: ['exp'],
  battle: ['spartan'],
  athena: ['battle'],
  mino: ['atlas'],
  hermes: ['weak'],
}

export const ATTRIBUTE_MIN_VALUE = {
  ares: 0,
  ylith: 0,
  spartan: 0,
  timeless: 0,
  baal: 0,
  sensors: 0,
  htb: 0,
  lfin: 0,
  exp: 0,
  atlas: 75,
  weak: 75,
  battle: 75,
  mino: 150,
  hermes: 150,
  athena: 180,
}

export const HUNTER_UPGRADES = {
  relics: ["r4", "r7", "r16", "r19"],
  inscryptions: ["i3", "i4", "i11", "i13", "i14", "i23", "i24", "i27", "i44", "i60", "i80", "i84", "i87", "i88", "i89", "i91", "i103"],
  gadgets: ["wrench"],
  loopmods: ["trample", "scavenger", "stelzi"],
  shardmilestones: ["m0"],
  researches: ["res81", "res95", "res105"],
  cms: ["cm46", "cm47", "cm48", "cm51"],
  diamondspecials: ["hunterloot", "reviveboost"],
  diamondcards: ["gaiden"],
  iap: ["travpack"],
  ultima: ["ulti"],
};

export const EVAL_PARAMS = [
  // Grundlegende Hunter-Statistiken - diese sind direkt in hunterStats.borge verfügbar
  "lvl",             // Hunter Level (aus buildData)
  "stage",           // Maximale Stage (aus buildData)
  "hp",              // MAX HP
  "atk",             // ATK Power
  "regen",           // HP Regen
  "dr",              // DMG Reduction
  "evade",           // Evade Chance
  "effect",          // Effect Chance
  "critchance",      // Crit Chance
  "critpower",       // Crit Power
  "atkspeed",        // ATK Speed

  // Talente - auch direkt in hunterStats.borge verfügbar
  "revival",         // Death Is My Companion
  "loth",            // Life of the Hunt
  "ua",              // The Unfair Advantage
  "impeccable",      // Impeccable Impacts
  "omen",            // The Omen Of Defeat
  "ll",              // Call Me Lucky Loot
  "pog",             // Presence Of A God
  "ultima",            // The Fires of War
  "tfow",          // The Legacy of Ultima

  // Attribute - auch direkt in hunterStats.borge verfügbar
  "ares",            // Soul Of Ares
  "ylith",           // Essence Of Ylith
  "spartan",         // Spartan Lineage
  "timeless",        // Timeless Mastery
  "battle",          // Born For Battle (entspricht bfb in EVALBORGE)
  "athena",          // Soul Of Athena
  "baal",            // Book Of Baal
  "sensors",         // Superior Sensors
  "atlas",           // The Atlas Protocol
  "mino",            // Soul Of The Minotaur
  "htb",             // Helltouch Barrier (entspricht helltouch in EVALBORGE)
  "exp",             // Explosive Punches (entspricht punches in EVALBORGE)
  "weak",            // Weakspot Analysis (entspricht weakspot in EVALBORGE)
  "hermes",          // Soul Of Hermes
  "lfin",            // Lifedrain Inhaler (entspricht inhaler in EVALBORGE)

  // Upgrades - müssen mit "upgrades." Präfix versehen werden
  "upgrades.gadgets.wrench",       // Gadget (The Wrench of Gore)
  "upgrades.iap.travpack",         // In-App-Kauf (Traversal Pack)
  "upgrades.diamondspecials.hunterloot", // Diamond Special
  "upgrades.ultima.ulti",          // Ultima-Wert
  "upgrades.diamondspecials.reviveboost", // Revive Cooldown
  "upgrades.loopmods.trample",     // Trample: Borge
  "upgrades.loopmods.scavenger",   // Scavengers Advantage

  // Milestones und andere Upgrades - auch mit "upgrades." Präfix
  "upgrades.shardmilestones.m0",   // Shard Milestone 0
  "upgrades.relics.r4",            // Relic #4
  "upgrades.relics.r7",            // Relic #7
  "upgrades.relics.r16",           // Relic #16
  "upgrades.relics.r19",           // Relic #19
  "upgrades.inscryptions.i3",      // Inscription #3
  "upgrades.inscryptions.i4",      // Inscription #4
  "upgrades.inscryptions.i11",     // Inscription #11
  "upgrades.inscryptions.i13",     // Inscription #13
  "upgrades.inscryptions.i14",     // Inscription #14
  "upgrades.inscryptions.i23",     // Inscription #23
  "upgrades.inscryptions.i24",     // Inscription #24
  "upgrades.inscryptions.i27",     // Inscription #27
  "upgrades.inscryptions.i44",     // Inscription #44
  "upgrades.inscryptions.i60",     // Inscription #60
  "upgrades.inscryptions.i80",     // Inscription #80
  "upgrades.inscryptions.i84",     // Inscription #84
  "upgrades.inscryptions.i87",     // Inscription #87
  "upgrades.inscryptions.i88",     // Inscription #88
  "upgrades.inscryptions.i89",     // Inscription #89
  "upgrades.inscryptions.i91",     // Inscription #91

  // Gems - Worker-kompatible Struktur
  "upgrades.gems_nodes.creation_gem1",    // Creation Gem Node 1
  "upgrades.gems_nodes.creation_gem2",    // Creation Gem Node 2
  "upgrades.gems_nodes.creation_gem3",    // Creation Gem Node 3
  "upgrades.gems_nodes.innovation_gem3",  // Innovation Gem Node 3
  "upgrades.gems_nodes.attraction_gem2",  // Attraction Gem Node 2
  "upgrades.gems_nodes.attraction_gem3",  // Attraction Gem Node 3
  "upgrades.gems_nodes.attraction_level", // Attraction Gem Level
  "upgrades.gems_nodes.attraction_catchUp", // Catchup Power
  "upgrades.gems_nodes.attraction_lootBorge", // Loot (Borge)
  "upgrades.diamondcards.gaiden",         // Diamond Card (Gaiden)
  "upgrades.researches.res81",            // Research#81
  "upgrades.researches.res95",            // Research#95
  "upgrades.researches.res105",           // Research#105
  "iterations",                   // Anzahl der Iterationen (aus hunterIterationen)
  "upgrades.cms.cm46",            // Construction Milestone #46
  "upgrades.cms.cm47",            // Construction Milestone #47
  "upgrades.cms.cm48",            // Construction Milestone #48
  "upgrades.cms.cm51",            // Construction Milestone #51
  "upgrades.gems_nodes.creation_borgeGU", // Borge Gem Upgrade
  "upgrades.gems_nodes.evolution_gem3",   // Evolution Gem Node 3
  "upgrades.gems_nodes.temporal_gem4",      // Temporal Gem Node 4
  "upgrades.loopmods.stelzi",                 // Stelzi
  "upgrades.inscryptions.i103",
];

export const EVAL_RESULT_LABELS = {
  lootPerMin: "Loot Score",
  avgStage: "Ø Stage",
  avgTime: "Ø Time",
  minStage: "Min. Stage",
  maxStage: "Max. Stage",
  bossHpPercent: "Boss HP %",
  bossKillRate: "Boss Kill %",
  mat1: "Obsidian",  // Material 1 für Borge
  mat2: "Behlium",  // Material 2 für Borge
  mat3: "Hellish-Biomatter",     // Material 3 für Borge
  xp: "XP",
  stats: "Stats-Index"
};

// Farben für die Evaluierungsergebnisse
export const EVAL_RESULT_COLORS = {
  lootPerMin: "text-red-500",
  mat1: "text-red-400",
  mat2: "text-orange-400",
  mat3: "text-amber-500",
  xp: "text-blue-400",
  bossKillRate: "text-green-500"
};

export const OVERRIDES = {
  // Grundstats
  baseStats: [
    "hp",              // MAX HP
    "atk",             // ATK Power
    "regen",           // HP Regen
    "dr",              // DMG Reduction
    "evade",           // Evade Chance
    "effect",          // Effect Chance
    "critchance",      // Crit Chance
    "critpower",       // Crit Power
    "atkspeed",        // ATK Speed
    "stage",           // Maximale Stage (aus buildData)
  ],

  // Gadgets
  gadgets: [
    "upgrades.gadgets.wrench",       // Gadget (The Wrench of Gore)
  ],

  // Relics
  relics: [
    "upgrades.relics.r4",            // Relic #4
    "upgrades.relics.r7",            // Relic #7
    "upgrades.relics.r16",           // Relic #16
    "upgrades.relics.r19",           // Relic #19
  ],

  // Inscriptions
  inscryptions: [
    "upgrades.inscryptions.i3",      // Inscription #3
    "upgrades.inscryptions.i4",      // Inscription #4
    "upgrades.inscryptions.i11",     // Inscription #11
    "upgrades.inscryptions.i13",     // Inscription #13
    "upgrades.inscryptions.i14",     // Inscription #14
    "upgrades.inscryptions.i23",     // Inscription #23
    "upgrades.inscryptions.i24",     // Inscription #24
    "upgrades.inscryptions.i27",     // Inscription #27
    "upgrades.inscryptions.i44",     // Inscription #44
    "upgrades.inscryptions.i60",     // Inscription #60
    "upgrades.inscryptions.i80",     // Inscription #80
    "upgrades.inscryptions.i84",     // Inscription #84
    "upgrades.inscryptions.i87",     // Inscription #87
    "upgrades.inscryptions.i88",     // Inscription #88
    "upgrades.inscryptions.i89",     // Inscription #89
    "upgrades.inscryptions.i91",     // Inscription #91
    "upgrades.inscryptions.i103",    // Inscription #103
  ],

  //Construction Milestones
  cms: [
    "upgrades.cms.cm46",            // Construction Milestone #46
    "upgrades.cms.cm47",            // Construction Milestone #47
    "upgrades.cms.cm48",            // Construction Milestone #48
    "upgrades.cms.cm51",            // Construction Milestone #51
  ],

  // Research
  researches: [
    "upgrades.researches.res81",     // Research#81
    "upgrades.researches.res95",     // Research#95
    "upgrades.researches.res105",    // Research#105
  ],

  // Loopmods
  loopmods: [
    "upgrades.loopmods.trample",     // Trample: Borge
    "upgrades.loopmods.scavenger",   // Scavengers Advantage
    "upgrades.loopmods.stelzi",      // Stelzi
  ],

  // Shard Milestones
  shardMilestones: [
    "upgrades.shardmilestones.m0",   // Shard Milestone 0
  ],

  // Diamond Specials
  diamondSpecials: [
    "upgrades.diamondspecials.reviveboost", // Revive Cooldown
  ],

  // Gem Nodes
  gemNodes: [
    "upgrades.gems_nodes.temporal_gem4",    // Temporal Gem Node 4
    "upgrades.gems_nodes.creation_gem1",    // Creation Gem Node 1
    "upgrades.gems_nodes.creation_gem2",    // Creation Gem Node 2
    "upgrades.gems_nodes.creation_gem3",    // Creation Gem Node 3
    "upgrades.gems_nodes.innovation_gem3",  // Innovation Gem Node 3
    "upgrades.gems_nodes.attraction_gem2",  // Attraction Gem Node 2
    "upgrades.gems_nodes.attraction_gem3",  // Attraction Gem Node 3
    "upgrades.gems_nodes.evolution_gem3",   // Evolution Gem Node 3
  ],

  gemUpgrades: [
    "upgrades.gems_nodes.attraction_catchUp", // Catchup Power
    "upgrades.gems_nodes.attraction_lootBorge", // Loot (Borge)
    "upgrades.gems_nodes.creation_borgeGU", // Borge Gem Upgrade
  ],

  // Gem Levels
  gemLevels: [
    "upgrades.gems_nodes.attraction_level",     // Attraction Gem Level
  ],

  // Diamond Cards
  diamondCards: [
    "upgrades.diamondcards.gaiden",         // Diamond Card (Gaiden)
  ],
};

// Für den Fall, dass du auch ein flaches Array benötigst
export const OVERRIDES_FLAT = [
  ...OVERRIDES.baseStats,
  ...OVERRIDES.gadgets,
  ...OVERRIDES.relics,
  ...OVERRIDES.inscryptions,
  ...OVERRIDES.researches,
  ...OVERRIDES.cms,
  ...OVERRIDES.loopmods,
  ...OVERRIDES.shardMilestones,
  ...OVERRIDES.diamondSpecials,
  ...OVERRIDES.gemNodes,
  ...OVERRIDES.gemUpgrades,
  ...OVERRIDES.gemLevels,
  ...OVERRIDES.diamondCards
];

// Kategorie-Namen für das UI
export const OVERRIDE_CATEGORY_LABELS = {
  baseStats: "Base Stats",
  gadgets: "Gadgets",
  relics: "Relics",
  inscryptions: "Inscryptions",
  researches: "Researches",
  cms: "Construction Milestones",
  loopmods: "Loop Mods",
  shardMilestones: "Shard Milestones",
  diamondSpecials: "Diamond Specials",
  gemNodes: "Gem Nodes",
  gemUpgrades: "Gem Upgrades",
  gemLevels: "Gem Levels",
  diamondCards: "Diamond Cards"
};

// Die Parameter für den Build-Code in der richtigen Reihenfolge
export const BUILD_CODE_PARAMS = [
  // Parameter für den Build-Code (in der Reihenfolge wie im codeHandler.js)
  "revival",      // Death Is My Companion
  "loth",         // Life of the Hunt
  "ua",           // The Unfair Advantage
  "impeccable",   // Impeccable Impacts
  "omen",         // The Omen Of Defeat
  "ll",           // Call Me Lucky Loot
  "pog",          // Presence Of A God
  "tfow",         // The Fires of War
  "ares",         // Soul Of Ares
  "ylith",        // Essence Of Ylith
  "spartan",      // Spartan Lineage
  "timeless",     // Timeless Mastery
  "baal",         // Book Of Baal
  "sensors",      // Superior Sensors
  "htb",          // Helltouch Barrier
  "lfin",         // Lifedrain Inhaler
  "exp",          // Explosive Punches
  "atlas",        // The Atlas Protocol
  "weak",         // Weakspot Analysis
  "battle",       // Born For Battle
  "hp",           // MAX HP
  "atk",          // ATK Power 
  "regen",        // HP Regen 
  "dr",           // DMG Reduction 
  "evade",        // Evade Chance 
  "effect",       // Effect Chance 
  "critchance",   // Crit Chance 
  "critpower",    // Crit Power 
  "atkspeed",     // ATK Speed 
  "upgrades.loopmods.trample", // Trample
  "upgrades.relics.r4",        // Relic #4
  "upgrades.relics.r16",       // Relic #16
  "upgrades.relics.r19",       // Relic #19
  "upgrades.inscryptions.i3",  // Inscription #3
  "upgrades.inscryptions.i4",  // Inscription #4 
  "upgrades.inscryptions.i11", // Inscription #11
  "upgrades.inscryptions.i13", // Inscription #13
  "upgrades.inscryptions.i23", // Inscription #23
  "upgrades.inscryptions.i24", // Inscription #24
  "upgrades.inscryptions.i27", // Inscription #27
  "upgrades.inscryptions.i60", // Inscription #60
  "upgrades.gems_nodes.creation_gem1", // Creation Gem Node 1
  "upgrades.gems_nodes.creation_gem2", // Creation Gem Node 2
  "upgrades.gems_nodes.creation_gem3", // Creation Gem Node 3
  "upgrades.gems_nodes.innovation_gem3", // Innovation Gem Node 3
  "upgrades.gems_nodes.attraction_gem2", // Attraction Gem Node 2
  "upgrades.gems_nodes.attraction_level", // Attraction Gem Level
  "upgrades.gems_nodes.attraction_catchUp", // Catchup Power
  "upgrades.inscryptions.i84", // Inscription #84
  "upgrades.inscryptions.i87", // Inscription #87
  "upgrades.inscryptions.i88", // Inscription #88
  "upgrades.inscryptions.i89", // Inscription #89
  "upgrades.inscryptions.i91", // Inscription #91
  "ultima",        // The Legacy of Ultima (Talent)
  "athena",        // Soul Of Athena (Attribut)
  "mino",          // Soul Of The Minotaur (Attribut)
  "hermes",        // Soul Of Hermes (Attribut)
  "upgrades.gadgets.wrench",   // Gadget (The Wrench of Gore)
  "upgrades.diamondcards.gaiden", // Diamond Card (Gaiden)
  "upgrades.diamondspecials.reviveboost", // Revive Cooldown
  "upgrades.gems_nodes.creation_borgeGU", // Borge Gem Upgrade
  "upgrades.gems_nodes.evolution_gem3", // Evolution Gem Node 3
  "upgrades.gems_nodes.temporal_gem4", // Temporal Gem Node 4
  "upgrades.loopmods.stelzi",           // Stelzi
  "upgrades.inscryptions.i103",        // Inscription #103
];

export const STATS_RESULT_LABELS = [
  { key: 'hp', label: 'MAX HP', unit: '', roundDigits: 0 },
  { key: 'atk', label: 'ATK Power', unit: '', roundDigits: 0 },
  { key: 'regen', label: 'HP Regen', unit: '/s', roundDigits: 1 },
  { key: 'dr', label: 'DMG Reduction', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'evade', label: 'Evade Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'effect', label: 'Effect Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'critchance', label: 'Crit Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'critpower', label: 'Crit Power', unit: 'x', roundDigits: 2 },
  { key: 'atkspeed', label: 'ATK Speed', unit: '/s', roundDigits: 2 }
];

//Kosten Effizienz
export const CURRENCY_TYPES = {
  OBSIDIAN: 'mat1',
  BEHLIUM: 'mat2',
  BIOMATTER: 'mat3',
  FRAGS: 'frags',
};

// Mapping der Upgrades zu ihren Währungen
export const UPGRADE_CURRENCIES = {
  // Base Stats
  hp: CURRENCY_TYPES.OBSIDIAN,
  atk: CURRENCY_TYPES.OBSIDIAN,
  regen: CURRENCY_TYPES.OBSIDIAN,
  
  dr: CURRENCY_TYPES.BEHLIUM,
  evade: CURRENCY_TYPES.BEHLIUM,
  effect: CURRENCY_TYPES.BEHLIUM,
  
  critchance: CURRENCY_TYPES.BIOMATTER,
  critpower: CURRENCY_TYPES.BIOMATTER,
  atkspeed: CURRENCY_TYPES.BIOMATTER,

  // Relics
  'upgrades.relics.r4': CURRENCY_TYPES.FRAGS,
  'upgrades.relics.r7': CURRENCY_TYPES.FRAGS,
  'upgrades.relics.r16': CURRENCY_TYPES.FRAGS,
  'upgrades.relics.r19': CURRENCY_TYPES.FRAGS,
}

export const UPGRADES_BY_CURRENCY = {
  [CURRENCY_TYPES.OBSIDIAN]: [
    { key: 'hp', label: 'MAX HP'},
    { key: 'atk', label: 'ATK Power'},
    { key: 'regen', label: 'HP Regen'},
  ],
  
  [CURRENCY_TYPES.BEHLIUM]: [
    { key: 'dr', label: 'DMG Reduction', max: 40 },
    { key: 'evade', label: 'Evade Chance', max: 50 },
    { key: 'effect', label: 'Effect Chance', max: 50 },
  ],

  [CURRENCY_TYPES.BIOMATTER]: [
    { key: 'critchance', label: 'Crit Chance', max: 100 },
    { key: 'critpower', label: 'Crit Power', max: 100 },
    { key: 'atkspeed', label: 'ATK Speed', max: 100 },

    { key: 'upgrades.inscryptions.i60', label: 'Inscryption #60', max: 10 },
    { key: 'upgrades.inscryptions.i80', label: 'Inscryption #80', max: 10 },
    { key: 'upgrades.inscryptions.i84', label: 'Inscryption #84', max: 10 },
    { key: 'upgrades.inscryptions.i87', label: 'Inscryption #87', max: 10 },
    { key: 'upgrades.inscryptions.i88', label: 'Inscryption #88', max: 7 },
    { key: 'upgrades.inscryptions.i89', label: 'Inscryption #89', max: 7 },
    { key: 'upgrades.inscryptions.i91', label: 'Inscryption #91', max: 7 },
    { key: 'upgrades.inscryptions.i103', label: 'Inscryption #103', max: 8 },
  ],

  [CURRENCY_TYPES.FRAGS]: [
    { key: 'upgrades.relics.r4', label: 'Relic #4', max: 100 },
    { key: 'upgrades.relics.r7', label: 'Relic #7', max: 100 },
    { key: 'upgrades.relics.r16', label: 'Relic #16', max: 100 },
    { key: 'upgrades.relics.r19', label: 'Relic #19', max: 8 }
  ]
};

export const CURRENCY_LABELS = {
  [CURRENCY_TYPES.OBSIDIAN]: 'Obsidian',
  [CURRENCY_TYPES.BEHLIUM]: 'Behlium',
  [CURRENCY_TYPES.BIOMATTER]: 'Hellish-Biomatter',
  [CURRENCY_TYPES.FRAGS]: 'Fragments',
};

export const CURRENCY_LABELS_SHORT = {
  [CURRENCY_TYPES.OBSIDIAN]: 'Obs',
  [CURRENCY_TYPES.BEHLIUM]: 'Beh',
  [CURRENCY_TYPES.BIOMATTER]: 'HBM',
  [CURRENCY_TYPES.FRAGS]: 'Frags',
};

// Direkte Imports für die Bilder
import mat1Icon from '../assets/borge/loot_mat1.png';
import mat2Icon from '../assets/borge/loot_mat2.png';
import mat3Icon from '../assets/borge/loot_mat3.png';
import xpIcon from '../assets/borge/loot_xp.png';

// Pfade zu den Loot-Icons mit direkten Imports
export const LOOT_ICONS = {
  mat1: mat1Icon,
  mat2: mat2Icon,
  mat3: mat3Icon,
  xp: xpIcon,
};