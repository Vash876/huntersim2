<template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <div class="text-sm font-medium text-gray-300">Stage Distribution</div>
      <button @click="toggleDistribution" class="text-xs text-gray-400 hover:text-white flex items-center">
        {{ showDistribution ? 'Hide chart' : 'Show chart' }}
        <IconChevronDown v-if="!showDistribution" size="16" />
        <IconChevronUp v-else size="16" />
      </button>
    </div>
    
    <div v-show="showDistribution" class="h-48 mt-2 rounded-lg overflow-hidden" ref="chartContainer">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue';
import Chart from 'chart.js/auto';
import { getColorRGB } from '../utils/BuildComparisonUtils';
import debounce from 'lodash/debounce';

const props = defineProps({
  stageDistribution: { type: Array, required: true },
  hunterColor: { type: String, required: true }
});

const showDistribution = ref(false);
const chartRef = ref(null);
const chartContainer = ref(null);
const chart = ref(null);
const chartData = ref({
  stages: [],
  frequencies: []
});
const isChartReady = ref(false);

// Normalized stage distribution
const normalizedStageDistribution = computed(() => {
  if (!props.stageDistribution || props.stageDistribution.length === 0) return [];
  
  const firstItem = props.stageDistribution[0];
  
  // Format: { stage: number, count: number }
  if (firstItem && 'stage' in firstItem && 'count' in firstItem) {
    return props.stageDistribution.map(item => ({
      stage: item.stage,
      frequency: item.count
    }));
  }
  
  // Format: { stage: number, frequency: number }
  if (firstItem && 'stage' in firstItem && 'frequency' in firstItem) {
    return props.stageDistribution;
  }
  
  // Format: [stage, count] (Array tuple)
  if (Array.isArray(firstItem) && firstItem.length === 2) {
    return props.stageDistribution.map(([stage, count]) => ({
      stage,
      frequency: count
    }));
  }
  
  console.error('Unknown format for stageDistribution:', props.stageDistribution);
  return [];
});

// Prepare chart data - separated from chart rendering for optimization
function prepareChartData() {
  const stages = [];
  const frequencies = [];
  
  normalizedStageDistribution.value.forEach(entry => {
    stages.push(entry.stage);
    frequencies.push(entry.frequency);
  });
  
  chartData.value = { stages, frequencies };
  console.log('Chart data prepared:', chartData.value);
}

// Toggle chart visibility with proper handling
function toggleDistribution() {
  showDistribution.value = !showDistribution.value;
  
  // Wenn das Chart angezeigt werden soll, warten wir bis der DOM aktualisiert wurde
  if (showDistribution.value) {
    // Markieren für DOM-Update
    isChartReady.value = false;
    
    // Längere Verzögerung, um DOM-Aktualisierung sicherzustellen
    setTimeout(() => {
      isChartReady.value = true;
      scheduleChartInit();
    }, 50);
  }
}

// Safer chart initialization with resilience to DOM changes
async function initChart() {
  // Always destroy any existing chart first
  destroyChart();
  
  // Wait for next DOM update
  await nextTick();
  
  // Nicht fortfahren, wenn das Chart nicht sichtbar sein soll
  if (!showDistribution.value || !isChartReady.value) {
    console.log('Chart initialization skipped: chart is not visible or not ready');
    return false;
  }
  
  // Skip if container or canvas ref is missing
  if (!chartContainer.value || !chartRef.value) {
    console.log('Chart initialization skipped: container or canvas ref is null');
    return false;
  }

  // Check for valid data
  if (normalizedStageDistribution.value.length === 0) {
    console.warn('No valid data for the chart.');
    return false;
  }
  
  // Ensure canvas is properly sized
  const container = chartContainer.value;
  const canvas = chartRef.value;
  
  // Make sure chart container has dimensions
  if (container.clientWidth === 0 || container.clientHeight === 0) {
    console.warn('Chart container has no dimensions yet');
    return false;
  }
  
  try {
    // Get canvas context with additional checks
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2d context from canvas');
      return false;
    }
    
    const colorRGB = getColorRGB(props.hunterColor);
    
    // Create the chart
    chart.value = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.value.stages,
        datasets: [{
          label: 'Frequency',
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
          duration: 250 // Faster animations for better performance
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
                const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
                const percentage = ((count / total) * 100).toFixed(1);
                return `Count: ${count} (${percentage}%)`;
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
              color: 'rgba(156, 163, 175, 1)'
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

// Debounced chart initialization to prevent too many renders during resize/zoom
const scheduleChartInit = debounce(async () => {
  // Prepare data first
  prepareChartData();
  
  // Wenn nicht bereit, warten und später erneut versuchen
  if (!isChartReady.value) {
    setTimeout(() => scheduleChartInit(), 100);
    return;
  }
  
  // First try
  let success = await initChart();
  
  // If failed on first try, try again after a delay
  if (!success) {
    setTimeout(async () => {
      success = await initChart();
      
      // Wenn immer noch fehlgeschlagen, ein letztes Mal mit längerer Verzögerung versuchen
      if (!success) {
        setTimeout(async () => {
          // Sicherstellen, dass DOM vollständig geladen ist
          await new Promise(resolve => requestAnimationFrame(resolve));
          await nextTick();
          initChart();
        }, 300);
      }
    }, 150);
  }
}, 100);

// Destroy chart safely
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

// Watch for visibility changes
watch(showDistribution, (newVal) => {
  if (newVal) {
    // Verzögern, um sicherzustellen, dass der Container vollständig sichtbar ist
    setTimeout(() => {
      isChartReady.value = true;
      scheduleChartInit();
    }, 100);
  } else {
    // Chart nicht sofort zerstören, falls Benutzer schnell umschaltet
    setTimeout(() => {
      if (!showDistribution.value) {
        destroyChart();
      }
    }, 300);
  }
});

// Watch for changes in stage distribution data
watch(() => props.stageDistribution, () => {
  prepareChartData();
  if (showDistribution.value) {
    scheduleChartInit();
  }
}, { deep: true });

// Watch for changes in hunter color
watch(() => props.hunterColor, () => {
  if (showDistribution.value) {
    scheduleChartInit();
  }
});

// Resilient resize handler
const handleResize = debounce(() => {
  if (showDistribution.value) {
    scheduleChartInit();
  }
}, 150);

// Observer to detect DOM changes that might affect the chart
let resizeObserver = null;

// Setup DOM observers and event listeners
onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  // Use ResizeObserver to watch for container size changes
  if (window.ResizeObserver) {
    resizeObserver = new ResizeObserver(entries => {
      if (showDistribution.value && isChartReady.value) {
        // Nur auslösen, wenn die Größe sich tatsächlich geändert hat
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
    if (e.ctrlKey && showDistribution.value && isChartReady.value) {
      handleResize();
    }
  }, 100);
  
  window.addEventListener('wheel', wheelHandler, { passive: true });
  
  // Bei Montierung des Komponenten isChartReady auf true setzen
  // Aber mit Verzögerung, um sicherzustellen, dass DOM vollständig geladen ist
  setTimeout(() => {
    isChartReady.value = true;
  }, 200);
});

// Cleanup
onUnmounted(() => {
  destroyChart();
  window.removeEventListener('resize', handleResize);
  
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  
  // Remove wheel event listener
  window.removeEventListener('wheel', handleResize);
});
</script>