<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-green-900/20">
        <div class="flex items-center">
          <IconCalendarPlus size="24" class="text-blue-400 mr-3" />
          <div>
            <h2 class="text-xl font-bold text-white">Add Daily Entry</h2>
            <p class="text-sm text-gray-400">{{ plan.name }} - Day {{ (plan.daysActive || 0) + 1 }}</p>
          </div>
        </div>
        
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors"
        >
          <IconX size="24" />
        </button>
      </div>

      <!-- Form Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <form @submit.prevent="submitEntry">
          <!-- Current Status Display -->
          <div class="bg-gray-850 rounded-lg p-4 mb-6">
            <h3 class="font-semibold text-white mb-3">Current Progress</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div class="text-center">
                <div class="text-lg font-bold text-blue-400">{{ formatNumber(plan.resources?.cells?.current || 0) }}</div>
                <div class="text-gray-400">Cells</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-purple-400">{{ formatNumber(plan.resources?.mp?.current || 0) }}</div>
                <div class="text-gray-400">MP</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-yellow-400">{{ formatNumber(plan.resources?.shards?.current || 0) }}</div>
                <div class="text-gray-400">Shards</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-green-400">{{ formatNumber(plan.resources?.rp?.current || 0) }}</div>
                <div class="text-gray-400">RP</div>
              </div>
            </div>
          </div>

          <!-- Resource Inputs -->
          <div class="space-y-6">
            <!-- Time Tracking -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Hours in TR Today</label>
                <input
                  v-model.number="form.hoursInTR"
                  type="number"
                  step="0.1"
                  min="0"
                  max="24"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="8.5"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Camp Timer (if applicable)</label>
                <input
                  v-model="form.campTimer"
                  type="text"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2h 30m"
                />
              </div>
            </div>

            <!-- Main Resources -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  <IconCoin class="inline w-4 h-4 mr-1" />
                  OO
                </label>
                <input
                  v-model.number="form.oo"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current OO"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  <IconAtom class="inline w-4 h-4 mr-1" />
                  Cells
                </label>
                <input
                  v-model.number="form.cells"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current Cells"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  <IconFlask class="inline w-4 h-4 mr-1" />
                  MP
                </label>
                <input
                  v-model.number="form.mp"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current MP"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  <IconDiamond class="inline w-4 h-4 mr-1" />
                  Shards
                </label>
                <input
                  v-model.number="form.shards"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current Shards"
                />
              </div>
            </div>

            <!-- Additional Resources -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">RP</label>
                <input
                  v-model.number="form.rp"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current RP"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">AP</label>
                <input
                  v-model.number="form.ap"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current AP"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Blueprints</label>
                <input
                  v-model.number="form.blueprints"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current Blueprints"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Frags</label>
                <input
                  v-model.number="form.frags"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current Frags"
                />
              </div>
            </div>

            <!-- Advanced Resources -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">F1-1 Difar</label>
                <input
                  v-model.number="form.f1_1_difar"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current F1-1 Difar"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Inno Cores</label>
                <input
                  v-model.number="form.inno_cores"
                  type="number"
                  min="0"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current Inno Cores"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Camp</label>
                <input
                  v-model="form.camp"
                  type="text"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Current Camp"
                />
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any notes about today's progress..."
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-850">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        
        <button
          @click="submitEntry"
          :disabled="isSubmitting"
          class="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <IconLoader2 v-if="isSubmitting" size="16" class="mr-2 animate-spin" />
          <IconCheck v-else size="16" class="mr-2" />
          <span>{{ isSubmitting ? 'Adding...' : 'Add Entry' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { 
  IconCalendarPlus, 
  IconX, 
  IconCheck, 
  IconLoader2,
  IconCoin,
  IconAtom,
  IconFlask,
  IconDiamond
} from '@tabler/icons-vue';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  plan: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['close', 'submitted']);

// State
const isSubmitting = ref(false);

const form = reactive({
  hoursInTR: '',
  oo: '',
  cells: '',
  mp: '',
  shards: '',
  rp: '',
  ap: '',
  blueprints: '',
  f1_1_difar: '',
  inno_cores: '',
  frags: '',
  camp: '',
  campTimer: '',
  notes: ''
});

// Methods
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

async function submitEntry() {
  isSubmitting.value = true;
  
  try {
    // Prepare entry data
    const entryData = {
      'Hours in TR': form.hoursInTR || 0,
      'OO': form.oo || '',
      'Cells': form.cells || '',
      'MP': form.mp || '',
      'Shards': form.shards || '',
      'RP': form.rp || '',
      'AP': form.ap || '',
      'Blueprints': form.blueprints || '',
      'F1-1 Difar': form.f1_1_difar || '',
      'Inno Cores': form.inno_cores || '',
      'Frags': form.frags || '',
      'Camp': form.camp || '',
      'Camp Timer': form.campTimer || '',
      'Notes': form.notes || ''
    };
    
    console.log('Submitting entry data:', entryData);
    
    emit('submitted', entryData);
  } catch (error) {
    console.error('Error submitting entry:', error);
    alert('Failed to submit entry: ' + error.message);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
}
</style>