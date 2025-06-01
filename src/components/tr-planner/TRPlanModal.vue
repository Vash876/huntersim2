<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[110px] pt-[50px] sm:py-0"
    @click.self="cancelAndClose"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700 modal-container"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-blue-400">TR Planner</span>
            <span class=""> - {{ modalTitle }}</span>
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
          Create a new TR Plan by setting target levels for boosts.  
          <br><span class="text-yellow-300 mt-1 inline-block">To include boosts in future TRs, click the gray indicators on the left edge of each boost - they'll turn <span class="text-green-400">green</span> when selected.</span>
        </p>
      </div>

      <!-- TR Start Date/Time Picker -->
      <div class="p-3 border-b border-gray-700 bg-gray-750/30">
        <div class="flex flex-col sm:flex-row justify-between gap-3">
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-300 mb-1.5">TR Start Date/Time</label>
            <div class="flex space-x-2">
              <div class="flex-1">
                <input 
                  type="date" 
                  v-model="trStartDate" 
                  class="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white"
                />
              </div>
              <div class="flex-1">
                <input 
                  type="time" 
                  v-model="trStartTime" 
                  class="w-full px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white"
                />
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-400">When this plan begins</p>
          </div>
          
          <!-- TR End Date/Time Preview -->
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-300 mb-1.5">Expected Plan End</label>
            <div class="flex flex-col">
              <div class="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white h-[33px] flex items-center">
                {{ formatTREndDate }}
              </div>
              <p class="mt-1 text-xs text-gray-400">
                Based on total hours in TR plan
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- General Stats Panel -->
      <div class="p-3 border-b border-gray-700">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <!-- Plan Name Field -->
          <div class="bg-gray-750/60 rounded-md p-2 border border-transparent hover:border-gray-600">
            <div class="flex flex-col">
              <label class="text-xs font-medium text-gray-300 mb-1">Plan Name</label>
              <input 
                v-model="planName"
                type="text"
                class="px-2 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white"
                placeholder="Enter a name for your plan"
                tabindex="1"
              />
            </div>
          </div>
          
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
                  @update:value="(newVal) => {
                    trCount = newVal;
                    trCountDisplay = newVal.toString();
                    if (trSteps.length > 0) {
                      trSteps[0].stats.trCount = newVal;
                      updateFollowingStepsStats(0);
                    }
                  }"
                />
              </div>
            </div>
          </div>

          <!-- All-Time Orbs -->
          <div class="bg-gray-750/60 rounded-md p-2 border border-transparent hover:border-gray-600 relative">
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
                placeholder="0"
                tabindex="3"
                @input="updateAllTimeOrbs"
                @blur="finalizeAllTimeOrbsInput" 
                @keydown.enter="finalizeAllTimeOrbsInput"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Search Field
      <div class="p-3 border-b border-gray-700">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch size="16" class="text-gray-400" />
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="block w-full pl-10 pr-8 py-2 text-sm bg-gray-700 border border-gray-600 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search boosts..."
          />
          <div 
            v-if="searchQuery" 
            class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            @click="clearSearch"
          >
            <IconX size="16" class="text-gray-400 hover:text-white" />
          </div>
        </div>
      </div> -->

      <!-- Error state -->
      <div v-if="error" class="p-4 text-center">
        <IconAlertCircle size="24" class="text-red-500 mx-auto mb-1" />
        <p class="text-red-400 text-sm">{{ error }}</p>
        <button 
          @click="initData" 
          class="mt-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
        >
          Retry
        </button>
      </div>

      <!-- TR Planning Content -->
      <div v-else>
        <!-- TR Steps Container -->
        <div class="border-b border-gray-700" v-for="(step, stepIndex) in trSteps" :key="step.id" :id="`tr-step-${stepIndex}`">
          <!-- TR Step Header -->
          <div class="p-3 bg-gray-750/40 flex items-center justify-between">
            <div class="flex items-center">
              <div class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {{ stepIndex + 1 }}
              </div>
              <h3 class="text-sm font-bold text-white ml-2">
                TR {{ trCount + stepIndex }} → TR {{ trCount + stepIndex + 1 }}
              </h3>
            </div>
              <!-- Der Knopf sollte nur im ersten TR erscheinen -->
              <button
                v-if="stepIndex === 0"
                @click="trSteps.length > 1 ? openTRUpdateModal() : null"
                class="ml-4 px-2 py-1 rounded text-xs flex items-center"
                :class="trSteps.length > 1 ? 'bg-green-600 hover:bg-green-500 text-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'"
                :title="trSteps.length > 1 ? 'Mark TR as completed' : 'Add more TRs to enable this feature'"
              >
                <IconCheck size="14" class="mr-1" />
                TR Completed
              </button>
            <!-- Remove step button (only for steps after the first) -->
            <button 
              v-if="stepIndex > 0" 
              @click="removeStep(stepIndex)"
              class="text-xs text-red-400 hover:text-red-300"
            >
              <IconTrash size="14" />
            </button>
          </div>

          <!-- Boost Categories for this TR step -->
          <div class="p-3">
            <!-- Empty results message -->
            <div v-if="getFilteredBoostsByCategory(step).length === 0" class="py-4 text-center text-gray-400 text-sm">
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
                <p>No boosts selected for this TR</p>
                <p class="text-xs mt-1">
                  Click the green <span class="text-green-400">checkbox</span> on boosts in the first TR to include them here.
                </p>
              </template>
            </div>
            
            <!-- Regular Boost Categories -->
            <div 
              v-for="(category, categoryIndex) in getFilteredBoostsByCategory(step)" 
              :key="`${step.id}_${category.id}`" 
              class="mb-3"
            >
              <!-- Category Header -->
              <div class="flex items-center mb-1.5">
                <div class="w-1.5 h-5 bg-blue-500 rounded-r mr-2"></div>
                <h3 class="font-medium text-sm text-blue-200">{{ category.label }}</h3>
              </div>
              
              <!-- Boost Parameters Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div 
                  v-for="(boost, boostIndex) in category.boosts" 
                  :key="`${step.id}_${boost.key}`" 
                  class="bg-gray-750/60 rounded-md p-0 border border-gray-700 hover:border-gray-600 transition-colors relative overflow-hidden"
                >
                  <!-- Checkbox marker (left side) - nur im ersten Schritt anzeigen -->
                  <div 
                    v-if="stepIndex === 0"
                    class="absolute left-0 top-0 bottom-0 w-[12px] cursor-pointer transition-colors"
                    :class="{
                      'bg-green-600': isBoostSelectedForNextTR(step.id, boost.key) || boost.key === 'hoursInTR',
                      'bg-gray-600 hover:bg-green-600/50': !isBoostSelectedForNextTR(step.id, boost.key) && boost.key !== 'hoursInTR'
                    }"
                    @click.stop="boost.key === 'hoursInTR' ? null : toggleBoostForNextTR(step.id, boost.key)"
                  ></div>

                  <!-- Leerer linker Rand für Folge-TRs (damit das Layout konsistent bleibt) -->
                  <div 
                    v-else
                    class="absolute left-0 top-0 bottom-0 w-[10px] bg-transparent"
                  ></div>
                  
                  <!-- Boost Content -->
                  <div class="pl-[16px]">
                    <!-- Oberer Bereich: Boost Name und Max Level -->
                    <div class="flex items-start justify-between mb-1">
                      <div class="flex-grow flex items-start">
                        <span class="text-xs font-medium text-gray-300">{{ boost.label }}</span>
                        
                        <!-- Info-Icon mit Tooltip -->
                        <InfoTooltip 
                          v-if="hasTooltipContent(boost, step)"
                          :content="getFullTooltipContent(boost, step)"
                          placement="right"
                          class="ml-1 mt-0.5"
                        />
                      </div>
                      
                      <!-- Max Level Badge (wenn vorhanden) - oben rechts -->
                      <div class="flex-shrink-0 ml-2">
                        <span 
                          v-if="boost.max !== undefined"
                          class="text-[10px] px-1.5 py-0.5 rounded bg-gray-600/80 text-gray-300 font-medium inline-block"
                        >
                          Max: {{ boost.max }}
                        </span>
                      </div>
                    </div>

                    <!-- Tooltip (optional) 
                    <div v-if="boost.tooltip && boost.tooltip !== '0'" class="text-[10px] text-gray-400 mb-1">
                      {{ boost.tooltip }}
                    </div>-->
                    
                    <!-- Unterer Bereich: Multiplier Info und Controls nebeneinander -->
                    <div class="flex items-center justify-between flex-wrap-nowrap min-h-[24px]">
                      <!-- Multipliers Info -->
                      <div class="flex-grow text-[10px] text-gray-400">
                        <!-- Spezialfall für R6 mit part1 und part2 -->
                        <template v-if="boost.key === 'r6' && getFragMultiplierText(boost, step)">
                          <span class="text-blue-400">
                            {{ getFragMultiplierText(boost, step).part1 }} {{ getFragMultiplierText(boost, step).part2 }}
                          </span>
                        </template>
                        
                        <!-- Standard-Anzeige für andere Boosts -->
                        <template v-else>
                          <template v-if="getMultiplierText(boost, step) && getFragMultiplierText(boost, step)">
                            {{ getMultiplierText(boost, step) }} / <span class="text-blue-400">{{ getFragMultiplierText(boost, step) }}</span>
                          </template>
                          <template v-else-if="boost.key === 'hoursInTR'">
                            <span class="text-yellow-400">
                              {{ getHoursNeededText(step, stepIndex) }}
                            </span>
                          </template>
                          <template v-else-if="getMultiplierText(boost, step)">
                            {{ getMultiplierText(boost, step) }}
                            <!-- Cup-Multi für loopMods zusätzlich anzeigen -->
                            <template v-if="boost.key === 'loopMods'">
                              <span class="mx-1">/</span>
                              <span class="text-yellow-400">Cup-Multi: {{ getCupMultiplierText(step) }}</span>
                            </template>
                          </template>
                          <template v-else-if="getFragMultiplierText(boost, step)">
                            <span class="text-blue-400">{{ getFragMultiplierText(boost, step) }}</span>
                          </template>
                          <!-- Spezialfall für loopMods ohne anderen Multiplier -->
                          <template v-else-if="boost.key === 'loopMods'">
                            <span class="text-yellow-400">Cup-Multi: {{ getCupMultiplierText(step) }}</span>
                          </template>
                          <!-- Leerer Platzhalter, wenn kein Multiplier angezeigt wird -->
                          <template v-else>
                            <span class="text-transparent">×</span>
                          </template>
                        </template>
                        <!-- Anpassung im Template: Anzeige der benötigten Stunden anstelle des Multipliers bei hoursInTR -->
                      </div>
                      
                      <!-- Target Controls mit Kostenanzeige -->
                      <div class="flex-shrink-0 ml-2 flex items-center">
                        <!-- Kostenanzeige für numerische Boosts - mittig zwischen Multiplier und Controls -->
                        <div v-if="boost.type !== 'boolean' && calculateUpgradeCost(boost, step)" class="mr-2 text-[10px] text-amber-400">
                          Cost: {{ calculateUpgradeCost(boost, step) }}
                        </div>
                        
                        <!-- Boolean Type Controls -->
                        <div v-if="boost.type === 'boolean'" class="flex justify-end min-w-[40px]">
                          <button 
                            @click.stop="toggleBooleanTarget(step.id, boost.key)"
                            class="text-xs px-1.5 py-0.5 rounded-sm"
                            :class="{
                              'bg-green-700 text-green-100': getTargetBool(step.id, boost.key),
                              'bg-gray-700 hover:bg-green-800/50 text-white': !getTargetBool(step.id, boost.key) && (!boost.permanent || stepIndex === 0 || !isPermanentAndActivatedBefore(step.id, boost.key)),
                              'bg-gray-500 text-gray-300 cursor-not-allowed': !getTargetBool(step.id, boost.key) && boost.permanent && stepIndex > 0 && isPermanentAndActivatedBefore(step.id, boost.key)
                            }"
                            :disabled="!getTargetBool(step.id, boost.key) && boost.permanent && stepIndex > 0 && isPermanentAndActivatedBefore(step.id, boost.key)"
                          >
                            {{ getTargetBool(step.id, boost.key) ? 'ON' : 'OFF' }}
                          </button>
                        </div>
                        
                        <!-- Numeric Type Controls -->
                        <div v-else class="flex items-center justify-end min-w-[80px]">
                          <div class="bg-gray-750/60 rounded-md p-2" 
                              v-if="boost.key === 'research'">
                              <ResearchMultiSelect
                                :model-value="getTargetLevel(step.id, boost.key)"
                                :selected-researches="step.selectedResearches || []"
                                :selected-levels="step.selectedLevels || {}"
                                @update:model-value="(newVal) => updateTargetLevel(step.id, boost.key, newVal)"
                                @update:selected-researches="updateSelectedResearches(step, $event)"
                                @update:selected-levels="updateSelectedLevels(step, $event)"
                              />
                          </div>

                          <!-- Standardeingabefeld für alle anderen Boosts -->
                          <div v-else>
                            <TRValueControls
                              :value="getTargetLevel(step.id, boost.key)"
                              :minValue="stepIndex === 0 ? 0 : (boost.permanent ? getPreviousStepLevel(stepIndex, boost.key) : 0)"  
                              :maxValue="boost.max || 999999"
                              :showFastControls="true"
                              :step="boost.normalControl || 1"
                              :fastStep="boost.fastControl || 10"
                              :valueClass="'text-white'"
                              :autoEdit="true"
                              :disabled="!isBoostAvailable(boost, step)"
                              :buttonClass="isBoostAvailable(boost, step) ? '' : 'opacity-50 cursor-not-allowed'"
                              @update:value="(newVal) => isBoostAvailable(boost, step) && updateTargetLevel(step.id, boost.key, newVal)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Angepasster TR Results Table für jeden TR Step -->
            <div class="mt-6 border-t border-gray-700 pt-4 relative" v-if="stepIndex === 0">
              <!-- Normale Tabelle -->
              <div 
                class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg overflow-hidden"
                :id="`tr-result-${stepIndex}`"
              >
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="text-xs text-gray-300 bg-gray-800/80">
                      <tr>
                        <th scope="col" class="px-3 py-2 text-center font-medium">TR #{{ trCount }} Req</th>
                        <th scope="col" class="px-3 py-2 text-center font-medium">Orb Gains</th>
                        <th scope="col" class="px-3 py-2 text-center font-medium">Frag Gains</th>
                        <th scope="col" class="px-3 py-2 text-center font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-gray-750/30">
                        <td class="px-3 py-2.5 text-center font-mono">
                          {{ formatNumber(getStepOrbRequirement(trSteps[0], 0)) }}
                        </td>
                        <td class="px-3 py-2.5 text-center font-mono text-green-400">
                          {{ formatNumber(getStepOrbGains(trSteps[0])) }}
                        </td>
                        <td class="px-3 py-2.5 text-center font-mono text-orange-400">
                          {{ formatNumber(getStepFragGains(trSteps[0])) }}
                        </td>
                        <td class="px-3 py-2.5 text-center">
                          <div 
                            :class="getStepRequirementMet(trSteps[0], 0) ? 'text-green-500' : 'text-red-400'"
                            class="flex items-center justify-center"
                          >
                            <!-- Status Symbol: Haken oder X -->
                            <span class="mr-1">
                              <IconCircleCheck v-if="getStepRequirementMet(trSteps[0], 0)" size="16" class="text-green-500" />
                              <IconCircleX v-else size="16" class="text-red-400" />
                            </span>
                            
                            <!-- Status Text -->
                            <span class="text-xs">
                              <template v-if="getStepRequirementMet(trSteps[0], 0)"></template>
                              <template v-else>
                                {{ formatNumber(getStepOrbRequirement(trSteps[0], 0) - getStepOrbGains(trSteps[0])) }} missing
                              </template>
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="mt-6 border-t border-gray-700 pt-4 relative" v-else>
              <div 
                class="bg-gray-750/60 rounded-lg border border-gray-700 shadow-lg overflow-hidden tr-result-table"
                :id="`tr-result-${stepIndex}`"
              >
                <!-- Kompakte Ergebnistabelle -->
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead class="text-xs text-gray-300 bg-gray-800/80">
                      <tr>
                        <th scope="col" class="px-3 py-2 text-center font-medium">TR #{{ trCount + stepIndex }} Req</th>
                        <th scope="col" class="px-3 py-2 text-center font-medium">Orb Gains</th>
                        <th scope="col" class="px-3 py-2 text-center font-medium">Frag Gains</th>
                        <th scope="col" class="px-3 py-2 text-center font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="bg-gray-750/30">
                        <td class="px-3 py-2.5 text-center font-mono">
                          {{ formatNumber(getStepOrbRequirement(step, stepIndex)) }}
                        </td>
                        <td class="px-3 py-2.5 text-center font-mono text-green-400">
                          {{ formatNumber(getStepOrbGains(step)) }}
                        </td>
                        <td class="px-3 py-2.5 text-center font-mono text-orange-400">
                          {{ formatNumber(getStepFragGains(step)) }}
                        </td>
                        <td class="px-3 py-2.5 text-center">
                          <div 
                            :class="getStepRequirementMet(step, stepIndex) ? 'text-green-500' : 'text-red-400'"
                            class="flex items-center justify-center"
                          >
                            <!-- Status Symbol: Haken oder X -->
                            <span class="mr-1">
                              <IconCircleCheck v-if="getStepRequirementMet(step, stepIndex)" size="16" class="text-green-500" />
                              <IconCircleX v-else size="16" class="text-red-400" />
                            </span>
                            
                            <!-- Status Text -->
                            <span class="text-xs">
                              <template v-if="getStepRequirementMet(step, stepIndex)"></template>
                              <template v-else>
                                {{ formatNumber(getStepOrbRequirement(step, stepIndex) - getStepOrbGains(step)) }} missing
                              </template>
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add TR Step button (nur anzeigen wenn alle vorherigen TRs erfüllt sind) -->
        <div class="p-3 bg-gray-750/30 border-b border-gray-700">
          <button 
            v-if="canAddNextTR"
            @click="addTRStep"
            class="w-full py-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-600/50 text-blue-200 rounded-md transition-colors"
          >
            <IconPlus size="16" />
            <span>Add Next TR</span>
          </button>
          <div 
            v-else 
            class="text-center py-2 text-xs text-gray-400"
          >
            Meet TR Requirement to add another TR
          </div>
        </div>
      </div>

      <!-- Footer buttons -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <!-- Remove TR Button -->
            <button 
              @click="removeLastTRStep"
              :disabled="trSteps.length <= 1"
              class="px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5"
              :class="trSteps.length > 1 ? 
                'bg-red-700 hover:bg-red-600 text-white' : 
                'bg-gray-700 text-gray-500 cursor-not-allowed'"
            >
              <IconMinus size="14" />
               TR
            </button>
            
            <!-- Add TR Button -->
            <button 
              @click="addTRStep"
              :disabled="!canAddNextTR"
              class="px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5"
              :class="canAddNextTR ? 
                'bg-blue-600 hover:bg-blue-500 text-white' : 
                'bg-gray-700 text-gray-500 cursor-not-allowed'"
            >
              <IconPlus size="14" />
               TR
            </button>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="cancelAndClose"
              class="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs"
            >
              Cancel
            </button>
            <button 
              @click="createPlan"
              :disabled="!isPlanValid"
              class="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5"
              :class="isPlanValid ? 
                'bg-blue-600 hover:bg-blue-500 text-white' : 
                'bg-gray-700 text-gray-400 cursor-not-allowed'"
            >
              <IconPlus size="14" v-if="!editPlanId && isPlanValid" />
              <IconEdit size="14" v-if="editPlanId && isPlanValid" />
              {{ editPlanId ? 'Update Plan' : 'Create Plan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TRUpdateModal
    v-if="showTRUpdateModal"
    :planId="'temp'"
    :trNumber="trCount"
    :orbGains="trSteps.length > 0 ? getStepOrbGains(trSteps[0]) : 0"
    @close="closeTRUpdateModal"
    @update="handleTRUpdate"
  />

  <AlertDialog
  :isVisible="showAlertDialog"
  :title="alertTitle"
  :message="alertMessage"
  :type="alertType"
  :showCancel="true"
  :confirmText="alertTitle === 'Discard changes?' ? 'Discard' : 'OK'"
  :cancelText="alertTitle === 'Discard changes?' ? 'Cancel' : 'Cancel'"
  @confirm="handleAlertClose"
  @cancel="handleAlertCancel"
/>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useNow } from '@vueuse/core';
import { allBoosts, boostsByCategory, generalStats, alwaysUpdateKeys, researchData } from '@/constants/tr-planner';
import { getRelicCost, formatRelicCost } from '@/utils/relicCostUtils';
import { getInscryptionCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { getM0Cost, formatM0Cost, calculateM0CostRangeSafe } from '@/utils/m0CostUtils';
import { LOOP_MODS, getLoopModCost, formatLoopModCost, calculateLoopModCostRangeSafe } from '@/utils/loopModCostUtils';
import ResearchMultiSelect from './ResearchMultiSelect.vue';
import TRUpdateModal from './TRUpdateModal.vue';
import TRValueControls from '@/composables/TRValueControls.vue';
import AlertDialog from '@/components/common/AlertDialog.vue';
import { formatMultiplier, formatNumber, parseNumberWithSuffix, formatSuffixNotation } from '@/composables/format';
import { calculateOrbRequirement, calculateOrbGains, calculateCampaignFragGains, calculateMissingHours } from '@/composables/calculations';
import { 
  IconX, 
  IconPlus,
  IconMinus, 
  IconTrash,
  IconAlertCircle, 
  IconSearch,
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconCheck,
  IconLock
} from '@tabler/icons-vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';

// Imports für Pinia Store hinzufügen
import { useTRPlannerStore } from '@/store/orbStore';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  currentStats: {
    type: Object,
    default: () => ({})
  },
  editPlanId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['close', 'save', 'openUpdate', 'openNewPlan', 'updateCurrentStats']);

// Pinia Store als ref einrichten
const trPlannerStore = useTRPlannerStore();

// State
const error = ref(null);
const planName = ref(`Unnamed`);
const searchQuery = ref('');
const hasUnsavedChanges = ref(false);
const pendingSavePlanId = ref(null);
const pendingSaveData = ref(null);

// Neue Referenz-Variable für den ursprünglichen Zustand
const originalState = ref(null);

// Funktion zum Erfassen des ursprünglichen Zustands
function captureOriginalState() {
  originalState.value = {
    planName: planName.value,
    trCount: trCount.value,
    allTimeOrbs: allTimeOrbs.value,
    trStartDate: trStartDate.value,
    trStartTime: trStartTime.value,
    // ✅ WICHTIGE KORREKTUR: Auch Research-Daten erfassen
    trSteps: trSteps.map(step => ({
      targetLevels: {...step.targetLevels},
      targetBools: {...step.targetBools},
      selectedForNextTR: [...step.selectedForNextTR],
      selectedResearches: [...(step.selectedResearches || [])],
      selectedLevels: {...(step.selectedLevels || {})}
    }))
  };
  
  // Nach dem Laden des ursprünglichen Zustands keine Änderungen anzeigen
  hasUnsavedChanges.value = false;
}

// Funktion zum Prüfen, ob sich etwas geändert hat
// Funktion zum Prüfen, ob sich etwas geändert hat
function checkForChanges() {
  if (!originalState.value || !props.isVisible) return;
  
  // Prüfe Basiswerte
  if (planName.value !== originalState.value.planName ||
      trCount.value !== originalState.value.trCount ||
      allTimeOrbs.value !== originalState.value.allTimeOrbs ||
      trStartDate.value !== originalState.value.trStartDate ||
      trStartTime.value !== originalState.value.trStartTime) {
    hasUnsavedChanges.value = true;
    return;
  }
  
  // Prüfe, ob die Anzahl der Schritte gleich ist
  if (trSteps.length !== originalState.value.trSteps.length) {
    hasUnsavedChanges.value = true;
    return;
  }
  
  // Prüfe jeden Schritt auf Änderungen
  for (let i = 0; i < trSteps.length; i++) {
    const currentStep = trSteps[i];
    const originalStep = originalState.value.trSteps[i];
    
    // Prüfe targetLevels
    const currentTargetLevelsKeys = Object.keys(currentStep.targetLevels || {});
    const originalTargetLevelsKeys = Object.keys(originalStep.targetLevels || {});
    
    if (currentTargetLevelsKeys.length !== originalTargetLevelsKeys.length) {
      hasUnsavedChanges.value = true;
      return;
    }
    
    for (const key of currentTargetLevelsKeys) {
      if (currentStep.targetLevels[key] !== originalStep.targetLevels[key]) {
        hasUnsavedChanges.value = true;
        return;
      }
    }
    
    // Prüfe targetBools
    const currentTargetBoolsKeys = Object.keys(currentStep.targetBools || {});
    const originalTargetBoolsKeys = Object.keys(originalStep.targetBools || {});
    
    if (currentTargetBoolsKeys.length !== originalTargetBoolsKeys.length) {
      hasUnsavedChanges.value = true;
      return;
    }
    
    for (const key of currentTargetBoolsKeys) {
      if (currentStep.targetBools[key] !== originalStep.targetBools[key]) {
        hasUnsavedChanges.value = true;
        return;
      }
    }
    
    // ✅ NEUE PRÜFUNG: selectedResearches
    const currentResearches = currentStep.selectedResearches || [];
    const originalResearches = originalStep.selectedResearches || [];
    
    if (currentResearches.length !== originalResearches.length) {
      hasUnsavedChanges.value = true;
      return;
    }
    
    for (let j = 0; j < currentResearches.length; j++) {
      if (currentResearches[j] !== originalResearches[j]) {
        hasUnsavedChanges.value = true;
        return;
      }
    }
    
    // ✅ NEUE PRÜFUNG: selectedLevels
    const currentLevels = currentStep.selectedLevels || {};
    const originalLevels = originalStep.selectedLevels || {};
    
    const currentLevelKeys = Object.keys(currentLevels);
    const originalLevelKeys = Object.keys(originalLevels);
    
    if (currentLevelKeys.length !== originalLevelKeys.length) {
      hasUnsavedChanges.value = true;
      return;
    }
    
    for (const key of currentLevelKeys) {
      const currentArray = currentLevels[key] || [];
      const originalArray = originalLevels[key] || [];
      
      if (currentArray.length !== originalArray.length) {
        hasUnsavedChanges.value = true;
        return;
      }
      
      for (let j = 0; j < currentArray.length; j++) {
        if (currentArray[j] !== originalArray[j]) {
          hasUnsavedChanges.value = true;
          return;
        }
      }
    }
    
    // Prüfe selectedForNextTR
    if (currentStep.selectedForNextTR.length !== originalStep.selectedForNextTR.length) {
      hasUnsavedChanges.value = true;
      return;
    }
    
    for (let j = 0; j < currentStep.selectedForNextTR.length; j++) {
      if (currentStep.selectedForNextTR[j] !== originalStep.selectedForNextTR[j]) {
        hasUnsavedChanges.value = true;
        return;
      }
    }
  }
  
  // Wenn wir bis hierhin kommen, gibt es keine Änderungen
  hasUnsavedChanges.value = false;
}

// State für die Eingabefelder mit Display-Werten
const trCount = ref(props.currentStats?.trCount || 0);
const trCountDisplay = ref((props.currentStats?.trCount || 0).toString());
const allTimeOrbs = ref(props.currentStats?.allTimeOrbs || 0);
const allTimeOrbsDisplay = ref(formatSuffixNotation(props.currentStats?.allTimeOrbs || 0));

// Multi-TR Steps State
const trSteps = reactive([]);

// Refs für das Update-Modal
const showTRUpdateModal = ref(false);

// Date-Time Picker refs
const now = useNow();
const trStartDate = ref(new Date().toISOString().split('T')[0]); // Format: YYYY-MM-DD
const trStartTime = ref(new Date().toTimeString().split(' ')[0].slice(0, 5)); // Format: HH:MM

// Alerts
const showAlertDialog = ref(false);
const alertMessage = ref('');
const alertTitle = ref('TR Planner');
const alertType = ref('info');

// Berechnung der TR-Endzeit basierend auf Start und Gesamtstunden
const formatTREndDate = computed(() => {
  try {
    // Gesamtstunden berechnen
    let totalHours = 0;
    
    trSteps.forEach((step, index) => {
      const hoursInTR = step.targetLevels['hoursInTR'] !== undefined ? 
                       step.targetLevels['hoursInTR'] : 
                       step.stats.hoursInTR || 0;
                       
      // Benötigte zusätzliche Stunden ermitteln
      let additionalHours = 0;
      try {
        const orbGains = getStepOrbGains(step);
        const orbReq = getStepOrbRequirement(step, index);
        
        if (typeof calculateMissingHours === 'function' && orbGains < orbReq) {
          const adjustedBaseStats = { ...step.stats, calculatedOrbGains: orbGains };
          additionalHours = calculateMissingHours(
            hoursInTR,
            orbReq,
            adjustedBaseStats,
            { ...step.stats, ...step.targetLevels },
            allBoosts.filter(b => b.orbcalc),
            1000
          );
        }
      } catch (e) {
        console.error("Error calculating additional hours:", e);
      }
      
      totalHours += hoursInTR + additionalHours;
    });
    
    // Startdatum und -zeit parsen
    const [year, month, day] = trStartDate.value.split('-').map(Number);
    const [hours, minutes] = trStartTime.value.split(':').map(Number);
    
    // Startdatum-Objekt erstellen
    const startDate = new Date(year, month - 1, day, hours, minutes);
    
    // Millisekunden für die Gesamtstunden berechnen
    const totalMilliseconds = totalHours * 60 * 60 * 1000;
    
    // Enddatum berechnen
    const endDate = new Date(startDate.getTime() + totalMilliseconds);
    
    // Formatieren des Enddatums
    const dateOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return endDate.toLocaleDateString(undefined, dateOptions);
  } catch (e) {
    console.error("Error calculating TR end date:", e);
    return "Error calculating end date";
  }
});

// Funktion zum Initialisieren der Startzeit
function initDateTimePicker() {
  const currentDate = new Date();
  trStartDate.value = currentDate.toISOString().split('T')[0];
  
  // Format: HH:MM
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  trStartTime.value = `${hours}:${minutes}`;
}

// Ändere den Header-Text basierend darauf, ob wir bearbeiten oder neu erstellen
const modalTitle = computed(() => {
  return props.editPlanId ? 'Edit TR Plan' : 'Create New Plan';
});

// Hilfsfunktion zum Erstellen eines neuen TR-Step
function createNewTRStep() {
  return {
    id: `step_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    targetLevels: {},
    targetBools: {},
    selectedForNextTR: ['hoursInTR'],
    selectedResearches: [], // ✅ Research IDs
    selectedLevels: {},     // ✅ Research Level Details
    stats: { ...getLastStepResults() }
  };
}

function updateSelectedLevels(step, newSelectedLevels) {
  console.log("🔬 TRPlanModal: updateSelectedLevels called", {
    stepId: step.id,
    newSelectedLevels: newSelectedLevels,
    oldSelectedLevels: step.selectedLevels,
    stepObject: step
  });
  
  // ✅ Stelle sicher, dass die Property existiert
  if (!step.selectedLevels) {
    step.selectedLevels = {};
  }
  
  // ✅ Sichere Zuweisung mit Vue 3 Reactivity
  step.selectedLevels = { ...newSelectedLevels };
  
  console.log("🔬 After assignment:", step.selectedLevels);
  
  // Trigger Neuberechnung
  const stepIndex = trSteps.findIndex(s => s.id === step.id);
  if (stepIndex !== -1) {
    nextTick(() => {
      updateFollowingStepsStats(stepIndex);
      checkForChanges();
    });
  }
}

// Funktion zum Abrufen der Ergebnis-Stats des letzten Schritts
function getLastStepResults() {
  if (trSteps.length === 0) {
    // Verwende currentStats als Basis, wenn noch kein Schritt existiert
    return { 
      ...props.currentStats,
      trCount: trCount.value,
      allTimeOrbs: allTimeOrbs.value
    };
  }
  
  const lastStep = trSteps[trSteps.length - 1];
  const stats = { ...lastStep.stats };
  
  // TR Count und All-Time Orbs für den nächsten Schritt aktualisieren
  stats.trCount = (stats.trCount || trCount.value) + 1;
  stats.allTimeOrbs = (stats.allTimeOrbs || allTimeOrbs.value) + getStepOrbGains(lastStep);
  
  // Alle Zielwerte aus dem vorherigen Schritt als neue Basiswerte übernehmen
  Object.entries(lastStep.targetLevels || {}).forEach(([key, value]) => {
    stats[key] = value;
  });
  
  // Boolean-Werte übernehmen
  Object.entries(lastStep.targetBools || {}).forEach(([key, value]) => {
    if (value) {
      stats[key] = 1;
    }
  });
  
  return stats;
}

// TR Step hinzufügen
function addTRStep() {
  if (canAddNextTR.value) {
    // Sammle ausgewählte Boosts von ALLEN vorherigen TRs
    const selectedBoosts = [];
    for (const step of trSteps) {
      selectedBoosts.push(...step.selectedForNextTR);
    }
    // Entferne Duplikate und stelle sicher, dass hoursInTR enthalten ist
    const uniqueSelectedBoosts = [...new Set([...selectedBoosts, 'hoursInTR'])];
    
    // Neuen Schritt erstellen
    const newStep = createNewTRStep();
    
    // Der letzte Schritt, dessen Werte wir übernehmen möchten
    const lastStep = trSteps[trSteps.length - 1];
    
    // Für jeden vorgemerkten Boost das aktuelle Level als Ziel setzen
    uniqueSelectedBoosts.forEach(boostKey => {
      const boost = allBoosts.find(b => b.key === boostKey);
      if (boost) {
        if (boost.type === 'boolean') {
          // KORREKTUR: Nicht-permanente Boolean-Boosts sollen den Zustand vom vorherigen TR übernehmen
          // wenn sie markiert wurden, anstatt standardmäßig deaktiviert zu sein
          const wasActiveInPreviousStep = lastStep.targetBools[boostKey] || false;
          newStep.targetBools[boostKey] = wasActiveInPreviousStep;
        } else {
          newStep.targetLevels[boostKey] = newStep.stats[boostKey] || 0;
        }
      }
    });
    
    trSteps.push(newStep);
    
    // Nach dem Hinzufügen alle Stats aktualisieren
    updateFollowingStepsStats(trSteps.length - 2);
  }
}

// Letzten TR Step entfernen
function removeLastTRStep() {
  if (trSteps.length > 1) {
    trSteps.pop();
  }
}

// Spezifischen TR Step entfernen
function removeStep(index) {
  if (index > 0 && index < trSteps.length) {
    trSteps.splice(index, 1);
  }
}

// Boost für den nächsten TR vormerken
function toggleBoostForNextTR(stepId, boostKey) {
  // Verhindere Deaktivierung von hoursInTR
  if (boostKey === 'hoursInTR') return;

  const stepIndex = trSteps.findIndex(step => step.id === stepId);
  if (stepIndex === -1) return;
  const step = trSteps[stepIndex];
  const selectedIndex = step.selectedForNextTR.indexOf(boostKey);
  const boost = allBoosts.find(b => b.key === boostKey);

  if (selectedIndex === -1) {
    // Markiere den Boost für alle zukünftigen Schritte
    step.selectedForNextTR.push(boostKey);
    const currentBool = step.targetBools[boostKey] || false;

    for (let i = stepIndex + 1; i < trSteps.length; i++) {
      const next = trSteps[i];

      // Liste aktualisieren
      if (!next.selectedForNextTR.includes(boostKey)) {
        next.selectedForNextTR.push(boostKey);
      }

      if (boost.type === 'boolean') {
        // Boolean-Boost: übernehme den Zustand
        if (next.targetBools[boostKey] === undefined) {
          next.targetBools[boostKey] = currentBool;
        }
      } else {
        // Numerischer Boost: setze targetLevels, damit er in planStats auftaucht
        next.targetLevels[boostKey] = next.stats[boostKey] || 0;
      }
    }
  } else {
    // Entferne den Boost aus allen zukünftigen Schritten
    step.selectedForNextTR.splice(selectedIndex, 1);

    for (let i = stepIndex + 1; i < trSteps.length; i++) {
      const next = trSteps[i];

      // aus selectedForNextTR entfernen
      const idx = next.selectedForNextTR.indexOf(boostKey);
      if (idx !== -1) {
        next.selectedForNextTR.splice(idx, 1);
      }

      if (boost.type === 'boolean') {
        // Boolean-Boost: entferne targetBools-Eintrag
        delete next.targetBools[boostKey];
      } else {
        // Numerischer Boost: entferne targetLevels-Eintrag
        delete next.targetLevels[boostKey];
      }
    }
  }
}


// Prüfen ob ein Boost für den nächsten TR vorgemerkt ist
function isBoostSelectedForNextTR(stepId, boostKey) {
  // hoursInTR ist immer ausgewählt
  if (boostKey === 'hoursInTR') return true;
  
  const stepIndex = trSteps.findIndex(step => step.id === stepId);
  if (stepIndex !== -1) {
    return trSteps[stepIndex].selectedForNextTR.includes(boostKey);
  }
  return false;
}

// Kann ein weiterer TR hinzugefügt werden?
const canAddNextTR = computed(() => {
  // Alle vorherigen TR-Steps müssen die Anforderungen erfüllen
  if (trSteps.length === 0) return true;
  
  const lastStep = trSteps[trSteps.length - 1];
  return getStepRequirementMet(lastStep, trSteps.length - 1);
});

// Plan Validität prüfen
const isPlanValid = computed(() => {
  // Sicherheitscheck: Stelle sicher, dass planName existiert
  if (!planName || planName.value === undefined) return false;
  
  // Plan ist gültig wenn Name gesetzt ist und mind. 1 Boost in irgendeinem Schritt verändert wurde
  if (planName.value.trim() === '') return false;
  
  // Sicherheitscheck für trSteps
  if (!trSteps || !trSteps.length) return false;
  
  // Prüfe, ob mindestens ein Schritt Änderungen enthält
  return trSteps.some(step => {
    if (!step) return false;
    const targetLevels = step.targetLevels || {};
    const targetBools = step.targetBools || {};
    
    const numericBoostsSelected = Object.keys(targetLevels).length > 0;
    const booleanBoostsSelected = Object.values(targetBools).some(v => v);
    return numericBoostsSelected || booleanBoostsSelected;
  });
});

// Gefilterte Boosts nach Kategorien
function getFilteredBoostsByCategory(step) {
  try {
    // Versuche die maxLevelStats aus dem localStorage zu laden
    const maxStatsJSON = localStorage.getItem('trplanner_userstats');
    const maxStats = maxStatsJSON ? JSON.parse(maxStatsJSON) : {};
    
    // Die im OrbCalc gemaxten Boosts identifizieren
    const orbCalcMaxedBoosts = step.stats._orbCalcMaxedBoosts || {};
    
    console.log("DEBUG in getFilteredBoostsByCategory - orbCalcMaxedBoosts:", orbCalcMaxedBoosts);
    
    // Finde den Index des aktuellen Schritts
    const stepIndex = trSteps.findIndex(s => s.id === step.id);
    // Prüfe, ob es ein Folge-TR (nicht der erste) ist
    const isFollowUpTR = stepIndex > 0;
    
    // Ausgewählte Boosts von ALLEN vorherigen TRs sammeln
    let selectedBoostsForTR = [];
    if (isFollowUpTR) {
      // Gehe alle vorherigen TR-Steps durch
      for (let i = 0; i < stepIndex; i++) {
        // Sammle alle ausgewählten Boosts dieses vorherigen Schritts
        selectedBoostsForTR = [...selectedBoostsForTR, ...trSteps[i].selectedForNextTR];
      }
      // Entferne Duplikate
      selectedBoostsForTR = [...new Set(selectedBoostsForTR)];
      
      // Sicherstellen, dass hoursInTR immer enthalten ist
      if (!selectedBoostsForTR.includes('hoursInTR')) {
        selectedBoostsForTR.push('hoursInTR');
      }
    }
    
    // Filterung der Kategorien
    const filteredCategories = [];
    
    for (const category of boostsByCategory) {
      const newCategory = { ...category };
      const filteredBoosts = [];
      
      for (const boost of category.boosts) {
        // HAUPTREGEL 1: Boost ausblenden, wenn er in _orbCalcMaxedBoosts als maxed markiert ist
        // AUSNAHME: hoursInTR wird immer angezeigt
        if (orbCalcMaxedBoosts[boost.key] && boost.key !== 'hoursInTR') {
          continue; // Boost überspringen, wenn er maxed ist
        }
        
        // HAUPTREGEL 2: In Folge-TRs nur ausgewählte Boosts anzeigen
        if (isFollowUpTR && !selectedBoostsForTR.includes(boost.key) && boost.key !== 'hoursInTR') {
          continue; // Boost überspringen, wenn er nicht ausgewählt ist
        }
        
        // HAUPTREGEL 3: Nach Suchbegriff filtern, falls vorhanden
        if (searchQuery.value.trim()) {
          const query = searchQuery.value.toLowerCase();
          if (!(boost.label.toLowerCase().includes(query) || boost.key.toLowerCase().includes(query))) {
            continue; // Boost überspringen, wenn er nicht dem Suchbegriff entspricht
          }
        }
        
        // Boost in die gefilterte Liste aufnehmen
        filteredBoosts.push(boost);
      }
      
      // Nur wenn die Kategorie gefilterte Boosts hat, füge sie hinzu
      if (filteredBoosts.length > 0) {
        newCategory.boosts = filteredBoosts;
        filteredCategories.push(newCategory);
      }
    }
    
    return filteredCategories;
  } catch (error) {
    console.error("### Fehler beim Laden der maxLevelStats:", error);
    // Falls ein Fehler auftritt, Standard-Filterung ohne maxLevelStats
    return boostsByCategory;
  }
}

// Boolean Boost für einen bestimmten Schritt togglen
function toggleBooleanTarget(stepId, boostKey) {
  const stepIndex = trSteps.findIndex(s => s.id === stepId);
  if (stepIndex === -1) return;

  const step = trSteps[stepIndex];
  const boost = allBoosts.find(b => b.key === boostKey);
  if (!boost) return;

  /* --------------------------------------------------
     A) Ausgangswerte                                 */
  const inheritedVal = !!step.stats[boostKey];           // geerbter 0/1‑Wert
  const currentVal   = getTargetBool(stepId, boostKey);  // was UI gerade zeigt
  const newVal       = !currentVal;                      // toggeln

  // Verhindern, dass permanente aktivierte Boosts deaktiviert werden
  if (boost.permanent && !newVal) {
    // In Folge-TRs: Prüfen ob der Boost in früheren TRs aktiviert wurde
    if (stepIndex > 0) {
      for (let i = 0; i < stepIndex; i++) {
        const prevStep = trSteps[i];
        const wasActive = prevStep.targetBools[boostKey] === true ||
                         (prevStep.stats[boostKey] && !Object.prototype.hasOwnProperty.call(prevStep.targetBools, boostKey));
        
        if (wasActive) {
          // Boost war in einem früheren TR aktiviert - deaktivieren nicht erlaubt
          console.log(`Permanenter Boolean-Boost ${boostKey} kann nicht deaktiviert werden, da er in einem früheren TR aktiviert wurde`);
          return; // Ohne Änderung abbrechen
        }
      }
    }
  }

  /* --------------------------------------------------
     B) expliziten Eintrag setzen / entfernen          */
  if (newVal === inheritedVal) {
    // gleicher Wert wie geerbt ­→ kein Override nötig
    delete step.targetBools[boostKey];
  } else {
    // anderer Wert ­→ Override speichern
    step.targetBools[boostKey] = newVal;
  }

  /* --------------------------------------------------
     C) bei nicht‑permanenten Boosts den realen        *
     Stat‑Wert dieses TRs sofort angleichen            */
  if (!boost.permanent) {
    step.stats[boostKey] = newVal ? 1 : 0;
  } else {
    // WICHTIG: Bei permanenten Boosts, wenn sie aktiviert werden,
    // auch in allen nachfolgenden TRs aktivieren
    if (newVal) {
      for (let i = stepIndex + 1; i < trSteps.length; i++) {
        const nextStep = trSteps[i];
        nextStep.targetBools[boostKey] = true; // In Folge-TRs aktivieren
        nextStep.stats[boostKey] = 1;          // Auch in Stats setzen
      }
    }
  }

  /* --------------------------------------------------
     D) Folge‑TRs neu aufbauen                         */
  updateFollowingStepsStats(stepIndex);
}

// Target Level für einen bestimmten Schritt aktualisieren
function updateTargetLevel(stepId, boostKey, newValue) {
  const stepIndex = trSteps.findIndex(step => step.id === stepId);
  if (stepIndex === -1) return;
  
  const step = trSteps[stepIndex];
  const boost = allBoosts.find(b => b.key === boostKey);
  
  if (boost) {
    let minLevel = 0;
    
    // Bei permanenten Boosts kann der Wert nicht unter dem Startwert liegen
    if (boost.permanent && stepIndex > 0) {
      // Für Folge-TRs: Min-Level ist der aktuelle Wert oder der Wert des vorherigen TRs
      if (stepIndex > 0) {
        const prevStep = trSteps[stepIndex - 1];
        const prevTargetLevel = prevStep.targetLevels[boostKey];
        const prevLevel = prevTargetLevel !== undefined ? prevTargetLevel : (prevStep.stats[boostKey] || 0);
        minLevel = Math.max(minLevel, prevLevel);
      }
    }
    
    // Wert validieren
    let validValue = Math.max(Math.floor(newValue), minLevel);
    
    // Max Level beachten wenn vorhanden
    if (boost.max !== undefined) {
      validValue = Math.min(validValue, boost.max);
    }
    
    // Wert im aktuellen Schritt aktualisieren
    step.targetLevels[boostKey] = validValue;
    
    // Für Boon-Level-Änderungen den gesamten targetLevels-Eintrag neu setzen
    if (boostKey === 'boonELevel' || boostKey === 'boonHLevel') {
      step.targetLevels = { ...step.targetLevels };
    }
    
    // NEU: Aktualisiere alle nachfolgenden TR-Steps mit den neuen akkumulierten Stats
    updateFollowingStepsStats(stepIndex);
  }
}

// Hilfsfunktion, um zu prüfen, ob ein Boost "permanent" ist
function isPermanentBoost(key) {
  const found = allBoosts.find(b => b.key === key);
  return found && found.permanent;
}

function updateFollowingStepsStats(modifiedStepIndex) {
  if (modifiedStepIndex >= trSteps.length - 1) return;

  // ►   Referenz auf die Defaults des Haupt‑TR
  const mainBoolDefaults = {};
  allBoosts
    .filter(b => b.type === 'boolean' && !b.permanent)
    .forEach(b => { mainBoolDefaults[b.key] = !!trSteps[0].stats[b.key]; });

  /* -------------------------------------------------------------
     1. accumulatedStats des modifizierten Steps bilden
  ----------------------------------------------------------------*/
  let accumulatedStats = { ...trSteps[modifiedStepIndex].stats,
                           ...trSteps[modifiedStepIndex].targetLevels };

  Object.entries(trSteps[modifiedStepIndex].targetBools).forEach(([k, on]) => {
    accumulatedStats[k] = on ? 1 : 0;
  });

  /* -------------------------------------------------------------
     2. Prüfe für alle permanenten Boolean-Boosts, ob sie in irgendeinem
        vorherigen TR aktiviert wurden
  ----------------------------------------------------------------*/
  // Map für permanente Boosts, die aktiviert sind
  const activatedPermanentBoosts = {};
  
  // Durchlaufe alle früheren TRs
  for (let i = 0; i <= modifiedStepIndex; i++) {
    const earlierStep = trSteps[i];
    
    // Alle Boolean-Boosts prüfen
    allBoosts
      .filter(b => b.type === 'boolean' && b.permanent)
      .forEach(b => {
        const key = b.key;
        // Ist der Boost in diesem TR aktiviert?
        const isActive = earlierStep.targetBools[key] === true || 
                        (earlierStep.stats[key] && !Object.prototype.hasOwnProperty.call(earlierStep.targetBools, key));
        
        if (isActive) {
          activatedPermanentBoosts[key] = true;
        }
      });
  }

  /* -------------------------------------------------------------
     3. alle Folge‑TRs aktualisieren
  ----------------------------------------------------------------*/
  for (let i = modifiedStepIndex + 1; i < trSteps.length; i++) {
    const step      = trSteps[i];
    const prevStep  = i === modifiedStepIndex + 1
                      ? trSteps[modifiedStepIndex]
                      : trSteps[i - 1];
    const prevGains = getStepOrbGains(prevStep);

    /* ---- Basiswerte übernehmen --------------------------------*/
    const oldFlags = step.stats._orbCalcMaxedBoosts || {};
    step.stats = { ...step.stats, ...accumulatedStats };
    if (Object.keys(oldFlags).length) step.stats._orbCalcMaxedBoosts = oldFlags;

    step.stats.trCount     = trCount.value + i;
    step.stats.allTimeOrbs = prevStep.stats.allTimeOrbs + prevGains;

    /* ---- Permanente Level nicht unterschreiten ----------------*/
    Object.keys(step.targetLevels).forEach(k => {
      if (isPermanentBoost(k) && step.targetLevels[k] < step.stats[k]) {
        step.targetLevels[k] = step.stats[k];
      }
    });

    /* ---- Permanente Boolean-Boosts aus früheren TRs übernehmen ----*/
    Object.keys(activatedPermanentBoosts).forEach(key => {
      step.targetBools[key] = true;
      step.stats[key] = 1;
    });

    /* ---- Boolean‑Status bestimmen -----------------------------*/
    allBoosts
      .filter(b => b.type === 'boolean' && !b.permanent)
      .forEach(b => {
        const key         = b.key;
        const hasTarget   = Object.prototype.hasOwnProperty.call(step.targetBools, key);
        const isSelected  = step.selectedForNextTR.includes(key);

        if (hasTarget) {
          // explizites ON / OFF
          step.stats[key] = step.targetBools[key] ? 1 : 0;
        }
        else if (!isSelected) {
          // nicht markiert  →  Wert aus Haupt‑TR
          step.stats[key] = mainBoolDefaults[key] ? 1 : 0;
        }
        // sonst (markiert, aber ohne explizites Target) bleibt der
        // bisherige inherited‑Wert in step.stats unverändert
      });

    /* ---- accumulatedStats für nächste Runde -------------------*/
    accumulatedStats = { ...step.stats, ...step.targetLevels };
    Object.entries(step.targetBools).forEach(([k, on]) => {
      accumulatedStats[k] = on ? 1 : 0;
    });
  }

  /* Reactivity kick */
  nextTick(() => { trSteps.length = trSteps.length; });
}

function isPermanentAndActivatedBefore(stepId, boostKey) {
  const stepIndex = trSteps.findIndex(s => s.id === stepId);
  if (stepIndex <= 0) return false;
  
  const boost = allBoosts.find(b => b.key === boostKey);
  if (!boost || !boost.permanent) return false;
  
  // Prüfen, ob in früheren TRs aktiviert
  for (let i = 0; i < stepIndex; i++) {
    const prevStep = trSteps[i];
    const wasActive = prevStep.targetBools[boostKey] === true || 
                     (prevStep.stats[boostKey] && !Object.prototype.hasOwnProperty.call(prevStep.targetBools, boostKey));
    if (wasActive) return true;
  }
  
  return false;
}

// Target Boolean für einen Schritt abrufen
function getTargetBool(stepId, boostKey) {
  const step = trSteps.find(s => s.id === stepId);
  if (!step) return false;

  // 1) expliziter Wert für diesen TR?
  if (Object.prototype.hasOwnProperty.call(step.targetBools, boostKey)) {
    return step.targetBools[boostKey];
  }

  // 2) sonst geerbter Wert aus stats (Haupt‑TR oder vorheriger TR)
  return !!step.stats[boostKey];
}

// Target Level für einen Schritt abrufen
function getTargetLevel(stepId, boostKey) {
  const stepIndex = trSteps.findIndex(step => step.id === stepId);
  if (stepIndex !== -1) {
    const step = trSteps[stepIndex];
    if (step.targetLevels[boostKey] === undefined) {
      // Default target level ist der aktuelle Level aus dem step.stats
      step.targetLevels[boostKey] = step.stats[boostKey] || 0;
    }
    return step.targetLevels[boostKey];
  }
  return 0;
}

// Level aus dem vorherigen Schritt abrufen
function getPreviousStepLevel(currentStepIndex, boostKey) {
  if (currentStepIndex > 0 && currentStepIndex < trSteps.length) {
    const prevStep = trSteps[currentStepIndex - 1];
    if (prevStep.targetLevels[boostKey] !== undefined) {
      return prevStep.targetLevels[boostKey];
    }
    return prevStep.stats[boostKey] || 0;
  }
  return props.currentStats[boostKey] || 0;
}

// Aktuellen Level eines Boosts in einem Schritt abrufen
function getCurrentLevel(boost, step) {
  return step.stats[boost.key] || 0;
}

function getStepOrbRequirement(step, stepIndex) {
  // Ersetze komplizierte Logik durch einfache Fallunterscheidung
  
  if (stepIndex === 0) {
    // Für den Haupt-TR - Berechne für den AKTUELLEN TR
    const requirement = calculateOrbRequirement(trCount.value , allTimeOrbs.value);
    
    console.log(`Haupt-TR: TR ${trCount.value}, AllTimeOrbs: ${allTimeOrbs.value.toLocaleString()}, Requirement: ${requirement.toLocaleString()}`);
    
    return requirement;
  } else {
    // Für Folge-TRs - Rekonstruiere die Werte direkt
    
    // Berechne den korrekten AllTimeOrbs-Wert für diesen Schritt
    let calculatedAllTimeOrbs = allTimeOrbs.value;
    
    // Addiere die Orb-Gains aller vorherigen Schritte
    for (let i = 0; i < stepIndex; i++) {
      calculatedAllTimeOrbs += getStepOrbGains(trSteps[i]);
    }
    
    // KORREKTUR: Hier ist der Fehler - es muss TR + stepIndex + 1 sein,
    // damit wir für den nächsten TR (nicht übernächsten) berechnen
    const currentTR = trCount.value + stepIndex;
    const requirement = calculateOrbRequirement(currentTR, calculatedAllTimeOrbs);
    
    console.log(`Folge-TR ${stepIndex}: TR ${currentTR}, Berechnete AllTimeOrbs: ${calculatedAllTimeOrbs.toLocaleString()}, Requirement: ${requirement.toLocaleString()}`);
    
    return requirement;
  }
}

// ✅ ERWEITERTE ORB GAINS BERECHNUNG
function getStepOrbGains(step) {
  /* ---------------- Basis‑ und Ziel‑Stats bauen ---------------- */
  const baseStats = { ...step.stats };           // Start in diesem TR
  const planStats = { ...step.stats };           // nach allen Targets

  /* Wichtig: Maximierte Boosts einbeziehen */
  const orbCalcMaxedBoosts = step.stats._orbCalcMaxedBoosts || {};
  
  /* Für alle maximierten Boosts die maximalen Werte setzen */
  Object.keys(orbCalcMaxedBoosts).forEach(key => {
    const boost = allBoosts.find(b => b.key === key);
    if (boost) {
      if (boost.type === 'boolean') {
        planStats[key] = 1; // Boolean-Boosts auf aktiviert setzen
      } else if (boost.type === 'number' && boost.max !== undefined) {
        planStats[key] = boost.max; // Numerische Boosts auf Maximum setzen
      }
    }
  });

  /* numerische Ziele einblenden */
  Object.entries(step.targetLevels).forEach(([k, v]) => { 
    // Nur überschreiben, wenn der Boost nicht maximal ist
    if (!orbCalcMaxedBoosts[k]) {
      planStats[k] = v; 
    }
  });

  /* Boolean‑Ziele verarbeiten */
  Object.entries(step.targetBools).forEach(([k, active]) => {
    // Nur überschreiben, wenn der Boost nicht maximal ist
    if (!orbCalcMaxedBoosts[k]) {
      const def = allBoosts.find(b => b.key === k);

      if (def && !def.permanent) {
        // nicht‑permanent → in BEIDEN Stat‑Sätzen fixieren
        baseStats[k] = planStats[k] = active ? 1 : 0;
      } else if (active) {
        // permanent → nur Ziel‑Stats auf 1 setzen
        planStats[k] = 1;
      }
    }
  });

  /* ✅ RESEARCH SPECIAL HANDLING */
  const orbCalcBoosts = allBoosts.filter(b => b.orbcalc);
  const modifiedBoosts = orbCalcBoosts.map(boost => {
    if (boost.key === 'research') {
      // Erstelle eine Kopie des Boosts mit modifizierter Multiplier-Funktion
      return {
        ...boost,
        multiplier: (value, allValues) => getResearchMultiplierWithChanges(value, allValues, step)
      };
    }
    return boost;
  });

  /* ---------------- Orb‑Gains mit modifizierten Boosts berechnen ------------------------ */
  return calculateOrbGains(baseStats, planStats, modifiedBoosts);
}

// Fragment Gains für einen Schritt berechnen
function getStepFragGains(step) {
  // Plan Stats für diesen Schritt zusammenstellen
  const planStats = { ...step.stats };
  
  /* Wichtig: Maximierte Boosts einbeziehen */
  const orbCalcMaxedBoosts = step.stats._orbCalcMaxedBoosts || {};
  
  /* Für alle maximierten Boosts die maximalen Werte setzen */
  Object.keys(orbCalcMaxedBoosts).forEach(key => {
    const boost = allBoosts.find(b => b.key === key);
    if (boost) {
      if (boost.type === 'boolean') {
        planStats[key] = 1; // Boolean-Boosts auf aktiviert setzen
      } else if (boost.type === 'number' && boost.max !== undefined) {
        planStats[key] = boost.max; // Numerische Boosts auf Maximum setzen
      }
    }
  });
  
  // Numerische Boosts aus targetLevels
  Object.keys(step.targetLevels).forEach(key => {
    // Nur überschreiben, wenn der Boost nicht maximal ist
    if (!orbCalcMaxedBoosts[key]) {
      planStats[key] = step.targetLevels[key];
    }
  });
  
  // Boolean Boosts aus targetBools
  Object.entries(step.targetBools).forEach(([key, isActive]) => {
    // Nur überschreiben, wenn der Boost nicht maximal ist
    if (!orbCalcMaxedBoosts[key]) {
      if (isActive) {
        planStats[key] = 1;
      }
    }
  });
  
  // Fragment-relevante Boosts filtern
  const fragMultiBoosts = allBoosts.filter(b => b.fragmulti !== undefined);
  
  // Fragment-Gewinne berechnen
  return calculateCampaignFragGains(step.stats, planStats, fragMultiBoosts);
}

// Verfügbare Orbs für einen Schritt berechnen
function getStepOrbsAvailable(step) {
  // Im ersten Schritt verwenden wir den Wert aus currentStats
  if (trSteps[0]?.id === step.id) {
    return props.currentStats.hoursInTR || 0;
  }
  
  // In späteren Schritten verwenden wir die targetLevels des Schritts, wenn verfügbar
  if (step.targetLevels['hoursInTR'] !== undefined) {
    return step.targetLevels['hoursInTR'];
  }
  
  // Ansonsten den Wert aus den Step-Stats
  return step.stats.hoursInTR || 0;
}

// Anforderung erfüllt?
function getStepRequirementMet(step, stepIndex) {
  // Debug-Informationen sammeln
  const orbGains = getStepOrbGains(step);
  const orbReq = getStepOrbRequirement(step, stepIndex);
  
  // Alle relevanten Orb-Boosts loggen
  const orbCalcBoosts = allBoosts.filter(b => b.orbcalc);
  orbCalcBoosts.forEach(boost => {
    const key = boost.key;
    const targetLevel = step.targetLevels[key] !== undefined ? step.targetLevels[key] : step.stats[key] || 0;
    const multiplier = getBoostMultiplier(boost, targetLevel, {...step.stats, ...step.targetLevels});
    
    if (boost.type === 'boolean') {
      const isActive = step.targetBools[key] !== undefined ? step.targetBools[key] : !!(step.stats[key] || 0);
    } 
  });
  
  // Ergebnis der Prüfung
  const meetsRequirement = orbGains >= orbReq;

  return meetsRequirement;
}

// Hilfsfunktion zum Abrufen des Multiplikators für einen Boost
function getBoostMultiplier(boost, level, stats) {
  if (!boost || boost.multiplier === undefined) return null;
  
  if (boost.type === 'boolean') {
    // Boolean boosts
    const isActive = stats[boost.key] || false;
    if (typeof boost.multiplier === 'number') {
      return isActive ? boost.multiplier : 1;
    } else if (typeof boost.multiplier === 'function') {
      try {
        return isActive ? boost.multiplier(1, stats) : 1;
      } catch (e) {
        console.error(`Error calculating multiplier for ${boost.key}:`, e);
        return null;
      }
    }
  } else {
    // Numeric boosts
    if (typeof boost.multiplier === 'number') {
      return boost.multiplier;
    } else if (typeof boost.multiplier === 'function') {
      try {
        return boost.multiplier(level, stats);
      } catch (e) {
        console.error(`Error calculating multiplier for ${boost.key}:`, e);
        return null;
      }
    }
  }
  
  return null;
}

// Hilfsfunktionen für Multiplier-Anzeige für einen bestimmten Schritt
function getMultiplierText(boost, step) {
  if (!boost || boost.multiplier === undefined) return null;
  
  // Ziellevel mit aktuellem Wert oder Default nutzen
  const boostKey = boost.key;
  const targetLevel = step.targetLevels[boostKey] !== undefined ? 
                      step.targetLevels[boostKey] : 
                      step.stats[boostKey] || 0;
  
  // Stelle sicher, dass wir eine aktuelle Kopie der Stats mit Berücksichtigung der target Levels erstellen
  const combinedStats = { ...step.stats };
  
  // Alle targetLevels in die combinedStats einfließen lassen
  Object.entries(step.targetLevels).forEach(([key, value]) => {
    combinedStats[key] = value;
  });
  
  // Jetzt mit den kombiniert aktualisierten Stats die Berechnung durchführen
  
  // Spezialfall für Boolean-Boosts
  if (boost.type === 'boolean') {
    // Status von targetBools und fallback auf stats
    const isActive = step.targetBools[boostKey] !== undefined ? 
                    step.targetBools[boostKey] : 
                    !!(step.stats[boostKey] || 0);

    if (typeof boost.multiplier === 'number') {
      return isActive ? formatMultiplier(boost.multiplier) : '×1.00';
    }
    return isActive ? formatMultiplier(boost.multiplier(1, combinedStats)) : '×1.00';
  }
  
  // Spezialfall für hoursInTR und loopMods
  if (boostKey === 'hoursInTR' || boostKey === 'loopMods') {
    try {
      if (typeof boost.multiplier === 'function') {
        const value = boost.multiplier(targetLevel, combinedStats);
        return formatMultiplier(value);
      } else {
        if (boostKey === 'loopMods') {
          const hoursBoost = allBoosts.find(b => b.key === 'hoursInTR');
          if (hoursBoost && typeof hoursBoost.multiplier === 'function') {
            const value = hoursBoost.multiplier(combinedStats.hoursInTR, combinedStats);
            return formatMultiplier(value);
          }
        }
        return formatMultiplier(boost.multiplier);
      }
    } catch (e) {
      console.error(`Error calculating multiplier for ${boostKey}:`, e);
      return '×1.00';
    }
  }
  
  // Standardfall für numerische Boosts
  if (typeof boost.multiplier === 'number') {
    return formatMultiplier(boost.multiplier);
  } else if (typeof boost.multiplier === 'function') {
    try {
      // Hier die kombinierten Stats verwenden
      const value = boost.multiplier(targetLevel, combinedStats);
      return formatMultiplier(value);
    } catch (e) {
      console.error(`Error calculating multiplier for ${boostKey}:`, e);
      return '×1.00';
    }
  }
  
  return null;
}

// Hilfsfunktion für Fragmulti-Anzeige für einen bestimmten Schritt
function getFragMultiplierText(boost, step) {
  if (!boost || boost.fragmulti === undefined) return null;
  
  // Ziellevel mit aktuellem Wert oder Default nutzen
  const boostKey = boost.key;
  const targetLevel = step.targetLevels[boostKey] !== undefined ? 
                      step.targetLevels[boostKey] : 
                      step.stats[boostKey] || 0;
  
  // Stelle sicher, dass wir eine aktuelle Kopie der Stats mit Berücksichtigung der target Levels erstellen
  const combinedStats = { ...step.stats };
  
  // Alle targetLevels in die combinedStats einfließen lassen
  Object.entries(step.targetLevels).forEach(([key, value]) => {
    combinedStats[key] = value;
  });
  
  // Spezialfall für Boolean-Boosts
  if (boost.type === 'boolean') {
    const isActive = step.targetBools[boostKey] !== undefined ? 
      step.targetBools[boostKey] : 
      !!(step.stats[boostKey] || 0);

    if (typeof boost.fragmulti === 'number') {
      return isActive ? formatMultiplier(boost.fragmulti) : '×1.00';
    }
    return isActive ? formatMultiplier(boost.fragmulti(1, combinedStats)) : '×1.00';
  }
  
  // Spezialfall für R6 mit +x.xx Anzeige
  if (boostKey === 'r6') {
    try {
      const value = targetLevel;
      const part1 = 2.75 * value;
      const part2 = Math.pow(1.05, value);
      
      return {
        part1: `+${part1.toFixed(2)}`,
        part2: formatMultiplier(part2)
      };
    } catch (e) {
      console.error(`Error calculating r6 fragmulti:`, e);
      return {
        part1: '+0.00',
        part2: '×1.00'
      };
    }
  }
  
  // Standardfall für numerische Boosts
  if (typeof boost.fragmulti === 'number') {
    return formatMultiplier(boost.fragmulti);
  } else if (typeof boost.fragmulti === 'function') {
    try {
      // Hier die kombinierten Stats verwenden statt nur step.stats
      const value = boost.fragmulti(targetLevel, combinedStats);
      return formatMultiplier(value);
    } catch (e) {
      console.error(`Error calculating fragmulti for ${boostKey}:`, e);
      return '×1.00';
    }
  }
  
  return null;
}

// Cup Multiplier für einen Schritt berechnen
function getCupMultiplierText(step) {
  const hoursInTR = step.targetLevels['hoursInTR'] !== undefined ? 
                    step.targetLevels['hoursInTR'] : 
                    step.stats.hoursInTR || 0;
  
  if (!hoursInTR) return '×1.00'; // Standardwert
  
  const cupMulti = Math.min(2, Math.max(1, (hoursInTR * 0.00024) / 0.25 + 1));
  return formatMultiplier(cupMulti);
}


function clearSearch() {
  searchQuery.value = '';
}

function applyChainStepBoosts(newStep, chainStep) {
  chainStep.boosts.forEach(boost => {
    if (boost.type === 'number') {
      newStep.targetLevels[boost.key] = boost.targetLevel;
    } else if (boost.type === 'boolean') {
      newStep.targetBools[boost.key] = boost.targetState; 
    }
  });
}

// ---------------------------------------------------------------------------
//  initData – TR‑Plan laden oder neu initialisieren
// ---------------------------------------------------------------------------
function initData() {
  try {
    error.value = null;
    trSteps.length = 0;
    initDateTimePicker();

    // Basis‑Stats aus props kopieren
    const baseStats = {
      ...props.currentStats,
      trCount:     props.currentStats.trCount     || 0,
      allTimeOrbs: props.currentStats.allTimeOrbs || 0
    };

    // ───────────────────────── erster Step ─────────────────────────
    let firstStep;
    if (props.editPlanId) {
      const plan = trPlannerStore.getTRPlanById(props.editPlanId);
      if (!plan) throw new Error('Plan nicht gefunden');

      // Meta‑Infos
      planName.value    = plan.name;
      trStartDate.value = plan.trStartDate || trStartDate.value;
      trStartTime.value = plan.trStartTime || trStartTime.value;

      trCount.value        = plan.updatedStats?.trCount     ?? baseStats.trCount;
      trCountDisplay.value = String(trCount.value);
      allTimeOrbs.value    = plan.updatedStats?.allTimeOrbs ?? baseStats.allTimeOrbs;
      allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);

      // ✅ WICHTIGE KORREKTUR: updatedStats haben Vorrang vor baseStats
      const statsWithOrbCalcFlags = {
        ...baseStats,                    // Fallback-Werte
        ...(plan.updatedStats || {}),    // ✅ Plan-Stats haben Vorrang!
        trCount:     trCount.value,
        allTimeOrbs: allTimeOrbs.value
      };
      
      // Wenn der gespeicherte Plan _orbCalcMaxedBoosts enthält, übernimm es
      if (plan.updatedStats && plan.updatedStats._orbCalcMaxedBoosts) {
        statsWithOrbCalcFlags._orbCalcMaxedBoosts = {...plan.updatedStats._orbCalcMaxedBoosts};
        console.log("Wiederhergestellte _orbCalcMaxedBoosts-Flags:", statsWithOrbCalcFlags._orbCalcMaxedBoosts);
      }

      firstStep = {
        id: `step_${Date.now()}`,
        stats: statsWithOrbCalcFlags,
        targetLevels:      {},
        targetBools:       {},
        selectedForNextTR: Array.isArray(plan.selectedForNextTR)
                           ? [...plan.selectedForNextTR]
                           : ['hoursInTR'],
        // ✅ WICHTIGE KORREKTUR: Research-Daten beim Laden wiederherstellen
        selectedResearches: plan.selectedResearches ? [...plan.selectedResearches] : [],
        selectedLevels: plan.selectedLevels ? JSON.parse(JSON.stringify(plan.selectedLevels)) : {}          
      };

      console.log("🔬 initData: Loaded research data:", {
        planSelectedResearches: plan.selectedResearches,
        planSelectedLevels: plan.selectedLevels,
        firstStepSelectedResearches: firstStep.selectedResearches,
        firstStepSelectedLevels: firstStep.selectedLevels
      });

      if (!firstStep.selectedForNextTR.includes('hoursInTR'))
        firstStep.selectedForNextTR.push('hoursInTR');

      // Debug-Ausgabe für Research-Daten
      console.log("✅ Research-Daten beim Laden wiederhergestellt:", {
        selectedResearches: firstStep.selectedResearches,
        selectedLevels: firstStep.selectedLevels
      });

      // ✅ KORREKTUR: Boosts aus plan.boosts übernehmen OHNE stats zu überschreiben
      plan.boosts.forEach(b => {
        if (b.type === 'number') {
          firstStep.targetLevels[b.key] = b.targetLevel;
          // ✅ Stats NICHT überschreiben - kommen aus updatedStats
        } else if (b.type === 'boolean') {
          const state = Boolean(b.targetState);
          const currentStateInStats = !!(statsWithOrbCalcFlags[b.key] || 0);
          
          // ✅ Nur targetBools setzen wenn anders als gespeicherter Zustand
          if (state !== currentStateInStats) {
            firstStep.targetBools[b.key] = state;
          }
          
          console.log(`✅ Boolean-Boost ${b.key} geladen: targetState=${state}, statsValue=${statsWithOrbCalcFlags[b.key]}`);
        }
      });

      console.log("✅ Erster Step nach dem Laden:", {
        targetBools: firstStep.targetBools,
        selectedResearches: firstStep.selectedResearches,
        selectedLevels: firstStep.selectedLevels,
        relevantStats: Object.fromEntries(
          Object.entries(firstStep.stats).filter(([key, value]) => 
            allBoosts.some(b => b.type === 'boolean' && b.key === key)
          )
        )
      });

    } else {
      // Neuer Plan - unverändert
      const statsWithFlags = { ...baseStats };

      if (props.currentStats && props.currentStats._orbCalcMaxedBoosts) {
        statsWithFlags._orbCalcMaxedBoosts = {...props.currentStats._orbCalcMaxedBoosts};
        console.log("Übernommene _orbCalcMaxedBoosts-Flags aus currentStats:", statsWithFlags._orbCalcMaxedBoosts);
      }

      firstStep = {
        id: `step_${Date.now()}`,
        stats: statsWithFlags,
        targetLevels: {},
        targetBools:  {},
        selectedForNextTR: ['hoursInTR'],
        selectedResearches: [], 
        selectedLevels: {}     
      };
    }

    trSteps.push(firstStep);

    // ───────────────────────── Chain‑Schritte ─────────────────────────
    if (props.editPlanId) {
      const plan = trPlannerStore.getTRPlanById(props.editPlanId);
      if (Array.isArray(plan.trChain) && plan.trChain.length) {
        // ✅ WICHTIG: Akkumulierte Stats korrekt aufbauen
        let acc = { ...firstStep.stats, ...firstStep.targetLevels };
        
        // Boolean-Zustände vom ersten Step in acc übernehmen
        Object.entries(firstStep.targetBools).forEach(([key, isActive]) => {
          acc[key] = isActive ? 1 : 0;
        });
        
        acc.trCount++;
        acc.allTimeOrbs += getStepOrbGains(firstStep);

        plan.trChain.forEach((chain, idx) => {
          const step = {
            id: `chain_${Date.now()}_${idx}`,
            stats: { ...acc },
            targetLevels:      {},
            targetBools:       {},
            selectedForNextTR: Array.isArray(chain.selectedForNextTR)
                               ? [...chain.selectedForNextTR]
                               : ['hoursInTR'],
            // ✅ WICHTIGE KORREKTUR: Research-Daten für Chain-Steps wiederherstellen
            selectedResearches: chain.selectedResearches ? [...chain.selectedResearches] : [],
            selectedLevels: chain.selectedLevels ? JSON.parse(JSON.stringify(chain.selectedLevels)) : {}
          };
          if (!step.selectedForNextTR.includes('hoursInTR'))
            step.selectedForNextTR.push('hoursInTR');

          // Debug-Ausgabe für Chain Research-Daten
          console.log(`✅ Chain Step ${idx} Research-Daten:`, {
            selectedResearches: step.selectedResearches,
            selectedLevels: step.selectedLevels
          });

          // Numerische Boosts
          chain.boosts
            .filter(b => b.type === 'number')
            .forEach(b => {
              step.targetLevels[b.key] = b.targetLevel;
            });

          // ✅ Boolean‑Boosts korrekt laden
          chain.boosts
            .filter(b => b.type === 'boolean')
            .forEach(b => {
              const def   = allBoosts.find(x => x.key === b.key);
              const state = Boolean(b.targetState);

              // ✅ NUR targetBools setzen wenn es anders ist als der geerbte Zustand
              const currentStateInStats = !!(step.stats[b.key] || 0);
              
              if (state !== currentStateInStats) {
                step.targetBools[b.key] = state;
              }

              // ✅ UI‑Merker ergänzen, falls noch nicht vorhanden
              if (!step.selectedForNextTR.includes(b.key)) {
                step.selectedForNextTR.push(b.key);
              }

              console.log(`✅ Chain Boolean-Boost ${b.key} geladen: targetState=${state}, statsValue=${step.stats[b.key]}, targetBools=${step.targetBools[b.key]}`);
            });

          trSteps.push(step);

          // ✅ Stats für nächsten Schritt korrekt berechnen
          acc = { ...step.stats, ...step.targetLevels };
          
          // Boolean-Zustände korrekt in acc übernehmen
          Object.entries(step.targetBools).forEach(([key, isActive]) => {
            acc[key] = isActive ? 1 : 0;
          });
          
          acc.trCount++;
          acc.allTimeOrbs += getStepOrbGains(step);
        });
      }
    }

    // Suchfeld zurücksetzen
    searchQuery.value = '';

    // ✅ WICHTIG: Stats neu berechnen NACH dem Laden
    nextTick(() => {
      updateFollowingStepsStats(0);
      
      // ✅ WICHTIG: Research-Daten nach Stats-Update wiederherstellen falls nötig
      if (props.editPlanId && trSteps.length > 0) {
        const plan = trPlannerStore.getTRPlanById(props.editPlanId);
        if (plan.selectedResearches || plan.selectedLevels) {
          trSteps[0].selectedResearches = plan.selectedResearches ? [...plan.selectedResearches] : [];
          trSteps[0].selectedLevels = plan.selectedLevels ? JSON.parse(JSON.stringify(plan.selectedLevels)) : {};
          
          console.log("🔬 Restored research data after stats update:", {
            selectedResearches: trSteps[0].selectedResearches,
            selectedLevels: trSteps[0].selectedLevels
          });
          
          // Auch für Chain-Steps wiederherstellen
          for (let i = 1; i < trSteps.length && i - 1 < plan.trChain.length; i++) {
            const chainData = plan.trChain[i - 1];
            if (chainData.selectedResearches || chainData.selectedLevels) {
              trSteps[i].selectedResearches = chainData.selectedResearches ? [...chainData.selectedResearches] : [];
              trSteps[i].selectedLevels = chainData.selectedLevels ? JSON.parse(JSON.stringify(chainData.selectedLevels)) : {};
              
              console.log(`🔬 Restored chain research data for step ${i}:`, {
                selectedResearches: trSteps[i].selectedResearches,
                selectedLevels: trSteps[i].selectedLevels
              });
            }
          }
        }
      }
      
      // NACH dem Neuladen den ursprünglichen Zustand erfassen
      nextTick(() => {
        captureOriginalState();
      });
    });
  }
  catch (e) {
    console.error('initData Error:', e);
    error.value = `Initialization failed: ${e.message}`;
  }
}

// Korrektur in der createPlan-Funktion
function createPlan() {
  if (!isPlanValid.value) return;

  // --- 1) Erster TR als Basis ---
  const firstStep = trSteps[0];

  // ✅ KORREKTUR: updatedStats sollen alle Boolean-Zustände aus dem ersten Step enthalten
  const updatedStats = {
    ...props.currentStats,
    ...firstStep.stats,        // ✅ Alle Stats aus dem ersten Step übernehmen
    ...firstStep.targetLevels, // ✅ Alle Target-Levels übernehmen
    trCount: trCount.value,
    allTimeOrbs: allTimeOrbs.value
  };
  
  // ✅ WICHTIGE KORREKTUR: ALLE Boolean-Zustände korrekt übertragen
  allBoosts
    .filter(b => b.type === 'boolean')
    .forEach(boost => {
      const key = boost.key;
      
      // Priorität: targetBools > stats
      if (firstStep.targetBools[key] !== undefined) {
        // Expliziter Zielzustand
        updatedStats[key] = firstStep.targetBools[key] ? 1 : 0;
      } else {
        // Geerbter Zustand aus stats
        updatedStats[key] = firstStep.stats[key] || 0;
      }
    });

  // --- 3) Boost‑Details aus dem ersten Schritt (Plan.boosts) ---
  if (firstStep.stats._orbCalcMaxedBoosts) {
    updatedStats._orbCalcMaxedBoosts = { ...firstStep.stats._orbCalcMaxedBoosts };
    console.log("_orbCalcMaxedBoosts in updatedStats übernommen:", updatedStats._orbCalcMaxedBoosts);
  }
  
  console.log("✅ Final updatedStats for plan:", updatedStats);
  
  const boostDetails = [];

  // 3a) Numerische Boosts
  Object.entries(firstStep.targetLevels || {}).forEach(([key, targetLevel]) => {
    const boost = allBoosts.find(b => b.key === key);
    if (!boost) return;
    const currentLevel = props.currentStats[key] || 0;
    if (targetLevel > currentLevel) {
      boostDetails.push({
        key,
        type: 'number',
        label: boost.label || key,
        currentLevel,
        targetLevel,
        remainingLevels: targetLevel - currentLevel
      });
    }
  });

  // 3b) Boolean‑Boosts im ersten Schritt - KORRIGIERT
  allBoosts
    .filter(b => b.type === 'boolean')
    .forEach(boost => {
      const key = boost.key;
      let targetState;
      
      // Ermittle den Zielzustand
      if (firstStep.targetBools[key] !== undefined) {
        targetState = firstStep.targetBools[key];
      } else {
        targetState = !!(firstStep.stats[key] || 0);
      }
      
      const currentState = !!(props.currentStats[key] || 0);
      
      // Nur hinzufügen wenn sich der Zustand ändert
      if (targetState !== currentState) {
        boostDetails.push({
          key,
          type: 'boolean',
          label: boost.label || key,
          currentState,
          targetState
        });
      }
    });

  // --- 4) Ergebnisse für den ersten TR ---
  const calculatedResults = {
    orbRequirement: getStepOrbRequirement(firstStep, 0),
    orbGains:        getStepOrbGains(firstStep),
    campaignFragGains: getStepFragGains(firstStep),
    requirementMet:  getStepRequirementMet(firstStep, 0),
    orbsNeeded:      getStepRequirementMet(firstStep, 0)
                      ? 0
                      : getStepOrbRequirement(firstStep, 0) - getStepOrbsAvailable(firstStep)
  };

  // Pflicht‑Check: erster TR muss gültig sein
  if (!calculatedResults.requirementMet) {
    showAlert(
      "First TR requirements not met. Please adjust your Stats to meet the requirements. The Plan will not be saved.",
      'Warning',
      'warning'
    );
    return;
  }

  // --- 5) Kette der Folge‑TRs aufbauen ---
  const validChainSteps = [];
  let accOrbs   = allTimeOrbs.value + calculatedResults.orbGains;
  let nextTR    = trCount.value + 1;

  for (let i = 1; i < trSteps.length; i++) {
    const step = trSteps[i];
    // a) Stats für diesen Ketten‑Schritt anpassen
    const adjusted = {
      ...step,
      stats: {
        ...step.stats,
        trCount:    nextTR,
        allTimeOrbs: accOrbs
      }
    };

    // b) Requirement prüfen
    if (!getStepRequirementMet(adjusted, validChainSteps.length + 1)) {
      break;
    }

    // c) Boost‑Liste dieses Schritts
    const stepBoosts = [];

    // –– numerische Boosts wie gehabt
    Object.entries(step.targetLevels || {}).forEach(([key, targetLevel]) => {
      const boost = allBoosts.find(b => b.key === key);
      if (!boost) return;
      const prev = validChainSteps.length > 0
        ? validChainSteps[validChainSteps.length - 1]
        : firstStep;
      const prevLevel = prev.targetLevels?.[key] ?? prev.stats?.[key] ?? 0;

      if (key === 'hoursInTR' || !boost.permanent || targetLevel > prevLevel) {
        stepBoosts.push({
          key,
          type: 'number',
          label: boost.label || key,
          currentLevel: prevLevel,
          targetLevel,
          remainingLevels: targetLevel - prevLevel
        });
      }
    });

    // –– Boolean‑Boosts: alle aktiven Toggles reinnehmen
    Object.entries(step.targetBools || {})
      .forEach(([key, isActive]) => {
        const boost = allBoosts.find(b => b.key === key);
        if (!boost) return;
        const prev = validChainSteps.length > 0
          ? validChainSteps[validChainSteps.length - 1]
          : firstStep;
        const prevState = !!prev.targetBools?.[key] || !!prev.stats?.[key];
        stepBoosts.push({
          key,
          type: 'boolean',
          label: boost.label || key,
          currentState: prevState,
          targetState: isActive
        });
      });

    // d) Ergebnisse dieses Schritts
    const stepResults = {
      orbRequirement: getStepOrbRequirement(adjusted, validChainSteps.length + 1),
      orbGains:        getStepOrbGains(adjusted),
      campaignFragGains: getStepFragGains(adjusted),
      requirementMet:  true
    };

    // e) In die Chain pushen
    validChainSteps.push({
      trNumber:        nextTR,
      boosts:          stepBoosts,
      results:         stepResults,
      selectedForNextTR: Array.isArray(step.selectedForNextTR)
        ? [...step.selectedForNextTR]
        : ['hoursInTR'],
      // ✅ WICHTIGE KORREKTUR: Research-Daten für Chain-Steps speichern
      selectedResearches: step.selectedResearches ? [...step.selectedResearches] : [],
      selectedLevels: step.selectedLevels ? { ...step.selectedLevels } : {}
    });

    // f) Akkumulierte Orbs/Count updaten
    accOrbs += stepResults.orbGains;
    nextTR++;

    hasUnsavedChanges.value = false;
  }

  // --- 6) Endgültiges Plan‑Objekt ---
  const planData = {
    name:              planName.value.trim(),
    trStartDate:       trStartDate.value,
    trStartTime:       trStartTime.value,
    boosts:            boostDetails,
    updatedStats,
    results:           calculatedResults,
    trChain:           validChainSteps,
    selectedForNextTR: Array.isArray(firstStep.selectedForNextTR)
                        ? [...firstStep.selectedForNextTR]
                        : ['hoursInTR'],
    // ✅ WICHTIGE KORREKTUR: Research-Daten korrekt speichern
    selectedResearches: firstStep.selectedResearches ? [...firstStep.selectedResearches] : [],  
    selectedLevels: firstStep.selectedLevels ? { ...firstStep.selectedLevels } : {},         
    progress: {
      completed:   false,
      lastUpdated: new Date().toISOString()
    }
  };

  console.log("🔬 createPlan: Saving research data:", {
    firstStepSelectedResearches: firstStep.selectedResearches,
    firstStepSelectedLevels: firstStep.selectedLevels,
    planDataSelectedResearches: planData.selectedResearches,
    planDataSelectedLevels: planData.selectedLevels
  });

  // --- 7) Plan-ID generieren, aber NICHT speichern ---
  let planId;
  if (props.editPlanId) {
    planId = props.editPlanId;
  } else {
    planId = `trplan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  // --- 8) Warnung, falls einige TRs herausgefallen sind ---
  if (trSteps.length > 1 && validChainSteps.length < trSteps.length - 1) {
    pendingSavePlanId.value = planId;
    pendingSaveData.value = planData; // Daten für später speichern
    
    showAlert(
      `Only ${validChainSteps.length + 1} of ${trSteps.length} TRs were saved. Invalid TRs have been removed.`,
      'Warning',
      'warning'
    );
    return;
  }

  // --- 9) Wenn keine Warnung nötig, JETZT speichern ---
  if (props.editPlanId) {
    const original = trPlannerStore.getTRPlanById(props.editPlanId);
    const updated = { ...original, ...planData, updatedAt: new Date().toISOString() };
    trPlannerStore.updateTRPlan(props.editPlanId, updated);
  } else {
    trPlannerStore.addTRPlan({ id: planId, createdAt: new Date().toISOString(), ...planData });
  }

  emit('save', planId);
  captureOriginalState();
  emit('close');
}

function cancelAndClose() {
  if (hasUnsavedChanges.value) {
    // Zeige Bestätigungsdialog
    alertTitle.value = "Discard changes?";
    alertMessage.value = "You have unsaved changes in this build. Are you sure you want to discard them?";
    alertType.value = "warning";
    showAlertDialog.value = true;
  } else {
    // Keine Änderungen, direkt schließen
    emit('close');
  }
}

// Funktion zum Behandeln der Bestätigung im Dialog
function handleAlertClose() {
  showAlertDialog.value = false;
  
  if (alertTitle.value === "Discard changes?") {
    // Wenn der Benutzer im "Discard changes?"-Dialog auf "Discard" klickt,
    // soll das Modal geschlossen werden
    emit('close');
  } else if (alertTitle.value === "Warning" && alertMessage.value.includes("TRs were saved")) {
    // Jetzt erst speichern, wenn der Benutzer OK klickt
    if (pendingSavePlanId.value && pendingSaveData.value) {
      const planId = pendingSavePlanId.value;
      const planData = pendingSaveData.value;
      
      if (props.editPlanId) {
        const original = trPlannerStore.getTRPlanById(planId);
        const updated = { ...original, ...planData, updatedAt: new Date().toISOString() };
        trPlannerStore.updateTRPlan(planId, updated);
      } else {
        trPlannerStore.addTRPlan({ id: planId, createdAt: new Date().toISOString(), ...planData });
      }
      
      emit('save', planId);
      captureOriginalState();
      emit('close');
      pendingSavePlanId.value = null;
    }
  }
}

// Funktion zum Behandeln des Abbruchs im Dialog
function handleAlertCancel() {
  showAlertDialog.value = false;
  
  if (alertTitle.value === "Warning" && alertMessage.value.includes("TRs were saved")) {
    // Bei Cancel die Speicherung abbrechen
    pendingSavePlanId.value = null;
    // Modal bleibt offen, damit der Benutzer weitere Änderungen vornehmen kann
  }
}

// Beobachte Änderungen der editPlanId und isVisible Props
watch(() => [props.editPlanId, props.isVisible], ([newEditPlanId, newIsVisible]) => {
  if (newIsVisible) {
    initData();
  }
}, { immediate: true });

// Wenn das Modal sich öffnet, Daten initialisieren
onMounted(() => {
  if (props.isVisible) {
    initData();
  }
});

// Funktion hinzufügen, um die benötigten Stunden für einen TR-Schritt zu berechnen
function getRequiredHoursForStep(step, stepIndex) {
  const trRequirement = getStepOrbRequirement(step, stepIndex);
  const currentHours = step.targetLevels['hoursInTR'] !== undefined ? 
                      step.targetLevels['hoursInTR'] : 
                      step.stats.hoursInTR || 0;
  
  try {
    const result = calculateMissingHours(
      currentHours,
      trRequirement,
      step.stats,
      { ...step.stats, ...step.targetLevels },
      allBoosts.filter(b => b.orbcalc),
      1000
    );
    return result;
  } catch (error) {
    console.error("Error in calculation:", error);
    return 0;
  }
}

// Vereinfachte Funktion für die Anzeige der benötigten Stunden
function getHoursNeededText(step, stepIndex) {
  try {
    const orbGains = getStepOrbGains(step);
    const orbReq = getStepOrbRequirement(step, stepIndex);
    
    if (typeof calculateMissingHours === 'function') {
      const currentHours = step.targetLevels['hoursInTR'] !== undefined ? 
                          step.targetLevels['hoursInTR'] : 
                          step.stats.hoursInTR || 0;
      
      const adjustedBaseStats = { ...step.stats, calculatedOrbGains: orbGains };
      
      const result = calculateMissingHours(
        currentHours,
        orbReq,
        adjustedBaseStats,
        { ...step.stats, ...step.targetLevels },
        allBoosts.filter(b => b.orbcalc),
        1000
      );
      
      if (result > 0) {
        return `+${result}h needed`;
      } 
    }
  } catch (e) {
    console.error("Error in getHoursNeededText:", e);
    return "Error calculating";
  }
}

// Neue State-Variablen für die Bearbeitung
const isEditingAllTimeOrbs = ref(false);
const allTimeOrbsRawInput = ref("");

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

function updateAllTimeOrbs(event) {
  allTimeOrbsRawInput.value = event.target.value.trim();
  isEditingAllTimeOrbs.value = true;
}

function finalizeAllTimeOrbsInput() {
  isEditingAllTimeOrbs.value = false;
  const input = allTimeOrbsRawInput.value.trim();
  const parsed = parseNumberWithSuffix(input);
  
  if (parsed !== null) {
    allTimeOrbs.value = parsed;
    const formattedValue = formatSuffixWithDecimals(parsed, 2);
    allTimeOrbsDisplay.value = formattedValue;
    updateAllStepsWithNewAllTimeOrbs(parsed);
  } else {
    allTimeOrbs.value = 0;
    allTimeOrbsDisplay.value = "0.00";
    updateAllStepsWithNewAllTimeOrbs(0);
  }
}

function updateAllStepsWithNewAllTimeOrbs(newAllTimeOrbsValue) {
  if (trSteps.length === 0) return;
  trSteps[0].stats.allTimeOrbs = newAllTimeOrbsValue;
  
  if (trSteps.length === 1) return;
  
  let accumulatedAllTimeOrbs = newAllTimeOrbsValue + getStepOrbGains(trSteps[0]);
  
  for (let i = 1; i < trSteps.length; i++) {
    trSteps[i].stats.allTimeOrbs = accumulatedAllTimeOrbs;
    const stepOrbGains = getStepOrbGains(trSteps[i]);
    accumulatedAllTimeOrbs += stepOrbGains;
  }
}

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

const currentVisibleStep = ref(0);

function handleScroll() {
  const modalContainer = document.querySelector('.max-h-\\[90vh\\]');
  if (!modalContainer) return;
  
  const modalScroll = modalContainer.scrollTop;
  const modalHeight = modalContainer.clientHeight;
  
  for (let i = 0; i < trSteps.length; i++) {
    const stepEl = document.getElementById(`tr-step-${i}`);
    const resultTable = document.getElementById(`tr-result-${i}`);
    
    if (!stepEl || !resultTable) continue;
    
    const stepRect = stepEl.getBoundingClientRect();
    const stepBottom = stepEl.offsetTop + stepEl.offsetHeight;
    
    const isVisible = stepRect.top < modalHeight && stepRect.bottom > 0;
    const isMainlyVisible = stepRect.top < modalHeight/2 && stepRect.bottom > modalHeight/2;
    
    if (isMainlyVisible) {
      currentVisibleStep.value = i;
    }
  }
}



onMounted(() => {
  if (props.isVisible) {
    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 300);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

watch(() => trSteps.length, () => {
  if (props.isVisible) {
    nextTick(() => {
      handleScroll();
    });
  }
});

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 300);
  } else {
    window.removeEventListener('scroll', handleScroll);
  }
});

