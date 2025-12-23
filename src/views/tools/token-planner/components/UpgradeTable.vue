<template>
  <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
    <!-- Header -->
    <div :class="['p-3 py-1 border-b flex justify-between items-center', colors.header]">
      <h3 :class="['text-sm font-semibold flex items-center', colors.text]">
        {{ title }}
      </h3>
    </div>
    
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm table-fixed">
        <colgroup>
          <col class="w-[40px]" />  <!-- Toggle -->
          <col class="w-[140px]" /> <!-- Name -->
          <col class="w-[90px]" />  <!-- Current Max -->
          <col class="w-[90px]" />  <!-- Next Max -->
          <col class="w-[100px]" /> <!-- Cost to Max -->
          <col class="w-[90px]" />  <!-- Cells -->
          <col class="w-[80px]" />  <!-- MP -->
          <col class="w-[80px]" />  <!-- Shards -->
          <col class="w-[70px]" />  <!-- RP -->
          <col class="w-[70px]" />  <!-- AP -->
          <col class="w-[80px]" />  <!-- Eff Cells -->
          <col class="w-[70px]" />  <!-- Eff MP -->
          <col class="w-[80px]" />  <!-- Eff Shards -->
          <col class="w-[60px]" />  <!-- Eff RP -->
          <col class="w-[60px]" />  <!-- Eff AP -->
        </colgroup>
        <thead>
          <tr class="bg-gray-900/60 text-gray-400 text-xs uppercase">
            <th class="px-2 py-2 text-center"></th>
            <th class="px-3 py-2 text-left">{{ title }}</th>
            <th class="px-3 py-2 text-right">Current Max</th>
            <th class="px-3 py-2 text-right">Next Max</th>
            <th class="px-3 py-2 text-right">Cost to Max</th>
            <th class="px-3 py-2 text-right">Cells</th>
            <th class="px-3 py-2 text-right">MP</th>
            <th class="px-3 py-2 text-right">Shards</th>
            <th class="px-3 py-2 text-right">RP</th>
            <th class="px-3 py-2 text-right">AP</th>
            <th class="px-3 py-2 text-right border-l border-gray-600">Eff Cells</th>
            <th class="px-3 py-2 text-right">Eff MP</th>
            <th class="px-3 py-2 text-right">Eff Shards</th>
            <th class="px-3 py-2 text-right">Eff RP</th>
            <th class="px-3 py-2 text-right">Eff AP</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="upgrade in upgrades" 
            :key="upgrade.id"
            :class="[
              'border-b border-gray-700/30 transition-colors', 
              colors.row,
              { 'opacity-40': !isUpgradeIncluded(upgrade.id) }
            ]"
          >
            
            <!-- Toggle -->
            <td class="px-2 py-2 text-center">
              <button 
                @click="toggleUpgrade(upgrade.id)"
                :class="[
                  'relative w-8 h-4 rounded-full transition-colors cursor-pointer',
                  isUpgradeIncluded(upgrade.id) ? toggleActiveColor : 'bg-gray-600'
                ]"
              >
                <span 
                  :class="[
                    'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform',
                    isUpgradeIncluded(upgrade.id) ? 'left-4.5' : 'left-0.5'
                  ]"
                />
              </button>
            </td>
            
            <!-- Name -->
            <td class="px-3 py-2 text-white font-medium">
              {{ upgrade.name }}
            </td>
            
            <!-- Current Max -->
            <td class="px-3 py-2 text-right text-yellow-400 font-mono">
              {{ formatInteger(upgrade.currentMax) }}
            </td>
            
            <!-- Next Max -->
            <td class="px-3 py-2 text-right text-yellow-200 font-mono">
              {{ formatInteger(upgrade.nextMax) }}
            </td>
            
            <!-- Cost to Max -->
            <td class="px-3 py-2 text-right text-gray-300 font-mono">
              {{ formatNumber(upgrade.costToMax) }}
            </td>
            
            <!-- Cells -->
            <td class="px-3 py-2 text-right text-green-400 font-mono">
              x{{ formatNumber(upgrade.multipliers?.cells || 1) }}
            </td>
            
            <!-- MP -->
            <td class="px-3 py-2 text-right text-red-400 font-mono">
              x{{ formatNumber(upgrade.multipliers?.mp || 1) }}
            </td>
            
            <!-- Shards -->
            <td class="px-3 py-2 text-right text-cyan-400 font-mono">
              x{{ formatNumber(upgrade.multipliers?.shards || 1) }}
            </td>
            
            <!-- RP -->
            <td class="px-3 py-2 text-right text-orange-400 font-mono">
              x{{ formatNumber(upgrade.multipliers?.rp || 1) }}
            </td>
            
            <!-- AP -->
            <td class="px-3 py-2 text-right text-blue-400 font-mono">
              x{{ formatNumber(upgrade.multipliers?.ap || 1) }}
            </td>
            
            <!-- Efficiency Cells -->
            <td class="px-3 py-2 text-right font-mono border-l border-gray-600 text-gray-300">
              {{ formatEfficiency(upgrade.efficiency?.cells) }}
            </td>
            
            <!-- Efficiency MP -->
            <td class="px-3 py-2 text-right font-mono text-gray-300">
              {{ formatEfficiency(upgrade.efficiency?.mp) }}
            </td>
            
            <!-- Efficiency Shards -->
            <td class="px-3 py-2 text-right font-mono text-gray-300">
              {{ formatEfficiency(upgrade.efficiency?.shards) }}
            </td>
            
            <!-- Efficiency RP -->
            <td class="px-3 py-2 text-right font-mono text-gray-300">
              {{ formatEfficiency(upgrade.efficiency?.rp) }}
            </td>
            
            <!-- Efficiency AP -->
            <td class="px-3 py-2 text-right font-mono text-gray-300">
              {{ formatEfficiency(upgrade.efficiency?.ap) }}
            </td>
          </tr>
          
          <!-- Total Row -->
          <tr class="bg-gray-900/80 font-semibold">
            <td class="px-2 py-2"></td>
            <td :class="['px-3 py-2', colors.text]">{{ title }} Total</td>
            <td class="px-3 py-2 text-right text-yellow-400 font-mono">-</td>
            <td class="px-3 py-2 text-right text-yellow-200 font-mono">-</td>
            <td class="px-3 py-2 text-right text-gray-300 font-mono">{{ formatNumber(totalCostToMax) }}</td>
            <td class="px-3 py-2 text-right text-green-400 font-mono">x{{ formatNumber(totalMultipliers.cells) }}</td>
            <td class="px-3 py-2 text-right text-red-400 font-mono">x{{ formatNumber(totalMultipliers.mp) }}</td>
            <td class="px-3 py-2 text-right text-cyan-400 font-mono">x{{ formatNumber(totalMultipliers.shards) }}</td>
            <td class="px-3 py-2 text-right text-orange-400 font-mono">x{{ formatNumber(totalMultipliers.rp) }}</td>
            <td class="px-3 py-2 text-right text-blue-400 font-mono">x{{ formatNumber(totalMultipliers.ap) }}</td>
            <td class="px-3 py-2 text-right font-mono border-l border-gray-600" :style="{ color: getEfficiencyColor(totalEfficiency.cells, 'cells') }">{{ formatEfficiency(totalEfficiency.cells) }}</td>
            <td class="px-3 py-2 text-right font-mono" :style="{ color: getEfficiencyColor(totalEfficiency.mp, 'mp') }">{{ formatEfficiency(totalEfficiency.mp) }}</td>
            <td class="px-3 py-2 text-right font-mono" :style="{ color: getEfficiencyColor(totalEfficiency.shards, 'shards') }">{{ formatEfficiency(totalEfficiency.shards) }}</td>
            <td class="px-3 py-2 text-right font-mono" :style="{ color: getEfficiencyColor(totalEfficiency.rp, 'rp') }">{{ formatEfficiency(totalEfficiency.rp) }}</td>
            <td class="px-3 py-2 text-right font-mono" :style="{ color: getEfficiencyColor(totalEfficiency.ap, 'ap') }">{{ formatEfficiency(totalEfficiency.ap) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatNumber } from '@/composables/format.js';
import { useTokenPlannerStore } from '@/store/tokenPlannerStore.js';

const store = useTokenPlannerStore();
const { toggleUpgrade, isUpgradeIncluded } = store;

const props = defineProps({
  tier: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  upgrades: {
    type: Array,
    required: true
  },
  colors: {
    type: Object,
    required: true
  },
  t4Cost: {
    type: Number,
    default: 0
  },
  efficiencyRange: {
    type: Object,
    required: true
  }
});

// Toggle color based on tier
const toggleActiveColor = computed(() => {
  switch (props.tier) {
    case 't1': return 'bg-green-500';
    case 't2': return 'bg-cyan-500';
    case 't3': return 'bg-purple-500';
    default: return 'bg-blue-500';
  }
});

// Computed total cost to max (including T4 max level cost, only included upgrades)
const totalCostToMax = computed(() => {
  const upgradeCosts = props.upgrades
    .filter(upgrade => isUpgradeIncluded(upgrade.id))
    .reduce((sum, upgrade) => sum + (upgrade.costToMax || 0), 0);
  return upgradeCosts + props.t4Cost;
});

// Computed total multipliers (multiply all upgrade multipliers together, only included upgrades)
const totalMultipliers = computed(() => {
  return props.upgrades
    .filter(upgrade => isUpgradeIncluded(upgrade.id))
    .reduce((totals, upgrade) => {
      const mult = upgrade.multipliers || { cells: 1, mp: 1, shards: 1, rp: 1, ap: 1 };
      return {
        cells: totals.cells * mult.cells,
        mp: totals.mp * mult.mp,
        shards: totals.shards * mult.shards,
        rp: totals.rp * mult.rp,
        ap: totals.ap * mult.ap
      };
    }, { cells: 1, mp: 1, shards: 1, rp: 1, ap: 1 });
});

// Computed total efficiency: log10(totalMultiplier) / totalCost * 1e10
const totalEfficiency = computed(() => {
  const cost = totalCostToMax.value;
  if (cost <= 0) {
    return { cells: 0, mp: 0, shards: 0, rp: 0, ap: 0 };
  }
  
  const mult = totalMultipliers.value;
  return {
    cells: mult.cells > 1 ? (Math.log10(mult.cells) / cost) * 1e10 : 0,
    mp: mult.mp > 1 ? (Math.log10(mult.mp) / cost) * 1e10 : 0,
    shards: mult.shards > 1 ? (Math.log10(mult.shards) / cost) * 1e10 : 0,
    rp: mult.rp > 1 ? (Math.log10(mult.rp) / cost) * 1e10 : 0,
    ap: mult.ap > 1 ? (Math.log10(mult.ap) / cost) * 1e10 : 0
  };
});

// Format integer numbers without decimals
function formatInteger(num) {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString();
}

// Format efficiency values
function formatEfficiency(val) {
  if (val === null || val === undefined || val === 0) return '-';
  return formatNumber(val);
}

// Get color based on efficiency value relative to min/max across all tiers
// Green = best, Red = worst
function getEfficiencyColor(value, resource) {
  if (!value || value === 0) return '#6b7280'; // gray-500
  
  const range = props.efficiencyRange[resource];
  if (!range || range.min === range.max) return '#6b7280';
  
  // Normalize value to 0-1 range (0 = worst/min, 1 = best/max)
  const normalized = (value - range.min) / (range.max - range.min);
  
  // Interpolate from red (0) to yellow (0.5) to green (1)
  if (normalized <= 0.5) {
    // Red to Yellow
    const t = normalized * 2; // 0-1
    const r = 239; // red
    const g = Math.round(68 + (200 - 68) * t); // 68 -> 200
    const b = 68;
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Green
    const t = (normalized - 0.5) * 2; // 0-1
    const r = Math.round(239 - (239 - 34) * t); // 239 -> 34
    const g = Math.round(200 + (197 - 200) * t); // 200 -> 197
    const b = Math.round(68 + (94 - 68) * t); // 68 -> 94
    return `rgb(${r}, ${g}, ${b})`;
  }
}
</script>

<style scoped>
</style>
