<template>
  <div v-if="showSyncInfo" class="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3 mb-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <IconCloud :class="syncIconClass" class="w-4 h-4" />
        <span class="text-sm text-blue-300">
          {{ syncStatusText }}
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Auto-Sync Toggle -->
        <button
          @click="toggleAutoSync"
          :class="[
            'px-2 py-1 rounded text-xs transition-colors',
            isAutoSyncEnabled 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-600 text-gray-300'
          ]"
          :title="isAutoSyncEnabled ? 'Auto-Sync aktiviert' : 'Auto-Sync deaktiviert'"
        >
          Auto
        </button>
        
        <!-- Manual Sync Button -->
        <button
          @click="manualSync"
          :disabled="!canSync || isSyncing"
          class="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-xs text-white transition-colors"
          :title="canSync ? 'Jetzt synchronisieren' : 'Synchronisation nicht verfügbar'"
        >
          <IconRefresh :class="{ 'animate-spin': isSyncing }" class="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { IconCloud, IconRefresh } from '@tabler/icons-vue';
import { useSyncStore } from '@/store/syncStore';
import { useToolsSync } from '@/composables/useToolsSync';

// Props
const props = defineProps({
  toolName: {
    type: String,
    default: 'Tool'
  },
  showWhenNotAuthenticated: {
    type: Boolean,
    default: false
  }
});

// Stores and Composables
const syncStore = useSyncStore();
const toolsSync = useToolsSync();

// Local state
const isSyncing = ref(false);

// Computed
const showSyncInfo = computed(() => {
  return syncStore.isAuthenticated || props.showWhenNotAuthenticated;
});

const syncStatusText = computed(() => {
  if (!syncStore.isAuthenticated) {
    return 'Nicht angemeldet - Synchronisation nicht verfügbar';
  }
  
  if (syncStore.isSyncing || isSyncing.value) {
    return `${props.toolName} wird synchronisiert...`;
  }
  
  if (toolsSync.isAutoSyncEnabled.value) {
    return `${props.toolName} - Auto-Sync aktiviert`;
  }
  
  return `${props.toolName} - Bereit zur Synchronisation`;
});

const syncIconClass = computed(() => {
  if (!syncStore.isAuthenticated) {
    return 'text-gray-500';
  }
  
  if (syncStore.isSyncing || isSyncing.value) {
    return 'text-blue-400 animate-pulse';
  }
  
  if (toolsSync.isAutoSyncEnabled.value) {
    return 'text-green-400';
  }
  
  return 'text-blue-400';
});

const { isAutoSyncEnabled, canSync } = toolsSync;

// Methods
function toggleAutoSync() {
  toolsSync.setAutoSync(!toolsSync.isAutoSyncEnabled.value);
}

async function manualSync() {
  if (!canSync.value || isSyncing.value) return;
  
  try {
    isSyncing.value = true;
    await toolsSync.syncToServer();
  } catch (error) {
    console.error('Manual sync failed:', error);
  } finally {
    isSyncing.value = false;
  }
}
</script>

<style scoped>
/* Styles sind bereits durch Tailwind abgedeckt */
</style>
