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
            <p class="text-sm text-purple-200">Plan and optimize your OO investments</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row sm:flex-wrap justify-end gap-3">
            <!-- Orb Plans Button (only shown in orb mode when a plan is active) -->
            <button
              v-if="currentMode === 'orbs' && (activeOrbSpendingPlan || activeTRPlan)"
              @click="openOrbSpendingPlansModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconDiamond size="18" />
              <span>Orb Plans</span>
            </button>

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
        <!-- Left Side: Mode Toggle Buttons -->
        <div class="flex items-center gap-3">
          <button
            @click="setMode('current')"
            :class="[
              'flex items-center space-x-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 text-sm',
              currentMode === 'current' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            ]"
          >
            <IconUser size="18" />
            <span>Current Stats</span>
          </button>
          
          <button
            @click="setMode('orbs')"
            :class="[
              'flex items-center space-x-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 text-sm',
              currentMode === 'orbs' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            ]"
          >
            <img src="@/assets/general/orbs.png" class="w-4 h-4" alt="Orbs" />
            <span>Orb Spending</span>
          </button>
        </div>

        <!-- Right Side: New Plan Button -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- New Plan Button (only shown in orb mode when in plan overview) -->
          <button
            v-if="currentMode === 'orbs' && !activeOrbSpendingPlan && !activeTRPlan"
            @click="openCreateModal"
            class="flex items-center space-x-2 px-4 py-2 rounded-md bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold shadow-lg transition-colors duration-200 text-sm"
          >
            <IconPlus size="18" />
            <span>New Plan</span>
          </button>
        </div>
      </div>
    </div>

    <!-- TR Navigator Section (only shown when a plan is active) -->
    <div v-if="currentMode === 'orbs' && (activeOrbSpendingPlan || activeTRPlan)" class="mb-6 rounded-lg overflow-hidden shadow-lg bg-gray-900/80 border border-gray-700/50">
      <div class="p-4">
        <!-- TR Plan Info (TR Planner Integration) -->
        <div v-if="activeTRPlan && !activeOrbSpendingPlan" class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-lg font-semibold text-white">{{ activeTRPlan.name }}</h4>
            <button
              @click="exitOrbMode"
              class="text-gray-400 hover:text-white transition-colors"
              title="Back to TR Planner"
            >
              <IconArrowLeft size="20" />
            </button>
          </div>
          
          <!-- TR Navigation -->
          <div class="flex items-center justify-between mb-3">
            <button
              @click="previousTR"
              :disabled="currentTRIndex <= 0"
              :class="[
                'flex items-center space-x-2 px-3 py-2 rounded-md transition-colors',
                currentTRIndex <= 0 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-blue-400 hover:text-blue-300 hover:bg-gray-700/50'
              ]"
            >
              <IconChevronLeft size="16" />
              <span>Previous TR</span>
            </button>
            
            <div class="flex items-center space-x-4">
              <span class="text-gray-300 font-mono">
                TR {{ currentTRIndex + 1 }} / {{ totalTRsInPlan }}
              </span>
              <div class="text-sm text-gray-400">
                {{ formatNumber(currentTROrbGains) }} orbs
              </div>
            </div>
            
            <button
              @click="nextTR"
              :disabled="currentTRIndex >= totalTRsInPlan - 1"
              :class="[
                'flex items-center space-x-2 px-3 py-2 rounded-md transition-colors',
                currentTRIndex >= totalTRsInPlan - 1 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-blue-400 hover:text-blue-300 hover:bg-gray-700/50'
              ]"
            >
              <span>Next TR</span>
              <IconChevronRight size="16" />
            </button>
          </div>
        </div>

        <!-- Orb Spending Plan Info -->
        <div v-if="activeOrbSpendingPlan">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-lg font-semibold text-white">{{ activeOrbSpendingPlan.name }}</h4>
            <button
              @click="exitOrbSpendingPlan"
              class="text-gray-400 hover:text-white transition-colors"
              title="Back to Plan Overview"
            >
              <IconArrowLeft size="20" />
            </button>
          </div>
          
          <!-- TR Navigation for Orb Spending Plans -->
          <div class="flex items-center justify-between mb-3">
            <button
              @click="previousTR"
              :disabled="currentTRIndex <= 0"
              :class="[
                'flex items-center space-x-2 px-3 py-2 rounded-md transition-colors',
                currentTRIndex <= 0 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-blue-400 hover:text-blue-300 hover:bg-gray-700/50'
              ]"
            >
              <IconChevronLeft size="16" />
              <span>Previous TR</span>
            </button>
            
            <div class="flex items-center space-x-4">
              <span class="text-gray-300 font-mono">
                TR {{ currentTRIndex + 1 }} / {{ activeOrbSpendingPlan.trCount }}
              </span>
              <div class="text-sm text-gray-400">
                {{ formatNumber(orbSpendingPlanCurrentBudget) }} orbs
              </div>
            </div>
            
            <button
              @click="nextTR"
              :disabled="currentTRIndex >= activeOrbSpendingPlan.trCount - 1"
              :class="[
                'flex items-center space-x-2 px-3 py-2 rounded-md transition-colors',
                currentTRIndex >= activeOrbSpendingPlan.trCount - 1 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-blue-400 hover:text-blue-300 hover:bg-gray-700/50'
              ]"
            >
              <span>Next TR</span>
              <IconChevronRight size="16" />
            </button>
          </div>
          
          <!-- Budget Display -->
          <div class="bg-gray-700/40 rounded-md p-3 mb-4">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <div class="text-xs text-gray-400 mb-1">Available Budget</div>
                <div class="text-lg font-bold text-purple-300 flex items-center">
                  <img src="@/assets/general/orbs.png" class="w-5 h-5 mr-2" alt="Orbs" />
                  {{ formatNumber(availableBudget) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-400 mb-1">Spent</div>
                <div class="text-lg font-bold text-red-300 flex items-center">
                  <img src="@/assets/general/orbs.png" class="w-5 h-5 mr-2" alt="Orbs" />
                  {{ formatNumber(calculateSpentOrbsForTR(currentTRIndex)) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-400 mb-1">Remaining</div>
                <div class="text-lg font-bold text-green-300 flex items-center">
                  <img src="@/assets/general/orbs.png" class="w-5 h-5 mr-2" alt="Orbs" />
                  {{ formatNumber(remainingBudget) }}
                </div>
              </div>
            </div>
            
            <!-- Budget Progress Bar -->
            <div class="mt-3">
              <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Budget Usage</span>
                <span>{{ budgetUsagePercentage }}%</span>
              </div>
              <div class="w-full bg-gray-600 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="[
                    budgetUsagePercentage > 90 ? 'bg-red-500' : 
                    budgetUsagePercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  ]"
                  :style="{ width: `${Math.min(100, budgetUsagePercentage)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Spending Mode Toggle (Manual/Auto) -->
          <div class="flex items-center justify-center gap-3">
            <button
              @click="setSpendingMode('manual')"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors text-sm',
                spendingMode === 'manual' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-600/50 text-gray-300 hover:bg-gray-500/50'
              ]"
            >
              <IconTool size="16" />
              <span>Manual</span>
            </button>
            
            <button
              @click="setSpendingMode('auto')"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors text-sm',
                spendingMode === 'auto' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600/50 text-gray-300 hover:bg-gray-500/50'
              ]"
            >
              <IconRobot size="16" />
              <span>Auto</span>
            </button>
            
            <!-- Clear Spending Button (only in manual mode) -->
            <button
              v-if="spendingMode === 'manual' && calculateSpentOrbsForTR(currentTRIndex) > 0"
              @click="clearCurrentTRSpending"
              class="flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors text-sm bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30"
            >
              <IconTrash size="16" />
              <span>Clear Spending</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Plan Overview (only shown in orb mode when no plan selected) -->
    <div v-if="currentMode === 'orbs' && !activeOrbSpendingPlan && !activeTRPlan" class="mb-6">
      <!-- Plans Section without extra header -->
      <OrbSpendingPlansModal
        :is-visible="true"
        :is-embedded="true"
        @close="handleOrbModalClose"
        @plan-loaded="onOrbSpendingPlanLoaded"
      />
    </div>

    <!-- Main Content - Ultra Compact Grid (only show when not in plan overview) -->
    <div v-if="currentMode === 'current' || (currentMode === 'orbs' && (activeOrbSpendingPlan || activeTRPlan))" class="space-y-3">
      <!-- Gem Cards Grid - Super Compact -->
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-2">
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
                  :autoEdit="true"
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
                class="flex-1 py-1 text-xs rounded transition-colors font-mono border border-gray-500"
                :class="[
                  hasGemNode(gem.id, index)
                    ? 'text-white'
                    : 'bg-gray-600/60 text-gray-300 hover:bg-gray-500/60'
                ]"
                :style="hasGemNode(gem.id, index) ? { background: gem.color.gradient } : {}"
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
                    :show-fast-controls="false"
                    :autoEdit="true"
                  />
                </div>
                <!-- <div class="text-xs font-mono text-yellow-400 min-w-0">
                  {{ formatNumber(getUpgradeNextLevelCost(gem.id, upgrade.id)) }}
                </div> -->
                <div v-if="getCurrentUpgradeLevel(gem.id, upgrade.id) > 0" class="mt-1 text-xs text-green-400 font-mono">
                  {{ formatMultiplierWithType(gem.id, upgrade.id, getCurrentMultiplier(gem.id, upgrade.id)) }}
                </div>
              </div>
              
              <!-- Multiplier Display -->
              <!-- <div v-if="getCurrentUpgradeLevel(gem.id, upgrade.id) > 0" class="mt-1 text-xs text-green-400 font-mono">
                {{ formatMultiplierWithType(gem.id, upgrade.id, getCurrentMultiplier(gem.id, upgrade.id)) }}
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>

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

    <!-- Orb Spending Plans Modal (only when not embedded) -->
    <OrbSpendingPlansModal
      v-if="!isEmbeddedMode"
      :is-visible="showOrbSpendingPlansModal"
      @close="closeOrbSpendingPlansModal"
      @plan-loaded="onOrbSpendingPlanLoaded"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Decimal from 'break_infinity.js';
import { 
  IconSettings, 
  IconFileImport,
  IconDownload,
  IconRefresh,
  IconScale,
  IconUser,
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconAlertCircle,
  IconTool,
  IconRobot,
  IconTrash,
  IconDiamond,
  IconPlayerPlay,
  IconPlus
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import GameStatsModal from '@/components/common/gem-planner/GameStatsModal.vue';
import WeightsModal from '@/components/common/gem-planner/WeightsModal.vue';
import OrbSpendingPlansModal from '@/components/common/gem-planner/OrbSpendingPlansModal.vue';
import { GEMS, GEM_LIST } from '@/constants/gem-planner';
import { getDefaultStatsValues } from '@/constants/gem-planner/stats.js';
import { formatNumber, formatNumberDecimal } from '@/composables/format.js';
import { useGemPlannerStore } from '@/store/gemPlannerStore.js';

// Initialize store
const gemPlannerStore = useGemPlannerStore();
const router = useRouter();
const route = useRoute();

// State
const showStatsModal = ref(false);
const showWeightsModal = ref(false);
const showOrbSpendingPlansModal = ref(false);

// Mode and TR Navigation State
const currentMode = ref('current'); // 'current' or 'orbs'
const spendingMode = ref('manual'); // 'manual' or 'auto'
const activeTRPlan = ref(null);
const activeOrbSpendingPlan = ref(null); // Current orb spending plan
const currentTRIndex = ref(0);

// Manual Spending State - Track orb spending per TR
const orbSpending = ref({}); // { trIndex: { gemId: { upgradeId: spentOrbs } } }

// Toast notification
const toast = ref({ show: false, message: '', type: 'info' });

// Computed
const gemList = computed(() => GEM_LIST);

// Check if we're in embedded mode (orb mode with no active plan)
const isEmbeddedMode = computed(() => {
  return currentMode.value === 'orbs' && !activeOrbSpendingPlan.value && !activeTRPlan.value;
});

// Store reactive references
const gameStats = computed(() => gemPlannerStore.gameStats);
const weights = computed(() => gemPlannerStore.weights);
const gemStates = computed(() => gemPlannerStore.gemStates);
const currentStats = computed(() => gemPlannerStore.currentStats);

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
  const currentLevel = getCurrentGemLevel(gemId);
  
  // In orb spending mode, check affordability and track spending for gem upgrades
  if (currentMode.value === 'orbs' && spendingMode.value === 'manual') {
    if (newLevel > currentLevel) {
      // Calculate total cost for gem level increases
      let totalCost = 0;
      
      for (let level = currentLevel + 1; level <= newLevel; level++) {
        const levelCost = getGemLevelCost(gemId, level);
        totalCost += levelCost;
      }
      
      // Check if affordable
      if (!canAffordUpgrade(totalCost)) {
        const shortfall = totalCost - remainingBudget.value;
        showToastMessage(`Not enough orbs! Need ${formatNumber(shortfall)} more orbs.`, 'error');
        return;
      }
      
      // Track spending (use special upgradeId for gem levels)
      trackOrbSpending(gemId, '_gem_level', totalCost);
      
      const gemName = GEMS[gemId]?.name || 'Unknown Gem';
      showToastMessage(`Spent ${formatNumber(totalCost)} orbs on ${gemName} level`, 'success');
    } else if (newLevel < currentLevel) {
      // Handle level reduction - refund orbs
      let refundAmount = 0;
      
      for (let level = newLevel + 1; level <= currentLevel; level++) {
        const levelCost = getGemLevelCost(gemId, level);
        refundAmount += levelCost;
      }
      
      // Refund orbs
      const trIndex = currentTRIndex.value;
      if (orbSpending.value[trIndex] && 
          orbSpending.value[trIndex][gemId] && 
          orbSpending.value[trIndex][gemId]['_gem_level']) {
        orbSpending.value[trIndex][gemId]['_gem_level'] = Math.max(0, 
          orbSpending.value[trIndex][gemId]['_gem_level'] - refundAmount);
      }
      
      const gemName = GEMS[gemId]?.name || 'Unknown Gem';
      showToastMessage(`Refunded ${formatNumber(refundAmount)} orbs from ${gemName} level`, 'info');
    }
  }
  
  // Update the level in store
  gemPlannerStore.updateGemLevel(gemId, newLevel);
  
  // Update base gem states (never reset) - only if level increases
  if (newLevel > currentLevel) {
    gemPlannerStore.updateBaseGemLevel(gemId, newLevel);
  }
  
  // Save TR step if in orb spending plan mode
  if (currentMode.value === 'orbs' && activeOrbSpendingPlan.value) {
    saveTRGemStates(currentTRIndex.value);
  }
}

// Helper function to get cost for a specific gem level
function getGemLevelCost(gemId, level) {
  const gem = GEMS[gemId];
  if (!gem) return 0;
  
  const qualityCost = gem.qualityCosts.find(cost => cost.level === level);
  return qualityCost?.cost || 0;
}

function toggleGemNode(gemId, nodeIndex) {
  const hasNode = hasGemNode(gemId, nodeIndex);
  
  // In orb spending mode, check affordability for purchasing nodes
  if (currentMode.value === 'orbs' && spendingMode.value === 'manual' && !hasNode) {
    const nodeCost = getGemNodeCost(gemId, nodeIndex);
    
    if (!canAffordUpgrade(nodeCost)) {
      const shortfall = nodeCost - remainingBudget.value;
      showToastMessage(`Not enough orbs! Need ${formatNumber(shortfall)} more orbs.`, 'error');
      return;
    }
    
    // Track spending (use special upgradeId for gem nodes)
    trackOrbSpending(gemId, `_gem_node_${nodeIndex}`, nodeCost);
    
    const gemName = GEMS[gemId]?.name || 'Unknown Gem';
    showToastMessage(`Spent ${formatNumber(nodeCost)} orbs on ${gemName} Node ${nodeIndex + 1}`, 'success');
  } else if (currentMode.value === 'orbs' && spendingMode.value === 'manual' && hasNode) {
    // Handle node removal - refund orbs
    const nodeCost = getGemNodeCost(gemId, nodeIndex);
    
    // Refund orbs
    const trIndex = currentTRIndex.value;
    if (orbSpending.value[trIndex] && 
        orbSpending.value[trIndex][gemId] && 
        orbSpending.value[trIndex][gemId][`_gem_node_${nodeIndex}`]) {
      orbSpending.value[trIndex][gemId][`_gem_node_${nodeIndex}`] = 0;
    }
    
    const gemName = GEMS[gemId]?.name || 'Unknown Gem';
    showToastMessage(`Refunded ${formatNumber(nodeCost)} orbs from ${gemName} Node ${nodeIndex + 1}`, 'info');
  }
  
  // Toggle the node in store
  gemPlannerStore.toggleGemNode(gemId, nodeIndex);
  
  // Update base gem states (never reset) - only when gaining nodes
  if (!hasNode) {
    gemPlannerStore.updateBaseGemNode(gemId, nodeIndex, true);
  }
  
  // Save TR step if in orb spending plan mode
  if (currentMode.value === 'orbs' && activeOrbSpendingPlan.value) {
    saveTRGemStates(currentTRIndex.value);
  }
}

// Helper function to get cost for a specific gem node
function getGemNodeCost(gemId, nodeIndex) {
  const gem = GEMS[gemId];
  if (!gem || !gem.gemNodes || !gem.gemNodes[nodeIndex]) return 0;
  
  return gem.gemNodes[nodeIndex].cost || 0;
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
  const cost = qualityCost?.cost || 0;
  
  return cost;
}

// Upgrade Functions
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
  const currentLevel = getCurrentUpgradeLevel(gemId, upgradeId);
  
  // In orb spending mode, check affordability and track spending
  if (currentMode.value === 'orbs' && spendingMode.value === 'manual') {
    if (newLevel > currentLevel) {
      // Calculate total cost for level increases
      let totalCost = 0;
      
      for (let level = currentLevel; level < newLevel; level++) {
        const levelCost = calculateUpgradeLevelCost(gemId, upgradeId, level);
        totalCost += levelCost;
      }
      
      // Check if affordable
      if (!canAffordUpgrade(totalCost)) {
        const shortfall = totalCost - remainingBudget.value;
        showToastMessage(`Not enough orbs! Need ${formatNumber(shortfall)} more orbs.`, 'error');
        return;
      }
      
      // Track spending
      trackOrbSpending(gemId, upgradeId, totalCost);
      
      showToastMessage(`Spent ${formatNumber(totalCost)} orbs on ${getUpgradeName(gemId, upgradeId)}`, 'success');
    } else if (newLevel < currentLevel) {
      // Handle level reduction - refund orbs
      let refundAmount = 0;
      
      for (let level = newLevel; level < currentLevel; level++) {
        const levelCost = calculateUpgradeLevelCost(gemId, upgradeId, level);
        refundAmount += levelCost;
      }
      
      // Refund orbs
      const trIndex = currentTRIndex.value;
      if (orbSpending.value[trIndex] && 
          orbSpending.value[trIndex][gemId] && 
          orbSpending.value[trIndex][gemId][upgradeId]) {
        orbSpending.value[trIndex][gemId][upgradeId] = Math.max(0, 
          orbSpending.value[trIndex][gemId][upgradeId] - refundAmount);
      }
      
      showToastMessage(`Refunded ${formatNumber(refundAmount)} orbs from ${getUpgradeName(gemId, upgradeId)}`, 'info');
    }
  }
  
  // Update the level in store
  gemPlannerStore.updateUpgradeLevel(gemId, upgradeId, newLevel);
  
  // Update base gem states (never reset) - only if level increases
  if (newLevel > currentLevel) {
    gemPlannerStore.updateBaseUpgradeLevel(gemId, upgradeId, newLevel);
  }
  
  // Save TR step if in orb spending plan mode
  if (currentMode.value === 'orbs' && activeOrbSpendingPlan.value) {
    saveTRGemStates(currentTRIndex.value);
  }
}

