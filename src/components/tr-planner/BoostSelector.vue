<template>
  <div>
    <h3 class="font-medium mb-3">Boosts Configuration</h3>
    
    <!-- Kategorie-Tabs -->
    <div class="flex flex-wrap mb-4 border-b border-gray-700">
      <button 
        v-for="category in boostCategories" 
        :key="category.id"
        @click="selectedCategory = category.id"
        class="px-3 py-2 text-sm font-medium transition-colors"
        :class="selectedCategory === category.id 
          ? 'border-b-2 border-blue-500 text-blue-400' 
          : 'text-gray-400 hover:text-white'"
      >
        {{ category.label }}
      </button>
    </div>
    
    <!-- Boost-Liste für die ausgewählte Kategorie -->
    <div class="space-y-4 max-h-96 overflow-y-auto pr-2">
      <div 
        v-for="boost in filteredBoosts" 
        :key="boost.key" 
        class="p-3 bg-gray-800 rounded-md"
      >
        <div class="flex justify-between mb-2">
          <label class="text-sm font-medium flex items-center">
            {{ boost.label }}
            <IconInfoCircle 
              v-if="boost.tooltip && boost.tooltip !== '0'" 
              size="14" 
              class="ml-1 text-gray-500 cursor-help"
              :title="boost.tooltip"
            />
          </label>
          <span class="text-xs text-gray-500" v-if="boost.max">
            (max {{ boost.max }})
          </span>
        </div>
        
        <!-- Eingabefelder basierend auf dem Typ -->
        <div v-if="boost.type === 'number'">
          <div class="flex items-center">
            <input 
              v-model.number="boostValues[boost.key]" 
              type="number" 
              min="0" 
              :max="boost.max"
              class="w-full py-1 px-2 bg-gray-750 text-white rounded border border-gray-700"
            />
            <div class="ml-2 text-xs text-gray-400" v-if="getMultiplierValue(boost)">
              x{{ getMultiplierValue(boost).toFixed(3) }}
            </div>
          </div>
        </div>
        
        <div v-else-if="boost.type === 'boolean'">
          <div class="flex items-center">
            <input 
              type="checkbox"
              v-model="boostValues[boost.key]"
              class="w-4 h-4 mr-2 cursor-pointer"
              :disabled="isPermanentDisabled(boost)"
            />
            <div class="text-xs text-gray-400" v-if="getMultiplierValue(boost)">
              x{{ getMultiplierValue(boost).toFixed(3) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { boostCategories, allBoosts } from '@/constants/shorts-planner';
import { IconInfoCircle } from '@tabler/icons-vue';
import { useBoostCalculations } from '@/composables/useBoostCalculations';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  permanentValues: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue']);

// Boost-Berechnungen
const { calculateMultiplierValue } = useBoostCalculations();

// Ausgewählte Kategorie
const selectedCategory = ref('base');

// Lokale Kopie der Boost-Werte
const boostValues = ref({...props.modelValue});

// Gefilterte Boosts basierend auf der ausgewählten Kategorie
const filteredBoosts = computed(() => {
  return allBoosts.filter(boost => boost.category === selectedCategory.value);
});

// Multiplier-Wert für einen Boost berechnen
function getMultiplierValue(boost) {
  if (!boost.multiplier) return null;
  return calculateMultiplierValue(boost, boostValues.value);
}

// Bestimmen, ob ein Boost aufgrund von Permanent-Einstellung deaktiviert werden sollte
function isPermanentDisabled(boost) {
  if (!boost.permanent) return false;
  return props.permanentValues[boost.key] === true;
}

// Änderungen an den Boost-Werten überwachen und emittieren
watch(boostValues, (newValues) => {
  emit('update:modelValue', {...newValues});
}, { deep: true });

// Props aktualisieren, wenn sie sich ändern
watch(() => props.modelValue, (newValue) => {
  boostValues.value = {...newValue};
}, { deep: true });
</script>