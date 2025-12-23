<template>
  <div class="p-0 sm:p-6 max-w-[1600px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl border border-gray-800 p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white">
        <span>Token Planner</span>
      </h2>
      
      <!-- Info Banner -->
      <div class="bg-blue-900/30 border border-blue-800 rounded-lg p-3 mb-4 text-center">
        <p class="text-blue-200 text-sm">
          Plan your next T4 Max Level upgrade.
        </p>
        <p class="text-sm mt-1">
          <span class="text-gray-400">Verified costs: </span>
          <span class="text-green-400">T1-11</span>,
          <span class="text-cyan-400">T2-9</span>,
          <span class="text-purple-400">T3-10</span>
        </p>
      </div>
      
      <!-- Settings -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconSettings size="18" class="mr-2 text-blue-400" />
            Settings
          </h3>
          
          <button 
            @click="resetSettings" 
            class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
          >
            <IconRefresh size="14" class="mr-1" />
            Reset
          </button>
        </div>
        
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Meltdown Setting -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-300 text-sm">Meltdown</span>
                <ToolValueControls
                  :value="meltdown"
                  :minValue="0"
                  :maxValue="1"
                  :step="0.001"
                  :fastStep="0.01"
                  :decimals="3"
                  @update:value="(val) => meltdown = Math.round(val * 1000) / 1000"
                  value-class="text-orange-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>
            </div>
            
            <!-- Max Levels -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="space-y-3">
                <!-- T1 Max Level -->
                <div class="flex flex-col">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-green-400 text-sm">T1 Max Level</span>
                    <div class="flex items-center">
                      <div v-if="t1NextCost > 0" class="text-xs text-gray-300 mr-2">
                        Next: <span class="text-green-400">{{ formatNumber(t1NextCost) }}</span>
                      </div>
                      <ToolValueControls
                        :value="t1MaxLevel"
                        :minValue="0"
                        :maxValue="15"
                        :step="1"
                        :fastStep="5"
                        @update:value="(val) => t1MaxLevel = val"
                        value-class="text-green-400 font-medium"
                        :autoEdit="true"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- T2 Max Level -->
                <div class="flex flex-col">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-cyan-400 text-sm">T2 Max Level</span>
                    <div class="flex items-center">
                      <div v-if="t2NextCost > 0" class="text-xs text-gray-300 mr-2">
                        Next: <span class="text-cyan-400">{{ formatNumber(t2NextCost) }}</span>
                      </div>
                      <ToolValueControls
                        :value="t2MaxLevel"
                        :minValue="0"
                        :maxValue="15"
                        :step="1"
                        :fastStep="5"
                        @update:value="(val) => t2MaxLevel = val"
                        value-class="text-cyan-400 font-medium"
                        :autoEdit="true"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- T3 Max Level -->
                <div class="flex flex-col">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-purple-400 text-sm">T3 Max Level</span>
                    <div class="flex items-center">
                      <div v-if="t3NextCost > 0" class="text-xs text-gray-300 mr-2">
                        Next: <span class="text-purple-400">{{ formatNumber(t3NextCost) }}</span>
                      </div>
                      <ToolValueControls
                        :value="t3MaxLevel"
                        :minValue="0"
                        :maxValue="15"
                        :step="1"
                        :fastStep="5"
                        @update:value="(val) => t3MaxLevel = val"
                        value-class="text-purple-400 font-medium"
                        :autoEdit="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tier Cards (Compact View) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <TierCard 
          title="T1"
          :maxLevel="t1MaxLevel"
          :colors="TIER_COLORS.t1"
          :totalCost="t1TotalCost"
          :multipliers="t1TotalMultipliers"
          :efficiency="t1TotalEfficiency"
          :efficiencyRange="efficiencyRange"
        />
        <TierCard 
          title="T2"
          :maxLevel="t2MaxLevel"
          :colors="TIER_COLORS.t2"
          :totalCost="t2TotalCost"
          :multipliers="t2TotalMultipliers"
          :efficiency="t2TotalEfficiency"
          :efficiencyRange="efficiencyRange"
        />
        <TierCard 
          title="T3"
          :maxLevel="t3MaxLevel"
          :colors="TIER_COLORS.t3"
          :totalCost="t3TotalCost"
          :multipliers="t3TotalMultipliers"
          :efficiency="t3TotalEfficiency"
          :efficiencyRange="efficiencyRange"
        />
      </div>
      
      <!-- Toggle for Detailed Tables -->
      <div class="flex items-center justify-center mb-4">
        <button
          @click="showDetailedTables = !showDetailedTables"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
            showDetailedTables 
              ? 'bg-blue-600/30 border-blue-500 text-blue-300' 
              : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50'
          ]"
        >
          <IconTable size="18" />
          <span>{{ showDetailedTables ? 'Hide' : 'Show' }} Detailed Tables</span>
        </button>
      </div>
      
      <!-- Upgrade Tables (Detailed View) -->
      <div v-if="showDetailedTables" class="space-y-4">
        <!-- T1 Table -->
        <UpgradeTable 
          tier="t1" 
          title="T1" 
          :upgrades="t1UpgradesComputed" 
          :colors="TIER_COLORS.t1"
          :t4Cost="t1NextCost"
          :efficiencyRange="efficiencyRange"
        />
        
        <!-- T2 Table -->
        <UpgradeTable 
          tier="t2" 
          title="T2" 
          :upgrades="t2UpgradesComputed" 
          :colors="TIER_COLORS.t2"
          :t4Cost="t2NextCost"
          :efficiencyRange="efficiencyRange"
        />
        
        <!-- T3 Table -->
        <UpgradeTable 
          tier="t3" 
          title="T3" 
          :upgrades="t3UpgradesComputed" 
          :colors="TIER_COLORS.t3"
          :t4Cost="t3NextCost"
          :efficiencyRange="efficiencyRange"
        />
      </div>
      
      <!-- Credits -->
      <div class="mt-6 text-center text-xs text-gray-500">
        Original Sheet by <span class="text-gray-400">Solanaceae</span>
        <!-- <span class="mx-2">|</span>
        <router-link to="/tools/token-planner/debug" class="text-gray-400 hover:text-blue-400 transition-colors">
          Debug Tool
        </router-link> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { IconSettings, IconRefresh, IconTable } from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import UpgradeTable from './components/UpgradeTable.vue';
