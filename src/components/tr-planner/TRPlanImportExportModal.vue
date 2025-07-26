<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
    @click.self="close"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-white">
            {{ mode === 'import' ? 'Import TR Plan' : 'Export TR Plan' }}
          </h2>
          <button 
            @click="close"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="16" />
          </button>
        </div>
      </div>

      <!-- Import Mode -->
      <div v-if="mode === 'import'" class="p-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Paste Plan Code
          </label>
          <textarea 
            v-model="importCode"
            placeholder="Paste the Base58 encoded plan code here..."
            class="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <!-- Import Analysis (shown after entering code) -->
        <div v-if="importAnalysis" class="mb-4">
          <div class="bg-gray-750 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-white mb-3">Plan Analysis</h3>
            
            <!-- Plan Info -->
            <div class="mb-3">
              <div class="text-xs text-gray-400">Plan Name:</div>
              <div class="text-sm text-white">{{ importAnalysis.planName }}</div>
            </div>

            <!-- Gem Requirements -->
            <div v-if="Object.keys(importAnalysis.requiresGems).length > 0" class="mb-3">
              <div class="text-xs text-gray-400 mb-2">Required Gems:</div>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="(level, gem) in importAnalysis.requiresGems" 
                  :key="gem"
                  class="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded border border-purple-500/30"
                >
                  {{ gem.charAt(0).toUpperCase() + gem.slice(1) }} Lv{{ level }}
                </span>
              </div>
            </div>

            <!-- Compatibility Warning -->
            <div v-if="!importAnalysis.isCompatible.compatible" class="mb-3">
              <div class="bg-yellow-900/30 border border-yellow-500/50 rounded-md p-3">
                <div class="flex items-start">
                  <IconAlertTriangle size="16" class="text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div class="text-yellow-300 text-sm font-medium">Gem Level Warnings</div>
                    <div class="text-yellow-200/80 text-xs mt-1">
                      This plan requires higher gem levels than you currently have:
                    </div>
                    <ul class="text-xs text-yellow-200/80 mt-2 space-y-1">
                      <li v-for="warning in importAnalysis.isCompatible.warnings" :key="warning.gem">
                        {{ warning.gem.charAt(0).toUpperCase() + warning.gem.slice(1) }}: 
                        needs Lv{{ warning.required }} (you have Lv{{ warning.current }})
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Success Message -->
            <div v-else class="mb-3">
              <div class="bg-green-900/30 border border-green-500/50 rounded-md p-3">
                <div class="flex items-center">
                  <IconCheck size="16" class="text-green-400 mr-2" />
                  <div class="text-green-300 text-sm">Plan is compatible with your current gem levels</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Import Button -->
        <div class="flex justify-end space-x-3">
          <button 
            @click="close"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="performImport"
            :disabled="!importCode.trim() || importing"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center"
          >
            <IconDownload size="16" class="mr-2" />
            {{ importing ? 'Importing...' : 'Import Plan' }}
          </button>
        </div>
      </div>

      <!-- Export Mode -->
      <div v-if="mode === 'export'" class="p-4">
        <!-- Plan Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Select Plan to Export
          </label>
          <select 
            v-model="selectedPlanId"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Choose a plan...</option>
            <option 
              v-for="plan in availablePlans" 
              :key="plan.id" 
              :value="plan.id"
            >
              {{ plan.name }}
            </option>
          </select>
        </div>

        <!-- Export Code (shown after export) -->
        <div v-if="exportCode" class="mb-4">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Plan Code (copy this to share)
          </label>
          <div class="relative">
            <textarea 
              ref="exportCodeTextarea"
              :value="exportCode"
              readonly
              class="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none focus:outline-none"
            ></textarea>
            <button 
              @click="copyToClipboard"
              class="absolute top-2 right-2 p-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
              :title="copied ? 'Copied!' : 'Copy to clipboard'"
            >
              <IconCopy v-if="!copied" size="16" />
              <IconCheck v-else size="16" class="text-green-400" />
            </button>
          </div>
        </div>

        <!-- Export Button -->
        <div class="flex justify-end space-x-3">
          <button 
            @click="close"
            class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
          >
            Close
          </button>
          <button 
            @click="performExport"
            :disabled="!selectedPlanId || exporting"
            class="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center"
          >
            <IconUpload size="16" class="mr-2" />
            {{ exporting ? 'Exporting...' : 'Export Plan' }}
          </button>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="p-4 border-t border-gray-700">
        <div class="bg-red-900/30 border border-red-500/50 rounded-md p-3">
          <div class="flex items-start">
            <IconAlertCircle size="16" class="text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div class="text-red-300 text-sm font-medium">Error</div>
              <div class="text-red-200/80 text-xs mt-1">{{ errorMessage }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useTRPlannerStore } from '@/store/orbStore';
import { 
  IconX, 
  IconDownload, 
  IconUpload, 
  IconCopy, 
  IconCheck,
  IconAlertTriangle,
  IconAlertCircle
} from '@tabler/icons-vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'import', // 'import' or 'export'
    validator: (value) => ['import', 'export'].includes(value)
  }
});

const emit = defineEmits(['close', 'planImported', 'planExported']);

const trPlannerStore = useTRPlannerStore();

// Import state
const importCode = ref('');
const importAnalysis = ref(null);
const importing = ref(false);

// Export state  
const selectedPlanId = ref('');
const exportCode = ref('');
const exporting = ref(false);
const copied = ref(false);
const exportCodeTextarea = ref(null);

// Common state
const errorMessage = ref('');

// Available plans for export
const availablePlans = computed(() => {
  return trPlannerStore.trPlans.filter(plan => !plan.isImported);
});

// Watch import code for analysis
watch(importCode, async (newCode) => {
  if (!newCode.trim()) {
    importAnalysis.value = null;
    return;
  }

  try {
    // Quick analysis without actually importing
    const { importTRPlan } = await import('@/utils/trImportExport');
    const result = importTRPlan(newCode.trim());
    
    importAnalysis.value = {
      planName: result.plan.name,
      requiresGems: result.requiresGems,
      isCompatible: result.isCompatible
    };
    
    errorMessage.value = '';
  } catch (error) {
    importAnalysis.value = null;
    errorMessage.value = error.message;
  }
}, { debounce: 500 });

async function performImport() {
  if (!importCode.value.trim()) return;
  
  importing.value = true;
  errorMessage.value = '';
  
  try {
    const result = await trPlannerStore.importTRPlan(importCode.value.trim());
    
    if (result.success) {
      emit('planImported', result);
      close();
    } else {
      errorMessage.value = result.error;
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    importing.value = false;
  }
}

async function performExport() {
  if (!selectedPlanId.value) return;
  
  exporting.value = true;
  errorMessage.value = '';
  
  try {
    const result = await trPlannerStore.exportTRPlan(selectedPlanId.value);
    
    if (result.success) {
      exportCode.value = result.encodedData;
      emit('planExported', result);
    } else {
      errorMessage.value = result.error;
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    exporting.value = false;
  }
}

async function copyToClipboard() {
  if (!exportCode.value) return;
  
  try {
    await navigator.clipboard.writeText(exportCode.value);
    copied.value = true;
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    // Fallback for older browsers
    if (exportCodeTextarea.value) {
      exportCodeTextarea.value.select();
      document.execCommand('copy');
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    }
  }
}

function close() {
  // Reset state
  importCode.value = '';
  importAnalysis.value = null;
  importing.value = false;
  selectedPlanId.value = '';
  exportCode.value = '';
  exporting.value = false;
  copied.value = false;
  errorMessage.value = '';
  
  emit('close');
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
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
