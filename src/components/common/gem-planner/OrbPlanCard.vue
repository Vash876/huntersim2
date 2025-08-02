<template>
  <div 
    class="plan-card relative bg-gray-850 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-purple-600 transition-all cursor-pointer"
    @click="$emit('load', plan.id)"
  >
    <div class="absolute top-0 left-0 right-0 h-1 bg-purple-600" :style="{ width: `${progressPercentage}%` }"></div>
    
    <!-- Header mit Plan-Name und Erstellungsdatum -->
    <div class="p-4 !pb-2 border-b border-gray-700">
      <!-- Name mit Active Status -->
      <div class="flex items-start">
        <div class="w-full">
          <div class="flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-2" alt="Orbs" />
            <h3 class="text-lg font-bold text-white pr-2">{{ truncatedPlanName }}</h3>
            <span
              v-if="isActivePlan"
              class="px-2 py-0.5 bg-green-600/20 border border-green-500/30 rounded text-xs text-green-300 font-medium flex-shrink-0"
            >
              Active
            </span>
          </div>
          
          <!-- Datum in zweiter Zeile -->
          <div class="flex items-center text-xs text-gray-400 mt-1"> 
            <IconCalendar size="12" class="mr-1" />
            <span>{{ formatDate(plan.createdAt) }}</span>
            <span class="mx-1">-</span>
            <span>{{ formatDate(plan.updatedAt) }}</span>
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
            @click.stop="$emit('load', plan.id)" 
            class="icon-button text-blue-400/80 hover:text-blue-300"
            title="Load plan"
          >
            <IconPlayerPlay size="16" />
          </button>
          <button 
            @click.stop="$emit('edit', plan.id)" 
            class="icon-button"
            title="Edit plan"
          >
            <IconEdit size="16" />
          </button>
          <button 
            @click.stop="$emit('copy', plan.id)" 
            class="icon-button"
            title="Copy plan"
          >
            <IconCopy size="16" />
          </button>
          <button 
            @click.stop="$emit('share', plan.id)" 
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
        
        <!-- Rechte Seite: TR Plan Link Badge -->
        <div class="flex items-center space-x-2">
          <!-- TR Plan Link Badge -->
          <span 
            v-if="plan.trPlanId" 
            class="px-2 py-0.5 bg-blue-600/20 text-blue-300 text-xs rounded border border-blue-500/30 flex items-center"
            title="This plan is linked to a TR Plan"
          >
            <IconLink size="12" class="mr-1" />
            Linked
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
          <div class="text-base font-semibold text-blue-400">{{ plan.trCount }}</div>
        </div>
        
        <!-- Budget per TR -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Budget/TR</div>
          <div class="text-base font-semibold text-purple-300/80 flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
            {{ formatBudget(plan.initialBudget) }}
          </div>
        </div>
        
        <!-- Total Spent -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Total Spent</div>
          <div class="text-base font-semibold text-yellow-400 flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
            {{ formatNumber(totalSpentOrbs) }}
          </div>
        </div>
        
        <!-- Total Budget -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Total Budget</div>
          <div class="text-base font-semibold text-green-400 flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
            {{ formatNumber(totalBudget) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress & Status -->
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
import { computed, ref, onMounted, onUnmounted } from 'vue';
import {
  IconCalendar,
  IconClock,
  IconPlayerPlay,
  IconEdit,
  IconCopy,
  IconTrash,
  IconShare,
  IconLink
} from '@tabler/icons-vue';
import { formatNumber } from '@/composables/format.js';

// Props
const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  isActivePlan: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['load', 'edit', 'copy', 'delete', 'share']);

// Delete Confirmation State
const showDeleteConfirmation = ref(false);
const deleteButtonContainer = ref(null);

// Computed
const completedTRs = computed(() => {
  return props.plan.trSteps?.filter(step => step.spentOrbs > 0).length || 0;
});

const totalSpentOrbs = computed(() => {
  return props.plan.trSteps?.reduce((total, step) => total + (step.spentOrbs || 0), 0) || 0;
});

const totalBudget = computed(() => {
  return props.plan.initialBudget * props.plan.trCount;
});

const truncatedPlanName = computed(() => {
  if (!props.plan.name) return '';
  
  const maxLength = 30;
  if (props.plan.name.length <= maxLength) {
    return props.plan.name;
  }
  
  return props.plan.name.substring(0, maxLength) + '...';
});

// Progress-Berechnung basierend auf abgeschlossenen TRs
const progressPercentage = computed(() => {
  if (!props.plan.trCount || props.plan.trCount === 0) return 0;
  
  const progress = Math.floor((completedTRs.value / props.plan.trCount) * 100);
  return Math.min(100, Math.max(0, progress));
});

// Progress Status Text
const progressStatus = computed(() => {
  const completed = completedTRs.value;
  const total = props.plan.trCount;
  
  if (completed === 0) {
    return 'Not started';
  } else if (completed === total) {
    return 'Completed';
  } else {
    return `${completed}/${total} TRs completed`;
  }
});

// Farbe des Fortschrittsbalkens basierend auf dem Status
const progressColor = computed(() => {
  const completed = completedTRs.value;
  const total = props.plan.trCount;
  
  if (completed === 0) return 'text-gray-400';
  if (completed === total) return 'text-green-400';
  
  const percentage = (completed / total) * 100;
  if (percentage < 33) return 'text-red-400';
  if (percentage < 66) return 'text-yellow-400';
  return 'text-green-400';
});

// Delete Confirmation Methods
function toggleDeleteConfirmation() {
  showDeleteConfirmation.value = !showDeleteConfirmation.value;
}

function confirmDelete() {
  showDeleteConfirmation.value = false;
  emit('delete', props.plan.id);
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

// Methods
function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
}

function formatBudget(budget) {
  if (budget >= 1e12) return (budget / 1e12).toFixed(1) + 'T';
  if (budget >= 1e9) return (budget / 1e9).toFixed(1) + 'B';
  if (budget >= 1e6) return (budget / 1e6).toFixed(1) + 'M';
  if (budget >= 1e3) return (budget / 1e3).toFixed(1) + 'K';
  return budget.toString();
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

.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
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

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
