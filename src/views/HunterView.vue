<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/HunterView.vue -->
<template>
  <div class="px-0.5 py-4 container mx-auto">
    <!-- Top Section mit integriertem Header und Aktionsleiste -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <!-- Header mit Farb-Gradient -->
      <div :class="`bg-gradient-to-r ${getGradientColors()} px-5 py-5 sm:py-0.5 border-b border-gray-600`">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- Hunter-Bild -->
            <div class="hidden sm:flex items-center justify-center">
              <img 
                :src="hunterImage" 
                :alt="currentHunter.name" 
                class="object-contain rounded-lg select-none"
                style="filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));"
                @click="handleHunterImageClick"
                draggable="false"
              />
            </div>
            
            <!-- Titel und Beschreibung -->
            <div>
              <h1 class="text-2xl font-bold mb-1 text-shadow-lg/40">{{ currentHunter.name }} Simulator</h1>
              <p class="text-sm text-gray-300 text-shadow-lg/30">Compare builds and optimize your performance</p>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="flex flex-row flex-wrap justify-end gap-2">
            <!-- Stats -->
            <button
              @click="openStatsModal"
              class="flex items-center space-x-1 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconChartArrowsVertical size="16" />
              <span>{{ currentHunter.name }} Stats</span>
            </button>

            <!-- New Build -->
            <button
              @click="openBuildModal"
              class="flex items-center space-x-1 px-3 py-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconPlus size="16" />
              <span>New Build</span>
            </button>

            <!-- Import -->
            <button
              @click="openBuildCodeModal"
              class="flex items-center space-x-1 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconDownload size="16" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Settings Bar -->
      <div class="bg-gray-800 py-3 px-4 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400">Settings:</span>
          
          <!-- Iterations -->
          <button
            class="flex items-center gap-2 px-1 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
            @click="openIterationsModal"
          >
            <IconRepeat size="16" class="text-blue-400" />
            <span>{{ iterationValue }} iterations</span>
          </button>
          
          <!-- Statistics -->
          <div class="hidden md:flex items-center gap-2">
            <button
              @click="setDisplayMode('Vertical')"
              class="flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors"
              :class="displaySettings.displayMode === 'Vertical' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
              title="Vertical View"
            >
              <IconLayoutDistributeVertical size="16" class="text-blue-400" />
              <span>Vertical</span>
            </button>
            <button
              @click="setDisplayMode('Horizontal')"
              class="flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors"
              :class="displaySettings.displayMode === 'Horizontal' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'"
              title="Horizontal View"
            >
              <IconLayoutDistributeHorizontal size="16" class="text-blue-400" />
              <span>Horizontal</span>
            </button>
          </div>
        </div>
        
        <!-- Build Filter Switch -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <!-- Temporary Upgrades Dropdown - Mobile: eigene Zeile, Desktop: inline -->
          <div class="w-full sm:w-auto">
            <TemporaryUpgradesDropdown 
              :hunterId="currentHunter?.id"
              @upgradeChanged="handleUpgradeChanged"
            />
          </div>
          
          <!-- View Controls -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <span class="text-sm text-gray-400">View:</span>
            <div class="flex gap-2">
            <button 
              @click="buildFilterMode = 'active'"
              class="flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors duration-200 text-xs sm:text-sm"
              :class="buildFilterMode === 'active' ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'"
            >
              <span>Active</span>
              <span class="text-xs opacity-75">({{ activeBuildsCount }})</span>
            </button>
            <button 
              @click="buildFilterMode = 'archived'"
              class="flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors duration-200 text-xs sm:text-sm"
              :class="buildFilterMode === 'archived' ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'"
            >
              <span>Archived</span>
              <span class="text-xs opacity-75">({{ archivedBuildsCount }})</span>
            </button>
          </div>
            <button 
              @click="showLootFilterModal = true"
              class="md:hidden flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconFilter size="14" class="text-blue-400" />
              <span>Loot Filter</span>
            </button>        
          </div>
        </div>
      </div>
    </div>
    
    <!-- Neue Build-Resultate -->
    <div v-if="builds.length > 0">
  <!-- Nur auf Desktop anzeigen: Vertikale Ansicht oder Horizontale Ansicht -->
  <div class="hidden md:block">
    <!-- Vertikale Ansicht Draggable -->
    <Draggable 
      v-if="displaySettings.displayMode === 'Vertical'"
      v-model="builds"
      :componentData="{
        tag: 'div',
        type: 'transition-group',
        name: 'flip-list',
        class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      }"
      handle=".grip-handle"
      :group="{ name: 'builds' }"
      itemKey="id"
      :animation="200"
      ghostClass="ghost"
      chosenClass="chosen"
      dragClass="dragging"
      @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div 
          class="build-card-wrapper"
          :style="{ viewTransitionName: getBuildTransitionName(element.id) }"
        >
          <BuildCardVertical 
            :build-id="element.id"
            :hunter-id="element.hunterId || route.params.hunterId"
            :build-data="element"
            :index="index"
            :is-reference-build="element.id === referenceBuildId"
            @name-changed="handleNameChanged"
            @edit="editBuild"
            @clone="cloneBuild"
            @archive="archiveBuild"
            @delete="deleteBuild"
            @evaluated="handleBuildEvaluated"
            @overridesBuild="openOverrideModal"
            @reevaluate="handleBuildReevaluate"
          />
        </div>
      </template>
    </Draggable>

    <!-- Horizontale Ansicht Draggable -->
    <Draggable 
      v-else
      v-model="builds"
      :componentData="{
        tag: 'div',
        type: 'transition-group',
        name: 'flip-list',
        class: 'space-y-2'
      }"
      handle=".grip-handle"
      :group="{ name: 'builds' }"
      itemKey="id"
      :animation="200"
      ghostClass="ghost"
      chosenClass="chosen"
      dragClass="dragging"
      @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div 
          class="build-compact-wrapper"
          :style="{ viewTransitionName: getBuildTransitionName(element.id) }"
        >
          <BuildCardHorizontal 
            :build-id="element.id"
            :hunter-id="element.hunterId || route.params.hunterId"
            :build-data="element"
            :auto-evaluate="true"
            :index="index"
            :is-reference-build="element.id === referenceBuildId"
            :reference-results="referenceBuildResults"
            :result-labels="resultLabels"
            :results="evaluationResults[element.id]?.results"
            :is-loading="evaluationResults[element.id]?.isLoading"
            :has-error="evaluationResults[element.id]?.hasError"
            :progress-iteration="evaluationResults[element.id]?.progressIteration || 0"
            :total-iterations="hunterIterations"
            @name-changed="handleNameChanged"
            @edit="editBuild"
            @clone="cloneBuild"
            @archive="archiveBuild"
            @delete="deleteBuild"
            @evaluated="handleBuildEvaluated"
            @overridesBuild="openOverrideModal"
            @reevaluate="handleBuildReevaluate"
          />
        </div>
      </template>
    </Draggable>
  </div>

  <!-- Mobile Ansicht: Immer die Mobile-Karte anzeigen -->
  <div class="md:hidden">
    <Draggable 
      v-model="builds"
      :componentData="{
        tag: 'div',
        type: 'transition-group',
        name: 'flip-list',
        class: 'space-y-3'
      }"
      handle=".grip-handle"
      :group="{ name: 'builds' }"
      itemKey="id"
      :animation="200"
      ghostClass="ghost"
      chosenClass="chosen"
      dragClass="dragging"
      @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div 
          class="build-mobile-wrapper"
          :style="{ viewTransitionName: getBuildTransitionName(element.id) }"
        >
          <BuildCardMobile
            :build-id="element.id"
            :hunter-id="element.hunterId || route.params.hunterId"
            :build-data="element"
            :auto-evaluate="true"
            :index="index"
            :is-reference-build="element.id === referenceBuildId"
            :reference-results="referenceBuildResults"
            :result-labels="resultLabels"
            :results="evaluationResults[element.id]?.results"
            :is-loading="evaluationResults[element.id]?.isLoading"
            :has-error="evaluationResults[element.id]?.hasError"
            :progress-iteration="evaluationResults[element.id]?.progressIteration || 0"
            :total-iterations="hunterIterations"
            @name-changed="handleNameChanged"
            @edit="editBuild"
            @clone="cloneBuild"
            @archive="archiveBuild"
            @delete="deleteBuild"
            @evaluated="handleBuildEvaluated"
            @overridesBuild="openOverrideModal"
            @reevaluate="handleBuildReevaluate"
          />
        </div>
      </template>
    </Draggable>
  </div>
