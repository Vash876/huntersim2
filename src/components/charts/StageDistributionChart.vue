<template>
  <div class="flex flex-col gap-4">
    <!-- Chart Container -->
    <div class="bg-gray-700/30 border border-gray-600 p-4 rounded-md">
      <div class="relative h-[250px]" ref="chartContainer">
        <!-- Canvas - immer rendern, aber unsichtbar bis bereit -->
        <canvas 
          ref="chartRef"
          :key="canvasKey"
          :style="{ opacity: isChartReady ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }"
        ></canvas>
        
        <!-- Loading overlay - nur sichtbar wenn nicht bereit -->
        <div 
          v-if="!isChartReady"
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { getColorRGB } from '../builds/utils/BuildComparisonUtils';
import Chart from 'chart.js/auto';
import debounce from 'lodash/debounce';

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

const chartRef = ref(null);
const chartContainer = ref(null);
const chart = ref(null);
const canvasKey = ref(0);
const isChartReady = ref(false);
const isInitializing = ref(false); // NEU: Verhindere überlappende Initialisierung

// Computed properties bleiben gleich
const computedMinStage = computed(() => {
  if (props.minStage !== null) return props.minStage;
  if (!props.distribution || !props.distribution.length) return null;
  
  return props.distribution.reduce((min, item) => {
    return item.count > 0 && item.stage < min ? item.stage : min;
  }, Infinity);
});

const chartData = computed(() => {
  if (!props.distribution || !props.distribution.length) return { stages: [], frequencies: [], totalCount: 0 };
  
  const stages = [];
  const frequencies = [];
  const totalCount = props.distribution.reduce((sum, item) => sum + item.count, 0);
  
  props.distribution.forEach(item => {
    stages.push(item.stage);
    frequencies.push(item.count);
  });
  
  return { stages, frequencies, totalCount };
});

function formatStage(stage) {
  if (stage === undefined || stage === null) return 'N/A';
  if (stage === Infinity) return 'N/A';
  return stage % 1 === 0 ? stage.toString() : stage.toFixed(1);
}

// VERBESSERTE Chart-Zerstörung mit Chart.js Registry-Cleanup
function destroyChart() {
  if (chart.value) {
    try {
      console.log('Destroying chart with ID:', chart.value.id);
      chart.value.destroy();
      
      // WICHTIG: Chart aus Chart.js Registry entfernen
      if (chartRef.value) {
        // Lösche Canvas-Element aus Chart.js Registry
        Chart.getChart(chartRef.value)?.destroy();
      }
      
    } catch (e) {
      console.warn('Chart destroy error (ignored):', e);
    }
    chart.value = null;
  }
  isChartReady.value = false;
}

// ROBUSTE Chart-Initialisierung
async function initChart() {
  // Verhindere überlappende Initialisierung
  if (isInitializing.value) {
    console.log('Chart init skipped: already initializing');
    return;
  }
  
  isInitializing.value = true;
  
  try {
    // Chart als "nicht bereit" markieren
    isChartReady.value = false;
    
    // VOLLSTÄNDIGE Zerstörung
    destroyChart();
    
    // Zusätzliche Canvas-Reinigung
    if (chartRef.value) {
      // Prüfe ob Chart.js noch eine Referenz auf dieses Canvas hat
      const existingChart = Chart.getChart(chartRef.value);
      if (existingChart) {
        console.log('Found existing chart, destroying it first');
        existingChart.destroy();
      }
    }
    
    // Warte auf vollständige Zerstörung
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!chartRef.value || !props.isVisible || !chartData.value.stages.length) {
      console.log('Chart init aborted: requirements not met');
      return;
    }
    
    // Context mit zusätzlicher Validierung
    const ctx = chartRef.value.getContext('2d');
    if (!ctx) {
      console.log('Chart init aborted: no context');
      return;
    }
    
    // Nochmal prüfen ob Canvas frei ist
    const stillExistingChart = Chart.getChart(chartRef.value);
    if (stillExistingChart) {
      console.warn('Canvas still occupied, forcing destroy');
      stillExistingChart.destroy();
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    const colorRGB = getColorRGB(props.color);
    
    // Chart erstellen
    chart.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.value.stages,
        datasets: [{
          label: 'Stage Frequency',
          data: chartData.value.frequencies,
          backgroundColor: `rgba(${colorRGB}, 0.6)`,
          borderColor: `rgba(${colorRGB}, 1)`,
          borderWidth: 1,
          borderRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        
        onHover: null,
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            position: 'nearest',
            intersect: false,
            filter: function(tooltipItem) {
              return tooltipItem.chart && tooltipItem.chart.canvas;
            },
            callbacks: {
              label: function(context) {
                try {
                  const count = context.raw;
                  const percentage = ((count / chartData.value.totalCount) * 100).toFixed(1);
                  return `Count: ${count} (${percentage}%)`;
                } catch (e) {
                  return 'Data not available';
                }
              },
              title: function(context) {
                try {
                  return `Stage ${context[0].label}`;
                } catch (e) {
                  return 'Stage';
                }
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { 
              color: 'rgba(255, 255, 255, 0.7)',
              callback: function(value) {
                try {
                  return value;
                } catch (e) {
                  return '';
                }
              }
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              callback: function(value, index) {
                try {
                  const labels = this.chart.data.labels;
                  const step = Math.ceil(labels.length / 15);
                  return index % step === 0 ? labels[index] : '';
                } catch (e) {
                  return '';
                }
              }
            }
          }
        }
      },
      
      plugins: [{
        id: 'errorHandler',
        beforeRender: function(chart) {
          try {
            if (!chart.canvas || !chart.canvas.getContext) {
              console.warn('Canvas not available, skipping render');
              return false;
            }
            return true;
          } catch (e) {
            console.warn('Chart render prevented due to error:', e);
            return false;
          }
        }
      }]
    });
    
    console.log('Chart initialized successfully with ID:', chart.value.id);
    
    // Chart als bereit markieren - SMOOTH FADE-IN
    setTimeout(() => {
      isChartReady.value = true;
    }, 50);
    
  } catch (error) {
    console.error('Chart initialization failed:', error);
    
    // Bei Fehlern: Canvas komplett neu erstellen
    isChartReady.value = false;
    destroyChart();
    canvasKey.value++;
    
    setTimeout(() => {
      if (props.isVisible) {
        initChart();
      }
    }, 500);
    
  } finally {
    isInitializing.value = false;
  }
}

// STARK DEBOUNCED Watchers
const debouncedInit = debounce(() => {
  if (props.isVisible && !isInitializing.value) {
    initChart();
  }
}, 300); // Längere Debounce

// Visibility Watcher
watch(() => props.isVisible, (visible) => {
  if (visible && chartData.value.stages.length > 0) {
    setTimeout(() => {
      if (props.isVisible && !isInitializing.value) {
        initChart();
      }
    }, 150);
  } else {
    destroyChart();
  }
}, { immediate: true });

// Daten-Watcher - SEHR defensiv
watch([
  () => props.distribution,
  () => props.color
], () => {
  if (props.isVisible) {
    debouncedInit();
  }
}, { deep: true });

onMounted(() => {
  if (props.isVisible && chartData.value.stages.length > 0) {
    setTimeout(() => {
      if (props.isVisible && !isInitializing.value) {
        initChart();
      }
    }, 200);
  }
});

onUnmounted(() => {
  destroyChart();
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}
</style>