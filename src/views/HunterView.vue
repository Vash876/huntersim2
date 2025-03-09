<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/HunterView.vue -->
<template>
  <div class="p-4 container mx-auto">
    <!-- Top Section mit integriertem Header und Aktionsleiste -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <!-- Header mit Farb-Gradient -->
      <div :class="`bg-gradient-to-r ${getGradientColors()} p-5 border-b border-gray-600`">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold mb-1">{{ currentHunter.name }} Simulator</h1>
            <p class="text-sm text-gray-300">Compare builds and optimize your performance</p>
          </div>
          
          <div class="flex">
            <button 
              @click="openStatsModal"
              class="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md border-r border-blue-700 transition-colors shadow-sm"
            >
              <IconChartBar size="16" class="mr-2" />
              <span>Stats</span>
            </button>
            
            <!-- New Build (mittlerer Button) -->
            <button
              class="px-3 py-2 bg-gray-600 hover:bg-gray-500 flex items-center gap-2 transition-colors shadow-sm border-r border-blue-700"
              @click="openBuildModal"
            >
              <IconPlus size="16" />
              <span>New Build</span>
            </button>

            <!-- Build Code (Import) - rechter Button mit abgerundeter rechter Ecke -->
            <button
              class="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md flex items-center gap-2 transition-colors shadow-sm"
              @click="openBuildCodeModal"
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
            class="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
            @click="openIterationsModal"
          >
            <IconRepeat size="16" class="text-blue-400" />
            <span>{{ iterationValue }} iterations</span>
          </button>
          
          <!-- Statistics 
          <button
            class="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
            @click.stop="openStatisticsModal"
          >
            <IconChartDonut size="16" class="text-purple-400" />
            <span>Display Settings</span>
          </button>-->
        </div>
        
        <!-- Build Filter Switch -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400">View:</span>
          <div class="flex bg-gray-700 rounded-md overflow-hidden">
            <button 
              @click="buildFilterMode = 'active'"
              class="px-3 py-1 text-sm transition-colors"
              :class="buildFilterMode === 'active' ? 'bg-blue-600 text-white' : 'hover:bg-gray-650 text-gray-300'"
            >
              <span>Active</span>
              <span class="ml-1 text-xs opacity-75">({{ activeBuildsCount }})</span>
            </button>
            <button 
              @click="buildFilterMode = 'archived'"
              class="px-3 py-1 text-sm transition-colors"
              :class="buildFilterMode === 'archived' ? 'bg-blue-600 text-white' : 'hover:bg-gray-650 text-gray-300'"
            >
              <span>Archived</span>
              <span class="ml-1 text-xs opacity-75">({{ archivedBuildsCount }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Neue Build-Resultate -->
    <div v-if="builds.length > 0">
      <Draggable 
        v-model="builds"
        :componentData="{
          tag: 'div',
          type: 'transition-group',
          name: 'flip-list',
          class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
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
          <div class="build-card-wrapper">
            <BuildResultCard 
              :build-id="element.id"
              :hunter-id="element.hunterId || route.params.hunterId"
              :build-data="element"
              :index="index"
              @name-changed="handleNameChanged"
              @edit="editBuild"
              @clone="cloneBuild"
              @archive="archiveBuild"
              @delete="deleteBuild"
              @evaluated="handleBuildEvaluated"
              @overridesBuild="openOverrideModal"
            />
          </div>
        </template>
      </Draggable>
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
    <div
      v-if="isStatisticsModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeStatisticsModal"
    >
      <div class="bg-gray-900 p-6 rounded-lg w-11/12 max-w-md border border-gray-700">
        <h3 class="text-xl font-bold mb-4 flex items-center">
          <IconChartDonut size="20" class="mr-2 text-purple-400" />
          Display Settings
        </h3>
        <p class="text-gray-400 mb-4">Wähle aus, welche Statistiken angezeigt werden sollen.</p>
        
        <div class="flex justify-end mt-6">
          <button 
            @click="closeStatisticsModal"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
    
    <!-- Build Code Modal -->
    <BuildImportModal
      :show="isBuildCodeModalOpen"
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, provide, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NAVIGATION } from '../constants/navigation';
import { useHunterStore } from '../store/hunterStore';
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
  // Neue Icons für die Toast-Nachrichten
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle
} from '@tabler/icons-vue';

