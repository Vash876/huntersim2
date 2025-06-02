<!-- filepath: c:\Users\igorn\projects\huntersim2\src\components\common\OverrideModal.vue -->
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
      <!-- Header mit Reset-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span :class="`text-${hunterColor}-400`">{{ buildName }}</span>
            <span class=""> - Overrides</span>
          </h2>
          <div class="flex items-center gap-2">
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

      <!-- Override Categories - Neues Design -->
      <div v-else class="p-3">
        <div v-for="(category, index) in visibleCategories" :key="index" class="mb-3">
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
              <!-- Parameter Name -->
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-medium text-gray-300">{{ truncateName(param.name) }}</span>
                
                <!-- Max Value Badge -->
                <span 
                  v-if="param.maxValue !== null && param.maxValue !== Infinity && param.type !== 'boolean'" 
                  class="text-[10px] bg-gray-700 text-gray-400 px-1 py-0.5 rounded"
                >
                  max: {{ param.maxValue }}
                </span>
              </div>
              
              <!-- Controls -->
              <div class="flex items-center justify-between">
                <!-- Global Value Badge -->
                <div class="flex items-center">
                  <div class="text-[10px] mr-2 text-gray-400 uppercase">global</div>
                  
                  <!-- Boolean Global Value -->
                  <div v-if="param.type === 'boolean'" 
                       class="text-xs px-1.5 py-0.5 rounded"
                       :class="param.globalValue ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'"
                  >
                    {{ param.globalValue ? 'ON' : 'OFF' }}
                  </div>
                  
                  <!-- Numeric Global Value -->
                  <div v-else class="text-xs text-gray-300">
                    {{ param.globalValue }}
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
                    v-if="param.globalValue === 0 || param.globalValue === false"
                    @click="toggleBooleanOverride(param.key, true)"
                    class="text-xs px-2 py-0.5 rounded"
                    :class="localOverrides[param.key] === 1 ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-green-800/50 text-white'"
                  >
                    ON
                  </button>
                  <button 
                    v-else
                    @click="toggleBooleanOverride(param.key, false)"
                    class="text-xs px-2 py-0.5 rounded"
                    :class="localOverrides[param.key] === 0 ? 'bg-red-700 text-red-100' : 'bg-gray-700 hover:bg-red-800/50 text-white'"
                  >
                    OFF
                  </button>
                </div>
                
                <!-- Numeric Type Controls mit ValueControls -->
                <div v-else class="flex items-center">
                  <ValueControls
                    :value="localOverrides[param.key] === null ? param.globalValue : localOverrides[param.key]"
                    :minValue="0"
                    :maxValue="param.maxValue || 999"
                    :showFastControls="true"
                    :step="1"
                    :valueClass="getValueColorClass(param.key, param.globalValue)"
                    @update:value="(newVal) => updateOverrideValue(param.key, newVal, param)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="visibleCategories.length === 0" class="py-4 text-center text-gray-400 text-sm">
          No parameters available
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { 
  IconX, IconChevronLeft, IconChevronRight, IconAlertCircle 
} from '@tabler/icons-vue';
import { useHunterStore } from '../../store/hunterStore';
import { HUNTERS } from '../../constants/hunters';
import { UPGRADES } from '../../constants/upgrades';
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
  buildName: { type: String, default: 'Build' },
  buildId: { type: String, default: null },
  currentOverrides: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['edit', 'clone', 'archive', 'delete', 'nameChanged', 'overrides', 'share', 'overridesBuild', 'close', 'overridesUpdated']);

// Store
const hunterStore = useHunterStore();

// Local state
const isLoading = ref(true);
const loadError = ref(null);
const localOverrides = ref({});
const parameterData = ref([]);
const totalCost = ref(null);

