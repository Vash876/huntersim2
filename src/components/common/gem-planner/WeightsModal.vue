<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-lg font-bold text-white flex items-center">
          <IconScale size="18" class="mr-2 text-purple-400" />
          Weight Settings
        </h2>
        <button 
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
        >
          <IconX size="16" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-3 sm:p-4 max-h-[75vh] overflow-y-auto">
        <div class="space-y-3 sm:space-y-4">
          
          <!-- Description - Full Width -->
          <div class="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-2 sm:p-3 border border-purple-800/50">
            <p class="text-sm text-purple-200">
              Configure the relative importance of different resources for automatic optimization calculations.
            </p>
          </div>

          <!-- Weights Grid -->
          <div class="space-y-3">
            
            <!-- Resource Weights -->
            <div class="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-lg p-2 sm:p-3 border border-yellow-800/50">
              <h3 class="text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center">
                <IconCoins size="20" class="mr-2 text-yellow-400" />
                Resource Weights
              </h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div 
                  v-for="weight in resourceWeights" 
                  :key="weight.id"
                  class="bg-gray-700/60 rounded p-1 sm:p-1.5"
                >
                  <label :for="weight.id" class="block text-xs font-medium text-gray-300 mb-1">
                    {{ weight.name }}
                  </label>
                  <ToolValueControls
                    :value="weights[weight.id] || 0"
                    :min-value="0"
                    :max-value="100"
                    :step="0.1"
                    :fast-step="1"
                    @update:value="updateWeight(weight.id, $event)"
                    :show-fast-controls="true"
                    :autoEdit="true"
                  />
                </div>
              </div>
            </div>

            <!-- Hunter Weights -->
            <div class="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-2 sm:p-3 border border-blue-800/50">
              <h3 class="text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center">
                <IconBow size="20" class="mr-2 text-blue-400" />
                Hunter Weights
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div 
                  v-for="weight in hunterWeights" 
                  :key="weight.id"
                  class="bg-gray-700/60 rounded p-1 sm:p-1.5"
                >
                  <label :for="weight.id" class="block text-xs font-medium text-gray-300 mb-1">
                    {{ weight.name }}
                  </label>
                  <ToolValueControls
                    :value="weights[weight.id] || 0"
                    :min-value="0"
                    :max-value="100"
                    :step="0.1"
                    :fast-step="1"
                    @update:value="updateWeight(weight.id, $event)"
                    :show-fast-controls="true"
                    :autoEdit="true"
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between pt-2 border-t border-gray-700 px-3 pb-3">
        <button
          @click="resetToDefaults"
          class="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <IconRotateClockwise size="12" />
          Reset
        </button>
        
        <button
          @click="closeModal"
          class="px-3 py-1.5 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-xs"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { IconScale, IconX, IconCoins, IconBow, IconRotateClockwise } from '@tabler/icons-vue'
import ToolValueControls from '@/composables/ToolValueControls.vue'

// Define emits and props
const emit = defineEmits(['close', 'weights-updated'])

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  initialWeights: {
    type: Object,
    default: () => ({})
  }
})

// Weight configurations
const resourceWeights = [
  { id: 'cells', name: 'Cells' },
  { id: 'mp', name: 'MP' },
  { id: 'shards', name: 'Shards' },
  { id: 'rp', name: 'RP' },
  { id: 'ap', name: 'AP' },
  { id: 'mats', name: 'Mats' }
]

const hunterWeights = [
  { id: 'borge', name: 'Borge' },
  { id: 'ozzy', name: 'Ozzy' },
  { id: 'knox', name: 'Knox' }
]

// Reactive data
const weights = ref({})
const lastUpdated = ref('')

// Default weights
function getDefaultWeights() {
  return {
    cells: 1.0,
    mp: 1.0,
    shards: 1.0,
    rp: 1.0,
    ap: 1.0,
    mats: 1.0,
    borge: 1.0,
    ozzy: 1.0,
    knox: 1.0
  }
}

// Initialize weights
function initializeWeights() {
  const defaults = getDefaultWeights()
  weights.value = { ...defaults, ...props.initialWeights }
  updateLastUpdated()
}

// Update individual weight
function updateWeight(weightId, value) {
  weights.value[weightId] = value
  updateLastUpdated()
  emit('weights-updated', weights.value)
}

// Quick actions
function resetToDefaults() {
  weights.value = getDefaultWeights()
  updateLastUpdated()
  showNotification('Weights reset to default values')
}

// Utility functions
function updateLastUpdated() {
  const now = new Date()
  lastUpdated.value = now.toLocaleTimeString()
}

function showNotification(message, type = 'success') {
  // Create a simple toast element
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 transition-opacity
    ${type === 'error' ? 'bg-red-600' : type === 'warning' ? 'bg-yellow-600' : 'bg-green-600'}`
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 3000)
}

// Modal functions
function closeModal() {
  // Auto-save before closing
  try {
    localStorage.setItem('gemPlannerWeights', JSON.stringify(weights.value))
    localStorage.setItem('gemPlannerWeightsTimestamp', Date.now().toString())
    updateLastUpdated()
    console.log('Weights auto-saved on close')
  } catch (error) {
    console.error('Failed to auto-save weights:', error)
  }
  
  emit('close')
}

// Watchers
watch(() => weights.value, () => {
  updateLastUpdated()
  emit('weights-updated', weights.value)
}, { deep: true })

// Lifecycle
onMounted(() => {
  initializeWeights()
  
  // Try to load last saved timestamp
  const timestamp = localStorage.getItem('gemPlannerWeightsTimestamp')
  if (timestamp) {
    const date = new Date(parseInt(timestamp))
    lastUpdated.value = date.toLocaleTimeString()
  }
})

// Expose weights for parent component
defineExpose({
  weights
})
</script>

<style scoped>
/* Mobile Navbar angepasste Container */
.mobile-modal-container {
  /* Desktop: normale Höhe */
  padding-bottom: 1rem;
}

/* Mobile: Platz für Navbar lassen */
@media (max-width: 768px) {
  .mobile-modal-container {
    padding-bottom: var(--mobile-safe-bottom, 70px);
  }
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

/* Custom scrollbar for webkit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: #374151;
  border-radius: 0.375rem;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4b5563;
  border-radius: 0.375rem;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}
</style>
