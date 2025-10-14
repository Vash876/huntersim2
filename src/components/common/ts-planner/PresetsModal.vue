<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconTarget size="20" class="mr-2 text-purple-400" />
          Trait Sphere Presets
        </h2>
        <button 
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-5 overflow-y-auto max-h-[calc(90vh-120px)]">
        <p class="text-sm text-gray-300 mb-4">
          Choose from community-tested trait sphere builds. Filter presets based on your available cores.
        </p>
        
        <!-- Filter Controls -->
        <div class="bg-gray-700/50 rounded-lg p-3 mb-4 border border-gray-600">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-200">
                Available: <span class="text-purple-300 font-medium">{{ availableCores }}</span> cores
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-200">Range: ±</span>
                <ToolValueControls
                  :value="coreRangeFilter"
                  @update:value="coreRangeFilter = $event"
                  :minValue="0"
                  :maxValue="100"
                  :step="1"
                  :fastStep="5"
                  :showFastControls="false"
                  value-class="text-blue-300 font-medium text-sm"
                  :autoEdit="true"
                />
              </div>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="flex space-x-2">
            <button
              @click="selectedCategory = 'all'"
              :class="[
                'px-3 py-1 text-xs rounded-md transition-colors',
                selectedCategory === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              ]"
            >
              All
            </button>
            <button
              @click="selectedCategory = 'short'"
              :class="[
                'px-3 py-1 text-xs rounded-md transition-colors',
                selectedCategory === 'short' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              ]"
            >
              Short
            </button>
            <button
              @click="selectedCategory = 'long'"
              :class="[
                'px-3 py-1 text-xs rounded-md transition-colors',
                selectedCategory === 'long' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              ]"
            >
              Long
            </button>
            <button
              @click="selectedCategory = 'short/long'"
              :class="[
                'px-3 py-1 text-xs rounded-md transition-colors',
                selectedCategory === 'short/long' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              ]"
            >
              Short/Long
            </button>
          </div>
        </div>

        <!-- Presets Grid - 2 per row -->
        <div v-if="filteredPresets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="preset in filteredPresets" 
            :key="preset.id"
            class="bg-gray-700/50 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors cursor-pointer p-3"
            @click="selectPreset(preset)"
          >
            <!-- Header -->
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center space-x-2">
                <span 
                  :class="[
                    'px-1.5 py-0.5 text-xs rounded-full font-medium',
                    preset.category === 'short' 
                      ? 'bg-orange-600/30 text-orange-300 border border-orange-600/50' 
                      : preset.category === 'long'
                      ? 'bg-green-600/30 text-green-300 border border-green-600/50'
                      : 'bg-red-600/30 text-red-300 border border-red-600/50'
                  ]"
                >
                  {{ preset.category.toUpperCase() }}
                </span>
                <span class="text-xs text-gray-400">{{ preset.cores }} AM Cores</span>
                <span v-if="preset.milestones" class="text-xs text-gray-500">{{ preset.milestones }}</span>
              </div>
              <div class="text-right">
                <div class="flex items-center">
                  <span 
                    :class="[
                      'font-medium text-sm mr-1',
                      getPresetCost(preset) <= availableCores 
                        ? 'text-green-300' 
                        : 'text-red-400'
                    ]"
                  >
                    {{ getPresetCost(preset) }}
                  </span>
                  <IconHexagon size="10" class="text-purple-400" />
                </div>
              </div>
            </div>

            <!-- Optional Description -->
            <div v-if="preset.description" class="mb-2">
              <p class="text-xs text-gray-400 italic">{{ preset.description }}</p>
            </div>
            
            <!-- Miniature Trait Sphere Grid (7x7 like original) -->
            <div class="mb-2 flex justify-center">
              <div class="grid grid-cols-7 gap-0.5" style="width: 140px; height: 140px;">
                <template v-for="row in 7" :key="`preset-${preset.cores}-${preset.category}-row-${row}`">
                  <template v-for="col in 7" :key="`preset-${preset.cores}-${preset.category}-cell-${row}-${col}`">
                    <template v-if="getSphereAtPosition(col-1, row-1)">
                      <div 
                        v-if="getSphereAtPosition(col-1, row-1).id >= 0"
                        :class="getPresetSphereClasses(getSphereAtPosition(col-1, row-1), preset)"
                        class="aspect-square rounded-sm flex items-center justify-center"
                      >
                        <!-- Mini sphere icon -->
                        <div 
                          v-if="getSphereAtPosition(col-1, row-1).effect === 'locked'"
                          class="w-2 h-2 bg-gray-600 rounded-full"
                        ></div>
                        <div 
                          v-else
                          :class="getPresetInnerSphereClasses(getSphereAtPosition(col-1, row-1), preset)"
                          class="w-2 h-2 rounded-full"
                        ></div>
                      </div>
                      <div v-else class="aspect-square"></div>
                    </template>
                    <template v-else>
                      <div class="aspect-square"></div>
                    </template>
                  </template>
                </template>
              </div>
            </div>
            
            <!-- Affordability Status -->
            <div class="text-center">
              <span 
                v-if="getPresetCost(preset) > availableCores"
                class="text-red-400 font-medium text-xs"
              >
                Need {{ getPresetCost(preset) - availableCores }} more cores
              </span>
              <span 
                v-else
                class="text-green-400 font-medium text-xs"
              >
                ✓ Affordable
              </span>
            </div>
          </div>
        </div>

        <!-- No matching presets message -->
        <div v-else class="text-center py-8">
          <IconAlertCircle size="48" class="mx-auto text-gray-500 mb-3" />
          <h3 class="text-lg font-medium text-gray-300 mb-2">No Matching Presets</h3>
          <p class="text-sm text-gray-400 mb-2">
            No presets found within {{ coreRangeFilter }} cores of your available amount ({{ availableCores }}).
          </p>
          <p class="text-xs text-gray-500">
            Try increasing the core range filter or adjusting your milestone settings.
          </p>
        </div>

        <!-- Custom preset info -->
        <div class="mt-6 p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
          <p class="text-xs text-blue-200 flex items-start">
            <IconInfoCircle size="14" class="mr-1 mt-0.5 flex-shrink-0" />
            These presets are based on community strategies. You can always manually select trait spheres for custom builds.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  IconTarget, 
  IconX, 
  IconHexagon, 
  IconAlertCircle, 
  IconInfoCircle 
} from '@tabler/icons-vue';
import { 
  traitSpherePresets, 
  calculatePresetCost 
} from '@/constants/ts-planner/presets';
import { getTraitSphereById, getTraitSphereAtPosition } from '@/constants/ts-planner/index';
import ToolValueControls from '@/composables/ToolValueControls.vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  availableCores: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'select-preset']);

