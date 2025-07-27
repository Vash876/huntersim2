<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconSettings size="20" class="mr-2 text-blue-400" />
          Account Settings
        </h2>
        <button 
          @click="closeModal"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal Content -->
      <div class="p-6 space-y-6">
        
        <!-- Account Information -->
        <div class="bg-gray-700/30 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-white mb-3 flex items-center">
            <IconUser size="18" class="mr-2 text-blue-400" />
            Account Information
          </h3>
          <div class="space-y-4 text-sm">
            
            <!-- Display Name -->
            <div>
              <label class="text-sm font-medium text-gray-400 block mb-2">Display Name:</label>
              <div v-if="!editingName" class="flex items-center justify-between">
                <span class="text-white">{{ neonAuthService.getUserDisplayName() || 'Unknown' }}</span>
                <button 
                  @click="startEditingName"
                  class="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Edit
                </button>
              </div>
              <div v-else class="space-y-2">
                <input 
                  v-model="newDisplayName"
                  type="text"
                  placeholder="Enter new display name"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                  @keyup.enter="saveDisplayName"
                  @keyup.escape="cancelEditingName"
                />
                <div class="flex space-x-2">
                  <button
                    @click="saveDisplayName"
                    class="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 rounded transition-colors"
                  >
                    Save
                  </button>
                  <button
                    @click="cancelEditingName"
                    class="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <!-- Email (read-only) -->
            <div class="flex justify-between">
              <span class="text-gray-400">Email:</span>
              <span class="text-white">{{ neonAuthService.getUserEmail() || 'No email' }}</span>
            </div>

            <!-- Account ID (read-only) -->
            <div class="flex justify-between">
              <span class="text-gray-400">Account ID:</span>
              <span class="text-white font-mono text-xs">{{ neonAuthService.getUserId() || 'Unknown' }}</span>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-red-400 mb-3 flex items-center">
            <IconAlertTriangle size="18" class="mr-2" />
            Danger Zone
          </h3>
          <div class="space-y-3">
            
            <!-- Delete Account -->
            <button
              @click="showDeleteConfirmation = true"
              class="w-full flex items-center justify-between px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <div class="flex items-center">
                <IconUserX size="16" class="mr-2" />
                <span class="text-sm font-medium">Delete Account</span>
              </div>
              <span class="text-xs text-red-200">Permanent</span>
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteConfirmation" 
      class="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4"
      @click.self="showDeleteConfirmation = false"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-red-600">
        <div class="flex items-center mb-4">
          <IconAlertTriangle size="24" class="text-red-500 mr-3" />
          <h3 class="text-lg font-bold text-white">Delete Account</h3>
        </div>
        
        <p class="text-gray-300 mb-4">
          This will permanently delete your account and all associated data. This action cannot be undone.
        </p>
        
        <p class="text-sm text-gray-400 mb-6">
          Type <span class="font-mono font-bold text-red-400">DELETE</span> to confirm:
        </p>
        
        <input 
          v-model="deleteConfirmationText"
          type="text"
          placeholder="Type DELETE here"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
        />
        
        <div class="flex space-x-3">
          <button
            @click="showDeleteConfirmation = false"
            class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteAccount"
            :disabled="deleteConfirmationText !== 'DELETE'"
            class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { neonAuthService } from '@/services/neonAuthService';
import { useSyncStore } from '@/store/syncStore';
import { useHunterStore } from '@/store/hunterStore';
import { 
  IconSettings, 
  IconX, 
  IconUser, 
  IconAlertTriangle,
  IconUserX
} from '@tabler/icons-vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const syncStore = useSyncStore();
const hunterStore = useHunterStore();

// Display name editing state
const editingName = ref(false);
const newDisplayName = ref('');

const showDeleteConfirmation = ref(false);
const deleteConfirmationText = ref('');

function closeModal() {
  showDeleteConfirmation.value = false;
  deleteConfirmationText.value = '';
  editingName.value = false;
  newDisplayName.value = '';
  emit('close');
}

// Display name functions
function startEditingName() {
  editingName.value = true;
  newDisplayName.value = neonAuthService.getUserDisplayName() || '';
}

function cancelEditingName() {
  editingName.value = false;
  newDisplayName.value = '';
}

async function saveDisplayName() {
  if (!newDisplayName.value.trim()) {
    alert('Display name cannot be empty');
    return;
  }

  try {
    // Try to update the display name through the auth service
    try {
      await neonAuthService.updateUserDisplayName(newDisplayName.value.trim());
    } catch (authError) {
      console.warn('Auth service update failed, trying direct Stack Auth:', authError);
      
      // Fallback: Try direct Stack Auth methods
      const { stackClientApp } = await import('@/services/stackAuth');
      
      let updateSuccess = false;
      const trimmedName = newDisplayName.value.trim();
      
      // Try different Stack Auth update methods
      if (stackClientApp.updateUser) {
        await stackClientApp.updateUser({ displayName: trimmedName });
        updateSuccess = true;
      } else if (stackClientApp.updateCurrentUser) {
        await stackClientApp.updateCurrentUser({ displayName: trimmedName });
        updateSuccess = true;
      } else if (stackClientApp.updateProfile) {
        await stackClientApp.updateProfile({ displayName: trimmedName });
        updateSuccess = true;
      }
      
      if (!updateSuccess) {
        throw new Error('No suitable update method found in Stack Auth');
      }
      
      // Refresh auth state
      await neonAuthService.refreshAuthState();
    }
    
    editingName.value = false;
    newDisplayName.value = '';    
  } catch (error) {
    console.error('Failed to update display name:', error);
    alert(`Failed to update display name: ${error.message}`);
  }
}

async function deleteAccount() {
  if (deleteConfirmationText.value !== 'DELETE') {
    return;
  }

  try {
    const userId = neonAuthService.getUserId();
    
    if (!userId) {
      throw new Error('No user ID found');
    }

    // Call delete backup API
    const response = await fetch('/.netlify/functions/delete-backup', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status}`);
    }

    // Sign out user
    await neonAuthService.signOut();
    
    // Clear all local data
    localStorage.clear();
    
    // Redirect to home
    window.location.href = '/';
    
  } catch (error) {
    console.error('Account deletion failed:', error);
    alert(`Account deletion failed: ${error.message}`);
  }
}
</script>

<style scoped>
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
