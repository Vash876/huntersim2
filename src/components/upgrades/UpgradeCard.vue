<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/upgrades/UpgradeCard.vue -->
<template>
  <div
    class="upgrade-card group relative flex flex-col rounded-xl overflow-hidden transition-[shadow,border-color] duration-300 hover:border-white/[0.08]"
    :class="[
      cardBgClass,
      isMaxReached ? maxedClass : glowClass
    ]"
  >
    <!-- Farbiger Top-Akzent-Streifen -->
    <div 
      class="absolute top-0 left-0 right-0 h-[2px]"
      :class="accentBarClass"
    ></div>

    <!-- Subtiler Gradient-Overlay für Depth -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-br from-white via-transparent to-transparent"></div>

    <!-- Card Content -->
    <div class="relative p-4 flex flex-col flex-1">
      <!-- Header -->
      <UpgradeHeader
        :name="item.name"
        :level="item.type === 'boolean' ? null : getLevel({ id: item.id })"
        :maxLevel="item.type === 'boolean' ? null : item.maxLevel"
        :color="color"
        :step="item.step || 1"
        :isMaxed="isMaxReached"
      />

      <!-- Content Area -->
      <div class="flex-1">
        <slot></slot>
      </div>

      <!-- Controls - Boolean Toggle oder Standard-Steuerung -->
      <div v-if="item.type === 'boolean'" class="flex items-center justify-between mt-auto pt-2">
        <span class="text-gray-400 text-sm"></span>
        
        <!-- Toggle Switch -->
        <button
          @click="toggleBoolean({ id: item.id })"
          class="relative inline-flex h-5 w-11 items-center rounded-full transition-all duration-300 focus:outline-none"
          :class="[
            getLevel({ id: item.id }) > 0 ? toggleActiveClass : 'bg-gray-700/60 border border-gray-600/40'
          ]"
        >
          <!-- Glow hinter dem Knob wenn aktiv -->
          <span
            v-if="getLevel({ id: item.id }) > 0"
            class="absolute h-3 w-3 rounded-full transition-all duration-300 blur-[5px] translate-x-[1.45rem]"
            :class="toggleGlowClass"
          ></span>
          <!-- Knob -->
          <span
            class="relative inline-block h-3.5 w-3.5 transform rounded-full transition-all duration-300"
            :class="[
              getLevel({ id: item.id }) > 0 
                ? 'translate-x-[1.4rem] bg-white shadow-md' 
                : 'translate-x-1 bg-gray-500 shadow-sm'
            ]"
          ></span>
        </button>
      </div>

      <!-- Standard-Controls für Level-Upgrades -->
      <div v-else class="flex items-center justify-between mt-auto pt-2 gap-1.5">
        <!-- Fast Decrease (-10) -->
        <button
          class="ctrl-btn"
          :class="[ctrlBtnColor, { 'ctrl-btn--disabled': getLevel({ id: item.id }) <= 0 }]"
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
            <IconChevronLeft size="16" />
            <IconChevronLeft size="16" class="-ml-2.5" />
          </div>
        </button>

        <!-- Normal Decrease (-1) -->
        <button
          class="ctrl-btn"
          :class="[ctrlBtnColor, { 'ctrl-btn--disabled': getLevel({ id: item.id }) <= 0 }]"
          @mousedown="$event => handleStart($event, decrement, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
          @mouseup="$event => handleEnd($event, { id: item.id })"
          @mouseleave="$event => handleEnd($event, { id: item.id })"
          @touchstart.prevent="$event => handleStart($event, decrement, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
          @touchend.prevent="$event => handleEnd($event, { id: item.id })"
          @touchcancel.prevent="$event => handleEnd($event, { id: item.id })"
          @touchmove="$event => handleTouchMove($event, { id: item.id })"
          :disabled="getLevel({ id: item.id }) <= 0"
        >
          <IconChevronLeft size="16" />
        </button>

        <!-- Progress Bar -->
        <ProgressBar 
          :value="getLevel({ id: item.id }) || 0" 
          :maxValue="item.maxLevel === Infinity ? 1000 : item.maxLevel"
          :color="color || 'blue'"
          class="flex-1 h-5"
        />

        <!-- Normal Increase (+1) -->
        <button
          class="ctrl-btn"
          :class="[ctrlBtnColor, { 'ctrl-btn--disabled': isMaxReached }]"
          @mousedown="$event => handleStart($event, increment, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
          @mouseup="$event => handleEnd($event, { id: item.id })"
          @mouseleave="$event => handleEnd($event, { id: item.id })"
          @touchstart.prevent="$event => handleStart($event, increment, { id: item.id, maxLevel: item.maxLevel, step: item.step })"
          @touchend.prevent="$event => handleEnd($event, { id: item.id })"
          @touchcancel.prevent="$event => handleEnd($event, { id: item.id })"
          @touchmove="$event => handleTouchMove($event, { id: item.id })"
          :disabled="isMaxReached"
        >
          <IconChevronRight size="16" />
        </button>

        <!-- Fast Increase (+10) -->
        <button
          class="ctrl-btn"
          :class="[ctrlBtnColor, { 'ctrl-btn--disabled': isMaxReached }]"
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
            <IconChevronRight size="16" />
            <IconChevronRight size="16" class="-ml-2.5" />
          </div>
        </button>
      </div>
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
  toggleBoolean: {
    type: Function,
    default: null
  },
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

