<template>
  <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600">
    <!-- Header -->
    <div class="p-4 border-b border-gray-700">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-2">
          <span class="text-lg font-bold text-white">Level {{ build.level }}</span>
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        <div class="flex space-x-1">
          <button
            @click="$emit('view-details', build)"
            class="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            title="View Details"
          >
            <IconEye size="14" class="text-gray-300" />
          </button>
          <button
            @click="$emit('import', build)"
            class="p-1.5 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
            title="Import Build"
          >
            <IconDownload size="14" class="text-white" />
          </button>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="text-gray-400">
          <span class="font-medium">Loot/min:</span>
          <span class="text-yellow-400 ml-1">{{ formatNumber(build.lootScore) }}</span>
        </div>
        <div class="text-gray-400">
          <span class="font-medium">Stage:</span>
          <span class="text-blue-400 ml-1">{{ formatNumber(build.stage.avg) }}</span>
        </div>
      </div>
    </div>

    <!-- Performance Metrics -->
    <div class="p-4 space-y-3">
      <!-- Loot Score Bar -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm font-medium text-gray-300">Loot Score</span>
          <span class="text-sm text-yellow-400">{{ formatNumber(build.lootScore) }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full"
            :style="{ width: `${Math.min(100, (build.lootScore / maxLootScore) * 100)}%` }"
          ></div>
        </div>
      </div>

      <!-- Stage Progress -->
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm font-medium text-gray-300">Average Stage</span>
          <span class="text-sm text-blue-400">{{ formatNumber(build.stage.avg) }}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div 
            class="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
            :style="{ width: `${Math.min(100, (build.stage.avg / maxStage) * 100)}%` }"
          ></div>
        </div>
      </div>

      <!-- Time & Efficiency -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-gray-700/50 rounded p-2">
          <div class="text-gray-400 mb-1">Time</div>
          <div class="text-white font-medium">{{ formatTime(build.time.minutes) }}</div>
        </div>
        <div class="bg-gray-700/50 rounded p-2">
          <div class="text-gray-400 mb-1">Efficiency</div>
          <div class="text-green-400 font-medium">{{ formatEfficiency(build.lootScore, build.time.minutes) }}</div>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="build.notes" class="bg-gray-700/30 rounded p-2">
        <div class="text-xs text-gray-400 mb-1">Notes</div>
        <div class="text-sm text-gray-200 leading-tight">{{ build.notes }}</div>
      </div>

      <!-- Build Code Preview -->
      <div class="bg-gray-900/50 rounded p-2">
        <div class="text-xs text-gray-400 mb-1">Build Code</div>
        <div class="text-xs font-mono text-gray-300 break-all">
          {{ build.buildCode.substring(0, 30) }}{{ build.buildCode.length > 30 ? '...' : '' }}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-3 bg-gray-750 border-t border-gray-700">
      <div class="flex justify-between items-center">
        <div class="text-xs text-gray-500">
          Updated {{ formatDate(build.lastUpdated) }}
        </div>
        <div class="flex items-center space-x-1 text-xs text-gray-400">
          <IconStar size="12" />
          <span>{{ build.rating || 'N/A' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconEye, IconDownload, IconStar } from '@tabler/icons-vue';

// Props
const props = defineProps({
  build: {
    type: Object,
    required: true
  },
  maxLootScore: {
    type: Number,
    default: 1000000
  },
  maxStage: {
    type: Number,
    default: 1000
  }
});

// Events
defineEmits(['view-details', 'import']);

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
  return formatNumber(efficiency) + '/min';
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString();
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgb(55, 65, 81);
}
</style>