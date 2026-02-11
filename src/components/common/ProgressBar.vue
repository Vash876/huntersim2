<template>
  <div 
    class="w-full rounded-full overflow-hidden relative" 
    :class="[sizeClass, borderColorClass, {'progress-bar--maxed': isMaxedComputed}]"
  >
    <!-- Background with subtle inner shadow -->
    <div class="absolute inset-0 bg-gray-800/90 rounded-full"></div>
    
    <!-- Progress fill with gradient -->
    <div
      class="h-full relative rounded-full transition-all duration-300 overflow-hidden"
      :class="[gradientClass, {'progress-fill--maxed': isMaxedComputed}]"
      :style="{ width: `${getProgressPercentage}%` }"
    >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  maxValue: {
    type: [Number, null, undefined],
    default: null
  },
  color: {
    type: String,
    default: 'blue'
  },
  size: {
    type: String,
    default: 'medium'
  }
});

const effectiveMaxValue = computed(() => {
  if (props.maxValue === Infinity) return 1000;
  if (props.maxValue !== null && 
      props.maxValue !== undefined && 
      !isNaN(props.maxValue) && 
      props.maxValue > 0) {
    return props.maxValue;
  }
  return 1000;
});

const isMaxedComputed = computed(() => {
  return props.value >= effectiveMaxValue.value;
});

const getProgressPercentage = computed(() => {
  return Math.min(100, (props.value / effectiveMaxValue.value) * 100);
});

// Gradient-Füllung statt flacher Farbe
const gradientClass = computed(() => {
  switch (props.color) {
    case 'red': return 'bg-gradient-to-r from-red-700 via-red-500 to-red-400';
    case 'green': return 'bg-gradient-to-r from-green-800 via-green-600 to-green-300';
    case 'yellow': return 'bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-400';
    case 'purple': return 'bg-gradient-to-r from-purple-700 via-purple-500 to-purple-400';
    case 'gray': return 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400';
    case 'orange': return 'bg-gradient-to-r from-orange-700 via-orange-500 to-orange-400';
    case 'brown': return 'bg-gradient-to-r from-yellow-800 via-yellow-700 to-amber-500';
    default: return 'bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400';
  }
});

const borderColorClass = computed(() => {
  switch (props.color) {
    case 'red': return 'border border-red-500/20';
    case 'green': return 'border border-green-500/20';
    case 'yellow': return 'border border-yellow-500/20';
    case 'purple': return 'border border-purple-500/20';
    case 'gray': return 'border border-gray-500/20';
    case 'orange': return 'border border-orange-500/20';
    case 'brown': return 'border border-yellow-700/20';
    default: return 'border border-blue-500/20';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small': return 'h-1.5';
    case 'large': return 'h-3';
    default: return 'h-2';
  }
});
</script>

<style scoped>
.border {
  box-sizing: border-box;
}

/* Maxed: deutlich sichtbar */
.progress-bar--maxed {
  box-shadow: 0 0 8px -1px rgba(255, 255, 255, 0.15);
}

.progress-fill--maxed {
  filter: brightness(2.8) saturate(1.1);
}
</style>