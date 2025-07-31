<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold text-white flex items-center">
            <IconCheck size="16" class="mr-2 text-blue-400" />
            Complete TR Track
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3">
        <p class="text-sm text-gray-300">
          Mark this TR as completed. Enter the completion date and time:
        </p>

        <!-- End Date -->
        <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
          <label class="text-xs font-medium text-gray-200">
            TR End Date
          </label>
          <div class="flex gap-1">
            <input
              v-model="formData.endDate"
              type="date"
              class="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              v-model="formData.endTime"
              type="time"
              class="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-2 justify-end pt-2 border-t border-gray-700 p-2">
        <button
          @click="$emit('close')"
          class="px-3 py-1.5 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-xs"
        >
          Cancel
        </button>
        <button
          @click="confirmComplete"
          class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-xs flex items-center gap-1"
        >
          <IconCheck size="12" />
          Complete TR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { IconCheck, IconX } from '@tabler/icons-vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close', 'confirm']);

// Use the EXACT same structure as NewTRModal - formData object
const formData = ref({
  endDate: '',
  endTime: ''
});

// Initialize with current date/time when modal opens - EXACT same logic as NewTRModal
watch(() => props.show, (newShow) => {
  if (newShow) {
    const now = new Date();
    formData.value.endDate = now.getFullYear() + '-' + 
                             String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                             String(now.getDate()).padStart(2, '0');
    formData.value.endTime = String(now.getHours()).padStart(2, '0') + ':' + 
                             String(now.getMinutes()).padStart(2, '0');
  }
}, { immediate: true });

const confirmComplete = () => {
  // EXACT same function as NewTRModal
  const createLocalISOString = (dateStr, timeStr) => {
    // Create date in local timezone, not UTC
    const localDate = new Date(dateStr + 'T' + timeStr);
    return localDate.toISOString();
  };
  
  // Create ISO string EXACTLY like NewTRModal does
  const completionDateTimeISO = createLocalISOString(formData.value.endDate, formData.value.endTime);
  
  console.log('CompleteTRModal - Input:', formData.value.endDate, formData.value.endTime);
  console.log('CompleteTRModal - ISO String:', completionDateTimeISO);
  
  // Send the ISO STRING directly, exactly like NewTRModal
  emit('confirm', completionDateTimeISO);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
