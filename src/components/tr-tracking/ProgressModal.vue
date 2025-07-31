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
                Drag to pan X & Y • Scroll for X-zoom • Ctrl+scroll for zoom • Ctrl+drag for box zoom
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
            <div class="h-[500px] relative bg-transparent" :key="`chart-container-${chartRenderKey}`">
              <!-- Line Chart -->
              <div v-if="activeChartType === 'line' && chartData" class="w-full h-full">
                <Line
                  ref="chartRef"
                  :data="chartData"
                  :options="chartOptions"
                  :key="`line-${chartRenderKey}`"
                  class="w-full h-full"
                />
              </div>
              
              <!-- Bar Chart -->
              <div v-if="activeChartType === 'bar' && chartData" class="w-full h-full">
                <Bar
                  ref="chartRef"
                  :data="chartData"
                  :options="chartOptions"
                  :key="`bar-${chartRenderKey}`"
                  class="w-full h-full"
                />
              </div>
              
              <!-- Area Chart -->
              <div v-if="activeChartType === 'area' && areaChartData" class="w-full h-full">
                <Line
                  ref="chartRef"
                  :data="areaChartData"
                  :options="chartOptions"
                  :key="`area-${chartRenderKey}`"
                  class="w-full h-full"
                />
              </div>
              
              <!-- Gains Chart -->
              <div v-if="activeChartType === 'gains' && gainsChartData" class="w-full h-full">
                <Bar
                  ref="chartRef"
                  :data="gainsChartData"
                  :options="gainsChartOptions"
                  :key="`gains-${chartRenderKey}`"
                  class="w-full h-full"
                />
              </div>
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
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { formatNumber, formatSuffixInput } from '@/composables/format.js';
import { IconX, IconChartLine, IconTrendingUp, IconClockHour2, IconCalendarEvent } from '@tabler/icons-vue';
import { Line, Bar } from 'vue-chartjs';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';

// Register Chart.js plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

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
const chartRenderKey = ref(0); // Force chart re-render
const chartRef = ref(null); // Reference to chart instance

const chartTypes = [
  { id: 'line', name: 'Progress' },
  { id: 'area', name: 'Cumulative' },
  { id: 'bar', name: 'Comparison' },
  { id: 'gains', name: 'Gains' }
];

// Custom wheel event listener for Ctrl+Scroll X-axis zoom
let wheelEventListener = null;

// Setup custom wheel listener when chart is ready
function setupCustomWheelListener() {
  if (chartRef.value && chartRef.value.chart && chartRef.value.chart.canvas) {
    const canvas = chartRef.value.chart.canvas;
    
    // Remove existing listener
    if (wheelEventListener) {
      canvas.removeEventListener('wheel', wheelEventListener);
    }
    
    wheelEventListener = (event) => {
      if (event.ctrlKey) {
        // Ctrl+Scroll: Y-axis zoom (let Chart.js plugin handle this)
        return;
      } else {
        // Normal scroll: X-axis zoom (custom implementation)
        event.preventDefault();
        
        const chart = chartRef.value.chart;
        if (!chart) return;
        
        const xAxis = chart.scales.x;
        if (!xAxis) return;
        
        // Get zoom factor
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        
        // Calculate new min/max for X-axis
        const range = xAxis.max - xAxis.min;
        const center = (xAxis.max + xAxis.min) / 2;
        const newRange = range * zoomFactor;
        
        const newMin = center - newRange / 2;
        const newMax = center + newRange / 2;
        
        // Apply zoom to X-axis
        chart.zoomScale('x', { min: newMin, max: newMax }, 'none');
        chart.update('none');
      }
    };
    
    canvas.addEventListener('wheel', wheelEventListener, { passive: false });
  }
}

// Cleanup wheel listener
function cleanupWheelListener() {
  if (wheelEventListener && chartRef.value?.chart?.canvas) {
    chartRef.value.chart.canvas.removeEventListener('wheel', wheelEventListener);
    wheelEventListener = null;
  }
}

// Initialize chart resources when modal opens
watch(() => props.show, (newShow) => {
  if (newShow && chartableResources.value.length > 0) {
    // Load saved chart resources from localStorage
    const savedResources = loadChartResourcesFromStorage();
    
    if (savedResources && savedResources.length > 0) {
      // Filter saved resources to only include available ones
      const availableSavedResources = savedResources.filter(id => 
        chartableResources.value.some(r => r.id === id)
      );
      
      if (availableSavedResources.length > 0) {
        chartSelectedResources.value = availableSavedResources;
      } else {
        // Fallback to defaults if saved resources are not available
        setDefaultChartResources();
      }
    } else {
      // No saved resources, use defaults
      setDefaultChartResources();
    }
    
    // Force chart re-render when modal opens
    forceChartUpdate();
  }
}, { immediate: true });

