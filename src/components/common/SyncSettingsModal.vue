<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      @click="closeModal"
    ></div>
    
    <!-- Modal -->
    <div class="relative bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Sync-Einstellungen</h3>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <!-- Auto Sync Toggle -->
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-300">Automatische Synchronisation</label>
          <button
            @click="toggleAutoSync"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              autoSyncEnabled ? 'bg-blue-600' : 'bg-gray-600'
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>

        <!-- Sync Interval -->
        <div class="space-y-2">
          <label class="text-sm text-gray-300">Sync-Intervall</label>
          <select 
            v-model="syncInterval"
            class="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
            :disabled="!autoSyncEnabled"
          >
            <option value="60000">1 Minute</option>
            <option value="300000">5 Minuten</option>
            <option value="600000">10 Minuten</option>
            <option value="1800000">30 Minuten</option>
          </select>
        </div>

        <!-- Conflict Resolution -->
        <div class="space-y-2">
          <label class="text-sm text-gray-300">Konfliktauflösung</label>
          <select 
            v-model="conflictResolution"
            class="w-full bg-slate-700 text-white rounded px-3 py-2 text-sm"
          >
            <option value="server">Server-Daten bevorzugen</option>
            <option value="local">Lokale Daten bevorzugen</option>
            <option value="manual">Manuell entscheiden</option>
          </select>
        </div>

        <!-- Data to Sync -->
        <div class="space-y-3">
          <label class="text-sm text-gray-300">Daten synchronisieren</label>
          
          <div class="space-y-2">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="syncHunterData"
                class="mr-2 rounded bg-slate-700 border-slate-600"
              >
              <span class="text-sm text-gray-300">Hunter Builds & Stats</span>
            </label>
            
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="syncTRData"
                class="mr-2 rounded bg-slate-700 border-slate-600"
              >
              <span class="text-sm text-gray-300">TR Planner Daten</span>
            </label>
            
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="syncSettings"
                class="mr-2 rounded bg-slate-700 border-slate-600"
              >
              <span class="text-sm text-gray-300">App-Einstellungen</span>
            </label>
          </div>
        </div>

        <!-- Last Sync Info -->
        <div class="pt-4 border-t border-slate-700">
          <div class="text-xs text-gray-400 space-y-1">
            <div v-if="syncStore.lastSyncTime">
              Letzte Sync: {{ formatLastSync }}
            </div>
            <div v-if="syncStore.syncError" class="text-red-400">
              Fehler: {{ syncStore.syncError }}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 mt-6">
        <button
          @click="forceSyncNow"
          :disabled="syncStore.isSyncing"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          <span v-if="!syncStore.isSyncing">Jetzt synchronisieren</span>
          <span v-else>Synchronisiere...</span>
        </button>
        
        <button
          @click="saveSettings"
          class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconX } from '@tabler/icons-vue';
import { useSyncStore } from '@/store/syncStore';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close', 'settings-changed']);

// Store
const syncStore = useSyncStore();

// Local Settings State
const autoSyncEnabled = ref(true);
const syncInterval = ref(300000); // 5 Minuten default
const conflictResolution = ref('server');
const syncHunterData = ref(true);
const syncTRData = ref(true);
const syncSettings = ref(true);

// Computed
const formatLastSync = computed(() => {
  if (!syncStore.lastSyncTime) return 'Nie';
  const date = new Date(syncStore.lastSyncTime);
  return date.toLocaleString('de-DE');
});

// Methods
function closeModal() {
  emit('close');
}

function toggleAutoSync() {
  autoSyncEnabled.value = !autoSyncEnabled.value;
}

async function forceSyncNow() {
  try {
    await syncStore.fullSync();
  } catch (error) {
    console.error('Manual sync failed:', error);
  }
}

function saveSettings() {
  // Save settings to localStorage
  const settings = {
    autoSyncEnabled: autoSyncEnabled.value,
    syncInterval: syncInterval.value,
    conflictResolution: conflictResolution.value,
    syncHunterData: syncHunterData.value,
    syncTRData: syncTRData.value,
    syncSettings: syncSettings.value
  };
  
  localStorage.setItem('cifi-sync-settings', JSON.stringify(settings));
  
  // Update sync store conflict resolution
  syncStore.conflictResolution = conflictResolution.value;
  
  emit('settings-changed', settings);
  closeModal();
}

function loadSettings() {
  const stored = localStorage.getItem('cifi-sync-settings');
  if (stored) {
    const settings = JSON.parse(stored);
    autoSyncEnabled.value = settings.autoSyncEnabled ?? true;
    syncInterval.value = settings.syncInterval ?? 300000;
    conflictResolution.value = settings.conflictResolution ?? 'server';
    syncHunterData.value = settings.syncHunterData ?? true;
    syncTRData.value = settings.syncTRData ?? true;
    syncSettings.value = settings.syncSettings ?? true;
  }
}

// Load settings when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadSettings();
  }
});
</script>
