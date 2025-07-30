<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-[95%] max-h-[95vh] overflow-y-auto animate-fade-in border border-gray-700"
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
        <!-- Chart Controls -->
        <div class="bg-gray-700/30 rounded-lg p-3">
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
                  :class="[
                    'px-2 py-1 text-xs rounded-md border transition-colors',
                    chartSelectedResources.includes(resource.id)
                      ? 'border-transparent text-white'
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  ]"
                  :style="chartSelectedResources.includes(resource.id) ? { backgroundColor: resource.color, borderColor: resource.color } : {}"
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
                  v-for="track in availableTracks"
                  :key="track.id"
                  @click="toggleTrackInChart(track.id)"
                  :class="[
                    'px-2 py-1 text-xs rounded-md border transition-colors',
                    enabledTracks.includes(track.id)
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-gray-500'
                  ]"
                >
                  TR#{{ track.trCount || 0 }} - {{ track.name }}
                  <span class="ml-1 text-xs opacity-75">({{ track.entries.length }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div v-if="enabledTracks.length > 0 && chartSelectedResources.length > 0" class="bg-gray-700/20 rounded-lg p-3">
          <!-- Chart Help & Controls -->
          <div class="mb-3 flex justify-between items-center">
            <div class="text-xs text-gray-400">
              <span class="font-medium">Mouse Controls:</span> 
              Scroll to zoom X-axis • Ctrl+scroll to zoom • Drag to pan • Ctrl+drag for box zoom
            </div>
            <button
              @click="resetChartZoom"
              class="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            >
              Reset Zoom
            </button>
          </div>
          
          <div class="h-96 relative">
            <Line
              ref="chartRef"
              :key="`line-${chartRenderKey}`"
              :data="chartData"
              :options="chartOptions"
            />
          </div>
        </div>

        <!-- TR Tracks Summary -->
        <div class="bg-gray-700/20 rounded-lg p-3">
          <h4 class="text-sm font-medium text-white mb-3">TR Tracks Summary</h4>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div
              v-for="track in availableTracks"
              :key="track.id"
              class="bg-gray-700/30 rounded-md p-2"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-white">TR#{{ track.trCount || 0 }} - {{ track.name }}</span>
                <span 
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="{
                    'bg-green-900/50 text-green-300': track.isActive,
                    'bg-blue-900/50 text-blue-300': !track.isActive
                  }"
                >
                  {{ track.isActive ? 'Active' : 'Completed' }}
                </span>
              </div>
              <div class="text-xs text-gray-400">
                Started: {{ formatDate(track.startDate) }} • 
                {{ track.entries.length }} entries
              </div>
              <div v-if="!track.isActive && track.endDate" class="text-xs text-gray-400">
                Completed: {{ formatDate(track.endDate) }}
              </div>
            </div>
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
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import { formatNumber, formatSuffixInput } from '@/composables/format.js';
import { IconX, IconTrendingUp, IconChartLine, IconClockHour2, IconCalendarEvent } from '@tabler/icons-vue';
import { Line } from 'vue-chartjs';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

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

// Chart state
const chartSelectedResources = ref([]);
const enabledTracks = ref([]);
const xAxisType = ref('timeInTR'); // 'timestamp' or 'timeInTR'
const chartRenderKey = ref(0);
const chartRef = ref(null); // Reference to chart instance

// Custom wheel event listener for normal scroll X-axis zoom
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
    // Select MP by default for single resource view
    const defaultResources = ['mp'];
    const availableDefaults = defaultResources.filter(id => 
      chartableResources.value.some(r => r.id === id)
    );
    
    // If MP not available, take first available resource
    if (availableDefaults.length === 0 && chartableResources.value.length > 0) {
      availableDefaults.push(chartableResources.value[0].id);
    }
    
    chartSelectedResources.value = [availableDefaults[0]]; // Only one resource
    
    // Enable all tracks by default
    enabledTracks.value = availableTracks.value.map(track => track.id);
    
    forceChartUpdate();
  }
}, { immediate: true });

