<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
    @click.self="cancelAndClose"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700 modal-container"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-blue-400">TR Planner</span>
            <span class=""> - Orb Calculator</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="cancelAndClose"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Description Area -->
      <div class="p-3 bg-gray-750/60 border-b border-gray-700">
        <p class="text-xs text-gray-300">
          Calculate your Orb gains for the current TR. Set current and target levels for each boost.
        </p>
      </div>

      <!-- General Stats Panel -->
      <div class="p-3 border-b border-gray-700">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- TR Count -->
          <div class="bg-gray-750/60 rounded-md p-2 border border-transparent hover:border-gray-600">
            <div class="flex flex-col">
              <label class="text-xs font-medium text-gray-300 mb-1.5">TR Count</label>
              <div class="w-full flex items-center justify-start h-[33px]">
                <TRValueControls
                  :value="trCount"
                  :minValue="0"
                  :maxValue="999999"
                  :showFastControls="true"
                  :step="1"
                  :valueClass="'text-white'"
                  :autoEdit="true"
                  :tabIndex="1"
                  @update:value="(newVal) => {
                    trCount = newVal;
                    recalculateAll();
                  }"
                />
              </div>
            </div>
          </div>

          <!-- All-Time Orbs -->
          <div class="bg-gray-750/60 rounded-md p-2 border border-transparent hover:border-gray-600">
            <div class="flex flex-col">
              <label class="text-xs font-medium text-gray-300 mb-1">All-Time Orbs</label>
              <input 
                v-model="allTimeOrbsInput"
                type="text"
                class="px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white"
                placeholder="0.00"
                tabindex="2"
                @input="updateAllTimeOrbs"
                @blur="finalizeAllTimeOrbsInput" 
                @keydown.enter="finalizeAllTimeOrbsInput"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Boost Controls - Verschoben vor die Ergebnistabelle -->
      <div class="p-3">
        <!-- Empty results message -->
        <div v-if="filteredBoostCategories.length === 0" class="py-4 text-center text-gray-400 text-sm">
          <template v-if="searchQuery">
            <p>No boosts match your search</p>
            <button 
              @click="clearSearch"
              class="mt-2 text-blue-400 text-xs hover:underline"
            >
              Clear search
            </button>
          </template>
          <template v-else>
            <p>No boosts available</p>
          </template>
        </div>
        
        <!-- Boost Categories -->
        <div 
          v-for="(category, categoryIndex) in filteredBoostCategories" 
          :key="`category_${category.id}`" 
          class="mb-4"
        >
          <!-- Category Header -->
          <div class="flex items-center mb-1">
            <div class="w-1.5 h-4 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
          </div>
          
          <!-- Boost Controls Compact List -->
          <div class="border border-gray-700 rounded-md overflow-hidden">
            <!-- Desktop-Ansicht - wie bisher -->
            <table class="w-full text-sm hidden sm:table">
              <thead>
                <tr class="bg-gray-750">
                  <th class="text-left py-1.5 px-2 w-[30%] text-xs text-gray-300">Boost</th>
                  <th class="text-center py-1.5 px-2 w-[25%] text-xs text-gray-300">Multiplier</th>
                  <th class="text-center py-1.5 px-2 w-[22.5%] text-xs text-gray-300">Current</th>
                  <th class="text-center py-1.5 px-2 w-[22.5%] text-xs text-gray-300">Target</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="boost in category.boosts" 
                  :key="`boost_desktop_${boost.key}`" 
                  class="border-t border-gray-700 hover:bg-gray-700/30"
                >
                  <td class="py-1.5 px-2 text-xs text-gray-200">
                    <div>{{ boost.label }}</div>
                    <div v-if="boost.max !== undefined" class="text-[10px] text-gray-400">Max: {{ boost.max }}</div>
                  </td>
                  <td class="py-1.5 px-2 text-center">
                    <div class="text-xs flex items-center justify-center space-x-1">
                      <span class="text-gray-300">
                        <!-- Spezialfall für hoursInTR -->
                        <template v-if="boost.key === 'hoursInTR'">
                          <span class="text-yellow-400 font-medium">
                            Cup-Multi: 
                            {{ formatMultiplier(getBoostMultiplier(boost, currentBoosts[boost.key] || 0)) }}
                          </span>
                        </template>
                        <!-- Boolean-Boosts: Zeige Multiplikator nur wenn aktiviert -->
                        <template v-else-if="boost.type === 'boolean'">
                          {{ currentBoosts[boost.key] ? formatMultiplier(boost.multiplier) : 'x1.00' }}
                        </template>
                        <!-- Standardfall für numerische Boosts -->
                        <template v-else>
                          {{ formatMultiplier(getBoostMultiplier(boost, currentBoosts[boost.key] || 0)) }}
                        </template>
                      </span>
                      <IconArrowRight size="12" class="text-green-500" />
                      <span class="text-white">
                        <!-- Spezialfall für hoursInTR -->
                        <template v-if="boost.key === 'hoursInTR'">
                          <span class="text-yellow-400 font-medium">{{ formatMultiplier(getBoostMultiplier(boost, targetBoosts[boost.key] || 0, true)) }}</span>
                        </template>
                        <!-- Boolean-Boosts: Zeige Multiplikator nur wenn aktiviert -->
                        <template v-else-if="boost.type === 'boolean'">
                          {{ targetBoosts[boost.key] ? formatMultiplier(boost.multiplier) : 'x1.00' }}
                        </template>
                        <!-- Standardfall für numerische Boosts -->
                        <template v-else>
                          {{ formatMultiplier(getBoostMultiplier(boost, targetBoosts[boost.key] || 0, true)) }}
                        </template>
                      </span>
                    </div>
                  </td>
                  <td class="py-1.5 px-2 text-center">
                    <!-- Boolean Current -->
                    <template v-if="boost.type === 'boolean'">
                      <button 
                        class="px-2 py-0.5 text-[11px] rounded-sm"
                        :class="currentBoosts[boost.key] ? 'bg-green-700/50 text-green-300' : 'bg-gray-700 text-gray-400'"
                        @click="toggleCurrentBoolean(boost.key)"
                        :tabindex="getTabIndex(boost, 'current')"  
                      >
                        {{ currentBoosts[boost.key] ? 'ON' : 'OFF' }}
                      </button>
                    </template>
                    
                    <!-- Numeric Current -->
                    <template v-else>
                      <div class="w-full flex justify-center">
                        <TRValueControls
                          :value="currentBoosts[boost.key] || 0"
                          :minValue="0"
                          :maxValue="boost.max || 999999"
                          :showFastControls="true"
                          :step="boost.normalControl || 1"
                          :fastStep="boost.fastControl || 10"
                          :valueClass="'text-gray-300'"
                          :compact="true"
                          :autoEdit="true" 
                          :tabIndex="getTabIndex(boost, 'current')"  
                          @update:value="(newVal) => updateBoostCurrent(boost, newVal)"
                        />
                      </div>
                    </template>
                  </td>
                  <td class="py-1.5 px-2 text-center">
                    <!-- Boolean Target -->
                    <template v-if="boost.type === 'boolean'">
                      <button 
                        @click="toggleTargetBoolean(boost.key)"
                        class="px-2 py-0.5 text-[11px] rounded-sm"
                        :class="{
                          'bg-green-600 hover:bg-green-500 text-white': targetBoosts[boost.key],
                          'bg-gray-700 hover:bg-gray-600 text-white': !targetBoosts[boost.key],
                          'opacity-75 cursor-default': currentBoosts[boost.key]
                        }"
                        :disabled="currentBoosts[boost.key]"
                        :tabindex="getTabIndex(boost, 'target')" 
                      >
                        {{ targetBoosts[boost.key] ? 'ON' : 'OFF' }}
                      </button>
                    </template>
                    
                    <!-- Numeric Target -->
                    <template v-else>
                      <div class="w-full flex justify-center">
                        <TRValueControls
      :value="targetBoosts[boost.key] || 0"
      :minValue="0"  
      :maxValue="boost.max || 999999"
      :showFastControls="true"
      :step="boost.normalControl || 1"
      :fastStep="boost.fastControl || 10"
      :valueClass="'text-white'"
      :compact="true"
      :autoEdit="true"  
      :tabIndex="getTabIndex(boost, 'target')"
      :validateOnFinalOnly="true"
      class="tr-value-control"
      :class="{ 'tr-improved-value': (targetBoosts[boost.key] || 0) > (currentBoosts[boost.key] || 0) }" 
      @update:raw-value="(newVal) => updateRawTargetValue(boost, newVal)"
      @finalize:value="() => finalizeTargetValue(boost)"
      @blur="() => finalizeTargetValue(boost)"
    />
                      </div>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Mobile-Ansicht - vereinfacht und kompakt -->
            <div class="sm:hidden">
              <div 
                v-for="boost in category.boosts" 
                :key="`boost_mobile_${boost.key}`" 
                class="border-t border-gray-700 hover:bg-gray-700/30 p-2"
              >
                <div class="flex flex-col">
                  <!-- Boost-Name und Multiplier nebeneinander -->
                  <div class="mb-1.5 flex justify-between items-center">
                    <div>
                      <div class="text-xs font-medium text-gray-200">{{ boost.label }}</div>
                      <div v-if="boost.max !== undefined" class="text-[10px] text-gray-400">Max: {{ boost.max }}</div>
                    </div>
                    
                    <!-- Multiplier rechts anzeigen -->
                    <div class="text-xs text-right">
                      <!-- Spezialfall für hoursInTR -->
                      <template v-if="boost.key === 'hoursInTR'">
                        <span class="text-yellow-400 font-medium">
                          {{ formatMultiplier(getBoostMultiplier(boost, targetBoosts[boost.key] || 0, true)) }}
                        </span>
                      </template>
                      <!-- Boolean-Boosts: Zeige Multiplikator nur wenn aktiviert -->
                      <template v-else-if="boost.type === 'boolean'">
                        <span :class="targetBoosts[boost.key] ? 'text-green-400' : 'text-gray-500'">
                          {{ targetBoosts[boost.key] ? formatMultiplier(boost.multiplier) : 'x1.00' }}
                        </span>
                      </template>
                      <!-- Standardfall für numerische Boosts -->
                      <template v-else>
                        <span class="text-gray-400">
                          {{ formatMultiplier(getBoostMultiplier(boost, currentBoosts[boost.key] || 0)) }}
                        </span>
                        <span class="mx-1 text-green-500">→</span>
                        <span class="text-white">
                          {{ formatMultiplier(getBoostMultiplier(boost, targetBoosts[boost.key] || 0, true)) }}
                        </span>
                      </template>
                    </div>
                  </div>
                  
                  <!-- Current und Target untereinander -->
                  <div class="flex flex-col gap-2">
                    <!-- Current -->
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-400 mr-2">Current:</span>
                      
                      <!-- Boolean Current -->
                      <template v-if="boost.type === 'boolean'">
                        <button 
                          class="px-2 py-0.5 text-[11px] rounded-sm"
                          :class="currentBoosts[boost.key] ? 'bg-green-700/50 text-green-300' : 'bg-gray-700 text-gray-400'"
                          @click="toggleCurrentBoolean(boost.key)"
                          :tabindex="getTabIndex(boost, 'current')"  
                        >
                          {{ currentBoosts[boost.key] ? 'ON' : 'OFF' }}
                        </button>
                      </template>
                      
                      <!-- Numeric Current -->
                      <template v-else>
                        <div class="flex justify-end">
                          <TRValueControls
                            :value="currentBoosts[boost.key] || 0"
                            :minValue="0"
                            :maxValue="boost.max || 999999"
                            :showFastControls="true"
                            :step="boost.normalControl || 1"
                            :fastStep="boost.fastControl || 10"
                            :valueClass="'text-gray-300'"
                            :compact="true"
                            :autoEdit="true" 
                            :tabIndex="getTabIndex(boost, 'current')"  
                            @update:value="(newVal) => updateBoostCurrent(boost, newVal)"
                          />
                        </div>
                      </template>
                    </div>
                    
                    <!-- Target -->
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-400 mr-2">Target:</span>
                      
                      <!-- Boolean Target -->
                      <template v-if="boost.type === 'boolean'">
                        <button 
                          @click="toggleTargetBoolean(boost.key)"
                          class="px-2 py-0.5 text-[11px] rounded-sm"
                          :class="{
                            'bg-green-600 hover:bg-green-500 text-white': targetBoosts[boost.key],
                            'bg-gray-700 hover:bg-gray-600 text-white': !targetBoosts[boost.key],
                            'opacity-75 cursor-default': currentBoosts[boost.key]
                          }"
                          :disabled="currentBoosts[boost.key]"
                          :tabindex="getTabIndex(boost, 'target')" 
                        >
                          {{ targetBoosts[boost.key] ? 'ON' : 'OFF' }}
                        </button>
                      </template>
                      
                      <!-- Numeric Target -->
                      <template v-else>
                        <div class="flex justify-end">
                          <TRValueControls
      :value="targetBoosts[boost.key] || 0"
      :minValue="0"  
      :maxValue="boost.max || 999999"
      :showFastControls="true"
      :step="boost.normalControl || 1"
      :fastStep="boost.fastControl || 10"
      :valueClass="'text-white'"
      :compact="true"
      :autoEdit="true"  
      :tabIndex="getTabIndex(boost, 'target')"
      :validateOnFinalOnly="true"
      class="tr-value-control"
      :class="{ 'tr-improved-value': (targetBoosts[boost.key] || 0) > (currentBoosts[boost.key] || 0) }" 
      @update:raw-value="(newVal) => updateRawTargetValue(boost, newVal)"
      @finalize:value="() => finalizeTargetValue(boost)"
      @blur="() => finalizeTargetValue(boost)"
    />
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Panel - kompakter für mobile Ansicht -->
      <div class="sticky bottom-[52px] z-10 p-2 sm:p-3 border-t border-gray-700 bg-gray-800 shadow-lg">
        <!-- Mobile View (kompakte Version) -->
        <div class="flex items-center justify-between sm:hidden">
          <div class="flex flex-col text-center px-1">
            <span class="text-xs text-gray-400">TR Req</span>
            <span class="text-sm font-bold text-white">{{ formatNumber(orbRequirement) }}</span>
          </div>
          
          <div class="h-10 border-l border-gray-600 mx-1"></div>
          
          <div class="flex flex-col text-center px-1">
            <span class="text-xs text-gray-400">Current</span>
            <span class="text-sm font-bold text-white">{{ formatNumber(currentOrbGains) }}</span>
          </div>
          
          <div class="h-10 border-l border-gray-600 mx-1"></div>
          
          <div class="flex flex-col text-center px-1">
            <span class="text-xs text-gray-400">Target</span>
            <span class="text-sm font-bold" :class="targetOrbGains >= orbRequirement ? 'text-green-400' : 'text-red-400'">
              {{ formatNumber(targetOrbGains) }}
            </span>
          </div>
        </div>
        
        <!-- Desktop View (bestehende Version) -->
        <div class="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-gray-800/70 rounded-lg border border-gray-700 p-2">
            <h3 class="text-xs font-medium text-gray-300 mb-1">TR Requirement</h3>
            <div class="text-lg font-bold text-white">{{ formatNumber(orbRequirement) }}</div>
            <div class="mt-0.5 text-xs text-gray-400">
              Required Orbs for TR {{ trCount }}
            </div>
          </div>
          
          <div class="bg-gray-800/70 rounded-lg border border-gray-700 p-2">
            <h3 class="text-xs font-medium text-gray-300 mb-1">Current Orb Gain</h3>
            <div class="text-lg font-bold text-white">{{ formatNumber(currentOrbGains) }}</div>
            <div class="mt-0.5 text-xs text-gray-400">
              With current boost levels
            </div>
          </div>
          
          <div class="bg-gray-800/70 rounded-lg border border-gray-700 p-2">
            <h3 class="text-xs font-medium text-gray-300 mb-1">Target Orb Gain</h3>
            <div class="text-lg font-bold" :class="targetOrbGains >= orbRequirement ? 'text-green-400' : 'text-red-400'">
              {{ formatNumber(targetOrbGains) }}
            </div>
            <div class="mt-0.5 text-xs" :class="targetOrbGains >= orbRequirement ? 'text-green-500' : 'text-red-400'">
              <template v-if="targetOrbGains >= orbRequirement">
                <IconCircleCheck size="14" class="inline mr-1" />
                Requirement met (+{{ formatNumber(targetOrbGains - orbRequirement) }})
              </template>
              <template v-else>
                <IconCircleX size="14" class="inline mr-1" />
                {{ formatNumber(orbRequirement - targetOrbGains) }} orbs missing
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer buttons - Ersetze den existierenden Footer-Bereich -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <div v-if="showCreateOptions" class="absolute bottom-[60px] left-3 bg-gray-700 rounded-md shadow-lg border border-gray-600 p-2 animate-fade-in">
              <div class="mb-1 text-xs text-gray-300 font-medium">Create plan using:</div>
              <div class="flex flex-col gap-1">
                <button 
                  @click="createPlanWithCurrentValues()"
                  class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs flex items-center"
                >
                  <IconCircleCheck size="14" class="mr-1" />
                  Current Values
                </button>
                <button 
                  @click="createPlanWithTargetValues()"
                  class="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md text-xs flex items-center"
                >
                  <IconArrowRight size="14" class="mr-1" />
                  Target Values
                </button>
              </div>
            </div>
            
            <button 
              @click="toggleCreateOptions"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs flex items-center"
            >
              <IconPlus size="14" class="mr-1" />
              Create New Plan
            </button>
          </div>
          
          <div class="flex gap-2">
            <button
              @click="showBoostOverview = true"
              class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs flex items-center"
            >
              <IconSearch size="14" class="mr-1" />
              Boost Overview
            </button>
            
            <button 
              @click="resetForm"
              class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BoostOverviewModal 
    v-if="showBoostOverview" 
    :isVisible="showBoostOverview"
    :currentStats="currentBoosts"
    :targetStats="targetBoosts"
    :trCount="trCount"
    :allTimeOrbs="allTimeOrbs"
    :orbRequirement="orbRequirement"
    :orbGain="currentOrbGains"
    :targetOrbGain="targetOrbGains"
    @close="showBoostOverview = false" 
  />
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import BoostOverviewModal from './BoostOverviewModal.vue';
import { useTRPlannerStore } from '@/store/orbStore';
import { allBoosts, boostsByCategory } from '@/constants/tr-planner';
import TRValueControls from '@/composables/TRValueControls.vue';
import { formatMultiplier, formatNumber, parseNumberWithSuffix, formatSuffixNotation } from '@/composables/format';
import { 
  calculateOrbRequirement, 
  calculateOrbGainsCalc, 
  calculateMissingHours,
  calculateCupMultiplier,  
  calculateMultiplier      
} from '@/composables/calculations';
import { 
  IconX,
  IconSearch,
  IconCircleCheck,
  IconCircleX,
  IconAlertCircle,
  IconArrowRight,
  IconPlus
} from '@tabler/icons-vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  currentStats: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'openNewPlan']);

