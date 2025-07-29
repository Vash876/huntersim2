<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="handleClose"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fade-in"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div :class="`bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center sticky top-0 z-10`">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconChartArrowsVertical size="20" :class="`mr-2 text-${hunterColor}-400`" />
          <span :class="`text-${hunterColor}-500`">{{ hunterName }}</span><span class="ml-1">Stats</span> 
        </h2>
        <button 
          @click="handleClose"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Stats-Form Inhalt -->
      <div class="p-4">
        <!-- Stats Grid - kompakteres Design für Modal -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
          <div
            v-for="stat in filteredStats"
            :key="stat.key"
            class="bg-gray-700 rounded-lg p-2.5 border border-gray-600 hover:border-gray-500 transition-colors shadow-md"
          >
            <!-- Stat Header -->
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-white">
                {{ stat.label }}
              </span>
              <div class="flex items-center">
                <span :class="`text-base font-bold text-${hunterColor}-400`">
                  {{ stats[stat.key] }}
                </span>
                <span v-if="stat.max !== Infinity" 
                      class="text-xs text-gray-500 ml-1">
                  /{{ stat.max }}
                </span>
              </div>
            </div>

            <!-- Controls -->
            <div class="flex items-center justify-between mt-2">
              <!-- Fast Decrease (-10) -->
              <ControlButton 
                direction="left"
                :isFast="true"
                :item="getStatItemForControl(stat)"
                :getLevel="getStatLevelAsFunction"
                :handleStart="handleStart"
                :handleEnd="handleEnd"
                :handleTouchMove="handleTouchMove"
                :increment="increment"
                :decrement="decrement"
                :incrementFast="incrementFast"
                :decrementFast="decrementFast"
              />

              <!-- Normal Decrease (-1) -->
              <ControlButton 
                direction="left"
                :isFast="false"
                :item="getStatItemForControl(stat)"
                :getLevel="getStatLevelAsFunction"
                :handleStart="handleStart"
                :handleEnd="handleEnd"
                :handleTouchMove="handleTouchMove"
                :increment="increment"
                :decrement="decrement"
                :incrementFast="incrementFast"
                :decrementFast="decrementFast"
              />

              <!-- Progress Bar -->
              <ProgressBar 
                :value="stats[stat.key] || 0"
                :maxValue="stat.max === Infinity ? 1000 : stat.max"
                :color="hunterColor"
                class="flex-1 mx-1.5 h-5"
              />

              <!-- Normal Increase (+1) -->
              <ControlButton 
                direction="right"
                :isFast="false"
                :item="getStatItemForControl(stat)"
                :getLevel="getStatLevelAsFunction"
                :handleStart="handleStart"
                :handleEnd="handleEnd"
                :handleTouchMove="handleTouchMove"
                :increment="increment"
                :decrement="decrement"
                :incrementFast="incrementFast"
                :decrementFast="decrementFast"
              />

              <!-- Fast Increase (+10) -->
              <ControlButton 
                direction="right"
                :isFast="true"
                :item="getStatItemForControl(stat)"
                :getLevel="getStatLevelAsFunction"
                :handleStart="handleStart"
                :handleEnd="handleEnd"
                :handleTouchMove="handleTouchMove"
                :increment="increment"
                :decrement="decrement"
                :incrementFast="incrementFast"
                :decrementFast="decrementFast"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import ProgressBar from './ProgressBar.vue';
import ControlButton from './ControlButton.vue';
import { useButtonControls } from '../../utils/useButtonControls';
import { IconX, IconChartArrowsVertical } from '@tabler/icons-vue';
import { getHunterById, HUNTERS } from '../../constants/hunters';
import { useHunterStore } from '../../store/hunterStore';

// defineProps muss direkt importiert werden ohne lokale Variablen zu referenzieren
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  hunterType: {
    type: String,
    required: true,
    // Keine Referenz auf lokale Variablen, direkt HUNTERS verwenden
    validator: (value) => HUNTERS.some(hunter => hunter.id === value)
  },
});

const emit = defineEmits(['close', 'evaluateAll']);

// Zentraler Hunter-Store
const hunterStore = useHunterStore();

// Hunter-Information aus zentraler Konfiguration abrufen
const hunterInfo = computed(() => getHunterById(props.hunterType));
const hunterName = computed(() => hunterInfo.value.name);
const hunterColor = computed(() => hunterInfo.value.color);

// Statistikdaten
const hunterStats = ref([]);
const stats = computed(() => hunterStore.getStats(props.hunterType));
const initialStats = ref({});

// Lädt die Hunter-spezifischen Daten
async function loadHunterData() {
  try {
    // Stats-Modul laden
    const statsModule = await hunterInfo.value.statsModule();
    hunterStats.value = statsModule.STATS || [];
    
    // Sicherstellen, dass der Hunter im Store initialisiert ist
    await hunterStore.initHunterStats(props.hunterType);
    
    // Ursprüngliche Werte für Vergleich speichern
    resetInitialStats();
  } catch (error) {
    console.error(`Fehler beim Laden der Daten für ${hunterName.value}:`, error);
  }
}

// Gefilterte Stats für die Anzeige
const filteredStats = computed(() => hunterStats.value.filter(stat => stat.key));

// Speichert die aktuellen Stat-Werte als Initialwerte
function resetInitialStats() {
  initialStats.value = hunterStore.cloneStats(props.hunterType);
}

// Prüft, ob sich die Stats verändert haben
function statsHaveChanged() {
  const currentStats = hunterStore.getStats(props.hunterType);
  
  for (const key in currentStats) {
    if (currentStats[key] !== initialStats.value[key]) {
      return true;
    }
  }
  return false;
}

// Schließen-Handler mit Überprüfung auf Änderungen
function handleClose() {
  if (statsHaveChanged()) {
    console.log(`Stats für ${hunterName.value} wurden geändert, starte Neuevaluierung...`);
    emit('evaluateAll');
    
    // Custom Event auslösen, damit die BuildResultCard weiß, 
    // dass das Modal geschlossen wurde und die Stats geändert wurden
    window.dispatchEvent(
      new CustomEvent('statsModalClosed', {
        detail: { 
          hunterType: props.hunterType,
          timestamp: Date.now() // Zum Debugging
        },
        bubbles: true
      })
    );
    console.log('statsModalClosed event dispatched', props.hunterType);
  }
  emit('close');
}

// Item-Objekt für ControlButton mit ID und maxLevel
function getStatItemForControl(stat) {
  return {
    id: stat.key,
    maxLevel: stat.max || Infinity
  }
}

// Funktion für useButtonControls - holt den aktuellen Wert
function getStatLevelAsFunction(item) {
  return hunterStore.getStats(props.hunterType)[item.id] || 0;
}

// Update-Funktion für die Stats
function updateStatValue(statKey, newValue) {
  const statConfig = hunterStats.value.find(s => s.key === statKey);
  if (!statConfig) return;
  
  const max = statConfig.max ?? Infinity;
  const value = Math.min(Math.max(0, newValue), max);
  
  hunterStore.updateStat(props.hunterType, statKey, value);
}

// useButtonControls initialisieren
const {
  handleStart,
  handleEnd,
  handleTouchMove,
  increment,
  decrement,
  incrementFast,
  decrementFast
} = useButtonControls({
  getLevel: getStatLevelAsFunction,
  updateLevel: (item, newLevel) => {
    updateStatValue(item.id, newLevel);
  }
});

// Beobachter für Änderungen der Sichtbarkeit und des Hunter-Typs
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadHunterData();
  }
});

watch(() => props.hunterType, () => {
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
</style>