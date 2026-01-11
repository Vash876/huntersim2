<template>
  <div 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="saveAndClose"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-lg font-bold text-white flex items-center">
          <IconSettings size="18" class="mr-2 text-cyan-400" />
          Manage Current Levels
        </h2>
        <button 
          @click="saveAndClose"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 max-h-[75vh] overflow-y-auto">
        <p class="text-sm text-gray-300 mb-4">
          Set your current gadget levels. These will be used as the starting point for all shopping list calculations.
        </p>

        <!-- Gadget Level Controls -->
        <div class="space-y-2">
          <div 
            v-for="gadget in gadgets" 
            :key="gadget.id"
            class="bg-gray-700/30 rounded-lg p-2 border border-gray-700/50 hover:border-gray-600 transition-colors"
          >
            <div class="flex items-center gap-2">
              <img 
                v-if="getGadgetImageUrl(gadget.id)" 
                :src="getGadgetImageUrl(gadget.id)" 
                class="w-8 h-8 object-contain flex-shrink-0"
                :alt="gadget.name"
              />
              <div class="flex-1 min-w-0">
                <h4 class="text-white font-semibold text-xs truncate">{{ gadget.label }}</h4>
                <p class="text-gray-400 text-[10px] truncate">{{ gadget.boost.map(b => b.description).join(', ') }}</p>
              </div>
              <ToolValueControls
                :value="localLevels[gadget.id]"
                @update:value="localLevels[gadget.id] = $event"
                :minValue="0"
                :maxValue="999"
                :step="1"
                :autoEdit="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { IconSettings, IconX, IconCheck } from '@tabler/icons-vue';
import { useGadgetPlannerStore } from '@/store/gadgetPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import ToolValueControls from '@/composables/ToolValueControls.vue';

const props = defineProps({
  gadgetImages: {
    type: Object,
    required: true
  },
  gadgets: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close']);

const store = useGadgetPlannerStore();
const hunterStore = useHunterStore();

// Local state for editing - initialize all gadgets
const localLevels = ref({});
props.gadgets.forEach(gadget => {
  localLevels.value[gadget.id] = store.currentLevels[gadget.id] || 0;
});

const hasSelectedBuild = computed(() => {
  return store.settings.selectedBuildId && store.settings.selectedBuildId !== '';
});

function getGadgetImageUrl(gadgetId) {
  return props.gadgetImages[gadgetId] || null;
}

function resetAllLevels() {
  props.gadgets.forEach(gadget => {
    localLevels.value[gadget.id] = 0;
  });
}

function loadFromSelectedBuild() {
  if (!hasSelectedBuild.value) return;

  const builds = hunterStore.getBuildsForHunter('knox');
  const selectedBuild = builds.find(b => b.id === store.settings.selectedBuildId);
  
  if (!selectedBuild) return;

  // Load Wrench and Zaptron from hunterStore (they're not build-specific)
  const storeUpgrades = hunterStore.upgrades?.gadgets || {};
  localLevels.value.wrench = storeUpgrades.wrench || 0;
  localLevels.value.zaptron = storeUpgrades.zaptron || 0;

  // Load Anchor from build overrides or build upgrades or store
  let anchorLevel = 0;
  if (selectedBuild.overrides && selectedBuild.overrides['upgrades.gadgets.anchor'] !== undefined) {
    anchorLevel = selectedBuild.overrides['upgrades.gadgets.anchor'];
  } else if (selectedBuild.upgrades && selectedBuild.upgrades.gadgets && selectedBuild.upgrades.gadgets.anchor !== undefined) {
    anchorLevel = selectedBuild.upgrades.gadgets.anchor;
  } else {
    anchorLevel = storeUpgrades.anchor || 0;
  }
  
  localLevels.value.anchor = anchorLevel;
}

function saveAndClose() {
  // Update store with new levels
  Object.entries(localLevels.value).forEach(([gadgetId, level]) => {
    store.updateCurrentLevel(gadgetId, level);
  });
  
  emit('close');
}

function closeModal() {
  emit('close');
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    saveAndClose();
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
