<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/App.vue -->
<script setup>
import AppNavbar from './components/common/AppNavbar.vue';
import AppNavbarMobile from './components/common/AppNavbarMobile.vue';
import AppFooter from './components/common/AppFooter.vue';
import FAQ from './components/common/FAQ.vue';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useSyncStore } from './store/syncStore';
import { useGemPlannerStore } from './store/gemPlannerStore';
import { useGemPlanningStore } from './store/gemPlanningStore';
import { useTRTrackingStore } from './store/trTrackingStore';

const route = useRoute();
const syncStore = useSyncStore();
const gemPlannerStore = useGemPlannerStore();
const gemPlanningStore = useGemPlanningStore();
const trTrackingStore = useTRTrackingStore();

// Initialize stores on app start
onMounted(async () => {
  try {
    syncStore.init();
    gemPlannerStore.init();
    await gemPlanningStore.init();
    
    // CRITICAL: TR Tracking store MUST be initialized on app start
    // Otherwise cloud save/load will destroy data if user never visited TR page
    await trTrackingStore.init();
    
    console.log('✅ All stores initialized successfully (including TR Tracking)');
  } catch (error) {
    console.error('Store initialization failed:', error);
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-900 text-white app-container">
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
</style>