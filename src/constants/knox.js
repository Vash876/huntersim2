export const STATS = [
  { key: 'hp', label: 'MAX HP', max: Infinity },
  { key: 'atk', label: 'ATK Power', max: Infinity },
  { key: 'regen', label: 'HP Regen', max: Infinity },
  { key: 'dr', label: 'DMG Reduction', max: 50 },
  { key: 'block', label: 'Block Chance', max: 50 },
  { key: 'effect', label: 'Effect Chance', max: 50 },
  { key: 'charge', label: 'Charge Chance', max: 100 },
  { key: 'chargeGain', label: 'Charge Gained', max: 100 },
  { key: 'reload', label: 'Reload Time', max: 100 },
  { key: 'proj', label: 'Projectiles Per Salvo', max: 5 },
  { key: 'stage', label: 'Highest Stage Reached', max: Infinity },
]

export const TALENTS = [
  { key: 'revival', label: 'Death Is My Companion', max: 2 },
  { key: 'calyp', label: "Calypso's Advantage", max: 5 },
  { key: 'ua', label: 'The Unfair Advantage', max: 5 },
  { key: 'ghost', label: 'Ghost Bullets', max: 15 },
  { key: 'omen', label: 'The Omen Of Defeat', max: 10 },
  { key: 'll', label: 'Call Me Lucky Loot', max: 10 },
  { key: 'pog', label: 'Presence Of A God', max: 10 },
  { 
    key: 'ultima', 
    label: 'The Legacy of Ultima', 
    max: 50,
    isVisible: (context) => {
      if (!context || !context.hunterStore) {
        return true;
      }
      
      if (context.buildData && context.buildData.talents && context.buildData.talents.ultima > 0) {
        return true;
      }

      return context.hunterStore.shouldShowAdvancedTalents('knox');
    }
  },
  { key: 'finish', label: 'Finishing Move', max: 15 },
]

export const ATTRIBUTES = [
  { key: 'kraken', label: 'Release The Kraken', max: Infinity, cost: 1 },
  { key: 'soul', label: 'Soul Amplification', max: 100, cost: 1 },
  { key: 'dead', label: 'Dead Men Tell No Tales', max: 10, cost: 2 },
  { key: 'spa', label: 'Space Pirate Armory', max: 50, cost: 2 },
  { key: 'pl', label: 'A Pirates Life for Knox', max: 10, cost: 3 },
  { key: 'time', label: 'Timeless Mastery', max: 5, cost: 3 },
  { key: 'sear', label: 'Searious Efficiency', max: 5, cost: 2 },
  { key: 'pct', label: 'Passive Charge Tank', max: 10, cost: 4 },
  { key: 'kot', label: 'King Of Torpedos', max: 5, cost: 5 },
  { key: 'fe', label: 'Fortification Elixir', max: 10, cost: 2 },
  { key: 'sop', label: 'Shield of Poseidon', max: 10, cost: 3 },
]

export const ATTRIBUTE_DEPENDENCIES = {
  soul: ['kraken'],
  dead: ['soul'],
  spa: ['kraken'],
  pl: ['spa'],
  time: ['pl'],
  sear: ['kraken'],
  pct: ['sear'],
  kot: ['pct'],
  fe: ['kraken'],
  sop: ['fe'],
}

export const ATTRIBUTE_MIN_VALUE = {
  kraken: 0,
  soul: 0,
  dead: 0,
  spa: 0,
  pl: 0,
  time: 0,
  sear: 0,
  pct: 0,
  kot: 0,
  fe: 0,
  sop: 0
}

// Liste aller für Knox relevanten Upgrades
export const HUNTER_UPGRADES = {
  relics: ["t2r5", "t2r7"],
  gadgets: ["anchor"],
  inscryptions: ["i105", "i114", "i115"],
  researches: ["res81", "res95", "res105", "res112"],
  cms: ["cm46", "cm47", "cm48", "cm51", "cm53", "cm54", "cm57", "cm58", "cm_ultima", "cm_ultimas"],
  mats_exchange: ["torkinstone", "pytoxene", "gigantium"],
  loopMods: ["stelzi", "roe"],
  diamondspecials: ["hunterloot", "reviveboost"],
  iap: ["travpack"],
  ultima: ["ulti"],
  // Weitere Kategorien für Knox
};

