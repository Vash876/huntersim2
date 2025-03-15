// src/composables/useBuildEvaluation.js
import { ref, computed, watch, inject, nextTick } from 'vue';
import { useHunterStore } from '../store/hunterStore';
import { evaluateBuildWithWorker } from '../services/workerService';
import { getHunterById } from '../constants/hunters';
import * as EvaluationCacheService from '../services/evaluationCacheService';

export function useBuildEvaluation(props, emit) {
  const hunterStore = useHunterStore();
  
  // State
  const isLoading = ref(false);
  const hasError = ref(false);
  const results = ref(null);
  const resultLabels = ref({});
  const currentCacheKey = ref(null);
  
  // Injects
  const evaluationCache = inject('evaluationCache', ref({}));
  const referenceBuildId = inject('referenceBuildId', ref(null));
  const referenceBuildResults = inject('referenceBuildResults', ref({})); 
  const referenceUpdateCounter = inject('referenceUpdateCounter', ref(0));
  
  // Computed
  const isReferenceBuild = computed(() => {
    return props.index === 0 || props.buildId === referenceBuildId.value;
  });
  
  const referenceResults = computed(() => {
    if (isReferenceBuild.value) return {};
    return referenceBuildResults.value && typeof referenceBuildResults.value === 'object' 
      ? referenceBuildResults.value 
      : {};
  });
  
  const hunterInfo = computed(() => getHunterById(props.hunterId));
  const hunterColor = computed(() => hunterInfo.value?.color || 'gray');
  
  // Fortschritts-Tracking-Variablen
  const progressIteration = ref(0);
  const totalIterations = ref(1000);
  const progressPercent = computed(() => {
    const percent = Math.round((progressIteration.value / totalIterations.value) * 100);
    return Math.min(99, percent);
  });
  
  // Laden der Hunter-spezifischen Labels
  async function loadHunterLabels() {
    try {
      const hunter = getHunterById(props.hunterId);
      
      if (hunter && hunter.statsModule) {
        const module = await hunter.statsModule();
        
        if (module && module.EVAL_RESULT_LABELS) {
          resultLabels.value = module.EVAL_RESULT_LABELS;
        } else {
          setDefaultLabels();
        }
      } else {
        setDefaultLabels();
      }
    } catch (error) {
      console.error(`Error loading labels for hunter ${props.hunterId}:`, error);
      setDefaultLabels();
    }
  }
  
  // Fallback-Labels
  function setDefaultLabels() {
    resultLabels.value = {
      lootPerMin: 'Loot/Min',
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
  
  // Behandle manuelle Reevaluierungen
  async function handleReevaluate() {
    try {
      // Cache für diesen Build zurücksetzen
      if (currentCacheKey.value) {
        await EvaluationCacheService.clearCache(props.hunterId, currentCacheKey.value);
        await EvaluationCacheService.invalidateCacheKey(props.hunterId, currentCacheKey.value);
      }
      
      isLoading.value = true;
      hasError.value = false;
      progressIteration.value = 0;
      
      // Kurze Verzögerung für visuelle Rückmeldung
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Build neu evaluieren und explizit cachen
      const evalResult = await evaluateBuild(true);
      
      // Stelle sicher, dass das Ergebnis im Cache gespeichert wird
      if (evalResult && currentCacheKey.value) {
        const newCacheKey = await EvaluationCacheService.generateCacheKey({
          hunterId: props.hunterId,
          buildData: props.buildData,
          hunterStore
        });
        
        await EvaluationCacheService.cacheResult({
          hunterId: props.hunterId,
          buildData: props.buildData,
          hunterStore,
          result: evalResult,
          cacheKey: newCacheKey
        });
        
        currentCacheKey.value = newCacheKey;
      }
      
      // Zeige eine Bestätigung an
      showToastMessage(`Build "${props.buildData.name || 'unnamed'}" re-evaluated`);
      
      // Emittiere reevaluate-Event
      emit('reevaluate', props.buildId);
    } catch (error) {
      console.error('Error during re-evaluation:', error);
      hasError.value = true;
      isLoading.value = false;
    }
  }
  
  // Hauptfunktion: Build evaluieren mit Cache-Unterstützung
  async function evaluateBuild(forceEvaluation = false) {
    await loadHunterStatsLabels();
    if (isLoading.value && progressIteration.value > 0) {
      return null;
    }
    
    isLoading.value = true;
    hasError.value = false;
    progressIteration.value = 0;
    
    try {
      await loadHunterLabels();
      
      let shouldEvaluate = forceEvaluation;
      let cachedResult = null;
      let cacheKey = null;
      
      if (!forceEvaluation) {
        const cacheResult = await EvaluationCacheService.shouldEvaluate({
          hunterId: props.hunterId,
          buildData: props.buildData,
          hunterStore
        });
        
        shouldEvaluate = cacheResult.shouldEvaluate;
        cachedResult = cacheResult.cachedResult;
        cacheKey = cacheResult.cacheKey;
        
        currentCacheKey.value = cacheKey;
      } else {
        const newCacheKey = await EvaluationCacheService.generateCacheKey({
          hunterId: props.hunterId,
          buildData: props.buildData,
          hunterStore
        });
        currentCacheKey.value = newCacheKey;
        shouldEvaluate = true;
      }
      
      if (!shouldEvaluate && !forceEvaluation && cachedResult) {
        results.value = cachedResult;
        
        emit('evaluated', {
          buildId: props.buildId,
          results: results.value,
          isReference: isReferenceBuild.value
        });
        
        if (isReferenceBuild.value && results.value) {
          referenceBuildResults.value = { ...results.value };
          if (typeof referenceUpdateCounter.value === 'number') {
            referenceUpdateCounter.value++;
          }
        }
        
        return cachedResult;
      }
      
      let store = {
        hunterStats: { ...hunterStore.hunterStats },
        upgrades: { ...hunterStore.upgrades },
        hunterIterations: hunterStore.hunterIterations
      };
      
      if (props.buildData.overrides && Object.keys(props.buildData.overrides).length > 0) {
        store = {
          hunterStats: JSON.parse(JSON.stringify(store.hunterStats)),
          upgrades: JSON.parse(JSON.stringify(store.upgrades)),
          hunterIterations: store.hunterIterations
        };
        
        if (!store.hunterStats[props.hunterId]) {
          store.hunterStats[props.hunterId] = {};
        }
        
        for (const [key, value] of Object.entries(props.buildData.overrides)) {
          if (key.includes('.')) {
            const parts = key.split('.');
            
            if (parts[0] === 'upgrades') {
              if (parts.length === 3) {
                const category = parts[1];
                const itemId = parts[2];
                
                if (!store.upgrades[category]) {
                  store.upgrades[category] = {};
                }
                
                store.upgrades[category][itemId] = value;
              }
              else if (parts.length === 4) {
                const category = parts[1];
                const subcategory = parts[2];
                const itemId = parts[3];
                
                if (!store.upgrades[category]) {
                  store.upgrades[category] = {};
                }
                if (!store.upgrades[category][subcategory]) {
                  store.upgrades[category][subcategory] = {};
                }
                
                store.upgrades[category][subcategory][itemId] = value;
              }
            }
          } else {
            store.hunterStats[props.hunterId][key] = value;
          }
        }
      }
      
      totalIterations.value = store.hunterIterations?.[props.hunterId] || 1000;
      
      const evalResult = await evaluateBuildWithWorker(
        props.hunterId, 
        props.buildData, 
        store, 
        (progress) => {
          progressIteration.value = progress.iteration;
        }
      );
      
      results.value = evalResult;
      progressIteration.value = totalIterations.value;
      
      if (!forceEvaluation) {
        await EvaluationCacheService.cacheResult({
          hunterId: props.hunterId,
          buildData: props.buildData,
          hunterStore,
          result: evalResult,
          cacheKey: currentCacheKey.value
        });
      }
      
      if (isReferenceBuild.value && results.value) {
        referenceBuildResults.value = { ...results.value };
        if (typeof referenceUpdateCounter.value === 'number') {
          referenceUpdateCounter.value++;
        }
      }
      
      emit('evaluated', {
        buildId: props.buildId,
        results: results.value,
        isReference: isReferenceBuild.value
      });
      
      return evalResult;
      
    } catch (error) {
      console.error('Error evaluating build:', error);
      hasError.value = true;
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Neuer State für die Hunter-Statistik-Labels
  const hunterStatsLabels = ref([]);

  // Lade die Stats-Labels einmalig
  async function loadHunterStatsLabels() {
    try {
      const hunter = getHunterById(props.hunterId);
      if (!hunter) {
        hunterStatsLabels.value = getDefaultStatsLabels();
        return;
      }
      
      // Dynamischer Import mit dem ES6 import() statt require()
      const module = await hunter.statsModule();
      
      if (module && module.STATS_RESULT_LABELS) {
        hunterStatsLabels.value = module.STATS_RESULT_LABELS;
      } else {
        hunterStatsLabels.value = getDefaultStatsLabels();
      }
    } catch (error) {
      console.error(`Error loading stats labels for hunter ${props.hunterId}:`, error);
      hunterStatsLabels.value = getDefaultStatsLabels();
    }
  }

  // Die synchrone getHunterStatsLabels-Funktion kann entfernt werden

  // Computed property basiert jetzt auf dem lokalen State
  const formattedBuildStats = computed(() => {
    if (!results.value || !results.value.stats || hunterStatsLabels.value.length === 0) return [];
    
    try {
      // Stats-String aus den Ergebnissen in ein Array umwandeln
      const statsValues = results.value.stats.split(',').map(val => parseFloat(val));
      
      // Labels mit Werten kombinieren
      return hunterStatsLabels.value.map((statDef, index) => {
        return {
          ...statDef,
          value: statsValues[index] || 0
        };
      });
    } catch (error) {
      console.error('Error formatting build stats:', error);
      return [];
    }
  });

  
  // Hilfsfunktion für Toasts
  function showToastMessage(message, type = 'success') {
    if (window.toast && typeof window.toast === 'function') {
      window.toast[type](message);
    } else {
      console.log(`Toast message (${type}):`, message);
    }
  }
  
  // Watches für Änderungen einrichten
  function setupWatches() {
    // Watch für Änderungen an den Build-Daten
    watch(
      () => [
        props.buildData.talents, 
        props.buildData.attributes,
        props.buildData.overrides
      ], 
      () => {
        evaluateBuild();
      },
      { deep: true }
    );
    
    // Watch für Änderungen der Level-Property
    watch(
      () => props.buildData.level,
      (newLevel, oldLevel) => {
        if (newLevel !== oldLevel) {
          evaluateBuild();
        }
      }
    );
    
    // Watch für Upgrade-Änderungen
    watch(
      () => hunterStore.upgrades,
      async () => {
        const shouldUpdate = await EvaluationCacheService.shouldUpdateOnUpgradesChange({
          hunterId: props.hunterId,
          buildData: props.buildData,
          hunterStore
        });
        
        if (shouldUpdate) {
          evaluateBuild();
        }
      },
      { deep: true }
    );
    
    // Watch für Iterationen
    watch(
      () => hunterStore.hunterIterations[props.hunterId],
      (newIterations, oldIterations) => {
        if (newIterations > oldIterations) {
          evaluateBuild();
        }
      }
    );
    
    // Überwache Änderungen am Referenz-Counter
    watch(referenceUpdateCounter, () => {
      if (!isReferenceBuild.value && results.value) {
        const tempResults = { ...results.value };
        nextTick(() => {
          results.value = tempResults;
        });
      }
    });
    
    // Überwache Änderungen an isReferenceBuild
    watch(isReferenceBuild, (newValue) => {
      if (newValue && results.value) {
        referenceBuildResults.value = { ...results.value };
        if (typeof referenceUpdateCounter.value === 'number') {
          referenceUpdateCounter.value++;
        }
      }
    });
  }
  
  return {
    // State
    isLoading,
    hasError,
    results,
    resultLabels,
    formattedBuildStats,
    progressIteration,
    totalIterations,
    progressPercent,
    
    // Computed
    isReferenceBuild,
    referenceResults,
    hunterInfo,
    hunterColor,
    
    // Methods
    loadHunterStatsLabels,
    evaluateBuild,
    handleReevaluate,
    loadHunterLabels,
    setupWatches,
    showToastMessage
  };
}