import TierCard from './components/TierCard.vue';
import { formatNumber } from '@/composables/format.js';
import { useTokenPlannerStore } from '@/store/tokenPlannerStore.js';
import { 
  T1_UPGRADES, 
  T2_UPGRADES, 
  T3_UPGRADES, 
  CAP_INCREASE,
  BUMP_INTERVAL,
  TIER_COLORS,
  T4_MAX_LEVEL_COSTS,
  TIER_MULTIPLIERS,
  calculateCostForNextBump,
  calculateUpgradeMultipliers,
  calculateEfficiency
} from './constants/upgrades.js';

// Store
const store = useTokenPlannerStore();
const { meltdown, t1MaxLevel, t2MaxLevel, t3MaxLevel, showDetailedTables } = storeToRefs(store);
const { resetSettings, isUpgradeIncluded } = store;

// Next costs for T4 max level upgrades (dynamically based on available cost data)
const t1NextCost = computed(() => {
  if (t1MaxLevel.value >= T4_MAX_LEVEL_COSTS.t1.length) return 0;
  return T4_MAX_LEVEL_COSTS.t1[t1MaxLevel.value];
});

const t2NextCost = computed(() => {
  if (t2MaxLevel.value >= T4_MAX_LEVEL_COSTS.t2.length) return 0;
  return T4_MAX_LEVEL_COSTS.t2[t2MaxLevel.value];
});

const t3NextCost = computed(() => {
  if (t3MaxLevel.value >= T4_MAX_LEVEL_COSTS.t3.length) return 0;
  return T4_MAX_LEVEL_COSTS.t3[t3MaxLevel.value];
});

