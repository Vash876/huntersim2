<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white">
        <span>m0 Cost Overview</span>
      </h2>
      
      <!-- Info Banner -->
      <div class="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-4 text-center">
        <p class="text-blue-200 text-sm">
          This tool displays m0 upgrade costs from level 1 to 1000.
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
            <!-- Current m0 Level Filter -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-300 text-sm">Current m0 Level</span>
                <ToolValueControls
                  :value="currentM0Level"
                  :minValue="1"
                  :maxValue="1000"
                  :step="10"
                  :fastStep="50"
                  :validateOnFinalOnly="true"
                  @update:value="handleCurrentM0LevelUpdate"
                  @update:raw-value="(val) => currentM0LevelRaw = val"
                  @finalize:value="finalizeCurrentM0Level"
                  value-class="text-cyan-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>
              
              <!-- Range Field -->
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm text-gray-300">Range</span>
                <div class="flex items-center">
                  <ToolValueControls
                    :value="levelRange"
                    :minValue="20"
                    :maxValue="100"
                    :step="10"
                    :fastStep="20"
                    :validateOnFinalOnly="true"
                    @update:value="handleLevelRangeUpdate"
                    @update:raw-value="(val) => levelRangeRaw = val"
                    @finalize:value="finalizeLevelRange"
                    value-class="text-white-400 font-medium"
                    :autoEdit="false"
                    class="ml-2"
                  />
                </div>
              </div>
            </div>
            
            <div></div>
          </div>
        </div>
      </div>
      
      <!-- M0 Cost Table -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconList size="18" class="mr-2 text-green-400" />
            m0 Costs
            <span class="ml-2 text-sm font-normal text-gray-400">({{ filteredCosts.length }} levels)</span>
          </h3>
        </div>
        
        <div class="p-2 sm:p-4">
          <!-- No results state -->
          <div v-if="filteredCosts.length === 0" class="p-4 flex flex-col items-center justify-center">
            <IconSearch size="32" class="text-gray-600 mb-2" />
            <p class="text-gray-400">No m0 levels match your filters</p>
            <button 
              @click="resetFilters" 
              class="mt-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded-lg transition-colors"
            >
              Reset filters
            </button>
          </div>
          
          <!-- Results table -->
          <div v-else class="overflow-x-auto">
            <!-- Desktop Multi-Column Layout -->
            <div class="hidden md:block">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-800 border-b border-gray-700">
                    <th v-for="column in columnCount" :key="column" class="px-3 py-2 border-r border-gray-700 last:border-r-0">
                      <div>
                        <div class="text-xs text-gray-400 mb-1 text-center">Levels {{ getColumnStartLevel(column) }}-{{ getColumnEndLevel(column) }}</div>
                        <div class="grid grid-cols-2 gap-1 text-xs">
                          <span class="text-left">Level</span>
                          <span class="text-left flex items-center">
                            Cost (e)
                          </span>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in maxRowsPerColumn" :key="row" class="border-b border-gray-700/30 hover:bg-gray-750/50 transition-all duration-200">
                    <td v-for="column in columnCount" :key="column" class="px-1 py-2 border-r border-gray-700 last:border-r-0">
                      <div v-if="getCostForPosition(column, row)" 
                           class="grid grid-cols-2 gap-1 text-sm rounded px-2 py-1 transition-colors">
                        <span class="text-white font-medium text-left">{{ getCostForPosition(column, row).level }}</span>
                        <div class="text-left">
                          <span class="text-yellow-400">
                            <img :src="shardsIcon" alt="Shards" :class="`${desktopIconSize} inline mr-0.5 mb-1`" />
                            {{ getCostForPosition(column, row).exponent }}
                          </span>
                          <span v-if="getCostForPosition(column, row).difference !== null" class="text-gray-400 text-xs ml-1">
                            (+{{ getCostForPosition(column, row).difference }})
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Single-Column Layout -->
            <div class="md:hidden">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-800 border-b border-gray-700">
                    <th class="px-4 py-2 w-[30%]">Level</th>
                    <th class="px-4 py-2 flex items-center">
                      Cost (e)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="cost in filteredCosts" 
                    :key="cost.level"
                    :class="[
                      'border-b transition-all duration-200 hover:bg-gray-750/50',
                      // Dickere Linie nach jedem 10er-Schritt (Level endet mit 0)
                      cost.level % 10 === 0 ? 'border-gray-500 border-b-2' : 'border-gray-700/30'
                    ]"
                  >
                    <td class="px-4 py-3 font-medium text-white">
                      {{ cost.level }}
                    </td>
                    <td class="px-4 py-3">
                      <img :src="shardsIcon" alt="Shards" class="w-4 h-4 inline mr-2" />
                      <span class="text-yellow-400">{{ cost.exponent }}</span>
                      <span v-if="cost.difference !== null" class="text-gray-400 text-xs ml-2">
                        (+{{ cost.difference }})
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center text-xs text-gray-400 mt-2">
        <span class="text-gray-500">Cost data provided by RatBoy and DarthSW</span>
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
  IconSearch
} from '@tabler/icons-vue';
import { M0_COSTS, getM0Cost, getTotalM0Cost } from '@/constants/m0Costs.js';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import shardsIcon from '@/assets/general/shards.png';

// Filter States
const currentM0Level = ref(1);
const levelRange = ref(10);
const currentM0LevelRaw = ref(1);
const levelRangeRaw = ref(10);

// Handler functions
function handleCurrentM0LevelUpdate(newVal) {
  currentM0Level.value = newVal;
  currentM0LevelRaw.value = newVal;
  saveFilters();
}

