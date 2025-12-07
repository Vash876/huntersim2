/**
 * Mission Optimizer for Mission & Relic Planner
 * 
 * NEW STRATEGY with Fill Order:
 * 1. User defines fill order (priority 1-16) for each farm mission
 * 2. Optimizer processes missions in fill order
 * 3. For each mission: allocate minimum personnel to hit 2-second cap
 * 4. Use cheapest tiers first, upgrade only as needed to reach cap
 */

import { FARM_MISSIONS, CAMPAIGN_MISSIONS, isFarmMission, DEFAULT_FILL_ORDER } from './missions.js';
import {
  calculateTotalPower,
  calculateCompletionTime,
  calculateMissionStats,
  calculatePowerFor2SecondCap,
  FARM_MIN_TIME_SECONDS
} from './missionCalculator.js';

// Tier order for allocation (cheapest first)
const TIER_ORDER = ['T1', 'T2', 'T3', 'T4'];

/**
 * Create empty personnel object
 * @returns {Object} { T1: 0, T2: 0, T3: 0, T4: 0 }
 */
function createEmptyPersonnel() {
  return { T1: 0, T2: 0, T3: 0, T4: 0 };
}

/**
 * Calculate total personnel count
 * @param {Object} personnel - { T1: count, T2: count, T3: count, T4: count }
 * @returns {number}
 */
function getTotalPersonnel(personnel) {
  return (personnel.T1 || 0) + (personnel.T2 || 0) + (personnel.T3 || 0) + (personnel.T4 || 0);
}

/**
 * Clone personnel object
 * @param {Object} personnel
 * @returns {Object}
 */
function clonePersonnel(personnel) {
  return { ...personnel };
}

/**
 * Subtract personnel from available pool
 * @param {Object} available - Available personnel counts
 * @param {Object} used - Personnel to subtract
 * @returns {Object} Remaining personnel
 */
function subtractPersonnel(available, used) {
  return {
    T1: Math.max(0, (available.T1 || 0) - (used.T1 || 0)),
    T2: Math.max(0, (available.T2 || 0) - (used.T2 || 0)),
    T3: Math.max(0, (available.T3 || 0) - (used.T3 || 0)),
    T4: Math.max(0, (available.T4 || 0) - (used.T4 || 0)),
  };
}

/**
 * Add personnel to totals
 * @param {Object} total - Running total
 * @param {Object} toAdd - Personnel to add
 * @returns {Object} New total
 */
function addPersonnel(total, toAdd) {
  return {
    T1: (total.T1 || 0) + (toAdd.T1 || 0),
    T2: (total.T2 || 0) + (toAdd.T2 || 0),
    T3: (total.T3 || 0) + (toAdd.T3 || 0),
    T4: (total.T4 || 0) + (toAdd.T4 || 0),
  };
}

/**
 * Allocate personnel to hit target power while MAXIMIZING use of lower tiers
 * 
 * STRATEGY: "Fill cheap, upgrade as needed"
 * 1. Start by filling ALL slots with T1 (cheapest)
 * 2. If not enough power, replace T1 units with T2 (1 T2 replaces 1 T1 but adds more power)
 * 3. Continue upgrading until target power reached
 * 
 * This ensures we always use the maximum possible lower tier units.
 * 
 * @param {number} targetPower - Power target to reach (for 2-second cap)
 * @param {Object} available - Available personnel { T1: count, T2: count, ... }
 * @param {Object} powerPerTier - Power per unit { T1: power, T2: power, ... }
 * @param {number} maxCrew - Maximum crew allowed for this mission
 * @returns {Object} { personnel, totalPower, crewUsed, isAtCap }
 */
