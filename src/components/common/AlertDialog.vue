<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-[60] overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('cancel')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-base font-bold text-white">
          {{ title }}
        </h2>
        <button 
          @click="$emit('cancel')"
          class="p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <component 
              :is="alertIcon" 
              :size="24" 
              :class="iconClass"
            />
          </div>
          <div class="flex-grow">
            <p class="text-sm text-gray-300">{{ message }}</p>
          </div>
        </div>
      </div>
      
      <!-- Footer buttons -->
      <div class="bg-gray-750 p-3 border-t border-gray-700 flex justify-end gap-2">
        <button 
          v-if="showCancel"
          @click="$emit('cancel')"
          class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="$emit('confirm')"
          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconX, IconAlertCircle, IconAlertTriangle, IconInfoCircle } from '@tabler/icons-vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Alert'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info', // 'info', 'warning', 'error'
    validator: (value) => ['info', 'warning', 'error'].includes(value)
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: 'OK'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const alertIcon = computed(() => {
  switch (props.type) {
    case 'warning': return IconAlertTriangle;
    case 'error': return IconAlertCircle;
    case 'info':
    default: return IconInfoCircle;
  }
});

const iconClass = computed(() => {
  switch (props.type) {
    case 'warning': return 'text-yellow-400';
    case 'error': return 'text-red-400';
    case 'info': 
    default: return 'text-blue-400';
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
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

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}
</style>