/**
 * Gem Calculations for Mission & Relic Planner
 * 
 * Calculates effects from Gem Nodes based on gemPlannerStore state.
 * Most values are read-only, except for Creation Node 5 (Mechs) and Exodus Node 2 (Loopmods).
 */

/**
 * Get Gem Node states from gemPlannerStore
 * @param {object} gemStates - Gem states from gemPlannerStore
 * @returns {object} Node activation states
 */
export function getGemNodeStates(gemStates) {
  return {
    // Attraction Gem Nodes
    attraction_node_1: gemStates?.attraction?.nodes?.[0] || false,
    attraction_node_4: gemStates?.attraction?.nodes?.[3] || false,
    
    // Creation Gem Nodes
    creation_node_5: gemStates?.creation?.nodes?.[4] || false,
    
    // Exodus Gem Nodes
    exodus_node_2: gemStates?.exodus?.nodes?.[1] || false,
    
    // Power Gem Nodes
    power_node_1: gemStates?.power?.nodes?.[0] || false,
    power_node_2: gemStates?.power?.nodes?.[1] || false,
    power_node_3: gemStates?.power?.nodes?.[2] || false,
    power_node_4: gemStates?.power?.nodes?.[3] || false,
    power_node_5: gemStates?.power?.nodes?.[4] || false,
  };
}

/**
 * Calculate Attraction Gem Node effects
 * @param {object} nodeStates - Node activation states
 * @returns {object} Attraction gem effects
 */
export function calculateAttractionEffects(nodeStates) {
  const effects = {
    campaignFragsMultiplier: 1.0,
    allFragsMultiplier: 1.0,
  };
  
  // Node 1: Campaign frags x1.5
  if (nodeStates.attraction_node_1) {
    effects.campaignFragsMultiplier *= 1.5;
  }
  
  // Node 4: All frags x1.25
  if (nodeStates.attraction_node_4) {
    effects.allFragsMultiplier *= 1.25;
  }
  
  return effects;
}

/**
 * Calculate Creation Gem Node 5 effects
 * @param {boolean} isActive - Whether Creation Node 5 is active
 * @param {number} mechCount - Number of Mechs owned
 * @returns {object} Creation gem effects
 */
export function calculateCreationEffects(isActive, mechCount = 0) {
  const effects = {
    allFragsMultiplier: 1.0,
    mechCount: mechCount,
  };
  
  // Node 5: All fragments x1.001 per Mech owned
  if (isActive && mechCount > 0) {
    effects.allFragsMultiplier = Math.pow(1.001, mechCount);
  }
  
  return effects;
}

/**
 * Calculate Exodus Gem Node 2 effects
 * @param {boolean} isActive - Whether Exodus Node 2 is active
 * @param {number} loopmodsOwned - Number of Loopmods owned
 * @returns {object} Exodus gem effects
 */
export function calculateExodusEffects(isActive, loopmodsOwned = 0) {
  const effects = {
    allFragsMultiplier: 1.0,
    loopmodsOwned: loopmodsOwned,
  };
  
  // Node 2: All fragments +1% per 10000 Loopmods owned
  if (isActive && loopmodsOwned > 0) {
    const bonusPercent = Math.floor(loopmodsOwned / 10000);
    effects.allFragsMultiplier = 1.0 + (bonusPercent * 0.01);
  }
  
  return effects;
}

/**
 * Calculate Power Gem Node effects
 * @param {object} nodeStates - Node activation states
 * @returns {object} Power gem effects
 */
