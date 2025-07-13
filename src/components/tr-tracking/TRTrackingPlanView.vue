<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="closeModal"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-[95vw] max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-green-400">{{ plan.name }}</span>
            <span class="text-gray-300"> - Tracking Data</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="refreshData" 
              :disabled="isLoading"
              class="px-2 py-1 sm:px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-xs sm:text-sm text-white rounded-md flex items-center gap-1"
            >
              <IconRefresh size="14" :class="{ 'animate-spin': isLoading }" />
              Refresh
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
            Track your daily progress for TR #{{ plan.resetNumber }}. Enter new values and submit to add an entry.
          </p>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="isLoading || isLoadingNewPlan || !sheetData" class="p-6 flex flex-col items-center justify-center">
        <div class="text-center">
          <div class="relative inline-block">
            <!-- Main Spinner -->
            <div class="w-16 h-16 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mb-4"></div>
            
            <!-- Inner Pulse -->
            <div class="absolute inset-0 w-16 h-16 border-2 border-green-500/30 rounded-full animate-pulse"></div>
          </div>
          
          <p class="text-gray-400 text-sm text-center">
            {{ isLoadingNewPlan ? 'Loading plan data...' : 'Loading tracking data...' }}
          </p>
          
          <!-- Plan Name Indication -->
          <p class="text-gray-500 text-xs mt-2">TR #{{ plan.resetNumber }}</p>
          
          <!-- Progress Dots -->
          <div class="flex justify-center mt-4 space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay:0.1s"></div>
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay:0.2s"></div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ error }}</p>
        <button 
          @click="refreshData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Try Again
        </button>
      </div>

      <!-- Content -->
      <div v-else-if="sheetData && sheetData.headers" class="p-3">
        <!-- Quick Stats Section -->
        <div class="mb-4">
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">Current Progress</h3>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div class="bg-gray-850 rounded-md p-2 text-center">
              <div class="text-lg font-bold text-green-400">{{ getLatestValue('cells') }}</div>
              <div class="text-xs text-gray-400">Cells</div>
            </div>
            <div class="bg-gray-850 rounded-md p-2 text-center">
              <div class="text-lg font-bold text-red-400">{{ getLatestValue('mp') }}</div>
              <div class="text-xs text-gray-400">MP</div>
            </div>
            <div class="bg-gray-850 rounded-md p-2 text-center">
              <div class="text-lg font-bold text-cyan-400">{{ getLatestValue('shards') }}</div>
              <div class="text-xs text-gray-400">Shards</div>
            </div>
            <div class="bg-gray-850 rounded-md p-2 text-center">
              <div class="text-lg font-bold text-orange-400">{{ getLatestValue('rp') }}</div>
              <div class="text-xs text-gray-400">RP</div>
            </div>
          </div>
        </div>

        <!-- New Entry Form Section -->
        <div class="mb-4">
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-green-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-green-200">Add New Entry</h3>
            <span class="ml-2 text-xs text-gray-400">Day {{ (plan.daysActive || 0) + 1 }}</span>
          </div>
          
          <!-- Input Form -->
          <div class="bg-gray-850 rounded-lg p-3 border border-gray-700">
            <div class="grid gap-2" :style="{ gridTemplateColumns: `repeat(${inputResources.length + 1}, minmax(0, 1fr))` }">
              <!-- Header Row -->
              <template v-for="(resource, index) in inputResources" :key="'header-' + index">
                <div class="text-xs font-medium text-gray-300 text-center py-1">
                  {{ resource.displayName }}
                </div>
              </template>
              <div class="text-xs font-medium text-gray-300 text-center py-1">Action</div>
              
              <!-- Input Row -->
              <template v-for="(resource, index) in inputResources" :key="'input-' + index">
                <div class="flex justify-center">
                  <input
                    v-model="newEntryForm[resource.key]"
                    :type="resource.inputType"
                    :step="resource.step"
                    :placeholder="resource.placeholder"
                    class="w-full max-w-[100px] px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs text-center placeholder-gray-400 focus:outline-none focus:ring-1"
                    :class="resource.colorClass"
                  />
                </div>
              </template>
              
              <!-- Submit Button -->
              <div class="flex justify-center">
                <button
                  @click="submitNewEntry"
                  :disabled="isSubmitting || !hasEntryData"
                  class="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md text-xs flex items-center gap-1 transition-colors"
                >
                  <IconLoader2 v-if="isSubmitting" size="12" class="animate-spin" />
                  <IconPlus v-else size="12" />
                  <span>{{ isSubmitting ? 'Adding...' : 'Add' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Table Section -->
        <div class="mb-3">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-amber-500 rounded-r mr-2"></div>
              <h3 class="font-medium text-sm text-amber-200">Tracking History</h3>
              <span class="ml-2 text-xs text-gray-400">({{ entries.length }} entries)</span>
            </div>
            
            <div class="flex items-center gap-2">
              <!-- Header Reset Button -->
              <button
                @click="resetHeaderOrder"
                class="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs flex items-center gap-1"
                title="Reset header order to default"
              >
                <IconRefresh size="12" />
                Reset Headers
              </button>
            </div>
          </div>
          
          <!-- Table Container -->
          <div class="bg-gray-850 rounded-lg border border-gray-700 overflow-hidden">
            <div class="overflow-x-auto max-h-[800px] overflow-y-auto">
              <table class="w-full text-xs">
                <!-- KORRIGIERTE DRAGGABLE HEADER STRUKTUR -->
                <thead class="bg-gray-800 sticky top-0">
                  <Draggable 
                    v-model="draggableHeaders" 
                    tag="tr"
                    handle=".header-grip-handle"
                    :group="{ name: 'headers', pull: false, put: false }"
                    item-key="id"
                    :animation="200"
                    ghost-class="header-ghost"
                    chosen-class="header-chosen"
                    drag-class="header-dragging"
                    @change="onHeaderDragEnd"
                  >
                    <template #item="{ element }">
                      <th 
                        class="sticky text-left text-gray-300 font-medium py-2 px-2 border-r border-gray-700 last:border-r-0 min-w-[80px] relative group cursor-move header-grip-handle"
                        :class="{ 'bg-gray-700/50': element.id === 'timestamp' }"
                      >
                        <div class="flex items-center justify-between">
                          <span>{{ element.displayName }}</span>
                          
                          <!-- Drag Handle Icon -->
                          <div class="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                            <IconGripVertical size="12" class="text-gray-500" />
                          </div>
                        </div>
                      </th>
                    </template>
                  </Draggable>
                </thead>
                
                <tbody v-if="displayedEntries.length > 0">
                  <tr v-for="(entry, rowIndex) in displayedEntries" 
                      :key="rowIndex" 
                      class="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                      :class="{ 'bg-green-900/20': rowIndex === 0 }"
                  >
                    <td v-for="(header, colIndex) in draggableHeaders" 
                        :key="header.id"
                        class="py-2 px-2 border-r border-gray-700/30 last:border-r-0 relative group"
                        :class="[
                          getCellColorClass(header.displayName),
                          header.displayName === 'Log Timestamp' ? 'min-w-[100px] max-w-[120px]' : ''
                        ]"
                    >
                      <!-- Spinner anzeigen, wenn Saving -->
                      <div v-if="isSavingCell(rowIndex, colIndex)" class="flex items-center justify-center">
                        <IconLoader2 size="16" class="animate-spin mr-1 text-blue-400" />
                        <span class="text-xs text-blue-400">Saving...</span>
                      </div>
                      <!-- Edit Mode -->
                      <div v-else-if="editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex" class="w-full">
                        <input
                          v-model="editingCell.value"
                          @blur="saveEdit"
                          @keydown.enter="saveEdit"
                          @keydown.escape="cancelEdit"
                          @focus="onInputFocus"
                          :type="getCellInputType(header.displayName)"
                          class="editing-cell-input w-full px-1 py-0.5 bg-gray-600 border border-blue-500 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                          :class="getCellColorClass(header.displayName)"
                          ref="cellInput"
                        />
                      </div>
                      <!-- View Mode -->
                      <div v-else 
                          @click="startEdit(rowIndex, colIndex, header.displayName, entry.row)"
                          class="cursor-pointer hover:bg-gray-600/30 rounded px-1 py-0.5 min-h-[20px] transition-colors"
                          :title="isEditableCell(header.displayName) ? 'Click to edit' : 'Read-only'"
                          :class="{ 'cursor-not-allowed': !isEditableCell(header.displayName) }"
                      >
                        {{ getCellValueByHeader(entry.row, header.displayName) }}
                        <IconEdit 
                          v-if="isEditableCell(header.displayName)" 
                          size="12" 
                          class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 text-gray-400"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-300">
            <div><strong>Last Update:</strong> {{ formatLastUpdate() }}</div>
            <div><strong>Total Entries:</strong> {{ entries.length }}</div>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="exportData"
              class="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs"
            >
              Export CSV
            </button>
            <button 
              @click="closeModal"
              class="px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Draggable from 'vuedraggable';
import { 
  IconX, 
  IconRefresh, 
  IconAlertCircle,
  IconPlus,
  IconLoader2,
  IconGripVertical,
  IconEdit
} from '@tabler/icons-vue';
import { 
  TR_TRACKING_RESOURCES, 
  DEFAULT_ENABLED_RESOURCES,
  getResourceByKey,
  getResourceCellColorClass,
  mapResourceToColumnName,
  findResourceByColumnName,
  shouldFormatLargeNumbers
} from '@/constants/tr-tracker';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  plan: {
    type: Object,
    required: true
  },
  sheetUrl: {
    type: String,
    required: true
  }
});

