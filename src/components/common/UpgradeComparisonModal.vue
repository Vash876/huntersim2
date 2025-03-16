<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header with close button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 sticky top-0 z-10 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconScale size="20" class="mr-2" :class="`text-${hunterColor}-400`" />
          Upgrade Efficiency: {{ hunterName }}
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="p-6 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
        <p class="text-gray-400 text-sm">Loading hunter data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ loadError }}</p>
        <button 
          @click="loadHunterData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Retry
        </button>
      </div>

      <!-- Modal content -->
      <div v-else class="p-5">
        <div class="text-sm text-gray-300 mb-4">
          Compare different upgrade combinations to find the best cost-efficiency.
        </div>

        <!-- Currency Tabs -->
        <div class="mb-4">
          <div class="flex border-b border-gray-700 overflow-x-auto">
            <div 
              v-for="currency in availableCurrencies" 
              :key="currency"
              @click="selectedCurrency = currency"
              :class="[
                'px-4 py-2 cursor-pointer whitespace-nowrap flex items-center',
                selectedCurrency === currency 
                  ? 'border-b-2 border-blue-500 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              ]"
            >
              <component 
                :is="getCurrencyIcon(currency)" 
                :size="16" 
                :class="`text-${getCurrencyColor(currency)} mr-1.5`" 
              />
              {{ currencyLabels[currency] }}
            </div>
          </div>
        </div>

        <!-- Upgrade Scenarios -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Scenario 1 -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg">
            <div class="font-medium text-white mb-2 flex items-center">
              <IconCircle1 size="18" class="mr-1.5 text-blue-400" /> Scenario 1
            </div>
            <div class="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              <div 
                v-for="upgrade in getAvailableUpgrades(selectedCurrency)" 
                :key="upgrade.key" 
                class="flex flex-col"
              >
                <label class="text-gray-400 text-sm mb-1 flex items-center justify-between">
                  <span class="truncate">{{ upgrade.label }}</span>
                  <span v-if="upgrade.max" class="text-xs text-gray-500 ml-1">(max {{ upgrade.max }})</span>
                </label>
                <div class="flex items-center justify-between">
                  <!-- Global Value Display -->
                  <div class="flex items-center">
                    <div class="text-[10px] mr-2 text-gray-400 uppercase">global</div>
                    <div class="text-xs text-gray-300">
                      {{ getGlobalValue(upgrade.key) }}
                    </div>
                    <!-- Next Cost Display - NEU -->
                    <div class="text-[10px] ml-3 text-yellow-400 uppercase">
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 0)) }}
                    </div>
                  </div>
                  
                  <!-- Increment Input with Arrows -->
                  <div class="flex items-center">
                    <div class="relative flex overflow-hidden rounded">
                      <button 
                        @click="decrementScenarioValue(0, upgrade.key)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-l-md"
                      >
                        <IconChevronLeft size="14" />
                      </button>
                      
                      <div 
                        class="w-10 text-center bg-gray-800 py-[1px] relative flex items-center justify-center h-6 border-y border-gray-600"
                      >
                        <span class="text-blue-400">
                          {{ scenarioIncrements[0][upgrade.key] || 0 }}
                        </span>
                      </div>
                      
                      <button 
                        @click="incrementScenarioValue(0, upgrade.key, upgrade.max)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-r-md"
                      >
                        <IconChevronRight size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-700">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Cost:</span>
                <span class="text-blue-400">{{ formatCost(calculateScenarioCost(0)) }}</span>
              </div>
            </div>
          </div>

          <!-- Scenario 2 -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg">
            <div class="font-medium text-white mb-2 flex items-center">
              <IconCircle2 size="18" class="mr-1.5 text-blue-400" /> Scenario 2
            </div>
            <div class="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              <div 
                v-for="upgrade in getAvailableUpgrades(selectedCurrency)" 
                :key="upgrade.key" 
                class="flex flex-col"
              >
                <label class="text-gray-400 text-sm mb-1 flex items-center justify-between">
                  <span class="truncate">{{ upgrade.label }}</span>
                  <span v-if="upgrade.max" class="text-xs text-gray-500 ml-1">(max {{ upgrade.max }})</span>
                </label>
                <div class="flex items-center justify-between">
                  <!-- Global Value Display -->
                  <div class="flex items-center">
                    <div class="text-[10px] mr-2 text-gray-400 uppercase">global</div>
                    <div class="text-xs text-gray-300">
                      {{ getGlobalValue(upgrade.key) }}
                    </div>
                    <!-- Next Cost Display - NEU -->
                    <div class="text-[10px] ml-3 text-yellow-400 uppercase">
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 1)) }}
                    </div>
                  </div>
                  
                  <!-- Increment Input with Arrows -->
                  <div class="flex items-center">
                    <div class="relative flex overflow-hidden rounded">
                      <button 
                        @click="decrementScenarioValue(1, upgrade.key)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-l-md"
                      >
                        <IconChevronLeft size="14" />
                      </button>
                      
                      <div 
                        class="w-10 text-center bg-gray-800 py-[1px] relative flex items-center justify-center h-6 border-y border-gray-600"
                      >
                        <span class="text-blue-400">
                          {{ scenarioIncrements[1][upgrade.key] || 0 }}
                        </span>
                      </div>
                      
                      <button 
                        @click="incrementScenarioValue(1, upgrade.key, upgrade.max)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-r-md"
                      >
                        <IconChevronRight size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-700">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Cost:</span>
                <span class="text-blue-400">{{ formatCost(calculateScenarioCost(1)) }}</span>
              </div>
            </div>
          </div>

          <!-- Scenario 3 -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg">
            <div class="font-medium text-white mb-2 flex items-center">
              <IconCircle3 size="18" class="mr-1.5 text-blue-400" /> Scenario 3
            </div>
            <div class="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              <div 
                v-for="upgrade in getAvailableUpgrades(selectedCurrency)" 
                :key="upgrade.key" 
                class="flex flex-col"
              >
                <label class="text-gray-400 text-sm mb-1 flex items-center justify-between">
                  <span class="truncate">{{ upgrade.label }}</span>
                  <span v-if="upgrade.max" class="text-xs text-gray-500 ml-1">(max {{ upgrade.max }})</span>
                </label>
                <div class="flex items-center justify-between">
                  <!-- Global Value Display -->
                  <div class="flex items-center">
                    <div class="text-[10px] mr-2 text-gray-400 uppercase">global</div>
                    <div class="text-xs text-gray-300">
                      {{ getGlobalValue(upgrade.key) }}
                    </div>
                    <!-- Next Cost Display - NEU -->
                    <div class="text-[10px] ml-3 text-yellow-400 uppercase">
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 2)) }}
                    </div>
                  </div>
                  
                  <!-- Increment Input with Arrows -->
                  <div class="flex items-center">
                    <div class="relative flex overflow-hidden rounded">
                      <button 
                        @click="decrementScenarioValue(2, upgrade.key)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-l-md"
                      >
                        <IconChevronLeft size="14" />
                      </button>
                      
                      <div 
                        class="w-10 text-center bg-gray-800 py-[1px] relative flex items-center justify-center h-6 border-y border-gray-600"
                      >
                        <span class="text-blue-400">
                          {{ scenarioIncrements[2][upgrade.key] || 0 }}
                        </span>
                      </div>
                      
                      <button 
                        @click="incrementScenarioValue(2, upgrade.key, upgrade.max)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-r-md"
                      >
                        <IconChevronRight size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-700">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Cost:</span>
                <span class="text-blue-400">{{ formatCost(calculateScenarioCost(2)) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Compare Button -->
        <div class="mt-6 flex justify-center">
          <button 
            @click="() => compareScenarios(scenarioIncrements, getGlobalValue, calculateScenarioCost)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
            :disabled="isEvaluating || !hasAnyChanges"
          >
            <IconScale v-if="!isEvaluating" size="20" class="mr-2" />
            <IconLoader2 v-else size="20" class="mr-2 animate-spin" />
            {{ isEvaluating ? 'Evaluating...' : 'Compare Scenarios' }}
          </button>
        </div>

        <!-- Fortschrittsanzeige während der Evaluierung -->
        <div v-if="isEvaluating" class="mt-6 flex flex-col items-center justify-center py-8 space-y-3">
          <div v-if="isEvaluating" class="mt-6 flex flex-col items-center justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
            <div class="mt-3 text-sm text-gray-400">Evaluating scenarios...</div>
          </div>
        </div>

        <!-- Results -->
        <div v-if="comparisonResults.length > 0" class="mt-6">
          <div class="text-lg text-white mb-3 flex items-center">
            <IconChartPie size="20" class="mr-2 text-blue-400" />
            Results
          </div>
          
          <!-- Table container with scroll -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="sticky top-0 bg-gray-850 z-10">
                <tr class="border-b border-gray-700">
                  <th class="py-2 px-4 text-left text-gray-400">Metric</th>
                  <th class="py-2 px-6 text-right bg-gray-800/50">
                    Original
                  </th>
                  <th 
                    v-for="(result, i) in comparisonResults" 
                    :key="`result-${i}`" 
                    class="py-2 px-6 text-right"
                  >
                    Scenario {{ i + 1 }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Avg Stage -->
                <tr class="border-b border-gray-700">
                  <td class="py-2 px-4 text-gray-300">Avg Stage</td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? originalResults.avgStage.toFixed(1) : '-' }}
                  </td>
                  <td 
                    v-for="result in comparisonResults" 
                    :key="`stage-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'avgStage', true)"
                  >
                    {{ result.avgStage.toFixed(1) }}
                    <div v-if="originalResults" class="text-xs" :class="getDiffClass(result.avgStage, originalResults.avgStage)">
                      {{ formatDiff(result.avgStage, originalResults.avgStage) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Loot Score -->
                <tr class="border-b border-gray-700">
                  <td class="py-2 px-4 text-gray-300">Loot Score</td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatNumber(originalResults.lootPerMin) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`loot-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'lootPerMin', true)"
                  >
                    {{ formatNumber(result.lootPerMin) }}
                    <div v-if="originalResults" class="text-xs" :class="getDiffClass(result.lootPerMin, originalResults.lootPerMin)">
                      {{ formatDiffPercent(result.lootPerMin, originalResults.lootPerMin) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Material 1 (z.B. Obsidian) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat1', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <IconDiamond size="14" class="mr-1.5 text-red-400" />
                      {{ getMaterialLabel('mat1') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat1 || 0) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat1-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat1', true)"
                  >
                    {{ formatMaterialPerDay(result.mat1 || 0) }}
                    <div v-if="originalResults?.mat1" class="text-xs" 
                        :class="getDiffClass(result.mat1 || 0, originalResults.mat1 || 0)">
                      {{ formatDiffPercent(result.mat1 || 0, originalResults.mat1 || 0) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Material 2 (z.B. Behlium) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat2', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <IconHexagon size="14" class="mr-1.5 text-orange-400" />
                      {{ getMaterialLabel('mat2') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat2 || 0) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat2-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat2', true)"
                  >
                    {{ formatMaterialPerDay(result.mat2 || 0) }}
                    <div v-if="originalResults?.mat2" class="text-xs" 
                        :class="getDiffClass(result.mat2 || 0, originalResults.mat2 || 0)">
                      {{ formatDiffPercent(result.mat2 || 0, originalResults.mat2 || 0) }}
                    </div>
                  </td>
                </tr>

                <!-- Material 3 (z.B. Biomatter) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat3', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <IconHexagons size="14" class="mr-1.5 text-amber-400" />
                      {{ getMaterialLabel('mat3') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat3 || 0) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat3-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat3', true)"
                  >
                    {{ formatMaterialPerDay(result.mat3 || 0) }}
                    <div v-if="originalResults?.mat3" class="text-xs" 
                        :class="getDiffClass(result.mat3 || 0, originalResults.mat3 || 0)">
                      {{ formatDiffPercent(result.mat3 || 0, originalResults.mat3 || 0) }}
                    </div>
                  </td>
                </tr>
                
                <!-- XP (per Day) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('xp', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <IconBrightness size="14" class="mr-1.5 text-blue-400" />
                      XP (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.xp || 0) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`xp-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'xp', true)"
                  >
                    {{ formatMaterialPerDay(result.xp || 0) }}
                    <div v-if="originalResults?.xp" class="text-xs" 
                        :class="getDiffClass(result.xp || 0, originalResults.xp || 0)">
                      {{ formatDiffPercent(result.xp || 0, originalResults.xp || 0) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Costs -->
                <tr class="border-b border-gray-700">
                  <td class="py-2 px-4 text-gray-300">Costs</td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    0
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`cost-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getLowestCostClass(result.index)"
                  >
                    {{ formatCost(scenarioCosts[result.index]) }}
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
import { ref, watch, computed, onMounted } from 'vue';
import { 
  IconX, IconScale, IconChartBar, IconChartPie, IconBulb, 
  IconCheck, IconLoader2, IconCircle1, IconCircle2, IconCircle3,
  IconDiamond, IconHexagon, IconHexagons, IconPuzzle,
  IconAlertCircle, IconChevronLeft, IconChevronRight,
  IconBrightness, IconHeart, IconSword
} from '@tabler/icons-vue';
import { useHunterStore } from '../../store/hunterStore';
import { getHunterById } from '../../constants/hunters';
import { UPGRADES } from '../../constants/upgrades';
import { calcCostDifference, formatCost } from '../../utils/statCostUtils';
import { calcRelicCostDifference } from '../../utils/relicCostUtils';
import { 
  formatNumber, formatStage, formatPercent, formatTime,
  getDiffClasses, getDiffIcon, getDiffText,
  getAbsoluteDiffClasses, getAbsoluteDiffText,
  calculatePerDay 
} from '../../components/builds/utils/BuildComparisonUtils';
import { useBuildEvaluation } from '../../composables/useBuildEvaluation';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  hunterId: { type: String, required: true },
  buildData: { type: Object, required: true }
});

const emit = defineEmits(['close', 'applyOverrides']);

// Store
const hunterStore = useHunterStore();

// UI State
const isLoading = ref(true);
const loadError = ref(null);
const selectedCurrency = ref('');

// Szenarien (3 mögliche Upgrade-Pfade)
const scenarios = ref([{}, {}, {}]);
const scenarioIncrements = ref([{}, {}, {}]);
const scenarioCosts = ref([0, 0, 0]);
const recommendation = ref('');
const recommendedScenario = ref(null);
const originalResults = ref(null);

// Neue Variablen für den Fortschritt hinzufügen
const scenarioProgress = ref([
  { index: 0, completed: false, active: false },
  { index: 1, completed: false, active: false },
  { index: 2, completed: false, active: false }
]);
const overallProgressPercent = ref(0);


// Hunter und Upgrade-Parameter
const hunterModule = ref(null);
const availableCurrencies = ref([]);
const currencyLabels = ref({});
const upgradesByCurrency = ref({});

// Hunter-Informationen aus den Konstanten holen
const hunterInfo = computed(() => getHunterById(props.hunterId));
const hunterName = computed(() => hunterInfo.value.name);
const hunterColor = computed(() => hunterInfo.value.color);

const { 
  evaluateBuildWithParams, 
  compareScenarios,
  comparisonResults,
  isEvaluating
} = useBuildEvaluation(props, emit);


// Computed, um zu prüfen, ob es irgendwelche Änderungen in den Szenarien gibt
const hasAnyChanges = computed(() => {
  return scenarioIncrements.value.some(scenario => {
    return Object.values(scenario).some(val => val > 0);
  });
});

// Hunter-Daten und Upgrades laden
async function loadHunterData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Hunter-Modul dynamisch laden
    const currentHunter = hunterInfo.value;
    if (!currentHunter) {
      throw new Error(`Hunter not found: ${props.hunterId}`);
    }
    
    // Hunter-Modul importieren über die statsModule-Funktion
    hunterModule.value = await currentHunter.statsModule();
    
    if (!hunterModule.value || !hunterModule.value.CURRENCY_TYPES) {
      throw new Error(`Required constants missing for hunter: ${props.hunterId}`);
    }
    
    // Konstanten extrahieren
    currencyLabels.value = hunterModule.value.CURRENCY_LABELS || {};
    upgradesByCurrency.value = hunterModule.value.UPGRADES_BY_CURRENCY || {};
    availableCurrencies.value = Object.keys(upgradesByCurrency.value);
    
    // Stelle sicher, dass Hunter im Store initialisiert ist
    await hunterStore.initHunterConfig(props.hunterId);
    
    // Standard-Währung auswählen
    if (availableCurrencies.value.length > 0) {
      selectedCurrency.value = availableCurrencies.value[0];
    }

    // Szenarien initialisieren
    initializeScenarios();
    
    // Nehme die vorhandenen Ergebnisse direkt aus dem buildData
    if (props.buildData.results) {
      console.log('Using existing results:', props.buildData.results);
      originalResults.value = props.buildData.results;
    } else {
      console.warn('No results found in buildData');
    }
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error loading hunter data:', error);
    loadError.value = `Failed to load hunter data: ${error.message}`;
    isLoading.value = false;
  }
}

// Szenarien auf Basis der globalen Werte initialisieren
function initializeScenarios() {
  // Für jede Währung alle Szenarien mit globalen Werten initialisieren
  availableCurrencies.value.forEach(currency => {
    upgradesByCurrency.value[currency]?.forEach(upgrade => {
      // Globalen Wert für dieses Upgrade ermitteln
      const globalValue = getGlobalValue(upgrade.key);
      
      // Startwerte für alle Szenarien setzen
      scenarios.value.forEach((scenario, index) => {
        scenario[upgrade.key] = globalValue;
        scenarioIncrements.value[index][upgrade.key] = 0;
      });
    });
  });

  // Kostenberechnung aktualisieren
  calculateAllScenarioCosts();
}

// Globalen Wert für ein bestimmtes Upgrade oder Stat abrufen
function getGlobalValue(key) {
  // Für Upgrades
  if (key.startsWith('upgrades.')) {
    const parts = key.split('.');
    const upgradeType = parts[1]; // z.B. "relics"
    const upgradeId = parts[2];   // z.B. "r4"
    
    // Upgrade-Wert aus dem Store holen
    return hunterStore.upgrades?.[upgradeType]?.[upgradeId] || 0;
  }
  
  // Für Basis-Stats
  return hunterStore.hunterStats?.[props.hunterId]?.[key] || 0;
}

// Berechnet die Kosten für ein Szenario
function calculateScenarioCost(scenarioIndex) {
  const currency = selectedCurrency.value;
  if (!currency) return 0;
  
  let totalCost = 0;
  
  upgradesByCurrency.value[currency]?.forEach(upgrade => {
    const baseValue = getGlobalValue(upgrade.key);
    const incrementValue = scenarioIncrements.value[scenarioIndex][upgrade.key] || 0;
    
    if (incrementValue > 0) {
      // Je nach Upgrade-Typ unterschiedliche Kostenfunktionen verwenden
      if (upgrade.key.startsWith('upgrades.relics.')) {
        // Relic-Kosten
        const relicId = upgrade.key.split('.')[2]; // Extrahiert 'r4'
        let relicType;
        
        // Mapping von Relic IDs zu den entsprechenden Typen in relicCostUtils
        switch(relicId) {
          case 'r4': relicType = 'relic04'; break;
          case 'r7': relicType = 'relic07'; break;
          case 'r16': relicType = 'relic16'; break;
          case 'r17': relicType = 'relic17'; break;
          case 'r19': relicType = 'relic19'; break;
          default: return 0; // Relictyp nicht erkannt
        }
        
        totalCost += calcRelicCostDifference(relicType, baseValue, baseValue + incrementValue);
      } else {
        // Stat-Kosten (basierend auf statCostUtils)
        totalCost += calcCostDifference(
          upgrade.key,
          baseValue, 
          baseValue + incrementValue, 
          props.hunterId
        );
      }
    }
  });
  
  return totalCost;
}

// Berechnet alle Szenario-Kosten
function calculateAllScenarioCosts() {
  scenarioCosts.value = scenarios.value.map((_, index) => calculateScenarioCost(index));
}

// Funktionen für die Inkrementierung von Szenariowerten mit den Pfeilen
function incrementScenarioValue(scenarioIndex, key, maxValue) {
  // Stelle sicher, dass der aktuelle Wert initialisiert ist
  if (!scenarioIncrements.value[scenarioIndex][key]) {
    scenarioIncrements.value[scenarioIndex][key] = 0;
  }
  
  // Berechne den globalen Wert und das Maximum
  const globalValue = getGlobalValue(key);
  const max = maxValue !== undefined ? maxValue : Infinity;
  const currentIncrement = scenarioIncrements.value[scenarioIndex][key];
  
  // Erhöhe den Wert um 1, wenn das Maximum nicht erreicht ist
  if (globalValue + currentIncrement < max) {
    scenarioIncrements.value[scenarioIndex][key] += 1;
  }
}

function decrementScenarioValue(scenarioIndex, key) {
  // Stelle sicher, dass der aktuelle Wert initialisiert ist
  if (!scenarioIncrements.value[scenarioIndex][key]) {
    scenarioIncrements.value[scenarioIndex][key] = 0;
  }
  
  // Verringere den Wert, aber nicht unter 0
  if (scenarioIncrements.value[scenarioIndex][key] > 0) {
    scenarioIncrements.value[scenarioIndex][key] -= 1;
  }
}


// Analysiert die Ergebnisse und ermittelt die beste Option
function analyzeResults() {
  if (comparisonResults.value.length === 0) return;
  
  // Einfache Effizienz-Metrik: Loot pro Kosten
  const efficiencies = comparisonResults.value.map((result, index) => {
    if (!result) return { index, lootPerCost: 0, lootPerMin: 0, avgStage: 0, cost: 0 };
    
    return {
      index,
      lootPerCost: result.lootPerMin / scenarioCosts.value[index],
      lootPerMin: result.lootPerMin,
      avgStage: result.avgStage,
      cost: scenarioCosts.value[index]
    };
  }).filter(e => e.lootPerCost > 0);
  
  // Nach Effizienz sortieren
  efficiencies.sort((a, b) => b.lootPerCost - a.lootPerCost);
  
  // Keine validen Ergebnisse
  if (efficiencies.length === 0) {
    recommendation.value = "No valid scenarios found for comparison.";
    recommendedScenario.value = null;
    return;
  }
  
  // Bestes Szenario speichern
  recommendedScenario.value = efficiencies[0].index;
  
  // Empfehlung formulieren
  const bestOption = efficiencies[0];
  const currency = currencyLabels.value[selectedCurrency.value];
  
  recommendation.value = `Scenario ${bestOption.index + 1} offers the best value with ${formatNumber(bestOption.lootPerMin)} loot per minute at a cost of ${formatCost(bestOption.cost)} ${currency}.`;
  
  if (efficiencies.length > 1) {
    const secondBest = efficiencies[1];
    const lootDiff = ((bestOption.lootPerMin / secondBest.lootPerMin) - 1) * 100;
    const costDiff = ((secondBest.cost / bestOption.cost) - 1) * 100;
    
    if (lootDiff > 10 || costDiff > 15) {
      recommendation.value += ` This is significantly better than Scenario ${secondBest.index + 1} (${lootDiff.toFixed(1)}% more loot for ${costDiff > 0 ? costDiff.toFixed(1) + '% less' : Math.abs(costDiff).toFixed(1) + '% more'} cost).`;
    } else {
      recommendation.value += ` However, Scenario ${secondBest.index + 1} with ${formatNumber(secondBest.lootPerMin)} loot at ${formatCost(secondBest.cost)} ${currency} is also a good option.`;
    }
  }
}

// Style-Hilfsfunktionen für die Ergebnistabelle (aktualisiert)
function getBestValueClass(index, field, includeOriginal = false) {
  if (comparisonResults.value.length === 0) return '';
  
  const values = comparisonResults.value.map(result => result[field]);
    
  if (includeOriginal && originalResults.value && originalResults.value[field]) {
    values.push(originalResults.value[field]);
  }
    
  if (values.length === 0) return '';
  
  const maxValue = Math.max(...values);
  
  // Suche das Ergebnis mit dem entsprechenden Index
  const result = comparisonResults.value.find(r => r.index === index);
  
  // Wenn der Wert der maximale ist (auch im Vergleich zum Original)
  return result && result[field] === maxValue ? 'text-green-400' : '';
}

function getLowestCostClass(index) {
  if (scenarioCosts.value.length <= 1) return '';
  
  const validCosts = scenarioCosts.value.filter(cost => cost > 0);
  if (validCosts.length === 0) return '';
  
  const minCost = Math.min(...validCosts);
  
  return scenarioCosts.value[index] === minCost ? 'text-green-400' : '';
}

function getBestEfficiencyClass(index) {
  if (comparisonResults.value.length <= 1) return '';
  
  const efficiencies = comparisonResults.value
    .map((result, idx) => result ? result.lootPerMin / scenarioCosts.value[idx] : 0)
    .filter(e => e > 0);
    
  if (efficiencies.length === 0) return '';
  
  const maxEfficiency = Math.max(...efficiencies);
  const currentEfficiency = comparisonResults.value[index] 
    ? comparisonResults.value[index].lootPerMin / scenarioCosts.value[index]
    : 0;
  
  return currentEfficiency === maxEfficiency ? 'text-green-400 font-medium' : '';
}

// Funktionen für Vergleiche und Differenzen
function getDiffClass(value, baseValue) {
  if (value === baseValue) return 'text-gray-500';
  return value > baseValue ? 'text-green-400' : 'text-red-400';
}

function formatDiffPercent(value, baseValue) {
  if (value === baseValue) return '±0%';
  const diff = ((value / baseValue) - 1) * 100;
  return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
}

function formatDiff(value, baseValue) {
  if (value === baseValue) return '±0';
  const diff = value - baseValue;
  return diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
}

// Empfohlenes Szenario anwenden
function applyRecommendation() {
  if (recommendedScenario.value === null) return;
  
  const scenarioIndex = recommendedScenario.value;
  const overrides = {};
  
  // Änderungen als Overrides erfassen
  Object.entries(scenarioIncrements.value[scenarioIndex]).forEach(([key, increment]) => {
    if (increment <= 0) return;
    
    const baseValue = getGlobalValue(key);
    overrides[key] = baseValue + increment;
  });
  
  // Overrides an den Parent-Komponenten senden
  emit('applyOverrides', overrides);
  emit('close');
}

// Icons für die Währungen
function getCurrencyIcon(currencyType) {
  const icons = {
    'mat1': IconDiamond,
    'mat2': IconHexagon, 
    'mat3': IconHexagons,
    'frags': IconPuzzle
  };
  
  return icons[currencyType] || IconDiamond;
}

// Farbe für die Währungs-Icons
function getCurrencyColor(currencyType) {
  const colors = {
    'mat1': 'red-400',
    'mat2': 'orange-400',
    'mat3': 'amber-400',
    'frags': 'blue-400'
  };
  
  return colors[currencyType] || 'white';
}

// Hilfsfunktion um zu prüfen, ob ein bestimmter Loot-Typ in den Ergebnissen vorhanden ist
function hasLootProperty(property, includeOriginal = false) {
  const inScenarios = comparisonResults.value.some(result => {
    return result && result[property] && result[property] > 0;
  });
  
  if (includeOriginal && originalResults.value && originalResults.value[property] > 0) {
    return true;
  }
  
  return inScenarios;
}

// Hilfsfunktion um die hunter-spezifischen Materialnamen zu erhalten
function getMaterialLabel(property) {
  if (!hunterModule.value?.EVAL_RESULT_LABELS) {
    // Fallback Namen
    const fallbackLabels = {
      'mat1': 'Material 1',
      'mat2': 'Material 2', 
      'mat3': 'Material 3',
      'xp': 'XP'
    };
    return fallbackLabels[property] || property;
  }
  
  // Hunter-spezifische Labels aus dem Modul zurückgeben
  return hunterModule.value.EVAL_RESULT_LABELS[property] || property;
}

// Funktion, um Upgrades zu filtern, die noch nicht das Maximum erreicht haben
function getAvailableUpgrades(currency) {
  if (!currency || !upgradesByCurrency.value[currency]) return [];
  
  return upgradesByCurrency.value[currency].filter(upgrade => {
    // Globalen Wert ermitteln
    const globalValue = getGlobalValue(upgrade.key);
    // Wenn kein Maximum definiert ist, immer anzeigen
    if (upgrade.max === undefined) return true;
    // Sonst nur anzeigen, wenn das Maximum noch nicht erreicht ist
    return globalValue < upgrade.max;
  });
}

// Funktion zum Formatieren der Tageswerte für Materialien und XP
function formatMaterialPerDay(value) {
  if (!value) return '0';
  
  // Berechne Werte pro Tag (1440 Minuten/Tag)
  const valuePerDay = value * 1440;
  return formatNumber(valuePerDay);
}

// Berechnet die Kosten für ein einzelnes Upgrade-Level
// Berechnet die Kosten für ein einzelnes Upgrade-Level, unter Berücksichtigung der Szenario-Inkremente
function getNextUpgradeCost(key, scenarioIndex = -1) {
  // Basiswert ist der globale Wert
  const baseValue = getGlobalValue(key);
  
  // Wenn ein Szenario angegeben ist, addiere die aktuellen Inkremente dieses Szenarios
  const currentIncrements = scenarioIndex >= 0 ? 
    (scenarioIncrements.value[scenarioIndex][key] || 0) : 0;
  
  // Der Wert, für den wir die nächsten Kosten berechnen wollen
  const currentValue = baseValue + currentIncrements;
  
  // Je nach Upgrade-Typ unterschiedliche Kostenfunktionen verwenden
  if (key.startsWith('upgrades.relics.')) {
    // Relic-Kosten
    const relicId = key.split('.')[2]; // Extrahiert 'r4'
    let relicType;
    
    // Mapping von Relic IDs zu den entsprechenden Typen in relicCostUtils
    switch(relicId) {
      case 'r4': relicType = 'relic04'; break;
      case 'r7': relicType = 'relic07'; break;
      case 'r16': relicType = 'relic16'; break;
      case 'r17': relicType = 'relic17'; break;
      case 'r19': relicType = 'relic19'; break;
      default: return 0; // Relictyp nicht erkannt
    }
    
    return calcRelicCostDifference(relicType, currentValue, currentValue + 1);
  } else {
    // Stat-Kosten (basierend auf statCostUtils)
    return calcCostDifference(
      key,
      currentValue, 
      currentValue + 1, 
      props.hunterId
    );
  }
}

// Überwacht Änderungen an isVisible und lädt Daten, wenn das Modal geöffnet wird
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadHunterData();
  }
});

// Bei Änderungen des hunterId die Daten neu laden
watch(() => props.hunterId, () => {
  if (props.isVisible) {
    loadHunterData();
  }
});

// Bei Änderungen an den Inkrementen die Kosten neu berechnen
watch(() => JSON.stringify(scenarioIncrements.value), () => {
  calculateAllScenarioCosts();
}, { deep: true });

// Bei Änderung der ausgewählten Währung die Kosten neu berechnen
watch(() => selectedCurrency.value, () => {
  calculateAllScenarioCosts();
});

onMounted(() => {
  if (props.isVisible) {
    loadHunterData();
  }
});
</script>

<style scoped>
/* Styling für das Modal */
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

/* Anpassungen für niedrige Auflösungen */
@media (max-width: 768px) {
  .max-w-5xl {
    max-width: 96vw;
  }
}

/* Extra Styling für die Scrollbars */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.2);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.8);
}

/* Hintergrund für die Szenarien */
.bg-gray-850 {
  background-color: rgba(31, 35, 42, 0.8);
}
</style>