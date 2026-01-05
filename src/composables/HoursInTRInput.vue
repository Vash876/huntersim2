<template>
  <div class="flex items-center gap-1">
    <!-- Hours Input -->
    <div class="flex items-center">
      <input
        ref="hoursInput"
        type="number"
        :value="displayHours"
        @input="onHoursInput"
        @blur="onBlur"
        @focus="selectAll"
        @click="selectAll"
        min="0"
        max="9999"
        :class="[
          'w-10 text-center bg-gray-700 border border-gray-600 rounded-l px-1 py-1 text-white focus:outline-none focus:ring-1',
          focusRingClass
        ]"
        :style="{ fontSize: fontSize }"
      />
      <span class="bg-gray-600 border border-l-0 border-gray-600 px-1 py-1 text-gray-300 rounded-r" :style="{ fontSize: fontSize }">h</span>
    </div>

    <!-- Separator -->
    <span class="text-gray-400 px-0.5" :style="{ fontSize: fontSize }">:</span>

    <!-- Minutes Input -->
    <div class="flex items-center">
      <input
        ref="minutesInput"
        type="number"
        :value="displayMinutes"
        @input="onMinutesInput"
        @blur="onBlur"
        @focus="selectAll"
        @click="selectAll"
        min="0"
        max="59"
        :class="[
          'w-8 text-center bg-gray-700 border border-gray-600 rounded-l px-1 py-1 text-white focus:outline-none focus:ring-1',
          focusRingClass
        ]"
        :style="{ fontSize: fontSize }"
      />
      <span class="bg-gray-600 border border-l-0 border-gray-600 px-1 py-1 text-gray-300 rounded-r" :style="{ fontSize: fontSize }">m</span>
    </div>

    <!-- Live Indicator (optional) -->
    <div v-if="showLiveIndicator && isLive" class="ml-1 flex items-center gap-1" :title="liveTooltip">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span v-if="showLiveLabel" class="text-green-400 text-xs">Live</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  // Total hours as decimal (e.g., 1.5 = 1h 30m)
  modelValue: {
    type: Number,
    default: 0
  },
  // Enable live auto-increment based on real time elapsed
  liveUpdate: {
    type: Boolean,
    default: false
  },
  // Timestamp when the value was last set (for live calculation)
  timestamp: {
    type: Number,
    default: null
  },
  // Show live indicator dot
  showLiveIndicator: {
    type: Boolean,
    default: true
  },
  // Show "Live" label next to indicator
  showLiveLabel: {
    type: Boolean,
    default: false
  },
  // Custom focus ring color class
  focusRingClass: {
    type: String,
    default: 'focus:ring-blue-500'
  },
  // Font size
  fontSize: {
    type: String,
    default: '0.75rem'
  },
  // Update interval in ms (for live updates)
  updateInterval: {
    type: Number,
    default: 10000 // 10 seconds
  }
});

const emit = defineEmits(['update:modelValue', 'update:timestamp']);

// Refs
const hoursInput = ref(null);
const minutesInput = ref(null);
const liveUpdateTrigger = ref(0);
let updateIntervalId = null;

// Computed: Is live mode active?
const isLive = computed(() => props.liveUpdate && props.timestamp);

// Computed: Calculate current hours including elapsed time
const currentTotalHours = computed(() => {
  // Force reactivity
  const _ = liveUpdateTrigger.value;
  
  if (!isLive.value || !props.timestamp) {
    return props.modelValue || 0;
  }
  
  const now = Date.now();
  const elapsedMs = now - props.timestamp;
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  
  return Math.max(0, (props.modelValue || 0) + elapsedHours);
});

// Computed: Display values
const displayHours = computed(() => Math.floor(currentTotalHours.value));
const displayMinutes = computed(() => {
  const fractionalHours = currentTotalHours.value - Math.floor(currentTotalHours.value);
  return Math.floor(fractionalHours * 60);
});

// Computed: Tooltip for live indicator
const liveTooltip = computed(() => {
  if (!isLive.value) return '';
  return `Auto-updating since ${new Date(props.timestamp).toLocaleTimeString()}`;
});

// Methods
function onHoursInput(event) {
  const hours = Math.max(0, parseInt(event.target.value) || 0);
  const minutes = displayMinutes.value;
  emitUpdate(hours, minutes);
}

function onMinutesInput(event) {
  let minutes = parseInt(event.target.value) || 0;
  let hours = displayHours.value;
  
  // Handle overflow (e.g., 75 minutes -> 1h 15m)
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  } else if (minutes < 0) {
    minutes = 0;
  }
  
  emitUpdate(hours, minutes);
}

function onBlur() {
  // Ensure valid values on blur
  const hours = Math.max(0, displayHours.value);
  const minutes = Math.min(59, Math.max(0, displayMinutes.value));
  emitUpdate(hours, minutes);
}

function selectAll(event) {
  event.target.select();
}

function emitUpdate(hours, minutes) {
  const totalHours = hours + (minutes / 60);
  emit('update:modelValue', totalHours);
  emit('update:timestamp', Date.now());
}

// Lifecycle
onMounted(() => {
  if (props.liveUpdate) {
    // Start live update interval
    updateIntervalId = setInterval(() => {
      liveUpdateTrigger.value++;
    }, props.updateInterval);
  }
});

onUnmounted(() => {
  if (updateIntervalId) {
    clearInterval(updateIntervalId);
  }
});

// Watch for liveUpdate prop changes
watch(() => props.liveUpdate, (newVal) => {
  if (newVal && !updateIntervalId) {
    updateIntervalId = setInterval(() => {
      liveUpdateTrigger.value++;
    }, props.updateInterval);
  } else if (!newVal && updateIntervalId) {
    clearInterval(updateIntervalId);
    updateIntervalId = null;
  }
});
</script>

<style scoped>
/* Remove number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
