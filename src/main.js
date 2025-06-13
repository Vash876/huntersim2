import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)

const evaluationCache = ref({})
app.provide('evaluationCache', evaluationCache)

app.use(router)
app.mount('#app')


if (import.meta.env.PROD) {
  // Speichere Original-Methoden
  const originalConsole = { ...console };
  
  // Überschreibe Debug-Methoden
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  
  // Behalte wichtige Meldungen
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
}

// Analytics nur in Produktion laden
if (import.meta.env.PROD) {
  import('@vercel/analytics').then(({ inject }) => {
    inject();
  });
}