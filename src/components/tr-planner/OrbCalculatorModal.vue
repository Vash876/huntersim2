<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="cancelAndClose"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700 modal-container"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-blue-400">TR Planner</span>
            <span class=""> - Orb Calculator</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="cancelAndClose"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Description Area -->
      <div class="p-3 bg-gray-750/60 border-b border-gray-700">
        <p class="text-xs text-gray-300">
          Calculate your Orb gains for the current TR. Set current and target levels for each boost.
        </p>
      </div>

      <!-- General Stats Panel -->
      <div class="p-3 border-b border-gray-700">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- TR Count -->
          <div class="bg-gray-750/60 rounded-md p-2 border border-transparent hover:border-gray-600">
            <div class="flex flex-col">
              <label class="text-xs font-medium text-gray-300 mb-1.5">TR Count</label>
              <div class="w-full flex items-center justify-start h-[33px]">
                <TRValueControls
                  :value="trCount"
                  :minValue="0"
                  :maxValue="999999"
                  :showFastControls="true"
                  :step="1"
                  :valueClass="'text-white'"
                  :autoEdit="true"
                  :tabIndex="1"
                  @update:value="(newVal) => {
                    trCount = newVal;
                    recalculateAll();
                  }"
                />
              </div>
            </div>
          </div>

          <!-- All-Time Orbs -->
          <div class="bg-gray-750/60 rounded-md p-2 border border-transparent hover:border-gray-600">
            <div class="flex flex-col">
              <label class="text-xs font-medium text-gray-300 mb-1 flex items-center">
                All-Time Orbs
                <InfoTooltip 
                  content="Enter your total orbs earned. You can use suffixes like k, m, b, t, etc."
                  placement="top"
                  class="ml-1"
                />
              </label>
              <input 
                v-model="allTimeOrbsInput"
                type="text"
                class="px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white"
                placeholder="0.00"
                tabindex="2"
                @input="updateAllTimeOrbs"
                @blur="finalizeAllTimeOrbsInput" 
                @keydown.enter="finalizeAllTimeOrbsInput"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Boost Controls - Verschoben vor die Ergebnistabelle -->
      <div class="p-3">
        <!-- Empty results message -->
        <div v-if="filteredBoostCategories.length === 0" class="py-4 text-center text-gray-400 text-sm">
          <template v-if="searchQuery">
            <p>No boosts match your search</p>
            <button 
              @click="clearSearch"
              class="mt-2 text-blue-400 text-xs hover:underline"
            >
              Clear search
            </button>
          </template>
          <template v-else>
            <p>No boosts available</p>
          </template>
        </div>
        
        <!-- Boost Categories -->
        <div 
          v-for="(category, categoryIndex) in filteredBoostCategories" 
          :key="`category_${category.id}`" 
          class="mb-4"
        >
          <!-- Category Header -->
          <div class="flex items-center mb-1">
            <div class="w-1.5 h-4 bg-blue-500 rounded-r mr-2"></div>
            <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
          </div>
          
          <!-- Boost Controls Compact List -->
          <div class="border border-gray-700 rounded-md overflow-hidden">
            <!-- Desktop-Ansicht - wie bisher -->
            <table class="w-full text-sm hidden sm:table">
              <thead>
                <tr class="bg-gray-750">
                  <th class="text-left py-1.5 px-2 w-[22%] text-xs text-gray-300">Boost</th>
                  <th class="text-center py-1.5 px-2 w-[18%] text-xs text-gray-300">Costs</th>
                  <th class="text-center py-1.5 px-2 w-[20%] text-xs text-gray-300">Multiplier</th>
                  <th class="text-center py-1.5 px-2 w-[20%] text-xs text-gray-300">Current</th>
                  <th class="text-center py-1.5 px-2 w-[20%] text-xs text-gray-300">Target</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="boost in category.boosts" 
                  :key="`boost_desktop_${boost.key}`" 
                  class="border-t border-gray-700 hover:bg-gray-700/30"
                >
                <td class="py-1.5 px-2 text-xs text-gray-200">
                  <div class="flex items-center">
                    <span>{{ boost.label }}</span>
                    
                    <!-- Info-Icon mit Tooltip anzeigen, wenn Tooltip oder Anforderungen vorhanden sind -->
                    <InfoTooltip 
                      v-if="hasTooltipContent(boost)"
                      :content="getFullTooltipContent(boost)"
                      placement="right"
                      class="ml-1"
                    />
                  </div>
                  <div v-if="getBoostMaxValue(boost, gemLevels) !== undefined" class="text-[10px] text-gray-400">Max: {{ getBoostMaxValue(boost, gemLevels) }}</div>
                </td>
                  
                  <!-- Neue Spalte für Kosten -->
                  <td class="py-1.5 px-2 text-center">
                    <!-- Hier den Tooltip für nicht verfügbare Boosts einfügen -->
                    <div v-if="calculateUpgradeCost(boost)" class="text-xs text-amber-400">
                      {{ calculateUpgradeCost(boost) }}
                    </div>
                    <div v-else class="text-xs text-gray-500">-</div>
                  </td>
                  <td class="py-1.5 px-2 text-center">
                    <div class="text-xs flex items-center justify-center space-x-1">
                      <span class="text-gray-300">
                        <!-- Spezialfall für hoursInTR -->
                        <template v-if="boost.key === 'hoursInTR'">
                          <span class="text-yellow-400 font-medium">
                            Cup-Multi: 
                            {{ formatMultiplier(getBoostMultiplier(boost, currentBoosts[boost.key] || 0)) }}
                          </span>
                        </template>
                        <!-- Boolean-Boosts: Zeige Multiplikator nur wenn aktiviert -->
                        <template v-else-if="boost.type === 'boolean'">
                          {{ currentBoosts[boost.key] ? formatMultiplier(boost.multiplier) : 'x1.00' }}
                        </template>
                        <!-- Standardfall für numerische Boosts -->
                        <template v-else>
                          {{ ensureFormattedMultiplier(getBoostMultiplier(boost, currentBoosts[boost.key] || 0)) }}
                        </template>
                      </span>
                      <IconArrowRight size="12" class="text-green-500" />
                      <span class="text-white">
                        <!-- Spezialfall für hoursInTR -->
                        <template v-if="boost.key === 'hoursInTR'">
                          <span class="text-yellow-400 font-medium">{{ formatMultiplier(getBoostMultiplier(boost, targetBoosts[boost.key] || 0, true)) }}</span>
                        </template>
                        <!-- Boolean-Boosts: Zeige Multiplikator nur wenn aktiviert -->
                        <template v-else-if="boost.type === 'boolean'">
                          {{ targetBoosts[boost.key] ? formatMultiplier(boost.multiplier) : 'x1.00' }}
                        </template>
                        <!-- Standardfall für numerische Boosts -->
                        <template v-else>
                          {{ ensureFormattedMultiplier(formatMultiplier(getBoostMultiplier(boost, targetBoosts[boost.key] || 0, true))) }}
                        </template>
                      </span>
                    </div>
                  </td>
                  <td class="py-1.5 px-2 text-center">
                    <!-- Boolean Current -->
                    <template v-if="boost.type === 'boolean'">
                      <button 
                        class="px-2 py-0.5 text-[11px] rounded-sm"
                        :class=" [
                          currentBoosts[boost.key] ? 'bg-green-700/50 text-green-300' : 'bg-gray-700 text-gray-400',
                          {'cursor-not-allowed opacity-50': !isBoostAvailable(boost, false)}
                        ]"
                        @click="isBoostAvailable(boost, false) && toggleCurrentBoolean(boost.key)"
                        :tabindex="isBoostAvailable(boost, false) ? getTabIndex(boost, 'current') : -1"  
                      >
                        {{ currentBoosts[boost.key] ? 'ON' : 'OFF' }}
                      </button>
                    </template>
                    
                    <!-- Numeric Current -->
                    <template v-else>
                      <div class="w-full flex justify-center">
                        <TRValueControls
                          :value="currentBoosts[boost.key] || 0"
                          :minValue="0"
                          :maxValue="getBoostMaxValue(boost, gemLevels) || 999999"
                          :showFastControls="true"
                          :step="boost.normalControl || 1"
                          :fastStep="boost.fastControl || 10"
                          :valueClass="isBoostAvailable(boost, false) ? 'text-gray-300' : 'text-gray-500'"
                          :compact="true"
                          :autoEdit="true" 
                          :tabIndex="isBoostAvailable(boost, false) ? getTabIndex(boost, 'current') : -1"
                          :disabled="!isBoostAvailable(boost, false)"  
                          :buttonClass="isBoostAvailable(boost, false) ? '' : 'opacity-50 cursor-not-allowed'"
                          @update:value="(newVal) => isBoostAvailable(boost, false) && updateBoostCurrent(boost, newVal)"
                        />
                      </div>
                    </template>
                  </td>
                  <td class="py-1.5 px-2 text-center">
                    <!-- Boolean Target -->
                    <template v-if="boost.type === 'boolean'">
                      <button 
                        @click="isBoostAvailable(boost, true) && toggleTargetBoolean(boost.key)"
                        class="px-2 py-0.5 text-[11px] rounded-sm"
                        :class="{
                          'bg-green-600 hover:bg-green-500 text-white': targetBoosts[boost.key],
                          'bg-gray-700 hover:bg-gray-600 text-white': !targetBoosts[boost.key],
                          'opacity-75 cursor-default': currentBoosts[boost.key],
                          'opacity-50 cursor-not-allowed': !isBoostAvailable(boost, true)
                        }"
                        :disabled="currentBoosts[boost.key] || !isBoostAvailable(boost, true)"
                        :tabindex="isBoostAvailable(boost, true) ? getTabIndex(boost, 'target') : -1" 
                      >
                        {{ targetBoosts[boost.key] ? 'ON' : 'OFF' }}
                      </button>
                    </template>
                    
                    <!-- Numeric Target -->
                    <template v-else>
                      <div class="w-full flex justify-center">
                        <TRValueControls
                          :value="targetBoosts[boost.key] || 0"
                          :minValue="0"  
                          :maxValue="getBoostMaxValue(boost, gemLevels) || 999999"
                          :showFastControls="true"
                          :step="boost.normalControl || 1"
                          :fastStep="boost.fastControl || 10"
                          :valueClass="isBoostAvailable(boost, true) ? 'text-white' : 'text-gray-500'"
                          :compact="true"
                          :autoEdit="true"  
                          :tabIndex="isBoostAvailable(boost, true) ? getTabIndex(boost, 'target') : -1"
                          :validateOnFinalOnly="true"
                          :disabled="!isBoostAvailable(boost, true)"
                          :buttonClass="isBoostAvailable(boost, true) ? '' : 'opacity-50 cursor-not-allowed'"
                          class="tr-value-control"
                          :class="{ 
                            'tr-improved-value': (targetBoosts[boost.key] || 0) > (currentBoosts[boost.key] || 0) && isBoostAvailable(boost, true),
                            'tr-min-value': (targetBoosts[boost.key] || 0) <= (currentBoosts[boost.key] || 0) || !isBoostAvailable(boost, true)
                          }" 
                          @update:raw-value="(newVal) => isBoostAvailable(boost, true) && updateRawTargetValue(boost, newVal)"
                          @finalize:value="() => isBoostAvailable(boost, true) && finalizeTargetValue(boost)"
                          @blur="() => isBoostAvailable(boost, true) && finalizeTargetValue(boost)"
                        />
                      </div>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Mobile-Ansicht - vereinfacht und kompakt -->
            <div class="sm:hidden">
              <div 
                v-for="boost in category.boosts" 
                :key="`boost_mobile_${boost.key}`" 
                class="border-t border-gray-700 hover:bg-gray-700/30 p-2"
              >
                <div class="flex flex-col">
                  <!-- Boost-Name und Multiplier nebeneinander -->
                  <div class="mb-1.5 flex justify-between items-center">
                    <div class="flex items-center">
                      <div class="text-xs font-medium text-gray-200">{{ boost.label }}</div>
                      
                      <!-- Info-Icon mit Tooltip anzeigen, wenn Tooltip oder Anforderungen vorhanden sind -->
                      <InfoTooltip 
                        v-if="hasTooltipContent(boost)"
                        :content="getFullTooltipContent(boost)"
                        placement="right"
                        class="ml-1"
                      />
                    </div>
                    
                    <div v-if="getBoostMaxValue(boost, gemLevels) !== undefined" class="text-[10px] text-gray-400">Max: {{ getBoostMaxValue(boost, gemLevels) }}</div>
                    
                    <!-- Multiplier rechts anzeigen -->
                    <div class="text-xs text-right">
                      <!-- Spezialfall für hoursInTR -->
                      <template v-if="boost.key === 'hoursInTR'">
                        <span class="text-yellow-400 font-medium">
                          {{ formatMultiplier(getBoostMultiplier(boost, targetBoosts[boost.key] || 0, true)) }}
                        </span>
                      </template>
                      <!-- Boolean-Boosts: Zeige Multiplikator nur wenn aktiviert -->
                      <template v-else-if="boost.type === 'boolean'">
                        <span :class="targetBoosts[boost.key] ? 'text-green-400' : 'text-gray-500'">
                          {{ targetBoosts[boost.key] ? formatMultiplier(boost.multiplier) : 'x1.00' }}
                        </span>
                      </template>
                      <!-- Standardfall für numerische Boosts -->
                      <template v-else>
                        <span class="text-gray-400">
                          {{ ensureFormattedMultiplier(getBoostMultiplier(boost, currentBoosts[boost.key] || 0)) }}
                        </span>
                        <span class="mx-1 text-green-500">→</span>
                        <span class="text-white">
                          {{ ensureFormattedMultiplier(formatMultiplier(getBoostMultiplier(boost, targetBoosts[boost.key] || 0, true))) }}
                        </span>
                      </template>
                    </div>
                  </div>
                  
                  <!-- Current und Target untereinander -->
                  <div class="flex flex-col gap-2">
                    <!-- Current -->
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-400 mr-2">Current</span>
                      
                      <!-- Boolean Current -->
                      <template v-if="boost.type === 'boolean'">
                        <button 
                          class="px-2 py-0.5 text-[11px] rounded-sm"
                          :class=" [
                            currentBoosts[boost.key] ? 'bg-green-700/50 text-green-300' : 'bg-gray-700 text-gray-400',
                            {'cursor-not-allowed opacity-50': !isBoostAvailable(boost, false)}
                          ]"
                          @click="isBoostAvailable(boost, false) && toggleCurrentBoolean(boost.key)"
                          :tabindex="isBoostAvailable(boost, false) ? getTabIndex(boost, 'current') : -1"  
                        >
                          {{ currentBoosts[boost.key] ? 'ON' : 'OFF' }}
                        </button>
                      </template>
                      
                      <!-- Numeric Current -->
                      <template v-else>
                        <div class="flex justify-end w-32"> <!-- Feste Breite und rechtsbündige Ausrichtung -->
                          <TRValueControls
                            :value="currentBoosts[boost.key] || 0"
                            :minValue="0"
                            :maxValue="getBoostMaxValue(boost, gemLevels) || 999999"
                            :showFastControls="true"
                            :step="boost.normalControl || 1"
                            :fastStep="boost.fastControl || 10"
                            :valueClass="isBoostAvailable(boost, false) ? 'text-gray-300' : 'text-gray-500'"
                            :compact="true"
                            :autoEdit="true" 
                            :tabIndex="isBoostAvailable(boost, false) ? getTabIndex(boost, 'current') : -1"
                            :disabled="!isBoostAvailable(boost, false)"  
                            :buttonClass="isBoostAvailable(boost, false) ? '' : 'opacity-50 cursor-not-allowed'"
                            @update:value="(newVal) => isBoostAvailable(boost, false) && updateBoostCurrent(boost, newVal)"
                          />
                        </div>
                      </template>
                    </div>
                    
                    <!-- Target -->
                    <div class="flex items-center">
                      <div class="flex items-center">
                        <span class="text-xs text-gray-400 mr-2">Target</span>
                        
                        <!-- Kostenanzeige für numerische Boosts -->
                        <span v-if="calculateUpgradeCost(boost)" class="text-[10px] text-amber-400 mr-2">
                          Cost: {{ calculateUpgradeCost(boost) }}
                        </span>
                      </div>
                      
                      <div class="flex-grow"></div>
                      
                      <!-- Boolean Target -->
                      <template v-if="boost.type === 'boolean'">
                        <button 
                          @click="toggleTargetBoolean(boost.key)"
                          class="px-2 py-0.5 text-[11px] rounded-sm"
                          :class="{
                            'bg-green-600 hover:bg-green-500 text-white': targetBoosts[boost.key],
                            'bg-gray-700 hover:bg-gray-600 text-white': !targetBoosts[boost.key],
                            'opacity-75 cursor-default': currentBoosts[boost.key]
                          }"
                          :disabled="currentBoosts[boost.key]"
                          :tabindex="getTabIndex(boost, 'target')" 
                        >
                          {{ targetBoosts[boost.key] ? 'ON' : 'OFF' }}
                        </button>
                      </template>
                      
                      <!-- Numeric Target -->
                      <template v-else>
                        <div class="flex justify-end">
                          <TRValueControls
                            :value="targetBoosts[boost.key] || 0"
                            :minValue="0"  
                            :maxValue="getBoostMaxValue(boost, gemLevels) || 999999"
                            :showFastControls="true"
                            :step="boost.normalControl || 1"
                            :fastStep="boost.fastControl || 10"
                            :valueClass="isBoostAvailable(boost, true) ? 'text-white' : 'text-gray-500'"
                            :compact="true"
                            :autoEdit="true"  
                            :tabIndex="isBoostAvailable(boost, true) ? getTabIndex(boost, 'target') : -1"
                            :validateOnFinalOnly="true"
                            :disabled="!isBoostAvailable(boost, true)"
                            :buttonClass="isBoostAvailable(boost, true) ? '' : 'opacity-50 cursor-not-allowed'"
                            class="tr-value-control"
                            :class="{ 
                              'tr-improved-value': (targetBoosts[boost.key] || 0) > (currentBoosts[boost.key] || 0) && isBoostAvailable(boost, true),
                              'tr-min-value': (targetBoosts[boost.key] || 0) <= (currentBoosts[boost.key] || 0) || !isBoostAvailable(boost, true)
                            }" 
                            @update:raw-value="(newVal) => isBoostAvailable(boost, true) && updateRawTargetValue(boost, newVal)"
                            @finalize:value="() => isBoostAvailable(boost, true) && finalizeTargetValue(boost)"
                            @blur="() => isBoostAvailable(boost, true) && finalizeTargetValue(boost)"
                          />
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Panel - kompakter für mobile Ansicht -->
      <div class="sticky bottom-[52px] z-10 p-2 sm:p-3 border-t border-gray-700 bg-gray-800 shadow-lg">
        <!-- Mobile View (kompakte Version) -->
        <div class="flex items-center justify-between sm:hidden">
          <div class="flex flex-col text-center px-1">
            <span class="text-xs text-gray-400">TR Req</span>
            <span class="text-sm font-bold text-white">{{ formatNumber(orbRequirement) }}</span>
          </div>
          
          <div class="h-10 border-l border-gray-600 mx-1"></div>
          
          <div class="flex flex-col text-center px-1">
            <span class="text-xs text-gray-400">Current</span>
            <span class="text-sm font-bold text-white">{{ formatNumber(currentOrbGains) }}</span>
          </div>
          
          <div class="h-10 border-l border-gray-600 mx-1"></div>
          
          <div class="flex flex-col text-center px-1">
            <span class="text-xs text-gray-400">Target</span>
            <span class="text-sm font-bold" :class="targetOrbGains >= orbRequirement ? 'text-green-400' : 'text-red-400'">
              {{ formatNumber(targetOrbGains) }}
            </span>
          </div>
          
          <div class="h-10 border-l border-gray-600 mx-1"></div>
          
          <div class="flex flex-col text-center px-1">
            <span class="text-xs text-gray-400">End TR</span>
            <span class="text-xs font-bold text-blue-400">{{ endOfTRFormatted }}</span>
          </div>
        </div>
        
        <!-- Desktop View (bestehende Version) -->
        <div class="hidden sm:grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div class="bg-gray-800/70 rounded-lg border border-gray-700 p-2">
            <h3 class="text-xs font-medium text-gray-300 mb-1">TR Requirement</h3>
            <div class="text-lg font-bold text-white">{{ formatNumber(orbRequirement) }}</div>
            <div class="mt-0.5 text-xs text-gray-400">
              Required Orbs for TR {{ trCount }}
            </div>
          </div>
          
          <div class="bg-gray-800/70 rounded-lg border border-gray-700 p-2">
            <h3 class="text-xs font-medium text-gray-300 mb-1">Current Orb Gain</h3>
            <div class="text-lg font-bold text-white">{{ formatNumber(currentOrbGains) }}</div>
            <div class="mt-0.5 text-xs text-gray-400">
              With current boost levels
            </div>
          </div>
          
          <div class="bg-gray-800/70 rounded-lg border border-gray-700 p-2">
            <h3 class="text-xs font-medium text-gray-300 mb-1">Target Orb Gain</h3>
            <div class="text-lg font-bold" :class="targetOrbGains >= orbRequirement ? 'text-green-400' : 'text-red-400'">
              {{ formatNumber(targetOrbGains) }}
            </div>
            <div class="mt-0.5 text-xs" :class="targetOrbGains >= orbRequirement ? 'text-green-500' : 'text-red-400'">
              <template v-if="targetOrbGains >= orbRequirement">
                <IconCircleCheck size="14" class="inline mr-1" />
                Requirement met (+{{ formatNumber(targetOrbGains - orbRequirement) }})
              </template>
              <template v-else>
                <IconCircleX size="14" class="inline mr-1" />
                {{ formatNumber(orbRequirement - targetOrbGains) }} orbs missing
              </template>
            </div>
          </div>
          
          <div class="bg-gray-800/70 rounded-lg border border-gray-700 p-2">
            <h3 class="text-xs font-medium text-gray-300 mb-1">End of TR</h3>
            <div class="text-lg font-bold text-blue-400">{{ endOfTRFormatted }}</div>
            <div class="mt-0.5 text-xs text-gray-400">
              <template v-if="endOfTR && targetHoursInTR > hoursInTR">
                Target: {{ targetHoursInTR }}h total
              </template>
              <template v-else>
                Set target hours to calculate
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer buttons - Ersetze den existierenden Footer-Bereich -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <div v-if="showCreateOptions" class="absolute bottom-[60px] left-3 bg-gray-700 rounded-md shadow-lg border border-gray-600 p-2 animate-fade-in">
              <div class="mb-1 text-xs text-gray-300 font-medium">Create plan using:</div>
              <div class="flex flex-col gap-1">
                <button 
                  @click="createPlanWithCurrentValues()"
                  class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs flex items-center"
                >
                  <IconCircleCheck size="14" class="mr-1" />
                  Current Values
                </button>
                <button 
                  @click="createPlanWithTargetValues()"
                  class="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md text-xs flex items-center"
                >
                  <IconArrowRight size="14" class="mr-1" />
                  Target Values
                </button>
              </div>
            </div>
            
            <button 
              @click="toggleCreateOptions"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs flex items-center"
            >
              <IconPlus size="14" class="mr-1" />
              Create New Plan
            </button>
          </div>
          
          <div class="flex gap-2">
            <button
              @click="showBoostOverview = true"
              class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs flex items-center"
            >
              <IconSearch size="14" class="mr-1" />
              TR Overview
            </button>
            
            <button 
              @click="resetForm"
              class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <BoostOverviewModal 
    v-if="showBoostOverview" 
    :isVisible="showBoostOverview"
    :currentStats="currentBoosts"
    :targetStats="targetBoosts"
    :trCount="trCount"
    :allTimeOrbs="allTimeOrbs"
    :orbRequirement="orbRequirement"
    :orbGain="currentOrbGains"
    :targetOrbGain="targetOrbGains"
    @close="showBoostOverview = false" 
  />
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue';
import BoostOverviewModal from './BoostOverviewModal.vue';
import { useTRPlannerStore } from '@/store/orbStore';
import { allBoosts, boostsByCategory } from '@/constants/tr-planner';
import { getGemDataFromLocalStorage } from '@/utils/gemDataUtils.js';
import TRValueControls from '@/composables/TRValueControls.vue';
import { formatMultiplier, formatNumber, parseNumberWithSuffix, formatSuffixNotation } from '@/composables/format';
import { getRelicCost, formatRelicCost } from '@/utils/relicCostUtils';
import { getInscryptionCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { getM0Cost, formatM0Cost, calculateM0CostRangeSafe } from '@/utils/m0CostUtils';
import { LOOP_MODS, getLoopModCost, formatLoopModCost, calculateLoopModCostRangeSafe } from '@/utils/loopModCostUtils';
import { 
  calculateOrbRequirement, 
  calculateOrbGainsCalc, 
  calculateMissingHours,
  calculateCupMultiplier,  
  calculateMultiplier      
} from '@/composables/calculations';
import { getGemDataFromStore, getBoostMaxValue } from '@/constants/tr-planner/index.js';
import { 
  IconX,
  IconSearch,
  IconCircleCheck,
  IconCircleX,
  IconAlertCircle,
  IconArrowRight,
  IconPlus,
  IconLock
} from '@tabler/icons-vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';


const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  currentStats: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'openNewPlan']);

