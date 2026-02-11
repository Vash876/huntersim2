<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/upgrades/UpgradeHeader.vue -->
<template>
  <div 
    class="flex items-center justify-between gap-2"
    :class="{ 'mb-1': !compact }"
  >
    <h3 
      class="font-semibold text-white truncate min-w-0 flex-1 tracking-tight"
      :class="compact ? 'text-base' : 'text-[1.05rem]'"
      :title="name"
    >{{ name }}</h3>
    
    <div v-if="level !== null" class="flex items-center">
      <!-- Level-Badge -->
      <div 
        class="px-3 py-1 rounded-lg flex items-center transition-all duration-300"
        :class="[
          isMaxed ? maxedBadgeClass : badgeBgClass
        ]"
      >
        <span 
          class="font-bold mr-1 transition-colors duration-300"
          :class="[
            compact ? 'text-base' : 'text-lg',
            isMaxed ? maxedTextClass : getTextColorClass
          ]"
        >
          {{ formattedLevel }}
        </span>

        <span 
          class="text-xs transition-colors duration-300"
          :class="isMaxed ? maxedSubTextClass : 'text-gray-500'"
        >
          {{ maxLevel !== Infinity ? `/${formattedMaxLevel}` : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: null
  },
  maxLevel: {
    type: [Number, String],
    default: null
  },
  color: {
    type: String,
    default: 'gray'
  },
  compact: {
    type: Boolean,
    default: false
  },
  step: {
    type: Number,
    default: 1
  },
  isMaxed: {
    type: Boolean,
    default: false
  }
});

function formatLargeNumber(num) {
  if (num === null || num === undefined || num === Infinity) return num;
  if (num >= 1000000) {
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}m` : `${millions.toFixed(1)}m`;
  }
  if (num >= 1000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(1)}k`;
  }
  return num;
}

const formattedLevel = computed(() => {
  if (props.step > 1) {
    return formatLargeNumber(props.level);
  }
  return props.level;
});

const formattedMaxLevel = computed(() => {
  if (props.step > 1) {
    return formatLargeNumber(props.maxLevel);
  }
  return props.maxLevel;
});

// Badge-Hintergrund mit subtiler Farb-Tönung
const badgeBgClass = computed(() => {
  const colorMap = {
    'red': 'bg-red-950/50 border border-red-800/20',
    'green': 'bg-green-950/50 border border-green-800/20',
    'blue': 'bg-blue-950/50 border border-blue-800/20',
    'purple': 'bg-purple-950/50 border border-purple-800/20',
    'yellow': 'bg-yellow-950/50 border border-yellow-800/20',
    'brown': 'bg-amber-950/50 border border-amber-800/20',
    'gray': 'bg-gray-900/70 border border-gray-700/30'
  };
  return colorMap[props.color] || colorMap.gray;
});

const getTextColorClass = computed(() => {
  const colorMap = {
    'red': 'text-red-400',
    'green': 'text-green-400',
    'blue': 'text-blue-400',
    'purple': 'text-purple-400',
    'yellow': 'text-yellow-400',
    'brown': 'text-amber-500',
    'gray': 'text-gray-400'
  };
  return colorMap[props.color] || colorMap.gray;
});

// Maxed-Badge in Hunter-Farbe (heller/kräftiger als normal)
const maxedBadgeClass = computed(() => {
  const colorMap = {
    'red': 'bg-red-900/60 border border-red-500/30',
    'green': 'bg-green-900/60 border border-green-500/30',
    'blue': 'bg-blue-900/60 border border-blue-500/30',
    'purple': 'bg-purple-900/60 border border-purple-500/30',
    'yellow': 'bg-yellow-900/60 border border-yellow-500/30',
    'brown': 'bg-amber-900/60 border border-amber-500/30',
    'gray': 'bg-gray-800/70 border border-gray-500/30'
  };
  return colorMap[props.color] || colorMap.gray;
});

// Maxed-Text heller als normal
const maxedTextClass = computed(() => {
  const colorMap = {
    'red': 'text-red-300',
    'green': 'text-green-300',
    'blue': 'text-blue-300',
    'purple': 'text-purple-300',
    'yellow': 'text-yellow-300',
    'brown': 'text-amber-400',
    'gray': 'text-gray-300'
  };
  return colorMap[props.color] || colorMap.gray;
});

const maxedSubTextClass = computed(() => {
  const colorMap = {
    'red': 'text-red-400/60',
    'green': 'text-green-400/60',
    'blue': 'text-blue-400/60',
    'purple': 'text-purple-400/60',
    'yellow': 'text-yellow-400/60',
    'brown': 'text-amber-500/60',
    'gray': 'text-gray-400/60'
  };
  return colorMap[props.color] || colorMap.gray;
});
</script>