// Helper function to calculate cost for a specific level
function calculateUpgradeLevelCost(gemId, upgradeId, level) {
  const gem = GEMS[gemId];
  if (!gem) return 0;
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return 0;
  
  // Base cost calculation for this specific level
  let cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, level);
  
  // Apply cost bumps if defined
  if (upgrade.costBumps && upgrade.costBumps.length > 0) {
    upgrade.costBumps.forEach(bump => {
      if (level >= bump.startLevel) {
        cost *= Math.pow(bump.multiplier, level - bump.startLevel);
      }
    });
  }

  return cost;
}

// Helper function to get upgrade name
function getUpgradeName(gemId, upgradeId) {
  const gem = GEMS[gemId];
  if (!gem) return 'Unknown';
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  return upgrade ? upgrade.name : 'Unknown';
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
  const gem = GEMS[gemId];
  if (!gem) return new Decimal(1);
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return new Decimal(1);
  
  const currentLevel = getCurrentUpgradeLevel(gemId, upgradeId);
  const gemLevel = getCurrentGemLevel(gemId);
  
  if (currentLevel === 0) return new Decimal(1);
  
  try {
    // Call the calculate function - some functions expect gameStats, others don't
    let result;
    
    // Check if the function expects gameStats by looking at function signature
    const functionString = upgrade.multiplier.calculate.toString();
    const expectsGameStats = functionString.includes('gameStats') || functionString.includes('level, gemLevel,') || functionString.includes('level,gemLevel,');
    
    if (expectsGameStats) {
      result = upgrade.multiplier.calculate(currentLevel, gemLevel, gameStats.value);
    } else {
      result = upgrade.multiplier.calculate(currentLevel, gemLevel);
    }
    
    // Handle the result - it might be a Decimal object or need conversion
    if (result === null || result === undefined) {
      console.warn(`Null/undefined multiplier result for ${gemId}/${upgradeId}, using fallback`);
      return new Decimal(1);
    }
    
    // Convert to a working Decimal-like object with necessary methods
    let decimalResult;
    
    try {
      if (
        result != null
        && typeof result === 'object'
        && Object.prototype.hasOwnProperty.call(result, 'mantissa')
        && Object.prototype.hasOwnProperty.call(result, 'exponent')
      ) {
        // break_infinity.js is creating serialized objects - work around this
        decimalResult = result;
        
        // Add the missing methods manually since break_infinity.js is broken
        if (!decimalResult.isNaN) {
          decimalResult.isNaN = function() {
            return isNaN(this.mantissa) || isNaN(this.exponent);
          };
        }
        
        if (!decimalResult.isFinite) {
          decimalResult.isFinite = function() {
            return isFinite(this.mantissa) && isFinite(this.exponent);
          };
        }
        
        if (!decimalResult.lt) {
          decimalResult.lt = function(other) {
            if (typeof other === 'number') {
              const thisValue = this.mantissa * Math.pow(10, this.exponent);
              return thisValue < other;
            }
            if (other && typeof other === 'object' && other.mantissa !== undefined && other.exponent !== undefined) {
              if (this.exponent < other.exponent) return true;
              if (this.exponent > other.exponent) return false;
              return this.mantissa < other.mantissa;
            }
            return false;
          };
        }
        
        if (!decimalResult.gte) {
          decimalResult.gte = function(other) {
            return !this.lt(other);
          };
        }
        
        if (!decimalResult.toFixed) {
          decimalResult.toFixed = function(decimals = 0) {
            const value = this.mantissa * Math.pow(10, this.exponent);
            if (isFinite(value)) {
              return value.toFixed(decimals);
            }
            return 'Infinity';
          };
        }
        
        if (!decimalResult.floor) {
          decimalResult.floor = function() {
            const value = this.mantissa * Math.pow(10, this.exponent);
            const flooredValue = Math.floor(value);
            
            // Create a new object with the floored value
            if (flooredValue === 0) {
              return { mantissa: 0, exponent: 0, toString: function() { return '0'; } };
            }
            
            const exp = Math.floor(Math.log10(Math.abs(flooredValue)));
            const mantissa = flooredValue / Math.pow(10, exp);
            
            return { 
              mantissa: mantissa, 
              exponent: exp,
              toString: function() { return flooredValue.toString(); }
            };
          };
        }
        
        if (!decimalResult.toString) {
          decimalResult.toString = function() {
            if (this.mantissa === 0) return '0';
            const value = this.mantissa * Math.pow(10, this.exponent);
            if (isFinite(value) && Math.abs(value) < 1e15) {
              return value.toString();
            }
            return `${this.mantissa}e${this.exponent}`;
          };
        }
      } else {
        // Try to create a new Decimal, but it will probably also be broken
        decimalResult = new Decimal(result);
        
        // Add methods if they're missing
        if (!decimalResult.isNaN) {
          // Add the same methods as above...
          decimalResult.isNaN = function() {
            return isNaN(this.mantissa) || isNaN(this.exponent);
          };
          decimalResult.isFinite = function() {
            return isFinite(this.mantissa) && isFinite(this.exponent);
          };
          // Add other methods as needed...
        }
      }
    } catch (error) {
      console.warn(
        `Error converting result to Decimal for ${gemId}/${upgradeId}:`,
        error,
        'Original result:',
        result
      );
      return new Decimal(1);
    }

    // Final validation with our patched methods
    try {
      if (decimalResult.isNaN() || !decimalResult.isFinite()) {
        console.warn(
          `Invalid multiplier value for ${gemId}/${upgradeId}, using fallback. Result:`,
          decimalResult
        );
        return new Decimal(1);
      }
    } catch (validationError) {
      console.warn(`Error during validation for ${gemId}/${upgradeId}:`, validationError);
      return new Decimal(1);
    }
    
    return decimalResult;
  } catch (error) {
    console.warn(`Error calculating multiplier for ${gemId}/${upgradeId}:`, error);
    return new Decimal(1);
  }
}

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

