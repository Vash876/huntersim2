<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/components/builds/card-components/BuildHeader.vue -->
<template>
  <div class="header-wrapper">
    <!-- Obere Zeile: Build-Titel und Status -->
    <div class="header-main p-4 flex justify-between items-center">
      <div class="flex items-center flex-1 min-w-0"> <!-- min-width:0 ist wichtig für Truncate -->
        <!-- Grip Handle und Name-Bereich -->
        <div class="grip-handle mr-2 text-gray-500 hover:text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0">
          <IconGripVertical size="20" />
        </div>
        <div class="flex items-baseline cursor-pointer overflow-hidden min-w-0" @click="startNameEdit">
          <IconEditCircle size="22" class="text-gray-400 mr-1.5 flex-shrink-0" />
          <div v-if="!isEditingName" class="flex items-baseline flex-wrap min-w-0 overflow-hidden">
            <h3 class="text-lg font-semibold text-white truncate max-w-full"> <!-- max-width:full statt xs -->
              {{ buildData.name }}
            </h3>
            <span class="ml-2 text-xs bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-300 whitespace-nowrap flex-shrink-0">
              Lvl {{ buildData.level }}
            </span>
            <span v-if="buildData.isArchived" class="ml-2 text-xs px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-300 whitespace-nowrap flex-shrink-0">
              Archived
            </span>
          </div>
          <div v-else class="relative flex-grow">
            <input 
              ref="nameInputRef"
              type="text"
              v-model="editableName"
              @keyup.enter="saveName"
              @blur="saveName"
              class="text-lg font-semibold bg-gray-700 text-white rounded px-2 py-0.5 outline-none w-full"
            />
          </div>
        </div>
      </div>
      
      <!-- Re-evaluate Button - Hervorgehoben in der oberen Zeile 
      <button 
        @click="emit('reevaluate')"
        class="action-button-primary ml-2"
        title="Re-evaluate build">
        <IconRefresh size="16" class="mr-1" />
        <span class="text-sm">Re-Evaluate</span>
      </button>-->
    </div>
    
    <!-- Untere Zeile: Aktionsleiste -->
    <div class="action-bar p-2 px-4 flex justify-between items-center bg-gray-800/70 border-t border-b border-gray-700/50">
      
      <!-- Alle Aktionen in einer Reihe (kompakt aber ausreichend Platz) -->
      <div class="flex items-center gap-2 flex-1 justify-center">
        <button 
          @click="emit('edit')"
          class="action-button-compact"
          title="Edit build">
          <IconEdit size="16" />
        </button>
        
        <button 
          @click="emit('clone')" 
          class="action-button-compact" 
          title="Copy build">
          <IconCopy size="16" />
        </button>

        <button 
          @click="emit('overrides')"
          class="action-button-compact"
          title="Overrides">
          <IconAdjustments size="16" />
        </button>

        <button 
          v-if="results?.stageDistribution?.length"
          @click="showDistributionModal = true"
          class="action-button-compact"
          title="Show Stage Distribution"
        >
          <IconChartBar size="16" />
        </button>

        <button 
          @click="emit('share')"
          class="action-button-compact"
          title="Share build code">
          <IconShare size="16" />
        </button>

        <button 
          @click="emit('archive')" 
          class="action-button-compact" 
          :title="buildData.isArchived ? 'Restore build' : 'Archive build'">
          <IconArchive v-if="!buildData.isArchived" size="16" />
          <IconArchiveOff v-else size="16" />
        </button>
        
        <button 
          @click="emit('delete')" 
          class="action-button-compact hover:text-red-400" 
          title="Delete build">
          <IconTrash size="16" />
        </button>
      </div>
    </div>
  </div>

  <!-- Stage Distribution Modal -->
  <Teleport to="body">
    <div 
      v-if="showDistributionModal" 
      class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
      @click.self="showDistributionModal = false"
    >
      <div class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-700">
        <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white flex items-center">
            <IconChartBar size="20" class="mr-2" :class="`text-${hunterColor}-400`" />
            Stage Distribution: {{ buildData.name }}
          </h3>
          <button 
            @click="showDistributionModal = false"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <IconX size="20" />
          </button>
        </div>
        <div class="p-4">
          <StageDistributionChart 
              :distribution="results.stageDistribution"
              :avg-stage="results.avgStage"
              :max-stage="results.maxStage"
              :min-stage="results.minStage"
              :color="hunterColor"
            />
        </div>
      </div>
    </div>
  </Teleport>

</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { 
  IconEdit, IconEditCircle, IconCopy, IconArchive, IconArchiveOff,
  IconTrash, IconGripVertical, IconDotsVertical, IconAdjustments,
  IconShare, IconRefresh, IconChartBar, IconX
} from '@tabler/icons-vue';
import StageDistributionChart from '../../charts/StageDistributionChart.vue';

const props = defineProps({
  buildData: { type: Object, required: true },
  hunterColor: { type: String, required: true },
  isReferenceBuild: { type: Boolean, default: false },
  results: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['edit', 'clone', 'archive', 'delete', 'nameChanged', 'overrides', 'share', 'reevaluate', 'showDistribution']);

const isEditingName = ref(false);
const editableName = ref('');
const nameInputRef = ref(null);
const showDropdown = ref(false);
const showDistributionModal = ref(false); 

// Name editing functions
function startNameEdit() {
  editableName.value = props.buildData.name;
  isEditingName.value = true;
  nextTick(() => {
    if (nameInputRef.value) {
      nameInputRef.value.focus();
      nameInputRef.value.select();
    }
  });
}

function saveName() {
  if (editableName.value && editableName.value !== props.buildData.name) {
    emit('nameChanged', editableName.value);
  }
  isEditingName.value = false;
}

// Dropdown functions
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function handleAction(action) {
  emit(action);
  showDropdown.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (showDropdown.value && !event.target.closest('.action-dropdown') && !event.target.closest('.action-button')) {
    showDropdown.value = false;
  }
}

// Lifecycle hooks for dropdown
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.header-wrapper {
  background-color: rgba(31, 41, 55, 0.95);
  border-radius: 0.375rem 0.375rem 0 0;
  overflow: hidden;
}

.header-main {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

/* Hauptaktions-Button (Evaluate) */
.action-button-primary {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  background-color: rgba(59, 130, 246, 0.7);
  color: white;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-button-primary:hover {
  background-color: rgba(59, 130, 246, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Kompaktere Action-Buttons für die untere Leiste */
.action-button-compact {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: rgba(55, 65, 81, 0.3);
  color: rgba(209, 213, 219, 1);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-button-compact:hover {
  background-color: rgba(75, 85, 99, 0.5);
}

/* Rest der bestehenden Stile */
.grip-handle {
  touch-action: none;
}

.action-dropdown {
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  width: 150px;
  background-color: rgba(31, 41, 55, 0.98);
  border-radius: 0.375rem;
  border: 1px solid rgba(75, 85, 99, 0.4);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: rgba(229, 231, 235, 1);
  transition: background-color 0.15s ease;
  text-align: left;
}

.dropdown-item:hover {
  background-color: rgba(55, 65, 81, 0.7);
}
</style>