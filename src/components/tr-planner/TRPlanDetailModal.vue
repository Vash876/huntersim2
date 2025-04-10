<!-- filepath: \src\components\tr-planner\TRPlanDetailModal.vue -->
<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
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
                    <IconCircle size="20" class="text-green-400" />
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
                  <th scope="col" class="px-4 py-2 text-right font-medium">Hours</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">Orbs</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">Frags</th>
                  <th scope="col" class="px-4 py-2 text-right font-medium">All-Time Orbs</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700">
                <!-- Erster TR -->
                <tr class="bg-gray-750/20 hover:bg-gray-700/40 transition">
                  <td class="px-4 py-2.5 font-medium">1</td>
                  <td class="px-4 py-2.5">
                    {{ plan.updatedStats?.trCount || currentTrCount }} → {{ (plan.updatedStats?.trCount || currentTrCount) + 1 }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-mono">
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
                    <td class="px-4 py-2.5 font-medium">{{ index + 2 }}</td>
                    <td class="px-4 py-2.5">
                      {{ (plan.updatedStats?.trCount || currentTrCount) + index + 1 }} → {{ (plan.updatedStats?.trCount || currentTrCount) + index + 2 }}
                    </td>
                    <td class="px-4 py-2.5 text-right font-mono">
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
                  <td class="px-4 py-2 text-right font-mono">{{ formatNumber(totalHoursInTR) }}</td>
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
          <h3 class="text-sm font-bold mb-3 text-blue-300">Stats Progression</h3>
          
          <div class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg p-2">
            <div v-if="!allImprovedBoosts.length" class="text-gray-400 text-center py-2 text-sm">
              No Stats improved in this plan.
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
          </div>
        </div>

<!-- TR-Requirements Projektion mit Chart.js -->
<div class="p-4 border-b border-gray-700">
  <h3 class="text-sm font-bold mb-3 text-blue-300">Future TR Requirements Projection</h3>
  
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
      <canvas ref="chartRef" height="240"></canvas>
    </div>
    
    <!-- Legende -->
    <div class="flex items-center justify-center gap-3 text-xs mt-4">
      <div class="flex items-center">
        <div class="w-3 h-3 bg-red-500/70 mr-1"></div>
        <span>Required</span>
      </div>
      <div class="flex items-center">
        <div class="w-3 h-3 bg-green-500/70 mr-1"></div>
        <span>Available</span>
      </div>
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
import { Chart, registerables } from 'chart.js';
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
  const hoursBoost = plan.value.boosts.find(b => b.key === 'hoursInTR');
  return hoursBoost ? hoursBoost.targetLevel : 0;
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
  
  const hoursBoost = chainStep.boosts.find(b => b.key === 'hoursInTR');
  return hoursBoost ? hoursBoost.targetLevel : 0;
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
  
  // Sammle die Startwerte aus den updatedStats oder currentStats
  const initialValues = { 
    ...(props.currentStats || {}),
    ...(plan.value.updatedStats || {})
  };
  
  // Setze die Ausgangswerte aus dem ersten TR (targetLevel als Startpunkt)
  if (plan.value.boosts && Array.isArray(plan.value.boosts)) {
    plan.value.boosts.forEach(boost => {
      if (boost.type === 'number') {
        // Prüfen, ob der Boost nicht zur Zeit-Kategorie gehört
        const boostInfo = boostsByKey[boost.key];
        if (boostInfo && boostInfo.category !== 'time') {
          boostedStats.set(boost.key, {
            key: boost.key,
            label: boost.label || boost.key,
            startValue: boost.targetLevel,  // Startwert nach dem ersten TR
            endValue: boost.targetLevel,    // Initial der gleiche Wert
            category: boostInfo.category
          });
        }
      }
    });
  }
  
  // Verfolge die Progression durch die TR-Kette und aktualisiere die Endwerte
  if (plan.value.trChain && Array.isArray(plan.value.trChain)) {
    plan.value.trChain.forEach(chainStep => {
      if (chainStep.boosts && Array.isArray(chainStep.boosts)) {
        chainStep.boosts.forEach(boost => {
          if (boost.type === 'number' && boostedStats.has(boost.key)) {
            const statInfo = boostedStats.get(boost.key);
            statInfo.endValue = boost.targetLevel;
          } else if (boost.type === 'number') {
            // Falls ein Boost nur in der Chain auftaucht, aber nicht im ersten TR
            const boostInfo = boostsByKey[boost.key];
            if (boostInfo && boostInfo.category !== 'time') {
              // Hier ist die Änderung: Hole den Startwert aus initialValues oder setze 0
              const startValue = initialValues[boost.key] || 0;
              
              boostedStats.set(boost.key, {
                key: boost.key,
                label: boost.label || boost.key,
                startValue: startValue, // FIX: Verwende den Wert aus initialValues
                endValue: boost.targetLevel,
                category: boostInfo.category
              });
            }
          }
        });
      }
    });
  }
  
  // Debug-Ausgabe für problematische Stats
  const problematicStats = ['shipinstalls', 'campaigns', 'boonHLevel', 'ms0'];
  problematicStats.forEach(key => {
    if (boostedStats.has(key)) {
      console.log(`Stats-Progression für ${key}: ${boostedStats.get(key).startValue} → ${boostedStats.get(key).endValue}`);
    } else {
      console.log(`Stat ${key} nicht in boostedStats gefunden`);
    }
  });
  
  // Konvertiere die Map in ein Array, filtere nach verbesserten Boosts und sortiere
  for (const boost of boostedStats.values()) {
    // Nur Boosts einschließen, bei denen eine Verbesserung stattfindet
    // ODER die einen Wert > 0 haben (damit auch vorhandene Stats angezeigt werden)
    if (boost.endValue > boost.startValue || boost.endValue > 0) {
      result.push(boost);
    }
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

// Timeline-Segmente für die visuelle Darstellung
const timelineSegments = computed(() => {
  if (!plan.value || !planStartDate.value || !planEndDate.value) return [];
  
  const segments = [];
  const totalDuration = totalHoursInTR.value;
  
  if (totalDuration <= 0) return segments;
  
  // Erstes Segment für den ersten TR
  let currentStartPercent = 0;
  const firstSegmentWidth = (firstTrHours.value / totalDuration) * 100;
  
  segments.push({
    trNumber: plan.value.updatedStats?.trCount + 1 || currentTrCount.value + 1,
    startPercent: currentStartPercent,
    widthPercent: firstSegmentWidth,
    color: 'bg-blue-900/50'
  });
  
  currentStartPercent += firstSegmentWidth;
  
  // Segmente für alle TRs in der Kette
  if (plan.value.trChain && Array.isArray(plan.value.trChain)) {
    plan.value.trChain.forEach((chainStep, index) => {
      const hours = getChainTrHours(chainStep);
      const widthPercent = (hours / totalDuration) * 100;
      
      segments.push({
        trNumber: (plan.value.updatedStats?.trCount || currentTrCount.value) + index + 2,
        startPercent: currentStartPercent,
        widthPercent: widthPercent,
        color: index % 2 === 0 ? 'bg-purple-900/50' : 'bg-indigo-900/50'
      });
      
      currentStartPercent += widthPercent;
    });
  }
  
  return segments;
});

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
        year: 'numeric', 
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
Chart.register(...registerables);

// Chart-Referenz
const chartRef = ref(null);
let trRequirementsChart = null;

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

// Funktion zum Rendern des Charts
function renderTRProjectionsChart() {
  if (!chartRef.value || !futureTRProjections.value.length) return;
  
  // Alte Chart-Instanz zerstören, wenn vorhanden
  if (trRequirementsChart) {
    trRequirementsChart.destroy();
  }
  
  // Chart-Daten vorbereiten
  const labels = futureTRProjections.value.map(proj => `TR${proj.trCount}`);
  const requirementData = futureTRProjections.value.map(proj => proj.requirement);
  const availableData = futureTRProjections.value.map(proj => proj.orbsAvailable);
  
  // Chart erstellen
  const ctx = chartRef.value.getContext('2d');
  trRequirementsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'TR Requirement',
          data: requirementData,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1
        },
        {
          label: 'All-Time Orbs',
          data: availableData,
          backgroundColor: 'rgba(74, 222, 128, 0.7)',
          borderColor: 'rgba(74, 222, 128, 1)',
          borderWidth: 1,
          // Typ auf 'line' ändern, damit die All-Time-Orbs als Linie dargestellt werden
          type: 'line',
          fill: false,
          tension: 0.1,
          pointBackgroundColor: 'rgba(74, 222, 128, 1)',
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'logarithmic',
          grid: {
            color: 'rgba(107, 114, 128, 0.2)'
          },
          ticks: {
            color: 'rgba(156, 163, 175, 1)',
            callback: function(value) {
              return formatNumber(value);
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(107, 114, 128, 0.2)'
          },
          ticks: {
            color: 'rgba(156, 163, 175, 1)'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: 'rgba(156, 163, 175, 1)'
          }
        },
        tooltip: {
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
      }
    }
  });
}

// Chart neu rendern, wenn sich die Projektionsdaten ändern
watch(futureTRProjections, () => {
  nextTick(() => {
    renderTRProjectionsChart();
  });
}, { deep: true });

// Chart neu rendern, wenn sich die Anzahl der zu projizierenden TRs ändert
watch(futureTRsToProject, () => {
  nextTick(() => {
    renderTRProjectionsChart();
  });
});

// Chart rendern, wenn die Komponente gemountet wird
onMounted(() => {
  nextTick(() => {
    renderTRProjectionsChart();
  });
});

// Chart neu rendern, wenn das Fenster die Größe ändert
window.addEventListener('resize', () => {
  nextTick(() => {
    renderTRProjectionsChart();
  });
});
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