// State - Verwende Store statt lokale refs
const searchQuery = ref('');
const showBoostOverview = ref(false);
const showCreateOptions = ref(false);
const isPlanValid = ref(false);
const isEditingAllTimeOrbs = ref(false);
const allTimeOrbsRawInput = ref("");
const trStartTimestamp = ref(null);

const trPlannerStore = useTRPlannerStore();

// Store-basierte reactive properties
const trCount = computed({
  get() {
    return trPlannerStore.orbCalculator.trCount;
  },
  set(value) {
    trPlannerStore.updateOrbCalculatorTRCount(value);
  }
});

const allTimeOrbs = computed({
  get() {
    return trPlannerStore.orbCalculator.allTimeOrbs;
  },
  set(value) {
    trPlannerStore.updateOrbCalculatorAllTimeOrbs(value);
  }
});

const currentBoosts = computed({
  get() {
    return trPlannerStore.orbCalculator.currentBoosts;
  },
  set(value) {
    trPlannerStore.updateOrbCalculatorCurrentBoosts(value);
  }
});

const targetBoosts = computed({
  get() {
    return trPlannerStore.orbCalculator.targetBoosts;
  },
  set(value) {
    trPlannerStore.updateOrbCalculatorTargetBoosts(value);
  }
});

const allTimeOrbsDisplay = computed({
  get() {
    return formatSuffixNotation(allTimeOrbs.value);
  },
  set(value) {
    // Wird über allTimeOrbsInput verwaltet
  }
});

