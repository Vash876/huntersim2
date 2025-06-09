<template>
  <div>
    <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
      <div class="bg-gray-900/95 rounded-xl p-3 sm:p-5">
        <!-- Header -->
        <h2 class="text-xl sm:text-2xl font-bold mb-3 text-center text-white">
          <span>Attraction GN#3 Calculator</span>
        </h2>
        
        <!-- Input Settings -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-3">
          <div class="header p-2 flex justify-between items-center">
            <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
              <IconSettings size="16" class="mr-1.5 text-blue-400" />
              Calculator Settings
            </h3>
            
            <button 
              @click="resetSettings" 
              class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconRefresh size="12" class="mr-1" />
              Reset
            </button>
          </div>
          
          <div class="p-2 sm:p-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Left Column -->
              <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
                <!-- Tick Speed -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconClock size="16" class="text-cyan-400" />
                    </div>
                    <span class="text-sm text-gray-300">Tick Speed</span>
                  </div>
                  <ToolValueControls
                    :value="tickSpeed"
                    @update:value="tickSpeed = $event"
                    :minValue="1"
                    :maxValue="8"
                    :step="0.01"
                    :fastStep="0.1"
                    value-class="text-cyan-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
                
                <!-- Ticks per Tick -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconDeviceWatch size="16" class="text-yellow-400" />
                    </div>
                    <span class="text-sm text-gray-300">Ticks per Tick</span>
                  </div>
                  <ToolValueControls
                    :value="ticksPerTick"
                    @update:value="ticksPerTick = $event"
                    :minValue="1"
                    :maxValue="8"
                    :step="1"
                    :fastStep="10"
                    value-class="text-yellow-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>

                <!-- Research Points -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <img src="@/assets/general/rp.png" alt="RP" class="w-4 h-4" />
                    </div>
                    <span class="text-sm text-gray-300">Research Points</span>
                    <span class ="ml-1 text-xs text-gray-500">(max: 5900)</span>
                  </div>
                  <ToolValueControls
                    :value="researchPoints"
                    @update:value="researchPoints = $event"
                    :minValue="0"
                    :maxValue="5900"
                    :step="1"
                    :fastStep="100"
                    value-class="text-orange-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>

                <!-- Current Ticks in LR -->
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconTarget size="16" class="text-emerald-400" />
                    </div>
                    <span class="text-sm text-gray-300">Current Ticks in LR</span>
                  </div>
                  <ToolValueControls
                    :value="currentTicksInLR"
                    @update:value="currentTicksInLR = $event"
                    :minValue="0"
                    :maxValue="999999999"
                    :step="1"
                    :fastStep="1000"
                    value-class="text-emerald-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
              </div>
              
              <!-- Right Column -->
              <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
                <!-- TS#5 Toggle -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconCircle size="16" class="text-purple-400" />
                    </div>
                    <span class="text-sm text-gray-300">TS#5</span>
                  </div>
                  <div class="flex items-center">
                    <button 
                      @click="toggleTS5" 
                      class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                      :class="{
                        'bg-purple-600': ts5,
                        'bg-gray-600': !ts5
                      }"
                    >
                      <span 
                        class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                        :class="{
                          'translate-x-6': ts5,
                          'translate-x-1': !ts5
                        }"
                      ></span>
                    </button>
                  </div>
                </div>

                <!-- Efficiency Badge Toggle -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconBadge size="16" class="text-green-400" />
                    </div>
                    <span class="text-sm text-gray-300">Efficiency Badge</span>
                  </div>
                  <div class="flex items-center">
                    <button 
                      @click="toggleEfficiencyBadge" 
                      class="relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none"
                      :class="{
                        'bg-green-600': efficiencyBadge,
                        'bg-gray-600': !efficiencyBadge
                      }"
                    >
                      <span 
                        class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
                        :class="{
                          'translate-x-6': efficiencyBadge,
                          'translate-x-1': !efficiencyBadge
                        }"
                      ></span>
                    </button>
                  </div>
                </div>
                
                <!-- Relic #14 -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconShield size="16" class="text-blue-400" />
                    </div>
                    <span class="text-sm text-gray-300">Relic #14</span>
                    <span class="ml-1 text-xs text-gray-500">(max: 8)</span>
                  </div>
                  <ToolValueControls
                    :value="relic14"
                    @update:value="relic14 = $event"
                    :minValue="0"
                    :maxValue="8"
                    :step="1"
                    :fastStep="5"
                    value-class="text-blue-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Results Section - ERWEITERT -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="header p-2">
            <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
              <IconCalculator size="16" class="mr-1.5 text-green-400" />
              Calculation Results
            </h3>
          </div>
          
          <div class="p-2 sm:p-3">
            <!-- ERWEITERT: 3 Spalten statt 2 -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
              
              <!-- Multi per Day -->
              <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-300 mb-1">Multiplier per Day</div>
                  <div class="text-2xl font-bold text-yellow-400">
                    {{ formatMulti(multiPerDay) }}
                  </div>
                </div>
              </div>
              
              <!-- Days to 1e333 -->
              <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-300 mb-1">Days to 1e333</div>
                  <div class="text-2xl font-bold text-blue-400">
                    {{ daysTo1e333 === Infinity ? '∞' : formatNumber(daysTo1e333) }}
                  </div>
                </div>
              </div>

              <!-- Current Multiplier -->
              <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-300 mb-1">Pending Multiplier</div>
                  <div class="text-2xl font-bold text-emerald-400">
                    {{ formatMulti(currentMultiplier) }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Details - ERWEITERT -->
            <div class="mt-3 bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <h4 class="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                <IconInfoCircle size="14" class="mr-1.5 text-blue-400" />
                Calculation Details
              </h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
                <div class="flex justify-between">
                  <span>Ticks per Day:</span> 
                  <span class="text-cyan-300">{{ formatNumber(ticksPerDay) }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span>Ticks per Operation:</span> 
                  <span class="text-cyan-300">{{ ticksPerOperation }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span>Operations per Operation:</span> 
                  <span class="text-green-300">{{ operationsPerOperation }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span>Retained Operations:</span> 
                  <span class="text-green-300">{{ retainedOperations }}%</span>
                </div>
                
                <div class="flex justify-between">
                  <span>Operations per Day:</span> 
                  <span class="text-orange-300">{{ formatNumber(operationsPerDay) }}</span>
                </div>

                <div class="flex justify-between">
                  <span>Retained per Day:</span> 
                  <span class="text-orange-300">{{ formatNumber(retainedPerDay) }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span>Days in LR:</span> 
                  <span class="text-emerald-300">{{ formatDaysInLR(daysInLR) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { 
  IconSettings, 
  IconRefresh,
  IconCalculator,
  IconClock,
  IconDeviceWatch,
  IconBadge,
  IconCircle,
  IconInfoCircle,
  IconShield,
  IconTarget  // NEU für Current Ticks
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// Input values - ERWEITERT
const tickSpeed = ref(1.5);
const ticksPerTick = ref(1);
const efficiencyBadge = ref(false);
const ts5 = ref(false);
const relic14 = ref(0);
const researchPoints = ref(0);
const currentTicksInLR = ref(0);  // NEU

// Toggle functions
function toggleEfficiencyBadge() {
  efficiencyBadge.value = !efficiencyBadge.value;
  saveSettings();
}

function toggleTS5() {
  ts5.value = !ts5.value;
  saveSettings();
}

// Berechnungen
const ticksPerDay = computed(() => (86400 / tickSpeed.value) * ticksPerTick.value);
const ticksPerOperation = computed(() => 29 - relic14.value);
const operationsPerOperation = computed(() => {
  let value = 1;
  if (efficiencyBadge.value) value *= 3;
  if (ts5.value) value *= 2;
  return value;
});

const operationsPerDay = computed(() => {
  if (ticksPerOperation.value <= 0) return Infinity; // Verhindert Division durch 0
  return (ticksPerDay.value / ticksPerOperation.value) * operationsPerOperation.value;
});

const affordableResearch = computed(() => {
  // Alle Forschungen zusammenfassen
  let allResearch = [...researchData];
  
  // Sortiere nach Bonus/Kosten-Effizienz (effizienteste zuerst)
  allResearch.sort((a, b) => {
    const efficiencyA = a.bonus / parseFloat(a.cost);
    const efficiencyB = b.bonus / parseFloat(b.cost);
    return efficiencyB - efficiencyA;
  });
  
  // Filtere nur die Forschungen, deren individuelle Kosten wir uns leisten können
  return allResearch.filter(research => {
    const cost = parseFloat(research.cost);
    return cost <= researchPoints.value;
  });
});

const retainedOperations = computed(() => {
  // Summe aller Boni der leistbaren Forschungen
  return affordableResearch.value.reduce((sum, research) => sum + research.bonus, 0);
});

const retainedPerDay = computed(() => operationsPerDay.value * (retainedOperations.value / 100));

const multiPerDay = computed(() => {
  const attributionRate = 0.001; // 0.10%
  return Math.pow(1 + attributionRate, retainedPerDay.value);
});

const daysTo1e333 = computed(() => {
  if (multiPerDay.value <= 1) return Infinity;
  return Math.log(1e111) / Math.log(multiPerDay.value) * 3;
});

// NEU: Current LR Berechnungen
const currentOperations = computed(() => {
  if (ticksPerOperation.value <= 0) return 0;
  return (currentTicksInLR.value / ticksPerOperation.value) * operationsPerOperation.value;
});

const currentRetained = computed(() => {
  return currentOperations.value * (retainedOperations.value / 100);
});

const currentMultiplier = computed(() => {
  if (currentRetained.value <= 0) return 1;
  const attributionRate = 0.001; // 0.10%
  return Math.pow(1 + attributionRate, currentRetained.value);
});

const daysInLR = computed(() => {
  if (currentTicksInLR.value === 0 || ticksPerTick.value === 0) return 0;
  
  // Ticks in Sekunden umrechnen: currentTicks / ticksPerTick = Sekunden
  const secondsInLR = currentTicksInLR.value / ticksPerTick.value;
  
  // Sekunden in Tage umrechnen: Sekunden / 86400
  const daysInLRValue = secondsInLR / 86400;
  
  return daysInLRValue;
});

// NEU: Formatierungsfunktion für Tage
function formatDaysInLR(days) {
  if (days === 0) return '0d';
  
  if (days < 1) {
    // Weniger als 1 Tag - zeige Stunden und Minuten
    const hours = Math.floor(days * 24);
    const minutes = Math.floor((days * 24 * 60) % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  } else if (days < 7) {
    // 1-7 Tage - zeige Tage mit einer Dezimalstelle
    return `${days.toFixed(1)}d`;
  } else if (days < 30) {
    // 1-4 Wochen - zeige Tage als ganze Zahl
    return `${Math.floor(days)}d`;
  } else if (days < 365) {
    // Monate - zeige Monate mit einer Dezimalstelle
    const months = days / 30.44; // Durchschnittliche Tage pro Monat
    return `${months.toFixed(1)}mo`;
  } else {
    // Jahre - zeige Jahre mit einer Dezimalstelle
    const years = days / 365.25; // Berücksichtigt Schaltjahre
    return `${years.toFixed(1)}y`;
  }
}

// Formatierungsfunktionen
function formatNumber(num) {
  if (num === Infinity) return '∞';
  if (num >= 1e15) {
    return num.toExponential(2).replace('+', '');
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

function formatMulti(num) {
  if (num === Infinity) return '∞';
  
  if (num >= 1000) {
    // Wissenschaftliche Notation in der Form a.bc × 10^n
    const exponent = Math.floor(Math.log10(num));
    const mantisse = num / Math.pow(10, exponent);
    
    // Format: a.bc × 10^n -> a.bce+n
    return mantisse.toFixed(2) + 'e' + exponent;
  }
  
  // Werte unter 1000 werden mit zwei Dezimalstellen
  return num.toFixed(2);
}

function resetSettings() {
  tickSpeed.value = 0;
  ticksPerTick.value = 1;
  efficiencyBadge.value = false;
  ts5.value = false;
  relic14.value = 0;
  researchPoints.value = 0;
  currentTicksInLR.value = 0;  // NEU
  saveSettings();
}

function saveSettings() {
  try {
    localStorage.setItem('attrGN3Calculator_settings', JSON.stringify({
      tickSpeed: tickSpeed.value,
      ticksPerTick: ticksPerTick.value,
      efficiencyBadge: efficiencyBadge.value,
      ts5: ts5.value,
      relic14: relic14.value,
      researchPoints: researchPoints.value,
      currentTicksInLR: currentTicksInLR.value  // NEU
    }));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

function loadSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem('attrGN3Calculator_settings') || '{}');
    
    if (savedSettings.tickSpeed !== undefined) tickSpeed.value = savedSettings.tickSpeed;
    if (savedSettings.ticksPerTick !== undefined) ticksPerTick.value = savedSettings.ticksPerTick;
    if (savedSettings.efficiencyBadge !== undefined) efficiencyBadge.value = savedSettings.efficiencyBadge;
    if (savedSettings.ts5 !== undefined) ts5.value = savedSettings.ts5;
    if (savedSettings.relic14 !== undefined) relic14.value = savedSettings.relic14;
    if (savedSettings.researchPoints !== undefined) researchPoints.value = savedSettings.researchPoints;
    if (savedSettings.currentTicksInLR !== undefined) currentTicksInLR.value = savedSettings.currentTicksInLR;  // NEU
  } catch (error) {
    console.error('Error loading saved settings:', error);
  }
}

const researchData = [
  { id: "research44", level: 2, bonus: 0.2, cost: "115" },
  { id: "research44", level: 4, bonus: 0.3, cost: "165" },
  { id: "research44", level: 6, bonus: 0.5, cost: "219" },
  { id: "research51", level: 2, bonus: 0.4, cost: "302" },
  { id: "research51", level: 4, bonus: 0.6, cost: "405" },
  { id: "research51", level: 6, bonus: 1, cost: "507" },
  { id: "research61", level: 2, bonus: 2, cost: "363" },
  { id: "research61", level: 4, bonus: 4, cost: "495" },
  { id: "research61", level: 6, bonus: 6, cost: "627" },
  { id: "research71", level: 2, bonus: 3, cost: "822" },
  { id: "research71", level: 4, bonus: 5, cost: "1165" },
  { id: "research71", level: 6, bonus: 7, cost: "1509" },
  { id: "research91", level: 1, bonus: 0.2, cost: "4500" },
  { id: "research91", level: 3, bonus: 0.6, cost: "5200" },
  { id: "research91", level: 5, bonus: 1, cost: "5900" },
];

// Watch for changes and save (excluding toggles, they save themselves)
watch([tickSpeed, ticksPerTick, relic14, researchPoints, currentTicksInLR], () => {
  saveSettings();
});

watch(tickSpeed, (newVal) => {
  // Korrigiert die Präzision, sobald sich der Wert ändert
  tickSpeed.value = parseFloat(newVal.toFixed(2));
}, { flush: 'post' });

// Load settings on mount
onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}
</style>