// Emits
const emit = defineEmits(['close', 'entryAdded']);

// State
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref('');
const sheetData = ref(null);
const entriesLimit = ref(0);
const newEntryForm = ref({});
const editInput = ref(null);
const savingCells = ref(new Set());
const isLoadingNewPlan = ref(false);
const currentPlanId = ref(null);

const draggableHeaders = ref([]);
const headerOrderKey = 'tr-tracking-header-order';

// Load settings from localStorage
const resourceSettings = ref({
  enabledResources: {},
  customResources: []
});

const editingCell = ref({
  rowIndex: -1,
  colIndex: -1,
  originalValue: '',
  value: '',
  headerName: '',
  entry: null
});

// Compute input resources based on settings
const inputResources = computed(() => {
  console.log('🔧 Computing inputResources...');
  console.log('🔧 Current settings:', resourceSettings.value);
  
  const resources = [];
  
  // KORRIGIERT: Verwende TR_TRACKING_RESOURCES Reihenfolge
  TR_TRACKING_RESOURCES.forEach(resource => {
    const isEnabled = resourceSettings.value.enabledResources[resource.key];
    console.log(`🔧 Resource ${resource.key}: enabled=${isEnabled}`);
    
    if (isEnabled) {
      resources.push({
        key: resource.key,
        displayName: resource.displayName,
        inputType: resource.inputType,
        step: resource.step,
        placeholder: resource.placeholder,
        colorClass: resource.colorClass
      });
    }
  });
  
  // KORRIGIERTE Custom Resources: Füge sie NACH den Standard-Resources hinzu
  (resourceSettings.value.customResources || []).forEach((customResource, index) => {
    if (customResource.enabled && customResource.name) {
      resources.push({
        key: `custom_${index}`,
        displayName: customResource.name,
        inputType: customResource.type || 'text',
        step: customResource.type === 'number' ? '1' : null,
        placeholder: customResource.defaultValue || '',
        colorClass: 'focus:ring-purple-500'
      });
    }
  });
  
  console.log('🔧 Final inputResources in TR_TRACKING_RESOURCES order:', resources);
  return resources;
});


// Computed
const headers = computed(() => {
  if (!sheetData.value?.data || sheetData.value.data.length === 0) {
    return [];
  }
  
  // KORRIGIERT: Suche nach der echten Header-Zeile
  // In deinem Sheet ist die erste Spalte der Beschreibung, die zweite der Wert
  // Wir erstellen künstliche Header basierend auf der Template-Struktur
  
  const artificialHeaders = [
    'Description',      // Spalte A - Beschreibungen
    'Value',           // Spalte B - Werte  
    'Log Timestamp',   // Spalte C - Timestamps
    'Time Since Last Update', // Spalte D
    'TR Timer',        // Spalte E
    'Days in TR',      // Spalte F
    'OO Accum',        // Spalte G
    'LR Ticks',        // Spalte H
    'LR Count',        // Spalte I
    'Loops Filled',    // Spalte J
    'Loop Mods Purchased', // Spalte K
    'AttGN3 Buff',     // Spalte L
    'Player Level',    // Spalte M
    'Cells',           // Spalte N
    'Cells Gain',      // Spalte O
    'Cells Gap to Goal', // Spalte P
    'MP',              // Spalte Q
    'MP (Accumulated)', // Spalte R
    'MP Gain',         // Spalte S
    'MP Gap to Goal',  // Spalte T
    'Shards',          // Spalte U
    'Shards Gain',     // Spalte V
    'Shards Gap to Goal', // Spalte W
    'RP',              // Spalte X
    'RP Gain',         // Spalte Y
    'RP Gap to Goal',  // Spalte Z
    'AP',              // Spalte AA
    'F1-1 Difar',      // Spalte AB
    'Blueprints',      // Spalte AC
    'Inno Cores',      // Spalte AD
    'Daily Farm Frags', // Spalte AE
    'Current Camp',    // Spalte AF
    'Camp Timer',      // Spalte AG
    'Reserved 1',      // Spalte AH
    'Notes'            // Spalte AI
  ];
  
  console.log('Using artificial headers:', artificialHeaders);
  return artificialHeaders;
});

