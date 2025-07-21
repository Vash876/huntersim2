<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click="handleModalClick"
  >
    <div 
      ref="modalContent"
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-900 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-xl font-bold text-white flex items-center">
            <IconShare size="20" class="mr-3 text-blue-400" />
            Import / Export TR Tracks
          </h3>
          <p class="text-sm text-gray-300 mt-1">Share your tracking data with other users</p>
        </div>
        <button
          @click="$emit('close')"
          class="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="20" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-6">
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-700">
          <button
            @click="activeTab = 'export'"
            :class="[
              'px-4 py-2 font-medium text-sm transition-colors',
              activeTab === 'export' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            ]"
          >
            <IconUpload size="16" class="inline mr-2" />
            Export
          </button>
          <button
            @click="activeTab = 'import'"
            :class="[
              'px-4 py-2 font-medium text-sm transition-colors',
              activeTab === 'import' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            ]"
          >
            <IconDownload size="16" class="inline mr-2" />
            Import
          </button>
        </div>

        <!-- Export Tab -->
        <div v-if="activeTab === 'export'" class="space-y-4">
          <div>
            <h4 class="text-lg font-semibold text-white mb-2">Export Your Tracks</h4>
            <p class="text-sm text-gray-400 mb-4">
              Generate shareable codes for your TR tracking data. Choose what to export:
            </p>
          </div>

          <!-- Export Options -->
          <div class="space-y-3">
            <div class="bg-gray-700/30 rounded-lg p-4">
              <h5 class="font-medium text-white mb-2">Export Single Track</h5>
              <p class="text-sm text-gray-400 mb-3">Export one specific track</p>
              
              <div class="space-y-3">
                <select 
                  v-model="selectedTrackForExport"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a track...</option>
                  <option 
                    v-for="track in tracks" 
                    :key="track.id" 
                    :value="track"
                  >
                    {{ track.name }} ({{ track.entries.length }} entries)
                  </option>
                </select>
                
                <button
                  @click="exportSingleTrack"
                  :disabled="!selectedTrackForExport"
                  class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                >
                  Generate Track Code
                </button>
              </div>
            </div>

            <div class="bg-gray-700/30 rounded-lg p-4">
              <h5 class="font-medium text-white mb-2">Export All Tracks</h5>
              <p class="text-sm text-gray-400 mb-3">Export all your tracks including resource settings</p>
              
              <button
                @click="exportAllTracks"
                :disabled="tracks.length === 0"
                class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                Generate Full Export Code
              </button>
            </div>
          </div>

          <!-- Export Result -->
          <div v-if="exportResult" class="bg-gray-700/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h5 class="font-medium text-white">Export Code</h5>
              <button
                @click="copyToClipboard(exportResult)"
                class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                <IconCopy size="14" class="inline mr-1" />
                Copy
              </button>
            </div>
            <div class="bg-gray-800 rounded p-3 font-mono text-sm text-green-400 break-all">
              {{ exportResult }}
            </div>
            <p class="text-xs text-gray-400 mt-2">
              Share this code with other users to let them import your track data.
            </p>
          </div>
        </div>

        <!-- Import Tab -->
        <div v-if="activeTab === 'import'" class="space-y-4">
          <div>
            <h4 class="text-lg font-semibold text-white mb-2">Import Tracks</h4>
            <p class="text-sm text-gray-400 mb-4">
              Paste a shared code to import track data from another user.
            </p>
          </div>

          <!-- Import Input -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Import Code
              </label>
              <textarea
                v-model="importCode"
                @input="validateImportCode"
                placeholder="Paste the shared code here..."
                rows="4"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              ></textarea>
              <div v-if="importValidation.error" class="text-red-400 text-sm mt-1">
                {{ importValidation.error }}
              </div>
            </div>

            <!-- Import Preview -->
            <div v-if="importPreview" class="bg-gray-700/30 rounded-lg p-4">
              <h5 class="font-medium text-white mb-2">Import Preview</h5>
              
              <div v-if="importPreview.type === 'single'" class="space-y-2">
                <div class="text-sm text-gray-300">
                  <strong>Track:</strong> {{ importPreview.name }}
                </div>
                <div class="text-sm text-gray-300">
                  <strong>Entries:</strong> {{ importPreview.entriesCount }}
                </div>
                <div class="text-sm text-gray-300">
                  <strong>Status:</strong> {{ importPreview.isActive ? 'Active' : 'Completed' }}
                </div>
              </div>
              
              <div v-else-if="importPreview.type === 'multiple'" class="space-y-2">
                <div class="text-sm text-gray-300">
                  <strong>Tracks:</strong> {{ importPreview.count }}
                </div>
                <div class="text-sm text-gray-300">
                  <strong>Resources:</strong> {{ importPreview.resourcesCount }}
                </div>
                <div class="space-y-1 mt-2">
                  <div 
                    v-for="track in importPreview.tracks" 
                    :key="track.name"
                    class="text-xs text-gray-400 pl-2"
                  >
                    • {{ track.name }} ({{ track.entriesCount }} entries)
                  </div>
                </div>
              </div>
            </div>

            <!-- Import Options -->
            <div v-if="importPreview && importPreview.type === 'multiple'" class="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
              <div class="flex items-start">
                <IconAlertTriangle size="20" class="text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h5 class="text-yellow-200 font-medium">Resource Settings</h5>
                  <p class="text-yellow-300/80 text-sm mt-1">
                    This import includes resource settings. Your current resource selection will be replaced.
                  </p>
                  <div class="mt-2">
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        v-model="importOptions.replaceResources"
                        class="mr-2 rounded border-gray-600 bg-gray-700 text-blue-600"
                      >
                      <span class="text-sm text-yellow-300">Replace my resource settings</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Import Button -->
            <button
              @click="performImport"
              :disabled="!importValidation.valid || importing"
              class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              <span v-if="importing">
                <IconLoader size="16" class="inline mr-2 animate-spin" />
                Importing...
              </span>
              <span v-else>
                <IconDownload size="16" class="inline mr-2" />
                Import Data
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div 
      v-if="showMessage" 
      class="fixed top-4 right-4 z-60 animate-fade-in"
    >
      <div 
        :class="[
          'px-4 py-3 rounded-lg shadow-lg',
          messageType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        ]"
      >
        <div class="flex items-center">
          <IconCheck v-if="messageType === 'success'" size="16" class="mr-2" />
          <IconX v-else size="16" class="mr-2" />
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  IconShare, IconX, IconUpload, IconDownload, IconCopy, 
  IconAlertTriangle, IconCheck, IconLoader 
} from '@tabler/icons-vue';
import { 
  exportTrack, exportTracks, importTrack, importTracks, 
  validateImportCode as validateCode, previewImport 
} from '@/utils/trImportExport';

