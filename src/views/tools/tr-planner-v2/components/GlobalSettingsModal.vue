<template>
  <Teleport to="body">
    <div 
      class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
      @click.self="$emit('close')"
      @keydown.escape="$emit('close')"
    >
      <div 
        class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in border border-gray-700 flex flex-col"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <IconSettings class="w-5 h-5 text-cyan-400" />
            Global Settings
          </h2>
          <button 
            @click="$emit('close')" 
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX class="w-5 h-5" />
          </button>
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-700 px-4 shrink-0">
          <div class="flex gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-3 text-sm font-medium transition-colors relative"
              :class="activeTab === tab.id 
                ? 'text-white' 
                : 'text-gray-400 hover:text-white'"
            >
              {{ tab.label }}
              <div 
                v-if="activeTab === tab.id"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
              ></div>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4">
          <!-- Gems Tab -->
          <div v-if="activeTab === 'gems'" class="space-y-4">
            <p class="text-sm text-gray-400">
              Configure your global gem levels. These settings will be used as the baseline for all plans.
            </p>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="gem in gems" 
                :key="gem.id"
                class="bg-gray-900/50 rounded-lg p-4 border transition-colors"
                :class="getGemLevel(gem.id) > 0 ? gem.borderClass : 'border-gray-700'"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium" :class="gem.textClass">
                    {{ gem.name }}
                  </span>
                  <span class="text-xs text-gray-500">
                    Max: {{ gem.maxLevel }}
                  </span>
                </div>
                
                <div class="flex items-center gap-2">
                  <button
                    @click="decrementGem(gem.id)"
                    :disabled="getGemLevel(gem.id) <= 0"
                    class="p-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                  >
                    <IconMinus class="w-4 h-4" />
                  </button>
                  
                  <div class="flex-1 text-center">
                    <span class="text-xl font-bold text-white">
                      {{ getGemLevel(gem.id) }}
                    </span>
                  </div>
                  
                  <button
                    @click="incrementGem(gem.id)"
                    :disabled="getGemLevel(gem.id) >= gem.maxLevel"
                    class="p-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
                  >
                    <IconPlus class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Boosts Tab -->
          <div v-if="activeTab === 'boosts'" class="space-y-6">
            <p class="text-sm text-gray-400">
              Configure your global boost values (maxed boosts). These serve as the baseline for all plans.
            </p>

            <div 
              v-for="category in availableCategories" 
              :key="category.id"
              class="space-y-3"
            >
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                {{ category.label }}
                <span class="text-xs text-gray-500">({{ category.boosts.length }})</span>
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div 
                  v-for="boost in category.boosts" 
                  :key="boost.key"
                  class="bg-gray-900/50 rounded-lg p-3 border border-gray-700"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm text-white">{{ boost.label }}</div>
                      <div v-if="boost.tooltip && typeof boost.tooltip === 'string'" class="text-xs text-gray-500">
                        {{ boost.tooltip }}
                      </div>
                    </div>
                    
                    <!-- Number Input -->
                    <div v-if="boost.type === 'number'" class="flex items-center gap-2">
                      <button
                        @click="decrementBoost(boost.key)"
                        :disabled="getBoostValue(boost.key) <= 0"
                        class="p-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
                      >
                        <IconMinus class="w-3 h-3" />
                      </button>
                      
                      <input
                        :value="getBoostValue(boost.key)"
                        @change="setBoostValue(boost.key, $event.target.value)"
                        type="number"
                        :min="0"
                        :max="boost.max"
                        class="w-20 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-center text-white text-sm"
                      />
                      
                      <button
                        @click="incrementBoost(boost.key, boost.max)"
                        :disabled="boost.max && getBoostValue(boost.key) >= boost.max"
                        class="p-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded"
                      >
                        <IconPlus class="w-3 h-3" />
                      </button>
                    </div>

                    <!-- Boolean Toggle -->
                    <button
                      v-else-if="boost.type === 'boolean'"
                      @click="toggleBoost(boost.key)"
                      class="relative w-12 h-6 rounded-full transition-colors"
                      :class="getBoostValue(boost.key) ? 'bg-cyan-600' : 'bg-gray-600'"
                    >
                      <div 
                        class="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                        :class="getBoostValue(boost.key) ? 'left-6' : 'left-0.5'"
                      ></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Tab -->
          <div v-if="activeTab === 'stats'" class="space-y-4">
            <p class="text-sm text-gray-400">
              Your general progression stats used for calculations.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- TR Count -->
              <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <label class="block text-sm text-gray-400 mb-2">TR Count</label>
                <input
                  :value="getBoostValue('trCount')"
                  @change="setBoostValue('trCount', $event.target.value)"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <!-- All-Time Orbs -->
              <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <label class="block text-sm text-gray-400 mb-2">All-Time Orbs</label>
                <input
                  :value="getBoostValue('allTimeOrbs')"
                  @change="setBoostValue('allTimeOrbs', $event.target.value)"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          <!-- Import/Export Tab -->
          <div v-if="activeTab === 'export'" class="space-y-4">
            <p class="text-sm text-gray-400">
              Export your settings to backup or share, or import from a previous backup.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-white mb-2">Export</h4>
                <button
                  @click="exportSettings"
                  class="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
                >
                  Export All Settings
                </button>
              </div>

              <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 class="text-sm font-medium text-white mb-2">Import</h4>
                <input
                  type="file"
                  @change="importSettings"
                  accept=".json"
                  class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-700 p-4 flex justify-end shrink-0 bg-gray-800">
          <button
            @click="$emit('close')"
            class="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { 
  IconSettings, 
  IconX,
  IconPlus,
  IconMinus,
} from '@tabler/icons-vue';
import { useTRPlannerV2Store } from '@/store/trPlannerV2Store';
import { GEMS } from '../constants/gems';
import { BOOSTS, getBoostsByCategories, isBoostAvailable } from '../constants/boosts';

