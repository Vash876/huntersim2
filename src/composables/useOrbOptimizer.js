/**
 * Orb Auto-Optimizer Composable - IMPROVED VERSION
 * Adapts the Google Sheets optimization algorithm for Vue app with proper efficiency calculation
 * 
 * KEY IMPROVEMENTS FROM APPS SCRIPT ANALYSIS:
 * ✅ Uses same efficiency calculation as GemPlannerModal
 * ✅ Proper batch processing with smart flush logic
 * ✅ Stale cost prevention by tracking batch purchases  
 * ✅ In-memory state tracking for performance
 * ✅ Budget validation and error checking
 * ✅ Performance profiling with detailed reports
 * ✅ Proper gem nodes integration like row 53 toggles
 */

import { GEMS, GEM_LIST } from '@/constants/gem-planner';
import { formatNumber } from '@/composables/format.js';
import Decimal from 'break_infinity.js';

export function useOrbOptimizer() {
  
  // Performance profiler (simplified browser version)
  class Profiler {
    constructor() {
      this.timers = new Map();
      this.results = [];
      this.operationCount = 0;
    }
    
    start(label) {
      this.timers.set(label, Date.now());
    }
    
    end(label) {
      const startTime = this.timers.get(label);
      if (startTime) {
        const duration = Date.now() - startTime;
        this.results.push({
          operation: label,
          duration,
          timestamp: new Date()
        });
        this.timers.delete(label);
        return duration;
      }
      return 0;
    }
    
    countOperation() {
      this.operationCount++;
    }
    
    getReport() {
      const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
      const sortedResults = this.results.sort((a, b) => b.duration - a.duration);
      
      let report = `\n🔍 PERFORMANCE REPORT\n`;
      report += `Total Time: ${totalTime}ms (${(totalTime/1000).toFixed(2)}s)\n`;
      report += `Operations: ${this.operationCount}\n\n`;
      
      report += `📊 TIME BREAKDOWN:\n`;
      sortedResults.forEach((result, index) => {
        const percentage = ((result.duration / totalTime) * 100).toFixed(1);
        report += `${index + 1}. ${result.operation}: ${result.duration}ms (${percentage}%)\n`;
      });
      
      return report;
    }
  }

  /**
   * Calculate efficiency for a gem upgrade using the EXACT same formula as GemPlannerModal
   * This ensures parity with the manually calculated efficiency display
   * @param {string} gemId - The gem ID
   * @param {string} upgradeId - The upgrade ID  
   * @param {Object} gameStats - Game statistics
   * @param {Object} weights - Weight values for resources
   * @param {Function} getPlanGemLevel - Function to get current gem level
   * @param {Function} getPlanUpgradeLevel - Function to get current upgrade level
   * @param {Function} getPlanUpgradeNextLevelCost - Function to get next level cost
   * @param {number} efficiencyScaling - Scaling factor for efficiency display (default: 10)
   * @returns {Object} Object with value and efficiency properties
   */
  function calculateUpgradeEfficiency(gemId, upgradeId, gameStats, weights, getPlanGemLevel, getPlanUpgradeLevel, getPlanUpgradeNextLevelCost, efficiencyScaling = 10) {
    try {
      const gem = GEMS[gemId];
      if (!gem) return { value: 0, efficiency: 0 };
      
      const upgrade = gem.upgrades.find(u => u.id === upgradeId);
      if (!upgrade) return { value: 0, efficiency: 0 };
      
      const currentLevel = getPlanUpgradeLevel(gemId, upgradeId);
      const nextLevelCost = getPlanUpgradeNextLevelCost(gemId, upgradeId);
      
      if (nextLevelCost === 0 || currentLevel >= upgrade.maxLevel) return { value: 0, efficiency: 0 };
      
      // Get weight value (same logic as in GemPlannerModal calculateUpgradeEfficiency)
      let weightValue = 0;
      if (upgrade.weight) {
        if (typeof upgrade.weight === 'string') {
          // Simple weight mapping - map uppercase resource names to lowercase weight keys
          const weightMapping = {
            'Cells': 'cells',
            'MP': 'mp', 
            'Shards': 'shards',
            'RP': 'rp',
            'AP': 'ap',
            'Mats': 'mats'
          };
          const weightKey = weightMapping[upgrade.weight] || upgrade.weight.toLowerCase();
          weightValue = weights?.[weightKey] || 0;
        } else if (upgrade.weight.calculate) {
          // Complex weight calculation - pass weights directly
          weightValue = upgrade.weight.calculate(weights || {});
        }
      }
      
      if (weightValue === 0) return { value: 0, efficiency: 0 };
      
      // Calculate multiplier improvement (same logic as in GemPlannerModal)
      const currentMultiplier = getPlanCurrentMultiplier(gemId, upgradeId, gameStats, getPlanGemLevel, getPlanUpgradeLevel);
      
      // Simulate next level multiplier
      const nextLevel = currentLevel + 1;
      const gemLevel = getPlanGemLevel(gemId);
      
      let nextMultiplier = 1;
      try {
        const functionString = upgrade.multiplier.calculate.toString();
        const expectsGameStats = functionString.includes('gameStats') || functionString.includes('level, gemLevel,') || functionString.includes('level,gemLevel,');
        
        if (expectsGameStats && gameStats) {
          nextMultiplier = upgrade.multiplier.calculate(nextLevel, gemLevel, gameStats);
        } else {
          nextMultiplier = upgrade.multiplier.calculate(nextLevel, gemLevel);
        }
      } catch (error) {
        console.warn(`Error calculating next multiplier for ${gemId}/${upgradeId}:`, error);
        return { value: 0, efficiency: 0 };
      }
      
      // Calculate improvement using Decimal for large numbers (same as GemPlannerModal)
      let improvement = 0;
      if (upgrade.type === 'additive') {
        // For additive upgrades, improvement is the absolute difference
        let currentDecimal, nextDecimal;
        
        // Convert current multiplier to Decimal
        if (typeof currentMultiplier === 'number') {
          currentDecimal = new Decimal(currentMultiplier);
        } else if (currentMultiplier?.mantissa !== undefined && currentMultiplier?.exponent !== undefined) {
          currentDecimal = new Decimal(currentMultiplier.mantissa).mul(new Decimal(10).pow(currentMultiplier.exponent));
        } else {
          currentDecimal = new Decimal(currentMultiplier || 0);
        }
        
        // Convert next multiplier to Decimal
        if (typeof nextMultiplier === 'number') {
          nextDecimal = new Decimal(nextMultiplier);
        } else if (nextMultiplier?.mantissa !== undefined && nextMultiplier?.exponent !== undefined) {
          nextDecimal = new Decimal(nextMultiplier.mantissa).mul(new Decimal(10).pow(nextMultiplier.exponent));
        } else {
          nextDecimal = new Decimal(nextMultiplier || 0);
        }
        
        const improvementDecimal = nextDecimal.sub(currentDecimal);
        improvement = improvementDecimal.toNumber();
      } else {
        // For multiplicative upgrades, improvement is the multiplier factor (not the ratio)
        let currentDecimal, nextDecimal;
        
        // Convert current multiplier to Decimal
        if (typeof currentMultiplier === 'number') {
          currentDecimal = new Decimal(currentMultiplier);
        } else if (currentMultiplier?.mantissa !== undefined && currentMultiplier?.exponent !== undefined) {
          currentDecimal = new Decimal(currentMultiplier.mantissa).mul(new Decimal(10).pow(currentMultiplier.exponent));
        } else {
          currentDecimal = new Decimal(currentMultiplier || 1);
        }
        
        // Convert next multiplier to Decimal
        if (typeof nextMultiplier === 'number') {
          nextDecimal = new Decimal(nextMultiplier);
        } else if (nextMultiplier?.mantissa !== undefined && nextMultiplier?.exponent !== undefined) {
          nextDecimal = new Decimal(nextMultiplier.mantissa).mul(new Decimal(10).pow(nextMultiplier.exponent));
        } else {
          nextDecimal = new Decimal(nextMultiplier || 1);
        }
        
        const improvementDecimal = currentDecimal.gt(0) ? nextDecimal.div(currentDecimal) : new Decimal(0);
        improvement = improvementDecimal.toNumber();
      }
      
      // Value = LOG10(improvement) * weight (same as GemPlannerModal)
      const logImprovement = improvement > 0 ? Math.log10(improvement) : 0;
      const value = logImprovement * weightValue;
      
      // Efficiency with configurable scaling: (value / cost) * 10^scalingFactor
      const scalingFactor = Math.pow(10, efficiencyScaling);
      const efficiency = (value / nextLevelCost) * scalingFactor;
      
      return { value, efficiency };
      
    } catch (error) {
      console.warn(`Error calculating upgrade efficiency for ${gemId}/${upgradeId}:`, error);
      return { value: 0, efficiency: 0 };
    }
  }
  
  /**
   * Helper function to calculate current multiplier (same as GemPlannerModal)
   */
  function getPlanCurrentMultiplier(gemId, upgradeId, gameStats, getPlanGemLevel, getPlanUpgradeLevel) {
    const gem = GEMS[gemId];
    if (!gem) return 1;
    
    const upgrade = gem.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return 1;
    
    const currentLevel = getPlanUpgradeLevel(gemId, upgradeId);
    const gemLevel = getPlanGemLevel(gemId);
    
    if (currentLevel === 0) return 1;
    
    try {
      const functionString = upgrade.multiplier.calculate.toString();
      const expectsGameStats = functionString.includes('gameStats') || functionString.includes('level, gemLevel,') || functionString.includes('level,gemLevel,');
      
      let result;
      if (expectsGameStats && gameStats) {
        result = upgrade.multiplier.calculate(currentLevel, gemLevel, gameStats);
      } else {
        result = upgrade.multiplier.calculate(currentLevel, gemLevel);
      }
      
      // Handle the result - it might be a Decimal object or need conversion
      if (result === null || result === undefined) {
        return 1;
      }
      
      if (result != null && typeof result === 'object' && 
          Object.prototype.hasOwnProperty.call(result, 'mantissa') && 
          Object.prototype.hasOwnProperty.call(result, 'exponent')) {
        // break_infinity.js serialized object - return the object itself
        return result;
      } else if (typeof result === 'number') {
        return isFinite(result) ? result : 1;
      } else {
        return Number(result) || 1;
      }
      
    } catch (error) {
      console.warn(`Error calculating multiplier for ${gemId}/${upgradeId}:`, error);
      return 1;
    }
  }

  /**
   * Main optimization function - IMPROVED VERSION
   * Adapts the Google Apps Script algorithm with proper efficiency calculation
   */
  async function optimizeGemPurchases(options) {
    const {
      budget,
      getCurrentGemLevel,
      getPlanGemLevel,
      setPlanGemLevel,
      getCurrentUpgradeLevel,
      getPlanUpgradeLevel,
      setPlanUpgradeLevel,
      getPlanUpgradeNextLevelCost,
      hasPlanGemNode,
      togglePlanGemNode,
      gameStats,
      weights,
      trackSpending,
      onProgress
    } = options;
    
    const profiler = new Profiler();
    profiler.start('Total Optimization');
    
    try {
      const results = [];
      let totalSpent = 0;
      let availableOrbs = budget;
      let iteration = 0;
      const maxIterations = 1000;
      
      profiler.start('Initial Setup');
      
      // Track upgrade states in memory for batch processing (like Apps Script)
      const upgradeStates = new Map();
      
      profiler.end('Initial Setup');
      profiler.countOperation();
      
      console.log(`Starting optimization with ${formatNumber(availableOrbs)} orbs...`);
      
      profiler.start('Optimization Loop');
      
      // Enhanced optimization loop with batch processing (adapted from Apps Script)
      let batchPurchases = []; // Track purchases in current batch
      let batchUpgradeKeys = new Set(); // Track which upgrades we've bought in current batch
      
      while (iteration < maxIterations) {
        iteration++;
        
        profiler.start(`Iteration ${iteration} - Collect Upgrades`);
        
        // Collect all available upgrades with efficiency calculation
        const allUpgrades = [];
        
        for (const gem of GEM_LIST) {
          const gemLevel = getPlanGemLevel(gem.id);
          
          if (gem.upgrades) {
            for (const upgrade of gem.upgrades) {
              // Check if upgrade is unlocked
              if (gemLevel >= upgrade.unlock) {
                const currentLevel = getPlanUpgradeLevel(gem.id, upgrade.id);
                
                // Check if not at max level
                if (currentLevel < upgrade.maxLevel) {
                  const upgradeKey = `${gem.id}_${upgrade.id}`;
                  
                  // Only consider upgrades NOT in current batch to avoid stale cost issues (like Apps Script)
                  if (!batchUpgradeKeys.has(upgradeKey)) {
                    const cost = getPlanUpgradeNextLevelCost(gem.id, upgrade.id);
                    
                    if (cost > 0) {
                      // Use the improved efficiency calculation that matches GemPlannerModal
                      const efficiencyResult = calculateUpgradeEfficiency(
                        gem.id,
                        upgrade.id,
                        gameStats,
                        weights,
                        getPlanGemLevel,
                        getPlanUpgradeLevel,
                        getPlanUpgradeNextLevelCost,
                        10 // Default efficiency scaling
                      );
                      
                      if (efficiencyResult.efficiency > 0) {
                        allUpgrades.push({
                          gemId: gem.id,
                          upgradeId: upgrade.id,
                          gemName: gem.name,
                          upgradeName: upgrade.name,
                          currentLevel,
                          cost,
                          efficiency: efficiencyResult.efficiency,
                          type: 'upgrade'
                        });
                      }
                    }
                  }
                }
              }
            }
          }
          
          // Gem level upgrades
          const currentGemLevel = getPlanGemLevel(gem.id);
          if (currentGemLevel < gem.maxLevel) {
            const upgradeKey = `${gem.id}_gem_level`;
            
            if (!batchUpgradeKeys.has(upgradeKey)) {
              const qualityCost = gem.qualityCosts.find(cost => cost.level === currentGemLevel + 1);
              if (qualityCost && qualityCost.cost > 0) {
                // Enhanced efficiency calculation for gem levels using weight if available
                let efficiency = 1 / qualityCost.cost; // Basic efficiency
                
                // Check if gem has a weight for gem levels
                if (weights && gem.weight) {
                  let weightValue = 0;
                  if (typeof gem.weight === 'string') {
                    const weightMapping = {
                      'Cells': 'cells',
                      'MP': 'mp', 
                      'Shards': 'shards',
                      'RP': 'rp',
                      'AP': 'ap',
                      'Mats': 'mats'
                    };
                    const weightKey = weightMapping[gem.weight] || gem.weight.toLowerCase();
                    weightValue = weights[weightKey] || 0;
                  } else if (gem.weight.calculate) {
                    weightValue = gem.weight.calculate(weights);
                  }
                  
                  if (weightValue > 0) {
                    efficiency = weightValue / qualityCost.cost;
                  }
                }
                
                allUpgrades.push({
                  gemId: gem.id,
                  upgradeId: '_gem_level',
                  gemName: gem.name,
                  upgradeName: 'Gem Quality',
                  currentLevel: currentGemLevel,
                  cost: qualityCost.cost,
                  efficiency,
                  type: 'gem_level'
                });
              }
            }
          }
          
          // Gem nodes (toggles) - like row 53 in Apps Script
          if (gem.gemNodes && gem.gemNodes.length > 0) {
            gem.gemNodes.forEach((node, nodeIndex) => {
              if (node.cost && node.cost > 0) {
                const upgradeKey = `${gem.id}_node_${nodeIndex}`;
                
                if (!batchUpgradeKeys.has(upgradeKey) && !hasPlanGemNode(gem.id, nodeIndex)) {
                  // Higher priority efficiency for nodes (like toggles in Apps Script)
                  let efficiency = 2 / node.cost; // Base priority multiplier
                  
                  // Apply weights if available for gem nodes
                  if (weights && node.weight) {
                    let weightValue = 0;
                    if (typeof node.weight === 'string') {
                      const weightMapping = {
                        'Cells': 'cells',
                        'MP': 'mp', 
                        'Shards': 'shards',
                        'RP': 'rp',
                        'AP': 'ap',
                        'Mats': 'mats'
                      };
                      const weightKey = weightMapping[node.weight] || node.weight.toLowerCase();
                      weightValue = weights[weightKey] || 0;
                    } else if (node.weight.calculate) {
                      weightValue = node.weight.calculate(weights);
                    }
                    
                    if (weightValue > 0) {
                      efficiency = (weightValue * 2) / node.cost; // Maintain priority multiplier
                    }
                  }
                  
                  allUpgrades.push({
                    gemId: gem.id,
                    upgradeId: `_node_${nodeIndex}`,
                    gemName: gem.name,
                    upgradeName: `Node ${nodeIndex + 1}`,
                    currentLevel: 0,
                    cost: node.cost,
                    efficiency,
                    type: 'gem_node',
                    nodeIndex
                  });
                }
              }
            });
          }
        }
        
        profiler.end(`Iteration ${iteration} - Collect Upgrades`);
        
        // Find best affordable upgrade (like Apps Script)
        profiler.start(`Iteration ${iteration} - Find Best Upgrade`);
        const bestUpgrade = findBestAffordableUpgrade(allUpgrades, availableOrbs);
        profiler.end(`Iteration ${iteration} - Find Best Upgrade`);
        
        if (!bestUpgrade) {
          console.log('Optimization complete - no more affordable upgrades found.');
          break;
        }
        
        // Make the purchase (like Apps Script)
        profiler.start(`Iteration ${iteration} - Process Purchase`);
        
        // Double-check affordability (safety check like in Apps Script)
        if (bestUpgrade.cost > availableOrbs) {
          console.error(`Budget error: Trying to spend ${formatNumber(bestUpgrade.cost)} but only ${formatNumber(availableOrbs)} orbs available.`);
          break;
        }
        
        availableOrbs -= bestUpgrade.cost;
        totalSpent += bestUpgrade.cost;
        
        // Record the purchase
        const levelChange = bestUpgrade.type === 'gem_node' ? 
          `OFF → ON` : `${bestUpgrade.currentLevel} → ${bestUpgrade.currentLevel + 1}`;
        
        results.push({
          iteration,
          gemName: bestUpgrade.gemName,
          upgradeName: bestUpgrade.upgradeName,
          fromLevel: bestUpgrade.currentLevel,
          toLevel: bestUpgrade.type === 'gem_node' ? 'ON' : bestUpgrade.currentLevel + 1,
          levelChange,
          cost: bestUpgrade.cost,
          efficiency: bestUpgrade.efficiency,
          remainingOrbs: availableOrbs
        });
        
        // Add to batch tracking (don't update plan state yet)
        const upgradeKey = `${bestUpgrade.gemId}_${bestUpgrade.upgradeId}`;
        batchPurchases.push({
          gemId: bestUpgrade.gemId,
          upgradeId: bestUpgrade.upgradeId,
          newLevel: bestUpgrade.type === 'gem_node' ? true : bestUpgrade.currentLevel + 1,
          cost: bestUpgrade.cost,
          type: bestUpgrade.type,
          nodeIndex: bestUpgrade.nodeIndex
        });
        batchUpgradeKeys.add(upgradeKey);
        
        // Update in-memory state (like Apps Script)
        upgradeStates.set(upgradeKey, bestUpgrade.type === 'gem_node' ? true : bestUpgrade.currentLevel + 1);
        
        profiler.end(`Iteration ${iteration} - Process Purchase`);
        
        // Flush when we have 5 different upgrades OR no more new upgrades available (like Apps Script)
        const noNewUpgrades = !findBestAffordableUpgrade(allUpgrades.filter(upgrade => {
          const upgradeKey = `${upgrade.gemId}_${upgrade.upgradeId}`;
          return upgrade.cost <= availableOrbs && !batchUpgradeKeys.has(upgradeKey);
        }), availableOrbs);
        
        const shouldFlush = batchUpgradeKeys.size >= 5 || noNewUpgrades || iteration >= maxIterations;
        
        if (shouldFlush && batchPurchases.length > 0) {
          profiler.start(`Iteration ${iteration} - Batch Flush`);
          
          // Apply all batch purchases to plan state
          for (const purchase of batchPurchases) {
            if (purchase.type === 'gem_level') {
              setPlanGemLevel(purchase.gemId, purchase.newLevel);
            } else if (purchase.type === 'gem_node') {
              togglePlanGemNode(purchase.gemId, purchase.nodeIndex);
            } else {
              setPlanUpgradeLevel(purchase.gemId, purchase.upgradeId, purchase.newLevel);
            }
            
            // Track spending
            if (trackSpending) {
              trackSpending(purchase.gemId, purchase.upgradeId, purchase.cost);
            }
          }
          
          // Reset batch tracking to get fresh cost data (like Apps Script)
          batchPurchases = [];
          batchUpgradeKeys.clear();
          
          profiler.countOperation();
          profiler.end(`Iteration ${iteration} - Batch Flush`);
        }
        
        // Progress callback
        if (onProgress) {
          onProgress({
            iteration,
            totalSpent,
            remainingOrbs: availableOrbs,
            purchasesMade: results.length
          });
        }
        
        // Small delay to prevent UI freezing
        if (iteration % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1));
        }
        
        // Warning if approaching max iterations
        if (iteration === maxIterations) {
          console.warn(`⚠️ Maximum iterations (${maxIterations}) reached. Optimization may be incomplete.`);
        }
      }
      
      profiler.end('Optimization Loop');
      profiler.end('Total Optimization');
      
      // Final budget validation (like Apps Script)
      const finalBudgetCheck = budget - totalSpent;
      if (totalSpent > budget) {
        console.error(`⚠️ Budget exceeded! Spent ${formatNumber(totalSpent)} but only had ${formatNumber(budget)} orbs.`);
      } else {
        console.log(`✅ Optimization completed successfully. Spent ${formatNumber(totalSpent)} orbs, ${formatNumber(finalBudgetCheck)} remaining.`);
      }
      
      const report = profiler.getReport();
      console.log(report);
      
      return {
        success: true,
        results,
        totalSpent,
        remainingOrbs: availableOrbs,
        iterations: iteration,
        performanceReport: report
      };
      
    } catch (error) {
      profiler.end('Total Optimization');
      console.error('Optimization error:', error);
      
      return {
        success: false,
        error: error.message,
        results: [],
        totalSpent: 0,
        remainingOrbs: budget
      };
    }
  }
  
  /**
   * Finds the best affordable upgrade based on efficiency (like Apps Script)
   */
  function findBestAffordableUpgrade(upgrades, availableOrbs) {
    let bestUpgrade = null;
    let bestEfficiency = 0;
    
    for (const upgrade of upgrades) {
      if (upgrade.cost > availableOrbs) continue;
      
      if (upgrade.efficiency > bestEfficiency) {
        bestEfficiency = upgrade.efficiency;
        bestUpgrade = upgrade;
      }
    }
    
    return bestUpgrade;
  }
  
  /**
   * Reset all planned upgrades to minimum values
   */
  function resetAllUpgrades(options) {
    const {
      getMinimumGemLevel,
      setPlanGemLevel,
      getMinimumUpgradeLevel,
      setPlanUpgradeLevel
    } = options;
    
    for (const gem of GEM_LIST) {
      // Reset gem level to minimum
      const minGemLevel = getMinimumGemLevel(gem.id);
      setPlanGemLevel(gem.id, minGemLevel);
      
      // Reset all upgrade levels to minimum
      if (gem.upgrades) {
        for (const upgrade of gem.upgrades) {
          const minUpgradeLevel = getMinimumUpgradeLevel(gem.id, upgrade.id);
          setPlanUpgradeLevel(gem.id, upgrade.id, minUpgradeLevel);
        }
      }
    }
  }
  
  /**
   * Format efficiency for display (same logic as GemPlannerModal)
   */
  function formatEfficiency(efficiency) {
    if (efficiency === 0 || efficiency == null || efficiency === undefined) return '0.00';
    
    // Show the actual final efficiency value (as shown in debug log)
    // Use scientific notation for very large/small numbers, otherwise fixed decimal
    if (Math.abs(efficiency) >= 1000 || (Math.abs(efficiency) < 0.01 && efficiency !== 0)) {
      return efficiency.toExponential(2);
    } else {
      return efficiency.toFixed(2);
    }
  }

  /**
   * Format value for display (same logic as GemPlannerModal)
   */
  function formatValue(value) {
    if (value === 0 || value == null || value === undefined) return '0.00';
    
    if (Math.abs(value) >= 1000 || (Math.abs(value) < 0.01 && value !== 0)) {
      return value.toExponential(2);
    } else {
      return value.toFixed(2);
    }
  }

  return {
    optimizeGemPurchases,
    resetAllUpgrades,
    calculateUpgradeEfficiency,
    formatEfficiency,
    formatValue
  };
}
