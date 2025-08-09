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
          
          <div class="flex flex-col gap-4">
            <button 
              @click="createBackupWrapper" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors w-fit"
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
            
            <!-- Backup Code Textarea (nur anzeigen wenn Code vorhanden) -->
            <div v-if="backupCode" class="w-full">
              <div class="bg-gray-900 rounded-lg p-3 border border-gray-700 relative">
                <div class="text-xs text-gray-400 mb-1">Your Backup Code:</div>
                <textarea 
                  :value="backupCode"
                  readonly
                  class="w-full h-32 bg-transparent border-none resize-none text-sm text-gray-200 font-mono pr-9 focus:outline-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                  style="overflow-y: auto; word-break: break-all;"
                ></textarea>
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
                  @click="restoreFromBackupWrapper" 
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
              @click="showResetDataDialog" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <IconTrash size="18" class="mr-2" />
              Reset All Data
            </button>
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

      <!-- Enthusiast Mode -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mt-8">
        <div class="header p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconCode size="20" class="mr-2 text-purple-400" />
            Enthusiast Mode
          </h3>
        </div>
        
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4 class="text-white text-md font-medium">Enable High Iterations Mode</h4>
              <p class="text-gray-300 text-sm mt-1">
                Allows setting iterations up to 100,000 in build evaluation for higher precision results.
                <span class="text-amber-400">Note: Higher iterations require significantly more processing time.</span>
              </p>
            </div>
            <div class="flex items-center">
              <button 
                @click="toggleHighIterationsMode" 
                class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                :class="{
                  'bg-purple-600': highIterationsEnabled,
                  'bg-gray-600': !highIterationsEnabled
                }"
              >
                <span 
                  class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  :class="{
                    'translate-x-6': highIterationsEnabled,
                    'translate-x-1': !highIterationsEnabled
                  }"
                ></span>
              </button>
            </div>
          </div>

          <div v-if="highIterationsEnabled" class="mt-3 p-3 bg-purple-900/30 rounded-lg border border-purple-900/50">
            <div class="flex items-center text-xs text-purple-300">
              <IconAlertTriangle size="14" class="mr-1.5" />
              High iterations mode is enabled. You can now set up to 100,000 iterations for more accurate evaluations.
            </div>
          </div>
        </div>
      </div>
    </div>

    <AlertDialog
      :is-visible="alertDialog.isVisible"
      :title="alertDialog.title"
      :message="alertDialog.message"
      :type="alertDialog.type"
      :show-cancel="alertDialog.showCancel"
      :confirm-text="alertDialog.confirmText"
      :cancel-text="alertDialog.cancelText"
      @confirm="confirmDialog"
      @cancel="cancelDialog"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { useTRPlannerStore } from '@/store/orbStore';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { useUltimaStore } from '@/store/ultimaStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useSyncStore } from '@/store/syncStore';
import { useBackupRestore } from '@/composables/useBackupRestore';
import AlertDialog from '@/components/common/AlertDialog.vue';
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
  IconRefresh,
  IconCode // Neues Icon
} from '@tabler/icons-vue';

// Stores
const hunterStore = useHunterStore();
const trPlannerStore = useTRPlannerStore();
const trTrackingStore = useTRTrackingStore();
const ultimaStore = useUltimaStore();
const gemPlannerStore = useGemPlannerStore();
const syncStore = useSyncStore();
const { createBackup, restoreFromBackup, isCreatingBackup, isRestoring } = useBackupRestore();

// UI State
const backupCode = ref('');
const restoreCode = ref('');
const codeCopied = ref(false);
const showResetConfirmation = ref(false);
const fileInput = ref(null);
const toast = ref({ show: false, message: '', type: 'info' });
const highIterationsEnabled = ref(false); 

// AlertDialog-States
const alertDialog = ref({
  isVisible: false,
  title: '',
  message: '',
  type: 'info',
  showCancel: true,
  confirmText: 'OK',
  cancelText: 'Cancel',
  onConfirm: null
});

// Initialisieren der highIterationsEnabled-Variable aus localStorage
onMounted(() => {
  // Bestehendes onMounted-Setup
  
  // High Iterations Mode aus dem localStorage laden
  const highIterationsMode = localStorage.getItem('huntersim_high_iterations_mode');
  highIterationsEnabled.value = highIterationsMode === 'true';
});

// Dialog-Funktionen
function showDialog(options) {
  alertDialog.value = {
    isVisible: true,
    title: options.title || 'Alert',
    message: options.message || '',
    type: options.type || 'info',
    showCancel: options.showCancel !== undefined ? options.showCancel : true,
    confirmText: options.confirmText || 'OK',
    cancelText: options.cancelText || 'Cancel',
    onConfirm: options.onConfirm || null
  };
}

function confirmDialog() {
  if (alertDialog.value.onConfirm) {
    alertDialog.value.onConfirm();
  }
  alertDialog.value.isVisible = false;
}

function cancelDialog() {
  alertDialog.value.isVisible = false;
}

