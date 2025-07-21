import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { generateId } from '@/utils/base58';

// Default available resources that users can choose from
const DEFAULT_AVAILABLE_RESOURCES = [
  { id: 'hours-in-tr', name: 'Hours in TR', color: '#ffffff', category: 'main' },
  { id: 'oo-accum', name: 'OO (Accum)', color: '#a200ff', category: 'main' },
  { id: 'lr-ticks', name: 'LR Ticks', color: '#ffffff', category: 'main' },
  { id: 'lr-count', name: 'LR Count', color: '#ffffff', category: 'main' },
  { id: 'loops-filled', name: 'Loops Filled', color: '#ffffff', category: 'main' },
  { id: 'loop-mods-purchased', name: 'Loop Mods Purchased', color: '#ff0000', category: 'main' },
  { id: 'attgn3-buff', name: 'AttGN3 Buff', color: '#00d9ff', category: 'main' },
  { id: 'cells', name: 'Cells', color: '#00b90f', category: 'resources' },
  { id: 'mp', name: 'MP', color: '#ff0000', category: 'resources' },
  { id: 'mp-accum', name: 'MP (Accum)', color: '#ff0000', category: 'resources' },
  { id: 'shards', name: 'Shards', color: '#00d9ff', category: 'resources' },
  { id: 'rp', name: 'RP', color: '#ffa600', category: 'resources' },
  { id: 'ap', name: 'AP', color: '#464cff', category: 'resources' },
  { id: 'blueprints', name: 'Blueprints', color: '#ffffff', category: 'zeus' },
  { id: 'f1-1-difar', name: 'F1-1 Difar', color: '#ffffff', category: 'zeus' },
  { id: 'inno-cores', name: 'Inno Cores', color: '#ffffff', category: 'zeus' },
  { id: 'daily-farm-frags', name: 'Daily Farm Frags', color: '#ffffff', category: 'zeus' },
  { id: 'current-camp', name: 'Current Camp', color: '#ffffff', category: 'camp' },
  { id: 'camp-timer', name: 'Camp Timer', color: '#ffffff', category: 'camp' },
  { id: 'notes', name: 'Notes', color: '#ffffff', category: 'other' },
];

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
  const trTracks = ref([]);
  const isInitialized = ref(false);

  // Computed
  const activeTracks = computed(() => trTracks.value.filter(track => track.isActive));
  const completedTracks = computed(() => trTracks.value.filter(track => !track.isActive));

  // Methods
  function init() {
    if (isInitialized.value) return;
    
    loadFromStorage();
    isInitialized.value = true;
  }

  function loadFromStorage() {
    try {
      // Load selected resources
      const savedSelectedResources = localStorage.getItem('tr_tracking_selected_resources');
      if (savedSelectedResources) {
        selectedResources.value = JSON.parse(savedSelectedResources);
      } else {
        // Set default selected resources for new users
        selectedResources.value = getDefaultSelectedResources();
        console.log('Setting default selected resources for new user:', selectedResources.value.map(r => r.id));
      }

      // Load custom resources and merge with defaults
      const savedCustomResources = localStorage.getItem('tr_tracking_custom_resources');
      if (savedCustomResources) {
        const customResources = JSON.parse(savedCustomResources);
        // Merge custom resources with defaults, avoiding duplicates
        const allResources = [...DEFAULT_AVAILABLE_RESOURCES];
        customResources.forEach(custom => {
          if (!allResources.find(res => res.id === custom.id)) {
            allResources.push(custom);
          }
        });
        availableResources.value = allResources;
      }

      // Load TR tracks
      const savedTracks = localStorage.getItem('tr_tracking_tracks');
      if (savedTracks) {
        trTracks.value = JSON.parse(savedTracks);
      }
    } catch (error) {
      console.error('Error loading TR tracking data from storage:', error);
      // Fallback to defaults on error
      selectedResources.value = getDefaultSelectedResources();
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem('tr_tracking_selected_resources', JSON.stringify(selectedResources.value));
      localStorage.setItem('tr_tracking_tracks', JSON.stringify(trTracks.value));
      
      // Save only custom resources (not the defaults)
      const customResources = availableResources.value.filter(
        resource => !DEFAULT_AVAILABLE_RESOURCES.find(def => def.id === resource.id)
      );
      localStorage.setItem('tr_tracking_custom_resources', JSON.stringify(customResources));
    } catch (error) {
      console.error('Error saving TR tracking data to storage:', error);
    }
  }

  function updateSelectedResources(resources) {
    selectedResources.value = resources;
    saveToStorage();
  }

  function addCustomResource(resource) {
    const newResource = {
      ...resource,
      id: resource.id || generateId(),
      category: resource.category || 'custom'
    };
    
    availableResources.value.push(newResource);
    saveToStorage();
    return newResource;
  }

  function removeCustomResource(resourceId) {
    // Don't allow removing default resources
    const isDefault = DEFAULT_AVAILABLE_RESOURCES.find(res => res.id === resourceId);
    if (isDefault) return false;

    availableResources.value = availableResources.value.filter(res => res.id !== resourceId);
    
    // Also remove from selected resources if it was selected
    selectedResources.value = selectedResources.value.filter(res => res.id !== resourceId);
    
    saveToStorage();
    return true;
  }

  function updateStandardResourceColor(resourceId, color) {
    const resource = availableResources.value.find(res => res.id === resourceId);
    if (!resource) return false;

    resource.color = color;
    saveToStorage();
    return true;
  }

  function updateCustomResource(resourceId, updates) {
    const resourceIndex = availableResources.value.findIndex(res => res.id === resourceId);
    if (resourceIndex === -1) return false;

    // Don't allow updating default resources' names, only custom ones
    const isDefault = DEFAULT_AVAILABLE_RESOURCES.find(res => res.id === resourceId);
    if (isDefault && updates.name) {
      delete updates.name; // Remove name update for default resources
    }

    availableResources.value[resourceIndex] = {
      ...availableResources.value[resourceIndex],
      ...updates
    };

    saveToStorage();
    return true;
  }

  function createTRTrack(trackData) {
    const newTrack = {
      id: generateId(),
      name: trackData.name,
      startDate: trackData.startDate || new Date().toISOString().split('T')[0],
      endDate: null,
      isActive: true,
      entries: [],
      notes: trackData.notes || '',
      resourceOrder: generateDefaultResourceOrder(), // Set default resource order based on store order
      trCount: trackData.trCount || null,
      initialValues: trackData.initialValues || null,
      targetGoals: trackData.targetGoals || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    trTracks.value.push(newTrack);
    saveToStorage();
    return newTrack;
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

  function updateTRTrack(trackData) {
    const index = trTracks.value.findIndex(track => track.id === trackData.id);
    if (index === -1) return false;

    trTracks.value[index] = {
      ...trTracks.value[index],
      ...trackData,
      updatedAt: new Date().toISOString()
    };
    
    saveToStorage();
    return true;
  }

  function updateResourceOrder(trackId, resourceOrder) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) {
      console.warn('Track not found for resource order update:', trackId);
      return false;
    }

    console.log('Updating resource order in store:', trackId, resourceOrder);
    track.resourceOrder = resourceOrder;
    track.updatedAt = new Date().toISOString();
    
    saveToStorage();
    console.log('Resource order updated and saved to storage');
    return true;
  }

  function deleteTRTrack(trackId) {
    const index = trTracks.value.findIndex(track => track.id === trackId);
    if (index === -1) return false;

    trTracks.value.splice(index, 1);
    saveToStorage();
    return true;
  }

  function completeTRTrack(trackId) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) return false;

    track.isActive = false;
    track.endDate = new Date().toISOString().split('T')[0];
    track.updatedAt = new Date().toISOString();
    
    saveToStorage();
    return true;
  }

  function addEntry(trackId, entryData) {
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
    
    saveToStorage();
    return newEntry;
  }

  function updateEntry(trackId, entryId, entryData) {
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
    
    saveToStorage();
    return true;
  }

  function deleteEntry(trackId, entryId) {
    const track = trTracks.value.find(track => track.id === trackId);
    if (!track) return false;

    const entryIndex = track.entries.findIndex(entry => entry.id === entryId);
    if (entryIndex === -1) return false;

    track.entries.splice(entryIndex, 1);
    track.updatedAt = new Date().toISOString();
    
    saveToStorage();
    return true;
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
      customResources: availableResources.value.filter(
        resource => !DEFAULT_AVAILABLE_RESOURCES.find(def => def.id === resource.id)
      ),
      trTracks: trTracks.value
    };
  }

  function importData(data) {
    try {
      if (data.selectedResources) {
        selectedResources.value = data.selectedResources;
      }
      
      if (data.customResources) {
        const allResources = [...DEFAULT_AVAILABLE_RESOURCES, ...data.customResources];
        availableResources.value = allResources;
      }
      
      if (data.trTracks) {
        trTracks.value = data.trTracks;
      }
      
      saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing TR tracking data:', error);
      return false;
    }
  }

  function clearAllData() {
    selectedResources.value = [];
    trTracks.value = [];
    availableResources.value = [...DEFAULT_AVAILABLE_RESOURCES];
    
    localStorage.removeItem('tr_tracking_selected_resources');
    localStorage.removeItem('tr_tracking_tracks');
    localStorage.removeItem('tr_tracking_custom_resources');
  }

  function resetToDefaults() {
    selectedResources.value = getDefaultSelectedResources();
    saveToStorage();
    console.log('Reset to default selected resources:', selectedResources.value.map(r => r.id));
  }

  // Import/Export methods for sharing between users
  function importTrackData(track, options = {}) {
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
      saveToStorage();
      
      return newTrack;
    } catch (error) {
      console.error('Error importing track data:', error);
      throw new Error('Failed to import track data');
    }
  }

  function importMultipleTracksData(tracks, resources = [], options = {}) {
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

      saveToStorage();
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
    trTracks,
    isInitialized,

    // Computed
    activeTracks,
    completedTracks,

    // Methods
    init,
    loadFromStorage,
    saveToStorage,
    updateSelectedResources,
    addCustomResource,
    removeCustomResource,
    createTRTrack,
    updateTRTrack,
    updateResourceOrder,
    deleteTRTrack,
    completeTRTrack,
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
    updateCustomResource
  };
});
