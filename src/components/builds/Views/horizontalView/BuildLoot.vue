<!-- filepath: c:\Users\igorn\projects\huntersim2\src\components\verticalView\BuildLoot.vue -->
<template>
  <div class="p-3">
    <!-- Loading-Zustand -->
    <div v-if="isLoading" class="flex items-center gap-2">
      <div class="w-full max-w-xs flex-grow">
        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-100"
            :class="`bg-${hunterColor}-500`"
            :style="`width: ${progressPercent}%;`">
          </div>
        </div>
      </div>
      <div class="text-xs text-gray-400">
        {{ progressIteration }} / {{ totalIterations }}
      </div>
    </div>
    
    <!-- Fehler-Zustand -->
    <div v-else-if="hasError" class="flex items-center justify-between">
      <div class="flex items-center text-red-400 text-sm">
        <IconAlertCircle size="16" class="mr-1.5" />
        <span>Evaluation error</span>
      </div>
      <button 
        @click="emit('reevaluate')"
        class="text-sm text-gray-300 hover:text-white underline"
      >
        Try again
      </button>
    </div>
    
    <!-- Ergebnisse -->
    <div v-else-if="results" class="flex flex-col space-y-3">
      <!-- Stats Row -->
      <div class="w-full grid gap-1.5" style="grid-template-columns: 7% 9% 9.2% 1px 13.6% 13.6% 13.6% 13.6% 1px auto;">
        <!-- Loot Score -->
        <div class="stat-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
            <div class="flex items-center">
              <IconReportMoney :size="14" class="text-amber-400 mr-1" />
              <div class="text-xs text-gray-400">{{ resultLabels.lootPerMin || 'Loot/Min' }}</div>
            </div>
          </div>
          
          <!-- Wert zentriert -->
          <div class="flex justify-center items-center">
            <span class="text-white font-medium text-center">{{ formatNumber(results.lootPerMin) }}</span>
          </div>
          
          <!-- Prozentuale Abweichung zum Referenz-Build -->
          <div 
            v-if="!isReferenceBuild && referenceResults?.lootPerMin"
            class="flex items-center justify-center mt-1 w-full"
          >
            <div :class="getDiffClasses(results.lootPerMin, referenceResults.lootPerMin, true, true)" class="whitespace-nowrap inline-flex items-center">
              <component :is="getDiffIcon(results.lootPerMin, referenceResults.lootPerMin)" size="11" class="mr-0.5 flex-shrink-0" />
              <span>{{ getDiffText(results.lootPerMin, referenceResults.lootPerMin) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Avg Stage -->
        <div class="stat-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
            <div class="flex items-center">
              <IconStairs :size="14" :class="`text-${hunterColor}-400 mr-1`" />
              <div class="text-xs text-gray-400">{{ resultLabels.avgStage || 'Avg Stage' }} (Range)</div>
            </div>
          </div>
          
          <!-- Wert und Range zentriert -->
          <div class="flex justify-center items-center">
            <span class="text-white font-medium text-center">{{ formatStage(results.avgStage, true) }}</span>
            <span class="text-xs text-gray-400 ml-1">
              ({{ formatStage(results.minStage) }}-{{ formatStage(results.maxStage) }})
            </span>
          </div>
          
          <!-- Prozentuale Abweichung zum Referenz-Build -->
          <div 
            v-if="!isReferenceBuild && referenceResults?.avgStage"
            class="flex items-center justify-center mt-1 w-full"
          >
            <div :class="getAbsoluteDiffClasses(results.avgStage, referenceResults.avgStage, true, true)" class="whitespace-nowrap inline-flex items-center">
              <component :is="getDiffIcon(results.avgStage, referenceResults.avgStage)" size="11" class="mr-0.5 flex-shrink-0" />
              <span>{{ getAbsoluteDiffText(results.avgStage, referenceResults.avgStage) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Avg Time -->
        <div class="stat-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
            <div class="flex items-center">
              <IconClock :size="14" class="text-blue-400 mr-1" />
              <div class="text-xs text-gray-400">{{ resultLabels.avgTime || 'Run Time' }} (Runs/day)</div>
            </div>
          </div>
          
          <!-- Wert und Runs/Day zentriert -->
          <div class="flex justify-center items-center">
            <span class="text-white font-medium text-center">{{ formatTime(results.avgTime) }}</span>
            <span class="text-xs text-gray-400 ml-1">
              ({{ formatNumber(calculateRunsPerDay(results.avgTime)) }})
            </span>
          </div>
          
          <!-- Prozentuale Abweichung zum Referenz-Build -->
          <div 
            v-if="!isReferenceBuild && referenceResults?.avgTime"
            class="flex items-center justify-center mt-1 w-full"
          >
            <div :class="getTimeDiffClasses(results.avgTime, referenceResults.avgTime, true)" class="whitespace-nowrap inline-flex items-center">
              <component :is="getDiffIcon(referenceResults.avgTime, results.avgTime)" size="11" class="mr-0.5 flex-shrink-0" />
              <span>{{ getTimeDiffText(results.avgTime, referenceResults.avgTime) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Trenner vor Resources -->
        <div class="border-r border-gray-700/30 h-full"></div>
                
        <!-- Material 1 -->
        <div class="resource-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center border-b border-gray-700/50 pb-1 mb-1.5">
            <IconDiamond size="14" class="mr-1.5 text-red-400" />
            <span class="text-xs text-gray-300">{{ resultLabels.mat1 || 'Mat 1' }}</span>
          </div>
          
          <!-- Run und Day nebeneinander mit vertikalen Labels -->
          <div class="grid grid-cols-2 gap-1 mt-1.5 relative">
            <!-- Per Run (links) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5">RUN</div>
              <div class="flex-1">
                <div class="font-medium text-center">{{ formatNumber(results.mat1) }}</div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat1 && results.mat1"
                  :class="getDiffClasses(results.mat1, referenceResults.mat1, true, true)"
                  class="text-xs whitespace-nowrap flex items-center mt-0.5 justify-center mt-1"
                >
                  <component :is="getDiffIcon(results.mat1, referenceResults.mat1)" size="11" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat1, referenceResults.mat1) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Vertikaler Trennstrich -->
            <div class="absolute border-l border-gray-700/30 h-full left-1/2"></div>
            
            <!-- Per Day (rechts) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5">DAY</div>
              <div class="flex-1">
                <div class="font-medium text-center">{{ formatNumber(calculatePerDay(results.mat1, results.avgTime)) }}</div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat1 && referenceResults?.avgTime"
                  :class="getDiffClasses(
                    calculatePerDay(results.mat1, results.avgTime), 
                    calculatePerDay(referenceResults.mat1, referenceResults.avgTime), 
                    true, 
                    true
                  )"
                  class="text-xs whitespace-nowrap flex items-center mt-0.5 justify-center mt-1"
                >
                  <component 
                    :is="getDiffIcon(
                      calculatePerDay(results.mat1, results.avgTime), 
                      calculatePerDay(referenceResults.mat1, referenceResults.avgTime)
                    )" 
                    size="11" 
                    class="mr-0.5" 
                  />
                  <span>{{ 
                    getDiffText(
                      calculatePerDay(results.mat1, results.avgTime), 
                      calculatePerDay(referenceResults.mat1, referenceResults.avgTime)
                    )
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Material 2 -->
        <div class="resource-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center border-b border-gray-700/50 pb-1 mb-1.5">
            <IconHexagon size="14" class="mr-1.5 text-orange-400" />
            <span class="text-xs text-gray-300">{{ resultLabels.mat2 || 'Mat 2' }}</span>
          </div>
          
          <!-- Run und Day nebeneinander mit vertikalen Labels -->
          <div class="grid grid-cols-2 gap-1 mt-1.5 relative">
            <!-- Per Run (links) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5">RUN</div>
              <div class="flex-1">
                <div class="font-medium text-center">{{ formatNumber(results.mat2) }}</div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat2 && results.mat2"
                  :class="getDiffClasses(results.mat2, referenceResults.mat2, true, true)"
                  class="text-xs whitespace-nowrap flex items-center mt-0.5 justify-center mt-1"
                >
                  <component :is="getDiffIcon(results.mat2, referenceResults.mat2)" size="11" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat2, referenceResults.mat2) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Vertikaler Trennstrich -->
            <div class="absolute border-l border-gray-700/30 h-full left-1/2"></div>
            
            <!-- Per Day (rechts) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5">DAY</div>
              <div class="flex-1">
                <div class="font-medium text-center">{{ formatNumber(calculatePerDay(results.mat2, results.avgTime)) }}</div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat2 && referenceResults?.avgTime"
                  :class="getDiffClasses(
                    calculatePerDay(results.mat2, results.avgTime), 
                    calculatePerDay(referenceResults.mat2, referenceResults.avgTime), 
                    true, 
                    true
                  )"
                  class="text-xs whitespace-nowrap flex items-center mt-0.5 justify-center mt-1"
                >
                  <component 
                    :is="getDiffIcon(
                      calculatePerDay(results.mat2, results.avgTime), 
                      calculatePerDay(referenceResults.mat2, referenceResults.avgTime)
                    )" 
                    size="11" 
                    class="mr-0.5" 
                  />
                  <span>{{ 
                    getDiffText(
                      calculatePerDay(results.mat2, results.avgTime), 
                      calculatePerDay(referenceResults.mat2, referenceResults.avgTime)
                    )
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Material 3 -->
        <div class="resource-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center border-b border-gray-700/50 pb-1 mb-1.5">
            <IconHexagons size="14" class="mr-1.5 text-amber-400" />
            <span class="text-xs text-gray-300">{{ resultLabels.mat3 || 'Mat 3' }}</span>
          </div>
          
          <!-- Run und Day nebeneinander mit vertikalen Labels -->
          <div class="grid grid-cols-2 gap-1 mt-1.5 relative">
            <!-- Per Run (links) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5">RUN</div>
              <div class="flex-1">
                <div class="font-medium text-center">{{ formatNumber(results.mat3) }}</div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat3 && results.mat3"
                  :class="getDiffClasses(results.mat3, referenceResults.mat3, true, true)"
                  class="text-xs whitespace-nowrap flex items-center mt-0.5 justify-center mt-1"
                >
                  <component :is="getDiffIcon(results.mat3, referenceResults.mat3)" size="11" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat3, referenceResults.mat3) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Vertikaler Trennstrich -->
            <div class="absolute border-l border-gray-700/30 h-full left-1/2"></div>
            
            <!-- Per Day (rechts) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5">DAY</div>
              <div class="flex-1">
                <div class="font-medium text-center">{{ formatNumber(calculatePerDay(results.mat3, results.avgTime)) }}</div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat3 && referenceResults?.avgTime"
                  :class="getDiffClasses(
                    calculatePerDay(results.mat3, results.avgTime), 
                    calculatePerDay(referenceResults.mat3, referenceResults.avgTime), 
                    true, 
                    true
                  )"
                  class="text-xs whitespace-nowrap flex items-center mt-0.5 justify-center mt-1"
                >
                  <component 
                    :is="getDiffIcon(
                      calculatePerDay(results.mat3, results.avgTime), 
                      calculatePerDay(referenceResults.mat3, referenceResults.avgTime)
                    )" 
                    size="11" 
                    class="mr-0.5" 
                  />
                  <span>{{ 
                    getDiffText(
                      calculatePerDay(results.mat3, results.avgTime), 
                      calculatePerDay(referenceResults.mat3, referenceResults.avgTime)
                    )
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- XP Resource -->
        <div class="resource-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center border-b border-gray-700/50 pb-1 mb-1.5">
            <IconBrightness size="14" class="mr-1.5 text-blue-400" />
            <span class="text-xs text-gray-300">{{ resultLabels.xp || 'XP' }}</span>
          </div>
          
          <!-- Run und Day nebeneinander mit vertikalen Labels -->
          <div class="grid grid-cols-2 gap-1 mt-1.5 relative">
            <!-- Per Run (links) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5">RUN</div>
              <div class="flex-1">
                <div class="font-medium text-center">{{ formatNumber(results.xp) }}</div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.xp && results.xp"
                  :class="getDiffClasses(results.xp, referenceResults.xp, true, true)"
                  class="text-xs whitespace-nowrap flex items-center mt-0.5 justify-center mt-1"
                >
                  <component :is="getDiffIcon(results.xp, referenceResults.xp)" size="11" class="mr-0.5" />
                  <span>{{ getDiffText(results.xp, referenceResults.xp) }}</span>
                </div>
              </div>
            </div>
            
            <!-- Vertikaler Trennstrich -->
            <div class="absolute border-l border-gray-700/30 h-full left-1/2"></div>
            
            <!-- Per Day (rechts) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5">DAY</div>
              <div class="flex-1">
                <div class="font-medium text-center">{{ formatNumber(calculatePerDay(results.xp, results.avgTime)) }}</div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.xp && referenceResults?.avgTime"
                  :class="getDiffClasses(
                    calculatePerDay(results.xp, results.avgTime), 
                    calculatePerDay(referenceResults.xp, referenceResults.avgTime), 
                    true, 
                    true
                  )"
                  class="text-xs whitespace-nowrap flex items-center mt-0.5 justify-center mt-1"
                >
                  <component 
                    :is="getDiffIcon(
                      calculatePerDay(results.xp, results.avgTime), 
                      calculatePerDay(referenceResults.xp, referenceResults.avgTime)
                    )" 
                    size="11" 
                    class="mr-0.5" 
                  />
                  <span>{{ 
                    getDiffText(
                      calculatePerDay(results.xp, results.avgTime), 
                      calculatePerDay(referenceResults.xp, referenceResults.avgTime)
                    )
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Trenner vor Boss-Stats -->
        <div class="border-r border-gray-700/30 h-full"></div>
        
        <!-- Boss Stats (flexibler Restplatz) -->
        <div class="grid grid-cols-2 gap-2 w-full">
          <!-- Boss Kill Rate -->
          <div class="stat-box">
            <!-- Header mit Icon und Label -->
            <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
              <div class="flex items-center">
                <IconSword :size="14" class="text-green-400 mr-1" />
                <div class="text-xs text-gray-400">{{ resultLabels.bossKillRate || 'Kill Rate' }}</div>
              </div>
            </div>
            
            <!-- Wert zentriert -->
            <div class="flex justify-center items-center">
              <span v-if="results.bossKillRate !== '--'" class="text-white font-medium text-center">
                {{ formatPercent(results.bossKillRate) }}
              </span>
              <span v-else class="text-gray-500 font-medium text-center">--</span>
            </div>
            
            <!-- Prozentuale Abweichung zum Referenz-Build -->
            <div 
              v-if="!isReferenceBuild && results.bossKillRate !== '--' && referenceResults?.bossKillRate && referenceResults.bossKillRate !== '--'"
              class="flex items-center justify-center mt-1 w-full"
            >
              <div :class="getBossStatDiffClasses(results.bossKillRate, referenceResults.bossKillRate, true, true)" class="whitespace-nowrap inline-flex items-center">
                <component :is="getDiffIcon(results.bossKillRate, referenceResults.bossKillRate)" size="11" class="mr-0.5 flex-shrink-0" />
                <span>{{ getBossStatDiffText(results.bossKillRate, referenceResults.bossKillRate) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Boss HP -->
          <div class="stat-box">
            <!-- Header mit Icon und Label -->
            <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
              <div class="flex items-center">
                <IconHeartFilled :size="14" class="text-pink-400 mr-1" />
                <div class="text-xs text-gray-400">{{ resultLabels.bossHpPercent || 'Boss HP' }}</div>
              </div>
            </div>
            
            <!-- Wert zentriert -->
            <div class="flex justify-center items-center">
              <span v-if="results.bossHpPercent !== '--'" class="text-white font-medium text-center">
                {{ formatPercent(results.bossHpPercent) }}
              </span>
              <span v-else class="text-gray-500 font-medium text-center">--</span>
            </div>
            
            <!-- Prozentuale Abweichung zum Referenz-Build -->
            <div 
              v-if="!isReferenceBuild && results.bossHpPercent !== '--' && referenceResults?.bossHpPercent && referenceResults.bossHpPercent !== '--'"
              class="flex items-center justify-center mt-1 w-full"
            >
              <div :class="getBossStatDiffClasses((100 - results.bossHpPercent), (100 - referenceResults.bossHpPercent), true, true)" class="whitespace-nowrap inline-flex items-center">
                <component :is="getDiffIcon((100 - results.bossHpPercent), (100 - referenceResults.bossHpPercent))" size="11" class="mr-0.5 flex-shrink-0" />
                <span>{{ getBossStatDiffText(results.bossHpPercent, referenceResults.bossHpPercent) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  IconAlertCircle, IconBrightness, IconDiamond, IconHexagon, IconHexagons,
  IconReportMoney, IconStairs, IconClock, IconSword, IconHeartFilled
} from '@tabler/icons-vue';
import { 
  formatNumber, formatStage, formatTime, formatPercent,
  getDiffClasses, getDiffIcon, getDiffText,
  getAbsoluteDiffClasses, getAbsoluteDiffText,
  getTimeDiffClasses, getTimeDiffText,
  getBossStatDiffClasses, getBossStatDiffText,
  calculatePerDay, calculateRunsPerDay
} from '@/components/builds/utils/BuildComparisonUtils';

const props = defineProps({
  buildData: { 
    type: Object, 
    required: true 
  },
  isLoading: { 
    type: Boolean, 
    default: false 
  },
  hasError: { 
    type: Boolean, 
    default: false 
  },
  results: { 
    type: Object, 
    default: null 
  },
  isReferenceBuild: { 
    type: Boolean, 
    default: false 
  },
  referenceResults: { 
    type: Object, 
    default: () => ({}) 
  },
  resultLabels: { 
    type: Object, 
    default: () => ({}) 
  },
  progressIteration: { 
    type: Number, 
    default: 0 
  },
  totalIterations: { 
    type: Number, 
    default: 1000 
  },
  hunterColor: { 
    type: String,
    default: 'blue'
  }
});

const emit = defineEmits(['reevaluate']);

// Fortschrittsanzeige Prozentsatz
const progressPercent = computed(() => {
  const percent = Math.round((props.progressIteration / props.totalIterations) * 100);
  return Math.min(99, percent);
});
</script>

<style scoped>
.stat-box {
  min-width: 0;
  padding: 0.5rem;
  background-color: rgb(18, 26, 48);
  border-radius: 0.5rem;
}

.resource-box {
  min-width: 0;
  padding: 0.5rem;
  background-color: rgb(18, 26, 48);
  border-radius: 0.5rem;
  position: relative; /* Wichtig für den absolut positionierten Trennstrich */
}

/* Vertikaler Text für Run und Day Labels */
.vertical-label {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  font-size: 0.7rem;
  text-align: center;
  color: #9ca3af; /* text-gray-400 */
  letter-spacing: 0.05em;
  font-weight: 500;
  width: 12px;
  height: auto;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sorge dafür, dass die Inhalts-Container eine vernünftige Höhe haben */
.flex.items-start {
  align-self: flex-start;
}

/* Verbessere das Layout der Resource-Boxen */
.resource-box .grid {
  align-items: flex-start;
}
</style>