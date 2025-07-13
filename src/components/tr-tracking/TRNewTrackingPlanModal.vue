<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header mit Reset-Button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-green-400">TR Tracking</span>
            <span class=""> - New Plan</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="resetAllValues" 
              class="px-2 py-1 sm:px-3 bg-gray-600 hover:bg-gray-500 text-xs sm:text-sm text-white rounded-md"
            >
              Reset
            </button>
            <button 
              @click="closeModal"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Description Area -->
      <div class="p-3 bg-gray-750/60 border-b border-gray-700">
        <div class="space-y-1">
          <p class="text-xs text-gray-300">
            Create a new TR tracking plan. Enter your current values and goals for this Traversal Reset.
          </p>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="isCreating" class="p-6 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-green-500 mb-2"></div>
        <p class="text-gray-400 text-sm">Creating tracking plan...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ error }}</p>
        <button 
          @click="error = ''" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Try Again
        </button>
      </div>

      <!-- Form Content -->
      <div v-else class="p-3">
        <!-- Basic Info Section -->
        <div class="mb-3">
          <!-- Category Header -->
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-purple-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-purple-200">Basic Information</h3>
          </div>
          
          <!-- Grid Layout -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- TR Count -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">TR Count</div>
                </div>
                <div>
                  <ToolValueControls
                    :value="form.resetNumber"
                    @update:value="form.resetNumber = $event"
                    :min-value="1"
                    :max-value="999"
                    :step="1"
                    :fast-step="10"
                    value-class="text-purple-400"
                    :show-fast-controls="true"
                    :auto-edit="true"
                  />
                </div>
              </div>
            </div>

            <!-- Start Date Input -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">TR Start Date</div>
                </div>
                <div class="flex-1 max-w-[220px]">
                  <div class="flex gap-1">
                    <input
                      v-model="trStartDate"
                      type="date"
                      class="flex-1 px-1 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <input
                      v-model="trStartTime"
                      type="time"
                      step="60"
                      class="w-23 px-1 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Plan Name Input -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">Plan Name</div>
                </div>
                <div class="flex-1 max-w-[120px]">
                  <input
                    v-model="form.planName"
                    type="text"
                    placeholder="TR Plan"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Starting Values Section -->
        <div class="mb-3">
          <!-- Category Header -->
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">Current Values</h3>
          </div>
          
          <!-- Grid Layout -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- OO Lifetime - Spezielle Eingabe mit Suffix-Support -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">OO Lifetime</div>
                </div>
                <div class="flex-1 max-w-[120px]">
                  <input
                    v-model="ooLifetimeInput"
                    @input="updateOOLifetime"
                    @blur="finalizeOOLifetimeInput"
                    type="text"
                    placeholder="0"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-purple-400 text-xs text-center placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <!-- Frags Lifetime - Spezielle Eingabe mit Suffix-Support -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">Frags Lifetime</div>
                </div>
                <div class="flex-1 max-w-[120px]">
                  <input
                    v-model="fragsLifetimeInput"
                    @input="updateFragsLifetime"
                    @blur="finalizeFragsLifetimeInput"
                    type="text"
                    placeholder="0"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-purple-400 font-medium text-xs text-center placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <!-- TS Milestones - Spezielle 3-Feld Eingabe -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">TS Milestones</div>
                </div>
                <div class="flex items-center gap-1">
                  <input
                    v-model.number="form.values.tsField1"
                    type="number"
                    min="0"
                    max="99"
                    class="w-8 px-1 py-1 bg-gray-700 border border-gray-600 rounded text-green-500 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <span class="text-gray-400 text-xs">/</span>
                  <input
                    v-model.number="form.values.tsField2"
                    type="number"
                    min="0"
                    max="99"
                    class="w-8 px-1 py-1 bg-gray-700 border border-gray-600 rounded text-red-500 text-xs text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <span class="text-gray-400 text-xs">/</span>
                  <input
                    v-model.number="form.values.tsField3"
                    type="number"
                    min="0"
                    max="99"
                    class="w-8 px-1 py-1 bg-gray-700 border border-gray-600 rounded text-orange-400 text-xs text-center focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <!-- Borge Level -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">Borge Level</div>
                </div>
                <div>
                  <ToolValueControls
                    :value="form.values.borgeLevel"
                    @update:value="form.values.borgeLevel = $event"
                    :min-value="0"
                    :max-value="10000"
                    :step="1"
                    :fast-step="10"
                    value-class="text-red-500 font-medium"
                    :show-fast-controls="true"
                    :auto-edit="true"
                  />
                </div>
              </div>
            </div>

            <!-- Ozzy Level -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">Ozzy Level</div>
                </div>
                <div>
                  <ToolValueControls
                    :value="form.values.ozzyLevel"
                    @update:value="form.values.ozzyLevel = $event"
                    :min-value="0"
                    :max-value="10000"
                    :step="1"
                    :fast-step="10"
                    value-class="text-green-500 font-medium"
                    :show-fast-controls="true"
                    :auto-edit="true"
                  />
                </div>
              </div>
            </div>

            <!-- Knox Level -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">Knox Level</div>
                </div>
                <div>
                  <ToolValueControls
                    :value="form.values.knoxLevel"
                    @update:value="form.values.knoxLevel = $event"
                    :min-value="0"
                    :max-value="10000"
                    :step="1"
                    :fast-step="10"
                    value-class="text-blue-400 font-medium"
                    :show-fast-controls="true"
                    :auto-edit="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Goals Section -->
        <div class="mb-3">
          <!-- Category Header -->
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-amber-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-amber-200">Target Goals</h3>
          </div>
          
          <!-- Grid Layout -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <!-- OO Goal - Spezielle Eingabe mit Suffix-Support -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">OO Goal</div>
                </div>
                <div class="flex-1 max-w-[120px]">
                  <input
                    v-model="ooGoalInput"
                    @input="updateOOGoal"
                    @blur="finalizeOOGoalInput"
                    type="text"
                    placeholder="0"
                    class="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-purple-400 text-xs text-center placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <!-- m0 Goal -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">m0 Goal</div>
                </div>
                <div>
                  <ToolValueControls
                    :value="form.goals.m0"
                    @update:value="form.goals.m0 = $event"
                    :min-value="0"
                    :max-value="1e12"
                    :step="1"
                    :fast-step="10"
                    value-class="text-cyan-400"
                    :auto-edit="true"
                  />
                </div>
              </div>
            </div>

            <!-- Cells Goal -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">Cells Goal (e)</div>
                </div>
                <div>
                  <ToolValueControls
                    :value="form.goals.cells"
                    @update:value="form.goals.cells = $event"
                    :min-value="0"
                    :max-value="1e15"
                    :step="1000"
                    :fast-step="5000"
                    value-class="text-green-400"
                    :auto-edit="true"
                  />
                </div>
              </div>
            </div>

            <!-- MP Goal -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">MP Goal (e)</div>
                </div>
                <div>
                  <ToolValueControls
                    :value="form.goals.mp"
                    @update:value="form.goals.mp = $event"
                    :min-value="0"
                    :max-value="1e12"
                    :step="100"
                    :fast-step="600"
                    value-class="text-red-400"
                    :auto-edit="true"
                  />
                </div>
              </div>
            </div>

            <!-- RP Goal -->
            <div class="border border-gray-700 rounded-md hover:bg-gray-700/30 p-2">
              <div class="flex justify-between items-center">
                <div class="flex-1 mr-2">
                  <div class="text-xs font-medium text-gray-200">RP Goal (e)</div>
                </div>
                <div>
                  <ToolValueControls
                    :value="form.goals.rp"
                    @update:value="form.goals.rp = $event"
                    :min-value="0"
                    :max-value="1e10"
                    :step="100"
                    :fast-step="400"
                    value-class="text-orange-400"
                    :auto-edit="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Footer -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-300">
          </div>
          <div class="flex space-x-2">
            <button 
              @click="closeModal"
              class="px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
            >
              Cancel
            </button>
            <button 
              @click="createTrackingPlan"
              :disabled="!isFormValid || isCreating"
              class="px-2 py-1.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md text-xs flex items-center gap-1"
            >
              <IconLoader2 v-if="isCreating" size="12" class="animate-spin" />
              <IconCheck v-else size="12" />
              <span>{{ isCreating ? 'Creating...' : 'Create Plan' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { 
  IconX, 
  IconAlertCircle,
  IconCheck,
  IconLoader2
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { parseNumberWithSuffix, formatSuffixNotation } from '@/composables/format';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  sheetUrl: {
    type: String,
    required: true
  }
});

// Emits
const emit = defineEmits(['close', 'created']);

// Store
const trackingStore = useTRTrackingStore();

// State
const isCreating = ref(false);
const error = ref('');

// OO und Frags Input States
const ooLifetimeInput = ref('0');
const ooGoalInput = ref('0');
const fragsLifetimeInput = ref('0');
const isEditingOOLifetime = ref(false);
const isEditingOOGoal = ref(false);
const isEditingFragsLifetime = ref(false);

// Date-Time Picker refs 
const trStartDate = ref(new Date().toISOString().split('T')[0]); // Format: YYYY-MM-DD
const trStartTime = ref(new Date().toTimeString().split(' ')[0].slice(0, 5)); // Format: HH:MM

// Form data
const form = ref({
  resetNumber: 1,
  planName: '',
  values: {
    ooLifetime: 0,
    fragsLifetime: 0,
    tsField1: 0,
    tsField2: 0,
    tsField3: 0,
    borgeLevel: 0,
    ozzyLevel: 0,
    knoxLevel: 0
  },
  goals: {
    oo: 0,
    m0: 0,
    cells: 0,
    mp: 0,
    shards: 0,
    rp: 0
  }
});

// Funktion zum Initialisieren der Startzeit (wie TRPlanModal)
function initDateTimePicker() {
  const currentDate = new Date();
  trStartDate.value = currentDate.toISOString().split('T')[0];
  
  // Format: HH:MM
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  trStartTime.value = `${hours}:${minutes}`;
}

// Watch for changes in form.startDate to update separate inputs
watch(() => form.value.startDate, () => {
  updateSeparateInputs();
});

// Computed properties
const planDisplayName = computed(() => {
  return form.value.planName || `TR #${form.value.resetNumber}`;
});

const goalsSetCount = computed(() => {
  return Object.values(form.value.goals).filter(value => value > 0).length;
});

const isFormValid = computed(() => {
  return form.value.resetNumber >= 1;
});

// Watch for modal open/close
watch(() => props.show, (show) => {
  if (show) {
    resetForm();
  }
});

// Formatierungsfunktion mit Dezimalstellen (aus OrbCalculatorModal)
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

// OO Lifetime Methods
function updateOOLifetime(event) {
  isEditingOOLifetime.value = true;
  ooLifetimeInput.value = event.target.value.trim();
}

function finalizeOOLifetimeInput() {
  isEditingOOLifetime.value = false;
  const input = ooLifetimeInput.value.trim();
  const parsed = parseNumberWithSuffix(input);
  
  if (parsed !== null && parsed >= 0) {
    form.value.values.ooLifetime = parsed;
    ooLifetimeInput.value = formatSuffixWithDecimals(parsed, 2);
  } else {
    form.value.values.ooLifetime = 0;
    ooLifetimeInput.value = "0.00";
  }
}

// Frags Lifetime Methods
function updateFragsLifetime(event) {
  isEditingFragsLifetime.value = true;
  fragsLifetimeInput.value = event.target.value.trim();
}

function finalizeFragsLifetimeInput() {
  isEditingFragsLifetime.value = false;
  const input = fragsLifetimeInput.value.trim();
  const parsed = parseNumberWithSuffix(input);
  
  if (parsed !== null && parsed >= 0) {
    form.value.values.fragsLifetime = parsed;
    fragsLifetimeInput.value = formatSuffixWithDecimals(parsed, 2);
  } else {
    form.value.values.fragsLifetime = 0;
    fragsLifetimeInput.value = "0.00";
  }
}

// OO Goal Methods
function updateOOGoal(event) {
  isEditingOOGoal.value = true;
  ooGoalInput.value = event.target.value.trim();
}

function finalizeOOGoalInput() {
  isEditingOOGoal.value = false;
  const input = ooGoalInput.value.trim();
  const parsed = parseNumberWithSuffix(input);
  
  if (parsed !== null && parsed >= 0) {
    form.value.goals.oo = parsed;
    ooGoalInput.value = formatSuffixWithDecimals(parsed, 2);
  } else {
    form.value.goals.oo = 0;
    ooGoalInput.value = "0.00";
  }
}

// Methods
function resetForm() {
  form.value = {
    resetNumber: 1,
    planName: '',
    values: {
      ooLifetime: 0,
      fragsLifetime: 0,
      tsField1: 0,
      tsField2: 0,
      tsField3: 0,
      borgeLevel: 0,
      ozzyLevel: 0,
      knoxLevel: 0
    },
    goals: {
      oo: 0,
      m0: 0,
      cells: 0,
      mp: 0,
      shards: 0,
      rp: 0
    }
  };
  
  // Date/Time zurücksetzen - HIER auch wichtig!
  initDateTimePicker();
  
  // Reset all other inputs
  ooLifetimeInput.value = "0.00";
  ooGoalInput.value = "0.00";
  fragsLifetimeInput.value = "0.00";
  isEditingOOLifetime.value = false;
  isEditingOOGoal.value = false;
  isEditingFragsLifetime.value = false;
  
  error.value = '';
}

watch(() => props.show, (show) => {
  if (show) {
    resetForm();
  }
});

function resetAllValues() {
  if (confirm('Reset all values to zero?')) {
    resetForm();
  }
}

function closeModal() {
  emit('close');
}

async function createTrackingPlan() {
  if (!isFormValid.value) return;
  
  isCreating.value = true;
  error.value = '';
  
  try {
    console.log('Creating plan with URL:', props.sheetUrl);
    
    // Combine date and time for startDate
    const combinedStartDate = `${trStartDate.value}T${trStartTime.value}`;
    console.log('Combined start date:', combinedStartDate); // DEBUG
    
    // Prepare data for Store
    const planData = {
      resetNumber: form.value.resetNumber,
      startDate: combinedStartDate, // WICHTIG: Das muss übergeben werden!
      planName: form.value.planName || `TR #${form.value.resetNumber}`,
      description: `TR #${form.value.resetNumber} tracking plan`,
      goals: Object.fromEntries(
        Object.entries(form.value.goals)
          .filter(([k, v]) => v > 0)
          .map(([k, v]) => [k, v])
      ),
      startingValues: {
        ...Object.fromEntries(
          Object.entries(form.value.values)
            .filter(([k, v]) => v > 0 && !k.startsWith('ts'))
            .map(([k, v]) => [k, v])
        ),
        // Kombiniere TS Felder zu einem String falls mindestens eins gefüllt ist
        ...(form.value.values.tsField1 > 0 || form.value.values.tsField2 > 0 || form.value.values.tsField3 > 0 ? {
          tsMilestones: `${form.value.values.tsField1 || 0}/${form.value.values.tsField2 || 0}/${form.value.values.tsField3 || 0}`
        } : {})
      },
      customResources: []
    };
    
    console.log('Sending data to store with startDate:', planData); // DEBUG
    
    const result = await trackingStore.createTrackingPlan(planData);
    
    console.log('Store result:', result);
    
    if (result) {
      emit('created', result);
    }
  } catch (err) {
    console.error('Error creating tracking plan:', err);
    error.value = err.message || 'Failed to create tracking plan';
  } finally {
    isCreating.value = false;
  }
}

// Watch for form.values.ooLifetime changes to update display
watch(() => form.value.values.ooLifetime, (newValue) => {
  if (!isEditingOOLifetime.value) {
    ooLifetimeInput.value = formatSuffixWithDecimals(newValue, 2);
  }
});

// Watch for form.values.fragsLifetime changes to update display
watch(() => form.value.values.fragsLifetime, (newValue) => {
  if (!isEditingFragsLifetime.value) {
    fragsLifetimeInput.value = formatSuffixWithDecimals(newValue, 2);
  }
});

// Watch for form.goals.oo changes to update display
watch(() => form.value.goals.oo, (newValue) => {
  if (!isEditingOOGoal.value) {
    ooGoalInput.value = formatSuffixWithDecimals(newValue, 2);
  }
});

// Initialize when component loads
onMounted(() => {
  initDateTimePicker();
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

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

/* Chrome, Safari, Edge, Opera - verstecken der Pfeile bei Zahl-Inputs */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox - verstecken der Pfeile bei Zahl-Inputs */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Text-Input Pfeile auch entfernen (für OO/Frags Inputs) */
input[type=text]::-webkit-outer-spin-button,
input[type=text]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>