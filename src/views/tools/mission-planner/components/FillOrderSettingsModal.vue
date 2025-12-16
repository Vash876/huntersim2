<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="closeModal"
  >
    <div
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-xs overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-700 to-gray-800 px-3 py-2 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-sm font-bold text-white flex items-center">
          <IconSettings size="14" class="mr-1.5 text-blue-400" />
          Default Fill Order
        </h2>
        <button @click="closeModal" class="p-1 rounded-full hover:bg-gray-700 transition-colors">
          <IconX size="14" class="text-gray-400" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-2 max-h-[60vh] overflow-y-auto">
        <!-- Fill Order Grid -->
        <div class="grid grid-cols-2 gap-1">
          <div
            v-for="mission in sortedMissions"
            :key="mission.tag"
            class="flex items-center justify-between bg-gray-700/40 rounded px-2 py-1"
          >
            <span class="font-mono text-[11px] text-gray-300">{{ mission.tag }}</span>
            <select
              :value="localFillOrder[mission.tag]"
              @change="updateOrder(mission.tag, Number($event.target.value))"
              class="w-10 px-0.5 py-0.5 bg-gray-900 border border-gray-600 rounded text-white text-[10px] text-center focus:border-blue-500 outline-none cursor-pointer"
            >
              <option v-for="n in 16" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-start gap-1 px-2 py-1.5 border-t border-gray-700 bg-gray-800/50">
        <button
          @click="applyCurrentOrder"
          class="px-2 py-1 text-[10px] font-semibold rounded bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          title="Use current fill order as new default"
        >
          Use Current
        </button>
        <button
          @click="resetToOriginal"
          class="px-2 py-1 text-[10px] font-semibold rounded bg-gray-600 hover:bg-gray-500 text-white transition-colors"
          title="Reset to original default"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconSettings, IconX } from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { FARM_MISSIONS, DEFAULT_FILL_ORDER } from '../constants/missions';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const missionPlannerStore = useMissionPlannerStore();

// Local state for editing
const localFillOrder = ref({ ...DEFAULT_FILL_ORDER });

// Initialize local state from store when modal opens
watch(() => props.isVisible, (visible) => {
  if (visible) {
    // Load from customDefaultFillOrder or fall back to DEFAULT_FILL_ORDER
    const customOrder = missionPlannerStore.customDefaultFillOrder;
    localFillOrder.value = customOrder && Object.keys(customOrder).length > 0
      ? { ...customOrder }
      : { ...DEFAULT_FILL_ORDER };
  }
});

// Sort missions by tag (F1-1, F1-2, ..., F2-1, etc.)
const sortedMissions = computed(() => {
  return [...FARM_MISSIONS].sort((a, b) => {
    // Extract planet number and mission number from tag (e.g., "F1-2" -> [1, 2])
    const [, planetA, missionA] = a.tag.match(/F(\d+)-(\d+)/);
    const [, planetB, missionB] = b.tag.match(/F(\d+)-(\d+)/);
    // Sort by planet first, then by mission number
    if (planetA !== planetB) return Number(planetA) - Number(planetB);
    return Number(missionA) - Number(missionB);
  });
});

// Update order for a mission (with auto-shift logic like in FarmsTab)
function updateOrder(missionTag, newOrder) {
  const currentOrder = localFillOrder.value[missionTag] || 999;
  
  // If same order, no change needed
  if (currentOrder === newOrder) return;
  
  const newFillOrder = { ...localFillOrder.value };
  
  if (newOrder > currentOrder) {
    // Moving DOWN (e.g., 1 → 5): Shift missions in between UP
    // Missions with order > currentOrder AND <= newOrder shift UP by 1
    FARM_MISSIONS.forEach(mission => {
      if (mission.tag === missionTag) return;
      const missionOrder = newFillOrder[mission.tag] || 999;
      if (missionOrder > currentOrder && missionOrder <= newOrder) {
        newFillOrder[mission.tag] = missionOrder - 1;
      }
    });
  } else {
    // Moving UP (e.g., 9 → 7): Shift missions in between DOWN
    // Missions with order >= newOrder AND < currentOrder shift DOWN by 1
    FARM_MISSIONS.forEach(mission => {
      if (mission.tag === missionTag) return;
      const missionOrder = newFillOrder[mission.tag] || 999;
      if (missionOrder >= newOrder && missionOrder < currentOrder) {
        newFillOrder[mission.tag] = missionOrder + 1;
      }
    });
  }
  
  // Set the new fill order for the target mission
  newFillOrder[missionTag] = newOrder;
  
  localFillOrder.value = newFillOrder;
  // Save to store immediately
  missionPlannerStore.setCustomDefaultFillOrder({ ...localFillOrder.value });
}

// Apply current fill order from the planner as default
function applyCurrentOrder() {
  missionPlannerStore.saveCurrentAsDefaultFillOrder();
  // Update local state to reflect the change
  localFillOrder.value = { ...missionPlannerStore.customDefaultFillOrder };
}

// Reset to original DEFAULT_FILL_ORDER
function resetToOriginal() {
  missionPlannerStore.resetCustomDefaultFillOrder();
  localFillOrder.value = { ...DEFAULT_FILL_ORDER };
}

function closeModal() {
  emit('close');
}
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
