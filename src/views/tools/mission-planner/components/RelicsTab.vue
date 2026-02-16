<template>
  <div class="bg-gray-800/50 rounded-b-lg border border-gray-700/50 border-t-0 overflow-hidden p-3">
    <!-- Combined Summary Panel with Glassmorphism -->
    <div class="mb-3 bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
      <!-- Top Row: Current Status (Fragments & Hours Input) -->
      <div class="px-3 py-2.5 bg-gray-800/50 border-b border-gray-700/30">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-4 text-xs">
            <!-- Current Fragments Input -->
            <div class="flex items-center gap-1.5 bg-gray-700/40 px-2 py-1 rounded-md">
              <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
              <span class="text-gray-400">Current:</span>
              <SuffixInput
                :model-value="currentFragments"
                @update:model-value="handleFragmentsUpdate"
                class="w-20"
                focus-ring-class="focus:ring-purple-500"
                text-color-class="text-purple-400"
              />
            </div>
            <!-- Current Hours in TR -->
            <div class="flex items-center gap-1.5 bg-gray-700/40 px-2 py-1 rounded-md">
              <IconClock size="14" class="text-cyan-400" />
              <span class="text-gray-400">Hours in TR:</span>
              <HoursInTRInput
                :model-value="gemPlannerStore.hoursInTR?.value || 0"
                :timestamp="gemPlannerStore.hoursInTR?.timestamp"
                :live-update="true"
                :show-live-indicator="true"
                focus-ring-class="focus:ring-cyan-500"
                @update:model-value="gemPlannerStore.updateHoursInTR($event)"
              />
            </div>
          </div>
          <!-- Total Invested -->
          <div class="flex items-center gap-1.5 text-xs bg-amber-900/30 px-2 py-1 rounded-md border border-amber-700/30">
            <span class="text-gray-400">Invest:</span>
            <span class="text-amber-400 font-bold">{{ formatNumber(totalRelicInvestment) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Bottom Row: Target Summary -->
      <div class="px-3 py-2.5 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <img src="@/assets/general/relics2.png" alt="Relics" class="w-3.5 h-4" />
            <span class="text-xs font-semibold text-cyan-400">Targets</span>
            <span class="text-[10px] text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded">({{ totalTargetsSummary.targetCount }})</span>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-xs">
            <!-- Total Cost -->
            <div class="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
              <span class="text-gray-500">Cost:</span>
              <span class="text-amber-400 font-semibold">{{ formatNumber(totalTargetsSummary.totalCost) }}</span>
            </div>
            <!-- Remaining -->
            <div class="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
              <span class="text-gray-500">Remaining:</span>
              <span :class="totalTargetsSummary.remaining <= 0 ? 'text-green-400' : 'text-cyan-400'" class="font-semibold">
                {{ totalTargetsSummary.remaining <= 0 ? '✓' : formatNumber(totalTargetsSummary.remaining) }}
              </span>
            </div>
            <!-- Est. Time -->
            <div class="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
              <span class="text-gray-500">Time:</span>
              <span :class="totalTargetsSummary.remaining <= 0 ? 'text-green-400' : 'text-yellow-400'" class="font-semibold">
                {{ totalTargetsSummary.estimatedTime }}
              </span>
            </div>
            <!-- Est. Date -->
            <div class="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
              <span class="text-gray-500">Date:</span>
              <span :class="totalTargetsSummary.remaining <= 0 ? 'text-green-400' : 'text-orange-400'" class="font-semibold">
                {{ totalTargetsSummary.estimatedDate }}
              </span>
            </div>
            <!-- Est. Hours in TR -->
            <div class="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded">
              <span class="text-gray-500">@Hour:</span>
              <span :class="totalTargetsSummary.remaining <= 0 ? 'text-green-400' : 'text-green-400'" class="font-semibold">
                {{ totalTargetsSummary.estimatedHoursInTR }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tier 1 Relics Table -->
    <div class="mb-4">
      <h3 class="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2 border-l-2 border-amber-500/50 pl-2">
        <img src="@/assets/general/relics2.png" alt="Relics" class="w-3.5 h-4" />
        Tier 1 Relics
      </h3>
      
      <div class="overflow-x-auto">
        <table class="text-xs w-full rounded-lg overflow-hidden border border-gray-700/30">
          <thead class="bg-gray-700/80 text-gray-300">
            <tr>
              <th class="px-2 py-1.5 text-left rounded-tl-lg">ID</th>
              <th class="px-2 py-1.5 text-center">Level</th>
              <th class="px-2 py-1.5 text-center">Target</th>
              <th class="px-2 py-1.5 text-center">Buy</th>
              <th class="px-2 py-1.5 text-right">Max</th>
              <th class="px-2 py-1.5 text-right">Target Cost</th>
              <th class="px-2 py-1.5 text-right">Est. Time</th>
              <th class="px-2 py-1.5 text-right">
                <div class="flex items-center justify-end gap-1">
                  <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3" />
                  <span>Next Cost</span>
                </div>
              </th>
              <th class="px-2 py-1.5 text-right rounded-tr-lg">
                <div class="flex items-center justify-end gap-1">
                  <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3" />
                  <span>Invested</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(relic, index) in tier1Relics" 
              :key="relic.id"
              :class="[
                index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50',
                'border-l-2 hover:bg-gray-700/40',
                hasTargetSet(relic.id) ? 'border-l-amber-500' : 'border-l-transparent'
              ]"
            >
              <!-- ID with Icon -->
              <td class="px-2 py-1.5">
                <div class="flex items-center gap-1.5">
                  <img 
                    v-if="hasRelicIcon(relic.id)"
                    :ref="el => setRelicIconRef(el, relic.id)"
                    :src="getRelicIconUrl(relic.id)" 
                    :alt="relic.id" 
                    :data-description="relic.description"
                    class="w-6 h-6 object-contain cursor-help"
                  />
                  <span class="font-mono font-semibold text-white">{{ relic.id.replace(/^r/i, '#') }}</span>
                </div>
              </td>
              
              <!-- Level Input -->
              <td class="px-2 py-1.5">
                <div class="flex justify-center">
                  <ToolValueControls
                    :value="getRelicLevel(relic.id)"
                    @update:value="updateRelicLevel(relic.id, $event)"
                    :min-value="0"
                    :max-value="getRelicMaxLevel(relic.id)"
                    :step="1"
                    :fast-step="10"
                    :show-fast-controls="false"
                    :auto-edit="true"
                    class="w-[80px]"
                    value-class="text-white text-xs"
                  />
                </div>
              </td>
              
              <!-- Target Level Input -->
              <td class="px-2 py-1.5">
                <div class="flex justify-center">
                  <ToolValueControls
                    :value="getTargetLevel(relic.id)"
                    @update:value="updateTargetLevel(relic.id, $event)"
                    :min-value="getRelicLevel(relic.id)"
                    :max-value="getRelicMaxLevel(relic.id)"
                    :step="1"
                    :fast-step="10"
                    :show-fast-controls="false"
                    :auto-edit="true"
                    class="w-[80px]"
                    value-class="text-cyan-400 text-xs"
                  />
                </div>
              </td>
              
              <!-- Buy Next Level Button -->
              <td class="px-2 py-1.5">
                <div class="flex justify-center">
                  <button
                    v-if="canBuyNextLevel(relic.id)"
                    @click="buyNextLevel(relic.id)"
                    class="p-1 rounded bg-green-900/40 hover:bg-green-600/40 text-green-400 border border-green-600/30 shadow-[0_0_6px_rgba(34,197,94,0.2)]"
                    :title="`Buy level ${getRelicLevel(relic.id) + 1} for ${formatNumber(getRelicNextCostFromCurrent(relic.id))} frags`"
                  >
                    <IconCheck size="16" />
                  </button>
                  <span v-else class="text-gray-600">-</span>
                </div>
              </td>
              
              <!-- Max Level -->
              <td class="px-2 py-1.5 text-right text-gray-400 font-mono">
                {{ getRelicMaxLevel(relic.id) }}
              </td>
              
              <!-- Target Cost -->
              <td class="px-2 py-1.5 text-right font-mono"
                :class="getTargetCost(relic.id) === 0 ? 'text-gray-500' : (getTargetCost(relic.id) === null ? 'text-gray-500' : 'text-cyan-400')"
                :title="getTargetCost(relic.id) === null ? 'Cost formula not available for these levels' : ''"
              >
                {{ getTargetCost(relic.id) === 0 ? '-' : (getTargetCost(relic.id) === null ? '?' : formatNumber(getTargetCost(relic.id))) }}
              </td>
              
              <!-- Estimated Time -->
              <td class="px-2 py-1.5 text-right font-mono"
                :class="getTargetCost(relic.id) === 0 || getTargetCost(relic.id) === null ? 'text-gray-500' : 'text-green-400'"
              >
                {{ getEstimatedTime(relic.id) }}
              </td>
              
              <!-- Next Cost -->
              <td class="px-2 py-1.5 text-right font-mono" 
                :class="getRelicNextCost(relic.id) === Infinity ? 'text-gray-500' : (getRelicNextCost(relic.id) === null ? 'text-gray-500' : 'text-amber-400')"
                :title="getRelicNextCost(relic.id) === null ? 'Cost formula not available for this level' : ''"
              >
                {{ getRelicNextCost(relic.id) === Infinity ? 'MAX' : (getRelicNextCost(relic.id) === null ? '?' : formatNumber(getRelicNextCost(relic.id))) }}
              </td>
              
              <!-- Invested -->
              <td class="px-2 py-1.5 text-right text-amber-400/80 font-mono">
                {{ formatNumber(getRelicTotalInvested(relic.id)) }}
              </td>
            </tr>
          </tbody>
          <!-- Footer -->
          <tfoot class="bg-gray-700/60 border-t border-gray-600">
            <tr>
              <td colspan="8" class="px-2 py-2 text-right font-semibold text-gray-300">Total Invested:</td>
              <td class="px-2 py-2 text-right text-amber-400 font-bold font-mono">
                <div class="flex items-center justify-end gap-1">
                  <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                  <span>{{ formatNumber(totalRelicInvestment) }}</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    
    <!-- Tier 2 Relics (only show if Power Gem Level >= 3) -->
    <div v-if="showTier2Relics">
      <h3 class="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2 border-l-2 border-purple-500/50 pl-2">
        <img src="@/assets/general/relics2.png" alt="Relics" class="w-3.5 h-4" />
        Tier 2 Relics
      </h3>
      
      <div class="overflow-x-auto">
        <table class="text-xs w-full rounded-lg overflow-hidden border border-gray-700/30">
          <thead class="bg-gray-700/80 text-gray-300">
            <tr>
              <th class="px-2 py-1.5 text-left rounded-tl-lg">ID</th>
              <th class="px-2 py-1.5 text-center">Level</th>
              <th class="px-2 py-1.5 text-center">Target</th>
              <th class="px-2 py-1.5 text-center">Buy</th>
              <th class="px-2 py-1.5 text-right">Max</th>
              <th class="px-2 py-1.5 text-right">Target Cost</th>
              <th class="px-2 py-1.5 text-right">Est. Time</th>
              <th class="px-2 py-1.5 text-right">
                <div class="flex items-center justify-end gap-1">
                  <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3" />
                  <span>Next Cost</span>
                </div>
              </th>
              <th class="px-2 py-1.5 text-right rounded-tr-lg">
                <div class="flex items-center justify-end gap-1">
                  <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3 h-3" />
                  <span>Invested</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(relic, index) in tier2Relics" 
              :key="relic.id"
              :class="[
                index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50',
                'border-l-2 hover:bg-gray-700/40',
                hasTargetSet(relic.id) ? 'border-l-purple-500' : 'border-l-transparent'
              ]"
            >
              <!-- ID with Icon -->
              <td class="px-2 py-1.5">
                <div class="flex items-center gap-1.5">
                  <img 
                    v-if="hasRelicIcon(relic.id)"
                    :ref="el => setRelicIconRef(el, relic.id)"
                    :src="getRelicIconUrl(relic.id)" 
                    :alt="relic.id" 
                    :data-description="relic.description"
                    class="w-6 h-6 object-contain cursor-help"
                  />
                  <span class="font-mono font-semibold text-white">{{ relic.id.replace(/^t2r/i, '#') }}</span>
                </div>
              </td>
              
              <!-- Level Input -->
              <td class="px-2 py-1.5">
                <div class="flex justify-center">
                  <ToolValueControls
                    :value="getRelicLevel(relic.id)"
                    @update:value="updateRelicLevel(relic.id, $event)"
                    :min-value="0"
                    :max-value="getRelicMaxLevel(relic.id)"
                    :step="1"
                    :fast-step="10"
                    :show-fast-controls="false"
                    :auto-edit="true"
                    class="w-[80px]"
                    value-class="text-white text-xs"
                  />
                </div>
              </td>
              
              <!-- Target Level Input -->
              <td class="px-2 py-1.5">
                <div class="flex justify-center">
                  <ToolValueControls
                    :value="getTargetLevel(relic.id)"
                    @update:value="updateTargetLevel(relic.id, $event)"
                    :min-value="getRelicLevel(relic.id)"
                    :max-value="getRelicMaxLevel(relic.id)"
                    :step="1"
                    :fast-step="10"
                    :show-fast-controls="false"
                    :auto-edit="true"
                    class="w-[80px]"
                    value-class="text-purple-400 text-xs"
                  />
                </div>
              </td>
              
              <!-- Buy Next Level Button -->
              <td class="px-2 py-1.5">
                <div class="flex justify-center">
                  <button
                    v-if="canBuyNextLevel(relic.id)"
                    @click="buyNextLevel(relic.id)"
                    class="p-1 rounded bg-green-900/40 hover:bg-green-600/40 text-green-400 border border-green-600/30 shadow-[0_0_6px_rgba(34,197,94,0.2)]"
                    :title="`Buy level ${getRelicLevel(relic.id) + 1} for ${formatNumber(getRelicNextCostFromCurrent(relic.id))} frags`"
                  >
                    <IconCheck size="16" />
                  </button>
                  <span v-else class="text-gray-600">-</span>
                </div>
              </td>
              
              <!-- Max Level -->
              <td class="px-2 py-1.5 text-right text-gray-400 font-mono">
                {{ getRelicMaxLevel(relic.id) }}
              </td>
              
              <!-- Target Cost -->
              <td class="px-2 py-1.5 text-right font-mono"
                :class="getTargetCost(relic.id) === 0 ? 'text-gray-500' : (getTargetCost(relic.id) === null ? 'text-gray-500' : 'text-purple-400')"
                :title="getTargetCost(relic.id) === null ? 'Cost formula not available for these levels' : ''"
              >
                {{ getTargetCost(relic.id) === 0 ? '-' : (getTargetCost(relic.id) === null ? '?' : formatNumber(getTargetCost(relic.id))) }}
              </td>
              
              <!-- Estimated Time -->
              <td class="px-2 py-1.5 text-right font-mono"
                :class="getTargetCost(relic.id) === 0 || getTargetCost(relic.id) === null ? 'text-gray-500' : 'text-green-400'"
              >
                {{ getEstimatedTime(relic.id) }}
              </td>
              
              <!-- Next Cost -->
              <td class="px-2 py-1.5 text-right font-mono" 
                :class="getRelicNextCost(relic.id) === Infinity ? 'text-gray-500' : (getRelicNextCost(relic.id) === null ? 'text-gray-500' : 'text-amber-400')"
                :title="getRelicNextCost(relic.id) === null ? 'Cost formula not available for this level' : ''"
              >
                {{ getRelicNextCost(relic.id) === Infinity ? 'MAX' : (getRelicNextCost(relic.id) === null ? '?' : formatNumber(getRelicNextCost(relic.id))) }}
              </td>
              
              <!-- Invested -->
              <td class="px-2 py-1.5 text-right text-amber-400/80 font-mono">
                {{ formatNumber(getRelicTotalInvested(relic.id)) }}
              </td>
            </tr>
          </tbody>
          <!-- Footer -->
          <tfoot class="bg-gray-700/60 border-t border-gray-600">
            <tr>
              <td colspan="8" class="px-2 py-2 text-right font-semibold text-gray-300">Total Invested:</td>
              <td class="px-2 py-2 text-right text-amber-400 font-bold font-mono">
                <div class="flex items-center justify-end gap-1">
                  <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
                  <span>{{ formatNumber(totalTier2Investment) }}</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch, ref, nextTick } from 'vue';
