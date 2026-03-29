<!-- filepath: \src\components\tr-planner\TRPlanDetailModal.vue -->
<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-blue-400">TR Plan</span>
            <span class=""> - {{ plan?.name || 'Plan Details' }}</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="$emit('close')"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              title="Close"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="!plan" class="p-8 text-center">
        <IconCircleX size="48" class="text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Plan Not Found</h3>
        <p class="text-gray-400 mb-6">This plan may have been deleted or does not exist.</p>
        <button 
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
        >
          Close
        </button>
      </div>
      
      <div v-else>
        <!-- Plan Overview mit festgelegten prozentuellen Breiten -->
        <div class="p-4 bg-gray-750/60 border-b border-gray-700">
          <h3 class="text-sm font-bold mb-3 text-blue-300">Plan Overview</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-3">
            <div class="flex flex-wrap w-full">
              <!-- TR Information - 20% Breite -->
              <div class="w-full sm:w-1/5 p-2">
                <div class="flex items-center">
                  <div class="bg-blue-900/30 p-2 rounded-lg mr-3">
                    <IconRepeat size="20" class="text-blue-400" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">TR Progress</div>
                    <div class="text-sm text-white font-medium">
                      {{ plan.updatedStats?.trCount || currentTrCount }} → {{ (plan.updatedStats?.trCount || currentTrCount) + totalTRsInPlan }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Total Orbs - 25% Breite -->
              <div class="w-full sm:w-1/4 p-2">
                <div class="flex items-center">
                  <div class="bg-green-900/30 p-2 rounded-lg mr-3">
                    <img src="@/assets/general/orbs.png" class="w-5 h-5" alt="Orbs" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">All-Time Orbs</div>
                    <div class="text-sm text-white font-medium">
                      {{ formatNumber(baseAllTimeOrbs) }} → {{ formatNumber(finalAllTimeOrbs) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Timeline - 20% Breite -->
              <div class="w-full sm:w-1/5 p-2">
                <div class="flex items-center">
                  <div class="bg-purple-900/30 p-2 rounded-lg mr-3">
                    <IconCalendarEvent size="20" class="text-purple-400" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Timeline</div>
                    <div class="text-sm text-white font-medium">
                      {{ formatDate(planStartDate, false) }} - {{ formatDate(planEndDate, false) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Duration - 15% Breite -->
              <div class="w-full sm:w-[15%] p-2">
                <div class="flex items-center">
                  <div class="bg-indigo-900/30 p-2 rounded-lg mr-3">
                    <IconClock size="20" class="text-indigo-400" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Duration</div>
                    <div class="text-sm text-white font-medium">{{ formatDuration }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Progress - 20% Breite -->
              <div class="w-full sm:w-1/5 p-2">
                <div class="flex-grow">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs text-gray-400">Progress</span>
                    <span class="text-xs" :class="progressColor">{{ progressStatus }}</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full" :class="progressBarColor" :style="{ width: `${progressPercentage}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- TR Chain Overview -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-sm font-bold mb-3 text-blue-300">TR Details</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="text-xs text-gray-300 bg-gray-800/80">
                <tr>
                  <th scope="col" class="px-4 py-2 text-left font-medium">#</th>
                  <th scope="col" class="px-4 py-2 text-left font-medium">TR</th>
                  <th scope="col" class="px-4 py-2 text-left font-medium">Start Date</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium hidden sm:table-cell">Hours</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">Orbs</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">Frags</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">All-Time Orbs</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <!-- Erster TR -->
                <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                  <td class="px-4 py-2.5 font-medium relative">
                    1
                  </td>
                  <td class="px-4 py-2.5">
                    {{ plan.updatedStats?.trCount || currentTrCount }} → {{ (plan.updatedStats?.trCount || currentTrCount) + 1 }}
                  </td>
                  <td class="px-4 py-2.5">
                    {{ formatDate(planStartDate, true) }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono hidden sm:table-cell">
                    {{ firstTrHours }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono text-green-400">
                    {{ formatNumber(firstTrOrbGains) }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono text-orange-400">
                    {{ formatNumber(firstTrFragGains) }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono text-blue-400">
                    {{ formatNumber(baseAllTimeOrbs + firstTrOrbGains) }}
                  </td>
                </tr>
                
                <!-- TR Chain -->
                <template v-if="plan.trChain && plan.trChain.length > 0">
                  <tr 
                    v-for="(chainStep, index) in plan.trChain" 
                    :key="index"
                    class="bg-gray-750/20 hover:bg-gray-700/40 transition"
                  >
                  <td class="px-4 py-2.5 font-medium relative">
                    {{ index + 2 }}
                    <span class="absolute right-0 top-1/2 -translate-y-1/2 mr-1">
                      <InfoTooltip :content="getBoostListHtml(index + 1)" placement="right" />
                    </span>
                  </td>
                    <td class="px-4 py-2.5">
                      {{ (plan.updatedStats?.trCount || currentTrCount) + index + 1 }} → {{ (plan.updatedStats?.trCount || currentTrCount) + index + 2 }}
                    </td>
                    <td class="px-4 py-2.5">
                      {{ formatDate(getChainStartDate(index), true) }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono hidden sm:table-cell">
                      {{ getChainTrHours(chainStep) }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-green-400">
                      {{ formatNumber(chainStep.results?.orbGains || 0) }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-orange-400">
                      {{ formatNumber(chainStep.results?.campaignFragGains || 0) }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-blue-400">
                      {{ formatNumber(getCumulativeAllTimeOrbs(index)) }}
                    </td>
                  </tr>
                </template>
              </tbody>
              <!-- Footer Row -->
              <tfoot class="bg-gray-800/60 text-xs text-white font-medium">
                <tr>
                  <td colspan="2" class="px-4 py-2">TOTAL</td>
                  <td class="px-4 py-2">{{ formatDate(planEndDate, true) }}</td>
                  <td class="px-4 py-2 text-right font-mono hidden sm:table-cell">{{ formatNumber(totalHoursInTR) }}</td>
                  <td class="px-4 py-2 text-right font-mono text-green-400">{{ formatNumber(totalOrbGains) }}</td>
                  <td class="px-4 py-2 text-right font-mono text-orange-400">{{ formatNumber(totalFragGains) }}</td>
                  <td class="px-4 py-2 text-right font-mono text-blue-400">{{ formatNumber(finalAllTimeOrbs) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <!-- Boost Progression Section -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-sm font-bold mb-3 text-blue-300">Boosts Progression</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-2">
            <!-- Stats Progression -->
            <div v-if="!allImprovedBoosts.length" class="text-gray-400 text-center py-2 text-sm">
              No Boosts improved in this plan.
            </div>
            
            <div v-else class="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div 
                v-for="boost in allImprovedBoosts" 
                :key="boost.key"
                class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex justify-between items-center"
              >
                <div class="text-xs font-medium text-white truncate mr-1">{{ boost.label }}</div>
                <div class="text-xs text-blue-400 whitespace-nowrap">
                  {{ boost.startValue }} → {{ boost.endValue }}
                </div>
              </div>
            </div>
            
            <!-- Upgrade Costs -->
            <div v-if="hasUpgradeCosts" class="mt-3 pt-3 border-t border-gray-700">
              <h4 class="text-xs font-medium text-gray-300 mb-2">Upgrade Costs</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <!-- Fragments (für Relics) -->
                <div v-if="upgradeCosts.fragments > 0" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/general/fragments.png" class="w-5 h-5 mr-2" alt="Fragments" />
                  <div class="text-xs font-medium text-white mr-1">Fragments:</div>
                  <div class="text-xs text-purple-400 ml-auto">{{ formatRelicCost(upgradeCosts.fragments) }}</div>
                </div>
                
                <!-- Hellish-Biomatter (für Inscryptions) -->
                <div v-if="upgradeCosts.hellishBiomatter > 0" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/borge/loot_mat3.png" class="w-5 h-5 mr-2" alt="Hellish Biomatter" />
                  <div class="text-xs font-medium text-white mr-1">Hellish-Biomatter:</div>
                  <div class="text-xs text-red-400 ml-auto">{{ formatInscryptionCost(upgradeCosts.hellishBiomatter) }}</div>
                </div>
                
                <!-- Tessarects (für Gadgets) -->
                <div v-if="upgradeCosts.tessarects > 0" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/knox/loot_mat3.png" class="w-5 h-5 mr-2" alt="Tesseracts" />
                  <div class="text-xs font-medium text-white mr-1">Tesseracts:</div>
                  <div class="text-xs text-blue-400 ml-auto">{{ formatGadgetCost(upgradeCosts.tessarects) }}</div>
                </div>

                <!-- MP (für Loop Mods) -->
                <div v-if="hasLoopModInPlan" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/general/mp.png" class="w-5 h-5 mr-2" alt="MP" />
                  <div class="text-xs font-medium text-white mr-1">MP:</div>
                  <div class="text-xs text-red-400 ml-auto">{{ getLoopModCostDisplay() }}</div>
                </div>

                <!-- Shards (für m0) -->
                <div v-if="upgradeCosts.shards > 0" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/general/shards.png" class="w-5 h-5 mr-2" alt="Shards" />
                  <div class="text-xs font-medium text-white mr-1">Shards:</div>
                  <div class="text-xs text-blue-400 ml-auto">{{ upgradeCosts.shardsFormatted }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TR-Requirements Projektion mit Chart.js -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-sm font-bold mb-3 text-blue-300">Future Minimum TR Requirements Projection</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs text-gray-400">
                Projecting next {{ futureTRsToProject }} TRs after TR{{ (plan?.updatedStats?.trCount || currentTrCount) + totalTRsInPlan }}
              </div>
              <div class="flex gap-2 items-center">
                <button 
                  @click="futureTRsToProject = Math.max(5, futureTRsToProject - 5)"
                  class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                >-5</button>
                <button 
                  @click="futureTRsToProject += 5"
                  class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                >+5</button>
              </div>
            </div>
            
            <!-- Chart.js Graph Container -->
            <div class="h-60 w-full">
              <div v-if="!chartOption" class="flex items-center justify-center h-full text-gray-400">
                <div class="text-center">
                  <div class="animate-spin w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full mx-auto mb-2"></div>
                  <div class="text-sm">Loading chart...</div>
                </div>
              </div>
              <v-chart
                v-if="chartOption"
                :option="chartOption"
                autoresize
                class="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        <!-- Footer buttons -->
        <div class="bg-gray-750/60 p-3 border-t border-gray-700">
          <div class="flex justify-between items-center">
            <div class="text-xs text-gray-400">
              Created: {{ formatDate(new Date(plan.createdAt), false) }}
            </div>
            <div class="flex gap-2">
              <button
                @click="handleDelete(plan.id)"
                class="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-md text-xs flex items-center gap-1.5"
              >
                <IconTrash size="14" />
                Delete
              </button>
              <button
                @click="handleEdit(plan.id)"
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs flex items-center gap-1.5"
              >
                <IconEdit size="14" />
                Edit
              </button>
              <button 
                @click="$emit('close')"
                class="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { getRelicCost, formatRelicCost } from '@/utils/relicCostUtils';
import { getInscryptionCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { calculateM0CostRangeSafe } from '@/utils/m0CostUtils';
import { getRuleOfConsistencyExponent } from '@/utils/loopModCostUtils';
import VChart from 'vue-echarts';
import '@/utils/echarts';
import { darkTooltip, darkXAxis, darkYAxis, darkGrid } from '@/utils/echarts';
import { useTRPlannerStore } from '@/store/orbStore';
import { allBoosts } from '@/constants/tr-planner';
import { formatNumber } from '@/composables/format';
import { calculateOrbRequirement } from '@/composables/calculations';
import { IconX, IconCircleX, IconTrash, IconEdit, IconCalendarEvent, IconRepeat, IconClock } from '@tabler/icons-vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  planId: { type: String, default: null },
  currentStats: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close', 'delete', 'edit']);

// ── Helpers for dual format (object vs array) ──────────────────────
function normalizeBoosts(boosts) {
  if (!boosts) return [];
  if (typeof boosts === 'object' && !Array.isArray(boosts)) {
    return Object.entries(boosts).map(([key, data]) => ({ key, ...data }));
  }
  if (Array.isArray(boosts)) return boosts;
  return [];
}

function getBoostTargetLevel(boosts, key) {
  if (!boosts) return undefined;
  if (typeof boosts === 'object' && !Array.isArray(boosts)) {
    return boosts[key]?.targetLevel;
  }
  if (Array.isArray(boosts)) {
    return boosts.find(b => b.key === key)?.targetLevel;
  }
  return undefined;
}

// ── Core ────────────────────────────────────────────────────────────
const trPlannerStore = useTRPlannerStore();
const plan = computed(() => props.planId ? trPlannerStore.getTRPlanById(props.planId) : null);
const currentTrCount = computed(() => props.currentStats?.trCount || 0);

const boostsByKey = computed(() => {
  const map = {};
  allBoosts.forEach(b => { map[b.key] = b; });
  return map;
});

// ── Plan metrics ────────────────────────────────────────────────────
const totalTRsInPlan = computed(() => {
  if (!plan.value) return 0;
  return 1 + (plan.value.trChain?.length || 0);
});

const firstTrHours = computed(() => getBoostTargetLevel(plan.value?.boosts, 'hoursInTR') || 0);

function getChainTrHours(chainStep) {
  return getBoostTargetLevel(chainStep?.boosts, 'hoursInTR') || 0;
}

const totalHoursInTR = computed(() => {
  if (!plan.value) return 0;
  let total = firstTrHours.value;
  if (plan.value.trChain) {
    for (const step of plan.value.trChain) total += getChainTrHours(step);
  }
  return total;
});

// ── Orbs & Fragments ────────────────────────────────────────────────
const firstTrOrbGains = computed(() => plan.value?.results?.orbGains || 0);
const firstTrFragGains = computed(() => plan.value?.results?.campaignFragGains || 0);

const totalOrbGains = computed(() => {
  if (!plan.value) return 0;
  let total = firstTrOrbGains.value;
  if (plan.value.trChain) {
    for (const step of plan.value.trChain) total += step.results?.orbGains || 0;
  }
  return total;
});

const totalFragGains = computed(() => {
  if (!plan.value) return 0;
  let total = firstTrFragGains.value;
  if (plan.value.trChain) {
    for (const step of plan.value.trChain) total += step.results?.campaignFragGains || 0;
  }
  return total;
});

const baseAllTimeOrbs = computed(() => {
  return plan.value?.updatedStats?.allTimeOrbs || props.currentStats?.allTimeOrbs || 0;
});

const finalAllTimeOrbs = computed(() => baseAllTimeOrbs.value + totalOrbGains.value);

function getCumulativeAllTimeOrbs(chainIndex) {
  let cumulative = baseAllTimeOrbs.value + firstTrOrbGains.value;
  for (let i = 0; i <= chainIndex; i++) {
    cumulative += plan.value?.trChain?.[i]?.results?.orbGains || 0;
  }
  return cumulative;
}

// ── Timeline ────────────────────────────────────────────────────────
const planStartDate = computed(() => {
  if (!plan.value?.trStartDate || !plan.value?.trStartTime) return new Date();
  const [year, month, day] = plan.value.trStartDate.split('-').map(Number);
  const [hours, minutes] = plan.value.trStartTime.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
});

const planEndDate = computed(() => {
  return new Date(planStartDate.value.getTime() + totalHoursInTR.value * 3600000);
});

function getChainStartDate(index) {
  let ms = planStartDate.value.getTime() + firstTrHours.value * 3600000;
  for (let i = 0; i < index; i++) {
    ms += getChainTrHours(plan.value?.trChain?.[i]) * 3600000;
  }
  return new Date(ms);
}

const formatDuration = computed(() => {
  const hours = totalHoursInTR.value;
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return rem === 0 ? `${days}d` : `${days}d ${rem}h`;
});

// ── Date formatting ─────────────────────────────────────────────────
function formatDate(date, includeTime) {
  if (!date) return '';
  try {
    const opts = includeTime
      ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, opts);
  } catch { return ''; }
}

// ── Progress ────────────────────────────────────────────────────────
const progressPercentage = computed(() => {
  const now = Date.now();
  const start = planStartDate.value.getTime();
  const end = planEndDate.value.getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.floor(((now - start) / (end - start)) * 100);
});

const progressStatus = computed(() => {
  const now = Date.now();
  const start = planStartDate.value.getTime();
  const end = planEndDate.value.getTime();

  if (now < start) {
    const h = Math.floor((start - now) / 3600000);
    return h < 24 ? `Starts in ${h}h` : `Starts in ${Math.floor(h / 24)}d`;
  }
  if (now > end) {
    const h = Math.floor((now - end) / 3600000);
    return h < 24 ? `Completed ${h}h ago` : `Completed ${Math.floor(h / 24)}d ago`;
  }
  const h = Math.floor((end - now) / 3600000);
  if (h < 24) return `${h}h remaining`;
  const d = Math.floor(h / 24);
  const rem = h % 24;
  return rem === 0 ? `${d}d remaining` : `${d}d ${rem}h remaining`;
});

const progressColor = computed(() => {
  const now = Date.now();
  if (now < planStartDate.value.getTime()) return 'text-blue-400';
  if (now > planEndDate.value.getTime()) return 'text-green-400';
  return 'text-yellow-400';
});

const progressBarColor = computed(() => {
  const now = Date.now();
  if (now < planStartDate.value.getTime()) return 'bg-blue-500';
  if (now > planEndDate.value.getTime()) return 'bg-green-500';
  if (progressPercentage.value < 30) return 'bg-blue-500';
  if (progressPercentage.value < 70) return 'bg-yellow-500';
  return 'bg-green-500';
});

// ── Boost Progression ───────────────────────────────────────────────
// Collects ALL boosts improved across the entire plan (first TR + chain)
const allImprovedBoosts = computed(() => {
  if (!plan.value) return [];

  const result = new Map();

  // 1) First TR: compare currentLevel → targetLevel
  for (const boost of normalizeBoosts(plan.value.boosts)) {
    if (boost.type !== 'number') continue;
    const info = boostsByKey.value[boost.key];
    if (!info) continue;

    const start = boost.currentLevel ?? 0;
    const end = boost.targetLevel ?? 0;

    if (end > start) {
      result.set(boost.key, {
        key: boost.key,
        label: boost.label || boost.key,
        startValue: start,
        endValue: end,
        category: info.category
      });
    }
  }

  // 2) Chain steps: track further improvements
  if (plan.value.trChain) {
    for (const chainStep of plan.value.trChain) {
      for (const boost of normalizeBoosts(chainStep.boosts)) {
        if (boost.type !== 'number') continue;
        const info = boostsByKey.value[boost.key];
        if (!info) continue;

        const chainTarget = boost.targetLevel ?? 0;

        if (result.has(boost.key)) {
          const existing = result.get(boost.key);
          if (chainTarget > existing.endValue) {
            existing.endValue = chainTarget;
          }
        } else {
          const chainStart = boost.currentLevel ?? 0;
          if (chainTarget > chainStart) {
            result.set(boost.key, {
              key: boost.key,
              label: boost.label || boost.key,
              startValue: chainStart,
              endValue: chainTarget,
              category: info.category
            });
          }
        }
      }
    }
  }

  return [...result.values()].sort((a, b) => {
    const aGrowth = (a.endValue - a.startValue) / Math.max(1, a.startValue);
    const bGrowth = (b.endValue - b.startValue) / Math.max(1, b.startValue);
    return bGrowth - aGrowth;
  });
});

// ── Loop Mod detection ──────────────────────────────────────────────
const hasLoopModInPlan = computed(() => {
  if (!plan.value) return false;
  if (getBoostTargetLevel(plan.value.boosts, 'lmConsistency') !== undefined) return true;
  if (plan.value.trChain) {
    for (const step of plan.value.trChain) {
      if (getBoostTargetLevel(step.boosts, 'lmConsistency') !== undefined) return true;
    }
  }
  return false;
});

function getLoopModCostDisplay() {
  let highest = 0;
  const firstLm = getBoostTargetLevel(plan.value?.boosts, 'lmConsistency');
  if (firstLm) highest = Math.max(highest, firstLm);
  if (plan.value?.trChain) {
    for (const step of plan.value.trChain) {
      const lm = getBoostTargetLevel(step.boosts, 'lmConsistency');
      if (lm) highest = Math.max(highest, lm);
    }
  }
  return getRuleOfConsistencyExponent(highest).toString();
}

// ── Upgrade Costs ───────────────────────────────────────────────────
const upgradeCosts = computed(() => {
  if (!allImprovedBoosts.value.length) return null;

  const costs = { fragments: 0, hellishBiomatter: 0, tessarects: 0, mp: 0, shards: 0 };

  for (const boost of allImprovedBoosts.value) {
    if (boost.endValue <= boost.startValue) continue;

    if (boost.key === 'ms0') {
      costs.shards = 1;
      costs.shardsFormatted = calculateM0CostRangeSafe(boost.startValue, boost.endValue);
    } else if (boost.key === 'lmConsistency') {
      costs.mp = 1;
      costs.mpFormatted = getRuleOfConsistencyExponent(boost.endValue).toString();
    } else if (boost.category === 'relic') {
      for (let lvl = boost.startValue + 1; lvl <= boost.endValue; lvl++) {
        costs.fragments += getRelicCost(boost.key, lvl);
      }
    } else if (boost.category === 'inscryption') {
      const inscrId = `i${boost.key.replace('i', '')}`;
      for (let lvl = boost.startValue + 1; lvl <= boost.endValue; lvl++) {
        costs.hellishBiomatter += getInscryptionCost(inscrId, lvl);
      }
    } else if (boost.category === 'gadget') {
      let gadgetId = boost.key;
      if (boost.key === 'oogadget') gadgetId = 'g4';
      if (boost.key === 'campfragdet') gadgetId = 'g14';
      for (let lvl = boost.startValue + 1; lvl <= boost.endValue; lvl++) {
        costs.tessarects += getGadgetCost(gadgetId, lvl);
      }
    }
  }

  if (!costs.fragments && !costs.hellishBiomatter && !costs.tessarects && !costs.mp && !costs.shards) {
    return null;
  }
  return costs;
});

const hasUpgradeCosts = computed(() => upgradeCosts.value !== null);

// ── Actions ─────────────────────────────────────────────────────────
function handleEdit(planId) {
  emit('close');
  emit('edit', planId);
}

function handleDelete(planId) {
  emit('delete', planId);
  emit('close');
}


// ── Boost Tooltip HTML ──────────────────────────────────────────────
function getBoostListHtml(trIndex) {
  const rawBoosts = trIndex === 0
    ? plan.value?.boosts
    : plan.value?.trChain?.[trIndex - 1]?.boosts;

  const boosts = normalizeBoosts(rawBoosts);

  // Find the most recent value of a boost before this TR
  function findPreviousValue(key, beforeTrIndex) {
    for (let i = beforeTrIndex - 1; i >= 1; i--) {
      const val = getBoostTargetLevel(plan.value?.trChain?.[i - 1]?.boosts, key);
      if (val !== undefined) return val;
    }
    if (beforeTrIndex >= 1) {
      const val = getBoostTargetLevel(plan.value?.boosts, key);
      if (val !== undefined) return val;
    }
    return plan.value?.updatedStats?.[key] ?? props.currentStats?.[key] ?? 0;
  }

  const improved = [];
  for (const boost of boosts) {
    if (boost.type !== 'number') continue;
    if (!boostsByKey.value[boost.key]) continue;

    const prevValue = findPreviousValue(boost.key, trIndex);
    if (boost.targetLevel > prevValue) {
      improved.push({ ...boost, actualStart: prevValue });
    }
  }

  if (!improved.length) {
    return '<div class="p-2 text-gray-400 text-xs">No boosts improved</div>';
  }

  improved.sort((a, b) => {
    const aRatio = (a.targetLevel - a.actualStart) / Math.max(1, a.actualStart);
    const bRatio = (b.targetLevel - b.actualStart) / Math.max(1, b.actualStart);
    return bRatio - aRatio;
  });

  let html = '<div class="p-2"><div class="text-sm font-medium text-white mb-2">Improved Boosts</div><div class="grid grid-cols-1 gap-1">';
  for (const b of improved) {
    const diff = b.targetLevel - b.actualStart;
    html += `<div class="flex items-center justify-between text-xs py-1 border-b border-gray-700"><span class="font-medium text-gray-200 pr-3">${b.label}</span><div class="flex items-center"><span class="text-gray-400">${b.actualStart}</span><span class="mx-1 text-gray-500">→</span><span class="text-blue-300 font-medium">${b.targetLevel}</span><span class="ml-1 text-green-400">(+${diff})</span></div></div>`;
  }
  html += '</div></div>';
  return html;
}

// ── Future TR Projections ───────────────────────────────────────────
const futureTRsToProject = ref(10);

const futureTRProjections = computed(() => {
  if (!plan.value) return [];

  const startTR = (plan.value.updatedStats?.trCount || currentTrCount.value) + totalTRsInPlan.value;
  let accOrbs = finalAllTimeOrbs.value;
  const projections = [];

  for (let i = 0; i < futureTRsToProject.value; i++) {
    const trCount = startTR + i;
    const requirement = calculateOrbRequirement(trCount, accOrbs);
    projections.push({ trCount, requirement, orbsAvailable: accOrbs, sufficient: accOrbs >= requirement });
    accOrbs += requirement;
  }
  return projections;
});

// ── Chart ───────────────────────────────────────────────────────────
const chartOption = computed(() => {
  if (!futureTRProjections.value.length) return null;

  const labels = futureTRProjections.value.map(p => `TR${p.trCount}`);
  const reqData = futureTRProjections.value.map(p => p.requirement);
  const orbData = futureTRProjections.value.map(p => p.orbsAvailable);

  return {
    backgroundColor: 'transparent',
    animation: false,
    grid: { ...darkGrid, bottom: 50 },
    legend: { show: true, top: 0, textStyle: { color: '#9ca3af', fontSize: 11 } },
    tooltip: {
      ...darkTooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        return `<strong>${params[0].name}</strong><br/>` +
          params.map(p => `${p.marker} ${p.seriesName}: ${formatNumber(p.value)}`).join('<br/>');
      }
    },
    xAxis: {
      type: 'category',
      data: labels,
      ...darkXAxis,
      axisLabel: { ...darkXAxis.axisLabel, rotate: labels.length > 10 ? 45 : 0 }
    },
    yAxis: {
      type: 'log',
      ...darkYAxis,
      axisLabel: { ...darkYAxis.axisLabel, formatter: (v) => formatNumber(v) }
    },
    series: [
      {
        name: 'TR Requirement',
        type: 'bar',
        data: reqData,
        itemStyle: {
          color: 'rgba(239, 68, 68, 0.25)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: [4, 4, 0, 0]
        },
        barMaxWidth: 40
      },
      {
        name: 'All-Time Orbs',
        type: 'line',
        data: orbData,
        lineStyle: { color: 'rgba(74, 222, 128, 1)', width: 2 },
        itemStyle: { color: 'rgba(74, 222, 128, 1)' },
        symbolSize: 6,
        smooth: 0.1
      }
    ]
  };
});
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

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
</style>