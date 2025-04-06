<template>
  <div class="flex items-center gap-2 px-1 py-1.5 rounded-md hover:bg-gray-700 transition-colors">
    <div class="flex items-center">
      <IconSeedling 
        :class="modelValue ? 'text-green-400' : 'text-gray-400'" 
        size="16" 
      />
      <span class="ml-2">{{ modelValue ? 'Seeded' : 'Random' }}</span>
      <button 
        @click="toggleSeed"
        class="ml-2 relative inline-flex items-center p-0.5 cursor-pointer"
      >
        <div
          class="w-11 h-6 rounded-full relative transition-colors duration-300"
          :class="modelValue ? 'bg-green-600' : 'bg-gray-600'"
        >
          <div
            class="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform duration-300"
            :class="modelValue ? 'translate-x-5' : 'translate-x-0.5'"
          ></div>
        </div>
      </button>
    </div>
    <div class="ml-1 relative">
      <IconHelp 
        size="16" 
        class="text-gray-400 cursor-help"
        @click.stop="toggleTooltip"
        ref="helpIconRef"
      />
      
      <div 
        v-if="showHelpTooltip"
        class="tooltip-container fixed mt-2 p-3 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-[9999]"
        :class="isMobile ? 'mobile-tooltip' : ''"
        :style="tooltipStyle"
      >
        <h4 class="font-semibold mb-1">Evaluation Mode</h4>
        <p class="text-xs text-gray-300">
          <span class="font-semibold">Seeded (Recommended):</span> Uses deterministic RNG for consistent results across evaluations. Great for comparing builds.
          <br><br>
          <span class="font-semibold">Random:</span> Uses true randomness. Results may vary between evaluations but better represents real gameplay variance.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { IconSeedling, IconHelp } from '@tabler/icons-vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  hunterId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const showHelpTooltip = ref(false);
const helpIconRef = ref(null);
const isMobile = ref(false);
const tooltipStyle = ref({});

onMounted(() => {
  checkMobileDevice();
  window.addEventListener('resize', checkMobileDevice);
  window.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobileDevice);
  window.removeEventListener('click', handleOutsideClick);
});

function handleOutsideClick(event) {
  // Ignoriere Klicks auf das Help-Icon selbst
  if (helpIconRef.value && helpIconRef.value.contains(event.target)) {
    return;
  }
  
  // Schließe den Tooltip bei Klicks außerhalb
  if (showHelpTooltip.value) {
    showHelpTooltip.value = false;
  }
}

function checkMobileDevice() {
  isMobile.value = window.innerWidth < 768;
  
  // Positioniere den Tooltip, wenn er sichtbar ist
  if (showHelpTooltip.value) {
    nextTick(() => positionTooltip());
  }
}

function positionTooltip() {
  if (!helpIconRef.value) return;
  
  const rect = helpIconRef.value.getBoundingClientRect();
  
  if (isMobile.value) {
    // Auf mobilen Geräten: Positioniere den Tooltip etwas nach oben und links
    tooltipStyle.value = {
      top: `${rect.top - 140}px`,
      left: `${rect.left - 200}px`,
      maxWidth: '200px'
    };
  } else {
    // Auf Desktop: Standard-Position unter dem Icon
    tooltipStyle.value = {
      top: `${rect.bottom + 5}px`,
      left: `${rect.left - 150 + rect.width / 2}px`,
      maxWidth: '300px'
    };
  }
}

function toggleTooltip() {
  showHelpTooltip.value = !showHelpTooltip.value;
  if (showHelpTooltip.value) {
    nextTick(() => positionTooltip());
  }
}

function toggleSeed() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<style scoped>
.tooltip-container {
  width: auto;
  white-space: normal;
}
</style>