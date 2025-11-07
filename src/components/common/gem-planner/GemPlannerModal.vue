<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-start justify-center p-4"
    @click="handleModalClick"
  >
    <div 
      ref="modalContent"
      class="bg-gray-800 rounded-xl shadow-2xl w-[95%] min-h-fit animate-fade-in border border-gray-700"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold text-white flex items-center">
            <IconDiamond size="16" class="mr-2 text-purple-400" />
            {{ props.editPlan ? 'Edit Gem Plan' : 'Gem Investment Planner' }}
          </h3>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="savePlan"
            class="flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors text-sm bg-green-600 text-white hover:bg-green-700"
          >
            <IconDeviceFloppy size="14" />
            <span>Save Plan</span>
          </button>
          <button
            @click="$emit('close')"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="16" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3">
        <!-- Plan Settings Section -->
        <div>
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-indigo-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-indigo-200">Plan Settings</h4>
          </div>
          
          <div class="bg-gray-700/30 rounded-md p-3">
            <!-- Plan Name and Efficiency Scaling in one row -->
            <div class="flex items-end gap-4">
              <!-- Plan Name Input -->
              <div class="flex-shrink-0">
                <label class="block text-xs text-gray-400 mb-1">Plan Name</label>
                <input
                  v-model="activePlan.name"
                  class="w-64 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 placeholder-purple-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  placeholder="Enter plan name..."
                />
              </div>
              
              <!-- Efficiency Scaling -->
              <div class="flex-shrink-0">
                <div class="flex items-center gap-2 mb-1">
                  <label class="block text-xs text-gray-400">Efficiency Scaling</label>
                  <InfoTooltip 
                    content="Controls the efficiency calculation scale. Increase this value if efficiency numbers become too small (showing 0.00). Formula: Value / Cost × 10^(this value). Default: 10 (= 1e10)" 
                    placement="top"
                  />
                </div>
                <div class="w-32">
                  <ToolValueControls
                    :value="efficiencyScaling"
                    @update:value="efficiencyScaling = $event"
                    :min-value="0"
                    :max-value="99"
                    :show-fast-controls="false"
                    :autoEdit="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TR Navigator Section -->
        <div>
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-purple-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-purple-200">{{ activePlan.name }} - Orb Spending</h4>
          </div>
          
          <div class="bg-gray-700/30 rounded-md p-3 space-y-3">
            <!-- TR Navigation -->
            <div class="flex items-center justify-between">
              <!-- Previous TR Button -->
              <button
                @click="previousTR"
                :disabled="currentTRIndex <= 0"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium border disabled:opacity-40 disabled:cursor-not-allowed"
                :class="currentTRIndex <= 0 
                  ? 'text-gray-500 bg-gray-700/30 border-gray-600/50' 
                  : 'text-purple-300 bg-purple-900/20 border-purple-500/30 hover:bg-purple-800/30 hover:border-purple-400/50 hover:text-purple-200'"
              >
                <IconChevronLeft size="16" />
                <span>Previous</span>
              </button>
              
              <!-- Center: TR Info, Delete Button and Budget -->
              <div class="flex items-center space-x-4">
                <!-- Delete TR Button and TR Display -->
                <div class="flex items-center space-x-2">
                  <!-- Delete TR Button - only show for last TR and not TR1 -->
                  <button
                    v-if="currentTRIndex === maxTRReached - 1 && currentTRIndex > 0"
                    @click="deleteTR"
                    class="flex items-center justify-center p-2 rounded-lg transition-all text-xs font-medium border text-red-300 bg-red-900/20 border-red-500/30 hover:bg-red-800/30 hover:border-red-400/50 hover:text-red-200"
                    title="Delete current TR"
                  >
                    <IconTrash size="14" />
                  </button>
                  
                  <!-- TR Display -->
                  <div class="text-center">
                    <div class="text-lg font-bold text-white font-mono">
                      TR {{ currentTRIndex + 1 }} / {{ maxTRReached }}
                    </div>
                    <div class="text-xs text-gray-400">
                      {{ currentTRIndex === 0 ? 'Base TR' : `Reset ${currentTRIndex}` }}
                    </div>
                  </div>
                </div>
                
                <!-- Budget Input -->
                <div class="flex flex-col items-center">
                  <label class="block text-xs text-gray-400 mb-1">Budget</label>
                  <SuffixInput
                    v-model="currentTRBudget"
                    class="w-28 text-center"
                    placeholder="100K"
                  />
                </div>
              </div>
              
              <!-- Next TR Button -->
              <button
                @click="nextTR"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium border text-blue-300 bg-blue-900/20 border-blue-500/30 hover:bg-blue-800/30 hover:border-blue-400/50 hover:text-blue-200"
              >
                <span>Next</span>
                <IconChevronRight size="16" />
              </button>
            </div>

            <!-- Budget Display -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-gray-700/30 rounded-md p-2">
                <div class="text-xs text-gray-400 mb-1">Available Budget</div>
                <div class="text-sm font-semibold text-purple-300 flex items-center">
                  <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
                  {{ formatNumber(currentTRBudget) }}
                </div>
              </div>
              <div class="bg-gray-700/30 rounded-md p-2">
                <div class="text-xs text-gray-400 mb-1">Spent</div>
                <div class="text-sm font-semibold text-red-300 flex items-center">
                  <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
                  {{ formatNumber(spentBudget) }}
                </div>
              </div>
              <div class="bg-gray-700/30 rounded-md p-2">
                <div class="text-xs text-gray-400 mb-1">Remaining</div>
                <div class="text-sm font-semibold text-green-300 flex items-center">
                  <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
                  {{ formatNumber(remainingBudget) }}
                </div>
              </div>
            </div>
            
            <!-- Budget Progress Bar -->
            <div>
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

            <!-- Spending Mode Toggle -->
            <div class="flex items-center justify-center gap-2">
              <button
                @click="setSpendingMode('manual')"
                :class="[
                  'flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors text-xs',
                  spendingMode === 'manual' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-600/50 text-gray-300 hover:bg-gray-500/50'
                ]"
              >
                <IconTool size="14" />
                <span>Manual</span>
              </button>
              
              <button
                @click="setSpendingMode('auto')"
                :class="[
                  'flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors text-xs',
                  spendingMode === 'auto' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600/50 text-gray-300 hover:bg-gray-500/50'
                ]"
              >
                <IconRobot size="14" />
                <span>Auto</span>
              </button>
              
              <!-- Auto-Optimize Button -->
              <button
                v-if="spendingMode === 'auto'"
                @click="runAutoOptimizer"
                :disabled="isOptimizing || remainingBudget <= 0"
                class="flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors text-xs bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div v-if="isOptimizing" class="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <IconRobot v-else size="14" />
                <span>{{ isOptimizing ? 'Optimizing...' : 'Optimize' }}</span>
              </button>
              
              <!-- Reset Button -->
              <button
                v-if="spendingMode === 'auto'"
                @click="resetToMinimumLevels"
                :disabled="isOptimizing"
                class="flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors text-xs bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30 disabled:opacity-50"
              >
                <IconTrash size="14" />
                <span>Reset</span>
              </button>
              
              <!-- Clear Spending Button -->
              <button
                v-if="spendingMode === 'manual' && spentBudget > 0"
                @click="clearCurrentTRSpending"
                class="flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors text-xs bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30"
              >
                <IconTrash size="14" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Optimization Progress -->
        <div v-if="isOptimizing && optimizationProgress" class="bg-gray-700/50 border border-gray-600 rounded-lg p-3 mb-3">
          <div class="flex items-center mb-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
            <h4 class="font-medium text-sm text-purple-200">Auto-Optimizing...</h4>
          </div>
          <div class="text-xs text-gray-300 space-y-1">
            <div>Iteration: {{ optimizationProgress.iteration }}</div>
            <div>Purchases: {{ optimizationProgress.purchasesMade }}</div>
            <div>Spent: {{ formatNumber(optimizationProgress.totalSpent) }} OO</div>
            <div>Remaining: {{ formatNumber(optimizationProgress.remainingOrbs) }} OO</div>
          </div>
        </div>

        <!-- Optimization Results -->
        <div v-if="optimizationResults && optimizationResults.success" class="bg-green-900/20 border border-green-600/30 rounded-lg p-3 mb-3">
          <div class="flex items-center mb-2">
            <IconRobot size="16" class="text-green-400 mr-2" />
            <h4 class="font-medium text-sm text-green-200">Optimization Complete!</h4>
          </div>
          <div class="text-xs text-gray-300 grid grid-cols-2 gap-x-4 gap-y-1">
            <div>Purchases: {{ optimizationResults.results.length }}</div>
            <div>Iterations: {{ optimizationResults.iterations }}</div>
            <div>Spent: {{ formatNumber(optimizationResults.totalSpent) }} OO</div>
            <div>Remaining: {{ formatNumber(optimizationResults.remainingOrbs) }} OO</div>
          </div>
        </div>

        <!-- Optimization Error -->
        <div v-if="optimizationResults && !optimizationResults.success" class="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mb-3">
          <div class="flex items-center mb-2">
            <IconX size="16" class="text-red-400 mr-2" />
            <h4 class="font-medium text-sm text-red-200">Optimization Failed</h4>
          </div>
          <div class="text-xs text-gray-300">{{ optimizationResults.error }}</div>
        </div>

        <!-- Gem Cards Grid -->
        <div>
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-blue-200">Gem Investments</h4>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
            <div
              v-for="gem in gemList"
              :key="gem.id"
              class="bg-gray-700/30 border border-gray-700/50 rounded-xl hover:border-purple-500/50 transition-all duration-300 ease-in-out"
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
                      {{ getPlanGemLevel(gem.id) }}/{{ gem.maxLevel }}
                    </span>
                  </div>
                </div>
                
                <!-- Level & Cost in single row -->
                <div class="flex items-center gap-2">
                  <div class="flex-1">
                    <ToolValueControls
                      :value="getPlanGemLevel(gem.id)"
                      :min-value="getMinimumGemLevel(gem.id)"
                      :max-value="gem.maxLevel"
                      @update:value="updatePlanGemLevel(gem.id, $event)"
                      :show-fast-controls="false"
                      :autoEdit="true"
                    />
                  </div>
                  <div v-if="getPlanGemLevel(gem.id) < gem.maxLevel" class="text-xs font-mono text-yellow-400 min-w-0">
                    {{ formatNumber(getPlanNextLevelCost(gem.id)) }}
                  </div>
                </div>
                
                <!-- Gem Level Efficiency -->
                <div v-if="getPlanGemLevel(gem.id) < gem.maxLevel && props.weights" class="mt-1">
                  <div class="text-xs text-purple-400 font-mono">
                    Eff: {{ formatEfficiency(getPlanGemLevelEfficiency(gem.id)) }}
                  </div>
                </div>
                
                <!-- Purchased Levels Display -->
                <div v-if="getPurchasedGemLevels(gem.id) > 0" class="mt-1 pt-1 border-t border-gray-500/30">
                  <div class="text-xs text-cyan-400 font-mono">
                    +{{ getPurchasedGemLevels(gem.id) }} purchased
                  </div>
                </div>
                
                <!-- Gem Nodes - Only show available nodes based on Exodus level -->
                <div 
                  v-if="getAvailablePlanGemNodes(gem.id).length > 0" 
                  class="flex gap-1 mt-2"
                >
                  <div
                    v-for="(node, index) in getAvailablePlanGemNodes(gem.id)"
                    :key="index"
                    class="flex-1 relative"
                  >
                    <button
                      @click="togglePlanGemNode(gem.id, gem.gemNodes.indexOf(node))"
                      class="w-full py-1 text-xs rounded transition-all duration-200 ease-in-out font-mono border hover:scale-105 relative"
                      :class="[
                        hasPlanGemNode(gem.id, gem.gemNodes.indexOf(node))
                          ? [
                              'text-white shadow-lg',
                              isGemNodePurchasedInPlan(gem.id, gem.gemNodes.indexOf(node)) 
                                ? 'border-cyan-400 ring-1 ring-cyan-400/50' 
                                : 'border-gray-500'
                            ]
                          : 'bg-gray-600/60 text-gray-300 hover:bg-gray-500/60 border-gray-500',
                        isNodeNewlyAppeared(gem.id, gem.gemNodes.indexOf(node)) ? 'gem-node-pulse' : ''
                      ]"
                      :style="hasPlanGemNode(gem.id, gem.gemNodes.indexOf(node)) ? { background: gem.color.gradient } : {}"
                    >
                      {{ gem.gemNodes.indexOf(node) + 1 }}
                      <!-- Small indicator for purchased nodes -->
                      <div 
                        v-if="isGemNodePurchasedInPlan(gem.id, gem.gemNodes.indexOf(node))"
                        class="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full border border-gray-800"
                      ></div>
                    </button>
                    <!-- InfoTooltip only for nodes that weren't initially purchased -->
                    <div 
                      v-if="!getMinimumGemNodes(gem.id).includes(gem.gemNodes.indexOf(node))"
                      class="absolute bottom-0 right-0 z-20 transform translate-x-1 translate-y-1"
                    >
                      <InfoTooltip 
                        :content="`${node.cost === null ? 'Cost: FREE' : 'Cost: ' + formatNumber(node.cost)}${isGemNodePurchasedInPlan(gem.id, gem.gemNodes.indexOf(node)) ? '<br><span class=&quot;text-cyan-400&quot;>Purchased in plan</span>' : ''}`"
                        placement="top"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Upgrades -->
              <div class="p-2 space-y-1">
                <div
                  v-for="upgrade in getPlanAvailableUpgrades(gem.id)"
                  :key="upgrade.id"
                  class="rounded-sm p-2 hover:bg-gray-600/40 transition-colors border-l-3 border border-transparent"
                  :class="getPurchasedLevels(gem.id, upgrade.id) > 0 
                    ? 'bg-cyan-800/60 shadow-sm shadow-cyan-500/20' 
                    : 'bg-gray-700/40'"
                  :style="{ borderLeftColor: upgrade.color }"
                >
                  <!-- Upgrade Header -->
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-1 min-w-0">
                      <span class="text-xs font-medium text-white truncate">{{ upgrade.name }}</span>
                      <span v-if="getPurchasedLevels(gem.id, upgrade.id) > 0" class="text-xs text-cyan-400 font-mono">
                        (+{{ getPurchasedLevels(gem.id, upgrade.id) }})
                      </span>
                    </div>
                    <span class="text-xs bg-gray-600/80 text-gray-300 px-1.5 rounded-full font-mono">
                      {{ upgrade.maxLevel }}
                    </span>
                  </div>
                  
                  <!-- Controls & Info -->
                  <div class="flex items-center gap-2">
                    <div class="flex-1">
                      <ToolValueControls
                        :value="getPlanUpgradeLevel(gem.id, upgrade.id)"
                        :min-value="getMinimumUpgradeLevel(gem.id, upgrade.id)"
                        :max-value="upgrade.maxLevel"
                        @update:value="updatePlanUpgradeLevel(gem.id, upgrade.id, $event)"
                        :show-fast-controls="false"
                        :autoEdit="true"
                      />
                    </div>
                    <div class="flex flex-col items-end gap-0.5">
                      <div v-if="getPlanUpgradeLevel(gem.id, upgrade.id) < upgrade.maxLevel" class="text-xs font-mono text-yellow-400">
                        {{ formatNumber(getPlanUpgradeNextLevelCost(gem.id, upgrade.id)) }}
                      </div>
                      <div v-if="getPlanUpgradeLevel(gem.id, upgrade.id) > 0" class="text-xs text-green-400 font-mono">
                        {{ formatPlanMultiplierWithType(gem.id, upgrade.id, getPlanCurrentMultiplier(gem.id, upgrade.id)) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Value & Efficiency Display -->
                  <div v-if="getPlanUpgradeLevel(gem.id, upgrade.id) < upgrade.maxLevel && calculateUpgradeEfficiencyLocal(gem.id, upgrade.id).value !== 0" class="mt-1 pt-1 border-t border-gray-500/30">
                    <div class="flex justify-between text-xs font-mono">
                      <div class="text-blue-400">
                        Val: {{ formatValue(calculateUpgradeEfficiencyLocal(gem.id, upgrade.id).value) }}
                      </div>
                      <div class="text-purple-400">
                        Eff: {{ formatEfficiency(calculateUpgradeEfficiencyLocal(gem.id, upgrade.id).efficiency) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Dialog - Inside modal content to prevent modal closing -->
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  IconX, 
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconTool,
  IconRobot,
  IconTrash,
  IconDiamond,
  IconDeviceFloppy
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import SuffixInput from '@/composables/SuffixInput.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import AlertDialog from '@/components/common/AlertDialog.vue';
import { formatNumber } from '@/composables/format.js';
import { formatNumberDecimal } from '@/composables/format.js';
import { GEMS, GEM_LIST } from '@/constants/gem-planner';
import { useOrbOptimizer } from '@/composables/useOrbOptimizer.js';
import Decimal from 'break_infinity.js';

// Props
const props = defineProps({
  show: Boolean,
  getCurrentGemLevel: Function,
  updateGemLevel: Function,
  toggleGemNode: Function,
  hasGemNode: Function,
  getNextLevelCost: Function,
  getAvailableUpgrades: Function,
  getCurrentUpgradeLevel: Function,
  updateUpgradeLevel: Function,
  getUpgradeNextLevelCost: Function,
  getCurrentMultiplier: Function,
  editPlan: Object, // Plan to edit (optional)
  gameStats: Object, // Game stats for multiplier calculations
  weights: Object // Weights for efficiency calculations
});

const emit = defineEmits(['close', 'plan-created', 'plan-saved']);

// Local state for the active plan
const activePlan = ref({
  id: Date.now().toString(),
  name: `Gem Plan ${new Date().toLocaleDateString()}`,
  budget: 1e33,
  trBudgets: {}, // Budgets per TR index
  trSteps: [],
  // Plan-internal gem states per TR
  trGemStates: {
    // trIndex -> { levels: {}, nodes: {}, upgrades: {} }
  }
});

// State for Exodus node animation tracking
const newlyAppearedNodes = ref(new Set()); // Track newly appeared nodes for animation

const currentTRIndex = ref(0);
const spendingMode = ref('manual');
const spentOrbs = ref({});
const maxTRReached = ref(1); // Track the highest TR reached

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

// Auto-optimizer state
const { optimizeGemPurchases, resetAllUpgrades, calculateUpgradeEfficiency, calculateGemLevelEfficiency, formatEfficiency, formatValue } = useOrbOptimizer();
const isOptimizing = ref(false);
const optimizationResults = ref(null);
const optimizationProgress = ref(null);
const efficiencyScaling = ref(10); // Default to 1e10

// Current TR Budget - reactive to the current TR
const currentTRBudget = computed({
  get() {
    return activePlan.value.trBudgets[currentTRIndex.value] || Math.floor(activePlan.value.budget / 10);
  },
  set(value) {
    activePlan.value.trBudgets[currentTRIndex.value] = value;
  }
});

// Initialize TR steps
function initializePlan() {
  // Initialize first TR budget if not set
  if (!activePlan.value.trBudgets[0]) {
    activePlan.value.trBudgets[0] = Math.floor(activePlan.value.budget / 10);
  }
  
  // Initialize TR 0 (first TR) with global values as minimum
  if (!activePlan.value.trGemStates[0]) {
    activePlan.value.trGemStates[0] = {
      levels: {},
      nodes: {},
      upgrades: {}
    };
    
    // Set global values as starting values for TR 0
    GEM_LIST.forEach(gem => {
      // Get global gem level and set as starting value
      const globalLevel = props.getCurrentGemLevel(gem.id);
      activePlan.value.trGemStates[0].levels[gem.id] = globalLevel;
      
      // Get global gem nodes
      const globalNodes = [];
      if (gem.gemNodes) {
        gem.gemNodes.forEach((node, index) => {
          if (props.hasGemNode(gem.id, index)) {
            globalNodes.push(index);
          }
        });
      }
      activePlan.value.trGemStates[0].nodes[gem.id] = globalNodes;
      
      // Get global upgrade levels
      activePlan.value.trGemStates[0].upgrades[gem.id] = {};
      if (gem.upgrades) {
        gem.upgrades.forEach(upgrade => {
          const globalLevel = props.getCurrentUpgradeLevel(gem.id, upgrade.id);
          activePlan.value.trGemStates[0].upgrades[gem.id][upgrade.id] = globalLevel;
        });
      }
    });
  }
}

// Get minimum values for current TR (from previous TR or global)
function getMinimumGemLevel(gemId) {
  if (currentTRIndex.value === 0) {
    // TR 0: Use global values as minimum
    return props.getCurrentGemLevel(gemId);
  } else {
    // TR 1+: Use previous TR values as minimum
    const prevTR = currentTRIndex.value - 1;
    return activePlan.value.trGemStates[prevTR]?.levels[gemId] || props.getCurrentGemLevel(gemId);
  }
}

function getMinimumUpgradeLevel(gemId, upgradeId) {
  if (currentTRIndex.value === 0) {
    // TR 0: Use global values as minimum
    return props.getCurrentUpgradeLevel(gemId, upgradeId);
  } else {
    // TR 1+: Use previous TR values as minimum
    const prevTR = currentTRIndex.value - 1;
    return activePlan.value.trGemStates[prevTR]?.upgrades[gemId]?.[upgradeId] || props.getCurrentUpgradeLevel(gemId, upgradeId);
  }
}

function getMinimumGemNodes(gemId) {
  if (currentTRIndex.value === 0) {
    // TR 0: Use global values as minimum
    const globalNodes = [];
    const gem = GEMS[gemId];
    if (gem?.gemNodes) {
      gem.gemNodes.forEach((node, index) => {
        if (props.hasGemNode(gemId, index)) {
          globalNodes.push(index);
        }
      });
    }
    return globalNodes;
  } else {
    // TR 1+: Use previous TR values as minimum
    const prevTR = currentTRIndex.value - 1;
    return activePlan.value.trGemStates[prevTR]?.nodes[gemId] || [];
  }
}

// Plan-internal gem state functions
function getPlanGemLevel(gemId) {
  const trIndex = currentTRIndex.value;
  
  // Ensure trGemStates exists and is initialized
  if (!activePlan.value.trGemStates) {
    activePlan.value.trGemStates = {};
  }
  if (!activePlan.value.trGemStates[trIndex]) {
    activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
  }
  
  return activePlan.value.trGemStates[trIndex]?.levels[gemId] || getMinimumGemLevel(gemId);
}

function setPlanGemLevel(gemId, level) {
  const trIndex = currentTRIndex.value;
  const minimum = getMinimumGemLevel(gemId);
  
  // Ensure we don't go below minimum
  const finalLevel = Math.max(level, minimum);
  
  // Initialize TR state if not exists
  if (!activePlan.value.trGemStates[trIndex]) {
    activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
  }
  
  activePlan.value.trGemStates[trIndex].levels[gemId] = finalLevel;
}

function getPlanGemNodes(gemId) {
  const trIndex = currentTRIndex.value;
  
  // Ensure trGemStates exists and is initialized
  if (!activePlan.value.trGemStates) {
    activePlan.value.trGemStates = {};
  }
  if (!activePlan.value.trGemStates[trIndex]) {
    activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
  }
  
  return activePlan.value.trGemStates[trIndex]?.nodes[gemId] || getMinimumGemNodes(gemId);
}

function hasPlanGemNode(gemId, nodeIndex) {
  const nodes = getPlanGemNodes(gemId);
  return nodes.includes(nodeIndex);
}

function togglePlanGemNode(gemId, nodeIndex) {
  const trIndex = currentTRIndex.value;
  const minimumNodes = getMinimumGemNodes(gemId);
  
  // Initialize TR state if not exists
  if (!activePlan.value.trGemStates[trIndex]) {
    activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
  }
  
  if (!activePlan.value.trGemStates[trIndex].nodes[gemId]) {
    activePlan.value.trGemStates[trIndex].nodes[gemId] = [...minimumNodes];
  }
  
  const nodes = activePlan.value.trGemStates[trIndex].nodes[gemId];
  const index = nodes.indexOf(nodeIndex);
  const hasNode = index > -1;
  
  if (spendingMode.value === 'manual') {
    const gem = GEMS[gemId];
    const nodeCost = gem?.gemNodes?.[nodeIndex]?.cost || 0;
    
    if (!hasNode) {
      // Adding node - check if can afford
      if (!canAfford(nodeCost)) {
        showAlert(`Not enough orbs! Need ${formatNumber(nodeCost - remainingBudget.value)} more orbs.`, 'Insufficient Orbs', 'warning');
        return;
      }
      trackSpending(gemId, `_gem_node_${nodeIndex}`, nodeCost);
    } else if (!minimumNodes.includes(nodeIndex)) {
      // Removing node (if not minimum) - refund cost
      trackSpending(gemId, `_gem_node_${nodeIndex}`, -nodeCost);
    }
  }
  
  // Don't allow removing minimum nodes
  if (hasNode && !minimumNodes.includes(nodeIndex)) {
    nodes.splice(index, 1);
  } else if (!hasNode) {
    nodes.push(nodeIndex);
  }
}

function getPlanUpgradeLevel(gemId, upgradeId) {
  const trIndex = currentTRIndex.value;
  
  // Ensure trGemStates exists and is initialized
  if (!activePlan.value.trGemStates) {
    activePlan.value.trGemStates = {};
  }
  if (!activePlan.value.trGemStates[trIndex]) {
    activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
  }
  
  return activePlan.value.trGemStates[trIndex]?.upgrades[gemId]?.[upgradeId] || getMinimumUpgradeLevel(gemId, upgradeId);
}

function setPlanUpgradeLevel(gemId, upgradeId, level) {
  const trIndex = currentTRIndex.value;
  const minimum = getMinimumUpgradeLevel(gemId, upgradeId);
  
  // Ensure we don't go below minimum
  const finalLevel = Math.max(level, minimum);
  
  // Initialize TR state if not exists
  if (!activePlan.value.trGemStates[trIndex]) {
    activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
  }
  
  if (!activePlan.value.trGemStates[trIndex].upgrades[gemId]) {
    activePlan.value.trGemStates[trIndex].upgrades[gemId] = {};
  }
  
  activePlan.value.trGemStates[trIndex].upgrades[gemId][upgradeId] = finalLevel;
}

// Check if gem has any upgraded upgrades in the current plan
function hasUpgradedUpgrades(gemId) {
  const gem = GEMS[gemId];
  if (!gem) return false;
  
  // Check if gem level is higher than minimum
  const currentLevel = getPlanGemLevel(gemId);
  const minimumLevel = getMinimumGemLevel(gemId);
  if (currentLevel > minimumLevel) return true;
  
  // Check if any gem nodes are added beyond minimum
  const currentNodes = getPlanGemNodes(gemId);
  const minimumNodes = getMinimumGemNodes(gemId);
  if (currentNodes.length > minimumNodes.length) return true;
  
  // Check if any upgrade level is higher than minimum
  if (gem.upgrades) {
    return gem.upgrades.some(upgrade => {
      const currentUpgradeLevel = getPlanUpgradeLevel(gemId, upgrade.id);
      const minimumUpgradeLevel = getMinimumUpgradeLevel(gemId, upgrade.id);
      return currentUpgradeLevel > minimumUpgradeLevel;
    });
  }
  
  return false;
}

// Cost calculation functions for plan
function getPlanNextLevelCost(gemId) {
  const currentLevel = getPlanGemLevel(gemId);
  const gem = GEMS[gemId];
  const qualityCost = gem?.qualityCosts.find(cost => cost.level === currentLevel + 1);
  return qualityCost?.cost || 0;
}

// Calculate gem level efficiency
function getPlanGemLevelEfficiency(gemId) {
  const gem = GEMS[gemId];
  if (!gem) return 0;
  
  const currentLevel = getPlanGemLevel(gemId);
  if (currentLevel >= gem.maxLevel) return 0;
  
  const gemLevelCost = getPlanNextLevelCost(gemId);
  if (gemLevelCost <= 0) return Number.MAX_SAFE_INTEGER; // Free upgrades
  
  return calculateGemLevelEfficiency(
    gem, 
    currentLevel, 
    gemLevelCost, 
    props.weights || {}, 
    getPlanGemLevel, 
    getPlanUpgradeLevel
  );
}

function getPlanUpgradeNextLevelCost(gemId, upgradeId) {
  const currentLevel = getPlanUpgradeLevel(gemId, upgradeId);
  const gem = GEMS[gemId];
  const upgrade = gem?.upgrades.find(u => u.id === upgradeId);
  
  if (!upgrade) return 0;
  
  let cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel);
  
  if (upgrade.costBumps) {
    upgrade.costBumps.forEach(bump => {
      if (currentLevel >= bump.startLevel) {
        cost *= Math.pow(bump.multiplier, currentLevel - bump.startLevel);
      }
    });
  }
  
  return cost;
}

// Get available gem nodes based on Exodus level (same logic as Gems.vue)
function getAvailablePlanGemNodes(gemId) {
  const gem = GEMS[gemId];
  if (!gem || !gem.gemNodes) return [];
  
  const exodusLevel = getPlanGemLevel('exodus');
  
  // If Exodus is not level 5, only show original nodes (without unlock requirement)
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

// Utility functions for formatting (copied from 1.vue)
function formatMultiplier(multiplier) {
  // Handle our custom Decimal-like objects (with mantissa/exponent)
  if (multiplier && typeof multiplier === 'object' && 
      multiplier.mantissa !== undefined && multiplier.exponent !== undefined) {
    const value = multiplier.mantissa * Math.pow(10, multiplier.exponent);
    if (value < 10) return 'x' + value.toFixed(3);
    if (value < 1000) return 'x' + value.toFixed(2);
    return 'x' + formatNumberDecimal(multiplier);
  }
  
  // Handle regular numbers (fallback)
  if (typeof multiplier === 'number') {
    if (multiplier < 10) return 'x' + multiplier.toFixed(2);
    if (multiplier < 1000) return 'x' + multiplier.toFixed(2);
    return 'x' + formatNumber(multiplier);
  }
  
  return 'x1'; // Fallback
}

function formatPlanMultiplierWithType(gemId, upgradeId, multiplier) {
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
      if (value < 1) {
        // Under 1: show with 3 decimal places
        return '+' + value.toFixed(3);
      } else if (value < 1000) {
        // 1-1000: show with 2 decimal places
        return '+' + value.toFixed(2);
      } else {
        // 1000 and above: use formatNumberDecimal for suffix notation
        return '+' + formatNumberDecimal(multiplier);
      }
    }
    
    // Handle regular numbers (fallback)
    if (typeof multiplier === 'number') {
      if (multiplier < 1) {
        // Under 1: show with 3 decimal places
        return '+' + multiplier.toFixed(3);
      } else if (multiplier < 1000) {
        // 1-1000: show with 2 decimal places
        return '+' + multiplier.toFixed(2);
      } else {
        // 1000 and above: use formatNumber which handles suffixes with decimals
        return '+' + formatNumber(multiplier);
      }
    }
  }
  
  // Default to multiplicative formatting
  return formatMultiplier(multiplier);
}

function getPlanCurrentMultiplier(gemId, upgradeId) {
  const gem = GEMS[gemId];
  if (!gem) return 1;
  
  const upgrade = gem.upgrades.find(u => u.id === upgradeId);
  if (!upgrade) return 1;
  
  const currentLevel = getPlanUpgradeLevel(gemId, upgradeId);
  const gemLevel = getPlanGemLevel(gemId);
  
  if (currentLevel === 0) return 1;
  
  try {
    // Call the calculate function - some functions expect gameStats, others don't
    let result;
    
    // Check if the function expects gameStats by looking at function signature
    const functionString = upgrade.multiplier.calculate.toString();
    const expectsGameStats = functionString.includes('gameStats') || functionString.includes('level, gemLevel,') || functionString.includes('level,gemLevel,');
    
    // Create enhanced gameStats for mk9-core-resonance
    let enhancedGameStats = props.gameStats;
    
    // Special handling for mk9-core-resonance: calculate mk9CoreStability from mk9-core-stability upgrade
    if (gemId === 'evolution' && upgradeId === 'mk9-core-resonance') {
      enhancedGameStats = { ...props.gameStats };
      
      // Get mk9-core-stability level and calculate its multiplier
      const mk9CoreStabilityLevel = getPlanUpgradeLevel('evolution', 'mk9-core-stability');
      const evolutionLevel = getPlanGemLevel('evolution');
      
      // Pass the stability level directly to the formula
      enhancedGameStats.stabilityLevel = mk9CoreStabilityLevel;
      
      if (mk9CoreStabilityLevel > 0) {
        const mk9CoreStabilityUpgrade = gem.upgrades.find(u => u.id === 'mk9-core-stability');
        if (mk9CoreStabilityUpgrade) {
          const mk9CoreStabilityResult = mk9CoreStabilityUpgrade.multiplier.calculate(mk9CoreStabilityLevel, evolutionLevel);
          
          // Convert Decimal to number for gameStats
          if (mk9CoreStabilityResult && typeof mk9CoreStabilityResult === 'object' && 
              mk9CoreStabilityResult.mantissa !== undefined && mk9CoreStabilityResult.exponent !== undefined) {
            enhancedGameStats.mk9CoreStability = mk9CoreStabilityResult.mantissa * Math.pow(10, mk9CoreStabilityResult.exponent);
          } else if (typeof mk9CoreStabilityResult === 'number') {
            enhancedGameStats.mk9CoreStability = mk9CoreStabilityResult;
          } else {
            enhancedGameStats.mk9CoreStability = 0;
          }
        }
      } else {
        enhancedGameStats.mk9CoreStability = 0;
      }
    }
    
    if (expectsGameStats && enhancedGameStats) {
      result = upgrade.multiplier.calculate(currentLevel, gemLevel, enhancedGameStats);
    } else {
      result = upgrade.multiplier.calculate(currentLevel, gemLevel);
    }
    
    // Handle the result - it might be a Decimal object or need conversion
    if (result === null || result === undefined) {
      console.warn(`Null/undefined multiplier result for ${gemId}/${upgradeId}, using fallback`);
      return 1;
    }
    
    // Convert to a working value
    let finalResult;
    
    if (
      result != null
      && typeof result === 'object'
      && Object.prototype.hasOwnProperty.call(result, 'mantissa')
      && Object.prototype.hasOwnProperty.call(result, 'exponent')
    ) {
      // break_infinity.js serialized object - return the object itself for proper formatting
      return result;
    } else if (typeof result === 'number') {
      finalResult = isFinite(result) ? result : 1;
    } else {
      // Try to convert to number
      finalResult = Number(result) || 1;
    }
    
    return finalResult;
  } catch (error) {
    console.warn(`Error calculating multiplier for ${gemId}/${upgradeId}:`, error);
    return 1;
  }
}

// Get purchased levels for an upgrade
function getPurchasedLevels(gemId, upgradeId) {
  const currentLevel = getPlanUpgradeLevel(gemId, upgradeId);
  const minimumLevel = getMinimumUpgradeLevel(gemId, upgradeId);
  return Math.max(0, currentLevel - minimumLevel);
}

// Get purchased gem levels
function getPurchasedGemLevels(gemId) {
  const currentLevel = getPlanGemLevel(gemId);
  const minimumLevel = getMinimumGemLevel(gemId);
  return Math.max(0, currentLevel - minimumLevel);
}

// Get available upgrades for plan (based on plan gem level)
function getPlanAvailableUpgrades(gemId) {
  const gem = GEMS[gemId];
  if (!gem) return [];
  
  const currentLevel = getPlanGemLevel(gemId);
  return gem.upgrades.filter(upgrade => currentLevel >= upgrade.unlock);
}

// Check if a gem node was purchased in this plan
function isGemNodePurchasedInPlan(gemId, nodeIndex) {
  const minimumNodes = getMinimumGemNodes(gemId);
  const currentNodes = getPlanGemNodes(gemId);
  
  // Node is purchased in plan if it's currently active but wasn't in minimum nodes
  return currentNodes.includes(nodeIndex) && !minimumNodes.includes(nodeIndex);
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

function showConfirm(message, title = 'Confirm') {
  return new Promise((resolve) => {
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
        resolve(true);
      },
      onCancel: () => {
        alertDialog.value.isVisible = false;
        resolve(false);
      }
    };
  });
}

// Calculate upgrade efficiency - wrapper for the centralized function
function calculateUpgradeEfficiencyLocal(gemId, upgradeId) {
  return calculateUpgradeEfficiency(
    gemId,
    upgradeId,
    props.gameStats,
    props.weights,
    getPlanGemLevel,
    getPlanUpgradeLevel,
    getPlanUpgradeNextLevelCost,
    efficiencyScaling.value
  );
}

// Computed properties
const gemList = computed(() => GEM_LIST);

// Remove the old availableBudgetPerTR computed property as we're using currentTRBudget now

const spentBudget = computed(() => {
  const trIndex = currentTRIndex.value;
  if (!spentOrbs.value[trIndex]) return 0;
  
  let total = 0;
  Object.values(spentOrbs.value[trIndex]).forEach(gemSpending => {
    Object.values(gemSpending).forEach(upgradeSpent => {
      total += upgradeSpent;
    });
  });
  
  return total;
});

const remainingBudget = computed(() => {
  return Math.max(0, currentTRBudget.value - spentBudget.value);
});

const budgetUsagePercentage = computed(() => {
  if (currentTRBudget.value === 0) return 0;
  return Math.round((spentBudget.value / currentTRBudget.value) * 100);
});

// Methods
function handleModalClick(event) {
  if (event.target === event.currentTarget) {
    emit('close');
  }
}

function previousTR() {
  if (currentTRIndex.value > 0) {
    currentTRIndex.value--;
  }
}

// Delete current TR function
async function deleteTR() {
  console.log('deleteTR called, currentTRIndex:', currentTRIndex.value, 'maxTRReached:', maxTRReached.value);
  
  const confirmed = await showConfirm(`Are you sure you want to delete TR ${currentTRIndex.value + 1}? This will remove all gem purchases for this TR.`);
  console.log('User confirmed deletion:', confirmed);
  
  if (confirmed) {
    const currentTR = currentTRIndex.value;
    console.log('Deleting TR:', currentTR);
    
    // Remove TR data
    if (activePlan.value.trGemStates[currentTR]) {
      console.log('Removing trGemStates for TR:', currentTR);
      delete activePlan.value.trGemStates[currentTR];
    }
    if (activePlan.value.trBudgets[currentTR]) {
      console.log('Removing trBudgets for TR:', currentTR);
      delete activePlan.value.trBudgets[currentTR];
    }
    
    // Update maxTRReached
    console.log('Updating maxTRReached from', maxTRReached.value, 'to', maxTRReached.value - 1);
    maxTRReached.value = maxTRReached.value - 1;
    
    // Go to previous TR automatically
    console.log('Moving from TR', currentTRIndex.value, 'to', currentTR - 1);
    currentTRIndex.value = currentTR - 1;
    
    console.log('Delete completed. New state - currentTRIndex:', currentTRIndex.value, 'maxTRReached:', maxTRReached.value);
  }
}

function nextTR() {
  // Before moving to next TR, copy current TR values to next TR as starting values
  const currentTR = currentTRIndex.value;
  const nextTR = currentTR + 1;
  
  // Initialize next TR state with current TR values as minimum
  if (!activePlan.value.trGemStates[nextTR]) {
    activePlan.value.trGemStates[nextTR] = {
      levels: {},
      nodes: {},
      upgrades: {}
    };
    
    // Copy all current TR values to next TR
    if (activePlan.value.trGemStates[currentTR]) {
      GEM_LIST.forEach(gem => {
        // Copy gem levels
        const currentLevel = getPlanGemLevel(gem.id);
        activePlan.value.trGemStates[nextTR].levels[gem.id] = currentLevel;
        
        // Copy gem nodes
        const currentNodes = getPlanGemNodes(gem.id);
        activePlan.value.trGemStates[nextTR].nodes[gem.id] = [...currentNodes];
        
        // Copy upgrade levels
        activePlan.value.trGemStates[nextTR].upgrades[gem.id] = {};
        if (gem.upgrades) {
          gem.upgrades.forEach(upgrade => {
            const currentUpgradeLevel = getPlanUpgradeLevel(gem.id, upgrade.id);
            activePlan.value.trGemStates[nextTR].upgrades[gem.id][upgrade.id] = currentUpgradeLevel;
          });
        }
      });
    }
  }
  
  // Auto-set budget for new TR to match current TR budget
  if (!activePlan.value.trBudgets[nextTR]) {
    activePlan.value.trBudgets[nextTR] = activePlan.value.trBudgets[currentTR] || Math.floor(activePlan.value.budget / 10);
  }
  
  currentTRIndex.value = nextTR;
  
  // Update maxTRReached if we've gone to a new TR
  if (nextTR + 1 > maxTRReached.value) {
    maxTRReached.value = nextTR + 1;
  }
}

function setSpendingMode(mode) {
  spendingMode.value = mode;
}

function clearCurrentTRSpending() {
  const trIndex = currentTRIndex.value;
  
  // Clear spending tracking
  if (spentOrbs.value[trIndex]) {
    delete spentOrbs.value[trIndex];
    spentOrbs.value = { ...spentOrbs.value }; // Trigger reactivity
  }
  
  // Reset all gem values to minimum values for current TR
  if (activePlan.value.trGemStates[trIndex]) {
    GEM_LIST.forEach(gem => {
      // Reset gem level to minimum
      const minLevel = getMinimumGemLevel(gem.id);
      activePlan.value.trGemStates[trIndex].levels[gem.id] = minLevel;
      
      // Reset gem nodes to minimum
      const minNodes = getMinimumGemNodes(gem.id);
      activePlan.value.trGemStates[trIndex].nodes[gem.id] = [...minNodes];
      
      // Reset upgrade levels to minimum
      if (!activePlan.value.trGemStates[trIndex].upgrades[gem.id]) {
        activePlan.value.trGemStates[trIndex].upgrades[gem.id] = {};
      }
      
      if (gem.upgrades) {
        gem.upgrades.forEach(upgrade => {
          const minUpgradeLevel = getMinimumUpgradeLevel(gem.id, upgrade.id);
          activePlan.value.trGemStates[trIndex].upgrades[gem.id][upgrade.id] = minUpgradeLevel;
        });
      }
    });
  }
}

// Import purchased items from saved plan back to trGemStates
function importPurchasedItemsToTRStates() {
  // First, try to import from trSteps if available (more detailed data)
  if (activePlan.value.trSteps && activePlan.value.trSteps.length > 0) {
    activePlan.value.trSteps.forEach((trStep, index) => {
      if (trStep.gemStates && index < activePlan.value.trCount) {
        // Ensure the trGemStates structure exists
        if (!activePlan.value.trGemStates[index]) {
          activePlan.value.trGemStates[index] = { levels: {}, nodes: {}, upgrades: {} };
        }
        
        // Import the gem states from trSteps
        if (trStep.gemStates.levels) {
          activePlan.value.trGemStates[index].levels = { ...trStep.gemStates.levels };
        }
        if (trStep.gemStates.nodes) {
          activePlan.value.trGemStates[index].nodes = { ...trStep.gemStates.nodes };
        }
        if (trStep.gemStates.upgrades) {
          activePlan.value.trGemStates[index].upgrades = { ...trStep.gemStates.upgrades };
        }
      }
    });
    return; // If we imported from trSteps, we're done
  }
  
  // Fallback: import from summary data (purchasedGems, purchasedNodes, purchasedUpgrades)
  if (!activePlan.value.purchasedGems && !activePlan.value.purchasedNodes && !activePlan.value.purchasedUpgrades) {
    return; // No purchase data to import
  }
  
  // Import purchased gem levels
  if (activePlan.value.purchasedGems) {
    Object.entries(activePlan.value.purchasedGems).forEach(([gemId, purchasedLevels]) => {
      if (purchasedLevels > 0) {
        const minimumLevel = getMinimumGemLevel(gemId);
        const targetLevel = minimumLevel + purchasedLevels;
        
        // Apply to the highest TR where this level was reached
        let highestTR = Math.min(activePlan.value.trCount - 1, maxTRReached.value - 1);
        for (let trIndex = highestTR; trIndex >= 0; trIndex--) {
          if (!activePlan.value.trGemStates[trIndex]) {
            activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
          }
          activePlan.value.trGemStates[trIndex].levels[gemId] = targetLevel;
        }
      }
    });
  }
  
  // Import purchased gem nodes
  if (activePlan.value.purchasedNodes) {
    Object.entries(activePlan.value.purchasedNodes).forEach(([gemId, purchasedNodes]) => {
      if (purchasedNodes && purchasedNodes.length > 0) {
        const minimumNodes = getMinimumGemNodes(gemId);
        const targetNodes = [...minimumNodes, ...purchasedNodes];
        
        // Apply to the highest TR where these nodes were unlocked
        let highestTR = Math.min(activePlan.value.trCount - 1, maxTRReached.value - 1);
        for (let trIndex = highestTR; trIndex >= 0; trIndex--) {
          if (!activePlan.value.trGemStates[trIndex]) {
            activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
          }
          activePlan.value.trGemStates[trIndex].nodes[gemId] = targetNodes;
        }
      }
    });
  }
  
  // Import purchased upgrades
  if (activePlan.value.purchasedUpgrades) {
    Object.entries(activePlan.value.purchasedUpgrades).forEach(([gemId, upgrades]) => {
      Object.entries(upgrades).forEach(([upgradeId, purchasedLevels]) => {
        if (purchasedLevels > 0) {
          const minimumLevel = getMinimumUpgradeLevel(gemId, upgradeId);
          const targetLevel = minimumLevel + purchasedLevels;
          
          // Apply to the highest TR where this upgrade level was reached
          let highestTR = Math.min(activePlan.value.trCount - 1, maxTRReached.value - 1);
          for (let trIndex = highestTR; trIndex >= 0; trIndex--) {
            if (!activePlan.value.trGemStates[trIndex]) {
              activePlan.value.trGemStates[trIndex] = { levels: {}, nodes: {}, upgrades: {} };
            }
            if (!activePlan.value.trGemStates[trIndex].upgrades[gemId]) {
              activePlan.value.trGemStates[trIndex].upgrades[gemId] = {};
            }
            activePlan.value.trGemStates[trIndex].upgrades[gemId][upgradeId] = targetLevel;
          }
        }
      });
    });
  }
  
  // Calculate initial spending based on copied states vs minimums
  // This ensures the spent amount is correct when saving a new plan
  for (let trIndex = 0; trIndex < maxTRReached.value; trIndex++) {
    const actualSpent = calculateActualSpentOrbs(trIndex);
    if (actualSpent > 0) {
      // Initialize spentOrbs structure if it doesn't exist
      if (!spentOrbs.value[trIndex]) {
        spentOrbs.value[trIndex] = {};
      }
      
      // Set a placeholder entry to track the actual spent amount
      if (!spentOrbs.value[trIndex]['_calculated']) {
        spentOrbs.value[trIndex]['_calculated'] = {};
      }
      spentOrbs.value[trIndex]['_calculated']['total'] = actualSpent;
    }
  }
}

// Calculate actual spent orbs based on purchased items
function calculateActualSpentOrbs(trIndex) {
  let totalSpent = 0;
  
  if (!activePlan.value.trGemStates[trIndex]) {
    return 0;
  }
  
  const trState = activePlan.value.trGemStates[trIndex];
  
  GEM_LIST.forEach(gem => {
    // Calculate gem level costs
    const currentLevel = trState.levels?.[gem.id] || 0;
    const minimumLevel = getMinimumGemLevel(gem.id);
    
    for (let level = minimumLevel + 1; level <= currentLevel; level++) {
      const qualityCost = gem.qualityCosts?.find(cost => cost.level === level);
      if (qualityCost && qualityCost.cost !== null && qualityCost.cost !== undefined) {
        totalSpent += qualityCost.cost;
      }
    }
    
    // Calculate gem node costs
    const currentNodes = trState.nodes?.[gem.id] || [];
    const minimumNodes = getMinimumGemNodes(gem.id);
    
    currentNodes.forEach(nodeIndex => {
      if (!minimumNodes.includes(nodeIndex) && gem.gemNodes && gem.gemNodes[nodeIndex]) {
        const nodeCost = gem.gemNodes[nodeIndex].cost;
        // Handle free nodes (cost: 0 or null)
        if (nodeCost !== null && nodeCost !== undefined) {
          totalSpent += nodeCost;
        }
      }
    });
    
    // Calculate upgrade costs
    if (gem.upgrades && trState.upgrades?.[gem.id]) {
      gem.upgrades.forEach(upgrade => {
        const currentLevel = trState.upgrades[gem.id][upgrade.id] || 0;
        const minimumLevel = getMinimumUpgradeLevel(gem.id, upgrade.id);
        
        for (let level = minimumLevel; level < currentLevel; level++) {
          let cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, level);
          if (upgrade.costBumps) {
            upgrade.costBumps.forEach(bump => {
              if (level >= bump.startLevel) {
                cost *= Math.pow(bump.multiplier, level - bump.startLevel);
              }
            });
          }
          totalSpent += cost;
        }
      });
    }
  });
  
  return totalSpent;
}

