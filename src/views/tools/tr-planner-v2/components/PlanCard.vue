<template>
  <div 
    class="bg-gray-800/80 rounded-lg border border-gray-700 hover:border-gray-600 transition-all"
  >
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <!-- Drag Handle -->
          <div class="drag-handle cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300">
            <IconGripVertical class="w-5 h-5" />
          </div>
          
          <!-- Plan Name -->
          <div>
            <h3 class="font-semibold text-white">{{ plan.name }}</h3>
            <div class="text-xs text-gray-400">
              Created {{ formatDate(plan.createdAt) }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1">
          <button
            @click="$emit('edit', plan.id)"
            class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit Plan"
          >
            <IconEdit class="w-4 h-4" />
          </button>
          <button
            @click="$emit('duplicate', plan.id)"
            class="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-700 rounded-lg transition-colors"
            title="Duplicate Plan"
          >
            <IconCopy class="w-4 h-4" />
          </button>
          <button
            @click="$emit('delete', plan.id)"
            class="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            title="Delete Plan"
          >
            <IconTrash class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Start Date/Time -->
        <div class="bg-gray-900/50 rounded-lg p-3">
          <div class="text-xs text-gray-400 mb-1">Start</div>
          <div class="text-sm font-medium text-white">
            {{ plan.startDate }}
          </div>
          <div class="text-xs text-gray-500">{{ plan.startTime }}</div>
        </div>

        <!-- TR Count -->
        <div class="bg-gray-900/50 rounded-lg p-3">
          <div class="text-xs text-gray-400 mb-1">TR Count</div>
          <div class="text-lg font-bold text-purple-400">
            {{ plan.trCount || 0 }}
          </div>
        </div>

        <!-- Steps Count -->
        <div class="bg-gray-900/50 rounded-lg p-3">
          <div class="text-xs text-gray-400 mb-1">Steps</div>
          <div class="text-lg font-bold text-cyan-400">
            {{ plan.steps?.length || 0 }}
          </div>
        </div>

        <!-- Overrides -->
        <div class="bg-gray-900/50 rounded-lg p-3">
          <div class="text-xs text-gray-400 mb-1">Overrides</div>
          <div class="text-lg font-bold text-orange-400">
            {{ overrideCount }}
          </div>
        </div>
      </div>

      <!-- Steps Preview -->
      <div v-if="plan.steps && plan.steps.length > 0" class="mt-4">
        <div class="text-xs text-gray-400 mb-2">TR Steps</div>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="(step, index) in plan.steps.slice(0, 5)" 
            :key="index"
            class="px-3 py-1 bg-gray-900/50 rounded-full text-xs flex items-center gap-1"
          >
            <span class="text-gray-400">TR{{ index + 1 }}:</span>
            <span class="text-white">{{ step.hoursInTR }}h</span>
            <span v-if="Object.keys(step.targetBoosts || {}).length > 0" class="text-purple-400">
              ({{ Object.keys(step.targetBoosts).length }} targets)
            </span>
          </div>
          <div 
            v-if="plan.steps.length > 5"
            class="px-3 py-1 bg-gray-900/50 rounded-full text-xs text-gray-400"
          >
            +{{ plan.steps.length - 5 }} more
          </div>
        </div>
      </div>

      <!-- Notes Preview -->
      <div v-if="plan.notes" class="mt-3 text-xs text-gray-400 truncate">
        {{ plan.notes }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  IconGripVertical,
  IconEdit,
  IconCopy,
  IconTrash,
} from '@tabler/icons-vue';

const props = defineProps({
  plan: {
    type: Object,
    required: true,
  },
});

defineEmits(['edit', 'duplicate', 'delete']);

const overrideCount = computed(() => {
  const gemOverrides = Object.keys(props.plan.overrides?.gems || {}).length;
  const boostOverrides = Object.keys(props.plan.overrides?.boosts || {}).length;
  return gemOverrides + boostOverrides;
});

function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
</script>