// Toggle High Iterations Mode
function toggleHighIterationsMode() {
  highIterationsEnabled.value = !highIterationsEnabled.value;
  
  // In localStorage speichern
  localStorage.setItem('huntersim_high_iterations_mode', highIterationsEnabled.value);
  
  // Benachrichtigung anzeigen
  if (highIterationsEnabled.value) {
    showToast('High iterations mode enabled - Up to 100,000 iterations available', 'info');
  } else {
    showToast('High iterations mode disabled - Max iterations reset to 4,000', 'info');
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

function showResetDataDialog() {
  showDialog({
    title: 'Reset All Data',
    message: 'This will reset all your data including all hunters, builds, TR-Planner data, Gadget Calculator, Mech Planner, Ultima Calculator, AttrGN3 Calculator, TS Planner, Research Overview, and Loop Mod Overview settings. This action cannot be undone.',
    type: 'error',
    confirmText: 'Yes, Reset Everything',
    cancelText: 'Cancel',
    onConfirm: resetAllData
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
    // 1. Hunter Store zurücksetzen
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
    
    // 2. TR-Planner Store zurücksetzen
    Object.keys(trPlannerStore.$state).forEach(key => {
      if (Array.isArray(trPlannerStore.$state[key])) {
        trPlannerStore.$state[key] = [];
      } else if (typeof trPlannerStore.$state[key] === 'object' && trPlannerStore.$state[key] !== null) {
        trPlannerStore.$state[key] = {};
      } else {
        trPlannerStore.$state[key] = null;
      }
    });
    
    // 3. TR-Tracking Store zurücksetzen
    trTrackingStore.clearAllData();
    
    // 4. Ultima Calculator Store zurücksetzen
    Object.keys(ultimaStore.$state).forEach(key => {
      if (Array.isArray(ultimaStore.$state[key])) {
        ultimaStore.$state[key] = [];
      } else if (typeof ultimaStore.$state[key] === 'object' && ultimaStore.$state[key] !== null) {
        ultimaStore.$state[key] = {};
      } else {
        ultimaStore.$state[key] = null;
      }
    });
    
    // 5. Gem Planner Store zurücksetzen
    Object.keys(gemPlannerStore.$state).forEach(key => {
      if (Array.isArray(gemPlannerStore.$state[key])) {
        gemPlannerStore.$state[key] = [];
      } else if (typeof gemPlannerStore.$state[key] === 'object' && gemPlannerStore.$state[key] !== null) {
        gemPlannerStore.$state[key] = {};
      } else {
        gemPlannerStore.$state[key] = null;
      }
    });
    
    // 6. Sync Store zurücksetzen
    Object.keys(syncStore.$state).forEach(key => {
      if (Array.isArray(syncStore.$state[key])) {
        syncStore.$state[key] = [];
      } else if (typeof syncStore.$state[key] === 'object' && syncStore.$state[key] !== null) {
        syncStore.$state[key] = {};
      } else {
        syncStore.$state[key] = null;
      }
    });
    
    // 7. Tool-spezifische localStorage-Einträge löschen
    // Gadget Calculator
    localStorage.removeItem('gadgetCalculator_currentLevels');
    localStorage.removeItem('gadgetCalculator_targetLevels');
    localStorage.removeItem('gadgetCalculator_referenceBuildId');
    
    // Mech Planner
    localStorage.removeItem('mechPlanner_settings');
    
    // AttrGN3 Calculator
    localStorage.removeItem('attrGN3Calculator_settings');
    
    // TS Planner
    localStorage.removeItem('traitSpherePlanner_settings');
    
    // Research Overview
    localStorage.removeItem('researchOverview_filters');
    
    // Loop Mod Overview
    localStorage.removeItem('loopModOverview_filters');
    
    // M0 Cost Overview
    localStorage.removeItem('m0CostOverview_filters');
    
    // TR Planner
    localStorage.removeItem('trPlanOrderIds');
    localStorage.removeItem('tr-planner-data');
    localStorage.removeItem('trplanner_userstats');
    localStorage.removeItem('gemData');
    
    // TR Tracking
    localStorage.removeItem('tr_tracking_selected_resources');
    localStorage.removeItem('tr_tracking_tracks');
    localStorage.removeItem('tr_tracking_custom_resources');
    localStorage.removeItem('tr_data_migration_completed');
    
    // Gems und andere UI-Einstellungen
    localStorage.removeItem('gems_showOnlySimRelevant');
    localStorage.removeItem('fragments_per_day');
    localStorage.removeItem('huntersim_high_iterations_mode');
    
    // Override Modal Settings
    localStorage.removeItem('hideMaxedUpgrades');
    
    // Alle TR-Planner-Pläne und Hunter-Filter löschen
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('tr-plan-') || 
          key.startsWith('lootFilters_') ||
          key.startsWith('huntersim_cache_')) {
        localStorage.removeItem(key);
      }
    });
    
    // IndexedDB komplett löschen (falls vorhanden)
    if ('indexedDB' in window) {
      try {
        // TR Tracking Database löschen
        indexedDB.deleteDatabase('TRTrackingDB');
        console.log('IndexedDB TRTrackingDB deleted');
      } catch (error) {
        console.warn('Could not delete IndexedDB:', error);
      }
    }
    
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

// Create backup using composable
async function createBackupWrapper() {
  try {
    const backup = await createBackup();
    backupCode.value = backup;
    showToast('Backup created successfully!', 'success');
  } catch (error) {
    console.error('Error creating backup:', error);
    showToast('Failed to create backup', 'error');
  }
}

// Restore from backup using composable
async function restoreFromBackupWrapper() {
  if (!restoreCode.value) return;
  
  showDialog({
    title: 'Restore Data',
    message: 'This will replace all your current data. Are you sure you want to continue?',
    type: 'warning',
    confirmText: 'Yes, Restore',
    cancelText: 'Cancel',
    onConfirm: async () => {
      try {
        await restoreFromBackup(restoreCode.value);
        showToast('All data restored successfully!', 'success');
        restoreCode.value = '';
        
        // Update UI state after restore
        const highIterationsMode = localStorage.getItem('huntersim_high_iterations_mode');
        highIterationsEnabled.value = highIterationsMode === 'true';
      } catch (error) {
        console.error('Error restoring backup:', error);
        showToast('Failed to restore backup. Invalid or corrupted backup code.', 'error');
      }
    }
  });
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