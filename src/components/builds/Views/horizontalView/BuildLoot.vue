<!-- filepath: c:\Users\igorn\projects\huntersim2\src\components\verticalView\BuildLoot.vue -->
<template>
  <div class="p-2">
    <!-- Loading-Zustand -->
    <div v-if="isLoading" class="flex items-center justify-center py-6 space-x-3">
      <!-- Spinner -->
      <div class="relative">
        <div 
          class="w-8 h-8 border-3 border-gray-600 rounded-full animate-spin"
          :class="{
            'border-t-red-500': hunterColor === 'red',
            'border-t-blue-500': hunterColor === 'blue', 
            'border-t-green-500': hunterColor === 'green',
            'border-t-purple-500': hunterColor === 'purple',
            'border-t-orange-500': hunterColor === 'orange',
            'border-t-yellow-500': hunterColor === 'yellow',
            'border-t-emerald-500': !['red', 'blue', 'green', 'purple'].includes(hunterColor)
          }"
        ></div>
      </div>
      
      <!-- Loading Text -->
      <div class="text-sm text-gray-400">
        Evaluating build...
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
    <div v-else-if="results" class="flex flex-col space-y-3" :class="{'text-sm': isLowResolution}">
      <!-- Stats Row -->
      <div class="w-full grid gap-1.5" :class="{'low-res': isLowResolution}"
           style="grid-template-columns: 7.2% 9% 9.2% 1px 13.6% 13.6% 13.6% 13.6% 1px auto;">
        <!-- Loot Score -->
        <div class="stat-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
            <div class="flex items-center">
              <IconReportMoney :size="isLowResolution ? 12 : 14" class="text-amber-400 mr-1" />
              <div class="text-gray-400" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
                Loot Score
              </div>
              <InfoTooltip 
                content="Overall Build Efficiency Rating that excludes pure loot bonuses (Ultima, etc). This allows for fair Build comparison, focusing only on the Build's core effectiveness."
                placement="top"
                class="ml-0.5"
              />
            </div>
          </div>
          
          <!-- Wert zentriert -->
          <div class="flex justify-center items-center">
            <span class="text-white text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
              {{ formatNumber(results.lootPerMin) }}
            </span>
          </div>
          
          <!-- Prozentuale Abweichung zum Referenz-Build -->
          <div 
            v-if="!isReferenceBuild && referenceResults?.lootPerMin"
            class="flex items-center justify-center mt-1 w-full"
          >
            <div :class="[
              getDiffClasses(results.lootPerMin, referenceResults.lootPerMin, true, true),
              'whitespace-nowrap inline-flex items-center',
              isLowResolution ? 'text-2xs' : 'text-xs'
            ]">
              <component :is="getDiffIcon(results.lootPerMin, referenceResults.lootPerMin)" 
                        :size="isLowResolution ? 10 : 11" 
                        class="mr-0.5 flex-shrink-0" />
              <span>{{ getDiffText(results.lootPerMin, referenceResults.lootPerMin) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Avg Stage -->
        <div class="stat-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
            <div class="flex items-center">
              <IconStairs :size="isLowResolution ? 12 : 14" :class="`text-${hunterColor}-400 mr-1`" />
              <div class="text-gray-400" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
                {{ resultLabels.avgStage || 'Avg Stage' }} 
                <span :class="isLowResolution ? 'text-3xs' : 'text-2xs'">
                  (Range)
                </span>
              </div>
            </div>
          </div>
          
          <!-- Wert und Range zentriert -->
          <div class="flex justify-center items-center">
            <span class="text-white text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
              {{ formatStage(results.avgStage, true) }}
            </span>
            <span class="text-gray-400 ml-1" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
              ({{ formatStage(results.minStage) }}-{{ formatStage(results.maxStage) }})
            </span>
          </div>
          
          <!-- Prozentuale Abweichung zum Referenz-Build -->
          <div 
            v-if="!isReferenceBuild && referenceResults?.avgStage"
            class="flex items-center justify-center mt-1 w-full"
          >
            <div :class="[
              getAbsoluteDiffClasses(results.avgStage, referenceResults.avgStage, true, true),
              'whitespace-nowrap inline-flex items-center',
              isLowResolution ? 'text-2xs' : 'text-xs'
            ]">
              <component :is="getDiffIcon(results.avgStage, referenceResults.avgStage)" 
                        :size="isLowResolution ? 10 : 11" 
                        class="mr-0.5 flex-shrink-0" />
              <span>{{ getAbsoluteDiffText(results.avgStage, referenceResults.avgStage) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Avg Time -->
        <div class="stat-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
            <div class="flex items-center">
              <IconClock :size="isLowResolution ? 12 : 14" class="text-blue-400 mr-1" />
              <div class="text-gray-400" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
                {{ resultLabels.avgTime || 'Run Time' }} 
                <span :class="isLowResolution ? 'text-3xs' : 'text-2xs'">
                  (Runs/d)
                </span>
              </div>
            </div>
          </div>
          
          <!-- Wert und Runs/Day zentriert -->
          <div class="flex justify-center items-center">
            <span class="text-white text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
              {{ formatTime(results.avgTime) }}
            </span>
            <span class="text-gray-400 ml-1" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
              ({{ formatNumber(calculateRunsPerDay(results.avgTime)) }})
            </span>
          </div>
          
          <!-- Prozentuale Abweichung zum Referenz-Build -->
          <div 
            v-if="!isReferenceBuild && referenceResults?.avgTime"
            class="flex items-center justify-center mt-1 w-full"
          >
            <div :class="[
              getTimeDiffClasses(results.avgTime, referenceResults.avgTime, true),
              'whitespace-nowrap inline-flex items-center',
              isLowResolution ? 'text-2xs' : 'text-xs'
            ]">
              <component :is="getDiffIcon(referenceResults.avgTime, results.avgTime)" 
                        :size="isLowResolution ? 10 : 11" 
                        class="mr-0.5 flex-shrink-0" />
              <span>{{ getTimeDiffText(results.avgTime, referenceResults.avgTime) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Trenner vor Resources -->
        <div class="border-r border-gray-700/30 h-full"></div>
          
        <!-- Material 1 -->
        <div class="resource-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center border-b border-gray-700/50 pb-0.5 mb-1.5">
            <img 
              v-if="hasIcon('mat1')" 
              :src="icons.mat1" 
              alt="Material 1" 
              class="mr-1.5"
              :style="{ width: isLowResolution ? '16px' : '20px', height: isLowResolution ? '16px' : '20px' }" 
            />
            <IconDiamond v-else :size="isLowResolution ? 12 : 14" class="mr-1.5 text-red-400" />
            <span class="text-gray-300" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
              {{ resultLabels.mat1 || 'Mat 1' }}
            </span>
          </div>
          
          <!-- Run und Day nebeneinander mit vertikalen Labels -->
          <div class="grid grid-cols-2 gap-1 mt-1.5 relative">
            <!-- Per Run (links) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5" :class="{'text-2xs': isLowResolution}">RUN</div>
              <div class="flex-1">
                <div class="text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                  {{ formatNumber(results.mat1) }}
                </div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat1 && results.mat1"
                  class="w-full flex justify-center mt-1"
                >
                  <div :class="[
                    getDiffClasses(results.mat1, referenceResults.mat1, true, true),
                    'whitespace-nowrap inline-flex items-center',
                    isLowResolution ? 'text-2xs' : 'text-xs'
                  ]">
                    <component :is="getDiffIcon(results.mat1, referenceResults.mat1)" 
                              :size="isLowResolution ? 10 : 11" 
                              class="mr-0.5" />
                    <span>{{ getDiffText(results.mat1, referenceResults.mat1) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Vertikaler Trennstrich -->
            <div class="absolute border-l border-gray-700/30 h-full left-1/2"></div>
            
            <!-- Per Day (rechts) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5" :class="{'text-2xs': isLowResolution}">DAY</div>
              <div class="flex-1">
                <div class="text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                  {{ formatNumber(calculatePerDay(results.mat1, results.avgTime)) }}
                </div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat1 && referenceResults?.avgTime"
                  class="w-full flex justify-center mt-1"
                >
                  <div :class="[
                    getDiffClasses(
                      calculatePerDay(results.mat1, results.avgTime), 
                      calculatePerDay(referenceResults.mat1, referenceResults.avgTime), 
                      true, 
                      true
                    ),
                    'whitespace-nowrap inline-flex items-center',
                    isLowResolution ? 'text-2xs' : 'text-xs'
                  ]">
                    <component 
                      :is="getDiffIcon(
                        calculatePerDay(results.mat1, results.avgTime), 
                        calculatePerDay(referenceResults.mat1, referenceResults.avgTime)
                      )" 
                      :size="isLowResolution ? 10 : 11"
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
        </div>

        <!-- Material 2 -->
        <div class="resource-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center border-b border-gray-700/50 pb-0.5 mb-1.5">
            <img 
              v-if="hasIcon('mat2')" 
              :src="icons.mat2" 
              alt="Material 2" 
              class="mr-1.5"
              :style="{ width: isLowResolution ? '16px' : '20px', height: isLowResolution ? '16px' : '20px' }" 
            />
            <IconHexagon v-else :size="isLowResolution ? 12 : 14" class="mr-1.5 text-orange-400" />
            <span class="text-gray-300" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
              {{ resultLabels.mat2 || 'Mat 2' }}
            </span>
          </div>
          
          <!-- Run und Day nebeneinander mit vertikalen Labels -->
          <div class="grid grid-cols-2 gap-1 mt-1.5 relative">
            <!-- Per Run (links) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5" :class="{'text-2xs': isLowResolution}">RUN</div>
              <div class="flex-1">
                <div class="text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                  {{ formatNumber(results.mat2) }}
                </div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat2 && results.mat2"
                  class="w-full flex justify-center mt-1"
                >
                  <div :class="[
                    getDiffClasses(results.mat2, referenceResults.mat2, true, true),
                    'whitespace-nowrap inline-flex items-center',
                    isLowResolution ? 'text-2xs' : 'text-xs'
                  ]">
                    <component :is="getDiffIcon(results.mat2, referenceResults.mat2)" 
                              :size="isLowResolution ? 10 : 11" 
                              class="mr-0.5" />
                    <span>{{ getDiffText(results.mat2, referenceResults.mat2) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Vertikaler Trennstrich -->
            <div class="absolute border-l border-gray-700/30 h-full left-1/2"></div>
            
            <!-- Per Day (rechts) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5" :class="{'text-2xs': isLowResolution}">DAY</div>
              <div class="flex-1">
                <div class="text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                  {{ formatNumber(calculatePerDay(results.mat2, results.avgTime)) }}
                </div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat2 && referenceResults?.avgTime"
                  class="w-full flex justify-center mt-1"
                >
                  <div :class="[
                    getDiffClasses(
                      calculatePerDay(results.mat2, results.avgTime), 
                      calculatePerDay(referenceResults.mat2, referenceResults.avgTime), 
                      true, 
                      true
                    ),
                    'whitespace-nowrap inline-flex items-center',
                    isLowResolution ? 'text-2xs' : 'text-xs'
                  ]">
                    <component 
                      :is="getDiffIcon(
                        calculatePerDay(results.mat2, results.avgTime), 
                        calculatePerDay(referenceResults.mat2, referenceResults.avgTime)
                      )" 
                      :size="isLowResolution ? 10 : 11"
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
        </div>

        <!-- Material 3 -->
        <div class="resource-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center border-b border-gray-700/50 pb-0.5 mb-1.5">
            <img 
              v-if="hasIcon('mat3')" 
              :src="icons.mat3" 
              alt="Material 3" 
              class="mr-1.5"
              :style="{ width: isLowResolution ? '16px' : '20px', height: isLowResolution ? '16px' : '20px' }" 
            />
            <IconHexagons v-else :size="isLowResolution ? 12 : 14" class="mr-1.5 text-amber-400" />
            <span class="text-gray-300" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
              {{ resultLabels.mat3 || 'Mat 3' }}
            </span>
          </div>
          
          <!-- Run und Day nebeneinander mit vertikalen Labels -->
          <div class="grid grid-cols-2 gap-1 mt-1.5 relative">
            <!-- Per Run (links) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5" :class="{'text-2xs': isLowResolution}">RUN</div>
              <div class="flex-1">
                <div class="text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                  {{ formatNumber(results.mat3) }}
                </div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat3 && results.mat3"
                  class="w-full flex justify-center mt-1"
                >
                  <div :class="[
                    getDiffClasses(results.mat3, referenceResults.mat3, true, true),
                    'whitespace-nowrap inline-flex items-center',
                    isLowResolution ? 'text-2xs' : 'text-xs'
                  ]">
                    <component :is="getDiffIcon(results.mat3, referenceResults.mat3)" 
                              :size="isLowResolution ? 10 : 11" 
                              class="mr-0.5" />
                    <span>{{ getDiffText(results.mat3, referenceResults.mat3) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Vertikaler Trennstrich -->
            <div class="absolute border-l border-gray-700/30 h-full left-1/2"></div>
            
            <!-- Per Day (rechts) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5" :class="{'text-2xs': isLowResolution}">DAY</div>
              <div class="flex-1">
                <div class="text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                  {{ formatNumber(calculatePerDay(results.mat3, results.avgTime)) }}
                </div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.mat3 && referenceResults?.avgTime"
                  class="w-full flex justify-center mt-1"
                >
                  <div :class="[
                    getDiffClasses(
                      calculatePerDay(results.mat3, results.avgTime), 
                      calculatePerDay(referenceResults.mat3, referenceResults.avgTime), 
                      true, 
                      true
                    ),
                    'whitespace-nowrap inline-flex items-center',
                    isLowResolution ? 'text-2xs' : 'text-xs'
                  ]">
                    <component 
                      :is="getDiffIcon(
                        calculatePerDay(results.mat3, results.avgTime), 
                        calculatePerDay(referenceResults.mat3, referenceResults.avgTime)
                      )" 
                      :size="isLowResolution ? 10 : 11"
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
        </div>

        <!-- XP Resource -->
        <div class="resource-box">
          <!-- Header mit Icon und Label -->
          <div class="flex items-center border-b border-gray-700/50 pb-0.5 mb-1.5">
            <img 
              v-if="hasIcon('xp')" 
              :src="icons.xp" 
              alt="XP" 
              class="mr-1.5"
              :style="{ width: isLowResolution ? '16px' : '20px', height: isLowResolution ? '16px' : '20px' }" 
            />
            <IconBrightness v-else :size="isLowResolution ? 12 : 14" class="mr-1.5 text-blue-400" />
            <span class="text-gray-300" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
              {{ resultLabels.xp || 'XP' }}
            </span>
          </div>
          
          <!-- Run und Day nebeneinander mit vertikalen Labels -->
          <div class="grid grid-cols-2 gap-1 mt-1.5 relative">
            <!-- Per Run (links) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5" :class="{'text-2xs': isLowResolution}">RUN</div>
              <div class="flex-1">
                <div class="text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                  {{ formatNumber(results.xp) }}
                </div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.xp && results.xp"
                  class="w-full flex justify-center mt-1"
                >
                  <div :class="[
                    getDiffClasses(results.xp, referenceResults.xp, true, true),
                    'whitespace-nowrap inline-flex items-center',
                    isLowResolution ? 'text-2xs' : 'text-xs'
                  ]">
                    <component :is="getDiffIcon(results.xp, referenceResults.xp)" 
                              :size="isLowResolution ? 10 : 11" 
                              class="mr-0.5" />
                    <span>{{ getDiffText(results.xp, referenceResults.xp) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Vertikaler Trennstrich -->
            <div class="absolute border-l border-gray-700/30 h-full left-1/2"></div>
            
            <!-- Per Day (rechts) -->
            <div class="flex items-start">
              <div class="vertical-label mr-1.5" :class="{'text-2xs': isLowResolution}">DAY</div>
              <div class="flex-1">
                <div class="text-center" :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                  {{ formatNumber(calculatePerDay(results.xp, results.avgTime)) }}
                </div>
                <div 
                  v-if="!isReferenceBuild && referenceResults?.xp && referenceResults?.avgTime"
                  class="w-full flex justify-center mt-1"
                >
                  <div :class="[
                    getDiffClasses(
                      calculatePerDay(results.xp, results.avgTime), 
                      calculatePerDay(referenceResults.xp, referenceResults.avgTime), 
                      true, 
                      true
                    ),
                    'whitespace-nowrap inline-flex items-center',
                    isLowResolution ? 'text-2xs' : 'text-xs'
                  ]">
                    <component 
                      :is="getDiffIcon(
                        calculatePerDay(results.xp, results.avgTime), 
                        calculatePerDay(referenceResults.xp, referenceResults.avgTime)
                      )" 
                      :size="isLowResolution ? 10 : 11"
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
                <IconSword :size="isLowResolution ? 12 : 14" class="text-green-400 mr-1" />
                <div class="text-gray-400" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
                  {{ resultLabels.bossKillRate || 'Kill Rate' }}
                </div>
              </div>
            </div>
            
            <!-- Wert zentriert -->
            <div class="flex justify-center items-center">
              <span v-if="results.bossKillRate !== '--'" 
                  class="text-white text-center"
                  :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                {{ formatPercent(results.bossKillRate) }}
              </span>
              <span v-else 
                  class="text-gray-500 text-center"
                  :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">--</span>
            </div>
            
            <!-- Prozentuale Abweichung zum Referenz-Build -->
            <div 
              v-if="!isReferenceBuild && results.bossKillRate !== '--' && referenceResults?.bossKillRate && referenceResults.bossKillRate !== '--'"
              class="flex items-center justify-center mt-1 w-full"
            >
              <div :class="[
                  getBossStatDiffClasses(results.bossKillRate, referenceResults.bossKillRate, true, true),
                  'whitespace-nowrap inline-flex items-center',
                  isLowResolution ? 'text-2xs' : 'text-xs'
                ]">
                <component :is="getDiffIcon(results.bossKillRate, referenceResults.bossKillRate)" 
                          :size="isLowResolution ? 10 : 11" 
                          class="mr-0.5 flex-shrink-0" />
                <span>{{ getBossStatDiffText(results.bossKillRate, referenceResults.bossKillRate) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Boss HP -->
          <div class="stat-box">
            <!-- Header mit Icon und Label -->
            <div class="flex items-center justify-between border-b border-gray-700/50 pb-1 mb-2">
              <div class="flex items-center">
                <IconHeartFilled :size="isLowResolution ? 12 : 14" class="text-pink-400 mr-1" />
                <div class="text-gray-400" :class="isLowResolution ? 'text-2xs' : 'text-xs'">
                  {{ resultLabels.bossHpPercent || 'Boss HP' }}
                </div>
              </div>
            </div>
            
            <!-- Wert zentriert -->
            <div class="flex justify-center items-center">
              <span v-if="results.bossHpPercent !== '--'" 
                  class="text-white text-center"
                  :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">
                {{ formatPercent(results.bossHpPercent) }}
              </span>
              <span v-else 
                  class="text-gray-500 text-center"
                  :class="isLowResolution ? 'text-sm' : 'text-base font-medium'">--</span>
            </div>
            
            <!-- Prozentuale Abweichung zum Referenz-Build -->
            <div 
              v-if="!isReferenceBuild && results.bossHpPercent !== '--' && referenceResults?.bossHpPercent && referenceResults.bossHpPercent !== '--'"
              class="flex items-center justify-center mt-1 w-full"
            >
              <div :class="[
                  getBossStatDiffClasses((100 - results.bossHpPercent), (100 - referenceResults.bossHpPercent), true, true),
                  'whitespace-nowrap inline-flex items-center',
                  isLowResolution ? 'text-2xs' : 'text-xs'
                ]">
                <component :is="getDiffIcon((100 - results.bossHpPercent), (100 - referenceResults.bossHpPercent))" 
                          :size="isLowResolution ? 10 : 11" 
                          class="mr-0.5 flex-shrink-0" />
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  IconAlertCircle, IconBrightness, IconDiamond, IconHexagon, IconHexagons,
  IconReportMoney, IconStairs, IconClock, IconSword, IconHeartFilled
} from '@tabler/icons-vue';
import { useLootIcons } from '@/composables/useLootIcons';
import { 
  formatNumber, formatStage, formatTime, formatPercent,
  getDiffClasses, getDiffIcon, getDiffText,
  getAbsoluteDiffClasses, getAbsoluteDiffText,
  getTimeDiffClasses, getTimeDiffText,
  getBossStatDiffClasses, getBossStatDiffText,
  calculatePerDay, calculateRunsPerDay
} from '@/components/builds/utils/BuildComparisonUtils';
import InfoTooltip from '@/composables/InfoTooltip.vue';

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
  },
  hunterId: { 
    type: String,
    required: true
  }
});