const availableHeaders = computed(() => {
  const headers = [
    { id: 'timestamp', displayName: 'Log Timestamp', fixed: true },
  ];
  
  console.log('🔧 Computing availableHeaders with settings:', resourceSettings.value);
  
  // Füge alle aktivierten Resources hinzu
  TR_TRACKING_RESOURCES.forEach(resource => {
    const isEnabled = resourceSettings.value.enabledResources[resource.key];
    console.log(`🔧 Resource ${resource.key}: enabled=${isEnabled}`);
    
    if (isEnabled) {
      headers.push({
        id: resource.key,
        displayName: resource.displayName,
        fixed: false
      });
    }
  });
  
  // Füge Custom Resources hinzu
  (resourceSettings.value.customResources || []).forEach((customResource, index) => {
    if (customResource.enabled && customResource.name) {
      headers.push({
        id: `custom_${index}`,
        displayName: customResource.name,
        fixed: false
      });
    }
  });
  
  console.log('🔧 Final available headers:', headers);
  return headers;
});

const visibleHeaders = computed(() => {
  return draggableHeaders.value.map(header => header.displayName);
});

// NEUE METHODS für Header Management

/**
 * Lade gespeicherte Header-Reihenfolge aus localStorage
 */
function loadHeaderOrder() {
  try {
    const saved = localStorage.getItem(headerOrderKey);
    if (saved) {
      const savedOrder = JSON.parse(saved);
      
      // Erstelle neue Header-Liste basierend auf gespeicherter Reihenfolge
      const orderedHeaders = [];
      const availableHeadersMap = new Map(
        availableHeaders.value.map(h => [h.id, h])
      );
      
      // Erst die gespeicherten Header in der gespeicherten Reihenfolge
      savedOrder.forEach(savedId => {
        const header = availableHeadersMap.get(savedId);
        if (header) {
          orderedHeaders.push(header);
          availableHeadersMap.delete(savedId);
        }
      });
      
      // Dann neue Header, die nicht gespeichert waren (neue Resources)
      availableHeadersMap.forEach(header => {
        orderedHeaders.push(header);
      });
      
      draggableHeaders.value = orderedHeaders;
      console.log('Header order loaded:', orderedHeaders.map(h => h.displayName));
      return;
    }
  } catch (error) {
    console.error('Error loading header order:', error);
  }
  
  // Fallback: Verwende Standard-Reihenfolge
  draggableHeaders.value = [...availableHeaders.value];
}

/**
 * Speichere Header-Reihenfolge in localStorage
 */
function saveHeaderOrder() {
  try {
    const headerIds = draggableHeaders.value.map(h => h.id);
    localStorage.setItem(headerOrderKey, JSON.stringify(headerIds));
    console.log('Header order saved:', headerIds);
  } catch (error) {
    console.error('Error saving header order:', error);
  }
}

/**
 * Handle Header Drag End Event
 */
function onHeaderDragEnd(event) {
  console.log('Header drag event ended', event);
  console.log('New header order:', draggableHeaders.value.map(h => h.displayName));
  
  // Speichere neue Reihenfolge
  saveHeaderOrder();
}

/**
 * Reset Header Order zu Standard
 */
function resetHeaderOrder() {
  if (confirm('Reset header order to default?')) {
    localStorage.removeItem(headerOrderKey);
    draggableHeaders.value = [...availableHeaders.value];
    saveHeaderOrder();
    console.log('Header order reset to default');
  }
}

// WATCH für Änderungen in verfügbaren Headers (z.B. Settings-Änderungen)
watch(availableHeaders, (newHeaders) => {
  console.log('Available headers changed, updating draggable headers');
  
  // Prüfe ob sich die verfügbaren Headers geändert haben
  const currentIds = new Set(draggableHeaders.value.map(h => h.id));
  const newIds = new Set(newHeaders.map(h => h.id));
  
  // Wenn sich die IDs unterscheiden, lade Header-Order neu
  const idsChanged = currentIds.size !== newIds.size || 
    [...currentIds].some(id => !newIds.has(id)) ||
    [...newIds].some(id => !currentIds.has(id));
  
  if (idsChanged) {
    loadHeaderOrder();
  }
}, { deep: true });

const entries = computed(() => {
  if (!sheetData.value?.data) return [];
  const result = [];
  sheetData.value.data.forEach((row, idx) => {
    // idx+2 = echte Sheet-Zeile (Header ist Zeile 1, erste Data-Zeile ist Zeile 2)
    if (idx >= 0) {
      const timestamp = row[2];
      const hasData = row.some(cell => cell !== null && cell !== undefined && cell !== '');
      // Prüfe: Nur Zeilen mit Timestamp UND mindestens einem Wert
      if (timestamp && timestamp.toString().trim() !== '' && hasData) {
        result.push({ row, sheetRow: idx + 2 }); // sheetRow: echte Zeilennummer im Sheet
      }
    }
  });
  // Neueste zuerst
  return result.reverse();
});

function debugSheetStructure() {
  if (!sheetData.value?.data) return;
  
  console.log('=== SHEET STRUCTURE DEBUG ===');
  console.log('Total rows:', sheetData.value.data.length);
  console.log('Headers:', sheetData.value.headers);
  
  // Zeige Zeilen 30-40 mit allen Daten
  for (let i = 1; i < Math.min(40, sheetData.value.data.length); i++) {
    const row = sheetData.value.data[i];
    console.log(`Row ${i}:`, row);
  }
}

const displayedEntries = computed(() => {
  if (entriesLimit.value === 0) return entries.value;
  return entries.value.slice(0, entriesLimit.value);
});

const hasEntryData = computed(() => {
  return Object.values(newEntryForm.value).some(val => val && val.toString().trim());
});

// Methods
function closeModal() {
  emit('close');
}

