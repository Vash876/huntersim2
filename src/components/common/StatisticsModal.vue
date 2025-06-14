<template>
  <Teleport to="body">
    <div v-if="show" 
        class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-start justify-center"
        @click.self="$emit('close')">
      <div 
        class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in border border-gray-700 mt-20"
        @click.stop
      >
        <!-- Header mit Schließ-Button -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center sticky top-0 z-10">
          <h2 class="text-xl font-bold text-white flex items-center">
            <IconChartBar size="20" class="mr-2" :class="`text-${color}-400`" />
            {{ title || `Build Statistics: ${buildName}` }}
          </h2>
          <button 
            @click="$emit('close')" 
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            <IconX size="18" class="text-white" />
          </button>
        </div>
        
        <!-- Tab Navigation -->
        <div class="bg-gray-750 border-b border-gray-600 sticky top-[73px] z-10">
          <div class="flex overflow-x-auto py-2 px-4">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-2 rounded-md text-sm font-medium mr-2 transition-colors"
              :class="activeTab === tab.id ? 
                `bg-${color}-600 text-white` : 
                'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'"
            >
              <component :is="tab.icon" size="16" class="inline-block mr-1.5" />
              {{ tab.label }}
            </button>
          </div>
        </div>
        
        <!-- Modal-Inhalt -->
        <div class="content-container" style="min-height: 400px; max-height: 70vh; overflow-y: auto;">
          <div class="p-5">
            <!-- Stage Distribution Tab -->
            <div v-if="activeTab === 'distribution'">
              <StageDistributionChart 
                v-if="distribution"
                :distribution="distribution"
                :avg-stage="avgStage"
                :max-stage="maxStage"
                :min-stage="minStage"
                :sample-size="sampleSize"   
                :color="color"
                :is-visible="activeTab === 'distribution'"
              />
              <div v-else class="flex items-center justify-center h-[300px] text-gray-400">
                No data available. Please evaluate the build again.
              </div>
            </div>

            <!-- Revive Distribution Tab -->
            <div v-if="activeTab === 'revive'">
              <ReviveDistributionChart 
                v-if="deathDistribution && deathDistribution.length > 0"
                :death-distribution="deathDistribution"
                :sample-size="sampleSize"   
                :color="color"
                :is-visible="activeTab === 'revive'"
              />
              <div v-else class="flex items-center justify-center h-[300px] text-gray-400">
                <div class="text-center">
                  <IconHeart size="48" class="mx-auto mb-4 text-gray-500" />
                  <p class="text-lg font-medium mb-2">No Death Data</p>
                  <p class="text-sm">This build had no deaths during evaluation, or death tracking is not available.</p>
                </div>
              </div>
            </div>

            <!-- Boss Analysis Tab -->
            <div v-if="activeTab === 'boss'">
              <BossKillByReviveChart 
                v-if="bossKillsByRevive && bossKillsByRevive.length > 0"
                :boss-kills-by-revive="bossKillsByRevive"
                :sample-size="sampleSize"   
                :color="color"
                :is-visible="activeTab === 'boss'"
              />
              <div v-else class="flex items-center justify-center h-[300px] text-gray-400">
                <div class="text-center">
                  <IconTrophy size="48" class="mx-auto mb-4 text-gray-500" />
                  <p class="text-lg font-medium mb-2">No Boss Kill Data</p>
                  <p class="text-sm">Boss analysis requires boss kill tracking data.</p>
                </div>
              </div>
            </div>
            
            <!-- Build Stats Tab -->
            <div v-if="activeTab === 'stats'">
              <div v-if="buildStats && buildStats.length > 0" class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="(stat, index) in buildStats" 
                  :key="index"
                  class="bg-gray-750 rounded-lg p-3 border border-gray-700"
                >
                  <div class="text-xs text-gray-400">{{ stat.label }}</div>
                  <div class="text-lg font-semibold text-white mt-1 flex items-baseline">
                    {{ formatStatValue(stat) }}
                    <span v-if="stat.unit" class="text-sm text-gray-300 ml-1">{{ stat.unit }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center justify-center h-[300px] text-gray-400">
                No build statistics available.
              </div>
            </div>
            
            <!-- Leerer Zustand wenn keine Daten vorhanden -->
            <div v-if="(activeTab === 'distribution' && !distribution) || (activeTab === 'stats' && (!buildStats || buildStats.length === 0))" 
                class="text-center py-8 text-gray-400">
              No data available. Please evaluate the build again.
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IconChartBar, IconX, IconGraph, IconRuler, IconHeart, IconTrophy } from '@tabler/icons-vue';
import StageDistributionChart from '@/components/charts/StageDistributionChart.vue';
import ReviveDistributionChart from '@/components/charts/ReviveDistributionChart.vue';
import BossKillByReviveChart from '@/components/charts/BossKillByReviveChart.vue';

// Verfügbare Tabs
const tabs = computed(() => {
  const baseTabs = [
    { id: 'distribution', label: 'Stage Distribution', icon: IconGraph },
    { id: 'revive', label: 'Revive Distribution', icon: IconHeart }
  ];
  
  // Boss Analysis nur wenn echte Boss-Kill-Daten vorhanden
  if (props.bossKillsByRevive && props.bossKillsByRevive.length > 0) {
    baseTabs.push({ id: 'boss', label: 'Boss Analysis', icon: IconTrophy });
  }
  
  baseTabs.push({ id: 'stats', label: 'Build Stats', icon: IconRuler });
  
  return baseTabs;
});

// Aktiver Tab
const activeTab = ref('distribution');

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  buildName: {
    type: String,
    default: 'Build'
  },
  title: {
    type: String,
    default: ''
  },
  // Distribution props
  distribution: {
    type: Object,
    default: null
  },
  avgStage: {
    type: Number,
    default: 0
  },
  maxStage: {
    type: Number,
    default: 0
  },
  minStage: {
    type: Number,
    default: 0
  },
  sampleSize: {
    type: Number,
    default: 0
  },
  deathDistribution: {
    type: Array,
    default: () => []
  },
  bossKillsByRevive: {
    type: Array,
    default: () => []
  },
  buildStats: {
    type: Array,
    default: () => []
  },
  color: {
    type: String,
    default: 'blue'
  }
});

defineEmits(['close']);

// Formatierungsfunktion für verschiedene Stattypen
function formatStatValue(stat) {
  if (!stat) return '0';
  
  let value = stat.value;
  
  // Multiplikator für Prozentwerte
  if (stat.multiplier) {
    value *= stat.multiplier;
  }
  
  // Runden auf die angegebene Dezimalstellen
  if (stat.roundDigits !== undefined) {
    return value.toFixed(stat.roundDigits);
  }
  
  // Standardformatierung
  return typeof value === 'number' ? value.toLocaleString('en-US') : value;
}
</script>

<style scoped>
/* Scrollbar styling */
.content-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

/* For Chrome */
.content-container::-webkit-scrollbar {
  width: 8px;
}

.content-container::-webkit-scrollbar-track {
  background: transparent;
}

.content-container::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
  border: 2px solid transparent;
}
</style>