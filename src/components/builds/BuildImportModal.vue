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
          Import Build
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
          Paste a build code below to import a build configuration:
        </p>
        
        <!-- Code input field with immediate validation -->
        <div class="mb-4">
          <textarea
            v-model="importCode"
            placeholder="Paste build code here..."
            class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm h-24 focus:outline-none"
            :class="{
              'focus:border-blue-500 focus:ring-1 focus:ring-blue-500': !errorMessage,
              'border-red-500 focus:border-red-500': errorMessage
            }"
            @paste="handlePaste"
            @input="validateBuildCode"
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
        
        <!-- Simplified hunter preview (if validated) -->
        <div 
          v-if="validatedBuild" 
          class="mb-4 p-3 border rounded-md transition-all duration-300"
          :class="hunterColorClasses"
        >
          <div class="flex items-center">
            <!-- Hunter icon from constants -->
            <div class="mr-3 rounded-full p-2" :class="hunterBackgroundClass">
              <component 
                :is="hunterIcon" 
                size="24" 
                :class="`text-${hunterColor}-400`" 
              />
            </div>
            
            <div>
              <div class="font-medium text-white">{{ hunterName }} Build</div>
            </div>
          </div>
        </div>
        
        <!-- Import options -->
        <div class="flex flex-col gap-2 mt-6">
          <button 
            @click="importBuildOnly"
            :disabled="!validatedBuild"
            class="w-full px-4 py-2.5 rounded-md transition-colors flex items-center justify-center"
            :class="[
              validatedBuild ? `bg-${hunterColor}-600 hover:bg-${hunterColor}-700` : 'bg-gray-600 cursor-not-allowed opacity-50'
            ]"
          >
            <IconUserCheck class="mr-2" size="20" />
            <span>Import Build Only</span>
          </button>
          <div class="text-xs text-gray-400 pl-1">Only imports talents and attributes</div>
          
          <button 
            @click="importWithUpgrades"
            :disabled="!validatedBuild"
            class="w-full px-4 py-2.5 rounded-md transition-colors mt-2 flex items-center justify-center"
            :class="[
              validatedBuild ? `bg-${hunterColor}-800 hover:bg-${hunterColor}-900 border border-${hunterColor}-600` : 'bg-gray-700 cursor-not-allowed opacity-50 border border-gray-600'
            ]"
          >
            <IconPackage class="mr-2" size="20" />
            <span>Import with Upgrades</span>
          </button>
          <div class="text-xs text-gray-400 pl-1">Imports all parameters including upgrades and stats</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconDownload, IconX, IconQuestionMark, IconAlertTriangle, IconUserCheck, IconPackage } from '@tabler/icons-vue';
import { BuildCodeHandler } from '../../utils/BuildCodeHandler';
import { getHunterById, HUNTERS } from '../../constants/hunters';

// Props
const props = defineProps({
  show: Boolean
});

// Emits
const emit = defineEmits(['close', 'import-build']);

// Refs
const importCode = ref('');
const errorMessage = ref('');
const validatedBuild = ref(null);
const isValidating = ref(false);

// Hunter type from validated build
const hunterType = computed(() => {
  if (!validatedBuild.value) return '';
  return (validatedBuild.value.hunterId || validatedBuild.value.hunter || '').toLowerCase();
});

// Hunter name from constants
const hunterName = computed(() => {
  if (!hunterType.value) return 'Unknown';
  const hunter = getHunterById(hunterType.value);
  return hunter ? hunter.name : hunterType.value.charAt(0).toUpperCase() + hunterType.value.slice(1);
});

// Hunter color from constants
const hunterColor = computed(() => {
  if (!hunterType.value) return 'gray';
  
  const hunter = getHunterById(hunterType.value);
  if (hunter) return hunter.color;
  
  // Fallback colors if no hunter info is found
  switch(hunterType.value) {
    case 'borge': return 'red';
    case 'ozzy': return 'green';
    case 'knox': return 'blue';
    default: return 'gray';
  }
});

// CSS classes for hunter colors
const hunterColorClasses = computed(() => {
  return {
    [`border-${hunterColor.value}-500`]: true,
    [`bg-${hunterColor.value}-900/20`]: true,
  };
});

// Hunter icon from constants
const hunterIcon = computed(() => {
  if (!hunterType.value) return IconQuestionMark;
  
  const hunter = getHunterById(hunterType.value);
  return hunter?.icon || IconQuestionMark;
});