function allocateMinimalForCap(targetPower, available, powerPerTier, maxCrew) {
  if (targetPower <= 0 || maxCrew <= 0) {
    return { 
      personnel: createEmptyPersonnel(), 
      totalPower: 0, 
      crewUsed: 0, 
      isAtCap: true 
    };
  }
  
  const tiers = ['T1', 'T2', 'T3', 'T4'];
  const powers = tiers.map(t => powerPerTier[t] || 0);
  const avail = tiers.map(t => available[t] || 0);
  
  // Start with empty allocation
  const counts = [0, 0, 0, 0];
  let crewUsed = 0;
  let totalPower = 0;
  
  // STEP 1: Fill slots starting from T1 (cheapest first)
  // Use as many low-tier units as possible
  for (let i = 0; i < 4 && crewUsed < maxCrew; i++) {
    const unitsToAdd = Math.min(avail[i], maxCrew - crewUsed);
    counts[i] = unitsToAdd;
    crewUsed += unitsToAdd;
    totalPower += unitsToAdd * powers[i];
  }
  
  // If we already hit target, we're done
  if (totalPower >= targetPower) {
    // But we might have over-allocated - trim from highest tier
    for (let i = 3; i >= 0 && totalPower > targetPower; i--) {
      while (counts[i] > 0 && totalPower - powers[i] >= targetPower) {
        counts[i]--;
        totalPower -= powers[i];
        crewUsed--;
      }
    }
    
    return {
      personnel: { T1: counts[0], T2: counts[1], T3: counts[2], T4: counts[3] },
      totalPower,
      crewUsed,
      isAtCap: true
    };
  }
  
  // STEP 2: Not enough power - need to "upgrade" lower tier slots to higher tiers
  // Replace T1 with T2, T2 with T3, etc. to gain more power per slot
  
  // Calculate power deficit
  let powerNeeded = targetPower - totalPower;
  
  // Try upgrading: replace lower tier units with higher tier units
  // Each upgrade: remove 1 low tier, add 1 high tier = net power gain
  for (let lowTier = 0; lowTier < 3 && powerNeeded > 0; lowTier++) {
    for (let highTier = lowTier + 1; highTier < 4 && powerNeeded > 0; highTier++) {
      const powerGainPerUpgrade = powers[highTier] - powers[lowTier];
      
      if (powerGainPerUpgrade <= 0) continue;
      
      // How many upgrades do we need? Use ceil but then verify we don't over-allocate
      let upgradesNeeded = Math.ceil(powerNeeded / powerGainPerUpgrade);
      const upgradesAvailable = Math.min(
        counts[lowTier],           // Can only upgrade units we have
        avail[highTier] - counts[highTier]  // Can only use available high tier
      );
      let upgradesToDo = Math.min(upgradesNeeded, upgradesAvailable);
      
      if (upgradesToDo > 0) {
        counts[lowTier] -= upgradesToDo;
        counts[highTier] += upgradesToDo;
        const powerGain = upgradesToDo * powerGainPerUpgrade;
        totalPower += powerGain;
        powerNeeded -= powerGain;
      }
    }
  }
  
  // STEP 2b: We may have over-upgraded due to ceil() - try to downgrade if possible
  // Check if we can replace a high-tier unit back with a low-tier unit and still hit target
  for (let highTier = 3; highTier > 0 && totalPower > targetPower; highTier--) {
    for (let lowTier = highTier - 1; lowTier >= 0 && totalPower > targetPower; lowTier--) {
      const powerLossPerDowngrade = powers[highTier] - powers[lowTier];
      
      // Check if we have high tier units and available low tier units to swap back
      while (counts[highTier] > 0 && 
             counts[lowTier] < avail[lowTier] && 
             totalPower - powerLossPerDowngrade >= targetPower) {
        counts[highTier]--;
        counts[lowTier]++;
        totalPower -= powerLossPerDowngrade;
      }
    }
  }
  
  // STEP 2c: Try to replace high-tier units with MULTIPLE low-tier units if we have crew slots
  // Example: Replace 1 T3 with 2 T2 if 2*T2_power >= T3_power and we have crew space
  // This maximizes use of lower tiers
  crewUsed = counts.reduce((sum, c) => sum + c, 0);
  
  for (let highTier = 3; highTier > 0; highTier--) {
    for (let lowTier = highTier - 1; lowTier >= 0; lowTier--) {
      if (powers[lowTier] <= 0) continue;
      
      // How many low-tier units would we need to replace 1 high-tier unit?
      const lowUnitsNeeded = Math.ceil(powers[highTier] / powers[lowTier]);
      const netCrewIncrease = lowUnitsNeeded - 1; // We remove 1 high, add lowUnitsNeeded low
      
      // Only worth it if we can fit the extra crew and have the low-tier units available
      while (counts[highTier] > 0 && 
             crewUsed + netCrewIncrease <= maxCrew &&
             counts[lowTier] + lowUnitsNeeded <= avail[lowTier]) {
        
        // Calculate power change
        const powerLoss = powers[highTier];
        const powerGain = lowUnitsNeeded * powers[lowTier];
        
        // Only do the swap if we still meet target power
        if (totalPower - powerLoss + powerGain >= targetPower) {
          counts[highTier]--;
          counts[lowTier] += lowUnitsNeeded;
          totalPower = totalPower - powerLoss + powerGain;
          crewUsed += netCrewIncrease;
        } else {
          break; // Can't do this swap, try next tier combo
        }
      }
    }
  }
  
  // STEP 3: If still not enough, we might have crew slots left - add highest available
  if (totalPower < targetPower && crewUsed < maxCrew) {
    for (let i = 3; i >= 0 && crewUsed < maxCrew && totalPower < targetPower; i--) {
      const additionalAvailable = avail[i] - counts[i];
      const crewRemaining = maxCrew - crewUsed;
      const unitsToAdd = Math.min(additionalAvailable, crewRemaining);
      
      if (unitsToAdd > 0) {
        counts[i] += unitsToAdd;
        totalPower += unitsToAdd * powers[i];
        crewUsed += unitsToAdd;
      }
    }
  }
  
  return {
    personnel: { T1: counts[0], T2: counts[1], T3: counts[2], T4: counts[3] },
    totalPower,
    crewUsed,
    isAtCap: totalPower >= targetPower
  };
}

