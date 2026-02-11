<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
  <div class="bg-gray-900/95 rounded-xl border border-gray-800 p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white md:hidden">
        <span>m0 Cost Overview</span>
      </h2>
      
      <!-- Info Banner -->
      <div class="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-4 text-center">
        <p class="text-blue-200 text-sm">
          This tool displays m0 upgrade costs from level 1 to 
          <span @click="showCostListModal = true">
            1000
          </span>.
        </p>
      </div>

      <!-- Cost List Modal -->
      <div 
        v-if="showCostListModal" 
        class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
        @click.self="showCostListModal = false"
      >
        <div 
          class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-700"
          @click.stop
        >
          <!-- Header -->
          <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
            <h2 class="text-lg font-bold text-white flex items-center">
              <IconList size="18" class="mr-2 text-green-400" />
              m0 Costs (Level 1-1000)
            </h2>
            <button @click="showCostListModal = false" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors">
              <IconX size="16" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-4 max-h-[70vh] overflow-y-auto">
            <pre class="bg-gray-900 p-4 rounded text-white text-sm font-mono whitespace-pre select-all border border-gray-700">{{ costList }}</pre>
          </div>

          <!-- Footer -->
          <div class="flex justify-end pt-2 border-t border-gray-700 px-4 pb-4">
            <button @click="showCostListModal = false" class="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
      
  <!-- Filter und Einstellungen -->
  <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
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
                  :step="1"
                  :fastStep="10"
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
                    :minValue="10"
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
            
            <!-- Exodus Gem Node #4 Status Display -->
            <div v-if="exodusNode4Active" class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-300 text-sm">Exodus Gem Node #4</span>
                <div class="flex items-center">
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium text-white border border-purple-400/30 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
                    style="background: linear-gradient(135deg, #5a95f5ff 0%, #6326f1ff 40%, #ec4899 100%)"
                  >
                    Active
                  </span>
                </div>
              </div>
              
              <div class="space-y-2">
                <!-- Total P&A Gem Levels Display -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <span class="text-sm text-gray-300">Total P&A GU Levels</span>
                    <InfoTooltip 
                      class="ml-1"
                      content="Total Power & Attraction gem upgrade levels. Automatically retrieved from your Gem Overview Page."
                      placement="top"
                    />
                  </div>
                  <span class="text-purple-400 font-medium text-sm">
                    {{ totalGemLevels.toLocaleString() }}
                  </span>
                </div>
                
                <!-- Cost Reduction Display -->
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-300">Cost Reduction</span>
                  <span class="text-yellow-400 font-medium text-sm">
                    /{{ costReductionFactorFormatted }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
  <!-- M0 Cost Table -->
  <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
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
            <div class="hidden md:block m0-table">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-800 border-b border-gray-700">
                    <th v-for="column in columnCount" :key="column" class="px-3 py-2 border-r border-gray-700 last:border-r-0">
                      <div>
                        <div class="text-xs text-gray-400 mb-1 text-center">Levels {{ getColumnStartLevel(column) }}-{{ getColumnEndLevel(column) }}</div>
                        <div class="grid grid-cols-2 gap-1 text-xs">
                          <span class="text-left">Level</span>
                          <span class="text-left flex items-center">
                            Cost
                          </span>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in maxRowsPerColumn" :key="row" 
                      :class="[
                        'border-b hover:bg-gray-750/50 transition-all duration-200',
                        // Prüfe ob es Level gibt die auf 0 enden in dieser Reihe
                        hasLevelEndingInZero(row) ? 'border-gray-500 border-b-1' : 'border-gray-700/30'
                      ]"
                  >
                    <td v-for="column in columnCount" :key="column" class="px-1 py-2 border-r border-gray-700 last:border-r-0">
                      <div v-if="getCostForPosition(column, row)" 
                           class="grid grid-cols-2 gap-1 text-sm rounded px-2 py-1 transition-colors">
                        <span class="text-white font-medium text-left">{{ getCostForPosition(column, row).level }}</span>
                        <div class="text-left">
                          <span class="text-yellow-400">
                            <img :src="shardsIcon" alt="Shards" :class="`${desktopIconSize} inline mr-0.5 mb-1`" />
                            {{ getCostForPosition(column, row).rawCost.e }}
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
            <div class="md:hidden m0-mobile">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-800 border-b border-gray-700">
                    <th class="px-4 py-2 w-[30%]">Level</th>
                    <th class="px-4 py-2 flex items-center">
                      Cost (Exponent)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="cost in filteredCosts" 
                    :key="cost.level"
                    :class="[
                      'border-b transition-all duration-200 hover:bg-gray-750/50',
                      // Dickere Linie nach Leveln die auf 0 enden (xx0)
                      cost.level % 10 === 0 ? 'border-gray-500 border-b-2' : 'border-gray-700/30'
                    ]"
                  >
                    <td class="px-4 py-3 font-medium text-white">
                      {{ cost.level }}
                    </td>
                    <td class="px-4 py-3">
                      <img :src="shardsIcon" alt="Shards" class="w-4 h-4 inline mr-2" />
                      <span class="text-yellow-400">{{ cost.rawCost.e }}</span>
                      <span v-if="cost.difference !== null" class="text-gray-400 text-xs ml-2">
                        ({{ cost.difference.formatted }})
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { 
  IconFilter, 
  IconRefresh, 
  IconList, 
  IconSearch,
  IconX
} from '@tabler/icons-vue';
import { getM0Cost, formatM0Cost, getM0CostDecimal } from '@/utils/m0CostUtils.js';
import { formatNumberDecimal } from '@/composables/format';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import shardsIcon from '@/assets/general/shards.png';
import { useGemPlannerStore } from '@/store/gemPlannerStore.js';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import Decimal from 'break_infinity.js';

