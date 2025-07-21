<!-- CloudSyncControls.vue - Cloud Sync Integration für Settings -->
<template>
  <div class="cloud-sync-section">
    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04Z"/>
      </svg>
      Cloud-Synchronisation
    </h3>

    <!-- Authentication Status -->
    <div class="mb-4 p-3 rounded-lg" :class="authStatusClass">
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">{{ authStatusText }}</p>
          <p v-if="syncStore.isAuthenticated" class="text-sm opacity-80">
            Angemeldet als: {{ syncStore.userDisplayName }}
          </p>
        </div>
        <div v-if="syncStore.isAuthenticated" class="text-right">
          <p v-if="syncStore.lastSyncTime" class="text-xs opacity-70">
            Letzter Sync: {{ formatSyncTime(syncStore.lastSyncTime) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Sync Error -->
    <div v-if="syncStore.lastSyncError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-800 text-sm">
        <strong>Sync-Fehler:</strong> {{ syncStore.lastSyncError }}
      </p>
    </div>

    <!-- Not Authenticated -->
    <div v-if="!syncStore.isAuthenticated" class="mb-4">
      <p class="text-gray-600 mb-3">
        Melde dich an, um deine Einstellungen geräteübergreifend zu synchronisieren.
      </p>
      <button 
        @click="login" 
        class="btn btn-primary"
        :disabled="isLoggingIn"
      >
        <span v-if="isLoggingIn">Anmelden...</span>
        <span v-else>Anmelden</span>
      </button>
    </div>

    <!-- Authenticated - Sync Controls -->
    <div v-else class="space-y-3">
      <!-- Sync Status -->
      <div v-if="syncStore.syncStatus !== 'idle'" class="p-3 rounded-lg" :class="syncStatusClass">
        <div class="flex items-center gap-2">
          <div v-if="syncStore.isSyncing" class="animate-spin">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
            </svg>
          </div>
          <span>{{ syncStatusText }}</span>
        </div>
      </div>

      <!-- Sync Buttons -->
      <div class="flex gap-2">
        <button 
          @click="uploadToCloud"
          :disabled="!syncStore.canSync"
          class="btn btn-primary flex-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="mr-2">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          In Cloud speichern
        </button>
        
        <button 
          @click="downloadFromCloud"
          :disabled="!syncStore.canSync"
          class="btn btn-secondary flex-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="mr-2">
            <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"/>
          </svg>
          Aus Cloud laden
        </button>
      </div>

      <!-- Logout -->
      <div class="pt-2 border-t">
        <button 
          @click="logout" 
          class="btn btn-outline text-sm"
          :disabled="isLoggingOut"
        >
          <span v-if="isLoggingOut">Abmelden...</span>
          <span v-else>Abmelden</span>
        </button>
      </div>
    </div>

    <!-- Cooldown Info -->
    <div v-if="syncStore.isAuthenticated && !syncStore.canSync && !syncStore.isSyncing" class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
      <p>⏱️ Bitte warte {{ cooldownSeconds }} Sekunden zwischen Syncs</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSyncStore } from '@/store/syncStore';
import { neonAuthService } from '@/services/neonAuthService';

const emit = defineEmits(['sync-success', 'sync-error']);

const syncStore = useSyncStore();
const isLoggingIn = ref(false);
const isLoggingOut = ref(false);
const cooldownTimer = ref(null);
const cooldownSeconds = ref(0);

// Computed properties
const authStatusClass = computed(() => {
  if (syncStore.isAuthenticated) {
    return 'bg-green-50 border border-green-200 text-green-800';
  }
  return 'bg-gray-50 border border-gray-200 text-gray-600';
});

const authStatusText = computed(() => {
  if (syncStore.isAuthenticated) {
    return '✅ Mit Cloud verbunden';
  }
  return '🔓 Nicht angemeldet';
});

const syncStatusClass = computed(() => {
  switch (syncStore.syncStatus) {
    case 'syncing':
      return 'bg-blue-50 border border-blue-200 text-blue-800';
    case 'success':
      return 'bg-green-50 border border-green-200 text-green-800';
    case 'error':
      return 'bg-red-50 border border-red-200 text-red-800';
    default:
      return 'bg-gray-50 border border-gray-200 text-gray-600';
  }
});

const syncStatusText = computed(() => {
  switch (syncStore.syncStatus) {
    case 'syncing':
      return 'Synchronisiere...';
    case 'success':
      return '✅ Erfolgreich synchronisiert';
    case 'error':
      return '❌ Sync fehlgeschlagen';
    default:
      return '';
  }
});

// Methods
async function login() {
  try {
    isLoggingIn.value = true;
    await neonAuthService.signIn();
    syncStore.updateAuthState();
  } catch (error) {
    console.error('Login failed:', error);
    emit('sync-error', 'Anmeldung fehlgeschlagen');
  } finally {
    isLoggingIn.value = false;
  }
}

async function logout() {
  try {
    isLoggingOut.value = true;
    await neonAuthService.signOut();
    syncStore.updateAuthState();
  } catch (error) {
    console.error('Logout failed:', error);
    emit('sync-error', 'Abmeldung fehlgeschlagen');
  } finally {
    isLoggingOut.value = false;
  }
}

async function uploadToCloud() {
  try {
    await syncStore.syncToServer();
    emit('sync-success', 'Daten erfolgreich in die Cloud hochgeladen');
  } catch (error) {
    console.error('Upload failed:', error);
    emit('sync-error', `Upload fehlgeschlagen: ${error.message}`);
  }
}

async function downloadFromCloud() {
  try {
    await syncStore.syncFromServer();
    emit('sync-success', 'Daten erfolgreich aus der Cloud geladen');
  } catch (error) {
    console.error('Download failed:', error);
    emit('sync-error', `Download fehlgeschlagen: ${error.message}`);
  }
}

function formatSyncTime(timestamp) {
  if (!timestamp) return 'Nie';
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `vor ${diffHours} Std`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
  } catch (error) {
    return 'Unbekannt';
  }
}

