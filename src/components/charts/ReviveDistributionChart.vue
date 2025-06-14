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

    <!-- NEU: Debug-Tabelle -->
    <div class="bg-gray-700/30 border border-gray-600 p-4 rounded-md">
      <h3 class="text-white font-semibold mb-4">🔍 Debug: Revive-Verluste nach Stage</h3>
      
      <div v-if="debugTableData.length > 0" class="overflow-x-auto">
        <table class="w-full text-sm text-white border-collapse">
          <thead>
            <tr class="bg-gray-600">
              <th class="border border-gray-500 px-3 py-2 text-left">Stage</th>
              <th class="border border-gray-500 px-3 py-2 text-center">Revive #</th>
              <th class="border border-gray-500 px-3 py-2 text-right">Anzahl</th>
              <th class="border border-gray-500 px-3 py-2 text-center">Verbleibende</th>
              <th class="border border-gray-500 px-3 py-2 text-right">% von Stage</th>
              <th class="border border-gray-500 px-3 py-2 text-right">% von Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in debugTableData" :key="`${row.stage}_${row.revive}`" 
                :class="getRowClass(row)">
              <td class="border border-gray-500 px-3 py-2 font-medium">{{ row.stage }}</td>
              <td class="border border-gray-500 px-3 py-2 text-center font-medium" 
                  :style="{ color: getReviveColor(row.revive) }">
                {{ row.revive }}
              </td>
              <td class="border border-gray-500 px-3 py-2 text-right font-mono">
                {{ row.count.toLocaleString() }}
              </td>
              <td class="border border-gray-500 px-3 py-2 text-center font-medium"
                  :style="{ color: getRemainingColor(row.remaining) }">
                {{ row.remaining }}
              </td>
              <td class="border border-gray-500 px-3 py-2 text-right font-mono">
                {{ row.stagePercent }}%
              </td>
              <td class="border border-gray-500 px-3 py-2 text-right font-mono">
                {{ row.totalPercent }}%
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-600 font-bold">
              <td class="border border-gray-500 px-3 py-2" colspan="2">TOTAL</td>
              <td class="border border-gray-500 px-3 py-2 text-right">
                {{ totalDeaths.toLocaleString() }}
              </td>
              <td class="border border-gray-500 px-3 py-2" colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div v-else class="text-gray-400 text-center py-8">
        Keine Revive-Daten verfügbar
      </div>

      <!-- Summary Statistics -->
      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="revive in availableRevives" :key="revive" 
             class="bg-gray-600/50 p-3 rounded border">
          <div class="text-xs text-gray-300">{{ getReviveLabel(revive) }}</div>
          <div class="text-lg font-bold" :style="{ color: getReviveColor(revive) }">
            {{ getReviveTotal(revive).toLocaleString() }}
          </div>
          <div class="text-xs text-gray-400">
            {{ getRevivePercentage(revive) }}% vom Total
          </div>
        </div>
      </div>
    </div>

    <!-- NEU: Boss-Entry-Analysis Tabelle -->
    <div class="bg-gray-700/30 border border-gray-600 p-4 rounded-md">
      <h3 class="text-white font-semibold mb-4">⚔️ Boss Entry Analysis - Stage 300</h3>
      
      <div v-if="bossEntryData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Tabelle -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-white border-collapse">
            <thead>
              <tr class="bg-gray-600">
                <th class="border border-gray-500 px-4 py-3 text-center">Verbleibende Revives</th>
                <th class="border border-gray-500 px-4 py-3 text-right">Boss Entries</th>
                <th class="border border-gray-500 px-4 py-3 text-right">% von Total</th>
                <th class="border border-gray-500 px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in bossEntryData.entries" :key="entry.revives"
                  :class="getBossEntryRowClass(entry.revives)">
                <td class="border border-gray-500 px-4 py-3 text-center font-bold text-lg"
                    :style="{ color: getRemainingColor(entry.revives) }">
                  {{ entry.revives }}
                </td>
                <td class="border border-gray-500 px-4 py-3 text-right font-mono text-lg">
                  {{ entry.count.toLocaleString() }}
                </td>
                <td class="border border-gray-500 px-4 py-3 text-right font-mono">
                  {{ entry.percentage }}%
                </td>
                <td class="border border-gray-500 px-4 py-3 text-center">
                  <span :class="getStatusBadgeClass(entry.revives)">
                    {{ getStatusText(entry.revives) }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-gray-600 font-bold">
                <td class="border border-gray-500 px-4 py-3">TOTAL</td>
                <td class="border border-gray-500 px-4 py-3 text-right">
                  {{ bossEntryData.total.toLocaleString() }}
                </td>
                <td class="border border-gray-500 px-4 py-3 text-right">100.0%</td>
                <td class="border border-gray-500 px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Statistiken -->
        <div class="space-y-4">
          <div class="bg-gray-600/50 p-4 rounded border">
            <h4 class="text-white font-medium mb-3">📊 Zusammenfassung</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-300">Total Simulationen:</span>
                <span class="text-white font-mono">{{ totalSimulations.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Boss erreicht:</span>
                <span class="text-white font-mono">{{ bossEntryData.total.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Boss erreicht (%):</span>
                <span class="text-white font-mono">{{ bossReachPercentage }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Nie Boss erreicht:</span>
                <span class="text-white font-mono">{{ neverReachedBoss.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-600/50 p-4 rounded border">
            <h4 class="text-white font-medium mb-3">🎯 Beste Performance</h4>
            <div v-if="bestEntry" class="text-center">
              <div class="text-3xl font-bold mb-2" :style="{ color: getRemainingColor(bestEntry.revives) }">
                {{ bestEntry.revives }} Revives
              </div>
              <div class="text-white">
                {{ bestEntry.count.toLocaleString() }} mal erreicht
              </div>
              <div class="text-gray-300 text-sm">
                ({{ bestEntry.percentage }}% der Boss-Encounters)
              </div>
            </div>
          </div>

          <div class="bg-gray-600/50 p-4 rounded border">
            <h4 class="text-white font-medium mb-3">⚠️ Risiko-Assessment</h4>
            <div class="space-y-2 text-sm">
              <div v-if="criticalEntries > 0" class="text-red-400">
                <strong>{{ criticalEntries.toLocaleString() }}</strong> kritische Entries (≤1 Revive)
              </div>
              <div v-if="safeEntries > 0" class="text-green-400">
                <strong>{{ safeEntries.toLocaleString() }}</strong> sichere Entries (≥2 Revives)
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-gray-400 text-center py-8">
        Keine Boss-Entry-Daten verfügbar
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