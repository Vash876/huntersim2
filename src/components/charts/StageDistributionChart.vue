<template>
  <div class="flex flex-col gap-4">
    <!-- Chart Container -->
    <div class="bg-gray-700/30 border border-gray-600 p-4 rounded-md">
      <div class="h-[250px] relative bg-transparent" :key="`stage-chart-container-${chartRenderKey}`">
        <!-- Bar Chart -->
        <div v-if="chartData && props.isVisible" class="w-full h-full">
          <Bar
            :data="chartData"
            :options="chartOptions"
            :key="`stage-bar-${chartRenderKey}`"
            class="w-full h-full"
          />
        </div>
        
        <!-- Loading overlay - nur sichtbar wenn nicht bereit -->
        <div 
          v-if="!chartData || !props.isVisible"
          class="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-700/30"
        >
          <div class="text-center">
            <div class="animate-spin w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full mx-auto mb-2"></div>
            <div class="text-sm">Loading chart...</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Stats Summary -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-gray-700/30 border border-gray-600 p-3 rounded-md">
        <div class="text-sm text-gray-300 mb-1">Min Stage</div>
        <div class="text-xl font-bold text-white">{{ formatStage(computedMinStage) }}</div>
      </div>
      <div class="bg-gray-700/30 border border-gray-600 p-3 rounded-md">
        <div class="text-sm text-gray-300 mb-1">Avg Stage</div>
        <div class="text-xl font-bold text-white">{{ formatStage(avgStage) }}</div>
      </div>
      <div class="bg-gray-700/30 border border-gray-600 p-3 rounded-md">
        <div class="text-sm text-gray-300 mb-1">Max Stage</div>
        <div class="text-xl font-bold text-white">{{ formatStage(maxStage) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { getColorRGB } from '../builds/utils/BuildComparisonUtils';
import { formatNumber } from '@/composables/format.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'vue-chartjs';

// Force Chart.js registration for production builds
let chartRegistered = false;
function ensureChartRegistration() {
  if (!chartRegistered) {
    try {
      ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );
      chartRegistered = true;
    } catch (error) {
      console.warn('Chart.js components already registered:', error);
      chartRegistered = true;
    }
  }
}

// Ensure registration on component mount
onMounted(() => {
  ensureChartRegistration();
});

const props = defineProps({
  distribution: {
    type: Array,
    required: true
  },
  avgStage: {
    type: Number,
    default: 0
  },
  maxStage: {
    type: Number,
    default: null
  },
  minStage: {
    type: Number,
    default: null
  },
  sampleSize: {
    type: Number,
    default: 1000
  },
  color: {
    type: String,
    default: 'gray'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
});

// Chart state
const chartRenderKey = ref(0);

// Force chart update function
function forceChartUpdate() {
  chartRenderKey.value += 1;
}

// Watch for changes that should trigger chart re-render
watch([() => props.distribution, () => props.color, () => props.isVisible], () => {
  forceChartUpdate();
}, { deep: true });

// Computed properties
const computedMinStage = computed(() => {
  if (props.minStage !== null) return props.minStage;
  if (!props.distribution || !props.distribution.length) return null;
  
  return props.distribution.reduce((min, item) => {
    return item.count > 0 && item.stage < min ? item.stage : min;
  }, Infinity);
});

// Chart data
const chartData = computed(() => {
  if (!props.distribution || !props.distribution.length) return null;
  
  const stages = [];
  const frequencies = [];
  const totalCount = props.distribution.reduce((sum, item) => sum + item.count, 0);
  
  // Validate and clean data
  props.distribution.forEach(item => {
    if (item.stage !== undefined && item.count !== undefined && typeof item.count === 'number') {
      stages.push(String(item.stage)); // Ensure string labels for X-axis
      frequencies.push(Number(item.count)); // Ensure numeric values for Y-axis
    }
  });
  
  console.log('Chart Data Debug:', {
    stages: stages.slice(0, 5),
    frequencies: frequencies.slice(0, 5),
    totalCount,
    dataLength: stages.length
  });
  
  // Use proper color conversion like ProgressModal
  const colorRGB = getColorRGB(props.color);
  const borderColor = `rgba(${colorRGB}, 1)`;
  const backgroundColor = `rgba(${colorRGB}, 0.25)`; // 0.25 = 40/255 for transparency
  
  return {
    labels: stages, // X-axis: Stage numbers as strings
    datasets: [{
      label: 'Stage Frequency',
      data: frequencies, // Y-axis: Count values as numbers
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 2,
      fill: false,
      totalCount: totalCount,
      // Explicitly set data types
      parsing: {
        xAxisKey: 'x',
        yAxisKey: 'y'
      }
    }]
  };
});

// Dark theme options - exakt wie ProgressModal
const darkThemeOptions = {
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
      display: false
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
          return `Stage ${context[0].label}`;
        },
        label: function(context) {
          const count = context.parsed.y;
          const totalCount = context.dataset.totalCount;
          const percentage = ((count / totalCount) * 100).toFixed(1);
          return `Count: ${formatNumber(count)} (${percentage}%)`;
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
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
        callback: function(value, index) {
          const labels = this.chart.data.labels;
          const step = Math.ceil(labels.length / 8);
          return index % step === 0 ? labels[index] : '';
        }
      }
    },
    y: {
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
      },
      suggestedMin: 0,
      beginAtZero: true
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
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
  }
};

const chartOptions = computed(() => {
  // Ensure Chart.js is properly registered
  ensureChartRegistration();
  
  return {
    ...darkThemeOptions,
    // Add unique ID to prevent data sharing between charts
    chartId: `stage-distribution-chart-${chartRenderKey.value}-${Date.now()}`,
    // Force destroy previous chart instances
    destroy: true,
    plugins: {
      ...darkThemeOptions.plugins,
      legend: {
        display: false
      },
      tooltip: {
        ...darkThemeOptions.plugins.tooltip,
        callbacks: {
          title: function(context) {
            return `Stage ${context[0].label}`;
          },
          label: function(context) {
            const count = context.parsed.y;
            const dataset = context.chart.data.datasets[context.datasetIndex];
            const totalCount = dataset.totalCount || context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
            const percentage = ((count / totalCount) * 100).toFixed(1);
            return `Count: ${formatNumber(count)} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category', // Explicitly set scale type
        display: true,
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
          callback: function(value, index) {
            const labels = this.chart.data.labels;
            const step = Math.ceil(labels.length / 8);
            return index % step === 0 ? labels[index] : '';
          }
        }
      },
      y: {
        type: 'linear', // Explicitly set scale type
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          borderColor: 'rgba(75, 85, 99, 0.5)',
          drawOnChartArea: true,
          drawTicks: true
        },
        beginAtZero: true,
        min: 0, // Force minimum value
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11
          },
          maxTicksLimit: 8,
          stepSize: undefined,
          callback: function(value) {
            // Ensure we only show numeric iteration counts
            if (typeof value === 'number') {
              return formatNumber(value);
            }
            return '';
          }
        }
      }
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

function formatStage(stage) {
  if (stage === undefined || stage === null) return 'N/A';
  if (stage === Infinity) return 'N/A';
  return stage % 1 === 0 ? stage.toString() : stage.toFixed(1);
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}
</style>