function updateCooldown() {
  if (!syncStore.lastSyncTime) {
    cooldownSeconds.value = 0;
    return;
  }
  
  const now = Date.now();
  const lastSync = new Date(syncStore.lastSyncTime).getTime();
  const timeSinceLastSync = now - lastSync;
  const remainingMs = 10000 - timeSinceLastSync; // 10 seconds
  
  if (remainingMs <= 0) {
    cooldownSeconds.value = 0;
  } else {
    cooldownSeconds.value = Math.ceil(remainingMs / 1000);
  }
}

// Lifecycle
onMounted(() => {
  syncStore.init();
  
  // Update cooldown every second
  cooldownTimer.value = setInterval(updateCooldown, 1000);
  updateCooldown();
});

onUnmounted(() => {
  if (cooldownTimer.value) {
    clearInterval(cooldownTimer.value);
  }
});
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #4b5563;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #374151;
}

.btn-outline {
  border: 1px solid #d1d5db;
  background-color: transparent;
  color: #374151;
}

.btn-outline:hover:not(:disabled) {
  background-color: #f9fafb;
}

.cloud-sync-section {
  padding: 1rem;
}

.cloud-sync-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.gap-2 {
  gap: 0.5rem;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.text-right {
  text-align: right;
}

.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-70 {
  opacity: 0.7;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-2 {
  padding: 0.5rem;
}

.pt-2 {
  padding-top: 0.5rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded {
  border-radius: 0.25rem;
}

.border {
  border-width: 1px;
}

.border-t {
  border-top-width: 1px;
  border-color: #e5e7eb;
}

.font-medium {
  font-weight: 500;
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

/* Status colors */
.bg-green-50 {
  background-color: #f0fdf4;
}

.border-green-200 {
  border-color: #bbf7d0;
}

.text-green-800 {
  color: #166534;
}

.bg-red-50 {
  background-color: #fef2f2;
}

.border-red-200 {
  border-color: #fecaca;
}

.text-red-800 {
  color: #991b1b;
}

.bg-blue-50 {
  background-color: #eff6ff;
}

.border-blue-200 {
  border-color: #bfdbfe;
}

.text-blue-800 {
  color: #1e40af;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

.text-gray-600 {
  color: #4b5563;
}
</style>
