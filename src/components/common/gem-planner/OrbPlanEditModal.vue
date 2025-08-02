<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-900 to-blue-800 p-4 border-b border-gray-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="@/assets/general/orbs.png" class="w-6 h-6" alt="Orbs" />
            <h2 class="text-xl font-bold text-white">
              {{ editingPlan ? 'Edit Orb Plan' : 'Create Orb Plan' }}
            </h2>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-300 hover:text-white transition-colors"
          >
            <IconX size="24" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <form @submit.prevent="savePlan">
          <!-- Plan Name -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Plan Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Enter plan name..."
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <!-- Number of TRs -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Number of TRs *
            </label>
            <input
              v-model.number="formData.trCount"
              type="number"
              min="1"
              max="100"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <p class="text-xs text-gray-400 mt-1">How many TRs will this plan cover?</p>
          </div>

          <!-- Budget per TR -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Budget per TR (Orbs) *
            </label>
            <input
              v-model.number="formData.initialBudget"
              type="number"
              min="0"
              step="1000000"
              placeholder="e.g., 1000000000 for 1B orbs"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <p class="text-xs text-gray-400 mt-1">
              Budget: {{ formatBudget(formData.initialBudget) }} orbs per TR
              (Total: {{ formatBudget(formData.initialBudget * formData.trCount) }} orbs)
            </p>
          </div>

          <!-- TR Plan Association (optional) -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Link to TR Plan (Optional)
            </label>
            <select
              v-model="formData.trPlanId"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">No TR Plan Link</option>
              <option
                v-for="trPlan in availableTRPlans"
                :key="trPlan.id"
                :value="trPlan.id"
              >
                {{ trPlan.name }}
              </option>
            </select>
            <p class="text-xs text-gray-400 mt-1">
              Link this orb plan to a specific TR plan for integration
            </p>
          </div>

          <!-- Plan Description (optional) -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Add notes about this orb spending plan..."
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-md transition-colors text-white font-medium"
            >
              <IconDeviceFloppy size="18" />
              <span>{{ editingPlan ? 'Update Plan' : 'Create Plan' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import {
  IconX,
  IconDeviceFloppy
} from '@tabler/icons-vue';

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  editingPlan: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// State
const formData = ref({
  name: '',
  trCount: 5,
  initialBudget: 1000000000, // 1B default
  trPlanId: '',
  description: ''
});

const availableTRPlans = ref([]); // Will be populated from TR Planner store

// Computed
const isFormValid = computed(() => {
  return formData.value.name.trim() && 
         formData.value.trCount > 0 && 
         formData.value.initialBudget >= 0;
});

// Methods
function formatBudget(budget) {
  if (!budget) return '0';
  if (budget >= 1e12) return (budget / 1e12).toFixed(1) + 'T';
  if (budget >= 1e9) return (budget / 1e9).toFixed(1) + 'B';
  if (budget >= 1e6) return (budget / 1e6).toFixed(1) + 'M';
  if (budget >= 1e3) return (budget / 1e3).toFixed(1) + 'K';
  return budget.toString();
}

function resetForm() {
  formData.value = {
    name: '',
    trCount: 5,
    initialBudget: 1000000000,
    trPlanId: '',
    description: ''
  };
}

function loadPlanData(plan) {
  if (plan) {
    formData.value = {
      name: plan.name,
      trCount: plan.trCount,
      initialBudget: plan.initialBudget,
      trPlanId: plan.trPlanId || '',
      description: plan.description || ''
    };
  } else {
    resetForm();
  }
}

function savePlan() {
  if (!isFormValid.value) return;

  const planData = {
    ...formData.value,
    name: formData.value.name.trim(),
    description: formData.value.description.trim()
  };

  emit('save', planData);
}

async function loadTRPlans() {
  try {
    // Import TR Planner store to get available plans
    const { useTRPlannerStore } = await import('@/store/orbStore');
    const trPlannerStore = useTRPlannerStore();
    availableTRPlans.value = trPlannerStore.trPlans || [];
  } catch (error) {
    console.error('Error loading TR plans:', error);
    availableTRPlans.value = [];
  }
}

// Watchers
watch(() => props.editingPlan, (newPlan) => {
  loadPlanData(newPlan);
}, { immediate: true });

watch(() => props.isVisible, (visible) => {
  if (visible) {
    loadTRPlans();
    if (!props.editingPlan) {
      resetForm();
    }
  }
});

// Lifecycle
onMounted(() => {
  loadTRPlans();
});
</script>

<style scoped>
/* Custom scrollbar for better appearance */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>