import StatsModal from '../components/common/StatsModal.vue';
import BuildModal from '@/components/common/BuildModal.vue';
import IterationsModal from '@/components/common/IterationsModal.vue';
import BuildResultCard from '@/components/builds/BuildResultCard.vue';
import Draggable from 'vuedraggable';
import OverrideModal from '../components/common/OverrideModal.vue';
import BuildImportModal from '@/components/builds/BuildImportModal.vue';

const router = useRouter();
const route = useRoute();

const hunterStore = useHunterStore();


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

// Durch den neuen Toast-State im selben Format wie in SettingsView
const toast = ref({ show: false, message: '', type: 'info' });

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
      
      // Aktualisiere im Store (WICHTIG: Stelle sicher, dass updateBuildOverrides richtig implementiert ist)
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
function newBuild() {
  router.push(`/${route.params.hunterId}/buildform?new=true`);
}

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

function openStatisticsModal() {
  isStatisticsModalOpen.value = true;
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
function importBuild(build) {
  if (!build) {
    showToastMessage('Error: Invalid build code', 'error');
    return;
  }
  
  // Check if the build is for the correct hunter type
  if (build.hunter !== route.params.hunterId) {
    showToastMessage(`This build is for ${build.hunter.charAt(0).toUpperCase() + build.hunter.slice(1)}, not for ${route.params.hunterId.charAt(0).toUpperCase() + route.params.hunterId.slice(1)}`, 'error');
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
  console.log('Build created:', build);
  
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
  console.log('Build updated:', build);
  
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

function onBuildEvaluated({ buildId, results }) {
  // Optional: Speichere die Evaluierungs-Ergebnisse im Store oder Cache
  console.log(`Build ${buildId} evaluiert:`, results);
  // Wenn der evaluierte Build der Referenz-Build ist, aktualisiere die Referenzdaten
  if (buildId === referenceBuildId.value) {
    referenceBuildResults.value = results;
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
  },
  { immediate: true }
);

// Lifecycle hooks
onMounted(async () => {
  await hunterStore.initHunterConfig(route.params.hunterId);
});

// Bei Wechsel des Hunters die Konfiguration initialisieren
watch(() => route.params.hunterId, async (newHunterId) => {
  await hunterStore.initHunterConfig(newHunterId);
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

// Weitere Handler für BuildResultCard-Events
function handleNameChanged(data) {
  const buildIndex = builds.value.findIndex(b => b.id === data.buildId);
  if (buildIndex !== -1) {
    builds.value[buildIndex].name = data.name;
    // Optional: Speichere Änderungen in der Datenbank/Store
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

// Verwende ref für die Draggable-Komponente, aber synchronisiere mit filteredBuilds
const builds = ref([]);

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
  console.log('Neue Reihenfolge:', builds.value);
  
  // Stelle sicher, dass alle Builds nach dem Drag & Drop die hunterId haben
  builds.value = builds.value.map(build => {
    if (!build.hunterId) {
      console.log('HunterId fehlt bei Build:', build.name);
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
      console.log('Referenz-Build geändert nach Drag & Drop:', newReferenceId);
      
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
        console.log('Referenz-Ergebnisse aus Cache aktualisiert');
      } else {
        // Warte auf die Evaluierung des neuen Referenz-Builds
        console.log('Warte auf Evaluierung des neuen Referenz-Builds');
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
    console.log('Reference build results updated via event:', referenceBuildResults.value);
    // Erhöhe den Zähler, damit alle anderen Builds aktualisiert werden
    referenceUpdateCounter.value++;
  }
}
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