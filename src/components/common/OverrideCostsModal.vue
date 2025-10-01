<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] flex flex-col animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center flex-shrink-0">
        <h2 class="text-base sm:text-lg font-bold text-white flex items-center">
          <IconCurrencyDollar size="16" class="mr-2 sm:mr-2" :class="`text-${hunterColor}-400`" />
          <span class="hidden sm:inline">Override Costs: </span>
          <span class="sm:hidden">Costs: </span>
          <span class="truncate">{{ buildName }}</span>
        </h2>
        <button @click="$emit('close')" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors flex-shrink-0">
          <IconX size="16" />
        </button>
      </div>

      <!-- Scrollable Content Container -->
      <div class="flex-1 overflow-y-auto min-h-0">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center p-8">
          <div class="flex items-center text-gray-300">
            <IconLoader2 size="20" class="animate-spin mr-2" />
            Calculating override costs...
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="p-6 text-center">
          <div class="text-red-400 mb-4">Error calculating costs: {{ loadError }}</div>
          <button @click="calculateCosts" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
            Retry
          </button>
        </div>

        <!-- Content when data is ready -->
        <div v-else-if="dataReady" :key="dataKey" class="p-3 sm:p-4">
          <!-- Main Content with Parameters -->
          <div v-if="overrideParameters.length > 0">
            <div class="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">
              This overview shows the cost differences between your global values and the override values used in this build.
            </div>

            <!-- Categories -->
            <div class="space-y-6">
            <div 
              v-for="(cat, idx) in parameterCategories" 
              :key="`cat-${idx}`"
              class="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden"
            >
              <!-- Category Header -->
              <div class="bg-gray-800 p-3 sm:p-4 border-b border-gray-700">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <div class="flex items-center">
                    <component :is="cat.icon" size="18" :class="cat.iconColor" class="mr-2 sm:mr-3 flex-shrink-0" />
                    <h3 class="text-base sm:text-lg font-semibold text-white">{{ cat.name }}</h3>
                    <span class="ml-2 sm:ml-3 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                      {{ cat.parameters.length }} upgrade{{ cat.parameters.length !== 1 ? 's' : '' }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                    <!-- Currency breakdown for this category -->
                    <template v-for="(curTotal, curKey) in cat.currencyTotals" :key="`${idx}-${curKey}`">
                      <div 
                        v-if="curTotal > 0"
                        class="flex items-center text-xs sm:text-sm"
                      >
                        <img 
                          v-if="hasIcon(curKey)" 
                          :src="icons[curKey]" 
                          :alt="currencyLabels[curKey]" 
                          class="w-4 h-4 sm:w-6 sm:h-6 mr-1"
                        />
                        <component 
                          v-else
                          :is="getCurrencyIcon(curKey)" 
                          size="14" 
                          :class="getCurrencyColor(curKey)" 
                          class="mr-1"
                        />
                        <span class="text-yellow-400 font-medium">{{ formatCost(curTotal) }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Desktop Table View -->
              <div class="hidden md:block overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-800/50 border-b border-gray-700">
                      <th class="py-3 px-4 text-left text-gray-300 font-medium">Upgrade</th>
                      <th class="py-3 px-4 text-center text-gray-300 font-medium">Global</th>
                      <th class="py-3 px-4 text-center text-gray-300 font-medium">Override</th>
                      <th class="py-3 px-4 text-center text-gray-300 font-medium">Difference</th>
                      <th class="py-3 px-4 text-center text-gray-300 font-medium">Resource</th>
                      <th class="py-3 px-4 text-right text-gray-300 font-medium">Cost</th>
                      <th class="py-3 px-4 text-right text-gray-300 font-medium">Collection Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="(param, paramIdx) in cat.parameters" 
                      :key="`param-${idx}-${paramIdx}`"
                      class="border-b border-gray-700 hover:bg-gray-800/30"
                    >
                      <td class="py-3 px-4">
                        <div class="flex items-center">
                          <span class="text-white font-medium">{{ param.label }}</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-center">
                        <span class="text-gray-300">{{ formatWholeNumber(param.globalValue) }}</span>
                      </td>
                      <td class="py-3 px-4 text-center">
                        <span class="text-blue-300 font-medium">{{ formatWholeNumber(param.overrideValue) }}</span>
                      </td>
                      <td class="py-3 px-4 text-center">
                        <span 
                          :class="param.difference > 0 ? 'text-green-400' : param.difference < 0 ? 'text-red-400' : 'text-gray-400'"
                          class="font-medium"
                        >
                          {{ formatWholeNumber(param.difference) }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-center">
                        <div class="flex items-center justify-center">
                          <img 
                            v-if="hasIcon(param.currency)" 
                            :src="icons[param.currency]" 
                            :alt="currencyLabels[param.currency]" 
                            class="w-6 h-6 mr-1"
                          />
                          <component 
                            v-else
                            :is="getCurrencyIcon(param.currency)" 
                            size="15" 
                            :class="getCurrencyColor(param.currency)" 
                            class="mr-1"
                          />
                        </div>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <span 
                          :class="param.cost > 0 ? 'text-yellow-400 font-medium' : 'text-gray-400'"
                        >
                          {{ param.cost > 0 ? formatCost(param.cost) : '-' }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <span class="text-cyan-400 font-medium">
                          {{ formatCollectionTime(calculateCollectionTime(param.cost, param.currency)) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Card View -->
              <div class="md:hidden space-y-3 p-4">
                <div 
                  v-for="(param, paramIdx) in cat.parameters" 
                  :key="`param-mobile-${idx}-${paramIdx}`"
                  class="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
                >
                  <!-- Parameter Name -->
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-white font-medium">{{ param.label }}</h4>
                    <div class="flex items-center">
                      <img 
                        v-if="hasIcon(param.currency)" 
                        :src="icons[param.currency]" 
                        :alt="currencyLabels[param.currency]" 
                        class="w-5 h-5"
                      />
                      <component 
                        v-else
                        :is="getCurrencyIcon(param.currency)" 
                        size="16" 
                        :class="getCurrencyColor(param.currency)"
                      />
                    </div>
                  </div>

                  <!-- Values Grid -->
                  <div class="grid grid-cols-2 gap-3 text-sm">
                    <!-- Global Value -->
                    <div>
                      <div class="text-gray-400 text-xs mb-1">Global</div>
                      <div class="text-gray-300 font-medium">{{ formatWholeNumber(param.globalValue) }}</div>
                    </div>

                    <!-- Override Value -->
                    <div>
                      <div class="text-gray-400 text-xs mb-1">Override</div>
                      <div class="text-blue-300 font-medium">{{ formatWholeNumber(param.overrideValue) }}</div>
                    </div>

                    <!-- Difference -->
                    <div>
                      <div class="text-gray-400 text-xs mb-1">Difference</div>
                      <div 
                        :class="param.difference > 0 ? 'text-green-400' : param.difference < 0 ? 'text-red-400' : 'text-gray-400'"
                        class="font-medium"
                      >
                        {{ formatWholeNumber(param.difference) }}
                      </div>
                    </div>

                    <!-- Cost -->
                    <div>
                      <div class="text-gray-400 text-xs mb-1">Cost</div>
                      <div 
                        :class="param.cost > 0 ? 'text-yellow-400' : 'text-gray-400'"
                        class="font-medium"
                      >
                        {{ param.cost > 0 ? formatCost(param.cost) : '-' }}
                      </div>
                    </div>
                  </div>

                  <!-- Collection Time -->
                  <div class="mt-3 pt-3 border-t border-gray-700">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-400 text-xs">Collection Time</span>
                      <span class="text-cyan-400 font-medium text-sm">
                        {{ formatCollectionTime(calculateCollectionTime(param.cost, param.currency)) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Cards -->
          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <template v-for="(curType, sumIdx) in availableCurrencies" :key="`sum-${sumIdx}`">
              <div 
                v-if="currencyTotals[curType] > 0"
                class="bg-gray-800/50 rounded-lg border border-gray-700 p-3 sm:p-4"
              >
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center">
                    <img 
                      v-if="hasIcon(curType)" 
                      :src="icons[curType]" 
                      :alt="currencyLabels[curType]" 
                      class="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                    />
                    <component 
                      v-else
                      :is="getCurrencyIcon(curType)" 
                      size="16" 
                      :class="getCurrencyColor(curType)" 
                      class="mr-2 sm:w-5 sm:h-5"
                    />
                    <span class="text-gray-300 font-medium text-sm sm:text-base">{{ currencyLabelsShort[curType] }}</span>
                  </div>
                </div>
                <div class="text-lg sm:text-xl font-bold text-yellow-400">
                  {{ formatCost(currencyTotals[curType]) }}
                </div>
                <div class="text-xs sm:text-sm font-medium text-cyan-400 mt-1">
                  {{ formatCollectionTime(calculateCollectionTime(currencyTotals[curType], curType)) }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  {{ getTotalParametersForCurrency(curType) }} upgrade{{ getTotalParametersForCurrency(curType) !== 1 ? 's' : '' }}
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- No Overrides State -->
        <div v-else class="p-4 text-center">
          <IconInfoCircle size="40" class="mx-auto text-gray-500 mb-3 sm:mb-4" />
          <h3 class="text-base sm:text-lg font-medium text-gray-300 mb-2">No Override Costs</h3>
          <p class="text-sm sm:text-base text-gray-400 max-w-md mx-auto leading-relaxed">
            This build has no overrides that incur costs, or all overrides are at or below global values.
          </p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  IconX, IconCurrencyDollar, IconLoader2, IconInfoCircle,
  IconDiamond, IconHexagon, IconCoins, IconBolt, IconSword,
  IconShield, IconTool, IconWriting, IconMicroscope, IconHammer,
  IconCrane, IconStar
} from '@tabler/icons-vue';
import { useLootIcons } from '../../composables/useLootIcons';
import { useHunterStore } from '../../store/hunterStore';
import { getHunterById } from '../../constants/hunters';
import { calcCostDifference, formatCost, calcKnoxSalvoCostDifference } from '../../utils/statCostUtils';
import { calcRelicCostDifference } from '../../utils/relicCostUtils';
import { calcGadgetCostDifference } from '../../utils/gadgetCostUtils';
import { calcInscryptionCostDifference } from '../../utils/inscryptionCostUtils';

// Simple number formatter for whole numbers (no decimals for levels)
function formatWholeNumber(value) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

// Format collection time (copied from UpgradeComparisonModal)
function formatCollectionTime(minutes) {
  if (!isFinite(minutes) || minutes <= 0) {
    return '-';
  }
  
  // Check if over 100 years (100 * 365 days * 1440 minutes)
  if (minutes > 52560000) { // 100 years in minutes
    return 'Not in your lifetime';
  }
  
  // Convert to time units
  const years = Math.floor(minutes / 525600); // 365 days * 1440 minutes
  const days = Math.floor((minutes % 525600) / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.floor(minutes % 60);
  
  // Format based on the longest time unit
  if (years > 0) {
    return `${years}y ${days}d`; 
  } else if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else {
    return `${mins}m`;
  }
}

// Get currency material type (adapted from UpgradeComparisonModal)
function getCurrencyMaterial(currencyType) {
  const currencyMaterials = {
    mat1: 'mat1',
    mat2: 'mat2', 
    mat3: 'mat3',
    obs: 'mat1',     // Obsidian uses mat1
    beh: 'mat2',     // Behemoth uses mat2
    hbm: 'mat3'      // HBM uses mat3
  };
  
  return currencyMaterials[currencyType];
}

// Calculate collection time for a cost amount (adapted from UpgradeComparisonModal) 
function calculateCollectionTime(cost, currencyType) {
  if (cost <= 0) return 0;
  
  // Special cases for fragment currencies
  if (currencyType === 'frags') {
    // Need fragment income - would need to be configured
    return Infinity; // For now, can't calculate without user input
  }
  
  if (currencyType === 'hbm') {
    // Need HBM income - would need to be configured  
    return Infinity; // For now, can't calculate without user input
  }
  
  // Standard material currencies
  const materialType = getCurrencyMaterial(currencyType);
  
  if (!materialType || !evaluationResults.value || !evaluationResults.value[materialType]) {
    return Infinity;
  }
  
  // Material per run
  const materialPerRun = evaluationResults.value[materialType];
  if (materialPerRun <= 0) return Infinity;
  
  // Run duration
  const avgRunTimeMinutes = evaluationResults.value.avgTime || 120;
  
  // Needed runs
  const runsNeeded = cost / materialPerRun;
  
  // Total time in minutes
  return runsNeeded * avgRunTimeMinutes;
}

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  hunterId: { type: String, required: true },
  buildData: { type: Object, required: true }
});

const emit = defineEmits(['close']);

// Store
const hunterStore = useHunterStore();

// UI State
const isLoading = ref(true);
const loadError = ref(null);
const overrideParameters = ref([]);
const currencyTotals = ref({});
const parameterCategories = ref([]);
const evaluationResults = ref(null);

// Hunter und Upgrade-Parameter
const hunterModule = ref(null);
const availableCurrencies = ref([]);
const currencyLabels = ref({});
const currencyLabelsShort = ref({}); 
const upgradesByCurrency = ref({});

// Hunter-Informationen aus den Konstanten holen
const hunterInfo = computed(() => getHunterById(props.hunterId));
const hunterName = computed(() => hunterInfo.value.name);
const hunterColor = computed(() => hunterInfo.value.color);
const buildName = computed(() => props.buildData.name || 'Unnamed Build');

// Computed property to check if all data is ready
const isDataReady = computed(() => {
  return !isLoading.value && 
         !loadError.value && 
         availableCurrencies.value.length > 0 && 
         parameterCategories.value.length > 0;
});

// Data ready state and unique key for re-rendering
const dataReady = computed(() => {
  return !isLoading.value && 
         !loadError.value && 
         parameterCategories.value !== null;
});

const dataKey = computed(() => {
  return `${props.hunterId}-${overrideParameters.value.length}-${parameterCategories.value.length}`;
});

// Verwende das useLootIcons Composable
const { icons, hasIcon } = useLootIcons(props.hunterId);

// Load hunter data and calculate costs
async function loadHunterData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Reset data
    parameterCategories.value = [];
    overrideParameters.value = [];
    currencyTotals.value = {};

    // Get evaluation results from build data (same pattern as UpgradeComparisonModal)
    if (props.buildData?.results) {
      evaluationResults.value = {...props.buildData.results};
      console.log('OverrideCostsModal: Using evaluation results from buildData:', evaluationResults.value);
    } else {
      evaluationResults.value = null;
      console.warn('OverrideCostsModal: No evaluation results found in buildData');
    }

    // Hunter-Modul dynamisch laden
    const currentHunter = hunterInfo.value;
    if (!currentHunter) {
      throw new Error('Hunter not found');
    }
    
    // Hunter-Modul importieren über die statsModule-Funktion
    hunterModule.value = await currentHunter.statsModule();
    
    if (!hunterModule.value || !hunterModule.value.CURRENCY_TYPES) {
      throw new Error('Hunter module or currency types not found');
    }
    
    // Konstanten extrahieren
    currencyLabels.value = hunterModule.value.CURRENCY_LABELS || {};
    currencyLabelsShort.value = hunterModule.value.CURRENCY_LABELS_SHORT || {};
    upgradesByCurrency.value = hunterModule.value.UPGRADES_BY_CURRENCY || {};
    availableCurrencies.value = Object.keys(upgradesByCurrency.value);
    
    // Kosten berechnen
    await calculateCosts();
    
    isLoading.value = false;
  } catch (error) {
    console.error('[OverrideCostsModal] Error loading hunter data:', error);
    loadError.value = error.message;
    isLoading.value = false;
  }
}

// Calculate override costs
async function calculateCosts() {
  try {
    const buildOverrides = props.buildData.overrides || {};
    const parameters = [];
    const totals = {};
    
    // Initialize currency totals
    availableCurrencies.value.forEach(currency => {
      totals[currency] = 0;
    });
    
    // Iterate through all overrides
    for (const [overrideKey, overrideValue] of Object.entries(buildOverrides)) {
      const globalValue = getGlobalValue(overrideKey);
      const difference = overrideValue - globalValue;
      
      // Only process if override is higher than global (costs money)
      if (difference > 0) {
        // Check if this is a multi-currency upgrade (Knox Salvo)
        if (overrideKey === 'proj' && props.hunterId === 'knox') {
          // Handle multi-currency upgrade - create one parameter entry per currency
          const multiCurrencyUpgrade = hunterModule.value.MULTI_CURRENCY_UPGRADES?.proj;
          if (multiCurrencyUpgrade) {
            Object.entries(multiCurrencyUpgrade.currencies).forEach(([currency, currencyInfo]) => {
              const cost = calcKnoxSalvoCostDifference(globalValue, overrideValue, currency);
              if (cost > 0) {
                parameters.push({
                  key: overrideKey,
                  label: `${multiCurrencyUpgrade.label} (${hunterModule.value.CURRENCY_LABELS_SHORT?.[currency] || currency})`,
                  globalValue,
                  overrideValue,
                  difference,
                  cost,
                  currency
                });
                totals[currency] += cost;
              }
            });
          }
        } else {
          // Handle regular single-currency upgrades
          const cost = await calculateParameterCost(overrideKey, globalValue, overrideValue);
          const currency = getCurrencyForParameter(overrideKey);
          const label = getParameterLabel(overrideKey);
          
          if (cost > 0 && currency) {
            parameters.push({
              key: overrideKey,
              label,
              globalValue,
              overrideValue,
              difference,
              cost,
              currency
            });
            
            totals[currency] += cost;
          }
        }
      }
    }
    
    overrideParameters.value = parameters;
    currencyTotals.value = totals;
    
    // Kategorisiere Parameter nur wenn availableCurrencies bereit ist
    if (availableCurrencies.value && availableCurrencies.value.length > 0) {
      categorizeParameters(parameters);
    } else {
      // Fallback: leere Kategorien setzen
      parameterCategories.value = [];
    }
    
  } catch (error) {
    console.error('[OverrideCostsModal] Error calculating costs:', error);
    loadError.value = error.message;
  }
}

// Categorize parameters into logical groups
function categorizeParameters(parameters) {
  // Sicherheitsprüfung für availableCurrencies
  if (!availableCurrencies.value || availableCurrencies.value.length === 0) {
    console.warn('[OverrideCostsModal] availableCurrencies not ready for categorization');
    parameterCategories.value = [];
    return;
  }

  const categories = [
    {
      name: 'Base Stats',
      icon: IconSword,
      iconColor: 'text-red-400',
      parameters: [],
      currencyTotals: {}
    },
    {
      name: 'Relics',
      icon: IconShield,
      iconColor: 'text-purple-400', 
      parameters: [],
      currencyTotals: {}
    },
    {
      name: 'Gadgets',
      icon: IconTool,
      iconColor: 'text-green-400',
      parameters: [],
      currencyTotals: {}
    },
    {
      name: 'Inscryptions',
      icon: IconWriting,
      iconColor: 'text-blue-400',
      parameters: [],
      currencyTotals: {}
    },
    {
      name: 'Gem Nodes',
      icon: IconDiamond,
      iconColor: 'text-cyan-400',
      parameters: [],
      currencyTotals: {}
    },
    {
      name: 'Research & Milestones',
      icon: IconMicroscope,
      iconColor: 'text-orange-400',
      parameters: [],
      currencyTotals: {}
    },
    {
      name: 'Other Upgrades',
      icon: IconStar,
      iconColor: 'text-yellow-400',
      parameters: [],
      currencyTotals: {}
    }
  ];

  // Initialize currency totals for each category
  categories.forEach(category => {
    if (availableCurrencies.value && availableCurrencies.value.length > 0) {
      availableCurrencies.value.forEach(currency => {
        category.currencyTotals[currency] = 0;
      });
    }
  });

  // Categorize each parameter
  parameters.forEach(param => {
    let categoryIndex = 6; // Default to "Other Upgrades"
    
    if (!param.key.startsWith('upgrades.')) {
      // Base stats
      categoryIndex = 0;
    } else if (param.key.startsWith('upgrades.relics.')) {
      categoryIndex = 1;
    } else if (param.key.startsWith('upgrades.gadgets.')) {
      categoryIndex = 2;
    } else if (param.key.startsWith('upgrades.inscryptions.')) {
      categoryIndex = 3;
    } else if (param.key.startsWith('upgrades.gems_nodes.')) {
      categoryIndex = 4;
    } else if (param.key.startsWith('upgrades.researches.') || 
               param.key.startsWith('upgrades.cms.') ||
               param.key.startsWith('upgrades.shardmilestones.')) {
      categoryIndex = 5;
    }
    
    categories[categoryIndex].parameters.push(param);
    categories[categoryIndex].currencyTotals[param.currency] += param.cost;
  });

  // Only keep categories that have parameters
  parameterCategories.value = categories.filter(cat => cat.parameters.length > 0);
}

// Get global value for a parameter
function getGlobalValue(key) {
  // For upgrades
  if (key.startsWith('upgrades.')) {
    const parts = key.split('.');
    const upgradeType = parts[1]; // z.B. "relics"
    const upgradeId = parts[2];   // z.B. "r4"
    
    return hunterStore.upgrades?.[upgradeType]?.[upgradeId] || 0;
  }
  
  // For base stats
  return hunterStore.hunterStats?.[props.hunterId]?.[key] || 0;
}

// Calculate cost for a parameter upgrade
async function calculateParameterCost(key, fromLevel, toLevel) {
  try {
    // Für Relics
    if (key.startsWith('upgrades.relics.')) {
      const relicId = key.split('.')[2]; // Extrahiert 'r4'
      const relicType = `r${relicId.substring(1)}`; // Converts 'r4' to 'r4'
      return calcRelicCostDifference(relicType, fromLevel, toLevel);
    }
    
    // Für Gadgets
    if (key.startsWith('upgrades.gadgets.')) {
      const gadgetId = key.split('.')[2]; // Extrahiert 'wrench'
      return calcGadgetCostDifference(gadgetId, fromLevel, toLevel);
    }

    // Für Inscryptions
    if (key.startsWith('upgrades.inscryptions.')) {
      const inscryptionId = key.split('.')[2]; // Extrahiert 'i80'
      return calcInscryptionCostDifference(inscryptionId, fromLevel, toLevel);
    }

    // Für Gems (Orb-Kosten) - TODO: Add when orb cost utils are available
    // if (key.startsWith('upgrades.gems_nodes.')) {
    //   return calcOrbCostDifference(key, fromLevel, toLevel);
    // }

    // Für Stat-Kosten (basierend auf statCostUtils)
    return calcCostDifference(key, fromLevel, toLevel, props.hunterId);
    
  } catch (error) {
    console.error(`[OverrideCostsModal] Error calculating cost for ${key}:`, error);
    return 0;
  }
}

// Get currency type for a parameter
function getCurrencyForParameter(key) {
  // Search through all currencies to find which one contains this parameter
  for (const [currency, upgrades] of Object.entries(upgradesByCurrency.value)) {
    if (upgrades.some(upgrade => upgrade.key === key)) {
      return currency;
    }
  }
  
  // Fallback for base stats not in UPGRADES_BY_CURRENCY
  if (hunterModule.value?.UPGRADE_CURRENCIES) {
    return hunterModule.value.UPGRADE_CURRENCIES[key];
  }
  
  return null;
}

// Get human-readable label for a parameter
function getParameterLabel(key) {
  // Search through all currencies to find the label
  for (const upgrades of Object.values(upgradesByCurrency.value)) {
    const upgrade = upgrades.find(u => u.key === key);
    if (upgrade) {
      return upgrade.label;
    }
  }
  
  // Fallback to key
  return key.split('.').pop() || key;
}

// Get parameters for a specific currency
function getParametersForCurrency(currency) {
  return overrideParameters.value.filter(param => param.currency === currency);
}

// Get total parameters count for a currency across all categories
function getTotalParametersForCurrency(currency) {
  return overrideParameters.value.filter(param => param.currency === currency).length;
}

// Icons für die Währungen
function getCurrencyIcon(currencyType) {
  if (hasIcon(currencyType)) {
    return null; // Use image instead
  }
  
  const fallbackIcons = {
    mat1: IconCoins,
    mat2: IconHexagon, 
    mat3: IconBolt,
    frags: IconDiamond
  };
  
  return fallbackIcons[currencyType] || IconDiamond;
}

// Farbe für die Währungs-Icons
function getCurrencyColor(currencyType) {
  const colors = {
    mat1: 'text-red-400',
    mat2: 'text-orange-400', 
    mat3: 'text-amber-400',
    frags: 'text-purple-400'
  };
  
  return colors[currencyType] || 'text-white';
}

// Watch for visibility changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadHunterData();
  }
});

// Watch for hunterId changes
watch(() => props.hunterId, () => {
  if (props.isVisible) {
    loadHunterData();
  }
});

onMounted(() => {
  if (props.isVisible) {
    loadHunterData();
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

/* Styling für Scrollbars */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.2);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.8);
}
</style>