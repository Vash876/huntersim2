<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="close"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h3 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-purple-400">Gem Overrides</span>
          </h3>
          <button 
            @click="close"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="16" />
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="p-6 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
        <p class="text-gray-400 text-sm">Loading gem data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ loadError }}</p>
        <button 
          @click="loadGemData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Retry
        </button>
      </div>

      <!-- Gem Categories -->
      <div v-else class="p-3">
        <div v-for="(category, index) in gemCategories" :key="index" class="mb-3">
          <!-- Category Header -->
          <div class="flex items-center mb-1.5">
            <div 
              class="w-1.5 h-5 rounded-r mr-2"
              :style="{ backgroundColor: getGemColorForCategory(category.label) }"
            ></div>
            <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
          </div>
          
          <!-- Parameter Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div 
              v-for="param in category.params" 
              :key="param.key" 
              class="bg-gray-750/60 rounded-md p-1.5 bg-gray-700/60 transition-colors border border-transparent hover:border-gray-600"
            >
              <!-- Parameter Name mit Description -->
              <div class="flex justify-between items-center mb-1">
                <div class="flex-1 mr-2">
                  <span class="text-xs font-medium text-gray-300">{{ truncateName(param.name) }}</span>
                </div>
                
                <!-- Max Value Badge -->
                <span 
                  v-if="param.maxValue !== null && param.maxValue !== Infinity && param.type !== 'boolean'" 
                  class="text-[10px] bg-gray-700 text-gray-400 px-1 py-0.5 rounded flex-shrink-0"
                >
                  max: {{ param.maxValue }}
                </span>
              </div>
              
              <!-- Controls -->
              <div class="flex items-center justify-between">
                <!-- Global Value Badge -->
                <div class="flex items-center">
                  <div class="text-[10px] mr-2 text-gray-400 uppercase">global</div>
                  
                  <!-- Boolean Global Value -->
                  <div v-if="param.type === 'boolean'" 
                       class="text-xs px-1.5 py-0.5 rounded"
                       :class="param.globalValue ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'"
                  >
                    {{ param.globalValue ? 'ON' : 'OFF' }}
                  </div>
                  
                  <!-- Numeric Global Value -->
                  <div v-else class="text-xs text-gray-300">
                    {{ param.globalValue }}
                  </div>
                </div>
                
                <!-- Boolean Type Controls -->
                <div v-if="param.type === 'boolean'" class="flex gap-1">
                  <!-- Override Button: Shows opposite of global value, becomes active when override is set -->
                  <button 
                    @click="toggleBooleanOverride(param.key, !param.globalValue)"
                    class="text-xs px-2 py-0.5 rounded"
                    :class="getOverrideButtonClass(param)"
                  >
                    {{ !param.globalValue ? 'ON' : 'OFF' }}
                  </button>
                </div>
                
                <!-- Numeric Type Controls -->
                <div v-else class="flex items-center">
                  <ToolValueControls
                    :value="localOverrides[param.key] === null ? param.globalValue : localOverrides[param.key]"
                    :minValue="0"
                    :maxValue="param.maxValue || 999"
                    :step="1"
                    :globalValue="param.globalValue"
                    :showFastControls="false"
                    @update:value="(newVal) => updateOverrideValue(param.key, newVal, param)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="gemCategories.length === 0" class="py-4 text-center text-gray-400 text-sm">
          No gem data available
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { IconX, IconAlertCircle } from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { getAllGemData } from '@/constants/tr-planner/gems.js';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  gemOverrides: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'update:gemOverrides']);

// Local state
const isLoading = ref(true);
const loadError = ref(null);
const localOverrides = ref({});
const gemCategories = ref([]);