</div>
    
    <!-- Leerer State wenn keine Builds vorhanden -->
    <div 
      v-if="filteredBuilds.length === 0" 
      class="col-span-full p-8 text-center bg-gray-800 border border-gray-700 rounded-lg"
    >
      <IconRobot size="75" class="mx-auto mb-4 text-gray-600" />
      <h3 class="text-xl font-semibold mb-2">No builds found</h3>
      <p class="text-gray-400 mb-4">
        {{ buildFilterMode === 'active' ? 'You don\'t have any active builds for this hunter yet.' : 'You don\'t have any archived builds for this hunter.' }}
      </p>
      <button
        v-if="buildFilterMode === 'active'"
        @click="openBuildModal"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Create your first build
      </button>
      <button
        v-else
        @click="buildFilterMode = 'active'"
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
      >
        Back to active builds
      </button>
    </div>
    
    <!-- Stats Modal -->
    <StatsModal 
      v-if="showStatsModal" 
      :isVisible="showStatsModal" 
      :hunterType="route.params.hunterId"
      @close="showStatsModal = false" 
      @evaluateAll="evaluateAllBuilds"
    />

    <!-- Iterations Modal ersetzen durch die neue Komponente -->
    <IterationsModal
      :isVisible="isIterationsModalOpen"
      :hunterType="route.params.hunterId"
      :currentIterations="iterationValue"
      @close="closeIterationsModal"
      @update:iterations="updateIterationValue"
    />

    <!-- Statistics Modal -->
    <StatisticsDisplayModal
      :isVisible="isStatisticsModalOpen"
      :hunterType="route.params.hunterId"
      @close="closeStatisticsModal"
      @update:displaySettings="onDisplaySettingsUpdated"
    />
    
    <!-- Build Code Modal -->
    <BuildImportModal
      :show="isBuildCodeModalOpen"
      :prefilled-code="importCodeFromUrl"
      @close="closeBuildCodeModal"
      @import-build="importBuild"
    />
    
    <!-- Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white flex items-center"
        :class="{ 
          'bg-green-600': toast.type === 'success',
          'bg-red-600': toast.type === 'error',
          'bg-blue-600': toast.type === 'info'
        }"
      >
        <div v-if="toast.type === 'success'">
          <IconCircleCheck size="20" class="mr-2" />
        </div>
        <div v-else-if="toast.type === 'error'">
          <IconAlertCircle size="20" class="mr-2" />
        </div>
        <div v-else>
          <IconInfoCircle size="20" class="mr-2" />
        </div>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Build Modal -->
    <BuildModal 
      :isVisible="isBuildModalOpen"
      :hunterType="route.params.hunterId"
      :buildToEdit="buildToEdit"
      @close="closeBuildModal"
      @buildCreated="onBuildCreated"
      @buildUpdated="onBuildUpdated"
    />

    <OverrideModal
      :isVisible="isOverrideModalOpen"
      :hunterType="route.params.hunterId"
      :hunterColor="hunterColor"
      :buildName="selectedBuildForOverrides?.name || ''"
      :buildId="selectedBuildForOverrides?.id"
      :currentOverrides="selectedBuildForOverrides?.overrides || {}"
      @close="closeOverrideModal"
      @overridesUpdated="onOverridesUpdated"
    />

    <!-- MobileLootFilterModal -->
    <MobileLootFilterModal
      :isVisible="showLootFilterModal"
      :filters="lootFilters"
      :hunterId="route.params.hunterId"
      @close="showLootFilterModal = false"
      @update:filters="updateLootFilters"
    />

    <!-- Gadgets Cost Modal -->
    <GadgetsCostModal
      :isVisible="isGadgetCostModalOpen"
      :builds="builds"
      @close="closeGadgetCostModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, provide, watchEffect, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NAVIGATION } from '../constants/navigation';
