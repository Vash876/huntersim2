export const STATS = [
  { key: 'hp', label: 'MAX HP', max: Infinity },
  { key: 'atk', label: 'ATK Power', max: Infinity },
  { key: 'regen', label: 'HP Regen', max: Infinity },
  { key: 'dr', label: 'DMG Reduction', max: 70 },
  { key: 'evade', label: 'Evade Chance', max: 40 },
  { key: 'effect', label: 'Effect Chance', max: 50 },
  { key: 'multichance', label: 'Multistrike Chance', max: 100 },
  { key: 'multipower', label: 'Multistrike Power', max: 100 },
  { key: 'atkspeed', label: 'ATK Speed', max: 100 },
  { key: 'stage', label: 'Highest Stage Reached', max: Infinity },
]

export const TALENTS = [
  { key: 'revival', label: 'Death Is My Companion', max: 2 },
  { key: 'boon', label: 'Tricksters Boon', max: 1 },
  { key: 'ua', label: 'The Unfair Advantage', max: 5 },
  { key: 'needles', label: 'Thousand Needles', max: 10 },
  { key: 'omen', label: 'The Omen Of Decay', max: 10 },
  { key: 'll', label: 'Call Me Lucky Loot', max: 10 },
  { key: 'crip', label: 'Crippling Shots', max: 15 },
  { key: 'ultima', label: 'The Legacy Of Ultima', max: 50 },
  { key: 'echo', label: 'Echo Bullets', max: 20 },
];

export const ATTRIBUTES = [
  { key: 'lotl', label: 'Living Off The Land', max: Infinity, cost: 1 },
  { key: 'exo', label: 'Exo Piercers', max: Infinity, cost: 1 },
  { key: 'scorp', label: 'Shimmering Scorpions', max: 5, cost: 3 },
  { key: 'timeless', label: 'Timeless Mastery', max: 5, cost: 3 },
  { key: 'ibu', label: 'Wings Of Ibu', max: 5, cost: 2 },
  { key: 'exterm', label: 'Extermination Protocol', max: 5, cost: 2 },
  { key: 'snek', label: 'Soul Of Snek', max: 5, cost: 3 },
  { key: 'vect', label: 'Vectid Elixir', max: 10, cost: 2 },
  { key: 'cycle', label: 'The Cycle Of Death', max: 5, cost: 3 },
  { key: 'deal', label: 'A Deal With Death', max: 3, cost: 5 },
  { key: 'medusa', label: 'Gift Of Medusa', max: 5, cost: 3 },
  { key: 'dance', label: 'Dance Of Dashes', max: 4, cost: 3 },
  { key: 'sisters', label: 'Blessing Of The Sisters', max: 1, cost: 15 },
  { key: 'scarab', label: 'Blessing Of The Scarab', max: 20, cost: 2 },
  { key: 'cat', label: 'Blessing Of The Cat', max: 20, cost: 2 },
];

export const ATTRIBUTE_DEPENDENCIES = {
  exo: ['lotl'],
  ibu: ['lotl'],
  scorp: ['exo'],
  timeless: ['exo'],
  exterm: ['ibu'],
  snek: ['exterm'],
  vect: ['exterm'],
  cycle: ['snek'],
  deal: ['cycle'],
  medusa: ['exterm'],
  dance: ['scorp'],
  sisters: ['deal'],
  scarab: ['medusa'],
  cat: ['dance'],
}

export const ATTRIBUTE_MIN_VALUE = {
  lotl: 0,
  exo: 0,
  scorp: 0,
  timeless: 0,
  ibu: 0,
  exterm: 0,
  snek: 0,
  vect: 0,
  cycle: 0,
  deal: 90,
  medusa: 90,
  dance: 90,
  sisters: 180,
  scarab: 150,
  cat: 150,
}

