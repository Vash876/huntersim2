/**
 * Simplified Sync Store - Cloud Backup/Restore Integration
 * Uses useBackupRestore composable for backup/restore logic
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { neonAuthService } from '@/services/neonAuthService';
import { databaseService } from '@/services/databaseService';
import { useBackupRestore } from '@/composables/useBackupRestore';

export const useSyncStore = defineStore('sync', () => {
  // State
  const isAuthenticated = ref(false);
  const currentUser = ref(null);
  const isSyncing = ref(false);
  const lastSyncTime = ref(null);
  const lastUploadTime = ref(null);   // when this device last saved to cloud
  const lastDownloadTime = ref(null); // when this device last loaded from cloud
  const lastSyncError = ref(null);
  const syncStatus = ref('idle'); // 'idle', 'syncing', 'success', 'error'
  const lastCloudSaveTime = ref(null); // server-side updatedAt — valid across all devices
  let _metadataFetched = false; // guard: only one Firestore read per session
  
  // Sync Throttling
  const MIN_SYNC_INTERVAL = 10000; // 10 Sekunden zwischen Syncs
  const APP_VERSION = '2.7.0';

  // Reuse backup/restore logic from composable
  const { createBackup, restoreFromBackup } = useBackupRestore();

  // Computed
  const userDisplayName = computed(() => {
    return currentUser.value?.displayName || 
           currentUser.value?.primaryEmail || 
           currentUser.value?.email || 
           currentUser.value?.name || 
           'Unknown';
  });

  const canSync = computed(() => {
    const now = Date.now();
    const lastSync = lastSyncTime.value ? new Date(lastSyncTime.value).getTime() : 0;
    const timeSinceLastSync = now - lastSync;
    const cooldownPassed = timeSinceLastSync >= MIN_SYNC_INTERVAL;
    
    return isAuthenticated.value && !isSyncing.value && cooldownPassed;
  });

  // Helper functions
  function setLastSyncTime() {
    const now = new Date().toISOString();
    lastSyncTime.value = now;
    localStorage.setItem('sync_last_sync_time', now);
  }

  function setLastUploadTime() {
    const now = new Date().toISOString();
    lastUploadTime.value = now;
    lastDownloadTime.value = now; // after saving, this device is in sync with cloud
    lastSyncTime.value = now;
    lastCloudSaveTime.value = now; // this device just saved, so server time ≈ now
    localStorage.setItem('sync_last_upload_time', now);
    localStorage.setItem('sync_last_download_time', now);
    localStorage.setItem('sync_last_sync_time', now);
    localStorage.setItem('sync_last_cloud_save_time', now);
  }

  function setLastCloudSaveTime(ts) {
    if (!ts) return;
    lastCloudSaveTime.value = ts;
    localStorage.setItem('sync_last_cloud_save_time', ts);
  }

  function setLastDownloadTime() {
    const now = new Date().toISOString();
    lastDownloadTime.value = now;
    lastSyncTime.value = now;
    localStorage.setItem('sync_last_download_time', now);
    localStorage.setItem('sync_last_sync_time', now);
  }

  function init() {
    const savedLastSync = localStorage.getItem('sync_last_sync_time');
    if (savedLastSync) {
      const savedTime = new Date(savedLastSync).getTime();
      const now = Date.now();
      
      // Validate: lastSyncTime should not be in the future
      if (savedTime > now) {
        console.warn('⚠️ Invalid lastSyncTime detected (in the future), clearing it:', savedLastSync);
        localStorage.removeItem('sync_last_sync_time');
        lastSyncTime.value = null;
      } else {
        lastSyncTime.value = savedLastSync;
      }
    }

    const savedUpload = localStorage.getItem('sync_last_upload_time');
    if (savedUpload) lastUploadTime.value = savedUpload;

    const savedDownload = localStorage.getItem('sync_last_download_time');
    if (savedDownload) lastDownloadTime.value = savedDownload;

    const savedCloudSave = localStorage.getItem('sync_last_cloud_save_time');
    if (savedCloudSave) lastCloudSaveTime.value = savedCloudSave;

    // Initial auth state update
    updateAuthState();

    // Register for auth state changes (Firebase onAuthStateChanged fires callback)
    neonAuthService.onAuthStateChanged = (user) => {
      updateAuthState();
      if (user) fetchCloudMetadata();
    };
    
    // Also poll for auth state changes every 5 seconds as backup
    setInterval(() => {
      updateAuthState();
    }, 5000);
  }

  function updateAuthState() {
    try {
      const actualUser = neonAuthService.userComputed.value;
      const actualIsAuthenticated = neonAuthService.isAuthenticatedComputed.value;
      
      currentUser.value = actualUser;
      isAuthenticated.value = actualIsAuthenticated;
    } catch (error) {
      console.error('SyncStore: Error updating auth state:', error);
      currentUser.value = null;
      isAuthenticated.value = false;
    }
  }

  // Fetch only Firestore metadata (cheap read) to get the server-side save timestamp
  async function fetchCloudMetadata() {
    if (_metadataFetched) return; // already fetched this session
    _metadataFetched = true;
    try {
      const userId = currentUser.value?.id;
      if (!userId) { _metadataFetched = false; return; }
      const meta = await databaseService.getBackupMetadata(userId);
      if (meta?.updated_at) {
        setLastCloudSaveTime(meta.updated_at);
      }
    } catch (e) {
      _metadataFetched = false; // allow retry on error
    }
  }

  // Delegate to shared composable - single source of truth for backup/restore
  async function createLocalBackup() {
    return await createBackup();
  }

  async function restoreLocalBackup(backupCode) {
    return await restoreFromBackup(backupCode);
  }

  async function syncToServer() {
    if (!canSync.value) {
      return;
    }

    try {
      isSyncing.value = true;
      syncStatus.value = 'syncing';
      lastSyncError.value = null;

      const backupCode = await createLocalBackup();
      const userId = currentUser.value?.id;
      
      if (!userId) {
        throw new Error('No user ID available');
      }

      await databaseService.saveUserBackup(userId, backupCode, APP_VERSION);

      syncStatus.value = 'success';
      setLastUploadTime();

    } catch (error) {
      console.error('SyncStore: Sync to cloud failed:', error);
      syncStatus.value = 'error';
      lastSyncError.value = error.message;
      throw error;
    } finally {
      isSyncing.value = false;
    }
  }

  async function syncFromServer() {
    if (!canSync.value) {
      return;
    }

    try {
      isSyncing.value = true;
      syncStatus.value = 'syncing';
      lastSyncError.value = null;

      const userId = currentUser.value?.id;
      if (!userId) {
        throw new Error('No user ID available');
      }

      const cloudBackup = await databaseService.getUserBackup(userId);
      
      if (!cloudBackup) {
        syncStatus.value = 'success';
        setLastDownloadTime();
        return;
      }

      await restoreLocalBackup(cloudBackup.backup_code);

      syncStatus.value = 'success';
      // Use server-side timestamp so all devices agree on "last saved" time
      if (cloudBackup.updated_at) setLastCloudSaveTime(cloudBackup.updated_at);
      setLastDownloadTime();

    } catch (error) {
      console.error('SyncStore: Sync from cloud failed:', error);
      syncStatus.value = 'error';
      lastSyncError.value = error.message;
      throw error;
    } finally {
      isSyncing.value = false;
    }
  }

  return {
    // State
    isAuthenticated,
    currentUser,
    isSyncing,
    lastSyncTime,
    lastUploadTime,
    lastDownloadTime,
    lastCloudSaveTime,
    lastSyncError,
    syncStatus,
    
    // Computed
    userDisplayName,
    canSync,
    
    // Methods
    init,
    updateAuthState,
    fetchCloudMetadata,
    createLocalBackup,
    restoreLocalBackup,
    syncToServer,
    syncFromServer
  };
});
