/**
 * Centralized ECharts setup with tree-shaking
 * Each chart instance is completely isolated - no global registry issues
 */
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent
} from 'echarts/components'

// Register once - ECharts uses a different registration model than Chart.js
// Components are registered but don't leak state between chart instances
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  MarkLineComponent
])

// Dark theme base options shared across all charts
export const darkTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#9ca3af'
  },
  title: {
    textStyle: { color: '#e5e7eb' }
  },
  legend: {
    textStyle: { color: '#e5e7eb' }
  }
}

// Common grid styling
export const darkGrid = {
  left: 60,
  right: 20,
  top: 30,
  bottom: 40,
  containLabel: false
}

// Common axis styling
export const darkXAxis = {
  axisLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.5)' } },
  axisTick: { lineStyle: { color: 'rgba(75, 85, 99, 0.5)' } },
  axisLabel: { color: '#9ca3af', fontSize: 11 },
  splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.3)' } }
}

export const darkYAxis = {
  axisLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.5)' } },
  axisTick: { lineStyle: { color: 'rgba(75, 85, 99, 0.5)' } },
  axisLabel: { color: '#9ca3af', fontSize: 11 },
  splitLine: { lineStyle: { color: 'rgba(75, 85, 99, 0.3)' } }
}

// Common tooltip styling
export const darkTooltip = {
  backgroundColor: 'rgba(31, 41, 55, 0.95)',
  borderColor: '#6b7280',
  borderWidth: 1,
  textStyle: { color: '#e5e7eb', fontSize: 12 },
  extraCssText: 'border-radius: 8px;'
}
