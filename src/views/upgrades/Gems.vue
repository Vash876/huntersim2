<!-- Gems - Central Gem Management -->
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Überschrift -->
    <h2 class="text-2xl font-bold mb-4 text-center text-white">
      <span>Gems</span>
    </h2>
    
    <!-- Info Banner with Toggle -->
    <div class="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-6">
      <!-- Desktop Layout -->
      <div class="hidden md:flex items-center justify-center relative">
        <p class="text-blue-200 text-sm text-center">
          Configure your current Gem levels, Gem nodes and upgrades here. These values will be used across all tools on this site.
        </p>
        <div class="absolute right-0 flex items-center gap-3">
          <span class="text-blue-200 text-sm font-medium whitespace-nowrap">Show only Sim relevant:</span>
          <button 
            @click="showOnlySimRelevant = !showOnlySimRelevant" 
            class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
            :class="{
              'bg-green-600': showOnlySimRelevant,
              'bg-blue-600': !showOnlySimRelevant
            }"
          >
            <span 
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
              :class="{
                'translate-x-6': showOnlySimRelevant,
                'translate-x-1': !showOnlySimRelevant
              }"
            ></span>
          </button>
        </div>
      </div>
      
      <!-- Mobile Layout -->
      <div class="md:hidden text-center space-y-3">
        <p class="text-blue-200 text-sm">
          Configure your current Gem levels, Gem nodes and upgrades here. These values will be used across all tools on this site.
        </p>
        <div class="flex items-center justify-center gap-3">
          <span class="text-blue-200 text-sm font-medium">Show only Sim relevant:</span>
          <button 
            @click="showOnlySimRelevant = !showOnlySimRelevant" 
            class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
            :class="{
              'bg-green-600': showOnlySimRelevant,
              'bg-blue-600': !showOnlySimRelevant
            }"
          >
            <span 
              class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
              :class="{
                'translate-x-6': showOnlySimRelevant,
                'translate-x-1': !showOnlySimRelevant
              }"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content - Ultra Compact Grid -->
    <div class="space-y-3">
      <!-- Gem Cards Grid - Super Compact -->
      <div 
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-1.5"
      >
        <div
          v-for="gem in gemList"
          :key="gem.id"
          class="bg-gray-900/80 border border-gray-700/50 rounded-xl hover:border-purple-500/50 transition-all duration-300 ease-in-out"
        >
          <!-- Gem Header - Fixed height to prevent layout jumps -->
          <div 
            class="gem-header border-b border-gray-600/50 rounded-t-xl p-2 transition-all duration-300 ease-in-out"
          >
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <div 
                  class="w-4 h-4 rounded-full border border-gray-500"
                  :style="{ background: gem.color.gradient }"
                ></div>
                <h3 class="text-sm font-semibold text-white truncate">{{ gem.name }}</h3>
              </div>
              <div class="flex items-center gap-1">
                <span 
                  class="text-xs text-white px-1.5 py-0.5 rounded-full font-mono border border-gray-500/50"
                  :style="{ background: gem.color.gradient }"
                >
                  {{ getCurrentGemLevel(gem.id) }}/{{ gem.maxLevel }}
                </span>
              </div>
            </div>
            
            <!-- Level & Cost in single row -->
            <div class="flex items-center gap-2">
              <div class="flex-1">
                <ToolValueControls
                  :value="getCurrentGemLevel(gem.id)"
                  :min-value="0"
                  :max-value="gem.maxLevel"
                  @update:value="updateGemLevel(gem.id, $event)"
                  :show-fast-controls="false"
                  :autoEdit="true"
                />
              </div>
            </div>
            
            <!-- Gem Nodes - Only show if gem has nodes -->
            <div 
              v-if="getAvailableGemNodes(gem.id).length > 0" 
              class="flex gap-1 mt-2"
            >
              <button
                v-for="(node, index) in getAvailableGemNodes(gem.id)"
                :key="`${gem.id}-node-${index}`"
                @click="toggleGemNode(gem.id, gem.gemNodes.indexOf(node))"
                class="flex-1 py-1 text-xs rounded transition-all duration-200 ease-in-out font-mono border border-gray-500 hover:scale-105"
                :class="[
                  hasGemNode(gem.id, gem.gemNodes.indexOf(node))
                    ? 'text-white shadow-lg'
                    : 'bg-gray-600/60 text-gray-300 hover:bg-gray-500/60',
                  isNodeNewlyAppeared(gem.id, gem.gemNodes.indexOf(node)) ? 'gem-node-pulse' : ''
                ]"
                :style="hasGemNode(gem.id, gem.gemNodes.indexOf(node)) ? { background: gem.color.gradient } : {}"
              >
                {{ gem.gemNodes.indexOf(node) + 1 }}
              </button>
            </div>
          </div>
          
          <!-- Upgrades - Minimal Layout -->
          <div class="p-1 space-y-1">
            <div
              v-for="upgrade in getAvailableUpgrades(gem.id)"
              :key="upgrade.id"
              class="bg-gray-800/60 rounded-sm p-2 hover:bg-gray-700/60 transition-colors border-l-3"
              :style="{ borderLeftColor: upgrade.color }"
            >
              <!-- Upgrade Header -->
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-1 min-w-0">
                  <span class="text-xs font-medium text-white truncate">{{ upgrade.name }}</span>
                </div>
                <span class="text-xs bg-gray-600/80 text-gray-300 px-1.5 py-0.5 rounded-full font-mono">
                  {{ upgrade.maxLevel }}
                </span>
              </div>
              
              <!-- Controls & Info Row -->
              <div class="flex items-center gap-2">
                <div class="flex-1">
                  <ToolValueControls
                    :value="getCurrentUpgradeLevel(gem.id, upgrade.id)"
                    :min-value="0"
                    :max-value="upgrade.maxLevel"
                    @update:value="updateUpgradeLevel(gem.id, upgrade.id, $event)"
                    :show-fast-controls="false"
                    :autoEdit="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Decimal from 'break_infinity.js';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { GEMS, GEM_LIST } from '@/constants/gem-planner';
