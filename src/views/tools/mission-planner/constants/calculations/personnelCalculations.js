import Decimal from 'break_infinity.js';
import { PERSONNEL_TYPES } from '../personnel';
import { formatNumber } from '@/composables/format.js';

/**
 * Personnel Calculations for Mission & Relic Planner
 * 
 * Calculates how many personnel can be afforded based on Cells exponent,
 * and the resulting power including evolution bonuses.
 */

/**
 * Calculate how many personnel of a given tier can be afforded
 * based on the cells exponent.
 * 
 * Formula: 
 * - First unit costs startCost (e.g., 1e995 for T1)
 * - Each additional unit costs costMultiplier more (e.g., 1e5 for T1)
 * - So unit N costs: startCost * costMultiplier^(N-1)
 * - In exponent terms: startExp + (N-1) * multExp
 * 
 * To afford N units, we need the Nth unit to cost <= our cells
 * So: startExp + (N-1) * multExp <= cellsExp
 * Solving: N <= (cellsExp - startExp) / multExp + 1
 * 
 * @param {number} cellsExponent - The exponent of cells (e.g., 1500 means 1e1500)
 * @param {string} personnelId - Personnel type ID (T1, T2, T3, T4)
 * @returns {number} Number of personnel that can be afforded
 */
export function calculateAffordablePersonnel(cellsExponent, personnelId) {
  const personnel = PERSONNEL_TYPES[personnelId];
  if (!personnel) return 0;

  // Get the exponents from the Decimal values
  const startExp = personnel.startCost.exponent;
  const multExp = personnel.costMultiplier.exponent;

  // If we can't afford the first unit, return 0
  if (cellsExponent < startExp) {
    return 0;
  }

  // Calculate max affordable units
  // N = floor((cellsExp - startExp) / multExp) + 1
  const maxUnits = Math.floor((cellsExponent - startExp) / multExp) + 1;

  return Math.max(0, maxUnits);
}

/**
 * Calculate evolution level based on personnel count
 * Evolution happens every 50 units, max 5 evolutions
 * 
 * @param {number} count - Number of personnel
 * @param {string} personnelId - Personnel type ID
 * @returns {number} Evolution level (0-5)
 */
export function calculateEvolutionLevel(count, personnelId) {
  const personnel = PERSONNEL_TYPES[personnelId];
  if (!personnel || count <= 0) return 0;

  const evolutionLevel = Math.floor(count / personnel.evolutionThreshold);
  return Math.min(evolutionLevel, personnel.maxEvolutions);
}

/**
 * Calculate power per unit including evolution bonuses
 * 
 * @param {number} count - Number of personnel
 * @param {string} personnelId - Personnel type ID
 * @returns {number} Power per unit
 */
export function calculatePowerPerUnit(count, personnelId) {
  const personnel = PERSONNEL_TYPES[personnelId];
  if (!personnel || count <= 0) return 0;

  const evolutionLevel = calculateEvolutionLevel(count, personnelId);
  const evolutionBonus = evolutionLevel * personnel.evolutionPowerBonus;
  
  return personnel.basePower + evolutionBonus;
}

/**
 * Calculate total power for a personnel type
 * 
 * @param {number} count - Number of personnel
 * @param {string} personnelId - Personnel type ID
 * @returns {number} Total power (count * power per unit)
 */
export function calculateTotalPower(count, personnelId) {
  if (count <= 0) return 0;
  
  const powerPerUnit = calculatePowerPerUnit(count, personnelId);
  return powerPerUnit * count;
}

/**
 * Calculate all personnel stats based on cells exponent
 * 
 * @param {number} cellsExponent - The exponent of cells
 * @returns {object} Personnel stats for all tiers (with both uppercase and lowercase keys)
 */
export function calculateAllPersonnelStats(cellsExponent) {
  const results = {};

  for (const [id, personnel] of Object.entries(PERSONNEL_TYPES)) {
    const count = calculateAffordablePersonnel(cellsExponent, id);
    const evolutionLevel = calculateEvolutionLevel(count, id);
    const powerPerUnit = calculatePowerPerUnit(count, id);
    const totalPower = calculateTotalPower(count, id);

    const stats = {
      id,
      name: personnel.name,
      tier: personnel.tier,
      count,
      evolutionLevel,
      maxEvolutions: personnel.maxEvolutions,
      basePower: personnel.basePower,
      evolutionBonus: evolutionLevel * personnel.evolutionPowerBonus,
      powerPerUnit,
      totalPower,
      // Cost info
      startCostExp: personnel.startCost.exponent,
      costMultExp: personnel.costMultiplier.exponent,
      // Next evolution info
      nextEvolutionAt: evolutionLevel < personnel.maxEvolutions 
        ? (evolutionLevel + 1) * personnel.evolutionThreshold 
        : null,
      unitsToNextEvolution: evolutionLevel < personnel.maxEvolutions 
        ? ((evolutionLevel + 1) * personnel.evolutionThreshold) - count 
        : 0
    };

    // Add with both uppercase and lowercase keys for flexibility
    results[id] = stats;
    results[id.toLowerCase()] = stats;
  }

  return results;
}

export default {
  calculateAffordablePersonnel,
  calculateEvolutionLevel,
  calculatePowerPerUnit,
  calculateTotalPower,
  calculateAllPersonnelStats,
  formatNumber
};