export const EVAL_PARAMS = [
  // Grundlegende Hunter-Statistiken - direkt in hunterStats.knox verfügbar
  "lvl",            // Hunter Level (aus buildData)
  "stage",          // Maximale Stage (aus buildData)
  "hp",             // MAX HP
  "atk",            // ATK Power
  "regen",          // HP Regen
  "dr",             // DMG Reduction
  "block",          // Block Chance
  "effect",         // Effect Chance
  "charge",         // Charge Chance
  "chargeGain",     // Charge Gained
  "reload",         // Reload Time
  "proj",           // Projectiles Per Salvo

  // Talente - direkt in hunterStats.knox verfügbar
  "revival",        // Death Is My Companion
  "calyp",          // Calypso's Advantage
  "ua",             // The Unfair Advantage
  "ghost",          // Ghost Bullets
  "omen",           // The Omen Of Defeat
  "ll",             // Call Me Lucky Loot
  "pog",            // Presence Of A God
  "finish",         // Finishing Move

  // Attribute - direkt in hunterStats.knox verfügbar
  "kraken",         // Release The Kraken
  "soul",           // Soul Amplification (amp in EVALKNOX)
  "dead",           // Dead Men Tell No Tales
  "sear",           // Searious Efficiency
  "pl",             // A Pirates Life for Knox (pirate in EVALKNOX)
  "time",           // Timeless Mastery (timeless in EVALKNOX)
  "kot",            // King Of Torpedos (torpedos in EVALKNOX)
  "pct",            // Passive Charge Tank (charger in EVALKNOX)
  "spa",            // Space Pirate Armory (armory in EVALKNOX)
  "fe",             // Fortification Elixir (elixer in EVALKNOX)
  "sop",            // Shield of Poseidon (reflect in EVALKNOX)

  // Upgrades - mit "upgrades." Präfix versehen
  "upgrades.gadgets.anchor",      // Gadget (The Anchor of Ages)
  "iterations",                   // Iterations for simulation
  "upgrades.iap.travpack",        // In-App-Kauf (Traveller's Pack)
  "upgrades.diamondspecials.hunterloot", // Diamond Special
  "upgrades.ultima.ulti",          // Ultima
  
  // Knox-spezifische Parameter - diese behalten wir bei, aber sie werden mit 0 befüllt
  "glac",                         // Unbekannter Knox-Parameter
  "quartz",                       // Unbekannter Knox-Parameter
  "tess",                         // Unbekannter Knox-Parameter
  "upgrades.diamondspecials.reviveboost", // Revive Cooldown
  "respec",                       // Unbekannter Knox-Parameter
  "bossLootRate",                 // Unbekannter Knox-Parameter
  "iterative",                    // Unbekannter Knox-Parameter
  
  // Parameter mit der Endung "1" - wahrscheinlich für alternative Builds
  "glacRate1",                    // Unbekannter Knox-Parameter
  "quartzRate1",                  // Unbekannter Knox-Parameter
  "tessRate1",                    // Unbekannter Knox-Parameter
  "xpRate1",                      // Unbekannter Knox-Parameter
  "hp1",                          // Alternativer HP-Wert
  "atk1",                         // Alternativer ATK-Wert
  "regen1",                       // Alternativer Regen-Wert
  "dr1",                          // Alternativer DR-Wert
  "block1",                       // Alternativer Block-Wert
  "effect1",                      // Alternativer Effect-Wert
  "charge1",                      // Alternativer Charge-Wert
  "chargeGain1",                  // Alternativer ChargeGain-Wert
  "reload1",                      // Alternativer Reload-Wert
  "proj1",                        // Alternativer Proj-Wert
  "gadget1",                      // Alternativer Gadget-Wert
  "lvl1",                         // Alternativer Level-Wert
  "time1",                        // Alternativer Time-Wert
  
  "upgrades.researches.res81",      // Research#81
  "upgrades.researches.res95",      // Research#95
  "upgrades.researches.res105",     // Research#105
  "upgrades.researches.res112",     // Research#112
  "upgrades.cms.cm46",              // Construction Milestone 46
  "upgrades.cms.cm47",              // Construction Milestone 47
  "upgrades.cms.cm48",              // Construction Milestone 48
  "upgrades.cms.cm51",              // Construction Milestone 51
  "upgrades.cms.cm53",              // Construction Milestone 53
  "upgrades.cms.cm54",              // Construction Milestone 54
  "upgrades.cms.cm57",              // Construction Milestone 57
  "upgrades.cms.cm58",              // Construction Milestone 58
  "upgrades.cms.cm_ultima",          // Construction Milestone Ultima
  "upgrades.cms.cm_ultimas",          // Construction Milestone Ultimas
  "upgrades.gems_nodes.creation_knoxGU", // Creation Node (Knox Gem Upgrade)
  "upgrades.gems_nodes.evolution_gem2", // Evolution Gem Node 2
  "upgrades.gems_nodes.evolution_gem3", // Evolution Gem Node 3
  "upgrades.loopmods.stelzi",           // Stelzi
  "upgrades.inscryptions.i105",        // Inscription #105
  "upgrades.gems_nodes.exodus_gem5",   // Exodus Gem Node 5
  "upgrades.gems_nodes.exodus_attractionCreationCount", // Attraction & Creation Upgrades Count
  "upgrades.gems_nodes.exodus_gem4", // Exodus Gem Node 4
  "upgrades.cms.milestoneCount",       // Exodus Milestones Count
  "upgrades.gems_nodes.temporal_gem6",      // Temporal Gem Node 6
  "upgrades.gems_nodes.innovation_gem5",    // Innovation Gem Node 5
  "upgrades.gems_nodes.power_gem6",         // Power Gem Node 6
  "upgrades.gems_nodes.creation_gem4",      // Creation Gem Node 4
  "upgrades.gems_nodes.creation_gem5",    // Creation Gem Node 5
  "upgrades.gems_nodes.creation_galvTrinketsCount", // Creation Galv Trinkets Count
  "upgrades.gems_nodes.evolution_gem6",         // Evolution Gem Node 6
  "upgrades.gems_nodes.attraction_level",     // Attraction Gem Level
  "upgrades.gems_nodes.attraction_catchUp2",      // Catch-Up Power (Knox)
  "upgrades.gems_nodes.attraction_lootKnox",      // Attraction Loot (Knox)
  "upgrades.relics.t2r5",                     // Relic T2R5
  "upgrades.relics.t2r7",                     // Relic T2R7
  "upgrades.loopmods.roe",             // Rule of Experience
  "upgrades.mats_exchange.tysconDrives",     // Total Tyscon Drives (mat exchange)
  "upgrades.inscryptions.i114",        // Inscription #114
  "upgrades.inscryptions.i115",        // Inscription #115
];