import { IconCheck, IconClock } from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { formatNumber } from '@/composables/format';
import { 
  RELICS, 
  RELIC_COSTS, 
  getTier1Relics, 
  getTier2Relics,
  calculateTotalCost, 
  getRelicMaxLevel as getRelicMaxLevelFromData,
  hasValidCostForLevel,
  getRelicBaseCostMaxLevel
} from '../constants/relics';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import SuffixInput from '@/composables/SuffixInput.vue';
import HoursInTRInput from '@/composables/HoursInTRInput.vue';
import tippy from 'tippy.js';

// Stores
const missionPlannerStore = useMissionPlannerStore();
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Power Gem Level (required Level 3 to show Tier 2 Relics)
const powerGemLevel = computed(() => gemPlannerStore.gemStates?.power?.level || 0);
const showTier2Relics = computed(() => powerGemLevel.value >= 3);

// Relic levels from missionPlannerStore (persistent)
const relicLevels = computed(() => missionPlannerStore.relicLevels);

// Target levels from store (persistent)
const targetLevels = computed(() => missionPlannerStore.relicTargetLevels);

// Current fragments owned from store (persistent)
const currentFragments = computed(() => missionPlannerStore.currentFragments);

// Current hours in TR from gemPlannerStore (global, with live update)
const currentHoursInTR = computed(() => gemPlannerStore.getCurrentHoursInTR());

