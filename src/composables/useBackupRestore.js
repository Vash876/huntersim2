/**
 * useBackupRestore.js - Composable für Backup/Restore Funktionalität
 * Wiederverwendbare Backup/Restore-Logik für Settings und Navbar
 */
import { ref } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { useTRPlannerStore } from '@/store/orbStore';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { useUltimaStore } from '@/store/ultimaStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useInscryptionPlannerStore } from '@/store/inscryptionPlannerStore';

export function useBackupRestore() {
  const hunterStore = useHunterStore();
  const trPlannerStore = useTRPlannerStore();
  const trTrackingStore = useTRTrackingStore();
  const ultimaStore = useUltimaStore();
  const gemPlannerStore = useGemPlannerStore();
  const inscryptionPlannerStore = useInscryptionPlannerStore();

  const isCreatingBackup = ref(false);
  const isRestoring = ref(false);

  /**
   * Create a complete backup of all user data
   * @returns {string} Base64 encoded backup string
   */
  async function createBackup() {
    try {
      isCreatingBackup.value = true;
      
      // CRITICAL: Ensure TR Tracking Store is initialized before backup
      if (!trTrackingStore.isInitialized) {
        console.log('🔄 TR Tracking Store not initialized, initializing now...');
        try {
          await trTrackingStore.init();
          console.log('✅ TR Tracking Store initialized successfully');
        } catch (initError) {
          console.error('❌ Failed to initialize TR Tracking Store:', initError);
          console.warn('⚠️ Backup will proceed but TR Tracking data may be incomplete');
        }
      }
      
      // Try to ensure other stores are also properly loaded if they have initialization methods
      try {
        if (gemPlannerStore.initialize && !gemPlannerStore.isInitialized) {
          console.log('🔄 Initializing Gem Planner Store...');
          await gemPlannerStore.initialize();
        }
      } catch (error) {
        console.warn('Could not initialize Gem Planner Store:', error);
      }
      
      try {
        if (inscryptionPlannerStore.initialize && !inscryptionPlannerStore.isInitialized) {
          console.log('🔄 Initializing Inscryption Planner Store...');
          await inscryptionPlannerStore.initialize();
        }
      } catch (error) {
        console.warn('Could not initialize Inscryption Planner Store:', error);
      }
      
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
      
      // 4. Mech Planner Daten aus localStorage
      const mechPlannerSettings = localStorage.getItem('mechPlanner_settings');
      
      // 5. Ultima Calculator Daten (Pinia Store)
      const ultimaStoreData = JSON.parse(JSON.stringify(ultimaStore.$state));
      
      // 6. AttrGN3 Calculator Daten aus localStorage
      const attrGN3Settings = localStorage.getItem('attrGN3Calculator_settings');
      
      // 7. TS Planner Daten aus localStorage
      const tsPlannerSettings = localStorage.getItem('traitSpherePlanner_settings');
      
      // 8. Research Overview Daten aus localStorage
      const researchOverviewSettings = localStorage.getItem('researchOverview_filters');
      
      // 9. Loop Mod Overview Daten aus localStorage
      const loopModOverviewSettings = localStorage.getItem('loopModOverview_filters');
      
      // 10. M0 Cost Overview Daten aus localStorage
      const m0CostOverviewSettings = localStorage.getItem('m0CostOverview_filters');
      
      // 11. Gem Planner Daten (Pinia Store)
      const gemPlannerData = gemPlannerStore.exportData();
      
      // 12. Inscryption Planner Daten (Pinia Store)
      const inscryptionPlannerData = JSON.parse(JSON.stringify(inscryptionPlannerStore.$state));
      
      // 13. TR Tracking Daten (diese Funktion holt automatisch aus dem aktuellen Storage-System)
      const trTrackingData = trTrackingStore.exportData();
      
      // Debug: Check if TR Tracking data is actually present
      console.log('🔍 TR Tracking Debug Info:', {
        trTracksCount: trTrackingData?.trTracks?.length || 0,
        selectedResourcesCount: trTrackingData?.selectedResources?.length || 0,
        customResourcesCount: trTrackingData?.customResources?.length || 0,
        storeInitialized: !!trTrackingStore.isInitialized,
        useIndexedDB: trTrackingStore.useIndexedDB,
        exportedData: trTrackingData
      });
      
      // 14. Storage-System-Informationen für bessere Backup-Kompatibilität
      const storageInfo = {
        trTrackingUsesIndexedDB: trTrackingStore.useIndexedDB,
        backupCreatedWith: 'indexedDB-v2'
      };
      
      // 15. Weitere relevante localStorage-Einträge sammeln
      const trPlanOrderIds = localStorage.getItem('trPlanOrderIds');
      const highIterationsMode = localStorage.getItem('huntersim_high_iterations_mode');
      const gemsShowOnlySimRelevant = localStorage.getItem('gems_showOnlySimRelevant');
      const inscryptionShoppingList = localStorage.getItem('inscryption-shopping-list');
      const inscryptionOwned = localStorage.getItem('inscryption-owned');
      const inscryptionPlannerSettings = localStorage.getItem('inscryption-planner-settings');
      const inscryptionSelectedBuildId = localStorage.getItem('inscryption-planner-selectedBuildId');
      
      // Backup-Datenpaket erstellen
      const backupData = {
        data: {
          hunterStore: hunterStoreState,
          trPlannerStore: trPlannerData,
          trTrackingStore: trTrackingData,
          ultimaStore: ultimaStoreData,
          gemPlannerStore: gemPlannerData,
          inscryptionPlannerStore: inscryptionPlannerData,
          localStorage: {
            gadgetCalculator_currentLevels: gadgetCurrentLevels ? JSON.parse(gadgetCurrentLevels) : {},
            gadgetCalculator_targetLevels: gadgetTargetLevels ? JSON.parse(gadgetTargetLevels) : {},
            gadgetCalculator_referenceBuildId: gadgetReferenceBuildId,
            mechPlanner_settings: mechPlannerSettings ? JSON.parse(mechPlannerSettings) : {},
            attrGN3Calculator_settings: attrGN3Settings ? JSON.parse(attrGN3Settings) : {},
            traitSpherePlanner_settings: tsPlannerSettings ? JSON.parse(tsPlannerSettings) : {},
            researchOverview_filters: researchOverviewSettings ? JSON.parse(researchOverviewSettings) : {},
            loopModOverview_filters: loopModOverviewSettings ? JSON.parse(loopModOverviewSettings) : {},
            m0CostOverview_filters: m0CostOverviewSettings ? JSON.parse(m0CostOverviewSettings) : {},
            trPlanOrderIds: trPlanOrderIds ? JSON.parse(trPlanOrderIds) : [],
            huntersim_high_iterations_mode: highIterationsMode,
            gems_showOnlySimRelevant: gemsShowOnlySimRelevant ? JSON.parse(gemsShowOnlySimRelevant) : false,
            inscryption_shopping_list: inscryptionShoppingList ? JSON.parse(inscryptionShoppingList) : [],
            inscryption_owned: inscryptionOwned ? JSON.parse(inscryptionOwned) : {},
            inscryption_planner_settings: inscryptionPlannerSettings ? JSON.parse(inscryptionPlannerSettings) : {},
            inscryption_planner_selectedBuildId: inscryptionSelectedBuildId
          },
          storageInfo: storageInfo
        },
        version: '2.1.0', // Version erhöht für IndexedDB-Kompatibilität
        timestamp: new Date().toISOString(),
        type: 'hunter-simulator-backup'
      };
      
      // Base64-encode the backup
      const backupCode = btoa(JSON.stringify(backupData));
      
      console.log('Backup created successfully', {
        size: backupCode.length,
        timestamp: backupData.timestamp,
        trTrackingIncluded: !!(backupData.data.trTrackingStore?.trTracks?.length),
        trTracksCount: backupData.data.trTrackingStore?.trTracks?.length || 0
      });
      
      // Warn if important data is missing
      const backupSummary = {
        hunterStore: {
          hasBuilds: !!(backupData.data.hunterStore?.hunterBuilds && Object.keys(backupData.data.hunterStore.hunterBuilds).some(hunter => 
            backupData.data.hunterStore.hunterBuilds[hunter]?.length > 0
          )),
          hasStats: !!(backupData.data.hunterStore?.hunterStats)
        },
        trTracking: {
          hasTracks: !!(backupData.data.trTrackingStore?.trTracks?.length),
          tracksCount: backupData.data.trTrackingStore?.trTracks?.length || 0,
          hasSelectedResources: !!(backupData.data.trTrackingStore?.selectedResources?.length),
          hasCustomResources: !!(backupData.data.trTrackingStore?.customResources?.length)
        },
        gemPlanner: {
          hasData: !!(backupData.data.gemPlannerStore && Object.keys(backupData.data.gemPlannerStore).length > 0)
        },
        inscryptionPlanner: {
          hasData: !!(backupData.data.inscryptionPlannerStore && Object.keys(backupData.data.inscryptionPlannerStore).length > 0)
        }
      };
      
      console.log('📊 Backup Content Summary:', backupSummary);
      
      if (!backupData.data.trTrackingStore?.trTracks?.length) {
        console.warn('⚠️ WARNING: No TR Tracking data found in backup! This could indicate:');
        console.warn('   1. TR Tracking store is not initialized');
        console.warn('   2. User has no TR tracks yet');
        console.warn('   3. IndexedDB data is not being exported properly');
        console.warn('   4. User needs to visit TR Tracking page first to initialize the store');
      }
      
      return backupCode;
      
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error(`Failed to create backup: ${error.message}`);
    } finally {
      isCreatingBackup.value = false;
    }
  }

  /**
   * Restore data from a backup code
   * @param {string} backupCode - Base64 encoded backup string
   */
  async function restoreFromBackup(backupCode) {
    try {
      isRestoring.value = true;
      
      if (!backupCode?.trim()) {
        throw new Error('Backup code is required');
      }
      
      // Check if backup code looks complete (should be substantial length for real backup)
      const trimmedCode = backupCode.trim();
      if (trimmedCode.length < 100) {
        throw new Error('Backup code appears to be too short or incomplete. A complete backup code should be much longer.');
      }
      
      // Check if it ends properly (Base64 should end with = or == if padded, or alphanumeric)
      if (!trimmedCode.match(/[A-Za-z0-9+\/=]$/)) {
        throw new Error('Backup code appears to be incomplete - it should end with valid Base64 characters.');
      }
      
      // Decode and parse backup data
      let backupData;
      try {
        const decodedData = atob(backupCode.trim());
        backupData = JSON.parse(decodedData);
      } catch (error) {
        // More specific error messages for different failure scenarios
        if (error.name === 'InvalidCharacterError' || error.message.includes('Invalid character')) {
          throw new Error('Invalid backup code format - contains invalid characters. Please check that the code was copied completely.');
        }
        if (error instanceof SyntaxError) {
          // Try to determine how much of the backup might be missing
          try {
            const decodedPartial = atob(backupCode.trim());
            const position = error.message.match(/position (\d+)/);
            const positionNum = position ? parseInt(position[1]) : decodedPartial.length;
            
            throw new Error(`Backup code is incomplete or corrupted. The JSON structure is cut off at position ${positionNum}. The backup code appears to end with: "${decodedPartial.slice(-20)}". Please ensure you have the complete backup code from the database.`);
          } catch (decodeError) {
            throw new Error('Backup code appears to be incomplete or corrupted. Please ensure you have the complete backup code.');
          }
        }
        throw new Error(`Invalid backup code format: ${error.message}`);
      }
      
      if (!backupData || !backupData.data || backupData.type !== 'hunter-simulator-backup') {
        throw new Error('Invalid backup format');
      }
      
      console.log('Restoring from backup:', {
        version: backupData.version,
        timestamp: backupData.timestamp,
        hasStorageInfo: !!backupData.data.storageInfo,
        trTrackingDataPresent: !!backupData.data.trTrackingStore
      });
      
      // Backward compatibility check
      if (!backupData.data.storageInfo) {
        console.log('📋 This backup was created with an older version.');
      }
      
      // 1. Restore Hunter Store
      if (backupData.data.hunterStore) {
        // Aktuellen Evaluation-Cache beibehalten
        const currentCache = hunterStore.$state.evaluationCache ? 
          { ...hunterStore.$state.evaluationCache } : {};
        
        // Store-State zurücksetzen (aber evaluationCache beibehalten)
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
        
        // Backup-Daten wiederherstellen
        for (const key in backupData.data.hunterStore) {
          if (key !== 'evaluationCache' && key in hunterStore.$state) {
            hunterStore.$state[key] = backupData.data.hunterStore[key];
          }
        }
        
        // Evaluation-Cache wiederherstellen falls vorhanden
        if (currentCache && Object.keys(currentCache).length > 0) {
          hunterStore.$state.evaluationCache = currentCache;
        }
      }
      
      // 2. Restore TR Planner Store
      if (backupData.data.trPlannerStore) {
        Object.keys(backupData.data.trPlannerStore).forEach(key => {
          if (key in trPlannerStore.$state) {
            trPlannerStore.$state[key] = backupData.data.trPlannerStore[key];
          }
        });
      }
      
      // 3. Restore TR Tracking Store
      if (backupData.data.trTrackingStore) {
        console.log('📥 Restoring TR Tracking data from backup...');
        
        // Restore the data to the store
        Object.keys(backupData.data.trTrackingStore).forEach(key => {
          if (key in trTrackingStore.$state) {
            trTrackingStore.$state[key] = backupData.data.trTrackingStore[key];
          }
        });
        
        // Initialize TR Tracking store
        try {
          await trTrackingStore.init();
          console.log('✅ TR Tracking store initialized successfully');
        } catch (error) {
          console.error('❌ Error initializing TR Tracking store after restore:', error);
          console.log('💡 Data is available in the store but may not persist until TR Tracking page is visited');
        }
      }
      
      // 4. Restore Ultima Store
      if (backupData.data.ultimaStore) {
        Object.keys(backupData.data.ultimaStore).forEach(key => {
          if (key in ultimaStore.$state) {
            ultimaStore.$state[key] = backupData.data.ultimaStore[key];
          }
        });
      }
      
      // 5. Restore Gem Planner Store
      if (backupData.data.gemPlannerStore) {
        console.log('📥 Restoring Gem Planner data from backup...');
        const importSuccess = gemPlannerStore.importData(backupData.data.gemPlannerStore);
        if (!importSuccess) {
          console.warn('⚠️ Failed to import Gem Planner data, but continuing with other data...');
        }
      }
      
      // 6. Restore Inscryption Planner Store
      if (backupData.data.inscryptionPlannerStore) {
        console.log('📥 Restoring Inscryption Planner data from backup...');
        Object.keys(backupData.data.inscryptionPlannerStore).forEach(key => {
          if (key in inscryptionPlannerStore.$state) {
            inscryptionPlannerStore.$state[key] = backupData.data.inscryptionPlannerStore[key];
          }
        });
      }
      
      // 7. Restore localStorage data
      if (backupData.data.localStorage) {
        const localStorageData = backupData.data.localStorage;
        
        // Check if this backup contains TR Tracking localStorage data
        const hasTRTrackingLocalStorageData = 
          localStorageData.tr_tracking_selected_resources ||
          localStorageData.tr_tracking_tracks ||
          localStorageData.tr_tracking_custom_resources;
        
        if (hasTRTrackingLocalStorageData) {
          console.log('📋 Backup contains TR Tracking localStorage data - restoring');
          
          // Set the localStorage data
          if (localStorageData.tr_tracking_selected_resources) {
            localStorage.setItem('tr_tracking_selected_resources', JSON.stringify(localStorageData.tr_tracking_selected_resources));
          }
          if (localStorageData.tr_tracking_tracks) {
            localStorage.setItem('tr_tracking_tracks', JSON.stringify(localStorageData.tr_tracking_tracks));
          }
          if (localStorageData.tr_tracking_custom_resources) {
            localStorage.setItem('tr_tracking_custom_resources', JSON.stringify(localStorageData.tr_tracking_custom_resources));
          }
          
          console.log('✅ TR Tracking localStorage data restored');
        }
        
        // Gadget Calculator
        if (localStorageData.gadgetCalculator_currentLevels) {
          localStorage.setItem('gadgetCalculator_currentLevels', JSON.stringify(localStorageData.gadgetCalculator_currentLevels));
        }
        if (localStorageData.gadgetCalculator_targetLevels) {
          localStorage.setItem('gadgetCalculator_targetLevels', JSON.stringify(localStorageData.gadgetCalculator_targetLevels));
        }
        if (localStorageData.gadgetCalculator_referenceBuildId) {
          localStorage.setItem('gadgetCalculator_referenceBuildId', localStorageData.gadgetCalculator_referenceBuildId);
        }
        
        // Mech Planner
        if (localStorageData.mechPlanner_settings) {
          localStorage.setItem('mechPlanner_settings', JSON.stringify(localStorageData.mechPlanner_settings));
        }
        
        // AttrGN3 Calculator
        if (localStorageData.attrGN3Calculator_settings) {
          localStorage.setItem('attrGN3Calculator_settings', JSON.stringify(localStorageData.attrGN3Calculator_settings));
        }
        
        // TS Planner
        if (localStorageData.traitSpherePlanner_settings) {
          localStorage.setItem('traitSpherePlanner_settings', JSON.stringify(localStorageData.traitSpherePlanner_settings));
        }
        
        // Research Overview
        if (localStorageData.researchOverview_filters) {
          localStorage.setItem('researchOverview_filters', JSON.stringify(localStorageData.researchOverview_filters));
        }
        
        // Loop Mod Overview
        if (localStorageData.loopModOverview_filters) {
          localStorage.setItem('loopModOverview_filters', JSON.stringify(localStorageData.loopModOverview_filters));
        }
        
        // M0 Cost Overview
        if (localStorageData.m0CostOverview_filters) {
          localStorage.setItem('m0CostOverview_filters', JSON.stringify(localStorageData.m0CostOverview_filters));
        }
        
        // Inscryption Planner (these are handled by useStorage in the store, but we restore them here for backup compatibility)
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
        
        // Other settings
        if (localStorageData.trPlanOrderIds) {
          localStorage.setItem('trPlanOrderIds', JSON.stringify(localStorageData.trPlanOrderIds));
        }
        if (localStorageData.huntersim_high_iterations_mode !== undefined) {
          localStorage.setItem('huntersim_high_iterations_mode', localStorageData.huntersim_high_iterations_mode);
        }
        
        // Gem Planner settings
        if (localStorageData.gems_showOnlySimRelevant !== undefined) {
          localStorage.setItem('gems_showOnlySimRelevant', JSON.stringify(localStorageData.gems_showOnlySimRelevant));
        }
      }
      
      console.log('Backup restored successfully');
      
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    } finally {
      isRestoring.value = false;
    }
  }

  return {
    isCreatingBackup,
    isRestoring,
    createBackup,
    restoreFromBackup
  };
}