export const EVAL_RESULT_LABELS = {
  lootPerMin: "Loot Score",
  avgStage: "Ø Stage",
  avgTime: "Ø Time",
  minStage: "Min. Stage",
  maxStage: "Max. Stage",
  bossHpPercent: "Boss HP %",
  bossKillRate: "Boss Kill %",
  mat1: "Glacium",  // Material 1 für Borge
  mat2: "Quartz",  // Material 2 für Borge
  mat3: "Tesseracts",     // Material 3 für Borge
  xp: "XP",
  stats: "Stats-Index"
};

export const SHORT_MAT_NAMES = {
  mat1: "Glac",
  mat2: "Quartz",
  mat3: "Tess"
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
    "block",           // Evade Chance
    "effect",          // Effect Chance
    "charge",         // Charge Chance
    "chargeGain",     // Charge Gained
    "reload",         // Reload Time
    "proj",           // Projectiles Per Salvo
    "stage",           // Maximale Stage (aus buildData)
  ],

  // Gadgets
  gadgets: [
    "upgrades.gadgets.anchor",       // Gadget (The Wrench of Gore)
  ],

  // Relics
  relics: [
    "upgrades.relics.t2r5",         // Relic T2R5
    "upgrades.relics.t2r7",         // Relic T2R7
  ],


  // Inscryptions
  inscryptions: [
    "upgrades.inscryptions.i105",     // Inscription #105
    "upgrades.inscryptions.i114",     // Inscription #114
    "upgrades.inscryptions.i115",     // Inscription #115
  ],

  // Research
  researches: [
    "upgrades.researches.res81",     // Research#81
    "upgrades.researches.res95",     // Research#95
    "upgrades.researches.res105",    // Research#105
    "upgrades.researches.res112",    // Research#112
  ],

  // Loop Mods
  loopMods: [
    "upgrades.loopmods.stelzi",       // Stelzi
    "upgrades.loopmods.roe",          // Rule of Experience
  ],

  // Construction Milestones
  cms: [
    "upgrades.cms.cm46",             // CM46
    "upgrades.cms.cm47",             // CM47
    "upgrades.cms.cm48",             // CM48
    "upgrades.cms.cm51",             // CM51
    "upgrades.cms.cm53",             // CM53
    "upgrades.cms.cm54",             // CM54
    "upgrades.cms.cm57",             // CM57
    "upgrades.cms.cm58",             // CM58
    "upgrades.cms.cm_ultima",       // CM Ultima
    "upgrades.cms.cm_ultimas",       // CM Ultimas
    "upgrades.cms.milestoneCount",    // Exodus Milestones Count
  ],

  gemNodes: [
    "upgrades.gems_nodes.exodus_gem5",   // Exodus Gem Node 5
    "upgrades.gems_nodes.exodus_gem4",      // Exodus Gem Node 4
    "upgrades.gems_nodes.temporal_gem6",      // Temporal Gem Node 6
    "upgrades.gems_nodes.innovation_gem5",    // Innovation Gem Node 5
    "upgrades.gems_nodes.power_gem6",         // Power Gem Node 6
    "upgrades.gems_nodes.creation_gem4",      // Creation Gem Node 4
    "upgrades.gems_nodes.creation_gem5",    // Creation Gem Node 5
    "upgrades.gems_nodes.evolution_gem2", // Evolution Gem Node 2
    "upgrades.gems_nodes.evolution_gem3", // Evolution Gem Node 3
    "upgrades.gems_nodes.evolution_gem6",         // Evolution Gem Node 6
  ],

  gemUpgrades: [
    "upgrades.gems_nodes.creation_knoxGU", // Knox Gem Upgrade
    "upgrades.gems_nodes.exodus_attractionCreationCount", // Attraction & Creation Upgrades Count
    "upgrades.gems_nodes.attraction_lootKnox",      // Attraction Loot (Knox)
    "upgrades.gems_nodes.attraction_catchUp2",      // Catch-Up Power (Knox)
  ],

  // Gem Levels
  gemLevels: [
    "upgrades.gems_nodes.attraction_level",     // Attraction Gem Level
    "upgrades.gems_nodes.power_level",          // Power Gem Level
    "upgrades.gems_nodes.innovation_level",     // Innovation Gem Level
  ],

  trinkets: [
    "upgrades.gems_nodes.creation_galvTrinketsCount", // Creation Galv Trinkets Count
  ],

  diamondSpecials: [
    "upgrades.diamondspecials.reviveboost", // Revive Cooldown
  ],

  matsExchange: [
    "upgrades.mats_exchange.tysconDrives",  // Tyscon Drives total
  ],

};

