<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header with close button -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 sticky top-0 z-10 flex justify-between items-center">
        <h2 class="text-xl font-bold text-white flex items-center">
          <IconScale size="20" class="mr-2" :class="`text-${hunterColor}-400`" />
          Upgrade Efficiency: {{ hunterName }}
        </h2>
        <button 
          @click="$emit('close')"
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
        >
          <IconX size="18" />
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="p-6 flex flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-blue-500 mb-2"></div>
        <p class="text-gray-400 text-sm">Loading hunter data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="loadError" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ loadError }}</p>
        <button 
          @click="loadHunterData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Retry
        </button>
      </div>

      <!-- Modal content -->
      <div v-else class="p-5">
        <div class="text-sm text-gray-300 mb-4">
          Compare different upgrade combinations to find the best cost-efficiency.
        </div>

        <!-- Currency Tabs -->
        <div class="mb-4">
          <div class="flex border-b border-gray-700 overflow-x-auto">
            <div 
              v-for="currency in availableCurrencies" 
              :key="currency"
              @click="selectedCurrency = currency"
              :class="[
                'cursor-pointer whitespace-nowrap flex items-center',
                'px-4 py-2 md:px-4 md:py-2 sm:px-2 sm:py-1', // Reduzierte Abstände für mobile Geräte
                selectedCurrency === currency 
                  ? 'border-b-2 border-blue-500 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              ]"
            >
              <component 
                :is="getCurrencyIcon(currency)" 
                :size="16" 
                :class="`text-${getCurrencyColor(currency)} mr-1 md:mr-1.5`"
              />
              <span class="hidden md:inline">{{ currencyLabels[currency] }}</span>
              <span class="md:hidden text-xs">{{ currencyLabelsShort[currency] || currencyLabels[currency] }}</span>
            </div>
          </div>
        </div>

        <!-- Upgrade Scenarios -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Scenario 1 -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg">
            <div class="font-medium text-white mb-2 flex items-center">
              <IconCircle1 size="18" class="mr-1.5 text-blue-400" /> Scenario 1
            </div>
            <div class="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              <div 
                v-for="upgrade in getAvailableUpgrades(selectedCurrency)" 
                :key="upgrade.key" 
                class="flex flex-col"
              >
                <label class="text-gray-400 text-sm mb-1 flex items-center justify-between">
                  <span class="truncate">{{ upgrade.label }}</span>
                  <span v-if="upgrade.max" class="text-xs text-gray-500 ml-1">(max {{ upgrade.max }})</span>
                </label>
                <div class="flex items-center justify-between">
                  <!-- Build Value Display -->
                  <div class="flex items-center">
                    <div class="text-[10px] mr-2 uppercase" 
                        :class="isOverrideValue(upgrade.key) ? 'text-blue-400' : 'text-gray-400'">
                      {{ isOverrideValue(upgrade.key) ? 'override' : 'global' }}
                    </div>
                    <div class="text-xs" 
                        :class="isOverrideValue(upgrade.key) ? 'text-blue-300' : 'text-gray-300'">
                      {{ getBaseValue(upgrade.key) }}
                    </div>
                    <!-- Next Cost Display bleibt gleich -->
                    <div class="text-[10px] ml-3 text-yellow-400 uppercase">
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 0)) }}
                    </div>
                  </div>
                  
                  <!-- Increment Input with Arrows -->
                  <div class="flex items-center">
                    <div class="relative flex overflow-hidden rounded">
                      <button 
                        @click="decrementScenarioValue(0, upgrade.key)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-l-md"
                      >
                        <IconChevronLeft size="14" />
                      </button>
                      
                      <div 
                        class="w-10 text-center bg-gray-800 py-[1px] relative flex items-center justify-center h-6 border-y border-gray-600"
                      >
                        <span class="text-blue-400">
                          {{ scenarioIncrements[0][upgrade.key] || 0 }}
                        </span>
                      </div>
                      
                      <button 
                        @click="incrementScenarioValue(0, upgrade.key, upgrade.max)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-r-md"
                      >
                        <IconChevronRight size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-700">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Cost:</span>
                <span class="text-blue-400">{{ formatCost(calculateScenarioCost(0)) }}</span>
              </div>
            </div>
          </div>

          <!-- Scenario 2 -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg">
            <div class="font-medium text-white mb-2 flex items-center">
              <IconCircle2 size="18" class="mr-1.5 text-blue-400" /> Scenario 2
            </div>
            <div class="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              <div 
                v-for="upgrade in getAvailableUpgrades(selectedCurrency)" 
                :key="upgrade.key" 
                class="flex flex-col"
              >
                <label class="text-gray-400 text-sm mb-1 flex items-center justify-between">
                  <span class="truncate">{{ upgrade.label }}</span>
                  <span v-if="upgrade.max" class="text-xs text-gray-500 ml-1">(max {{ upgrade.max }})</span>
                </label>
                <div class="flex items-center justify-between">
                  <!-- Build Value Display -->
                  <div class="flex items-center">
                    <div class="text-[10px] mr-2 uppercase" 
                        :class="isOverrideValue(upgrade.key) ? 'text-blue-400' : 'text-gray-400'">
                      {{ isOverrideValue(upgrade.key) ? 'override' : 'global' }}
                    </div>
                    <div class="text-xs" 
                        :class="isOverrideValue(upgrade.key) ? 'text-blue-300' : 'text-gray-300'">
                      {{ getBaseValue(upgrade.key) }}
                    </div>
                    <!-- Next Cost Display bleibt gleich -->
                    <div class="text-[10px] ml-3 text-yellow-400 uppercase">
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 1)) }}
                    </div>
                  </div>
                  
                  <!-- Increment Input with Arrows -->
                  <div class="flex items-center">
                    <div class="relative flex overflow-hidden rounded">
                      <button 
                        @click="decrementScenarioValue(1, upgrade.key)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-l-md"
                      >
                        <IconChevronLeft size="14" />
                      </button>
                      
                      <div 
                        class="w-10 text-center bg-gray-800 py-[1px] relative flex items-center justify-center h-6 border-y border-gray-600"
                      >
                        <span class="text-blue-400">
                          {{ scenarioIncrements[1][upgrade.key] || 0 }}
                        </span>
                      </div>
                      
                      <button 
                        @click="incrementScenarioValue(1, upgrade.key, upgrade.max)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-r-md"
                      >
                        <IconChevronRight size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-700">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Cost:</span>
                <span class="text-blue-400">{{ formatCost(calculateScenarioCost(1)) }}</span>
              </div>
            </div>
          </div>

          <!-- Scenario 3 -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg">
            <div class="font-medium text-white mb-2 flex items-center">
              <IconCircle3 size="18" class="mr-1.5 text-blue-400" /> Scenario 3
            </div>
            <div class="space-y-3 max-h-[280px] overflow-y-auto pr-2">
              <div 
                v-for="upgrade in getAvailableUpgrades(selectedCurrency)" 
                :key="upgrade.key" 
                class="flex flex-col"
              >
                <label class="text-gray-400 text-sm mb-1 flex items-center justify-between">
                  <span class="truncate">{{ upgrade.label }}</span>
                  <span v-if="upgrade.max" class="text-xs text-gray-500 ml-1">(max {{ upgrade.max }})</span>
                </label>
                <div class="flex items-center justify-between">
                  <!-- Build Value Display -->
                  <div class="flex items-center">
                    <div class="text-[10px] mr-2 uppercase" 
                        :class="isOverrideValue(upgrade.key) ? 'text-blue-400' : 'text-gray-400'">
                      {{ isOverrideValue(upgrade.key) ? 'override' : 'global' }}
                    </div>
                    <div class="text-xs" 
                        :class="isOverrideValue(upgrade.key) ? 'text-blue-300' : 'text-gray-300'">
                      {{ getBaseValue(upgrade.key) }}
                    </div>
                    <!-- Next Cost Display bleibt gleich -->
                    <div class="text-[10px] ml-3 text-yellow-400 uppercase">
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 2)) }}
                    </div>
                  </div>
                  
                  <!-- Increment Input with Arrows -->
                  <div class="flex items-center">
                    <div class="relative flex overflow-hidden rounded">
                      <button 
                        @click="decrementScenarioValue(2, upgrade.key)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-l-md"
                      >
                        <IconChevronLeft size="14" />
                      </button>
                      
                      <div 
                        class="w-10 text-center bg-gray-800 py-[1px] relative flex items-center justify-center h-6 border-y border-gray-600"
                      >
                        <span class="text-blue-400">
                          {{ scenarioIncrements[2][upgrade.key] || 0 }}
                        </span>
                      </div>
                      
                      <button 
                        @click="incrementScenarioValue(2, upgrade.key, upgrade.max)"
                        class="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-r-md"
                      >
                        <IconChevronRight size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-700">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Cost:</span>
                <span class="text-blue-400">{{ formatCost(calculateScenarioCost(2)) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loot Collection Time Table -->
        <div class="mt-6">
          <div class="text-lg text-white mb-3 flex items-center">
            <IconClock size="20" class="mr-2 text-blue-400" />
            Loot Collection Time
            <span class="ml-2 text-xs text-gray-400">(not applicable for Fragments)</span>
          </div>
          
          <!-- Container mit responsiver Breite -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg overflow-x-auto md:max-w-lg">
            <table class="w-full text-sm">
              <colgroup>
                <col class="w-[25%]" /> <!-- Scenario -->
                <col class="w-[25%]" /> <!-- Cost -->
                <!--<col class="w-[20%]" />  Runs Needed -->
                <col class="w-[40%]" /> <!-- Collection Time -->
              </colgroup>
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="py-2 px-4 text-left text-gray-400">Scenario</th>
                  <th class="py-2 px-6 text-left text-gray-400">Cost</th>
                  <!--<th class="py-2 px-6 text-center text-gray-400">Runs Needed</th>-->
                  <th class="py-2 px-6 text-right text-gray-400">Collection Time</th>
                </tr>
              </thead>
              <tbody>
                <!-- Eine Zeile für jedes Szenario -->
                <tr 
                  v-for="(_, index) in scenarios" 
                  :key="`time-${index}`"
                  :class="[
                    'border-gray-700',
                    index < scenarios.length - 1 ? 'border-b' : ''
                  ]"
                >
                  <td class="py-2 px-4 text-gray-300 font-medium">
                    {{ index + 1 }}
                  </td>
                  <td class="py-2 px-6 text-left text-white">
                    {{ formatCost(scenarioCosts[index]) }} 
                  </td>
                  <!--<td class="py-2 px-6 text-center text-gray-300">
                    {{ calculateRunsNeeded(index) }}
                  </td>-->
                  <td class="py-2 px-6 text-right">
                    {{ formatCollectionTime(getCollectionTimeInMinutes(index)) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Compare Button -->
        <div class="mt-6 flex justify-center">
          <button 
            @click="() => compareScenarios(scenarioIncrements, getBaseValue, calculateScenarioCost)"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
            :disabled="isEvaluating || !hasAnyChanges"
          >
            <IconScale v-if="!isEvaluating" size="20" class="mr-2" />
            <IconLoader2 v-else size="20" class="mr-2 animate-spin" />
            {{ isEvaluating ? 'Evaluating...' : 'Compare Scenarios' }}
          </button>
        </div>

        <!-- Fortschrittsanzeige während der Evaluierung -->
        <div v-if="isEvaluating" class="mt-6 flex flex-col items-center justify-center py-8 space-y-3">
          <div v-if="isEvaluating" class="mt-6 flex flex-col items-center justify-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-blue-500"></div>
            <div class="mt-3 text-sm text-gray-400">Evaluating scenarios...</div>
          </div>
        </div>

        <!-- Results -->
        <div v-if="comparisonResults.length > 0 && !hideResults" class="mt-6 results-container">
          <div class="text-lg text-white mb-3 flex items-center">
            <IconChartPie size="20" class="mr-2 text-blue-400" />
            Results
          </div>
          
          <!-- Table container with scroll -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="sticky top-0 bg-gray-850 z-10">
                <tr class="border-b border-gray-700">
                  <th class="py-2 px-4 text-left text-gray-400">Metric</th>
                  <th class="py-2 px-6 text-right bg-gray-800/50">
                    Original
                  </th>
                  <th 
                    v-for="(result, i) in comparisonResults" 
                    :key="`result-${i}`" 
                    class="py-2 px-6 text-right"
                  >
                    Scenario {{ i + 1 }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <!-- Avg Stage -->
                <tr class="border-b border-gray-700">
                  <td class="py-2 px-4 text-gray-300">Avg Stage</td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? originalResults.avgStage.toFixed(1) : '-' }}
                  </td>
                  <td 
                    v-for="result in comparisonResults" 
                    :key="`stage-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'avgStage', true)"
                  >
                    {{ result.avgStage.toFixed(1) }}
                    <div v-if="originalResults" class="text-xs" :class="getDiffClass(result.avgStage, originalResults.avgStage)">
                      {{ formatDiff(result.avgStage, originalResults.avgStage) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Loot Score -->
                <tr class="border-b border-gray-700">
                  <td class="py-2 px-4 text-gray-300">Loot Score</td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatNumber(originalResults.lootPerMin) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`loot-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'lootPerMin', true)"
                  >
                    {{ formatNumber(result.lootPerMin) }}
                    <div v-if="originalResults" class="text-xs" :class="getDiffClass(result.lootPerMin, originalResults.lootPerMin)">
                      {{ formatDiffPercent(result.lootPerMin, originalResults.lootPerMin) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Material 1 (z.B. Obsidian) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat1', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <IconDiamond size="14" class="mr-1.5 text-red-400" />
                      {{ getMaterialLabel('mat1') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat1 || 0) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat1-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat1', true)"
                  >
                    {{ formatMaterialPerDay(result.mat1 || 0) }}
                    <div v-if="originalResults?.mat1" class="text-xs" 
                        :class="getDiffClass(calculatePerDay(result.mat1, result), calculatePerDay(originalResults.mat1, originalResults))">
                      {{ formatDayDiffPercent(result.mat1, originalResults.mat1, result) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Material 2 (z.B. Behlium) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat2', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <IconHexagon size="14" class="mr-1.5 text-orange-400" />
                      {{ getMaterialLabel('mat2') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat2 || 0) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat2-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat2', true)"
                  >
                    {{ formatMaterialPerDay(result.mat2 || 0) }}
                    <div v-if="originalResults?.mat2" class="text-xs" 
                        :class="getDiffClass(calculatePerDay(result.mat2, result), calculatePerDay(originalResults.mat2, originalResults))">
                      {{ formatDayDiffPercent(result.mat2, originalResults.mat2, result) }}
                    </div>
                  </td>
                </tr>

                <!-- Material 3 (z.B. Biomatter) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat3', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <IconHexagons size="14" class="mr-1.5 text-amber-400" />
                      {{ getMaterialLabel('mat3') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat3 || 0) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat3-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat3', true)"
                  >
                    {{ formatMaterialPerDay(result.mat3 || 0) }}
                    <div v-if="originalResults?.mat3" class="text-xs" 
                        :class="getDiffClass(calculatePerDay(result.mat3, result), calculatePerDay(originalResults.mat3, originalResults))">
                      {{ formatDayDiffPercent(result.mat3, originalResults.mat3, result) }}
                    </div>
                  </td>
                </tr>
                
                <!-- XP (per Day) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('xp', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <IconBrightness size="14" class="mr-1.5 text-blue-400" />
                      XP (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.xp || 0) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`xp-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'xp', true)"
                  >
                    {{ formatMaterialPerDay(result.xp || 0) }}
                    <div v-if="originalResults?.xp" class="text-xs" 
                        :class="getDiffClass(calculatePerDay(result.xp, result), calculatePerDay(originalResults.xp, originalResults))">
                      {{ formatDayDiffPercent(result.xp, originalResults.xp, result) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Costs -->
                <tr>
                  <td class="py-2 px-4 text-gray-300">Costs</td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    0
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`cost-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getLowestCostClass(result.index)"
                  >
                    {{ formatCost(scenarioCosts[result.index]) }}
                  </td>
                </tr>

                <!-- Apply Buttons -->
                <tr>
                  <td class="py-2 px-4 text-gray-300"></td>
                  <td class="py-2 px-6 text-right bg-gray-800/50"></td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`apply-${result.index}`" 
                    class="py-2 px-6 text-right"
                  >
                    <button
                      @click="applyScenario(result.index)"
                      class="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded transition-colors flex items-center ml-auto"
                    >
                      <IconCheck size="14" class="mr-1" />
                      Apply to Build
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { 
  IconX, IconScale, IconChartBar, IconChartPie, IconBulb, 
  IconCheck, IconLoader2, IconCircle1, IconCircle2, IconCircle3,
  IconDiamond, IconHexagon, IconHexagons, IconPuzzle,
  IconAlertCircle, IconChevronLeft, IconChevronRight,
  IconBrightness, IconClock, IconBug
} from '@tabler/icons-vue';
import { useHunterStore } from '../../store/hunterStore';
import { getHunterById } from '../../constants/hunters';
import { UPGRADES } from '../../constants/upgrades';
import { calcCostDifference, formatCost } from '../../utils/statCostUtils';
import { calcRelicCostDifference } from '../../utils/relicCostUtils';
import { calcGadgetCostDifference } from '../../utils/gadgetCostUtils';
import { 
  formatNumber, formatStage, formatPercent, formatTime,
  getDiffClasses, getDiffIcon, getDiffText,
  getAbsoluteDiffClasses, getAbsoluteDiffText, 
} from '../../components/builds/utils/BuildComparisonUtils';
import { useBuildEvaluation } from '../../composables/useBuildEvaluation';

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  hunterId: { type: String, required: true },
  buildData: { type: Object, required: true }
});

const emit = defineEmits(['close', 'applyOverrides']);

// Store
const hunterStore = useHunterStore();

// UI State
const isLoading = ref(true);
const loadError = ref(null);
const selectedCurrency = ref('');

// Szenarien (3 mögliche Upgrade-Pfade)
const scenarios = ref([{}, {}, {}]);
const scenarioIncrements = ref([{}, {}, {}]);
const scenarioCosts = ref([0, 0, 0]);
const recommendation = ref('');
const recommendedScenario = ref(null);
const originalResults = ref(null);



// Hunter und Upgrade-Parameter
const hunterModule = ref(null);
const availableCurrencies = ref([]);
const currencyLabels = ref({});
const currencyLabelsShort = ref({}); 
const upgradesByCurrency = ref({});

// Hunter-Informationen aus den Konstanten holen
const hunterInfo = computed(() => getHunterById(props.hunterId));
const hunterName = computed(() => hunterInfo.value.name);
const hunterColor = computed(() => hunterInfo.value.color);

const hideResults = ref(false);

const { 
  evaluateBuildWithParams, 
  compareScenarios,
  comparisonResults,
  isEvaluating
} = useBuildEvaluation(props, emit);


// Computed, um zu prüfen, ob es irgendwelche Änderungen in den Szenarien gibt
const hasAnyChanges = computed(() => {
  return scenarioIncrements.value.some(scenario => {
    return Object.values(scenario).some(val => val > 0);
  });
});

// Hunter-Daten und Upgrades laden
async function loadHunterData() {
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // Hunter-Modul dynamisch laden
    const currentHunter = hunterInfo.value;
    if (!currentHunter) {
      throw new Error(`Hunter not found: ${props.hunterId}`);
    }
    
    // Hunter-Modul importieren über die statsModule-Funktion
    hunterModule.value = await currentHunter.statsModule();
    
    if (!hunterModule.value || !hunterModule.value.CURRENCY_TYPES) {
      throw new Error(`Required constants missing for hunter: ${props.hunterId}`);
    }
    
    // Konstanten extrahieren
    currencyLabels.value = hunterModule.value.CURRENCY_LABELS || {};
    currencyLabelsShort.value = hunterModule.value.CURRENCY_LABELS_SHORT || {};
    upgradesByCurrency.value = hunterModule.value.UPGRADES_BY_CURRENCY || {};
    availableCurrencies.value = Object.keys(upgradesByCurrency.value);
    
    // Stelle sicher, dass Hunter im Store initialisiert ist
    await hunterStore.initHunterConfig(props.hunterId);
    
    // Standard-Währung auswählen
    if (availableCurrencies.value.length > 0) {
      selectedCurrency.value = availableCurrencies.value[0];
    }

    // Szenarien initialisieren
    initializeScenarios();
    
    // Nehme die vorhandenen Ergebnisse direkt aus dem buildData
    if (props.buildData.results) {
      console.log('Using existing results:', props.buildData.results);
      originalResults.value = props.buildData.results;
    } else {
      console.warn('No results found in buildData');
    }
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error loading hunter data:', error);
    loadError.value = `Failed to load hunter data: ${error.message}`;
    isLoading.value = false;
  }
}

// Szenarien auf Basis der globalen Werte initialisieren
function initializeScenarios() {
  // Für jede Währung alle Szenarien mit globalen Werten initialisieren
  availableCurrencies.value.forEach(currency => {
    upgradesByCurrency.value[currency]?.forEach(upgrade => {
      // Globalen Wert für dieses Upgrade ermitteln
      const globalValue = getBaseValue(upgrade.key);
      
      // Startwerte für alle Szenarien setzen
      scenarios.value.forEach((scenario, index) => {
        scenario[upgrade.key] = globalValue;
        scenarioIncrements.value[index][upgrade.key] = 0;
      });
    });
  });

  // Kostenberechnung aktualisieren
  calculateAllScenarioCosts();
}

// Prüft, ob ein Wert aus den Build-Overrides stammt
function isOverrideValue(key) {
  return props.buildData?.overrides && props.buildData.overrides[key] !== undefined;
}

// holt entweder den globalen oder override wert aus dem store
function getBaseValue(key) {
  // Zuerst nach Overrides in buildData schauen
  if (props.buildData?.overrides && props.buildData.overrides[key] !== undefined) {
    return props.buildData.overrides[key];
  }
  
  // Wenn kein Override vorhanden, auf Store-Werte zurückgreifen
  // Für Upgrades
  if (key.startsWith('upgrades.')) {
    const parts = key.split('.');
    const upgradeType = parts[1]; // z.B. "relics"
    const upgradeId = parts[2];   // z.B. "r4"
    
    // Upgrade-Wert aus dem Store holen
    return hunterStore.upgrades?.[upgradeType]?.[upgradeId] || 0;
  }
  
  // Für Basis-Stats
  return hunterStore.hunterStats?.[props.hunterId]?.[key] || 0;
}

// Berechnet die Kosten für ein Szenario
function calculateScenarioCost(scenarioIndex) {
  const currency = selectedCurrency.value;
  if (!currency) return 0;
  
  let totalCost = 0;
  
  upgradesByCurrency.value[currency]?.forEach(upgrade => {
    const baseValue = getBaseValue(upgrade.key);
    const incrementValue = scenarioIncrements.value[scenarioIndex][upgrade.key] || 0;
    
    if (incrementValue > 0) {
      // Je nach Upgrade-Typ unterschiedliche Kostenfunktionen verwenden
      if (upgrade.key.startsWith('upgrades.relics.')) {
        // Relic-Kosten
        const relicId = upgrade.key.split('.')[2]; // Extrahiert 'r4'
        let relicType;
        
        // Mapping von Relic IDs zu den entsprechenden Typen in relicCostUtils
        switch(relicId) {
          case 'r4': relicType = 'relic04'; break;
          case 'r7': relicType = 'relic07'; break;
          case 'r16': relicType = 'relic16'; break;
          case 'r17': relicType = 'relic17'; break;
          case 'r19': relicType = 'relic19'; break;
          default: return 0; // Relictyp nicht erkannt
        }
        
        totalCost += calcRelicCostDifference(relicType, baseValue, baseValue + incrementValue);
      } else if (upgrade.key.startsWith('upgrades.gadgets.')) {
        // Gadget-Kosten
        const gadgetId = upgrade.key.split('.')[2]; // Extrahiert 'anchor'
        totalCost += calcGadgetCostDifference(gadgetId, baseValue, baseValue + incrementValue);
      } else {
        // Stat-Kosten (basierend auf statCostUtils)
        totalCost += calcCostDifference(
          upgrade.key,
          baseValue, 
          baseValue + incrementValue, 
          props.hunterId
        );
      }
    }
  });
  
  return totalCost;
}

// Berechnet alle Szenario-Kosten
function calculateAllScenarioCosts() {
  scenarioCosts.value = scenarios.value.map((_, index) => calculateScenarioCost(index));
}

// Funktionen für die Inkrementierung von Szenariowerten mit den Pfeilen
function incrementScenarioValue(scenarioIndex, key, maxValue) {
  // Stelle sicher, dass der aktuelle Wert initialisiert ist
  if (!scenarioIncrements.value[scenarioIndex][key]) {
    scenarioIncrements.value[scenarioIndex][key] = 0;
  }
  
  // Berechne den globalen Wert und das Maximum
  const globalValue = getBaseValue(key);
  const max = maxValue !== undefined ? maxValue : Infinity;
  const currentIncrement = scenarioIncrements.value[scenarioIndex][key];
  
  // Erhöhe den Wert um 1, wenn das Maximum nicht erreicht ist
  if (globalValue + currentIncrement < max) {
    scenarioIncrements.value[scenarioIndex][key] += 1;
  }
}

function decrementScenarioValue(scenarioIndex, key) {
  // Stelle sicher, dass der aktuelle Wert initialisiert ist
  if (!scenarioIncrements.value[scenarioIndex][key]) {
    scenarioIncrements.value[scenarioIndex][key] = 0;
  }
  
  // Verringere den Wert, aber nicht unter 0
  if (scenarioIncrements.value[scenarioIndex][key] > 0) {
    scenarioIncrements.value[scenarioIndex][key] -= 1;
  }
}


// Analysiert die Ergebnisse und ermittelt die beste Option
function analyzeResults() {
  if (comparisonResults.value.length === 0) return;
  
  // Einfache Effizienz-Metrik: Loot pro Kosten
  const efficiencies = comparisonResults.value.map((result, index) => {
    if (!result) return { index, lootPerCost: 0, lootPerMin: 0, avgStage: 0, cost: 0 };
    
    return {
      index,
      lootPerCost: result.lootPerMin / scenarioCosts.value[index],
      lootPerMin: result.lootPerMin,
      avgStage: result.avgStage,
      cost: scenarioCosts.value[index]
    };
  }).filter(e => e.lootPerCost > 0);
  
  // Nach Effizienz sortieren
  efficiencies.sort((a, b) => b.lootPerCost - a.lootPerCost);
  
  // Keine validen Ergebnisse
  if (efficiencies.length === 0) {
    recommendation.value = "No valid scenarios found for comparison.";
    recommendedScenario.value = null;
    return;
  }
  
  // Bestes Szenario speichern
  recommendedScenario.value = efficiencies[0].index;
  
  // Empfehlung formulieren
  const bestOption = efficiencies[0];
  const currency = currencyLabels.value[selectedCurrency.value];
  
  recommendation.value = `Scenario ${bestOption.index + 1} offers the best value with ${formatNumber(bestOption.lootPerMin)} loot per minute at a cost of ${formatCost(bestOption.cost)} ${currency}.`;
  
  if (efficiencies.length > 1) {
    const secondBest = efficiencies[1];
    const lootDiff = ((bestOption.lootPerMin / secondBest.lootPerMin) - 1) * 100;
    const costDiff = ((secondBest.cost / bestOption.cost) - 1) * 100;
    
    if (lootDiff > 10 || costDiff > 15) {
      recommendation.value += ` This is significantly better than Scenario ${secondBest.index + 1} (${lootDiff.toFixed(1)}% more loot for ${costDiff > 0 ? costDiff.toFixed(1) + '% less' : Math.abs(costDiff).toFixed(1) + '% more'} cost).`;
    } else {
      recommendation.value += ` However, Scenario ${secondBest.index + 1} with ${formatNumber(secondBest.lootPerMin)} loot at ${formatCost(secondBest.cost)} ${currency} is also a good option.`;
    }
  }
}

// Style-Hilfsfunktionen für die Ergebnistabelle (aktualisiert)
function getBestValueClass(index, field, includeOriginal = false) {
  if (comparisonResults.value.length === 0) return '';
  
  // Nur die Ergebnisse aus den Szenarien berücksichtigen, nicht das Original
  const values = comparisonResults.value.map(result => result[field]);
  
  if (values.length === 0) return '';
  
  const maxValue = Math.max(...values);
  
  // Suche das Ergebnis mit dem entsprechenden Index
  const result = comparisonResults.value.find(r => r.index === index);
  
  // Nur der höchste Wert soll grün dargestellt werden
  return result && result[field] === maxValue ? 'text-green-400' : '';
}

function getLowestCostClass(index) {
  if (scenarioCosts.value.length <= 1) return '';
  
  const validCosts = scenarioCosts.value.filter(cost => cost > 0);
  if (validCosts.length === 0) return '';
  
  const minCost = Math.min(...validCosts);
  
  return scenarioCosts.value[index] === minCost ? 'text-green-400' : '';
}

// Berechnet Werte pro Tag basierend auf der durchschnittlichen Run-Zeit
function calculatePerDay(value, resultObj) {
  if (!value) return 0;
  
  // Verwende die avgTime aus dem übergebenen Ergebnisobjekt oder Fallback
  const avgRunTimeMinutes = resultObj?.avgTime || originalResults.value?.avgTime || 120;
  const runsPerDay = 1440 / avgRunTimeMinutes; // 1440 Minuten pro Tag
  
  return value * runsPerDay;
}

// Neutraler Stil für Differenzwerte, immer weiß
function getDiffClass(value, baseValue) {
  // Immer weiß zurückgeben, unabhängig vom Wert
  return 'text-white';
}

// Zusätzlich die Formatierung für die Prozentanzeige bei Tageswerten
function formatDiffPercent(value, baseValue) {
  if (!value || !baseValue) return '±0%';
  if (value === baseValue) return '±0%';
  
  // Beide Werte repräsentieren bereits Tageswerte in der Tabelle,
  // daher direkter Vergleich ohne weitere Umrechnung
  const diff = ((value / baseValue) - 1) * 100;
  return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
}

// Spezielle Funktion für Prozente im Tageswert-Vergleich
function formatDayDiffPercent(resultValue, originalValue, resultObj) {
  // Zunächst in Tageswerte umrechnen - unterschiedliche avgTime pro Szenario
  const dayValue = calculatePerDay(resultValue, resultObj);
  const dayBaseValue = calculatePerDay(originalValue, originalResults.value);
  
  if (!dayValue || !dayBaseValue) return '±0%';
  if (dayValue === dayBaseValue) return '±0%';
  
  const diff = ((dayValue / dayBaseValue) - 1) * 100;
  return diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`;
}

// Auch Absolutwert-Differenzen immer weiß darstellen
function formatDiff(value, baseValue) {
  if (value === baseValue) return '±0';
  const diff = value - baseValue;
  return diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
}

// Icons für die Währungen
function getCurrencyIcon(currencyType) {
  const icons = {
    'mat1': IconDiamond,
    'mat2': IconHexagon, 
    'mat3': IconHexagons,
    'frags': IconPuzzle
  };
  
  return icons[currencyType] || IconDiamond;
}

// Farbe für die Währungs-Icons
function getCurrencyColor(currencyType) {
  const colors = {
    'mat1': 'red-400',
    'mat2': 'orange-400',
    'mat3': 'amber-400',
    'frags': 'blue-400'
  };
  
  return colors[currencyType] || 'white';
}

// Hilfsfunktion um zu prüfen, ob ein bestimmter Loot-Typ in den Ergebnissen vorhanden ist
function hasLootProperty(property, includeOriginal = false) {
  const inScenarios = comparisonResults.value.some(result => {
    return result && result[property] && result[property] > 0;
  });
  
  if (includeOriginal && originalResults.value && originalResults.value[property] > 0) {
    return true;
  }
  
  return inScenarios;
}

// Hilfsfunktion um die hunter-spezifischen Materialnamen zu erhalten
function getMaterialLabel(property) {
  if (!hunterModule.value?.EVAL_RESULT_LABELS) {
    // Fallback Namen
    const fallbackLabels = {
      'mat1': 'Material 1',
      'mat2': 'Material 2', 
      'mat3': 'Material 3',
      'xp': 'XP'
    };
    return fallbackLabels[property] || property;
  }
  
  // Hunter-spezifische Labels aus dem Modul zurückgeben
  return hunterModule.value.EVAL_RESULT_LABELS[property] || property;
}

// Funktion, um Upgrades zu filtern, die noch nicht das Maximum erreicht haben
function getAvailableUpgrades(currency) {
  if (!currency || !upgradesByCurrency.value[currency]) return [];
  
  return upgradesByCurrency.value[currency].filter(upgrade => {
    // Globalen Wert ermitteln
    const globalValue = getBaseValue(upgrade.key);
    // Wenn kein Maximum definiert ist, immer anzeigen
    if (upgrade.max === undefined) return true;
    // Sonst nur anzeigen, wenn das Maximum noch nicht erreicht ist
    return globalValue < upgrade.max;
  });
}

// Funktion zum Formatieren der Tageswerte für Materialien und XP
function formatMaterialPerDay(value) {
  if (!value) return '0';
  
  // Wenn keine avgTime vorhanden ist, Fallback auf 2h (120 Minuten)
  const avgRunTimeMinutes = originalResults.value?.avgTime || 120;
  
  // Berechne die Anzahl der Runs pro Tag
  const runsPerDay = 1440 / avgRunTimeMinutes; // 1440 Minuten pro Tag
  
  // Berechne den Wert pro Tag
  const valuePerDay = value * runsPerDay;
  
  return formatNumber(valuePerDay);
}

// Berechnet die Kosten für ein einzelnes Upgrade-Level
// Berechnet die Kosten für ein einzelnes Upgrade-Level, unter Berücksichtigung der Szenario-Inkremente
function getNextUpgradeCost(key, scenarioIndex = -1) {
  // Basiswert ist der globale Wert
  const baseValue = getBaseValue(key);
  
  // Wenn ein Szenario angegeben ist, addiere die aktuellen Inkremente dieses Szenarios
  const currentIncrements = scenarioIndex >= 0 ? 
    (scenarioIncrements.value[scenarioIndex][key] || 0) : 0;
  
  // Der Wert, für den wir die nächsten Kosten berechnen wollen
  const currentValue = baseValue + currentIncrements;
  
  // Je nach Upgrade-Typ unterschiedliche Kostenfunktionen verwenden
  if (key.startsWith('upgrades.relics.')) {
    // Relic-Kosten
    const relicId = key.split('.')[2]; // Extrahiert 'r4'
    let relicType;
    
    // Mapping von Relic IDs zu den entsprechenden Typen in relicCostUtils
    switch(relicId) {
      case 'r4': relicType = 'relic04'; break;
      case 'r7': relicType = 'relic07'; break;
      case 'r16': relicType = 'relic16'; break;
      case 'r17': relicType = 'relic17'; break;
      case 'r19': relicType = 'relic19'; break;
      default: return 0; // Relictyp nicht erkannt
    }
    
    return calcRelicCostDifference(relicType, currentValue, currentValue + 1);
  } else if (key.startsWith('upgrades.gadgets.')) {
    // Gadget-Kosten
    const gadgetId = key.split('.')[2]; // Extrahiert 'anchor'
    return calcGadgetCostDifference(gadgetId, currentValue, currentValue + 1);
  } else {
    // Stat-Kosten (basierend auf statCostUtils)
    return calcCostDifference(
      key,
      currentValue, 
      currentValue + 1, 
      props.hunterId
    );
  }
}

// Verbindung zwischen Währungstypen und Materialien herstellen
function getCurrencyMaterial(currencyType) {
  // Mapping von Währungen zu Materialen
  const currencyMaterials = {
    'mat1': 'mat1',
    'mat2': 'mat2',
    'mat3': 'mat3'
  };
  
  return currencyMaterials[currencyType];
}

// Berechnungsfunktion für die Zeit - korrekt mit avgTime
function getCollectionTimeInMinutes(scenarioIndex) {
  const cost = scenarioCosts.value[scenarioIndex];
  if (cost <= 0) return 0;
  
  const currencyType = selectedCurrency.value;
  const materialType = getCurrencyMaterial(currencyType);
  
  if (!materialType || !originalResults.value || !originalResults.value[materialType]) {
    return Infinity; // Kann nicht berechnet werden
  }
  
  // Material pro Run
  const materialPerRun = originalResults.value[materialType];
  if (materialPerRun <= 0) return Infinity;
  
  // Run-Dauer aus avgTime nehmen
  const avgRunTimeMinutes = originalResults.value.avgTime || 120; // Fallback auf 2h wenn nicht vorhanden
  
  // Anzahl benötigter Runs
  const runsNeeded = cost / materialPerRun;
  
  // Gesamtzeit in Minuten
  return runsNeeded * avgRunTimeMinutes;
}

// Formatierung der Zeit in Tagen, Stunden, Minuten - mit Jahren
function formatCollectionTime(minutes) {
  if (!isFinite(minutes) || minutes <= 0) return '-';
  
  // Prüfen ob über 100 Jahre (100 * 365 Tage * 1440 Minuten)
  if (minutes > 52560000) { // 100 Jahre in Minuten
    return 'Not in your lifetime';
  }
  
  // Umrechnung in Zeiteinheiten
  const years = Math.floor(minutes / 525600); // 365 Tage * 1440 Minuten
  const days = Math.floor((minutes % 525600) / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.floor(minutes % 60);
  
  // Formatierung basierend auf der längsten Zeiteinheit
  if (years > 0) {
    return `${years}y ${days}d`; 
  } else if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else {
    return `${mins}m`;
  }
}

// Berechnete Runs für ein Szenario
function calculateRunsNeeded(scenarioIndex) {
  const cost = scenarioCosts.value[scenarioIndex];
  if (cost <= 0) return '0';
  
  const currencyType = selectedCurrency.value;
  const materialType = getCurrencyMaterial(currencyType);
  
  if (!materialType || !originalResults.value || !originalResults.value[materialType]) {
    return 'N/A';
  }
  
  // Material pro Run
  const materialPerRun = originalResults.value[materialType];
  if (materialPerRun <= 0) return 'N/A';
  
  // Runs berechnen und auf 1 Dezimalstelle formatieren
  const runsNeeded = cost / materialPerRun;
  return runsNeeded.toFixed(1);
}

// Ändere die applyScenario-Funktion
function applyScenario(scenarioIndex) {
  const overrides = {};
  
  // Änderungen als Overrides erfassen
  Object.entries(scenarioIncrements.value[scenarioIndex]).forEach(([key, increment]) => {
    if (increment <= 0) return;
    
    const baseValue = getBaseValue(key);
    overrides[key] = baseValue + increment;
  });

  
  // Das Ergebnis des ausgewählten Szenarios finden
  // Hier verwendest du scenarioIndex statt index!
  const selectedResult = comparisonResults.value.find(result => result.index === scenarioIndex);
  
  // Overrides und bereits berechnete Ergebnisse an den Parent-Komponenten senden
  emit('applyOverrides', {
    overrides: overrides,
    precomputedResults: selectedResult
  });
  
  // Ergebnisse von comparisonResults direkt leeren - damit wird die erste Bedingung false
  comparisonResults.value = [];
  
  // Zusätzliche Vorsichtsmaßnahme: hideResults auf true setzen
  hideResults.value = true;
}

// Überwacht Änderungen an isVisible und lädt Daten, wenn das Modal geöffnet wird
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadHunterData();
  }
});

// Bei Änderungen des hunterId die Daten neu laden
watch(() => props.hunterId, () => {
  if (props.isVisible) {
    loadHunterData();
  }
});

// Bei Änderungen an den Inkrementen die Kosten neu berechnen
watch(() => JSON.stringify(scenarioIncrements.value), () => {
  calculateAllScenarioCosts();
}, { deep: true });

// Bei Änderung der ausgewählten Währung die Kosten neu berechnen
watch(() => selectedCurrency.value, () => {
  calculateAllScenarioCosts();
});

watch(() => isEvaluating.value, (newValue) => {
  // Setze hideResults auf false, WENN eine neue Evaluierung beginnt
  // Dies bewirkt, dass !hideResults true wird und die Tabelle nach einem Vergleich angezeigt wird
  if (newValue) {
    hideResults.value = false;
  }
});

onMounted(() => {
  if (props.isVisible) {
    loadHunterData();
  }
});
</script>

<style scoped>
/* Styling für das Modal */
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Anpassungen für niedrige Auflösungen */
@media (max-width: 768px) {
  .max-w-5xl {
    max-width: 96vw;
  }
}

/* Extra Styling für die Scrollbars */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.2);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.8);
}

/* Hintergrund für die Szenarien */
.bg-gray-850 {
  background-color: rgba(31, 35, 42, 0.8);
}

@media (max-width: 640px) {
  /* Kleinere Padding für Tab-Items auf mobilen Geräten */
  .flex.border-b > div {
    padding: 0.5rem 0.75rem;
  }
  
  /* Kleinere Schrift für Tab-Labels auf mobilen Geräten */
  .flex.border-b .md\:hidden {
    font-size: 0.75rem; /* 12px */
  }
  
  /* Kleinerer Abstand zwischen Icon und Text */
  .flex.border-b component + span {
    margin-left: 0.25rem;
  }
}
</style>