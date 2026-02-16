<template>
  <div ref="cardRootEl" class="result-card border-l-4 bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl"
       :class="[isReferenceBuild ? 'border-yellow-500' : `border-${hunterColor}-500`]">
    
    <!-- Header-Komponente -->
    <BuildHeader 
      :build-data="buildData"
      :hunter-color="hunterColor"
      :is-reference-build="isReferenceBuild"
      :results="results"
      :is-loading="isLoading"
      @edit="emit('edit', buildData)"
      @clone="emit('clone', buildData)"
      @archive="emit('archive', buildData)"
      @delete="emit('delete', buildData)"
      @name-changed="emit('nameChanged', $event)"
      @overrides="$emit('overridesBuild', buildData)"
      @share="showCodeModal = true"
      @reevaluate="handleReevaluate"
      @show-distribution="showDistributionModal = true" 
      @showUploadDialog="showUploadDialog = true" 
      @upgradeComparison="handleUpgradeComparison"
      @liveSimulation="showLiveSimulationModal = true"
      @overrideCosts="showOverrideCostsModal = true"
      @screenshot="handleScreenshot"
    />
    
    <div class="p-4 pb-3 pt-2">
      <!-- Loading-Zustand -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 space-y-4">
        <!-- Spinner -->
        <div class="relative">
          <div 
            class="w-12 h-12 border-4 border-gray-600 rounded-full animate-spin"
            :class="{
              'border-t-red-500': hunterColor === 'red',
              'border-t-blue-500': hunterColor === 'blue', 
              'border-t-green-500': hunterColor === 'green',
              'border-t-purple-500': hunterColor === 'purple',
              'border-t-emerald-500': !['red', 'blue', 'green', 'purple'].includes(hunterColor)
            }"
          ></div>
        </div>
        
        <!-- Loading Text -->
        <div class="text-center space-y-1">
          <p class="text-gray-300 font-medium">Evaluating build...</p>
        </div>
      </div>

      <!-- Fehler-Zustand -->
      <div v-else-if="hasError" class="text-center py-12">
        <IconAlertCircle size="40" class="mx-auto mb-2 text-red-400" />
        <p class="text-red-300">Evaluation error</p>
        <button @click="evaluateBuild" class="mt-2 text-sm text-gray-300 hover:text-white underline">
          Try again
        </button>
      </div>
      
      <!-- Ergebnisse -->
      <div v-else-if="results" class="space-y-2">
        <!-- Hauptstatistiken -->
        <BuildStatistics 
          :results="results"
          :reference-results="referenceResults"
          :is-reference-build="isReferenceBuild"
          :hunter-color="hunterColor"
          :result-labels="resultLabels"
          @screenshot="handleScreenshot"
        />
        
        <!-- Ressourcen -->
        <BuildResources 
          :results="results"
          :reference-results="referenceResults"
          :is-reference-build="isReferenceBuild"
          :result-labels="resultLabels"
          :hunterId="hunterId"
        />
        
        <!-- Boss-Statistiken -->
        <BuildBossStats 
          v-if="results.bossHpPercent !== 0 || results.bossKillRate !== 0"
          :results="results"
          :reference-results="referenceResults"
          :is-reference-build="isReferenceBuild"
          :result-labels="resultLabels"
        />

        <!-- Build-Tags -->
        <div v-if="buildData.tags && buildData.tags.length" class="flex flex-wrap gap-1 pt-2 border-t border-gray-700/50 mt-3">
          <span 
            v-for="tag in buildData.tags" 
            :key="tag"
            class="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Modals - mit Teleport außerhalb der Build-Card rendern -->
    <Teleport to="body">
      <BuildCodeModal
        :show="showCodeModal"
        :build="buildData"
        :results="results"
        @close="showCodeModal = false"
      />
      
      <!-- Statistics Modal -->
      <StatisticsModal 
        :show="showDistributionModal" 
        :build-name="buildData.name"
        :distribution="results?.stageDistribution"
        :death-distribution="results?.deathDistribution"
        :boss-kills-by-revive="results?.bossKillsByRevive"
        :hunter-id="hunterId"         
        :build-id="buildId"
        :avg-stage="results?.avgStage"
        :max-stage="results?.maxStage"
        :min-stage="results?.minStage"
        :sample-size="totalIterations"
        :build-stats="formattedBuildStats"  
        :material-stats="results"
        :result-labels="resultLabels"
        :color="hunterColor"
        @close="showDistributionModal = false"
      />

      <!-- UpgradeComparison Modal -->
      <UpgradeComparisonModal
        v-if="showUpgradeComparisonModal"
        :isVisible="showUpgradeComparisonModal"
        :hunterId="props.hunterId"
        :buildData="buildDataWithEffectiveOverrides"
        @close="showUpgradeComparisonModal = false"
        @applyOverrides="handleApplyUpgradeOverrides"
      />

      <!-- Override Costs Modal -->
      <OverrideCostsModal
        v-if="showOverrideCostsModal"
        :isVisible="showOverrideCostsModal"
        :hunterId="props.hunterId"
        :buildData="buildDataWithEffectiveOverrides"
        @close="showOverrideCostsModal = false"
      />

      <!-- Live Simulation Modal -->
      <LiveSimulationModal
        v-if="showLiveSimulationModal"
        :show="showLiveSimulationModal"
        :hunter-id="hunterId"
        :build-data="buildData"
        @close="showLiveSimulationModal = false"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { IconAlertCircle, IconUser } from '@tabler/icons-vue';
