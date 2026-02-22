<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-900 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-lg font-bold text-white flex items-center">
          <IconUsersGroup size="20" class="mr-2 text-indigo-400" />
          Friends
          <span 
            v-if="friendsStore.hasPending" 
            class="ml-2 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-xs rounded-full text-white font-bold"
          >
            {{ friendsStore.pendingCount }}
          </span>
        </h2>
        <button @click="$emit('close')" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors">
          <IconX size="16" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 max-h-[75vh] overflow-y-auto space-y-4">

        <!-- Loading state (auth restoring or friends loading) -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-3"></div>
          <p class="text-sm text-gray-400">Loading friends...</p>
        </div>

        <!-- Not signed in -->
        <div v-else-if="!friendsStore.isInitialized" class="text-center py-8">
          <IconUserOff size="48" class="mx-auto text-gray-600 mb-3" />
          <p class="text-gray-400 mb-2">Sign in to use the Friends system</p>
          <p class="text-xs text-gray-500">Add friends, share TR tracks, and compare progress</p>
        </div>

        <template v-else>
          <!-- My Friend Code -->
          <div class="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-3">
            <div class="text-xs text-indigo-300 mb-1.5">Your Friend Code</div>
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-gray-900 rounded-md px-3 py-2 font-mono text-lg text-white tracking-wider text-center select-all">
                {{ friendsStore.friendCode }}
              </div>
              <button 
                @click="copyFriendCode" 
                class="p-2 rounded-md transition-colors"
                :class="codeCopied ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'"
              >
                <IconCheck v-if="codeCopied" size="18" />
                <IconCopy v-else size="18" />
              </button>
            </div>
            <p class="text-[10px] text-indigo-400/60 mt-1.5">Share this code so others can add you</p>
          </div>

          <!-- Add Friend -->
          <div class="bg-gray-700/30 rounded-lg p-3">
            <div class="text-xs text-gray-400 mb-2">Add Friend</div>
            <div class="flex gap-2">
              <input 
                v-model="friendCodeInput" 
                placeholder="CIFI-XXXX"
                class="flex-1 bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white text-sm font-mono uppercase tracking-wider focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                maxlength="9"
                @keydown.enter="addFriend"
              />
              <button 
                @click="addFriend" 
                :disabled="!friendCodeInput.trim() || isAdding"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white text-sm font-medium transition-colors flex items-center gap-1.5"
              >
                <IconLoader2 v-if="isAdding" size="16" class="animate-spin" />
                <IconUserPlus v-else size="16" />
                <span>Add</span>
              </button>
            </div>
            <!-- Add result message -->
            <div v-if="addMessage" class="mt-2 text-xs px-2 py-1 rounded" :class="addMessageClass">
              {{ addMessage }}
            </div>
          </div>

          <!-- Pending Incoming Requests -->
          <div v-if="friendsStore.pendingIncoming.length > 0" class="space-y-2">
            <div class="text-xs text-yellow-400 font-medium flex items-center gap-1">
              <IconBell size="14" />
              Pending Requests ({{ friendsStore.pendingIncoming.length }})
            </div>
            <div 
              v-for="req in friendsStore.pendingIncoming" 
              :key="req.uid"
              class="flex items-center justify-between bg-yellow-900/20 border border-yellow-700/30 rounded-lg px-3 py-2"
            >
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {{ (req.profile?.displayName || '?').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-sm text-white font-medium">{{ req.profile?.displayName || 'Unknown' }}</div>
                  <div class="text-[10px] text-gray-400">{{ req.profile?.friendCode }}</div>
                </div>
              </div>
              <div class="flex gap-1.5">
                <button 
                  @click="acceptRequest(req.uid)" 
                  class="px-2.5 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white font-medium transition-colors"
                >
                  Accept
                </button>
                <button 
                  @click="declineRequest(req.uid)" 
                  class="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs text-white transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>

          <!-- Pending Sent Requests -->
          <div v-if="friendsStore.pendingSent.length > 0" class="space-y-2">
            <div class="text-xs text-gray-400 font-medium">Sent Requests ({{ friendsStore.pendingSent.length }})</div>
            <div 
              v-for="req in friendsStore.pendingSent" 
              :key="req.uid"
              class="flex items-center justify-between bg-gray-700/30 rounded-lg px-3 py-2"
            >
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {{ (req.profile?.displayName || '?').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-sm text-white">{{ req.profile?.displayName || 'Unknown' }}</div>
                  <div class="text-[10px] text-gray-400">Pending...</div>
                </div>
              </div>
              <button 
                @click="cancelRequest(req.uid)" 
                class="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                title="Cancel request"
              >
                <IconX size="14" />
              </button>
            </div>
          </div>

          <!-- Friends List -->
          <div class="space-y-2">
            <div class="text-xs text-gray-400 font-medium flex items-center justify-between">
              <span>Friends ({{ friendsStore.friendCount }})</span>
              <button 
                v-if="friendsStore.friendCount > 0"
                @click="refreshFriends" 
                :disabled="friendsStore.isLoading"
                class="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <IconRefresh size="12" :class="{ 'animate-spin': friendsStore.isLoading }" />
                <span>Refresh</span>
              </button>
            </div>

            <!-- Empty state -->
            <div v-if="friendsStore.friendCount === 0" class="text-center py-6">
              <IconUsers size="36" class="mx-auto text-gray-600 mb-2" />
              <p class="text-sm text-gray-400">No friends yet</p>
              <p class="text-xs text-gray-500 mt-1">Share your friend code or add someone above</p>
            </div>

            <!-- Friends -->
            <div 
              v-for="friend in friendsStore.friends" 
              :key="friend.uid"
              class="flex items-center justify-between bg-gray-700/30 rounded-lg px-3 py-2 hover:bg-gray-700/50 transition-colors"
            >
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {{ (friend.profile?.displayName || '?').charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-sm text-white font-medium">{{ friend.profile?.displayName || 'Unknown' }}</div>
                  <div class="text-[10px] text-gray-400">{{ friend.profile?.friendCode }}</div>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <!-- Shared tracks indicator -->
                <span 
                  v-if="getFriendTrackCount(friend.uid) > 0" 
                  class="text-[10px] text-green-400 bg-green-900/30 px-1.5 py-0.5 rounded-full"
                >
                  {{ getFriendTrackCount(friend.uid) }} track{{ getFriendTrackCount(friend.uid) !== 1 ? 's' : '' }}
                </span>
                <button 
                  @click="confirmRemoveFriend(friend)" 
                  class="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                  title="Remove friend"
                >
                  <IconUserMinus size="14" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="p-3 bg-gray-800/50 border-t border-gray-700 text-right">
        <button @click="$emit('close')" class="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 rounded-md text-sm text-white transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Remove confirmation dialog -->
  <div 
    v-if="showRemoveDialog" 
    class="fixed inset-0 z-[60] bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="showRemoveDialog = false"
  >
    <div class="bg-gray-800 rounded-xl border border-gray-700 p-5 max-w-sm w-full animate-fade-in">
      <h3 class="text-white font-bold mb-2">Remove Friend</h3>
      <p class="text-sm text-gray-300 mb-4">
        Remove <strong>{{ removeTarget?.profile?.displayName }}</strong> from your friends list? You won't see each other's shared tracks anymore.
      </p>
      <div class="flex justify-end gap-2">
        <button @click="showRemoveDialog = false" class="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 rounded-md text-sm text-white transition-colors">Cancel</button>
        <button @click="removeFriend" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm text-white transition-colors">Remove</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useFriendsStore } from '@/store/friendsStore';
import { neonAuthService } from '@/services/neonAuthService';
import {
  IconUsersGroup, IconX, IconCopy, IconCheck, IconUserPlus, IconUserMinus,
  IconUsers, IconUserOff, IconBell, IconRefresh, IconLoader2
} from '@tabler/icons-vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);
const friendsStore = useFriendsStore();

// Loading = auth still restoring OR friends store is loading after auth
const isLoading = computed(() => {
  // Auth is still checking if user is logged in
  if (neonAuthService.isLoading.value) return true;
  // User is authenticated but friends store hasn't initialized yet
  if (neonAuthService.isAuthenticated.value && !friendsStore.isInitialized && !friendsStore.error) return true;
  // Friends store is actively loading
  if (friendsStore.isLoading) return true;
  return false;
});

// State
const friendCodeInput = ref('');
const isAdding = ref(false);
const addMessage = ref('');
const addMessageType = ref('success');
const codeCopied = ref(false);
const showRemoveDialog = ref(false);
const removeTarget = ref(null);

const addMessageClass = computed(() => {
  return addMessageType.value === 'success'
    ? 'bg-green-900/30 text-green-300'
    : 'bg-red-900/30 text-red-300';
});

// Copy friend code to clipboard
async function copyFriendCode() {
  try {
    await navigator.clipboard.writeText(friendsStore.friendCode);
    codeCopied.value = true;
    setTimeout(() => { codeCopied.value = false; }, 2000);
  } catch {
    // Fallback
    const el = document.createElement('textarea');
    el.value = friendsStore.friendCode;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    codeCopied.value = true;
    setTimeout(() => { codeCopied.value = false; }, 2000);
  }
}

// Add friend by code
async function addFriend() {
  const code = friendCodeInput.value.trim();
  if (!code) return;

  isAdding.value = true;
  addMessage.value = '';

  try {
    const result = await friendsStore.addFriendByCode(code);

    if (result.status === 'accepted') {
      addMessage.value = `You and ${result.targetName} are now friends!`;
      addMessageType.value = 'success';
    } else if (result.status === 'already_friends') {
      addMessage.value = 'You\'re already friends!';
      addMessageType.value = 'success';
    } else if (result.status === 'already_pending') {
      addMessage.value = 'Request already sent!';
      addMessageType.value = 'success';
    } else {
      addMessage.value = `Friend request sent to ${result.targetName}!`;
      addMessageType.value = 'success';
    }

    friendCodeInput.value = '';
  } catch (err) {
    addMessage.value = err.message;
    addMessageType.value = 'error';
  } finally {
    isAdding.value = false;
    setTimeout(() => { addMessage.value = ''; }, 5000);
  }
}

// Accept incoming request
async function acceptRequest(uid) {
  try {
    await friendsStore.acceptRequest(uid);
  } catch (err) {
    console.error('Accept failed:', err);
  }
}

// Decline incoming request
async function declineRequest(uid) {
  try {
    await friendsStore.removeFriend(uid);
  } catch (err) {
    console.error('Decline failed:', err);
  }
}

// Cancel sent request
async function cancelRequest(uid) {
  try {
    await friendsStore.removeFriend(uid);
  } catch (err) {
    console.error('Cancel failed:', err);
  }
}

// Remove friend flow
function confirmRemoveFriend(friend) {
  removeTarget.value = friend;
  showRemoveDialog.value = true;
}

async function removeFriend() {
  if (!removeTarget.value) return;
  try {
    await friendsStore.removeFriend(removeTarget.value.uid);
  } catch (err) {
    console.error('Remove failed:', err);
  }
  showRemoveDialog.value = false;
  removeTarget.value = null;
}

// Refresh friends list
async function refreshFriends() {
  await friendsStore.refreshAll();
}

// Get track count for a friend
function getFriendTrackCount(uid) {
  return friendsStore.friendsTracks.filter(t => t.ownerId === uid).length;
}

// Reset state on close
watch(() => props.show, (newVal) => {
  if (!newVal) {
    addMessage.value = '';
    friendCodeInput.value = '';
  }
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