// State
const searchQuery = ref('');
const trCount = ref(props.currentStats?.trCount || 0);
const allTimeOrbs = ref(props.currentStats?.allTimeOrbs || 0);
const isEditingAllTimeOrbs = ref(false);
const allTimeOrbsRawInput = ref("");
const allTimeOrbsDisplay = ref(formatSuffixNotation(props.currentStats?.allTimeOrbs || 0));
const currentBoosts = ref({});
const targetBoosts = ref({});
const showBoostOverview = ref(false);
const showCreateOptions = ref(false);
const isPlanValid = ref(false);

const trPlannerStore = useTRPlannerStore();

// Die hoursInTR Werte über computed properties zugänglich machen
const hoursInTR = computed({
  get() {
    return currentBoosts.value.hoursInTR || 0;
  },
  set(value) {
    currentBoosts.value.hoursInTR = value;
    recalculateAll();
  }
});

// Filter for multiplier-only boosts
const multiplierBoosts = computed(() => {
  return allBoosts.filter(boost => {
    // Only include boosts that have a multiplier (not just fragmulti)
    return boost.multiplier !== undefined;
  });
});

// Berechnete Properties
const allTimeOrbsInput = computed({
  get() {
    return isEditingAllTimeOrbs.value ? allTimeOrbsRawInput.value : allTimeOrbsDisplay.value;
  },
  set(value) {
    if (isEditingAllTimeOrbs.value) {
      allTimeOrbsRawInput.value = value;
    } else {
      allTimeOrbsDisplay.value = value;
    }
  }
});

