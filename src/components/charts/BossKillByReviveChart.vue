<template>
  <div class="flex flex-col gap-4">
    <!-- Chart Description -->
    <div class="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-amber-200 dark:border-gray-600">
      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <IconBulb class="inline w-4 h-4 mr-2 text-amber-500" />
        This chart shows your boss kill success rate based on remaining lives when encountering <span class="font-semibold text-amber-600 dark:text-amber-400">Boss Stage {{ maxBossStage }}</span>.
      </p>
    </div>

    <!-- Boss Kill Rate by Revive Analysis -->
    <div class="bg-gray-700/30 border border-gray-600 p-4 rounded-md">
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
        <IconTrophy size="20" class="mr-2 text-yellow-400" />
        Boss Kill Rate by Revive Count
        <span class="text-sm text-gray-400 ml-2">(Boss Stages Only)</span>
      </h3>
      
      <div class="relative h-[300px]" ref="chartContainer">
        <!-- Loading overlay -->
        <div 
          v-if="!chartData"
          class="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-700/30"
        >
          <div class="text-center">
            <div class="animate-spin w-8 h-8 border-2 border-gray-600 border-t-gray-400 rounded-full mx-auto mb-2"></div>
            <div class="text-sm">Loading boss chart...</div>
          </div>
        </div>
        
        <!-- Chart Component -->
        <Bar
          v-if="chartData"
          :key="chartRenderKey"
          :data="chartData"
          :options="chartOptions"
          class="w-full h-full"
        />
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
import debounce from 'lodash/debounce';
import { useHunterStore } from '@/store/hunterStore';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const hunterStore = useHunterStore();

const props = defineProps({
  bossKillsByRevive: {
    type: Array,
    default: () => []
  },
  sampleSize: {
    type: Number,
    default: 1000
  },
  hunterId: {
    type: String,
    required: true
  },
  buildId: {
    type: String,
    required: true
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

// Chart state for Vue-chartjs
const chartRenderKey = ref(0);

// Force chart update function
function forceChartUpdate() {
  chartRenderKey.value += 1;
}

const maxBossStage = computed(() => {
  if (!props.bossKillsByRevive?.length) return null;
  
  // Finde die höchste finalStage aus den Daten
  let maxStage = 0;
  props.bossKillsByRevive.forEach(item => {
    if (item.finalStage && item.finalStage > maxStage) {
      maxStage = item.finalStage;
    }
  });
  
  if (maxStage > 0) {
    // Konvertiere Stage zu Boss (302.3 → Boss 300)
    return Math.floor(maxStage / 100) * 100;
  }
  
  return null;
});

// Color-Maps für verschiedene Hunter
const colorMaps = {
  blue: {
    primary: 'rgba(59, 130, 246, 0.25)',
    secondary: 'rgba(59, 130, 246, 0.3)',
    border: 'rgba(59, 130, 246, 1)'
  },
  green: {
    primary: 'rgba(34, 197, 94, 0.25)',
    secondary: 'rgba(34, 197, 94, 0.3)',
    border: 'rgba(34, 197, 94, 1)'
  },
  purple: {
    primary: 'rgba(168, 85, 247, 0.25)',
    secondary: 'rgba(168, 85, 247, 0.3)',
    border: 'rgba(168, 85, 247, 1)'
  },
  orange: {
    primary: 'rgba(249, 115, 22, 0.25)',
    secondary: 'rgba(249, 115, 22, 0.3)',
    border: 'rgba(249, 115, 22, 1)'
  }
};

// NEU: Effective Data aus Store + Props
const effectiveBossData = computed(() => {
  // 1. Priorität: Store-Cache (hat korrekte sampleSize nach Fix)
  const cached = hunterStore.getCachedBossKillsByRevive(props.hunterId, props.buildId);
  if (cached?.data?.length > 0) {
    console.log('Using cached Boss Kill Rate data from store with sampleSize:', cached.sampleSize);
    return cached;
  }
  
  // 2. Priorität: Props-Daten (frische Evaluation)
  if (props.bossKillsByRevive?.length > 0) {
    console.log('Using fresh Boss Kill Rate data from props with sampleSize:', props.sampleSize);
    return {
      data: props.bossKillsByRevive,
      sampleSize: props.sampleSize
    };
  }
  
  // 3. Fallback: Keine Daten
  console.log('No Boss Kill Rate data available');
  return { data: [], sampleSize: 1000 };
});

// KORRIGIERTE Boss-Attempt-Daten - ziehe vorherige Bosse ab
const correctedBossData = computed(() => {
  const bossData = effectiveBossData.value;
  console.log('=== Boss Kill Rate Debug ===');
  console.log('Raw bossData:', bossData);
  console.log('Sample size:', bossData.sampleSize);
  
  if (!bossData.data?.length) return [];
  
  return bossData.data.map(item => {
    let correctedAttempts = item.attempts;
    
    console.log(`Processing Revive ${item.revive}:`);
    console.log(`  Original attempts: ${item.attempts}`);
    console.log(`  finalStage: ${item.finalStage}`);
    console.log(`  Sample size: ${bossData.sampleSize}`);
    
    // Boss-Korrektur basierend auf finalStage
    if (item.finalStage && correctedAttempts > bossData.sampleSize) {
      const lastBossStage = Math.floor(item.finalStage / 100) * 100;
      const bossNumber = lastBossStage / 100;
      
      console.log(`  Boss correction needed: lastBossStage=${lastBossStage}, bossNumber=${bossNumber}`);
      
      if (bossNumber > 1) {
        const extraBosse = bossNumber - 1;
        const subtractAmount = extraBosse * bossData.sampleSize;
        correctedAttempts = correctedAttempts - subtractAmount;
        
        console.log(`  Subtracting: ${extraBosse} * ${bossData.sampleSize} = ${subtractAmount}`);
        console.log(`  Result: ${item.attempts} - ${subtractAmount} = ${correctedAttempts}`);
      }
    } else {
      console.log(`  No correction needed`);
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
  animation: {
    duration: 0
  },
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
        label: (context) => {
          try {
            const revive = availableRevives.value[context.dataIndex];
            const attempts = getBossAttempts(revive);
            const effectiveSampleSize = effectiveBossData.value.sampleSize; 
            
            return [
              `Boss Kill Rate: ${context.parsed.y.toFixed(1)}%`,
              `Total Attempts: ${attempts}`,
              `Sample Size: ${effectiveSampleSize}`
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
        display: true
      }
    },
    y: {
      beginAtZero: true,
      max: 100,
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
        callback: (value) => `${value}%`
      },
      title: {
        display: true,
        text: 'Boss Kill Rate (%)',
        color: '#9ca3af',
        font: {
          size: 12
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  elements: {
    bar: {
      borderRadius: 4,
      borderSkipped: false
    }
  }
}));

// Watch for changes that should trigger chart re-render
watch([() => props.bossKillsByRevive, () => props.color, () => props.isVisible], () => {
  forceChartUpdate();
}, { deep: true });

// Cleanup beim Component Mount
onMounted(() => {
  hunterStore.cleanupOldBossKillsData();
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