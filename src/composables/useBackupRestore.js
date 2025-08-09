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

export function useBackupRestore() {
  const hunterStore = useHunterStore();
  const trPlannerStore = useTRPlannerStore();
  const trTrackingStore = useTRTrackingStore();
  const ultimaStore = useUltimaStore();
  const gemPlannerStore = useGemPlannerStore();

  const isCreatingBackup = ref(false);
  const isRestoring = ref(false);

  /**
   * Create a complete backup of all user data
   * @returns {string} Base64 encoded backup string
   */
  async function createBackup() {
    try {
      isCreatingBackup.value = true;
      
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
      
      // 12. TR Tracking Daten (diese Funktion holt automatisch aus dem aktuellen Storage-System)
      const trTrackingData = trTrackingStore.exportData();
      
      // 13. Storage-System-Informationen für bessere Backup-Kompatibilität
      const storageInfo = {
        trTrackingUsesIndexedDB: trTrackingStore.useIndexedDB,
        backupCreatedWith: 'indexedDB-migration-v1'
      };
      
      // 14. Weitere relevante localStorage-Einträge sammeln
      const trPlanOrderIds = localStorage.getItem('trPlanOrderIds');
      const highIterationsMode = localStorage.getItem('huntersim_high_iterations_mode');
      const gemsShowOnlySimRelevant = localStorage.getItem('gems_showOnlySimRelevant');
      
      // Backup-Datenpaket erstellen
      const backupData = {
        data: {
          hunterStore: hunterStoreState,
          trPlannerStore: trPlannerData,
          trTrackingStore: trTrackingData,
          ultimaStore: ultimaStoreData,
          gemPlannerStore: gemPlannerData,
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
            gems_showOnlySimRelevant: gemsShowOnlySimRelevant ? JSON.parse(gemsShowOnlySimRelevant) : false
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
        timestamp: backupData.timestamp
      });
      
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
      
      // Decode and parse backup data
      let backupData;
      try {
        const decodedData = atob(backupCode.trim());
        backupData = JSON.parse(decodedData);
      } catch (error) {
        throw new Error('Invalid backup code format');
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
      
      // Backward compatibility check for IndexedDB migration
      if (!backupData.data.storageInfo) {
        console.log('📋 This backup was created before IndexedDB migration. TR Tracking data will be automatically migrated during import.');
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
      
      // 3. Restore TR Tracking Store (raw state transfer - simple and reliable)
      if (backupData.data.trTrackingStore) {
        Object.keys(backupData.data.trTrackingStore).forEach(key => {
          if (key in trTrackingStore.$state) {
            trTrackingStore.$state[key] = backupData.data.trTrackingStore[key];
          }
        });
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
      
      // 6. Restore localStorage data
      if (backupData.data.localStorage) {
        const localStorageData = backupData.data.localStorage;
        
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
