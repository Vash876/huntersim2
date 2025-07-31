<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <!-- Header mit Farb-Gradient -->
      <div class="bg-gradient-to-r from-purple-900 to-blue-800 p-4 sm:p-5 border-b border-gray-600">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <IconZodiacGemini size="32" class="text-purple-300" />
            <div>
              <h1 class="text-2xl font-bold text-white">Gem Planner</h1>
              <p class="text-purple-200 text-sm">Plan your Ouroboros Orb investments</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Available OO Display -->
            <div class="bg-black/20 rounded-lg px-3 py-2">
              <div class="text-xs text-purple-200">Available OO</div>
              <div class="text-lg font-bold text-white">{{ formatNumber(currentStats.availableOO || 0) }}</div>
            </div>
            
            <!-- Actions -->
            <button
              @click="openStatsModal"
              class="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <IconSettings size="16" />
              Stats
            </button>
            
            <div class="relative">
              <button
                @click="showActionsDropdown = !showActionsDropdown"
                class="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <IconDots size="16" />
                <IconChevronDown size="14" :class="{ 'transform rotate-180': showActionsDropdown }" />
              </button>
              
              <!-- Dropdown Menu -->
              <div v-if="showActionsDropdown" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                <button
                  @click="importPlan"
                  class="w-full px-4 py-2 text-left text-white hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
                >
                  <IconFileImport size="16" />
                  Import Plan
                </button>
                <button
                  @click="exportPlan"
                  class="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2"
                >
                  <IconDownload size="16" />
                  Export Plan
                </button>
                <div class="border-t border-gray-700"></div>
                <button
                  @click="resetPlanner"
                  class="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
                >
                  <IconRefresh size="16" />
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Gem Overview -->
      <div class="lg:col-span-1">
        <div class="bg-gray-850 rounded-lg p-4 border border-gray-700">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <IconZodiacGemini size="20" />
            Gems Overview
          </h2>
          
          <div class="space-y-3">
            <div
              v-for="gem in gemList"
              :key="gem.id"
              @click="selectGem(gem.id)"
              class="p-3 rounded-lg cursor-pointer transition-all border"
              :class="[
                selectedGemId === gem.id 
                  ? 'border-purple-500 bg-purple-900/20' 
                  : 'border-gray-600 bg-gray-800 hover:bg-gray-750 hover:border-gray-500'
              ]"
            >
              <!-- Gem Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div 
                    class="w-4 h-4 rounded-full"
                    :style="{ background: gem.color.gradient }"
                  ></div>
                  <span class="font-medium text-white">{{ gem.name }}</span>
                </div>
                <div class="text-sm text-gray-400">
                  Level {{ getCurrentGemLevel(gem.id) }}
                </div>
              </div>
              
              <!-- Gem Stats -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="text-gray-400">
                  Nodes: {{ getCurrentGemNodes(gem.id) }}/3
                </div>
                <div class="text-gray-400">
                  Upgrades: {{ getActiveUpgradeCount(gem.id) }}
                </div>
              </div>
              
              <!-- Progress Bar -->
              <div class="mt-2 bg-gray-700 rounded-full h-1">
                <div 
                  class="h-1 rounded-full transition-all"
                  :style="{ 
                    width: `${getGemProgress(gem.id)}%`,
                    background: gem.color.gradient
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Gem Details & Planning -->
      <div class="lg:col-span-2">
        <div v-if="selectedGem" class="space-y-6">
          <!-- Selected Gem Header -->
          <div class="bg-gray-850 rounded-lg p-4 border border-gray-700">
            <div class="flex items-center gap-3 mb-4">
              <div 
                class="w-8 h-8 rounded-full"
                :style="{ background: selectedGem.color.gradient }"
              ></div>
              <div>
                <h2 class="text-xl font-bold text-white">{{ selectedGem.name }} Gem</h2>
                <p class="text-gray-400 text-sm">Current Level: {{ getCurrentGemLevel(selectedGem.id) }}</p>
              </div>
            </div>
            
            <!-- Gem Level Controls -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-800 rounded-lg p-3">
                <label class="block text-sm font-medium text-gray-300 mb-2">Gem Level</label>
                <ToolValueControls
                  :value="getCurrentGemLevel(selectedGem.id)"
                  :min-value="0"
                  :max-value="selectedGem.maxLevel"
                  @update:value="updateGemLevel(selectedGem.id, $event)"
                />
                <div class="mt-2 text-xs text-gray-400">
                  Next Level Cost: {{ formatNumber(getNextLevelCost(selectedGem.id)) }} OO
                </div>
              </div>
              
              <div class="bg-gray-800 rounded-lg p-3">
                <label class="block text-sm font-medium text-gray-300 mb-2">Gem Nodes</label>
                <div class="grid grid-cols-3 gap-2">
                  <div
                    v-for="(node, index) in selectedGem.gemNodes"
                    :key="index"
                    class="text-center"
                  >
                    <button
                      @click="toggleGemNode(selectedGem.id, index)"
                      class="w-full p-2 rounded text-xs transition-colors"
                      :class="[
                        hasGemNode(selectedGem.id, index)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      ]"
                    >
                      Node {{ index + 1 }}
                    </button>
                    <div class="text-xs text-gray-400 mt-1">
                      {{ formatNumber(node.cost) }} OO
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upgrades Section -->
          <div class="bg-gray-850 rounded-lg p-4 border border-gray-700">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <IconTrendingUp size="20" />
              Upgrades
            </h3>
            
            <div class="space-y-3">
              <div
                v-for="upgrade in getAvailableUpgrades(selectedGem.id)"
                :key="upgrade.id"
                class="bg-gray-800 rounded-lg p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div 
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: upgrade.color }"
                    ></div>
                    <div>
                      <div class="font-medium text-white">{{ upgrade.name }}</div>
                      <div class="text-sm text-gray-400">{{ upgrade.resource }}</div>
                    </div>
                  </div>
                  <div class="text-sm text-gray-400">
                    Level {{ getCurrentUpgradeLevel(selectedGem.id, upgrade.id) }}/{{ upgrade.maxLevel }}
                  </div>
                </div>
                
                <!-- Upgrade Level Control -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs text-gray-400 mb-1">Current Level</label>
                    <ToolValueControls
                      :value="getCurrentUpgradeLevel(selectedGem.id, upgrade.id)"
                      :min-value="0"
                      :max-value="upgrade.maxLevel"
                      @update:value="updateUpgradeLevel(selectedGem.id, upgrade.id, $event)"
                    />
                  </div>
                  
                  <div class="flex flex-col justify-end">
                    <div class="text-xs text-gray-400 mb-1">Next Level Cost</div>
                    <div class="text-sm text-white">
                      {{ formatNumber(getUpgradeNextLevelCost(selectedGem.id, upgrade.id)) }} OO
                    </div>
                  </div>
                </div>
                
                <!-- Current Multiplier Display -->
                <div class="mt-3 pt-3 border-t border-gray-700">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-400">Current Multiplier:</span>
                    <span class="text-sm font-mono text-green-400">
                      {{ formatMultiplier(getCurrentMultiplier(selectedGem.id, upgrade.id)) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- No Gem Selected State -->
        <div v-else class="bg-gray-850 rounded-lg p-8 text-center border border-gray-700">
          <IconZodiacGemini size="48" class="text-gray-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-gray-300 mb-2">Select a Gem</h3>
          <p class="text-gray-400">Choose a gem from the left panel to view and plan your upgrades.</p>
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
  IconZodiacGemini, 
  IconSettings, 
  IconDots, 
  IconChevronDown,
  IconFileImport,
  IconDownload,
  IconRefresh,
  IconTrendingUp
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { GEMS, GEM_LIST } from '@/constants/gem-planner';

// State
const selectedGemId = ref(null);
const showStatsModal = ref(false);
const showActionsDropdown = ref(false);
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
const selectedGem = computed(() => selectedGemId.value ? GEMS[selectedGemId.value] : null);

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
function selectGem(gemId) {
  selectedGemId.value = gemId;
  showActionsDropdown.value = false;
}

function getCurrentGemLevel(gemId) {
  return gemStates.value[gemId]?.level || 0;
}

function getCurrentGemNodes(gemId) {
  const nodes = gemStates.value[gemId]?.nodes || [false, false, false];
  return nodes.filter(Boolean).length;
}

function getActiveUpgradeCount(gemId) {
  const upgrades = gemStates.value[gemId]?.upgrades || {};
  return Object.values(upgrades).filter(level => level > 0).length;
}

function getGemProgress(gemId) {
  const gem = GEMS[gemId];
  if (!gem) return 0;
  
  const currentLevel = getCurrentGemLevel(gemId);
  const maxLevel = gem.maxLevel;
  const nodeProgress = getCurrentGemNodes(gemId) / 3;
  const upgradeProgress = getActiveUpgradeCount(gemId) / gem.upgrades.length;
  
  // Weighted average: 40% level, 30% nodes, 30% upgrades
  return ((currentLevel / maxLevel) * 40 + nodeProgress * 30 + upgradeProgress * 30);
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
  showActionsDropdown.value = false;
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
  showActionsDropdown.value = false;
  showToastMessage('Import functionality coming soon', 'info');
}

function exportPlan() {
  showActionsDropdown.value = false;
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
  showActionsDropdown.value = false;
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
  
  // Select first gem by default
  if (GEM_LIST.length > 0) {
    selectedGemId.value = GEM_LIST[0].id;
  }
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
