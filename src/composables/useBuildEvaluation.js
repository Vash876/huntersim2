// src/composables/useBuildEvaluation.js
import { ref, computed, watch, inject, nextTick } from 'vue';
import { useHunterStore } from '../store/hunterStore';
import { useGemPlannerStore } from '../store/gemPlannerStore';
import { evaluateBuildWithWorker } from '../services/workerService';
import { getHunterById } from '../constants/hunters';
import { GEM_UPGRADE_MAPPING } from '../constants/gemUpgradeMappings';
import * as EvaluationCacheService from '../services/evaluationCacheService';

/**
 * Konvertiert gemPlannerStore-Daten in das upgrades.gems_nodes Format
 * @param {Object} gemStates - Die gemStates aus dem gemPlannerStore
 * @param {Object} upgrades - Das upgrades-Objekt wo die konvertierten Daten eingefügt werden
 */
function convertGemStatesToUpgrades(gemStates, upgrades) {
  if (!gemStates) return;
  
  // Stelle sicher dass gems_nodes existiert und leere es komplett
  upgrades.gems_nodes = {};
  
  // Konvertiere alle Gem-Daten
  Object.entries(gemStates).forEach(([gemId, gemState]) => {
    if (!gemState) return;
    
    // Konvertiere Gem Level
    if (gemState.level > 0) {
      upgrades.gems_nodes[`${gemId}_level`] = gemState.level;
    } else {
      upgrades.gems_nodes[`${gemId}_level`] = 0;
    }
    
    // Konvertiere Gem Nodes (boolean array zu gem1, gem2, gem3)
    if (Array.isArray(gemState.nodes)) {
      gemState.nodes.forEach((hasNode, index) => {
        upgrades.gems_nodes[`${gemId}_gem${index + 1}`] = hasNode ? 1 : 0;
      });
    }
    
    // Konvertiere Gem Upgrades
    if (gemState.upgrades) {
      Object.entries(gemState.upgrades).forEach(([upgradeId, level]) => {
        const mappedKey = GEM_UPGRADE_MAPPING[upgradeId];
        if (mappedKey) {
          upgrades.gems_nodes[mappedKey] = level;
        } else {
          upgrades.gems_nodes[`${gemId}_${upgradeId}`] = level;
        }
      });
    }
  });
}