// Gem-Levels aus dem Store laden
const gemLevels = computed(() => {
  // Immer die neuesten Gem-Daten direkt aus localStorage laden
  const gemData = getGemDataFromLocalStorage();
  return gemData.levels || {
    exodus: 0,
    temporal: 0,
    innovation: 0,
    attraction: 0,
    power: 0,
    creation: 0,
    evolution: 0
  };
});

// GEÄNDERT: Reactive computed für aktive Nodes
const activeNodes = computed(() => {
  const gemData = getGemDataFromLocalStorage();
  return gemData.activeNodes || {
    temporal: [],
    innovation: [],
    attraction: [],
    power: [],
    creation: [],
    evolution: []
  };
});

// Die hoursInTR Werte über computed properties zugänglich machen
const hoursInTR = computed({
  get() {
    return currentBoosts.value.hoursInTR || 0;
  },
  set(value) {
    currentBoosts.value.hoursInTR = value;
    // Wenn ein neuer Wert für hoursInTR gesetzt wird, speichere die aktuelle Zeit
    if (value > 0) {
      trStartTimestamp.value = Date.now();
    }
    recalculateAll();
  }
});

const targetHoursInTR = computed({
  get() {
    return targetBoosts.value.hoursInTR || hoursInTR.value;
  },
  set(value) {
    targetBoosts.value.hoursInTR = value;
    recalculateAll();
  }
});

// Berechne das End of TR basierend auf aktueller Zeit und Target Hours
const endOfTR = computed(() => {
  console.log('🔍 EndOfTR Debug:', {
    trStartTimestamp: trStartTimestamp.value,
    targetHoursInTR: targetHoursInTR.value,
    currentHours: hoursInTR.value,
    targetBoostsHours: targetBoosts.value.hoursInTR,
    currentBoostsHours: currentBoosts.value.hoursInTR
  });
  
  const currentHours = hoursInTR.value || 0;
  const targetHours = targetHoursInTR.value;
  
  // Wenn noch kein Timestamp gesetzt wurde, aber current hours vorhanden sind, setze jetzt einen
  if (!trStartTimestamp.value && currentHours > 0) {
    trStartTimestamp.value = Date.now();
    console.log('🕐 TR Start timestamp automatisch gesetzt:', trStartTimestamp.value);
  }
  
  // Prüfe Grundvoraussetzungen
  if (!trStartTimestamp.value) {
    console.log('❌ Kein trStartTimestamp');
    return null;
  }
  
  if (!targetHours || targetHours <= 0) {
    console.log('❌ Keine target hours oder <= 0:', targetHours);
    return null;
  }
  
  if (targetHours <= currentHours) {
    console.log('❌ Target hours <= current hours:', targetHours, '<=', currentHours);
    return null; // Kein zukünftiges Ende, wenn Target bereits erreicht
  }
  
  // Berechne verbleibende Stunden
  const remainingHours = targetHours - currentHours;
  
  // Berechne End-Zeit: Jetzt + verbleibende Stunden
  const endTimestamp = Date.now() + (remainingHours * 60 * 60 * 1000);
  
  console.log('✅ End of TR berechnet:', {
    remainingHours,
    endTimestamp: new Date(endTimestamp)
  });
  
  return new Date(endTimestamp);
});