const emit = defineEmits(['close']);

const store = useTRPlannerV2Store();
const { globalBoosts, globalGems } = storeToRefs(store);

// ============================================
// STATE
// ============================================

const activeTab = ref('gems');

const tabs = [
  { id: 'gems', label: 'Gems' },
  { id: 'boosts', label: 'Boosts' },
  { id: 'stats', label: 'Stats' },
  { id: 'export', label: 'Import/Export' },
];

const gems = GEMS;

// ============================================
// COMPUTED
// ============================================

const gemData = computed(() => {
  const levels = {};
  Object.entries(globalGems.value).forEach(([gemId, data]) => {
    levels[gemId] = data?.level || 0;
  });
  return { levels };
});

const availableCategories = computed(() => {
  return getBoostsByCategories(gemData.value);
});

// ============================================
// METHODS - Gems
// ============================================

function getGemLevel(gemId) {
  return globalGems.value[gemId]?.level || 0;
}

function setGemLevel(gemId, level) {
  const gem = gems.find(g => g.id === gemId);
  if (!gem) return;
  
  const clampedLevel = Math.max(0, Math.min(level, gem.maxLevel));
  
  store.setGlobalGem(gemId, {
    ...globalGems.value[gemId],
    level: clampedLevel,
  });
}

function incrementGem(gemId) {
  setGemLevel(gemId, getGemLevel(gemId) + 1);
}

function decrementGem(gemId) {
  setGemLevel(gemId, getGemLevel(gemId) - 1);
}

// ============================================
// METHODS - Boosts
// ============================================

function getBoostValue(key) {
  return globalBoosts.value[key] || 0;
}

function setBoostValue(key, value) {
  const numValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value;
  store.setGlobalBoost(key, numValue);
}

function incrementBoost(key, max) {
  const current = getBoostValue(key);
  if (!max || current < max) {
    setBoostValue(key, current + 1);
  }
}

function decrementBoost(key) {
  const current = getBoostValue(key);
  if (current > 0) {
    setBoostValue(key, current - 1);
  }
}

function toggleBoost(key) {
  store.setGlobalBoost(key, !globalBoosts.value[key]);
}

// ============================================
// METHODS - Import/Export
// ============================================

function exportSettings() {
  const data = store.exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `tr-planner-v2-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      store.importData(data);
      alert('Settings imported successfully!');
    } catch (error) {
      alert('Failed to import settings: ' + error.message);
    }
  };
  reader.readAsText(file);
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
