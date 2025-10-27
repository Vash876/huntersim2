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

      <!-- Storage Issues Section -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-8">
        <div class="header p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconWand size="20" class="mr-2 text-orange-400" />
            Storage Issues
          </h3>
        </div>
        
        <div class="p-6">

            <div class="flex items-start gap-3">
              <div class="flex-1">
                <h4 class="text-white text-lg font-semibold mb-2">Quick Fix Storage</h4>
                <p class="text-gray-300 text-sm mb-1">
                  If you experience data loss on page refresh or storage warnings, use this quick fix.
                  It will automatically backup your data, reset the storage, and restore everything - 
                  often resolving storage quota issues.
                </p>
                <p class="text-gray-400 text-xs mb-3">
                  Current usage: {{ storageUsageMB.toFixed(2) }} / {{ storageLimitMB }} MB
                </p>
                <button 
                  @click="quickFixStorage" 
                  class="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-2.5 rounded-lg flex items-center transition-all shadow-lg font-medium"
                  :disabled="isQuickFixing"
                >
                  <IconWand size="20" class="mr-2" />
                  <span v-if="!isQuickFixing">Quick Fix Storage Issues</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fixing... ({{ quickFixStep }})
                  </span>
                </button>
                
                <!-- Quick Fix Progress -->
                <div v-if="quickFixProgress" class="mt-3 text-xs text-gray-300 space-y-1">
                  <div v-for="(step, idx) in quickFixProgress" :key="idx" class="flex items-center gap-2">
                    <IconCheck v-if="step.done" size="14" class="text-green-400" />
                    <div v-else class="w-3.5 h-3.5 border-2 border-gray-500 rounded-full animate-spin"></div>
                    <span>{{ step.text }}</span>
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
      
      <!-- Hunter Level Settings Section -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-8">
        <div class="header p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconShield size="20" class="mr-2 text-purple-400" />
            Advanced Talents Settings
          </h3>
        </div>
        
        <div class="p-6">
          <p class="text-gray-300 text-sm mb-6">
            Advanced talents like "The Legacy of Ultima" are only available at Hunter Level 70+.
            These settings control when those talents are shown to provide a beginner-friendly experience.
          </p>
          
          <!-- Hunter Settings Grid -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Borge Settings -->
            <div class="bg-gray-900/50 rounded-lg border border-gray-700/30 p-4">
              <div class="flex items-center gap-3 mb-4">
                <img src="/src/assets/borge/hunter_small.png" alt="Borge" class="w-8 h-10 rounded-full">
                <div>
                  <h4 class="text-white font-medium">Borge</h4>
                  <p class="text-xs text-gray-400">
                    Highest Level: {{ getBorgeSettings.highestLevelReached || 0 }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm text-gray-300">Show Advanced Talents</span>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ getBorgeSettings.highestLevelReached >= 70 ? 'Level 70+ reached - can toggle manually' : 'Manual toggle' }}
                  </p>
                </div>
                <button 
                  @click="toggleHunterAdvancedTalents('borge')"
                  class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                  :class="{
                    'bg-red-600': getBorgeSettings.showAdvancedTalents,
                    'bg-gray-600': !getBorgeSettings.showAdvancedTalents
                  }"
                >
                  <span 
                    class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                    :class="{
                      'translate-x-6': getBorgeSettings.showAdvancedTalents,
                      'translate-x-1': !getBorgeSettings.showAdvancedTalents
                    }"
                  />
                </button>
              </div>
            </div>

            <!-- Ozzy Settings -->
            <div class="bg-gray-900/50 rounded-lg border border-gray-700/30 p-4">
              <div class="flex items-center gap-3 mb-4">
                <img src="/src/assets/ozzy/hunter_small.png" alt="Ozzy" class="w-8 h-10 rounded-full">
                <div>
                  <h4 class="text-white font-medium">Ozzy</h4>
                  <p class="text-xs text-gray-400">
                    Highest Level: {{ getOzzySettings.highestLevelReached || 0 }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm text-gray-300">Show Advanced Talents</span>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ getOzzySettings.highestLevelReached >= 70 ? 'Level 70+ reached - can toggle manually' : 'Manual toggle' }}
                  </p>
                </div>
                <button 
                  @click="toggleHunterAdvancedTalents('ozzy')"
                  class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                  :class="{
                    'bg-green-600': getOzzySettings.showAdvancedTalents,
                    'bg-gray-600': !getOzzySettings.showAdvancedTalents
                  }"
                >
                  <span 
                    class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                    :class="{
                      'translate-x-6': getOzzySettings.showAdvancedTalents,
                      'translate-x-1': !getOzzySettings.showAdvancedTalents
                    }"
                  />
                </button>
              </div>
            </div>

            <!-- Knox Settings -->
            <div class="bg-gray-900/50 rounded-lg border border-gray-700/30 p-4">
              <div class="flex items-center gap-3 mb-4">
                <img src="/src/assets/knox/hunter_small.png" alt="Knox" class="w-8 h-10 rounded-full">
                <div>
                  <h4 class="text-white font-medium">Knox</h4>
                  <p class="text-xs text-gray-400">
                    Highest Level: {{ getKnoxSettings.highestLevelReached || 0 }}
                  </p>
                </div>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm text-gray-300">Show Advanced Talents</span>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ getKnoxSettings.highestLevelReached >= 70 ? 'Level 70+ reached - can toggle manually' : 'Manual toggle' }}
                  </p>
                </div>
                <button 
                  @click="toggleHunterAdvancedTalents('knox')"
                  class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                  :class="{
                    'bg-blue-600': getKnoxSettings.showAdvancedTalents,
                    'bg-gray-600': !getKnoxSettings.showAdvancedTalents
                  }"
                >
                  <span 
                    class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                    :class="{
                      'translate-x-6': getKnoxSettings.showAdvancedTalents,
                      'translate-x-1': !getKnoxSettings.showAdvancedTalents
                    }"
                  />
                </button>
              </div>
            </div> 
          </div>
          
          <div class="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
            <div class="flex items-start gap-3">
              <IconInfoCircle size="16" class="text-blue-400 mt-0.5 flex-shrink-0" />
              <div class="text-sm text-gray-300">
                <p class="font-medium mb-1">How it works:</p>
                <ul class="text-xs text-gray-400 space-y-1">
                  <li>• Advanced talents are automatically shown when you reach Level 70 with any hunter</li>
                  <li>• You can manually enable or disable this setting at any time</li>
                  <li>• The setting persists even after reaching Level 70+</li>
                  <li>• The highest level reached is detected from your existing builds</li>
                  <li>• Each hunter has individual settings</li>
                </ul>
              </div>
            </div>
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

      <!-- Interface Settings -->
      <!-- <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mt-8">
        <div class="header p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconAdjustments size="20" class="mr-2 text-emerald-400" />
            Interface Settings
          </h3>
        </div>
        
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <div>
              <h4 class="text-white text-md font-medium">FAQ Help System</h4>
              <p class="text-gray-300 text-sm mt-1">
                Show contextual help and FAQ for the current page.
                The FAQ content adapts to the page you're currently viewing.
              </p>
            </div>
            <div class="flex items-center">
              <button 
                @click="faqStore.toggleEnabled" 
                class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                :class="{
                  'bg-emerald-600': faqStore.isEnabled,
                  'bg-gray-600': !faqStore.isEnabled
                }"
              >
                <span 
                  class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                  :class="{
                    'translate-x-6': faqStore.isEnabled,
                    'translate-x-1': !faqStore.isEnabled
                  }"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div> -->

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
    </div>  -->

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
import { ref, onMounted, computed } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { useTRPlannerStore } from '@/store/orbStore';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { useUltimaStore } from '@/store/ultimaStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useSyncStore } from '@/store/syncStore';
import { useInscryptionPlannerStore } from '@/store/inscryptionPlannerStore';
// import { useFAQStore } from '@/store/faqStore';
import { useBackupRestore } from '@/composables/useBackupRestore';
import { checkLocalStorageQuota } from '@/utils/storageCheck';
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
  IconCode,
  IconAdjustments,
  IconQuestionMark,
  IconShield,
  IconWand
} from '@tabler/icons-vue';

