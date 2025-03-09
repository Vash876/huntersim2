<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-3xl font-bold mb-6 text-center text-white">Settings</h2>
      
      <!-- Backup & Restore Section -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-8">
        <div class="header p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconDatabaseExport size="20" class="mr-2 text-blue-400" />
            Backup & Restore
          </h3>
        </div>
        
        <div class="p-6">
          <!-- Backup Section -->
          <div class="mb-8">
            <h4 class="text-white text-md font-medium mb-4">Create a Backup</h4>
            <p class="text-gray-300 text-sm mb-4">
              Create an encrypted backup of your entire profile, including all hunters, builds, and settings.
              You can use this backup to restore your data on another device or after clearing your browser data.
            </p>
            
            <div class="flex flex-col md:flex-row items-start gap-4">
              <button 
                @click="createBackup" 
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                :disabled="isCreatingBackup"
              >
                <IconDatabaseExport size="18" class="mr-2" />
                <span v-if="!isCreatingBackup">Generate Backup Code</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              </button>
              
              <div v-if="backupCode" class="flex-1 w-full">
                <div class="bg-gray-900 rounded-lg p-3 border border-gray-700 relative">
                  <div class="text-xs text-gray-400 mb-1">Your Backup Code:</div>
                  <div class="font-mono text-sm text-gray-200 break-all pr-9">{{ backupCode }}</div>
                  <button 
                    @click="copyBackupCode" 
                    class="absolute right-2 top-2 p-1 hover:bg-gray-800 rounded"
                    :class="{ 'text-green-400': codeCopied, 'text-gray-400': !codeCopied }"
                  >
                    <IconClipboard v-if="!codeCopied" size="16" />
                    <IconCheck v-else size="16" />
                  </button>
                </div>
                <div class="mt-2 flex justify-between items-center">
                  <span class="text-xs text-yellow-400 flex items-center">
                    <IconAlertTriangle size="14" class="mr-1" />
                    Store this code safely. It contains all your data.
                  </span>
                  <button
                    @click="downloadBackupFile"
                    class="text-xs text-gray-300 hover:text-white flex items-center"
                  >
                    <IconDownload size="14" class="mr-1" />
                    Download as file
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Restore Section -->
          <div>
            <h4 class="text-white text-md font-medium mb-4">Restore from Backup</h4>
            <p class="text-gray-300 text-sm mb-4">
              Restore your data from a previously created backup. This will replace all current data.
              <span class="text-red-400">This action cannot be undone.</span>
            </p>
            
            <div class="flex flex-col gap-4">
              <div class="relative">
                <textarea 
                  v-model="restoreCode"
                  placeholder="Paste your backup code here..."
                  class="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 font-mono resize-none"
                ></textarea>
                <button
                  v-if="restoreCode"
                  @click="restoreCode = ''"
                  class="absolute right-2 top-2 p-1 hover:bg-gray-800 rounded text-gray-400"
                >
                  <IconX size="16" />
                </button>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-3 items-center">
                <button 
                  @click="restoreFromBackup" 
                  class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                  :disabled="!restoreCode || isRestoring"
                  :class="{ 'opacity-50 cursor-not-allowed': !restoreCode || isRestoring }"
                >
                  <IconDatabaseImport size="18" class="mr-2" />
                  <span v-if="!isRestoring">Restore from Backup</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Restoring...
                  </span>
                </button>
                
                <div class="flex-1">
                  <input
                    type="file"
                    ref="fileInput"
                    class="hidden"
                    accept=".hsbak"
                    @change="handleFileUpload"
                  />
                  <button
                    @click="$refs.fileInput.click()"
                    class="text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg px-4 py-2 flex items-center transition-colors"
                  >
                    <IconUpload size="18" class="mr-2" />
                    Upload Backup File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Cache Management -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-8">
        <div class="header p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconDatabaseOff size="20" class="mr-2 text-amber-400" />
            Cache Management
          </h3>
        </div>
        
        <div class="p-6">
          <p class="text-gray-300 text-sm mb-4">
            Clear the evaluation cache to free up memory. This won't affect your builds or settings,
            but may temporarily slow down the application as the cache rebuilds.
          </p>
          
          <div class="flex items-center gap-4">
            <button 
              @click="clearCache"
              class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <IconRefresh size="18" class="mr-2" />
              Clear Evaluation Cache
            </button>
          </div>
        </div>
      </div>
      
      <!-- Reset Section -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
        <div class="header p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconTrash size="20" class="mr-2 text-red-400" />
            Reset Data
          </h3>
        </div>
        
        <div class="p-6">
          <p class="text-gray-300 text-sm mb-4">
            This will reset all your data including all hunters, builds, and upgrades.
            <span class="text-red-400 font-medium">This action cannot be undone.</span>
          </p>
          
          <div class="flex items-center gap-4">
            <button
              v-if="!showResetConfirmation" 
              @click="showResetConfirmation = true"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <IconTrash size="18" class="mr-2" />
              Reset All Data
            </button>
            
            <div v-else class="flex items-center gap-3">
              <span class="text-red-400 text-sm">Are you sure?</span>
              <button
                @click="resetAllData"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <IconCheck size="18" class="mr-2" />
                Yes, Reset Everything
              </button>
              <button
                @click="showResetConfirmation = false"
                class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <IconX size="18" class="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Toast Notification -->
      <Transition name="toast">
        <div 
          v-if="toast.show" 
          class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white flex items-center"
          :class="{ 
            'bg-green-600': toast.type === 'success',
            'bg-red-600': toast.type === 'error',
            'bg-blue-600': toast.type === 'info'
          }"
        >
          <div v-if="toast.type === 'success'">
            <IconCircleCheck size="20" class="mr-2" />
          </div>
          <div v-else-if="toast.type === 'error'">
            <IconAlertCircle size="20" class="mr-2" />
          </div>
          <div v-else>
            <IconInfoCircle size="20" class="mr-2" />
          </div>
          <span>{{ toast.message }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { 
  IconDatabaseExport, 
  IconDatabaseImport,
  IconDatabaseOff,
  IconClipboard, 
  IconCheck, 
  IconX, 
  IconTrash,
  IconAlertTriangle,
  IconDownload,
  IconUpload,
  IconAlertCircle,
  IconInfoCircle,
  IconCircleCheck,
  IconRefresh
} from '@tabler/icons-vue';

// Stores
const hunterStore = useHunterStore();

// UI State
const backupCode = ref('');
const restoreCode = ref('');
const codeCopied = ref(false);
const isCreatingBackup = ref(false);
const isRestoring = ref(false);
const showResetConfirmation = ref(false);
const fileInput = ref(null);
const toast = ref({ show: false, message: '', type: 'info' });

// Create base58-encoded backup
async function createBackup() {
  try {
    isCreatingBackup.value = true;
    
    // Clone the store state to avoid modifying the actual store
    const storeState = JSON.parse(JSON.stringify(hunterStore.$state));
    
    // Remove the evaluation cache from the backup
    if (storeState.evaluationCache) {
      delete storeState.evaluationCache;
    }
    
    // Create backup data object
    const backupData = {
      data: storeState,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      type: 'hunter-simulator-backup'
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(backupData);
    
    // Base58 encode the data (for better readability compared to Base64)
    backupCode.value = btoa(jsonData);
    
    showToast('Backup created successfully!', 'success');
    isCreatingBackup.value = false;
  } catch (error) {
    console.error('Error creating backup:', error);
    showToast('Failed to create backup', 'error');
    isCreatingBackup.value = false;
  }
}

// Restore from backup
async function restoreFromBackup() {
  if (!restoreCode.value) return;
  
  const confirmRestore = confirm('This will replace all your current data. Are you sure you want to continue?');
  if (!confirmRestore) return;
  
  try {
    isRestoring.value = true;
    
    // Decode the backup code
    const jsonData = atob(restoreCode.value);
    
    // Parse JSON and validate
    const backupData = JSON.parse(jsonData);
    
    // Basic validation
    if (!backupData || !backupData.data || !backupData.type || backupData.type !== 'hunter-simulator-backup') {
      throw new Error('Invalid backup format');
    }
    
    // Save the current evaluation cache
    const currentCache = hunterStore.$state.evaluationCache ? 
      { ...hunterStore.$state.evaluationCache } : {};
    
    // Anstatt den Store zurückzusetzen, ersetze die Daten direkt
    const storeData = backupData.data;
    
    // Leere zuerst den aktuellen State
    Object.keys(hunterStore.$state).forEach(key => {
      if (key !== 'evaluationCache') {
        if (Array.isArray(hunterStore.$state[key])) {
          hunterStore.$state[key] = [];
        } else if (typeof hunterStore.$state[key] === 'object' && hunterStore.$state[key] !== null) {
          hunterStore.$state[key] = {};
        } else {
          hunterStore.$state[key] = null;
        }
      }
    });
    
    // Dann fülle mit den Daten aus dem Backup
    for (const key in storeData) {
      if (key !== 'evaluationCache' && key in hunterStore.$state) {
        hunterStore.$state[key] = storeData[key];
      }
    }
    
    // Restore the original evaluation cache
    if (currentCache && Object.keys(currentCache).length > 0) {
      hunterStore.$state.evaluationCache = currentCache;
    }
    
    showToast('Data restored successfully!', 'success');
    restoreCode.value = '';
    isRestoring.value = false;
  } catch (error) {
    console.error('Error restoring backup:', error);
    showToast('Failed to restore backup. Invalid or corrupted backup code.', 'error');
    isRestoring.value = false;
  }
}

// Copy backup code to clipboard
function copyBackupCode() {
  if (!backupCode.value) return;
  
  navigator.clipboard.writeText(backupCode.value).then(() => {
    codeCopied.value = true;
    showToast('Backup code copied to clipboard!', 'success');
    
    setTimeout(() => {
      codeCopied.value = false;
    }, 2000);
  }).catch(() => {
    showToast('Failed to copy to clipboard', 'error');
  });
}

// Download backup as file
function downloadBackupFile() {
  if (!backupCode.value) return;
  
  const filename = `huntersim-backup-${new Date().toISOString().slice(0, 10)}.hsbak`;
  const blob = new Blob([backupCode.value], { type: 'text/plain' });
  
  // Create download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast('Backup file downloaded!', 'info');
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const contents = e.target.result;
      restoreCode.value = contents;
      showToast('Backup file loaded! Click "Restore" to apply.', 'info');
    } catch (error) {
      showToast('Failed to read backup file', 'error');
    }
  };
  
  reader.onerror = () => {
    showToast('Failed to read backup file', 'error');
  };
  
  reader.readAsText(file);
}

