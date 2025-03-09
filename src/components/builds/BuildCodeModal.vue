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
          Share Build
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal content -->
      <div class="p-5">
        <p class="text-sm text-gray-300 mb-4">
          Copy this code to share your build with others:
        </p>
        
        <div class="mb-4">
          <textarea
            ref="codeTextarea"
            :value="buildCode"
            readonly
            class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white text-sm h-24 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            @click="selectCode"
          ></textarea>
        </div>
        
        <button 
          @click="copyToClipboard" 
          :class="{ 'bg-green-600 hover:bg-green-700': copied, 'bg-blue-600 hover:bg-blue-700': !copied }"
          class="w-full p-2 rounded-md transition-colors flex justify-center items-center gap-2"
        >
          <IconCheck v-if="copied" size="18" />
          <IconCopy v-else size="18" />
          <span>{{ copied ? 'Copied!' : 'Copy to Clipboard' }}</span>
        </button>
        
        <div class="mt-6 border-t border-gray-600 pt-4">
          <p class="text-sm text-gray-300 mb-3">
            Or share this link:
          </p>
          
          <div class="flex">
            <input
              ref="linkInput"
              :value="shareLink"
              readonly
              class="flex-grow bg-gray-700 border border-gray-600 rounded-l-md p-2 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              @click="selectLink"
            />
            <button 
              @click="copyLinkToClipboard"
              :class="{ 'bg-green-600 hover:bg-green-700': linkCopied, 'bg-blue-600 hover:bg-blue-700': !linkCopied }"
              class="px-3 rounded-r-md transition-colors"
            >
              <IconCheck v-if="linkCopied" size="18" />
              <IconCopy v-else size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { IconShare, IconX, IconCopy, IconCheck } from '@tabler/icons-vue';
import { BuildCodeHandler } from '../../utils/BuildCodeHandler';
import { useHunterStore } from '../../store/hunterStore';

// Props
const props = defineProps({
  show: Boolean,
  build: Object
});

// Emits
const emit = defineEmits(['close']);

// Store
const hunterStore = useHunterStore();

// Refs
const codeTextarea = ref(null);
const linkInput = ref(null);
const copied = ref(false);
const linkCopied = ref(false);

// Computed
const buildCode = computed(() => {
  if (!props.build) return '';
  
  // Get store data for encoding
  const storeData = {
    hunterStats: { ...hunterStore.hunterStats },
    upgrades: { ...hunterStore.upgrades }
  };
  
  return BuildCodeHandler.generateCode(props.build, storeData) || '';
});

const shareLink = computed(() => {
  if (!buildCode.value) return '';
  // The URL of the application + a parameter for the build code
  return `${window.location.origin}/hunter/${props.build?.hunter || props.build?.hunterId}?code=${encodeURIComponent(buildCode.value)}`;
});

// Methods
const selectCode = () => {
  if (codeTextarea.value) {
    codeTextarea.value.select();
  }
};

const selectLink = () => {
  if (linkInput.value) {
    linkInput.value.select();
  }
};

const copyToClipboard = async () => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Moderne Clipboard API verwenden
      await navigator.clipboard.writeText(buildCode.value);
    } else {
      // Fallback mit document.execCommand
      selectCode();
      document.execCommand('copy');
    }
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    // Fallback-Strategie bei Fehler
    try {
      selectCode();
      const success = document.execCommand('copy');
      if (success) {
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
      } else {
        console.warn('execCommand copy returned false');
      }
    } catch (execErr) {
      console.error('Both clipboard methods failed:', execErr);
      alert('Copying to clipboard failed. Please copy manually.');
    }
  }
};

const copyLinkToClipboard = async () => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Moderne Clipboard API verwenden
      await navigator.clipboard.writeText(shareLink.value);
    } else {
      // Fallback mit document.execCommand
      selectLink();
      document.execCommand('copy');
    }
    linkCopied.value = true;
    setTimeout(() => { linkCopied.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy link to clipboard:', err);
    // Fallback-Strategie bei Fehler
    try {
      selectLink();
      const success = document.execCommand('copy');
      if (success) {
        linkCopied.value = true;
        setTimeout(() => { linkCopied.value = false; }, 2000);
      } else {
        console.warn('execCommand copy returned false');
      }
    } catch (execErr) {
      console.error('Both clipboard methods failed:', execErr);
      alert('Copying link to clipboard failed. Please copy manually.');
    }
  }
};

// Reset functionality when the modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    copied.value = false;
    linkCopied.value = false;
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