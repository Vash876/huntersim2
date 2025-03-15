<template>
  <div class="flex flex-col gap-4">
    <!-- Chart Container -->
    <div class="bg-gray-700/30 border border-gray-600 p-4 rounded-md">
      <div class="relative h-[250px]" ref="chartContainer">
        <canvas ref="chartRef"></canvas>
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
  // Füge die fehlende show-Property hinzu, die im Watch verwendet wird
  show: {
    type: Boolean,
    default: true
  }
});

const chartRef = ref(null);
const chartContainer = ref(null);
const chart = ref(null);

// Berechne minStage falls nicht bereitgestellt
const computedMinStage = computed(() => {
  if (props.minStage !== null) return props.minStage;
  if (!props.distribution || !props.distribution.length) return null;
  
  return props.distribution.reduce((min, item) => {
    return item.count > 0 && item.stage < min ? item.stage : min;
  }, Infinity);
});

// Bereite Chartdaten vor
const chartData = computed(() => {
  if (!props.distribution || !props.distribution.length) return { stages: [], frequencies: [] };
  
  const stages = [];
  const frequencies = [];
  
  // Berechne die Gesamtzahl der Durchläufe für genaue Prozentsätze
  const totalCount = props.distribution.reduce((sum, item) => sum + item.count, 0);
  
  props.distribution.forEach(item => {
    stages.push(item.stage);
    frequencies.push(item.count);
  });
  
  return { 
    stages, 
    frequencies,
    totalCount
  };
});

// Formatierungsfunktion für Stufen
function formatStage(stage) {
  if (stage === undefined || stage === null) return 'N/A';
  if (stage === Infinity) return 'N/A';
  return stage % 1 === 0 ? stage.toString() : stage.toFixed(1);
}

// Verbesserte Chart-Initialisierung mit nearest-tooltip
async function initChart() {
  // Zuerst altes Chart zerstören
  destroyChart();
  
  // Warten auf DOM-Update
  await nextTick();
  
  try {
    // Überprüfe Bedingungen für die Erstellung
    if (!chartRef.value || !chartContainer.value) {
      console.log('Chart initialization skipped: container or canvas ref is null');
      return;
    }
    
    if (!props.distribution || props.distribution.length === 0) {
      console.warn('No valid data for the chart.');
      return;
    }
    
    const ctx = chartRef.value.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from canvas');
      return;
    }
    
    const colorRGB = getColorRGB(props.color);
    
    // Chart erstellen mit nearest-tooltip Optionen
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
        animation: {
          duration: 150 // Kurze aber sichtbare Animation
        },
        // Nearest-Modus für Interaktionen aktivieren
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            // Positionieren Sie den Tooltip oben statt standardmäßig
            position: 'nearest',
            // Tooltip anzeigen, auch wenn nicht direkt auf einem Punkt
            intersect: false,
            callbacks: {
              label: function(context) {
                const count = context.raw;
                const percentage = ((count / chartData.value.totalCount) * 100).toFixed(1);
                return `Count: ${count} (${percentage}%)`;
              },
              title: function(context) {
                return `Stage ${context[0].label}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              callback: function(value, index) {
                const labels = this.chart.data.labels;
                const step = Math.ceil(labels.length / 15);
                return index % step === 0 ? labels[index] : '';
              }
            }
          }
        },
        // Hover-Funktionalität für besseres Feedback
        hover: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  } catch (error) {
    console.error('Error creating chart:', error);
  }
}

// Verbesserte Chart-Zerstörung
function destroyChart() {
  if (chart.value) {
    try {
      chart.value.destroy();
    } catch (e) {
      console.warn('Error destroying chart:', e);
    }
    chart.value = null;
  }
}

// Einfacher Resize-Handler
const handleResize = debounce(() => {
  if (chart.value && chartRef.value && chartContainer.value) {
    try {
      chart.value.resize();
    } catch (e) {
      // Bei Fehler Chart neu initialisieren
      initChart();
    }
  }
}, 150);

// Beobachte Änderungen an den Daten und Optionen
watch([
  () => props.distribution, 
  () => props.color,
  () => props.sampleSize
], () => {
  initChart();
}, { deep: true });

// DOM-Observer und Event-Listener einrichten
onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  // Chart direkt initialisieren
  nextTick(() => {
    initChart();
  });
});

// Aufräumen
onUnmounted(() => {
  destroyChart();
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Optional: Zusätzliche Stile für das Chart */
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}
</style>