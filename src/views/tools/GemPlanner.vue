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
            <p class="text-sm text-purple-200">Plan and optimize your Ouroboros Orb investments</p>
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
    </div>

    <!-- Main Content - Ultra Compact Grid -->
    <div class="space-y-3">
      <!-- Gem Cards Grid - Super Compact -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div
          v-for="gem in gemList"
          :key="gem.id"
          class="bg-gray-900/80 border border-gray-700/50 rounded-md hover:border-purple-500/50 transition-colors"
        >
          <!-- Gem Header - Dynamic padding based on nodes -->
          <div 
            class="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600/50"
            :class="[
              gem.gemNodes && gem.gemNodes.length > 0 ? 'p-2' : 'p-2 pb-10'
            ]"
          >
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-2">
                <div 
                  class="w-4 h-4 rounded-full border border-gray-500"
                  :style="{ background: gem.color.gradient }"
                ></div>
                <h3 class="text-sm font-semibold text-white truncate">{{ gem.name }}</h3>
              </div>
              <div class="text-xs text-purple-300 font-mono">
                {{ getCurrentGemLevel(gem.id) }}/{{ gem.maxLevel }}
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
                />
              </div>
              <div class="text-xs font-mono text-yellow-400 min-w-0">
                {{ formatNumber(getNextLevelCost(gem.id)) }}
              </div>
            </div>
            
            <!-- Gem Nodes - Only show if gem has nodes -->
            <div v-if="gem.gemNodes && gem.gemNodes.length > 0" class="flex gap-1 mt-2">
              <button
                v-for="(node, index) in gem.gemNodes"
                :key="index"
                @click="toggleGemNode(gem.id, index)"
                class="flex-1 py-1 text-xs rounded transition-colors font-mono"
                :class="[
                  hasGemNode(gem.id, index)
                    ? 'bg-green-600/80 text-white'
                    : 'bg-gray-600/60 text-gray-300 hover:bg-gray-500/60'
                ]"
                :title="`Node ${index + 1}: ${formatNumber(node.cost)}`"
              >
                {{ index + 1 }}
              </button>
            </div>
          </div>
          
          <!-- Upgrades - Minimal Layout -->
          <div class="p-2 space-y-1">
            <div
              v-for="upgrade in getAvailableUpgrades(gem.id)"
              :key="upgrade.id"
              class="bg-gray-800/60 rounded-sm p-2 hover:bg-gray-700/60 transition-colors"
            >
              <!-- Upgrade Header -->
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-1 min-w-0">
                  <div 
                    class="w-2 h-2 rounded-full flex-shrink-0"
                    :style="{ backgroundColor: upgrade.color }"
                  ></div>
                  <span class="text-xs font-medium text-white truncate">{{ upgrade.name }}</span>
                </div>
                <span class="text-xs text-gray-400 font-mono">
                  {{ getCurrentUpgradeLevel(gem.id, upgrade.id) }}/{{ upgrade.maxLevel }}
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
                    size="small"
                  />
                </div>
                <div class="text-xs font-mono text-yellow-400 min-w-0">
                  {{ formatNumber(getUpgradeNextLevelCost(gem.id, upgrade.id)) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Modal -->
    <div v-if="showStatsModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
        <h3 class="text-lg font-semibold text-white mb-4">Gem Planner Stats</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Available Ouroboros Orbs</label>
            <input
              v-model.number="tempStats.availableOO"
              type="number"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="0"
            />
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="closeStatsModal"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveStats"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>

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
  IconRefresh
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { GEMS, GEM_LIST } from '@/constants/gem-planner';

// State
const showStatsModal = ref(false);
const currentStats = ref({
  availableOO: 0
});
const tempStats = ref({});

// Gem States - für jedes Gem Level, Nodes und Upgrades speichern
const gemStates = ref({});

// Toast notification
const toast = ref({ show: false, message: '', type: 'info' });

// Computed
const gemList = computed(() => GEM_LIST);

// Initialize gem states
function initializeGemStates() {
  GEM_LIST.forEach(gem => {
    if (!gemStates.value[gem.id]) {
      gemStates.value[gem.id] = {
        level: 0,
        nodes: [false, false, false],
        upgrades: {}
      };
      
      // Initialize all upgrades to level 0
      gem.upgrades.forEach(upgrade => {
        gemStates.value[gem.id].upgrades[upgrade.id] = 0;
      });
    }
  });
}

// Gem Functions
function getCurrentGemLevel(gemId) {
  return gemStates.value[gemId]?.level || 0;
}

function updateGemLevel(gemId, newLevel) {
  if (!gemStates.value[gemId]) return;
  gemStates.value[gemId].level = newLevel;
  saveToLocalStorage();
}

function toggleGemNode(gemId, nodeIndex) {
  if (!gemStates.value[gemId]) return;
  gemStates.value[gemId].nodes[nodeIndex] = !gemStates.value[gemId].nodes[nodeIndex];
  saveToLocalStorage();
}

function hasGemNode(gemId, nodeIndex) {
  return gemStates.value[gemId]?.nodes[nodeIndex] || false;
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

// Upgrade Functions
function getAvailableUpgrades(gemId) {
  const gem = GEMS[gemId];
  if (!gem) return [];
  
  const currentLevel = getCurrentGemLevel(gemId);
  return gem.upgrades.filter(upgrade => currentLevel >= upgrade.unlock);
}

function getCurrentUpgradeLevel(gemId, upgradeId) {
  return gemStates.value[gemId]?.upgrades[upgradeId] || 0;
}

function updateUpgradeLevel(gemId, upgradeId, newLevel) {
  if (!gemStates.value[gemId]) return;
  gemStates.value[gemId].upgrades[upgradeId] = newLevel;
  saveToLocalStorage();
}

function getUpgradeNextLevelCost(gemId, upgradeId) {
  const gem = GEMS[gemId];
  if (!gem) return 0;
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return 0;
  
  const currentLevel = getCurrentUpgradeLevel(gemId, upgradeId);
  if (currentLevel >= upgrade.maxLevel) return 0;
  
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}

function getCurrentMultiplier(gemId, upgradeId) {
  const gem = GEMS[gemId];
  if (!gem) return 1;
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return 1;
  
  const currentLevel = getCurrentUpgradeLevel(gemId, upgradeId);
  const gemLevel = getCurrentGemLevel(gemId);
  
  if (currentLevel === 0) return 1;
  
  try {
    // Mock gameStats for now - this could be expanded later
    const gameStats = {};
    return upgrade.multiplier.calculate(currentLevel, gemLevel, gameStats);
  } catch (error) {
    console.warn(`Error calculating multiplier for ${gemId}/${upgradeId}:`, error);
    return 1;
  }
}

// Modal Functions
function openStatsModal() {
  tempStats.value = { ...currentStats.value };
  showStatsModal.value = true;
}

function closeStatsModal() {
  showStatsModal.value = false;
}

function saveStats() {
  currentStats.value = { ...tempStats.value };
  saveToLocalStorage();
  showStatsModal.value = false;
  showToastMessage('Stats updated successfully', 'success');
}

// Import/Export Functions
function importPlan() {
  showToastMessage('Import functionality coming soon', 'info');
}

function exportPlan() {
  showToastMessage('Export functionality coming soon', 'info');
}

function resetPlanner() {
  if (confirm('Are you sure you want to reset all gem data? This cannot be undone.')) {
    gemStates.value = {};
    currentStats.value = { availableOO: 0 };
    initializeGemStates();
    saveToLocalStorage();
    showToastMessage('Planner reset successfully', 'info');
  }
}

// Utility Functions
function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'k';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
}

function formatMultiplier(multiplier) {
  if (multiplier < 10) return multiplier.toFixed(2) + 'x';
  if (multiplier < 1000) return multiplier.toFixed(1) + 'x';
  return formatNumber(multiplier) + 'x';
}

function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Storage Functions
function saveToLocalStorage() {
  const data = {
    gemStates: gemStates.value,
    currentStats: currentStats.value
  };
  localStorage.setItem('gemplanner_data', JSON.stringify(data));
}

function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem('gemplanner_data');
    if (data) {
      const parsed = JSON.parse(data);
      gemStates.value = parsed.gemStates || {};
      currentStats.value = parsed.currentStats || { availableOO: 0 };
    }
  } catch (error) {
    console.warn('Error loading gem planner data:', error);
  }
}

// Lifecycle
onMounted(() => {
  loadFromLocalStorage();
  initializeGemStates();
});
</script>

<style scoped>
.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
}

.bg-gray-750 {
  background-color: rgba(55, 65, 81, 0.7);
}

/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
