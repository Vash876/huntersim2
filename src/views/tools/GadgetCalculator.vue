<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8 border border-gray-800/80">
      <!-- Überschrift -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white">
        <span>Gadget Planner</span>
      </h2>
      
      <!-- Tessarect Rate Settings -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <img src="@/assets/knox/loot_mat3.png" class="w-7 h-7 mr-2" alt="Hellish Biomatter" />
            Tesseract Production
          </h3>
          
          <div class="flex items-center gap-2">            
            <button 
              @click="resetAllLevels" 
              class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconRefresh size="14" class="mr-1" />
              Reset
            </button>
          </div>
        </div>
        
        <div class="p-2 sm:p-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Reference Build -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Reference Build</div>
              <div class="text-xs text-gray-400 mb-2">Select Borge Build</div>
              
              <select 
                v-model="selectedBuildId" 
                @change="updateFromSelectedBuild"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a build...</option>
                <option v-for="build in knoxBuilds" :key="build.id" :value="build.id">
                  {{ build.name }}
                </option>
              </select>
            </div>

            <!-- Current Tesseracts -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Current Tesseracts</div>
                <div class="text-xs text-gray-400 mb-2">Amount you have saved</div>
              
              <SuffixInput
                v-model="currentTesseracts"
                placeholder="0"
                class="w-full text-sm bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>     
            
            <!-- Daily Tessarect Rate -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Tesseracts per Day</div>
              <div class="text-xs text-gray-400 mb-2">Calculated from Build</div>

              <div class="flex items-center bg-gray-800/80 py-2 px-3 rounded-lg border border-gray-700">
                <div class="text-amber-400 text-base font-bold">{{ formatGadgetCost(tessarectsPerDay) }}</div>
                <div v-if="!selectedBuild" class="ml-2 text-gray-400 text-xs">
                  (select a build)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Summary Box (total cost, days) -->
      <div class="bg-gray-800/80 rounded-xl border border-gray-700/60 overflow-hidden mb-4">
        <div class="header p-3 flex items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconChartDots size="18" class="mr-2 text-green-400" />
            Summary
          </h3>
        </div>
        
        <div class="p-2 sm:p-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-gray-900/80 rounded-lg p-3 border border-gray-700/60">
              <div class="text-gray-400 text-xs mb-0.5">Total Tesseracts Cost</div>
              <div class="text-amber-400 font-bold text-lg">{{ formatGadgetCost(totalCost) }}</div>
            </div>
            
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="text-gray-400 text-xs mb-0.5">Time to Save</div>
              <div 
                :class="{
                  'text-white': daysToSave < 30, 
                  'text-yellow-400': daysToSave >= 30 && daysToSave < 60, 
                  'text-red-400': daysToSave >= 60
                }" 
                class="font-bold text-lg"
              >
                {{ formatTimeToSave(daysToSave) }}
              </div>
            </div>
            
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="text-gray-400 text-xs mb-0.5">Planned Upgrades</div>
              <div class="text-white text-lg">
                <span class="text-blue-400 font-bold">{{ activeLevelCount }}</span>
                <span class="text-gray-500 mx-1">/</span>
                <span>{{ totalGadgets }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Gadget List -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-8">
        <div class="header p-4 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconSettings size="20" class="mr-2 text-cyan-400" />
            Gadget Upgrades
          </h3>
          <!-- Summary Button  -->
          <button 
            @click="showSummaryModal = true"
            class="bg-purple-700 hover:bg-purple-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Generate-Summary--Streamline-Outlined-Expansion" height="16" width="16">
              <desc>
                Generate Summary Streamline Icon: https://streamlinehq.com
              </desc>
              <g id="generate-summary">
                <path id="Union" fill="#FFFFFF" fill-rule="evenodd" d="M5 11V4H3v7c0 3.866 3.13401 7 7 7h7.293L16 19.293l1.4142 1.4142 3.7071 -3.7071 -3.7071 -3.7071L16 14.7072 17.2928 16H10c-2.76142 0 -5 -2.2386 -5 -5Zm3 -5h13V4H8v2Zm7 5H8V9h7v2Z" clip-rule="evenodd" stroke-width="1"></path>
              </g>
            </svg>
            <span class="ml-1">Summary</span>
          </button>
        </div>
        
        <div class="p-2 sm:p-6">
          <!-- Loading state -->
          <div v-if="isLoading" class="p-4 flex flex-col items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
            <p class="text-gray-400 text-sm">Loading gadget data...</p>
          </div>

          <!-- Error state -->
          <div v-else-if="loadError" class="p-4 text-center">
            <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
            <p class="text-red-400 text-sm">{{ loadError }}</p>
            <button 
              @click="loadGadgetData" 
              class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
            >
              Retry
            </button>
          </div>
          
          <!-- Gadget List -->
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="gadget in GADGETS"
              :key="gadget.id"
              class="gadget-card rounded-xl border border-gray-700 bg-gray-800/90 pb-2 p-4 transition-colors hover:border-cyan-600 relative overflow-hidden mb-1"
              :class="{ 'active-gadget': hasLevelChanges(gadget.id) }"
            >
              <!-- Hintergrundbild - GEFIXT mit dynamischem Import -->
              <img 
                v-if="getGadgetImageUrl(gadget.id)"
                :src="getGadgetImageUrl(gadget.id)"
                :alt="`Gadget ${getGadgetImageNumber(gadget.id)}`"
                class="absolute top-2 right-2 w-16 h-16 object-contain opacity-80 pointer-events-none z-0"
                style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
              />
              
              <!-- Content Overlay -->
              <div class="relative z-10 gadget-content">
                <!-- Gadget Header -->
                <div class="flex flex-wrap justify-between items-center mb-2">
                  <div class="flex-grow">
                    <span class="text-base text-white font-medium gadget-title">
                      <span class="hidden sm:inline">
                        {{ gadget.label.length > 40 ? gadget.label.substring(0, 31) + '...' : gadget.label }}
                      </span>
                      <span class="inline sm:hidden">
                        {{ gadget.label.length > 28 ? gadget.label.substring(0, 25) + '...' : gadget.label }}
                      </span>
                    </span>
                    
                    <!-- Anchor Evaluation Button -->
                    <div v-if="gadget.id === 'anchor' && targetLevels.anchor > (currentLevels.anchor || 0)" class="mt-1">
                      <button 
                        v-if="!anchorEvaluationEnabled"
                        @click="triggerAnchorEvaluation"
                        :disabled="evaluatingAnchor"
                        class="text-xs bg-blue-800 hover:bg-blue-600 disabled:bg-gray-600 text-white px-2 py-1 rounded-md transition-colors flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-3 h-3 mr-1">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Evaluate for exact time
                        <InfoTooltip 
                          content="Click to get more accurate time (may take a while)"
                          placement="top"
                          class="ml-1"
                        />
                      </button>
                      <div v-else class="text-xs text-purple-300">
                        Using evaluation results
                      </div>
                    </div>
                  </div>
                  <div v-if="getGadgetCost(gadget.id) > 0" class="flex flex-col items-end gap-1">
                    <!-- Cost Badge -->
                    <div class="text-amber-400 text-xs font-bold bg-gray-900/90 px-2 py-0.5 rounded-lg border border-amber-700/40">
                      {{ formatGadgetCost(getGadgetCost(gadget.id)) }}
                    </div>
                    <!-- Time Badge -->
                    <div class="text-xs px-2 py-0.5 rounded-lg bg-blue-900/80 text-blue-200 font-bold border border-blue-700/40 flex items-center">
                      <span v-if="gadget.id === 'anchor' && evaluatingAnchor" class="animate-spin w-3 h-3 border border-blue-300 border-t-transparent rounded-full mr-1"></span>
                      {{ gadget.id === 'anchor' ? getAnchorTimeDisplay() : formatIndividualSaveTime(gadget.id) }}
                    </div>
                  </div>
                </div>

                <!-- Level Controls -->
                <div class="grid grid-cols-2 gap-2 mb-2">
                  <!-- Current Level Controls -->
                  <div class="gadget-controls">
                    <div class="text-[11px] text-gray-400 mb-1 uppercase font-semibold tracking-wide">Current</div>
                    <ToolValueControls
                      :value="currentLevels[gadget.id] || 0"
                      :maxValue="999"
                      :minValue="0"
                      :step="1"
                      :fastStep="10"
                      :showFastControls="true"
                      @update:value="(newVal) => updateCurrentLevel(gadget.id, newVal)"
                      :tabIndex="getTabIndexForCurrentLevel(gadget.id)"
                      :autoEdit="true"
                      class="mx-auto gadget-control-enhanced"
                    />
                  </div>
                  
                  <!-- Target Level Controls -->
                  <div class="gadget-controls">
                    <div class="text-[11px] text-gray-400 mb-1 uppercase font-semibold tracking-wide">Target</div>
                    <ToolValueControls
                      :value="targetLevels[gadget.id] || 0"
                      :maxValue="999"
                      :minValue="0"  
                      :step="1"
                      :fastStep="10"
                      :showFastControls="true"
                      :validateOnFinalOnly="true"
                      @update:value="(newVal) => updateTargetLevel(gadget.id, newVal)"
                      @finalize:value="(newVal) => finalizeTargetLevel(gadget.id, newVal)"
                      :valueClass="hasLevelChanges(gadget.id) ? 'text-green-400' : 'text-white'"
                      :tabIndex="getTabIndexForTargetLevel(gadget.id)"
                      :autoEdit="true"
                      :disableDecrement="targetLevels[gadget.id] <= (currentLevels[gadget.id] || 0)"
                      class="mx-auto gadget-control-enhanced"
                    />
                  </div>
                </div>
                
                <!-- Multiplier Information -->
                <div v-if="showMultipliers" class="gadget-multipliers rounded-xl p-3 border border-gray-700 bg-gray-900/80 mt-1">
                  <div class="space-y-1">
                    <div v-for="(boost, index) in gadget.boost" :key="`${gadget.id}-boost-${index}`">
                      <!-- Current Multiplier -->
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-300 font-medium">{{ boost.description }}:</span>
                        <span class="text-xs font-bold text-white">
                          {{ formatMultiplier(calculateMultiplier(gadget, currentLevels[gadget.id] || 0, boost.type), false, gadget.id) }}
                        </span>
                      </div>

                      <!-- Target Multiplier (if different from current) -->
                      <div v-if="hasLevelChanges(gadget.id)" class="flex justify-between mt-0.5">
                        <span class="text-xs text-gray-400 font-medium">Target:</span>
                        <span class="text-xs font-bold text-green-400">
                          {{ formatMultiplier(calculateMultiplier(gadget, targetLevels[gadget.id] || 0, boost.type), false, gadget.id) }}
                          <span class="text-gray-400 ml-1">({{ 
                            calculateMultiplierDifference(
                              calculateMultiplier(gadget, currentLevels[gadget.id] || 0, boost.type),
                              calculateMultiplier(gadget, targetLevels[gadget.id] || 0, boost.type)
                            ) 
                          }})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <GadgetSummaryModal
        :is-visible="showSummaryModal"
        :current-levels="currentLevels"
        :target-levels="targetLevels"
        :total-cost="totalCost"
        :days-to-save="daysToSave"
        :build-name="selectedBuild?.name || ''"
        :tessarects-per-day="tessarectsPerDay"
        :gadget-images="gadgetImages"
        :current-tesseracts="currentTesseracts"
        :anchor-evaluation-enabled="anchorEvaluationEnabled"
        :anchor-evaluations="anchorEvaluations"
        :evaluating-anchor="evaluatingAnchor"
        @close="showSummaryModal = false"
      />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { 
  IconX, 
  IconChevronLeft, 
  IconChevronRight, 
  IconAlertCircle, 
  IconAnchor, 
  IconSettings, 
  IconChartDots, 
  IconInfoCircle, 
  IconRefresh,
  IconChartBar,
  IconShare
} from '@tabler/icons-vue';
import { 
  GADGETS, 
  getGadgetLabel, 
  calculateGadgetMultiplier, 
  formatMultiplier 
} from '@/constants/gadgets.js';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { calcGadgetCostDifference, formatGadgetCost, getGadgetCost as getGadgetCostFromUtils } from '@/utils/gadgetCostUtils';
import { shouldEvaluate } from '@/services/evaluationCacheService';
import GadgetSummaryModal from '@/components/gadget-calculator/GadgetSummaryModal.vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import SuffixInput from '@/composables/SuffixInput.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import { useBuildEvaluation } from '@/composables/useBuildEvaluation.js';

// Stores
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Local state
const isLoading = ref(true);
const loadError = ref(null);
const currentLevels = ref({});
const targetLevels = ref({});
const tessarectsPerDay = ref(0);
const currentTesseracts = ref(0); // Current Tesseracts - ähnlich wie currentHBM im InscryptionPlanner
const selectedBuildId = ref('');
const cachedResults = ref({});
const showMultipliers = ref(true);

// State für Anchor of Ages Evaluationen (ähnlich wie Borge Buff 2 im InscryptionPlanner)
const anchorEvaluations = ref({});
const evaluatingAnchor = ref(false);
const anchorEvaluationProgress = ref({});
const anchorEvaluationEnabled = ref(false); // Toggle für Evaluation

const showSummaryModal = ref(false);

// NEUE REACTIVE VAR für Gadget Images
const gadgetImages = ref({});

// Computed properties
const knoxBuilds = computed(() => {
  // Alle Knox-Builds aus dem hunterStore holen
  return hunterStore.getBuildsForHunter('knox').filter(build => !build.isArchived);
});

const selectedBuild = computed(() => {
  if (!selectedBuildId.value) return null;
  return knoxBuilds.value.find(build => String(build.id) === String(selectedBuildId.value));
});

// Use the build evaluation composable für Knox builds (für Anchor of Ages)
const { 
  evaluateBuildWithParams, 
  isEvaluating
} = useBuildEvaluation({ hunterId: 'knox', buildData: selectedBuild }, () => {});

// Anchor of Ages Evaluation Functions (ähnlich wie Borge Buff 2 im InscryptionPlanner)
async function evaluateAnchorOfAgesLevels() {
  if (!selectedBuild.value || evaluatingAnchor.value) {
    return;
  }

  const currentLevel = currentLevels.value.anchor || 0;
  const targetLevel = targetLevels.value.anchor || 0;
  
  if (targetLevel <= currentLevel) {
    return; // Kein Upgrade geplant
  }

  try {
    evaluatingAnchor.value = true;
    anchorEvaluationProgress.value = {};
    anchorEvaluations.value = {};

    // Evaluiere jeden Level von current+1 bis target
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      anchorEvaluationProgress.value[level] = 'Evaluating...';

      // Erstelle modifizierten Build mit diesem Anchor Level - DEEP COPY
      const modifiedBuild = JSON.parse(JSON.stringify(selectedBuild.value));
      
      if (!modifiedBuild.overrides) {
        modifiedBuild.overrides = {};
      }
      
      // Setze Anchor Level in den Overrides
      modifiedBuild.overrides['upgrades.gadgets.anchor'] = level;
      
      // Evaluiere den Build
      const evaluationResult = await evaluateBuildWithParams(modifiedBuild);
      
      if (evaluationResult && evaluationResult.mat3) {
        // Berechne die tägliche Tesseract-Produktion (wie im InscryptionPlanner)
        const tesseractsPerRun = evaluationResult.mat3 || 0;
        const avgRunTimeMinutes = evaluationResult.avgTime || 120;
        const runsPerDay = 1440 / avgRunTimeMinutes; // 1440 Minuten in einem Tag
        const dailyTesseracts = tesseractsPerRun * runsPerDay; // NICHT Math.floor hier, das kommt später
        
        anchorEvaluations.value[level] = {
          level: level,
          tesseractsPerDay: dailyTesseracts, // Speichere die genaue tägliche Produktion
          evaluationResult: evaluationResult
        };
        anchorEvaluationProgress.value[level] = 'Complete';
      } else {
        anchorEvaluationProgress.value[level] = 'Failed';
      }
    }

    // DETAILLIERTER EVALUATION SUMMARY LOG
    console.log('='.repeat(80));
    console.log('🔱 ANCHOR OF AGES EVALUATION COMPLETE 🔱');
    console.log('='.repeat(80));
    console.log(`📊 Evaluated Levels: ${currentLevel + 1} to ${targetLevel}`);
    console.log(`🎯 Total Levels: ${targetLevel - currentLevel}`);
    console.log(`⚡ Base Production: ${tessarectsPerDay.value} tesseracts/day`);
    console.log(`💰 Available Tesseracts: ${currentTesseracts.value || 0}`);
    console.log('');
    
    // Zeige alle Evaluation-Ergebnisse
    console.log('📈 LEVEL-BY-LEVEL EVALUATION RESULTS:');
    console.log('-'.repeat(50));
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      const evaluation = anchorEvaluations.value[level];
      const singleCost = calculateSingleLevelCost('anchor', level);
      
      if (evaluation) {
        const mat3PerRun = evaluation.evaluationResult?.mat3 || 0;
        const avgTime = evaluation.evaluationResult?.avgTime || 120;
        const runsPerDay = 1440 / avgTime;
        const calculatedDaily = mat3PerRun * runsPerDay;
        
        console.log(`Level ${level}:`);
        console.log(`  💎 Cost: ${formatGadgetCost(singleCost)} tesseracts`);
        console.log(`  ⚡ Mat3 per Run: ${formatGadgetCost(mat3PerRun)}`);
        console.log(`  ⏱️ Avg Time: ${avgTime} min`);
        console.log(`  🔄 Runs per Day: ${runsPerDay.toFixed(2)}`);
        console.log(`  🏭 Calculated Daily: ${formatGadgetCost(calculatedDaily)} (stored: ${formatGadgetCost(evaluation.tesseractsPerDay)})`);
        console.log(`  📊 Avg Stage: ${evaluation.evaluationResult?.avgStage || 'N/A'}`);
      } else {
        console.log(`Level ${level}: ❌ EVALUATION FAILED`);
        console.log(`  💎 Cost: ${formatGadgetCost(singleCost)} tesseracts`);
      }
      console.log('');
    }
    
    // Simuliere die Zeitberechnung nochmal für den Log
    console.log('🧮 TIME CALCULATION SIMULATION:');
    console.log('-'.repeat(50));
    let simCumulativeDays = 0;
    let simAvailableTesseracts = currentTesseracts.value || 0;
    let simCurrentProduction = tessarectsPerDay.value;
    
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      const singleLevelCost = calculateSingleLevelCost('anchor', level);
      const remainingCost = Math.max(0, singleLevelCost - simAvailableTesseracts);
      
      console.log(`Level ${level} Calculation:`);
      console.log(`  💎 Level Cost: ${formatGadgetCost(singleLevelCost)}`);
      console.log(`  💰 Available: ${formatGadgetCost(simAvailableTesseracts)}`);
      console.log(`  🔴 Need to Farm: ${formatGadgetCost(remainingCost)}`);
      console.log(`  ⚡ Current Production: ${formatGadgetCost(simCurrentProduction)}/day`);
      
      if (remainingCost > 0 && simCurrentProduction > 0) {
        const daysForThisLevel = remainingCost / simCurrentProduction;
        simCumulativeDays += daysForThisLevel;
        console.log(`  ⏱️ Days to Farm: ${daysForThisLevel.toFixed(2)}`);
        console.log(`  📅 Cumulative Days: ${simCumulativeDays.toFixed(2)}`);
        
        // Nach dem Warten haben wir genug produziert
        simAvailableTesseracts += daysForThisLevel * simCurrentProduction;
      } else {
        console.log(`  ✅ Can afford immediately!`);
      }
      
      // Nach dem Kauf reduzieren
      simAvailableTesseracts -= singleLevelCost;
      console.log(`  💰 After Purchase: ${formatGadgetCost(simAvailableTesseracts)}`);
      
      // Neue Produktion für nächstes Level
      const evaluation = anchorEvaluations.value[level];
      if (evaluation && evaluation.tesseractsPerDay) {
        const newDailyTesseracts = evaluation.tesseractsPerDay;
        if (newDailyTesseracts > simCurrentProduction) {
          const oldProduction = simCurrentProduction;
          simCurrentProduction = newDailyTesseracts;
          console.log(`  🚀 Production Upgrade: ${formatGadgetCost(oldProduction)} → ${formatGadgetCost(simCurrentProduction)}/day`);
        }
      }
      console.log('');
    }
    
    console.log('🏁 FINAL SUMMARY:');
    console.log(`  📅 Total Time Required: ${simCumulativeDays.toFixed(2)} days`);
    console.log(`  ⚡ Final Production Rate: ${formatGadgetCost(simCurrentProduction)}/day`);
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('[GadgetCalculator] Anchor evaluation failed:', error);
  } finally {
    evaluatingAnchor.value = false;
  }
}

