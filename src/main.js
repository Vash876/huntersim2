import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './assets/css/main.css'
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// Chart.js Date Adapter - MUST be imported before Chart.js usage
import 'chartjs-adapter-date-fns'

// Register ALL Chart.js components centrally to prevent cross-chart contamination
// DO NOT use ChartJS.register() in individual components!
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

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