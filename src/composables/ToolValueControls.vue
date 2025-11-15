<template>
  <div class="flex items-center">
    <!-- Fast Decrement -->
    <button 
      v-if="showFastControls"
      tabindex="-1"
      @mousedown="onButtonDown(decrementFast)"
      @touchstart.prevent="onTouchStart(decrementFast)"
      @touchmove="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @dragstart.prevent
      class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-l-md mr-px"
      :class="[
        { 'opacity-20 cursor-not-allowed hover:bg-gray-900': value <= minValue || disableDecrement },
        buttonClass
      ]"
      :disabled="value <= minValue || disableDecrement"
    >
      <div class="flex">
        <IconChevronLeft size="14" class="-mr-2" />
        <IconChevronLeft size="14" />
      </div>
    </button>
    
    <!-- Decrement -->
    <button 
      tabindex="-1"
      @mousedown="onButtonDown(decrement)"
      @touchstart.prevent="onTouchStart(decrement)"
      @touchmove="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @dragstart.prevent
      class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white"
      :class="[
        {'rounded-l-md': !showFastControls},
        {'opacity-20 cursor-not-allowed hover:bg-gray-900': value <= minValue || disableDecrement},
        buttonClass
      ]"
      :disabled="value <= minValue || disableDecrement"
    >
      <IconChevronLeft size="14" />
    </button>
    
    <!-- Current Value -->
    <div 
      class="min-w-[45px] text-center bg-gray-800 py-[1px] h-6 border-y border-gray-600 flex items-center justify-center"
      :class="{ 'text-gray-400': disabled }"
    >
      <slot>
        <input
          v-if="isEditing"
          ref="inputField"
          type="number" 
          v-model.number="inputValue"
          :tabindex="tabIndex"
          @blur="finishEditing"
          @keydown.enter="finishEditing"
          @keydown.escape="cancelEditing"
          class="w-full h-full text-center bg-gray-800 text-white border-none outline-none px-1 py-0 focus:outline-none"
          :class="valueClass"
          :min="minValue"
          :max="maxValue"
          :disabled="disabled"
          @input="validateInput"
        />
        <div 
          v-else 
          :tabindex="tabIndex"
          @click="startEditing"
          @keydown.enter="startEditing"
          @keydown.space="startEditing"
          @focus="onSpanFocus"
          class="cursor-pointer select-none w-full text-center px-2 hover:bg-gray-700 flex flex-col items-center justify-center"
          :title="disabled ? '' : 'Click to edit'"
        >
          <!-- Show only time or only level, depending on showOnlyAdditionalInfo -->
          <span v-if="!showOnlyAdditionalInfo" :class="valueClass">{{ 
            formatValue ? formatValue(value) : 
            decimalPlaces !== null ? value.toFixed(decimalPlaces) : 
            value 
          }}</span>
          <span v-if="additionalInfo" :class="additionalInfoClass || 'text-gray-400 text-xs'">
            {{ additionalInfo }}
          </span>
        </div>
      </slot>
    </div>
    
    <!-- Increment -->
    <button 
      tabindex="-1"
      @mousedown="onButtonDown(increment)"
      @touchstart.prevent="onTouchStart(increment)"
      @touchmove="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @dragstart.prevent
      class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white"
      :class="[
        {'rounded-r-md': !showFastControls},
        {'opacity-20 cursor-not-allowed hover:bg-gray-900': value >= maxValue},
        buttonClass
      ]"
      :disabled="value >= maxValue"
    >
      <IconChevronRight size="14" />
    </button>
    
    <!-- Fast Increment -->
    <button 
      v-if="showFastControls"
      tabindex="-1"
      @mousedown="onButtonDown(incrementFast)"
      @touchstart.prevent="onTouchStart(incrementFast)"
      @touchmove="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @dragstart.prevent
      class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-r-md ml-px"
      :class="[
        {'opacity-20 cursor-not-allowed hover:bg-gray-900': value >= maxValue},
        buttonClass
      ]"
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
import { ref, computed, onBeforeUnmount, nextTick, watchEffect, onMounted } from 'vue';
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
    type: [Number, Array],
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
  },
  tabIndex: {
    type: Number,
    default: 0
  },
  autoEdit: {
    type: Boolean,
    default: false
  },
  validateOnFinalOnly: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  },
  disableDecrement: {
    type: Boolean,
    default: false
  },
  buttonClass: {
    type: String,
    default: ''
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  additionalInfoClass: {
    type: String,
    default: 'text-gray-400 text-xs'
  },
  showOnlyAdditionalInfo: {
    type: Boolean,
    default: false
  },
  formatValue: {
    type: Function,
    default: null
  },
  decimalPlaces: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['update:value', 'update:raw-value', 'finalize:value', 'blur']);

// Interval reference
const buttonInterval = ref(null);
const buttonTimeout = ref(null);

