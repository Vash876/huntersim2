<template>
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
</template>

<script setup>
import { computed } from 'vue';
import VChart from 'vue-echarts';
import '@/utils/echarts';
import { getColorRGB } from '../builds/utils/BuildComparisonUtils';
import { darkTooltip, darkXAxis, darkYAxis, darkGrid } from '@/utils/echarts';

const props = defineProps({
  distribution: { type: Array, required: true },
  avgStage: { type: Number, default: 0 },
  sampleSize: { type: Number, default: 1000 },
  color: { type: String, default: 'gray' },
  isVisible: { type: Boolean, default: true }
});

const hasData = computed(() => props.distribution && props.distribution.length > 0);

const chartOption = computed(() => {
  if (!hasData.value) return {};
  
  const stageMap = new Map();
  const totalCount = props.distribution.reduce((sum, item) => sum + item.count, 0);
  
  props.distribution.forEach(item => {
    if (item.stage !== undefined && item.count !== undefined && typeof item.count === 'number') {
      stageMap.set(item.stage, Number(item.count));
    }
  });
  
  // Build 0.5-step stages
  const intStages = [...stageMap.keys()].sort((a, b) => a - b);
  if (intStages.length === 0) return {};
  
  const minStage = intStages[0];
  const maxStage = intStages[intStages.length - 1];
  
  const stages = [];
  const atLeastData = [];
  
  for (let s = minStage; s <= maxStage; s += 0.5) {
    const label = s % 1 === 0 ? String(s) : s.toFixed(1);
    stages.push(label);
    
    // Sum all counts for stages >= s (round up to next integer for .5 stages)
    const threshold = Math.ceil(s);
    let remaining = 0;
    for (const [stage, count] of stageMap) {
      if (stage >= threshold) remaining += count;
    }
    // For .5 values, interpolate between the two integer stages
    if (s % 1 !== 0) {
      const lowerStage = Math.floor(s);
      const upperStage = Math.ceil(s);
      const lowerRemaining = [...stageMap.entries()].filter(([st]) => st >= lowerStage).reduce((sum, [, c]) => sum + c, 0);
      const upperRemaining = [...stageMap.entries()].filter(([st]) => st >= upperStage).reduce((sum, [, c]) => sum + c, 0);
      remaining = (lowerRemaining + upperRemaining) / 2;
    }
    atLeastData.push((remaining / totalCount) * 100);
  }
  
  const colorRGB = getColorRGB(props.color);
  const borderColor = `rgba(${colorRGB}, 1)`;
  
  return {
    backgroundColor: 'transparent',
    animation: false,
    grid: { ...darkGrid, right: 40 },
    tooltip: {
      ...darkTooltip,
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params) => {
        const p = params[0];
        return `<strong>Stage ${p.name}</strong><br/>Chance to reach: ${p.value.toFixed(1)}%`;
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
      max: 100,
      ...darkYAxis,
      axisLabel: {
        ...darkYAxis.axisLabel,
        formatter: (v) => `${v}%`
      }
    },
    series: [{
      type: 'line',
      data: atLeastData,
      smooth: 0.3,
      lineStyle: { color: borderColor, width: 2 },
      itemStyle: { color: borderColor },
      areaStyle: { 
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `rgba(${colorRGB}, 0.3)` },
            { offset: 1, color: `rgba(${colorRGB}, 0.02)` }
          ]
        }
      },
      showSymbol: false,
      markLine: {
        silent: true,
        symbol: ['none', 'none'],
        animation: false,
        data: [
          { 
            yAxis: 50, 
            lineStyle: { color: '#facc15', type: 'dashed', width: 1 },
            label: { formatter: '50%', color: '#facc15', fontSize: 10, position: 'end' }
          },
          { 
            yAxis: 90, 
            lineStyle: { color: '#86efac', type: 'dashed', width: 1 },
            label: { formatter: '90%', color: '#86efac', fontSize: 10, position: 'end' }
          },
          { 
            yAxis: 10, 
            lineStyle: { color: '#fca5a5', type: 'dashed', width: 1 },
            label: { formatter: '10%', color: '#fca5a5', fontSize: 10, position: 'end' }
          }
        ]
      }
    }]
  };
});
</script>
