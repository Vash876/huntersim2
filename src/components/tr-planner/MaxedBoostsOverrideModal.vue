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
            <span class="text-blue-400">Maxed Boosts Overrides</span>
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
        <p class="text-gray-400 text-sm">Loading boost data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ loadError }}</p>
        <button 
          @click="loadBoostData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Retry
        </button>
      </div>

      <!-- Boost Categories -->
      <div v-else class="p-3">
        <div v-for="(category, index) in boostCategories" :key="index" class="mb-3">
          <!-- Category Header -->
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
          </div>
          
          <!-- Parameter Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div 
              v-for="param in category.params" 
              :key="param.key" 
              class="bg-gray-750/60 rounded-md p-1.5 bg-gray-700/60 transition-colors border border-transparent hover:border-gray-600"
            >
              <!-- Parameter Name -->
              <div class="flex justify-between items-center mb-1">
                <div class="flex-1 mr-2">
                  <span class="text-xs font-medium text-gray-300">{{ truncateName(param.name) }}</span>
                </div>
                
                <!-- Max Value Badge -->
                <span 
                  v-if="param.maxValue !== null && param.maxValue !== Infinity" 
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
                  <div class="text-xs px-1.5 py-0.5 rounded"
                       :class="param.globalValue ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'"
                  >
                    {{ param.globalValue ? 'MAXED' : 'NOT MAXED' }}
                  </div>
                </div>
                
                <!-- Override Controls -->
                <div class="flex gap-1">
                  <!-- Override Button: Shows opposite of global value, becomes active when override is set -->
                  <button 
                    @click="toggleMaxedOverride(param.key, !param.globalValue)"
                    class="text-xs px-2 py-0.5 rounded"
                    :class="getOverrideButtonClass(param)"
                  >
                    {{ !param.globalValue ? 'MAXED' : 'NOT MAXED' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="boostCategories.length === 0" class="py-4 text-center text-gray-400 text-sm">
          No boost data available
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { IconX, IconAlertCircle } from '@tabler/icons-vue';
import { allBoosts, boostsByCategory } from '@/constants/tr-planner';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  maxedBoostsOverrides: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'update:maxedBoostsOverrides']);

// Local state
const isLoading = ref(true);
const loadError = ref(null);
const localOverrides = ref({});
const boostCategories = ref([]);

// Initialize boost data with GemOverrideModal structure
async function loadBoostData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Create categories like GemOverrideModal
    const categories = [];
    
    boostsByCategory.forEach(category => {
      const categoryParams = [];
      
      // Include both numeric boosts (with max property) and boolean boosts
      category.boosts.forEach(boost => {
        if (boost.max !== undefined || boost.type === 'boolean') {
          categoryParams.push({
            key: boost.key,
            name: boost.label,
            globalValue: getGlobalMaxedState(boost.key),
            maxValue: boost.max || null, // null for boolean boosts
            type: boost.type || 'number'
          });
        }
      });
      
      if (categoryParams.length > 0) {
        categories.push({
          label: category.label,
          params: categoryParams
        });
      }
    });
    
    boostCategories.value = categories;
    
    // Initialize local overrides
    initLocalOverrides();
    
    isLoading.value = false;
    
  } catch (error) {
    console.error('Error loading boost data:', error);
    loadError.value = `Failed to load boost data: ${error.message}`;
    isLoading.value = false;
  }
}

// Get global maxed state from localStorage
function getGlobalMaxedState(boostKey) {
  try {
    const userStats = JSON.parse(localStorage.getItem('trplanner_userstats') || '{}');
    
    if (userStats._orbCalcMaxedBoosts && userStats._orbCalcMaxedBoosts[boostKey] !== undefined) {
      return userStats._orbCalcMaxedBoosts[boostKey];
    }
    
    return false;
  } catch (error) {
    console.error('Error loading global maxed state:', error);
    return false;
  }
}

// Initialize local overrides with current values - same as GemOverrideModal
function initLocalOverrides() {
  const newOverrides = {};
  
  // Flatten all parameters
  const allParams = boostCategories.value.flatMap(category => 
    category.params.map(param => param.key)
  );
  
  // Initialize with null (= no override)
  allParams.forEach(param => {
    if (props.maxedBoostsOverrides && props.maxedBoostsOverrides[param] !== undefined) {
      newOverrides[param] = props.maxedBoostsOverrides[param];
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
    // Global is NOT MAXED, override button shows MAXED and should be green when active
    return 'bg-green-700 text-green-100';
  } else {
    // Global is MAXED, override button shows NOT MAXED and should be red when active
    return 'bg-red-700 text-red-100';
  }
}

// Toggle maxed state - updated logic like GemOverrideModal
function toggleMaxedOverride(param, value) {
  // Find the parameter data to get the global value
  const paramData = boostCategories.value
    .flatMap(category => category.params)
    .find(p => p.key === param);
  
  if (!paramData) return;
  
  const currentOverride = localOverrides.value[param];
  const targetValue = value ? true : false;
  
  // If we already have this override value, remove the override
  if (currentOverride === targetValue) {
    localOverrides.value[param] = null;
  } else {
    // Set the override to the target value
    localOverrides.value[param] = targetValue;
  }
  
  emitUpdate();
}

// Helper function to truncate names - same as GemOverrideModal
function truncateName(name) {
  if (!name) return '';
  return name.length > 22 ? name.substring(0, 22) + '...' : name;
}

function resetAllOverrides() {
  Object.keys(localOverrides.value).forEach(param => {
    localOverrides.value[param] = null;
  });
  emitUpdate();
}

function emitUpdate() {
  // Filter out null values like GemOverrideModal
  const overridesToSave = {};
  
  for (const [param, value] of Object.entries(localOverrides.value)) {
    // Skip null values
    if (value === null) continue;
    
    // Find the parameter data to get the global value
    const paramData = boostCategories.value
      .flatMap(category => category.params)
      .find(p => p.key === param);
    
    // If parameter data is not found or the override equals global value, skip it
    if (!paramData || value === paramData.globalValue) {
      continue;
    }
    
    // Only save values that differ from global
    overridesToSave[param] = value;
  }
  
  emit('update:maxedBoostsOverrides', overridesToSave);
}

function close() {
  emit('close');
}

// Initialize when modal opens
watch(() => props.isVisible, (isVisible) => {
  if (isVisible) {
    loadBoostData();
  }
});

// Watch for prop changes
watch(() => props.maxedBoostsOverrides, () => {
  if (props.isVisible && !isLoading.value) {
    initLocalOverrides();
  }
});

onMounted(() => {
  if (props.isVisible) {
    loadBoostData();
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
