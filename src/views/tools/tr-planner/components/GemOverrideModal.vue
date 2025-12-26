<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-800 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-lg font-bold text-white flex items-center">
          <IconSparkles :size="18" class="mr-2 text-purple-400" />
          Gem Overrides
        </h2>
        <button @click="closeModal" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors">
          <IconX :size="16" class="text-gray-400" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-3 sm:p-4 max-h-[70vh] overflow-y-auto">
        <p class="text-xs text-gray-400 mb-3">
          Override gem levels for this plan without changing your global Gem Planner data.
        </p>
        
        <!-- Gem Override List -->
        <div class="space-y-2">
          <div 
            v-for="gem in gems" 
            :key="gem.id"
            class="bg-gray-700/50 rounded-lg p-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium" :class="gem.colorClass">{{ gem.name }}</span>
                <span class="text-xs text-gray-500">
                  (Global: {{ gem.globalLevel }})
                </span>
              </div>
              
              <div class="flex items-center gap-2">
                <!-- Override Toggle -->
                <button 
                  @click="toggleOverride(gem.id)"
                  class="px-2 py-1 rounded text-xs transition-colors"
                  :class="hasOverride(gem.id) 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-600 text-gray-400 hover:bg-gray-500'"
                >
                  {{ hasOverride(gem.id) ? 'Override Active' : 'Override' }}
                </button>
              </div>
            </div>
            
            <!-- Override Input (when active) -->
            <div v-if="hasOverride(gem.id)" class="mt-2 flex items-center gap-2">
              <span class="text-xs text-gray-400">Override Level:</span>
              <ToolValueControls
                :value="getOverrideValue(gem.id)"
                :minValue="0"
                :maxValue="10"
                :step="1"
                size="sm"
                @update:value="setOverrideValue(gem.id, $event)"
              />
              
              <button 
                @click="removeOverride(gem.id)"
                class="ml-auto p-1 text-gray-500 hover:text-red-400 transition-colors"
                title="Remove Override"
              >
                <IconTrash :size="14" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Summary -->
        <div v-if="overrideCount > 0" class="mt-3 bg-purple-900/20 border border-purple-800/30 rounded-lg p-2">
          <div class="flex items-center gap-2">
            <IconInfoCircle :size="14" class="text-purple-400" />
            <span class="text-xs text-purple-300">
              {{ overrideCount }} Gem Override(s) active for this plan
            </span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between pt-2 border-t border-gray-700 px-3 pb-3">
        <button 
          @click="clearAllOverrides"
          class="px-3 py-1.5 text-red-400 hover:text-red-300 text-sm transition-colors"
          :disabled="overrideCount === 0"
        >
          Remove All
        </button>
        <div class="flex gap-2">
          <button 
            @click="closeModal" 
            class="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-md text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="saveOverrides" 
            class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-md text-sm transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconSparkles, IconX, IconTrash, IconInfoCircle } from '@tabler/icons-vue';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import ToolValueControls from '@/composables/ToolValueControls.vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentOverrides: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'save']);

const gemPlannerStore = useGemPlannerStore();

// Local state for editing
const localOverrides = ref({});

// Initialize local overrides when modal opens
watch(() => props.isVisible, (visible) => {
  if (visible) {
    localOverrides.value = { ...props.currentOverrides };
  }
});

// Gem data with colors
const gems = computed(() => {
  const gemIds = ['temporal', 'power', 'attraction', 'innovation', 'evolution', 'creation', 'exodus'];
  const colorMap = {
    temporal: 'text-red-400',
    power: 'text-purple-400',
    attraction: 'text-blue-400',
    innovation: 'text-yellow-400',
    evolution: 'text-green-400',
    creation: 'text-orange-400',
    exodus: 'text-pink-400'
  };
  
  return gemIds.map(id => {
    const state = gemPlannerStore.getGemState(id);
    return {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1) + ' Gem',
      globalLevel: state?.level || 0,
      colorClass: colorMap[id] || 'text-gray-400'
    };
  });
});

const overrideCount = computed(() => Object.keys(localOverrides.value).length);

function hasOverride(gemId) {
  return gemId in localOverrides.value;
}

function getOverrideValue(gemId) {
  return localOverrides.value[gemId] ?? 0;
}

function setOverrideValue(gemId, value) {
  localOverrides.value[gemId] = Math.max(0, Math.min(10, value || 0));
}

function toggleOverride(gemId) {
  if (hasOverride(gemId)) {
    removeOverride(gemId);
  } else {
    // Start with current global level
    const gem = gems.value.find(g => g.id === gemId);
    localOverrides.value[gemId] = gem?.globalLevel || 0;
  }
}

function incrementOverride(gemId) {
  setOverrideValue(gemId, getOverrideValue(gemId) + 1);
}

function decrementOverride(gemId) {
  setOverrideValue(gemId, getOverrideValue(gemId) - 1);
}

function removeOverride(gemId) {
  const { [gemId]: _, ...rest } = localOverrides.value;
  localOverrides.value = rest;
}

function clearAllOverrides() {
  localOverrides.value = {};
}

function closeModal() {
  emit('close');
}

function saveOverrides() {
  emit('save', { ...localOverrides.value });
  closeModal();
}
</script>

<style scoped>
.mobile-modal-container {
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .mobile-modal-container {
    padding-bottom: var(--mobile-safe-bottom, 70px);
    padding-top: 60px;
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