// Formatiere End of TR Zeit für Anzeige
const endOfTRFormatted = computed(() => {
  const currentHours = hoursInTR.value || 0;
  const targetHours = targetHoursInTR.value;
  
  // Debug-Ausgabe
  console.log('🎯 EndOfTRFormatted Debug:', {
    endOfTR: endOfTR.value,
    currentHours,
    targetHours
  });
  
  if (!endOfTR.value) {
    // Gebe spezifischere Hinweise zurück
    if (!currentHours) {
      return 'Set current hours';
    }
    if (!targetHours || targetHours <= 0) {
      return 'Set target hours';
    }
    if (targetHours <= currentHours) {
      return 'Target reached';
    }
    return 'Not calculated';
  }
  
  const now = new Date();
  const end = endOfTR.value;
  
  // Prüfe ob es heute oder morgen ist
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  // Verwende die Browser-Locale des Nutzers für automatische Lokalisierung
  const userLocale = navigator.language || 'en-EN';
  
  const timeStr = end.toLocaleTimeString(userLocale, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  if (endDate.getTime() === today.getTime()) {
    return `Today ${timeStr}`;
  } else if (endDate.getTime() === tomorrow.getTime()) {
    return `Tomorrow ${timeStr}`;
  } else {
    return end.toLocaleDateString(userLocale, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
});

// Filter for multiplier-only boosts
const multiplierBoosts = computed(() => {
  return allBoosts.filter(boost => {
    // Only include boosts that have a multiplier (not just fragmulti)
    return boost.multiplier !== undefined;
  });
});

// Berechnete Properties
const allTimeOrbsInput = computed({
  get() {
    return isEditingAllTimeOrbs.value ? allTimeOrbsRawInput.value : allTimeOrbsDisplay.value;
  },
  set(value) {
    if (isEditingAllTimeOrbs.value) {
      allTimeOrbsRawInput.value = value;
    } else {
      allTimeOrbsDisplay.value = value;
    }
  }
});

const orbRequirement = computed(() => {
  return calculateOrbRequirement(trCount.value, allTimeOrbs.value);
});

const effectiveStats = computed(() => {
  const stats = { ...maxLevelStats.value };
  
  // Gem-Daten hinzufügen
  const gemData = getGemDataFromLocalStorage();
  stats.gemData = gemData;
  
  // KORRIGIERT: Boolean-Merge-Logik für maxed boosts
  Object.entries(currentBoosts.value).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Für Boolean-Werte: Spezielle Merge-Logik
      if (typeof value === 'boolean') {
        // Wenn maxLevelStats true ist und currentBoosts false ist,
        // dann ist der Boost in StatsInputModal maxed aber im OrbCalc deaktiviert
        const isMaxedInStatsInput = maxLevelStats.value[key] === true;
        const isCurrentlyDisabled = value === false;
        
        if (isMaxedInStatsInput && isCurrentlyDisabled) {
          // Verwende maxLevelStats (true), ignoriere currentBoosts (false)
          stats[key] = true;
          console.log(`Boolean Boost ${key}: maxed in StatsInput, ignoriere currentBoosts false`);
        } else {
          // Normal: verwende currentBoosts
          stats[key] = value;
        }
      }
      // Für numerische Werte: Maximum nehmen
      else if (typeof value === 'number') {
        stats[key] = Math.max(stats[key] || 0, value);
      } 
      // Für andere Werte: Direkt setzen
      else {
        stats[key] = value;
      }
    }
  });
  
  // WICHTIG: Für alle Boosts, die NICHT in currentBoosts definiert sind,
  // verwende die Werte aus maxLevelStats
  allBoosts.forEach(boost => {
    // Nur wenn der Boost nicht explizit in currentBoosts gesetzt ist
    if (currentBoosts.value[boost.key] === undefined) {
      // UND wenn der Boost einen Wert in maxLevelStats hat
      if (maxLevelStats.value[boost.key] !== undefined) {
        stats[boost.key] = maxLevelStats.value[boost.key];
        console.log(`Boost ${boost.key} aus maxLevelStats übernommen: ${stats[boost.key]}`);
      }
    }
  });
  
  console.log("Effektive Stats (Current) - vb1-5 nach Boolean-Merge:", {
    vb1: stats.vb1,
    vb2: stats.vb2,
    vb3: stats.vb3,
    vb4: stats.vb4,
    vb5: stats.vb5
  });
  
  return stats;
});

const effectiveTargetStats = computed(() => {
  const stats = { ...maxLevelStats.value };
  
  // WICHTIG: Immer frische Gem-Daten hinzufügen
  const gemData = getGemDataFromLocalStorage();
  stats.gemData = gemData; // Für calculations.js verfügbar machen
  
  // Rest der Logik...
  Object.entries(currentBoosts.value).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'number') {
        stats[key] = Math.max(stats[key] || 0, value);
      } else {
        stats[key] = value;
      }
    }
  });
  
  Object.entries(targetBoosts.value).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'number') {
        stats[key] = Math.max(stats[key] || 0, value);
      } else {
        stats[key] = value;
      }
    }
  });
  
  return stats;
});

const currentOrbGains = computed(() => {
  try {
    // Verwende effectiveStats, das bereits die maximierten Boosts enthält
    const planStats = { ...effectiveStats.value };
    
    // KORRIGIERT: Nur Boosts mit orbcalc=true UND multiplier verwenden
    const orbCalcBoosts = allBoosts.filter(b => b.orbcalc && b.multiplier !== undefined);
    
    console.log("Current calculation - using boosts:", orbCalcBoosts.map(b => b.key));
    console.log("Current calculation - planStats:", planStats);
    
    // Orb-Multiplikator berechnen
    const result = calculateOrbGainsCalc(
      effectiveStats.value,
      planStats,
      orbCalcBoosts
    );
    
    console.log("Current orb gains result:", result);
    return isNaN(result) ? 0 : result;
  } catch (e) {
    console.error("Error calculating current orb gains:", e);
    return 0;
  }
});

const targetOrbGains = computed(() => {
  try {
    // Verwende effectiveTargetStats, das bereits alle maximierten Boosts enthält
    const targetPlan = { ...effectiveTargetStats.value };
    
    // KORRIGIERT: Nur Boosts mit orbcalc=true UND multiplier verwenden
    const orbCalcBoosts = allBoosts.filter(b => b.orbcalc && b.multiplier !== undefined);
    
    console.log("Target calculation - using boosts:", orbCalcBoosts.map(b => b.key));
    console.log("Target calculation - targetPlan:", targetPlan);
    
    // Berechne die Orb-Gewinne mit den Ziel-Boosts
    const result = calculateOrbGainsCalc(
      effectiveStats.value,
      targetPlan,
      orbCalcBoosts
    );
    
    console.log("Target orb gains result:", result);
    return isNaN(result) ? 0 : result;
  } catch (e) {
    console.error("Error calculating targetOrbGains:", e);
    return 0;
  }
});

const missingHours = computed(() => {
  if (targetOrbGains.value >= orbRequirement.value) {
    return 0;
  }
  
  try {
    return calculateMissingHours(
      hoursInTR.value,
      orbRequirement.value,
      effectiveStats.value,              
      effectiveTargetStats.value,        
      multiplierBoosts.value,
      1000
    );
  } catch (e) {
    console.error("Error calculating missing hours:", e);
    return 0;
  }
});

// Reaktive Referenz für maxLevelStats mit Event-basierter Aktualisierung
const maxLevelStats = ref({});

// Funktion zum Laden der maxLevelStats aus localStorage
function loadMaxLevelStats() {
  try {
    const storedStats = localStorage.getItem('trplanner_userstats');
    if (storedStats) {
      const parsed = JSON.parse(storedStats);
      maxLevelStats.value = parsed;
      console.log("maxLevelStats neu geladen:", parsed);
      return parsed;
    }
  } catch (e) {
    console.error("Error reading maxLevelStats from localStorage:", e);
  }
  
  // Wichtig: Wenn keine Daten im localStorage sind, verwende die Werte aus props.currentStats
  const fallback = props.currentStats || {};
  maxLevelStats.value = fallback;
  return fallback;
}

// Event-Handler für maxLevelStats-Änderungen
function handleMaxLevelStatsChanged(event) {
  console.log("🔄 maxLevelStats geändert - aktualisiere OrbCalculator");
  const oldStats = JSON.stringify(maxLevelStats.value);
  const oldGemLevels = JSON.stringify(gemLevels.value);
  
  loadMaxLevelStats();
  
  const newStats = JSON.stringify(maxLevelStats.value);
  const newGemLevels = JSON.stringify(gemLevels.value);
  
  const statsChanged = oldStats !== newStats;
  const gemLevelsChanged = oldGemLevels !== newGemLevels;
  
  if (statsChanged || gemLevelsChanged) {
    console.log("📊 Daten haben sich tatsächlich geändert");
    if (statsChanged) {
      console.log("Alt maxLevelStats:", JSON.parse(oldStats));
      console.log("Neu maxLevelStats:", maxLevelStats.value);
    }
    if (gemLevelsChanged) {
      console.log("Alt gemLevels:", JSON.parse(oldGemLevels));
      console.log("Neu gemLevels:", gemLevels.value);
    }
    
    // WICHTIG: Invalidiere alle cached Berechnungen
    invalidateCalculationCaches();
    
    // Force recalculation
    nextTick(() => {
      recalculateAll();
      console.log("✅ Neuberechnung abgeschlossen");
    });
  } else {
    console.log("⚠️ Event empfangen, aber keine Änderung erkannt");
  }
}

// Neue Funktion zum Invalidieren von Cache
function invalidateCalculationCaches() {
  console.log("🗑️ Invalidiere Calculation Caches");
  
  // Force refresh der computed properties durch shallow copy
  const currentGemData = getGemDataFromLocalStorage();
  
  // Trigger reactivity für alle gem-abhängigen computed properties
  // Dies zwingt Vue, alle abhängigen computed properties neu zu berechnen
  if (JSON.stringify(currentGemData) !== JSON.stringify(gemLevels.value)) {
    console.log("📦 Gem-Daten haben sich geändert, trigger Reaktivität");
  }
}

const filteredBoostCategories = computed(() => {
  // WICHTIG: Explizite Abhängigkeit zu gemLevels.value und maxLevelStats.value
  const currentGemLevels = gemLevels.value;
  const currentMaxStats = maxLevelStats.value;
  
  console.log("🔍 Filtere Boosts mit Daten:", {
    currentGemLevels,
    currentMaxStats: Object.keys(currentMaxStats).length,
    totalBoosts: allBoosts.length
  });
  
  return boostsByCategory
    .map(category => {
      const newCategory = { ...category };
      
      newCategory.boosts = category.boosts.filter(boost => {
        // Nur Boosts mit Multiplikator anzeigen
        if (boost.multiplier === undefined) {
          return false;
        }
        
        // WICHTIG: Gem-Abhängigkeiten prüfen mit aktuellen Gem-Levels
        if (boost.unlock) {
          const requiredGem = boost.unlock;
          const requiredLevel = boost.unlock_level || 1;
          const currentGemLevel = currentGemLevels[requiredGem] || 0;
          
          if (currentGemLevel < requiredLevel) {
            console.log(`🔒 Boost ${boost.key} ausgeblendet: ${requiredGem} Level ${currentGemLevel} < ${requiredLevel}`);
            return false;
          } else {
            console.log(`✅ Boost ${boost.key} freigeschalten: ${requiredGem} Level ${currentGemLevel} >= ${requiredLevel}`);
          }
        }
        
        // VEREINFACHTE Filter-Logik für maxed boosts
        const isMaxedInStatsInput = (() => {
          // Für numerische Boosts mit Maximum
          const maxValue = getBoostMaxValue(boost, gemLevels.value);
          if (boost.type === 'number' && maxValue !== undefined) {
            const globalLevel = currentMaxStats[boost.key];
            if (globalLevel !== undefined && globalLevel >= maxValue) {
              console.log(`📊 Numerischer Boost ${boost.key} ist maxed: ${globalLevel} >= ${maxValue}`);
              return true;
            }
          }
          
          // Für Boolean Boosts
          if (boost.type === 'boolean') {
            if (currentMaxStats[boost.key] === true) {
              console.log(`✅ Boolean Boost ${boost.key} ist maxed: true`);
              return true;
            }
          }
          
          return false;
        })();
        
        // Wenn der Boost in StatsInputModal maxed ist, verstecke ihn
        if (isMaxedInStatsInput) {
          console.log(`🚫 Boost ${boost.key} wird versteckt: maxed in StatsInputModal`);
          return false;
        }
        
        // Search filter
        if (searchQuery.value.trim()) {
          const query = searchQuery.value.toLowerCase();
          const matches = boost.label.toLowerCase().includes(query) || 
                         boost.key.toLowerCase().includes(query);
          if (!matches) {
            console.log(`🔍 Boost ${boost.key} durch Suche ausgeblendet`);
          }
          return matches;
        }
        
        console.log(`✅ Boost ${boost.key} wird angezeigt`);
        return true;
      });
      
      return newCategory;
    })
    .filter(category => category.boosts.length > 0)
    .map(category => {
      console.log(`📂 Kategorie ${category.label}: ${category.boosts.length} Boosts`);
      return category;
    });
});

