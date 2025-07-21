<template>
  <!-- Manual Sync Bar - Only visible when authenticated -->
  <div 
    v-if="syncStore.isAuthenticated"
    class="bg-slate-800/80 border-b border-slate-700/50 px-4 py-3"
  >
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      
      <!-- Left: User Info -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {{ syncStore.userDisplayName.charAt(0).toUpperCase() }}
          </div>
          <div>
            <div class="text-sm text-white font-medium">{{ syncStore.userDisplayName }}</div>
            <div v-if="syncStore.lastSyncTime" class="text-xs text-gray-400">
              Last Sync: {{ formatLastSync }}
            </div>
            <div v-else class="text-xs text-gray-400">
              Not synced yet
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Manual Sync Buttons -->
      <div class="flex items-center space-x-3">
        
        <!-- Upload Button (Lokale Daten hochladen) -->
        <button
          @click="uploadData"
          :disabled="syncStore.isSyncing"
          class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-[120px] justify-center"
          title="Lokale Daten zu Server hochladen"
        >
          <IconCloudUp size="16" />
          <span>{{ syncStore.isSyncing ? 'Loading...' : 'Upload' }}</span>
        </button>

        <!-- Download Button (Server Daten herunterladen) -->
        <button
          @click="downloadData"
          :disabled="syncStore.isSyncing"
          class="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-[120px] justify-center"
          title="Download data from server"
        >
          <IconCloudDown size="16" />
          <span>{{ syncStore.isSyncing ? 'Loading...' : 'Download' }}</span>
        </button>

        <!-- Full Sync Button (Beide Richtungen) -->
        <button
          @click="fullSync"
          :disabled="syncStore.isSyncing"
          class="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors min-w-[120px] justify-center"
          title="Full synchronization"
        >
          <IconRefresh size="16" :class="{ 'animate-spin': syncStore.isSyncing }" />
          <span>{{ syncStore.isSyncing ? 'Syncing...' : 'Full Sync' }}</span>
        </button>
      </div>

      <!-- Right: Account Menu -->
      <div class="flex items-center space-x-2">
        <!-- Sync Status Indicator -->
        <div class="flex items-center space-x-2">
          <div 
            :class="[
              'w-3 h-3 rounded-full',
              syncStore.syncStatus === 'success' ? 'bg-green-400' :
              syncStore.syncStatus === 'error' ? 'bg-red-400' :
              syncStore.isSyncing ? 'bg-blue-400 animate-pulse' :
              'bg-gray-400'
            ]"
          ></div>
          <span class="text-xs text-gray-400">
            {{ getSyncStatusText() }}
          </span>
        </div>

        <!-- Settings & Logout -->
        <div class="relative">
          <button
            @click="showAccountMenu = !showAccountMenu"
            class="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <IconDotsVertical size="16" class="text-gray-400 hover:text-white" />
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="showAccountMenu"
            v-click-outside="() => showAccountMenu = false"
            class="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
          >
            <div class="p-2">
              <button
                @click="openSyncSettings"
                class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"
              >
                <IconSettings size="16" />
                <span>Sync Einstellungen</span>
              </button>
              
              <button
                @click="signOut"
                class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2"
              >
                <IconLogout size="16" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div 
      v-if="syncStore.syncError" 
      class="bg-red-900/30 border border-red-500/50 rounded-md p-3 mt-3 flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <IconAlertTriangle size="16" class="text-red-400" />
        <span class="text-sm text-red-200">{{ syncStore.syncError }}</span>
      </div>
      <button
        @click="dismissError"
        class="text-red-400 hover:text-red-200"
      >
        <IconX size="16" />
      </button>
    </div>
  </div>

  <!-- Login Prompt for Unauthenticated Users -->
  <div 
    v-else
    class="bg-blue-900/20 border-b border-blue-500/30 px-4 py-3"
  >
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center space-x-3">
        <IconCloud size="20" class="text-blue-400" />
        <div>
          <div class="text-sm text-white font-medium">Cross-Device Sync Available</div>
          <div class="text-xs text-blue-200">Sign in to synchronize your data across devices</div>
        </div>
      </div>
      
      <button
        @click="signIn"
        class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <IconLogin size="16" />
        <span>Sign in with Google</span>
      </button>
    </div>
  </div>

  <!-- Sync Settings Modal -->
  <SyncSettingsModal 
    :isOpen="showSyncSettings"
    @close="showSyncSettings = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  IconLoader2, IconCloudCheck, IconCloudOff, IconCloud,
  IconLogin, IconLogout, IconRefresh, IconSettings,
  IconCloudDown, IconCloudUp, IconDotsVertical,
  IconAlertTriangle, IconX
} from '@tabler/icons-vue';
import { useSyncStore } from '@/store/syncStore';
import SyncSettingsModal from './SyncSettingsModal.vue';

// Store
const syncStore = useSyncStore();

// UI State
const showAccountMenu = ref(false);
const showSyncSettings = ref(false);

// Computed
const formatLastSync = computed(() => {
  if (!syncStore.lastSyncTime) return 'Nie';
  const date = new Date(syncStore.lastSyncTime);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffMinutes < 1) return 'Gerade eben';
  if (diffMinutes < 60) return `vor ${diffMinutes} Min`;
  if (diffMinutes < 1440) return `vor ${Math.floor(diffMinutes / 60)} Std`;
  return date.toLocaleDateString('de-DE');
});

// Methods
function getSyncStatusText() {
  if (syncStore.isSyncing) return 'Synchronisiert...';
  if (syncStore.syncStatus === 'success') return 'Bereit';
  if (syncStore.syncStatus === 'error') return 'Fehler';
  return 'Offline';
}

async function signIn() {
  try {
    await syncStore.signInWithGoogle();
  } catch (error) {
    console.error('Sign in failed:', error);
  }
}

async function signOut() {
  try {
    await syncStore.signOut();
    showAccountMenu.value = false;
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

async function uploadData() {
  try {
    await syncStore.forceSyncToServer();
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

async function downloadData() {
  try {
    await syncStore.forceSyncFromServer();
  } catch (error) {
    console.error('Download failed:', error);
  }
}

async function fullSync() {
  try {
    await syncStore.fullSync();
  } catch (error) {
    console.error('Full sync failed:', error);
  }
}

function openSyncSettings() {
  showSyncSettings.value = true;
  showAccountMenu.value = false;
}

function dismissError() {
  syncStore.syncError = null;
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (showAccountMenu.value && !event.target.closest('.relative')) {
    showAccountMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom animations for smooth transitions */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