// flaches Array für alle Overrides
export const OVERRIDES_FLAT = [
  ...OVERRIDES.baseStats,
  ...OVERRIDES.gadgets,
  ...OVERRIDES.researches,
  ...OVERRIDES.cms,
  ...OVERRIDES.gemNodes,
  ...OVERRIDES.gemUpgrades,
  ...OVERRIDES.gemLevels,
  ...OVERRIDES.trinkets,
  ...OVERRIDES.diamondSpecials,
  ...OVERRIDES.matsExchange,
];

// Kategorie-Namen für das UI
export const OVERRIDE_CATEGORY_LABELS = {
  baseStats: "Base Stats",
  gadgets: "Gadgets",
  researches: "Researches",
  cms: "Construction Milestones",
  gemNodes: "Gem Nodes",
  gemUpgrades: "Gem Upgrades",
  gemLevels: "Gem Levels",
  trinkets: "Trinkets",
  diamondSpecials: "Diamond Specials",
};

export const BUILD_CODE_PARAMS = [
  // Parameter für den Build-Code (in der Reihenfolge wie im codeHandler.js)
  "revival",        // Death Is My Companion
  "calyp",          // Calypso's Advantage
  "ua",             // The Unfair Advantage
  "ghost",          // Ghost Bullets
  "omen",           // The Omen Of Defeat
  "ll",             // Call Me Lucky Loot
  "pog",            // Presence Of A God
  "finish",         // Finishing Move
  "ultima",         // The Legacy of Ultima (Talent)
  "kraken",         // Release The Kraken
  "spa",            // Space Pirate Armory
  "pl",             // A Pirates Life for Knox
  "time",           // Timeless Mastery
  "soul",           // Soul Amplification
  "dead",           // Dead Men Tell No Tales
  "fe",             // Fortification Elixir
  "sop",            // Shield of Poseidon
  "sear",           // Searious Efficiency
  "pct",            // Passive Charge Tank
  "kot",            // King Of Torpedos
  "hp",             // MAX HP
  "atk",            // ATK Power
  "regen",          // HP Regen
  "dr",             // DMG Reduction
  "block",          // Block Chance
  "effect",         // Effect Chance
  "charge",         // Charge Chance
  "chargeGain",     // Charge Gained
  "reload",         // Reload Time
  "proj",           // Projectiles Per Salvo
  "upgrades.diamondspecials.reviveboost", // Revive Cooldown
  "stage",          // Highest Stage Reached
  "upgrades.gadgets.anchor",  // Gadget (The Anchor of Ages)
  "upgrades.gems_nodes.creation_knoxGU", // Knox Gem Upgrade
  "upgrades.gems_nodes.evolution_gem3", // Evolution Gem Node 3
  "upgrades.gems_nodes.exodus_gem4",      // Exodus Gem Node 4
  "upgrades.cms.milestoneCount",    // Exodus Milestones Count
  "upgrades.gems_nodes.temporal_gem6",      // Temporal Gem Node 6
  "upgrades.gems_nodes.creation_gem4",      // Creation Gem Node 4
  "upgrades.gems_nodes.creation_gem5",    // Creation Gem Node 5
  "upgrades.gems_nodes.power_gem6",         // Power Gem Node 6
  "upgrades.gems_nodes.evolution_gem6",         // Evolution Gem Node 6
  "upgrades.gems_nodes.attraction_level",     // Attraction Gem Level
  "upgrades.gems_nodes.attraction_catchUp2",      // Catch-Up Power (Knox)
  "upgrades.relics.t2r7",                     // Relic T2R7
  "upgrades.gems_nodes.power_level",          // Power Gem Level
  "upgrades.inscryptions.i114",        // Inscription #114
  "upgrades.inscryptions.i115",        // Inscription #115

];

