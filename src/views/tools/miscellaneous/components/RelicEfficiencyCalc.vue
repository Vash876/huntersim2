<template>
  <div class="relative p-4 flex flex-col flex-1">
    <!-- Title -->
    <div class="flex items-center gap-2 mb-3">
      <img src="@/assets/general/relics2.png" alt="Relics" class="w-6 h-7" />
      <h4 class="text-sm font-semibold text-cyan-300">Relic Efficiency Calculator</h4>
    </div>

    <!-- Inputs Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-1.5 mb-3">
      <!-- Column 1: Game Settings -->
      <div>
        <h5 class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 border-b border-gray-700/50 pb-1">Settings</h5>
        
        <!-- R1 Instant Cell Gain (e) -->
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
            <img src="@/assets/general/cells.png" alt="Cells" class="w-3.5 h-3.5" />
            R1 Cell Gain (e)
          </label>
          <ToolValueControls
            :value="r1CellGainE"
            :min-value="0"
            :max-value="999"
            :step="1"
            :fast-step="10"
            :show-fast-controls="true"
            @update:value="v => { r1CellGainE = v; persist(); }"
          />
        </div>

        <!-- LP Cells -->
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
            <img src="@/assets/general/lp.png" alt="LP" class="w-3.5 h-3.5" />
            LP Cells
          </label>
          <ToolValueControls
            :value="lpCells"
            :min-value="0"
            :max-value="9999"
            :step="1"
            :fast-step="10"
            :show-fast-controls="true"
            @update:value="v => { lpCells = v; persist(); }"
          />
        </div>

        <!-- LP MP -->
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
            <img src="@/assets/general/lp.png" alt="LP" class="w-3.5 h-3.5" />
            LP MP
          </label>
          <ToolValueControls
            :value="lpMP"
            :min-value="0"
            :max-value="9999"
            :step="1"
            :fast-step="10"
            :show-fast-controls="true"
            @update:value="v => { lpMP = v; persist(); }"
          />
        </div>

        <!-- LP Shards -->
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
            <img src="@/assets/general/lp.png" alt="LP" class="w-3.5 h-3.5" />
            LP Shards
          </label>
          <ToolValueControls
            :value="lpShards"
            :min-value="0"
            :max-value="9999"
            :step="1"
            :fast-step="10"
            :show-fast-controls="true"
            @update:value="v => { lpShards = v; persist(); }"
          />
        </div>

        <!-- LP RP (evolution gem node 2) -->
        <div v-if="access.canSeeLP_RP.value" class="flex items-center justify-between gap-2 mb-1.5">
          <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
            <img src="@/assets/general/lp.png" alt="LP" class="w-3.5 h-3.5" />
            LP RP
          </label>
          <ToolValueControls
            :value="lpRP"
            :min-value="0"
            :max-value="9999"
            :step="1"
            :fast-step="10"
            :show-fast-controls="true"
            @update:value="v => { lpRP = v; persist(); }"
          />
        </div>
      </div>

      <!-- Column 2: Tier 1 Relics -->
      <div>
        <h5 class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 border-b border-gray-700/50 pb-1">Tier 1 Relics</h5>
        
        <div v-for="relic in tier1Relics" :key="relic.id" class="flex items-center justify-between gap-2 mb-1.5">
          <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
            <img :src="relic.icon" :alt="relic.label" class="w-5 h-5" />
            {{ relic.label }}
          </label>
          <ToolValueControls
            :value="relicLevels[relic.id]"
            :min-value="0"
            :max-value="9999"
            :step="1"
            :fast-step="10"
            :show-fast-controls="true"
            @update:value="v => updateRelicLevel(relic.id, v)"
          />
        </div>
      </div>

      <!-- Column 3: Tier 2 Relics -->
      <div>
        <h5 class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 border-b border-gray-700/50 pb-1">Tier 2 Relics</h5>

        <div v-for="relic in tier2Relics" :key="relic.id" class="flex items-center justify-between gap-2 mb-1.5">
          <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
            <img :src="relic.icon" :alt="relic.label" class="w-5 h-5" />
            {{ relic.label }}
          </label>
          <ToolValueControls
            :value="relicLevels[relic.id]"
            :min-value="0"
            :max-value="9999"
            :step="1"
            :fast-step="10"
            :show-fast-controls="true"
            @update:value="v => updateRelicLevel(relic.id, v)"
          />
        </div>
      </div>

      <!-- Column 4: Weights -->
      <div>
        <h5 class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 border-b border-gray-700/50 pb-1">Weights</h5>

        <div v-for="w in weights" :key="w.id" class="flex items-center justify-between gap-2 mb-1.5">
          <label class="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
            <img :src="w.icon" :alt="w.label" class="w-3.5 h-3.5" />
            {{ w.label }}
          </label>
          <ToolValueControls
            :value="weightValues[w.id]"
            :min-value="0"
            :max-value="9999"
            :step="1"
            :fast-step="10"
            :show-fast-controls="true"
            @update:value="v => updateWeight(w.id, v)"
          />
        </div>
      </div>
    </div>

    <!-- Separator -->
    <div class="my-2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

    <!-- Results Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead>
          <tr class="border-b border-gray-700/50">
            <th class="text-[10px] text-gray-500 text-left pb-1.5 font-normal pl-1">Relic</th>
            <th class="text-[10px] text-gray-500 text-center pb-1.5 font-normal">
              <div class="flex items-center justify-center gap-1">
                <img src="@/assets/general/cells.png" alt="Cells" class="w-3 h-3" /> Cells
              </div>
            </th>
            <th class="text-[10px] text-gray-500 text-center pb-1.5 font-normal">
              <div class="flex items-center justify-center gap-1">
                <img src="@/assets/general/mp.png" alt="MP" class="w-3 h-3" /> MP
              </div>
            </th>
            <th class="text-[10px] text-gray-500 text-center pb-1.5 font-normal">
              <div class="flex items-center justify-center gap-1">
                <img src="@/assets/general/shards.png" alt="Shards" class="w-3 h-3" /> Shards
              </div>
            </th>
            <th class="text-[10px] text-gray-500 text-center pb-1.5 font-normal">
              <div class="flex items-center justify-center gap-1">
                <img src="@/assets/general/rp.png" alt="RP" class="w-3 h-3" /> RP
              </div>
            </th>
            <th class="text-[10px] text-gray-500 text-center pb-1.5 font-normal">
              <div class="flex items-center justify-center gap-1">
                <img src="@/assets/general/ap.png" alt="AP" class="w-3 h-3" /> AP
              </div>
            </th>
            <th class="text-[10px] text-gray-500 text-center pb-1.5 font-normal">
              <div class="flex items-center justify-center gap-1">
                <img src="@/assets/general/mats.png" alt="Mats" class="w-3 h-3" /> Mats
              </div>
            </th>
            <th class="text-[10px] text-gray-500 text-center pb-1.5 font-normal">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(row, i) in results" 
            :key="row.id"
            :class="[
              i % 2 === 0 ? 'bg-cyan-950/15' : '',
              row.isBest ? 'ring-1 ring-cyan-500/40 bg-cyan-900/20' : ''
            ]"
          >
            <td class="font-medium text-gray-300 px-1 py-1 whitespace-nowrap flex items-center gap-1">
              <img :src="row.icon" alt="Relic" class="w-4 h-4" />
              {{ row.label }}
            </td>
            <td class="font-mono text-center px-1 py-1 text-green-400">{{ row.cells }}</td>
            <td class="font-mono text-center px-1 py-1 text-red-400">{{ row.mp }}</td>
            <td class="font-mono text-center px-1 py-1 text-cyan-400">{{ row.shards }}</td>
            <td class="font-mono text-center px-1 py-1 text-orange-400">{{ row.rp }}</td>
            <td class="font-mono text-center px-1 py-1 text-purple-400">{{ row.ap }}</td>
            <td class="font-mono text-center px-1 py-1 text-yellow-400">{{ row.mats }}</td>
            <td class="font-mono text-center px-1 py-1 font-semibold" :class="row.isBest ? 'text-cyan-300' : 'text-gray-400'">
              {{ row.score }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { useMiscStore } from '../store.js';
import { useContentAccess } from '../useContentAccess.js';

// Icons for weights (imported as URLs via Vite)
import cellsIcon from '@/assets/general/cells.png';
import mpIcon from '@/assets/general/mp.png';
import shardsIcon from '@/assets/general/shards.png';
import rpIcon from '@/assets/general/rp.png';
import apIcon from '@/assets/general/ap.png';
import matsIcon from '@/assets/general/mats.png';

// Relic icons
import r1Icon from '@/assets/relics/r1.png';
import r2Icon from '@/assets/relics/r2.png';
import r8Icon from '@/assets/relics/r8.png';
import r20Icon from '@/assets/relics/r20.png';
import t2r1Icon from '@/assets/relics/t2r1.png';
import t2r2Icon from '@/assets/relics/t2r2.png';
import t2r6Icon from '@/assets/relics/t2r6.png';
import t2r9Icon from '@/assets/relics/t2r9.png';

const WIDGET_ID = 'relicEfficiency';
const miscStore = useMiscStore();
const access = useContentAccess();

// --- Relic definitions ---
const tier1Relics = [
  { id: 'r1',  label: 'Relic #1',  icon: r1Icon },
  { id: 'r2',  label: 'Relic #2',  icon: r2Icon },
  { id: 'r8',  label: 'Relic #8',  icon: r8Icon },
  { id: 'r20', label: 'Relic #20', icon: r20Icon },
];

const tier2Relics = [
  { id: 't2r1',  label: 'Relic #1',  icon: t2r1Icon },
  { id: 't2r2',  label: 'Relic #2',  icon: t2r2Icon },
  { id: 't2r6',  label: 'Relic #6',  icon: t2r6Icon },
  { id: 't2r9',  label: 'Relic #9',  icon: t2r9Icon },
];

const allRelics = [...tier1Relics, ...tier2Relics];

// --- Weight definitions ---
const weights = [
  { id: 'mp',     label: 'MP',     icon: mpIcon,     default: 20 },
  { id: 'shards', label: 'Shards', icon: shardsIcon,  default: 15 },
  { id: 'rp',     label: 'RP',     icon: rpIcon,      default: 10 },
  { id: 'ap',     label: 'AP',     icon: apIcon,      default: 15 },
  { id: 'cells',  label: 'Cells',  icon: cellsIcon,   default: 1 },
  { id: 'mats',   label: 'Mats',   icon: matsIcon,    default: 100 },
];

// --- Reactive inputs ---
const r1CellGainE = ref(0);
const lpCells = ref(0);
const lpMP = ref(0);
const lpShards = ref(0);
const lpRP = ref(0);

const relicLevels = reactive(
  Object.fromEntries(allRelics.map(r => [r.id, 0]))
);

const weightValues = reactive(
  Object.fromEntries(weights.map(w => [w.id, w.default]))
);

// --- Persistence ---
onMounted(() => {
  const saved = miscStore.getInputs(WIDGET_ID);
  if (saved.r1CellGainE !== undefined) r1CellGainE.value = saved.r1CellGainE;
  if (saved.lpCells !== undefined) lpCells.value = saved.lpCells;
  if (saved.lpMP !== undefined) lpMP.value = saved.lpMP;
  if (saved.lpShards !== undefined) lpShards.value = saved.lpShards;
  if (saved.lpRP !== undefined) lpRP.value = saved.lpRP;
  if (saved.relicLevels) {
    Object.entries(saved.relicLevels).forEach(([k, v]) => {
      if (relicLevels[k] !== undefined) relicLevels[k] = v;
    });
  }
  if (saved.weightValues) {
    Object.entries(saved.weightValues).forEach(([k, v]) => {
      if (weightValues[k] !== undefined) weightValues[k] = v;
    });
  }
});

function persist() {
  miscStore.saveInputs(WIDGET_ID, {
    r1CellGainE: r1CellGainE.value,
    lpCells: lpCells.value,
    lpMP: lpMP.value,
    lpShards: lpShards.value,
    lpRP: lpRP.value,
    relicLevels: { ...relicLevels },
    weightValues: { ...weightValues },
  });
}

function updateRelicLevel(id, val) {
  relicLevels[id] = val;
  persist();
}

function updateWeight(id, val) {
  weightValues[id] = val;
  persist();
}

// --- Results (placeholder — logic will be added next step) ---
const results = computed(() => {
  return allRelics.map(relic => ({
    id: relic.id,
    label: relic.label,
    icon: relic.icon,
    cells: '-',
    mp: '-',
    shards: '-',
    rp: '-',
    ap: '-',
    mats: '-',
    score: '-',
    isBest: false,
  }));
});
</script>
