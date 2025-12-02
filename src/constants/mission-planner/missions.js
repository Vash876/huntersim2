/**
 * Mission Data for Mission & Relic Planner
 * 
 * Mission Types:
 * - FARM (F): Repeatable missions that auto-restart after completion
 * - CAMPAIGN (C): One-time missions per TR (Traversal Reset)
 * 
 * Mission Structure:
 * - tag: Unique mission identifier (e.g., F1-1, C2-3)
 * - planet: Planet name where mission takes place
 * - name: Mission display name
 * - missionTime: Formatted time string (HH:MM:SS)
 * - timeInMinutes: Duration in minutes
 * - maxCrew: Maximum personnel capacity
 * - missionId: Optional numeric mission ID for campaigns
 */

export const MISSION_TYPES = {
  FARM: 'farm',
  CAMPAIGN: 'campaign'
};

export const PLANETS = {
  WASTA_7: 'Wasta-7',
  CRYTON: 'Cryton',
  GAIA_TYPE_3: 'Son-Egetuar',
  SEKHUR_5: 'Sekhur-5'
};

// Fragment Search mission multipliers (fX-4 missions)
export const FRAGMENT_SEARCH_MULTIPLIERS = {
  'F1-4': 2,
  'F2-4': 6,
  'F3-4': 51,
  'F4-4': 201
};

// Campaign final mission multipliers (CX-12 missions)
export const CAMPAIGN_FINAL_MULTIPLIERS = {
  'C1-12': 2,
  'C2-12': 3,
  'C3-12': 13,
  'C4-12': 19
};

// Farm mission minimum completion time in seconds (cap)
export const FARM_MIN_TIME_SECONDS = 2;

// Default fill order for optimizer (1 = highest priority)
// This determines in which order missions get personnel allocated
export const DEFAULT_FILL_ORDER = {
  'F1-1': 1,
  'F1-2': 2,
  'F1-3': 3,
  'F1-4': 4,
  'F2-1': 5,
  'F2-2': 6,
  'F2-3': 10,
  'F2-4': 9,
  'F3-1': 7,
  'F3-2': 13,
  'F3-3': 14,
  'F3-4': 11,
  'F4-1': 8,
  'F4-2': 15,
  'F4-3': 16,
  'F4-4': 12
};

