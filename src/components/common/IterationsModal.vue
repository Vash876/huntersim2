<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="saveAndClose"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconAdjustmentsHorizontal size="20" class="mr-2 text-blue-400" />
          Iteration Settings
        </h2>
        <button 
          @click="saveAndClose"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal-Inhalt -->
      <div class="p-5">
        <p class="text-sm text-gray-300 mb-4">
          Higher iterations give more accurate results but take longer to compute.
        </p>
        
        <div class="mb-6">
          <div class="flex justify-between text-xs text-gray-400 mb-1">
            <span>250</span>
            <span>4000</span>
          </div>
          <input 
            type="range"
            min="250"
            max="4000"
            step="250"
            v-model.number="localIterationValue"
            class="w-full accent-blue-500"
          />
          <div class="text-center mt-2 bg-gray-700 py-1.5 px-2 rounded-md">
            <span class="text-blue-400 font-medium">{{ localIterationValue }}</span> iterations
          </div>
        </div>

        <!-- Apply to all hunters checkbox -->
        <div class="flex items-center mb-2 p-3 bg-gray-700/50 rounded-lg">
          <input 
            type="checkbox" 
            id="apply-all" 
            v-model="applyToAllHunters"
            class="w-4 h-4 rounded bg-gray-700 border-gray-600 accent-blue-500"
          />
          <label for="apply-all" class="ml-2 text-sm text-gray-300">
            Apply to all hunters
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-vue';
import { getHunterById, HUNTERS } from '../../constants/hunters';
import { useHunterStore } from '../../store/hunterStore';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  hunterType: {
    type: String,
    required: true,
    validator: (value) => HUNTERS.some(hunter => hunter.id === value)
  },
  currentIterations: {
    type: Number,
    default: 1000
  }
});

const emit = defineEmits(['close', 'update:iterations']);

// Zentraler Hunter-Store
const hunterStore = useHunterStore();

// Hunter-Information
const hunterInfo = computed(() => getHunterById(props.hunterType));
const hunterName = computed(() => hunterInfo.value.name);
const hunterColor = computed(() => hunterInfo.value.color);

// Lokale Werte
const localIterationValue = ref(props.currentIterations);
const applyToAllHunters = ref(false);

// Presets für Iterations-Werte
function setIterationValue(value) {
  localIterationValue.value = value;
}

// Speichern und Modal schließen
function saveAndClose() {
  if (applyToAllHunters.value) {
    // Auf alle Hunter anwenden
    HUNTERS.forEach(hunter => {
      hunterStore.updateIterations(hunter.id, localIterationValue.value);
    });
  } else {
    // Nur auf aktuellen Hunter anwenden
    hunterStore.updateIterations(props.hunterType, localIterationValue.value);
  }
  
  // Event emittieren, um den Wert im Parent zu aktualisieren
  emit('update:iterations', localIterationValue.value);
  emit('close');
}

// Initialisierung - aktuellen Wert laden, wenn Modal geöffnet wird
watch(() => props.isVisible, async (newValue) => {
  if (newValue) {
    // Sicherstellen, dass der Hunter im Store initialisiert ist
    await hunterStore.initHunterConfig(props.hunterType);
    
    // Versuche den gespeicherten Wert zu lesen
    const storedValue = hunterStore.getIterations(props.hunterType);
    
    if (storedValue !== undefined) {
      localIterationValue.value = storedValue;
    } else {
      // Fallback auf den übergebenen Wert oder Default
      localIterationValue.value = props.currentIterations || 1000;
    }
  }
});

// Bei Wechsel des Hunter-Typs den aktuellen Wert aktualisieren
watch(() => props.hunterType, async (newValue) => {
  if (props.isVisible && newValue) {
    // Sicherstellen, dass der Hunter im Store initialisiert ist
    await hunterStore.initHunterConfig(newValue);
    
    const storedValue = hunterStore.getIterations(newValue);
    if (storedValue !== undefined) {
      localIterationValue.value = storedValue;
    }
  }
});
</script>

<style scoped>
/* Zusätzliche Styles für das Modal */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: #4B5563; /* bg-gray-600 */
  border-radius: 3px;
  cursor: pointer;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #3B82F6; /* bg-blue-500 */
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #3B82F6; /* bg-blue-500 */
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

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