<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/upgrades/UpgradeHeader.vue -->
<template>
  <div 
    class="flex items-center justify-between"
    :class="{ 'mb-1': !compact }"
  >
    <h3 
      class="font-semibold text-white"
      :class="compact ? 'text-base' : 'text-lg'"
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
          {{ level }}
        </span>

        <span class="text-xs text-gray-400">
          {{ maxLevel !== Infinity ? `/${maxLevel}` : '' }}
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
          {{ level }}
        </span>

        <span class="text-xs text-gray-400">
          {{ maxLevel !== Infinity ? `/${maxLevel}` : '' }}
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
  }
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