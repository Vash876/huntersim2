<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-start justify-center p-4"
    @click="handleModalClick"
  >
    <div 
      ref="modalContent"
      class="bg-gray-800 rounded-xl shadow-2xl w-[95%] min-h-fit animate-fade-in border border-gray-700"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div v-if="track">
          <h3 class="text-base font-bold text-white flex items-center">
            <IconChartLine size="16" class="mr-2 text-green-400" />
            TR#{{ track.trCount || 0 }} - {{ track.name }}
            <span 
              v-if="!track.isActive" 
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700/50"
            >
              Completed
            </span>
          </h3>
        </div>
        <button
          @click="closeModalDirect"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>

      <!-- Help Guide -->
      <div class="border-b border-gray-700" v-if="track">
        <!-- Guide Header -->
        <div class="px-3 py-2 bg-gray-700/20">
          <div class="flex items-center justify-between">
            <button
              @click="toggleHelpGuide"
              class="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <IconChevronDown 
                size="14" 
                :class="{ 'rotate-180': isHelpGuideExpanded }"
                class="transition-transform duration-200"
              />
              Guide
            </button>
            <div class="flex items-center">
              <p class="text-xs text-gray-300">
                <span v-if="track.isActive">
                  Started: {{ formatDate(track.startDate) }}
                </span>
                <span v-else>
                  Started: {{ formatDate(track.startDate) }} • 
                  Completed: {{ track.endDate ? formatDate(track.endDate) : 'No end date' }} 
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <!-- Expandable Guide Content -->
        <div 
          v-if="isHelpGuideExpanded"
          class="px-3 py-3 bg-gray-800/30 border-t border-gray-600"
        >
          <div class="text-xs text-gray-300 space-y-2">
            <h4 class="font-medium text-blue-200 mb-2">Input Format Guide</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Number Formats -->
              <div class="space-y-1">
                <p class="font-medium text-yellow-300">Standard Numbers:</p>
                <p class="text-gray-400">• Basic: 1000, 50000, 999999</p>
                <p class="text-gray-400">• Suffix: 1k, 2.5m, 1.2b, 500t</p>
                <p class="text-gray-400">• Scientific: 1e6, 2.5e9 (AttGN3 only)</p>
              </div>
              
              <!-- Special Formats -->
              <div class="space-y-1">
                <p class="font-medium text-cyan-300">Special Formats:</p>
                <p class="text-gray-400">• Time: 5 30, 12:45, 123 54 (Auto-converts to 5:30, 12:45, 123:54)</p>
                <p class="text-gray-400">• Camp: C1-5, C4-12, c3-8, c3 8 (Auto-converts to C3-8)</p>
                <p class="text-gray-400">• Notes: Any text or description</p>
              </div>
              
              <!-- Large Numbers -->
              <div class="space-y-1">
                <p class="font-medium text-purple-300">Large Numbers (OO, LR Ticks, AttGN3):</p>
                <p class="text-gray-400">• Supports large values</p>
                <p class="text-gray-400">• Use suffix notation: 1.5k, 2.3b</p>
                <p class="text-gray-400">• AttGN3: up to 1e333</p>
              </div>
              
              <!-- Tips -->
              <div class="space-y-1">
                <p class="font-medium text-green-300">Tips:</p>
                <p class="text-gray-400">• Tab/Shift+Tab to navigate between fields</p>
                <p class="text-gray-400">• Enter to confirm entry</p>
              </div>
              
              <!-- AttGN3 Calculation -->
              <div class="space-y-1">
                <p class="font-medium text-cyan-300">AttGN3 Days to 1e333:</p>
                <p class="text-gray-400">• Uses current LR Ticks, RP, and AttGN3 Buff from tracking data</p>
                <p class="text-gray-400">• Other settings taken from AttGN3 Calculator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3" v-if="track">
        <!-- Initial Values -->
        <div v-if="track.initialValues">
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-yellow-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-yellow-200">Initial Values (TR Start)</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <!-- OO Lifetime -->
            <div v-if="track.initialValues.ooLifetime !== undefined" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">OO Lifetime</div>
              <div class="text-sm font-semibold text-purple-400">
                {{ formatNumber(track.initialValues.ooLifetime) }}
              </div>
            </div>

            <!-- Frags Lifetime -->
            <div v-if="track.initialValues.fragsLifetime !== undefined" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">Frags Lifetime</div>
              <div class="text-sm font-semibold text-purple-400">
                {{ formatNumber(track.initialValues.fragsLifetime) }}
              </div>
            </div>

            <!-- TS Milestones -->
            <div v-if="track.initialValues.tsMilestones" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">TS Milestones</div>
              <div class="text-sm font-semibold">
                <span class="text-green-400">{{ track.initialValues.tsMilestones.level1 || 0 }}</span>
                <span class="text-gray-400"> / </span>
                <span class="text-red-400">{{ track.initialValues.tsMilestones.level2 || 0 }}</span>
                <span class="text-gray-400"> / </span>
                <span class="text-orange-400">{{ track.initialValues.tsMilestones.level3 || 0 }}</span>
              </div>
            </div>

            <!-- Hunter Levels -->
            <div class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">Hunter Levels</div>
              <div class="text-sm font-semibold">
                <span class="text-red-400">{{ track.initialValues.borgeLevel || 0 }}</span>
                <span class="text-gray-400"> / </span>
                <span class="text-green-400">{{ track.initialValues.ozzyLevel || 0 }}</span>
                <span class="text-gray-400"> / </span>
                <span class="text-blue-400">{{ track.initialValues.knoxLevel || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Track Stats Overview -->
        <div>
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-blue-200">Track Statistics</h4>
          </div>
          
          <div :class="getCampTimerValue() > 0 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2'">
            <!-- Duration & Total Entries -->
            <div class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">Duration</div>
              <div class="text-sm font-semibold text-white">
                {{ getTrackDuration() }} days <span class="text-xs text-gray-400">({{ track.entries.length }} entries)</span>
              </div>
            </div>

            <!-- Time in LR -->
            <div class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400 flex items-center gap-1">
                Time in LR
                <InfoTooltip 
                  content="Time spent in current LR run. Uses LR Ticks from tracking data and Tick Speed/Ticks per Tick from AttGN3 Calculator settings"
                  placement="top" 
                />
              </div>
              <div class="text-sm font-semibold text-red-400">
                {{ getTimeInLR() }}
              </div>
            </div>

            <!-- AttGN3 Days to 1e333 -->
            <div class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400 flex items-center gap-1">
                AttGN3 to 1e333
                <InfoTooltip 
                  content="Uses current LR Ticks, RP, and AttGN3 Buff from tracking data, other settings taken from AttGN3 Calculator"
                  placement="top" 
                />
              </div>
              <div class="text-sm font-semibold text-cyan-400">
                {{ getAttGN3CompletionDetails() }}
              </div>
            </div>

            <!-- AttGN3 Pending Multiplier -->
            <div class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">AttGN3 Pending Multiplier</div>
              <div class="text-sm font-semibold text-green-400">
                {{ getAttGN3PendingMultiplier() }}
              </div>
            </div>

            <!-- Camp Timer End (only shown if current camp timer > 0) -->
            <div v-if="getCampTimerValue() > 0" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">Camp Ends</div>
              <div class="text-sm font-semibold text-orange-400">
                {{ getCampEndDateTime() }}
              </div>
            </div>

            <!-- Time Drift -->
            <div 
              class="bg-gray-700/30 rounded-md p-2 cursor-pointer hover:bg-gray-600/40 hover:border-blue-400 border border-transparent transition-all duration-200 relative"
              @click="showTimeDriftModal = true"
              title="Click for detailed time drift statistics"
            >
              <div class="text-xs text-gray-400 flex items-center justify-between">
                <span>Time Drift</span>
                <div class="flex items-center gap-1">
                  <IconChartLine size="12" class="text-blue-400" />
                  <span class="text-xs text-blue-400">Details</span>
                </div>
              </div>
              <div class="text-sm font-semibold" :class="{
                'text-green-400': getTimeDriftStats().driftDescription.includes('gained'),
                'text-red-400': getTimeDriftStats().driftDescription.includes('lost'),
                'text-gray-400': getTimeDriftStats().driftDescription === 'No drift' || getTimeDriftStats().driftDescription === 'Not enough data' || getTimeDriftStats().driftDescription === 'Hours-in-TR not tracked' || getTimeDriftStats().driftDescription === 'Invalid time data'
              }">
                {{ getTimeDriftStats().driftDescription }}
              </div>
            </div>
          </div>
        </div>

        <!-- Goals Progress -->
        <div v-if="track.targetGoals">
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-green-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-green-200">Goals Progress</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
            <!-- OO Goal -->
            <div v-if="track.targetGoals.ooGoal" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">OO Goal ({{ formatNumber(track.targetGoals.ooGoal) }})</div>
              <div class="text-sm font-semibold text-purple-400">
                {{ formatOoProgress() }}
              </div>
            </div>

            <!-- Cells Goal -->
            <div v-if="track.targetGoals.cellsGoal" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">Cells Goal (e{{ track.targetGoals.cellsGoal }})</div>
              <div class="text-sm font-semibold text-green-400">
                {{ formatCellsProgress() }}
              </div>
            </div>

            <!-- MP Goal -->
            <div v-if="track.targetGoals.mpGoal" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">MP Goal (e{{ track.targetGoals.mpGoal }})</div>
              <div class="text-sm font-semibold text-red-400">
                {{ formatMpProgress() }}
              </div>
            </div>

            <!-- RP Goal -->
            <div v-if="track.targetGoals.rpGoal" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">RP Goal (e{{ track.targetGoals.rpGoal }})</div>
              <div class="text-sm font-semibold text-orange-400">
                {{ formatRpProgress() }}
              </div>
            </div>

            <!-- M0 Goal -->
            <div v-if="track.targetGoals.m0Goal" class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">m0 Goal ({{ track.targetGoals.m0Goal }})</div>
              <div class="text-sm font-semibold text-cyan-400">
                {{ formatM0Progress() }}
              </div>
            </div>
          </div>
        </div>

        <!-- All Entries Table -->
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-purple-500 rounded-r mr-2"></div>
              <h4 class="font-medium text-sm text-purple-200">Tracking History ({{ track.entries.length }} entries)</h4>
            </div>
            <div class="flex gap-1" @click.stop>
              <button
                @click="addNewEntry"
                class="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
              >
                <IconPlus size="14" />
                Add New Entry
              </button>
              <button
                @click="exportToCsv"
                class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded-md transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
          
          <!-- AG Grid mit dynamischer Höhe basierend auf Anzahl der Einträge -->
          <div class="ag-grid-container" :style="`width:100%; height:${getGridHeight()}px;`" @click.stop>
            <ag-grid-vue
              style="height: 100%; width: 100%;"
              :columnDefs="columnDefs"
              :rowData="gridRowData"
              :defaultColDef="defaultColDef"
              :gridOptions="gridOptions"
              @grid-ready="onGridReady"
              @column-moved="onColumnMoved"
              @cell-value-changed="onCellValueChanged"
              @cell-editing-stopped="onCellEditingStopped"
            />
          </div>
          
          <div v-if="track.entries.length === 0 && !newEntry" class="text-center py-12">
            <IconDatabase size="48" class="mx-auto text-gray-600 mb-3" />
            <h5 class="text-sm font-medium text-gray-300 mb-2">No entries yet</h5>
            <p class="text-xs text-gray-400 mb-4">Start tracking your progress by adding your first entry</p>
            <button
              @click="addNewEntry"
              class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2 mx-auto"
            >
              <IconPlus size="16" />
              Add First Entry
            </button>
          </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between pt-2 border-t border-gray-700 px-3 pb-3">
        <div class="flex gap-2">
          <button
            @click="$emit('showProgress')"
            class="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors text-xs"
          >
            Progress & Charts
          </button>
          <button
            v-if="track && track.isActive"
            @click="completeTR"
            class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors text-xs"
          >
            Complete TR
          </button>
          <button
            @click="deleteTRTrack"
            class="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-500 transition-colors text-xs"
          >
            Delete Track
          </button>
        </div>
        
        <button
          @click="closeModalDirect"
          class="px-3 py-1.5 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-xs"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Alert Dialog -->
    <AlertDialog
      :is-visible="alertDialog.isVisible"
      :title="alertDialog.title"
      :message="alertDialog.message"
      :type="alertDialog.type"
      :show-cancel="alertDialog.showCancel"
      :confirm-text="alertDialog.confirmText"
      :cancel-text="alertDialog.cancelText"
      @confirm="confirmDialog"
      @cancel="cancelDialog"
    />

    <!-- Time Drift Statistics Modal -->
    <TimeDriftStatsModal
      :show="showTimeDriftModal"
      :track="track"
      :selected-resources="draggableResources"
      @close="showTimeDriftModal = false"
    />

    <!-- New TR Modal for editing/completing -->
    <NewTRModal
      :show="showNewTRModal"
      :edit-mode="newTRModalEditMode"
      :auto-complete="newTRModalCompleteMode"
      :track-data="currentTrackForModal"
      @close="closeNewTRModal"
      @save="handleNewTRModalSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, h } from 'vue';
import { IconX, IconDatabase, IconTrash, IconChartLine, IconPlus, IconGripVertical, IconCheck, IconEdit, IconShare, IconChevronDown } from '@tabler/icons-vue';
import { AgGridVue } from 'ag-grid-vue3';
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark } from 'ag-grid-community';
import AlertDialog from '@/components/common/AlertDialog.vue';
import TimeDriftStatsModal from '@/components/tr-tracking/TimeDriftStatsModal.vue';
import NewTRModal from '@/components/tr-tracking/NewTRModal.vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { exportTrack } from '@/utils/trImportExport';
import { getM0Cost } from '@/constants/m0Costs';
import { formatNumber, formatSuffixInput, parseSuffixInput } from '@/composables/format.js';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import Decimal from 'break_infinity.js';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const props = defineProps({
  show: Boolean,
  track: Object
});

