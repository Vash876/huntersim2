<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white">
        <span>Gadget Calculator</span>
      </h2>
      
      <!-- Tessarect Rate Settings -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconAnchor size="18" class="mr-2 text-blue-400" />
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
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Reference Build -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center mb-1">
                <span class="font-medium text-white text-sm">Reference Build</span>
              </div>
              
              <select 
                v-model="selectedBuildId" 
                @change="updateFromSelectedBuild"
                class="w-full bg-gray-800 border border-gray-700 rounded text-white py-1 px-2 text-sm"
              >
                <option value="">Select a build...</option>
                <option v-for="build in knoxBuilds" :key="build.id" :value="build.id">
                  {{ build.name }}
                </option>
              </select>
              <p class="text-gray-400 text-xs mt-1">Select a Knox build to calculate Tesseract production</p>
            </div>
            
            <!-- Daily Tessarect Rate -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center mb-1">
                <span class="font-medium text-white text-sm">Tesseracts per Day</span>
              </div>
              
              <div class="flex items-center bg-gray-800/80 py-2 px-3 rounded-lg border border-gray-700">
                <div class="text-amber-400 text-base font-bold">{{ formatGadgetCost(tessarectsPerDay) }}</div>
                <div v-if="selectedBuild" class="ml-2 text-gray-400 text-xs">
                  ({{ selectedBuild.name }})
                </div>
                <div v-else class="ml-2 text-gray-400 text-xs">(select a build)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Summary Box (total cost, days) -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconChartDots size="18" class="mr-2 text-green-400" />
            Summary
          </h3>
        </div>
        
        <div class="p-2 sm:p-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
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
          
          <!-- Gadget List (Two per row) -->
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="gadget in GADGETS"
              :key="gadget.id"
              class="custom-gadget-item rounded-lg p-4 transition-colors border border-transparent hover:border-gray-600"
              :class="{ 'active-gadget': hasLevelChanges(gadget.id) }"
            >
              <!-- Gadget Header -->
              <div class="flex flex-wrap justify-between items-center mb-2">
                <span class="text-base text-white font-medium flex-grow">
                  <span class="hidden sm:inline">
                    {{ gadget.label.length > 40 ? gadget.label.substring(0, 40) + '...' : gadget.label }}
                  </span>
                  <span class="inline sm:hidden">
                    {{ gadget.label.length > 28 ? gadget.label.substring(0, 28) + '...' : gadget.label }}
                  </span>
                </span>
                <div v-if="getGadgetCost(gadget.id) > 0" class="text-amber-400 text-sm font-medium">
                  {{ formatGadgetCost(getGadgetCost(gadget.id)) }}
                </div>
              </div>

              <!-- Level Controls -->
              <div class="grid grid-cols-2 gap-3 mb-3">
                <!-- Current Level Controls -->
                <div>
                  <div class="text-xs text-gray-400 mb-1 uppercase">Current</div>
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
                    class="mx-auto"
                  />
                </div>
                
                <!-- Target Level Controls -->
                <div>
                  <div class="text-xs text-gray-400 mb-1 uppercase">Target</div>
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
                    class="mx-auto"
                  />
                </div>
              </div>
              
              <!-- Multiplier Information -->
              <div v-if="showMultipliers" class="bg-gray-900/70 rounded-lg p-3 border border-gray-700/50">                
                <div class="space-y-1.5">
                  <div v-for="(boost, index) in gadget.boost" :key="`${gadget.id}-boost-${index}`">
                    <!-- Current Multiplier -->
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-300">{{ boost.description }}:</span>
                      <span class="text-sm font-medium text-white">
                        {{ formatMultiplier(calculateMultiplier(gadget, currentLevels[gadget.id] || 0, boost.type), false, gadget.id) }}
                      </span>
                    </div>

                    <!-- Target Multiplier (if different from current) -->
                    <div v-if="hasLevelChanges(gadget.id)" class="flex justify-between mt-0.5">
                      <span class="text-xs text-gray-500">Target:</span>
                      <span class="text-xs font-medium text-green-400">
                        {{ formatMultiplier(calculateMultiplier(gadget, targetLevels[gadget.id] || 0, boost.type), false, gadget.id) }}
                        <span class="text-gray-500 ml-1">({{ 
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
    <GadgetSummaryModal
      :is-visible="showSummaryModal"
      :current-levels="currentLevels"
      :target-levels="targetLevels"
      :total-cost="totalCost"
      :days-to-save="daysToSave"
      :build-name="selectedBuild?.name || ''"
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
import { calcGadgetCostDifference, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { shouldEvaluate } from '@/services/evaluationCacheService';
import GadgetSummaryModal from '@/components/gadget-calculator/GadgetSummaryModal.vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// Stores
const hunterStore = useHunterStore();

// Local state
const isLoading = ref(true);
const loadError = ref(null);
const currentLevels = ref({});
const targetLevels = ref({});
const tessarectsPerDay = ref(0);
const selectedBuildId = ref('');
const cachedResults = ref({});
const showMultipliers = ref(true);

const showSummaryModal = ref(false);

// Computed properties
const knoxBuilds = computed(() => {
  // Alle Knox-Builds aus dem hunterStore holen
  return hunterStore.getBuildsForHunter('knox').filter(build => !build.isArchived);
});

const selectedBuild = computed(() => {
  if (!selectedBuildId.value) return null;
  return knoxBuilds.value.find(build => String(build.id) === String(selectedBuildId.value));
});

const totalCost = computed(() => {
  let cost = 0;
  
  for (const gadget of GADGETS) {
    cost += getGadgetCost(gadget.id);
  }
  
  return cost;
});

const daysToSave = computed(() => {
  if (tessarectsPerDay.value <= 0) return Infinity;
  return totalCost.value / tessarectsPerDay.value;
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
    return `${fullDays} days, ${hours} hours`;
  }
}

async function loadCachedResults() {
  try {
    for (const build of knoxBuilds.value) {
      // Cache-Ergebnis abrufen
      const { shouldEvaluate: needsEval, cachedResult } = await shouldEvaluate({
        hunterId: 'knox',
        buildData: build,
        hunterStore
      });
      
      if (!needsEval && cachedResult) {
        // Ergebnis im lokalen Cache speichern
        cachedResults.value[build.id] = cachedResult;
        console.log(`Loaded cached result for build ${build.name} (ID: ${build.id})`);
      } else {
        console.log(`No cached result found for build ${build.name} (ID: ${build.id})`);
      }
    }
  } catch (error) {
    console.error('Error loading cached results:', error);
    loadError.value = 'Failed to load build results';
  }
}

async function loadGadgetData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Korrigiere den Aufruf von hasHunterData zu einer vorhandenen Methode im hunterStore
    // Überprüfe stattdessen, ob hunterBuilds für Knox bereits initialisiert ist
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
    
    // Lade Multiplier-Ansicht-Einstellung
    const savedShowMultipliers = localStorage.getItem('gadgetCalculator_showMultipliers');
    if (savedShowMultipliers !== null) {
      showMultipliers.value = savedShowMultipliers === 'true';
    }
    
    // Initialize with store values for wrench, zaptron, anchor
    const newCurrentLevels = { ...savedCurrentLevels };
    
    // For wrench, zaptron, and anchor, use store values if available
    if (storeUpgrades.wrench !== undefined) newCurrentLevels.wrench = storeUpgrades.wrench;
    if (storeUpgrades.zaptron !== undefined) newCurrentLevels.zaptron = storeUpgrades.zaptron;
    if (storeUpgrades.anchor !== undefined) newCurrentLevels.anchor = storeUpgrades.anchor;
    
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
  } else {
    console.log("Build not found");
    tessarectsPerDay.value = 0;
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
}

// Watch für Änderungen am hunterStore
watch(() => hunterStore.getBuildsForHunter('knox'), () => {
  // Wenn sich die Builds im Store ändern, lade die Ergebnisse neu
  loadCachedResults();
}, { deep: true });

// Initialize on mount
onMounted(async () => {
  await loadGadgetData();
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

/* Verbesserte Gadget-Styles - schlicht aber elegant */
.custom-gadget-item {
  background: linear-gradient(to bottom, rgba(35, 39, 47, 0.9), rgba(28, 32, 38, 0.95));
  border-left: 3px solid transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.custom-gadget-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-left-color: rgba(59, 130, 246, 0.5);
}

.custom-gadget-item.active-gadget {
  background: linear-gradient(to bottom, rgba(30, 41, 59, 0.9), rgba(30, 41, 55, 0.95));
  border-left-color: rgb(37, 99, 235);
  box-shadow: 0 3px 6px rgba(37, 99, 235, 0.15);
}

/* Verbesserte Multiplikatoren-Box */
.custom-gadget-item .bg-gray-900\/70 {
  background: linear-gradient(to bottom, rgba(23, 29, 35, 0.9), rgba(20, 25, 30, 0.95));
  border-radius: 0.375rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Bessere Hervorhebung für Werte */
.custom-gadget-item .text-green-400 {
  color: rgb(74, 222, 128);
  text-shadow: 0 0 3px rgba(74, 222, 128, 0.15);
}

.custom-gadget-item .text-amber-400 {
  color: rgb(251, 191, 36);
  text-shadow: 0 0 3px rgba(251, 191, 36, 0.15);
}

@media (max-width: 640px) {
  .custom-gadget-item {
    padding: 0.75rem;
  }
  
  /* Kompaktere Controls auf mobilen Geräten */
  :deep(.value-controls) {
    height: 2rem;
  }
  
  :deep(.value-controls .value-display) {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
  }
  
  :deep(.value-controls .control-button) {
    width: 1.75rem;
    height: 1.75rem;
  }
}
</style>