// Last update tooltip
const lastUpdateTooltip = computed(() => {
  const lastUpdated = missionPlannerStore.fragmentsLastUpdated;
  if (!lastUpdated) return 'Never updated';
  const date = new Date(lastUpdated);
  return `Last updated: ${date.toLocaleString()}`;
});

// Handle fragments update from input
function handleFragmentsUpdate(value) {
  missionPlannerStore.setCurrentFragments(value);
}

// Hours in TR wird jetzt direkt über gemPlannerStore verwaltet

// Tier 1 relics list
const tier1Relics = computed(() => getTier1Relics());

// Tier 2 relics list
const tier2Relics = computed(() => getTier2Relics());

// Total fragments per day from store (frags per hour * 24)
const fragsPerDay = computed(() => {
  const fragsPerHour = missionPlannerStore.getTotalFarmFragsPerHour(missionPlannerStore.missionAssignments);
  return fragsPerHour * 24;
});

// Mapping of modifier IDs to relic IDs
const MODIFIER_TO_RELIC = {
  'relic_3': 'r3',
  'relic_5': 'r5',
  'relic_6': 'r6',
  'relic_11': 'r11',
};

// Relic icon imports - add more as they become available
const relicIcons = import.meta.glob('@/assets/relics/*.png', { eager: true, import: 'default' });