const orbRequirement = computed(() => {
  return calculateOrbRequirement(trCount.value, allTimeOrbs.value);
});

const effectiveStats = computed(() => {
  // Kombiniere maxLevelStats mit currentBoosts
  const stats = { ...maxLevelStats.value };
  
  // Alle Werte aus currentBoosts übernehmen, auch wenn sie in maxLevelStats existieren
  Object.entries(currentBoosts.value).forEach(([key, value]) => {
    // Für numerische Boosts den höheren Wert verwenden
    if (typeof value === 'number') {
      stats[key] = Math.max(stats[key] || 0, value);
    } 
    // Für Boolean-Werte OR-Verknüpfung verwenden
    else if (typeof value === 'boolean') {
      stats[key] = stats[key] || value;
    }
    // Andere Werte direkt übernehmen
    else {
      stats[key] = value;
    }
  });
  
  // WICHTIG: Stelle sicher, dass maximierte Boosts korrekt berücksichtigt werden
  allBoosts.forEach(boost => {
    // Wenn der Boost maximiert ist und einen Multiplikator hat
    if (boost.orbcalc && boost.max !== undefined && boost.type === 'number') {
      const maxLevel = maxLevelStats.value[boost.key];
      // Wenn der Boost im maxLevelStats maximal ist, diesen Wert erzwingen
      if (maxLevel !== undefined && maxLevel >= boost.max) {
        console.log(`Boost ${boost.key} ist maximal (${maxLevel}), wird in effectiveStats gesetzt`);
        stats[boost.key] = maxLevel;
      }
    }
    // Boolean-Boosts auch berücksichtigen
    else if (boost.orbcalc && boost.type === 'boolean') {
      if (maxLevelStats.value[boost.key] === true) {
        console.log(`Boolean Boost ${boost.key} ist true in maxLevelStats, wird in effectiveStats gesetzt`);
        stats[boost.key] = true;
      }
    }
  });
  
  return stats;
});

