<template>
  <div 
    class="plan-card relative bg-gray-850 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-blue-600 transition-all cursor-pointer"
    @click="$emit('click')"
  >
    <div class="absolute top-0 left-0 right-0 h-1 bg-blue-600" :style="{ width: `${progressPercentage}%` }"></div>
    
    <!-- Header mit Plan-Name und Erstellungsdatum -->
    <div class="p-4 !pb-2 border-b border-gray-700">
      <!-- Name mit Griffleiste -->
      <div class="flex items-start">
        <div class="grip-handle mr-2 text-gray-500 hover:text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0 mt-1">
          <IconGripVertical size="20" />
        </div>
        <div class="w-full">
          <div class="flex items-center">
            <h3 class="text-lg font-bold text-white pr-2">{{ truncatedPlanName }}</h3>
          </div>
          
          <!-- Datum in zweiter Zeile -->
          <div class="flex items-center text-xs text-gray-400 mt-1"> 
            <IconCalendarEvent size="12" class="mr-1" />
            <span>{{ formatPlanStartDate }}</span>
            <span class="mx-1">-</span>
            <span>{{ formatPlanEndDate }}</span>
          </div>
        </div>
      </div>
      
      <!-- Trennstrich über die gesamte Breite -->
      <div class="h-px bg-gray-500/50 my-2 -mx-4"></div>
      
      <!-- Action-Buttons in dritter Zeile, linksbündig -->
      <div class="flex items-center justify-between mt-2 relative">
        <!-- Linke Seite: Action Buttons -->
        <div class="flex items-center space-x-3">
          <button 
            @click.stop="$emit('edit')" 
            class="icon-button"
            title="Edit plan"
          >
            <IconEdit size="16" />
          </button>
          <button 
            @click.stop="$emit('copy')" 
            class="icon-button"
            title="Copy plan"
          >
            <IconCopy size="16" />
          </button>
          <!-- <button 
            @click.stop="$emit('adjustments')" 
            class="icon-button"
            title="Gem overrides"
          >
            <IconAdjustments size="16" />
          </button> -->
          <button 
            @click.stop="$emit('share')" 
            class="icon-button"
            title="Share plan"
          >
            <IconShare size="16" />
          </button>
          
          <!-- Delete Button mit Dropdown-Bestätigung -->
          <div class="relative" ref="deleteButtonContainer">
            <button 
              @click.stop="toggleDeleteConfirmation"
              class="icon-button text-red-500/70 hover:text-red-400"
              :class="{ 'bg-red-900/30': showDeleteConfirmation }"
              title="Delete plan"
            >
              <IconTrash size="16" />
            </button>
            
            <!-- Delete Confirmation Dropdown -->
            <div 
              v-if="showDeleteConfirmation"
              class="absolute top-full left-0 mt-1 z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-3 min-w-[180px]"
              @click.stop
            >
              <div class="text-sm text-white mb-2 font-medium">
                Delete "{{ truncatedPlanName }}"?
              </div>
              <div class="flex space-x-2">
                <button 
                  @click="confirmDelete"
                  class="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors font-medium"
                >
                  Delete
                </button>
                <button 
                  @click="cancelDelete"
                  class="flex-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Rechte Seite: Override Tags -->
        <div class="flex items-center space-x-2">
          <!-- Gem Overrides Badge -->
          <span 
            v-if="hasGemOverrides" 
            class="px-2 py-0.5 bg-purple-600/20 text-purple-300 text-xs rounded border border-purple-500/30 flex items-center"
            title="This plan has gem overrides"
          >
            <IconAdjustments size="12" class="mr-1" />
            Gems
          </span>
          
          <!-- Maxed Boosts Overrides Badge -->
          <span 
            v-if="hasMaxedBoostsOverrides" 
            class="px-2 py-0.5 bg-blue-600/20 text-blue-300 text-xs rounded border border-blue-500/30 flex items-center"
            title="This plan has maxed boosts overrides"
          >
            <IconAdjustments size="12" class="mr-1" />
            Maxed
          </span>
        </div>
      </div>
    </div>
    
    <!-- Plan Stats -->
    <div class="px-4 py-3">
      <div class="grid grid-cols-2 gap-3">
        <!-- TRs count -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">TRs</div>
          <div class="text-base font-semibold text-blue-400">{{ totalTRs }}</div>
        </div>
        
        <!-- Duration -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Duration</div>
          <div class="text-base font-semibold text-green-400">{{ formatDuration }}</div>
        </div>
        
        <!-- Orb Gains -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Orb Gains</div>
          <div class="text-base font-semibold text-purple-300/80 flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
            {{ formatNumber(totalOrbGains) }}
          </div>
        </div>
        
        <!-- Frag Gains -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Frag Gains</div>
          <div class="text-base font-semibold text-orange-400 flex items-center">
            <img src="@/assets/general/fragments.png" class="w-4 h-4 mr-1" alt="Fragments" />
            {{ formatNumber(totalFragGains) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress & Timing -->
    <div class="px-4 py-3 bg-gray-800/40 border-t border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-xs text-gray-400">
          <IconClock size="14" class="mr-1" />
          <span>{{ progressStatus }}</span>
        </div>
        <div class="text-xs font-medium" :class="progressColor">{{ progressPercentage }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, onMounted, onUnmounted } from 'vue';
import { 
  IconCalendarEvent, 
  IconEdit, 
  IconTrash, 
  IconClock,
  IconCopy,
  IconShare,
  IconGripVertical,
  IconAdjustments
} from '@tabler/icons-vue';
import { formatNumber } from '@/composables/format';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  currentStats: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['click', 'edit', 'copy', 'share', 'adjustments', 'delete']);

// Debug-Update für die Plan-Änderungen
watch(() => props.plan, (newPlan) => {
  console.log("Plan updated:", newPlan.name);
  // Forciere eine Neuberechnung aller computed-Werte
  forceUpdateCounter.value++;
}, { deep: true });

// Verwende eine Counter-Variable, um bei Änderungen eine Neuberechnung zu erzwingen
const forceUpdateCounter = ref(0);

// TR Count (1 + Anzahl der TR-Chain Steps) - mit Reaktivität sichergestellt
const totalTRs = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  // Basis-TR
  let count = 1;
  
  // TRs aus der TR-Chain
  if (props.plan.trChain && Array.isArray(props.plan.trChain)) {
    // Zähle nur gültige Einträge (verhindert Fehler durch leere oder ungültige Einträge)
    count += props.plan.trChain.filter(step => step && typeof step === 'object').length;
    
    // Debug-Info
    console.log(`Plan ${props.plan.name}: ${count} TRs gefunden (1 + ${props.plan.trChain.filter(step => step).length})`);
  }
  
  return count;
});