// Input reference and state
const inputField = ref(null);
const isEditing = ref(false);
const inputValue = ref(props.value);

const isIncrementing = ref(false);
const isHolding = ref(false); // Track if user is holding button

// When external value changes, update inputValue as well
watchEffect(() => {
  inputValue.value = props.value;
});

// Function for focus handler that automatically switches to edit mode
function onSpanFocus(event) {
  if (props.autoEdit && !props.disabled) {
    startEditing();
  }
}

// Starts edit mode
function startEditing() {
  if (props.disabled) return;
  
  isEditing.value = true;
  inputValue.value = props.value;
  
  // Focus input field and select all
  nextTick(() => {
    if (inputField.value) {
      inputField.value.focus();
      inputField.value.select();
    }
  });
}

// Validates input during typing
function validateInput(event) {
  // Remove invalid characters
  if (event.target.value === '') return;
  
  // Convert to number
  const numValue = Number(event.target.value);
  
  if (props.validateOnFinalOnly) {
    // With validateOnFinalOnly, raw value is emitted directly without min/max validation
    if (!isNaN(numValue)) {
      emit('update:raw-value', numValue);
    }
  } else {
    // Standard validation
    if (!isNaN(numValue)) {
      if (numValue < props.minValue) {
        inputValue.value = props.minValue;
        emit('update:value', props.minValue);
      } else if (numValue > props.maxValue) {
        inputValue.value = props.maxValue;
        emit('update:value', props.maxValue);
      } else {
        emit('update:value', numValue);
      }
    }
  }
}

// Ends editing and applies the value
function finishEditing() {
  isEditing.value = false;
  
  // Convert to number and validate
  let numValue = Number(inputValue.value);
  
  // If it's not a valid number, keep the old value
  if (isNaN(numValue)) {
    inputValue.value = props.value;
    emit('blur'); // Inform parent about blur event
    return;
  }
  
  if (props.validateOnFinalOnly) {
    // With validateOnFinalOnly, finalization is signaled WITH THE VALUE
    emit('finalize:value', numValue);  // Pass the numValue here!
    emit('blur');
  } else {
    // Standard validation and emission
    numValue = Math.max(props.minValue, Math.min(props.maxValue, numValue));
    
    // Only emit if value actually changed
    if (numValue !== props.value) {
      emit('update:value', numValue);
    }
    
    // Synchronize inputValue in any case
    inputValue.value = numValue;
    emit('blur');
  }
}

// Cancels editing and restores original value
function cancelEditing() {
  isEditing.value = false;
  inputValue.value = props.value;
}

// Actions
function increment() {
  if (props.value < props.maxValue && !props.disabled) {
    // Set isIncrementing to true before incrementing
    isIncrementing.value = true;
    
    let newValue;
    
    // Check if step is an array (step values)
    if (Array.isArray(props.step)) {
      // Find next higher value in the step array
      const currentIndex = props.step.findIndex(stepValue => stepValue > props.value);
      if (currentIndex !== -1) {
        newValue = Math.min(props.maxValue, props.step[currentIndex]);
      } else {
        // If no higher value found, stay at current value
        newValue = props.value;
      }
    } else {
      // Normal step increment
      newValue = Math.min(props.maxValue, props.value + props.step);
    }
    
    // Always trigger update:value for immediate UI update
    emit('update:value', newValue);
    
    // Only emit raw-value during hold, finalize will be called on release
    if (props.validateOnFinalOnly) {
      emit('update:raw-value', newValue);
    }
    
    // Reset after short time
    setTimeout(() => {
      isIncrementing.value = false;
    }, 300);
  }
}

function decrement() {
  if (props.value > props.minValue && !props.disabled && !props.disableDecrement) {
    let newValue;
    
    // Check if step is an array (step values)
    if (Array.isArray(props.step)) {
      // Find next lower value in the step array
      const reversedSteps = [...props.step].reverse();
      const currentIndex = reversedSteps.findIndex(stepValue => stepValue < props.value);
      if (currentIndex !== -1) {
        newValue = Math.max(props.minValue, reversedSteps[currentIndex]);
      } else {
        // If no lower value found, stay at current value
        newValue = props.value;
      }
    } else {
      // Normal step decrement
      newValue = Math.max(props.minValue, props.value - props.step);
    }
    
    // Always trigger update:value for immediate UI update
    emit('update:value', newValue);
    
    // Only emit raw-value during hold, finalize will be called on release
    if (props.validateOnFinalOnly) {
      emit('update:raw-value', newValue);
    }
  }
}

