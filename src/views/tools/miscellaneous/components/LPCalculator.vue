<template>
  <div class="relative p-4 flex flex-col flex-1">
    <div class="flex items-center gap-2 mb-3">
      <img src="@/assets/general/lp.png" alt="LP" class="w-6 h-6" />
      <h4 class="text-sm font-semibold text-purple-300">LP Calculator</h4>
    </div>

    <!-- Research #102 -->
    <div v-if="access.canSeeResearch102.value" class="flex items-center justify-between gap-2 mb-1.5">
      <label class="text-xs text-gray-400 whitespace-nowrap">Research #102</label>
      <select
        v-model.number="r102Level"
        class="bg-gray-900 border border-gray-600 rounded-md px-2 py-1 text-xs text-white focus:border-purple-500 focus:outline-none transition-colors"
      >
        <option :value="0">None</option>
        <option v-for="r in r102Options" :key="r.level" :value="r.level">
          Lvl {{ r.level }} ({{ r.cost.toLocaleString('en-US') }} RP)
        </option>
      </select>
    </div>

    <!-- T2R6 Level -->
    <div v-if="access.canSeeT2R6.value" class="flex items-center justify-between gap-2 mb-1.5">
      <label class="text-xs text-gray-400 whitespace-nowrap">T2R6 Level</label>
      <ToolValueControls
        :value="t2r6Level"
        :min-value="0"
        :max-value="9999"
        :step="1"
        :fast-step="10"
        :show-fast-controls="true"
        @update:value="updateT2r6"
      />
    </div>

    <!-- LP Amount -->
    <div class="flex items-center justify-between gap-2 mb-1.5">
      <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
        <img src="@/assets/general/lp.png" alt="LP" class="w-3.5 h-3.5" /> LP Amount
      </label>
      <ToolValueControls
        :value="lpAmount"
        :min-value="0"
        :max-value="999999"
        :step="10"
        :fast-step="100"
        :show-fast-controls="true"
        @update:value="updateLpAmount"
      />
    </div>

    <div class="mt-auto"></div>
    <div class="my-3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

    <!-- Results Table -->
    <div class="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1.5 text-xs items-center">
      <!-- Header -->
      <span class="text-[10px] text-gray-500 border-b border-gray-700/50 pb-1">Resource</span>
      <span class="text-[10px] text-gray-500 text-right border-b border-gray-700/50 pb-1">Per interval</span>
      <span class="text-[10px] text-gray-500 text-right border-b border-gray-700/50 pb-1">Total</span>

      <!-- Cells -->
      <span class="text-gray-400 flex items-center gap-1">
        <img src="@/assets/general/cells.png" alt="Cells" class="w-3.5 h-3.5" /> Cells
        <span class="text-gray-500 text-[9px]">/ 10</span>
      </span>
      <span class="font-mono text-right text-green-400">×{{ lpResults.cells.multi.toFixed(2) }}</span>
      <span class="font-mono text-right text-purple-300">{{ lpResults.cells.totalDisplay }}</span>

      <!-- MP -->
      <span class="text-gray-400 flex items-center gap-1">
        <img src="@/assets/general/mp.png" alt="MP" class="w-3.5 h-3.5" /> MP
        <span class="text-gray-500 text-[9px]">/ 10</span>
      </span>
      <span class="font-mono text-right text-red-400">×{{ lpResults.mp.multi.toFixed(2) }}</span>
      <span class="font-mono text-right text-purple-300">{{ lpResults.mp.totalDisplay }}</span>

      <!-- Shards -->
      <span class="text-gray-400 flex items-center gap-1">
        <img src="@/assets/general/shards.png" alt="Shards" class="w-3.5 h-3.5" /> Shards
        <span class="text-gray-500 text-[9px]">/ 10</span>
      </span>
      <span class="font-mono text-right text-cyan-400">×{{ lpResults.shards.multi.toFixed(2) }}</span>
      <span class="font-mono text-right text-purple-300">{{ lpResults.shards.totalDisplay }}</span>

      <!-- RP (requires Innovation Gem ≥ 3) -->
      <template v-if="access.canSeeResearch102.value">
        <span class="text-gray-400 flex items-center gap-1">
          <img src="@/assets/general/rp.png" alt="RP" class="w-3.5 h-3.5" /> RP
          <span class="text-gray-500 text-[9px]">/ {{ access.rpInterval.value }}</span>
        </span>
        <span class="font-mono text-right text-orange-400">×{{ lpResults.rp.multi.toFixed(2) }}</span>
        <span class="font-mono text-right text-purple-300">{{ lpResults.rp.totalDisplay }}</span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { formatMultiplier } from '../calculations.js';
import { useMiscStore } from '../store.js';
import { useContentAccess } from '../useContentAccess.js';

const WIDGET_ID = 'lpCalculator';
const miscStore = useMiscStore();
const access = useContentAccess();

const t2r6Level = ref(0);
const r102Level = ref(0);
const lpAmount = ref(100);

const r102Options = [
  { level: 1, cost: 6000 },
  { level: 2, cost: 6310 },
  { level: 3, cost: 6620 },
  { level: 4, cost: 6930 },
  { level: 5, cost: 7240 },
  { level: 6, cost: 7550 },
];

onMounted(() => {
  const saved = miscStore.getInputs(WIDGET_ID);
  if (saved.t2r6Level !== undefined) t2r6Level.value = saved.t2r6Level;
  if (saved.r102Level !== undefined) r102Level.value = saved.r102Level;
  if (saved.lpAmount !== undefined) lpAmount.value = saved.lpAmount;
});

function persist() {
  miscStore.saveInputs(WIDGET_ID, {
    t2r6Level: t2r6Level.value,
    r102Level: r102Level.value,
    lpAmount: lpAmount.value,
  });
}

function updateT2r6(val) { t2r6Level.value = val; persist(); }
function updateLpAmount(val) { lpAmount.value = val; persist(); }
watch(r102Level, persist);

const lpResults = computed(() => {
  const t2r6Bonus = t2r6Level.value * 0.02;

  // Base exponents with T2R6 additive bonus
  let cellsPower = 1 + t2r6Bonus;
  let mpPower = 1 + t2r6Bonus;
  let shardsPower = 1 + t2r6Bonus;
  let rpPower = 1 + t2r6Bonus;

  // Research #102 multiplicative bonuses
  if (r102Level.value >= 1) cellsPower *= 2;
  if (r102Level.value >= 3) mpPower *= 1.25;
  if (r102Level.value >= 5) shardsPower *= 1.25;

  const lp = lpAmount.value;

  const cellsMulti = Math.pow(2, cellsPower);
  const mpMulti = Math.pow(2, mpPower);
  const shardsMulti = Math.pow(2, shardsPower);
  const rpMulti = Math.pow(2, rpPower);

  const rpInterval = access.rpInterval.value;

  const cellsTotal = Math.pow(cellsMulti, lp / 10);
  const mpTotal = Math.pow(mpMulti, lp / 10);
  const shardsTotal = Math.pow(shardsMulti, lp / 10);
  const rpTotal = Math.pow(rpMulti, lp / rpInterval);

  return {
    cells: { power: cellsPower, multi: cellsMulti, totalDisplay: formatMultiplier(cellsTotal) },
    mp: { power: mpPower, multi: mpMulti, totalDisplay: formatMultiplier(mpTotal) },
    shards: { power: shardsPower, multi: shardsMulti, totalDisplay: formatMultiplier(shardsTotal) },
    rp: { power: rpPower, multi: rpMulti, totalDisplay: formatMultiplier(rpTotal) },
  };
});
</script>
