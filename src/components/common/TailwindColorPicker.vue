<template>
  <div class="relative">
    <!-- Color Preview Button -->
    <button
      @click="showPicker = !showPicker"
      type="button"
      class="w-6 h-6 rounded-full border-2 border-gray-600 hover:border-gray-500 transition-all duration-200 shadow-md"
      :class="colorClass"
      :title="'Change color'"
    />
    
    <!-- Backdrop -->
    <div
      v-if="showPicker"
      class="fixed inset-0 z-[100] bg-gray-900/50 flex items-center justify-center"
      @click="showPicker = false"
    >
      <!-- Color Picker Modal (Centered) -->
      <div
        class="bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 w-72 animate-fade-in"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-medium text-gray-200">Select Color</h4>
          <button
            @click="showPicker = false"
            class="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Tailwind Color Grid -->
        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="color in availableColors"
            :key="color.name"
            type="button"
            @click="selectColor(color.name)"
            class="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            :class="{ 'ring-2 ring-white': modelValue === color.name }"
          >
            <div 
              class="w-10 h-10 rounded-full shadow-lg"
              :class="color.bgClass"
            ></div>
            <span class="text-[10px] text-gray-300 capitalize leading-tight">{{ color.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'blue'
  }
});

const emit = defineEmits(['update:modelValue']);

const showPicker = ref(false);

// Available Tailwind colors with their background classes
const availableColors = [
  { name: 'blue', bgClass: 'bg-blue-500' },
  { name: 'purple', bgClass: 'bg-purple-500' },
  { name: 'pink', bgClass: 'bg-pink-500' },
  { name: 'red', bgClass: 'bg-red-500' },
  { name: 'orange', bgClass: 'bg-orange-500' },
  { name: 'yellow', bgClass: 'bg-yellow-500' },
  { name: 'green', bgClass: 'bg-green-500' },
  { name: 'teal', bgClass: 'bg-teal-500' },
  { name: 'cyan', bgClass: 'bg-cyan-500' },
  { name: 'indigo', bgClass: 'bg-indigo-500' },
  { name: 'violet', bgClass: 'bg-violet-500' },
  { name: 'gray', bgClass: 'bg-gray-500' }
];

const colorClass = computed(() => {
  const color = availableColors.find(c => c.name === props.modelValue);
  return color ? color.bgClass : 'bg-blue-500';
});

// Methods
function selectColor(colorName) {
  emit('update:modelValue', colorName);
  showPicker.value = false;
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
