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
          <IconStar size="20" class="mr-2 text-purple-400" />
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
        <div class="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 mb-4">
          <p class="text-sm text-yellow-200 mb-1">
            ⚠️ <strong>Testing Phase:</strong> These presets are currently being tested. Please ask in Discord before committing to a build.
          </p>
          <p class="text-xs text-yellow-300/80">
            Found errors in presets? Please ping Vash in Discord.
          </p>
        </div>
        
        <!-- Filter Controls -->
        <div class="bg-gray-700/50 rounded-lg p-3 mb-4 border border-gray-600">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-200">
                Current: <span class="text-purple-300 font-medium">{{ currentCellMilestones }}/{{ currentMPMilestones }}/{{ currentRPMilestones }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-200">Show +</span>
                <ToolValueControls
                  :value="milestoneRangeFilter"
                  @update:value="milestoneRangeFilter = $event"
                  :minValue="0"
                  :maxValue="50"
                  :step="1"
                  :fastStep="1"
                  :showFastControls="false"
                  value-class="text-blue-300 font-medium text-sm"
                  :autoEdit="true"
                />
                <span class="text-sm text-gray-400">milestones</span>
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

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <div class="text-gray-400 text-sm">
            Loading preset data from Google Sheets...
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-4">
          <p class="text-red-300 mb-3">{{ loadError }}</p>
          <button 
            @click="loadPresets()" 
            class="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-colors text-sm"
          >
            Retry
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!isLoading && filteredPresets.length === 0" class="text-center py-12">
          <p class="text-gray-400 mb-2">No presets match your current filters.</p>
          <p class="text-gray-500 text-sm">Try adjusting the milestone range or category filter.</p>
        </div>

        <!-- Presets Grid - 2 per row -->
        <div v-else-if="filteredPresets.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="preset in filteredPresets" 
            :key="preset.milestones + '-' + preset.category"
            :class="[
              'bg-gray-700/50 rounded-lg border transition-all cursor-pointer p-3',
              errorPresetId === (preset.milestones + '-' + preset.category)
                ? 'border-red-500 animate-error-shake'
                : 'border-gray-600 hover:border-purple-500'
            ]"
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
                <span v-if="preset.milestones" class="text-xs text-purple-300 font-medium">{{ preset.milestones }}</span>
                <span v-else class="text-xs text-gray-500 italic">Endgame</span>
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

            <!-- Description and Floating Points Info -->
            <div v-if="preset.description || (preset.floating && preset.floating.length > 0)" class="mb-2 flex items-center justify-between gap-2">
              <p v-if="preset.description" class="text-xs text-gray-400 italic flex-1">{{ preset.description }}</p>
              <div v-else class="flex-1"></div>
              
              <!-- Floating Points Info (always on the right) -->
              <div v-if="preset.floating && preset.floating.length > 0" class="flex items-center gap-1 text-xs shrink-0">
                <IconTarget size="12" class="text-yellow-400" />
                <span class="text-yellow-300 whitespace-nowrap">
                  Floating Points: {{ getPresetRemainingCores(preset) }}, {{ Math.max(0, getPresetFloatingCost(preset) - getPresetRemainingCores(preset)) }} more needed
                </span>
              </div>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  IconStar,
  IconTarget, 
  IconX, 
  IconHexagon, 
  IconAlertCircle, 
} from '@tabler/icons-vue';
import { calculatePresetCost } from '@/constants/ts-planner/presets';
import { getTraitSphereById, getTraitSphereAtPosition } from '@/constants/ts-planner/index';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { usePresetData } from '@/composables/usePresetData';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentCellMilestones: {
    type: Number,
    required: true
  },
  currentMPMilestones: {
    type: Number,
    required: true
  },
  currentRPMilestones: {
    type: Number,
    required: true
  },
  availableCores: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'select-preset']);

// Local state
const milestoneRangeFilter = ref(2);
const selectedCategory = ref('all');
const errorPresetId = ref(null);
const presets = ref([]);
const isLoading = ref(false);
const loadError = ref(null);

// Load presets from Google Sheets
const { fetchPresetData } = usePresetData();

async function loadPresets() {
  // TODO: Re-enable caching after testing
  // if (presets.value.length > 0) return; // Already loaded - cache for session
  
  isLoading.value = true;
  loadError.value = null;
  
  try {
    const data = await fetchPresetData();
    presets.value = data;
    console.log(`Loaded ${data.length} presets from Google Sheets`);
  } catch (error) {
    console.error('Failed to load presets:', error);
    loadError.value = 'Failed to load presets from Google Sheets. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

// Load presets when modal becomes visible
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadPresets();
  }
});