// Track spending
function trackSpending(gemId, upgradeId, cost) {
  const trIndex = currentTRIndex.value;
  
  if (!spentOrbs.value[trIndex]) {
    spentOrbs.value[trIndex] = {};
  }
  
  if (!spentOrbs.value[trIndex][gemId]) {
    spentOrbs.value[trIndex][gemId] = {};
  }
  
  if (!spentOrbs.value[trIndex][gemId][upgradeId]) {
    spentOrbs.value[trIndex][gemId][upgradeId] = 0;
  }
  
  spentOrbs.value[trIndex][gemId][upgradeId] += cost;
  spentOrbs.value = { ...spentOrbs.value }; // Trigger reactivity
}

// Check if user can afford an upgrade
function canAfford(cost) {
  return remainingBudget.value >= cost;
}

// Initialize plan when modal opens
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Check if we're editing an existing plan
    if (props.editPlan) {
      // Load the existing plan for editing
      activePlan.value = {
        ...JSON.parse(JSON.stringify(props.editPlan)) // Deep copy to avoid mutating original
      };
      
      // Ensure trGemStates exists and is properly initialized
      if (!activePlan.value.trGemStates) {
        activePlan.value.trGemStates = {};
      }
      
      // Ensure trBudgets exists and is properly initialized
      if (!activePlan.value.trBudgets) {
        activePlan.value.trBudgets = {};
      }
      
      // Initialize trGemStates for each TR if not present
      const trCount = activePlan.value.trCount || 1;
      for (let i = 0; i < trCount; i++) {
        if (!activePlan.value.trGemStates[i]) {
          activePlan.value.trGemStates[i] = { levels: {}, nodes: {}, upgrades: {} };
        }
        // Initialize trBudgets if not present
        if (activePlan.value.trBudgets[i] === undefined) {
          activePlan.value.trBudgets[i] = activePlan.value.initialBudget || 1e33;
        }
      }
      
      // Import purchased items back into trGemStates
      importPurchasedItemsToTRStates();
      
      // Restore the TR state
      if (props.editPlan.currentTRIndex !== undefined) {
        currentTRIndex.value = props.editPlan.currentTRIndex;
      }
      if (props.editPlan.maxTRReached !== undefined) {
        maxTRReached.value = props.editPlan.maxTRReached;
      }
      if (props.editPlan.spentOrbs) {
        spentOrbs.value = { ...props.editPlan.spentOrbs };
      }
      if (props.editPlan.spendingMode) {
        spendingMode.value = props.editPlan.spendingMode;
      }
    } else {
      // Create new plan
      const now = new Date().toISOString();
      activePlan.value = {
        id: Date.now().toString(),
        name: `Gem Plan ${new Date().toLocaleDateString()}`,
        budget: 1e33,
        trBudgets: {}, // Budgets per TR index
        trSteps: [],
        createdAt: now,
        updatedAt: now,
        // Plan-internal gem states per TR
        trGemStates: {
          // trIndex -> { levels: {}, nodes: {}, upgrades: {} }
        }
      };
      
      // Reset TR state for new plan
      currentTRIndex.value = 0;
      maxTRReached.value = 1;
      spentOrbs.value = {};
      spendingMode.value = 'manual';
      
      initializePlan();
    }
    
    // Emit the plan so the parent component can use it
    emit('plan-created', activePlan.value);
  }
});

