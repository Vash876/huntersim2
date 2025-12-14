<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/upgrades/UpgradeHeader.vue -->
<template>
  <div 
    class="flex items-center justify-between gap-2"
    :class="{ 'mb-1': !compact }"
  >
    <h3 
      class="font-semibold text-white truncate min-w-0 flex-1"
      :class="compact ? 'text-base' : 'text-lg'"
      :title="name"
    >{{ name }}</h3>
    
    <div v-if="level !== null" class="flex items-center">
      <!-- Normale Anzeige für reguläre Upgrades -->
      <div 
        v-if="!compact"
        class="bg-gray-900/70 px-3 py-1 rounded-md flex items-center"
      >
        <span 
          class="text-lg font-semibold mr-1"
          :class="getTextColorClass"
        >
          {{ formattedLevel }}
        </span>

        <span class="text-xs text-gray-400">
          {{ maxLevel !== Infinity ? `/${formattedMaxLevel}` : '' }}
        </span>
      </div>
      
      <!-- Kompakte Anzeige für Gems -->
      <div 
        v-else
        class="bg-gray-900/70 px-3 py-1 rounded-md flex items-center"
      >
        <span 
          class="font-semibold mr-0.5"
          :class="[getTextColorClass, 'text-base']"
        >
          {{ formattedLevel }}
        </span>

        <span class="text-xs text-gray-400">
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
  }
});

// Formatiere große Zahlen (z.B. 1500000 -> 1.5M, 300000 -> 300K)
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

// Formatierte Anzeige für level und maxLevel
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

// Berechne die Textfarben-Klasse basierend auf der Farbe
const getTextColorClass = computed(() => {
  const colorMap = {
    'red': 'text-red-400',
    'green': 'text-green-400',
    'blue': 'text-blue-400',
    'purple': 'text-purple-400',
    'yellow': 'text-yellow-400',
    'brown': 'text-amber-500',
    // Fallback für andere Farben
    'gray': 'text-gray-400'
  };
  
  return colorMap[props.color] || colorMap.gray;
});
</script>