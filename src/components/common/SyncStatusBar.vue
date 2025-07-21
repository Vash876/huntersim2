<template>
  <div class="sync-status-bar bg-gray-800/90 border-b border-gray-700 px-6 py-2">
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <!-- Left: Sync Status Info -->
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <div 
            :class="[
              'w-2 h-2 rounded-full',
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
        
        <div v-if="syncStore.lastSyncTime" class="text-xs text-gray-500">
          Last sync: {{ formatSyncTime(syncStore.lastSyncTime) }}
        </div>
      </div>

      <!-- Right: User Account & Sync Controls -->
      <div class="flex items-center space-x-2">
        <!-- Unauthenticated State -->
        <div v-if="!syncStore.isAuthenticated" class="flex items-center space-x-2">
          <span class="text-xs text-gray-500">Sign in for cloud sync</span>
          <button
            @click="signIn"
            class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors"
          >
            Sign in with Google
          </button>
        </div>

        <!-- Authenticated State -->
        <div v-else class="relative">
          <button
            @click="showSyncMenu = !showSyncMenu"
            class="px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center hover:bg-gray-750"
            :class="[showSyncMenu ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-300 hover:text-white']"
          >
            <div class="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
              {{ (syncStore.userDisplayName || 'U').charAt(0).toUpperCase() }}
            </div>
            <span class="text-sm">{{ syncStore.userDisplayName || 'User' }}</span>
            <IconChevronDown 
              size="14" 
              class="ml-2 transition-transform duration-200"
              :class="{'rotate-180': showSyncMenu}"
            />
          </button>

          <!-- Sync Dropdown Menu -->
          <div 
            class="absolute top-full right-0 mt-2 bg-gray-800 rounded-xl shadow-xl transform transition-all duration-200 origin-top-right z-50 border border-gray-700 w-72 overflow-hidden" 
            :class="showSyncMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
          >
            <div class="p-4">
              <!-- User Info Header -->
              <div class="flex items-center space-x-3 pb-3 border-b border-gray-700">
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {{ (syncStore.userDisplayName || 'U').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-sm font-medium text-white">{{ syncStore.userDisplayName || 'User' }}</div>
                  <div class="text-xs text-gray-400">{{ syncStore.currentUser?.email || 'No email' }}</div>
                </div>
              </div>

              <!-- Sync Status -->
              <div class="py-3 border-b border-gray-700">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-300">Sync Status</span>
                  <div class="flex items-center space-x-2">
                    <div 
                      :class="[
                        'w-2 h-2 rounded-full',
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
                </div>
                <div v-if="syncStore.lastSyncTime" class="text-xs text-gray-500 mt-1">
                  Last sync: {{ formatSyncTime(syncStore.lastSyncTime) }}
                </div>
              </div>

              <!-- Sync Actions -->
              <div class="py-3 space-y-1">
                <button
                  @click="() => { forceSyncFromServer(); showSyncMenu = false; }"
                  :disabled="syncStore.isSyncing"
                  class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2 disabled:opacity-50"
                >
                  <IconCloudDown size="16" />
                  <span>Download from Cloud</span>
                </button>
                
                <button
                  @click="() => { forceSyncToServer(); showSyncMenu = false; }"
                  :disabled="syncStore.isSyncing"
                  class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2 disabled:opacity-50"
                >
                  <IconCloudUp size="16" />
                  <span>Upload to Cloud</span>
                </button>

                <button
                  @click="() => { fullSync(); showSyncMenu = false; }"
                  :disabled="syncStore.isSyncing"
                  class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded flex items-center space-x-2 disabled:opacity-50"
                >
                  <IconRefresh size="16" :class="{ 'animate-spin': syncStore.isSyncing }" />
                  <span>{{ syncStore.isSyncing ? 'Syncing...' : 'Full Sync' }}</span>
                </button>
                
                <div class="border-t border-gray-600 my-2"></div>
                
                <button
                  @click="() => { signOut(); showSyncMenu = false; }"
                  class="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 rounded flex items-center space-x-2"
                >
                  <IconLogout size="16" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="syncStore.syncError" class="flex items-center space-x-1">
          <IconAlertTriangle size="14" class="text-red-400" />
          <span class="text-xs text-red-300">Sync Error</span>
        </div>
      </div>
    </div>

    <!-- Click outside backdrop -->
    <div 
      v-if="showSyncMenu" 
      class="fixed inset-0 z-40 bg-transparent"
      @click="showSyncMenu = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { 
  IconChevronDown, IconCloudDown, IconCloudUp, IconRefresh,
  IconLogout, IconAlertTriangle
} from '@tabler/icons-vue';
import { useSyncStore } from '@/store/syncStore';

// Store
const syncStore = useSyncStore();

// UI State
const showSyncMenu = ref(false);

// Methods
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
  } catch (error) {
    console.error('Sign out failed:', error);
  }
}

async function forceSyncFromServer() {
  try {
    await syncStore.forceSyncFromServer();
  } catch (error) {
    console.error('Force sync from server failed:', error);
  }
}

async function forceSyncToServer() {
  try {
    await syncStore.forceSyncToServer();
  } catch (error) {
    console.error('Force sync to server failed:', error);
  }
}

async function fullSync() {
  try {
    await syncStore.fullSync();
  } catch (error) {
    console.error('Full sync failed:', error);
  }
}

function getSyncStatusText() {
  if (syncStore.isSyncing) return 'Syncing...';
  if (syncStore.syncStatus === 'success') return 'Online';
  if (syncStore.syncStatus === 'error') return 'Error';
  if (!syncStore.isAuthenticated) return 'Local only';
  return 'Ready';
}

function formatSyncTime(timeString) {
  const date = new Date(timeString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// Close menu when clicking outside
function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    showSyncMenu.value = false;
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
/* Spezifische Hintergrundfarbe zwischen gray-700 und gray-800 */
.bg-gray-750 {
  background-color: rgba(40, 44, 52, 1);
}

/* Verbesserte Hover-Effekte */
button {
  transition: all 0.2s ease;
}

/* Hover-Effekte für Buttons */
.rounded-lg:hover {
  background-color: rgb(55, 65, 81, 1);
}

.sync-status-bar {
  font-family: 'Inter', sans-serif;
}
</style>
