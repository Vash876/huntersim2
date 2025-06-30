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
              @click="createBackup" 
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

// UI State
const backupCode = ref('');
const restoreCode = ref('');
const codeCopied = ref(false);
const isCreatingBackup = ref(false);
const isRestoring = ref(false);
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

// Create base58-encoded backup
async function createBackup() {
  try {
    isCreatingBackup.value = true;
    
    // 1. Hunter Simulator Daten (Store-State klonen, um den Store nicht zu verändern)
    const hunterStoreState = JSON.parse(JSON.stringify(hunterStore.$state));
    
    // Evaluation-Cache aus dem Backup entfernen, um die Größe zu reduzieren
    if (hunterStoreState.evaluationCache) {
      delete hunterStoreState.evaluationCache;
    }
    
    // 2. TR-Planner Daten
    const trPlannerData = JSON.parse(JSON.stringify(trPlannerStore.$state));
    
    // 3. Gadget Calculator Daten aus localStorage
    const gadgetCurrentLevels = localStorage.getItem('gadgetCalculator_currentLevels');
    const gadgetTargetLevels = localStorage.getItem('gadgetCalculator_targetLevels');
    const gadgetReferenceBuildId = localStorage.getItem('gadgetCalculator_referenceBuildId');
    
    // 4. Weitere relevante localStorage-Einträge sammeln
    const trPlanOrderIds = localStorage.getItem('trPlanOrderIds');
    const highIterationsMode = localStorage.getItem('huntersim_high_iterations_mode');
    
    // Backup-Datenpaket erstellen
    const backupData = {
      data: {
        hunterStore: hunterStoreState,
        trPlannerStore: trPlannerData,
        localStorage: {
          gadgetCalculator_currentLevels: gadgetCurrentLevels ? JSON.parse(gadgetCurrentLevels) : {},
          gadgetCalculator_targetLevels: gadgetTargetLevels ? JSON.parse(gadgetTargetLevels) : {},
          gadgetCalculator_referenceBuildId: gadgetReferenceBuildId,
          trPlanOrderIds: trPlanOrderIds ? JSON.parse(trPlanOrderIds) : [],
          huntersim_high_iterations_mode: highIterationsMode
        }
      },
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      type: 'hunter-simulator-backup'
    };
    
    // Konvertiere zu JSON-String
    const jsonData = JSON.stringify(backupData);
    
    // Base64-Encoding für den Backup-Code
    backupCode.value = btoa(jsonData);
    
    showToast('Backup created successfully! Includes Hunter Simulator, TR-Planner, and Gadget Calculator data.', 'success');
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
  
  showDialog({
    title: 'Restore Data',
    message: 'This will replace all your current data. Are you sure you want to continue?',
    type: 'warning',
    confirmText: 'Yes, Restore',
    cancelText: 'Cancel',
    onConfirm: async () => {
      try {
        isRestoring.value = true;
        
        // Backup-Code dekodieren
        const jsonData = atob(restoreCode.value);
        
        // JSON parsen und validieren
        const backupData = JSON.parse(jsonData);
        
        // Grundlegende Validierung
        if (!backupData || !backupData.data || !backupData.type || backupData.type !== 'hunter-simulator-backup') {
          throw new Error('Invalid backup format');
        }
        
        // 1. Hunter Store wiederherstellen
        if (backupData.data.hunterStore) {
          // Aktuellen Cache speichern
          const currentCache = hunterStore.$state.evaluationCache ? 
            { ...hunterStore.$state.evaluationCache } : {};
          
          // Store-Daten ersetzen
          const storeData = backupData.data.hunterStore;
          
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
          
          // Mit Backup-Daten füllen
          for (const key in storeData) {
            if (key !== 'evaluationCache' && key in hunterStore.$state) {
              hunterStore.$state[key] = storeData[key];
            }
          }
          
          // Original-Cache wiederherstellen
          if (currentCache && Object.keys(currentCache).length > 0) {
            hunterStore.$state.evaluationCache = currentCache;
          }
        }
        
        // 2. TR-Planner Store wiederherstellen
        if (backupData.data.trPlannerStore) {
          const trPlannerData = backupData.data.trPlannerStore;
          
          // State ersetzen
          Object.keys(trPlannerData).forEach(key => {
            if (key in trPlannerStore.$state) {
              trPlannerStore.$state[key] = trPlannerData[key];
            }
          });
        }
        
        // 3. localStorage-Einträge wiederherstellen
        if (backupData.data.localStorage) {
          const localStorageData = backupData.data.localStorage;
          
          // Gadget-Daten wiederherstellen
          if (localStorageData.gadgetCalculator_currentLevels) {
            localStorage.setItem('gadgetCalculator_currentLevels', 
              JSON.stringify(localStorageData.gadgetCalculator_currentLevels));
          }
          
          if (localStorageData.gadgetCalculator_targetLevels) {
            localStorage.setItem('gadgetCalculator_targetLevels', 
              JSON.stringify(localStorageData.gadgetCalculator_targetLevels));
          }
          
          if (localStorageData.gadgetCalculator_referenceBuildId) {
            localStorage.setItem('gadgetCalculator_referenceBuildId', 
              localStorageData.gadgetCalculator_referenceBuildId);
          }
          
          // TR-Planner Reihenfolge wiederherstellen
          if (localStorageData.trPlanOrderIds) {
            localStorage.setItem('trPlanOrderIds', 
              JSON.stringify(localStorageData.trPlanOrderIds));
          }
          
          // High Iterations Mode wiederherstellen
          if (localStorageData.huntersim_high_iterations_mode !== undefined) {
            localStorage.setItem('huntersim_high_iterations_mode', 
              localStorageData.huntersim_high_iterations_mode);
            
            // UI aktualisieren
            highIterationsEnabled.value = localStorageData.huntersim_high_iterations_mode === 'true';
          }
        }
        
        showToast('All data restored successfully!', 'success');
        restoreCode.value = '';
        isRestoring.value = false;
      } catch (error) {
        console.error('Error restoring backup:', error);
        showToast('Failed to restore backup. Invalid or corrupted backup code.', 'error');
        isRestoring.value = false;
      }
    }
  });
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
    message: 'This will reset all your data including all hunters, builds, TR-Planner data, and Gadget Calculator settings. This action cannot be undone.',
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
    
    // 3. Gadget Calculator und TR-Planner-spezifische localStorage-Einträge löschen
    // Gadget Calculator
    localStorage.removeItem('gadgetCalculator_currentLevels');
    localStorage.removeItem('gadgetCalculator_targetLevels');
    localStorage.removeItem('gadgetCalculator_referenceBuildId');
    
    // TR Planner
    localStorage.removeItem('trPlanOrderIds');
    localStorage.removeItem('tr-planner-data'); // Falls genutzt
    
    // 4. Alle anderen gespeicherten TR-Planner-Pläne suchen und löschen
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('tr-plan-')) {
        localStorage.removeItem(key);
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