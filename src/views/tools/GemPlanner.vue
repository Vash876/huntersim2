<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <div class="bg-gradient-to-r from-purple-900 to-blue-800 p-4 sm:p-5 border-b border-gray-600">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <!-- Image and Title in one line -->
            <div class="flex items-center mb-1">
              <IconDiamond size="24" class="mr-2 text-purple-400" />
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
            
            <!-- New Gem Plan Button -->
            <button
              @click="openGemPlannerModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconPlus size="18" />
              <span>New Gem Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan Overview -->
    <div class="mb-6">
      <!-- Saved Plans Section -->
      <div v-if="plans.length > 0" class="mb-6">        
        <Draggable 
          v-model="plans"
          :componentData="{
            class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          }"
          handle=".grip-handle"
          :group="{ name: 'gem-plans' }"
          itemKey="id"
          :animation="200"
          ghostClass="ghost"
          chosenClass="chosen"
          dragClass="dragging"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <GemPlanCard
              :plan="element"
              @click="() => openPlanDetailsModal(element)"
              @edit="() => editPlan(element)"
              @copy="() => copyPlan(element)"
              @share="() => sharePlan(element)"
              @delete="() => deletePlan(element.id)"
            />
          </template>
        </Draggable>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center text-gray-400 py-12">
        <IconDiamond size="48" class="mx-auto mb-4 text-purple-500" />
        <h3 class="text-xl font-semibold mb-2">Welcome to Gem Planner</h3>
        <p class="text-sm mb-4">Create and manage your gem investment plans to optimize your orb spending.</p>
        <p class="text-xs text-gray-500 mb-2">Starting values are automatically taken from your current global gem configuration.</p>
        <p class="text-xs text-gray-500">Click "New Gem Plan" to get started with gem planning.</p>
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

    <!-- Plan Details Modal -->
    <GemPlanDetailsModal
      :is-visible="showPlanDetailsModal"
      :plan="selectedPlanForDetails"
      @close="closePlanDetailsModal"
      @edit-plan="onEditPlanFromDetails"
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

    <!-- Alert Dialog -->
    <AlertDialog
      :isVisible="alertDialog.isVisible"
      :title="alertDialog.title"
      :message="alertDialog.message"
      :type="alertDialog.type"
      :showCancel="alertDialog.showCancel"
      :confirmText="alertDialog.confirmText"
      :cancelText="alertDialog.cancelText"
      @confirm="alertDialog.onConfirm"
      @cancel="alertDialog.onCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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
import GemPlannerModal from '@/components/common/gem-planner/GemPlannerModal.vue';
import GemPlanCard from '@/components/common/gem-planner/GemPlanCard.vue';
import GemPlanDetailsModal from '@/components/common/gem-planner/GemPlanDetailsModal.vue';
import GameStatsModal from '@/components/common/gem-planner/GameStatsModal.vue';
import WeightsModal from '@/components/common/gem-planner/WeightsModal.vue';
import AlertDialog from '@/components/common/AlertDialog.vue';
import Draggable from 'vuedraggable';
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
const showPlanDetailsModal = ref(false);
const editingPlan = ref(null); // Track which plan is being edited
const selectedPlanForDetails = ref(null); // Track which plan is being viewed

// Toast notification
const toast = ref({ show: false, message: '', type: 'info' });

// Alert dialog state
const alertDialog = ref({
  isVisible: false,
  title: '',
  message: '',
  type: 'info',
  showCancel: false,
  confirmText: 'OK',
  cancelText: 'Cancel',
  onConfirm: null,
  onCancel: null
});

// Store reactive references
const gameStats = computed(() => gemPlannerStore.gameStats);
const weights = computed(() => gemPlannerStore.weights);

// Local reactive copy of plans for draggable
const plans = ref([]);

// Original saved plans for computed
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
      // Update existing plan with full data
      await gemPlanningStore.updateOrbSpendingPlan(plan.id, plan);
      showToastMessage(`Plan "${plan.name}" updated successfully!`, 'success');
    } else {
      // Create new plan with full data - use the complete plan object
      await gemPlanningStore.createOrbSpendingPlanFromData(plan);
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
  // Handle clicking on the plan card - now redirects to details modal
  openPlanDetailsModal(plan);
}

// Plan Details Modal Functions
function openPlanDetailsModal(plan) {
  selectedPlanForDetails.value = plan;
  showPlanDetailsModal.value = true;
}

function closePlanDetailsModal() {
  showPlanDetailsModal.value = false;
  selectedPlanForDetails.value = null;
}

function onEditPlanFromDetails() {
  // Close details modal and open edit modal
  if (selectedPlanForDetails.value) {
    editingPlan.value = selectedPlanForDetails.value;
    showPlanDetailsModal.value = false;
    showGemPlannerModal.value = true;
  }
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

// Alert helper functions
function showAlert(message, title = 'Alert', type = 'info') {
  alertDialog.value = {
    isVisible: true,
    title,
    message,
    type,
    showCancel: false,
    confirmText: 'OK',
    onConfirm: () => {
      alertDialog.value.isVisible = false;
    },
    onCancel: null
  };
}

function showConfirm(message, title = 'Confirm', onConfirm, onCancel = null) {
  alertDialog.value = {
    isVisible: true,
    title,
    message,
    type: 'warning',
    showCancel: true,
    confirmText: 'Yes',
    cancelText: 'No',
    onConfirm: () => {
      alertDialog.value.isVisible = false;
      if (onConfirm) onConfirm();
    },
    onCancel: () => {
      alertDialog.value.isVisible = false;
      if (onCancel) onCancel();
    }
  };
}

async function deletePlan(planId) {
  const plan = gemPlanningStore.getOrbSpendingPlanById(planId);
  if (plan) {
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
  showConfirm(
    'Are you sure you want to reset all gem data? This cannot be undone.',
    'Reset Planner',
    async () => {
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
  );
}

function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Drag & Drop functionality
function onDragEnd(event) {
  console.log('Gem plans reordered:', plans.value.map(p => p.name));
  
  // Save the new order to the planning store
  gemPlanningStore.saveOrbSpendingPlansOrder(plans.value);
  
  // Show success message
  showToastMessage('Plan order updated', 'success', 1500);
}

// Watch for changes in saved plans and sync to local plans array
watch(savedPlans, (newPlans) => {
  plans.value = [...newPlans];
}, { immediate: true, deep: true });
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

/* Draggable animations and styles */
.flip-list-move {
  transition: transform 0.5s;
}

.flip-list-enter-active, 
.flip-list-leave-active {
  transition: all 0.5s;
}

.flip-list-enter-from, 
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.ghost {
  opacity: 0.5;
  background-color: rgba(51, 51, 51, 0.3) !important;
  border: 1px dashed rgba(156, 163, 175, 0.7) !important;
}

.chosen {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.dragging {
  opacity: 0.8;
}

.grip-handle {
  cursor: grab;
}

.grip-handle:active {
  cursor: grabbing;
}
</style>