import { useHunterStore } from '../store/hunterStore';
import { useGemPlannerStore } from '../store/gemPlannerStore';
import { getHunterById } from '../constants/hunters'; 
import { 
  IconChartBar, 
  IconPlus, 
  IconFileBarcode, 
  IconRepeat, 
  IconChartDonut,
  IconAdjustmentsHorizontal,
  IconFolderOff,
  IconDownload,
  IconRobot,
  IconChartArrowsVertical,
  // Neue Icons für die Toast-Nachrichten
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconLayoutDistributeVertical,
  IconLayoutDistributeHorizontal,
  IconFilter,
  IconCalculator,
  IconSeedling
} from '@tabler/icons-vue';

import StatsModal from '../components/common/StatsModal.vue';
import BuildModal from '@/components/common/BuildModal.vue';
import IterationsModal from '@/components/common/IterationsModal.vue';
import Draggable from 'vuedraggable';
import OverrideModal from '../components/common/OverrideModal.vue';
import BuildImportModal from '@/components/builds/BuildImportModal.vue';
import StatisticsDisplayModal from '@/components/common/StatisticsDisplayModal.vue';
import BuildCardVertical from '@/components/builds/Views/verticalView/BuildCardVertical.vue'; 
import BuildCardHorizontal from '@/components/builds/Views/horizontalView/BuildCardHorizontal.vue';
import BuildCardMobile from '@/components/builds/Views/mobileView/BuildCardMobile.vue';
import MobileLootFilterModal from '@/components/common/MobileLootFilterModal.vue';
import GadgetsCostModal from '@/components/common/GadgetsCostModal.vue';
import SeedToggle from '@/components/common/SeedToggle.vue';
import TemporaryUpgradesDropdown from '@/components/common/TemporaryUpgradesDropdown.vue';

const router = useRouter();
const route = useRoute();
const importCodeFromUrl = ref('');

const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Track if we're in an in-page transition (add/delete)
const isInPageTransition = ref(false);

// Generic smooth transition wrapper
function withSmoothTransition(updateFn) {
  if (document.startViewTransition) {
    isInPageTransition.value = true;
    document.documentElement.classList.add('in-page-transition');
    const transition = document.startViewTransition(() => {
      updateFn();
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove('in-page-transition');
      isInPageTransition.value = false;
    });
  } else {
    updateFn();
  }
}

// Helper to get view transition name only during in-page transitions
function getBuildTransitionName(buildId) {
  // Check if we're in an in-page transition (add/delete), not a route transition
  const hasAttribute = document.documentElement.hasAttribute('data-in-page-transition');
  return (isInPageTransition.value || hasAttribute) ? `build-card-${buildId}` : undefined;
}

// Hunter-spezifische Daten
const hunterIdMap = {
  'borge': 0,
  'ozzy': 1,
  'knox': 2
};

// Aktueller Hunter basierend auf der Route
const currentHunter = computed(() => {
  const hunterId = route.params.hunterId || 'borge';
  const hunterIndex = hunterIdMap[hunterId] || 0;
  return NAVIGATION.hunters[hunterIndex];
});

// Hunter-Information aus zentraler Konfiguration abrufen
const hunterColor = computed(() => currentHunter.value.color);

// UI-Status
const buildFilterMode = ref('active');
const buildCode = ref('');