export function calculatePowerEffects(nodeStates) {
  const effects = {
    // Personnel bonuses
    t1PersonnelBonus: 0,
    t2PersonnelBonus: 0,
    t3PersonnelBonus: 0,
    t4PersonnelBonus: 0,
    
    // Power per unit bonuses
    t1PowerBonus: 0,
    t2PowerBonus: 0,
    t3PowerBonus: 0,
    t4PowerBonus: 0,
    
    // Relic max level bonuses
    relic5MaxLevelBonus: 0,
    relic6MaxLevelBonus: 0,
    
    // Fragment bonuses
    farmFragsAdditive: 0,
    farmFragsMultiplier: 1.0,
    campaignFragsMultiplier: 1.0,
  };
  
  // Node 1: +500 T1 personnel, +1 power for T1, max level for Relic 5 & 6: +3
  if (nodeStates.power_node_1) {
    effects.t1PersonnelBonus += 500;
    effects.t1PowerBonus += 1;
    effects.relic5MaxLevelBonus += 3;
    effects.relic6MaxLevelBonus += 3;
  }
  
  // Node 2: +300 T2 personnel, +2 power for T2, campaign frags x2
  if (nodeStates.power_node_2) {
    effects.t2PersonnelBonus += 300;
    effects.t2PowerBonus += 2;
    effects.campaignFragsMultiplier *= 2;
  }
  
  // Node 3: Farm frags +0.012
  if (nodeStates.power_node_3) {
    effects.farmFragsAdditive += 0.012;
  }
  
  // Node 4: +150 T3 personnel, +3 power for T3, farm frags x2
  if (nodeStates.power_node_4) {
    effects.t3PersonnelBonus += 150;
    effects.t3PowerBonus += 3;
    effects.farmFragsMultiplier *= 2;
  }
  
  // Node 5: +100 T4 personnel, +4 power for T4
  if (nodeStates.power_node_5) {
    effects.t4PersonnelBonus += 100;
    effects.t4PowerBonus += 4;
  }
  
  return effects;
}

/**
 * Get complete gem effects breakdown
 * @param {object} gemStates - Gem states from gemPlannerStore
 * @param {number} mechCount - Number of Mechs owned (for Creation Node 5)
 * @param {number} loopmodsOwned - Number of Loopmods owned (for Exodus Node 2)
 * @returns {object} Complete breakdown of gem effects
 */
export function getGemEffectsBreakdown(gemStates, mechCount = 0, loopmodsOwned = 0) {
  const nodeStates = getGemNodeStates(gemStates);
  
  const attractionEffects = calculateAttractionEffects(nodeStates);
  const creationEffects = calculateCreationEffects(nodeStates.creation_node_5, mechCount);
  const exodusEffects = calculateExodusEffects(nodeStates.exodus_node_2, loopmodsOwned);
  const powerEffects = calculatePowerEffects(nodeStates);
  
  // Combined fragment multipliers
  // Farm frags: Power Node 4 x2, Attraction Node 4 x1.25, Creation Node 5, Exodus Node 2
  const combinedFarmFragsMultiplier = powerEffects.farmFragsMultiplier 
    * attractionEffects.allFragsMultiplier 
    * creationEffects.allFragsMultiplier 
    * exodusEffects.allFragsMultiplier;
  
  // Campaign frags: Power Node 2 x2, Attraction Node 1 x1.5, Attraction Node 4 x1.25, Creation Node 5, Exodus Node 2
  const combinedCampaignFragsMultiplier = powerEffects.campaignFragsMultiplier
    * attractionEffects.campaignFragsMultiplier 
    * attractionEffects.allFragsMultiplier 
    * creationEffects.allFragsMultiplier 
    * exodusEffects.allFragsMultiplier;
  
  return {
    // Node states (for display)
    nodeStates,
    
    // Personnel bonuses from Power Gem
    personnelBonuses: {
      T1: powerEffects.t1PersonnelBonus,
      T2: powerEffects.t2PersonnelBonus,
      T3: powerEffects.t3PersonnelBonus,
      T4: powerEffects.t4PersonnelBonus,
    },
    
    // Power bonuses from Power Gem
    powerBonuses: {
      T1: powerEffects.t1PowerBonus,
      T2: powerEffects.t2PowerBonus,
      T3: powerEffects.t3PowerBonus,
      T4: powerEffects.t4PowerBonus,
    },
    
    // Relic max level bonuses
    relicMaxLevelBonuses: {
      relic_5: powerEffects.relic5MaxLevelBonus,
      relic_6: powerEffects.relic6MaxLevelBonus,
    },
    
    // Fragment effects
    farmFragsAdditive: powerEffects.farmFragsAdditive,
    farmFragsMultiplier: combinedFarmFragsMultiplier,
    campaignFragsMultiplier: combinedCampaignFragsMultiplier,
    
    // Input values for display
    mechCount,
    loopmodsOwned,
    
    // Individual breakdowns for debugging
    breakdown: {
      attraction: attractionEffects,
      creation: creationEffects,
      exodus: exodusEffects,
      power: powerEffects,
    },
  };
}
