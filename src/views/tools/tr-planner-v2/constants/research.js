/**
 * TR Planner V2 - Research Data
 * Used for multiplier calculations based on research points
 */

// Research data for temporary multiplier calculations (resets each TR)
export const RESEARCH_TEMPORARY = {
  // Innovation Level 2 Researches
  '85': [
    { level: 1, price: 2840, multiplier: 1.01 },
    { level: 2, price: 2985, multiplier: 1.02 },
    { level: 3, price: 3130, multiplier: 1.03 },
    { level: 4, price: 3275, multiplier: 1.04 },
    { level: 5, price: 3420, multiplier: 1.05 },
    { level: 6, price: 3565, multiplier: 1.06 },
  ],
  '87': [
    { level: 1, price: 3320, multiplier: 1.01 },
    { level: 2, price: 3440, multiplier: 1.02 },
    { level: 3, price: 3560, multiplier: 1.03 },
    { level: 4, price: 3680, multiplier: 1.04 },
    { level: 5, price: 3800, multiplier: 1.05 },
    { level: 6, price: 3920, multiplier: 1.06 },
  ],
  '88': [
    { level: 1, price: 3355, multiplier: 1.01 },
    { level: 2, price: 3530, multiplier: 1.02 },
    { level: 3, price: 3705, multiplier: 1.03 },
    { level: 4, price: 3880, multiplier: 1.04 },
    { level: 5, price: 4055, multiplier: 1.05 },
    { level: 6, price: 4230, multiplier: 1.06 },
  ],
  '90': [
    { level: 1, price: 3490, multiplier: 1.02 },
    { level: 2, price: 3685, multiplier: 1.03 },
    { level: 3, price: 3880, multiplier: 1.05 },
    { level: 4, price: 4075, multiplier: 1.08 },
    { level: 5, price: 4270, multiplier: 1.13 },
    { level: 6, price: 4465, multiplier: 1.21 },
  ],
  // Innovation Level 3 Researches
  '98': [
    { level: 1, price: 5300, multiplier: 1.02 },
    { level: 2, price: 5530, multiplier: 1.03 },
    { level: 3, price: 5760, multiplier: 1.04 },
    { level: 4, price: 5990, multiplier: 1.05 },
    { level: 5, price: 6220, multiplier: 1.06 },
    { level: 6, price: 6450, multiplier: 1.07 },
  ],
  '99': [
    { level: 1, price: 5350, multiplier: 1.02 },
    { level: 2, price: 5580, multiplier: 1.03 },
    { level: 3, price: 5810, multiplier: 1.04 },
    { level: 4, price: 6040, multiplier: 1.05 },
    { level: 5, price: 6270, multiplier: 1.06 },
    { level: 6, price: 6500, multiplier: 1.07 },
  ],
  '103': [
    { level: 1, price: 6240, multiplier: 1.03 },
    { level: 2, price: 6600, multiplier: 1.05 },
    { level: 3, price: 6960, multiplier: 1.08 },
    { level: 4, price: 7320, multiplier: 1.13 },
    { level: 5, price: 7680, multiplier: 1.21 },
    { level: 6, price: 8040, multiplier: 1.34 },
  ],
};

// Research data for permanent multiplier calculations (persists across TRs)
export const RESEARCH_PERMANENT = {
  // Innovation Level 2 Research (Fragment multiplier)
  '89': [
    { level: 1, price: 3380, fragMultiplier: 1.1 },
    { level: 2, price: 3535, fragMultiplier: 1.1 },
    { level: 3, price: 3690, fragMultiplier: 1.14 },
    { level: 4, price: 3845, fragMultiplier: 1.14 },
    { level: 5, price: 4000, fragMultiplier: 1.18 },
    { level: 6, price: 4155, fragMultiplier: 1.18 },
  ],
  // Innovation Level 3 Researches
  '97': [
    { level: 1, price: 5275, fragMultiplier: 1.03 },
    { level: 2, price: 5775, fragMultiplier: 1.04 },
    { level: 3, price: 6275, fragMultiplier: 1.05 },
    { level: 4, price: 6775, fragMultiplier: 1.06 },
    { level: 5, price: 7275, fragMultiplier: 1.07 },
    { level: 6, price: 7775, fragMultiplier: 1.08 },
  ],
  '100': [
    { level: 3, price: 6440, multiplier: 1.2 },
    { level: 6, price: 8000, multiplier: 1.4 },
  ],
  'temporal_ultima': [
    { level: 1, price: 4935, multiplier: 1.1 },
    { level: 7, price: 6525, multiplier: 1.2 },
  ],
  '109': [
    { level: 1, price: 9000, catchupBonus: 0.02 },
    { level: 2, price: 10000, catchupBonus: 0.03 },
    { level: 3, price: 11000, catchupBonus: 0.05 },
    { level: 4, price: 12000, catchupBonus: 0.08 },
    { level: 5, price: 13000, catchupBonus: 0.13 },
    { level: 6, price: 14000, catchupBonus: 0.21 },
  ],
  '110': [
    { level: 1, price: 9500, catchupHours: 8 },
    { level: 2, price: 10500, catchupHours: 16 },
    { level: 3, price: 11500, catchupHours: 24 },
    { level: 4, price: 12500, catchupHours: 32 },
    { level: 5, price: 13500, catchupHours: 40 },
    { level: 6, price: 14500, catchupHours: 48 },
  ],
};

