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
          <IconDownload size="20" class="mr-2 text-blue-400" />
          Import TR Plan
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
          Paste a TR plan code below to import a plan configuration:
        </p>
        
        <!-- Code input field with immediate validation -->
        <div class="mb-4">
          <textarea
            v-model="importCode"
            placeholder="Paste TR plan code here..."
            class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm h-24 focus:outline-none"
            :class="{
              'focus:border-blue-500 focus:ring-1 focus:ring-blue-500': !errorMessage,
              'border-red-500 focus:border-red-500': errorMessage
            }"
            @paste="handlePaste"
            @input="validatePlanCode"
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
        
        <!-- TR Plan preview (if validated) -->
        <div 
          v-if="validatedPlan" 
          class="mb-4 p-3 border border-blue-500 bg-blue-900/20 rounded-md transition-all duration-300"
        >
          <div class="flex items-center">
            <!-- TR Plan icon -->
            <div class="mr-3 rounded-full p-2 bg-blue-900/20">
              <IconTarget size="24" class="text-blue-400" />
            </div>
            
            <div>
              <div class="font-medium text-white">{{ validatedPlan.name }}</div>
              <div class="text-sm text-gray-400">
                {{ planStats }}
              </div>
            </div>
          </div>
          
          <!-- Compatibility warnings (if any) -->
          <div 
            v-if="compatibilityInfo && !compatibilityInfo.compatible" 
            class="mt-3 p-2 bg-yellow-900/30 border border-yellow-600 rounded text-sm text-yellow-200"
          >
            <div class="font-medium mb-1">Gem Level Warnings:</div>
            <ul class="text-xs space-y-1">
              <li v-for="warning in compatibilityInfo.warnings" :key="warning.gem">
                {{ warning.gem }}: requires level {{ warning.required }} (you have {{ warning.current }})
              </li>
            </ul>
            <div class="mt-2 text-xs text-yellow-300">
              The plan will use the original gem levels for calculations.
            </div>
          </div>
        </div>
        
        <!-- Import button -->
        <div class="flex flex-col gap-2 mt-6">
          <button 
            @click="importPlan"
            :disabled="!validatedPlan"
            class="w-full px-4 py-2.5 rounded-md transition-colors flex items-center justify-center"
            :class="[
              validatedPlan ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed opacity-50'
            ]"
          >
            <IconDownload class="mr-2" size="20" />
            <span>Import TR Plan</span>
          </button>
          <div class="text-xs text-gray-400 pl-1">
            Imports the complete TR plan with all settings and gem context
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconDownload, IconX, IconTarget, IconAlertTriangle } from '@tabler/icons-vue';
import { importTRPlan } from '@/utils/trImportExport';

// Props
const props = defineProps({
  show: Boolean,
  prefilledCode: String
});

// Emits
const emit = defineEmits(['close', 'import-plan']);

// Refs
const importCode = ref('');
const errorMessage = ref('');
const validatedPlan = ref(null);
const compatibilityInfo = ref(null);
const isValidating = ref(false);

// Computed
const planStats = computed(() => {
  if (!validatedPlan.value) return '';
  
  const plan = validatedPlan.value;
  const trCount = 1 + (plan.trChain ? plan.trChain.length : 0);
  
  return `${trCount} TR${trCount > 1 ? 's' : ''} planned`;
});

// Process URL input
const handlePaste = (e) => {
  setTimeout(() => {
    try {
      if (importCode.value && typeof importCode.value === 'string' && 
          importCode.value.includes('http') && importCode.value.includes('?code=')) {
        const url = new URL(importCode.value);
        const codeParam = url.searchParams.get('code');
        if (codeParam) {
          importCode.value = codeParam;
          validatePlanCode();
        }
      }
    } catch (e) {
      // Not a URL, that's fine
      console.log('Not a URL or other paste error:', e);
    }
  }, 0);
};

// Validate plan code
const validatePlanCode = async () => {
  // Reset previous validation
  errorMessage.value = '';
  validatedPlan.value = null;
  compatibilityInfo.value = null;
  
  // Ensure importCode.value is a string
  const code = typeof importCode.value === 'string' ? importCode.value.trim() : '';
  
  // Skip validation if empty
  if (!code) {
    return;
  }
  
  // Prevent multiple simultaneous validations
  if (isValidating.value) return;
  
  isValidating.value = true;
  
  try {
    // Parse plan code
    const importResult = importTRPlan(code);
    
    if (!importResult || !importResult.plan) {
      errorMessage.value = 'Invalid TR plan code. Please check the code and try again.';
    } else {
      // Valid plan found
      validatedPlan.value = importResult.plan;
      compatibilityInfo.value = importResult.isCompatible;
      errorMessage.value = '';
    }
  } catch (error) {
    console.error('TR PLAN CODE VALIDATION ERROR:', error);
    errorMessage.value = error.message || 'An error occurred while validating the code.';
  } finally {
    isValidating.value = false;
  }
};

// Import plan
const importPlan = () => {
  if (!validatedPlan.value) {
    errorMessage.value = 'Please enter a valid TR plan code first.';
    return;
  }
  
  // Pass the validated plan to the parent component
  emit('import-plan', validatedPlan.value);
  
  // Close modal and reset form
  emit('close');
  resetForm();
};

// Reset form
const resetForm = () => {
  importCode.value = '';
  errorMessage.value = '';
  validatedPlan.value = null;
  compatibilityInfo.value = null;
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
    validatePlanCode();
  } else {
    validatedPlan.value = null;
    compatibilityInfo.value = null;
    errorMessage.value = '';
  }
}, { immediate: true });

// Watch for prefilled code and populate importCode accordingly
watch(() => props.prefilledCode, (newVal) => {
  if (typeof newVal === 'string' && newVal) {
    importCode.value = newVal;
    validatePlanCode();
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
