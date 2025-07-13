<template>
  <div class="tracking-card bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-200 group">
    <!-- Header -->
    <div class="p-4 border-b border-gray-700 bg-gradient-to-r from-green-900/20 to-blue-900/20">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center mr-3">
            <IconChartLine size="20" class="text-green-400" />
          </div>
          <div>
            <h3 class="font-semibold text-white group-hover:text-green-400 transition-colors">
              {{ plan.name }}
            </h3>
            <p class="text-xs text-gray-400">
              Reset #{{ plan.resetNumber }} • {{ formatDate(plan.startDate) }}
            </p>
          </div>
        </div>
        
        <!-- Status Badge -->
        <div class="flex items-center">
          <span 
            class="px-2 py-1 text-xs font-medium rounded-full"
            :class="statusClasses"
          >
            {{ plan.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="p-4">
      <!-- Duration & Progress -->
      <div class="flex items-center justify-between mb-4">
        <div class="text-center">
          <div class="text-lg font-bold text-white">{{ plan.daysActive || 0 }}</div>
          <div class="text-xs text-gray-400">Days Active</div>
        </div>
        
        <div class="text-center">
          <div class="text-lg font-bold text-green-400">{{ plan.entriesCount || 0 }}</div>
          <div class="text-xs text-gray-400">Entries</div>
        </div>
        
        <div class="text-center">
          <div class="text-lg font-bold text-blue-400">{{ plan.goalsAchieved || 0 }}/{{ plan.totalGoals || 0 }}</div>
          <div class="text-xs text-gray-400">Goals</div>
        </div>
      </div>

      <!-- Key Resources Progress -->
      <div class="space-y-3 mb-4">
        <!-- Cells Progress -->
        <div v-if="plan.resources?.cells" class="progress-item">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-gray-400">Cells</span>
            <span class="text-white">{{ formatNumber(plan.resources.cells.current) }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: getCellsProgress() + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>{{ formatNumber(plan.resources.cells.start || 0) }}</span>
            <span>Goal: {{ formatNumber(plan.goals?.cells || 0) }}</span>
          </div>
        </div>

        <!-- MP Progress -->
        <div v-if="plan.resources?.mp" class="progress-item">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-gray-400">MP</span>
            <span class="text-white">{{ formatNumber(plan.resources.mp.current) }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-purple-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: getMPProgress() + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>{{ formatNumber(plan.resources.mp.start || 0) }}</span>
            <span>Goal: {{ formatNumber(plan.goals?.mp || 0) }}</span>
          </div>
        </div>

        <!-- Shards Progress -->
        <div v-if="plan.resources?.shards" class="progress-item">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-gray-400">Shards</span>
            <span class="text-white">{{ formatNumber(plan.resources.shards.current) }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: getShardsProgress() + '%' }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>{{ formatNumber(plan.resources.shards.start || 0) }}</span>
            <span>Goal: {{ formatNumber(plan.goals?.shards || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Last Update -->
      <div class="text-xs text-gray-500 mb-4">
        Last updated: {{ formatRelativeTime(plan.lastUpdate) }}
      </div>
    </div>

    <!-- Actions -->
    <div class="px-4 py-3 bg-gray-850 border-t border-gray-700 flex items-center justify-between">
      <!-- Primary Actions -->
      <div class="flex items-center gap-2">
        <button
          @click="$emit('view', plan.id)"
          class="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
        >
          <IconEye size="14" class="mr-1" />
          View
        </button>
        
        <button
          @click="addEntry"
          :disabled="plan.status === 'completed'"
          class="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
        >
          <IconPlus size="14" class="mr-1" />
          Entry
        </button>
      </div>

      <!-- Secondary Actions -->
      <div class="flex items-center gap-1">
        <button
          @click="$emit('edit', plan.id)"
          class="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          title="Edit Plan"
        >
          <IconEdit size="16" />
        </button>
        
        <button
          @click="toggleStatus"
          class="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          :title="plan.status === 'active' ? 'Complete Plan' : 'Reactivate Plan'"
        >
          <IconCheck v-if="plan.status === 'active'" size="16" />
          <IconRefresh v-else size="16" />
        </button>
        
        <button
          @click="$emit('delete', plan.id)"
          class="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
          title="Delete Plan"
        >
          <IconTrash size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  IconChartLine, 
  IconEye, 
  IconPlus, 
  IconEdit, 
  IconCheck, 
  IconRefresh, 
  IconTrash 
} from '@tabler/icons-vue';

// Props
const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['view', 'edit', 'delete', 'addEntry', 'toggleStatus']);

// Computed
const statusClasses = computed(() => {
  switch (props.plan.status) {
    case 'active':
      return 'bg-green-900/30 text-green-400 border border-green-500/30';
    case 'completed':
      return 'bg-blue-900/30 text-blue-400 border border-blue-500/30';
    case 'paused':
      return 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30';
    default:
      return 'bg-gray-900/30 text-gray-400 border border-gray-500/30';
  }
});

// Methods
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatRelativeTime(date) {
  if (!date) return 'Never';
  const now = new Date();
  const diff = now - new Date(date);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
}

function getCellsProgress() {
  const { cells } = props.plan.resources || {};
  const goal = props.plan.goals?.cells || 0;
  if (!cells || !goal) return 0;
  
  const progress = ((cells.current - (cells.start || 0)) / (goal - (cells.start || 0))) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

function getMPProgress() {
  const { mp } = props.plan.resources || {};
  const goal = props.plan.goals?.mp || 0;
  if (!mp || !goal) return 0;
  
  const progress = ((mp.current - (mp.start || 0)) / (goal - (mp.start || 0))) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

function getShardsProgress() {
  const { shards } = props.plan.resources || {};
  const goal = props.plan.goals?.shards || 0;
  if (!shards || !goal) return 0;
  
  const progress = ((shards.current - (shards.start || 0)) / (goal - (shards.start || 0))) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

function addEntry() {
  console.log('TRTrackingCard: addEntry clicked for plan:', props.plan.id);
  emit('addEntry', props.plan.id);
}

function toggleStatus() {
  console.log('TRTrackingCard: toggleStatus clicked for plan:', props.plan.id);
  emit('toggleStatus', props.plan.id);
}

function viewPlan() {
  console.log('TRTrackingCard: view clicked for plan:', props.plan.id);
  emit('view', props.plan.id);
}

function editPlan() {
  console.log('TRTrackingCard: edit clicked for plan:', props.plan.id);
  emit('edit', props.plan.id);
}

function deletePlan() {
  console.log('TRTrackingCard: delete clicked for plan:', props.plan.id);
  emit('delete', props.plan.id);
}
</script>

<style scoped>
.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
}

.progress-item {
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

.tracking-card:hover .progress-item {
  opacity: 1;
}
</style>