<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-blue-400">TR Tracking</span>
            <span class=""> - Resource Settings</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="resetToDefaults" 
              class="px-2 py-1 sm:px-3 bg-gray-600 hover:bg-gray-500 text-xs sm:text-sm text-white rounded-md"
            >
              Reset
            </button>
            <button 
              @click="closeModal"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Description Area -->
      <div class="p-3 bg-gray-750/60 border-b border-gray-700">
        <div class="space-y-1">
          <p class="text-xs text-gray-300">
            Configure which resources to track in your TR plans. Enable/disable default resources and add custom ones.
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3">
        <!-- Standard Resources -->
        <div class="mb-4">
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">Standard Resources</h3>
            <span class="ml-2 text-xs text-gray-400">
              ({{ enabledStandardCount }}/{{ standardResources.length }} enabled)
            </span>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
            <div 
              v-for="resource in standardResources" 
              :key="resource.key"
              class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2"
            >
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">{{ resource.displayName }}</div>
                </div>
                
                <div>
                  <div 
                    @click="toggleStandardResource(resource.key)"
                    class="inline-block w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer"
                    :class="settings.enabledResources[resource.key] ? 'bg-green-600' : 'bg-gray-600'"
                  >
                    <div 
                      class="h-3 w-3 rounded-full bg-white transform transition-transform"
                      :class="settings.enabledResources[resource.key] ? 'translate-x-4' : ''"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Resources Section -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-purple-500 rounded-r mr-2"></div>
              <h3 class="font-medium text-sm text-purple-200">Custom Resources</h3>
              <span class="ml-2 text-xs text-gray-400">({{ settings.customResources.length }})</span>
            </div>
            
            <button
              @click="addCustomResource"
              class="flex items-center px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs transition-colors"
            >
              <IconPlus size="12" class="mr-1" />
              Add Custom
            </button>
          </div>
          
          <!-- No Custom Resources State -->
          <div v-if="settings.customResources.length === 0" class="bg-gray-850 rounded-lg p-4 text-center border border-gray-700">
            <IconCube size="32" class="text-gray-600 mx-auto mb-2" />
            <p class="text-sm text-gray-400 mb-3">No custom resources configured</p>
            <button
              @click="addCustomResource"
              class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs flex items-center gap-1 mx-auto transition-colors"
            >
              <IconPlus size="12" />
              Add First Custom Resource
            </button>
          </div>
          
          <!-- Custom Resources List -->
          <div v-else class="space-y-2">
            <div 
              v-for="(resource, index) in settings.customResources" 
              :key="index"
              class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2"
            >
              <div class="flex items-center gap-2">
                <!-- Name Input -->
                <div class="flex-1">
                  <input
                    v-model="resource.name"
                    type="text"
                    placeholder="Resource name"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    @input="validateCustomResource(resource, index)"
                  />
                  <div v-if="resource.error" class="text-red-400 text-xs mt-1">{{ resource.error }}</div>
                </div>
                
                <!-- Type Select -->
                <div class="w-20">
                  <select
                    v-model="resource.type"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="number">Number</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                
                <!-- Default Value Input -->
                <div class="w-16">
                  <input
                    v-if="resource.type === 'number'"
                    v-model.number="resource.defaultValue"
                    type="number"
                    placeholder="0"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs text-center placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <input
                    v-else-if="resource.type === 'text'"
                    v-model="resource.defaultValue"
                    type="text"
                    placeholder="Text"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs text-center placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <select
                    v-else
                    v-model="resource.defaultValue"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option :value="false">No</option>
                    <option :value="true">Yes</option>
                  </select>
                </div>
                
                <!-- Enable Toggle -->
                <div>
                  <div 
                    @click="resource.enabled = !resource.enabled"
                    class="inline-block w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer"
                    :class="resource.enabled ? 'bg-green-600' : 'bg-gray-600'"
                  >
                    <div 
                      class="h-3 w-3 rounded-full bg-white transform transition-transform"
                      :class="resource.enabled ? 'translate-x-4' : ''"
                    ></div>
                  </div>
                </div>
                
                <!-- Remove Button -->
                <button
                  @click="removeCustomResource(index)"
                  class="p-1 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition-colors"
                  title="Remove resource"
                >
                  <IconTrash size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-300">
            <span class="font-medium">{{ enabledStandardCount + enabledCustomCount }}</span> resources enabled
          </div>
          <div class="flex space-x-2">
            <button 
              @click="closeModal"
              class="px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
            >
              Cancel
            </button>
            <button 
              @click="saveSettings"
              class="px-2 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md text-xs flex items-center gap-1"
            >
              <IconCheck size="12" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  IconX, 
  IconPlus, 
  IconTrash, 
  IconCube,
  IconCheck
} from '@tabler/icons-vue';
import { 
  TR_TRACKING_RESOURCES, 
  DEFAULT_ENABLED_RESOURCES 
} from '@/constants/tr-tracker';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close', 'settingsUpdated']);