/**
 * Optimize farm mission allocations using Fill Order
 * 
 * NEW STRATEGY:
 * 1. Sort missions by fill order (user-defined priority)
 * 2. For each mission in order: allocate minimum personnel to hit 2-second cap
 * 3. Use cheapest tiers first, but upgrade as needed to reach cap
 * 4. Continue until all missions processed or no personnel left
 * 
 * @param {Object} options
 * @param {Object} options.available - Available personnel { T1, T2, T3, T4 }
 * @param {Object} options.powerPerTier - Power per tier { T1, T2, T3, T4 }
 * @param {number} options.missionSpeedMultiplier - Mission speed multiplier
 * @param {number} options.baseFarmFrags - Base farm fragments value
 * @param {Object} options.manualAssignments - Missions with manual assignments { missionTag: { T1, T2, ... } }
 * @param {Object} options.fillOrder - Custom fill order { missionTag: priority } (lower = higher priority)
 * @returns {Object} Optimization result
 */
export function optimizeFarmMissions({
  available,
  powerPerTier,
  missionSpeedMultiplier,
  baseFarmFrags,
  manualAssignments = {},
  fillOrder = null,
  campaign = null  // { mission, fillOrder, isManual }
}) {
  // Use provided fill order or default
  const activeFillOrder = fillOrder || DEFAULT_FILL_ORDER;
  
  // Start with available personnel
  let remainingPersonnel = clonePersonnel(available);
  
  // Subtract manually assigned personnel from pool
  Object.values(manualAssignments).forEach(personnel => {
    remainingPersonnel = subtractPersonnel(remainingPersonnel, personnel);
  });
  
  // If campaign is in manual mode, subtract its assignment too
  if (campaign?.isManual && campaign.assignment) {
    remainingPersonnel = subtractPersonnel(remainingPersonnel, campaign.assignment);
  }
  
  // Build list of all missions to process with their fill orders
  let allMissions = FARM_MISSIONS.filter(mission => {
    return !manualAssignments[mission.tag];
  }).map(mission => ({
    mission,
    fillOrderValue: activeFillOrder[mission.tag] || 999,
    isCampaign: false
  }));
  
  // Add campaign to the list if selected and not manual
  if (campaign?.mission && !campaign.isManual) {
    allMissions.push({
      mission: campaign.mission,
      fillOrderValue: campaign.fillOrder,
      isCampaign: true
    });
  }
  
  // Sort by fill order (lower priority number = processed first)
  allMissions.sort((a, b) => a.fillOrderValue - b.fillOrderValue);
  
  // Allocate personnel in fill order
  const assignments = {};
  const unassignedMissions = [];
  let totalPersonnelUsed = createEmptyPersonnel();
  let campaignAssignment = null;
  
  for (const { mission, fillOrderValue, isCampaign } of allMissions) {
    let result;
    
    if (isCampaign) {
      // Campaigns: Use ALL remaining personnel up to maxCrew
      // No 2-second cap optimization - just fill with what's left
      const personnel = createEmptyPersonnel();
      let crewUsed = 0;
      let totalPower = 0;
      
      // Fill with remaining personnel, starting with T1 (cheapest)
      for (const tier of ['T1', 'T2', 'T3', 'T4']) {
        const availableOfTier = remainingPersonnel[tier] || 0;
        const spaceLeft = mission.maxCrew - crewUsed;
        const toAssign = Math.min(availableOfTier, spaceLeft);
        
        if (toAssign > 0) {
          personnel[tier] = toAssign;
          crewUsed += toAssign;
          totalPower += toAssign * (powerPerTier[tier] || 0);
        }
        
        if (crewUsed >= mission.maxCrew) break;
      }
      
      result = {
        personnel,
        totalPower,
        crewUsed,
        isAtCap: false // Campaigns don't have a 2-second cap
      };
    } else {
      // Farm missions: Allocate minimal personnel to hit 2-second cap
      const powerNeeded = calculatePowerFor2SecondCap(mission.timeInMinutes, missionSpeedMultiplier);
      result = allocateMinimalForCap(
        powerNeeded,
        remainingPersonnel,
        powerPerTier,
        mission.maxCrew
      );
    }
    
    if (result.crewUsed > 0) {
      const assignmentData = {
        personnel: result.personnel,
        totalPower: result.totalPower,
        crewUsed: result.crewUsed,
        isAtCap: result.isAtCap,
        isManual: false,
        fillOrder: fillOrderValue
      };
      
      if (isCampaign) {
        campaignAssignment = assignmentData;
      } else {
        assignments[mission.tag] = assignmentData;
      }
      
      // Update remaining personnel
      remainingPersonnel = subtractPersonnel(remainingPersonnel, result.personnel);
      totalPersonnelUsed = addPersonnel(totalPersonnelUsed, result.personnel);
    } else {
      if (!isCampaign) {
        unassignedMissions.push(mission.tag);
      }
    }
  }
  
  // Add manual assignments to final result
  Object.entries(manualAssignments).forEach(([tag, personnel]) => {
    const mission = FARM_MISSIONS.find(m => m.tag === tag);
    if (!mission) return;
    
    const totalPower = calculateTotalPower(personnel, powerPerTier);
    const powerNeeded = calculatePowerFor2SecondCap(mission.timeInMinutes, missionSpeedMultiplier);
    
    assignments[tag] = {
      personnel,
      totalPower,
      crewUsed: getTotalPersonnel(personnel),
      isAtCap: totalPower >= powerNeeded,
      isManual: true,
      fillOrder: activeFillOrder[tag] || 999
    };
    
    totalPersonnelUsed = addPersonnel(totalPersonnelUsed, personnel);
  });
  
  // Add manual campaign assignment if present
  if (campaign?.isManual && campaign.assignment) {
    const totalPower = calculateTotalPower(campaign.assignment, powerPerTier);
    const powerNeeded = calculatePowerFor2SecondCap(campaign.mission.timeInMinutes, missionSpeedMultiplier);
    
    campaignAssignment = {
      personnel: campaign.assignment,
      totalPower,
      crewUsed: getTotalPersonnel(campaign.assignment),
      isAtCap: totalPower >= powerNeeded,
      isManual: true,
      fillOrder: campaign.fillOrder
    };
    
    totalPersonnelUsed = addPersonnel(totalPersonnelUsed, campaign.assignment);
  }
  
  return {
    assignments,
    campaignAssignment,
    unassignedMissions,
    personnelUsed: totalPersonnelUsed,
    personnelRemaining: remainingPersonnel,
    totalMissionsOptimized: Object.keys(assignments).filter(tag => !manualAssignments[tag]).length,
    totalManualMissions: Object.keys(manualAssignments).length
  };
}

