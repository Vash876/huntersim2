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

            <!-- Hunter Builds -->
            <button
              @click="openBuildSelectionModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconChartLine size="18" />
              <span>Hunter Builds</span>
            </button>

            <!-- Import -->
            <button
              @click="openImportModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconDownload size="18" />
              <span>Import</span>
            </button>

            <!-- Friends Tracks -->
            <button
              v-if="isUserAuthenticated && (!friendsStore.isInitialized || friendsStore.friendCount > 0)"
              @click="showFriendsTracksModal = true"
              :disabled="!friendsStore.isInitialized"
              class="relative flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-semibold shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait text-xs sm:text-sm"
            >
              <div v-if="!friendsStore.isInitialized" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <IconUsersGroup v-else size="18" />
              <span>Friends</span>
              <span 
                v-if="friendsStore.isInitialized && friendsStore.friendsTracks.length > 0" 
                class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-indigo-400 text-xs rounded-full px-1"
              >{{ friendsStore.friendsTracks.length }}</span>
            </button>

            <!-- Multi-TR Comparison -->
            <button
              @click="openMultiTRComparisonModal"
              :disabled="trTracks.length < 2"
              :title="trTracks.length < 2 ? 'At least 2 TR plans are required for comparison' : 'Compare progress across multiple TR tracks'"
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

    <!-- Loading State (während Store initialisiert wird) -->
    <div v-if="!trTrackingStore.isInitialized" class="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
        <div>
          <h3 class="text-blue-200 font-medium">Loading TR Tracking...</h3>
          <p class="text-blue-300/80 text-sm mt-1">
            Initializing your tracking data, please wait...
          </p>
        </div>
      </div>
    </div>

    <!-- Resource Settings Notice (wenn Store geladen aber keine Ressourcen ausgewählt) -->
    <div v-else-if="!hasSelectedResources" class="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mb-6">
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
    <div v-if="trTrackingStore.isInitialized && hasSelectedResources" class="space-y-6">
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
              <h2 class="text-xl font-semibold text-white">{{ showArchive ? 'Archived Plans' : 'Tracking Plans Overview' }}</h2>
              <p class="text-sm text-gray-400 mt-1">{{ trTracks.length }} plan{{ trTracks.length !== 1 ? 's' : '' }} total</p>
            </div>
            <div class="flex items-center gap-4">
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
              <button
                @click="showArchive = !showArchive"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                :class="showArchive 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'"
                :title="showArchive ? 'Back to Plans' : `Show Archive (${archivedTracks.length})`"
              >
                <IconArchive size="16" />
                <span>{{ showArchive ? 'Back' : `Archive (${archivedTracks.length})` }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Table Content -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700/50">
              <tr>
                <th class="text-left py-2 px-3 text-gray-300 font-medium text-sm">TR#</th>
                <th class="text-center py-2 px-3 text-gray-300 font-medium text-sm">Entries</th>
                <th class="text-center py-2 px-3 text-gray-300 font-medium text-sm">Duration</th>
                
                <!-- Combined Draggable Columns Header (Initial Values + Resources) -->
                <Draggable
                  v-model="draggableColumns"
                  item-key="id"
                  tag="th"
                  handle=".grip-handle"
                  :animation="200"
                  ghost-class="ghost-column"
                  class="contents"
                >
                  <template #item="{ element }">
                    <th class="text-center py-2 px-3 text-gray-300 font-medium text-sm">
                      <div class="flex items-center justify-center gap-1">
                        <IconGripVertical 
                          size="14" 
                          class="grip-handle text-gray-500 hover:text-gray-300 transition-colors cursor-grab active:cursor-grabbing" 
                        />
                        <span :class="element.type === 'initial' ? 'text-white' : ''">{{ element.name }}</span>
                      </div>
                    </th>
                  </template>
                </Draggable>
                
                <th class="text-center py-2 px-3 text-gray-300 font-medium text-sm">Status</th>
                <th class="text-center py-2 px-3 text-gray-300 font-medium text-sm">Actions</th>
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
                <td class="py-2 px-3">
                  <div class="text-white font-medium whitespace-nowrap">
                    TR#{{ track.trCount || 0 }} - {{ track.name }}
                  </div>
                  <div class="text-[10px] text-gray-500">
                    {{ formatDateShort(track.startDate) }}
                    <span v-if="!track.isActive && track.endDate"> → {{ formatDateShort(track.endDate) }}</span>
                  </div>
                </td>

                <!-- Entries Count -->
                <td class="py-2 px-3 text-center text-white">
                  {{ track.entries.length }}
                </td>

                <!-- Duration -->
                <td class="py-2 px-3 text-center text-gray-300 text-sm">
                  {{ getTrackDuration(track) }}
                </td>

                <!-- Combined Columns (Initial Values + Resources in draggable order) -->
                <td 
                  v-for="column in draggableColumns"
                  :key="column.id"
                  class="py-2 px-3 text-center font-mono text-sm"
                  :style="{ color: column.color }"
                >
                  <!-- Initial Value Column -->
                  <div v-if="column.type === 'initial'">
                    <span class="font-bold">{{ getInitialValue(track, column) }}</span>
                    <div 
                      v-if="getInitialValueDiff(track, column) !== null"
                      class="text-[10px] text-white"
                    >
                      {{ getInitialValueDiff(track, column) > 0 ? '+' : (getInitialValueDiff(track, column) < 0 ? '-' : '') }}{{ formatInitialValueDiff(track, column) }}
                    </div>
                  </div>
                  <!-- Resource Column -->
                  <div v-else>
                    <span class="font-bold">{{ getHighestValue(track, column.id) }}</span>
                    <div 
                      v-if="getResourceDiff(track, column.id) !== null"
                      class="text-[10px] text-white"
                    >
                      {{ getResourceDiff(track, column.id) > 0 ? '+' : (getResourceDiff(track, column.id) < 0 ? '-' : '') }}{{ formatResourceDiff(track, column.id) }}
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="py-2 px-3 text-center">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-900/50 text-green-300 border border-green-700/50': track.isActive,
                      'bg-blue-900/50 text-blue-300 border border-blue-700/50': !track.isActive
                    }"
                  >
                    {{ track.isActive ? 'Active' : 'Done' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-2 px-3 text-center" @click.stop>
                  <div class="flex items-center justify-center gap-0.5">
                    <button
                      @click="openProgressModal(track)"
                      class="p-1 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
                      title="Progress & Charts"
                    >
                      <IconChartLine size="15" />
                    </button>
                    <button
                      @click="shareTrack(track)"
                      class="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors"
                      title="Share Track Code"
                    >
                      <IconShare size="15" />
                    </button>
                    <button
                      v-if="isUserAuthenticated"
                      @click.stop="toggleCloudShare(track)"
                      :disabled="!friendsReady"
                      class="p-1 rounded transition-colors"
                      :class="!friendsReady
                        ? 'text-gray-600 cursor-wait'
                        : friendsStore.isTrackShared(track.id) 
                          ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20' 
                          : 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20'"
                      :title="!friendsReady ? 'Loading...' : friendsStore.isTrackShared(track.id) ? 'Shared with friends (click to unshare)' : 'Share with friends'"
                    >
                      <IconCloud v-if="friendsReady && friendsStore.isTrackShared(track.id)" size="15" />
                      <IconCloudOff v-else size="15" />
                    </button>
                    <button
                      @click="editTrack(track)"
                      class="p-1 text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20 rounded transition-colors"
                      title="Edit Track Settings"
                    >
                      <IconEdit size="15" />
                    </button>
                    <button
                      @click="copyTrack(track)"
                      class="p-1 text-gray-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition-colors"
                      title="Copy Track"
                    >
                      <IconCopy size="15" />
                    </button>
                    <button
                      v-if="!track.isArchived"
                      @click="archiveTrack(track)"
                      class="p-1 text-gray-400 hover:text-orange-400 hover:bg-orange-900/20 rounded transition-colors"
                      title="Archive Track"
                    >
                      <IconArchive size="15" />
                    </button>
                    <button
                      v-else
                      @click="unarchiveTrack(track)"
                      class="p-1 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
                      title="Restore from Archive"
                    >
                      <IconArchiveOff size="15" />
                    </button>
                    <button
                      @click="deleteTrack(track)"
                      class="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                      title="Delete Track"
                    >
                      <IconTrash size="15" />
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

    <BuildSelectionModal
      :show="showBuildSelectionModal"
      :initial-selected-builds="selectedHunterBuilds"
      :initial-enabled-hunters="enabledHunters"
      @close="showBuildSelectionModal = false"
      @save="handleBuildSelectionSave"
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

    <FriendsTracksModal
      :show="showFriendsTracksModal"
      @close="showFriendsTracksModal = false"
      @import="handleFriendsTrackImport"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { formatSuffixInput } from '@/composables/format.js';
import Decimal from 'break_infinity.js';
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
  IconTrendingUp,
  IconGripVertical,
  IconArchive,
  IconArchiveOff,
  IconCloud,
  IconCloudOff,
  IconUsersGroup
} from '@tabler/icons-vue';

// Components
import ResourceSettingsModal from '@/components/tr-tracking/ResourceSettingsModal.vue';
import NewTRModal from '@/components/tr-tracking/NewTRModal.vue';
import TrackDetailsModal from '@/components/tr-tracking/TrackDetailsModal.vue';
import ProgressModal from '@/components/tr-tracking/ProgressModal.vue';
import ImportModal from '@/components/tr-tracking/ImportModal.vue';
import ShareTrackModal from '@/components/tr-tracking/ShareTrackModal.vue';
import MultiTRComparisonModal from '@/components/tr-tracking/MultiTRComparisonModal.vue';
import BuildSelectionModal from '@/components/tr-tracking/BuildSelectionModal.vue';
import AlertDialog from '@/components/common/AlertDialog.vue';
import FriendsTracksModal from '@/components/tr-tracking/FriendsTracksModal.vue';
import Draggable from 'vuedraggable';

import { useFriendsStore } from '@/store/friendsStore';
import { neonAuthService } from '@/services/neonAuthService';

// Store
const trTrackingStore = useTRTrackingStore();
const gemPlannerStore = useGemPlannerStore();
const friendsStore = useFriendsStore();

// Friends loading state
const mySharedTracksLoaded = ref(false);

// Show friends UI elements as soon as user is authenticated
const isUserAuthenticated = computed(() => neonAuthService.isAuthenticated.value);
const friendsReady = computed(() => friendsStore.isInitialized && mySharedTracksLoaded.value);

// Reactive data
const showResourceSettingsModal = ref(false);
const showNewTRModal = ref(false);
const showEditTRModal = ref(false);
const showTrackDetailsModal = ref(false);
const showProgressModal = ref(false);
const showImportModal = ref(false);
const showShareTrackModal = ref(false);
const showMultiTRComparisonModal = ref(false);
const showBuildSelectionModal = ref(false);
const showFriendsTracksModal = ref(false);
const currentTrack = ref(null);
const showArchive = ref(false);

// Hunter Build Selection State - connect to store for persistence
const selectedHunterBuilds = computed(() => trTrackingStore.hunterBuildSettings?.selectedBuilds || {});
const enabledHunters = computed(() => trTrackingStore.hunterBuildSettings?.enabledHunters || {});

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

// Combined draggable columns (Initial Values + Resources)
const draggableColumns = computed({
  get: () => {
    // Get initial values
    const initialValues = trTrackingStore.showInitialValuesInTable
      .map(id => {
        const iv = trTrackingStore.availableInitialValues.find(item => item.id === id);
        return iv ? { ...iv, type: 'initial' } : null;
      })
      .filter(Boolean);
    
    // Get resources
    const resources = getHighestValueResources()
      .map(r => ({ ...r, type: 'resource' }));
    
    // Combine in stored order or default (initial values first, then resources)
    const storedOrder = trTrackingStore.columnOrder || [];
    
    if (storedOrder.length > 0) {
      // Sort by stored order
      const combined = [...initialValues, ...resources];
      return storedOrder
        .map(id => combined.find(c => c.id === id))
        .filter(Boolean)
        .concat(combined.filter(c => !storedOrder.includes(c.id)));
    }
    
    return [...initialValues, ...resources];
  },
  set: (newOrder) => {
    // Save the combined order
    const newColumnOrder = newOrder.map(c => c.id);
    trTrackingStore.updateColumnOrder(newColumnOrder);
    
    // Also update individual stores for backwards compatibility
    const initialValueIds = newOrder.filter(c => c.type === 'initial').map(c => c.id);
    const resourceIds = newOrder.filter(c => c.type === 'resource').map(c => c.id);
    
    trTrackingStore.updateShowInitialValuesInTable(initialValueIds);
    trTrackingStore.updateShowInTableResourcesOrder(resourceIds);
  }
});

const trTracks = computed(() => {
  const tracks = showArchive.value 
    ? trTrackingStore.archivedTracks 
    : trTrackingStore.trTracks.filter(t => !t.isArchived);
  
  return [...tracks].sort((a, b) => {
    // 1. Aktive Tracks zuerst
    if (a.isActive !== b.isActive) {
      return b.isActive - a.isActive;
    }
    
    // 2. Dann nach End-Datum (neueste zuerst)
    // Für aktive Tracks verwende createdAt als Fallback
    const dateA = a.endDate ? new Date(a.endDate) : new Date(a.createdAt);
    const dateB = b.endDate ? new Date(b.endDate) : new Date(b.createdAt);
    return dateB - dateA;
  });
});
const activeTracks = computed(() => trTrackingStore.activeTracks);
const completedTracks = computed(() => trTrackingStore.completedTracks);
const archivedTracks = computed(() => trTrackingStore.archivedTracks);
const hasSelectedResources = computed(() => selectedResources.value.length > 0);

// Methods
function openResourceSettingsModal() {
  showResourceSettingsModal.value = true;
}

function openBuildSelectionModal() {
  showBuildSelectionModal.value = true;
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

function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function getTrackDuration(track) {
  if (!track.startDate) return '-';
  
  const start = new Date(track.startDate);
  const end = track.endDate ? new Date(track.endDate) : new Date();
  
  const diffMs = end - start;
  if (diffMs < 0) return '-';
  
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  return `${hours}:${String(mins).padStart(2, '0')}`;
}

function getHighestValueResources() {
  // Return resources that are selected to show in table
  return trTrackingStore.showInTableResources.map(resourceId => {
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
  
  // Get the resource to check its format and dataType
  const resource = trTrackingStore.availableResources.find(r => r.id === resourceId);
  
  // Handle boolean dataType
  if (resource && resource.dataType === 'boolean') {
    const boolValues = track.entries
      .map(entry => entry.values[resourceId])
      .filter(value => value !== undefined && value !== null);
    
    if (boolValues.length === 0) return '✗';
    
    // Show the most recent boolean value
    const latestValue = boolValues[0];
    const boolResult = latestValue === true || latestValue === 'true' || latestValue === 1 || latestValue === '1';
    return boolResult ? '✓' : '✗';
  }
  
  // Special handling for time format resources (e.g., hours-in-tr)
  if (resource && resource.format === 'time') {
    const timeValues = track.entries
      .map(entry => entry.values[resourceId])
      .filter(value => value && value !== '');
    
    if (timeValues.length === 0) return '0:00';
    
    // Convert time strings to minutes for comparison
    const timeInMinutes = timeValues.map(timeStr => {
      if (!timeStr || typeof timeStr !== 'string') return 0;
      const parts = timeStr.split(':');
      if (parts.length !== 2) return 0;
      const hours = parseInt(parts[0], 10) || 0;
      const mins = parseInt(parts[1], 10) || 0;
      return hours * 60 + mins;
    });
    
    const maxMinutes = Math.max(...timeInMinutes);
    const hours = Math.floor(maxMinutes / 60);
    const mins = maxMinutes % 60;
    
    // Format as HH:MM (or HHH:MM or HHHH:MM for very high hours)
    return `${hours}:${String(mins).padStart(2, '0')}`;
  }
  
  // For camp format, just return the last value (most recent camp)
  if (resource && resource.format === 'camp') {
    const campValues = track.entries
      .map(entry => entry.values[resourceId])
      .filter(value => value && value !== '');
    
    if (campValues.length === 0) return '-';
    
    // Return the most recent camp value (first entry since sorted by date desc)
    return campValues[0];
  }
  
  // For text format (notes or text dataType), return dash
  if (resource && (resource.format === 'text' || resource.dataType === 'text')) {
    return '-';
  }
  
  // For numeric resources (including suffix dataType)
  const values = track.entries
    .map(entry => entry.values[resourceId] || 0)
    .filter(value => value > 0);
    
  if (values.length === 0) return '0';
  
  const maxValue = Math.max(...values);
  
  // Apply suffix formatting for suffix dataType or specific resources
  if ((resource && resource.dataType === 'suffix') || resourceId === 'oo-accum' || resourceId === 'attgn3-buff' || resourceId.startsWith('mat3-')) {
    
    if (resourceId === 'attgn3-buff') {
      // Handle very large numbers for attgn3-buff using Decimal
      try {
        const decimal = new Decimal(maxValue);
        if (decimal.gte('1e15')) {
          return decimal.toExponential(2).replace('e+', 'e');
        } else {
          return formatSuffixInput(maxValue);
        }
      } catch (error) {
        return formatSuffixInput(maxValue);
      }
    } else {
      // Use formatSuffixInput for oo-accum, hunter Mat3, and custom suffix resources
      return formatSuffixInput(maxValue);
    }
  }
  
  // For other resources, return as number
  return maxValue.toString();
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

// Get Initial Value for a track
function getInitialValue(track, initialValue) {
  if (!track.initialValues) return '-';
  
  const key = initialValue.key;
  const value = track.initialValues[key];
  
  if (value === undefined || value === null) return '-';
  
  // Handle TS Milestones specially
  if (key === 'tsMilestones' && typeof value === 'object') {
    return `${value.level1 || 0}/${value.level2 || 0}/${value.level3 || 0}`;
  }
  
  // Format based on dataType
  if (initialValue.dataType === 'suffix') {
    return formatSuffixInput(value);
  }
  
  return value.toString();
}

// Get the previous (older) track in the sorted list
function getPreviousTrack(track) {
  const sortedTracks = trTracks.value;
  const currentIndex = sortedTracks.findIndex(t => t.id === track.id);
  
  // Previous track is the one below (older) in the list
  if (currentIndex >= 0 && currentIndex < sortedTracks.length - 1) {
    return sortedTracks[currentIndex + 1];
  }
  
  return null;
}

// Get the difference in initial value compared to previous TR
function getInitialValueDiff(track, initialValue) {
  const previousTrack = getPreviousTrack(track);
  if (!previousTrack) return null;
  
  const key = initialValue.key;
  const currentValue = track.initialValues?.[key];
  const previousValue = previousTrack.initialValues?.[key];
  
  if (currentValue === undefined || previousValue === undefined) return null;
  
  // Handle TS Milestones specially
  if (key === 'tsMilestones') {
    if (typeof currentValue !== 'object' || typeof previousValue !== 'object') return null;
    // Return total diff as sum of all levels
    const currentTotal = (currentValue.level1 || 0) + (currentValue.level2 || 0) + (currentValue.level3 || 0);
    const previousTotal = (previousValue.level1 || 0) + (previousValue.level2 || 0) + (previousValue.level3 || 0);
    return currentTotal - previousTotal;
  }
  
  return currentValue - previousValue;
}

// Format the diff value for display
function formatInitialValueDiff(track, initialValue) {
  const diff = getInitialValueDiff(track, initialValue);
  if (diff === null) return '';
  
  // Format based on dataType
  if (initialValue.dataType === 'suffix') {
    return formatSuffixInput(Math.abs(diff));
  }
  
  return Math.abs(diff).toString();
}

// Get the difference in highest resource value compared to previous TR
function getResourceDiff(track, resourceId) {
  const previousTrack = getPreviousTrack(track);
  if (!previousTrack) return null;
  
  // Get raw highest values for comparison
  const currentValue = getHighestValueRaw(track, resourceId);
  const previousValue = getHighestValueRaw(previousTrack, resourceId);
  
  if (currentValue === null || previousValue === null) return null;
  if (typeof currentValue !== 'number' || typeof previousValue !== 'number') return null;
  
  return currentValue - previousValue;
}

// Get raw highest value (numeric) for diff calculation
function getHighestValueRaw(track, resourceId) {
  if (track.entries.length === 0) return null;
  
  const resource = trTrackingStore.availableResources.find(r => r.id === resourceId);
  
  // Skip non-numeric types
  if (resource && (resource.format === 'time' || resource.format === 'camp' || 
      resource.format === 'text' || resource.dataType === 'text' || resource.dataType === 'boolean')) {
    return null;
  }
  
  const values = track.entries
    .map(entry => entry.values[resourceId] || 0)
    .filter(value => value > 0);
    
  if (values.length === 0) return 0;
  
  return Math.max(...values);
}

// Format resource diff for display
function formatResourceDiff(track, resourceId) {
  const diff = getResourceDiff(track, resourceId);
  if (diff === null) return '';
  
  const resource = trTrackingStore.availableResources.find(r => r.id === resourceId);
  
  // Apply suffix formatting for suffix dataType or specific resources
  if ((resource && resource.dataType === 'suffix') || resourceId === 'oo-accum' || resourceId === 'attgn3-buff' || resourceId.startsWith('mat3-')) {
    return formatSuffixInput(Math.abs(diff));
  }
  
  return Math.abs(diff).toString();
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
  
  // Helper function to update global hours in TR
  const updateGlobalHoursInTR = (trackId, entry) => {
    // Check if this is the newest track (first in sorted list)
    const isNewestTrack = trTracks.value[0]?.id === trackId;
    
    if (isNewestTrack && entry.values && entry.values['hours-in-tr']) {
      const hoursInTRValue = entry.values['hours-in-tr'];
      
      // Parse time format "HH:MM" to decimal hours
      if (typeof hoursInTRValue === 'string' && hoursInTRValue.includes(':')) {
        const [hours, minutes] = hoursInTRValue.split(':').map(Number);
        const totalHours = hours + (minutes / 60);
        gemPlannerStore.updateHoursInTR(totalHours);
      } else if (typeof hoursInTRValue === 'number') {
        gemPlannerStore.updateHoursInTR(hoursInTRValue);
      }
    }
  };
  
  switch (action) {
    case 'addEntry':
      trTrackingStore.addEntry(trackId, entry);
      updateGlobalHoursInTR(trackId, entry);
      break;
    case 'updateEntry':
      trTrackingStore.updateEntry(trackId, entry.id, entry);
      updateGlobalHoursInTR(trackId, entry);
      break;
    case 'deleteEntry':
      trTrackingStore.deleteEntry(trackId, entryId);
      break;
    case 'updateResourceOrder':
      // For now, we'll just log this. The resource order could be saved per track if needed.
      // This would require extending the store to save column order per track
      break;
    case 'complete':
      trTrackingStore.completeTRTrack(trackId);
      showTrackDetailsModal.value = false;
      currentTrack.value = null;
      break;
    case 'delete':
      trTrackingStore.deleteTRTrack(trackId);
      showTrackDetailsModal.value = false;
      currentTrack.value = null;
      break;
    case 'showProgress':
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
    isArchived: false, // New copy should not be archived
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

// Archive track
async function archiveTrack(track) {
  try {
    await trTrackingStore.archiveTRTrack(track.id);
    console.log('Track archived:', track.name);
  } catch (error) {
    console.error('Failed to archive track:', error);
    alert('Failed to archive track. Please try again.');
  }
}

// Unarchive track
async function unarchiveTrack(track) {
  try {
    await trTrackingStore.unarchiveTRTrack(track.id);
    console.log('Track restored from archive:', track.name);
  } catch (error) {
    console.error('Failed to restore track:', error);
    alert('Failed to restore track. Please try again.');
  }
}

// Handle import
function handleImport(trackData) {
  // Add the imported track to the store
  trTrackingStore.createTRTrack(trackData);
  showImportModal.value = false;
}

// Handle import from friends tracks
function handleFriendsTrackImport(trackData) {
  trTrackingStore.createTRTrack(trackData);
}

// Toggle cloud share for a track
async function toggleCloudShare(track) {
  if (!friendsStore.isInitialized) return;
  try {
    if (friendsStore.isTrackShared(track.id)) {
      await friendsStore.stopSharingTrack(track.id);
    } else {
      await friendsStore.shareTrack(track, 'friends');
    }
  } catch (err) {
    console.error('Cloud share toggle failed:', err);
  }
}

// Handle Hunter Build Selection
function handleBuildSelectionSave(data) {
  // Update the store with hunter production settings
  trTrackingStore.updateHunterBuildSettings(data);
  
  console.log('Hunter Build Selection saved:', data);
  showBuildSelectionModal.value = false;
}

// When friends store becomes ready, mark shared tracks as loaded (data comes from cache)
watch(() => friendsStore.isInitialized, (initialized) => {
  if (initialized) {
    // Data is already in the store (loaded from session cache or first init)
    // No additional Firestore reads needed
    mySharedTracksLoaded.value = true;
  } else {
    mySharedTracksLoaded.value = false;
  }
}, { immediate: true });

// Lifecycle
onMounted(async () => {
  await trTrackingStore.init();
});
</script>

<style scoped>
/* Draggable column styles */
.ghost-column {
  opacity: 0.5;
  background-color: rgba(59, 130, 246, 0.2);
}

.grip-handle {
  cursor: grab;
}

.grip-handle:active {
  cursor: grabbing;
}

/* Smooth transition for column reordering */
.flip-list-move {
  transition: transform 0.3s ease;
}
</style>
