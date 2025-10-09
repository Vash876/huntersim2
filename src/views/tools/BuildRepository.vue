<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <div class="bg-gradient-to-r from-purple-900 to-blue-800 p-4 sm:p-5 border-b border-gray-600">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center mb-1">
              <IconDatabase size="24" class="mr-2 text-purple-400" />
              <h1 class="text-2xl font-bold">Build Repository</h1>
            </div>
            <p class="text-sm text-purple-200">Community-curated optimal builds for every level</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row sm:flex-wrap justify-end gap-3">
            <!-- Refresh Button -->
            <button
              @click="refreshData"
              :disabled="isLoading"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm disabled:opacity-50"
            >
              <IconRefresh size="18" :class="{ 'animate-spin': isLoading }" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hunter Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-700">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="hunter in availableHunters"
            :key="hunter.id"
            @click="setActiveHunter(hunter.id)"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center transition-colors',
              activeHunterId === hunter.id
                ? `border-${hunter.color}-500 text-${hunter.color}-400`
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300'
            ]"
          >
            <img :src="hunter.image" :alt="hunter.name" class="w-5 h-5 mr-2" />
            {{ hunter.name }}
            <span v-if="buildCounts[hunter.id]" class="ml-2 bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full text-xs">
              {{ buildCounts[hunter.id] }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Filter Section -->
    <div v-if="!isLoading" class="mb-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Level Range Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Level Range</label>
          <div class="flex items-center space-x-2">
            <input
              v-model.number="levelFilter.min"
              type="number"
              min="1"
              max="100"
              class="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
              placeholder="Min"
            />
            <span class="text-gray-400">-</span>
            <input
              v-model.number="levelFilter.max"
              type="number"
              min="1"
              max="100"
              class="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
              placeholder="Max"
            />
          </div>
        </div>

        <!-- Sort By -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
          >
            <option value="level">Level</option>
            <option value="lootScore">Loot Score</option>
            <option value="stage">Average Stage</option>
            <option value="efficiency">Efficiency</option>
          </select>
        </div>

        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <div class="relative">
            <IconSearch size="16" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search notes, level..."
              class="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-4"></div>
      <p class="text-gray-400 text-sm">Loading build repository...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
      <IconAlertCircle size="48" class="text-red-500 mb-4" />
      <p class="text-red-400 mb-4 text-center">{{ error }}</p>
      <button 
        @click="refreshData" 
        class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Build Grid -->
    <div v-else-if="filteredBuilds.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <BuildCard
        v-for="build in filteredBuilds"
        :key="build.id"
        :build="build"
        @import="importBuild"
        @view-details="viewBuildDetails"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <IconDatabase size="48" class="mx-auto mb-4 text-gray-500" />
      <h3 class="text-xl font-semibold mb-2 text-gray-300">No builds found</h3>
      <p class="text-gray-500">Try adjusting your filters or check back later.</p>
    </div>

    <!-- Build Details Modal -->
    <BuildDetailsModal
      :is-visible="showBuildDetails"
      :build="selectedBuild"
      @close="closeBuildDetails"
      @import="importBuild"
    />

    <!-- Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white flex items-center z-50"
        :class="{ 
          'bg-green-600': toast.type === 'success',
          'bg-red-600': toast.type === 'error',
          'bg-blue-600': toast.type === 'info'
        }"
      >
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  IconDatabase,
  IconRefresh,
  IconSearch,
  IconAlertCircle
} from '@tabler/icons-vue';
import { HUNTERS, getHunterById } from '@/constants/hunters';
import { useBuildRepository } from '@/composables/useBuildRepository';
import BuildCard from '@/components/common/build-repository/BuildCard.vue';
import BuildDetailsModal from '@/components/common/build-repository/BuildDetailsModal.vue';

// Composables
const { fetchBuildData } = useBuildRepository();

// State
const isLoading = ref(false);
const error = ref(null);
const builds = ref([]);
const activeHunterId = ref('borge');
const selectedBuild = ref(null);
const showBuildDetails = ref(false);

