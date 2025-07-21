<template>
  <div class="bg-gray-800 rounded-lg p-6 m-4 border border-gray-700">
    <h3 class="text-lg font-bold text-white mb-4">Test Code Generator</h3>
    
    <div class="space-y-4">
      <button
        @click="generateCustomCode"
        class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors"
      >
        Generate Custom TR Plan (25 entries, 3/5 goals reached)
      </button>
      
      <button
        @click="generateOriginalCode"
        class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors ml-2"
      >
        Generate Original TR Plan (20 entries)
      </button>
      
      <div v-if="generatedCode" class="mt-4">
        <h4 class="text-md font-semibold text-white mb-2">Generated Import Code:</h4>
        <div class="bg-gray-900 rounded-md p-4 border border-gray-600">
          <textarea
            :value="generatedCode"
            readonly
            class="w-full h-32 bg-transparent text-green-400 font-mono text-sm resize-none border-none outline-none"
            @click="selectAll"
          ></textarea>
          <div class="flex gap-2 mt-2">
            <button
              @click="copyToClipboard"
              class="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Copy Code
            </button>
            <button
              @click="clearCode"
              class="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="codeInfo" class="mt-4 bg-gray-700 rounded-md p-4">
        <h4 class="text-md font-semibold text-white mb-2">Code Info:</h4>
        <ul class="text-gray-300 text-sm space-y-1">
          <li><strong>Track Name:</strong> {{ codeInfo.name }}</li>
          <li><strong>Entries:</strong> {{ codeInfo.entriesCount }}</li>
          <li><strong>Goals:</strong> {{ codeInfo.goalsInfo }}</li>
          <li><strong>Status:</strong> {{ codeInfo.isActive ? 'Active' : 'Completed' }}</li>
        </ul>
      </div>
      
      <div class="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded-md">
        <p class="text-yellow-200 text-sm">
          <strong>⚠️ Test Component:</strong> Diese Komponente ist nur für Testzwecke und wird später entfernt.
          Verwende die generierten Codes zum Testen der Import-Funktionalität.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { generateCustomTRPlan, generateTRPlanWithGoals } from '@/utils/trImportExport';

const generatedCode = ref('');
const codeInfo = ref(null);

function generateCustomCode() {
  try {
    generatedCode.value = generateCustomTRPlan();
    codeInfo.value = {
      name: 'TR 158 - Custom Goals Challenge',
      entriesCount: 25,
      goalsInfo: 'OO: 15t, Cells: 75k, MP: 6.2k, RP: 4.6k, M0: 187 (3/5 reached)',
      isActive: true
    };
  } catch (error) {
    console.error('Error generating custom code:', error);
    alert('Error generating code: ' + error.message);
  }
}

function generateOriginalCode() {
  try {
    generatedCode.value = generateTRPlanWithGoals();
    codeInfo.value = {
      name: 'TR 157 - Advanced Goals Plan',
      entriesCount: 20,
      goalsInfo: 'OO: 15, Cells: 75k, MP: 25k, RP: 1.6k, M0: 250',
      isActive: true
    };
  } catch (error) {
    console.error('Error generating original code:', error);
    alert('Error generating code: ' + error.message);
  }
}

function selectAll(event) {
  event.target.select();
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(generatedCode.value);
    alert('Code copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = generatedCode.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Code copied to clipboard!');
  }
}

function clearCode() {
  generatedCode.value = '';
  codeInfo.value = null;
}
</script>

<style scoped>
/* Component-specific styles if needed */
</style>
