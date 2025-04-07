<template>
  <div v-if="isVisible" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-gray-900/80 transition-opacity backdrop-blur-sm" @click="$emit('close')"></div>
    
    <div 
      class="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-auto relative transform transition-all max-h-[85vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-900 to-gray-800 p-3 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
        <h2 class="text-base font-bold text-white flex items-center">
          <IconCalculator size="18" class="mr-2" />
          Orb Calculator
        </h2>
        <button 
          @click="$emit('close')" 
          class="rounded-full p-1 hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>
      
      <!-- Description -->
      <div class="p-2 bg-gray-750/60 border-b border-gray-700">
        <p class="text-xs text-gray-300">
          Calculate potential Orb gains by adjusting your boost levels. Only boosts that affect Orb gains are shown.
          Maxed stats are included in all calculations.
        </p>
      </div>
      
      <!-- Content Area -->
      <div v-if="error" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ error }}</p>
      </div>
      
      <div v-else>
        <!-- Empty state message -->
        <div v-if="filteredBoosts.length === 0" class="py-4 text-center text-gray-400 text-sm">
          <p>No adjustable boosts available</p>
        </div>
        
        <!-- Boost List -->
        <div v-else class="px-3 py-2">
          <div class="grid grid-cols-1 gap-2">
            <div 
              v-for="boost in filteredBoosts" 
              :key="boost.key" 
              class="bg-gray-750/60 rounded-md p-2 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <!-- Boost Header -->
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-medium text-gray-300 flex items-center">
                  {{ boost.label }}
                  <span 
                    v-if="boost.max !== undefined"
                    class="ml-1.5 text-xs px-1.5 py-0.5 rounded bg-gray-600/80 text-gray-400 font-medium"
                  >
                    Max: {{ boost.max }}
                  </span>
                </span>
              </div>
              
              <!-- Controls Row -->
              <div class="flex items-center justify-between">
                <div class="flex space-x-2 w-3/5 items-center">
                  <!-- Current Control -->
                  <template v-if="boost.type === 'number'">
                    <div class="w-[95px]">
                      <TRValueControls
                        :value="currentStats[boost.key] || 0"
                        :minValue="0"
                        :maxValue="boost.max || 999999"
                        :showFastControls="true"
                        :step="1"
                        :valueClass="'text-white'"
                        :smallControls="true"
                        @update:value="(val) => updateCurrentLevel(boost.key, val)"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <button 
                      @click="toggleCurrentBoolean(boost.key)"
                      class="px-2 py-0.5 text-[10px] rounded-sm"
                      :class="currentStats[boost.key] ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-green-800/50 text-white'"
                    >
                      {{ currentStats[boost.key] ? 'ON' : 'OFF' }}
                    </button>
                  </template>
                  
                  <!-- Target Control -->
                  <template v-if="boost.type === 'number'">
                    <div class="w-[95px]">
                      <TRValueControls
                        :value="targetStats[boost.key] || 0"
                        :minValue="currentStats[boost.key] || 0"
                        :maxValue="boost.max || 999999"
                        :showFastControls="true"
                        :step="1"
                        :valueClass="'text-white'"
                        :smallControls="true"
                        @update:value="(val) => updateTargetLevel(boost.key, val)"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <button 
                      @click="toggleTargetBoolean(boost.key)"
                      class="px-2 py-0.5 text-[10px] rounded-sm"
                      :class="targetStats[boost.key] ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-green-800/50 text-white'"
                    >
                      {{ targetStats[boost.key] ? 'ON' : 'OFF' }}
                    </button>
                  </template>
                </div>
                
                <!-- Multipliers -->
                <div class="flex space-x-2 items-center justify-end w-2/5">
                  <div class="text-[10px] text-blue-400">
                    <span class="bg-gray-700/70 px-1.5 py-0.5 rounded inline-block">
                      {{ formatMultiplier(getCurrentMultiplier(boost)) }}
                    </span>
                  </div>
                  <IconArrowRight size="12" class="text-gray-500" />
                  <div class="text-[10px] text-blue-400">
                    <span class="bg-gray-700/70 px-1.5 py-0.5 rounded inline-block">
                      {{ formatMultiplier(getTargetMultiplier(boost)) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Results Panel (Sticky Bottom) -->
        <div class="p-2.5 border-t border-gray-700 sticky bottom-0 bg-gray-800 z-10">
          <div class="grid grid-cols-2 gap-3">
            <!-- Current Stats Results -->
            <div class="bg-gray-750/80 rounded-lg p-2 border border-gray-700">
              <div class="text-xs text-gray-400 font-medium mb-1">Current Orb Gains</div>
              <div class="flex items-center justify-center">
                <span class="text-base font-bold text-green-400">{{ formatNumber(currentOrbGains) }}</span>
              </div>
            </div>
            
            <!-- Target Stats Results -->
            <div class="bg-gray-750/80 rounded-lg p-2 border border-blue-800">
              <div class="text-xs text-blue-300 font-medium mb-1">Target Orb Gains</div>
              <div class="flex items-center justify-center">
                <span class="text-base font-bold text-green-400">{{ formatNumber(targetOrbGains) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Improvement Summary -->
          <div v-if="targetOrbGains > currentOrbGains" class="mt-2 bg-blue-900/20 rounded-lg p-2 border border-blue-900">
            <div class="flex justify-between items-center">
              <span class="text-xs text-blue-200 font-medium">Improvement</span>
              <span class="text-sm font-bold text-blue-300">
                +{{ formatNumber(targetOrbGains - currentOrbGains) }} 
                <span class="text-xs">({{ improvementPercentage }})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 flex justify-end">
        <button 
          @click="$emit('close')"
          class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { allBoosts } from '@/constants/tr-planner';
import TRValueControls from '@/composables/TRValueControls.vue';
import { formatMultiplier, formatNumber, formatGrowth } from '@/composables/format';
import { calculateOrbGains } from '@/composables/calculations';
import { 
  IconX, 
  IconCalculator,
  IconArrowRight,
  IconAlertCircle 
} from '@tabler/icons-vue';
import { useTRPlannerStore } from '@/store/orbStore';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentStats: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close']);

// Store
const trPlannerStore = useTRPlannerStore();

// State
const error = ref(null);
const currentStats = ref({...props.currentStats});
const targetStats = ref({...props.currentStats});

// Computed: Gefilterte Boosts mit orbcalc property
const filteredBoosts = computed(() => {
  // Nur Boosts mit orbcalc zeigen, aber Boosts ausblenden, die
  // im StatsInputModal auf max Level gesetzt wurden
  return allBoosts.filter(boost => {
    // Nur Boosts mit orbcalc zeigen
    if (!boost.orbcalc) return false;
    
    // Prüfen ob der Boost im StatsInputModal maxiert wurde
    if (trPlannerStore.maxedStats) {
      // BOOLEAN BOOSTS
      if (boost.type === 'boolean') {
        // Wenn der Boost auf true gesetzt ist, ausblenden
        if (trPlannerStore.maxedStats[boost.key] === true) {
          return false;
        }
      }
      
      // NUMERIC BOOSTS
      if (boost.type === 'number') {
        // Wenn der Boost im maxedStats existiert und max hat UND den maximalwert erreicht hat
        if (boost.max !== undefined && 
            trPlannerStore.maxedStats[boost.key] !== undefined && 
            trPlannerStore.maxedStats[boost.key] >= boost.max) {
          return false;
        }
      }
    }
    
    return true;
  });
});

// Computed: Current Orb Gains
const currentOrbGains = computed(() => {
  const orbCalcBoosts = allBoosts.filter(b => b.orbcalc);
  return calculateOrbGains(
    { ...currentStats.value, ...trPlannerStore.maxedStats },
    { ...currentStats.value, ...trPlannerStore.maxedStats },
    orbCalcBoosts
  );
});

// Computed: Target Orb Gains
const targetOrbGains = computed(() => {
  const orbCalcBoosts = allBoosts.filter(b => b.orbcalc);
  return calculateOrbGains(
    { ...currentStats.value, ...trPlannerStore.maxedStats },
    { ...targetStats.value, ...trPlannerStore.maxedStats },
    orbCalcBoosts
  );
});

// Computed: Improvement Percentage
const improvementPercentage = computed(() => {
  if (!currentOrbGains.value) return '+0%';
  
  const improvement = ((targetOrbGains.value - currentOrbGains.value) / currentOrbGains.value) * 100;
  return formatGrowth(improvement / 100, true);
});

// Methods
function updateCurrentLevel(key, newValue) {
  const boost = allBoosts.find(b => b.key === key);
  if (!boost) return;
  
  // Min/Max Validation
  const minValue = 0;
  const maxValue = boost.max !== undefined ? boost.max : Infinity;
  
  const validValue = Math.max(Math.min(Math.floor(newValue), maxValue), minValue);
  currentStats.value[key] = validValue;
  
  // Wenn Target < Current, Target auf Current setzen
  if ((targetStats.value[key] || 0) < validValue) {
    targetStats.value[key] = validValue;
  }
}

function updateTargetLevel(key, newValue) {
  const boost = allBoosts.find(b => b.key === key);
  if (!boost) return;
  
  // Min/Max Validation
  const minValue = currentStats.value[key] || 0;
  const maxValue = boost.max !== undefined ? boost.max : Infinity;
  
  const validValue = Math.max(Math.min(Math.floor(newValue), maxValue), minValue);
  targetStats.value[key] = validValue;
}

function toggleCurrentBoolean(key) {
  const newValue = !currentStats.value[key];
  currentStats.value[key] = newValue;
  
  // Wenn Current false wird, auch Target auf false setzen
  if (!newValue) {
    targetStats.value[key] = false;
  }
}

function toggleTargetBoolean(key) {
  // Target kann immer togglen, unabhängig vom Current Status
  targetStats.value[key] = !targetStats.value[key];
  
  // Wenn Target true wird und Current false ist, auch Current auf true setzen
  if (targetStats.value[key] && !currentStats.value[key]) {
    currentStats.value[key] = true;
  }
}

function getCurrentMultiplier(boost) {
  if (!boost || boost.multiplier === undefined) return 1;
  
  const currentLevel = currentStats.value[boost.key] || 0;
  
  // Boolean boost
  if (boost.type === 'boolean') {
    const isActive = !!currentStats.value[boost.key];
    
    if (typeof boost.multiplier === 'number') {
      return isActive ? boost.multiplier : 1;
    } else if (typeof boost.multiplier === 'function') {
      try {
        return isActive ? boost.multiplier(1, { ...currentStats.value, ...trPlannerStore.maxedStats }) : 1;
      } catch (e) {
        console.error(`Error calculating multiplier for ${boost.key}:`, e);
        return 1;
      }
    }
  }
  
  // Numeric boost
  if (typeof boost.multiplier === 'number') {
    return boost.multiplier;
  } else if (typeof boost.multiplier === 'function') {
    try {
      return boost.multiplier(currentLevel, { ...currentStats.value, ...trPlannerStore.maxedStats });
    } catch (e) {
      console.error(`Error calculating multiplier for ${boost.key}:`, e);
      return 1;
    }
  }
  
  return 1;
}

function getTargetMultiplier(boost) {
  if (!boost || boost.multiplier === undefined) return 1;
  
  const targetLevel = targetStats.value[boost.key] || 0;
  
  // Boolean boost
  if (boost.type === 'boolean') {
    const isActive = !!targetStats.value[boost.key];
    
    if (typeof boost.multiplier === 'number') {
      return isActive ? boost.multiplier : 1;
    } else if (typeof boost.multiplier === 'function') {
      try {
        return isActive ? boost.multiplier(1, { ...targetStats.value, ...trPlannerStore.maxedStats }) : 1;
      } catch (e) {
        console.error(`Error calculating multiplier for ${boost.key}:`, e);
        return 1;
      }
    }
  }
  
  // Numeric boost
  if (typeof boost.multiplier === 'number') {
    return boost.multiplier;
  } else if (typeof boost.multiplier === 'function') {
    try {
      return boost.multiplier(targetLevel, { ...targetStats.value, ...trPlannerStore.maxedStats });
    } catch (e) {
      console.error(`Error calculating multiplier for ${boost.key}:`, e);
      return 1;
    }
  }
  
  return 1;
}

// Initialize
function initData() {
  try {
    error.value = null;
    currentStats.value = {...props.currentStats};
    targetStats.value = {...props.currentStats};
  } catch (err) {
    console.error('Error initializing calculator:', err);
    error.value = `Failed to initialize: ${err.message}`;
  }
}

// Watch for visibility change
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    initData();
  }
});

// Watch for currentStats changes
watch(() => props.currentStats, (newValue) => {
  if (props.isVisible) {
    currentStats.value = {...newValue};
    targetStats.value = {...newValue};
  }
}, { deep: true });

// Initialize on mount
onMounted(() => {
  if (props.isVisible) {
    initData();
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s ease-in-out;
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

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

:deep(.tr-controls) {
  min-height: auto !important;
}

:deep(.tr-controls .value-container) {
  min-width: 32px !important;
}
</style>