// Im Setup-Code
onMounted(() => {
  // Wenn kopierte Plandaten vorhanden sind, diese laden
  if (trPlannerStore.copyPlanData) {
    // Hier die Logik zur Initialisierung mit den kopierten Daten
    initializeWithCopyData(trPlannerStore.copyPlanData);
    
    // Daten nach dem Laden zurücksetzen
    trPlannerStore.setCopyPlanData(null);
  }
});

// Funktion zum Initialisieren mit kopierten Daten
function initializeWithCopyData(copyData) {
  try {
    console.log("Initializing TRPlanModal with copyData:", copyData);

    // 1) Plan‑Metadaten setzen
    planName.value = copyData.name || `TR Plan ${new Date().toLocaleDateString()}`;
    trStartDate.value = copyData.trStartDate || new Date().toISOString().split('T')[0];
    trStartTime.value = copyData.trStartTime || new Date().toTimeString().slice(0,5);
    trCount.value = copyData.trCount || copyData.updatedStats?.trCount || 0;
    trCountDisplay.value = String(trCount.value);
    allTimeOrbs.value = copyData.allTimeOrbs || copyData.updatedStats?.allTimeOrbs || 0;
    allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);

    // 2) Bestehende Schritte löschen
    trSteps.length = 0;

    // 3) Basis‑Stats vom copyData übernehmen
    const baseStats = { ...props.currentStats, ...copyData, trCount: copyData.trCount || 0, allTimeOrbs: copyData.allTimeOrbs || 0 };

    // 4) Ersten Schritt anlegen
    const firstStep = {
      id: `step_copy_${Date.now()}`,
      stats: { ...baseStats },
      targetLevels: {},
      targetBools: {},
      selectedForNextTR: ['hoursInTR']
    };

    // 5) Wenn es ein Plan aus dem OrbCalculatorModal ist, hat er keine boosts-Eigenschaft
    if (!copyData.boosts) {
      console.log("Initializing from OrbCalculatorModal data");
      
      allBoosts.forEach(boost => {
        const key = boost.key;
        
        if (key === 'trCount' || key === 'allTimeOrbs' || key.startsWith('_')) {
          return;
        }
        
        if (copyData[key] !== undefined) {
          if (boost.type === 'boolean') {
            if (copyData[key] === true || copyData[key] === 1) {
              firstStep.targetBools[key] = true;
              firstStep.stats[key] = 1;
            }
          } else if (boost.type === 'number') {
            if (copyData[key] > 0) {
              firstStep.targetLevels[key] = copyData[key];
              firstStep.stats[key] = copyData[key];
            }
          }
        }
      });
      
      if (props.currentStats._orbCalcMaxedBoosts) {
        // Vollständig von currentStats übernehmen
        firstStep.stats._orbCalcMaxedBoosts = {};
        Object.keys(props.currentStats._orbCalcMaxedBoosts).forEach(key => {
          firstStep.stats._orbCalcMaxedBoosts[key] = true;
        });
      }
    } else {
      if (Array.isArray(copyData.selectedForNextTR)) {
        firstStep.selectedForNextTR = [...copyData.selectedForNextTR];
        if (!firstStep.selectedForNextTR.includes('hoursInTR')) {
          firstStep.selectedForNextTR.push('hoursInTR');
        }
      }

      copyData.boosts.forEach(b => {
        const def = allBoosts.find(x => x.key === b.key);
        if (!def) return;
        
        if (b.type === 'number') {
          firstStep.targetLevels[b.key] = b.targetLevel;
          firstStep.stats[b.key] = b.targetLevel;
        } else if (b.type === 'boolean') {
          const state = Boolean(b.targetState);
          firstStep.targetBools[b.key] = state;
          
          firstStep.stats[b.key] = def.permanent
            ? (state ? 1 : (firstStep.stats[b.key] || 0))
            : (state ? 1 : 0);
        }
      });
    }

    trSteps.push(firstStep);

    if (copyData.trChain && Array.isArray(copyData.trChain)) {
      copyData.trChain.forEach((chainStep, index) => {
        const step = createNewTRStep();
        
        if (chainStep.boosts && Array.isArray(chainStep.boosts)) {
          chainStep.boosts.forEach(b => {
            if (b.type === 'boolean') {
              step.targetBools[b.key] = b.targetState;
            } else if (b.type === 'number') {
              step.targetLevels[b.key] = b.targetLevel;
            }
          });
        }
        
        if (chainStep.selectedForNextTR && Array.isArray(chainStep.selectedForNextTR)) {
          step.selectedForNextTR = [...chainStep.selectedForNextTR];
          if (!step.selectedForNextTR.includes('hoursInTR')) {
            step.selectedForNextTR.push('hoursInTR');
          }
        }
        
        trSteps.push(step);
      });
    }

    nextTick(() => updateFollowingStepsStats(0));

    console.log("Copy data initialized successfully:", trSteps);
  }
  catch (error) {
    console.error('Error initializing copy data:', error);
    initData();
  }
}

