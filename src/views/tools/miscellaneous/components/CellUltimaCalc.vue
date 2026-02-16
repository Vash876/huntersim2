<template>
  <div class="relative p-4 flex flex-col flex-1">
    <div class="flex items-center gap-2 mb-3">
      <img src="@/assets/general/cells.png" alt="Cells" class="w-6 h-6" />
      <h4 class="text-sm font-semibold text-green-300">Cell Ultima Research</h4>
    </div>
    <div class="flex justify-between text-xs text-gray-400 mb-3">
      <span>Cost: ×1.03 <img src="@/assets/general/rp.png" alt="RP" class="w-3.5 h-3.5 inline" /> /lvl</span>
      <span>Buff: ×1.01 <img src="@/assets/general/cells.png" alt="Cells" class="w-3.5 h-3.5 inline" /> /lvl</span>
    </div>
    
    <div class="flex items-center justify-between gap-2">
      <label class="text-xs text-gray-400 whitespace-nowrap">OoMs of RP</label>
      <ToolValueControls
        :value="oomInput"
        :min-value="1"
        :max-value="999999"
        :step="1"
        :fast-step="10"
        :show-fast-controls="true"
        @update:value="updateOom"
      />
    </div>

    <div class="mt-auto"></div>
    <div class="my-3 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>

    <div v-if="result" class="space-y-1.5">
      <div class="flex justify-between text-xs">
        <span class="text-gray-400">Duration <span class="text-gray-500">({{ tickSpeed }}s/tick)</span></span>
        <span class="text-cyan-400 font-mono">{{ result.timeDisplay }}</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-gray-400">Levels gained</span>
        <span class="text-white font-mono">{{ result.levels.toLocaleString('en-US') }}</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-gray-400">Buff gained</span>
        <span class="text-green-400 font-mono">{{ result.buffDisplay }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { calculateUltima } from '../calculations.js';
import { useMiscStore } from '../store.js';

const WIDGET_ID = 'cellUltima';
const miscStore = useMiscStore();

// --- Tick Speed from AttGN3 Calculator ---
const tickSpeed = ref(1.5);

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('attrGN3Calculator_settings') || '{}');
    if (saved.tickSpeed !== undefined && saved.tickSpeed > 0) {
      tickSpeed.value = saved.tickSpeed;
    }
  } catch (e) { /* ignore */ }

  // Restore persisted inputs
  const saved = miscStore.getInputs(WIDGET_ID);
  if (saved.oomInput !== undefined) oomInput.value = saved.oomInput;
});

const oomInput = ref(10);

function updateOom(val) {
  oomInput.value = val;
  miscStore.saveInputs(WIDGET_ID, { oomInput: val });
}

const result = computed(() => calculateUltima(oomInput.value, 1.03, 1.01, tickSpeed.value));
</script>
