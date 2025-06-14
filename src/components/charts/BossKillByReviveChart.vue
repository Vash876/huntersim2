<template>
  <div class="flex flex-col gap-4">
    <!-- Boss Kill Rate by Revive Analysis -->
    <div class="bg-gray-700/30 border border-gray-600 p-4 rounded-md">
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
        <IconTrophy size="20" class="mr-2 text-yellow-400" />
        Boss Kill Rate by Revive Count
        <span class="text-sm text-gray-400 ml-2">(Boss Stages Only)</span>
      </h3>
      
      <div class="relative h-[300px]" ref="chartContainer">
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
            <div class="text-sm">Loading boss chart...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Revive Efficiency Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div 
        v-for="revive in availableRevives" 
        :key="revive"
        class="bg-gray-750 rounded-lg p-3 border border-gray-700"
      >
        <div class="text-xs text-gray-400">{{ getReviveLabel(revive) }}</div>
        <div class="text-lg font-semibold text-white mt-1">
          {{ getBossKillRate(revive) }}%
        </div>
        <div class="text-xs text-gray-500 mt-1">
          {{ getBossAttempts(revive) }} attempts
        </div>
      </div>
    </div>

    <!-- No Boss Data Message -->
    <div v-if="availableRevives.length === 0" class="flex items-center justify-center h-[200px] text-gray-400">
      <div class="text-center">
        <IconTrophy size="48" class="mx-auto mb-4 text-gray-500" />
        <p class="text-lg font-medium mb-2">No Boss Attempts Found</p>
        <p class="text-sm">Boss analysis requires deaths at boss stages (100, 200, 300, etc.).</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { IconTrophy, IconBulb } from '@tabler/icons-vue';
import Chart from 'chart.js/auto';
import debounce from 'lodash/debounce';

