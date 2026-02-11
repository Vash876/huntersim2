<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/UltimaView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">Ultima Hunter Boost</h2>

      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center p-12">
        <div class="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <!-- Custom Card im neuen Stil -->
      <div 
        v-else
        class="relative rounded-xl overflow-hidden border border-gray-600/30 bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 backdrop-blur-sm max-w-2xl mx-auto"
      >
        <!-- Farbiger Top-Akzent-Streifen -->
        <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>

        <!-- Subtiler Gradient-Overlay -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-br from-white via-transparent to-transparent"></div>

        <div class="relative px-4 py-3">
          <UpgradeHeader 
            :name="ultimaItems[0]?.name || 'Ultima Hunter Loot Rewards Boost'"
            :level="multiplierValue"
            :max-level=Infinity
            color="gray"
            :display-as-multiplier="true"
          />
        </div>
        
        <div class="relative p-6 pt-2">
          <div class="bg-gray-900/50 p-4 rounded-lg w-full">
            
            <!-- Wert-Anzeige -->
            <div class="flex flex-col items-center mb-3">
              <span class="text-gray-400 text-sm font-semibold mb-2 tracking-wide uppercase">
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
                  class="disabled bg-gray-800/80 border border-gray-600/20 text-white py-2 px-3 rounded-lg w-32 text-center font-mono text-lg"
                />
                <span class="text-gray-300 font-bold text-xl">×</span>
              </div>
            </div>
            
            <!-- Button Controls -->
            <div class="flex justify-center gap-x-2 mb-4">
              <button 
                @click="decrementFast()"
                class="ultima-ctrl-btn"
                :disabled="multiplierValue <= 1.0001"
                :class="{ 'ultima-ctrl-btn--disabled': multiplierValue <= 1.0001 }"
              >
                <div class="flex">
                  <IconChevronLeft size="16" />
                  <IconChevronLeft size="16" class="-ml-2.5" />
                </div>
              </button>
              <button 
                @click="decrement()"
                class="ultima-ctrl-btn"
                :disabled="multiplierValue <= 1.0001"
                :class="{ 'ultima-ctrl-btn--disabled': multiplierValue <= 1.0001 }"
              >
                <IconChevronLeft size="16" />
              </button>
              <button 
                @click="increment()"
                class="ultima-ctrl-btn"
                :disabled="multiplierValue >= 9.9999"
                :class="{ 'ultima-ctrl-btn--disabled': multiplierValue >= 9.9999 }"
              >
                <IconChevronRight size="16" />
              </button>
              <button 
                @click="incrementFast()"
                class="ultima-ctrl-btn"
                :disabled="multiplierValue >= 9.9990"
                :class="{ 'ultima-ctrl-btn--disabled': multiplierValue >= 9.9990 }"
              >
                <div class="flex">
                  <IconChevronRight size="16" />
                  <IconChevronRight size="16" class="-ml-2.5" />
                </div>
              </button>
            </div>        
            <!-- Slider -->
            <div class="mt-4">
              <input 
                type="range" 
                v-model.number="multiplierValue" 
                min="1" 
                max="3.4476" 
                step="0.0001"
                class="w-full appearance-none bg-gray-700/60 h-5 rounded-full outline-none cursor-pointer"
                @change="updateUltimaValue"
              >
              <div class="relative mt-1 h-4">
                <span class="absolute left-0 text-xs text-gray-500">1.0×</span>
                <span class="absolute left-[21%] transform -translate-x-1/2 text-xs text-gray-500">1.5×</span>
                <span class="absolute left-[41%] transform -translate-x-1/2 text-xs text-gray-500">2×</span>
                <span class="absolute left-[61.5%] transform -translate-x-1/2 text-xs text-gray-500">2.5×</span>
                <span class="absolute left-[81.6%] transform -translate-x-1/2 text-xs text-gray-500">3.0×</span>
                <span class="absolute right-0 text-xs text-gray-500">3.4476×</span>
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
/* Buttons im neuen Stil */
.ultima-ctrl-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4rem 0.5rem;
  min-width: 2.2rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  color: rgba(209, 213, 219, 0.8);
}

.ultima-ctrl-btn:hover:not(.ultima-ctrl-btn--disabled) {
  background: rgba(88, 28, 135, 0.5);
  border-color: rgba(168, 85, 247, 0.3);
  color: rgb(196, 181, 253);
  transform: scale(1.05);
}

.ultima-ctrl-btn:active:not(.ultima-ctrl-btn--disabled) {
  transform: scale(0.95);
}

.ultima-ctrl-btn--disabled {
  opacity: 0.15;
  cursor: not-allowed;
  pointer-events: none;
}

/* Custom Styling für den Slider */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: #9333ea;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(147, 51, 234, 0.4);
}

input[type="range"]::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #9333ea;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 6px rgba(147, 51, 234, 0.4);
}

/* Styling für Zahlenfeld - verstecke Pfeile */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>