// Computed upgrades with calculated currentMax, nextMax, costs, multipliers, and efficiency
const t1UpgradesComputed = computed(() => {
  return T1_UPGRADES.map(upgrade => {
    const currentMax = upgrade.defaultMax + (t1MaxLevel.value * CAP_INCREASE.t1);
    const nextMax = upgrade.defaultMax + ((t1MaxLevel.value + 1) * CAP_INCREASE.t1);
    const levelsToMax = nextMax - currentMax; // Only new levels from currentMax to nextMax
    // Pass resourceType to calculate correct multipliers (cells for gens, mp for MP upgrade)
    const multipliers = calculateUpgradeMultipliers(levelsToMax, TIER_MULTIPLIERS.t1, meltdown.value, upgrade.resourceType);
    const costToMax = calculateCostForNextBump(upgrade, BUMP_INTERVAL.t1, currentMax, nextMax);
    const efficiency = calculateEfficiency(multipliers, costToMax);
    
    return {
      ...upgrade,
      currentMax,
      nextMax,
      costToMax,
      multipliers,
      efficiency
    };
  });
});

const t2UpgradesComputed = computed(() => {
  return T2_UPGRADES.map(upgrade => {
    const currentMax = upgrade.defaultMax + (t2MaxLevel.value * CAP_INCREASE.t2);
    const nextMax = upgrade.defaultMax + ((t2MaxLevel.value + 1) * CAP_INCREASE.t2);
    const levelsToMax = nextMax - currentMax; // Only new levels from currentMax to nextMax
    // Pass resourceTypes (array) and resourceCount to calculate correct multipliers
    const multipliers = calculateUpgradeMultipliers(levelsToMax, TIER_MULTIPLIERS.t2, meltdown.value, upgrade.resourceTypes, upgrade.resourceCount);
    const costToMax = calculateCostForNextBump(upgrade, BUMP_INTERVAL.t2, currentMax, nextMax);
    const efficiency = calculateEfficiency(multipliers, costToMax);
    
    return {
      ...upgrade,
      currentMax,
      nextMax,
      costToMax,
      multipliers,
      efficiency
    };
  });
});

const t3UpgradesComputed = computed(() => {
  return T3_UPGRADES.map(upgrade => {
    const currentMax = upgrade.defaultMax + (t3MaxLevel.value * CAP_INCREASE.t3);
    const nextMax = upgrade.defaultMax + ((t3MaxLevel.value + 1) * CAP_INCREASE.t3);
    const levelsToMax = nextMax - currentMax; // Only new levels from currentMax to nextMax
    // Pass resourceTypes (array) and resourceCount to calculate correct multipliers
    const multipliers = calculateUpgradeMultipliers(levelsToMax, TIER_MULTIPLIERS.t3, meltdown.value, upgrade.resourceTypes, upgrade.resourceCount);
    const costToMax = calculateCostForNextBump(upgrade, BUMP_INTERVAL.t3, currentMax, nextMax);
    const efficiency = calculateEfficiency(multipliers, costToMax);
    
    return {
      ...upgrade,
      currentMax,
      nextMax,
      costToMax,
      multipliers,
      efficiency
    };
  });
});

