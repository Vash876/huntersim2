<template>
  <div class="flex flex-col gap-4">
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
import { computed } from 'vue';
import VChart from 'vue-echarts';
import '@/utils/echarts';
import { getColorRGB } from '../builds/utils/BuildComparisonUtils';
import { formatNumber } from '@/composables/format.js';
import { darkTooltip, darkXAxis, darkYAxis, darkGrid } from '@/utils/echarts';

const props = defineProps({
  distribution: { type: Array, required: true },
  avgStage: { type: Number, default: 0 },
  maxStage: { type: Number, default: null },
  minStage: { type: Number, default: null },
  sampleSize: { type: Number, default: 1000 },
  color: { type: String, default: 'gray' },
  isVisible: { type: Boolean, default: true }
});

const hasData = computed(() => props.distribution && props.distribution.length > 0);

const computedMinStage = computed(() => {
  if (props.minStage !== null) return props.minStage;
  if (!hasData.value) return null;
  return props.distribution.reduce((min, item) => {
    return item.count > 0 && item.stage < min ? item.stage : min;
  }, Infinity);
});

const chartOption = computed(() => {
  if (!hasData.value) return {};
  
  const stages = [];
  const frequencies = [];
  const totalCount = props.distribution.reduce((sum, item) => sum + item.count, 0);
  
  props.distribution.forEach(item => {
    if (item.stage !== undefined && item.count !== undefined && typeof item.count === 'number') {
      stages.push(String(item.stage));
      frequencies.push(Number(item.count));
    }
  });
  
  const colorRGB = getColorRGB(props.color);
  const borderColor = `rgba(${colorRGB}, 1)`;
  const [r, g, b] = colorRGB.split(',').map(s => parseInt(s.trim()));
  const highlightColor = `rgba(${Math.min(r + 60, 255)}, ${Math.min(g + 60, 255)}, ${Math.min(b + 60, 255)}, 0.8)`;
  
  const series = [
    {
      type: 'bar',
      data: frequencies,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 1,
          colorStops: [
            { offset: 0, color: highlightColor },
            { offset: 0.3, color: `rgba(${colorRGB}, 0.6)` },
            { offset: 1, color: `rgba(${colorRGB}, 0.2)` }
          ]
        },
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: [3, 3, 0, 0],
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
              { offset: 0.3, color: `rgba(${colorRGB}, 0.8)` },
              { offset: 1, color: `rgba(${colorRGB}, 0.4)` }
            ]
          },
          shadowBlur: 10,
          shadowOffsetX: 3,
          shadowOffsetY: 3
        }
      },
      barMaxWidth: 30
    }
  ];
  
  return {
    backgroundColor: 'transparent',
    animation: false,
    grid: darkGrid,
    tooltip: {
      ...darkTooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const p = params[0];
        const count = p.value;
        const percentage = ((count / totalCount) * 100).toFixed(1);
        return `<strong>Stage ${p.name}</strong><br/>Count: ${formatNumber(count)} (${percentage}%)`;
      }
    },
    xAxis: {
      type: 'category',
      data: stages,
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
    series: series
  };
});

function formatStage(stage) {
  if (stage === undefined || stage === null) return 'N/A';
  if (stage === Infinity) return 'N/A';
  return stage % 1 === 0 ? stage.toString() : stage.toFixed(1);
}
</script>