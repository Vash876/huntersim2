<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <div class="bg-gradient-to-r from-purple-900 to-blue-800 p-4 sm:p-5 border-b border-gray-600">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <!-- Image and Title in one line -->
            <div class="flex items-center mb-1">
              <img src="@/assets/general/orbs.png" class="w-6 h-6 mr-2" alt="Orbs" />
              <h1 class="text-2xl font-bold">Gem Planner</h1>
            </div>
            <p class="text-sm text-purple-200">Manage your gem investment plans</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row sm:flex-wrap justify-end gap-3">
            <!-- Stats Button -->
            <button
              @click="openStatsModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconSettings size="18" />
              <span>Stats</span>
            </button>

            <!-- Weights Button -->
            <button
              @click="openWeightsModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconScale size="18" />
              <span>Weights</span>
            </button>
            
            <!-- Import Plan -->
            <button
              @click="importPlan"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconFileImport size="18" />
              <span>Import Plan</span>
            </button>

            <!-- Export Plan -->
            <button
              @click="exportPlan"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconDownload size="18" />
              <span>Export Plan</span>
            </button>

            <!-- Reset Button -->
            <button
              @click="resetPlanner"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconRefresh size="18" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Settings Bar -->
      <div class="bg-gray-800 py-3 px-4 flex flex-wrap items-center justify-between gap-2">
        <!-- Left Side: Plan Title or Overview -->
        <div class="flex items-center gap-3">
          <div class="text-gray-300 text-sm">
            <span>Plan Overview</span>
          </div>
        </div>

        <!-- Right Side: New Plan Button -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- New Plan Button -->
          <button
            @click="openGemPlannerModal"
            class="flex items-center space-x-2 px-4 py-2 rounded-md bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold shadow-lg transition-colors duration-200 text-sm"
          >
            <IconPlus size="18" />
            <span>New Orb Plan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Plan Overview -->
    <div class="mb-6">
      <!-- Saved Plans Section -->
      <div v-if="savedPlans.length > 0" class="mb-6">
        <div class="flex items-center mb-3">
          <div class="w-1.5 h-5 bg-green-500 rounded-r mr-2"></div>
          <h3 class="text-lg font-semibold text-white">Saved Plans</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <GemPlanCard
            v-for="plan in savedPlans"
            :key="plan.id"
            :plan="plan"
            @click="() => handleSelectPlan(plan)"
            @load="() => loadPlan(plan)"
            @edit="() => editPlan(plan)"
            @copy="() => copyPlan(plan)"
            @share="() => sharePlan(plan)"
            @delete="() => deletePlan(plan.id)"
          />
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center text-gray-400 py-12">
        <IconDiamond size="48" class="mx-auto mb-4 text-purple-500" />
        <h3 class="text-xl font-semibold mb-2">Welcome to Gem Planner</h3>
        <p class="text-sm mb-4">Create and manage your gem investment plans to optimize your orb spending.</p>
        <p class="text-xs text-gray-500">Click "New Orb Plan" to get started with gem planning.</p>
      </div>
    </div>

    <!-- Gem Planner Modal -->
    <GemPlannerModal
      :show="showGemPlannerModal"
      :editPlan="editingPlan"
      :gameStats="gameStats"
      :weights="weights"
      :getCurrentGemLevel="getCurrentGemLevel"
      :updateGemLevel="updateGemLevel"
      :toggleGemNode="toggleGemNode"
      :hasGemNode="hasGemNode"
      :getNextLevelCost="getNextLevelCost"
      :getAvailableUpgrades="getAvailableUpgrades"
      :getCurrentUpgradeLevel="getCurrentUpgradeLevel"
      :updateUpgradeLevel="updateUpgradeLevel"
      :getUpgradeNextLevelCost="getUpgradeNextLevelCost"
      :getCurrentMultiplier="getCurrentMultiplier"
      @close="closeGemPlannerModal"
      @plan-created="onPlanCreated"
      @plan-saved="onPlanSaved"
    />

    <!-- Stats Modal -->
    <GameStatsModal
      :is-visible="showStatsModal"
      :initial-stats="gameStats"
      @close="closeStatsModal"
      @stats-updated="onStatsUpdated"
    />

    <!-- Weights Modal -->
    <WeightsModal
      :is-visible="showWeightsModal"
      :initial-weights="weights"
      @close="closeWeightsModal"
      @weights-updated="onWeightsUpdated"
    />

    <!-- Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white flex items-center"
        :class="{ 
          'bg-green-600': toast.type === 'success',
          'bg-red-600': toast.type === 'error',
          'bg-blue-600': toast.type === 'info'
        }"
      >
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  IconSettings, 
  IconFileImport,
  IconDownload,
  IconRefresh,
  IconScale,
  IconDiamond,
  IconPlus,
  IconEye,
  IconTrash
} from '@tabler/icons-vue';
import GemPlannerModal from '@/components/gem-planner/GemPlannerModal.vue';
import GemPlanCard from '@/components/gem-planner/GemPlanCard.vue';
import GameStatsModal from '@/components/common/gem-planner/GameStatsModal.vue';
import WeightsModal from '@/components/common/gem-planner/WeightsModal.vue';
import { formatNumber } from '@/composables/format.js';
import { useGemPlannerStore } from '@/store/gemPlannerStore.js';
import { useGemPlanningStore } from '@/store/gemPlanningStore.js';
import { GEMS } from '@/constants/gem-planner';

