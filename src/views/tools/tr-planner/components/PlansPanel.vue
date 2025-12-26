<template>
  <div class="bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50">
    <!-- Panel Header -->
    <div class="bg-gray-700/50 px-3 py-2 border-b border-gray-600 flex items-center justify-between">
      <span class="text-sm font-semibold text-gray-300">Plan Details</span>
      <div class="flex items-center gap-2">
        <button
          @click="showGemOverrideModal = true"
          class="px-2 py-1 text-xs bg-purple-900/50 hover:bg-purple-800/50 text-purple-300 rounded transition-colors"
          title="Gem Overrides"
        >
          <IconDiamond :size="14" class="inline mr-1" />
          Gems
        </button>
        <button
          @click="showImportExport = true"
          class="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
          title="Import/Export"
        >
          <IconShare :size="14" class="inline mr-1" />
          Share
        </button>
      </div>
    </div>

    <!-- Plan Content -->
    <div class="p-3 space-y-4">
      <!-- Plan Settings Section -->
      <div class="bg-gray-900/50 rounded-lg p-3 space-y-3">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Plan Settings</h3>
        
        <!-- TR Count -->
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-300">TR Count</label>
          <ToolValueControls
            :value="trCount"
            :minValue="0"
            :maxValue="9999"
            :step="1"
            :fastStep="10"
            @update:value="trCount = $event"
          />
        </div>
        
        <!-- All-Time Orbs -->
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-300">All-Time Orbs</label>
          <ToolValueControls
            :value="allTimeOrbs"
            :minValue="0"
            :maxValue="999999999"
            :step="1000"
            :fastStep="100000"
            @update:value="allTimeOrbs = $event"
          />
        </div>
        
        <!-- Hours in TR -->
        <div class="flex items-center justify-between">
          <label class="text-sm text-gray-300">Hours in TR</label>
          <ToolValueControls
            :value="hoursInTR"
            :minValue="0"
            :maxValue="9999"
            :step="1"
            :fastStep="24"
            @update:value="hoursInTR = $event"
          />
        </div>
      </div>

      <!-- TR Steps Section -->
      <div class="bg-gray-900/50 rounded-lg p-3">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">TR Steps</h3>
          <button
            @click="addStep"
            class="px-2 py-1 text-xs bg-green-900/50 hover:bg-green-800/50 text-green-300 rounded transition-colors"
          >
            <IconPlus :size="14" class="inline mr-1" />
            Add Step
          </button>
        </div>
        
        <!-- Steps List -->
        <div v-if="steps.length > 0" class="space-y-2">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            class="bg-gray-800/80 rounded-lg p-3 border border-gray-700/50"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-purple-400">TR {{ index + 1 }}</span>
              <button
                @click="removeStep(index)"
                class="p-1 hover:bg-red-900/50 rounded transition-colors"
                title="Remove Step"
              >
                <IconTrash :size="14" class="text-red-400" />
              </button>
            </div>
            
            <!-- Step Hours -->
            <div class="flex items-center justify-between text-xs mb-2">
              <span class="text-gray-400">Hours in this TR:</span>
              <ToolValueControls
                :value="step.hoursInTR"
                :minValue="0"
                :maxValue="9999"
                :step="1"
                :fastStep="24"
                size="sm"
                @update:value="updateStepHours(index, $event)"
              />
            </div>
            
            <!-- Step Notes -->
            <div class="text-xs">
              <span class="text-gray-400">Notes:</span>
              <input 
                :value="step.notes"
                @change="updateStepNotes(index, $event.target.value)"
                type="text"
                placeholder="Optional notes..."
                class="w-full mt-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-6 text-gray-500 text-sm">
          <IconClipboardList :size="32" class="mx-auto mb-2 opacity-50" />
          <p>No TR Steps yet.</p>
          <p class="text-xs">Add steps to plan your TR progression.</p>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-gray-900/50 rounded-lg p-3">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Calculated Results</h3>
        
        <div class="grid grid-cols-2 gap-3">
          <!-- Orb Multiplier -->
          <div class="bg-purple-900/20 rounded-lg p-2 border border-purple-800/30">
            <div class="text-[10px] text-gray-400 uppercase">Orb Multiplier</div>
            <div class="text-lg font-bold text-purple-400">{{ formatMultiplier(orbMultiplier) }}</div>
          </div>
          
          <!-- Frag Multiplier -->
          <div class="bg-cyan-900/20 rounded-lg p-2 border border-cyan-800/30">
            <div class="text-[10px] text-gray-400 uppercase">Frag Multiplier</div>
            <div class="text-lg font-bold text-cyan-400">{{ formatMultiplier(fragMultiplier) }}</div>
          </div>
          
          <!-- Estimated Orbs -->
          <div class="bg-amber-900/20 rounded-lg p-2 border border-amber-800/30">
            <div class="text-[10px] text-gray-400 uppercase">Estimated Orbs</div>
            <div class="text-lg font-bold text-amber-400">{{ formatNumber(estimatedOrbs) }}</div>
          </div>
          
          <!-- Estimated Frags -->
          <div class="bg-emerald-900/20 rounded-lg p-2 border border-emerald-800/30">
            <div class="text-[10px] text-gray-400 uppercase">Estimated Frags</div>
            <div class="text-lg font-bold text-emerald-400">{{ formatNumber(estimatedFrags) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gem Override Modal -->
    <GemOverrideModal 
      v-if="showGemOverrideModal"
      @close="showGemOverrideModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  IconDiamond,
  IconShare,
  IconPlus,
  IconTrash,
  IconClipboardList
} from '@tabler/icons-vue';

import GemOverrideModal from './GemOverrideModal.vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { formatNumber } from '@/composables/format';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';
import { useOrbCalculations } from '../composables/useOrbCalculations';

const store = useTRPlannerStore();
const { orbMultiplier, fragMultiplier, formatMultiplier } = useOrbCalculations();

// Modal states
const showGemOverrideModal = ref(false);
const showImportExport = ref(false);

// Plan settings (connected to store)
const trCount = computed({
  get: () => store.modifiers.settings.trCount,
  set: (value) => store.setTRCount(value)
});

const allTimeOrbs = computed({
  get: () => store.modifiers.settings.allTimeOrbs,
  set: (value) => store.setAllTimeOrbs(value)
});

const hoursInTR = computed({
  get: () => store.selectedPlan?.settings?.hoursInTR || store.modifiers.settings.defaultHoursInTR,
  set: (value) => {
    if (store.selectedPlan) {
      store.updatePlan(store.selectedPlanId, {
        settings: { ...store.selectedPlan.settings, hoursInTR: value }
      });
    } else {
      store.setDefaultHoursInTR(value);
    }
  }
});

// Steps (from selected plan)
const steps = computed(() => store.selectedPlan?.steps || []);

// Calculated values
const estimatedOrbs = computed(() => {
  // Simple placeholder calculation
  return Math.round(orbMultiplier.value * 1000);
});

const estimatedFrags = computed(() => {
  // Simple placeholder calculation
  return Math.round(fragMultiplier.value * 100);
});

function addStep() {
  if (store.selectedPlanId) {
    store.addStep(store.selectedPlanId, {
      hoursInTR: hoursInTR.value,
      notes: '',
      targetBoosts: []
    });
  }
}

function removeStep(index) {
  if (store.selectedPlanId && steps.value[index]) {
    store.deleteStep(store.selectedPlanId, steps.value[index].id);
  }
}

function updateStepHours(stepIndex, hours) {
  if (store.selectedPlanId && steps.value[stepIndex]) {
    store.updateStep(store.selectedPlanId, steps.value[stepIndex].id, {
      hoursInTR: hours
    });
  }
}

function updateStepNotes(stepIndex, notes) {
  if (store.selectedPlanId && steps.value[stepIndex]) {
    store.updateStep(store.selectedPlanId, steps.value[stepIndex].id, {
      notes
    });
  }
}
</script>
