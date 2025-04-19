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
      :class="{ 'opacity-20 cursor-not-allowed hover:bg-gray-900': value <= minValue || disableDecrement }"
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
      :class="{
        'rounded-l-md': !showFastControls,
        'opacity-20 cursor-not-allowed hover:bg-gray-900': value <= minValue || disableDecrement
      }"
      :disabled="value <= minValue || disableDecrement"
    >
      <IconChevronLeft size="14" />
    </button>
    
    <!-- Current Value - Editable Input -->
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
        <span 
          v-else 
          :class="valueClass"
          :tabindex="tabIndex"
          @click="startEditing"
          @keydown.enter="startEditing"
          @keydown.space="startEditing"
          @focus="onSpanFocus"
          class="cursor-pointer select-none w-full text-center px-2 hover:bg-gray-700"
          :title="disabled ? '' : 'Click to edit'"
        >
          {{ value }}
        </span>
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
      tabindex="-1"
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
  }
});

const emit = defineEmits(['update:value', 'update:raw-value', 'finalize:value', 'blur']);

// Intervall-Referenz
const buttonInterval = ref(null);
const buttonTimeout = ref(null);

// Input-Referenz und Zustand
const inputField = ref(null);
const isEditing = ref(false);
const inputValue = ref(props.value);

// Wenn sich der externe Wert ändert, aktualisiere auch den inputValue
watchEffect(() => {
  inputValue.value = props.value;
});

// Funktion für den Focus-Handler, der automatisch in den Bearbeitungsmodus wechselt
function onSpanFocus(event) {
  if (props.autoEdit && !props.disabled) {
    startEditing();
  }
}

// Startet den Bearbeitungsmodus
function startEditing() {
  if (props.disabled) return;
  
  isEditing.value = true;
  inputValue.value = props.value;
  
  // Fokus auf das Input-Feld setzen und alles auswählen
  nextTick(() => {
    if (inputField.value) {
      inputField.value.focus();
      inputField.value.select();
    }
  });
}

// Validiert den Input während der Eingabe
function validateInput(event) {
  // Entferne ungültige Zeichen
  if (event.target.value === '') return;
  
  // Konvertieren in eine Zahl
  const numValue = Number(event.target.value);
  
  if (props.validateOnFinalOnly) {
    // Bei validateOnFinalOnly wird der Rohwert direkt emittiert, ohne min/max Validierung
    if (!isNaN(numValue)) {
      emit('update:raw-value', numValue);
    }
  } else {
    // Standard-Validierung
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

// Beendet die Bearbeitung und übernimmt den Wert
function finishEditing() {
  isEditing.value = false;
  
  // Konvertieren in eine Zahl und Validieren
  let numValue = Number(inputValue.value);
  
  // Wenn es keine gültige Zahl ist, behalte den alten Wert bei
  if (isNaN(numValue)) {
    inputValue.value = props.value;
    emit('blur'); // Informiere den Parent über das Blur-Event
    return;
  }
  
  if (props.validateOnFinalOnly) {
    // Bei validateOnFinalOnly wird die Finalisierung signalisiert
    emit('finalize:value');
    emit('blur');
  } else {
    // Standard-Validierung und Emittieren
    numValue = Math.max(props.minValue, Math.min(props.maxValue, numValue));
    
    // Nur emittieren, wenn sich der Wert tatsächlich geändert hat
    if (numValue !== props.value) {
      emit('update:value', numValue);
    }
    
    // In jedem Fall inputValue synchronisieren
    inputValue.value = numValue;
    emit('blur');
  }
}

// Bricht die Bearbeitung ab und stellt den ursprünglichen Wert wieder her
function cancelEditing() {
  isEditing.value = false;
  inputValue.value = props.value;
}

// Aktionen
function increment() {
  if (props.value < props.maxValue && !props.disabled) {
    const newValue = Math.min(props.maxValue, props.value + props.step);
    
    if (props.validateOnFinalOnly) {
      emit('update:raw-value', newValue);
    } else {
      emit('update:value', newValue);
    }
  }
}

function decrement() {
  if (props.value > props.minValue && !props.disabled && !props.disableDecrement) {
    const newValue = Math.max(props.minValue, props.value - props.step);
    
    if (props.validateOnFinalOnly) {
      emit('update:raw-value', newValue);
    } else {
      emit('update:value', newValue);
    }
  }
}

function incrementFast() {
  if (props.value < props.maxValue && !props.disabled) {
    const newValue = Math.min(props.maxValue, props.value + props.fastStep);
    
    if (props.validateOnFinalOnly) {
      emit('update:raw-value', newValue);
    } else {
      emit('update:value', newValue);
    }
  }
}

function decrementFast() {
  if (props.value > props.minValue && !props.disabled && !props.disableDecrement) {
    const newValue = Math.max(props.minValue, props.value - props.fastStep);
    
    if (props.validateOnFinalOnly) {
      emit('update:raw-value', newValue);
    } else {
      emit('update:value', newValue);
    }
  }
}

// Button-Handling
function onButtonDown(action) {
  if (props.disabled) return;
  
  // Wenn wir gerade im Bearbeitungsmodus sind, diesen abbrechen
  if (isEditing.value) {
    finishEditing();
  }
  
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
  
  // Wenn wir gerade im Bearbeitungsmodus sind, diesen abbrechen
  if (isEditing.value) {
    finishEditing();
  }
  
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

<style scoped>
/* Chrome, Safari, Edge, Opera - verstecken der Pfeile bei Zahl-Inputs */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox - verstecken der Pfeile bei Zahl-Inputs */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>