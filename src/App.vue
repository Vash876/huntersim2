<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/App.vue -->
<script setup>
import AppNavbar from './components/common/AppNavbar.vue';
import AppFooter from './components/common/AppFooter.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-900 text-white">
    <AppNavbar />
    <main class="flex-1">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
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