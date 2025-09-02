<!-- Performance Monitoring für Tailwind CSS Optimierungen -->
<template>
  <div class="p-6 bg-gray-900 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <IconDashboard class="text-blue-400" />
        Tailwind CSS Performance Monitor
      </h1>
      
      <!-- CSS Bundle Size Analysis -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="
          bg-gray-800 rounded-xl p-6 
          border border-gray-700
          hover:border-gray-600 transition-colors
        ">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <IconFileCode class="text-green-400" />
            CSS Bundle Analysis
          </h2>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Total CSS Size</span>
              <span class="text-white font-mono">{{ formatBytes(cssStats.totalSize) }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Tailwind Classes Used</span>
              <span class="text-white font-mono">{{ cssStats.classesUsed }}</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Purge Efficiency</span>
              <span 
                class="font-mono"
                :class="cssStats.purgeEfficiency > 90 ? 'text-green-400' : 'text-yellow-400'"
              >
                {{ cssStats.purgeEfficiency }}%
              </span>
            </div>
            
            <!-- Optimization Suggestions -->
            <div 
              v-if="cssStats.suggestions.length > 0"
              class="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg"
            >
              <h3 class="text-yellow-400 font-medium mb-2">Optimization Opportunities:</h3>
              <ul class="text-sm text-yellow-200 space-y-1">
                <li v-for="suggestion in cssStats.suggestions" :key="suggestion">
                  • {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Runtime Performance -->
        <div class="
          bg-gray-800 rounded-xl p-6 
          border border-gray-700
          hover:border-gray-600 transition-colors
        ">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <IconActivity class="text-purple-400" />
            Runtime Performance
          </h2>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Paint Time</span>
              <span 
                class="font-mono"
                :class="performanceStats.paintTime < 16 ? 'text-green-400' : 'text-red-400'"
              >
                {{ performanceStats.paintTime }}ms
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-300">Layout Shifts</span>
              <span 
                class="font-mono"
                :class="performanceStats.layoutShifts === 0 ? 'text-green-400' : 'text-yellow-400'"
              >
                {{ performanceStats.layoutShifts }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray-300">CSS Recalcs</span>
              <span class="text-white font-mono">{{ performanceStats.recalcs }}</span>
            </div>
            
            <!-- Performance Score -->
            <div class="mt-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-300">Performance Score</span>
                <span 
                  class="font-bold"
                  :class="getScoreColor(performanceStats.score)"
                >
                  {{ performanceStats.score }}/100
                </span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :class="getScoreBarColor(performanceStats.score)"
                  :style="{ width: `${performanceStats.score}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Container Query Support Check -->
      <div class="
        bg-gray-800 rounded-xl p-6 mb-6
        border border-gray-700
      ">
        <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <IconDeviceDesktop class="text-blue-400" />
          Modern CSS Feature Support
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            v-for="feature in cssFeatures" 
            :key="feature.name"
            class="
              p-3 rounded-lg border
              transition-colors
            "
            :class="[
              feature.supported 
                ? 'bg-green-900/30 border-green-700/50' 
                : 'bg-red-900/30 border-red-700/50'
            ]"
          >
            <div class="flex items-center gap-2 mb-2">
              <IconCheck v-if="feature.supported" class="text-green-400 w-4 h-4" />
              <IconX v-else class="text-red-400 w-4 h-4" />
              <span class="text-white font-medium text-sm">{{ feature.name }}</span>
            </div>
            <p class="text-xs text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Real-time Class Usage Monitor -->
      <div class="
        bg-gray-800 rounded-xl p-6
        border border-gray-700
      ">
        <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <IconEye class="text-indigo-400" />
          Live Class Usage Monitor
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Most Used Classes -->
          <div>
            <h3 class="text-white font-medium mb-3">Most Used Classes</h3>
            <div class="space-y-2">
              <div 
                v-for="(usage, className) in sortedClassUsage.slice(0, 10)" 
                :key="className"
                class="flex justify-between items-center p-2 bg-gray-700/50 rounded"
              >
                <code class="text-blue-300 text-sm">{{ className }}</code>
                <span class="text-gray-300 text-sm">{{ usage }} uses</span>
              </div>
            </div>
          </div>
          
          <!-- Unused Custom Classes -->
          <div>
            <h3 class="text-white font-medium mb-3">Potential Cleanup</h3>
            <div class="space-y-2">
              <div 
                v-for="unusedClass in unusedClasses.slice(0, 10)"
                :key="unusedClass"
                class="p-2 bg-yellow-900/20 border border-yellow-700/30 rounded"
              >
                <code class="text-yellow-300 text-sm">{{ unusedClass }}</code>
                <p class="text-xs text-yellow-200/70 mt-1">Not detected in DOM</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-3 mt-6">
          <button 
            @click="refreshAnalysis"
            class="
              px-4 py-2 bg-blue-600 hover:bg-blue-700
              text-white rounded-lg font-medium
              transition-colors duration-200
              flex items-center gap-2
            "
          >
            <IconRefresh class="w-4 h-4" />
            Refresh Analysis
          </button>
          
          <button 
            @click="exportReport"
            class="
              px-4 py-2 bg-gray-600 hover:bg-gray-700
              text-white rounded-lg font-medium
              transition-colors duration-200
              flex items-center gap-2
            "
          >
            <IconDownload class="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  IconDashboard, IconFileCode, IconActivity, IconDeviceDesktop,
  IconCheck, IconX, IconEye, IconRefresh, IconDownload
} from '@tabler/icons-vue'

// Reactive data
const cssStats = ref({
  totalSize: 234567, // bytes
  classesUsed: 1247,
  purgeEfficiency: 94.2,
  suggestions: [
    'Consider using container queries for responsive components',
    'Migrate custom CSS to Tailwind utilities',
    'Use @theme directive for better variable management'
  ]
})

const performanceStats = ref({
  paintTime: 12.4,
  layoutShifts: 0,
  recalcs: 23,
  score: 96
})

const classUsage = ref({
  'flex': 156,
  'text-white': 134,
  'bg-gray-800': 89,
  'rounded-lg': 78,
  'p-4': 67,
  'mb-4': 56,
  'gap-2': 45,
  'hover:bg-gray-700': 34,
  'transition-colors': 23,
  'border': 19
})

const unusedClasses = ref([
  'custom-gradient-old',
  'legacy-button-style',
  'deprecated-modal-backdrop',
  'old-card-shadow',
  'unused-animation-class'
])

// CSS Feature Support Detection
const cssFeatures = ref([
  {
    name: 'Container Queries',
    description: '@container size queries',
    supported: CSS.supports('container-type', 'inline-size')
  },
  {
    name: 'CSS Layers',
    description: '@layer cascade control',
    supported: CSS.supports('@supports', '(container-type: inline-size)')
  },
  {
    name: 'CSS Nesting',
    description: 'Native CSS nesting',
    supported: CSS.supports('selector(&)', '&')
  },
  {
    name: 'CSS Variables',
    description: 'Custom properties',
    supported: CSS.supports('color', 'var(--test)')
  }
])

// Computed properties
const sortedClassUsage = computed(() => {
  return Object.entries(classUsage.value)
    .sort(([,a], [,b]) => b - a)
    .map(([className, usage]) => ({ className, usage }))
})

// Helper functions
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getScoreColor(score) {
  if (score >= 90) return 'text-green-400'
  if (score >= 70) return 'text-yellow-400'
  return 'text-red-400'
}

function getScoreBarColor(score) {
  if (score >= 90) return 'bg-green-500'
  if (score >= 70) return 'bg-yellow-500'
  return 'bg-red-500'
}

// Actions
function refreshAnalysis() {
  console.log('Refreshing CSS analysis...')
  // Hier würden Sie echte Analyse-Logik implementieren
}

function exportReport() {
  const report = {
    cssStats: cssStats.value,
    performanceStats: performanceStats.value,
    classUsage: classUsage.value,
    unusedClasses: unusedClasses.value,
    timestamp: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: 'application/json'
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tailwind-performance-report-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  // Hier würden Sie echte Performance-Metriken sammeln
  console.log('Performance monitoring initialized')
})
</script>
