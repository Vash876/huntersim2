<template>
  <div class="bg-gray-800/80 rounded-lg p-2 mb-3">
    <div class="flex items-center justify-around text-xs">
      <!-- Orb Multiplier -->
      <div class="flex flex-col items-center">
        <img src="@/assets/general/orbs.png" alt="Orbs" class="w-5 h-5 mb-0.5" />
        <span class="text-[10px] text-gray-400">Orb Multi</span>
        <span class="text-purple-400 font-bold text-sm">{{ formatMultiplier(orbMultiplier) }}</span>
      </div>
      
      <!-- Divider -->
      <div class="h-8 w-px bg-gray-600"></div>
      
      <!-- Fragment Multiplier -->
      <div class="flex flex-col items-center">
        <img src="@/assets/general/fragments.png" alt="Fragments" class="w-5 h-5 mb-0.5" />
        <span class="text-[10px] text-gray-400">Frag Multi</span>
        <span class="text-cyan-400 font-bold text-sm">{{ formatMultiplier(fragMultiplier) }}</span>
      </div>
      
      <!-- Divider -->
      <div class="h-8 w-px bg-gray-600"></div>
      
      <!-- Total Orbs -->
      <div class="flex flex-col items-center">
        <img src="@/assets/general/orbs.png" alt="Orbs" class="w-5 h-5 mb-0.5" />
        <span class="text-[10px] text-gray-400">Total Orbs</span>
        <span class="text-amber-400 font-bold text-sm">{{ formatNumber(totalOrbs) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatNumber, formatMultiplier } from '@/composables/format';

defineProps({
  orbMultiplier: {
    type: Number,
    default: 1
  },
  fragMultiplier: {
    type: Number,
    default: 1
  },
  totalOrbs: {
    type: [Number, String],
    default: 0
  }
});
</script>
