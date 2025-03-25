<template>
  <div class="bg-gray-850 rounded-lg p-4 border border-gray-700">
    <h2 class="text-xl font-bold mb-4">TR Settings</h2>
    
    <div class="space-y-4">
      <!-- TR Count -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">TR Count</label>
        <input 
          v-model.number="localConfig.trCount" 
          type="number" 
          min="1" 
          class="w-full py-2 px-3 bg-gray-800 text-white rounded border border-gray-700"
        />
      </div>
      
      <!-- All-Time Orbs -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">All-Time Orbs</label>
        <input 
          v-model.number="localConfig.allTimeOrbs" 
          type="number" 
          min="0" 
          class="w-full py-2 px-3 bg-gray-800 text-white rounded border border-gray-700"
        />
      </div>
      
      <!-- Start Date -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
        <input 
          v-model="localConfig.startDate" 
          type="date" 
          class="w-full py-2 px-3 bg-gray-800 text-white rounded border border-gray-700"
        />
      </div>
      
      <!-- Campaign Frags Option -->
      <div class="flex items-center">
        <input 
          id="campaignFrags" 
          v-model="localConfig.calculateCampaignFrags" 
          type="checkbox" 
          class="w-4 h-4 mr-2"
        />
        <label for="campaignFrags" class="text-sm text-gray-300">
          Calculate Campaign Fragments
        </label>
      </div>
      
      <!-- Buttons -->
      <div class="flex space-x-2 pt-2">
        <button 
          @click="applyChanges" 
          class="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Apply
        </button>
        <button 
          @click="resetToDefaults" 
          class="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRef } from 'vue';

const props = defineProps({
  plannerConfig: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:config']);

// Lokale Kopie der Konfiguration
const localConfig = ref({...props.plannerConfig});

// Änderungen anwenden
function applyChanges() {
  emit('update:config', {...localConfig.value});
}

// Auf Standardwerte zurücksetzen
function resetToDefaults() {
  localConfig.value = {
    trCount: 10,
    allTimeOrbs: 0,
    startDate: new Date().toISOString().split('T')[0],
    calculateCampaignFrags: false
  };
  applyChanges();
}

// Wenn sich die Props ändern, lokale Kopie aktualisieren
watch(() => props.plannerConfig, (newConfig) => {
  localConfig.value = {...newConfig};
}, { deep: true });
</script>