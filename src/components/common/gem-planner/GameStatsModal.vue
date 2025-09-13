<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-lg font-bold text-white flex items-center">
          <IconAdjustmentsHorizontal size="18" class="mr-2 text-blue-400" />
          Game Statistics
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
          
          <!-- Game Progression - Full Width -->
          <div class="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-2 sm:p-3 border border-green-800/50">
            <h3 class="text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center">
              <IconTrendingUp size="20" class="mr-2 text-green-400" />
              {{ GAME_STATS_CONFIG.progression.title }}
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-1 sm:gap-1.5">
              <div 
                v-for="(stat, index) in GAME_STATS_CONFIG.progression.stats" 
                :key="stat.id"
                class="bg-gray-700/60 rounded p-1 sm:p-1.5"
              >
                <label :for="stat.id" class="block text-xs font-medium text-gray-300 mb-1">
                  {{ stat.name }}
                </label>
                <ToolValueControls
                  :value="gameStats[stat.id] || 0"
                  :min-value="0"
                  :max-value="stat.max || 999999999"
                  :step="stat.step || 1"
                  :fast-step="stat.faststep || 10"
                  @update:value="updateStat(stat.id, $event)"
                  :show-fast-controls="true"
                  :autoEdit="true"
                  value-class="text-white text-xs"
                  :tab-index="getProgressionTabIndex(index)"
                />
              </div>
            </div>
          </div>

          <!-- Ship Stats Grid (2 columns) -->
          <div class="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
            
            <!-- Ship Ranks -->
            <div class="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-2 sm:p-3 border border-blue-800/50">
              <h3 class="text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center">
                <IconMedal2 size="20" class="mr-2 text-blue-400" />
                {{ GAME_STATS_CONFIG.rank.title }}
              </h3>
              <div class="space-y-1.5 sm:space-y-2">
                <div 
                  v-for="(stat, index) in GAME_STATS_CONFIG.rank.stats" 
                  :key="stat.id"
                  class="bg-gray-700/60 rounded p-1 sm:p-1.5"
                >
                  <label :for="stat.id" class="block text-xs font-medium text-gray-300 mb-1">
                    {{ stat.name }}
                  </label>
                  <ToolValueControls
                    :value="gameStats[stat.id] || 0"
                    :min-value="0"
                    :max-value="stat.max || 9999"
                    :step="stat.step || 1"
                    :fast-step="stat.faststep || 100"
                    @update:value="updateStat(stat.id, $event)"
                    :show-fast-controls="true"
                    :autoEdit="true"
                    :tab-index="getTabIndex('rank', index)"
                  />
                </div>
              </div>
            </div>

            <!-- Ship Crew -->
            <div class="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-2 sm:p-3 border border-purple-800/50">
              <h3 class="text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center">
                <IconUsers size="20" class="mr-2 text-purple-400" />
                {{ GAME_STATS_CONFIG.crew.title }}
              </h3>
              <div class="space-y-1.5 sm:space-y-2">
                <div 
                  v-for="(stat, index) in GAME_STATS_CONFIG.crew.stats" 
                  :key="stat.id"
                  class="bg-gray-700/60 rounded p-1 sm:p-1.5"
                >
                  <label :for="stat.id" class="block text-xs font-medium text-gray-300 mb-1">
                    {{ stat.name }}
                  </label>
                  <ToolValueControls
                    :value="gameStats[stat.id] || 0"
                    :min-value="0"
                    :max-value="stat.max || 9999"
                    :step="stat.step || 1"
                    :fast-step="stat.faststep || 100"
                    @update:value="updateStat(stat.id, $event)"
                    :show-fast-controls="true"
                    :autoEdit="true"
                    :tab-index="getTabIndex('crew', index)"
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
import { IconAdjustmentsHorizontal, IconX, IconTrendingUp, IconMedal, IconMedal2, IconUsers, IconRotateClockwise } from '@tabler/icons-vue'
import ToolValueControls from '@/composables/ToolValueControls.vue'
import { GAME_STATS_CONFIG, getDefaultStatsValues, getAllStats } from '@/constants/gem-planner/stats.js'
import { useGemPlannerStore } from '@/store/gemPlannerStore.js'

// Define emits and props
const emit = defineEmits(['close', 'stats-updated'])

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  initialStats: {
    type: Object,
    default: () => ({})
  }
})

// Initialize store
const gemPlannerStore = useGemPlannerStore()
gemPlannerStore.init()

// Use store data directly - read-only computed
const gameStats = computed(() => gemPlannerStore.gameStats)

const lastUpdated = ref('')

// Computed properties
const totalStatsCount = computed(() => {
  return getAllStats().length
})

const nonZeroStatsCount = computed(() => {
  return Object.values(gameStats.value).filter(value => value > 0).length
})

// Initialize stats
function initializeStats() {
  // Stats are now loaded from store automatically
  updateLastUpdated()
}

// Update individual stat
function updateStat(statId, value) {
  gemPlannerStore.updateGameStat(statId, value)
  updateLastUpdated()
  emit('stats-updated', gameStats.value)
}

// Get tab index for progression stats (starts at 1)
function getProgressionTabIndex(index) {
  return index + 1
}

// Calculate tab index for intelligent ship navigation
// Progression stats: 1, 2, 3, ..., N
// Ship stats: N+1, N+2, N+3, ... (rank/crew alternating)
function getTabIndex(type, index) {
  // Calculate base offset: total progression stats + 1
  const progressionStatsCount = GAME_STATS_CONFIG.progression.stats.length
  const baseOffset = progressionStatsCount
  
  // Each ship pair gets 2 consecutive numbers: rank then crew
  const shipPairIndex = index * 2
  
  if (type === 'rank') {
    // Rank gets the odd position within ship stats: baseOffset + 1, baseOffset + 3, baseOffset + 5, etc.
    return baseOffset + shipPairIndex + 1
  } else { // crew
    // Crew gets the even position within ship stats: baseOffset + 2, baseOffset + 4, baseOffset + 6, etc.
    return baseOffset + shipPairIndex + 2
  }
}

// Quick actions
function resetToDefaults() {
  gemPlannerStore.resetGameStats()
  updateLastUpdated()
  showNotification('Statistics reset to default values')
  emit('stats-updated', gameStats.value)
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
  // Data is automatically saved through the store
  updateLastUpdated()
  console.log('Statistics automatically saved through store')
  
  emit('close')
}

// Lifecycle
onMounted(() => {
  initializeStats()
})

// Expose stats for parent component
defineExpose({
  gameStats
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

.bg-gray-750 {
  background-color: rgba(55, 65, 81, 0.9);
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
