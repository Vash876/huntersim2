<template>
  <div 
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconZodiacGemini size="20" class="mr-2 text-purple-400" />
          Welcome to TR Planner!
        </h2>
        <button 
          @click="handleClose"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal-Inhalt -->
      <div class="p-5">
        <!-- Action Required Warning -->
        <div class="mb-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-800/50">
          <div class="flex items-start">
            <IconAlertTriangle size="20" class="text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
            <div class="text-yellow-200 text-sm">
              <p class="font-medium mb-1">Action Required</p>
              <p>Please set your current gem levels in the Gem Overview to ensure accurate Orb and Frag calculations.</p>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-between items-right gap-3">
          <span></span>
          <div class="flex gap-2">
            <button 
              @click="handleOpenGemOverview"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <IconZodiacGemini size="16" />
              Configure Gems
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  IconZodiacGemini, 
  IconX, 
  IconAlertTriangle, 
  IconCircleCheck, 
  IconInfoCircle,
  IconSparkles
} from '@tabler/icons-vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'openGemOverview']);

const dontShowAgain = ref(false);

function handleClose() {
  if (dontShowAgain.value) {
    localStorage.setItem('trplanner_gem_welcome_seen', 'true');
    localStorage.setItem('trplanner_gem_welcome_disabled', 'true');
  }
  emit('close');
}

function handleSkip() {
  if (dontShowAgain.value) {
    localStorage.setItem('trplanner_gem_welcome_seen', 'true');
    localStorage.setItem('trplanner_gem_welcome_disabled', 'true');
  }
  emit('close');
}

function handleOpenGemOverview() {
  // Immer als gesehen markieren wenn User zu Gems geht
  localStorage.setItem('trplanner_gem_welcome_seen', 'true');
  if (dontShowAgain.value) {
    localStorage.setItem('trplanner_gem_welcome_disabled', 'true');
  }
  emit('openGemOverview');
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