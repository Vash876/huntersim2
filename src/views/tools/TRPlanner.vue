<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Top Section mit Header und Aktionsleiste -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <!-- Header mit Farb-Gradient -->
      <div class="bg-gradient-to-r from-purple-900 to-gray-800 p-4 sm:p-5 border-b border-gray-600">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <!-- Bild und Überschrift in einer Zeile -->
            <div class="flex items-center mb-1">
              <img src="@/assets/general/orbs.png" class="w-6 h-6 mr-2" alt="Orbs" />
              <h1 class="text-2xl font-bold">TR Planner</h1>
            </div>
            <p class="text-sm text-gray-300">Plan and optimize your Traversal Resets</p>
          </div>
          
          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row sm:flex-wrap justify-end gap-3">
            <!-- Maxed Boosts -->
            <button
              @click="openStatsModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconChartBar size="18" />
              <span>Maxed Boosts</span>
            </button>

            <!-- Orb Calculator -->
            <button
              @click="openOrbCalculatorModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconCalculator size="18" />
              <span>Orb Calculator</span>
            </button>

            <!-- Import Plan -->
            <button
              @click="openImportModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconDownload size="18" />
              <span>Import Plan</span>
            </button>

            <!-- New Plan -->
            <button
              @click="openTRPlanModal"
              class="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconPlus size="18" />
              <span>New Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content - Plan Grid -->
    <div class="mt-6">
      <!-- Keine Pläne Nachricht -->
      <div v-if="trPlannerStore.trPlanCount === 0" class="bg-gray-850 rounded-lg p-8 text-center border border-gray-700">
        <IconFile size="48" class="text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-300 mb-2">No Plans Created</h3>
        <p class="text-gray-400 mb-6">Create your first TR plan to get started with optimizing your gameplay.</p>
        <button
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md flex items-center gap-2 mx-auto transition-colors"
          @click="openTRPlanModal"
        >
          <IconPlus size="16" />
          <span>Create First Plan</span>
        </button>
      </div>
      
      <!-- Plan Grid -->
      <div v-else>
        <Draggable 
          v-model="filteredPlans" 
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
          handle=".grip-handle"
          :group="{ name: 'plans', pull: false, put: false }"
          item-key="id"
          :animation="200"
          ghost-class="ghost"
          chosen-class="chosen"
          drag-class="dragging"
          @change="onDragEnd"
        >
          <template #item="{ element }">
            <div class="card-wrapper">
              <TRPlanCard
                :plan="element"
                :currentStats="currentStats"
                @click="openTRPlanDetailModal(element.id)"
                @edit="handleEditPlan(element.id)"
                @copy="handleCopyPlan(element.id)"
                @share="handleSharePlan(element.id)"
                @adjustments="handleGemAdjustments(element.id)"
                @delete="handleDeletePlan(element.id)"
                @planOrbs="handlePlanOrbs(element.id)"
              />
            </div>
          </template>
        </Draggable>
      </div>
    </div>
    
    <!-- Stats Input Modal -->
    <StatsInputModal 
      v-if="showStatsModal"
      :isVisible="showStatsModal"
      :currentStats="trPlannerStore.userStats"
      :showFragmultiBoosts="true"
      @close="showStatsModal = false"
      @save="saveUserStats"
    />

    <!-- TR Plan Modal -->
    <TRPlanModal
      ref="trPlanModalRef"
      v-if="showTRPlanModal"
      :isVisible="showTRPlanModal"
      :currentStats="trPlannerStore.userStats"
      :editPlanId="editingPlanId"
      :importedPlanData="importedPlanData"
      @close="closeTRPlanModal"
      @save="handlePlanSaved"
      @openNewPlan="handleOpenNewPlan"
    />

    <TRResultsSidePanel
      :isVisible="showTRPlanModal"
      :trSteps="planSteps"
      :trCount="trCount"
      :trEndDate="formatTREndDate"
      :getStepOrbRequirement="getStepOrbRequirement"
      :getStepOrbGains="getStepOrbGains"
      :getStepFragGains="getStepFragGains"
      :getStepRequirementMet="getStepRequirementMet"
    />
    
    <!-- Plan Detail Modal -->
    <TRPlanDetailModal 
      v-if="selectedPlanId"
      :isVisible="!!selectedPlanId"
      :planId="selectedPlanId"
      :currentStats="trPlannerStore.userStats"
      @close="selectedPlanId = null"
      @edit="handleEditPlan"
      @delete="handleDeletePlan"
    />

    <!-- Orb Calculator Modal -->
    <OrbCalculatorModal
      v-if="showOrbCalculatorModal"
      :isVisible="showOrbCalculatorModal"
      :currentStats="trPlannerStore.userStats"
      @close="showOrbCalculatorModal = false"
      @openNewPlan="handleOpenNewPlan"
    />
    
    <!-- Gem Override Modal -->
    <GemOverrideModal
      v-if="showGemOverrideModal"
      :isVisible="showGemOverrideModal"
      :gemOverrides="selectedPlanForGemOverrides?.gemOverrides || {}"
      @close="closeGemOverrideModal"
      @update:gemOverrides="updatePlanGemOverrides"
    />
    
    <!-- Welcome Modal für erste Besucher -->
    <GemWelcomeModal
      v-if="showGemWelcomeModal"
      :isVisible="showGemWelcomeModal"
      @close="closeGemWelcomeModal"
      @openGemOverview="openGemOverviewFromWelcome"
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

    <!-- Import Modal -->
    <TRPlanImportModal
      v-if="showImportModal"
      :show="showImportModal"
      @close="closeImportModal"
      @import-plan="handlePlanImported"
    />

    <!-- Share Modal -->
    <TRPlanShareModal
      v-if="showShareModal"
      :show="showShareModal"
      :plan="planToShare"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import StatsInputModal from '@/components/tr-planner/StatsInputModal.vue';