function cleanHeaderName(header) {
  if (!header) return '';
  
  let str;
  try {
    str = header.toString();
    if (!str) return '';
  } catch (error) {
    console.error('cleanHeaderName: Error converting header to string:', header, error);
    return '';
  }
  
  // Remove "Traversal" and "TR" prefixes/suffixes
  return str
    .replace(/traversal\s*/gi, '')
    .replace(/\s*tr\s*/gi, ' ')
    .replace(/^Reset\s*/gi, '')
    .trim();
}

function getCellColorClass(header) {
  // Base colors für spezielle Headers
  const baseColors = {
    'Log Timestamp': 'text-gray-300'
  };
  
  if (baseColors[header]) {
    return baseColors[header];
  }
  
  // Für Standard-Resources: Verwende die index.js Color Classes
  const resource = TR_TRACKING_RESOURCES.find(r => r.displayName === header);
  if (resource) {
    return resource.cellColorClass || 'text-white';
  }
  
  // Für Custom Resources: Verwende Purple als Standard
  const isCustomResource = (resourceSettings.value.customResources || [])
    .some(cr => cr.enabled && cr.name === header);
  
  if (isCustomResource) {
    return 'text-purple-400';
  }
  
  // Fallback
  return 'text-white';
}

function formatNumber(num) {
  if (!num || num === 0) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

function formatDate(date, includeTime = true) {
  if (!date) return '';
  
  try {
    // Konvertiere zu Date Object falls nötig
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return ''; // Ungültiges Datum
    }
    
    if (includeTime) {
      return dateObj.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    } else {
      return dateObj.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric'
      });
    }
  } catch (e) {
    console.error("Error formatting date:", e);
    return '';
  }
}

function formatCellValue(value, header) {
  if (!value && value !== 0) return '-';
  
  if (!header) {
    return value.toString();
  }
  
  const headerStr = header.toString().toLowerCase();
  
  // KORRIGIERT: Kompakte Date formatting für Timestamps
  if (headerStr.includes('timestamp') || headerStr.includes('date')) {
    return formatDate(value, true); // Mit Uhrzeit
  }
  
  // Number formatting für große Zahlen
  if (typeof value === 'number' && value > 1000) {
    if (headerStr.includes('oo') || headerStr.includes('cells') || 
        headerStr.includes('mp') || headerStr.includes('shards') || 
        headerStr.includes('rp') || headerStr.includes('ap')) {
      return formatNumber(value);
    }
  }
  
  return value.toString();
}

function getCellValueByHeader(entry, header) {
  // Base mapping für spezielle Headers
  const baseHeaderToColumnIndex = {
    'Log Timestamp': 2,       // Spalte C = Index 2
  };
  
  // Prüfe erst die Base-Mappings
  if (baseHeaderToColumnIndex[header] !== undefined) {
    const columnIndex = baseHeaderToColumnIndex[header];
    const rawValue = entry[columnIndex] !== undefined ? entry[columnIndex] : '';
    
    // KORRIGIERT: Formatiere Timestamps direkt hier
    if (header === 'Log Timestamp' && rawValue) {
      return formatDate(rawValue, true);
    }
    
    return rawValue;
  }
  
  // Für Standard-Resources: Verwende die index.js Mappings
  const resource = TR_TRACKING_RESOURCES.find(r => r.displayName === header);
  if (resource) {
    // Konvertiere Column Letter zu Index
    const columnIndex = columnLetterToIndex(resource.column) - 1; // -1 weil Array 0-basiert
    const rawValue = entry[columnIndex] !== undefined ? entry[columnIndex] : '';
    
    // KORRIGIERT: Camp Timer - einfach rohen Wert zurückgeben
    if (header === 'Camp Timer' || header.toLowerCase().includes('camp timer')) {
      return rawValue?.toString() || '';
    }
    
    // Formatiere große Zahlen für bestimmte Resources
    if (rawValue && typeof rawValue === 'number' && resource.formatLargeNumbers && rawValue > 1000) {
      return rawValue;
    }
    
    return rawValue;
  }
  
  // KORRIGIERTE Custom Resources: Dynamisch basierend auf Sheet-Header
  if (sheetData.value && sheetData.value.headers) {
    const headerIndex = sheetData.value.headers.findIndex(h => {
      const normalizedSheetHeader = h ? h.toString().toLowerCase().trim() : '';
      const normalizedRequestedHeader = header.toLowerCase().trim();
      
      return normalizedSheetHeader === normalizedRequestedHeader;
    });
    
    if (headerIndex !== -1) {
      const rawValue = entry[headerIndex] !== undefined ? entry[headerIndex] : '';
      
      // KORRIGIERT: Camp Timer - einfach rohen Wert zurückgeben
      if (header.toLowerCase().includes('camp') && header.toLowerCase().includes('timer')) {
        return rawValue?.toString() || '';
      }
      
      // KORRIGIERT: Nur echte Timestamps formatieren
      if (header.toLowerCase().includes('timestamp') || header.toLowerCase().includes('date')) {
        return formatDate(rawValue, true);
      }
      
      return rawValue;
    }
  }
  
  return '';
}

// Helper function um Column Letter zu Index zu konvertieren (A=1, B=2, AA=27, etc.)
function columnLetterToIndex(column) {
  if (!column || typeof column !== 'string') return 0;
  
  let result = 0;
  for (let i = 0; i < column.length; i++) {
    result = result * 26 + (column.charCodeAt(i) - 64);
  }
  return result;
}

// Helper function um Index zu Column Letter zu konvertieren (1=A, 2=B, 27=AA, etc.)
function columnIndexToLetter(index) {
  let result = '';
  while (index > 0) {
    index--;
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26);
  }
  return result;
}

function getLatestValue(field) {
  console.log(`🎯 Getting latest value for field: "${field}"`);
  
  if (!entries.value.length) {
    console.log(`❌ No entries available for ${field}`);
    return '0';
  }
  
  const latestEntry = entries.value[0];
  if (!latestEntry || !latestEntry.row) {
    console.log(`❌ No valid latest entry for ${field}`);
    return '0';
  }
  
  // SPEZIAL-BEHANDLUNG für MP
  if (field.toLowerCase() === 'mp') {
    const mpVariants = ['MP (Accumulated)', 'MP', 'mp', 'MP on Hand', 'MP (Accum)', 'mp accumulated'];
    
    for (const variant of mpVariants) {
      const value = getCellValueByHeader(latestEntry.row, variant);
      if (value !== null && value !== undefined && value !== '' && value !== '-') {
        if (typeof value === 'number' && value > 1000) {
          return value;
        }
        return value?.toString() || '0';
      }
    }
    return '0';
  }
  
  // Standard-Verhalten
  const fieldLower = field.toLowerCase();
  
  if (sheetData.value?.headers) {
    const headerIndex = sheetData.value.headers.findIndex(h => {
      const headerLower = h ? h.toString().toLowerCase().trim() : '';
      return headerLower.includes(fieldLower) || fieldLower.includes(headerLower);
    });
    
    if (headerIndex !== -1) {
      const value = latestEntry.row[headerIndex];
      
      if (typeof value === 'number') {
        return value;
      }
      
      if (typeof value === 'string') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue;
        }
        return value;
      }
      
      return value || '0';
    }
  }
  
  return '0';
}