function handleLevelRangeUpdate(newVal) {
  levelRange.value = newVal;
  levelRangeRaw.value = newVal;
  saveFilters();
}

function finalizeCurrentM0Level() {
  const numValue = Number(currentM0LevelRaw.value);
  if (!isNaN(numValue)) {
    // Level muss durch 10 teilbar sein, mindestens 1
    const adjustedValue = Math.max(1, Math.round(numValue / 10) * 10);
    // Wenn der berechnete Wert 0 wäre, setze auf 1
    currentM0Level.value = adjustedValue === 0 ? 1 : Math.min(1000, adjustedValue);
    currentM0LevelRaw.value = currentM0Level.value;
    saveFilters();
  }
}

function finalizeLevelRange() {
  const numValue = Number(levelRangeRaw.value);
  if (!isNaN(numValue)) {
    // Range muss durch 10 teilbar sein
    const adjustedValue = Math.round(numValue / 10) * 10;
    levelRange.value = Math.max(20, Math.min(100, adjustedValue));
    levelRangeRaw.value = levelRange.value;
    saveFilters();
  }
}

// Computed
const filteredCosts = computed(() => {
  const result = [];
  // Berechne den Start-Level (immer mit 1 am Ende: 1, 11, 21, 31, usw.)
  const adjustedStartLevel = Math.floor((currentM0Level.value - 1) / 10) * 10 + 1;
  const startLevel = adjustedStartLevel;
  const endLevel = Math.min(startLevel + levelRange.value - 1, 1000);
  
  for (let level = startLevel; level <= endLevel; level++) {
    const exponent = getM0Cost(level);
    const prevExponent = level > 1 ? getM0Cost(level - 1) : null;
    const difference = prevExponent ? exponent - prevExponent : null;
    
    result.push({
      level,
      exponent,
      difference
    });
  }
  
  return result;
});

// M0 Multipliers based on current level
const cellsMultiplier = computed(() => {
  // Cells & Ouro Orbs Gained: x45.46m at level 185
  return (currentM0Level.value * 0.245).toFixed(2) + 'm';
});

const lootMultiplier = computed(() => {
  // Ozzy & Borge Loot: x39.00 at level 185
  return (currentM0Level.value * 0.211).toFixed(2);
});

const mpShardsRpMultiplier = computed(() => {
  // MP/Shards/RP Gained: x1.205x at level 185
  return (1 + (currentM0Level.value * 0.0011)).toFixed(3) + 'x';
});

const fragmentsMultiplier = computed(() => {
  // Fragments (Campaigns): x7.57 at level 185
  return (currentM0Level.value * 0.041).toFixed(2);
});

// Desktop Multi-Column Layout Computed Properties
const columnCount = computed(() => {
  return Math.ceil(levelRange.value / 10);
});

const maxRowsPerColumn = computed(() => {
  return 10; // Immer 10 Zeilen pro Spalte
});

const desktopIconSize = computed(() => {
  return levelRange.value > 70 ? 'w-0 h-0' : 'w-4 h-4';
});

// Methods
function getColumnStartLevel(column) {
  const adjustedStartLevel = Math.floor((currentM0Level.value - 1) / 10) * 10 + 1;
  const startLevel = adjustedStartLevel;
  return startLevel + (column - 1) * 10;
}

function getColumnEndLevel(column) {
  const start = getColumnStartLevel(column);
  const adjustedStartLevel = Math.floor((currentM0Level.value - 1) / 10) * 10 + 1;
  const baseStartLevel = adjustedStartLevel;
  return Math.min(start + 9, baseStartLevel + levelRange.value - 1, 1000);
}

function getCostForPosition(column, row) {
  const adjustedStartLevel = Math.floor((currentM0Level.value - 1) / 10) * 10 + 1;
  const baseStartLevel = adjustedStartLevel;
  const level = baseStartLevel + (column - 1) * 10 + (row - 1);
  const maxLevel = Math.min(baseStartLevel + levelRange.value - 1, 1000);
  
  if (level > maxLevel) return null;
  
  const exponent = getM0Cost(level);
  const prevExponent = level > 1 ? getM0Cost(level - 1) : null;
  const difference = prevExponent ? exponent - prevExponent : null;
  
  return {
    level,
    exponent,
    difference
  };
}

function resetFilters() {
  currentM0Level.value = 1;
  levelRange.value = 20;
  currentM0LevelRaw.value = 1;
  levelRangeRaw.value = 20;
  saveFilters();
}

function loadFilters() {
  try {
    const savedFilters = JSON.parse(localStorage.getItem('m0CostOverview_filters') || '{}');
    
    if (savedFilters.currentM0Level !== undefined) {
      currentM0Level.value = Number(savedFilters.currentM0Level);
      currentM0LevelRaw.value = currentM0Level.value;
    }
    if (savedFilters.levelRange !== undefined) {
      levelRange.value = Number(savedFilters.levelRange);
      levelRangeRaw.value = levelRange.value;
    }
  } catch (error) {
    console.error('Error loading saved filters:', error);
  }
}

function saveFilters() {
  try {
    localStorage.setItem('m0CostOverview_filters', JSON.stringify({
      currentM0Level: currentM0Level.value,
      levelRange: levelRange.value
    }));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

// Watch
watch([currentM0Level, levelRange], () => {
  saveFilters();
});

// Lifecycle
onMounted(() => {
  loadFilters();
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

/* Mobile responsive */
@media (max-width: 640px) {
  th, td {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