import { formatNumber, formatNumberDecimal } from '@/composables/format.js';
import { useGemPlannerStore } from '@/store/gemPlannerStore.js';

// Initialize store
const gemPlannerStore = useGemPlannerStore();

// State
const showOnlySimRelevant = ref(false);
const newlyAppearedNodes = ref(new Set()); // Track newly appeared nodes for animation

// Computed
const gemList = computed(() => GEM_LIST);

// Initialize gem states
function initializeGemStates() {
  GEM_LIST.forEach(gem => {
    gemPlannerStore.initializeGemState(gem.id, gem.maxLevel, gem.upgrades);
  });
}

// Gem Functions
function getCurrentGemLevel(gemId) {
  const gemState = gemPlannerStore.getGemState(gemId);
  return gemState?.level || 0;
}

function updateGemLevel(gemId, newLevel) {
  // Validate level bounds
  const gem = GEMS[gemId];
  if (!gem) return;
  
  newLevel = Math.max(0, Math.min(newLevel, gem.maxLevel));
  
  // Special handling for Exodus level changes to track new nodes
  if (gemId === 'exodus') {
    const currentExodusLevel = getCurrentGemLevel('exodus');
    
    // If Exodus reaches level 5 for the first time, mark all new nodes
    if (currentExodusLevel < 5 && newLevel >= 5) {
      // Clear previous newly appeared nodes
      newlyAppearedNodes.value.clear();
      
      // Mark all gems' new nodes as newly appeared
      GEM_LIST.forEach(otherGem => {
        if (otherGem.gemNodes) {
          otherGem.gemNodes.forEach((node, nodeIndex) => {
            if (node.unlockRequirement === 'exodus-5') {
              newlyAppearedNodes.value.add(`${otherGem.id}-node-${nodeIndex}`);
            }
          });
        }
      });
      
      // Remove the "new" effect after animation completes
      setTimeout(() => {
        newlyAppearedNodes.value.clear();
      }, 1500);
    }
    
    // If Exodus level drops below 5, clear animation tracking
    if (currentExodusLevel >= 5 && newLevel < 5) {
      newlyAppearedNodes.value.clear();
    }
  }
  
  // Check if we're reducing the level and need to reset upgrades
  const currentLevel = getCurrentGemLevel(gemId);
  if (newLevel < currentLevel) {
    // Find upgrades that will no longer be available
    const upgradesToReset = gem.upgrades.filter(upgrade => 
      newLevel < upgrade.unlock && getCurrentUpgradeLevel(gemId, upgrade.id) > 0
    );
    
    // Reset those upgrades to 0
    upgradesToReset.forEach(upgrade => {
      gemPlannerStore.updateUpgradeLevel(gemId, upgrade.id, 0);
    });
  }
  
  // Special handling for Exodus: Reset Exodus-5 dependent gem nodes
  if (gemId === 'exodus' && newLevel < 5) {
    // Reset all Exodus-5 dependent gem nodes for all gems
    GEM_LIST.forEach(otherGem => {
      if (otherGem.gemNodes) {
        otherGem.gemNodes.forEach((node, nodeIndex) => {
          if (node.unlockRequirement === 'exodus-5' && hasGemNode(otherGem.id, nodeIndex)) {
            gemPlannerStore.toggleGemNode(otherGem.id, nodeIndex);
          }
        });
      }
    });
  }
  
  // Update the level in store
  gemPlannerStore.updateGemLevel(gemId, newLevel);
}