const emit = defineEmits(['reevaluate']);

// Loot-Icons für den aktuellen Hunter laden
const { icons, hasIcon } = useLootIcons(props.hunterId);

// Fortschrittsanzeige Prozentsatz
const progressPercent = computed(() => {
  const percent = Math.round((props.progressIteration / props.totalIterations) * 100);
  return Math.min(99, percent);
});

// Neue Computed Property für Bildschirmauflösung
const isLowResolution = ref(false);

// Überprüfe die Bildschirmauflösung beim Mounten der Komponente
function checkResolution() {
  isLowResolution.value = window.innerWidth < 1704; // Unter Full HD, etwas an mein tree style tab angepasst
}

onMounted(() => {
  // Erste Prüfung beim Laden
  checkResolution();
  // Event-Listener für Größenänderungen
  window.addEventListener('resize', checkResolution);
});

onUnmounted(() => {
  // Event-Listener entfernen
  window.removeEventListener('resize', checkResolution);
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
  padding: 0.35rem;
  background-color: rgb(18, 26, 48);
  border-radius: 0.5rem;
  position: relative;
}

/* Vertikaler Text für Run und Day Labels */
.vertical-label {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  font-size: 0.7rem;
  text-align: center;
  color: #9ca3af;
  letter-spacing: 0.05em;
  font-weight: 500;
  width: 12px;
  height: auto;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Niedrigere Auflösungen - kleinere vertikale Labels */
.vertical-label.text-2xs {
  font-size: 0.65rem;
  width: 10px;
  min-height: 24px;
  letter-spacing: 0.03em;
}

/* Kleinere Textgröße für niedrige Auflösungen */
.text-2xs {
  font-size: 0.65rem;
  line-height: 1rem;
}

.text-3xs {
  font-size: 0.6rem;
  line-height: 0.9rem;
  opacity: 0.85;
}

/* Verkleinere den Padding für niedrige Auflösungen */
.low-res .stat-box, 
.low-res .resource-box {
  padding: 0.4rem;
}

.low-res .vertical-label {
  min-height: 24px;
}

/* Verbessere das Layout der Resource-Boxen */
.resource-box .grid {
  align-items: flex-start;
}

/* Zusätzlicher Style für die Icon-Bilder */
img.resource-icon {
  object-fit: contain;
  display: inline-flex;
  vertical-align: middle;
}
</style>