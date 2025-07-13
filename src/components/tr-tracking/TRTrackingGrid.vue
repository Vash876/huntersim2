<template>
  <div class="tr-tracking-grid">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <IconChartLine size="28" class="text-green-500 mr-3" />
        <div>
          <h2 class="text-xl font-bold text-white">TR Tracking</h2>
          <p class="text-sm text-gray-400">Monitor your resource progression across TRs</p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <button
          @click="showConnectionModal = true"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          :class="{ 'bg-green-600 hover:bg-green-700': isConnected }"
        >
          <IconBrandGoogleFilled size="16" class="mr-2" />
          <span>{{ isConnected ? 'Connected' : 'Connect Sheet' }}</span>
        </button>
        
        <button
          @click="showSettingsModal = true"
          class="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <IconSettings size="16" class="mr-2" />
          <span>Resource Settings</span>
        </button>
        
        <button
          @click="createNewTrackingPlan"
          :disabled="!isConnected || isLoading"
          class="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <IconLoader2 v-if="isLoading" size="16" class="mr-2 animate-spin" />
          <IconPlus v-else size="16" class="mr-2" />
          <span>New Tracking Plan</span>
        </button>

        <!-- Refresh Button -->
        <button
          v-if="isConnected && trackingPlans.length > 0"
          @click="refreshPlans"
          :disabled="isLoading"
          class="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <IconRefresh size="16" class="mr-2" :class="{ 'animate-spin': isLoading }" />
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Connection Status -->
    <div v-if="!isConnected" class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <IconAlertTriangle size="20" class="text-yellow-500 mr-3" />
        <div>
          <h3 class="font-semibold text-yellow-400">Google Sheets Not Connected</h3>
          <p class="text-sm text-yellow-300/80">Connect your Google Sheet to start tracking your Traversal Reset progress.</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isConnected && isLoading && trackingPlans.length === 0" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="relative inline-block">
          <!-- Main Spinner -->
          <div class="w-16 h-16 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin mb-4"></div>
          
          <!-- Inner Pulse -->
          <div class="absolute inset-0 w-16 h-16 border-2 border-green-500/30 rounded-full animate-pulse"></div>
        </div>
        
        <h3 class="text-lg font-semibold text-white mb-2">Loading Tracking Plans</h3>
        <p class="text-sm text-gray-400">Fetching data from your Google Sheet...</p>
        
        <!-- Progress Dots -->
        <div class="flex justify-center mt-4 space-x-1">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay:0.1s"></div>
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" style="animation-delay:0.2s"></div>
        </div>
      </div>
    </div>

    <!-- Tracking Plans Table -->
    <div v-else-if="isConnected">
      <!-- No Plans State -->
      <div v-if="!isLoading && trackingPlans.length === 0" class="bg-gray-850 rounded-lg p-8 text-center border border-gray-700">
        <IconFileText size="48" class="text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-300 mb-2">No Tracking Plans</h3>
        <p class="text-gray-400 mb-6">Create your first tracking plan to start monitoring your Traversal Reset progress.</p>
        <button
          @click="createNewTrackingPlan"
          :disabled="isLoading"
          class="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-md flex items-center gap-2 mx-auto transition-colors"
        >
          <IconLoader2 v-if="isLoading" size="16" class="animate-spin" />
          <IconPlus v-else size="16" />
          <span>{{ isLoading ? 'Loading...' : 'Create First Tracking Plan' }}</span>
        </button>
      </div>

      <!-- Plans Table -->
      <div v-else class="relative">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-lg z-10">
          <div class="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
            <div class="flex items-center space-x-3">
              <IconLoader2 size="24" class="text-green-500 animate-spin" />
              <span class="text-white font-medium">Refreshing plans...</span>
            </div>
          </div>
        </div>

        <!-- Table Container -->
        <div class="bg-gray-850 rounded-lg border border-gray-700 overflow-hidden" :class="{ 'opacity-50': isLoading }">
          <!-- Table Header -->
          <div class="bg-gray-800 px-6 py-4 border-b border-gray-700">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-white">Tracking Plans Overview</h3>
                <p class="text-sm text-gray-400">{{ trackingPlans.length }} plan{{ trackingPlans.length !== 1 ? 's' : '' }} total</p>
              </div>
              
              <!-- Table Stats -->
              <div class="flex items-center gap-4 text-sm text-gray-400">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Active: {{ activePlansCount }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Completed: {{ completedPlansCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Table Content -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-800/50">
                <tr class="border-b border-gray-700">
                  <th class="text-left text-gray-300 font-medium py-3 px-4 text-sm min-w-[120px]">TR#</th>
                  <th class="text-center text-gray-300 font-medium py-3 px-4 text-sm">Entries</th>
                  <th class="text-right text-gray-300 font-medium py-3 px-4 text-sm">
                    <span class="text-green-400">Highest Cells</span>
                  </th>
                  <th class="text-right text-gray-300 font-medium py-3 px-4 text-sm">
                    <span class="text-red-400">Highest MP</span>
                  </th>
                  <th class="text-right text-gray-300 font-medium py-3 px-4 text-sm">
                    <span class="text-cyan-400">Highest Shards</span>
                  </th>
                  <th class="text-right text-gray-300 font-medium py-3 px-4 text-sm">
                    <span class="text-orange-400">Highest RP</span>
                  </th>
                  <th class="text-center text-gray-300 font-medium py-3 px-4 text-sm">Status</th>
                  <th class="text-center text-gray-300 font-medium py-3 px-4 text-sm min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="plan in sortedTrackingPlans" 
                  :key="plan.id"
                  class="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors cursor-pointer group"
                  @click="viewTrackingPlan(plan.id)"
                >
                  <!-- TR# -->
                  <td class="py-4 px-4">
                    <div class="flex items-center">
                      <div>
                        <div class="font-semibold text-white">TR#{{ plan.resetNumber }}</div>
                        <div class="text-xs text-gray-400 truncate max-w-[100px]" :title="plan.name">
                          {{ plan.name }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Entries -->
                  <td class="py-4 px-4 text-center">
                    <span class="text-white font-medium">{{ plan.entriesCount || 0 }}</span>
                  </td>

                  <!-- Highest Cells (Green) -->
                  <td class="py-4 px-4 text-right">
                    <span class="text-green-400 font-bold text-lg">
                      {{ getHighestValue(plan, 'cells') }}
                    </span>
                  </td>

                  <!-- Highest MP (Red) -->
                  <td class="py-4 px-4 text-right">
                    <span class="text-red-400 font-bold text-lg">
                      {{ getHighestValue(plan, 'mp') }}
                    </span>
                  </td>

                  <!-- Highest Shards (Light Blue) -->
                  <td class="py-4 px-4 text-right">
                    <span class="text-cyan-400 font-bold text-lg">
                      {{ getHighestValue(plan, 'shards') }}
                    </span>
                  </td>

                  <!-- Highest RP (Orange) -->
                  <td class="py-4 px-4 text-right">
                    <span class="text-orange-400 font-bold text-lg">
                      {{ getHighestValue(plan, 'rp') }}
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="py-4 px-4 text-center">
                    <span 
                      class="px-3 py-1 text-xs font-medium rounded-full inline-flex items-center"
                      :class="getStatusClasses(plan.status)"
                    >
                      <div 
                        class="w-1.5 h-1.5 rounded-full mr-2"
                        :class="getStatusDotColor(plan.status)"
                      ></div>
                      {{ (plan.status || 'new').charAt(0).toUpperCase() + (plan.status || 'new').slice(1) }}
                    </span>
                  </td>

                  <!-- Actions -->
                  <td class="py-4 px-4" @click.stop>
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click="viewTrackingPlan(plan.id)"
                        class="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded transition-colors"
                        title="View Plan"
                      >
                        <IconEye size="16" />
                      </button>
                      
                      <button
                        @click="addEntry(plan.id)"
                        :disabled="plan.status === 'completed'"
                        class="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed rounded transition-colors"
                        title="Add Entry"
                      >
                        <IconPlus size="16" />
                      </button>
                      
                      <button
                        @click="editTrackingPlan(plan.id)"
                        class="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded transition-colors"
                        title="Edit Plan"
                      >
                        <IconEdit size="16" />
                      </button>
                      
                      <button
                        @click="toggleStatus(plan.id)"
                        class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                        :title="plan.status === 'active' ? 'Complete Plan' : 'Reactivate Plan'"
                      >
                        <IconCheck v-if="plan.status === 'active'" size="16" />
                        <IconRefresh v-else size="16" />
                      </button>
                      
                      <button
                        @click="deleteTrackingPlan(plan.id)"
                        class="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                        title="Delete Plan"
                      >
                        <IconTrash size="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Table Footer -->
          <div class="bg-gray-800/50 px-6 py-3 border-t border-gray-700">
            <div class="flex items-center justify-between text-sm text-gray-400">
              <div>
                <span class="font-medium text-white">{{ trackingPlans.length }}</span> 
                plan{{ trackingPlans.length !== 1 ? 's' : '' }} total
              </div>
              <div class="text-xs">
                Last updated: {{ lastUpdated }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <TRSheetConnectionModal
      :show="showConnectionModal"
      @close="showConnectionModal = false"
      @connected="handleSheetConnected"
    />

    <TRNewTrackingPlanModal
      :show="showNewPlanModal"
      :sheetUrl="connectedSheetUrl"
      @close="showNewPlanModal = false"
      @created="handlePlanCreated"
    />

    <TRTrackingPlanView
      v-if="selectedPlan"
      :show="showPlanViewModal"
      :plan="selectedPlan"
      :sheetUrl="connectedSheetUrl"
      @close="showPlanViewModal = false"
      @entryAdded="handleEntryAddedFromPlanView"
    />

    <TRDailyEntryModal
      v-if="selectedPlan"
      :show="showDailyEntryModal"
      :plan="selectedPlan"
      @close="showDailyEntryModal = false"
      @submitted="handleDailyEntrySubmitted"
    />

    <TRTrackingSettingsModal
      :show="showSettingsModal"
      @close="showSettingsModal = false"
      @settingsUpdated="handleSettingsUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  IconChartLine, 
  IconSettings, 
  IconPlus, 
  IconAlertTriangle,
  IconFileText,
  IconLoader2,
  IconRefresh,
  IconEye,
  IconEdit,
  IconCheck,
  IconTrash,
  IconBrandGoogleFilled
} from '@tabler/icons-vue';

import TRSheetConnectionModal from './TRSheetConnectionModal.vue';
import TRNewTrackingPlanModal from './TRNewTrackingPlanModal.vue';
import TRTrackingPlanView from './TRTrackingPlanView.vue';
import TRDailyEntryModal from './TRDailyEntryModal.vue';
import TRTrackingSettingsModal from './TRTrackingSettingsModal.vue';
import { useTRTrackingStore } from '@/store/trTrackingStore';

// Store
const trackingStore = useTRTrackingStore();

// Reactive state
const showConnectionModal = ref(false);
const showNewPlanModal = ref(false);
const showPlanViewModal = ref(false);
const showDailyEntryModal = ref(false);
const showSettingsModal = ref(false);
const selectedPlanId = ref(null);

// Computed properties
const isConnected = computed(() => trackingStore.isSheetConnected);
const connectedSheetUrl = computed(() => trackingStore.sheetUrl);
const trackingPlans = computed(() => trackingStore.trackingPlans);
const isLoading = computed(() => trackingStore.isLoading);
const selectedPlan = computed(() => 
  selectedPlanId.value ? trackingPlans.value.find(p => p.id === selectedPlanId.value) : null
);

// Sorted plans for table view (by reset number)
const sortedTrackingPlans = computed(() => {
  return [...trackingPlans.value].sort((a, b) => (a.resetNumber || 0) - (b.resetNumber || 0));
});

// Plan counts
const activePlansCount = computed(() => 
  trackingPlans.value.filter(plan => plan.status === 'active').length
);

const completedPlansCount = computed(() => 
  trackingPlans.value.filter(plan => plan.status === 'completed').length
);

const lastUpdated = computed(() => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
});

// Methods
function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

function getStatusClasses(status) {
  switch (status) {
    case 'active':
      return 'bg-green-900/30 text-green-400 border border-green-500/30';
    case 'completed':
      return 'bg-blue-900/30 text-blue-400 border border-blue-500/30';
    case 'paused':
      return 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30';
    default:
      return 'bg-gray-900/30 text-gray-400 border border-gray-500/30';
  }
}

function getStatusDotColor(status) {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'completed':
      return 'bg-blue-500';
    case 'paused':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

function createNewTrackingPlan() {
  if (!isConnected.value) {
    showConnectionModal.value = true;
    return;
  }
  showNewPlanModal.value = true;
}

async function refreshPlans() {
  await trackingStore.loadTrackingPlans();
}

async function handleSheetConnected(sheetData) {
  showConnectionModal.value = false;
  
  setTimeout(async () => {
    if (isConnected.value) {
      await new Promise(resolve => {
        const unwatch = trackingStore.$subscribe(() => {
          if (!trackingStore.isLoading) {
            unwatch();
            resolve();
          }
        });
      });
      
      showNewPlanModal.value = true;
    }
  }, 500);
}

async function handlePlanCreated(planData) {
  showNewPlanModal.value = false;
  await trackingStore.loadTrackingPlans();
}

function handleSettingsUpdated(newSettings) {
  console.log('Resource settings updated:', newSettings);
}

function viewTrackingPlan(planId) {
  console.log('Opening plan view for:', planId);
  selectedPlanId.value = planId;
  showPlanViewModal.value = true;
}

function editTrackingPlan(planId) {
  console.log('Edit tracking plan:', planId);
  alert('Edit functionality coming soon!');
}

function deleteTrackingPlan(planId) {
  const plan = trackingPlans.value.find(p => p.id === planId);
  const planName = plan ? plan.name : planId;
  
  if (confirm(`Are you sure you want to delete "${planName}"? This action cannot be undone.`)) {
    console.log('Deleting tracking plan:', planId);
    alert('Delete functionality coming soon!');
  }
}

function addEntry(planId) {
  console.log('Adding entry for plan:', planId);
  selectedPlanId.value = planId;
  showDailyEntryModal.value = true;
}

function toggleStatus(planId) {
  console.log('Toggling status for plan:', planId);
  const plan = trackingPlans.value.find(p => p.id === planId);
  if (plan) {
    const newStatus = plan.status === 'active' ? 'completed' : 'active';
    console.log(`Changing ${plan.name} status from ${plan.status} to ${newStatus}`);
    alert(`Status toggle functionality coming soon!\nWould change from "${plan.status}" to "${newStatus}"`);
  }
}

async function handleEntryAddedFromPlanView(entryData) {
  console.log('=== HANDLE ENTRY ADDED FROM PLAN VIEW (OPTIMISTIC) ===');
  console.log('📥 Received entry data from PlanView:', entryData);
  console.log('🎯 Selected plan ID:', selectedPlanId.value);
  
  if (!entryData) {
    console.error('❌ No entry data received from PlanView');
    return;
  }
  
  if (!selectedPlanId.value) {
    console.error('❌ No selected plan ID');
    return;
  }
  
  try {
    console.log('📡 Starting background API call for PlanView entry...');
    
    // API Call im Hintergrund - NICHT-BLOCKIEREND
    trackingStore.addDailyEntry(selectedPlanId.value, entryData)
      .then(async (result) => {
        console.log('✅ Background API call successful:', result);
        
        // Bei Erfolg: Bestätige optimistischen Entry
        // TODO: Event an PlanView senden oder direkte Referenz verwenden
        confirmOptimisticEntryInPlanView(result);
        
        // Plans refreshen für konsistente Daten
        await trackingStore.loadTrackingPlans();
        console.log('✅ Plans refreshed after successful entry');
      })
      .catch(async (error) => {
        console.error('❌ Background API call failed:', error);
        
        // Bei Fehler: Entferne optimistischen Entry
        // TODO: Event an PlanView senden oder direkte Referenz verwenden
        removeOptimisticEntryInPlanView();
        
        // Plans refreshen um sicherzustellen, dass wir den korrekten Stand haben
        await trackingStore.loadTrackingPlans();
        
        showErrorToast('Failed to sync entry: ' + error.message);
      });
    
  } catch (error) {
    console.error('💥 Error in optimistic handleEntryAddedFromPlanView:', error);
    
    // Bei Fehler: Entferne optimistischen Entry
    removeOptimisticEntryInPlanView();
    showErrorToast('Failed to add entry: ' + error.message);
  }
}


async function handleDailyEntrySubmitted(entryData) {
  console.log('=== HANDLE DAILY ENTRY SUBMITTED ===');
  console.log('📥 Received entry data:', entryData);
  console.log('📥 Entry data type:', typeof entryData);
  console.log('📥 Entry data keys:', Object.keys(entryData || {}));
  console.log('🎯 Selected plan ID:', selectedPlanId.value);
  console.log('🌐 Sheet URL:', connectedSheetUrl.value);
  
  if (!entryData) {
    console.error('❌ No entry data received');
    return;
  }
  
  if (!selectedPlanId.value) {
    console.error('❌ No selected plan ID');
    return;
  }
  
  if (!connectedSheetUrl.value) {
    console.error('❌ No sheet URL');
    return;
  }
  
  try {
    console.log('🚀 Calling trackingStore.addDailyEntry...');
    console.log('📊 Parameters:');
    console.log('  - planId:', selectedPlanId.value);
    console.log('  - entryData:', entryData);
    
    const result = await trackingStore.addDailyEntry(selectedPlanId.value, entryData);
    
    console.log('✅ Store call completed, result:', result);
    
    showDailyEntryModal.value = false;
    selectedPlanId.value = null;
    
    console.log('🔄 Refreshing tracking plans...');
    await trackingStore.loadTrackingPlans();
    console.log('✅ Plans refreshed');
    
    alert('Daily entry added successfully!');
  } catch (error) {
    console.error('💥 Error in handleDailyEntrySubmitted:', error);
    console.error('💥 Error stack:', error.stack);
    alert('Failed to add daily entry: ' + error.message);
  }
}

function confirmOptimisticEntryInPlanView(apiResponse) {
  // Event senden
  window.dispatchEvent(new CustomEvent('tr-entry-confirmed', {
    detail: apiResponse
  }));
}

function removeOptimisticEntryInPlanView() {
  // Event senden
  window.dispatchEvent(new CustomEvent('tr-entry-failed', {
    detail: { error: 'API call failed' }
  }));
}

function getHighestValue(plan, resourceKey) {
  console.log(`📊 Getting highest ${resourceKey} for plan:`, plan.name);
  
  // QUICK FIX: Lade Resources on-demand
  if (!plan.resources || Object.keys(plan.resources).length === 0) {
    console.log(`📊 No resources cached, returning 0 for ${resourceKey}`);
    return '0';
  }
  
  // Prüfe Resources-Struktur
  if (plan.resources[resourceKey]) {
    const highest = plan.resources[resourceKey].highest || 0;
    const current = plan.resources[resourceKey].current || 0;
    const result = Math.max(highest, current);
    
    console.log(`📊 ${resourceKey}: highest=${highest}, current=${current}, result=${result}`);
    return result;
  }
  
  console.warn(`❌ No ${resourceKey} data found for plan:`, plan.name);
  return '0';
}

// Lifecycle
onMounted(async () => {
  trackingStore.loadConnectionState();
  
  if (isConnected.value) {
    await trackingStore.loadTrackingPlans();
  }
});
</script>

<style scoped>
.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
}

/* Custom spinner animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
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

/* Table hover effects */
tbody tr:hover {
  background-color: rgba(55, 65, 81, 0.3);
}

/* Smooth transitions */
.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease;
}
</style>