<template>
  <div 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="saveAndClose"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600">
        <!-- Erste Zeile: Titel und Action Buttons -->
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-bold text-white flex items-center">
            <IconScript size="18" class="mr-2 text-red-400" />
            Owned Inscryptions
          </h2>
          <div class="flex items-center gap-2">
            <!-- Hide Owned Toggle - Desktop -->
            <div class="hidden sm:flex items-center gap-2 bg-gray-800/50 rounded-lg border border-gray-700/50 p-2">
              <span class="text-xs text-gray-400">Hide Owned</span>
              <button
                @click="toggleHideOwned"
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                :class="store.settings.hideOwned ? 'bg-red-600' : 'bg-gray-600'"
              >
                <span
                  class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform"
                  :class="store.settings.hideOwned ? 'translate-x-5' : 'translate-x-1'"
                />
              </button>
            </div>
            
            <button 
              @click="saveAndClose"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
        
        <!-- Zweite Zeile: Hide Owned Toggle Mobile + Bulk Actions -->
        <div class="space-y-2">
          <!-- Hide Owned Toggle - Mobile -->
          <div class="block sm:hidden">
            <div class="flex items-center gap-2 bg-gray-800/50 rounded-lg border border-gray-700/50 p-2">
              <span class="text-xs text-gray-400">Hide Owned</span>
              <button
                @click="toggleHideOwned"
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                :class="store.settings.hideOwned ? 'bg-red-600' : 'bg-gray-600'"
              >
                <span
                  class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform"
                  :class="store.settings.hideOwned ? 'translate-x-5' : 'translate-x-1'"
                />
              </button>
            </div>
          </div>
          
          <!-- Bulk Action Buttons -->
          <div class="flex flex-wrap gap-2 text-xs">
            <button 
              @click="ownAllInscryptions"
              class="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-white transition-colors"
            >
              Own All
            </button>
            <button 
              @click="ownNoneInscryptions"
              class="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
            >
              Own None
            </button>
            <button 
              @click="showBulkModal = true"
              class="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
            >
              Own First X
            </button>
            <span class="text-gray-400 text-xs self-center">
              {{ getTotalOwnedCount() }} / {{ getTotalInscryptionsCount() }} owned
            </span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 sm:p-4 max-h-[75vh] overflow-y-auto">
        <p class="text-sm text-gray-300 mb-4">
          Mark inscryptions you already own. Owned inscryptions will be hidden from the main list.
        </p>

        <!-- Inscryptions List -->
        <div class="space-y-2">
          <div 
            v-for="baseInscryption in filteredInscryptions" 
            :key="baseInscryption.inscryptionId"
            class="bg-gray-700/30 rounded-lg border border-gray-700/50"
          >
            <!-- Main Inscryption Row -->
            <div class="p-3 flex items-center justify-between">
              <div class="flex items-center gap-3 flex-1">
                <!-- Toggle All Button -->
                <button
                  @click="toggleExpanded(baseInscryption.inscryptionId)"
                  class="p-1 hover:bg-gray-600 rounded transition-colors"
                >
                  <IconChevronDown 
                    v-if="expandedGroups.has(baseInscryption.inscryptionId)"
                    size="16" 
                    class="text-gray-400" 
                  />
                  <IconChevronRight 
                    v-else
                    size="16" 
                    class="text-gray-400" 
                  />
                </button>

                <!-- Inscryption Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-mono bg-red-900/50 px-1.5 py-0.5 rounded text-red-300">
                      i{{ baseInscryption.inscryptionId }}
                    </span>
                    <span class="text-sm font-medium text-white truncate">
                      {{ baseInscryption.description }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-400">
                    {{ baseInscryption.maxRanks }} rank{{ baseInscryption.maxRanks !== 1 ? 's' : '' }} available
                    <span v-if="getOwnedRanksCount(baseInscryption.inscryptionId) > 0" class="text-green-400 ml-2">
                      ({{ getOwnedRanksCount(baseInscryption.inscryptionId) }} owned)
                    </span>
                  </div>
                </div>

                <!-- Own All Toggle -->
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">Own All</span>
                  <button
                    @click="toggleOwnAll(baseInscryption.inscryptionId, baseInscryption.maxRanks)"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                    :class="getOwnAllStatus(baseInscryption.inscryptionId, baseInscryption.maxRanks) ? 'bg-red-600' : 'bg-gray-600'"
                  >
                    <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                      :class="getOwnAllStatus(baseInscryption.inscryptionId, baseInscryption.maxRanks) ? 'translate-x-6' : 'translate-x-1'"
                    />
                  </button>
                </div>
              </div>
            </div>

            <!-- Expanded Ranks -->
            <div 
              v-if="expandedGroups.has(baseInscryption.inscryptionId)" 
              class="border-t border-gray-600/50 bg-gray-800/30"
            >
              <div class="p-3 space-y-2">
                <div 
                  v-for="rank in getRanksForInscryption(baseInscryption)" 
                  :key="`${baseInscryption.inscryptionId}-${rank}`"
                  class="flex items-center justify-between py-2 px-3 bg-gray-700/30 rounded-lg"
                >
                  <div class="flex items-center gap-3 flex-1">
                    <span class="text-xs bg-red-900/50 px-1.5 py-0.5 rounded text-red-300 font-mono">
                      R{{ rank }}
                    </span>
                    <div class="flex-1">
                      <div class="text-sm text-white">
                        {{ baseInscryption.description }} - Rank {{ rank }}
                      </div>
                      <div class="text-xs text-gray-400">
                        Cost: {{ formatCostForRank(baseInscryption, rank) }}
                      </div>
                      <div class="text-xs text-green-400">
                        Buff: {{ baseInscryption.buffPerRank }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-400">Owned</span>
                    <button
                      @click="toggleRankOwnership(baseInscryption.inscryptionId, rank, baseInscryption.maxRanks)"
                      class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
                      :class="isRankOwned(baseInscryption.inscryptionId, rank) ? 'bg-red-600' : 'bg-gray-600'"
                    >
                      <span
                        class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform"
                        :class="isRankOwned(baseInscryption.inscryptionId, rank) ? 'translate-x-5' : 'translate-x-1'"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Modal für "Own First X" -->
    <div 
      v-if="showBulkModal" 
      class="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/90"
      @click.self="showBulkModal = false"
    >
      <div class="bg-gray-800 rounded-lg p-4 border border-gray-700 w-80">
        <h3 class="text-white font-semibold mb-3">Own First X Inscryptions</h3>
        <p class="text-gray-300 text-sm mb-3">
          Mark the first X inscryptions (by ID) as owned.
        </p>
        
        <div class="mb-4">
          <label class="block text-gray-400 text-xs mb-2">Number of Inscryptions to own:</label>
          <ToolValueControls
            :value="bulkOwnCount"
            :minValue="0"
            :maxValue="getTotalInscryptionsCount()"
            :step="1"
            @update:value="bulkOwnCount = $event"
          />
        </div>
        
        <div class="flex justify-end gap-2">
          <button 
            @click="showBulkModal = false"
            class="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="ownFirstXInscryptions"
            class="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  IconScript,
  IconX,
  IconChevronDown,
  IconChevronRight
} from '@tabler/icons-vue';
import { formatNumber } from '@/composables/format.js';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { useInscryptionPlannerStore } from '@/store/inscryptionPlannerStore';

const emit = defineEmits(['close']);

// Store
const store = useInscryptionPlannerStore();

// Local state
const expandedGroups = ref(new Set());
const localOwnership = ref({});
const showBulkModal = ref(false);
const bulkOwnCount = ref(50);

// Filtered inscryptions based on Hide Owned toggle (only Rank 1 inscryptions from store)
const filteredInscryptions = computed(() => {
  let inscryptions = [...store.inscryptionsData];
  
  if (store.settings.hideOwned) {
    // Filter out inscryptions where all ranks are owned
    inscryptions = inscryptions.filter(inscryption => {
      const ownedRanks = getOwnedRanksCount(inscryption.inscryptionId);
      return ownedRanks < inscryption.maxRanks; // Show if not all ranks are owned
    });
  }
  
  return inscryptions.sort((a, b) => a.inscryptionId - b.inscryptionId);
});

// Helper functions
function getRanksForInscryption(baseInscryption) {
  // Generate array of ranks from 1 to maxRanks
  return Array.from({ length: baseInscryption.maxRanks }, (_, i) => i + 1);
}

function formatCostForRank(baseInscryption, rank) {
  // Calculate cost for specific rank using the same logic as store
  let cost = baseInscryption.costSci;
  
  if (baseInscryption.costScaling === 'x2') {
    cost = baseInscryption.costSci * Math.pow(2, rank - 1);
  } else if (baseInscryption.costScaling === '+1') {
    cost = baseInscryption.costSci + (rank - 1);
  }
  
  return formatNumber(cost);
}

function toggleExpanded(inscryptionId) {
  if (expandedGroups.value.has(inscryptionId)) {
    expandedGroups.value.delete(inscryptionId);
  } else {
    expandedGroups.value.add(inscryptionId);
  }
}

function isRankOwned(inscryptionId, rank) {
  return localOwnership.value[inscryptionId]?.includes(rank) || false;
}

function getOwnedRanksCount(inscryptionId) {
  return localOwnership.value[inscryptionId]?.length || 0;
}

function getOwnAllStatus(inscryptionId, maxRanks) {
  const ownedRanks = getOwnedRanksCount(inscryptionId);
  return ownedRanks === maxRanks;
}

function toggleOwnAll(inscryptionId, maxRanks) {
  const isCurrentlyOwnedAll = getOwnAllStatus(inscryptionId, maxRanks);
  
  if (isCurrentlyOwnedAll) {
    // Remove all ownership
    localOwnership.value[inscryptionId] = [];
  } else {
    // Add all ranks
    localOwnership.value[inscryptionId] = Array.from({ length: maxRanks }, (_, i) => i + 1);
  }
}

function toggleRankOwnership(inscryptionId, targetRank, maxRanks) {
  if (!localOwnership.value[inscryptionId]) {
    localOwnership.value[inscryptionId] = [];
  }
  
  const currentlyOwned = localOwnership.value[inscryptionId];
  const isOwned = currentlyOwned.includes(targetRank);
  
  if (isOwned) {
    // Remove this rank and all higher ranks
    localOwnership.value[inscryptionId] = currentlyOwned.filter(rank => rank < targetRank);
  } else {
    // Add this rank and all lower ranks (if not already present)
    const ranksToAdd = [];
    for (let rank = 1; rank <= targetRank; rank++) {
      if (!currentlyOwned.includes(rank)) {
        ranksToAdd.push(rank);
      }
    }
    
    localOwnership.value[inscryptionId] = [...currentlyOwned, ...ranksToAdd].sort((a, b) => a - b);
  }
}

// Hide Owned Toggle
function toggleHideOwned() {
  store.settings.hideOwned = !store.settings.hideOwned;
}

// Bulk Actions
function ownAllInscryptions() {
  store.inscryptionsData.forEach(inscryption => {
    localOwnership.value[inscryption.inscryptionId] = Array.from({ length: inscryption.maxRanks }, (_, i) => i + 1);
  });
}

function ownNoneInscryptions() {
  if (confirm('This will clear ALL owned inscryptions. Continue?')) {
    localOwnership.value = {};
  }
}

function ownFirstXInscryptions() {
  if (!bulkOwnCount.value || bulkOwnCount.value < 0) {
    alert('Please enter a valid number.');
    return;
  }

  // Sort inscryptions by ID and take the first X
  const sortedInscryptions = [...store.inscryptionsData].sort((a, b) => a.inscryptionId - b.inscryptionId);
  const inscryptionsToOwn = sortedInscryptions.slice(0, bulkOwnCount.value);
  
  // Mark these inscryptions as fully owned
  inscryptionsToOwn.forEach(inscryption => {
    localOwnership.value[inscryption.inscryptionId] = Array.from({ length: inscryption.maxRanks }, (_, i) => i + 1);
  });
  
  showBulkModal.value = false;
}

// Statistics
function getTotalOwnedCount() {
  let count = 0;
  Object.values(localOwnership.value).forEach(ranks => {
    count += ranks.length;
  });
  return count;
}

function getTotalInscryptionsCount() {
  let count = 0;
  store.inscryptionsData.forEach(inscryption => {
    count += inscryption.maxRanks;
  });
  return count;
}

function saveAndClose() {
  store.updateOwnedInscryptions(localOwnership.value);
  emit('close');
}

// Initialize local ownership when modal opens
onMounted(() => {
  localOwnership.value = { ...store.ownedInscryptions };
});

// Handle ESC key
function handleKeydown(event) {
  if (event.key === 'Escape') {
    saveAndClose();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
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
