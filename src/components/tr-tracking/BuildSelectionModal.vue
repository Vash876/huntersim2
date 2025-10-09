<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold text-white flex items-center">
            <IconChartLine size="16" class="mr-2 text-blue-400" />
            Hunter Build Selection
          </h3>
        </div>
        <button
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>

      <!-- Description -->
      <div class="px-3 py-2 border-b border-gray-700">
        <p class="text-xs text-gray-300">Select builds for automatic mat3 tracking</p>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-4">
        <!-- Hunter Build Selection Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="hunter in availableHunters" 
            :key="hunter.id"
            class="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50"
          >
            <!-- Hunter Header -->
            <div class="flex items-center mb-3">
              <img 
                :src="hunter.image" 
                :alt="hunter.name"
                class="w-8 h-8 mr-3"
              />
              <div class="flex-1">
                <h4 class="font-medium text-white">{{ hunter.name }}</h4>
                <p class="text-xs text-gray-400">{{ getHunterMat3Name(hunter.id) }} Production</p>
              </div>
              <!-- Hunter Toggle -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-400">Track:</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    :checked="enabledHunters[hunter.id] || false"
                    @change="toggleHunterTracking(hunter.id, $event.target.checked)"
                    class="sr-only peer"
                  />
                  <div class="relative w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            <!-- Build Selection -->
            <div class="space-y-2" :class="{ 'opacity-50 pointer-events-none': !enabledHunters[hunter.id] }">
              <label class="text-xs text-gray-300">Build:</label>
              <select 
                :value="selectedBuilds[hunter.id] || ''"
                @change="updateSelectedBuild(hunter.id, $event.target.value)"
                :disabled="!enabledHunters[hunter.id]"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">No build selected</option>
                <option 
                  v-for="build in getBuildsForHunter(hunter.id)" 
                  :key="build.id" 
                  :value="build.id"
                >
                  {{ build.name }}
                </option>
              </select>
            </div>

            <!-- Mat3 Production Display -->
            <div class="mt-3 p-2 bg-gray-800/50 rounded border border-gray-700/50" :class="{ 'opacity-50': !enabledHunters[hunter.id] }">
              <div class="text-xs text-gray-400 mb-1">Daily {{ getHunterMat3Name(hunter.id) }} Production:</div>
              <div class="text-sm font-bold" :class="getHunterTextColor(hunter.color)">
                {{ enabledHunters[hunter.id] ? formatNumber(getDailyMat3Production(hunter.id)) : '-' }}
              </div>
              
              <!-- Loading/Error States -->
              <div v-if="enabledHunters[hunter.id] && loadingStates[hunter.id]" class="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                <div class="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
              <div v-else-if="!enabledHunters[hunter.id]" class="text-xs text-gray-500 mt-1">
                Hunter tracking disabled
              </div>
              <div v-else-if="!selectedBuilds[hunter.id]" class="text-xs text-gray-500 mt-1">
                Select a build to calculate
              </div>
              <div v-else-if="!cachedResults[hunter.id]" class="text-xs text-orange-400 mt-1">
                No evaluation data found
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between pt-2 border-t border-gray-700 px-3 pb-3">
        <button
          @click="resetAllBuilds"
          class="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <IconRotateClockwise size="12" />
          Reset All
        </button>
        
        <button
          @click="closeModal"
          class="px-3 py-1.5 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-xs"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { IconChartLine, IconX, IconRotateClockwise } from '@tabler/icons-vue';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { shouldEvaluate } from '@/services/evaluationCacheService';
import { formatNumber } from '@/composables/format';
import { HUNTERS, getHunterById } from '@/constants/hunters';

// Import hunter-specific constants for Mat3 names
import * as borgeConstants from '@/constants/borge';
import * as ozzyConstants from '@/constants/ozzy';
import * as knoxConstants from '@/constants/knox';

