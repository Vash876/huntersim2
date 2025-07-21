/**
 * Composable für automatische Tools-Synchronisation
 * Überwacht localStorage-Änderungen und synchronisiert sie automatisch
 */
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useSyncStore } from '@/store/syncStore';

export function useToolsSync() {
  const syncStore = useSyncStore();
  const isAutoSyncEnabled = ref(false); // AUTO-SYNC DEAKTIVIERT - nur manuelle Synchronisation
  const autoSyncTimeout = ref(null);
  
  // Sync Throttling für manuelle Syncs
  const MIN_SYNC_INTERVAL = 15000; // 15 Sekunden zwischen manuellen Syncs
  const lastAutoSync = ref(null);
  
  // Synchronisation Keys - gleiche Liste wie im syncStore
  const WATCHED_KEYS = [
    'attrGN3Calculator_settings',
    'gadgetCalculator_currentLevels',
    'gadgetCalculator_targetLevels',
    'gadgetCalculator_referenceBuildId',
    'gadgetCalculator_showMultipliers',
    'loopModOverview_filters',
    'mechPlanner_settings',
    'researchOverview_filters',
    'traitSpherePlanner_settings',
    'trplanner_gem_welcome_seen',
    'trplanner_userstats',
    'ultima_trCount',
    'ultima_current_levels',
    'ultima_target_levels',
    'ultima_upgradeConfigs'
  ];

  // Debounced sync function mit Throttling
  function debouncedSync() {
    if (autoSyncTimeout.value) {
      clearTimeout(autoSyncTimeout.value);
    }
    
    autoSyncTimeout.value = setTimeout(async () => {
      // Check if enough time has passed since last auto sync
      const now = Date.now();
      const lastSync = lastAutoSync.value || 0;
      const timeSinceLastSync = now - lastSync;
      
      if (timeSinceLastSync < MIN_SYNC_INTERVAL) {
        console.log(`Auto-sync throttled. Need to wait ${(MIN_SYNC_INTERVAL - timeSinceLastSync) / 1000}s`);
        return;
      }
      
      if (syncStore.canSync && isAutoSyncEnabled.value) {
        try {
          console.log('Auto-syncing tools data to server...');
          await syncStore.syncToolsToServer();
          lastAutoSync.value = now;
        } catch (error) {
          console.warn('Auto-sync failed:', error);
        }
      }
    }, 10000); // 10 Sekunden Debounce - DB läuft konstant, keine Cold-Start-Kosten
  }

  // Storage event listener für Cross-Tab-Updates
  function handleStorageChange(event) {
    if (WATCHED_KEYS.includes(event.key)) {
      console.log(`Tools sync: localStorage changed for ${event.key} (cross-tab)`);
      debouncedSync();
    }
  }

  // localStorage setItem override für same-tab detection
  const originalSetItem = localStorage.setItem;
  function enhancedSetItem(key, value) {
    const oldValue = localStorage.getItem(key);
    originalSetItem.call(localStorage, key, value);
    
    // Trigger sync if it's a watched key and value actually changed
    if (WATCHED_KEYS.includes(key) && oldValue !== value) {
      console.log(`Tools sync: localStorage changed for ${key} (same-tab)`);
      debouncedSync();
    }
  }

  // Manual sync functions
  async function syncToServer() {
    try {
      await syncStore.syncToolsToServer();
      console.log('Manual tools sync to server completed');
    } catch (error) {
      console.error('Manual tools sync to server failed:', error);
      throw error;
    }
  }

  async function syncFromServer() {
    try {
      await syncStore.syncToolsFromServer();
      console.log('Manual tools sync from server completed');
    } catch (error) {
      console.error('Manual tools sync from server failed:', error);
      throw error;
    }
  }

  // Settings
  function setAutoSync(enabled) {
    isAutoSyncEnabled.value = enabled;
    localStorage.setItem('tools_auto_sync_enabled', enabled.toString());
  }

  function loadAutoSyncSetting() {
    const saved = localStorage.getItem('tools_auto_sync_enabled');
    if (saved !== null) {
      isAutoSyncEnabled.value = saved === 'true';
    }
  }

  // Lifecycle
  onMounted(() => {
    loadAutoSyncSetting();
    
    console.log('Tools sync composable initialized - manual sync only');
  });

  onUnmounted(() => {
    if (autoSyncTimeout.value) {
      clearTimeout(autoSyncTimeout.value);
    }
    
    console.log('Tools sync composable cleaned up');
  });

  // Watch for auth state changes
  watch(() => syncStore.isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated) {
      console.log('User authenticated - tools auto-sync available');
    } else {
      console.log('User not authenticated - tools auto-sync disabled');
    }
  });

  return {
    isAutoSyncEnabled,
    syncToServer,
    syncFromServer,
    setAutoSync,
    debouncedSync,
    canSync: syncStore.canSync
  };
}