const emit = defineEmits(['close', 'update', 'showProgress']);

const trTrackingStore = useTRTrackingStore();

// Local state
const sortOrder = ref('desc');
const newEntry = ref(null);
const draggableResources = ref([]);
const gridApi = ref(null);
const resourceOrder = ref([]); // Track current column order
const initialColumnDefs = ref([]); // Store initial column definitions

// Modals state
const showTimeDriftModal = ref(false); // Time Drift Statistics Modal
const showNewTRModal = ref(false); // New TR Modal for editing/completing
const newTRModalEditMode = ref(false); // Whether NewTRModal is in edit mode
const newTRModalCompleteMode = ref(false); // Whether NewTRModal is opened for completing
const currentTrackForModal = ref(null); // Track data reactive ref to pass to NewTRModal

// Help Guide state
const isHelpGuideExpanded = ref(true); // Default to expanded

// Initialize help guide state from localStorage
const initializeHelpGuideState = () => {
  try {
    const saved = localStorage.getItem('tr-tracking-help-guide-expanded');
    if (saved !== null) {
      isHelpGuideExpanded.value = JSON.parse(saved);
    }
    // If no saved state exists, keep default (true)
  } catch (error) {
    console.warn('Failed to load help guide state from localStorage:', error);
  }
};

// Save help guide state to localStorage
const saveHelpGuideState = () => {
  try {
    localStorage.setItem('tr-tracking-help-guide-expanded', JSON.stringify(isHelpGuideExpanded.value));
  } catch (error) {
    console.warn('Failed to save help guide state to localStorage:', error);
  }
};

// Toggle help guide
const toggleHelpGuide = () => {
  isHelpGuideExpanded.value = !isHelpGuideExpanded.value;
  saveHelpGuideState();
};

// AG Grid Configuration
const defaultColDef = ref({
  resizable: true, // Enable column resizing but hide the visual handles
  sortable: true,
  filter: false,
  editable: false,
  suppressMovable: false,
  minWidth: 100,
  cellStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
});

const gridOptions = ref({
  theme: themeQuartz
    .withPart(colorSchemeDark)
    .withParams({
      spacing: 2,
      borderRadius: 4,
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      foregroundColor: 'rgb(209, 213, 219)',
      accentColor: 'rgb(59, 130, 246)',
      chromeBackgroundColor: 'rgba(31, 41, 55, 1)',
      headerBackgroundColor: 'rgba(31, 41, 55, 1)',
      oddRowBackgroundColor: 'rgba(31, 41, 55, 0.3)',
      rowHoverColor: 'rgba(55, 65, 81, 0.4)',
      borderColor: 'rgba(75, 85, 99, 0.6)'
    }),
  columnDefs: [],
  rowData: [],
  getRowId: (params) => params.data.id, // Add row ID function to help AG Grid track rows
  suppressMovableColumns: false, // Allow column moving by default
  suppressMoveWhenColumnDragging: false, // Allow live movement during drag
  suppressColumnMoveAnimation: false, // Keep animations for smooth movement
  suppressDragLeaveHidesColumns: true, // Prevent columns from hiding when dragged out
  animateRows: true,
  rowHeight: 40, // Increased for better vertical centering
  headerHeight: 80, // Increased header height for multi-line headers
  floatingFiltersHeight: 0, // No floating filters
  suppressScrollOnNewData: true, // Keep scroll position
  alwaysShowHorizontalScroll: false, // Only show when needed
  alwaysShowVerticalScroll: false, // Only show when needed
  singleClickEdit: true,
  stopEditingWhenCellsLoseFocus: true, // Beende Editiermodus bei Klick außerhalb, Wert wird übernommen
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  domLayout: 'normal', // Use normal layout with scrolling instead of autoHeight
  suppressHorizontalScroll: false, // Allow horizontal scrolling
  suppressColumnVirtualisation: false, // Enable virtualisation for better performance
  suppressAutoSize: false, // Allow auto-sizing
  enableCellTextSelection: true, // Enable text selection for better UX
  suppressCellFocus: false, // Allow cell focus
  rowBuffer: 0, // Reduce buffer for better performance
});

// Column definitions for AG Grid - now static
const columnDefs = computed(() => {
  // Return the initial column definitions instead of regenerating
  return initialColumnDefs.value;
});

