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
          <IconDownload size="20" class="mr-2 text-purple-400" />
          Import TR Track
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
          Paste a TR track code below to import a tracking plan:
        </p>
        
        <!-- Code input field with immediate validation -->
        <div class="mb-4">
          <textarea
            v-model="importCode"
            placeholder="Paste TR track code here..."
            class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm h-24 focus:outline-none"
            :class="{
              'focus:border-purple-500 focus:ring-1 focus:ring-purple-500': !errorMessage,
              'border-red-500 focus:border-red-500': errorMessage
            }"
            @input="validateTrackCode"
          ></textarea>
        </div>
        
        <!-- Error display (if any) -->
        <div 
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-sm text-red-200"
        >
          <div class="flex items-center">
            <IconAlertTriangle class="mr-2 flex-shrink-0" size="16" />
            <span>{{ errorMessage }}</span>
          </div>
        </div>
        
        <!-- Track preview (if validated) -->
        <div 
          v-if="validatedTrack" 
          class="mb-4 p-3 border border-green-500 bg-green-900/20 rounded-md transition-all duration-300"
        >
          <div class="flex items-center">
            <div class="mr-3 rounded-full p-2 bg-green-900/40">
              <IconChartLine size="24" class="text-green-400" />
            </div>
            
            <div>
              <div class="font-medium text-white">{{ validatedTrack.name }}</div>
              <div class="text-xs text-gray-400">
                TR Count: {{ validatedTrack.trCount }} | 
                Started: {{ formatDate(validatedTrack.startDate) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Import button -->
        <div class="flex flex-col gap-2 mt-6">
          <button 
            @click="importTrack"
            :disabled="!validatedTrack"
            class="w-full px-4 py-2.5 rounded-md transition-colors flex items-center justify-center"
            :class="[
              validatedTrack ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed opacity-50'
            ]"
          >
            <IconDownload class="mr-2" size="20" />
            <span>Import Track Plan</span>
          </button>
          <div class="text-xs text-gray-400 pl-1">Imports the complete tracking plan with all data entries</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconDownload, IconX, IconAlertTriangle, IconChartLine } from '@tabler/icons-vue';

// Props
const props = defineProps({
  show: Boolean
});

// Emits
const emit = defineEmits(['close', 'import']);

// Refs
const importCode = ref('');
const errorMessage = ref('');
const validatedTrack = ref(null);
const isValidating = ref(false);

// Methods
const validateTrackCode = async () => {
  // Reset previous validation
  errorMessage.value = '';
  
  const code = typeof importCode.value === 'string' ? importCode.value.trim() : '';
  
  // Skip validation if empty
  if (!code) {
    validatedTrack.value = null;
    return;
  }
  
  // Prevent multiple simultaneous validations
  if (isValidating.value) return;
  
  isValidating.value = true;
  
  try {
    // Restore URL-safe base64 and add padding if needed
    let base64Code = code.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Code.length % 4) {
      base64Code += '=';
    }
    
    // Parse track code
    const compressed = JSON.parse(atob(base64Code));
    
    // Check format version and decompress accordingly
    let track;
    if (compressed.v === '2') {
      // New ultra-compressed format - version 2
      track = {
        name: compressed.n,
        startDate: compressed.s,
        notes: compressed.nt || '',
        trCount: compressed.t,
        targetGoals: compressed.g || {},
        initialValues: compressed.i || {},
        entries: (compressed.e || []).map(entryArray => ({
          date: entryArray[0],
          values: entryArray[1],
          notes: entryArray[2] || '',
          id: entryArray[3]
        })),
        selectedResources: compressed.r || [],
        resourceOrder: compressed.o || [],
        isActive: compressed.a === 1,
        createdAt: compressed.c,
        updatedAt: compressed.u,
        version: '2.0'
      };
    } else if (compressed.n && compressed.sd) {
      // Old compressed format - version 1
      track = {
        name: compressed.n,
        startDate: compressed.sd,
        notes: compressed.nt || '',
        trCount: compressed.tc,
        targetGoals: compressed.tg || {},
        initialValues: compressed.iv || {},
        entries: (compressed.e || []).map(entry => ({
          date: entry.d,
          values: entry.v,
          notes: entry.n,
          id: entry.i
        })),
        selectedResources: compressed.sr || [],
        resourceOrder: compressed.ro || [],
        isActive: compressed.a,
        createdAt: compressed.ca,
        updatedAt: compressed.ua,
        version: compressed.ver || '1.0'
      };
    } else {
      // Original uncompressed format
      track = compressed;
    }
    
    // Validate required fields
    if (!track.name || !track.startDate || !track.trCount) {
      errorMessage.value = 'Invalid track code. Missing required fields.';
      validatedTrack.value = null;
    } else {
      // Valid track found
      validatedTrack.value = track;
      errorMessage.value = '';
    }
  } catch (error) {
    console.error('TRACK CODE VALIDATION ERROR:', error);
    errorMessage.value = 'Invalid track code. Please check the code and try again.';
    validatedTrack.value = null;
  } finally {
    isValidating.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Import track
const importTrack = () => {
  if (!validatedTrack.value) {
    errorMessage.value = 'Please enter a valid track code first.';
    return;
  }
  
  // Generate a new ID for the imported track
  const trackToImport = {
    ...validatedTrack.value,
    id: Date.now().toString(), // Generate new ID
    // Keep all existing entries from the shared track
    entries: validatedTrack.value.entries || [],
    // Set as active by default
    isActive: validatedTrack.value.isActive !== undefined ? validatedTrack.value.isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Pass the track to the parent component
  emit('import', trackToImport);
  
  // Close modal and reset form
  emit('close');
  resetForm();
};

// Reset form
const resetForm = () => {
  importCode.value = '';
  errorMessage.value = '';
  validatedTrack.value = null;
};

// Reset form when modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

// Initial validation if code is pre-filled
watch(() => importCode.value, (newVal) => {
  if (typeof newVal === 'string' && newVal.trim()) {
    validateTrackCode();
  } else {
    validatedTrack.value = null;
    errorMessage.value = '';
  }
}, { immediate: true });
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