// Initialize gems data with OverrideModal structure
async function loadGemData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    const allGemData = getAllGemData();
    
    // Create categories like OverrideModal
    const categories = [];
    
    allGemData.forEach(gem => {
      if (!gem || !gem.id) return;
      
      const categoryParams = [];
      
      // Add gem level parameter
      categoryParams.push({
        key: `${gem.id}Level`,
        name: `${gem.name} Level`,
        globalValue: getGlobalGemLevel(gem.id),
        maxValue: gem.maxLevel || 4,
        type: 'numeric'
      });
      
      // Add gem node parameters
      if (gem.nodes && Array.isArray(gem.nodes)) {
        gem.nodes.forEach((node, nodeIndex) => {
          const nodeKey = `${gem.id}Node${nodeIndex}`;
          categoryParams.push({
            key: nodeKey,
            name: `${gem.name} Node #${nodeIndex + 1}`,
            globalValue: getGlobalNodeState(gem.id, nodeIndex),
            maxValue: null,
            type: 'boolean'
          });
        });
      }
      
      if (categoryParams.length > 0) {
        categories.push({
          label: `${gem.name} Gem`,
          params: categoryParams,
          gemColor: gem.color // Store gem color for category header
        });
      }
    });
    
    gemCategories.value = categories;
    
    // Initialize local overrides
    initLocalOverrides();
    
    isLoading.value = false;
    
  } catch (error) {
    console.error('Error loading gem data:', error);
    loadError.value = `Failed to load gem data: ${error.message}`;
    isLoading.value = false;
  }
}

// Get global gem level from localStorage like TR Planner stores it
function getGlobalGemLevel(gemId) {
  try {
    const userStats = JSON.parse(localStorage.getItem('trplanner_userstats') || '{}');
    
    if (userStats.gemData && userStats.gemData.levels && userStats.gemData.levels[gemId] !== undefined) {
      return userStats.gemData.levels[gemId];
    }
    
    return 0;
  } catch (error) {
    console.error('Error loading global gem level:', error);
    return 0;
  }
}

// Get global node state from localStorage
function getGlobalNodeState(gemId, nodeIndex) {
  try {
    const userStats = JSON.parse(localStorage.getItem('trplanner_userstats') || '{}');
    
    if (userStats.gemData && userStats.gemData.activeNodes && userStats.gemData.activeNodes[gemId]) {
      return userStats.gemData.activeNodes[gemId].includes(nodeIndex);
    }
    
    return false;
  } catch (error) {
    console.error('Error loading global node state:', error);
    return false;
  }
}

// Initialize local overrides with current values - same as OverrideModal
function initLocalOverrides() {
  const newOverrides = {};
  
  // Flatten all parameters
  const allParams = gemCategories.value.flatMap(category => 
    category.params.map(param => param.key)
  );
  
  // Initialize with null (= no override)
  allParams.forEach(param => {
    if (props.gemOverrides && props.gemOverrides[param] !== undefined) {
      newOverrides[param] = props.gemOverrides[param];
    } else {
      newOverrides[param] = null;
    }
  });
  
  localOverrides.value = newOverrides;
}

// Computed for active override count
const activeOverrideCount = computed(() => {
  return Object.values(localOverrides.value).filter(val => val !== null).length;
});

// Same as OverrideModal updateOverrideValue
function updateOverrideValue(paramKey, newValue, param) {
  const globalValue = param.globalValue;
  
  // Round value for integers
  newValue = Math.floor(newValue);
  
  // If new value equals global value, remove override
  if (Math.floor(newValue) === Math.floor(globalValue)) {
    localOverrides.value[paramKey] = null;
  } else {
    localOverrides.value[paramKey] = newValue;
  }
  
  // Limit to max value
  if (localOverrides.value[paramKey] !== null && param.maxValue !== null && param.maxValue !== Infinity && localOverrides.value[paramKey] > param.maxValue) {
    localOverrides.value[paramKey] = param.maxValue;
  }
  
  // Ensure value is not below 0
  if (localOverrides.value[paramKey] !== null && localOverrides.value[paramKey] < 0) {
    localOverrides.value[paramKey] = 0;
  }
  
  emitUpdate();
}

