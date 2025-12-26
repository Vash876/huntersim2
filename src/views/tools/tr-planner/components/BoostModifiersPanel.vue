<template>
  <div class="bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50">
    <!-- Panel Header -->
    <div class="bg-gradient-to-r from-purple-900/50 to-gray-700/50 px-3 py-2 border-b border-gray-600">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-purple-300 flex items-center gap-2">
          <IconAdjustments :size="16" />
          Boost Modifiers
        </span>
        <button 
          @click="resetAllToDefaults"
          class="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Reset All
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="p-3 max-h-[calc(100vh-280px)] overflow-y-auto space-y-4">
      <!-- Settings Section -->
      <div class="mb-4">
        <div class="flex items-center mb-2">
          <div class="w-1.5 h-4 bg-purple-500 rounded-r mr-2"></div>
          <h3 class="font-medium text-sm text-purple-200">Settings</h3>
        </div>
        <div class="bg-gray-750 rounded-md overflow-hidden">
          <!-- TR Count -->
          <div class="flex items-center px-2 py-1.5 hover:bg-gray-700/30">
            <span class="text-xs text-gray-300 flex-1">TR Count</span>
            <div class="flex items-center gap-4">
              <!-- Current -->
              <ToolValueControls
                :value="settings.trCount"
                :minValue="0"
                :maxValue="9999"
                :step="1"
                @update:value="updateSetting('trCount', $event)"
              />
              <!-- Spacer -->
              <div class="w-px h-6 bg-gray-600"></div>
              <!-- Target (same for settings) -->
              <ToolValueControls
                :value="settings.trCount"
                :minValue="0"
                :maxValue="9999"
                :step="1"
                disabled
                class="opacity-50"
              />
            </div>
          </div>
          
          <!-- All-Time Orbs -->
          <div class="flex items-center px-2 py-1.5 border-t border-gray-700 hover:bg-gray-700/30">
            <span class="text-xs text-gray-300 flex-1">All-Time Orbs</span>
            <div class="flex items-center gap-4">
              <input
                type="text"
                :value="formatSuffixNotation(settings.allTimeOrbs)"
                @blur="updateAllTimeOrbs($event.target.value)"
                class="w-20 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-right text-white"
              />
              <div class="w-px h-6 bg-gray-600"></div>
              <input
                type="text"
                :value="formatSuffixNotation(settings.allTimeOrbs)"
                disabled
                class="w-20 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-right text-white opacity-50"
              />
            </div>
          </div>

          <!-- Default Hours -->
          <div class="flex items-center px-2 py-1.5 border-t border-gray-700 hover:bg-gray-700/30">
            <span class="text-xs text-gray-300 flex-1">Default Hours in TR</span>
            <div class="flex items-center gap-4">
              <ToolValueControls
                :value="settings.defaultHours"
                :minValue="0"
                :maxValue="999"
                :step="1"
                @update:value="updateSetting('defaultHours', $event)"
              />
              <div class="w-px h-6 bg-gray-600"></div>
              <ToolValueControls
                :value="settings.defaultHours"
                :minValue="0"
                :maxValue="999"
                :step="1"
                disabled
                class="opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Column Headers -->
      <div class="flex items-center px-2 py-1 bg-gray-700/30 rounded-t-md border border-gray-700 border-b-0">
        <div class="flex-1 text-xs font-medium text-gray-400">Boost</div>
        <div class="flex items-center gap-4">
          <div class="w-[100px] text-center">
            <span class="text-xs font-medium text-blue-400">Current</span>
          </div>
          <div class="w-px h-4 bg-gray-600"></div>
          <div class="w-[100px] text-center">
            <span class="text-xs font-medium text-green-400">Target</span>
          </div>
        </div>
      </div>

      <!-- Boost Categories -->
      <div 
        v-for="category in visibleCategories" 
        :key="category.id"
        class="mb-4"
      >
        <!-- Category Header -->
        <div class="flex items-center mb-1">
          <div class="w-1.5 h-4 bg-blue-500 rounded-r mr-2"></div>
          <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
        </div>

        <!-- Boost List -->
        <div class="bg-gray-750 rounded-md overflow-hidden border border-gray-700">
          <div 
            v-for="(boost, index) in category.boosts" 
            :key="boost.key"
            class="flex items-center px-2 py-1.5 hover:bg-gray-700/30"
            :class="{ 'border-t border-gray-700': index > 0 }"
          >
            <!-- Boost Label -->
            <div class="flex-1 flex items-center gap-1 min-w-0">
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

            <!-- Current + Target Controls -->
            <div class="flex items-center gap-4">
              <!-- Current Value -->
              <div class="w-[100px] flex justify-center">
                <template v-if="boost.type === 'boolean'">
                  <button
                    @click="toggleBoost(boost.key, 'current')"
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

              <!-- Divider -->
              <div class="w-px h-6 bg-gray-600"></div>

              <!-- Target Value -->
              <div class="w-[100px] flex justify-center">
                <template v-if="boost.type === 'boolean'">
                  <button
                    @click="toggleBoost(boost.key, 'target')"
                    class="px-2 py-0.5 text-[10px] rounded transition-colors"
                    :class="getTargetValue(boost.key) 
                      ? 'bg-green-600/30 text-green-400 border border-green-500/50' 
                      : 'bg-gray-700 text-gray-400 border border-gray-600'"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconAdjustments } from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import { formatSuffixNotation, parseNumberWithSuffix } from '@/composables/format';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';