// Totale Orb-Gewinne
const totalOrbGains = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  let total = 0;
  
  // Orbs vom ersten TR
  if (props.plan.results && props.plan.results.orbGains) {
    total += props.plan.results.orbGains;
  }
  
  // Orbs aus der TR-Chain
  if (props.plan.trChain && Array.isArray(props.plan.trChain)) {
    props.plan.trChain.forEach(step => {
      if (step && step.results && step.results.orbGains) {
        total += step.results.orbGains;
      }
    });
  }
  
  return total;
});

// Totale Fragment-Gewinne
const totalFragGains = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  let total = 0;
  
  // Frags vom ersten TR
  if (props.plan.results && props.plan.results.campaignFragGains) {
    total += props.plan.results.campaignFragGains;
  }
  
  // Frags aus der TR-Chain
  if (props.plan.trChain && Array.isArray(props.plan.trChain)) {
    props.plan.trChain.forEach(step => {
      if (step && step.results && step.results.campaignFragGains) {
        total += step.results.campaignFragGains;
      }
    });
  }
  
  return total;
});

// Start- und Endzeit des Plans
const planStartDate = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  if (!props.plan.trStartDate || !props.plan.trStartTime) return null;
  
  const [year, month, day] = props.plan.trStartDate.split('-').map(Number);
  const [hours, minutes] = props.plan.trStartTime.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
});

// Formatiertes Enddatum für die Anzeige
const formatPlanEndDate = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  if (!planEndDate.value) return 'Unknown end date';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  };
  
  return planEndDate.value.toLocaleDateString(undefined, options);
});

const planEndDate = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  if (!planStartDate.value) return null;
  
  // Gesamtstunden berechnen
  let totalHours = 0;
  
  // Stunden für den ersten TR
  const hoursBoost = props.plan.boosts?.hoursInTR;
  if (hoursBoost) {
    totalHours += hoursBoost.targetLevel || 0;
  }
  
  // Stunden aus der TR-Chain
  if (props.plan.trChain && Array.isArray(props.plan.trChain)) {
    props.plan.trChain.forEach(step => {
      if (step) {
        const chainHoursBoost = step.boosts?.hoursInTR;
        if (chainHoursBoost) {
          totalHours += chainHoursBoost.targetLevel || 0;
        }
      }
    });
  }
  
  // Millisekunden für die Gesamtstunden berechnen
  const totalMilliseconds = totalHours * 60 * 60 * 1000;
  
  // Enddatum berechnen
  return new Date(planStartDate.value.getTime() + totalMilliseconds);
});

// Formatierung der Dauer
const formatDuration = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  if (!planStartDate.value || !planEndDate.value) return 'N/A';
  
  const diffMs = planEndDate.value - planStartDate.value;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  // Wenn weniger als 24 Stunden, dann in Stunden anzeigen
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  
  // Sonst in Tagen anzeigen
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  
  if (remainingHours === 0) {
    return `${diffDays}d`;
  }
  
  return `${diffDays}d ${remainingHours}h`;
});