// Get the CSS class for the override button based on global value and override state
function getOverrideButtonClass(param) {
  const hasOverride = localOverrides.value[param.key] !== null;
  const globalValue = param.globalValue;
  
  if (!hasOverride) {
    // No override set - button is gray
    return 'bg-gray-700 hover:bg-gray-600 text-white';
  }
  
  // Override is set
  if (!globalValue) {
    // Global is OFF, override button shows ON and should be green when active
    return 'bg-green-700 text-green-100';
  } else {
    // Global is ON, override button shows OFF and should be red when active
    return 'bg-red-700 text-red-100';
  }
}

// Toggle boolean parameters - updated logic
function toggleBooleanOverride(param, value) {
  // Find the parameter data to get the global value
  const paramData = gemCategories.value
    .flatMap(category => category.params)
    .find(p => p.key === param);
  
  if (!paramData) return;
  
  const currentOverride = localOverrides.value[param];
  const targetValue = value ? 1 : 0;
  
  // If we already have this override value, remove the override
  if (currentOverride === targetValue) {
    localOverrides.value[param] = null;
  } else {
    // Set the override to the target value
    localOverrides.value[param] = targetValue;
  }
  
  emitUpdate();
}

// Get current boolean value (either override or global)
function getCurrentBooleanValue(param) {
  if (localOverrides.value[param.key] !== null) {
    return localOverrides.value[param.key] === 1 || localOverrides.value[param.key] === true;
  }
  return param.globalValue === 1 || param.globalValue === true;
}

// Same color logic as OverrideModal
function getValueColorClass(paramKey, globalValue) {
  const overrideValue = localOverrides.value[paramKey];
  
  // If no override set, neutral color
  if (overrideValue === null) {
    return 'text-gray-500';
  }
  
  // If override value is greater than global value
  if (overrideValue > globalValue) {
    return 'text-green-400';
  }
  
  // If override value is less than global value
  if (overrideValue < globalValue) {
    return 'text-red-400';
  }
  
  // If values are equal
  return 'text-white';
}

// Helper function to truncate names - same as OverrideModal
function truncateName(name) {
  if (!name) return '';
  return name.length > 22 ? name.substring(0, 22) + '...' : name;
}

// Get gem color for category header
function getGemColorForCategory(categoryLabel) {
  const category = gemCategories.value.find(cat => cat.label === categoryLabel);
  if (category && category.gemColor) {
    return getGemColor(category.gemColor);
  }
  return '#3b82f6'; // Default blue fallback
}

// Color functions for gems
function getGemColor(colorName) {
  const colorMap = {
    'red': '#dc2626',
    'lime': '#65a30d', 
    'cyan': '#0891b2',
    'purple': '#9333ea',
    'orange': '#ea580c',
    'green': '#16a34a',
    'pink': '#db2777'
  };
  return colorMap[colorName] || '#6b7280';
}

function resetAllOverrides() {
  Object.keys(localOverrides.value).forEach(param => {
    localOverrides.value[param] = null;
  });
  emitUpdate();
}

function emitUpdate() {
  // Filter out null values like OverrideModal
  const overridesToSave = {};
  
  for (const [param, value] of Object.entries(localOverrides.value)) {
    // Skip null values
    if (value === null) continue;
    
    // Find the parameter data to get the global value
    const paramData = gemCategories.value
      .flatMap(category => category.params)
      .find(p => p.key === param);
    
    // If parameter data is not found or the override equals global value, skip it
    if (!paramData || Math.floor(value) === Math.floor(paramData.globalValue)) {
      continue;
    }
    
    // Only save values that differ from global
    overridesToSave[param] = value;
  }
  
  emit('update:gemOverrides', overridesToSave);
}

function close() {
  emit('close');
}

// Initialize when modal opens
watch(() => props.isVisible, (isVisible) => {
  if (isVisible) {
    loadGemData();
  }
});

// Watch for prop changes
watch(() => props.gemOverrides, () => {
  if (props.isVisible && !isLoading.value) {
    initLocalOverrides();
  }
});

onMounted(() => {
  if (props.isVisible) {
    loadGemData();
  }
});
</script>

<style scoped>
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

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}
</style>
