<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Top Section mit Header und Aktionsleiste -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <!-- Header mit Farb-Gradient -->
      <div class="bg-gradient-to-r from-purple-900 to-gray-800 p-5 border-b border-gray-600">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold mb-1">TR Planner</h1>
            <p class="text-sm text-gray-300">Plan and optimize your Traversal Resets</p>
          </div>
          
          <div class="flex">
            <button 
              @click="openStatsModal"
              class="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
            >
              <IconChartBar size="16" class="mr-2" />
              <span>Stats</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Settings Bar -->
      <div class="bg-gray-800 py-3 px-4 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400">Settings:</span>
          
          <!-- Campaign Fragments Toggle -->
          <button
            class="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
            @click="toggleCampaignFrags"
          >
            <IconStar size="16" :class="trPlannerStore.plannerConfig.calculateCampaignFrags ? 'text-yellow-400' : 'text-gray-400'" />
            <span>Campaign Frags</span>
          </button>
        </div>
        
        <!-- Reset Button -->
        <button 
          @click="resetPlanner"
          class="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
        >
          <IconRefresh size="16" class="text-blue-400" />
          <span>Reset Planner</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col md:flex-row items-start gap-6">
      <!-- Linke Seite: Einstellungen und TR-Konfiguration -->
      <div class="w-full md:w-1/3 space-y-6">
        <PlannerForm 
          :plannerConfig="trPlannerStore.plannerConfig"
          @update:config="updatePlannerConfig"
        />
        
        <div class="bg-gray-850 rounded-lg p-4 border border-gray-700">
          <h2 class="text-xl font-bold mb-4">Your Shorts</h2>
          <div v-if="trPlannerStore.shorts.length === 0" class="text-gray-500 italic">
            No shorts added yet. Configure your settings above and add your first short.
          </div>
          <div v-else class="space-y-4">
            <ShortEntryCard 
              v-for="(short, index) in trPlannerStore.shorts" 
              :key="`short-${short.id || index}`"
              :short="short"
              :index="index"
              @edit="editShort"
              @delete="deleteShort"
            />
          </div>
          <button 
            @click="addNewShort"
            class="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Add Another Short
          </button>
        </div>
      </div>
      
      <!-- Rechte Seite: Ergebnisse und Statistiken -->
      <div class="w-full md:w-2/3">
        <div class="bg-gray-850 rounded-lg p-4 border border-gray-700 mb-6">
          <h2 class="text-xl font-bold mb-4">Overview</h2>
          <ResultsChart :shorts="trPlannerStore.shorts" />
        </div>
        
        <div class="bg-gray-850 rounded-lg p-4 border border-gray-700">
          <h2 class="text-xl font-bold mb-4">Statistics</h2>
          <PlannerStats 
            :shorts="trPlannerStore.shorts" 
            :config="trPlannerStore.plannerConfig" 
            :stats="stats"
          />
        </div>
      </div>
    </div>
    
    <!-- Stats Input Modal -->
    <StatsInputModal 
      v-if="showStatsModal"
      :isVisible="showStatsModal"
      :currentStats="trPlannerStore.userStats"
      :showFragmultiBoosts="trPlannerStore.plannerConfig.calculateCampaignFrags"
      @close="showStatsModal = false"
      @save="saveUserStats"
    />
    
    <!-- Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white flex items-center"
        :class="{ 
          'bg-green-600': toast.type === 'success',
          'bg-red-600': toast.type === 'error',
          'bg-blue-600': toast.type === 'info'
        }"
      >
        <div v-if="toast.type === 'success'">
          <IconCircleCheck size="20" class="mr-2" />
        </div>
        <div v-else-if="toast.type === 'error'">
          <IconAlertCircle size="20" class="mr-2" />
        </div>
        <div v-else>
          <IconInfoCircle size="20" class="mr-2" />
        </div>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import PlannerForm from '@/components/tr-planner/PlannerForm.vue';
import ShortEntryCard from '@/components/tr-planner/TREntryCard.vue';
import ResultsChart from '@/components/tr-planner/ResultsChart.vue';
import PlannerStats from '@/components/tr-planner/PlannerStats.vue';
import StatsInputModal from '@/components/tr-planner/StatsInputModal.vue';
import { useTRPlannerStore } from '@/store/orbStore';
import { 
  IconChartBar, 
  IconStar, 
  IconRefresh,
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle
} from '@tabler/icons-vue';

// Pinia Store einbinden
const trPlannerStore = useTRPlannerStore();

// Modal state
const showStatsModal = ref(false);

// Toast notification
const toast = ref({ show: false, message: '', type: 'info' });

// Stats für Komponenten-Kompatibilität
const stats = computed(() => {
  return {
    totalOrbMultiplier: trPlannerStore.totalOrbMultiplier,
    totalFragMultiplier: trPlannerStore.totalFragMultiplier,
    activeBoosts: trPlannerStore.activeBoosts,
  };
});

// Open stats modal
function openStatsModal() {
  showStatsModal.value = true;
}

// Save user stats from modal
function saveUserStats(newStats) {
  // Speichere Stats im Store
  trPlannerStore.updateUserStats(newStats);
  
  // Schließe das Modal
  showStatsModal.value = false;
  
  // Zeige Feedback
  showToastMessage('Stats updated successfully', 'success');
}

// Toggle campaign fragments calculation
function toggleCampaignFrags() {
  trPlannerStore.updatePlannerConfig({
    calculateCampaignFrags: !trPlannerStore.plannerConfig.calculateCampaignFrags
  });
}

// Update planner config
function updatePlannerConfig(newConfig) {
  trPlannerStore.updatePlannerConfig(newConfig);
}

// Add new short
function addNewShort() {
  // Erstelle einen neuen Short mit Standardwerten
  const newShort = {
    name: `TR #${trPlannerStore.shortCount + 1}`,
    duration: 24, // Standarddauer in Stunden
    orbs: 0,      // Berechnete Orbs
    frags: 0,     // Berechnete Fragments
    // Weitere Eigenschaften können hier hinzugefügt werden
  };
  
  // Füge den Short im Store hinzu
  trPlannerStore.addShort(newShort);
}

// Edit short
function editShort(index, updatedShort) {
  const shortId = trPlannerStore.shorts[index]?.id;
  if (shortId) {
    trPlannerStore.updateShort(shortId, updatedShort);
  }
}

// Delete short
function deleteShort(index) {
  if (confirm('Are you sure you want to delete this short?')) {
    const shortId = trPlannerStore.shorts[index]?.id;
    if (shortId) {
      trPlannerStore.deleteShort(shortId);
    }
  }
}

// Reset planner
function resetPlanner() {
  if (confirm('Are you sure you want to reset the planner? This will delete all your shorts.')) {
    // Reset planner über Store-Action
    trPlannerStore.resetPlanner();
    
    showToastMessage('Planner has been reset', 'info');
  }
}

// Show toast message
function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Load data when component is mounted
onMounted(() => {
  // Keine zusätzliche Initialisierung notwendig, da der Store 
  // automatisch die Daten aus dem localStorage lädt
});
</script>

<style scoped>
/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>