// Stores
const hunterStore = useHunterStore();
const trPlannerStore = useTRPlannerStore();
const trTrackingStore = useTRTrackingStore();
const ultimaStore = useUltimaStore();
const gemPlannerStore = useGemPlannerStore();
const syncStore = useSyncStore();
const inscryptionPlannerStore = useInscryptionPlannerStore();
// const faqStore = useFAQStore();
const { createBackup, restoreFromBackup, isCreatingBackup, isRestoring } = useBackupRestore();

// UI State
const backupCode = ref('');
const restoreCode = ref('');
const codeCopied = ref(false);
const showResetConfirmation = ref(false);
const fileInput = ref(null);
const toast = ref({ show: false, message: '', type: 'info' });
const highIterationsEnabled = ref(false);

// Quick Fix Storage state
const isQuickFixing = ref(false);
const quickFixStep = ref('');
const quickFixProgress = ref(null);
const storageUsageMB = ref(0);
const storageLimitMB = ref(0);

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
onMounted(async () => {
  // Bestehendes onMounted-Setup
  
  // High Iterations Mode aus dem localStorage laden
  const highIterationsMode = localStorage.getItem('huntersim_high_iterations_mode');
  highIterationsEnabled.value = highIterationsMode === 'true';
  
  // Initialisiere Hunter Level Settings beim Start
  hunterStore.initHunterLevelSettings('borge');
  hunterStore.initHunterLevelSettings('ozzy');
  hunterStore.initHunterLevelSettings('knox');
  
  // Scanne alle Hunter nach höchstem Level
  hunterStore.scanBuildsForHighestLevel('borge');
  hunterStore.scanBuildsForHighestLevel('ozzy');
  hunterStore.scanBuildsForHighestLevel('knox');
  
  // Load current storage usage
  try {
    const storageCheck = await checkLocalStorageQuota();
    storageUsageMB.value = storageCheck.sizeMB || 0;
    storageLimitMB.value = storageCheck.limitMB || 5;
  } catch (error) {
    console.error('Failed to check storage:', error);
  }
});

