<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold text-white flex items-center">
            <IconPlus v-if="!editMode" size="16" class="mr-2 text-green-400" />
            <IconEdit v-else size="16" class="mr-2 text-yellow-400" />
            {{ editMode ? 'Edit TR Track Settings' : 'TR Tracking - Starting Values' }}
          </h3>
        </div>
        <div class="flex gap-2">
          <button
            @click="$emit('close')"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="16" />
          </button>
        </div>
      </div>

      <!-- Description -->
      <div class="px-3 py-2 border-b border-gray-700">
        <p class="text-xs text-gray-300">
          {{ editMode ? 'Edit the basic settings and goals for this TR tracking plan.' : 'Create a new TR tracking plan. Enter your current values and goals for this Traversal Reset.' }}
        </p>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3">
        <!-- Basic Information -->
        <div>
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-purple-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-purple-200">Basic Information</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Row 1: TR Count (left) and Status (right) -->
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">
                TR Count
              </label>
              <ToolValueControls
                :value="formData.trCount"
                :min-value="1"
                :max-value="9999"
                :step="1"
                :fast-step="10"
                :auto-edit="true"
                @update:value="formData.trCount = $event"
                value-class="text-white"
              />
            </div>
            <!-- Status Selection (only in edit mode) -->
            <div 
              v-if="editMode" 
              class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between"
            >
              <label class="text-xs font-medium text-gray-200">
                Status
              </label>
              <select
                v-model="formData.isActive"
                class="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option :value="true">Active</option>
                <option :value="false">Completed</option>
              </select>
            </div>
            <!-- Empty space for create mode -->
            <div v-else></div>

            <!-- Row 2: TR Start Date and TR End Date (side by side) -->
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">
                TR Start Date
              </label>
              <div class="flex gap-1">
                <input
                  v-model="formData.startDate"
                  type="date"
                  class="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  v-model="formData.startTime"
                  type="time"
                  class="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- TR End Date (only for completed TRs in edit mode) -->
            <div 
              v-if="editMode && !formData.isActive" 
              class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between"
            >
              <label class="text-xs font-medium text-gray-200">
                TR End Date
              </label>
              <div class="flex gap-1">
                <input
                  v-model="formData.endDate"
                  type="date"
                  class="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  v-model="formData.endTime"
                  type="time"
                  class="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Row 3: Plan Name (spans full width) -->
            <div class="md:col-span-2 border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">
                Plan Name
              </label>
              <input
                v-model="formData.planName"
                type="text"
                placeholder="TR Plan"
                class="flex-1 ml-3 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <!-- Current Values -->
        <div>
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-blue-200">Current Values</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Row 1 -->
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200 flex items-center">
                OO Lifetime
                <InfoTooltip 
                  class="ml-1"
                  content="<b>Supported formats:</b><br/>
                  • Suffixes: <code>1k</code>, <code>2.5m</code>, <code>100b</code>, <code>5t</code><br/>
                  • Available suffixes: k, m, b, t, qa, qu, sx, sp, oc, n, d<br/>"
                  placement="top"
                />
              </label>
              <SuffixInput
                v-model="formData.currentValues.ooLifetime"
                placeholder="0.00"
                focus-ring-class="focus:ring-blue-500"
                text-color-class="text-purple-400"
              />
            </div>
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200 flex items-center">
                Frags Lifetime
                <InfoTooltip 
                  class="ml-1"
                  content="<b>Supported formats:</b><br/>
                  • Suffixes: <code>1k</code>, <code>2.5m</code>, <code>100b</code>, <code>5t</code><br/>
                  • Available suffixes: k, m, b, t, qa, qu, sx, sp, oc, n, d<br/>"
                  placement="top"
                />
              </label>
              <SuffixInput
                v-model="formData.currentValues.fragsLifetime"
                placeholder="0.00"
                focus-ring-class="focus:ring-blue-500"
                text-color-class="text-purple-400"
              />
            </div>

            <!-- Row 2 -->
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">TS Milestones</label>
              <div class="flex gap-1">
                <ToolValueControls
                  :value="formData.currentValues.tsMilestones.level1"
                  :min-value="0"
                  :max-value="99"
                  :step="1"
                  :fast-step="10"
                  :auto-edit="true"
                  @update:value="formData.currentValues.tsMilestones.level1 = $event"
                  value-class="text-green-400"
                  :show-fast-controls="false"
                />
                <span class="text-gray-400 self-center text-sm px-0.5">/</span>
                <ToolValueControls
                  :value="formData.currentValues.tsMilestones.level2"
                  :min-value="0"
                  :max-value="99"
                  :step="1"
                  :fast-step="10"
                  :auto-edit="true"
                  @update:value="formData.currentValues.tsMilestones.level2 = $event"
                  value-class="text-red-400"
                  :show-fast-controls="false"
                />
                <span class="text-gray-400 self-center text-sm px-0.5">/</span>
                <ToolValueControls
                  :value="formData.currentValues.tsMilestones.level3"
                  :min-value="0"
                  :max-value="99"
                  :step="1"
                  :fast-step="10"
                  :auto-edit="true"
                  @update:value="formData.currentValues.tsMilestones.level3 = $event"
                  value-class="text-orange-400"
                  :show-fast-controls="false"
                />
              </div>
            </div>
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">Borge Level</label>
              <ToolValueControls
                :value="formData.currentValues.borgeLevel"
                :min-value="0"
                :max-value="999"
                :step="1"
                :fast-step="10"
                :auto-edit="true"
                @update:value="formData.currentValues.borgeLevel = $event"
                value-class="text-red-400"
              />
            </div>

            <!-- Row 3 -->
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">Ozzy Level</label>
              <ToolValueControls
                :value="formData.currentValues.ozzyLevel"
                :min-value="0"
                :max-value="999"
                :step="1"
                :fast-step="10"
                :auto-edit="true"
                @update:value="formData.currentValues.ozzyLevel = $event"
                value-class="text-green-400"
              />
            </div>
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">Knox Level</label>
              <ToolValueControls
                :value="formData.currentValues.knoxLevel"
                :min-value="0"
                :max-value="999"
                :step="1"
                :fast-step="10"
                :auto-edit="true"
                @update:value="formData.currentValues.knoxLevel = $event"
                value-class="text-blue-400"
              />
            </div>
          </div>
        </div>

        <!-- Target Goals -->
        <div>
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-green-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-green-200">Target Goals</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Row 1 -->
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200 flex items-center">
                OO Goal
                <InfoTooltip 
                  class="ml-1"
                  content="<b>Supported formats:</b><br/>
                  • Suffixes: <code>1k</code>, <code>2.5m</code>, <code>100b</code>, <code>5t</code><br/>
                  • Available suffixes: k, m, b, t, qa, qu, sx, sp, oc, n, d<br/>"
                  placement="top"
                />
              </label>
              <SuffixInput
                v-model="formData.targetGoals.ooGoal"
                placeholder="0.00"
                focus-ring-class="focus:ring-green-500"
                text-color-class="text-purple-400"
              />
            </div>
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">m0 Goal</label>
              <ToolValueControls
                :value="formData.targetGoals.m0Goal"
                :min-value="0"
                :max-value="999"
                :step="1"
                :fast-step="10"
                :auto-edit="true"
                @update:value="formData.targetGoals.m0Goal = $event"
                value-class="text-cyan-400"
              />
            </div>

            <!-- Row 2 -->
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">Cells Goal (e)</label>
              <ToolValueControls
                :value="formData.targetGoals.cellsGoal"
                :min-value="0"
                :max-value="99999999"
                :step="1"
                :fast-step="10"
                :auto-edit="true"
                @update:value="formData.targetGoals.cellsGoal = $event"
                value-class="text-green-400"
              />
            </div>
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">MP Goal (e)</label>
              <ToolValueControls
                :value="formData.targetGoals.mpGoal"
                :min-value="0"
                :max-value="99999999"
                :step="1"
                :fast-step="10"
                :auto-edit="true"
                @update:value="formData.targetGoals.mpGoal = $event"
                value-class="text-red-400"
              />
            </div>

            <!-- Row 3 -->
            <div class="border border-gray-700 rounded-md p-2 bg-gray-700/30 flex items-center justify-between">
              <label class="text-xs font-medium text-gray-200">RP Goal (e)</label>
              <ToolValueControls
                :value="formData.targetGoals.rpGoal"
                :min-value="0"
                :max-value="99999999"
                :step="1"
                :fast-step="10"
                :auto-edit="true"
                @update:value="formData.targetGoals.rpGoal = $event"
                value-class="text-orange-400"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-2 justify-end pt-2 border-t border-gray-700 p-2">
        <button
          @click="$emit('close')"
          class="px-3 py-1.5 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-xs"
        >
          Cancel
        </button>
        <button
          @click="createPlan"
          :disabled="!formData.planName.trim()"
          class="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs flex items-center gap-1"
        >
          <IconPlus v-if="!editMode" size="12" />
          <IconEdit v-else size="12" />
          {{ editMode ? 'Update Plan' : 'Create Plan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { IconX, IconPlus, IconEdit } from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import SuffixInput from '@/composables/SuffixInput.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import { generateId } from '@/utils/base58';

const props = defineProps({
  show: Boolean,
  editMode: {
    type: Boolean,
    default: false
  },
  trackData: {
    type: Object,
    default: null
  },
  autoComplete: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const trStore = useTRTrackingStore();

// Form data
const formData = ref({
  trCount: 1,
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  isActive: true,
  planName: '',
  currentValues: {
    ooLifetime: 0,
    fragsLifetime: 0,
    tsMilestones: {
      level1: 0,
      level2: 0,
      level3: 0
    },
    borgeLevel: 0,
    ozzyLevel: 0,
    knoxLevel: 0
  },
  targetGoals: {
    ooGoal: 0,
    m0Goal: 0,
    cellsGoal: 0,
    mpGoal: 0,
    rpGoal: 0
  }
});

// Watch for status changes to automatically set end date
// Only trigger when the user manually changes the status, not during initial load
let isInitialLoad = true;

watch(() => formData.value.isActive, (newIsActive, oldIsActive) => {
  // Skip the initial load to prevent overwriting existing endDate
  if (isInitialLoad) {
    isInitialLoad = false;
    return;
  }
  
  // If changing from active to completed, set current date/time
  if (oldIsActive === true && newIsActive === false) {
    const now = new Date();
    formData.value.endDate = now.getFullYear() + '-' + 
                             String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                             String(now.getDate()).padStart(2, '0');
    formData.value.endTime = String(now.getHours()).padStart(2, '0') + ':' + 
                             String(now.getMinutes()).padStart(2, '0');
  }
  // If changing from completed to active, clear end date
  else if (oldIsActive === false && newIsActive === true) {
    formData.value.endDate = '';
    formData.value.endTime = '';
  }
});

// Reset isInitialLoad flag when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    isInitialLoad = true;
    resetForm();
    // After resetForm, allow the watcher to work normally
    setTimeout(() => {
      isInitialLoad = false;
    }, 0);
  }
});

// Methods
function resetForm() {
  if (props.editMode && props.trackData) {
    // Edit mode: Load existing track data
    const startDateTime = new Date(props.trackData.startDate);
    let endDateTime = null;
    
    // Parse end date if it exists (for completed TRs)
    if (props.trackData.endDate) {
      endDateTime = new Date(props.trackData.endDate);
    }
    
    formData.value = {
      trCount: props.trackData.trCount || 1,
      startDate: startDateTime.getFullYear() + '-' + 
                 String(startDateTime.getMonth() + 1).padStart(2, '0') + '-' + 
                 String(startDateTime.getDate()).padStart(2, '0'),
      startTime: String(startDateTime.getHours()).padStart(2, '0') + ':' + 
                 String(startDateTime.getMinutes()).padStart(2, '0'),
      endDate: endDateTime ? 
               endDateTime.getFullYear() + '-' + 
               String(endDateTime.getMonth() + 1).padStart(2, '0') + '-' + 
               String(endDateTime.getDate()).padStart(2, '0') : '',
      endTime: endDateTime ? 
               String(endDateTime.getHours()).padStart(2, '0') + ':' + 
               String(endDateTime.getMinutes()).padStart(2, '0') : '',
      isActive: props.autoComplete ? false : (props.trackData.isActive !== undefined ? props.trackData.isActive : true),
      planName: props.trackData.name || '',
      currentValues: {
        ooLifetime: props.trackData.initialValues?.ooLifetime || 0,
        fragsLifetime: props.trackData.initialValues?.fragsLifetime || 0,
        tsMilestones: {
          level1: props.trackData.initialValues?.tsMilestones?.level1 || 0,
          level2: props.trackData.initialValues?.tsMilestones?.level2 || 0,
          level3: props.trackData.initialValues?.tsMilestones?.level3 || 0
        },
        borgeLevel: props.trackData.initialValues?.borgeLevel || 0,
        ozzyLevel: props.trackData.initialValues?.ozzyLevel || 0,
        knoxLevel: props.trackData.initialValues?.knoxLevel || 0
      },
      targetGoals: {
        ooGoal: props.trackData.targetGoals?.ooGoal || 0,
        m0Goal: props.trackData.targetGoals?.m0Goal || 0,
        cellsGoal: props.trackData.targetGoals?.cellsGoal || 0,
        mpGoal: props.trackData.targetGoals?.mpGoal || 0,
        rpGoal: props.trackData.targetGoals?.rpGoal || 0
      }
    };
  } else {
    // Create mode: Use default values
    const now = new Date();
    
    formData.value = {
      trCount: 1,
      startDate: now.getFullYear() + '-' + 
                 String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                 String(now.getDate()).padStart(2, '0'),
      startTime: String(now.getHours()).padStart(2, '0') + ':' + 
                 String(now.getMinutes()).padStart(2, '0'),
      endDate: '',
      endTime: '',
      isActive: true,
      planName: 'TR Plan',
      currentValues: {
        ooLifetime: 0,
        fragsLifetime: 0,
        tsMilestones: {
          level1: 0,
          level2: 0,
          level3: 0
        },
        borgeLevel: 0,
        ozzyLevel: 0,
        knoxLevel: 0
      },
      targetGoals: {
        ooGoal: 0,
        m0Goal: 0,
        cellsGoal: 0,
        mpGoal: 0,
        rpGoal: 0
      }
    };
  }
}

function createPlan() {
  if (!formData.value.planName.trim()) return;

  // Helper function to create proper ISO string with local timezone
  const createLocalISOString = (dateStr, timeStr) => {
    // Create date in local timezone, not UTC
    const localDate = new Date(dateStr + 'T' + timeStr);
    return localDate.toISOString();
  };

  const trackData = {
    name: formData.value.planName.trim(),
    startDate: createLocalISOString(formData.value.startDate, formData.value.startTime),
    notes: `TR ${formData.value.trCount} - ${props.editMode ? 'Updated' : 'Started'} with goals: OO ${formData.value.targetGoals.ooGoal}, Cells ${formData.value.targetGoals.cellsGoal}e, MP ${formData.value.targetGoals.mpGoal}e, RP ${formData.value.targetGoals.rpGoal}e`,
    trCount: formData.value.trCount,
    isActive: formData.value.isActive,
    initialValues: {
      ooLifetime: formData.value.currentValues.ooLifetime,
      fragsLifetime: formData.value.currentValues.fragsLifetime,
      tsMilestones: {
        level1: formData.value.currentValues.tsMilestones.level1,
        level2: formData.value.currentValues.tsMilestones.level2,
        level3: formData.value.currentValues.tsMilestones.level3
      },
      borgeLevel: formData.value.currentValues.borgeLevel,
      ozzyLevel: formData.value.currentValues.ozzyLevel,
      knoxLevel: formData.value.currentValues.knoxLevel
    },
    targetGoals: {
      ooGoal: formData.value.targetGoals.ooGoal,
      m0Goal: formData.value.targetGoals.m0Goal,
      cellsGoal: formData.value.targetGoals.cellsGoal,
      mpGoal: formData.value.targetGoals.mpGoal,
      rpGoal: formData.value.targetGoals.rpGoal
    }
  };

  // Add end date if it's completed or if end date is provided
  if (!formData.value.isActive && formData.value.endDate && formData.value.endTime) {
    trackData.endDate = createLocalISOString(formData.value.endDate, formData.value.endTime);
  } else if (!formData.value.isActive && (!formData.value.endDate || !formData.value.endTime)) {
    // If marking as completed but no end date provided, use current date/time
    const now = new Date();
    trackData.endDate = now.toISOString();
  }

  emit('save', trackData);
}
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
