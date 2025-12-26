<template>
  <div class="relative">
    <!-- Plan Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-1.5 px-2 py-1 bg-gray-700/60 hover:bg-gray-600/60 rounded text-xs transition-colors border border-gray-600/50"
      :class="{ 'ring-1 ring-purple-500/50': isDropdownOpen }"
    >
      <IconClipboardList size="14" class="text-purple-400" />
      <span class="text-gray-200 max-w-[100px] truncate">
        {{ activePlan?.name || 'New Plan' }}
      </span>
      <IconChevronDown 
        size="14" 
        class="text-gray-400 transition-transform" 
        :class="{ 'rotate-180': isDropdownOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 top-full mt-1 w-64 bg-gray-800 rounded-lg border border-gray-600 shadow-xl z-50 overflow-hidden"
    >
      <!-- Header -->
      <div class="px-3 py-2 bg-gray-700/50 border-b border-gray-600 flex items-center justify-between">
        <span class="text-xs font-semibold text-gray-300">TR Plans</span>
        <button
          @click="showCreateModal = true"
          class="p-1 hover:bg-gray-600 rounded transition-colors"
          title="New Plan"
        >
          <IconPlus size="14" class="text-green-400" />
        </button>
      </div>

      <!-- Plan List -->
      <div class="max-h-64 overflow-y-auto">
        <!-- Plan Items -->
        <div
          v-for="plan in plans"
          :key="plan.id"
          @click="selectPlan(plan.id)"
          class="group px-3 py-2 hover:bg-gray-700/50 transition-colors cursor-pointer"
          :class="{ 'bg-purple-900/30': activePlan?.id === plan.id }"
        >
          <div class="flex items-center justify-between">
            <span class="flex-1 text-left text-xs text-gray-300 truncate">
              {{ plan.name }}
            </span>
            <div class="flex items-center gap-1">
              <button
                @click.stop="startRename(plan)"
                class="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Rename"
              >
                <IconPencil size="12" class="text-gray-400" />
              </button>
              <button
                @click.stop="duplicatePlanFn(plan.id)"
                class="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Duplicate"
              >
                <IconCopy size="12" class="text-gray-400" />
              </button>
              <button
                @click.stop="confirmDelete(plan)"
                class="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <IconTrash size="12" class="text-red-400" />
              </button>
              <IconCheck v-if="activePlan?.id === plan.id" size="14" class="text-purple-400 ml-1" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="plans.length === 0" class="px-3 py-4 text-center text-gray-500 text-xs">
          No plans yet. Create a new plan!
        </div>
      </div>

      <!-- Footer Info -->
      <div class="px-3 py-1.5 bg-gray-700/30 border-t border-gray-600">
        <span class="text-[10px] text-gray-500">Plans store TR Steps and Overrides</span>
      </div>
    </div>

    <!-- Click Outside Handler -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-40"
      @click="isDropdownOpen = false"
    ></div>

    <!-- Create Plan Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        @click.self="showCreateModal = false"
      >
        <div class="bg-gray-800 rounded-lg border border-gray-600 shadow-xl w-80 overflow-hidden">
          <div class="px-4 py-3 bg-gray-700/50 border-b border-gray-600">
            <h3 class="text-sm font-semibold text-white">Create New Plan</h3>
          </div>
          <div class="p-4">
            <input
              ref="createInput"
              v-model="newPlanName"
              @keyup.enter="createNewPlan"
              type="text"
              placeholder="Plan Name..."
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              autofocus
            />
          </div>
          <div class="px-4 py-3 bg-gray-700/30 border-t border-gray-600 flex justify-end gap-2">
            <button
              @click="showCreateModal = false"
              class="px-3 py-1.5 text-gray-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              @click="createNewPlan"
              :disabled="!newPlanName.trim()"
              class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-white transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Rename Plan Modal -->
    <Teleport to="body">
      <div
        v-if="showRenameModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        @click.self="showRenameModal = false"
      >
        <div class="bg-gray-800 rounded-lg border border-gray-600 shadow-xl w-80 overflow-hidden">
          <div class="px-4 py-3 bg-gray-700/50 border-b border-gray-600">
            <h3 class="text-sm font-semibold text-white">Rename Plan</h3>
          </div>
          <div class="p-4">
            <input
              ref="renameInput"
              v-model="renamePlanName"
              @keyup.enter="renamePlanFn"
              type="text"
              placeholder="New Name..."
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              autofocus
            />
          </div>
          <div class="px-4 py-3 bg-gray-700/30 border-t border-gray-600 flex justify-end gap-2">
            <button
              @click="showRenameModal = false"
              class="px-3 py-1.5 text-gray-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              @click="renamePlanFn"
              :disabled="!renamePlanName.trim()"
              class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-white transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-gray-800 rounded-lg border border-gray-600 shadow-xl w-80 overflow-hidden">
          <div class="px-4 py-3 bg-red-900/30 border-b border-gray-600">
            <h3 class="text-sm font-semibold text-white">Delete Plan?</h3>
          </div>
          <div class="p-4">
            <p class="text-sm text-gray-300">
              Are you sure you want to delete <span class="font-semibold text-white">"{{ planToDelete?.name }}"</span>?
            </p>
          </div>
          <div class="px-4 py-3 bg-gray-700/30 border-t border-gray-600 flex justify-end gap-2">
            <button
              @click="showDeleteModal = false"
              class="px-3 py-1.5 text-gray-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deletePlanFn"
              class="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-xs text-white transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { 
  IconClipboardList,
  IconChevronDown,
  IconPlus,
  IconPencil,
  IconCopy,
  IconTrash,
  IconCheck
} from '@tabler/icons-vue';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';

const store = useTRPlannerStore();

// Local state
const isDropdownOpen = ref(false);
const showCreateModal = ref(false);
const showRenameModal = ref(false);
const showDeleteModal = ref(false);
const newPlanName = ref('');
const renamePlanName = ref('');
const planToRename = ref(null);
const planToDelete = ref(null);
const createInput = ref(null);
const renameInput = ref(null);

// Computed from store
const plans = computed(() => store.plans);
const activePlan = computed(() => store.selectedPlan);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function selectPlan(id) {
  store.selectPlan(id);
  isDropdownOpen.value = false;
}

function createNewPlan() {
  if (!newPlanName.value.trim()) return;
  
  store.createPlan(newPlanName.value.trim());
  newPlanName.value = '';
  showCreateModal.value = false;
  isDropdownOpen.value = false;
}

function startRename(plan) {
  planToRename.value = plan;
  renamePlanName.value = plan.name;
  showRenameModal.value = true;
  nextTick(() => renameInput.value?.focus());
}

function renamePlanFn() {
  if (!renamePlanName.value.trim() || !planToRename.value) return;
  
  store.renamePlan(planToRename.value.id, renamePlanName.value.trim());
  
  showRenameModal.value = false;
  planToRename.value = null;
  renamePlanName.value = '';
}

function duplicatePlanFn(id) {
  store.duplicatePlan(id);
  isDropdownOpen.value = false;
}

function confirmDelete(plan) {
  planToDelete.value = plan;
  showDeleteModal.value = true;
}

function deletePlanFn() {
  if (!planToDelete.value) return;
  
  store.deletePlan(planToDelete.value.id);
  
  showDeleteModal.value = false;
  planToDelete.value = null;
}
</script>
