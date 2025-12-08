<template>
  <div class="bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-lg">
    <!-- Personnel Grid (2x2) -->
    <div class="p-2 border-b border-gray-700/50">
      <div class="grid grid-cols-2 gap-2">
        <!-- T1 -->
        <div class="bg-gray-700/40 rounded-lg p-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-red-400 font-semibold text-xs">T1</span>
            <span class="text-gray-300 text-[10px]">{{ formatNumber(personnelUsed.T1) }}/{{ formatNumber(availablePersonnel.T1) }}</span>
          </div>
          <div class="h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
              :style="{ width: getPersonnelUsagePercent('T1') + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- T2 -->
        <div class="bg-gray-700/40 rounded-lg p-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-orange-400 font-semibold text-xs">T2</span>
            <span class="text-gray-300 text-[10px]">{{ formatNumber(personnelUsed.T2) }}/{{ formatNumber(availablePersonnel.T2) }}</span>
          </div>
          <div class="h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
              :style="{ width: getPersonnelUsagePercent('T2') + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- T3 -->
        <div class="bg-gray-700/40 rounded-lg p-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-yellow-400 font-semibold text-xs">T3</span>
            <span class="text-gray-300 text-[10px]">{{ formatNumber(personnelUsed.T3) }}/{{ formatNumber(availablePersonnel.T3) }}</span>
          </div>
          <div class="h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full"
              :style="{ width: getPersonnelUsagePercent('T3') + '%' }"
            ></div>
          </div>
        </div>
        
        <!-- T4 -->
        <div class="bg-gray-700/40 rounded-lg p-2">
          <div class="flex items-center justify-between mb-1">
            <span class="text-green-400 font-semibold text-xs">T4</span>
            <span class="text-gray-300 text-[10px]">{{ formatNumber(personnelUsed.T4) }}/{{ formatNumber(availablePersonnel.T4) }}</span>
          </div>
          <div class="h-1.5 bg-gray-600 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
              :style="{ width: getPersonnelUsagePercent('T4') + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fragment Stats (Stacked) -->
    <div class="p-2 space-y-1.5">
      <!-- Farm Frags Row -->
      <div class="flex items-center justify-between bg-gray-700/40 rounded-lg px-3 py-2">
        <div class="flex items-center gap-2">
          <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
          <span class="text-gray-400 text-xs">Farm</span>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="text-cyan-400 font-bold">{{ formatNumberWithCommas(totalFragsPerHour, 1) }}/hr</span>
          <span class="text-emerald-400 font-bold">{{ formatNumberWithCommas(totalFragsPerHour * 24, 0) }}/day</span>
        </div>
      </div>
      
      <!-- Campaign Frags Row -->
      <div class="flex items-center justify-between bg-purple-900/30 rounded-lg px-3 py-2 border border-purple-700/30">
        <div class="flex items-center gap-2">
          <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
          <span class="text-gray-400 text-xs">Campaigns</span>
        </div>
        <span class="text-purple-400 font-bold text-xs">{{ campaignFragments }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatNumber } from '@/composables/format';

const props = defineProps({
  availablePersonnel: {
    type: Object,
    required: true
  },
  personnelUsed: {
    type: Object,
    required: true
  },
  totalFragsPerHour: {
    type: Number,
    required: true
  },
  campaignFragments: {
    type: String,
    required: true
  }
});

// Get personnel usage percentage for progress bars
function getPersonnelUsagePercent(tier) {
  const available = props.availablePersonnel[tier] || 0;
  const used = props.personnelUsed[tier] || 0;
  if (available === 0) return 0;
  return Math.min(100, (used / available) * 100);
}

// Format number with comma as thousand separator
function formatNumberWithCommas(num, decimals = 0) {
  if (num === undefined || num === null) return '0';
  if (!isFinite(num)) return '∞';
  
  let value;
  if (decimals > 0) {
    value = num.toFixed(decimals);
  } else {
    value = (num >= 1000 ? Math.round(num) : Math.floor(num)).toString();
  }
  
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
</script>
