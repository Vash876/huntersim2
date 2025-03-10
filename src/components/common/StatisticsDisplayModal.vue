<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/common/StatisticsDisplayModal.vue -->
<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconChartDonut size="20" class="mr-2 text-purple-400" />
          Display Settings
        </h2>
        <button 
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>
      
      <!-- Modal-Inhalt -->
      <div class="p-5">
        <!-- Ansichtsoptionen -->
        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-300 mb-2">Build Card View</h4>
          <div class="flex gap-2 bg-gray-700/50 p-1 rounded-lg">
            <button
              @click="setDisplayMode('detailed')"
              class="flex-1 py-2 px-3 rounded transition-colors text-center text-sm flex items-center justify-center"
              :class="displayMode === 'detailed' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'"
            >
              <IconLayoutCards size="16" class="mr-2" />
              Detailed
            </button>
            <button
              @click="setDisplayMode('compact')"
              class="flex-1 py-2 px-3 rounded transition-colors text-center text-sm flex items-center justify-center"
              :class="displayMode === 'compact' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'"
            >
              <IconLayoutList size="16" class="mr-2" />
              Compact
            </button>
          </div>
          
          <p class="text-xs text-gray-400 mt-2">
            Choose how build cards are displayed in the list.
          </p>
        </div>
        
        <!-- Statistikauswahl -->
        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-300 mb-2">Displayed Statistics</h4>
          <div class="bg-gray-700/50 p-3 rounded-lg space-y-2">
            <div v-for="(stat, index) in availableStats" :key="index" class="flex items-center">
              <input
                :id="`stat-${index}`"
                type="checkbox"
                :checked="enabledStats.includes(stat.key)"
                @change="toggleStat(stat.key)"
                class="w-4 h-4 rounded bg-gray-700 border-gray-600 accent-blue-500"
              />
              <label :for="`stat-${index}`" class="ml-2 text-sm text-gray-300">{{ stat.label }}</label>
            </div>
          </div>
          
          <div class="mt-2">
            <div class="text-xs text-gray-400 flex items-center">
              <IconInfoCircle size="14" class="mr-1" />
              Applies to compact view only
            </div>
          </div>
        </div>
        
        <!-- Chart Darstellung -->
        <div class="mb-5">
          <h4 class="text-sm font-semibold text-gray-300 mb-2">Chart Display</h4>
          <div class="flex gap-2 bg-gray-700/50 p-1 rounded-lg">
            <button
              @click="setChartStyle('bar')"
              class="flex-1 py-2 px-3 rounded transition-colors text-center text-sm flex items-center justify-center"
              :class="chartStyle === 'bar' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'"
            >
              <IconChartBar size="16" class="mr-2" />
              Bar Chart
            </button>
            <button
              @click="setChartStyle('line')"
              class="flex-1 py-2 px-3 rounded transition-colors text-center text-sm flex items-center justify-center"
              :class="chartStyle === 'line' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'"
            >
              <IconChartLine size="16" class="mr-2" />
              Line Chart
            </button>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-between mt-6">
          <button 
            @click="resetToDefaults"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center"
          >
            <IconRefresh size="16" class="mr-2" />
            Reset
          </button>
          <div class="flex gap-2">
            <button 
              @click="closeModal"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="saveSettings"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { 
  IconChartDonut, 
  IconChartBar, 
  IconChartLine, 
  IconRefresh,
  IconLayoutCards,
  IconLayoutList,
  IconInfoCircle,
  IconX
} from '@tabler/icons-vue';
import { useHunterStore } from '@/store/hunterStore';

const props = defineProps({
  isVisible: Boolean,
  hunterType: String
});

const emit = defineEmits(['close', 'update:displaySettings']);

const hunterStore = useHunterStore();

// Verfügbare Statistiken
const availableStats = [
  { key: 'lootPerMin', label: 'Loot per Minute' },
  { key: 'avgStage', label: 'Average Stage' },
  { key: 'avgTime', label: 'Average Run Time' },
  { key: 'stageDistribution', label: 'Stage Distribution' },
  { key: 'resourcesPerMin', label: 'Resources per Minute' },
  { key: 'bossStats', label: 'Boss Stats (HP %, Kill Rate)' }
];

// State für die Einstellungen
const displayMode = ref('detailed'); // 'detailed' oder 'compact'
const enabledStats = ref(['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution']);
const chartStyle = ref('bar'); // 'bar' oder 'line'

// Bei Öffnen des Modals Einstellungen laden
watch(() => props.isVisible, (isVisible) => {
  if (isVisible) {
    loadCurrentSettings();
  }
}, { immediate: true });

// Lade aktuelle Einstellungen
function loadCurrentSettings() {
  // Lade die gespeicherten Einstellungen aus dem Store
  const settings = hunterStore.getDisplaySettings(props.hunterType) || {};
  
  displayMode.value = settings.displayMode || 'detailed';
  enabledStats.value = settings.enabledStats || ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'];
  chartStyle.value = settings.chartStyle || 'bar';
}

// Funktionen zum Aktualisieren der Einstellungen
function setDisplayMode(mode) {
  displayMode.value = mode;
}

function toggleStat(statKey) {
  const index = enabledStats.value.indexOf(statKey);
  if (index === -1) {
    enabledStats.value.push(statKey);
  } else {
    enabledStats.value.splice(index, 1);
  }
}

function setChartStyle(style) {
  chartStyle.value = style;
}

// Zurücksetzen auf Standardwerte
function resetToDefaults() {
  displayMode.value = 'detailed';
  enabledStats.value = ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'];
  chartStyle.value = 'bar';
}

// Speichern und Schließen
function saveSettings() {
  const settings = {
    displayMode: displayMode.value,
    enabledStats: enabledStats.value,
    chartStyle: chartStyle.value
  };
  
  // Speichere Einstellungen im Store
  hunterStore.saveDisplaySettings(props.hunterType, settings);
  
  // Informiere den Parent über die Änderungen
  emit('update:displaySettings', settings);
  
  // Schließe das Modal
  closeModal();
}

// Modal schließen
function closeModal() {
  emit('close');
}
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

input[type="checkbox"] {
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #3B82F6;
  border-color: #3B82F6;
}
</style>