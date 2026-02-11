<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl border border-gray-800 p-4 sm:p-8">
      <!-- Header -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white flex items-center justify-center gap-2 md:hidden">
        <span>Mech Planner</span>
      </h2>
      
      <!-- Vectid Crystal Production Settings -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <img src="@/assets/ozzy/loot_mat3.png" class="w-7 h-7 mr-2" alt="Vectid Crystals" />
            Vectid Crystal Production
          </h3>
          
          <div class="flex items-center gap-2">
            <button 
              @click="resetProduction" 
              class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconRefresh size="14" class="mr-1" />
              Reset
            </button>
          </div>
        </div>
        
        <div class="p-2 sm:p-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Reference Build -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Reference Build</div>
              <div class="text-xs text-gray-400 mb-2">Select Ozzy Build</div>
              
              <select 
                v-model="selectedBuildId" 
                @change="updateFromSelectedBuild"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-500"
              >
                <option value="">Select a build...</option>
                <option v-for="build in ozzyBuilds" :key="build.id" :value="build.id">
                  {{ build.name }}
                </option>
              </select>
            </div>

            <!-- Current Vectid Crystals -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Current Vectid Crystals</div>
              <div class="text-xs text-gray-400 mb-2">Amount you have saved</div>
              
              <SuffixInput
                v-model="currentVectidCrystals"
                placeholder="0"
                :focus-ring-class="'focus:ring-green-500'"
                :placeholder-class="'placeholder-green-400'"
                class="w-full text-sm bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <!-- Daily Vectid Crystal Rate -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Vectid Crystals per Day</div>
              <div class="text-xs text-gray-400 mb-2">Calculated from Build</div>

              <div class="flex items-center bg-gray-800/80 py-2 px-3 rounded-lg border border-gray-700">
                <div class="text-green-400 text-base font-bold">{{ formatDecimalNumber(vectidCrystalsPerDay) }}</div>
                <div v-if="!selectedBuild" class="ml-2 text-gray-400 text-xs">
                  (select a build)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Global Settings (unchanged) -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-3">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
            <IconSettings size="16" class="mr-1.5 text-blue-400" />
            Global Settings
          </h3>
          
          <button 
            @click="resetSettings" 
            class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
          >
            <IconRefresh size="14" class="mr-1" />
            Reset All
          </button>
        </div>
        
        <div class="p-2 sm:p-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Left Column -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <!-- The C.O.O.R.S (Relic #8) -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                    <IconStar size="16" class="text-orange-400" />
                  </div>
                  <span class="text-sm text-gray-300">The C.O.O.R.S</span>
                  <span class="ml-1 text-xs text-gray-500">(Relic #8, max: 100)</span>
                </div>
                <ToolValueControls
                  :value="coorsRelic"
                  @update:value="coorsRelic = $event"
                  :minValue="0"
                  :maxValue="100"
                  :step="1"
                  :fastStep="10"
                  value-class="text-orange-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>

              <!-- The Tulsandstof Mech Creator Kit (Relic #15) -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                    <IconCpu size="16" class="text-green-400" />
                  </div>
                  <span class="text-sm text-gray-300">Tulsandstof Kit</span>
                  <span class="ml-1 text-xs text-gray-500">(Relic #15)</span>
                </div>
                <ToolValueControls
                  :value="tulsandstofKit"
                  @update:value="tulsandstofKit = $event"
                  :minValue="0"
                  :maxValue="8"
                  :step="1"
                  :fastStep="5"
                  value-class="text-green-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>

              <!-- Mech Engineer Tool-Pants -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                    <IconTool size="16" class="text-yellow-400" />
                  </div>
                  <span class="text-sm text-gray-300">Mech Engineer Tool-Pants</span>
                  <span class="ml-1 text-xs text-gray-500">(Gadget)</span>
                </div>
                <ToolValueControls
                  :value="mechEngineerToolPants"
                  @update:value="mechEngineerToolPants = $event"
                  :minValue="0"
                  :maxValue="999999"
                  :step="1"
                  :fastStep="10"
                  value-class="text-yellow-400 font-medium"
                  :autoEdit="true"
                  class="ml-2"
                />
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <!-- The Transmission Amplifier - nur wenn Creation Gem Level >= 4 -->
              <div v-if="creationGemLevel >= 4" class="space-y-2">
                <!-- Transmission Amplifier Tier -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconBook size="16" class="text-indigo-400" />
                    </div>
                    <span class="text-sm text-gray-300">Transmission Amplifier Tier</span>
                    <span class="ml-1 text-xs text-gray-500">(Trinket)</span>
                  </div>
                  <ToolValueControls
                    :value="transmissionAmplifierTier"
                    @update:value="transmissionAmplifierTier = $event"
                    :minValue="0"
                    :maxValue="999999"
                    :step="1"
                    :fastStep="10"
                    value-class="text-indigo-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>

                <!-- Transmission Amplifier Level -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-2">
                      <IconBook size="16" class="text-pink-400" />
                    </div>
                    <span class="text-sm text-gray-300">Transmission Amplifier Level</span>
                    <span class="ml-1 text-xs text-gray-500">(Trinket)</span>
                  </div>
                  <ToolValueControls
                    :value="transmissionAmplifierLevel"
                    @update:value="transmissionAmplifierLevel = $event"
                    :minValue="0"
                    :maxValue="999999"
                    :step="1"
                    :fastStep="10"
                    value-class="text-pink-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
              </div>
              
              <!-- Placeholder wenn Transmission Amplifier nicht verfügbar -->
              <div v-else class="text-center text-gray-400 text-sm py-8">
                <IconLock size="32" class="mx-auto mb-2 text-gray-500" />
                <p class="text-xs text-gray-500">
                  Requires Creation Gem Level 4
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mech Units Grid -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
        <div class="header p-3">
          <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
            <IconRobot size="25" class="mr-1.5 text-orange-400" />
            Mech Units
            <span class="ml-2 text-sm text-gray-400">
              ({{ visibleMechs.length }}/{{ mechs.length }} unlocked)
            </span>
          </h3>
        </div>
        
        <div class="p-2 sm:p-3">
          <!-- Grid: 2 Spalten für Desktop, 1 für Mobile -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div 
              v-for="(mech, index) in visibleMechs" 
              :key="mech.key" 
              :data-mech-key="mech.key"
              class="bg-gray-900/60 rounded-lg border border-gray-700/50 overflow-hidden"
            >
              <!-- Mech Header -->
              <div class="pr-3 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-lg">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <!-- Mech Asset Image -->
                    <div class="w-20 h-20  flex items-center justify-center mr-3 p-1">
                      <img 
                        v-if="getMechImagePath(index + 1)"
                        :src="getMechImagePath(index + 1)" 
                        :alt="mech.name"
                        class="w-full h-full object-contain rounded-lg"
                        @error="handleImageError"
                        style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;"
                      />
                      <!-- Fallback Icon wenn kein Bild geladen werden kann -->
                      <IconRobot 
                        v-else 
                        size="24" 
                        class="text-orange-400"
                      />
                    </div>
                    <div>
                      <h4 class="text-white font-semibold text-sm">{{ mech.name }}</h4>
                      <div class="text-xs text-gray-400">
                        Output: <span :class="getMechOutputClass(mech.color)">{{ mech.output }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Header Right Side: Nur für Nicht-Token Units -->
                  <div v-if="mech.key !== 'token_mk1'" class="flex items-center space-x-3">
                    <!-- Labels -->
                    <div class="text-right hidden sm:block">
                      <div class="text-xs text-gray-400 pt-1">Max Output Cap</div>
                      <div class="text-xs text-gray-400 pt-3">Current Multi</div>
                    </div>
                    
                    <!-- Werte -->
                    <div class="text-right">
                      <div class="text-lg font-bold text-red-400">
                        {{ formatDecimalNumber(getMaxCapacity(mech.key)) }}
                      </div>
                      <div class="text-lg font-bold text-yellow-400">
                        ×{{ formatMultiplier(getCurrentMultiplier(mech.key)) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Token Unit spezifisches Header -->
                  <div v-else class="flex items-center space-x-3">
                    <!-- Current Output per Cycle -->
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-400 hidden sm:block">Current Output per Cycle</span>
                      <span class="text-lg font-bold text-yellow-400">
                        {{ formatDecimalNumber(getTokensPerCycle(mech.key)) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mech Content -->
              <div class="p-3">
                <!-- Upgrade Controls Grid mit Best Upgrade Highlighting -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <!-- Mechs Owned -->
                  <div 
                    class="bg-gray-800/50 rounded-lg p-3 border"
                    :class="getBestUpgradeClass(mech.key, 'owned')"
                  >
                    <div class="flex items-center mb-2">
                      <IconUsers size="16" class="text-blue-400 mr-2" />
                      <span class="text-sm font-medium text-gray-300">Mechs Owned</span>
                      <span v-if="getBestUpgrade(mech.key) === 'owned'" class="ml-auto text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">
                        BEST
                      </span>
                    </div>
                    <div class="flex items-center justify-between mb-2">
                      <ToolValueControls
                        :value="mechSettings[mech.key]?.owned || 0"
                        @update:value="updateMechSetting(mech.key, 'owned', $event)"
                        :minValue="1"
                        :maxValue="999999"
                        :step="1"
                        :fastStep="10"
                        value-class="text-blue-400 font-medium"
                        :autoEdit="true"
                      />
                    </div>
                    <div class="text-xs text-gray-400">
                      Next Cost: <span class="text-blue-300">{{ formatDecimalNumber(getNextMechCost(mech.key)) }}</span>
                    </div>
                  </div>

                  <!-- Time Upgrades -->
                  <div 
                    class="bg-gray-800/50 rounded-lg p-3 border"
                    :class="getBestUpgradeClass(mech.key, 'time')"
                  >
                    <div class="flex items-center mb-2">
                      <IconClock size="16" class="text-yellow-400 mr-2" />
                      <span class="text-sm font-medium text-gray-300">Time Upgrades</span>
                      <span v-if="getBestUpgrade(mech.key) === 'time'" class="ml-auto text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">
                        BEST
                      </span>
                    </div>
                    <div class="flex items-center justify-between mb-2">
                      <ToolValueControls
                        :value="mechSettings[mech.key]?.timeUpgrades || 0"
                        @update:value="updateMechSetting(mech.key, 'timeUpgrades', $event)"
                        :minValue="0"
                        :maxValue="getEffectiveTimeMaxLevels(mech.key)"
                        :step="1"
                        :fastStep="10"
                        value-class="text-yellow-400 font-medium"
                        :autoEdit="true"
                        :additionalInfo="formatTime(getCurrentTimer(mech.key))"
                        additionalInfoClass="text-yellow-300 text-sm"
                        :showOnlyAdditionalInfo="true"
                      />
                    </div>
                    <div class="text-xs text-gray-400">
                      Next Cost: <span class="text-yellow-300">{{ formatDecimalNumber(getNextTimeCost(mech.key)) }}</span>
                    </div>
                  </div>

                  <!-- Multi Upgrades -->
                  <div 
                    class="bg-gray-800/50 rounded-lg p-3 border"
                    :class="getBestUpgradeClass(mech.key, 'multi')"
                  >
                    <div class="flex items-center mb-2">
                      <IconTrendingUp size="16" class="text-green-400 mr-2" />
                      <span class="text-sm font-medium text-gray-300">Multi Upgrades</span>
                      <span v-if="getBestUpgrade(mech.key) === 'multi'" class="ml-auto text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">
                        BEST
                      </span>
                    </div>
                    <div class="flex items-center justify-between mb-2">
                      <ToolValueControls
                        :value="mechSettings[mech.key]?.multiUpgrades || 0"
                        @update:value="updateMechSetting(mech.key, 'multiUpgrades', $event)"
                        :minValue="1"
                        :maxValue="mech.multiMaxLevels"
                        :step="1"
                        :fastStep="10"
                        value-class="text-green-400 font-medium"
                        :autoEdit="true"
                      />
                    </div>
                    <div class="text-xs text-gray-400">
                      Next Cost: <span class="text-green-300">{{ formatDecimalNumber(getNextMultiCost(mech.key)) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Output Information Grid - Unterschiedlich für Token vs Normal -->
                <div v-if="mech.key !== 'token_mk1'" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <!-- Current Output Multiplier -->
                  <div class="bg-gray-800/80 rounded-xl p-3 border border-gray-700/60">
                    <div class="flex items-center mb-2">
                      <IconChartLine size="16" class="text-purple-400 mr-2" />
                      <span class="text-sm font-medium text-gray-300">Current Output</span>
                      <InfoTooltip 
                        class="ml-1"
                        content="<b>Supported formats:</b><br/>
                        • Scientific notation: <code>1e100</code>, <code>5.5e50</code><br/>
                        • Suffixes: <code>1k</code>, <code>2.5m</code>, <code>100b</code>, <code>5t</code><br/>
                        • Available suffixes: k, m, b, t, qa, qu, sx, sp, oc, n, d<br/>"
                        placement="top"
                      />
                    </div>
                    <div class="flex items-center justify-between mb-2">
                      <input
                        :value="getCurrentOutputMultiplierInput(mech.key)"
                        @keydown.enter="handleOutputMultiplierSubmit(mech.key)"
                        @blur="handleOutputMultiplierBlur(mech.key)"
                        @focus="selectAllOutputInput($event, mech.key)"
                        @click="selectAllOutputInput($event, mech.key)"
                        @input="handleOutputMultiplierInput(mech.key, $event.target.value)"
                        type="text"
                        class="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-purple-400 font-medium text-sm w-full text-right"
                        placeholder="1e100"
                      />
                    </div>
                    <div class="text-xs text-gray-400">
                      Time to Cap: <span class="text-purple-300">{{ getTimeToCap(mech.key) }}</span>
                    </div>
                  </div>

                  <!-- Output Statistics -->
                  <div class="bg-gray-800/80 rounded-xl p-3 border border-gray-700/60">
                    <div class="flex items-center mb-2">
                      <IconTrendingUp size="16" class="text-cyan-400 mr-2" />
                      <span class="text-sm font-medium text-gray-300">Output Statistics</span>
                    </div>
                    <div class="space-y-2">
                      <!-- Output per Day -->
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-400">Per Day:</span>
                        <span class="text-xs text-cyan-300 font-medium">
                          {{ formatOutputStatistic(getOutputPerDay(mech.key)) }}
                        </span>
                      </div>
                      
                      <!-- Output per Week -->
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-400">Per Week:</span>
                        <span class="text-xs text-cyan-300 font-medium">
                          {{ formatOutputStatistic(getOutputPerWeek(mech.key)) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Token Unit spezifische Statistiken -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <!-- Token Generation -->
                  <div class="bg-gray-800/80 rounded-xl p-3 border border-gray-700/60">
                    <div class="flex items-center mb-2">
                      <IconStar size="16" class="text-yellow-400 mr-2" />
                      <span class="text-sm font-medium text-gray-300">Token Generation</span>
                    </div>
                    <div class="space-y-2">
                      <!-- Tokens per Cycle -->
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-400">Per Cycle:</span>
                        <span class="text-xs text-yellow-300 font-medium">
                          {{ formatDecimalNumber(getTokensPerCycle(mech.key)) }}
                        </span>
                      </div>
                      
                      <!-- Tokens per Day -->
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-400">Per Day:</span>
                        <span class="text-xs text-yellow-300 font-medium">
                          {{ formatDecimalNumber(getTokensPerDay(mech.key)) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Token Statistics -->
                  <div class="bg-gray-800/80 rounded-xl p-3 border border-gray-700/60">
                    <div class="flex items-center mb-2">
                      <IconTrendingUp size="16" class="text-cyan-400 mr-2" />
                      <span class="text-sm font-medium text-gray-300">Token Statistics</span>
                    </div>
                    <div class="space-y-2">
                      <!-- Tokens per Week -->
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-400">Per Week:</span>
                        <span class="text-xs text-cyan-300 font-medium">
                          {{ formatDecimalNumber(getTokensPerWeek(mech.key)) }}
                        </span>
                      </div>
                      
                      <!-- Cycles per Day -->
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-400">Cycles/Day:</span>
                        <span class="text-xs text-cyan-300 font-medium">
                          {{ formatDecimalNumber(getCyclesPerDay(mech.key)) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Locked Mechs Info -->
          <div v-if="lockedMechs.length > 0" class="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-600/50">
            <h4 class="text-sm font-medium text-gray-300 mb-2 flex items-center">
              <IconLock size="16" class="mr-2 text-gray-400" />
              Locked Mechs ({{ lockedMechs.length }})
            </h4>
            <div class="space-y-1">
              <div v-for="mech in lockedMechs" :key="mech.key" class="flex items-center justify-between text-xs">
                <span class="text-gray-400">{{ mech.name }}</span>
                <span class="text-purple-400 font-medium">
                  Requires Creation Gem Level {{ mech.unlock }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import Decimal from 'break_infinity.js';
import { 
  IconSettings, 
  IconRefresh,
  IconRobot,
  IconClock,
  IconUsers,
  IconTrendingUp,
  IconTarget,
  IconDiamond,
  IconStar,
  IconCpu,
  IconAssembly,
  IconTool,
  IconBook,
  IconBookmarks,
  IconChartLine,
  IconLock
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import SuffixInput from '@/composables/SuffixInput.vue';
import { formatNumber } from '@/composables/format.js';
import { 
  mechs, 
  getMechByKey,
  calculateTierCost,
  getTimeCostMultiplier
} from '@/constants/mech-planner/index.js';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import { useGemPlannerStore } from '@/store/gemPlannerStore.js';
import { useHunterStore } from '@/store/hunterStore';
import { useMechPlannerStore } from '@/store/mechPlannerStore.js';
import { shouldEvaluate } from '@/services/evaluationCacheService';

// Initialize stores
const gemPlannerStore = useGemPlannerStore();
const hunterStore = useHunterStore();
const mechPlannerStore = useMechPlannerStore();

// Build Selection State
const cachedResults = ref({});

// Lokale UI State (nicht im Store)
const inputWasFocused = ref({});
const mechImages = ref({});

// Store-Referenzen (Aliases für einfachere Nutzung)
const selectedBuildId = computed({
  get: () => mechPlannerStore.selectedBuildId,
  set: (value) => { mechPlannerStore.selectedBuildId = value; mechPlannerStore.saveToStorage(); }
});

const currentVectidCrystals = computed({
  get: () => mechPlannerStore.currentVectidCrystals,
  set: (value) => { mechPlannerStore.currentVectidCrystals = value; mechPlannerStore.saveToStorage(); }
});

const coorsRelic = computed({
  get: () => mechPlannerStore.coorsRelic,
  set: (value) => { mechPlannerStore.coorsRelic = value; mechPlannerStore.saveToStorage(); }
});

const tulsandstofKit = computed({
  get: () => mechPlannerStore.tulsandstofKit,
  set: (value) => { mechPlannerStore.tulsandstofKit = value; mechPlannerStore.saveToStorage(); }
});

const mechEngineerToolPants = computed({
  get: () => mechPlannerStore.mechEngineerToolPants,
  set: (value) => { mechPlannerStore.mechEngineerToolPants = value; mechPlannerStore.saveToStorage(); }
});

const transmissionAmplifierTier = computed({
  get: () => mechPlannerStore.transmissionAmplifierTier,
  set: (value) => { mechPlannerStore.transmissionAmplifierTier = value; mechPlannerStore.saveToStorage(); }
});

const transmissionAmplifierLevel = computed({
  get: () => mechPlannerStore.transmissionAmplifierLevel,
  set: (value) => { mechPlannerStore.transmissionAmplifierLevel = value; mechPlannerStore.saveToStorage(); }
});

const mechSettings = computed({
  get: () => mechPlannerStore.mechSettings,
  set: (value) => { mechPlannerStore.mechSettings = value; mechPlannerStore.saveToStorage(); }
});

const currentOutputMultiplier = computed({
  get: () => mechPlannerStore.currentOutputMultiplier,
  set: (value) => { mechPlannerStore.currentOutputMultiplier = value; mechPlannerStore.saveToStorage(); }
});

const currentOutputMultiplierInput = computed({
  get: () => mechPlannerStore.currentOutputMultiplierInput,
  set: (value) => { mechPlannerStore.currentOutputMultiplierInput = value; mechPlannerStore.saveToStorage(); }
});

const currentOutputTimestamps = computed({
  get: () => mechPlannerStore.currentOutputTimestamps,
  set: (value) => { mechPlannerStore.currentOutputTimestamps = value; mechPlannerStore.saveToStorage(); }
});

// Computed Properties für Ozzy Builds
const ozzyBuilds = computed(() => {
  return hunterStore.getBuildsForHunter('ozzy').filter(build => !build.isArchived);
});

const selectedBuild = computed(() => {
  if (!selectedBuildId.value) return null;
  return ozzyBuilds.value.find(build => String(build.id) === String(selectedBuildId.value));
});

const vectidCrystalsPerDay = computed(() => {
  if (!selectedBuildId.value) return new Decimal(0);
  
  const build = selectedBuild.value;
  if (build) {
    const result = cachedResults.value[build.id];
    if (result) {
      // mat3 ist Vectid Crystals bei Ozzy
      const mat3PerRun = result.mat3 || 0;
      const avgTime = result.avgTime || 120;
      
      // Berechne Vectid Crystals pro Tag
      const runsPerDay = 1440 / avgTime;
      const crystalsPerDay = mat3PerRun * runsPerDay;
      
      return new Decimal(crystalsPerDay);
    }
  }
  
  return new Decimal(0);
});

// Computed Properties für Creation Gem Werte (aus Gem Store)
const creationGemLevel = computed(() => {
  const creationGem = gemPlannerStore.getGemState('creation');
  return creationGem?.level || 0;
});

const creationGemNode1 = computed(() => {
  const creationGem = gemPlannerStore.getGemState('creation');
  return creationGem?.nodes?.[0] || false;
});

const creationGemNode2 = computed(() => {
  const creationGem = gemPlannerStore.getGemState('creation');
  return creationGem?.nodes?.[1] || false;
});

const creationMechBonusCap = computed(() => {
  const creationGem = gemPlannerStore.getGemState('creation');
  return creationGem?.upgrades?.['mech-bonus-cap'] || 0;
});

// Computed Properties für Unlock-System
const visibleMechs = computed(() => {
  return mechs.filter(mech => {
    // Wenn kein unlock property vorhanden ist, ist der Mech immer verfügbar
    if (!mech.unlock) return true;
    
    // Ansonsten muss das Creation Gem Level >= unlock sein
    return creationGemLevel.value >= mech.unlock;
  });
});

const lockedMechs = computed(() => {
  return mechs.filter(mech => {
    // Nur Mechs mit unlock property können gesperrt sein
    if (!mech.unlock) return false;
    
    // Gesperrt wenn Creation Gem Level < unlock
    return creationGemLevel.value < mech.unlock;
  });
});

// Initialize mech settings - nur für sichtbare Mechs
const initializeMechSettings = () => {
  // Initialisiere alle Mechs (auch die noch nicht sichtbaren)
  mechs.forEach(mech => {
    mechPlannerStore.initializeMechSettings(mech.key);
  });
};

// Initialize current output multiplier settings - nur für sichtbare Mechs
const initializeCurrentOutputMultiplier = () => {
  // Initialisiere alle Mechs (auch die noch nicht sichtbaren)
  mechs.forEach(mech => {
    mechPlannerStore.initializeMechSettings(mech.key);
    if (!inputWasFocused.value[mech.key]) {
      inputWasFocused.value[mech.key] = false;
    }
  });
};

// Watch für Creation Gem Level Änderungen (nur für Initialisierung)
watch(creationGemLevel, (newLevel, oldLevel) => {
  // Wenn das Level steigt, initialisiere neue Mechs
  if (newLevel > oldLevel) {
    initializeMechSettings();
    initializeCurrentOutputMultiplier();
  }
});

// Update mech setting helper
const updateMechSetting = (mechKey, setting, value) => {
  if (!mechSettings.value[mechKey]) {
    mechSettings.value[mechKey] = {
      owned: 1,
      timeUpgrades: 0,
      multiUpgrades: 1
    };
  }
  
  const oldValue = mechSettings.value[mechKey][setting];
  const newValue = value;
  
  // Wenn Wert erhöht wird, berechne Kosten und ziehe von Current Vectid Crystals ab
  if (newValue > oldValue) {
    const upgradeCount = newValue - oldValue;
    let totalCost = new Decimal(0);
    
    // Berechne Gesamtkosten für alle Upgrades
    for (let i = 0; i < upgradeCount; i++) {
      const tempSettings = { ...mechSettings.value[mechKey], [setting]: oldValue + i };
      let cost;
      
      if (setting === 'owned') {
        cost = getNextMechCostForSettings(mechKey, tempSettings);
      } else if (setting === 'timeUpgrades') {
        cost = getNextTimeCostForSettings(mechKey, tempSettings);
      } else if (setting === 'multiUpgrades') {
        cost = getNextMultiCostForSettings(mechKey, tempSettings);
      }
      
      if (cost && cost !== 'MAX' && !cost.eq(0)) {
        totalCost = totalCost.plus(cost);
      }
    }
    
    // Ziehe Kosten von Current Vectid Crystals ab
    if (totalCost.gt(0)) {
      const currentCrystals = new Decimal(currentVectidCrystals.value || 0);
      const newCrystals = currentCrystals.minus(totalCost);
      currentVectidCrystals.value = newCrystals.gte(0) ? newCrystals.toNumber() : 0;
      
      console.log(`[${mechKey}] Bought ${upgradeCount}x ${setting}:`, {
        totalCost: totalCost.toString(),
        oldCrystals: currentCrystals.toString(),
        newCrystals: newCrystals.toString()
      });
    }
  }
  
  mechPlannerStore.updateMechSettings(mechKey, { [setting]: value });
};

// Update current output multiplier
const updateCurrentOutputMultiplier = (mechKey, value) => {
  const decimalValue = value instanceof Decimal ? value : new Decimal(value);
  const inputString = currentOutputMultiplierInput.value[mechKey] || '1';
  
  mechPlannerStore.updateCurrentOutput(mechKey, decimalValue, inputString);
};

const getCurrentMultiplier = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings || settings.owned === 0) {
    return new Decimal(0);
  }
  
  // Spezialbehandlung für Token Unit
  if (mech.key === 'token_mk1') {
    // Für Token Unit: multiIncrease * multiUpgrades (keine baseMulti)
    return new Decimal(mech.multiIncrease || 10000).mul(settings.multiUpgrades || 1);
  }
  
  // Normale Formel für andere Mechs
  const baseValue = new Decimal(1);
  const multiIncreaseValue = new Decimal(mech.multiIncrease || 0);
  const baseMultiValue = new Decimal(mech.baseMulti || 0);
  
  const multiIncreaseBonus = multiIncreaseValue.mul(settings.multiUpgrades || 0);
  const mechsBonus = multiIncreaseBonus.mul(settings.owned || 0);
  
  const totalMultiplier = baseValue.add(mechsBonus).add(baseMultiValue);
    
  return totalMultiplier;
};

const getCurrentTimer = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings) return mech?.timeStart || 0;
  
  // Base time - time upgrades
  let currentTime = mech.timeStart;
  
  // Time upgrades: reduce by timeReduce seconds per level
  currentTime -= settings.timeUpgrades * mech.timeReduce;
  
  // Creation Gem Node #1 bonus: -30 minutes (1800 seconds)
  if (creationGemNode1.value) {
    currentTime -= 1800; // 30 * 60 = 1800 seconds
  }
  
  // Minimum 10 seconds
  return Math.max(10, currentTime);
};

const getMaxCapacity = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  
  // Token Unit hat keine Capacity
  if (mech?.key === 'token_mk1') {
    return new Decimal(0);
  }

  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings) return new Decimal(0);
  
  // Base capacity aus der mech definition
  let capacity = new Decimal(mech.baseCap);
  
  // COORS bonus: 1e5 per level
  if (coorsRelic.value > 0) {
    const coorsBonus = new Decimal(10).pow(5 * coorsRelic.value);
    capacity = capacity.mul(coorsBonus);
  }
  
  // Creation Gem Level und Mech Bonus Cap formula:
  // POW(POW(100000000, creation_mech_bonus_cap), (1 + (creation_gem_level * 0.1) - 0.1))
  if (creationGemLevel.value > 0 || creationMechBonusCap.value > 0) {
    const base = new Decimal(100000000); // 1e8
    const exponent1 = creationMechBonusCap.value;
    const exponent2 = 1 + (creationGemLevel.value * 0.1) - 0.1;
    
    // POW(100000000, creation_mech_bonus_cap)
    const firstPow = base.pow(exponent1);
    // POW(result, (1 + (creation_gem_level * 0.1) - 0.1))
    const gemBonusCapFormula = firstPow.pow(exponent2);
    
    capacity = capacity.mul(gemBonusCapFormula);
  }
  
  // Creation Gem Node #2 bonus für units mit creagn2: true
  if (mech.creagn2 && creationGemNode2.value) {
    const creagn2Bonus = new Decimal(10).pow(1000); // 1e1000
    capacity = capacity.mul(creagn2Bonus);
  }
  
  // Mech Engineer Tool-Pants bonus
  if (mechEngineerToolPants.value > 0) {
    // Math.pow(1.4, level) * Math.pow(10, Math.floor(level / 10))
    const toolPantsBonus1 = new Decimal(1.4).pow(mechEngineerToolPants.value);
    const toolPantsBonus2 = new Decimal(10).pow(Math.floor(mechEngineerToolPants.value / 10));
    const toolPantsBonus = toolPantsBonus1.mul(toolPantsBonus2);
    
    capacity = capacity.mul(toolPantsBonus);
  }
  
  // Transmission Amplifier bonus
  if (transmissionAmplifierLevel.value > 0) {
    // Base: 1e3, pro tier +1e1 auf die base
    const baseExponent = 3 + transmissionAmplifierTier.value; // 3 + tier
    const amplifierBonus = new Decimal(10).pow(baseExponent * transmissionAmplifierLevel.value);
    
    capacity = capacity.mul(amplifierBonus);
  }
  
  return capacity;
};

// Calculate time to cap
const getTimeToCap = (mechKey) => {
  const currentOutput = getCurrentOutputMultiplierDecimal(mechKey);
  const maxCapacity = getMaxCapacity(mechKey);
  const currentMulti = getCurrentMultiplier(mechKey);
  const currentTimer = getCurrentTimer(mechKey);
  
  // Wenn bereits gecappt oder keine Daten
  if (currentOutput.gte(maxCapacity) || currentMulti.eq(0) || currentOutput.eq(0)) {
    return 'Already capped or no data';
  }
  
  if (currentMulti.lte(1)) {
    return 'No growth (multiplier ≤ 1)';
  }
  
  try {
    // Verwende den Input-Wert direkt als Exponenten
    const currentExpInput = currentOutputMultiplierInput.value[mechKey] || '1';
    let currentExp = 0;
    
    // Parse den Input-Wert zu einem Exponenten
    if (currentExpInput.includes('e')) {
      const parts = currentExpInput.split('e');
      const base = parseFloat(parts[0]);
      const exp = parseInt(parts[1]);
      currentExp = exp + Math.log10(base);
    } else {
      // Für Suffix-Werte oder normale Zahlen
      const parsed = parseSuffixValue(currentExpInput);
      currentExp = parsed.log10();
    }
    
    // Schätze Max Capacity Exponent manuell
    const maxCapStr = maxCapacity.toString();
    
    let maxCapacityExp;
    if (maxCapStr.includes('e+')) {
      const parts = maxCapStr.split('e+');
      const base = parseFloat(parts[0]);
      const exp = parseInt(parts[1]);
      maxCapacityExp = exp + Math.log10(base);
    } else if (maxCapStr.includes('e')) {
      const parts = maxCapStr.split('e');
      const base = parseFloat(parts[0]);
      const exp = parseInt(parts[1]);
      maxCapacityExp = exp + Math.log10(base);
    } else {
      maxCapacityExp = Math.log10(parseFloat(maxCapStr));
    }
    
    // Current Multiplier log10
    const multiLog = Math.log10(currentMulti.toNumber());
    
    if (multiLog <= 0) {
      return 'No growth (log multiplier ≤ 0)';
    }
    
    // Berechne Cycles
    const expDifference = maxCapacityExp - currentExp;
    const cycles = expDifference / multiLog;
    
    if (!isFinite(cycles) || cycles <= 0 || isNaN(cycles)) {
      return 'Invalid calculation';
    }
    
    // Zeit in Sekunden
    const timeInSeconds = cycles * currentTimer;
    
    if (!isFinite(timeInSeconds)) {
      return 'Infinite time';
    }
    
    // Formatiere die Zeit
    const result = formatDuration(new Decimal(timeInSeconds));
    
    return result;
  } catch (error) {
    console.error('Error calculating time to cap:', error);
    return 'Calculation error';
  }
};

const formatDuration = (seconds) => {
  if (!(seconds instanceof Decimal)) {
    return 'Invalid';
  }
  
  if (seconds.eq(0)) return '0 minutes';
  
  if (seconds.lt(0)) {
    return 'Invalid (negative time)';
  }
  
  let totalSeconds;
  try {
    totalSeconds = seconds.toNumber();
  } catch (error) {
    return 'Number too large';
  }
  
  if (!isFinite(totalSeconds) || isNaN(totalSeconds)) {
    return 'Infinite time';
  }
  
  // Konstanten für Zeitumrechnung
  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 3600;
  const SECONDS_PER_DAY = 86400;
  const SECONDS_PER_YEAR = 31536000; // 365 Tage
  
  // Für sehr große Zeiten (über 100 Jahre) - vereinfacht anzeigen
  if (totalSeconds >= SECONDS_PER_YEAR * 100) {
    const years = Math.round(totalSeconds / SECONDS_PER_YEAR);
    return `${years} years`;
  }
  
  // Berechne Jahre, Tage, Stunden, Minuten
  const years = Math.floor(totalSeconds / SECONDS_PER_YEAR);
  const remainingAfterYears = totalSeconds % SECONDS_PER_YEAR;
  
  const days = Math.floor(remainingAfterYears / SECONDS_PER_DAY);
  const remainingAfterDays = remainingAfterYears % SECONDS_PER_DAY;
  
  const hours = Math.floor(remainingAfterDays / SECONDS_PER_HOUR);
  const remainingAfterHours = remainingAfterDays % SECONDS_PER_HOUR;
  
  const minutes = Math.round(remainingAfterHours / SECONDS_PER_MINUTE);
  
  // Baue die Ausgabe basierend auf der größten Einheit
  const parts = [];
  
  if (years > 0) {
    parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (days > 0) {
      parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    }
    if (hours > 0 && days === 0) { // Nur Stunden zeigen wenn keine Tage
      parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    }
  } else if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) {
      parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    }
    if (minutes > 0 && hours === 0) { // Nur Minuten zeigen wenn keine Stunden
      parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }
  } else if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    }
  } else {
    // Nur Minuten, keine Sekunden
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  
  // Verbinde die Teile mit Leerzeichen
  return parts.join(' ');
};

const getStatus = (mechKey) => {
  const settings = mechSettings.value[mechKey];
  
  if (!settings || settings.owned === 0) return 'Inactive';
  
  const currentMulti = getCurrentMultiplier(mechKey);
  const maxCapacity = getMaxCapacity(mechKey);
  
  if (currentMulti.gte(maxCapacity)) return 'Capped';
  
  return 'Active';
};

const getStatusColor = (mechKey) => {
  const status = getStatus(mechKey);
  
  switch (status) {
    case 'Active': return 'text-green-400';
    case 'Capped': return 'text-red-400';
    case 'Inactive': return 'text-gray-400';
    default: return 'text-gray-400';
  }
};

const getProgressPercentage = (mechKey) => {
  // Placeholder for timer progress - würde in real implementation einen Timer brauchen
  return Math.random() * 100;
};

// Formatting functions
const formatMultiplier = (value) => {
  if (value instanceof Decimal) {
    if (value.eq(0)) return '0';
    if (value.lt(1000)) return value.toFixed(2);
    
    let exponentialString = value.toExponential(2);
    // Entferne das '+' nach dem 'e'
    exponentialString = exponentialString.replace('e+', 'e');
    return exponentialString;
  }
  return '0';
};

// Korrigierte formatNumber Funktion für Decimal-Werte
const formatDecimalNumber = (value) => {
  // Spezialbehandlung für MAX
  if (value === 'MAX') {
    return '-';
  }
  
  if (value instanceof Decimal) {
    if (value.eq(0)) return '0';
    
    // Für sehr große Zahlen (über 1e39 statt 1e36) verwende Exponential-Notation
    if (value.gte(1e39)) {
      let exponentialString = value.toExponential(2);
      // Entferne das '+' nach dem 'e'
      exponentialString = exponentialString.replace('e+', 'e');
      return exponentialString;
    }
    
    // Für kleinere Zahlen verwende die erweiterte Suffix-Formatierung
    if (value.lt(Number.MAX_SAFE_INTEGER)) {
      const numberValue = value.toNumber();
      return formatNumberWithSuffixes(numberValue);
    }
    
    // Für mittlere große Zahlen: Teste ob sie im Suffix-Bereich sind
    if (value.lt(1e39)) {
      try {
        const numberValue = value.toNumber();
        if (isFinite(numberValue)) {
          return formatNumberWithSuffixes(numberValue);
        }
      } catch (error) {
        // Fallback to exponential
      }
    }
    
    // Für mittlere große Zahlen verwende Exponential-Notation
    return value.toExponential(2);
  }
  
  // Für normale Zahlen verwende die Suffix-Formatierung
  return formatNumberWithSuffixes(value);
};

const formatOutputStatistic = (value) => {
  if (!(value instanceof Decimal)) {
    return '0';
  }
  
  if (value.eq(0)) {
    return '0';
  }
  
  // Für Zahlen unter 1000: normale Anzeige ohne 'e'
  if (value.lt(1000)) {
    const numValue = value.toNumber();
    
    if (numValue >= 100) {
      return numValue.toFixed(0);
    } else if (numValue >= 10) {
      return numValue.toFixed(1);
    } else if (numValue >= 1) {
      return numValue.toFixed(2);
    } else {
      return numValue.toFixed(3);
    }
  }
  
  // Für Zahlen >= 1000: wissenschaftliche Notation mit 2 Dezimalstellen
  let exponentialString = value.toExponential(2);
  
  // Entferne das '+' nach dem 'e'
  exponentialString = exponentialString.replace('e+', 'e');
  
  return exponentialString;
};

// Formatierungsfunktion mit den gleichen Suffixen wie formatNumber
const formatNumberWithSuffixes = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  // Sonderbehandlung für Werte sehr nahe bei Null
  if (Math.abs(value) < 0.01) {
    return '0';
  }
  
  // Behandlung für kleine Werte zwischen 0.01 und 1
  if (Math.abs(value) < 1) {
    return value.toFixed(2);
  }
  
  const absValue = Math.abs(value);
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','oc','n','d'];
  
  // Berechne die Größenordnung korrekt
  let tier = Math.max(0, Math.min(Math.floor(Math.log10(absValue) / 3), suffixes.length - 1));
  
  // Für Werte < 1000, zeige ohne Suffix
  if (tier === 0) {
    // Verwende weniger Dezimalstellen für größere Zahlen
    if (absValue >= 100) {
      return value.toFixed(0);
    } else if (absValue >= 10) {
      return value.toFixed(1);
    } else {
      return value.toFixed(2);
    }
  }
  
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  
  // Formatiere die skalierte Zahl mit 2 Dezimalstellen + Suffix
  return `${scaledValue.toFixed(2)}${suffix}`;
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Cost calculation functions
const getNextMechCost = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings) return new Decimal(0);
  
  // Formula: mechCost * (mechCostMulti ^ owned)
  const cost = new Decimal(mech.mechCost).mul(
    new Decimal(mech.mechCostMulti).pow(settings.owned - 1)
  );
  
  return cost;
};

// Hilfsfunktion für erweiterte Time Max Levels
const getEffectiveTimeMaxLevels = (mechKey) => {
  const mech = getMechByKey(mechKey);
  if (!mech) return 0;
  
  // Base max levels + Tulsandstof Kit bonus (+5 per level)
  const baseMaxLevels = mech.timeMaxLevels;
  const tulsandstofBonus = tulsandstofKit.value * 5;
  
  return baseMaxLevels + tulsandstofBonus;
};

// Aktualisierte getNextTimeCost Funktion
const getNextTimeCost = (mechKey) => {
  const mech = getMechByKey(mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings) return new Decimal(0);
  
  // Verwende die erweiterten Max Levels durch Tulsandstof Kit
  const effectiveMaxLevels = getEffectiveTimeMaxLevels(mechKey);
  
  if (settings.timeUpgrades >= effectiveMaxLevels) {
    return 'MAX'; // Spezialwert für Max Level
  }
  
  // Verwende Tier-basierte Berechnung wenn Tiers vorhanden, sonst Fallback
  if (mech.timeCostTiers) {
    const cost = calculateTierCost(mech.timeCost, settings.timeUpgrades, mech.timeCostTiers);
    return new Decimal(cost);
  } else {
    // Fallback zur alten Methode
    const cost = new Decimal(mech.timeCost).mul(
      new Decimal(mech.timeCostMulti).pow(settings.timeUpgrades)
    );
    return cost;
  }
};

const getNextMultiCost = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings) return new Decimal(0);
  
  if (settings.multiUpgrades >= mech.multiMaxLevels) {
    return 'MAX'; // Spezialwert für Max Level
  }
  
  // Formula: multiCost * (multiCostMulti ^ multiUpgrades)
  const cost = new Decimal(mech.multiCost).mul(
    new Decimal(mech.multiCostMulti).pow(settings.multiUpgrades - 1)
  );
  
  return cost;
};

// Helper functions für Mech-Farben
const getMechIconClass = (color) => {
  const colorMap = {
    'green': 'bg-green-500',
    'red': 'bg-red-500',
    'blue': 'bg-blue-500',
    'orange': 'bg-orange-500',
    'yellow': 'bg-yellow-500',
    'brown': 'bg-amber-500'
  };
  
  return colorMap[color] || 'bg-orange-500';
};

const getMechOutputClass = (color) => {
  const colorMap = {
    'green': 'text-green-400',
    'red': 'text-red-400',
    'blue': 'text-blue-400',
    'cyan': 'text-cyan-400',
    'orange': 'text-orange-400',
    'yellow': 'text-yellow-400',
    'brown': 'text-amber-400'
  };
  
  return colorMap[color] || 'text-green-400';
};

// Lade alle Mech-Bilder dynamisch
async function loadMechImages() {
  try {
    // Lade alle Mech-Bilder (1-11) dynamisch
    const imagePromises = [];
    for (let i = 1; i <= 11; i++) {
      imagePromises.push(
        import(`@/assets/mechs/${i}.png`)
          .then(module => ({ id: i, url: module.default }))
          .catch(error => {
            console.warn(`Could not load mech image ${i}:`, error);
            return { id: i, url: null };
          })
      );
    }
    
    const results = await Promise.all(imagePromises);
    
    // Speichere die URLs in mechImages
    results.forEach(result => {
      mechImages.value[result.id] = result.url;
    });
    
    console.log('Loaded mech images:', mechImages.value);
  } catch (error) {
    console.error('Error loading mech images:', error);
  }
}

// Mech image path helper 
const getMechImagePath = (index) => {
  return mechImages.value[index] || null;
};

// Load cached results for Ozzy builds
async function loadCachedResults() {
  try {
    console.log('[MechPlanner] Loading cached results for Ozzy builds...');
    console.log('[MechPlanner] Available Ozzy builds:', ozzyBuilds.value.map(b => ({ id: b.id, name: b.name })));
    
    // Cache für jeden Build einzeln prüfen
    for (const build of ozzyBuilds.value) {
      console.log(`[MechPlanner] Checking cache for build "${build.name}" (ID: ${build.id})`);
      
      const cache = await shouldEvaluate({
        hunterId: 'ozzy',
        buildData: build,
        hunterStore,
        gemPlannerStore
      });
      
      console.log(`[MechPlanner] Cache status for build "${build.name}":`, cache);
      
      if (cache?.cachedResult) {
        console.log(`[MechPlanner] Cache found for build "${build.name}":`, {
          buildId: cache.cachedResult.buildId || 'none',
          avgStage: cache.cachedResult.avgStage,
          mat3: cache.cachedResult.mat3
        });
        
        cachedResults.value[build.id] = cache.cachedResult;
      }
    }
    
    console.log('[MechPlanner] Final cached results:', Object.keys(cachedResults.value).length, 'builds cached');
  } catch (error) {
    console.error('[MechPlanner] Error loading cached results:', error);
  }
}

// Update from selected build
function updateFromSelectedBuild() {
  if (!selectedBuildId.value) {
    return;
  }
  
  const build = selectedBuild.value;
  if (build) {
    const result = cachedResults.value[build.id];
    if (result) {
      console.log(`[MechPlanner] Using cached result for build "${build.name}":`, result);
    }
  }
  
  // Store speichert automatisch via computed setter
}

// Reset production settings
function resetProduction() {
  mechPlannerStore.resetProduction();
}

// Error handler for missing images
const handleImageError = (event) => {
  // Fallback zu einem Standard-Icon wenn das Bild nicht gefunden wird
  event.target.style.display = 'none';
  // Zeige stattdessen das IconRobot
  const parent = event.target.parentElement;
  if (parent && !parent.querySelector('.fallback-icon')) {
    const fallbackIcon = document.createElement('div');
    fallbackIcon.className = 'fallback-icon w-full h-full flex items-center justify-center';
    fallbackIcon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-400"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
    parent.appendChild(fallbackIcon);
  }
};

const getTokensPerCycle = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings || mech.key !== 'token_mk1') {
    return new Decimal(0);
  }
  
  // Für Token Unit: multiIncrease * multiUpgrades * owned
  const tokensPerCycle = new Decimal(mech.multiIncrease || 10000)
    .mul(settings.multiUpgrades || 1)
    .mul(settings.owned || 1);
  
  return tokensPerCycle;
};

const getTokensPerDay = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  
  if (!mech || mech.key !== 'token_mk1') {
    return new Decimal(0);
  }
  
  const tokensPerCycle = getTokensPerCycle(mechKey);
  const cyclesPerDay = getCyclesPerDay(mechKey);
  
  return tokensPerCycle.mul(cyclesPerDay);
};

const getTokensPerWeek = (mechKey) => {
  const tokensPerDay = getTokensPerDay(mechKey);
  return tokensPerDay.mul(7);
};

const getCyclesPerDay = (mechKey) => {
  const currentTimer = getCurrentTimer(mechKey);
  
  if (currentTimer === 0) {
    return new Decimal(0);
  }
  
  // Cycles pro Tag: 86400 Sekunden / Timer
  const cyclesPerDay = 86400 / currentTimer;
  
  return new Decimal(cyclesPerDay);
};

// Settings management
const resetSettings = () => {
  // Reset via Store
  mechPlannerStore.resetAll();
  
  // Re-initialisiere Mech Settings
  mechs.forEach(mech => {
    mechPlannerStore.initializeMechSettings(mech.key);
    mechPlannerStore.updateMechSettings(mech.key, {
      owned: 1,
      timeUpgrades: 0,
      multiUpgrades: 1
    });
  });
};

// Get current output multiplier as input value (string)
const getCurrentOutputMultiplierInput = (mechKey) => {
  return currentOutputMultiplierInput.value[mechKey] || '1';
};

// Get current output multiplier as Decimal
const getCurrentOutputMultiplierDecimal = (mechKey) => {
  const value = currentOutputMultiplier.value[mechKey] || new Decimal(1);
  return value.lt(1) ? new Decimal(1) : value;
};

// Parse suffix values 
function parseSuffixValue(input) {
  if (input instanceof Decimal) return input.lt(1) ? new Decimal(1) : input;
  
  const str = input.toString().toLowerCase().trim();
  
  try {
    // Direkte wissenschaftliche Notation (1e500, 1.5e1000, etc.)
    if (str.includes('e')) {
      const parsed = new Decimal(str);
      // Begrenze auf maximal 1e9999 und minimum 1
      if (parsed.gt('1e9999')) {
        return new Decimal('1e9999');
      }
      if (parsed.lt(1)) {
        return new Decimal(1);
      }
      return parsed;
    }
    
    // Suffix-Mapping mit Decimal
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
    
    // Extrahiere Zahl und Suffix
    const match = str.match(/^([0-9]*\.?[0-9]+)([a-z]+)?$/);
    
    if (!match) return new Decimal(1); // Fallback
    
    const numberStr = match[1];
    const suffix = match[2] || '';
    
    // Prüfe ob die Zahl gültig ist BEVOR wir Decimal erstellen
    if (!numberStr || isNaN(parseFloat(numberStr))) return new Decimal(1);
    
    const number = new Decimal(numberStr);
    
    // Multipliziere mit Suffix-Wert
    const multiplier = suffixMap[suffix] || new Decimal(1);
    const result = number.mul(multiplier);
    
    // Begrenze auf maximal 1e9999 und minimum 1
    if (result.gt('1e9999')) {
      return new Decimal('1e9999');
    }
    if (result.lt(1)) {
      return new Decimal(1);
    }
    
    return result;
    
  } catch (error) {
    console.error('Parse error:', error);
    return new Decimal(1);
  }
}

// Format multiplier for display
function formatMultiplierForDisplay(value) {
  try {
    if (value.gte(1000)) {
      // Für sehr große Zahlen: wissenschaftliche Notation
      if (value.gte('1e15')) {
        return value.toExponential(2);
      } else {
        // Normale Formatierung für kleinere große Zahlen
        const exponent = Math.floor(value.log10());
        const mantisse = value.div(new Decimal(10).pow(exponent));
        return mantisse.toFixed(2) + 'e' + exponent;
      }
    } else {
      return value.toString();
    }
  } catch (error) {
    console.error('Format error:', error);
    return '1';
  }
}

// Input handlers
function selectAllOutputInput(event, mechKey) {
  // Nur beim ersten Klick/Focus alles auswählen
  if (!inputWasFocused.value[mechKey]) {
    setTimeout(() => {
      event.target.select();
    }, 10);
    inputWasFocused.value[mechKey] = true;
  }
}

function handleOutputMultiplierInput(mechKey, value) {
  // Aktualisiere sofort den Input-Wert ohne Parsing
  currentOutputMultiplierInput.value[mechKey] = value;
}

function handleOutputMultiplierBlur(mechKey) {
  inputWasFocused.value[mechKey] = false;
  handleOutputMultiplierSubmit(mechKey);
}

function handleOutputMultiplierSubmit(mechKey) {
  const inputValue = getCurrentOutputMultiplierInput(mechKey);
  const parsedValue = parseSuffixValue(inputValue);
  
  // Stelle sicher, dass der Wert mindestens 1 ist
  const finalValue = parsedValue.lt(1) ? new Decimal(1) : parsedValue;
  
  // Update via Store (speichert automatisch)
  mechPlannerStore.updateCurrentOutput(mechKey, finalValue, inputValue);
  
  // Formatiere die Anzeige nur wenn das Input nicht fokussiert ist
  if (!inputWasFocused.value[mechKey]) {
    formatOutputMultiplierDisplay(mechKey);
  }
}

function formatOutputMultiplierDisplay(mechKey) {
  const value = currentOutputMultiplier.value[mechKey];
  if (!value) return;
  
  try {
    currentOutputMultiplierInput.value[mechKey] = formatMultiplierForDisplay(value);
  } catch (error) {
    console.error('Format error:', error);
    currentOutputMultiplierInput.value[mechKey] = '1';
  }
}

const getOutputPerDay = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  
  // Spezialbehandlung für Token Unit
  if (mech?.key === 'token_mk1') {
    return getTokensPerDay(mechKey);
  }
  
  // Normale Berechnung für andere Mechs
  const currentMulti = getCurrentMultiplier(mechKey);
  const currentTimer = getCurrentTimer(mechKey);
  
  if (currentMulti.eq(0) || currentTimer === 0) {
    return new Decimal(0);
  }
  
  // Timer in Tagen umrechnen
  const timerInDays = currentTimer / 86400;
  
  // n-te Wurzel: Multi^(1/timerInDays)
  const outputPerDay = currentMulti.pow(1 / timerInDays);
  
  return outputPerDay;
};

const getOutputPerWeek = (mechKey) => {
  const mech = mechs.find(m => m.key === mechKey);
  
  // Spezialbehandlung für Token Unit
  if (mech?.key === 'token_mk1') {
    return getTokensPerWeek(mechKey);
  }
  
  // Normale Berechnung für andere Mechs
  const outputPerDay = getOutputPerDay(mechKey);
  
  // Output pro Woche: outputPerDay^7
  const outputPerWeek = outputPerDay.pow(7);
  
  return outputPerWeek;
};

// GREEDY BUDGET OPTIMIZER - Findet beste Upgrade-Kombination für verfügbares Budget
const getBestUpgradePath = (mechKey, availableBudget) => {
  const mech = mechs.find(m => m.key === mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings) return { totalImprovement: new Decimal(0), upgrades: [], remainingBudget: availableBudget };
  
  const upgrades = [];
  let remainingBudget = new Decimal(availableBudget);
  let currentSettings = { ...settings };
  let currentOutput = getOutputPerDay(mechKey);
  let iteration = 0;
  
  // Greedy-Algorithmus: Kaufe immer das beste Preis-Leistungs-Upgrade
  while (remainingBudget.gt(0)) {
    iteration++;
    const options = [];
    
    // Option 1: Owned Upgrade
    const mechCost = getNextMechCostForSettings(mechKey, currentSettings);
    if (mechCost !== 'MAX' && !mechCost.eq(0) && mechCost.lte(remainingBudget)) {
      const testSettings = { ...currentSettings, owned: currentSettings.owned + 1 };
      const newOutput = simulateOutputPerDayWithSettings(mechKey, testSettings);
      const improvement = newOutput.sub(currentOutput);
      const efficiency = improvement.div(mechCost); // Verbesserung pro ausgegebener Einheit
      
      options.push({
        type: 'owned',
        cost: mechCost,
        improvement: improvement,
        efficiency: efficiency,
        newSettings: testSettings,
        newOutput: newOutput
      });
    }
    
    // Option 2: Time Upgrade
    const timeCost = getNextTimeCostForSettings(mechKey, currentSettings);
    const effectiveMaxLevels = getEffectiveTimeMaxLevels(mechKey);
    if (timeCost !== 'MAX' && !timeCost.eq(0) && timeCost.lte(remainingBudget) && currentSettings.timeUpgrades < effectiveMaxLevels) {
      const testSettings = { ...currentSettings, timeUpgrades: currentSettings.timeUpgrades + 1 };
      const newOutput = simulateOutputPerDayWithSettings(mechKey, testSettings);
      const improvement = newOutput.sub(currentOutput);
      const efficiency = improvement.div(timeCost);
      
      options.push({
        type: 'time',
        cost: timeCost,
        improvement: improvement,
        efficiency: efficiency,
        newSettings: testSettings,
        newOutput: newOutput
      });
    }
    
    // Option 3: Multi Upgrade
    const multiCost = getNextMultiCostForSettings(mechKey, currentSettings);
    if (multiCost !== 'MAX' && !multiCost.eq(0) && multiCost.lte(remainingBudget) && currentSettings.multiUpgrades < mech.multiMaxLevels) {
      const testSettings = { ...currentSettings, multiUpgrades: currentSettings.multiUpgrades + 1 };
      const newOutput = simulateOutputPerDayWithSettings(mechKey, testSettings);
      const improvement = newOutput.sub(currentOutput);
      const efficiency = improvement.div(multiCost);
      
      options.push({
        type: 'multi',
        cost: multiCost,
        improvement: improvement,
        efficiency: efficiency,
        newSettings: testSettings,
        newOutput: newOutput
      });
    }
    
    // Kein kaufbares Upgrade mehr verfügbar
    if (options.length === 0) {
      break;
    }
    
    // Wähle das Upgrade mit der besten Effizienz (improvement/cost)
    const best = options.sort((a, b) => b.efficiency.minus(a.efficiency).toNumber())[0];
    
    upgrades.push({
      type: best.type,
      cost: best.cost,
      improvement: best.improvement,
      efficiency: best.efficiency
    });
    
    remainingBudget = remainingBudget.minus(best.cost);
    currentSettings = best.newSettings;
    currentOutput = best.newOutput;
  }
  
  // Berechne Gesamtverbesserung
  const totalImprovement = upgrades.reduce((sum, u) => sum.plus(u.improvement), new Decimal(0));
  
  return {
    totalImprovement: totalImprovement,
    upgrades: upgrades,
    remainingBudget: remainingBudget,
    finalSettings: currentSettings
  };
};

// Helper: Berechne Kosten für Settings (nicht current mech state)
// Diese Funktionen müssen die gleiche Logik wie getNextMechCost etc. verwenden
const getNextMechCostForSettings = (mechKey, settings) => {
  const mech = mechs.find(m => m.key === mechKey);
  if (!mech) return new Decimal(0);
  
  // Formula: mechCost * (mechCostMulti ^ (owned - 1))
  const cost = new Decimal(mech.mechCost).mul(
    new Decimal(mech.mechCostMulti).pow(settings.owned - 1)
  );
  
  return cost;
};

const getNextTimeCostForSettings = (mechKey, settings) => {
  const mech = getMechByKey(mechKey);
  if (!mech) return new Decimal(0);
  
  // Verwende die erweiterten Max Levels durch Tulsandstof Kit
  const effectiveMaxLevels = getEffectiveTimeMaxLevels(mechKey);
  
  if (settings.timeUpgrades >= effectiveMaxLevels) {
    return 'MAX'; // Spezialwert für Max Level
  }
  
  // Verwende Tier-basierte Berechnung wenn Tiers vorhanden, sonst Fallback
  if (mech.timeCostTiers) {
    const cost = calculateTierCost(mech.timeCost, settings.timeUpgrades, mech.timeCostTiers);
    return new Decimal(cost);
  } else {
    // Fallback zur alten Methode
    const cost = new Decimal(mech.timeCost).mul(
      new Decimal(mech.timeCostMulti).pow(settings.timeUpgrades)
    );
    return cost;
  }
};

const getNextMultiCostForSettings = (mechKey, settings) => {
  const mech = mechs.find(m => m.key === mechKey);
  if (!mech) return new Decimal(0);
  
  if (settings.multiUpgrades >= mech.multiMaxLevels) {
    return 'MAX'; // Spezialwert für Max Level
  }
  
  // Formula: multiCost * (multiCostMulti ^ (multiUpgrades - 1))
  // WICHTIG: multiUpgrades - 1, genau wie in getNextMultiCost!
  const cost = new Decimal(mech.multiCost).mul(
    new Decimal(mech.multiCostMulti).pow(settings.multiUpgrades - 1)
  );
  
  return cost;
};

const simulateOutputPerDayWithSettings = (mechKey, settings) => {
  const mech = mechs.find(m => m.key === mechKey);
  if (!mech) return new Decimal(0);
  
  // Spezialbehandlung für Token Unit
  if (mech.key === 'token_mk1') {
    // Token Unit verwendet einfache Multiplikation
    return new Decimal(mech.multiIncrease || 10000).mul(settings.multiUpgrades || 1);
  }
  
  // Berechne Multiplier mit den gegebenen Settings
  // Formel: 1 + (multiIncrease * multiUpgrades * owned) + baseMulti
  const baseValue = new Decimal(1);
  const multiIncreaseValue = new Decimal(mech.multiIncrease || 0);
  const baseMultiValue = new Decimal(mech.baseMulti || 0);
  
  const multiIncreaseBonus = multiIncreaseValue.mul(settings.multiUpgrades || 0);
  const mechsBonus = multiIncreaseBonus.mul(settings.owned || 0);
  
  const totalMultiplier = baseValue.add(mechsBonus).add(baseMultiValue);
  
  if (totalMultiplier.eq(0) || settings.owned === 0) {
    return new Decimal(0);
  }
  
  // Berechne Timer mit den gegebenen Settings
  let currentTime = mech.timeStart;
  
  // Time upgrades: reduce by timeReduce seconds per level
  currentTime -= settings.timeUpgrades * mech.timeReduce;
  
  // Creation Gem Node #1 bonus: -30 minutes (1800 seconds)
  if (creationGemNode1.value) {
    currentTime -= 1800;
  }
  
  // Minimum 10 seconds
  currentTime = Math.max(10, currentTime);
  
  if (currentTime === 0) {
    return new Decimal(0);
  }
  
  // Timer in Tagen umrechnen
  const timerInDays = currentTime / 86400;
  
  // n-te Wurzel: Multi^(1/timerInDays)
  const outputPerDay = totalMultiplier.pow(1 / timerInDays);
  
  return outputPerDay;
};

// Kosten-Nutzen-Analyse Funktionen - ROI-BASIERTE IMPLEMENTATION
const getUpgradeEfficiency = (mechKey, upgradeType) => {
  const mech = mechs.find(m => m.key === mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings) return new Decimal(0);
  
  // Get daily income from selected build
  const dailyIncome = vectidCrystalsPerDay.value;
  
  // Get current available crystals
  const availableCrystals = new Decimal(currentVectidCrystals.value || 0);
  
  // If no build selected, can't calculate time-based efficiency
  if (dailyIncome.eq(0)) {
    // Fallback to old simple cost-based efficiency
    return getSimpleEfficiency(mechKey, upgradeType);
  }
  
  try {
    // NEUE STRATEGIE: Vergleiche einzelnes Upgrade mit optimalem Budget-Pfad
    
    // Was kostet das einzelne Upgrade?
    let singleCost;
    if (upgradeType === 'owned') {
      singleCost = getNextMechCost(mechKey);
    } else if (upgradeType === 'time') {
      singleCost = getNextTimeCost(mechKey);
    } else { // multi
      singleCost = getNextMultiCost(mechKey);
    }
    
    if (singleCost === 'MAX' || singleCost.eq(0)) return new Decimal(0);
    
    // Wenn wir genug Budget haben, vergleiche:
    // Option A: Nur dieses Upgrade kaufen
    // Option B: Optimal mehrere günstige Upgrades kaufen
    
    if (availableCrystals.gte(singleCost)) {
      // Budget ist verfügbar - vergleiche die Optionen
      
      // Option A: Einzelnes Upgrade
      const currentPerDayOutput = getOutputPerDay(mechKey);
      let singleUpgradeSettings;
      if (upgradeType === 'owned') {
        singleUpgradeSettings = { ...settings, owned: settings.owned + 1 };
      } else if (upgradeType === 'time') {
        singleUpgradeSettings = { ...settings, timeUpgrades: settings.timeUpgrades + 1 };
      } else {
        singleUpgradeSettings = { ...settings, multiUpgrades: settings.multiUpgrades + 1 };
      }
      const singleUpgradeOutput = simulateOutputPerDay(mechKey, singleUpgradeSettings);
      const singleImprovement = singleUpgradeOutput.sub(currentPerDayOutput);
      
      // Option B: Greedy Budget Path
      const budgetPath = getBestUpgradePath(mechKey, availableCrystals);
      const budgetImprovement = budgetPath.totalImprovement;
      
      // Wenn das einzelne Upgrade dieses upgradeType ist, vergleiche mit Budget-Path
      // Die Effizienz ist: wie viel Verbesserung bekomme ich für den selben Preis?
      // Wenn Budget-Path besser ist, sollte dieses Upgrade NICHT empfohlen werden
      
      // Effizienz = Improvement pro verfügbarem Budget
      // Einzelnes Upgrade: Nutze nur einen Teil des Budgets
      const singleEfficiency = singleImprovement.div(singleCost);
      
      // Budget Path: Nutzt das gesamte Budget optimal
      const usedBudget = availableCrystals.minus(budgetPath.remainingBudget);
      const budgetEfficiency = usedBudget.gt(0) ? budgetImprovement.div(usedBudget) : new Decimal(0);
      
      // Wenn Budget Path dieses Upgrade NICHT als erstes kauft, ist es suboptimal
      const firstUpgradeInPath = budgetPath.upgrades.length > 0 ? budgetPath.upgrades[0].type : null;
      
      if (firstUpgradeInPath === upgradeType) {
        // Dieses Upgrade ist tatsächlich das beste - gib hohe Effizienz
        return budgetEfficiency;
      } else {
        // Ein anderes Upgrade wäre besser - gib niedrigere Effizienz
        // Aber nicht 0, damit es immer noch angezeigt wird
        return singleEfficiency.mul(0.5); // Reduziere Effizienz um 50%
      }
    }
    
    // Nicht genug Budget - verwende alte ROI-basierte Logik
    const evaluationPeriodDays = 365;
    const currentPerDayOutput = getOutputPerDay(mechKey);
    
    if (upgradeType === 'owned') {
      // Simuliere +1 Mech Owned
      const mechCost = getNextMechCost(mechKey);
      if (mechCost === 'MAX' || mechCost.eq(0)) return new Decimal(0);
      
      // Simuliere neue Settings mit +1 owned
      const newSettings = { ...settings, owned: settings.owned + 1 };
      const newPerDayOutput = simulateOutputPerDay(mechKey, newSettings);
      
      // Verbesserung pro Tag
      const improvementPerDay = newPerDayOutput.sub(currentPerDayOutput);
      
      // Berechne tatsächlich benötigte Zeit unter Berücksichtigung verfügbarer Crystals
      let timeToBuyInDays;
      if (availableCrystals.gte(mechCost)) {
        // Genug Crystals vorhanden - sofort kaufbar!
        timeToBuyInDays = new Decimal(0);
      } else {
        // Berechne wie viel noch fehlt
        const remainingCost = mechCost.sub(availableCrystals);
        timeToBuyInDays = remainingCost.div(dailyIncome);
      }
      
      // Wie viele Tage profitiere ich von der Verbesserung? (Evaluationsperiode - Wartezeit)
      const benefitDays = Math.max(0, evaluationPeriodDays - timeToBuyInDays.toNumber());
      
      // Kumulativer Gewinn über die Benefitzeit
      const cumulativeGain = improvementPerDay.mul(benefitDays);
      
      // ROI: Gewinn / Kosten (je höher, desto besser)
      const roi = cumulativeGain.div(mechCost);
      
      if (mechKey === 'zag_mk2') {
        console.log(`[${mechKey}] Owned ROI:`, {
          cost: mechCost.toString(),
          availableCrystals: availableCrystals.toString(),
          remainingCost: availableCrystals.gte(mechCost) ? 0 : mechCost.sub(availableCrystals).toString(),
          timeToBuyDays: timeToBuyInDays.toNumber(),
          improvementPerDay: improvementPerDay.toString(),
          benefitDays: benefitDays,
          cumulativeGain: cumulativeGain.toString(),
          roi: roi.toString()
        });
      }
      
      return roi;
    }
    
    if (upgradeType === 'time') {
      // Simuliere +1 Time Upgrade
      const timeCost = getNextTimeCost(mechKey);
      if (timeCost === 'MAX' || timeCost.eq(0)) return new Decimal(0);
      
      const effectiveMaxLevels = getEffectiveTimeMaxLevels(mechKey);
      if (settings.timeUpgrades >= effectiveMaxLevels) return new Decimal(0);
      
      // Simuliere neue Settings mit +1 timeUpgrades
      const newSettings = { ...settings, timeUpgrades: settings.timeUpgrades + 1 };
      const newPerDayOutput = simulateOutputPerDay(mechKey, newSettings);
      
      // Verbesserung pro Tag
      const improvementPerDay = newPerDayOutput.sub(currentPerDayOutput);
      
      // Berechne tatsächlich benötigte Zeit unter Berücksichtigung verfügbarer Crystals
      let timeToBuyInDays;
      if (availableCrystals.gte(timeCost)) {
        // Genug Crystals vorhanden - sofort kaufbar!
        timeToBuyInDays = new Decimal(0);
      } else {
        // Berechne wie viel noch fehlt
        const remainingCost = timeCost.sub(availableCrystals);
        timeToBuyInDays = remainingCost.div(dailyIncome);
      }
      
      // Wie viele Tage profitiere ich von der Verbesserung?
      const benefitDays = Math.max(0, evaluationPeriodDays - timeToBuyInDays.toNumber());
      
      // Kumulativer Gewinn über die Benefitzeit
      const cumulativeGain = improvementPerDay.mul(benefitDays);
      
      // ROI: Gewinn / Kosten
      const roi = cumulativeGain.div(timeCost);
      
      if (mechKey === 'zag_mk2') {
        console.log(`[${mechKey}] Time ROI:`, {
          cost: timeCost.toString(),
          availableCrystals: availableCrystals.toString(),
          remainingCost: availableCrystals.gte(timeCost) ? 0 : timeCost.sub(availableCrystals).toString(),
          timeToBuyDays: timeToBuyInDays.toNumber(),
          improvementPerDay: improvementPerDay.toString(),
          benefitDays: benefitDays,
          cumulativeGain: cumulativeGain.toString(),
          roi: roi.toString()
        });
      }
      
      return roi;
    }
    
    if (upgradeType === 'multi') {
      // Simuliere +1 Multi Upgrade
      const multiCost = getNextMultiCost(mechKey);
      if (multiCost === 'MAX' || multiCost.eq(0)) return new Decimal(0);
      
      if (settings.multiUpgrades >= mech.multiMaxLevels) return new Decimal(0);
      
      // Simuliere neue Settings mit +1 multiUpgrades
      const newSettings = { ...settings, multiUpgrades: settings.multiUpgrades + 1 };
      const newPerDayOutput = simulateOutputPerDay(mechKey, newSettings);
      
      // Verbesserung pro Tag
      const improvementPerDay = newPerDayOutput.sub(currentPerDayOutput);
      
      // Berechne tatsächlich benötigte Zeit unter Berücksichtigung verfügbarer Crystals
      let timeToBuyInDays;
      if (availableCrystals.gte(multiCost)) {
        // Genug Crystals vorhanden - sofort kaufbar!
        timeToBuyInDays = new Decimal(0);
      } else {
        // Berechne wie viel noch fehlt
        const remainingCost = multiCost.sub(availableCrystals);
        timeToBuyInDays = remainingCost.div(dailyIncome);
      }
      
      // Wie viele Tage profitiere ich von der Verbesserung?
      const benefitDays = Math.max(0, evaluationPeriodDays - timeToBuyInDays.toNumber());
      
      // Kumulativer Gewinn über die Benefitzeit
      const cumulativeGain = improvementPerDay.mul(benefitDays);
      
      // ROI: Gewinn / Kosten
      const roi = cumulativeGain.div(multiCost);
      
      if (mechKey === 'zag_mk2') {
        console.log(`[${mechKey}] Multi ROI:`, {
          cost: multiCost.toString(),
          availableCrystals: availableCrystals.toString(),
          remainingCost: availableCrystals.gte(multiCost) ? 0 : multiCost.sub(availableCrystals).toString(),
          timeToBuyDays: timeToBuyInDays.toNumber(),
          improvementPerDay: improvementPerDay.toString(),
          benefitDays: benefitDays,
          cumulativeGain: cumulativeGain.toString(),
          roi: roi.toString()
        });
      }
      
      return roi;
    }
    
    return new Decimal(0);
  } catch (error) {
    console.error('Error calculating efficiency for', mechKey, upgradeType, error);
    return new Decimal(0);
  }
};

// Fallback: Simple cost-based efficiency (when no build selected)
const getSimpleEfficiency = (mechKey, upgradeType) => {
  const mech = mechs.find(m => m.key === mechKey);
  const settings = mechSettings.value[mechKey];
  
  if (!mech || !settings) return new Decimal(0);
  
  try {
    const currentPerDayOutput = getOutputPerDay(mechKey);
    
    if (upgradeType === 'owned') {
      const mechCost = getNextMechCost(mechKey);
      if (mechCost === 'MAX' || mechCost.eq(0)) return new Decimal(0);
      
      const newSettings = { ...settings, owned: settings.owned + 1 };
      const newPerDayOutput = simulateOutputPerDay(mechKey, newSettings);
      const improvement = newPerDayOutput.sub(currentPerDayOutput);
      
      return improvement.div(mechCost);
    }
    
    if (upgradeType === 'time') {
      const timeCost = getNextTimeCost(mechKey);
      if (timeCost === 'MAX' || timeCost.eq(0)) return new Decimal(0);
      
      const effectiveMaxLevels = getEffectiveTimeMaxLevels(mechKey);
      if (settings.timeUpgrades >= effectiveMaxLevels) return new Decimal(0);
      
      const newSettings = { ...settings, timeUpgrades: settings.timeUpgrades + 1 };
      const newPerDayOutput = simulateOutputPerDay(mechKey, newSettings);
      const improvement = newPerDayOutput.sub(currentPerDayOutput);
      
      return improvement.div(timeCost);
    }
    
    if (upgradeType === 'multi') {
      const multiCost = getNextMultiCost(mechKey);
      if (multiCost === 'MAX' || multiCost.eq(0)) return new Decimal(0);
      
      if (settings.multiUpgrades >= mech.multiMaxLevels) return new Decimal(0);
      
      const newSettings = { ...settings, multiUpgrades: settings.multiUpgrades + 1 };
      const newPerDayOutput = simulateOutputPerDay(mechKey, newSettings);
      const improvement = newPerDayOutput.sub(currentPerDayOutput);
      
      return improvement.div(multiCost);
    }
    
    return new Decimal(0);
  } catch (error) {
    console.error('Error calculating simple efficiency for', mechKey, upgradeType, error);
    return new Decimal(0);
  }
};

// Hilfsfunktion um Output Per Day mit simulierten Settings zu berechnen
const simulateOutputPerDay = (mechKey, simulatedSettings) => {
  const mech = mechs.find(m => m.key === mechKey);
  if (!mech) return new Decimal(0);
  
  // Spezialbehandlung für Token Unit
  if (mech.key === 'token_mk1') {
    return simulateTokensPerDay(mechKey, simulatedSettings);
  }
  
  // Normale Berechnung für andere Mechs
  const simulatedMulti = simulateCurrentMultiplier(mechKey, simulatedSettings);
  const simulatedTimer = simulateCurrentTimer(mechKey, simulatedSettings);
  
  if (simulatedMulti.eq(0) || simulatedTimer === 0) {
    return new Decimal(0);
  }
  
  // Timer in Tagen umrechnen
  const timerInDays = simulatedTimer / 86400;
  
  // n-te Wurzel: Multi^(1/timerInDays)
  const outputPerDay = simulatedMulti.pow(1 / timerInDays);
  
  return outputPerDay;
};

const simulateTokensPerDay = (mechKey, simulatedSettings) => {
  const mech = mechs.find(m => m.key === mechKey);
  if (!mech || mech.key !== 'token_mk1') {
    return new Decimal(0);
  }
  
  // Simuliere Token per Cycle
  const tokensPerCycle = new Decimal(mech.multiIncrease || 10000)
    .mul(simulatedSettings.multiUpgrades || 1)
    .mul(simulatedSettings.owned || 1);
  
  // Simuliere Timer
  const simulatedTimer = simulateCurrentTimer(mechKey, simulatedSettings);
  
  if (simulatedTimer === 0) {
    return new Decimal(0);
  }
  
  // Cycles pro Tag
  const cyclesPerDay = 86400 / simulatedTimer;
  
  // Tokens pro Tag
  const tokensPerDay = tokensPerCycle.mul(cyclesPerDay);
  
  return tokensPerDay;
};

// Hilfsfunktion um getCurrentMultiplier mit simulierten Settings zu berechnen
const simulateCurrentMultiplier = (mechKey, simulatedSettings) => {
  const mech = mechs.find(m => m.key === mechKey);
  if (!mech || !simulatedSettings || simulatedSettings.owned === 0) {
    return new Decimal(0);
  }
  
  // Spezialbehandlung für Token Unit
  if (mech.key === 'token_mk1') {
    // Für Token Unit: multiIncrease * multiUpgrades * owned
    return new Decimal(mech.multiIncrease || 10000)
      .mul(simulatedSettings.multiUpgrades || 1)
      .mul(simulatedSettings.owned || 1);
  }
  
  // Normale Formel für andere Mechs
  const baseValue = new Decimal(1);
  const multiIncreaseValue = new Decimal(mech.multiIncrease || 0);
  const baseMultiValue = new Decimal(mech.baseMulti || 0);
  
  const multiIncreaseBonus = multiIncreaseValue.mul(simulatedSettings.multiUpgrades || 0);
  const mechsBonus = multiIncreaseBonus.mul(simulatedSettings.owned || 0);
  
  const totalMultiplier = baseValue.add(mechsBonus).add(baseMultiValue);
    
  return totalMultiplier;
};

// Hilfsfunktion um getCurrentTimer mit simulierten Settings zu berechnen
const simulateCurrentTimer = (mechKey, simulatedSettings) => {
  const mech = mechs.find(m => m.key === mechKey);
  if (!mech || !simulatedSettings) return mech?.timeStart || 0;
  
  // Base time - time upgrades
  let currentTime = mech.timeStart;
  
  // Time upgrades: reduce by timeReduce seconds per level
  currentTime -= simulatedSettings.timeUpgrades * mech.timeReduce;
  
  // Creation Gem Node #1 bonus: -30 minutes (1800 seconds)
  if (creationGemNode1.value) {
    currentTime -= 1800;
  }
  
  // Minimum 10 seconds
  return Math.max(10, currentTime);
};

// Aktualisierte getBestUpgrade Funktion (bleibt gleich)
const getBestUpgrade = (mechKey) => {
  const efficiencies = {
    owned: getUpgradeEfficiency(mechKey, 'owned'),
    time: getUpgradeEfficiency(mechKey, 'time'),
    multi: getUpgradeEfficiency(mechKey, 'multi')
  };
  
  // Stelle sicher, dass alle Effizienzen Decimal-Objekte sind
  if (!(efficiencies.owned instanceof Decimal)) efficiencies.owned = new Decimal(0);
  if (!(efficiencies.time instanceof Decimal)) efficiencies.time = new Decimal(0);
  if (!(efficiencies.multi instanceof Decimal)) efficiencies.multi = new Decimal(0);
  
  // Finde das Upgrade mit der höchsten Effizienz
  let bestUpgrade = 'owned';
  let bestEfficiency = efficiencies.owned;
  
  if (efficiencies.time.gt(bestEfficiency)) {
    bestUpgrade = 'time';
    bestEfficiency = efficiencies.time;
  }
  
  if (efficiencies.multi.gt(bestEfficiency)) {
    bestUpgrade = 'multi';
    bestEfficiency = efficiencies.multi;
  }
  
  // Wenn alle Effizienzen 0 sind, return null
  if (bestEfficiency.eq(0)) {
    return null;
  }
  
  return bestUpgrade;
};

// Aktualisierte formatEfficiency Funktion für bessere Lesbarkeit
const formatEfficiency = (efficiency) => {
  if (!(efficiency instanceof Decimal) || efficiency.eq(0)) {
    return '0';
  }
  
  // Für sehr kleine Werte
  if (efficiency.lt(0.001)) {
    let exponentialString = efficiency.toExponential(2);
    exponentialString = exponentialString.replace('e+', 'e');
    return exponentialString;
  }
  
  // Für normale kleine Werte
  if (efficiency.lt(1)) {
    return efficiency.toFixed(4);
  }
  
  // Für mittelgroße Werte
  if (efficiency.lt(1000)) {
    return efficiency.toFixed(3);
  }
  
  // Für große Werte
  let exponentialString = efficiency.toExponential(2);
  exponentialString = exponentialString.replace('e+', 'e');
  return exponentialString;
};

const getBestUpgradeClass = (mechKey, upgradeType) => {
  const bestUpgrade = getBestUpgrade(mechKey);
  
  if (bestUpgrade === upgradeType) {
    return 'border-green-500 shadow-lg shadow-green-500/20';
  }
  
  return 'border-gray-700/50';
};

// saveSettings ist nicht mehr nötig - Store speichert automatisch via computed setters
// Alte Funktion entfernt, alle Änderungen werden direkt im Store gespeichert

// loadSettings ist nicht mehr nötig - Store lädt beim init()
// Alte Funktion entfernt, Daten kommen direkt aus dem Store

// Watchers nicht mehr nötig - Store speichert automatisch via computed setters

// Watch für currentOutputMultiplier - nur für Display-Update
watch(currentOutputMultiplier, (newValue) => {
  // Aktualisiere die Input-Felder NUR wenn sie nicht fokussiert sind
  Object.keys(newValue).forEach(mechKey => {
    const activeElement = document.activeElement;
    const isInputFocused = activeElement && activeElement.type === 'text' && 
                          activeElement.placeholder === '1e100';
    
    // Nur formatieren wenn das Input nicht fokussiert ist UND der User nicht gerade tippt
    if (!isInputFocused && !inputWasFocused.value[mechKey]) {
      formatOutputMultiplierDisplay(mechKey);
    }
  });
}, { deep: true });

// Watch für currentVectidCrystals - Store speichert automatisch
// Kein Watch mehr nötig

// Watch für hunterStore changes (reload cached results)
watch(() => hunterStore.getBuildsForHunter('ozzy'), () => {
  // Wenn sich die Builds im Store ändern, lade die Ergebnisse neu
  loadCachedResults();
}, { deep: true });

// Initialize on mount
onMounted(async () => {
  // Initialize stores
  gemPlannerStore.init();
  mechPlannerStore.init(); // Lade alle Daten aus localStorage
  
  // Initialize hunter store for Ozzy first
  if (!hunterStore.hunterBuilds || !hunterStore.hunterBuilds.ozzy || hunterStore.hunterBuilds.ozzy.length === 0) {
    await hunterStore.initHunterConfig('ozzy');
  }
  
  // Load cached results early
  await loadCachedResults();
  
  // Lade Mech Images
  await loadMechImages();
  
  // Initialize Mech Settings falls noch nicht vorhanden
  initializeMechSettings();
  initializeCurrentOutputMultiplier();
  
  // Update from selected build if available
  if (selectedBuildId.value) {
    updateFromSelectedBuild();
  }
  
  // Starte Auto-Update Timer für Current Output
  startAutoUpdateTimer();
});

// Cleanup bei unmount
onUnmounted(() => {
  stopAutoUpdateTimer();
});

// Auto-Update Timer
let autoUpdateInterval = null;

const startAutoUpdateTimer = () => {
  console.log('🕐 [MechPlanner] Starting timer check (updates on cycle completion)');
  stopAutoUpdateTimer(); // Clear any existing timer
  autoUpdateInterval = setInterval(checkAndUpdateCompletedCycles, 1000); // Check every 1 second
};

const stopAutoUpdateTimer = () => {
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval);
    autoUpdateInterval = null;
  }
};

