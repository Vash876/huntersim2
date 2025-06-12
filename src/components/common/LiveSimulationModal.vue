<!-- filepath: c:\Users\igorn\projects\huntersim2\src\components\common\LiveSimulationModal.vue -->
<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto animate-fade-in"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div :class="`bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center sticky top-0 z-10`">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconPlayerPlay size="20" :class="`mr-2 text-${hunterColor}-400`" />
          <span :class="`text-${hunterColor}-500`">{{ hunterDisplayName }}</span>
          <span class="ml-1">Live Simulation</span>
          <span class="text-sm text-gray-400 ml-2">{{ buildData.name }}</span>
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Live Simulation Content -->
      <div class="p-4">
        <LiveSimulation 
          :hunter-id="hunterId"
          :build-data="buildData"
          :current-stage="currentStage"
          :upgrades="upgrades"
          :hunter-color="hunterColor"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconPlayerPlay, IconX } from '@tabler/icons-vue';
import { getHunterById } from '@/constants/hunters';
import { useHunterStore } from '@/store/hunterStore';
import LiveSimulation from '@/components/LiveSimulation.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  hunterId: {
    type: String,
    required: true
  },
  buildData: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

// ✅ Store direkt hier verwenden für minimale Daten
const hunterStore = useHunterStore();

const currentStage = computed(() => {
  return hunterStore.hunterStats?.[props.hunterId]?.stage || 0;
});

const upgrades = computed(() => {
  return hunterStore.upgrades || {};
});

// Hunter-Information aus zentraler Konfiguration abrufen
const hunterInfo = computed(() => getHunterById(props.hunterId));
const hunterDisplayName = computed(() => hunterInfo.value?.name || 'Hunter');
const hunterColor = computed(() => hunterInfo.value?.color || 'blue');
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>