// Computed properties für Hunter Level Settings
const getBorgeSettings = computed(() => {
  return hunterStore.getHunterLevelSettings('borge') || {
    highestLevelReached: 0,
    showAdvancedTalents: false,
    manualOverride: false
  };
});

const getOzzySettings = computed(() => {
  return hunterStore.getHunterLevelSettings('ozzy') || {
    highestLevelReached: 0,
    showAdvancedTalents: false,
    manualOverride: false
  };
});

const getKnoxSettings = computed(() => {
  return hunterStore.getHunterLevelSettings('knox') || {
    highestLevelReached: 0,
    showAdvancedTalents: false,
    manualOverride: false
  };
});

// Hunter Level Settings Funktionen
function toggleHunterAdvancedTalents(hunterId) {
  const currentSettings = hunterStore.getHunterLevelSettings(hunterId);
  const newState = !currentSettings.showAdvancedTalents;
  
  hunterStore.toggleAdvancedTalents(hunterId, newState);
  
  // Toast anzeigen
  const actionText = newState ? 'enabled' : 'disabled';
  const hunterName = hunterId.charAt(0).toUpperCase() + hunterId.slice(1);
  showToast(`Advanced talents ${actionText} for ${hunterName}`, 'success');
}

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

// Quick Fix Storage - combines backup, reset, and restore
// Uses reliable syncStore functions (battle-tested for cloud sync)
async function quickFixStorage() {
  if (isQuickFixing.value) return;
  
  // Ask for confirmation using custom dialog
  showDialog({
    title: 'Quick Fix Storage',
    message: 'This will backup your data, reset storage, and restore everything.\n\nThis often fixes storage quota issues and data loss problems.\n\nThe page will reload automatically after the process.\n\nContinue?',
    type: 'warning',
    confirmText: 'Yes, Fix Storage',
    cancelText: 'Cancel',
    onConfirm: executeQuickFix
  });
}

async function executeQuickFix() {
  isQuickFixing.value = true;
  quickFixProgress.value = [
    { text: 'Creating backup...', done: false },
    { text: 'Preparing restore...', done: false },
    { text: 'Page will reload...', done: false }
  ];
  
  let backupCode = null;
  
  try {
    // Step 1: Create backup using syncStore function
    quickFixStep.value = 'Backing up';
    console.log('🔧 Quick Fix: Creating backup with syncStore...');
    
    backupCode = await syncStore.createLocalBackup();
    if (!backupCode || typeof backupCode !== 'string') {
      throw new Error('Failed to create backup - invalid backup code');
    }
    
    console.log('✅ Backup created:', backupCode.substring(0, 50) + '...');
    quickFixProgress.value[0].done = true;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 2: Store backup in sessionStorage (survives page reload)
    quickFixStep.value = 'Preparing restore';
    console.log('🔧 Quick Fix: Storing backup for restore after reload...');
    sessionStorage.setItem('quickfix_backup', backupCode);
    sessionStorage.setItem('quickfix_restore_pending', 'true');
    
    quickFixProgress.value[1].done = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Step 3: Clear localStorage and reload
    quickFixStep.value = 'Resetting';
    console.log('🔧 Quick Fix: Clearing localStorage and reloading...');
    
    localStorage.clear();
    console.log('✅ localStorage cleared');
    
    quickFixProgress.value[2].done = true;
    
    // Show message and reload
    showToast('Reloading page to complete storage fix...', 'info');
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('Quick Fix failed:', error);
    showToast('Quick fix failed: ' + error.message, 'error');
    
    // Clean up
    sessionStorage.removeItem('quickfix_backup');
    sessionStorage.removeItem('quickfix_restore_pending');
    
    isQuickFixing.value = false;
    quickFixProgress.value = null;
  }
}

function showResetDataDialog() {
  showDialog({
    title: 'Reset All Data',
    message: 'This will reset all your data. This action cannot be undone.',
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

  setTimeout(() => {
    window.location.reload();
  }, 1500);
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