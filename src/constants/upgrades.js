export const UPGRADES = {

  ///////////////RELICS////////////////

  relics: [
    {
      id: "r4",
      name: "#4 The Disk of Dawn",
      type: "level",
      upgradeType: "additive",   
      value: 0.03,              
      maxLevel: 100,
      multitext: "Max HP",
    },
    {
      id: "r7",
      name: "#7 Manifestation Core: Titan",
      type: "level",
      upgradeType: "multiplicative", 
      value: 1.05,                  
      maxLevel: 100,
      multitext: "Loot Reward",
    },
    {
      id: "r16",
      name: "#16 The Long-Range Artillery Crawler",
      type: "level",
      upgradeType: "additive",
      value: 0.03,              
      maxLevel: 100,
      multitext: "ATK Power",
    },
    {
      id: "r17",
      name: "#17 The Bee-gone Companion Drone",
      type: "level",
      upgradeType: "additive",
      value: 0.03,             
      maxLevel: 100,
      multitext: "ATK Power",
    },
    {
      id: "r19",
      name: "#19 The Book of Mephisto",
      type: "level",
      upgradeType: "multiplicative",
      value: 2,                 
      maxLevel: 8,
      multitext: "EXP Gained",
    }
  ],

  ///////////////SHARD MILESTONES////////////////

  shardmilestones: [
    {
      id: "m0",
      name: "#0 The Eternal Milestone",
      type: "level",
      value: 1.02,
      upgradeType: "multiplicative",
      maxLevel: Infinity,
      multitext: "Loot Reward",
    },
  ],

  ///////////////RESEARCHES////////////////

  researches: [
    {
      id: "res81",
      name: "Research #81",
      hunter: "all",
      type: "level",
      maxLevel: 6,
      multitext: "Loot Reward",
      tiers: [
        { level: 0, multipliers: { borge: 1.0, ozzy: 1.0, knox: 1.0 } },
        { level: 1, multipliers: { borge: 1.1, ozzy: 1.0, knox: 1.0 } },
        { level: 2, multipliers: { borge: 1.1, ozzy: 1.1, knox: 1.0 } },
        { level: 3, multipliers: { borge: 1.1, ozzy: 1.1, knox: 1.1 } },
        { level: 4, multipliers: { borge: 1.32, ozzy: 1.1, knox: 1.1 } },   // 1.1 * 1.2
        { level: 5, multipliers: { borge: 1.32, ozzy: 1.32, knox: 1.1 } },  // 1.1 * 1.2
        { level: 6, multipliers: { borge: 1.32, ozzy: 1.32, knox: 1.32 } }, // 1.1 * 1.2
      ]
    },
  ],

  ///////////////GADGETS////////////////

  gadgets: [
    {
      id: "wrench",
      name: "The Wrench of Gore",
      type: "level",
      maxLevel: Infinity,
      stats: {
        loot: {
          name: "Loot Rewards",
          upgradeType: "compound",
          baseValue: 0.005,   // Basis-Steigerung pro Level (0.5%)
          tierStep: 10,       // Alle 10 Level neuer Tier
          tierMultiplier: 1.02, // Tier-Multiplikator (2%)
        },
        hp: {
          name: "Max HP",
          upgradeType: "compound",
          baseValue: 0.001,   // Basis-Steigerung pro Level (0.1%)
          tierStep: 10,
          tierMultiplier: 1.02,
        },
        attack: {
          name: "ATK Power",
          upgradeType: "compound",
          baseValue: 0.001,   // Basis-Steigerung pro Level (0.1%)
          tierStep: 10,
          tierMultiplier: 1.02,
        },
        regen: {
          name: "HP Regen",
          upgradeType: "compound",
          baseValue: 0.001,   // Basis-Steigerung pro Level (0.1%)
          tierStep: 10,
          tierMultiplier: 1.02,
        }
      }
    },
    {
      id: "zaptron",
      name: "Zaptron-533 Bio-Repair Tool",
      type: "level",
      maxLevel: Infinity,
      stats: {
        loot: {
          name: "Loot Rewards",
          upgradeType: "compound",
          baseValue: 0.005,
          tierStep: 10,
          tierMultiplier: 1.02,
        },
        hp: {
          name: "Max HP",
          upgradeType: "compound",
          baseValue: 0.001,
          tierStep: 10,
          tierMultiplier: 1.02,
        },
        attack: {
          name: "ATK Power",
          upgradeType: "compound",
          baseValue: 0.001,
          tierStep: 10,
          tierMultiplier: 1.02,
        },
        regen: {
          name: "HP Regen",
          upgradeType: "compound",
          baseValue: 0.001,
          tierStep: 10,
          tierMultiplier: 1.02,
        }
      }
    },
    {
      id: "anchor",
      name: "The Anchor of Ages",
      type: "level", 
      maxLevel: Infinity,
      stats: {
        loot: {
          name: "Loot Rewards",
          upgradeType: "compound",
          baseValue: 0.005,
          tierStep: 10,
          tierMultiplier: 1.02,
        },
        hp: {
          name: "Max HP",
          upgradeType: "compound",
          baseValue: 0.001,
          tierStep: 10,
          tierMultiplier: 1.02,
        },
        attack: {
          name: "ATK Power",
          upgradeType: "compound",
          baseValue: 0.001,
          tierStep: 10,
          tierMultiplier: 1.02,
        },
        regen: {
          name: "HP Regen",
          upgradeType: "compound",
          baseValue: 0.001,
          tierStep: 10,
          tierMultiplier: 1.02,
        }
      }
    },
  ],
  ///////////////INSCRYPTIONS////////////////

  inscryptions: [
    { 
      id: "i3", 
      name: "Inscryption #3", 
      hunter: "borge", 
      type: "level", 
      add: 6, 
      maxLevel: 8, 
      description: "Borge Max HP", 
      format: "value", // Nur der Wert
      color: "red" 
    },
    { 
      id: "i4", 
      name: "Inscryption #4", 
      hunter: "borge", 
      type: "level", 
      add: 0.65, 
      maxLevel: 6, 
      description: "Borge Crit Chance", 
      format: "percent", // Wert mit %-Zeichen
      color: "red" 
    },
    { 
      id: "i11", 
      name: "Inscryption #11", 
      hunter: "borge", 
      type: "level", 
      add: 2, 
      maxLevel: 3, 
      description: "Borge Effect Chance", 
      format: "percent", // Wert mit %-Zeichen
      color: "red" 
    },
    { 
      id: "i13", 
      name: "Inscryption #13", 
      hunter: "borge", 
      type: "level", 
      add: 1, 
      maxLevel: 8, 
      description: "Borge ATK Power", 
      format: "value",
      color: "red" 
    },
    { 
      id: "i14", 
      name: "Inscryption #14", 
      hunter: "borge", 
      type: "level", 
      multiplier: 1.1, 
      maxLevel: 5, 
      description: "Borge Loot Reward", 
      format: "multiplier", // x-Wert
      color: "red" 
    },
    { 
      id: "i23", 
      name: "Inscryption #23", 
      hunter: "borge", 
      type: "level", 
      add: 0.04, 
      maxLevel: 5, 
      description: "Borge ATK Speed", 
      format: "seconds", // Wert mit s
      color: "red" 
    },
    { 
      id: "i24", 
      name: "Inscryption #24", 
      hunter: "borge", 
      type: "level", 
      add: 0.4, 
      maxLevel: 8, 
      description: "Borge DMG Reduction", 
      format: "percent",
      color: "red" 
    },
    { 
      id: "i27", 
      name: "Inscryption #27", 
      hunter: "borge", 
      type: "level", 
      add: 24, 
      maxLevel: 10, 
      description: "Borge Max HP", 
      format: "value",
      color: "red" 
    },
    { 
      id: "i31", 
      name: "Inscryption #31", 
      hunter: "ozzy", 
      type: "level", 
      add: 0.6, 
      maxLevel: 10, 
      description: "Ozzy Effect Chance", 
      format: "percent",
      color: "green" 
    },
    { 
      id: "i32", 
      name: "Inscryption #32", 
      hunter: "ozzy", 
      type: "level", 
      multiplier: 1.5, 
      maxLevel: 8, 
      description: "Ozzy Loot Reward", 
      format: "multiplier",
      color: "green" 
    },
    { 
      id: "i33", 
      name: "Inscryption #33", 
      hunter: "ozzy", 
      type: "level", 
      multiplier: 1.75, 
      maxLevel: 6, 
      description: "Ozzy XP Reward", 
      format: "multiplier",
      color: "green" 
    },
    { 
      id: "i36", 
      name: "Inscryption #36", 
      hunter: "ozzy", 
      type: "level", 
      add: 0.03, 
      maxLevel: 5, 
      description: "Ozzy ATK Speed", 
      format: "seconds",
      color: "green" 
    },
    { 
      id: "i37", 
      name: "Inscryption #37", 
      hunter: "ozzy", 
      type: "level", 
      add: 1.11, 
      maxLevel: 7, 
      description: "Ozzy DMG Reduction", 
      format: "percent",
      color: "green" 
    },
    { 
      id: "i40", 
      name: "Inscryption #40", 
      hunter: "ozzy", 
      type: "level", 
      add: 0.5, 
      maxLevel: 10, 
      description: "Ozzy Multistrike Chance", 
      format: "percent",
      color: "green" 
    },
    { 
      id: "i44", 
      name: "Inscryption #44", 
      hunter: "borge", 
      type: "level", 
      multiplier: 1.08, 
      maxLevel: 10, 
      description: "Borge Loot Reward", 
      format: "multiplier",
      color: "red" 
    },
    { 
      id: "i60", 
      name: "Inscryption #60", 
      hunter: "borge", 
      type: "level", 
      special: true,
      maxLevel: 10, 
      description: "Borge Multi-Power", 
      format: "specialMultiplier",
      baseBonus: 0.03, 
      bonusNames: [
        "Borge ATK Power",
        "Borge Max HP",
        "Borge Loot Reward"
      ],
      color: "red" 
    },
    { 
      id: "i80", 
      name: "Inscryption #80", 
      hunter: "borge", 
      type: "level", 
      multiplier: 1.1, 
      maxLevel: 10, 
      description: "Borge Loot Rewards", 
      format: "multiplier",
      color: "red" 
    },
    { 
      id: "i81", 
      name: "Inscryption #81", 
      hunter: "ozzy", 
      type: "level", 
      multiplier: 1.1, 
      maxLevel: 10, 
      description: "Ozzy Loot Rewards", 
      format: "multiplier",
      color: "green" 
    },
    { 
      id: "i84", 
      name: "Inscryption #84", 
      hunter: "borge", 
      type: "level", 
      add: 5, 
      maxLevel: 10, 
      description: "Borge Max HP", 
      format: "percent",
      color: "red" 
    },
    { 
      id: "i86", 
      name: "Inscryption #86", 
      hunter: "ozzy", 
      type: "level", 
      add: 0.2, 
      maxLevel: 7, 
      description: "Ozzy DMG Reduction", 
      format: "percent",
      color: "green" 
    },
    { 
      id: "i87", 
      name: "Inscryption #87", 
      hunter: "borge", 
      type: "level", 
      add: 5,
      //multiplier: 1.05, 
      maxLevel: 10, 
      description: "Borge ATK Power", 
      format: "percent", //eigentlich multiplier
      color: "red" 
    },
    { 
      id: "i88", 
      name: "Inscryption #88", 
      hunter: "borge", 
      type: "level", 
      add: 0.4, 
      maxLevel: 7, 
      description: "Borge Crit Chance", 
      format: "percent",
      color: "red" 
    },
    { 
      id: "i89", 
      name: "Inscryption #89", 
      hunter: "borge", 
      type: "level", 
      add: 0.2, 
      maxLevel: 7, 
      description: "Borge Effect Chance", 
      format: "percent",
      color: "red" 
    },
    { 
      id: "i91", 
      name: "Inscryption #91", 
      hunter: "borge", 
      type: "level", 
      add: 0.2, 
      maxLevel: 7, 
      description: "Borge DMG Reduction", 
      format: "percent",
      color: "red" 
    },
    { 
      id: "i92", 
      name: "Inscryption #92", 
      hunter: "ozzy", 
      type: "level", 
      add: 0.2, 
      maxLevel: 7, 
      description: "Ozzy Effect Chance", 
      format: "percent",
      color: "green" 
    }
  ],

  ///////////////GEMS////////////////

  gems: [
    {
      id: 'exodus',
      name: 'Exodus Gem',
      type: 'level',
      maxLevel: 4,
      color: "purple",
      nodes: []
    },
    {
      id: 'creation',
      name: 'Creation Gem',
      type: 'level',
      maxLevel: 3,
      color: "red",
      nodes: [
        { id: 'gem1', name: 'Creation Gem Node #1', type: 'boolean' },
        { id: 'gem2', name: 'Creation Gem Node #2', type: 'boolean' },
        { id: 'gem3', name: 'Creation Gem Node #3', type: 'boolean' }
      ]
    },
    {
      id: 'innovation',
      name: 'Innovation Gem',
      type: 'level',
      maxLevel: 2,
      color: "yellow",
      nodes: [
        { id: 'gem2', name: 'Innovation Gem Node #2', type: 'boolean' },
        { id: 'gem3', name: 'Innovation Gem Node #3', type: 'boolean' }
      ]
    },
    {
      id: 'attraction',
      name: 'Attraction Gem',
      type: 'level',
      maxLevel: 3,
      color: "blue",
      nodes: [
        { id: 'lootBorge', name: 'Loot (Borge)', type: 'level', maxLevel: 50, },
        { id: 'lootOzzy', name: 'Loot (Ozzy)', type: 'level', maxLevel: 50 },
        { id: 'catchUp', name: 'Catch-Up Power', type: 'level', maxLevel: 5 },
        { id: 'gem2', name: 'Attraction Gem Node #2', type: 'boolean' },
        { id: 'gem3', name: 'Attraction Gem Node #3', type: 'boolean' }
      ]
    }
  ],

  ///////////////LOOPMODS////////////////
  
    loopmods: [
      {
        id: "trample",
        name: "Trample: Borge",
        hunter: "borge",
        type: "boolean",
        upgradeType: "effect", // Spezialeffekt-Upgrade
        description: "Enables Borge Trample Effect",
      },
      {
        id: "scavenger",
        name: "Scavengers Advantage",
        hunter: "borge",
        type: "level",
        upgradeType: "multiplicative",
        value: 1.05,  // multipliziert mit 1.05 pro Level
        maxLevel: 25,
        description: "Borge Loot Rewards",
      },
      {
        id: "scavenger2",
        name: "Scavengers Advantage 2",
        hunter: "ozzy",
        type: "level",
        upgradeType: "multiplicative",
        value: 1.05,  // multipliziert mit 1.05 pro Level
        maxLevel: 25,
        description: "Ozzy Loot Rewards",
      },
    ],

  ///////////////IAP////////////////

  iap: [
    {
      id: "travpack",
      name: "Traversal Pack",
      type: "boolean",
      value: 1.25,
      multitext: "Loot Reward",
    },
  ],

  ///////////////ULTIMA LOOT////////////////

  ultima: [
    {
      id: "ulti",
      name: "Ultima Hunter Loot Rewards Boost",
      maxLevel: Infinity,
      type: "static",          // kein "level"-Upgrade, sondern ein fixer, übergebener Wert
      multiplier: 1,           // Beispiel-Defaultwert; dieser Wert wird in der Box angepasst
      multitext: "Multiplier for Ultima Loot",
    },
  ],

  ///////////////DIAMOND SPECIAL////////////////

  diamondspecials: [
    {
      id: "hunterloot",
      name: "Hunter Loot Booster",
      type: "level",
      value: 0.025,
      upgradeType: "additive",
      maxLevel: 10,
      multitext: "Loot Reward",
    },
    {
      id: "reviveboost",
      name: "Revive Boost",
      type: "level",
      value: -3,
      upgradeType: "additive",
      maxLevel: 10,
      multitext: "Revive Boost",
    },
  ],

  ///////////////DIAMOND CARDS////////////////

  diamondcards: [
    {
      id: "gaiden",
      name: "Gaiden Card",
      type: "boolean",
      color: "red",
      bonuses: [
        { stat: "Max HP", value: 1.03 },
        { stat: "ATK Power", value: 1.03 },
        { stat: "HP Regen", value: 1.03 },
        { stat: "Loot Reward", value: 1.05 }
      ]
    },
    {
      id: "iridian",
      name: "Iridian Card",
      type: "boolean",      
      color: "green",
      bonuses: [
        { stat: "Max HP", value: 1.03 },
        { stat: "ATK Power", value: 1.03 },
        { stat: "HP Regen", value: 1.03 },
        { stat: "Loot Reward", value: 1.05 }
      ]
    },
  ],

};