function incrementFast() {
  if (props.value < props.maxValue && !props.disabled) {
    isIncrementing.value = true;
    
    let newValue;
    
    // Check if step is an array (step values) - for fast increment, jump to highest value
    if (Array.isArray(props.step)) {
      // Jump directly to the highest value in the array (last element since array is sorted)
      newValue = Math.min(props.maxValue, props.step[props.step.length - 1]);
    } else {
      // Normal fast step increment
      newValue = Math.min(props.maxValue, props.value + props.fastStep);
    }
    
    // Always trigger update:value for immediate UI update
    emit('update:value', newValue);
    
    // Only emit raw-value during hold, finalize will be called on release
    if (props.validateOnFinalOnly) {
      emit('update:raw-value', newValue);
    }
    
    setTimeout(() => {
      isIncrementing.value = false;
    }, 300);
  }
}

function decrementFast() {
  if (props.value > props.minValue && !props.disabled && !props.disableDecrement) {
    let newValue;
    
    // Check if step is an array (step values) - for fast decrement, jump to lowest value
    if (Array.isArray(props.step)) {
      // Jump directly to the lowest value in the array (first element since array is sorted)
      newValue = Math.max(props.minValue, props.step[0]);
    } else {
      // Normal fast step decrement
      newValue = Math.max(props.minValue, props.value - props.fastStep);
    }
    
    // Always trigger update:value for immediate UI update
    emit('update:value', newValue);
    
    // Only emit raw-value during hold, finalize will be called on release
    if (props.validateOnFinalOnly) {
      emit('update:raw-value', newValue);
    }
  }
}

// Button handling
function onButtonDown(action) {
  if (props.disabled) return;
  
  // If we're currently in edit mode, cancel it
  if (isEditing.value) {
    finishEditing();
  }
  
  isHolding.value = false; // Single click initially
  
  // Execute immediately
  action();
  
  // After 200ms, repetition begins
  buttonTimeout.value = setTimeout(() => {
    isHolding.value = true; // Now we're holding
    
    // Check before setting interval if action is still executable
    // (i.e., if value is not at limits)
    const isIncrementAction = action === increment || action === incrementFast;
    const isDecrementAction = action === decrement || action === decrementFast;
    
    const canExecuteIncrement = isIncrementAction && props.value < props.maxValue;
    const canExecuteDecrement = isDecrementAction && props.value > props.minValue;
    
    if (canExecuteIncrement || canExecuteDecrement) {
      buttonInterval.value = setInterval(() => {
        // Check again before executing action in interval
        if ((isIncrementAction && props.value >= props.maxValue) || 
            (isDecrementAction && props.value <= props.minValue)) {
          // Stop when limit is reached
          clearInterval(buttonInterval.value);
          return;
        }
        action();
      }, 60);
    }
  }, 200);
  
  // Add event listener for mouseup
  document.addEventListener('mouseup', onButtonUp);
  document.addEventListener('mouseleave', onButtonUp);
  window.addEventListener('blur', onButtonUp);
}

function onButtonUp() {
  clearTimeout(buttonTimeout.value);
  clearInterval(buttonInterval.value);
  removeListeners();
  
  // Emit finalize when user releases button (only for validateOnFinalOnly mode)
  if (isHolding.value && props.validateOnFinalOnly) {
    emit('finalize:value', props.value);
  }
  
  isHolding.value = false;
}

function removeListeners() {
  document.removeEventListener('mouseup', onButtonUp);
  document.removeEventListener('mouseleave', onButtonUp);
  window.removeEventListener('blur', onButtonUp);
}

// Touch handling
let touchAction = null;

function onTouchStart(action) {
  if (props.disabled) return;
  
  // If we're currently in edit mode, cancel it
  if (isEditing.value) {
    finishEditing();
  }
  
  touchAction = action;
  isHolding.value = false; // Single tap initially
  
  // Execute immediately
  action();
  
  // After 500ms, repetition begins
  buttonTimeout.value = setTimeout(() => {
    isHolding.value = true; // Now we're holding
    
    // Check before setting interval if action is still executable
    const isIncrementAction = action === increment || action === incrementFast;
    const isDecrementAction = action === decrement || action === decrementFast;
    
    const canExecuteIncrement = isIncrementAction && props.value < props.maxValue;
    const canExecuteDecrement = isDecrementAction && props.value > props.minValue;
    
    if (canExecuteIncrement || canExecuteDecrement) {
      buttonInterval.value = setInterval(() => {
        // Check again before executing action in interval
        if ((isIncrementAction && props.value >= props.maxValue) || 
            (isDecrementAction && props.value <= props.minValue)) {
          // Stop when limit is reached
          clearInterval(buttonInterval.value);
          return;
        }
        action();
      }, 100);
    }
  }, 500);
}

function onTouchMove(event) {
  // Touch moved outside, cancel
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
  
  // Emit finalize when user releases button (only for validateOnFinalOnly mode)
  if (isHolding.value && props.validateOnFinalOnly) {
    emit('finalize:value', props.value);
  }
  
  isHolding.value = false;
}

// Clean-up
onBeforeUnmount(() => {
  clearTimeout(buttonTimeout.value);
  clearInterval(buttonInterval.value);
  removeListeners();
});
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera - hide arrows on number inputs */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox - hide arrows on number inputs */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>