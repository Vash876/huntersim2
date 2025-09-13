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
    <!-- Emergency Data Recovery Tool -->
    <!-- <div class="mt-8 text-center">
      <button 
        @click="searchIndexedDB"
        class="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded text-sm"
        :disabled="isSearching"
        style="font-family: monospace;"
      >
        <span v-if="!isSearching">emergency data recovery</span>
        <span v-else>searching...</span>
      </button>
      
      <div v-if="foundData.hasData" class="mt-4 text-left max-w-4xl mx-auto">
        <div v-for="(track, index) in foundData.trTracks" :key="index" class="mb-4 p-3 bg-gray-900 rounded border">
          <div class="text-white font-mono text-sm mb-2">{{ track.name }}</div>
          <textarea 
            :value="generateTrackCode(track)" 
            readonly 
            class="w-full bg-black text-green-400 font-mono text-xs p-2 rounded h-16 resize-none"
            @click="$event.target.select()"
          ></textarea>
          <button 
            @click="copyTrackCode(track, index)"
            class="mt-1 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
          >
            copy
          </button>
        </div>
      </div>
      
      <div v-else-if="searchPerformed && !foundData.hasData" class="mt-4 text-red-400 text-sm font-mono">
        no data found
      </div>
    </div> -->

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
import { useInscryptionPlannerStore } from '@/store/inscryptionPlannerStore';
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
  IconCode
} from '@tabler/icons-vue';

// Stores
const hunterStore = useHunterStore();
const trPlannerStore = useTRPlannerStore();
const trTrackingStore = useTRTrackingStore();
const ultimaStore = useUltimaStore();
const gemPlannerStore = useGemPlannerStore();
const syncStore = useSyncStore();
const inscryptionPlannerStore = useInscryptionPlannerStore();
const { createBackup, restoreFromBackup, isCreatingBackup, isRestoring } = useBackupRestore();

// UI State
const backupCode = ref('');
const restoreCode = ref('');
const codeCopied = ref(false);
const showResetConfirmation = ref(false);
const fileInput = ref(null);
const toast = ref({ show: false, message: '', type: 'info' });
const highIterationsEnabled = ref(false);

// Data Recovery State
const isSearching = ref(false);
const searchPerformed = ref(false);
const foundData = ref({
  hasData: false,
  trTracks: [],
  trEntries: [],
  trSettings: []
}); 

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

// Data Recovery Functions
async function searchIndexedDB() {
  isSearching.value = true;
  searchPerformed.value = true;
  
  try {
    console.log('=== STARTING INDEXEDDB SEARCH ===');
    
    // Reset found data
    foundData.value.trTracks = [];
    foundData.value.trEntries = [];
    foundData.value.trSettings = [];
    foundData.value.hasData = false;
    
    // Open CIFI-Tools-DB (not TRTrackingDB!)
    const dbRequest = indexedDB.open('CIFI-Tools-DB');
    
    dbRequest.onerror = () => {
      console.error('CIFI-Tools-DB database nicht gefunden!');
      isSearching.value = false;
    };
    
    dbRequest.onsuccess = async (event) => {
      const db = event.target.result;
      console.log('Database geöffnet:', db);
      
      // Get all store names
      const storeNames = Array.from(db.objectStoreNames);
      console.log('Gefundene Stores:', storeNames);
      
      // Read all TR Tracking stores
      const stores = ['trTracker_tracks', 'trTracker_entries', 'trTracker_settings'];
      
      for (const storeName of stores) {
        if (storeNames.includes(storeName)) {
          try {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            
            await new Promise((resolve) => {
              const request = store.getAll();
              
              request.onsuccess = () => {
                const data = request.result || [];
                console.log(`${storeName}:`, data);
                
                if (storeName === 'trTracker_tracks') {
                  foundData.value.trTracks = data;
                } else if (storeName === 'trTracker_entries') {
                  foundData.value.trEntries = data;
                } else if (storeName === 'trTracker_settings') {
                  foundData.value.trSettings = data;
                }
                
                resolve();
              };
              
              request.onerror = () => {
                console.error(`Error reading ${storeName}`);
                resolve();
              };
            });
          } catch (error) {
            console.error(`Access error for ${storeName}:`, error);
          }
        } else {
          console.log(`${storeName}: NOT FOUND`);
        }
      }
      
      // Check if we found any data
      const totalItems = foundData.value.trTracks.length + foundData.value.trEntries.length + foundData.value.trSettings.length;
      foundData.value.hasData = totalItems > 0;
      
      console.log(`Total items found: ${totalItems}`);
      
      db.close();
      isSearching.value = false;
    };
    
  } catch (error) {
    console.error('IndexedDB search failed:', error);
    isSearching.value = false;
  }
}