// Liste aller für Ozzy relevanten Upgrades
export const HUNTER_UPGRADES = {
  relics: ["r4", "r7", "r17"],
  inscryptions: ["i31", "i32", "i33", "i36", "i37", "i40", "i81", "i86", "i92"],
  gadgets: ["zaptron"],
  loopmods: ["scavenger2"],
  shardmilestones: ["m0"],
  researches: ["res81"],
  cms: ["cm46", "cm47", "cm48", "cm51"],
  diamondspecials: ["hunterloot", "reviveboost"],
  diamondcards: ["iridian"],	
  iap: ["travpack"],
  ultima: ["ulti"],

};

export const EVAL_PARAMS = [
  // Grundlegende Hunter-Statistiken - direkt in hunterStats.ozzy verfügbar
  "lvl",            // Hunter Level (aus buildData)
  "stage",          // Maximale Stage (aus buildData)
  "hp",             // MAX HP
  "atk",            // ATK Power
  "regen",          // HP Regen
  "dr",             // DMG Reduction
  "evade",          // Evade Chance
  "effect",         // Effect Chance
  "multichance",    // Multistrike Chance
  "multipower",     // Multistrike Power
  "atkspeed",       // ATK Speed

  // Talente - direkt in hunterStats.ozzy verfügbar
  "revival",        // Death Is My Companion
  "boon",           // Tricksters Boon
  "ua",             // The Unfair Advantage
  "needles",        // Thousand Needles
  "omen",           // The Omen Of Decay
  "ll",             // Call Me Lucky Loot
  "crip",           // Crippling Shots
  "ultima",         // The Legacy of Ultima (ultimaTalent)
  "echo",           // Echo Bullets

  // Attribute - direkt in hunterStats.ozzy verfügbar
  "lotl",           // Living Off The Land
  "exo",            // Exo Piercers
  "scorp",          // Shimmering Scorpions
  "dance",          // Dance Of Dashes (dod in EVALOZZY)
  "cat",            // Blessing Of The Cat
  "timeless",       // Timeless Mastery
  "ibu",            // Wings Of Ibu (wings in EVALOZZY)
  "exterm",         // Extermination Protocol
  "medusa",         // Gift Of Medusa
  "scarab",         // Blessing Of The Scarab
  "vect",           // Vectid Elixir (vectid in EVALOZZY)
  "snek",           // Soul Of Snek
  "cycle",          // The Cycle Of Death (cod in EVALOZZY)
  "deal",           // A Deal With Death (dwd in EVALOZZY)
  "sisters",        // Blessing Of The Sisters

  // Upgrades - müssen mit "upgrades." Präfix versehen werden
  "upgrades.gadgets.zaptron",      // Gadget (Zaptron-533 Bio-Repair Tool)
  "upgrades.iap.travpack",         // In-App-Kauf (Traveller's Pack)
  "upgrades.diamondspecials.hunterloot", // Diamond Special
  "upgrades.ultima.ulti",          // Ultima
  "upgrades.diamondspecials.reviveboost", // Revive Cooldown
  "upgrades.loopmods.scavenger2",  // Scavengers Advantage 2

  // Milestones und andere Upgrades - auch mit "upgrades." Präfix
  "upgrades.shardmilestones.m0",   // Shard Milestone 0
  "upgrades.relics.r4",            // Relic #4
  "upgrades.relics.r7",            // Relic #7
  "upgrades.relics.r17",           // Relic #17
  "upgrades.inscryptions.i31",     // Inscription #31
  "upgrades.inscryptions.i32",     // Inscription #32
  "upgrades.inscryptions.i33",     // Inscription #33
  "upgrades.inscryptions.i36",     // Inscription #36
  "upgrades.inscryptions.i37",     // Inscription #37
  "upgrades.inscryptions.i40",     // Inscription #40
  "upgrades.inscryptions.i81",     // Inscription #81
  "upgrades.inscryptions.i86",     // Inscription #86
  "upgrades.inscryptions.i92",     // Inscription #92

  // Gems - angepasst an deine Store-Struktur
  "upgrades.gems_nodes.innovation_gem2", // Innovation Gem Node 2
  "upgrades.gems_nodes.innovation_gem3", // Innovation Gem Node 3
  "upgrades.gems_nodes.attraction_gem3", // Attraction Gem Node 3
  "upgrades.gems.attraction",            // Attraction Gem Level
  "upgrades.gems_nodes.attraction_catchUp", // Catchup Power
  "upgrades.gems_nodes.attraction_lootOzzy", // Loot (Ozzy)
  "upgrades.diamondcards.iridian",       // Diamond Card (Iridian)
  "upgrades.researches.res81",           // Research#81
  "iterations",                          // Anzahl der Iterationen
  "upgrades.cms.cm46",              // Construction Milestone 46
  "upgrades.cms.cm47",              // Construction Milestone 47
  "upgrades.cms.cm48",              // Construction Milestone 48
  "upgrades.cms.cm51",              // Construction Milestone 51
  "upgrades.gems_nodes.creation_ozzyGU", // Creation Gem Node (Ozzy)
];