function formatLastUpdate() {
  if (!sheetData.value?.lastUpdate) return 'Never';
  
  return formatDate(sheetData.value.lastUpdate, true);
}

async function refreshData() {
  await loadSheetData();
}

async function loadSheetData() {
  if (!props.sheetUrl || !props.plan.id) return;
  
  console.log('📊 Loading sheet data for plan:', props.plan.id);
  
  isLoading.value = true;
  error.value = '';
  
  // WICHTIG: Leere sheetData während des Ladens
  if (!sheetData.value) {
    console.log('🧹 No existing data, starting fresh');
  } else {
    console.log('🔄 Replacing existing data for new plan');
    sheetData.value = null; // Leere alte Daten
  }
  
  try {
    console.log('📡 Fetching data for plan:', props.plan.id);
    
    let data;
    const url = props.sheetUrl + '?action=getSheetData&sheetName=' + encodeURIComponent(props.plan.id);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
      });

      if (response.ok) {
        data = await response.json();
        console.log('✅ Fetch successful:', data?.success);
      } else {
        throw new Error('Fetch failed, trying JSONP...');
      }
    } catch (fetchError) {
      console.log('🔄 Fetch failed, using JSONP fallback');
      data = await fetchSheetDataWithJSONP(url);
    }
    
    if (data && data.success && data.data) {
      console.log('✅ Data loaded successfully for:', props.plan.id);
      
      // WICHTIG: Setze neue Daten nur wenn wir noch das richtige Modal offen haben
      if (props.show && props.plan.id) {
        sheetData.value = {
          headers: data.data.headers || [],
          data: data.data.data || [],
          goals: data.data.goals || {},
          lastUpdate: data.data.lastUpdate || new Date().toISOString()
        };
        
        console.log('📊 Sheet data set:', {
          headers: sheetData.value.headers.length,
          rows: sheetData.value.data.length,
          goals: Object.keys(sheetData.value.goals).length
        });
        
        debugSheetStructure();
      } else {
        console.log('⚠️ Modal closed during loading, discarding data');
      }
    } else {
      throw new Error(data?.error || 'No data received');
    }
    
  } catch (err) {
    console.error('❌ Error loading sheet data:', err);
    
    // Nur Error setzen wenn Modal noch offen
    if (props.show) {
      error.value = err.message || 'Failed to load tracking data';
      sheetData.value = null;
    }
  } finally {
    isLoading.value = false;
  }
}

// NEUE HELPER FUNCTION: JSONP für Sheet Data
function fetchSheetDataWithJSONP(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_sheet_callback_' + Date.now();
    const script = document.createElement('script');
    
    // Set up callback
    window[callbackName] = function(response) {
      console.log('JSONP sheet data response:', response);
      resolve(response);
      document.head.removeChild(script);
      delete window[callbackName];
    };
    
    // Handle errors
    script.onerror = function() {
      reject(new Error('JSONP sheet data request failed'));
      document.head.removeChild(script);
      delete window[callbackName];
    };
    
    // Create request
    const jsonpUrl = url + (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;
    console.log('JSONP sheet data URL:', jsonpUrl);
    
    script.src = jsonpUrl;
    document.head.appendChild(script);
    
    // Timeout after 15 seconds
    setTimeout(() => {
      if (window[callbackName]) {
        reject(new Error('JSONP sheet data request timeout'));
        document.head.removeChild(script);
        delete window[callbackName];
      }
    }, 15000);
  });
}

function initializeForm() {
  console.log('🔧 Initializing form for resources:', inputResources.value);
  
  // Initialize form with empty values for each input resource
  const form = {};
  inputResources.value.forEach(resource => {
    form[resource.key] = '';
    console.log(`🔧 Initialized form field: ${resource.key} = ""`);
  });
  
  newEntryForm.value = form;
  console.log('🔧 Final form structure:', newEntryForm.value);
}

async function submitNewEntry() {
  console.log('=== OPTIMISTIC SUBMIT NEW ENTRY ===');
  console.log('hasEntryData:', hasEntryData.value);
  console.log('isSubmitting:', isSubmitting.value);
  
  if (!hasEntryData.value) {
    console.log('❌ No entry data, aborting');
    return;
  }
  
  if (isSubmitting.value) {
    console.log('❌ Already submitting, aborting');
    return;
  }
  
  isSubmitting.value = true;
  console.log('✅ Setting isSubmitting to true');
  
  try {
    console.log('🔄 Starting entry preparation...');
    console.log('📊 Input resources:', inputResources.value);
    console.log('📝 Form data:', newEntryForm.value);
    
    const entryData = {};
    
    inputResources.value.forEach(resource => {
      const value = newEntryForm.value[resource.key];
      console.log(`🔍 Processing resource ${resource.key}: value="${value}"`);
      
      if (value && value.toString().trim()) {
        const scriptKey = resource.displayName; // Verwende displayName direkt
        entryData[scriptKey] = value;
        console.log(`✅ Mapped ${resource.key} -> "${scriptKey}" = ${value}`);
      }
    });
    
    console.log('📦 Final entry data:', entryData);
    console.log('📦 Entry data keys count:', Object.keys(entryData).length);
    
    if (Object.keys(entryData).length === 0) {
      console.warn('⚠️ No entry data to submit after processing');
      return;
    }
    
    // 1. OPTIMISTISCHES UPDATE: Neuen Entry sofort ins lokale UI einfügen
    console.log('🚀 Adding optimistic entry to local UI...');
    addOptimisticEntry(entryData);
    
    // 2. Form sofort zurücksetzen und Loading-State beenden
    console.log('🧹 Resetting form optimistically...');
    initializeForm();
    isSubmitting.value = false;
    
    // 3. API Call im Hintergrund (ohne UI zu blockieren)
    console.log('📡 Starting background API call...');
    emit('entryAdded', entryData);
    
    // 4. Optimistisches Feedback
    showOptimisticToast('Entry added! Syncing to sheet...');
    
    // 5. Nach erfolgreichem Hintergrund-Save: Bestätigung
    // (Das wird über Events aus dem Parent Component behandelt)
    
  } catch (err) {
    console.error('💥 Error in optimistic submitNewEntry:', err);
    
    // Bei Fehler: UI zurücksetzen
    isSubmitting.value = false;
    removeOptimisticEntry(); // Entferne den optimistischen Entry
    showErrorToast('Failed to submit entry: ' + err.message);
  }
}

