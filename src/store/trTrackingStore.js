import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { generateId } from '@/utils/base58';
import IndexedDBService from '@/services/indexedDBService.js';
import { HUNTERS, getHunterById } from '@/constants/hunters';

// Import hunter constants for Mat3 names
import * as borgeConstants from '@/constants/borge';
import * as ozzyConstants from '@/constants/ozzy';
import * as knoxConstants from '@/constants/knox';

// Helper function to get Mat3 name from hunter constants
function getHunterMat3Name(hunterId) {
  let hunterConstants;
  switch (hunterId) {
    case 'borge':
      hunterConstants = borgeConstants;
      break;
    case 'ozzy':
      hunterConstants = ozzyConstants;
      break;
    case 'knox':
      hunterConstants = knoxConstants;
      break;
    default:
      return 'Mat3'; // fallback
  }
  
  return hunterConstants.SHORT_MAT_NAMES?.mat3 || 'Mat3';
}

// Export helper function for use in other components
export { getHunterMat3Name };

// Default available resources that users can choose from
// dataType options: 'number', 'suffix', 'text', 'boolean'
// format is for backwards compatibility (time, camp, etc.)
const DEFAULT_AVAILABLE_RESOURCES = [
  { id: 'hours-in-tr', name: 'Time in TR', color: '#ffffff', category: 'main', format: 'time', dataType: 'number' },
  { id: 'oo-accum', name: 'OO (Accum)', color: '#a200ff', category: 'main', format: 'number', dataType: 'suffix' },
  { id: 'lr-ticks', name: 'LR Ticks', color: '#ffffff', category: 'main', format: 'suffix', dataType: 'suffix' },
  { id: 'lr-count', name: 'LR Count', color: '#ffffff', category: 'main', format: 'number', dataType: 'number', autoFill: true },
  { id: 'loops-filled', name: 'Loops Filled', color: '#ffffff', category: 'main', format: 'number', dataType: 'number' },
  { id: 'loop-mods-purchased', name: 'Loop Mods Purchased', color: '#ff0000', category: 'main', format: 'number', dataType: 'number', autoFill: true },
  { id: 'attgn3-buff', name: 'AttGN3 Buff', color: '#00d9ff', category: 'main', format: 'number', dataType: 'suffix', autoFill: true },
  { id: 'cells', name: 'Cells', color: '#00b90f', category: 'resources', format: 'number', dataType: 'number' },
  { id: 'mp', name: 'MP', color: '#ff0000', category: 'resources', format: 'number', dataType: 'number', autoFill: true },
  { id: 'mp-accum', name: 'MP (Accum)', color: '#ff0000', category: 'resources', format: 'number', dataType: 'number' },
  { id: 'shards', name: 'Shards', color: '#00d9ff', category: 'resources', format: 'number', dataType: 'number' },
  { id: 'rp', name: 'RP', color: '#ffa600ff', category: 'resources', format: 'number', dataType: 'number' },
  { id: 'ap', name: 'AP', color: '#464cff', category: 'resources', format: 'number', dataType: 'number' },
  { id: 'blueprints', name: 'Blueprints', color: '#ffffff', category: 'zeus', format: 'number', dataType: 'number', autoFill: true },
  { id: 'f1-1-difar', name: 'F1-1 Difar', color: '#ffffff', category: 'zeus', format: 'number', dataType: 'number' },
  { id: 'inno-cores', name: 'Inno Cores', color: '#ffffff', category: 'zeus', format: 'number', dataType: 'number', autoFill: true },
  { id: 'ulti-badge', name: 'Ultima Badges', color: '#FFDE21', category: 'zeus', format: 'number', dataType: 'number', autoFill: true },
  { id: 'current-camp', name: 'Current Camp', color: '#ffffff', category: 'camp', format: 'camp', dataType: 'text' },
  { id: 'camp-timer', name: 'Camp Timer', color: '#ffffff', category: 'camp', format: 'time', dataType: 'number' },
  { id: 'notes', name: 'Notes', color: '#ffffff', category: 'other', format: 'text', dataType: 'text' },
  // Dynamic Hunter Mat3 Resources - VOLLAUTOMATISCH
  ...HUNTERS.map(hunter => {
    // Get the correct Mat3 name from hunter constants
    const mat3Name = getHunterMat3Name(hunter.id);

    return {
      id: `mat3-${hunter.id}`,
      name: `Daily ${mat3Name}`,
      color: getHunterColor(hunter.color),
      category: 'hunter-mat3',
      format: 'number',
      dataType: 'suffix'
    };
  })
];