// Card background mit subtiler Farb-Tönung
const cardBgClass = computed(() => {
  const c = props.color;
  const base = 'border border-gray-700/50 backdrop-blur-sm';
  const colorMap = {
    'red': `${base} bg-gradient-to-br from-red-950/40 via-gray-800/60 to-gray-900/80 border-red-800/30`,
    'green': `${base} bg-gradient-to-br from-green-950/40 via-gray-800/60 to-gray-900/80 border-green-800/30`,
    'blue': `${base} bg-gradient-to-br from-blue-950/40 via-gray-800/60 to-gray-900/80 border-blue-800/30`,
    'purple': `${base} bg-gradient-to-br from-purple-950/40 via-gray-800/60 to-gray-900/80 border-purple-800/30`,
    'yellow': `${base} bg-gradient-to-br from-yellow-950/40 via-gray-800/60 to-gray-900/80 border-yellow-800/30`,
    'brown': `${base} bg-gradient-to-br from-amber-950/40 via-gray-800/60 to-gray-900/80 border-amber-800/30`,
    'gray': `${base} bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 border-gray-600/30`,
  };
  return colorMap[c] || colorMap.gray;
});

// Top-Akzent-Streifen
const accentBarClass = computed(() => {
  const colorMap = {
    'red': 'bg-gradient-to-r from-transparent via-red-500 to-transparent',
    'green': 'bg-gradient-to-r from-transparent via-green-500 to-transparent',
    'blue': 'bg-gradient-to-r from-transparent via-blue-500 to-transparent',
    'purple': 'bg-gradient-to-r from-transparent via-purple-500 to-transparent',
    'yellow': 'bg-gradient-to-r from-transparent via-yellow-500 to-transparent',
    'brown': 'bg-gradient-to-r from-transparent via-amber-500 to-transparent',
    'gray': 'bg-gradient-to-r from-transparent via-gray-500 to-transparent',
  };
  return colorMap[props.color] || colorMap.gray;
});

// Hover-Glow basierend auf Farbe (ohne Translate)
const glowClass = computed(() => {
  const colorMap = {
    'red': 'hover:shadow-md hover:shadow-red-900/20',
    'green': 'hover:shadow-md hover:shadow-green-900/20',
    'blue': 'hover:shadow-md hover:shadow-blue-900/20',
    'purple': 'hover:shadow-md hover:shadow-purple-900/20',
    'yellow': 'hover:shadow-md hover:shadow-yellow-900/20',
    'brown': 'hover:shadow-md hover:shadow-amber-900/20',
    'gray': 'hover:shadow-md hover:shadow-gray-700/20',
  };
  return colorMap[props.color] || colorMap.gray;
});

// Maxed-Klasse in Hunter-Farbe
const maxedClass = computed(() => {
  const colorMap = {
    'red': 'upgrade-card--maxed-red',
    'green': 'upgrade-card--maxed-green',
    'blue': 'upgrade-card--maxed-blue',
    'purple': 'upgrade-card--maxed-purple',
    'yellow': 'upgrade-card--maxed-yellow',
    'brown': 'upgrade-card--maxed-amber',
    'gray': 'upgrade-card--maxed-gray',
  };
  return colorMap[props.color] || colorMap.gray;
});

// Control-Button Farbe
const ctrlBtnColor = computed(() => {
  const colorMap = {
    'red': 'ctrl-btn--red',
    'green': 'ctrl-btn--green',
    'blue': 'ctrl-btn--blue',
    'purple': 'ctrl-btn--purple',
    'yellow': 'ctrl-btn--yellow',
    'brown': 'ctrl-btn--amber',
    'gray': 'ctrl-btn--gray',
  };
  return colorMap[props.color] || colorMap.gray;
});

