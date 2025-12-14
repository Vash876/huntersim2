<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/upgrades/UpgradeCard.vue -->
<template>
  <div
    class="bg-gray-800/30 p-4 rounded-lg border flex flex-col"
    :class="[
      color === 'red' ? 'border-red-800/50' : '',
      color === 'green' ? 'border-green-800/50' : '',
      color === 'blue' ? 'border-blue-800/50' : '',
      color === 'purple' ? 'border-purple-800/50' : '',
      color === 'yellow' ? 'border-yellow-800/50' : '',
      color === 'brown' ? 'border-brown-800/50' : '',
      (!color || color === 'gray') ? 'border-gray-700' : ''
    ]"
  >
    <!-- Header -->
    <UpgradeHeader
      :name="item.name"
      :level="item.type === 'boolean' ? null : getLevel({ id: item.id })"
      :maxLevel="item.type === 'boolean' ? null : item.maxLevel"
      :color="color"
      :step="item.step || 1"
    />

    <!-- Content Area -->
    <div class="flex-1">
      <slot></slot>
    </div>

    <!-- Controls - Boolean Toggle oder Standard-Steuerung -->
    <div v-if="item.type === 'boolean'" class="flex items-center justify-between mt-auto">
      <span class="text-gray-400 text-sm">
        
      </span>
      
      <!-- Toggle Switch -->
      <button
        @click="toggleBoolean({ id: item.id })"
        class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
        :class="{
          'bg-red-600': getLevel({ id: item.id }) > 0 && color === 'red',
          'bg-green-600': getLevel({ id: item.id }) > 0 && color === 'green',
          'bg-blue-600': getLevel({ id: item.id }) > 0 && color === 'blue',
          'bg-purple-600': getLevel({ id: item.id }) > 0 && color === 'purple',
          'bg-yellow-600': getLevel({ id: item.id }) > 0 && color === 'yellow',
          'bg-gray-600': getLevel({ id: item.id }) <= 0
        }"
      >
        <span
          class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
          :class="{
            'translate-x-6': getLevel({ id: item.id }) > 0,
            'translate-x-1': getLevel({ id: item.id }) <= 0
          }"
        ></span>
      </button>
    </div>

    <!-- Standard-Controls für Level-Upgrades -->
    <div v-else class="flex items-center justify-between mt-auto">
      <!-- Fast Decrease (-10) -->
      <button
        class="flex justify-center items-center p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors mr-1.5"
        :class="{
          'opacity-20 cursor-not-allowed hover:bg-gray-900': getLevel({ id: item.id }) <= 0
        }"
        style="min-width: 2.5rem;"
        @mousedown="$event => handleStart($event, decrementFast, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
        @mouseup="$event => handleEnd($event, { id: item.id })"
        @mouseleave="$event => handleEnd($event, { id: item.id })"
        @touchstart.prevent="$event => handleStart($event, decrementFast, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
        @touchend.prevent="$event => handleEnd($event, { id: item.id })"
        @touchcancel.prevent="$event => handleEnd($event, { id: item.id })"
        @touchmove="$event => handleTouchMove($event, { id: item.id })"
        :disabled="getLevel({ id: item.id }) <= 0"
      >
        <div class="flex">
          <IconChevronLeft size="18" />
          <IconChevronLeft size="18" class="-ml-2" />
        </div>
      </button>

      <!-- Normal Decrease (-1) -->
      <button
        class="flex justify-center items-center p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors mr-1.5"
        :class="{
          'opacity-20 cursor-not-allowed hover:bg-gray-900': getLevel({ id: item.id }) <= 0
        }"
        style="min-width: 2.5rem;"
        @mousedown="$event => handleStart($event, decrement, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
        @mouseup="$event => handleEnd($event, { id: item.id })"
        @mouseleave="$event => handleEnd($event, { id: item.id })"
        @touchstart.prevent="$event => handleStart($event, decrement, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
        @touchend.prevent="$event => handleEnd($event, { id: item.id })"
        @touchcancel.prevent="$event => handleEnd($event, { id: item.id })"
        @touchmove="$event => handleTouchMove($event, { id: item.id })"
        :disabled="getLevel({ id: item.id }) <= 0"
      >
        <IconChevronLeft size="18" />
      </button>

      <!-- Progress Bar -->
      <ProgressBar 
        :value="getLevel({ id: item.id }) || 0" 
        :maxValue="item.maxLevel === Infinity ? 1000 : item.maxLevel"
        :color="color || 'blue'"
        class="flex-1 mx-1.5 h-5"
      />

      <!-- Normal Increase (+1) -->
      <button
        class="flex justify-center items-center p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors ml-1.5"
        :class="{
          'opacity-20 cursor-not-allowed hover:bg-gray-900': isMaxReached
        }"
        style="min-width: 2.5rem;"
        @mousedown="$event => handleStart($event, increment, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
        @mouseup="$event => handleEnd($event, { id: item.id })"
        @mouseleave="$event => handleEnd($event, { id: item.id })"
        @touchstart.prevent="$event => handleStart($event, increment, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
        @touchend.prevent="$event => handleEnd($event, { id: item.id })"
        @touchcancel.prevent="$event => handleEnd($event, { id: item.id })"
        @touchmove="$event => handleTouchMove($event, { id: item.id })"
        :disabled="isMaxReached"
      >
        <IconChevronRight size="18" />
      </button>

      <!-- Fast Increase (+10) -->
      <button
        class="flex justify-center items-center p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors ml-1.5"
        :class="{
          'opacity-20 cursor-not-allowed hover:bg-gray-900': isMaxReached
        }"
        style="min-width: 2.5rem;"
        @mousedown="$event => handleStart($event, incrementFast, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
        @mouseup="$event => handleEnd($event, { id: item.id })"
        @mouseleave="$event => handleEnd($event, { id: item.id })"
        @touchstart.prevent="$event => handleStart($event, incrementFast, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
        @touchend.prevent="$event => handleEnd($event, { id: item.id })"
        @touchcancel.prevent="$event => handleEnd($event, { id: item.id })"
        @touchmove="$event => handleTouchMove($event, { id: item.id })"
        :disabled="isMaxReached"
      >
        <div class="flex">
          <IconChevronRight size="18" />
          <IconChevronRight size="18" class="-ml-2" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';
import UpgradeHeader from './UpgradeHeader.vue';
import ProgressBar from '../common/ProgressBar.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  getLevel: {
    type: Function,
    required: true
  },
  // Optional für Boolean-Typen
  toggleBoolean: {
    type: Function,
    default: null
  },
  // Erforderlich für Level-Typen
  handleStart: {
    type: Function,
    default: () => {}
  },
  handleEnd: {
    type: Function,
    default: () => {}
  },
  handleTouchMove: {
    type: Function,
    default: () => {}
  },
  increment: {
    type: Function,
    default: () => {}
  },
  decrement: {
    type: Function,
    default: () => {}
  },
  incrementFast: {
    type: Function,
    default: () => {}
  },
  decrementFast: {
    type: Function,
    default: () => {}
  }
});

// Berechneter Wert für maximalen Wert erreicht
const isMaxReached = computed(() => {
  if (props.item.type === 'boolean') return false;
  
  const currentLevel = props.getLevel({ id: props.item.id });
  return props.item.maxLevel !== undefined && currentLevel >= props.item.maxLevel;
});
</script>