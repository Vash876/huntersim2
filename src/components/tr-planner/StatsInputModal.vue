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
            <span class=""> - Maxed Boosts</span>
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
          Mark boosts that you've already maxed out in the game. Maxed boosts will be hidden in other calculator views to reduce clutter.
          <br><span class="text-yellow-300 mt-1 inline-block">Advice: For Void Badges, mark the ones you've completed minus 1.</span>
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
          
          <!-- Grid Layout - 1 Spalte auf Mobil, 2 Spalten auf Desktop -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- Einzelner Boost-Container -->
            <div 
              v-for="(boost, boostIndex) in category.boosts" 
              :key="boost.key"
              class="border border-gray-700 rounded-md hover:bg-gray-700/30"
            >
              <div class="flex justify-between items-center p-2">
                <!-- Linke Seite: Boost-Info -->
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">{{ boost.label }}</div>
                  <div v-if="boost.tooltip && boost.tooltip !== '0'" class="text-[10px] text-gray-400">
                    {{ boost.tooltip }}
                  </div>
                  <div class="text-[11px] text-gray-300 mt-0.5">
                    Max: <span :class="boost.type === 'boolean' ? 'text-green-400' : 'text-blue-400'">
                      {{ boost.type === 'boolean' ? 'ON' : boost.max || '-' }}
                    </span>
                  </div>
                </div>
                
                <!-- Rechte Seite: Toggle -->
                <div>
                  <div 
                    @click="toggleMaxedState(boost.key)"
                    class="inline-block w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors"
                    :class="maxedBoosts[boost.key] ? 'bg-green-600' : 'bg-gray-600'"
                  >
                    <div 
                      class="h-4 w-4 rounded-full bg-white transform transition-transform"
                      :class="maxedBoosts[boost.key] ? 'translate-x-5' : ''"
                    ></div>
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

      <!-- Summary Footer -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-300">
            {{ maxedBoostsCount }} boosts marked as maxed
          </div>
          <div class="flex space-x-2">
            <button 
              @click="markAllAsMaxed" 
              class="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              Mark All
            </button>
            <button 
              @click="saveAndClose"
              class="px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { allBoosts, boostsByCategory } from '@/constants/tr-planner';
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
  }
});

const emit = defineEmits(['close', 'save']);

// State
const isLoading = ref(true);
const error = ref(null);
const maxedBoosts = reactive({});

// Gefilterte Boosts - Alle Boosts mit max Level oder vom Typ Boolean
const filteredBoostsByCategory = computed(() => {
  return boostsByCategory
    .map(category => {
      // Filter: Nur Boosts mit max Level oder Boolean-Typ anzeigen
      const filteredBoosts = category.boosts.filter(boost => 
        // Ausschließen: hoursInTR und loopMods
        boost.key !== 'hoursInTR' && boost.key !== 'loopMods' &&
        // Einschließen: Alle Boolean-Boosts oder numerische Boosts mit max Level
        (boost.type === 'boolean' || (boost.type === 'number' && boost.max !== undefined))
      );
      
      return {
        ...category,
        boosts: filteredBoosts
      };
    })
    .filter(category => category.boosts.length > 0); // Nur Kategorien mit Boosts
});

// Anzahl der maxed Boosts
const maxedBoostsCount = computed(() => {
  return Object.values(maxedBoosts).filter(value => value).length;
});

// Boosts laden
async function loadBoostData() {
  try {
    isLoading.value = true;
    error.value = null;
    
    // Initialisiere maxedBoosts mit Standardwerten
    initializeMaxedState();
    
    isLoading.value = false;
  } catch (err) {
    console.error('Error loading boost data:', err);
    error.value = `Failed to load boosts: ${err.message}`;
    isLoading.value = false;
  }
}

// Initialisieren des maxed-State basierend auf aktuellen Werten
function initializeMaxedState() {
  // Für jeden Boost überprüfen wir, ob er bereits maxed ist
  allBoosts.forEach(boost => {
    if (boost.key !== 'hoursInTR' && boost.key !== 'loopMods') {
      if (boost.type === 'boolean') {
        // Boolean Boosts sind "maxed" wenn sie aktiviert sind
        maxedBoosts[boost.key] = props.currentStats[boost.key] === true;
      } else if (boost.type === 'number' && boost.max !== undefined) {
        // Numerische Boosts mit max-Property sind "maxed" wenn sie das Maximum erreicht haben
        const currentValue = props.currentStats[boost.key] || 0;
        maxedBoosts[boost.key] = currentValue >= boost.max;
      }
    }
  });
}

// Toggle maxed state for a specific boost
function toggleMaxedState(boostKey) {
  // DIREKTE ZUWEISUNG DES GEGENTEILS: WICHTIG FÜR REAKTIVITÄT!
  maxedBoosts[boostKey] = !maxedBoosts[boostKey];
}

// Mark all boosts as maxed
function markAllAsMaxed() {
  // Für alle angezeigten Boosts den maxed-Status auf true setzen
  filteredBoostsByCategory.value.forEach(category => {
    category.boosts.forEach(boost => {
      maxedBoosts[boost.key] = true;
    });
  });
}

// Reset all stats to not maxed
function resetAllStats() {
  // Alle Boosts auf nicht-maxed zurücksetzen
  Object.keys(maxedBoosts).forEach(key => {
    maxedBoosts[key] = false;
  });
}

// Speichern und schließen
function saveAndClose() {
  // Wir erstellen ein neues Objekt basierend auf currentStats
  const updatedStats = { ...props.currentStats };
  
  // Für jeden Boost, der als maxed markiert ist, setzen wir den entsprechenden Wert
  Object.keys(maxedBoosts).forEach(key => {
    const boost = allBoosts.find(b => b.key === key);
    
    if (!boost) return;
    
    if (maxedBoosts[key]) {
      // Wenn der Boost als maxed markiert ist, setzen wir ihn auf den Max-Wert
      if (boost.type === 'boolean') {
        updatedStats[key] = true;
      } else if (boost.type === 'number' && boost.max !== undefined) {
        updatedStats[key] = boost.max;
      }
    } else {
      // Wenn der Boost nicht als maxed markiert ist, setzen wir ihn auf 0 oder false
      if (boost.type === 'boolean') {
        updatedStats[key] = false;
      } else if (boost.type === 'number') {
        // Wenn der Boost früher maxed war, setzen wir ihn zurück auf 0
        const currentValue = props.currentStats[key] || 0;
        if (boost.max !== undefined && currentValue >= boost.max) {
          updatedStats[key] = 0;
        }
      }
    }
  });
  
  // Speichere im localStorage für direkte Verwendung in anderen Modals
  try {
    localStorage.setItem('trplanner_userstats', JSON.stringify(updatedStats));
  } catch (e) {
    console.error("Error saving stats to localStorage:", e);
  }
  
  emit('save', updatedStats);
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
