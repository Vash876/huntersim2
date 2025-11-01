/**
 * Simplified Sync Store - Cloud Backup/Restore Integration
 * Uses existing backup/restore functionality from Settings for seamless sync
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { neonAuthService } from '@/services/neonAuthService';
import { databaseService } from '@/services/databaseService';

export const useSyncStore = defineStore('sync', () => {
  // State
  const isAuthenticated = ref(false);
  const currentUser = ref(null);
  const isSyncing = ref(false);
  const lastSyncTime = ref(null);
  const lastSyncError = ref(null);
  const syncStatus = ref('idle'); // 'idle', 'syncing', 'success', 'error'
  
  // Sync Throttling
  const MIN_SYNC_INTERVAL = 10000; // 10 Sekunden zwischen Syncs
  const APP_VERSION = '2.7.0';

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

  function init() {
    const savedLastSync = localStorage.getItem('sync_last_sync_time');
    if (savedLastSync) {
      lastSyncTime.value = savedLastSync;
    }
    
    // Initial auth state update
    updateAuthState();
    
    // Register for auth state changes
    if (neonAuthService.onAuthStateChanged) {
      neonAuthService.onAuthStateChanged = (user) => {
        updateAuthState();
      };
    }
    
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

  async function createLocalBackup() {
    try {
      const { useHunterStore } = await import('@/store/hunterStore');
      const { useTRPlannerStore } = await import('@/store/orbStore');
      const { useTRTrackingStore } = await import('@/store/trTrackingStore');
      const { useUltimaStore } = await import('@/store/ultimaStore');
      const { useGemPlannerStore } = await import('@/store/gemPlannerStore');
      const { useInscryptionPlannerStore } = await import('@/store/inscryptionPlannerStore');
      const { useTSStore } = await import('@/store/tsStore');

      const hunterStore = useHunterStore();
      const trPlannerStore = useTRPlannerStore();
      const trTrackingStore = useTRTrackingStore();
      const ultimaStore = useUltimaStore();
      const gemPlannerStore = useGemPlannerStore();
      const inscryptionPlannerStore = useInscryptionPlannerStore();
      const tsStore = useTSStore();

      // Create backup data (same as Settings createBackup)
      const hunterStoreState = JSON.parse(JSON.stringify(hunterStore.$state));
      if (hunterStoreState.evaluationCache) {
        delete hunterStoreState.evaluationCache;
      }

      const backupData = {
        data: {
          hunterStore: hunterStoreState,
          trPlannerStore: JSON.parse(JSON.stringify(trPlannerStore.$state)),
          trTrackingStore: trTrackingStore.exportData(),
          ultimaStore: JSON.parse(JSON.stringify(ultimaStore.$state)),
          gemPlannerStore: gemPlannerStore.exportData(),
          inscryptionPlannerStore: JSON.parse(JSON.stringify(inscryptionPlannerStore.$state)),
          tsStore: JSON.parse(JSON.stringify(tsStore.settings)),
          localStorage: {
            gadgetCalculator_currentLevels: JSON.parse(localStorage.getItem('gadgetCalculator_currentLevels') || '{}'),
            gadgetCalculator_targetLevels: JSON.parse(localStorage.getItem('gadgetCalculator_targetLevels') || '{}'),
            gadgetCalculator_referenceBuildId: localStorage.getItem('gadgetCalculator_referenceBuildId'),
            mechPlanner_settings: JSON.parse(localStorage.getItem('mechPlanner_settings') || '{}'),
            attrGN3Calculator_settings: JSON.parse(localStorage.getItem('attrGN3Calculator_settings') || '{}'),
            researchOverview_filters: JSON.parse(localStorage.getItem('researchOverview_filters') || '{}'),
            loopModOverview_filters: JSON.parse(localStorage.getItem('loopModOverview_filters') || '{}'),
            m0CostOverview_filters: JSON.parse(localStorage.getItem('m0CostOverview_filters') || '{}'),
            trPlanOrderIds: JSON.parse(localStorage.getItem('trPlanOrderIds') || '[]'),
            huntersim_high_iterations_mode: localStorage.getItem('huntersim_high_iterations_mode'),
            gems_showOnlySimRelevant: JSON.parse(localStorage.getItem('gems_showOnlySimRelevant') || 'false'),
            inscryption_shopping_list: JSON.parse(localStorage.getItem('inscryption-shopping-list') || '[]'),
            inscryption_owned: JSON.parse(localStorage.getItem('inscryption-owned') || '{}'),
            inscryption_planner_settings: JSON.parse(localStorage.getItem('inscryption-planner-settings') || '{}'),
            inscryption_planner_selectedBuildId: localStorage.getItem('inscryption-planner-selectedBuildId')
          }
        },
        version: '2.1.0',
        timestamp: new Date().toISOString(),
        type: 'hunter-simulator-backup'
      };

      return btoa(JSON.stringify(backupData));
    } catch (error) {
      console.error('Failed to create local backup:', error);
      throw error;
    }
  }

  async function restoreLocalBackup(backupCode) {
    try {
      if (!backupCode || typeof backupCode !== 'string') {
        throw new Error('Invalid backup code: not a string');
      }

      let backupData;
      
      // Try parsing as JSON first (in case it's stored as unencoded JSON)
      try {
        backupData = JSON.parse(backupCode);
      } catch (jsonError) {
        // If JSON parsing fails, try Base64 decode
        
        // Validate Base64 format
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(backupCode)) {
          throw new Error('Invalid backup code: not valid Base64 format');
        }

        try {
          const decoded = atob(backupCode);
          backupData = JSON.parse(decoded);
        } catch (decodeError) {
          console.error('Base64 decode error:', decodeError);
          throw new Error('Invalid backup code: failed to decode Base64');
        }
      }
      
      if (!backupData || !backupData.data || backupData.type !== 'hunter-simulator-backup') {
        throw new Error('Invalid backup format');
      }

      const { useHunterStore } = await import('@/store/hunterStore');
      const { useTRPlannerStore } = await import('@/store/orbStore');
      const { useTRTrackingStore } = await import('@/store/trTrackingStore');
      const { useUltimaStore } = await import('@/store/ultimaStore');
      const { useGemPlannerStore } = await import('@/store/gemPlannerStore');
      const { useInscryptionPlannerStore } = await import('@/store/inscryptionPlannerStore');
      const { useTSStore } = await import('@/store/tsStore');

      const hunterStore = useHunterStore();
      const trPlannerStore = useTRPlannerStore();
      const trTrackingStore = useTRTrackingStore();
      const ultimaStore = useUltimaStore();
      const gemPlannerStore = useGemPlannerStore();
      const inscryptionPlannerStore = useInscryptionPlannerStore();
      const tsStore = useTSStore();

      // Restore stores (same as Settings restoreFromBackup)
      if (backupData.data.hunterStore) {
        const currentCache = hunterStore.$state.evaluationCache ? 
          { ...hunterStore.$state.evaluationCache } : {};
        
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
        
        for (const key in backupData.data.hunterStore) {
          if (key !== 'evaluationCache' && key in hunterStore.$state) {
            hunterStore.$state[key] = backupData.data.hunterStore[key];
          }
        }
        
        if (currentCache && Object.keys(currentCache).length > 0) {
          hunterStore.$state.evaluationCache = currentCache;
        }
      }

      if (backupData.data.trPlannerStore) {
        Object.keys(backupData.data.trPlannerStore).forEach(key => {
          if (key in trPlannerStore.$state) {
            trPlannerStore.$state[key] = backupData.data.trPlannerStore[key];
          }
        });
      }

      if (backupData.data.trTrackingStore) {
        console.log('📥 Restoring TR Tracking data from cloud backup...');
        await trTrackingStore.importData(backupData.data.trTrackingStore);
        console.log('✅ TR Tracking data restored successfully');
      }

      if (backupData.data.ultimaStore) {
        Object.keys(backupData.data.ultimaStore).forEach(key => {
          if (key in ultimaStore.$state) {
            ultimaStore.$state[key] = backupData.data.ultimaStore[key];
          }
        });
      }

      // Restore Gem Planner Store
      if (backupData.data.gemPlannerStore) {
        console.log('📥 Restoring Gem Planner data from cloud backup...');
        const importSuccess = gemPlannerStore.importData(backupData.data.gemPlannerStore);
        if (!importSuccess) {
          console.warn('⚠️ Failed to import Gem Planner data from cloud, but continuing with other data...');
        }
      }

      // Restore Inscryption Planner Store
      if (backupData.data.inscryptionPlannerStore) {
        console.log('📥 Restoring Inscryption Planner data from cloud backup...');
        Object.keys(backupData.data.inscryptionPlannerStore).forEach(key => {
          if (key in inscryptionPlannerStore.$state) {
            inscryptionPlannerStore.$state[key] = backupData.data.inscryptionPlannerStore[key];
          }
        });
      }

      // Restore TS Planner Store
      if (backupData.data.tsStore) {
        console.log('📥 Restoring Trait Sphere Planner data from cloud backup...');
        Object.keys(backupData.data.tsStore).forEach(key => {
          if (key in tsStore.settings) {
            tsStore.settings[key] = backupData.data.tsStore[key];
          }
        });
      }
      // Backward compatibility: Restore from old localStorage format if present
      else if (backupData.data.localStorage?.traitSpherePlanner_settings) {
        console.log('📥 Restoring Trait Sphere Planner data from old localStorage format...');
        const oldSettings = backupData.data.localStorage.traitSpherePlanner_settings;
        Object.keys(oldSettings).forEach(key => {
          if (key in tsStore.settings) {
            tsStore.settings[key] = oldSettings[key];
          }
        });
      }

      // Restore localStorage
      if (backupData.data.localStorage) {
        const localStorageData = backupData.data.localStorage;
        
        if (localStorageData.gadgetCalculator_currentLevels) {
          localStorage.setItem('gadgetCalculator_currentLevels', JSON.stringify(localStorageData.gadgetCalculator_currentLevels));
        }
        if (localStorageData.gadgetCalculator_targetLevels) {
          localStorage.setItem('gadgetCalculator_targetLevels', JSON.stringify(localStorageData.gadgetCalculator_targetLevels));
        }
        if (localStorageData.gadgetCalculator_referenceBuildId) {
          localStorage.setItem('gadgetCalculator_referenceBuildId', localStorageData.gadgetCalculator_referenceBuildId);
        }
        if (localStorageData.mechPlanner_settings) {
          localStorage.setItem('mechPlanner_settings', JSON.stringify(localStorageData.mechPlanner_settings));
        }
        if (localStorageData.attrGN3Calculator_settings) {
          localStorage.setItem('attrGN3Calculator_settings', JSON.stringify(localStorageData.attrGN3Calculator_settings));
        }
        // Note: traitSpherePlanner_settings is now handled by tsStore, not localStorage
        if (localStorageData.researchOverview_filters) {
          localStorage.setItem('researchOverview_filters', JSON.stringify(localStorageData.researchOverview_filters));
        }
        if (localStorageData.loopModOverview_filters) {
          localStorage.setItem('loopModOverview_filters', JSON.stringify(localStorageData.loopModOverview_filters));
        }
        if (localStorageData.m0CostOverview_filters) {
          localStorage.setItem('m0CostOverview_filters', JSON.stringify(localStorageData.m0CostOverview_filters));
        }
        if (localStorageData.trPlanOrderIds) {
          localStorage.setItem('trPlanOrderIds', JSON.stringify(localStorageData.trPlanOrderIds));
        }
        if (localStorageData.huntersim_high_iterations_mode !== undefined) {
          localStorage.setItem('huntersim_high_iterations_mode', localStorageData.huntersim_high_iterations_mode);
        }
        
        // Inscryption Planner localStorage
        if (localStorageData.inscryption_shopping_list) {
          localStorage.setItem('inscryption-shopping-list', JSON.stringify(localStorageData.inscryption_shopping_list));
        }
        if (localStorageData.inscryption_owned) {
          localStorage.setItem('inscryption-owned', JSON.stringify(localStorageData.inscryption_owned));
        }
        if (localStorageData.inscryption_planner_settings) {
          localStorage.setItem('inscryption-planner-settings', JSON.stringify(localStorageData.inscryption_planner_settings));
        }
        if (localStorageData.inscryption_planner_selectedBuildId) {
          localStorage.setItem('inscryption-planner-selectedBuildId', localStorageData.inscryption_planner_selectedBuildId);
        }
        
        // Gem Planner settings
        if (localStorageData.gems_showOnlySimRelevant !== undefined) {
          localStorage.setItem('gems_showOnlySimRelevant', JSON.stringify(localStorageData.gems_showOnlySimRelevant));
        }
      }

    } catch (error) {
      console.error('Failed to restore local backup:', error);
      throw error;
    }
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
      setLastSyncTime();

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
        setLastSyncTime();
        return;
      }

      await restoreLocalBackup(cloudBackup.backup_code);

      syncStatus.value = 'success';
      setLastSyncTime();

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
    lastSyncError,
    syncStatus,
    
    // Computed
    userDisplayName,
    canSync,
    
    // Methods
    init,
    updateAuthState,
    createLocalBackup,
    restoreLocalBackup,
    syncToServer,
    syncFromServer
  };
});
