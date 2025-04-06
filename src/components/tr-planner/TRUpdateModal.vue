<template>
  <div 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-800 to-green-700 p-4 rounded-t-lg">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">Update TR Progress</h2>
          <button 
            @click="$emit('close')"
            class="p-1 rounded-full hover:bg-green-600/50 transition-colors"
          >
            <IconX size="16" />
          </button>
        </div>
      </div>
      
      <!-- Inhalt -->
      <div class="p-5">
        <div class="mb-6">
          <div class="flex items-center mb-5 bg-gray-750 p-3 rounded-md border border-gray-700">
            <IconCircleCheck size="30" class="text-green-500 mr-3" />
            <div>
              <h3 class="font-medium text-white">Confirm TR Completion</h3>
              <p class="text-sm text-gray-300">
                TR #{{ trNumber }} has been completed in-game
              </p>
            </div>
          </div>
          
          <div class="text-sm text-gray-300 space-y-4">
            <p>This will update your plan to reflect completion of TR #{{ trNumber }}:</p>
            
            <ul class="list-disc pl-5 space-y-2 text-gray-400">
              <li>
                <span class="text-blue-400">TR Count:</span> Will increase to {{ trNumber + 1 }}
              </li>
              <li>
                <span class="text-green-400">All-Time Orbs:</span> Will increase by {{ formatNumber(orbGains) }}
              </li>
              <li>
                <span class="text-yellow-400">Boosts:</span> Target levels from TR #{{ trNumber + 1 }} will become your new current levels
              </li>
              <li>
                <span class="text-red-400">TR Chain:</span> First TR will be removed and the chain will advance
              </li>
            </ul>
            
            <div class="bg-blue-900/30 p-3 rounded-md border border-blue-800 text-blue-100 mt-4">
              <p>This action updates your plan to match your in-game progress.</p>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="$emit('close')" 
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
          >
            Cancel
          </button>
          <button 
            @click="$emit('update')" 
            class="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm flex items-center"
          >
            <IconCheck size="16" class="mr-1.5" />
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconX, IconCircleCheck, IconCheck } from '@tabler/icons-vue';
import { formatNumber } from '@/composables/format';

// Props für das Modal
const props = defineProps({
  planId: {
    type: String,
    required: true
  },
  trNumber: {
    type: Number,
    required: true
  },
  orbGains: {
    type: Number,
    required: true
  },
  fragGains: {
    type: Number,
    default: 0
  }
});

// Emits
defineEmits(['close', 'update']);
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