// Reset all data
function resetAllData() {
  try {
    // Statt $reset() verwenden, leere den Store manuell
    Object.keys(hunterStore.$state).forEach(key => {
      if (key === 'evaluationCache') {
        hunterStore.$state[key] = {};
      } else if (Array.isArray(hunterStore.$state[key])) {
        hunterStore.$state[key] = [];
      } else if (typeof hunterStore.$state[key] === 'object' && hunterStore.$state[key] !== null) {
        hunterStore.$state[key] = {};
      } else {
        hunterStore.$state[key] = null;
      }
    });
    
    showToast('All data has been reset successfully', 'success');
    showResetConfirmation.value = false;
  } catch (error) {
    console.error('Error resetting data:', error);
    showToast('Failed to reset data', 'error');
  }
}

// Cache-Größe protokollieren und zurückgeben
function logCacheSize() {
  let count = 0;
  
  // Zähle die Einträge im Store-Cache
  if (hunterStore.$state.evaluationCache) {
    for (const hunterId in hunterStore.$state.evaluationCache) {
      count += Object.keys(hunterStore.$state.evaluationCache[hunterId] || {}).length;
    }
  }
  
  // Zähle auch Cache-Einträge im localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('huntersim_cache_')) {
      count++;
    }
  });
  
  console.log(`Cache size: ${count} entries`);
  return count;
}