// Progress-Berechnung basierend auf der Zeit
const progressPercentage = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  // Wenn Start- oder Enddatum fehlt, kein Progress
  if (!planStartDate.value || !planEndDate.value) return 0;
  
  const now = new Date();
  
  // Wenn der Plan noch nicht begonnen hat
  if (now < planStartDate.value) return 0;
  
  // Wenn der Plan bereits abgeschlossen ist
  if (now > planEndDate.value) return 100;
  
  // Berechne den Progress basierend auf der vergangenen Zeit
  const totalDuration = planEndDate.value - planStartDate.value;
  const elapsed = now - planStartDate.value;
  
  const progress = Math.floor((elapsed / totalDuration) * 100);
  return Math.min(100, Math.max(0, progress)); // Zwischen 0 und 100 begrenzen
});

// Progress Status Text
const progressStatus = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  if (!planStartDate.value || !planEndDate.value) return 'No timing info';
  
  const now = new Date();
  
  // Wenn der Plan noch nicht begonnen hat
  if (now < planStartDate.value) {
    // Tage/Stunden bis zum Start
    const diffMs = planStartDate.value - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Starts in ${diffHours}h`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `Starts in ${diffDays}d`;
  }
  
  // Wenn der Plan bereits abgeschlossen ist
  if (now > planEndDate.value) {
    // Tage/Stunden seit Abschluss
    const diffMs = now - planEndDate.value;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Completed ${diffHours}h ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `Completed ${diffDays}d ago`;
  }
  
  // Wenn der Plan läuft, zeige verbleibende Zeit
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

// Farbe des Fortschrittsbalkens basierend auf dem Status
const progressColor = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  if (!planStartDate.value || !planEndDate.value) return 'text-gray-400';
  
  const now = new Date();
  
  // Plan noch nicht gestartet
  if (now < planStartDate.value) return 'text-blue-400';
  
  // Plan abgeschlossen
  if (now > planEndDate.value) return 'text-green-400';
  
  // Plan läuft
  if (progressPercentage.value < 50) return 'text-yellow-400';
  if (progressPercentage.value < 75) return 'text-orange-400';
  return 'text-green-400';
});

// Formatierte Zeit für die Anzeige
const formatPlanStartDate = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  if (!props.plan.trStartDate) return 'No start date';
  
  // Falls wir Datum und Zeit haben
  if (props.plan.trStartDate && props.plan.trStartTime) {
    const [year, month, day] = props.plan.trStartDate.split('-').map(Number);
    const [hours, minutes] = props.plan.trStartTime.split(':').map(Number);
    
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    
    return startDate.toLocaleDateString(undefined, options);
  }
  
  // Falls wir nur das Datum haben
  return props.plan.trStartDate.split('-').reverse().join('.');
});

const truncatedPlanName = computed(() => {
  if (!props.plan.name) return '';
  
  const maxLength = 30;
  if (props.plan.name.length <= maxLength) {
    return props.plan.name;
  }
  
  return props.plan.name.substring(0, maxLength) + '...';
});

// Check für Gem Overrides
const hasGemOverrides = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  return props.plan.gemOverrides && Object.keys(props.plan.gemOverrides).length > 0;
});

// Check für Maxed Boosts Overrides
const hasMaxedBoostsOverrides = computed(() => {
  // Dummy-Zugriff auf forceUpdateCounter, um Reaktivität zu erzwingen
  const _ = forceUpdateCounter.value;
  
  return props.plan.maxedBoostsOverrides && Object.keys(props.plan.maxedBoostsOverrides).length > 0;
});

// Delete Confirmation State
const showDeleteConfirmation = ref(false);
const deleteButtonContainer = ref(null);

// Delete Confirmation Methods
function toggleDeleteConfirmation() {
  showDeleteConfirmation.value = !showDeleteConfirmation.value;
}

function confirmDelete() {
  showDeleteConfirmation.value = false;
  emit('delete');
}

function cancelDelete() {
  showDeleteConfirmation.value = false;
}

// Click outside handler
function handleClickOutside(event) {
  if (deleteButtonContainer.value && !deleteButtonContainer.value.contains(event.target)) {
    showDeleteConfirmation.value = false;
  }
}

// Lifecycle für Click Outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.plan-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.plan-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.stat-box {
  padding: 0.375rem;
  background-color: rgba(31, 48, 83, 0.4);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  border-radius: 0.25rem;
  background-color: rgba(55, 65, 81, 0.3);
  color: rgba(209, 213, 219, 1);
  transition: all 0.2s ease;
}

.icon-button:hover {
  background-color: rgba(75, 85, 99, 0.5);
  color: rgba(255, 255, 255, 0.9);
}

/* Delete Confirmation Dropdown Animation */
.absolute.top-full {
  animation: slideDown 0.15s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>