const props = defineProps({
  show: Boolean,
  tracks: {
    type: Array,
    default: () => []
  },
  selectedResources: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'import']);

// State
const activeTab = ref('export');
const selectedTrackForExport = ref('');
const exportResult = ref('');
const importCode = ref('');
const importPreview = ref(null);
const importValidation = ref({ valid: false, error: null });
const importing = ref(false);
const showMessage = ref(false);
const message = ref('');
const messageType = ref('success');

const importOptions = ref({
  replaceResources: false
});

// Methods
function exportSingleTrack() {
  try {
    const code = exportTrack(selectedTrackForExport.value);
    exportResult.value = code;
    showSuccessMessage('Track exported successfully!');
  } catch (error) {
    showErrorMessage('Failed to export track: ' + error.message);
  }
}

function exportAllTracks() {
  try {
    const code = exportTracks(props.tracks, props.selectedResources);
    exportResult.value = code;
    showSuccessMessage('All tracks exported successfully!');
  } catch (error) {
    showErrorMessage('Failed to export tracks: ' + error.message);
  }
}

function validateImportCode() {
  importValidation.value = { valid: false, error: null };
  importPreview.value = null;
  
  const code = importCode.value.trim();
  
  if (!code) {
    return;
  }
  
  if (!validateCode(code)) {
    importValidation.value.error = 'Invalid code format';
    return;
  }
  
  try {
    const preview = previewImport(code);
    importPreview.value = preview;
    importValidation.value.valid = true;
  } catch (error) {
    importValidation.value.error = error.message;
  }
}

async function performImport() {
  importing.value = true;
  
  try {
    const code = importCode.value.trim();
    
    if (importPreview.value.type === 'single') {
      const track = importTrack(code);
      emit('import', { type: 'single', track });
    } else {
      const data = importTracks(code);
      emit('import', { 
        type: 'multiple', 
        tracks: data.tracks, 
        resources: data.resources,
        replaceResources: importOptions.value.replaceResources 
      });
    }
    
    showSuccessMessage('Data imported successfully!');
    
    // Reset form
    importCode.value = '';
    importPreview.value = null;
    importValidation.value = { valid: false, error: null };
    
  } catch (error) {
    showErrorMessage('Import failed: ' + error.message);
  } finally {
    importing.value = false;
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSuccessMessage('Code copied to clipboard!');
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showSuccessMessage('Code copied to clipboard!');
  }
}

function showSuccessMessage(msg) {
  message.value = msg;
  messageType.value = 'success';
  showMessage.value = true;
  setTimeout(() => showMessage.value = false, 3000);
}

function showErrorMessage(msg) {
  message.value = msg;
  messageType.value = 'error';
  showMessage.value = true;
  setTimeout(() => showMessage.value = false, 5000);
}

function handleModalClick(event) {
  if (event.target === event.currentTarget) {
    emit('close');
  }
}

// Reset form when modal is closed
watch(() => props.show, (newShow) => {
  if (!newShow) {
    activeTab.value = 'export';
    selectedTrackForExport.value = '';
    exportResult.value = '';
    importCode.value = '';
    importPreview.value = null;
    importValidation.value = { valid: false, error: null };
    importing.value = false;
    showMessage.value = false;
    importOptions.value.replaceResources = false;
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