// Local state
const coreRangeFilter = ref(10);
const selectedCategory = ref('all');

// Computed properties
const filteredPresets = computed(() => {
  let presets = traitSpherePresets;
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    presets = presets.filter(preset => preset.category === selectedCategory.value);
  }
  
  // Filter by core range
  presets = presets.filter(preset => {
    const cost = getPresetCost(preset);
    const difference = Math.abs(cost - props.availableCores);
    return difference <= coreRangeFilter.value;
  });
  
  // Sort by cost (closest to available cores first)
  return presets.sort((a, b) => {
    const costA = getPresetCost(a);
    const costB = getPresetCost(b);
    const diffA = Math.abs(costA - props.availableCores);
    const diffB = Math.abs(costB - props.availableCores);
    
    // Primary sort: by difference to available cores
    if (diffA !== diffB) {
      return diffA - diffB;
    }
    
    // Secondary sort: affordable presets first
    const affordableA = costA <= props.availableCores;
    const affordableB = costB <= props.availableCores;
    
    if (affordableA && !affordableB) return -1;
    if (!affordableA && affordableB) return 1;
    
    // Tertiary sort: by cost
    return costA - costB;
  });
});

// Methods
function closeModal() {
  emit('close');
}

function selectPreset(preset) {
  emit('select-preset', preset);
  closeModal();
}

function getPresetCost(preset) {
  return calculatePresetCost(preset);
}

function getSphereEffectClass(sphereId) {
  const sphere = getTraitSphereById(sphereId);
  if (!sphere) return 'bg-gray-600';
  
  switch (sphere.effect) {
    case 'lp': return 'bg-purple-600';
    case 'shards': return 'bg-blue-600';
    case 'doubler': return 'bg-red-600';
    case 'ultima': return 'bg-green-600';
    case 'tick': return 'bg-yellow-600';
    default: return 'bg-gray-600';
  }
}

function getSphereAtPosition(col, row) {
  return getTraitSphereAtPosition(col, row);
}

function getPresetSphereClasses(sphere, preset) {
  const isSelected = preset.spheres.includes(sphere.id);
  
  return [
    'bg-gray-900/60 border transition-all duration-200',
    isSelected ? 'border-purple-400 bg-purple-900/30' : 'border-gray-600/50',
    sphere.effect === 'locked' ? 'opacity-50' : ''
  ].filter(Boolean);
}

function getPresetInnerSphereClasses(sphere, preset) {
  const isSelected = preset.spheres.includes(sphere.id);
  
  if (isSelected) {
    // Selected: filled with effect color
    switch (sphere.effect) {
      case 'lp': return 'bg-purple-500';
      case 'shards': return 'bg-blue-500';
      case 'doubler': return 'bg-red-500';
      case 'ultima': return 'bg-green-500';
      case 'tick': return 'bg-yellow-500';
      default: return 'bg-purple-500';
    }
  } else {
    // Not selected: just border with effect color
    return 'bg-transparent border border-gray-500';
  }
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
</style>