// Initialize stores
const gemPlannerStore = useGemPlannerStore(); // For current gem data
const gemPlanningStore = useGemPlanningStore(); // For planning data

// State
const showStatsModal = ref(false);
const showWeightsModal = ref(false);
const showGemPlannerModal = ref(false);
const editingPlan = ref(null); // Track which plan is being edited

// Toast notification
const toast = ref({ show: false, message: '', type: 'info' });

// Store reactive references
const gameStats = computed(() => gemPlannerStore.gameStats);
const weights = computed(() => gemPlannerStore.weights);
const savedPlans = computed(() => gemPlanningStore.orbSpendingPlans);

// Modal Functions
function openStatsModal() {
  showStatsModal.value = true;
}

function closeStatsModal() {
  showStatsModal.value = false;
}

function onStatsUpdated(newStats) {
  gemPlannerStore.updateGameStats(newStats);
}

function openWeightsModal() {
  showWeightsModal.value = true;
}

function closeWeightsModal() {
  showWeightsModal.value = false;
}

function onWeightsUpdated(newWeights) {
  gemPlannerStore.updateWeights(newWeights);
}

// Plan Management Functions
function openGemPlannerModal() {
  editingPlan.value = null; // Clear any editing state
  showGemPlannerModal.value = true;
}

function closeGemPlannerModal() {
  showGemPlannerModal.value = false;
  editingPlan.value = null; // Clear editing state when closing
}

function onPlanCreated(plan) {
  // Don't set active plan - keep modal independent
  // User can work on gem planning without changing the background view
  
  showToastMessage(`Gem planning active: ${plan.name}`, 'success');
}

async function onPlanSaved(plan) {
  // Save the plan to the new planning store
  console.log('Saving plan:', plan);
  
  try {
    // Create or update plan in the planning store
    if (plan.id && gemPlanningStore.getOrbSpendingPlanById(plan.id)) {
      // Update existing plan
      await gemPlanningStore.updateOrbSpendingPlan(plan.id, plan);
      showToastMessage(`Plan "${plan.name}" updated successfully!`, 'success');
    } else {
      // Create new plan
      await gemPlanningStore.createOrbSpendingPlan(
        plan.name, 
        plan.trPlanId, 
        plan.initialBudget || 0, 
        plan.trCount || 1
      );
      showToastMessage(`Plan "${plan.name}" saved successfully!`, 'success');
    }
  } catch (error) {
    console.error('Error saving plan:', error);
    showToastMessage('Failed to save plan', 'error');
  }
}

// Plan Management Functions
async function loadPlan(plan) {
  try {
    await gemPlanningStore.loadOrbSpendingPlan(plan.id);
    showToastMessage(`Loaded plan: ${plan.name}`, 'success');
  } catch (error) {
    console.error('Error loading plan:', error);
    showToastMessage('Failed to load plan', 'error');
  }
}

function handleSelectPlan(plan) {
  // Handle clicking on the plan card
  showToastMessage(`Selected plan: ${plan.name}`, 'info');
  // TODO: Could open a detail modal or navigate to edit view
}

function editPlan(plan) {
  // Set the plan to edit and open modal
  editingPlan.value = plan;
  showGemPlannerModal.value = true;
}

async function copyPlan(plan) {
  try {
    const copiedPlan = await gemPlanningStore.duplicateOrbSpendingPlan(plan.id);
    if (copiedPlan) {
      showToastMessage(`Plan "${plan.name}" copied successfully!`, 'success');
    }
  } catch (error) {
    console.error('Error copying plan:', error);
    showToastMessage('Failed to copy plan', 'error');
  }
}

function sharePlan(plan) {
  // TODO: Implement plan sharing (could generate a shareable link or export)
  showToastMessage(`Sharing plan: ${plan.name}`, 'info');
  // For now, could copy to clipboard or open share dialog
}

