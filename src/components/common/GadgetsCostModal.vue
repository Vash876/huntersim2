<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
    @click.self="handleClose"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2 flex items-center">
            <IconTool size="18" class="mr-1.5 text-blue-400" />
            <span class="text-blue-400">Knox</span>
            <span class="ml-1"> - Gadget Calculator</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="resetAllLevels" 
              class="px-2 py-0.5 bg-gray-600 hover:bg-gray-500 text-xs text-white rounded-md"
            >
              Reset
            </button>
            <button 
              @click="handleClose"
              class="p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="p-4 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
        <p class="text-gray-400 text-sm">Loading gadget data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ loadError }}</p>
        <button 
          @click="loadGadgetData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Retry
        </button>
      </div>

      <!-- Main Content -->
      <div v-else class="p-2">
        <!-- Tessarect Rate Settings -->
        <div class="mb-3 bg-gray-750/80 rounded-lg p-2 border border-gray-700">
          <div class="flex items-center mb-1">
            <div class="w-1.5 h-4 bg-blue-500 rounded-r mr-1.5"></div>
            <h3 class="font-medium text-xs text-blue-200">Tessarect Production</h3>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- Reference Build -->
            <div class="bg-gray-750/60 rounded-md p-1.5 border border-transparent">
              <div class="flex justify-between items-center mb-0.5">
                <span class="text-xs font-medium text-gray-300">Reference Build</span>
              </div>
              
              <select 
                v-model="selectedBuildId" 
                @change="updateFromSelectedBuild"
                class="w-full bg-gray-700 border border-gray-600 text-white rounded text-xs py-1 px-2"
              >
                <option value="">Select a build...</option>
                <option v-for="build in knoxBuilds" :key="build.id" :value="build.id">
                  {{ build.name }}
                </option>
              </select>
            </div>
            
            <!-- Daily Tessarect Rate -->
            <div class="bg-gray-750/60 rounded-md p-1.5 border border-transparent">
              <div class="flex justify-between items-center mb-0.5">
                <span class="text-xs font-medium text-gray-300">Tessarects per Day</span>
              </div>
              
              <div class="flex items-center bg-gray-800 py-1 px-2 rounded border border-gray-600">
                <div class="text-white text-xs">{{ formatGadgetCost(tessarectsPerDay) }}</div>
                <div v-if="selectedBuild" class="ml-2 text-xs text-gray-400">
                  ({{ selectedBuild.name }})
                </div>
                <div v-else class="ml-2 text-xs text-gray-400">(select a build)</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Summary Box (total cost, days) -->
        <div class="mb-3 bg-gray-900/70 p-2 rounded-lg border border-gray-700">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <div class="text-xs text-gray-400 mb-0.5">Total Tessarects</div>
              <div class="text-white font-bold text-sm">{{ formatGadgetCost(totalCost) }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 mb-0.5">Time to Save</div>
              <div :class="{'text-white': daysToSave < 30, 'text-yellow-400': daysToSave >= 30 && daysToSave < 60, 'text-red-400': daysToSave >= 60}" class="font-bold text-sm">
                {{ formatTimeToSave(daysToSave) }}
              </div>
            </div>
            <div>
              <div class="text-xs text-gray-400 mb-0.5">Planned Upgrades</div>
              <div class="text-white text-sm">
                <span class="text-gray-300 font-bold">{{ activeLevelCount }}/{{ totalGadgets }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Gadget List -->
        <div class="mb-2">
          <div class="flex items-center mb-1">
            <div class="w-1.5 h-4 bg-blue-500 rounded-r mr-1.5"></div>
            <h3 class="font-medium text-xs text-blue-200">Gadget Upgrades</h3>
          </div>
          
          <!-- Gadget Grid -->
          <div class="grid grid-cols-1 gap-1.5">
            <div 
  v-for="gadget in GADGETS" 
  :key="gadget.id" 
  class="custom-gadget-item rounded-md p-2 transition-colors border border-transparent hover:border-gray-600"
  :class="{ 'active-gadget': hasLevelChanges(gadget.id) }"
>
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-white">{{ gadget.label }}</span>
                <div v-if="getGadgetCost(gadget.id) > 0" class="text-yellow-400 text-xs font-medium">
                  {{ formatGadgetCost(getGadgetCost(gadget.id)) }}
                </div>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <!-- Current Level Controls -->
                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-400 mr-1.5 uppercase">Current</div>
                  
                  <ValueControls
                    :value="currentLevels[gadget.id] || 0"
                    :maxValue="999"
                    :minValue="0"
                    :step="1"
                    :fastStep="10"
                    :showFastControls="true"
                    @update:value="(newVal) => updateCurrentLevel(gadget.id, newVal)"
                  />
                </div>
                
                <!-- Target Level Controls -->
                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-400 mr-1.5 uppercase">Target</div>
                  
                  <ValueControls
                    :value="targetLevels[gadget.id] || 0"
                    :maxValue="999"
                    :minValue="currentLevels[gadget.id] || 0"
                    :step="1"
                    :fastStep="10"
                    :showFastControls="true"
                    @update:value="(newVal) => updateTargetLevel(gadget.id, newVal)"
                    :valueClass="hasLevelChanges(gadget.id) ? 'text-green-400' : 'text-white'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  IconX, IconChevronLeft, IconChevronRight, IconAlertCircle, IconTool
} from '@tabler/icons-vue';
import { GADGETS, getGadgetLabel } from '../../constants/gadgets.js';
import { useHunterStore } from '../../store/hunterStore';
import { calcGadgetCostDifference, formatGadgetCost } from '../../utils/gadgetCostUtils';
import { shouldEvaluate } from '../../services/evaluationCacheService';
import ValueControls from './ValueControls.vue';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  builds: { type: Array, default: () => [] }
});