// Watch for changes that should trigger chart re-render
watch([activeChartType, chartSelectedResources, xAxisType], () => {
  forceChartUpdate();
}, { deep: true });

// Watch for chartSelectedResources changes to save to localStorage
watch(chartSelectedResources, (newResources) => {
  saveChartResourcesToStorage(newResources);
}, { deep: true });

// Watch for chart reference changes to setup wheel listener
watch(chartRef, (newRef) => {
  if (newRef && newRef.chart) {
    nextTick(() => {
      setupCustomWheelListener();
    });
  }
}, { immediate: true });

// Cleanup on unmount
onUnmounted(() => {
  cleanupWheelListener();
});

// Force chart update function
function forceChartUpdate() {
  chartRenderKey.value += 1;
  // Setup wheel listener after chart re-render
  nextTick(() => {
    setTimeout(() => {
      setupCustomWheelListener();
    }, 100);
  });
}

// Reset chart zoom function
function resetChartZoom() {
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.resetZoom();
  }
}

// Filter out notes and other non-relevant resources from chartable resources
const chartableResources = computed(() => {
  const excludeFromCharts = ['notes', 'hours-in-tr', 'daily-farm-frags', 'current-camp', 'camp-timer'];
  return props.selectedResources.filter(resource => !excludeFromCharts.includes(resource.id));
});

// Filter out notes and other non-relevant resources from overview
const overviewResources = computed(() => {
  const excludeFromOverview = ['notes', 'hours-in-tr', 'daily-farm-frags', 'current-camp', 'camp-timer'];
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

const chartLabels = computed(() => {
  if (xAxisType.value === 'timeInTR') {
    // Check if Time in TR is available
    const hasTimeInTR = filteredEntries.value.some(entry => entry.values && entry.values['hours-in-tr']);
    
    if (!hasTimeInTR) {
      // Fallback to timestamp if Time in TR is not available - use Date objects for time axis
      console.warn('Time in TR data not available, falling back to timestamps');
      return filteredEntries.value.map(entry => new Date(entry.date));
    }
    
    // Use "Time in TR" values for X-axis - keep as strings for category axis
    return filteredEntries.value.map(entry => {
      const timeInTR = entry.values['hours-in-tr'] || '0:00';
      return timeInTR;
    });
  } else {
    // Use Date objects for proper time axis formatting
    return filteredEntries.value.map(entry => new Date(entry.date));
  }
});

// Dark theme colors - make reactive to xAxisType changes
const darkThemeOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#e5e7eb',
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(31, 41, 55, 0.95)',
      titleColor: '#f9fafb',
      bodyColor: '#e5e7eb',
      borderColor: '#6b7280',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        title: function(context) {
          if (xAxisType.value === 'timeInTR') {
            return `Time in TR: ${context[0].label}`;
          } else {
            return context[0].label;
          }
        },
        label: function(context) {
          const value = context.parsed.y;
          const resourceId = context.dataset.resourceId;
          
          // Special formatting for oo-accum
          if (resourceId === 'oo-accum') {
            return `${context.dataset.label}: ${formatSuffixInput(value)}`;
          }
          
          return `${context.dataset.label}: ${formatNumber(value)}`;
        }
      }
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy', // Enable panning on both X and Y axes
        modifierKey: null, // No modifier key needed for panning
        scaleMode: 'xy', // Allow scaling on both axes during pan
      },
      zoom: {
        wheel: {
          enabled: true,
          speed: 0.1,
          modifierKey: 'ctrl', // Ctrl+wheel for Y-axis zoom
        },
        pinch: {
          enabled: true,
          mode: 'xy' // Allow both axes for touch devices
        },
        drag: {
          enabled: true,
          mode: 'xy', // Allow both x and y selection for box zoom
          modifierKey: 'ctrl', // Ctrl+drag for box zoom on both axes
        },
      },
      // Remove limits to allow free panning/zooming within filtered data
      limits: {}
    }
  },
  scales: {
    x: {
      type: xAxisType.value === 'timeInTR' ? 'category' : 'time',
      display: true,
      title: {
        display: true,
        text: xAxisType.value === 'timeInTR' ? 'Time in TR' : 'Log Time',
        color: '#e5e7eb',
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
        borderColor: 'rgba(75, 85, 99, 0.5)',
        drawOnChartArea: true,
        drawTicks: true
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11
        },
        maxTicksLimit: 8,
        display: true,
        autoSkip: true
      },
      ...(xAxisType.value !== 'timeInTR' && {
        time: {
          tooltipFormat: 'Pp',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'dd.MM HH:mm',
            day: 'dd.MM.yyyy'
          }
        }
      })
    },
    y: {
      type: 'linear',     
      display: true,
      position: 'left',
      suggestedMin: 0,
      ticks: {
        callback: v => formatNumber(v),
        maxTicksLimit: 8,
        color: '#9ca3af',
        font: { size: 11 }
      },
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
        borderColor: 'rgba(75, 85, 99, 0.5)'
      }
    }
  },
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 3,
      hoverRadius: 6
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  // Isolate this chart instance
  animation: {
    duration: 0
  },
  datasets: {
    line: {
      pointBackgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
    bar: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 1,
      barThickness: 'flex',
      maxBarThickness: 50
    }
  }
}));

