<template>
  <input
    ref="inputRef"
    :value="displayValue"
    @input="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
    v-bind="$attrs"
    class="w-20 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 placeholder-purple-400 focus:outline-none focus:ring-1"
    :class="[focusRingClass, textColorClass]"
  />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatSuffixInput, parseSuffixInput } from '@/composables/format.js';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 0
  },
  focusRingClass: {
    type: String,
    default: 'focus:ring-blue-500'
  },
  textColorClass: {
    type: String,
    default: 'text-white'
  }
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
const isEditing = ref(false);
const editingValue = ref('');

// Computed für den Anzeige-Wert
const displayValue = computed(() => {
  if (isEditing.value) {
    return editingValue.value;
  }
  
  // Konvertiere String zu Number wenn nötig
  const numValue = typeof props.modelValue === 'string' ? 
    parseSuffixInput(props.modelValue) : 
    (props.modelValue || 0);
  
  return formatSuffixInput(numValue);
});

// Watch für externe Änderungen des modelValue
watch(() => props.modelValue, (newValue) => {
  if (!isEditing.value) {
    // Nur aktualisieren wenn wir nicht gerade editieren
    const numValue = typeof newValue === 'string' ? 
      parseSuffixInput(newValue) : 
      (newValue || 0);
    editingValue.value = formatSuffixInput(numValue);
  }
});

function handleInput(event) {
  editingValue.value = event.target.value;
}

function handleFocus(event) {
  isEditing.value = true;
  editingValue.value = event.target.value;
  
  // Text auswählen für einfache Bearbeitung
  setTimeout(() => {
    if (inputRef.value) {
      inputRef.value.select();
    }
  }, 0);
}

function handleBlur() {
  isEditing.value = false;
  
  // Parse den eingegebenen Wert und emittiere das Ergebnis
  const parsedValue = parseSuffixInput(editingValue.value);
  emit('update:modelValue', parsedValue);
  
  // Aktualisiere die Anzeige mit dem formatierten Wert
  editingValue.value = formatSuffixInput(parsedValue);
}
</script>