export function useBuildEvaluation(props, emit) {
  const hunterStore = useHunterStore();
  const gemPlannerStore = useGemPlannerStore();
  
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
  const selectedCategoryId = inject('selectedCategoryId', ref(null)); // Current visible category
  
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
    evaluateBuild(true);
      
    // Zeige eine Bestätigung an
    showToastMessage(`Build "${props.buildData.name || 'unnamed'}" re-evaluated`);
    
    // Emittiere reevaluate-Event
    emit('reevaluate', props.buildId);
  }
  
  // Hauptfunktion: Build evaluieren mit Cache-Unterstützung
  async function evaluateBuild(forceEvaluation = false) {
    await loadHunterStatsLabels();
    if (isLoading.value && progressIteration.value > 0) {
      return null;
    }
    
    // Debug-Log für Evaluation-Tracking
    const categoryId = hunterStore.getBuildCategory(props.hunterId, props.buildId);
    const categories = hunterStore.getCategories(props.hunterId);
    const category = categories?.find(c => c.id === categoryId);
    const categoryName = category?.name || categoryId || 'UNKNOWN';
    const buildName = props.buildData?.name || 'Unnamed Build';
    
    // GUARD: Nur evaluieren wenn der Build zur aktuell sichtbaren Kategorie gehört
    // ODER wenn forceEvaluation = true (manuelles Re-Evaluate)
    if (!forceEvaluation && selectedCategoryId.value && categoryId !== selectedCategoryId.value) {
      console.log(`⏸️  [EVAL SKIPPED][${categoryName}][${props.hunterId.toUpperCase()}] "${buildName}" - nicht in sichtbarer Kategorie (${selectedCategoryId.value})`);
      return null;
    }
    
    console.log(`🎯 [EVAL][${categoryName}][${props.hunterId.toUpperCase()}] "${buildName}" wird evaluiert`);
    
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
          hunterStore,
          gemPlannerStore
        });
        
        shouldEvaluate = cacheResult.shouldEvaluate;
        cachedResult = cacheResult.cachedResult;
        cacheKey = cacheResult.cacheKey;
        
        console.log(`[EVAL] 📦 Cache check - shouldEvaluate: ${shouldEvaluate}, hasCachedResult: ${!!cachedResult}, cacheKey: ${cacheKey}`);
        
        currentCacheKey.value = cacheKey;
      } else {
        const newCacheKey = await EvaluationCacheService.generateCacheKey({
          hunterId: props.hunterId,
          buildData: props.buildData,
          hunterStore,
          gemPlannerStore
        });
        currentCacheKey.value = newCacheKey;
        shouldEvaluate = true;
      }
      
      if (!shouldEvaluate && !forceEvaluation && cachedResult) {
        console.log(`[EVAL] 📦 Using cached result - skipping evaluation`);
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
      
      // Debug-Logging für gemPlannerStore vor der Übertragung
      console.log('🔧 [GemData] Store initialization check:');
      console.log('  -> GemStates found:', Object.keys(gemPlannerStore.gemStates || {}).length, 'gems');
      
      // Sicherstellen, dass der Store initialisiert ist
      if (gemPlannerStore.init && typeof gemPlannerStore.init === 'function') {
        gemPlannerStore.init();
        console.log('🔧 [GemData] After init - GemStates:', Object.keys(gemPlannerStore.gemStates || {}).length, 'gems');
      }
      
      let store = {
        hunterStats: { ...hunterStore.hunterStats },
        upgrades: { ...hunterStore.upgrades },
        hunterIterations: hunterStore.hunterIterations,
        hunterSeedSettings: hunterStore.hunterSeedSettings,
        gemPlannerStore: {
          gameStats: gemPlannerStore.gameStats?.value || {},
          weights: gemPlannerStore.weights?.value || {},
          gemStates: JSON.parse(JSON.stringify(gemPlannerStore.gemStates || {})),  // Proxy zu normalem Objekt konvertieren
          currentStats: gemPlannerStore.currentStats?.value || {}
        }
      };
      
      // Konvertiere gemPlannerStore-Daten in das upgrades.gems_nodes Format
      convertGemStatesToUpgrades(store.gemPlannerStore.gemStates, store.upgrades);
      
      // Hole effektive Overrides (Category + Build Overrides merged)
      const effectiveOverrides = hunterStore.getEffectiveBuildOverrides(props.hunterId, props.buildId);
      
      if (effectiveOverrides && Object.keys(effectiveOverrides).length > 0) {
        console.log('🔧 [Override] Applying effective overrides (category + build), filtering old gem data');
        
        store = {
          hunterStats: JSON.parse(JSON.stringify(store.hunterStats)),
          upgrades: JSON.parse(JSON.stringify(store.upgrades)),
          hunterIterations: store.hunterIterations,
          hunterSeedSettings: hunterStore.hunterSeedSettings,
          gemPlannerStore: {
            gameStats: gemPlannerStore.gameStats?.value || {},
            weights: gemPlannerStore.weights?.value || {},
            gemStates: JSON.parse(JSON.stringify(gemPlannerStore.gemStates || {})),
            currentStats: gemPlannerStore.currentStats?.value || {}
          }
        };
        
        if (!store.hunterStats[props.hunterId]) {
          store.hunterStats[props.hunterId] = {};
        }
        
        for (const [key, value] of Object.entries(effectiveOverrides)) {
          // Filtere alte Gem-Overrides heraus
          if (key.includes('gems_nodes') && (
            key.includes('temporal_') || 
            key.includes('innovation_') || 
            key.includes('power_') || 
            key.includes('evolution_') ||
            key.includes('exodus') ||
            key.includes('_gem') && !key.match(/^upgrades\.gems_nodes\.(creation|attraction|innovation)_gem[1-6]$/)
          )) {
            console.log('🚫 [Override] Skipping old gem override:', key);
            continue;
          }
          
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
        
        console.log('🔧 [Override] All overrides applied successfully');
      }
      
      totalIterations.value = store.hunterIterations?.[props.hunterId] || 1000;
      
      // Debug-Log für den aktuellen Seed-Modus
      const useSeeded = hunterStore.getHunterSeedSetting(props.hunterId);
      console.log(`Evaluating build ${props.buildData.name || 'unnamed'} with seed mode: ${useSeeded ? 'Seeded' : 'Random'}`);
      
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
          gemPlannerStore,
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

  
  // Watch für gem-Änderungen - triggert automatische Re-Evaluation
  watch(
    () => gemPlannerStore.gemStates,
    (newGemStates, oldGemStates) => {
      // Nur evaluieren wenn es sich um echte Änderungen handelt
      if (oldGemStates && JSON.stringify(newGemStates) !== JSON.stringify(oldGemStates)) {
        console.log('🔄 [GemData] Gem changes detected - triggering re-evaluation');
        evaluateBuild(true); // Force re-evaluation
      }
    },
    { 
      deep: true,
      immediate: false  // Nicht bei der ersten Initialisierung
    }
  );

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
    // Watch für Build-Daten Änderungen
    watch(
      () => [
        props.buildData.talents, 
        props.buildData.attributes,
        props.buildData.overrides // Build-spezifische Overrides
      ], 
      () => {
        console.log('[EVAL] 🔧 Build data changed - triggering evaluation');
        evaluateBuild();
      },
      { deep: true }
    );
    
    // Watch für Category-Overrides Änderungen
    // Nutze den categoryOverrideUpdateCounter als Trigger
    watch(
      () => hunterStore.categoryOverrideUpdateCounter,
      () => {
        // Prüfe ob dieser Build zu einer Kategorie gehört
        const categoryId = hunterStore.getBuildCategory(props.hunterId, props.buildId);
        if (!categoryId) return;
        
        // GUARD: Nur evaluieren wenn der Build zur aktuell sichtbaren Kategorie gehört
        if (selectedCategoryId.value && categoryId !== selectedCategoryId.value) {
          console.log('[EVAL] 🔧 CATEGORY OVERRIDE WATCH SKIPPED - Build nicht in sichtbarer Kategorie');
          return;
        }
        
        // IMMER evaluieren wenn Counter sich ändert
        // (auch beim Reset der Overrides, um gecachte Werte mit Overrides zu entfernen)
        console.log('[EVAL] 🔧 CATEGORY OVERRIDES CHANGED (via counter) - TRIGGERING EVALUATION');
        evaluateBuild();
      }
    );
    
    // Watch für Änderungen der Level-Property
    watch(
      () => props.buildData.level,
      (newLevel, oldLevel) => {
        if (newLevel !== oldLevel) {
          console.log('[EVAL] 🔧 Level changed - triggering evaluation');
          evaluateBuild();
        }
      }
    );
    
    // Watch für Upgrade-Änderungen
    watch(
      () => hunterStore.upgrades,
      async (newUpgrades, oldUpgrades) => {
        console.log('[EVAL] 🔧 UPGRADE WATCH TRIGGERED for hunter:', props.buildData?.hunterId);
        
        if (!props.buildData?.hunterId) {
          console.warn('[EVAL] 🔧 No hunterId in buildData!');
          return;
        }
        
        // GUARD: Nur evaluieren wenn der Build zur aktuell sichtbaren Kategorie gehört
        const buildCategoryId = hunterStore.getBuildCategory(props.hunterId, props.buildId);
        if (selectedCategoryId.value && buildCategoryId !== selectedCategoryId.value) {
          console.log('[EVAL] 🔧 UPGRADE WATCH SKIPPED - Build nicht in sichtbarer Kategorie');
          return;
        }
        
        try {
          const needsUpdate = await EvaluationCacheService.shouldUpdateOnUpgradesChange(
            props.buildData.hunterId,
            oldUpgrades, // OLD values first
            newUpgrades, // NEW values second
            hunterStore
          );
          
          console.log('[EVAL] 🔧 shouldUpdateOnUpgradesChange result:', needsUpdate);
          
          if (needsUpdate) {
            console.log('[EVAL] 🔧 UPGRADE CHANGE DETECTED - TRIGGERING EVALUATION');
            evaluateBuild();
          } else {
            console.log('[EVAL] 🔧 No relevant upgrade changes detected');
          }
        } catch (error) {
          console.error('[EVAL] 🔧 Error in upgrade change detection:', error);
          evaluateBuild();
        }
      },
      { deep: true }
    );

    // Watch für Gem-Änderungen
    watch(
      () => gemPlannerStore.gemStates,
      async (newGemStates, oldGemStates) => {
        console.log('[EVAL] 💎 GEM WATCH TRIGGERED for hunter:', props.buildData?.hunterId);
        
        if (!props.buildData?.hunterId) {
          console.warn('[EVAL] 💎 No hunterId in buildData!');
          return;
        }
        
        // GUARD: Nur evaluieren wenn der Build zur aktuell sichtbaren Kategorie gehört
        const buildCategoryId = hunterStore.getBuildCategory(props.hunterId, props.buildId);
        if (selectedCategoryId.value && buildCategoryId !== selectedCategoryId.value) {
          console.log('[EVAL] 💎 GEM WATCH SKIPPED - Build nicht in sichtbarer Kategorie');
          return;
        }
        
        try {
          const needsUpdate = await EvaluationCacheService.shouldUpdateOnGemChange(
            props.buildData.hunterId,
            oldGemStates, // OLD states first
            newGemStates, // NEW states second
            hunterStore
          );
          
          console.log('[EVAL] 💎 shouldUpdateOnGemChange result:', needsUpdate);
          
          if (needsUpdate) {
            console.log('[EVAL] 💎 GEM CHANGE DETECTED - TRIGGERING EVALUATION');
            evaluateBuild();
          } else {
            console.log('[EVAL] 💎 No relevant gem changes detected');
          }
        } catch (error) {
          console.error('[EVAL] 💎 Error in gem change detection:', error);
          evaluateBuild();
        }
      },
      { deep: true } // NO immediate: true - only trigger on actual changes!
    );
    
    // Watch für Iterationen
    watch(
      () => hunterStore.hunterIterations[props.hunterId],
      (newIterations, oldIterations) => {
        if (newIterations > oldIterations) {
          console.log('[EVAL] 🔧 Iterations increased - triggering evaluation');
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

    // Watch für Änderungen an der Seed-Einstellung
    watch(
      () => hunterStore.getHunterSeedSetting(props.hunterId),
      (newSeedSetting, oldSeedSetting) => {
        if (newSeedSetting !== oldSeedSetting) {
          console.log(`Seed setting changed for ${props.hunterId}: ${oldSeedSetting} -> ${newSeedSetting}`);
          
          // Prüfe, ob eine Neuevaluierung erforderlich ist
          const needsReEvaluation = EvaluationCacheService.handleSeedSettingChange(
            props.hunterId, 
            props.buildData, 
            oldSeedSetting, 
            newSeedSetting
          );
          
          if (needsReEvaluation) {
            console.log(`Re-evaluation needed after seed mode change to ${newSeedSetting ? 'seeded' : 'random'}`);
            evaluateBuild(true); // Force re-evaluation
          } else {
            console.log(`No re-evaluation needed after seed mode change to ${newSeedSetting ? 'seeded' : 'random'}`);
            evaluateBuild(false); // Nicht forcieren, erst Cache prüfen
          }
        }
      }
    );
  }

  // Import der Evaluierungsfunktionalität
  async function evaluateBuildWithParams(buildParams) {
    try {
      // Store-Daten vorbereiten (genau wie in evaluateBuild)
      const store = {
        hunterStats: { ...hunterStore.hunterStats },
        upgrades: { ...hunterStore.upgrades },
        hunterIterations: hunterStore.hunterIterations,
        hunterSeedSettings: hunterStore.hunterSeedSettings,
        gemPlannerStore: {
          gameStats: gemPlannerStore.gameStats?.value || {},
          weights: gemPlannerStore.weights?.value || {},
          gemStates: JSON.parse(JSON.stringify(gemPlannerStore.gemStates || {})),
          currentStats: gemPlannerStore.currentStats?.value || {}
        }
      };
      
      // Konvertiere gemPlannerStore-Daten in das upgrades.gems_nodes Format
      convertGemStatesToUpgrades(store.gemPlannerStore.gemStates, store.upgrades);
      
      // Debug-Log für den aktuellen Seed-Modus
      const useSeeded = hunterStore.getHunterSeedSetting(props.hunterId);
      console.log(`Evaluating build params with seed mode: ${useSeeded ? 'Seeded' : 'Random'}`);
      
      // Hole effektive Overrides (Category + Build Overrides merged)
      // Wenn buildParams eine ID hat, verwende getEffectiveBuildOverrides
      // Sonst fallback auf buildParams.overrides (z.B. bei Upgrade Comparison)
      const effectiveOverrides = buildParams.id 
        ? hunterStore.getEffectiveBuildOverrides(props.hunterId, buildParams.id)
        : (buildParams.overrides || {});
      
      // Wenn die Build-Parameter Overrides enthalten, diese anwenden
      if (effectiveOverrides && Object.keys(effectiveOverrides).length > 0) {
        // Deep-Copy erstellen
        const storeWithOverrides = {
          hunterStats: JSON.parse(JSON.stringify(store.hunterStats)),
          upgrades: JSON.parse(JSON.stringify(store.upgrades)),
          hunterIterations: store.hunterIterations,
          hunterSeedSettings: hunterStore.hunterSeedSettings,
          gemPlannerStore: {
            gameStats: gemPlannerStore.gameStats?.value || {},
            weights: gemPlannerStore.weights?.value || {},
            gemStates: JSON.parse(JSON.stringify(gemPlannerStore.gemStates || {})),
            currentStats: gemPlannerStore.currentStats?.value || {}
          }
        };
        
        // Sicherstellen, dass der Hunter-Stats-Eintrag existiert
        if (!storeWithOverrides.hunterStats[props.hunterId]) {
          storeWithOverrides.hunterStats[props.hunterId] = {};
        }
        
        // Alle effektiven Overrides auf den Store anwenden
        for (const [key, value] of Object.entries(effectiveOverrides)) {
          if (key.includes('.')) {
            const parts = key.split('.');
            
            if (parts[0] === 'upgrades') {
              if (parts.length === 3) {
                const category = parts[1];
                const itemId = parts[2];
                
                if (!storeWithOverrides.upgrades[category]) {
                  storeWithOverrides.upgrades[category] = {};
                }
                
                storeWithOverrides.upgrades[category][itemId] = value;
              }
              else if (parts.length === 4) {
                const category = parts[1];
                const subcategory = parts[2];
                const itemId = parts[3];
                
                if (!storeWithOverrides.upgrades[category]) {
                  storeWithOverrides.upgrades[category] = {};
                }
                if (!storeWithOverrides.upgrades[category][subcategory]) {
                  storeWithOverrides.upgrades[category][subcategory] = {};
                }
                
                storeWithOverrides.upgrades[category][subcategory][itemId] = value;
              }
            }
          } else {
            storeWithOverrides.hunterStats[props.hunterId][key] = value;
          }
        }
        
        // Evaluiere den Build mit den angewendeten Overrides
        return await evaluateBuildWithWorker(
          props.hunterId, 
          buildParams, 
          storeWithOverrides, 
          (progress) => {
            // Optional: Fortschrittsanzeige für große Iterationszahlen
            // progressIteration.value = progress.iteration;
          }
        );
      } else {
        // Wenn keine Overrides vorhanden sind, einfach den Build evaluieren
        return await evaluateBuildWithWorker(
          props.hunterId, 
          buildParams, 
          store, 
          null
        );
      }
    } catch (error) {
      console.error('Error in build evaluation:', error);
      throw error;
    }
  }
  
// UI State
const loadError = ref(null);
const selectedCurrency = ref('');
const isEvaluating = ref(false);

// Szenarien (3 mögliche Upgrade-Pfade)
const comparisonResults = ref([]);
const scenarioCosts = ref([0, 0, 0]);

// Vereinfachte compareScenarios-Funktion ohne überflüssige Fortschrittsvariablen
async function compareScenarios(scenarioIncrementsData, getGlobalValueFn, calculateScenarioCostFn) {
  isEvaluating.value = true;
  comparisonResults.value = [];
  scenarioCosts.value = [0, 0, 0];
  
  try {
    // Basisbuild-Daten
    const baseBuild = JSON.parse(JSON.stringify(props.buildData));
    const validScenarios = [];
    const tempResults = [];
    
    // Zähle die gültigen Szenarien
    for (let i = 0; i < 3; i++) {
      if (Object.values(scenarioIncrementsData[i]).every(val => val === 0)) continue;
      validScenarios.push(i);
    }
    
    if (validScenarios.length === 0) {
      isEvaluating.value = false;
      return;
    }
    
    // Erstelle Promises für alle gültigen Szenarien
    const evaluationPromises = validScenarios.map(i => {
      const modifiedBuild = JSON.parse(JSON.stringify(baseBuild));
      modifiedBuild.overrides = modifiedBuild.overrides || {};
      
      Object.entries(scenarioIncrementsData[i]).forEach(([key, increment]) => {
        if (increment <= 0) return;
        const baseValue = getGlobalValueFn(key);
        modifiedBuild.overrides[key] = baseValue + increment;
      });
      
      return evaluateBuildWithParams(modifiedBuild).then(evalResult => {
        tempResults[i] = { ...evalResult, index: i };
        scenarioCosts.value[i] = calculateScenarioCostFn(i);
        return i;
      });
    });
    
    // Alle Evaluierungen parallel ausführen und auf Abschluss warten
    if (evaluationPromises.length > 0) {
      await Promise.all(evaluationPromises);
      
      // Null-Einträge entfernen und das Ergebnisarray kompakt halten
      comparisonResults.value = tempResults.filter(Boolean);
    }
  } catch (error) {
    console.error('Error comparing scenarios:', error);
  } finally {
    isEvaluating.value = false;
  }
}

  function getCurrentResults() {
    return results.value;
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
    isEvaluating,
    comparisonResults,
    scenarioCosts,
    
    // Computed
    isReferenceBuild,
    referenceResults,
    hunterInfo,
    hunterColor,
    
    // Methods
    loadHunterStatsLabels,
    loadHunterLabels,
    evaluateBuild,
    handleReevaluate,
    setupWatches,
    evaluateBuildWithParams,
    compareScenarios,
    getCurrentResults,
  };
}