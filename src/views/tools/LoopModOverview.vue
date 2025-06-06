<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white">
        <span>Loop Mod Overview</span>
      </h2>
      
      <!-- Info Banner -->
      <div class="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-4 text-center">
        <p class="text-blue-200 text-sm">
          This tool displays all notable and powerful Loop Mods that are beneficial for progression and worth pursuing.
        </p>
      </div>
      
      <!-- Filter und Einstellungen -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconFilter size="18" class="mr-2 text-blue-400" />
            Filter & Settings
          </h3>
          
          <button 
            @click="resetFilters" 
            class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
          >
            <IconRefresh size="14" class="mr-1" />
            Reset
          </button>
        </div>
        
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- MP Value Filter -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-white text-sm">MP Value (e)</span>
                <ToolValueControls
                  :value="mpValue"
                  :minValue="0"
                  :maxValue="15000"
                  :step="10"
                  :fastStep="100"
                  :validateOnFinalOnly="true"
                  @update:value="handleMpValueUpdate"
                  @update:raw-value="(val) => mpValueRaw = val"
                  @finalize:value="finalizeMpValue"
                  value-class="text-amber-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>
              
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm text-gray-300">MP Range</span>
                <div class="flex items-center">
                  <ToolValueControls
                    :value="mpRange"
                    :minValue="50"
                    :maxValue="10000"
                    :step="10"
                    :fastStep="100"
                    :validateOnFinalOnly="true"
                    @update:value="handleMpRangeUpdate"
                    @update:raw-value="(val) => mpRangeRaw = val" 
                    @finalize:value="finalizeMpRange"
                    class="ml-2"
                    :autoEdit="true"
                  />
                </div>
              </div>
            </div>
            
            <!-- Requirement Toggles -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-white text-sm">Requirements</span>
              </div>
              
              <div class="flex items-center justify-between mb-2">
                <label for="temp3Toggle" class="text-sm text-gray-300">Temp3 Available</label>
                <button 
                  @click="toggleTemp3"
                  class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                  :class="{
                    'bg-red-600': showTemp3,
                    'bg-gray-600': !showTemp3
                  }"
                >
                  <span 
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="{
                      'translate-x-5': showTemp3,
                      'translate-x-1': !showTemp3
                    }"
                  ></span>
                </button>
              </div>
              
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm text-gray-300">Inscryption #61 Level</label>
                <ToolValueControls
                  :value="i61Level"
                  :minValue="0"
                  :maxValue="5"
                  :step="1"
                  :showFastControls="false"
                  :validateOnFinalOnly="true"
                  @update:value="handleI61LevelUpdate"
                  @update:raw-value="(val) => i61LevelRaw = val"
                  @finalize:value="finalizeI61Level"
                  value-class="text-purple-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>
              
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm text-gray-300">Inscryption #75 Level</label>
                <ToolValueControls
                  :value="i75Level"
                  :minValue="0"
                  :maxValue="10"
                  :step="1"
                  :showFastControls="false"
                  :validateOnFinalOnly="true"
                  @update:value="handleI75LevelUpdate"
                  @update:raw-value="(val) => i75LevelRaw = val"
                  @finalize:value="finalizeI75Level"
                  value-class="text-amber-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>
              
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-300">Ultima Cap:</span>
                <span class="text-sm text-white font-medium">+{{ totalUltimaCap }}</span>
              </div>
            </div>
          </div>
          
          <!-- Ultima Cap Upgrades -->
          <div class="mt-4 bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium text-white text-sm">Ultima Cap Upgrades</span>
            </div>
            
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              <div 
                v-for="upgrade in ULTIMA_CAP_UPGRADES" 
                :key="upgrade.id"
                @click="toggleUltimaCapUpgrade(upgrade.id)"
                class="px-2 py-1.5 rounded border text-center text-sm cursor-pointer transition-colors"
                :class="selectedUltimaCapUpgrades.includes(upgrade.id) ? 
                  'bg-blue-900/50 border-blue-500 text-blue-300' : 
                  'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'"
              >
                {{ upgrade.name }} (+{{ upgrade.bonus }})
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loop Mods Table -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconList size="18" class="mr-2 text-green-400" />
            Loop Mods
            <span class="ml-2 text-sm font-normal text-gray-400">({{ filteredLoopMods.length }} results)</span>
          </h3>
          
          <div class="flex items-center gap-2">
            <button 
              @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'" 
              class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 text-sm rounded-lg flex items-center transition-colors"
            >
              <IconSortAscending v-if="sortDirection === 'asc'" size="16" />
              <IconSortDescending v-else size="16" />
            </button>
          </div>
        </div>
        
        <div class="p-2 sm:p-4">
          <!-- Loading state -->
          <div v-if="isLoading" class="p-4 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
            <p class="text-gray-400 text-sm">Loading loop mod data from Google Sheets...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="p-4 flex flex-col items-center justify-center">
            <IconSearch size="32" class="text-red-600 mb-2" />
            <p class="text-red-400 mb-2">{{ error }}</p>
            <button 
              @click="loadLoopModData" 
              class="bg-red-600 hover:bg-red-500 text-white px-3 py-1 text-sm rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>

          <!-- No results state -->
          <div v-else-if="filteredLoopMods.length === 0" class="p-4 flex flex-col items-center justify-center">
            <IconSearch size="32" class="text-gray-600 mb-2" />
            <p class="text-gray-400">No loop mods match your filters</p>
            <button 
              @click="resetFilters" 
              class="mt-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded-lg transition-colors"
            >
              Reset filters
            </button>
          </div>
          
          <!-- Results table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-800 border-b border-gray-700">
                  <th @click="updateSort('tier')" class="px-4 py-2 cursor-pointer hover:bg-gray-750">
                    <div class="flex items-center">
                      Tier
                      <IconChevronDown v-if="sortBy === 'tier' && sortDirection === 'desc'" size="14" class="ml-1" />
                      <IconChevronUp v-else-if="sortBy === 'tier' && sortDirection === 'asc'" size="14" class="ml-1" />
                    </div>
                  </th>
                  <th @click="updateSort('name')" class="px-4 py-2 cursor-pointer hover:bg-gray-750">
                    <div class="flex items-center">
                      Name
                      <IconChevronDown v-if="sortBy === 'name' && sortDirection === 'desc'" size="14" class="ml-1" />
                      <IconChevronUp v-else-if="sortBy === 'name' && sortDirection === 'asc'" size="14" class="ml-1" />
                    </div>
                  </th>
                  <th @click="updateSort('level')" class="px-4 py-2 cursor-pointer hover:bg-gray-750">
                    <div class="flex items-center">
                      Level
                      <IconChevronDown v-if="sortBy === 'level' && sortDirection === 'desc'" size="14" class="ml-1" />
                      <IconChevronUp v-else-if="sortBy === 'level' && sortDirection === 'asc'" size="14" class="ml-1" />
                    </div>
                  </th>
                  <th @click="updateSort('cost')" class="px-4 py-2 cursor-pointer hover:bg-gray-750">
                    <div class="flex items-center">
                      MP Cost (e)
                      <IconChevronDown v-if="sortBy === 'cost' && sortDirection === 'desc'" size="14" class="ml-1" />
                      <IconChevronUp v-else-if="sortBy === 'cost' && sortDirection === 'asc'" size="14" class="ml-1" />
                    </div>
                  </th>
                  <th class="px-4 py-2">Buffs</th>
                  <th class="px-4 py-2">Requirements</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="mod in sortedLoopMods" 
                  :key="`${mod.name}-${mod.level}`"
                  class="border-b border-gray-700 hover:bg-gray-750"
                >
                  <td class="px-4 py-3">
                    <div class="inline-block px-2 py-0.5 rounded font-medium" :class="getTierClass(mod.tier)">
                      {{ mod.tier }}
                    </div>
                  </td>
                  <td class="px-4 py-3 text-white font-medium">{{ mod.name }}</td>
                  <td class="px-4 py-3 text-gray-300">{{ mod.level }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center">
                      <img src="@/assets/general/mp.png" class="w-4 h-4 mr-1.5" alt="MP" />
                      <span class="text-amber-400 font-medium">{{ mod.cost }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="(buff, index) in mod.buffs" 
                        :key="index" 
                        class="px-1.5 py-0.5 text-xs bg-gray-700 text-blue-300 rounded"
                      >
                        {{ buff }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-if="mod.requiresTemp3" 
                        class="px-1.5 py-0.5 text-xs bg-red-900/50 text-red-300 border border-red-700 rounded"
                      >
                        Temp3
                      </span>
                      <span 
                        v-if="mod.requiresI61Level > 0" 
                        class="px-1.5 py-0.5 text-xs bg-purple-900/50 text-purple-300 border border-purple-700 rounded"
                      >
                        i61-{{ mod.requiresI61Level }}
                      </span>
                      <span 
                        v-if="mod.requiresI75Level > 0" 
                        class="px-1.5 py-0.5 text-xs bg-amber-900/50 text-amber-300 border border-amber-700 rounded"
                      >
                        i75-{{ mod.requiresI75Level }}
                      </span>
                      <span 
                        v-if="mod.requiresUltimaCap > 0" 
                        class="px-1.5 py-0.5 text-xs bg-blue-900/50 text-blue-300 border border-blue-700 rounded"
                      >
                        +{{ mod.requiresUltimaCap }} Ultima Cap
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  IconFilter, 
  IconRefresh, 
  IconList, 
  IconSearch, 
  IconChevronUp, 
  IconChevronDown,
  IconSortAscending,
  IconSortDescending
} from '@tabler/icons-vue';
import { ULTIMA_CAP_UPGRADES } from '@/constants/loopMods.js';
import { useLoopModData } from '@/composables/useLoopModData.js';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// State
const isLoading = ref(true);
const loopModsData = ref([]);
const tierData = ref({});
const error = ref(null);

// Filter States - i75 anpassen
const mpValue = ref(0);
const mpRange = ref(50);
const mpRangeEnabled = ref(true);
const showTemp3 = ref(false);
const i75Level = ref(0); // Neu: Level statt Boolean
const i61Level = ref(0); // Neu: Level statt Boolean
const selectedUltimaCapUpgrades = ref([]);
const sortBy = ref('cost');
const sortDirection = ref('asc');
const mpValueRaw = ref(mpValue.value);
const mpRangeRaw = ref(mpRange.value);
const i75LevelRaw = ref(i75Level.value); // Neu
const i61LevelRaw = ref(i61Level.value); // Neu

// Google Sheets Integration
const { fetchLoopModData } = useLoopModData();

// Computed - alle Loop Mods mit Tier-Informationen
const allLoopMods = computed(() => {
  return loopModsData.value.map(mod => ({
    ...mod,
    tier: tierData.value[mod.name] || 'B' // Fallback zu Tier B
  }));
});

// Toggles für die Filter
function toggleTemp3() {
  showTemp3.value = !showTemp3.value;
  saveFilters();
}

//////////////

function handleMpValueUpdate(newVal) {
  // Bei Pfeilklicks sofort aktualisieren
  mpValue.value = newVal;
  mpValueRaw.value = newVal; // Raw-Wert synchronisieren
  saveFilters();
}

function handleMpRangeUpdate(newVal) {
  // Bei Pfeilklicks sofort aktualisieren
  mpRange.value = newVal;
  mpRangeRaw.value = newVal; // Raw-Wert synchronisieren
  saveFilters();
}

function finalizeMpValue() {
  // Konvertiere den Rohwert zu einer Zahl und validiere
  const numValue = Number(mpValueRaw.value);
  
  // Validiere nur wenn der Wert eine gültige Zahl ist
  if (!isNaN(numValue)) {
    mpValue.value = Math.max(0, Math.min(99999, numValue));
    mpValueRaw.value = mpValue.value;
    saveFilters();
  }
}

function finalizeMpRange() {
  // Konvertiere den Rohwert zu einer Zahl und validiere
  const numValue = Number(mpRangeRaw.value);
  
  // Validiere nur wenn der Wert eine gültige Zahl ist
  if (!isNaN(numValue)) {
    mpRange.value = Math.max(50, Math.min(10000, numValue));
    mpRangeRaw.value = mpRange.value;
    saveFilters();
  }
}

// Neue i75-Funktionen
function handleI75LevelUpdate(newVal) {
  i75Level.value = newVal;
  i75LevelRaw.value = newVal;
  saveFilters();
}

function finalizeI75Level() {
  const numValue = Number(i75LevelRaw.value);
  
  if (!isNaN(numValue)) {
    i75Level.value = Math.max(0, Math.min(10, numValue));
    i75LevelRaw.value = i75Level.value;
    saveFilters();
  }
}

// Neue i61-Funktionen
function handleI61LevelUpdate(newVal) {
  i61Level.value = newVal;
  i61LevelRaw.value = newVal;
  saveFilters();
}

function finalizeI61Level() {
  const numValue = Number(i61LevelRaw.value);
  
  if (!isNaN(numValue)) {
    i61Level.value = Math.max(0, Math.min(5, numValue));
    i61LevelRaw.value = i61Level.value;
    saveFilters();
  }
}

// Computed
const totalUltimaCap = computed(() => {
  return ULTIMA_CAP_UPGRADES
    .filter(upgrade => selectedUltimaCapUpgrades.value.includes(upgrade.id))
    .reduce((sum, upgrade) => sum + upgrade.bonus, 0);
});

const filteredLoopMods = computed(() => {
  let result = allLoopMods.value;
  
  // MP Value Filter bleibt gleich...
  if (mpValue.value) {
    const mpVal = Number(mpValue.value);
    if (!isNaN(mpVal)) {
      if (mpRangeEnabled.value && mpRange.value) {
        const range = Number(mpRange.value);
        result = result.filter(mod => 
          mod.cost >= mpVal && 
          mod.cost <= mpVal + range
        );
      } else {
        result = result.filter(mod => mod.cost >= mpVal);
      }
    }
  }
  
  // Temp3 Filter bleibt gleich...
  if (!showTemp3.value) {
    result = result.filter(mod => !mod.requiresTemp3);
  }
  
  // i75 Filter anpassen
  result = result.filter(mod => {
    if (!mod.requiresI75Level) return true;
    return mod.requiresI75Level <= i75Level.value;
  });
  
  // i61 Filter anpassen
  result = result.filter(mod => {
    if (!mod.requiresI61Level) return true;
    return mod.requiresI61Level <= i61Level.value;
  });
  
  // Ultima Cap Filter bleibt gleich...
  result = result.filter(mod => {
    if (!mod.requiresUltimaCap) return true;
    return mod.requiresUltimaCap <= totalUltimaCap.value;
  });
  
  return result;
});

const sortedLoopMods = computed(() => {
  let mods = [...filteredLoopMods.value];
  
  // Define sorting functions
  const sortFunctions = {
    name: (a, b) => {
      // First by name
      const nameResult = a.name.localeCompare(b.name);
      // If names are the same, sort by level
      return nameResult !== 0 ? nameResult : a.level - b.level;
    },
    cost: (a, b) => a.cost - b.cost,
    tier: (a, b) => {
      // S > A > B > C > D > E
      const tierOrder = { S: 1, A: 2, B: 3, C: 4, D: 5, E: 6 };
      const tierResult = tierOrder[a.tier] - tierOrder[b.tier];
      // If tiers are the same, sort by name
      return tierResult !== 0 ? tierResult : a.name.localeCompare(b.name);
    },
    level: (a, b) => {
      // First by name for grouping
      const nameResult = a.name.localeCompare(b.name);
      // If names are the same, sort by level
      return nameResult !== 0 ? nameResult : a.level - b.level;
    }
  };
  
  // Sort the mods
  mods.sort(sortFunctions[sortBy.value]);
  
  // Apply sort direction
  if (sortDirection.value === 'desc') {
    mods.reverse();
  }
  
  return mods;
});

// Methods
function toggleUltimaCapUpgrade(id) {
  if (selectedUltimaCapUpgrades.value.includes(id)) {
    selectedUltimaCapUpgrades.value = selectedUltimaCapUpgrades.value.filter(i => i !== id);
  } else {
    selectedUltimaCapUpgrades.value.push(id);
  }
  saveFilters();
}

function updateSort(field) {
  if (sortBy.value === field) {
    // Toggle direction if same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // New field, default to ascending
    sortBy.value = field;
    sortDirection.value = 'asc';
  }
  saveFilters();
}

function resetFilters() {
  mpValue.value = 0;
  mpRange.value = 50;
  mpRangeEnabled.value = true;
  showTemp3.value = false;
  i75Level.value = 0; // Angepasst
  i61Level.value = 0; // Angepasst
  selectedUltimaCapUpgrades.value = [];
  sortBy.value = 'cost';
  sortDirection.value = 'asc';
  saveFilters();
}

function getTierClass(tier) {
  const classes = {
    S: 'bg-red-900/50 text-red-300 border border-red-700',
    A: 'bg-orange-900/50 text-orange-300 border border-orange-700',
    B: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
    C: 'bg-green-900/50 text-green-300 border border-green-700',
    D: 'bg-blue-900/50 text-blue-300 border border-blue-700',
    E: 'bg-gray-900/50 text-gray-300 border border-gray-700'
  };
  
  return classes[tier] || 'bg-gray-900/50 text-gray-300 border border-gray-700';
}

function loadFilters() {
  // Load saved filter state from localStorage
  try {
    const savedFilters = JSON.parse(localStorage.getItem('loopModOverview_filters') || '{}');
    
    // Stelle sicher, dass die geladenen Werte keine null-Werte sind
    if (savedFilters.mpValue !== undefined && savedFilters.mpValue !== null) {
      mpValue.value = Number(savedFilters.mpValue);
    }
    
    if (savedFilters.mpRange !== undefined && savedFilters.mpRange !== null) {
      mpRange.value = Number(savedFilters.mpRange);
    }
    if (savedFilters.mpRangeEnabled !== undefined) mpRangeEnabled.value = savedFilters.mpRangeEnabled;
    if (savedFilters.showTemp3 !== undefined) showTemp3.value = savedFilters.showTemp3;
    if (savedFilters.i75Level !== undefined) i75Level.value = Number(savedFilters.i75Level); // Angepasst
    if (savedFilters.i61Level !== undefined) i61Level.value = Number(savedFilters.i61Level); // Angepasst
    if (savedFilters.selectedUltimaCapUpgrades !== undefined) {
      selectedUltimaCapUpgrades.value = savedFilters.selectedUltimaCapUpgrades;
    }
    if (savedFilters.sortBy !== undefined) sortBy.value = savedFilters.sortBy;
    if (savedFilters.sortDirection !== undefined) sortDirection.value = savedFilters.sortDirection;
  } catch (error) {
    console.error('Error loading saved filters:', error);
  }
}

function saveFilters() {
  // Save current filter state to localStorage
  try {
    localStorage.setItem('loopModOverview_filters', JSON.stringify({
      mpValue: mpValue.value,
      mpRange: mpRange.value,
      mpRangeEnabled: mpRangeEnabled.value,
      showTemp3: showTemp3.value,
      i75Level: i75Level.value, // Angepasst
      i61Level: i61Level.value, // Angepasst
      selectedUltimaCapUpgrades: selectedUltimaCapUpgrades.value,
      sortBy: sortBy.value,
      sortDirection: sortDirection.value
    }));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

// Data Loading
async function loadLoopModData() {
  try {
    isLoading.value = true;
    error.value = null;
    
    const data = await fetchLoopModData();
    loopModsData.value = data.loopMods;
    tierData.value = data.tiers;
    
    console.log(`Loaded ${data.loopMods.length} loop mods and ${Object.keys(data.tiers).length} tier definitions`);
    
  } catch (err) {
    console.error('Failed to load loop mod data:', err);
    error.value = 'Failed to load loop mod data. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Watch für Wertänderungen
watch([mpValue, mpRange], () => {
  saveFilters();
});

// Lifecycle
onMounted(async () => {
  loadFilters();
  await loadLoopModData();
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

/* Responsive Styles */
@media (max-width: 640px) {
  /* Make the table more mobile-friendly */
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
  
  th, td {
    padding: 0.5rem 0.75rem;
  }
}
</style>