export const STATS_RESULT_LABELS = [
  { key: 'hp', label: 'MAX HP', unit: '', roundDigits: 0 },
  { key: 'atk', label: 'ATK Power', unit: '', roundDigits: 0 },
  { key: 'regen', label: 'HP Regen', unit: '/s', roundDigits: 1 },
  { key: 'dr', label: 'DMG Reduction', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'block', label: 'Block Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'effect', label: 'Effect Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'chargechance', label: 'Charge Chance', unit: '%', roundDigits: 1, multiplier: 100 },
  { key: 'chargegained', label: 'Charge Gained', unit: 'x', roundDigits: 2 },
  { key: 'atkspeed', label: 'Reload Time', unit: 's', roundDigits: 2 },
  { key: 'souulschance', label: 'Souls Chance', unit: '%', roundDigits: 1, multiplier: 100 },
];

//Kosten Effizienz
export const CURRENCY_TYPES = {
  GLACIUM: 'mat1',
  QUARTZ: 'mat2',
  TESSARECTS: 'mat3',
};

// Multi-Currency Upgrades - Upgrades die mehrere Währungen kosten
export const MULTI_CURRENCY_UPGRADES = {
  proj: {  // Projectiles Per Salvo
    label: 'Projectiles Per Salvo',
    max: 5,
    currencies: {
      [CURRENCY_TYPES.GLACIUM]: { baseCost: 80, multiplier: 1000 },
      [CURRENCY_TYPES.QUARTZ]: { baseCost: 120, multiplier: 1000 },
      [CURRENCY_TYPES.TESSARECTS]: { baseCost: 90, multiplier: 1000 }
    }
  }
};