/**
 * NEUE FUNCTION: Füge optimistischen Entry ins lokale UI ein
 */
function addOptimisticEntry(entryData) {
  try {
    console.log('🎯 Adding optimistic entry:', entryData);
    
    if (!sheetData.value || !sheetData.value.headers) {
      console.warn('❌ No sheet data available for optimistic update');
      return;
    }
    
    // Erstelle neue Zeile basierend auf entryData
    const newRow = new Array(sheetData.value.headers.length).fill('');
    
    // Setze Timestamp
    const timestampIndex = sheetData.value.headers.findIndex(h => 
      h && h.toString().toLowerCase().includes('timestamp')
    );
    if (timestampIndex !== -1) {
      newRow[timestampIndex] = new Date();
    }
    
    // Fülle die Daten basierend auf entryData
    Object.entries(entryData).forEach(([displayName, value]) => {
      const headerIndex = sheetData.value.headers.findIndex(h => {
        if (!h) return false;
        const normalizedHeader = h.toString().toLowerCase().trim();
        const normalizedDisplayName = displayName.toLowerCase().trim();
        return normalizedHeader === normalizedDisplayName;
      });
      
      if (headerIndex !== -1) {
        newRow[headerIndex] = value;
        console.log(`✅ Set optimistic value: ${displayName} = ${value} at index ${headerIndex}`);
      } else {
        console.warn(`❌ Header not found for: ${displayName}`);
      }
    });
    
    // Berechne neue sheetRow (nächste verfügbare Zeile)
    const nextSheetRow = (sheetData.value.data.length || 0) + 2; // +2 wegen Header
    
    // Füge zur sheetData hinzu
    sheetData.value.data.push(newRow);
    
    // Markiere als optimistisch für spätere Behandlung
    newRow._isOptimistic = true;
    newRow._optimisticId = Date.now();
    
    console.log('✅ Optimistic entry added to local UI');
    
  } catch (error) {
    console.error('💥 Error adding optimistic entry:', error);
  }
}

/**
 * NEUE FUNCTION: Entferne optimistischen Entry bei Fehler
 */
function removeOptimisticEntry() {
  try {
    if (!sheetData.value || !sheetData.value.data) return;
    
    // Finde und entferne optimistische Entries
    sheetData.value.data = sheetData.value.data.filter(row => !row._isOptimistic);
    
    console.log('🧹 Removed optimistic entries from UI');
  } catch (error) {
    console.error('💥 Error removing optimistic entry:', error);
  }
}

/**
 * NEUE FUNCTION: Bestätige optimistischen Entry nach erfolgreichem API Call
 */
function confirmOptimisticEntry(apiResponse) {
  try {
    if (!sheetData.value || !sheetData.value.data) return;
    
    // Finde optimistische Entries und markiere sie als bestätigt
    sheetData.value.data.forEach(row => {
      if (row._isOptimistic) {
        delete row._isOptimistic;
        delete row._optimisticId;
        console.log('✅ Confirmed optimistic entry');
      }
    });
    
    showSuccessToast('Entry synced successfully!');
    
  } catch (error) {
    console.error('💥 Error confirming optimistic entry:', error);
  }
}

function showOptimisticToast(message) {
  console.log('🚀 OPTIMISTIC:', message);
  // Implementation abhängig von deinem Toast-System
}


function exportData() {
  if (!sheetData.value?.data || !sheetData.value?.headers) {
    alert('No data to export');
    return;
  }
  
  // Create CSV content
  const csvContent = [
    // Headers
    visibleHeaders.value.map(h => cleanHeaderName(h)).join(','),
    // Data rows
    ...entries.value.slice(0, entriesLimit.value === 0 ? undefined : entriesLimit.value)
      .map(row => row.slice(0, visibleHeaders.value.length).join(','))
  ].join('\n');
  
  // Download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${props.plan.name}_tracking_data.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
}

// FUNCTION zum Laden der Settings
function loadResourceSettings() {
  try {
    const saved = localStorage.getItem('tr-tracking-resource-settings');
    if (saved) {
      const settings = JSON.parse(saved);
      console.log('🔧 Loading settings:', settings);
      resourceSettings.value = settings;
      return;
    }
  } catch (error) {
    console.error('Error loading resource settings:', error);
  }
  
  // Default settings
  const defaultEnabled = {};
  DEFAULT_ENABLED_RESOURCES.forEach(key => {
    defaultEnabled[key] = true;
  });
  
  resourceSettings.value = {
    enabledResources: defaultEnabled,
    customResources: []
  };
}

/**
 * Prüft ob eine Zelle editierbar ist
 */
function isEditableCell(headerName) {
  const readOnlyHeaders = [
    'Log Timestamp',
    'Time Since Last Update', 
    'Days in TR',
    'Cells Gain',
    'Cells Gap to Goal',
    'MP Gain', 
    'MP Gap to Goal',
    'Shards Gain',
    'Shards Gap to Goal',
    'RP Gain',
    'RP Gap to Goal'
  ];
  
  return !readOnlyHeaders.some(readonly => 
    headerName.toLowerCase().includes(readonly.toLowerCase())
  );
}

/**
 * Bestimmt den Input-Typ für eine Zelle
 */
function getCellInputType(headerName) {
  const textHeaders = ['Notes', 'Current Camp', 'Camp Timer'];
  
  if (textHeaders.some(text => headerName.toLowerCase().includes(text.toLowerCase()))) {
    return 'text';
  }
  
  return 'number';
}

/**
 * Startet den Edit-Modus für eine Zelle
 */