// Filter States
const currentM0Level = ref(1);
const levelRange = ref(10);
const currentM0LevelRaw = ref(1);
const levelRangeRaw = ref(10);

// Modal State
const showCostListModal = ref(false);

// Initialize gem planner store
const gemPlannerStore = useGemPlannerStore();

// Cost List for Modal
const costList = computed(() => {
  const lines = [];
  for (let level = 1; level <= 1000; level++) {
    const cost = getM0CostDecimal(level);
    lines.push(`${formatNumberDecimal(cost)}`);
  }
  return lines.join('\n');
});

// Generic smooth transition wrapper
function withSmoothTransition(updateFn) {
  if (document.startViewTransition) {
    document.documentElement.classList.add('in-page-transition');
    const transition = document.startViewTransition(() => {
      updateFn();
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove('in-page-transition');
    });
  } else {
    updateFn();
  }
}

// Exodus Gem Node #4 States (automatically from gem store)
const exodusNode4Active = computed(() => {
  const exodusGemState = gemPlannerStore.getGemState('exodus');
  return exodusGemState?.nodes?.[3] || false; // Node #4 ist Index 3
});

const totalGemLevels = computed(() => {
  let total = 0;
  
  // Power gem upgrades zählen
  const powerGemState = gemPlannerStore.getGemState('power');
  if (powerGemState?.upgrades) {
    Object.values(powerGemState.upgrades).forEach(level => {
      total += level || 0;
    });
  }
  
  // Attraction gem upgrades zählen
  const attractionGemState = gemPlannerStore.getGemState('attraction');
  if (attractionGemState?.upgrades) {
    Object.values(attractionGemState.upgrades).forEach(level => {
      total += level || 0;
    });
  }
  
  return total;
});

// Cost Reduction Factor - korrekte Formel: 30^level für jeden upgrade
const costReductionFactor = computed(() => {
  if (!exodusNode4Active.value || totalGemLevels.value === 0) return new Decimal(1);
  
  let factor = new Decimal(1);
  
  // Power gem upgrades - 30^level für jeden upgrade
  const powerGemState = gemPlannerStore.getGemState('power');
  if (powerGemState?.upgrades) {
    Object.values(powerGemState.upgrades).forEach(level => {
      if (level > 0) {
        const upgradeReduction = new Decimal(30).pow(level);
        factor = factor.mul(upgradeReduction);
      }
    });
  }
  
  // Attraction gem upgrades - 30^level für jeden upgrade
  const attractionGemState = gemPlannerStore.getGemState('attraction');
  if (attractionGemState?.upgrades) {
    Object.values(attractionGemState.upgrades).forEach(level => {
      if (level > 0) {
        const upgradeReduction = new Decimal(30).pow(level);
        factor = factor.mul(upgradeReduction);
      }
    });
  }
  
  return factor;
});

// Format cost reduction factor in full E notation
const costReductionFactorFormatted = computed(() => {
  const factor = costReductionFactor.value;
  if (factor.eq(1)) return '1';
  
  // Always show full E notation like 1.24e234 (without + sign)
  return factor.toExponential(2).replace('e+', 'e');
});

// Handler functions
function handleCurrentM0LevelUpdate(newVal) {
  currentM0Level.value = newVal;
  currentM0LevelRaw.value = newVal;
}

function handleLevelRangeUpdate(newVal) {
  levelRange.value = newVal;
  levelRangeRaw.value = newVal;
}

function finalizeCurrentM0Level() {
  const numValue = Number(currentM0LevelRaw.value);
  if (!isNaN(numValue)) {
    withSmoothTransition(() => {
      // Jeder Level zwischen 1 und 1000 ist erlaubt
      currentM0Level.value = Math.max(1, Math.min(1000, Math.round(numValue)));
      currentM0LevelRaw.value = currentM0Level.value;
      saveFilters();
    });
  }
}

function finalizeLevelRange() {
  const numValue = Number(levelRangeRaw.value);
  if (!isNaN(numValue)) {
    withSmoothTransition(() => {
      // Range muss durch 10 teilbar sein, mindestens 10
      const adjustedValue = Math.round(numValue / 10) * 10;
      levelRange.value = Math.max(10, Math.min(100, adjustedValue));
      levelRangeRaw.value = levelRange.value;
      saveFilters();
    });
  }
}