// Methods
function initData() {
  // Prüfe ob bereits Daten im Store vorhanden sind
  if (trPlannerStore.orbCalculator.trCount > 0 || Object.keys(trPlannerStore.orbCalculator.currentBoosts).length > 0) {
    // Store hat bereits Daten - diese verwenden
    console.log("OrbCalculator: Loading existing data from store");
    
    // HINZUGEFÜGT: Setze Timestamp auch für bestehende Store-Daten wenn hoursInTR vorhanden
    const existingHours = trPlannerStore.orbCalculator.currentBoosts.hoursInTR;
    if (existingHours && existingHours > 0 && !trStartTimestamp.value) {
      trStartTimestamp.value = Date.now();
      console.log("TR Start timestamp gesetzt für bestehende Store-Daten:", existingHours);
    }
    
    return;
  }
  
  // Ansonsten initialisiere mit currentStats aus Props
  console.log("OrbCalculator: Initializing with props.currentStats");
  
  // Current-Stats aus Props übernehmen und in Store speichern
  const currentBoostsData = { ...props.currentStats };
  const targetBoostsData = { ...props.currentStats };
  
  // TR-Count und All-Time Orbs separieren
  const trCountValue = props.currentStats?.trCount || 0;
  const allTimeOrbsValue = props.currentStats?.allTimeOrbs || 0;
  
  // Wichtig: Formatiere die Anzeige beim Initialisieren konsistent mit 2 Nachkommastellen
  allTimeOrbsDisplay.value = formatSuffixWithDecimals(allTimeOrbsValue, 2);

  // Store aktualisieren
  trPlannerStore.updateOrbCalculatorTRCount(trCountValue);
  trPlannerStore.updateOrbCalculatorAllTimeOrbs(allTimeOrbsValue);
  trPlannerStore.updateOrbCalculatorCurrentBoosts(currentBoostsData);
  trPlannerStore.updateOrbCalculatorTargetBoosts(targetBoostsData);

  // Stelle sicher, dass der Store initial korrekt geladen ist
  if (trPlannerStore && trPlannerStore.userStats) {
    // Zusätzliche Boosts aus dem Store laden, falls vorhanden
    const storeStats = trPlannerStore.userStats;
    
    // Ergänze fehlende Werte aus dem Store
    const updatedCurrentBoosts = { ...currentBoostsData };
    const updatedTargetBoosts = { ...targetBoostsData };
    
    Object.entries(storeStats).forEach(([key, value]) => {
      if (updatedCurrentBoosts[key] === undefined && value !== undefined) {
        updatedCurrentBoosts[key] = value;
        updatedTargetBoosts[key] = value;
      }
    });
    
    // Store nochmal aktualisieren mit ergänzten Werten
    trPlannerStore.updateOrbCalculatorCurrentBoosts(updatedCurrentBoosts);
    trPlannerStore.updateOrbCalculatorTargetBoosts(updatedTargetBoosts);
    
    // HINZUGEFÜGT: Setze Startzeit, wenn hoursInTR bereits vorhanden ist
    if (updatedCurrentBoosts.hoursInTR && updatedCurrentBoosts.hoursInTR > 0) {
      trStartTimestamp.value = Date.now();
      console.log("TR Start timestamp gesetzt aufgrund vorhandener hoursInTR:", updatedCurrentBoosts.hoursInTR);
    }
  }
  
  // Debug-Ausgabe
  console.log("InitData completed, store orbCalculator:", trPlannerStore.orbCalculator);
}

// Formatierungsfunktion mit Dezimalstellen
function formatSuffixWithDecimals(value, decimals = 2) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0' + '.' + '0'.repeat(decimals);
  }
  
  if (value === 0) {
    return '0' + '.' + '0'.repeat(decimals);
  }
  
  const absValue = Math.abs(value);
  const suffixes = ['', 'k', 'm', 'b', 't', 'qa', 'qu', 'sx', 'sp', 'oc', 'n', 'd'];
  
  let tier = Math.max(0, Math.min(Math.floor(Math.log10(absValue) / 3), suffixes.length - 1));
  
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  
  return `${scaledValue.toFixed(decimals)}${suffix}`;
}

function clearSearch() {
  searchQuery.value = '';
}

function updateBoostTarget(boost, newValue) {
  // Der Wert muss mindestens der current-Wert und eine ganze Zahl sein
  const currentValue = currentBoosts.value[boost.key] || 0;
  let validValue = Math.max(Math.floor(newValue), currentValue);
  
  // Max-Level berücksichtigen
  const maxValue = getBoostMaxValue(boost, gemLevels.value);
  if (maxValue !== undefined) {
    validValue = Math.min(validValue, maxValue);
  }
  
  // Spezialbehandlung für hoursInTR: Verwende das targetHoursInTR computed property
  if (boost.key === 'hoursInTR') {
    targetHoursInTR.value = validValue;
  } else {
    // Standard: Wert aktualisieren
    targetBoosts.value[boost.key] = validValue;
  }
  
  // Berechnungen aktualisieren
  recalculateAll();
}

function updateRawTargetValue(boost, newValue) {
  const currentValue = currentBoosts.value[boost.key] || 0;

  // WICHTIG: Stelle sicher, dass der target-Wert nicht unter den current-Wert fallen kann
  if (newValue < currentValue) {
    // Wenn der neue Wert unter dem Current-Wert liegt, direkt auf Current-Wert setzen
    if (boost.key === 'hoursInTR') {
      targetHoursInTR.value = currentValue;
    } else {
      trPlannerStore.updateOrbCalculatorTargetBoost(boost.key, currentValue);
    }
    console.log(`Verhindere Target-Wert ${newValue} unter Current-Wert ${currentValue} für ${boost.key}`);
  } else {
    // Ansonsten den neuen Wert normal setzen
    if (boost.key === 'hoursInTR') {
      targetHoursInTR.value = newValue;
    } else {
      trPlannerStore.updateOrbCalculatorTargetBoost(boost.key, newValue);
    }
  }
  
  // Berechnungen aktualisieren
  recalculateAll();
}

// Überarbeitete finalizeTargetValue-Funktion - doppelte Absicherung gegen Werte unter Current-Value
function finalizeTargetValue(boost) {
  const currentValue = currentBoosts.value[boost.key] || 0;
  const targetValue = targetBoosts.value[boost.key] || 0;
  
  // Wenn der targetValue kleiner ist als currentValue, korrigieren
  if (targetValue < currentValue) {
    console.log(`Korrigiere Target-Wert für ${boost.key}: ${targetValue} -> ${currentValue}`);
    trPlannerStore.updateOrbCalculatorTargetBoost(boost.key, currentValue);
    recalculateAll();
    return;
  }
  
  // Max-Level prüfen falls vorhanden
  const maxValue = getBoostMaxValue(boost, gemLevels.value);
  if (maxValue !== undefined && targetValue > maxValue) {
    targetBoosts.value[boost.key] = maxValue;
    recalculateAll();
  }
}

function toggleTargetBoolean(key) {
  // Wenn der current Boost aktiviert ist, kann der target Boost nicht deaktiviert werden
  if (currentBoosts.value[key]) {
    trPlannerStore.updateOrbCalculatorTargetBoost(key, true); // Erzwinge true, wenn current true ist
  } else {
    const newValue = !targetBoosts.value[key];
    trPlannerStore.updateOrbCalculatorTargetBoost(key, newValue); // Sonst normal umschalten
  }
  recalculateAll();
}

function toggleCurrentBoolean(key) {
  const newValue = !currentBoosts.value[key];
  trPlannerStore.updateOrbCalculatorCurrentBoost(key, newValue);
  
  // Wenn current aktiviert wird, muss target auch aktiviert werden
  if (newValue) {
    trPlannerStore.updateOrbCalculatorTargetBoost(key, true);
  }
  
  recalculateAll();
}

function getBoostMultiplier(boost, level, isTarget = false) {
  if (!boost || boost.multiplier === undefined) return 1;
  
  // Verwenden wir die richtigen Stats basierend darauf, ob wir aktuellen oder Ziel-Wert berechnen
  const stats = isTarget ? effectiveTargetStats.value : effectiveStats.value;
  
  // Spezialfall: hoursInTR zeigt den Catch-Up Multiplier an
  if (boost.key === 'hoursInTR') {
    return calculateCupMultiplier(level, stats);
  }
  
  // Spezialfall: loopMods zeigt den eigentlichen hoursInTR-Boost-Multiplikator an
  if (boost.key === 'loopMods') {
    const hoursBoost = allBoosts.find(b => b.key === 'hoursInTR');
    if (hoursBoost && typeof hoursBoost.multiplier === 'function') {
      const hoursValue = stats.hoursInTR || 0;
      return hoursBoost.multiplier(hoursValue, stats);
    }
    return 1;
  }
  
  // Standard-Logik für alle anderen Boosts
  if (boost.type === 'boolean') {
    // Boolean boosts
    if (typeof boost.multiplier === 'number') {
      return boost.multiplier;
    } else if (typeof boost.multiplier === 'function') {
      try {
        return boost.multiplier(1, stats);
      } catch (e) {
        console.error(`Error calculating multiplier for ${boost.key}:`, e);
        return 1;
      }
    }
  } else {
    // Numeric boosts
    if (typeof boost.multiplier === 'number') {
      return Math.pow(boost.multiplier, level);
    } else if (typeof boost.multiplier === 'function') {
      try {
        return boost.multiplier(level, stats);
      } catch (e) {
        console.error(`Error calculating multiplier for ${boost.key}:`, e);
        return 1;
      }
    }
  }
  
  return 1;
}

