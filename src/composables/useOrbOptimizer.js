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
      report += `Total Time: ${totalTime}ms (${(totalTime/1000).toFixed(3)}s)\n`;
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
      
      // Calculate multiplier improvement FIRST (same logic as in GemPlannerModal)
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
      
      if (weightValue === 0) {
        // Fallback: If no weight is defined, use a basic efficiency calculation
        // This ensures upgrades without weights can still be purchased
        const improvement = nextMultiplier > currentMultiplier ? nextMultiplier / Math.max(currentMultiplier, 1) : 0;
        if (improvement <= 1) return { value: 0, efficiency: 0 };
        
        // Use log improvement as value with a default weight of 1
        const logImprovement = Math.log10(improvement);
        const fallbackValue = logImprovement * 1; // Default weight = 1
        const scalingFactor = Math.pow(10, efficiencyScaling);
        const fallbackEfficiency = (fallbackValue / nextLevelCost) * scalingFactor;
        
        return { value: fallbackValue, efficiency: fallbackEfficiency };
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
      // Special handling for LP resource: use log10(2^(improvement/10)) instead of log10(improvement)
      let logImprovement;
      if (upgrade.resource === 'LP') {
        // For LP upgrades: log10(2^(improvement/10))
        const exponent = improvement / 10;
        const baseValue = Math.pow(2, exponent);
        logImprovement = baseValue > 0 ? Math.log10(baseValue) : 0;
      } else {
        // Standard calculation for all other resources
        logImprovement = improvement > 0 ? Math.log10(improvement) : 0;
      }
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
    
    if (currentLevel === 0) {
      // For additive upgrades, level 0 means 0 contribution, not 1
      if (upgrade.type === 'additive') {
        return 0;
      } else {
        return 1; // Multiplicative upgrades start at 1
      }
    }
    
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
   * Calculate the efficiency of a gem level upgrade by considering its impact on ALL upgrades in that gem
   */
  function calculateGemLevelEfficiency(gem, currentGemLevel, gemLevelCost, weights, getPlanGemLevel, getPlanUpgradeLevel) {
    let totalEfficiencyGain = 0;
    
    // Check if gem has upgrades that benefit from gem level
    if (gem.upgrades && gem.upgrades.length > 0) {
      const nextGemLevel = currentGemLevel + 1;
      
      // Calculate improvement for each upgrade in this gem
      gem.upgrades.forEach(upgrade => {
        const currentUpgradeLevel = getPlanUpgradeLevel(gem.id, upgrade.id);
        
        // Only consider upgrades that are currently purchased (level > 0)
        if (currentUpgradeLevel > 0) {
          try {
            // Calculate current multiplier at current gem level
            const currentMultiplier = upgrade.multiplier.calculate(currentUpgradeLevel, currentGemLevel);
            
            // Calculate multiplier at next gem level (same upgrade level, higher gem level)
            const nextMultiplier = upgrade.multiplier.calculate(currentUpgradeLevel, nextGemLevel);
            
            // Calculate the improvement factor
            let improvementFactor = 1;
            if (currentMultiplier && nextMultiplier) {
              // Handle Decimal objects
              let currentValue, nextValue;
              
              if (typeof currentMultiplier === 'object' && currentMultiplier.mantissa !== undefined) {
                currentValue = new Decimal(currentMultiplier.mantissa).mul(new Decimal(10).pow(currentMultiplier.exponent));
              } else {
                currentValue = new Decimal(currentMultiplier);
              }
              
              if (typeof nextMultiplier === 'object' && nextMultiplier.mantissa !== undefined) {
                nextValue = new Decimal(nextMultiplier.mantissa).mul(new Decimal(10).pow(nextMultiplier.exponent));
              } else {
                nextValue = new Decimal(nextMultiplier);
              }
              
              if (currentValue.gt(0)) {
                improvementFactor = nextValue.div(currentValue).toNumber();
              }
            }
            
            // Get weight for this upgrade
            let weightValue = 0;
            if (upgrade.weight && weights) {
              if (typeof upgrade.weight === 'string') {
                const weightMapping = {
                  'Cells': 'cells', 'MP': 'mp', 'Shards': 'shards',
                  'RP': 'rp', 'AP': 'ap', 'Mats': 'mats', 'Orbs': 'orbs'
                };
                const weightKey = weightMapping[upgrade.weight] || upgrade.weight.toLowerCase();
                weightValue = weights[weightKey] || 0;
              } else if (upgrade.weight.calculate) {
                weightValue = upgrade.weight.calculate(weights);
              }
            }
            
            // If no weight, use fallback weight of 1
            if (weightValue === 0) {
              weightValue = 1;
            }
            
            // Calculate value gain: log(improvement) * weight * upgrade_level
            if (improvementFactor > 1) {
              const logImprovement = Math.log10(improvementFactor);
              const valueGain = logImprovement * weightValue * currentUpgradeLevel;
              totalEfficiencyGain += valueGain;
            }
            
          } catch (error) {
            console.warn(`Error calculating gem level impact for ${gem.id}/${upgrade.id}:`, error);
          }
        }
      });
    }
    
    // Fallback: if no upgrades benefit or no efficiency gain, use basic weight-based efficiency
    if (totalEfficiencyGain === 0) {
      let weightValue = 0;
      if (weights && gem.weight) {
        if (typeof gem.weight === 'string') {
          const weightMapping = {
            'Cells': 'cells', 'MP': 'mp', 'Shards': 'shards',
            'RP': 'rp', 'AP': 'ap', 'Mats': 'mats', 'Orbs': 'orbs'
          };
          const weightKey = weightMapping[gem.weight] || gem.weight.toLowerCase();
          weightValue = weights[weightKey] || 0;
        } else if (gem.weight.calculate) {
          weightValue = gem.weight.calculate(weights);
        }
      }
      
      // Use weight or fallback to basic efficiency
      if (weightValue > 0) {
        totalEfficiencyGain = weightValue;
      } else {
        totalEfficiencyGain = 1; // Minimum fallback
      }
    }
    
    // Apply scaling factor (same as upgrade efficiency)
    const scalingFactor = Math.pow(10, 10); // Default efficiency scaling
    return (totalEfficiencyGain / gemLevelCost) * scalingFactor;
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
      const maxIterations = 10000;
      
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
        const zeroEfficiencyUpgrades = []; // Store upgrades with no efficiency for fallback
        
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
                    
                    // Include free upgrades (cost = 0 or null) with maximum efficiency
                    if (cost >= 0 || cost === null) {
                      if (cost === 0 || cost === null) {
                        // Free upgrades get maximum priority
                        allUpgrades.push({
                          gemId: gem.id,
                          upgradeId: upgrade.id,
                          gemName: gem.name,
                          upgradeName: upgrade.name,
                          currentLevel: getPlanUpgradeLevel(gem.id, upgrade.id),
                          cost: 0,
                          efficiency: Number.MAX_SAFE_INTEGER,
                          type: 'gem_upgrade'
                        });
                      } else {
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
                      } else {
                        // Store zero-efficiency upgrades for potential fallback consideration
                        zeroEfficiencyUpgrades.push({
                          gemId: gem.id,
                          upgradeId: upgrade.id,
                          gemName: gem.name,
                          upgradeName: upgrade.name,
                          currentLevel,
                          cost,
                          efficiency: 0,
                          type: 'upgrade'
                        });
                      }
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
              if (qualityCost && qualityCost.cost !== undefined) {
                if (qualityCost.cost === 0 || qualityCost.cost === null) {
                  // Free gem level upgrades get maximum priority
                  allUpgrades.push({
                    gemId: gem.id,
                    upgradeId: '_gem_level',
                    gemName: gem.name,
                    upgradeName: 'Gem Quality',
                    currentLevel: currentGemLevel,
                    cost: 0,
                    efficiency: Number.MAX_SAFE_INTEGER,
                    type: 'gem_level'
                  });
                } else {
                  // Enhanced efficiency calculation for gem levels - consider impact on ALL upgrades
                  let efficiency = calculateGemLevelEfficiency(gem, currentGemLevel, qualityCost.cost, weights, getPlanGemLevel, getPlanUpgradeLevel);
                
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
          }
          
          // Gem nodes (toggles) - like row 53 in Apps Script
          if (gem.gemNodes && gem.gemNodes.length > 0) {
            gem.gemNodes.forEach((node, nodeIndex) => {
              // Include all nodes - cost 0 or null nodes have infinite efficiency (highest priority)
              if (node.cost !== undefined) {
                const upgradeKey = `${gem.id}_node_${nodeIndex}`;
                
                if (!batchUpgradeKeys.has(upgradeKey) && !hasPlanGemNode(gem.id, nodeIndex)) {
                  // Free nodes (cost = 0 or null) get maximum efficiency priority
                  let efficiency = (node.cost === 0 || node.cost === null) ? Number.MAX_SAFE_INTEGER : 2 / node.cost;
                  
                  // DEBUG: Log free nodes
                  if (node.cost === 0 || node.cost === null) {
                    console.log(`🆓 Found FREE NODE: ${gem.name} Node ${nodeIndex + 1}, cost: ${node.cost}, efficiency: ${efficiency}, hasNode: ${hasPlanGemNode(gem.id, nodeIndex)}`);
                  }
                  
                  // Apply weights if available for gem nodes (only for non-free nodes)
                  if (weights && node.weight && node.cost > 0) {
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
        
        // Fallback logic: Add zero-efficiency upgrades if they are 1000x cheaper than cheapest efficient upgrade
        if (zeroEfficiencyUpgrades.length > 0 && allUpgrades.length > 0) {
          // Find cheapest upgrade with efficiency
          const cheapestEfficientUpgrade = allUpgrades.reduce((cheapest, upgrade) => 
            upgrade.cost < cheapest.cost ? upgrade : cheapest
          );
          
          const fallbackThreshold = cheapestEfficientUpgrade.cost / 1000;
          
          // Add zero-efficiency upgrades that are cheaper than threshold
          const fallbackUpgrades = zeroEfficiencyUpgrades.filter(upgrade => 
            upgrade.cost <= fallbackThreshold
          ).map(upgrade => ({
            ...upgrade,
            efficiency: 0.001 / upgrade.cost // Very low but non-zero efficiency
          }));
          
          if (fallbackUpgrades.length > 0) {
            console.log(`💡 Adding ${fallbackUpgrades.length} fallback upgrades (cost ≤ ${formatNumber(fallbackThreshold)}):`, 
              fallbackUpgrades.map(u => `${u.gemName}/${u.upgradeName} (${formatNumber(u.cost)})`));
            allUpgrades.push(...fallbackUpgrades);
          }
        }
        
        // Find best affordable upgrade (like Apps Script)
        profiler.start(`Iteration ${iteration} - Find Best Upgrade`);
        const bestUpgrade = findBestAffordableUpgrade(allUpgrades, availableOrbs);
        profiler.end(`Iteration ${iteration} - Find Best Upgrade`);
        
        // DEBUG: Log upgrade search results
        if (iteration <= 5 || iteration % 1000 === 0) {
          console.log(`DEBUG Iteration ${iteration}:`, {
            totalUpgrades: allUpgrades.length,
            availableOrbs: formatNumber(availableOrbs),
            bestUpgrade: bestUpgrade ? {
              name: `${bestUpgrade.gemName}/${bestUpgrade.upgradeName}`,
              cost: formatNumber(bestUpgrade.cost),
              efficiency: bestUpgrade.efficiency.toFixed(3),
              currentLevel: bestUpgrade.currentLevel,
              upgradeKey: `${bestUpgrade.gemId}_${bestUpgrade.upgradeId}`
            } : null,
            batchSize: batchPurchases.length
          });
        }
        
        if (!bestUpgrade) {
          console.log(`Optimization complete - no more affordable upgrades found at iteration ${iteration}.`);
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
        
        const shouldFlush = batchUpgradeKeys.size >= 1 || noNewUpgrades || iteration >= maxIterations; // CHANGED: Flush after every purchase
        
        // DEBUG: Log batch flush decision
        if (iteration <= 5 || iteration % 1000 === 0 || shouldFlush) {
          console.log(`DEBUG Batch ${iteration}:`, {
            batchSize: batchUpgradeKeys.size,
            batchPurchases: batchPurchases.length,
            noNewUpgrades,
            shouldFlush,
            maxIterations: iteration >= maxIterations
          });
        }
        
        if (shouldFlush && batchPurchases.length > 0) {
          profiler.start(`Iteration ${iteration} - Batch Flush`);
          
          console.log(`🔥 FLUSHING BATCH: ${batchPurchases.length} purchases at iteration ${iteration}`);
          
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
    
    // DEBUG: Log free upgrades
    const freeUpgrades = upgrades.filter(u => u.cost === 0);
    if (freeUpgrades.length > 0) {
      console.log(`🆓 Found ${freeUpgrades.length} FREE upgrades:`, freeUpgrades.map(u => `${u.gemName}/${u.upgradeName} (${u.efficiency})`));
    }
    
    for (const upgrade of upgrades) {
      if (upgrade.cost > availableOrbs) continue;
      
      if (upgrade.efficiency > bestEfficiency) {
        bestEfficiency = upgrade.efficiency;
        bestUpgrade = upgrade;
      }
    }
    
    // DEBUG: Log selected upgrade
    if (bestUpgrade && bestUpgrade.cost === 0) {
      console.log(`🎯 SELECTED FREE UPGRADE: ${bestUpgrade.gemName}/${bestUpgrade.upgradeName}`);
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
      return efficiency.toExponential(3);
    } else {
      return efficiency.toFixed(3);
    }
  }

  /**
   * Format value for display (same logic as GemPlannerModal)
   */
  function formatValue(value) {
    if (value === 0 || value == null || value === undefined) return '0.00';
    
    if (Math.abs(value) >= 1000 || (Math.abs(value) < 0.01 && value !== 0)) {
      return value.toExponential(3);
    } else {
      return value.toFixed(3);
    }
  }

  return {
    optimizeGemPurchases,
    resetAllUpgrades,
    calculateUpgradeEfficiency,
    calculateGemLevelEfficiency,
    formatEfficiency,
    formatValue
  };
}
