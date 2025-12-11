<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="handleClose"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Reset-Button und Hide Maxed Toggle -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <!-- Erste Zeile: Titel und Action Buttons -->
        <div class="flex justify-between items-center mb-2 sm:mb-0">
          <div class="flex-1">
            <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2 flex items-center">
              <component :is="overrideIcon" size="16" class="mr-2" :class="`text-${hunterColor}-400`" />
              <span :class="`text-${hunterColor}-400`">{{ modalTitle }}</span>
              <span class=""> - {{ modalSubtitle }}</span>
            </h2>
            <!-- Info-Badge für Category-Mode -->
            <div v-if="mode === 'category'" class="text-xs text-blue-300 mt-0.5 flex items-center gap-1">
              <IconInfoCircle size="12" />
              <span>Applies to all builds in this category</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <!-- Hide Maxed Toggle - nur auf Desktop in der ersten Zeile -->
            <div class="hidden sm:block bg-gray-800/50 rounded-lg border border-gray-700/50 p-2">
              <div class="flex items-center justify-between">
                <span class="text-gray-300 text-xs font-medium mr-3">Hide Maxed:</span>
                <button 
                  @click="toggleHideMaxed" 
                  class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                  :class="{
                    'bg-green-600': localHideMaxed,
                    'bg-gray-600': !localHideMaxed
                  }"
                >
                  <span 
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="{
                      'translate-x-5': localHideMaxed,
                      'translate-x-1': !localHideMaxed
                    }"
                  ></span>
                </button>
              </div>
            </div>
            
            <button 
              @click="resetAllOverrides" 
              class="px-2 py-1 sm:px-3 bg-gray-600 hover:bg-gray-500 text-xs sm:text-sm text-white rounded-md"
            >
              Reset
            </button>
            <button 
              @click="handleClose"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
        
        <!-- Zweite Zeile: Hide Maxed Toggle - nur auf Mobile -->
        <div class="block sm:hidden">
          <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 p-2">
            <div class="flex items-center justify-between">
              <span class="text-gray-300 text-xs font-medium">Hide Maxed:</span>
              <button 
                @click="toggleHideMaxed" 
                class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                :class="{
                  'bg-green-600': localHideMaxed,
                  'bg-gray-600': !localHideMaxed
                }"
              >
                <span 
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="{
                    'translate-x-5': localHideMaxed,
                    'translate-x-1': !localHideMaxed
                  }"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="p-6 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
        <p class="text-gray-400 text-sm">Loading parameters...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ loadError }}</p>
        <button 
          @click="loadOverrideData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Retry
        </button>
      </div>

      <!-- Override Categories mit Hide Maxed Filter -->
      <div v-else class="p-3">
        <div v-for="(category, index) in filteredCategories" :key="index" class="mb-3">
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
              <!-- Parameter Name mit Description -->
              <div class="flex justify-between items-center mb-1">
                <div class="flex-1 mr-2">
                  <span class="text-xs font-medium text-gray-300 ">{{ param.name }}</span>
                  <!-- Description für Inscryptions -->
                  <span 
                    v-if="param.description" 
                    class="text-[10px] text-gray-500 ml-1"
                  >
                    {{ param.description }}
                  </span>
                </div>
                
                <!-- Max Value Badge -->
                <span 
                  v-if="param.maxValue !== null && param.maxValue !== Infinity && param.type !== 'boolean'" 
                  class="text-[10px] bg-gray-700 text-gray-400 px-1 py-0.5 rounded flex-shrink-0"
                >
                  max: {{ param.maxValue }}
                </span>
              </div>
              
              <!-- Controls -->
              <div class="flex items-center justify-between">
                <!-- Base Value Badge (Category oder Global) -->
                <div class="flex items-center">
                  <div 
                    class="text-[10px] mr-2 uppercase"
                    :class="getBaseLabel(param.key) === 'category' ? 'text-purple-400' : 'text-gray-400'"
                  >
                    {{ getBaseLabel(param.key) }}
                  </div>
                  
                  <!-- Boolean Base Value -->
                  <div v-if="param.type === 'boolean'" 
                       class="text-xs px-1.5 py-0.5 rounded"
                       :class="getBaseValue(param.key, param.globalValue) ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'"
                  >
                    {{ getBaseValue(param.key, param.globalValue) ? 'ON' : 'OFF' }}
                  </div>
                  
                  <!-- Numeric Base Value -->
                  <div v-else class="text-xs text-gray-300">
                    {{ getBaseValue(param.key, param.globalValue) }}
                  </div>
                </div>
                  <!-- Cost Display für Stats -->
                  <div 
                    v-if="showCostForParam(param)" 
                    class="ml-2 text-xs text-yellow-400 font-medium"
                  >
                    Cost: {{ formatCost(getParamCost(param)) }}
                  </div>
                <!-- Boolean Type Controls (überarbeitet) -->
                <div v-if="param.type === 'boolean'" class="flex">
                  <button 
                    v-if="getBaseValue(param.key, param.globalValue) === 0 || getBaseValue(param.key, param.globalValue) === false"
                    @click="toggleBooleanOverride(param.key, true, param)"
                    class="text-xs px-2 py-0.5 rounded"
                    :class="localOverrides[param.key] === 1 ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-green-800/50 text-white'"
                  >
                    ON
                  </button>
                  <button 
                    v-else
                    @click="toggleBooleanOverride(param.key, false, param)"
                    class="text-xs px-2 py-0.5 rounded"
                    :class="localOverrides[param.key] === 0 ? 'bg-red-700 text-red-100' : 'bg-gray-700 hover:bg-red-800/50 text-white'"
                  >
                    OFF
                  </button>
                </div>
                
                <!-- Numeric Type Controls mit ValueControls -->
                <div v-else class="flex items-center">
                  <ValueControls
                    :value="localOverrides[param.key] === null ? getBaseValue(param.key, param.globalValue) : localOverrides[param.key]"
                    :minValue="0"
                    :maxValue="param.maxValue || 999"
                    :showFastControls="true"
                    :step="1"
                    :valueClass="getValueColorClass(param.key, getBaseValue(param.key, param.globalValue))"
                    @update:value="(newVal) => updateOverrideValue(param.key, newVal, param)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredCategories.length === 0" class="py-4 text-center text-gray-400 text-sm">
          {{ localHideMaxed ? 'All parameters are maxed - disable "Hide Maxed" to see them' : 'No parameters available' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { 
  IconX, IconChevronLeft, IconChevronRight, IconAlertCircle, IconInfoCircle,
  IconAdjustments, IconAdjustmentsHorizontal
} from '@tabler/icons-vue';
import { useHunterStore } from '../../store/hunterStore';
import { useGemPlannerStore } from '../../store/gemPlannerStore';
import { HUNTERS } from '../../constants/hunters';
import { UPGRADES } from '../../constants/upgrades';
import { GEM_UPGRADE_MAPPING } from '../../constants/gemUpgradeMappings';
import { calcCostDifference, formatCost } from '../../utils/statCostUtils';
import { getRelicCost, calcRelicCostDifference, formatRelicCost } from '../../utils/relicCostUtils';
import { getGadgetCost, calcGadgetCostDifference, formatGadgetCost } from '../../utils/gadgetCostUtils';
import { getInscryptionCost, calcInscryptionCostDifference, formatInscryptionCost } from '../../utils/inscryptionCostUtils';
import { getOrbCost, calcOrbCostDifference, formatOrbCost } from '../../utils/orbCostUtils';
import ValueControls from './ValueControls.vue';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  hunterType: { type: String, required: true },
  hunterColor: { type: String, required: true },
  
  // MODE SWITCH: 'build' oder 'category'
  mode: { 
    type: String, 
    default: 'build',
    validator: (value) => ['build', 'category'].includes(value)
  },
  
  // Build-Mode Props:
  buildName: { type: String, default: 'Build' },
  buildId: { type: String, default: null },
  isImportedBuild: { type: Boolean, default: false },
  
  // Category-Mode Props:
  categoryName: { type: String, default: '' },
  categoryId: { type: String, default: null },
  displayMode: { type: String, default: 'Horizontal' }, // 'Vertical' oder 'Horizontal'
  
  // Shared: currentOverrides wird für beide Modi verwendet
  currentOverrides: { type: Object, default: () => ({}) },
  
  // Category Overrides für Builds in Kategorien
  categoryOverrides: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['edit', 'clone', 'archive', 'delete', 'nameChanged', 'overrides', 'share', 'overridesBuild', 'close', 'overridesUpdated', 'categoryOverridesUpdated']);

// Store
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Computed für dynamischen Titel
const modalTitle = computed(() => {
  if (props.mode === 'category') {
    return props.categoryName;
  }
  return props.buildName;
});

// Computed für Subtitle
const modalSubtitle = computed(() => {
  if (props.mode === 'category') {
    return 'Category Overrides';
  }
  return 'Overrides';
});

// Computed für dynamisches Icon basierend auf displayMode
const overrideIcon = computed(() => {
  return props.displayMode === 'Vertical' 
    ? IconAdjustments 
    : IconAdjustmentsHorizontal;
});

// Local state
const isLoading = ref(true);
const loadError = ref(null);
const localOverrides = ref({});
const parameterData = ref([]);
const totalCost = ref(null);

// NEU: Hide Maxed Toggle State
const localHideMaxed = ref(false);

// NEU: LocalStorage Key für Hide Maxed Einstellung
const HIDE_MAXED_KEY = 'overrideModal_hideMaxed';

// Computed: Basis-Wert für Parameter (Category Override oder Global)
const getBaseValue = (paramKey, globalValue) => {
  // Debug-Logging
  if (paramKey === 'atk') {
    console.log('getBaseValue for atk:', {
      paramKey,
      globalValue,
      categoryOverrides: props.categoryOverrides,
      categoryValue: props.categoryOverrides?.[paramKey],
      hasValue: props.categoryOverrides && props.categoryOverrides[paramKey] !== undefined && props.categoryOverrides[paramKey] !== null
    });
  }
  
  // Wenn Category Overrides existieren und einen Wert für diesen Parameter haben
  if (props.categoryOverrides && props.categoryOverrides[paramKey] !== undefined && props.categoryOverrides[paramKey] !== null) {
    return props.categoryOverrides[paramKey];
  }
  // Ansonsten den globalen Wert verwenden
  return globalValue;
};

// Computed: Label für den Basis-Wert (zeigt ob Category oder Global)
const getBaseLabel = (paramKey) => {
  if (props.categoryOverrides && props.categoryOverrides[paramKey] !== undefined && props.categoryOverrides[paramKey] !== null) {
    return 'category';
  }
  return 'global';
};

// NEU: Toggle-Funktion für Hide Maxed
function toggleHideMaxed() {
  localHideMaxed.value = !localHideMaxed.value;
  saveHideMaxedSetting();
}

// NEU: Speichern der Hide Maxed Einstellung
function saveHideMaxedSetting() {
  try {
    localStorage.setItem(HIDE_MAXED_KEY, JSON.stringify(localHideMaxed.value));
  } catch (error) {
    console.error('Fehler beim Speichern der Hide Maxed Einstellung:', error);
  }
}

// NEU: Laden der Hide Maxed Einstellung
function loadHideMaxedSetting() {
  try {
    const saved = localStorage.getItem(HIDE_MAXED_KEY);
    if (saved !== null) {
      localHideMaxed.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Hide Maxed Einstellung:', error);
    localHideMaxed.value = false; // Fallback
  }
}

//  Prüft ob ein Parameter "maxed" ist
function isParameterMaxed(param) {
  // Verwende Basis-Wert (Category Override oder Global)
  const baseValue = getBaseValue(param.key, param.globalValue);
  
  // Prüfe zuerst, ob ein Override existiert
  const overrideValue = localOverrides.value[param.key];
  
  // Wenn ein Override existiert, prüfe ob er unter dem Basis/max Wert liegt
  if (overrideValue !== null && overrideValue !== undefined) {
    // Boolean Parameter: Wenn Override auf OFF (0/false) gesetzt ist, zeige es an
    if (param.type === 'boolean') {
      if (overrideValue === 0 || overrideValue === false) {
        return false; // Zeige an, weil Override ist unter "maxed" (ON)
      }
    }
    
    // Numeric Parameter: Wenn Override unter Basis oder max Wert liegt, zeige es an
    if (param.maxValue !== null && param.maxValue !== Infinity) {
      if (overrideValue < baseValue || overrideValue < param.maxValue) {
        return false; // Zeige an, weil Override ist unter max
      }
    }
    
    // Wenn Override unter Basis-Wert liegt, zeige es an
    if (overrideValue < baseValue) {
      return false; // Zeige an, weil Override ist niedriger als Basis
    }
  }
  
  // Jetzt prüfe den Basis "maxed" Status nur wenn KEIN relevanter Override existiert
  
  // Boolean Parameter: Wenn Basis ON (true/1), dann ist es maxed
  if (param.type === 'boolean') {
    return baseValue === true || baseValue === 1;
  }
  
  // Numeric Parameter: Wenn Basis value >= max value, dann ist es maxed
  if (param.maxValue !== null && param.maxValue !== Infinity) {
    return baseValue >= param.maxValue;
  }
  
  // Wenn kein Max-Wert definiert ist, kann es nicht maxed sein
  return false;
}

// NEU: Gefilterte Kategorien mit Hide Maxed Logic
const filteredCategories = computed(() => {
  if (!localHideMaxed.value) {
    // Wenn Hide Maxed deaktiviert ist, zeige alle
    return visibleCategories.value;
  }
  
  // Filtere Parameter in jeder Kategorie
  const filtered = visibleCategories.value.map(category => ({
    ...category,
    params: category.params.filter(param => !isParameterMaxed(param))
  })).filter(category => category.params.length > 0); // Entferne leere Kategorien
  
  return filtered;
});

// Helper function to truncate names
function truncateName(name) {
  if (!name) return '';
  return name.length > 22 ? name.substring(0, 22) + '...' : name;
}

// Convert gemPlannerStore format to upgrades.gems_nodes format
function convertGemStatesToUpgrades(upgradesData, gemPlannerStore) {
  if (!gemPlannerStore?.gemStates) {
    return upgradesData;
  }
  
  // Create a copy of upgradesData
  const convertedData = { ...upgradesData };
  
  // Initialize gems_nodes if not exists
  if (!convertedData.gems_nodes) {
    convertedData.gems_nodes = {};
  }
  
  // Conversion mappings
  const gemMappings = {
    exodus: {
      level: 'exodus_level',
      nodes: {
        gem1: 'exodus_gem1',
        gem2: 'exodus_gem2',
        gem3: 'exodus_gem3',
        gem4: 'exodus_gem4',
        gem5: 'exodus_gem5',
        gem6: 'exodus_gem6',
        temporalEvolutionCount: 'exodus_temporalEvolutionCount'
      },
      upgrades: {
      }
    },
    temporal: {
      level: 'temporal_level',
      nodes: {
        gem1: 'temporal_gem1',
        gem2: 'temporal_gem2',
        gem3: 'temporal_gem3',
        gem4: 'temporal_gem4',
        gem5: 'temporal_gem5',
        gem6: 'temporal_gem6',
      },
      upgrades: GEM_UPGRADE_MAPPING // Verwende zentrales Mapping
    },
    attraction: {
      level: 'attraction_level',
      nodes: {
        gem1: 'attraction_gem1',
        gem2: 'attraction_gem2', 
        gem3: 'attraction_gem3',
        gem4: 'attraction_gem4',
        gem5: 'attraction_gem5',
        gem6: 'attraction_gem6',
      },
      upgrades: GEM_UPGRADE_MAPPING // Verwende zentrales Mapping
    },
    innovation: {
      level: 'innovation_level',
      nodes: {
        gem1: 'innovation_gem1',
        gem2: 'innovation_gem2',
        gem3: 'innovation_gem3',
        gem4: 'innovation_gem4',
        gem5: 'innovation_gem5',
        gem6: 'innovation_gem6',
      },
      upgrades: {
      }
    },
    creation: {
      level: 'creation_level',
      nodes: {
        gem1: 'creation_gem1',
        gem2: 'creation_gem2',
        gem3: 'creation_gem3',
        gem4: 'creation_gem4',
        gem5: 'creation_gem5',
        gem6: 'creation_gem6',
        galvTrinketsCount: 'creation_galvTrinketsCount'
      },
      upgrades: GEM_UPGRADE_MAPPING // Verwende zentrales Mapping
    },
    evolution: {
      level: 'evolution_level',
      nodes: {
        gem2: 'evolution_gem2',
        gem3: 'evolution_gem3',
        gem6: 'evolution_gem6'
      },
      upgrades: {
        'gem3': 'evolution_gem3'
      }
    }
  };
  
  // Convert each gem type
  Object.entries(gemPlannerStore.gemStates).forEach(([gemType, gemData]) => {
    const mapping = gemMappings[gemType];
    if (!mapping) return;
    
    // Convert level
    if (gemData.level !== undefined) {
      convertedData.gems_nodes[mapping.level] = gemData.level;
    }
    
    // Convert nodes
    if (gemData.nodes && Array.isArray(gemData.nodes)) {
      gemData.nodes.forEach((nodeActive, index) => {
        const nodeKey = `gem${index + 1}`;
        if (mapping.nodes[nodeKey]) {
          convertedData.gems_nodes[mapping.nodes[nodeKey]] = nodeActive ? 1 : 0;
        }
      });
    }
    
    // Convert upgrades
    if (gemData.upgrades) {
      Object.entries(gemData.upgrades).forEach(([upgradeKey, upgradeValue]) => {
        if (mapping.upgrades[upgradeKey]) {
          convertedData.gems_nodes[mapping.upgrades[upgradeKey]] = upgradeValue;
        }
      });
    }
  });
  
  return convertedData;
}

// Load parameter data for the current hunter
async function loadOverrideData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Find the current hunter in the HUNTERS array
    const currentHunter = HUNTERS.find(h => h.id === props.hunterType);
    if (!currentHunter) {
      throw new Error(`Hunter not found: ${props.hunterType}`);
    }
    
    // Import the hunter-specific constants file
    const hunterModule = await import(`../../constants/${props.hunterType}.js`);
    
    if (!hunterModule || !hunterModule.OVERRIDES) {
      throw new Error(`No OVERRIDES found for hunter: ${props.hunterType}`);
    }

    // Import the stats from the hunter module
    const hunterStats = hunterModule.STATS || [];
    
    // Get global values from the hunter store
    const hunterData = hunterStore.hunterStats?.[props.hunterType] || {};
    const baseUpgradesData = hunterStore.upgrades || {};
    
    // Convert gemPlannerStore format to upgrades.gems_nodes format
    const upgradesData = convertGemStatesToUpgrades(baseUpgradesData, gemPlannerStore);
    
    // Process all parameters from OVERRIDES
    const processedCategories = [];
    
    // Process parameters by category
    for (const [category, params] of Object.entries(hunterModule.OVERRIDES)) {
      const categoryLabel = hunterModule.OVERRIDE_CATEGORY_LABELS?.[category] || formatCategoryName(category);
      
      const processedCategory = {
        key: category,
        name: category,  // Füge name hinzu für Kompatibilität 
        label: categoryLabel,
        params: []
      };
      
      for (const paramKey of params) {
        try {
          // Parameter-Kategorie für Kostenberechnung speichern
          const paramCategory = category;
          
          // Extract the parameter components
          const parts = paramKey.split('.');
          
          // Get the parameter name and other metadata based on its type
          let paramName = "";
          let maxValue = null;
          let globalValue = 0;
          let type = "numeric"; // Default type
          
          if (paramKey.startsWith('upgrades.')) {
            const upgradeType = parts[1]; // e.g., "relics"
            const upgradeId = parts[2];   // e.g., "r4"
            
            // Get the global value from the store
            globalValue = upgradesData?.[upgradeType]?.[upgradeId] || 0;
            
            // Special handling for exodus_temporalEvolutionCount - calculate the value
            if (paramKey === 'upgrades.gems_nodes.exodus_temporalEvolutionCount') {
              // Check if exodus gem1 is active (considering both global state and current overrides)
              const exodusGem1Key = 'upgrades.gems_nodes.exodus_gem1';
              
              // First check if there's an override for exodus_gem1 in current overrides
              let hasExodusNode1;
              if (props.currentOverrides && props.currentOverrides[exodusGem1Key] !== undefined) {
                hasExodusNode1 = props.currentOverrides[exodusGem1Key] > 0;
              } else {
                // Fallback to global state
                const exodusGemState = gemPlannerStore?.gemStates?.exodus;
                hasExodusNode1 = exodusGemState?.nodes?.[0] || false;
              }
              
              if (hasExodusNode1) {
                // Calculate temporal + evolution upgrade count
                let upgradeCount = 0;
                
                // Count Temporal gem upgrades
                const temporalGemState = gemPlannerStore?.gemStates?.temporal;
                if (temporalGemState?.upgrades) {
                  upgradeCount += Object.values(temporalGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
                }
                
                // Count Evolution gem upgrades
                const evolutionGemState = gemPlannerStore?.gemStates?.evolution;
                if (evolutionGemState?.upgrades) {
                  upgradeCount += Object.values(evolutionGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
                }
                
                globalValue = upgradeCount;
              } else {
                globalValue = 0;
              }
            }
            
            // Special handling for creation_galvTrinketsCount - calculate the value
            if (paramKey === 'upgrades.gems_nodes.creation_galvTrinketsCount') {
              // Check if creation gem5 is active (considering both global state and current overrides)
              const creationGem5Key = 'upgrades.gems_nodes.creation_gem5';
              
              // First check if there's an override for creation_gem5 in current overrides
              let hasCreationNode5;
              if (props.currentOverrides && props.currentOverrides[creationGem5Key] !== undefined) {
                hasCreationNode5 = props.currentOverrides[creationGem5Key] > 0;
              } else {
                // Fallback to global state (node 5 = index 4)
                const creationGemState = gemPlannerStore?.gemStates?.creation;
                hasCreationNode5 = creationGemState?.nodes?.[4] || false;
              }
              
              if (hasCreationNode5) {
                // Calculate total trinket levels
                let trinketCount = 0;
                
                if (upgradesData?.trinkets) {
                  trinketCount = Object.values(upgradesData.trinkets).reduce((sum, level) => sum + (level || 0), 0);
                }
                
                globalValue = trinketCount;
              } else {
                globalValue = 0;
              }
            }
            
            // Special handling for gem_nodes
            if (upgradeType === 'gems_nodes') {
              // Format is "gemname_property" (e.g. "creation_level", "attraction_lootBorge")
              const gemNodeParts = upgradeId.split('_');
              if (gemNodeParts.length >= 2) {
                const gemName = gemNodeParts[0]; // e.g. "creation", "attraction"
                const property = gemNodeParts.slice(1).join('_'); // e.g. "level", "lootBorge", "gem1"
                
                // Find the gem in UPGRADES.gems
                const gem = UPGRADES.gems.find(g => g.id === gemName);
                if (gem) {
                  // Handle level parameter
                  if (property === 'level') {
                    paramName = `${gem.name} Level`;
                    maxValue = gem.maxLevel || null;
                    type = "numeric";
                  }
                  // Handle gem nodes (gem1, gem2, gem3)
                  else if (property.startsWith('gem')) {
                    const node = gem.nodes.find(n => n.id === property);
                    if (node) {
                      paramName = node.name;
                      maxValue = node.maxLevel || (node.type === 'boolean' ? 1 : null);
                      type = node.type || "numeric";
                    }
                  }
                  // Handle upgrades (lootBorge, catchUp, borgeGU etc.)
                  else {
                    // Find the upgrade in gem.nodes
                    const upgradeNode = gem.nodes.find(n => {
                      // Map the property name to the node id
                      const propertyToNodeMap = {
                        'lootBorge': 'lootBorge',
                        'lootOzzy': 'lootOzzy',
                        'lootKnox': 'lootKnox',
                        'catchUp': 'catchUp',
                        'catchUp2': 'catchUp2',
                        'borgeGU': 'borgeGU',
                        'ozzyGU': 'ozzyGU',
                        'knoxGU': 'knoxGU',
                        'galvTrinketsCount': 'galvTrinketsCount',
                        'temporalEvolutionCount': 'temporalEvolutionCount',
                        'powerInnovationCount': 'powerInnovationCount',
                        'attractionCreationCount': 'attractionCreationCount'
                      };
                      return n.id === propertyToNodeMap[property];
                    });
                    
                    if (upgradeNode) {
                      paramName = upgradeNode.name;
                      maxValue = upgradeNode.maxLevel || null;
                      type = upgradeNode.type || "numeric";
                    } else {
                      // Fallback if not found in nodes
                      const upgradeNameMap = {
                        'lootBorge': 'Loot (Borge)',
                        'lootOzzy': 'Loot (Ozzy)',
                        'lootKnox': 'Loot (Knox)',
                        'catchUp': 'Catch-Up Power (Borge/Ozzy)',
                        'catchUp2': 'Catch-Up Power (Knox)',
                        'borgeGU': 'Borge Stat Bonus',
                        'ozzyGU': 'Ozzy Stat Bonus',
                        'knoxGU': 'Knox Stat Bonus',
                        'galvTrinketsCount': 'Galvarium Trinkets Count',
                        'temporalEvolutionCount': 'Temporal Evolution Upgrades Count',
                        'powerInnovationCount': 'Power & Innovation Upgrades Count',
                        'attractionCreationCount': 'Attraction & Creation Upgrades Count'
                      };
                      
                      paramName = upgradeNameMap[property] || property;
                      maxValue = property === 'galvTrinketsCount' ? Infinity : 50; // Spezielle Behandlung für galvTrinketsCount
                      type = "numeric";
                    }
                  }
                }
              }
            } 
            else {
              // Handle regular upgrades
              const upgradeArray = UPGRADES[upgradeType];
              if (upgradeArray) {
                const upgrade = upgradeArray.find(u => u.id === upgradeId);
                if (upgrade) {
                  paramName = upgrade.name;
                  maxValue = upgrade.maxLevel || null;
                  type = upgrade.type || "numeric";
                  
                  // NEU: Description für Inscryptions hinzufügen
                  if (upgradeType === 'inscryptions' && upgrade.description) {
                    // Description wird als separate Eigenschaft gespeichert
                    processedCategory.params.push({
                      key: paramKey,
                      name: paramName || paramKey,
                      description: upgrade.description, // NEU: Description hinzufügen
                      globalValue,
                      maxValue,
                      type,
                      category: paramCategory
                    });
                    continue; // Skip the normal push at the end
                  }
                }
              }
            }
          } else {
            // Handle base stats
            globalValue = hunterData[paramKey] || 0;
            
            // Find the stat definition in hunter stats
            const statDef = hunterStats.find(s => s.key === paramKey);
            if (statDef) {
              paramName = statDef.label;
              maxValue = statDef.max === Infinity ? null : statDef.max;
            } else {
              // Default names for common stats if not found
              const statLabels = {
                hp: 'MAX HP',
                atk: 'ATK Power',
                regen: 'HP Regen',
                dr: 'DMG Reduction',
                evade: 'Evade Chance',
                effect: 'Effect Chance',
                critchance: 'Crit Chance',
                critpower: 'Crit Power',
                atkspeed: 'ATK Speed',
                multichance: 'Multistrike Chance',
                multipower: 'Multistrike Power',
                lvl: 'Hunter Level',
                stage: 'Max Stage'
              };
              paramName = statLabels[paramKey] || paramKey;
            }
          }
          
          processedCategory.params.push({
            key: paramKey,
            name: paramName || paramKey, // Fall back to the key if no name found
            globalValue,
            maxValue,
            type,
            category: paramCategory // Kategorie für Kostenberechnung
          });
        } catch (error) {
          console.error(`Error processing parameter ${paramKey}:`, error);
          // Continue with the next parameter
        }
      }
      
      if (processedCategory.params.length > 0) {
        processedCategories.push(processedCategory);
      }
    }
    
    parameterData.value = processedCategories;
    
    // Initialize local overrides
    initLocalOverrides();
    
    isLoading.value = false;
    
    // Berechne die Gesamtkosten
    calculateTotalCost();
    
  } catch (error) {
    console.error('Error loading override data:', error);
    loadError.value = `Failed to load parameters: ${error.message}`;
    isLoading.value = false;
  }
}

// Format a category name for display
function formatCategoryName(category) {
  return category
    // Insert a space before capital letters
    .replace(/([A-Z])/g, ' $1')
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Capitalize first letter
    .replace(/^./, str => str.toUpperCase());
}

// Initialize local overrides with current values
function initLocalOverrides() {
  const newOverrides = {};
  
  // Flatten all parameters
  const allParams = parameterData.value.flatMap(category => 
    category.params.map(param => param.key)
  );
  
  // Initialize with null (= no override)
  allParams.forEach(param => {
    if (props.currentOverrides && props.currentOverrides[param] !== undefined) {
      newOverrides[param] = props.currentOverrides[param];
    } else {
      newOverrides[param] = null;
    }
  });
  
  localOverrides.value = newOverrides;
}

// Computed property for calculated exodus_temporalEvolutionCount value
const calculatedExodusTemporalEvolutionCount = computed(() => {
  // Check if exodus gem1 is active (considering both global state and current overrides)
  const exodusGem1Key = 'upgrades.gems_nodes.exodus_gem1';
  
  // First check if there's an override for exodus_gem1 in local overrides
  let hasExodusNode1;
  if (localOverrides.value[exodusGem1Key] !== null && localOverrides.value[exodusGem1Key] !== undefined) {
    hasExodusNode1 = localOverrides.value[exodusGem1Key] > 0;
  } else if (props.currentOverrides && props.currentOverrides[exodusGem1Key] !== undefined) {
    hasExodusNode1 = props.currentOverrides[exodusGem1Key] > 0;
  } else {
    // Fallback to global state
    const exodusGemState = gemPlannerStore?.gemStates?.exodus;
    hasExodusNode1 = exodusGemState?.nodes?.[0] || false;
  }
  
  if (hasExodusNode1) {
    // Calculate temporal + evolution upgrade count
    let upgradeCount = 0;
    
    // Count Temporal gem upgrades
    const temporalGemState = gemPlannerStore?.gemStates?.temporal;
    if (temporalGemState?.upgrades) {
      upgradeCount += Object.values(temporalGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    // Count Evolution gem upgrades
    const evolutionGemState = gemPlannerStore?.gemStates?.evolution;
    if (evolutionGemState?.upgrades) {
      upgradeCount += Object.values(evolutionGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    return upgradeCount;
  } else {
    return 0;
  }
});

// Computed property for calculated creation_galvTrinketsCount value
const calculatedCreationGalvTrinketsCount = computed(() => {
  // Check if creation gem5 is active (considering both global state and current overrides)
  const creationGem5Key = 'upgrades.gems_nodes.creation_gem5';
  
  // First check if there's an override for creation_gem5 in local overrides
  let hasCreationNode5;
  if (localOverrides.value[creationGem5Key] !== null && localOverrides.value[creationGem5Key] !== undefined) {
    hasCreationNode5 = localOverrides.value[creationGem5Key] > 0;
  } else if (props.currentOverrides && props.currentOverrides[creationGem5Key] !== undefined) {
    hasCreationNode5 = props.currentOverrides[creationGem5Key] > 0;
  } else {
    // Fallback to global state (node 5 = index 4)
    const creationGemState = gemPlannerStore?.gemStates?.creation;
    hasCreationNode5 = creationGemState?.nodes?.[4] || false;
  }
  
  if (hasCreationNode5) {
    // Calculate total trinket levels
    let trinketCount = 0;
    
    // Get current upgrades data
    const upgradesData = hunterStore.upgrades || {};
    if (upgradesData?.trinkets) {
      trinketCount = Object.values(upgradesData.trinkets).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    return trinketCount;
  } else {
    return 0;
  }
});

// Computed property for calculated exodus_powerInnovationCount value (Ozzy)
const calculatedExodusPowerInnovationCount = computed(() => {
  // Check if exodus gem3 is active (considering both global state and current overrides)
  const exodusGem3Key = 'upgrades.gems_nodes.exodus_gem3';
  
  // First check if there's an override for exodus_gem3 in local overrides
  let hasExodusNode3;
  if (localOverrides.value[exodusGem3Key] !== null && localOverrides.value[exodusGem3Key] !== undefined) {
    hasExodusNode3 = localOverrides.value[exodusGem3Key] > 0;
  } else if (props.currentOverrides && props.currentOverrides[exodusGem3Key] !== undefined) {
    hasExodusNode3 = props.currentOverrides[exodusGem3Key] > 0;
  } else {
    // Fallback to global state
    const exodusGemState = gemPlannerStore?.gemStates?.exodus;
    hasExodusNode3 = exodusGemState?.nodes?.[2] || false; // Node 3 = Index 2
  }
  
  if (hasExodusNode3) {
    // Calculate power + innovation upgrade count
    let upgradeCount = 0;
    
    // Count Power gem upgrades
    const powerGemState = gemPlannerStore?.gemStates?.power;
    if (powerGemState?.upgrades) {
      upgradeCount += Object.values(powerGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    // Count Innovation gem upgrades
    const innovationGemState = gemPlannerStore?.gemStates?.innovation;
    if (innovationGemState?.upgrades) {
      upgradeCount += Object.values(innovationGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    return upgradeCount;
  } else {
    return 0;
  }
});

// Computed property for calculated exodus_attractionCreationCount value (Knox)
const calculatedExodusAttractionCreationCount = computed(() => {
  // Check if exodus gem5 is active (considering both global state and current overrides)
  const exodusGem5Key = 'upgrades.gems_nodes.exodus_gem5';
  
  // First check if there's an override for exodus_gem5 in local overrides
  let hasExodusNode5;
  if (localOverrides.value[exodusGem5Key] !== null && localOverrides.value[exodusGem5Key] !== undefined) {
    hasExodusNode5 = localOverrides.value[exodusGem5Key] > 0;
  } else if (props.currentOverrides && props.currentOverrides[exodusGem5Key] !== undefined) {
    hasExodusNode5 = props.currentOverrides[exodusGem5Key] > 0;
  } else {
    // Fallback to global state
    const exodusGemState = gemPlannerStore?.gemStates?.exodus;
    hasExodusNode5 = exodusGemState?.nodes?.[4] || false; // Node 5 = Index 4
  }
  
  if (hasExodusNode5) {
    // Calculate attraction + creation upgrade count
    let upgradeCount = 0;
    
    // Count Attraction gem upgrades
    const attractionGemState = gemPlannerStore?.gemStates?.attraction;
    if (attractionGemState?.upgrades) {
      upgradeCount += Object.values(attractionGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    // Count Creation gem upgrades
    const creationGemState = gemPlannerStore?.gemStates?.creation;
    if (creationGemState?.upgrades) {
      upgradeCount += Object.values(creationGemState.upgrades).reduce((sum, level) => sum + (level || 0), 0);
    }
    
    return upgradeCount;
  } else {
    return 0;
  }
});

// Computed list of categories that have parameters
const visibleCategories = computed(() => {
  return parameterData.value.map(category => {
    // Filter parameters basierend auf aktuellen Bedingungen
    const filteredParams = category.params.filter(param => {
      // Generische Logik für exodus gem CMS Parameter
      if (param.key.startsWith('upgrades.cms.exodus_gem')) {
        // Extrahiere die exodus gem ID aus dem Parameter key (z.B. "exodus_gem4" aus "upgrades.cms.exodus_gem4")
        const exodusGemMatch = param.key.match(/upgrades\.cms\.(exodus_gem\d+)/);
        if (exodusGemMatch) {
          const exodusGemId = exodusGemMatch[1]; // z.B. "exodus_gem4"
          const exodusGemKey = `upgrades.gems_nodes.${exodusGemId}`;
          
          // Prüfe aktuellen Override-Status für das entsprechende exodus gem
          const exodusGemOverride = localOverrides.value[exodusGemKey];
          
          // Prüfe global state aus dem ursprünglichen parameterData
          const exodusGemParam = parameterData.value
            .flatMap(cat => cat.params)
            .find(p => p.key === exodusGemKey);
          const globalValue = exodusGemParam?.globalValue || 0;
          
          // Bestimme den aktuellen effektiven Wert
          const effectiveValue = (exodusGemOverride !== null && exodusGemOverride !== undefined) 
            ? exodusGemOverride 
            : globalValue;
          
          const isActive = effectiveValue > 0;
          
          return isActive;
        }
      }
      
      // Spezielle Logik für exodus_temporalEvolutionCount - nur anzeigen wenn exodus_gem1 aktiv ist
      if (param.key === 'upgrades.gems_nodes.exodus_temporalEvolutionCount') {
        const exodusGem1Key = 'upgrades.gems_nodes.exodus_gem1';
        
        // Prüfe aktuellen Override-Status für exodus gem1
        const exodusGem1Override = localOverrides.value[exodusGem1Key];
        
        // Prüfe global state für exodus gem1
        const exodusGem1Param = parameterData.value
          .flatMap(cat => cat.params)
          .find(p => p.key === exodusGem1Key);
        const exodusGem1GlobalValue = exodusGem1Param?.globalValue || 0;
        
        // Bestimme den aktuellen effektiven Wert für exodus gem1
        const exodusGem1EffectiveValue = (exodusGem1Override !== null && exodusGem1Override !== undefined) 
          ? exodusGem1Override 
          : exodusGem1GlobalValue;
        
        const isExodusGem1Active = exodusGem1EffectiveValue > 0;
        
        return isExodusGem1Active;
      }
      
      // Spezielle Logik für creation_galvTrinketsCount - nur anzeigen wenn creation_gem5 aktiv ist
      if (param.key === 'upgrades.gems_nodes.creation_galvTrinketsCount') {
        const creationGem5Key = 'upgrades.gems_nodes.creation_gem5';
        
        // Prüfe aktuellen Override-Status für creation gem5
        const creationGem5Override = localOverrides.value[creationGem5Key];
        
        // Prüfe global state für creation gem5
        const creationGem5Param = parameterData.value
          .flatMap(cat => cat.params)
          .find(p => p.key === creationGem5Key);
        const creationGem5GlobalValue = creationGem5Param?.globalValue || 0;
        
        // Bestimme den aktuellen effektiven Wert für creation gem5
        const creationGem5EffectiveValue = (creationGem5Override !== null && creationGem5Override !== undefined) 
          ? creationGem5Override 
          : creationGem5GlobalValue;
        
        const isCreationGem5Active = creationGem5EffectiveValue > 0;
        
        return isCreationGem5Active;
      }
      
      // Spezielle Logik für exodus_powerInnovationCount - nur anzeigen wenn exodus_gem3 aktiv ist (Ozzy)
      if (param.key === 'upgrades.gems_nodes.exodus_powerInnovationCount') {
        const exodusGem3Key = 'upgrades.gems_nodes.exodus_gem3';
        
        // Prüfe aktuellen Override-Status für exodus gem3
        const exodusGem3Override = localOverrides.value[exodusGem3Key];
        
        // Prüfe global state für exodus gem3
        const exodusGem3Param = parameterData.value
          .flatMap(cat => cat.params)
          .find(p => p.key === exodusGem3Key);
        const exodusGem3GlobalValue = exodusGem3Param?.globalValue || 0;
        
        // Bestimme den aktuellen effektiven Wert für exodus gem3
        const exodusGem3EffectiveValue = (exodusGem3Override !== null && exodusGem3Override !== undefined) 
          ? exodusGem3Override 
          : exodusGem3GlobalValue;
        
        const isExodusGem3Active = exodusGem3EffectiveValue > 0;
        
        return isExodusGem3Active;
      }
      
      // Spezielle Logik für exodus_attractionCreationCount - nur anzeigen wenn exodus_gem5 aktiv ist (Knox)
      if (param.key === 'upgrades.gems_nodes.exodus_attractionCreationCount') {
        const exodusGem5Key = 'upgrades.gems_nodes.exodus_gem5';
        
        // Prüfe aktuellen Override-Status für exodus gem5
        const exodusGem5Override = localOverrides.value[exodusGem5Key];
        
        // Prüfe global state für exodus gem5
        const exodusGem5Param = parameterData.value
          .flatMap(cat => cat.params)
          .find(p => p.key === exodusGem5Key);
        const exodusGem5GlobalValue = exodusGem5Param?.globalValue || 0;
        
        // Bestimme den aktuellen effektiven Wert für exodus gem5
        const exodusGem5EffectiveValue = (exodusGem5Override !== null && exodusGem5Override !== undefined) 
          ? exodusGem5Override 
          : exodusGem5GlobalValue;
        
        const isExodusGem5Active = exodusGem5EffectiveValue > 0;
        
        return isExodusGem5Active;
      }
      
      // Spezielle Logik für lootKnox und catchUp2 - nur anzeigen wenn attraction gem level >= 4
      if (param.key === 'upgrades.gems_nodes.attraction_lootKnox' || 
          param.key === 'upgrades.gems_nodes.attraction_catchUp2') {
        const attractionLevelKey = 'upgrades.gems_nodes.attraction_level';
        
        // Prüfe aktuellen Override-Status für attraction level
        const attractionLevelOverride = localOverrides.value[attractionLevelKey];
        
        // Prüfe global state für attraction level
        const attractionLevelParam = parameterData.value
          .flatMap(cat => cat.params)
          .find(p => p.key === attractionLevelKey);
        const attractionLevelGlobalValue = attractionLevelParam?.globalValue || 0;
        
        // Bestimme den aktuellen effektiven Wert für attraction level
        const attractionLevelEffectiveValue = (attractionLevelOverride !== null && attractionLevelOverride !== undefined) 
          ? attractionLevelOverride 
          : attractionLevelGlobalValue;
        
        const isAttractionLevel4 = attractionLevelEffectiveValue >= 4;
        
        return isAttractionLevel4;
      }
      
      // Spezielle Logik für Tier 2 Relics - nur anzeigen wenn das entsprechende Gem-Level erreicht ist
      if (param.key.startsWith('upgrades.relics.')) {
        const relicId = param.key.split('.')[2]; // z.B. 't2r5'
        
        // Finde das Relic in UPGRADES, um unlock_gem und unlock_lvl zu prüfen
        const relic = UPGRADES.relics?.find(r => r.id === relicId);
        
        // Wenn das Relic unlock_gem und unlock_lvl hat, prüfe die Bedingung
        if (relic?.unlock_gem && relic?.unlock_lvl) {
          // Hole das Gem-Level aus dem gemPlannerStore
          const gemLevel = gemPlannerStore.gemStates?.[relic.unlock_gem]?.level || 0;
          
          // Nur anzeigen wenn das Gem-Level erreicht ist
          return gemLevel >= relic.unlock_lvl;
        }
        
        // Tier 1 Relics oder Relics ohne Unlock-Bedingung immer anzeigen
        return true;
      }
      
      // Alle anderen Parameter immer anzeigen
      const shouldShow = true;
      
      return shouldShow;
    });
    
    const result = {
      ...category,
      params: filteredParams.map(param => {
        // Update exodus_temporalEvolutionCount with calculated value
        if (param.key === 'upgrades.gems_nodes.exodus_temporalEvolutionCount') {
          return {
            ...param,
            globalValue: calculatedExodusTemporalEvolutionCount.value
          };
        }
        // Update creation_galvTrinketsCount with calculated value
        else if (param.key === 'upgrades.gems_nodes.creation_galvTrinketsCount') {
          return {
            ...param,
            globalValue: calculatedCreationGalvTrinketsCount.value
          };
        }
        // Update exodus_powerInnovationCount with calculated value
        else if (param.key === 'upgrades.gems_nodes.exodus_powerInnovationCount') {
          return {
            ...param,
            globalValue: calculatedExodusPowerInnovationCount.value
          };
        }
        // Update exodus_attractionCreationCount with calculated value
        else if (param.key === 'upgrades.gems_nodes.exodus_attractionCreationCount') {
          return {
            ...param,
            globalValue: calculatedExodusAttractionCreationCount.value
          };
        }
        return param;
      })
    };
    
    return result;
  }).filter(category => {
    const hasParams = category.params.length > 0;
    
    return hasParams;
  });
});

// NEUE Funktion für ValueControls
function updateOverrideValue(paramKey, newValue, param) {
  // Verwende Basis-Wert (Category Override oder Global)
  const baseValue = getBaseValue(paramKey, param.globalValue);
  
  // Runde den Wert, da wir mit ganzen Zahlen arbeiten
  newValue = Math.floor(newValue);
  
  // Wenn der neue Wert dem Basis-Wert entspricht, setze auf null zurück
  if (Math.floor(newValue) === Math.floor(baseValue)) {
    localOverrides.value[paramKey] = null;
  } else {
    localOverrides.value[paramKey] = newValue;
  }
  
  // Begrenze auf den Maximalwert
  if (localOverrides.value[paramKey] !== null && param.maxValue !== null && param.maxValue !== Infinity && localOverrides.value[paramKey] > param.maxValue) {
    localOverrides.value[paramKey] = param.maxValue;
  }
  
  // Stelle sicher, dass der Wert nicht unter 0 fällt
  if (localOverrides.value[paramKey] !== null && localOverrides.value[paramKey] < 0) {
    localOverrides.value[paramKey] = 0;
  }
  
  // Aktualisiere Kostenberechnung
  calculateTotalCost();
}

// ALTE Funktionen (bleiben für die Rückwärtskompatibilität)
function decreaseOverride(param) {
  const paramData = parameterData.value
    .flatMap(category => category.params)
    .find(p => p.key === param);
  
  if (!paramData) return;
  
  const globalValue = paramData.globalValue;
  
  if (localOverrides.value[param] === null) {
    // Wenn kein Override existiert, starte mit globalValue - 1
    localOverrides.value[param] = Math.floor(globalValue) - 1;
  } else {
    // Verringere um 1
    localOverrides.value[param] -= 1;
    
    // Wenn der neue Wert dem globalen Wert entspricht, setze auf null zurück
    if (Math.floor(localOverrides.value[param]) === Math.floor(globalValue)) {
      localOverrides.value[param] = null;
    }
  }
  
  // Stelle sicher, dass der Wert nicht unter 0 fällt
  if (localOverrides.value[param] !== null && localOverrides.value[param] < 0) {
    localOverrides.value[param] = 0;
  }
  
  // Aktualisiere Kostenberechnung
  calculateTotalCost();
}

function increaseOverride(param, maxValue) {
  const paramData = parameterData.value
    .flatMap(category => category.params)
    .find(p => p.key === param);
  
  if (!paramData) return;
  
  const globalValue = paramData.globalValue;
  
  if (localOverrides.value[param] === null) {
    // Wenn kein Override existiert, starte mit globalValue + 1
    localOverrides.value[param] = Math.floor(globalValue) + 1;
  } else {
    // Erhöhe um 1
    localOverrides.value[param] += 1;
    
    // Wenn der neue Wert dem globalen Wert entspricht, setze auf null zurück
    if (Math.floor(localOverrides.value[param]) === Math.floor(globalValue)) {
      localOverrides.value[param] = null;
    }
  }
  
  // Begrenze auf den Maximalwert
  if (localOverrides.value[param] !== null && maxValue !== null && maxValue !== Infinity && localOverrides.value[param] > maxValue) {
    localOverrides.value[param] = maxValue;
  }

  // Aktualisiere Kostenberechnung
  calculateTotalCost();
}

// Toggle boolean parameters
function toggleBooleanOverride(paramKey, value, param) {
  // Verwende Basis-Wert (Category Override oder Global)
  const baseValue = getBaseValue(paramKey, param.globalValue);
  const targetValue = value ? 1 : 0;
  
  // Wenn der Zielwert dem Basis-Wert entspricht, setze auf null zurück
  if (targetValue === baseValue) {
    localOverrides.value[paramKey] = null;
  } 
  // Wenn bereits ein Override mit diesem Wert existiert, setze auf null zurück (Toggle)
  else if (localOverrides.value[paramKey] === targetValue) {
    localOverrides.value[paramKey] = null;
  } 
  // Ansonsten setze den neuen Override
  else {
    localOverrides.value[paramKey] = targetValue;
  }
  
  // Update cost calculation
  calculateTotalCost();
}

// Funktion um festzustellen, ob Kosten angezeigt werden sollen
function showCostForParam(param) {
  // Keine Kosten für stage und proj anzeigen
  if (param.key === 'stage' || param.key === 'proj') {
    return false;
  }
  
  // Verwende Basis-Wert (Category Override oder Global)
  const baseValue = getBaseValue(param.key, param.globalValue);
  
  // Für Basis-Stats nur wenn Override höher als Basis
  if (param.category === 'baseStats') {
    return localOverrides.value[param.key] !== null &&
           localOverrides.value[param.key] > baseValue;
  }
  
  // Für Relics nur wenn Override höher als Basis
  if (param.key.startsWith('upgrades.relics.')) {
    return localOverrides.value[param.key] !== null &&
           localOverrides.value[param.key] > baseValue;
  }
  
  // Für Gadgets nur wenn Override höher als Basis
  if (param.key.startsWith('upgrades.gadgets.')) {
    return localOverrides.value[param.key] !== null &&
           localOverrides.value[param.key] > baseValue;
  }

  // Für Inscryptions nur wenn Override höher als Basis
  if (param.key.startsWith('upgrades.inscryptions.')) {
  return localOverrides.value[param.key] !== null &&
         localOverrides.value[param.key] > baseValue;
  }

  // Für Gems (Orb-Kosten) nur wenn Override höher als Basis
  if (param.key.startsWith('upgrades.gems_nodes.')) {
    return localOverrides.value[param.key] !== null &&
           localOverrides.value[param.key] > baseValue;
  }
  
  return false;
}

// Funktion zur Berechnung der Kosten für einen Parameter
function getParamCost(param) {
  if (!showCostForParam(param)) return 0;
  
  // Verwende Basis-Wert (Category Override oder Global)
  const baseValue = getBaseValue(param.key, param.globalValue);
  const fromLevel = Math.floor(baseValue);
  const toLevel = localOverrides.value[param.key];
  
  // Für Relics
  if (param.key.startsWith('upgrades.relics.')) {
    // Format ist upgrades.relics.relicId, z.B. upgrades.relics.r4 (entspricht relic04)
    const relicId = param.key.split('.')[2]; // Extrahiert 'r4'
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
    
    return calcRelicCostDifference(relicType, fromLevel, toLevel);
  }
  
  // Für Gadgets
  if (param.key.startsWith('upgrades.gadgets.')) {
    // Format ist upgrades.gadgets.gadgetId, z.B. upgrades.gadgets.wrench
    const gadgetId = param.key.split('.')[2]; // Extrahiert 'wrench'
    
    // Direkt den gadgetId verwenden - unsere gadgetCostUtils kennt 'wrench', 'zaptron', usw.
    return calcGadgetCostDifference(gadgetId, fromLevel, toLevel);
  }

  // Für Inscryptions
  if (param.key.startsWith('upgrades.inscryptions.')) {
    // Format ist upgrades.inscryptions.inscryptionId, z.B. upgrades.inscryptions.i80
    const inscryptionId = param.key.split('.')[2]; // Extrahiert 'i80'
    
      return calcInscryptionCostDifference(inscryptionId, fromLevel, toLevel);
  }

  // Für Gems (Orb-Kosten)
  if (param.key.startsWith('upgrades.gems_nodes.')) {
    const nodeId = param.key.split('.')[2]; // z.B. "attraction_lootBorge"
    
    // Anpassung an die tatsächliche Store-Struktur
    if (nodeId === 'attraction_lootBorge') {
      return calcOrbCostDifference('lootBorge', fromLevel, toLevel);
    } else if (nodeId === 'attraction_lootOzzy') {
      return calcOrbCostDifference('lootOzzy', fromLevel, toLevel);
    } else if (nodeId === 'attraction_lootKnox') {
      return calcOrbCostDifference('lootKnox', fromLevel, toLevel);
    } else if (nodeId === 'attraction_catchUp') {
      return calcOrbCostDifference('catchUp', fromLevel, toLevel);
    } else if (nodeId === 'attraction_catchUp2') {
      return calcOrbCostDifference('catchUp2', fromLevel, toLevel);
    } else if (nodeId === 'creation_borgeGU') {
      return calcOrbCostDifference('borgeGU', fromLevel, toLevel);
    } else if (nodeId === 'creation_ozzyGU') {
      return calcOrbCostDifference('ozzyGU', fromLevel, toLevel);
    } else if (nodeId === 'creation_knoxGU') {
      return calcOrbCostDifference('knoxGU', fromLevel, toLevel);
    }
  }

  // Für normale Stats
  const statKey = param.key; // Direkt den key des Parameters verwenden
  return calcCostDifference(statKey, fromLevel, toLevel, props.hunterType);
}

// Funktion zur Berechnung der Gesamtkosten
function calculateTotalCost() {
  let cost = 0;
  let hasMaxCost = false;
  
  // Alle Parameter durchlaufen
  parameterData.value.forEach(category => {
    category.params.forEach(param => {
      if (showCostForParam(param)) {
        const paramCost = getParamCost(param);
        
        // Wenn irgendein Parameter "MAX" zurückgibt, setzen wir hasMaxCost flag
        if (paramCost === "MAX") {
          hasMaxCost = true;
        } else if (typeof paramCost === 'number') {
          cost += paramCost;
        }
      }
    });
  });
  
  // Gesamtkosten speichern und formatieren
  if (hasMaxCost) {
    totalCost.value = "MAX";
  } else if (cost > 0) {
    totalCost.value = formatCost(cost);
  } else {
    totalCost.value = null;
  }
}

// Bestimmt die Textfarbe basierend auf dem Vergleich zwischen Override- und Global-Wert
function getValueColorClass(paramKey, globalValue) {
  const overrideValue = localOverrides.value[paramKey];
  
  // Wenn kein Override gesetzt ist, neutrale Farbe
  if (overrideValue === null) {
    return 'text-gray-500';
  }
  
  // Wenn der Override-Wert größer ist als der globale Wert
  if (overrideValue > globalValue) {
    return 'text-green-400';
  }
  
  // Wenn der Override-Wert kleiner ist als der globale Wert
  if (overrideValue < globalValue) {
    return 'text-red-400';
  }
  
  // Wenn die Werte gleich sind
  return 'text-white';
}

function resetOverride(param) {
  localOverrides.value[param] = null;
  calculateTotalCost();
}

function resetAllOverrides() {
  Object.keys(localOverrides.value).forEach(param => {
    localOverrides.value[param] = null;
  });
  calculateTotalCost();
}

function handleClose() {
  // Filter out null values AND values that equal the base value
  const overridesToSave = {};
  
  for (const [param, value] of Object.entries(localOverrides.value)) {
    // Skip null values
    if (value === null) continue;
    
    // Find the parameter data to get the global value
    const paramData = parameterData.value
      .flatMap(category => category.params)
      .find(p => p.key === param);
    
    // Get the base value (category override or global)
    const baseValue = getBaseValue(param, paramData?.globalValue || 0);
    
    // If parameter data is not found or the override equals base value, skip it
    if (!paramData || Math.floor(value) === Math.floor(baseValue)) {
      continue;
    }
    
    // Only save values that differ from base
    overridesToSave[param] = value;
  }
  
  // MODE SWITCH: Emit basierend auf dem Modus
  if (props.mode === 'category') {
    // Category-Mode: Emit category overrides
    emit('categoryOverridesUpdated', {
      categoryId: props.categoryId,
      overrides: overridesToSave
    });
  } else {
    // Build-Mode: Emit build overrides
    if (props.buildId) {
      emit('overridesUpdated', {
        buildId: props.buildId,
        overrides: overridesToSave
      });
    } else {
      // Kein buildId -> direkt die Overrides emittieren (für neue Builds)
      emit('overridesUpdated', overridesToSave);
    }
  }
  
  emit('close');
}

// Watch for changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    // NEU: Beim Öffnen des Modals prüfen, ob es ein importierter Build ist
    if (props.isImportedBuild) {
      // Bei importierten Builds: Hide Maxed automatisch deaktivieren
      localHideMaxed.value = false;
    } else {
      // Bei normalen Builds: Einstellung aus LocalStorage laden
      loadHideMaxedSetting();
    }
    
    loadOverrideData();
  }
});

watch(() => props.currentOverrides, () => {
  if (props.isVisible && !isLoading.value) {
    initLocalOverrides();
    calculateTotalCost();
  }
});

watch(() => props.hunterType, () => {
  if (props.isVisible) {
    loadOverrideData();
  }
});

// NEU: Watch für isImportedBuild Änderungen
watch(() => props.isImportedBuild, (newValue) => {
  if (newValue && props.isVisible) {
    // Wenn der Build als importiert markiert wird und das Modal offen ist
    localHideMaxed.value = false;
  }
});

onMounted(() => {
  if (props.isVisible) {
    // NEU: Beim Mount prüfen, ob es ein importierter Build ist
    if (props.isImportedBuild) {
      localHideMaxed.value = false;
    } else {
      loadHideMaxedSetting();
    }
    
    loadOverrideData();
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