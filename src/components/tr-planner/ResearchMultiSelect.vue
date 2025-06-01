<template>
  <div class="research-multiselect">
    <div class="flex items-center">
      <!-- Settings Icon Button -->
      <button 
        @click="openResearchModal"
        class="p-1.5 rounded-full mr-2 hover:bg-gray-700/50 transition-colors relative"
        :style="{ color: changesMade ? '#fb923c' : '#9ca3af' }"
        :title="`Changes: ${changesMade}`"
      >
        <IconSettings size="16" />
      </button>
      
      <!-- Research Points Input mit TRValueControls -->
      <TRValueControls
        :value="parsedResearchPoints"
        :minValue="0"
        :maxValue="4465"
        :showFastControls="true"
        :step="100"
        :fastStep="1000"
        :valueClass="'text-white'"
        :autoEdit="true"
        @update:value="updateResearchPoints"
      />
    </div>
    
    <!-- Summary and Multiplier display -->
    <div v-if="selectedResearchCount > 0" class="mt-2 text-xs text-gray-400">
      <div class="flex justify-between">
        <span>Multiplier: <span class="text-blue-400">×{{ totalMultiplier.toFixed(4) }}</span></span>
      </div>
    </div>

    <!-- Research Selection Modal -->
    <div 
      v-if="isModalOpen"
      class="fixed inset-0 z-[150] overflow-y-auto bg-gray-900/90 flex items-center justify-center p-2 sm:p-4"
      @click.self="closeModal"
    >
      <div 
        class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto animate-fade-in border border-gray-700"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
          <div class="flex justify-between items-center">
            <h2 class="text-sm sm:text-base font-semibold text-white flex items-center">
              <IconMicroscope size="18" class="mr-2 text-blue-400" />
              Research Selections
            </h2>
            <div class="flex items-center gap-2">
              <!-- ✅ DEBUG: Änderungsstatus im Header -->
              <span class="text-xs px-2 py-1 rounded" :class="changesMade ? 'bg-orange-600 text-white' : 'bg-gray-600 text-gray-300'">
                {{ changesMade ? 'MODIFIED' : 'UNCHANGED' }}
              </span>
              <button 
                @click="closeModal"
                class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              >
                <IconX size="16" />
              </button>
            </div>
          </div>
        </div>

        <!-- Buttons for Auto-Selection -->
        <div class="p-3 border-b border-gray-700 bg-gray-750/50">
          <div class="flex flex-wrap gap-2">
            <button 
              @click="resetToAutoSelection"
              class="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-md text-xs"
              v-if="changesMade"
            >
              Reset to Auto
            </button>
          </div>
        </div>
        
        <!-- Research List -->
        <div class="p-3 space-y-3">
          <div 
            v-for="research in researchList" 
            :key="research.id" 
            class="bg-gray-750/60 rounded-md p-3 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <!-- Research Header with Toggle Button -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-sm font-medium text-white">{{ research.name }}</span>
              </div>
              
              <!-- Toggle Button für Research (alle Level dieser Research umschalten) -->
              <button 
                @click="toggleAllLevelsForResearch(research.id)"
                class="text-xs px-2 py-0.5 rounded-sm"
                :class="{
                  'bg-green-700 text-green-100': hasAnyLevelSelected(research.id),
                  'bg-red-700 text-red-100': isResearchAvailableByPoints(research.id) && !hasAnyLevelSelected(research.id),
                  'bg-gray-600/50 text-gray-400 cursor-not-allowed': !isResearchAvailableByPoints(research.id)
                }"
                :disabled="!isResearchAvailableByPoints(research.id)"
              >
                {{ hasAnyLevelSelected(research.id) ? 'ON' : 'OFF' }}
              </button>
            </div>
            
            <!-- Research Levels -->
            <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div 
                v-for="(level, idx) in research.levels" 
                :key="`${research.id}_${idx}`"
                class="flex items-center justify-between bg-gray-700/40 rounded-md px-2 py-1.5"
                :class="{ 'opacity-75': !isLevelAvailable(research.id, idx) }"
              >
                <div class="flex-grow">
                  <div class="flex items-center text-xs">
                    <span class="font-medium text-white">Level {{ idx + 1 }}</span>
                    <span 
                      v-if="isLevelAvailable(research.id, idx)"
                      class="ml-2 px-1 py-0.5 text-[10px] bg-green-700/40 text-green-200 rounded"
                    >
                      Unlocked
                    </span>
                    <span
                      v-else
                      class="ml-2 px-1 py-0.5 text-[10px] bg-gray-700 text-gray-300 rounded"
                    >
                      Locked
                    </span>
                  </div>
                  <div class="text-[10px] flex items-center space-x-2 mt-0.5">
                    <span class="text-gray-400">Price: <span class="text-amber-400">{{ formatNumber(level.price) }}</span></span>
                    <span class="text-gray-400">Multi: <span class="text-green-400">×{{ level.multiplier.toFixed(2) }}</span></span>
                  </div>
                </div>
                
                <!-- Individual Level Toggle Button -->
                <button 
                  @click.stop="toggleResearchLevel(research.id, idx)"
                  class="text-[10px] ml-2 px-1.5 py-0.5 rounded-sm"
                  :class="{
                    'bg-green-700 text-green-100': isLevelSelected(research.id, idx),
                    'bg-red-700 text-red-100': !isLevelSelected(research.id, idx) && isLevelAvailable(research.id, idx),
                    'bg-gray-600/50 text-gray-400 cursor-not-allowed': !canActivateLevel(research.id, idx) && !isLevelSelected(research.id, idx)
                  }"
                  :disabled="!canActivateLevel(research.id, idx) && !isLevelSelected(research.id, idx)"
                  :title="getLevelButtonTooltip(research.id, idx)"
                >
                  {{ isLevelSelected(research.id, idx) ? 'ON' : 'OFF' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0">
          <div class="flex justify-end items-center">
            <button 
              @click="closeModal"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { researchData } from '@/constants/tr-planner';
import { IconSettings, IconX, IconMicroscope } from '@tabler/icons-vue';
import TRValueControls from '@/composables/TRValueControls.vue';

// Props and Emits
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  selectedResearches: { 
    type: Array,
    default: () => []
  },
  selectedLevels: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:modelValue', 'update:selected-researches', 'update:selected-levels']);

// State
const isModalOpen = ref(false);
const shouldUpdateAutoSelections = ref(false);
const hasUserInteracted = ref(false);
const originalAutoState = ref({ researches: [], levels: {} });

// Keep track of both selected researches and selected levels
const selectedResearchesLocal = ref([...props.selectedResearches]);
const selectedLevels = ref({});

// ✅ VERBESSERTE ÄNDERUNGSERKENNUNG
const changesMade = computed(() => {
  // Bei neuen Plans ohne User-Interaktion nicht als "geändert" anzeigen
  if (!hasUserInteracted.value && selectedResearchesLocal.value.length === 0) {
    return false;
  }
  
  const currentPoints = parsedResearchPoints.value;
  const currentSelectedResearches = [...selectedResearchesLocal.value].sort();
  
  // Berechne welche Researches bei aktuellen Points automatisch ausgewählt werden würden
  const expectedAvailableResearches = availableResearchesByPoints.value.sort();
  
  // Wenn unterschiedliche Anzahl von Researches ausgewählt sind
  if (currentSelectedResearches.length !== expectedAvailableResearches.length) {
    console.log("🔍 Research count mismatch:", {
      current: currentSelectedResearches.length,
      expected: expectedAvailableResearches.length,
      hasUserInteracted: hasUserInteracted.value
    });
    return hasUserInteracted.value; // Nur als Änderung werten wenn User interagiert hat
  }
  
  // Wenn andere Researches ausgewählt sind als erwartet
  for (const researchId of currentSelectedResearches) {
    if (!expectedAvailableResearches.includes(researchId)) {
      console.log("🔍 Unexpected research selected:", researchId);
      return hasUserInteracted.value;
    }
  }
  
  // Prüfe die Level-Auswahl für jede Research
  for (const researchId of currentSelectedResearches) {
    const currentLevels = selectedLevels.value[researchId] || [];
    const levels = researchData[researchId] || [];
    
    // Berechne welche Level bei aktuellen Points automatisch ausgewählt werden würden
    const expectedLevels = [];
    for (let idx = 0; idx < levels.length; idx++) {
      const level = levels[idx];
      if (level && currentPoints >= level.price) {
        expectedLevels.push(idx);
      } else {
        break; // Stoppe bei erstem nicht-verfügbaren Level
      }
    }
    
    // Vergleiche aktuelle Level-Auswahl mit erwarteter
    if (currentLevels.length !== expectedLevels.length) {
      console.log("🔍 Level count mismatch for research", researchId, {
        current: currentLevels.length,
        expected: expectedLevels.length,
        hasUserInteracted: hasUserInteracted.value
      });
      return hasUserInteracted.value;
    }
    
    for (let i = 0; i < currentLevels.length; i++) {
      if (currentLevels[i] !== expectedLevels[i]) {
        console.log("🔍 Level mismatch for research", researchId, {
          currentLevels,
          expectedLevels,
          hasUserInteracted: hasUserInteracted.value
        });
        return hasUserInteracted.value;
      }
    }
  }
  
  console.log("🔍 No changes detected - state matches expected auto-selection");
  return false;
});

onMounted(() => {
  // Initialize selectedLevels from props
  selectedLevels.value = { ...props.selectedLevels };
  
  // ✅ KORREKTUR: Nur auto-select wenn keine Props-Daten vorhanden sind
  if (props.selectedResearches.length > 0 || Object.keys(props.selectedLevels).length > 0) {
    // Props haben Daten - diese verwenden und NICHT auto-select
    selectedResearchesLocal.value = [...props.selectedResearches];
    hasUserInteracted.value = true; // Markiere als user-modified
    console.log("🔬 Using existing research data from props:", {
      selectedResearches: selectedResearchesLocal.value,
      selectedLevels: selectedLevels.value
    });
  } else {
    // Keine Props-Daten - automatisch auswählen
    autoSelectAvailableResearches();
    hasUserInteracted.value = false;
  }
  
  saveOriginalAutoState();
});

// ✅ SICHERE Props-Überwachung
watch(() => props.selectedResearches, (newValue) => {
  try {
    selectedResearchesLocal.value = [...newValue];
    
    // ✅ RESET User-Interaktion bei neuen Props (außer es ist derselbe Array-Inhalt)
    const isSameContent = JSON.stringify([...newValue].sort()) === JSON.stringify([...selectedResearchesLocal.value].sort());
    if (!isSameContent) {
      hasUserInteracted.value = false;
    }
    
    // Update selectedLevels when selectedResearches changes
    newValue.forEach(id => {
      if (!selectedLevels.value[id]) {
        selectedLevels.value[id] = [];
        
        // By default, select all levels that are available based on points
        const levels = researchData[id] || [];
        const points = parsedResearchPoints.value;
        
        levels.forEach((level, idx) => {
          if (points >= level.price) {
            selectedLevels.value[id].push(idx);
          }
        });
      }
    });
    
    // Remove any selectedLevels entries that are no longer in selectedResearches
    Object.keys(selectedLevels.value).forEach(id => {
      if (!newValue.includes(id)) {
        delete selectedLevels.value[id];
      }
    });
    
    // ✅ UPDATE ORIGINAL STATE nach Props-Änderung
    if (!hasUserInteracted.value) {
      saveOriginalAutoState();
    }
    
  } catch (error) {
    console.warn("🚨 Props watcher error:", error);
  }
}, { flush: 'post' });

watch(() => props.selectedLevels, (newValue) => {
  try {
    if (newValue && typeof newValue === 'object') {
      selectedLevels.value = { ...newValue };
    }
  } catch (error) {
    console.warn("🚨 Selected levels watcher error:", error);
  }
}, { deep: true, flush: 'post' });

// Computed properties
const researchList = computed(() => {
  return Object.entries(researchData).map(([id, levels]) => ({
    id,
    name: `Research #${id}`,
    levels,
    minPrice: levels[0]?.price || 0,
    maxLevel: levels.length
  })).sort((a, b) => a.id.localeCompare(b.id));
});

const parsedResearchPoints = computed(() => {
  return props.modelValue;
});

const availableResearchesByPoints = computed(() => {
  const points = parsedResearchPoints.value;
  return researchList.value
    .filter(research => research.minPrice <= points)
    .map(research => research.id);
});

const selectedResearchCount = computed(() => {
  return selectedResearchesLocal.value.length;
});


const totalMultiplier = computed(() => {
  let multiplier = 1;
  
  // For each selected research
  Object.entries(selectedLevels.value).forEach(([researchId, levelIndices]) => {
    if (!selectedResearchesLocal.value.includes(researchId)) return;
    
    const levels = researchData[researchId] || [];
    let researchMultiplier = 1;
    
    // Only multiply by the levels that are both available by points AND selected
    levelIndices.forEach(idx => {
      const level = levels[idx];
      if (level && parsedResearchPoints.value >= level.price) {
        researchMultiplier *= level.multiplier;
      }
    });
    
    multiplier *= researchMultiplier;
  });
  
  return multiplier;
});

// ✅ SPEICHERE ORIGINAL AUTO-STATE
function saveOriginalAutoState() {
  const points = parsedResearchPoints.value;
  const availableResearches = availableResearchesByPoints.value;
  const autoLevels = {};
  
  availableResearches.forEach(researchId => {
    const levels = researchData[researchId] || [];
    autoLevels[researchId] = [];
    
    for (let idx = 0; idx < levels.length; idx++) {
      const level = levels[idx];
      if (level && points >= level.price) {
        autoLevels[researchId].push(idx);
      } else {
        break;
      }
    }
  });
  
  originalAutoState.value = {
    researches: [...availableResearches],
    levels: { ...autoLevels }
  };
  
  console.log("💾 Saved original auto state:", originalAutoState.value);
}

function updateResearchPoints(newValue) {
  console.log("🔄 updateResearchPoints called");
  
  emit('update:modelValue', newValue);
  shouldUpdateAutoSelections.value = true;
  
  // ✅ NUR als User-Interaktion werten wenn Modal offen ist
  if (isModalOpen.value) {
    hasUserInteracted.value = true;
  }
  
  updateAvailableLevelsBasedOnPoints(newValue);
}

function updateAvailableLevelsBasedOnPoints(points) {
  // Update which levels are available based on new points
  researchList.value.forEach(research => {
    if (selectedLevels.value[research.id]) {
      selectedLevels.value[research.id] = selectedLevels.value[research.id].filter(idx => {
        const level = research.levels[idx];
        return level && points >= level.price;
      });
      
      // If no levels are selected anymore, remove the research from selections
      if (selectedLevels.value[research.id].length === 0) {
        const index = selectedResearchesLocal.value.indexOf(research.id);
        if (index !== -1) {
          selectedResearchesLocal.value.splice(index, 1);
          delete selectedLevels.value[research.id];
          emitChanges();
        }
      }
    }
  });
}

function openResearchModal() {
  console.log("🔄 Opening modal");
  isModalOpen.value = true;
  
  // ✅ MARKIERE USER-INTERAKTION nur beim erstmaligen Öffnen
  hasUserInteracted.value = true;
  
  if (shouldUpdateAutoSelections.value) {
    autoSelectAvailableResearches();
    shouldUpdateAutoSelections.value = false;
  }
}

function closeModal() {
  isModalOpen.value = false;
  console.log("🔄 Modal closed");
}

function autoSelectAvailableResearches() {
  // ✅ KEINE User-Interaktion markieren bei automatischer Auswahl
  
  // Für jede verfügbare Research, wähle sie aus, wenn sie nicht bereits ausgewählt ist
  availableResearchesByPoints.value.forEach(researchId => {
    if (!selectedResearchesLocal.value.includes(researchId)) {
      // Research hinzufügen
      selectedResearchesLocal.value.push(researchId);
      
      // Alle verfügbaren Level auswählen
      if (!selectedLevels.value[researchId]) {
        selectedLevels.value[researchId] = [];
      }
      
      const levels = researchData[researchId] || [];
      const points = parsedResearchPoints.value;
      
      levels.forEach((level, idx) => {
        if (points >= level.price && !selectedLevels.value[researchId].includes(idx)) {
          selectedLevels.value[researchId].push(idx);
        }
      });
    }
  });
  
  emitChanges();
}

function toggleAllLevelsForResearch(researchId) {
  console.log("🔄 toggleAllLevelsForResearch called");
  hasUserInteracted.value = true; // ✅ User hat interagiert
  
  if (!isResearchAvailableByPoints(researchId)) {
    return;
  }
  
  const hasLevels = hasAnyLevelSelected(researchId);
  
  if (hasLevels) {
    // Alle Level ausschalten
    if (selectedLevels.value[researchId]) {
      selectedLevels.value[researchId] = [];
    }
    
    // Wenn keine Level mehr ausgewählt sind, entferne die Research aus der Auswahl
    const index = selectedResearchesLocal.value.indexOf(researchId);
    if (index !== -1) {
      selectedResearchesLocal.value.splice(index, 1);
    }
  } else {
    // ✅ SEQUENTIELLE AKTIVIERUNG: Alle verfügbaren Level in Reihenfolge aktivieren
    if (!selectedResearchesLocal.value.includes(researchId)) {
      selectedResearchesLocal.value.push(researchId);
    }
    
    if (!selectedLevels.value[researchId]) {
      selectedLevels.value[researchId] = [];
    }
    
    // Wähle alle verfügbaren Level sequentiell aus
    const levels = researchData[researchId] || [];
    const points = parsedResearchPoints.value;
    const newLevels = [];
    
    // ✅ SEQUENTIELL: Level 0, 1, 2, ... bis erstes nicht-verfügbares Level
    for (let idx = 0; idx < levels.length; idx++) {
      const level = levels[idx];
      if (level && points >= level.price) {
        newLevels.push(idx);
      } else {
        // Stoppe bei erstem nicht-verfügbaren Level
        break;
      }
    }
    
    selectedLevels.value[researchId] = newLevels;
  }
  
  emitChanges();
}

// Hilfsfunktion: Prüft, ob eine Research irgendwelche Level ausgewählt hat
function hasAnyLevelSelected(researchId) {
  return selectedResearchesLocal.value.includes(researchId) && 
         selectedLevels.value[researchId] && 
         selectedLevels.value[researchId].length > 0;
}

function toggleResearchLevel(researchId, levelIdx) {
  console.log("🔄 toggleResearchLevel called", researchId, levelIdx);
  hasUserInteracted.value = true; // ✅ User hat interagiert
  
  // Nicht-verfügbare Level können nicht aktiviert werden
  if (!isLevelAvailable(researchId, levelIdx) && !isLevelSelected(researchId, levelIdx)) {
    return;
  }
  
  // Prüfen, ob die Research überhaupt ausgewählt ist
  if (!isResearchSelected(researchId)) {
    selectedResearchesLocal.value.push(researchId);
  }
  
  // Initialize the array if it doesn't exist
  if (!selectedLevels.value[researchId]) {
    selectedLevels.value[researchId] = [];
  }
  
  const currentLevels = selectedLevels.value[researchId];
  const isCurrentlySelected = currentLevels.includes(levelIdx);
  
  if (isCurrentlySelected) {
    // ✅ DEAKTIVIERUNG: Entferne dieses Level und alle nachfolgenden
    selectedLevels.value[researchId] = currentLevels.filter(idx => idx < levelIdx);
  } else {
    // ✅ AKTIVIERUNG: Nur möglich wenn es das nächste sequentielle Level ist
    const maxSelectedLevel = currentLevels.length > 0 ? Math.max(...currentLevels) : -1;
    const expectedNextLevel = maxSelectedLevel + 1;
    
    if (levelIdx === expectedNextLevel) {
      // Korrekte Reihenfolge - Level hinzufügen
      selectedLevels.value[researchId].push(levelIdx);
      selectedLevels.value[researchId].sort((a, b) => a - b);
    } else {
      // ✅ FALSCHE REIHENFOLGE: Automatisch alle Level bis zu diesem aktivieren
      const levels = researchData[researchId] || [];
      const points = parsedResearchPoints.value;
      
      // Erstelle neue Array mit Level 0 bis levelIdx (wenn verfügbar)
      const newLevels = [];
      for (let i = 0; i <= levelIdx; i++) {
        const level = levels[i];
        if (level && points >= level.price) {
          newLevels.push(i);
        } else {
          // Wenn ein Level nicht verfügbar ist, stoppe hier
          break;
        }
      }
      
      selectedLevels.value[researchId] = newLevels;
    }
  }
  
  // Wenn keine Level mehr ausgewählt sind, entferne die Research aus der Auswahl
  if (selectedLevels.value[researchId].length === 0) {
    const index = selectedResearchesLocal.value.indexOf(researchId);
    if (index !== -1) {
      selectedResearchesLocal.value.splice(index, 1);
    }
    delete selectedLevels.value[researchId];
  }
  
  emitChanges();
}

function selectAllAvailable() {
  console.log("🔄 selectAllAvailable called");
  hasUserInteracted.value = true; // ✅ User hat interagiert
  
  // Select all researches that are available based on points
  const availableResearches = availableResearchesByPoints.value;
  
  // Clear previous selections
  selectedResearchesLocal.value = [...availableResearches];
  selectedLevels.value = {};
  
  // For each research, select all available levels
  availableResearches.forEach(researchId => {
    selectedLevels.value[researchId] = [];
    const levels = researchData[researchId] || [];
    const points = parsedResearchPoints.value;
    
    // ✅ SEQUENTIELL: Level 0, 1, 2, ... bis erstes nicht-verfügbares Level
    for (let idx = 0; idx < levels.length; idx++) {
      const level = levels[idx];
      if (level && points >= level.price) {
        selectedLevels.value[researchId].push(idx);
      } else {
        break;
      }
    }
  });
  
  emitChanges();
}

function selectAll() {
  console.log("🔄 selectAll called");
  hasUserInteracted.value = true; // ✅ User hat interagiert
  
  // Select all researches
  selectedResearchesLocal.value = researchList.value.map(r => r.id);
  selectedLevels.value = {};
  
  // For each research, select all levels
  researchList.value.forEach(research => {
    selectedLevels.value[research.id] = Array.from(Array(research.levels.length).keys());
  });
  
  emitChanges();
}

function clearAll() {
  console.log("🔄 clearAll called");
  hasUserInteracted.value = true; // ✅ User hat interagiert
  
  selectedResearchesLocal.value = [];
  selectedLevels.value = {};
  
  emitChanges();
}

// ✅ NEUE FUNKTION: Reset zu Auto-Selection
function resetToAutoSelection() {
  console.log("🔄 resetToAutoSelection called");
  
  // Automatische Auswahl neu durchführen
  const availableResearches = availableResearchesByPoints.value;
  selectedResearchesLocal.value = [...availableResearches];
  selectedLevels.value = {};
  
  // For each research, select all available levels
  availableResearches.forEach(researchId => {
    selectedLevels.value[researchId] = [];
    const levels = researchData[researchId] || [];
    const points = parsedResearchPoints.value;
    
    for (let idx = 0; idx < levels.length; idx++) {
      const level = levels[idx];
      if (level && points >= level.price) {
        selectedLevels.value[researchId].push(idx);
      } else {
        break;
      }
    }
  });
  
  // ✅ RESET User-Interaktion
  hasUserInteracted.value = false;
  
  emitChanges();
}

// Prüft, ob ein Level aktiviert werden kann (sequentielle Reihenfolge)
function canActivateLevel(researchId, levelIdx) {
  // Bereits ausgewählte Level können immer deaktiviert werden
  if (isLevelSelected(researchId, levelIdx)) {
    return true;
  }
  
  // Level muss verfügbar sein
  if (!isLevelAvailable(researchId, levelIdx)) {
    return false;
  }
  
  // Prüfe sequentielle Reihenfolge
  const currentLevels = selectedLevels.value[researchId] || [];
  const maxSelectedLevel = currentLevels.length > 0 ? Math.max(...currentLevels) : -1;
  const expectedNextLevel = maxSelectedLevel + 1;
  
  return levelIdx === expectedNextLevel;
}

// Tooltip für Level-Button
function getLevelButtonTooltip(researchId, levelIdx) {
  if (isLevelSelected(researchId, levelIdx)) {
    return 'Click to deactivate this level (and all following levels)';
  }
  
  if (!isLevelAvailable(researchId, levelIdx)) {
    return 'Not enough research points';
  }
  
  if (!canActivateLevel(researchId, levelIdx)) {
    return 'Activate previous levels first';
  }
  
  return 'Click to activate this level';
}

// ✅ SICHERE emitChanges Funktion
function emitChanges() {
  try {
    emit('update:selected-researches', [...selectedResearchesLocal.value]);
    emit('update:selected-levels', { ...selectedLevels.value });
    selectedLevels.value = { ...selectedLevels.value }; // Trigger reactivity
  } catch (error) {
    console.warn("🚨 Emit error:", error);
  }
}

function isResearchSelected(researchId) {
  return selectedResearchesLocal.value.includes(researchId);
}

function isLevelSelected(researchId, levelIdx) {
  return selectedLevels.value[researchId]?.includes(levelIdx) || false;
}

function isResearchAvailableByPoints(researchId) {
  return availableResearchesByPoints.value.includes(researchId);
}

function isLevelAvailable(researchId, levelIdx) {
  const levels = researchData[researchId] || [];
  const level = levels[levelIdx];
  return level && parsedResearchPoints.value >= level.price;
}

function formatNumber(num) {
  return num.toLocaleString();
}
</script>

<style scoped>
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

.bg-gray-650 {
  background-color: rgba(55, 60, 68, 0.8);
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}
</style>