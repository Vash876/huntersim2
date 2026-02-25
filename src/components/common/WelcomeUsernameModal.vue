<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/90 flex items-center justify-center p-4 backdrop-blur-sm">
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconUser size="24" class="mr-2 text-blue-400" />
          Choose Your Name
        </h2>
      </div>

      <!-- Content -->
      <div class="p-5">
        <p class="text-gray-300 text-sm mb-5">
          Please choose a nickname that will be visible to your friends.
        </p>

        <!-- Error -->
        <div v-if="error" class="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>

        <!-- Input -->
        <div class="mb-5">
          <input 
            v-model="username" 
            type="text" 
            class="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Enter your nickname..."
            maxlength="20"
            @keyup.enter="saveUsername"
            ref="inputRef"
          />
          <p class="text-xs text-gray-500 mt-1 text-right">{{ username.length }}/20</p>
        </div>

        <!-- Save Button -->
        <button
          @click="saveUsername"
          :disabled="loading || !username.trim()"
          class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IconCheck v-if="!loading" size="18" class="mr-2" />
          <svg v-else class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Saving...' : 'Save & Continue' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useFriendsStore } from '@/store/friendsStore';
import { neonAuthService } from '@/services/neonAuthService';
import { IconUser, IconCheck } from '@tabler/icons-vue';

const friendsStore = useFriendsStore();
const isVisible = computed(() => friendsStore.needsUsernamePrompt);

const username = ref('');
const loading = ref(false);
const error = ref('');
const inputRef = ref(null);

// Auto-focus input when modal appears
watch(isVisible, (newVal) => {
  if (newVal) {
    username.value = '';
    error.value = '';
    nextTick(() => {
      if (inputRef.value) inputRef.value.focus();
    });
  }
});

async function saveUsername() {
  const trimmed = username.value.trim();
  if (!trimmed || loading.value) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    await neonAuthService.updateUserDisplayName(trimmed);
    
    // Update local store profile so the modal closes immediately
    if (friendsStore.myProfile) {
      friendsStore.myProfile.displayName = trimmed;
      friendsStore.myProfile.hasSetUsername = true;
    }
  } catch (err) {
    error.value = err.message || 'Failed to save username. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