const chartOptions = computed(() => {
  // Calculate dynamic Y-axis range based on selected data (auto scaling)
  let yAxisConfig = {
    display: true,
    position: 'left',
    grid: {
      color: 'rgba(75, 85, 99, 0.3)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      drawOnChartArea: true,
      drawTicks: true
    },
    ticks: {
      color: '#9ca3af',
      font: {
        size: 11
      },
      maxTicksLimit: 8,
      display: true,
      callback: function(value) {
        return formatNumber(value);
      }
    }
  };

  // X-Axis configuration
  let xAxisConfig = {
    type: xAxisType.value === 'timeInTR' ? 'category' : 'time',
    display: true,
    title: {
      display: true,
      text: xAxisType.value === 'timeInTR' ? 'Time in TR' : 'Log Time',
      color: '#9ca3af',
      font: {
        size: 12
      }
    },
    grid: {
      color: 'rgba(75, 85, 99, 0.3)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      drawOnChartArea: true,
      drawTicks: true
    },
    ticks: {
      color: '#9ca3af',
      font: {
        size: 11
      },
      maxTicksLimit: 8,
      display: true,
      autoSkip: true
    },
    ...(xAxisType.value !== 'timeInTR' && {
      time: {
        tooltipFormat: 'Pp',
        displayFormats: {
          minute: 'HH:mm',
          hour: 'dd.MM HH:mm',
          day: 'dd.MM.yyyy'
        }
      }
    })
  };

  // Apply automatic Y-axis scaling based on data
  if (chartData.value && chartData.value.datasets.length > 0) {
    let allValues = [];
    chartData.value.datasets.forEach(dataset => {
      const values = dataset.data
        .filter(val => val !== null && val !== undefined)
        .map(val => {
          // Handle both simple numbers and x/y objects with robust parsing
          const raw = typeof val === 'object' && val?.y !== undefined ? val.y : val;
          const num = parseFloat(raw);
          return isFinite(num) ? num : 0;
        });
      allValues = allValues.concat(values);
    });

    if (allValues.length > 0) {
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const range = maxValue - minValue;
      
      if (range > 0) {
        const padding = range * 0.1;
        
        // Smart scaling: start from 0 if data is close to 0, otherwise fit to data
        if (minValue > range * 0.3) {
          yAxisConfig.suggestedMin = Math.max(0, minValue - padding);
          yAxisConfig.suggestedMax = maxValue + padding;
        } else {
          yAxisConfig.suggestedMin = 0;
          yAxisConfig.suggestedMax = maxValue + padding;
        }
      }
    }
  }

  return {
    ...darkThemeOptions.value,
    // Add unique ID to prevent data sharing between charts
    chartId: `chart-${chartRenderKey.value}-${Date.now()}`,
    plugins: {
      ...darkThemeOptions.value.plugins,
      tooltip: {
        ...darkThemeOptions.value.plugins.tooltip,
        callbacks: {
          title: function(context) {
            if (xAxisType.value === 'timeInTR') {
              return `Time in TR: ${context[0].label}`;
            } else {
              return context[0].label;
            }
          },
          label: function(context) {
            const value = context.parsed.y;
            const resourceId = context.dataset.resourceId;
            
            // Special formatting for oo-accum
            if (resourceId === 'oo-accum') {
              return `${context.dataset.label}: ${formatSuffixInput(value)}`;
            }
            
            return `${context.dataset.label}: ${formatNumber(value)}`;
          }
        }
      }
    },
    scales: {
      x: xAxisConfig,
      y: yAxisConfig
    },
    // Force chart destruction and recreation
    animation: {
      duration: 0
    },
    // Unique responsive setting to force reflow
    responsive: true,
    maintainAspectRatio: false
  };
});