// Anchor Time Display - zeigt Evaluierungsfortschritt oder Zeit
function getAnchorTimeDisplay() {
  // Wenn gerade evaluiert wird, zeige Fortschritt
  if (evaluatingAnchor.value) {
    const currentLevel = currentLevels.value.anchor || 0;
    const targetLevel = targetLevels.value.anchor || 0;
    
    if (targetLevel <= currentLevel) {
      return 'No upgrade planned';
    }
    
    // Berechne wie viele Level evaluiert werden müssen
    const totalLevels = targetLevel - currentLevel;
    
    // Zähle wie viele schon fertig sind
    const completedLevels = Object.keys(anchorEvaluations.value).length;
    
    return `${completedLevels}/${totalLevels}`;
  }
  
  // Sonst zeige normale Zeit
  return formatAnchorSaveTime();
}

// Berechne individuelle Sparzeit für Anchor of Ages mit Level-by-Level Evaluation
function formatAnchorSaveTime() {
  const currentLevel = currentLevels.value.anchor || 0;
  const targetLevel = targetLevels.value.anchor || 0;
  
  console.log('[ANCHOR] formatAnchorSaveTime called:', { currentLevel, targetLevel });
  
  if (targetLevel <= currentLevel) {
    console.log('[ANCHOR] No upgrade planned - target <= current');
    return 'No upgrade planned';
  }
  
  // Prüfe ob wir Evaluationen haben und diese verwendet werden sollen
  const hasEvaluations = Object.keys(anchorEvaluations.value).length > 0;
  const shouldUseEvaluations = hasEvaluations && anchorEvaluationEnabled.value;
  
  console.log('[ANCHOR] Evaluation status:', { 
    hasEvaluations, 
    anchorEvaluationEnabled: anchorEvaluationEnabled.value, 
    shouldUseEvaluations,
    evaluationsCount: Object.keys(anchorEvaluations.value).length,
    evaluations: anchorEvaluations.value
  });
  
  if (!shouldUseEvaluations) {
    // Normale Berechnung ohne Evaluation
    console.log('[ANCHOR] Using normal calculation (no evaluations)');
    return formatIndividualSaveTime('anchor');
  }
  
  // Berechne kumulative Zeit mit steigender Produktion (ähnlich wie Inscryption Planner)
  let cumulativeDays = 0;
  let availableTesseracts = currentTesseracts.value || 0;
  let currentProduction = tessarectsPerDay.value; // Basis-Produktion
  
  console.log('[ANCHOR] Starting calculation:', {
    initialAvailableTesseracts: availableTesseracts,
    initialProduction: currentProduction,
    levelsToProcess: targetLevel - currentLevel
  });
  
  for (let level = currentLevel + 1; level <= targetLevel; level++) {
    // Berechne die Kosten nur für diesen einen Level (nicht kumulativ)
    const singleLevelCost = calculateSingleLevelCost('anchor', level);
    const remainingCost = Math.max(0, singleLevelCost - availableTesseracts);
    
    console.log(`[ANCHOR] Level ${level}:`, {
      singleLevelCost,
      availableTesseracts,
      remainingCost,
      currentProduction
    });
    
    if (remainingCost > 0 && currentProduction > 0) {
      const daysForThisLevel = remainingCost / currentProduction;
      cumulativeDays += daysForThisLevel;
      
      console.log(`[ANCHOR] Level ${level} - Need to wait:`, {
        daysForThisLevel,
        cumulativeDays
      });
      
      // Nach dem Warten haben wir genug produziert + das was wir schon hatten
      availableTesseracts += daysForThisLevel * currentProduction;
    }
    
    // Nach dem Kauf: Verfügbare Tesseracts um die Kosten dieses Levels reduzieren
    availableTesseracts -= singleLevelCost;
    
    console.log(`[ANCHOR] Level ${level} - After purchase:`, {
      availableTesseractsAfterPurchase: availableTesseracts
    });
    
    // WICHTIG: Neue Produktion für nächstes Level anwenden (wie InscryptionPlanner)
    const evaluation = anchorEvaluations.value[level];
    console.log(`[ANCHOR] Level ${level} - Checking for evaluation:`, {
      hasEvaluation: !!evaluation,
      evaluationTesseractsPerDay: evaluation?.tesseractsPerDay,
      currentProduction,
      evaluationData: evaluation
    });
    
    if (evaluation && evaluation.tesseractsPerDay) {
      // Berechne die neue tägliche Tesseract-Produktion aus der Evaluation
      const newDailyTesseracts = evaluation.tesseractsPerDay; // KEIN Math.floor hier!
      
      console.log(`[ANCHOR] Level ${level} - Production comparison:`, {
        oldProduction: currentProduction,
        newDailyTesseracts,
        willUpdate: newDailyTesseracts > currentProduction
      });
      
      // AKTUALISIERE die currentProduction für nachfolgende Level
      // Füge einen kleinen Toleranzwert hinzu um floating point Vergleichsprobleme zu vermeiden
      const tolerance = currentProduction * 0.001; // 0.1% Toleranz
      if (newDailyTesseracts > (currentProduction + tolerance)) {
        const oldProduction = currentProduction;
        currentProduction = newDailyTesseracts; // Verwende den genauen Wert
        console.log(`[ANCHOR] Level ${level} - Production increased:`, {
          oldProduction,
          newProduction: currentProduction,
          evaluationMat3: evaluation.evaluationResult?.mat3,
          evaluationTime: evaluation.evaluationResult?.avgTime,
          tolerance,
          difference: newDailyTesseracts - oldProduction
        });
      } else {
        console.log(`[ANCHOR] Level ${level} - Production NOT increased:`, {
          newDailyTesseracts,
          currentProduction,
          tolerance,
          difference: newDailyTesseracts - currentProduction,
          wouldUpdateWithoutTolerance: newDailyTesseracts > currentProduction
        });
      }
    } else {
      console.log(`[ANCHOR] Level ${level} - No evaluation available for production update`);
    }
  }
  
  console.log('[ANCHOR] Final calculation result:', {
    cumulativeDays,
    finalResult: cumulativeDays <= 0 ? 'Available now' : `${cumulativeDays} days`
  });
  
  // Formatiere die Zeit wie bei anderen Gadgets
  if (cumulativeDays === Infinity || cumulativeDays > 36500) return '☠️';
  if (cumulativeDays <= 0) return 'Available now';
  
  if (cumulativeDays > 365) {
    const years = Math.floor(cumulativeDays / 365);
    const remainingDays = cumulativeDays % 365;
    const months = Math.floor(remainingDays / 30);
    
    if (months === 0) {
      return `${years}y`;
    } else {
      return `${years}y, ${months}mo`;
    }
  }
  
  if (cumulativeDays > 60) {
    return `${Math.floor(cumulativeDays)} days`;
  }
  
  const fullDays = Math.floor(cumulativeDays);
  const hours = Math.round((cumulativeDays - fullDays) * 24);
  
  if (fullDays === 0) {
    return `${hours}h`;
  } else if (hours === 0) {
    return `${fullDays}d`;
  } else {
    return `${fullDays}d ${hours}h`;
  }
}