function safeCalculateMultiplier(boost, value, stats) {
  if (!boost || boost.multiplier === undefined) return 1;
  
  try {
    if (boost.type === 'boolean') {
      if (!value) return 1; // Wenn boolean false ist, kein Effekt
      
      if (typeof boost.multiplier === 'number') {
        return boost.multiplier;
      } else if (typeof boost.multiplier === 'function') {
        return boost.multiplier(1, stats) || 1; // 1 als Default
      }
    } else {
      // Numeric boost
      if (!value || value <= 0) return 1; // Wenn 0 oder negativ, kein Effekt
      
      if (typeof boost.multiplier === 'number') {
        return Math.pow(boost.multiplier, value);
      } else if (typeof boost.multiplier === 'function') {
        return boost.multiplier(value, stats) || 1; // 1 als Default
      }
    }
    return 1; // Default
  } catch (e) {
    console.error(`Error in safeCalculateMultiplier for ${boost.key}:`, e);
    return 1; // Default bei Fehler
  }
}

function debugVoidBadgeStatus() {
  console.group("🔍 Debug Void Badge Status");
  
  const voidBadges = ['vb1', 'vb2', 'vb3', 'vb4', 'vb5'];
  const maxStats = maxLevelStats.value || {};
  
  console.log("maxLevelStats geladen:", maxStats);
  
  voidBadges.forEach(vbKey => {
    console.log(`\n📊 ${vbKey}:`);
    console.log(`  - maxLevelStats[${vbKey}]: ${maxStats[vbKey]}`);
    console.log(`  - currentBoosts[${vbKey}]: ${currentBoosts.value[vbKey]}`);
    console.log(`  - effectiveStats[${vbKey}]: ${effectiveStats.value[vbKey]}`);
    
    // Prüfe ob der Boost in der orbcalc Berechnung verwendet wird
    const boost = allBoosts.find(b => b.key === vbKey);
    if (boost) {
      console.log(`  - orbcalc: ${boost.orbcalc}`);
      console.log(`  - multiplier: ${boost.multiplier}`);
      console.log(`  - type: ${boost.type}`);
    }
  });
  
  console.groupEnd();
}

// In recalculateAll() hinzufügen:
function recalculateAll() {
  console.log("🔄 recalculateAll() aufgerufen");
  
  // Trigger reactivity update
  currentBoosts.value = { ...currentBoosts.value };
  targetBoosts.value = { ...targetBoosts.value };
  
  // Debug Void Badge Status
  debugVoidBadgeStatus();
  
  console.log("📊 Aktuelle Daten für Neuberechnung:", {
    currentBoosts: { ...currentBoosts.value },
    targetBoosts: { ...targetBoosts.value },
    hoursInTR: currentBoosts.value.hoursInTR,
    maxLevelStats: { ...maxLevelStats.value }
  });
  
  console.log("✅ recalculateAll() abgeschlossen");
}

function resetToCurrentStats() {
  // Reset target values to current values using store
  trPlannerStore.updateOrbCalculatorTargetBoosts({ ...currentBoosts.value });
  recalculateAll();
}

function copyTargetsToCurrent() {
  // Copy target values to current values using store
  trPlannerStore.updateOrbCalculatorCurrentBoosts({ ...targetBoosts.value });
  recalculateAll();
}

function cancelAndClose() {
  emit('close');
}

// Store-Funktionen ersetzen die lokalen localStorage-Funktionen
// Alle Daten werden automatisch über den Store mit useStorage synchronisiert

function updateBoostCurrent(boost, newValue) {
  // Validate value
  let validValue = Math.max(Math.floor(newValue), 0);
  
  // Respect max level if available
  const maxValue = getBoostMaxValue(boost, gemLevels.value);
  if (maxValue !== undefined) {
    validValue = Math.min(validValue, maxValue);
  }

  // Update value in store
  trPlannerStore.updateOrbCalculatorCurrentBoost(boost.key, validValue);
  
  // Wenn current erhöht wird, muss target ggf. angepasst werden
  if (validValue > (targetBoosts.value[boost.key] || 0)) {
    trPlannerStore.updateOrbCalculatorTargetBoost(boost.key, validValue);
  }
  
  // Update calculations
  recalculateAll();
}

function getTabIndex(boost, type) {
  // Erstelle flache Listen aller Current- und Target-Boosts
  const currentBoostList = [];
  const targetBoostList = [];
  
  // Fülle die Listen mit allen sichtbaren Boosts
  filteredBoostCategories.value.forEach(category => {
    category.boosts.forEach(b => {
      currentBoostList.push(b);
      targetBoostList.push(b);
    });
  });
  
  // Finde den Index des aktuellen Boosts in der Liste
  const boostIndex = currentBoostList.findIndex(b => b.key === boost.key);
  
  if (boostIndex === -1) return undefined; // Nicht gefunden
  
  if (type === 'current') {
    // Current-Boost-Indizes beginnen bei 3 (nach TR Count=1 und All-Time Orbs=2)
    return boostIndex + 3;
  } else if (type === 'target') {
    // Target-Boost-Indizes beginnen nach allen Current-Boosts
    return currentBoostList.length + boostIndex + 3;
  }
  
  return undefined;
}

function setupAutoScrollOnTabbing() {
  // Event-Listener für Fokusänderungen einrichten
  document.addEventListener('focusin', handleFocusChange);
}

function handleFocusChange(event) {
  // Prüfen, ob das Element innerhalb unseres Modals ist
  const modal = document.querySelector('.modal-container');
  if (!modal || !modal.contains(event.target)) return;
  
  // Nur für Boost-Felder scrollen (current und target)
  const isBoostField = event.target.getAttribute('tabindex') >= 3;
  
  if (isBoostField) {
    // Warten bis das UI aktualisiert wurde
    setTimeout(() => {
      // Element sanft ins Sichtfeld scrollen
      event.target.scrollIntoView({
        behavior: 'smooth', 
        block: 'center',     // Element mittig zeigen
        inline: 'nearest'    // Horizontales Scrollen minimal halten
      });
    }, 100);
  }
}

// Hilfsfunktion um zu prüfen ob ein Boost freigeschaltet ist
function isBoostUnlocked(boost) {
  // Wenn kein unlock definiert ist, ist der Boost immer freigeschaltet
  if (!boost.unlock) {
    return true;
  }
  
  const requiredGem = boost.unlock;
  const requiredLevel = boost.unlock_level || 1;
  const currentLevel = gemLevels.value[requiredGem] || 0;
  
  return currentLevel >= requiredLevel;
}

// Entferne den Event-Listener, wenn die Komponente zerstört wird
function cleanupAutoScrollListeners() {
  document.removeEventListener('focusin', handleFocusChange);
}

function handleGemDataChanged() {
  console.log("🔄 Gem-Daten geändert - aktualisiere OrbCalculator");
  
  // Debug: Zeige neue Gem-Daten
  const newGemData = getGemDataFromLocalStorage();
  console.log("Neue Gem-Daten:", newGemData);
  
  // WICHTIG: Invalidiere alle cached Berechnungen
  invalidateCalculationCaches();
  
  // Force recalculation
  nextTick(() => {
    recalculateAll();
    
    // Debug: Zeige neue Berechnungen
    console.log("Nach Gem-Update - Current Orb Gains:", currentOrbGains.value);
    console.log("Nach Gem-Update - Target Orb Gains:", targetOrbGains.value);
    console.log("Nach Gem-Update - Filtered Categories:", filteredBoostCategories.value.length);
  });
}

// Erweiterte Gem-Data-Watcher für bessere Reaktivität
function forceGemLevelsReactivity() {
  // Erstelle eine Kopie der Gem-Daten um Reaktivität zu triggern
  const currentGemData = getGemDataFromLocalStorage();
  
  // Prüfe, ob sich die Gem-Levels geändert haben
  const currentLevelsString = JSON.stringify(gemLevels.value);
  const newLevelsString = JSON.stringify(currentGemData.levels || {});
  
  if (currentLevelsString !== newLevelsString) {
    console.log("🔄 Gem-Levels haben sich geändert, force Reaktivität");
    console.log("Alt:", gemLevels.value);
    console.log("Neu:", currentGemData.levels);
    
    // Trigger recalculation von allem was von Gem-Levels abhängt
    recalculateAll();
  }
}

watch(() => getGemDataFromLocalStorage(), (newGemData, oldGemData) => {
  if (JSON.stringify(newGemData) !== JSON.stringify(oldGemData)) {
    console.log("🔄 localStorage Gem-Daten direkt geändert");
    console.log("Alt:", oldGemData);
    console.log("Neu:", newGemData);
    
    // WICHTIG: Invalidiere alle cached Berechnungen
    invalidateCalculationCaches();
    
    // Force trigger für reactive updates
    nextTick(() => {
      recalculateAll();
      console.log("Nach localStorage Gem-Update - Filtered Categories:", filteredBoostCategories.value.length);
    });
  }
}, { deep: true });

// Diese Funktion zur onMounted-Funktion hinzufügen
onMounted(() => {
  // Bestehender Code...
  initData();
  // Lade initial die maxLevelStats
  loadMaxLevelStats();
  
  // Auto-Scroll beim Tabben einrichten
  setupAutoScrollOnTabbing();

  // Event-Listener für localStorage-Änderungen
  window.addEventListener('gemDataChanged', handleGemDataChanged);
  window.addEventListener('maxLevelStatsChanged', handleMaxLevelStatsChanged);
  
  // WICHTIG: Zusätzlicher Event-Listener für localStorage-Änderungen
  window.addEventListener('storage', (e) => {
    if (e.key === 'trplanner_userstats') {
      console.log("🔄 Storage Event für trplanner_userstats empfangen");
      handleMaxLevelStatsChanged();
    }
  });
  
  // Initial force gem reactivity check
  forceGemLevelsReactivity();
});

// Cleanup beim Unmount der Komponente
onBeforeUnmount(() => {
  cleanupAutoScrollListeners();
  window.removeEventListener('gemDataChanged', handleGemDataChanged);
  window.removeEventListener('maxLevelStatsChanged', handleMaxLevelStatsChanged);
  window.removeEventListener('storage', handleMaxLevelStatsChanged);
});

// Watch für Änderungen - Store übernimmt automatisch das Speichern mit useStorage
// Watcher entfernt, da Store automatisch mit localStorage synchronisiert

