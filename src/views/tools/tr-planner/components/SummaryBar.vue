<template>
  <div class="bg-gray-800/70 backdrop-blur-sm px-3 py-2.5 border-b border-gray-700/50">
    <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
      <!-- Orb Multiplier -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 bg-purple-950/20 border border-purple-800/30 rounded-md px-2 py-1">
          <img src="@/assets/general/orbs.png" alt="Orbs" class="w-4 h-4" />
          <span class="text-gray-400 font-semibold">Orb Multi:</span>
          <span class="text-purple-400 font-bold">{{ formatMultiplier(orbMultiplier) }}</span>
        </div>
        
        <!-- Fragment Multiplier -->
        <div class="flex items-center gap-1.5 bg-cyan-950/20 border border-cyan-800/30 rounded-md px-2 py-1">
          <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
          <span class="text-gray-400 font-semibold">Frag Multi:</span>
          <span class="text-cyan-400 font-bold">{{ formatMultiplier(fragMultiplier) }}</span>
        </div>
      </div>
      
      <!-- Total Orbs -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 bg-amber-900/30 px-2 py-1 rounded-md border border-amber-700/30">
          <img src="@/assets/general/orbs.png" alt="Orbs" class="w-4 h-4" />
          <span class="text-gray-400 font-semibold">Total Orbs:</span>
          <span class="text-amber-400 font-bold">{{ formatNumber(totalOrbs) }}</span>
        </div>
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
