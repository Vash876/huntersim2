<template>
  <div class="bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50">
    <!-- Panel Header -->
    <div class="bg-gradient-to-r from-gray-700/50 to-green-900/50 px-3 py-2 border-b border-gray-600">
      <div class="flex items-center justify-between">
        <button 
          @click="copyCurrentToTarget"
          class="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Copy from Current
        </button>
        <span class="text-sm font-semibold text-green-300 flex items-center gap-2">
          Target Values
          <IconTarget :size="16" />
        </span>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="p-3 overflow-y-auto space-y-4">
      <!-- Settings Section (mirrored) -->
      <div>
        <div class="flex items-center justify-end mb-1">
          <h3 class="font-medium text-sm text-purple-200">Settings</h3>
          <div class="w-1.5 h-4 bg-purple-500 rounded-l ml-2"></div>
        </div>
        <div class="bg-gray-750 rounded-md overflow-hidden">
          <!-- TR Count (read-only) -->
          <div class="flex items-center justify-between px-2 py-1.5 hover:bg-gray-700/30">
            <span class="text-xs text-gray-500 px-2 py-1">{{ settings.trCount }}</span>
            <span class="text-xs text-gray-500">—</span>
          </div>
          
          <!-- All-Time Orbs (read-only) -->
          <div class="flex items-center justify-between px-2 py-1.5 border-t border-gray-700 hover:bg-gray-700/30">
            <span class="text-xs text-gray-500 px-2 py-1">{{ formatNumber(settings.allTimeOrbs) }}</span>
            <span class="text-xs text-gray-500">—</span>
          </div>

          <!-- Target Hours (editable) -->
          <div class="flex items-center justify-between px-2 py-1.5 border-t border-gray-700 hover:bg-gray-700/30">
            <ToolValueControls
              :value="targetHours"
              :minValue="settings.defaultHours"
              :maxValue="999"
              :step="1"
              @update:value="updateTargetHours($event)"
            />
            <span class="text-xs text-gray-500">—</span>
          </div>
        </div>
      </div>

      <!-- Boost Categories (mirrored - controls left, multiplier placeholder right) -->
      <div v-for="category in visibleCategories" :key="'target-' + category.id">
        <div class="flex items-center justify-end mb-1">
          <h3 class="font-medium text-sm text-green-200">{{ category.label }}</h3>
          <div class="w-1.5 h-4 bg-green-500 rounded-l ml-2"></div>
        </div>
        <div class="bg-gray-750 rounded-md overflow-hidden">
          <div 
            v-for="(boost, index) in category.boosts" 
            :key="'target-' + boost.key"
            class="flex items-center justify-between px-2 py-1.5 hover:bg-gray-700/30"
            :class="{ 'border-t border-gray-700': index > 0 }"
          >
            <!-- Control (LEFT) -->
            <template v-if="boost.type === 'boolean'">
              <button
                @click="toggleTargetBoost(boost.key)"
                :disabled="getCurrentValue(boost.key)"
                class="px-2 py-0.5 text-[10px] rounded transition-colors"
                :class="[
                  getTargetValue(boost.key) 
                    ? 'bg-green-600/30 text-green-400 border border-green-500/50' 
                    : 'bg-gray-700 text-gray-400 border border-gray-600',
                  getCurrentValue(boost.key) ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                {{ getTargetValue(boost.key) ? 'ON' : 'OFF' }}
              </button>
            </template>
            <template v-else>
              <ToolValueControls
                :value="getTargetValue(boost.key) || 0"
                :minValue="getCurrentValue(boost.key) || 0"
                :maxValue="getBoostMaxValue(boost)"
                :step="1"
                :fastStep="boost.fastControl || 10"
                @update:value="setTargetValue(boost.key, $event)"
              />
            </template>

            <!-- Multiplier placeholder (RIGHT) -->
            <span class="text-xs text-gray-500">—</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { IconTarget } from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { formatNumber } from '@/composables/format';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';
import { boostsByCategory } from '../constants/boosts';
import { getGemDataFromLocalStorage } from '@/utils/gemDataUtils';

const store = useTRPlannerStore();

// Settings from store
const settings = computed(() => store.modifiers.settings);

// Target hours (separate, local state with store backup)
const targetHours = ref(settings.value.defaultHours || 1);

// Watch for setting changes to update targetHours minimum
watch(() => settings.value.defaultHours, (newVal) => {
  if (targetHours.value < newVal) {
    targetHours.value = newVal;
  }
});

// Gem data for unlock checks
const gemData = computed(() => getGemDataFromLocalStorage());
const gemLevels = computed(() => {
  return gemData.value.levels || {};
});

// Filter categories - only show unlocked boosts
const visibleCategories = computed(() => {
  return boostsByCategory
    .map(category => ({
      ...category,
      boosts: category.boosts.filter(boost => isBoostUnlocked(boost))
    }))
    .filter(category => category.boosts.length > 0);
});

// Check if boost is unlocked
function isBoostUnlocked(boost) {
  if (!boost.unlock) return true;
  const requiredLevel = boost.unlock_level || 1;
  const currentLevel = gemLevels.value[boost.unlock] || 0;
  return currentLevel >= requiredLevel;
}

// Get current value (from parent/sibling)
function getCurrentValue(key) {
  return store.modifiers.boosts[key] ?? 0;
}

// Get target value
function getTargetValue(key) {
  return store.modifiers.targetBoosts?.[key] ?? getCurrentValue(key);
}

// Set target value
function setTargetValue(key, value) {
  // Target can't be less than current
  const minValue = getCurrentValue(key);
  store.setTargetBoostValue(key, Math.max(value, minValue));
}

// Toggle target boolean
function toggleTargetBoost(key) {
  const currentValue = getCurrentValue(key);
  if (currentValue) return; // Can't toggle if current is ON
  store.setTargetBoostValue(key, !getTargetValue(key));
}

// Get max value for boost
function getBoostMaxValue(boost) {
  if (typeof boost.getMax === 'function') {
    return boost.getMax(gemData.value);
  }
  if (boost.max !== undefined) return boost.max;
  if (boost.maxFromGem) {
    const gemLevel = gemLevels.value[boost.maxFromGem.gem] || 0;
    return boost.maxFromGem.base + (gemLevel * (boost.maxFromGem.perLevel || 0));
  }
  return undefined;
}

// Update target hours
function updateTargetHours(value) {
  targetHours.value = Math.max(value, settings.value.defaultHours);
}

// Copy all current values to target
function copyCurrentToTarget() {
  Object.keys(store.modifiers.boosts).forEach(key => {
    store.setTargetBoostValue(key, store.modifiers.boosts[key]);
  });
  targetHours.value = settings.value.defaultHours;
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgb(42, 48, 60);
}
</style>
