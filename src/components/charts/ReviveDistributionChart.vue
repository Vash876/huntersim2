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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { getColorRGB } from '../builds/utils/BuildComparisonUtils';
import Chart from 'chart.js/auto';
import debounce from 'lodash/debounce';

const props = defineProps({
  deathDistribution: {
    type: Array,
    required: true
  },
  sampleSize: {
    type: Number,
    default: 1000
  },
  color: {
    type: String,
    default: 'blue'
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
const isInitializing = ref(false);

// Dynamische Farben für verschiedene Revive-Typen (HSL für bessere Variation)
const reviveColors = [
  '34, 197, 94',   // Grün - Revive 1 (sicher)
  '251, 191, 36',  // Gelb - Revive 2 (Warnung)
  '239, 68, 68',   // Rot - Revive 3 (gefährlich)
  '147, 51, 234',  // Lila - Revive 4 (kritisch)
  '59, 130, 246',  // Blau - Revive 5 (extrem)
  '16, 185, 129',  // Teal - Revive 6+
];

// Verarbeite Death Distribution und finde alle verfügbaren Revives
const processedData = computed(() => {
  if (!props.deathDistribution || !props.deathDistribution.length) {
    return { stages: [], reviveData: {}, stageGroups: {}, availableRevives: [] };
  }
  
  // Gruppiere nach Stage und separiere alle Revive-Typen
  const stageGroups = {};
  const reviveTypes = new Set();
  
  props.deathDistribution.forEach(item => {
    const parts = item.stage.toString().split('_');
    if (parts.length === 2) {
      const stage = parseInt(parts[0]);
      const reviveNum = parseInt(parts[1]);
      
      reviveTypes.add(reviveNum);
      
      if (!stageGroups[stage]) {
        stageGroups[stage] = {};
      }
      
      stageGroups[stage][reviveNum] = item.count;
    }
  });
  
  // Sortiere Revive-Typen und Stages
  const availableRevives = Array.from(reviveTypes).sort((a, b) => a - b);
  const sortedStages = Object.keys(stageGroups).map(Number).sort((a, b) => a - b);
  
  // Erstelle Daten-Arrays für jedes Revive
  const stages = [];
  const reviveData = {};
  
  // Initialisiere Arrays für jedes Revive
  availableRevives.forEach(revive => {
    reviveData[revive] = [];
  });
  
  sortedStages.forEach(stage => {
    stages.push(stage);
    
    availableRevives.forEach(revive => {
      const count = stageGroups[stage][revive] || 0;
      reviveData[revive].push(count);
    });
  });
  
  return { stages, reviveData, stageGroups, availableRevives };
});

// Extrahiere verfügbare Revives
const availableRevives = computed(() => processedData.value.availableRevives);

// Grid-Klasse basierend auf Anzahl der Elemente
const statsGridClass = computed(() => {
  const totalItems = availableRevives.value.length + 2; // +2 für Total Deaths und Danger Zone
  if (totalItems <= 3) return 'grid-cols-3';
  if (totalItems <= 4) return 'grid-cols-2 md:grid-cols-4';
  if (totalItems <= 5) return 'grid-cols-2 md:grid-cols-5';
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
});

// Berechne Statistiken
const totalDeaths = computed(() => {
  if (!props.deathDistribution) return 0;
  return props.deathDistribution.reduce((sum, item) => sum + item.count, 0);
});

// Funktionen für Revive-Handling
function getReviveColor(revive, opacity = 1) {
  const colorIndex = Math.min(revive - 1, reviveColors.length - 1);
  const color = reviveColors[colorIndex];
  return `rgba(${color}, ${opacity})`;
}

function getReviveLabel(revive) {
  if (revive === 1) return 'First Revive';
  if (revive === 2) return 'Second Revive';
  if (revive === 3) return 'Third Revive';
  return `${revive}th Revive`;
}

function getReviveRiskLabel(revive) {
  if (revive === 1) return '(Safer)';
  if (revive === 2) return '(Warning)';
  if (revive === 3) return '(Danger!)';
  if (revive >= 4) return '(Critical!)';
  return '';
}

function getReviveTotal(revive) {
  if (!processedData.value.reviveData[revive]) return 0;
  return processedData.value.reviveData[revive].reduce((sum, count) => sum + count, 0);
}

function getRevivePercentage(revive) {
  if (totalDeaths.value === 0) return 0;
  return ((getReviveTotal(revive) / totalDeaths.value) * 100).toFixed(1);
}

// Danger Zone: Stages wo viele höhere Revives auftreten
const dangerZoneStages = computed(() => {
  const dangerStages = [];
  
  Object.entries(processedData.value.stageGroups || {}).forEach(([stage, reviveData]) => {
    const total = Object.values(reviveData).reduce((sum, count) => sum + count, 0);
    const highRevives = Object.entries(reviveData)
      .filter(([revive]) => parseInt(revive) >= 2)
      .reduce((sum, [, count]) => sum + count, 0);
    
    if (total > 0 && (highRevives / total) > 0.3) { // Mehr als 30% Revive 2+
      dangerStages.push(stage);
    }
  });
  
  return dangerStages.length > 0 ? dangerStages.join(', ') : 'None';
});

// ROBUSTE Chart-Initialisierung mit Chart.js Registry-Cleanup
function destroyChart() {
  if (chart.value) {
    try {
      console.log('Destroying revive chart with ID:', chart.value.id);
      chart.value.destroy();
      
      // Chart aus Chart.js Registry entfernen
      if (chartRef.value) {
        Chart.getChart(chartRef.value)?.destroy();
      }
      
    } catch (e) {
      console.warn('Revive chart destroy error (ignored):', e);
    }
    chart.value = null;
  }
  isChartReady.value = false;
}

// ROBUSTE Chart-Initialisierung
async function initChart() {
  if (isInitializing.value) {
    console.log('Revive Chart init skipped: already initializing');
    return;
  }
  
  isInitializing.value = true;
  
  try {
    isChartReady.value = false;
    destroyChart();
    
    // Zusätzliche Canvas-Reinigung
    if (chartRef.value) {
      const existingChart = Chart.getChart(chartRef.value);
      if (existingChart) {
        console.log('Found existing revive chart, destroying it first');
        existingChart.destroy();
      }
    }
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!chartRef.value || !props.isVisible || !processedData.value.stages.length) {
      console.log('Revive Chart init aborted: requirements not met');
      return;
    }
    
    const ctx = chartRef.value.getContext('2d');
    if (!ctx) {
      console.log('Revive Chart init aborted: no context');
      return;
    }
    
    // Nochmal prüfen ob Canvas frei ist
    const stillExistingChart = Chart.getChart(chartRef.value);
    if (stillExistingChart) {
      console.warn('Revive Canvas still occupied, forcing destroy');
      stillExistingChart.destroy();
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Erstelle Datasets für alle verfügbaren Revives
    const datasets = availableRevives.value.map(revive => ({
      label: getReviveLabel(revive),
      data: processedData.value.reviveData[revive],
      backgroundColor: getReviveColor(revive, 0.7), // Transparent für Überlappung
      borderColor: getReviveColor(revive, 1),
      borderWidth: 1,
      borderRadius: 3
    }));
    
    chart.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: processedData.value.stages,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        
        onHover: null,
        interaction: {
          mode: 'index',
          intersect: false
        },
        
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'rgba(255, 255, 255, 0.8)',
              usePointStyle: true,
              pointStyle: 'rect'
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            mode: 'index',
            intersect: false,
            filter: function(tooltipItem) {
              return tooltipItem.chart && tooltipItem.chart.canvas;
            },
            callbacks: {
              title: function(context) {
                try {
                  return `Stage ${context[0].label}`;
                } catch (e) {
                  return 'Stage';
                }
              },
              label: function(context) {
                try {
                  const count = context.raw;
                  const datasetLabel = context.dataset.label;
                  
                  // Berechne Total für diese Stage
                  const stageTotal = availableRevives.value.reduce((sum, revive) => {
                    return sum + (processedData.value.reviveData[revive][context.dataIndex] || 0);
                  }, 0);
                  
                  const percentage = stageTotal > 0 ? ((count / stageTotal) * 100).toFixed(1) : 0;
                  return `${datasetLabel}: ${count} (${percentage}%)`;
                } catch (e) {
                  return 'Data not available';
                }
              },
              footer: function(context) {
                try {
                  const index = context[0].dataIndex;
                  const total = availableRevives.value.reduce((sum, revive) => {
                    return sum + (processedData.value.reviveData[revive][index] || 0);
                  }, 0);
                  return `Total Deaths: ${total}`;
                } catch (e) {
                  return '';
                }
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: true, // Gestapelt für bessere Übersicht
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
            stacked: true,
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
              console.warn('Revive Canvas not available, skipping render');
              return false;
            }
            return true;
          } catch (e) {
            console.warn('Revive Chart render prevented due to error:', e);
            return false;
          }
        }
      }]
    });
    
    console.log('Revive Chart initialized successfully with ID:', chart.value.id);
    
    setTimeout(() => {
      isChartReady.value = true;
    }, 50);
    
  } catch (error) {
    console.error('Revive Chart initialization failed:', error);
    
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

// DEBOUNCED Watchers
const debouncedInit = debounce(() => {
  if (props.isVisible && !isInitializing.value) {
    initChart();
  }
}, 300);

// Visibility Watcher
watch(() => props.isVisible, (visible) => {
  if (visible && processedData.value.stages.length > 0) {
    setTimeout(() => {
      if (props.isVisible && !isInitializing.value) {
        initChart();
      }
    }, 150);
  } else {
    destroyChart();
  }
}, { immediate: true });

// Daten-Watcher
watch([
  () => props.deathDistribution,
  () => props.color,
  () => props.sampleSize
], () => {
  if (props.isVisible) {
    debouncedInit();
  }
}, { deep: true });

onMounted(() => {
  if (props.isVisible && processedData.value.stages.length > 0) {
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