// Function to build column definitions
const buildColumnDefs = () => {
  // Dynamische Bildschirmgröße zur Laufzeit prüfen
  const isMobile = window.innerWidth <= 1023;
  
  const columns = [
    {
      headerName: isMobile ? 'Timestamp' : 'Log Timestamp',
      field: 'date',
      pinned: isMobile ? false : 'left', // false für Mobile, explizit unpinned
      minWidth: isMobile ? 110 : 140,
      maxWidth: isMobile ? 150 : 220,
      flex: 0, // No flex growth
      autoSizeColumn: true, // Auto-size based on content
      suppressSizeToFit: false, // Allow auto-sizing
      cellRenderer: (params) => {
        // Use the same native browser localization as TRPlanCard
        let dateValue = params.value;
        
        // If we have a localized string (not ISO format), try to parse it
        if (typeof dateValue === 'string' && !dateValue.includes('T') && !dateValue.match(/^\d{4}-\d{2}-\d{2}/)) {
          try {
            const parsedDate = parseLocalizedDateTime(dateValue);
            if (parsedDate && !isNaN(parsedDate.getTime())) {
              dateValue = parsedDate.toISOString();
            }
          } catch (error) {
            console.warn('cellRenderer - Failed to parse localized date:', dateValue, error);
          }
        }
        
        const date = new Date(dateValue);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.warn('cellRenderer - Invalid date:', params.value);
          return 'Invalid Date';
        }
        
        return date.toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      editable: true, // Make timestamp editable
      suppressMovable: true,
      cellDataType: 'text', // Use text for better custom handling
      cellEditor: 'agTextCellEditor', // Use text editor for custom date format
      cellEditorParams: (params) => {
        // Return the localized format for editing
        const date = new Date(params.value);
        const localizedValue = date.toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        console.log('cellEditorParams - Setting initial value to:', localizedValue);
        
        return {
          placeholder: 'Enter date and time',
          value: localizedValue // Set the initial value directly
        };
      },
      // Custom value setter for editing - parses localized input
      valueSetter: (params) => {
        const inputValue = params.newValue;
        
        console.log('valueSetter - Input value:', inputValue);
        console.log('valueSetter - Input type:', typeof inputValue);
        
        // If input is empty, null, or undefined, keep the original date
        if (inputValue === null || inputValue === undefined || (typeof inputValue === 'string' && inputValue.trim() === '')) {
          console.log('valueSetter - Empty/null input, keeping original date');
          return false;
        }
        
        // Convert to string if it's not already
        const stringValue = String(inputValue);
        console.log('valueSetter - String value:', stringValue);
        
        let parsedDate = null;
        
        // Try to parse using our custom parser first
        try {
          parsedDate = parseLocalizedDateTime(stringValue);
          console.log('valueSetter - Custom parser result:', parsedDate);
        } catch (error) {
          console.warn('valueSetter - Custom parser failed:', error);
        }
        
        // If custom parser failed, try native Date constructor
        if (!parsedDate || isNaN(parsedDate.getTime())) {
          try {
            console.log('valueSetter - Trying native Date constructor');
            parsedDate = new Date(stringValue);
            console.log('valueSetter - Native Date result:', parsedDate);
          } catch (error) {
            console.warn('valueSetter - Native Date constructor failed:', error);
          }
        }
        
        // Final validation
        if (!parsedDate || isNaN(parsedDate.getTime())) {
          console.warn('valueSetter - All parsing attempts failed for:', stringValue);
          return false; // Reject invalid input
        }
        
        // Additional check for reasonable dates (not 1970 epoch or too old)
        if (parsedDate.getFullYear() < 2020) {
          console.warn('valueSetter - Parsed date seems invalid (too old):', parsedDate);
          // If it's clearly an epoch date (1970), try to use current date instead
          if (parsedDate.getFullYear() === 1970) {
            console.log('valueSetter - Detected 1970 epoch date, using current date as fallback');
            parsedDate = new Date(); // Use current date/time as fallback
          } else {
            return false; // Reject other old dates
          }
        }
        
        console.log('valueSetter - Final parsed date:', parsedDate);
        params.data.date = parsedDate.toISOString();
        return true;
      },
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: isMobile ? '4px' : '8px',
        height: '100%',
        fontSize: '14px'
      }
    }
  ];

  // Add resource columns in the correct order (including hours-in-tr from store)
  // Since draggableResources is already sorted in the correct order, use it directly
  const orderedResources = draggableResources.value;

  console.log('Building columns with order:', orderedResources.map(r => r.id));

  orderedResources.forEach(resource => {
    // Smart column width distribution based on content type and screen size
    let columnWidth;
    let flexValue = 0;
    let autoSizeColumn = false;
    let minWidth = 100;
    let maxWidth = undefined;
    
    if (resource.id === 'hours-in-tr') {
      columnWidth = isMobile ? 80 : 100;
    } else if (resource.id === 'notes') {
      // Notes column should auto-resize based on content
      columnWidth = isMobile ? 150 : 200; // Initial width
      flexValue = 1; // Notes can expand to use remaining space
      autoSizeColumn = true; // Enable auto-sizing
      minWidth = isMobile ? 120 : 150; // Minimum width
      maxWidth = isMobile ? 300 : 500; // Maximum width to prevent excessive expansion
    } else {
      // Regular resource columns - compact but readable
      columnWidth = isMobile ? 70 : 90;
    }

    columns.push({
      headerName: `⋮⋮\n${resource.name.replace(/ /g, '\n')}`,
      field: `resource_${resource.id}`,
      width: columnWidth,
      flex: flexValue, // Only Notes gets flex for expansion
      cellClass: 'text-center',
      headerClass: `text-center resource-header multi-line-header drag-header`,
      editable: true,
      // Treat lr-ticks as text too for suffix handling
      cellDataType: (resource.id === 'notes' || resource.id === 'oo-accum' || resource.id === 'lr-ticks' || resource.id === 'attgn3-buff' || resource.format === 'time' || resource.format === 'camp') ? 'text' : 'number',
      suppressMovable: false, // Allow these columns to be moved
      suppressSizeToFit: resource.id === 'notes' ? false : false, // Allow auto-sizing for all columns
      // Add custom comparator for time format
      comparator: resource.format === 'time' ? (valueA, valueB) => {
        // Convert time strings to total minutes for comparison
        const timeToMinutes = (timeStr) => {
          if (!timeStr || timeStr === '') return 0;
          const parts = timeStr.split(':');
          if (parts.length !== 2) return 0;
          const hours = parseInt(parts[0], 10) || 0;
          const minutes = parseInt(parts[1], 10) || 0;
          return hours * 60 + minutes;
        };
        
        const minutesA = timeToMinutes(valueA);
        const minutesB = timeToMinutes(valueB);
        return minutesA - minutesB;
      } : undefined,
      resizable: true, // Enable resizing for better flexibility
      autoHeight: resource.id === 'notes', // Enable auto-height for notes to handle long content
      minWidth: resource.id === 'notes' ? minWidth : 70, // Set minimum width
      maxWidth: resource.id === 'notes' ? maxWidth : undefined, // Set maximum width for notes
      wrapText: resource.id === 'notes', // Enable text wrapping for notes
      cellStyle: resource.id === 'notes' ? {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '4px',
        paddingBottom: '4px',
        height: 'auto',
        minHeight: '40px',
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        color: resource.color
      } : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: resource.color
      },
      valueGetter: (params) => {
        if (resource.id === 'notes') {
          return params.data.notes || '';
        }
        // For oo-accum, return the formatted value for editing (when in edit mode, it needs the text representation)
        if (resource.id === 'oo-accum') {
          const value = params.data.values?.[resource.id] || 0;
          return value;
        }
        return params.data.values?.[resource.id] || 0;
      },
      valueSetter: (params) => {
        if (resource.id === 'notes') {
          params.data.notes = params.newValue || '';
          return true;
        }
        if (!params.data.values) params.data.values = {};
        // Handle time format (HHH:MM or HHH MM)
        if (resource.format === 'time') {
          // Allow empty to clear the cell
          const raw = String(params.newValue || '').trim();
          if (raw === '') {
            params.data.values[resource.id] = '';
            return true;
          }
          // Only hours provided (e.g. "5" -> "5:00")
          if (/^\d+$/.test(raw)) {
            params.data.values[resource.id] = `${raw}:00`;
            return true;
          }
          // Hours:minutes or Hours minutes, pad minutes to two digits
          // Accept both ":" and " " (space) as separators
          const match = raw.match(/^(\d+)[:|\s]([0-5]?\d)$/);
          if (!match) {
            console.warn('Invalid time format rejected:', params.newValue);
            return false;
          }
          const hours = match[1];
          const mins = String(parseInt(match[2], 10)).padStart(2, '0');
          params.data.values[resource.id] = `${hours}:${mins}`;
          return true;
        }
        // Handle camp code format (C[1-9]-[0-9]{1,2}, case-insensitive)
        if (resource.format === 'camp') {
          // Allow empty/null to clear the cell
          if (params.newValue === null || params.newValue === undefined || String(params.newValue).trim() === '') {
            params.data.values[resource.id] = '';
            return true;
          }
          const str = String(params.newValue).trim();
          
          // Check for standard format: C[1-9]-[0-9]{1,2} (case-insensitive)
          const campPattern = /^[Cc][1-9]-\d{1,2}$/;
          if (campPattern.test(str)) {
            params.data.values[resource.id] = str.toUpperCase();
            return true;
          }
          
          // Check for space format: C[1-9] [0-9]{1,2} (case-insensitive)
          const spacePattern = /^[Cc]([1-9])\s+(\d{1,2})$/;
          const spaceMatch = str.match(spacePattern);
          if (spaceMatch) {
            const campNumber = spaceMatch[1];
            const subNumber = spaceMatch[2];
            params.data.values[resource.id] = `C${campNumber}-${subNumber}`;
            return true;
          }
          
          console.warn('Invalid camp code rejected:', params.newValue);
          return false;
        }
        // Special handling for oo-accum, lr-ticks, and attgn3-buff to support suffix input
        if ((resource.id === 'oo-accum' || resource.id === 'lr-ticks' || resource.id === 'attgn3-buff') && parseSuffixInput) {
          // For attgn3-buff, also allow exponential notation (e.g., 1e6, 2.5e9)
          if (resource.id === 'attgn3-buff') {
            const inputString = String(params.newValue).toLowerCase().trim();
            
            // Check if it's exponential notation (e.g., 1e6, 2.5e9, 1.5E+10)
            if (inputString.includes('e') && (inputString.match(/^\d+\.?\d*e[+-]?\d+$/) || inputString.match(/^\d*\.\d+e[+-]?\d+$/))) {
              try {
                // Use Decimal for large number handling
                const exponentialDecimal = new Decimal(params.newValue);
                const maxValue = new Decimal('1e333');
                
                // Simple validation: check if toString() works and compare against max
                const decimalString = exponentialDecimal.toString();
                if (decimalString === 'NaN' || decimalString === 'Infinity' || exponentialDecimal.lt(0) || exponentialDecimal.gt(maxValue)) {
                  console.warn(`Invalid attgn3-buff exponential value rejected:`, params.newValue, 'parsed to:', decimalString);
                  return false;
                }
                
                // Store as string for very large numbers, number for smaller ones
                if (exponentialDecimal.gt(Number.MAX_SAFE_INTEGER)) {
                  params.data.values[resource.id] = exponentialDecimal.toString();
                } else {
                  params.data.values[resource.id] = exponentialDecimal.toNumber();
                }
                return true;
              } catch (error) {
                console.warn(`Error parsing attgn3-buff exponential value:`, params.newValue, error);
                return false;
              }
            }
          }
          
          // Use suffix input parsing for all three resources
          const parsedValue = parseSuffixInput(params.newValue);
          // Higher maximum for attgn3-buff since buff values can be very large
          let maxValue;
          if (resource.id === 'attgn3-buff') {
            try {
              const maxDecimal = new Decimal('1e333');
              const parsedDecimal = new Decimal(parsedValue);
              if (parsedDecimal.gt(maxDecimal)) {
                console.warn(`Invalid ${resource.id} value rejected:`, params.newValue, 'parsed to:', parsedValue, '(exceeds 1e333)');
                return false;
              }
              maxValue = maxDecimal.toNumber();
            } catch (error) {
              maxValue = 1e30; // Fallback
            }
          } else {
            maxValue = 1e15;
          }
          
          if (isNaN(parsedValue) || !isFinite(parsedValue) || parsedValue < 0 || parsedValue > maxValue) {
            console.warn(`Invalid ${resource.id} value rejected:`, params.newValue, 'parsed to:', parsedValue);
            return false;
          }
          params.data.values[resource.id] = parsedValue;
          return true;
        }
        // Numeric default
        const numericValue = parseFloat(params.newValue);
        if (isNaN(numericValue) || !isFinite(numericValue) || numericValue < 0 || numericValue > 1e12) {
          console.warn('Invalid numeric value rejected:', params.newValue);
          return false;
        }
        const inputString = String(params.newValue).toLowerCase();
        if (inputString.includes('e') && (inputString.match(/\d+e[+-]?\d+/) || inputString.match(/\d+\.\d+e[+-]?\d+/))) {
          console.warn('Scientific notation rejected:', params.newValue);
          return false;
        }
        params.data.values[resource.id] = numericValue;
        return true;
      },
      cellRenderer: (params) => {
        if (resource.id === 'notes') {
          const noteText = params.value || '-';
          // For notes, return plain text to enable proper text wrapping
          return noteText;
        }
        
        const currentValue = params.value || 0;
        
        // Only show differences for specific resources: cells, mp, mp-accum, shards, rp, ap, oo-accum
        const showDifferenceFor = ['cells', 'mp', 'mp-accum', 'shards', 'rp', 'ap', 'oo-accum'];
        const shouldShowDifference = showDifferenceFor.includes(resource.id);
        
        // Check if this is a whole number and we should show difference
        const isWholeNumber = Number.isInteger(currentValue) && currentValue !== 0;
        
        // Special display for oo-accum and attgn3-buff - always format with suffix notation
        if (resource.id === 'oo-accum' || resource.id === 'attgn3-buff') {
          let displayValue;
          
          if (resource.id === 'attgn3-buff') {
            // Handle very large numbers for attgn3-buff using Decimal
            try {
              const decimal = new Decimal(currentValue);
              if (decimal.gte('1e15')) {
                displayValue = decimal.toExponential(2).replace('e+', 'e');
              } else {
                displayValue = formatSuffixInput(currentValue);
              }
            } catch (error) {
              displayValue = formatSuffixInput(currentValue);
            }
          } else {
            displayValue = formatSuffixInput(currentValue);
          }
          
          if (!shouldShowDifference || !isWholeNumber) {
            return displayValue;
          }
          
          // Calculate difference for oo-accum and attgn3-buff
          const allEntries = [];
          params.api.forEachNode(node => {
            // Skip temporary entries
            if (!node.data.id?.toString().startsWith('temp_')) {
              allEntries.push(node.data);
            }
          });
          
          // Sort chronologically (oldest first) by date
          const chronologicalEntries = allEntries.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB; // Oldest first
          });
          
          const currentRowData = params.data;
          const currentIndex = chronologicalEntries.findIndex(entry => entry.id === currentRowData.id);
          
          if (currentIndex <= 0) {
            // This is the first/oldest entry chronologically, no difference to show
            return displayValue;
          }
          
          // Get the chronologically previous entry
          const previousEntry = chronologicalEntries[currentIndex - 1];
          const previousValue = previousEntry.values?.[resource.id] || 0;
          const difference = currentValue - previousValue;
          
          if (difference === 0) {
            return displayValue;
          }
          
          let diffText;
          if (resource.id === 'attgn3-buff') {
            // Handle large number differences for attgn3-buff
            try {
              const diffDecimal = new Decimal(Math.abs(difference));
              if (diffDecimal.gte('1e15')) {
                diffText = (difference > 0 ? '+' : '-') + diffDecimal.toExponential(2).replace('e+', 'e');
              } else {
                diffText = difference > 0 ? `+${formatSuffixInput(difference)}` : `-${formatSuffixInput(Math.abs(difference))}`;
              }
            } catch (error) {
              diffText = difference > 0 ? `+${formatSuffixInput(difference)}` : `-${formatSuffixInput(Math.abs(difference))}`;
            }
          } else {
            diffText = difference > 0 ? `+${formatSuffixInput(difference)}` : `-${formatSuffixInput(Math.abs(difference))}`;
          }
          
          return `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 2px;">
              <span style="font-size: 14px; color: inherit;">${displayValue}</span>
              <span style="font-size: 10px; color: #ffffff; margin-top: 1px;">
                ${diffText}
              </span>
            </div>
          `;
        }
        
        if (!shouldShowDifference || !isWholeNumber) {
          return currentValue;
        }
        
        // Find the previous entry to calculate difference
        const allEntries = [];
        params.api.forEachNode(node => {
          // Skip temporary entries
          if (!node.data.id?.toString().startsWith('temp_')) {
            allEntries.push(node.data);
          }
        });
        
        // Sort chronologically (oldest first) by date
        const chronologicalEntries = allEntries.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB; // Oldest first
        });
        
        const currentRowData = params.data;
        const currentIndex = chronologicalEntries.findIndex(entry => entry.id === currentRowData.id);
        
        if (currentIndex <= 0) {
          // This is the first/oldest entry chronologically, no difference to show
          return currentValue;
        }
        
        // Get the chronologically previous entry
        const previousEntry = chronologicalEntries[currentIndex - 1];
        const previousValue = previousEntry.values?.[resource.id] || 0;
        const difference = currentValue - previousValue;
        
        if (difference === 0) {
          return currentValue;
        }
        
        const diffText = difference > 0 ? `+${difference}` : `${difference}`;
        
        return `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; padding: 2px;">
            <span style="font-size: 14px; color: inherit;">${currentValue}</span>
            <span style="font-size: 10px; color: #ffffff; margin-top: 1px;">
              ${diffText}
            </span>
          </div>
        `;
      },
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: resource.id === 'notes' ? 'flex-start' : 'center',
        paddingLeft: resource.id === 'notes' ? '8px' : '0',
        height: '100%',
        color: resource.color
      },
      headerTooltip: `Drag to reorder: ${resource.name}`,
      // Tab navigation support - prevent auto-save on tab and select text
      suppressKeyboardEvent: (params) => {
        // Allow 'e' and 'E' for scientific notation in attgn3-buff, prevent for others except notes
        if (resource.id !== 'notes' && resource.id !== 'attgn3-buff' && (params.event.key === 'e' || params.event.key === 'E')) {
          console.warn('Scientific notation key blocked:', params.event.key);
          params.event.preventDefault();
          return true; // Suppress the event
        }
        
        // For new entries being edited, allow tab navigation between cells without saving
        if (params.data.isNew && params.data.isEditing) {
          if (params.event.key === 'Tab') {
            // Stop current cell editing
            gridApi.value.stopEditing();
            
            // Get the actual displayed column order from the grid
            const displayedColumns = gridApi.value.getAllDisplayedColumns();
            const editableColumns = displayedColumns.filter(col => {
              const colId = col.getColId();
              return colId.startsWith('resource_');
            });
            
            // Find current column index in the displayed order
            const currentColId = params.column.getColId();
            const currentIndex = editableColumns.findIndex(col => col.getColId() === currentColId);
            
            let nextIndex;
            if (params.event.shiftKey) {
              // Shift+Tab - go to previous column
              nextIndex = currentIndex - 1;
              if (nextIndex < 0) {
                nextIndex = editableColumns.length - 1; // Wrap to last column
              }
            } else {
              // Tab - go to next column
              nextIndex = (currentIndex + 1) % editableColumns.length;
            }
            
            const nextColumn = editableColumns[nextIndex];
            const nextColId = nextColumn.getColId();
            
            // Start editing the next/previous cell
            setTimeout(() => {
              gridApi.value.startEditingCell({
                rowIndex: 0,
                colKey: nextColId
              });
              gridApi.value.setFocusedCell(0, nextColId);
              
              // Focus the input
              setTimeout(() => {
                const nextInput = document.querySelector(`[row-index="0"][col-id="${nextColId}"] .ag-cell-edit-input`);
                if (nextInput) {
                  nextInput.focus();
                  nextInput.select();
                }
              }, 50);
            }, 50);
            
            return true; // Prevent default Tab behavior
          }
          if (params.event.key === 'Enter') {
            // Enter should also not save, just confirm the cell edit
            return false;
          }
        }
        return false;
      },
      // Cell editor parameters to auto-select text
      cellEditorParams: (params) => {
        // Time or camp as text input
        if (resource.format === 'time' || resource.format === 'camp') {
          return { selectAllOnFocusIn: true, maxLength: 6, value: params.value || '' };
        }
        // For oo-accum, lr-ticks, and attgn3-buff, show suffix input
        if (resource.id === 'oo-accum' || resource.id === 'lr-ticks' || resource.id === 'attgn3-buff') {
          let displayValue;
          
          if (resource.id === 'attgn3-buff') {
            // Handle very large numbers for attgn3-buff
            try {
              const decimal = new Decimal(params.value || 0);
              if (decimal.gte('1e15')) {
                displayValue = decimal.toExponential(2).replace('e+', 'e');
              } else {
                displayValue = formatSuffixInput(params.value || 0);
              }
            } catch (error) {
              displayValue = formatSuffixInput(params.value || 0);
            }
          } else {
            displayValue = formatSuffixInput(params.value || 0);
          }
          
          return { selectAllOnFocusIn: true, value: displayValue };
        }
        // Numeric default
        if (resource.id !== 'notes') {
          return { selectAllOnFocusIn: true, maxLength: 12 };
        }
        return { selectAllOnFocusIn: true };
      }
    });
  });

  // Add Actions column only (Notes is now handled as a resource)
  columns.push(
    {
      headerName: 'Actions',
      field: 'actions',
      width: 80,
      cellClass: 'text-center',
      headerClass: 'text-center',
      pinned: isMobile ? false : 'right', // false für Mobile, explizit unpinned
      editable: false,
      suppressMovable: true,
      cellRenderer: (params) => {
        // Check if this is a new entry being edited
        if (params.data.isNew && params.data.isEditing) {
          return `
            <div class="flex gap-1 justify-center">
              <button class="text-green-400 hover:text-green-300 p-1 rounded hover:bg-green-900/20 transition-colors" 
                     title="Save Entry" 
                     tabindex="0"
                     onclick="event.stopPropagation(); window.confirmNewEntryFromGrid('${params.data.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M5 12l5 5l10 -10"/>
                </svg>
              </button>
              <button class="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-colors" 
                     title="Cancel" 
                     tabindex="0"
                     onclick="event.stopPropagation(); window.cancelEntryEditFromGrid('${params.data.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M18 6l-12 12"/>
                  <path d="M6 6l12 12"/>
                </svg>
              </button>
            </div>
          `;
        } else {
          // Regular delete button for existing entries
          return `<button class="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-colors flex items-center justify-center" 
                         title="Delete Entry" onclick="event.stopPropagation(); window.deleteEntryFromGrid('${params.data.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M4 7l16 0"/>
                      <path d="M10 11l0 6"/>
                      <path d="M14 11l0 6"/>
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>
                    </svg>
                  </button>`;
        }
      },
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }
    }
  );

  return columns;
};