import TRPlanModal from '@/components/tr-planner/TRPlanModal.vue';
import TRResultsSidePanel from '@/components/tr-planner/TRResultsSidePanel.vue';
import TRPlanCard from '@/components/tr-planner/TRPlanCard.vue';
import TRPlanDetailModal from '@/components/tr-planner/TRPlanDetailModal.vue';
import OrbCalculatorModal from '@/components/tr-planner/OrbCalculatorModal.vue';
import GemWelcomeModal from '@/components/tr-planner/GemWelcomeModal.vue';
import GemOverrideModal from '@/components/tr-planner/GemOverrideModal.vue';
import TRPlanImportModal from '@/components/tr-planner/TRPlanImportModal.vue';
import TRPlanShareModal from '@/components/tr-planner/TRPlanShareModal.vue';
import Draggable from 'vuedraggable';
import { useTRPlannerStore } from '@/store/orbStore';
import { 
  IconChartBar, 
  IconPlus, 
  IconRefresh,
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconFile,
  IconCalculator,
  IconFileImport,
  IconDownload,
  IconUpload,
  IconChevronDown
} from '@tabler/icons-vue';
import { ensureGemDataSync } from '@/constants/tr-planner/index.js';

// Pinia Store einbinden
const trPlannerStore = useTRPlannerStore();
const router = useRouter();

// Modal state
const showStatsModal = ref(false);
const showTRPlanModal = ref(false);
const showGemWelcomeModal = ref(false);
const showGemOverrideModal = ref(false);
const selectedPlanForGemOverrides = ref(null);
const trPlanModalRef = ref(null);
const selectedPlanId = ref(null);
const editingPlanId = ref(null);
const showOrbCalculatorModal = ref(false);

// Import state
const showImportModal = ref(false);
const importedPlanData = ref(null);

// Share modal state
const showShareModal = ref(false);
const planToShare = ref(null);

// Toast notification
const toast = ref({ show: false, message: '', type: 'info' });

const filteredPlans = ref([]);

// Force update counter für die Neuzuweisung der Pläne
const forceUpdateCounter = ref(0);

const currentStats = computed(() => {
  return trPlannerStore.userStats || {};
});

// Open stats modal
function openStatsModal() {
  showStatsModal.value = true;
}

// Open TR Plan Modal für einen neuen Plan
function openTRPlanModal() {
  // Zurücksetzen des Bearbeitungsmodus
  editingPlanId.value = null;
  
  // Kopie-Daten zurücksetzen, falls vorhanden
  if (trPlannerStore.copyPlanData) {
    trPlannerStore.setCopyPlanData(null);
  }
  
  // Modal öffnen
  showTRPlanModal.value = true;
}

// Open TR Plan Detail modal
function openTRPlanDetailModal(planId) {
  selectedPlanId.value = planId;
}

// Close TR Plan Detail modal
function closeTRPlanModal() {
  showTRPlanModal.value = false;
  editingPlanId.value = null;
  importedPlanData.value = null; // Reset imported plan data
}