// Helper function to get hunter color in hex format
function getHunterColor(colorName) {
  const colorMap = {
    red: '#ef4444',
    green: '#22c55e', 
    blue: '#3b82f6',
    purple: '#a855f7'
  };
  return colorMap[colorName] || '#ffffff';
}

// Default selected resources for new users
const DEFAULT_SELECTED_RESOURCES = [
  'hours-in-tr',
  'oo-accum', 
  'attgn3-buff',
  'cells',
  'mp',
  'mp-accum',
  'shards',
  'rp',
  'ap',
  'notes'
];

// Default resources to show in the highest value table columns
const DEFAULT_SHOW_IN_TABLE_RESOURCES = [
  'cells',
  'mp', 
  'shards',
  'rp'
];

// Available Initial Values that can be shown in the table
const AVAILABLE_INITIAL_VALUES = [
  { id: 'initial-oo-lifetime', name: 'OO Lifetime', color: '#a200ff', key: 'ooLifetime', dataType: 'suffix' },
  { id: 'initial-frags-lifetime', name: 'Frags Lifetime', color: '#c084fc', key: 'fragsLifetime', dataType: 'suffix' },
  { id: 'initial-ts-milestones', name: 'TS Milestones', color: '#22c55e', key: 'tsMilestones', dataType: 'milestones' },
  { id: 'initial-borge-level', name: 'Borge Level', color: '#ef4444', key: 'borgeLevel', dataType: 'number' },
  { id: 'initial-ozzy-level', name: 'Ozzy Level', color: '#22c55e', key: 'ozzyLevel', dataType: 'number' },
  { id: 'initial-knox-level', name: 'Knox Level', color: '#3b82f6', key: 'knoxLevel', dataType: 'number' }
];

// Default Initial Values to show in table (empty by default)
const DEFAULT_SHOW_INITIAL_VALUES_IN_TABLE = [];

// Helper function to get default selected resources
function getDefaultSelectedResources() {
  return DEFAULT_AVAILABLE_RESOURCES.filter(resource => 
    DEFAULT_SELECTED_RESOURCES.includes(resource.id)
  );
}

