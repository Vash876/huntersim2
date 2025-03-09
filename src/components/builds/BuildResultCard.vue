<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/builds/BuildResultCard.vue -->
<template>
  <div class="result-card border-l-4 bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-200 hover:shadow-2xl"
       :class="[isReferenceBuild ? 'border-yellow-500' : `border-${hunterColor}-500`]">
    
    <!-- Header-Komponente -->
    <BuildHeader 
      :build-data="buildData"
      :hunter-color="hunterColor"
      :is-reference-build="isReferenceBuild"
      @edit="emit('edit', buildData)"
      @clone="emit('clone', buildData)"
      @archive="emit('archive', buildData)"
      @delete="emit('delete', buildData)"
      @name-changed="handleNameChanged"
      @overrides="$emit('overridesBuild', buildData)"
      @share="showCodeModal = true"
      @reevaluate="handleReevaluate"
    />
    
    <div class="p-5 pb-3">
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
        />
        
        <!-- Boss-Statistiken -->
        <BuildBossStats 
          v-if="results.bossHpPercent !== '--' || results.bossKillRate !== '--'"
          :results="results"
          :reference-results="referenceResults"
          :is-reference-build="isReferenceBuild"
          :result-labels="resultLabels"
        />
        
        <!-- Stage-Verteilung -->
        <BuildStageDistribution 
          v-if="results?.stageDistribution?.length"
          :stage-distribution="results.stageDistribution"
          :hunter-color="hunterColor"
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
      <BuildCodeModal
        :show="showCodeModal"
        :build="buildData"
        @close="showCodeModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, inject, nextTick } from 'vue';
import { IconAlertCircle, IconUser } from '@tabler/icons-vue';
import { useRoute } from 'vue-router';
import { useHunterStore } from '../../store/hunterStore';
import { evaluateBuildWithWorker } from '../../services/workerService';
import { getHunterById } from '../../constants/hunters';
import * as EvaluationCacheService from '../../services/evaluationCacheService';
import { BuildCodeHandler } from '../../utils/buildCodeHandler';

// Unterkomponenten importieren
import BuildHeader from './card-components/BuildHeader.vue';
import BuildStatistics from './card-components/BuildStatistics.vue';
import BuildResources from './card-components/BuildResources.vue';
import BuildBossStats from './card-components/BuildBossStats.vue';
import BuildStageDistribution from './card-components/BuildStageDistribution.vue';
import BuildCodeModal from './BuildCodeModal.vue';

// Global evaluation cache and reference build
const evaluationCache = inject('evaluationCache', ref({}));
const referenceBuildId = inject('referenceBuildId', ref(null));
const referenceBuildResults = inject('referenceBuildResults', ref({})); 
const referenceUpdateCounter = inject('referenceUpdateCounter', ref(0));
const showCodeModal = ref(false);

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
  'overrides', 'share', 'overridesBuild', 'evaluated', 'reevaluate'
]);

// State
const route = useRoute();
const hunterStore = useHunterStore();
const isLoading = ref(false);
const hasError = ref(false);
const results = ref(null);
const showDistribution = ref(false);
const resultLabels = ref({}); // Standardwerte, werden später aktualisiert
const currentCacheKey = ref(null);

// Fortschritts-Tracking-Variablen
const progressIteration = ref(0);
const totalIterations = ref(1000);
const progressPercent = computed(() => {
  const percent = Math.round((progressIteration.value / totalIterations.value) * 100);
  return Math.min(99, percent); // Maximal 99%, 100% erst bei vollständiger Fertigstellung
});

// Berechne, ob dies der Referenz-Build ist
const isReferenceBuild = computed(() => {
  return props.index === 0 || props.buildId === referenceBuildId.value;
});

// Referenz-Ergebnisse für Vergleiche
const referenceResults = computed(() => {
  if (isReferenceBuild.value) return {};
  return referenceBuildResults.value && typeof referenceBuildResults.value === 'object' 
    ? referenceBuildResults.value 
    : {};
});

// Hunter-Info
const hunterInfo = computed(() => getHunterById(props.hunterId));
const hunterColor = computed(() => hunterInfo.value?.color || 'gray');
const hunterIcon = computed(() => hunterInfo.value?.icon || IconUser);

// Laden der Hunter-spezifischen Labels
async function loadHunterLabels() {
  try {
    const hunter = getHunterById(props.hunterId);
    
    if (hunter && hunter.statsModule) {
      console.log(`Loading stats module for hunter: ${hunter.id}`);
      const module = await hunter.statsModule();
      
      // Zugriff auf EVAL_RESULT_LABELS aus dem geladenen Modul
      if (module && module.EVAL_RESULT_LABELS) {
        resultLabels.value = module.EVAL_RESULT_LABELS;
        console.log(`Labels loaded for ${hunter.id}:`, resultLabels.value);
      } else {
        console.warn(`No EVAL_RESULT_LABELS found in module for ${hunter.id}`);
        setDefaultLabels();
      }
    } else {
      console.warn(`No stats module found for hunter: ${props.hunterId}`);
      setDefaultLabels();
    }
  } catch (error) {
    console.error(`Error loading labels for hunter ${props.hunterId}:`, error);
    setDefaultLabels();
  }
}