// Farm Missions - Repeatable, auto-restart
export const FARM_MISSIONS = [
  // Wasta-7 Farm Missions
  { tag: 'F1-1', planet: PLANETS.WASTA_7, name: 'Scouting', missionTime: '0:30:00', timeInMinutes: 30, maxCrew: 20, tier: 1, fragMultiplier: 1 },
  { tag: 'F1-2', planet: PLANETS.WASTA_7, name: 'Salvaging', missionTime: '6:00:00', timeInMinutes: 360, maxCrew: 60, tier: 1, fragMultiplier: 1 },
  { tag: 'F1-3', planet: PLANETS.WASTA_7, name: 'Material Hunting', missionTime: '40:00:00', timeInMinutes: 2400, maxCrew: 100, tier: 1, fragMultiplier: 1 },
  { tag: 'F1-4', planet: PLANETS.WASTA_7, name: 'Fragment Search', missionTime: '100:00:00', timeInMinutes: 6000, maxCrew: 120, tier: 1, fragMultiplier: 2 },
  
  // Cryton Farm Missions
  { tag: 'F2-1', planet: PLANETS.CRYTON, name: 'Scouting', missionTime: '2:30:00', timeInMinutes: 150, maxCrew: 80, tier: 2, fragMultiplier: 1 },
  { tag: 'F2-2', planet: PLANETS.CRYTON, name: 'Salvaging', missionTime: '40:00:00', timeInMinutes: 2400, maxCrew: 160, tier: 2, fragMultiplier: 1 },
  { tag: 'F2-3', planet: PLANETS.CRYTON, name: 'Material Hunting', missionTime: '1200:00:00', timeInMinutes: 72000, maxCrew: 500, tier: 2, fragMultiplier: 1 },
  { tag: 'F2-4', planet: PLANETS.CRYTON, name: 'Fragment Search', missionTime: '2200:00:00', timeInMinutes: 132000, maxCrew: 1000, tier: 2, fragMultiplier: 6 },
  
  // Gaia Type-3 Farm Missions
  { tag: 'F3-1', planet: PLANETS.GAIA_TYPE_3, name: 'Scouting', missionTime: '50:00:00', timeInMinutes: 3000, maxCrew: 150, tier: 3, fragMultiplier: 1 },
  { tag: 'F3-2', planet: PLANETS.GAIA_TYPE_3, name: 'Salvaging', missionTime: '16250:00:00', timeInMinutes: 975000, maxCrew: 2000, tier: 3, fragMultiplier: 1 },
  { tag: 'F3-3', planet: PLANETS.GAIA_TYPE_3, name: 'Material Hunting', missionTime: '31250:00:00', timeInMinutes: 1875000, maxCrew: 4000, tier: 3, fragMultiplier: 1 },
  { tag: 'F3-4', planet: PLANETS.GAIA_TYPE_3, name: 'Fragment Search', missionTime: '65000:00:00', timeInMinutes: 3900000, maxCrew: 8000, tier: 3, fragMultiplier: 51 },
  
  // Sekhur-5 Farm Missions
  { tag: 'F4-1', planet: PLANETS.SEKHUR_5, name: 'Scouting', missionTime: '350:00:00', timeInMinutes: 21000, maxCrew: 1000, tier: 4, fragMultiplier: 1 },
  { tag: 'F4-2', planet: PLANETS.SEKHUR_5, name: 'Salvaging', missionTime: '81250:00:00', timeInMinutes: 4875000, maxCrew: 10000, tier: 4, fragMultiplier: 1 },
  { tag: 'F4-3', planet: PLANETS.SEKHUR_5, name: 'Material Hunting', missionTime: '162500:00:00', timeInMinutes: 9750000, maxCrew: 20000, tier: 4, fragMultiplier: 1 },
  { tag: 'F4-4', planet: PLANETS.SEKHUR_5, name: 'Fragment Search', missionTime: '325000:00:00', timeInMinutes: 19500000, maxCrew: 40000, tier: 4, fragMultiplier: 201 }
];