const effectiveTargetStats = computed(() => {
  // Statt nur effectiveStats, starte mit allen Maximierungen direkt aus maxLevelStats
  const stats = { ...maxLevelStats.value };
  
  // Füge currentBoosts hinzu
  Object.entries(currentBoosts.value).forEach(([key, value]) => {
    // Für numerische Boosts den höheren Wert verwenden
    if (typeof value === 'number') {
      stats[key] = Math.max(stats[key] || 0, value);
    } 
    // Für Boolean-Werte OR-Verknüpfung verwenden
    else if (typeof value === 'boolean') {
      stats[key] = stats[key] || value;
    }
    // Andere Werte direkt übernehmen
    else {
      stats[key] = value;
    }
  });
  
  // Nun die targetBoosts-Werte hinzufügen, die immer Vorrang haben
  Object.entries(targetBoosts.value).forEach(([key, value]) => {
    if (value !== undefined) {
      stats[key] = value;
    }
  });
  
  // Stelle noch einmal sicher, dass maximale Boosts nicht unterschritten werden
  allBoosts.forEach(boost => {
    // Wenn der Boost maximiert ist und einen Multiplikator hat
    if (boost.orbcalc && boost.max !== undefined && boost.type === 'number') {
      const maxLevel = maxLevelStats.value[boost.key];
      const currentLevel = stats[boost.key] || 0;
      
      // Wenn der Boost im maxLevelStats maximal ist, diesen Wert erzwingen
      if (maxLevel !== undefined && maxLevel >= boost.max && currentLevel < boost.max) {
        console.log(`Boost ${boost.key} ist maximal (${maxLevel}), wird in effectiveTargetStats gesetzt`);
        stats[boost.key] = maxLevel;
      }
    }
    // Boolean-Boosts auch berücksichtigen
    else if (boost.orbcalc && boost.type === 'boolean') {
      if (maxLevelStats.value[boost.key] === true) {
        console.log(`Boolean Boost ${boost.key} ist true in maxLevelStats, wird in effectiveTargetStats gesetzt`);
        stats[boost.key] = true;
      }
    }
  });
  
  console.log("Effektive Target Stats:", stats);
  return stats;
});

const currentOrbGains = computed(() => {
  try {
    // Verwende effectiveStats, das bereits die maximierten Boosts enthält
    const planStats = { ...effectiveStats.value };
    
    // Alle Boosts mit Multiplikatoren und orbcalc=true verwenden
    const allOrbCalcBoosts = allBoosts.filter(b => b.orbcalc);
    
    // Orb-Multiplikator berechnen
    const result = calculateOrbGainsCalc(
      effectiveStats.value,
      planStats,
      allOrbCalcBoosts  // WICHTIG: Alle Boosts verwenden, nicht nur die gefilterten
    );
    
    console.log("Current orb gains:", result);
    return isNaN(result) ? 0 : result;
  } catch (e) {
    console.error("Error calculating orb gains:", e);
    return 0;
  }
});

const targetOrbGains = computed(() => {
  try {
    // Verwende effectiveTargetStats, das bereits alle maximierten Boosts enthält
    const targetPlan = { ...effectiveTargetStats.value };
    
    // Alle Boosts mit Multiplikatoren und orbcalc=true verwenden
    const allOrbCalcBoosts = allBoosts.filter(b => b.orbcalc);
    
    // Berechne die Orb-Gewinne mit den Ziel-Boosts
    const result = calculateOrbGainsCalc(
      effectiveStats.value,
      targetPlan,
      allOrbCalcBoosts  // WICHTIG: Alle Boosts verwenden, nicht nur die gefilterten
    );
    
    console.log("Target orb gains:", result);
    return isNaN(result) ? 0 : result;
  } catch (e) {
    console.error("Error calculating targetOrbGains:", e);
    return 0;
  }
});

const missingHours = computed(() => {
  if (targetOrbGains.value >= orbRequirement.value) {
    return 0;
  }
  
  try {
    return calculateMissingHours(
      hoursInTR.value,
      orbRequirement.value,
      effectiveStats.value,              // Anstelle von currentBoosts.value
      effectiveTargetStats.value,        // Anstelle von { ...currentBoosts.value, ...targetBoosts.value }
      multiplierBoosts.value,
      1000
    );
  } catch (e) {
    console.error("Error calculating missing hours:", e);
    return 0;
  }
});