const gainsChartOptions = computed(() => {
  // Calculate dynamic Y-axis range for gains chart (auto scaling)
  let yAxisConfig = {
    display: true,
    position: 'left',
    grid: {
      color: 'rgba(75, 85, 99, 0.3)',
      borderColor: 'rgba(75, 85, 99, 0.5)',
      drawOnChartArea: true,
      drawTicks: true
    },
    ticks: {
      color: '#9ca3af',
      font: {
        size: 11
      },
      maxTicksLimit: 8,
      display: true,
      callback: function(value) {
        const prefix = value >= 0 ? '+' : '';
        return prefix + formatNumber(Math.abs(value));
      }
    }
  };

  // Apply automatic Y-axis scaling for gains chart
  if (gainsChartData.value && gainsChartData.value.datasets.length > 0) {
    let allValues = [];
    gainsChartData.value.datasets.forEach(dataset => {
      const values = dataset.data
        .filter(val => val !== null && val !== undefined)
        .map(val => {
          // Handle both simple numbers and x/y objects with robust parsing
          const raw = typeof val === 'object' && val?.y !== undefined ? val.y : val;
          const num = parseFloat(raw);
          return isFinite(num) ? num : 0;
        });
      allValues = allValues.concat(values);
    });

    if (allValues.length > 0) {
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const range = Math.max(Math.abs(minValue), Math.abs(maxValue));
      
      if (range > 0) {
        const padding = range * 0.1;
        
        // Auto mode: center around 0 with smart padding
        yAxisConfig.suggestedMin = minValue - padding;
        yAxisConfig.suggestedMax = maxValue + padding;
      }
    }
  }

  return {
    ...darkThemeOptions.value,
    // Add unique ID to prevent data sharing between charts
    chartId: `gains-chart-${chartRenderKey.value}-${Date.now()}`,
    plugins: {
      ...darkThemeOptions.value.plugins,
      tooltip: {
        ...darkThemeOptions.value.plugins.tooltip,
        callbacks: {
          title: function(context) {
            if (xAxisType.value === 'timeInTR') {
              return `Time in TR: ${context[0].label}`;
            } else {
              return context[0].label;
            }
          },
          label: function(context) {
            const value = context.parsed.y;
            const resourceId = context.dataset.resourceId;
            const prefix = value >= 0 ? '+' : '';
            
            if (resourceId === 'oo-accum') {
              return `${context.dataset.label}: ${prefix}${formatSuffixInput(Math.abs(value))}`;
            }
            
            return `${context.dataset.label}: ${prefix}${formatNumber(value)}`;
          }
        }
      }
    },
    scales: {
      ...darkThemeOptions.value.scales,
      x: {
        ...darkThemeOptions.value.scales.x,
        type: xAxisType.value === 'timeInTR' ? 'category' : 'time',
        title: {
          display: true,
          text: xAxisType.value === 'timeInTR' ? 'Time in TR' : 'Log Time',
          color: '#9ca3af',
          font: {
            size: 12
          }
        },
        ...(xAxisType.value !== 'timeInTR' && {
          time: {
            tooltipFormat: 'Pp',
            displayFormats: {
              minute: 'HH:mm',
              hour: 'dd.MM HH:mm',
              day: 'dd.MM.yyyy'
            }
          }
        })
      },
      y: yAxisConfig
    },
    // Force chart destruction and recreation
    animation: {
      duration: 0
    },
    // Unique responsive setting to force reflow
    responsive: true,
    maintainAspectRatio: false
  };
});

// Robust data sanitization function
const parseChartValue = (val) => {
  // Block time-like strings that contain colons
  if (typeof val === 'string' && val.includes(':')) return NaN;
  const num = parseFloat(val);
  return isFinite(num) ? num : 0;
};

// Chart data generators
const chartData = computed(() => {
  if (!chartSelectedResources.value.length || !filteredEntries.value.length) return null;
  
  const datasets = chartSelectedResources.value.map(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return null;
    
    let data;
    if (xAxisType.value === 'timeInTR') {
      // For Time in TR, use traditional labels + data array structure
      data = filteredEntries.value.map(entry => parseChartValue(entry.values?.[resourceId]));
    } else {
      // For timestamp axis, use x/y object structure for proper time axis
      data = filteredEntries.value.map(entry => ({
        x: new Date(entry.date),
        y: parseChartValue(entry.values?.[resourceId])
      }));
    }
    
    // Use the exact color from settings, ensuring it includes opacity for background
    const borderColor = resource.color;
    const backgroundColor = resource.color.length === 9 
      ? resource.color.slice(0, 7) + '20' // If color has alpha, replace with 20
      : resource.color + '20'; // If no alpha, add 20
    
    return {
      label: resource.name,
      data: data,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      borderWidth: activeChartType.value === 'bar' ? 1 : 2,
      fill: false,
      resourceId: resourceId
    };
  }).filter(Boolean);
  
  const result = {
    datasets: datasets
  };
  
  // Debug log for chart data validation
  console.log('Chart dataset data:', datasets.map(d => ({ 
    label: d.label, 
    resourceId: d.resourceId,
    sampleData: d.data.slice(0, 3) 
  })));
  console.log('All chartSelectedResources:', chartSelectedResources.value);
  
  // Only add labels for category axis (Time in TR)
  if (xAxisType.value === 'timeInTR') {
    result.labels = chartLabels.value;
  }
  
  return result;
});

