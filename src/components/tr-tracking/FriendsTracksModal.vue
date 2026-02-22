<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-900 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-lg font-bold text-white flex items-center">
          <IconUsersGroup size="18" class="mr-2 text-indigo-400" />
          Friends' Shared Tracks
        </h2>
        <div class="flex items-center gap-2">
          <button
            @click="refreshTracks"
            :disabled="isRefreshing"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            title="Refresh"
          >
            <IconRefresh size="16" :class="{ 'animate-spin': isRefreshing }" />
          </button>
          <button 
            @click="$emit('close')"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="16" />
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-700 bg-gray-800/50">
        <button
          @click="activeTab = 'visible'"
          class="flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative"
          :class="activeTab === 'visible'
            ? 'text-indigo-400'
            : 'text-gray-400 hover:text-gray-300'"
        >
          Tracks
          <span v-if="visibleTracks.length > 0" class="ml-1 text-xs opacity-70">({{ visibleTracks.length }})</span>
          <div v-if="activeTab === 'visible'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400"></div>
        </button>
        <button
          @click="activeTab = 'hidden'"
          class="flex-1 px-4 py-2.5 text-sm font-medium transition-colors relative"
          :class="activeTab === 'hidden'
            ? 'text-gray-300'
            : 'text-gray-500 hover:text-gray-400'"
        >
          <IconEyeOff size="14" class="inline -mt-0.5 mr-1" />
          Hidden
          <span v-if="hiddenTrackIds.size > 0" class="ml-1 text-xs opacity-70">({{ hiddenTrackIds.size }})</span>
          <div v-if="activeTab === 'hidden'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-400"></div>
        </button>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(85vh-105px)]">
        <!-- Loading -->
        <div v-if="isRefreshing && friendsTracks.length === 0" class="p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-3"></div>
          <p class="text-sm text-gray-400">Loading friends' tracks...</p>
        </div>

        <!-- VISIBLE TAB -->
        <template v-else-if="activeTab === 'visible'">
          <!-- Empty State -->
          <div v-if="visibleTracks.length === 0" class="p-8 text-center">
            <IconUsersGroup size="48" class="mx-auto text-gray-600 mb-3" />
            <h3 class="text-lg font-medium text-gray-300 mb-2">No Shared Tracks</h3>
            <p class="text-sm text-gray-400">
              <template v-if="hiddenTrackIds.size > 0">
                All tracks are hidden. Check the Hidden tab to restore them.
              </template>
              <template v-else>
                None of your friends have shared any TR tracks yet.
                <br>Ask them to share their tracks via the cloud toggle!
              </template>
            </p>
          </div>

          <!-- Tracks grouped by friend -->
          <div v-else class="p-3 space-y-4">
            <div v-for="friend in groupedVisibleTracks" :key="friend.uid" class="bg-gray-700/30 rounded-lg overflow-hidden border border-gray-700/50">
              <!-- Friend Header -->
              <div class="bg-gray-700/50 px-3 py-2 flex items-center gap-2">
                <div 
                  class="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                >
                  {{ (friend.name || 'U').charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-white truncate">{{ friend.name }}</div>
                  <div class="text-xs text-gray-400">{{ friend.tracks.length }} track{{ friend.tracks.length !== 1 ? 's' : '' }}</div>
                </div>
              </div>

              <!-- Friend's Tracks -->
              <div class="divide-y divide-gray-700/50">
                <div 
                  v-for="track in friend.tracks" 
                  :key="track.id"
                  class="px-3 py-2 hover:bg-gray-700/20 transition-colors cursor-pointer"
                  @click="toggleExpand(track)"
                >
                  <div class="flex items-center justify-between gap-2">
                    <!-- Track Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <IconChevronRight 
                          size="14" 
                          class="text-gray-500 transition-transform flex-shrink-0" 
                          :class="{ 'rotate-90': expandedTrackId === track.id }" 
                        />
                        <span class="text-white font-medium text-sm">
                          TR#{{ track.trackMeta?.trCount || '?' }} - {{ track.trackMeta?.name || 'Unnamed' }}
                        </span>
                        <span 
                          class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                          :class="track.trackMeta?.isActive 
                            ? 'bg-green-900/50 text-green-300 border border-green-700/50' 
                            : 'bg-blue-900/50 text-blue-300 border border-blue-700/50'"
                        >
                          {{ track.trackMeta?.isActive ? 'Active' : 'Done' }}
                        </span>
                      </div>
                      <div class="text-xs text-gray-400 mt-0.5 flex items-center gap-3 ml-5">
                        <span v-if="track.trackMeta?.startDate">
                          {{ formatDate(track.trackMeta.startDate) }}
                          <span v-if="track.trackMeta?.endDate"> → {{ formatDate(track.trackMeta.endDate) }}</span>
                        </span>
                        <span>{{ track.trackMeta?.entryCount || 0 }} entries</span>
                        <span v-if="track.updatedAt" class="text-gray-500">
                          Updated {{ formatRelative(track.updatedAt) }}
                        </span>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <button
                        @click.stop="hideTrack(track.id)"
                        class="p-1.5 text-gray-500 hover:text-yellow-400 hover:bg-yellow-900/20 rounded transition-colors"
                        title="Hide track"
                      >
                        <IconEyeOff size="15" />
                      </button>
                      <button
                        @click.stop="importTrack(track)"
                        class="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
                        title="Import to My Tracks"
                      >
                        <IconDownload size="15" />
                      </button>
                    </div>
                  </div>

                  <!-- Expanded Detail View -->
                  <div v-if="expandedTrackId === track.id" class="mt-2 p-2 bg-gray-800/50 rounded-lg border border-gray-600/50" @click.stop>
                    <!-- Resources Overview -->
                    <div v-if="track.entries && track.entries.length > 0" class="space-y-1">
                      <div class="text-xs text-gray-400 font-medium mb-1">Latest Values:</div>
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        <div 
                          v-for="(value, key) in getLatestValues(track)" 
                          :key="key"
                          class="flex justify-between text-xs rounded px-2 py-1 border-l-2"
                          :style="{ borderLeftColor: getResourceColor(key), backgroundColor: getResourceColor(key) + '15' }"
                        >
                          <span class="truncate mr-2" :style="{ color: getResourceColor(key) }">{{ getResourceName(key) }}</span>
                          <span class="text-white font-mono">{{ formatValue(key, value) }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-xs text-gray-500 text-center py-2">No entry data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- HIDDEN TAB -->
        <template v-else>
          <div v-if="hiddenTrackIds.size === 0" class="p-8 text-center">
            <IconEyeOff size="48" class="mx-auto text-gray-600 mb-3" />
            <h3 class="text-lg font-medium text-gray-300 mb-2">No Hidden Tracks</h3>
            <p class="text-sm text-gray-400">Tracks you hide will appear here.</p>
          </div>

          <div v-else class="p-3 space-y-4">
            <!-- Unhide all -->
            <div class="flex justify-end">
              <button 
                @click="unhideAll" 
                class="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <IconEye size="13" />
                Unhide all
              </button>
            </div>

            <div v-for="friend in groupedHiddenTracks" :key="friend.uid" class="bg-gray-700/30 rounded-lg overflow-hidden border border-gray-700/50">
              <!-- Friend Header -->
              <div class="bg-gray-700/50 px-3 py-2 flex items-center gap-2">
                <div 
                  class="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                >
                  {{ (friend.name || 'U').charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-300 truncate">{{ friend.name }}</div>
                  <div class="text-xs text-gray-500">{{ friend.tracks.length }} hidden</div>
                </div>
              </div>

              <div class="divide-y divide-gray-700/50">
                <div 
                  v-for="track in friend.tracks" 
                  :key="track.id"
                  class="px-3 py-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  @click="toggleExpand(track)"
                >
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex-1 min-w-0 flex items-center gap-2">
                      <IconChevronRight 
                        size="14" 
                        class="text-gray-500 transition-transform flex-shrink-0" 
                        :class="{ 'rotate-90': expandedTrackId === track.id }" 
                      />
                      <span class="text-gray-300 text-sm">
                        TR#{{ track.trackMeta?.trCount || '?' }} - {{ track.trackMeta?.name || 'Unnamed' }}
                      </span>
                    </div>
                    <button
                      @click.stop="unhideTrack(track.id)"
                      class="p-1.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-900/20 rounded transition-colors"
                      title="Unhide"
                    >
                      <IconEye size="15" />
                    </button>
                  </div>

                  <!-- Expanded Detail View -->
                  <div v-if="expandedTrackId === track.id" class="mt-2 p-2 bg-gray-800/50 rounded-lg border border-gray-600/50" @click.stop>
                    <div v-if="track.entries && track.entries.length > 0" class="space-y-1">
                      <div class="text-xs text-gray-400 font-medium mb-1">Latest Values:</div>
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-1">
                        <div 
                          v-for="(value, key) in getLatestValues(track)" 
                          :key="key"
                          class="flex justify-between text-xs rounded px-2 py-1 border-l-2"
                          :style="{ borderLeftColor: getResourceColor(key), backgroundColor: getResourceColor(key) + '15' }"
                        >
                          <span class="truncate mr-2" :style="{ color: getResourceColor(key) }">{{ getResourceName(key) }}</span>
                          <span class="text-white font-mono">{{ formatValue(key, value) }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-xs text-gray-500 text-center py-2">No entry data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  IconUsersGroup, IconX, IconRefresh, IconEye, IconEyeOff, IconDownload, IconChevronRight
} from '@tabler/icons-vue';
import { useFriendsStore } from '@/store/friendsStore';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { formatSuffixInput } from '@/composables/format.js';
import { generateId } from '@/utils/base58';
import Decimal from 'break_infinity.js';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close', 'import']);

const friendsStore = useFriendsStore();
const trTrackingStore = useTRTrackingStore();

const isRefreshing = ref(false);
const expandedTrackId = ref(null);
const activeTab = ref('visible');

// Hidden track IDs from store (persisted + included in backups)
const hiddenTrackIds = computed(() => new Set(friendsStore.hiddenFriendTrackIds));

// Computed
const friendsTracks = computed(() => friendsStore.friendsTracks || []);

const visibleTracks = computed(() => friendsTracks.value.filter(t => !hiddenTrackIds.value.has(t.id)));
const hiddenTracksList = computed(() => friendsTracks.value.filter(t => hiddenTrackIds.value.has(t.id)));

function groupByFriend(tracks) {
  const groups = {};
  tracks.forEach(track => {
    const uid = track.ownerId;
    if (!groups[uid]) {
      // Prefer profile displayName from friends list (current nickname) over ownerName (snapshot from share time)
      const friend = friendsStore.friends.find(f => f.uid === uid);
      const name = friend?.profile?.displayName || track.ownerName || 'Unknown';
      groups[uid] = { uid, name, tracks: [] };
    }
    groups[uid].tracks.push(track);
  });
  Object.values(groups).forEach(group => {
    group.tracks.sort((a, b) => (b.trackMeta?.trCount || 0) - (a.trackMeta?.trCount || 0));
  });
  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
}

const groupedVisibleTracks = computed(() => groupByFriend(visibleTracks.value));
const groupedHiddenTracks = computed(() => groupByFriend(hiddenTracksList.value));

// Hide / Unhide
function hideTrack(trackId) {
  friendsStore.hideFriendTrack(trackId);
  if (expandedTrackId.value === trackId) expandedTrackId.value = null;
}

function unhideTrack(trackId) {
  friendsStore.unhideFriendTrack(trackId);
}

function unhideAll() {
  friendsStore.unhideAllFriendTracks();
}

// Expand / Collapse
function toggleExpand(track) {
  expandedTrackId.value = expandedTrackId.value === track.id ? null : track.id;
}

// Methods
async function refreshTracks() {
  isRefreshing.value = true;
  try {
    await friendsStore.loadFriendsTracks();
  } catch (err) {
    console.error('Failed to refresh friends tracks:', err);
  } finally {
    isRefreshing.value = false;
  }
}

function importTrack(track) {
  // Convert shared track format back to local track format
  const localTrack = {
    name: `${track.ownerName}'s ${track.trackMeta?.name || 'Track'}`,
    trCount: track.trackMeta?.trCount || 1,
    startDate: track.trackMeta?.startDate || new Date().toISOString().split('T')[0],
    endDate: track.trackMeta?.endDate || null,
    isActive: false, // imported tracks are always completed
    notes: `Imported from ${track.ownerName}'s shared tracks`,
    initialValues: track.initialValues || {},
    targetGoals: track.targetGoals || {},
    resourceOrder: track.resourceOrder || [],
    entries: (track.entries || []).map(e => ({
      id: generateId(),
      date: e.date,
      values: e.values || {},
      notes: e.notes || '',
      createdAt: new Date().toISOString()
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  emit('import', localTrack);
}

function getLatestValues(track) {
  if (!track.entries || track.entries.length === 0) return {};
  
  // Sort entries by date desc and get the latest
  const sorted = [...track.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latest = sorted[0];
  
  if (!latest.values) return {};
  
  // Filter out empty/zero values and notes
  const filtered = {};
  Object.entries(latest.values).forEach(([key, value]) => {
    if (key === 'notes' || value === '' || value === null || value === undefined) return;
    if (value === 0 || value === '0' || value === '0:00') return;
    filtered[key] = value;
  });
  
  return filtered;
}

function getResourceName(resourceId) {
  const resource = trTrackingStore.availableResources.find(r => r.id === resourceId);
  if (resource) return resource.name;
  // Fallback: prettify ID
  return resourceId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getResourceColor(resourceId) {
  const resource = trTrackingStore.availableResources.find(r => r.id === resourceId);
  return resource?.color || '#9ca3af';
}

function formatValue(resourceId, value) {
  if (typeof value === 'string' && value.includes(':')) return value; // time
  if (typeof value === 'string' && value.match(/^C\d/i)) return value; // camp
  
  const resource = trTrackingStore.availableResources.find(r => r.id === resourceId);
  
  // Handle attgn3-buff with Decimal for values > 1e308
  if (resourceId === 'attgn3-buff') {
    try {
      const decimal = new Decimal(value);
      if (decimal.gte('1e15')) {
        return decimal.toExponential(2).replace('e+', 'e');
      }
      return formatSuffixInput(decimal.toNumber());
    } catch {
      return String(value);
    }
  }
  
  const num = parseFloat(value);
  if (!isFinite(num)) return String(value);
  
  if ((resource && resource.dataType === 'suffix') || resourceId === 'oo-accum') {
    return formatSuffixInput(num);
  }
  
  return num.toLocaleString('en-US');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatRelative(timestamp) {
  if (!timestamp) return '';
  // Handle Firestore timestamp
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date.toISOString());
}

// Refresh when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    expandedTrackId.value = null;
    activeTab.value = 'visible';
    if (friendsStore.friendCount > 0) {
      refreshTracks();
    }
  }
});
</script>

<style scoped>
.mobile-modal-container {
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .mobile-modal-container {
    padding-bottom: var(--mobile-safe-bottom, 70px);
    padding-top: 60px;
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
