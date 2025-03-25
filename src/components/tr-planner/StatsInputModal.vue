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
            <span class=""> - Player Stats</span>
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
        <!-- Special case for general stats -->
        <div class="mb-3">
          <!-- Category Header -->
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">General Stats</h3>
          </div>
          
          <!-- General Stats Parameters -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <!-- Dynamic Stats from generalStats array -->
            <div 
              v-for="stat in generalStats" 
              :key="stat.key"
              class="bg-gray-750/60 rounded-md p-1.5 bg-gray-700/60 transition-colors border border-transparent hover:border-gray-600"
            >
              <!-- Parameter Name -->
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-medium text-gray-300">{{ stat.label }}</span>
              </div>
              
              <!-- Tooltip if exists -->
              <div v-if="stat.tooltip" class="text-[10px] text-gray-400 mb-1">
                {{ stat.tooltip }}
              </div>
              
              <!-- Controls -->
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <!-- Special case for All-Time Orbs - with suffix support -->
                  <div v-if="stat.key === 'allTimeOrbs'" class="relative">
                    <input 
                      v-model="orbsDisplayValue"
                      type="text" 
                      placeholder="0"
                      @input="handleOrbsInput"
                      @blur="formatOrbsDisplay"
                      class="w-full py-1 px-2 text-xs bg-gray-800 text-white rounded border border-gray-700"
                    />
                  </div>
                  
                  <!-- Other general stats use TRValueControls -->
                  <TRValueControls
                    v-else
                    :value="statValues[stat.key] || 0"
                    :minValue="0"
                    :maxValue="9999"
                    :showFastControls="false"
                    :step="1"
                    :valueClass="'text-white'"
                    @update:value="(newVal) => statValues[stat.key] = newVal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Regular Boost Categories -->
        <div v-for="category in filteredBoostsByCategory" :key="category.id" class="mb-3">
          <!-- Category Header -->
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
          </div>
          
          <!-- Boost Parameters Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div 
              v-for="boost in category.boosts" 
              :key="boost.key" 
              class="bg-gray-750/60 rounded-md p-1.5 bg-gray-700/60 transition-colors border border-transparent hover:border-gray-600"
            >
              <!-- Boost Name -->
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-medium text-gray-300">{{ boost.label }}</span>
                
                <!-- Max Value Badge -->
                <span 
                  v-if="boost.max !== undefined && boost.type !== 'boolean'" 
                  class="text-[10px] bg-gray-700 text-gray-400 px-1 py-0.5 rounded"
                >
                  max: {{ boost.max }}
                </span>
              </div>
              
              <!-- Tooltip -->
              <div v-if="boost.tooltip && boost.tooltip !== '0'" class="text-[10px] text-gray-400 mb-1">
                {{ boost.tooltip }}
              </div>
              
              <!-- Controls -->
              <div class="flex items-center justify-between">
                <!-- Multiplier Display -->
                <div class="text-[10px] text-gray-400">
                  <span v-if="shouldShowOrbMultiplier(boost)">
                    Orbs: <span class="text-green-400">{{ getMultiplierPreview(boost, 'orb') }}</span>
                  </span>
                  <span v-if="showFragmultiBoosts && boost.fragmulti && getMultiplierPreview(boost, 'frag')">
                    <span v-if="shouldShowOrbMultiplier(boost)"> | </span>
                    Frags: <span class="text-yellow-400">{{ getMultiplierPreview(boost, 'frag') }}</span>
                  </span>
                </div>
                
                <!-- Boolean Type Controls -->
                <div v-if="boost.type === 'boolean'" class="flex">
                  <button 
                    @click="toggleBooleanStat(boost.key)"
                    class="text-xs px-2 py-0.5 rounded"
                    :class="statValues[boost.key] ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-green-800/50 text-white'"
                  >
                    {{ statValues[boost.key] ? 'ON' : 'OFF' }}
                  </button>
                </div>
                
                <!-- Numeric Type Controls -->
                <div v-else class="flex items-center">
                  <TRValueControls
                    :value="statValues[boost.key] || 0"
                    :minValue="0"
                    :maxValue="boost.max || 9999"
                    :showFastControls="true"
                    :step="1"
                    :valueClass="'text-white'"
                    @update:value="(newVal) => updateStatValue(boost.key, newVal, boost)"
                  />
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
import { allBoosts, boostsByCategory, generalStats } from '@/constants/tr-planner';
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

