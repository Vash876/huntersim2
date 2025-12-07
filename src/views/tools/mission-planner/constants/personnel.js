import Decimal from 'break_infinity.js';

/**
 * Personnel Types for Mission & Relic Planner
 * 
 * Each personnel type has:
 * - Base power
 * - Starting cost
 * - Cost multiplier per additional unit
 * - Evolution bonuses (5 evolutions at 50 units each)
 */

export const PERSONNEL_TYPES = {
  T1: {
    id: 'T1',
    name: 'Mining Pod',
    tier: 1,
    basePower: 1.0,
    startCost: new Decimal('1e995'),
    costMultiplier: new Decimal('1e5'),
    evolutionPowerBonus: 0.5,
    evolutionThreshold: 50,
    maxEvolutions: 5,
  },
  T2: {
    id: 'T2',
    name: 'Fireteam Carrier',
    tier: 2,
    basePower: 3.0,
    startCost: new Decimal('1e1250'),
    costMultiplier: new Decimal('1e10'),
    evolutionPowerBonus: 1.0,
    evolutionThreshold: 50,
    maxEvolutions: 5,
  },
  T3: {
    id: 'T3',
    name: 'Titan Hauler',
    tier: 3,
    basePower: 8.0,
    startCost: new Decimal('1e1750'),
    costMultiplier: new Decimal('1e25'),
    evolutionPowerBonus: 2.0,
    evolutionThreshold: 50,
    maxEvolutions: 5,
  },
  T4: {
    id: 'T4',
    name: 'Combat Corvette',
    tier: 4,
    basePower: 16.0,
    startCost: new Decimal('1e3000'),
    costMultiplier: new Decimal('1e50'),
    evolutionPowerBonus: 4.0,
    evolutionThreshold: 50,
    maxEvolutions: 5,
  }
};

/**
 * Get personnel data by ID
 * @param {string} personnelId - Personnel type ID (T1, T2, T3, T4)
 * @returns {object} Personnel data
 */
export function getPersonnelData(personnelId) {
  return PERSONNEL_TYPES[personnelId] || null;
}

/**
 * Get all personnel types as array
 * @returns {array} Array of all personnel types
 */
export function getAllPersonnel() {
  return Object.values(PERSONNEL_TYPES);
}

/**
 * Calculate cost for purchasing a specific number of personnel
 * Cost formula: startCost * (costMultiplier ^ count)
 * 
 * @param {string} personnelId - Personnel type ID
 * @param {number} currentCount - Current number owned
 * @param {number} purchaseCount - Number to purchase
 * @returns {Decimal} Total cost
 */
export function calculatePersonnelCost(personnelId, currentCount = 0, purchaseCount = 1) {
  const personnel = getPersonnelData(personnelId);
  if (!personnel) return new Decimal(0);

  // First unit costs startCost, each additional multiplies by costMultiplier
  // Total cost = startCost * (costMultiplier^currentCount + costMultiplier^(currentCount+1) + ... + costMultiplier^(currentCount+purchaseCount-1))
  // Simplified using geometric series
  
  let totalCost = new Decimal(0);
  for (let i = 0; i < purchaseCount; i++) {
    const unitCost = personnel.startCost.times(
      personnel.costMultiplier.pow(currentCount + i)
    );
    totalCost = totalCost.plus(unitCost);
  }
  
  return totalCost;
}

/**
 * Calculate current evolution level based on personnel count
 * @param {number} count - Current personnel count
 * @returns {number} Evolution level (0-5)
 */
export function calculateEvolutionLevel(count) {
  const evolutionThreshold = 50;
  const maxEvolutions = 5;
  
  const evolutionLevel = Math.floor(count / evolutionThreshold);
  return Math.min(evolutionLevel, maxEvolutions);
}

/**
 * Calculate total power for a personnel type including evolution bonuses
 * @param {string} personnelId - Personnel type ID
 * @param {number} count - Current personnel count
 * @returns {number} Total power
 */
export function calculatePersonnelPower(personnelId, count) {
  const personnel = getPersonnelData(personnelId);
  if (!personnel || count <= 0) return 0;

  const evolutionLevel = calculateEvolutionLevel(count);
  const evolutionBonus = evolutionLevel * personnel.evolutionPowerBonus;
  const powerPerUnit = personnel.basePower + evolutionBonus;
  
  return powerPerUnit * count;
}

/**
 * Get evolution progress for a personnel type
 * @param {number} count - Current personnel count
 * @returns {object} Evolution progress data
 */
export function getEvolutionProgress(count) {
  const evolutionThreshold = 50;
  const maxEvolutions = 5;
  const currentLevel = calculateEvolutionLevel(count);
  
  const countInCurrentLevel = count % evolutionThreshold;
  const progressPercent = (countInCurrentLevel / evolutionThreshold) * 100;
  const nextEvolutionAt = currentLevel < maxEvolutions 
    ? (currentLevel + 1) * evolutionThreshold 
    : maxEvolutions * evolutionThreshold;
  
  return {
    currentLevel,
    maxLevel: maxEvolutions,
    countInCurrentLevel,
    progressPercent,
    nextEvolutionAt,
    isMaxed: currentLevel >= maxEvolutions
  };
}

/**
 * Get formatted personnel info for display
 * @param {string} personnelId - Personnel type ID
 * @param {number} count - Current personnel count
 * @returns {object} Formatted personnel info
 */
export function getPersonnelInfo(personnelId, count = 0) {
  const personnel = getPersonnelData(personnelId);
  if (!personnel) return null;

  const evolutionProgress = getEvolutionProgress(count);
  const totalPower = calculatePersonnelPower(personnelId, count);
  const nextCost = calculatePersonnelCost(personnelId, count, 1);

  return {
    ...personnel,
    count,
    totalPower,
    nextCost,
    evolution: evolutionProgress
  };
}

export default {
  PERSONNEL_TYPES,
  getPersonnelData,
  getAllPersonnel,
  calculatePersonnelCost,
  calculateEvolutionLevel,
  calculatePersonnelPower,
  getEvolutionProgress,
  getPersonnelInfo
};