// Hilfsfunktion: Berechne Kosten für einen spezifischen Level (nur dieser eine Level)
function calculateSingleLevelCost(gadgetId, level) {
  if (level <= 0) return 0;
  
  // Verwende die echte Kostenfunktion aus gadgetCostUtils.js
  return getGadgetCostFromUtils(gadgetId, level);
}

// Hilfsfunktion: Berechne kumulative Kosten von current level bis zu einem level
function calculateLevelCost(gadgetId, level) {
  const currentGadgetLevel = currentLevels.value[gadgetId] || 0;
  
  // Verwende die echte Kostenfunktion aus gadgetCostUtils.js
  return calcGadgetCostDifference(gadgetId, currentGadgetLevel, level);
}

// Trigger Anchor Evaluation nur bei manuellem Aufruf
function triggerAnchorEvaluation() {
  if (selectedBuild.value) {
    anchorEvaluationEnabled.value = true;
    evaluateAnchorOfAgesLevels();
  }
}

const totalCost = computed(() => {
  let cost = 0;
  
  for (const gadget of GADGETS) {
    cost += getGadgetCost(gadget.id);
  }
  
  return cost;
});

const daysToSave = computed(() => {
  if (tessarectsPerDay.value <= 0) return Infinity;
  
  // Berücksichtige bereits verfügbare Tesseracts
  const remainingCost = Math.max(0, totalCost.value - (currentTesseracts.value || 0));
  if (remainingCost <= 0) return 0; // Bereits genug Tesseracts verfügbar
  
  return remainingCost / tessarectsPerDay.value;
});

