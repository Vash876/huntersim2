<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click="handleModalClick"
  >
    <div 
      ref="modalContent"
      class="bg-gray-800 rounded-xl shadow-2xl w-[95%] max-h-[95vh] overflow-y-auto animate-fade-in border border-gray-700"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div v-if="track">
          <h3 class="text-base font-bold text-white flex items-center">
            <IconChartLine size="16" class="mr-2 text-green-400" />
            {{ track.name }}
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="16" />
        </button>
      </div>

      <!-- Description -->
      <div class="px-3 py-2 border-b border-gray-700" v-if="track">
        <p class="text-xs text-gray-300">
          Started: {{ formatDate(track.startDate) }} • 
          {{ track.entries.length }} entries • 
          {{ track.isActive ? 'Active' : 'Completed' }}
        </p>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3" v-if="track">
        <!-- Track Stats Overview -->
        <div>
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-blue-200">Track Statistics & Goals</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
            <!-- Duration -->
            <div class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">Duration</div>
              <div class="text-sm font-semibold text-white">
                {{ getTrackDuration() }} days
              </div>
            </div>
            
            <!-- Total Entries -->
            <div class="bg-gray-700/30 rounded-md p-2">
              <div class="text-xs text-gray-400">Total Entries</div>
              <div class="text-sm font-semibold text-white">
                {{ track.entries.length }}
              </div>
            </div>

            <!-- Goals Progress -->
            <div v-if="track.targetGoals" class="md:col-span-2 lg:col-span-4">
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
          </div>
        </div>



        <!-- All Entries Table -->
        <div>
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
              <button
                @click="shareTrack"
                class="text-xs bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded-md transition-colors"
              >
                Share Track
              </button>
            </div>
          </div>
          
          <!-- AG Grid übernimmt selbst den Scroll -->
          <div class="ag-grid-container" style="width:100%; height:400px;" @click.stop>
            <ag-grid-vue
              style="height: 100%; width: 100%;"
              :columnDefs="columnDefs"
              :rowData="gridRowData"
              :defaultColDef="defaultColDef"
              :gridOptions="gridOptions"
              @grid-ready="onGridReady"
              @column-moved="onColumnMoved"
              @cell-value-changed="onCellValueChanged"
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
            class="px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition-colors text-xs"
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
          @click="$emit('close')"
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
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { IconX, IconDatabase, IconTrash, IconChartLine, IconPlus, IconGripVertical, IconCheck, IconEdit, IconShare } from '@tabler/icons-vue';
import { AgGridVue } from 'ag-grid-vue3';
import { ModuleRegistry, AllCommunityModule, themeQuartz, colorSchemeDark } from 'ag-grid-community';
import AlertDialog from '@/components/common/AlertDialog.vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import { exportTrack } from '@/utils/trImportExport';
import { getM0Cost } from '@/constants/m0Costs';
import { formatNumber, formatSuffixInput, parseSuffixInput } from '@/composables/format.js';

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
  stopEditingWhenCellsLoseFocus: false, // Don't stop editing when cells lose focus for new entries
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 20,
  domLayout: 'normal', // Enable horizontal scrolling
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
      width: isMobile ? 100 : 160,
      cellRenderer: (params) => {
        // Responsive Datum-Formatierung
        const date = new Date(params.value);
        const currentIsMobile = window.innerWidth <= 1023;

        return formatDate(params.value);
      },
      editable: false,
      suppressMovable: true,
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
      headerName: resource.name.replace(/ /g, '\n'), // Add line breaks after spaces for multi-line headers
      field: `resource_${resource.id}`,
      width: columnWidth,
      flex: flexValue, // Only Notes gets flex for expansion
      cellClass: 'text-center',
      headerClass: 'text-center resource-header multi-line-header',
      editable: true, // Always editable
      cellDataType: resource.id === 'notes' ? 'text' : (resource.id === 'oo-accum' ? 'text' : 'number'),
      suppressMovable: false, // Allow these columns to be moved
      suppressSizeToFit: resource.id === 'notes' ? false : false, // Allow auto-sizing for all columns
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
        
        // Special handling for oo-accum to support suffix input
        if (resource.id === 'oo-accum') {
          const parsedValue = parseSuffixInput(params.newValue);
          params.data.values[resource.id] = parsedValue;
          return true;
        }
        
        params.data.values[resource.id] = parseFloat(params.newValue) || 0;
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
        
        // Special display for oo-accum - always format with suffix notation
        if (resource.id === 'oo-accum') {
          const displayValue = formatSuffixInput(currentValue);
          
          if (!shouldShowDifference || !isWholeNumber) {
            return displayValue;
          }
          
          // Calculate difference for oo-accum
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
          
          const diffText = difference > 0 ? `+${formatSuffixInput(difference)}` : `-${formatSuffixInput(Math.abs(difference))}`;
          
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
        // For new entries being edited, allow tab navigation between cells without saving
        if (params.data.isNew && params.data.isEditing) {
          if (params.event.key === 'Tab') {
            // Stop current cell editing
            gridApi.value.stopEditing();
            
            // Find editable columns
            const editableColumns = columnDefs.value.filter(col => 
              col.editable && col.field.startsWith('resource_')
            );
            const currentIndex = editableColumns.findIndex(col => col.field === params.column.colId);
            
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
            
            // Start editing the next/previous cell
            setTimeout(() => {
              gridApi.value.startEditingCell({
                rowIndex: 0,
                colKey: nextColumn.field
              });
              gridApi.value.setFocusedCell(0, nextColumn.field);
              
              // Focus the input
              setTimeout(() => {
                const nextInput = document.querySelector(`[row-index="0"][col-id="${nextColumn.field}"] .ag-cell-edit-input`);
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
      cellEditorParams: {
        selectAllOnFocusIn: true
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

// LocalStorage functions for column order
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

function getTrackDuration() {
  if (!props.track) return 0;
  
  const startDate = new Date(props.track.startDate);
  const endDate = props.track.endDate ? new Date(props.track.endDate) : new Date();
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get latest entry values
function getLatestValues() {
  if (!props.track || !props.track.entries || props.track.entries.length === 0) {
    return {};
  }
  
  // Sort entries by date and get the latest one
  const sortedEntries = [...props.track.entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  return sortedEntries[0].values || {};
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
    return `${difference} missing`;
  }
}

function formatMpProgress() {
  const latestValues = getLatestValues();
  const currentMp = latestValues.mp || 0;
  const goalMp = props.track?.targetGoals?.mpGoal || 0;
  
  if (goalMp === 0) return '-';
  
  const difference = goalMp - currentMp;
  if (difference <= 0) {
    return '✓ Goal Reached!';
  } else {
    return `${difference} missing`;
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
    return `${difference} missing`;
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
    return `${difference} shards missing`;
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
  
  const newEntryData = {
    id: 'temp_' + Date.now(),
    date: dateTimeISO,
    values: {},
    notes: '',
    isNew: true,
    isEditing: true // Flag to indicate this entry is being edited
  };
  
  // Initialize values for all resources
  draggableResources.value.forEach(resource => {
    newEntryData.values[resource.id] = 0;
  });
  
  // Add the new entry to the grid
  if (gridApi.value) {
    gridApi.value.applyTransaction({ add: [newEntryData], addIndex: 0 });
    
    // Start editing only the first resource column, keep focus there
    nextTick(() => {
      setTimeout(() => {
        // Get the first resource column
        const firstResourceColumn = columnDefs.value.find(col => col.field.startsWith('resource_'));
        if (firstResourceColumn) {
          // Only start editing the first cell - don't edit all cells simultaneously
          gridApi.value.startEditingCell({
            rowIndex: 0,
            colKey: firstResourceColumn.field
          });
          
          // Set focus explicitly to the first cell
          gridApi.value.setFocusedCell(0, firstResourceColumn.field);
          
          // Focus the actual input element after a short delay
          setTimeout(() => {
            const firstInput = document.querySelector(`[row-index="0"][col-id="${firstResourceColumn.field}"] .ag-cell-edit-input`);
            if (firstInput) {
              firstInput.focus();
              firstInput.select();
            }
          }, 100);
        }
      }, 150);
    });
  }
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
  // Notes column should auto-size based on content, others keep fixed sizes
  setTimeout(() => {
    const notesColumn = gridApi.value.getColumns().find(col => 
      col.getColId().includes('resource_notes')
    );
    
    if (notesColumn) {
      // Auto-size only the notes column based on content
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
}

function handleModalClick(event) {
  // Don't close if clicking inside the modal content
  const modalContent = document.querySelector('.bg-gray-800.rounded-xl');
  if (modalContent && modalContent.contains(event.target)) {
    return;
  }
  
  // Only close if the click was directly on the backdrop
  if (event.target === event.currentTarget) {
    emit('close');
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
  showDialog({
    title: 'Complete TR Track',
    message: 'Mark this TR as completed? You can still view the data but no longer add entries.',
    type: 'warning',
    confirmText: 'Yes, Complete',
    cancelText: 'Cancel',
    onConfirm: () => {
      emit('update', {
        action: 'complete',
        trackId: props.track.id
      });
    }
  });
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

</style>