// Easter Egg State
const clickCount = ref(0);
const showDancingImage = ref(false);

// Durch den neuen Toast-State im selben Format wie in SettingsView
const toast = ref({ show: false, message: '', type: 'info' });

// Füge auch resultLabels und evaluationResults State hinzu, falls noch nicht vorhanden
const resultLabels = ref({});
const evaluationResults = ref({});

const hunterIterations = computed(() => hunterStore.hunterIterations[route.params.hunterId] || 1000);

// Modale Status
const showStatsModal = ref(false);
const isIterationsModalOpen = ref(false);
const isStatisticsModalOpen = ref(false);
const isBuildCodeModalOpen = ref(false);
const isBuildModalOpen = ref(false);
const buildToEdit = ref(null);

// Refs für das Override-Modal
const isOverrideModalOpen = ref(false);
const selectedBuildForOverrides = ref(null);

const builds = ref([]);

// Refs für Mobile Filter Modal
const showLootFilterModal = ref(false);
const lootFilters = ref({
  mat1: true,
  mat2: true,
  mat3: true,
  xp: true
});

// Hunter-Bild-URL direkt aus dem hunters.js-Modul
const hunterImage = computed(() => {
  const hunterId = route.params.hunterId || 'borge';
  const hunter = getHunterById(hunterId);
  
  // Zeige Dancing-Bild wenn Easter Egg aktiviert ist
  if (showDancingImage.value && hunter?.easter_egg_image) {
    return hunter.easter_egg_image;
  }
  
  return hunter?.image || ''; // Verwende die Icon-URL aus hunters.js
});

// Override-Modal öffnen
function openOverrideModal(build) {
  selectedBuildForOverrides.value = build;
  isOverrideModalOpen.value = true;
}


// Override-Modal schließen
function closeOverrideModal() {
  isOverrideModalOpen.value = false;
  selectedBuildForOverrides.value = null;
}

// GadgetCostModal 
// ref für Gadget Modal hinzu
const isGadgetCostModalOpen = ref(false);

// Funktion zum Öffnen des Gadget-Kosten-Modals
function openGadgetCostModal() {
  isGadgetCostModalOpen.value = true;
}

// Funktion zum Schließen des Gadget-Kosten-Modals
function closeGadgetCostModal() {
  isGadgetCostModalOpen.value = false;
}

// Event-Handler für aktualisierte Overrides
function onOverridesUpdated(payload) {
  // Prüfe, ob wir das neue Format mit buildId haben
  if (typeof payload === 'object' && 'buildId' in payload) {
    const { buildId, overrides } = payload;
    
    // Finde den Build in der lokalen Liste
    const buildIndex = builds.value.findIndex(b => b.id === buildId);
    if (buildIndex !== -1) {
      // Aktualisiere nur die Overrides des Builds, NICHT die globalen Werte
      builds.value[buildIndex].overrides = { ...overrides };
      
      // Aktualisiere im Store
      hunterStore.updateBuildOverrides(buildId, overrides);
    }
  } else {
    // Altes Format - direktes Overrides-Objekt
    console.warn("Deprecated format in onOverridesUpdated");
    // Führe keine Aktion aus oder handle den alten Fall anders
  }
}

// Aktualisiere die Anzahl der Builds
const activeBuildsCount = computed(() => {
  const allBuilds = hunterStore.getBuildsForHunter(route.params.hunterId) || [];
  return allBuilds.filter(build => !build.isArchived).length;
});

const archivedBuildsCount = computed(() => {
  const allBuilds = hunterStore.getBuildsForHunter(route.params.hunterId) || [];
  return allBuilds.filter(build => build.isArchived).length;
});

// Hilfsfunktion für den Farbverlauf basierend auf dem Hunter
function getGradientColors() {
  const colorMap = {
    'red': 'from-red-900 to-gray-800',
    'green': 'from-green-900 to-gray-800',
    'blue': 'from-blue-900 to-gray-800'
  };
  return colorMap[currentHunter.value.color] || 'from-gray-800 to-gray-700';
}

// Aktionen

function openStatsModal() {
  showStatsModal.value = true;
}

const iterationValue = computed(() => {
  return hunterStore.getIterations(route.params.hunterId) || 1000;
});

function openIterationsModal() {
  isIterationsModalOpen.value = true;
}

function closeIterationsModal() {
  isIterationsModalOpen.value = false;
}

function updateIterationValue(newValue) {
  // Der Store wird direkt durch das Modal aktualisiert
  // Kein explizites Update notwendig
}

function closeStatisticsModal() {
  isStatisticsModalOpen.value = false;
  // Hier würdest du die neuen Statistik-Einstellungen speichern
}

function openBuildCodeModal() {
  isBuildCodeModalOpen.value = true;
}

function closeBuildCodeModal() {
  isBuildCodeModalOpen.value = false;
  buildCode.value = '';
}

