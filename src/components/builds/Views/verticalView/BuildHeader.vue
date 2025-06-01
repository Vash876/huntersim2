<template>
  <div class="header-wrapper">
    <!-- Obere Zeile: Build-Titel und Status -->
    <div class="header-main p-4 flex justify-between items-center">
      <div class="flex items-center flex-1 min-w-0"> <!-- min-width:0 ist wichtig für Truncate -->
        <!-- Grip Handle und Name-Bereich -->
        <div class="grip-handle mr-2 text-gray-500 hover:text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0">
          <IconGripVertical size="20" />
        </div>
        <div class="flex overflow-hidden min-w-0">
          <!-- Edit Icon separat klickbar -->
          <div 
            @click="startNameEdit" 
            class="self-center cursor-pointer mr-1.5 flex-shrink-0 hover:text-gray-300 transition-colors"
          >
            <IconEditCircle size="20" class="text-gray-400" />
          </div>
          
          <div class="flex items-baseline flex-wrap min-w-0 overflow-hidden">
            <!-- Name klickbar zum Bearbeiten -->
            <h3 
              v-if="!isEditingName" 
              @click="startNameEdit"
              class="text-lg font-semibold text-white truncate max-w-full cursor-pointer hover:text-gray-300 transition-colors"
            >
              {{ buildData.name }}
            </h3>
            
            <!-- Bearbeitungsfeld - nicht flex-grow verwenden -->
            <div v-if="isEditingName" class="relative mr-2">
              <input 
                ref="nameInputRef"
                type="text"
                v-model="editableName"
                @keyup.enter="saveName"
                @blur="saveName"
                class="text-lg font-semibold bg-gray-700 text-white rounded px-2 py-0.5 outline-none w-auto max-w-[170px]"
              />
            </div>
            
            <!-- Level-Badge - immer anzeigen -->
            <span class="ml-2 text-xs bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-300 whitespace-nowrap flex-shrink-0">
              Lvl {{ buildData.level }}
            </span>
            
            <!-- Overrides Badge - nur anzeigen wenn Overrides vorhanden -->
            <span 
              v-if="hasOverrides" 
              class="ml-2 text-xs pl-2 pr-1  py-0.5 bg-blue-900/50 rounded-full text-blue-300 whitespace-nowrap flex-shrink-0 flex items-center"
              title="Build uses custom overrides"
            >
              <IconAdjustmentsHorizontal size="14" class="mr-1" />
            </span>
            
            <span v-if="buildData.isArchived" class="ml-2 text-xs px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-300 whitespace-nowrap flex-shrink-0">
              Archived
            </span>
          </div>
        </div>
      </div>
      
      <!-- ✅ REFRESH BUTTON - SEPARATER RECHTER BEREICH -->
      <div class="flex-shrink-0 ml-4">
        <button 
          @click="emit('reevaluate', buildData)"
          class="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          title="Re-evaluate Build"
        >
          <IconRefresh size="20" />
        </button>
      </div>
    </div>
    
    <!-- Untere Zeile: Aktionsleiste -->
    <div class="action-bar py-2 px-1 flex justify-between items-center bg-gray-800/70 border-t border-b border-gray-700/50">
      
      <div class="flex items-center gap-1.5 flex-1 justify-center">
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
          @click="emit('upgradeComparison')"
          class="action-button-compact"
          title="Compare upgrade efficiency">
          <IconScale size="16" />
        </button>

        <button 
          v-if="results?.stageDistribution?.length"
          @click="emit('showDistribution')"
          class="action-button-compact"
          title="Show Build Statistics"
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
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, computed } from 'vue';
import { 
  IconEdit, IconEditCircle, IconCopy, IconArchive, IconArchiveOff,
  IconTrash, IconGripVertical, IconDotsVertical, IconAdjustments,
  IconShare, IconRefresh, IconChartBar, IconX, IconCloudUpload,
  IconAdjustmentsHorizontal, IconScale
} from '@tabler/icons-vue';

const props = defineProps({
  buildData: { type: Object, required: true },
  hunterColor: { type: String, required: true },
  isReferenceBuild: { type: Boolean, default: false },
  results: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['edit', 'clone', 'archive', 'delete', 'nameChanged', 'overrides', 'share', 'reevaluate', 'showDistribution', 'showUploadDialog', 'upgradeComparison']);

const isEditingName = ref(false);
const editableName = ref('');
const nameInputRef = ref(null);
const showDropdown = ref(false);
const showUploadDialog = ref(false);

// Berechne, ob Overrides aktiv sind
const hasOverrides = computed(() => {
  // Prüfe, ob Overrides existieren und aktiv sind
  return props.buildData.overrides && 
         Object.keys(props.buildData.overrides).length > 0;
});

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
    // Sende Event mit korrekter Struktur
    emit('nameChanged', {
      buildId: props.buildData.id,
      name: editableName.value
    });
  }
  isEditingName.value = false;
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