// Funktion zum Öffnen des Update-Modals
function openTRUpdateModal() {
  const firstStep = trSteps[0];
  
  if (!firstStep) return;
  
  showTRUpdateModal.value = true;
}

// Funktion zum Schließen des Update-Modals
function closeTRUpdateModal() {
  showTRUpdateModal.value = false;
}

// Funktion zum Aktualisieren des TR-Plans nach Abschluss
function handleTRUpdate() {
  const firstStep = trSteps[0];
  const orbGains = getStepOrbGains(firstStep);
  
  const selectedBoosts = [...firstStep.selectedForNextTR];
  
  // ✅ KORREKTUR: Boolean-Zustände des ersten TRs für die Übertragung sammeln
  const completedBooleanStates = {};
  
  // Zuerst alle Boolean-Zustände aus den Stats übernehmen
  allBoosts
    .filter(b => b.type === 'boolean')
    .forEach(boost => {
      const key = boost.key;
      completedBooleanStates[key] = !!(firstStep.stats[key] || 0);
    });
  
  // Dann explizite targetBools überschreiben (haben Vorrang)
  Object.entries(firstStep.targetBools || {}).forEach(([key, value]) => {
    completedBooleanStates[key] = value;
  });
  
  console.log("🔄 Boolean states being transferred:", completedBooleanStates);
  
  // ✅ WICHTIG: TR Count und All-Time Orbs aktualisieren
  trCount.value += 1;
  trCountDisplay.value = trCount.value.toString();
  
  allTimeOrbs.value += orbGains;
  allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);
  
  // ✅ KORREKTUR: Stats für den neuen ersten TR mit Boolean-Zuständen aktualisieren
  const newFirstTRStats = {
    ...firstStep.stats,
    ...firstStep.targetLevels,  // Alle numerischen Zielwerte übernehmen
    trCount: trCount.value,     // ✅ WICHTIG: Aktualisierte Werte
    allTimeOrbs: allTimeOrbs.value
  };
  
  // ✅ Boolean-Zustände korrekt übertragen
  Object.entries(completedBooleanStates).forEach(([key, isActive]) => {
    newFirstTRStats[key] = isActive ? 1 : 0;
  });
  
  console.log("🔄 New first TR stats:", newFirstTRStats);
  
  // ✅ WICHTIG: Die globalen currentStats mit den Boolean-Zuständen aktualisieren
  // Das ist entscheidend für die Persistierung!
  const updatedCurrentStats = {
    ...props.currentStats,
    ...newFirstTRStats
  };
  
  // ✅ Props currentStats über emit aktualisieren (damit sie beim Speichern verfügbar sind)
  emit('updateCurrentStats', updatedCurrentStats);
  
  // Ersten TR entfernen
  trSteps.shift();
  
  // ✅ Stats aller verbleibenden TRs mit den aktualisierten Boolean-Zuständen aktualisieren
  for (let i = 0; i < trSteps.length; i++) {
    trSteps[i].stats.trCount = trCount.value + i;
    
    if (i === 0) {
      // Der neue erste TR bekommt die aktualisierten Stats
      Object.assign(trSteps[i].stats, newFirstTRStats);
      trSteps[i].stats.allTimeOrbs = allTimeOrbs.value;
      
      const uniqueSelectedBoosts = new Set([...trSteps[i].selectedForNextTR, ...selectedBoosts]);
      trSteps[i].selectedForNextTR = [...uniqueSelectedBoosts];
    } else {
      trSteps[i].stats.allTimeOrbs = trSteps[i-1].stats.allTimeOrbs + getStepOrbGains(trSteps[i-1]);
    }
  }
  
  // ✅ Alle nachfolgenden Stats neu berechnen
  if (trSteps.length > 0) {
    updateFollowingStepsStats(0);
  }
  
  closeTRUpdateModal();
}