// Delegate gem functions to props with spending tracking
function updatePlanGemLevel(gemId, newLevel) {
  const currentLevel = getPlanGemLevel(gemId);
  const minimum = getMinimumGemLevel(gemId);
  
  // Ensure we don't go below minimum
  const finalLevel = Math.max(newLevel, minimum);
  
  if (spendingMode.value === 'manual') {
    if (finalLevel > currentLevel) {
      // Upgrading - calculate cost
      let totalCost = 0;
      const gem = GEMS[gemId];
      
      for (let level = currentLevel + 1; level <= finalLevel; level++) {
        const qualityCost = gem?.qualityCosts.find(cost => cost.level === level);
        totalCost += qualityCost?.cost || 0;
      }
      
      if (!canAfford(totalCost)) {
        showAlert(`Not enough orbs! Need ${formatNumber(totalCost - remainingBudget.value)} more orbs.`, 'Insufficient Orbs', 'warning');
        return;
      }
      
      trackSpending(gemId, '_gem_level', totalCost);
    } else if (finalLevel < currentLevel) {
      // Downgrading - refund cost
      let refundCost = 0;
      const gem = GEMS[gemId];
      
      for (let level = finalLevel + 1; level <= currentLevel; level++) {
        const qualityCost = gem?.qualityCosts.find(cost => cost.level === level);
        refundCost += qualityCost?.cost || 0;
      }
      
      // Track negative spending (refund)
      trackSpending(gemId, '_gem_level', -refundCost);
    }
  }
  
  // Special handling for Exodus level changes to track new nodes
  if (gemId === 'exodus') {
    const currentExodusLevel = getPlanGemLevel('exodus');
    
    // If Exodus reaches level 5 for the first time, mark all new nodes
    if (currentExodusLevel < 5 && finalLevel >= 5) {
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
    
    // If Exodus level drops below 5, reset Exodus-5 dependent gem nodes and clear animation
    if (currentExodusLevel >= 5 && finalLevel < 5) {
      newlyAppearedNodes.value.clear();
      
      // Reset all Exodus-5 dependent gem nodes for all gems
      GEM_LIST.forEach(otherGem => {
        if (otherGem.gemNodes) {
          otherGem.gemNodes.forEach((node, nodeIndex) => {
            if (node.unlockRequirement === 'exodus-5' && hasPlanGemNode(otherGem.id, nodeIndex)) {
              togglePlanGemNode(otherGem.id, nodeIndex); // Remove the node
            }
          });
        }
      });
    }
  }
  
  setPlanGemLevel(gemId, finalLevel);
}

function updatePlanUpgradeLevel(gemId, upgradeId, newLevel) {
  const currentLevel = getPlanUpgradeLevel(gemId, upgradeId);
  const minimum = getMinimumUpgradeLevel(gemId, upgradeId);
  
  // Ensure we don't go below minimum
  const finalLevel = Math.max(newLevel, minimum);
  
  if (spendingMode.value === 'manual') {
    if (finalLevel > currentLevel) {
      // Upgrading - calculate cost
      let totalCost = 0;
      const gem = GEMS[gemId];
      const upgrade = gem?.upgrades.find(u => u.id === upgradeId);
      
      if (upgrade) {
        for (let level = currentLevel; level < finalLevel; level++) {
          let cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, level);
          
          if (upgrade.costBumps) {
            upgrade.costBumps.forEach(bump => {
              if (level >= bump.startLevel) {
                cost *= Math.pow(bump.multiplier, level - bump.startLevel);
              }
            });
          }
          
          totalCost += cost;
        }
        
        if (!canAfford(totalCost)) {
          showAlert(`Not enough orbs! Need ${formatNumber(totalCost - remainingBudget.value)} more orbs.`, 'Insufficient Orbs', 'warning');
          return;
        }
        
        trackSpending(gemId, upgradeId, totalCost);
      }
    } else if (finalLevel < currentLevel) {
      // Downgrading - refund cost
      let refundCost = 0;
      const gem = GEMS[gemId];
      const upgrade = gem?.upgrades.find(u => u.id === upgradeId);
      
      if (upgrade) {
        for (let level = finalLevel; level < currentLevel; level++) {
          let cost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, level);
          
          if (upgrade.costBumps) {
            upgrade.costBumps.forEach(bump => {
              if (level >= bump.startLevel) {
                cost *= Math.pow(bump.multiplier, level - bump.startLevel);
              }
            });
          }
          
          refundCost += cost;
        }
        
        // Track negative spending (refund)
        trackSpending(gemId, upgradeId, -refundCost);
      }
    }
  }
  
  setPlanUpgradeLevel(gemId, upgradeId, finalLevel);
}