// Fallback-Labels, wenn die dynamischen nicht geladen werden können
function setDefaultLabels() {
  resultLabels.value = {
    lootPerMin: 'Loot per Min',
    avgStage: 'Avg Stage',
    avgTime: 'Run Time',
    xp: 'XP',
    mat1: 'Material 1',
    mat2: 'Material 2', 
    mat3: 'Material 3',
    bossHpPercent: 'Boss HP',
    bossKillRate: 'Kill Rate'
  };
}

// Weiterleitung des nameChanged Events
function handleNameChanged(newName) {
  emit('nameChanged', { buildId: props.buildId, name: newName });
}

// Überwache Änderungen am Referenz-Counter, um die UI zu aktualisieren
watch(referenceUpdateCounter, () => {
  if (!isReferenceBuild.value && results.value) {
    const tempResults = { ...results.value };
    nextTick(() => {
      results.value = tempResults;
    });
  }
});

// Beobachte Änderungen an isReferenceBuild
watch(isReferenceBuild, (newValue) => {
  if (newValue && results.value) {
    referenceBuildResults.value = { ...results.value };
    if (typeof referenceUpdateCounter.value === 'number') {
      referenceUpdateCounter.value++;
    }
  }
});

// Behandle manuelle Reevaluierungen
async function handleReevaluate() {
  console.log(`Re-evaluating build: ${props.buildData.name || 'unnamed'}`);
  
  try {
    // Cache für diesen Build zurücksetzen
    if (currentCacheKey.value) {
      await EvaluationCacheService.clearCache(props.hunterId, currentCacheKey.value);
      await EvaluationCacheService.invalidateCacheKey(props.hunterId, currentCacheKey.value);
    }
    
    // Zeige Lade-Animation
    isLoading.value = true;
    hasError.value = false;
    progressIteration.value = 0;
    
    // Kurze Verzögerung für visuelle Rückmeldung
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Build neu evaluieren und explizit cachen
    const evalResult = await evaluateBuild(true);
    
    // Stelle sicher, dass das Ergebnis im Cache gespeichert wird
    if (evalResult && currentCacheKey.value) {
      // Einen neuen Cache-Key generieren für die neu evaluierten Daten
      const newCacheKey = await EvaluationCacheService.generateCacheKey({
        hunterId: props.hunterId,
        buildData: props.buildData,
        hunterStore
      });
      
      // Ergebnis mit dem neuen Schlüssel cachen
      await EvaluationCacheService.cacheResult({
        hunterId: props.hunterId,
        buildData: props.buildData,
        hunterStore,
        result: evalResult,
        cacheKey: newCacheKey
      });
      
      // Aktualisiere den Cache-Key
      currentCacheKey.value = newCacheKey;
      
      console.log(`[Re-Eval] Stored new evaluation result with key: ${newCacheKey}`);
    }
    
    // Zeige eine Bestätigung an
    showToastMessage(`Build "${props.buildData.name || 'unnamed'}" re-evaluated`);
  } catch (error) {
    console.error('Error during re-evaluation:', error);
    hasError.value = true;
    isLoading.value = false;
  }
}