// Watch for prop changes
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    console.log("🔄 OrbCalculatorModal wird geöffnet - lade frische Daten");
    initData();
    loadMaxLevelStats(); // Lade immer frische maxLevelStats beim Öffnen
    forceGemLevelsReactivity(); // Force gem reactivity check
    
    // Nach dem Laden aller Daten, trigger eine Neuberechnung
    nextTick(() => {
      invalidateCalculationCaches();
      recalculateAll();
      
      // HINZUGEFÜGT: Stelle sicher, dass Timestamp gesetzt ist wenn hoursInTR vorhanden
      const currentHours = currentBoosts.value.hoursInTR || 0;
      if (currentHours > 0 && !trStartTimestamp.value) {
        trStartTimestamp.value = Date.now();
        console.log("🕐 TR Start timestamp beim Modal-Öffnen gesetzt:", currentHours);
      }
      
      console.log("✅ Modal-Initialisierung abgeschlossen");
    });
  }
});

watch(() => props.currentStats, (newValue) => {
  if (props.isVisible) {
    initData();
  }
}, { deep: true });

// Bereinige doppelte onMounted-Aufrufe
// Das zweite onMounted wird entfernt, da die Funktionalität bereits oben integriert ist

function toggleCreateOptions() {
  showCreateOptions.value = !showCreateOptions.value;
}

function resetForm() {
  trPlannerStore.resetOrbCalculator();
  resetToCurrentStats();
}

function calculateTRStartDateTime() {
  // Verwende IMMER die current hoursInTR, nie target
  const currentHours = currentBoosts.value.hoursInTR || 0;
  
  // Aktuelles Datum/Zeit
  const now = new Date();
  
  // TR Startzeit berechnen: jetzt - currentHours in Millisekunden
  const trStartTime = new Date(now.getTime() - (currentHours * 60 * 60 * 1000));
  
  // Formatieren für die Eingabefelder
  const dateString = trStartTime.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeString = trStartTime.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
  
  console.log(`TR Start berechnet: Jetzt (${now.toISOString()}) - ${currentHours}h = ${trStartTime.toISOString()}`);
  
  return {
    date: dateString,
    time: timeString
  };
}

// Vollständige und korrigierte createPlanWithCurrentValues-Funktion
function createPlanWithCurrentValues() {
  console.log("========== DEBUG CREATE PLAN ==========");
  console.log("1. Creating plan with current values in OrbCalculatorModal");
  
  // Bereite die Daten für den neuen Plan vor
  const currentValues = { ...props.currentStats };
  
  // Aktualisiere mit den currentBoosts
  Object.entries(currentBoosts.value).forEach(([key, value]) => {
    if (value !== undefined) {
      currentValues[key] = value;
    }
  });
  
  // WICHTIG: Markiere alle Boosts, die im OrbCalculatorModal auf max level gesetzt wurden,
  // aber NICHT im StatsInputModal (maxLevelStats) maxed sind
  currentValues._orbCalcMaxedBoosts = {};
  
  // Lade maxLevelStats für den Vergleich
  let maxStats;
  try {
    const maxStatsJSON = localStorage.getItem('trplanner_userstats');
    maxStats = maxStatsJSON ? JSON.parse(maxStatsJSON) : {};
  } catch (e) {
    console.error("Error loading maxLevelStats:", e);
    maxStats = {};
  }
  
  // Überprüfe alle Boosts
  console.log("Vergleiche Boosts für _orbCalcMaxedBoosts Flag:");
  
  allBoosts.forEach(boost => {
    // Für numerische Boosts mit maximalen Wert
    const maxValue = getBoostMaxValue(boost, gemLevels.value);
    if (maxValue !== undefined && boost.type === 'number') {
      // Aktueller Wert im OrbCalculator
      const currentValue = currentBoosts.value[boost.key];
      
      // Wenn der Boost im OrbCalculator maximal ist...
      if (currentValue !== undefined && currentValue >= maxValue) {
        // Wert aus maxLevelStats (StatsInputModal)
        const maxLevelValue = maxStats[boost.key];
        
        // Wenn maxLevelValue nicht existiert oder kleiner als max ist,
        // dann wurde dieser Boost nur im OrbCalculator maximiert
        if (maxLevelValue === undefined || maxLevelValue < maxValue) {
          console.log(`Boost ${boost.key} ist maximal in OrbCalc (${currentValue}/${maxValue}) aber nicht in maxLevelStats (${maxLevelValue}) - markiere als OrbCalcMaxed`);
          currentValues._orbCalcMaxedBoosts[boost.key] = true;
        } else {
          console.log(`Boost ${boost.key} ist maximal sowohl in OrbCalc als auch in maxLevelStats - kein Flag nötig`);
        }
      }
    }
    // Für boolean Boosts
    else if (boost.type === 'boolean') {
      // Ist der Boost im OrbCalculator aktiviert?
      const isActive = currentBoosts.value[boost.key];
      
      // Wenn der Boost im OrbCalculator aktiviert ist...
      if (isActive === true) {
        // Ist der Boost im StatsInputModal aktiviert?
        const isMaxedActive = maxStats[boost.key] === true;
        
        // Wenn der Boost nicht im StatsInputModal aktiviert ist,
        // dann wurde er nur im OrbCalculator aktiviert
        if (!isMaxedActive) {
          console.log(`Boolean Boost ${boost.key} ist aktiv in OrbCalc aber nicht in maxLevelStats - markiere als OrbCalcMaxed`);
          currentValues._orbCalcMaxedBoosts[boost.key] = true;
        } else {
          console.log(`Boolean Boost ${boost.key} ist aktiv sowohl in OrbCalc als auch in maxLevelStats - kein Flag nötig`);
        }
      }
    }
  });
  
  console.log("Finale _orbCalcMaxedBoosts:", currentValues._orbCalcMaxedBoosts);
  
  // Stelle sicher, dass trCount und allTimeOrbs gesetzt sind
  currentValues.trCount = trCount.value;
  currentValues.allTimeOrbs = allTimeOrbs.value;

  // TR Startzeit berechnen basierend auf aktuellen hoursInTR
  const trStartDateTime = calculateTRStartDateTime();
  currentValues.trStartDate = trStartDateTime.date;
  currentValues.trStartTime = trStartDateTime.time;
  
  // Speichere die Daten in trPlannerStore.tempPlanData
  trPlannerStore.tempPlanData = JSON.parse(JSON.stringify(currentValues));
  
  console.log("Daten für neuen Plan vorbereitet:", trPlannerStore.tempPlanData);
  
  // Modal schließen
  emit('close');
  
  // Daten auch in copyPlanData speichern für die Übergabe
  trPlannerStore.setCopyPlanData(JSON.parse(JSON.stringify(currentValues)));
  
  // Setze Flag im Store, dass TRPlanModal geöffnet werden soll
  trPlannerStore.planModalShouldOpen = 'current';
}

// Vollständige und korrigierte createPlanWithTargetValues-Funktion
function createPlanWithTargetValues() {
  // Prüfe, ob wir überhaupt Target-Werte haben
  const hasTargetValues = Object.keys(targetBoosts.value).length > 0;
  
  if (!hasTargetValues) {
    console.warn("No target values available");
    return;
  }
  
  // Erstelle ein Objekt mit den Zielwerten für den neuen Plan
  const targetStats = { ...props.currentStats };
  
  // Füge erst alle Current-Werte hinzu
  Object.entries(currentBoosts.value).forEach(([key, value]) => {
    if (value !== undefined) {
      targetStats[key] = value;
    }
  });
  
  // Füge dann alle Target-Werte hinzu
  Object.entries(targetBoosts.value).forEach(([key, value]) => {
    if (value !== undefined) {
      targetStats[key] = value;
    }
  });
  
  // WICHTIG: Markiere alle Boosts, die im OrbCalculatorModal auf max level gesetzt wurden,
  // aber NICHT im StatsInputModal (maxLevelStats) maxed sind
  targetStats._orbCalcMaxedBoosts = {};
  
  // Lade maxLevelStats für den Vergleich
  let maxStats;
  try {
    const maxStatsJSON = localStorage.getItem('trplanner_userstats');
    maxStats = maxStatsJSON ? JSON.parse(maxStatsJSON) : {};
  } catch (e) {
    console.error("Error loading maxLevelStats:", e);
    maxStats = {};
  }
  
  // Überprüfe alle Boosts
  console.log("Vergleiche Boosts für _orbCalcMaxedBoosts Flag (Target):");
  
  allBoosts.forEach(boost => {
    // Für numerische Boosts mit maximalen Wert
    const maxValue = getBoostMaxValue(boost, gemLevels.value);
    if (maxValue !== undefined && boost.type === 'number') {
      // Target-Wert im OrbCalculator
      const targetValue = targetBoosts.value[boost.key];
      
      // Wenn der Boost im OrbCalculator Target maximal ist...
      if (targetValue !== undefined && targetValue >= maxValue) {
        // Wert aus maxLevelStats (StatsInputModal)
        const maxLevelValue = maxStats[boost.key];
        
        // Wenn maxLevelValue nicht existiert oder kleiner als max ist,
        // dann wurde dieser Boost nur im OrbCalculator maximiert
        if (maxLevelValue === undefined || maxLevelValue < maxValue) {
          console.log(`Boost ${boost.key} ist maximal in OrbCalc Target (${targetValue}/${maxValue}) aber nicht in maxLevelStats (${maxLevelValue}) - markiere als OrbCalcMaxed`);
          targetStats._orbCalcMaxedBoosts[boost.key] = true;
        } else {
          console.log(`Boost ${boost.key} ist maximal sowohl in OrbCalc Target als auch in maxLevelStats - kein Flag nötig`);
        }
      }
    }
    // Für boolean Boosts
    else if (boost.type === 'boolean') {
      // Ist der Boost im OrbCalculator Target aktiviert?
      const isActive = targetBoosts.value[boost.key];
      
      // Wenn der Boost im OrbCalculator Target aktiviert ist...
      if (isActive === true) {
        // Ist der Boost im StatsInputModal aktiviert?
        const isMaxedActive = maxStats[boost.key] === true;
        
        // Wenn der Boost nicht im StatsInputModal aktiviert ist,
        // dann wurde er nur im OrbCalculator aktiviert
        if (!isMaxedActive) {
          console.log(`Boolean Boost ${boost.key} ist aktiv in OrbCalc Target aber nicht in maxLevelStats - markiere als OrbCalcMaxed`);
          targetStats._orbCalcMaxedBoosts[boost.key] = true;
        } else {
          console.log(`Boolean Boost ${boost.key} ist aktiv sowohl in OrbCalc Target als auch in maxLevelStats - kein Flag nötig`);
        }
      }
    }
  });
  
  console.log("Finale _orbCalcMaxedBoosts (Target):", targetStats._orbCalcMaxedBoosts);
  
  // Stelle sicher, dass trCount und allTimeOrbs gesetzt sind
  targetStats.trCount = trCount.value;
  targetStats.allTimeOrbs = allTimeOrbs.value;
  
  // TR Startzeit berechnen basierend auf aktuellen hoursInTR
  const trStartDateTime = calculateTRStartDateTime();
  targetStats.trStartDate = trStartDateTime.date;
  targetStats.trStartTime = trStartDateTime.time;
  
  // Speichere die Daten in trPlannerStore.tempPlanData
  trPlannerStore.tempPlanData = JSON.parse(JSON.stringify(targetStats));
  
  console.log("Daten für neuen Plan (Target) vorbereitet:", trPlannerStore.tempPlanData);
  
  // Modal schließen
  emit('close');
  
  // Daten auch in copyPlanData speichern
  trPlannerStore.setCopyPlanData(JSON.parse(JSON.stringify(targetStats)));
  
  // Setze Flag im Store, dass TRPlanModal geöffnet werden soll
  trPlannerStore.planModalShouldOpen = 'target';
}