// Build-Import
async function importBuild(build) {
  if (!build) {
    showToastMessage('Error: Invalid build code', 'error');
    return;
  }
  
  // Check if the build is for the correct hunter type
  if (build.hunter !== route.params.hunterId) {
    // Automatically redirect to the correct hunter and import the build there
    const correctHunterPath = `/${build.hunter}`;
    showToastMessage(`Redirecting to ${build.hunter.charAt(0).toUpperCase() + build.hunter.slice(1)} and importing build...`, 'info');
    
    // Store the build data in the hunterStore for cross-navigation transfer
    hunterStore.setPendingBuildImport(build);
    
    // Close current modal first
    closeBuildCodeModal();
    
    // Wait a tick to ensure modal is closed and store is updated
    await nextTick();
    
    // Navigate to the correct hunter - the build will be automatically imported there
    router.push(correctHunterPath);
    return;
  }
  
  // Statt den Build direkt zu speichern, öffnen wir ihn im BuildModal zur Bearbeitung
  buildToEdit.value = {
    ...build,
    hunterId: route.params.hunterId, // Stelle sicher, dass die hunterId gesetzt ist
    // Kein timestamp oder id setzen - das erfolgt erst beim Speichern
  };
  
  // BuildModal öffnen
  isBuildModalOpen.value = true;
  
  // Bestätigung anzeigen
  showToastMessage(`Build imported and ready to edit. Click Save to keep it.`, 'info');
  
  // Import-Modal schließen
  closeBuildCodeModal();
}

function evaluateAllBuilds() {
  showToastMessage('Evaluating all builds...', 'info');
  showStatsModal.value = false;
}

function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Easter Egg: Hunter Image Click Handler
function handleHunterImageClick() {
  if (showDancingImage.value) return; // Bereits aktiviert
  
  clickCount.value++;
  
  // Easter Egg aktivieren nach 5 Klicks
  if (clickCount.value >= 5) {
    showDancingImage.value = true;
  }
}

// BuildModal öffnen (für neuen Build)
function openBuildModal() {
  buildToEdit.value = null;
  isBuildModalOpen.value = true;
}

// BuildModal zum Bearbeiten eines Builds öffnen
function editBuild(build) {
  buildToEdit.value = build;
  isBuildModalOpen.value = true;
}

// BuildModal schließen
function closeBuildModal() {
  isBuildModalOpen.value = false;
  buildToEdit.value = null;
}

// Event-Handler für erstellten Build
function onBuildCreated(build) {
  // Aktualisiere die lokale Liste der Builds
  // Wichtig: Die Builds müssen manuell aktualisiert werden!
  if (build) {
    const updatedBuilds = hunterStore.getOrderedBuildsForHunter(route.params.hunterId) || [];
    builds.value = updatedBuilds.filter(b => 
      (buildFilterMode.value === 'active' && !b.isArchived) || 
      (buildFilterMode.value === 'archived' && b.isArchived)
    );
  }
  
  showToastMessage(`Build "${build.name}" created`, 'success');
}


// Event-Handler für aktualisierten Build
function onBuildUpdated(build) {  
  // Aktualisiere die lokale Liste der Builds
  if (build) {
    const updatedBuilds = hunterStore.getOrderedBuildsForHunter(route.params.hunterId) || [];
    builds.value = updatedBuilds.filter(b => 
      (buildFilterMode.value === 'active' && !b.isArchived) || 
      (buildFilterMode.value === 'archived' && b.isArchived)
    );
  }
  
  showToastMessage(`Build "${build.name}" updated`, 'success');
}

// Build-Aktionen
function cloneBuild(build) {
  // Erstelle eine tiefe Kopie des Builds
  const clonedBuild = JSON.parse(JSON.stringify(build));
  
  // ID entfernen, damit eine neue generiert wird
  delete clonedBuild.id;
  
  // Zeitstempel aktualisieren
  clonedBuild.timestamp = Date.now();
  
  // Archiviert-Status zurücksetzen (falls der Original-Build archiviert war)
  clonedBuild.isArchived = false;
  
  // Name anpassen mit fortlaufender Nummer
  let baseName = build.name;
  let copyNumber = 1;
  
  // Prüfe, ob der Name bereits "(Copy)" oder "(Copy X)" enthält
  const copyRegex = /\s*\(Copy(?:\s+(\d+))?\)\s*$/;
  const match = baseName.match(copyRegex);
  
  if (match) {
    // Entferne den "(Copy X)" Teil vom Namen
    baseName = baseName.replace(copyRegex, '');
    
    // Wenn eine Zahl in den Klammern war, verwende sie als Startpunkt
    if (match[1]) {
      copyNumber = parseInt(match[1]) + 1;
    } else {
      copyNumber = 2; // Wenn es nur "(Copy)" war, starte mit "(Copy 2)"
    }
  }
  
  // Suche nach existierenden Kopien mit dem gleichen Basisnamen
  const existingCopies = builds.value.filter(b => {
    const existingMatch = b.name.match(new RegExp(`^${escapeRegExp(baseName)}\\s*\\(Copy(?:\\s+(\\d+))?\\)\\s*$`));
    return existingMatch !== null;
  });
  
  // Finde die höchste existierende Kopienummer
  existingCopies.forEach(b => {
    const existingMatch = b.name.match(/\(Copy\s+(\d+)\)/);
    if (existingMatch && existingMatch[1]) {
      const num = parseInt(existingMatch[1]);
      if (num >= copyNumber) {
        copyNumber = num + 1;
      }
    }
  });
  
  // Setze den neuen Namen
  if (copyNumber === 1) {
    clonedBuild.name = `${baseName} (Copy)`;
  } else {
    clonedBuild.name = `${baseName} (Copy ${copyNumber})`;
  }
  
  // Den geklonten Build als zu bearbeitenden Build setzen
  buildToEdit.value = clonedBuild;
  
  // Modal öffnen
  isBuildModalOpen.value = true;
}

