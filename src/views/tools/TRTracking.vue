<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Top Section mit Header und Aktionsleiste -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <!-- Header mit Farb-Gradient -->
      <div class="bg-gradient-to-r from-green-900 to-gray-800 p-4 sm:p-5 border-b border-gray-600">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <!-- Bild und Überschrift in einer Zeile -->
            <div class="flex items-center mb-1">
              <IconChartLine size="24" class="mr-2 text-green-400" />
              <h1 class="text-2xl font-bold">TR Tracking</h1>
            </div>
            <p class="text-sm text-gray-300">Track your progress across Traversal Resets</p>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row sm:flex-wrap justify-end gap-3">
            <!-- Resource Settings -->
            <button
              @click="openResourceSettingsModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconSettings size="18" class="" />
              <span>Settings</span>
            </button>

            <!-- Import -->
            <button
              @click="openImportModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconDownload size="18" />
              <span>Import</span>
            </button>

            <!-- Multi-TR Comparison -->
            <button
              @click="openMultiTRComparisonModal"
              :disabled="trTracks.length < 2"
              class="relative flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              <IconTrendingUp size="18" />
              <span>Compare</span>
              <span v-if="trTracks.length < 2" class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-xs rounded-full">!</span>
            </button>

            <!-- New TR Plan -->
            <button
              @click="openNewTRModal"
              :disabled="!hasSelectedResources"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              <IconPlus size="18" />
              <span>New Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resource Settings Notice (wenn keine Ressourcen ausgewählt) -->
    <div v-if="!hasSelectedResources" class="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <IconAlertTriangle size="20" class="text-yellow-400 mr-3" />
        <div>
          <h3 class="text-yellow-200 font-medium">Setup Required</h3>
          <p class="text-yellow-300/80 text-sm mt-1">
            Please configure your tracking resources in the Resource Settings before creating your first TR track.
          </p>
        </div>
      </div>
    </div>

    <!-- TR Tracks List -->
    <div v-if="hasSelectedResources" class="space-y-6">
      <!-- Empty State -->
      <div v-if="trTracks.length === 0" class="text-center py-12">
        <IconChartLine size="64" class="mx-auto text-gray-600 mb-4" />
        <h3 class="text-xl font-semibold text-gray-300 mb-2">No TR Tracks yet</h3>
        <p class="text-gray-400 mb-6">Create your first TR track to start monitoring your progress</p>
        <button
          @click="openNewTRModal"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <IconPlus size="20" class="inline mr-2" />
          Create First TR Track
        </button>
      </div>

      <!-- TR Tracks Table -->
      <div v-else class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
        <!-- Table Header -->
        <div class="p-4 border-b border-gray-700/50 bg-gray-800/80">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-white">Tracking Plans Overview</h2>
              <p class="text-sm text-gray-400 mt-1">{{ trTracks.length }} plan{{ trTracks.length !== 1 ? 's' : '' }} total</p>
            </div>
            <div class="flex items-center gap-4 text-sm">
              <span class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-gray-300">Active: {{ activeTracks.length }}</span>
              </span>
              <span class="flex items-center gap-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span class="text-gray-300">Completed: {{ completedTracks.length }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Table Content -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700/50">
              <tr>
                <th class="text-left py-3 px-4 text-gray-300 font-medium text-sm">TR#</th>
                <th class="text-center py-3 px-4 text-gray-300 font-medium text-sm">Entries</th>
                <th 
                  v-for="resource in getHighestValueResources()" 
                  :key="resource.id"
                  class="text-center py-3 px-4 text-gray-300 font-medium text-sm"
                >
                  <span class="flex items-center justify-center gap-1">
                    <span>Highest {{ resource.name }}</span>
                  </span>
                </th>
                <th class="text-center py-3 px-4 text-gray-300 font-medium text-sm">Status</th>
                <th class="text-center py-3 px-4 text-gray-300 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="track in trTracks"
                :key="track.id"
                class="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors cursor-pointer"
                @click="openTrackDetailsModal(track)"
              >
                <!-- TR Name -->
                <td class="py-4 px-4">
                  <div>
                    <div class="text-white font-medium">TR#{{ track.trCount || 0 }} - {{ track.name }}</div>
                    <div class="text-xs text-gray-400">Started: {{ formatDate(track.startDate) }}</div>
                  </div>
                </td>

                <!-- Entries Count -->
                <td class="py-4 px-4 text-center text-white">
                  {{ track.entries.length }}
                </td>

                <!-- Highest Values for Selected Resources -->
                <td 
                  v-for="resource in getHighestValueResources()"
                  :key="resource.id"
                  class="py-4 px-4 text-center font-mono font-bold"
                  :style="{ color: resource.color }"
                >
                  {{ getHighestValue(track, resource.id) }}
                </td>

                <!-- Status -->
                <td class="py-4 px-4 text-center">
                  <span 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-900/50 text-green-300 border border-green-700/50': track.isActive,
                      'bg-blue-900/50 text-blue-300 border border-blue-700/50': !track.isActive
                    }"
                  >
                    {{ track.isActive ? 'Active' : 'Completed' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-4 px-4 text-center" @click.stop>
                  <div class="flex items-center justify-center gap-1">
                    <button
                      @click="openProgressModal(track)"
                      class="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
                      title="Progress & Charts"
                    >
                      <IconChartLine size="16" />
                    </button>
                    <button
                      @click="shareTrack(track)"
                      class="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                      title="Share Track Code"
                    >
                      <IconShare size="16" />
                    </button>
                    <button
                      @click="editTrack(track)"
                      class="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20 rounded transition-colors"
                      title="Edit Track Settings"
                    >
                      <IconEdit size="16" />
                    </button>
                    <button
                      @click="copyTrack(track)"
                      class="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition-colors"
                      title="Copy Track"
                    >
                      <IconCopy size="16" />
                    </button>
                    <button
                      @click="deleteTrack(track)"
                      class="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                      title="Delete Track"
                    >
                      <IconTrash size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="p-4 bg-gray-800/30 border-t border-gray-700/50 text-right">
          <p class="text-xs text-gray-400">
            {{ trTracks.length }} plan{{ trTracks.length !== 1 ? 's' : '' }} total
            <span class="ml-4">Last updated: {{ getLastUpdatedTime() }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ResourceSettingsModal
      :show="showResourceSettingsModal"
      :selectedResources="selectedResources"
      @close="showResourceSettingsModal = false"
      @save="handleResourceSettingsSave"
      @updateStandardResource="handleUpdateStandardResource"
      @updateCustomResource="handleUpdateCustomResource"
    />

    <NewTRModal
      :show="showNewTRModal"
      @close="showNewTRModal = false"
      @save="handleNewTRSave"
    />

    <NewTRModal
      :show="showEditTRModal"
      :edit-mode="true"
      :track-data="currentTrack"
      @close="showEditTRModal = false"
      @save="handleEditTRSave"
    />

    <TrackDetailsModal
      :show="showTrackDetailsModal"
      :track="currentTrack"
      @close="showTrackDetailsModal = false"
      @update="handleTrackUpdate"
      @showProgress="handleTrackUpdate({ action: 'showProgress' })"
    />

    <ProgressModal
      :show="showProgressModal"
      :track="currentTrack"
      :selectedResources="selectedResources"
      @close="showProgressModal = false"
    />

    <ImportModal
      :show="showImportModal"
      @close="showImportModal = false"
      @import="handleImport"
    />

    <ShareTrackModal
      :show="showShareTrackModal"
      :track="currentTrack"
      @close="showShareTrackModal = false"
    />

    <MultiTRComparisonModal
      :show="showMultiTRComparisonModal"
      :tracks="trTracks"
      :selectedResources="selectedResources"
      @close="showMultiTRComparisonModal = false"
    />

    <AlertDialog
      :is-visible="alertDialog.isVisible"
      :title="alertDialog.title"
      :message="alertDialog.message"
      :type="alertDialog.type"
      :show-cancel="alertDialog.showCancel"
      :confirm-text="alertDialog.confirmText"
      :cancel-text="alertDialog.cancelText"
      @confirm="confirmDialog"
      @cancel="cancelDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import {
  IconChartLine,
  IconSettings,
  IconPlus,
  IconAlertTriangle,
  IconChevronDown,
  IconDatabase,
  IconTrash,
  IconShare,
  IconCopy,
  IconEdit,
  IconDownload,
  IconTrendingUp
} from '@tabler/icons-vue';

// Components
import ResourceSettingsModal from '@/components/tr-tracking/ResourceSettingsModal.vue';
import NewTRModal from '@/components/tr-tracking/NewTRModal.vue';
import TrackDetailsModal from '@/components/tr-tracking/TrackDetailsModal.vue';
import ProgressModal from '@/components/tr-tracking/ProgressModal.vue';
import ImportModal from '@/components/tr-tracking/ImportModal.vue';
import ShareTrackModal from '@/components/tr-tracking/ShareTrackModal.vue';
import MultiTRComparisonModal from '@/components/tr-tracking/MultiTRComparisonModal.vue';
import AlertDialog from '@/components/common/AlertDialog.vue';

// Store
const trTrackingStore = useTRTrackingStore();

// Reactive data
const showResourceSettingsModal = ref(false);
const showNewTRModal = ref(false);
const showEditTRModal = ref(false);
const showTrackDetailsModal = ref(false);
const showProgressModal = ref(false);
const showImportModal = ref(false);
const showShareTrackModal = ref(false);
const showMultiTRComparisonModal = ref(false);
const currentTrack = ref(null);

// AlertDialog state
const alertDialog = ref({
  isVisible: false,
  title: '',
  message: '',
  type: 'info',
  showCancel: true,
  confirmText: 'OK',
  cancelText: 'Cancel',
  onConfirm: null
});

// Computed
const selectedResources = computed(() => trTrackingStore.selectedResources);
const trTracks = computed(() => trTrackingStore.trTracks);
const activeTracks = computed(() => trTrackingStore.activeTracks);
const completedTracks = computed(() => trTrackingStore.completedTracks);
const hasSelectedResources = computed(() => selectedResources.value.length > 0);

// Methods
function openResourceSettingsModal() {
  showResourceSettingsModal.value = true;
}

function openImportModal() {
  showImportModal.value = true;
}

function openMultiTRComparisonModal() {
  if (trTracks.value.length < 2) {
    return; // Button should be disabled, but just in case
  }
  showMultiTRComparisonModal.value = true;
}

function shareTrack(track) {
  currentTrack.value = track;
  showShareTrackModal.value = true;
}

function openNewTRModal() {
  if (!hasSelectedResources.value) {
    openResourceSettingsModal();
    return;
  }
  showNewTRModal.value = true;
}

function openTrackDetailsModal(track) {
  currentTrack.value = track;
  showTrackDetailsModal.value = true;
}

function openProgressModal(track) {
  currentTrack.value = track;
  showProgressModal.value = true;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getHighestValueResources() {
  // Return specific resources: Cells, MP, Shards, RP for the table columns
  const targetResourceIds = ['cells', 'mp', 'shards', 'rp'];
  
  return targetResourceIds.map(resourceId => {
    // Get the current resource data from store (which has the latest colors)
    const storeResource = trTrackingStore.availableResources.find(r => r.id === resourceId);
    return storeResource;
  }).filter(resource => resource); // Filter out undefined resources
}

function getSelectedResourcesWithCurrentColors() {
  // Return all selected resources with current colors from store
  return selectedResources.value.map(selectedResource => {
    // Get the current resource data from store (which has the latest colors)
    const storeResource = trTrackingStore.availableResources.find(r => r.id === selectedResource.id);
    return storeResource || selectedResource; // Fallback to selected if not found
  });
}

function getHighestValue(track, resourceId) {
  if (track.entries.length === 0) return '0';
  
  const values = track.entries
    .map(entry => entry.values[resourceId] || 0)
    .filter(value => value > 0);
    
  if (values.length === 0) return '0';
  
  const maxValue = Math.max(...values);
  return maxValue;
}

function getLastUpdatedTime() {
  if (trTracks.value.length === 0) return 'Never';
  
  const lastUpdate = Math.max(...trTracks.value.map(track => 
    new Date(track.updatedAt || track.createdAt).getTime()
  ));
  
  const date = new Date(lastUpdate);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Event handlers
function handleResourceSettingsSave(resources) {
  trTrackingStore.updateSelectedResources(resources);
  showResourceSettingsModal.value = false;
}

function handleUpdateStandardResource(resourceData) {
  const { id, color } = resourceData;
  trTrackingStore.updateStandardResourceColor(id, color);
}

function handleUpdateCustomResource(resourceData) {
  const { id, name, color } = resourceData;
  trTrackingStore.updateCustomResource(id, { name, color });
}

function handleNewTRSave(trackData) {
  trTrackingStore.createTRTrack(trackData);
  showNewTRModal.value = false;
}

function handleEditTRSave(trackData) {
  // Update the existing track with new data
  trTrackingStore.updateTRTrackSettings(currentTrack.value.id, trackData);
  showEditTRModal.value = false;
  currentTrack.value = null;
}

function editTrack(track) {
  currentTrack.value = track;
  showEditTRModal.value = true;
}

function handleTrackUpdate(updateData) {
  const { action, trackId, entryId, entry } = updateData;
  
  console.log('handleTrackUpdate called with:', updateData);
  
  switch (action) {
    case 'addEntry':
      console.log('Adding entry to track:', trackId, entry);
      trTrackingStore.addEntry(trackId, entry);
      break;
    case 'updateEntry':
      console.log('Updating entry in track:', trackId, entry);
      trTrackingStore.updateEntry(trackId, entry.id, entry);
      break;
    case 'deleteEntry':
      console.log('Deleting entry from track:', trackId, entryId);
      trTrackingStore.deleteEntry(trackId, entryId);
      break;
    case 'updateResourceOrder':
      console.log('Updating resource order for track:', trackId, updateData.resourceOrder);
      // For now, we'll just log this. The resource order could be saved per track if needed.
      // This would require extending the store to save column order per track
      break;
    case 'complete':
      console.log('Completing track:', trackId);
      trTrackingStore.completeTRTrack(trackId);
      showTrackDetailsModal.value = false;
      currentTrack.value = null;
      break;
    case 'delete':
      console.log('Deleting track:', trackId);
      trTrackingStore.deleteTRTrack(trackId);
      showTrackDetailsModal.value = false;
      currentTrack.value = null;
      break;
    case 'showProgress':
      console.log('Showing progress modal');
      showTrackDetailsModal.value = false;
      showProgressModal.value = true;
      return; // Don't close modals or reset currentTrack
    default:
      console.warn('Unknown action in handleTrackUpdate:', action);
  }
  
  // Update currentTrack with latest data from store for non-closing actions
  if (action !== 'complete' && action !== 'delete' && action !== 'showProgress') {
    const updatedTrack = trTrackingStore.getTRTrack(trackId);
    if (updatedTrack) {
      currentTrack.value = updatedTrack;
    }
  }
}

// Dialog functions
function showDialog(options) {
  alertDialog.value = {
    isVisible: true,
    title: options.title || 'Alert',
    message: options.message || '',
    type: options.type || 'info',
    showCancel: options.showCancel !== undefined ? options.showCancel : true,
    confirmText: options.confirmText || 'OK',
    cancelText: options.cancelText || 'Cancel',
    onConfirm: options.onConfirm || null
  };
}

function confirmDialog() {
  if (alertDialog.value.onConfirm) {
    alertDialog.value.onConfirm();
  }
  alertDialog.value.isVisible = false;
}

function cancelDialog() {
  alertDialog.value.isVisible = false;
}

function deleteTrack(track) {
  showDialog({
    title: 'Delete TR Track',
    message: `Are you sure you want to delete "${track.name}"? This action cannot be undone.`,
    type: 'error',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      trTrackingStore.deleteTRTrack(track.id);
    }
  });
}

function copyTrack(track) {
  // Create a copy of the track with a new name and reset some properties
  const copiedTrack = {
    ...track,
    id: undefined, // Will be generated by the store
    name: `${track.name} (Copy)`,
    isActive: true, // New copy should be active
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Copy all entries from the original track
    entries: track.entries.map(entry => ({
      ...entry,
      id: undefined // Will be generated by the store for each entry
    })),
    // Keep the same resources and settings
    selectedResources: track.selectedResources,
    resourceOrder: track.resourceOrder,
    targetGoals: track.targetGoals
  };
  
  try {
    const newTrack = trTrackingStore.createTRTrack(copiedTrack);
    console.log('Track copied successfully:', newTrack.name);
    
    // Optional: Show success message to user
    // You could add a toast notification here if you have one
  } catch (error) {
    console.error('Failed to copy track:', error);
    alert('Failed to copy track. Please try again.');
  }
}

// Handle import
function handleImport(trackData) {
  // Add the imported track to the store
  trTrackingStore.createTRTrack(trackData);
  showImportModal.value = false;
}

// Lifecycle
onMounted(() => {
  trTrackingStore.init();
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