import { boostsByCategory } from '../constants/boosts';
import { getGemDataFromLocalStorage } from '@/utils/gemDataUtils';

const store = useTRPlannerStore();

// Settings from store
const settings = computed(() => store.modifiers.settings);

// Gem data for unlock checks
const gemLevels = computed(() => {
  const gemData = getGemDataFromLocalStorage();
  return gemData.levels || {};
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

// Check if boost is unlocked based on gem level
function isBoostUnlocked(boost) {
  if (!boost.unlock) return true;
  const requiredLevel = boost.unlock_level || 1;
  const currentLevel = gemLevels.value[boost.unlock] || 0;
  return currentLevel >= requiredLevel;
}

// Get current value from store
function getCurrentValue(key) {
  return store.modifiers.boosts[key] ?? 0;
}

// Get target value from store
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

// Set target value
function setTargetValue(key, value) {
  // Target can't be less than current
  const minValue = getCurrentValue(key);
  store.setTargetBoostValue(key, Math.max(value, minValue));
}

// Toggle boolean boost
function toggleBoost(key, type) {
  if (type === 'current') {
    const newValue = !getCurrentValue(key);
    store.setBoostValue(key, newValue);
    // If enabling current, enable target too
    if (newValue) {
      store.setTargetBoostValue(key, true);
    }
  } else {
    // Target: can only enable if current is disabled, or disable if current is disabled
    const currentValue = getCurrentValue(key);
    if (!currentValue) {
      // Can toggle freely if current is off
      store.setTargetBoostValue(key, !getTargetValue(key));
    }
    // If current is on, target must stay on
  }
}

// Get max value for boost
function getBoostMaxValue(boost) {
  if (boost.max !== undefined) return boost.max;
  if (boost.maxFromGem) {
    const gemLevel = gemLevels.value[boost.maxFromGem.gem] || 0;
    return boost.maxFromGem.base + (gemLevel * (boost.maxFromGem.perLevel || 0));
  }
  return undefined;
}

// Get tooltip content
function getTooltipContent(boost) {
  const value = getCurrentValue(boost.key) || 0;
  const allValues = store.modifiers.boosts;
  
  if (typeof boost.tooltip === 'function') {
    return boost.tooltip(value, allValues);
  }
  return boost.tooltip;
}

// Update setting
function updateSetting(key, value) {
  store.updateSetting(key, value);
}

// Update all-time orbs with suffix parsing
function updateAllTimeOrbs(inputValue) {
  const parsed = parseNumberWithSuffix(inputValue);
  if (parsed !== null) {
    store.updateSetting('allTimeOrbs', parsed);
  }
}

// Reset all to defaults
function resetAllToDefaults() {
  store.resetToDefaults();
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgb(42, 48, 60);
}
</style>