// Helper function to truncate names
function truncateName(name) {
  if (!name) return '';
  return name.length > 22 ? name.substring(0, 22) + '...' : name;
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
    const upgradesData = hunterStore.upgrades || {};
    
    // Process all parameters from OVERRIDES
    const processedCategories = [];
    
    // Process parameters by category
    for (const [category, params] of Object.entries(hunterModule.OVERRIDES)) {
      const categoryLabel = hunterModule.OVERRIDE_CATEGORY_LABELS?.[category] || formatCategoryName(category);
      
      const processedCategory = {
        key: category,
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
            
            // Special handling for gem_nodes
            if (upgradeType === 'gems_nodes') {
              // Format is "gemname_nodeid" (e.g. "creation_gem1")
              const gemNodeParts = upgradeId.split('_');
              if (gemNodeParts.length >= 2) {
                const gemName = gemNodeParts[0]; // e.g. "creation"
                const nodeId = gemNodeParts.slice(1).join('_'); // e.g. "gem1"
                
                // Find the gem in UPGRADES.gems
                const gem = UPGRADES.gems.find(g => g.id === gemName);
                if (gem) {
                  // Find the node in gem.nodes
                  const node = gem.nodes.find(n => n.id === nodeId);
                  if (node) {
                    paramName = node.name;
                    maxValue = node.maxLevel || (node.type === 'boolean' ? 1 : null);
                    type = node.type || "numeric";
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

// Computed list of categories that have parameters
const visibleCategories = computed(() => {
  return parameterData.value.filter(category => category.params.length > 0);
});

// NEUE Funktion für ValueControls
function updateOverrideValue(paramKey, newValue, param) {
  const globalValue = param.globalValue;
  
  // Runde den Wert, da wir mit ganzen Zahlen arbeiten
  newValue = Math.floor(newValue);
  
  // Wenn der neue Wert dem globalen Wert entspricht, setze auf null zurück
  if (Math.floor(newValue) === Math.floor(globalValue)) {
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
function toggleBooleanOverride(param, value) {
  // Set to the new value or reset if it's the same as the current override
  if (localOverrides.value[param] === (value ? 1 : 0)) {
    localOverrides.value[param] = null;
  } else {
    localOverrides.value[param] = value ? 1 : 0;
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
  
  // Für Basis-Stats nur wenn Override höher als global
  if (param.category === 'baseStats') {
    return localOverrides.value[param.key] !== null &&
           localOverrides.value[param.key] > param.globalValue;
  }
  
  // Für Relics nur wenn Override höher als global
  if (param.key.startsWith('upgrades.relics.')) {
    return localOverrides.value[param.key] !== null &&
           localOverrides.value[param.key] > param.globalValue;
  }
  
  // Für Gadgets nur wenn Override höher als global
  if (param.key.startsWith('upgrades.gadgets.')) {
    return localOverrides.value[param.key] !== null &&
           localOverrides.value[param.key] > param.globalValue;
  }

  // Für Inscryptions nur wenn Override höher als global
  if (param.key.startsWith('upgrades.inscryptions.')) {
  return localOverrides.value[param.key] !== null &&
         localOverrides.value[param.key] > param.globalValue;
  }

  // Für Gems (Orb-Kosten) nur wenn Override höher als global
  if (param.key.startsWith('upgrades.gems_nodes.')) {
    return localOverrides.value[param.key] !== null &&
           localOverrides.value[param.key] > param.globalValue;
  }
  
  return false;
}

// Funktion zur Berechnung der Kosten für einen Parameter
function getParamCost(param) {
  if (!showCostForParam(param)) return 0;
  
  const fromLevel = Math.floor(param.globalValue);
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
    console.log("Node ID:", nodeId);
    
    // Anpassung an die tatsächliche Store-Struktur
    if (nodeId === 'attraction_lootBorge') {
      return calcOrbCostDifference('lootBorge', fromLevel, toLevel);
    } else if (nodeId === 'attraction_lootOzzy') {
      return calcOrbCostDifference('lootOzzy', fromLevel, toLevel);
    } else if (nodeId === 'attraction_catchUp') {
      return calcOrbCostDifference('catchUp', fromLevel, toLevel);
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
  // Filter out null values AND values that equal the global value
  const overridesToSave = {};
  
  for (const [param, value] of Object.entries(localOverrides.value)) {
    // Skip null values
    if (value === null) continue;
    
    // Find the parameter data to get the global value
    const paramData = parameterData.value
      .flatMap(category => category.params)
      .find(p => p.key === param);
    
    // If parameter data is not found or the override equals global value, skip it
    if (!paramData || Math.floor(value) === Math.floor(paramData.globalValue)) {
      continue;
    }
    
    // Only save values that differ from global
    overridesToSave[param] = value;
  }
  
  // Wenn buildId vorhanden ist, im neuen Format emittieren
  if (props.buildId) {
    emit('overridesUpdated', {
      buildId: props.buildId,
      overrides: overridesToSave
    });
  } else {
    // Kein buildId -> direkt die Overrides emittieren (für neue Builds)
    emit('overridesUpdated', overridesToSave);
  }
  
  emit('close');
}

// Watch for changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
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

onMounted(() => {
  if (props.isVisible) {
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