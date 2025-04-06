<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
    @click.self="saveAndClose"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Reset-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-blue-400">TR Planner</span>
            <span class=""> - Current Stats</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="resetAllStats" 
              class="px-2 py-1 sm:px-3 bg-gray-600 hover:bg-gray-500 text-xs sm:text-sm text-white rounded-md"
            >
              Reset
            </button>
            <button 
              @click="saveAndClose"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Description Area -->
      <div class="p-3 bg-gray-750/60 border-b border-gray-700">
        <p class="text-xs text-gray-300">
          These values will be automatically applied to new plans. 
          Maxed Stats will be hidden in plan creation but still included in all calculations.
        </p>
      </div>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="p-6 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
        <p class="text-gray-400 text-sm">Loading boosts...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ error }}</p>
        <button 
          @click="loadBoostData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Retry
        </button>
      </div>

      <!-- Boost Categories -->
      <div v-else class="p-3">
        <!-- Regular Boost Categories -->
        <div v-for="(category, categoryIndex) in filteredBoostsByCategory" :key="category.id" class="mb-3">
          <!-- Category Header -->
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
          </div>
          
          <!-- Boost Parameters Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div 
              v-for="(boost, boostIndex) in category.boosts" 
              :key="boost.key" 
              class="bg-gray-750/60 rounded-md pl-1.5 bg-gray-700/60 transition-colors border border-transparent hover:border-gray-600"
            >
              <!-- Oberer Bereich: Boost Name und Max Level -->
              <div class="flex items-start justify-between mb-1">
                <!-- Boost Name -->
                <div class="flex-grow">
                  <span class="text-xs font-medium text-gray-300">{{ boost.label }}</span>
                </div>
                
                <!-- Max Level Badge (wenn vorhanden) - oben rechts -->
                <div class="flex-shrink-0 ml-2">
                  <span 
                    v-if="boost.max !== undefined"
                    class="text-[10px] px-1.5 py-0.5 rounded bg-gray-600/80 text-gray-300 font-medium inline-block"
                  >
                    max: {{ boost.max }}
                  </span>
                </div>
              </div>
              
              <!-- Tooltip (optional) -->
              <div v-if="boost.tooltip && boost.tooltip !== '0'" class="text-[10px] text-gray-400 mb-1">
                {{ boost.tooltip }}
              </div>
              
              <!-- Unterer Bereich: Multiplier Info und Controls - nebeneinander -->
              <div class="flex items-center justify-between mt-1">
                <!-- Multipliers Info -->
                <div class="flex-grow text-[10px] text-gray-400">
                  <!-- Spezialfall für R6 mit part1 und part2 -->
                  <template v-if="boost.key === 'r6' && getFragMultiplierText(boost)">
                    <span class="text-blue-400">
                      {{ getFragMultiplierText(boost).part1 }} {{ getFragMultiplierText(boost).part2 }}
                    </span>
                  </template>
                  
                  <!-- Standard-Anzeige für andere Boosts -->
                  <template v-else>
                    <template v-if="getMultiplierText(boost) && getFragMultiplierText(boost)">
                      {{ getMultiplierText(boost) }} / <span class="text-blue-400">{{ getFragMultiplierText(boost) }}</span>
                    </template>
                    <template v-else-if="getMultiplierText(boost)">
                      {{ getMultiplierText(boost) }}
                    </template>
                    <template v-else-if="getFragMultiplierText(boost)">
                      <span class="text-blue-400">{{ getFragMultiplierText(boost) }}</span>
                    </template>
                    <!-- Leerer Platzhalter, wenn kein Multiplier angezeigt wird -->
                    <template v-else>
                      <span class="text-transparent">×</span>
                    </template>
                  </template>
                </div>
                
                <!-- Controls - rechts auf der gleichen Zeile wie Multiplier -->
                <div class="flex-shrink-0 ml-2">
                  <!-- Boolean Type Controls -->
                  <div v-if="boost.type === 'boolean'" class="flex justify-end min-w-[40px]">
                    <button 
                      @click="toggleBooleanStat(boost.key)"
                      class="text-xs px-1.5 py-0.5 rounded-sm"
                      :class="statValues[boost.key] ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-green-800/50 text-white'"
                      :tabindex="getTabIndex(categoryIndex, boostIndex)"
                    >
                      {{ statValues[boost.key] ? 'ON' : 'OFF' }}
                    </button>
                  </div>
                  
                  <!-- Numeric Type Controls -->
                  <div v-else class="flex items-center justify-end min-w-[80px]">
                    <TRValueControls
                      ref="valueControls"
                      :value="statValues[boost.key] || 0"
                      :minValue="0"
                      :maxValue="boost.max || 9999"
                      :showFastControls="true"
                      :step="1"
                      :valueClass="'text-white'"
                      :tabIndex="getTabIndex(categoryIndex, boostIndex)"
                      :autoEdit="true"
                      @update:value="(newVal) => updateStatValue(boost.key, newVal, boost)"
                      :data-boost-key="boost.key"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-if="filteredBoostsByCategory.length === 0" class="py-4 text-center text-gray-400 text-sm">
          No boosts available
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { allBoosts, boostsByCategory } from '@/constants/tr-planner';
import TRValueControls from '@/composables/TRValueControls.vue';
import { formatMultiplier, formatNumber } from '@/composables/format';
import { 
  IconX, 
  IconAlertCircle,
} from '@tabler/icons-vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  currentStats: {
    type: Object,
    required: true
  },
  showFragmultiBoosts: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