// Campaign Missions - One-time per TR
export const CAMPAIGN_MISSIONS = [
  // Wasta-7 Campaign Missions
  { tag: 'C1-1', planet: PLANETS.WASTA_7, name: 'Set up Outpost', missionTime: '0:05:00', timeInMinutes: 5, maxCrew: 5, missionId: 0, tier: 1 },
  { tag: 'C1-2', planet: PLANETS.WASTA_7, name: 'Build Cell Generator', missionTime: '0:30:00', timeInMinutes: 30, maxCrew: 10, missionId: 1, tier: 1 },
  { tag: 'C1-3', planet: PLANETS.WASTA_7, name: 'Expand Territory', missionTime: '15:00:00', timeInMinutes: 900, maxCrew: 20, missionId: 2, tier: 1 },
  { tag: 'C1-4', planet: PLANETS.WASTA_7, name: 'Clear Region', missionTime: '40:00:00', timeInMinutes: 2400, maxCrew: 30, missionId: 3, tier: 1 },
  { tag: 'C1-5', planet: PLANETS.WASTA_7, name: 'Supply Routes', missionTime: '130:00:00', timeInMinutes: 7800, maxCrew: 40, missionId: 4, tier: 1 },
  { tag: 'C1-6', planet: PLANETS.WASTA_7, name: 'Hack Network', missionTime: '270:00:00', timeInMinutes: 16200, maxCrew: 60, missionId: 5, tier: 1 },
  { tag: 'C1-7', planet: PLANETS.WASTA_7, name: 'Demilitarise Planet', missionTime: '610:00:00', timeInMinutes: 36600, maxCrew: 70, missionId: 6, tier: 1 },
  { tag: 'C1-8', planet: PLANETS.WASTA_7, name: 'Planetery Dominance', missionTime: '1500:00:00', timeInMinutes: 90000, maxCrew: 100, missionId: 7, tier: 1 },
  { tag: 'C1-9', planet: PLANETS.WASTA_7, name: 'Expanding Operations', missionTime: '3200000:00:00', timeInMinutes: 192000000, maxCrew: 750, missionId: 32, tier: 1 },
  { tag: 'C1-10', planet: PLANETS.WASTA_7, name: 'Macro-Mining Facilities', missionTime: '4800000:00:00', timeInMinutes: 288000000, maxCrew: 1000, missionId: 33, tier: 1 },
  { tag: 'C1-11', planet: PLANETS.WASTA_7, name: 'Planet-Core Tunnels', missionTime: '7100000:00:00', timeInMinutes: 426000000, maxCrew: 1250, missionId: 34, tier: 1 },
  { tag: 'C1-12', planet: PLANETS.WASTA_7, name: 'Starport Project', missionTime: '14200000:00:00', timeInMinutes: 852000000, maxCrew: 1500, missionId: 35, tier: 1 },
  
  // Cryton Campaign Missions
  { tag: 'C2-1', planet: PLANETS.CRYTON, name: 'Set up Outpost', missionTime: '2500:00:00', timeInMinutes: 150000, maxCrew: 100, missionId: 8, tier: 2 },
  { tag: 'C2-2', planet: PLANETS.CRYTON, name: 'Build Cell Generator', missionTime: '3250:00:00', timeInMinutes: 195000, maxCrew: 120, missionId: 9, tier: 2 },
  { tag: 'C2-3', planet: PLANETS.CRYTON, name: 'Expand Territory', missionTime: '4500:00:00', timeInMinutes: 270000, maxCrew: 140, missionId: 10, tier: 2 },
  { tag: 'C2-4', planet: PLANETS.CRYTON, name: 'Clear Region', missionTime: '6750:00:00', timeInMinutes: 405000, maxCrew: 160, missionId: 11, tier: 2 },
  { tag: 'C2-5', planet: PLANETS.CRYTON, name: 'Supply Routes', missionTime: '8000:00:00', timeInMinutes: 480000, maxCrew: 180, missionId: 12, tier: 2 },
  { tag: 'C2-6', planet: PLANETS.CRYTON, name: 'Hack Network', missionTime: '9500:00:00', timeInMinutes: 570000, maxCrew: 200, missionId: 13, tier: 2 },
  { tag: 'C2-7', planet: PLANETS.CRYTON, name: 'Demilitarise Planet', missionTime: '14000:00:00', timeInMinutes: 840000, maxCrew: 300, missionId: 14, tier: 2 },
  { tag: 'C2-8', planet: PLANETS.CRYTON, name: 'Planetery Dominance', missionTime: '60000:00:00', timeInMinutes: 3600000, maxCrew: 500, missionId: 15, tier: 2 },
  { tag: 'C2-9', planet: PLANETS.CRYTON, name: 'Expanding Operations', missionTime: '9600000:00:00', timeInMinutes: 576000000, maxCrew: 1500, missionId: 36, tier: 2 },
  { tag: 'C2-10', planet: PLANETS.CRYTON, name: 'Macro-Mining Facilities', missionTime: '18800000:00:00', timeInMinutes: 1128000000, maxCrew: 3000, missionId: 37, tier: 2 },
  { tag: 'C2-11', planet: PLANETS.CRYTON, name: 'Planet-Core Tunnels', missionTime: '36400000:00:00', timeInMinutes: 2184000000, maxCrew: 6000, missionId: 38, tier: 2 },
  { tag: 'C2-12', planet: PLANETS.CRYTON, name: 'Starport Project', missionTime: '109200000:00:00', timeInMinutes: 6552000000, maxCrew: 12000, missionId: 39, tier: 2 },
  
  // Gaia Type-3 Campaign Missions
  { tag: 'C3-1', planet: PLANETS.GAIA_TYPE_3, name: 'Set up Outpost', missionTime: '50000:00:00', timeInMinutes: 3000000, maxCrew: 500, missionId: 16, tier: 3 },
  { tag: 'C3-2', planet: PLANETS.GAIA_TYPE_3, name: 'Build Cell Generator', missionTime: '75000:00:00', timeInMinutes: 4500000, maxCrew: 600, missionId: 17, tier: 3 },
  { tag: 'C3-3', planet: PLANETS.GAIA_TYPE_3, name: 'Expand Territory', missionTime: '100000:00:00', timeInMinutes: 6000000, maxCrew: 700, missionId: 18, tier: 3 },
  { tag: 'C3-4', planet: PLANETS.GAIA_TYPE_3, name: 'Clear Region', missionTime: '125000:00:00', timeInMinutes: 7500000, maxCrew: 800, missionId: 19, tier: 3 },
  { tag: 'C3-5', planet: PLANETS.GAIA_TYPE_3, name: 'Supply Routes', missionTime: '150000:00:00', timeInMinutes: 9000000, maxCrew: 900, missionId: 20, tier: 3 },
  { tag: 'C3-6', planet: PLANETS.GAIA_TYPE_3, name: 'Hack Network', missionTime: '175000:00:00', timeInMinutes: 10500000, maxCrew: 1000, missionId: 21, tier: 3 },
  { tag: 'C3-7', planet: PLANETS.GAIA_TYPE_3, name: 'Demilitarise Planet', missionTime: '400000:00:00', timeInMinutes: 24000000, maxCrew: 1100, missionId: 22, tier: 3 },
  { tag: 'C3-8', planet: PLANETS.GAIA_TYPE_3, name: 'Planetery Dominance', missionTime: '750000:00:00', timeInMinutes: 45000000, maxCrew: 1200, missionId: 23, tier: 3 },
  { tag: 'C3-9', planet: PLANETS.GAIA_TYPE_3, name: 'Expanding Operations', missionTime: '96000000:00:00', timeInMinutes: 5760000000, maxCrew: 8750, missionId: 40, tier: 3 },
  { tag: 'C3-10', planet: PLANETS.GAIA_TYPE_3, name: 'Macro-Mining Facilities', missionTime: '188000000:00:00', timeInMinutes: 11280000000, maxCrew: 17500, missionId: 41, tier: 3 },
  { tag: 'C3-11', planet: PLANETS.GAIA_TYPE_3, name: 'Planet-Core Tunnels', missionTime: '263000000:00:00', timeInMinutes: 15780000000, maxCrew: 30000, missionId: 42, tier: 3 },
  { tag: 'C3-12', planet: PLANETS.GAIA_TYPE_3, name: 'Starport Project', missionTime: '488000000:00:00', timeInMinutes: 29280000000, maxCrew: 35000, missionId: 43, tier: 3 },
  
  // Sekhur-5 Campaign Missions
  { tag: 'C4-1', planet: PLANETS.SEKHUR_5, name: 'Set up Outpost', missionTime: '2400000:00:00', timeInMinutes: 144000000, maxCrew: 2800, missionId: 24, tier: 4 },
  { tag: 'C4-2', planet: PLANETS.SEKHUR_5, name: 'Build Cell Generator', missionTime: '3250000:00:00', timeInMinutes: 195000000, maxCrew: 3000, missionId: 25, tier: 4 },
  { tag: 'C4-3', planet: PLANETS.SEKHUR_5, name: 'Expand Territory', missionTime: '4000000:00:00', timeInMinutes: 240000000, maxCrew: 3600, missionId: 26, tier: 4 },
  { tag: 'C4-4', planet: PLANETS.SEKHUR_5, name: 'Clear Region', missionTime: '5000000:00:00', timeInMinutes: 300000000, maxCrew: 3900, missionId: 27, tier: 4 },
  { tag: 'C4-5', planet: PLANETS.SEKHUR_5, name: 'Supply Routes', missionTime: '6500000:00:00', timeInMinutes: 390000000, maxCrew: 4200, missionId: 28, tier: 4 },
  { tag: 'C4-6', planet: PLANETS.SEKHUR_5, name: 'Hack Network', missionTime: '11000000:00:00', timeInMinutes: 660000000, maxCrew: 4500, missionId: 29, tier: 4 },
  { tag: 'C4-7', planet: PLANETS.SEKHUR_5, name: 'Demilitarise Planet', missionTime: '15000000:00:00', timeInMinutes: 900000000, maxCrew: 4800, missionId: 30, tier: 4 },
  { tag: 'C4-8', planet: PLANETS.SEKHUR_5, name: 'Planetery Dominance', missionTime: '32000000:00:00', timeInMinutes: 1920000000, maxCrew: 5000, missionId: 31, tier: 4 },
  { tag: 'C4-9', planet: PLANETS.SEKHUR_5, name: 'Expanding Operations', missionTime: '960000000:00:00', timeInMinutes: 57600000000, maxCrew: 30000, missionId: 44, tier: 4 },
  { tag: 'C4-10', planet: PLANETS.SEKHUR_5, name: 'Macro-Mining Facilities', missionTime: '2880000000:00:00', timeInMinutes: 172800000000, maxCrew: 50000, missionId: 45, tier: 4 },
  { tag: 'C4-11', planet: PLANETS.SEKHUR_5, name: 'Planet-Core Tunnels', missionTime: '8750000000:00:00', timeInMinutes: 518400000000, maxCrew: 70000, missionId: 46, tier: 4 },
  { tag: 'C4-12', planet: PLANETS.SEKHUR_5, name: 'Starport Project', missionTime: '35920000000:00:00', timeInMinutes: 2155196371763, maxCrew: 90000, missionId: 47, tier: 4 }
];