const areaChartData = computed(() => {
  if (!chartSelectedResources.value.length || !filteredEntries.value.length) return null;
  
  const datasets = chartSelectedResources.value.map(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return null;
    
    let data;
    if (xAxisType.value === 'timeInTR') {
      // For Time in TR, use traditional labels + data array structure
      data = filteredEntries.value.map(entry => parseChartValue(entry.values?.[resourceId]));
    } else {
      // For timestamp axis, use x/y object structure for proper time axis
      data = filteredEntries.value.map(entry => ({
        x: new Date(entry.date),
        y: parseChartValue(entry.values?.[resourceId])
      }));
    }
    
    // Use the exact color from settings
    const borderColor = resource.color;
    const backgroundColor = resource.color.length === 9 
      ? resource.color.slice(0, 7) + '30' // If color has alpha, replace with 30
      : resource.color + '30'; // If no alpha, add 30
    
    return {
      label: resource.name,
      data: data,
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      borderWidth: 2,
      fill: true,
      resourceId: resourceId
    };
  }).filter(Boolean);
  
  const result = {
    datasets: datasets
  };
  
  // Only add labels for category axis (Time in TR)
  if (xAxisType.value === 'timeInTR') {
    result.labels = chartLabels.value;
  }
  
  return result;
});

const gainsChartData = computed(() => {
  if (!chartSelectedResources.value.length || filteredEntries.value.length < 2) return null;
  
  const datasets = chartSelectedResources.value.map(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return null;
    
    let data;
    if (xAxisType.value === 'timeInTR') {
      // For Time in TR, use traditional labels + data array structure
      const gains = [];
      for (let i = 1; i < filteredEntries.value.length; i++) {
        const current = parseChartValue(filteredEntries.value[i].values?.[resourceId]);
        const previous = parseChartValue(filteredEntries.value[i - 1].values?.[resourceId]);
        gains.push(current - previous);
      }
      data = gains;
    } else {
      // For timestamp axis, use x/y object structure for proper time axis
      data = [];
      for (let i = 1; i < filteredEntries.value.length; i++) {
        const current = parseChartValue(filteredEntries.value[i].values?.[resourceId]);
        const previous = parseChartValue(filteredEntries.value[i - 1].values?.[resourceId]);
        data.push({
          x: new Date(filteredEntries.value[i].date),
          y: current - previous
        });
      }
    }
    
    // Use the exact color from settings
    const borderColor = resource.color;
    const backgroundColor = resource.color.length === 9 
      ? resource.color.slice(0, 7) + '80' // If color has alpha, replace with 80
      : resource.color + '80'; // If no alpha, add 80
    
    return {
      label: resource.name,
      data: data,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
      barThickness: 'flex', // Make bars more visible
      maxBarThickness: 50, // Limit maximum bar width
      resourceId: resourceId
    };
  }).filter(Boolean);
  
  const result = {
    datasets: datasets
  };
  
  // Only add labels for category axis (Time in TR)
  if (xAxisType.value === 'timeInTR') {
    result.labels = chartLabels.value.slice(1); // Skip first label since we start from index 1
  }
  
  return result;
});

// Methods
function toggleResourceInChart(resourceId) {
  // Block forbidden resources from being added to charts
  const forbidden = ['hours-in-tr', 'notes', 'daily-farm-frags', 'current-camp', 'camp-timer'];
  if (forbidden.includes(resourceId)) return;
  
  const index = chartSelectedResources.value.indexOf(resourceId);
  if (index > -1) {
    chartSelectedResources.value.splice(index, 1);
  } else {
    // Limit to 5 resources for performance
    if (chartSelectedResources.value.length < 5) {
      chartSelectedResources.value.push(resourceId);
    }
  }
  // Force chart update immediately after resource change
  nextTick(() => {
    forceChartUpdate();
  });
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
    const forbidden = ['hours-in-tr', 'notes', 'daily-farm-frags', 'current-camp', 'camp-timer'];
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