function toggleGemNode(gemId, nodeIndex) {
  const hasNode = hasGemNode(gemId, nodeIndex);
  const gem = GEMS[gemId];
  
  if (!gem || !gem.gemNodes || !gem.gemNodes[nodeIndex]) return;
  
  // Check unlock requirements
  const node = gem.gemNodes[nodeIndex];
  if (getCurrentGemLevel(gemId) < (node.unlock || 1)) {
    return;
  }
  
  // Check if node requires Exodus level 5
  if (node.unlockRequirement === 'exodus-5' && getCurrentGemLevel('exodus') < 5) {
    return;
  }
  
  // Toggle the node in store
  gemPlannerStore.toggleGemNode(gemId, nodeIndex);
}

function hasGemNode(gemId, nodeIndex) {
  const gemState = gemPlannerStore.getGemState(gemId);
  return gemState?.nodes[nodeIndex] || false;
}

// Get available gem nodes based on Exodus level
function getAvailableGemNodes(gemId) {
  const gem = GEMS[gemId];
  if (!gem || !gem.gemNodes) return [];
  
  const exodusLevel = getCurrentGemLevel('exodus');
  
  // If Exodus is not level 5, only show original nodes (first 3)
  if (exodusLevel < 5) {
    return gem.gemNodes.filter(node => !node.unlockRequirement);
  }
  
  // If Exodus is level 5, show all nodes
  return gem.gemNodes;
}

// Check if a node is newly appeared (for animation)
function isNodeNewlyAppeared(gemId, nodeIndex) {
  return newlyAppearedNodes.value.has(`${gemId}-node-${nodeIndex}`);
}

// Upgrade Functions
function getAvailableUpgrades(gemId) {
  const gem = GEMS[gemId];
  if (!gem) return [];
  
  const currentLevel = getCurrentGemLevel(gemId);
  let upgrades = gem.upgrades.filter(upgrade => currentLevel >= upgrade.unlock);
  
  // Filter for sim-relevant upgrades if toggle is active
  if (showOnlySimRelevant.value) {
    upgrades = upgrades.filter(upgrade => upgrade.hunter === true);
  }
  
  return upgrades;
}

function getCurrentUpgradeLevel(gemId, upgradeId) {
  const gemState = gemPlannerStore.getGemState(gemId);
  return gemState?.upgrades[upgradeId] || 0;
}

function updateUpgradeLevel(gemId, upgradeId, newLevel) {
  const gem = GEMS[gemId];
  if (!gem) return;
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return;
  
  // Validate level bounds
  newLevel = Math.max(0, Math.min(newLevel, upgrade.maxLevel));
  
  // Update the level in store
  gemPlannerStore.updateUpgradeLevel(gemId, upgradeId, newLevel);
}