// Toggle-Button aktive Farbe
const toggleActiveClass = computed(() => {
  const colorMap = {
    'red': 'bg-gradient-to-r from-red-700 to-red-500 border border-red-400/30 shadow-sm shadow-red-500/25',
    'green': 'bg-gradient-to-r from-green-700 to-green-500 border border-green-400/30 shadow-sm shadow-green-500/25',
    'blue': 'bg-gradient-to-r from-blue-700 to-blue-500 border border-blue-400/30 shadow-sm shadow-blue-500/25',
    'purple': 'bg-gradient-to-r from-purple-700 to-purple-500 border border-purple-400/30 shadow-sm shadow-purple-500/25',
    'yellow': 'bg-gradient-to-r from-yellow-700 to-yellow-500 border border-yellow-400/30 shadow-sm shadow-yellow-500/25',
    'brown': 'bg-gradient-to-r from-amber-700 to-amber-500 border border-amber-400/30 shadow-sm shadow-amber-500/25',
    'gray': 'bg-gradient-to-r from-gray-600 to-gray-500 border border-gray-400/30 shadow-sm shadow-gray-500/25',
  };
  return colorMap[props.color] || colorMap.gray;
});

// Toggle Glow hinter dem Knob
const toggleGlowClass = computed(() => {
  const colorMap = {
    'red': 'bg-red-400',
    'green': 'bg-green-400',
    'blue': 'bg-blue-400',
    'purple': 'bg-purple-400',
    'yellow': 'bg-yellow-400',
    'brown': 'bg-amber-400',
    'gray': 'bg-gray-400',
  };
  return colorMap[props.color] || colorMap.gray;
});
</script>

<style scoped>
/* Maxed-Zustand in Hunter-Farbe */
.upgrade-card--maxed-red {
  border-color: rgba(239, 68, 68, 0.35) !important;
  box-shadow: 0 0 16px -4px rgba(239, 68, 68, 0.15);
}
.upgrade-card--maxed-green {
  border-color: rgba(34, 197, 94, 0.35) !important;
  box-shadow: 0 0 16px -4px rgba(34, 197, 94, 0.15);
}
.upgrade-card--maxed-blue {
  border-color: rgba(59, 130, 246, 0.35) !important;
  box-shadow: 0 0 16px -4px rgba(59, 130, 246, 0.15);
}
.upgrade-card--maxed-purple {
  border-color: rgba(168, 85, 247, 0.35) !important;
  box-shadow: 0 0 16px -4px rgba(168, 85, 247, 0.15);
}
.upgrade-card--maxed-yellow {
  border-color: rgba(234, 179, 8, 0.35) !important;
  box-shadow: 0 0 16px -4px rgba(234, 179, 8, 0.15);
}
.upgrade-card--maxed-amber {
  border-color: rgba(245, 158, 11, 0.35) !important;
  box-shadow: 0 0 16px -4px rgba(245, 158, 11, 0.15);
}
.upgrade-card--maxed-gray {
  border-color: rgba(156, 163, 175, 0.35) !important;
  box-shadow: 0 0 16px -4px rgba(156, 163, 175, 0.1);
}

/* Control Buttons */
.ctrl-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4rem 0.5rem;
  min-width: 2.2rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  color: rgba(209, 213, 219, 0.8);
}

.ctrl-btn:hover:not(.ctrl-btn--disabled) {
  transform: scale(1.05);
}

.ctrl-btn:active:not(.ctrl-btn--disabled) {
  transform: scale(0.95);
}

.ctrl-btn--disabled {
  opacity: 0.15;
  cursor: not-allowed;
  pointer-events: none;
}

/* Farbvarianten für Buttons */
.ctrl-btn--red:hover:not(.ctrl-btn--disabled) {
  background: rgba(127, 29, 29, 0.5);
  border-color: rgba(239, 68, 68, 0.3);
  color: rgb(252, 165, 165);
}
.ctrl-btn--green:hover:not(.ctrl-btn--disabled) {
  background: rgba(20, 83, 45, 0.5);
  border-color: rgba(34, 197, 94, 0.3);
  color: rgb(134, 239, 172);
}
.ctrl-btn--blue:hover:not(.ctrl-btn--disabled) {
  background: rgba(30, 58, 138, 0.5);
  border-color: rgba(59, 130, 246, 0.3);
  color: rgb(147, 197, 253);
}
.ctrl-btn--purple:hover:not(.ctrl-btn--disabled) {
  background: rgba(88, 28, 135, 0.5);
  border-color: rgba(168, 85, 247, 0.3);
  color: rgb(196, 181, 253);
}
.ctrl-btn--yellow:hover:not(.ctrl-btn--disabled) {
  background: rgba(113, 63, 18, 0.5);
  border-color: rgba(234, 179, 8, 0.3);
  color: rgb(253, 224, 71);
}
.ctrl-btn--amber:hover:not(.ctrl-btn--disabled) {
  background: rgba(120, 53, 15, 0.5);
  border-color: rgba(245, 158, 11, 0.3);
  color: rgb(252, 211, 77);
}
.ctrl-btn--gray:hover:not(.ctrl-btn--disabled) {
  background: rgba(55, 65, 81, 0.7);
  border-color: rgba(156, 163, 175, 0.3);
  color: rgb(209, 213, 219);
}
</style>