// Grid row data
const gridRowData = computed(() => {
  return sortedEntries.value;
});

// AlertDialog state
const alertDialog = ref({
  isVisible: false,
  title: '',
  message: '',
  type: 'info',
  showCancel: true,
  confirmText: 'OK',
  cancelText: 'Cancel',
  onConfirm: null
});

// Computed
const sortedEntries = computed(() => {
  if (!props.track || !props.track.entries) return [];
  
  return [...props.track.entries].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB;
  });
});

// Initialize draggable resources when props change
const initializeDraggableResources = () => {
  // Get selected resources from the store - these are the enabled/selected ones
  const selectedResources = trTrackingStore.selectedResources;
  
  console.log('Selected resources from store:', selectedResources.map(r => r.id));
  
  if (selectedResources && selectedResources.length > 0) {
    // Map selected resources to get the latest color information from the store
    const mappedResources = selectedResources.map(selectedResource => {
      // Find the resource in the store to get the current color and other properties
      const storeResource = trTrackingStore.availableResources.find(r => r.id === selectedResource.id);
      return {
        ...selectedResource,
        color: storeResource?.color || selectedResource.color, // Use store color if available, fallback to selected color
        name: storeResource?.name || selectedResource.name // Use store name if available
      };
    });
    
    console.log('Mapped resources:', mappedResources.map(r => r.id));
    
    // Load column order from localStorage first, then from track data, then default
    const savedColumnOrder = loadColumnOrderFromLocalStorage();
    
    if (savedColumnOrder && savedColumnOrder.length > 0) {
      // Validate the saved order against available resources
      const validResourceIds = mappedResources.map(r => r.id);
      const filteredOrder = savedColumnOrder.filter(id => validResourceIds.includes(id));
      console.log('Saved order:', savedColumnOrder, 'Valid IDs:', validResourceIds, 'Filtered:', filteredOrder);
      
      if (filteredOrder.length > 0) {
        // Use saved order from localStorage
        resourceOrder.value = filteredOrder;
        
        // Sort draggableResources based on saved order
        const sortedResources = [];
        filteredOrder.forEach(resourceId => {
          const resource = mappedResources.find(r => r.id === resourceId);
          if (resource) {
            sortedResources.push(resource);
          }
        });
        
        // Add any resources that weren't in the saved order (new resources)
        mappedResources.forEach(resource => {
          if (!filteredOrder.includes(resource.id)) {
            sortedResources.push(resource);
          }
        });
        
        draggableResources.value = sortedResources;
        console.log('Applied saved column order:', filteredOrder);
        console.log('Sorted resources:', sortedResources.map(r => r.id));
      } else {
        // Saved order doesn't match current resources, use default
        draggableResources.value = mappedResources;
        resourceOrder.value = mappedResources.map(r => r.id);
        console.log('Saved order invalid, using default');
      }
    } else if (props.track?.resourceOrder && props.track.resourceOrder.length > 0) {
      // Fallback to track data
      const validResourceIds = mappedResources.map(r => r.id);
      const filteredOrder = props.track.resourceOrder.filter(id => validResourceIds.includes(id));
      
      if (filteredOrder.length > 0) {
        resourceOrder.value = filteredOrder;
        
        // Sort draggableResources based on track order
        const sortedResources = [];
        filteredOrder.forEach(resourceId => {
          const resource = mappedResources.find(r => r.id === resourceId);
          if (resource) {
            sortedResources.push(resource);
          }
        });
        
        // Add any resources that weren't in the track order
        mappedResources.forEach(resource => {
          if (!filteredOrder.includes(resource.id)) {
            sortedResources.push(resource);
          }
        });
        
        draggableResources.value = sortedResources;
        console.log('Applied track column order:', filteredOrder);
      } else {
        // Track order doesn't match current resources, use default
        draggableResources.value = mappedResources;
        resourceOrder.value = mappedResources.map(r => r.id);
        console.log('Track order invalid, using default');
      }
    } else {
      // Use default order from store - sort based on store's availableResources order
      const storeOrder = [];
      const mappedResourceIds = mappedResources.map(r => r.id);
      
      // Go through store resources in their defined order and add selected ones
      trTrackingStore.availableResources.forEach(storeResource => {
        if (mappedResourceIds.includes(storeResource.id)) {
          storeOrder.push(storeResource.id);
        }
      });
      
      // Add any resources that might not be in the store (fallback)
      mappedResourceIds.forEach(resourceId => {
        if (!storeOrder.includes(resourceId)) {
          storeOrder.push(resourceId);
        }
      });
      
      // Sort draggableResources based on store order
      const sortedResources = [];
      storeOrder.forEach(resourceId => {
        const resource = mappedResources.find(r => r.id === resourceId);
        if (resource) {
          sortedResources.push(resource);
        }
      });
      
      draggableResources.value = sortedResources;
      resourceOrder.value = storeOrder;
      console.log('Using store-based default column order:', storeOrder);
    }
    
    // Build and store the initial column definitions
    initialColumnDefs.value = buildColumnDefs();
  }
};

const getColumnOrderStorageKey = () => {
  // Use track name as fallback if no ID available yet
  const identifier = props.track?.id || props.track?.name || 'default';
  return `tr-tracking-column-order-${identifier}`;
};

const saveColumnOrderToLocalStorage = (order) => {
  try {
    const storageKey = getColumnOrderStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(order));
    console.log('Saved to localStorage:', storageKey, order);
  } catch (error) {
    console.warn('Failed to save column order to localStorage:', error);
  }
};

const loadColumnOrderFromLocalStorage = () => {
  try {
    const storageKey = getColumnOrderStorageKey();
    const saved = localStorage.getItem(storageKey);
    console.log('Loading from localStorage:', storageKey, saved);
    if (saved) {
      const parsedOrder = JSON.parse(saved);
      console.log('Parsed order from localStorage:', parsedOrder);
      // Return the parsed order without validation here - validation happens later when we have the resources
      return parsedOrder.length > 0 ? parsedOrder : null;
    }
  } catch (error) {
    console.warn('Failed to load column order from localStorage:', error);
  }
  return null;
};

// Save current column order when modal closes
const saveCurrentColumnOrder = () => {
  if (gridApi.value && resourceOrder.value.length > 0) {
    // Get current column order from the grid using the same method as onColumnMoved
    const currentOrder = [];
    const displayedColumns = gridApi.value.getAllDisplayedColumns();
    
    displayedColumns.forEach(col => {
      const colId = col.getColId();
      if (colId.startsWith('resource_')) {
        const resourceId = colId.replace('resource_', '');
        currentOrder.push(resourceId);
      }
    });

    console.log('Getting current order on modal close:', currentOrder);

    if (currentOrder.length > 0) {
      // Save to localStorage
      saveColumnOrderToLocalStorage(currentOrder);
      
      // Save to store if track has an ID
      if (props.track?.id) {
        trTrackingStore.updateResourceOrder(props.track.id, currentOrder);
      }
      
      console.log('Saved column order on modal close:', currentOrder);
    }
  }
};

// Watch for prop changes - only watch show prop now since we don't depend on selectedResources
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Initialize when modal opens
    initializeDraggableResources();
    initializeHelpGuideState();
  }
}, { immediate: true });

// Watch for changes in available resources (color updates and enable/disable changes)
watch(() => trTrackingStore.availableResources, () => {
  // Re-initialize draggable resources when store resources change
  if (props.show && gridApi.value) {
    initializeDraggableResources();
    
    // Update the grid with new column definitions (to reflect color changes and enabled/disabled resources)
    nextTick(() => {
      if (gridApi.value) {
        const newColumnDefs = buildColumnDefs();
        gridApi.value.setGridOption('columnDefs', newColumnDefs);
        initialColumnDefs.value = newColumnDefs;
      }
    });
  }
}, { deep: true });

// Watch for changes in selected resources (when user enables/disables resources)
watch(() => trTrackingStore.selectedResources, () => {
  // Re-initialize draggable resources when selected resources change
  if (props.show && gridApi.value) {
    initializeDraggableResources();
    
    // Update the grid with new column definitions (to reflect enabled/disabled resources)
    nextTick(() => {
      if (gridApi.value) {
        const newColumnDefs = buildColumnDefs();
        gridApi.value.setGridOption('columnDefs', newColumnDefs);
        initialColumnDefs.value = newColumnDefs;
      }
    });
  }
}, { deep: true });


// Reset state when modal is opened/closed
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Reset resourceOrder when modal opens to allow fresh initialization
    resourceOrder.value = [];
    initialColumnDefs.value = [];
    initializeDraggableResources();
    
    // Add window resize listener for responsive column updates
    window.addEventListener('resize', handleWindowResize);
  } else {
    // Save current column order when modal closes
    saveCurrentColumnOrder();
    
    // Remove resize listener when modal closes
    window.removeEventListener('resize', handleWindowResize);
  }
});

// Handle window resize for responsive column updates
function handleWindowResize() {
  // Debounce resize events
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    updateColumnDefinitions();
  }, 150);
}

function updateColumnDefinitions() {
  if (gridApi.value) {
    // Rebuild column definitions with current screen size
    const newColumnDefs = buildColumnDefs();
    
    // Update grid with new column definitions using correct AG Grid API
    gridApi.value.setGridOption('columnDefs', newColumnDefs);
    
    // Update our stored initial column definitions
    initialColumnDefs.value = newColumnDefs;
  }
}

// Dialog functions
function showDialog(options) {
  alertDialog.value = {
    isVisible: true,
    title: options.title || 'Alert',
    message: options.message || '',
    type: options.type || 'info',
    showCancel: options.showCancel !== undefined ? options.showCancel : true,
    confirmText: options.confirmText || 'OK',
    cancelText: options.cancelText || 'Cancel',
    onConfirm: options.onConfirm || null
  };
}

function confirmDialog() {
  if (alertDialog.value.onConfirm) {
    alertDialog.value.onConfirm();
  }
  alertDialog.value.isVisible = false;
}

function cancelDialog() {
  alertDialog.value.isVisible = false;
}

// Modal close functions
function hasUnsavedEntry() {
  // Check if there's a new entry being edited
  if (!gridApi.value) return false;
  
  let hasUnsaved = false;
  gridApi.value.forEachNode(node => {
    if (node.data.isNew && node.data.isEditing) {
      hasUnsaved = true;
    }
  });
  
  return hasUnsaved;
}

function closeModalDirect() {
  if (hasUnsavedEntry()) {
    closeModalWithUnsavedWarning();
  } else {
    emit('close');
  }
}

function closeModalWithUnsavedWarning() {
  showDialog({
    title: 'Unsaved Entry',
    message: 'You have an unsaved entry that is still being edited. Are you sure you want to close this modal? Your changes will be lost.',
    type: 'warning',
    showCancel: true,
    confirmText: 'Close Anyway',
    cancelText: 'Continue Editing',
    onConfirm: () => {
      // Cancel the unsaved entry and close
      if (gridApi.value) {
        gridApi.value.forEachNode(node => {
          if (node.data.isNew && node.data.isEditing) {
            // Remove the unsaved entry
            const rowData = [];
            gridApi.value.forEachNode(n => {
              if (n.data.id !== node.data.id) {
                rowData.push(n.data);
              }
            });
            gridApi.value.setGridOption('rowData', rowData);
          }
        });
      }
      emit('close');
    }
  });
}

