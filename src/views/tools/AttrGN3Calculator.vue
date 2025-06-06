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
                    :minValue="0"
                    :maxValue="100"
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
                    :maxValue="999999"
                    :step="1"
                    :fastStep="10"
                    value-class="text-yellow-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
                
                <!-- Efficiency Badge Toggle -->
                <div class="flex items-center justify-between">
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
                
                <!-- Relic #14 -->
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconShield size="16" class="text-orange-400" />
                    </div>
                    <span class="text-sm text-gray-300">Relic #14</span>
                  </div>
                  <ToolValueControls
                    :value="relic14"
                    @update:value="relic14 = $event"
                    :minValue="0"
                    :maxValue="100"
                    :step="1"
                    :fastStep="5"
                    value-class="text-orange-400 font-medium"
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
                  </div>
                  <ToolValueControls
                    :value="researchPoints"
                    @update:value="researchPoints = $event"
                    :minValue="0"
                    :maxValue="999999"
                    :step="1"
                    :fastStep="100"
                    value-class="text-blue-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Results Section - Placeholder for future calculations -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="header p-2">
            <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
              <IconCalculator size="16" class="mr-1.5 text-green-400" />
              Calculation Results
            </h3>
          </div>
          
          <div class="p-2 sm:p-3">
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50 text-center">
              <div class="text-gray-400 text-sm">
                <IconInfoCircle size="16" class="inline mr-1" />
                Calculation logic will be implemented later
              </div>
              
              <!-- Debug Info -->
              <div class="mt-4 text-xs text-gray-500 space-y-1">
                <div>Tick Speed: <span class="text-cyan-300">{{ tickSpeed }}</span></div>
                <div>Ticks per Tick: <span class="text-yellow-300">{{ ticksPerTick }}</span></div>
                <div>Efficiency Badge: <span :class="efficiencyBadge ? 'text-green-300' : 'text-red-300'">{{ efficiencyBadge ? 'Active' : 'Inactive' }}</span></div>
                <div>TS#5: <span :class="ts5 ? 'text-purple-300' : 'text-red-300'">{{ ts5 ? 'Active' : 'Inactive' }}</span></div>
                <div>Relic #14: <span class="text-orange-300">{{ relic14 }}</span></div>
                <div>Research Points: <span class="text-blue-300">{{ researchPoints }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { 
  IconSettings, 
  IconRefresh,
  IconCalculator,
  IconClock,
  IconDeviceWatch,
  IconBadge,
  IconCircle,
  IconInfoCircle,
  IconShield
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// Input values
const tickSpeed = ref(1.5);
const ticksPerTick = ref(1);
const efficiencyBadge = ref(false);
const ts5 = ref(false);
const relic14 = ref(0);
const researchPoints = ref(0);

// Toggle functions
function toggleEfficiencyBadge() {
  efficiencyBadge.value = !efficiencyBadge.value;
  saveSettings();
}

function toggleTS5() {
  ts5.value = !ts5.value;
  saveSettings();
}

function resetSettings() {
  tickSpeed.value = 0;
  ticksPerTick.value = 1;
  efficiencyBadge.value = false;
  ts5.value = false;
  relic14.value = 0;
  researchPoints.value = 0;
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
      researchPoints: researchPoints.value
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
  } catch (error) {
    console.error('Error loading saved settings:', error);
  }
}

// Watch for changes and save (excluding toggles, they save themselves)
watch([tickSpeed, ticksPerTick, relic14, researchPoints], () => {
  saveSettings();
});

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