// Prüft für jeden Mech, ob ein kompletter Zyklus abgeschlossen wurde
const checkAndUpdateCompletedCycles = () => {
  const now = Date.now();
  let updatedCount = 0;
  
  mechs.forEach(mech => {
    const mechKey = mech.key;
    const settings = mechSettings.value[mechKey];
    
    // Nur für aktive Mechs (owned > 0)
    if (!settings || settings.owned === 0) return;
    
    // Hole gespeicherten Timestamp
    const lastTimestamp = currentOutputTimestamps.value[mechKey];
    if (!lastTimestamp) return;
    
    // Hole aktuelle Werte
    const currentOutput = getCurrentOutputMultiplierDecimal(mechKey);
    const maxCapacity = getMaxCapacity(mechKey);
    
    // Wenn bereits gecappt, nichts tun
    if (currentOutput.gte(maxCapacity)) return;
    
    const currentMulti = getCurrentMultiplier(mechKey);
    const currentTimer = getCurrentTimer(mechKey);
    
    // Wenn Multi <= 1, keine Erhöhung möglich
    if (currentMulti.lte(1)) return;
    
    // Berechne verstrichene Zeit in Sekunden
    const elapsedMs = now - lastTimestamp;
    const elapsedSeconds = elapsedMs / 1000;
    
    // Prüfe ob mindestens ein kompletter Zyklus vergangen ist
    if (elapsedSeconds >= currentTimer) {
      // Berechne wie viele komplette Zyklen vergangen sind
      const completedCycles = Math.floor(elapsedSeconds / currentTimer);
      
      // Berechne neuen Output: currentOutput * (currentMulti ^ completedCycles)
      const newOutput = currentOutput.mul(currentMulti.pow(completedCycles));
      
      // Begrenze auf maxCapacity
      const cappedOutput = newOutput.gt(maxCapacity) ? maxCapacity : newOutput;
      
      // Update via Store mit neuem Timestamp (jetzt!)
      mechPlannerStore.updateCurrentOutput(mechKey, cappedOutput, formatDecimalForInput(cappedOutput));
      updatedCount++;
      
      console.log(`🔄 [MechPlanner] ${mech.name}: Completed ${completedCycles} cycle(s), updated output`);
    }
  });
  
  if (updatedCount > 0) {
    console.log(`⏫ [MechPlanner] Auto-updated ${updatedCount} mech(s) after cycle completion`);
  }
};

// Hilfsfunktion zum Formatieren von Decimal für Input
const formatDecimalForInput = (decimal) => {
  if (!decimal || !(decimal instanceof Decimal)) {
    return '1';
  }
  
  const str = decimal.toString();
  
  // Wenn es wissenschaftliche Notation ist, direkt zurückgeben
  if (str.includes('e')) {
    return str;
  }
  
  // Für große Zahlen in wissenschaftliche Notation umwandeln
  if (decimal.gte(1e6)) {
    return decimal.toExponential(2);
  }
  
  // Für normale Zahlen: max 2 Dezimalstellen
  if (decimal.lt(100)) {
    return decimal.toFixed(2);
  }
  
  // Für größere Zahlen: keine Dezimalstellen
  return decimal.toFixed(0);
};
</script>

<style scoped>
/* Modernisierte Header-Styles */
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
  border-radius: 0.75rem 0.75rem 0 0;
}
</style>