const maxLevelStats = computed(() => {
  try {
    const storedStats = localStorage.getItem('trplanner_userstats');
    if (storedStats) {
      return JSON.parse(storedStats);
    }
  } catch (e) {
    console.error("Error reading maxLevelStats from localStorage:", e);
  }
  
  // Wichtig: Wenn keine Daten im localStorage sind, verwende die Werte aus props.currentStats
  // Dies stellt sicher, dass die Boosts auch bei leerem Cache korrekt angezeigt werden
  return props.currentStats || {};
});

const filteredBoostCategories = computed(() => {
  // Debug-Ausgabe der maxLevelStats
  console.log("maxLevelStats aus localStorage:", maxLevelStats.value);
  
  return boostsByCategory
    .map(category => {
      // Copy the category
      const newCategory = { ...category };
      
      // Filter boosts with multiplier
      newCategory.boosts = category.boosts.filter(boost => {
        // Only include boosts with a multiplier (not just fragmulti)
        if (boost.multiplier === undefined) {
          return false;
        }
        
        // Die Stats im localStorage (trplanner_userstats)
        const maxStats = maxLevelStats.value || {};
        
        // WICHTIG: Prüfe, ob der Boost direkt von der OrbCalculator-Komponente stammt
        // Das erkennen wir daran, dass der Wert NICHT aus props.currentStats kommt
        const isMaxedInStatsInput = (() => {
          // Für numerische Boosts mit maximum
          if (boost.type === 'number' && boost.max !== undefined) {
            const globalLevel = maxStats[boost.key];
            
            // HIER war der Fehler: Vergleiche nur mit den Werten aus localStorage
            // Überprüfe auch explizit, ob der Boost im localStorage vorhanden ist
            if (globalLevel !== undefined && globalLevel >= boost.max) {
              console.log(`Boost ${boost.key} hat Maximum erreicht: ${globalLevel}/${boost.max}`);
              return true;
            }
          }
          
          // Für Boolean-Boosts
          if (boost.type === 'boolean') {
            // HIER war auch ein Fehler: Vergleiche nur mit den Werten aus localStorage
            if (maxStats[boost.key] === true) {
              console.log(`Boolean Boost ${boost.key} ist bereits true in maxLevelStats`);
              return true;
            }
          }
          
          return false;
        })();
        
        // Wenn der Boost im StatsInputModal maximiert wurde, ausblenden
        if (isMaxedInStatsInput) {
          return false;
        }
        
        // Filter by search query if present
        if (searchQuery.value.trim()) {
          const query = searchQuery.value.toLowerCase();
          return boost.label.toLowerCase().includes(query) || 
                 boost.key.toLowerCase().includes(query);
        }
        
        return true;
      });
      
      return newCategory;
    })
    .filter(category => category.boosts.length > 0); // Remove empty categories
});

// Methods
function initData() {
  // Current-Stats aus Props übernehmen
  currentBoosts.value = { ...props.currentStats };
  // Target-Stats initial gleich setzen
  targetBoosts.value = { ...props.currentStats };
  
  // TR-Count und All-Time Orbs separieren
  trCount.value = props.currentStats?.trCount || 0;
  allTimeOrbs.value = props.currentStats?.allTimeOrbs || 0;
  
  // Wichtig: Formatiere die Anzeige beim Initialisieren konsistent mit 2 Nachkommastellen
  allTimeOrbsDisplay.value = formatSuffixWithDecimals(props.currentStats?.allTimeOrbs || 0, 2);

  // Stelle sicher, dass der Store initial korrekt geladen ist
  if (trPlannerStore && trPlannerStore.userStats) {
    // Zusätzliche Boosts aus dem Store laden, falls vorhanden
    const storeStats = trPlannerStore.userStats;
    
    // Ergänze fehlende Werte aus dem Store
    Object.entries(storeStats).forEach(([key, value]) => {
      if (currentBoosts.value[key] === undefined && value !== undefined) {
        currentBoosts.value[key] = value;
        targetBoosts.value[key] = value;
      }
    });
  }
  
  // Debug-Ausgabe
  console.log("InitData completed, current boosts:", currentBoosts.value);
  console.log("Store values:", trPlannerStore.userStats);
}

// Formatierungsfunktion mit Dezimalstellen
function formatSuffixWithDecimals(value, decimals = 2) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0' + '.' + '0'.repeat(decimals);
  }
  
  if (value === 0) {
    return '0' + '.' + '0'.repeat(decimals);
  }
  
  const absValue = Math.abs(value);
  const suffixes = ['', 'k', 'm', 'b', 't', 'qa', 'qu', 'sx', 'sp', 'oc', 'n', 'd'];
  
  let tier = Math.max(0, Math.min(Math.floor(Math.log10(absValue) / 3), suffixes.length - 1));
  
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  
  return `${scaledValue.toFixed(decimals)}${suffix}`;
}

function clearSearch() {
  searchQuery.value = '';
}

function updateBoostTarget(boost, newValue) {
  // Der Wert muss mindestens der current-Wert und eine ganze Zahl sein
  const currentValue = currentBoosts.value[boost.key] || 0;
  let validValue = Math.max(Math.floor(newValue), currentValue);
  
  // Max-Level berücksichtigen
  if (boost.max !== undefined) {
    validValue = Math.min(validValue, boost.max);
  }
  
  // Wert aktualisieren
  targetBoosts.value[boost.key] = validValue;
  
  // Berechnungen aktualisieren
  recalculateAll();
}

function updateRawTargetValue(boost, newValue) {
  // Diese Funktion akzeptiert jeden Wert ohne Validierung
  targetBoosts.value[boost.key] = newValue;
  
  // Berechnungen bei jeder Änderung aktualisieren, aber ohne Minimalwert-Validierung
  recalculateAll();
}

// Überarbeite die finalizeTargetValue-Funktion
function finalizeTargetValue(boost) {
  // Diese Funktion wird aufgerufen, wenn der Benutzer fertig mit der Eingabe ist
  
  // Extrahiere den aktuellen Wert
  const currentValue = targetBoosts.value[boost.key] || 0;
  const minAllowedValue = currentBoosts.value[boost.key] || 0;
  
  // Validiere den Wert - jetzt erst den Mindest-Wert prüfen
  let validValue = Math.max(Math.floor(currentValue), 0);
  
  // Value can't be below current - DIESE PRÜFUNG ERST BEI FINALIZE
  if (validValue < minAllowedValue) {
    console.log(`Target value ${validValue} for ${boost.key} too low, increasing to ${minAllowedValue}`);
    validValue = minAllowedValue;
  }
  
  // Respect max level if available
  if (boost.max !== undefined) {
    validValue = Math.min(validValue, boost.max);
  }
  
  // Update value
  targetBoosts.value[boost.key] = validValue;
  
  // Update calculations
  recalculateAll();
}

