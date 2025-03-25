<template>
  <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold">
        Short #{{ index + 1 }}
      </h3>
      <div class="flex space-x-2">
        <button 
          @click="$emit('edit', index)" 
          class="p-1 text-gray-400 hover:text-white"
        >
          <IconEdit size="16" />
        </button>
        <button 
          @click="$emit('delete', index)" 
          class="p-1 text-gray-400 hover:text-red-400"
        >
          <IconTrash size="16" />
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-2 text-sm">
      <div class="text-gray-400">Start Date:</div>
      <div>{{ formatDate(short.startDate) }}</div>
      
      <div class="text-gray-400">Duration:</div>
      <div>{{ short.duration }} hours</div>
      
      <div class="text-gray-400">Orbs Required:</div>
      <div>{{ formatNumber(short.orbsRequired) }}</div>
      
      <div class="text-gray-400">Orbs Gained:</div>
      <div :class="getOrbClass(short)">{{ formatNumber(short.orbsGained) }}</div>
    </div>
    
    <div class="mt-4 pt-3 border-t border-gray-700">
      <div class="flex justify-between items-center">
        <div class="text-sm">Status:</div>
        <div :class="getStatusClass(short)">
          {{ getStatusText(short) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconEdit, IconTrash } from '@tabler/icons-vue';

const props = defineProps({
  short: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

// Format date for display
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

// Format large numbers with abbreviations
function formatNumber(number) {
  if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
  if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
  if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
  return number.toFixed(0);
}

// Get class for orb values
function getOrbClass(short) {
  return short.orbsGained >= short.orbsRequired 
    ? 'text-green-400' 
    : 'text-red-400';
}

// Get status text
function getStatusText(short) {
  if (short.orbsGained >= short.orbsRequired) {
    return 'Ready';
  }
  return `${formatNumber(short.orbsRequired - short.orbsGained)} more orbs needed`;
}

// Get status class
function getStatusClass(short) {
  return short.orbsGained >= short.orbsRequired 
    ? 'px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs' 
    : 'px-2 py-1 bg-red-900/50 text-red-400 rounded text-xs';
}
</script>