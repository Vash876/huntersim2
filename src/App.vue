<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/App.vue -->
<script setup>
import AppNavbar from './components/common/AppNavbar.vue';
import AppNavbarMobile from './components/common/AppNavbarMobile.vue';
import AppFooter from './components/common/AppFooter.vue';
import FAQ from './components/common/FAQ.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useSyncStore } from './store/syncStore';
import { useGemPlannerStore } from './store/gemPlannerStore';
import { useGemPlanningStore } from './store/gemPlanningStore';
import { useTRTrackingStore } from './store/trTrackingStore';
import { useHunterStore } from './store/hunterStore';
import { checkLocalStorageQuota } from './utils/storageCheck';
import { IconAlertTriangle, IconX } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const syncStore = useSyncStore();
const gemPlannerStore = useGemPlannerStore();
const gemPlanningStore = useGemPlanningStore();
const trTrackingStore = useTRTrackingStore();
const hunterStore = useHunterStore();

// Storage warning state
const storageWarning = ref(null);
const showStorageWarning = ref(false);

// Initialize stores on app start
onMounted(async () => {
  try {
    // CRITICAL: Check for pending Quick Fix restore FIRST
    const quickfixPending = sessionStorage.getItem('quickfix_restore_pending');
    const quickfixBackup = sessionStorage.getItem('quickfix_backup');
    
    if (quickfixPending === 'true' && quickfixBackup) {
      console.log('🔧 Quick Fix: Detected pending restore after page reload...');
      
      // Clear the flags first
      sessionStorage.removeItem('quickfix_restore_pending');
      sessionStorage.removeItem('quickfix_backup');
      
      try {
        // Restore from backup
        console.log('🔧 Quick Fix: Restoring data from backup...');
        await syncStore.restoreLocalBackup(quickfixBackup);
        console.log('✅ Quick Fix: Data restored successfully!');
        
        // Show success notification via console (no blocking alert)
        console.log('✅ Storage fixed successfully! Your data has been restored.');
      } catch (error) {
        console.error('❌ Quick Fix restore failed:', error);
        // Show error in console and as non-blocking notification
        console.error('Failed to restore data after Quick Fix:', error.message);
        console.error('Please restore manually from Settings if needed.');
      }
    }
    
    syncStore.init();
    gemPlannerStore.init();
    await gemPlanningStore.init();
    
    // CRITICAL: TR Tracking store MUST be initialized on app start
    // Otherwise cloud save/load will destroy data if user never visited TR page
    await trTrackingStore.init();
    
    // Cleanup evaluation cache on startup (keep only last 100 entries per hunter)
    hunterStore.cleanupEvaluationCache();
    
    console.log('✅ All stores initialized successfully (including TR Tracking)');
    
    // Check storage quota after initialization
    const storageCheck = await checkLocalStorageQuota();
    if (storageCheck.warning) {
      storageWarning.value = storageCheck;
      showStorageWarning.value = true;
    }
  } catch (error) {
    console.error('Store initialization failed:', error);
  }
});

function goToSettings() {
  router.push('/settings');
  showStorageWarning.value = false;
}

function dismissWarning() {
  showStorageWarning.value = false;
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-900 text-white app-container">
    <!-- Storage Warning Banner -->
    <div 
      v-if="showStorageWarning && storageWarning"
      class="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-2xl animate-slide-down"
    >
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1">
            <IconAlertTriangle size="24" class="flex-shrink-0 animate-pulse" />
            <div class="flex-1">
              <div class="font-bold text-sm sm:text-base">
                Storage Almost Full ({{ storageWarning.percentage }}%)
              </div>
              <div class="text-xs sm:text-sm opacity-90 mt-0.5">
                Your browser storage is running low ({{ storageWarning.sizeMB }} MB / {{ storageWarning.limitMB }} MB used). 
                This may cause data loss on refresh.
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2 flex-shrink-0">
            <button
              @click="goToSettings"
              class="px-3 py-1.5 bg-white text-orange-600 hover:bg-gray-100 rounded-md font-medium text-sm transition-colors whitespace-nowrap"
            >
              Fix Now
            </button>
            <button
              @click="dismissWarning"
              class="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              title="Dismiss"
            >
              <IconX size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <AppNavbar class="hidden md:block" />
    <main class="flex-1">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
    <div class="block md:hidden">
      <AppNavbarMobile />
    </div>
    
    <!-- FAQ Component -->
    <!-- <FAQ /> -->
  </div>
</template>

<style scoped>
/* CSS-Variablen für Mobile Navbar Höhe - global verfügbar für alle Modals */
.app-container {
  --mobile-navbar-height: 60px;
  --mobile-safe-bottom: 70px; /* Navbar + padding */
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px); /* Einblenden von unten */
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px); /* Ausblenden nach oben */
}

@keyframes slide-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slide-down 0.4s ease-out;
}
</style>