const activeLevelCount = computed(() => {
  return GADGETS.filter(gadget => hasLevelChanges(gadget.id)).length;
});

const totalGadgets = computed(() => GADGETS.length);

// Tab-Index Hilfsfunktionen
function getTabIndexForCurrentLevel(gadgetId) {
  // Bestimme die Position des Gadget-Typs in der Liste
  const gadgetIds = GADGETS.map(g => g.id);
  const index = gadgetIds.indexOf(gadgetId);
  // Weisen wir Current-Feldern Indizes 1-N zu (basierend auf der Anzahl der Gadgets)
  return index + 1;
}

function getTabIndexForTargetLevel(gadgetId) {
  // Bestimme die Position des Gadget-Typs in der Liste
  const gadgetIds = GADGETS.map(g => g.id);
  const index = gadgetIds.indexOf(gadgetId);
  // Wir weisen Target-Feldern Indizes N+1-2N zu (nach allen Current-Feldern)
  return GADGETS.length + index + 1;
}

// Neue Funktionen für Multiplikatoren
function getBoostDescription(gadget) {
  if (!gadget.boost || !Array.isArray(gadget.boost)) return '';
  return gadget.boost.map(boost => boost.description).join(', ');
}

function calculateMultiplier(gadget, level, boostType) {
  if (!gadget || !gadget.calculateMultiplier || level <= 0) return 1;
  return gadget.calculateMultiplier(level, boostType);
}