// Filters
const levelFilter = ref({ min: 1, max: 100 });
const sortBy = ref('level');
const searchQuery = ref('');

// Toast
const toast = ref({ show: false, message: '', type: 'info' });

// Available hunters (all hunters for now)
const availableHunters = computed(() => HUNTERS);

// Build counts per hunter
const buildCounts = computed(() => {
  const counts = {};
  HUNTERS.forEach(hunter => {
    counts[hunter.id] = builds.value.filter(build => build.hunterId === hunter.id).length;
  });
  return counts;
});

// Current hunter builds
const currentHunterBuilds = computed(() => {
  return builds.value.filter(build => build.hunterId === activeHunterId.value);
});

// Filtered and sorted builds
const filteredBuilds = computed(() => {
  let filtered = currentHunterBuilds.value;
  
  // Level filter
  filtered = filtered.filter(build => 
    build.level >= levelFilter.value.min && build.level <= levelFilter.value.max
  );
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(build => 
      build.level.toString().includes(query) ||
      build.notes.toLowerCase().includes(query) ||
      build.lootScore.toString().includes(query)
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'level':
        return a.level - b.level;
      case 'lootScore':
        return b.lootScore - a.lootScore;
      case 'stage':
        return b.stage.avg - a.stage.avg;
      case 'efficiency':
        return (b.lootScore / b.time.minutes) - (a.lootScore / a.time.minutes);
      default:
        return a.level - b.level;
    }
  });
  
  return filtered;
});

// Methods
function setActiveHunter(hunterId) {
  activeHunterId.value = hunterId;
}

async function loadBuildsForHunter(hunterId) {
  try {
    const hunterBuilds = await fetchBuildData(hunterId);
    
    // Remove existing builds for this hunter and add new ones
    builds.value = builds.value.filter(build => build.hunterId !== hunterId);
    builds.value.push(...hunterBuilds);
    
    console.log(`Loaded ${hunterBuilds.length} builds for ${hunterId}`);
  } catch (err) {
    console.error(`Failed to load builds for ${hunterId}:`, err);
    throw err;
  }
}

async function refreshData() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Load builds for all hunters
    await Promise.all(
      HUNTERS.map(hunter => loadBuildsForHunter(hunter.id))
    );
    
    showToastMessage('Build repository updated successfully', 'success');
  } catch (err) {
    error.value = `Failed to load build repository: ${err.message}`;
    console.error('Error refreshing data:', err);
  } finally {
    isLoading.value = false;
  }
}

function importBuild(build) {
  // TODO: Implement build import functionality
  console.log('Importing build:', build);
  showToastMessage(`Build for level ${build.level} imported!`, 'success');
}

function viewBuildDetails(build) {
  selectedBuild.value = build;
  showBuildDetails.value = true;
}

function closeBuildDetails() {
  showBuildDetails.value = false;
  selectedBuild.value = null;
}

function showToastMessage(message, type = 'info', duration = 3000) {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Watch active hunter changes to ensure data is loaded
watch(activeHunterId, async (newHunterId) => {
  const hunterBuilds = builds.value.filter(build => build.hunterId === newHunterId);
  if (hunterBuilds.length === 0 && !isLoading.value) {
    // Load builds for this hunter if not already loaded
    try {
      await loadBuildsForHunter(newHunterId);
    } catch (err) {
      console.error(`Failed to load builds for ${newHunterId}:`, err);
    }
  }
});

// Initialize
onMounted(async () => {
  await refreshData();
});
</script>

<style scoped>
/* Toast animation */
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Tab colors */
.border-red-500 { border-color: rgb(239 68 68); }
.text-red-400 { color: rgb(248 113 113); }
.border-green-500 { border-color: rgb(34 197 94); }
.text-green-400 { color: rgb(74 222 128); }
.border-blue-500 { border-color: rgb(59 130 246); }
.text-blue-400 { color: rgb(96 165 250); }
</style>