// Eingabefeld für All-Time Orbs
const orbsDisplayValue = ref('');

// Gefilterte Boosts basierend auf showFragmultiBoosts
const filteredBoostsByCategory = computed(() => {
  return boostsByCategory.map(category => {
    // Die Kategorie kopieren
    const newCategory = { ...category };
    
    // Die Boosts filtern
    if (props.showFragmultiBoosts) {
      // Wenn Campaign Fragments aktiviert sind, zeige alle Boosts
      newCategory.boosts = category.boosts;
    } else {
      // Wenn Campaign Fragments deaktiviert sind, zeige nur Boosts mit orbcalc
      newCategory.boosts = category.boosts.filter(boost => boost.orbcalc);
    }
    
    return newCategory;
  }).filter(category => category.boosts.length > 0); // Leere Kategorien entfernen
});

// All-Time Orbs Input Handler
function handleOrbsInput(event) {
  const input = event.target.value;

  // Erlaubt Zahlen, Punkte und bestimmte Buchstaben (k, m, b, t, ...)
  if (/^[0-9]*\.?[0-9]*[kmbtqsdno]?$/i.test(input) || input === '') {
    // Berechne den tatsächlichen numerischen Wert
    const numericValue = parseOrbsInput(input);
    statValues.allTimeOrbs = numericValue;
  } else {
    // Beim nächsten Tick auf den formatierten Wert zurücksetzen
    setTimeout(() => {
      formatOrbsDisplay();
    }, 0);
  }
}

// Konvertiert Eingaben wie "1.5k" oder "3.2b" in den tatsächlichen Zahlenwert
function parseOrbsInput(input) {
  if (!input) return 0;
  
  // Entferne alle Leerzeichen
  input = input.replace(/\s/g, '');
  
  // Wenn es nur eine Nummer ist, konvertiere direkt
  if (/^[0-9]*\.?[0-9]*$/.test(input)) {
    return parseFloat(input) || 0;
  }
  
  // Suffix-Mapping
  const suffixMap = {
    'k': 1e3,
    'm': 1e6,
    'b': 1e9,
    't': 1e12,
    'q': 1e15,
    'qa': 1e15,
    'qu': 1e18,
    's': 1e21,
    'sx': 1e21,
    'sp': 1e24,
    'o': 1e27,
    'oc': 1e27,
    'n': 1e30,
    'd': 1e33
  };
  
  // Suche nach dem Suffix
  const match = input.match(/^([0-9]*\.?[0-9]*)([kmbtqsond]|qa|qu|sx|sp|oc)$/i);
  
  if (match) {
    const numPart = parseFloat(match[1]) || 0;
    const suffix = match[2].toLowerCase();
    
    // Finde den Multiplikator basierend auf dem Suffix
    const multiplier = suffixMap[suffix] || 1;
    
    return numPart * multiplier;
  }
  
  return parseFloat(input) || 0;
}

// Formatiert den Orbs-Wert für die Anzeige
function formatOrbsDisplay() {
  if (statValues.allTimeOrbs) {
    orbsDisplayValue.value = formatNumber(statValues.allTimeOrbs);
  } else {
    orbsDisplayValue.value = '0';
  }
}