// Hilfsfunktion zum Escapen von speziellen Zeichen in RegExp
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function deleteBuild(build) {
  if (!build || !build.id) return;
  
  // Lösche den Build im Store (wird auch die Reihenfolge aktualisieren)
  const success = hunterStore.deleteBuild(route.params.hunterId, build.id);
  
  if (success) {
    showToastMessage(`Build "${build.name}" deleted`, 'success');
    
    // Optional: Aktualisiere die lokale builds-Liste, falls nötig
    builds.value = builds.value.filter(b => b.id !== build.id);
  } else {
    showToastMessage(`Build "${build.name}" deleted`, 'success');
  }
}


// Reagiere auf Änderungen der Route, um den richtigen Hunter anzuzeigen
watch(
  () => route.params.hunterId,
  (newHunterId) => {
    if (!hunterIdMap.hasOwnProperty(newHunterId)) {
      // Ungültige Hunter-ID, zur Standard-Seite umleiten
      router.replace('/borge');
    }
    
    // Reset Easter Egg state when switching hunters
    clickCount.value = 0;
    showDancingImage.value = false;
  },
  { immediate: true }
);

// Lifecycle hooks
onMounted(async () => {
  await hunterStore.initHunterConfig(route.params.hunterId);
  // Initialisiere auch den gemPlannerStore
  gemPlannerStore.init();
});

// Bei Wechsel des Hunters die Konfiguration initialisieren
watch(() => route.params.hunterId, async (newHunterId) => {
  await hunterStore.initHunterConfig(newHunterId);
  
  // Check for pending build import when hunter changes
  nextTick(() => {
    const pendingBuild = hunterStore.getPendingBuildImport();
    
    if (pendingBuild && pendingBuild.hunter === newHunterId) {
      // Wait another tick to ensure View Transition is complete
      nextTick(() => {
        // Import the pending build
        buildToEdit.value = {
          ...pendingBuild,
          hunterId: newHunterId
        };
        
        // Open build modal
        isBuildModalOpen.value = true;
        
        // Clear the pending import
        hunterStore.clearPendingBuildImport();
        
        // Show success message
        showToastMessage(`Build imported and ready to edit. Click Save to keep it.`, 'info');
      });
    }
  });
});

// Lädt Builds beim Mounting
onMounted(async () => {
  // Hier Builds aus dem Store oder API laden
  // builds.value = await loadBuilds();
});

const sortableOpts = {
  scroll: true,
  scrollSensitivity: 60,
  scrollSpeed: 10
}

onMounted(() => {
  // Prüfe, ob ein code-Parameter in der URL vorhanden ist
  if (route.query.code) {
    // Code für das Modal speichern
    importCodeFromUrl.value = route.query.code;
    
    // Modal öffnen
    isBuildCodeModalOpen.value = true;
    
    // Optional: Code aus der URL entfernen (mit history.replaceState)
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url);
  }
  
  // Prüfe, ob ein pending Build Import vorhanden ist
  // Use nextTick to ensure the component is fully mounted after navigation
  nextTick(() => {
    const pendingBuild = hunterStore.getPendingBuildImport();
    
    if (pendingBuild && pendingBuild.hunter === route.params.hunterId) {
      // Wait another tick to ensure View Transition is complete
      nextTick(() => {
        // Import the pending build
        buildToEdit.value = {
          ...pendingBuild,
          hunterId: route.params.hunterId
        };
        
        // Open build modal
        isBuildModalOpen.value = true;
        
        // Clear the pending import
        hunterStore.clearPendingBuildImport();
        
        // Show success message
        showToastMessage(`Build imported and ready to edit. Click Save to keep it.`, 'info');
      });
    }
  });
});

// Weitere Handler für BuildResultCard-Events
function handleNameChanged(data) {
  const buildIndex = builds.value.findIndex(b => b.id === data.buildId);
  if (buildIndex !== -1) {
    // Lokale Liste aktualisieren
    builds.value[buildIndex].name = data.name;
    
    // Im Store speichern (WICHTIG: Diese Zeile fehlt bisher)
    hunterStore.renameBuild(data.buildId, data.name);
    
    // Optional: Erfolgs-Toast anzeigen
    showToastMessage(`Build renamed to "${data.name}"`, 'success');
  }
}

// Weitere Handler für Edit, Clone, Archive, Delete...
function archiveBuild(build) {
  if (!build || !build.id) return;
  
  // Toggle the archived status
  const updatedBuild = {
    ...build,
    isArchived: !build.isArchived
  };
  
  // Update the build in the store
  hunterStore.updateBuild(updatedBuild);
  
  // Update local list
  const buildIndex = builds.value.findIndex(b => b.id === build.id);
  if (buildIndex !== -1) {
    // Remove the build from the current view when archiving/unarchiving
    builds.value.splice(buildIndex, 1);
  }
  
  // Show toast message
  showToastMessage(updatedBuild.isArchived ? 
    `Build "${build.name}" archived` : 
    `Build "${build.name}" restored`,
    'success'
  );
}

