<!-- filepath: \src\components\tr-planner\TRPlanDetailModal.vue -->
<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-blue-400">TR Plan</span>
            <span class=""> - {{ plan?.name || 'Plan Details' }}</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="$emit('close')"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
              title="Close"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="!plan" class="p-8 text-center">
        <IconCircleX size="48" class="text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-300 mb-2">Plan Not Found</h3>
        <p class="text-gray-400 mb-6">This plan may have been deleted or does not exist.</p>
        <button 
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
        >
          Close
        </button>
      </div>
      
      <div v-else>
        <!-- Plan Overview mit festgelegten prozentuellen Breiten -->
        <div class="p-4 bg-gray-750/60 border-b border-gray-700">
          <h3 class="text-sm font-bold mb-3 text-blue-300">Plan Overview</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-3">
            <div class="flex flex-wrap w-full">
              <!-- TR Information - 20% Breite -->
              <div class="w-full sm:w-1/5 p-2">
                <div class="flex items-center">
                  <div class="bg-blue-900/30 p-2 rounded-lg mr-3">
                    <IconRepeat size="20" class="text-blue-400" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">TR Progress</div>
                    <div class="text-sm text-white font-medium">
                      {{ plan.updatedStats?.trCount || currentTrCount }} → {{ (plan.updatedStats?.trCount || currentTrCount) + totalTRsInPlan }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Total Orbs - 25% Breite -->
              <div class="w-full sm:w-1/4 p-2">
                <div class="flex items-center">
                  <div class="bg-green-900/30 p-2 rounded-lg mr-3">
                    <img src="@/assets/general/orbs.png" class="w-5 h-5" alt="Orbs" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">All-Time Orbs</div>
                    <div class="text-sm text-white font-medium">
                      {{ formatNumber(baseAllTimeOrbs) }} → {{ formatNumber(finalAllTimeOrbs) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Timeline - 20% Breite -->
              <div class="w-full sm:w-1/5 p-2">
                <div class="flex items-center">
                  <div class="bg-purple-900/30 p-2 rounded-lg mr-3">
                    <IconCalendarEvent size="20" class="text-purple-400" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Timeline</div>
                    <div class="text-sm text-white font-medium">
                      {{ formatDate(planStartDate, false) }} - {{ formatDate(planEndDate, false) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Duration - 15% Breite -->
              <div class="w-full sm:w-[15%] p-2">
                <div class="flex items-center">
                  <div class="bg-indigo-900/30 p-2 rounded-lg mr-3">
                    <IconClock size="20" class="text-indigo-400" />
                  </div>
                  <div>
                    <div class="text-xs text-gray-400">Duration</div>
                    <div class="text-sm text-white font-medium">{{ formatDuration }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Progress - 20% Breite -->
              <div class="w-full sm:w-1/5 p-2">
                <div class="flex-grow">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs text-gray-400">Progress</span>
                    <span class="text-xs" :class="progressColor">{{ progressStatus }}</span>
                  </div>
                  <div class="w-full bg-gray-700 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full" :class="progressBarColor" :style="{ width: `${progressPercentage}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- TR Chain Overview -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-sm font-bold mb-3 text-blue-300">TR Details</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="text-xs text-gray-300 bg-gray-800/80">
                <tr>
                  <th scope="col" class="px-4 py-2 text-left font-medium">#</th>
                  <th scope="col" class="px-4 py-2 text-left font-medium">TR</th>
                  <th scope="col" class="px-4 py-2 text-left font-medium">Start Date</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium hidden sm:table-cell">Hours</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">Orbs</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">Frags</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">All-Time Orbs</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <!-- Erster TR -->
                <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                  <td class="px-4 py-2.5 font-medium relative">
                    1
                  </td>
                  <td class="px-4 py-2.5">
                    {{ plan.updatedStats?.trCount || currentTrCount }} → {{ (plan.updatedStats?.trCount || currentTrCount) + 1 }}
                  </td>
                  <td class="px-4 py-2.5">
                    {{ formatDate(planStartDate, true) }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono hidden sm:table-cell">
                    {{ firstTrHours }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono text-green-400">
                    {{ formatNumber(firstTrOrbGains) }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono text-orange-400">
                    {{ formatNumber(firstTrFragGains) }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono text-blue-400">
                    {{ formatNumber(baseAllTimeOrbs + firstTrOrbGains) }}
                  </td>
                </tr>
                
                <!-- TR Chain -->
                <template v-if="plan.trChain && plan.trChain.length > 0">
                  <tr 
                    v-for="(chainStep, index) in plan.trChain" 
                    :key="index"
                    class="bg-gray-750/20 hover:bg-gray-700/40 transition"
                  >
                  <td class="px-4 py-2.5 font-medium relative">
                    {{ index + 2 }}
                    <span class="absolute right-0 top-1/2 -translate-y-1/2 mr-1">
                      <InfoTooltip :content="getBoostListHtml(index + 1)" placement="right" />
                    </span>
                  </td>
                    <td class="px-4 py-2.5">
                      {{ (plan.updatedStats?.trCount || currentTrCount) + index + 1 }} → {{ (plan.updatedStats?.trCount || currentTrCount) + index + 2 }}
                    </td>
                    <td class="px-4 py-2.5">
                      {{ formatDate(getChainStartDate(index), true) }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono hidden sm:table-cell">
                      {{ getChainTrHours(chainStep) }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-green-400">
                      {{ formatNumber(chainStep.results?.orbGains || 0) }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-orange-400">
                      {{ formatNumber(chainStep.results?.campaignFragGains || 0) }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono text-blue-400">
                      {{ formatNumber(getCumulativeAllTimeOrbs(index)) }}
                    </td>
                  </tr>
                </template>
              </tbody>
              <!-- Footer Row -->
              <tfoot class="bg-gray-800/60 text-xs text-white font-medium">
                <tr>
                  <td colspan="2" class="px-4 py-2">TOTAL</td>
                  <td class="px-4 py-2">{{ formatDate(planEndDate, true) }}</td>
                  <td class="px-4 py-2 text-right font-mono hidden sm:table-cell">{{ formatNumber(totalHoursInTR) }}</td>
                  <td class="px-4 py-2 text-right font-mono text-green-400">{{ formatNumber(totalOrbGains) }}</td>
                  <td class="px-4 py-2 text-right font-mono text-orange-400">{{ formatNumber(totalFragGains) }}</td>
                  <td class="px-4 py-2 text-right font-mono text-blue-400">{{ formatNumber(finalAllTimeOrbs) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <!-- Boost Progression Section -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-sm font-bold mb-3 text-blue-300">Boosts Progression</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-2">
            <!-- Stats Progression -->
            <div v-if="!allImprovedBoosts.length" class="text-gray-400 text-center py-2 text-sm">
              No Boosts improved in this plan.
            </div>
            
            <div v-else class="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div 
                v-for="boost in allImprovedBoosts" 
                :key="boost.key"
                class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex justify-between items-center"
              >
                <div class="text-xs font-medium text-white truncate mr-1">{{ boost.label }}</div>
                <div class="text-xs text-blue-400 whitespace-nowrap">
                  {{ boost.startValue }} → {{ boost.endValue }}
                </div>
              </div>
            </div>
            
            <!-- Upgrade Costs -->
            <div v-if="hasUpgradeCosts" class="mt-3 pt-3 border-t border-gray-700">
              <h4 class="text-xs font-medium text-gray-300 mb-2">Upgrade Costs</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <!-- Fragments (für Relics) -->
                <div v-if="upgradeCosts.fragments > 0" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/general/fragments.png" class="w-5 h-5 mr-2" alt="Fragments" />
                  <div class="text-xs font-medium text-white mr-1">Fragments:</div>
                  <div class="text-xs text-purple-400 ml-auto">{{ formatRelicCost(upgradeCosts.fragments) }}</div>
                </div>
                
                <!-- Hellish-Biomatter (für Inscryptions) -->
                <div v-if="upgradeCosts.hellishBiomatter > 0" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/borge/loot_mat3.png" class="w-5 h-5 mr-2" alt="Hellish Biomatter" />
                  <div class="text-xs font-medium text-white mr-1">Hellish-Biomatter:</div>
                  <div class="text-xs text-red-400 ml-auto">{{ formatInscryptionCost(upgradeCosts.hellishBiomatter) }}</div>
                </div>
                
                <!-- Tessarects (für Gadgets) -->
                <div v-if="upgradeCosts.tessarects > 0" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/knox/loot_mat3.png" class="w-5 h-5 mr-2" alt="Tesseracts" />
                  <div class="text-xs font-medium text-white mr-1">Tesseracts:</div>
                  <div class="text-xs text-blue-400 ml-auto">{{ formatGadgetCost(upgradeCosts.tessarects) }}</div>
                </div>

                <!-- MP (für Loop Mods) -->
                <div v-if="hasLoopModInPlan" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/general/mp.png" class="w-5 h-5 mr-2" alt="MP" />
                  <div class="text-xs font-medium text-white mr-1">MP:</div>
                  <div class="text-xs text-red-400 ml-auto">{{ getLoopModCostDisplay() }}</div>
                </div>

                <!-- Shards (für m0) -->
                <div v-if="upgradeCosts.shards > 0" 
                    class="bg-gray-800/60 rounded border border-gray-700 p-1.5 flex items-center">
                  <img src="@/assets/general/shards.png" class="w-5 h-5 mr-2" alt="Shards" />
                  <div class="text-xs font-medium text-white mr-1">Shards:</div>
                  <div class="text-xs text-blue-400 ml-auto">{{ upgradeCosts.shardsFormatted }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TR-Requirements Projektion mit Chart.js -->
        <div class="p-4 border-b border-gray-700">
          <h3 class="text-sm font-bold mb-3 text-blue-300">Future Minimum TR Requirements Projection</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs text-gray-400">
                Projecting next {{ futureTRsToProject }} TRs after TR{{ (plan?.updatedStats?.trCount || currentTrCount) + totalTRsInPlan }}
              </div>
              <div class="flex gap-2 items-center">
                <button 
                  @click="futureTRsToProject = Math.max(5, futureTRsToProject - 5)"
                  class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                >-5</button>
                <button 
                  @click="futureTRsToProject += 5"
                  class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                >+5</button>
              </div>
            </div>
            
            <!-- Chart.js Graph Container -->
            <div class="h-60 w-full">
              <div v-if="!chartData" class="flex items-center justify-center h-full text-gray-400">
                <div class="text-center">
                  <div class="animate-spin w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full mx-auto mb-2"></div>
                  <div class="text-sm">Loading chart...</div>
                </div>
              </div>
              <Bar
                v-if="chartData"
                :key="chartRenderKey"
                :data="chartData"
                :options="chartOptions"
                class="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        <!-- Footer buttons -->
        <div class="bg-gray-750/60 p-3 border-t border-gray-700">
          <div class="flex justify-between items-center">
            <div class="text-xs text-gray-400">
              Created: {{ formatDate(new Date(plan.createdAt), false) }}
            </div>
            <div class="flex gap-2">
              <button
                @click="handleDelete(plan.id)"
                class="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-md text-xs flex items-center gap-1.5"
              >
                <IconTrash size="14" />
                Delete
              </button>
              <button
                @click="handleEdit(plan.id)"
                class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs flex items-center gap-1.5"
              >
                <IconEdit size="14" />
                Edit
              </button>
              <button 
                @click="$emit('close')"
                class="px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick } from 'vue';
import { getRelicCost, formatRelicCost } from '@/utils/relicCostUtils';
import { getInscryptionCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { getM0Cost, formatM0Cost, calculateM0CostRangeSafe } from '@/utils/m0CostUtils';
import { LOOP_MODS, getLoopModCost, formatLoopModCost, calculateLoopModCostRangeSafe, getRuleOfConsistencyExponent } from '@/utils/loopModCostUtils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useTRPlannerStore } from '@/store/orbStore';
import { allBoosts } from '@/constants/tr-planner';
import { formatNumber } from '@/composables/format';
import { calculateOrbRequirement } from '@/composables/calculations';
import { 
  IconX, 
  IconCircleCheck, 
  IconCircleX,
  IconTrash,
  IconEdit,
  IconCalendarEvent,
  IconRepeat,
  IconClock,
  IconCircle
} from '@tabler/icons-vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  planId: {
    type: String,
    default: null
  },
  currentStats: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'delete', 'edit']);

// Store einbinden
const trPlannerStore = useTRPlannerStore();

// Current TR count from stats
const currentTrCount = computed(() => props.currentStats?.trCount || 0);

// Plan aus dem Store abrufen
const plan = computed(() => props.planId ? trPlannerStore.getTRPlanById(props.planId) : null);

// Berechnung der Gesamtanzahl der TRs im Plan
const totalTRsInPlan = computed(() => {
  if (!plan.value) return 0;
  
  // Basis-TR + alle Chain-TRs
  return 1 + (plan.value.trChain?.length || 0);
});

// Erster TR Hours
const firstTrHours = computed(() => {
  if (!plan.value?.boosts) return 0;
  
  // NEUES FORMAT: Object
  if (typeof plan.value.boosts === 'object' && !Array.isArray(plan.value.boosts)) {
    return plan.value.boosts.hoursInTR?.targetLevel || 0;
  }
  // ALTES FORMAT: Array (Rückwärtskompatibilität)
  else if (Array.isArray(plan.value.boosts)) {
    const hoursBoost = plan.value.boosts.find(b => b.key === 'hoursInTR');
    return hoursBoost?.targetLevel || 0;
  }
  
  return 0;
});

// Erster TR Orb Gains
const firstTrOrbGains = computed(() => {
  return plan.value?.results?.orbGains || 0;
});

// Erster TR Fragment Gains
const firstTrFragGains = computed(() => {
  return plan.value?.results?.campaignFragGains || 0;
});

// Stunden für einen Chain-Schritt abrufen
function getChainTrHours(chainStep) {
  if (!chainStep?.boosts) return 0;
  
  // NEUES FORMAT: Object
  if (typeof chainStep.boosts === 'object' && !Array.isArray(chainStep.boosts)) {
    return chainStep.boosts.hoursInTR?.targetLevel || 0;
  }
  // ALTES FORMAT: Array (Rückwärtskompatibilität)
  else if (Array.isArray(chainStep.boosts)) {
    const hoursBoost = chainStep.boosts.find(b => b.key === 'hoursInTR');
    return hoursBoost?.targetLevel || 0;
  }
  
  return 0;
}

// Total Hours in TR für alle TRs zusammen
const totalHoursInTR = computed(() => {
  if (!plan.value) return 0;
  
  // Stunden des ersten TRs
  let total = firstTrHours.value;
  
  // Stunden aller Chain-TRs
  if (plan.value.trChain && Array.isArray(plan.value.trChain)) {
    plan.value.trChain.forEach(chainStep => {
      total += getChainTrHours(chainStep);
    });
  }
  
  return total;
});

// Gesamte Orb-Gewinne
const totalOrbGains = computed(() => {
  if (!plan.value) return 0;
  
  // Orbs vom ersten TR
  let total = firstTrOrbGains.value;
  
  // Orbs von allen Chain-TRs
  if (plan.value.trChain && Array.isArray(plan.value.trChain)) {
    plan.value.trChain.forEach(chainStep => {
      total += chainStep.results?.orbGains || 0;
    });
  }
  
  return total;
});

// Gesamte Fragment-Gewinne
const totalFragGains = computed(() => {
  if (!plan.value) return 0;
  
  // Fragments vom ersten TR
  let total = firstTrFragGains.value;
  
  // Fragments von allen Chain-TRs
  if (plan.value.trChain && Array.isArray(plan.value.trChain)) {
    plan.value.trChain.forEach(chainStep => {
      total += chainStep.results?.campaignFragGains || 0;
    });
  }
  
  return total;
});

// Start- und Endzeit des Plans
const planStartDate = computed(() => {
  if (!plan.value?.trStartDate || !plan.value?.trStartTime) return new Date();
  
  const [year, month, day] = plan.value.trStartDate.split('-').map(Number);
  const [hours, minutes] = plan.value.trStartTime.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
});

const planEndDate = computed(() => {
  if (!planStartDate.value) return new Date();
  
  // Millisekunden für die Gesamtstunden berechnen
  const totalMilliseconds = totalHoursInTR.value * 60 * 60 * 1000;
  
  // Enddatum berechnen
  return new Date(planStartDate.value.getTime() + totalMilliseconds);
});

// Formatierung der Dauer
const formatDuration = computed(() => {
  const hours = totalHoursInTR.value;
  
  // Weniger als 24 Stunden
  if (hours < 24) {
    return `${hours}h`;
  }
  
  // Mehr als 24 Stunden -> Tage + Stunden
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) {
    return `${days}d`;
  }
  
  return `${days}d ${remainingHours}h`;
});

// Progression berechnen
const progressPercentage = computed(() => {
  if (!planStartDate.value || !planEndDate.value) return 0;
  
  const now = new Date();
  
  // Plan noch nicht begonnen
  if (now < planStartDate.value) return 0;
  
  // Plan bereits abgeschlossen
  if (now > planEndDate.value) return 100;
  
  // Berechnen des Fortschritts basierend auf der Zeit
  const totalDuration = planEndDate.value - planStartDate.value;
  const elapsed = now - planStartDate.value;
  
  return Math.floor((elapsed / totalDuration) * 100);
});

// Fortschritt-Status
const progressStatus = computed(() => {
  if (!planStartDate.value || !planEndDate.value) return "";
  
  const now = new Date();
  
  // Plan noch nicht begonnen
  if (now < planStartDate.value) {
    const diffMs = planStartDate.value - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Starts in ${diffHours}h`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `Starts in ${diffDays}d`;
  }
  
  // Plan bereits abgeschlossen
  if (now > planEndDate.value) {
    const diffMs = now - planEndDate.value;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Completed ${diffHours}h ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `Completed ${diffDays}d ago`;
  }
  
  // Plan läuft
  const diffMs = planEndDate.value - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `${diffHours}h remaining`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  
  if (remainingHours === 0) {
    return `${diffDays}d remaining`;
  }
  
  return `${diffDays}d ${remainingHours}h remaining`;
});

// Farbe für den Fortschritt
const progressColor = computed(() => {
  if (!planStartDate.value || !planEndDate.value) return "text-gray-400";
  
  const now = new Date();
  
  // Plan noch nicht begonnen
  if (now < planStartDate.value) return "text-blue-400";
  
  // Plan abgeschlossen
  if (now > planEndDate.value) return "text-green-400";
  
  // Plan läuft
  return "text-yellow-400";
});

// Farbe für den Fortschrittsbalken
const progressBarColor = computed(() => {
  const now = new Date();
  
  // Plan noch nicht begonnen
  if (now < planStartDate.value) return "bg-blue-500";
  
  // Plan abgeschlossen
  if (now > planEndDate.value) return "bg-green-500";
  
  // Plan läuft - verschiedene Farben je nach Fortschritt
  if (progressPercentage.value < 30) return "bg-blue-500";
  if (progressPercentage.value < 70) return "bg-yellow-500";
  return "bg-green-500";
});

// Erhalte alle verbesserten Boosts mit Startwerten aus dem ersten TR
const allImprovedBoosts = computed(() => {
  if (!plan.value) return [];
  
  const result = [];
  const boostedStats = new Map();
  
  // Vorhandene Boosts aus dem allBoosts-Array holen um die Kategorien zu kennen
  const boostsByKey = {};
  allBoosts.forEach(boost => {
    boostsByKey[boost.key] = boost;
  });
  
  // Sammle die Startwerte aus dem ersten TR (targetLevel nach dem ersten TR)
  const firstTrTargetLevels = {};
  if (plan.value.boosts) {
    // NEUES FORMAT: Object statt Array
    if (typeof plan.value.boosts === 'object' && !Array.isArray(plan.value.boosts)) {
      Object.entries(plan.value.boosts).forEach(([key, boostData]) => {
        if (boostData.type === 'number') {
          firstTrTargetLevels[key] = boostData.targetLevel;
        }
      });
    } 
    // ALTES FORMAT: Array (Rückwärtskompatibilität)
    else if (Array.isArray(plan.value.boosts)) {
      plan.value.boosts.forEach(boost => {
        if (boost.type === 'number') {
          firstTrTargetLevels[boost.key] = boost.targetLevel;
        }
      });
    }
  }
  
  // Verfolge die Progression durch die TR-Kette und sammle nur verbesserte Boosts
  if (plan.value.trChain && Array.isArray(plan.value.trChain)) {
    plan.value.trChain.forEach(chainStep => {
      if (chainStep.boosts) {
        // NEUES FORMAT: Object
        if (typeof chainStep.boosts === 'object' && !Array.isArray(chainStep.boosts)) {
          Object.entries(chainStep.boosts).forEach(([key, boostData]) => {
            if (boostData.type === 'number') {
              const firstTrLevel = firstTrTargetLevels[key] || 0;
              const chainTrLevel = boostData.targetLevel;
              
              // Nur hinzufügen wenn in der Chain eine Verbesserung stattfindet
              if (chainTrLevel > firstTrLevel) {
                const boostInfo = boostsByKey[key];
                if (boostInfo) {
                  if (!boostedStats.has(key)) {
                    boostedStats.set(key, {
                      key: key,
                      label: boostData.label || key,
                      startValue: firstTrLevel,  // Startwert: Level nach dem ersten TR
                      endValue: chainTrLevel,    // Endwert: Level nach dem Chain-TR
                      category: boostInfo.category
                    });
                  } else {
                    // Update den Endwert falls schon vorhanden
                    const statInfo = boostedStats.get(key);
                    statInfo.endValue = Math.max(statInfo.endValue, chainTrLevel);
                  }
                }
              }
            }
          });
        }
        // ALTES FORMAT: Array (Rückwärtskompatibilität)
        else if (Array.isArray(chainStep.boosts)) {
          chainStep.boosts.forEach(boost => {
            if (boost.type === 'number') {
              const firstTrLevel = firstTrTargetLevels[boost.key] || 0;
              const chainTrLevel = boost.targetLevel;
              
              // Nur hinzufügen wenn in der Chain eine Verbesserung stattfindet
              if (chainTrLevel > firstTrLevel) {
                const boostInfo = boostsByKey[boost.key];
                if (boostInfo) {
                  if (!boostedStats.has(boost.key)) {
                    boostedStats.set(boost.key, {
                      key: boost.key,
                      label: boost.label || boost.key,
                      startValue: firstTrLevel,  // Startwert: Level nach dem ersten TR
                      endValue: chainTrLevel,    // Endwert: Level nach dem Chain-TR
                      category: boostInfo.category
                    });
                  } else {
                    // Update den Endwert falls schon vorhanden
                    const statInfo = boostedStats.get(boost.key);
                    statInfo.endValue = Math.max(statInfo.endValue, chainTrLevel);
                  }
                }
              }
            }
          });
        }
      }
    });
  }
  
  // Konvertiere die Map in ein Array und sortiere
  for (const boost of boostedStats.values()) {
    result.push(boost);
  }
  
  return result.sort((a, b) => {
    // Sortieren nach relativer Verbesserung (Prozentsatz)
    const aImprovement = (a.endValue - a.startValue) / Math.max(1, a.startValue);
    const bImprovement = (b.endValue - b.startValue) / Math.max(1, b.startValue);
    return bImprovement - aImprovement;
  });
});


// Berechne den höchsten Orbs-pro-Stunde-Wert für den Chart
const maxOrbsPerHour = computed(() => {
  let max = firstTrOrbGains.value / Math.max(1, firstTrHours.value);
  
  // Prüfe auch Chain TRs
  if (plan.value?.trChain) {
    plan.value.trChain.forEach(step => {
      const orbsPerHour = (step.results?.orbGains || 0) / Math.max(1, getChainTrHours(step));
      max = Math.max(max, orbsPerHour);
    });
  }
  
  // Runde auf einen "schönen" Wert auf
  return Math.ceil(max * 1.1 / 1000) * 1000;
});

// Funktion zum Erzeugen eines Donutchart-Pfades
function getDonutPath(startAngle, endAngle) {
  // Parameter für den SVG-Pfad
  const innerRadius = 8; // Innerer Radius des Donuts
  const outerRadius = 18; // Äußerer Radius des Donuts
  const startRadians = (startAngle - 90) * Math.PI / 180;
  const endRadians = (endAngle - 90) * Math.PI / 180;
  
  const centerX = 18;
  const centerY = 18;
  
  const startX1 = centerX + innerRadius * Math.cos(startRadians);
  const startY1 = centerY + innerRadius * Math.sin(startRadians);
  const endX1 = centerX + outerRadius * Math.cos(startRadians);
  const endY1 = centerY + outerRadius * Math.sin(startRadians);
  
  const startX2 = centerX + outerRadius * Math.cos(endRadians);
  const startY2 = centerY + outerRadius * Math.sin(endRadians);
  const endX2 = centerX + innerRadius * Math.cos(endRadians);
  const endY2 = centerY + innerRadius * Math.sin(endRadians);
  
  const largeArc1 = endAngle - startAngle <= 180 ? 0 : 1;
  const largeArc2 = endAngle - startAngle <= 180 ? 0 : 1;
  
  return [
    `M ${startX1} ${startY1}`,
    `L ${endX1} ${endY1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc1} 1 ${startX2} ${startY2}`,
    `L ${endX2} ${endY2}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc2} 0 ${startX1} ${startY1}`,
    'Z'
  ].join(' ');
}

// Signifikante Boost-Progression im Plan
const significantBoosts = computed(() => {
  if (!plan.value) return [];
  
  const boosts = [];
  const trackKeys = new Set();
  
  // Füge wichtige Boosts aus dem ersten TR hinzu
  if (plan.value.boosts && Array.isArray(plan.value.boosts)) {
    plan.value.boosts.forEach(boost => {
      if (boost.type === 'number' && boost.targetLevel - boost.currentLevel > 0) {
        trackKeys.add(boost.key);
        
        boosts.push({
          key: boost.key,
          label: boost.label,
          startValue: boost.currentLevel,
          endValue: boost.targetLevel,
          maxValue: boost.max || boost.targetLevel * 2, // Schätzen eines sinnvollen Max-Wertes
          steps: []
        });
      }
    });
  }
  
  // Verfolge Progression durch die TR-Kette
  if (plan.value.trChain && Array.isArray(plan.value.trChain)) {
    plan.value.trChain.forEach((chainStep, index) => {
      if (chainStep.boosts && Array.isArray(chainStep.boosts)) {
        chainStep.boosts.forEach(boost => {
          if (boost.type === 'number' && trackKeys.has(boost.key)) {
            // Finde den Boost im Array
            const existingBoost = boosts.find(b => b.key === boost.key);
            if (existingBoost) {
              existingBoost.steps[index] = boost.targetLevel;
              existingBoost.endValue = boost.targetLevel;
            }
          }
        });
      }
    });
  }
  
  // Sortiere nach größter relativer Steigerung
  return boosts
    .filter(boost => boost.endValue - boost.startValue > 0)
    .sort((a, b) => {
      const aGrowth = (a.endValue - a.startValue) / a.startValue;
      const bGrowth = (b.endValue - b.startValue) / b.startValue;
      return bGrowth - aGrowth;
    })
    .slice(0, 5); // Top 5 Boosts mit der größten Steigerung
});

// Prüfen, ob ein Loop Mod im Plan vorkommt
const hasLoopModInPlan = computed(() => {
  if (!plan.value) return false;
  
  // Im ersten TR suchen
  if (plan.value.boosts) {
    // NEUES FORMAT: Object
    if (typeof plan.value.boosts === 'object' && !Array.isArray(plan.value.boosts)) {
      if (plan.value.boosts.lmConsistency) {
        return true;
      }
    }
    // ALTES FORMAT: Array (Rückwärtskompatibilität)
    else if (Array.isArray(plan.value.boosts)) {
      if (plan.value.boosts.some(b => b.key === 'lmConsistency')) {
        return true;
      }
    }
  }
  
  // In der TR-Chain suchen
  if (plan.value.trChain) {
    for (const chainStep of plan.value.trChain) {
      if (chainStep.boosts) {
        // NEUES FORMAT: Object
        if (typeof chainStep.boosts === 'object' && !Array.isArray(chainStep.boosts)) {
          if (chainStep.boosts.lmConsistency) {
            return true;
          }
        }
        // ALTES FORMAT: Array (Rückwärtskompatibilität)
        else if (Array.isArray(chainStep.boosts)) {
          if (chainStep.boosts.some(b => b.key === 'lmConsistency')) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
});

// Loop Mod Kosten anzeigen
function getLoopModCostDisplay() {
  // Höchstes Loop Mod Level im Plan finden
  let highestLevel = 0;
  
  // Im ersten TR suchen
  if (plan.value.boosts) {
    let lmLevel = 0;
    
    // NEUES FORMAT: Object
    if (typeof plan.value.boosts === 'object' && !Array.isArray(plan.value.boosts)) {
      lmLevel = plan.value.boosts.lmConsistency?.targetLevel || 0;
    }
    // ALTES FORMAT: Array (Rückwärtskompatibilität)
    else if (Array.isArray(plan.value.boosts)) {
      const lmBoost = plan.value.boosts.find(b => b.key === 'lmConsistency');
      lmLevel = lmBoost?.targetLevel || 0;
    }
    
    highestLevel = Math.max(highestLevel, lmLevel);
  }
  
  // In der TR-Chain suchen
  if (plan.value.trChain) {
    for (const chainStep of plan.value.trChain) {
      if (chainStep.boosts) {
        let lmLevel = 0;
        
        // NEUES FORMAT: Object
        if (typeof chainStep.boosts === 'object' && !Array.isArray(chainStep.boosts)) {
          lmLevel = chainStep.boosts.lmConsistency?.targetLevel || 0;
        }
        // ALTES FORMAT: Array (Rückwärtskompatibilität)
        else if (Array.isArray(chainStep.boosts)) {
          const lmBoost = chainStep.boosts.find(b => b.key === 'lmConsistency');
          lmLevel = lmBoost?.targetLevel || 0;
        }
        
        highestLevel = Math.max(highestLevel, lmLevel);
      }
    }
  }
  
  // Kosten für das höchste Level anzeigen (nur Exponent)
  const exponent = getRuleOfConsistencyExponent(highestLevel);
  return exponent.toString();
}

// Ermittle den Basis-All-Time-Orbs-Wert vor dem ersten TR
const baseAllTimeOrbs = computed(() => {
  return plan.value?.updatedStats?.allTimeOrbs || props.currentStats?.allTimeOrbs || 0;
});

// Berechne den kumulativen All-Time-Orbs-Wert nach einem bestimmten Chain-Index
function getCumulativeAllTimeOrbs(chainIndex) {
  if (!plan.value) return 0;
  
  // Starte mit dem Basis-Wert plus dem ersten TR
  let cumulativeOrbs = baseAllTimeOrbs.value + firstTrOrbGains.value;
  
  // Addiere alle Chain-TRs bis zum angegebenen Index
  for (let i = 0; i <= chainIndex; i++) {
    if (plan.value.trChain && plan.value.trChain[i]) {
      cumulativeOrbs += plan.value.trChain[i].results?.orbGains || 0;
    }
  }
  
  return cumulativeOrbs;
}

// Gesamter All-Time-Orbs-Wert am Ende des Plans
const finalAllTimeOrbs = computed(() => {
  if (!plan.value) return 0;
  
  // Basis-Wert plus alle Orb-Gewinne aus diesem Plan
  return baseAllTimeOrbs.value + totalOrbGains.value;
});

// Datum formatieren
function formatDate(date, includeTime) {
  if (!date) return '';
  
  try {
    if (includeTime) {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric'
      });
    }
  } catch (e) {
    console.error("Error formatting date:", e);
    return '';
  }
}

// Erste TR Orbs pro Stunde für Debugging
const firstTrOrbsPerHour = computed(() => firstTrOrbGains.value / Math.max(1, firstTrHours.value));

// Hilfsfunktion, um Orbs pro Stunde für eine Chain zu berechnen
function getChainStepOrbsPerHour(chainStep) {
  return (chainStep.results?.orbGains || 0) / Math.max(1, getChainTrHours(chainStep));
}

// TR-Requirement für den ersten Schritt
function getStepOrbRequirement(step, index) {
  return step?.results?.orbRequirement || 0;
}

// TR-Requirement für einen Chain-Schritt
function getChainStepRequirement(chainStep, index) {
  return chainStep?.results?.orbRequirement || 0;
}

function handleEdit(planId) {
  emit('close'); 
  emit('edit', planId); 
}

function handleDelete(planId) {
  emit('delete', planId);
  emit('close');
}


// Chart.js registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);

// Chart-Referenz
const chartRef = ref(null);
let trRequirementsChart = null;

// Chart state for Vue-chartjs
const chartRenderKey = ref(0);

// Force chart update function
function forceChartUpdate() {
  chartRenderKey.value += 1;
}

// Anzahl der zukünftigen TRs, die projiziert werden sollen
const futureTRsToProject = ref(10);

// Berechne die TR-Requirements-Projektionen für zukünftige TRs
const futureTRProjections = computed(() => {
  if (!plan.value) return [];
  
  const projections = [];
  
  // Startpunkt: Letzter TR im Plan (nicht +1 wie bisher)
  let startTR = (plan.value.updatedStats?.trCount || currentTrCount.value) + totalTRsInPlan.value;
  let accumulatedOrbs = finalAllTimeOrbs.value;
  
  console.log("--- TR Requirement Debug ---");
  console.log(`StartTR: ${startTR}, Start All-Time Orbs: ${formatNumber(accumulatedOrbs)}`);
  
  // Generiere Projektionen für die angegebene Anzahl von zukünftigen TRs
  for (let i = 0; i < futureTRsToProject.value; i++) {
    // Jetzt beginnen wir mit dem letzten TR aus dem Plan (ohne +1)
    const trCount = startTR + i;
    
    // Berechne Requirement für den aktuellen TR
    const requirement = calculateOrbRequirement(trCount, accumulatedOrbs);
    
    console.log(`TR ${trCount} Requirement: ${formatNumber(requirement)}`);
    console.log(`Current All-Time Orbs: ${formatNumber(accumulatedOrbs)}`);
    
    // Wir speichern die aktuelle Situation für diesen TR
    projections.push({
      trCount,
      requirement,
      orbsAvailable: accumulatedOrbs,
      sufficient: accumulatedOrbs >= requirement
    });
    
    // WICHTIG: Erst NACH dem Speichern des Projektion-Objekts addieren wir
    // das Requirement zu den All-Time Orbs für den nächsten TR
    console.log(`Adding current requirement ${formatNumber(requirement)} to All-Time Orbs`);
    accumulatedOrbs += requirement;
    console.log(`New All-Time Orbs value: ${formatNumber(accumulatedOrbs)}`);
    console.log("---");
  }
  
  console.log("Projections calculated:", projections.length);
  return projections;
});

// Chart Data für Vue-chartjs
const chartData = computed(() => {
  if (!futureTRProjections.value.length) return null;
  
  const labels = futureTRProjections.value.map(proj => `TR${proj.trCount}`);
  const requirementData = futureTRProjections.value.map(proj => proj.requirement);
  const availableData = futureTRProjections.value.map(proj => proj.orbsAvailable);
  
  return {
    labels: labels,
    datasets: [
      {
        label: 'TR Requirement',
        data: requirementData,
        backgroundColor: 'rgba(239, 68, 68, 0.25)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2
      },
      {
        label: 'All-Time Orbs',
        data: availableData,
        backgroundColor: 'rgba(74, 222, 128, 0.25)',
        borderColor: 'rgba(74, 222, 128, 1)',
        borderWidth: 2,
        type: 'line',
        fill: false,
        tension: 0.1,
        pointBackgroundColor: 'rgba(74, 222, 128, 1)',
        pointRadius: 3
      }
    ]
  };
});

// Chart Options im ProgressModal Stil
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  layout: {
    padding: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#9ca3af',
        font: {
          size: 11
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      titleColor: '#f9fafb',
      bodyColor: '#e5e7eb',
      borderColor: '#6b7280',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += formatNumber(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        drawOnChartArea: true,
        drawTicks: true
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11
        },
        maxTicksLimit: 8,
        display: true
      }
    },
    y: {
      type: 'logarithmic',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        drawOnChartArea: true,
        drawTicks: true
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11
        },
        maxTicksLimit: 8,
        display: true,
        callback: function(value) {
          return formatNumber(value);
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  elements: {
    line: {
      tension: 0.1
    },
    point: {
      radius: 3,
      hoverRadius: 6
    },
    bar: {
      borderRadius: 4,
      borderSkipped: false
    }
  }
}));

// Watch for changes that should trigger chart re-render
watch([futureTRProjections, futureTRsToProject], () => {
  forceChartUpdate();
}, { deep: true });

// Berechne die Upgrade-Kosten für alle verbesserten Boosts
const upgradeCosts = computed(() => {
  if (!allImprovedBoosts.value.length) return null;
  
  // Kosten nach Ressourcentyp gruppieren
  const costs = {
    fragments: 0,        // Für Relics
    hellishBiomatter: 0, // Für Inscryptions
    tessarects: 0,       // Für Gadgets
    mp: 0,               // Für Loop Mods
    shards: 0            // Für M0
  };
  
  // Kosten für jeden verbesserten Boost berechnen
  allImprovedBoosts.value.forEach(boost => {
    // Nur wenn tatsächlich ein Upgrade stattfindet
    if (boost.endValue > boost.startValue) {
      // Spezialfall: M0 (kostet Shards)
      if (boost.key === 'ms0') {
        const costString = calculateM0CostRangeSafe(boost.startValue, boost.endValue);
        // Setze auf 1 damit v-if="upgradeCosts.shards > 0" funktioniert
        costs.shards = 1;  
        // Speichere den formatierten String für die Anzeige
        costs.shardsFormatted = costString;
      } 
      // Spezialfall: Loop Mods (kosten MP)
      else if (boost.key === 'lmConsistency') {
        const exponent = getRuleOfConsistencyExponent(boost.endValue);
        const costString = exponent.toString();
        // Setze auf 1 damit v-if="upgradeCosts.mp > 0" funktioniert
        costs.mp = 1;
        // Speichere den formatierten String für die Anzeige
        costs.mpFormatted = costString;
      }
      // Relics (kosten Fragments)
      else if (boost.category === 'relic') {
        const relicId = `r${boost.key.replace('r', '')}`;
        for (let level = boost.startValue + 1; level <= boost.endValue; level++) {
          costs.fragments += getRelicCost(relicId, level);
        }
      }
      // Inscryptions (kosten Hellish-Biomatter)
      else if (boost.category === 'inscryption') {
        const inscrId = `i${boost.key.replace('i', '')}`;
        for (let level = boost.startValue + 1; level <= boost.endValue; level++) {
          costs.hellishBiomatter += getInscryptionCost(inscrId, level);
        }
      }
      // Gadgets (kosten Tessarects)
      else if (boost.category === 'gadget') {
        // Spezialfall-Mapping für bestimmte Gadgets
        let gadgetId = boost.key;
        if (boost.key === 'oogadget') gadgetId = 'g4';
        if (boost.key === 'campfragdet') gadgetId = 'g14';
        
        for (let level = boost.startValue + 1; level <= boost.endValue; level++) {
          costs.tessarects += getGadgetCost(gadgetId, level);
        }
      }
    }
  });
  
  // Prüfen ob überhaupt Kosten angefallen sind
  if (costs.fragments === 0 && costs.hellishBiomatter === 0 && costs.tessarects === 0 &&
      costs.mp === 0 && costs.shards === 0) {
    return null;
  }
  
  return costs;
});

// Hilfsfunktion, um zu prüfen ob Kosten angezeigt werden sollen
const hasUpgradeCosts = computed(() => {
  return upgradeCosts.value !== null;
});

function getChainStartDate(index) {
  // Beginne mit dem Startdatum des ersten TRs
  let currentDate = new Date(planStartDate.value.getTime());
  
  // Addiere die Stunden des ersten TRs
  currentDate = new Date(currentDate.getTime() + (firstTrHours.value * 60 * 60 * 1000));
  
  // Für alle TRs vor dem aktuellen, addiere deren Stunden
  for (let i = 0; i < index; i++) {
    if (plan.value?.trChain && plan.value.trChain[i]) {
      const hours = getChainTrHours(plan.value.trChain[i]);
      currentDate = new Date(currentDate.getTime() + (hours * 60 * 60 * 1000));
    }
  }
  
  return currentDate;
}

// Verbesserte Funktion für den Tooltip, die nur die Boosts anzeigt, 
// die auch in der Boosts Progression Sektion erscheinen
function getBoostListHtml(trIndex) {
  // Erster TR oder Chain-TR?
  const rawBoosts = trIndex === 0 
    ? plan.value?.boosts 
    : plan.value?.trChain?.[trIndex-1]?.boosts;

  // Konvertiere Boosts zu einheitlichem Array-Format
  let currentBoosts = [];
  
  // NEUES FORMAT: Object
  if (rawBoosts && typeof rawBoosts === 'object' && !Array.isArray(rawBoosts)) {
    currentBoosts = Object.entries(rawBoosts).map(([key, boostData]) => ({
      key,
      ...boostData
    }));
  }
  // ALTES FORMAT: Array (Rückwärtskompatibilität)
  else if (Array.isArray(rawBoosts)) {
    currentBoosts = rawBoosts;
  }

  // Rekursive Funktion, um den aktuellsten Wert eines Boosts vor diesem TR zu finden
  function findMostRecentValue(boostKey, currentTrIndex) {
    // Wenn wir beim ersten TR sind, verwenden wir die Startwerte aus den Stats
    if (currentTrIndex === 0) {
      // Verwende den Wert aus updatedStats oder currentStats
      if (plan.value?.updatedStats && plan.value.updatedStats[boostKey] !== undefined) {
        return plan.value.updatedStats[boostKey];
      }
      if (props.currentStats && props.currentStats[boostKey] !== undefined) {
        return props.currentStats[boostKey];
      }
      return 0;
    }
    
    // Für TR 1 (index 0) suchen wir direkt in den Boosts
    if (currentTrIndex === 1) {
      const planBoosts = plan.value?.boosts;
      let boost = null;
      
      // NEUES FORMAT: Object
      if (planBoosts && typeof planBoosts === 'object' && !Array.isArray(planBoosts)) {
        boost = planBoosts[boostKey];
      }
      // ALTES FORMAT: Array
      else if (Array.isArray(planBoosts)) {
        boost = planBoosts.find(b => b.key === boostKey);
      }
      
      if (boost) {
        return boost.targetLevel;
      }
    } else {
      // Für TR 2+ suchen wir in der Chain
      const chainBoosts = plan.value?.trChain?.[currentTrIndex-2]?.boosts;
      let boost = null;
      
      // NEUES FORMAT: Object
      if (chainBoosts && typeof chainBoosts === 'object' && !Array.isArray(chainBoosts)) {
        boost = chainBoosts[boostKey];
      }
      // ALTES FORMAT: Array
      else if (Array.isArray(chainBoosts)) {
        boost = chainBoosts.find(b => b.key === boostKey);
      }
      
      if (boost) {
        return boost.targetLevel;
      }
    }
    
    // Wenn der Boost im aktuellen TR nicht gefunden wurde, suche im vorherigen TR
    return findMostRecentValue(boostKey, currentTrIndex - 1);
  }

  // Finde nur Boosts, die in diesem TR tatsächlich verbessert werden
  const improvedBoosts = [];
  
  for (const boost of currentBoosts) {
    // Filtere wie in der allImprovedBoosts computed property:
    // 1. Nur numerische Boosts betrachten
    if (boost.type !== 'number') continue;
    
    // 2. Kategorien filtern, die nicht angezeigt werden sollen
    const boostInfo = allBoosts.find(b => b.key === boost.key);
    if (!boostInfo) continue;
    
    // 3. Rekursiv nach dem letzten bekannten Wert suchen
    const actualStart = findMostRecentValue(boost.key, trIndex);
    
    // 4. Nur Boosts einbeziehen, die tatsächlich verbessert wurden
    if (boost.targetLevel > actualStart) {
      improvedBoosts.push({
        ...boost,
        actualStart: actualStart
      });
    }
  }
  
  // Wenn keine Boosts verbessert wurden
  if (improvedBoosts.length === 0) {
    return '<div class="p-2 text-gray-400 text-xs">No boosts improved</div>';
  }
  
  let html = '<div class="p-2">';
  html += '<div class="text-sm font-medium text-white mb-2">Improved Boosts</div>';
  html += `<div class="grid grid-cols-1 gap-1">`;
  
  // Sortieren nach prozentualem Wachstum
  improvedBoosts.sort((a, b) => {
    const aImprovement = (a.targetLevel - a.actualStart) / Math.max(1, a.actualStart);
    const bImprovement = (b.targetLevel - b.actualStart) / Math.max(1, b.actualStart);
    return bImprovement - aImprovement;
  });
  
  // Einträge für jeden verbesserten Boost generieren
  improvedBoosts.forEach(boost => {
    const improvement = boost.targetLevel - boost.actualStart;
    
    html += `
      <div class="flex items-center justify-between text-xs py-1 border-b border-gray-700">
        <span class="font-medium text-gray-200 pr-3">${boost.label}</span>
        <div class="flex items-center">
          <span class="text-gray-400">${boost.actualStart}</span>
          <span class="mx-1 text-gray-500">→</span>
          <span class="text-blue-300 font-medium">${boost.targetLevel}</span>
          <span class="ml-1 text-green-400">(+${improvement})</span>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  html += '</div>';
  return html;
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

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
</style>