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
          This tool only shows endgame loop mods starting from around e3000 MP, which are the most relevant for late-game progression.
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
                <TRValueControls
                  v-model:value="mpValue"
                  :min-value="3000"
                  :max-value="15000"
                  :step="10"
                  :fast-step="100"
                  :validateOnFinalOnly="true"
                  value-class="text-amber-400 font-medium"
                  @update:raw-value="handleMpValueRawUpdate"
                  @finalize:value="handleMpValueFinalize"
                />
              </div>
              
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm text-gray-300">MP Range</span>
                <div class="flex items-center">
                  <TRValueControls
                    v-if="mpRangeEnabled"
                    v-model:value="mpRange"
                    :min-value="50"
                    :max-value="1000"
                    :step="10"
                    :fast-step="100"
                    :validateOnFinalOnly="true"
                    class="ml-2"
                    @update:raw-value="handleMpRangeRawUpdate"
                    @finalize:value="handleMpRangeFinalize"
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
                <label for="i753Toggle" class="text-sm text-gray-300">Insryption #75-3 Available</label>
                <button 
                  @click="toggleI753"
                  class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                  :class="{
                    'bg-amber-600': showI753,
                    'bg-gray-600': !showI753
                  }"
                >
                  <span 
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="{
                      'translate-x-5': showI753,
                      'translate-x-1': !showI753
                    }"
                  ></span>
                </button>
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
            <p class="text-gray-400 text-sm">Loading loop mod data...</p>
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
                        v-if="mod.requiresI753" 
                        class="px-1.5 py-0.5 text-xs bg-amber-900/50 text-amber-300 border border-amber-700 rounded"
                      >
                        i75-3
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
import { 
  LOOP_MOD_TEMPLATES,
  LOOP_MODS,
  ULTIMA_CAP_UPGRADES,
  TIER_DEFINITIONS,
  getLoopModDetails,
  hasEnoughUltimaCap,
  getAllLoopMods
} from '@/constants/loopMods.js';
import TRValueControls from '@/composables/TRValueControls.vue';

// State
const isLoading = ref(true);
const mpValue = ref(3000);
const mpRange = ref(100);
const mpRangeEnabled = ref(true);
const showTemp3 = ref(false);
const showI753 = ref(false);
const selectedUltimaCapUpgrades = ref([]);
const sortBy = ref('cost');
const sortDirection = ref('asc');
const mpValueRaw = ref(mpValue.value);
const mpRangeRaw = ref(mpRange.value);

// Toggles für die Filter
function toggleTemp3() {
  showTemp3.value = !showTemp3.value;
  saveFilters();
}

function toggleI753() {
  showI753.value = !showI753.value;
  saveFilters();
}

function handleMpValueRawUpdate(value) {
  mpValueRaw.value = value;
}

function handleMpRangeRawUpdate(value) {
  mpRangeRaw.value = value;
}

// Event-Handler für finalisierte Werte
function handleMpValueFinalize() {
  let numValue = Number(mpValueRaw.value);
  
  // Validieren und begrenzen
  numValue = Math.max(3000, Math.min(15000, numValue));
  
  // Aktualisiere den tatsächlichen Wert
  mpValue.value = numValue;
  mpValueRaw.value = numValue;
  
  // Speichere in localStorage
  saveFilters();
}

function handleMpRangeFinalize() {
  let numValue = Number(mpRangeRaw.value);
  
  // Validieren und begrenzen
  numValue = Math.max(50, Math.min(1000, numValue));
  
  // Aktualisiere den tatsächlichen Wert
  mpRange.value = numValue;
  mpRangeRaw.value = numValue;
  
  // Speichere in localStorage
  saveFilters();
}

// Computed
const totalUltimaCap = computed(() => {
  return ULTIMA_CAP_UPGRADES
    .filter(upgrade => selectedUltimaCapUpgrades.value.includes(upgrade.id))
    .reduce((sum, upgrade) => sum + upgrade.bonus, 0);
});

const allLoopMods = computed(() => {
  return getAllLoopMods();
});

const filteredLoopMods = computed(() => {
  let result = allLoopMods.value;
  
  // Filter by MP value if provided
  if (mpValue.value) {
    const mpVal = Number(mpValue.value);
    if (!isNaN(mpVal)) {
      if (mpRangeEnabled.value && mpRange.value) {
        const range = Number(mpRange.value);
        result = result.filter(mod => 
          mod.cost >= mpVal && // Diese Zeile wurde von mpVal - range zu einfach mpVal geändert
          mod.cost <= mpVal + range
        );
      } else {
        result = result.filter(mod => mod.cost >= mpVal); // Diese Zeile wurde von <= zu >= geändert
      }
    }
  }
  
  // Filter by requirements
  if (!showTemp3.value) {
    result = result.filter(mod => !mod.requiresTemp3);
  }
  
  if (!showI753.value) {
    result = result.filter(mod => !mod.requiresI753);
  }
  
  // Filter by Ultima Cap
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
  mpValue.value = 3000;
  mpRange.value = 100;
  mpRangeEnabled.value = true;
  showTemp3.value = false;
  showI753.value = false;
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
    
    if (savedFilters.mpValue !== undefined) mpValue.value = savedFilters.mpValue;
    if (savedFilters.mpRange !== undefined) mpRange.value = savedFilters.mpRange;
    if (savedFilters.mpRangeEnabled !== undefined) mpRangeEnabled.value = savedFilters.mpRangeEnabled;
    if (savedFilters.showTemp3 !== undefined) showTemp3.value = savedFilters.showTemp3;
    if (savedFilters.showI753 !== undefined) showI753.value = savedFilters.showI753;
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
      showI753: showI753.value,
      selectedUltimaCapUpgrades: selectedUltimaCapUpgrades.value,
      sortBy: sortBy.value,
      sortDirection: sortDirection.value
    }));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

// Watch für Wertänderungen
watch([mpValue, mpRange], () => {
  saveFilters();
});

// Lifecycle
onMounted(() => {
  loadFilters();
  isLoading.value = false;
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