/**
 * Calculate research multiplier for temporary (current) research
 */
export function calculateResearchMultiplier(researchPoints, gemData) {
  const innovationLevel = gemData?.levels?.innovation || 0;
  
  if (innovationLevel < 2) return 1;
  
  let overallMultiplier = 1;
  
  // Innovation Level 2 researches
  const level2Researches = ['85', '87', '88', '90'];
  if (innovationLevel >= 2) {
    for (const researchId of level2Researches) {
      const researchLevels = RESEARCH_TEMPORARY[researchId];
      if (!researchLevels) continue;
      
      for (const levelData of researchLevels) {
        if (researchPoints >= levelData.price) {
          overallMultiplier *= levelData.multiplier;
        } else {
          break;
        }
      }
    }
  }
  
  // Innovation Level 3 researches
  const level3Researches = ['98', '99', '103'];
  if (innovationLevel >= 3) {
    for (const researchId of level3Researches) {
      const researchLevels = RESEARCH_TEMPORARY[researchId];
      if (!researchLevels) continue;
      
      for (const levelData of researchLevels) {
        if (researchPoints >= levelData.price) {
          overallMultiplier *= levelData.multiplier;
        } else {
          break;
        }
      }
    }
  }
  
  return overallMultiplier;
}

/**
 * Calculate research multiplier for permanent (all-time) research
 */
export function calculatePermanentResearchMultiplier(researchPoints, gemData) {
  const innovationLevel = gemData?.levels?.innovation || 0;
  
  if (innovationLevel < 3) return 1;
  
  let overallMultiplier = 1;
  
  // Research 100
  const research100 = RESEARCH_PERMANENT['100'];
  if (research100) {
    for (const levelData of research100) {
      if (researchPoints >= levelData.price && levelData.multiplier) {
        overallMultiplier *= levelData.multiplier;
      }
    }
  }
  
  // Temporal Ultima Research
  const temporalUltima = RESEARCH_PERMANENT['temporal_ultima'];
  if (temporalUltima) {
    for (const levelData of temporalUltima) {
      if (researchPoints >= levelData.price && levelData.multiplier) {
        overallMultiplier *= levelData.multiplier;
      } else {
        break;
      }
    }
  }
  
  return overallMultiplier;
}

/**
 * Calculate fragment multiplier for permanent research
 */
export function calculatePermanentResearchFragMultiplier(researchPoints, gemData) {
  const innovationLevel = gemData?.levels?.innovation || 0;
  
  if (innovationLevel < 2) return 1;
  
  let overallMultiplier = 1;
  
  // Research 89 (Innovation Level 2)
  if (innovationLevel >= 2) {
    const research89 = RESEARCH_PERMANENT['89'];
    if (research89) {
      for (const levelData of research89) {
        if (researchPoints >= levelData.price && levelData.fragMultiplier) {
          overallMultiplier *= levelData.fragMultiplier;
        } else {
          break;
        }
      }
    }
  }
  
  // Research 97 (Innovation Level 3)
  if (innovationLevel >= 3) {
    const research97 = RESEARCH_PERMANENT['97'];
    if (research97) {
      for (const levelData of research97) {
        if (researchPoints >= levelData.price && levelData.fragMultiplier) {
          overallMultiplier *= levelData.fragMultiplier;
        } else {
          break;
        }
      }
    }
  }
  
  return overallMultiplier;
}