// Tippy instances for relic icons
const relicIconRefs = ref({});
const tippyInstances = ref({});

// Set ref for relic icon and create tippy tooltip
function setRelicIconRef(el, relicId) {
  if (el) {
    relicIconRefs.value[relicId] = el;
    // Create tippy instance if it doesn't exist
    nextTick(() => {
      if (!tippyInstances.value[relicId] && el.dataset.description) {
        tippyInstances.value[relicId] = tippy(el, {
          content: el.dataset.description,
          allowHTML: true,
          theme: 'huntersim',
          placement: 'right',
          arrow: false,
          animation: 'fade',
          maxWidth: 250,
          trigger: 'mouseenter click',
          touch: true,
          interactive: true,
          interactiveBorder: 10,
          zIndex: 9999,
          appendTo: document.body,
          delay: [100, 0],
          duration: [200, 0]
        });
      }
    });
  }
}

// Cleanup tippy instances on unmount
onUnmounted(() => {
  Object.values(tippyInstances.value).forEach(instance => {
    if (instance) instance.destroy();
  });
});

// Get the filename for a relic icon (supports both T1: r1.png and T2: t2r1.png naming)
function getRelicIconFilename(relicId) {
  return `${relicId}.png`;
}

// Check if a relic has an icon available
function hasRelicIcon(relicId) {
  const filename = getRelicIconFilename(relicId);
  return Object.keys(relicIcons).some(key => key.endsWith(`/${filename}`));
}

