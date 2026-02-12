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
            <Line
              ref="chartRef"
              :key="`line-${chartRenderKey}`"
              :data="chartData"
              :options="chartOptions"
              :plugins="[crosshairPlugin]"
            />
          </div>
            
          <!-- Crosshair Values Display -->
          <div 
            v-if="crosshairValues.length > 0" 
            class="mt-3 bg-gray-800/90 border border-gray-600 rounded-lg p-2 max-w-md ml-auto"
            style="backdrop-filter: blur(8px);"
          >
              <div class="text-xs font-medium text-gray-300 mb-2">Current Values:</div>
              <div class="space-y-1">
                <div 
                  v-for="item in crosshairValues.slice().reverse()" 
                  :key="item.label"
                  class="flex justify-between items-center text-xs"
                >
                  <div class="flex items-center">
                    <div 
                      class="w-2 h-2 rounded-full mr-2" 
                      :style="{ backgroundColor: item.color }"
                    ></div>
                    <span class="text-gray-300 truncate">{{ item.label }}</span>
                  </div>
                  <div class="flex items-center gap-2 ml-2">
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
import { getRelativePosition } from 'chart.js/helpers';

// Chart.js components registered centrally in main.js

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
let mouseEventListeners = { mousedown: null, mousemove: null, mouseup: null };

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

// Setup mouse listeners for crosshair dragging
function setupMouseListeners() {
  if (chartRef.value && chartRef.value.chart && chartRef.value.chart.canvas) {
    const canvas = chartRef.value.chart.canvas;
    const chart = chartRef.value.chart;
    
    // Remove existing listeners
    if (mouseEventListeners.mousedown) {
      canvas.removeEventListener('mousedown', mouseEventListeners.mousedown);
    }
    if (mouseEventListeners.mousemove) {
      canvas.removeEventListener('mousemove', mouseEventListeners.mousemove);
    }
    
    mouseEventListeners.mousedown = (event) => {
      console.log('Canvas mousedown event!', event);
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      
      console.log('MouseDown at canvas position:', x, 'crosshair at:', crosshairPosition.value);
      
      // Check if mousedown is near existing crosshair
      if (crosshairPosition.value !== null) {
        const distance = Math.abs(x - crosshairPosition.value);
        console.log('Distance to existing crosshair:', distance);
        if (distance < 15) {
          console.log('Starting drag mode on canvas mousedown');
          isDragging.value = true;
          canvas.style.cursor = 'grabbing';
          
          // Setup global drag handlers
          const handleMouseMove = (e) => {
            if (isDragging.value) {
              const rect = canvas.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              
              // Clamp to chart area
              const chartArea = chart.chartArea;
              const clampedX = Math.max(chartArea.left, Math.min(chartArea.right, mouseX));
              
              const dataX = chart.scales.x.getValueForPixel(clampedX);
              
              console.log('Dragging to:', clampedX, 'dataX:', dataX);
              crosshairPosition.value = clampedX;
              updateCrosshairValues(chart, dataX);
              chart.update('none');
            }
          };
          
          const handleMouseUp = () => {
            console.log('MouseUp - stopping drag');
            isDragging.value = false;
            canvas.style.cursor = 'default';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };
          
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
          
          event.preventDefault();
          return;
        }
      }
      
      console.log('MouseDown not near crosshair - ignoring');
    };
    
    mouseEventListeners.mousemove = (event) => {
      if (!isDragging.value) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        
        // Change cursor when hovering near crosshair
        if (crosshairPosition.value !== null) {
          const distance = Math.abs(mouseX - crosshairPosition.value);
          if (distance < 15) {
            canvas.style.cursor = 'grab';
          } else {
            canvas.style.cursor = 'default';
          }
        } else {
          canvas.style.cursor = 'default';
        }
      }
    };
    
    canvas.addEventListener('mousedown', mouseEventListeners.mousedown);
    canvas.addEventListener('mousemove', mouseEventListeners.mousemove);
  }
}