async function deletePlan(planId) {
  if (confirm('Are you sure you want to delete this plan? This cannot be undone.')) {
    try {
      await gemPlanningStore.deleteOrbSpendingPlan(planId);
      showToastMessage('Plan deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting plan:', error);
      showToastMessage('Failed to delete plan', 'error');
    }
  }
}

// Utility function to format dates
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

// Delegate functions for modal (these use the global gem store)
function getCurrentGemLevel(gemId) {
  const gemState = gemPlannerStore.getGemState(gemId);
  return gemState?.level || 0;
}

function updateGemLevel(gemId, newLevel) {
  gemPlannerStore.updateGemLevel(gemId, newLevel);
}

function toggleGemNode(gemId, nodeIndex) {
  gemPlannerStore.toggleGemNode(gemId, nodeIndex);
}

function hasGemNode(gemId, nodeIndex) {
  const gemState = gemPlannerStore.getGemState(gemId);
  return gemState?.nodes[nodeIndex] || false;
}

function getNextLevelCost(gemId) {
  const gem = GEMS[gemId];
  if (!gem) return 0;
  
  const currentLevel = getCurrentGemLevel(gemId);
  if (currentLevel >= gem.maxLevel) return 0;
  
  const nextLevel = currentLevel + 1;
  const qualityCost = gem.qualityCosts.find(cost => cost.level === nextLevel);
  return qualityCost?.cost || 0;
}

function getAvailableUpgrades(gemId) {
  const gem = GEMS[gemId];
  if (!gem) return [];
  
  const currentLevel = getCurrentGemLevel(gemId);
  return gem.upgrades.filter(upgrade => currentLevel >= upgrade.unlock);
}

function getCurrentUpgradeLevel(gemId, upgradeId) {
  const gemState = gemPlannerStore.getGemState(gemId);
  return gemState?.upgrades[upgradeId] || 0;
}

function updateUpgradeLevel(gemId, upgradeId, newLevel) {
  gemPlannerStore.updateUpgradeLevel(gemId, upgradeId, newLevel);
}

function getUpgradeNextLevelCost(gemId, upgradeId) {
  const gem = GEMS[gemId];
  if (!gem) return 0;
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return 0;
  
  const currentLevel = getCurrentUpgradeLevel(gemId, upgradeId);
  if (currentLevel >= upgrade.maxLevel) return 0;
  
  // Base cost calculation
  let cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel);
  
  // Apply cost bumps if defined
  if (upgrade.costBumps && upgrade.costBumps.length > 0) {
    upgrade.costBumps.forEach(bump => {
      if (currentLevel >= bump.startLevel) {
        cost *= Math.pow(bump.multiplier, currentLevel - bump.startLevel);
      }
    });
  }

  return cost;
}

function getCurrentMultiplier(gemId, upgradeId) {
  // Simplified version for modal delegate
  return { mantissa: 1, exponent: 0, toString: () => '1' };
}

function formatMultiplierWithType(gemId, upgradeId, multiplier) {
  return 'x1.00';
}

// Import/Export Functions
async function importPlan() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Try importing to both stores
        const gemPlannerSuccess = gemPlannerStore.importData(data);
        const gemPlanningSuccess = await gemPlanningStore.importData(data);
        
        if (gemPlannerSuccess || gemPlanningSuccess) {
          showToastMessage('Plan imported successfully', 'success');
        } else {
          showToastMessage('Failed to import plan', 'error');
        }
      } catch (error) {
        console.error('Import error:', error);
        showToastMessage('Invalid file format', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

async function exportPlan() {
  try {
    // Export data from both stores
    const gemPlannerData = gemPlannerStore.exportData();
    const gemPlanningData = await gemPlanningStore.exportData();
    
    const combinedData = {
      ...gemPlannerData,
      ...gemPlanningData,
      exportedAt: new Date().toISOString(),
      version: '2.0' // New version with dual store support
    };
    
    const dataStr = JSON.stringify(combinedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `gem-planner-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToastMessage('Plan exported successfully', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showToastMessage('Failed to export plan', 'error');
  }
}

async function resetPlanner() {
  if (confirm('Are you sure you want to reset all gem data? This cannot be undone.')) {
    try {
      // Reset current gem data (old store)
      gemPlannerStore.resetToDefaults();
      
      // Clear all planning data (new store)
      await gemPlanningStore.clearAllData();
      
      showToastMessage('Planner reset successfully', 'info');
    } catch (error) {
      console.error('Error resetting planner:', error);
      showToastMessage('Failed to reset planner', 'error');
    }
  }
}

function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}
</script>

<style scoped>
/* Toast animation */
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