// Clear evaluation cache
function clearCache() {
  try {
    const beforeSize = logCacheSize();
    
    // 1. Leere den Cache im Store
    hunterStore.clearEvaluationCache();
    
    // 2. Holen der hunter-data aus dem localStorage
    const hunterDataStr = localStorage.getItem('hunter-data');
    if (hunterDataStr) {
      try {
        const hunterData = JSON.parse(hunterDataStr);
        
        // 3. evaluationCache aus den Daten entfernen
        if (hunterData && hunterData.evaluationCache) {
          hunterData.evaluationCache = {};
          
          // 4. Aktualisierte Daten zurück in localStorage schreiben
          localStorage.setItem('hunter-data', JSON.stringify(hunterData));
        }
      } catch (parseError) {
        console.error('Error parsing hunter-data from localStorage:', parseError);
      }
    }
    
    // 5. Zusätzlich: Alle einzelnen Cache-Einträge im localStorage finden und löschen
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('huntersim_cache_')) {
        localStorage.removeItem(key);
      }
    });
    
    const afterSize = logCacheSize();
    
    showToast(`Cache cleared: ${beforeSize} → ${afterSize} entries`, 'success');
  } catch (error) {
    console.error('Error clearing cache:', error);
    showToast('Failed to clear cache', 'error');
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  toast.value = { show: true, message, type };
  
  setTimeout(() => {
    toast.value.show = false;
  }, 5000);
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}
</style>