function calculateMultiplierDifference(currentMulti, targetMulti) {
  if (currentMulti === targetMulti) return '+0%';
  
  const percentIncrease = ((targetMulti / currentMulti) - 1) * 100;
  
  // Für große Prozentwerte Suffixe verwenden
  if (percentIncrease >= 1000) {
    const suffixes = ['', 'k', 'm', 'b', 't', 'qa', 'qu', 'sx', 'sp', 'oc', 'n', 'd'];
    let tier = Math.floor(Math.log10(percentIncrease) / 3);
    
    if (tier >= suffixes.length) {
      // Sehr große Zahlen als Exponentialform
      return `+${percentIncrease.toExponential(2)}%`;
    } else {
      // Normale Suffixdarstellung
      const suffix = suffixes[tier];
      const scaledValue = percentIncrease / Math.pow(10, tier * 3);
      return `+${scaledValue.toFixed(2)}${suffix}%`;
    }
  }
  
  // Kleine Prozente mit einer Dezimalstelle
  return `+${percentIncrease.toFixed(1)}%`;
}

// Methods
function formatTimeToSave(days) {
  if (days === Infinity) return 'N/A';
  
  // Wenn es mehr als 10 Jahre dauert...
  if (days > 36500) { // 100 Jahre = 36500 Tage
    return '☠️';
  }
  
  // Wenn es mehr als 1 Jahr dauert, in Jahren und Monaten anzeigen
  if (days > 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    
    if (months === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    }
  }
  
  // Wenn es mehr als 60 Tage dauert, nur in Tagen anzeigen
  if (days > 60) {
    return `${Math.floor(days)} days`;
  }
  
  // Normaler Fall: Tage und Stunden
  const fullDays = Math.floor(days);
  const hours = Math.round((days - fullDays) * 24);
  
  if (fullDays === 0) {
    return `${hours} hours`;
  } else if (hours === 0) {
    return `${fullDays} days`;
  } else {
    return `${fullDays} days ${hours} hours`;
  }
}

