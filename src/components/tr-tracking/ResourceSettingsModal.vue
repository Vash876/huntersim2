<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold text-white flex items-center">
            <IconSettings size="16" class="mr-2 text-blue-400" />
            Resource Settings
          </h3>
        </div>
        <button
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>

      <!-- Description -->
      <div class="px-3 py-2 border-b border-gray-700">
        <p class="text-xs text-gray-300 mb-2">Choose which resources to track in your TR progress</p>
        <div class="bg-gray-700/30 rounded-lg p-2 text-xs text-gray-400">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded mr-1.5"></div>
              <span><strong>Track:</strong> Include resource in TR entries and charts</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-500 rounded mr-1.5"></div>
              <span><strong>Table:</strong> Show "Highest" column in main overview table</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3">
        <!-- Initial Values Section -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-green-500 rounded-r mr-2"></div>
              <h4 class="font-medium text-sm text-green-200">Initial Values</h4>
              <span class="text-xs text-gray-400 ml-2">(show in table)</span>
            </div>
          </div>
          <p class="text-xs text-gray-400 mb-2">Show starting values from Plan creation in the main overview table</p>
          
          <!-- Initial Values Grid -->
          <div class="flex flex-wrap gap-2">
            <div
              v-for="initialValue in trTrackingStore.availableInitialValues"
              :key="initialValue.id"
              @click="toggleInitialValue(initialValue)"
              class="border rounded-md p-2 cursor-pointer transition-all text-center"
              :class="isInitialValueInTable(initialValue) 
                ? 'border-green-500 bg-green-900/30' 
                : 'border-gray-600 bg-gray-700/30 hover:border-gray-500'"
            >
              <div 
                class="text-xs font-medium"
                :style="{ color: initialValue.color }"
              >
                {{ initialValue.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Standard Resources Section -->
        <div class="border-t border-gray-700 pt-3">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
              <h4 class="font-medium text-sm text-blue-200">Standard Resources</h4>
              <span class="text-xs text-gray-400 ml-2">({{ enabledResourcesCount }}/{{ availableResourcesCount }} enabled)</span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <EditableResource
              v-for="resource in sortedAvailableResources"
              :key="resource.id"
              :resource="resource"
              :isSelected="isResourceSelected(resource)"
              :showInTable="isResourceInTable(resource)"
              @toggle="toggleResource(resource)"
              @toggleTable="toggleResourceTable(resource)"
              @update="updateResource"
            />
          </div>
        </div>

        <!-- Custom Resources Section -->
        <div class="border-t border-gray-700 pt-3">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-purple-500 rounded-r mr-2"></div>
              <h4 class="font-medium text-sm text-purple-200">Custom Resources</h4>
              <span class="text-xs text-gray-400 ml-2">({{ enabledCustomResourcesCount }}/{{ customResourcesCount }} enabled)</span>
            </div>
            <button
              @click="showAddCustomForm = !showAddCustomForm"
              class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-md transition-colors flex items-center gap-1 text-xs"
            >
              <IconPlus size="12" />
              Add Custom
            </button>
          </div>

          <!-- Custom Resources List -->
          <div v-if="customResources.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
            <EditableResource
              v-for="resource in customResources"
              :key="resource.id"
              :resource="resource"
              :isSelected="isResourceSelected(resource)"
              :showInTable="isResourceInTable(resource)"
              @toggle="toggleResource(resource)"
              @toggleTable="toggleResourceTable(resource)"
              @remove="removeCustomResource"
              @update="updateCustomResource"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-4">
            <IconCube size="32" class="mx-auto text-gray-600 mb-2" />
            <p class="text-gray-400 mb-2 text-xs">No custom resources configured</p>
            <button
              @click="showAddCustomForm = true"
              class="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-md transition-colors inline-flex items-center gap-1 text-xs"
            >
              <IconPlus size="12" />
              Add First Custom Resource
            </button>
          </div>

          <!-- Add Custom Resource Form -->
          <div v-if="showAddCustomForm" class="mt-2 p-2 border border-gray-700 rounded-md bg-gray-700/30">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <!-- Color Picker -->
                <ColorPicker 
                  :modelValue="newResourceColor"
                  @update:modelValue="newResourceColor = $event"
                  class="flex-shrink-0"
                />
                
                <!-- Resource Name -->
                <input
                  v-model="newResourceName"
                  type="text"
                  placeholder="Resource name"
                  class="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none text-xs"
                />
                
                <!-- Data Type Selector -->
                <select
                  v-model="newResourceDataType"
                  class="bg-gray-700 border border-gray-600 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-purple-500"
                  title="Select data type"
                >
                  <option value="number">Number</option>
                  <option value="suffix">Suffix</option>
                  <option value="text">Text</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
              
              <!-- Buttons -->
              <div class="flex gap-1 justify-end">
                <button
                  @click="addCustomResource"
                  :disabled="!newResourceName.trim()"
                  class="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded transition-colors text-xs"
                >
                  Add
                </button>
                <button
                  @click="cancelAddCustom"
                  class="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="p-2 bg-gray-700/30 rounded-md">
          <p class="text-xs text-gray-300">
            <strong>{{ enabledResourcesCount }} resources enabled</strong> for tracking in your TR plans.
            <strong>{{ localShowInTableResources.length }} resources</strong> will show highest values in the main table.
            <strong>{{ localShowInitialValuesInTable.length }} initial values</strong> will show in the overview.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between pt-2 border-t border-gray-700 px-3 pb-3">
        <button
          @click="resetToDefaults"
          class="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <IconRotateClockwise size="12" />
          Reset
        </button>
        
        <button
          @click="closeModal"
          class="px-3 py-1.5 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-xs"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { IconX, IconSettings, IconPlus, IconCube, IconRotateClockwise } from '@tabler/icons-vue';
import EditableResource from './EditableResource.vue';
import ColorPicker from '@/components/common/ColorPicker.vue';

const props = defineProps({
  show: Boolean,
  selectedResources: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'updateStandardResource', 'updateCustomResource']);

const trTrackingStore = useTRTrackingStore();

// Local state
const localSelectedResources = ref([]);
const localShowInTableResources = ref([]);
const localShowInitialValuesInTable = ref([]);
const newResourceName = ref('');
const newResourceColor = ref('#3B82F6');
const newResourceDataType = ref('number'); // Default to 'number'
const showAddCustomForm = ref(false);

// Computed properties
const sortedAvailableResources = computed(() => {
  return [...trTrackingStore.availableResources]
    .filter(r => r.category !== 'custom');
});

const customResources = computed(() => {
  return trTrackingStore.availableResources.filter(r => r.category === 'custom');
});

const enabledResourcesCount = computed(() => {
  return trTrackingStore.availableResources.filter(r => 
    localSelectedResources.value.some(selected => selected.id === r.id)
  ).length;
});

const availableResourcesCount = computed(() => {
  return trTrackingStore.availableResources.filter(r => r.category !== 'custom').length;
});

const customResourcesCount = computed(() => {
  return customResources.value.length;
});

const enabledCustomResourcesCount = computed(() => {
  return customResources.value.filter(r => 
    localSelectedResources.value.some(selected => selected.id === r.id)
  ).length;
});

// Watch for prop changes
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Ensure store is initialized first
    trTrackingStore.init();
    // Initialize with current store state when modal opens
    localSelectedResources.value = [...trTrackingStore.selectedResources];
    localShowInTableResources.value = [...trTrackingStore.showInTableResources];
    localShowInitialValuesInTable.value = [...trTrackingStore.showInitialValuesInTable];
    console.log('Modal opened, local resources set to:', {
      selected: localSelectedResources.value.map(r => r.id),
      showInTable: localShowInTableResources.value,
      showInitialValues: localShowInitialValuesInTable.value
    });
  }
});