function getCurrentMultiplier(gemId, upgradeId) {
  const gem = GEMS[gemId];
  if (!gem) return new Decimal(1);
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return new Decimal(1);
  
  const currentLevel = getCurrentUpgradeLevel(gemId, upgradeId);
  const gemLevel = getCurrentGemLevel(gemId);
  
  if (currentLevel === 0) return new Decimal(1);
  
  try {
    // Use the formula from the upgrade definition
    let result;
    if (upgrade.formula) {
      // Replace variables in formula
      const formula = upgrade.formula
        .replace(/level/g, currentLevel)
        .replace(/gemLevel/g, gemLevel);
      
      // Evaluate the formula (simple math operations)
      result = new Decimal(eval(formula));
    } else {
      // Fallback to basic calculation
      result = new Decimal(upgrade.baseMultiplier || 1).pow(currentLevel);
    }
    
    return result;
  } catch (error) {
    console.error(`Error calculating multiplier for ${gemId}.${upgradeId}:`, error);
    return new Decimal(1);
  }
}

// Utility Functions
function formatMultiplier(multiplier) {
  // Handle our custom Decimal-like objects (with mantissa/exponent)
  if (multiplier && typeof multiplier === 'object' && 
      (multiplier.mantissa !== undefined || multiplier.exponent !== undefined)) {
    const decimalValue = new Decimal(multiplier.mantissa || 1, multiplier.exponent || 0);
    return 'x' + formatNumberDecimal(decimalValue);
  }
  
  // Handle Decimal instances
  if (multiplier instanceof Decimal) {
    return 'x' + formatNumberDecimal(multiplier);
  }
  
  // Handle regular numbers (fallback)
  if (typeof multiplier === 'number') {
    return 'x' + formatNumber(multiplier);
  }
  
  return 'x1'; // Fallback
}

function formatMultiplierWithType(gemId, upgradeId, multiplier) {
  const gem = GEMS[gemId];
  if (!gem) return formatMultiplier(multiplier);
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return formatMultiplier(multiplier);
  
  // Check if it's an additive type
  if (upgrade.type === 'additive') {
    // For additive upgrades, show as +X instead of xX
    const value = multiplier instanceof Decimal ? multiplier : new Decimal(multiplier || 0);
    return '+' + formatNumberDecimal(value);
  }
  
  // Default to multiplicative formatting
  return formatMultiplier(multiplier);
}

// Save and load toggle settings
function saveToggleSettings() {
  try {
    localStorage.setItem('gems_showOnlySimRelevant', JSON.stringify(showOnlySimRelevant.value));
  } catch (error) {
    console.error('Error saving toggle settings:', error);
  }
}

// Load toggle settings
function loadToggleSettings() {
  try {
    const saved = localStorage.getItem('gems_showOnlySimRelevant');
    if (saved !== null) {
      showOnlySimRelevant.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading toggle settings:', error);
  }
}

// Lifecycle
onMounted(async () => {
  try {
    // Load toggle settings first
    loadToggleSettings();
    
    // Initialize the gem planner store first
    gemPlannerStore.init();
    
    // Then initialize gem states if not already done
    initializeGemStates();
  } catch (error) {
    console.error('Error loading gems:', error);
  }
});

// Watch for toggle changes to save settings
watch(showOnlySimRelevant, () => {
  saveToggleSettings();
});
</script>

<style scoped>
/* Fixed height for gem headers to prevent layout jumps */
.gem-header {
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

/* Simple pulse animation for newly appeared nodes */
@keyframes gem-node-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.6);
    background-color: rgba(147, 51, 234, 0.1);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(147, 51, 234, 0.3);
    background-color: rgba(147, 51, 234, 0.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(147, 51, 234, 0);
    background-color: transparent;
  }
}

.gem-node-pulse {
  animation: gem-node-pulse 1.2s ease-out;
}

/* Enhanced hover effects */
.gem-node-button:hover {
  transform: translateY(-1px) scale(1.02);
  transition: all 0.2s ease-out;
}
</style>