async function loadCachedResults() {
  try {
    console.log('[GadgetCalculator] Loading cached results for Knox builds...');
    console.log('[GadgetCalculator] Available Knox builds:', knoxBuilds.value.map(b => ({ id: b.id, name: b.name })));
    
    // Cache für jeden Build einzeln prüfen
    const allCachedResults = [];
    
    for (const build of knoxBuilds.value) {
      console.log(`[GadgetCalculator] Prüfe Cache für Build "${build.name}" (ID: ${build.id})`);
      
      const cache = await shouldEvaluate({
        hunterId: 'knox',
        buildData: build,
        hunterStore,
        gemPlannerStore
      });
      
      console.log(`[GadgetCalculator] Cache-Status für Build "${build.name}":`, cache);
      
      if (cache?.cachedResult) {
        console.log(`[GadgetCalculator] Cache gefunden für Build "${build.name}":`, {
          buildId: cache.cachedResult.buildId || 'none',
          avgStage: cache.cachedResult.avgStage
        });
        
        allCachedResults.push({
          build,
          result: cache.cachedResult,
          cacheKey: cache.cacheKey
        });
      }
    }
    
    console.log(`[GadgetCalculator] ${allCachedResults.length} von ${knoxBuilds.value.length} Builds haben Cache`);
    
    // Prüfe ob alle Cache-Einträge Build-IDs haben
    const hasValidBuildIds = allCachedResults.every(entry => entry.result.buildId && entry.result.buildId !== 'none');
    
    if (hasValidBuildIds) {
      // Ideal: Exakte Build-ID-Übereinstimmung
      console.log('[GadgetCalculator] Verwende exakte Build-ID-Übereinstimmung');
      for (const { build, result } of allCachedResults) {
        if (result.buildId === build.id && result.avgStage && result.mat3) {
          cachedResults.value[build.id] = result;
          console.log(`[GadgetCalculator] ✓ Exakte Zuordnung für "${build.name}"`);
        }
      }
    } else {
      // Fallback: Intelligente Zuordnung für bestehende Cache-Einträge ohne Build-IDs
      console.log('[GadgetCalculator] ⚠ Keine Build-IDs in Cache gefunden - verwende intelligente Zuordnung');
      
      if (allCachedResults.length === knoxBuilds.value.length) {
        // Sortiere Builds nach ID (ascending) und Cache nach avgStage (ascending)
        const sortedBuilds = allCachedResults.sort((a, b) => a.build.id.localeCompare(b.build.id));
        const sortedByPerformance = [...allCachedResults].sort((a, b) => a.result.avgStage - b.result.avgStage);
        
        console.log('[GadgetCalculator] Build-Reihenfolge (nach ID):', sortedBuilds.map(b => b.build.name));
        console.log('[GadgetCalculator] Cache-Reihenfolge (nach Performance):', sortedByPerformance.map(c => c.result.avgStage));
        
        // 1:1 Zuordnung: Schlechtester Build bekommt schlechteste Performance
        for (let i = 0; i < sortedBuilds.length; i++) {
          const buildEntry = sortedBuilds[i];
          const cacheEntry = sortedByPerformance[i];
          
          if (cacheEntry.result.avgStage && cacheEntry.result.mat3) {
            cachedResults.value[buildEntry.build.id] = cacheEntry.result;
            console.log(`[GadgetCalculator] Zuordnung: "${buildEntry.build.name}" (ID: ${buildEntry.build.id}) -> avgStage: ${cacheEntry.result.avgStage}`);
          }
        }
      } else {
        console.log('[GadgetCalculator] ⚠ Anzahl Build/Cache-Einträge stimmt nicht überein');
      }
    }
    
    console.log('[GadgetCalculator] Final cachedResults:', Object.keys(cachedResults.value).length, 'results loaded');
    
  } catch (error) {
    console.error('[GadgetCalculator] Error loading cached results:', error);
    loadError.value = 'Failed to load build results';
  }
}

async function loadGadgetImages() {
  try {
    // Lade alle Gadget-Bilder (1-15) dynamisch
    const imagePromises = [];
    for (let i = 1; i <= 15; i++) {
      imagePromises.push(
        import(`@/assets/gadgets/${i}.png`)
          .then(module => ({ id: i, url: module.default }))
          .catch(error => {
            console.warn(`Could not load gadget image ${i}:`, error);
            return { id: i, url: null };
          })
      );
    }
    
    const results = await Promise.all(imagePromises);
    
    // Speichere die URLs in gadgetImages
    results.forEach(result => {
      gadgetImages.value[result.id] = result.url;
    });
    
    console.log('Loaded gadget images:', gadgetImages.value);
  } catch (error) {
    console.error('Error loading gadget images:', error);
  }
}

// NEUE FUNKTION - Hole Gadget Image URL
function getGadgetImageUrl(gadgetId) {
  const imageNumber = getGadgetImageNumber(gadgetId);
  return gadgetImages.value[imageNumber] || null;
}

// Methods
async function loadGadgetData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Gadget Images zuerst laden
    await loadGadgetImages();
    
    // Korrigiere den Aufruf von hasHunterData zu einer vorhandenen Methode im hunterStore
    if (!hunterStore.hunterBuilds || !hunterStore.hunterBuilds.knox || hunterStore.hunterBuilds.knox.length === 0) {
      await hunterStore.initHunterConfig('knox');
    }
    
    // Cached Results laden
    await loadCachedResults();
    
    // Load existing gadget levels from hunterStore
    const storeUpgrades = hunterStore.upgrades?.gadgets || {};
    
    // Initialize levels from localStorage or store
    const savedCurrentLevels = JSON.parse(localStorage.getItem('gadgetCalculator_currentLevels') || '{}');
    const savedTargetLevels = JSON.parse(localStorage.getItem('gadgetCalculator_targetLevels') || '{}');
    const savedReferenceBuildId = localStorage.getItem('gadgetCalculator_referenceBuildId');
    const savedCurrentTesseracts = localStorage.getItem('gadgetCalculator_currentTesseracts');
    
    // Lade Multiplier-Ansicht-Einstellung
    const savedShowMultipliers = localStorage.getItem('gadgetCalculator_showMultipliers');
    if (savedShowMultipliers !== null) {
      showMultipliers.value = savedShowMultipliers === 'true';
    }
    
    // Lade Current Tesseracts
    if (savedCurrentTesseracts !== null) {
      currentTesseracts.value = Number(savedCurrentTesseracts) || 0;
    }
    
    // Initialize with store values for wrench, zaptron, anchor
    const newCurrentLevels = { ...savedCurrentLevels };
    
    // For wrench and zaptron, use store values if available
    // Anchor wird aus dem ausgewählten Build geholt, nicht aus dem Store
    if (storeUpgrades.wrench !== undefined) newCurrentLevels.wrench = storeUpgrades.wrench;
    if (storeUpgrades.zaptron !== undefined) newCurrentLevels.zaptron = storeUpgrades.zaptron;
    // Entfernt: if (storeUpgrades.anchor !== undefined) newCurrentLevels.anchor = storeUpgrades.anchor;
    
    // Set the values from localStorage or defaults
    currentLevels.value = newCurrentLevels;
    targetLevels.value = savedTargetLevels;
    
    if (savedReferenceBuildId) {
      // Prüfen, ob der gespeicherte Build noch verfügbar ist
      const buildExists = knoxBuilds.value.some(build => String(build.id) === String(savedReferenceBuildId));
      
      if (buildExists) {
        selectedBuildId.value = savedReferenceBuildId;
        updateFromSelectedBuild();
      }
    }
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error loading gadget data:', error);
    loadError.value = error.message;
    isLoading.value = false;
  }
}

function updateFromSelectedBuild() {
  console.log("updateFromSelectedBuild called");
  console.log("Selected build ID:", selectedBuildId.value);
  
  if (!selectedBuildId.value) {
    console.log("No build selected");
    tessarectsPerDay.value = 0;
    return;
  }
  
  const build = selectedBuild.value;
  console.log("Selected build:", build);
  
  if (build) {
    // Hole gecachtes Ergebnis für diesen Build
    const result = cachedResults.value[build.id];
    console.log("Cached result for this build:", result);
    
    if (result) {
      // Tessarect-Produktion aus mat3 im gecachten Ergebnis holen
      const tessarectsPerRun = result.mat3 || 0;
      console.log("Tessarects per run:", tessarectsPerRun);
      
      // Durchschnittliche Laufzeit aus den Ergebnissen holen
      const avgRunTimeMinutes = result.avgTime || 120; // Default zu 120 Minuten, wenn nicht verfügbar
      console.log("Average run time (minutes):", avgRunTimeMinutes);
      
      // Läufe pro Tag berechnen
      const runsPerDay = 1440 / avgRunTimeMinutes; // 1440 Minuten in einem Tag
      console.log("Runs per day:", runsPerDay);
      
      // Tägliche Tessarect-Produktion berechnen
      const dailyTessarects = Math.floor(tessarectsPerRun * runsPerDay);
      console.log("Daily tessarect production:", dailyTessarects);
      
      // Tessarects pro Tag aktualisieren
      tessarectsPerDay.value = dailyTessarects;
      
      // In localStorage speichern
      localStorage.setItem('gadgetCalculator_referenceBuildId', selectedBuildId.value);
    } else {
      console.log("No cached result found for this build");
      tessarectsPerDay.value = 0;
    }
    
    // WICHTIG: Aktualisiere den Current Anchor Level aus dem ausgewählten Build
    updateCurrentAnchorFromBuild(build);
  } else {
    console.log("Build not found");
    tessarectsPerDay.value = 0;
  }
}

