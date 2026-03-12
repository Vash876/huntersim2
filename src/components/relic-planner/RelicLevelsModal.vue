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
          <IconSettings size="18" class="mr-2 text-purple-400" />
          Manage Current Levels
        </h2>
        <div class="flex items-center gap-2">
          <button
            @click="resetAllLevels"
            class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
          >
            Reset All
          </button>
          <button
            @click="saveAndClose"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="16" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4 max-h-[75vh] overflow-y-auto">
        <p class="text-sm text-gray-300 mb-4">
          Set your current relic levels. These will be used as the starting point for all shopping list calculations.
        </p>

        <!-- Tier 1 Relics -->
        <div class="mb-4">
          <h4 class="text-xs font-semibold text-green-400 mb-2 border-l-2 border-green-500/50 pl-2">Tier 1 Relics</h4>
          <div class="space-y-2">
            <div
              v-for="relic in tier1Relics"
              :key="relic.id"
              class="bg-gray-700/30 rounded-lg p-2 border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div class="flex items-center gap-2">
                <img
                  v-if="hasIcon(relic.id)"
                  :src="getIconUrl(relic.id)"
                  class="w-10 h-10 object-contain flex-shrink-0"
                  :alt="relic.id"
                />
                <div class="w-10 h-10 flex-shrink-0" v-else></div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-xs truncate">{{ relicLabel(relic) }}</h4>
                  <p class="text-gray-400 text-[10px] truncate">{{ relic.description }}</p>
                  <p class="text-gray-500 text-[10px]">Max: {{ getRelicMaxLevel(relic.id) }}</p>
                </div>
                <ToolValueControls
                  :value="localLevels[relic.id] || 0"
                  @update:value="localLevels[relic.id] = Math.max(0, Math.min(getRelicMaxLevel(relic.id), $event))"
                  :minValue="0"
                  :maxValue="getRelicMaxLevel(relic.id)"
                  :step="1"
                  :autoEdit="true"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Tier 2 Relics -->
        <div>
          <h4 class="text-xs font-semibold text-blue-400 mb-2 border-l-2 border-blue-500/50 pl-2">Tier 2 Relics</h4>
          <div v-if="!tier2Unlocked" class="bg-gray-800/40 rounded-lg p-3 border border-blue-900/30 text-center">
            <IconLock size="20" class="mx-auto text-gray-500 mb-1" />
            <p class="text-xs text-gray-400">Requires Power Gem Level 3</p>
            <p v-if="powerGemLevel > 0" class="text-[10px] text-gray-500 mt-0.5">Current: Level {{ powerGemLevel }}</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="relic in tier2Relics"
              :key="relic.id"
              class="bg-gray-700/30 rounded-lg p-2 border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div class="flex items-center gap-2">
                <img
                  v-if="hasIcon(relic.id)"
                  :src="getIconUrl(relic.id)"
                  class="w-10 h-10 object-contain flex-shrink-0"
                  :alt="relic.id"
                />
                <div class="w-10 h-10 flex-shrink-0" v-else></div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-white font-semibold text-xs truncate">{{ relicLabel(relic) }}</h4>
                  <p class="text-gray-400 text-[10px] truncate">{{ relic.description }}</p>
                  <p class="text-gray-500 text-[10px]">Max: {{ getRelicMaxLevel(relic.id) }}</p>
                </div>
                <ToolValueControls
                  :value="localLevels[relic.id] || 0"
                  @update:value="localLevels[relic.id] = Math.max(0, Math.min(getRelicMaxLevel(relic.id), $event))"
                  :minValue="0"
                  :maxValue="getRelicMaxLevel(relic.id)"
                  :step="1"
                  :autoEdit="true"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Tier 3 Relics -->
        <div>
          <h4 class="text-xs font-semibold text-yellow-400 mb-2 border-l-2 border-yellow-500/50 pl-2">Tier 3 Relics</h4>
          <div class="bg-gray-800/40 rounded-lg p-3 border border-yellow-900/30 text-center">
            <IconLock size="20" class="mx-auto text-gray-500 mb-1" />
            <p class="text-xs text-gray-400">Requires Power Gem Level 5</p>
            <p v-if="powerGemLevel > 0" class="text-[10px] text-gray-500 mt-0.5">Current: Level {{ powerGemLevel }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { IconSettings, IconX, IconCheck, IconLock } from '@tabler/icons-vue';
import { useRelicPlannerStore } from '@/store/relicPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { RELICS, getRelicMaxLevel as getRelicMaxLevelFromData } from '@/views/tools/mission-planner/constants/relics.js';
import ToolValueControls from '@/composables/ToolValueControls.vue';

const emit = defineEmits(['close']);
const store = useRelicPlannerStore();
const gemPlannerStore = useGemPlannerStore();

const powerGemLevel = computed(() => gemPlannerStore.gemStates?.power?.level || 0);
const tier2Unlocked = computed(() => powerGemLevel.value >= 3);

function getRelicMaxLevel(relicId) {
  if (relicId.startsWith('t2')) return getRelicMaxLevelFromData(relicId, 0);
  const exodusNode3Active = gemPlannerStore.gemStates?.exodus?.nodes?.[2] || false;
  const powerNode1Active = gemPlannerStore.gemStates?.power?.nodes?.[0] || false;
  const powerNode1Bonus = powerNode1Active ? 3 : 0;
  if (relicId === 'r14') return getRelicMaxLevelFromData(relicId, 0);
  if (relicId === 'r5') return getRelicMaxLevelFromData(relicId, (exodusNode3Active ? 10 : 0) + powerNode1Bonus);
  if (relicId === 'r6') return getRelicMaxLevelFromData(relicId, (exodusNode3Active ? 5 : 0) + powerNode1Bonus);
  return getRelicMaxLevelFromData(relicId, exodusNode3Active ? 5 : 0);
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const relicIcons = import.meta.glob('@/assets/relics/*.png', { eager: true, import: 'default' });

function hasIcon(relicId) {
  return Object.keys(relicIcons).some(k => k.endsWith(`/${relicId}.png`));
}
function getIconUrl(relicId) {
  const key = Object.keys(relicIcons).find(k => k.endsWith(`/${relicId}.png`));
  return key ? relicIcons[key] : '';
}

// ── Relic lists ───────────────────────────────────────────────────────────────
const tier1Relics = computed(() => Object.values(RELICS).filter(r => r.tier === 1));
const tier2Relics = computed(() => Object.values(RELICS).filter(r => r.tier === 2));

function relicLabel(relic) {
  if (relic.tier === 2) {
    const n = relic.id.match(/t2r(\d+)/)?.[1];
    return `T2 #${n} - ${relic.name || relic.description || relic.id}`;
  }
  const n = relic.id.match(/r(\d+)/)?.[1];
  return `#${n} - ${relic.name || relic.description || relic.id}`;
}

// ── Local levels ──────────────────────────────────────────────────────────────
const localLevels = ref({});

// Init from store
Object.values(RELICS).forEach(relic => {
  localLevels.value[relic.id] = store.currentLevels[relic.id] || 0;
});

function resetAllLevels() {
  Object.values(RELICS).forEach(relic => {
    localLevels.value[relic.id] = 0;
  });
}

function saveAndClose() {
  Object.entries(localLevels.value).forEach(([relicId, level]) => {
    store.updateCurrentLevel(relicId, level);
  });
  emit('close');
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
function handleKeydown(event) {
  if (event.key === 'Escape') saveAndClose();
}

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
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