// State
const isLoading = ref(true);
const error = ref(null);
const statValues = reactive({});
const valueControls = ref([]);

// Gefilterte Boosts - Alle Boosts außer hoursInTR und loopMods
const filteredBoostsByCategory = computed(() => {
  return boostsByCategory
    .map(category => {
      // Alle Boosts außer hoursInTR und loopMods
      const filteredBoosts = category.boosts.filter(boost => 
        boost.key !== 'hoursInTR' && boost.key !== 'loopMods'
      );
      
      return {
        ...category,
        boosts: filteredBoosts
      };
    })
    .filter(category => category.boosts.length > 0); // Nur Kategorien mit Boosts
});

// Tabindex berechnen
function getTabIndex(categoryIndex, boostIndex) {
  // Wir starten bei 1 (0 ist für die erste Komponente, die fokusiert werden kann)
  // und berechnen einen eindeutigen Index basierend auf der Kategorie und dem Boost
  let tabIndex = 1;
  
  // Sicherer Zugriff auf das computed property
  const categories = filteredBoostsByCategory.value || [];
  
  // Für jede vorherige Kategorie zählen wir die Boosts
  for (let i = 0; i < categoryIndex && i < categories.length; i++) {
    if (categories[i] && categories[i].boosts) {
      tabIndex += categories[i].boosts.length;
    }
  }
  
  // Plus den aktuellen Boost-Index
  tabIndex += boostIndex;
  
  return tabIndex;
}

function getMultiplierText(boost) {
  if (!boost || boost.multiplier === undefined) return null;
  
  // Aktuellen Level verwenden
  const boostKey = boost.key;
  const currentLevel = statValues[boostKey] || 0;
  
  // Wenn Level 0 ist, aber der Boost einen Multiplier hat, immer ×1.00 anzeigen
  if (currentLevel === 0) {
    return '×1.00';
  }
  
  // Spezialfall für Boolean-Boosts
  if (boost.type === 'boolean') {
    // Status direkt aus statValues nehmen
    const isActive = statValues[boostKey] || false;

    if (typeof boost.multiplier === 'number') {
      return isActive ? formatMultiplier(boost.multiplier) : '×1.00';
    }
    return isActive ? formatMultiplier(boost.multiplier(1, statValues)) : '×1.00';
  }
  
  // Spezialfall für Research
  if (boostKey === 'research') {
    try {
      const value = boost.multiplier(currentLevel, statValues);
      return formatMultiplier(value);
    } catch (e) {
      console.error(`Error calculating research multiplier:`, e);
      return '×1.00';
    }
  }
  
  // Standardfall für numerische Boosts
  if (typeof boost.multiplier === 'number') {
    return formatMultiplier(boost.multiplier);
  } else if (typeof boost.multiplier === 'function') {
    try {
      const value = boost.multiplier(currentLevel, statValues);
      return formatMultiplier(value);
    } catch (e) {
      console.error(`Error calculating multiplier for ${boostKey}:`, e);
      return '×1.00';
    }
  }
  
  return null;
}