// Standard Resources (alle in einer Liste, keine Kategorien)
const standardResources = computed(() => {
  return TR_TRACKING_RESOURCES;
});

// Settings State
const settings = ref({
  enabledResources: {},
  customResources: [],
  columnMapping: {}
});

// Initialize default settings
function initializeSettings() {
  // Load from localStorage or set defaults
  const saved = localStorage.getItem('tr-tracking-resource-settings');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      settings.value = {
        enabledResources: parsed.enabledResources || {},
        customResources: parsed.customResources || [],
        columnMapping: parsed.columnMapping || {}
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      setDefaultSettings();
    }
  } else {
    setDefaultSettings();
  }
}

function setDefaultSettings() {
  // Enable default resources
  const defaultEnabled = {};
  DEFAULT_ENABLED_RESOURCES.forEach(key => {
    defaultEnabled[key] = true;
  });
  
  settings.value = {
    enabledResources: defaultEnabled,
    customResources: [],
    columnMapping: {}
  };
}

// Computed Properties
const enabledStandardCount = computed(() => {
  return Object.values(settings.value.enabledResources).filter(Boolean).length;
});

const enabledCustomCount = computed(() => {
  return settings.value.customResources.filter(r => r.enabled).length;
});

// Methods
function closeModal() {
  emit('close');
}

function toggleStandardResource(key) {
  settings.value.enabledResources[key] = !settings.value.enabledResources[key];
}

function addCustomResource() {
  settings.value.customResources.push({
    name: '',
    type: 'number',
    defaultValue: 0,
    enabled: true,
    error: null
  });
}

function removeCustomResource(index) {
  settings.value.customResources.splice(index, 1);
}

function validateCustomResource(resource, index) {
  resource.error = null;
  
  if (!resource.name.trim()) {
    resource.error = 'Name is required';
    return;
  }
  
  // Check for duplicates in custom resources
  const duplicate = settings.value.customResources.find((r, i) => 
    i !== index && r.name.toLowerCase() === resource.name.toLowerCase()
  );
  
  if (duplicate) {
    resource.error = 'Name already exists';
    return;
  }
  
  // Check against standard resources
  const standardConflict = TR_TRACKING_RESOURCES.find(r => 
    r.displayName.toLowerCase() === resource.name.toLowerCase() ||
    r.key.toLowerCase() === resource.name.toLowerCase()
  );
  
  if (standardConflict) {
    resource.error = 'Conflicts with standard resource';
    return;
  }
}

function resetToDefaults() {
  if (confirm('Reset all settings to defaults? This will remove custom resources.')) {
    setDefaultSettings();
  }
}

function saveSettings() {
  // Validate custom resources
  let hasErrors = false;
  settings.value.customResources.forEach((resource, index) => {
    validateCustomResource(resource, index);
    if (resource.error) hasErrors = true;
  });
  
  if (hasErrors) {
    alert('Please fix the errors in custom resources before saving.');
    return;
  }
  
  // Save to localStorage
  try {
    localStorage.setItem('tr-tracking-resource-settings', JSON.stringify(settings.value));
    
    // WICHTIG: Dispatch custom event für same-tab updates
    window.dispatchEvent(new CustomEvent('tr-settings-updated', {
      detail: settings.value
    }));
    
    // AUCH: Storage event für cross-tab updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'tr-tracking-resource-settings',
      newValue: JSON.stringify(settings.value),
      oldValue: null,
      storageArea: localStorage
    }));
    
    emit('settingsUpdated', settings.value);
    closeModal();
    
    console.log('✅ Settings saved and events dispatched');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Failed to save settings.');
  }
}

// Watch for modal open/close
watch(() => props.show, (show) => {
  if (show) {
    initializeSettings();
  }
});

// Initialize when component loads
initializeSettings();
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

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
}
</style>