// Boosts laden
async function loadBoostData() {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Initialisiere statValues mit Standardwerten
    initializeStatValues();
    
    // Formatiere All-Time Orbs für die Anzeige
    formatOrbsDisplay();
    
    isLoading.value = false;
  } catch (err) {
    console.error('Error loading boost data:', err);
    error.value = `Failed to load boosts: ${err.message}`;
    isLoading.value = false;
  }
}

// Initialisiert die statValues mit Standardwerten
function initializeStatValues() {
  // Initialisiere alle generalStats
  generalStats.forEach(stat => {
    statValues[stat.key] = props.currentStats[stat.key] || 0;
  });
  
  // Für jeden Boost initialisieren wir einen Wert
  allBoosts.forEach(boost => {
    const existingValue = props.currentStats[boost.key];
    
    if (boost.type === 'boolean') {
      statValues[boost.key] = existingValue !== undefined ? !!existingValue : false;
    } else if (boost.type === 'number') {
      statValues[boost.key] = existingValue !== undefined ? existingValue : 0;
    }
  });
}

// Aktualisiere statValues wenn props aktualisiert werden
watch(() => props.currentStats, (newStats) => {
  if (newStats && !isLoading.value) {
    // Aktualisiere nur die Werte, die in newStats vorhanden sind
    Object.keys(newStats).forEach(key => {
      if (key in statValues) {
        statValues[key] = newStats[key];
      }
    });
    
    // Aktualisiere die formatierte Anzeige für All-Time Orbs
    formatOrbsDisplay();
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

// Prüft, ob der Orb-Multiplikator angezeigt werden soll
function shouldShowOrbMultiplier(boost) {
  // Boolean-Boosts: nur anzeigen, wenn aktiviert
  if (boost.type === 'boolean' && !statValues[boost.key]) {
    return false;
  }
  
  // Numerische Boosts: nur anzeigen, wenn Wert > 0
  if (boost.type === 'number' && (!statValues[boost.key] || statValues[boost.key] <= 0)) {
    return false;
  }
  
  // Nur anzeigen, wenn orbcalc aktiviert und ein Multiplikator existiert
  return boost.orbcalc && getMultiplierPreview(boost, 'orb');
}

// Gibt eine formatierte Vorschau des Multiplikators zurück
function getMultiplierPreview(boost, type) {
  if (type === 'orb' && !boost.multiplier) return null;
  if (type === 'frag' && !boost.fragmulti) return null;
  
  let value;
  
  if (type === 'orb') {
    // Multiplikator für Orbs
    if (typeof boost.multiplier === 'function') {
      try {
        const inputValue = statValues[boost.key] || 0;
        value = boost.multiplier(inputValue, statValues);
      } catch (error) {
        console.error(`Error calculating multiplier for ${boost.key}:`, error);
        value = 1;
      }
    } else {
      value = boost.multiplier;
    }
  } else {
    // Multiplikator für Fragments
    if (typeof boost.fragmulti === 'function') {
      try {
        const inputValue = statValues[boost.key] || 0;
        value = boost.fragmulti(inputValue, statValues);
      } catch (error) {
        console.error(`Error calculating fragmulti for ${boost.key}:`, error);
        value = 1;
      }
    } else {
      value = boost.fragmulti;
    }
  }
  
  // Nur Werte != 1 formatieren und zurückgeben
  return formatMultiplier(value);
}

// Reset all stats
function resetAllStats() {
  // Direkt ohne Bestätigung zurücksetzen
  
  // Allgemeine Statistiken zurücksetzen
  generalStats.forEach(stat => {
    statValues[stat.key] = 0;
  });
  
  // Alle Boosts zurücksetzen
  allBoosts.forEach(boost => {
    if (boost.type === 'boolean') {
      statValues[boost.key] = false;
    } else {
      statValues[boost.key] = 0;
    }
  });
  
  // Formatiere All-Time Orbs zurück
  formatOrbsDisplay();
}

// Speichern und schließen
function saveAndClose() {
  // Kopie der statValues erstellen und zurückgeben
  emit('save', {...statValues});
  emit('close');
}

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