// Get the URL for a relic icon
function getRelicIconUrl(relicId) {
  const filename = getRelicIconFilename(relicId);
  const key = Object.keys(relicIcons).find(k => k.endsWith(`/${filename}`));
  return key ? relicIcons[key] : '';
}

// Check if a relic has a target level set (target > current level)
function hasTargetSet(relicId) {
  const currentLevel = getRelicLevel(relicId);
  const target = targetLevels.value[relicId] || 0;
  return target > currentLevel;
}

// Get relic level (from store)
function getRelicLevel(relicId) {
  return relicLevels.value[relicId] || 0;
}

// Get target level for a relic
function getTargetLevel(relicId) {
  const currentLevel = getRelicLevel(relicId);
  const target = targetLevels.value[relicId] || 0;
  // If target is below current level, return current level
  if (target < currentLevel) {
    return currentLevel;
  }
  return target;
}

// Update target level
function updateTargetLevel(relicId, value) {
  const level = Math.max(0, parseInt(value) || 0);
  const currentLevel = getRelicLevel(relicId);
  const maxLevel = getRelicMaxLevel(relicId);
  // Target must be >= current level and <= max level
  missionPlannerStore.relicTargetLevels[relicId] = Math.max(currentLevel, Math.min(level, maxLevel));
}

// Update relic level
function updateRelicLevel(relicId, value) {
  const level = Math.max(0, parseInt(value) || 0);
  const maxLevel = getRelicMaxLevel(relicId);
  const newLevel = Math.min(level, maxLevel);
  missionPlannerStore.setRelicLevel(relicId, newLevel);
  
  // Also sync to modifier panel if it's a relevant relic
  syncRelicToModifiers(relicId, newLevel);
  
  // Adjust target level if it's now below the current level
  const currentTarget = missionPlannerStore.relicTargetLevels[relicId] || 0;
  if (currentTarget < newLevel) {
    missionPlannerStore.relicTargetLevels[relicId] = newLevel;
  }
}

