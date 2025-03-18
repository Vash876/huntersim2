<template>
  <div class="bg-gray-850/40 p-2 flex items-center border-b border-gray-700/30">
    <!-- Grip Handle (links) -->
    <div class="grip-handle p-1.5 cursor-grab rounded-md text-gray-500 hover:bg-gray-700 hover:text-gray-300 transition-colors">
      <IconGripVertical size="16" />
    </div>
    
    <!-- Build-Name -->
    <div class="flex-1 ml-2">
      <div class="flex items-center">
        <!-- Name edit button - immer sichtbar -->
        <button 
          @click="startNameEdit" 
          class="mr-2 p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex-shrink-0"
          title="Edit Build Name"
        >
          <IconEditCircle size="16" />
        </button>
        
        <div class="flex items-center flex-grow overflow-hidden">
          <!-- Entweder Eingabefeld oder klickbarer Name -->
          <div v-if="isEditingName" class="flex-shrink min-w-0">
            <input
              ref="nameInputRef"
              v-model="editableName"
              class="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:border-blue-500 outline-none w-52 max-w-full"
              @keyup.enter="saveName"
              @keyup.esc="isEditingName = false"
              @blur="saveName"
            />
          </div>
          <span 
            v-else
            @click="startNameEdit"
            class="text-white font-medium truncate cursor-pointer hover:text-gray-300 transition-colors"
          >
            {{ buildData.name || 'Unnamed Build' }}
          </span>
          
          <!-- Level, Overrides und Archived-Tags - immer direkt daneben -->
          <div class="flex items-center flex-shrink-0 ml-2">
            <span class="text-xs bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-300 whitespace-nowrap">
              Lvl {{ buildData.level }}
            </span>
            
            <!-- Neuer Overrides-Tag - nur anzeigen wenn Overrides aktiv sind -->
            <span 
              v-if="hasOverrides" 
              class="ml-2 text-xs px-2 py-0.5 bg-blue-900/50 rounded-full text-blue-300 whitespace-nowrap flex-shrink-0 flex items-center"
              title="Build uses custom overrides"
            >
              <IconAdjustmentsHorizontal size="12" class="mr-1" />
              Overrides
            </span>
            
            <span v-if="buildData.isArchived" class="ml-2 text-xs px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-300 whitespace-nowrap">
              Archived
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Aktionen -->
    <div class="flex items-center gap-1">
      <button 
        @click="emit('edit', buildData)"
        class="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        title="Edit Build"
      >
        <IconEdit size="16" />
      </button>
      <button 
        @click="emit('clone', buildData)"
        class="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        title="Clone Build"
      >
        <IconCopy size="16" />
      </button>
      <button 
        @click="emit('overridesBuild', buildData)"
        class="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        title="Build Overrides"
      >
        <IconAdjustmentsHorizontal size="16" />
      </button>
      <button 
        @click="emit('upgradeComparison', buildData)"
        class="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        title="Compare upgrade efficiency"
      >
        <IconScale size="16" />
      </button>
      <button 
        v-if="enabledStats.includes('stageDistribution') && results?.stageDistribution?.length"
        @click="emit('showDistribution')"
        class="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        title="Show Stage Distribution"
      >
        <IconChartBar size="16" />
      </button>
      <button 
        @click="emit('showCode')"
        class="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        title="Share Build"
      >
        <IconShare size="16" />
      </button>
      <button 
        @click="emit('archive', buildData)"
        class="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        :title="buildData.isArchived ? 'Restore Build' : 'Archive Build'"
      >
        <component :is="buildData.isArchived ? IconArchiveOff : IconArchive" size="16" />
      </button>
      <button
        @click="emit('delete', buildData)"
        class="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        title="Delete Build"
      >
        <IconTrash size="16" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { 
  IconEdit, IconEditCircle, IconCopy, IconShare, IconArchive, 
  IconArchiveOff, IconTrash, IconGripVertical, 
  IconAdjustmentsHorizontal, IconChartBar, IconScale
} from '@tabler/icons-vue';

const props = defineProps({
  buildData: { 
    type: Object, 
    required: true 
  },
  enabledStats: { 
    type: Array, 
    default: () => ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'] 
  },
  results: { 
    type: Object, 
    default: null 
  }
});

const emit = defineEmits([
  'edit', 'clone', 'archive', 'delete', 
  'overridesBuild', 'showCode', 'showDistribution',
  'nameChanged', 'upgradeComparison'
]);

// Name editing state
const isEditingName = ref(false);
const editableName = ref('');
const nameInputRef = ref(null);

// Berechne, ob Overrides aktiv sind
const hasOverrides = computed(() => {
  // Prüfe, ob Overrides existieren und aktiv sind
  return props.buildData.overrides && 
         Object.keys(props.buildData.overrides).length > 0;
});

// Start name editing
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

// Save edited name
function saveName() {
  if (editableName.value && editableName.value !== props.buildData.name) {
    // Emit event with correct structure
    emit('nameChanged', {
      buildId: props.buildData.id,
      name: editableName.value
    });
  }
  isEditingName.value = false;
}
</script>