// Process URL input
const handlePaste = (e) => {
  setTimeout(() => {
    try {
      if (importCode.value.includes('http') && importCode.value.includes('?code=')) {
        const url = new URL(importCode.value);
        const codeParam = url.searchParams.get('code');
        if (codeParam) {
          importCode.value = codeParam;
          validateBuildCode();
        }
      }
    } catch (e) {
      // Not a URL, that's fine
    }
  }, 0);
};

// Validate build code
const validateBuildCode = async () => {
  // Reset previous validation
  errorMessage.value = '';
  
  // Skip validation if empty
  const code = importCode.value.trim();
  if (!code) {
    validatedBuild.value = null;
    return;
  }
  
  // Prevent multiple simultaneous validations
  if (isValidating.value) return;
  
  isValidating.value = true;
  
  try {
    // Parse build code
    const build = BuildCodeHandler.parseCode(code);
    
    if (!build) {
      errorMessage.value = 'Invalid build code. Please check the code and try again.';
      validatedBuild.value = null;
    } else {
      // Valid build found
      validatedBuild.value = build;
      errorMessage.value = '';
    }
  } catch (error) {
    console.error('BUILD CODE VALIDATION ERROR:', error);
    errorMessage.value = 'An error occurred while validating the code.';
    validatedBuild.value = null;
  } finally {
    isValidating.value = false;
  }
};

// Import build only (talents and attributes)
const importBuildOnly = () => {
  if (!validatedBuild.value) {
    errorMessage.value = 'Please enter a valid build code first.';
    return;
  }
  
  // Create a new build object with only talents and attributes
  const buildToImport = {
    hunterId: validatedBuild.value.hunterId,
    hunter: validatedBuild.value.hunterId, // For compatibility
    name: validatedBuild.value.name || `${hunterName.value} Import`,
    talents: { ...validatedBuild.value.talents },
    attributes: { ...validatedBuild.value.attributes },
    // Level will be calculated by the build modal
    overrides: {} // Empty overrides
  };
  
  // Pass the filtered build to the parent component
  emit('import-build', buildToImport);
  
  // Close modal and reset form
  emit('close');
  resetForm();
};

// Import with upgrades (full build including all parameters)
const importWithUpgrades = () => {
  if (!validatedBuild.value) {
    errorMessage.value = 'Please enter a valid build code first.';
    return;
  }
  
  // Use the complete validated build
  const buildToImport = { ...validatedBuild.value };
  
  // Make sure we have the essential properties
  if (!buildToImport.overrides) buildToImport.overrides = {};
  if (!buildToImport.talents) buildToImport.talents = {};
  if (!buildToImport.attributes) buildToImport.attributes = {};
  
  // Pass the complete build to the parent component
  emit('import-build', buildToImport);
  
  // Close modal and reset form
  emit('close');
  resetForm();
};

// Reset form
const resetForm = () => {
  importCode.value = '';
  errorMessage.value = '';
  validatedBuild.value = null;
};

const hunterBackgroundClass = computed(() => {
  const color = hunterColor.value;
  return {
    'bg-red-900/20': color === 'red',
    'bg-green-900/20': color === 'green',
    'bg-blue-900/20': color === 'blue',
    'bg-gray-900/20': color === 'gray',
  };
});

// Reset form when modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

// Initial validation if code is pre-filled
watch(() => importCode.value, (newVal) => {
  if (newVal.trim()) {
    validateBuildCode();
  } else {
    validatedBuild.value = null;
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

/* Safe Tailwind classes for dynamic colors */
.border-red-500, .bg-red-900\/20, .text-red-400, .bg-red-500\/20, .bg-red-400, .bg-red-600, .hover\:bg-red-700,
.border-green-500, .bg-green-900\/20, .text-green-400, .bg-green-500\/20, .bg-green-400, .bg-green-600, .hover\:bg-green-700,
.border-blue-500, .bg-blue-900\/20, .text-blue-400, .bg-blue-500\/20, .bg-blue-400, .bg-blue-600, .hover\:bg-blue-700,
.bg-red-800, .hover\:bg-red-900, .border-red-600,
.bg-green-800, .hover\:bg-green-900, .border-green-600,
.bg-blue-800, .hover\:bg-blue-900, .border-blue-600,
/* Zusätzliche Klassen für Ozzy */
.bg-green-900, .bg-green-900\/20, .bg-green-500 {
  /* These classes are empty, but are recognized by Tailwind to include in the build */
}
</style>