// Save plan function
function savePlan() {
  // Calculate total budget across all TRs
  const totalBudgetAcrossAllTRs = Object.values(activePlan.value.trBudgets).reduce((sum, budget) => sum + budget, 0);

  // Create trSteps array for OrbPlanCard compatibility
  const trSteps = [];
  let totalSpentAcrossAllTRs = 0;
  
  for (let i = 0; i < maxTRReached.value; i++) {
    const trBudget = activePlan.value.trBudgets[i] || 0;
    
    // Always calculate actual spent based on gem states first
    let trSpent = calculateActualSpentOrbs(i);
    
    // Override with manual tracking if it exists and is more than calculated
    if (spentOrbs.value[i]) {
      let manualSpent = 0;
      Object.values(spentOrbs.value[i]).forEach(gemSpending => {
        Object.values(gemSpending).forEach(upgradeSpent => {
          manualSpent += upgradeSpent;
        });
      });
      
      // Use manual tracking if it's greater (more accurate for manual spending mode)
      if (manualSpent > trSpent) {
        trSpent = manualSpent;
      }
    }
    
    totalSpentAcrossAllTRs += trSpent;

    trSteps.push({
      trIndex: i,
      budget: trBudget,
      spentOrbs: trSpent,
      remainingOrbs: Math.max(0, trBudget - trSpent),
      gemStates: activePlan.value.trGemStates[i] || { levels: {}, nodes: {}, upgrades: {} }
    });
  }

  // Create summary of purchased items for display purposes
  const purchasedGems = {};
  const purchasedNodes = {};
  const purchasedUpgrades = {};

  GEM_LIST.forEach(gem => {
    // Check each TR for purchases
    Object.keys(activePlan.value.trGemStates).forEach(trIndex => {
      const trState = activePlan.value.trGemStates[trIndex];
      if (!trState) return;

      // Gem levels purchased
      const currentLevel = trState.levels?.[gem.id] || 0;
      const minimumLevel = getMinimumGemLevel(gem.id);
      const purchasedLevels = Math.max(0, currentLevel - minimumLevel);
      
      if (purchasedLevels > 0) {
        if (!purchasedGems[gem.id]) purchasedGems[gem.id] = 0;
        purchasedGems[gem.id] = Math.max(purchasedGems[gem.id], purchasedLevels);
      }

      // Gem nodes purchased
      const currentNodes = trState.nodes?.[gem.id] || [];
      const minimumNodes = getMinimumGemNodes(gem.id);
      const newNodes = currentNodes.filter(nodeIndex => !minimumNodes.includes(nodeIndex));
      
      if (newNodes.length > 0) {
        if (!purchasedNodes[gem.id]) purchasedNodes[gem.id] = [];
        purchasedNodes[gem.id] = [...new Set([...purchasedNodes[gem.id], ...newNodes])];
      }

      // Upgrades purchased
      if (gem.upgrades && trState.upgrades?.[gem.id]) {
        gem.upgrades.forEach(upgrade => {
          const currentLevel = trState.upgrades[gem.id][upgrade.id] || 0;
          const minimumLevel = getMinimumUpgradeLevel(gem.id, upgrade.id);
          const purchasedLevels = Math.max(0, currentLevel - minimumLevel);
          
          if (purchasedLevels > 0) {
            if (!purchasedUpgrades[gem.id]) purchasedUpgrades[gem.id] = {};
            if (!purchasedUpgrades[gem.id][upgrade.id]) purchasedUpgrades[gem.id][upgrade.id] = 0;
            purchasedUpgrades[gem.id][upgrade.id] = Math.max(purchasedUpgrades[gem.id][upgrade.id], purchasedLevels);
          }
        });
      }
    });
  });

  // Create a complete plan object with all current state and statistics
  const planToSave = {
    ...activePlan.value,
    savedAt: new Date().toISOString(),
    createdAt: activePlan.value.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentTRIndex: currentTRIndex.value,
    maxTRReached: maxTRReached.value,
    spentOrbs: { ...spentOrbs.value },
    spendingMode: spendingMode.value,
    
    // Statistics for OrbPlanCard
    trCount: maxTRReached.value,
    initialBudget: activePlan.value.trBudgets[0] || Math.floor(activePlan.value.budget / 10),
    totalBudget: totalBudgetAcrossAllTRs,
    totalSpent: totalSpentAcrossAllTRs,
    trSteps: trSteps,
    
    // Purchase summaries
    purchasedGems: purchasedGems,
    purchasedNodes: purchasedNodes,
    purchasedUpgrades: purchasedUpgrades,
    
    // Additional metadata
    efficiencyScaling: efficiencyScaling.value
  };
  
  // Emit the save event to parent component
  emit('plan-saved', planToSave);
  
  // Close the modal after saving
  emit('close');
}

