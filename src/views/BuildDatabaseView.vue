<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-white">
        Hunter Build Database
      </h1>
      <p class="text-gray-300">
        Discover and share builds with the community
      </p>
    </div>

    <!-- Filter und Sortierung -->
    <div class="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700 flex flex-wrap md:flex-nowrap gap-4 items-center">
      <div class="w-full md:w-1/4">
        <label class="block text-sm text-gray-400 mb-1">Hunter Filter</label>
        <select 
          v-model="filters.hunterId"
          class="w-full bg-gray-700 text-white rounded border border-gray-600 p-2"
        >
          <option value="">All Hunters</option>
          <option v-for="hunter in hunters" :key="hunter.id" :value="hunter.id">
            {{ hunter.name }}
          </option>
        </select>
      </div>
      
      <div class="w-full md:w-1/4">
        <label class="block text-sm text-gray-400 mb-1">Sort by</label>
        <select 
          v-model="filters.sortBy"
          class="w-full bg-gray-700 text-white rounded border border-gray-600 p-2"
        >
          <option value="timestamp">Latest</option>
          <option value="likes">Popularity</option>
          <option value="avgStage">Highest Stage</option>
          <option value="lootPerMin">Best Loot/Min</option>
        </select>
      </div>
      
      <div class="w-full md:w-1/2">
        <label class="block text-sm text-gray-400 mb-1">Tags</label>
        <div class="flex flex-wrap gap-2">
          <div 
            v-for="tag in availableTags" 
            :key="tag"
            @click="toggleTag(tag)"
            class="px-2 py-1 rounded-full text-sm cursor-pointer transition-colors"
            :class="filters.tags.includes(tag) 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Builds Grid -->
    <div v-else-if="builds.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <BuildDatabaseCard 
        v-for="build in builds" 
        :key="build.id" 
        :build="build"
        @click="viewBuildDetails(build)"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12">
      <IconDatabaseOff size="48" class="text-gray-500 mb-4" />
      <p class="text-gray-400 text-lg">No builds found</p>
      <p class="text-gray-500">Try different filters or upload your first build</p>
    </div>
    
    <!-- Build Detail Modal -->
    <BuildDetailView 
      v-if="selectedBuild"
      :build="selectedBuild"
      :show="!!selectedBuild"
      @close="closeDetailView"
      @like="handleLike"
      @import="importBuild"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getBuilds, getBuildById, toggleLikeBuild } from '@/services/databaseService';
import { getAllHunters } from '@/constants/hunters';
import { useHunterStore } from '@/store/hunterStore';
import { IconDatabaseOff } from '@tabler/icons-vue';

// Komponenten
import BuildDatabaseCard from '@/components/database/BuildDatabaseCard.vue';
import BuildDetailView from '@/components/database/BuildDetailView.vue';

const router = useRouter();
const route = useRoute();
const hunterStore = useHunterStore();

// State
const builds = ref([]);
const isLoading = ref(true);
const selectedBuild = ref(null);
const hunters = getAllHunters();

const filters = ref({
  hunterId: '',
  sortBy: 'timestamp',
  sortDirection: 'desc',
  tags: []
});

const availableTags = [
  'Farming', 'Boss', 'PvE', 'Early Game', 'Mid Game', 'Late Game', 'Experimental'
];

// Lade Build Details von URL-Parameter
onMounted(async () => {
  const buildId = route.query.buildId;
  if (buildId) {
    try {
      const build = await getBuildById(buildId);
      if (build) {
        selectedBuild.value = build;
      }
    } catch (error) {
      console.error('Error loading build:', error);
    }
  }
  
  // Lade initial Builds
  loadBuilds();
});

// Filter-Änderungen überwachen
watch(filters, () => {
  loadBuilds();
}, { deep: true });

// Builds laden mit aktuellen Filtern
async function loadBuilds() {
  try {
    isLoading.value = true;
    builds.value = await getBuilds({
      hunterId: filters.value.hunterId || null,
      sortBy: filters.value.sortBy,
      sortDirection: filters.value.sortDirection,
      tags: filters.value.tags,
      limitCount: 50
    });
  } catch (error) {
    console.error('Error loading builds:', error);
    showToast('Error loading builds', 'error');
  } finally {
    isLoading.value = false;
  }
}

// Tag filtern
function toggleTag(tag) {
  if (filters.value.tags.includes(tag)) {
    filters.value.tags = filters.value.tags.filter(t => t !== tag);
  } else {
    filters.value.tags.push(tag);
  }
}

// Build-Detail anzeigen
function viewBuildDetails(build) {
  selectedBuild.value = build;
  
  // URL aktualisieren ohne Neuladen
  router.replace({ 
    query: { ...route.query, buildId: build.id } 
  });
}

// Detail-Ansicht schließen
function closeDetailView() {
  selectedBuild.value = null;
  
  // Build-ID aus URL entfernen
  const query = { ...route.query };
  delete query.buildId;
  router.replace({ query });
}

// Like-Funktion
async function handleLike(buildId) {
  try {
    const isLiked = await toggleLikeBuild(buildId);
    
    // Update lokalen State
    if (selectedBuild.value && selectedBuild.value.id === buildId) {
      selectedBuild.value.likes += isLiked ? 1 : -1;
      selectedBuild.value.isLikedByUser = isLiked;
    }
    
    // Update in der Liste
    const buildInList = builds.value.find(b => b.id === buildId);
    if (buildInList) {
      buildInList.likes += isLiked ? 1 : -1;
      buildInList.isLikedByUser = isLiked;
    }
    
    showToast(isLiked ? 'Build liked' : 'Like removed');
  } catch (error) {
    console.error('Error liking build:', error);
    showToast('Error liking build', 'error');
  }
}

// Build in eigene Builds importieren
function importBuild(build) {
  if (!build || !build.buildData) {
    showToast('Invalid build', 'error');
    return;
  }
  
  // Build importieren mit neuer ID
  const newBuild = {
    ...build.buildData,
    id: `import_${Date.now()}`,
    timestamp: Date.now(),
    name: `${build.name} (Import)`
  };
  
  hunterStore.addBuild(newBuild);
  showToast(`Build "${newBuild.name}" successfully imported`);
  
  // Optional: Zur Hunter-Seite navigieren
  router.push(`/${build.hunterId}`);
}

// Toast-Nachricht anzeigen
function showToast(message, type = 'success') {
  if (window.toast && typeof window.toast === 'function') {
    window.toast[type](message);
  } else {
    console.log(`Toast: ${type} - ${message}`);
  }
}
</script>