// Funktion zum Öffnen des Orb Calculator Modals
function openOrbCalculatorModal() {
  showOrbCalculatorModal.value = true;
}

// Import functions
function openImportModal() {
  showImportModal.value = true;
}

function closeImportModal() {
  showImportModal.value = false;
}

// Share functions
function openShareModal(plan) {
  planToShare.value = plan;
  showShareModal.value = true;
}

function closeShareModal() {
  showShareModal.value = false;
  planToShare.value = null;
}

function handlePlanImported(plan) {
  // Öffne das TRPlanModal direkt mit den importierten Daten (ohne zu speichern)
  nextTick(() => {
    // Setze die importierten Plan-Daten für das Modal
    importedPlanData.value = plan;
    editingPlanId.value = null; // Kein Edit-Modus, sondern Import-Modus
    showTRPlanModal.value = true;
    console.log(`TRPlanModal für Import geöffnet: ${plan.name}`);
  });
}

// Save user stats from modal
function saveUserStats(newStats) {
  // Speichere Stats im Store
  trPlannerStore.updateUserStats(newStats);
  
  // Schließe das Modal
  showStatsModal.value = false;
  
  // Zeige Feedback
  showToastMessage('Stats updated successfully', 'success');
}

// Select Plan to view details
function handleSelectPlan(planId) {
  selectedPlanId.value = planId;
}

// Edit Plan
function handleEditPlan(planId) {
  editingPlanId.value = planId;
  showTRPlanModal.value = true;
}

// Plan Orbs - Navigate to Gem Planner with TR Plan data
function handlePlanOrbs(planId) {
  // Get the plan data
  const plan = trPlannerStore.getTRPlanById(planId);
  if (!plan) {
    console.error('Plan not found:', planId);
    return;
  }

  // Store the TR plan data in the gem planner store instead of URL params
  import('@/store/gemPlannerStore').then(({ useGemPlannerStore }) => {
    const gemPlannerStore = useGemPlannerStore();
    gemPlannerStore.setActiveTRPlan({
      plan: plan,
      trIndex: 0
    });
    
    // Navigate to gem planner without query params
    router.push('/tools/gem-planner');
    
    showToastMessage(`Opening Gem Planner for "${plan.name}"`, 'info');
  });
}

// Handle new plan created/updated
function handlePlanSaved(planId) {
  const isEditing = editingPlanId.value !== null;
  const isImporting = importedPlanData.value !== null;
  
  let message;
  if (isImporting) {
    message = `Plan "${importedPlanData.value?.name || 'Imported Plan'}" imported and saved successfully!`;
    
    // Check if it's incompatible with current gem levels
    if (importedPlanData.value?.importedGemContext) {
      const isImported = importedPlanData.value.isImported;
      if (isImported) {
        message += ' (Using original gem levels for calculations)';
      }
    }
  } else if (isEditing) {
    message = 'Plan updated successfully';
  } else {
    message = 'Plan created successfully';
  }
  
  showToastMessage(message, 'success');
  
  // Schließe Detail-Ansicht, falls wir den aktuell angezeigten Plan bearbeiten
  if (selectedPlanId.value === planId) {
    selectedPlanId.value = null;
  }
  
  // WICHTIG: Force-Update aller Pläne, um die UI zu aktualisieren
  updatePlans();
}

function handleCopyPlan(planId) {
  // Zuerst den Plan aus dem Store holen
  const originalPlan = trPlannerStore.getTRPlanById(planId);
  
  if (!originalPlan) {
    console.error('Plan nicht gefunden:', planId);
    return;
  }

  // Wir erstellen eine tiefe Kopie des Plans
  const planCopy = JSON.parse(JSON.stringify(originalPlan));
  
  // Den Namen ändern, um anzuzeigen, dass es sich um eine Kopie handelt
  planCopy.name = `${planCopy.name} (Copy)`;
  
  // Die ID und Zeitstempel entfernen, damit ein neuer Plan erstellt wird
  delete planCopy.id;
  delete planCopy.createdAt;
  delete planCopy.updatedAt;
  
  // Den aktuellen Fortschritt zurücksetzen
  if (planCopy.progress) {
    planCopy.progress.completed = false;
    planCopy.progress.lastUpdated = new Date().toISOString();
  } else {
    planCopy.progress = { 
      completed: false,
      lastUpdated: new Date().toISOString() 
    };
  }
    
  // TR-Planer-Modal öffnen für die Bearbeitung
  // Dabei als neue Erstellung mit vorgefüllten Daten behandeln
  editingPlanId.value = null; // Kein Edit, sondern New
  showTRPlanModal.value = true;
  
  // Die Daten des kopierten Plans an das Modal übergeben
  trPlannerStore.setCopyPlanData(planCopy);
  
  // Feedback anzeigen
  showToastMessage('Creating a copy of the plan', 'info');
}

