<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/UltimaView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-3xl font-bold mb-8 text-center text-white">Ultima Hunter Boost</h2>
      
      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center p-12">
        <div class="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <!-- Custom Card instead of UpgradeCard -->
      <div 
        v-else
        class="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg"
      >
        <div class="px-4 py-3">
          <UpgradeHeader 
            :name="ultimaItems[0]?.name || 'Ultima Hunter Loot Rewards Boost'"
            :level="multiplierValue"
            :max-level=Infinity
            color="purple"
            :display-as-multiplier="true"
          />
        </div>
        
        <div class="p-6">
          <div class="bg-gray-900/60 p-4 rounded-md w-full">

            
            <!-- Wert-Anzeige -->
            <div class="flex flex-col items-center mb-3">
              <span class="text-purple-400 text-lg font-bold mb-2">
                Current Multiplier
              </span>
              <div class="flex items-center gap-x-2">
                <input
                  type="number"
                  v-model="formattedMultiplierValue"
                  disabled
                  step="0.0001"
                  min="1"
                  max="10"
                  class="disabled bg-gray-800 border border-gray-700 text-white py-2 px-3 rounded w-32 text-center font-mono text-lg"
                />
                <span class="text-purple-300 font-bold text-xl">×</span>
              </div>
            </div>
            
            <!-- Button Controls -->
            <div class="flex justify-center gap-x-3 mb-4">
              <button 
                @click="decrementFast()"
                class="flex justify-center items-center p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                :disabled="multiplierValue <= 1.0001"
                :class="{ 'opacity-20 cursor-not-allowed hover:bg-gray-900': multiplierValue <= 1.0001 }"
              >
                <div class="flex">
                  <IconChevronLeft size="18" />
                  <IconChevronLeft size="18" class="-ml-2" />
                </div>
              </button>
              <button 
                @click="decrement()"
                class="flex justify-center items-center p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors ml-1"
                :disabled="multiplierValue <= 1.0001"
                :class="{ 'opacity-20 cursor-not-allowed hover:bg-gray-900': multiplierValue <= 1.0001 }"
              >
                <IconChevronLeft size="18" />
              </button>
              <button 
                @click="increment()"
                class="flex justify-center items-center p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors mr-1"
                :disabled="multiplierValue >= 9.9999"
                :class="{ 'opacity-20 cursor-not-allowed hover:bg-gray-900': multiplierValue >= 9.9999 }"
              >
                <IconChevronRight size="18" />
              </button>
              <button 
                @click="incrementFast()"
                class="flex justify-center items-center p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                :disabled="multiplierValue >= 9.9990"
                :class="{ 'opacity-20 cursor-not-allowed hover:bg-gray-900': multiplierValue >= 9.9990 }"
              >
                <div class="flex">
                  <IconChevronRight size="18" />
                  <IconChevronRight size="18" class="-ml-2" />
                </div>
              </button>
            </div>        
            <!-- Slider für gröbere Anpassungen -->
            <div class="mt-4">
              <input 
                type="range" 
                v-model.number="multiplierValue" 
                min="1" 
                max="10" 
                step="0.0001"
                class="w-full appearance-none bg-gray-700 h-5 rounded-full outline-none cursor-pointer"
                @change="updateUltimaValue"
              >
              <div class="flex justify-between text-xs text-gray-400 mt-1">
                <span>1.0×</span>
                <span>2.5×</span>
                <span>4.0×</span>
                <span>5.5×</span>
                <span>7.0×</span>
                <span>8.5×</span>
                <span>10.0×</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { getUpgrades } from '@/utils/upgradeUtils';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
import UpgradeHeader from '@/components/upgrades/UpgradeHeader.vue';

// Store für Upgrades
const hunterStore = useHunterStore();

// Ultima Items aus den Konstanten laden
const ultimaItems = ref([]);
const loading = ref(true);
const category = 'ultima';

// Der aktuelle Multiplikator-Wert
const multiplierValue = ref(1.0000);

// Formatierter Wert mit 4 Nachkommastellen
const formattedMultiplierValue = computed({
  get: () => multiplierValue.value.toFixed(4),
  set: (val) => {
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      multiplierValue.value = parsed;
      updateUltimaValue();
    }
  }
});

// Präzisions-Presets für schnellen Zugriff
const presets = [
  { label: 'New: 1.0000×', value: 1.0000 },
  { label: 'Average: 1.7493×', value: 1.7493 },
  { label: 'Good: 2.5000×', value: 2.5000 },
  { label: 'Top: 3.1235×', value: 3.1235 },
  { label: 'Elite: 4.0000×', value: 4.0000 }
];

// Beim Mounten die Ultima-Items laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Ultima-Items laden
    ultimaItems.value = getUpgrades(category);
    
    // Initialwert aus dem Store holen (wenn vorhanden)
    if (ultimaItems.value.length > 0) {
      const storedValue = getUltimaValue({ id: ultimaItems.value[0].id });
      multiplierValue.value = parseFloat(storedValue) || 1.0000;
    }
  } catch (error) {
    console.error(`Error loading ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Ultima-Wert aus dem Store holen
function getUltimaValue(item) {
  const value = hunterStore.getUpgradeValue(category, item.id);
  return value === 0 ? 1 : value; // Default-Wert ist 1, wenn nicht gesetzt
}

// Ultima-Wert im Store aktualisieren
function updateUltimaValue() {
  // Sicherstellen, dass der Wert im gültigen Bereich liegt
  const value = Math.max(1, Math.min(10, multiplierValue.value));
  
  // Auf 4 Nachkommastellen runden
  const roundedValue = parseFloat(value.toFixed(4));
  multiplierValue.value = roundedValue;
  
  // Im Store aktualisieren
  if (ultimaItems.value.length > 0) {
    hunterStore.updateUpgrade(category, ultimaItems.value[0].id, roundedValue);
  }
}

// Preset-Wert setzen
function setPresetValue(value) {
  multiplierValue.value = value;
  updateUltimaValue();
}

// Funktionen für die Button-Controls
function increment() {
  multiplierValue.value = parseFloat((multiplierValue.value + 0.0001).toFixed(4));
  updateUltimaValue();
}

function decrement() {
  multiplierValue.value = parseFloat((multiplierValue.value - 0.0001).toFixed(4));
  updateUltimaValue();
}

function incrementFast() {
  multiplierValue.value = parseFloat((multiplierValue.value + 0.0010).toFixed(4));
  updateUltimaValue();
}

function decrementFast() {
  multiplierValue.value = parseFloat((multiplierValue.value - 0.0010).toFixed(4));
  updateUltimaValue();
}
</script>

<style scoped>
/* Custom Styling für den Slider */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: #9333ea;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #9333ea;
  border-radius: 50%;
  cursor: pointer;
}

/* Styling für Zahlenfeld - verstecke Pfeile */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>