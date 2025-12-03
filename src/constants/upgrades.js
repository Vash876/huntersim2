export const UPGRADES = {

  ///////////////RELICS////////////////

  relics: [
    {
      id: "r4",
      tier: 1,
      name: "#4 The Disk of Dawn",
      type: "level",
      upgradeType: "additive",   
      value: 0.03,              
      maxLevel: 100,
      multitext: "Max HP",
    },
    {
      id: "r7",
      tier: 1,
      name: "#7 Manifestation Core: Titan",
      type: "level",
      upgradeType: "multiplicative", 
      value: 1.05,                  
      maxLevel: 100,
      multitext: "Loot Reward",
    },
    {
      id: "r16",
      tier: 1,
      name: "#16 The Long-Range Artillery Crawler",
      type: "level",
      upgradeType: "additive",
      value: 0.03,              
      maxLevel: 100,
      multitext: "ATK Power",
    },
    {
      id: "r17",
      tier: 1,
      name: "#17 The Bee-gone Companion Drone",
      type: "level",
      upgradeType: "additive",
      value: 0.03,             
      maxLevel: 100,
      multitext: "ATK Power",
    },
    {
      id: "r19",
      tier: 1,
      name: "#19 The Book of Mephisto",
      type: "level",
      upgradeType: "multiplicative",
      value: 2,                 
      maxLevel: 8,
      multitext: "EXP Gained",
    },
    {
      id: "t2r5",
      tier: 2,
      unlock_gem: "power",
      unlock_lvl: 3,
      name: "#5 The Gorgon Eye",
      type: "level",
      upgradeType: "multiplicative",
      value: 1.08 ,
      maxLevel: 100,
      multitext: "Loot Reward",
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
      unlock_gem: "innovation",
      unlock_lvl: 2,
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
    {
      id: "res95",
      name: "Research #95",
      hunter: "all",
      type: "level",
      maxLevel: 6,
      temporary: true,
      multitext: "Loot Reward",
      unlock_gem: "innovation",
      unlock_lvl: 3,
      tiers: [
        { level: 0, multipliers: { borge: 1.0, ozzy: 1.0, knox: 1.0 } },
        { level: 1, multipliers: { borge: 1.02, ozzy: 1.02, knox: 1.02 } },
        { level: 2, multipliers: { borge: 1.05, ozzy: 1.05, knox: 1.05 } },
        { level: 3, multipliers: { borge: 1.09, ozzy: 1.09, knox: 1.09 } },
        { level: 4, multipliers: { borge: 1.15, ozzy: 1.15, knox: 1.15 } },  
        { level: 5, multipliers: { borge: 1.21, ozzy: 1.21, knox: 1.21 } },  
        { level: 6, multipliers: { borge: 1.30, ozzy: 1.30, knox: 1.30 } }, 
      ]
    },
    {
      id: "res105",
      name: "Research #105",
      hunter: "all",
      type: "level",
      maxLevel: 6,
      multitext: "Loot Reward",
      unlock_gem: "innovation",
      unlock_lvl: 3,
      tiers: [
        { level: 0, multipliers: { borge: 1.0, ozzy: 1.0, knox: 1.0 } },
        { level: 1, multipliers: { borge: 1.2, ozzy: 1.0, knox: 1.0 } },
        { level: 2, multipliers: { borge: 1.2, ozzy: 1.2, knox: 1.0 } },
        { level: 3, multipliers: { borge: 1.2, ozzy: 1.2, knox: 1.2 } },
        { level: 4, multipliers: { borge: 1.56, ozzy: 1.2, knox: 1.2 } },  
        { level: 5, multipliers: { borge: 1.56, ozzy: 1.56, knox: 1.2 } },  
        { level: 6, multipliers: { borge: 1.56, ozzy: 1.56, knox: 1.56 } }, 
      ]
    }
  ],

  ///////////////GADGETS////////////////

  gadgets: [
    {
      id: "wrench",
      name: "The Wrench of Gore",
      type: "level",
      maxLevel: Infinity,
      unlock_gem: "exodus",
      unlock_lvl: 4,
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
      unlock_gem: "exodus",
      unlock_lvl: 4,
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
      unlock_gem: "exodus",
      unlock_lvl: 4,
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
      description: "Max HP", 
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
      description: "Crit Chance", 
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
      description: "Effect Chance", 
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
      description: "ATK Power", 
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
      description: "Loot Reward", 
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
      description: "ATK Speed", 
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
      description: "DMG Reduction", 
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
      description: "Max HP", 
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
      description: "Effect Chance", 
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
      description: "Loot Reward", 
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
      description: "XP Reward", 
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
      description: "ATK Speed", 
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
      description: "DMG Reduction", 
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
      description: "Multistrike Chance", 
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
      description: "Loot Reward", 
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
      description: "Multi-Power", 
      format: "specialMultiplier",
      baseBonus: 0.03, 
      bonusNames: [
        "ATK Power",
        "Max HP",
        "Loot Reward"
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
      description: "Loot Rewards", 
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
      description: "Loot Rewards", 
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
      description: "Max HP", 
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
      description: "DMG Reduction", 
      format: "percent",
      color: "green" 
    },
    { 
      id: "i87", 
      name: "Inscryption #87", 
      hunter: "borge", 
      type: "level", 
      multiplier: 1.05, 
      maxLevel: 10, 
      description: "ATK Power", 
      format: "multiplier",
      color: "red" 
    },
    { 
      id: "i88", 
      name: "Inscryption #88", 
      hunter: "borge", 
      type: "level", 
      add: 0.4, 
      maxLevel: 7, 
      description: "Crit Chance", 
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
      description: "Effect Chance", 
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
      description: "DMG Reduction", 
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
      description: "Effect Chance", 
      format: "percent",
      color: "green" 
    },
    {
      id: "i103",
      name: "Inscryption #103",
      hunter: "borge",
      type: "level",
      multiplier: 1.08,
      maxLevel: 8,
      description: "Loot Rewards",
      format: "multiplier",
      color: "red"
    },
    {
      id: "i104",
      name: "Inscryption #104",
      hunter: "ozzy",
      type: "level",
      multiplier: 1.08,
      maxLevel: 8,
      description: "Loot Rewards",
      format: "multiplier",
      color: "green"
    },
    {
      id: "i105",
      name: "Inscryption #105",
      hunter: "knox",
      type: "level",
      multiplier: 1.08,
      maxLevel: 8,
      description: "Loot Rewards",
      format: "multiplier",
      color: "blue"
    },
  ],

  ///////////////GEMS////////////////

  gems: [
    {
      id: 'exodus',
      name: 'Exodus Gem',
      type: 'level',
      maxLevel: 4,
      color: "purple",
      nodes: [
        { id: 'gem1', name: 'Exodus Gem Node #1', type: 'boolean' },
        { id: 'gem2', name: 'Exodus Gem Node #2', type: 'boolean' },
        { id: 'gem3', name: 'Exodus Gem Node #3', type: 'boolean' },
        { id: 'gem4', name: 'Exodus Gem Node #4', type: 'boolean' },
        { id: 'gem5', name: 'Exodus Gem Node #5', type: 'boolean' },
        { id: 'gem6', name: 'Exodus Gem Node #6', type: 'boolean' },
        { id: 'temporalEvolutionCount', name: 'Temporal & Evolution Upgrades Count', type: 'level'},
        { id: 'powerInnovationCount', name: 'Power & Innovation Upgrades Count', type: 'level'},
        { id: 'attractionCreationCount', name: 'Attraction & Creation Upgrades Count', type: 'level'}
      ]
    },
    {
      id: 'temporal',
      name: 'Temporal Gem',
      type: 'level',
      maxLevel: 4,
      color: "red",
      nodes: [
        { id: 'gem4', name: 'Temporal Gem Node #4', type: 'boolean' }, // Improved Helltouch Barrier ✅
        { id: 'gem6', name: 'Temporal Gem Node #6', type: 'boolean' }, // Borge, Ozzy, Knox atk, hp and loot +3% ✅

      ]
    },
    {
      id: 'creation',
      name: 'Creation Gem',
      type: 'level',
      maxLevel: 4,
      color: "orange",
      nodes: [
        { id: 'gem1', name: 'Creation Gem Node #1', type: 'boolean' },
        { id: 'gem2', name: 'Creation Gem Node #2', type: 'boolean' },
        { id: 'gem3', name: 'Creation Gem Node #3', type: 'boolean' },
        { id: 'gem4', name: 'Creation Gem Node #4', type: 'boolean' }, // Knox HP & Regen +8% && Borge, Ozzy and Knox Secondary DR +3%
        { id: 'gem5', name: 'Creation Gem Node #5', type: 'boolean' }, // Every lvl in Galv Trinkets increases Borge, Ozzy and Knox hp by 0.1%
        { id: 'gem6', name: 'Creation Gem Node #6', type: 'boolean' }, // Ozzy starting at lvl 70 gains hp +1,5%, atk +1% and regen +0.5% every lvl

        { id: 'borgeGU', name: 'Borge Stat Bonus', type: 'level', maxLevel: 50, minGemLevel: 4 },
        { id: 'ozzyGU', name: 'Ozzy Stat Bonus', type: 'level', maxLevel: 50, minGemLevel: 4 },
        { id: 'knoxGU', name: 'Knox Stat Bonus', type: 'level', maxLevel: 50, minGemLevel: 4 },
        { id: 'galvTrinketsCount', name: 'Galvarium Trinkets Count', type: 'level', maxLevel: Infinity, minGemLevel: 4 }
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
        { id: 'gem3', name: 'Innovation Gem Node #3', type: 'boolean' },
        { id: 'gem5', name: 'Innovation Gem Node #5', type: 'boolean' }  // Borge, Ozzy, Knox Loot x1.3 ✅
      ]
    },
    {
      id: 'power',
      name: 'Power Gem',
      type: 'level',
      maxLevel: 3,
      color: "purple",
      nodes: [
        { id: 'gem6', name: 'Power Gem Node #6', type: 'boolean' } // Knox starting at lvl 30 gains hp +1,5%, atk +1% and regen +0.5% every lvl
      ]
    },
    {
      id: 'attraction',
      name: 'Attraction Gem',
      type: 'level',
      maxLevel: 4,
      color: "blue",
      nodes: [
        { id: 'lootBorge', name: 'Loot (Borge)', type: 'level', maxLevel: 50, },
        { id: 'lootOzzy', name: 'Loot (Ozzy)', type: 'level', maxLevel: 50 },
        { id: 'lootKnox', name: 'Loot (Knox)', type: 'level', maxLevel: 50, minGemLevel: 4 },
        { id: 'catchUp', name: 'Catch-Up Power (Borge/Ozzy)', type: 'level', maxLevel: 5 },
        { id: 'catchUp2', name: 'Catch-Up Power (Knox)', type: 'level', maxLevel: 5, minGemLevel: 4 },
        { id: 'gem2', name: 'Attraction Gem Node #2', type: 'boolean' },
        { id: 'gem3', name: 'Attraction Gem Node #3', type: 'boolean' },
      ]
    },
    {
      id: 'evolution',
      name: 'Evolution Gem',
      type: 'level',
      maxLevel: 1,
      color: "darkgreen",
      nodes: [
        { id: 'gem2', name: 'Evolution Gem Node #2', type: 'boolean' }, // Borge, Ozzy, Knox Loot +10%
        { id: 'gem3', name: 'Evolution Gem Node #3', type: 'boolean' },
        { id: 'gem6', name: 'Evolution Gem Node #6', type: 'boolean' }  // Borge, Ozzy, Knox Crit Chance +2%
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
      temporary: true,
      upgradeType: "effect", // Spezialeffekt-Upgrade
      description: "Enables Borge Trample Effect",
    },
    {
      id: "scavenger",
      name: "Scavengers Advantage",
      hunter: "borge",
      type: "level",
      upgradeType: "multiplicative",
      temporary: true,
      value: 1.05,  // multipliziert mit 1.05 pro Level
      maxLevel: 25,
      description: "Loot Rewards",
    },
    {
      id: "scavenger2",
      name: "Scavengers Advantage 2",
      hunter: "ozzy",
      type: "level",
      upgradeType: "multiplicative",
      temporary: true,
      value: 1.05,  // multipliziert mit 1.05 pro Level
      maxLevel: 25,
      description: "Loot Rewards",
    },
    {
      id: "stelzi",
      name: "Mutual Mining Agreement: The Stelzi",
      hunter: "all",
      type: "level",
      upgradeType: "multiplicative",
      temporary: true,
      value: 1.02,  
      maxLevel: 8,  //+e600 cost
      description: "Loot Rewards",
    },
  ],

  ///////////////CONSTRUCTION MILESTONES////////////////
  
  cms: [
    {
      id: "cm46",
      name: "CM #46",
      type: "boolean",
      temporary: true,
      value: 1.03,
      multitext: "Hunter Loot Rewards",
      unlock_gem: "power",
      unlock_lvl: 2,
    },
    {
      id: "cm47",
      name: "CM #47",
      type: "boolean",
      temporary: true,
      value: 1.02,
      multitext: "Hunter Loot Rewards",
      unlock_gem: "power",
      unlock_lvl: 2,
    },
    {
      id: "cm48",
      name: "CM #48",
      type: "boolean",
      temporary: true,
      value: 1.07,
      multitext: "Hunter Loot Rewards",
      unlock_gem: "power",
      unlock_lvl: 2,
    },
    {
      id: "cm51",
      name: "CM #51",
      type: "boolean",
      temporary: true,
      value: 1.05,
      multitext: "Hunter Loot Rewards",
      unlock_gem: "power",
      unlock_lvl: 2,
    },
    {
      id: "cm53",
      name: "CM #53",
      type: "boolean",
      temporary: true,
      value: 1.02,
      multitext: "Hunter Loot Rewards",
      unlock_gem: "power",
      unlock_lvl: 2,
    },
    {
      id: "cm54",
      name: "CM #54",
      type: "boolean",
      temporary: true,
      value: 1.02,
      multitext: "Hunter Loot Rewards",
      unlock_gem: "power",
      unlock_lvl: 2,
    },
    {
      id: "cm57",
      name: "CM #57",
      type: "boolean",
      temporary: true,
      value: 1.1,
      multitext: "Hunter Loot Rewards",
      unlock_gem: "power",
      unlock_lvl: 2,
    },
    {
      id: "exodus_gem4",
      name: "Milestones Count ",
      hunter: "all",
      type: "level",
      upgradeType: "additive",
      temporary: true,
      value: 1.01,  
      maxLevel: 75,
      description: "Attack Speed",
      unlock_gem: "exodus",
      unlock_lvl: 1,
      unlock_node: 4,
    },
  ],

  ///////////////TRINKETS////////////////

  trinkets: [
    {
      id: "last_handbook",
      name: "The Lost Last Manufacturer's Handbook",
      hunter: "all",
      type: "level",
      value: 0.001,
      upgradeType: "additive",
      maxLevel: Infinity,
      unlock_gem: "creation",
      unlock_lvl: 4,
      unlock_node: 5,
    },
    {
      id: "transmission_amplifier",
      name: "The Pocket Directive Transmission Amplifier",
      hunter: "all",
      type: "level",
      value: 0.001,
      upgradeType: "additive",
      maxLevel: Infinity,
      unlock_gem: "creation",
      unlock_lvl: 4,
      unlock_node: 5,
    },
      {
      id: "ouro_codex",
      name: "The Ouroboros Recursive Codex",
      hunter: "all",
      type: "level",
      value: 0.001,
      upgradeType: "additive",
      maxLevel: Infinity,
      unlock_gem: "creation",
      unlock_lvl: 4,
      unlock_node: 5,
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