/**
 * Calculate complete stats for all farm missions with given assignments
 * @param {Object} assignments - Assignment results from optimizeFarmMissions
 * @param {Object} powerPerTier - Power per tier
 * @param {number} missionSpeedMultiplier - Mission speed multiplier
 * @param {number} baseFarmFrags - Base farm fragments value
 * @returns {Object} Complete mission stats
 */
export function calculateFarmMissionStats(assignments, powerPerTier, missionSpeedMultiplier, baseFarmFrags) {
  const missionStats = [];
  let totalFragsPerHour = 0;
  
  for (const mission of FARM_MISSIONS) {
    const assignment = assignments[mission.tag];
    const personnel = assignment?.personnel || createEmptyPersonnel();
    
    const stats = calculateMissionStats(
      mission,
      personnel,
      powerPerTier,
      missionSpeedMultiplier,
      baseFarmFrags,
      0 // Campaign frags not used for farm
    );
    
    stats.isManual = assignment?.isManual || false;
    stats.isAssigned = !!assignment;
    
    missionStats.push(stats);
    totalFragsPerHour += stats.fragsPerHour || 0;
  }
  
  return {
    missions: missionStats,
    totalFragsPerHour
  };
}

/**
 * Validate personnel assignment against constraints
 * @param {Object} personnel - Personnel to assign
 * @param {Object} available - Available personnel
 * @param {number} maxCrew - Maximum crew for mission
 * @returns {Object} { isValid, errors }
 */