function ensureFormattedMultiplier(value) {
  // Verwende die existierende formatMultiplier-Funktion
  const formatted = formatMultiplier(value);
  
  // Wenn der formatierte Wert nur eine Zahl ist (ohne ×), füge × und .00 hinzu
  if (/^[0-9]+$/.test(formatted)) {
    return `×${formatted}.00`;
  }
  
  // Wenn der formatierte Wert bereits × enthält, aber keine Dezimalstellen hat
  if (/^×[0-9]+$/.test(formatted)) {
    return `${formatted}.00`;
  }
  
  return formatted;
}

// Funktion updateAllTimeOrbs überarbeiten
function updateAllTimeOrbs(event) {
  allTimeOrbsRawInput.value = event.target.value.trim();
  isEditingAllTimeOrbs.value = true;
}

// Funktion finalizeAllTimeOrbsInput überarbeiten
function finalizeAllTimeOrbsInput() {
  isEditingAllTimeOrbs.value = false;
  const input = allTimeOrbsRawInput.value.trim();
  const parsed = parseNumberWithSuffix(input);
  
  if (parsed !== null) {
    allTimeOrbs.value = parsed; // Dies aktualisiert automatisch den Store durch das computed property
    const formattedValue = formatSuffixWithDecimals(parsed, 2);
    allTimeOrbsDisplay.value = formattedValue;
  } else {
    allTimeOrbs.value = 0; // Dies aktualisiert automatisch den Store durch das computed property
    allTimeOrbsDisplay.value = "0.00";
  }
  
  // Berechnungen aktualisieren
  recalculateAll();
}

/**
 * Berechnet die Kosten für die Differenz zwischen Current und Target Level
 * @param {Object} boost - Der Boost, für den die Kosten berechnet werden sollen
 * @returns {string} - Die formatierten Kosten oder einen leeren String
 */
 function calculateUpgradeCost(boost) {
  if (!boost) return '';
  
  // Für Boolean-Boosts gibt es keine Kosten
  if (boost.type === 'boolean') return '';
  
  // Current und Target Level
  const currentLevel = currentBoosts.value[boost.key] || 0;
  const targetLevel = targetBoosts.value[boost.key] || 0;
  
  // Wenn kein Upgrade, keine Kosten
  if (targetLevel <= currentLevel) return '';
  
  // Kosten basierend auf Boost-Kategorie berechnen
  let totalCost = 0;
  
  // Für Relics
  if (boost.category === 'relic') {
    // Ermitteln des Relic-Typs
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      totalCost += getRelicCost(`r${boost.key.replace('r', '')}`, level);
    }
    return formatRelicCost(totalCost);
  }
  
  // Für Inscriptions
  else if (boost.category === 'inscryption') {
    // Ermitteln des Inscription-Typs
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      totalCost += getInscryptionCost(`i${boost.key.replace('i', '')}`, level);
    }
    return formatInscryptionCost(totalCost);
  }
  
  // Für Gadgets
  else if (boost.category === 'gadget') {
    // Gadget-Typ ermitteln
    let gadgetType = boost.key;
    // Spezielle Mapping für bestimmte Gadgets
    if (boost.key === 'oogadget') gadgetType = 'g4';
    if (boost.key === 'campfragdet') gadgetType = 'g14';
    
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      totalCost += getGadgetCost(gadgetType, level);
    }
    return formatGadgetCost(totalCost);
  }

  // Für Milestone #0 - SPEZIELLE BEHANDLUNG mit Decimal
  if (boost.key === 'ms0') {
    return calculateM0CostRangeSafe(currentLevel, targetLevel);
  }

  // Für Loop Mods - NEUE BEHANDLUNG
  if (boost.key === 'lmConsistency') {
    // Verwende den dafür definierten Loop Mod Namen aus der Konstante
    return calculateLoopModCostRangeSafe(LOOP_MODS.RULE_OF_CONSISTENCY, currentLevel, targetLevel);
  }
  
  return '';
}

// Prüft, ob ein Boost verfügbar ist (alle Voraussetzungen erfüllt)
function isBoostAvailable(boost, isTarget = false) {
  // Wenn keine Abhängigkeiten definiert sind, ist der Boost immer verfügbar
  if (!boost.minRequirement && !boost.unlock) return true;
  
  // NEUE LOGIK: Prüfe Gem-Abhängigkeiten ZUERST
  if (boost.unlock) {
    const requiredGem = boost.unlock;
    const requiredLevel = boost.unlock_level || 1;
    const currentGemLevel = gemLevels.value[requiredGem] || 0;
    
    // Wenn Gem-Level nicht ausreicht, ist Boost nicht verfügbar
    if (currentGemLevel < requiredLevel) {
      console.log(`Boost ${boost.key} nicht verfügbar: ${requiredGem} Level ${currentGemLevel} < ${requiredLevel}`);
      return false;
    }
  }
  
  // BESTEHENDE LOGIK: Prüfe Boost-Abhängigkeiten
  if (boost.minRequirement) {
    const requiredBoostKey = boost.minRequirement.boost;
    const requiredLevel = boost.minRequirement.level;
    
    // maxLevelStats prüfen
    const maxStats = maxLevelStats.value || {};
    const orbCalcMaxedBoosts = maxStats._orbCalcMaxedBoosts || {};
    
    // Wenn der erforderliche Boost in _orbCalcMaxedBoosts markiert ist
    if (orbCalcMaxedBoosts[requiredBoostKey] === true) {
      return true;
    }
    
    // Bei booleschen Werten
    if (typeof maxStats[requiredBoostKey] === 'boolean' && maxStats[requiredBoostKey] === true) {
      return true;
    }
    
    // Bei numerischen Werten
    if (typeof maxStats[requiredBoostKey] === 'number' && maxStats[requiredBoostKey] >= requiredLevel) {
      return true;
    }
    
    // Bei Target-Prüfung auch current/target Werte berücksichtigen
    if (isTarget) {
      const targetLevel = targetBoosts.value[requiredBoostKey] || 0;
      return targetLevel >= requiredLevel;
    } else {
      const currentLevel = currentBoosts.value[requiredBoostKey] || 0;
      return currentLevel >= requiredLevel;
    }
  }
  
  return true;
}

// Gibt einen lesbaren Text für die Boost-Anforderung zurück
function getBoostRequirementText(boost) {
  if (!boost.minRequirement) return '';
  
  // Boost-Objekt für den erforderlichen Boost finden
  const requiredBoost = allBoosts.find(b => b.key === boost.minRequirement.boost);
  if (!requiredBoost) return 'Unknown requirement';
  
  // Text für das Mindestlevel erstellen
  return `${requiredBoost.label} ${boost.minRequirement.level}`;
}

// Hilfsfunktionen für Tooltips
function hasTooltipContent(boost) {
  return (boost.tooltip && boost.tooltip !== '0') || boost.minRequirement;
}

function getFullTooltipContent(boost) {
  let content = '';
  
  // Boost-Tooltip anzeigen, wenn vorhanden
  if (boost.tooltip && boost.tooltip !== '0') {
    content += boost.tooltip;
  }
  
  // Anforderungen hinzufügen, falls vorhanden
  if (boost.minRequirement) {
    if (content) content += '<br><br>'; // Trennzeile, falls schon Text vorhanden
    content += `<span style="color: #EAB308;">⚠️ Requires ${getBoostRequirementText(boost)}</span>`;
  }
  
  return content;
}

// Watch für Gem-Level-Änderungen im Store
watch(() => trPlannerStore.userStats.gemData, (newGemData, oldGemData) => {
  if (newGemData !== oldGemData) {
    console.log("Gem-Daten im Store geändert, aktualisiere OrbCalculator");
    
    // Force recalculation by triggering reactivity
    recalculateAll();
    
    // Optional: Zeige Benachrichtigung
    console.log("Neue Gem-Levels:", newGemData?.levels);
  }
}, { deep: true });

// Watch für Gem-Level-Änderungen - VERBESSERT
watch(() => gemLevels.value, (newLevels, oldLevels) => {
  if (oldLevels && JSON.stringify(newLevels) !== JSON.stringify(oldLevels)) {
    console.log("🔄 Gem-Levels computed property geändert");
    console.log("Alt:", oldLevels);
    console.log("Neu:", newLevels);
    
    // WICHTIG: Invalidiere alle cached Berechnungen
    invalidateCalculationCaches();
    
    // Force refresh der filteredBoostCategories
    nextTick(() => {
      recalculateAll();
      console.log("Nach Gem-Level-Update - Filtered Categories:", filteredBoostCategories.value.length);
    });
  }
}, { deep: true });
</script>

<style scoped>
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

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

/* Immer einen transparenten Rahmen anzeigen, um ein Springen zu vermeiden */
:deep(.tr-value-control) {
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

/* Nur die Farbe ändern, wenn die Bedingung erfüllt ist */
:deep(.tr-improved-value) {
  border-color: rgb(34, 197, 94) !important;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.2);
}

/* NEUER STIL: Visueller Indikator für Werte am Minimum */
:deep(.tr-min-value) button:first-child,
:deep(.tr-min-value) button:nth-child(2) {
  position: relative;
  overflow: hidden;
}

:deep(.tr-min-value) button:first-child::after,
:deep(.tr-min-value) button:nth-child(2)::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(26, 31, 43, 0.6); /* semitransparent overlay */
}


</style>