const emit = defineEmits(['close']);

// Stores
const hunterStore = useHunterStore();

// Local state
const isLoading = ref(true);
const loadError = ref(null);
const currentLevels = ref({});
const targetLevels = ref({});
const tessarectsPerDay = ref(0);
const selectedBuildId = ref('');
const cachedResults = ref({});

// Computed properties
const knoxBuilds = computed(() => {
  return props.builds.filter(build => {
    return (build.hunterType === 'knox' || build.hunter === 'knox' || build.hunterId === 'knox');
  });
});

const selectedBuild = computed(() => {
  if (!selectedBuildId.value) return null;
  return knoxBuilds.value.find(build => String(build.id) === String(selectedBuildId.value));
});

const totalCost = computed(() => {
  let cost = 0;
  
  for (const gadget of GADGETS) {
    cost += getGadgetCost(gadget.id);
  }
  
  return cost;
});

const daysToSave = computed(() => {
  if (tessarectsPerDay.value <= 0) return Infinity;
  return totalCost.value / tessarectsPerDay.value;
});

const activeLevelCount = computed(() => {
  return GADGETS.filter(gadget => hasLevelChanges(gadget.id)).length;
});

const totalGadgets = computed(() => GADGETS.length);

// Methods
function formatTimeToSave(days) {
  if (days === Infinity) return 'N/A';
  
  // Wenn es mehr als 10 Jahre dauert...
  if (days > 3650) { // 10 Jahre = 3650 Tage
    return 'Bad plan 😅';
  }
  
  // Wenn es mehr als 1 Jahr dauert, in Jahren und Monaten anzeigen
  if (days > 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    
    if (months === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    }
  }
  
  // Wenn es mehr als 60 Tage dauert, nur in Tagen anzeigen
  if (days > 60) {
    return `${Math.floor(days)} days`;
  }
  
  // Normaler Fall: Tage und Stunden
  const fullDays = Math.floor(days);
  const hours = Math.round((days - fullDays) * 24);
  
  if (fullDays === 0) {
    return `${hours} hours`;
  } else if (hours === 0) {
    return `${fullDays} days`;
  } else {
    return `${fullDays} days, ${hours} hours`;
  }
}

async function loadCachedResults() {
  isLoading.value = true;
  
  try {
    for (const build of knoxBuilds.value) {
      // Cache-Ergebnis abrufen
      const { shouldEvaluate: needsEval, cachedResult } = await shouldEvaluate({
        hunterId: 'knox',
        buildData: build,
        hunterStore
      });
      
      if (!needsEval && cachedResult) {
        // Ergebnis im lokalen Cache speichern
        cachedResults.value[build.id] = cachedResult;
        console.log(`Loaded cached result for build ${build.name} (ID: ${build.id})`);
      } else {
        console.log(`No cached result for build ${build.name} (ID: ${build.id})`);
      }
    }
  } catch (error) {
    console.error('Error loading cached results:', error);
    loadError.value = 'Failed to load build results';
  } finally {
    isLoading.value = false;
  }
}

async function loadGadgetData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Cached Results laden
    await loadCachedResults();
    
    // Load existing gadget levels from hunterStore
    const storeUpgrades = hunterStore.upgrades?.gadgets || {};
    
    // Initialize levels from localStorage or store
    const savedCurrentLevels = JSON.parse(localStorage.getItem('gadgetCalculator_currentLevels') || '{}');
    const savedTargetLevels = JSON.parse(localStorage.getItem('gadgetCalculator_targetLevels') || '{}');
    const savedReferenceBuildId = localStorage.getItem('gadgetCalculator_referenceBuildId');
    
    // Initialize with store values for wrench, zaptron, anchor
    const newCurrentLevels = { ...savedCurrentLevels };
    
    // For wrench, zaptron, and anchor, use store values if available
    if (storeUpgrades.wrench !== undefined) newCurrentLevels.wrench = storeUpgrades.wrench;
    if (storeUpgrades.zaptron !== undefined) newCurrentLevels.zaptron = storeUpgrades.zaptron;
    if (storeUpgrades.anchor !== undefined) newCurrentLevels.anchor = storeUpgrades.anchor;
    
    // Set the values from localStorage or defaults
    currentLevels.value = newCurrentLevels;
    targetLevels.value = savedTargetLevels;
    
    if (savedReferenceBuildId) {
      // Prüfen, ob der gespeicherte Build noch verfügbar ist
      const buildExists = knoxBuilds.value.some(build => String(build.id) === String(savedReferenceBuildId));
      
      if (buildExists) {
        selectedBuildId.value = savedReferenceBuildId;
        updateFromSelectedBuild();
      }
    }
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error loading gadget data:', error);
    loadError.value = error.message;
    isLoading.value = false;
  }
}