// Keep props.selectedResources for backward compatibility
watch(() => props.selectedResources, (newVal) => {
  if (newVal && newVal.length > 0 && !props.show) {
    localSelectedResources.value = [...newVal];
    localShowInTableResources.value = [...trTrackingStore.showInTableResources];
    localShowInitialValuesInTable.value = [...trTrackingStore.showInitialValuesInTable];
  }
}, { immediate: true });

// Methods
function isResourceSelected(resource) {
  return localSelectedResources.value.some(selected => selected.id === resource.id);
}

function isResourceInTable(resource) {
  return localShowInTableResources.value.includes(resource.id);
}

function isInitialValueInTable(initialValue) {
  return localShowInitialValuesInTable.value.includes(initialValue.id);
}

function toggleInitialValue(initialValue) {
  const index = localShowInitialValuesInTable.value.indexOf(initialValue.id);
  
  if (index > -1) {
    localShowInitialValuesInTable.value.splice(index, 1);
  } else {
    localShowInitialValuesInTable.value.push(initialValue.id);
  }
}

function toggleResource(resource) {
  const index = localSelectedResources.value.findIndex(selected => selected.id === resource.id);
  
  if (index > -1) {
    localSelectedResources.value.splice(index, 1);
    // If resource is deselected, also remove from table
    const tableIndex = localShowInTableResources.value.indexOf(resource.id);
    if (tableIndex > -1) {
      localShowInTableResources.value.splice(tableIndex, 1);
    }
  } else {
    localSelectedResources.value.push({ ...resource });
  }
}

