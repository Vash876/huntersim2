<template>
  <div
    v-if="isVisible"
    :class="[
      isEmbedded 
        ? 'relative bg-gray-900/80 rounded-lg shadow-2xl border border-gray-700/50 overflow-hidden' 
        : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    ]"
    @click.self="!isEmbedded && $emit('close')"
  >
    <div 
      :class="[
        'bg-gray-900 rounded-lg shadow-2xl overflow-hidden',
        isEmbedded 
          ? 'w-full' 
          : 'w-full max-w-7xl max-h-[90vh]'
      ]"
    >
      <!-- Header (only show when not embedded) -->
      <div 
        v-if="!isEmbedded"
        class="bg-gradient-to-r from-purple-900 to-blue-800 p-4 border-b border-gray-600"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="@/assets/general/orbs.png" class="w-6 h-6" alt="Orbs" />
            <h2 class="text-xl font-bold text-white">Orb Spending Plans</h2>
          </div>
          <div class="flex items-center space-x-3">
            <!-- Create New Plan Button -->
            <button
              @click="openCreateModal"
              class="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md transition-colors text-white font-medium"
            >
              <IconPlus size="18" />
              <span>New Plan</span>
            </button>
            
            <button
              @click="$emit('close')"
              class="text-gray-300 hover:text-white transition-colors"
            >
              <IconX size="24" />
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div 
        :class="[
          'p-6 overflow-y-auto',
          isEmbedded 
            ? 'max-h-[70vh]' 
            : 'max-h-[calc(90vh-120px)]'
        ]"
      >
        <!-- Empty State -->
        <div v-if="orbSpendingPlans.length === 0" class="text-center py-12">
          <IconFileOff size="64" class="text-gray-500 mx-auto mb-4 opacity-50" />
          <h3 class="text-xl font-semibold text-gray-300 mb-2">No Orb Plans Yet</h3>
          <p class="text-gray-400 mb-6">Create your first orb spending plan to get started</p>
          <button
            @click="openCreateModal"
            class="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors text-white font-medium mx-auto"
          >
            <IconPlus size="20" />
            <span>Create First Plan</span>
          </button>
        </div>

        <!-- Plans Grid -->
        <div v-else>
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">
              Your Plans ({{ orbSpendingPlans.length }})
            </h3>
            <div class="text-sm text-gray-400">
              {{ activePlanCount }} active plan{{ activePlanCount !== 1 ? 's' : '' }}
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <OrbPlanCard
              v-for="plan in orbSpendingPlans"
              :key="plan.id"
              :plan="plan"
              :is-active-plan="activeOrbSpendingPlan?.id === plan.id"
              @load="loadPlan"
              @edit="editPlan"
              @copy="copyPlan"
              @delete="deletePlan"
              @share="sharePlan"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <OrbPlanEditModal
      :is-visible="showEditModal"
      :editing-plan="editingPlan"
      @close="closeEditModal"
      @save="savePlan"
    />

    <!-- Share Modal -->
    <OrbPlanShareModal
      :is-visible="showShareModal"
      :plan="sharingPlan"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  IconX,
  IconPlus,
  IconFileOff
} from '@tabler/icons-vue';
import { useGemPlannerStore } from '@/store/gemPlannerStore.js';
import { useGemPlanningStore } from '@/store/gemPlanningStore.js';
import OrbPlanCard from './OrbPlanCard.vue';
import OrbPlanEditModal from './OrbPlanEditModal.vue';
import OrbPlanShareModal from './OrbPlanShareModal.vue';

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  isEmbedded: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close', 'plan-loaded']);

// Store
const gemPlannerStore = useGemPlannerStore();
const gemPlanningStore = useGemPlanningStore();

// State
const showEditModal = ref(false);
const showShareModal = ref(false);
const editingPlan = ref(null);
const sharingPlan = ref(null);

// Computed
const orbSpendingPlans = computed(() => gemPlanningStore.orbSpendingPlans);
const activeOrbSpendingPlan = computed(() => gemPlanningStore.activeOrbSpendingPlan);

const activePlanCount = computed(() => {
  return activeOrbSpendingPlan.value ? 1 : 0;
});

// Event handler for external create triggers
function handleCreateNewEvent(event) {
  console.log('Received create new plan event');
  openCreateModal();
}

// Lifecycle
onMounted(async () => {
  // Initialize stores
  await gemPlanningStore.init();
  
  document.addEventListener('orbPlannerCreateNew', handleCreateNewEvent);
  console.log('OrbSpendingPlansModal mounted and event listener added');
});

onUnmounted(() => {
  document.removeEventListener('orbPlannerCreateNew', handleCreateNewEvent);
});

// Methods
function openCreateModal() {
  editingPlan.value = null;
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  editingPlan.value = null;
}

async function loadPlan(planId) {
  try {
    const plan = await gemPlanningStore.loadOrbSpendingPlan(planId);
    if (plan) {
      emit('plan-loaded', plan);
      // Only emit close if NOT in embedded mode
      if (!props.isEmbedded) {
        emit('close');
      }
    }
  } catch (error) {
    console.error('Error loading plan:', error);
  }
}

function editPlan(planId) {
  const plan = orbSpendingPlans.value.find(p => p.id === planId);
  if (plan) {
    editingPlan.value = plan;
    showEditModal.value = true;
  }
}

async function copyPlan(planId) {
  try {
    const newPlan = await gemPlanningStore.duplicateOrbSpendingPlan(planId);
    if (newPlan) {
      console.log(`Plan "${newPlan.name}" copied successfully`);
    }
  } catch (error) {
    console.error('Error copying plan:', error);
  }
}

async function deletePlan(planId) {
  const plan = orbSpendingPlans.value.find(p => p.id === planId);
  if (plan && confirm(`Are you sure you want to delete "${plan.name}"? This cannot be undone.`)) {
    try {
      await gemPlanningStore.deleteOrbSpendingPlan(planId);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  }
}

function sharePlan(planId) {
  const plan = orbSpendingPlans.value.find(p => p.id === planId);
  if (plan) {
    sharingPlan.value = plan;
    showShareModal.value = true;
  }
}

function closeShareModal() {
  showShareModal.value = false;
  sharingPlan.value = null;
}

async function savePlan(planData) {
  try {
    if (editingPlan.value) {
      // Update existing plan
      await gemPlanningStore.updateOrbSpendingPlan(editingPlan.value.id, planData);
    } else {
      // Create new plan
      const newPlan = await gemPlanningStore.createOrbSpendingPlan(
        planData.name,
        planData.trPlanId || null,
        planData.initialBudget,
        planData.trCount
      );
      
      // Update description if provided
      if (planData.description) {
        await gemPlanningStore.updateOrbSpendingPlan(newPlan.id, { 
          description: planData.description 
        });
      }
    }
    
    closeEditModal();
  } catch (error) {
    console.error('Error saving plan:', error);
  }
}
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