// Neue Funktion: Hole den aktuellen Anchor Level aus dem Build
function updateCurrentAnchorFromBuild(build) {
  if (!build) return;
  
  let anchorLevel = 0;
  
  // Prüfe Overrides zuerst (höchste Priorität)
  if (build.overrides && build.overrides['upgrades.gadgets.anchor'] !== undefined) {
    anchorLevel = build.overrides['upgrades.gadgets.anchor'];
    console.log(`[GadgetCalculator] Anchor level from build overrides: ${anchorLevel}`);
  } 
  // Sonst schaue in den normalen upgrades des Builds
  else if (build.upgrades && build.upgrades.gadgets && build.upgrades.gadgets.anchor !== undefined) {
    anchorLevel = build.upgrades.gadgets.anchor;
    console.log(`[GadgetCalculator] Anchor level from build upgrades: ${anchorLevel}`);
  }
  // Fallback zum hunterStore
  else {
    const storeUpgrades = hunterStore.upgrades?.gadgets || {};
    anchorLevel = storeUpgrades.anchor || 0;
    console.log(`[GadgetCalculator] Anchor level from hunterStore fallback: ${anchorLevel}`);
  }
  
  // Aktualisiere nur den Anchor Level, behalte andere Gadget-Level bei
  if (currentLevels.value.anchor !== anchorLevel) {
    currentLevels.value.anchor = anchorLevel;
    
    // Stelle sicher, dass der Target Level nicht unter dem Current Level ist
    if ((targetLevels.value.anchor || 0) < anchorLevel) {
      targetLevels.value.anchor = anchorLevel;
    }
    
    console.log(`[GadgetCalculator] Updated current anchor level to: ${anchorLevel}`);
    
    // Speichere die Änderungen
    saveGadgetLevels();
    
    // Reset Anchor Evaluation da sich der Current Level geändert hat
    anchorEvaluationEnabled.value = false;
    anchorEvaluations.value = {};
    anchorEvaluationProgress.value = {};
  }
}

function hasLevelChanges(gadgetId) {
  const current = currentLevels.value[gadgetId] || 0;
  const target = targetLevels.value[gadgetId] || 0;
  return target > current;
}

function getGadgetCost(gadgetId) {
  const current = currentLevels.value[gadgetId] || 0;
  const target = targetLevels.value[gadgetId] || 0;
  
  if (target <= current) return 0;
  
  return calcGadgetCostDifference(gadgetId, current, target);
}

function updateCurrentLevel(gadgetId, newValue) {
  // Stelle sicher, dass der Wert nicht negativ ist
  newValue = Math.max(0, Math.min(999, newValue));
  
  // Aktualisiere den aktuellen Level
  currentLevels.value[gadgetId] = newValue;
  
  // Wenn der Ziellevel niedriger ist als der aktuelle, passe ihn an
  if ((targetLevels.value[gadgetId] || 0) < newValue) {
    targetLevels.value[gadgetId] = newValue;
  }
  
  // Speichere die Werte
  saveGadgetLevels();
}

function updateTargetLevel(gadgetId, newValue) {
  // Prüfe, ob wir uns im Bearbeitungsmodus befinden - Prüfen auf <input> Element
  const activeElement = document.activeElement;
  const isEditing = activeElement.tagName.toLowerCase() === 'input';

  // Konvertiere newValue zu einer Zahl (falls es ein String ist)
  newValue = Number(newValue);
  
  // Wenn die Eingabe NaN ist, behalten wir den vorherigen Wert bei
  if (isNaN(newValue)) {
    return;
  }
  
  // Wenn wir im Bearbeitungsmodus sind ODER der Wert größer/gleich dem Current ist
  if (isEditing || newValue >= (currentLevels.value[gadgetId] || 0)) {
    // Aktualisiere den Ziel-Level ohne weitere Validierung
    targetLevels.value[gadgetId] = newValue;
  } else {
    // Benutzer hat auf Minus-Button geklickt, aber Wert wäre unter Current
    // Wert auf Current begrenzen
    targetLevels.value[gadgetId] = currentLevels.value[gadgetId] || 0;
  }
  
  // Speichere die Werte
  saveGadgetLevels();
}

function finalizeTargetLevel(gadgetId, newVal = null) {
  // Wenn ein Wert übergeben wurde, verwende diesen statt des bestehenden
  if (newVal !== null) {
    newVal = Number(newVal);
    if (!isNaN(newVal)) {
      // Stelle sicher, dass der Wert nicht unter Current ist
      const current = currentLevels.value[gadgetId] || 0;
      targetLevels.value[gadgetId] = Math.max(current, newVal);
      saveGadgetLevels();
      return;
    }
  }
  
  // Fallback zum bestehenden Verhalten
  const current = currentLevels.value[gadgetId] || 0;
  const target = targetLevels.value[gadgetId] || 0;
  
  // Validiere den Wert nach der Bearbeitung - stelle sicher, dass er eine Zahl ist
  if (isNaN(target)) {
    targetLevels.value[gadgetId] = current;
  } else {
    targetLevels.value[gadgetId] = Math.max(current, target);
  }
  
  // Speichere die Werte
  saveGadgetLevels();
}

// Individuelle Sparzeit für ein Gadget
function formatIndividualSaveTime(gadgetId) {
  const cost = getGadgetCost(gadgetId);
  if (cost <= 0) return 'N/A';
  if (tessarectsPerDay.value <= 0) return 'Set production rate';
  
  // Berücksichtige bereits verfügbare Tesseracts
  const remainingCost = Math.max(0, cost - (currentTesseracts.value || 0));
  if (remainingCost <= 0) return 'Available now'; // Bereits genug Tesseracts für dieses Gadget
  
  const days = remainingCost / tessarectsPerDay.value;
  
  // Wenn es mehr als 10 Jahre dauert...
  if (days > 36500) { // 100 Jahre = 36500 Tage
    return '☠️';
  }
  
  // Wenn es mehr als 1 Jahr dauert, in Jahren und Monaten anzeigen
  if (days > 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    
    if (months === 0) {
      return `${years}y`;
    } else {
      return `${years}y, ${months}mo`;
    }
  }
  
  // Wenn es mehr als 60 Tage dauert, nur in Tagen anzeigen
  if (days > 60) {
    return `${Math.floor(days)}d`;
  }
  
  // Normaler Fall: Tage und Stunden
  const fullDays = Math.floor(days);
  const hours = Math.round((days - fullDays) * 24);
  
  if (fullDays === 0) {
    return `${hours}h`;
  } else if (hours === 0) {
    return `${fullDays}d`;
  } else {
    return `${fullDays}d, ${hours}h`;
  }
}

