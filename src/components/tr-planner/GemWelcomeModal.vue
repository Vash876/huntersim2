<template>
  <div 
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="handleClose"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Schließen-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconZodiacGemini size="20" class="mr-2 text-purple-400" />
          Welcome to TR Planner!
        </h2>
        <button 
          @click="handleClose"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Modal-Inhalt -->
      <div class="p-5">
        <!-- Action Required Warning -->
        <div class="mb-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-800/50">
          <div class="flex items-start">
            <IconAlertTriangle size="20" class="text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
            <div class="text-yellow-200 text-sm">
              <p class="font-medium mb-1">Action Required</p>
              <p>Please set your current gem levels in the Gem Overview to ensure accurate Orb and Frag calculations.</p>
            </div>
          </div>
        </div>

        <!-- Maxed Boosts Reset Info - nur anzeigen wenn tatsächlich resettet wurde -->
        <div 
          v-if="hasResetMaxedBoosts" 
          class="mb-4 p-3 bg-orange-900/30 rounded-lg border border-orange-800/50"
        >
          <div class="flex items-start">
            <IconRefresh size="20" class="text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
            <div class="text-orange-200 text-sm">
              <p class="font-medium mb-1">Maxed Boosts Reset</p>
              <p>All previously marked "maxed boosts" have been automatically cleared to ensure they align with your gem levels. You'll need to reconfigure them after setting up your gems.</p>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-between items-right gap-3">
          <span></span>
          <div class="flex gap-2">
            <button 
              @click="handleOpenGemOverview"
              class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <IconZodiacGemini size="16" />
              Configure Gems
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { 
  IconZodiacGemini, 
  IconX, 
  IconAlertTriangle, 
  IconCircleCheck, 
  IconInfoCircle,
  IconSparkles,
  IconRefresh
} from '@tabler/icons-vue';
import { useTRPlannerStore } from '@/store/orbStore'; // Korrekter Import

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'openGemOverview']);

const dontShowAgain = ref(false);
const hasResetMaxedBoosts = ref(false);

// Store initialisieren
const trPlannerStore = useTRPlannerStore();

// Reset alle maxed boosts wenn das Modal erscheint
function resetAllMaxedBoosts() {
  try {
    console.log('=== DEBUG: Starting maxed boosts reset ===');
    
    const currentStats = JSON.parse(localStorage.getItem('trplanner_userstats') || '{}');
    console.log('Current stats before reset:', currentStats);
    
    const hasMaxedBoosts = currentStats._orbCalcMaxedBoosts && 
                          Object.keys(currentStats._orbCalcMaxedBoosts).length > 0;
    
    console.log('Has maxed boosts:', hasMaxedBoosts);
    console.log('Maxed boosts object:', currentStats._orbCalcMaxedBoosts);
    
    if (hasMaxedBoosts) {
      const resetCount = Object.keys(currentStats._orbCalcMaxedBoosts).length;
      console.log(`Resetting ${resetCount} maxed boosts`);
      
      // Alle maxed boosts entfernen
      currentStats._orbCalcMaxedBoosts = {};
      
      // WICHTIG: Auch die eigentlichen Boost-Werte zurücksetzen
      Object.keys(currentStats).forEach(key => {
        if (key !== '_orbCalcMaxedBoosts' && key !== 'gemData' && key !== 'allTimeOrbs') {
          const oldValue = currentStats[key];
          if (typeof currentStats[key] === 'boolean') {
            currentStats[key] = false;
          } else if (typeof currentStats[key] === 'number' && key !== 'allTimeOrbs') {
            currentStats[key] = 0;
          }
          if (oldValue !== currentStats[key]) {
            console.log(`Reset ${key}: ${oldValue} -> ${currentStats[key]}`);
          }
        }
      });
      
      // Speichere in localStorage
      localStorage.setItem('trplanner_userstats', JSON.stringify(currentStats));
      console.log('Stats after reset in localStorage:', JSON.parse(localStorage.getItem('trplanner_userstats')));
      
      // WICHTIG: Event auslösen für andere Modals (z.B. OrbCalculatorModal)
      window.dispatchEvent(new CustomEvent('maxLevelStatsChanged', {
        detail: currentStats
      }));
      
      // WICHTIG: Auch den Store updaten
      try {
        trPlannerStore.updateUserStats(currentStats);
        console.log('Updated TR Planner Store with reset data');
        console.log('Store userStats after update:', trPlannerStore.userStats);
      } catch (storeError) {
        console.error('Error updating TR Planner Store:', storeError);
      }
      
      // Setze Flag dass tatsächlich resettet wurde
      hasResetMaxedBoosts.value = true;
      
      console.log(`Welcome Modal: Reset ${resetCount} maxed boosts for gem reconfiguration`);
    } else {
      console.log('No maxed boosts found to reset');
      hasResetMaxedBoosts.value = false;
    }
    
    console.log('=== DEBUG: Finished maxed boosts reset ===');
    
  } catch (error) {
    console.error('Error resetting maxed boosts in welcome modal:', error);
    hasResetMaxedBoosts.value = false;
  }
}

function handleClose() {
  localStorage.setItem('trplanner_gem_welcome_seen', 'true');
  emit('close');
}

function handleSkip() {
  localStorage.setItem('trplanner_gem_welcome_seen', 'true');
  emit('close');
}

function handleOpenGemOverview() {
  localStorage.setItem('trplanner_gem_welcome_seen', 'true');
  emit('openGemOverview');
}

// Reset maxed boosts wenn Modal sichtbar wird
onMounted(() => {
  if (props.isVisible) {
    resetAllMaxedBoosts();
  }
});

// Watch für isVisible changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    resetAllMaxedBoosts();
  }
});
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
</style>