/**
 * Berechnet die Kosten für die Differenz zwischen aktuellem und Ziel-Level
 * @param {Object} boost - Der Boost, für den die Kosten berechnet werden sollen
 * @param {Object} step - Der TR-Schritt mit den Stats und Zielwerten
 * @returns {string} - Die formatierten Kosten oder einen leeren String
 */
 function calculateUpgradeCost(boost, step) {
  const stepIndex = trSteps.findIndex(s => s.id === step.id);
  
  if (stepIndex === 0) return '';
  
  if (!boost || boost.type === 'boolean') return '';
  
  const boostKey = boost.key;
  
  const currentLevel = step.stats[boostKey] || 0;
  const targetLevel = step.targetLevels[boostKey] !== undefined ? 
                      step.targetLevels[boostKey] : 
                      currentLevel;
  
  if (targetLevel <= currentLevel) return '';

  // Spezialfall für Milestone #0
  if (boost.key === 'ms0') {
    return calculateM0CostRangeSafe(currentLevel, targetLevel);
  }
  
  // Spezialfall für Loop Mods
  if (boost.key === 'lmConsistency') {
    return calculateLoopModCostRangeSafe(LOOP_MODS.RULE_OF_CONSISTENCY, currentLevel, targetLevel);
  }
  
  let totalCost = 0;
  
  if (boost.category === 'relic') {
    const relicId = `r${boost.key.replace('r', '')}`;
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      totalCost += getRelicCost(relicId, level);
    }
    return formatRelicCost(totalCost);
  }
  
  else if (boost.category === 'inscryption') {
    const inscryptionId = `i${boost.key.replace('i', '')}`;
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      totalCost += getInscryptionCost(inscryptionId, level);
    }
    return formatInscryptionCost(totalCost);
  }
  
  else if (boost.category === 'gadget') {
    let gadgetType = boost.key;
    if (boost.key === 'oogadget') gadgetType = 'g4';
    if (boost.key === 'campfragdet') gadgetType = 'g14';
    
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      totalCost += getGadgetCost(gadgetType, level);
    }
    return formatGadgetCost(totalCost);
  }
  
  return '';
}