// Hauptfunktion: Build evaluieren mit Cache-Unterstützung
async function evaluateBuild(forceEvaluation = false) {
  // Skip if already loading with active progress
  if (isLoading.value && progressIteration.value > 0) {
    console.log('Evaluation already in progress, skipping duplicate call');
    return null; // Wichtig: Rückgabewert für handleReevaluate
  }
  
  isLoading.value = true;
  hasError.value = false;
  progressIteration.value = 0;
  
  try {
    // Lade Hunter-Labels vor der Evaluierung
    await loadHunterLabels();
    
    // Wenn keine erzwungene Evaluierung, prüfe den Cache
    let shouldEvaluate = forceEvaluation;
    let cachedResult = null;
    let cacheKey = null;
    
    if (!forceEvaluation) {
      // Prüfe den Cache mit dem EvaluationCacheService
      const cacheResult = await EvaluationCacheService.shouldEvaluate({
        hunterId: props.hunterId,
        buildData: props.buildData,
        hunterStore
      });
      
      // Werte extrahieren
      shouldEvaluate = cacheResult.shouldEvaluate;
      cachedResult = cacheResult.cachedResult;
      cacheKey = cacheResult.cacheKey;
      
      // Speichere den aktuellen Cache-Key
      currentCacheKey.value = cacheKey;
    } else {
      // Bei erzwungener Evaluierung einen neuen Cache-Key generieren
      const newCacheKey = await EvaluationCacheService.generateCacheKey({
        hunterId: props.hunterId,
        buildData: props.buildData,
        hunterStore
      });
      currentCacheKey.value = newCacheKey;
      shouldEvaluate = true;
      
      console.log(`Forced evaluation with new cache key: ${newCacheKey}`);
    }
    
    // Wenn ein gültiges Cache-Ergebnis gefunden wurde UND keine erzwungene Evaluierung, verwende es
    if (!shouldEvaluate && !forceEvaluation && cachedResult) {
      console.log(`Using cached result for build ${props.buildData.name}`);
      results.value = cachedResult;
      
      // Wenn wir eine Verteilung haben und sie angezeigt werden soll, Chart aktualisieren
      if (results.value?.stageDistribution?.length && showDistribution.value) {
        await nextTick();
        // renderChart-Funktion wurde entfernt; hier bei Bedarf wieder einbauen
      }
      
      // Emittiere evaluated-Event
      emit('evaluated', {
        buildId: props.buildId,
        results: results.value,
        isReference: isReferenceBuild.value
      });
      
      // Aktualisiere die Referenz, wenn dies der Referenz-Build ist
      if (isReferenceBuild.value && results.value) {
        referenceBuildResults.value = { ...results.value };
        if (typeof referenceUpdateCounter.value === 'number') {
          referenceUpdateCounter.value++;
        }
      }
      
      // Für Re-Evaluation benötigen wir einen Rückgabewert
      return cachedResult; // Wichtig: Rückgabewert für handleReevaluate
    }
    
    console.log(`${forceEvaluation ? 'Forced evaluation' : 'No cache found'} for ${props.buildData.name || 'unnamed'}, evaluating...`);
    
    // Hole die aktuellen Hunter-Daten und Upgrades aus dem Store
    let store = {
      hunterStats: { ...hunterStore.hunterStats },
      upgrades: { ...hunterStore.upgrades },
      hunterIterations: hunterStore.hunterIterations
    };
    
    // Anwenden der Overrides auf die Store-Daten vor der Evaluierung
    if (props.buildData.overrides && Object.keys(props.buildData.overrides).length > 0) {
      console.log('Applying overrides:', props.buildData.overrides);
      
      // Erstelle eine tiefe Kopie der Store-Daten
      store = {
        hunterStats: JSON.parse(JSON.stringify(store.hunterStats)),
        upgrades: JSON.parse(JSON.stringify(store.upgrades)),
        hunterIterations: store.hunterIterations
      };
      
      // Wenn die Hunter-Stats für diesen Hunter nicht existieren, initialisiere sie
      if (!store.hunterStats[props.hunterId]) {
        store.hunterStats[props.hunterId] = {};
      }
      
      // Anwenden der Overrides
      for (const [key, value] of Object.entries(props.buildData.overrides)) {
        // Wenn der Override ein Upgrade betrifft (enthält einen Punkt)
        if (key.includes('.')) {
          const parts = key.split('.');
          
          // Korrekte Behandlung der Upgrade-Hierarchie
          if (parts[0] === 'upgrades') {
            // Für 'upgrades.category.id' Format
            if (parts.length === 3) {
              const category = parts[1];
              const itemId = parts[2];
              
              // Stelle sicher, dass die Kategorie existiert
              if (!store.upgrades[category]) {
                store.upgrades[category] = {};
              }
              
              // Überschreibe den Wert im Store
              store.upgrades[category][itemId] = value;
            }
            // Für 'upgrades.category.subcategory.id' Format
            else if (parts.length === 4) {
              const category = parts[1];
              const subcategory = parts[2];
              const itemId = parts[3];
              
              // Stelle sicher, dass die Kategorien existieren
              if (!store.upgrades[category]) {
                store.upgrades[category] = {};
              }
              if (!store.upgrades[category][subcategory]) {
                store.upgrades[category][subcategory] = {};
              }
              
              // Überschreibe den Wert im Store
              store.upgrades[category][subcategory][itemId] = value;
            }
          }
        } else {
          // Andernfalls ist es ein direkter Hunter-Stat
          store.hunterStats[props.hunterId][key] = value;
        }
      }
    }
    
    // Hole die aktuellen Iterations-Einstellungen
    totalIterations.value = store.hunterIterations?.[props.hunterId] || 1000;
    
    // Worker-Evaluierung durchführen mit Fortschrittscallback
    const evalResult = await evaluateBuildWithWorker(
      props.hunterId, 
      props.buildData, 
      store, 
      (progress) => {
        // Update progress information
        progressIteration.value = progress.iteration;
        
        // Debug-Ausgabe bei Fortschrittsaktualisierungen
        if (progress.iteration % (progress.total / 10) < 10) {
          console.log(`Progress update: ${progress.iteration}/${progress.total} (${Math.round((progress.iteration / progress.total) * 100)}%)`);
        }
      }
    );
    
    // Speichere das Ergebnis
    results.value = evalResult;
    
    // Sobald wir hier sind, wurde die Evaluierung erfolgreich abgeschlossen
    console.log('Evaluation completed successfully');
    
    // Stelle sicher, dass wir 100% erreicht haben, auch wenn der letzte Fortschrittsupdate fehlt
    progressIteration.value = totalIterations.value;
    
    // Wenn dies keine erzwungene Evaluierung ist, speichere das Ergebnis im regulären Cache
    if (!forceEvaluation) {
      await EvaluationCacheService.cacheResult({
        hunterId: props.hunterId,
        buildData: props.buildData,
        hunterStore,
        result: evalResult,
        cacheKey: currentCacheKey.value
      });
    }
    
    // Wichtiger Teil: Aktualisiere die Referenz, wenn dies der Referenz-Build ist
    if (isReferenceBuild.value && results.value) {
      referenceBuildResults.value = { ...results.value };
      console.log('Reference build results updated:', referenceBuildResults.value);
      // Erhöhe den Counter, damit andere Builds aktualisiert werden
      if (typeof referenceUpdateCounter.value === 'number') {
        referenceUpdateCounter.value++;
      }
    }
    
    // Emittiere evaluated-Event in jedem Fall
    emit('evaluated', {
      buildId: props.buildId,
      results: results.value,
      isReference: isReferenceBuild.value
    });
    
    // Gib das Ergebnis zurück für handleReevaluate
    return evalResult; // Wichtig: Rückgabewert für handleReevaluate
    
  } catch (error) {
    console.error('Error evaluating build:', error);
    hasError.value = true;
    return null; // Bei Fehler null zurückgeben
  } finally {
    isLoading.value = false;
  }
}

