<template>
  <div 
    class="build-compact border-l-4 bg-gray-800 rounded-lg shadow-md mb-3 overflow-hidden transition-all duration-200"
    :class="[
      isReferenceBuild ? 'border-yellow-500' : `border-${hunterColor}-500`
    ]"
  >
    <div class="flex flex-col">
      <!-- Header mit Build-Info -->
      <div class="bg-gray-850/40 p-3 flex items-center border-b border-gray-700/30">

        <!-- Grip Handle (links) -->
        <div class="grip-handle p-1.5 cursor-grab rounded-md text-gray-500 hover:bg-gray-700 hover:text-gray-300 transition-colors">
          <IconGripVertical size="16" />
        </div>

        <!-- Build-Name -->
        <div class="flex-1">
          <div class="flex items-center">
            <!-- Name editing mode -->
            <div v-if="isEditingName" class="flex-grow mr-2">
              <input
                ref="nameInputRef"
                v-model="editableName"
                class="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:border-blue-500 outline-none w-52 max-w-[100%]"
                @keyup.enter="saveName"
                @keyup.esc="isEditingName = false"
                @blur="saveName"
              />
            </div>
            
            <!-- Regular name display -->
            <h3 v-else class="text-white font-medium truncate mr-2 flex items-center flex-grow">
              <!-- Name edit button - vor dem Namen -->
              <button 
                @click="startNameEdit" 
                class="mr-1.5 p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex-shrink-0"
                title="Edit Build Name"
              >
                <IconEditCircle size="16" />
              </button>
              
              <!-- Klickbarer Namenstext -->
              <span 
                @click="startNameEdit"
                class="cursor-pointer hover:text-gray-300 transition-colors truncate"
              >
                {{ buildData.name || 'Unnamed Build' }}
              </span>
            </h3>
            
            <!-- Badge-Container für Level, Overrides und Archived - immer rechts -->
            <div class="flex items-center space-x-2 flex-shrink-0">
              <!-- Archived Badge - falls nötig -->
              <span 
                v-if="buildData.isArchived" 
                class="text-xs px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-300 whitespace-nowrap flex-shrink-0"
              >
                Archived
              </span>

              <!-- Overrides Badge - nur anzeigen wenn Overrides aktiv sind -->
              <span 
                v-if="hasOverrides" 
                class="text-xs pl-2 pr-1 py-0.5 bg-blue-900/50 rounded-full text-blue-300 whitespace-nowrap flex-shrink-0 flex items-center"
                title="Build uses custom overrides"
              >
                <IconAdjustmentsHorizontal size="12" class="mr-1" />
              </span>

              <!-- Level Tag -->
              <span class="text-xs bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-300 whitespace-nowrap flex-shrink-0">
                Lvl {{ buildData.level }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Inhalt: Statistiken und Ressourcen -->
      <div class="p-3 pb-0">
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
                'border-t-emerald-500': !['red', 'blue', 'green', 'purple', 'orange', 'yellow'].includes(hunterColor)
              }"
            ></div>
          </div>
          
          <!-- Loading Text -->
          <div class="text-sm text-gray-400">
            Evaluating build...
          </div>
        </div>
        
        <!-- Fehler-Zustand -->
        <div v-else-if="hasError" class="flex items-center justify-between mb-3">
          <div class="flex items-center text-red-400 text-sm">
            <IconAlertCircle size="16" class="mr-1.5" />
            <span>Evaluation error</span>
          </div>
          <button 
            @click="evaluateBuild"
            class="text-sm text-gray-300 hover:text-white underline"
          >
            Try again
          </button>
        </div>
        
        <!-- Ergebnisse -->
        <div v-else-if="results" class="flex flex-col space-y-3">
          <!-- Mobile Layout: Loot Score alleine in der ersten Reihe -->
          <div>
            <!-- Loot Score -->
            <div class="stat-box">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="flex items-center">
                    <IconReportMoney :size="14" class="text-amber-400" />
                    <div class="text-xs text-gray-400 ml-1.5">{{ resultLabels.lootPerMin || 'Loot' }}</div>
                    <InfoTooltip 
                      content="Overall Build Efficiency Rating that excludes pure loot bonuses (Ultima, etc). This allows for fair Build comparison, focusing only on the Build's core effectiveness."
                      placement="top"
                      class="ml-1"
                    />
                  </div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.lootPerMin"
                    :class="getDiffClasses(results.lootPerMin, referenceResults.lootPerMin, true, true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon(results.lootPerMin, referenceResults.lootPerMin)" size="10" class="mr-0.5" />
                    <span>{{ getDiffText(results.lootPerMin, referenceResults.lootPerMin) }}</span>
                  </span>
                </div>
                <div class="text-white text-lg font-medium text-center">{{ formatNumber(results.lootPerMin) }}</div>
              </div>
            </div>
          </div>

          <!-- Mobile Layout: Stage und Time nebeneinander in der zweiten Reihe -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Avg Stage -->
            <div class="stat-box">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="flex items-center">
                    <IconStairs :size="14" :class="`text-${hunterColor}-400`" />
                    <div class="text-xs text-gray-400 ml-1.5">{{ resultLabels.avgStage || 'Stage' }}</div>
                  </div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.avgStage"
                    :class="getAbsoluteDiffClasses(results.avgStage, referenceResults.avgStage, true, true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon(results.avgStage, referenceResults.avgStage)" size="10" class="mr-0.5" />
                    <span>{{ getAbsoluteDiffText(results.avgStage, referenceResults.avgStage) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatStage(results.avgStage, true) }}</div>
                <!-- Min-Max Stage Range hinzufügen -->
                <div class="text-xs text-gray-500 text-center">
                  {{ formatStage(results.minStage) }}-{{ formatStage(results.maxStage) }} (Range)
                </div>
              </div>
            </div>
            
            <!-- Avg Time -->
            <div class="stat-box">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="flex items-center">
                    <IconClock :size="14" class="text-blue-400" />
                    <div class="text-xs text-gray-400 ml-1.5">{{ resultLabels.avgTime || 'Time' }}</div>
                  </div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.avgTime"
                    :class="getTimeDiffClasses(results.avgTime, referenceResults.avgTime, true, true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon(referenceResults.avgTime, results.avgTime)" size="10" class="mr-0.5" />
                    <span>{{ getTimeDiffText(results.avgTime, referenceResults.avgTime) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatTime(results.avgTime) }}</div>
                <!-- Runs per Day unter der Zeit -->
                <div class="text-xs text-gray-500 text-center">
                  <span>{{ formatNumber(calculateRunsPerDay(results.avgTime)) }} Runs/day</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Material 1 -->
          <div class="resource-box" v-if="lootFilters.mat1">
            <!-- Neue Header Struktur: 2 Einheiten -->
            <div class="grid grid-cols-2 gap-2 mb-1">
              <!-- Erste Einheit: Label links und Run Diff rechts -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <!-- Benutze das custom Icon, wenn verfügbar, sonst das Standard-Icon -->
                  <img 
                    v-if="hasIcon('mat1')" 
                    :src="icons.mat1" 
                    alt="Material 1" 
                    class="mr-1.5 resource-image" 
                    :style="{ width: '20px', height: '20px' }" 
                  />
                  <IconDiamond v-else size="14" class="text-red-400 mr-1.5" />
                  <span class="text-xs text-gray-300 ml-1">{{ resultLabels.mat1 || 'Mat 1' }}</span>
                </div>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat1 && results.mat1"
                  :class="getDiffClasses(results.mat1, referenceResults.mat1, true, true)"
                  class="text-xs flex items-center"
                >
                  <component :is="getDiffIcon(results.mat1, referenceResults.mat1)" size="9" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat1, referenceResults.mat1) }}</span>
                </span>
              </div>
              
              <!-- Zweite Einheit: "per day" und Day Diff rechts -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400"></span>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat1 && referenceResults?.avgTime"
                  :class="getDiffClasses(calculatePerDay(results.mat1, results.avgTime), calculatePerDay(referenceResults.mat1, referenceResults.avgTime), true, true)"
                  class="text-xs flex items-center"
                >
                  <component :is="getDiffIcon(calculatePerDay(results.mat1, results.avgTime), calculatePerDay(referenceResults.mat1, referenceResults.avgTime))" size="9" class="mr-0.5" />
                  <span>{{ getDiffText(calculatePerDay(results.mat1, results.avgTime), calculatePerDay(referenceResults.mat1, referenceResults.avgTime)) }}</span>
                </span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="text-sm font-medium text-center">
                {{ formatNumber(results.mat1) }}
                <div class="text-xs text-gray-500">per run</div>
              </div>
              <div class="text-sm font-medium text-center">
                {{ formatNumber(calculatePerDay(results.mat1, results.avgTime)) }}
                <div class="text-xs text-gray-500">per day</div>
              </div>
            </div>
          </div>
          
          <!-- Material 2 -->
          <div class="resource-box" v-if="lootFilters.mat2">
            <!-- Neue Header Struktur: 2 Einheiten -->
            <div class="grid grid-cols-2 gap-2 mb-1">
              <!-- Erste Einheit: Label links und Run Diff rechts -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <!-- Benutze das custom Icon, wenn verfügbar, sonst das Standard-Icon -->
                  <img 
                    v-if="hasIcon('mat2')" 
                    :src="icons.mat2" 
                    alt="Material 2" 
                    class="mr-1.5 resource-image" 
                    :style="{ width: '20px', height: '20px' }" 
                  />
                  <IconHexagon v-else size="14" class="text-orange-400 mr-1.5" />
                  <span class="text-xs text-gray-300 ml-1">{{ resultLabels.mat2 || 'Mat 2' }}</span>
                </div>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat2 && results.mat2"
                  :class="getDiffClasses(results.mat2, referenceResults.mat2, true, true)"
                  class="text-xs flex items-center"
                >
                  <component :is="getDiffIcon(results.mat2, referenceResults.mat2)" size="9" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat2, referenceResults.mat2) }}</span>
                </span>
              </div>
              
              <!-- Zweite Einheit: "per day" und Day Diff rechts -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400"></span>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat2 && referenceResults?.avgTime"
                  :class="getDiffClasses(calculatePerDay(results.mat2, results.avgTime), calculatePerDay(referenceResults.mat2, referenceResults.avgTime), true, true)"
                  class="text-xs flex items-center"
                >
                  <component :is="getDiffIcon(calculatePerDay(results.mat2, results.avgTime), calculatePerDay(referenceResults.mat2, referenceResults.avgTime))" size="9" class="mr-0.5" />
                  <span>{{ getDiffText(calculatePerDay(results.mat2, results.avgTime), calculatePerDay(referenceResults.mat2, referenceResults.avgTime)) }}</span>
                </span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="text-sm font-medium text-center">
                {{ formatNumber(results.mat2) }}
                <div class="text-xs text-gray-500">per run</div>
              </div>
              <div class="text-sm font-medium text-center">
                {{ formatNumber(calculatePerDay(results.mat2, results.avgTime)) }}
                <div class="text-xs text-gray-500">per day</div>
              </div>
            </div>
          </div>
          
          <!-- Material 3 -->
          <div class="resource-box" v-if="lootFilters.mat3">
            <!-- Neue Header Struktur: 2 Einheiten -->
            <div class="grid grid-cols-2 gap-2 mb-1">
              <!-- Erste Einheit: Label links und Run Diff rechts -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <!-- Benutze das custom Icon, wenn verfügbar, sonst das Standard-Icon -->
                  <img 
                    v-if="hasIcon('mat3')" 
                    :src="icons.mat3" 
                    alt="Material 3" 
                    class="mr-1.5 resource-image" 
                    :style="{ width: '20px', height: '20px' }" 
                  />
                  <IconHexagons v-else size="14" class="text-amber-400 mr-1.5" />
                  <span class="text-xs text-gray-300 ml-1">{{ resultLabels.mat3 || 'Mat 3' }}</span>
                </div>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat3 && results.mat3"
                  :class="getDiffClasses(results.mat3, referenceResults.mat3, true, true)"
                  class="text-xs flex items-center"
                >
                  <component :is="getDiffIcon(results.mat3, referenceResults.mat3)" size="9" class="mr-0.5" />
                  <span>{{ getDiffText(results.mat3, referenceResults.mat3) }}</span>
                </span>
              </div>
              
              <!-- Zweite Einheit: "per day" und Day Diff rechts -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400"></span>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.mat3 && referenceResults?.avgTime"
                  :class="getDiffClasses(calculatePerDay(results.mat3, results.avgTime), calculatePerDay(referenceResults.mat3, referenceResults.avgTime), true, true)"
                  class="text-xs flex items-center"
                >
                  <component :is="getDiffIcon(calculatePerDay(results.mat3, results.avgTime), calculatePerDay(referenceResults.mat3, referenceResults.avgTime))" size="9" class="mr-0.5" />
                  <span>{{ getDiffText(calculatePerDay(results.mat3, results.avgTime), calculatePerDay(referenceResults.mat3, referenceResults.avgTime)) }}</span>
                </span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="text-sm font-medium text-center">
                {{ formatNumber(results.mat3) }}
                <div class="text-xs text-gray-500">per run</div>
              </div>
              <div class="text-sm font-medium text-center">
                {{ formatNumber(calculatePerDay(results.mat3, results.avgTime)) }}
                <div class="text-xs text-gray-500">per day</div>
              </div>
            </div>
          </div>

          <!-- Mobile Layout: XP - eine Zeile pro Materialtyp -->
          <div class="resource-box" v-if="lootFilters.xp">
            <!-- Neue Header Struktur: 2 Einheiten -->
            <div class="grid grid-cols-2 gap-2 mb-1">
              <!-- Erste Einheit: Label links und Run Diff rechts -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <!-- Benutze das custom Icon, wenn verfügbar, sonst das Standard-Icon -->
                  <img 
                    v-if="hasIcon('xp')" 
                    :src="icons.xp" 
                    alt="XP" 
                    class="mr-1.5 resource-image" 
                    :style="{ width: '20px', height: '20px' }" 
                  />
                  <IconBrightness v-else size="14" class="text-blue-400 mr-1.5" />
                  <span class="text-xs text-gray-300 ml-1">{{ resultLabels.xp || 'XP' }}</span>
                </div>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.xp && results.xp"
                  :class="getDiffClasses(results.xp, referenceResults.xp, true, true)"
                  class="text-xs flex items-center"
                >
                  <component :is="getDiffIcon(results.xp, referenceResults.xp)" size="9" class="mr-0.5" />
                  <span>{{ getDiffText(results.xp, referenceResults.xp) }}</span>
                </span>
              </div>
              
              <!-- Zweite Einheit: "per day" und Day Diff rechts -->
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400"></span>
                <span 
                  v-if="!isReferenceBuild && referenceResults?.xp && referenceResults?.avgTime"
                  :class="getDiffClasses(calculatePerDay(results.xp, results.avgTime), calculatePerDay(referenceResults.xp, referenceResults.avgTime), true, true)"
                  class="text-xs flex items-center"
                >
                  <component :is="getDiffIcon(calculatePerDay(results.xp, results.avgTime), calculatePerDay(referenceResults.xp, referenceResults.avgTime))" size="9" class="mr-0.5" />
                  <span>{{ getDiffText(calculatePerDay(results.xp, results.avgTime), calculatePerDay(referenceResults.xp, referenceResults.avgTime)) }}</span>
                </span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="text-sm font-medium text-center">
                {{ formatNumber(results.xp) }}
                <div class="text-xs text-gray-500">per run</div>
              </div>
              <div class="text-sm font-medium text-center">
                {{ formatNumber(calculatePerDay(results.xp, results.avgTime)) }}
                <div class="text-xs text-gray-500">per day</div>
              </div>
            </div>
          </div>
          
          <!-- Mobile Layout: Boss-Stats in einer Reihe -->
          <div class="flex gap-2" v-if="results.bossKillRate !== 0 || results.bossHpPercent !== 0">
            <!-- Boss HP mit Icon -->
            <div class="stat-box flex-1" v-if="results.bossHpPercent !== 0">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="flex items-center">
                    <IconHeartFilled :size="14" class="text-pink-400" />
                    <div class="text-xs text-gray-400 ml-1.5">
                      {{ resultLabels.bossHpPercent || 'Boss HP' }}
                    </div>
                  </div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.bossHpPercent && referenceResults.bossHpPercent !== 0"
                    :class="getBossStatDiffClasses((100 - results.bossHpPercent), (100 - referenceResults.bossHpPercent), true, true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon((100 - results.bossHpPercent), (100 - referenceResults.bossHpPercent))" size="9" class="mr-0.5" />
                    <span>{{ getBossStatDiffText(results.bossHpPercent, referenceResults.bossHpPercent) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatPercent(results.bossHpPercent) }}</div>
              </div>
            </div>

            <!-- Boss Kill Rate mit Icon -->
            <div class="stat-box flex-1" v-if="results.bossKillRate !== 0">
              <div class="flex flex-col">
                <div class="flex justify-between items-center mb-1">
                  <div class="flex items-center">
                    <IconSword :size="14" class="text-green-400" />
                    <div class="text-xs text-gray-400 ml-1.5">
                      {{ resultLabels.bossKillRate || 'Kill Rate' }}
                    </div>
                  </div>
                  <span 
                    v-if="!isReferenceBuild && referenceResults?.bossKillRate && referenceResults.bossKillRate !== 0"
                    :class="getBossStatDiffClasses(results.bossKillRate, referenceResults.bossKillRate, true, true)"
                    class="text-xs flex items-center"
                  >
                    <component :is="getDiffIcon(results.bossKillRate, referenceResults.bossKillRate)" size="9" class="mr-0.5" />
                    <span>{{ getBossStatDiffText(results.bossKillRate, referenceResults.bossKillRate) }}</span>
                  </span>
                </div>
                <div class="text-white text-sm font-medium text-center">{{ formatPercent(results.bossKillRate) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mobile Action Buttons: Kompakter mit kleineren Icons -->
      <div class="action-buttons p-2 bg-gray-800 border-t border-gray-700/40 flex items-center justify-between mt-2">
        <div class="flex flex-wrap justify-between w-full">
          <button 
            @click="emit('edit', buildData)"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Edit Build"
          >
            <IconEdit size="16" />
          </button>
          <button 
            @click="emit('clone', buildData)"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Clone Build"
          >
            <IconCopy size="16" />
          </button>
          <button 
            @click="emit('overridesBuild', buildData)"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Build Overrides"
          >
            <IconAdjustmentsHorizontal size="16" />
          </button>
          <button 
            @click="handleUpgradeComparison"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Upgrade Comparison"
          >
            <IconScale size="16" />
          </button>
          <button 
            v-if="enabledStats.includes('stageDistribution') && results?.stageDistribution?.length"
            @click="showDistributionModal = true"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Show Build Statistics"
          >
            <IconChartBar size="16" />
          </button>
          <button 
            @click="showCodeModal = true"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Share Build"
          >
            <IconShare size="16" />
          </button>
          <button 
            @click="handleReevaluate"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Re-evaluate Build"
          >
            <IconRefresh size="16" />
          </button>
          <button 
            @click="emit('archive', buildData)"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            :title="buildData.isArchived ? 'Restore Build' : 'Archive Build'"
          >
            <component :is="buildData.isArchived ? IconArchiveOff : IconArchive" size="16" />
          </button>
          <button
            v-if="!isLoading"
            @click="emit('delete', buildData)"
            class="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Delete Build"
          >
            <IconTrash size="16" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modals -->
    <BuildCodeModal :show="showCodeModal" :build="buildData" :results="results" @close="showCodeModal = false" />

    <!-- Statistics Modal -->
    <StatisticsModal 
      :show="showDistributionModal" 
      :build-name="buildData.name"
      :hunter-id="hunterId"       
      :build-id="buildData.id"
      :distribution="results?.stageDistribution"
      :death-distribution="results?.deathDistribution"
      :boss-kills-by-revive="results?.bossKillsByRevive"
      :avg-stage="results?.avgStage"
      :max-stage="results?.maxStage"
      :min-stage="results?.minStage"
      :sample-size="totalIterations"
      :build-stats="formattedBuildStats"  
      :color="hunterColor"
      @close="showDistributionModal = false"
    />

    <!-- UpgradeComparison Modal -->
    <UpgradeComparisonModal
      v-if="showUpgradeComparisonModal"
      :isVisible="showUpgradeComparisonModal"
      :hunterId="props.hunterId"
      :buildData="{...buildData, results}"
      @close="showUpgradeComparisonModal = false"
      @applyOverrides="handleApplyUpgradeOverrides"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, nextTick } from 'vue';
import { 
  IconAlertCircle, IconEditCircle, IconDotsVertical, IconEdit, IconCopy, 
  IconShare, IconRefresh, IconArchive, IconArchiveOff, IconTrash, 
  IconGripVertical, IconAdjustmentsHorizontal, IconChartBar, IconScale,
  IconBrightness, IconDiamond, IconHexagon, IconHexagons,
  IconReportMoney, IconStairs, IconClock, IconHeartFilled, IconSword 
} from '@tabler/icons-vue';
import { useRoute } from 'vue-router';
import { useBuildEvaluation } from '@/composables/useBuildEvaluation';
import { useLootIcons } from '@/composables/useLootIcons'; // Importiere useLootIcons
import { 
  formatNumber, formatStage, formatTime, formatPercent, getColorRGB,
  getDiffClasses, getDiffIcon, getDiffText,
  getAbsoluteDiffClasses, getAbsoluteDiffText,
  getTimeDiffClasses, getTimeDiffText,
  getBossStatDiffClasses, getBossStatDiffText,
  calculatePerDay, calculateRunsPerDay
} from '../../utils/BuildComparisonUtils';
import BuildCodeModal from '../../BuildCodeModal.vue';
import StatisticsModal from '@/components/common/StatisticsModal.vue';
import UpgradeComparisonModal from '@/components/common/UpgradeComparisonModal.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';

// Props
const props = defineProps({
  buildId: { type: String, required: true },
  hunterId: { type: String, required: true },
  buildData: { type: Object, required: true },
  autoEvaluate: { type: Boolean, default: true },
  index: { type: Number, default: -1 }
});

const emit = defineEmits([
  'edit', 'clone', 'archive', 'delete', 'nameChanged',
  'overrides', 'share', 'overridesBuild', 'evaluated', 'reevaluate',
  'updateBuild'
]);

// Route und Refs
const route = useRoute();
const menuContainer = ref(null);
const showMenu = ref(false);
const showCodeModal = ref(false);
const showDeleteConfirm = ref(false);
const showDistributionModal = ref(false);
const showUpgradeComparisonModal = ref(false);

// Name editing state
const isEditingName = ref(false);
const editableName = ref('');
const nameInputRef = ref(null);

const hasOverrides = computed(() => {
  return props.buildData.overrides && 
         Object.keys(props.buildData.overrides).length > 0;
});

// Display settings und Filter
const displaySettings = inject('displaySettings', ref({ 
  displayMode: 'compact',
  enabledStats: ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'],
  chartStyle: 'bar'
}));

// Verfügbare Statistiken basierend auf den Anzeigeeinstellungen
const enabledStats = computed(() => {
  return displaySettings.value?.enabledStats || ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'];
});

// Loot Filter injizieren
const lootFilters = inject('lootFilters', ref({
  mat1: true,
  mat2: true, 
  mat3: true,
  xp: true
}));

// Zusätzliche Imports und Logik für die Loot-Icons
const { icons, hasIcon } = useLootIcons(props.hunterId);

// Build-Evaluierung mit dem Composable
const {
  isLoading,
  hasError,
  results,
  resultLabels,
  progressIteration,
  totalIterations,
  progressPercent,
  isReferenceBuild,
  referenceResults,
  hunterColor,
  formattedBuildStats,
  evaluateBuild,
  handleReevaluate,
  loadHunterLabels,
  setupWatches,
  showToastMessage
} = useBuildEvaluation(props, emit);

// Handler für Upgrade-Vergleich
function handleUpgradeComparison() {
  showUpgradeComparisonModal.value = true;
}

// Handler für das Anwenden von Overrides aus dem UpgradeComparisonModal
function handleApplyUpgradeOverrides(payload) {
  // Wenn keine Daten übergeben wurden, nichts tun
  if (!payload || !payload.overrides) {
    return;
  }
  
  const { overrides, precomputedResults } = payload;
  
  // Erstelle eine Kopie des Build-Objekts mit den neuen Overrides
  const updatedBuild = {
    ...props.buildData,
    overrides: {
      ...(props.buildData.overrides || {}),
      ...(overrides || {})
    }
  };
  
  // Übergebene Overrides an den globalen Build-State senden
  emit('overridesBuild', updatedBuild);
  
  // Wenn vorberechnete Ergebnisse vorhanden sind, diese direkt übernehmen
  if (precomputedResults) {
    // Setze die vorberechneten Ergebnisse direkt in den Build
    updatedBuild.results = precomputedResults;
    emit('updateBuild', updatedBuild);
    showToastMessage('Upgrade changes applied to build');
  } else {
    // Nur neu evaluieren, wenn keine vorberechneten Ergebnisse vorhanden sind
    handleReevaluate();
    showToastMessage('Upgrade changes applied to build');
  }
}


// Schließe das Dropdown-Menü, wenn außerhalb geklickt wird
function handleClickOutside(event) {
  if (showMenu.value && menuContainer.value && !menuContainer.value.contains(event.target)) {
    showMenu.value = false;
  }
}

// Funktion zum Behandeln des Modal-Schließen-Events
function handleStatsModalClosed(event) {
  if (event.detail?.hunterType === props.hunterId && props.autoEvaluate) {
    evaluateBuild();
  }
}

// Start name editing
function startNameEdit() {
  editableName.value = props.buildData.name;
  isEditingName.value = true;
  nextTick(() => {
    if (nameInputRef.value) {
      nameInputRef.value.focus();
      nameInputRef.value.select();
    }
  });
}

// Save edited name
function saveName() {
  if (editableName.value && editableName.value !== props.buildData.name) {
    // Emit mit korrekter Struktur
    emit('nameChanged', {
      buildId: props.buildData.id,
      name: editableName.value
    });
  }
  isEditingName.value = false;
}

// Computed für aktuelle Iterationen
const actualIterations = computed(() => {
  return props.totalIterations || totalIterations.value || 1000;
});

// Watches einrichten
setupWatches();

// Lebenszyklusmethoden
onMounted(async () => {
  await loadHunterLabels();
  document.addEventListener('click', handleClickOutside);
  
  if (props.autoEvaluate) {
    setTimeout(() => {
      evaluateBuild();
    }, props.index * 100); 
  }

  // Event-Listener für Modal-Schließung
  window.addEventListener('statsModalClosed', handleStatsModalClosed);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('statsModalClosed', handleStatsModalClosed);
});
</script>

<style scoped>
.build-compact {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06);
}

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
}

.resource-image {
  object-fit: contain;
  display: inline-flex;
  vertical-align: middle;
}

@media (max-width: 640px) {
  .action-buttons button {
    padding: 0.5rem;
  }
  
  .stat-box, .resource-box {
    padding: 0.375rem;
  }
}
</style>