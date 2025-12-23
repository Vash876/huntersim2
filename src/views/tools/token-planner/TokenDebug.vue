<template>
  <div class="p-4 sm:p-6 max-w-[1200px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl border border-gray-800 p-4 sm:p-6">
      <h2 class="text-2xl font-bold mb-4 text-center text-white">
        Token Cost Debug
      </h2>
      
      <!-- Tier & Upgrade Selection -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Tier Selection -->
        <div class="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
          <label class="block text-sm text-gray-400 mb-2">Tier</label>
          <select 
            v-model="selectedTier" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="t1">T1</option>
            <option value="t2">T2</option>
            <option value="t3">T3</option>
          </select>
        </div>
        
        <!-- Upgrade Selection -->
        <div class="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
          <label class="block text-sm text-gray-400 mb-2">Upgrade</label>
          <select 
            v-model="selectedUpgradeId" 
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option v-for="upgrade in currentTierUpgrades" :key="upgrade.id" :value="upgrade.id">
              {{ upgrade.name }}
            </option>
          </select>
        </div>
        
        <!-- Max Level Selection -->
        <div class="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
          <label class="block text-sm text-gray-400 mb-2">Max Level Setting</label>
          <ToolValueControls
            :value="maxLevelSetting"
            :minValue="0"
            :maxValue="15"
            :step="1"
            @update:value="(val) => maxLevelSetting = val"
            value-class="text-yellow-400 font-medium"
          />
        </div>
      </div>

      
      <!-- Single Level Cost Checker -->
      <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
        <h3 class="text-lg font-semibold text-white mb-3">Single Level Cost Checker</h3>
        <div class="flex items-center gap-4 mb-4">
          <span class="text-gray-400">Level:</span>
          <ToolValueControls
            :value="singleLevel"
            :minValue="0"
            :maxValue="50000"
            :step="10"
            :fastStep="100"
            @update:value="(val) => singleLevel = val"
            value-class="text-purple-400 font-medium"
            :autoEdit="true"
          />
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div class="bg-gray-900/60 rounded-lg p-3">
            <div class="text-gray-400 text-xs">Base Cost</div>
            <div class="text-white font-mono">{{ formatNumber(singleLevelInfo.baseCost) }}</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg p-3">
            <div class="text-gray-400 text-xs">Multiplier</div>
            <div class="text-orange-400 font-mono">x{{ singleLevelInfo.multiplier }}</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg p-3">
            <div class="text-gray-400 text-xs">Final Cost</div>
            <div class="text-green-400 font-mono">{{ formatNumber(singleLevelInfo.finalCost) }}</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg p-3">
            <div class="text-gray-400 text-xs">Bump Index</div>
            <div class="text-yellow-400 font-mono">[{{ singleLevelInfo.bumpIndex }}]</div>
          </div>
          <div class="bg-gray-900/60 rounded-lg p-3">
            <div class="text-gray-400 text-xs">Scaling</div>
            <div :class="singleLevelInfo.hasScaling ? 'text-cyan-400' : 'text-gray-500'" class="font-mono">
              {{ singleLevelInfo.hasScaling ? `+${singleLevelInfo.scalingAdded.toFixed(2)}` : 'N/A' }}
            </div>
          </div>
        </div>
        
        <!-- Bump Scaling Info -->
        <div v-if="selectedUpgrade?.bumpScaling" class="mt-4 bg-gray-900/60 rounded-lg p-3 border border-cyan-900/30">
          <div class="text-cyan-400 text-xs font-semibold mb-2">Bump Scaling Active</div>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Starts at Bump:</span>
              <span class="text-white ml-2 font-mono">{{ selectedUpgrade.bumpScaling.startBump }}</span>
            </div>
            <div>
              <span class="text-gray-400">Per Level:</span>
              <span class="text-cyan-400 ml-2 font-mono">+{{ selectedUpgrade.bumpScaling.perLevel }}</span>
            </div>
            <div>
              <span class="text-gray-400">Scaling Start Level:</span>
              <span class="text-white ml-2 font-mono">{{ selectedUpgrade.defaultMax + (selectedUpgrade.bumpScaling.startBump * bumpInterval) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Back Link -->
      <div class="mt-6 text-center">
        <router-link to="/tools/token-planner" class="text-blue-400 hover:text-blue-300 text-sm">
          ← Back to Token Planner
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { formatNumber } from '@/composables/format.js';
import { 
  T1_UPGRADES, 
  T2_UPGRADES, 
  T3_UPGRADES, 
  CAP_INCREASE,
  BUMP_INTERVAL,
  calculateCost
} from './constants/upgrades.js';

// State
const selectedTier = ref('t1');
const selectedUpgradeId = ref('mp');
const maxLevelSetting = ref(0);
const fromLevel = ref(0);
const toLevel = ref(1000);
const singleLevel = ref(0);

// Get upgrades for current tier
const currentTierUpgrades = computed(() => {
  switch (selectedTier.value) {
    case 't1': return T1_UPGRADES;
    case 't2': return T2_UPGRADES;
    case 't3': return T3_UPGRADES;
    default: return T1_UPGRADES;
  }
});

// Get bump interval for current tier
const bumpInterval = computed(() => BUMP_INTERVAL[selectedTier.value]);

// Get selected upgrade
const selectedUpgrade = computed(() => {
  return currentTierUpgrades.value.find(u => u.id === selectedUpgradeId.value) || currentTierUpgrades.value[0];
});

// Current bump index based on toLevel
const currentBumpIndex = computed(() => {
  if (!selectedUpgrade.value) return 0;
  const defaultMax = selectedUpgrade.value.defaultMax;
  if (toLevel.value < defaultMax) return -1; // No bump yet
  const levelsOverDefault = toLevel.value - defaultMax;
  return Math.floor(levelsOverDefault / bumpInterval.value);
});

// Level presets
const levelPresets = computed(() => {
  const defaultMax = selectedUpgrade.value?.defaultMax || 0;
  const interval = bumpInterval.value;
  return [
    { label: '0 → Default Max', from: 0, to: defaultMax },
    { label: 'Bump 0', from: defaultMax, to: defaultMax + interval },
    { label: 'Bump 1', from: defaultMax + interval, to: defaultMax + interval * 2 },
    { label: 'Bump 2', from: defaultMax + interval * 2, to: defaultMax + interval * 3 },
    { label: 'Bump 3', from: defaultMax + interval * 3, to: defaultMax + interval * 4 },
    { label: 'Bump 4', from: defaultMax + interval * 4, to: defaultMax + interval * 5 },
    { label: 'Full 0→Max+5k', from: 0, to: defaultMax + interval * 5 },
  ];
});

function applyPreset(preset) {
  fromLevel.value = preset.from;
  toLevel.value = preset.to;
}

// Calculate total cost in range
const totalCostInRange = computed(() => {
  if (!selectedUpgrade.value) return 0;
  return calculateCost(selectedUpgrade.value, bumpInterval.value, fromLevel.value, toLevel.value);
});

// Average cost per level
const avgCostPerLevel = computed(() => {
  const levels = toLevel.value - fromLevel.value;
  if (levels <= 0) return 0;
  return totalCostInRange.value / levels;
});

// Cost breakdown by bump tier
const costBreakdown = computed(() => {
  if (!selectedUpgrade.value) return [];
  
  const upgrade = selectedUpgrade.value;
  const defaultMax = upgrade.defaultMax;
  const interval = bumpInterval.value;
  const breakdown = [];
  let cumulative = 0;
  
  // Pre-bump tier (0 to defaultMax)
  if (fromLevel.value < defaultMax) {
    const start = fromLevel.value;
    const end = Math.min(defaultMax, toLevel.value);
    const cost = calculateCost(upgrade, interval, start, end);
    cumulative += cost;
    breakdown.push({
      name: 'Base (No Bump)',
      startLevel: start,
      endLevel: end,
      multiplier: 1,
      cost,
      cumulative,
      isActive: toLevel.value <= defaultMax
    });
  }
  
  // Bump tiers
  for (let i = 0; i < upgrade.costBumps.length; i++) {
    const tierStart = defaultMax + (i * interval);
    const tierEnd = defaultMax + ((i + 1) * interval);
    
    if (toLevel.value <= tierStart) break;
    if (fromLevel.value >= tierEnd) continue;
    
    const actualStart = Math.max(fromLevel.value, tierStart);
    const actualEnd = Math.min(toLevel.value, tierEnd);
    
    if (actualStart < actualEnd) {
      const cost = calculateCost(upgrade, interval, actualStart, actualEnd);
      cumulative += cost;
      breakdown.push({
        name: `Bump ${i}`,
        startLevel: actualStart,
        endLevel: actualEnd,
        multiplier: upgrade.costBumps[i],
        cost,
        cumulative,
        isActive: toLevel.value > tierStart && toLevel.value <= tierEnd
      });
    }
  }
  
  return breakdown;
});

// Single level info
const singleLevelInfo = computed(() => {
  if (!selectedUpgrade.value) {
    return { baseCost: 0, multiplier: 1, finalCost: 0, bumpIndex: -1, hasScaling: false, scalingAdded: 0 };
  }
  
  const upgrade = selectedUpgrade.value;
  const level = singleLevel.value;
  const defaultMax = upgrade.defaultMax;
  const interval = bumpInterval.value;
  
  const baseCost = upgrade.startingCost + (level * upgrade.scalingCost);
  
  let multiplier = 1;
  let bumpIndex = -1;
  let hasScaling = false;
  let scalingAdded = 0;
  
  if (level >= defaultMax) {
    const levelsOverDefault = level - defaultMax;
    bumpIndex = Math.floor(levelsOverDefault / interval);
    const baseBumpMultiplier = upgrade.costBumps[Math.min(bumpIndex, upgrade.costBumps.length - 1)];
    
    // Apply linear scaling if defined
    if (upgrade.bumpScaling && bumpIndex >= upgrade.bumpScaling.startBump) {
      const scalingStartLevel = defaultMax + (upgrade.bumpScaling.startBump * interval);
      const levelsIntoScaling = level - scalingStartLevel;
      scalingAdded = levelsIntoScaling * upgrade.bumpScaling.perLevel;
      multiplier = baseBumpMultiplier + scalingAdded;
      hasScaling = true;
    } else {
      multiplier = baseBumpMultiplier;
    }
  }
  
  return {
    baseCost,
    multiplier: Math.round(multiplier * 100) / 100,  // Round to 2 decimals
    finalCost: baseCost * multiplier,
    bumpIndex,
    hasScaling,
    scalingAdded
  };
});

// Watch tier changes to reset upgrade selection
import { watch } from 'vue';
watch(selectedTier, () => {
  selectedUpgradeId.value = currentTierUpgrades.value[0]?.id || '';
});
</script>

<style scoped>
</style>
