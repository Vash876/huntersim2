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
          <IconFilter 
            size="20" 
            class="mr-2"
            :class="hunterColor === 'red' ? 'text-red-400' : hunterColor === 'green' ? 'text-green-400' : 'text-blue-400'"
          />
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
          Choose which loot should be displayed in the build cards.
        </p>

        <!-- Material 1 -->
        <div class="mb-3 flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <label class="text-gray-200 flex items-center gap-2">
            <img 
              v-if="hasIcon('mat1')" 
              :src="icons.mat1" 
              alt="Material 1" 
              class="w-5 h-5"
            />
            <IconDiamond v-else size="16" class="text-red-300" />
            <span>{{ materialLabels[0] || 'Material 1' }}</span>
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localFilters.mat1" class="sr-only peer">
            <div :class="['w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[\'\'] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all', toggleActiveClass]"></div>
          </label>
        </div>
        
        <!-- Material 2 -->
        <div class="mb-3 flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <label class="text-gray-200 flex items-center gap-2">
            <img 
              v-if="hasIcon('mat2')" 
              :src="icons.mat2" 
              alt="Material 2" 
              class="w-5 h-5"
            />
            <IconHexagon v-else size="16" class="text-orange-300" />
            <span>{{ materialLabels[1] || 'Material 2' }}</span>
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localFilters.mat2" class="sr-only peer">
            <div :class="['w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[\'\'] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all', toggleActiveClass]"></div>
          </label>
        </div>
        
        <!-- Material 3 -->
        <div class="mb-3 flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <label class="text-gray-200 flex items-center gap-2">
            <img 
              v-if="hasIcon('mat3')" 
              :src="icons.mat3" 
              alt="Material 3" 
              class="w-5 h-5"
            />
            <IconHexagons v-else size="16" class="text-amber-300" />
            <span>{{ materialLabels[2] || 'Material 3' }}</span>
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localFilters.mat3" class="sr-only peer">
            <div :class="['w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[\'\'] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all', toggleActiveClass]"></div>
          </label>
        </div>
        
        <!-- XP -->
        <div class="mb-3 flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
          <label class="text-gray-200 flex items-center gap-2">
            <img 
              v-if="hasIcon('xp')" 
              :src="icons.xp" 
              alt="XP" 
              class="w-5 h-5"
            />
            <IconBrightness v-else size="16" class="text-blue-300" />
            <span>XP</span>
          </label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="localFilters.xp" class="sr-only peer">
            <div :class="['w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[\'\'] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all', toggleActiveClass]"></div>
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
import { useLootIcons } from '@/composables/useLootIcons';

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
  },
  hunterColor: {
    type: String,
    default: 'blue'
  }
});

const emit = defineEmits(['close', 'update:filters']);

// Loot-Icons für den aktuellen Hunter laden - reaktiv mit toRef
const hunterId = computed(() => props.hunterId);
const { icons, hasIcon } = useLootIcons(hunterId);

// Computed für Toggle-Farbe basierend auf Hunter
const toggleActiveClass = computed(() => {
  if (props.hunterColor === 'red') {
    return 'peer-checked:bg-red-600';
  } else if (props.hunterColor === 'green') {
    return 'peer-checked:bg-green-600';
  } else if (props.hunterColor === 'blue') {
    return 'peer-checked:bg-blue-600';
  }
  return 'peer-checked:bg-blue-600';
});

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
</style>