// All missions combined
export const ALL_MISSIONS = [...FARM_MISSIONS, ...CAMPAIGN_MISSIONS];

/**
 * Get mission by tag
 * @param {string} tag - Mission tag (e.g., 'F1-1', 'C2-3')
 * @returns {object|null} Mission data or null if not found
 */
export function getMissionByTag(tag) {
  return ALL_MISSIONS.find(mission => mission.tag === tag) || null;
}

/**
 * Get all missions for a specific planet
 * @param {string} planet - Planet name
 * @returns {array} Array of missions for the planet
 */
export function getMissionsByPlanet(planet) {
  return ALL_MISSIONS.filter(mission => mission.planet === planet);
}

/**
 * Get all farm missions
 * @returns {array} Array of farm missions
 */
export function getFarmMissions() {
  return FARM_MISSIONS;
}

/**
 * Get all campaign missions
 * @returns {array} Array of campaign missions
 */
export function getCampaignMissions() {
  return CAMPAIGN_MISSIONS;
}

/**
 * Get missions by tier
 * @param {number} tier - Tier level (1-4)
 * @returns {array} Array of missions for the tier
 */
export function getMissionsByTier(tier) {
  return ALL_MISSIONS.filter(mission => mission.tier === tier);
}

/**
 * Get mission type (farm or campaign)
 * @param {string} tag - Mission tag
 * @returns {string} Mission type
 */
