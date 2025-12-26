<template>
  <div class="bg-gray-800/80 rounded-lg overflow-hidden border border-gray-700/50">
    <!-- Panel Header -->
    <div class="bg-gradient-to-r from-green-900/50 to-gray-700/50 px-3 py-2 border-b border-gray-600">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-green-300 flex items-center gap-2">
          <IconTarget :size="16" />
          Target / Steps
        </span>
        <button 
          @click="addNewStep"
          class="flex items-center gap-1 px-2 py-1 text-xs bg-green-600/30 text-green-400 rounded hover:bg-green-600/50 transition-colors"
        >
          <IconPlus :size="14" />
          Add Step
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="p-3 max-h-[calc(100vh-280px)] overflow-y-auto">
      <!-- No Steps Message -->
      <div v-if="!steps.length" class="text-center py-8">
        <IconRoute :size="48" class="mx-auto text-gray-600 mb-3" />
        <p class="text-sm text-gray-400 mb-2">No target steps planned yet</p>
        <p class="text-xs text-gray-500 mb-4">Add steps to plan your TR progression</p>
        <button 
          @click="addNewStep"
          class="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-500 transition-colors"
        >
          <IconPlus :size="16" class="inline mr-1" />
          Create First Step
        </button>
      </div>

      <!-- Steps List -->
      <div v-else class="space-y-3">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="bg-gray-750 rounded-lg overflow-hidden border border-gray-700"
        >
          <!-- Step Header -->
          <div 
            class="flex items-center justify-between px-3 py-2 bg-gray-700/50 cursor-pointer"
            @click="toggleStepExpanded(step.id)"
          >
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 flex items-center justify-center bg-green-600 text-white text-xs font-bold rounded">
                {{ index + 1 }}
              </span>
              <span class="text-sm text-white">{{ step.name || `Step ${index + 1}` }}</span>
              <span class="text-xs text-gray-400">({{ countChanges(step) }} changes)</span>
            </div>
            <div class="flex items-center gap-2">
              <!-- Orb Gain Preview -->
              <span class="text-xs text-green-400">
                +{{ formatNumber(step.orbGain || 0) }} OO
              </span>
              <IconChevronDown 
                :size="16" 
                class="text-gray-400 transition-transform"
                :class="{ 'rotate-180': expandedSteps.includes(step.id) }"
              />
            </div>
          </div>

          <!-- Step Content (Expanded) -->
          <div v-if="expandedSteps.includes(step.id)" class="p-3 border-t border-gray-700">
            <!-- Step Name -->
            <div class="mb-3">
              <input
                v-model="step.name"
                type="text"
                placeholder="Step name..."
                class="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <!-- Gem Override Button -->
            <button
              @click="openGemOverride(step)"
              class="w-full mb-3 px-3 py-2 text-xs bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded hover:bg-purple-600/30 transition-colors flex items-center justify-center gap-2"
            >
              <IconDiamond :size="14" />
              Configure Gem Overrides
              <span v-if="step.gemOverrides && Object.keys(step.gemOverrides).length" class="px-1.5 py-0.5 bg-purple-500 text-white rounded-full text-[10px]">
                {{ Object.keys(step.gemOverrides).length }}
              </span>
            </button>

            <!-- Boost Overrides -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Boost Changes</span>
                <button 
                  @click="addBoostOverride(step)"
                  class="text-green-400 hover:text-green-300"
                >
                  <IconPlus :size="14" />
                </button>
              </div>

              <!-- Existing Overrides -->
              <div 
                v-for="(value, key) in step.boostOverrides" 
                :key="key"
                class="flex items-center justify-between bg-gray-700/50 px-2 py-1 rounded"
              >
                <span class="text-xs text-gray-300">{{ getBoostLabel(key) }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400">→</span>
                  <ToolValueControls
                    :value="value"
                    :minValue="0"
                    :step="1"
                    size="sm"
                    @update:value="updateStepBoost(step, key, $event)"
                  />
                  <button 
                    @click="removeBoostOverride(step, key)"
                    class="text-red-400 hover:text-red-300"
                  >
                    <IconX :size="14" />
                  </button>
                </div>
              </div>

              <!-- Add Override Dropdown -->
              <div v-if="step.showAddOverride" class="mt-2">
                <select
                  v-model="step.selectedBoost"
                  @change="confirmAddOverride(step)"
                  class="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="">Select boost to override...</option>
                  <optgroup 
                    v-for="category in availableBoostsForStep(step)" 
                    :key="category.id" 
                    :label="category.label"
                  >
                    <option 
                      v-for="boost in category.boosts" 
                      :key="boost.key" 
                      :value="boost.key"
                    >
                      {{ boost.label }}
                    </option>
                  </optgroup>
                </select>
              </div>
            </div>

            <!-- Step Actions -->
            <div class="flex justify-between mt-3 pt-3 border-t border-gray-700">
              <button
                @click="duplicateStep(step)"
                class="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <IconCopy :size="14" />
                Duplicate
              </button>
              <button
                @click="deleteStep(step)"
                class="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <IconTrash :size="14" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div v-if="steps.length" class="mt-4 p-3 bg-gray-750 rounded-lg border border-green-500/30">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-400">Total Steps:</span>
          <span class="text-white font-medium">{{ steps.length }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">Projected Orb Gain:</span>
          <span class="text-green-400 font-medium">+{{ formatNumber(totalOrbGain) }} OO</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Gem Override Modal -->
  <GemOverrideModal
    v-if="showGemModal"
    :isVisible="showGemModal"
    :currentOverrides="activeStep?.gemOverrides || {}"
    @close="showGemModal = false"
    @save="saveGemOverrides"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  IconTarget, 
  IconPlus, 
  IconRoute,
  IconChevronDown,
  IconDiamond,
  IconX,
  IconCopy,
  IconTrash
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import GemOverrideModal from './GemOverrideModal.vue';
import { formatNumber } from '@/composables/format';
import { useTRPlannerStore } from '@/store/trPlannerNewStore';
import { allBoosts, boostsByCategory } from '../constants/boosts';

const store = useTRPlannerStore();

// Steps from store
const steps = computed(() => store.steps || []);

// Expanded steps UI state
const expandedSteps = ref([]);

// Gem modal state
const showGemModal = ref(false);
const activeStep = ref(null);

// Total orb gain from all steps
const totalOrbGain = computed(() => {
  return steps.value.reduce((sum, step) => sum + (step.orbGain || 0), 0);
});

// Toggle step expansion
function toggleStepExpanded(stepId) {
  const index = expandedSteps.value.indexOf(stepId);
  if (index >= 0) {
    expandedSteps.value.splice(index, 1);
  } else {
    expandedSteps.value.push(stepId);
  }
}

// Add new step
function addNewStep() {
  const newStep = {
    id: Date.now(),
    name: '',
    boostOverrides: {},
    gemOverrides: {},
    orbGain: 0,
    showAddOverride: false,
    selectedBoost: ''
  };
  store.addStep(newStep);
  expandedSteps.value.push(newStep.id);
}

// Count changes in a step
function countChanges(step) {
  const boostCount = Object.keys(step.boostOverrides || {}).length;
  const gemCount = Object.keys(step.gemOverrides || {}).length;
  return boostCount + gemCount;
}

// Get boost label by key
function getBoostLabel(key) {
  const boost = allBoosts.find(b => b.key === key);
  return boost?.label || key;
}

// Update step boost override
function updateStepBoost(step, key, value) {
  store.updateStepBoost(step.id, key, value);
}

// Remove boost override from step
function removeBoostOverride(step, key) {
  store.removeStepBoost(step.id, key);
}

// Add boost override to step
function addBoostOverride(step) {
  step.showAddOverride = true;
}

// Confirm add override
function confirmAddOverride(step) {
  if (step.selectedBoost) {
    const currentValue = store.getBoostValue(step.selectedBoost) || 0;
    store.updateStepBoost(step.id, step.selectedBoost, currentValue);
    step.selectedBoost = '';
    step.showAddOverride = false;
  }
}

// Get available boosts for step (exclude already overridden)
function availableBoostsForStep(step) {
  const overriddenKeys = Object.keys(step.boostOverrides || {});
  return boostsByCategory
    .map(cat => ({
      ...cat,
      boosts: cat.boosts.filter(b => 
        !overriddenKeys.includes(b.key) && 
        b.type !== 'boolean' // Only numeric for now
      )
    }))
    .filter(cat => cat.boosts.length > 0);
}

// Duplicate step
function duplicateStep(step) {
  const newStep = {
    ...JSON.parse(JSON.stringify(step)),
    id: Date.now(),
    name: `${step.name || 'Step'} (Copy)`
  };
  store.addStep(newStep);
  expandedSteps.value.push(newStep.id);
}

// Delete step
function deleteStep(step) {
  store.removeStep(step.id);
  const index = expandedSteps.value.indexOf(step.id);
  if (index >= 0) {
    expandedSteps.value.splice(index, 1);
  }
}

// Open gem override modal
function openGemOverride(step) {
  activeStep.value = step;
  showGemModal.value = true;
}

// Save gem overrides
function saveGemOverrides(overrides) {
  if (activeStep.value) {
    store.updateStepGemOverrides(activeStep.value.id, overrides);
  }
  showGemModal.value = false;
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgb(42, 48, 60);
}
</style>
