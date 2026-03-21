<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header with close button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconDownload size="20" class="mr-2 text-purple-400" />
          Import TR Track
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Tabs (only shown when authenticated) -->
      <div v-if="isAuthenticated" class="flex border-b border-gray-700 bg-gray-800/50">
        <button
          @click="activeTab = 'code'"
          :class="['flex-1 py-2.5 text-sm font-medium transition-colors', activeTab === 'code' ? 'text-purple-400 border-b-2 border-purple-500 bg-gray-800/40' : 'text-gray-400 hover:text-gray-300']"
        >From Code</button>
        <button
          @click="activeTab = 'cloud'"
          :class="['flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5', activeTab === 'cloud' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/40' : 'text-gray-400 hover:text-gray-300']"
        >
          <IconCloudDown size="14" />
          Cloud Recovery
        </button>
      </div>

      <!-- From Code Tab -->
      <div v-if="activeTab === 'code'" class="p-5">
        <p class="text-sm text-gray-300 mb-4">
          Paste a TR track code below to import a tracking plan:
        </p>
        
        <!-- Code input field with immediate validation -->
        <div class="mb-4">
          <textarea
            v-model="importCode"
            placeholder="Paste TR track code here..."
            class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm h-24 focus:outline-none"
            :class="{
              'focus:border-purple-500 focus:ring-1 focus:ring-purple-500': !errorMessage,
              'border-red-500 focus:border-red-500': errorMessage
            }"
            @input="validateTrackCode"
          ></textarea>
        </div>
        
        <!-- Error display (if any) -->
        <div 
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-sm text-red-200"
        >
          <div class="flex items-center">
            <IconAlertTriangle class="mr-2 flex-shrink-0" size="16" />
            <span>{{ errorMessage }}</span>
          </div>
        </div>
        
        <!-- Track preview (if validated) -->
        <div 
          v-if="validatedTrack" 
          class="mb-4 p-3 border border-green-500 bg-green-900/20 rounded-md transition-all duration-300"
        >
          <div class="flex items-center">
            <div class="mr-3 rounded-full p-2 bg-green-900/40">
              <IconChartLine size="24" class="text-green-400" />
            </div>
            
            <div>
              <div class="font-medium text-white">{{ validatedTrack.name }}</div>
              <div class="text-xs text-gray-400">
                TR Count: {{ validatedTrack.trCount }} | 
                Started: {{ formatDate(validatedTrack.startDate) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Import button -->
        <div class="flex flex-col gap-2 mt-6">
          <button 
            @click="importTrack"
            :disabled="!validatedTrack"
            class="w-full px-4 py-2.5 rounded-md transition-colors flex items-center justify-center"
            :class="[
              validatedTrack ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed opacity-50'
            ]"
          >
            <IconDownload class="mr-2" size="20" />
            <span>Import Track Plan</span>
          </button>
          <div class="text-xs text-gray-400 pl-1">Imports the complete tracking plan with all data entries</div>
        </div>
      </div>

      <!-- Cloud Recovery Tab -->
      <div v-if="activeTab === 'cloud'" class="p-5">
        <p class="text-sm text-gray-300 mb-1">
          Recover TR tracks you previously shared to the cloud.
        </p>
        <p class="text-xs text-gray-500 mb-4">This searches for tracks owned by your account.</p>

        <!-- Search button -->
        <div v-if="!cloudTracks.length && !isSearching && !cloudSearchDone" class="flex justify-center">
          <button
            @click="searchCloudTracks"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
          >
            <IconCloudDown size="16" />
            Search my shared tracks
          </button>
        </div>

        <!-- Loading -->
        <div v-if="isSearching" class="flex items-center justify-center py-8 text-gray-400 text-sm gap-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
          Searching...
        </div>

        <!-- Error -->
        <div v-if="cloudError" class="mb-4 p-3 bg-red-900/40 border border-red-500/60 rounded-lg text-sm text-red-300 flex items-center gap-2">
          <IconAlertTriangle size="15" class="flex-shrink-0" />
          {{ cloudError }}
        </div>

        <!-- Empty after search -->
        <div v-if="cloudSearchDone && !isSearching && !cloudTracks.length && !cloudError" class="text-center py-8 text-gray-400 text-sm">
          <IconCloudDown size="40" class="mx-auto mb-2 opacity-30" />
          No shared tracks found for your account.
        </div>

        <!-- Track list -->
        <div v-if="cloudTracks.length" class="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
          <div
            v-for="ct in cloudTracks"
            :key="ct.sharedTrackId"
            @click="!ct.alreadyExists && toggleCloudSelection(ct.sharedTrackId)"
            :class="[
              'flex items-center gap-3 p-3 rounded-lg border transition-all',
              ct.alreadyExists
                ? 'border-gray-700 bg-gray-800/30 opacity-50 cursor-not-allowed'
                : selectedCloudIds.has(ct.sharedTrackId)
                  ? 'border-indigo-500 bg-indigo-900/30 cursor-pointer'
                  : 'border-gray-600 bg-gray-700/30 hover:border-gray-500 cursor-pointer'
            ]"
          >
            <div :class="['w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors', ct.alreadyExists ? 'border-gray-600 bg-gray-700' : selectedCloudIds.has(ct.sharedTrackId) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500']">
              <IconCheck v-if="ct.alreadyExists" size="10" class="text-gray-500" />
              <IconCheck v-else-if="selectedCloudIds.has(ct.sharedTrackId)" size="10" class="text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-white truncate flex items-center gap-2">
                {{ ct.name }}
                <span v-if="ct.alreadyExists" class="text-[10px] text-yellow-400 bg-yellow-900/40 px-1.5 py-0.5 rounded border border-yellow-700/50">already local</span>
              </div>
              <div class="text-xs text-gray-400">
                TR #{{ ct.trCount || '?' }} &bull;
                {{ ct.isActive ? 'Active' : 'Ended' }} &bull;
                {{ ct.entryCount }} entries
                <span v-if="ct.startDate" class="ml-1">· started {{ formatDate(ct.startDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Restore button -->
        <div v-if="cloudTracks.length" class="flex items-center justify-between gap-3 mt-4">
          <button
            @click="searchCloudTracks"
            :disabled="isSearching"
            class="text-xs text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
          >Refresh</button>
          <button
            @click="restoreSelected"
            :disabled="selectedCloudIds.size === 0"
            :class="['flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-colors', selectedCloudIds.size > 0 ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50']"
          >
            <IconCloudDown size="15" />
            Restore {{ selectedCloudIds.size > 0 ? selectedCloudIds.size : '' }} selected
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconDownload, IconX, IconAlertTriangle, IconChartLine, IconCloudDown, IconCheck } from '@tabler/icons-vue';
import { decompressTrack } from '@/utils/trackCompression';
import { neonAuthService } from '@/services/neonAuthService';
import { getSharedTracksByUser } from '@/services/friendsService';
import { useTRTrackingStore } from '@/store/trTrackingStore';

// Props
const props = defineProps({
  show: Boolean
});

// Emits
const emit = defineEmits(['close', 'import', 'restore']);

const trTrackingStore = useTRTrackingStore();

// ── Tab state ────────────────────────────────────────────
const activeTab = ref('code');
const isAuthenticated = computed(() => neonAuthService.isAuthenticated.value);

// ── From Code state ──────────────────────────────────────
// Refs
const importCode = ref('');
const errorMessage = ref('');
const validatedTrack = ref(null);
const isValidating = ref(false);

// ── Cloud Recovery state ─────────────────────────────────
const cloudTracks = ref([]);
const isSearching = ref(false);
const cloudSearchDone = ref(false);
const cloudError = ref('');
const selectedCloudIds = ref(new Set());

// Methods
const validateTrackCode = async () => {
  // Reset previous validation
  errorMessage.value = '';
  
  const code = typeof importCode.value === 'string' ? importCode.value.trim() : '';
  
  // Skip validation if empty
  if (!code) {
    validatedTrack.value = null;
    return;
  }
  
  // Prevent multiple simultaneous validations
  if (isValidating.value) return;
  
  isValidating.value = true;
  
  try {
    const track = decompressTrack(code);
    
    if (!track) {
      errorMessage.value = 'Invalid track code. Missing required fields.';
      validatedTrack.value = null;
    } else {
      // Valid track found
      validatedTrack.value = track;
      errorMessage.value = '';
    }
  } catch (error) {
    console.error('TRACK CODE VALIDATION ERROR:', error);
    errorMessage.value = 'Invalid track code. Please check the code and try again.';
    validatedTrack.value = null;
  } finally {
    isValidating.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Import track
const importTrack = () => {
  if (!validatedTrack.value) {
    errorMessage.value = 'Please enter a valid track code first.';
    return;
  }
  
  // Generate a new ID for the imported track
  const trackToImport = {
    ...validatedTrack.value,
    id: Date.now().toString(), // Generate new ID
    // Keep all existing entries from the shared track
    entries: validatedTrack.value.entries || [],
    // Set as active by default
    isActive: validatedTrack.value.isActive !== undefined ? validatedTrack.value.isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Pass the track to the parent component
  emit('import', trackToImport);
  
  // Close modal and reset form
  emit('close');
  resetForm();
};

// Reset form
const resetForm = () => {
  importCode.value = '';
  errorMessage.value = '';
  validatedTrack.value = null;
  // Cloud state
  cloudTracks.value = [];
  cloudSearchDone.value = false;
  cloudError.value = '';
  selectedCloudIds.value = new Set();
  activeTab.value = 'code';
};

// ── Cloud Recovery ────────────────────────────────────────

async function searchCloudTracks() {
  const userId = neonAuthService.getUserId();
  if (!userId) return;
  isSearching.value = true;
  cloudError.value = '';
  cloudTracks.value = [];
  selectedCloudIds.value = new Set();
  try {
    const results = await getSharedTracksByUser(userId);
    const existingIds = new Set(trTrackingStore.trTracks.map(t => t.id));
    cloudTracks.value = results.map(doc => {
      const originalLocalId = doc.id.replace(userId + '_', '');
      return {
        sharedTrackId: doc.id,
        originalLocalId,
        name: doc.trackMeta?.name || 'Unknown',
        trCount: doc.trackMeta?.trCount || 0,
        startDate: doc.trackMeta?.startDate || null,
        isActive: doc.trackMeta?.isActive || false,
        entryCount: (doc.entries || []).length,
        alreadyExists: existingIds.has(originalLocalId),
        // full data for restore
        _raw: doc,
      };
    }).sort((a, b) => {
      if (a.isActive !== b.isActive) return b.isActive - a.isActive;
      return (b.startDate || '').localeCompare(a.startDate || '');
    });
    cloudSearchDone.value = true;
  } catch (err) {
    console.error('Cloud recovery search failed:', err);
    cloudError.value = 'Failed to load tracks from cloud. Please try again.';
  } finally {
    isSearching.value = false;
  }
}

function toggleCloudSelection(sharedTrackId) {
  const next = new Set(selectedCloudIds.value);
  if (next.has(sharedTrackId)) {
    next.delete(sharedTrackId);
  } else {
    next.add(sharedTrackId);
  }
  selectedCloudIds.value = next;
}

function restoreSelected() {
  const userId = neonAuthService.getUserId();
  const toRestore = cloudTracks.value
    .filter(ct => selectedCloudIds.value.has(ct.sharedTrackId))
    .map(ct => {
      const doc = ct._raw;
      return {
        id: ct.originalLocalId,
        name: doc.trackMeta?.name || 'Unknown',
        trCount: doc.trackMeta?.trCount || 0,
        startDate: doc.trackMeta?.startDate || null,
        endDate: doc.trackMeta?.endDate || null,
        isActive: doc.trackMeta?.isActive !== undefined ? doc.trackMeta.isActive : true,
        entries: (doc.entries || []).map(e => ({ ...e, id: e.id || String(Date.now() + Math.random()) })),
        initialValues: doc.initialValues || {},
        targetGoals: doc.targetGoals || {},
        selectedResources: doc.selectedResources || [],
        resourceOrder: doc.resourceOrder || [],
        _sharedTrackId: ct.sharedTrackId,
        _restoredFromCloud: true,
      };
    });

  if (toRestore.length === 0) return;
  emit('restore', toRestore);
  emit('close');
  resetForm();
}

// Reset form when modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

// Initial validation if code is pre-filled
watch(() => importCode.value, (newVal) => {
  if (typeof newVal === 'string' && newVal.trim()) {
    validateTrackCode();
  } else {
    validatedTrack.value = null;
    errorMessage.value = '';
  }
}, { immediate: true });
</script>

<style scoped>
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