// AttGN3 Calculator Functions (based on AttrGN3Calculator.vue)
const researchData = [
  { id: "research44", level: 2, bonus: 0.2, cost: "115" },
  { id: "research44", level: 4, bonus: 0.3, cost: "165" },
  { id: "research44", level: 6, bonus: 0.5, cost: "219" },
  { id: "research51", level: 2, bonus: 0.4, cost: "302" },
  { id: "research51", level: 4, bonus: 0.6, cost: "405" },
  { id: "research51", level: 6, bonus: 1, cost: "507" },
  { id: "research61", level: 2, bonus: 2, cost: "363" },
  { id: "research61", level: 4, bonus: 4, cost: "495" },
  { id: "research61", level: 6, bonus: 6, cost: "627" },
  { id: "research71", level: 2, bonus: 3, cost: "822" },
  { id: "research71", level: 4, bonus: 5, cost: "1165" },
  { id: "research71", level: 6, bonus: 7, cost: "1509" },
  { id: "research91", level: 1, bonus: 0.2, cost: "4500" },
  { id: "research91", level: 3, bonus: 0.6, cost: "5200" },
  { id: "research91", level: 5, bonus: 1, cost: "5900" },
];

function getAttGN3DaysToMax() {
  const latestValues = getLatestValues();
  
  // Get current attgn3-buff value
  const currentAttrMultiplier = latestValues['attgn3-buff'] || 0;
  if (currentAttrMultiplier === 0) return '∞';
  
  // Convert to Decimal for large number handling
  const currentDecimal = new Decimal(currentAttrMultiplier);
  if (currentDecimal.gte('1e333')) return '0'; // Already at max
  
  // Get LR Ticks and RP from latest entry (LR Ticks = Current Ticks in LR)
  const currentTicksInLR = latestValues['lr-ticks'] || 0;
  const researchPoints = latestValues.rp || 0;
  
  // Get other values from AttrGN3 Calculator settings (load from localStorage)
  let calculatorSettings = {
    tickSpeed: 1.5,
    ticksPerTick: 1,
    relic14: 0,
    efficiencyBadge: false,
    ts5: false
  };
  
  try {
    const savedSettings = JSON.parse(localStorage.getItem('attrGN3Calculator_settings') || '{}');
    if (savedSettings.tickSpeed !== undefined) calculatorSettings.tickSpeed = savedSettings.tickSpeed;
    if (savedSettings.ticksPerTick !== undefined) calculatorSettings.ticksPerTick = savedSettings.ticksPerTick;
    if (savedSettings.relic14 !== undefined) calculatorSettings.relic14 = savedSettings.relic14;
    if (savedSettings.efficiencyBadge !== undefined) calculatorSettings.efficiencyBadge = savedSettings.efficiencyBadge;
    if (savedSettings.ts5 !== undefined) calculatorSettings.ts5 = savedSettings.ts5;
  } catch (error) {
    console.warn('Could not load AttrGN3 Calculator settings, using defaults');
  }
  
  // Calculate ticks per day
  const ticksPerDay = (86400 / calculatorSettings.tickSpeed) * calculatorSettings.ticksPerTick;
  
  // Calculate ticks per operation
  const ticksPerOperation = 29 - calculatorSettings.relic14;
  if (ticksPerOperation <= 0) return '∞';
  
  // Calculate operations per operation
  let operationsPerOperation = 1;
  if (calculatorSettings.efficiencyBadge) operationsPerOperation *= 3;
  if (calculatorSettings.ts5) operationsPerOperation *= 2;
  
  // Calculate operations per day
  const operationsPerDay = (ticksPerDay / ticksPerOperation) * operationsPerOperation;
  
  // Calculate affordable research
  const affordableResearch = researchData.filter(research => {
    const cost = parseFloat(research.cost);
    return cost <= researchPoints;
  });
  
  // Calculate retained operations percentage
  const retainedOperations = affordableResearch.reduce((sum, research) => sum + research.bonus, 0);
  
  // Calculate retained per day
  const retainedPerDay = operationsPerDay * (retainedOperations / 100);
  
  // Calculate multiplier per day
  const attributionRate = 0.001; // 0.10%
  const multiPerDay = Math.pow(1 + attributionRate, retainedPerDay);
  
  if (multiPerDay <= 1) return '∞';
  
  try {
    // Target and current as Decimal
    const target = new Decimal('1e333');
    const current = currentDecimal;
    const dailyMulti = new Decimal(multiPerDay);
    
    if (current.gte(target)) return '0'; // Already reached
    if (dailyMulti.lte(1)) return '∞';
    
    // Calculate current operations in LR (using currentTicksInLR from tracking data)
    const currentOperations = (currentTicksInLR / ticksPerOperation) * operationsPerOperation;
    const currentRetained = currentOperations * (retainedOperations / 100);
    
    // Calculate pending multiplier from current LR (this is the same as currentMultiplier in AttrGN3Calculator)
    const pendingMultiplier = currentRetained <= 0 ? new Decimal(1) : new Decimal(1 + attributionRate).pow(currentRetained);
    
    // Calculate final result (current * pending) with max cap
    const finalResult = current.mul(pendingMultiplier);
    const maxValue = new Decimal('1e333');
    
    // If final result exceeds 1e333, limit the pending multiplier
    let effectivePendingMultiplier = pendingMultiplier;
    if (finalResult.gt(maxValue)) {
      effectivePendingMultiplier = maxValue.div(current);
      if (effectivePendingMultiplier.lt(1)) effectivePendingMultiplier = new Decimal(1);
    }
    
    // Calculate days in current LR
    const actualTickEvents = currentTicksInLR / calculatorSettings.ticksPerTick;
    const secondsInLR = actualTickEvents * calculatorSettings.tickSpeed;
    const daysInLR = secondsInLR / 86400;
    
    // Use the same logic as AttrGN3Calculator's daysLeftTo1e333
    // Calculate total days needed from current position
    const ratio = target.dividedBy(current);
    
    // Use Decimal logarithms for large numbers
    const logRatio = ratio.ln();
    const logDaily = dailyMulti.ln();
    
    if (logDaily <= 0) return '∞'; // No progress possible
    
    const totalDaysNeeded = logRatio / logDaily;
    
    // Check if the result is valid
    if (!isFinite(totalDaysNeeded) || isNaN(totalDaysNeeded) || totalDaysNeeded <= 0) {
      return '∞';
    }
    
    // Subtract the days already spent in current LR
    const remainingDays = totalDaysNeeded - daysInLR;
    
    return Math.max(0, remainingDays);
    
  } catch (error) {
    console.error('AttGN3 calculation error:', error);
    return '∞';
  }
}

function formatAttGN3Days(days) {
  if (days === '∞' || days === Infinity) return '∞';
  if (days === '0' || days === 0) return 'Complete!';
  
  const numDays = parseFloat(days);
  if (isNaN(numDays)) return '∞';
  
  if (numDays >= 1) {
    const wholeDays = Math.floor(numDays);
    const remainingHours = Math.round((numDays - wholeDays) * 24);
    
    if (remainingHours > 0) {
      return `${wholeDays} days ${remainingHours} hours`;
    } else {
      return `${wholeDays} days`;
    }
  } else {
    const hours = Math.ceil(numDays * 24);
    return `${hours} hours`;
  }
}

// Get AttGN3 completion details with date/time and remaining time
function getAttGN3CompletionDetails() {
  const daysToMax = getAttGN3DaysToMax();
  
  if (daysToMax === '∞' || daysToMax === Infinity) {
    return 'Never';
  }
  
  if (daysToMax === '0' || daysToMax === 0) {
    return 'Complete!';
  }
  
  const numDays = parseFloat(daysToMax);
  if (isNaN(numDays)) return 'Never';
  
  // Calculate completion date/time
  const now = new Date();
  const completionDate = new Date(now.getTime() + (numDays * 24 * 60 * 60 * 1000));
  
  // Format completion date/time
  const formattedDateTime = completionDate.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Calculate remaining days and hours
  const wholeDays = Math.floor(numDays);
  const remainingHours = Math.round((numDays - wholeDays) * 24);
  
  let remainingText;
  if (numDays >= 1) {
    if (remainingHours > 0) {
      remainingText = `${wholeDays}d ${remainingHours}h`;
    } else {
      remainingText = `${wholeDays}d`;
    }
  } else {
    const hours = Math.ceil(numDays * 24);
    remainingText = `${hours}h`;
  }
  
  return `${formattedDateTime} (${remainingText})`;
}

// Get AttGN3 pending multiplier
function getAttGN3PendingMultiplier() {
  const latestValues = getLatestValues();
  
  // Get values from tracking data
  const currentTicksInLR = latestValues['lr-ticks'] || 0;
  const researchPoints = latestValues.rp || 0;
  
  // Get saved calculator settings
  let savedSettings = {};
  try {
    savedSettings = JSON.parse(localStorage.getItem('attrGN3Calculator_settings') || '{}');
  } catch (error) {
    console.warn('Failed to load AttGN3 calculator settings:', error);
  }
  
  // Use saved settings or defaults
  const tickSpeed = savedSettings.tickSpeed || 1.5;
  const ticksPerTick = savedSettings.ticksPerTick || 1;
  const efficiencyBadge = savedSettings.efficiencyBadge || false;
  const ts5 = savedSettings.ts5 || false;
  const relic14 = savedSettings.relic14 || 0;
  
  // Calculate ticks per operation
  const ticksPerOperation = 29 - relic14;
  if (ticksPerOperation <= 0) return '∞';
  
  // Calculate operations per operation
  let operationsPerOperation = 1;
  if (efficiencyBadge) operationsPerOperation *= 3;
  if (ts5) operationsPerOperation *= 2;
  
  // Calculate current operations
  const currentOperations = (currentTicksInLR / ticksPerOperation) * operationsPerOperation;
  
  // Research data for retention calculation
  const researchData = [
    { bonus: 0.2, cost: 115 },
    { bonus: 0.3, cost: 165 },
    { bonus: 0.5, cost: 219 },
    { bonus: 0.4, cost: 302 },
    { bonus: 0.6, cost: 405 },
    { bonus: 1, cost: 507 },
    { bonus: 2, cost: 363 },
    { bonus: 4, cost: 495 },
    { bonus: 6, cost: 627 },
    { bonus: 3, cost: 822 },
    { bonus: 5, cost: 1165 },
    { bonus: 7, cost: 1509 },
    { bonus: 0.2, cost: 4500 },
    { bonus: 0.6, cost: 5200 },
    { bonus: 1, cost: 5900 }
  ];
  
  // Calculate affordable research and retention rate
  const affordableResearch = researchData.filter(r => r.cost <= researchPoints);
  const retainedOperations = affordableResearch.reduce((sum, r) => sum + r.bonus, 0);
  
  // Calculate retained operations
  const currentRetained = currentOperations * (retainedOperations / 100);
  
  if (currentRetained <= 0) return '1.00';
  
  // Calculate multiplier using attribution rate of 0.10%
  const attributionRate = 0.001;
  const multiplier = Math.pow(1 + attributionRate, currentRetained);
  
  // Format the multiplier
  if (multiplier >= 1000) {
    const exponent = Math.floor(Math.log10(multiplier));
    const mantisse = multiplier / Math.pow(10, exponent);
    return mantisse.toFixed(2) + 'e' + exponent;
  }
  
  return multiplier.toFixed(2);
}

// Get Time in LR - calculates current time spent in this LR run
function getTimeInLR() {
  const latestValues = getLatestValues();
  
  // Get current LR Ticks from tracking data
  const currentTicksInLR = latestValues['lr-ticks'] || 0;
  
  if (currentTicksInLR === 0) return '0d 0h';
  
  // Get calculator settings from localStorage
  let savedSettings = {};
  try {
    savedSettings = JSON.parse(localStorage.getItem('attrGN3Calculator_settings') || '{}');
  } catch (error) {
    console.warn('Failed to load AttGN3 calculator settings:', error);
  }
  
  // Use saved settings or defaults (same as AttGN3 Calculator)
  const tickSpeed = savedSettings.tickSpeed || 1.5;
  const ticksPerTick = savedSettings.ticksPerTick || 1;
  
  if (tickSpeed === 0 || ticksPerTick === 0) return '0d 0h';
  
  // Calculate time in LR (same logic as AttGN3 Calculator)
  // Number of actual "tick events" = currentTicksInLR / ticksPerTick
  const actualTickEvents = currentTicksInLR / ticksPerTick;
  
  // Each tick event lasts tickSpeed seconds
  const secondsInLR = actualTickEvents * tickSpeed;
  
  // Convert seconds to days
  const daysInLR = secondsInLR / 86400;
  
  // Format in days, hours and minutes (as requested)
  if (daysInLR === 0) return '0d 0h 0m';
  
  const totalMinutes = Math.floor(daysInLR * 24 * 60);
  const wholeDays = Math.floor(totalMinutes / (24 * 60));
  const wholeHours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const remainingMinutes = totalMinutes % 60;
  
  if (wholeDays > 0) {
    return `${wholeDays}d ${wholeHours}h ${remainingMinutes}m`;
  } else if (wholeHours > 0) {
    return `${wholeHours}h ${remainingMinutes}m`;
  } else {
    return `${remainingMinutes}m`;
  }
}

// Get latest values from the most recent entry
function getLatestValues() {
  if (!props.track || !props.track.entries || props.track.entries.length === 0) {
    return {};
  }
  
  // Sort entries by date to get the most recent
  const sortedEntries = [...props.track.entries].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Most recent first
  });
  
  const latestEntry = sortedEntries[0];
  return latestEntry.values || {};
}

