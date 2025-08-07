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
          <div class="flex items-center text-xs text-gray-400 mt-1"> 
            <IconCalendarEvent size="12" class="mr-1" />
            <span>{{ formatPlanDate }}</span>
            <span class="mx-1">•</span>
            <span>{{ plan.maxTRReached || 1 }} TRs</span>
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
            @click.stop="$emit('load')" 
            class="icon-button text-blue-400/80 hover:text-blue-300"
            title="Load plan"
          >
            <IconEye size="16" />
          </button>
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
        
        <!-- Rechte Seite: Mode Badge -->
        <div class="flex items-center space-x-2">
          <!-- Spending Mode Badge -->
          <span 
            class="px-2 py-0.5 text-xs rounded border flex items-center"
            :class="spendingModeClass"
            :title="`Spending mode: ${plan.spendingMode || 'manual'}`"
          >
            <component :is="spendingModeIcon" size="12" class="mr-1" />
            {{ (plan.spendingMode || 'manual').charAt(0).toUpperCase() + (plan.spendingMode || 'manual').slice(1) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Plan Stats -->
    <div class="px-4 py-3">
      <div class="grid grid-cols-2 gap-3">
        <!-- Total Budget -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Total Budget</div>
          <div class="text-base font-semibold text-purple-300 flex items-center">
            <img src="@/assets/general/orbs.png" class="w-4 h-4 mr-1" alt="Orbs" />
            {{ formatNumber(totalBudget) }}
          </div>
        </div>
        
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
        
        <!-- Gems Upgraded -->
        <div class="stat-box">
          <div class="text-xs text-gray-400">Gems Upgraded</div>
          <div class="text-base font-semibold text-blue-400 flex items-center">
            <IconDiamond size="16" class="mr-1" />
            {{ gemsUpgraded }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Progress & Info -->
    <div class="px-4 py-3 bg-gray-800/40 border-t border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-xs text-gray-400">
          <IconClock size="14" class="mr-1" />
          <span>{{ budgetStatusText }}</span>
        </div>
        <div class="text-xs font-medium" :class="budgetStatusColor">{{ budgetUsagePercentage }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { 
  IconCalendarEvent, 
  IconEdit, 
  IconTrash, 
  IconClock,
  IconCopy,
  IconShare,
  IconGripVertical,
  IconDiamond,
  IconEye,
  IconTool,
  IconRobot
} from '@tabler/icons-vue';
import { formatNumber } from '@/composables/format';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click', 'load', 'edit', 'copy', 'share', 'delete']);

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

// Budget Usage Percentage
const budgetUsagePercentage = computed(() => {
  if (totalBudget.value === 0) return 0;
  return Math.round((totalSpent.value / totalBudget.value) * 100);
});

// Budget Status Text
const budgetStatusText = computed(() => {
  const percentage = budgetUsagePercentage.value;
  if (percentage === 0) return 'No spending yet';
  if (percentage < 50) return 'Light spending';
  if (percentage < 75) return 'Moderate spending';
  if (percentage < 90) return 'Heavy spending';
  if (percentage < 100) return 'Almost fully spent';
  return 'Budget exceeded';
});

// Budget Status Color
const budgetStatusColor = computed(() => {
  const percentage = budgetUsagePercentage.value;
  if (percentage < 50) return 'text-green-400';
  if (percentage < 75) return 'text-yellow-400';
  if (percentage < 90) return 'text-orange-400';
  if (percentage <= 100) return 'text-red-400';
  return 'text-red-600';
});

// Spending Mode styling
const spendingModeClass = computed(() => {
  const mode = props.plan.spendingMode || 'manual';
  if (mode === 'manual') {
    return 'bg-orange-600/20 text-orange-300 border-orange-500/30';
  } else {
    return 'bg-green-600/20 text-green-300 border-green-500/30';
  }
});

const spendingModeIcon = computed(() => {
  const mode = props.plan.spendingMode || 'manual';
  return mode === 'manual' ? IconTool : IconRobot;
});

// Gems Upgraded count
const gemsUpgraded = computed(() => {
  const upgradedGems = new Set();
  
  if (props.plan.trGemStates) {
    Object.values(props.plan.trGemStates).forEach(trState => {
      if (trState.levels) {
        Object.entries(trState.levels).forEach(([gemId, level]) => {
          if (level > 0) upgradedGems.add(gemId);
        });
      }
      if (trState.upgrades) {
        Object.keys(trState.upgrades).forEach(gemId => {
          upgradedGems.add(gemId);
        });
      }
    });
  }
  
  return upgradedGems.size;
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
