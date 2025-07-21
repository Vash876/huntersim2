<template>
  <div class="relative">
    <!-- Color Preview Button -->
    <button
      @click="showPicker = !showPicker"
      class="w-6 h-6 rounded-full border-2 border-gray-600 hover:border-gray-500 transition-all duration-200 shadow-md"
      :style="{ backgroundColor: modelValue }"
      :title="'Change color'"
    />
    
    <!-- Color Picker Dropdown -->
    <div
      v-if="showPicker"
      class="absolute top-8 left-0 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-[240px]"
      @click.stop
    >
      <!-- Preset Colors -->
      <div class="mb-3">
        <h4 class="text-xs font-medium text-gray-300 mb-2">Preset Colors</h4>
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="color in presetColors"
            :key="color"
            @click="selectColor(color)"
            class="w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110"
            :class="{
              'border-white': modelValue === color,
              'border-gray-600': modelValue !== color
            }"
            :style="{ backgroundColor: color }"
          />
        </div>
      </div>
      
      <!-- Custom Color Input -->
      <div class="mb-3">
        <h4 class="text-xs font-medium text-gray-300 mb-2">Custom Color</h4>
        <div class="flex gap-2">
          <input
            v-model="customColor"
            type="text"
            placeholder="#3B82F6"
            class="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-xs"
            @input="validateCustomColor"
          />
          <button
            @click="selectColor(customColor)"
            :disabled="!isValidColor(customColor)"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-2 py-1 rounded transition-colors text-xs"
          >
            Apply
          </button>
        </div>
      </div>
      
      <!-- Native Color Picker as Fallback -->
      <div class="mb-3">
        <h4 class="text-xs font-medium text-gray-300 mb-2">Color Picker</h4>
        <input
          v-model="nativeColor"
          type="color"
          class="w-full h-8 bg-gray-700 border border-gray-600 rounded cursor-pointer"
          @change="selectColor(nativeColor)"
        />
      </div>
      
      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-2 border-t border-gray-700">
        <button
          @click="showPicker = false"
          class="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors text-xs"
        >
          Close
        </button>
      </div>
    </div>
    
    <!-- Backdrop to close picker -->
    <div
      v-if="showPicker"
      class="fixed inset-0 z-40"
      @click="showPicker = false"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '#3B82F6'
  }
});

const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);
const customColor = ref(props.modelValue);
const nativeColor = ref(props.modelValue);

// Preset colors for quick selection
const presetColors = [
  '#FF0000', // red
  '#F97316', // orange  
  '#F59E0B', // amber
  '#EAB308', // yellow
  '#84CC16', // lime
  '#10B981', // emerald
  '#5AFFB5', // green
  '#06B6D4', // cyan
  '#0EA5E9', // sky
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#A855F7', // purple
  '#D946EF', // fuchsia
  '#EC4899', // pink
  '#F43F5E', // rose
  '#6B7280', // gray
  '#374151', // gray-dark
  '#1F2937', // gray-darker
  '#111827', // gray-darkest
  '#FFFFFF', // white
  '#F3F4F6', // gray-light
  '#E5E7EB', // gray-lighter
  '#D1D5DB'  // gray-lightest
];

// Watch for prop changes
watch(() => props.modelValue, (newVal) => {
  customColor.value = newVal;
  nativeColor.value = newVal;
});

// Methods
function selectColor(color) {
  emit('update:modelValue', color);
  customColor.value = color;
  nativeColor.value = color;
}

function isValidColor(color) {
  if (!color) return false;
  
  // Check hex color format
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

function validateCustomColor() {
  if (isValidColor(customColor.value)) {
    nativeColor.value = customColor.value;
  }
}
</script>

<style scoped>
/* Custom color input styling */
input[type="color"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  border: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
  border-radius: 4px;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}
</style>