// Computed Properties für die gefilterten Builds
const filteredBuilds = computed(() => {
  const allBuilds = hunterStore.getOrderedBuildsForHunter(route.params.hunterId) || [];
  return allBuilds.filter(build => 
    (buildFilterMode.value === 'active' && !build.isArchived) || 
    (buildFilterMode.value === 'archived' && build.isArchived)
  );
});


function updateLootFilters(newFilters) {
  lootFilters.value = newFilters;
  
  // Speichere die Filter im localStorage für Persistenz
  localStorage.setItem(`lootFilters_${route.params.hunterId}`, JSON.stringify(newFilters));
  
  showToastMessage('Loot filter updated', 'success', 1500);
}

provide('lootFilters', lootFilters);

// Synchronisiere builds nur, wenn sich filteredBuilds tatsächlich geändert hat (nicht nach drag)
// Vor der Übergabe an draggable, stelle sicher, dass alle Builds die hunterId haben
watch(filteredBuilds, (newFilteredBuilds) => {
  builds.value = newFilteredBuilds.map(build => ({
    ...build,
    hunterId: build.hunterId || route.params.hunterId // Sicherheitsmaßnahme
  }));
}, { immediate: true });

// Referenz-Build-Tracking
const evaluationCache = ref({});
const referenceBuildId = ref(null);
const referenceBuildResults = ref({});
// Neuer Zähler, der erhöht wird, wenn sich der Referenzbuild ändert
const referenceUpdateCounter = ref(0);

provide('evaluationCache', evaluationCache);
provide('referenceBuildId', referenceBuildId);
provide('referenceBuildResults', referenceBuildResults);
// Stelle den Zähler bereit
provide('referenceUpdateCounter', referenceUpdateCounter);

// Wenn die Builds geladen werden, setze den ersten als Referenz
watchEffect(() => {
  if (builds.value && builds.value.length > 0) {
    const firstBuild = builds.value[0];
    if (referenceBuildId.value !== firstBuild.id) {
      referenceBuildId.value = firstBuild.id;
      // Erhöhe den Zähler, wenn sich der Referenzbuild ändert
      referenceUpdateCounter.value++;
    }
  }
});

// Handler für das Drag-Ende-Event - aktualisiert
function onDragEnd(event) {

  // Stelle sicher, dass alle Builds nach dem Drag & Drop die hunterId haben
  builds.value = builds.value.map(build => {
    if (!build.hunterId) {
      return {
        ...build,
        hunterId: route.params.hunterId
      };
    }
    return build;
  });
  
  // Speichere die neue Reihenfolge im Store und localStorage
  hunterStore.saveBuildsOrder(route.params.hunterId, builds.value);
  
  // Aktualisiere den Referenz-Build nach dem Drag & Drop
  if (builds.value && builds.value.length > 0) {
    const newReferenceId = builds.value[0].id;
    
    // Wenn sich der Referenz-Build geändert hat
    if (referenceBuildId.value !== newReferenceId) {
      referenceBuildId.value = newReferenceId;
      
      // Suche nach Ergebnissen für den neuen Referenz-Build im Cache
      const firstBuildKey = Object.keys(evaluationCache.value).find(key => {
        try {
          const cachedData = JSON.parse(key);
          return cachedData.buildId === newReferenceId;
        } catch {
          return false;
        }
      });
      
      if (firstBuildKey && evaluationCache.value[firstBuildKey]) {
        referenceBuildResults.value = { ...evaluationCache.value[firstBuildKey] };
      }
      
      // Wichtig: Erhöhe den Aktualisierungszähler, um alle Builds zu aktualisieren
      referenceUpdateCounter.value++;
    }
  }
}

// Der Handler für das evaluated Event
function handleBuildEvaluated({ buildId, results, isReference }) {
  // Speichere Ergebnis im Cache unter einem ID-basierten Key
  const cacheKey = JSON.stringify({ buildId });
  evaluationCache.value[cacheKey] = results;
  
  // Wenn dies der Referenz-Build ist, aktualisiere seine Ergebnisse
  if (isReference || buildId === referenceBuildId.value) {
    referenceBuildResults.value = { ...results };
    // Erhöhe den Zähler, damit alle anderen Builds aktualisiert werden
    referenceUpdateCounter.value++;
  }
}

function handleBuildReevaluate(buildId) {
  // Finde den Build-Namen für die Toast-Message
  const build = builds.value.find(b => b.id === buildId);
  const buildName = build?.name || 'unnamed';
  
  // Aktualisiere den Evaluation-State
  evaluationResults.value = {
    ...evaluationResults.value,
    [buildId]: {
      ...evaluationResults.value[buildId],
      isLoading: true,
      hasError: false,
      progressIteration: 0
    }
  };
  
  // Toast Message anzeigen
  showToastMessage(`Build "${buildName}" re-evaluated`, 'success');
}

// Füge auch die Funktion zum Aktualisieren der Display-Einstellungen hinzu
function onDisplaySettingsUpdated(settings) {
  // Hier kannst du auf Änderungen reagieren, z.B. alle Karten neu rendern
  // Oder den aktuellen Anzeigemodus aktualisieren
  
  // Optional: Toast-Nachricht anzeigen
  showToastMessage('Display settings updated', 'success');
}