function showAlert(message, title = 'TR Planner', type = 'info') {
  alertMessage.value = message;
  alertTitle.value = title;
  alertType.value = type;
  showAlertDialog.value = true;
}

watch(trSteps, () => {
}, { deep: true });

const isUpdatingFollowingSteps = ref(false);

watch(
  () => trSteps.map(step => step.stats.allTimeOrbs),
  () => {
    if (!isUpdatingFollowingSteps.value) {
      isUpdatingFollowingSteps.value = true;
      nextTick(() => {
        updateFollowingStepsStats(0);
        setTimeout(() => {
          isUpdatingFollowingSteps.value = false;
        }, 0);
      });
    }
  },
  { deep: true }
);

// Neue State-Variable für die Create-Optionen
const showCreateOptions = ref(false);

// Toggle-Funktion für die Create-Optionen
function toggleCreateOptions() {
  showCreateOptions.value = !showCreateOptions.value;
}

// Reset-Funktion für das Formular
function resetForm() {
  initData();
  showCreateOptions.value = false;
}

function isBoostAvailable(boost, step) {
  // Wenn keine Anforderungen definiert sind, ist der Boost immer verfügbar
  if (!boost.minRequirement) return true;
  
  // Prüfen, ob der erforderliche Boost existiert und das Mindestlevel erreicht hat
  const requiredBoostKey = boost.minRequirement.boost;
  const requiredLevel = boost.minRequirement.level;
  
  // WICHTIG: Prüfen, ob der erforderliche Boost als maxed markiert ist
  const orbCalcMaxedBoosts = step.stats._orbCalcMaxedBoosts || {};
  
  // Wenn der erforderliche Boost als maxed markiert ist, behandeln wir ihn als verfügbar
  if (orbCalcMaxedBoosts[requiredBoostKey]) {
    return true;
  }
  
  // Wert aus den aktuellen Zielen oder geerbten Stats verwenden
  let currentLevel;
  
  // Prüfen, ob der Wert im targetLevels vorhanden ist
  if (step.targetLevels[requiredBoostKey] !== undefined) {
    currentLevel = step.targetLevels[requiredBoostKey];
  } else {
    // Ansonsten aus den Stats nehmen
    currentLevel = step.stats[requiredBoostKey] || 0;
  }
  
  return currentLevel >= requiredLevel;
}

