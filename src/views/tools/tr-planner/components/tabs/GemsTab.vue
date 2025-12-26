<template>
  <div class="space-y-3">
    <p class="text-xs text-gray-400">
      Gem levels and active nodes are loaded from the Gem Planner.
    </p>
    
    <!-- Info Box -->
    <div class="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3">
      <div class="flex items-start gap-2">
        <IconInfoCircle :size="16" class="text-purple-400 mt-0.5 flex-shrink-0" />
        <div class="text-xs text-gray-300">
          <p class="font-semibold text-purple-300 mb-1">Gem Data</p>
          <p>Current gem levels and nodes are loaded directly from the Gem Planner. To test different values for this plan, use "Gem Overrides" in the Plans Panel.</p>
        </div>
      </div>
    </div>
    
    <!-- Gem Overview (read-only from gemPlannerStore) -->
    <div class="space-y-2">
      <div 
        v-for="gem in gems" 
        :key="gem.id"
        class="bg-gray-700/50 rounded-lg p-2"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-300">{{ gem.name }}</span>
          <span class="text-sm font-semibold" :class="gem.colorClass">Level {{ gem.level }}</span>
        </div>
        <div v-if="gem.activeNodes.length > 0" class="mt-1 flex flex-wrap gap-1">
          <span 
            v-for="node in gem.activeNodes" 
            :key="node"
            class="px-1.5 py-0.5 bg-gray-600/50 rounded text-[10px] text-gray-400"
          >
            Node {{ node }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconInfoCircle } from '@tabler/icons-vue';
import { useGemPlannerStore } from '@/store/gemPlannerStore';

const gemPlannerStore = useGemPlannerStore();

// Read gem data from gemPlannerStore
const gems = computed(() => {
  const gemIds = ['temporal', 'power', 'attraction', 'innovation', 'evolution', 'creation', 'exodus'];
  const colorMap = {
    temporal: 'text-red-400',
    power: 'text-purple-400',
    attraction: 'text-blue-400',
    innovation: 'text-yellow-400',
    evolution: 'text-green-400',
    creation: 'text-orange-400',
    exodus: 'text-pink-400'
  };
  
  return gemIds.map(id => {
    const state = gemPlannerStore.getGemState(id);
    const activeNodes = [];
    
    if (state?.nodes) {
      state.nodes.forEach((active, index) => {
        if (active) activeNodes.push(index + 1);
      });
    }
    
    return {
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1) + ' Gem',
      level: state?.level || 0,
      activeNodes,
      colorClass: colorMap[id] || 'text-gray-400'
    };
  });
});
</script>