export const useTRTrackingStore = defineStore('trTracking', () => {
  // State
  const availableResources = ref([...DEFAULT_AVAILABLE_RESOURCES]);
  const selectedResources = ref([]);
  const showInTableResources = ref([...DEFAULT_SHOW_IN_TABLE_RESOURCES]);
  const showInitialValuesInTable = ref([...DEFAULT_SHOW_INITIAL_VALUES_IN_TABLE]);
  const columnOrder = ref([]); // Combined order of initial values + resources
  const availableInitialValues = ref([...AVAILABLE_INITIAL_VALUES]);
  const trTracks = ref([]);
  const isInitialized = ref(false);
  const useIndexedDB = ref(false);
  const idbService = new IndexedDBService();
  
  // Hunter Build Settings
  const hunterBuildSettings = ref({
    selectedBuilds: {}, // { hunterId: buildId }
    hunterProductions: {}, // { hunterId: { buildId, buildName, dailyMat3Production } }
    enabledHunters: {}, // { hunterId: true/false }
    totalDailyMat3Production: 0
  });

  // Computed
  const activeTracks = computed(() => trTracks.value.filter(track => track.isActive && !track.isArchived));
  const completedTracks = computed(() => trTracks.value.filter(track => !track.isActive && !track.isArchived));
  const archivedTracks = computed(() => trTracks.value.filter(track => track.isArchived));

  // Methods
  async function init() {
    if (isInitialized.value) {
      console.log('TR Tracking store already initialized');
      return;
    }
    
    console.log('🚀 Initializing TR Tracking store...');
    
    // Check if we already have data in store (from backup restore)
    const hasStoreData = selectedResources.value.length > 0 || trTracks.value.length > 0 || 
                        availableResources.value.some(resource => 
                          !DEFAULT_AVAILABLE_RESOURCES.find(def => def.id === resource.id)
                        );
    
    console.log('🔍 Store data check:', {
      selectedResourcesCount: selectedResources.value.length,
      tracksCount: trTracks.value.length,
      customResourcesCount: availableResources.value.filter(resource => 
        !DEFAULT_AVAILABLE_RESOURCES.find(def => def.id === resource.id)
      ).length,
      hasStoreData
    });
    
    if (hasStoreData) {
      console.log('🔝 Found existing data in store (likely from backup restore) - skipping IndexedDB load');
      useIndexedDB.value = true; // Still use IndexedDB for future saves
      isInitialized.value = true;
      
      // Save the current store data to IndexedDB to persist the restored data
      try {
        await idbService.init();
        await saveToIndexedDB();
        
        console.log('✅ Saved restored data to IndexedDB');
      } catch (error) {
        console.error('❌ Failed to save restored data to IndexedDB:', error);
      }
      
      console.log('✅ TR Tracking store initialization completed (using restored data)');
      return;
    }
    
    // Check if IndexedDB is available
    const idbAvailable = await IndexedDBService.isAvailable();
    if (!idbAvailable) {
      console.error('IndexedDB is not available. This application requires IndexedDB support.');
      throw new Error('IndexedDB is not available. This application requires IndexedDB support.');
    }
    
    try {
      // Initialize IndexedDB service first
      await idbService.init();
      
      // Check if we should migrate to IndexedDB
      const shouldMigrate = false; // Migration removed
      
      if (shouldMigrate) {
        console.log('� Starting TR tracking data migration...');
        
        const migrationResult = { success: false }; // Migration removed
        
        if (migrationResult.success) {
          console.log('✅ Migration successful!', migrationResult.results);
          if (migrationResult.verification) {
            console.log('🔍 Migration verification:', migrationResult.verification);
          }
          useIndexedDB.value = true;
          
          // Load from IndexedDB after migration
          await loadFromIndexedDB();
        } else {
          throw new Error(`Migration failed: ${migrationResult.error}`);
        }
      } else {
        // Migration already completed or fresh start - use IndexedDB
        console.log('📖 Using IndexedDB (migration already completed or no localStorage data)');
        useIndexedDB.value = true;
        await loadFromIndexedDB();
      }
    } catch (error) {
      console.error('❌ TR Tracking store initialization failed:', error);
      // Don't throw - allow app to continue, but log the error
      console.log('💡 TR Tracking store will use defaults. Data may be lost until manually visited.');
      
      // Set defaults if initialization failed
      selectedResources.value = getDefaultSelectedResources();
      availableResources.value = [...DEFAULT_AVAILABLE_RESOURCES];
      trTracks.value = [];
      useIndexedDB.value = false;
    }
    
    isInitialized.value = true;
    console.log('✅ TR Tracking store initialization completed');
  }

  async function loadFromIndexedDB() {
    try {
      console.log('📖 Loading TR tracking data from IndexedDB...');
      
      // Load selected resources
      const savedSelectedResources = await idbService.loadTRSettings('selectedResources');
      if (savedSelectedResources) {
        selectedResources.value = savedSelectedResources.map(sel => {
          const match = DEFAULT_AVAILABLE_RESOURCES.find(res => res.id === sel.id);
          return match ? match : sel;
        });
      } else {
        selectedResources.value = getDefaultSelectedResources();
        await saveToStorage(); // Save defaults
      }

      // Load show in table resources
      const savedShowInTableResources = await idbService.loadTRSettings('showInTableResources');
      if (savedShowInTableResources) {
        showInTableResources.value = savedShowInTableResources;
      } else {
        showInTableResources.value = [...DEFAULT_SHOW_IN_TABLE_RESOURCES];
        await saveToStorage(); // Save defaults
      }

      // Load show initial values in table
      const savedShowInitialValues = await idbService.loadTRSettings('showInitialValuesInTable');
      if (savedShowInitialValues) {
        showInitialValuesInTable.value = savedShowInitialValues;
      } else {
        showInitialValuesInTable.value = [...DEFAULT_SHOW_INITIAL_VALUES_IN_TABLE];
      }

      // Load combined column order
      const savedColumnOrder = await idbService.loadTRSettings('columnOrder');
      if (savedColumnOrder) {
        columnOrder.value = savedColumnOrder;
      } else {
        columnOrder.value = [];
      }

      // Load hunter build settings
      const savedHunterBuildSettings = await idbService.loadTRSettings('hunterBuildSettings');
      if (savedHunterBuildSettings) {
        hunterBuildSettings.value = {
          selectedBuilds: savedHunterBuildSettings.selectedBuilds || {},
          hunterProductions: savedHunterBuildSettings.hunterProductions || {},
          enabledHunters: savedHunterBuildSettings.enabledHunters || {},
          totalDailyMat3Production: savedHunterBuildSettings.totalDailyMat3Production || 0
        };
      }

      // Load custom resources
      const savedCustomResources = await idbService.loadTRSettings('customResources');
      if (savedCustomResources) {
        const allResources = [...DEFAULT_AVAILABLE_RESOURCES];
        savedCustomResources.forEach(custom => {
          if (!allResources.find(res => res.id === custom.id)) {
            allResources.push(custom);
          }
        });
        availableResources.value = allResources;
      }

      // Load tracks
      const savedTracks = await idbService.loadAllTRTracks();
      if (savedTracks) {
        trTracks.value = savedTracks;
        console.log(`📦 Loaded ${savedTracks.length} TR tracks from IndexedDB`);
      }

    } catch (error) {
      console.error('Failed to load from IndexedDB:', error);
      throw error;
    }
  }

  async function saveToIndexedDB() {
    try {
      console.log('💾 Saving all TR tracking data to IndexedDB...');
      
      // Save settings
      await idbService.saveTRSettings('selectedResources', selectedResources.value);
      await idbService.saveTRSettings('showInTableResources', showInTableResources.value);
      await idbService.saveTRSettings('showInitialValuesInTable', showInitialValuesInTable.value);
      await idbService.saveTRSettings('columnOrder', columnOrder.value);
      
      // Save only custom resources (not the defaults)
      const customResources = availableResources.value.filter(
        resource => !DEFAULT_AVAILABLE_RESOURCES.find(def => def.id === resource.id)
      );
      await idbService.saveTRSettings('customResources', customResources);
      
      // Save all tracks
      for (const track of trTracks.value) {
        await idbService.saveTRTrack(track);
      }
      
      console.log('✅ Saved all TR tracking data to IndexedDB');
    } catch (error) {
      console.error('Error saving TR tracking data to IndexedDB:', error);
      throw error;
    }
  }

  async function saveToStorage() {
    try {
      // Always use IndexedDB after migration
      await idbService.saveTRSettings('selectedResources', selectedResources.value);
      await idbService.saveTRSettings('showInTableResources', showInTableResources.value);
      await idbService.saveTRSettings('showInitialValuesInTable', showInitialValuesInTable.value);
      await idbService.saveTRSettings('columnOrder', columnOrder.value);
      
      // Save only custom resources (not the defaults)
      const customResources = availableResources.value.filter(
        resource => !DEFAULT_AVAILABLE_RESOURCES.find(def => def.id === resource.id)
      );
      await idbService.saveTRSettings('customResources', customResources);
      
      // Save hunter build settings
      await idbService.saveTRSettings('hunterBuildSettings', hunterBuildSettings.value);
      
      console.log('💾 Saved TR settings to IndexedDB');
    } catch (error) {
      console.error('Error saving TR tracking data to IndexedDB:', error);
      throw error;
    }
  }

  async function updateSelectedResources(resources) {
    selectedResources.value = resources;
    await saveToStorage();
  }

  async function updateShowInTableResources(resourceIds) {
    showInTableResources.value = resourceIds;
    await saveToStorage();
  }

  async function updateShowInTableResourcesOrder(resourceIds) {
    // Update the order of resources shown in table
    showInTableResources.value = resourceIds;
    console.log('📊 Updated table resource order:', resourceIds);
    await saveToStorage();
  }

  async function updateShowInitialValuesInTable(valueIds) {
    showInitialValuesInTable.value = valueIds;
    console.log('📊 Updated initial values in table:', valueIds);
    await saveToStorage();
  }

  async function updateColumnOrder(columnIds) {
    columnOrder.value = columnIds;
    console.log('📊 Updated combined column order:', columnIds);
    await saveToStorage();
  }

  async function addCustomResource(resource) {
    const newResource = {
      ...resource,
      id: resource.id || generateId(),
      category: resource.category || 'custom',
      // Default to 'number' if no dataType is specified (backwards compatibility)
      dataType: resource.dataType || 'number',
      // Keep format for backwards compatibility
      format: resource.format || 'number'
    };
    
    availableResources.value.push(newResource);
    await saveToStorage();
    return newResource;
  }

  async function removeCustomResource(resourceId) {
    // Don't allow removing default resources
    const isDefault = DEFAULT_AVAILABLE_RESOURCES.find(res => res.id === resourceId);
    if (isDefault) return false;

    availableResources.value = availableResources.value.filter(res => res.id !== resourceId);
    
    // Also remove from selected resources if it was selected
    selectedResources.value = selectedResources.value.filter(res => res.id !== resourceId);
    
    await saveToStorage();
    return true;
  }

  async function updateStandardResourceColor(resourceId, color) {
    const resource = availableResources.value.find(res => res.id === resourceId);
    if (!resource) return false;

    resource.color = color;
    await saveToStorage();
    return true;
  }

  async function updateCustomResource(resourceId, updates) {
    const resourceIndex = availableResources.value.findIndex(res => res.id === resourceId);
    if (resourceIndex === -1) return false;

    // Don't allow updating default resources' names, only custom ones
    const isDefault = DEFAULT_AVAILABLE_RESOURCES.find(res => res.id === resourceId);
    if (isDefault && updates.name) {
      delete updates.name;
    }

    // Ensure dataType is set (default to 'number' for backwards compatibility)
    if (updates.dataType === undefined && !availableResources.value[resourceIndex].dataType) {
      updates.dataType = 'number';
    }

    availableResources.value[resourceIndex] = {
      ...availableResources.value[resourceIndex],
      ...updates
    };

    await saveToStorage();
    return true;
  }

  async function updateHunterBuildSettings(buildData) {
    hunterBuildSettings.value = {
      selectedBuilds: buildData.selectedBuilds || {},
      hunterProductions: buildData.hunterProductions || {},
      enabledHunters: buildData.enabledHunters || {},
      totalDailyMat3Production: buildData.totalDailyMat3Production || 0
    };
    
    await saveToStorage();
    console.log('✅ Hunter build settings updated and saved');
  }

  async function createTRTrack(trackData) {
    const newTrack = {
      id: generateId(),
      name: trackData.name,
      startDate: trackData.startDate || new Date().toISOString().split('T')[0],
      endDate: trackData.endDate || null,
      isActive: trackData.isActive !== undefined ? trackData.isActive : true,
      entries: trackData.entries || [], // Use provided entries or empty array
      notes: trackData.notes || '',
      resourceOrder: trackData.resourceOrder || generateDefaultResourceOrder(), // Use provided order or generate default
      trCount: trackData.trCount || null,
      initialValues: trackData.initialValues || null,
      targetGoals: trackData.targetGoals || null,
      createdAt: trackData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If entries were provided, ensure each entry has an ID
    if (newTrack.entries && newTrack.entries.length > 0) {
      newTrack.entries = newTrack.entries.map(entry => ({
        ...entry,
        id: entry.id || generateId() // Generate ID if not present
      }));
    }

    try {
      // Always use IndexedDB after migration
      await idbService.saveTRTrack(newTrack);
      console.log(`💾 Saved track "${newTrack.name}" to IndexedDB`);
      
      // Update local array for immediate UI updates
      trTracks.value.push(newTrack);
      
      return newTrack;
    } catch (error) {
      console.error('Failed to save track to IndexedDB:', error);
      throw error;
    }
  }

  // Helper function to generate default resource order based on store order and selected resources
  function generateDefaultResourceOrder() {
    // Get the IDs of all selected resources
    const selectedResourceIds = selectedResources.value.map(r => r.id);
    
    // Create an ordered array based on the store's availableResources order
    const defaultOrder = [];
    
    // Go through availableResources in their store order and add selected ones
    availableResources.value.forEach(storeResource => {
      if (selectedResourceIds.includes(storeResource.id)) {
        defaultOrder.push(storeResource.id);
      }
    });
    
    // Add any selected resources that might not be in the store (fallback)
    selectedResourceIds.forEach(selectedId => {
      if (!defaultOrder.includes(selectedId)) {
        defaultOrder.push(selectedId);
      }
    });
    
    console.log('Generated default resource order:', defaultOrder);
    return defaultOrder;
  }

  async function updateTRTrack(trackData) {
    const index = trTracks.value.findIndex(track => track.id === trackData.id);
    if (index === -1) return false;

    trTracks.value[index] = {
      ...trTracks.value[index],
      ...trackData,
      updatedAt: new Date().toISOString()
    };
    
    try {
      await idbService.saveTRTrack(trTracks.value[index]);
      syncSharedTrack(trackData.id);
      return true;
    } catch (error) {
      console.error('Failed to update track:', error);
      return false;
    }
  }

  async function updateTRTrackSettings(trackId, settingsData) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) {
      console.warn('Track not found for settings update:', trackId);
      return false;
    }

    // Update basic track information
    if (settingsData.name) track.name = settingsData.name;
    if (settingsData.startDate) track.startDate = settingsData.startDate;
    if (settingsData.notes) track.notes = settingsData.notes;
    if (settingsData.trCount !== undefined) track.trCount = settingsData.trCount;
    
    // Update status and end date
    if (settingsData.isActive !== undefined) {
      track.isActive = settingsData.isActive;
      
      // If setting to active, remove end date
      if (settingsData.isActive) {
        delete track.endDate;
      }
    }
    
    // Update end date if provided
    if (settingsData.endDate) {
      track.endDate = settingsData.endDate;
    }
    
    // Update target goals
    if (settingsData.targetGoals) {
      track.targetGoals = {
        ...track.targetGoals,
        ...settingsData.targetGoals
      };
    }

    // Update initial values (stored in track metadata)
    if (settingsData.initialValues) {
      track.initialValues = {
        ...track.initialValues,
        ...settingsData.initialValues
      };
    }

    track.updatedAt = new Date().toISOString();
    
    try {
      await idbService.saveTRTrack(track);
      syncSharedTrack(trackId);
      return true;
    } catch (error) {
      console.error('Failed to update track settings:', error);
      return false;
    }
  }

  async function updateResourceOrder(trackId, resourceOrder) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) {
      console.warn('Track not found for resource order update:', trackId);
      return false;
    }

    console.log('Updating resource order in store:', trackId, resourceOrder);
    track.resourceOrder = resourceOrder;
    track.updatedAt = new Date().toISOString();
    
    try {
      await idbService.saveTRTrack(track);
      console.log('Resource order updated and saved to storage');
      syncSharedTrack(trackId);
      return true;
    } catch (error) {
      console.error('Failed to update resource order:', error);
      return false;
    }
  }

  async function deleteTRTrack(trackId) {
    const index = trTracks.value.findIndex(track => track.id === trackId);
    if (index === -1) return false;

    try {
      // Also remove from cloud if shared
      try {
        const { useFriendsStore } = await import('@/store/friendsStore');
        const friendsStore = useFriendsStore();
        if (friendsStore.isInitialized && friendsStore.isTrackShared(trackId)) {
          await friendsStore.stopSharingTrack(trackId);
        }
      } catch (e) {
        console.warn('Could not remove cloud share for deleted track:', e);
      }

      await idbService.deleteTRTrack(trackId);
      trTracks.value.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Failed to delete track:', error);
      return false;
    }
  }

  async function completeTRTrack(trackId) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) return false;

    track.isActive = false;
    track.endDate = new Date().toISOString();
    track.updatedAt = new Date().toISOString();
    
    try {
      await idbService.saveTRTrack(track);
      syncSharedTrack(trackId);
      return true;
    } catch (error) {
      console.error('Failed to complete track:', error);
      return false;
    }
  }

  async function archiveTRTrack(trackId) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) return false;

    track.isArchived = true;
    track.updatedAt = new Date().toISOString();
    
    try {
      await idbService.saveTRTrack(track);
      return true;
    } catch (error) {
      console.error('Failed to archive track:', error);
      return false;
    }
  }

  async function unarchiveTRTrack(trackId) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) return false;

    track.isArchived = false;
    track.updatedAt = new Date().toISOString();
    
    try {
      await idbService.saveTRTrack(track);
      return true;
    } catch (error) {
      console.error('Failed to unarchive track:', error);
      return false;
    }
  }

  // Helper: Re-sync a shared track to the cloud after local changes (5s debounce per track)
  const _syncTimers = new Map();

  function syncSharedTrack(trackId) {
    // Clear existing timer for this track
    if (_syncTimers.has(trackId)) {
      clearTimeout(_syncTimers.get(trackId));
    }

    // Set new 5s debounce timer
    const timer = setTimeout(async () => {
      _syncTimers.delete(trackId);
      try {
        const { useFriendsStore } = await import('@/store/friendsStore');
        const friendsStore = useFriendsStore();
        if (friendsStore.isInitialized && friendsStore.isTrackShared(trackId)) {
          const track = trTracks.value.find(t => t.id === trackId);
          if (track) {
            await friendsStore.shareTrack(track);
          }
        }
      } catch (e) {
        console.warn('Could not sync shared track to cloud:', e);
      }
    }, 5000);

    _syncTimers.set(trackId, timer);
  }

  async function addEntry(trackId, entryData) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) return false;

    const newEntry = {
      id: generateId(),
      date: entryData.date,
      values: entryData.values, // Object with resourceId: value pairs
      notes: entryData.notes || '',
      createdAt: new Date().toISOString()
    };

    track.entries.push(newEntry);
    track.updatedAt = new Date().toISOString();
    
    // Sort entries by date (newest first)
    track.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    try {
      await idbService.saveTrackEntry(trackId, newEntry);
      // Re-sync to cloud if shared
      syncSharedTrack(trackId);
      return newEntry;
    } catch (error) {
      console.error('Failed to add entry:', error);
      return newEntry; // Return entry even if save failed (optimistic UI)
    }
  }

  async function updateEntry(trackId, entryId, entryData) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) return false;

    const entryIndex = track.entries.findIndex(entry => entry.id === entryId);
    if (entryIndex === -1) return false;

    track.entries[entryIndex] = {
      ...track.entries[entryIndex],
      ...entryData,
      updatedAt: new Date().toISOString()
    };

    track.updatedAt = new Date().toISOString();
    
    // Re-sort entries by date
    track.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    try {
      await idbService.saveTrackEntry(trackId, track.entries[entryIndex]);
      // Re-sync to cloud if shared
      syncSharedTrack(trackId);
      return true;
    } catch (error) {
      console.error('Failed to update entry:', error);
      return true; // Return success for optimistic UI
    }
  }

  async function deleteEntry(trackId, entryId) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) return false;

    const entryIndex = track.entries.findIndex(entry => entry.id === entryId);
    if (entryIndex === -1) return false;

    track.entries.splice(entryIndex, 1);
    track.updatedAt = new Date().toISOString();
    
    try {
      await idbService.deleteTrackEntry(entryId);
      // Re-sync to cloud if shared
      syncSharedTrack(trackId);
      return true;
    } catch (error) {
      console.error('Failed to delete entry:', error);
      return true; // Return success for optimistic UI
    }
  }

  function getTRTrack(trackId) {
    return trTracks.value.find(track => track.id === trackId);
  }

  function getTrackProgress(trackId, resourceId) {
    const track = getTRTrack(trackId);
    if (!track || track.entries.length === 0) return null;

    const sortedEntries = [...track.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const values = sortedEntries.map(entry => entry.values[resourceId] || 0);
    
    if (values.length < 2) return null;

    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const totalGain = lastValue - firstValue;
    const dayCount = Math.max(1, (new Date(sortedEntries[sortedEntries.length - 1].date) - new Date(sortedEntries[0].date)) / (1000 * 60 * 60 * 24));
    const avgPerDay = totalGain / dayCount;

    return {
      firstValue,
      lastValue,
      totalGain,
      dayCount,
      avgPerDay,
      values: values,
      dates: sortedEntries.map(entry => entry.date)
    };
  }

  function exportData() {
    return {
      selectedResources: selectedResources.value,
      showInTableResources: showInTableResources.value,
      customResources: availableResources.value.filter(
        resource => !DEFAULT_AVAILABLE_RESOURCES.find(def => def.id === resource.id)
      ),
      trTracks: trTracks.value,
      hunterBuildSettings: hunterBuildSettings.value
    };
  }

  async function importData(data) {
    try {
      console.log('📥 Importing TR tracking data...');
      
      if (data.selectedResources) {
        selectedResources.value = data.selectedResources;
        console.log(`📥 Imported ${data.selectedResources.length} selected resources`);
      }
      
      // Import showInTableResources
      if (data.showInTableResources) {
        showInTableResources.value = data.showInTableResources;
        console.log(`📥 Imported ${data.showInTableResources.length} show-in-table resources`);
      }
      
      if (data.customResources) {
        const allResources = [...DEFAULT_AVAILABLE_RESOURCES, ...data.customResources];
        availableResources.value = allResources;
        console.log(`📥 Imported ${data.customResources.length} custom resources`);
      }
      
      // Import hunterBuildSettings
      if (data.hunterBuildSettings) {
        hunterBuildSettings.value = data.hunterBuildSettings;
        console.log(`📥 Imported hunter build settings`);
      }
      
      if (data.trTracks) {
        trTracks.value = data.trTracks;
        const totalEntries = data.trTracks.reduce((sum, track) => sum + (track.entries?.length || 0), 0);
        console.log(`📥 Imported ${data.trTracks.length} tracks with ${totalEntries} total entries`);
      }
      
      // Save to IndexedDB - this is crucial for persistence!
      await saveToStorage();
      
      // Also save each track individually to ensure entries are persisted
      if (data.trTracks && data.trTracks.length > 0) {
        console.log('💾 Saving individual tracks to ensure entries are persisted...');
        for (const track of data.trTracks) {
          try {
            await idbService.saveTRTrack(track);
            console.log(`💾 Saved track: ${track.name} (${track.entries?.length || 0} entries)`);
          } catch (error) {
            console.warn(`Failed to save track ${track.name}:`, error);
          }
        }
      }
      
      console.log('✅ TR tracking data imported and saved to IndexedDB successfully');
      return true;
    } catch (error) {
      console.error('❌ Error importing TR tracking data:', error);
      return false;
    }
  }

  async function clearAllData() {
    selectedResources.value = [];
    trTracks.value = [];
    availableResources.value = [...DEFAULT_AVAILABLE_RESOURCES];
    
    try {
      await idbService.clearAllTRData();
      console.log('🗑️ Cleared all TR data from IndexedDB');
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
      throw error;
    }
  }

  async function resetToDefaults() {
    // Only reset selected resources and show in table, NOT the tracking plans!
    selectedResources.value = getDefaultSelectedResources();
    showInTableResources.value = [...DEFAULT_SHOW_IN_TABLE_RESOURCES];
    await saveToStorage();
    console.log('Reset to default settings (tracks preserved):', {
      selectedResources: selectedResources.value.map(r => r.id),
      showInTableResources: showInTableResources.value
    });
  }

  // Import/Export methods for sharing between users
  async function importTrackData(track, options = {}) {
    try {
      // Generate a new ID for the imported track to avoid conflicts
      const newTrack = {
        ...track,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Generate new IDs for all entries
      newTrack.entries = track.entries.map(entry => ({
        ...entry,
        id: generateId()
      }));

      // Add the track
      trTracks.value.push(newTrack);
      await saveToStorage();
      
      return newTrack;
    } catch (error) {
      console.error('Error importing track data:', error);
      throw new Error('Failed to import track data');
    }
  }

  async function importMultipleTracksData(tracks, resources = [], options = {}) {
    try {
      const importedTracks = [];

      // Import resources if requested
      if (options.replaceResources && resources.length > 0) {
        selectedResources.value = [...resources];
      }

      // Import all tracks
      tracks.forEach(track => {
        const newTrack = {
          ...track,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Generate new IDs for all entries
        newTrack.entries = track.entries.map(entry => ({
          ...entry,
          id: generateId()
        }));

        trTracks.value.push(newTrack);
        importedTracks.push(newTrack);
      });

      await saveToStorage();
      return importedTracks;
    } catch (error) {
      console.error('Error importing tracks data:', error);
      throw new Error('Failed to import tracks data');
    }
  }

  return {
    // State
    availableResources,
    selectedResources,
    showInTableResources,
    showInitialValuesInTable,
    columnOrder,
    availableInitialValues,
    trTracks,
    isInitialized,
    hunterBuildSettings,

    // Computed
    activeTracks,
    completedTracks,
    archivedTracks,

    // Methods
    init,
    saveToStorage,
    updateSelectedResources,
    updateShowInTableResources,
    updateShowInTableResourcesOrder,
    updateShowInitialValuesInTable,
    updateColumnOrder,
    addCustomResource,
    removeCustomResource,
    createTRTrack,
    updateTRTrack,
    updateTRTrackSettings,
    updateResourceOrder,
    deleteTRTrack,
    completeTRTrack,
    archiveTRTrack,
    unarchiveTRTrack,
    addEntry,
    updateEntry,
    deleteEntry,
    getTRTrack,
    getTrackProgress,
    exportData,
    importData,
    clearAllData,
    resetToDefaults,
    importTrackData,
    importMultipleTracksData,
    updateStandardResourceColor,
    updateCustomResource,
    updateHunterBuildSettings
  };
});