function startEdit(rowIndex, colIndex, headerName, entry) {
  if (!isEditableCell(headerName)) {
    console.log(`❌ Cell ${headerName} is not editable`);
    return;
  }
  
  console.log(`✏️ Starting edit for [${rowIndex}][${colIndex}] ${headerName}`);
  
  const currentValue = getCellValueByHeader(entry, headerName);
  
  editingCell.value = {
    rowIndex: rowIndex,
    colIndex: colIndex,
    originalValue: currentValue,
    value: currentValue?.toString() || '',
    headerName: headerName,
    entry: entry
  };
  
  // Focus auf Input nach dem nächsten DOM-Update
  nextTick(() => {
    // KORRIGIERT: Verwende eine spezifischere CSS-Klasse und warte länger
    setTimeout(() => {
      const inputElement = document.querySelector('.editing-cell-input');
      
      if (inputElement) {
        try {
          inputElement.focus();
          inputElement.select(); // Wählt den gesamten Text aus
          console.log('✅ Input focused and selected');
        } catch (error) {
          console.warn('⚠️ Could not focus input:', error);
        }
      } else {
        console.warn('⚠️ Input element not found');
        // FALLBACK: Versuche alle Input-Elemente
        const allInputs = document.querySelectorAll('input[type="number"], input[type="text"]');
        console.log(`Found ${allInputs.length} input elements`);
        
        // Finde das Input das gerade sichtbar ist und editiert wird
        for (const input of allInputs) {
          if (input.offsetParent !== null) { // Ist sichtbar
            input.focus();
            input.select();
            console.log('✅ Fallback input focused');
            break;
          }
        }
      }
    }, 50); // Kurze Verzögerung für DOM-Update
  });
}

function isSavingCell(row, col) {
  return savingCells.value.has(`${row}-${col}`);
}

/**
 * Speichert die Änderung und verlässt den Edit-Modus
 */
async function saveEdit() {
  if (editingCell.value.rowIndex === -1) return;

  const newValue = editingCell.value.value;
  const originalValue = editingCell.value.originalValue;
  const cellKey = `${editingCell.value.rowIndex}-${editingCell.value.colIndex}`;

  if (newValue === originalValue?.toString()) {
    cancelEdit();
    return;
  }

  console.log('🚀 Starting optimistic save...');
  console.log(`📝 Updating [${editingCell.value.rowIndex}][${editingCell.value.colIndex}] "${editingCell.value.headerName}" = ${newValue}`);

  // SOFORTIGES lokales Update (optimistisch)
  updateLocalEntry(editingCell.value.rowIndex, editingCell.value.headerName, newValue);
  
  // Edit-Modus sofort beenden
  const editData = { ...editingCell.value };
  cancelEdit();

  // Zeige Spinner-Feedback
  savingCells.value.add(cellKey);

  try {
    console.log('📡 Sending background API call...');
    
    // API Call im Hintergrund
    const result = await updateCellValue(
      editData.rowIndex,
      editData.headerName,
      newValue
    );
    
    console.log('✅ Background API call successful:', result);
    
    // Erfolg: Spinner entfernen
    savingCells.value.delete(cellKey);
    showSuccessToast('Cell updated successfully');
    
  } catch (error) {
    console.error('❌ Background API call failed:', error);
    
    // Fehler: Wert zurücksetzen + Spinner entfernen
    savingCells.value.delete(cellKey);
    updateLocalEntry(editData.rowIndex, editData.headerName, originalValue);
    showErrorToast('Failed to update cell: ' + error.message);
  }
}

/**
 * Bricht den Edit-Modus ab
 */
function cancelEdit() {
  console.log('❌ Canceling edit');
  
  editingCell.value = {
    rowIndex: -1,
    colIndex: -1,
    originalValue: '',
    value: '',
    headerName: ''
  };
}

/**
 * Updated eine Zelle über die API
 */
async function updateCellValue(rowIndex, headerName, newValue) {
  // rowIndex ist der Index im reversed entries-Array
  const entry = entries.value[rowIndex];
  if (!entry) throw new Error('Entry not found');
  const sheetRowIndex = entry.sheetRow; // Das ist die echte Zeile im Sheet!

  const requestData = {
    action: 'updateCell',
    sheetName: props.plan.id,
    rowIndex: sheetRowIndex,
    columnName: headerName.toLowerCase(),
    newValue: newValue
  };
  
  console.log('📡 Sending cell update request:', requestData);
  
  // JSONP Request wie bei addDailyEntry
  const result = await updateCellWithJSONP(props.sheetUrl, requestData);
  
  if (!result || !result.success) {
    throw new Error(result?.error || 'Update failed');
  }
  
  // ENTFERNT: Kein automatischer Refresh hier mehr
  return result;
}

/**
 * JSONP Helper für Cell Updates
 */
function updateCellWithJSONP(url, data) {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_update_callback_' + Date.now();
    const script = document.createElement('script');
    
    window[callbackName] = function(response) {
      resolve(response);
      document.head.removeChild(script);
      delete window[callbackName];
    };
    
    script.onerror = function() {
      reject(new Error('JSONP request failed'));
      document.head.removeChild(script);
      delete window[callbackName];
    };
    
    const params = new URLSearchParams({
      callback: callbackName,
      ...data // Spread all data as query params
    });
    
    script.src = url + '?' + params.toString();
    document.head.appendChild(script);
    
    // REDUZIERT: Timeout auf 5 Sekunden statt 10
    setTimeout(() => {
      if (window[callbackName]) {
        reject(new Error('JSONP request timeout'));
        document.head.removeChild(script);
        delete window[callbackName];
      }
    }, 5000);
  });
}

/**
 * Updated den lokalen Entry für sofortiges UI-Feedback
 */

function updateLocalEntry(rowIndex, headerName, newValue) {
  try {
    console.log(`🔄 Updating local entry [${rowIndex}] "${headerName}" = ${newValue}`);
    
    // KORRIGIERT: displayedEntries basiert auf entries.value
    const entry = entries.value[rowIndex];
    if (!entry || !entry.row) {
      console.warn(`❌ No entry or entry.row found at index ${rowIndex}`);
      return;
    }
    
    console.log('📝 Found entry:', entry);
    
    // KORRIGIERT: Finde die Spalte für diesen Header
    if (sheetData.value && sheetData.value.headers) {
      const headerIndex = sheetData.value.headers.findIndex(h => {
        const normalizedSheetHeader = h ? h.toString().toLowerCase().trim() : '';
        const normalizedRequestedHeader = headerName.toLowerCase().trim();
        
        console.log(`🔍 Comparing "${normalizedSheetHeader}" === "${normalizedRequestedHeader}"`);
        
        return normalizedSheetHeader === normalizedRequestedHeader;
      });
      
      if (headerIndex !== -1) {
        console.log(`✅ Found header "${headerName}" at index ${headerIndex}`);
        
        // DIREKTE MUTATION des Entry-Row-Arrays
        entry.row[headerIndex] = newValue;
        console.log(`✅ Updated entry.row[${headerIndex}] = ${newValue}`);
        
        // ZUSÄTZLICH: Mutiere auch das ursprüngliche sheetData für Konsistenz
        const sheetRowIndex = entry.sheetRow - 2; // -2 wegen Header-Zeile (1-basiert) + Array 0-basiert
        if (sheetData.value.data[sheetRowIndex]) {
          sheetData.value.data[sheetRowIndex][headerIndex] = newValue;
          console.log(`✅ Also updated sheetData.data[${sheetRowIndex}][${headerIndex}] = ${newValue}`);
        }
        
        // FORCE REACTIVITY: Trigger Vue's reactivity system
        // Da wir nested Arrays direkt mutieren, muss Vue explizit informiert werden
        entries.value.splice(rowIndex, 1, { ...entry, row: [...entry.row] });
        console.log(`✅ Forced reactivity update for entry ${rowIndex}`);
        
      } else {
        console.warn(`❌ Header "${headerName}" not found in sheet headers`);
        console.log(`Available headers:`, sheetData.value.headers);
      }
    } else {
      console.warn(`❌ No sheet data or headers available`);
    }
  } catch (error) {
    console.error('Error updating local entry:', error);
  }
}

