// Basisinformationen zu jeder Loop-Mod-Familie
export const LOOP_MOD_TEMPLATES = {
  // Accumulative Level Growth Familie
  "ALG_Alpha": {
    baseName: "Accumulative Level Growth Alpha",
    buffs: ["Cells", "MP", "Shards"],
    tier: "B"
  },
  "ALG_Beta": {
    baseName: "Accumulative Level Growth Beta",
    buffs: ["Ticks per Tick Loop", "LR Requirment"],
    tier: "C" 
  },
  "ALG_Ceti": {
    baseName: "Accumulative Level Growth Ceti",
    buffs: ["MK1", "MK2", "MK3"],
    tier: "C"
  },
  "ALG_Delta": {
    baseName: "Accumulative Level Growth Delta",
    buffs: ["Cells", "LP", "Cradle/Aux/Dem Ranks"],
    tier: "C"
  },
  "ALG_Epsilon": {
    baseName: "Accumulative Level Growth Epsilon",
    buffs: ["MP", "Shards", "RP"],
    tier: "S"
  },
  "ALG_Fenix": {
    baseName: "Accumulative Level Growth Fenix",
    buffs: ["RP", "Cradle/Aux/Zag/Heph/Dem/Koios Ranks"],
    tier: "C"
  },
  "ALG_Gamma": {
    baseName: "Accumulative Level Growth Gamma",
    buffs: ["MK4", "MK5", "MK6"],
    tier: "B"
  },
  "ALG_Helion": {
    baseName: "Accumulative Level Growth Helion",
    buffs: ["LRR", "Ticks per Tick Loop", "AP", "MK7", "MK8"],
    tier: "B"
  },
  
  // Ultima Rules
  "UR_Auxesia": {
    baseName: "Ultima: Rule of the Auxesia",
    buffs: ["Techs", "Aux Ranks"],
    requiresTemp3: true,
    tier: "A"
  },
  "UR_Biology": {
    baseName: "Ultima: Rule of Biology",
    buffs: ["Cells", "Cells", "Cells", "& Cells"],
    tier: "B"
  },
  "UR_Cradle": {
    baseName: "Ultima: Rule of the Cradle",
    buffs: ["All Gens", "Cradle Ranks"],
    tier: "A"
  },
  "UR_Demeter": {
    baseName: "Ultima: Rule of the Demeter",
    buffs: ["Shards", "Dem Ranks"],
    requiresTemp3: true,
    tier: "A"
  },
  "UR_Destruction": {
    baseName: "Ultima: Rule of Destruction",
    buffs: ["MP", "Crew Cost", "Shards", "Ship Rank Points", "AP"],
    tier: "B"
  },
  "UR_HardWork": {
    baseName: "Ultima: Rule of Hard Work",
    buffs: ["Shard Milestones Max Level"],
    tier: "B"
  },
  "UR_Hephaestus": {
    baseName: "Ultima: Rule of the Hephaestus",
    buffs: ["Cells", "Heph Ranks"],
    requiresTemp3: true,
    tier: "A"
  },
  "UR_Koios": {
    baseName: "Ultima: Rule of the Koios",
    buffs: ["RP", "Koios Ranks"],
    requiresTemp3: true,
    tier: "A"
  },
  "UR_Looping": {
    baseName: "Ultima: Rule of Looping",
    buffs: ["All Gens", "MP", "RP", "Mats"],
    tier: "S"
  },
  "UR_Mastery": {
    baseName: "Ultima: Rule of Mastery",
    buffs: ["Mission Retention", "Mission EXP", "Mastery Bonuses"],
    tier: "B"
  },
  "UR_Perseverance": {
    baseName: "Ultima: Rule of Perseverance",
    buffs: ["RP", "Shards", "All Gens", "MP", "LP"],
    tier: "S"
  },
  "UR_Productivity": {
    baseName: "Ultima: Rule of the Productivity",
    buffs: ["Mission Speed", "Personnel", "Mats"],
    tier: "S"
  },
  "UR_Research": {
    baseName: "Ultima: Rule of Research",
    buffs: ["Cells", "Scientists", "Research Mults"],
    tier: "B"
  },
  "UR_Swarm": {
    baseName: "Ultima: Rule of the Swarm",
    buffs: ["Cells", "Mission Speed", "All Gens", "Shards", "Mats"],
    tier: "A"
  },
  "UR_Temporality": {
    baseName: "Ultima: Rule of Temporality",
    buffs: ["Ticks Per Tick"],
    requiresTemp3: true,
    tier: "S"
  },
  "UR_Zagreus": {
    baseName: "Ultima: Rule of the Zagreus",
    buffs: ["MP", "Zag Ranks"],
    requiresTemp3: true,
    tier: "A"
  },
  "UR_Zeus": {
    baseName: "Ultima: Rule of the Zeus",
    buffs: ["AP", "Mats", "& Zeus Ranks"],
    requiresTemp3: true,
    tier: "S"
  },
  
  // Planeta Sekhur
  "UP_Sekhur": {
    baseName: "Ultima: Planet Sekhur-5",
    buffs: ["Mats"],
    tier: "B"
  },
  
  // Boons
  "BO_Axion": {
    baseName: "Boon of Ouroboros: Axion",
    buffs: ["Cells", "Cells", "Ticks per Tick Loop"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Behemoth": {
    baseName: "Boon of Ouroboros: Behemoth",
    buffs: ["Cells", "Shards", "Ticks per Tick Loop"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Cosmos": {
    baseName: "Boon of Ouroboros: Cosmos",
    buffs: ["Cells", "MP", "Ticks per Tick Loop"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Divinity": {
    baseName: "Boon of Ouroboros: Divinity",
    buffs: ["Cells", "MP", "RP"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Eternity": {
    baseName: "Boon of Ouroboros: Eternity",
    buffs: ["OO", "Camp Frags", "Mats"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Fabrication": {
    baseName: "Boon of Ouroboros: Fabrication",
    buffs: ["All Gens", "MP", "Mats"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Genesis": {
    baseName: "Boon of Ouroboros: Genesis",
    buffs: ["Cells", "Shards", "RP"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Hegemony": {
    baseName: "Boon of Ouroboros: Hegemony",
    buffs: ["AP", "OO", "Camp Frags"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Ichor": {
    baseName: "Boon of Ouroboros: Ichor",
    buffs: ["All Gens", "MP", "Ticks per Tick Loop"],
    requiresTemp3: true,
    tier: "S"
  },
  "BO_Juncture": {
    baseName: "Boon of Ouroboros: Juncture",
    buffs: ["Ultima Cap", "AMC", "Boon Cap"],
    requiresTemp3: true,
    tier: "S"
  },
  
  // Spoils of War
  "SOW_AP": {
    baseName: "Spoils of War: Sirene-6 AP Module",
    buffs: ["AP"],
    tier: "B"
  },
  "SOW_Mats": {
    baseName: "Spoils of War: Sirene-6 Mats Module",
    buffs: ["Mats"],
    tier: "B"
  }
};

// Die tatsächlichen Loop-Mod-Instanzen mit Leveln, Kosten und spezifischen Anforderungen
export const LOOP_MODS = [
  // Accumulative Level Growth Alpha (kompakte Darstellung aller Level)
  ...Array.from({ length: 25 }, (_, i) => {
    const level = 88 + i;
    const requiresI753 = level >= 110;
    return {
      type: "ALG_Alpha",
      level,
      cost: level === 88 ? 3423 : 
             level === 89 ? 3462 :
             level === 90 ? 3501 :
             level === 91 ? 3540 :
             level === 92 ? 3579 :
             level === 93 ? 3619 :
             level === 94 ? 3658 :
             level === 95 ? 3697 :
             level === 96 ? 3736 :
             level === 97 ? 3775 :
             level === 98 ? 3815 :
             level === 99 ? 3854 :
             level === 100 ? 3893 :
             level === 101 ? 3932 :
             level === 102 ? 3971 :
             level === 103 ? 4010 :
             level === 104 ? 4050 :
             level === 105 ? 4089 :
             level === 106 ? 4208 :
             level === 107 ? 4327 :
             level === 108 ? 4446 :
             level === 109 ? 4566 :
             level === 110 ? 4685 :
             level === 111 ? 4844 :
             4983, // level 112
      requiresI753
    };
  }),
  
  // Accumulative Level Growth Beta
  { type: "ALG_Beta", level: 6, cost: 3875 },
  { type: "ALG_Beta", level: 7, cost: 4645 },
  { type: "ALG_Beta", level: 8, cost: 5414 },
  { type: "ALG_Beta", level: 9, cost: 6183 },
  
  // Accumulative Level Growth Ceti
  { type: "ALG_Ceti", level: 37, cost: 1836, requiresI753: true },
  
  // Accumulative Level Growth Delta
  { type: "ALG_Delta", level: 22, cost: 2618, requiresI753: true },
  
  // Accumulative Level Growth Epsilon
  { type: "ALG_Epsilon", level: 22, cost: 4036, requiresI753: true },
  
  // Accumulative Level Growth Fenix
  { type: "ALG_Fenix", level: 17, cost: 4394, requiresI753: true },
  
  // Accumulative Level Growth Gamma
  { type: "ALG_Gamma", level: 37, cost: 4228, requiresI753: true },
  
  // Accumulative Level Growth Helion
  { type: "ALG_Helion", level: 14, cost: 3524 },
  { type: "ALG_Helion", level: 15, cost: 4096 },
  { type: "ALG_Helion", level: 16, cost: 4667 },
  { type: "ALG_Helion", level: 17, cost: 5239 },
  { type: "ALG_Helion", level: 18, cost: 5810 },
  
  // Ultima: Rule of the Auxesia
  { type: "UR_Auxesia", level: 1, cost: 2800 },
  { type: "UR_Auxesia", level: 2, cost: 3022 },
  { type: "UR_Auxesia", level: 3, cost: 3244 },
  { type: "UR_Auxesia", level: 4, cost: 3466 },
  { type: "UR_Auxesia", level: 5, cost: 3688 },
  { type: "UR_Auxesia", level: 6, cost: 3910 },
  { type: "UR_Auxesia", level: 7, cost: 4132 },
  { type: "UR_Auxesia", level: 8, cost: 4354 },
  { type: "UR_Auxesia", level: 9, cost: 4576 },
  { type: "UR_Auxesia", level: 10, cost: 4798 },
  { type: "UR_Auxesia", level: 11, cost: 5020 },
  { type: "UR_Auxesia", level: 12, cost: 5242 },
  { type: "UR_Auxesia", level: 13, cost: 5464 },
  { type: "UR_Auxesia", level: 14, cost: 5686 },
  { type: "UR_Auxesia", level: 15, cost: 5908 },
  
  // Ultima: Rule of Biology
  { type: "UR_Biology", level: 11, cost: 5125, requiresUltimaCap: 10 },
  { type: "UR_Biology", level: 12, cost: 5400, requiresUltimaCap: 11 },
  { type: "UR_Biology", level: 13, cost: 5675, requiresUltimaCap: 12 },
  
  // Ultima: Rule of the Cradle
  { type: "UR_Cradle", level: 18, cost: 4550, requiresUltimaCap: 11 },
  { type: "UR_Cradle", level: 19, cost: 4830, requiresUltimaCap: 12 },
  
  // Ultima: Rule of the Demeter
  { type: "UR_Demeter", level: 1, cost: 3400 },
  { type: "UR_Demeter", level: 2, cost: 3955 },
  { type: "UR_Demeter", level: 3, cost: 4510 },
  { type: "UR_Demeter", level: 4, cost: 5065 },
  { type: "UR_Demeter", level: 5, cost: 5620 },
  { type: "UR_Demeter", level: 6, cost: 6175 },
  { type: "UR_Demeter", level: 7, cost: 6730 },
  { type: "UR_Demeter", level: 8, cost: 7285 },
  { type: "UR_Demeter", level: 9, cost: 7840 },
  { type: "UR_Demeter", level: 10, cost: 8395 },
  
  // Ultima: Rule of Destruction
  { type: "UR_Destruction", level: 21, cost: 4300, requiresUltimaCap: 11 },
  { type: "UR_Destruction", level: 22, cost: 4570, requiresUltimaCap: 12 },
  
  // Ultima: Rule of Hard Work
  { type: "UR_HardWork", level: 31, cost: 3440 },
  { type: "UR_HardWork", level: 32, cost: 3520 },
  { type: "UR_HardWork", level: 33, cost: 3600 },
  { type: "UR_HardWork", level: 34, cost: 3680 },
  { type: "UR_HardWork", level: 35, cost: 3760 },
  { type: "UR_HardWork", level: 36, cost: 3840 },
  { type: "UR_HardWork", level: 37, cost: 3920 },
  { type: "UR_HardWork", level: 38, cost: 4000 },
  { type: "UR_HardWork", level: 39, cost: 4080 },
  { type: "UR_HardWork", level: 40, cost: 4160 },
  { type: "UR_HardWork", level: 41, cost: 5840 },
  
  // Ultima: Rule of the Hephaestus
  { type: "UR_Hephaestus", level: 1, cost: 3200 },
  { type: "UR_Hephaestus", level: 2, cost: 3644 },
  { type: "UR_Hephaestus", level: 3, cost: 4088 },
  { type: "UR_Hephaestus", level: 4, cost: 4532, requiresI753: true },
  { type: "UR_Hephaestus", level: 5, cost: 4976 },
  { type: "UR_Hephaestus", level: 6, cost: 5420 },
  { type: "UR_Hephaestus", level: 7, cost: 5864 },
  { type: "UR_Hephaestus", level: 8, cost: 6308 },
  { type: "UR_Hephaestus", level: 9, cost: 6752 },
  { type: "UR_Hephaestus", level: 10, cost: 7196 },
  { type: "UR_Hephaestus", level: 11, cost: 7640 },
  
  // Ultima: Rule of the Koios
  { type: "UR_Koios", level: 1, cost: 3600 },
  { type: "UR_Koios", level: 2, cost: 4266 },
  { type: "UR_Koios", level: 3, cost: 4932 },
  { type: "UR_Koios", level: 4, cost: 5598 },
  { type: "UR_Koios", level: 5, cost: 6264 },
  { type: "UR_Koios", level: 6, cost: 6930 },
  { type: "UR_Koios", level: 7, cost: 7596 },
  { type: "UR_Koios", level: 8, cost: 8262 },
  { type: "UR_Koios", level: 9, cost: 8928 },
  
  // Ultima: Rule of Looping
  { type: "UR_Looping", level: 6, cost: 3380 },
  { type: "UR_Looping", level: 7, cost: 3780 },
  { type: "UR_Looping", level: 8, cost: 4180 },
  { type: "UR_Looping", level: 9, cost: 4580 },
  { type: "UR_Looping", level: 10, cost: 4980 },
  { type: "UR_Looping", level: 11, cost: 5380 },
  { type: "UR_Looping", level: 12, cost: 5780 },
  { type: "UR_Looping", level: 13, cost: 6180 },
  { type: "UR_Looping", level: 14, cost: 6580 },
  { type: "UR_Looping", level: 15, cost: 6980 },
  { type: "UR_Looping", level: 16, cost: 7380 },
  { type: "UR_Looping", level: 17, cost: 7780 },
  
  // Ultima: Rule of Mastery
  { type: "UR_Mastery", level: 31, cost: 4519, requiresUltimaCap: 11 },
  { type: "UR_Mastery", level: 32, cost: 5085, requiresUltimaCap: 12 },
  
  // Ultima: Rule of Perseverance
  ...Array.from({ length: 36 }, (_, i) => {
    const level = 77 + i;
    let requiresUltimaCap = 0;
    if (level === 109) requiresUltimaCap = 9;
    if (level === 110) requiresUltimaCap = 10;
    if (level === 111) requiresUltimaCap = 11;
    if (level === 112) requiresUltimaCap = 12;
    
    return {
      type: "UR_Perseverance", 
      level,
      cost: level === 77 ? 3410 :
             level === 78 ? 3450 :
             level === 79 ? 3490 :
             level === 80 ? 3530 :
             level === 81 ? 3570 :
             level === 82 ? 3610 :
             level === 83 ? 3650 :
             level === 84 ? 3690 :
             level === 85 ? 3730 :
             level === 86 ? 3770 :
             level === 87 ? 3810 :
             level === 88 ? 3850 :
             level === 89 ? 3890 :
             level === 90 ? 3930 :
             level === 91 ? 3970 :
             level === 92 ? 4010 :
             level === 93 ? 4050 :
             level === 94 ? 4090 :
             level === 95 ? 4130 :
             level === 96 ? 4170 :
             level === 97 ? 4210 :
             level === 98 ? 4250 :
             level === 99 ? 4290 :
             level === 100 ? 4330 :
             level === 101 ? 4420 :
             level === 102 ? 4510 :
             level === 103 ? 4600 :
             level === 104 ? 4690 :
             level === 105 ? 4780 :
             level === 106 ? 4870 :
             level === 107 ? 4960 :
             level === 109 ? 5140 :
             level === 110 ? 5230 :
             level === 111 ? 5360 :
             level === 112 ? 5490 : 0,
      requiresUltimaCap: requiresUltimaCap || undefined
    };
  }).filter(item => item.cost > 0), // Filtere Einträge mit fehlenden Kosten
  
  // Ultima: Rule of the Productivity
  { type: "UR_Productivity", level: 9, cost: 3560 },
  { type: "UR_Productivity", level: 10, cost: 3930 },
  { type: "UR_Productivity", level: 11, cost: 4300 },
  { type: "UR_Productivity", level: 12, cost: 4670 },
  { type: "UR_Productivity", level: 13, cost: 5040 },
  { type: "UR_Productivity", level: 14, cost: 5410 },
  { type: "UR_Productivity", level: 15, cost: 5780 },
  { type: "UR_Productivity", level: 16, cost: 6150 },
  { type: "UR_Productivity", level: 17, cost: 6520 },
  
  // Ultima: Rule of Research
  { type: "UR_Research", level: 11, cost: 5300, requiresUltimaCap: 10 },
  { type: "UR_Research", level: 12, cost: 5596, requiresUltimaCap: 11 },
  { type: "UR_Research", level: 13, cost: 5893, requiresUltimaCap: 12 },
  
  // Ultima: Rule of the Swarm
  { type: "UR_Swarm", level: 41, cost: 4100, requiresUltimaCap: 11 },
  { type: "UR_Swarm", level: 42, cost: 4310, requiresUltimaCap: 12 },
  
  // Ultima: Rule of Temporality
  { type: "UR_Temporality", level: 1, cost: 5000 },
  
  // Ultima: Rule of the Zagreus
  { type: "UR_Zagreus", level: 1, cost: 3000 },
  { type: "UR_Zagreus", level: 2, cost: 3333 },
  { type: "UR_Zagreus", level: 3, cost: 3666 },
  { type: "UR_Zagreus", level: 4, cost: 3999 },
  { type: "UR_Zagreus", level: 5, cost: 4332 },
  { type: "UR_Zagreus", level: 6, cost: 4665 },
  { type: "UR_Zagreus", level: 7, cost: 4998 },
  { type: "UR_Zagreus", level: 8, cost: 5331 },
  { type: "UR_Zagreus", level: 9, cost: 5664 },
  { type: "UR_Zagreus", level: 10, cost: 5997 },
  { type: "UR_Zagreus", level: 11, cost: 6330 },
  { type: "UR_Zagreus", level: 12, cost: 6663 },
  
  // Ultima: Rule of the Zeus
  { type: "UR_Zeus", level: 1, cost: 3800 },
  { type: "UR_Zeus", level: 2, cost: 4577 },
  { type: "UR_Zeus", level: 3, cost: 5354 },
  { type: "UR_Zeus", level: 4, cost: 6131 },
  { type: "UR_Zeus", level: 5, cost: 6908 },
  { type: "UR_Zeus", level: 6, cost: 7685 },
  { type: "UR_Zeus", level: 7, cost: 8462 },
  { type: "UR_Zeus", level: 8, cost: 9239 },
  
  // Ultima: Planet Sekhur-5
  { type: "UP_Sekhur", level: 12, cost: 3370, requiresUltimaCap: 11 },
  { type: "UP_Sekhur", level: 13, cost: 3620, requiresUltimaCap: 12 },
  
  // Boon of Ouroboros
  { type: "BO_Axion", level: 2, cost: 7000 },
  { type: "BO_Behemoth", level: 2, cost: 7800 },
  { type: "BO_Cosmos", level: 2, cost: 8600 },
  { type: "BO_Divinity", level: 2, cost: 9400 },
  { type: "BO_Eternity", level: 2, cost: 10200 },
  { type: "BO_Fabrication", level: 1, cost: 3500 },
  { type: "BO_Fabrication", level: 2, cost: 11000 },
  { type: "BO_Genesis", level: 1, cost: 4100 },
  { type: "BO_Genesis", level: 2, cost: 11800 },
  { type: "BO_Hegemony", level: 1, cost: 4600 },
  { type: "BO_Hegemony", level: 2, cost: 12600 },
  { type: "BO_Ichor", level: 1, cost: 5400 },
  { type: "BO_Ichor", level: 2, cost: 13400 },
  { type: "BO_Juncture", level: 1, cost: 6200 },
  
  // Spoils of War
  { type: "SOW_AP", level: 6, cost: 3900 },
  { type: "SOW_Mats", level: 5, cost: 4150 },
  { type: "SOW_Mats", level: 6, cost: 5400 }
];

// Ultima Cap Upgrades für die Filter
export const ULTIMA_CAP_UPGRADES = [
  { id: "TS04", name: "TS#04", bonus: 1 },
  { id: "TS09", name: "TS#09", bonus: 2 },
  { id: "TS11", name: "TS#11", bonus: 2 },
  { id: "TS12", name: "TS#12", bonus: 2 },
  { id: "TS14", name: "TS#14", bonus: 3 },
  { id: "DarkLoopersBadge", name: "Dark Loopers Badge", bonus: 2 },
  { id: "BoonJ", name: "Boon J", bonus: 1 }
];

// Vorläufige Tier-Definitionen
export const TIER_DEFINITIONS = {
  "S": "Top tier upgrades with the strongest overall buffs",
  "A": "Very strong upgrades, almost essential for progression",
  "B": "Good upgrades that provide significant boosts",
  "C": "Decent upgrades, useful in specific situations",
  "D": "Weak upgrades, usually outclassed by other options",
  "E": "Very poor value, not recommended unless necessary for specific strategies"
};

// Hilfsfunktionen zum vereinfachten Zugriff auf Loop-Mods
export function getLoopModDetails(mod) {
  const template = LOOP_MOD_TEMPLATES[mod.type];
  
  return {
    name: `${template.baseName}`,
    level: mod.level,
    cost: mod.cost,
    buffs: template.buffs,
    requiresTemp3: template.requiresTemp3 || false,
    requiresI753: mod.requiresI753 || false,
    requiresUltimaCap: mod.requiresUltimaCap || 0,
    tier: template.tier
  };
}

// Hilfsfunktion um zu prüfen, ob genügend Ultima Cap für ein Upgrade vorhanden ist
export function hasEnoughUltimaCap(mod, activeCapUpgrades) {
  if (!mod.requiresUltimaCap) return true;
  
  const totalCap = activeCapUpgrades.reduce((sum, upgrade) => sum + upgrade.bonus, 0);
  return totalCap >= mod.requiresUltimaCap;
}

// Hilfsfunktion um alle Loop-Mods in flacher Struktur zu erhalten
export function getAllLoopMods() {
  return LOOP_MODS.map(getLoopModDetails);
}