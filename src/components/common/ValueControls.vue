<template>
  <div class="flex items-center">
    <!-- Fast Decrement -->
    <button 
      v-if="showFastControls"
      @mousedown="onButtonDown(decrementFast)"
      @touchstart.prevent="onTouchStart(decrementFast)"
      @touchmove="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @dragstart.prevent
      class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-l-md mr-px"
      :class="{ 'opacity-20 cursor-not-allowed hover:bg-gray-900': value <= 0 }"
      :disabled="value <= 0"
    >
      <div class="flex">
        <IconChevronLeft size="14" />
        <IconChevronLeft size="14" class="-ml-2" />
      </div>
    </button>
    
    <!-- Decrement -->
    <button 
      @mousedown="onButtonDown(decrement)"
      @touchstart.prevent="onTouchStart(decrement)"
      @touchmove="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @dragstart.prevent
      class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white"
      :class="{
        'rounded-l-md': !showFastControls,
        'opacity-20 cursor-not-allowed hover:bg-gray-900': value <= 0
      }"
      :disabled="value <= 0"
    >
      <IconChevronLeft size="14" />
    </button>
    
    <!-- Current Value -->
    <div 
      class="min-w-[45px] text-center bg-gray-800 py-[1px] h-6 border-y border-gray-600 flex items-center justify-center"
      :class="{ 'text-gray-400': disabled }"
    >
      <slot>
        <span :class="valueClass">{{ value }}</span>
      </slot>
    </div>
    
    <!-- Increment -->
    <button 
      @mousedown="onButtonDown(increment)"
      @touchstart.prevent="onTouchStart(increment)"
      @touchmove="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @dragstart.prevent
      class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white"
      :class="{
        'rounded-r-md': !showFastControls,
        'opacity-20 cursor-not-allowed hover:bg-gray-900': value >= maxValue
      }"
      :disabled="value >= maxValue"
    >
      <IconChevronRight size="14" />
    </button>
    
    <!-- Fast Increment -->
    <button 
      v-if="showFastControls"
      @mousedown="onButtonDown(incrementFast)"
      @touchstart.prevent="onTouchStart(incrementFast)"
      @touchmove="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @dragstart.prevent
      class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-r-md ml-px"
      :class="{ 'opacity-20 cursor-not-allowed hover:bg-gray-900': value >= maxValue }"
      :disabled="value >= maxValue"
    >
      <div class="flex">
        <IconChevronRight size="14" />
        <IconChevronRight size="14" class="-ml-2" />
      </div>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue';

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  maxValue: {
    type: Number,
    default: Infinity
  },
  minValue: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  },
  fastStep: {
    type: Number,
    default: 10
  },
  showFastControls: {
    type: Boolean,
    default: true
  },
  valueClass: {
    type: String,
    default: 'text-white'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:value']);

// Intervall-Referenz
const buttonInterval = ref(null);
const buttonTimeout = ref(null);

// Aktionen
function increment() {
  if (props.value < props.maxValue) {
    emit('update:value', Math.min(props.maxValue, props.value + props.step));
  }
}

function decrement() {
  if (props.value > props.minValue) {
    emit('update:value', Math.max(props.minValue, props.value - props.step));
  }
}

function incrementFast() {
  if (props.value < props.maxValue) {
    emit('update:value', Math.min(props.maxValue, props.value + props.fastStep));
  }
}

function decrementFast() {
  if (props.value > props.minValue) {
    emit('update:value', Math.max(props.minValue, props.value - props.fastStep));
  }
}

// Button-Handling
function onButtonDown(action) {
  if (props.disabled) return;
  
  // Sofort auslösen
  action();
  
  // Nach 200ms beginnt die Wiederholung
  buttonTimeout.value = setTimeout(() => {
    // Prüfe vor dem Setzen des Intervalls, ob die Aktion noch ausführbar ist
    // (d.h. ob der Wert nicht an den Grenzen liegt)
    const isIncrementAction = action === increment || action === incrementFast;
    const isDecrementAction = action === decrement || action === decrementFast;
    
    const canExecuteIncrement = isIncrementAction && props.value < props.maxValue;
    const canExecuteDecrement = isDecrementAction && props.value > props.minValue;
    
    if (canExecuteIncrement || canExecuteDecrement) {
      buttonInterval.value = setInterval(() => {
        // Nochmal prüfen, bevor die Aktion im Intervall ausgeführt wird
        if ((isIncrementAction && props.value >= props.maxValue) || 
            (isDecrementAction && props.value <= props.minValue)) {
          // Stoppen, wenn ein Grenzwert erreicht wurde
          clearInterval(buttonInterval.value);
          return;
        }
        action();
      }, 60);
    }
  }, 200);
  
  // Event-Listener für mouseup hinzufügen
  document.addEventListener('mouseup', onButtonUp);
  document.addEventListener('mouseleave', onButtonUp);
  window.addEventListener('blur', onButtonUp);
}

function onButtonUp() {
  clearTimeout(buttonTimeout.value);
  clearInterval(buttonInterval.value);
  removeListeners();
}

function removeListeners() {
  document.removeEventListener('mouseup', onButtonUp);
  document.removeEventListener('mouseleave', onButtonUp);
  window.removeEventListener('blur', onButtonUp);
}

// Touch-Handling
let touchAction = null;

function onTouchStart(action) {
  if (props.disabled) return;
  
  touchAction = action;
  
  // Sofort auslösen
  action();
  
  // Nach 500ms beginnt die Wiederholung
  buttonTimeout.value = setTimeout(() => {
    // Prüfe vor dem Setzen des Intervalls, ob die Aktion noch ausführbar ist
    const isIncrementAction = action === increment || action === incrementFast;
    const isDecrementAction = action === decrement || action === decrementFast;
    
    const canExecuteIncrement = isIncrementAction && props.value < props.maxValue;
    const canExecuteDecrement = isDecrementAction && props.value > props.minValue;
    
    if (canExecuteIncrement || canExecuteDecrement) {
      buttonInterval.value = setInterval(() => {
        // Nochmal prüfen, bevor die Aktion im Intervall ausgeführt wird
        if ((isIncrementAction && props.value >= props.maxValue) || 
            (isDecrementAction && props.value <= props.minValue)) {
          // Stoppen, wenn ein Grenzwert erreicht wurde
          clearInterval(buttonInterval.value);
          return;
        }
        action();
      }, 100);
    }
  }, 500);
}

function onTouchMove(event) {
  // Optional: Berührung wurde außerhalb verschoben, abbrechen
  const touch = event.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  
  if (!event.currentTarget.contains(target)) {
    onTouchEnd();
  }
}

function onTouchEnd() {
  touchAction = null;
  clearTimeout(buttonTimeout.value);
  clearInterval(buttonInterval.value);
}

// Clean-up
onBeforeUnmount(() => {
  clearTimeout(buttonTimeout.value);
  clearInterval(buttonInterval.value);
  removeListeners();
});
</script>