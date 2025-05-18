<template>
  <div class="result-card border-l-4 bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl"
       :class="[isReferenceBuild ? 'border-yellow-500' : `border-${hunterColor}-500`]">
    
    <!-- Header-Komponente -->
    <BuildHeader 
      :build-data="buildData"
      :hunter-color="hunterColor"
      :is-reference-build="isReferenceBuild"
      :results="results"
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
    />
    
    <div class="p-4 pb-3">
      <!-- Loading-Zustand -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-8 space-y-3">
        <div class="w-full max-w-xs">
          <div class="text-sm text-gray-300 flex justify-between mb-1">
            <span>Evaluating build...</span>
            <span>{{ progressPercent }}%</span>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full transition-all duration-100"
              :class="`bg-${hunterColor}-500`"
              :style="`width: ${progressPercent}%;`">
            </div>
          </div>
        </div>
        <div class="text-xs text-gray-400">
          Iteration {{ progressIteration }} of {{ totalIterations }}
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
      <div v-else-if="results" class="space-y-5">
        <!-- Hauptstatistiken -->
        <BuildStatistics 
          :results="results"
          :reference-results="referenceResults"
          :is-reference-build="isReferenceBuild"
          :hunter-color="hunterColor"
          :result-labels="resultLabels"
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
          v-if="results.bossHpPercent !== '--' || results.bossKillRate !== '--'"
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
      
      <!-- Modals -->
      <BuildCodeModal
        :show="showCodeModal"
        :build="buildData"
        @close="showCodeModal = false"
      />
      
      <!-- Statistics Modal -->
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
        @close="showDistributionModal = false"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
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
  'overrides', 'share', 'overridesBuild', 'evaluated', 'reevaluate', 'showUploadDialog', 'upgradeComparison'
]);

// State und Refs
const route = useRoute();
const hunterStore = useHunterStore();
const showCodeModal = ref(false);
const showDistributionModal = ref(false);
const showUploadDialog = ref(false);
const showUpgradeComparisonModal = ref(false);

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

// Handler für Upgrade-Vergleich
function handleUpgradeComparison() {
  // Den Build mit den aktuellen Ergebnissen vorbereiten
  const buildWithResults = {
    ...props.buildData,
    results: getCurrentResults() // Verwende die neue Funktion aus dem Composable
  };
  
  // Das Modal anzeigen und den erweiterten Build übergeben
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