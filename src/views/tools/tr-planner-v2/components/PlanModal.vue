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
        <div class="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <IconInfinity class="w-5 h-5 text-purple-400" />
            {{ isEditing ? 'Edit Plan' : 'New TR Plan' }}
          </h2>
          <button 
            @click="$emit('close')" 
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4 space-y-6">
          <!-- Basic Info -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Basic Info</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Plan Name -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">Plan Name</label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                  placeholder="My TR Plan"
                />
              </div>

              <!-- TR Count -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">Starting TR Count</label>
                <input
                  v-model.number="formData.trCount"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                />
              </div>

              <!-- Start Date -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">Start Date</label>
                <input
                  v-model="formData.startDate"
                  type="date"
                  class="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                />
              </div>

              <!-- Start Time -->
              <div>
                <label class="block text-sm text-gray-400 mb-1">Start Time</label>
                <input
                  v-model="formData.startTime"
                  type="time"
                  class="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                />
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm text-gray-400 mb-1">Notes (optional)</label>
              <textarea
                v-model="formData.notes"
                rows="2"
                class="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white resize-none"
                placeholder="Add notes about this plan..."
              ></textarea>
            </div>
          </div>

          <!-- TR Steps -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">TR Steps</h3>
              <button
                @click="addStep"
                class="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-1"
              >
                <IconPlus class="w-4 h-4" />
                Add Step
              </button>
            </div>

            <div class="space-y-3">
              <div 
                v-for="(step, index) in formData.steps" 
                :key="index"
                class="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="text-sm font-medium text-purple-400">
                    TR Step {{ index + 1 }}
                  </div>
                  <button
                    v-if="formData.steps.length > 1"
                    @click="removeStep(index)"
                    class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <IconTrash class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Hours in TR -->
                  <div>
                    <label class="block text-xs text-gray-400 mb-1">Hours in TR</label>
                    <input
                      v-model.number="step.hoursInTR"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                    />
                  </div>

                  <!-- Target Boosts Count -->
                  <div class="flex items-end">
                    <button
                      @click="openBoostSelector(index)"
                      class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors text-left flex items-center justify-between"
                    >
                      <span class="text-white">
                        {{ Object.keys(step.targetBoosts || {}).length }} target boosts
                      </span>
                      <IconChevronRight class="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Plan Overrides (optional) -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Plan Overrides
                <span class="text-xs font-normal text-gray-500 ml-2">(deviations from global settings)</span>
              </h3>
            </div>

            <div class="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-orange-400">
                    {{ Object.keys(formData.overrides?.gems || {}).length }}
                  </div>
                  <div class="text-xs text-gray-400">Gem Overrides</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-cyan-400">
                    {{ Object.keys(formData.overrides?.boosts || {}).length }}
                  </div>
                  <div class="text-xs text-gray-400">Boost Overrides</div>
                </div>
              </div>
              
              <button
                @click="openOverridesEditor"
                class="mt-4 w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors flex items-center justify-center gap-2"
              >
                <IconAdjustments class="w-4 h-4" />
                Edit Overrides
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-700 p-4 flex justify-between items-center shrink-0 bg-gray-800">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            @click="savePlan"
            :disabled="!isValid"
            class="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
          >
            <IconCheck class="w-4 h-4" />
            {{ isEditing ? 'Update Plan' : 'Create Plan' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { 
  IconInfinity, 
  IconX, 
  IconPlus, 
  IconTrash,
  IconChevronRight,
  IconAdjustments,
  IconCheck,
} from '@tabler/icons-vue';
import { useTRPlannerV2Store } from '@/store/trPlannerV2Store';

const props = defineProps({
  planId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);

const store = useTRPlannerV2Store();

// ============================================
// STATE
// ============================================

const formData = ref({
  name: '',
  trCount: 0,
  allTimeOrbs: 0,
  startDate: new Date().toISOString().split('T')[0],
  startTime: '12:00',
  notes: '',
  steps: [
    {
      hoursInTR: 24,
      targetBoosts: {},
      enabledGemBoosts: [],
    },
  ],
  overrides: {
    gems: {},
    boosts: {},
  },
});

// ============================================
// COMPUTED
// ============================================

const isEditing = computed(() => !!props.planId);

const isValid = computed(() => {
  return formData.value.name.trim().length > 0 &&
         formData.value.steps.length > 0 &&
         formData.value.steps.every(s => s.hoursInTR > 0);
});

// ============================================
// METHODS
// ============================================

function addStep() {
  formData.value.steps.push({
    hoursInTR: 24,
    targetBoosts: {},
    enabledGemBoosts: [],
  });
}

function removeStep(index) {
  if (formData.value.steps.length > 1) {
    formData.value.steps.splice(index, 1);
  }
}

function openBoostSelector(stepIndex) {
  // TODO: Open boost selector modal for this step
  console.log('Open boost selector for step', stepIndex);
}

function openOverridesEditor() {
  // TODO: Open overrides editor modal
  console.log('Open overrides editor');
}

function savePlan() {
  if (!isValid.value) return;

  if (isEditing.value) {
    store.updatePlan(props.planId, formData.value);
  } else {
    store.createPlan(formData.value);
  }

  emit('saved');
}

function loadPlanData() {
  if (props.planId) {
    const plan = store.getPlanById(props.planId);
    if (plan) {
      formData.value = JSON.parse(JSON.stringify(plan));
    }
  }
}

// ============================================
// LIFECYCLE
// ============================================

onMounted(() => {
  loadPlanData();
});

watch(() => props.planId, () => {
  loadPlanData();
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
