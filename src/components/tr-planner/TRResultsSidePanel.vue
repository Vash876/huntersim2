<template>
  <div 
    v-if="isVisible && trSteps.length > 0" 
    class="fixed left-[calc(50%+400px)] top-[48px] w-72 z-60 hidden md:block"
    :class="{ 'animate-slide-in-right': isVisible }"
  >
    <div class="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 flex flex-col">
      <!-- Header - sticky -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2 border-b border-gray-600 sticky top-0 z-10">
        <h2 class="text-sm font-bold text-white">
          <span>Live Results</span>
        </h2>
      </div>
      
      <!-- Result Cards - scrollable mit fester maximaler Höhe -->
      <div class="p-2 overflow-y-auto" style="max-height: calc(101vh - 180px)">
        <div 
          v-for="(step, index) in trSteps" 
          :key="step.id"
          class="mb-2 bg-gray-750/60 rounded border border-gray-700 p-2"
        >
          <!-- Content bleibt unverändert -->
          <div class="flex items-center gap-2 mb-1">
            <div class="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
              {{ index + 1 }}
            </div>
            <h3 class="text-xs font-medium text-gray-300">
              TR {{ trCount + index }} → TR {{ trCount + index + 1 }}
            </h3>
          </div>
          
          <!-- Orbs Required -->
          <div class="flex justify-between items-center text-[11px] py-0.5">
            <span class="text-gray-400">Required:</span>
            <span class="font-mono text-white">{{ formatNumber(getStepOrbRequirement(step, index)) }}</span>
          </div>
          
          <!-- Orb Gains -->
          <div class="flex justify-between items-center text-[11px] py-0.5">
            <span class="text-gray-400">Orb Gains:</span>
            <span class="font-mono text-green-400">{{ formatNumber(getStepOrbGains(step)) }}</span>
          </div>
          
          <!-- Fragment Gains -->
          <div class="flex justify-between items-center text-[11px] py-0.5">
            <span class="text-gray-400">Fragment Gains:</span>
            <span class="font-mono text-orange-400">{{ formatNumber(getStepFragGains(step)) }}</span>
          </div>
          
          <!-- Hours -->
          <div class="flex justify-between items-center text-[11px] py-0.5">
            <span class="text-gray-400">Hours in TR:</span>
            <span class="font-mono text-yellow-400">{{ step.targetLevels?.hoursInTR || step.stats?.hoursInTR || 0 }}</span>
          </div>
          
          <!-- Status -->
          <div class="flex justify-between items-center text-[11px] py-0.5 mt-1 border-t border-gray-700 pt-1">
            <span class="text-gray-400">Status:</span>
            <div 
              :class="getStepRequirementMet(step, index) ? 'text-green-500' : 'text-red-400'"
              class="flex items-center"
            >
              <IconCircleCheck v-if="getStepRequirementMet(step, index)" size="12" class="mr-1" />
              <IconCircleX v-else size="12" class="mr-1" />
              {{ getStepRequirementMet(step, index) ? 'Ready' : 'Missing' }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer - sticky -->
      <div class="bg-gray-800 p-2 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-400">Total TRs: {{ trSteps.length }}</span>
          <div class="text-xs text-blue-400"><span class="text-xs text-gray-400">End Date: </span>{{ trEndDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatNumber } from '@/composables/format';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-vue';

const props = defineProps({
  isVisible: Boolean,
  trSteps: Array,
  trCount: Number,
  trEndDate: String,
  getStepOrbRequirement: Function,
  getStepOrbGains: Function,
  getStepFragGains: Function,
  getStepRequirementMet: Function
});
</script>

<style scoped>
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out forwards;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px); /* Entferne translateY(-50%) */
  }
  to {
    opacity: 1;
    transform: translateX(0); /* Entferne translateY(-50%) */
  }
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}
</style>