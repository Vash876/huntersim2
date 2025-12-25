<template>
  <Teleport to="body">
    <div 
      class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
      @click.self="$emit('cancel')"
      @keydown.escape="$emit('cancel')"
    >
      <div 
        class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-800/50 to-gray-800 p-4 border-b border-gray-700">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <IconAlertTriangle class="w-5 h-5 text-red-400" />
            {{ title }}
          </h2>
        </div>

        <!-- Content -->
        <div class="p-4">
          <p class="text-gray-300">{{ message }}</p>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-700 p-4 flex justify-end gap-3 bg-gray-800/50">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="confirmClass"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { IconAlertTriangle } from '@tabler/icons-vue';

defineProps({
  title: {
    type: String,
    default: 'Confirm',
  },
  message: {
    type: String,
    default: 'Are you sure?',
  },
  confirmText: {
    type: String,
    default: 'Confirm',
  },
  confirmClass: {
    type: String,
    default: 'bg-red-600 hover:bg-red-500',
  },
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