// Get camp timer value from latest entry
function getCampTimerValue() {
  const latestValues = getLatestValues();
  const campTimerValue = latestValues['camp-timer'] || 0;
  
  // Convert time format (HH:MM) to minutes if it's a string
  if (typeof campTimerValue === 'string' && campTimerValue.includes(':')) {
    const [hours, minutes] = campTimerValue.split(':').map(Number);
    return (hours * 60) + minutes; // Return total minutes
  }
  
  return Number(campTimerValue) || 0;
}

// Calculate camp end date/time
function getCampEndDateTime() {
  const campTimerMinutes = getCampTimerValue();
  if (campTimerMinutes <= 0) return '';
  
  if (!props.track || !props.track.entries || props.track.entries.length === 0) {
    return '';
  }
  
  // Get the most recent entry
  const sortedEntries = [...props.track.entries].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Most recent first
  });
  
  const latestEntry = sortedEntries[0];
  const entryDate = new Date(latestEntry.date);
  
  // Add camp timer minutes to the entry date
  const campEndDate = new Date(entryDate.getTime() + (campTimerMinutes * 60 * 1000));
  
  // Format in local date/time format
  return campEndDate.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Methods
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format date for editing (DD.MM.YYYY HH:MM)
function formatDateForEditing(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Get localized date/time format based on user's locale
function getLocaleDateTimeFormat() {
  const locale = navigator.language || 'de-DE';
  
  // Common formats by locale
  const formats = {
    'de-DE': 'DD.MM.YYYY HH:MM',
    'de-AT': 'DD.MM.YYYY HH:MM',
    'de-CH': 'DD.MM.YYYY HH:MM',
    'en-US': 'MM/DD/YYYY HH:MM AM/PM',
    'en-GB': 'DD/MM/YYYY HH:MM',
    'en-CA': 'DD/MM/YYYY HH:MM',
    'fr-FR': 'DD/MM/YYYY HH:MM',
    'es-ES': 'DD/MM/YYYY HH:MM',
    'it-IT': 'DD/MM/YYYY HH:MM',
    'nl-NL': 'DD-MM-YYYY HH:MM',
    'sv-SE': 'YYYY-MM-DD HH:MM',
    'da-DK': 'DD-MM-YYYY HH:MM',
    'no-NO': 'DD.MM.YYYY HH:MM',
    'fi-FI': 'DD.MM.YYYY HH:MM'
  };
  
  return formats[locale] || formats['de-DE']; // Default to German format
}

// Format date/time for the user's locale when editing
function formatDateTimeForLocale(dateString) {
  const date = new Date(dateString);
  const locale = navigator.language || 'de-DE';
  
  console.log('formatDateTimeForLocale called with:', dateString, 'locale:', locale);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  // Format based on locale
  let result;
  switch (locale) {
    case 'en-US':
      // US format with 12-hour time and AM/PM
      const hours12 = date.getHours() % 12 || 12;
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
      const minutes = String(date.getMinutes()).padStart(2, '0');
      result = `${month}/${day}/${year} ${hours12}:${minutes} ${ampm}`;
      break;
    case 'en-GB':
    case 'en-CA':
    case 'fr-FR':
    case 'es-ES':
    case 'it-IT':
      // 24-hour format for other locales
      const hours24_1 = String(date.getHours()).padStart(2, '0');
      const minutes24_1 = String(date.getMinutes()).padStart(2, '0');
      result = `${day}/${month}/${year} ${hours24_1}:${minutes24_1}`;
      break;
    case 'nl-NL':
    case 'da-DK':
      const hours24_2 = String(date.getHours()).padStart(2, '0');
      const minutes24_2 = String(date.getMinutes()).padStart(2, '0');
      result = `${day}-${month}-${year} ${hours24_2}:${minutes24_2}`;
      break;
    case 'sv-SE':
      const hours24_3 = String(date.getHours()).padStart(2, '0');
      const minutes24_3 = String(date.getMinutes()).padStart(2, '0');
      result = `${year}-${month}-${day} ${hours24_3}:${minutes24_3}`;
      break;
    case 'de-DE':
    case 'de-AT':
    case 'de-CH':
    case 'no-NO':
    case 'fi-FI':
    default:
      const hours24_4 = String(date.getHours()).padStart(2, '0');
      const minutes24_4 = String(date.getMinutes()).padStart(2, '0');
      result = `${day}.${month}.${year} ${hours24_4}:${minutes24_4}`;
      break;
  }
  
  console.log('formatDateTimeForLocale result:', result);
  return result;
}

// Parse localized date/time input back to Date object
function parseLocalizedDateTime(inputValue) {
  if (!inputValue || typeof inputValue !== 'string') return null;
  
  const trimmedInput = inputValue.trim();
  if (!trimmedInput) return null;
  
  console.log('parseLocalizedDateTime - Processing:', trimmedInput);
  
  const locale = navigator.language || 'de-DE';
  console.log('parseLocalizedDateTime - Locale:', locale);
  
  // Try ISO format first (already valid Date format)
  if (trimmedInput.includes('T') || trimmedInput.match(/^\d{4}-\d{2}-\d{2}/)) {
    const isoDate = new Date(trimmedInput);
    if (!isNaN(isoDate.getTime())) {
      console.log('parseLocalizedDateTime - ISO format success:', isoDate);
      return isoDate;
    }
  }
  
  // Parse based on locale-specific patterns with multiple variations
  let regexPatterns = [];
  let dateOrder;
  
  switch (locale) {
    case 'en-US':
      // MM/DD/YYYY formats with various separators and 12-hour time
      regexPatterns = [
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})\s+(AM|PM)$/i, order: ['month', 'day', 'year', 'hour', 'minute', 'ampm'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})\s+(AM|PM)$/i, order: ['month', 'day', 'year', 'hour', 'minute', 'ampm'] },
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})\s+(AM|PM)$/i, order: ['month', 'day', 'year', 'hour', 'minute', 'ampm'] },
        // 24-hour variants
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['month', 'day', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'en-GB':
    case 'en-AU':
    case 'en-NZ':
    case 'en-ZA':
      // DD/MM/YYYY formats for British English and variants
      regexPatterns = [
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'en-CA':
      // Canadian format can be DD/MM/YYYY or MM/DD/YYYY, try both
      regexPatterns = [
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'fr-FR':
    case 'fr-BE':
    case 'fr-CH':
    case 'fr-CA':
      // French formats DD/MM/YYYY with various separators
      regexPatterns = [
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2})[h:](\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'es-ES':
    case 'es-MX':
    case 'es-AR':
    case 'es-CO':
      // Spanish formats DD/MM/YYYY
      regexPatterns = [
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'it-IT':
    case 'pt-PT':
    case 'pt-BR':
      // Italian and Portuguese formats DD/MM/YYYY
      regexPatterns = [
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'nl-NL':
    case 'nl-BE':
      // Dutch formats DD-MM-YYYY
      regexPatterns = [
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'da-DK':
    case 'nb-NO':
    case 'nn-NO':
      // Danish and Norwegian formats DD-MM-YYYY
      regexPatterns = [
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'sv-SE':
    case 'fi-FI':
      // Swedish and Finnish formats YYYY-MM-DD
      regexPatterns = [
        { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['year', 'month', 'day', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'pl-PL':
    case 'cs-CZ':
    case 'sk-SK':
      // Polish, Czech, Slovak formats DD.MM.YYYY
      regexPatterns = [
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'ru-RU':
      // Russian format DD.MM.YYYY
      regexPatterns = [
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'zh-CN':
    case 'zh-TW':
    case 'ja-JP':
    case 'ko-KR':
      // Asian formats YYYY/MM/DD or YYYY-MM-DD
      regexPatterns = [
        { regex: /^(\d{4})\/(\d{1,2})\/(\d{1,2})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['year', 'month', 'day', 'hour', 'minute'] },
        { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['year', 'month', 'day', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
    case 'de':
    case 'de-DE':
    case 'de-AT':
    case 'de-CH':
    case 'de-LU':
    default:
      // German formats DD.MM.YYYY with various separators
      regexPatterns = [
        { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] },
        { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})[,\s]+(\d{1,2}):(\d{2})$/i, order: ['day', 'month', 'year', 'hour', 'minute'] }
      ];
      break;
  }
  
  // Try each pattern until one matches
  for (const pattern of regexPatterns) {
    console.log('parseLocalizedDateTime - Trying regex:', pattern.regex);
    const match = trimmedInput.match(pattern.regex);
    console.log('parseLocalizedDateTime - Regex match:', match);
    
    if (match) {
      const [, first, second, third, hour, minute, ampm] = match;
      dateOrder = pattern.order;
      
      let day, month, year, hour24;
      if (dateOrder[0] === 'year') {
        year = parseInt(first);
        month = parseInt(second);
        day = parseInt(third);
      } else if (dateOrder[0] === 'month') {
        month = parseInt(first);
        day = parseInt(second);
        year = parseInt(third);
      } else {
        day = parseInt(first);
        month = parseInt(second);
        year = parseInt(third);
      }
      
      // Handle 12-hour to 24-hour conversion for formats with AM/PM
      if (ampm) {
        let hour12 = parseInt(hour);
        if (ampm.toUpperCase() === 'PM' && hour12 !== 12) {
          hour24 = hour12 + 12;
        } else if (ampm.toUpperCase() === 'AM' && hour12 === 12) {
          hour24 = 0;
        } else {
          hour24 = hour12;
        }
      } else {
        hour24 = parseInt(hour);
      }
      
      console.log('parseLocalizedDateTime - Parsed components:', { year, month, day, hour24, minute: parseInt(minute) });
      
      // Validate components before creating Date
      if (year < 2020 || year > 2050 || month < 1 || month > 12 || day < 1 || day > 31 || hour24 < 0 || hour24 > 23 || parseInt(minute) < 0 || parseInt(minute) > 59) {
        console.warn('parseLocalizedDateTime - Invalid date components for pattern:', pattern.regex);
        continue; // Try next pattern
      }
      
      const parsedDate = new Date(year, month - 1, day, hour24, parseInt(minute));
      console.log('parseLocalizedDateTime - Created date:', parsedDate);
      
      // Final validation
      if (isNaN(parsedDate.getTime()) || parsedDate.getFullYear() < 2020) {
        console.warn('parseLocalizedDateTime - Final validation failed for pattern:', pattern.regex);
        continue; // Try next pattern
      }
      
      console.log('parseLocalizedDateTime - Successfully parsed with pattern:', pattern.regex);
      return parsedDate;
    }
  }
  
  console.log('parseLocalizedDateTime - No pattern matched, returning null');
  return null;
}

function getTrackDuration() {
  if (!props.track) return 0;
  
  const startDate = new Date(props.track.startDate);
  const endDate = props.track.endDate ? new Date(props.track.endDate) : new Date();
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Calculate dynamic grid height based on number of entries
function getGridHeight() {
  if (!props.track || !props.track.entries) return 200; // Minimum height
  
  const entryCount = props.track.entries.length;
  const headerHeight = 80; // Header height from gridOptions
  const rowHeight = 40; // Row height from gridOptions
  const minHeight = 200; // Minimum grid height
  const maxHeight = 800; // Maximum grid height to prevent excessive scrolling
  
  // Calculate height: header + (number of rows * row height) + some padding
  const calculatedHeight = headerHeight + (entryCount * rowHeight) + 20;
  
  // Apply min/max constraints
  return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
}

// Progress calculation functions
function formatCellsProgress() {
  const latestValues = getLatestValues();
  const currentCells = latestValues.cells || 0;
  const goalCells = props.track?.targetGoals?.cellsGoal || 0;
  
  if (goalCells === 0) return '-';
  
  const difference = goalCells - currentCells;
  if (difference <= 0) {
    return '✓ Goal Reached!';
  } else {
    return `e${difference} missing`;
  }
}

function formatMpProgress() {
  const latestValues = getLatestValues();
  const currentMp = latestValues.mp || 0;
  const currentMpAccum = latestValues['mp-accum'] || 0;
  const goalMp = props.track?.targetGoals?.mpGoal || 0;
  
  if (goalMp === 0) return '-';
  
  // Use the higher value between MP and MP(Accum) as reference
  const referenceMp = Math.max(currentMp, currentMpAccum);
  const referenceType = currentMpAccum > currentMp ? 'MP(Accum)' : 'MP';
  
  const difference = goalMp - referenceMp;
  if (difference <= 0) {
    return `✓ Goal Reached!`;
  } else {
    return `e${difference} missing`;
  }
}

function formatRpProgress() {
  const latestValues = getLatestValues();
  const currentRp = latestValues.rp || 0;
  const goalRp = props.track?.targetGoals?.rpGoal || 0;
  
  if (goalRp === 0) return '-';
  
  const difference = goalRp - currentRp;
  if (difference <= 0) {
    return '✓ Goal Reached!';
  } else {
    return `e${difference} missing`;
  }
}

function formatM0Progress() {
  const latestValues = getLatestValues();
  const currentShards = latestValues.shards || 0;
  const goalM0 = props.track?.targetGoals?.m0Goal || 0;
  
  if (goalM0 === 0) return '-';
  
  // Calculate required shards for M0 goal
  const requiredShards = getM0Cost(goalM0);
  const difference = requiredShards - currentShards;
  
  if (difference <= 0) {
    return '✓ Goal Reached!';
  } else {
    return `e${difference} shards missing`;
  }
}

function formatOoProgress() {
  const latestValues = getLatestValues();
  const currentOo = latestValues['oo-accum'] || 0;
  const goalOo = props.track?.targetGoals?.ooGoal || 0;
  
  if (goalOo === 0) return '-';
  
  const difference = goalOo - currentOo;
  if (difference <= 0) {
    return '✓ Goal Reached!';
  } else {
    return `${formatNumber(difference)} missing`;
  }
}

// Time Drift Calculation
function getTimeDriftStats() {
  if (!props.track || !props.track.entries || props.track.entries.length < 2) {
    return { driftDescription: 'Not enough data' };
  }
  
  // Sort entries chronologically (oldest first)
  const sortedEntries = [...props.track.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Get first and last entry
  const firstEntry = sortedEntries[0];
  const lastEntry = sortedEntries[sortedEntries.length - 1];
  
  // Get hours-in-tr resource
  const hoursInTrResource = draggableResources.value.find(r => r.id === 'hours-in-tr');
  if (!hoursInTrResource) {
    return { driftDescription: 'Hours-in-TR not tracked' };
  }
  
  // Calculate real time difference in hours from first entry timestamp to last entry timestamp
  const realTimeStart = new Date(firstEntry.date);
  const realTimeEnd = new Date(lastEntry.date);
  const realTimeDiffMs = realTimeEnd - realTimeStart;
  const realTimeHours = realTimeDiffMs / (1000 * 60 * 60);
  
  // Get game time from first and last entry to calculate the DIFFERENCE
  const gameTimeStart = firstEntry.values?.['hours-in-tr'] || '0:00';
  const gameTimeEnd = lastEntry.values?.['hours-in-tr'] || '0:00';
  
  // Parse time format "HHH:MM" to total hours
  const parseTimeToHours = (timeStr) => {
    if (!timeStr || timeStr === '') return 0;
    const parts = String(timeStr).split(':');
    if (parts.length !== 2) return 0;
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return hours + (minutes / 60);
  };
  
  const gameHoursStart = parseTimeToHours(gameTimeStart);
  const gameHoursEnd = parseTimeToHours(gameTimeEnd);
  const gameTimeDiff = gameHoursEnd - gameHoursStart; // This is the actual game time that passed
  
  // Avoid division by zero
  if (realTimeHours <= 0 || gameTimeDiff <= 0) {
    return { driftDescription: 'Invalid time data' };
  }
  
  // Calculate total drift in hours (positive = lost game time, negative = gained game time)
  const totalDriftHours = realTimeHours - gameTimeDiff;
  
  // Calculate daily drift
  const trackDuration = getTrackDuration(); // Duration in days
  const dailyDriftHours = trackDuration > 0 ? totalDriftHours / trackDuration : 0;
  
  // Format drift description
  let driftDescription;
  if (Math.abs(totalDriftHours) < 0.1) {
    driftDescription = 'No drift';
  } else if (totalDriftHours > 0) {
    const totalHours = Math.floor(Math.abs(totalDriftHours));
    const totalMinutes = Math.round((Math.abs(totalDriftHours) - totalHours) * 60);
    const dailyHours = Math.floor(Math.abs(dailyDriftHours));
    const dailyMinutes = Math.round((Math.abs(dailyDriftHours) - dailyHours) * 60);
    
    let totalText = '';
    if (totalHours > 0 && totalMinutes > 0) {
      totalText = `${totalHours}h ${totalMinutes}m lost`;
    } else if (totalHours > 0) {
      totalText = `${totalHours}h lost`;
    } else {
      totalText = `${totalMinutes}m lost`;
    }
    
    driftDescription = `${totalText}`;
  } else {
    const totalHours = Math.floor(Math.abs(totalDriftHours));
    const totalMinutes = Math.round((Math.abs(totalDriftHours) - totalHours) * 60);
    const dailyHours = Math.floor(Math.abs(dailyDriftHours));
    const dailyMinutes = Math.round((Math.abs(dailyDriftHours) - dailyHours) * 60);
    
    let totalText = '';
    if (totalHours > 0 && totalMinutes > 0) {
      totalText = `${totalHours}h ${totalMinutes}m gained`;
    } else if (totalHours > 0) {
      totalText = `${totalHours}h gained`;
    } else {
      totalText = `${totalMinutes}m gained`;
    }
    
    driftDescription = `${totalText}`;
  }
  
  return { 
    driftDescription,
    totalDriftHours: totalDriftHours.toFixed(1),
    dailyDriftHours: dailyDriftHours.toFixed(1),
    realTimeHours: realTimeHours.toFixed(1),
    gameTimeHours: gameTimeDiff.toFixed(1)
  };
}

function getDaysDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d1 - d2);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getEntryChange(currentEntry, previousEntry, resourceId) {
  if (!previousEntry) return 0;
  
  const currentValue = currentEntry.values[resourceId] || 0;
  const previousValue = previousEntry.values[resourceId] || 0;
  
  return currentValue - previousValue;
}

// New methods for inline editing
function addNewEntry() {
  const now = new Date();
  const dateTimeISO = now.toISOString(); // Full ISO timestamp
  
  // Create the entry data for immediate saving
  const entryToSave = {
    date: dateTimeISO,
    values: {},
    notes: ''
  };
  
  // Initialize values for all resources to 0
  draggableResources.value.forEach(resource => {
    entryToSave.values[resource.id] = 0;
  });
  
  // Immediately save the entry to the store
  emit('update', {
    action: 'addEntry',
    trackId: props.track.id,
    entry: entryToSave
  });
}

function saveNewEntry() {
  // With AG Grid, entries are automatically saved through onCellValueChanged
  // This function is now mainly for compatibility
  return;
}

function cancelNewEntry() {
  // Remove any temporary entries from the grid
  if (gridApi.value) {
    const allRowData = [];
    gridApi.value.forEachNode(node => {
      if (!node.data.id?.toString().startsWith('temp_')) {
        allRowData.push(node.data);
      }
    });
    gridApi.value.setRowData(allRowData);
  }
  newEntry.value = null;
}

function confirmNewEntry(entryId) {
  // Find the entry in the grid
  let entryToSave = null;
  const rowNode = gridApi.value.getRowNode(entryId);
  
  if (rowNode && rowNode.data.isNew && rowNode.data.isEditing) {
    entryToSave = { ...rowNode.data };
    // Clean up temporary flags
    delete entryToSave.isEditing;
    delete entryToSave.isNew;
    
    // Stop editing mode first
    gridApi.value.stopEditing();
    
    // Remove the temporary entry from grid
    gridApi.value.applyTransaction({ 
      remove: [rowNode.data] 
    });
    
    // Save the entry properly
    saveEntry(entryToSave);
  }
}

function cancelEntryEdit(entryId) {
  // Stop editing mode first
  if (gridApi.value) {
    gridApi.value.stopEditing();
    
    // Find and remove the row with the specific entryId
    const rowNode = gridApi.value.getRowNode(entryId);
    if (rowNode) {
      gridApi.value.applyTransaction({ 
        remove: [rowNode.data] 
      });
    } else {
      // Fallback: remove all temp entries
      const tempEntries = [];
      gridApi.value.forEachNode(node => {
        if (node.data.id && node.data.id.toString().startsWith('temp_')) {
          tempEntries.push(node.data);
        }
      });
      if (tempEntries.length > 0) {
        gridApi.value.applyTransaction({ 
          remove: tempEntries 
        });
      }
    }
  }
}

function saveEntry(entry) {
  // For new entries (with temp_ ID), create a proper entry
  if (entry.id?.toString().startsWith('temp_')) {
    // Generate a proper entry for saving
    const entryToSave = {
      date: entry.date,
      values: { ...entry.values },
      notes: entry.notes || ''
    };
    
    // Add hoursInTR to values if it exists
    if (entry.hoursInTR !== undefined && entry.hoursInTR !== null) {
      entryToSave.values['hours-in-tr'] = entry.hoursInTR;
    }
    
    // Emit event to parent to add the entry
    emit('update', {
      action: 'addEntry',
      trackId: props.track.id,
      entry: entryToSave
    });
  } else {
    // Update existing entry
    const entryToSave = {
      id: entry.id,
      date: entry.date,
      values: { ...entry.values },
      notes: entry.notes || ''
    };
    
    // Add hoursInTR to values if it exists
    if (entry.hoursInTR !== undefined && entry.hoursInTR !== null) {
      entryToSave.values['hours-in-tr'] = entry.hoursInTR;
    }
    
    // Emit event to parent to update the entry
    emit('update', {
      action: 'updateEntry',
      trackId: props.track.id,
      entry: entryToSave
    });
  }
}

// AG Grid event handlers
function onGridReady(params) {
  gridApi.value = params.api;
  
  // Auto-size columns to prevent overlap and optimize layout
  setTimeout(() => {
    // Auto-size timestamp column based on content
    const timestampColumn = gridApi.value.getColumns().find(col => 
      col.getColId() === 'date'
    );
    
    if (timestampColumn) {
      gridApi.value.autoSizeColumns([timestampColumn.getColId()], false);
    }
    
    // Auto-size notes column based on content
    const notesColumn = gridApi.value.getColumns().find(col => 
      col.getColId().includes('resource_notes')
    );
    
    if (notesColumn) {
      gridApi.value.autoSizeColumns([notesColumn.getColId()], false);
    }
    
    // Auto-size all columns once to get proper initial layout
    const allColumnIds = [];
    gridApi.value.getColumnDefs().forEach(colDef => {
      allColumnIds.push(colDef.field);
    });
    gridApi.value.autoSizeColumns(allColumnIds, false); // Don't skip header when calculating size
  }, 100);
  
  // Make functions globally available for cell renderer
  window.deleteEntryFromGrid = (entryId) => {
    const entry = props.track.entries.find(e => e.id === entryId);
    if (entry) {
      deleteEntry(entry);
    }
  };
  
  window.confirmNewEntryFromGrid = (entryId) => {
    confirmNewEntry(entryId);
  };
  
  window.cancelEntryEditFromGrid = (entryId) => {
    cancelEntryEdit(entryId);
  };
}

// Speichere Wert auch beim Verlassen der Zelle (z.B. Klick daneben)
function onCellEditingStopped(event) {
  // Für neue Einträge: nicht automatisch speichern, nur Wert übernehmen
  if (event.data.isNew && event.data.isEditing) {
    return;
  }
  // Für bestehende Einträge: wie onCellValueChanged behandeln
  const entry = event.data;
  saveEntry(entry);
  
  // If date column was changed, refresh all difference calculations since chronological order might have changed
  if (event.column.getColId() === 'date') {
    setTimeout(() => {
      // Refresh all cells that show differences to recalculate based on new chronological order
      const columnsToRefresh = [];
      const showDifferenceFor = ['cells', 'mp', 'mp-accum', 'shards', 'rp', 'ap', 'oo-accum'];
      
      showDifferenceFor.forEach(resourceId => {
        columnsToRefresh.push(`resource_${resourceId}`);
      });
      
      if (columnsToRefresh.length > 0) {
        gridApi.value.refreshCells({
          columns: columnsToRefresh,
          force: true
        });
      }
    }, 100);
  } else {
    // Update difference values in chronologically next entries for resource changes
    updateDifferenceValues(event);
  }
}

function onColumnMoved(event) {
  // Only process if it's actually finished moving
  if (!event.finished) return;
  
  console.log('Column moved event:', event);
  console.log('Event details - column:', event.column.getColId(), 'toIndex:', event.toIndex);
  
  // Get the column order using getAllDisplayedColumns which respects the visual order
  const newOrder = [];
  const displayedColumns = gridApi.value.getAllDisplayedColumns();
  
  console.log('All displayed columns:', displayedColumns.map(col => col.getColId()));
  
  displayedColumns.forEach(col => {
    const colId = col.getColId();
    if (colId.startsWith('resource_')) {
      const resourceId = colId.replace('resource_', '');
      newOrder.push(resourceId);
    }
  });

  console.log('New order from displayed columns:', newOrder);

  // Update the resourceOrder state - but don't rebuild column definitions
  if (newOrder.length > 0) {
    resourceOrder.value = newOrder;
    
    // Save the order to localStorage
    saveColumnOrderToLocalStorage(newOrder);
    
    // Save the order to the store if track has an ID
    if (props.track?.id) {
      trTrackingStore.updateResourceOrder(props.track.id, newOrder);
    }
    
    // Also emit to parent for backward compatibility
    emit('update', {
      action: 'updateResourceOrder',
      trackId: props.track?.id,
      resourceOrder: newOrder
    });
  }
}

function onCellValueChanged(event) {
  // Don't auto-save for new entries being edited - only save when user confirms
  if (event.data.isNew && event.data.isEditing) {
    // Just update the cell value, don't save the entire entry yet
    return;
  }
  
  // Auto-save for existing entries
  const entry = event.data;
  saveEntry(entry);
  
  // If notes column was changed, auto-resize it to fit content
  if (event.column.getColId().includes('resource_notes')) {
    setTimeout(() => {
      gridApi.value.autoSizeColumns([event.column.getColId()], false);
    }, 50);
  }
  
  // If date column was changed, refresh all difference calculations since chronological order might have changed
  if (event.column.getColId() === 'date') {
    setTimeout(() => {
      // Refresh all cells that show differences to recalculate based on new chronological order
      const columnsToRefresh = [];
      const showDifferenceFor = ['cells', 'mp', 'mp-accum', 'shards', 'rp', 'ap', 'oo-accum'];
      
      showDifferenceFor.forEach(resourceId => {
        columnsToRefresh.push(`resource_${resourceId}`);
      });
      
      if (columnsToRefresh.length > 0) {
        gridApi.value.refreshCells({
          columns: columnsToRefresh,
          force: true
        });
      }
    }, 100);
  } else {
    // Update difference values in chronologically next entries for resource changes
    updateDifferenceValues(event);
  }
}

// Function to update difference values when a cell value changes
function updateDifferenceValues(event) {
  const changedResourceId = event.column.getColId().replace('resource_', '');
  
  // Only update differences for resources that show differences
  const showDifferenceFor = ['cells', 'mp', 'mp-accum', 'shards', 'rp', 'ap', 'oo-accum'];
  if (!showDifferenceFor.includes(changedResourceId)) {
    return;
  }
  
  // Get all entries sorted chronologically
  const allEntries = [];
  gridApi.value.forEachNode(node => {
    // Skip temporary entries
    if (!node.data.id?.toString().startsWith('temp_')) {
      allEntries.push(node.data);
    }
  });
  
  // Sort chronologically (oldest first) by date
  const chronologicalEntries = allEntries.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB; // Oldest first
  });
  
  // Find the changed entry
  const changedEntryId = event.data.id;
  const changedIndex = chronologicalEntries.findIndex(entry => entry.id === changedEntryId);
  
  if (changedIndex === -1) return;
  
  // Update all entries that come after the changed entry chronologically
  for (let i = changedIndex + 1; i < chronologicalEntries.length; i++) {
    const entryToUpdate = chronologicalEntries[i];
    const rowNode = gridApi.value.getRowNode(entryToUpdate.id);
    
    if (rowNode) {
      // Force re-render of the affected cell by refreshing it
      gridApi.value.refreshCells({
        rowNodes: [rowNode],
        columns: [event.column.getColId()],
        force: true
      });
    }
  }
}

function handleModalClick(event) {
  // Don't close if clicking inside the modal content
  const modalContent = document.querySelector('.bg-gray-800.rounded-xl');
  if (modalContent && modalContent.contains(event.target)) {
    return;
  }
  
  // Only close if the click was directly on the backdrop
  if (event.target === event.currentTarget) {
    closeModalDirect();
  }
}

function formatDateForInput(dateString) {
  return dateString.split('T')[0];
}

function deleteEntry(entry) {
  showDialog({
    title: 'Delete Entry',
    message: 'Are you sure you want to delete this entry? This action cannot be undone.',
    type: 'error',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      // Emit event to parent to handle deletion
      emit('update', {
        action: 'deleteEntry',
        trackId: props.track.id,
        entryId: entry.id
      });
    }
  });
}

function completeTR() {
  // Set currentTrackForModal to the props.track data - EXACTLY like TRTracking.vue does
  currentTrackForModal.value = props.track;
  
  // Open NewTRModal in edit mode with auto-complete enabled
  newTRModalEditMode.value = true;
  newTRModalCompleteMode.value = true; // This will auto-set status to completed
  showNewTRModal.value = true;
}

function closeNewTRModal() {
  showNewTRModal.value = false;
  newTRModalCompleteMode.value = false; // Reset complete mode
  currentTrackForModal.value = null; // Clear the reactive reference
}

function handleNewTRModalSave(trackData) {
  if (props.track && trackData) {
    console.log('handleNewTRModalSave - Track data:', trackData);
    
    // Update the track with all the new data from NewTRModal
    trTrackingStore.updateTRTrackSettings(props.track.id, {
      name: trackData.name,
      trCount: trackData.trCount,
      isActive: trackData.isActive,
      startDate: trackData.startDate,
      endDate: trackData.endDate, // This will be set if track is completed
      initialValues: trackData.initialValues,
      targetGoals: trackData.targetGoals,
      notes: trackData.notes
    });
    
    // Emit update with proper action structure
    emit('update', {
      action: trackData.isActive ? 'update' : 'complete',
      trackId: props.track.id
    });
    
    showNewTRModal.value = false;
  }
}

function deleteTRTrack() {
  showDialog({
    title: 'Delete TR Track',
    message: `Are you sure you want to delete "${props.track.name}"? This action cannot be undone.`,
    type: 'error',
    confirmText: 'Yes, Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      emit('update', {
        action: 'delete',
        trackId: props.track.id
      });
    }
  });
}

function exportToCsv() {
  if (!props.track || props.track.entries.length === 0) return;
  
  // Create CSV header - include Hours in TR
  const headers = ['Date', 'Hours in TR', ...draggableResources.value.map(r => r.name), 'Notes'];
  
  // Create CSV rows
  const rows = sortedEntries.value.map(entry => [
    entry.date,
    entry.hoursInTR || '',
    ...draggableResources.value.map(r => entry.values[r.id] || 0),
    entry.notes || ''
  ]);
  
  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${props.track.name}_export.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function shareTrack() {
  try {
    const shareCode = exportTrack(props.track);
    
    // Try to copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareCode);
      
      showDialog({
        title: 'Track Shared!',
        message: `Share code has been copied to your clipboard!\n\nCode: ${shareCode}\n\nOther users can import this track using the Import/Export feature.`,
        type: 'info',
        showCancel: false,
        confirmText: 'OK'
      });
    } else {
      // Fallback: show the code in a dialog
      showDialog({
        title: 'Share Code',
        message: `Copy this code to share your track:\n\n${shareCode}\n\nOther users can import this track using the Import/Export feature.`,
        type: 'info',
        showCancel: false,
        confirmText: 'OK'
      });
    }
  } catch (error) {
    showDialog({
      title: 'Share Failed',
      message: 'Failed to generate share code: ' + error.message,
      type: 'error',
      showCancel: false,
      confirmText: 'OK'
    });
  }
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

/* Custom input styling for inline editing */
input:focus {
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
}

/* Remove browser arrows/spinners from number inputs */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Fix AG Grid input fields to fill entire cell */
:deep(.ag-grid-container) .ag-cell-inline-editing {
  padding: 0 !important;
}

:deep(.ag-grid-container) .ag-cell-edit-wrapper {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
}

:deep(.ag-grid-container) .ag-cell-editor {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  box-sizing: border-box !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

:deep(.ag-grid-container) .ag-text-field,
:deep(.ag-grid-container) .ag-input-field {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
  background: transparent !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

:deep(.ag-grid-container) .ag-input-wrapper,
:deep(.ag-grid-container) .ag-text-field-input-wrapper {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

/* The actual input element */
:deep(.ag-grid-container) .ag-input-field-input,
:deep(.ag-grid-container) .ag-text-field-input {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  padding: 8px !important;
  margin: 0 !important;
  font-size: 14px !important;
  color: white !important;
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

/* Focus styles */
:deep(.ag-grid-container) .ag-input-field-input:focus,
:deep(.ag-grid-container) .ag-text-field-input:focus {
  border: none !important;
  outline: none !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) inset !important;
  background: rgba(59, 130, 246, 0.1) !important;
}

/* Hide the label */
:deep(.ag-grid-container) .ag-input-field-label {
  display: none !important;
}

/* -------------------------
   AG Grid Grund-Layout
   ------------------------- */
:deep(.ag-grid-container) {
  width: 100%;
  height: 400px; /* oder deine gewünschte Höhe */
}

/* Damit AG Grid intern die Wrapper richtig setzt */
:deep(.ag-grid-container) .ag-root-wrapper,
:deep(.ag-grid-container) .ag-root {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Den Body-Viewport scrollen lassen */
:deep(.ag-grid-container) .ag-body-horizontal-scroll-viewport,
:deep(.ag-grid-container) .ag-center-cols-viewport {
  overflow: auto !important;
  flex: 1 1 auto !important;
}

/* Sticky Header nur auf die Header-Leiste */
:deep(.ag-grid-container) .ag-header {
  position: sticky !important;
  top: 0 !important;
  z-index: 2 !important;
  background: rgba(31, 41, 55, 1) !important;
}

/* -------------------------
   Responsive Scroll-Verhalten
   ------------------------- */
/* Desktop: Nur mittlere Spalten scrollen */
@media (min-width: 1024px) {
  :deep(.ag-grid-container) .ag-pinned-left-cols-container,
  :deep(.ag-grid-container) .ag-pinned-right-cols-container {
    position: sticky !important;
    z-index: 10 !important;
  }
  
  :deep(.ag-grid-container) .ag-pinned-left-cols-container {
    left: 0 !important;
    background: rgba(31, 41, 55, 1) !important;
  }
  
  :deep(.ag-grid-container) .ag-pinned-right-cols-container {
    right: 0 !important;
    background: rgba(31, 41, 55, 1) !important;
  }
}

/* Mobile: Alles scrollbar, kein Pinning */
@media (max-width: 1023px) {
  :deep(.ag-grid-container) .ag-pinned-left-cols-container,
  :deep(.ag-grid-container) .ag-pinned-right-cols-container {
    position: static !important;
  }
}

/* -------------------------
   Feinschliff: Rahmen & Label
   ------------------------- */
/* 1) Border im App-Stil - passend zu den anderen Komponenten */
:deep(.ag-grid-container) .ag-cell {
  border-right: 1px solid rgba(75, 85, 99, 0.3) !important;
  border-bottom: 1px solid rgba(75, 85, 99, 0.3) !important;
}

:deep(.ag-grid-container) .ag-header-cell {
  border-right: 1px solid rgba(75, 85, 99, 0.5) !important;
  border-bottom: 1px solid rgba(75, 85, 99, 0.6) !important;
}

/* Äußerer Rahmen um die gesamte Tabelle */
:deep(.ag-grid-container) .ag-root-wrapper {
  border: 1px solid rgba(75, 85, 99, 0.4) !important;
  border-radius: 6px !important;
  overflow: hidden !important;
}

/* 2) Resize-Griffe komplett ausblenden */
:deep(.ag-grid-container) .ag-header-cell-resize,
:deep(.ag-grid-container) .ag-header-cell-resize-handle {
  display: none !important;
}

/* 3) Header-Label stets zentriert und mehrzeilig */
:deep(.ag-grid-container) .ag-header-cell .ag-header-cell-label {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 4px !important;
  height: 100% !important;
  text-align: center !important;
  line-height: 1.2 !important;
  white-space: pre-line !important;
  word-wrap: break-word !important;
}

/* Enable line breaks in header labels */
:deep(.ag-grid-container) .ag-header-cell-text {
  text-align: center !important;
  line-height: 1.2 !important;
  white-space: pre-line !important;
  word-wrap: break-word !important;
}

/* Multi-line header styling */
:deep(.ag-grid-container) .multi-line-header .ag-header-cell-text {
  font-size: 12px !important;
}

/* Force proper text wrapping in headers */
:deep(.ag-grid-container) .ag-header-cell-label .ag-header-cell-text {
  display: block !important;
  width: 100% !important;
  white-space: pre-line !important;
}

/* Nur Trennlinie zwischen Center-Spalten, nicht am Rand vor den pinned columns */
:deep(.ag-center-cols-viewport) .ag-row .ag-cell:not(:last-child) {
  border-right: 1px solid rgba(75, 85, 99, 0.3) !important;
}

/* Entferne die Border am rechten Rand der Center‑Viewport‑Box */
:deep(.ag-grid-container) .ag-center-cols-viewport {
  border-right: none !important;
}

/* Center‑Viewport nimmt kein extra Padding für pinned columns mehr */
:deep(.ag-center-cols-viewport) {
  padding-right: 0 !important;
}

/* Und auch die body‑Viewport‑Box selbst */
:deep(.ag-body-horizontal-scroll-viewport) {
  margin-right: 0 !important;
}

/* AG Grid Grip Icon fett und mit Hover-Effekt */
:deep(.ag-header-cell-label .ag-grip-icon) {
  font-weight: bold;
  font-size: 18px;
  display: block;
  text-align: center;
  transition: color 0.2s;
  color: #b5b5b5;
  cursor: grab;
}
:deep(.ag-header-cell-label:hover .ag-grip-icon) {
  color: #38bdf8;
}

/* Header Hover-Effekt für alle Header-Zellen */
:deep(.ag-grid-container) .ag-header-cell {
  transition: background-color 0.2s ease;
}
:deep(.ag-grid-container) .ag-header-cell:hover {
  background-color: rgba(55, 65, 81, 0.6) !important;
}

/* Spezieller Hover-Effekt für drag-header Spalten */
:deep(.ag-grid-container) .ag-header-cell.drag-header:hover {
  background-color: rgba(59, 130, 246, 0.1) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
}
</style>
<style scoped>
/* Nur das Grip-Symbol (erste Zeile) fett, Label normal */
:deep(.ag-grid-container) .ag-header-cell.drag-header .ag-header-cell-text {
  white-space: pre-line;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 4px 2px;
}
:deep(.ag-grid-container) .ag-header-cell.drag-header .ag-header-cell-text:first-line {
  font-weight: bold;
  font-size: 1.3em;
  color: #e0e0e0;
  margin-top: 0;
}

/* Custom Drag Header Component Styling */
.drag-header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4px;
  text-align: center;
}

.drag-icon {
  color: #e0e0e0;
  margin-bottom: 4px;
  transition: color 0.2s;
  cursor: grab;
}

.drag-header-container:hover .drag-icon {
  color: #60a5fa;
}

.drag-label {
  font-size: 12px;
  line-height: 1.2;
  white-space: pre-line;
  color: inherit;
}
</style>