function getBoostRequirementText(boost) {
  if (!boost.minRequirement) return '';
  
  // Boost-Objekt für den erforderlichen Boost finden
  const requiredBoost = allBoosts.find(b => b.key === boost.minRequirement.boost);
  if (!requiredBoost) return 'Unknown requirement';
  
  // Text für das Mindestlevel erstellen
  return `${requiredBoost.label} ${boost.minRequirement.level}`;
}

// Hilfsfunktionen für Tooltips
function hasTooltipContent(boost, step) {
  return (boost.tooltip && boost.tooltip !== '0') || 
         (boost.minRequirement && !isBoostAvailable(boost, step));
}

function getFullTooltipContent(boost, step) {
  let content = '';
  
  // Boost-Tooltip anzeigen, wenn vorhanden
  if (boost.tooltip && boost.tooltip !== '0') {
    content += boost.tooltip;
  }
  
  // Anforderungen hinzufügen, falls vorhanden und nicht erfüllt
  if (boost.minRequirement) {
    if (content) content += '<br><br>'; // Trennzeile, falls schon Text vorhanden
    content += `<span style="color: #EAB308;">⚠️ Requires ${getBoostRequirementText(boost)}</span>`;
  }
  
  return content;
}

function updateSelectedResearches(step, selectedResearches) {
  console.log("🔬 TRPlanModal: updateSelectedResearches called", {
    stepId: step.id,
    newSelectedResearches: selectedResearches,
    oldSelectedResearches: step.selectedResearches,
    stepObject: step
  });
  
  // ✅ Stelle sicher, dass die Property existiert
  if (!step.selectedResearches) {
    step.selectedResearches = [];
  }
  
  // ✅ Sichere Zuweisung mit Vue 3 Reactivity
  step.selectedResearches = [...selectedResearches];
  
  console.log("🔬 After assignment:", step.selectedResearches);
  
  // Trigger Neuberechnung
  const stepIndex = trSteps.findIndex(s => s.id === step.id);
  if (stepIndex !== -1) {
    nextTick(() => {
      updateFollowingStepsStats(stepIndex);
      checkForChanges();
    });
  }
}

