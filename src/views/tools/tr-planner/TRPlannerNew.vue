<template>
  <div class="container mx-auto px-2 py-4">
    <!-- Top Section mit Header und Summary Bar -->
    <div class="mb-3 rounded-lg overflow-hidden shadow-lg border border-gray-700/50">
      <!-- Header mit lila Farb-Gradient -->
      <div class="bg-gradient-to-r from-purple-900 to-gray-800 p-3 border-b border-gray-600 rounded-t-lg">
        <div class="flex items-center">
          <IconHourglass class="w-6 h-6 mr-2 text-purple-300" />
          <div>
            <h1 class="text-xl font-bold">TR Planner</h1>
            <p class="text-[10px] text-gray-400">Plan your Traversal Resets</p>
          </div>
        </div>
      </div>

      <!-- Summary Bar -->
      <SummaryBar 
        :orb-multiplier="orbMultiplier"
        :frag-multiplier="fragMultiplier"
        :total-orbs="totalOrbs"
      />
    </div>

    <!-- 2-Column Grid: Current (Left) | Target (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <!-- LEFT: Current Values Panel -->
      <CurrentValuesPanel />
      
      <!-- RIGHT: Target Values Panel -->
      <TargetValuesPanel />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconHourglass } from '@tabler/icons-vue';

// Components
import SummaryBar from './components/SummaryBar.vue';
import CurrentValuesPanel from './components/CurrentValuesPanel.vue';
import TargetValuesPanel from './components/TargetValuesPanel.vue';

// Store & Composables
import { useTRPlannerStore } from '@/store/trPlannerNewStore';
import { useOrbCalculations } from './composables/useOrbCalculations';

// Store
const trPlannerStore = useTRPlannerStore();

// Orb Calculations
const { orbMultiplier, fragMultiplier } = useOrbCalculations();

// Total orbs based on all-time orbs setting (as computed number)
const totalOrbs = computed(() => trPlannerStore.modifiers.settings.allTimeOrbs || 0);
</script>