// Auto-optimizer functions
async function runAutoOptimizer() {
  if (isOptimizing.value) return;
  
  isOptimizing.value = true;
  optimizationResults.value = null;
  optimizationProgress.value = null;
  
  try {
    const result = await optimizeGemPurchases({
      budget: remainingBudget.value,
      getCurrentGemLevel: props.getCurrentGemLevel,
      getPlanGemLevel,
      setPlanGemLevel,
      getCurrentUpgradeLevel: props.getCurrentUpgradeLevel,
      getPlanUpgradeLevel,
      setPlanUpgradeLevel,
      getPlanUpgradeNextLevelCost,
      hasPlanGemNode,
      togglePlanGemNode,
      gameStats: props.gameStats,
      weights: props.weights || {},
      trackSpending, // Pass the spending tracker
      onProgress: (progress) => {
        optimizationProgress.value = progress;
      }
    });
    
    optimizationResults.value = result;
    
    if (result.success) {
      console.log(`Optimization complete! Spent ${formatNumber(result.totalSpent)} orbs, ${result.results.length} purchases made.`);
    } else {
      console.error('Optimization failed:', result.error);
    }
    
  } catch (error) {
    console.error('Auto-optimizer error:', error);
    optimizationResults.value = {
      success: false,
      error: error.message,
      results: [],
      totalSpent: 0,
      remainingOrbs: remainingBudget.value
    };
  } finally {
    isOptimizing.value = false;
  }
}

async function resetToMinimumLevels() {
  const confirmed = await showConfirm(
    'Reset all upgrades to minimum levels? This will undo all planned purchases for this TR.',
    'Reset Upgrades'
  );
  
  if (confirmed) {
    resetAllUpgrades({
      getMinimumGemLevel,
      setPlanGemLevel,
      getMinimumUpgradeLevel,
      setPlanUpgradeLevel
    });
    
    // Clear spending tracking for current TR
    clearCurrentTRSpending();
    
    // Clear optimization results
    optimizationResults.value = null;
    optimizationProgress.value = null;
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Custom input styling */
input:focus {
  outline: none;
}

/* Remove browser arrows/spinners from number inputs */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Fixed height for gem headers to prevent layout jumps */
.gem-header {
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

/* Simple pulse animation for newly appeared nodes (from Gems.vue) */
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
</style>