function toggleTargetBoolean(key) {
  // Wenn der current Boost aktiviert ist, kann der target Boost nicht deaktiviert werden
  if (currentBoosts.value[key]) {
    targetBoosts.value[key] = true; // Erzwinge true, wenn current true ist
  } else {
    targetBoosts.value[key] = !targetBoosts.value[key]; // Sonst normal umschalten
  }
  recalculateAll();
}

function toggleCurrentBoolean(key) {
  currentBoosts.value[key] = !currentBoosts.value[key];
  
  // Wenn current aktiviert wird, muss target auch aktiviert werden
  if (currentBoosts.value[key]) {
    targetBoosts.value[key] = true;
  }
  
  recalculateAll();
}

function getBoostMultiplier(boost, level, isTarget = false) {
  if (!boost || boost.multiplier === undefined) return 1;
  
  // Verwenden wir die richtigen Stats basierend darauf, ob wir aktuellen oder Ziel-Wert berechnen
  const stats = isTarget ? effectiveTargetStats.value : effectiveStats.value;
  
  // Spezialfall: hoursInTR zeigt den Catch-Up Multiplier an
  if (boost.key === 'hoursInTR') {
    return calculateCupMultiplier(level);
  }
  
  // Spezialfall: loopMods zeigt den eigentlichen hoursInTR-Boost-Multiplikator an
  if (boost.key === 'loopMods') {
    const hoursBoost = allBoosts.find(b => b.key === 'hoursInTR');
    if (hoursBoost && typeof hoursBoost.multiplier === 'function') {
      const hoursValue = stats.hoursInTR || 0;
      return hoursBoost.multiplier(hoursValue, stats);
    }
    return 1;
  }
  
  // Standard-Logik für alle anderen Boosts
  if (boost.type === 'boolean') {
    // Boolean boosts
    if (typeof boost.multiplier === 'number') {
      return boost.multiplier;
    } else if (typeof boost.multiplier === 'function') {
      try {
        return boost.multiplier(1, stats);
      } catch (e) {
        console.error(`Error calculating multiplier for ${boost.key}:`, e);
        return 1;
      }
    }
  } else {
    // Numeric boosts
    if (typeof boost.multiplier === 'number') {
      return Math.pow(boost.multiplier, level);
    } else if (typeof boost.multiplier === 'function') {
      try {
        return boost.multiplier(level, stats);
      } catch (e) {
        console.error(`Error calculating multiplier for ${boost.key}:`, e);
        return 1;
      }
    }
  }
  
  return 1;
}

function safeCalculateMultiplier(boost, value, stats) {
  if (!boost || boost.multiplier === undefined) return 1;
  
  try {
    if (boost.type === 'boolean') {
      if (!value) return 1; // Wenn boolean false ist, kein Effekt
      
      if (typeof boost.multiplier === 'number') {
        return boost.multiplier;
      } else if (typeof boost.multiplier === 'function') {
        return boost.multiplier(1, stats) || 1; // 1 als Default
      }
    } else {
      // Numeric boost
      if (!value || value <= 0) return 1; // Wenn 0 oder negativ, kein Effekt
      
      if (typeof boost.multiplier === 'number') {
        return Math.pow(boost.multiplier, value);
      } else if (typeof boost.multiplier === 'function') {
        return boost.multiplier(value, stats) || 1; // 1 als Default
      }
    }
    return 1; // Default
  } catch (e) {
    console.error(`Error in safeCalculateMultiplier for ${boost.key}:`, e);
    return 1; // Default bei Fehler
  }
}

function compareCalculations(planStats, boosts) {
  console.group("🧪 Vergleich calculateOrbGains vs calculateOrbGainsCalc");
  
  // Erstelle Deep Copies, um Seiteneffekte zu vermeiden
  const planStatsCopy = JSON.parse(JSON.stringify(planStats));
  const boostsCopy = JSON.parse(JSON.stringify(boosts.map(b => ({
    key: b.key,
    type: b.type,
    multiplier: b.multiplier,
    orbcalc: b.orbcalc
  }))));
  
  console.log("Input planStats:", planStatsCopy);
  console.log("Input boosts:", boostsCopy.map(b => b.key));
  
  // Sammle Zwischenergebnisse aus calculateOrbGains
  const originalResults = [];
  const originalCalculate = (stats, boosts) => {
    let result = 1;
    const catchUpMultiplier = calculateCupMultiplier(stats.hoursInTR || 0);
    originalResults.push({ step: "Catch-Up", multiplier: catchUpMultiplier, result });
    
    for (const boost of boosts) {
      if (!boost.orbcalc) continue;
      const value = stats[boost.key];
      try {
        let multiplier = 1;
        if (boost.type === 'boolean') {
          if (value && typeof boost.multiplier === 'number') {
            multiplier = boost.multiplier;
          } else if (value && typeof boost.multiplier === 'function') {
            multiplier = boost.multiplier(1, stats);
          }
        } else if (value > 0) {
          if (typeof boost.multiplier === 'number') {
            multiplier = Math.pow(boost.multiplier, value);
          } else if (typeof boost.multiplier === 'function') {
            multiplier = boost.multiplier(value, stats);
          }
        }
        result *= multiplier;
        originalResults.push({ 
          key: boost.key, 
          value, 
          multiplier, 
          type: boost.type,
          isFunction: typeof boost.multiplier === 'function',
          result 
        });
      } catch (e) {
        console.error(`Error in originalCalculate for ${boost.key}:`, e);
      }
    }
    
    result *= catchUpMultiplier;
    originalResults.push({ step: "Final with Catch-Up", multiplier: catchUpMultiplier, result });
    
    return result;
  };
  
  // Sammle Zwischenergebnisse aus calculateOrbGainsCalc
  const calcResults = [];
  const calcCalculate = (stats, boosts) => {
    let result = 1;
    const catchUpMultiplier = calculateCupMultiplier(stats.hoursInTR || 0);
    calcResults.push({ step: "Catch-Up", multiplier: catchUpMultiplier, result });
    
    for (const boost of boosts) {
      if (!boost.orbcalc) continue;
      const value = stats[boost.key];
      try {
        let multiplier = 1;
        try {
          multiplier = calculateMultiplier(boost, value, stats);
          if (isNaN(multiplier) || !isFinite(multiplier)) {
            console.warn(`Ungültiger Multiplikator für ${boost.key}:`, multiplier);
            multiplier = 1;
          }
        } catch (e) {
          console.error(`Fehler bei Berechnung des Multiplikators für ${boost.key}:`, e);
        }
        
        result *= multiplier;
        calcResults.push({ 
          key: boost.key, 
          value, 
          multiplier, 
          type: boost.type,
          isFunction: typeof boost.multiplier === 'function',
          result 
        });
      } catch (e) {
        console.error(`Error in calcCalculate for ${boost.key}:`, e);
      }
    }
    
    result *= catchUpMultiplier;
    calcResults.push({ step: "Final with Catch-Up", multiplier: catchUpMultiplier, result });
    
    return isNaN(result) ? 0 : result;
  };
  
  // Führe beide Berechnungen aus
  console.time("Original calculation");
  const originalResult = originalCalculate(planStatsCopy, boostsCopy);
  console.timeEnd("Original calculation");
  
  console.time("Calc calculation");
  const calcResult = calcCalculate(planStatsCopy, boostsCopy);
  console.timeEnd("Calc calculation");
  
  // Vergleiche die Ergebnisse
  console.log(`🔄 Original: ${originalResult}, Calc: ${calcResult}`);
  console.log(`🔍 Differenz: ${calcResult - originalResult}`);
  
  // Finde Unterschiede in den Multiplikatoren
  console.group("🔎 Multiplikator-Unterschiede:");
  for (let i = 0; i < Math.max(originalResults.length, calcResults.length); i++) {
    if (i < originalResults.length && i < calcResults.length) {
      const orig = originalResults[i];
      const calc = calcResults[i];
      
      if (orig.key !== calc.key || orig.multiplier !== calc.multiplier) {
        console.log(`⚠️ Unterschied bei Schritt ${i}:`);
        console.log(`  Original: ${orig.key || orig.step}, Multiplier: ${orig.multiplier}`);
        console.log(`  Calc: ${calc.key || calc.step}, Multiplier: ${calc.multiplier}`);
        console.log(`  Differenz: ${calc.multiplier - orig.multiplier}`);
        
        // Prüfe, ob NaN oder Infinity
        if (isNaN(orig.multiplier)) console.log(`  ❌ Original ist NaN!`);
        if (isNaN(calc.multiplier)) console.log(`  ❌ Calc ist NaN!`);
        if (!isFinite(orig.multiplier)) console.log(`  ⚠️ Original ist unendlich!`);
        if (!isFinite(calc.multiplier)) console.log(`  ⚠️ Calc ist unendlich!`);
      }
    } else {
      console.log(`⚠️ Unterschiedliche Längen der Ergebnisarrays!`);
      if (i < originalResults.length) {
        console.log(`  Original extra: ${originalResults[i].key || originalResults[i].step}`);
      } else {
        console.log(`  Calc extra: ${calcResults[i].key || calcResults[i].step}`);
      }
    }
  }
  console.groupEnd();
  
  console.log("📊 Vollständige Ergebnisse:");
  console.log("Original:", originalResults);
  console.log("Calc:", calcResults);
  
  console.groupEnd();
  
  return { originalResult, calcResult };
}

