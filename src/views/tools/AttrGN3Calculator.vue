<template>
  <div>
    <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
      <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8 border border-gray-800/80">
        <!-- Header -->
        <h2 class="text-2xl font-bold mb-4 text-center text-white">
          <span>Attraction GN#3 Calculator</span>
        </h2>
        
        <!-- Input Settings -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
          <div class="header p-3 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconSettings size="18" class="mr-2 text-blue-400" />
              Calculator Settings
            </h3>
            <button 
              @click="resetSettings" 
              class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconRefresh size="14" class="mr-1" />
              Reset
            </button>
          </div>
          <div class="p-3 sm:p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Left Column -->
              <div class="bg-gray-900/60 rounded-lg p-4 border border-gray-700/50">
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
                    <span class="text-sm text-gray-300">Research Points (e)</span>
                    <span class="ml-1 text-xs text-gray-500">(max: {{ maxResearchPoints }})</span>
                  </div>
                  <ToolValueControls
                    :value="researchPoints"
                    @update:value="researchPoints = $event"
                    :minValue="0"
                    :maxValue="maxResearchPoints"
                    :step="researchSteps"
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
                    :step="1000"
                    :fastStep="10000"
                    value-class="text-emerald-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
              </div>
              
              <!-- Right Column -->
              <div class="bg-gray-900/60 rounded-lg p-4 border border-gray-700/50">
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
                      class="relative inline-flex h-6 w-12 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      :class="{
                        'bg-purple-600': ts5,
                        'bg-gray-600': !ts5
                      }"
                      role="switch"
                      :aria-checked="ts5"
                    >
                      <span 
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
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
                      class="relative inline-flex h-6 w-12 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                      :class="{
                        'bg-green-600': efficiencyBadge,
                        'bg-gray-600': !efficiencyBadge
                      }"
                      role="switch"
                      :aria-checked="efficiencyBadge"
                    >
                      <span 
                        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
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

                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconStar size="16" class="text-pink-400" />
                    </div>
                    <span class="text-sm text-gray-300">Current AttrGN#3 Multi</span>
                    <InfoTooltip 
                      class="ml-1"
                      content="<b>Supported formats:</b><br/>
                      • Scientific notation: <code>1e100</code>, <code>5.5e50</code><br/>
                      • Suffixes: <code>1k</code>, <code>2.5m</code>, <code>100b</code>, <code>5t</code><br/>
                      • Available suffixes: k, m, b, t, qa, qu, sx, sp, oc, n, d<br/>"
                      placement="top"
                    />
                  </div>
                  
                  <div class="flex items-center">
                    <input
                      v-model="attrMultiplierInput"
                      @keydown.enter="handleAttrMultiplierSubmit"
                      @blur="handleInputBlur"
                      @focus="selectAllInput"
                      @click="selectAllInput"
                      type="text"
                      class="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-pink-400 font-medium text-sm w-24 text-right focus:outline-none focus:ring-2 focus:ring-pink-400"
                      placeholder="1e100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Results Section -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
          <div class="header p-3">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconCalculator size="18" class="mr-2 text-green-400" />
              Calculation Results
            </h3>
          </div>
          <div class="p-3 sm:p-4">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
              
              <!-- Multi per Day -->
              <div class="bg-gray-900/60 rounded-lg p-4 border border-gray-700/50">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-300 mb-1">Multiplier per Day</div>
                  <div class="text-2xl font-bold text-yellow-400">
                    {{ formatMulti(multiPerDay) }}
                  </div>
                </div>
              </div>
              
              <!-- Days to 1e333 -->
              <div class="bg-gray-900/60 rounded-lg p-4 border border-gray-700/50">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-300 mb-1">Days to 1e333</div>
                  <div class="text-2xl font-bold text-blue-400">
                    {{ daysTo1e333 === Infinity ? '∞' : daysTo1e333.toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- Days left to 1e333 -->
              <div class="bg-gray-900/60 rounded-lg p-4 border border-gray-700/50">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-300 mb-1">Days left to 1e333</div>
                  <div class="text-2xl font-bold text-orange-400">
                    {{ daysLeftTo1e333 === Infinity ? '∞' : daysLeftTo1e333.toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- Current Multiplier -->
              <div class="bg-gray-900/60 rounded-lg p-4 border border-gray-700/50">
                <div class="text-center">
                  <div class="text-sm font-semibold text-gray-300 mb-1">Pending Multiplier</div>
                  <div class="text-2xl font-bold text-emerald-400">
                    {{ formatMulti(currentMultiplier) }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Details -->
            <div class="mt-4 bg-gray-900/60 rounded-lg p-4 border border-gray-700/50">
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
import Decimal from 'break_infinity.js';
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
  IconTarget,
  IconStar
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';  
import { formatNumber } from '@/composables/format.js';
import { useGemPlannerStore } from '@/store/gemPlannerStore.js';

// Initialize gem planner store
const gemPlannerStore = useGemPlannerStore();

// Innovation Gem Level für Research91 Unlock
const innovationGemLevel = computed(() => {
  const innovationGem = gemPlannerStore.getGemState('innovation');
  return innovationGem?.level || 0;
});

// Max Research Points basierend auf Innovation Gem Level
const maxResearchPoints = computed(() => {
  return innovationGemLevel.value >= 3 ? 5900 : 1509;
});

// Research Steps für ToolValueControls - alle möglichen Research-Kosten
const researchSteps = computed(() => {
  // Verfügbare Research basierend auf Innovation Gem Level
  let availableResearch = [...researchData];
  if (innovationGemLevel.value < 3) {
    availableResearch = availableResearch.filter(research => research.id !== 'research91');
  }
  
  // Extrahiere alle Kosten und sortiere sie
  const costs = availableResearch.map(research => parseInt(research.cost));
  const uniqueCosts = [...new Set(costs)].sort((a, b) => a - b);
  
  // Füge 0 am Anfang hinzu falls nicht vorhanden
  if (!uniqueCosts.includes(0)) {
    uniqueCosts.unshift(0);
  }
  
  return uniqueCosts;
});

// Input values
const tickSpeed = ref(1.5);
const ticksPerTick = ref(1);
const efficiencyBadge = ref(false);
const ts5 = ref(false);
const relic14 = ref(0);
const researchPoints = ref(0);
const currentTicksInLR = ref(0);  
const currentAttrMultiplier = ref(new Decimal(1));
const attrMultiplierInput = ref('1');
const inputWasFocused = ref(false);

// Toggle functions
function toggleEfficiencyBadge() {
  efficiencyBadge.value = !efficiencyBadge.value;
  saveSettings();
}

function toggleTS5() {
  ts5.value = !ts5.value;
  saveSettings();
}

// Calculations
const ticksPerDay = computed(() => (86400 / tickSpeed.value) * ticksPerTick.value);
const ticksPerOperation = computed(() => 29 - relic14.value);
const operationsPerOperation = computed(() => {
  let value = 1;
  if (efficiencyBadge.value) value *= 3;
  if (ts5.value) value *= 2;
  return value;
});

const operationsPerDay = computed(() => {
  if (ticksPerOperation.value <= 0) return Infinity; // Prevent division by zero
  return (ticksPerDay.value / ticksPerOperation.value) * operationsPerOperation.value;
});

const affordableResearch = computed(() => {
  // Combine all research options
  let allResearch = [...researchData];
  
  // Filter out research91 if Innovation Gem level < 3
  if (innovationGemLevel.value < 3) {
    allResearch = allResearch.filter(research => research.id !== 'research91');
  }
  
  // Sort by bonus/cost efficiency (most efficient first)
  allResearch.sort((a, b) => {
    const efficiencyA = a.bonus / parseFloat(a.cost);
    const efficiencyB = b.bonus / parseFloat(b.cost);
    return efficiencyB - efficiencyA;
  });
  
  // Filter only research that we can afford with individual costs
  return allResearch.filter(research => {
    const cost = parseFloat(research.cost);
    return cost <= researchPoints.value;
  });
});

const retainedOperations = computed(() => {
  // Sum of all bonuses from affordable research
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

// Current LR calculations
const currentOperations = computed(() => {
  if (ticksPerOperation.value <= 0) return 0;
  return (currentTicksInLR.value / ticksPerOperation.value) * operationsPerOperation.value;
});

const currentRetained = computed(() => {
  return currentOperations.value * (retainedOperations.value / 100);
});

const currentMultiplier = computed(() => {
  if (currentRetained.value <= 0) return new Decimal(1);
  
  const attributionRate = 0.001; // 0.10%
  const base = new Decimal(1 + attributionRate);
  const calculatedMultiplier = base.pow(currentRetained.value);
  
  // Calculate the final result (Current * Pending)
  const finalResult = currentAttrMultiplier.value.mul(calculatedMultiplier);
  const maxValue = new Decimal('1e333');
  
  // If final result exceeds 1e333, limit the pending multiplier
  if (finalResult.gt(maxValue)) {
    // Calculate max pending multiplier: 1e333 / currentAttrMultiplier
    const maxPendingMultiplier = maxValue.div(currentAttrMultiplier.value);
    return maxPendingMultiplier.gte(1) ? maxPendingMultiplier : new Decimal(1);
  }
  
  return calculatedMultiplier;
});

const daysInLR = computed(() => {
  if (currentTicksInLR.value === 0 || tickSpeed.value === 0 || ticksPerTick.value === 0) return 0;
  
  // Number of actual "tick events" = currentTicksInLR / ticksPerTick
  const actualTickEvents = currentTicksInLR.value / ticksPerTick.value;
  
  // Each tick event lasts tickSpeed seconds
  const secondsInLR = actualTickEvents * tickSpeed.value;
  
  // Convert seconds to days
  const daysInLRValue = secondsInLR / 86400;
  
  return daysInLRValue;
});

const daysLeftTo1e333 = computed(() => {
  if (multiPerDay.value <= 1 || currentAttrMultiplier.value.lte(0)) return Infinity;
  
  try {
    // Target and current as Decimal
    const target = new Decimal('1e333');
    const current = currentAttrMultiplier.value;
    const dailyMulti = new Decimal(multiPerDay.value);
    
    if (current.gte(target)) return 0; // Already reached
    if (dailyMulti.lte(1)) return Infinity;
    
    // Use Decimal logarithms for large numbers
    const ratio = target.dividedBy(current);
    const logRatio = ratio.ln();
    const logDaily = dailyMulti.ln();
    
    if (logDaily <= 0) return Infinity; // No progress possible
    
    const totalDaysNeeded = logRatio / logDaily;
    
    // Check if the result is valid
    if (!isFinite(totalDaysNeeded) || isNaN(totalDaysNeeded) || totalDaysNeeded <= 0) {
      return Infinity;
    }
    
    // Subtract days already spent in current LR
    const remainingDays = totalDaysNeeded - daysInLR.value;
    
    return Math.max(0, remainingDays);
    
  } catch (error) {
    console.error('Calculation error:', error);
    return Infinity;
  }
});

// Format days in LR display
function formatDaysInLR(days) {
  if (days === 0) return '0d 0h 0m';
  
  const totalMinutes = Math.floor(days * 24 * 60);
  const wholeDays = Math.floor(totalMinutes / (24 * 60));
  const wholeHours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const remainingMinutes = totalMinutes % 60;
  
  return `${wholeDays}d ${wholeHours}h ${remainingMinutes}m`;
}

function formatMulti(num) {
  if (num === Infinity) return '∞';
  
  // Handle Decimal instances
  if (num instanceof Decimal) {
    if (num.gte(1000)) {
      return num.toExponential(2);
    }
    return num.toFixed(2);
  }
  
  // Handle regular numbers
  if (num >= 1000) {
    const exponent = Math.floor(Math.log10(num));
    const mantisse = num / Math.pow(10, exponent);
    return mantisse.toFixed(2) + 'e' + exponent;
  }
  
  return num.toFixed(2);
}

function parseSuffixValue(input) {
  if (input instanceof Decimal) return input;
  
  const str = input.toString().toLowerCase().trim();
  
  try {
    // Direct scientific notation 
    if (str.includes('e')) {
      const parsed = new Decimal(str);
      // Cap at maximum 1e333
      if (parsed.gt('1e333')) {
        return new Decimal('1e333');
      }
      return parsed;
    }
    
    // Suffix mapping with Decimal
    const suffixMap = {
      'k': new Decimal('1e3'),
      'm': new Decimal('1e6'),
      'b': new Decimal('1e9'),
      't': new Decimal('1e12'),
      'qa': new Decimal('1e15'),
      'qu': new Decimal('1e18'),
      'sx': new Decimal('1e21'),
      'sp': new Decimal('1e24'),
      'oc': new Decimal('1e27'),
      'n': new Decimal('1e30'),
      'd': new Decimal('1e33')
    };
    
    // Extract number and suffix
    const match = str.match(/^([0-9]*\.?[0-9]+)([a-z]+)?$/);
    
    if (!match) return new Decimal(1); // Fallback
    
    const numberStr = match[1];
    const suffix = match[2] || '';
    
    // Check if number is valid BEFORE creating Decimal
    if (!numberStr || isNaN(parseFloat(numberStr))) return new Decimal(1);
    
    const number = new Decimal(numberStr);
    
    // Multiply with suffix value
    const multiplier = suffixMap[suffix] || new Decimal(1);
    const result = number.mul(multiplier);
    
    // Cap at maximum 1e333
    if (result.gt('1e333')) {
      return new Decimal('1e333');
    }
    
    return result;
    
  } catch (error) {
    console.error('Parse error:', error);
    return new Decimal(1);
  }
}

function selectAllInput(event) {
  // Only select all on first click/focus
  if (!inputWasFocused.value) {
    setTimeout(() => {
      event.target.select();
    }, 10);
    inputWasFocused.value = true;
  }
}

function handleInputBlur(event) {
  inputWasFocused.value = false;
  handleAttrMultiplierSubmit();
}

function resetSettings() {
  tickSpeed.value = 0;
  ticksPerTick.value = 1;
  efficiencyBadge.value = false;
  ts5.value = false;
  relic14.value = 0;
  researchPoints.value = 0;
  currentTicksInLR.value = 0; 
  currentAttrMultiplier.value = new Decimal(1);
  attrMultiplierInput.value = '1';
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
      currentTicksInLR: currentTicksInLR.value,
      currentAttrMultiplier: currentAttrMultiplier.value.toString() // Store Decimal as string
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
    if (savedSettings.currentTicksInLR !== undefined) currentTicksInLR.value = savedSettings.currentTicksInLR;
    if (savedSettings.currentAttrMultiplier !== undefined) {
      // Restore Decimal from string
      currentAttrMultiplier.value = new Decimal(savedSettings.currentAttrMultiplier);
    }
  } catch (error) {
    console.error('Error loading saved settings:', error);
  }
}

// Handler for custom input
function handleAttrMultiplierSubmit() {
  const parsedValue = parseSuffixValue(attrMultiplierInput.value);
  currentAttrMultiplier.value = parsedValue;
  
  // Show warning if value was capped
  if (parsedValue.eq('1e333')) {
    const originalInput = attrMultiplierInput.value;
    const originalParsed = new Decimal(originalInput.includes('e') ? originalInput : '0');
    
    if (originalParsed.gt('1e333')) {
      console.log('Input was capped at maximum value of 1e333');
      // Optional: Visual feedback
      setTimeout(() => {
        // Brief visual effect (optional)
        const inputElement = document.querySelector('input[placeholder="1e100"]');
        if (inputElement) {
          inputElement.style.borderColor = '#f59e0b';
          setTimeout(() => {
            inputElement.style.borderColor = '';
          }, 1000);
        }
      }, 100);
    }
  }
  
  formatAttrMultiplierDisplay();
  saveSettings();
}

function formatAttrMultiplierDisplay() {
  try {
    // Display formatted version in input
    if (currentAttrMultiplier.value.gte(1000)) {
      // For very large numbers: scientific notation
      if (currentAttrMultiplier.value.gte('1e15')) {
        attrMultiplierInput.value = currentAttrMultiplier.value.toExponential(2);
      } else {
        // Normal formatting for smaller large numbers
        const exponent = Math.floor(currentAttrMultiplier.value.log10());
        const mantisse = currentAttrMultiplier.value.div(new Decimal(10).pow(exponent));
        attrMultiplierInput.value = mantisse.toFixed(2) + 'e' + exponent;
      }
    } else {
      attrMultiplierInput.value = currentAttrMultiplier.value.toString();
    }
  } catch (error) {
    console.error('Format error:', error);
    attrMultiplierInput.value = '1';
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

// Watch for sync between input and value
watch(currentAttrMultiplier, (newValue) => {
  // Only format when input field doesn't have focus
  if (document.activeElement !== document.querySelector('input[placeholder="1e100"]')) {
    if (newValue.gte(1000)) {
      attrMultiplierInput.value = formatMulti(newValue);
    } else {
      attrMultiplierInput.value = newValue.toString();
    }
  }
});

// Watch für Innovation Gem Level Änderungen - Research Points begrenzen
watch(innovationGemLevel, (newLevel) => {
  // Wenn Innovation Gem Level unter 3 fällt, begrenze Research Points auf 1509
  if (newLevel < 3 && researchPoints.value > 1509) {
    researchPoints.value = 1509;
    saveSettings();
  }
});

// Watch for changes and save (excluding toggles, they save themselves)
watch([tickSpeed, ticksPerTick, relic14, researchPoints, currentTicksInLR], () => {
  saveSettings();
});

watch(tickSpeed, (newVal) => {
  // Corrects precision when value changes
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