// Watch für Änderungen an den Build-Daten (Talente, Attribute, Overrides)
watch(
  () => [
    props.buildData.talents, 
    props.buildData.attributes,
    props.buildData.overrides
  ], 
  () => {
    console.log('Build data changed, re-evaluating...');
    evaluateBuild();
  },
  { deep: true }
);

// Watch für Änderungen der Level-Property
watch(
  () => props.buildData.level,
  (newLevel, oldLevel) => {
    if (newLevel !== oldLevel) {
      console.log(`Build level changed from ${oldLevel} to ${newLevel}, re-evaluating...`);
      evaluateBuild();
    }
  }
);

// Watch für Upgrade-Änderungen (verwendet jetzt den EvaluationCacheService)
watch(
  () => hunterStore.upgrades,
  async () => {
    // Prüfe, ob die relevanten Upgrades geändert wurden
    const shouldUpdate = await EvaluationCacheService.shouldUpdateOnUpgradesChange({
      hunterId: props.hunterId,
      buildData: props.buildData,
      hunterStore
    });
    
    if (shouldUpdate) {
      console.log(`Relevant upgrades changed for ${props.hunterId}, re-evaluating build "${props.buildData.name || 'unnamed'}"`);
      evaluateBuild();
    } else {
      console.log(`No relevant upgrade changes for build "${props.buildData.name || 'unnamed'}", skipping evaluation`);
    }
  },
  { deep: true }
);

// Watch für Iterationen
watch(
  () => hunterStore.hunterIterations[props.hunterId],
  (newIterations, oldIterations) => {
    if (newIterations > oldIterations) {
      console.log(`Iterations changed from ${oldIterations} to ${newIterations}, re-evaluating...`);
      evaluateBuild();
    }
  }
);

// Hilfsfunktion für Toasts
function showToastMessage(message) {
  // Prüfe, ob eine globale Toast-Funktion verfügbar ist
  if (window.toast && typeof window.toast === 'function') {
    window.toast.success(message);
  } else {
    console.log('Toast message:', message);
  }
}

// Funktion zum Importieren eines Builds aus einem Code
function importBuild(build) {
  if (!build || !build.hunter) {
    showToastMessage('Error: Invalid build code');
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

function handleStatsModalClosed(event) {
  if (event.detail?.hunterType === props.hunterId && props.autoEvaluate) {
    evaluateBuild();
  }
}

// Füge einen Watch für hunterId hinzu, um Labels neu zu laden, wenn sich der Hunter ändert
watch(() => props.hunterId, async (newHunterId, oldHunterId) => {
  if (newHunterId !== oldHunterId) {
    await loadHunterLabels();
  }
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