// Cleanup wheel listener
function cleanupWheelListener() {
  if (wheelEventListener && chartRef.value?.chart?.canvas) {
    chartRef.value.chart.canvas.removeEventListener('wheel', wheelEventListener);
    wheelEventListener = null;
  }
}

// Cleanup mouse listeners
function cleanupMouseListeners() {
  if (chartRef.value?.chart?.canvas) {
    const canvas = chartRef.value.chart.canvas;
    if (mouseEventListeners.mousedown) {
      canvas.removeEventListener('mousedown', mouseEventListeners.mousedown);
    }
    if (mouseEventListeners.mousemove) {
      canvas.removeEventListener('mousemove', mouseEventListeners.mousemove);
    }
  }
  mouseEventListeners = { mousedown: null, mousemove: null, mouseup: null };
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

// Watch for enabled tracks changes to update crosshair values immediately
watch(enabledTracks, () => {
  if (chartRef.value?.chart && crosshairPosition.value !== null) {
    const chart = chartRef.value.chart;
    const dataX = chart.scales.x.getValueForPixel(crosshairPosition.value);
    updateCrosshairValues(chart, dataX);
  }
}, { deep: true });

// Watch for chart reference changes to setup wheel listener
watch(chartRef, (newRef) => {
  if (newRef && newRef.chart) {
    nextTick(() => {
      setupCustomWheelListener();
      setupMouseListeners();
      
      // Initialize crosshair at 24 hours if modal is open and no crosshair exists
      if (props.show && crosshairPosition.value === null) {
        setTimeout(() => {
          const chart = newRef.chart;
          if (chart.scales.x) {
            const targetDataX = 24;
            const pixelX = chart.scales.x.getPixelForValue(targetDataX);
            
            console.log('Chart ready - initializing crosshair at 24h, pixelX:', pixelX);
            if (pixelX && !isNaN(pixelX)) {
              crosshairPosition.value = pixelX;
              updateCrosshairValues(chart, targetDataX);
              chart.update('none');
            }
          }
        }, 200);
      }
    });
  }
}, { immediate: true });

// Cleanup on unmount
onUnmounted(() => {
  cleanupWheelListener();
  cleanupMouseListeners();
});

// Force chart update function
function forceChartUpdate() {
  chartRenderKey.value += 1;
  // Setup wheel listener after chart re-render and restore crosshair
  nextTick(() => {
    setTimeout(() => {
      setupCustomWheelListener();
      setupMouseListeners();
      // Restore crosshair position from saved data-space value
      if (crosshairDataX.value !== null && chartRef.value?.chart?.scales?.x) {
        const chart = chartRef.value.chart;
        const pixelX = chart.scales.x.getPixelForValue(crosshairDataX.value);
        if (pixelX && !isNaN(pixelX)) {
          crosshairPosition.value = pixelX;
          updateCrosshairValues(chart, crosshairDataX.value);
          chart.update('none');
        }
      }
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

// Use log10 scale for resources with extreme value ranges (attgn3-buff, daily hunter mats)
const LOG_SCALE_RESOURCES = ['attgn3-buff', 'mat3-borge', 'mat3-ozzy', 'mat3-knox'];
const useLogScale = computed(() => {
  return chartSelectedResources.value.some(id => LOG_SCALE_RESOURCES.includes(id));
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

const crosshairPosition = ref(null);
const crosshairDataX = ref(null); // Track crosshair position in data space (survives chart re-renders)
const crosshairValues = ref([]);
const isDragging = ref(false);

// Crosshair plugin
const crosshairPlugin = {
  id: 'crosshair',
  afterDraw: (chart) => {
    // Auto-initialize crosshair if not set and modal is open
    if (crosshairPosition.value === null && props.show && chart.scales.x) {
      const targetDataX = 24;
      const pixelX = chart.scales.x.getPixelForValue(targetDataX);
      
      if (pixelX && !isNaN(pixelX)) {
        crosshairPosition.value = pixelX;
        updateCrosshairValues(chart, targetDataX);
      }
    }
    
    if (crosshairPosition.value !== null) {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      
      ctx.save();
      ctx.strokeStyle = '#ef4444'; // Red crosshair line
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      
      // Draw draggable handle at top
      const handleY = chartArea.top - 10;
      const handleSize = 6;
      
      // Handle background
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(crosshairPosition.value - handleSize/2, handleY - handleSize/2, handleSize, handleSize);
      
      // Crosshair line
      ctx.beginPath();
      ctx.moveTo(crosshairPosition.value, chartArea.top);
      ctx.lineTo(crosshairPosition.value, chartArea.bottom);
      ctx.stroke();
      
      ctx.restore();
    }
  }
};

// crosshairPlugin is passed as local plugin via :plugins prop, NOT registered globally
// This prevents it from appearing on other charts in the application

// Calculate interpolated values for crosshair
function updateCrosshairValues(chart, xValue) {
  // Save data-space X for restoring after chart re-renders
  crosshairDataX.value = xValue;
  
  const values = [];
  
  // Group datasets by resource for difference calculation
  const resourceGroups = {};
  
  chart.data.datasets.forEach((dataset, datasetIndex) => {
    if (!dataset.data.length) return;
    
    // Only include datasets for enabled tracks
    if (!enabledTracks.value.includes(dataset.trackId)) return;
    
    const resourceId = dataset.resourceId;
    if (!resourceGroups[resourceId]) {
      resourceGroups[resourceId] = [];
    }
    
    // Find closest data points for interpolation
    const data = dataset.data;
    let leftPoint = null;
    let rightPoint = null;
    
    for (let i = 0; i < data.length; i++) {
      const point = data[i];
      const pointX = xAxisType.value === 'timeInTR' ? point.x : new Date(point.x).getTime();
      const targetX = xAxisType.value === 'timeInTR' ? xValue : xValue;
      
      if (pointX <= targetX) {
        leftPoint = { ...point, x: pointX };
      }
      if (pointX >= targetX && !rightPoint) {
        rightPoint = { ...point, x: pointX };
        break;
      }
    }
    
    let interpolatedY = null;
    const targetX = xAxisType.value === 'timeInTR' ? xValue : xValue;
    
    if (leftPoint && rightPoint && leftPoint.x !== rightPoint.x) {
      // Linear interpolation between two points
      const ratio = (targetX - leftPoint.x) / (rightPoint.x - leftPoint.x);
      interpolatedY = leftPoint.y + (rightPoint.y - leftPoint.y) * ratio;
    } else if (leftPoint) {
      // Use left point if no right point
      interpolatedY = leftPoint.y;
    } else if (rightPoint) {
      // Use right point if no left point
      interpolatedY = rightPoint.y;
    }
    
    if (interpolatedY !== null) {
      resourceGroups[resourceId].push({
        label: dataset.label,
        value: interpolatedY,
        resourceId: dataset.resourceId,
        color: dataset.borderColor,
        trCount: extractTRCount(dataset.label) // Extract TR count from label
      });
    }
  });
  
  // Calculate differences and flatten groups
  Object.values(resourceGroups).forEach(group => {
    // Sort by TR count (ascending - oldest first)
    group.sort((a, b) => (a.trCount || 0) - (b.trCount || 0));
    
    // Calculate differences
    for (let i = 0; i < group.length; i++) {
      const item = group[i];
      if (i > 0) {
        // Calculate difference from previous TR
        const prevItem = group[i - 1];
        if (LOG_SCALE_RESOURCES.includes(item.resourceId) && useLogScale.value) {
          // For log-scale resources: compute real difference from log values
          const realValue = Math.pow(10, item.value);
          const prevRealValue = Math.pow(10, prevItem.value);
          item.difference = isFinite(realValue) && isFinite(prevRealValue)
            ? realValue - prevRealValue
            : item.value - prevItem.value; // fallback to log diff if overflow
          item.diffIsReal = isFinite(realValue) && isFinite(prevRealValue);
        } else {
          item.difference = item.value - prevItem.value;
          item.diffIsReal = false;
        }
      } else {
        // For the oldest TR, set difference to 0
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

// Initialize crosshair at 24 hours when modal opens
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Reset crosshair when modal opens
    crosshairPosition.value = null;
    crosshairValues.value = [];
    
    // Wait for chart to be ready and initialize
    nextTick(() => {
      setTimeout(() => {
        if (chartRef.value?.chart?.scales?.x) {
          const chart = chartRef.value.chart;
          const targetDataX = 24;
          const pixelX = chart.scales.x.getPixelForValue(targetDataX);
          
          console.log('Modal opened - initializing crosshair at 24h, pixelX:', pixelX);
          crosshairPosition.value = pixelX;
          updateCrosshairValues(chart, targetDataX);
          chart.update('none');
        }
      }, 100);
    });
  }
});
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
      external: function(context) {
        // Custom tooltip logic for Time in TR mode
        if (xAxisType.value === 'timeInTR' && context.tooltip.dataPoints?.length > 0) {
          const chart = context.chart;
          const activePoint = context.tooltip.dataPoints[0];
          const activeX = activePoint.parsed.x;
          const maxDifference = 24; // 24 hours max difference
          
          // Find all data points within 24h range across all datasets
          const nearbyPoints = [];
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            dataset.data.forEach((point, pointIndex) => {
              if (Math.abs(point.x - activeX) <= maxDifference) {
                nearbyPoints.push({
                  datasetIndex,
                  pointIndex,
                  dataset,
                  point,
                  label: dataset.label,
                  resourceId: dataset.resourceId
                });
              }
            });
          });
          
          // Override the tooltip with nearby points
          if (nearbyPoints.length > 0) {
            context.tooltip.dataPoints = nearbyPoints.map(np => ({
              datasetIndex: np.datasetIndex,
              dataIndex: np.pointIndex,
              parsed: { x: np.point.x, y: np.point.y },
              dataset: np.dataset,
              label: np.label
            }));
          }
        }
        
        // Let Chart.js handle the rest
        return false;
      },
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
      title: useLogScale.value ? {
        display: true,
        text: 'log\u2081\u2080 scale',
        color: '#e5e7eb',
        font: { size: 12 }
      } : { display: false },
      ticks: {
        callback: function(v) {
          if (!useLogScale.value) return formatNumber(v);
          const realValue = Math.pow(10, v);
          if (!isFinite(realValue)) return `1e${Math.round(v)}`;
          return formatNumber(realValue);
        },
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
    mode: 'none' // Disable normal tooltips
  },
  plugins: {
    tooltip: {
      enabled: false // Disable tooltips completely
    },
    legend: {
      position: 'top',
      labels: {
        color: '#e5e7eb',
        usePointStyle: true,
        padding: 20,
        font: {
          size: 11
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
        const yValue = useLogScale.value
          ? parseLog10Value(entry.values?.[resourceId])
          : parseChartValue(entry.values?.[resourceId]);
        if (xAxisType.value === 'timeInTR') {
          const timeInTR = parseFloat(entry.values?.['hours-in-tr']) || 0;
          return { x: timeInTR, y: yValue };
        } else {
          return { x: new Date(entry.date), y: yValue };
        }
      }).filter(point => {
        if (point.y === null || point.y === undefined) return false;
        if (xAxisType.value === 'timeInTR') {
          return point.x >= 0;
        } else {
          return point.x && point.y !== undefined;
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

// Parse value to log10 for attgn3-buff (handles scientific notation beyond JS Number range like "1e333")
function parseLog10Value(val) {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).trim();
  if (str === '0') return null; // log(0) is undefined
  // Handle scientific notation (e.g. "1.5e200", "1e333")
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
  // When log scale is active, values are in log10 space → convert back and format with suffixes
  if (LOG_SCALE_RESOURCES.includes(resourceId) && useLogScale.value) {
    if (value === 0 || value === null) return '0';
    const realValue = Math.pow(10, value);
    if (!isFinite(realValue)) return `1e${Math.round(value)}`;
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
