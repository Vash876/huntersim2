<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/App.vue -->
<script setup>
import AppNavbar from './components/common/AppNavbar.vue';
import AppNavbarMobile from './components/common/AppNavbarMobile.vue';
import AppFooter from './components/common/AppFooter.vue';
import FAQ from './components/common/FAQ.vue';
import WelcomeUsernameModal from './components/common/WelcomeUsernameModal.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useSyncStore } from './store/syncStore';
import { useGemPlannerStore } from './store/gemPlannerStore';
import { useGemPlanningStore } from './store/gemPlanningStore';
import { useTRTrackingStore } from './store/trTrackingStore';
import { useHunterStore } from './store/hunterStore';
import { useMissionPlannerStore } from './store/missionPlannerStore';
import { checkLocalStorageQuota } from './utils/storageCheck';
import { IconAlertTriangle, IconX } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const syncStore = useSyncStore();
const gemPlannerStore = useGemPlannerStore();
const gemPlanningStore = useGemPlanningStore();
const trTrackingStore = useTRTrackingStore();
const hunterStore = useHunterStore();
const missionPlannerStore = useMissionPlannerStore();

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
    
    // Initialize campaign timer system (runs in background for alarm sounds)
    missionPlannerStore.initCampaignTimers();
    
    console.log('✅ All stores initialized successfully (including TR Tracking, Campaign Timers)');
    
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
      <router-view />
    </main>
    <AppFooter />
    <div class="block md:hidden">
      <AppNavbarMobile />
    </div>
    
    <!-- Global Modals -->
    <WelcomeUsernameModal />
    
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
/* View Transitions API Styles */
::view-transition {
  /* Verhindere weißes Flackern - dunkler Background während Transition */
  background-color: rgb(17 24 39); /* gray-900 */
}

::view-transition-group(root) {
  /* Halte die alte Seite länger sichtbar für smootheren Übergang */
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.5s; /* Schneller = weniger Zeit für Flackern */
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  /* Verhindere Mix-Blend Mode Probleme */
  mix-blend-mode: normal;
  /* Vermeide Lücken zwischen Screenshots */
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Fade out alte Seite */
::view-transition-old(root) {
  animation-name: fade-out;
}

/* Fade in neue Seite */
::view-transition-new(root) {
  animation-name: fade-in;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Schließe Dropdowns von Page Transitions aus */
/* Diese Elemente sollen nicht im Screenshot für Page-Navigation erscheinen */
[class*="dropdown"],
.absolute.top-full {
  view-transition-name: none !important;
}

/* In-Page Transitions: Schnelle Animation OHNE sichtbaren Cross-Fade */
html.in-page-transition::view-transition-old(root),
html.in-page-transition::view-transition-new(root) {
  /* Root bleibt stabil, kein Fade der ganzen Seite */
  animation: none;
}

html.in-page-transition::view-transition-group(root) {
  /* Root bleibt stabil */
  animation: none;
}

/* Nur die Tabelle/Cards animieren */
html.in-page-transition::view-transition-old(loop-mod-table),
html.in-page-transition::view-transition-new(loop-mod-table),
html.in-page-transition::view-transition-old(loop-mod-cards),
html.in-page-transition::view-transition-new(loop-mod-cards),
html.in-page-transition::view-transition-old(research-table),
html.in-page-transition::view-transition-new(research-table),
html.in-page-transition::view-transition-old(research-cards),
html.in-page-transition::view-transition-new(research-cards),
html.in-page-transition::view-transition-old(m0-table),
html.in-page-transition::view-transition-new(m0-table),
html.in-page-transition::view-transition-old(m0-mobile),
html.in-page-transition::view-transition-new(m0-mobile),
html.in-page-transition::view-transition-old(available-inscryptions-list),
html.in-page-transition::view-transition-new(available-inscryptions-list),
html.in-page-transition::view-transition-old(shopping-list-mobile),
html.in-page-transition::view-transition-new(shopping-list-mobile),
html.in-page-transition::view-transition-old(shopping-list-desktop),
html.in-page-transition::view-transition-new(shopping-list-desktop) {
  /* Sehr kurzer Fade nur für die animierten Elemente */
  animation-duration: 0.1s;
  animation-timing-function: ease-in-out;
}

html.in-page-transition::view-transition-group(loop-mod-table),
html.in-page-transition::view-transition-group(loop-mod-cards),
html.in-page-transition::view-transition-group(research-table),
html.in-page-transition::view-transition-group(research-cards),
html.in-page-transition::view-transition-group(m0-table),
html.in-page-transition::view-transition-group(m0-mobile),
html.in-page-transition::view-transition-group(available-inscryptions-list),
html.in-page-transition::view-transition-group(shopping-list-mobile),
html.in-page-transition::view-transition-group(shopping-list-desktop) {
  /* Smooth Movement der Elemente */
  animation-duration: 0.1s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gadget Card Transitions - für individuelle Karten */
html.in-page-transition::view-transition-group(root) {
  animation-duration: 0s; /* Root nicht animieren */
}

html.in-page-transition [style*="view-transition-name: gadget-"]::view-transition-group(*) {
  animation-duration: 0.3s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* AttrGN3 Calculator Results Transitions */
html.in-page-transition::view-transition-old(attrgn3-results),
html.in-page-transition::view-transition-new(attrgn3-results),
html.in-page-transition::view-transition-old(innogn6-results),
html.in-page-transition::view-transition-new(innogn6-results) {
  animation-duration: 0.15s;
  animation-timing-function: ease-in-out;
}

html.in-page-transition::view-transition-group(attrgn3-results),
html.in-page-transition::view-transition-group(innogn6-results) {
  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Build Card Transitions - Smooth create/delete */
/* Prevent size/transform animation on the group - only allow position changes */
html.in-page-transition [style*="view-transition-name: build-card-"]::view-transition-group(*) {
  animation: none;
}

/* Only animate opacity for old (disappearing) cards */
html.in-page-transition [style*="view-transition-name: build-card-"]::view-transition-old(*) {
  animation: fade-out-card 0.2s ease-in-out;
}

/* Only animate opacity for new (appearing) cards - NO size morphing */
html.in-page-transition [style*="view-transition-name: build-card-"]::view-transition-new(*) {
  animation: fade-in-card 0.2s ease-in-out;
}

@keyframes fade-in-card {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out-card {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Slide-Down Animation für andere Elemente */
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

/* Fix für Teleported Modals - Textfarbe muss explizit gesetzt werden */
/* Weil body jetzt als Container dient und Tailwind-Klassen die Farbe erben müssen */
[class*="fixed inset-0 z-50"] {
  color: rgba(255, 255, 255, 0.87);
}

/* Sicherstellen, dass Buttons und Icons in Modals sichtbar sind */
[class*="fixed inset-0 z-50"] button:not([class*="text-"]) {
  color: rgba(255, 255, 255, 0.87);
}

/* Tabellen in Modals */
[class*="fixed inset-0 z-50"] td:not([class*="text-"]),
[class*="fixed inset-0 z-50"] th:not([class*="text-"]) {
  color: rgba(255, 255, 255, 0.87);
}
</style>