<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-purple-500/30">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <IconInfinity class="w-8 h-8 text-purple-400" />
            <div>
              <h1 class="text-2xl font-bold text-white">TR Planner 2.0</h1>
              <p class="text-sm text-purple-300">Plan your Traversal Resets</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Global Settings Button -->
            <button 
              @click="openGlobalSettings"
              class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <IconSettings class="w-4 h-4" />
              <span class="hidden sm:inline">Settings</span>
            </button>
            
            <!-- New Plan Button -->
            <button 
              @click="createNewPlan"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-2"
            >
              <IconPlus class="w-4 h-4" />
              <span>New Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- No Plans State -->
      <div 
        v-if="plans.length === 0"
        class="flex flex-col items-center justify-center py-20"
      >
        <IconInfinity class="w-16 h-16 text-gray-600 mb-4" />
        <h2 class="text-xl font-semibold text-gray-400 mb-2">No TR Plans Yet</h2>
        <p class="text-gray-500 mb-6 text-center max-w-md">
          Create your first TR plan to start optimizing your Traversal Resets.
          Set up your global boosts first, then create plans for different scenarios.
        </p>
        <div class="flex gap-3">
          <button 
            @click="openGlobalSettings"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <IconSettings class="w-4 h-4" />
            Set Up Global Boosts
          </button>
          <button 
            @click="createNewPlan"
            class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-2"
          >
            <IconPlus class="w-4 h-4" />
            Create First Plan
          </button>
        </div>
      </div>

      <!-- Plans Grid -->
      <div v-else>
        <!-- Stats Summary -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div class="text-sm text-gray-400">Total Plans</div>
            <div class="text-2xl font-bold text-white">{{ plans.length }}</div>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div class="text-sm text-gray-400">Active Gems</div>
            <div class="text-2xl font-bold text-purple-400">{{ activeGemCount }}</div>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div class="text-sm text-gray-400">Global Boosts</div>
            <div class="text-2xl font-bold text-cyan-400">{{ globalBoostCount }}</div>
          </div>
          <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div class="text-sm text-gray-400">TR Count</div>
            <div class="text-2xl font-bold text-green-400">{{ globalBoosts.trCount || 0 }}</div>
          </div>
        </div>

        <!-- Plans List -->
        <div class="space-y-4">
          <Draggable
            v-model="sortedPlans"
            handle=".drag-handle"
            item-key="id"
            :animation="200"
            @end="onDragEnd"
          >
            <template #item="{ element: plan }">
              <PlanCard
                :plan="plan"
                @edit="editPlan(plan.id)"
                @duplicate="duplicatePlan(plan.id)"
                @delete="confirmDeletePlan(plan.id)"
              />
            </template>
          </Draggable>
        </div>
      </div>
    </div>

    <!-- Global Settings Modal -->
    <GlobalSettingsModal
      v-if="showGlobalSettings"
      @close="showGlobalSettings = false"
    />

    <!-- Plan Modal -->
    <PlanModal
      v-if="showPlanModal"
      :plan-id="editingPlanId"
      @close="closePlanModal"
      @saved="onPlanSaved"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      title="Delete Plan"
      message="Are you sure you want to delete this plan? This action cannot be undone."
      confirm-text="Delete"
      confirm-class="bg-red-600 hover:bg-red-500"
      @confirm="deletePlan"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Toast Notifications -->
    <div 
      v-if="toast.show"
      class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in"
      :class="{
        'bg-green-600': toast.type === 'success',
        'bg-red-600': toast.type === 'error',
        'bg-blue-600': toast.type === 'info',
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import Draggable from 'vuedraggable';
import { 
  IconInfinity, 
  IconSettings, 
  IconPlus,
} from '@tabler/icons-vue';
import { useTRPlannerV2Store } from '@/store/trPlannerV2Store';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import PlanCard from './components/PlanCard.vue';
import PlanModal from './components/PlanModal.vue';
import GlobalSettingsModal from './components/GlobalSettingsModal.vue';
import ConfirmModal from './components/ConfirmModal.vue';

// ============================================
// STORES
// ============================================

const trPlannerStore = useTRPlannerV2Store();
const gemPlannerStore = useGemPlannerStore();

const { plans, sortedPlans, globalBoosts, globalGems } = storeToRefs(trPlannerStore);

// ============================================
// STATE
// ============================================

const showGlobalSettings = ref(false);
const showPlanModal = ref(false);
const showDeleteConfirm = ref(false);
const editingPlanId = ref(null);
const deletingPlanId = ref(null);

const toast = ref({
  show: false,
  message: '',
  type: 'info',
});

// ============================================
// COMPUTED
// ============================================

const activeGemCount = computed(() => {
  return Object.values(globalGems.value).filter(g => g && g.level > 0).length;
});

const globalBoostCount = computed(() => {
  return Object.keys(globalBoosts.value).filter(k => {
    const v = globalBoosts.value[k];
    return v !== 0 && v !== false && v !== null && v !== undefined;
  }).length;
});

// ============================================
// METHODS
// ============================================

function openGlobalSettings() {
  showGlobalSettings.value = true;
}

function createNewPlan() {
  editingPlanId.value = null;
  showPlanModal.value = true;
}

function editPlan(planId) {
  editingPlanId.value = planId;
  showPlanModal.value = true;
}

function duplicatePlan(planId) {
  const newPlanId = trPlannerStore.duplicatePlan(planId);
  if (newPlanId) {
    showToast('Plan duplicated successfully', 'success');
  }
}

function confirmDeletePlan(planId) {
  deletingPlanId.value = planId;
  showDeleteConfirm.value = true;
}

function deletePlan() {
  if (deletingPlanId.value) {
    trPlannerStore.deletePlan(deletingPlanId.value);
    showToast('Plan deleted', 'success');
  }
  showDeleteConfirm.value = false;
  deletingPlanId.value = null;
}

function closePlanModal() {
  showPlanModal.value = false;
  editingPlanId.value = null;
}

function onPlanSaved() {
  closePlanModal();
  showToast('Plan saved successfully', 'success');
}

function onDragEnd() {
  const newOrder = sortedPlans.value.map(p => p.id);
  trPlannerStore.reorderPlans(newOrder);
}

function showToast(message, type = 'info', duration = 3000) {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// ============================================
// LIFECYCLE
// ============================================

onMounted(() => {
  // Sync gem data from gemPlannerStore on mount
  if (gemPlannerStore.gemStates && Object.keys(gemPlannerStore.gemStates).length > 0) {
    const convertedGems = {};
    Object.entries(gemPlannerStore.gemStates).forEach(([gemId, state]) => {
      if (state) {
        convertedGems[gemId] = {
          level: state.level || 0,
          nodes: state.nodes || [],
          upgrades: state.upgrades || {},
        };
      }
    });
    trPlannerStore.updateGlobalGems(convertedGems);
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
