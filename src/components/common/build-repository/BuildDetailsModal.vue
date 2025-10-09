<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconInfoCircle size="20" class="mr-2 text-blue-400" />
          Build Details - Level {{ build?.level }}
        </h2>
        <button @click="$emit('close')" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors">
          <IconX size="18" />
        </button>
      </div>

      <!-- Content -->
      <div v-if="build" class="p-4 max-h-[75vh] overflow-y-auto">
        <!-- Performance Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-lg p-4 border border-yellow-700/30">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-yellow-400">Loot Score</h3>
              <IconCoins size="16" class="text-yellow-400" />
            </div>
            <div class="text-2xl font-bold text-white">{{ formatNumber(build.lootScore) }}</div>
            <div class="text-xs text-yellow-300 mt-1">per minute</div>
          </div>

          <div class="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-4 border border-blue-700/30">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-blue-400">Average Stage</h3>
              <IconTarget size="16" class="text-blue-400" />
            </div>
            <div class="text-2xl font-bold text-white">{{ formatNumber(build.stage.avg) }}</div>
            <div class="text-xs text-blue-300 mt-1">Range: {{ formatNumber(build.stage.min) }} - {{ formatNumber(build.stage.max) }}</div>
          </div>

          <div class="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-lg p-4 border border-green-700/30">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium text-green-400">Efficiency</h3>
              <IconTrendingUp size="16" class="text-green-400" />
            </div>
            <div class="text-2xl font-bold text-white">{{ formatEfficiency(build.lootScore, build.time.minutes) }}</div>
            <div class="text-xs text-green-300 mt-1">loot per minute</div>
          </div>
        </div>

        <!-- Time and Completion Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-700/30 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <IconClock size="16" class="mr-2" />
              Time Statistics
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400">Total Time:</span>
                <span class="text-white">{{ formatTime(build.time.minutes) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Completion Rate:</span>
                <span class="text-green-400">{{ (build.completionRate * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-700/30 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-300 mb-3 flex items-center">
              <IconActivity size="16" class="mr-2" />
              Battle Statistics
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-400">DPS:</span>
                <span class="text-white">{{ formatNumber(build.dps || 0) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">HP:</span>
                <span class="text-white">{{ formatNumber(build.hp || 0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Build Notes -->
        <div v-if="build.notes" class="mb-6">
          <h3 class="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <IconNotes size="16" class="mr-2" />
            Build Notes
          </h3>
          <div class="bg-gray-700/30 rounded-lg p-4">
            <p class="text-gray-200 leading-relaxed">{{ build.notes }}</p>
          </div>
        </div>

        <!-- Build Code -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-300 mb-3 flex items-center">
            <IconCode size="16" class="mr-2" />
            Build Code
          </h3>
          <div class="bg-gray-900 rounded-lg p-4 border border-gray-700">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-gray-400">Copy this code to import the build</span>
              <button 
                @click="copyBuildCode"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white transition-colors"
              >
                Copy
              </button>
            </div>
            <div class="font-mono text-sm text-gray-300 break-all bg-gray-800 rounded p-3 border">
              {{ build.buildCode }}
            </div>
          </div>
        </div>

        <!-- Requirements & Recommendations -->
        <div v-if="build.requirements || build.recommendations" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div v-if="build.requirements" class="bg-red-900/20 rounded-lg p-4 border border-red-700/30">
            <h3 class="text-sm font-medium text-red-400 mb-3 flex items-center">
              <IconAlertTriangle size="16" class="mr-2" />
              Requirements
            </h3>
            <ul class="text-sm text-red-200 space-y-1">
              <li v-for="req in build.requirements" :key="req" class="flex items-start">
                <span class="text-red-500 mr-2">•</span>
                {{ req }}
              </li>
            </ul>
          </div>

          <div v-if="build.recommendations" class="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <h3 class="text-sm font-medium text-blue-400 mb-3 flex items-center">
              <IconBulb size="16" class="mr-2" />
              Recommendations
            </h3>
            <ul class="text-sm text-blue-200 space-y-1">
              <li v-for="rec in build.recommendations" :key="rec" class="flex items-start">
                <span class="text-blue-500 mr-2">•</span>
                {{ rec }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Metadata -->
        <div class="bg-gray-700/20 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-300 mb-3">Build Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Last Updated:</span>
              <div class="text-white">{{ formatDate(build.lastUpdated) }}</div>
            </div>
            <div>
              <span class="text-gray-400">Author:</span>
              <div class="text-white">{{ build.author || 'Community' }}</div>
            </div>
            <div>
              <span class="text-gray-400">Rating:</span>
              <div class="text-yellow-400 flex items-center">
                <IconStar size="14" class="mr-1" />
                {{ build.rating || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-700 px-4 pb-4">
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white transition-colors"
        >
          Close
        </button>
        <button 
          @click="importBuild"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-medium transition-colors flex items-center"
        >
          <IconDownload size="16" class="mr-2" />
          Import Build
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  IconInfoCircle, 
  IconX, 
  IconCoins, 
  IconTarget, 
  IconTrendingUp,
  IconClock,
  IconActivity,
  IconNotes,
  IconCode,
  IconAlertTriangle,
  IconBulb,
  IconStar,
  IconDownload
} from '@tabler/icons-vue';

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  build: {
    type: Object,
    default: null
  }
});

// Events
const emit = defineEmits(['close', 'import']);

// Methods
function formatNumber(num) {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

function formatTime(minutes) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  }
  return `${Math.floor(minutes)}m`;
}

function formatEfficiency(loot, minutes) {
  const efficiency = loot / minutes;
  return formatNumber(efficiency);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function copyBuildCode() {
  if (props.build?.buildCode) {
    navigator.clipboard.writeText(props.build.buildCode);
    // TODO: Show toast notification
    console.log('Build code copied to clipboard');
  }
}

function importBuild() {
  emit('import', props.build);
  emit('close');
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