// Watch for changes that should trigger chart re-render
watch([chartSelectedResources, enabledTracks, xAxisType], () => {
  forceChartUpdate();
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

// Get tracks that have actual data
const availableTracks = computed(() => {
  return props.tracks
    .filter(track => track.entries && track.entries.length > 0)
    .sort((a, b) => {
      // Sort by TR count (ascending - smallest first)
      const trCountA = a.trCount || 0;
      const trCountB = b.trCount || 0;
      return trCountA - trCountB;
    });
});

// Check if Time in TR data is available across all tracks
const hasTimeInTRData = computed(() => {
  return availableTracks.value.some(track => 
    track.entries && track.entries.some(entry => entry.values && entry.values['hours-in-tr'])
  );
});

// Get top 4 resources for statistics
const getTopResources = () => {
  // Not used anymore since we removed statistics
  return [];
};

// Chart options with dark theme
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
            const timeInTR = context[0].parsed.x;
            return `Time in TR: ${timeInTR}h`;
          } else {
            return context[0].label;
          }
        },
        label: function(context) {
          const resourceId = context.dataset.resourceId;
          const value = context.parsed.y;
          return `${context.dataset.label}: ${formatResourceValue(resourceId, value)}`;
        }
      }
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy',
        modifierKey: null,
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
      limits: {
        y: {min: 'original', max: 'original'},
        x: {min: 'original', max: 'original'}
      }
    }
  },
  scales: {
    x: {
      type: xAxisType.value === 'timeInTR' ? 'linear' : 'time',
      display: true,
      title: {
        display: true,
        text: xAxisType.value === 'timeInTR' ? 'Time in TR (hours)' : 'Log Time',
        color: '#e5e7eb',
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
        ...(xAxisType.value === 'timeInTR' && {
          stepSize: 24, // Show every 24 hours
          callback: function(value) {
            return `${Math.round(value)}h`;
          }
        }),
        ...(xAxisType.value !== 'timeInTR' && {
          maxTicksLimit: 8,
          autoSkip: true
        })
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
      radius: 4,
      hoverRadius: 7
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  animation: {
    duration: 0
  }
}));

const chartOptions = computed(() => darkThemeOptions.value);

// Chart data generators
const chartData = computed(() => {
  if (!chartSelectedResources.value.length || !enabledTracks.value.length) return null;
  
  const datasets = [];
  
  // Get enabled tracks
  const tracksToShow = availableTracks.value.filter(track => enabledTracks.value.includes(track.id));
  
  // For each resource and each track, create a separate dataset
  chartSelectedResources.value.forEach(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return;
    
    tracksToShow.forEach((track, trackIndex) => {
      const sortedEntries = [...track.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const data = sortedEntries.map((entry) => {
        if (xAxisType.value === 'timeInTR') {
          const timeInTR = parseFloat(entry.values?.['hours-in-tr']) || 0;
          return {
            x: timeInTR, // Use time in TR as X coordinate
            y: parseChartValue(entry.values?.[resourceId])
          };
        } else {
          return {
            x: new Date(entry.date), // Use timestamp as X coordinate
            y: parseChartValue(entry.values?.[resourceId])
          };
        }
      }).filter(point => {
        if (xAxisType.value === 'timeInTR') {
          return point.x >= 0; // Filter out invalid time values
        } else {
          return point.x && point.y !== undefined; // Filter out invalid dates
        }
      });
      
      // Use solid lines for all tracks with different colors
      const trackColors = [
        '#8b5cf6', // purple
        '#06b6d4', // cyan
        '#10b981', // emerald
        '#f59e0b', // amber
        '#ef4444', // red
        '#ec4899', // pink
        '#6366f1', // indigo
        '#84cc16', // lime
      ];
      
      const trackColor = trackColors[trackIndex % trackColors.length];
      
      datasets.push({
        label: `${resource.name} - TR#${track.trCount || 0} - ${track.name}`,
        data: data,
        borderColor: trackColor,
        backgroundColor: trackColor + '20',
        borderWidth: 2,
        fill: false,
        resourceId: resourceId,
        trackId: track.id,
        pointRadius: 2,
        pointHoverRadius: 4
      });
    });
  });
  
  return {
    datasets: datasets
  };
});

const barChartData = computed(() => {
  // Not used anymore, but keeping for compatibility
  return null;
});

const improvementChartData = computed(() => {
  // Not used anymore, but keeping for compatibility
  return null;
});

// Helper functions
function parseChartValue(val) {
  if (typeof val === 'string' && val.includes(':')) return NaN;
  const num = parseFloat(val);
  return isFinite(num) ? num : 0;
}

function getTrackPeakValue(track, resourceId) {
  if (!track.entries || track.entries.length === 0) return 0;
  
  const values = track.entries
    .map(entry => entry.values?.[resourceId] || 0)
    .filter(value => value > 0);
    
  return values.length > 0 ? Math.max(...values) : 0;
}

function selectResource(resourceId) {
  const forbidden = ['hours-in-tr', 'notes', 'daily-farm-frags', 'current-camp', 'camp-timer'];
  if (forbidden.includes(resourceId)) return;
  
  // Only allow one resource at a time
  chartSelectedResources.value = [resourceId];
  
  nextTick(() => {
    forceChartUpdate();
  });
}

function toggleTrackInChart(trackId) {
  const index = enabledTracks.value.indexOf(trackId);
  if (index > -1) {
    enabledTracks.value.splice(index, 1);
  } else {
    enabledTracks.value.push(trackId);
  }
  
  nextTick(() => {
    forceChartUpdate();
  });
}

function formatResourceValue(resourceId, value) {
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
