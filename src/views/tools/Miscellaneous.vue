<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl border border-gray-800 p-4 sm:p-8">
      <!-- Heading (mobile only) -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white md:hidden">
        Miscellaneous
      </h2>

      <!-- Info Banner -->
      <div class="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-6 text-center">
        <p class="text-blue-200 text-sm">
          Quick reference for commonly looked-up game values, tables, and formulas.
        </p>
      </div>

      <!-- Calculators Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        <!-- Cell Ultima Research Calculator -->
        <div class="relative flex flex-col rounded-xl overflow-hidden border border-green-800/30 bg-gradient-to-br from-green-950/40 via-gray-800/60 to-gray-900/80 backdrop-blur-sm transition-[shadow,border-color] duration-300 hover:shadow-md hover:shadow-green-900/20 hover:border-white/[0.08]">
          <!-- Top Accent -->
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <div class="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-br from-white via-transparent to-transparent"></div>

          <div class="relative p-4 flex flex-col flex-1">
            <div class="flex items-center gap-2 mb-3">
              <img src="@/assets/general/cells.png" alt="Cells" class="w-6 h-6" />
              <h4 class="text-sm font-semibold text-green-300">Cell Ultima Research</h4>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mb-3">
              <span>Cost: ×1.03 <img src="@/assets/general/rp.png" alt="RP" class="w-3.5 h-3.5 inline" /> /lvl</span>
              <span>Buff: ×1.01 <img src="@/assets/general/cells.png" alt="Cells" class="w-3.5 h-3.5 inline" /> /lvl</span>
            </div>
            
            <label class="text-xs text-gray-400 block mb-1">OOMs of RP</label>
            <ToolValueControls
              :value="cellOomInput"
              :min-value="1"
              :max-value="999999"
              :step="1"
              :fast-step="10"
              :show-fast-controls="true"
              @update:value="cellOomInput = $event"
            />

            <div v-if="cellResult" class="mt-3 space-y-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-gray-400">Duration <span class="text-gray-500">({{ tickSpeed }}s/tick)</span></span>
                <span class="text-cyan-400 font-mono">{{ cellResult.timeDisplay }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-400">Levels gained</span>
                <span class="text-white font-mono">{{ cellResult.levels.toLocaleString('en-US') }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-400">Buff gained</span>
                <span class="text-green-400 font-mono">{{ cellResult.buffDisplay }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Temporal Ultima Research Calculator -->
        <div class="relative flex flex-col rounded-xl overflow-hidden border border-red-800/30 bg-gradient-to-br from-red-950/40 via-gray-800/60 to-gray-900/80 backdrop-blur-sm transition-[shadow,border-color] duration-300 hover:shadow-md hover:shadow-red-900/20 hover:border-white/[0.08]">
          <!-- Top Accent -->
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
          <div class="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-br from-white via-transparent to-transparent"></div>

          <div class="relative p-4 flex flex-col flex-1">
            <div class="flex items-center gap-2 mb-3">
              <img src="@/assets/general/mp.png" alt="MP" class="w-6 h-6" />
              <h4 class="text-sm font-semibold text-red-300">Temporal Ultima Research</h4>
            </div>
            <div class="flex justify-between text-xs text-gray-400 mb-3">
              <span>Cost: ×1.06 <img src="@/assets/general/rp.png" alt="RP" class="w-3.5 h-3.5 inline" /> /lvl</span>
              <span>Buff: ×1.008 <img src="@/assets/general/mp.png" alt="MP" class="w-3.5 h-3.5 inline" /> /lvl</span>
            </div>
            
            <label class="text-xs text-gray-400 block mb-1">OOMs of RP</label>
            <ToolValueControls
              :value="temporalOomInput"
              :min-value="1"
              :max-value="999999"
              :step="1"
              :fast-step="10"
              :show-fast-controls="true"
              @update:value="temporalOomInput = $event"
            />

            <div v-if="temporalResult" class="mt-3 space-y-1.5">
              <div class="flex justify-between text-xs">
                <span class="text-gray-400">Duration <span class="text-gray-500">({{ tickSpeed }}s/tick)</span></span>
                <span class="text-cyan-400 font-mono">{{ temporalResult.timeDisplay }}</span>
              </div>
              
              <div class="flex justify-between text-xs">
                <span class="text-gray-400">Levels gained</span>
                <span class="text-white font-mono">{{ temporalResult.levels.toLocaleString('en-US') }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-400">Buff gained</span>
                <span class="text-red-400 font-mono">{{ temporalResult.buffDisplay }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- LP Calculator -->
        <div class="relative flex flex-col rounded-xl overflow-hidden border border-purple-800/30 bg-gradient-to-br from-purple-950/40 via-gray-800/60 to-gray-900/80 backdrop-blur-sm transition-[shadow,border-color] duration-300 hover:shadow-md hover:shadow-purple-900/20 hover:border-white/[0.08]">
          <!-- Top Accent -->
          <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          <div class="absolute inset-0 pointer-events-none opacity-[0.03] bg-gradient-to-br from-white via-transparent to-transparent"></div>

          <div class="relative p-4 flex flex-col flex-1">
            <div class="flex items-center gap-2 mb-3">
              <img src="@/assets/general/lp.png" alt="LP" class="w-6 h-6" />
              <h4 class="text-sm font-semibold text-purple-300">LP Calculator</h4>
            </div>
            <p class="text-xs text-gray-400 mb-3">
              Base: ×2 per 10 LP (Cells/MP/Shards) · ×2 per 80 LP (RP)
            </p>

            <!-- T2R6 Level -->
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <label class="text-xs text-gray-400 whitespace-nowrap">T2R6 Level</label>
              <ToolValueControls
                :value="t2r6Level"
                :min-value="0"
                :max-value="9999"
                :step="1"
                :fast-step="10"
                :show-fast-controls="true"
                @update:value="t2r6Level = $event"
              />
            </div>

            <!-- Research #102 -->
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <label class="text-xs text-gray-400 whitespace-nowrap">Res. #102</label>
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
                @update:value="lpAmount = $event"
              />
            </div>

            <!-- Results Table -->
            <div class="mt-2 grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1.5 text-xs items-center">
              <!-- Header -->
              <span class="text-[10px] text-gray-500 border-b border-gray-700/50 pb-1">Resource</span>
              <span class="text-[10px] text-gray-500 text-right border-b border-gray-700/50 pb-1">Per interval</span>
              <span class="text-[10px] text-gray-500 text-right border-b border-gray-700/50 pb-1">Total</span>

              <!-- Cells -->
              <span class="text-gray-400 flex items-center gap-1">
                <img src="@/assets/general/cells.png" alt="Cells" class="w-3.5 h-3.5" /> Cells
              </span>
              <span class="font-mono text-right text-green-400">×{{ lpResults.cells.multi.toFixed(2) }}</span>
              <span class="font-mono text-right text-purple-300">{{ lpResults.cells.totalDisplay }}</span>

              <!-- MP -->
              <span class="text-gray-400 flex items-center gap-1">
                <img src="@/assets/general/mp.png" alt="MP" class="w-3.5 h-3.5" /> MP
              </span>
              <span class="font-mono text-right text-red-400">×{{ lpResults.mp.multi.toFixed(2) }}</span>
              <span class="font-mono text-right text-purple-300">{{ lpResults.mp.totalDisplay }}</span>

              <!-- Shards -->
              <span class="text-gray-400 flex items-center gap-1">
                <img src="@/assets/general/shards.png" alt="Shards" class="w-3.5 h-3.5" /> Shards
              </span>
              <span class="font-mono text-right text-cyan-400">×{{ lpResults.shards.multi.toFixed(2) }}</span>
              <span class="font-mono text-right text-purple-300">{{ lpResults.shards.totalDisplay }}</span>

              <!-- RP -->
              <span class="text-gray-400 flex items-center gap-1">
                <img src="@/assets/general/rp.png" alt="RP" class="w-3.5 h-3.5" /> RP
              </span>
              <span class="font-mono text-right text-orange-400">×{{ lpResults.rp.multi.toFixed(2) }}</span>
              <span class="font-mono text-right text-purple-300">{{ lpResults.rp.totalDisplay }}</span>
            </div>
          </div>
        </div>

        <!-- Placeholder 4 -->
        <div class="bg-gray-800/30 border border-dashed border-gray-600 rounded-lg p-4 flex items-center justify-center min-h-[180px]">
          <p class="text-gray-500 text-xs text-center"></p>
        </div>

      </div>

      <!-- Placeholder for more sections -->
      <div class="bg-gray-800/50 border border-dashed border-gray-600 rounded-lg p-6 text-center">
        <p class="text-gray-400 text-sm"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// --- Tick Speed from AttGN3 Calculator ---
const tickSpeed = ref(1.5); // default fallback

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('attrGN3Calculator_settings') || '{}');
    if (saved.tickSpeed !== undefined && saved.tickSpeed > 0) {
      tickSpeed.value = saved.tickSpeed;
    }
  } catch (e) { /* ignore */ }
});

// --- Calculator inputs ---
const cellOomInput = ref(10);
const temporalOomInput = ref(10);

// --- LP Calculator ---
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

const lpResults = computed(() => {
  const t2r6Bonus = t2r6Level.value * 0.02;

  // Base exponents (1 = standard doubling)
  let cellsPower = 1;
  let mpPower = 1;
  let shardsPower = 1;
  let rpPower = 1;

  // Research #102 bonuses
  if (r102Level.value >= 1) cellsPower = 2;
  if (r102Level.value >= 3) mpPower = 1.25;
  if (r102Level.value >= 5) shardsPower = 1.25;

  // T2R6 additive bonus
  cellsPower += t2r6Bonus;
  mpPower += t2r6Bonus;
  shardsPower += t2r6Bonus;
  rpPower += t2r6Bonus;

  const lp = lpAmount.value;

  const cellsMulti = Math.pow(2, cellsPower);
  const mpMulti = Math.pow(2, mpPower);
  const shardsMulti = Math.pow(2, shardsPower);
  const rpMulti = Math.pow(2, rpPower);

  // Total multiplier = (per-interval multi) ^ (LP / interval)
  const cellsTotal = Math.pow(cellsMulti, lp / 10);
  const mpTotal = Math.pow(mpMulti, lp / 10);
  const shardsTotal = Math.pow(shardsMulti, lp / 10);
  const rpTotal = Math.pow(rpMulti, lp / 80);

  function formatTotal(val) {
    if (val < 100) return '×' + val.toFixed(2);
    if (val < 1e3) return '×' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    const exp = Math.floor(Math.log10(val));
    const mant = val / Math.pow(10, exp);
    return '×' + mant.toFixed(2) + 'e' + exp;
  }

  return {
    cells: { power: cellsPower, multi: cellsMulti, totalDisplay: formatTotal(cellsTotal) },
    mp: { power: mpPower, multi: mpMulti, totalDisplay: formatTotal(mpTotal) },
    shards: { power: shardsPower, multi: shardsMulti, totalDisplay: formatTotal(shardsTotal) },
    rp: { power: rpPower, multi: rpMulti, totalDisplay: formatTotal(rpTotal) },
  };
});

/**
 * Calculate how many levels you can buy and the resulting buff.
 * 
 * Given X OOMs of RP (relative to current level cost),
 * each level costs costMult times the previous one.
 * You buy levels until the cost exceeds your RP.
 * 
 * costMult^N ≤ 10^X  →  N = floor(X / log₁₀(costMult))
 */
function calculateUltima(oomInput, costMult, buffMult) {
  if (oomInput === null || oomInput === undefined || oomInput < 0) return null;
  const x = oomInput;
  if (x === 0) return { levels: 0, buffDisplay: '×1' };

  const log10CostMult = Math.log10(costMult);

  // Levels = how many times you can level up before cost exceeds your RP
  const levels = Math.floor(x / log10CostMult);

  if (levels <= 0) return { levels: 0, buffDisplay: '×1' };

  // Buff = buffMult^levels — express in OOMs
  const buffOomsRaw = levels * Math.log10(buffMult);

  // Display buff in proper scientific notation
  let buffDisplay;
  if (buffOomsRaw < 3) {
    const actualBuff = Math.pow(10, buffOomsRaw);
    buffDisplay = '×' + actualBuff.toFixed(2);
  } else {
    // Proper scientific notation: e.g. 10^6.6 → ×3.98e6
    const exponent = Math.floor(buffOomsRaw);
    const mantissa = Math.pow(10, buffOomsRaw - exponent);
    buffDisplay = '×' + mantissa.toFixed(2) + 'e' + exponent;
  }

  // Time = levels * tickSpeed (1 level per tick)
  const totalSeconds = levels * tickSpeed.value;
  let timeDisplay;
  if (totalSeconds < 60) {
    timeDisplay = `${Math.round(totalSeconds)}s`;
  } else if (totalSeconds < 3600) {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.round(totalSeconds % 60);
    timeDisplay = `${m}m ${s}s`;
  } else if (totalSeconds < 86400) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    timeDisplay = `${h}h ${m}m`;
  } else {
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    timeDisplay = `${d}d ${h}h`;
  }

  return {
    levels,
    buffDisplay,
    timeDisplay
  };
}

// --- Calculator results ---
const cellResult = computed(() => calculateUltima(cellOomInput.value, 1.03, 1.01));
const temporalResult = computed(() => calculateUltima(temporalOomInput.value, 1.06, 1.008));
</script>
