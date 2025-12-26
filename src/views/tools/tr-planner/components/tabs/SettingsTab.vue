<template>
  <div class="space-y-3">
    <p class="text-xs text-gray-400">
      Global settings for TR calculations.
    </p>
    
    <!-- TR Count -->
    <div class="bg-gray-700/50 rounded-lg p-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm text-gray-300">TR Count</span>
        <ToolValueControls
          :value="trCount"
          :min-value="0"
          :max-value="9999"
          :step="1"
          :fast-step="10"
          :show-fast-controls="true"
          @update:value="setTRCount"
        />
      </div>
      <div class="text-[10px] text-gray-500">
        Number of completed Time Rewinds
      </div>
    </div>
    
    <!-- All Time Orbs -->
    <div class="bg-gray-700/50 rounded-lg p-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm text-gray-300">All-Time Orbs</span>
        <input 
          type="text" 
          v-model="allTimeOrbsFormatted"
          class="w-24 h-7 bg-gray-800 border border-gray-600 rounded text-center text-sm text-gray-200"
          placeholder="1.5M"
        />
      </div>
      <div class="text-[10px] text-gray-500">
        Total orbs earned all-time. Use suffix: K, M, B, T
      </div>
    </div>
    
    <!-- Default Hours in TR -->
    <div class="bg-gray-700/50 rounded-lg p-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm text-gray-300">Default Hours in TR</span>
        <ToolValueControls
          :value="hoursInTR"
          :min-value="1"
          :max-value="168"
          :step="1"
          :fast-step="12"
          :show-fast-controls="true"
          @update:value="setHoursInTR"
        />
      </div>
      <div class="text-[10px] text-gray-500">
        Default hours per TR step
      </div>
    </div>
    
    <!-- Data Management -->
    <div class="border-t border-gray-600 pt-3 mt-3">
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Data Management
      </h3>
      
      <div class="space-y-2">
        <button 
          @click="resetToDefaults"
          class="w-full px-3 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 rounded-lg text-sm text-red-400 flex items-center gap-2 transition-colors"
        >
          <IconRefresh :size="16" />
          Reset to Defaults
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconRefresh } from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';

const store = useTRPlannerStore();

const trCount = computed(() => store.modifiers.settings.trCount);
const hoursInTR = computed(() => store.modifiers.settings.defaultHoursInTR);

// Formatted all-time orbs with suffix support
const allTimeOrbsFormatted = computed({
  get: () => formatWithSuffix(store.modifiers.settings.allTimeOrbs),
  set: (value) => {
    const parsed = parseWithSuffix(value);
    if (!isNaN(parsed)) {
      store.setAllTimeOrbs(parsed);
    }
  }
});

function setTRCount(value) {
  store.setTRCount(value);
}

function setHoursInTR(value) {
  store.setDefaultHoursInTR(value);
}

function resetToDefaults() {
  if (confirm('Reset all settings to defaults?')) {
    store.$reset();
  }
}

// Suffix parsing/formatting
function formatWithSuffix(value) {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
  return String(value);
}

function parseWithSuffix(str) {
  if (!str) return 0;
  str = String(str).trim().toUpperCase();
  
  const suffixes = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 };
  const match = str.match(/^([\d.]+)\s*([KMBT])?$/);
  
  if (match) {
    const num = parseFloat(match[1]);
    const suffix = match[2];
    return suffix ? num * suffixes[suffix] : num;
  }
  
  return parseFloat(str) || 0;
}
</script>
