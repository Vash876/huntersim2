<template>
  <div :class="['rounded-lg border overflow-hidden', colors.border, colors.header]">
    <!-- Header -->
    <div :class="['px-4 py-2 border-b flex justify-between items-center', colors.header]">
      <h3 :class="['text-lg font-bold', colors.text]">{{ title }}-{{ maxLevel + 1 }}</h3>
      <span class="text-yellow-400 font-mono text-sm flex items-center gap-1">
        <img src="@/assets/general/tokens.png" alt="Tokens" class="w-4 h-4" />
        {{ formatNumber(totalCost) }}
      </span>
    </div>
    
    <!-- Content -->
    <div class="p-2 sm:p-4 bg-gray-800/50">
      <!-- Multipliers Row -->
      <div class="grid grid-cols-5 gap-1 sm:gap-2 text-center mb-3">
        <!-- Cells -->
        <div>
          <div class="flex justify-center mb-1">
            <img src="@/assets/general/cells.png" alt="Cells" class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div class="font-mono font-semibold text-[11px] sm:text-sm" style="color: #3DF593">
            x{{ formatNumber(multipliers.cells) }}
          </div>
        </div>
        
        <!-- MP -->
        <div>
          <div class="flex justify-center mb-1">
            <img src="@/assets/general/mp.png" alt="MP" class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div class="font-mono font-semibold text-[11px] sm:text-sm" style="color: #FE2A55">
            x{{ formatNumber(multipliers.mp) }}
          </div>
        </div>
        
        <!-- Shards -->
        <div>
          <div class="flex justify-center mb-1">
            <img src="@/assets/general/shards.png" alt="Shards" class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div class="font-mono font-semibold text-[11px] sm:text-sm" style="color: #46B1FF">
            x{{ formatNumber(multipliers.shards) }}
          </div>
        </div>
        
        <!-- RP -->
        <div>
          <div class="flex justify-center mb-1">
            <img src="@/assets/general/rp.png" alt="RP" class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div class="font-mono font-semibold text-[11px] sm:text-sm" style="color: #FD984D">
            x{{ formatNumber(multipliers.rp) }}
          </div>
        </div>
        
        <!-- AP -->
        <div>
          <div class="flex justify-center mb-1">
            <img src="@/assets/general/ap.png" alt="AP" class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div class="font-mono font-semibold text-[11px] sm:text-sm" style="color: #5A5BFE">
            x{{ formatNumber(multipliers.ap) }}
          </div>
        </div>
      </div>
      
      <!-- Efficiency Row -->
      <div class="grid grid-cols-5 gap-1 sm:gap-2 text-center pt-2 border-t border-gray-700/50">
        <div>
          <div 
            class="text-[9px] sm:text-xs font-mono"
            :style="{ color: getEfficiencyColor(efficiency.cells, 'cells') }"
          >
            {{ formatEfficiency(efficiency.cells) }}
          </div>
        </div>
        <div>
          <div 
            class="text-[9px] sm:text-xs font-mono"
            :style="{ color: getEfficiencyColor(efficiency.mp, 'mp') }"
          >
            {{ formatEfficiency(efficiency.mp) }}
          </div>
        </div>
        <div>
          <div 
            class="text-[9px] sm:text-xs font-mono"
            :style="{ color: getEfficiencyColor(efficiency.shards, 'shards') }"
          >
            {{ formatEfficiency(efficiency.shards) }}
          </div>
        </div>
        <div>
          <div 
            class="text-[9px] sm:text-xs font-mono"
            :style="{ color: getEfficiencyColor(efficiency.rp, 'rp') }"
          >
            {{ formatEfficiency(efficiency.rp) }}
          </div>
        </div>
        <div>
          <div 
            class="text-[9px] sm:text-xs font-mono"
            :style="{ color: getEfficiencyColor(efficiency.ap, 'ap') }"
          >
            {{ formatEfficiency(efficiency.ap) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatNumber } from '@/composables/format.js';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  maxLevel: {
    type: Number,
    required: true
  },
  colors: {
    type: Object,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  multipliers: {
    type: Object,
    required: true
  },
  efficiency: {
    type: Object,
    required: true
  },
  // Min/Max efficiency values across all tiers for color scaling
  efficiencyRange: {
    type: Object,
    required: true
  }
});

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