// ✅ NEUE FUNKTION: Research Multiplier mit Changes
function getResearchMultiplierWithChanges(value, allValues, step) {
  // Prüfen ob Innovation Gem Level 2 ist
  const innovationGemLevel = allValues.innogem || 0;
  if (innovationGemLevel < 2) {
    return 1; // Kein Multiplikator wenn Innovation Gem unter Level 2
  }
  
  let overallMultiplier = 1;
  
  // ✅ WICHTIG: Verwende die spezifischen Level-Auswahlen aus dem Step
  const selectedResearches = step.selectedResearches || [];
  const selectedLevels = step.selectedLevels || {};
  
  console.log("🔬 Research Calculation with Level Details:", {
    researchPoints: value,
    selectedResearches,
    selectedLevels,
    innovationGem: innovationGemLevel
  });

  // Nur die manuell ausgewählten Researches berücksichtigen
  for (const researchId of selectedResearches) {
    if (researchData[researchId]) {
      let researchMultiplier = 1;
      const researchLevels = selectedLevels[researchId] || [];
      const allLevelsForResearch = researchData[researchId];
      
      // ✅ NUR die ausgewählten Level berücksichtigen (nicht alle verfügbaren)
      for (const levelIdx of researchLevels) {
        const levelData = allLevelsForResearch[levelIdx];
        
        if (levelData && value >= levelData.price) {
          // Level ist ausgewählt UND erschwinglich
          researchMultiplier *= levelData.multiplier;
          console.log(`Research ${researchId} Level ${levelIdx + 1}: ×${levelData.multiplier}`);
        }
      }
      
      console.log(`Research ${researchId} Total Multiplier: ×${researchMultiplier}`);
      
      // Multipliziere das Ergebnis der aktuellen Research mit dem Gesamtwert
      overallMultiplier *= researchMultiplier;
    }
  }

  console.log(`Total Research Multiplier: ×${overallMultiplier}`);
  return overallMultiplier;
}

watch(
  [
    () => planName.value,
    () => trCount.value,
    () => allTimeOrbs.value,
    () => trSteps,
    () => trStartDate.value,
    () => trStartTime.value
  ],
  () => {
    if (props.isVisible && originalState.value) {
      checkForChanges();
    }
  },
  { deep: true }
);

// Beim Öffnen oder nach dem Speichern zurücksetzen
watch(
  () => props.isVisible,
  (isVisible) => {
    if (isVisible) {
      hasUnsavedChanges.value = false;
    }
  }
);

defineExpose({
  trSteps,
  trCount,
  formatTREndDate,
  getStepOrbRequirement,
  getStepOrbGains, 
  getStepFragGains,
  getStepRequirementMet
});
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
</style>