export const EVAL_RESULT_LABELS = {
  lootPerMin: "Loot Score",
  avgStage: "Ø Stage",
  avgTime: "Ø Time",
  minStage: "Min. Stage",
  maxStage: "Max. Stage",
  bossHpPercent: "Boss HP %",
  bossKillRate: "Boss Kill %",
  mat1: "Farahyte Ore",  
  mat2: "Galvarium",  
  mat3: "Vectid Crystals",     
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
    "multichance",      // Crit Chance
    "multipower",       // Crit Power
    "atkspeed",        // ATK Speed
    "stage",           // Maximale Stage (aus buildData)
  ],

  // Gadgets
  gadgets: [
    "upgrades.gadgets.zaptron",       
  ],

  // Relics
  relics: [
    "upgrades.relics.r4",            // Relic #4
    "upgrades.relics.r7",            // Relic #7
    "upgrades.relics.r17",           // Relic #16
  ],

  // Inscriptions
  inscryptions: [
    "upgrades.inscryptions.i31",      // Inscription #3
    "upgrades.inscryptions.i32",      // Inscription #4
    "upgrades.inscryptions.i33",     // Inscription #11
    "upgrades.inscryptions.i36",     // Inscription #13
    "upgrades.inscryptions.i37",     // Inscription #14
    "upgrades.inscryptions.i40",     // Inscription #23
    "upgrades.inscryptions.i81",     // Inscription #24
    "upgrades.inscryptions.i86",     // Inscription #27
    "upgrades.inscryptions.i92",     // Inscription #44
  ],

  // Research
  researches: [
    "upgrades.researches.res81",     // Research#81
  ],

  // Construction Milestones
  cms: [
    "upgrades.cms.cm46",
    "upgrades.cms.cm47",
    "upgrades.cms.cm48",
    "upgrades.cms.cm51",
  ],

  // Loopmods
  loopmods: [
    "upgrades.loopmods.scavenger2",   // Scavengers Advantage
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
    "upgrades.gems_nodes.innovation_gem2",  // Innovation Gem Node 2
    "upgrades.gems_nodes.innovation_gem3",  // Innovation Gem Node 3
    "upgrades.gems_nodes.attraction_gem3",  // Attraction Gem Node 3
  ],

  gemUpgrades: [
    "upgrades.gems_nodes.attraction_catchUp", // Catchup Power
    "upgrades.gems_nodes.attraction_lootOzzy", // Loot (Ozzy)
    "upgrades.gems_nodes.creation_ozzyGU", // Creation Gem Node (Ozzy)
  ],

  // Gem Levels
  gemLevels: [
    "upgrades.gems.attraction",             // Attraction Gem Level
  ],

  // Diamond Cards
  diamondCards: [
    "upgrades.diamondcards.iridian",         // Diamond Card (Gaiden)
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


export const BUILD_CODE_PARAMS = [
  // Parameter für den Build-Code (in der Reihenfolge wie im codeHandler.js)
  "revival",        // Revival Talent (Death's Disparaging Revenge)
  "boon",          // Trickster's Boon (KORRIGIERT: von "trickster" zu "boon")
  "ua",            // The Unfair Advantage
  "needles",       // Thousand Needles
  "omen",          // The Omen Of Defeat
  "ll",            // Call Me Lucky Loot
  "crip",          // Crippling Shots (KORRIGIERT: von "crippling" zu "crip")
  "echo",          // Echo Bullets
  "lotl",          // Living Off The Land (KORRIGIERT: Bezeichnung war falsch)
  "exo",           // Exo Piercers (KORRIGIERT: von "exoskeleton" zu "exo")
  "scorp",         // Shimmering Scorpions (KORRIGIERT: von "scorpion" zu "scorp")
  "timeless",      // Timeless Mastery
  "ibu",           // Wings of Ibu (KORRIGIERT: von "wings" zu "ibu")
  "exterm",        // Extermination Protocol
  "snek",          // Soul of Snek (KORRIGIERT: Bezeichnung)
  "vect",          // Vectid Elixir (KORRIGIERT: von "elixer" zu "vect")
  "cycle",         // The Cycle of Death (KORRIGIERT: von "cod" zu "cycle")
  "deal",          // A Deal with Death (KORRIGIERT: von "dwd" zu "deal")
  "medusa",        // Gift of Medusa
  "dance",         // Dance of Dashes (KORRIGIERT: von "dod" zu "dance")
  "hp",            // MAX HP
  "atk",           // ATK Power 
  "regen",         // HP Regen 
  "dr",            // DMG Reduction 
  "evade",         // Evade Chance 
  "effect",        // Effect Chance 
  "multichance",   // Multistrike Chance (KORRIGIERT: von "multistrikeChance" zu "multichance")
  "multipower",    // Multistrike Power (KORRIGIERT: von "multistrikePower" zu "multipower")
  "atkspeed",      // ATK Speed (KORRIGIERT: von "atkSpd" zu "atkspeed")
  "upgrades.relics.r4",         // Relic #4
  "upgrades.relics.r17",        // Relic #17
  "upgrades.inscryptions.i31",  // Inscription #31
  "upgrades.inscryptions.i36",  // Inscription #36
  "upgrades.inscryptions.i37",  // Inscription #37
  "upgrades.inscryptions.i40",  // Inscription #40
  "upgrades.gems_nodes.innovation_gem2", // Innovation Gem Node 2
  "upgrades.gems_nodes.innovation_gem3", // Innovation Gem Node 3
  "upgrades.gems.attraction",    // Attraction Gem Level
  "upgrades.gems_nodes.attraction_catchUp", // Catchup Power (99)
  "upgrades.inscryptions.i86",  // Inscription #86
  "upgrades.inscryptions.i92",  // Inscription #92
  "ultima",        // The Legacy of Ultima (Talent)
  "sisters",       // Blessing of the Sisters
  "scarab",        // Blessing of the Scarab
  "cat",           // Blessing of the Cat
  "upgrades.gadgets.zaptron",  // Gadget (KORRIGIERT: von "hatch" zu "zaptron")
  "upgrades.diamondcards.iridian", // Diamond Card (KORRIGIERT: von "gaiden" zu "iridian")
  "upgrades.diamondspecials.reviveboost", // Revive Cooldown
  "upgrades.gems_nodes.creation_ozzyGU", // Creation Gem Node (Ozzy)
];

export const STATS_RESULT_LABELS = [
  { key: 'hp', label: 'MAX HP', unit: '', roundDigits: 0 },
  { key: 'atk', label: 'ATK Power', unit: '', roundDigits: 0 },
  { key: 'regen', label: 'HP Regen', unit: '/s', roundDigits: 1 },
  { key: 'dr', label: 'DMG Reduction', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'evade', label: 'Evade Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'effect', label: 'Effect Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'multichance', label: 'Multistrike Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'multipower', label: 'Multistrike Power', unit: 'x', roundDigits: 2 },
  { key: 'atkspeed', label: 'ATK Speed', unit: '/s', roundDigits: 2 }
];

//Kosten Effizienz
export const CURRENCY_TYPES = {
  FARAHYTE: 'mat1',
  GALVARIUM: 'mat2',
  VECTID: 'mat3',
  FRAGS: 'frags',
};

// Mapping der Upgrades zu ihren Währungen
export const UPGRADE_CURRENCIES = {
  // Base Stats
  hp: CURRENCY_TYPES.FARAHYTE,
  atk: CURRENCY_TYPES.FARAHYTE,
  regen: CURRENCY_TYPES.FARAHYTE,
  
  dr: CURRENCY_TYPES.GALVARIUM,
  evade: CURRENCY_TYPES.GALVARIUM,
  effect: CURRENCY_TYPES.GALVARIUM,

  critchance: CURRENCY_TYPES.VECTID,
  critpower: CURRENCY_TYPES.VECTID,
  atkspeed: CURRENCY_TYPES.VECTID,

  // Relics
  'upgrades.relics.r4': CURRENCY_TYPES.FRAGS,
  'upgrades.relics.r7': CURRENCY_TYPES.FRAGS,
  'upgrades.relics.r17': CURRENCY_TYPES.FRAGS,
}

export const UPGRADES_BY_CURRENCY = {
  [CURRENCY_TYPES.FARAHYTE]: [
    { key: 'hp', label: 'MAX HP'},
    { key: 'atk', label: 'ATK Power'},
    { key: 'regen', label: 'HP Regen'},
  ],
  
  [CURRENCY_TYPES.GALVARIUM]: [
    { key: 'dr', label: 'DMG Reduction', max: 70 },
    { key: 'evade', label: 'Evade Chance', max: 40 },
    { key: 'effect', label: 'Effect Chance', max: 50 },
  ],
  
  [CURRENCY_TYPES.VECTID]: [
    { key: 'multichance', label: 'Multistrike Chance', max: 100 },
    { key: 'multipower', label: 'Multistrike Power', max: 100 },
    { key: 'atkspeed', label: 'ATK Speed', max: 100 },
  ],

  [CURRENCY_TYPES.FRAGS]: [
    { key: 'upgrades.relics.r4', label: 'Relic #4', max: 100 },
    { key: 'upgrades.relics.r7', label: 'Relic #7', max: 100 },
    { key: 'upgrades.relics.r17', label: 'Relic #17', max: 100 },
    { key: 'upgrades.relics.r19', label: 'Relic #19', max: 8 }
  ]
};

export const CURRENCY_LABELS = {
  [CURRENCY_TYPES.FARAHYTE]: 'Farahite Ore',
  [CURRENCY_TYPES.GALVARIUM]: 'Galvarium',
  [CURRENCY_TYPES.VECTID]: 'Vectid Crystals',
  [CURRENCY_TYPES.FRAGS]: 'Fragments',
};

export const CURRENCY_LABELS_SHORT = {
  [CURRENCY_TYPES.FARAHYTE]: 'Fara',
  [CURRENCY_TYPES.GALVARIUM]: 'Galv',
  [CURRENCY_TYPES.VECTID]: 'Vectid',
  [CURRENCY_TYPES.FRAGS]: 'Frags',
};

// Direkte Imports für die Bilder
import mat1Icon from '../assets/ozzy/loot_mat1.png';
import mat2Icon from '../assets/ozzy/loot_mat2.png';
import mat3Icon from '../assets/ozzy/loot_mat3.png';
import xpIcon from '../assets/ozzy/loot_xp.png';

// Pfade zu den Loot-Icons mit direkten Imports
export const LOOT_ICONS = {
  mat1: mat1Icon,
  mat2: mat2Icon,
  mat3: mat3Icon,
  xp: xpIcon,
};