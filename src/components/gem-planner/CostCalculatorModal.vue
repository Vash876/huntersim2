<template>
  <div 
    v-if="isVisible"
    class="fixed inset-0 z-[150] overflow-y-auto bg-gray-900/90 flex items-center justify-center p-2 sm:p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-sm sm:text-base font-semibold text-white flex items-center">
            <IconCalculator size="18" class="mr-2 text-amber-400" />
            Gem Upgrade Cost Calculator
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="$emit('close')"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Calculator Controls -->
      <div class="p-4">
        <div class="mb-4">
          <h3 class="text-sm font-semibold mb-2 flex items-center text-gray-200">
            <IconCoins size="16" class="mr-2 text-amber-400" />
            Available Gem Dust
          </h3>
          <div class="flex items-center">
            <ToolValueControls
              :value="availableGemDust"
              :minValue="0"
              :maxValue="10000000"
              :step="100"
              :fastStep="1000"
              :validateOnFinalOnly="true"
              @update:value="availableGemDust = $event"
              value-class="text-amber-400 font-medium"
              :autoEdit="true"
            />
          </div>
          <div class="text-xs text-gray-400 mt-1">
            Enter the amount of Gem Dust you have available to spend on upgrades.
          </div>
        </div>

        <div class="bg-gray-750/60 rounded-lg border border-gray-700 p-4 mb-4">
          <h3 class="text-sm font-semibold mb-2 flex items-center text-gray-200">
            <IconTargetArrow size="16" class="mr-2 text-blue-400" />
            Upgrade Goal
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Target Gem Selection -->
            <div>
              <label class="text-xs text-gray-400 mb-1 block">Target Gem</label>
              <select 
                v-model="targetGem" 
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm"
              >
                <option value="exodus">Exodus</option>
                <option value="temporal">Temporal</option>
                <option value="innovation">Innovation</option>
                <option value="attraction">Attraction</option>
                <option value="power">Power</option>
                <option value="creation">Creation</option>
              </select>
            </div>
            
            <!-- Target Level -->
            <div>
              <label class="text-xs text-gray-400 mb-1 block">Target Level</label>
              <select 
                v-model="targetLevel" 
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm"
              >
                <option :value="level" v-for="level in targetLevelOptions" :key="level">
                  Level {{ level }}
                </option>
              </select>
            </div>
            
            <!-- Target Node (conditional) -->
            <div v-if="targetGem !== 'exodus'">
              <label class="text-xs text-gray-400 mb-1 block">Include Nodes</label>
              <select 
                v-model="targetNode" 
                class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-sm"
              >
                <option value="none">None</option>
                <option value="1">First Node</option>
                <option value="2">First + Second Node</option>
                <option value="3">All Nodes</option>
              </select>
            </div>
          </div>
          
          <div class="mt-3">
            <button 
              @click="calculatePath"
              class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md text-sm transition-colors"
            >
              Calculate Upgrade Path
            </button>
          </div>
        </div>
        
        <!-- Current Setup Preview -->
        <div class="bg-gray-750/30 rounded-lg border border-gray-700/50 p-3 mb-4">
          <h3 class="text-sm font-semibold mb-2">Current Setup</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <div 
              v-for="(level, gemId) in currentGems" 
              :key="gemId"
              class="bg-gray-800 p-2 rounded-md text-center"
            >
              <div class="text-xs" :class="getGemTextClass(gemId)">{{ capitalizeFirst(gemId) }}</div>
              <div class="font-bold">
                {{ level }}/{{ gemId === 'exodus' ? 4 : 3 }}
              </div>
              <div v-if="gemId !== 'exodus' && activeNodes[gemId]?.length > 0" class="text-xs text-gray-400 mt-1">
                {{ activeNodes[gemId].length }} node{{ activeNodes[gemId].length !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Results Section -->
        <div v-if="calculationResult">
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 p-4">
            <h3 class="text-sm font-bold mb-3 flex items-center text-blue-400">
              <IconChartBar size="16" class="mr-2" />
              Calculation Results
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div class="bg-gray-800 p-3 rounded-md">
                <div class="text-xs text-gray-400">Total Cost</div>
                <div class="text-xl font-bold text-amber-400">
                  {{ formatNumber(calculationResult.totalCost) }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ canAfford ? 'You can afford this upgrade' : 'You cannot afford this upgrade yet' }}
                </div>
              </div>
              
              <div class="bg-gray-800 p-3 rounded-md">
                <div class="text-xs text-gray-400">Remaining Gem Dust</div>
                <div class="text-xl font-bold" :class="canAfford ? 'text-green-400' : 'text-red-400'">
                  {{ formatNumber(availableGemDust - calculationResult.totalCost) }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ canAfford ? 'After all upgrades' : 'You need more Gem Dust' }}
                </div>
              </div>
            </div>
            
            <!-- Upgrade Path Details -->
            <h4 class="text-sm font-medium mb-2 mt-4">Upgrade Path</h4>
            <div class="bg-gray-800/50 rounded-md border border-gray-700/50 overflow-hidden">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-gray-700/50">
                    <th class="py-2 px-3 text-left">Step</th>
                    <th class="py-2 px-3 text-left">Upgrade</th>
                    <th class="py-2 px-3 text-right">Cost</th>
                    <th class="py-2 px-3 text-right hidden sm:table-cell">Running Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(step, index) in calculationResult.steps" 
                    :key="index"
                    class="border-t border-gray-700/50"
                  >
                    <td class="py-1.5 px-3">{{ index + 1 }}</td>
                    <td class="py-1.5 px-3">
                      <span :class="getGemTextClass(step.gem)">{{ step.description }}</span>
                    </td>
                    <td class="py-1.5 px-3 text-right text-amber-400">
                      {{ formatNumber(step.cost) }}
                    </td>
                    <td class="py-1.5 px-3 text-right text-gray-400 hidden sm:table-cell">
                      {{ formatNumber(step.runningTotal) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Boost Summary -->
            <h4 class="text-sm font-medium mb-2 mt-4">Boost Summary</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div class="bg-gray-800/70 p-2 rounded-md text-center">
                <div class="text-xs text-orange-400">RP Boost</div>
                <div class="font-bold text-orange-400">×{{ formatMultiplier(calculationResult.boosts.rp) }}</div>
              </div>
              <div class="bg-gray-800/70 p-2 rounded-md text-center">
                <div class="text-xs text-red-400">MP Boost</div>
                <div class="font-bold text-red-400">×{{ formatMultiplier(calculationResult.boosts.mp) }}</div>
              </div>
              <div class="bg-gray-800/70 p-2 rounded-md text-center">
                <div class="text-xs text-green-400">Cell Boost</div>
                <div class="font-bold text-green-400">×{{ formatMultiplier(calculationResult.boosts.cells) }}</div>
              </div>
              <div class="bg-gray-800/70 p-2 rounded-md text-center">
                <div class="text-xs text-blue-400">Shard Boost</div>
                <div class="font-bold text-blue-400">×{{ formatMultiplier(calculationResult.boosts.shards) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0">
        <div class="flex justify-end">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  IconCalculator, 
  IconX, 
  IconCoins,
  IconTargetArrow,
  IconChartBar,
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { useGemPlannerStore } from '@/store/gemStore';

const gemPlannerStore = useGemPlannerStore();

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentGems: {
    type: Object,
    default: () => ({
      exodus: 0,
      temporal: 0,
      innovation: 0,
      attraction: 0,
      power: 0,
      creation: 0
    })
  },
  activeNodes: {
    type: Object,
    default: () => ({
      temporal: [],
      innovation: [],
      attraction: [],
      power: [],
      creation: []
    })
  }
});

// Emits
const emit = defineEmits(['close']);

// State
const availableGemDust = ref(gemPlannerStore.userStats.gemDust || 0);
const targetGem = ref('exodus');
const targetLevel = ref(1);
const targetNode = ref('none');
const calculationResult = ref(null);

// Gem cost data
const gemCosts = {
  exodus: [1000, 2000, 5000, 10000], // Level 1 to 4
  temporal: [1000, 5000, 10000], // Level 1 to 3
  innovation: [1000, 5000, 10000],
  attraction: [1000, 5000, 10000],
  power: [1000, 5000, 10000],
  creation: [1000, 5000, 10000]
};

// Node cost data
const nodeCosts = {
  temporal: [1000, 5000, 20000],
  innovation: [2000, 8000, 25000],
  attraction: [3000, 10000, 30000],
  power: [4000, 15000, 40000],
  creation: [5000, 20000, 50000]
};

// Computed
const targetLevelOptions = computed(() => {
  // For Exodus: levels 1-4, for others: 1-3
  return targetGem.value === 'exodus' ? [1, 2, 3, 4] : [1, 2, 3];
});

const canAfford = computed(() => {
  if (!calculationResult.value) return true;
  return availableGemDust.value >= calculationResult.value.totalCost;
});

// Watch for changes in targetGem and reset targetLevel if needed
watch(targetGem, (newValue) => {
  if (newValue === 'exodus' && targetLevel.value > 4) {
    targetLevel.value = 4;
  }
});

// Methods
function calculatePath() {
  const requiredGems = {};
  const requiredNodes = {};
  const unlockSequence = [];
  let totalCost = 0;
  const steps = [];
  
  // Clone current gems and active nodes to work with
  const currentGemLevels = { ...props.currentGems };
  const currentActiveNodes = JSON.parse(JSON.stringify(props.activeNodes));
  
  // Add target gem upgrades needed
  for (let i = currentGemLevels[targetGem.value]; i < targetLevel.value; i++) {
    const level = i + 1;
    const cost = gemCosts[targetGem.value][i];
    
    steps.push({
      gem: targetGem.value,
      description: `${capitalizeFirst(targetGem.value)} Gem Level ${level}`,
      cost,
      runningTotal: (steps.length > 0 ? steps[steps.length - 1].runningTotal : 0) + cost
    });
    
    totalCost += cost;
  }
  
  // Add target nodes if applicable
  if (targetGem.value !== 'exodus' && targetNode.value !== 'none') {
    const nodeCount = parseInt(targetNode.value);
    
    for (let i = 0; i < nodeCount; i++) {
      // Skip nodes that are already active
      if (currentActiveNodes[targetGem.value] && currentActiveNodes[targetGem.value].includes(i)) {
        continue;
      }
      
      const cost = nodeCosts[targetGem.value][i];
      
      steps.push({
        gem: targetGem.value,
        description: `${capitalizeFirst(targetGem.value)} Node ${i + 1}`,
        cost,
        runningTotal: (steps.length > 0 ? steps[steps.length - 1].runningTotal : 0) + cost
      });
      
      totalCost += cost;
    }
  }
  
  // Calculate resulting boosts
  const boosts = calculateTotalBoosts({
    gemLevels: {
      ...currentGemLevels,
      [targetGem.value]: targetLevel.value
    },
    activeNodes: {
      ...currentActiveNodes,
      [targetGem.value]: targetGem.value !== 'exodus' && targetNode.value !== 'none' 
        ? Array.from({ length: parseInt(targetNode.value) }, (_, i) => i)
        : []
    }
  });
  
  // Set calculation result
  calculationResult.value = {
    totalCost,
    steps,
    boosts
  };
}

function calculateTotalBoosts(plannedSetup) {
  const { gemLevels, activeNodes } = plannedSetup;
  
  // Calculate boosts based on the setup
  const boosts = {
    rp: 1,
    mp: 1,
    cells: 1,
    shards: 1
  };
  
  // Example boost calculation (simplified)
  if (gemLevels.exodus >= 1) boosts.rp *= 1.2;
  if (gemLevels.exodus >= 2) boosts.shards *= 1.3;
  if (gemLevels.exodus >= 3) boosts.cells *= 1.4;
  if (gemLevels.exodus >= 4) boosts.mp *= 1.5;
  
  // Add boosts from other gems
  Object.entries(gemLevels).forEach(([gemId, level]) => {
    if (gemId === 'exodus') return;
    
    if (level >= 1) {
      // Apply gem level boosts based on gem type
      const boostType = getMainBoostType(gemId);
      boosts[boostType] *= Math.pow(1.2, level);
    }
  });
  
  // Add boosts from active nodes
  Object.entries(activeNodes).forEach(([gemId, nodeIndices]) => {
    nodeIndices.forEach(nodeIdx => {
      const nodeBoostType = getNodeBoostType(gemId, nodeIdx);
      const nodeBoostValue = getNodeBoostValue(gemId, nodeIdx);
      
      if (nodeBoostType && nodeBoostValue) {
        boosts[nodeBoostType] *= nodeBoostValue;
      }
    });
  });
  
  return boosts;
}

function getMainBoostType(gemId) {
  // Define the primary boost type for each gem
  switch (gemId) {
    case 'temporal': return 'rp';
    case 'innovation': return 'mp';
    case 'attraction': return 'shards';
    case 'power': return 'mp';
    case 'creation': return 'cells';
    default: return 'rp';
  }
}

function getNodeBoostType(gemId, nodeIdx) {
  // Simplified mapping based on the data in GemPlanner.vue
  const boostMap = {
    temporal: ['rp', 'mp', 'shards'],
    innovation: ['rp', 'cells', 'mp'],
    attraction: ['shards', 'cells', 'rp'],
    power: ['mp', 'rp', 'cells'],
    creation: ['cells', 'shards', 'mp']
  };
  
  return boostMap[gemId]?.[nodeIdx] || 'rp';
}

function getNodeBoostValue(gemId, nodeIdx) {
  // Node boost values from GemPlanner.vue
  const boostValues = {
    temporal: [1.2, 1.5, 1.3],
    innovation: [1.3, 1.4, 1.2],
    attraction: [1.4, 1.6, 1.5],
    power: [1.7, 1.4, 1.3],
    creation: [1.8, 1.6, 1.5]
  };
  
  return boostValues[gemId]?.[nodeIdx] || 1;
}

function getGemTextClass(gemId) {
  switch (gemId) {
    case 'exodus': return 'text-purple-400';
    case 'temporal': return 'text-pink-400';
    case 'innovation': return 'text-yellow-400';
    case 'attraction': return 'text-blue-400';
    case 'power': return 'text-purple-400';
    case 'creation': return 'text-red-400';
    default: return 'text-gray-400';
  }
}

function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 't';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'b';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'm';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'k';
  return num.toLocaleString();
}

function formatMultiplier(num) {
  return num.toFixed(2);
}

function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
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
</style>