// Hilfsfunktion für Fragmulti-Anzeige
function getFragMultiplierText(boost) {
  if (!boost || boost.fragmulti === undefined) return null;
  
  // Aktuellen Level verwenden
  const boostKey = boost.key;
  const currentLevel = statValues[boostKey] || 0;
  
  // Wenn Level 0 ist, aber der Boost einen FragMultiplier hat, immer ×1.00 anzeigen
  if (currentLevel === 0) {
    // Spezialfall für R6, der auch bei 0 einen speziellen Text hat
    if (boostKey === 'r6') {
      return {
        part1: '+0.00',
        part2: '×1.00'
      };
    }
    return '×1.00';
  }
  
  // Spezialfall für R6 mit +x.xx Anzeige
  if (boostKey === 'r6') {
    try {
      const value = currentLevel;
      const part1 = 2.75 * value;
      const part2 = Math.pow(1.05, value);
      
      return {
        part1: `+${part1.toFixed(2)}`,
        part2: formatMultiplier(part2)
      };
    } catch (e) {
      console.error(`Error calculating r6 fragmulti:`, e);
      return {
        part1: '+0.00',
        part2: '×1.00'
      };
    }
  }
  
  // Standardfall für numerische Boosts
  if (typeof boost.fragmulti === 'number') {
    return formatMultiplier(boost.fragmulti);
  } else if (typeof boost.fragmulti === 'function') {
    try {
      const value = boost.fragmulti(currentLevel, statValues);
      return formatMultiplier(value);
    } catch (e) {
      console.error(`Error calculating fragmulti for ${boostKey}:`, e);
      return '×1.00';
    }
  }
  
  return null;
}

// Boosts laden
async function loadBoostData() {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Initialisiere statValues mit Standardwerten
    initializeStatValues();
    
    isLoading.value = false;
  } catch (err) {
    console.error('Error loading boost data:', err);
    error.value = `Failed to load boosts: ${err.message}`;
    isLoading.value = false;
  }
}

// Initialisiert die statValues mit Standardwerten
function initializeStatValues() {
  // Für jeden Boost außer hoursInTR und loopMods initialisieren wir einen Wert
  allBoosts.forEach(boost => {
    if (boost.key !== 'hoursInTR' && boost.key !== 'loopMods') {
      const existingValue = props.currentStats[boost.key];
      
      if (boost.type === 'boolean') {
        statValues[boost.key] = existingValue !== undefined ? !!existingValue : false;
      } else if (boost.type === 'number') {
        statValues[boost.key] = existingValue !== undefined ? existingValue : 0;
      }
    }
  });
}

// Aktualisiere statValues wenn props aktualisiert werden
watch(() => props.currentStats, (newStats) => {
  if (newStats && !isLoading.value) {
    // Aktualisiere nur die Werte, die in newStats vorhanden sind, außer hoursInTR und loopMods
    Object.keys(newStats).forEach(key => {
      if (key in statValues && key !== 'hoursInTR' && key !== 'loopMods') {
        statValues[key] = newStats[key];
      }
    });
  }
}, { deep: true });

// Update Booststats
function updateStatValue(boostKey, newValue, boost) {
  // Runde den Wert für bessere UX
  newValue = Math.floor(newValue);
  
  // Setze neuen Wert
  statValues[boostKey] = newValue;
  
  // Begrenze auf den Maximalwert
  if (boost.max !== undefined && statValues[boostKey] > boost.max) {
    statValues[boostKey] = boost.max;
  }
  
  // Stelle sicher, dass der Wert nicht unter 0 fällt
  if (statValues[boostKey] < 0) {
    statValues[boostKey] = 0;
  }
}

// Toggle boolean stats
function toggleBooleanStat(boostKey) {
  statValues[boostKey] = !statValues[boostKey];
}

// Reset all stats
function resetAllStats() {
  // Direkt ohne Bestätigung zurücksetzen
  
  // Alle Boosts zurücksetzen, außer hoursInTR und loopMods
  allBoosts.forEach(boost => {
    if (boost.key !== 'hoursInTR' && boost.key !== 'loopMods') {
      if (boost.type === 'boolean') {
        statValues[boost.key] = false;
      } else {
        statValues[boost.key] = 0;
      }
    }
  });
}

// Speichern und schließen
function saveAndClose() {
  // Vorhandene hoursInTR und loopMods Werte beibehalten
  const updatedStats = {
    ...statValues,
    hoursInTR: props.currentStats.hoursInTR || 0,
    loopMods: props.currentStats.loopMods || 0
  };
  
  emit('save', updatedStats);
  emit('close');
}

// Reaktive Beobachtung der statValues, um die Anzeige zu aktualisieren
watch(statValues, () => {
  // Diese Funktion löst eine Neuberechnung der Template-Bindungen aus
  // Keine spezifische Logik nötig, da Vue die Neubindung automatisch handhabt
}, { deep: true });

// Initialisiere das Modal beim Öffnen
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadBoostData();
  }
});

onMounted(() => {
  if (props.isVisible) {
    loadBoostData();
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