<template>
  <div 
    class="plan-card relative bg-gray-850 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-purple-600 transition-all cursor-pointer"
    @click="$emit('click')"
  >
    <div class="absolute top-0 left-0 right-0 h-1 bg-purple-600" :style="{ width: `${budgetUsagePercentage}%` }"></div>
    
    <!-- Header mit Plan-Name und Speicherdatum -->
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
          <!-- <div class="flex items-center text-xs text-gray-400 mt-1"> 
            <IconCalendarEvent size="12" class="mr-1" />
            <span>{{ formatPlanDate }}</span>
            <span class="mx-1">•</span>
            <span>{{ plan.maxTRReached || 1 }} TRs</span>
          </div> -->
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
      </div>
    </div>
    
    <!-- Plan Stats -->
    <div class="px-4 py-3">

      <div class="grid grid-cols-2 gap-3 mb-3">
        <!-- Total Budget -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Total Budget</div>
          <div class="text-base font-semibold text-purple-300 flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
            {{ formatNumber(totalBudget) }}
          </div>
        </div>

        <!-- TRs Count -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">TRs</div>
          <div class="text-base font-semibold text-blue-400">{{ trCount }}</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <!-- Spent -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Spent</div>
          <div class="text-base font-semibold text-red-300 flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
            {{ formatNumber(totalSpent) }}
          </div>
        </div>
        
        <!-- Remaining -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Remaining</div>
          <div class="text-base font-semibold text-green-300 flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
            {{ formatNumber(totalBudget - totalSpent) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { 
  IconEdit, 
  IconTrash, 
  IconCopy,
  IconGripVertical,
} from '@tabler/icons-vue';
import { formatNumber } from '@/composables/format';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click', 'edit', 'copy', 'share', 'delete']);

// Formatiertes Speicherdatum
const formatPlanDate = computed(() => {
  if (!props.plan.savedAt) return 'Unknown date';
  try {
    const date = new Date(props.plan.savedAt);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
});

// Truncated Plan Name
const truncatedPlanName = computed(() => {
  if (!props.plan.name) return '';
  
  const maxLength = 30;
  if (props.plan.name.length <= maxLength) {
    return props.plan.name;
  }
  
  return props.plan.name.substring(0, maxLength) + '...';
});

// Total Budget über alle TRs
const totalBudget = computed(() => {
  let total = 0;
  if (props.plan.trBudgets) {
    Object.values(props.plan.trBudgets).forEach(budget => {
      total += budget || 0;
    });
  }
  return total;
});

// Total Spent über alle TRs
const totalSpent = computed(() => {
  // Use plan.totalSpent if available (from newer saved plans)
  if (props.plan.totalSpent !== undefined && props.plan.totalSpent !== null) {
    return props.plan.totalSpent;
  }
  
  // Fallback to spentOrbs calculation for older plans
  let total = 0;
  if (props.plan.spentOrbs) {
    Object.values(props.plan.spentOrbs).forEach(trSpending => {
      Object.values(trSpending || {}).forEach(gemSpending => {
        Object.values(gemSpending || {}).forEach(upgradeSpent => {
          total += upgradeSpent || 0;
        });
      });
    });
  }
  return total;
});

// TR Count
const trCount = computed(() => {
  // Use maxTRReached if available, otherwise count trBudgets entries, fallback to 1
  return props.plan.maxTRReached || 
         (props.plan.trBudgets ? Object.keys(props.plan.trBudgets).length : 0) || 
         props.plan.trCount || 
         1;
});

// Budget Usage Percentage
const budgetUsagePercentage = computed(() => {
  if (totalBudget.value === 0) return 0;
  return Math.round((totalSpent.value / totalBudget.value) * 100);
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
.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
}

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

.grip-handle {
  cursor: grab;
}

.grip-handle:active {
  cursor: grabbing;
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
