<template>
  <div 
    class="build-vertical border-l-4 bg-gray-800 rounded-lg shadow-md mb-2 overflow-hidden transition-all duration-200 hover:shadow-xl"
    :class="[
      isReferenceBuild ? 'border-yellow-500' : `border-${hunterColor}-500`,
    ]"
    ref="buildElement"
  >
    <div class="flex flex-col">
      <!-- Header mit Build-Info und Aktionen -->
      <BuildHeader 
        :buildData="buildData"
        :enabledStats="enabledStats"
        :results="results"
        @edit="emit('edit', buildData)"
        @clone="emit('clone', buildData)"
        @archive="emit('archive', buildData)"
        @delete="emit('delete', buildData)"
        @overridesBuild="emit('overridesBuild', buildData)"
        @name-changed="emit('nameChanged', $event)"
        @showCode="showCodeModal = true"
        @showDistribution="showDistributionModal = true"
        @reevaluate="handleReevaluate" 
      />
      
      <!-- Build-Ergebnisse (Loot, Statistiken) -->
      <BuildLoot
        :buildData="buildData"
        :isLoading="isLoading"
        :hasError="hasError"
        :results="results"
        :isReferenceBuild="isReferenceBuild"
        :referenceResults="referenceResults"
        :resultLabels="resultLabels"
        :progressIteration="progressIteration"
        :totalIterations="totalIterations"
        :hunterColor="hunterColor"
        @reevaluate="handleReevaluate"
      />
    </div>
    
    <!-- Modals -->
    <BuildCodeModal :show="showCodeModal" :build="buildData" @close="showCodeModal = false" />
    
    <!-- Statistics Modal - direkt einbinden ohne verschachteltes Teleport -->
    <StatisticsModal 
      :show="showDistributionModal" 
      :build-name="buildData.name"
      :distribution="results?.stageDistribution"
      :avg-stage="results?.avgStage"
      :max-stage="results?.maxStage"
      :min-stage="results?.minStage"
      :sample-size="totalIterations"
      :build-stats="formattedBuildStats"  
      :color="hunterColor"
      @close="closeStatsModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import { useBuildEvaluation } from '@/composables/useBuildEvaluation';

// Komponenten importieren
import BuildHeader from './BuildHeader.vue';  
import BuildLoot from './BuildLoot.vue';
import BuildCodeModal from '../../BuildCodeModal.vue';
import StatisticsModal from '@/components/common/StatisticsModal.vue';

// Props definieren 
const props = defineProps({
  buildId: { type: String, required: true },
  hunterId: { type: String, required: true },
  buildData: { type: Object, required: true },
  autoEvaluate: { type: Boolean, default: true },
  index: { type: Number, default: -1 }
});

// Emits definieren 
const emit = defineEmits([
  'edit', 'clone', 'archive', 'delete', 'nameChanged',
  'overrides', 'share', 'overridesBuild', 'evaluated', 'reevaluate'
]);

// DOM-Refs
const buildElement = ref(null);

// UI-State
const showCodeModal = ref(false);
const showDistributionModal = ref(false);

// Display settings
const displaySettings = inject('displaySettings', ref({ 
  displayMode: 'vertical',
  enabledStats: ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'],
  chartStyle: 'bar'
}));

// Verfügbare Statistiken basierend auf den Anzeigeeinstellungen
const enabledStats = computed(() => {
  return displaySettings.value?.enabledStats || ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'];
});

// Build-Evaluierung mit dem Composable - jetzt mit formattedBuildStats
const {
  isLoading,
  hasError,
  results,
  resultLabels,
  progressIteration,
  totalIterations,
  progressPercent,
  isReferenceBuild,
  referenceResults,
  hunterColor,
  formattedBuildStats,
  evaluateBuild,
  handleReevaluate,
  loadHunterLabels,
  setupWatches,
  showToastMessage
} = useBuildEvaluation(props, emit);

// Neue Funktion: Modal schließen und bei Bedarf neu evaluieren
function closeStatsModal() {
  showDistributionModal.value = false;
  // Nach dem Schließen den Build neu evaluieren
  if (props.autoEvaluate) {
    evaluateBuild(true); // force evaluation
  }
}

// Funktion zum Behandeln des Modal-Schließen-Events (wie in vertikalem Modus)
function handleStatsModalClosed(event) {
  if (event.detail?.hunterType === props.hunterId && props.autoEvaluate) {
    evaluateBuild();
  }
}

// Watches einrichten
setupWatches();

// Lebenszyklusmethoden
onMounted(async () => {
  await loadHunterLabels();
  
  // Build evaluieren, wenn autoEvaluate aktiv ist
  if (props.autoEvaluate) {
    // Verzögerung für gestaffelte Evaluierung
    setTimeout(() => {
      evaluateBuild();
    }, props.index * 100); 
  }
  
  // Event-Listener für Modal-Schließung (wie in vertikalem Modus)
  window.addEventListener('statsModalClosed', handleStatsModalClosed);
});

onUnmounted(() => {
  window.removeEventListener('statsModalClosed', handleStatsModalClosed);
});
</script>

<style scoped>
.build-vertical {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}
</style>