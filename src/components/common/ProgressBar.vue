<template>
  <div 
    class="w-full bg-gray-800 rounded overflow-hidden relative" 
    :class="[sizeClass, borderColorClass]"
  >
    <div
      class="h-full transition-all duration-300"
      :class="colorClass"
      :style="{ width: `${getProgressPercentage}%` }"
    ></div>
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

// Verbesserte Logik für effectiveMaxValue
const effectiveMaxValue = computed(() => {
  // Wenn maxValue Infinity ist, verwende 1000 als Default
  if (props.maxValue === Infinity) {
    return 1000;
  }
  
  // Überprüfe, ob maxValue definiert, eine Zahl und größer als 0 ist
  if (props.maxValue !== null && 
      props.maxValue !== undefined && 
      !isNaN(props.maxValue) && 
      props.maxValue > 0) {
    return props.maxValue;
  }
  
  // Ansonsten auch Default von 1000 verwenden
  return 1000;
});

// Berechnung des Fortschritts in Prozent
const getProgressPercentage = computed(() => {
  return Math.min(100, (props.value / effectiveMaxValue.value) * 100);
});

const colorClass = computed(() => {
  switch (props.color) {
    case 'red': return 'bg-red-500';
    case 'green': return 'bg-green-500';
    case 'yellow': return 'bg-yellow-500';
    case 'purple': return 'bg-purple-500';
    case 'brown': return 'bg-yellow-700';
    default: return 'bg-blue-500';
  }
});

// Border-Farbe berechnen
const borderColorClass = computed(() => {
  switch (props.color) {
    case 'red': return 'border border-red-500/30';
    case 'green': return 'border border-green-500/30';
    case 'yellow': return 'border border-yellow-500/30';
    case 'purple': return 'border border-purple-500/30';
    case 'brown': return 'border border-yellow-700/30';
    default: return 'border border-blue-500/30';
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
/* Sicherstellen, dass Border die Größe nicht verändert */
.border {
  box-sizing: border-box;
}
</style>