<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-[85%] max-w-6xl max-h-[95vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 flex justify-between items-center">
        <div v-if="track">
          <h3 class="text-base font-bold text-white flex items-center">
            <IconChartLine size="16" class="mr-2 text-green-400" />
            {{ track.name }} - Progress & Charts
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
          View detailed progress charts and analysis for your TR tracking data
        </p>
      </div>

      <!-- Content -->
      <div class="p-3 space-y-3" v-if="track">
        <!-- Charts Section -->
        <div v-if="track.entries.length > 1">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center">
              <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
              <h4 class="font-medium text-sm text-blue-200">Progress Charts</h4>
            </div>
            <div class="flex gap-3">
              <!-- X-Axis Selection -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">X-Axis:</label>
                <div class="flex gap-1 bg-gray-800 rounded-md p-1">
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
                </div>
              </div>
              
              <!-- Chart Type Selection -->
              <div class="flex flex-col gap-1">
                <label class="text-xs text-gray-400 font-medium">Chart-Type:</label>
                <div class="flex gap-1">
                  <button
                    v-for="chartType in chartTypes"
                    :key="chartType.id"
                    @click="activeChartType = chartType.id"
                    :class="[
                      'px-2 py-1.5 text-xs rounded transition-colors font-medium',
                      activeChartType === chartType.id
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                    ]"
                  >
                    {{ chartType.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Chart Container -->
          <div class="bg-gray-700/30 rounded-md p-4">
            <!-- Chart Help & Controls -->
            <div class="mb-3 flex justify-between items-center">
              <div class="text-xs text-gray-400">
                <span class="font-medium">Mouse Controls:</span> 
                Scroll to zoom • Drag slider to pan
              </div>
              <button
                @click="resetChartZoom"
                class="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              >
                Reset Zoom
              </button>
            </div>
            
            <!-- Resource Selection for Charts -->
            <div class="mb-4 flex flex-wrap gap-2">
              <button
                v-for="resource in chartableResources"
                :key="resource.id"
                @click="toggleResourceInChart(resource.id)"
                :class="[
                  'px-2 py-1 text-xs rounded flex items-center gap-1 transition-colors',
                  chartSelectedResources.includes(resource.id)
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                ]"
              >
                <div
                  class="w-2 h-2 rounded-full"
                  :style="{ backgroundColor: resource.color }"
                ></div>
                {{ resource.name }}
              </button>
            </div>
            
            <!-- Chart Display -->
            <div class="h-[500px] relative bg-transparent">
              <v-chart
                v-if="chartOption"
                ref="chartRef"
                :option="chartOption"
                autoresize
                class="w-full h-full"
              />
            </div>
          </div>
        </div>

        <!-- Progress Overview -->
        <div v-if="track.entries.length > 1 && overviewResources.length > 0">
          <div class="flex items-center mb-1.5">
            <div class="w-1.5 h-5 bg-green-500 rounded-r mr-2"></div>
            <h4 class="font-medium text-sm text-green-200">Progress Overview</h4>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div
              v-for="resource in overviewResources"
              :key="resource.id"
              class="bg-gray-700/30 rounded-md p-2"
            >
              <div class="flex items-center mb-1">
                <div
                  class="w-2 h-2 rounded-full mr-1"
                  :style="{ backgroundColor: resource.color }"
                ></div>
                <span class="text-xs font-medium text-white">{{ resource.name }}</span>
              </div>
              
              <div class="space-y-0.5 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-400">Current:</span>
                  <span class="text-white">{{ formatNumber(getCurrentValue(resource.id)) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Total Gain:</span>
                  <span class="text-green-400">+{{ formatNumber(getTotalGain(resource.id)) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Avg/Day:</span>
                  <span class="text-blue-400">{{ formatNumber(getAvgPerDay(resource.id)) }}/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div v-if="track.entries.length <= 1" class="text-center py-12">
          <IconChartLine size="48" class="mx-auto text-gray-600 mb-3" />
          <h5 class="text-sm font-medium text-gray-300 mb-2">Not Enough Data</h5>
          <p class="text-xs text-gray-400">
            Add at least 2 entries to view progress analysis and charts.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end pt-2 border-t border-gray-700 px-3 pb-3">
        <button
          @click="$emit('close')"
          class="px-3 py-1.5 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-xs"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatNumber, formatSuffixInput } from '@/composables/format.js';
import { IconX, IconChartLine, IconTrendingUp, IconClockHour2, IconCalendarEvent } from '@tabler/icons-vue';
import VChart from 'vue-echarts';
import '@/utils/echarts';
import { darkTooltip, darkXAxis, darkYAxis, darkGrid } from '@/utils/echarts';

const props = defineProps({
  show: Boolean,
  track: Object,
  selectedResources: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close']);

// Chart state
const activeChartType = ref('line');
const chartSelectedResources = ref([]);
const xAxisType = ref('timeInTR'); // 'timestamp' or 'timeInTR' - Default: Time in TR
const chartRef = ref(null); // Reference to ECharts instance

const chartTypes = [
  { id: 'line', name: 'Progress' },
  { id: 'area', name: 'Cumulative' },
  { id: 'bar', name: 'Comparison' },
  { id: 'gains', name: 'Gains' }
];

// Initialize chart resources when modal opens
watch(() => props.show, (newShow) => {
  if (newShow && chartableResources.value.length > 0) {
    const savedResources = loadChartResourcesFromStorage();
    
    if (savedResources && savedResources.length > 0) {
      const availableSavedResources = savedResources.filter(id => 
        chartableResources.value.some(r => r.id === id)
      );
      
      if (availableSavedResources.length > 0) {
        chartSelectedResources.value = availableSavedResources;
      } else {
        setDefaultChartResources();
      }
    } else {
      setDefaultChartResources();
    }
  }
}, { immediate: true });

// Watch for chartSelectedResources changes to save to localStorage
watch(chartSelectedResources, (newResources) => {
  saveChartResourcesToStorage(newResources);
}, { deep: true });

// Reset chart zoom function
function resetChartZoom() {
  if (chartRef.value) {
    chartRef.value.dispatchAction({ type: 'dataZoom', start: 0, end: 100 });
  }
}

// Filter out notes and other non-relevant resources from chartable resources
const chartableResources = computed(() => {
  const excludeFromCharts = ['notes', 'hours-in-tr', 'daily-farm-frags', 'current-camp', 'camp-timer', 'attgn3-buff'];
  return props.selectedResources.filter(resource => !excludeFromCharts.includes(resource.id));
});

// Filter out notes and other non-relevant resources from overview
const overviewResources = computed(() => {
  const excludeFromOverview = ['notes', 'hours-in-tr', 'daily-farm-frags', 'current-camp', 'camp-timer', 'attgn3-buff'];
  return props.selectedResources.filter(resource => !excludeFromOverview.includes(resource.id));
});

// Check if Time in TR data is available
const hasTimeInTRData = computed(() => {
  return sortedEntries.value.some(entry => entry.values && entry.values['hours-in-tr']);
});

// Chart data computeds
const sortedEntries = computed(() => {
  if (!props.track?.entries) return [];
  return [...props.track.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
});

// All entries sorted by date - no filtering needed
const filteredEntries = computed(() => {
  return sortedEntries.value;
});

// Robust data sanitization function
const parseChartValue = (val) => {
  if (typeof val === 'string' && val.includes(':')) return NaN;
  const num = parseFloat(val);
  return isFinite(num) ? num : 0;
};

// Format resource value for tooltip
function formatResourceValue(resourceId, value) {
  if (resourceId === 'oo-accum') return formatSuffixInput(value);
  return formatNumber(value);
}

// Unified ECharts option computed - handles all 4 chart types
const chartOption = computed(() => {
  if (!chartSelectedResources.value.length || !filteredEntries.value.length) return null;
  
  const isGains = activeChartType.value === 'gains';
  const isArea = activeChartType.value === 'area';
  const isBar = activeChartType.value === 'bar';
  const entries = filteredEntries.value;
  
  // Build category labels for timeInTR mode
  let categoryLabels = null;
  if (xAxisType.value === 'timeInTR') {
    const hasTimeInTR = entries.some(entry => entry.values?.['hours-in-tr']);
    if (hasTimeInTR) {
      categoryLabels = isGains 
        ? entries.slice(1).map(entry => entry.values?.['hours-in-tr'] || '0:00')
        : entries.map(entry => entry.values?.['hours-in-tr'] || '0:00');
    }
  }
  
  // Build series for each selected resource
  const series = chartSelectedResources.value.map(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return null;
    
    const color = resource.color;
    const bgColor = color.length === 9 ? color.slice(0, 7) : color;
    
    if (isGains) {
      // Gains chart: differences between consecutive entries
      const data = [];
      for (let i = 1; i < entries.length; i++) {
        const current = parseChartValue(entries[i].values?.[resourceId]);
        const previous = parseChartValue(entries[i - 1].values?.[resourceId]);
        const gain = current - previous;
        
        if (xAxisType.value === 'timeInTR') {
          data.push(gain);
        } else {
          data.push([new Date(entries[i].date).getTime(), gain]);
        }
      }
      
      return {
        name: resource.name,
        type: 'bar',
        data: data,
        resourceId: resourceId,
        itemStyle: { color: bgColor + '80', borderColor: color, borderWidth: 1 },
        barMaxWidth: 50
      };
    } else {
      // Line/Area/Bar chart
      const data = entries.map(entry => {
        const value = parseChartValue(entry.values?.[resourceId]);
        if (xAxisType.value === 'timeInTR') {
          return value;
        } else {
          return [new Date(entry.date).getTime(), value];
        }
      });
      
      const seriesType = isBar ? 'bar' : 'line';
      
      return {
        name: resource.name,
        type: seriesType,
        data: data,
        resourceId: resourceId,
        lineStyle: seriesType === 'line' ? { color: color, width: 2 } : undefined,
        itemStyle: { color: color },
        symbolSize: seriesType === 'line' ? 6 : undefined,
        showSymbol: seriesType === 'line',
        smooth: seriesType === 'line' ? 0.4 : undefined,
        areaStyle: isArea ? { opacity: 0.2 } : undefined,
        barMaxWidth: seriesType === 'bar' ? 50 : undefined
      };
    }
  }).filter(Boolean);
  
  // X-axis config
  const xAxisConfig = xAxisType.value === 'timeInTR' ? {
    type: 'category',
    data: categoryLabels,
    ...darkXAxis,
    name: 'Time in TR',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: { color: '#9ca3af', fontSize: 12 }
  } : {
    type: 'time',
    ...darkXAxis,
    name: 'Log Time',
    nameLocation: 'center',
    nameGap: 30,
    nameTextStyle: { color: '#9ca3af', fontSize: 12 }
  };
  
  // Y-axis label formatter
  const yLabelFormatter = isGains 
    ? (v) => { const prefix = v >= 0 ? '+' : ''; return prefix + formatNumber(Math.abs(v)); }
    : (v) => formatNumber(v);
  
  return {
    backgroundColor: 'transparent',
    animation: false,
    grid: { ...darkGrid, bottom: 80, right: 30 },
    legend: {
      show: true,
      top: 0,
      textStyle: { color: '#e5e7eb', fontSize: 12 }
    },
    tooltip: {
      ...darkTooltip,
      trigger: 'axis',
      axisPointer: { type: isBar || isGains ? 'shadow' : 'cross' },
      formatter: (params) => {
        if (!params || !params.length) return '';
        const firstParam = params[0];
        let title;
        if (xAxisType.value === 'timeInTR') {
          title = `Time in TR: ${firstParam.name || firstParam.axisValue}`;
        } else {
          const date = new Date(firstParam.value[0]);
          title = date.toLocaleString();
        }
        
        let body = `<strong>${title}</strong>`;
        params.forEach(p => {
          const value = xAxisType.value === 'timeInTR' ? p.value : p.value[1];
          const resourceId = p.seriesName;
          const resource = chartableResources.value.find(r => r.name === resourceId);
          const rid = resource?.id || '';
          
          let formattedValue;
          if (isGains) {
            const prefix = value >= 0 ? '+' : '';
            formattedValue = rid === 'oo-accum' 
              ? prefix + formatSuffixInput(Math.abs(value))
              : prefix + formatNumber(Math.abs(value));
          } else {
            formattedValue = rid === 'oo-accum' 
              ? formatSuffixInput(value) 
              : formatNumber(value);
          }
          
          body += `<br/>${p.marker} ${p.seriesName}: ${formattedValue}`;
        });
        return body;
      }
    },
    xAxis: xAxisConfig,
    yAxis: {
      type: 'value',
      ...darkYAxis,
      min: isGains ? undefined : 'dataMin',
      axisLabel: {
        ...darkYAxis.axisLabel,
        formatter: yLabelFormatter
      }
    },
    dataZoom: [
      { type: 'inside', xAxisIndex: 0 },
      { type: 'slider', xAxisIndex: 0, bottom: 10, height: 20,
        textStyle: { color: '#9ca3af' },
        borderColor: 'rgba(75, 85, 99, 0.5)',
        fillerColor: 'rgba(59, 130, 246, 0.15)',
        handleStyle: { color: '#6b7280' }
      }
    ],
    series: series
  };
});

// Methods
function toggleResourceInChart(resourceId) {
  const forbidden = ['hours-in-tr', 'notes', 'daily-farm-frags', 'current-camp', 'camp-timer', 'attgn3-buff'];
  if (forbidden.includes(resourceId)) return;
  
  const index = chartSelectedResources.value.indexOf(resourceId);
  if (index > -1) {
    chartSelectedResources.value.splice(index, 1);
  } else {
    if (chartSelectedResources.value.length < 5) {
      chartSelectedResources.value.push(resourceId);
    }
  }
}

// Local Storage functions for chart resources
function saveChartResourcesToStorage(resources) {
  try {
    localStorage.setItem('tr-progress-chart-selected-resources', JSON.stringify(resources));
  } catch (error) {
    console.warn('Failed to save chart resources to localStorage:', error);
  }
}

function loadChartResourcesFromStorage() {
  try {
    const saved = localStorage.getItem('tr-progress-chart-selected-resources');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load chart resources from localStorage:', error);
    return null;
  }
}

function setDefaultChartResources() {
  // Select MP, MP(Accum), Shards, and RP by default
  const defaultResources = ['mp', 'mp-accum', 'shards', 'rp'];
  const availableDefaults = defaultResources.filter(id => 
    chartableResources.value.some(r => r.id === id)
  );
  
  // If not all defaults are available, add other resources to reach 4
  if (availableDefaults.length < 4) {
    const otherResources = chartableResources.value
      .filter(r => !defaultResources.includes(r.id))
      .slice(0, 4 - availableDefaults.length)
      .map(r => r.id);
    
    // Explicitly block forbidden resources from charts
    const forbidden = ['hours-in-tr', 'notes', 'daily-farm-frags', 'current-camp', 'camp-timer', 'attgn3-buff'];
    chartSelectedResources.value = [...new Set(
      [...availableDefaults, ...otherResources].filter(id => !forbidden.includes(id))
    )];
  } else {
    chartSelectedResources.value = availableDefaults;
  }
}

// Methods
function getCurrentValue(resourceId) {
  if (!props.track || props.track.entries.length === 0) return 0;
  
  const latestEntry = props.track.entries
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  
  return latestEntry.values[resourceId] || 0;
}

function getTotalGain(resourceId) {
  if (!props.track || props.track.entries.length < 2) return 0;
  
  const sortedEntries = [...props.track.entries]
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const firstValue = sortedEntries[0].values[resourceId] || 0;
  const lastValue = sortedEntries[sortedEntries.length - 1].values[resourceId] || 0;
  
  return lastValue - firstValue;
}

function getAvgPerDay(resourceId) {
  const totalGain = getTotalGain(resourceId);
  const duration = getTrackDuration();
  
  if (duration === 0) return 0;
  return totalGain / duration;
}

function getTrackDuration() {
  if (!props.track) return 0;
  
  const startDate = new Date(props.track.startDate);
  const endDate = props.track.endDate ? new Date(props.track.endDate) : new Date();
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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