// Computed
const filteredCosts = computed(() => {
  const result = [];
  // Tabelle beginnt mit dem exakten current m0 Level
  const startLevel = currentM0Level.value;
  const endLevel = Math.min(startLevel + levelRange.value - 1, 1000);
  
  for (let level = startLevel; level <= endLevel; level++) {
    let costDecimal = getM0CostDecimal(level);
    
    // Apply Exodus Gem Node #4 buff if active
    if (exodusNode4Active.value && !costReductionFactor.value.eq(1)) {
      costDecimal = costDecimal.div(costReductionFactor.value);
    }
    
    const formattedCost = formatM0Cost(costDecimal);
    
    let prevCostDecimal = level > 1 ? getM0CostDecimal(level - 1) : null;
    if (prevCostDecimal && exodusNode4Active.value && !costReductionFactor.value.eq(1)) {
      prevCostDecimal = prevCostDecimal.div(costReductionFactor.value);
    }
    
    let difference = null;
    if (prevCostDecimal) {
      if (level <= 10) {
        // Für Level 1-10: Echte Kostendifferenz
        const realDifference = costDecimal.sub(prevCostDecimal);
        difference = {
          type: 'cost',
          value: realDifference,
          formatted: formatM0Cost(realDifference)
        };
      } else {
        // Für Level 11+: Exponentendifferenz mit break_infinity
        const exponent = costDecimal.e;
        const prevExponent = prevCostDecimal.e;
        const expDifference = exponent - prevExponent;
        difference = {
          type: 'exponent',
          value: expDifference,
          formatted: `+${Math.round(expDifference)}`
        };
      }
    }
    
    result.push({
      level,
      exponent: costDecimal.e,
      difference,
      formattedCost,
      rawCost: costDecimal
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
  // Jede Spalte beginnt mit Start + (column-1)*10
  const startLevel = currentM0Level.value;
  return startLevel + (column - 1) * 10;
}

function getColumnEndLevel(column) {
  const start = getColumnStartLevel(column);
  const startLevel = currentM0Level.value;
  return Math.min(start + 9, startLevel + levelRange.value - 1, 1000);
}

function getCostForPosition(column, row) {
  const startLevel = currentM0Level.value + 1;
  const level = startLevel + (column - 1) * 10 + (row - 1);
  const maxLevel = Math.min(startLevel + levelRange.value - 1, 1000);
  
  if (level > maxLevel) return null;
  
  let costDecimal = getM0CostDecimal(level);
  
  // Apply Exodus Gem Node #4 buff if active
  if (exodusNode4Active.value && !costReductionFactor.value.eq(1)) {
    costDecimal = costDecimal.div(costReductionFactor.value);
  }
  
  let prevCostDecimal = level > 1 ? getM0CostDecimal(level - 1) : null;
  if (prevCostDecimal && exodusNode4Active.value && !costReductionFactor.value.eq(1)) {
    prevCostDecimal = prevCostDecimal.div(costReductionFactor.value);
  }
  
  const difference = prevCostDecimal ? costDecimal.e - prevCostDecimal.e : null;
  
  return {
    level,
    exponent: costDecimal.e,
    difference,
    rawCost: costDecimal
  };
}

function hasLevelEndingInZero(row) {
  // Prüfe ob in dieser Reihe ein Level existiert das auf 0 endet
  for (let column = 1; column <= columnCount.value; column++) {
    const cost = getCostForPosition(column, row);
    if (cost && cost.level % 10 === 0) {
      return true;
    }
  }
  return false;
}

function resetFilters() {
  withSmoothTransition(() => {
    currentM0Level.value = 1;
    levelRange.value = 10;
    currentM0LevelRaw.value = 1;
    levelRangeRaw.value = 10;
    exodusNode4Active.value = false;
    totalGemLevels.value = 0;
    totalGemLevelsRaw.value = 0;
    saveFilters();
  });
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
    if (savedFilters.exodusNode4Active !== undefined) {
      exodusNode4Active.value = Boolean(savedFilters.exodusNode4Active);
    }
    if (savedFilters.totalGemLevels !== undefined) {
      totalGemLevels.value = Number(savedFilters.totalGemLevels);
      totalGemLevelsRaw.value = totalGemLevels.value;
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

// ESC key handling for modal
function handleKeydown(event) {
  if (event.key === 'Escape' && showCostListModal.value) {
    showCostListModal.value = false;
  }
}

// Lifecycle
onMounted(() => {
  loadFilters();
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

/* View Transition Names für isolierte Animationen */
.m0-table {
  view-transition-name: m0-table;
}

.m0-mobile {
  view-transition-name: m0-mobile;
}

/* Mobile responsive */
@media (max-width: 640px) {
  th, td {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
