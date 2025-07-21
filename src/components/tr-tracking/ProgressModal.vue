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
            <div class="flex gap-1">
              <button
                v-for="chartType in chartTypes"
                :key="chartType.id"
                @click="activeChartType = chartType.id"
                :class="[
                  'px-2 py-1 text-xs rounded transition-colors',
                  activeChartType === chartType.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                {{ chartType.name }}
              </button>
            </div>
          </div>
          
          <!-- Chart Container -->
          <div class="bg-gray-700/30 rounded-md p-4">
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
            <div class="h-96 relative">
              <!-- Line Chart -->
              <Line
                v-if="activeChartType === 'line' && chartData"
                :data="chartData"
                :options="chartOptions"
                class="w-full h-full"
              />
              
              <!-- Bar Chart -->
              <Bar
                v-if="activeChartType === 'bar' && chartData"
                :data="chartData"
                :options="chartOptions"
                class="w-full h-full"
              />
              
              <!-- Area Chart -->
              <Line
                v-if="activeChartType === 'area' && areaChartData"
                :data="areaChartData"
                :options="chartOptions"
                class="w-full h-full"
              />
              
              <!-- Gains Chart -->
              <Bar
                v-if="activeChartType === 'gains' && gainsChartData"
                :data="gainsChartData"
                :options="gainsChartOptions"
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
import { ref, computed, watch, nextTick } from 'vue';
import { formatNumber, formatSuffixInput } from '@/composables/format.js';
import { IconX, IconChartLine, IconTrendingUp } from '@tabler/icons-vue';
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
  Filler
} from 'chart.js';
import { Line, Bar } from 'vue-chartjs';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

const chartTypes = [
  { id: 'line', name: 'Progress' },
  { id: 'area', name: 'Cumulative' },
  { id: 'bar', name: 'Comparison' },
  { id: 'gains', name: 'Gains' }
];

// Initialize chart resources when modal opens
watch(() => props.show, (newShow) => {
  if (newShow && chartableResources.value.length > 0) {
    // Start with first 3 chartable resources selected for better performance
    chartSelectedResources.value = chartableResources.value.slice(0, 3).map(r => r.id);
  }
}, { immediate: true });

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

// Chart data computeds
const sortedEntries = computed(() => {
  if (!props.track?.entries) return [];
  return [...props.track.entries].sort((a, b) => new Date(a.date) - new Date(b.date));
});

const chartLabels = computed(() => {
  return sortedEntries.value.map(entry => {
    const date = new Date(entry.date);
    return date.toLocaleDateString('de-DE', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });
});

// Dark theme colors
const darkThemeOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
    x: {
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
        borderColor: 'rgba(75, 85, 99, 0.5)'
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11
        },
        maxTicksLimit: 8
      }
    },
    y: {
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
        borderColor: 'rgba(75, 85, 99, 0.5)'
      },
      ticks: {
        color: '#9ca3af',
        font: {
          size: 11
        },
        callback: function(value) {
          return formatNumber(value);
        }
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
  }
};

const chartOptions = computed(() => darkThemeOptions);

const gainsChartOptions = computed(() => ({
  ...darkThemeOptions,
  plugins: {
    ...darkThemeOptions.plugins,
    tooltip: {
      ...darkThemeOptions.plugins.tooltip,
      callbacks: {
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
    ...darkThemeOptions.scales,
    y: {
      ...darkThemeOptions.scales.y,
      ticks: {
        ...darkThemeOptions.scales.y.ticks,
        callback: function(value) {
          const prefix = value >= 0 ? '+' : '';
          return prefix + formatNumber(Math.abs(value));
        }
      }
    }
  }
}));

// Chart data generators
const chartData = computed(() => {
  if (!chartSelectedResources.value.length || !sortedEntries.value.length) return null;
  
  const datasets = chartSelectedResources.value.map(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return null;
    
    const data = sortedEntries.value.map(entry => entry.values[resourceId] || 0);
    
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
      borderWidth: 2,
      fill: false,
      resourceId: resourceId
    };
  }).filter(Boolean);
  
  return {
    labels: chartLabels.value,
    datasets: datasets
  };
});

const areaChartData = computed(() => {
  if (!chartSelectedResources.value.length || !sortedEntries.value.length) return null;
  
  const datasets = chartSelectedResources.value.map(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return null;
    
    const data = sortedEntries.value.map(entry => entry.values[resourceId] || 0);
    
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
  
  return {
    labels: chartLabels.value,
    datasets: datasets
  };
});

const gainsChartData = computed(() => {
  if (!chartSelectedResources.value.length || sortedEntries.value.length < 2) return null;
  
  const datasets = chartSelectedResources.value.map(resourceId => {
    const resource = chartableResources.value.find(r => r.id === resourceId);
    if (!resource) return null;
    
    const gains = [];
    for (let i = 1; i < sortedEntries.value.length; i++) {
      const current = sortedEntries.value[i].values[resourceId] || 0;
      const previous = sortedEntries.value[i - 1].values[resourceId] || 0;
      gains.push(current - previous);
    }
    
    // Use the exact color from settings
    const borderColor = resource.color;
    const backgroundColor = resource.color.length === 9 
      ? resource.color.slice(0, 7) + '80' // If color has alpha, replace with 80
      : resource.color + '80'; // If no alpha, add 80
    
    return {
      label: resource.name,
      data: gains,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
      resourceId: resourceId
    };
  }).filter(Boolean);
  
  return {
    labels: chartLabels.value.slice(1), // Skip first label since we start from index 1
    datasets: datasets
  };
});

// Methods
function toggleResourceInChart(resourceId) {
  const index = chartSelectedResources.value.indexOf(resourceId);
  if (index > -1) {
    chartSelectedResources.value.splice(index, 1);
  } else {
    // Limit to 5 resources for performance
    if (chartSelectedResources.value.length < 5) {
      chartSelectedResources.value.push(resourceId);
    }
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
