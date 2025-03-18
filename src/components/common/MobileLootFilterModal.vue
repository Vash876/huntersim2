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
          <IconFilter size="20" class="mr-2 text-blue-400" />
          Loot Filter
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
          Choose which materials should be displayed in the build cards.
        </p>

        <!-- Material 1 -->
        <div class="mb-3 flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <label class="text-gray-200 flex items-center gap-2">
            <IconDiamond size="16" class="text-red-300" />
            <span>{{ materialLabels[0] || 'Material 1' }}</span>
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localFilters.mat1" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
        
        <!-- Material 2 -->
        <div class="mb-3 flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <label class="text-gray-200 flex items-center gap-2">
            <IconHexagon size="16" class="text-orange-300" />
            <span>{{ materialLabels[1] || 'Material 2' }}</span>
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localFilters.mat2" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
        
        <!-- Material 3 -->
        <div class="mb-3 flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <label class="text-gray-200 flex items-center gap-2">
            <IconHexagons size="16" class="text-amber-300" />
            <span>{{ materialLabels[2] || 'Material 3' }}</span>
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localFilters.mat3" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
        
        <!-- XP -->
        <div class="mb-3 flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <label class="text-gray-200 flex items-center gap-2">
            <IconBrightness size="16" class="text-blue-300" />
            <span>XP</span>
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localFilters.xp" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  IconX, IconFilter, IconCheck, IconBrightness, 
  IconDiamond, IconHexagon, IconHexagons
} from '@tabler/icons-vue';
import { getHunterById } from '../../constants/hunters';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  filters: {
    type: Object,
    default: () => ({
      mat1: true,
      mat2: true,
      mat3: true,
      xp: true
    })
  },
  hunterId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'update:filters']);

// Lokale Kopie der Filter für die Bearbeitung
const localFilters = ref({...props.filters});

// Aktualisiere lokale Filter, wenn sich die Props ändern
watch(() => props.filters, (newFilters) => {
  localFilters.value = {...newFilters};
}, { deep: true });

// Refs für die Materialnamen
const materialLabels = ref(['Material 1', 'Material 2', 'Material 3']);

// Funktion zum Laden der Materialnamen
async function loadMaterialLabels() {
  try {
    // Hunter-Modul laden
    const hunter = getHunterById(props.hunterId);
    if (!hunter) return;
    
    const module = await hunter.statsModule();
    
    // Abhängig vom Hunter-Typ die richtigen Materialien definieren
    if (props.hunterId === 'borge') {
      materialLabels.value = ['Obsidian', 'Behlium', 'Hellish-Biomatter'];
    } else if (props.hunterId === 'ozzy') {
      materialLabels.value = ['Farahite Ore', 'Galvarium', 'Vectid Crystals'];
    } else if (props.hunterId === 'knox') {
      materialLabels.value = ['Glacium', 'Aquarius Quartz', 'Tessarects'];
    }
  } catch (error) {
    console.error("Failed to load material labels:", error);
  }
}

// Lade die Materialnamen bei Initialisierung und Änderung des Hunters
watch(() => props.hunterId, () => {
  loadMaterialLabels();
}, { immediate: true });

// Lade Labels beim Montieren
onMounted(() => {
  loadMaterialLabels();
});

// Speichern und Modal schließen
function saveAndClose() {
  emit('update:filters', {...localFilters.value});
  emit('close');
}

// Initialisierung
onMounted(() => {
  if (props.filters) {
    localFilters.value = {...props.filters};
  }
});
</script>

<style scoped>
/* Zusätzliche Styles für das Modal */
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

/* Styling für den Toggle-Schalter */
input[type="checkbox"]:checked + div {
  background-color: #3B82F6;
}
</style>