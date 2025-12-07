/**
 * Mission Calculator for Mission & Relic Planner
 * 
 * Handles all mission time and fragment yield calculations.
 * Uses personnel power and mission speed modifiers from the store.
 */

import { FARM_MIN_TIME_SECONDS, isFarmMission } from './missions.js';

// Minimum completion time for farm missions in minutes
const FARM_MIN_TIME_MINUTES = FARM_MIN_TIME_SECONDS / 60; // 0.0333... minutes

/**
 * Calculate total power from personnel assignment
 * @param {Object} personnel - { T1: count, T2: count, T3: count, T4: count }
 * @param {Object} powerPerTier - { T1: power, T2: power, T3: power, T4: power }
 * @returns {number} Total power
 */
export function calculateTotalPower(personnel, powerPerTier) {
  return (
    (personnel.T1 || 0) * (powerPerTier.T1 || 0) +
    (personnel.T2 || 0) * (powerPerTier.T2 || 0) +
    (personnel.T3 || 0) * (powerPerTier.T3 || 0) +
    (personnel.T4 || 0) * (powerPerTier.T4 || 0)
  );
}

/**
 * Calculate mission completion time in minutes
 * @param {number} baseTimeMinutes - Mission base time in minutes (timeInMinutes from mission data)
 * @param {number} totalPower - Total power assigned to mission
 * @param {number} missionSpeedMultiplier - Mission speed multiplier (e.g., 456.89 for 45689%)
 * @param {boolean} isFarm - Whether this is a farm mission (applies 2-second cap)
 * @returns {number} Completion time in minutes
 */
export function calculateCompletionTime(baseTimeMinutes, totalPower, missionSpeedMultiplier, isFarm = false) {
  if (totalPower <= 0 || missionSpeedMultiplier <= 0) {
    return Infinity;
  }
  
  const rawTime = baseTimeMinutes / (totalPower * missionSpeedMultiplier);
  
  // Apply 2-second cap for farm missions
  if (isFarm && rawTime < FARM_MIN_TIME_MINUTES) {
    return FARM_MIN_TIME_MINUTES;
  }
  
  return rawTime;
}

/**
 * Calculate completion time in seconds (for display)
 * @param {number} completionTimeMinutes - Completion time in minutes
 * @returns {number} Completion time in seconds
 */
export function completionTimeToSeconds(completionTimeMinutes) {
  return completionTimeMinutes * 60;
}

/**
 * Calculate completions per hour for a farm mission
 * @param {number} completionTimeMinutes - Time to complete one run in minutes
 * @returns {number} Number of completions per hour
 */
export function calculateCompletionsPerHour(completionTimeMinutes) {
  if (completionTimeMinutes <= 0 || !isFinite(completionTimeMinutes)) {
    return 0;
  }
  return 60 / completionTimeMinutes;
}

/**
 * Calculate fragments per completion for a farm mission
 * @param {number} baseFarmFrags - Base farm fragment value (from modifiers)
 * @param {number} missionMultiplier - Mission-specific multiplier (1, 2, 6, 51, or 201)
 * @returns {number} Fragments per completion
 */
export function calculateFarmFragsPerCompletion(baseFarmFrags, missionMultiplier = 1) {
  return baseFarmFrags * missionMultiplier;
}

/**
 * Calculate fragments per hour for a farm mission
 * @param {number} fragsPerCompletion - Fragments earned per completion
 * @param {number} completionsPerHour - Number of completions per hour
 * @returns {number} Fragments per hour
 */
export function calculateFragsPerHour(fragsPerCompletion, completionsPerHour) {
  return fragsPerCompletion * completionsPerHour;
}

/**
 * Calculate power required to hit the 2-second cap for a farm mission
 * @param {number} baseTimeMinutes - Mission base time in minutes
 * @param {number} missionSpeedMultiplier - Mission speed multiplier
 * @returns {number} Power required to hit 2-second cap
 */
export function calculatePowerFor2SecondCap(baseTimeMinutes, missionSpeedMultiplier) {
  if (missionSpeedMultiplier <= 0) {
    return Infinity;
  }
  // Power needed: baseTimeMinutes / (FARM_MIN_TIME_MINUTES * missionSpeedMultiplier)
  return baseTimeMinutes / (FARM_MIN_TIME_MINUTES * missionSpeedMultiplier);
}

/**
 * Calculate full mission stats
 * @param {Object} mission - Mission data object
 * @param {Object} personnel - { T1: count, T2: count, T3: count, T4: count }
 * @param {Object} powerPerTier - { T1: power, T2: power, T3: power, T4: power }
 * @param {number} missionSpeedMultiplier - Mission speed multiplier
 * @param {number} baseFarmFrags - Base farm fragment value (only for farm missions)
 * @param {number} baseCampaignFrags - Base campaign fragment value (only for campaign missions)
 * @returns {Object} Complete mission stats
 */
