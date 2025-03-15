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
  inscryptions: ["i3", "i4", "i11", "i13", "i14", "i23", "i24", "i27", "i44", "i60", "i80", "i84", "i87", "i88", "i89", "i91"],
  gadgets: ["wrench"],
  loopmods: ["trample", "scavenger"],
  shardmilestones: ["m0"],
  researches: ["res81"],
  diamondspecials: ["hunterloot", "reviveboost"],
  diamondcards: ["gaiden"],
  iap: ["travpack"],
  ultima: ["ulti"],
  // Weitere Kategorien für Borge
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

  // Gems - neu strukturiert für deine Store-Struktur
  "upgrades.gems_nodes.creation_gem1",    // Creation Gem Node 1
  "upgrades.gems_nodes.creation_gem2",    // Creation Gem Node 2
  "upgrades.gems_nodes.creation_gem3",    // Creation Gem Node 3
  "upgrades.gems_nodes.innovation_gem3",  // Innovation Gem Node 3
  "upgrades.gems_nodes.attraction_gem2",  // Attraction Gem Node 2
  "upgrades.gems_nodes.attraction_gem3",  // Attraction Gem Node 3
  "upgrades.gems.attraction",             // Attraction Gem Level
  "upgrades.gems_nodes.attraction_catchUp", // Catchup Power
  "upgrades.gems_nodes.attraction_lootBorge", // Loot (Borge)
  "upgrades.diamondcards.gaiden",         // Diamond Card (Gaiden)
  "upgrades.researches.res81",            // Research#81
  "iterations"                            // Anzahl der Iterationen (aus hunterIterations)
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
  ],

  // Research
  researches: [
    "upgrades.researches.res81",     // Research#81
  ],

  // Loopmods
  loopmods: [
    "upgrades.loopmods.trample",     // Trample: Borge
    "upgrades.loopmods.scavenger",   // Scavengers Advantage
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
    "upgrades.gems_nodes.creation_gem1",    // Creation Gem Node 1
    "upgrades.gems_nodes.creation_gem2",    // Creation Gem Node 2
    "upgrades.gems_nodes.creation_gem3",    // Creation Gem Node 3
    "upgrades.gems_nodes.innovation_gem3",  // Innovation Gem Node 3
    "upgrades.gems_nodes.attraction_gem2",  // Attraction Gem Node 2
    "upgrades.gems_nodes.attraction_gem3",  // Attraction Gem Node 3
  ],

  gemUpgrades: [
    "upgrades.gems_nodes.attraction_catchUp", // Catchup Power
    "upgrades.gems_nodes.attraction_lootBorge", // Loot (Borge)
  ],

  // Gem Levels
  gemLevels: [
    "upgrades.gems.attraction",             // Attraction Gem Level
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
  "upgrades.gems.attraction",           // Attraction Gem Level
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
  "upgrades.researches.res81",     // Research#81
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