export function validateAssignment(personnel, available, maxCrew) {
  const errors = [];
  
  // Check individual tier limits
  for (const tier of TIER_ORDER) {
    if ((personnel[tier] || 0) > (available[tier] || 0)) {
      errors.push(`Nicht genügend ${tier} verfügbar (${personnel[tier]} benötigt, ${available[tier]} verfügbar)`);
    }
  }
  
  // Check crew limit
  const totalCrew = getTotalPersonnel(personnel);
  if (totalCrew > maxCrew) {
    errors.push(`Crew-Limit überschritten (${totalCrew}/${maxCrew})`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate how much power is being wasted (over the 2-second cap)
 * @param {Object} mission - Mission object
 * @param {Object} personnel - Personnel assigned
 * @param {Object} powerPerTier - Power per tier
 * @param {number} missionSpeedMultiplier - Mission speed multiplier
 * @returns {Object} { wastedPower, wastedPercentage }
 */
export function calculateWastedPower(mission, personnel, powerPerTier, missionSpeedMultiplier) {
  if (!isFarmMission(mission.tag)) {
    return { wastedPower: 0, wastedPercentage: 0 };
  }
  
  const totalPower = calculateTotalPower(personnel, powerPerTier);
  const capPower = calculatePowerFor2SecondCap(mission.timeInMinutes, missionSpeedMultiplier);
  
  if (totalPower <= capPower) {
    return { wastedPower: 0, wastedPercentage: 0 };
  }
  
  const wastedPower = totalPower - capPower;
  const wastedPercentage = (wastedPower / totalPower) * 100;
  
  return { wastedPower, wastedPercentage };
}

/**
 * Suggest optimal tier for a mission based on efficiency
 * @param {Object} mission - Mission object
 * @param {Object} powerPerTier - Power per tier
 * @param {number} missionSpeedMultiplier - Mission speed multiplier
 * @returns {Object} { recommendedTier, personnelNeeded, reason }
 */
export function suggestOptimalTier(mission, powerPerTier, missionSpeedMultiplier) {
  if (!isFarmMission(mission.tag)) {
    return { recommendedTier: 'T1', personnelNeeded: 1, reason: 'Campaign Mission' };
  }
  
  const powerNeeded = calculatePowerFor2SecondCap(mission.timeInMinutes, missionSpeedMultiplier);
  
  // Try each tier and find the one that requires fewest total personnel
  // while still being able to hit the cap
  for (const tier of TIER_ORDER) {
    const tierPower = powerPerTier[tier] || 0;
    if (tierPower <= 0) continue;
    
    const personnelNeeded = Math.ceil(powerNeeded / tierPower);
    
    // If this tier can hit cap within maxCrew, recommend it
    if (personnelNeeded <= mission.maxCrew) {
      return {
        recommendedTier: tier,
        personnelNeeded,
        reason: `${personnelNeeded} ${tier} für 2-Sekunden-Cap`
      };
    }
  }
  
  // If no single tier can hit cap, use T4 and fill to max
  return {
    recommendedTier: 'T4',
    personnelNeeded: mission.maxCrew,
    reason: 'Max Crew benötigt (Cap nicht erreichbar)'
  };
}

// Named exports for individual functions
export {
  createEmptyPersonnel,
  getTotalPersonnel,
  clonePersonnel,
  subtractPersonnel,
  addPersonnel,
  allocateMinimalForCap
};

export default {
  optimizeFarmMissions,
  calculateFarmMissionStats,
  validateAssignment,
  calculateWastedPower,
  suggestOptimalTier,
  allocateMinimalForCap,
  createEmptyPersonnel,
  getTotalPersonnel,
  clonePersonnel,
  subtractPersonnel,
  addPersonnel
};