// Orb Spending Plans Modal Functions
function openOrbSpendingPlansModal() {
  showOrbSpendingPlansModal.value = true;
}

function closeOrbSpendingPlansModal() {
  showOrbSpendingPlansModal.value = false;
}

function openCreateModal() {
  // Open the embedded modal's create functionality
  // We need to trigger the create modal in the OrbSpendingPlansModal
  const event = new CustomEvent('orbPlannerCreateNew', { detail: {} });
  document.dispatchEvent(event);
  
  console.log('Create new orb spending plan triggered');
}

function onOrbSpendingPlanLoaded(plan) {
  activeOrbSpendingPlan.value = plan;
  currentTRIndex.value = 0;
  currentMode.value = 'orbs';
  
  // Load the gem states for the first TR
  loadTRGemStates(0);
  
  showToastMessage(`Loaded orb spending plan: ${plan.name}`, 'success');
}

// Import/Export Functions
function importPlan() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (gemPlannerStore.importData(data)) {
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

function exportPlan() {
  try {
    const data = gemPlannerStore.exportData();
    const dataStr = JSON.stringify(data, null, 2);
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

function resetPlanner() {
  if (confirm('Are you sure you want to reset all gem data? This cannot be undone.')) {
    gemPlannerStore.resetToDefaults();
    initializeGemStates();
    showToastMessage('Planner reset successfully', 'info');
  }
}

// Utility Functions
function formatMultiplier(multiplier) {
  // Handle our custom Decimal-like objects (with mantissa/exponent)
  if (multiplier && typeof multiplier === 'object' && 
      multiplier.mantissa !== undefined && multiplier.exponent !== undefined) {
    const value = multiplier.mantissa * Math.pow(10, multiplier.exponent);
    if (value < 10) return 'x' + value.toFixed(2);
    if (value < 1000) return 'x' + value.toFixed(1);
    return 'x' + formatNumberDecimal(multiplier);
  }
  
  // Handle Decimal instances
  if (multiplier instanceof Decimal) {
    if (multiplier.lt && multiplier.lt(10)) return 'x' + multiplier.toFixed(2);
    if (multiplier.lt && multiplier.lt(1000)) return 'x' + multiplier.toFixed(1);
    if (multiplier.gte && multiplier.gte(1000)) {
      return 'x' + formatNumberDecimal(multiplier);
    }
    return 'x' + formatNumberDecimal(multiplier);
  }
  
  // Handle regular numbers (fallback)
  if (typeof multiplier === 'number') {
    if (multiplier < 10) return 'x' + multiplier.toFixed(2);
    if (multiplier < 1000) return 'x' + multiplier.toFixed(1);
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
    // For additive types, show + instead of x
    
    // Handle our custom Decimal-like objects (with mantissa/exponent)
    if (multiplier && typeof multiplier === 'object' && 
        multiplier.mantissa !== undefined && multiplier.exponent !== undefined) {
      const value = multiplier.mantissa * Math.pow(10, multiplier.exponent);
      if (value < 1000) {
        // Under 1000: show as whole number without decimals
        return '+' + Math.floor(value).toString();
      } else {
        // 1000 and above: use formatNumberDecimal for suffix notation
        return '+' + formatNumberDecimal(multiplier);
      }
    }
    
    // Handle Decimal instances
    if (multiplier instanceof Decimal) {
      if (multiplier.lt && multiplier.lt(1000)) {
        // Under 1000: show as whole number without decimals
        return '+' + (multiplier.floor ? multiplier.floor().toString() : Math.floor(multiplier).toString());
      } else {
        // 1000 and above: use formatNumberDecimal for suffix notation
        return '+' + formatNumberDecimal(multiplier);
      }
    }
    
    // Handle regular numbers (fallback)
    if (typeof multiplier === 'number') {
      if (multiplier < 1000) {
        // Under 1000: show as whole number without decimals
        return '+' + Math.floor(multiplier).toString();
      } else {
        // 1000 and above: use formatNumber which handles suffixes with decimals
        return '+' + formatNumber(multiplier);
      }
    }
  }
  
  // Default to multiplicative formatting
  return formatMultiplier(multiplier);
}

function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Mode Management Functions
function setMode(mode) {
  currentMode.value = mode;
  
  if (mode === 'current') {
    // Clear TR plan context when switching back to current mode
    activeTRPlan.value = null;
    currentTRIndex.value = 0;
  }
}

function setSpendingMode(mode) {
  spendingMode.value = mode;
  showToastMessage(`Switched to ${mode} spending mode`, 'info');
}

function exitOrbMode() {
  // Check if we came from TR Planner (have activeTRPlan)
  if (activeTRPlan.value) {
    // Navigate back to TR Planner using router
    router.push('/tools/tr-planner');
  } else {
    // We came from Gem Planner directly, just switch to current mode
    setMode('current');
  }
}

function handleOrbModalClose() {
  // This is called when the embedded orb plans modal wants to close
  // In embedded mode, this usually means we should exit orb mode
  console.log('Orb modal close requested');
  
  // Don't automatically exit - let the user stay in the orb mode
  // They can use the mode toggle to switch back
}

function exitOrbSpendingPlan() {
  // Save current state before exiting
  if (activeOrbSpendingPlan.value) {
    saveTRGemStates(currentTRIndex.value);
  }
  
  // Clear orb spending plan
  activeOrbSpendingPlan.value = null;
  currentTRIndex.value = 0;
  
  // Stay in orb mode but show plan overview
  showToastMessage('Returned to plan overview', 'info');
}

// TR Navigation Functions
function previousTR() {
  if (currentTRIndex.value > 0) {
    // Save current TR state before switching
    if (activeOrbSpendingPlan.value) {
      saveTRGemStates(currentTRIndex.value);
    }
    
    currentTRIndex.value--;
    showToastMessage(`Switched to TR ${currentTRIndex.value + 1}`, 'info');
    
    // Load gem states for the new TR
    if (activeOrbSpendingPlan.value) {
      loadTRGemStates(currentTRIndex.value);
    }
  }
}

function nextTR() {
  const maxTRIndex = activeOrbSpendingPlan.value ? 
    activeOrbSpendingPlan.value.trCount - 1 : 
    totalTRsInPlan.value - 1;
    
  if (currentTRIndex.value < maxTRIndex) {
    // Save current TR state before switching
    if (activeOrbSpendingPlan.value) {
      saveTRGemStates(currentTRIndex.value);
    }
    
    currentTRIndex.value++;
    showToastMessage(`Switched to TR ${currentTRIndex.value + 1}`, 'info');
    
    // Load gem states for the new TR (accumulating stats)
    if (activeOrbSpendingPlan.value) {
      loadTRGemStates(currentTRIndex.value);
    } else if (spendingMode.value === 'manual') {
      resetGemStatesForTR();
    }
  }
}

// Load gem states for a specific TR (accumulating with previous TRs)
function loadTRGemStates(trIndex) {
  if (!activeOrbSpendingPlan.value) return;
  
  // Start with base stats (accumulated from all previous planning)
  const baseStates = gemPlannerStore.baseGemStates;
  
  // Reset current gem states to base level
  GEM_LIST.forEach(gem => {
    const baseState = baseStates[gem.id] || { level: 0, upgrades: {}, nodes: {} };
    
    // Set gem level to base level (never goes below base)
    gemPlannerStore.updateGemLevel(gem.id, baseState.level || 0);
    
    // Set base upgrade levels
    gem.upgrades.forEach(upgrade => {
      const baseLevel = baseState.upgrades[upgrade.id] || 0;
      gemPlannerStore.updateUpgradeLevel(gem.id, upgrade.id, baseLevel);
    });
    
    // Set base gem nodes
    if (gem.gemNodes) {
      gem.gemNodes.forEach((_, nodeIndex) => {
        const hasBaseNode = baseState.nodes[nodeIndex] || false;
        const currentlyHas = hasGemNode(gem.id, nodeIndex);
        
        if (hasBaseNode && !currentlyHas) {
          gemPlannerStore.toggleGemNode(gem.id, nodeIndex);
        } else if (!hasBaseNode && currentlyHas) {
          gemPlannerStore.toggleGemNode(gem.id, nodeIndex);
        }
      });
    }
  });
  
  // Then accumulate all upgrades from previous TR steps in this plan
  for (let i = 0; i <= trIndex; i++) {
    const trStep = activeOrbSpendingPlan.value.trSteps[i];
    if (trStep && trStep.gemStates) {
      // Apply gem states from this TR step
      Object.entries(trStep.gemStates).forEach(([gemId, gemState]) => {
        if (!gemState) return;
        
        // Apply gem level (only if higher than current)
        if (gemState.level > getCurrentGemLevel(gemId)) {
          gemPlannerStore.updateGemLevel(gemId, gemState.level);
        }
        
        // Apply upgrade levels (only if higher than current)
        if (gemState.upgrades) {
          Object.entries(gemState.upgrades).forEach(([upgradeId, level]) => {
            if (level > getCurrentUpgradeLevel(gemId, upgradeId)) {
              gemPlannerStore.updateUpgradeLevel(gemId, upgradeId, level);
            }
          });
        }
        
        // Apply gem nodes (can only gain, never lose)
        if (gemState.nodes) {
          Object.entries(gemState.nodes).forEach(([nodeIndex, hasNode]) => {
            if (hasNode && !hasGemNode(gemId, parseInt(nodeIndex))) {
              gemPlannerStore.toggleGemNode(gemId, parseInt(nodeIndex));
            }
          });
        }
      });
    }
  }
  
  showToastMessage('Loaded accumulated gem states', 'info');
}

// Save current gem states to the TR step
function saveTRGemStates(trIndex) {
  if (!activeOrbSpendingPlan.value || !activeOrbSpendingPlan.value.trSteps[trIndex]) return;
  
  const currentGemStates = {};
  
  GEM_LIST.forEach(gem => {
    const gemState = gemPlannerStore.getGemState(gem.id);
    if (gemState) {
      currentGemStates[gem.id] = {
        level: gemState.level || 0,
        upgrades: { ...gemState.upgrades },
        nodes: { ...gemState.nodes }
      };
    }
  });
  
  // Update the TR step in the orb spending plan
  gemPlannerStore.updateOrbSpendingPlanTRStep(
    activeOrbSpendingPlan.value.id,
    trIndex,
    {
      gemStates: currentGemStates,
      orbSpending: orbSpending.value[trIndex] || {},
      spentOrbs: calculateSpentOrbsForTR(trIndex)
    }
  );
}

// Reset gem states for new TR (only used for non-orb-spending mode)
function resetGemStatesForTR() {
  // This function is only used when NOT in orb spending plan mode
  // In orb spending plan mode, we use loadTRGemStates instead
  if (activeOrbSpendingPlan.value) {
    loadTRGemStates(currentTRIndex.value);
    return;
  }
  
  // Reset all gems to level 0 and clear all upgrades for fresh planning
  // This is only for TR planner integration without orb spending plans
  GEM_LIST.forEach(gem => {
    gemPlannerStore.updateGemLevel(gem.id, 0);
    
    // Clear all gem nodes
    if (gem.gemNodes) {
      gem.gemNodes.forEach((_, index) => {
        const hasNode = hasGemNode(gem.id, index);
        if (hasNode) {
          gemPlannerStore.toggleGemNode(gem.id, index);
        }
      });
    }
    
    // Reset all upgrades to level 0
    gem.upgrades.forEach(upgrade => {
      gemPlannerStore.updateUpgradeLevel(gem.id, upgrade.id, 0);
    });
  });
  
  showToastMessage('Reset gem states for new TR planning', 'info');
}

// Clear spending for current TR
function clearCurrentTRSpending() {
  const trIndex = currentTRIndex.value;
  const spentAmount = calculateSpentOrbsForTR(trIndex);
  
  if (spentAmount === 0) return;
  
  // Clear spending tracking
  if (orbSpending.value[trIndex]) {
    delete orbSpending.value[trIndex];
  }
  
  // Reset gem states to accumulated base level (not to 0!)
  if (activeOrbSpendingPlan.value) {
    loadTRGemStates(trIndex);
  } else {
    resetGemStatesForTR();
  }
  
  showToastMessage(`Cleared ${formatNumber(spentAmount)} orbs of spending for TR ${trIndex + 1}`, 'success');
}

// TR Plan Computed Properties
const totalTRsInPlan = computed(() => {
  if (!activeTRPlan.value) return 0;
  
  let count = 1; // Base TR
  if (activeTRPlan.value.trChain && Array.isArray(activeTRPlan.value.trChain)) {
    count += activeTRPlan.value.trChain.filter(step => step && typeof step === 'object').length;
  }
  
  return count;
});

const currentTROrbGains = computed(() => {
  if (!activeTRPlan.value) return 0;
  
  if (currentTRIndex.value === 0) {
    // First TR (base TR)
    return activeTRPlan.value.results?.orbGains || 0;
  } else {
    // TR from chain
    const chainIndex = currentTRIndex.value - 1;
    const trChain = activeTRPlan.value.trChain;
    
    if (trChain && trChain[chainIndex] && trChain[chainIndex].results) {
      return trChain[chainIndex].results.orbGains || 0;
    }
  }
  
  return 0;
});

const availableBudget = computed(() => {
  // In orb mode with orb spending plan, budget comes from plan
  if (currentMode.value === 'orbs' && activeOrbSpendingPlan.value) {
    return activeOrbSpendingPlan.value.initialBudget;
  }
  
  // In orb mode with TR plan, budget comes from current TR's orb gains
  if (currentMode.value === 'orbs' && activeTRPlan.value) {
    return currentTROrbGains.value;
  }
  
  // In current mode, unlimited budget
  return Infinity;
});

const orbSpendingPlanCurrentBudget = computed(() => {
  if (!activeOrbSpendingPlan.value) return 0;
  return activeOrbSpendingPlan.value.initialBudget;
});

const remainingBudget = computed(() => {
  if (currentMode.value === 'current') return Infinity;
  
  // Calculate spent orbs for current TR
  const spentOrbs = calculateSpentOrbsForTR(currentTRIndex.value);
  const remaining = availableBudget.value - spentOrbs;
  
  return Math.max(0, remaining);
});

const budgetUsagePercentage = computed(() => {
  if (currentMode.value === 'current' || availableBudget.value === 0) return 0;
  
  const spentOrbs = calculateSpentOrbsForTR(currentTRIndex.value);
  return Math.round((spentOrbs / availableBudget.value) * 100);
});

// Calculate spent orbs for a specific TR
function calculateSpentOrbsForTR(trIndex) {
  if (!orbSpending.value[trIndex]) return 0;
  
  let total = 0;
  const trSpending = orbSpending.value[trIndex];
  
  // Sum all spending across all gems and upgrades for this TR
  Object.values(trSpending).forEach(gemSpending => {
    Object.values(gemSpending).forEach(upgradeSpent => {
      total += upgradeSpent;
    });
  });
  
  return total;
}

// Track orb spending for upgrades
function trackOrbSpending(gemId, upgradeId, cost) {
  if (currentMode.value !== 'orbs') return;
  
  const trIndex = currentTRIndex.value;
  
  // Initialize nested structure if needed
  if (!orbSpending.value[trIndex]) {
    orbSpending.value[trIndex] = {};
  }
  if (!orbSpending.value[trIndex][gemId]) {
    orbSpending.value[trIndex][gemId] = {};
  }
  
  // Add to spending
  if (!orbSpending.value[trIndex][gemId][upgradeId]) {
    orbSpending.value[trIndex][gemId][upgradeId] = 0;
  }
  
  orbSpending.value[trIndex][gemId][upgradeId] += cost;
}

// Check if user can afford an upgrade
function canAffordUpgrade(cost) {
  if (currentMode.value === 'current') return true;
  return remainingBudget.value >= cost;
}

// URL Parameter Handling
function handleURLParameters() {
  // Check for TR Plan data in store instead of URL parameters
  const storedTRPlan = gemPlannerStore.getActiveTRPlan();
  
  if (storedTRPlan) {
    const { plan, trIndex } = storedTRPlan;
    
    console.log('Loading TR Plan from store:', plan.name, 'TR Index:', trIndex);
    
    activeTRPlan.value = plan;
    currentTRIndex.value = trIndex;
    currentMode.value = 'orbs';
    
    // Clear the stored data after using it
    gemPlannerStore.clearActiveTRPlan();
    
    showToastMessage(`Loaded TR plan: ${plan.name}`, 'success');
    return;
  }

  // Fallback: Check for URL parameters (for backward compatibility)
  const trPlanId = route.query.trPlan;
  const trIndex = parseInt(route.query.trIndex) || 0;
  
  if (trPlanId) {
    // Import TR Planner store to get plan data
    import('@/store/orbStore').then(({ useTRPlannerStore }) => {
      const trPlannerStore = useTRPlannerStore();
      const plan = trPlannerStore.getTRPlanById(trPlanId);
      
      if (plan) {
        activeTRPlan.value = plan;
        currentTRIndex.value = trIndex;
        currentMode.value = 'orbs';
        
        showToastMessage(`Loaded TR plan: ${plan.name}`, 'success');
      } else {
        showToastMessage('TR plan not found', 'error');
        setMode('current');
      }
    }).catch(error => {
      console.error('Error loading TR plan:', error);
      showToastMessage('Error loading TR plan', 'error');
      setMode('current');
    });
  }
}

// Storage Functions - Remove these as they're now handled by the store
// function saveToLocalStorage() { ... }
// function loadFromLocalStorage() { ... }

// Lifecycle
onMounted(() => {
  gemPlannerStore.init();
  initializeGemStates();
  
  // Handle URL parameters for TR plan integration
  handleURLParameters();
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
