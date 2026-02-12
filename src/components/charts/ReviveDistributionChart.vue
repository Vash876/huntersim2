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
      <div class="h-[250px] relative bg-transparent">
        <v-chart 
          v-if="hasData && props.isVisible" 
          :option="chartOption" 
          autoresize 
          class="w-full h-full"
        />
        <!-- Loading overlay -->
        <div 
          v-if="!hasData || !props.isVisible"
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
import { computed } from 'vue';
import VChart from 'vue-echarts';
import '@/utils/echarts';
import { formatNumber } from '@/composables/format.js';
import { IconBulb } from '@tabler/icons-vue';
import { darkTooltip, darkXAxis, darkYAxis, darkGrid } from '@/utils/echarts';

const props = defineProps({
  deathDistribution: { type: Array, required: true },
  sampleSize: { type: Number, default: 1000 },
  color: { type: String, default: 'blue' },
  isVisible: { type: Boolean, default: true }
});

// Revive colors (RGB strings)
const reviveColors = [
  'rgba(34, 197, 94',   // Grün - Revive 1
  'rgba(251, 191, 36',  // Gelb - Revive 2
  'rgba(239, 68, 68',   // Rot - Revive 3
  'rgba(147, 51, 234',  // Lila - Revive 4
  'rgba(59, 130, 246',  // Blau - Revive 5
  'rgba(16, 185, 129',  // Teal - Revive 6+
];

const hasData = computed(() => props.deathDistribution && props.deathDistribution.length > 0);

// Process death distribution data
const processedData = computed(() => {
  if (!hasData.value) return { stages: [], reviveData: {}, availableRevives: [] };
  
  const stageGroups = {};
  const reviveTypes = new Set();
  
  props.deathDistribution.forEach(item => {
    const parts = item.stage.toString().split('_');
    if (parts.length === 2) {
      const stage = parseInt(parts[0]);
      const reviveNum = parseInt(parts[1]);
      reviveTypes.add(reviveNum);
      if (!stageGroups[stage]) stageGroups[stage] = {};
      stageGroups[stage][reviveNum] = item.count;
    }
  });
  
  const availableRevives = Array.from(reviveTypes).sort((a, b) => a - b);
  const sortedStages = Object.keys(stageGroups).map(Number).sort((a, b) => a - b);
  
  const stages = [];
  const reviveData = {};
  availableRevives.forEach(r => { reviveData[r] = []; });
  
  sortedStages.forEach(stage => {
    stages.push(stage);
    availableRevives.forEach(revive => {
      reviveData[revive].push(stageGroups[stage][revive] || 0);
    });
  });
  
  return { stages, reviveData, availableRevives };
});

function getReviveLabel(revive) {
  if (revive === 1) return 'First Revive';
  if (revive === 2) return 'Second Revive';
  if (revive === 3) return 'Third Revive';
  return `${revive}th Revive`;
}

const chartOption = computed(() => {
  if (!hasData.value) return {};
  
  const { stages, reviveData, availableRevives } = processedData.value;
  
  const series = availableRevives.map((revive, idx) => {
    const colorBase = reviveColors[Math.min(idx, reviveColors.length - 1)];
    // Extract RGB values for 3D effect
    const rgbMatch = colorBase.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    const r = rgbMatch ? parseInt(rgbMatch[1]) : 128;
    const g = rgbMatch ? parseInt(rgbMatch[2]) : 128;
    const b = rgbMatch ? parseInt(rgbMatch[3]) : 128;
    const highlightColor = `rgba(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)}, 0.8)`;
    return {
      name: getReviveLabel(revive),
      type: 'bar',
      stack: 'revives',
      data: reviveData[revive],
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
          colorStops: [
            { offset: 0, color: highlightColor },
            { offset: 0.3, color: `rgba(${r}, ${g}, ${b}, 0.6)` },
            { offset: 1, color: `rgba(${r}, ${g}, ${b}, 0.2)` }
          ]
        },
        borderColor: `${colorBase}, 1)`,
        borderWidth: 1,
        borderRadius: idx === availableRevives.length - 1 ? [3, 3, 0, 0] : 0,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowBlur: 6,
        shadowOffsetX: 2,
        shadowOffsetY: 2
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
            colorStops: [
              { offset: 0, color: `rgba(${Math.min(r + 80, 255)}, ${Math.min(g + 80, 255)}, ${Math.min(b + 80, 255)}, 0.95)` },
              { offset: 0.3, color: `rgba(${r}, ${g}, ${b}, 0.8)` },
              { offset: 1, color: `rgba(${r}, ${g}, ${b}, 0.4)` }
            ]
          },
          shadowBlur: 10,
          shadowOffsetX: 3,
          shadowOffsetY: 3
        }
      },
      barMaxWidth: 30
    };
  });
  
  return {
    backgroundColor: 'transparent',
    animation: false,
    grid: darkGrid,
    legend: {
      show: true,
      top: 0,
      textStyle: { color: '#e5e7eb', fontSize: 12 },
      itemWidth: 14,
      itemHeight: 14
    },
    tooltip: {
      ...darkTooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const stage = params[0].name;
        let html = `<strong>Stage ${stage}</strong>`;
        let total = 0;
        params.forEach(p => { total += p.value; });
        params.forEach(p => {
          const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : 0;
          html += `<br/>${p.marker} ${p.seriesName}: ${formatNumber(p.value)} (${pct}%)`;
        });
        html += `<br/><br/>Total Deaths: ${formatNumber(total)}`;
        return html;
      }
    },
    xAxis: {
      type: 'category',
      data: stages.map(String),
      ...darkXAxis,
      axisLabel: {
        ...darkXAxis.axisLabel,
        interval: Math.max(0, Math.ceil(stages.length / 8) - 1)
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      ...darkYAxis,
      axisLabel: {
        ...darkYAxis.axisLabel,
        formatter: (v) => formatNumber(v)
      }
    },
    series
  };
});
</script>