function recalculateAll() {
  // Force reactivity by creating a new reference
  currentBoosts.value = { ...currentBoosts.value };
  targetBoosts.value = { ...targetBoosts.value };
  
  // Debug-Ausgabe
  console.log("Recalculating with:", {
    currentBoosts: { ...currentBoosts.value },
    targetBoosts: { ...targetBoosts.value },
    hoursInTR: currentBoosts.value.hoursInTR
  });
  
  // Vergleiche die Berechnungsmethoden
  console.log("CURRENT CALCULATION COMPARISON:");
  compareCalculations(currentBoosts.value, multiplierBoosts.value.filter(b => b.orbcalc));
  
  console.log("TARGET CALCULATION COMPARISON:");
  const targetPlan = { ...currentBoosts.value, ...targetBoosts.value };
  compareCalculations(targetPlan, multiplierBoosts.value.filter(b => b.orbcalc));
}

function resetToCurrentStats() {
  // Reset target values to current values
  targetBoosts.value = { ...currentBoosts.value };
  recalculateAll();
}

function copyTargetsToCurrent() {
  // Copy target values to current values
  currentBoosts.value = { ...targetBoosts.value };
  recalculateAll();
}

function cancelAndClose() {
  emit('close');
}

// Korrigierte Funktion für die Speicherung im LocalStorage
function saveOrbCalcToLocalStorage() {
  try {
    // Speichern der aktuellen Werte
    const orbCalcData = {
      currentBoosts: { ...currentBoosts.value },
      targetBoosts: { ...targetBoosts.value },
      trCount: trCount.value,
      allTimeOrbs: allTimeOrbs.value,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('trplanner_orbcalc', JSON.stringify(orbCalcData));
    console.log('Orb Calculator data saved to localStorage');
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

// Laden der Werte aus dem LocalStorage
function loadOrbCalcFromLocalStorage() {
  try {
    const savedData = localStorage.getItem('trplanner_orbcalc');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Nur übernehmen, wenn Daten vorhanden
      if (parsedData.currentBoosts) currentBoosts.value = parsedData.currentBoosts;
      if (parsedData.targetBoosts) targetBoosts.value = parsedData.targetBoosts;
      if (parsedData.trCount !== undefined) trCount.value = parsedData.trCount;
      if (parsedData.allTimeOrbs !== undefined) allTimeOrbs.value = parsedData.allTimeOrbs;
      
      // Display aktualisieren mit 2 Nachkommastellen
      allTimeOrbsDisplay.value = formatSuffixWithDecimals(allTimeOrbs.value, 2);
      
      console.log('Orb Calculator data loaded from localStorage');
      
      // Nach dem Laden neu berechnen
      recalculateAll();
    }
  } catch (e) {
    console.error("Error loading from localStorage:", e);
  }
}

function updateBoostCurrent(boost, newValue) {
  // Validate value
  let validValue = Math.max(Math.floor(newValue), 0);
  
  // Respect max level if available
  if (boost.max !== undefined) {
    validValue = Math.min(validValue, boost.max);
  }
  
  // Update value
  currentBoosts.value[boost.key] = validValue;
  
  // Wenn current erhöht wird, muss target ggf. angepasst werden
  if (validValue > (targetBoosts.value[boost.key] || 0)) {
    targetBoosts.value[boost.key] = validValue;
  }
  
  // Update calculations
  recalculateAll();
}

function getTabIndex(boost, type) {
  // Erstelle flache Listen aller Current- und Target-Boosts
  const currentBoostList = [];
  const targetBoostList = [];
  
  // Fülle die Listen mit allen sichtbaren Boosts
  filteredBoostCategories.value.forEach(category => {
    category.boosts.forEach(b => {
      currentBoostList.push(b);
      targetBoostList.push(b);
    });
  });
  
  // Finde den Index des aktuellen Boosts in der Liste
  const boostIndex = currentBoostList.findIndex(b => b.key === boost.key);
  
  if (boostIndex === -1) return undefined; // Nicht gefunden
  
  if (type === 'current') {
    // Current-Boost-Indizes beginnen bei 3 (nach TR Count=1 und All-Time Orbs=2)
    return boostIndex + 3;
  } else if (type === 'target') {
    // Target-Boost-Indizes beginnen nach allen Current-Boosts
    return currentBoostList.length + boostIndex + 3;
  }
  
  return undefined;
}

function setupAutoScrollOnTabbing() {
  // Event-Listener für Fokusänderungen einrichten
  document.addEventListener('focusin', handleFocusChange);
}

function handleFocusChange(event) {
  // Prüfen, ob das Element innerhalb unseres Modals ist
  const modal = document.querySelector('.modal-container');
  if (!modal || !modal.contains(event.target)) return;
  
  // Nur für Boost-Felder scrollen (current und target)
  const isBoostField = event.target.getAttribute('tabindex') >= 3;
  
  if (isBoostField) {
    // Warten bis das UI aktualisiert wurde
    setTimeout(() => {
      // Element sanft ins Sichtfeld scrollen
      event.target.scrollIntoView({
        behavior: 'smooth', 
        block: 'center',     // Element mittig zeigen
        inline: 'nearest'    // Horizontales Scrollen minimal halten
      });
    }, 100);
  }
}

// Entferne den Event-Listener, wenn die Komponente zerstört wird
function cleanupAutoScrollListeners() {
  document.removeEventListener('focusin', handleFocusChange);
}

// Diese Funktion zur onMounted-Funktion hinzufügen
onMounted(() => {
  // Bestehender Code...
  initData();
  loadOrbCalcFromLocalStorage();
  
  // Auto-Scroll beim Tabben einrichten
  setupAutoScrollOnTabbing();
});

// Cleanup beim Unmount der Komponente
onBeforeUnmount(() => {
  cleanupAutoScrollListeners();
});

// Watch für Änderungen und lokales Speichern
watch([currentBoosts, targetBoosts, trCount, allTimeOrbs], () => {
  saveOrbCalcToLocalStorage();
}, { deep: true });

// Watch for prop changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    initData();
  }
});