function exportFoundData() {
  if (!foundData.value.hasData) {
    console.log('No data to export');
    return;
  }
  
  try {
    const exportData = {
      timestamp: new Date().toISOString(),
      source: 'indexeddb-recovery',
      data: {
        trTracks: foundData.value.trTracks,
        trEntries: foundData.value.trEntries,
        trSettings: foundData.value.trSettings
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovered-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Data exported successfully!');
    
  } catch (error) {
    console.error('Export failed:', error);
  }
}

// Generate share code for individual track (same logic as ShareTrackModal)
function generateTrackCode(track) {
  try {
    // Find entries for this track from the recovered entries
    const trackEntries = foundData.value.trEntries.filter(entry => entry.trackId === track.id) || [];
    
    // Create a complete shareable version of the track
    const shareableTrack = {
      name: track.name,
      startDate: track.startDate,
      notes: track.notes || '',
      trCount: track.trCount,
      targetGoals: track.targetGoals || {},
      initialValues: track.initialValues || {},
      entries: trackEntries,
      selectedResources: track.selectedResources || [],
      resourceOrder: track.resourceOrder || [],
      isActive: track.isActive,
      createdAt: track.createdAt,
      updatedAt: track.updatedAt,
      version: '2.0'
    };
    
    // Use ultra-compressed format version 2 (like ShareTrackModal)
    const compressed = {
      v: '2', // Version 2 format
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
      o: shareableTrack.resourceOrder, // Note: 'o' not 'ro' for version 2
      a: shareableTrack.isActive ? 1 : 0, // Boolean as number
      c: shareableTrack.createdAt,
      u: shareableTrack.updatedAt
    };
    
    // Base64 encode with URL-safe characters
    const jsonString = JSON.stringify(compressed);
    let encoded = btoa(unescape(encodeURIComponent(jsonString)));
    
    // Make URL-safe and remove padding
    encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    return encoded;
    
  } catch (error) {
    console.error('Failed to generate track code:', error);
    return 'ERROR_GENERATING_CODE';
  }
}

function copyTrackCode(track, index) {
  try {
    const code = generateTrackCode(track);
    navigator.clipboard.writeText(code);
    console.log(`Track code for "${track.name}" copied to clipboard!`);
  } catch (error) {
    console.error('Failed to copy track code:', error);
  }
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
    message: 'This will reset all your data including all hunters, builds, TR-Planner data, Gadget Calculator, Mech Planner, Ultima Calculator, AttrGN3 Calculator, TS Planner, Research Overview, Loop Mod Overview, Inscryption Planner, and all related settings. This action cannot be undone.',
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
async function resetAllData() {
  try {
    console.log('Starting complete data reset...');
    
    // 1. Stores zurücksetzen (behalten die Struktur bei)
    const stores = [hunterStore, trPlannerStore, ultimaStore, gemPlannerStore, inscryptionPlannerStore, syncStore];
    
    stores.forEach(store => {
      Object.keys(store.$state).forEach(key => {
        if (key === 'evaluationCache') {
          store.$state[key] = {};
        } else if (Array.isArray(store.$state[key])) {
          store.$state[key] = [];
        } else if (typeof store.$state[key] === 'object' && store.$state[key] !== null) {
          store.$state[key] = {};
        } else {
          store.$state[key] = null;
        }
      });
    });
    
    // TR-Tracking Store hat spezielle clearAllData Methode
    trTrackingStore.clearAllData();
    
    // 2. Kompletten localStorage löschen
    console.log('Clearing localStorage...');
    localStorage.clear();
    
    // 3. Alle IndexedDB Datenbanken finden und löschen
    console.log('Clearing IndexedDB...');
    if ('indexedDB' in window && indexedDB.databases) {
      try {
        const databases = await indexedDB.databases();
        console.log('Found databases:', databases.map(db => db.name));
        
        // Alle gefundenen Datenbanken löschen
        await Promise.all(
          databases.map(db => {
            return new Promise((resolve, reject) => {
              console.log(`Deleting database: ${db.name}`);
              const deleteReq = indexedDB.deleteDatabase(db.name);
              deleteReq.onsuccess = () => {
                console.log(`✓ Deleted database: ${db.name}`);
                resolve();
              };
              deleteReq.onerror = (error) => {
                console.warn(`⚠ Failed to delete database ${db.name}:`, error);
                resolve(); // Continue even if one fails
              };
              deleteReq.onblocked = () => {
                console.warn(`⚠ Database deletion blocked: ${db.name}`);
                resolve(); // Continue even if blocked
              };
            });
          })
        );
      } catch (error) {
        console.warn('Could not enumerate/delete IndexedDB databases:', error);
        
        // Fallback: Versuche bekannte Datenbanken zu löschen
        const knownDatabases = ['TRTrackingDB', 'CIFI-Tools-DB'];
        await Promise.all(
          knownDatabases.map(dbName => {
            return new Promise((resolve) => {
              console.log(`Fallback: Deleting known database: ${dbName}`);
              const deleteReq = indexedDB.deleteDatabase(dbName);
              deleteReq.onsuccess = () => {
                console.log(`✓ Deleted known database: ${dbName}`);
                resolve();
              };
              deleteReq.onerror = () => {
                console.log(`⚠ Known database ${dbName} not found or could not be deleted`);
                resolve();
              };
            });
          })
        );
      }
    }
    
    console.log('Data reset completed successfully');
    showToast('All data has been reset successfully - localStorage and IndexedDB cleared', 'success');
    showResetConfirmation.value = false;
    
    // Nach dem Reset die Seite neu laden, damit alle Stores sauber initialisiert werden
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    
  } catch (error) {
    console.error('Error resetting data:', error);
    showToast('Failed to reset data completely - check console for details', 'error');
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