/**
 * Toast Helpers
 */
function showSuccessToast(message) {
  // Implementation abhängig von deinem Toast-System
  console.log('✅ SUCCESS:', message);
}

function showErrorToast(message) {
  // Implementation abhängig von deinem Toast-System
  console.error('❌ ERROR:', message);
}

// ESCAPE KEY HANDLER für globales Abbrechen
function handleGlobalKeydown(event) {
  if (event.key === 'Escape' && editingCell.value.rowIndex !== -1) {
    cancelEdit();
  }
}

function handleEntryConfirmed(event) {
  console.log('📨 Received entry confirmation event:', event.detail);
  confirmOptimisticEntry(event.detail);
}

function handleEntryFailed(event) {
  console.log('📨 Received entry failure event:', event.detail);
  removeOptimisticEntry();
}

// Event Listeners
onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown);
  window.addEventListener('tr-entry-confirmed', handleEntryConfirmed);
  window.addEventListener('tr-entry-failed', handleEntryFailed);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown);
  window.removeEventListener('tr-entry-confirmed', handleEntryConfirmed);
  window.removeEventListener('tr-entry-failed', handleEntryFailed);
});

// WATCH für reactive Settings-Änderungen
watch(() => resourceSettings.value, (newSettings) => {
  console.log('🔧 Resource settings changed, updating headers');
  console.log('🔧 New settings:', newSettings);
  
  // Header-Order neu laden mit neuen Settings
  nextTick(() => {
    loadHeaderOrder();
  });
}, { deep: true });

// STORAGE EVENT LISTENER für Cross-Tab/Modal Updates
onMounted(() => {
  // Initial laden
  loadResourceSettings();
  
  if (props.show) {
    loadSheetData();
  }
  
  // Storage Event Listener für localStorage Änderungen
  const handleStorageChange = (event) => {
    if (event.key === 'tr-tracking-resource-settings') {
      console.log('🔧 Storage event detected - settings changed');
      loadResourceSettings(); // Lädt und triggert den watch
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Manual reload wenn Settings Modal geschlossen wird (same-tab)
  const handleManualReload = () => {
    console.log('🔧 Manual reload triggered');
    loadResourceSettings();
  };
  
  // Custom event für same-tab updates
  window.addEventListener('tr-settings-updated', handleManualReload);
  
  // Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('tr-settings-updated', handleManualReload);
  });
});

// watch für modal show
watch(() => props.show, async (newShow, oldShow) => {
  if (newShow && !oldShow) {
    console.log('🔄 Modal opening, starting fresh load...');
    
    // WICHTIG: Setze Loading-State und leere alte Daten
    isLoadingNewPlan.value = true;
    sheetData.value = null; // Leere alte Daten sofort
    error.value = '';
    
    // Lade neue Daten
    await loadSheetData();
    
    // Loading beenden
    isLoadingNewPlan.value = false;
  }
  
  if (!newShow && oldShow) {
    console.log('🚪 Modal closing, cleanup...');
    // Optional: Cleanup bei Modal-Schließung
    editingCell.value = {
      rowIndex: -1,
      colIndex: -1,
      originalValue: '',
      value: '',
      headerName: ''
    };
  }
});

// Watch für Plan-Änderungen
watch(() => props.plan?.id, (newPlanId, oldPlanId) => {
  if (newPlanId !== oldPlanId) {
    console.log(`🔄 Plan changed from ${oldPlanId} to ${newPlanId}`);
    
    // Setze Loading-State
    isLoadingNewPlan.value = true;
    currentPlanId.value = newPlanId;
    
    // Leere alte Daten sofort
    sheetData.value = null;
    error.value = '';
    
    // Lade neue Daten wenn Modal offen ist
    if (props.show && newPlanId) {
      loadSheetData().finally(() => {
        isLoadingNewPlan.value = false;
      });
    } else {
      isLoadingNewPlan.value = false;
    }
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

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
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

/* Custom scrollbar for table */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.7);
}

/* Table responsive behavior */
table {
  min-width: 800px;
}

/* Input field transitions */
input {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Row highlighting */
tbody tr:hover {
  background-color: rgba(55, 65, 81, 0.2) !important;
}

.header-ghost {
  opacity: 0.3;
  background-color: rgba(59, 130, 246, 0.2) !important;
  border: 1px dashed rgba(59, 130, 246, 0.5) !important;
}

.header-chosen {
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  background-color: rgba(59, 130, 246, 0.1) !important;
}

.header-dragging {
  opacity: 0.8;
  transform: scale(1.02);
}

.header-grip-handle {
  cursor: grab;
}

.header-grip-handle:active {
  cursor: grabbing;
}

/* Header hover effects */
th.header-grip-handle:hover {
  background-color: rgba(55, 65, 81, 0.5);
}

/* Smooth transitions for headers */
th {
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

/* Input styling in edit mode */
input[type="number"], input[type="text"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Edit indicator animation */
.group:hover .transition-opacity {
  transition: opacity 0.2s ease;
}

/* Success/Error feedback */
.cell-success {
  background-color: rgba(34, 197, 94, 0.2) !important;
  animation: cellFlash 0.5s ease;
}

.cell-error {
  background-color: rgba(239, 68, 68, 0.2) !important;
  animation: cellFlash 0.5s ease;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

td[data-timestamp] {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 11px;
  white-space: nowrap;
}

@keyframes cellFlash {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style>