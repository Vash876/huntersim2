<template>
  <div class="bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50">
    <!-- Panel Header -->
    <div class="bg-gradient-to-r from-blue-900/50 to-gray-700/50 px-3 py-2 border-b border-gray-600">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-blue-300 flex items-center gap-2">
          <IconPlayerPlay :size="16" />
          Current Values
        </span>
        <button 
          @click="resetToDefaults"
          class="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="p-3 overflow-y-auto space-y-4">
      <!-- Settings Section -->
      <div>
        <div class="flex items-center mb-1">
          <div class="w-1.5 h-4 bg-purple-500 rounded-r mr-2"></div>
          <h3 class="font-medium text-sm text-purple-200">Settings</h3>
        </div>
        <div class="bg-gray-750 rounded-md overflow-hidden">
          <!-- TR Count -->
          <div class="flex items-center justify-between px-2 py-1.5 hover:bg-gray-700/30">
            <span class="text-xs text-gray-300">TR Count</span>
            <ToolValueControls
              :value="settings.trCount"
              :minValue="0"
              :maxValue="9999"
              :step="1"
              @update:value="updateSetting('trCount', $event)"
            />
          </div>
          
          <!-- All-Time Orbs -->
          <div class="flex items-center justify-between px-2 py-1.5 border-t border-gray-700 hover:bg-gray-700/30">
            <span class="text-xs text-gray-300">All-Time Orbs</span>
            <SuffixInput
              :modelValue="settings.allTimeOrbs"
              @update:modelValue="updateSetting('allTimeOrbs', $event)"
              class="w-24 text-right"
            />
          </div>

          <!-- Hours in TR -->
          <div class="flex items-center justify-between px-2 py-1.5 border-t border-gray-700 hover:bg-gray-700/30">
            <span class="text-xs text-gray-300">Hours in TR</span>
            <ToolValueControls
              :value="settings.defaultHours"
              :minValue="0"
              :maxValue="999"
              :step="1"
              @update:value="updateSetting('defaultHours', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Boost Categories -->
      <div v-for="category in visibleCategories" :key="category.id">
        <div class="flex items-center mb-1">
          <div class="w-1.5 h-4 bg-blue-500 rounded-r mr-2"></div>
          <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
        </div>
        <div class="bg-gray-750 rounded-md overflow-hidden">
          <div 
            v-for="(boost, index) in category.boosts" 
            :key="boost.key"
            class="flex items-center justify-between px-2 py-1.5 hover:bg-gray-700/30"
            :class="{ 'border-t border-gray-700': index > 0 }"
          >
            <!-- Label -->
            <div class="flex items-center gap-1 flex-1 min-w-0">
              <span class="text-xs text-gray-300 truncate">{{ boost.label }}</span>
              <InfoTooltip 
                v-if="boost.tooltip && boost.tooltip !== '0'"
                :content="getTooltipContent(boost)"
                placement="right"
              />
              <span 
                v-if="getBoostMaxValue(boost) !== undefined" 
                class="text-[9px] text-gray-500 flex-shrink-0"
              >
                ({{ getBoostMaxValue(boost) }})
              </span>
            </div>

            <!-- Control -->
            <template v-if="boost.type === 'boolean'">
              <button
                @click="toggleCurrentBoost(boost.key)"
                class="px-2 py-0.5 text-[10px] rounded transition-colors"
                :class="getCurrentValue(boost.key) 
                  ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50' 
                  : 'bg-gray-700 text-gray-400 border border-gray-600'"
              >
                {{ getCurrentValue(boost.key) ? 'ON' : 'OFF' }}
              </button>
            </template>
            <template v-else>
              <ToolValueControls
                :value="getCurrentValue(boost.key) || 0"
                :minValue="0"
                :maxValue="getBoostMaxValue(boost)"
                :step="1"
                :fastStep="boost.fastControl || 10"
                @update:value="setCurrentValue(boost.key, $event)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconPlayerPlay } from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import SuffixInput from '@/composables/SuffixInput.vue';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';
import { boostsByCategory } from '../constants/boosts';
import { getGemDataFromLocalStorage } from '@/utils/gemDataUtils';

const store = useTRPlannerStore();

// Settings from store
const settings = computed(() => store.modifiers.settings);

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

// Get current value
function getCurrentValue(key) {
  return store.modifiers.boosts[key] ?? 0;
}

// Get target value (for comparison)
function getTargetValue(key) {
  return store.modifiers.targetBoosts?.[key] ?? getCurrentValue(key);
}

// Set current value
function setCurrentValue(key, value) {
  store.setBoostValue(key, value);
  // If current > target, update target too
  if (value > getTargetValue(key)) {
    store.setTargetBoostValue(key, value);
  }
}

// Toggle boolean
function toggleCurrentBoost(key) {
  const newValue = !getCurrentValue(key);
  store.setBoostValue(key, newValue);
  // If enabling, enable target too
  if (newValue) {
    store.setTargetBoostValue(key, true);
  }
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

// Settings updates
function updateSetting(key, value) {
  store.updateSetting(key, value);
}

// Reset
function resetToDefaults() {
  store.resetToDefaults();
}

// Tooltip content
function getTooltipContent(boost) {
  if (typeof boost.tooltip === 'function') {
    const value = getCurrentValue(boost.key);
    return boost.tooltip(value, store.modifiers.boosts);
  }
  return boost.tooltip;
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgb(42, 48, 60);
}
</style>