import { useRoute } from 'vue-router';
import { useHunterStore } from '../../../../store/hunterStore';
import { BuildCodeHandler } from '../../../../utils/BuildCodeHandler';
import { useBuildEvaluation } from '../../../../composables/useBuildEvaluation';

// Unterkomponenten importieren
import BuildHeader from './BuildHeader.vue';
import BuildStatistics from './BuildStatistics.vue';
import BuildResources from './BuildResources.vue';
import BuildBossStats from './BuildBossStats.vue';
import BuildCodeModal from '../../BuildCodeModal.vue';
import StatisticsModal from '@/components/common/StatisticsModal.vue'; 
import UpgradeComparisonModal from '@/components/common/UpgradeComparisonModal.vue';
import OverrideCostsModal from '@/components/common/OverrideCostsModal.vue';
import LiveSimulationModal from '@/components/common/LiveSimulationModal.vue';

// Props
const props = defineProps({
  buildId: { type: String, required: true },
  hunterId: { type: String, required: true },
  buildData: { type: Object, required: true },
  autoEvaluate: { type: Boolean, default: true },
  index: { type: Number, default: -1 }
});

const emit = defineEmits([
  'edit', 'clone', 'archive', 'delete', 'nameChanged',
  'overrides', 'share', 'overridesBuild', 'evaluated', 'reevaluate', 
  'showUploadDialog', 'upgradeComparison', 'liveSimulation'
]);

// State und Refs
const route = useRoute();
const hunterStore = useHunterStore();
const cardRootEl = ref(null);
const showCodeModal = ref(false);
const showDistributionModal = ref(false);
const showUploadDialog = ref(false);
const showUpgradeComparisonModal = ref(false);
const showOverrideCostsModal = ref(false);
const showLiveSimulationModal = ref(false);

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
  hunterInfo,
  hunterColor,
  formattedBuildStats, // Neu: Importiert aus dem Composable!
  evaluateBuild,
  handleReevaluate,
  loadHunterLabels,
  setupWatches,
  getCurrentResults,
  showToastMessage
} = useBuildEvaluation(props, emit);

// Screenshot der gesamten Karte
async function handleScreenshot() {
  const { captureScreenshot } = await import('@/composables/useCardScreenshot.js');
  const ok = await captureScreenshot(cardRootEl.value, {
    filename: `${props.buildData?.name || 'build'}.png`,
  });
  if (ok) showToastMessage('Screenshot copied to clipboard', 'success');
  else showToastMessage('Screenshot failed', 'error');
}

// Funktion zum Importieren eines Builds aus einem Code
function importBuild(build) {
  if (!build || !build.hunter) {
    showToastMessage('Error: Invalid build code', 'error');
    return;
  }
  
  // Erstelle eine Kopie des Builds mit einer neuen ID
  const newBuild = {
    ...build,
    id: `import_${Date.now()}`,
    timestamp: Date.now()
  };
  
  // Speichere den Build im Store
  hunterStore.addBuild(newBuild);
  
  showToastMessage(`Build "${newBuild.name}" imported successfully`);
}

// Funktion zum Behandeln des Modal-Schließen-Events
function handleStatsModalClosed(event) {
  if (event.detail?.hunterType === props.hunterId && props.autoEvaluate) {
    evaluateBuild();
  }
}

function handleBuildUploaded() {
  if (window.toast) window.toast.success('Build uploaded to database successfully');
}

// Computed: Build-Daten mit effektiven Overrides (Category + Build)
const buildDataWithEffectiveOverrides = computed(() => {
  // Hole die effektiven Overrides (Category + Build merged)
  const effectiveOverrides = hunterStore.getEffectiveBuildOverrides(props.hunterId, props.buildId);
  
  return {
    ...props.buildData,
    overrides: effectiveOverrides || props.buildData.overrides,
    results: getCurrentResults()
  };
});

// Handler für Upgrade-Vergleich
function handleUpgradeComparison() {
  // Das Modal anzeigen
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

// Watches einrichten - verwendet das Composable
setupWatches();

// Lebenszyklusmethoden
onMounted(async () => {
  // URL-Parameter prüfen für importierte Builds
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    // Try to parse the code
    const importedBuild = BuildCodeHandler.parseCode(code);
    
    if (importedBuild && importedBuild.hunter === route.params.hunterId) {
      // Clear the URL parameter without refreshing the page
      const url = new URL(window.location);
      url.searchParams.delete('code');
      window.history.replaceState({}, '', url);
      
      // Import the build
      importBuild(importedBuild);
      showToastMessage('Build imported successfully');
    }
  }

  // Lade die Hunter-Labels
  await loadHunterLabels();
  
  // Initial evaluieren, wenn autoEvaluate aktiviert ist
  if (props.autoEvaluate) {
    // Leichte Verzögerung für gestaffelte Evaluierung
    setTimeout(() => {
      evaluateBuild();
    }, props.index * 100); 
  }
  
  // Event-Listener für Modal-Schließung
  window.addEventListener('statsModalClosed', handleStatsModalClosed);
});

onUnmounted(() => {
  window.removeEventListener('statsModalClosed', handleStatsModalClosed);
});
</script>

<style scoped>
/* Grundstile für die Hauptkomponente bleiben hier */
.result-card {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

.loader-ring {
  width: 2.5rem;
  height: 2.5rem;
  border: 4px solid;
  border-radius: 9999px;
  border-top-color: transparent;
  border-color: rgba(var(--hunter-color, 255, 255, 255), 0.8);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>