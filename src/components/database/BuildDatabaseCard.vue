<template>
  <div 
    class="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Header mit Hunter-Info und Name -->
    <div class="bg-gray-900/60 p-4 border-b border-gray-700 flex items-center gap-3">
      <div 
        class="rounded-full p-1.5 flex items-center justify-center w-10 h-10"
        :class="`bg-${hunterColor}-900/40 text-${hunterColor}-400`"
      >
        <component :is="hunterIcon" size="20" />
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="text-white font-semibold text-lg truncate">
          {{ build.name }}
        </h3>
        <p class="text-gray-400 text-sm flex items-center gap-1">
          <span>von</span>
          <span class="font-medium">{{ build.uploaderName }}</span>
          <span class="text-gray-500 mx-1">•</span>
          <span class="text-xs">{{ formatDate(build.uploadTimestamp) }}</span>
        </p>
      </div>
    </div>
    
    <!-- Build-Info -->
    <div class="p-4 space-y-3">
      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mt-1">
        <span 
          v-for="tag in build.tags" 
          :key="tag"
          class="inline-block px-2 py-0.5 bg-gray-700/60 text-gray-300 text-xs rounded-full"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- Performance Metrics -->
      <div class="grid grid-cols-3 gap-2 mt-3">
        <!-- Loot/Min -->
        <div class="bg-gray-900/40 rounded p-2 text-center">
          <div class="text-xs text-gray-400 mb-0.5">Loot/Min</div>
          <div class="font-mono text-white font-medium">
            {{ formatNumber(build.performance?.loot_per_min || 0) }}
          </div>
        </div>
        
        <!-- Avg Stage -->
        <div class="bg-gray-900/40 rounded p-2 text-center">
          <div class="text-xs text-gray-400 mb-0.5">Avg Stage</div>
          <div class="font-mono text-white font-medium">
            {{ formatNumber(build.performance?.avg_stage || 0) }}
          </div>
        </div>
        
        <!-- Avg Time -->
        <div class="bg-gray-900/40 rounded p-2 text-center">
          <div class="text-xs text-gray-400 mb-0.5">Avg Time</div>
          <div class="font-mono text-white font-medium">
            {{ formatTime(build.performance?.avg_time || 0) }}
          </div>
        </div>
      </div>
      
      <!-- Likes -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-700/50">
        <div class="flex items-center gap-1">
          <IconHeart 
            size="16" 
            :class="build.isLikedByUser ? 'text-red-500 fill-red-500' : 'text-gray-400'" 
          />
          <span class="text-gray-300 text-sm">{{ build.likes || 0 }}</span>
        </div>
        
        <div class="text-xs text-gray-500">
          Klicken für Details
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconHeart } from '@tabler/icons-vue';
import { getHunterById } from '@/constants/hunters';

// Props
const props = defineProps({
  build: { 
    type: Object, 
    required: true 
  }
});

const emit = defineEmits(['click']);

// Hunter-Informationen
const hunter = computed(() => getHunterById(props.build.hunterId));
const hunterColor = computed(() => hunter.value?.color || 'gray');
const hunterIcon = computed(() => hunter.value?.icon || 'IconUser');

// Format-Helper
function formatNumber(value) {
  if (!value && value !== 0) return '—';
  return Intl.NumberFormat('de-DE').format(Math.round(value));
}

function formatTime(seconds) {
  if (!seconds) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Heute';
  } else if (diffDays === 1) {
    return 'Gestern';
  } else if (diffDays < 7) {
    return `Vor ${diffDays} Tagen`;
  } else {
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  }
}
</script>