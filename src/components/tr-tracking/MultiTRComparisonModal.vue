<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4 mobile-modal-container"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-[95%] max-h-[90vh] md:max-h-[95vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 class="text-base font-bold text-white flex items-center">
            <IconTrendingUp size="16" class="mr-2 text-purple-400" />
            Multi-TR Comparison
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
      <div class="px-3 py-2 border-b border-gray-700">
        <p class="text-xs text-gray-300">
          Compare progress over time across all your TR tracks. Shows complete progression curves for selected resources.
        </p>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3">
        <!-- Chart Controls + Current Values Grid -->
        <div class="bg-gray-700/30 rounded-lg p-3">
          <div class="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-3">
            <!-- Left: Controls -->
            <div class="flex flex-col gap-3">
            <!-- X-Axis Selection -->
            <div>
              <div class="text-xs text-gray-400 mb-2">X-Axis:</div>
              <div class="flex gap-1 bg-gray-800 rounded-md p-1">
                <button
                  @click="xAxisType = 'timestamp'"
                  :class="[
                    'px-3 py-1.5 text-xs rounded transition-all duration-200 font-medium flex items-center gap-1.5',
                    xAxisType === 'timestamp'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  ]"
                >
                  <IconCalendarEvent size="14" />
                  Log Time
                </button>
                <button
                  @click="xAxisType = 'timeInTR'"
                  :disabled="!hasTimeInTRData"
                  :class="[
                    'px-3 py-1.5 text-xs rounded transition-all duration-200 font-medium flex items-center gap-1.5',
                    !hasTimeInTRData 
                      ? 'text-gray-600 cursor-not-allowed opacity-40'
                      : xAxisType === 'timeInTR'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  ]"
                  :title="!hasTimeInTRData ? 'Time in TR data not available in tracked entries' : ''"
                >
                  <IconClockHour2 size="14" />
                  Time in TR
                </button>
              </div>
            </div>

            <!-- Resource Selection -->
            <div>
              <div class="text-xs text-gray-400 mb-2">Resource:</div>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="resource in chartableResources"
                  :key="resource.id"
                  @click="selectResource(resource.id)"
                  class="px-2 py-1 text-xs rounded-md border transition-colors"
                  :class="[
                    chartSelectedResources.includes(resource.id)
                      ? 'bg-gray-800 border-gray-600'
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  ]"
                  :style="chartSelectedResources.includes(resource.id) ? { borderLeftWidth: '6px', borderLeftColor: resource.color } : {}"
                >
                  {{ resource.name }}
                </button>
              </div>
            </div>

            <!-- TR Track Selection -->
            <div>
              <div class="text-xs text-gray-400 mb-2">TR Tracks:</div>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="(track, idx) in availableTracks"
                  :key="track.id"
                  @click="toggleTrackInChart(track.id)"
                  class="px-2 py-1 text-xs rounded-md border transition-all duration-150"
                  :class="[
                    enabledTracks.includes(track.id)
                      ? 'text-gray-200 border-gray-600'
                      : 'text-gray-500 border-gray-700',
                    hoveredTrackId === track.id && 'ring-1 brightness-125'
                  ]"
                  :style="{
                    borderLeftWidth: enabledTracks.includes(track.id) ? '6px' : undefined,
                    borderLeftColor: enabledTracks.includes(track.id) ? trackColorMap[track.id] : undefined,
                    ringColor: hoveredTrackId === track.id ? trackColorMap[track.id] : undefined,
                    boxShadow: hoveredTrackId === track.id ? `0 0 0 1px ${trackColorMap[track.id]}` : undefined
                  }"
                >
                  TR#{{ track.trCount || 0 }} - {{ track.name }}
                  <span class="ml-1 text-xs opacity-75">({{ track.entries.length }})</span>
                </button>
              </div>
            </div>

            <!-- Friends Tracks Section -->
            <div v-if="friendsStore.isInitialized && friendsAvailableTracks.length > 0">
              <!-- Header -->
              <div class="flex items-center gap-2 mb-2">
                <div class="text-xs text-gray-400">Friends' Tracks:</div>
                <button
                  @click="showFriendsTracks = !showFriendsTracks"
                  class="text-xs px-2 py-0.5 rounded-md border transition-colors"
                  :class="showFriendsTracks 
                    ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300' 
                    : 'border-gray-600 text-gray-400 hover:text-gray-300'"
                >
                  <IconUsersGroup size="12" class="inline mr-1" />
                  {{ showFriendsTracks ? 'Hide Tracks' : 'Show Tracks' }} ({{ friendsAvailableTracks.length }})
                </button>
              </div>

              <!-- Filter Bar -->
              <div v-if="showFriendsTracks" class="flex flex-wrap items-center gap-2 mb-2">
                <!-- Search -->
                <div class="relative">
                  <IconSearch size="12" class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    v-model="friendSearchQuery"
                    type="text"
                    placeholder="Search..."
                    class="pl-6 pr-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none w-36"
                  />
                </div>

                <!-- Friend Filter Toggle -->
                <button
                  @click="showFriendFilter = !showFriendFilter"
                  class="flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-colors"
                  :class="enabledFriendUids.size > 0
                    ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300'
                    : showFriendFilter
                      ? 'bg-gray-700/60 border-gray-500/50 text-gray-300'
                      : 'border-gray-600 text-gray-400 hover:text-gray-300'"
                >
                  <IconFilter size="12" />
                  Friends{{ enabledFriendUids.size > 0 ? ` (${enabledFriendUids.size}/${uniqueFriends.length})` : '' }}
                </button>

                <!-- Match count -->
                <span v-if="friendSearchQuery || enabledFriendUids.size > 0 || ooFilterActive" class="text-xs text-gray-500">
                  {{ filteredVisibleFriendsTracks.length }} match{{ filteredVisibleFriendsTracks.length !== 1 ? 'es' : '' }}
                </span>

                <!-- Clear filters -->
                <button
                  v-if="friendSearchQuery || enabledFriendUids.size > 0 || ooFilterActive"
                  @click="friendSearchQuery = ''; enabledFriendUids = new Set(); resetOORange()"
                  class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>

              <!-- Friend Filter Checkboxes -->
              <div v-if="showFriendsTracks && showFriendFilter" class="flex flex-wrap gap-1 mb-2 p-2 bg-gray-800/60 rounded-md border border-gray-700/50">
                <button
                  @click="selectAllFriends"
                  class="px-2 py-0.5 text-xs rounded border transition-colors"
                  :class="enabledFriendUids.size === 0
                    ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300'
                    : 'border-gray-600 text-gray-400 hover:text-gray-300'"
                >
                  All
                </button>
                <button
                  v-for="friend in uniqueFriends"
                  :key="friend.uid"
                  @click="toggleFriendUid(friend.uid)"
                  class="px-2 py-0.5 text-xs rounded border transition-colors"
                  :class="enabledFriendUids.size === 0 || enabledFriendUids.has(friend.uid)
                    ? 'bg-indigo-900/30 border-indigo-500/40 text-indigo-200'
                    : 'border-gray-700 text-gray-500 hover:text-gray-400'"
                >
                  {{ friend.name }}
                  <span class="opacity-60">({{ friend.trackCount }})</span>
                </button>
              </div>

              <!-- OO Range Slider -->
              <div v-if="showFriendsTracks" class="mb-2 p-2 bg-gray-800/40 rounded-md border border-gray-700/40">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs text-gray-400">
                    OO Range:
                    <span :class="ooFilterActive ? 'text-purple-300 font-medium' : 'text-gray-500'">{{ ooMinDisplay }}</span>
                    <span class="text-gray-600 mx-0.5">–</span>
                    <span :class="ooFilterActive ? 'text-purple-300 font-medium' : 'text-gray-500'">{{ ooMaxDisplay }}</span>
                  </span>
                  <button v-if="ooFilterActive" @click="resetOORange" class="text-xs text-gray-500 hover:text-gray-300 transition-colors">Reset</button>
                </div>
                <div class="oo-range-container">
                  <div class="oo-range-track"></div>
                  <div class="oo-range-fill" :style="ooRangeFillStyle"></div>
                  <input type="range" class="oo-range-input" min="0" :max="OO_SLIDER_MAX" step="1"
                    :value="ooRangeMin" @input="onOORangeMinInput" />
                  <input type="range" class="oo-range-input" min="0" :max="OO_SLIDER_MAX" step="1"
                    :value="ooRangeMax" @input="onOORangeMaxInput" />
                </div>
                <div class="flex justify-between text-[9px] text-gray-600 mt-0.5 select-none" style="padding: 0 6px;">
                  <span>0</span><span>1k</span><span>1m</span><span>1b</span><span>1t</span><span>1qa</span><span>1qu</span><span>1sx</span><span>1sp</span><span>1o</span><span>1n</span><span>1d</span><span>∞</span>
                </div>
                <div class="text-[10px] text-gray-600 mt-1 italic">OO = Lifetime OO at TR start</div>
              </div>

              <!-- Visible Friends Tracks -->
              <div v-if="showFriendsTracks" class="flex flex-wrap gap-1">
                <button
                  v-for="fTrack in filteredVisibleFriendsTracks"
                  :key="fTrack.id"
                  @click="toggleFriendsTrackInChart(fTrack.id)"
                  class="px-2 py-1 text-xs rounded-md border transition-all duration-150"
                  :class="[
                    enabledFriendsTracks.includes(fTrack.id)
                      ? 'text-gray-200 border-indigo-600'
                      : 'text-gray-500 border-gray-700'
                  ]"
                  :style="{
                    borderLeftWidth: enabledFriendsTracks.includes(fTrack.id) ? '6px' : undefined,
                    borderLeftColor: enabledFriendsTracks.includes(fTrack.id) 
                      ? friendsTrackColorMap[fTrack.id] 
                      : undefined
                  }"
                >
                  {{ friendsStore.getFriendDisplayName(fTrack.ownerId, fTrack.ownerName) }}: TR#{{ fTrack.trackMeta?.trCount || 0 }} - {{ fTrack.trackMeta?.name || '?' }}
                  <span class="ml-1 text-xs opacity-75">({{ (fTrack.entries || []).length }})</span>
                  <span v-if="getTrackStartOO(fTrack) > 0" class="ml-1 text-[10px] text-purple-400/70">{{ formatSuffixInput(getTrackStartOO(fTrack)) }}</span>
                </button>
                <span v-if="filteredVisibleFriendsTracks.length === 0 && (friendSearchQuery || enabledFriendUids.size > 0 || ooFilterActive)" class="text-xs text-gray-500 italic py-1">
                  No tracks match filter
                </span>
              </div>

              <!-- Hidden Friends Tracks -->
              <div v-if="showFriendsTracks && filteredHiddenFriendsTracks.length > 0" class="mt-2">
                <button
                  @click="showHiddenFriendsTracks = !showHiddenFriendsTracks"
                  class="text-xs px-2 py-0.5 rounded-md border transition-colors mb-1"
                  :class="showHiddenFriendsTracks
                    ? 'bg-gray-700/60 border-gray-500/50 text-gray-300'
                    : 'border-gray-700 text-gray-500 hover:text-gray-400'"
                >
                  {{ showHiddenFriendsTracks ? '▾' : '▸' }} Hidden ({{ filteredHiddenFriendsTracks.length }})
                </button>
                <div v-if="showHiddenFriendsTracks" class="flex flex-wrap gap-1 mt-1">
                  <button
                    v-for="fTrack in filteredHiddenFriendsTracks"
                    :key="fTrack.id"
                    @click="toggleFriendsTrackInChart(fTrack.id)"
                    class="px-2 py-1 text-xs rounded-md border transition-all duration-150 opacity-60"
                    :class="[
                      enabledFriendsTracks.includes(fTrack.id)
                        ? 'text-gray-200 border-indigo-600'
                        : 'text-gray-500 border-gray-700'
                    ]"
                    :style="{
                      borderLeftWidth: enabledFriendsTracks.includes(fTrack.id) ? '6px' : undefined,
                      borderLeftColor: enabledFriendsTracks.includes(fTrack.id) 
                        ? friendsTrackColorMap[fTrack.id] 
                        : undefined
                    }"
                  >
                    {{ friendsStore.getFriendDisplayName(fTrack.ownerId, fTrack.ownerName) }}: TR#{{ fTrack.trackMeta?.trCount || 0 }} - {{ fTrack.trackMeta?.name || '?' }}
                    <span class="ml-1 text-xs opacity-75">({{ (fTrack.entries || []).length }})</span>
                    <span v-if="getTrackStartOO(fTrack) > 0" class="ml-1 text-[10px] text-purple-400/70">{{ formatSuffixInput(getTrackStartOO(fTrack)) }}</span>
                  </button>
                </div>
              </div>
            </div>
            </div>

            <!-- Right: Current Values -->

            <div 
              v-if="crosshairValues.length > 0" 
              class="bg-gray-800/90 border border-gray-600 rounded-lg p-2 self-start"
              style="backdrop-filter: blur(8px);"
            >
              <div class="text-xs font-medium text-gray-300 mb-2">Current Values:</div>
              <div class="space-y-1">
                <div 
                  v-for="item in crosshairValues.slice().reverse()" 
                  :key="item.label"
                  class="flex justify-between items-center text-xs transition-all duration-150 rounded px-1 -mx-1"
                  :class="hoveredTrackId === item.trackId ? 'bg-gray-700/60' : 'opacity-100'"
                  :style="hoveredTrackId && hoveredTrackId !== item.trackId ? { opacity: 0.35 } : {}"
                >
                  <div class="flex items-center min-w-0">
                    <div 
                      class="w-2 h-2 rounded-full mr-2 flex-shrink-0" 
                      :style="{ backgroundColor: item.color }"
                    ></div>
                    <span class="text-gray-300 truncate">{{ item.friendName ? `${item.friendName} ` : '' }}TR#{{ item.trCount }}</span>
                  </div>
                  <div class="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span class="font-mono text-white">{{ formatResourceValue(item.resourceId, item.value) }}</span>
                    <span 
                      class="font-mono text-xs px-1 py-0.5 rounded"
                      :class="{
                        'text-green-400 bg-green-900/30': item.difference > 0,
                        'text-red-400 bg-red-900/30': item.difference < 0,
                        'text-gray-400 bg-gray-700/30': item.difference === 0
                      }"
                    >
                      {{ item.difference > 0 ? '+' : item.difference < 0 ? '' : '' }}{{ item.difference === 0 ? '0' : item.diffIsReal ? formatNumber(item.difference) : formatResourceValue(item.resourceId, item.difference) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div v-if="(enabledTracks.length > 0 || enabledFriendsTracks.length > 0) && chartSelectedResources.length > 0" class="bg-gray-700/20 rounded-lg p-3">
          <!-- Chart Help & Controls -->
          <div class="mb-3 flex justify-between items-center">
            <div class="text-xs text-gray-400">
              <span class="font-medium">Mouse Controls:</span> 
              Click to place crosshair • Drag crosshair to move • Scroll to zoom • Drag slider to pan
            </div>
            <div class="flex gap-2">
              <button
                @click="resetChartZoom"
                class="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              >
                Reset Zoom
              </button>
            </div>
          </div>
          
          <div class="h-96 relative">
            <v-chart
              ref="chartRef"
              :option="chartOption"
              autoresize
              class="w-full h-full"
              style="cursor: crosshair;"
              @zr:mousedown="onMouseDown"
              @zr:mousemove="onMouseMove"
              @zr:mouseup="onMouseUp"
              @mouseover="onSeriesHighlight"
              @mouseout="onSeriesDownplay"
            />
          </div>
        </div>

        <!-- No Data State -->
        <div v-if="availableTracks.length <= 1" class="text-center py-12">
          <IconChartLine size="48" class="mx-auto text-gray-600 mb-3" />
          <h5 class="text-sm font-medium text-gray-300 mb-2">Need More TR Tracks</h5>
          <p class="text-xs text-gray-400 mb-4">
            Create at least 2 TR tracks to compare progress across multiple TRs
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatNumber, formatSuffixInput, parseSuffixInput } from '@/composables/format.js';
import { IconX, IconTrendingUp, IconChartLine, IconClockHour2, IconCalendarEvent, IconUsersGroup, IconSearch, IconFilter } from '@tabler/icons-vue';
import { useFriendsStore } from '@/store/friendsStore';
import { useTRTrackingStore } from '@/store/trTrackingStore';
import VChart from 'vue-echarts';
import '@/utils/echarts';
import { darkTooltip, darkXAxis, darkYAxis, darkGrid } from '@/utils/echarts';

const props = defineProps({
  show: Boolean,
  tracks: {
    type: Array,
    default: () => []
  },
  selectedResources: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close']);

const friendsStore = useFriendsStore();
const trTrackingStore = useTRTrackingStore();

// Chart state - backed by store for persistence
const chartSelectedResources = ref([...trTrackingStore.comparisonSettings.chartSelectedResources]);
const enabledTracks = ref([...trTrackingStore.comparisonSettings.enabledTracks]);
const enabledFriendsTracks = ref([...trTrackingStore.comparisonSettings.enabledFriendsTracks]);
const showFriendsTracks = ref(trTrackingStore.comparisonSettings.showFriendsTracks);
const xAxisType = ref(trTrackingStore.comparisonSettings.xAxisType || 'timeInTR');
const chartRef = ref(null);

// Friends filter state - backed by store for persistence
const showHiddenFriendsTracks = ref(trTrackingStore.comparisonSettings.showHiddenFriendsTracks);
const friendSearchQuery = ref(trTrackingStore.comparisonSettings.friendSearchQuery || '');
const enabledFriendUids = ref(new Set(trTrackingStore.comparisonSettings.enabledFriendUids || []));
const showFriendFilter = ref(trTrackingStore.comparisonSettings.showFriendFilter);

// OO Range filter
const OO_SLIDER_MAX = 72; // 72 positions → exponent 0..36 in 0.5 steps
const ooRangeMin = ref(trTrackingStore.comparisonSettings.ooRangeMin ?? 0);
const ooRangeMax = ref(trTrackingStore.comparisonSettings.ooRangeMax ?? OO_SLIDER_MAX);

function sliderToOO(pos) {
  if (pos <= 0) return 0;
  return Math.pow(10, pos * 0.5);
}

const ooFilterActive = computed(() => ooRangeMin.value > 0 || ooRangeMax.value < OO_SLIDER_MAX);

const ooMinDisplay = computed(() => {
  const val = sliderToOO(ooRangeMin.value);
  return val === 0 ? '0' : formatSuffixInput(val);
});

const ooMaxDisplay = computed(() => {
  return ooRangeMax.value >= OO_SLIDER_MAX ? '∞' : formatSuffixInput(sliderToOO(ooRangeMax.value));
});

const ooRangeFillStyle = computed(() => {
  const left = (ooRangeMin.value / OO_SLIDER_MAX) * 100;
  const right = 100 - (ooRangeMax.value / OO_SLIDER_MAX) * 100;
  return { left: `${left}%`, right: `${right}%` };
});

function onOORangeMinInput(e) {
  const val = parseInt(e.target.value);
  ooRangeMin.value = Math.min(val, ooRangeMax.value);
}

function onOORangeMaxInput(e) {
  const val = parseInt(e.target.value);
  ooRangeMax.value = Math.max(val, ooRangeMin.value);
}

function resetOORange() {
  ooRangeMin.value = 0;
  ooRangeMax.value = OO_SLIDER_MAX;
}

// Get starting OO value from a track's initialValues
function getTrackStartOO(track) {
  // Friend tracks have initialValues at top level, own tracks too
  const oo = track.initialValues?.ooLifetime;
  if (oo === undefined || oo === null || oo === '') return 0;
  return typeof oo === 'string' ? parseSuffixInput(oo) : Number(oo);
}

// Crosshair state
const crosshairDataX = ref(null);
const crosshairValues = ref([]);
const isDragging = ref(false);
const hoveredTrackId = ref(null);

// Use log10 scale for resources with extreme value ranges
const LOG_SCALE_RESOURCES = ['attgn3-buff', 'mat3-borge', 'mat3-ozzy', 'mat3-knox', 'oo-accum'];
const useLogScale = computed(() => {
  return chartSelectedResources.value.some(id => LOG_SCALE_RESOURCES.includes(id));
});

// Initialize chart resources when modal opens
watch(() => props.show, (newShow) => {
  if (newShow && chartableResources.value.length > 0) {
    const saved = trTrackingStore.comparisonSettings;
    const hasSavedResources = saved.chartSelectedResources && saved.chartSelectedResources.length > 0;
    
    if (hasSavedResources) {
      // Restore saved settings - filter to still-valid resources/tracks
      const validResourceIds = chartableResources.value.map(r => r.id);
      chartSelectedResources.value = saved.chartSelectedResources.filter(id => validResourceIds.includes(id));
      if (chartSelectedResources.value.length === 0) {
        chartSelectedResources.value = [validResourceIds[0] || 'mp'];
      }
      
      const validTrackIds = availableTracks.value.map(t => t.id);
      enabledTracks.value = saved.enabledTracks.filter(id => validTrackIds.includes(id));
      // If no saved tracks match (e.g. all deleted), enable all
      if (enabledTracks.value.length === 0 && saved.enabledTracks.length > 0) {
        enabledTracks.value = validTrackIds;
      }
      
      enabledFriendsTracks.value = [...saved.enabledFriendsTracks];
      showFriendsTracks.value = saved.showFriendsTracks;
      xAxisType.value = saved.xAxisType || 'timeInTR';
      friendSearchQuery.value = saved.friendSearchQuery || '';
      enabledFriendUids.value = new Set(saved.enabledFriendUids || []);
      showFriendFilter.value = saved.showFriendFilter;
      showHiddenFriendsTracks.value = saved.showHiddenFriendsTracks;
      ooRangeMin.value = saved.ooRangeMin ?? 0;
      ooRangeMax.value = saved.ooRangeMax ?? OO_SLIDER_MAX;
    } else {
      // First time defaults
      const defaultResources = ['mp'];
      const availableDefaults = defaultResources.filter(id => 
        chartableResources.value.some(r => r.id === id)
      );
      
      if (availableDefaults.length === 0 && chartableResources.value.length > 0) {
        availableDefaults.push(chartableResources.value[0].id);
      }
      
      chartSelectedResources.value = [availableDefaults[0]];
      enabledTracks.value = availableTracks.value.map(track => track.id);
      enabledFriendsTracks.value = [];
      showFriendsTracks.value = false;
      friendSearchQuery.value = '';
      enabledFriendUids.value = new Set();
      showFriendFilter.value = false;
      showHiddenFriendsTracks.value = false;
      ooRangeMin.value = 0;
      ooRangeMax.value = OO_SLIDER_MAX;
    }
    
    // Initialize crosshair at 24 hours
    crosshairDataX.value = 24;
    updateCrosshairValues(24);
  }
}, { immediate: true });

// Persist comparison settings to store on changes
watch(
  [chartSelectedResources, enabledTracks, enabledFriendsTracks, showFriendsTracks, xAxisType, friendSearchQuery, enabledFriendUids, showFriendFilter, showHiddenFriendsTracks, ooRangeMin, ooRangeMax],
  () => {
    trTrackingStore.updateComparisonSettings({
      chartSelectedResources: chartSelectedResources.value,
      enabledTracks: enabledTracks.value,
      enabledFriendsTracks: enabledFriendsTracks.value,
      showFriendsTracks: showFriendsTracks.value,
      xAxisType: xAxisType.value,
      friendSearchQuery: friendSearchQuery.value,
      enabledFriendUids: [...enabledFriendUids.value], // Set → Array for serialization
      showFriendFilter: showFriendFilter.value,
      showHiddenFriendsTracks: showHiddenFriendsTracks.value,
      ooRangeMin: ooRangeMin.value,
      ooRangeMax: ooRangeMax.value
    });
  },
  { deep: true }
);

// Watch for enabled tracks changes to update crosshair values
watch([enabledTracks, enabledFriendsTracks], () => {
  if (crosshairDataX.value !== null) {
    updateCrosshairValues(crosshairDataX.value);
  }
}, { deep: true });

// Reset chart zoom
function resetChartZoom() {
  if (chartRef.value) {
    chartRef.value.dispatchAction({ type: 'dataZoom', start: 0, end: 100 });
  }
}

// Convert pixel position to data X value within the grid
function getDataXFromPixel(pixelX, pixelY) {
  const chart = chartRef.value;
  if (!chart) return null;
  const pointInPixel = [pixelX, pixelY];
  if (!chart.containPixel('grid', pointInPixel)) return null;
  const dataPoint = chart.convertFromPixel({ seriesIndex: 0 }, pointInPixel);
  return dataPoint ? dataPoint[0] : null;
}

// Handle mousedown to start crosshair placement/drag
function onMouseDown(params) {
  const xValue = getDataXFromPixel(params.offsetX, params.offsetY);
  if (xValue !== null) {
    isDragging.value = true;
    crosshairDataX.value = xValue;
    updateCrosshairValues(xValue);
  }
}

// Handle mousemove for crosshair dragging
function onMouseMove(params) {
  if (!isDragging.value) return;
  const xValue = getDataXFromPixel(params.offsetX, params.offsetY);
  if (xValue !== null) {
    crosshairDataX.value = xValue;
    updateCrosshairValues(xValue);
  }
}

// Handle mouseup to stop dragging
function onMouseUp() {
  isDragging.value = false;
}

// Handle series hover to highlight corresponding track button
function onSeriesHighlight(params) {
  if (params.seriesIndex != null && chartDatasets.value[params.seriesIndex]) {
    hoveredTrackId.value = chartDatasets.value[params.seriesIndex].trackId;
  }
}

function onSeriesDownplay() {
  hoveredTrackId.value = null;
}

// Filter out notes and other non-relevant resources
const chartableResources = computed(() => {
  const excludeFromCharts = ['notes', 'hours-in-tr', 'daily-farm-frags', 'current-camp', 'camp-timer'];
  return props.selectedResources.filter(resource => !excludeFromCharts.includes(resource.id));
});

// Get tracks that have actual data
const availableTracks = computed(() => {
  return props.tracks
    .filter(track => track.entries && track.entries.length > 0)
    .sort((a, b) => (a.trCount || 0) - (b.trCount || 0));
});

// Check if Time in TR data is available
const hasTimeInTRData = computed(() => {
  return availableTracks.value.some(track => 
    track.entries && track.entries.some(entry => entry.values && entry.values['hours-in-tr'])
  );
});

// Parse value to log10 for resources with extreme ranges
function parseLog10Value(val) {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).trim();
  if (str === '0') return null;
  const eMatch = str.match(/^(\d+\.?\d*)[eE]\+?(\d+)$/);
  if (eMatch) {
    const mantissa = parseFloat(eMatch[1]);
    const exponent = parseInt(eMatch[2]);
    if (mantissa <= 0) return null;
    return Math.log10(mantissa) + exponent;
  }
  const num = parseFloat(str);
  if (!isFinite(num) || num <= 0) return null;
  return Math.log10(num);
}

function parseChartValue(val) {
  if (typeof val === 'string' && val.includes(':')) return NaN;
  const num = parseFloat(val);
  return isFinite(num) ? num : 0;
}

// Track colors
const trackColors = [
  '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#6366f1', '#84cc16'
];

// Friends track colors (different palette to distinguish)
const friendsTrackColors = [
  '#f472b6', '#a78bfa', '#34d399', '#fbbf24',
  '#fb923c', '#38bdf8', '#c084fc', '#a3e635'
];

// Stable color maps based on position in availableTracks (sorted by trCount)
// This ensures buttons and chart always use the same color for a track
const trackColorMap = computed(() => {
  const map = {};
  availableTracks.value.forEach((track, idx) => {
    map[track.id] = trackColors[idx % trackColors.length];
  });
  return map;
});

const friendsTrackColorMap = computed(() => {
  const map = {};
  friendsAvailableTracks.value.forEach((track, idx) => {
    map[track.id] = friendsTrackColors[idx % friendsTrackColors.length];
  });
  return map;
});

// Friends tracks that have entries
const friendsAvailableTracks = computed(() => {
  return (friendsStore.friendsTracks || [])
    .filter(t => t.entries && t.entries.length > 0)
    .sort((a, b) => (a.trackMeta?.trCount || 0) - (b.trackMeta?.trCount || 0));
});

// Visible (not hidden) friends tracks
const visibleFriendsAvailableTracks = computed(() => {
  return friendsAvailableTracks.value.filter(t => !friendsStore.isFriendTrackHidden(t.id));
});

// Hidden friends tracks
const hiddenFriendsAvailableTracks = computed(() => {
  return friendsAvailableTracks.value.filter(t => friendsStore.isFriendTrackHidden(t.id));
});

// Unique friends derived from available tracks
const uniqueFriends = computed(() => {
  const map = new Map();
  friendsAvailableTracks.value.forEach(t => {
    if (!map.has(t.ownerId)) {
      map.set(t.ownerId, {
        uid: t.ownerId,
        name: friendsStore.getFriendDisplayName(t.ownerId, t.ownerName),
        trackCount: 0
      });
    }
    map.get(t.ownerId).trackCount++;
  });
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
});

// Apply friend filter + search to visible tracks
const filteredVisibleFriendsTracks = computed(() => {
  return applyFriendsFilter(visibleFriendsAvailableTracks.value);
});

// Apply friend filter + search to hidden tracks
const filteredHiddenFriendsTracks = computed(() => {
  return applyFriendsFilter(hiddenFriendsAvailableTracks.value);
});

function applyFriendsFilter(tracks) {
  let result = tracks;
  
  // Filter by selected friends
  if (enabledFriendUids.value.size > 0) {
    result = result.filter(t => enabledFriendUids.value.has(t.ownerId));
  }
  
  // Filter by search query
  const q = friendSearchQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter(t => {
      const friendName = friendsStore.getFriendDisplayName(t.ownerId, t.ownerName).toLowerCase();
      const trackName = (t.trackMeta?.name || '').toLowerCase();
      const trNum = String(t.trackMeta?.trCount || '');
      return friendName.includes(q) || trackName.includes(q) || trNum.includes(q);
    });
  }
  
  // Filter by OO range
  if (ooFilterActive.value) {
    const minOO = sliderToOO(ooRangeMin.value);
    const maxOO = sliderToOO(ooRangeMax.value);
    result = result.filter(t => {
      const trackOO = getTrackStartOO(t);
      if (trackOO === 0) return ooRangeMin.value === 0; // tracks without OO data only pass if min is 0
      if (ooRangeMin.value > 0 && trackOO < minOO) return false;
      if (ooRangeMax.value < OO_SLIDER_MAX && trackOO > maxOO) return false;
      return true;
    });
  }
  
  return result;
}

function toggleFriendUid(uid) {
  const s = new Set(enabledFriendUids.value);
  if (s.has(uid)) {
    s.delete(uid);
  } else {
    s.add(uid);
  }
  enabledFriendUids.value = s;
}

function selectAllFriends() {
  enabledFriendUids.value = new Set();
}

function selectNoFriends() {
  enabledFriendUids.value = new Set(uniqueFriends.value.map(f => f.uid));
  // Actually "select none" means we want an empty filter that shows nothing
  // But our logic is: empty set = all shown. So for "none" we need a special approach.
  // Let's use a different approach: if set contains ALL uids, clear enabled friends tracks
  enabledFriendsTracks.value = [];
}

function toggleFriendsTrackInChart(trackId) {
  const idx = enabledFriendsTracks.value.indexOf(trackId);
  if (idx > -1) {
    enabledFriendsTracks.value.splice(idx, 1);
  } else {
    enabledFriendsTracks.value.push(trackId);
  }
}

// Build chart datasets (used by both chartOption and crosshair interpolation)
const chartDatasets = computed(() => {
  if (!chartSelectedResources.value.length || (!enabledTracks.value.length && !enabledFriendsTracks.value.length)) return [];
  
  const datasets = [];
  const tracksToShow = availableTracks.value.filter(track => enabledTracks.value.includes(track.id));
  
  chartSelectedResources.value.forEach(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return;
    
    // Own tracks
    tracksToShow.forEach((track, trackIndex) => {
      const sortedEntries = [...track.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const data = sortedEntries.map(entry => {
        const yValue = useLogScale.value
          ? parseLog10Value(entry.values?.[resourceId])
          : parseChartValue(entry.values?.[resourceId]);
        if (xAxisType.value === 'timeInTR') {
          const timeInTR = parseFloat(entry.values?.['hours-in-tr']) || 0;
          return [timeInTR, yValue];
        } else {
          return [new Date(entry.date).getTime(), yValue];
        }
      }).filter(point => {
        if (point[1] === null || point[1] === undefined) return false;
        if (xAxisType.value === 'timeInTR') return point[0] >= 0;
        return true;
      });
      
      const trackColor = trackColorMap.value[track.id] || trackColors[trackIndex % trackColors.length];
      
      datasets.push({
        name: `${resource.name} - TR#${track.trCount || 0} - ${track.name}`,
        data: data,
        color: trackColor,
        resourceId: resourceId,
        trackId: track.id,
        trCount: track.trCount || 0
      });
    });
    
    // Friends tracks
    const friendsToShow = friendsAvailableTracks.value.filter(t => enabledFriendsTracks.value.includes(t.id));
    friendsToShow.forEach((fTrack, fIdx) => {
      const sortedEntries = [...fTrack.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const data = sortedEntries.map(entry => {
        const yValue = useLogScale.value
          ? parseLog10Value(entry.values?.[resourceId])
          : parseChartValue(entry.values?.[resourceId]);
        if (xAxisType.value === 'timeInTR') {
          const timeInTR = parseFloat(entry.values?.['hours-in-tr']) || 0;
          return [timeInTR, yValue];
        } else {
          return [new Date(entry.date).getTime(), yValue];
        }
      }).filter(point => {
        if (point[1] === null || point[1] === undefined) return false;
        if (xAxisType.value === 'timeInTR') return point[0] >= 0;
        return true;
      });
      
      const fColor = friendsTrackColorMap.value[fTrack.id] || friendsTrackColors[fIdx % friendsTrackColors.length];
      const trCount = fTrack.trackMeta?.trCount || 0;
      const friendName = friendsStore.getFriendDisplayName(fTrack.ownerId, fTrack.ownerName);
      
      datasets.push({
        name: `${resource.name} - ${friendName} TR#${trCount} - ${fTrack.trackMeta?.name || '?'}`,
        data: data,
        color: fColor,
        resourceId: resourceId,
        trackId: fTrack.id,
        trCount: trCount,
        isFriend: true
      });
    });
  });
  
  return datasets;
});

// ECharts option
const chartOption = computed(() => {
  if (!chartDatasets.value.length) return null;
  
  const series = chartDatasets.value.map(ds => ({
    name: ds.name,
    type: 'line',
    data: ds.data,
    lineStyle: { color: ds.color, width: 2 },
    itemStyle: { color: ds.color },
    symbolSize: 4,
    showSymbol: true,
    smooth: 0.4,
    triggerLineEvent: true,
    emphasis: { focus: 'series' }
  }));
  
  // Add crosshair markLine if set
  if (crosshairDataX.value !== null && series.length > 0) {
    series[0].markLine = {
      silent: true,
      symbol: ['none', 'none'],
      lineStyle: { color: '#9ca3af', width: 1, type: 'dashed' },
      label: { show: false },
      data: [{ xAxis: crosshairDataX.value }],
      animation: false
    };
  }
  
  const xAxisConfig = xAxisType.value === 'timeInTR' ? {
    type: 'value',
    ...darkXAxis,
    name: 'Time in TR (hours)',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: { color: '#e5e7eb', fontSize: 12 },
    axisLabel: {
      ...darkXAxis.axisLabel,
      formatter: (v) => `${Math.round(v)}h`
    }
  } : {
    type: 'time',
    ...darkXAxis,
    name: 'Log Time',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: { color: '#e5e7eb', fontSize: 12 }
  };
  
  const yAxisConfig = {
    type: 'value',
    ...darkYAxis,
    scale: true,
    min: 'dataMin',
    name: useLogScale.value ? 'log₁₀ scale' : undefined,
    nameTextStyle: useLogScale.value ? { color: '#e5e7eb', fontSize: 12 } : undefined,
    axisLabel: {
      ...darkYAxis.axisLabel,
      formatter: (v) => {
        if (!useLogScale.value) return formatNumber(v);
        const realValue = Math.pow(10, v);
        if (!isFinite(realValue)) return `1e${Math.round(v)}`;
        const hasSuffixResource = chartSelectedResources.value.some(id => ['oo-accum'].includes(id));
        return hasSuffixResource ? formatSuffixInput(realValue) : formatNumber(realValue);
      }
    }
  };
  
  return {
    backgroundColor: 'transparent',
    animation: false,
    grid: { ...darkGrid, bottom: 80, right: 60, top: 20 },
    legend: { show: false },
    tooltip: {
      show: false // We use crosshair display instead
    },
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    dataZoom: [
      { type: 'inside', xAxisIndex: 0 },
      { type: 'inside', yAxisIndex: 0 },
      { type: 'slider', xAxisIndex: 0, bottom: 10, height: 20,
        textStyle: { color: '#9ca3af' },
        borderColor: 'rgba(75, 85, 99, 0.5)',
        fillerColor: 'rgba(59, 130, 246, 0.15)',
        handleStyle: { color: '#6b7280' }
      },
      { type: 'slider', yAxisIndex: 0, right: 0, width: 20,
        textStyle: { color: '#9ca3af' },
        borderColor: 'rgba(75, 85, 99, 0.5)',
        fillerColor: 'rgba(59, 130, 246, 0.15)',
        handleStyle: { color: '#6b7280' }
      }
    ],
    series: series
  };
});

// Calculate interpolated values for crosshair 
function updateCrosshairValues(xValue) {
  const values = [];
  const resourceGroups = {};
  
  chartDatasets.value.forEach(ds => {
    if (!ds.data.length) return;
    // Skip tracks that are not enabled (own or friends)
    if (ds.isFriend) {
      if (!enabledFriendsTracks.value.includes(ds.trackId)) return;
    } else {
      if (!enabledTracks.value.includes(ds.trackId)) return;
    }
    
    const resourceId = ds.resourceId;
    if (!resourceGroups[resourceId]) resourceGroups[resourceId] = [];
    
    // Find closest data points for interpolation
    let leftPoint = null;
    let rightPoint = null;
    
    for (let i = 0; i < ds.data.length; i++) {
      const point = ds.data[i];
      const pointX = point[0];
      
      if (pointX <= xValue) {
        leftPoint = { x: pointX, y: point[1] };
      }
      if (pointX >= xValue && !rightPoint) {
        rightPoint = { x: pointX, y: point[1] };
        break;
      }
    }
    
    let interpolatedY = null;
    
    if (leftPoint && rightPoint && leftPoint.x !== rightPoint.x) {
      const ratio = (xValue - leftPoint.x) / (rightPoint.x - leftPoint.x);
      interpolatedY = leftPoint.y + (rightPoint.y - leftPoint.y) * ratio;
    } else if (leftPoint) {
      interpolatedY = leftPoint.y;
    } else if (rightPoint) {
      interpolatedY = rightPoint.y;
    }
    
    if (interpolatedY !== null) {
      resourceGroups[resourceId].push({
        label: ds.name,
        value: interpolatedY,
        resourceId: ds.resourceId,
        color: ds.color,
        trCount: ds.trCount,
        trackId: ds.trackId,
        friendName: ds.isFriend ? ds.name.split(' - ')[1]?.split(' TR#')[0] || '' : null
      });
    }
  });
  
  // Calculate differences and flatten groups
  Object.values(resourceGroups).forEach(group => {
    group.sort((a, b) => (a.trCount || 0) - (b.trCount || 0));
    
    for (let i = 0; i < group.length; i++) {
      const item = group[i];
      if (i > 0) {
        const prevItem = group[i - 1];
        if (LOG_SCALE_RESOURCES.includes(item.resourceId) && useLogScale.value) {
          const realValue = Math.pow(10, item.value);
          const prevRealValue = Math.pow(10, prevItem.value);
          item.difference = isFinite(realValue) && isFinite(prevRealValue)
            ? realValue - prevRealValue
            : item.value - prevItem.value;
          item.diffIsReal = isFinite(realValue) && isFinite(prevRealValue);
        } else {
          item.difference = item.value - prevItem.value;
          item.diffIsReal = false;
        }
      } else {
        item.difference = 0;
      }
      values.push(item);
    }
  });
  
  crosshairValues.value = values;
}

// Helper function to extract TR count from dataset label
function extractTRCount(label) {
  const match = label.match(/TR#(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Initialize crosshair when modal opens
watch(() => props.show, (newShow) => {
  if (newShow) {
    crosshairValues.value = [];
    // Initialize crosshair at 24h after a short delay
    setTimeout(() => {
      crosshairDataX.value = 24;
      updateCrosshairValues(24);
    }, 100);
  }
});

function selectResource(resourceId) {
  const forbidden = ['hours-in-tr', 'notes', 'daily-farm-frags', 'current-camp', 'camp-timer'];
  if (forbidden.includes(resourceId)) return;
  chartSelectedResources.value = [resourceId];
}

function toggleTrackInChart(trackId) {
  const index = enabledTracks.value.indexOf(trackId);
  if (index > -1) {
    enabledTracks.value.splice(index, 1);
  } else {
    enabledTracks.value.push(trackId);
  }
}

function formatResourceValue(resourceId, value) {
  if (LOG_SCALE_RESOURCES.includes(resourceId) && useLogScale.value) {
    if (value === 0 || value === null) return '0';
    const realValue = Math.pow(10, value);
    if (!isFinite(realValue)) return `1e${Math.round(value)}`;
    if (['oo-accum', 'lr-ticks'].includes(resourceId)) return formatSuffixInput(realValue);
    return formatNumber(realValue);
  }
  if (resourceId === 'oo-accum' || resourceId === 'lr-ticks' || resourceId === 'attgn3-buff') {
    return formatSuffixInput(value);
  }
  return formatNumber(value);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
</script>

<style scoped>
.mobile-modal-container {
  padding-bottom: 2rem;
}

@media (max-width: 768px) {
  .mobile-modal-container {
    padding-bottom: var(--mobile-safe-bottom, 70px);
    padding-top: 80px;
  }
}

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

/* Dual-thumb OO range slider */
.oo-range-container {
  position: relative;
  height: 24px;
}

.oo-range-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  transform: translateY(-50%);
  background: #374151;
  border-radius: 2px;
}

.oo-range-fill {
  position: absolute;
  top: 50%;
  height: 4px;
  transform: translateY(-50%);
  background: #7c3aed;
  border-radius: 2px;
}

.oo-range-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
  margin: 0;
  padding: 0;
}

.oo-range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #a78bfa;
  border: 2px solid #7c3aed;
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.15s;
}

.oo-range-input::-webkit-slider-thumb:hover {
  background: #c4b5fd;
}

.oo-range-input::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #a78bfa;
  border: 2px solid #7c3aed;
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.15s;
}

.oo-range-input::-moz-range-thumb:hover {
  background: #c4b5fd;
}

.oo-range-input::-moz-range-track {
  background: transparent;
  border: none;
}
</style>