// Mapping der Upgrades zu ihren Währungen
export const UPGRADE_CURRENCIES = {
  // Base Stats
  hp: CURRENCY_TYPES.GLACIUM,
  atk: CURRENCY_TYPES.GLACIUM,
  regen: CURRENCY_TYPES.GLACIUM,
  
  dr: CURRENCY_TYPES.QUARTZ,
  block: CURRENCY_TYPES.QUARTZ,
  effect: CURRENCY_TYPES.QUARTZ,
  
  charge: CURRENCY_TYPES.TESSARECTS,
  chargeGain: CURRENCY_TYPES.TESSARECTS,
  reload: CURRENCY_TYPES.TESSARECTS,
  'upgrades.gadgets.anchor': CURRENCY_TYPES.TESSARECTS,
  
  // Multi-currency upgrade - will be handled specially
  proj: 'multi-currency'
}

export const UPGRADES_BY_CURRENCY = {
  [CURRENCY_TYPES.GLACIUM]: [
    { key: 'hp', label: 'MAX HP'},
    { key: 'atk', label: 'ATK Power'},
    { key: 'regen', label: 'HP Regen'},
    { key: 'proj', label: 'Projectiles Per Salvo', max: 5, isMultiCurrency: true },
  ],
  
  [CURRENCY_TYPES.QUARTZ]: [
    { key: 'dr', label: 'DMG Reduction', max: 50 },
    { key: 'block', label: 'Block Chance', max: 50 },
    { key: 'effect', label: 'Effect Chance', max: 50 },
    { key: 'proj', label: 'Projectiles Per Salvo', max: 5, isMultiCurrency: true },
  ],
  
  [CURRENCY_TYPES.TESSARECTS]: [
    { key: 'charge', label: 'Charge Chance', max: 100 },
    { key: 'chargeGain', label: 'Charge Gained', max: 100 },
    { key: 'reload', label: 'Reload Time', max: 100 },
    { key: 'proj', label: 'Projectiles Per Salvo', max: 5, isMultiCurrency: true },
    { key: 'upgrades.gadgets.anchor', label: 'The Anchor of Ages' },
  ],
};

export const CURRENCY_LABELS = {
  [CURRENCY_TYPES.GLACIUM]: 'Glacium',
  [CURRENCY_TYPES.QUARTZ]: 'Aquarius Quartz',
  [CURRENCY_TYPES.TESSARECTS]: 'Tesseracts',
};

export const CURRENCY_LABELS_SHORT = {
  [CURRENCY_TYPES.GLACIUM]: 'Glac',
  [CURRENCY_TYPES.QUARTZ]: 'Quartz',
  [CURRENCY_TYPES.TESSARECTS]: 'Tess',
};

// Direkte Imports für die Bilder
import mat1Icon from '../assets/knox/loot_mat1.png';
import mat2Icon from '../assets/knox/loot_mat2.png';
import mat3Icon from '../assets/knox/loot_mat3.png';
import xpIcon from '../assets/knox/loot_xp.png';

// Pfade zu den Loot-Icons mit direkten Imports
export const LOOT_ICONS = {
  mat1: mat1Icon,
  mat2: mat2Icon,
  mat3: mat3Icon,
  xp:   xpIcon,
};