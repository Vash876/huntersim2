<template>
  <div class="relative p-4 flex flex-col flex-1">
    <div class="flex items-center gap-2 mb-3">
      <svg width="0" height="0" class="absolute">
        <defs>
          <linearGradient id="exodusWidgetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5a95f5" />
            <stop offset="40%" stop-color="#6326f1" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <IconDiamond :size="30" style="color: url(#exodusWidgetGrad); stroke: url(#exodusWidgetGrad);" />
      <h4 class="text-sm font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Exodus GN#5 Mech Cap</h4>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-xs text-gray-500 italic">Loading build data...</div>

    <!-- No builds -->
    <div v-else-if="!firstOzzyBuild" class="text-xs text-gray-500 italic">No Ozzy build found</div>

    <!-- No cached result -->
    <div v-else-if="!evalResult" class="text-xs text-gray-500 italic">
      Run Ozzy build "<span class="text-green-400">{{ firstOzzyBuild.name }}</span>" first
    </div>

    <!-- Main content -->
    <div v-else class="flex flex-col gap-2">
        <!-- Build info -->
        <div class="text-[10px] text-gray-500 truncate">
          Build: <span class="text-green-400">{{ firstOzzyBuild.name }}</span>
        </div>

        <!-- Stats table -->
        <table class="w-full text-xs">
          <tbody>
            <tr class="bg-purple-950/15">
              <td class="text-gray-400 px-1 py-0.5">Avg Stage</td>
              <td class="text-right text-white font-mono px-1 py-0.5">{{ avgStage }}</td>
            </tr>
            <tr>
              <td class="text-gray-400 px-1 py-0.5">Runtime</td>
              <td class="text-right text-white font-mono px-1 py-0.5">{{ runtimeDisplay }}</td>
            </tr>
            <tr class="bg-purple-950/15">
              <td class="text-gray-400 px-1 py-0.5">Bosses / Run</td>
              <td class="text-right text-green-400 font-mono px-1 py-0.5">{{ bossesPerRun }}</td>
            </tr>
            <tr>
              <td class="text-gray-400 px-1 py-0.5">Current Multi</td>
              <td class="text-right font-mono px-1 py-0.5" :class="isCapped ? 'text-yellow-400' : 'text-white'">
                {{ isCapped ? '1e140 (capped)' : currentMultiDisplay }}
              </td>
            </tr>
            <tr v-if="killsPerDay > 0" class="bg-purple-950/15">
              <td class="text-gray-400 px-1 py-0.5">Multi / Day</td>
              <td class="text-right text-white font-mono px-1 py-0.5">{{ multiPerDayDisplay }}</td>
            </tr>
          </tbody>
        </table>

        <div class="border-t border-gray-700/50 my-1"></div>

        <!-- Result -->
        <div v-if="isCapped" class="text-center">
          <div class="text-xs text-yellow-400 font-semibold">Already Capped!</div>
        </div>
        <div v-else class="flex flex-col gap-1.5">
          <div class="flex justify-between items-center">
            <span class="text-[10px] text-gray-400">Kills needed</span>
            <span class="text-sm font-mono text-purple-300 font-semibold">{{ killsNeeded }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[10px] text-gray-400">Runs needed</span>
            <span class="text-sm font-mono text-purple-300 font-semibold">{{ runsNeeded }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[10px] text-gray-400">Time to cap</span>
            <span class="text-sm font-mono font-semibold text-white">{{ timeToCap }}</span>
          </div>
        </div>

        <!-- Override current multiplier -->
        <div class="border-t border-gray-700/50 my-1"></div>
        <div class="text-[10px] text-gray-500 mb-1">Current x1.2 kills</div>
        <div class="flex items-center justify-between">
          <ToolValueControls
            :value="displayKills"
            @update:value="setKillsManually($event)"
            :minValue="0"
            :maxValue="totalKillsForCap"
            :step="1"
            :fastStep="10"
            value-class="text-purple-300 font-medium"
            :autoEdit="true"
          />
          <button
            @click="toggleAutoUpdate"
            class="text-[10px] px-2 py-0.5 rounded-full border transition-colors whitespace-nowrap ml-2"
            :class="autoUpdate
              ? 'border-green-600 text-green-400 bg-green-900/20 hover:bg-green-900/40'
              : 'border-gray-600 text-gray-400 hover:bg-gray-700/50'"
          >
            Auto {{ autoUpdate ? 'ON' : 'OFF' }}
          </button>
        </div>
        <div v-if="killsPerDay > 0" class="text-[10px] text-gray-500 mt-0.5">
          ~{{ killsPerDay.toFixed(1) }} kills/day
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { IconDiamond } from '@tabler/icons-vue';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { shouldEvaluate } from '@/services/evaluationCacheService';
import { useMiscStore } from '../store.js';
import ToolValueControls from '@/composables/ToolValueControls.vue';


const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();
const miscStore = useMiscStore();

const loading = ref(true);
const evalResult = ref(null);
const liveUpdateTrigger = ref(0);
let liveUpdateInterval = null;

// Persistent state: kills base value, timestamp, autoUpdate flag
const savedInputs = miscStore.getInputs('exodusCapCalc');
const baseKills = ref(savedInputs.currentKills || 0);
const killsTimestamp = ref(savedInputs.killsTimestamp || Date.now());
const autoUpdate = ref(savedInputs.autoUpdate ?? true);

function saveState() {
  miscStore.saveInputs('exodusCapCalc', {
    currentKills: baseKills.value,
    killsTimestamp: killsTimestamp.value,
    autoUpdate: autoUpdate.value,
  });
}

watch([baseKills, autoUpdate], saveState);

// First non-archived Ozzy build
const firstOzzyBuild = computed(() => {
  const builds = hunterStore.getBuildsForHunter('ozzy');
  return builds.find(b => !b.isArchived) || null;
});

// Derived stats
const avgStage = computed(() => {
  if (!evalResult.value) return 0;
  return Math.round(evalResult.value.avgStage);
});

const avgTimeMinutes = computed(() => {
  if (!evalResult.value) return 0;
  return evalResult.value.avgTime; // avgTime is in minutes
});

const runtimeDisplay = computed(() => {
  const totalMin = avgTimeMinutes.value;
  if (totalMin <= 0) return '—';
  const mins = Math.floor(totalMin);
  const secs = Math.round((totalMin - mins) * 60);
  return `${mins}m`;
});

const bossesPerRun = computed(() => {
  return Math.floor(avgStage.value / 100);
});

// Kills per day: bossesPerRun * runsPerDay
const killsPerDay = computed(() => {
  if (bossesPerRun.value <= 0 || avgTimeMinutes.value <= 0) return 0;
  const runsPerDay = 1440 / avgTimeMinutes.value;
  return bossesPerRun.value * runsPerDay;
});

// Multiplier produced per day: 1.2^killsPerDay
const multiPerDayDisplay = computed(() => {
  if (killsPerDay.value <= 0) return '×1';
  const multi = Math.pow(MULTI_PER_KILL, killsPerDay.value);
  if (multi >= 1e6) {
    const exp = Math.floor(Math.log10(multi));
    const mantissa = multi / Math.pow(10, exp);
    return `×${mantissa.toFixed(2)}e${exp}`;
  }
  return `×${multi.toFixed(2)}`;
});

// Display kills: baseKills + elapsed production (if autoUpdate is on)
const displayKills = computed(() => {
  // eslint-disable-next-line no-unused-vars
  const _tick = liveUpdateTrigger.value; // reactivity trigger
  if (!autoUpdate.value || killsPerDay.value <= 0) {
    return Math.min(baseKills.value, totalKillsForCap.value);
  }
  const now = Date.now();
  const elapsedMs = now - killsTimestamp.value;
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
  const produced = Math.floor(elapsedDays * killsPerDay.value);
  return Math.min(baseKills.value + produced, totalKillsForCap.value);
});

// Manual set: resets timestamp
function setKillsManually(val) {
  baseKills.value = Math.max(0, Math.min(val, totalKillsForCap.value));
  killsTimestamp.value = Date.now();
  saveState();
}

function toggleAutoUpdate() {
  autoUpdate.value = !autoUpdate.value;
  if (autoUpdate.value) {
    // Start tracking from current displayKills
    baseKills.value = displayKills.value;
    killsTimestamp.value = Date.now();
  } else {
    // Freeze at current display value
    baseKills.value = displayKills.value;
    killsTimestamp.value = Date.now();
  }
  saveState();
}

const TARGET_EXPONENT = 140;
const MULTI_PER_KILL = 1.2;

const totalKillsForCap = computed(() => {
  return Math.ceil(TARGET_EXPONENT * Math.log(10) / Math.log(MULTI_PER_KILL));
});

const currentMulti = computed(() => {
  return Math.pow(MULTI_PER_KILL, displayKills.value);
});

const currentMultiDisplay = computed(() => {
  const val = currentMulti.value;
  if (val >= 1e6) {
    const exp = Math.floor(Math.log10(val));
    const mantissa = val / Math.pow(10, exp);
    return `${mantissa.toFixed(2)}e${exp}`;
  }
  return 'x' + val.toFixed(2);
});

const isCapped = computed(() => {
  return displayKills.value >= totalKillsForCap.value;
});

const killsNeeded = computed(() => {
  return Math.max(0, totalKillsForCap.value - displayKills.value);
});

const runsNeeded = computed(() => {
  if (bossesPerRun.value <= 0) return Infinity;
  return Math.ceil(killsNeeded.value / bossesPerRun.value);
});

const timeToCap = computed(() => {
  if (bossesPerRun.value <= 0) return '—';
  if (runsNeeded.value === 0) return 'Done!';
  
  const totalMinutes = runsNeeded.value * avgTimeMinutes.value;
  if (totalMinutes <= 0) return '—';
  
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const mins = Math.round(totalMinutes % 60);
  
  if (days > 365) {
    const years = (days / 365).toFixed(1);
    return `~${years}y`;
  }
  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${mins}m`;
});

// Load cached eval results
async function loadCachedResult() {
  loading.value = true;
  try {
    const build = firstOzzyBuild.value;
    if (!build) return;

    const cache = await shouldEvaluate({
      hunterId: 'ozzy',
      buildData: build,
      hunterStore,
      gemPlannerStore
    });

    if (cache?.cachedResult) {
      evalResult.value = cache.cachedResult;
    }
  } catch (error) {
    console.error('[ExodusCapCalc] Error loading cached result:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadCachedResult();
  // Update display every 30 seconds when auto is on
  liveUpdateInterval = setInterval(() => {
    if (autoUpdate.value) {
      liveUpdateTrigger.value++;
    }
  }, 30000);
});

onUnmounted(() => {
  if (liveUpdateInterval) {
    clearInterval(liveUpdateInterval);
  }
});

watch(firstOzzyBuild, () => {
  loadCachedResult();
}, { deep: true });
</script>