// Sync a single relic level to the modifier panel
function syncRelicToModifiers(relicId, level) {
  const modifierId = Object.entries(MODIFIER_TO_RELIC).find(([_, rId]) => rId === relicId)?.[0];
  if (modifierId) {
    missionPlannerStore.updateModifier(modifierId, level);
  }
}

// Get max level for a relic (including Exodus Node 3 and Power Node 1 bonuses)
// Uses the centralized function from relics.js which handles fixedCosts limits
function getRelicMaxLevel(relicId) {
  // Tier 2 relics: no gem bonuses, use base max level
  if (relicId.startsWith('t2')) return getRelicMaxLevelFromData(relicId, 0);
  
  // Exodus Node 3 bonus: automatically +5 when active (except R14, R5 gets +10)
  // Read directly from gemPlannerStore - nodes[2] is Node 3 (0-indexed)
  const exodusNode3Active = gemPlannerStore.gemStates?.exodus?.nodes?.[2] || false;
  
  // Power Node 1 bonus: +3 max level for R5 and R6 only
  // Read directly from gemPlannerStore since it's not synced to modifierValues
  const powerNode1Active = gemPlannerStore.gemStates?.power?.nodes?.[0] || false;
  const powerNode1Bonus = powerNode1Active ? 3 : 0;
  
  // R14 is excluded from all bonuses
  if (relicId === 'r14') return getRelicMaxLevelFromData(relicId, 0);
  
  // R5 gets +10 when Exodus Node 3 is active (+2 per level * 5 levels) AND +3 from Power Node 1
  if (relicId === 'r5') return getRelicMaxLevelFromData(relicId, (exodusNode3Active ? 10 : 0) + powerNode1Bonus);
  
  // R6 gets +5 when Exodus Node 3 is active AND +3 from Power Node 1
  if (relicId === 'r6') return getRelicMaxLevelFromData(relicId, (exodusNode3Active ? 5 : 0) + powerNode1Bonus);
  
  // All other Tier 1 relics get +5 max level when Exodus Node 3 is active
  return getRelicMaxLevelFromData(relicId, exodusNode3Active ? 5 : 0);
}

// Check if a relic has valid cost data for a specific level
function hasValidCost(relicId, level) {
  return hasValidCostForLevel(relicId, level);
}

// Get cost for next level from current level (for buying)
// Returns null if no valid cost formula exists for this level
function getRelicNextCostFromCurrent(relicId) {
  const currentLevel = getRelicLevel(relicId);
  const maxLevel = getRelicMaxLevel(relicId);
  if (currentLevel >= maxLevel) return Infinity;
  
  // Check if we have valid cost data for this level
  if (!hasValidCost(relicId, currentLevel)) return null;
  
  const costFn = RELIC_COSTS[relicId];
  if (!costFn) return null;
  return costFn(currentLevel);
}

// Get cost for next level (from target level, for display in "Next Cost" column)
// Returns null if no valid cost formula exists for this level
function getRelicNextCost(relicId) {
  const targetLevel = getTargetLevel(relicId);
  const maxLevel = getRelicMaxLevel(relicId);
  if (targetLevel >= maxLevel) return Infinity;
  
  // Check if we have valid cost data for this level
  if (!hasValidCost(relicId, targetLevel)) return null;
  
  const costFn = RELIC_COSTS[relicId];
  if (!costFn) return null;
  return costFn(targetLevel);
}

// Check if we can buy the next level (has target set, not at max, and has valid cost)
function canBuyNextLevel(relicId) {
  const currentLevel = getRelicLevel(relicId);
  const target = getTargetLevel(relicId);
  const maxLevel = getRelicMaxLevel(relicId);
  
  // Can't buy if at max or no target set
  if (currentLevel >= maxLevel || target <= currentLevel) return false;
  
  // Can't buy if no valid cost formula
  if (!hasValidCost(relicId, currentLevel)) return false;
  
  return true;
}

// Buy next level - deduct cost from fragments and increase level
function buyNextLevel(relicId) {
  const cost = getRelicNextCostFromCurrent(relicId);
  if (cost === Infinity) return;
  
  // Use store function to handle purchase
  missionPlannerStore.purchaseRelicLevel(relicId, cost);
  
  // Also sync to modifier panel
  const newLevel = getRelicLevel(relicId);
  syncRelicToModifiers(relicId, newLevel);
}

// Get cost to reach target level
// Returns null if any level in the range has missing cost data
function getTargetCost(relicId) {
  const currentLevel = getRelicLevel(relicId);
  const target = getTargetLevel(relicId);
  
  if (target <= currentLevel) return 0;
  
  // Check if all levels have valid cost data
  for (let lvl = currentLevel; lvl < target; lvl++) {
    if (!hasValidCost(relicId, lvl)) return null;
  }
  
  return calculateTotalCost(relicId, currentLevel, target);
}

