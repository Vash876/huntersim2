<template>
  <div class="space-y-2">
    <!-- Empty State -->
    <div v-if="filteredBoosts.length === 0" class="text-center py-4 text-gray-500 text-sm">
      <p>No boosts available for this category.</p>
      <p v-if="hasLockedBoosts" class="text-xs mt-1">Some boosts require higher gem levels.</p>
    </div>
    
    <!-- Boost Items -->
    <div 
      v-for="boost in filteredBoosts" 
      :key="boost.key"
      class="bg-gray-700/50 rounded-lg p-2 flex items-center justify-between"
    >
      <div class="flex-1 min-w-0 mr-2">
        <span class="text-sm text-gray-300 truncate block">{{ boost.label }}</span>
        <span v-if="boost.tooltip && boost.tooltip !== '0'" class="text-[10px] text-gray-500 truncate block">
          {{ typeof boost.tooltip === 'function' ? '' : boost.tooltip }}
        </span>
        <!-- Unlock requirement -->
        <span v-if="boost.unlock" class="text-[10px] text-purple-400/70 block">
          Requires {{ boost.unlock }} Gem Lv{{ boost.unlock_level }}
        </span>
      </div>
      
      <!-- Number Input -->
      <ToolValueControls
        v-if="boost.type === 'number'"
        :value="getBoostValue(boost.key)"
        :min-value="0"
        :max-value="boost.max || 9999"
        :step="1"
        :fast-step="boost.fastControl || boost.normalControl || 10"
        :show-fast-controls="(boost.max || 9999) > 20"
        @update:value="setBoostValue(boost.key, $event)"
      />
      
      <!-- Boolean Toggle -->
      <button 
        v-else-if="boost.type === 'boolean'"
        @click="toggleBoost(boost.key)"
        class="w-10 h-5 rounded-full transition-colors flex-shrink-0"
        :class="getBoostValue(boost.key) ? 'bg-green-600' : 'bg-gray-600'"
      >
        <div 
          class="w-4 h-4 bg-white rounded-full transition-transform mx-0.5"
          :class="getBoostValue(boost.key) ? 'translate-x-5' : ''"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { isBoostUnlocked, meetsMinRequirement } from '../../constants/boosts';

const props = defineProps({
  boosts: {
    type: Array,
    required: true
  }
});

const store = useTRPlannerStore();
const gemPlannerStore = useGemPlannerStore();

// Get gem data for unlock checks
const gemData = computed(() => {
  const levels = {};
  const gemIds = ['temporal', 'power', 'attraction', 'innovation', 'evolution', 'creation', 'exodus'];
  gemIds.forEach(id => {
    const state = gemPlannerStore.getGemState(id);
    levels[id] = state?.level || 0;
  });
  return { levels };
});

// Filter boosts based on unlock requirements
const filteredBoosts = computed(() => {
  return props.boosts.filter(boost => {
    // Check gem unlock
    if (!isBoostUnlocked(boost, gemData.value)) return false;
    // Check min requirement (e.g., boonELevel >= 1)
    if (!meetsMinRequirement(boost, store.modifiers.boosts)) return false;
    return true;
  });
});

// Check if there are locked boosts
const hasLockedBoosts = computed(() => {
  return props.boosts.some(boost => !isBoostUnlocked(boost, gemData.value));
});

function getBoostValue(key) {
  return store.getBoostValue(key);
}

function setBoostValue(key, value) {
  store.setBoostValue(key, value);
}

function toggleBoost(key) {
  const current = getBoostValue(key);
  setBoostValue(key, !current);
}
</script>
