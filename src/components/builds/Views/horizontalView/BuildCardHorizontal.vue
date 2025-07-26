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
        @upgradeComparison="handleUpgradeComparison" 
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
        :hunterId="hunterId"
      />
    </div>
    
    <!-- Modals -->
    <BuildCodeModal :show="showCodeModal" :build="buildData" :results="results" @close="showCodeModal = false" />
    
    <!-- Statistics Modal - direkt einbinden ohne verschachteltes Teleport -->
    <StatisticsModal 
      :show="showDistributionModal" 
      :build-name="buildData.name"
      :hunter-id="hunterId"       
      :build-id="buildData.id"
      :distribution="results?.stageDistribution"
      :death-distribution="results?.deathDistribution"
      :boss-kills-by-revive="results?.bossKillsByRevive"
      :avg-stage="results?.avgStage"
      :max-stage="results?.maxStage"
      :min-stage="results?.minStage"
      :sample-size="totalIterations"
      :build-stats="formattedBuildStats"  
      :color="hunterColor"
      @close="closeStatsModal"
    />

    <!-- UpgradeComparison Modal -->
    <UpgradeComparisonModal
      v-if="showUpgradeComparisonModal"
      :isVisible="showUpgradeComparisonModal"
      :hunterId="props.hunterId"
      :buildData="{...buildData, results}"
      @close="showUpgradeComparisonModal = false"
      @applyOverrides="handleApplyUpgradeOverrides"
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
import UpgradeComparisonModal from '@/components/common/UpgradeComparisonModal.vue';

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
  'overrides', 'share', 'overridesBuild', 'evaluated', 'reevaluate',
  'updateBuild'
]);

// DOM-Refs
const buildElement = ref(null);

// UI-State
const showCodeModal = ref(false);
const showDistributionModal = ref(false);
const showUpgradeComparisonModal = ref(false);

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

// Build-Evaluierung mit dem Composable
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
  showToastMessage,
  getCurrentResults
} = useBuildEvaluation(props, emit);

// Modal schließen
function closeStatsModal() {
  showDistributionModal.value = false;
}

// Handler für Upgrade-Vergleich
function handleUpgradeComparison() {
  // Das Modal anzeigen und den Build mit Ergebnissen übergeben
  showUpgradeComparisonModal.value = true;
}

// Handler für das Anwenden von Overrides aus dem UpgradeComparisonModal
function handleApplyUpgradeOverrides(payload) {
  // Wenn keine Daten übergeben wurden, nichts tun
  if (!payload || !payload.overrides) {
    return;
  }
  
  const { overrides, precomputedResults } = payload;
  
  // Erstelle eine Kopie des Build-Objekts mit den neuen Overrides
  const updatedBuild = {
    ...props.buildData,
    overrides: {
      ...(props.buildData.overrides || {}),
      ...(overrides || {})
    }
  };
  
  // Übergebene Overrides an den globalen Build-State senden
  emit('overridesBuild', updatedBuild);
  
  // Wenn vorberechnete Ergebnisse vorhanden sind, diese direkt übernehmen
  if (precomputedResults) {
    // Setze die vorberechneten Ergebnisse direkt in den Build
    updatedBuild.results = precomputedResults;
    emit('updateBuild', updatedBuild);
    showToastMessage('Upgrade changes applied to build');
  } else {
    // Nur neu evaluieren, wenn keine vorberechneten Ergebnisse vorhanden sind
    handleReevaluate();
    showToastMessage('Upgrade changes applied to build');
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