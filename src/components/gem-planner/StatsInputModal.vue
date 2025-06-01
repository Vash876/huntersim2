<template>
  <div 
    v-if="isVisible"
    class="fixed inset-0 z-[150] overflow-y-auto bg-gray-900/90 flex items-center justify-center p-2 sm:p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-blue-900 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-sm sm:text-base font-semibold text-white flex items-center">
            <IconChartBar size="18" class="mr-2 text-blue-400" />
            Current Stats
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="$emit('close')"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Form -->
      <div class="p-4">
        <div class="space-y-4">
          <!-- Gem Dust -->
          <div class="bg-gray-750/60 rounded-md p-3 border border-gray-700">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-purple-900/50 text-purple-300">
                    <IconZodiacGemini size="18" />
                  </div>
                  Gem Dust
                </div>
              </label>
              <ToolValueControls
                :value="stats.gemDust"
                :minValue="0"
                :maxValue="1000000"
                :step="100"
                :fastStep="1000"
                :validateOnFinalOnly="true"
                @update:value="updateStat('gemDust', $event)"
                value-class="text-amber-400 font-medium"
                :autoEdit="true"
              />
            </div>
            <div class="mt-2 text-xs text-gray-400">
              The total amount of Gem Dust available to spend on upgrades.
            </div>
          </div>

          <!-- RP Multiplier -->
          <div class="bg-gray-750/60 rounded-md p-3 border border-gray-700">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-orange-900/50 text-orange-300">
                    <IconHome size="18" />
                  </div>
                  RP Multiplier
                </div>
              </label>
              <ToolValueControls
                :value="stats.rpMultiplier"
                :minValue="1"
                :maxValue="1000"
                :step="0.1"
                :fastStep="1"
                :validateOnFinalOnly="true"
                @update:value="updateStat('rpMultiplier', $event)"
                value-class="text-orange-400 font-medium"
                :autoEdit="true"
                append="×"
              />
            </div>
            <div class="mt-2 text-xs text-gray-400">
              Your current base RP multiplier before gem bonuses.
            </div>
          </div>

          <!-- MP Multiplier -->
          <div class="bg-gray-750/60 rounded-md p-3 border border-gray-700">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-red-900/50 text-red-300">
                    <IconHome size="18" />
                  </div>
                  MP Multiplier
                </div>
              </label>
              <ToolValueControls
                :value="stats.mpMultiplier"
                :minValue="1"
                :maxValue="1000"
                :step="0.1"
                :fastStep="1"
                :validateOnFinalOnly="true"
                @update:value="updateStat('mpMultiplier', $event)"
                value-class="text-red-400 font-medium"
                :autoEdit="true"
                append="×"
              />
            </div>
            <div class="mt-2 text-xs text-gray-400">
              Your current base MP multiplier before gem bonuses.
            </div>
          </div>

          <!-- Cell Multiplier -->
          <div class="bg-gray-750/60 rounded-md p-3 border border-gray-700">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-green-900/50 text-green-300">
                    <IconHome size="18" />
                  </div>
                  Cell Multiplier
                </div>
              </label>
              <ToolValueControls
                :value="stats.cellMultiplier"
                :minValue="1"
                :maxValue="1000"
                :step="0.1"
                :fastStep="1"
                :validateOnFinalOnly="true"
                @update:value="updateStat('cellMultiplier', $event)"
                value-class="text-green-400 font-medium"
                :autoEdit="true"
                append="×"
              />
            </div>
            <div class="mt-2 text-xs text-gray-400">
              Your current base Cell multiplier before gem bonuses.
            </div>
          </div>

          <!-- Shard Multiplier -->
          <div v-if="showGemStats" class="bg-gray-750/60 rounded-md p-3 border border-gray-700">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-blue-900/50 text-blue-300">
                    <IconHome size="18" />
                  </div>
                  Shard Multiplier
                </div>
              </label>
              <ToolValueControls
                :value="stats.shardMultiplier"
                :minValue="1"
                :maxValue="1000"
                :step="0.1"
                :fastStep="1"
                :validateOnFinalOnly="true"
                @update:value="updateStat('shardMultiplier', $event)"
                value-class="text-blue-400 font-medium"
                :autoEdit="true"
                append="×"
              />
            </div>
            <div class="mt-2 text-xs text-gray-400">
              Your current base Shard multiplier before gem bonuses.
            </div>
          </div>
        </div>
      </div>

      <!-- Projected Totals -->
      <div class="p-4 border-t border-gray-700 bg-gray-750/30">
        <h3 class="text-sm font-medium mb-2">Projected Total Multipliers</h3>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div class="bg-gray-800/50 rounded p-2 text-center">
            <div class="text-xs text-gray-400">RP Total</div>
            <div class="text-orange-400 font-semibold">×{{ formatMultiplier(projectedTotals.rp) }}</div>
          </div>
          
          <div class="bg-gray-800/50 rounded p-2 text-center">
            <div class="text-xs text-gray-400">MP Total</div>
            <div class="text-red-400 font-semibold">×{{ formatMultiplier(projectedTotals.mp) }}</div>
          </div>
          
          <div class="bg-gray-800/50 rounded p-2 text-center">
            <div class="text-xs text-gray-400">Cell Total</div>
            <div class="text-green-400 font-semibold">×{{ formatMultiplier(projectedTotals.cell) }}</div>
          </div>
          
          <div class="bg-gray-800/50 rounded p-2 text-center" v-if="showGemStats">
            <div class="text-xs text-gray-400">Shard Total</div>
            <div class="text-blue-400 font-semibold">×{{ formatMultiplier(projectedTotals.shard) }}</div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0">
        <div class="flex justify-end gap-2">
          <button
            @click="$emit('close')"
            class="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm"
          >
            Cancel
          </button>
          
          <button
            @click="saveStats"
            class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm"
          >
            Save Stats
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  IconChartBar, 
  IconX, 
  IconZodiacGemini, 
  IconHome, 
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  currentStats: {
    type: Object,
    default: () => ({
      gemDust: 0,
      rpMultiplier: 1,
      mpMultiplier: 1,
      cellMultiplier: 1,
      shardMultiplier: 1
    })
  },
  gemBoosts: {
    type: Object,
    default: () => ({
      rp: 1,
      mp: 1,
      cell: 1,
      shard: 1
    })
  },
  showGemStats: {
    type: Boolean,
    default: true
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// Local state
const stats = ref({ ...props.currentStats });

// Computed
const projectedTotals = computed(() => {
  const gemBoosts = props.gemBoosts || { rp: 1, mp: 1, cell: 1, shard: 1 };
  
  return {
    rp: stats.value.rpMultiplier * gemBoosts.rp,
    mp: stats.value.mpMultiplier * gemBoosts.mp,
    cell: stats.value.cellMultiplier * gemBoosts.cell,
    shard: stats.value.shardMultiplier * gemBoosts.shard
  };
});

// Methods
function updateStat(key, value) {
  stats.value[key] = value;
}

function saveStats() {
  emit('save', { ...stats.value });
}

function formatMultiplier(value) {
  return value.toFixed(2);
}

// Initialize
onMounted(() => {
  stats.value = { ...props.currentStats };
});
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

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