const props = defineProps({
  bossKillsByRevive: {
    type: Array,
    default: () => []
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

// Color-Maps für verschiedene Hunter
const colorMaps = {
  blue: {
    primary: 'rgba(59, 130, 246, 0.8)',
    secondary: 'rgba(59, 130, 246, 0.3)',
    border: 'rgba(59, 130, 246, 1)'
  },
  green: {
    primary: 'rgba(34, 197, 94, 0.8)',
    secondary: 'rgba(34, 197, 94, 0.3)',
    border: 'rgba(34, 197, 94, 1)'
  },
  purple: {
    primary: 'rgba(168, 85, 247, 0.8)',
    secondary: 'rgba(168, 85, 247, 0.3)',
    border: 'rgba(168, 85, 247, 1)'
  },
  orange: {
    primary: 'rgba(249, 115, 22, 0.8)',
    secondary: 'rgba(249, 115, 22, 0.3)',
    border: 'rgba(249, 115, 22, 1)'
  }
};

// KORRIGIERTE Boss-Attempt-Daten - ziehe vorherige Bosse ab
const correctedBossData = computed(() => {
  if (!props.bossKillsByRevive?.length) return [];
  
  return props.bossKillsByRevive.map(item => {
    let correctedAttempts = item.attempts;
    
    // Boss-Attempt-Korrektur: Ziehe Extra-Bosse ab
    if (correctedAttempts > props.sampleSize) {
      // Berechne wie viele Extra-Bosse erreicht wurden
      const extraAttempts = correctedAttempts - props.sampleSize;
      const extraBosse = Math.round(extraAttempts / props.sampleSize);
      
      // Ziehe die Extra-Bosse ab
      correctedAttempts = correctedAttempts - (extraBosse * props.sampleSize);
    }
    
    return {
      ...item,
      attempts: correctedAttempts,
      killRate: correctedAttempts > 0 ? ((item.kills / correctedAttempts) * 100).toFixed(1) : "0.0"
    };
  });
});

// Verfügbare Revive-Counts aus korrigierten Daten
const availableRevives = computed(() => {
  if (!correctedBossData.value?.length) return [];
  return correctedBossData.value.map(item => item.revive).sort((a, b) => a - b);
});

// Boss Kill Rate für spezifischen Revive-Count (KORRIGIERTE DATEN!)
function getBossKillRate(revive) {
  const data = correctedBossData.value.find(item => item.revive === revive);
  return data ? parseFloat(data.killRate) : 0;
}

// Boss Attempts für spezifischen Revive-Count (KORRIGIERTE DATEN!)
function getBossAttempts(revive) {
  const data = correctedBossData.value.find(item => item.revive === revive);
  return data ? data.attempts : 0;
}

// Revive Label
function getReviveLabel(revive) {
  if (revive === 0) return 'No Revives';
  if (revive === 1) return '1 Revive';
  return `${revive} Revives`;
}

// Efficiency Label
function getEfficiencyLabel(revive) {
  const rate = parseFloat(getBossKillRate(revive));
  if (rate >= 80) return 'Excellent';
  if (rate >= 60) return 'Good';
  if (rate >= 40) return 'Average';
  if (rate >= 20) return 'Poor';
  return 'Very Poor';
}

// Efficiency Color
function getEfficiencyColor(revive) {
  const rate = parseFloat(getBossKillRate(revive));
  if (rate >= 80) return 'text-green-400';
  if (rate >= 60) return 'text-blue-400';
  if (rate >= 40) return 'text-yellow-400';
  if (rate >= 20) return 'text-orange-400';
  return 'text-red-400';
}

// Optimal Revive Count
const optimalRevive = computed(() => {
  let best = null;
  let highestRate = 0;
  
  availableRevives.value.forEach(revive => {
    const rate = parseFloat(getBossKillRate(revive));
    const attempts = getBossAttempts(revive);
    if (rate > highestRate && attempts >= 5) {
      highestRate = rate;
      best = { revive, killRate: rate.toFixed(1) };
    }
  });
  
  return best;
});

// Chart Data mit korrigierten Daten
const chartData = computed(() => {
  if (availableRevives.value.length === 0) return null;
  
  const colors = colorMaps[props.color] || colorMaps.blue;
  
  return {
    labels: availableRevives.value.map(r => getReviveLabel(r)),
    datasets: [{
      label: 'Boss Kill Rate (%)',
      data: availableRevives.value.map(r => getBossKillRate(r)),
      backgroundColor: colors.primary,
      borderColor: colors.border,
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    }]
  };
});

// Chart Options
const chartOptions = computed(() => ({
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
      display: false
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: '#F9FAFB',
      bodyColor: '#D1D5DB',
      borderColor: '#374151',
      borderWidth: 1,
      filter: function(tooltipItem) {
        return tooltipItem.chart && tooltipItem.chart.canvas;
      },
      callbacks: {
        label: (context) => {
          try {
            const revive = availableRevives.value[context.dataIndex];
            const attempts = getBossAttempts(revive);
            return [
              `Boss Kill Rate: ${context.parsed.y.toFixed(1)}%`,
              `Total Attempts: ${attempts}`,
              `Sample Size: ${props.sampleSize}`
            ];
          } catch (e) {
            return 'Data not available';
          }
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
        drawBorder: false
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(75, 85, 99, 0.3)',
        drawBorder: false
      },
      ticks: {
        color: '#9CA3AF',
        font: {
          size: 11
        },
        callback: (value) => `${value}%`
      },
      title: {
        display: true,
        text: 'Boss Kill Rate (%)',
        color: '#9CA3AF',
        font: {
          size: 12
        }
      }
    }
  }
}));

// ROBUSTE Chart-Initialisierung mit Chart.js Registry-Cleanup
function destroyChart() {
  if (chart.value) {
    try {
      console.log('Destroying boss chart with ID:', chart.value.id);
      chart.value.destroy();
      
      // Chart aus Chart.js Registry entfernen
      if (chartRef.value) {
        Chart.getChart(chartRef.value)?.destroy();
      }
      
    } catch (e) {
      console.warn('Boss chart destroy error (ignored):', e);
    }
    chart.value = null;
  }
  isChartReady.value = false;
}

// ROBUSTE Chart-Initialisierung
async function initChart() {
  if (isInitializing.value) {
    console.log('Boss Chart init skipped: already initializing');
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
        console.log('Found existing boss chart, destroying it first');
        existingChart.destroy();
      }
    }
    
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!chartRef.value || !props.isVisible || !chartData.value) {
      console.log('Boss Chart init aborted: requirements not met');
      return;
    }
    
    const ctx = chartRef.value.getContext('2d');
    if (!ctx) {
      console.log('Boss Chart init aborted: no context');
      return;
    }
    
    // Nochmal prüfen ob Canvas frei ist
    const stillExistingChart = Chart.getChart(chartRef.value);
    if (stillExistingChart) {
      console.warn('Boss Canvas still occupied, forcing destroy');
      stillExistingChart.destroy();
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    chart.value = new Chart(ctx, {
      type: 'bar',
      data: chartData.value,
      options: chartOptions.value,
      
      plugins: [{
        id: 'errorHandler',
        beforeRender: function(chart) {
          try {
            if (!chart.canvas || !chart.canvas.getContext) {
              console.warn('Boss Canvas not available, skipping render');
              return false;
            }
            return true;
          } catch (e) {
            console.warn('Boss Chart render prevented due to error:', e);
            return false;
          }
        }
      }]
    });
    
    console.log('Boss Chart initialized successfully with ID:', chart.value.id);
    
    setTimeout(() => {
      isChartReady.value = true;
    }, 50);
    
  } catch (error) {
    console.error('Boss Chart initialization failed:', error);
    
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
  if (visible && chartData.value) {
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
  () => props.bossKillsByRevive,
  () => props.color,
  () => props.sampleSize
], () => {
  if (props.isVisible) {
    debouncedInit();
  }
}, { deep: true });

onMounted(() => {
  if (props.isVisible && chartData.value) {
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
.bg-gray-750 {
  background-color: rgba(55, 65, 81, 0.8);
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>