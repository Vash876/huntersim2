<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto py-10"
  >
    <div class="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl m-4 border border-gray-700 overflow-hidden">
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-teal-900 to-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconHelp size="20" class="mr-2 text-teal-400" />
          TR Shorts Guide
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white">
          <IconX size="20" />
        </button>
      </div>
      
      <!-- Modal Content -->
      <div class="p-5 max-h-[70vh] overflow-y-auto">
        <div class="prose prose-invert prose-sm max-w-none">
          <!-- Placeholder for content -->
          <p>This guide will explain TR Shorts strategy. Content coming soon.</p>
        </div>
      </div>
      
      <!-- Modal Footer -->
      <div class="bg-gray-800 p-4 border-t border-gray-700 flex justify-end">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-md transition-colors"
        >
          Close Guide
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconHelp, IconX } from '@tabler/icons-vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
});

defineEmits(['close']);
</script>