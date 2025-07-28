<template>
  <div v-if="isVisible" class="chart-container">
    <!-- Chart Description -->
    <div class="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-purple-200 dark:border-gray-600">
      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <IconBulb class="inline w-4 h-4 mr-2 text-amber-500" />
        This chart shows when and where you lose your revives across different stages.
      </p>
    </div>
    <!-- Chart Container -->
    <div class="bg-gray-700/30 border border-gray-600 p-4 rounded-md">
      <div class="h-[250px] relative bg-transparent" :key="`revive-chart-container-${chartRenderKey}`">
        <!-- Bar Chart -->
        <div v-if="chartData && props.isVisible" class="w-full h-full">
          <Bar
            :data="chartData"
            :options="chartOptions"
            :key="`revive-bar-${chartRenderKey}`"
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
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { getColorRGB } from '../builds/utils/BuildComparisonUtils';
import { formatNumber } from '@/composables/format.js';
import { IconBulb } from '@tabler/icons-vue';
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

// Chart state
const chartRenderKey = ref(0);

// Force chart update function
function forceChartUpdate() {
  chartRenderKey.value += 1;
}

// Watch for changes that should trigger chart re-render
watch([() => props.deathDistribution, () => props.color, () => props.isVisible], () => {
  forceChartUpdate();
}, { deep: true });

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