// Stelle displaySettings als reactive Wert bereit
const displaySettings = computed(() => {
  return hunterStore.getDisplaySettings(route.params.hunterId) || {
    displayMode: 'Vertical',
    enabledStats: ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'],
    chartStyle: 'bar'
  };
});

// Funktion zum Umschalten der Anzeigemodi
function setDisplayMode(mode) {
  // Aktuelle Einstellungen abrufen
  const currentSettings = hunterStore.getDisplaySettings(route.params.hunterId) || {
    displayMode: 'Vertical',
    enabledStats: ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'],
    chartStyle: 'bar'
  };
  
  // Neue Einstellungen mit aktualisiertem Anzeigemodus erstellen
  const updatedSettings = { 
    ...currentSettings,
    displayMode: mode 
  };
  
  // Im Store speichern
  hunterStore.saveDisplaySettings(route.params.hunterId, updatedSettings);
  
  // Optional: Toast-Nachricht anzeigen
  showToastMessage(`Display mode changed to ${mode}`, 'info', 1500);
}

// Füge die onBuildReevaluate-Funktion hinzu, falls sie fehlt
function onBuildReevaluate(buildId) {
  evaluationResults.value = {
    ...evaluationResults.value,
    [buildId]: {
      ...evaluationResults.value[buildId],
      isLoading: true,
      hasError: false,
      progressIteration: 0
    }
  };
}

// Handler für temporäre Upgrade-Änderungen
function handleUpgradeChanged(changeData) {
  // Prüfe ob eine Neuevaluierung ausgelöst werden soll
  if (changeData.triggerReevaluation) {
    // Triggere Neuberechnung aller Builds
    builds.value.forEach(build => {
      handleBuildReevaluate(build.id);
    });
  }
  // Wenn triggerReevaluation false ist, keine Aktion - nur Store-Update wurde bereits gemacht
}

// Lade gespeicherte Filter beim Start
onMounted(() => {
  const savedFilters = localStorage.getItem(`lootFilters_${route.params.hunterId}`);
  if (savedFilters) {
    try {
      lootFilters.value = JSON.parse(savedFilters);
    } catch (e) {
      console.error('Error parsing saved loot filters:', e);
    }
  }
});

// Aktualisiere die Filter, wenn sich der Hunter ändert
watch(() => route.params.hunterId, (newHunterId) => {
  const savedFilters = localStorage.getItem(`lootFilters_${newHunterId}`);
  if (savedFilters) {
    try {
      lootFilters.value = JSON.parse(savedFilters);
    } catch (e) {
      console.error('Error parsing saved loot filters:', e);
    }
  } else {
    // Setze auf Standardwerte zurück, wenn keine gespeicherten Filter vorhanden sind
    lootFilters.value = {
      mat1: true,
      mat2: true,
      mat3: true,
      xp: true
    };
  }
});

// Stelle displaySettings zur Verfügung (provide/inject Pattern)
provide('displaySettings', displaySettings);

// Neue reactive ref für die Seed-Einstellung
const useSeededEvaluation = computed({
  get: () => hunterStore.getHunterSeedSetting(route.params.hunterId),
  set: (value) => {
    hunterStore.saveHunterSeedSetting(route.params.hunterId, value);
    showToastMessage(`Evaluation mode changed to ${value ? 'Seeded' : 'Random'}`, 'info', 1500);
  }
});

// Stelle den Wert über provide/inject bereit
provide('useSeededEvaluation', useSeededEvaluation);
</script>

<style scoped>
/* Bestehende Grid-Styles... */

/* Neue Animation-Klassen für vuedraggable 4.x */
.flip-list-move {
  transition: transform 0.5s;
}

.flip-list-enter-active, 
.flip-list-leave-active {
  transition: all 0.5s;
}

.flip-list-enter-from, 
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Disable Vue transitions during View Transitions to prevent conflicts */
html.in-page-transition .flip-list-enter-active,
html.in-page-transition .flip-list-leave-active {
  transition: none !important;
}

html.in-page-transition .flip-list-enter-from,
html.in-page-transition .flip-list-leave-to {
  opacity: 1 !important;
  transform: none !important;
}

/* CRITICAL: Disable transition-all on build cards during View Transitions */
html.in-page-transition .build-card-wrapper *,
html.in-page-transition .build-compact-wrapper *,
html.in-page-transition .build-mobile-wrapper * {
  transition: none !important;
}

.ghost {
  opacity: 0.5;
  background-color: rgba(51, 51, 51, 0.3) !important;
  border: 1px dashed rgba(156, 163, 175, 0.7) !important;
}

.chosen {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.dragging {
  opacity: 0.8;
}

.grip-handle {
  cursor: grab;
}

.grip-handle:active {
  cursor: grabbing;
}

/* Build Card Wrappers - Performance optimization for transitions */
.build-card-wrapper,
.build-compact-wrapper,
.build-mobile-wrapper {
  contain: layout;
}

/* Force build cards to maintain their size during View Transitions */
html.in-page-transition .build-compact-wrapper {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
}

/* Prevent overflow-hidden from clipping content during View Transition */
html.in-page-transition .build-compact-wrapper .build-vertical {
  overflow: visible !important;
}

/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>