function updateFromSelectedBuild() {
  console.log("updateFromSelectedBuild called");
  console.log("Selected build ID:", selectedBuildId.value);
  
  if (!selectedBuildId.value) {
    console.log("No build selected");
    tessarectsPerDay.value = 0;
    return;
  }
  
  const build = selectedBuild.value;
  console.log("Selected build:", build);
  
  if (build) {
    // Hole gecachtes Ergebnis für diesen Build
    const result = cachedResults.value[build.id];
    console.log("Cached result for this build:", result);
    
    if (result) {
      // Tessarect-Produktion aus mat3 im gecachten Ergebnis holen
      const tessarectsPerRun = result.mat3 || 0;
      console.log("Tessarects per run:", tessarectsPerRun);
      
      // Durchschnittliche Laufzeit aus den Ergebnissen holen
      const avgRunTimeMinutes = result.avgTime || 120; // Default zu 120 Minuten, wenn nicht verfügbar
      console.log("Average run time (minutes):", avgRunTimeMinutes);
      
      // Läufe pro Tag berechnen
      const runsPerDay = 1440 / avgRunTimeMinutes; // 1440 Minuten in einem Tag
      console.log("Runs per day:", runsPerDay);
      
      // Tägliche Tessarect-Produktion berechnen
      const dailyTessarects = Math.floor(tessarectsPerRun * runsPerDay);
      console.log("Daily tessarect production:", dailyTessarects);
      
      // Tessarects pro Tag aktualisieren
      tessarectsPerDay.value = dailyTessarects;
      
      // In localStorage speichern
      localStorage.setItem('gadgetCalculator_referenceBuildId', selectedBuildId.value);
    } else {
      console.log("No cached result found for this build");
      tessarectsPerDay.value = 0;
    }
  } else {
    console.log("Build not found");
    tessarectsPerDay.value = 0;
  }
}

function hasLevelChanges(gadgetId) {
  const current = currentLevels.value[gadgetId] || 0;
  const target = targetLevels.value[gadgetId] || 0;
  return target > current;
}

function getGadgetCost(gadgetId) {
  const current = currentLevels.value[gadgetId] || 0;
  const target = targetLevels.value[gadgetId] || 0;
  
  if (target <= current) return 0;
  
  return calcGadgetCostDifference(gadgetId, current, target);
}

function updateCurrentLevel(gadgetId, newValue) {
  // Stelle sicher, dass der Wert nicht negativ ist
  newValue = Math.max(0, Math.min(999, newValue));
  
  // Aktualisiere den aktuellen Level
  currentLevels.value[gadgetId] = newValue;
  
  // Wenn der Ziellevel niedriger ist als der aktuelle, passe ihn an
  if ((targetLevels.value[gadgetId] || 0) < newValue) {
    targetLevels.value[gadgetId] = newValue;
  }
  
  // Speichere die Werte
  saveGadgetLevels();
}

function updateTargetLevel(gadgetId, newValue) {
  const current = currentLevels.value[gadgetId] || 0;
  
  // Stelle sicher, dass der Zielwert mindestens dem aktuellen Level entspricht
  newValue = Math.max(current, Math.min(999, newValue));
  
  // Aktualisiere den Ziel-Level
  targetLevels.value[gadgetId] = newValue;
  
  // Speichere die Werte
  saveGadgetLevels();
}

function resetAllLevels() {
  // Reset target levels to match current levels
  GADGETS.forEach(gadget => {
    targetLevels.value[gadget.id] = currentLevels.value[gadget.id] || 0;
  });
  
  saveGadgetLevels();
}

function saveGadgetLevels() {
  localStorage.setItem('gadgetCalculator_currentLevels', JSON.stringify(currentLevels.value));
  localStorage.setItem('gadgetCalculator_targetLevels', JSON.stringify(targetLevels.value));
}

function handleClose() {
  // Save all values before closing
  saveGadgetLevels();
  
  emit('close');
}

// Watch for visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadGadgetData();
  }
});

// Watch for build changes
watch(() => props.builds, () => {
  if (props.isVisible) {
    loadCachedResults();
  }
}, { deep: true });

// Initialize on mount if visible
onMounted(() => {
  if (props.isVisible) {
    loadGadgetData();
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

.custom-gadget-item {
  background-color: rgba(31, 35, 42, 0.8);
}

.custom-gadget-item.active-gadget {
  background-color: rgba(30, 58, 138, 0.2);
  border-color: rgb(37, 99, 235);
}
</style>