// Chart data - exakt wie ProgressModal
const chartData = computed(() => {
  if (!processedData.value.stages.length) return null;
  
  // Erstelle Datasets für alle verfügbaren Revives
  const datasets = availableRevives.value.map(revive => {
    const colorRGB = reviveColors[Math.min(revive - 1, reviveColors.length - 1)];
    const borderColor = `rgba(${colorRGB}, 1)`;
    const backgroundColor = `rgba(${colorRGB}, 0.25)`; // 0.25 für transparente Füllung
    
    return {
      label: getReviveLabel(revive),
      data: processedData.value.reviveData[revive],
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 2,
      fill: false
    };
  });
  
  return {
    labels: processedData.value.stages,
    datasets: datasets
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
      display: true,
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
        title: function(context) {
          return `Stage ${context[0].label}`;
        },
        label: function(context) {
          const count = context.parsed.y;
          const datasetLabel = context.dataset.label;
          
          // Berechne Total für diese Stage
          const stageTotal = availableRevives.value.reduce((sum, revive) => {
            return sum + (processedData.value.reviveData[revive][context.dataIndex] || 0);
          }, 0);
          
          const percentage = stageTotal > 0 ? ((count / stageTotal) * 100).toFixed(1) : 0;
          return `${datasetLabel}: ${formatNumber(count)} (${percentage}%)`;
        },
        footer: function(context) {
          const index = context[0].dataIndex;
          const total = availableRevives.value.reduce((sum, revive) => {
            return sum + (processedData.value.reviveData[revive][index] || 0);
          }, 0);
          return `Total Deaths: ${formatNumber(total)}`;
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      stacked: true,
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
      stacked: true,
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
      suggestedMin: 0
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

const chartOptions = computed(() => ({
  ...darkThemeOptions,
  // Add unique ID to prevent data sharing between charts
  chartId: `revive-distribution-chart-${chartRenderKey.value}-${Date.now()}`,
  plugins: {
    ...darkThemeOptions.plugins,
    tooltip: {
      ...darkThemeOptions.plugins.tooltip,
      callbacks: {
        title: function(context) {
          return `Stage ${context[0].label}`;
        },
        label: function(context) {
          const count = context.parsed.y;
          const datasetLabel = context.dataset.label;
          
          // Berechne Total für diese Stage
          const stageTotal = availableRevives.value.reduce((sum, revive) => {
            return sum + (processedData.value.reviveData[revive][context.dataIndex] || 0);
          }, 0);
          
          const percentage = stageTotal > 0 ? ((count / stageTotal) * 100).toFixed(1) : 0;
          return `${datasetLabel}: ${formatNumber(count)} (${percentage}%)`;
        },
        footer: function(context) {
          const index = context[0].dataIndex;
          const total = availableRevives.value.reduce((sum, revive) => {
            return sum + (processedData.value.reviveData[revive][index] || 0);
          }, 0);
          return `Total Deaths: ${formatNumber(total)}`;
        }
      }
    }
  },
  scales: {
    ...darkThemeOptions.scales,
    x: {
      ...darkThemeOptions.scales.x,
      ticks: {
        ...darkThemeOptions.scales.x.ticks,
        callback: function(value, index) {
          const labels = this.chart.data.labels;
          const step = Math.ceil(labels.length / 8);
          return index % step === 0 ? labels[index] : '';
        }
      }
    },
    y: {
      ...darkThemeOptions.scales.y,
      beginAtZero: true,
      ticks: {
        ...darkThemeOptions.scales.y.ticks,
        maxTicksLimit: 8,
        stepSize: undefined,
        callback: function(value) {
          return formatNumber(value);
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
}));

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

// NEU: Debug-Tabellen-Daten
const debugTableData = computed(() => {
  if (!props.deathDistribution || !props.deathDistribution.length) {
    return [];
  }
  
  const tableData = [];
  const stageGroups = processedData.value.stageGroups;
  
  // Für jede Stage, sammle alle Revive-Daten
  Object.keys(stageGroups).forEach(stage => {
    const stageNum = parseInt(stage);
    const reviveData = stageGroups[stage];
    
    // Berechne Stage-Total
    const stageTotal = Object.values(reviveData).reduce((sum, count) => sum + count, 0);
    
    // Für jeden Revive-Typ in dieser Stage
    Object.keys(reviveData).forEach(revive => {
      const reviveNum = parseInt(revive);
      const count = reviveData[revive];
      const remaining = 3 - reviveNum; // 3 ist maxRevives
      
      if (count > 0) {
        tableData.push({
          stage: stageNum,
          revive: reviveNum,
          count: count,
          remaining: remaining,
          stagePercent: ((count / stageTotal) * 100).toFixed(1),
          totalPercent: ((count / totalDeaths.value) * 100).toFixed(1)
        });
      }
    });
  });
  
  // Sortiere nach Stage (absteigend), dann nach Revive (aufsteigend)
  return tableData.sort((a, b) => {
    if (a.stage !== b.stage) return b.stage - a.stage;
    return a.revive - b.revive;
  });
});

// Hilfsfunktionen für die Tabelle
function getRowClass(row) {
  const baseClass = 'hover:bg-gray-600/30 transition-colors';
  
  if (row.stage >= 300) return `${baseClass} bg-red-900/20`; // Boss-Stages
  if (row.revive >= 3) return `${baseClass} bg-red-800/20`; // Kritische Revives
  if (row.revive >= 2) return `${baseClass} bg-yellow-800/20`; // Warnung
  
  return baseClass;
}

function getRemainingColor(remaining) {
  if (remaining === 0) return '#ef4444'; // Rot - keine Revives
  if (remaining === 1) return '#f59e0b'; // Orange - 1 Revive
  if (remaining === 2) return '#eab308'; // Gelb - 2 Revives
  return '#22c55e'; // Grün - 3 Revives
}

// Neue Computed Properties für Boss Entry Analysis
const totalSimulations = computed(() => {
  // Annahme: 4000 Simulationen (oder aus Props)
  return 4000; // Du kannst das als Prop übergeben
});

const bossEntryData = computed(() => {
  if (!props.deathDistribution || !props.deathDistribution.length) {
    return null;
  }

  // Sammle KUMULATIV wieviele Revives VOR Stage 300 verloren gingen
  let revive1LossesBeforeBoss = 0; // Erster Revive verloren
  let revive2LossesBeforeBoss = 0; // Zweiter Revive verloren  
  let revive3LossesBeforeBoss = 0; // Dritter Revive verloren

  props.deathDistribution.forEach(death => {
    if (death.stage && death.stage.includes('_')) {
      const [stage, revive] = death.stage.split('_');
      const stageNum = parseInt(stage);
      const reviveNum = parseInt(revive);
      
      // Nur Verluste VOR dem Boss zählen
      if (stageNum < 300) {
        if (reviveNum === 1) revive1LossesBeforeBoss += death.count;
        if (reviveNum === 2) revive2LossesBeforeBoss += death.count;
        if (reviveNum === 3) revive3LossesBeforeBoss += death.count;
      }
    }
  });

  // Berechne Boss Entries basierend auf SEQUENTIELLEN Revive-Verlusten:
  
  // Mit 3 Revives: Keine Revives verloren
  const revive3Entries = totalSimulations.value - revive1LossesBeforeBoss;
  
  // Mit 2 Revives: Ersten Revive verloren, aber NICHT den zweiten
  const revive2Entries = revive1LossesBeforeBoss - revive2LossesBeforeBoss;
  
  // Mit 1 Revive: Ersten UND zweiten Revive verloren, aber NICHT den dritten
  const revive1Entries = revive2LossesBeforeBoss - revive3LossesBeforeBoss;
  
  // Mit 0 Revives: Alle drei Revives verloren
  const revive0Entries = revive3LossesBeforeBoss;

  const allEntries = [
    { revives: 3, count: revive3Entries },
    { revives: 2, count: revive2Entries },
    { revives: 1, count: revive1Entries },
    { revives: 0, count: revive0Entries }
  ].filter(entry => entry.count > 0);

  const totalBossEntries = allEntries.reduce((sum, entry) => sum + entry.count, 0);

  // Füge Prozentsätze hinzu
  allEntries.forEach(entry => {
    entry.percentage = totalBossEntries > 0 ? ((entry.count / totalBossEntries) * 100).toFixed(1) : '0.0';
  });

  return {
    entries: allEntries,
    total: totalBossEntries
  };
});

const neverReachedBoss = computed(() => {
  return totalSimulations.value - (bossEntryData.value?.total || 0);
});

const bossReachPercentage = computed(() => {
  if (!bossEntryData.value) return '0.0';
  return ((bossEntryData.value.total / totalSimulations.value) * 100).toFixed(1);
});

const bestEntry = computed(() => {
  if (!bossEntryData.value?.entries.length) return null;
  return bossEntryData.value.entries.reduce((best, current) => 
    current.count > best.count ? current : best
  );
});

const criticalEntries = computed(() => {
  if (!bossEntryData.value?.entries) return 0;
  return bossEntryData.value.entries
    .filter(entry => entry.revives <= 1)
    .reduce((sum, entry) => sum + entry.count, 0);
});

const safeEntries = computed(() => {
  if (!bossEntryData.value?.entries) return 0;
  return bossEntryData.value.entries
    .filter(entry => entry.revives >= 2)
    .reduce((sum, entry) => sum + entry.count, 0);
});

// Hilfsfunktionen
function getBossEntryRowClass(revives) {
  const baseClass = 'hover:bg-gray-600/30 transition-colors';
  
  if (revives === 0) return `${baseClass} bg-red-900/30`;
  if (revives === 1) return `${baseClass} bg-orange-900/30`;
  if (revives === 2) return `${baseClass} bg-yellow-900/30`;
  return `${baseClass} bg-green-900/30`;
}

function getStatusText(revives) {
  if (revives === 0) return 'Kritisch';
  if (revives === 1) return 'Riskant';
  if (revives === 2) return 'Gut';
  return 'Optimal';
}

function getStatusBadgeClass(revives) {
  const baseClass = 'px-2 py-1 rounded text-xs font-medium';
  
  if (revives === 0) return `${baseClass} bg-red-500/20 text-red-300 border border-red-500/30`;
  if (revives === 1) return `${baseClass} bg-orange-500/20 text-orange-300 border border-orange-500/30`;
  if (revives === 2) return `${baseClass} bg-yellow-500/20 text-yellow-300 border border-yellow-500/30`;
  return `${baseClass} bg-green-500/20 text-green-300 border border-green-500/30`;
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}

/* NEU: Tabellen-Styles */
.debug-table {
  font-family: 'Courier New', monospace;
}

.debug-table th {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
}

.debug-table tbody tr:nth-child(even) {
  background: rgba(75, 85, 99, 0.1);
}

@media (max-width: 768px) {
  .debug-table {
    font-size: 0.75rem;
  }
  
  .debug-table th,
  .debug-table td {
    padding: 0.25rem 0.5rem;
  }
}
</style>