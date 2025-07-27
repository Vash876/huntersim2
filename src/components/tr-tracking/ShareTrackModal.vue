<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header with close button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconShare size="20" class="mr-2 text-blue-400" />
          Share TR Track
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal content -->
      <div class="p-5">
        <p class="text-sm text-gray-300 mb-4">
          Copy your TR tracking plan code:
        </p>
        
        <div class="mb-4">
          <textarea
            ref="codeTextarea"
            :value="trackCode"
            readonly
            class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm h-40 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
            @click="selectCode"
          ></textarea>
        </div>
        
        <!-- Copy button -->
        <div class="mb-4">
          <button 
            @click="copyCode" 
            :class="{ 
              'bg-green-600 hover:bg-green-700': copied, 
              'bg-blue-600 hover:bg-blue-700': !copied
            }"
            class="w-full p-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <IconCheck v-if="copied" size="18" />
            <IconCopy v-else size="18" />
            <span class="font-medium">{{ copied ? 'Copied!' : 'Copy Track Code' }}</span>
          </button>
        </div>
        
        <div class="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md">
          <p class="text-xs text-blue-300 mb-1">
            <strong>TR Track Code:</strong>
          </p>
          <p class="text-xs text-gray-400">
            Share this code with others to let them import your complete TR tracking plan including all tracking data.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconShare, IconX, IconCopy, IconCheck } from '@tabler/icons-vue';

// Props
const props = defineProps({
  show: Boolean,
  track: Object
});

// Emits
const emit = defineEmits(['close']);

// Refs
const codeTextarea = ref(null);
const copied = ref(false);

// Computed
const trackCode = computed(() => {
  if (!props.track) return '';
  
  try {
    // Create a complete shareable version of the track (including tracking data)
    const shareableTrack = {
      name: props.track.name,
      startDate: props.track.startDate,
      notes: props.track.notes || '',
      trCount: props.track.trCount,
      targetGoals: { ...props.track.targetGoals },
      initialValues: { ...props.track.initialValues },
      // Include all tracking entries
      entries: props.track.entries || [],
      selectedResources: props.track.selectedResources || [],
      resourceOrder: props.track.resourceOrder || [],
      isActive: props.track.isActive,
      createdAt: props.track.createdAt,
      updatedAt: props.track.updatedAt,
      version: '1.0'
    };
    
    // Use much more aggressive compression by removing repetitive data and using very short keys
    const compressed = {
      n: shareableTrack.name,
      s: shareableTrack.startDate,
      nt: shareableTrack.notes,
      t: shareableTrack.trCount,
      g: shareableTrack.targetGoals,
      i: shareableTrack.initialValues,
      e: shareableTrack.entries.map(entry => [
        entry.date,
        entry.values,
        entry.notes || '',
        entry.id
      ]),
      r: shareableTrack.selectedResources,
      o: shareableTrack.resourceOrder,
      a: shareableTrack.isActive ? 1 : 0,
      c: shareableTrack.createdAt,
      u: shareableTrack.updatedAt,
      v: '2'  // Version 2 for new format
    };
    
    // Convert to JSON and use URL-safe base64 without padding
    const jsonStr = JSON.stringify(compressed);
    return btoa(jsonStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Error generating track code:', error);
    return '';
  }
});

// Methods
const selectCode = () => {
  if (codeTextarea.value) {
    codeTextarea.value.select();
  }
};

const copyCode = async () => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(trackCode.value);
    } else {
      selectCode();
      document.execCommand('copy');
    }
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy code:', err);
    // Fallback
    try {
      selectCode();
      const success = document.execCommand('copy');
      if (success) {
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
      }
    } catch (execErr) {
      console.error('Copy failed:', execErr);
      alert('Copying failed. Please copy manually.');
    }
  }
};

// Reset functionality when the modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    copied.value = false;
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
</style>