// Get estimated time to reach target level (in days)
// Takes into account current fragments owned
function getEstimatedTime(relicId) {
  const cost = getTargetCost(relicId);
  
  if (cost === null) return '?'; // Missing cost data
  if (cost === 0) return '-';
  if (fragsPerDay.value <= 0) return '∞';
  
  // Subtract current fragments from cost (can't go negative)
  const remainingCost = Math.max(0, cost - (currentFragments.value || 0));
  
  // If we already have enough fragments
  if (remainingCost === 0) return 'Ready!';
  
  const days = remainingCost / fragsPerDay.value;
  
  if (days < 1) {
    const hours = days * 24;
    if (hours < 1) {
      const minutes = hours * 60;
      return `${Math.ceil(minutes)}m`;
    }
    return `${hours.toFixed(1)}h`;
  }
  
  if (days >= 365) {
    const years = days / 365;
    return `${years.toFixed(1)}y`;
  }
  
  return `${days.toFixed(1)}d`;
}

// Get total invested in a relic (sum of all levels purchased)
// Only counts levels with valid cost data
function getRelicTotalInvested(relicId) {
  const currentLevel = relicLevels.value[relicId] || 0;
  if (currentLevel === 0) return 0;
  
  // Get the base cost max level (levels with known costs)
  const baseCostMaxLevel = getRelicBaseCostMaxLevel(relicId);
  
  // Only calculate cost up to the level we have data for
  const levelToCalculate = Math.min(currentLevel, baseCostMaxLevel);
  if (levelToCalculate === 0) return 0;
  
  return calculateTotalCost(relicId, 0, levelToCalculate);
}

// Computed: Total investment across all relics (Tier 1 + Tier 2)
const totalRelicInvestment = computed(() => {
  let total = 0;
  [...tier1Relics.value, ...tier2Relics.value].forEach(relic => {
    const invested = getRelicTotalInvested(relic.id);
    if (invested && !isNaN(invested)) {
      total += invested;
    }
  });
  return total;
});

// Computed: Total Tier 2 investment
const totalTier2Investment = computed(() => {
  let total = 0;
  tier2Relics.value.forEach(relic => {
    const invested = getRelicTotalInvested(relic.id);
    if (invested && !isNaN(invested)) {
      total += invested;
    }
  });
  return total;
});