// Share plan
function handleSharePlan(planId) {
  const plan = trPlannerStore.getTRPlanById(planId);
  if (plan) {
    openShareModal(plan);
  }
}

// Handle gem adjustments/overrides for a plan
function handleGemAdjustments(planId) {
  const plan = trPlannerStore.getTRPlanById(planId);
  if (plan) {
    selectedPlanForGemOverrides.value = plan;
    showGemOverrideModal.value = true;
  }
}

// Update gem overrides for a plan
function updatePlanGemOverrides(overrides) {
  if (selectedPlanForGemOverrides.value) {
    // Update the plan with new gem overrides
    const updatedPlan = {
      ...selectedPlanForGemOverrides.value,
      gemOverrides: overrides
    };
    
    trPlannerStore.updateTRPlan(updatedPlan.id, updatedPlan);
    showToastMessage('Gem overrides updated', 'success');
  }
}

// Close gem override modal
function closeGemOverrideModal() {
  showGemOverrideModal.value = false;
  selectedPlanForGemOverrides.value = null;
}

// Delete plan
function handleDeletePlan(planId) {
  trPlannerStore.deleteTRPlan(planId);
  showToastMessage('Plan deleted', 'info');
  
  // UI aktualisieren
  updatePlans();
}

// Reset planner
function resetPlanner() {
  if (confirm('Are you sure you want to reset the planner? This will delete all your plans.')) {
    // Reset planner über Store-Action
    trPlannerStore.clearTRPlans();
    
    // UI aktualisieren
    updatePlans();
    
    showToastMessage('Planner has been reset', 'info');
  }
}

function onDragEnd(event) {
  console.log('Drag event ended', event);
  console.log('Neue Reihenfolge:', filteredPlans.value.map(p => p.id));
  
  // Wichtig: Übergebe eine Kopie des Arrays, damit Vue die Änderung erkennt
  trPlannerStore.saveOrderedPlans([...filteredPlans.value]);
}

// Show toast message
function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Neue Funktion: Aktualisiere die Pläne mit einer tiefen Kopie
function updatePlans() {
  console.log("Force updating all plans");
  // Increment counter to force reactive updates in child components
  forceUpdateCounter.value++;
  
  // Use nextTick to ensure the DOM updates after the counter change
  nextTick(() => {
    // Tiefe Kopie aller Pläne erstellen, um sie neu zuzuweisen und Reaktivität zu erzwingen
    const freshPlans = JSON.parse(JSON.stringify(trPlannerStore.trPlans));
    filteredPlans.value = freshPlans; 
    
    // Debug-Info
    console.log(`Plans updated. Total count: ${filteredPlans.value.length}`);
  });
}

async function handleOpenNewPlan(mode) {
  console.log("2.1. handleOpenNewPlan called with mode:", mode);
  
  // Die temporären Daten für den neuen Plan verwenden
  const tempPlanData = trPlannerStore.tempPlanData;
  console.log("2.2. Temp plan data from store:", tempPlanData ? "exists" : "null", tempPlanData);
  
  // Hier auch die copyPlanData überprüfen als Backup
  const copyData = trPlannerStore.copyPlanData;
  console.log("2.3. Copy plan data from store:", copyData ? "exists" : "null");
  
  // Jetzt das OrbCalculatorModal schließen
  console.log("2.4. Setting showOrbCalculatorModal to false");
  showOrbCalculatorModal.value = false;
  
  await nextTick();
  
  // Kurze Verzögerung für das Schließen des ersten Modals
  setTimeout(() => {
    // Zurücksetzen des Bearbeitungsmodus
    console.log("2.5. In timeout - resetting editingPlanId");
    editingPlanId.value = null;
    
    // WICHTIG: Versuche erst tempPlanData, dann copyPlanData
    const planData = tempPlanData || copyData;
    
    if (planData) {
      console.log("2.6. Setting showTRPlanModal to true with plan data");
      showTRPlanModal.value = true;
      
      // Die Daten in den Store-Mechanismus übergeben
      // WICHTIG: Stelle sicher, dass die Daten korrekt übergeben werden
      trPlannerStore.setCopyPlanData(JSON.parse(JSON.stringify(planData)));
      
      console.log("2.7. Plan data set in store:", planData);
    } else {
      console.warn("2.8. No plan data available, opening empty plan modal");
      showTRPlanModal.value = true;
    }
    
    // Temp data zurücksetzen NACHDEM wir sie in copyPlanData kopiert haben
    trPlannerStore.tempPlanData = null;
    
  }, 200);
}