// Helper function to parse milestones from preset
function parsePresetMilestones(milestoneString) {
  if (!milestoneString || milestoneString.trim() === '') {
    return []; // No milestones defined
  }
  
  // Split by | to handle multiple milestone combinations
  const combinations = milestoneString.split('|').map(s => s.trim());
  
  return combinations.map(combo => {
    const [cell, mp, rp] = combo.split('/').map(n => parseInt(n.trim()) || 0);
    return { cell, mp, rp, total: cell + mp + rp };
  });
}

// Check if any milestone combination matches the filter criteria
function presetMatchesMilestones(preset) {
  const milestones = parsePresetMilestones(preset.milestones);
  
  // If no milestones defined, show it (endgame presets)
  if (milestones.length === 0) {
    return true;
  }
  
  // Calculate current total milestones
  const currentTotal = props.currentCellMilestones + props.currentMPMilestones + props.currentRPMilestones;
  
  // Only show presets with equal or higher total milestones (within range)
  return milestones.some(m => {
    const diff = m.total - currentTotal; // Positive if preset is higher
    return diff >= 0 && diff <= milestoneRangeFilter.value;
  });
}

// Computed properties
const filteredPresets = computed(() => {
  let filteredList = presets.value;
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    filteredList = filteredList.filter(preset => {
      // Handle "short/long" category
      if (preset.category === 'short/long') {
        return selectedCategory.value === 'short/long';
      }
      return preset.category === selectedCategory.value;
    });
  }
  
  // Filter by milestone range
  filteredList = filteredList.filter(preset => presetMatchesMilestones(preset));
  
  // Sort by milestone proximity
  return filteredList.sort((a, b) => {
    const milestonesA = parsePresetMilestones(a.milestones);
    const milestonesB = parsePresetMilestones(b.milestones);
    
    // If no milestones, sort to end
    if (milestonesA.length === 0 && milestonesB.length === 0) return 0;
    if (milestonesA.length === 0) return 1;
    if (milestonesB.length === 0) return -1;
    
    // Calculate current total milestones
    const currentTotal = props.currentCellMilestones + props.currentMPMilestones + props.currentRPMilestones;
    
    // Calculate minimum distance for each preset based on total
    const getMinDistance = (milestones) => {
      return Math.min(...milestones.map(m => {
        return Math.abs(m.total - currentTotal);
      }));
    };
    
    const distA = getMinDistance(milestonesA);
    const distB = getMinDistance(milestonesB);
    
    return distA - distB;
  });
});

// Methods
function closeModal() {
  emit('close');
}

function selectPreset(preset) {
  const cost = getPresetCost(preset);
  
  // Check if affordable
  if (cost > props.availableCores) {
    // Trigger error animation - use milestones + category as unique ID
    errorPresetId.value = preset.milestones + '-' + preset.category;
    
    // Remove error state after animation
    setTimeout(() => {
      errorPresetId.value = null;
    }, 600);
    
    return; // Don't close modal or apply preset
  }
  
  emit('select-preset', preset);
  closeModal();
}

function getPresetCost(preset) {
  return calculatePresetCost(preset);
}

function getPresetFloatingCost(preset) {
  if (!preset.floating || preset.floating.length === 0) return 0;
  
  return preset.floating.reduce((total, sphereId) => {
    const sphere = getTraitSphereById(sphereId);
    return total + (sphere?.price || 0);
  }, 0);
}

function getPresetRemainingCores(preset) {
  // Calculate remaining cores after buying selected spheres
  const selectedCost = getPresetCost(preset);
  return props.availableCores - selectedCost;
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
  const isFloating = preset.floating && preset.floating.includes(sphere.id);
  
  return [
    'bg-gray-900/60 border transition-all duration-200',
    isSelected ? 'border-purple-400 bg-purple-900/30' : 
    isFloating ? 'border-yellow-300 bg-yellow-600/30' :
    'border-gray-600/50',
    sphere.effect === 'locked' ? 'opacity-50' : ''
  ].filter(Boolean);
}

function getPresetInnerSphereClasses(sphere, preset) {
  const isSelected = preset.spheres.includes(sphere.id);
  const isFloating = preset.floating && preset.floating.includes(sphere.id);
  
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
  } else if (isFloating) {
    // Floating: filled with effect color but slightly dimmed
    switch (sphere.effect) {
      case 'lp': return 'bg-purple-400';
      case 'shards': return 'bg-blue-400';
      case 'doubler': return 'bg-red-400';
      case 'ultima': return 'bg-green-400';
      case 'tick': return 'bg-yellow-400';
      default: return 'bg-yellow-400';
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

.animate-error-shake {
  animation: errorShake 0.6s ease-in-out;
}

@keyframes errorShake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-4px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(4px);
  }
}
</style>