watch(() => props.currentStats, (newValue) => {
  if (props.isVisible) {
    initData();
  }
}, { deep: true });

// Initialize
onMounted(() => {
  // Erst Props übernehmen, dann lokale Daten wenn vorhanden
  initData();
  loadOrbCalcFromLocalStorage();
});

function toggleCreateOptions() {
  showCreateOptions.value = !showCreateOptions.value;
}

function resetForm() {
  resetToCurrentStats();
}

function createPlanWithCurrentValues() {
  console.log("========== DEBUG CREATE PLAN ==========");
  console.log("1. Creating plan with current values in OrbCalculatorModal");
  
  // Bereite die Daten für den neuen Plan vor
  const currentValues = { ...props.currentStats };
  
  // Aktualisiere mit den currentBoosts
  Object.entries(currentBoosts.value).forEach(([key, value]) => {
    if (value !== undefined) {
      currentValues[key] = value;
    }
  });
  
  // Stelle sicher, dass trCount und allTimeOrbs gesetzt sind
  currentValues.trCount = trCount.value;
  currentValues.allTimeOrbs = allTimeOrbs.value;
  
  // NEU: Füge die aktuelle Uhrzeit und das Datum hinzu
  const now = new Date();
  currentValues.trStartDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  currentValues.trStartTime = now.toTimeString().split(' ')[0].slice(0, 5); // Format: HH:MM
  
  // Speichere die Daten in trPlannerStore.tempPlanData
  trPlannerStore.tempPlanData = JSON.parse(JSON.stringify(currentValues));
  
  console.log("Daten für neuen Plan vorbereitet:", trPlannerStore.tempPlanData);
  
  // Modal schließen
  emit('close');
  console.log("1.2. Emitted 'close' event");
  
  // Daten auch in copyPlanData speichern für die Übergabe
  trPlannerStore.setCopyPlanData(JSON.parse(JSON.stringify(currentValues)));
  
  // Setze Flag im Store, dass TRPlanModal geöffnet werden soll
  trPlannerStore.planModalShouldOpen = 'current';
  
  console.log("1.3. Set planModalShouldOpen flag in store:", trPlannerStore.planModalShouldOpen);
}

// Ändere auch die createPlanWithTargetValues-Funktion:
function createPlanWithTargetValues() {
  // Prüfe, ob wir überhaupt Target-Werte haben
  const hasTargetValues = Object.keys(targetBoosts.value).length > 0;
  
  if (!hasTargetValues) {
    console.warn("No target values available");
    return;
  }
  
  // Erstelle ein Objekt mit den Zielwerten für den neuen Plan
  const targetStats = { ...props.currentStats };
  
  // Füge erst alle Current-Werte hinzu
  Object.entries(currentBoosts.value).forEach(([key, value]) => {
    if (value !== undefined) {
      targetStats[key] = value;
    }
  });
  
  // Füge dann alle Target-Werte hinzu
  Object.entries(targetBoosts.value).forEach(([key, value]) => {
    if (value !== undefined) {
      targetStats[key] = value;
    }
  });
  
  // Stelle sicher, dass trCount und allTimeOrbs gesetzt sind
  targetStats.trCount = trCount.value;
  targetStats.allTimeOrbs = allTimeOrbs.value;
  
  // NEU: Füge die aktuelle Uhrzeit und das Datum hinzu
  const now = new Date();
  targetStats.trStartDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  targetStats.trStartTime = now.toTimeString().split(' ')[0].slice(0, 5); // Format: HH:MM
  
  // Speichere die Daten in trPlannerStore.tempPlanData
  trPlannerStore.tempPlanData = JSON.parse(JSON.stringify(targetStats));
  
  console.log("Daten für neuen Plan (Target) vorbereitet:", trPlannerStore.tempPlanData);
  
  // Modal schließen
  emit('close');
  
  // Daten auch in copyPlanData speichern
  trPlannerStore.setCopyPlanData(JSON.parse(JSON.stringify(targetStats)));
  
  // Setze Flag im Store, dass TRPlanModal geöffnet werden soll
  trPlannerStore.planModalShouldOpen = 'target';
  
  console.log("Target plan flag set in store:", trPlannerStore.planModalShouldOpen);
}

function createPlan() {
  if (isPlanValid.value) {
    console.log("Saving plan...");
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

/* Immer einen transparenten Rahmen anzeigen, um ein Springen zu vermeiden */
:deep(.tr-value-control) {
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

/* Nur die Farbe ändern, wenn die Bedingung erfüllt ist */
:deep(.tr-improved-value) {
  border-color: rgb(34, 197, 94) !important;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.2);
}
</style>