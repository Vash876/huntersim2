<!-- filepath: c:\Users\igorn\projects\huntersim2\src\App.vue -->
<script setup>
import AppNavbar from './components/common/AppNavbar.vue';
import AppFooter from './components/common/AppFooter.vue';
import { useRoute } from 'vue-router';
import { watch, onMounted } from 'vue';
import { calculateBuildLevel } from './utils/buildUtils';

const route = useRoute();

// Hunter-Daten
const hunters = {
  borge: { name: 'Borge', color: '#ef4444' },
  ozzy: { name: 'Ozzy', color: '#22c55e' },
  knox: { name: 'Knox', color: '#3b82f6' }
};

// Funktion zum Aktualisieren der Meta-Tags
function updateMetaTags(route) {
  // Standard-Meta-Tags definieren
  let title = 'Hunter Simulator 2';
  let description = 'Build your hunter and optimize your strategy!';
  let imageUrl = 'https://hunter-sim2.netlify.app/og-image.png'; // Allgemeines Bild
  let themeColor = '#1e293b';
  
  // Prüfen, ob wir auf einer Hunter-Seite sind
  if (route.params.hunterId && route.query.code) {
    const hunterId = route.params.hunterId;
    const buildCode = route.query.code;
    const hunter = hunters[hunterId] || { name: 'Hunter', color: '#9ca3af' };
    
    // Level berechnen
    const buildInfo = calculateBuildLevel(buildCode, hunterId);
    const levelText = buildInfo.isValid ? `Level ${buildInfo.level}` : 'Invalid Build Code';
    
    // Meta-Tags anpassen
    title = `${hunter.name} ${levelText} | Hunter Simulator 2`;
    description = `Check out this ${hunter.name} build on Hunter Simulator.`;
    imageUrl = `https://hunter-sim2.netlify.app/hunter-${hunterId}.png`; // Spezifisches Bild
    themeColor = hunter.color;
  }
  
  // Meta-Tags im Dokument aktualisieren
  document.title = title;
  
  // Open Graph Tags
  updateMetaTag('og:title', title);
  updateMetaTag('og:description', description);
  updateMetaTag('og:image', imageUrl);
  updateMetaTag('og:url', window.location.href);
  
  // Theme-Color Tag
  updateMetaTag('theme-color', themeColor);
}

// Hilfsfunktion zum Aktualisieren oder Erstellen von Meta-Tags
function updateMetaTag(name, content) {
  let meta = document.querySelector(`meta[property="${name}"]`) || 
             document.querySelector(`meta[name="${name}"]`);
             
  if (!meta) {
    meta = document.createElement('meta');
    if (name.startsWith('og:')) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

// Meta-Tags beim ersten Laden aktualisieren
onMounted(() => {
  updateMetaTags(route);
});

// Meta-Tags aktualisieren, wenn sich die Route ändert
watch(() => route.fullPath, () => {
  updateMetaTags(route);
});
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
}
</style>