export function getMissionType(tag) {
  return tag.startsWith('F') ? MISSION_TYPES.FARM : MISSION_TYPES.CAMPAIGN;
}

/**
 * Check if mission is repeatable (farm mission)
 * @param {string} tag - Mission tag
 * @returns {boolean} True if farm mission
 */
export function isFarmMission(tag) {
  return getMissionType(tag) === MISSION_TYPES.FARM;
}

/**
 * Check if mission is one-time (campaign mission)
 * @param {string} tag - Mission tag
 * @returns {boolean} True if campaign mission
 */
export function isCampaignMission(tag) {
  return getMissionType(tag) === MISSION_TYPES.CAMPAIGN;
}

/**
 * Format mission time from minutes to HH:MM:SS
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export function formatMissionTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.floor((minutes % 1) * 60);
  
  return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Get mission info with additional metadata
 * @param {string} tag - Mission tag
 * @returns {object|null} Enhanced mission data
 */
export function getMissionInfo(tag) {
  const mission = getMissionByTag(tag);
  if (!mission) return null;

  return {
    ...mission,
    type: getMissionType(tag),
    isRepeatable: isFarmMission(tag),
    isOneTime: isCampaignMission(tag)
  };
}

export default {
  MISSION_TYPES,
  PLANETS,
  FARM_MISSIONS,
  CAMPAIGN_MISSIONS,
  ALL_MISSIONS,
  getMissionByTag,
  getMissionsByPlanet,
  getFarmMissions,
  getCampaignMissions,
  getMissionsByTier,
  getMissionType,
  isFarmMission,
  isCampaignMission,
  formatMissionTime,
  getMissionInfo
};