// Props
const props = defineProps({
  show: Boolean,
  initialSelectedBuilds: {
    type: Object,
    default: () => ({})
  },
  initialEnabledHunters: {
    type: Object,
    default: () => ({})
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// Stores
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// State
const selectedBuilds = ref({ ...props.initialSelectedBuilds });
const cachedResults = ref({});
const loadingStates = ref({});
const enabledHunters = ref({}); // New state for hunter tracking toggle

// Computed
const availableHunters = computed(() => HUNTERS);

const selectedBuildCount = computed(() => {
  return Object.values(selectedBuilds.value).filter(buildId => buildId).length;
});

// Methods
function getBuildsForHunter(hunterId) {
  return hunterStore.getBuildsForHunter(hunterId).filter(build => !build.isArchived);
}

function getHunterTextColor(color) {
  const colorMap = {
    red: 'text-red-400',
    green: 'text-green-400', 
    blue: 'text-blue-400'
  };
  return colorMap[color] || 'text-gray-400';
}

function getHunterMat3Name(hunterId) {
  // VOLLAUTOMATISCH - Get Mat3 name using static imports
  const hunterConstantsMap = {
    'borge': borgeConstants,
    'ozzy': ozzyConstants,
    'knox': knoxConstants
  };
  
  const constants = hunterConstantsMap[hunterId];
  if (!constants) {
    console.warn(`No constants found for hunter: ${hunterId}`);
    return 'Mat3';
  }
  
  try {
    const { CURRENCY_LABELS_SHORT, CURRENCY_TYPES } = constants;
    
    console.log(`[DEBUG] Loading Mat3 name for ${hunterId}:`, { CURRENCY_LABELS_SHORT, CURRENCY_TYPES });
    
    // Get Mat3 currency type (mat3 is always the third material)
    const mat3CurrencyKey = Object.keys(CURRENCY_TYPES).find(key => CURRENCY_TYPES[key] === 'mat3');
    console.log(`[DEBUG] Found mat3 currency key for ${hunterId}:`, mat3CurrencyKey);
    
    if (mat3CurrencyKey && CURRENCY_LABELS_SHORT) {
      const mat3Name = CURRENCY_LABELS_SHORT[CURRENCY_TYPES[mat3CurrencyKey]];
      console.log(`[DEBUG] Final Mat3 name for ${hunterId}:`, mat3Name);
      return mat3Name || 'Mat3';
    }
  } catch (error) {
    console.warn(`Could not load Mat3 name for ${hunterId}, using fallback:`, error);
  }
  
  return 'Mat3';
}

function getDailyMat3Production(hunterId) {
  const selectedBuildId = selectedBuilds.value[hunterId];
  if (!selectedBuildId) return 0;
  
  const result = cachedResults.value[hunterId];
  if (!result) return 0;
  
  const mat3PerRun = result.mat3 || 0;
  const avgRunTimeMinutes = result.avgTime || 120;
  const runsPerDay = 1440 / avgRunTimeMinutes;
  
  return Math.floor(mat3PerRun * runsPerDay);
}

function toggleHunterTracking(hunterId, enabled) {
  enabledHunters.value[hunterId] = enabled;
  
  // If disabling, clear the selected build and results
  if (!enabled) {
    delete selectedBuilds.value[hunterId];
    delete cachedResults.value[hunterId];
    delete loadingStates.value[hunterId];
  }
}

function updateSelectedBuild(hunterId, buildId) {
  // Only allow updates if hunter tracking is enabled
  if (!enabledHunters.value[hunterId]) return;
  
  if (buildId) {
    selectedBuilds.value[hunterId] = buildId;
    loadCachedResultForHunter(hunterId, buildId);
  } else {
    delete selectedBuilds.value[hunterId];
    delete cachedResults.value[hunterId];
  }
}

async function loadCachedResultForHunter(hunterId, buildId) {
  try {
    loadingStates.value[hunterId] = true;
    
    const build = hunterStore.getBuildsForHunter(hunterId).find(b => String(b.id) === String(buildId));
    if (!build) return;

    const cache = await shouldEvaluate({
      hunterId,
      buildData: build,
      hunterStore,
      gemPlannerStore
    });
    
    if (cache?.cachedResult) {
      cachedResults.value[hunterId] = cache.cachedResult;
    }
  } catch (error) {
    console.error(`[BuildSelectionModal] Error loading cached results for ${hunterId}:`, error);
  } finally {
    loadingStates.value[hunterId] = false;
  }
}

async function loadAllCachedResults() {
  for (const [hunterId, buildId] of Object.entries(selectedBuilds.value)) {
    if (buildId) {
      await loadCachedResultForHunter(hunterId, buildId);
    }
  }
}

function resetAllBuilds() {
  selectedBuilds.value = {};
  cachedResults.value = {};
  loadingStates.value = {};
  enabledHunters.value = {};
}

function closeModal() {
  // Automatisch speichern beim Schließen
  const hunterProductions = {};
  
  availableHunters.value.forEach(hunter => {
    // Only include enabled hunters in the save data
    if (enabledHunters.value[hunter.id]) {
      const production = getDailyMat3Production(hunter.id);
      if (production > 0) {
        hunterProductions[hunter.id] = {
          buildId: selectedBuilds.value[hunter.id],
          buildName: getBuildsForHunter(hunter.id).find(b => String(b.id) === String(selectedBuilds.value[hunter.id]))?.name || 'Unknown',
          dailyMat3Production: production
        };
      }
    }
  });
  
  emit('save', {
    selectedBuilds: { ...selectedBuilds.value },
    hunterProductions,
    enabledHunters: { ...enabledHunters.value }
  });
  
  emit('close');
}

// Watch for prop changes
watch(() => props.initialSelectedBuilds, (newValue) => {
  selectedBuilds.value = { ...newValue };
  loadAllCachedResults();
}, { immediate: true });

watch(() => props.initialEnabledHunters, (newValue) => {
  enabledHunters.value = { ...newValue };
}, { immediate: true });

// Initialize stores and load data
onMounted(async () => {
  // Initialize hunter stores for all hunters
  for (const hunter of availableHunters.value) {
    if (!hunterStore.hunterBuilds || !hunterStore.hunterBuilds[hunter.id] || hunterStore.hunterBuilds[hunter.id].length === 0) {
      await hunterStore.initHunterConfig(hunter.id);
    }
  }
  
  // Load cached results for initially selected builds
  await loadAllCachedResults();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>