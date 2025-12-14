<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
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
          class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
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
              <!-- Verwende das Bild, wenn verfügbar, sonst das Tabler-Icon -->
              <img 
                v-if="hasIcon(currency)" 
                :src="icons[currency]" 
                :alt="currency"
                class="w-5 h-5 mr-1 md:mr-1.5"
              />
              <component 
                v-else
                :is="getCurrencyIcon(currency)" 
                :size="16" 
                :class="`text-${getCurrencyColor(currency)} mr-1 md:mr-1.5`"
              />
              <span class="hidden md:inline">{{ currencyLabels[currency] }}</span>
              <span class="md:hidden text-xs"></span>
            </div>
            
            <!-- XP Tab -->
            <div 
              @click="selectedCurrency = 'xp'"
              :class="[
                'cursor-pointer whitespace-nowrap flex items-center',
                'px-4 py-2 md:px-4 md:py-2 sm:px-2 sm:py-1',
                selectedCurrency === 'xp' 
                  ? 'border-b-2 border-blue-500 text-white' 
                  : 'text-gray-400 hover:text-gray-200'
              ]"
            >
            <img 
              v-if="hasIcon('xp')" 
              :src="icons.xp" 
              :alt="'XP'"
              class="w-5 h-5 mr-1 md:mr-1.5"
            />
              <IconBrightness v-else size="16" class="text-blue-400 mr-1 md:mr-1.5" />
              <span class="hidden md:inline">XP Progress</span>
              <span class="md:hidden text-xs"></span>
            </div>
          </div>
        </div>

        <!-- XP Progress Panel mit kombiniertem Fortschrittsbalken/Slider -->
        <div v-if="selectedCurrency === 'xp'" class="bg-gray-850 border border-gray-700 rounded-lg p-4 mb-4">
          <div class="text-lg text-white mb-4 flex items-center">
            <img 
              v-if="hasIcon('xp')" 
              :src="icons.xp" 
              :alt="'XP'"
              class="w-5 h-5 mr-1 md:mr-1.5"
            />
            <IconBrightness v-else size="20" class="mr-2 text-blue-400" />
            <span>Level: {{ currentLevel }}</span>
          </div>

          <div class="mb-6">
            <div class="flex justify-between text-gray-400 text-sm mb-1">
              <span>Current XP: {{ formatNumber(currentXP) }}</span>
              <span>Next Level: {{ formatLevelCost(nextLevelCost) }}</span>
            </div>
            
            <!-- Kombinierter XP Fortschrittsbalken und Slider -->
            <div class="relative h-5">
              <input 
                type="range" 
                v-model="xpPercentage" 
                min="0" 
                max="100" 
                step="1"
                class="w-full h-5 absolute z-10 opacity-0 cursor-pointer"
              />
              <div class="h-full bg-gray-700 rounded-full overflow-hidden absolute inset-0 pointer-events-none">
                <div 
                  class="h-full transition-all ease-in-out duration-300"
                  :style="{
                    width: `${levelProgressPercentage}%`,
                    backgroundColor: `var(--color-${hunterColor}-500, #3B82F6)`
                  }"
                ></div>
              </div>
              <!-- Kleiner Slider-Knopf für visuelles Feedback -->
              <div 
                class="absolute top-1/2 -translate-y-1/2 z-5 w-6 h-6 rounded-full border-2 border-white shadow pointer-events-none"
                :style="{
                  left: `calc(${xpPercentage}% - 0.5rem)`,
                  backgroundColor: `var(--color-${hunterColor}-500, #3B82F6)`
                }"
              ></div>
            </div>
            
            <!-- XP verbleibend und Prozent-Anzeige -->
            <div class="flex justify-between text-xs mt-1">
              <span class="text-gray-500">{{ formatNumber(xpToNextLevel) }} XP needed</span>
              <span class="text-gray-400">{{ xpPercentage }}%</span>
              <span class="text-gray-500">{{ formatCollectionTime(timeToNextLevel) }} remaining</span>
            </div>
          </div>
          
          <!-- XP Rate aus Simulationsergebnissen -->
          <div class="bg-gray-800/50 rounded-lg p-3 text-sm">
            <div class="flex justify-between mb-2">
              <span class="text-gray-300">Current XP Rate:</span>
              <span class="text-blue-300">{{ formatNumber(xpRate) }} per run</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-300">XP per Day:</span>
              <span class="text-blue-300">{{ formatNumber(xpPerDay) }}</span>
            </div>
          </div>
        </div>

        <!-- Upgrade Scenarios (nur anzeigen, wenn keine XP ausgewählt ist) -->
        <div v-if="selectedCurrency !== 'xp'" class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <!-- Scenario 1 -->
          <div class="bg-gray-850 border border-gray-700 px-2 py-4 rounded-lg">
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
                  <span 
                    v-if="upgrade.max" 
                    class="px-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600 ml-2 flex-shrink-0"
                  >
                    {{ upgrade.max }}
                  </span>
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
                    <!-- Next Cost Display - nur anzeigen wenn max nicht erreicht -->
                    <div 
                      v-if="!upgrade.max || getBaseValue(upgrade.key) + (scenarioIncrements[0][upgrade.key] || 0) < upgrade.max"
                      class="text-[10px] ml-3 text-yellow-400 uppercase"
                    >
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 0)) }}
                    </div>
                  </div>
                  
                  <!-- Ersetzen mit ValueControls für Szenario 1 -->
                  <div class="flex items-center">
                    <ValueControls
                      :value="scenarioIncrements[0][upgrade.key] || 0"
                      :minValue="0"
                      :maxValue="upgrade.max ? upgrade.max - getBaseValue(upgrade.key) : Infinity"
                      :showFastControls="true"
                      :step="1"
                      :valueClass="'text-blue-400'"
                      @update:value="(newVal) => updateScenarioValue(0, upgrade.key, newVal, upgrade.max)"
                    />
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
          <div class="bg-gray-850 border border-gray-700 px-2 py-4 rounded-lg">
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
                  <span 
                    v-if="upgrade.max" 
                    class="px-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600 ml-2 flex-shrink-0"
                  >
                    {{ upgrade.max }}
                  </span>
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
                    <!-- Next Cost Display - nur anzeigen wenn max nicht erreicht -->
                    <div 
                      v-if="!upgrade.max || getBaseValue(upgrade.key) + (scenarioIncrements[1][upgrade.key] || 0) < upgrade.max"
                      class="text-[10px] ml-3 text-yellow-400 uppercase"
                    >
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 1)) }}
                    </div>
                  </div>
                  
                  <!-- Ersetzen mit ValueControls für Szenario 2 -->
                  <div class="flex items-center">
                    <ValueControls
                      :value="scenarioIncrements[1][upgrade.key] || 0"
                      :minValue="0"
                      :maxValue="upgrade.max ? upgrade.max - getBaseValue(upgrade.key) : Infinity"
                      :showFastControls="true"
                      :step="1"
                      :valueClass="'text-blue-400'"
                      @update:value="(newVal) => updateScenarioValue(1, upgrade.key, newVal, upgrade.max)"
                    />
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
          <div class="bg-gray-850 border border-gray-700 px-2 py-4 rounded-lg">
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
                  <span 
                    v-if="upgrade.max" 
                    class="px-1 bg-gray-700 text-gray-300 text-xs rounded-full border border-gray-600 ml-2 flex-shrink-0"
                  >
                    {{ upgrade.max }}
                  </span>
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
                    <!-- Next Cost Display - nur anzeigen wenn max nicht erreicht -->
                    <div 
                      v-if="!upgrade.max || getBaseValue(upgrade.key) + (scenarioIncrements[2][upgrade.key] || 0) < upgrade.max"
                      class="text-[10px] ml-3 text-yellow-400 uppercase"
                    >
                      next: {{ formatCost(getNextUpgradeCost(upgrade.key, 2)) }}
                    </div>
                  </div>
                  
                  <!-- Ersetzen mit ValueControls für Szenario 3 -->
                  <div class="flex items-center">
                    <ValueControls
                      :value="scenarioIncrements[2][upgrade.key] || 0"
                      :minValue="0"
                      :maxValue="upgrade.max ? upgrade.max - getBaseValue(upgrade.key) : Infinity"
                      :showFastControls="true"
                      :step="1"
                      :valueClass="'text-blue-400'"
                      @update:value="(newVal) => updateScenarioValue(2, upgrade.key, newVal, upgrade.max)"
                    />
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

        <!-- HBM Production Box - nur für Ozzy und HBM-Tab anzeigen -->
        <div v-if="hunterId === 'ozzy' && selectedCurrency === 'hbm'" 
             class="bg-gray-850 border border-gray-700 rounded-lg overflow-hidden shadow-lg my-4">
          <div class="p-3 flex justify-between items-center border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <img 
                v-if="hasIcon('hbm')" 
                :src="icons.hbm" 
                class="w-7 h-7 mr-2" 
                alt="Hellish Biomatter" 
              />
              <IconDiamond v-else size="28" class="w-7 h-7 mr-2 text-amber-400" />
              Hellish-Biomatter Production
            </h3>
          </div>
          
          <div class="p-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <!-- Reference Build -->
              <div class="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                <div class="font-medium text-white text-sm mb-1">Reference Build</div>
                <div class="text-xs text-gray-400 mb-2">Select Borge Build</div>
                <select 
                  v-model="selectedBorgeBuildId"
                  @change="updateHBMFromSelectedBuild"
                  class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a build...</option>
                  <option 
                    v-for="build in borgeBuilds" 
                    :key="build.id" 
                    :value="build.id"
                  >
                    {{ build.name }}
                  </option>
                </select>
              </div>

              <!-- Daily HBM Rate -->
              <div class="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                <div class="font-medium text-white text-sm mb-1">Daily HBM Production</div>
                <div class="text-xs text-gray-400 mb-2">Calculated from Build</div>
                <div class="flex items-center bg-gray-800/80 py-2 px-3 rounded-lg border border-gray-700">
                  <div class="text-amber-400 text-base font-bold">{{ formatNumber(hellishBiomatterPerDay) }}</div>
                  <div v-if="!selectedBorgeBuildId" class="ml-2 text-gray-400 text-xs">
                    (select a build)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loot Collection Slider - für alle Tabs außer XP anzeigen -->
        <div v-if="selectedCurrency !== 'xp'" 
            :class="[
              'bg-gray-850 border border-gray-700 p-4 rounded-lg mb-6 mt-4',
              getMaxScenarioCost() <= 0 ? 'opacity-50 pointer-events-none' : ''
            ]">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <img 
                v-if="hasIcon(selectedCurrency)" 
                :src="icons[selectedCurrency]" 
                :alt="currencyLabels[selectedCurrency]" 
                class="w-5 h-5 mr-2"
              />
              <component 
                v-else
                :is="getCurrencyIcon(selectedCurrency)" 
                :size="18" 
                :class="`text-${getCurrencyColor(selectedCurrency)} mr-2`"
              />
              <span class="font-medium text-white">Current {{ currencyLabels[selectedCurrency] }}:</span>
            </div>
            
            <div class="text-blue-400 font-medium">
              {{ formatCost(currentCurrencyAmount) }}
            </div>
          </div>
          
          <!-- Kombinierter Loot Fortschrittsbalken und Slider -->
          <div class="relative h-5 mb-2">
            <input 
              type="range" 
              v-model="currentCurrencyPercentage" 
              min="0" 
              max="100" 
              step="0.5"
              class="w-full h-5 absolute z-10 opacity-0 cursor-pointer"
              @input="updateCurrentCurrencyAmount"
            />
            <div class="h-full bg-gray-700 rounded-full overflow-hidden absolute inset-0 pointer-events-none">
              <div 
                class="h-full transition-all ease-in-out duration-300"
                :style="{
                  width: `${currentCurrencyPercentage}%`,
                  backgroundColor: `var(--color-${getCurrencyColor(selectedCurrency).split('-')[0]}-500, #3B82F6)`
                }"
              ></div>
            </div>
            <!-- Slider-Knopf für visuelles Feedback -->
            <div 
              class="absolute top-1/2 -translate-y-1/2 z-5 w-6 h-6 rounded-full border-2 border-white shadow pointer-events-none"
              :style="{
                left: `calc(${currentCurrencyPercentage}% - 0.5rem)`,
                backgroundColor: `var(--color-${getCurrencyColor(selectedCurrency).split('-')[0]}-500, #3B82F6)`
              }"
            ></div>
          </div>
          
          <!-- Anzeige der fehlenden Menge und des Prozentsatzes -->
          <div class="flex justify-between text-xs mt-1">
            <span class="text-gray-500">
              {{ formatCost(getMaxScenarioCost() - currentCurrencyAmount) }} still needed
            </span>
            <span class="text-gray-400">{{ Number(currentCurrencyPercentage).toFixed(1) }}%</span>
            <span class="text-gray-500">
              {{ formatCollectionTime(getRemainingCollectionTime()) }} remaining
            </span>
          </div>
        </div>

        <!-- Fragment Input Panel - nur im Fragments-Tab anzeigen -->
        <div v-if="selectedCurrency === 'frags'" class="bg-gray-850 border border-gray-700 p-4 rounded-lg mb-6 mt-4 w-full sm:w-1/2">
          <div class="flex items-center justify-start">
            <div class="flex items-center">
              <img 
                v-if="hasIcon('frags')" 
                :src="icons.frags" 
                :alt="currencyLabels['frags']" 
                class="w-5 h-5 mr-2"
              />
              <IconPuzzle v-else size="18" class="mr-2 text-blue-400" />
              <span class="font-medium text-white">Fragment Income: </span>
            </div>
            
            <div class="ml-2 w-32">
              <input 
                v-model="fragmentsPerDay"
                type="text"
                pattern="[0-9]*"
                inputmode="numeric"
                class="px-3 py-1 w-full text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white text-center no-arrows"
                placeholder="per day"
              />
            </div>
            
            <div class="ml-2 text-sm text-gray-300">
              per day
            </div>
          </div>
          
          <div class="text-xs text-gray-400 mt-2">
            Enter your daily Fragment income to see collection time estimates.
          </div>
        </div>

        <!-- Loot Collection Time Table - nur anzeigen, wenn nicht XP-Tab ausgewählt -->
        <div class="mt-6" v-if="selectedCurrency !== 'xp'">
          <div class="text-lg text-white mb-3 flex items-center">
            <IconClock size="20" class="mr-2 text-blue-400" />
            Loot Collection Time
          </div>
          
          <!-- Container mit responsiver Breite -->
          <div class="bg-gray-850 border border-gray-700 p-4 rounded-lg overflow-x-auto md:max-w-lg">
            <table class="w-full text-sm">
              <colgroup>
                <col class="w-[25%]" /> <!-- Scenario -->
                <col class="w-[25%]" /> <!-- Cost -->
                <col class="w-[40%]" /> <!-- Collection Time -->
              </colgroup>
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="py-2 px-4 text-left text-gray-400">Scenario</th>
                  <th class="py-2 px-6 text-left text-gray-400">Cost</th>
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
                  <td class="py-2 px-6 text-right">
                    {{ formatCollectionTime(getCollectionTimeInMinutes(index)) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Compare Button - nur anzeigen, wenn nicht XP-Tab ausgewählt -->
        <div class="mt-6 flex justify-center" v-if="selectedCurrency !== 'xp'">
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
          <div class="text-lg text-white mb-3 flex items-center justify-between">
            <div class="flex items-center">
              <IconChartPie size="20" class="mr-2 text-blue-400" />
              Results
            </div>
            <div class="flex items-center">
              <label class="text-sm text-gray-400 mr-2">Efficiency Multiplier (10^x):</label>
              <ValueControls
                :value="efficiencyMultiplierExponent"
                :minValue="0"
                :maxValue="50"
                :step="1"
                :showFastControls="false"
                @update:value="efficiencyMultiplierExponent = $event"
                class="w-25"
              />
            </div>
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
                <!-- Efficiency Score -->
                <tr class="border-b border-gray-700">
                  <td class="pt-3.5 px-4 text-gray-300 flex items-center gap-2">
                    <IconBolt size="16" :class="`text-${hunterColor}-400 mr-1`" />
                    <span>Efficiency Score</span>
                    <InfoTooltip 
                      content="<div class='text-sm leading-relaxed'>
                        <div class='font-semibold mb-2 text-blue-300'>Efficiency Score Formula</div>
                        <div class='mb-2'>
                        mats/day = (mat1 + mat2 + mat3) / 3 × (1440 / avgTime)
                        </div>
                        <div class='mb-2'>
                        Improvement = Scenario mats/day - Original mats/day
                        </div>
                        <div class='mb-2'>
                        Efficiency = (Improvement / Upgrade cost) × Efficiency Multiplier
                        </div>
                      </div>"
                      placement="right"
                    />
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`efficiency-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'efficiency', false)"
                  >
                    {{ formatNumber(calculateEfficiencyScore(result, result.index)) }}
                    <div v-if="originalResults" class="text-xs text-gray-400">
                      {{ formatCost(scenarioCosts[result.index]) }} cost
                    </div>
                  </td>
                </tr>
                
                <!-- Avg Stage -->
                <tr class="border-b border-gray-700">
                  <td class="pt-3.5 px-4 text-gray-300 flex items-center gap-2">
                    <IconStairs size="16" class="text-blue-400 mr-1" />
                    <span>Avg Stage</span>
                  </td>
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
                
                <!-- Runtime (Avg Time) -->
                <tr class="border-b border-gray-700">
                  <td class="pt-3.5 px-4 text-gray-300 flex items-center gap-2">
                    <IconClock size="16" class="text-green-400 mr-1" />
                    <span>Runtime</span>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatTime(originalResults.avgTime) : '-' }}
                  </td>
                  <td 
                    v-for="result in comparisonResults" 
                    :key="`runtime-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'avgTime', true)"
                  >
                    {{ formatTime(result.avgTime) }}
                    <div v-if="originalResults" class="text-xs" :class="getDiffClass(result.avgTime, originalResults.avgTime)">
                      {{ formatDiff(result.avgTime, originalResults.avgTime) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Material 1 -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat1', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <!-- Verwende das Bild, wenn verfügbar, sonst das Tabler-Icon -->
                      <img 
                        v-if="hasIcon('mat1')" 
                        :src="icons.mat1" 
                        :alt="getMaterialLabel('mat1')" 
                        class="w-6 h-6 mr-1.5"
                      />
                      <IconDiamond v-else size="14" class="mr-1.5 text-red-400" />
                      {{ getMaterialLabel('mat1') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat1 || 0, originalResults) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat1-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat1', true)"
                  >
                    {{ formatMaterialPerDay(result.mat1 || 0, result) }}
                    <div v-if="originalResults?.mat1" class="text-xs" 
                        :class="getDiffClass(result.mat1, originalResults.mat1)">
                      {{ formatDayDiffPercent(result.mat1, originalResults.mat1, result) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Material 2 -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat2', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <!-- Verwende das Bild, wenn verfügbar, sonst das Tabler-Icon -->
                      <img 
                        v-if="hasIcon('mat2')" 
                        :src="icons.mat2" 
                        :alt="getMaterialLabel('mat2')" 
                        class="w-6 h-6 mr-1.5"
                      />
                      <IconHexagon v-else size="14" class="mr-1.5 text-orange-400" />
                      {{ getMaterialLabel('mat2') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat2 || 0, originalResults) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat2-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat2', true)"
                  >
                    {{ formatMaterialPerDay(result.mat2 || 0, result) }}
                    <div v-if="originalResults?.mat2" class="text-xs" 
                        :class="getDiffClass(result.mat2, originalResults.mat2)">
                      {{ formatDayDiffPercent(result.mat2, originalResults.mat2, result) }}
                    </div>
                  </td>
                </tr>

                <!-- Material 3 -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('mat3', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <!-- Verwende das Bild, wenn verfügbar, sonst das Tabler-Icon -->
                      <img 
                        v-if="hasIcon('mat3')" 
                        :src="icons.mat3" 
                        :alt="getMaterialLabel('mat3')" 
                        class="w-6 h-6 mr-1.5"
                      />
                      <IconHexagons v-else size="14" class="mr-1.5 text-amber-400" />
                      {{ getMaterialLabel('mat3') }} (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.mat3 || 0, originalResults) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`mat3-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'mat3', true)"
                  >
                    {{ formatMaterialPerDay(result.mat3 || 0, result) }}
                    <div v-if="originalResults?.mat3" class="text-xs" 
                        :class="getDiffClass(result.mat3, originalResults.mat3)">
                      {{ formatDayDiffPercent(result.mat3, originalResults.mat3, result) }}
                    </div>
                  </td>
                </tr>
                
                <!-- XP (per Day) -->
                <tr class="border-b border-gray-700" v-if="hasLootProperty('xp', true)">
                  <td class="py-2 px-4 text-gray-300">
                    <div class="flex items-center">
                      <!-- Verwende das Bild, wenn verfügbar, sonst das Tabler-Icon -->
                      <img 
                        v-if="hasIcon('xp')" 
                        :src="icons.xp" 
                        :alt="'XP'" 
                        class="w-6 h-6 mr-1.5"
                      />
                      <IconBrightness v-else size="14" class="mr-1.5 text-blue-400" />
                      XP (per Day)
                    </div>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50">
                    {{ originalResults ? formatMaterialPerDay(originalResults.xp || 0, originalResults) : '-' }}
                  </td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`xp-${result.index}`" 
                    class="py-2 px-6 text-right"
                    :class="getBestValueClass(result.index, 'xp', true)"
                  >
                    {{ formatMaterialPerDay(result.xp || 0, result) }}
                    <div v-if="originalResults?.xp" class="text-xs" 
                        :class="getDiffClass(result.xp, originalResults.xp)">
                      {{ formatDayDiffPercent(result.xp, originalResults.xp, result) }}
                    </div>
                  </td>
                </tr>
                
                <!-- Upgrades -->
                <tr class="border-b border-gray-600">
                  <td class="py-2 px-4 text-gray-300 flex items-center">
                    <IconChartArrowsVertical size="16" class="mr-2" :class="`text-${hunterColor}-400`" />
                    Upgrades
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50"></td>
                  <td 
                    v-for="(result, i) in comparisonResults" 
                    :key="`upgrades-${result.index}`" 
                    class="py-2 px-6 text-right"
                  >
                    <div class="space-y-1 text-xs">
                      <div v-for="upgrade in getScenarioUpgrades(result.index)" :key="upgrade.id" class="text-gray-300 flex items-center justify-between">
                        <span class="truncate mr-2">{{ upgrade.name }}</span>
                        <span class="text-gray-400 flex-shrink-0">+{{ upgrade.levels }}</span>
                      </div>
                      
                      <div v-if="getScenarioUpgrades(result.index).length === 0" class="text-gray-500 italic">
                        No upgrades
                      </div>
                    </div>
                  </td>
                </tr>

                <!-- Costs -->
                <tr>
                  <td class="pt-3.5 px-4 text-gray-300 flex items-center gap-2">
                    <IconCoins size="16" class="text-yellow-400 mr-1" />
                    <span>Costs</span>
                  </td>
                  <td class="py-2 px-6 text-right bg-gray-800/50"></td>
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
  IconX, IconScale, IconChartBar, IconChartPie,
  IconCheck, IconLoader2, IconCircle1, IconCircle2, IconCircle3,
  IconDiamond, IconHexagon, IconHexagons, IconPuzzle,
  IconAlertCircle, IconChevronLeft, IconChevronRight,
  IconBrightness, IconClock, IconBug, IconStairs, IconCoins, IconBolt,
  IconChartArrowsVertical
} from '@tabler/icons-vue';
import { useLootIcons } from '../../composables/useLootIcons';
import { useHunterStore } from '../../store/hunterStore';
import { getHunterById } from '../../constants/hunters';
import { UPGRADES } from '../../constants/upgrades';
import { calcCostDifference, calcKnoxSalvoCostDifference, formatCost } from '../../utils/statCostUtils';
import { calcRelicCostDifference, getTier1RelicMaxLevelBonus, isTier1Relic } from '../../utils/relicCostUtils';
import { calcGadgetCostDifference } from '../../utils/gadgetCostUtils';
import { calcInscryptionCostDifference } from '../../utils/inscryptionCostUtils';
import { 
  formatNumber, formatStage, formatPercent, formatTime,
  getDiffClasses, getDiffIcon, getDiffText,
  getAbsoluteDiffClasses, getAbsoluteDiffText, 
} from '../../components/builds/utils/BuildComparisonUtils';
import { useBuildEvaluation } from '../../composables/useBuildEvaluation';
import ValueControls from '../common/ValueControls.vue';
import InfoTooltip from '../../composables/InfoTooltip.vue';
import { getHunterLevelCost, formatLevelCost } from '../../utils/levelCostUtils';

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
const efficiencyMultiplierExponent = ref(3); // 10^5 = 100000 als Standard

// Szenarien (3 mögliche Upgrade-Pfade)
const scenarios = ref([{}, {}, {}]);
const scenarioIncrements = ref([{}, {}, {}]);
const scenarioCosts = ref([0, 0, 0]);
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

// Dynamischer Tier 1 Relic Max Level Bonus basierend auf res_ultima
const tier1RelicMaxLevelBonus = computed(() => {
  const resUltimaLevel = hunterStore.getUpgradeValue('researches', 'res_ultima') || 0;
  return getTier1RelicMaxLevelBonus(resUltimaLevel);
});

// Computed upgradesByCurrency mit dynamischen maxLevels für Tier 1 Relics
const upgradesByCurrencyWithBonus = computed(() => {
  const result = {};
  for (const [currency, upgrades] of Object.entries(upgradesByCurrency.value)) {
    result[currency] = upgrades.map(upgrade => {
      // Prüfe ob es ein Tier 1 Relic ist
      if (upgrade.key.startsWith('upgrades.relics.')) {
        const relicId = upgrade.key.split('.')[2];
        if (isTier1Relic(relicId)) {
          return {
            ...upgrade,
            max: (upgrade.max || 100) + tier1RelicMaxLevelBonus.value
          };
        }
      }
      return upgrade;
    });
  }
  return result;
});

// Fragments per day - für Fragment-spezifische Berechnungen
const fragmentsPerDay = ref(Number(localStorage.getItem('fragments_per_day')) || 100); // Standardwert

// HBM (Hellish Biomatter) Production - für Ozzy's HBM-basierte Upgrades
const cachedBorgeResults = ref({});
const selectedBorgeBuildId = ref('');
const hellishBiomatterPerDay = ref(0);

// Neue reaktive Variablen für den Loot Collection Slider
const currentCurrencyPercentage = ref(0);
const currentCurrencyAmount = ref(0);
const currencyMinMax = ref({ min: 0, max: 0 });

const hideResults = ref(false);

const { 
  evaluateBuildWithParams, 
  compareScenarios,
  comparisonResults,
  isEvaluating
} = useBuildEvaluation(props, emit);

// Verwende das useLootIcons Composable
const { icons, hasIcon } = useLootIcons(props.hunterId);

// Computed, um zu prüfen, ob es irgendwelche Änderungen in den Szenarien gibt
const hasAnyChanges = computed(() => {
  return scenarioIncrements.value.some(scenario => {
    return Object.values(scenario).some(val => val > 0);
  });
});

// Zusätzliche reaktive Variablen für XP-Tracking
const xpPercentage = ref(20); // Standard-Fortschritt (20%)
const currentLevel = computed(() => props.buildData?.level || 1);
const nextLevelCost = computed(() => getHunterLevelCost(props.hunterId, currentLevel.value + 1));
const currentXP = computed(() => Math.floor(nextLevelCost.value * (xpPercentage.value / 100)));
const xpToNextLevel = computed(() => nextLevelCost.value - currentXP.value);
const levelProgressPercentage = computed(() => xpPercentage.value);

// XP Rate aus den Simulationsergebnissen
const xpRate = computed(() => originalResults.value?.xp || 0);
const xpPerDay = computed(() => {
  if (!xpRate.value || !originalResults.value?.avgTime) return 0;
  const runsPerDay = 1440 / originalResults.value.avgTime; // 1440 Minuten pro Tag
  return xpRate.value * runsPerDay;
});

// Zeit bis zum nächsten Level
const timeToNextLevel = computed(() => {
  if (!xpRate.value || xpRate.value <= 0) return Infinity;
  return (xpToNextLevel.value / xpRate.value) * (originalResults.value?.avgTime || 120);
});

// Computed properties for Borge builds (for HBM production)
const borgeBuilds = computed(() => {
  if (props.hunterId !== 'ozzy') return [];
  return hunterStore.getBuildsForHunter('borge').filter(build => !build.isArchived);
});

const selectedBorgeBuild = computed(() => {
  if (!selectedBorgeBuildId.value) return null;
  return borgeBuilds.value.find(build => String(build.id) === String(selectedBorgeBuildId.value));
});

function resetModalState() {
  // Ergebnis-bezogene Zustände
  comparisonResults.value = [];
  originalResults.value = null;
  
  // Szenario-bezogene Zustände
  scenarioIncrements.value = [{}, {}, {}];
  scenarioCosts.value = [0, 0, 0];
  scenarios.value = [{}, {}, {}];
  
  // UI-Zustände
  hideResults.value = false;
  isEvaluating.value = false;
  loadError.value = null;
  
  console.log('Modal state has been reset');
}

// Load cached results for Borge builds (for HBM production)
async function loadCachedBorgeResults() {
  if (props.hunterId !== 'ozzy') return;
  
  try {
    // Import the evaluation cache service
    const { shouldEvaluate } = await import('@/services/evaluationCacheService');
    const { useGemPlannerStore } = await import('@/store/gemPlannerStore');
    const gemPlannerStore = useGemPlannerStore();
    
    for (const build of borgeBuilds.value) {
      const cache = await shouldEvaluate({
        hunterId: 'borge',
        buildData: build,
        hunterStore,
        gemPlannerStore
      });
      
      if (cache?.cachedResult) {
        cachedBorgeResults.value[build.id] = cache.cachedResult;
      }
    }
  } catch (error) {
    console.error('[UpgradeComparisonModal] Error loading cached Borge results:', error);
  }
}

// Update HBM production from selected Borge build
function updateHBMFromSelectedBuild() {
  if (props.hunterId !== 'ozzy' || !selectedBorgeBuildId.value) {
    hellishBiomatterPerDay.value = 0;
    return;
  }
  
  const build = selectedBorgeBuild.value;
  if (build) {
    const result = cachedBorgeResults.value[build.id];
    if (result) {
      const hbmPerRun = result.mat3 || 0;
      const avgRunTimeMinutes = result.avgTime || 120;
      const runsPerDay = 1440 / avgRunTimeMinutes;
      hellishBiomatterPerDay.value = Math.floor(hbmPerRun * runsPerDay);
      
      // Save selected build
      localStorage.setItem('upgrade-comparison-selectedBorgeBuildId', selectedBorgeBuildId.value);
    }
  }
}

// Hunter-Daten und Upgrades laden
async function loadHunterData() {
  try {
    resetModalState(); // Zustandsreset vor dem Laden
    isLoading.value = true;
    loadError.value = null;

    // Fragment-Rate aus localStorage laden
    const storedFragmentsPerDay = localStorage.getItem('fragments_per_day');
    if (storedFragmentsPerDay) {
      fragmentsPerDay.value = Number(storedFragmentsPerDay);
    }
    
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
    
    // Stelle sicher, dass Hunter im Store initialisiert ist - vor allen anderen Schritten
    await hunterStore.initHunterConfig(props.hunterId);
    
    // Erst nach erfolgreicher Initialisierung Szenarien und Währungen einrichten
    if (availableCurrencies.value.length > 0) {
      selectedCurrency.value = availableCurrencies.value[0];
    }

    // Dann Szenarien initialisieren
    initializeScenarios();
    
    // Für Ozzy: Borge builds laden und HBM-Produktion initialisieren
    if (props.hunterId === 'ozzy') {
      // Stelle sicher, dass Borge auch initialisiert ist
      await hunterStore.initHunterConfig('borge');
      
      // Lade cached Borge Ergebnisse
      await loadCachedBorgeResults();
      
      // Lade gespeicherte Build-Selection
      const savedBorgeBuildId = localStorage.getItem('upgrade-comparison-selectedBorgeBuildId');
      if (savedBorgeBuildId && borgeBuilds.value.some(build => String(build.id) === String(savedBorgeBuildId))) {
        selectedBorgeBuildId.value = savedBorgeBuildId;
        updateHBMFromSelectedBuild();
      }
    }
    
    // Ergebnisse erst am Ende setzen und validieren
    if (props.buildData.results && typeof props.buildData.results === 'object') {
      console.log('Using existing results:', props.buildData.results);
      originalResults.value = {...props.buildData.results}; // Sicherstellen, dass wir eine Kopie erstellen
    } else {
      console.warn('No results found in buildData, calculating new ones');
      // Hier könntest du eine Initialberechnung durchführen
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
      } else if (upgrade.key.startsWith('upgrades.inscryptions.')) {
        // Inscryption-Kosten
        const inscryptionId = upgrade.key.split('.')[2]; // Extrahiert 'i80'
        
        totalCost += calcInscryptionCostDifference(inscryptionId, baseValue, baseValue + incrementValue);
      } else if (upgrade.key === 'proj' && props.hunterId === 'knox') {
        // Knox Salvo Multi-Currency-Kosten
        totalCost += calcKnoxSalvoCostDifference(baseValue, baseValue + incrementValue, currency);
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

// Neue Funktion für ValueControls - ersetzt increment/decrementScenarioValue
function updateScenarioValue(scenarioIndex, key, newValue, maxValue) {
  // Stelle sicher, dass der Wert im gültigen Bereich liegt
  const globalValue = getBaseValue(key);
  const max = maxValue !== undefined ? maxValue : Infinity;
  
  // Begrenze auf 0 und maxValue-globalValue
  newValue = Math.max(0, Math.min(newValue, max - globalValue));
  
  // Update des Werts
  scenarioIncrements.value[scenarioIndex][key] = newValue;
  
  // Kostenberechnung aktualisieren
  calculateAllScenarioCosts();
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
  
  // Funktion steht zur Verfügung für weitere Verwendung der Effizienz-Daten
  // Aber keine UI-Empfehlungen mehr
}

// Berechnet den Effizienz-Score für ein Ergebnis
function calculateEfficiencyScore(result, scenarioIndex) {
  if (!result) return 0;
  
  // Berechne Material-Durchschnitt pro Run: (mat1 + mat2 + mat3) / 3
  const mat1 = result.mat1 || 0;
  const mat2 = result.mat2 || 0;
  const mat3 = result.mat3 || 0;
  const avgMaterialPerRun = (mat1 + mat2 + mat3) / 3;
  
  if (avgMaterialPerRun <= 0) return 0;
  
  // Berechne Materialien pro Tag basierend auf avgTime
  const avgRunTimeMinutes = result.avgTime || 120;
  const runsPerDay = 1440 / avgRunTimeMinutes; // 1440 Minuten pro Tag
  const materialsPerDay = avgMaterialPerRun * runsPerDay;
  
  // Für Original-Ergebnis: Zeige absolute Material-Rate pro Tag
  const cost = scenarioIndex !== undefined ? scenarioCosts.value[scenarioIndex] : 0;
  if (cost <= 0) return materialsPerDay;
  
  // Für Szenarien: Berechne relative Verbesserung gegenüber Original
  if (!originalResults.value) return 0;
  
  // Original Material-Rate berechnen
  const origMat1 = originalResults.value.mat1 || 0;
  const origMat2 = originalResults.value.mat2 || 0;
  const origMat3 = originalResults.value.mat3 || 0;
  const origAvgMaterialPerRun = (origMat1 + origMat2 + origMat3) / 3;
  
  const origAvgRunTimeMinutes = originalResults.value.avgTime || 120;
  const origRunsPerDay = 1440 / origAvgRunTimeMinutes;
  const origMaterialsPerDay = origAvgMaterialPerRun * origRunsPerDay;
  
  // Verbesserung = Szenario-Rate - Original-Rate
  const improvement = materialsPerDay - origMaterialsPerDay;
  
  // Wenn keine Verbesserung, trotzdem einen kleinen Wert zurückgeben um Division durch 0 zu vermeiden
  if (improvement <= 0) return 0.001;
  
  // Effizienz = Verbesserung / Kosten (zusätzliche Materialien pro Tag pro Kosten-Einheit)
  const multiplier = Math.pow(10, efficiencyMultiplierExponent.value);
  return improvement / cost * multiplier;
}

// Style-Hilfsfunktionen für die Ergebnistabelle
function getBestValueClass(index, field, includeOriginal = false) {
  if (comparisonResults.value.length === 0) return '';
  
  // Spezielle Behandlung für Efficiency Score
  if (field === 'efficiency') {
    // Berechne alle Effizienz-Werte
    const efficiencyValues = comparisonResults.value.map(r => calculateEfficiencyScore(r, r.index));
    
    if (efficiencyValues.length === 0) return '';
    
    // Finde den maximalen Effizienz-Wert
    const maxEfficiency = Math.max(...efficiencyValues);
    
    // Berechne die aktuelle Effizienz
    const currentResult = comparisonResults.value.find(r => r.index === index);
    if (!currentResult) return '';
    
    const currentEfficiency = calculateEfficiencyScore(currentResult, index);
    
    // Prüfen, ob der aktuelle Wert der höchste ist
    return Math.abs(currentEfficiency - maxEfficiency) < 0.001 ? 'text-green-400' : '';
  }
  
  // Spezielle Behandlung für avgTime - hier ist WENIGER besser
  if (field === 'avgTime') {
    // Finde das aktuelle result anhand des index
    const result = comparisonResults.value.find(r => r.index === index);
    if (!result) return '';
    
    // Alle avgTime Werte sammeln
    const avgTimeValues = comparisonResults.value.map(r => r.avgTime || 120);
    
    if (avgTimeValues.length === 0) return '';
    
    // Minimalen Wert finden (kürzeste Zeit ist am besten)
    const minTime = Math.min(...avgTimeValues);
    
    // Aktuellen Wert holen
    const currentTime = result.avgTime || 120;
    
    // Prüfen, ob der aktuelle Wert der niedrigste ist
    return Math.abs(currentTime - minTime) < 0.001 ? 'text-green-400' : '';
  }
  
  // Für Materialien und XP müssen wir die Tageswerte vergleichen, nicht die Rohwerte
  const isMaterialField = ['mat1', 'mat2', 'mat3', 'xp'].includes(field);
  
  // Finde das aktuelle result anhand des index
  const result = comparisonResults.value.find(r => r.index === index);
  if (!result) return '';
  
  // Tageswerte aller Ergebnisse berechnen, wenn es sich um ein Materialfeld handelt
  const values = comparisonResults.value.map(r => {
    if (isMaterialField) {
      // Bei Materialien den Tageswert berechnen
      const avgTime = r.avgTime || 120;
      const runsPerDay = 1440 / avgTime;
      return (r[field] || 0) * runsPerDay;
    } else {
      // Bei anderen Metriken den direkten Wert verwenden
      return r[field] || 0;
    }
  });
  
  if (values.length === 0) return '';
  
  // Maximalen Wert finden
  const maxValue = Math.max(...values);
  
  // Aktuellen Tageswert berechnen
  let currentValue;
  if (isMaterialField) {
    const avgTime = result.avgTime || 120;
    const runsPerDay = 1440 / avgTime;
    currentValue = (result[field] || 0) * runsPerDay;
  } else {
    currentValue = result[field] || 0;
  }
  
  // Prüfen, ob der aktuelle Wert der höchste ist
  // Wir verwenden eine kleine Toleranz, um Rundungsfehler zu berücksichtigen
  const isMaxValue = Math.abs(currentValue - maxValue) < 0.001;
  
  // Nur der höchste Wert soll grün dargestellt werden
  return isMaxValue ? 'text-green-400' : '';
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
  
  // Explizite Typprüfungen und Validierung
  if (typeof value !== 'number') {
    console.warn('Invalid value in calculatePerDay:', value);
    return 0;
  }
  
  // Validiere die avgTime aus verschiedenen Quellen mit klaren Fallbacks
  let avgRunTimeMinutes = 120; // Standard-Fallback
  
  if (resultObj && typeof resultObj === 'object' && typeof resultObj.avgTime === 'number') {
    avgRunTimeMinutes = resultObj.avgTime;
  } else if (originalResults.value && typeof originalResults.value.avgTime === 'number') {
    avgRunTimeMinutes = originalResults.value.avgTime;
  }
  
  // Validiere das Ergebnis
  const runsPerDay = 1440 / avgRunTimeMinutes;
  const result = value * runsPerDay;
  
  // Prüfe auf NaN oder Infinity
  if (!isFinite(result)) {
    console.warn('Invalid result in calculatePerDay:', result, 'from value:', value, 'and avgTime:', avgRunTimeMinutes);
    return 0;
  }
  
  return result;
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
  if (!resultValue || !originalValue || !resultObj || !originalResults.value) {
    return '±0%';
  }
  
  try {
    // Original avgTime und Szenario avgTime verwenden
    const originalAvgTime = originalResults.value.avgTime || 120;
    const scenarioAvgTime = resultObj.avgTime || 120;
    
    // Runs pro Tag für beide berechnen
    const originalRunsPerDay = 1440 / originalAvgTime;
    const scenarioRunsPerDay = 1440 / scenarioAvgTime;
    
    // Tageswerte berechnen
    const originalPerDay = originalValue * originalRunsPerDay;
    const resultPerDay = resultValue * scenarioRunsPerDay;
    
    // Prozentualer Unterschied zum Original
    const diffPercent = ((resultPerDay / originalPerDay) - 1) * 100;
    
    // Sicherstellen, dass wir einen gültigen Wert haben
    if (!isFinite(diffPercent)) {
      return '±0%';
    }
    
    return diffPercent > 0 
        ? `+${diffPercent.toFixed(1)}%` 
        : `${diffPercent.toFixed(1)}%`;
  } catch (error) {
    console.error('Error in formatDayDiffPercent:', error);
    return '±0%';
  }
}

// Auch Absolutwert-Differenzen immer weiß darstellen
function formatDiff(value, baseValue) {
  if (value === baseValue) return '±0';
  const diff = value - baseValue;
  return diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
}

// Icons für die Währungen - AKTUALISIERT für die originalen Icons
function getCurrencyIcon(currencyType) {
  // Wenn der Hunter-spezifische Icon vorhanden ist, wird null zurückgegeben
  // damit wir im Template prüfen können, ob wir das Bild oder das Tabler-Icon anzeigen sollen
  if (hasIcon(currencyType)) {
    return null;
  }
  
  // Fallback auf Tabler-Icons
  const fallbackIcons = {
    'mat1': IconDiamond,
    'mat2': IconHexagon, 
    'mat3': IconHexagons,
    'frags': IconPuzzle
  };
  
  return fallbackIcons[currencyType] || IconDiamond;
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
  if (!currency || !upgradesByCurrencyWithBonus.value[currency]) return [];
  
  return upgradesByCurrencyWithBonus.value[currency].filter(upgrade => {
    // Globalen Wert ermitteln
    const globalValue = getBaseValue(upgrade.key);
    // Wenn kein Maximum definiert ist, immer anzeigen
    if (upgrade.max === undefined) return true;
    // Sonst nur anzeigen, wenn das Maximum noch nicht erreicht ist
    return globalValue < upgrade.max;
  });
}

// Funktion zum Formatieren der Tageswerte für Materialien und XP
function formatMaterialPerDay(value, resultObj) {
  if (!value) return '0';
  
  // Verwende die tatsächliche avgTime des jeweiligen Szenarios oder des Originals
  let avgRunTimeMinutes;
  if (resultObj && resultObj.avgTime) {
    avgRunTimeMinutes = resultObj.avgTime;
  } else {
    avgRunTimeMinutes = originalResults.value?.avgTime || 120;
  }
  
  // Berechne die Anzahl der Runs pro Tag
  const runsPerDay = 1440 / avgRunTimeMinutes; // 1440 Minuten pro Tag
  
  // Berechne den Wert pro Tag
  const valuePerDay = value * runsPerDay;
  
  return formatNumber(valuePerDay);
}

// Get upgrades for a specific scenario
function getScenarioUpgrades(scenarioIndex) {
  const upgrades = [];
  const increments = scenarioIncrements.value[scenarioIndex] || {};
  const availableUpgradesList = getAvailableUpgrades(selectedCurrency.value);
  
  Object.entries(increments).forEach(([key, levels]) => {
    if (levels > 0) {
      const upgrade = availableUpgradesList.find(u => u.key === key);
      if (upgrade) {
        upgrades.push({
          id: key,
          name: upgrade.label || upgrade.name || key,
          levels: levels
        });
      }
    }
  });
  
  return upgrades.sort((a, b) => a.name.localeCompare(b.name));
}

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
  } else if (key.startsWith('upgrades.inscryptions.')) {
    // Inscryption-Kosten
    const inscryptionId = key.split('.')[2]; // Extrahiert 'i80'
    
    return calcInscryptionCostDifference(inscryptionId, currentValue, currentValue + 1);
  } else if (key === 'proj' && props.hunterId === 'knox') {
    // Knox Salvo Multi-Currency-Kosten - wir müssen die aktuell ausgewählte Währung verwenden
    const currency = selectedCurrency.value;
    return calcKnoxSalvoCostDifference(currentValue, currentValue + 1, currency);
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
    'mat3': 'mat3',
    'hbm': 'mat3' // HBM wird von Borge's mat3 (Hellish Biomatter) produziert
  };
  
  return currencyMaterials[currencyType];
}

// Berechnungsfunktion für die Zeit - korrekt mit avgTime
function getCollectionTimeInMinutes(scenarioIndex) {
  const cost = scenarioCosts.value[scenarioIndex];
  if (cost <= 0) return 0;
  
  // Verbleibende Kosten unter Berücksichtigung des bereits gesammelten Betrags
  const remainingCost = Math.max(0, cost - currentCurrencyAmount.value);
  if (remainingCost <= 0) return 0; // Alles bereits gesammelt
  
  const currencyType = selectedCurrency.value;
  
  // Spezialfall: Fragments
  if (currencyType === 'frags') {
    if (!fragmentsPerDay.value || fragmentsPerDay.value <= 0) return Infinity;
    const daysNeeded = remainingCost / fragmentsPerDay.value;
    return daysNeeded * 1440; // In Minuten umrechnen
  }
  
  // Spezialfall: HBM (Hellish Biomatter) - verwendet Borge's Produktionsrate
  if (currencyType === 'hbm') {
    if (!hellishBiomatterPerDay.value || hellishBiomatterPerDay.value <= 0) return Infinity;
    const daysNeeded = remainingCost / hellishBiomatterPerDay.value;
    return daysNeeded * 1440; // In Minuten umrechnen
  }
  
  // Standardbehandlung für andere Währungen
  const materialType = getCurrencyMaterial(currencyType);
  
  if (!materialType || !originalResults.value || !originalResults.value[materialType]) {
    return Infinity;
  }
  
  // Material pro Run
  const materialPerRun = originalResults.value[materialType];
  if (materialPerRun <= 0) return Infinity;
  
  // Run-Dauer
  const avgRunTimeMinutes = originalResults.value.avgTime || 120;
  
  // Benötigte Runs
  const runsNeeded = remainingCost / materialPerRun;
  
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
  const selectedResult = comparisonResults.value.find(result => result.index === scenarioIndex);
  
  // Overrides und bereits berechnete Ergebnisse an den Parent-Komponenten senden
  emit('applyOverrides', {
    overrides: overrides,
    precomputedResults: selectedResult
  });

  // Modal schließen
  emit('close');
  
  // Ergebnisse von comparisonResults direkt leeren - damit wird die erste Bedingung false
  comparisonResults.value = [];
  
  // Zusätzliche Vorsichtsmaßnahme: hideResults auf true setzen
  hideResults.value = true;
}

// Berechnet die Min- und Max-Werte für den Slider basierend auf den Szenario-Kosten
function updateCurrencyRange() {
  const validCosts = scenarioCosts.value.filter(cost => cost > 0);
  if (validCosts.length === 0) {
    currencyMinMax.value = { min: 0, max: 0 };
    currentCurrencyAmount.value = 0;
    currentCurrencyPercentage.value = 0;
    return;
  }
  
  // Min ist 1% der niedrigsten Kosten, Max sind die höchsten Kosten
  const minCost = Math.min(...validCosts);
  const maxCost = Math.max(...validCosts);
  
  currencyMinMax.value = {
    min: minCost * 0.005, // 1% vom niedrigsten Wert
    max: maxCost
  };
  
  // Setze den aktuellen Wert auf 10% des Maximalwerts als Standardwert
  if (currentCurrencyAmount.value === 0 || currentCurrencyAmount.value > maxCost) {
    currentCurrencyAmount.value = 0; // 10% als Standardwert
    // Prozentsatz relativ zum Maximalwert berechnen
    currentCurrencyPercentage.value = Math.round((currentCurrencyAmount.value / maxCost) * 100);
  }
}

// Aktualisiert den Währungsbetrag basierend auf dem Prozentsatz
function updateCurrentCurrencyAmount() {
  const { min, max } = currencyMinMax.value;
  currentCurrencyAmount.value = (max - min) * (Number(currentCurrencyPercentage.value) / 100) + min;
}

// Gibt die höchsten Kosten aus allen Szenarien zurück
function getMaxScenarioCost() {
  const validCosts = scenarioCosts.value.filter(cost => cost > 0);
  return validCosts.length > 0 ? Math.max(...validCosts) : 0;
}

// Berechnet die verbleibende Zeit unter Berücksichtigung des bereits gesammelten Betrags
function getRemainingCollectionTime() {
  const currencyType = selectedCurrency.value;
  const maxCost = getMaxScenarioCost();
  
  // Wenn keine Kosten oder alles bereits gesammelt
  if (maxCost <= 0 || currentCurrencyAmount.value >= maxCost) {
    return 0;
  }
  
  // Verbleibende Kosten
  const remainingCost = maxCost - currentCurrencyAmount.value;
  
  // Spezialfall: Fragments
  if (currencyType === 'frags') {
    if (!fragmentsPerDay.value || fragmentsPerDay.value <= 0) return Infinity;
    const daysNeeded = remainingCost / fragmentsPerDay.value;
    return daysNeeded * 1440; // In Minuten umrechnen
  }
  
  // Standardbehandlung für andere Währungen
  const materialType = getCurrencyMaterial(currencyType);
  
  if (!materialType || !originalResults.value || !originalResults.value[materialType]) {
    return Infinity;
  }
  
  // Material pro Run
  const materialPerRun = originalResults.value[materialType];
  if (materialPerRun <= 0) return Infinity;
  
  // Run-Dauer
  const avgRunTimeMinutes = originalResults.value.avgTime || 120;
  
  // Benötigte Runs für die verbleibenden Kosten
  const runsNeeded = remainingCost / materialPerRun;
  
  // Gesamtzeit in Minuten
  return runsNeeded * avgRunTimeMinutes;
}

// Watch-Funktionen
// Überwacht Änderungen an isVisible und lädt Daten, wenn das Modal geöffnet wird
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    resetModalState(); // Explizit zurücksetzen bevor wir laden
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

watch(fragmentsPerDay, (newValue) => {
  if (newValue) {
    localStorage.setItem('fragments_per_day', newValue);
  }
});

// Watch für die Szenario-Kosten, um den Slider-Bereich anzupassen
watch(() => scenarioCosts.value, (newCosts) => {
  updateCurrencyRange();
}, { deep: true });

// Watch für ausgewählte Währung, um den Slider bei Tabwechsel zu aktualisieren
watch(() => selectedCurrency.value, () => {
  updateCurrencyRange();
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

/* Stil für die Icons */
img.w-4, img.w-3\.5 {
  object-fit: contain;
  display: inline-flex;
  vertical-align: middle;
}

input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type=range]::-webkit-slider-runnable-track {
  background-color: rgba(75, 85, 99, 0.5);
  border-radius: 0.25rem;
  height: 0.5rem;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  margin-top: -0.25rem;
  background-color: var(--color-blue-500, #3B82F6);
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
}

/* Firefox */
input[type=range]::-moz-range-track {
  background-color: rgba(75, 85, 99, 0.5);
  border-radius: 0.25rem;
  height: 0.5rem;
}

input[type=range]::-moz-range-thumb {
  background-color: var(--color-blue-500, #3B82F6);
  border: none;
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
}

/* Akzentfarbe dynamisch setzen */
.accent-red-500 {
  --color-accent: #EF4444;
}
.accent-green-500 {
  --color-accent: #10B981;
}
.accent-blue-500 {
  --color-accent: #3B82F6;
}

.no-arrows {
  /* Chrome, Safari, Edge, Opera */
  -webkit-appearance: none;
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield;
}

/* Für Webkit-Browser (Chrome, Safari) */
.no-arrows::-webkit-inner-spin-button, 
.no-arrows::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  margin: 0;
}

/* Für Firefox */
.no-arrows::-moz-number-spin-box {
  -moz-appearance: none;
}

/* Microsoft Edge spezifisch */
.no-arrows::-ms-clear {
  display: none;
}
</style>