function toggleResourceTable(resource) {
  // Can only show in table if resource is selected
  if (!isResourceSelected(resource)) return;
  
  const index = localShowInTableResources.value.indexOf(resource.id);
  
  if (index > -1) {
    localShowInTableResources.value.splice(index, 1);
  } else {
    localShowInTableResources.value.push(resource.id);
  }
}

function addCustomResource() {
  if (!newResourceName.value.trim()) return;

  const customResource = {
    id: newResourceName.value.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: newResourceName.value.trim(),
    color: newResourceColor.value,
    category: 'custom',
    dataType: newResourceDataType.value,
    format: 'custom' // Custom resources have format 'custom'
  };

  // Check if resource with this ID already exists
  const exists = trTrackingStore.availableResources.some(r => r.id === customResource.id);
  if (exists) {
    alert('A resource with this name already exists!');
    return;
  }

  const addedResource = trTrackingStore.addCustomResource(customResource);
  
  // Custom resources are not auto-selected anymore
  // User can manually toggle them on/off

  // Reset form
  newResourceName.value = '';
  newResourceColor.value = '#3B82F6';
  newResourceDataType.value = 'number'; // Reset to default
  showAddCustomForm.value = false;
}

function removeCustomResource(resourceId) {
  if (trTrackingStore.removeCustomResource(resourceId)) {
    // Remove from selected resources too
    localSelectedResources.value = localSelectedResources.value.filter(r => r.id !== resourceId);
  }
}

function cancelAddCustom() {
  newResourceName.value = '';
  newResourceColor.value = '#3B82F6';
  newResourceDataType.value = 'number'; // Reset to default
  showAddCustomForm.value = false;
}

function updateResource(resourceData) {
  const { id, name, color } = resourceData;
  
  // Update standard resource if it exists
  const standardResource = trTrackingStore.availableResources.find(r => r.id === id);
  if (standardResource) {
    trTrackingStore.updateStandardResourceColor(id, color);
    // Also update in local selected resources if it's selected
    const localResource = localSelectedResources.value.find(r => r.id === id);
    if (localResource) {
      localResource.color = color;
    }
    // Emit update to parent
    emit('updateStandardResource', { id, color });
  }
}

function updateCustomResource(resourceData) {
  const { id, name, color, dataType } = resourceData;
  
  // Update custom resource in store
  trTrackingStore.updateCustomResource(id, { name, color, dataType });
  
  // Also update in local selected resources if it's selected
  const localResource = localSelectedResources.value.find(r => r.id === id);
  if (localResource) {
    localResource.name = name;
    localResource.color = color;
    if (dataType !== undefined) {
      localResource.dataType = dataType;
    }
  }
  
  // Emit update to parent
  emit('updateCustomResource', { id, name, color, dataType });
}

function resetToDefaults() {
  // Reset to default selected resources in the store
  trTrackingStore.resetToDefaults();
  // Update local state to reflect the store change
  localSelectedResources.value = [...trTrackingStore.selectedResources];
  localShowInTableResources.value = [...trTrackingStore.showInTableResources];
  localShowInitialValuesInTable.value = [...trTrackingStore.showInitialValuesInTable];
  showAddCustomForm.value = false;
}

function closeModal() {
  // Automatically save settings to store when closing
  trTrackingStore.updateSelectedResources(localSelectedResources.value);
  trTrackingStore.updateShowInTableResources(localShowInTableResources.value);
  trTrackingStore.updateShowInitialValuesInTable(localShowInitialValuesInTable.value);
  // Also emit to parent for any additional processing
  emit('close', localSelectedResources.value);
}

function saveSettings() {
  // This function is no longer used but kept for compatibility
  emit('close', localSelectedResources.value);
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

/* Custom color input styling */
input[type="color"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  border: none;
  cursor: pointer;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
  border-radius: 4px;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}
</style>
