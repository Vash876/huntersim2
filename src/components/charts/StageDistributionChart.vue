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
  }
});

const chartRef = ref(null);
const chartContainer = ref(null);
const chart = ref(null);
const isChartReady = ref(false);

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

// Sichere Chart-Initialisierung
async function initChart() {
  // Zuerst vorhandenes Chart zerstören
  destroyChart();
  
  // Auf nächstes DOM-Update warten
  await nextTick();
  
  // Nicht fortfahren, wenn nicht bereit
  if (!isChartReady.value) {
    console.log('Chart initialization skipped: chart is not ready');
    return false;
  }
  
  // Überprüfen, ob Container oder Canvas-Ref fehlt
  if (!chartContainer.value || !chartRef.value) {
    console.log('Chart initialization skipped: container or canvas ref is null');
    return false;
  }

  // Auf gültige Daten prüfen
  if (!props.distribution || props.distribution.length === 0) {
    console.warn('No valid data for the chart.');
    return false;
  }
  
  // Sicherstellen, dass Canvas richtig dimensioniert ist
  const container = chartContainer.value;
  const canvas = chartRef.value;
  
  // Sicherstellen, dass Chart-Container Dimensionen hat
  if (container.clientWidth === 0 || container.clientHeight === 0) {
    console.warn('Chart container has no dimensions yet');
    return false;
  }
  
  try {
    // Canvas-Kontext mit zusätzlichen Prüfungen holen
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from canvas');
      return false;
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
        animation: {
          duration: 250 // Schnellere Animationen für bessere Performance
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: 'rgba(255, 255, 255, 0.9)',
            bodyColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: `rgba(${colorRGB}, 0.3)`,
            borderWidth: 1,
            padding: 10,
            boxPadding: 5,
            cornerRadius: 4,
            displayColors: false,
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
              color: 'rgba(75, 85, 99, 0.2)',
              drawBorder: false
            },
            ticks: {
              color: 'rgba(156, 163, 175, 1)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(156, 163, 175, 1)',
              // Nur jeden X-ten Wert anzeigen, um Überfüllung zu vermeiden
              callback: function(value, index) {
                const labels = this.chart.data.labels;
                const step = Math.ceil(labels.length / 15);
                return index % step === 0 ? labels[index] : '';
              }
            }
          }
        }
      }
    });
    
    console.log('Chart successfully initialized');
    return true;
  } catch (error) {
    console.error('Error creating chart:', error);
    return false;
  }
}

// Debounce-optimierte Chart-Initialisierung
const scheduleChartInit = debounce(async () => {
  // Nicht bereit, warten und später erneut versuchen
  if (!isChartReady.value) {
    setTimeout(() => scheduleChartInit(), 100);
    return;
  }
  
  // Erster Versuch
  let success = await initChart();
  
  // Bei Fehlversuch nach Verzögerung erneut versuchen
  if (!success) {
    setTimeout(async () => {
      success = await initChart();
      
      // Bei wiederholtem Fehlversuch ein letztes Mal mit größerer Verzögerung versuchen
      if (!success) {
        setTimeout(async () => {
          // Sicherstellen dass DOM vollständig geladen ist
          await new Promise(resolve => requestAnimationFrame(resolve));
          await nextTick();
          initChart();
        }, 300);
      }
    }, 150);
  }
}, 100);

// Chart sicher zerstören
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

// Beobachte Änderungen an den Verteilungsdaten
watch(() => props.distribution, () => {
  scheduleChartInit();
}, { deep: true });

// Beobachte Änderungen an der Farbe
watch(() => props.color, () => {
  scheduleChartInit();
});

// Beobachte Änderungen an der Stichprobengröße
watch(() => props.sampleSize, () => {
  scheduleChartInit();
});

// Debounce-optimierter Handler für Größenänderungen
const handleResize = debounce(() => {
  scheduleChartInit();
}, 150);

// Observer für DOM-Änderungen, die das Chart beeinflussen könnten
let resizeObserver = null;

// DOM-Observer und Event-Listener einrichten
onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  // ResizeObserver für Containergrößenänderungen verwenden
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(entries => {
      if (isChartReady.value) {
        // Nur auslösen, wenn sich die Größe tatsächlich geändert hat
        const entry = entries[0];
        if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          handleResize();
        }
      }
    });
    
    // Nach dem nächsten DOM-Update dem Observer hinzufügen
    nextTick(() => {
      if (chartContainer.value) {
        resizeObserver.observe(chartContainer.value);
      }
    });
  }
  
  // Überwachen von Zoom-Änderungen
  const wheelHandler = debounce((e) => {
    if (e.ctrlKey && isChartReady.value) {
      handleResize();
    }
  }, 100);
  
  window.addEventListener('wheel', wheelHandler, { passive: true });
  
  // Bei Montierung der Komponente Chart initialisieren
  // Mit Verzögerung, um sicherzustellen, dass DOM vollständig geladen ist
  setTimeout(() => {
    isChartReady.value = true;
    scheduleChartInit();
  }, 200);
});

// Aufräumen
onUnmounted(() => {
  destroyChart();
  window.removeEventListener('resize', handleResize);
  
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  
  // Wheel-Event-Listener entfernen
  window.removeEventListener('wheel', handleResize);
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