// Helper to calculate totals for a tier (only includes non-excluded upgrades)
function calculateTierTotals(upgrades, t4Cost) {
  // Filter out excluded upgrades
  const includedUpgrades = upgrades.filter(u => isUpgradeIncluded(u.id));
  
  const totalCost = includedUpgrades.reduce((sum, u) => sum + (u.costToMax || 0), 0) + t4Cost;
  
  const totalMultipliers = includedUpgrades.reduce((totals, upgrade) => {
    const mult = upgrade.multipliers || { cells: 1, mp: 1, shards: 1, rp: 1, ap: 1 };
    return {
      cells: totals.cells * mult.cells,
      mp: totals.mp * mult.mp,
      shards: totals.shards * mult.shards,
      rp: totals.rp * mult.rp,
      ap: totals.ap * mult.ap
    };
  }, { cells: 1, mp: 1, shards: 1, rp: 1, ap: 1 });
  
  // Calculate efficiency for totals
  const totalEfficiency = {
    cells: totalMultipliers.cells > 1 ? (Math.log10(totalMultipliers.cells) / totalCost) * 1e10 : 0,
    mp: totalMultipliers.mp > 1 ? (Math.log10(totalMultipliers.mp) / totalCost) * 1e10 : 0,
    shards: totalMultipliers.shards > 1 ? (Math.log10(totalMultipliers.shards) / totalCost) * 1e10 : 0,
    rp: totalMultipliers.rp > 1 ? (Math.log10(totalMultipliers.rp) / totalCost) * 1e10 : 0,
    ap: totalMultipliers.ap > 1 ? (Math.log10(totalMultipliers.ap) / totalCost) * 1e10 : 0
  };
  
  return { totalCost, totalMultipliers, totalEfficiency };
}

// T1 Totals
const t1TotalCost = computed(() => calculateTierTotals(t1UpgradesComputed.value, t1NextCost.value).totalCost);
const t1TotalMultipliers = computed(() => calculateTierTotals(t1UpgradesComputed.value, t1NextCost.value).totalMultipliers);
const t1TotalEfficiency = computed(() => calculateTierTotals(t1UpgradesComputed.value, t1NextCost.value).totalEfficiency);

// T2 Totals
const t2TotalCost = computed(() => calculateTierTotals(t2UpgradesComputed.value, t2NextCost.value).totalCost);
const t2TotalMultipliers = computed(() => calculateTierTotals(t2UpgradesComputed.value, t2NextCost.value).totalMultipliers);
const t2TotalEfficiency = computed(() => calculateTierTotals(t2UpgradesComputed.value, t2NextCost.value).totalEfficiency);

// T3 Totals
const t3TotalCost = computed(() => calculateTierTotals(t3UpgradesComputed.value, t3NextCost.value).totalCost);
const t3TotalMultipliers = computed(() => calculateTierTotals(t3UpgradesComputed.value, t3NextCost.value).totalMultipliers);
const t3TotalEfficiency = computed(() => calculateTierTotals(t3UpgradesComputed.value, t3NextCost.value).totalEfficiency);

// Efficiency range across all tiers for tier totals (for TierCard color scaling)
const efficiencyRange = computed(() => {
  const resources = ['cells', 'mp', 'shards', 'rp', 'ap'];
  const range = {};
  
  for (const resource of resources) {
    const values = [
      t1TotalEfficiency.value[resource],
      t2TotalEfficiency.value[resource],
      t3TotalEfficiency.value[resource]
    ].filter(v => v > 0);
    
    if (values.length > 0) {
      range[resource] = {
        min: Math.min(...values),
        max: Math.max(...values)
      };
    } else {
      range[resource] = { min: 0, max: 0 };
    }
  }
  
  return range;
});

// Efficiency range across ALL individual upgrades (for UpgradeTable color scaling)
const allUpgradesEfficiencyRange = computed(() => {
  const resources = ['cells', 'mp', 'shards', 'rp', 'ap'];
  const range = {};
  
  for (const resource of resources) {
    const values = [];
    
    // Collect efficiency from all upgrades across all tiers
    for (const upgrade of t1UpgradesComputed.value) {
      if (upgrade.efficiency?.[resource] > 0) {
        values.push(upgrade.efficiency[resource]);
      }
    }
    for (const upgrade of t2UpgradesComputed.value) {
      if (upgrade.efficiency?.[resource] > 0) {
        values.push(upgrade.efficiency[resource]);
      }
    }
    for (const upgrade of t3UpgradesComputed.value) {
      if (upgrade.efficiency?.[resource] > 0) {
        values.push(upgrade.efficiency[resource]);
      }
    }
    
    if (values.length > 0) {
      range[resource] = {
        min: Math.min(...values),
        max: Math.max(...values)
      };
    } else {
      range[resource] = { min: 0, max: 0 };
    }
  }
  
  return range;
});
</script>

<style scoped>
</style>