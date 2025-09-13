<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-purple-400">Gem Plan</span>
            <span class=""> - {{ plan?.name || 'Plan Details' }}</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="closeModal" 
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              title="Close"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-h-[90vh] overflow-y-auto">
        <div v-if="!plan" class="p-8 text-center">
          <IconCircleX size="48" class="text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-300 mb-2">Plan Not Found</h3>
          <p class="text-gray-400 mb-6">This plan may have been deleted or does not exist.</p>
          <button 
            @click="closeModal"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
          >
            Close
          </button>
        </div>

        <div v-else>
          <!-- Plan Overview -->
          <div class="p-4 bg-gray-750/60 border-b border-gray-700">
            <h3 class="text-sm font-bold mb-3 text-purple-300">Plan Overview</h3>
            
            <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <!-- Total Budget -->
                <div class="flex items-center">
                  <div class="bg-purple-900/30 p-2 rounded-lg mr-3">
                    <img src="@/assets/general/orbs.png" class="w-5 h-5" alt="Orbs" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Total Budget</div>
                    <div class="text-sm text-white font-medium">{{ formatNumber(totalBudget) }}</div>
                  </div>
                </div>

                <!-- Total Spent -->
                <div class="flex items-center">
                  <div class="bg-red-900/30 p-2 rounded-lg mr-3">
                    <img src="@/assets/general/orbs.png" class="w-5 h-5" alt="Orbs" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Total Spent</div>
                    <div class="text-sm text-white font-medium">{{ formatNumber(totalSpent) }}</div>
                  </div>
                </div>

                <!-- Remaining Budget -->
                <div class="flex items-center">
                  <div class="bg-green-900/30 p-2 rounded-lg mr-3">
                    <img src="@/assets/general/orbs.png" class="w-5 h-5" alt="Orbs" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Remaining</div>
                    <div class="text-sm text-white font-medium">{{ formatNumber(totalBudget - totalSpent) }}</div>
                  </div>
                </div>

                <!-- TRs Count -->
                <div class="flex items-center">
                  <div class="bg-blue-900/30 p-2 rounded-lg mr-3">
                    <IconRepeat size="20" class="text-blue-400" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Traversal Resets</div>
                    <div class="text-sm text-white font-medium">{{ trCount }}</div>
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-4">
                <div class="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Budget Usage</span>
                  <span>{{ budgetUsagePercentage }}%</span>
                </div>
                <div class="w-full bg-gray-600 rounded-full h-1.5">
                  <div 
                    class="bg-purple-600 h-1.5 rounded-full transition-all duration-300" 
                    :style="{ width: `${Math.min(budgetUsagePercentage, 100)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- TR Budget Breakdown -->
          <div v-if="plan.trBudgets && Object.keys(plan.trBudgets).length > 0" class="p-4 border-b border-gray-700">
            <h3 class="text-sm font-bold mb-3 text-purple-300">TR Budget Breakdown</h3>
            
            <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-3">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div 
                  v-for="(budget, trIndex) in plan.trBudgets" 
                  :key="trIndex"
                  class="flex items-center justify-between p-2 bg-gray-800/40 rounded-md"
                >
                  <div class="flex items-center">
                    <div class="bg-blue-900/30 p-1.5 rounded-lg mr-2">
                      <IconRepeat size="16" class="text-blue-400" />
                    </div>
                    <span class="text-sm font-medium text-blue-300">TR {{ trIndex }}</span>
                  </div>
                  <span class="text-xs text-gray-300">{{ formatNumber(budget) }} orbs</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Gem Investments -->
          <div v-if="plan.gemStates && Object.keys(plan.gemStates).length > 0" class="p-4 border-b border-gray-700">
            <h3 class="text-sm font-bold mb-3 text-purple-300">Gem Investments</h3>
            
            <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
              <table class="w-full text-sm">
                <thead class="text-xs text-gray-300 bg-gray-800/80">
                  <tr>
                    <th scope="col" class="px-4 py-2 text-left font-medium">Gem</th>
                    <th scope="col" class="px-4 py-2 text-center font-medium">Level</th>
                    <th scope="col" class="px-4 py-2 text-center font-medium">Nodes</th>
                    <th scope="col" class="px-4 py-2 text-left font-medium">Upgrades</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                  <tr 
                    v-for="(gemState, gemId) in plan.gemStates" 
                    :key="gemId"
                    class="bg-gray-750/20 hover:bg-gray-700/40 transition"
                  >
                    <td class="px-4 py-2.5">
                      <div class="flex items-center">
                        <div class="bg-purple-900/30 p-1.5 rounded-lg mr-2">
                          <IconDiamond size="16" class="text-purple-400" />
                        </div>
                        <span class="text-white font-medium">{{ getGemName(gemId) }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-center">
                      <span class="text-purple-300 font-mono">{{ gemState.level || 0 }}</span>
                    </td>
                    <td class="px-4 py-2.5 text-center">
                      <div v-if="gemState.nodes && gemState.nodes.length > 0" class="flex justify-center space-x-1">
                        <div 
                          v-for="(hasNode, nodeIndex) in gemState.nodes" 
                          :key="nodeIndex"
                          class="w-3 h-3 rounded-full border border-gray-500"
                          :class="hasNode ? 'bg-green-500' : 'bg-gray-700'"
                          :title="`Node ${nodeIndex + 1}: ${hasNode ? 'Unlocked' : 'Locked'}`"
                        ></div>
                      </div>
                      <span v-else class="text-gray-500 text-xs">None</span>
                    </td>
                    <td class="px-4 py-2.5">
                      <div v-if="gemState.upgrades && Object.keys(gemState.upgrades).length > 0" class="space-y-1">
                        <div 
                          v-for="(level, upgradeId) in gemState.upgrades" 
                          :key="upgradeId"
                          class="flex justify-between text-xs"
                        >
                          <span class="text-gray-300">{{ getUpgradeName(upgradeId) }}</span>
                          <span class="text-purple-300 font-mono">Lv.{{ level }}</span>
                        </div>
                      </div>
                      <span v-else class="text-gray-500 text-xs">None</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Resource Improvements -->
          <div class="p-4 border-b border-gray-700">
            <h3 class="text-sm font-bold mb-3 text-purple-300">Resource Multiplier Improvements</h3>
            
            <div class="text-xs text-gray-400 mb-4">
              Shows how much each resource multiplier improves compared to the starting point of this plan.
            </div>
            
            <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
              <table class="w-full text-sm">
                <thead class="text-xs text-gray-300 bg-gray-800/80">
                  <tr>
                    <th scope="col" class="px-4 py-2 text-left font-medium">Resource</th>
                    <th scope="col" class="px-4 py-2 text-right font-medium">Improvement</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                  <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                    <td class="px-4 py-2.5">
                      <div class="flex items-center">
                        <div class="bg-green-900/30 p-1.5 rounded-lg mr-2">
                          <IconCirclePlus size="16" class="text-green-400" />
                        </div>
                        <span class="text-white">Cells</span>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-green-300">
                      {{ formatImprovementMultiplier(calculateCellsMultiplier()) }}
                    </td>
                  </tr>
                  <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                    <td class="px-4 py-2.5">
                      <div class="flex items-center">
                        <div class="bg-red-900/30 p-1.5 rounded-lg mr-2">
                          <IconFlame size="16" class="text-red-400" />
                        </div>
                        <span class="text-white">MP</span>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-red-300">
                      {{ formatImprovementMultiplier(calculateMPMultiplier()) }}
                    </td>
                  </tr>
                  <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                    <td class="px-4 py-2.5">
                      <div class="flex items-center">
                        <div class="bg-blue-900/30 p-1.5 rounded-lg mr-2">
                          <IconCrystalBall size="16" class="text-blue-400" />
                        </div>
                        <span class="text-white">Shards</span>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-blue-300">
                      {{ formatImprovementMultiplier(calculateShardsMultiplier()) }}
                    </td>
                  </tr>
                  <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                    <td class="px-4 py-2.5">
                      <div class="flex items-center">
                        <div class="bg-orange-900/30 p-1.5 rounded-lg mr-2">
                          <IconStar size="16" class="text-orange-400" />
                        </div>
                        <span class="text-white">RP</span>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-orange-300">
                      {{ formatImprovementMultiplier(calculateRPMultiplier()) }}
                    </td>
                  </tr>
                  <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                    <td class="px-4 py-2.5">
                      <div class="flex items-center">
                        <div class="bg-purple-900/30 p-1.5 rounded-lg mr-2">
                          <IconBolt size="16" class="text-purple-400" />
                        </div>
                        <span class="text-white">AP</span>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-purple-300">
                      {{ formatImprovementMultiplier(calculateAPMultiplier()) }}
                    </td>
                  </tr>
                  <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                    <td class="px-4 py-2.5">
                      <div class="flex items-center">
                        <div class="bg-yellow-900/30 p-1.5 rounded-lg mr-2">
                          <IconPackage size="16" class="text-yellow-400" />
                        </div>
                        <span class="text-white">Materials</span>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-yellow-300">
                      {{ formatImprovementMultiplier(calculateMatsMultiplier()) }}
                    </td>
                  </tr>
                  <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                    <td class="px-4 py-2.5">
                      <div class="flex items-center">
                        <div class="bg-indigo-900/30 p-1.5 rounded-lg mr-2">
                          <IconCircle size="16" class="text-indigo-400" />
                        </div>
                        <span class="text-white">Orbs</span>
                      </div>
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-indigo-300">
                      {{ formatImprovementMultiplier(calculateOrbsMultiplier()) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Plan Metadata -->
          <div class="p-4 border-b border-gray-700">
            <h3 class="text-sm font-bold mb-3 text-purple-300">Plan Information</h3>
            
            <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="flex items-center">
                  <div class="bg-gray-900/30 p-1.5 rounded-lg mr-2">
                    <IconCalendarEvent size="16" class="text-gray-400" />
                  </div>
                  <div>
                    <span class="text-gray-400 text-xs">Created:</span>
                    <div class="text-white">{{ formatDate(plan.createdAt) }}</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="bg-gray-900/30 p-1.5 rounded-lg mr-2">
                    <IconEdit size="16" class="text-gray-400" />
                  </div>
                  <div>
                    <span class="text-gray-400 text-xs">Last Updated:</span>
                    <div class="text-white">{{ formatDate(plan.updatedAt) }}</div>
                  </div>
                </div>
                <div v-if="plan.description" class="md:col-span-2">
                  <span class="text-gray-400 text-xs">Description:</span>
                  <p class="text-white mt-1">{{ plan.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-750/60 p-3 border-t border-gray-700">
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-400">
            Total Investment: <span class="text-purple-300">{{ formatNumber(totalSpent) }} orbs</span>
          </div>
          <div class="flex gap-2">
            <button 
              @click="$emit('edit-plan')"
              class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs flex items-center gap-1.5"
            >
              <IconEdit size="14" />
              Edit
            </button>
            <button 
              @click="closeModal" 
              class="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { 
  IconX, 
  IconDiamond, 
  IconCircleX,
  IconRepeat,
  IconTrendingUp,
  IconCirclePlus,
  IconFlame,
  IconCrystalBall,
  IconStar,
  IconBolt,
  IconPackage,
  IconCircle,
  IconCalendarEvent,
  IconEdit
} from '@tabler/icons-vue';
import { formatNumber } from '@/composables/format';
import { GEMS } from '@/constants/gem-planner';
import { useGemPlannerStore } from '@/store/gemPlannerStore';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  plan: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'edit-plan']);

// Get game stats from store
const gemPlannerStore = useGemPlannerStore();
const gameStats = computed(() => gemPlannerStore.gameStats);

// Computed properties for plan statistics
const totalBudget = computed(() => {
  if (!props.plan?.trBudgets) return 0;
  return Object.values(props.plan.trBudgets).reduce((sum, budget) => sum + (budget || 0), 0);
});

const totalSpent = computed(() => {
  // Use plan.totalSpent if available (from newer saved plans)
  if (props.plan?.totalSpent !== undefined && props.plan?.totalSpent !== null) {
    return props.plan.totalSpent;
  }
  
  // Fallback to spentOrbs calculation for older plans
  if (!props.plan?.spentOrbs) return 0;
  
  let total = 0;
  Object.values(props.plan.spentOrbs).forEach(trSpending => {
    Object.values(trSpending || {}).forEach(gemSpending => {
      Object.values(gemSpending || {}).forEach(upgradeSpent => {
        total += upgradeSpent || 0;
      });
    });
  });
  return total;
});

const trCount = computed(() => {
  return props.plan?.maxTRReached || 
         (props.plan?.trBudgets ? Object.keys(props.plan.trBudgets).length : 0) || 
         props.plan?.trCount || 
         1;
});

const budgetUsagePercentage = computed(() => {
  if (totalBudget.value === 0) return 0;
  return Math.round((totalSpent.value / totalBudget.value) * 100);
});

// Helper functions
function closeModal() {
  emit('close');
}

function getGemName(gemId) {
  return GEMS[gemId]?.name || gemId;
}

function getUpgradeName(upgradeId) {
  // Simple upgrade name formatting
  return upgradeId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
}

// Calculate initial multipliers (before plan investments) using effects
function calculateInitialMultipliersByResource(resourceName) {
  let totalMultiplier = 1;
  
  if (!props.plan?.trGemStates) return totalMultiplier;
  
  // Use the first TR state for initial multipliers, or calculate from purchased upgrades
  const initialTRIndex = Math.min(...Object.keys(props.plan.trGemStates).map(Number));
  const initialGemStates = props.plan.trGemStates[initialTRIndex];
  
  // Get initial gem states from plan (if available) or use level 0
  Object.entries(GEMS).forEach(([gemId, gem]) => {
    if (!gem || !gem.upgrades) return;
    
    // Check each upgrade for effects on this resource
    gem.upgrades.forEach(upgrade => {
      // Check if upgrade has effects for this resource
      if (upgrade.effects) {
        const effect = upgrade.effects.find(e => e.resource === resourceName);
        if (effect && effect.multiplier && effect.multiplier.calculate) {
          // Calculate initial level: start from purchased base level, not from first TR
          let initialLevel = 0;
          let initialGemLevel = 1;
          
          // Get base purchased level (before plan optimization)
          if (props.plan?.purchasedUpgrades && props.plan.purchasedUpgrades[gemId] && props.plan.purchasedUpgrades[gemId][upgrade.id]) {
            initialLevel = props.plan.purchasedUpgrades[gemId][upgrade.id];
          }
          
          // Get initial gem level from purchased gems
          if (props.plan?.purchasedGems && props.plan.purchasedGems[gemId]) {
            initialGemLevel = props.plan.purchasedGems[gemId];
          } else if (initialGemStates?.levels && initialGemStates.levels[gemId]) {
            initialGemLevel = initialGemStates.levels[gemId];
          }
          
          if (initialLevel > 0) {
            const multiplier = safeCalculateMultiplier(effect.multiplier, initialLevel, initialGemLevel, gameStats.value);
            totalMultiplier *= multiplier;
          }
        }
      }
      // Fallback to old weight system for backwards compatibility
      else if (upgrade.weight === resourceName || 
               (resourceName === 'AP' && upgrade.id.includes('ap-bonus')) || 
               (resourceName === 'Mats' && upgrade.id.includes('mats-bonus')) || 
               (resourceName === 'Orbs' && upgrade.id.includes('orbs-bonus'))) {
        
        // Get initial level (before the plan was applied)
        let initialLevel = 0;
        let initialGemLevel = 1;
        
        if (props.plan?.initialStates && props.plan.initialStates[gemId]) {
          initialLevel = props.plan.initialStates[gemId].upgrades?.[upgrade.id] || 0;
          initialGemLevel = props.plan.initialStates[gemId].level || 1;
        }
        
        if (initialLevel > 0) {
          const multiplier = safeCalculateMultiplier(upgrade, initialLevel, initialGemLevel, gameStats.value);
          totalMultiplier *= multiplier;
        }
      }
    });
  });
  
  return totalMultiplier;
}

// Calculate final multipliers (after plan investments) using effects
function calculateFinalMultipliersByResource(resourceName) {
  let totalMultiplier = 1;
  
  if (!props.plan?.trGemStates) return totalMultiplier;
  
  // Use the final TR state (highest TR index) for final multipliers
  const finalTRIndex = Math.max(...Object.keys(props.plan.trGemStates).map(Number));
  const finalGemStates = props.plan.trGemStates[finalTRIndex];
  
  if (!finalGemStates?.upgrades) return totalMultiplier;
  
  Object.entries(GEMS).forEach(([gemId, gem]) => {
    if (!gem || !gem.upgrades) return;
    
    const gemUpgrades = finalGemStates.upgrades[gemId];
    if (!gemUpgrades) return;
    
    // Check each upgrade for effects on this resource
    gem.upgrades.forEach(upgrade => {
      // Check if upgrade has effects for this resource
      if (upgrade.effects) {
        const effect = upgrade.effects.find(e => e.resource === resourceName);
        if (effect && effect.multiplier && effect.multiplier.calculate) {
          const level = gemUpgrades[upgrade.id] || 0;
          const gemLevel = finalGemStates.levels?.[gemId] || 1;
          
          if (level > 0) {
            const multiplier = safeCalculateMultiplier(effect.multiplier, level, gemLevel, gameStats.value);
            totalMultiplier *= multiplier;
          }
        }
      }
      // Fallback to old weight system for backwards compatibility
      else if (upgrade.weight === resourceName || 
               (resourceName === 'AP' && upgrade.id.includes('ap-bonus')) || 
               (resourceName === 'Mats' && upgrade.id.includes('mats-bonus')) || 
               (resourceName === 'Orbs' && upgrade.id.includes('orbs-bonus'))) {
        
        const level = gemUpgrades[upgrade.id] || 0;
        const gemLevel = finalGemStates.levels?.[gemId] || 1;
        
        if (level > 0) {
          const multiplier = safeCalculateMultiplier(upgrade, level, gemLevel, gameStats.value);
          totalMultiplier *= multiplier;
        }
      }
    });
  });
  
  console.log(`Total final ${resourceName} multiplier: ${totalMultiplier}`);
  return totalMultiplier;
}

// Helper function to safely calculate multiplier from gem upgrade or effect
function safeCalculateMultiplier(multiplierObject, level, gemLevel, gameStats = {}) {
  try {
    if (multiplierObject && multiplierObject.calculate) {
      const result = multiplierObject.calculate(level, gemLevel, gameStats);
      
      // Handle Decimal.js objects
      if (result && typeof result.toNumber === 'function') {
        return result.toNumber();
      }
      
      // Handle regular numbers
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      }
    }
  } catch (error) {
    console.warn(`Error calculating multiplier:`, error);
  }
  
  return 1; // Safe fallback
}

// Resource multiplier improvements (final / initial) using effects
function calculateCellsMultiplier() {
  const initial = calculateInitialMultipliersByResource('Cells');
  const final = calculateFinalMultipliersByResource('Cells');
  return final / initial;
}

function calculateMPMultiplier() {
  const initial = calculateInitialMultipliersByResource('MP');
  const final = calculateFinalMultipliersByResource('MP');
  return final / initial;
}

function calculateShardsMultiplier() {
  const initial = calculateInitialMultipliersByResource('Shards');
  const final = calculateFinalMultipliersByResource('Shards');
  return final / initial;
}

function calculateRPMultiplier() {
  const initial = calculateInitialMultipliersByResource('RP');
  const final = calculateFinalMultipliersByResource('RP');
  return final / initial;
}

function calculateAPMultiplier() {
  const initial = calculateInitialMultipliersByResource('AP');
  const final = calculateFinalMultipliersByResource('AP');
  return final / initial;
}

function calculateMatsMultiplier() {
  const initial = calculateInitialMultipliersByResource('Mats');
  const final = calculateFinalMultipliersByResource('Mats');
  return final / initial;
}

function calculateOrbsMultiplier() {
  const initial = calculateInitialMultipliersByResource('Orbs');
  const final = calculateFinalMultipliersByResource('Orbs');
  return final / initial;
}

// Format improvement multiplier with improvement indicator
function formatImprovementMultiplier(multiplier) {
  if (!multiplier || multiplier === 0 || multiplier === 1) {
    return 'No change';
  }
  
  // For very large multipliers, use scientific notation
  if (multiplier >= 1e6 || multiplier <= 1e-6) {
    return `${multiplier.toExponential(2)}x improvement`;
  }
  
  // For smaller multipliers, show the actual multiplier value
  if (multiplier >= 1) {
    return `${multiplier.toFixed(2)}x improvement`;
  } else {
    return `${(1/multiplier).toFixed(2)}x decrease`;
  }
}

// Helper function to format multipliers nicely
function formatMultiplier(multiplier) {
  if (multiplier === 1) return '1.00x';
  if (multiplier < 10) return `${multiplier.toFixed(2)}x`;
  if (multiplier < 1000) return `${multiplier.toFixed(1)}x`;
  if (multiplier < 1e6) return `${(multiplier / 1000).toFixed(1)}Kx`;
  if (multiplier < 1e9) return `${(multiplier / 1e6).toFixed(1)}Mx`;
  if (multiplier < 1e12) return `${(multiplier / 1e9).toFixed(1)}Bx`;
  return `${(multiplier / 1e12).toFixed(1)}Tx`;
}

// ESC key handling
function handleKeydown(event) {
  if (event.key === 'Escape' && props.isVisible) {
    closeModal();
  }
}

// Lifecycle
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgba(31, 41, 55, 1);
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
