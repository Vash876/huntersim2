<template>
  <div class="flex flex-col gap-3">
    <!-- Summary Panel with Inputs -->
    <div class="bg-gray-800/70 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
      <!-- Fragments & Hours Input -->
      <div class="grid grid-cols-2 gap-2 mb-3">
        <!-- Current Fragments -->
        <div class="bg-gray-900/50 rounded-lg p-2">
          <div class="flex items-center gap-1.5 mb-1">
            <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
            <span class="text-xs text-gray-400">Fragments</span>
          </div>
          <SuffixInput
            :model-value="currentFragments"
            @update:model-value="handleFragmentsUpdate"
            class="w-full"
            focus-ring-class="focus:ring-purple-500"
            text-color-class="text-purple-400"
          />
        </div>
        <!-- Hours in TR -->
        <div class="bg-gray-900/50 rounded-lg p-2">
          <div class="flex items-center gap-1.5 mb-1">
            <IconClock :size="14" class="text-gray-400" />
            <span class="text-xs text-gray-400">Hours in TR</span>
          </div>
          <SuffixInput
            :model-value="currentHoursInTR"
            @update:model-value="handleHoursUpdate"
            class="w-full"
            focus-ring-class="focus:ring-cyan-500"
            text-color-class="text-cyan-400"
          />
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 gap-2 text-center">
        <div class="bg-green-900/30 rounded-lg p-2 border border-green-700/30">
          <div class="text-xs text-gray-400">Rate</div>
          <div class="text-sm font-bold text-green-400">+{{ formatNumber(fragsPerDay) }}/day</div>
        </div>
        <div class="bg-amber-900/30 rounded-lg p-2 border border-amber-700/30">
          <div class="text-xs text-gray-400">Invested</div>
          <div class="text-sm font-bold text-amber-400">{{ formatNumber(totalRelicInvestment) }}</div>
        </div>
      </div>
    </div>

    <!-- Target Summary -->
    <div v-if="totalTargetsSummary.hasTargets" class="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-xl p-3 border border-cyan-700/30">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <img src="@/assets/general/relics2.png" alt="Relics" class="w-3.5 h-4" />
          <span class="text-sm font-semibold text-cyan-400">Targets</span>
          <span class="text-[10px] text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded">({{ totalTargetsSummary.targetCount }})</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 text-center text-xs">
        <div class="bg-gray-800/50 rounded-lg p-2">
          <div class="text-gray-500 mb-0.5">Cost</div>
          <div class="text-amber-400 font-semibold">{{ formatNumber(totalTargetsSummary.totalCost) }}</div>
        </div>
        <div class="bg-gray-800/50 rounded-lg p-2">
          <div class="text-gray-500 mb-0.5">Remaining</div>
          <div :class="totalTargetsSummary.remaining <= 0 ? 'text-green-400' : 'text-cyan-400'" class="font-semibold">
            {{ totalTargetsSummary.remaining <= 0 ? '✓' : formatNumber(totalTargetsSummary.remaining) }}
          </div>
        </div>
        <div class="bg-gray-800/50 rounded-lg p-2">
          <div class="text-gray-500 mb-0.5">Est. Time</div>
          <div :class="totalTargetsSummary.remaining <= 0 ? 'text-green-400' : 'text-yellow-400'" class="font-semibold">
            {{ totalTargetsSummary.estimatedTime }}
          </div>
        </div>
        <div class="bg-gray-800/50 rounded-lg p-2">
          <div class="text-gray-500 mb-0.5">@Hour</div>
          <div class="text-green-400 font-semibold">{{ totalTargetsSummary.estimatedHoursInTR }}</div>
        </div>
      </div>
    </div>

    <!-- Tier 1 Relics Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 border-l-2 border-amber-500/50 pl-2">
        <img src="@/assets/general/relics2.png" alt="Relics" class="w-3.5 h-4" />
        <h3 class="text-sm font-semibold text-amber-400">Tier 1 Relics</h3>
      </div>
      <button
        @click="handleResetTargets"
        class="flex items-center gap-1 px-1.5 py-1 rounded text-xs font-semibold bg-gray-600 hover:bg-gray-500 text-white transition-colors"
        title="Reset all relic targets to current levels"
      >
        <IconRefresh size="14" />
        <span class="text-[10px] text-gray-300">Reset Targets</span>
      </button>
    </div>

    <!-- Relic Cards (Compact) -->
    <div class="flex flex-col gap-1.5">
      <div 
        v-for="relic in tier1Relics" 
        :key="relic.id"
        :class="[
          'bg-gray-800/60 rounded-lg p-2 border-l-2 transition-colors',
          hasTargetSet(relic.id) ? 'border-l-amber-500 bg-amber-900/10' : 'border-l-gray-600'
        ]"
      >
        <!-- Compact Row: ID + Level + Target + Buy -->
        <div class="flex items-center gap-2">
          <!-- Relic ID with Icon -->
          <div class="flex items-center gap-1 w-14">
            <img 
              v-if="hasRelicIcon(relic.id)"
              :ref="el => setRelicIconRef(el, relic.id)"
              :src="getRelicIconUrl(relic.id)" 
              :alt="relic.id" 
              :data-description="RELICS[relic.id]?.description"
              class="w-6 h-6 object-contain cursor-help"
            />
            <span class="text-white font-semibold font-mono text-xs">{{ relic.id.replace(/^r/i, '#') }}</span>
          </div>
          
          <!-- Level Control -->
          <div class="flex items-center gap-1 flex-1">
            <span class="text-[9px] text-gray-500">Lv</span>
            <ToolValueControls
              :value="getRelicLevel(relic.id)"
              @update:value="updateRelicLevel(relic.id, $event)"
              :min-value="0"
              :max-value="getRelicMaxLevel(relic.id)"
              :step="1"
              :fast-step="10"
              :show-fast-controls="false"
              :auto-edit="true"
              class="w-[70px]"
              value-class="text-white text-xs"
            />
          </div>
          
          <!-- Target Control -->
          <div class="flex items-center flex-1">
            <ToolValueControls
              :value="getTargetLevel(relic.id)"
              @update:value="updateTargetLevel(relic.id, $event)"
              :min-value="getRelicLevel(relic.id)"
              :max-value="getRelicMaxLevel(relic.id)"
              :step="1"
              :fast-step="10"
              :show-fast-controls="false"
              :auto-edit="true"
              class="w-[70px]"
              value-class="text-cyan-400 text-xs"
            />
          </div>
          
          <!-- Buy Button -->
          <button
            v-if="canBuyNextLevel(relic.id)"
            @click="buyNextLevel(relic.id)"
            class="p-1 rounded bg-green-900/40 text-green-400 border border-green-600/30"
          >
            <IconCheck :size="12" />
          </button>
          <span v-else class="w-6"></span>
          
          <!-- Max Badge -->
          <span class="text-[9px] text-gray-500">/{{ getRelicMaxLevel(relic.id) }}</span>
        </div>

        <!-- Always show Next Cost + Invested -->
        <div class="flex items-center justify-between mt-1.5 text-[10px] px-1">
          <span class="text-gray-500">Next: 
            <span v-if="getRelicNextCost(relic.id) === Infinity" class="text-green-400 font-mono">MAX</span>
            <span v-else-if="getRelicNextCost(relic.id) === null" class="text-gray-500 font-mono">?</span>
            <span v-else class="text-yellow-400 font-mono">{{ formatNumber(getRelicNextCost(relic.id)) }}</span>
          </span>
          <span class="text-gray-500">Inv: <span class="text-amber-400/80 font-mono">{{ formatNumber(getRelicTotalInvested(relic.id)) }}</span></span>
        </div>

        <!-- Target Stats Row (only if target set) -->
        <div v-if="hasTargetSet(relic.id)" class="flex items-center justify-between mt-1 text-[10px] px-1 pt-1 border-t border-gray-700/30">
          <span class="text-gray-500">Target Cost: 
            <span v-if="getTargetCost(relic.id) === null" class="text-gray-500 font-mono">?</span>
            <span v-else class="text-cyan-400 font-mono">{{ formatNumber(getTargetCost(relic.id)) }}</span>
          </span>
          <span class="text-gray-500">ETA: 
            <span :class="getEstimatedTime(relic.id) === '?' ? 'text-gray-500' : 'text-green-400'" class="font-mono">{{ getEstimatedTime(relic.id) }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Tier 2 Relics (only show if Power Gem Level >= 3) -->
    <div v-if="showTier2Relics" class="mt-2">
      <div class="flex items-center gap-2 border-l-2 border-purple-500/50 pl-2 mb-2">
        <img src="@/assets/general/relics2.png" alt="Relics" class="w-3.5 h-4" />
        <h3 class="text-sm font-semibold text-purple-400">Tier 2 Relics</h3>
        <span class="text-[10px] text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded">Coming Soon</span>
      </div>
      <div class="bg-gray-800/30 rounded-lg p-4 text-center text-gray-500 text-xs border border-gray-700/30">
        Tier 2 relic formulas will be added soon
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue';
import { IconCheck, IconClock, IconRefresh } from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { formatNumber } from '@/composables/format';
import { 
  getTier1Relics, 
  calculateTotalCost, 
  getRelicMaxLevel as getRelicMaxLevelFromData,
  hasValidCostForLevel,
  getRelicBaseCostMaxLevel,
  RELIC_COSTS,
  RELICS
} from '../constants/relics';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import SuffixInput from '@/composables/SuffixInput.vue';
import tippy from 'tippy.js';

const missionPlannerStore = useMissionPlannerStore();
const gemPlannerStore = useGemPlannerStore();

// Power Gem Level (required Level 3 to show Tier 2 Relics)
const powerGemLevel = computed(() => gemPlannerStore.gemStates?.power?.level || 0);
const showTier2Relics = computed(() => powerGemLevel.value >= 3);

// Live update interval reference
let liveUpdateInterval = null;

// Initialize on mount - auto update fragments based on elapsed time
onMounted(() => {
  // Auto-update fragments based on elapsed time since last visit
  missionPlannerStore.updateFragmentsFromElapsedTime();
  
  // Start live update interval (every 5 seconds)
  liveUpdateInterval = setInterval(() => {
    missionPlannerStore.updateFragmentsFromElapsedTime();
  }, 5000);
});

// Cleanup interval and tippy instances on unmount
onUnmounted(() => {
  if (liveUpdateInterval) {
    clearInterval(liveUpdateInterval);
    liveUpdateInterval = null;
  }
  // Destroy all tippy instances
  Object.values(tippyInstances.value).forEach(instance => {
    if (instance) instance.destroy();
  });
});

// Relic levels from store
const relicLevels = computed(() => missionPlannerStore.relicLevels);
const targetLevels = computed(() => missionPlannerStore.relicTargetLevels);
const currentFragments = computed(() => missionPlannerStore.currentFragments);
const currentHoursInTR = computed(() => missionPlannerStore.currentHoursInTR);

// Tier 1 relics list
const tier1Relics = computed(() => getTier1Relics());

// Handle reset targets button
function handleResetTargets() {
  for (let i = 1; i <= 20; i++) {
    const relicId = `r${i}`;
    const currentLevel = missionPlannerStore.relicLevels[relicId] || 0;
    missionPlannerStore.relicTargetLevels[relicId] = currentLevel;
  }
}

// Frags per day
const fragsPerDay = computed(() => {
  const fragsPerHour = missionPlannerStore.getTotalFarmFragsPerHour(missionPlannerStore.missionAssignments);
  return fragsPerHour * 24;
});

// Modifier mapping
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
    nextTick(() => {
      if (!tippyInstances.value[relicId] && el.dataset.description) {
        tippyInstances.value[relicId] = tippy(el, {
          content: el.dataset.description,
          allowHTML: true,
          theme: 'huntersim',
          placement: 'right',
          arrow: false,
          animation: 'fade',
          maxWidth: 200,
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

// Handle fragments update
function handleFragmentsUpdate(value) {
  missionPlannerStore.setCurrentFragments(value);
}

// Handle hours update
function handleHoursUpdate(value) {
  missionPlannerStore.currentHoursInTR = Math.max(0, value);
}

// Check if target is set
function hasTargetSet(relicId) {
  const currentLevel = getRelicLevel(relicId);
  const target = targetLevels.value[relicId] || 0;
  return target > currentLevel;
}

// Get relic level
function getRelicLevel(relicId) {
  return relicLevels.value[relicId] || 0;
}

// Get target level
function getTargetLevel(relicId) {
  const currentLevel = getRelicLevel(relicId);
  const target = targetLevels.value[relicId] || 0;
  return target < currentLevel ? currentLevel : target;
}

// Update target level
function updateTargetLevel(relicId, value) {
  const level = Math.max(0, parseInt(value) || 0);
  const currentLevel = getRelicLevel(relicId);
  const maxLevel = getRelicMaxLevel(relicId);
  missionPlannerStore.relicTargetLevels[relicId] = Math.max(currentLevel, Math.min(level, maxLevel));
}

// Update relic level
function updateRelicLevel(relicId, value) {
  const level = Math.max(0, parseInt(value) || 0);
  const maxLevel = getRelicMaxLevel(relicId);
  const newLevel = Math.min(level, maxLevel);
  missionPlannerStore.setRelicLevel(relicId, newLevel);
  
  // Sync to modifier panel
  const modifierId = Object.entries(MODIFIER_TO_RELIC).find(([_, rId]) => rId === relicId)?.[0];
  if (modifierId) {
    missionPlannerStore.updateModifier(modifierId, newLevel);
  }
  
  // Adjust target if needed
  const currentTarget = missionPlannerStore.relicTargetLevels[relicId] || 0;
  if (currentTarget < newLevel) {
    missionPlannerStore.relicTargetLevels[relicId] = newLevel;
  }
}

// Get max level for a relic (including Exodus Node 3 and Power Node 1 bonuses)
// Uses the centralized function from relics.js which handles fixedCosts limits
function getRelicMaxLevel(relicId) {
  // Exodus Node 3 bonus: +1 max level per level (except R14, R5 gets +2)
  const exodusNode3Level = missionPlannerStore.modifierValues.exodus_node_3_level || 0;
  
  // Power Node 1 bonus: +3 max level for R5 and R6 only
  // Read directly from gemPlannerStore since it's not synced to modifierValues
  const powerNode1Active = gemPlannerStore.gemStates?.power?.nodes?.[0] || false;
  const powerNode1Bonus = powerNode1Active ? 3 : 0;
  
  // R14 is excluded from all bonuses
  if (relicId === 'r14') return getRelicMaxLevelFromData(relicId, 0);
  
  // R5 gets +2 per Exodus Node 3 level AND +3 from Power Node 1
  if (relicId === 'r5') return getRelicMaxLevelFromData(relicId, (exodusNode3Level * 2) + powerNode1Bonus);
  
  // R6 gets +1 per Exodus Node 3 level AND +3 from Power Node 1
  if (relicId === 'r6') return getRelicMaxLevelFromData(relicId, exodusNode3Level + powerNode1Bonus);
  
  // All other Tier 1 relics get +1 max level per Exodus Node 3 level
  return getRelicMaxLevelFromData(relicId, exodusNode3Level);
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

// Get cost for next level from target level (for display)
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

// Check if can buy next level (must have valid cost)
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

// Buy next level
function buyNextLevel(relicId) {
  const cost = getRelicNextCostFromCurrent(relicId);
  if (cost === Infinity || cost === null) return;
  missionPlannerStore.purchaseRelicLevel(relicId, cost);
  
  // Sync to modifier panel
  const newLevel = getRelicLevel(relicId);
  const modifierId = Object.entries(MODIFIER_TO_RELIC).find(([_, rId]) => rId === relicId)?.[0];
  if (modifierId) {
    missionPlannerStore.updateModifier(modifierId, newLevel);
  }
}

// Get target cost
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

// Get estimated time
function getEstimatedTime(relicId) {
  const cost = getTargetCost(relicId);
  if (cost === null) return '?'; // Missing cost data
  if (cost === 0) return '-';
  if (fragsPerDay.value <= 0) return '∞';
  
  const remainingCost = Math.max(0, cost - (currentFragments.value || 0));
  if (remainingCost === 0) return 'Ready!';
  
  const days = remainingCost / fragsPerDay.value;
  
  if (days < 1) {
    const hours = days * 24;
    if (hours < 1) {
      return `${Math.ceil(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}h`;
  }
  
  if (days >= 365) {
    return `${(days / 365).toFixed(1)}y`;
  }
  
  return `${days.toFixed(1)}d`;
}

// Get total invested (only counts levels with valid cost data)
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

// Total investment
const totalRelicInvestment = computed(() => {
  let total = 0;
  Object.keys(relicLevels.value).forEach(relicId => {
    const invested = getRelicTotalInvested(relicId);
    if (invested && !isNaN(invested)) {
      total += invested;
    }
  });
  return total;
});

// Targets summary
const totalTargetsSummary = computed(() => {
  let totalCost = 0;
  let targetCount = 0;
  
  tier1Relics.value.forEach(relic => {
    const cost = getTargetCost(relic.id);
    if (cost !== null && cost > 0) {
      totalCost += cost;
      targetCount++;
    }
  });
  
  const remaining = Math.max(0, totalCost - (currentFragments.value || 0));
  
  let hoursNeeded = 0;
  if (remaining > 0 && fragsPerDay.value > 0) {
    hoursNeeded = (remaining / fragsPerDay.value) * 24;
  }
  
  let estimatedTime = '-';
  if (remaining <= 0 && totalCost > 0) {
    estimatedTime = 'Ready!';
  } else if (remaining > 0 && fragsPerDay.value > 0) {
    const days = remaining / fragsPerDay.value;
    if (days < 1) {
      const hours = days * 24;
      if (hours < 1) {
        estimatedTime = `${Math.ceil(hours * 60)}m`;
      } else {
        estimatedTime = `${hours.toFixed(1)}h`;
      }
    } else if (days >= 365) {
      estimatedTime = `${(days / 365).toFixed(1)}y`;
    } else {
      estimatedTime = `${days.toFixed(1)}d`;
    }
  }
  
  let estimatedHoursInTR = '-';
  if (remaining <= 0 && totalCost > 0) {
    estimatedHoursInTR = 'Ready!';
  } else if (hoursNeeded > 0) {
    estimatedHoursInTR = `${Math.round((currentHoursInTR.value || 0) + hoursNeeded)}h`;
  }
  
  return {
    hasTargets: targetCount > 0,
    targetCount,
    totalCost,
    remaining,
    estimatedTime,
    estimatedHoursInTR
  };
});
</script>