// Computed: Summary of all targets combined
const totalTargetsSummary = computed(() => {
  let totalCost = 0;
  let targetCount = 0;
  let hasMissingCosts = false;
  
  // Sum up costs for all relics with targets set (T1 + T2)
  [...tier1Relics.value, ...tier2Relics.value].forEach(relic => {
    const cost = getTargetCost(relic.id);
    if (cost === null) {
      hasMissingCosts = true;
    } else if (cost > 0) {
      totalCost += cost;
      targetCount++;
    }
  });
  
  // Calculate remaining after subtracting current fragments ONCE
  const remaining = Math.max(0, totalCost - (currentFragments.value || 0));
  
  // Calculate hours needed to farm remaining fragments
  let hoursNeeded = 0;
  if (remaining > 0 && fragsPerDay.value > 0) {
    const days = remaining / fragsPerDay.value;
    hoursNeeded = days * 24;
  }
  
  // Calculate estimated time (in days and hours format)
  let estimatedTime = '-';
  if (remaining <= 0 && totalCost > 0) {
    estimatedTime = 'Ready!';
  } else if (remaining > 0 && fragsPerDay.value > 0) {
    const totalDays = remaining / fragsPerDay.value;
    if (totalDays < 1) {
      const hours = totalDays * 24;
      if (hours < 1) {
        const minutes = hours * 60;
        estimatedTime = `${Math.ceil(minutes)}m`;
      } else {
        estimatedTime = `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
      }
    } else if (totalDays >= 365) {
      const years = Math.floor(totalDays / 365);
      const remainingDays = Math.floor(totalDays % 365);
      estimatedTime = remainingDays > 0 ? `${years}y ${remainingDays}d` : `${years}y`;
    } else {
      const days = Math.floor(totalDays);
      const hours = Math.round((totalDays - days) * 24);
      estimatedTime = hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
  }
  
  // Calculate estimated date (local date + time when target will be reached, without year)
  let estimatedDate = '-';
  if (remaining <= 0 && totalCost > 0) {
    estimatedDate = 'Ready!';
  } else if (hoursNeeded > 0) {
    const targetDate = new Date();
    targetDate.setTime(targetDate.getTime() + hoursNeeded * 60 * 60 * 1000);
    // Format: day.month hour:minute (localized, without year)
    const dateStr = targetDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
    const timeStr = targetDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    estimatedDate = `${dateStr} ${timeStr}`;
  }
  
  // Calculate estimated hours in TR (current hours + hours needed = absolute hour)
  let estimatedHoursInTR = '-';
  if (remaining <= 0 && totalCost > 0) {
    estimatedHoursInTR = 'Ready!';
  } else if (hoursNeeded > 0) {
    const totalHours = (currentHoursInTR.value || 0) + hoursNeeded;
    estimatedHoursInTR = `${Math.round(totalHours)}h`;
  }
  
  return {
    hasTargets: targetCount > 0,
    targetCount,
    totalCost,
    remaining,
    estimatedTime,
    estimatedDate,
    estimatedHoursInTR
  };
});

// Reset all target levels to current levels
function resetAllTargets() {
  [...tier1Relics.value, ...tier2Relics.value].forEach(relic => {
    const currentLevel = getRelicLevel(relic.id);
    missionPlannerStore.relicTargetLevels[relic.id] = currentLevel;
  });
}

// Sync relic levels from HunterStore (Relics page)
function syncFromHunterStore() {
  // Get relic levels from hunterStore
  for (let i = 1; i <= 20; i++) {
    const relicId = `r${i}`;
    const hunterStoreLevel = hunterStore.getUpgradeValue('relics', relicId);
    if (hunterStoreLevel > 0) {
      const maxLevel = getRelicMaxLevel(relicId);
      const level = Math.min(hunterStoreLevel, maxLevel);
      missionPlannerStore.setRelicLevel(relicId, level);
      syncRelicToModifiers(relicId, level);
    }
  }
  
  console.log('✅ Synced relic levels from Hunter Store');
}

// Sync modifiers to relic levels on mount
function syncModifiersToRelics() {
  // Sync from modifier panel values to relic levels
  Object.entries(MODIFIER_TO_RELIC).forEach(([modifierId, relicId]) => {
    const modifierLevel = missionPlannerStore.modifierValues[modifierId] || 0;
    const currentRelicLevel = relicLevels.value[relicId] || 0;
    
    // Only update if modifier has a higher value (prefer user's explicit relic input)
    if (modifierLevel > currentRelicLevel) {
      missionPlannerStore.setRelicLevel(relicId, modifierLevel);
    }
  });
}

// Watch for modifier changes and sync to relics
watch(
  () => [
    missionPlannerStore.modifierValues.relic_3,
    missionPlannerStore.modifierValues.relic_5,
    missionPlannerStore.modifierValues.relic_6,
    missionPlannerStore.modifierValues.relic_11,
  ],
  ([r3, r5, r6, r11]) => {
    // Sync modifier values to relic levels
    if (r3 !== undefined) missionPlannerStore.setRelicLevel('r3', r3);
    if (r5 !== undefined) missionPlannerStore.setRelicLevel('r5', r5);
    if (r6 !== undefined) missionPlannerStore.setRelicLevel('r6', r6);
    if (r11 !== undefined) missionPlannerStore.setRelicLevel('r11', r11);
  },
  { deep: true }
);

// Live update interval reference
let liveUpdateInterval = null;

// Initialize on mount - auto sync from both sources
onMounted(() => {
  // Auto-update fragments based on elapsed time since last visit
  const addedFrags = missionPlannerStore.updateFragmentsFromElapsedTime();
  
  // First sync from modifiers panel
  syncModifiersToRelics();
  
  // Then sync from HunterStore (Relics page) - this has priority for non-modifier relics
  syncFromHunterStore();
  
  // Initialize target levels to current levels (only if not already set)
  [...tier1Relics.value, ...tier2Relics.value].forEach(relic => {
    const currentLevel = getRelicLevel(relic.id);
    const currentTarget = missionPlannerStore.relicTargetLevels[relic.id] || 0;
    // Only initialize if target is below current level
    if (currentTarget < currentLevel) {
      missionPlannerStore.relicTargetLevels[relic.id] = currentLevel;
    }
  });
  
  // Start live update interval (every 30 seconds)
  liveUpdateInterval = setInterval(() => {
    const addedFrags = missionPlannerStore.updateFragmentsFromElapsedTime();
  }, 5000); // 5 seconds
});

// Cleanup interval on unmount
onUnmounted(() => {
  if (liveUpdateInterval) {
    clearInterval(liveUpdateInterval);
    liveUpdateInterval = null;
  }
});
</script>
