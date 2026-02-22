<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header with close button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconShare size="20" class="mr-2 text-blue-400" />
          Share TR Track
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal content -->
      <div class="p-5 space-y-4">
        <!-- Cloud Share Section (Friends) -->
        <div v-if="isLoggedIn" class="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <IconCloud size="18" class="text-indigo-400" />
              <span class="text-sm font-medium text-indigo-200">Share with Friends</span>
            </div>
            <button
              @click="toggleCloudShare"
              :disabled="cloudShareLoading"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
              :class="isSharedToCloud ? 'bg-indigo-600' : 'bg-gray-600'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="isSharedToCloud ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>
          <p class="text-xs text-gray-400">
            {{ isSharedToCloud 
              ? 'This track is visible to your friends. They can view it and include it in comparisons.' 
              : 'Toggle to share this track with your friends list.' }}
          </p>
          <div v-if="cloudShareLoading" class="flex items-center gap-2 mt-2 text-xs text-indigo-300">
            <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-400"></div>
            <span>Updating...</span>
          </div>
          <div v-if="cloudShareError" class="mt-2 text-xs text-red-400">{{ cloudShareError }}</div>
        </div>

        <!-- Code Share Section -->
        <div>
          <p class="text-sm text-gray-300 mb-3">
            Or share via track code:
          </p>
          
          <div class="mb-3">
            <textarea
              ref="codeTextarea"
              :value="trackCode"
              readonly
              class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm h-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
              @click="selectCode"
            ></textarea>
          </div>
          
          <!-- Copy button -->
          <button 
            @click="copyCode" 
            :class="{ 
              'bg-green-600 hover:bg-green-700': copied, 
              'bg-blue-600 hover:bg-blue-700': !copied
            }"
            class="w-full p-3 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <IconCheck v-if="copied" size="18" />
            <IconCopy v-else size="18" />
            <span class="font-medium">{{ copied ? 'Copied!' : 'Copy Track Code' }}</span>
          </button>
        </div>
        
        <div class="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md">
          <p class="text-xs text-gray-400">
            <strong class="text-blue-300">Track Code</strong> — anyone with this code can import your complete TR tracking plan.
            <span v-if="isLoggedIn" class="block mt-1"><strong class="text-indigo-300">Friends Share</strong> — your friends see the track live without needing a code.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconShare, IconX, IconCopy, IconCheck, IconCloud } from '@tabler/icons-vue';
import { compressTrack } from '@/utils/trackCompression';
import { useFriendsStore } from '@/store/friendsStore';

// Props
const props = defineProps({
  show: Boolean,
  track: Object
});

// Emits
const emit = defineEmits(['close']);

// Store
const friendsStore = useFriendsStore();

// Refs
const codeTextarea = ref(null);
const copied = ref(false);
const cloudShareLoading = ref(false);
const cloudShareError = ref('');

// Computed
const isLoggedIn = computed(() => friendsStore.isInitialized && !!friendsStore.myProfile);

const isSharedToCloud = computed(() => {
  if (!props.track) return false;
  return friendsStore.isTrackShared(props.track.id);
});

const trackCode = computed(() => {
  if (!props.track) return '';
  
  try {
    return compressTrack(props.track);
  } catch (error) {
    console.error('Error generating track code:', error);
    return '';
  }
});

// Methods
async function toggleCloudShare() {
  if (!props.track) return;
  cloudShareLoading.value = true;
  cloudShareError.value = '';
  
  try {
    if (isSharedToCloud.value) {
      await friendsStore.stopSharingTrack(props.track.id);
    } else {
      await friendsStore.shareTrack(props.track, 'friends');
    }
  } catch (err) {
    console.error('Cloud share toggle failed:', err);
    cloudShareError.value = err.message || 'Failed to update sharing';
  } finally {
    cloudShareLoading.value = false;
  }
}

const selectCode = () => {
  if (codeTextarea.value) {
    codeTextarea.value.select();
  }
};

const copyCode = async () => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(trackCode.value);
    } else {
      selectCode();
      document.execCommand('copy');
    }
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy code:', err);
    try {
      selectCode();
      const success = document.execCommand('copy');
      if (success) {
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
      }
    } catch (execErr) {
      console.error('Copy failed:', execErr);
      alert('Copying failed. Please copy manually.');
    }
  }
};

// Reset functionality when the modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    copied.value = false;
    cloudShareError.value = '';
  } else if (newVal && isLoggedIn.value) {
    // Refresh shared track IDs when opening modal
    friendsStore.loadMySharedTracks();
  }
});
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
