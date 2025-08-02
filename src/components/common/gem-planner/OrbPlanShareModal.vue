<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-900 to-purple-800 p-4 border-b border-gray-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <IconShare size="24" class="text-white" />
            <h2 class="text-xl font-bold text-white">Share Orb Plan</h2>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-300 hover:text-white transition-colors"
          >
            <IconX size="24" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div v-if="plan" class="space-y-6">
          <!-- Plan Info -->
          <div class="bg-gray-800/40 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-white mb-2">{{ plan.name }}</h3>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <span class="text-gray-400">TRs:</span>
                <span class="ml-2 font-mono">{{ plan.trCount }}</span>
              </div>
              <div>
                <span class="text-gray-400">Budget:</span>
                <span class="ml-2 font-mono text-purple-300">{{ formatBudget(plan.initialBudget) }}</span>
              </div>
            </div>
          </div>

          <!-- Share Options -->
          <div class="space-y-4">
            <!-- Export as JSON -->
            <div>
              <h4 class="text-md font-medium text-white mb-3">Export Options</h4>
              <div class="space-y-3">
                <button
                  @click="exportAsJSON"
                  class="w-full flex items-center justify-between p-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg transition-colors text-left"
                >
                  <div class="flex items-center space-x-3">
                    <IconFileExport size="20" class="text-blue-400" />
                    <div>
                      <div class="text-white font-medium">Export as JSON</div>
                      <div class="text-sm text-gray-400">Download plan as a JSON file</div>
                    </div>
                  </div>
                  <IconChevronRight size="16" class="text-gray-400" />
                </button>

                <button
                  @click="copyToClipboard"
                  class="w-full flex items-center justify-between p-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-lg transition-colors text-left"
                >
                  <div class="flex items-center space-x-3">
                    <IconClipboard size="20" class="text-green-400" />
                    <div>
                      <div class="text-white font-medium">Copy to Clipboard</div>
                      <div class="text-sm text-gray-400">Copy plan data as JSON text</div>
                    </div>
                  </div>
                  <IconChevronRight size="16" class="text-gray-400" />
                </button>
              </div>
            </div>

            <!-- Share Link (Future feature) -->
            <div>
              <h4 class="text-md font-medium text-white mb-3">Share Link</h4>
              <div class="bg-gray-800/40 rounded-lg p-4">
                <div class="flex items-center space-x-3 mb-3">
                  <IconLink size="20" class="text-indigo-400" />
                  <span class="text-white font-medium">Shareable Link</span>
                  <span class="px-2 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded text-xs text-yellow-300">
                    Coming Soon
                  </span>
                </div>
                <p class="text-sm text-gray-400">
                  Generate a shareable link to this orb plan. Recipients can import it directly into their gem planner.
                </p>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <Transition name="fade">
            <div
              v-if="shareMessage.show"
              class="flex items-center space-x-2 p-3 rounded-lg"
              :class="[
                shareMessage.type === 'success' ? 'bg-green-900/40 border border-green-500/30' : 'bg-red-900/40 border border-red-500/30'
              ]"
            >
              <IconCheck v-if="shareMessage.type === 'success'" size="16" class="text-green-400" />
              <IconAlertCircle v-else size="16" class="text-red-400" />
              <span :class="shareMessage.type === 'success' ? 'text-green-300' : 'text-red-300'">
                {{ shareMessage.text }}
              </span>
            </div>
          </Transition>
        </div>

        <!-- Loading state -->
        <div v-else class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-3"></div>
          <p class="text-gray-400">Loading plan data...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  IconX,
  IconShare,
  IconFileExport,
  IconClipboard,
  IconLink,
  IconChevronRight,
  IconCheck,
  IconAlertCircle
} from '@tabler/icons-vue';

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  plan: {
    type: Object,
    default: null
  }
});

// Emits
defineEmits(['close']);

// State
const shareMessage = ref({
  show: false,
  type: 'success',
  text: ''
});

// Methods
function formatBudget(budget) {
  if (!budget) return '0';
  if (budget >= 1e12) return (budget / 1e12).toFixed(1) + 'T';
  if (budget >= 1e9) return (budget / 1e9).toFixed(1) + 'B';
  if (budget >= 1e6) return (budget / 1e6).toFixed(1) + 'M';
  if (budget >= 1e3) return (budget / 1e3).toFixed(1) + 'K';
  return budget.toString();
}

function showMessage(text, type = 'success') {
  shareMessage.value = { show: true, type, text };
  
  setTimeout(() => {
    shareMessage.value.show = false;
  }, 3000);
}

function exportAsJSON() {
  if (!props.plan) return;

  try {
    const exportData = {
      name: props.plan.name,
      trCount: props.plan.trCount,
      initialBudget: props.plan.initialBudget,
      description: props.plan.description || '',
      trSteps: props.plan.trSteps || [],
      createdAt: props.plan.createdAt,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      type: 'orbSpendingPlan'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `orb-plan-${props.plan.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showMessage('Plan exported successfully!', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showMessage('Failed to export plan', 'error');
  }
}

async function copyToClipboard() {
  if (!props.plan) return;

  try {
    const exportData = {
      name: props.plan.name,
      trCount: props.plan.trCount,
      initialBudget: props.plan.initialBudget,
      description: props.plan.description || '',
      trSteps: props.plan.trSteps || [],
      createdAt: props.plan.createdAt,
      exportedAt: new Date().toISOString(),
      version: '1.0',
      type: 'orbSpendingPlan'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(dataStr);
      showMessage('Plan copied to clipboard!', 'success');
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = dataStr;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        showMessage('Plan copied to clipboard!', 'success');
      } catch (err) {
        showMessage('Failed to copy to clipboard', 'error');
      }
      
      document.body.removeChild(textArea);
    }
  } catch (error) {
    console.error('Copy error:', error);
    showMessage('Failed to copy to clipboard', 'error');
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