// Hilfsfunktion um die Bildnummer zu ermitteln
function getGadgetImageNumber(gadgetId) {
  const gadgetIndex = GADGETS.findIndex(g => g.id === gadgetId);
  return gadgetIndex + 1; // 1-basiert für die Dateinamen
}

function resetAllLevels() {
  // Reset target levels to match current levels
  GADGETS.forEach(gadget => {
    targetLevels.value[gadget.id] = currentLevels.value[gadget.id] || 0;
  });
  
  saveGadgetLevels();
}

function saveGadgetLevels() {
  localStorage.setItem('gadgetCalculator_currentLevels', JSON.stringify(currentLevels.value));
  localStorage.setItem('gadgetCalculator_targetLevels', JSON.stringify(targetLevels.value));
  localStorage.setItem('gadgetCalculator_currentTesseracts', String(currentTesseracts.value || 0));
}

// Watch für Änderungen am selectedBuildId, um Anchor-Level zu aktualisieren
watch(selectedBuildId, (newBuildId) => {
  if (newBuildId && selectedBuild.value) {
    updateCurrentAnchorFromBuild(selectedBuild.value);
  }
});

// Watch für Änderungen am hunterStore
watch(() => hunterStore.getBuildsForHunter('knox'), () => {
  // Wenn sich die Builds im Store ändern, lade die Ergebnisse neu
  loadCachedResults();
}, { deep: true });

// Watch für currentTesseracts Änderungen, um automatisch zu speichern
watch(currentTesseracts, (newValue) => {
  localStorage.setItem('gadgetCalculator_currentTesseracts', String(newValue || 0));
});

// Reset Anchor Evaluation wenn sich Level ändern
watch(() => [targetLevels.value.anchor, currentLevels.value.anchor], () => {
  // Reset evaluation state when levels change
  anchorEvaluationEnabled.value = false;
  anchorEvaluations.value = {};
  anchorEvaluationProgress.value = {};
});

// Initialize on mount
onMounted(async () => {
  await loadGadgetData();
});
</script>

<style scoped>
/* Bestehende Styles bleiben gleich */
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

/* Erweiterte Gadget-Styles mit Hintergrundbildern */
.gadget-card {
  background: linear-gradient(to bottom, rgba(35, 39, 47, 0.9), rgba(28, 32, 38, 0.95));
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  position: relative;
}

.gadget-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-color: #22d3ee; /* cyan-400 */
}

.gadget-card.active-gadget {
  background: linear-gradient(to bottom, rgba(39, 51, 65, 0.98), rgba(28, 32, 38, 0.98));
  box-shadow: 0 0 0 2px rgba(34,211,238,0.18), 0 0 12px 2px rgba(34,211,238,0.18);
  border-color: #38bdf8; /* cyan-400, aber sehr subtil */
}

/* Hintergrundbild-Styles - BESSER SICHTBAR */
.gadget-background {
  background-size: 80px 80px;
  background-repeat: no-repeat;
  background-position: top 8px right 8px;
  z-index: 1;
  transition: none;
  /* Schärfere Bilddarstellung */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  /* VERBESSERTE SICHTBARKEIT */
  opacity: 1;
}

/* Content Overlay - WENIGER ÜBERDECKUNG */
.gadget-content {
  position: relative;
  z-index: 10;
  /* NEUE GRADIENT - MEHR TRANSPARENZ RECHTS OBE */
  background: linear-gradient(
    to right, 
    rgba(35, 39, 47, 0.85) 0%, 
    rgba(35, 39, 47, 0.6) 60%, 
    rgba(35, 39, 47, 0.1) 85%,
    transparent 100%
  );
  border-radius: 0.5rem;
  padding: 0.5rem;
  /* ZUSÄTZLICHER GRADIENT VON OBEN */
  background-image: 
    linear-gradient(
      to right, 
      rgba(35, 39, 47, 0.85) 0%, 
      rgba(35, 39, 47, 0.6) 60%, 
      rgba(35, 39, 47, 0.1) 85%,
      transparent 100%
    ),
    radial-gradient(
      circle at top right, 
      transparent 60px, 
      rgba(35, 39, 47, 0.8) 80px
    );
}

.custom-gadget-item.active-gadget .gadget-content {
  /* AKTIVE GADGETS - NOCH WENIGER ÜBERDECKUNG */
  background: linear-gradient(
    to right, 
    rgba(30, 41, 59, 0.8) 0%, 
    rgba(30, 41, 59, 0.5) 60%, 
    rgba(30, 41, 59, 0.1) 85%,
    transparent 100%
  );
  background-image: 
    linear-gradient(
      to right, 
      rgba(30, 41, 59, 0.8) 0%, 
      rgba(30, 41, 59, 0.5) 60%, 
      rgba(30, 41, 59, 0.1) 85%,
      transparent 100%
    ),
    radial-gradient(
      circle at top right, 
      transparent 60px, 
      rgba(30, 41, 59, 0.7) 80px
    );
}

/* Enhanced Multipliers */
.gadget-multipliers {
  background: linear-gradient(
    to bottom, 
    rgba(23, 29, 35, 0.90), 
    rgba(20, 25, 30, 0.90)
  ) !important;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Mobile Optimierung */
@media (max-width: 640px) {
  .gadget-background {
    background-size: 60px 60px; /* Kleinere Bilder auf Mobile */
    background-position: top 6px right 6px;
    opacity: 1; /* Noch sichtbarer auf Mobile */
  }
  
  .gadget-content {
    /* Mobile: Weniger Overlay */
    background: linear-gradient(
      to right, 
      rgba(35, 39, 47, 0.8) 0%, 
      rgba(35, 39, 47, 0.4) 50%, 
      transparent 80%
    );
    background-image: 
      linear-gradient(
        to right, 
        rgba(35, 39, 47, 0.8) 0%, 
        rgba(35, 39, 47, 0.4) 50%, 
        transparent 80%
      ),
      radial-gradient(
        circle at top right, 
        transparent 45px, 
        rgba(35, 39, 47, 0.7) 60px
      );
  }
  
  .custom-gadget-item.active-gadget .gadget-content {
    background: linear-gradient(
      to right, 
      rgba(30, 41, 59, 0.75) 0%, 
      rgba(30, 41, 59, 0.4) 50%, 
      transparent 80%
    );
    background-image: 
      linear-gradient(
        to right, 
        rgba(30, 41, 59, 0.75) 0%, 
        rgba(30, 41, 59, 0.4) 50%, 
        transparent 80%
      ),
      radial-gradient(
        circle at top right, 
        transparent 45px, 
        rgba(30, 41, 59, 0.6) 60px
      );
  }
}
</style>