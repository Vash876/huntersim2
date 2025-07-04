<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white">
        <span>Research Overview</span>
      </h2>
      
      <!-- Info Banner -->
      <div class="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-4 text-center">
        <p class="text-blue-200 text-sm">
          This tool displays all Researches starting at Research #21.
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
            <!-- RP Value Filter -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-300 text-sm">All Time Highest RP (e)</span>
                  <InfoTooltip 
                    content="This value filters out permanent Researches (Dark type) that you have already purchased. Enter the highest RP you've ever reached to hide Researches you already own."
                    placement="top"
                  />
                </div>
                <ToolValueControls
                  :value="allTimeHighestRP"
                  :minValue="0"
                  :maxValue="99999"
                  :step="10"
                  :fastStep="100"
                  :validateOnFinalOnly="true"
                  @update:value="handleAllTimeHighestRPUpdate"
                  @update:raw-value="(val) => allTimeHighestRPRaw = val"
                  @finalize:value="finalizeAllTimeHighestRP"
                  value-class="text-red-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>
              
              <!-- Current RP Value Field -->
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm text-gray-300">Current RP Value (e)</span>
                <div class="flex items-center">
                <ToolValueControls
                  :value="rpValue"
                  :minValue="0"
                  :maxValue="15000"
                  :step="10"
                  :fastStep="100"
                  :validateOnFinalOnly="true"
                  @update:value="handleRpValueUpdate"
                  @update:raw-value="(val) => rpValueRaw = val"
                  @finalize:value="finalizeRpValue"
                  value-class="text-amber-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />                  
                </div>
              </div>
              
              <div class="mt-3 flex items-center justify-between">
                <span class="text-sm text-gray-300">RP Range</span>
                <div class="flex items-center">
                  <ToolValueControls
                    :value="rpRange"
                    :minValue="50"
                    :maxValue="10000"
                    :step="10"
                    :fastStep="100"
                    :validateOnFinalOnly="true"
                    @update:value="handleRpRangeUpdate"
                    @update:raw-value="(val) => rpRangeRaw = val" 
                    @finalize:value="finalizeRpRange"
                    class="ml-2"
                    :autoEdit="true"
                  />
                </div>
              </div>
            </div>
            
            <!-- Requirements -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-white text-sm">Requirements</span>
              </div>
              
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm text-gray-300">Innovation Gem Level</label>
                <ToolValueControls
                  :value="innovationLevel"
                  :minValue="0"
                  :maxValue="3"
                  :step="1"
                  :showFastControls="false"
                  :validateOnFinalOnly="true"
                  @update:value="handleInnovationLevelUpdate"
                  @update:raw-value="(val) => innovationLevelRaw = val"
                  @finalize:value="finalizeInnovationLevel"
                  value-class="text-purple-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Research Table -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconList size="18" class="mr-2 text-green-400" />
            Researches
            <span class="ml-2 text-sm font-normal text-gray-400">({{ filteredResearches.length }} results)</span>
          </h3>
        </div>
        
        <div class="p-2 sm:p-4">
          <!-- Loading state -->
          <div v-if="isLoading" class="p-4 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
            <p class="text-gray-400 text-sm">Loading Research data from Google Sheets...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="error" class="p-4 flex flex-col items-center justify-center">
            <IconSearch size="32" class="text-red-600 mb-2" />
            <p class="text-red-400 mb-2">{{ error }}</p>
            <button 
              @click="loadResearchData" 
              class="bg-red-600 hover:bg-red-500 text-white px-3 py-1 text-sm rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>

          <!-- No results state -->
          <div v-else-if="filteredResearches.length === 0" class="p-4 flex flex-col items-center justify-center">
            <IconSearch size="32" class="text-gray-600 mb-2" />
            <p class="text-gray-400">No researches match your filters</p>
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
                  <!-- Research - sortierbar -->
                  <th 
                    @click="updateSort('research')" 
                    class="px-4 py-2 cursor-pointer transition-colors w-[10%]"
                    :class="sortBy === 'research' ? 'bg-blue-800/50 hover:bg-blue-700/50' : 'hover:bg-gray-750'"
                  >
                    <div class="flex items-center">
                      Research
                      <IconChevronDown v-if="sortBy === 'research' && sortDirection === 'desc'" size="14" class="ml-1 text-blue-400" />
                      <IconChevronUp v-else-if="sortBy === 'research' && sortDirection === 'asc'" size="14" class="ml-1 text-blue-400" />
                      <IconChevronUp v-else size="14" class="ml-1 text-gray-500" />
                    </div>
                  </th>
                  
                  <!-- Rank - nicht sortierbar -->
                  <th class="px-4 py-2 w-[7%]">Rank</th>
                  
                  <!-- RP Cost - sortierbar -->
                  <th 
                    @click="updateSort('cost')" 
                    class="px-4 py-2 cursor-pointer transition-colors w-[15%]"
                    :class="sortBy === 'cost' ? 'bg-blue-800/50 hover:bg-blue-700/50' : 'hover:bg-gray-750'"
                  >
                    <div class="flex items-center">
                      RP Cost (e)
                      <IconChevronDown v-if="sortBy === 'cost' && sortDirection === 'desc'" size="14" class="ml-1 text-blue-400" />
                      <IconChevronUp v-else-if="sortBy === 'cost' && sortDirection === 'asc'" size="14" class="ml-1 text-blue-400" />
                      <IconChevronUp v-else size="14" class="ml-1 text-gray-500" />
                    </div>
                  </th>
                  
                  <!-- Effect - nicht sortierbar -->
                  <th class="px-4 py-2">Effect</th>
                  
                  <!-- Requirements - nicht sortierbar -->
                  <th class="px-4 py-2 w-[12%]">Requirements</th>
                </tr>
              </thead>
                <tbody>
                  <tr 
                    v-for="(research, index) in sortedResearches" 
                    :key="`${research.research}-${research.rank}`"
                    class="border-b hover:bg-gray-750/50 transition-all duration-200 relative research-row"
                    :class="[
                      getTypeBackgroundClass(research.type),
                      getBorderClass(research, index)
                    ]"
                  >
                    <td class="px-4 py-3 font-medium text-white">
                      {{ research.research }}
                    </td>
                    <td class="px-4 py-3 text-gray-300">
                      {{ research.rank }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center">
                        <img src="@/assets/general/rp.png" class="w-4 h-4 mr-1.5" alt="RP" />
                        <span class="text-amber-400 font-medium">{{ research.cost }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-300">
                      {{ research.effect }}
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-1">
                        <span 
                          v-if="research.requiresInnovation > 0" 
                          class="px-1.5 py-0.5 text-xs border rounded"
                          :class="getInnovationClass(research.requiresInnovation)"
                        >
                          Inno{{ research.requiresInnovation }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="text-center text-xs text-gray-400 mt-2">
        <span class="text-gray-500">Credits to</span>
        <span class="text-gray-300 font-medium mx-1">Farns</span>
        <span class="text-gray-500">for maintaining the data</span>
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
import { useResearchData } from '@/composables/useResearchData.js';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue'; 

// State
const isLoading = ref(true);
const researchData = ref([]);
const error = ref(null);

// Filter States
const rpValue = ref(0);
const rpRange = ref(50);
const allTimeHighestRP = ref(0);
const innovationLevel = ref(0);
const sortBy = ref('cost');
const sortDirection = ref('asc');
const rpValueRaw = ref(rpValue.value);
const rpRangeRaw = ref(rpRange.value);
const allTimeHighestRPRaw = ref(0);
const innovationLevelRaw = ref(0);

// Google Sheets Integration
const { fetchResearchData } = useResearchData();

// Handler functions
function handleRpValueUpdate(newVal) {
  rpValue.value = newVal;
  rpValueRaw.value = newVal;
  saveFilters();
}

function handleRpRangeUpdate(newVal) {
  rpRange.value = newVal;
  rpRangeRaw.value = newVal;
  saveFilters();
}

function finalizeRpValue() {
  const numValue = Number(rpValueRaw.value);
  if (!isNaN(numValue)) {
    rpValue.value = Math.max(0, Math.min(99999, numValue));
    rpValueRaw.value = rpValue.value;
    saveFilters();
  }
}

function finalizeRpRange() {
  const numValue = Number(rpRangeRaw.value);
  if (!isNaN(numValue)) {
    rpRange.value = Math.max(50, Math.min(10000, numValue));
    rpRangeRaw.value = rpRange.value;
    saveFilters();
  }
}

function handleAllTimeHighestRPUpdate(newVal) {
  allTimeHighestRP.value = newVal;
  allTimeHighestRPRaw.value = newVal;
  saveFilters();
}

function finalizeAllTimeHighestRP() {
  const numValue = Number(allTimeHighestRPRaw.value);
  if (!isNaN(numValue)) {
    allTimeHighestRP.value = Math.max(0, Math.min(99999, numValue));
    allTimeHighestRPRaw.value = allTimeHighestRP.value;
    saveFilters();
  }
}

function handleInnovationLevelUpdate(newVal) {
  innovationLevel.value = newVal;
  innovationLevelRaw.value = newVal;
  saveFilters();
}

function finalizeInnovationLevel() {
  const numValue = Number(innovationLevelRaw.value);
  if (!isNaN(numValue)) {
    innovationLevel.value = Math.max(0, Math.min(3, numValue));
    innovationLevelRaw.value = innovationLevel.value;
    saveFilters();
  }
}

// Computed
const filteredResearches = computed(() => {
  let result = researchData.value;

  // All Time Highest RP Filter - hide permanent dark researches already owned
  if (allTimeHighestRP.value > 0) {
    result = result.filter(research => {
      if (research.type === 'Dark' && research.cost <= allTimeHighestRP.value) {
        return false; // Filter out - already owned
      }
      return true;
    });
  }
  
  // RP Value Filter
  if (rpValue.value) {
    const rpVal = Number(rpValue.value);
    if (!isNaN(rpVal)) {
      const range = Number(rpRange.value);
      result = result.filter(research => 
        research.cost >= rpVal && 
        research.cost <= rpVal + range
      );
    }
  }
  
  // Innovation Level Filter
  result = result.filter(research => {
    if (!research.requiresInnovation) return true;
    return research.requiresInnovation <= innovationLevel.value;
  });
  
  return result;
});

const sortedResearches = computed(() => {
  let researches = [...filteredResearches.value];
  
  const sortFunctions = {
    research: (a, b) => {
      const researchResult = a.research - b.research;
      return researchResult !== 0 ? researchResult : a.rank - b.rank;
    },
    cost: (a, b) => a.cost - b.cost
  };
  
  researches.sort(sortFunctions[sortBy.value]);
  
  if (sortDirection.value === 'desc') {
    researches.reverse();
  }
  
  return researches;
});

// Methods
function updateSort(field) {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortDirection.value = 'asc';
  }
  saveFilters();
}

function resetFilters() {
  rpValue.value = 0;
  rpRange.value = 50;
  allTimeHighestRP.value = 0;
  innovationLevel.value = 0;
  sortBy.value = 'cost';
  sortDirection.value = 'asc';
  saveFilters();
}

// Funktion für dicke Linien zwischen Research-Gruppen
function getBorderClass(research, index) {
  // Nur bei Research-Sortierung
  if (sortBy.value !== 'research') {
    return 'border-gray-700/30';
  }
  
  // Prüfe ob nächste Zeile eine andere Research-Nummer hat
  const nextResearch = sortedResearches.value[index + 1];
  
  if (nextResearch && research.research !== nextResearch.research) {
    // Dicke Linie zwischen verschiedenen Research-Nummern
    return 'border-gray-500 border-b-2';
  }
  
  // Normale dünne Linie
  return 'border-gray-600/20';
}

function getTypeBackgroundClass(type) {
  return type === 'Dark' 
    ? 'research-dark' 
    : 'research-standard';
}

function getInnovationClass(innovationLevel) {
  switch(innovationLevel) {
    case 2:
      return 'bg-purple-900/50 text-purple-300 border-purple-700';
    case 3:
      return 'bg-orange-900/50 text-orange-300 border-orange-700';
    default:
      return 'bg-purple-900/50 text-purple-300 border-purple-700';
  }
}

function loadFilters() {
  try {
    const savedFilters = JSON.parse(localStorage.getItem('researchOverview_filters') || '{}');
    
    if (savedFilters.rpValue !== undefined && savedFilters.rpValue !== null) {
      rpValue.value = Number(savedFilters.rpValue);
    }
    if (savedFilters.allTimeHighestRP !== undefined && savedFilters.allTimeHighestRP !== null) {
      allTimeHighestRP.value = Number(savedFilters.allTimeHighestRP);
      allTimeHighestRPRaw.value = allTimeHighestRP.value;
    }
    if (savedFilters.rpRange !== undefined && savedFilters.rpRange !== null) {
      rpRange.value = Number(savedFilters.rpRange);
    }
    if (savedFilters.innovationLevel !== undefined) {
      innovationLevel.value = Number(savedFilters.innovationLevel);
    }
    if (savedFilters.sortBy !== undefined) sortBy.value = savedFilters.sortBy;
    if (savedFilters.sortDirection !== undefined) sortDirection.value = savedFilters.sortDirection;
  } catch (error) {
    console.error('Error loading saved filters:', error);
  }
}

function saveFilters() {
  try {
    localStorage.setItem('researchOverview_filters', JSON.stringify({
      rpValue: rpValue.value,
      rpRange: rpRange.value,
      allTimeHighestRP: allTimeHighestRP.value,
      innovationLevel: innovationLevel.value,
      sortBy: sortBy.value,
      sortDirection: sortDirection.value
    }));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

// Data Loading
async function loadResearchData() {
  try {
    isLoading.value = true;
    error.value = null;
    
    const data = await fetchResearchData();
    researchData.value = data;
    
    console.log(`Loaded ${data.length} researches`);
    
  } catch (err) {
    console.error('Failed to load research data:', err);
    error.value = 'Failed to load research data. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Watch
watch([rpValue, rpRange], () => {
  saveFilters();
});

// Lifecycle
onMounted(async () => {
  loadFilters();
  await loadResearchData();
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

.research-dark {
  background: linear-gradient(90deg, rgba(16, 20, 33, 0.6) 0%, rgba(31, 41, 55, 0.1) 100%);
}

.research-dark::before {
  background: linear-gradient(180deg, #4c51bf 0%, #5a67d8 100%);
}

.research-standard {
  background: linear-gradient(90deg, rgba(41, 24, 0, 0.6) 0%, rgba(31, 41, 55, 0.1) 100%);
}

.research-standard::before {
  background: linear-gradient(180deg, #d69e2e 0%, #f6ad55 100%);
}

.research-row:hover::before {
  width: 6px;
}

/* GEÄNDERT: Besserer Mobile Style ohne Tabellen-Layout zu zerstören */
@media (max-width: 640px) {
  th, td {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .research-row::before {
    width: 3px;
  }
  
  .research-row:hover::before {
    width: 4px;
  }
}
</style>