// Computed properties, die auf die Daten der TRPlanModal zugreifen
const planSteps = computed(() => trPlanModalRef.value?.trSteps || []);
const trCount = computed(() => trPlanModalRef.value?.trCount || 0);
const formatTREndDate = computed(() => trPlanModalRef.value?.formatTREndDate || '');

// Funktionen, die an das Sidepanel weitergegeben werden
function getStepOrbRequirement(step, index) {
  return trPlanModalRef.value?.getStepOrbRequirement(step, index) || 0;
}

function getStepOrbGains(step) {
  return trPlanModalRef.value?.getStepOrbGains(step) || 0;
}

function getStepFragGains(step) {
  return trPlanModalRef.value?.getStepFragGains(step) || 0;
}

function getStepRequirementMet(step, index) {
  return trPlanModalRef.value?.getStepRequirementMet(step, index) || false;
}

// Load data when component is mounted
onMounted(async () => {
  // Lade die Pläne
  trPlannerStore.loadTRPlans();
  
  // WICHTIG: Lade Gem-Daten aus gemPlannerStore und sync mit TR Planner localStorage
  ensureGemDataSync();
  
  // Initialisiere filteredPlans mit tiefer Kopie aus dem Store
  updatePlans();
  
  // Prüfe Welcome Modal
  checkShowGemWelcome();
});

// Cleanup on unmount
onUnmounted(() => {
  // Cleanup function - currently empty
});

// Watch für Änderungen im Store - mit tiefer Überwachung
watch(() => trPlannerStore.trPlans, (newPlans) => {
  console.log('trPlans im Store geändert, aktualisiere filteredPlans');
  // Immer aktualisieren mit tiefer Kopie
  updatePlans();
}, { deep: true });

watch(() => trPlannerStore.planModalShouldOpen, (newValue) => {
  if (newValue) {
    console.log("TRPlanner: Detected planModalShouldOpen flag:", newValue);
    
    // Modal öffnen mit dem entsprechenden Modus
    handleOpenNewPlan(newValue);
    
    // Flag zurücksetzen 
    trPlannerStore.planModalShouldOpen = null;
  }
});

function closeGemWelcomeModal() {
  showGemWelcomeModal.value = false;
  
  // Markiere als gesehen im localStorage
  localStorage.setItem('trplanner_gem_welcome_seen', 'true');
}

function openGemOverviewFromWelcome() {
  // Schließe Welcome Modal
  closeGemWelcomeModal();
  
  // Navigiere zum Gem Planner statt Gem Overview zu öffnen
  router.push('/tools/gem-planner');
}

// Prüfe ob Welcome Modal gezeigt werden soll
function checkShowGemWelcome() {
  const hasSeenWelcome = localStorage.getItem('trplanner_gem_welcome_seen');
  const hasGemData = localStorage.getItem('trplanner_userstats');
  
  // Zeige Welcome nur wenn:
  // 1. Noch nie gesehen
  // 2. Keine Gem-Daten vorhanden oder alle Gems auf 0
  if (!hasSeenWelcome) {
    let shouldShow = true;
    
    if (hasGemData) {
      try {
        const stats = JSON.parse(hasGemData);
        const gemData = stats.gemData;
        
        if (gemData && gemData.levels) {
          // Prüfe ob mindestens ein Gem > 0 ist
          const hasActiveGems = Object.values(gemData.levels).some(level => level > 0);
          if (hasActiveGems) {
            shouldShow = false;
          }
        }
      } catch (error) {
        console.error('Error parsing gem data:', error);
      }
    }
    
    if (shouldShow) {
      // Kurze Verzögerung für bessere UX
      setTimeout(() => {
        showGemWelcomeModal.value = true;
      }, 1000);
    }
  }
}
</script>

<style scoped>
.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
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
</style>