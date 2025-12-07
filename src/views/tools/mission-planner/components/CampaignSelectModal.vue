<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-cyan-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-sm font-bold text-white flex items-center">
          <IconTarget size="18" class="mr-2 text-cyan-400" />
          Select Campaign
        </h2>
        <button @click="closeModal" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors">
          <IconX size="16" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-3 sm:p-4 max-h-[70vh] overflow-y-auto">
        <!-- Total Campaign Fragments -->
        <div class="bg-gray-900/50 rounded-lg p-3 mb-4 border border-gray-700/50">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-300">Total Campaign Fragments (all 48)</span>
            <span class="text-lg font-bold text-cyan-400 font-mono">
              {{ missionPlannerStore.totalCampaignFragments.formatted }}
            </span>
          </div>
        </div>

        <!-- Planet Sections -->
        <div class="space-y-3">
          <!-- Planet 1: Wasta-7 -->
          <div class="bg-gray-900/30 rounded-lg p-2 border border-gray-700/30">
            <h3 class="text-xs font-semibold text-blue-400 mb-2 flex items-center">
              <IconPlanet size="14" class="mr-1.5" />
              Planet 1: Wasta-7
            </h3>
            <div class="grid grid-cols-12 gap-1">
              <button
                v-for="n in 12"
                :key="`C1-${n}`"
                @click="selectCampaign(`C1-${n}`)"
                class="py-1.5 rounded text-xs font-mono transition-colors text-center"
                :class="getCampaignButtonClass(`C1-${n}`)"
              >
                C1-{{ n }}
              </button>
            </div>
          </div>

          <!-- Planet 2: Cryton -->
          <div class="bg-gray-900/30 rounded-lg p-2 border border-gray-700/30">
            <h3 class="text-xs font-semibold text-orange-400 mb-2 flex items-center">
              <IconPlanet size="14" class="mr-1.5" />
              Planet 2: Cryton
            </h3>
            <div class="grid grid-cols-12 gap-1">
              <button
                v-for="n in 12"
                :key="`C2-${n}`"
                @click="selectCampaign(`C2-${n}`)"
                class="py-1.5 rounded text-xs font-mono transition-colors text-center"
                :class="getCampaignButtonClass(`C2-${n}`)"
              >
                C2-{{ n }}
              </button>
            </div>
          </div>

          <!-- Planet 3: Son-Egetuar -->
          <div class="bg-gray-900/30 rounded-lg p-2 border border-gray-700/30">
            <h3 class="text-xs font-semibold text-purple-400 mb-2 flex items-center">
              <IconPlanet size="14" class="mr-1.5" />
              Planet 3: Son-Egetuar
            </h3>
            <div class="grid grid-cols-12 gap-1">
              <button
                v-for="n in 12"
                :key="`C3-${n}`"
                @click="selectCampaign(`C3-${n}`)"
                class="py-1.5 rounded text-xs font-mono transition-colors text-center"
                :class="getCampaignButtonClass(`C3-${n}`)"
              >
                C3-{{ n }}
              </button>
            </div>
          </div>

          <!-- Planet 4: Sekhur-5 -->
          <div class="bg-gray-900/30 rounded-lg p-2 border border-gray-700/30">
            <h3 class="text-xs font-semibold text-green-400 mb-2 flex items-center">
              <IconPlanet size="14" class="mr-1.5" />
              Planet 4: Sekhur-5
            </h3>
            <div class="grid grid-cols-12 gap-1">
              <button
                v-for="n in 12"
                :key="`C4-${n}`"
                @click="selectCampaign(`C4-${n}`)"
                class="py-1.5 rounded text-xs font-mono transition-colors text-center"
                :class="getCampaignButtonClass(`C4-${n}`)"
              >
                C4-{{ n }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center pt-2 border-t border-gray-700 px-3 pb-3">
        <button 
          @click="clearSelection"
          class="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Clear Selection
        </button>
        <button 
          @click="closeModal" 
          class="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-md text-xs transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { IconTarget, IconX, IconPlanet } from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'select']);

const missionPlannerStore = useMissionPlannerStore();

function closeModal() {
  emit('close');
}

function selectCampaign(campaignTag) {
  missionPlannerStore.setSelectedCampaign(campaignTag);
  emit('select', campaignTag);
  closeModal();
}

function clearSelection() {
  missionPlannerStore.clearSelectedCampaign();
  emit('select', null);
  closeModal();
}

function getCampaignButtonClass(campaignTag) {
  const isSelected = missionPlannerStore.selectedCampaign === campaignTag;
  
  if (isSelected) {
    return 'bg-cyan-600 text-white border border-cyan-400';
  }
  
  return 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600 hover:border-gray-500';
}

// ESC key handling
function handleKeydown(event) {
  if (event.key === 'Escape' && props.isVisible) {
    closeModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.mobile-modal-container {
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .mobile-modal-container {
    padding-bottom: var(--mobile-safe-bottom, 70px);
    padding-top: 60px;
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
