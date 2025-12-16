<template>
  <div class="relative">
    <!-- Profile Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-1.5 px-2 py-1 bg-gray-700/60 hover:bg-gray-600/60 rounded text-xs transition-colors border border-gray-600/50"
      :class="{ 'ring-1 ring-purple-500/50': isDropdownOpen }"
    >
      <IconUser size="14" class="text-purple-400" />
      <span class="text-gray-200 max-w-[100px] truncate">
        {{ activeProfile?.name || 'Default' }}
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
        <span class="text-xs font-semibold text-gray-300">Modifier Profiles</span>
        <button
          @click="showCreateModal = true"
          class="p-1 hover:bg-gray-600 rounded transition-colors"
          title="New Profile"
        >
          <IconPlus size="14" class="text-green-400" />
        </button>
      </div>

      <!-- Profile List -->
      <div class="max-h-64 overflow-y-auto">
        <!-- Profile Items -->
        <div
          v-for="profile in profiles"
          :key="profile.id"
          @click="selectProfile(profile.id)"
          class="group px-3 py-2 hover:bg-gray-700/50 transition-colors cursor-pointer"
          :class="{ 'bg-purple-900/30': activeProfile?.id === profile.id }"
        >
          <div class="flex items-center justify-between">
            <span class="flex-1 text-left text-xs text-gray-300 truncate">
              {{ profile.name }}
            </span>
            <div class="flex items-center gap-1">
              <!-- Actions only visible on hover, except for active indicator -->
              <template v-if="!isDefaultProfile(profile.id)">
                <button
                  @click.stop="startRename(profile)"
                  class="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Rename"
                >
                  <IconPencil size="12" class="text-gray-400" />
                </button>
              </template>
              <button
                @click.stop="duplicateProfile(profile.id)"
                class="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Duplicate"
              >
                <IconCopy size="12" class="text-gray-400" />
              </button>
              <template v-if="!isDefaultProfile(profile.id)">
                <button
                  @click.stop="confirmDelete(profile)"
                  class="p-1 hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <IconTrash size="12" class="text-red-400" />
                </button>
              </template>
              <IconCheck v-if="activeProfile?.id === profile.id" size="14" class="text-purple-400 ml-1" />
            </div>
          </div>
        </div>

        <!-- Empty State (should not happen with default profile) -->
        <div v-if="profiles.length === 0" class="px-3 py-4 text-center text-gray-500 text-xs">
          No profiles found.
        </div>
      </div>

      <!-- Footer Info -->
      <div class="px-3 py-1.5 bg-gray-700/30 border-t border-gray-600">
        <span class="text-[10px] text-gray-500">Mission Modifiers, Fill Order & Relic Current and Target Levels are saved per profile</span>
      </div>
    </div>

    <!-- Click Outside Handler -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-40"
      @click="isDropdownOpen = false"
    ></div>

    <!-- Create Profile Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        @click.self="showCreateModal = false"
      >
        <div class="bg-gray-800 rounded-lg border border-gray-600 shadow-xl w-80 overflow-hidden">
          <div class="px-4 py-3 bg-gray-700/50 border-b border-gray-600">
            <h3 class="text-sm font-semibold text-white">Create New Profile</h3>
          </div>
          <div class="p-4">
            <input
              ref="createInput"
              v-model="newProfileName"
              @keyup.enter="createNewProfile"
              type="text"
              placeholder="Profile name..."
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
              @click="createNewProfile"
              :disabled="!newProfileName.trim()"
              class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-white transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Rename Profile Modal -->
    <Teleport to="body">
      <div
        v-if="showRenameModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
        @click.self="showRenameModal = false"
      >
        <div class="bg-gray-800 rounded-lg border border-gray-600 shadow-xl w-80 overflow-hidden">
          <div class="px-4 py-3 bg-gray-700/50 border-b border-gray-600">
            <h3 class="text-sm font-semibold text-white">Rename Profile</h3>
          </div>
          <div class="p-4">
            <input
              ref="renameInput"
              v-model="renameProfileName"
              @keyup.enter="confirmRename"
              type="text"
              placeholder="New name..."
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
              @click="confirmRename"
              :disabled="!renameProfileName.trim()"
              class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs text-white transition-colors"
            >
              Rename
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
            <h3 class="text-sm font-semibold text-white">Delete Profile</h3>
          </div>
          <div class="p-4">
            <p class="text-sm text-gray-300">
              Are you sure you want to delete "<span class="text-white font-medium">{{ profileToDelete?.name }}</span>"?
            </p>
            <p class="text-xs text-gray-500 mt-2">This action cannot be undone.</p>
          </div>
          <div class="px-4 py-3 bg-gray-700/30 border-t border-gray-600 flex justify-end gap-2">
            <button
              @click="showDeleteModal = false"
              class="px-3 py-1.5 text-gray-400 hover:text-white text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmDeleteProfile"
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
import { ref, computed, nextTick, watch } from 'vue';
import { 
  IconUser, IconChevronDown, IconPlus, IconCheck, IconPencil, 
  IconCopy, IconTrash 
} from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';

const missionPlannerStore = useMissionPlannerStore();

// Dropdown state
const isDropdownOpen = ref(false);

// Modal states
const showCreateModal = ref(false);
const showRenameModal = ref(false);
const showDeleteModal = ref(false);

// Input refs
const createInput = ref(null);
const renameInput = ref(null);

// Form data
const newProfileName = ref('');
const renameProfileName = ref('');
const profileToRename = ref(null);
const profileToDelete = ref(null);

// Computed
const profiles = computed(() => missionPlannerStore.getProfiles());
const activeProfile = computed(() => missionPlannerStore.getActiveProfile());

// Focus input when modals open
watch(showCreateModal, (val) => {
  if (val) {
    nextTick(() => createInput.value?.focus());
  }
});

watch(showRenameModal, (val) => {
  if (val) {
    nextTick(() => renameInput.value?.focus());
  }
});

// Functions
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function isDefaultProfile(profileId) {
  return missionPlannerStore.isDefaultProfile(profileId);
}

function selectProfile(profileId) {
  if (activeProfile.value?.id === profileId) {
    isDropdownOpen.value = false;
    return;
  }
  
  missionPlannerStore.loadProfile(profileId);
  isDropdownOpen.value = false;
}

function createNewProfile() {
  if (!newProfileName.value.trim()) return;
  
  const profile = missionPlannerStore.createProfile(newProfileName.value.trim());
  missionPlannerStore.loadProfile(profile.id);
  
  newProfileName.value = '';
  showCreateModal.value = false;
  isDropdownOpen.value = false;
}

function startRename(profile) {
  profileToRename.value = profile;
  renameProfileName.value = profile.name;
  showRenameModal.value = true;
}

function confirmRename() {
  if (!renameProfileName.value.trim() || !profileToRename.value) return;
  
  missionPlannerStore.renameProfile(profileToRename.value.id, renameProfileName.value.trim());
  
  showRenameModal.value = false;
  profileToRename.value = null;
  renameProfileName.value = '';
}

function duplicateProfile(profileId) {
  missionPlannerStore.duplicateProfile(profileId);
}

function confirmDelete(profile) {
  profileToDelete.value = profile;
  showDeleteModal.value = true;
}

function confirmDeleteProfile() {
  if (!profileToDelete.value) return;
  
  missionPlannerStore.deleteProfile(profileToDelete.value.id);
  
  showDeleteModal.value = false;
  profileToDelete.value = null;
}
</script>
