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
import { Bar } from 'vue-chartjs';

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
      stages.push(String(item.stage));
      frequencies.push(Number(item.count));
    }
  });
  
  // Use proper color conversion like ProgressModal
  const colorRGB = getColorRGB(props.color);
  const borderColor = `rgba(${colorRGB}, 1)`;
  const backgroundColor = `rgba(${colorRGB}, 0.25)`;
  
  return {
    labels: stages,
    datasets: [{
      label: 'Stage Frequency',
      data: frequencies,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 2,
      totalCount: totalCount,
    }]
  };
});

// Chart options - fresh object each time to prevent Chart.js mutation leaks
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 10, bottom: 10, left: 10, right: 10 }
    },
    plugins: {
      legend: { display: false },
      // Explicitly disable zoom plugin on this chart
      zoom: false,
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
        type: 'category',
        display: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawOnChartArea: true,
          drawTicks: true
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
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
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawOnChartArea: true,
          drawTicks: true
        },
        beginAtZero: true,
        min: 0,
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          maxTicksLimit: 8,
          callback: function(value) {
            if (typeof value === 'number') {
              return formatNumber(value);
            }
            return '';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: { duration: 0 }
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