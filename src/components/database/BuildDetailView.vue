<template>
  <Teleport to="body">
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 overflow-auto bg-gray-900/80 flex items-center justify-center p-4"
      @click="$emit('close')"
    >
      <div 
        class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in border border-gray-700"
        @click.stop
      >
        <!-- Header -->
        <div :class="`bg-gradient-to-r from-${hunterColor}-900/80 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center`">
          <div class="flex items-center gap-3">
            <div 
              class="rounded-full p-2 flex items-center justify-center"
              :class="`bg-${hunterColor}-900/60 text-${hunterColor}-400`"
            >
              <component :is="hunterIcon" size="24" />
            </div>
            <h3 class="text-xl font-bold text-white">
              {{ build.name }}
            </h3>
          </div>
          <button 
            @click="$emit('close')"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="18" class="text-white" />
          </button>
        </div>
        
        <!-- Build Content -->
        <div class="p-5 max-h-[80vh] overflow-y-auto">
          <!-- Author and Meta -->
          <div class="flex flex-wrap justify-between items-center mb-4 pb-3 border-b border-gray-700">
            <div class="flex flex-col">
              <div class="text-gray-300 font-medium">
                Created by <span class="text-white">{{ build.uploaderName }}</span>
              </div>
              <div class="text-gray-400 text-sm">
                {{ formatDate(build.uploadTimestamp) }}
              </div>
            </div>
            
            <!-- Actions -->
            <div class="flex gap-2">
              <button 
                @click="$emit('like', build.id)" 
                class="flex items-center gap-1.5 px-3 py-1.5 rounded"
                :class="build.isLikedByUser 
                  ? 'bg-red-600/20 text-red-400' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
              >
                <IconHeart 
                  size="16" 
                  :class="build.isLikedByUser ? 'fill-red-500' : ''" 
                />
                <span>{{ build.likes || 0 }}</span>
              </button>
              
              <button 
                @click="$emit('import', build)"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500"
              >
                <IconCopy size="16" />
                <span>Copy to my builds</span>
              </button>
            </div>
          </div>
          
          <!-- Description -->
          <div v-if="build.description" class="mb-5">
            <h4 class="text-gray-300 font-medium mb-1">Description</h4>
            <div class="bg-gray-700/30 rounded p-3 text-gray-200">
              {{ build.description }}
            </div>
          </div>
          
          <!-- Tags -->
          <div v-if="build.tags && build.tags.length > 0" class="mb-5">
            <h4 class="text-gray-300 font-medium mb-2">Tags</h4>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in build.tags" 
                :key="tag"
                class="inline-block px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- Performance Metrics -->
          <div class="mb-5">
            <h4 class="text-gray-300 font-medium mb-2">Performance</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Loot/Min -->
              <div :class="`bg-gray-700/30 rounded p-3 border-l-4 border-${hunterColor}-500`">
                <div class="text-gray-400 text-sm mb-1">Loot per Minute</div>
                <div class="text-xl font-mono font-medium text-white">
                  {{ formatNumber(build.performance?.loot_per_min || 0) }}
                </div>
              </div>
              
              <!-- Avg Stage -->
              <div :class="`bg-gray-700/30 rounded p-3 border-l-4 border-${hunterColor}-500`">
                <div class="text-gray-400 text-sm mb-1">Average Stage</div>
                <div class="text-xl font-mono font-medium text-white">
                  {{ formatNumber(build.performance?.avg_stage || 0) }}
                </div>
              </div>
              
              <!-- Avg Time -->
              <div :class="`bg-gray-700/30 rounded p-3 border-l-4 border-${hunterColor}-500`">
                <div class="text-gray-400 text-sm mb-1">Average Time</div>
                <div class="text-xl font-mono font-medium text-white">
                  {{ formatTime(build.performance?.avg_time || 0) }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Build Details -->
          <div class="mb-5">
            <h4 class="text-gray-300 font-medium mb-2">Build Details</h4>
            
            <!-- Tabs -->
            <div class="flex border-b border-gray-700 mb-4">
              <button 
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="activeTab = index"
                class="px-4 py-2 -mb-px text-sm font-medium"
                :class="activeTab === index 
                  ? `border-b-2 border-${hunterColor}-500 text-${hunterColor}-400` 
                  : 'text-gray-400 hover:text-gray-300'"
              >
                {{ tab.label }}
              </button>
            </div>
            
            <!-- Tab Content -->
            <div v-if="activeTab === 0" class="build-overview">
              <!-- Talents Overview -->
              <div class="bg-gray-700/30 rounded-lg p-4 mb-4">
                <h5 class="text-white mb-3 font-medium">Talents</h5>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div v-for="(value, key) in buildData.talents" :key="key" class="flex justify-between">
                    <span class="text-gray-300">{{ getTalentLabel(key) }}:</span>
                    <span class="text-white font-mono ml-2">{{ value }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Stats Overview -->
              <div class="bg-gray-700/30 rounded-lg p-4">
                <h5 class="text-white mb-3 font-medium">Attributes</h5>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div v-for="(value, key) in buildData.attributes" :key="key" class="flex justify-between">
                    <span class="text-gray-300">{{ getAttributeLabel(key) }}:</span>
                    <span class="text-white font-mono ml-2">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="activeTab === 1" class="build-code">
              <!-- Build Code -->
              <div class="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{{ JSON.stringify(buildData, null, 2) }}</pre>
              </div>
              <div class="mt-2 flex justify-end">
                <button 
                  @click="copyBuildCode" 
                  class="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center gap-1"
                >
                  <IconCopy size="14" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
            
            <div v-else-if="activeTab === 2 && buildData.results?.stageDistribution" class="stage-distribution">
              <!-- Stage Distribution Chart -->
              <div class="bg-gray-700/30 rounded-lg p-4">
                <StageDistributionChart 
                  :distribution="buildData.results.stageDistribution"
                  :avg-stage="buildData.results.avgStage"
                  :max-stage="buildData.results.maxStage"
                  :min-stage="buildData.results.minStage"
                  :color="hunterColor"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-gray-900 p-4 border-t border-gray-700 flex justify-between items-center">
          <div class="text-gray-400 text-sm">
            Build ID: {{ build.id }}
          </div>
          <button 
            @click="$emit('close')" 
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { IconX, IconHeart, IconCopy } from '@tabler/icons-vue';
import { getHunterById } from '@/constants/hunters';
import StageDistributionChart from '@/components/charts/StageDistributionChart.vue';

const props = defineProps({
  build: { type: Object, required: true },
  show: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'like', 'import']);

const activeTab = ref(0);
const tabs = [
  { label: 'Overview' },
  { label: 'Build Code' },
  { label: 'Distribution' }
];

// Hunter data
const hunterModule = ref(null);

// Load hunter-specific module
onMounted(async () => {
  if (props.build && props.build.hunterId) {
    const hunter = getHunterById(props.build.hunterId);
    
    try {
      // Dynamic import of hunter-specific module
      const module = await hunter.statsModule();
      hunterModule.value = module;
    } catch (error) {
      console.error('Error loading hunter module:', error);
    }
  }
});

// Build data
const buildData = computed(() => props.build.buildData || {});

// Hunter information
const hunter = computed(() => getHunterById(props.build.hunterId));
const hunterColor = computed(() => hunter.value?.color || 'blue');
const hunterIcon = computed(() => hunter.value?.icon || 'IconUser');

// Formatting helpers
function formatNumber(value) {
  if (!value && value !== 0) return '—';
  return Intl.NumberFormat('en-US').format(Math.round(value));
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
  
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTalentLabel(key) {
  if (!hunterModule.value) return key;
  
  // Find talent label in hunter module
  const talent = hunterModule.value.TALENTS?.find(t => t.key === key);
  return talent ? talent.label : key;
}

function getAttributeLabel(key) {
  if (!hunterModule.value) return key;
  
  // Find attribute label in hunter module
  const attribute = hunterModule.value.ATTRIBUTES?.find(a => a.key === key);
  return attribute ? attribute.label : key;
}

function getStatLabel(key) {
  if (!hunterModule.value) return key;
  
  // Find stat label in hunter module
  const stat = hunterModule.value.STATS?.find(s => s.key === key);
  return stat ? stat.label : key;
}

function copyBuildCode() {
  navigator.clipboard.writeText(JSON.stringify(buildData.value, null, 2));
  if (window.toast) window.toast.success('Build code copied to clipboard');
}
</script>