export function calculateMissionStats(
  mission,
  personnel,
  powerPerTier,
  missionSpeedMultiplier,
  baseFarmFrags = 0,
  baseCampaignFrags = 0
) {
  const isFarm = isFarmMission(mission.tag);
  const totalPower = calculateTotalPower(personnel, powerPerTier);
  const totalPersonnel = (personnel.T1 || 0) + (personnel.T2 || 0) + (personnel.T3 || 0) + (personnel.T4 || 0);
  
  // Check if any personnel assigned
  if (totalPersonnel === 0) {
    return {
      missionTag: mission.tag,
      missionName: mission.name,
      personnel: { ...personnel },
      totalPersonnel: 0,
      totalPower: 0,
      completionTimeMinutes: Infinity,
      completionTimeSeconds: Infinity,
      completionTimeFormatted: '∞',
      isAtCap: false,
      isFarm,
      fragMultiplier: mission.fragMultiplier || 1,
      fragsPerCompletion: 0,
      completionsPerHour: 0,
      fragsPerHour: 0,
      powerFor2SecondCap: isFarm ? calculatePowerFor2SecondCap(mission.timeInMinutes, missionSpeedMultiplier) : null
    };
  }
  
  const completionTimeMinutes = calculateCompletionTime(
    mission.timeInMinutes,
    totalPower,
    missionSpeedMultiplier,
    isFarm
  );
  
  const completionTimeSeconds = completionTimeToSeconds(completionTimeMinutes);
  const isAtCap = isFarm && completionTimeMinutes <= FARM_MIN_TIME_MINUTES;
  
  // Calculate fragment stats
  let fragsPerCompletion = 0;
  let completionsPerHour = 0;
  let fragsPerHour = 0;
  
  if (isFarm) {
    fragsPerCompletion = calculateFarmFragsPerCompletion(baseFarmFrags, mission.fragMultiplier || 1);
    completionsPerHour = calculateCompletionsPerHour(completionTimeMinutes);
    fragsPerHour = calculateFragsPerHour(fragsPerCompletion, completionsPerHour);
  } else {
    // Campaign missions
    fragsPerCompletion = baseCampaignFrags;
    completionsPerHour = 0; // One-time only
    fragsPerHour = 0; // Not applicable
  }
  
  return {
    missionTag: mission.tag,
    missionName: mission.name,
    personnel: { ...personnel },
    totalPersonnel,
    totalPower,
    completionTimeMinutes,
    completionTimeSeconds,
    completionTimeFormatted: formatCompletionTime(completionTimeSeconds),
    isAtCap,
    isFarm,
    fragMultiplier: mission.fragMultiplier || 1,
    fragsPerCompletion,
    completionsPerHour,
    fragsPerHour,
    powerFor2SecondCap: isFarm ? calculatePowerFor2SecondCap(mission.timeInMinutes, missionSpeedMultiplier) : null
  };
}

/**
 * Format completion time for display
 * Under 60s: shows seconds with 2 decimals (e.g., "2.00s")
 * 60s and above: shows HH:MM:SS format (e.g., "00:01:12")
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatCompletionTime(seconds) {
  if (!isFinite(seconds) || seconds <= 0) {
    return '∞';
  }
  
  // Under 60 seconds: show with 2 decimals
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  
  // 60 seconds and above: use HH:MM:SS format
  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

/**
 * Format large numbers with suffix (K, M, B, T)
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number
 */
export function formatNumber(num, decimals = 2) {
  if (!isFinite(num)) return '∞';
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1e12) return sign + (absNum / 1e12).toFixed(decimals) + 'T';
  if (absNum >= 1e9) return sign + (absNum / 1e9).toFixed(decimals) + 'B';
  if (absNum >= 1e6) return sign + (absNum / 1e6).toFixed(decimals) + 'M';
  if (absNum >= 1e3) return sign + (absNum / 1e3).toFixed(decimals) + 'K';
  
  return sign + absNum.toFixed(decimals);
}

// Re-export constants from missions.js for convenience
export { FARM_MIN_TIME_SECONDS };

export default {
  calculateTotalPower,
  calculateCompletionTime,
  completionTimeToSeconds,
  calculateCompletionsPerHour,
  calculateFarmFragsPerCompletion,
  calculateFragsPerHour,
  calculatePowerFor2SecondCap,
  calculateMissionStats,
  formatCompletionTime,
  formatNumber,
  FARM_MIN_TIME_MINUTES,
  FARM_MIN_TIME_SECONDS
};
