<template>
  <div 
    class="build-compact border-l-4 bg-gray-800 rounded-lg shadow-md mb-3 overflow-hidden transition-all duration-200"
    :class="[
      isReferenceBuild ? 'border-yellow-500' : `border-${hunterColor}-500`,
      { 'opacity-60': buildData.isArchived }
    ]"
  >
    <div class="flex flex-col">
      <!-- Header mit Build-Info -->
      <div class="bg-gray-850/40 p-3 flex items-center border-b border-gray-700/30">
        <!-- Build-Name -->
        <div class="flex-1">
          <div class="flex flex-wrap items-center">
            <h3 class="text-white font-medium truncate mr-2">
              {{ buildData.name || 'Unnamed Build' }}
            </h3>
            <span class="text-xs bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-300 whitespace-nowrap flex-shrink-0">
              Lvl {{ buildData.level }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Inhalt: Statistiken und Ressourcen -->
      <div class="p-3 pb-0">
        <!-- Loading-Zustand -->
        <div v-if="isLoading" class="flex items-center gap-2 mb-3">
          <div class="w-full flex-grow">
            <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full transition-all duration-100"
                :class="`bg-${hunterColor}-500`"
                :style="`width: ${progressPercent}%;`">
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-400 whitespace-nowrap">
            {{ progressIteration }} / {{ totalIterations }}
          </div>
        </div>
        
        <!-- Fehler-Zustand -->
        <div v-else-if="hasError" class="flex items-center justify-between mb-3">
          <div class="flex items-center text-red-400 text-sm">
            <IconAlertCircle size="16" class="mr-1.5" />
            <span>Evaluation error</span>
          </div>
          <button 
            @click="evaluateBuild"
            class="text-sm text-gray-300 hover:text-white underline"
          >
            Try again
          </button>
        </div>
        
        <!-- Ergebnisse -->
        <div v-else-if="results" class="flex flex-col space-y-3">
          <!-- Mobile Layout: Wichtigste Stats in einer Reihe -->
          <div class="grid grid-cols-3 gap-2 mb-3">
            <!-- Loot Score -->
            <div class="stat-box">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="text-xs text-gray-400">{{ resultLabels.lootPerMin || 'Loot' }}</div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.lootPerMin"
                    :class="getDiffClasses(results.lootPerMin, referenceResults.lootPerMin, true, true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon(results.lootPerMin, referenceResults.lootPerMin)" size="10" class="mr-0.5" />
                    <span>{{ getDiffText(results.lootPerMin, referenceResults.lootPerMin) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatNumber(results.lootPerMin) }}</div>
              </div>
            </div>
            
            <!-- Avg Stage -->
            <div class="stat-box">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="text-xs text-gray-400">{{ resultLabels.avgStage || 'Stage' }}</div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.avgStage"
                    :class="getAbsoluteDiffClasses(results.avgStage, referenceResults.avgStage, true, true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon(results.avgStage, referenceResults.avgStage)" size="10" class="mr-0.5" />
                    <span>{{ getAbsoluteDiffText(results.avgStage, referenceResults.avgStage) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatStage(results.avgStage, true) }}</div>
              </div>
            </div>
            
            <!-- Avg Time -->
            <div class="stat-box">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="text-xs text-gray-400">{{ resultLabels.avgTime || 'Time' }}</div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.avgTime"
                    :class="getTimeDiffClasses(results.avgTime, referenceResults.avgTime)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon(referenceResults.avgTime, results.avgTime)" size="10" class="mr-0.5" />
                    <span>{{ getTimeDiffText(results.avgTime, referenceResults.avgTime) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatTime(results.avgTime) }}</div>
              </div>
            </div>
          </div>
          
          <!-- Mobile Layout: XP und Materialien in 2x2 Grid -->
          <div class="grid grid-cols-2 gap-2 mb-3">
            <!-- XP Resource -->
            <div class="resource-box">
              <div class="flex items-center mb-1">
                <IconBrightness size="14" class="mr-1 text-blue-400" />
                <span class="text-xs text-gray-300">{{ resultLabels.xp || 'XP' }}</span>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.xp && results.xp"
                  :class="getDiffClasses(results.xp, referenceResults.xp, true, true)"
                  class="ml-auto text-xs"
                >
                  <component :is="getDiffIcon(results.xp, referenceResults.xp)" size="10" class="mr-0.5" />
                  <span>{{ getDiffText(results.xp, referenceResults.xp) }}</span>
                </span>
              </div>
              <div class="text-blue-300 text-sm font-medium text-center">{{ formatNumber(results.xp) }}</div>
              <div class="text-xs text-gray-500 text-center">
                {{ formatNumber(calculatePerDay(results.xp, results.avgTime)) }}/day
              </div>
            </div>
            
            <!-- Material 1 -->
            <div class="resource-box">
              <div class="flex items-center mb-1">
                <IconDiamond size="14" class="mr-1 text-red-400" />
                <span class="text-xs text-gray-300">{{ resultLabels.mat1 || 'Mat 1' }}</span>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat1 && results.mat1"
                  :class="getDiffClasses(results.mat1, referenceResults.mat1, true, true)"
                  class="ml-auto text-xs"
                >
                  <component :is="getDiffIcon(results.mat1, referenceResults.mat1)" size="10" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat1, referenceResults.mat1) }}</span>
                </span>
              </div>
              <div class="text-red-300 text-sm font-medium text-center">{{ formatNumber(results.mat1) }}</div>
              <div class="text-xs text-gray-500 text-center">
                {{ formatNumber(calculatePerDay(results.mat1, results.avgTime)) }}/day
              </div>
            </div>
            
            <!-- Material 2 -->
            <div class="resource-box">
              <div class="flex items-center mb-1">
                <IconHexagon size="14" class="mr-1 text-orange-400" />
                <span class="text-xs text-gray-300">{{ resultLabels.mat2 || 'Mat 2' }}</span>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat2 && results.mat2"
                  :class="getDiffClasses(results.mat2, referenceResults.mat2, true, true)"
                  class="ml-auto text-xs"
                >
                  <component :is="getDiffIcon(results.mat2, referenceResults.mat2)" size="10" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat2, referenceResults.mat2) }}</span>
                </span>
              </div>
              <div class="text-orange-300 text-sm font-medium text-center">{{ formatNumber(results.mat2) }}</div>
              <div class="text-xs text-gray-500 text-center">
                {{ formatNumber(calculatePerDay(results.mat2, results.avgTime)) }}/day
              </div>
            </div>
            
            <!-- Material 3 -->
            <div class="resource-box">
              <div class="flex items-center mb-1">
                <IconHexagons size="14" class="mr-1 text-amber-400" />
                <span class="text-xs text-gray-300">{{ resultLabels.mat3 || 'Mat 3' }}</span>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat3 && results.mat3"
                  :class="getDiffClasses(results.mat3, referenceResults.mat3, true, true)"
                  class="ml-auto text-xs"
                >
                  <component :is="getDiffIcon(results.mat3, referenceResults.mat3)" size="10" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat3, referenceResults.mat3) }}</span>
                </span>
              </div>
              <div class="text-amber-300 text-sm font-medium text-center">{{ formatNumber(results.mat3) }}</div>
              <div class="text-xs text-gray-500 text-center">
                {{ formatNumber(calculatePerDay(results.mat3, results.avgTime)) }}/day
              </div>
            </div>
          </div>
          
          <!-- Mobile Layout: Boss-Stats in einer Reihe -->
          <div class="flex gap-2 mb-3" v-if="results.bossKillRate !== '--' || results.bossHpPercent !== '--'">
            <!-- Boss Kill Rate -->
            <div class="stat-box flex-1" v-if="results.bossKillRate !== '--'">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="text-xs text-gray-400">{{ resultLabels.bossKillRate || 'Kill Rate' }}</div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.bossKillRate && referenceResults.bossKillRate !== '--'"
                    :class="getBossStatDiffClasses(results.bossKillRate, referenceResults.bossKillRate, true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon(results.bossKillRate, referenceResults.bossKillRate)" size="10" class="mr-0.5" />
                    <span>{{ getBossStatDiffText(results.bossKillRate, referenceResults.bossKillRate) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatPercent(results.bossKillRate) }}</div>
              </div>
            </div>
            
            <!-- Boss HP -->
            <div class="stat-box flex-1" v-if="results.bossHpPercent !== '--'">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="text-xs text-gray-400">{{ resultLabels.bossHpPercent || 'Boss HP' }}</div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.bossHpPercent && referenceResults.bossHpPercent !== '--'"
                    :class="getBossStatDiffClasses((100 - results.bossHpPercent), (100 - referenceResults.bossHpPercent), true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon((100 - results.bossHpPercent), (100 - referenceResults.bossHpPercent))" size="10" class="mr-0.5" />
                    <span>{{ getBossStatDiffText(results.bossHpPercent, referenceResults.bossHpPercent) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatPercent(results.bossHpPercent) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile Action Buttons -->
      <div class="action-buttons p-2 bg-gray-800 border-t border-gray-700/40 flex items-center justify-between mt-2">
        <!-- Linke Buttons -->

          <button 
            @click="emit('edit', buildData)"
            class="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Edit Build"
          >
            <IconEdit size="18" />
          </button>
          <button 
            @click="emit('clone', buildData)"
            class="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Clone Build"
          >
            <IconCopy size="18" />
          </button>
          <button 
            @click="showCodeModal = true"
            class="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Share Build"
          >
            <IconShare size="18" />
          </button>

        
        <!-- Rechte Buttons -->

          <button 
            @click="emit('overridesBuild', buildData)"
            class="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Build Overrides"
          >
            <IconAdjustmentsHorizontal size="18" />
          </button>
          <button 
            v-if="enabledStats.includes('stageDistribution') && results?.stageDistribution?.length"
            @click="showDistributionModal = true"
            class="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Show Stage Distribution"
          >
            <IconChartBar size="18" />
          </button>
          <button 
            @click="emit('archive', buildData)"
            class="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            :title="buildData.isArchived ? 'Restore Build' : 'Archive Build'"
          >
            <component :is="buildData.isArchived ? IconArchiveOff : IconArchive" size="18" />
          </button>
          <button
            @click="emit('delete', buildData)"
            class="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Delete Build"
          >
            <IconTrash size="18" />
          </button>

      </div>
    </div>
    
    <!-- Modals -->
    <BuildCodeModal :show="showCodeModal" :build="buildData" @close="showCodeModal = false" />
    
    <Teleport to="body">
      <div v-if="showDistributionModal && results?.stageDistribution" 
          class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/90 flex items-center justify-center p-2"
          @click.self="showDistributionModal = false">
        <div 
          class="bg-gray-800 rounded-xl shadow-2xl w-full overflow-hidden animate-fade-in border border-gray-700"
          @click.stop
        >
          <!-- Header mit Schließ-Button -->
          <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
            <h2 class="text-lg font-bold text-white flex items-center">
              <IconChartBar size="18" class="mr-2" :class="`text-${hunterColor}-400`" />
              <span class="truncate">{{ buildData.name }}</span>
            </h2>
            <button 
              @click="showDistributionModal = false" 
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="18" class="text-white" />
            </button>
          </div>
          
          <!-- Modal-Inhalt -->
          <div class="p-3">
            <StageDistributionChart 
              :distribution="results.stageDistribution"
              :avg-stage="results.avgStage"
              :max-stage="results.maxStage"
              :min-stage="results.minStage"
              :sample-size="props.totalIterations || totalIterations.value"   
              :color="hunterColor"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, inject, nextTick } from 'vue';
import { 
  IconAlertCircle, IconUser, IconDotsVertical, IconEdit, IconCopy, 
  IconShare, IconRefresh, IconArchive, IconArchiveOff, IconTrash, 
  IconGripVertical, IconAdjustmentsHorizontal, IconChartBar, IconX,
  IconBrightness, IconDiamond, IconHexagon, IconHexagons
} from '@tabler/icons-vue';
import { useRoute } from 'vue-router';
import { useHunterStore } from '../../store/hunterStore';
import { evaluateBuildWithWorker } from '../../services/workerService';
import { getHunterById } from '../../constants/hunters';
import * as EvaluationCacheService from '../../services/evaluationCacheService';
import { 
  formatNumber, formatStage, formatTime, formatPercent, getColorRGB,
  getDiffClasses, getDiffIcon, getDiffText,
  getAbsoluteDiffClasses, getAbsoluteDiffText,
  getTimeDiffClasses, getTimeDiffText,
  getBossStatDiffClasses, getBossStatDiffText,
  calculatePerDay
} from './utils/BuildComparisonUtils';

// Unterkomponenten importieren
import BuildCodeModal from './BuildCodeModal.vue';

// Global evaluation cache and reference build
const evaluationCache = inject('evaluationCache', ref({}));
const referenceBuildId = inject('referenceBuildId', ref(null));
const referenceBuildResults = inject('referenceBuildResults', ref({})); 
const referenceUpdateCounter = inject('referenceUpdateCounter', ref(0));

const actualIterations = computed(() => {
  return props.totalIterations || totalIterations.value || 1000;
});

// Props
const props = defineProps({
  buildId: { type: String, required: true },
  hunterId: { type: String, required: true },
  buildData: { type: Object, required: true },
  autoEvaluate: { type: Boolean, default: true },
  index: { type: Number, default: -1 },
  isReferenceBuild: { type: Boolean, default: false },
  referenceResults: { type: Object, default: () => ({}) },
  results: { type: Object, default: null },
  isLoading: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false },
  progressIteration: { type: Number, default: 0 },
  totalIterations: { type: Number, default: 1000 },
  resultLabels: { type: Object, default: () => ({}) }
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
const resultLabels = ref({});
const currentCacheKey = ref(null);
const showCodeModal = ref(false);
const showDeleteConfirm = ref(false);

// Refs
const menuContainer = ref(null);
const showMenu = ref(false);
const showDistributionModal = ref(false);

// Toggle Menu mit Klick-außerhalb-Schließen
function toggleMenu() {
  showMenu.value = !showMenu.value;
}

// Display settings
const displaySettings = inject('displaySettings', ref({ 
  displayMode: 'compact',
  enabledStats: ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'],
  chartStyle: 'bar'
}));

// Verfügbare Statistiken basierend auf den Anzeigeeinstellungen
const enabledStats = computed(() => {
  return displaySettings.value?.enabledStats || ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'];
});

// Fortschritts-Tracking-Variablen
const progressIteration = ref(0);
const totalIterations = ref(1000);
const progressPercent = computed(() => {
  const percent = Math.round((progressIteration.value / totalIterations.value) * 100);
  return Math.min(99, percent);
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

// Erstelle eine kompakte Version der Stages-Distribution (max 15 Balken)
function getCompactDistribution(distribution) {
  if (!distribution || !distribution.length) return [];
  
  // Wenn wenige Einträge vorhanden sind, direkt zurückgeben
  if (distribution.length <= 15) return distribution;
  
  // Sonst kombinieren wir benachbarte Stages
  const factor = Math.ceil(distribution.length / 15);
  const result = [];
  
  for (let i = 0; i < distribution.length; i += factor) {
    const chunk = distribution.slice(i, i + factor);
    
    // Berechne Durchschnittswerte für diesen Chunk
    const avgStage = chunk.reduce((sum, item) => sum + item.stage, 0) / chunk.length;
    const totalCount = chunk.reduce((sum, item) => sum + item.count, 0);
    const avgPercentage = chunk.reduce((sum, item) => sum + item.percentage, 0) / chunk.length;
    
    result.push({
      stage: Math.round(avgStage),
      count: totalCount,
      percentage: avgPercentage
    });
  }
  
  return result;
}

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

// Weiterleitung des nameChanged Events
function handleNameChanged(newName) {
  emit('nameChanged', { buildId: props.buildId, name: newName });
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

// Bestätigung vor dem Löschen
function confirmDelete() {
  emit('delete', props.buildData);
}

// Schließe das Dropdown-Menü, wenn außerhalb geklickt wird
function handleClickOutside(event) {
  if (showMenu.value && menuContainer.value && !menuContainer.value.contains(event.target)) {
    showMenu.value = false;
  }
}

// Hilfsfunktion für Toasts
function showToastMessage(message, type = 'success') {
  if (window.toast && typeof window.toast === 'function') {
    window.toast[type](message);
  } else {
    console.log(`Toast message (${type}):`, message);
  }
}

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

// Lebenszyklusmethoden
onMounted(async () => {
  await loadHunterLabels();
  document.addEventListener('click', handleClickOutside);
  
  if (props.autoEvaluate && !props.results) {
    setTimeout(() => {
      evaluateBuild();
    }, props.index * 100); 
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.build-compact {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
}

.stat-box {
  min-width: 0;
  padding: 0.5rem;
  background-color: rgb(18, 26, 48);
  border-radius: 0.5rem;
}

.resource-box {
  min-width: 0;
  padding: 0.5rem;
  background-color: rgb(18, 26, 48);
  border-radius: 0.5rem;
}

@media (max-width: 640px) {
  .action-buttons button {
    padding: 0.5rem;
  }
  
  .stat-box, .resource-box {
    padding: 0.375rem;
  }
}
</style>