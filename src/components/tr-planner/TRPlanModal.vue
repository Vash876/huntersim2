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
      
      <!-- Override Panels -->
      <div class="p-3 border-b border-gray-700 space-y-3">
        <!-- Gem Override Panel -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <label class="text-xs font-medium text-gray-300 mb-1">Gem Overrides</label>
            <p class="text-xs text-gray-400">
              Set custom gem levels for this plan
            </p>
          </div>
          <button 
            @click="openGemOverrideModal"
            class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-xs font-medium flex items-center gap-1.5"
          >
            <IconSettings size="14" />
            Configure Gems
          </button>
        </div>
        
        <!-- Maxed Boosts Override Panel -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <label class="text-xs font-medium text-gray-300 mb-1">Maxed Boosts Overrides</label>
            <p class="text-xs text-gray-400">
              Override which boosts are considered maxed
            </p>
          </div>
          <button 
            @click="openMaxedBoostsOverrideModal"
            class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-medium flex items-center gap-1.5"
          >
            <IconSettings size="14" />
            Configure Maxed Boosts
          </button>
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
                          v-if="hasTooltipContent(boost, step, getTargetLevel(step.id, boost.key))"
                          :content="getFullTooltipContent(boost, step, getTargetLevel(step.id, boost.key))"
                          placement="right"
                          class="ml-1 mt-0.5"
                        />
                      </div>
                      
                      <!-- Max Level Badge (wenn vorhanden) - oben rechts -->
                      <div class="flex-shrink-0 ml-2">
                        <span 
                          v-if="getBoostMaxValue(boost, mergedGemData) !== undefined"
                          class="text-[10px] px-1.5 py-0.5 rounded bg-gray-600/80 text-gray-300 font-medium inline-block"
                        >
                          Max: {{ getBoostMaxValue(boost, mergedGemData) }}
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
                          <TRValueControls
                            :value="getTargetLevel(step.id, boost.key)"
                            :minValue="stepIndex === 0 ? 0 : (boost.permanent ? getPreviousStepLevel(stepIndex, boost.key) : 0)"  
                            :maxValue="getBoostMaxValue(boost, mergedGemData) || 999999"
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
              <IconPlus size="14" v-if="!editPlanId && !importedPlanData && isPlanValid" />
              <IconEdit size="14" v-if="editPlanId && !importedPlanData && isPlanValid" />
              <IconPlus size="14" v-if="importedPlanData && isPlanValid" />
              {{ getButtonText() }}
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

  <GemOverrideModal
    :isVisible="showGemOverrideModal"
    :gemOverrides="localGemOverrides"
    @close="showGemOverrideModal = false"
    @update:gemOverrides="localGemOverrides = $event"
  />

  <MaxedBoostsOverrideModal
    :isVisible="showMaxedBoostsOverrideModal"
    :maxedBoostsOverrides="localMaxedBoostsOverrides"
    @close="showMaxedBoostsOverrideModal = false"
    @update:maxedBoostsOverrides="localMaxedBoostsOverrides = $event"
  />
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { allBoosts, boostsByCategory, getGemDataFromStore, getBoostMaxValue } from '@/constants/tr-planner';
import { getAllGemData } from '@/constants/tr-planner/gems.js';
import { getRelicCost, formatRelicCost } from '@/utils/relicCostUtils';
import { getInscryptionCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { calculateM0CostRangeSafe } from '@/utils/m0CostUtils';
import { getRuleOfConsistencyExponent } from '@/utils/loopModCostUtils';
import TRUpdateModal from './TRUpdateModal.vue';
import GemOverrideModal from './GemOverrideModal.vue';
import MaxedBoostsOverrideModal from './MaxedBoostsOverrideModal.vue';
import TRValueControls from '@/composables/TRValueControls.vue';
import AlertDialog from '@/components/common/AlertDialog.vue';
import { formatMultiplier, formatNumber, parseNumberWithSuffix, formatSuffixNotation } from '@/composables/format';
import { calculateOrbRequirement, calculateOrbGains, calculateCampaignFragGains, calculateMissingHours, calculateCupMultiplier } from '@/composables/calculations';
import {
  IconX, IconPlus, IconMinus, IconTrash, IconAlertCircle,
  IconCircleCheck, IconCircleX, IconEdit, IconCheck, IconSettings
} from '@tabler/icons-vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import { useTRPlannerStore } from '@/store/orbStore';

// ═══════════════════════════════════════════════════════════════
// PROPS & EMITS
// ═══════════════════════════════════════════════════════════════

const props = defineProps({
  isVisible: { type: Boolean, required: true },
  currentStats: { type: Object, default: () => ({}) },
  editPlanId: { type: String, default: null },
  importedPlanData: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save', 'openUpdate', 'openNewPlan']);

// ═══════════════════════════════════════════════════════════════
// STORE & STATE
// ═══════════════════════════════════════════════════════════════

const trPlannerStore = useTRPlannerStore();

const error = ref(null);
const planName = ref('Unnamed');
const searchQuery = ref('');
const hasUnsavedChanges = ref(false);
const pendingSavePlanId = ref(null);
const pendingSaveData = ref(null);

// Override Modal States
const showGemOverrideModal = ref(false);
const localGemOverrides = ref({});
const showMaxedBoostsOverrideModal = ref(false);
const localMaxedBoostsOverrides = ref({});

// Change tracking
const originalState = ref(null);

// Core planning state
const trCount = ref(props.currentStats?.trCount || 0);
const trCountDisplay = ref((props.currentStats?.trCount || 0).toString());
const allTimeOrbs = ref(props.currentStats?.allTimeOrbs || 0);
const allTimeOrbsDisplay = ref(formatSuffixNotation(props.currentStats?.allTimeOrbs || 0));
const trSteps = reactive([]);

// Sub-modal state
const showTRUpdateModal = ref(false);

// Date/Time
const trStartDate = ref(new Date().toISOString().split('T')[0]);
const trStartTime = ref(new Date().toTimeString().split(' ')[0].slice(0, 5));

// Alert dialog
const showAlertDialog = ref(false);
const alertMessage = ref('');
const alertTitle = ref('TR Planner');
const alertType = ref('info');

// All-Time Orbs edit mode
const isEditingAllTimeOrbs = ref(false);
const allTimeOrbsRawInput = ref('');

// Scroll tracking
const currentVisibleStep = ref(0);

// Guard für cascade updates
const isUpdatingFollowingSteps = ref(false);

// ═══════════════════════════════════════════════════════════════
// HELPER: Boost-Daten aus Array/Object-Format laden
// ═══════════════════════════════════════════════════════════════

/**
 * Lädt Boosts in einen TR-Step aus Array- oder Object-Format.
 * @param {Object} step - Der TR-Step mit targetLevels, targetBools, stats, selectedForNextTR
 * @param {Array|Object} boostsData - Boost-Daten im Array- oder Object-Format
 * @param {Object} options - { applyToStats, extractSelectedForNextTR }
 */
function applyBoostsFromData(step, boostsData, options = {}) {
  const { applyToStats = false, extractSelectedForNextTR = false } = options;

  if (Array.isArray(boostsData)) {
    boostsData.forEach(b => {
      const def = allBoosts.find(x => x.key === b.key);
      if (!def) return;

      if (b.type === 'number' || def.type === 'number') {
        step.targetLevels[b.key] = b.targetLevel;
        if (applyToStats) step.stats[b.key] = b.targetLevel;
      } else if (b.type === 'boolean' || def.type === 'boolean') {
        const state = Boolean(b.targetState);
        step.targetBools[b.key] = state;
        if (applyToStats) {
          step.stats[b.key] = state ? 1 : (def.permanent ? (step.stats[b.key] || 0) : 0);
        }
      }
    });
  } else if (boostsData && typeof boostsData === 'object') {
    Object.entries(boostsData).forEach(([key, boostData]) => {
      const def = allBoosts.find(x => x.key === key);
      if (!def) return;

      if (def.type === 'number') {
        step.targetLevels[key] = boostData.targetLevel;
        if (applyToStats) step.stats[key] = boostData.targetLevel;
      } else if (def.type === 'boolean') {
        const state = Boolean(boostData.targetState);
        step.targetBools[key] = state;
        if (applyToStats) {
          step.stats[key] = state ? 1 : (def.permanent ? (step.stats[key] || 0) : 0);
        }
      }

      if (extractSelectedForNextTR && boostData.selectedForNextTR && !step.selectedForNextTR.includes(key)) {
        step.selectedForNextTR.push(key);
      }
    });
  }
}

/**
 * Setzt Gem-Levels und Active Nodes in ein Stats-Objekt.
 */
function initGemNodesInStats(stats, gemData) {
  if (gemData.levels) {
    Object.entries(gemData.levels).forEach(([gemId, level]) => {
      stats[`${gemId}Level`] = level;
    });
  }

  // Erst alle möglichen Nodes auf 0 setzen
  const allGemDataList = getAllGemData ? getAllGemData() : [];
  allGemDataList.forEach(gem => {
    if (gem.nodes && Array.isArray(gem.nodes)) {
      gem.nodes.forEach((_, nodeIndex) => {
        stats[`${gem.id}Node${nodeIndex}`] = 0;
      });
    }
  });

  // Dann aktive Nodes auf 1 setzen
  if (gemData.activeNodes) {
    Object.entries(gemData.activeNodes).forEach(([gemId, nodeArray]) => {
      if (Array.isArray(nodeArray)) {
        nodeArray.forEach(nodeIndex => {
          stats[`${gemId}Node${nodeIndex}`] = 1;
        });
      }
    });
  }
}

/**
 * Prüft ob ein Boost in irgendeinem vorherigen TR für die Vererbung markiert wurde.
 */
function isBoostInherited(stepIndex, boostKey) {
  for (let i = 0; i < stepIndex; i++) {
    if (trSteps[i].selectedForNextTR?.includes(boostKey)) return true;
  }
  return false;
}

/**
 * Wendet maximierte Boosts (mit Overrides) auf planStats an.
 */
function applyMaxedBoostsToStats(planStats) {
  const maxedBoosts = getMaxedBoostsWithOverrides();
  Object.entries(maxedBoosts).forEach(([key, isMaxed]) => {
    if (isMaxed !== true) return;
    const boost = allBoosts.find(b => b.key === key);
    if (!boost) return;
    if (boost.type === 'boolean') {
      planStats[key] = 1;
    } else if (boost.type === 'number') {
      const maxValue = getBoostMaxValue(boost, mergedGemData.value);
      if (maxValue !== undefined) planStats[key] = maxValue;
    }
  });
}

/**
 * Reset-Logik für unmarkierte, nicht-permanente Boolean-Boosts in Chain-Steps.
 */
function resetUnselectedBooleans(step, acc) {
  allBoosts
    .filter(b => b.type === 'boolean' && !b.permanent)
    .forEach(b => {
      const key = b.key;
      const isMarked = step.selectedForNextTR.includes(key);
      const hasExplicitBool = Object.prototype.hasOwnProperty.call(step.targetBools, key);
      if (!isMarked && !hasExplicitBool) {
        step.stats[key] = acc[key] || 0;
      }
    });
}

/**
 * Erzeugt kombinierte Stats (step.stats + step.targetLevels) für Anzeige-Funktionen.
 */
function getCombinedStats(step) {
  const combined = { ...step.stats };
  Object.entries(step.targetLevels).forEach(([k, v]) => { combined[k] = v; });
  return combined;
}

// ═══════════════════════════════════════════════════════════════
// COMPUTED PROPERTIES
// ═══════════════════════════════════════════════════════════════

const modalTitle = computed(() => {
  if (props.importedPlanData) return 'Import TR Plan';
  return props.editPlanId ? 'Edit TR Plan' : 'Create New Plan';
});

const mergedGemData = computed(() => getGemDataWithOverrides());
const mergedMaxedBoosts = computed(() => getMaxedBoostsWithOverrides());

const canAddNextTR = computed(() => {
  if (trSteps.length === 0) return true;
  const lastStep = trSteps[trSteps.length - 1];
  return getStepRequirementMet(lastStep, trSteps.length - 1);
});

const isPlanValid = computed(() => {
  if (!planName?.value?.trim()) return false;
  if (!trSteps?.length) return false;
  return trSteps.some(step => {
    if (!step) return false;
    const hasNumeric = Object.keys(step.targetLevels || {}).length > 0;
    const hasBool = Object.values(step.targetBools || {}).some(v => v);
    return hasNumeric || hasBool;
  });
});

const formatTREndDate = computed(() => {
  try {
    let totalHours = 0;
    trSteps.forEach((step, index) => {
      const hoursInTR = step.targetLevels['hoursInTR'] ?? step.stats.hoursInTR ?? 0;
      let additionalHours = 0;
      try {
        const orbGains = getStepOrbGains(step);
        const orbReq = getStepOrbRequirement(step, index);
        if (orbGains < orbReq) {
          additionalHours = calculateMissingHours(
            hoursInTR, orbReq,
            { ...step.stats, calculatedOrbGains: orbGains },
            { ...step.stats, ...step.targetLevels },
            allBoosts.filter(b => b.orbcalc), 1000
          );
        }
      } catch { /* Fehler ignorieren */ }
      totalHours += hoursInTR + additionalHours;
    });

    const [year, month, day] = trStartDate.value.split('-').map(Number);
    const [hours, minutes] = trStartTime.value.split(':').map(Number);
    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + totalHours * 3600000);
    return endDate.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return 'Error calculating end date';
  }
});

const allTimeOrbsInput = computed({
  get: () => isEditingAllTimeOrbs.value ? allTimeOrbsRawInput.value : allTimeOrbsDisplay.value,
  set: (value) => {
    if (isEditingAllTimeOrbs.value) allTimeOrbsRawInput.value = value;
    else allTimeOrbsDisplay.value = value;
  }
});

const hasGemOverrides = computed(() =>
  localGemOverrides.value && Object.keys(localGemOverrides.value).length > 0
);

const gemOverrideCount = computed(() =>
  localGemOverrides.value ? Object.keys(localGemOverrides.value).length : 0
);

// ═══════════════════════════════════════════════════════════════
// GEM & MAXED BOOSTS OVERRIDE LOGIC
// ═══════════════════════════════════════════════════════════════

function getGemDataWithOverrides() {
  const globalGemData = getGemDataFromStore();

  if (props.importedPlanData?.importedGemContext) {
    if (typeof window !== 'undefined') {
      window.__PLAN_CONTEXT__ = { gemData: props.importedPlanData.importedGemContext };
    }
    return props.importedPlanData.importedGemContext;
  }

  if (!localGemOverrides.value || Object.keys(localGemOverrides.value).length === 0) {
    if (typeof window !== 'undefined') window.__PLAN_CONTEXT__ = null;
    return globalGemData;
  }

  const merged = {
    levels: { ...globalGemData.levels },
    activeNodes: { ...globalGemData.activeNodes }
  };

  Object.entries(localGemOverrides.value).forEach(([key, value]) => {
    if (key.endsWith('Level')) {
      merged.levels[key.replace('Level', '')] = value;
    } else if (key.includes('Node')) {
      const match = key.match(/^(.+)Node(\d+)$/);
      if (match) {
        const [, gemId, nodeStr] = match;
        const nodeIndex = parseInt(nodeStr, 10);
        if (!merged.activeNodes[gemId]) merged.activeNodes[gemId] = [];
        if (value === 1 || value === true) {
          if (!merged.activeNodes[gemId].includes(nodeIndex)) merged.activeNodes[gemId].push(nodeIndex);
        } else {
          const idx = merged.activeNodes[gemId].indexOf(nodeIndex);
          if (idx !== -1) merged.activeNodes[gemId].splice(idx, 1);
        }
      }
    }
  });

  if (typeof window !== 'undefined') window.__PLAN_CONTEXT__ = { gemData: merged };
  return merged;
}

function getMaxedBoostsWithOverrides() {
  let globalMaxedBoosts = {};
  try {
    const statsJSON = localStorage.getItem('trplanner_userstats');
    if (statsJSON) {
      globalMaxedBoosts = JSON.parse(statsJSON)._orbCalcMaxedBoosts || {};
    }
  } catch { /* Fehler ignorieren */ }

  if (!localMaxedBoostsOverrides.value || Object.keys(localMaxedBoostsOverrides.value).length === 0) {
    return globalMaxedBoosts;
  }

  const merged = { ...globalMaxedBoosts };
  Object.entries(localMaxedBoostsOverrides.value).forEach(([boostKey, isMaxed]) => {
    if (isMaxed === true) merged[boostKey] = true;
    else if (isMaxed === false) delete merged[boostKey];
  });

  if (typeof window !== 'undefined') {
    if (!window.__PLAN_CONTEXT__) window.__PLAN_CONTEXT__ = {};
    window.__PLAN_CONTEXT__.maxedBoosts = merged;
  }
  return merged;
}

// ═══════════════════════════════════════════════════════════════
// BOOST FILTERING & DISPLAY
// ═══════════════════════════════════════════════════════════════

function getFilteredBoostsByCategory(step) {
  try {
    const orbCalcMaxedBoosts = getMaxedBoostsWithOverrides();
    const gemData = mergedGemData.value;
    const stepIndex = trSteps.findIndex(s => s.id === step.id);
    const isFollowUpTR = stepIndex > 0;

    // Sammle ausgewählte Boosts von allen vorherigen TRs
    let selectedBoostsForTR = [];
    if (isFollowUpTR) {
      for (let i = 0; i < stepIndex; i++) {
        selectedBoostsForTR.push(...trSteps[i].selectedForNextTR);
      }
      selectedBoostsForTR = [...new Set(selectedBoostsForTR)];
      if (!selectedBoostsForTR.includes('hoursInTR')) selectedBoostsForTR.push('hoursInTR');
    }

    return boostsByCategory.reduce((acc, category) => {
      const filteredBoosts = category.boosts.filter(boost => {
        if (orbCalcMaxedBoosts[boost.key] && boost.key !== 'hoursInTR') return false;

        if (boost.unlock && boost.unlock_level) {
          if ((gemData.levels[boost.unlock] || 0) < boost.unlock_level) return false;
        }

        if (isFollowUpTR && !selectedBoostsForTR.includes(boost.key) && boost.key !== 'hoursInTR') return false;

        if (searchQuery.value.trim()) {
          const q = searchQuery.value.toLowerCase();
          if (!boost.label.toLowerCase().includes(q) && !boost.key.toLowerCase().includes(q)) return false;
        }

        return true;
      });

      if (filteredBoosts.length > 0) {
        acc.push({ ...category, boosts: filteredBoosts });
      }
      return acc;
    }, []);
  } catch {
    return boostsByCategory;
  }
}

// ═══════════════════════════════════════════════════════════════
// TARGET LEVEL & BOOLEAN MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function getTargetLevel(stepId, boostKey) {
  const stepIndex = trSteps.findIndex(s => s.id === stepId);
  if (stepIndex === -1) return 0;
  const step = trSteps[stepIndex];
  if (step.targetLevels[boostKey] === undefined) {
    step.targetLevels[boostKey] = step.stats[boostKey] || 0;
  }
  return step.targetLevels[boostKey];
}

function getTargetBool(stepId, boostKey) {
  const step = trSteps.find(s => s.id === stepId);
  if (!step) return false;
  if (Object.prototype.hasOwnProperty.call(step.targetBools, boostKey)) {
    return step.targetBools[boostKey];
  }
  return !!step.stats[boostKey];
}

function getPreviousStepLevel(currentStepIndex, boostKey) {
  if (currentStepIndex > 0 && currentStepIndex < trSteps.length) {
    const prevStep = trSteps[currentStepIndex - 1];
    return prevStep.targetLevels[boostKey] ?? prevStep.stats[boostKey] ?? 0;
  }
  return props.currentStats[boostKey] || 0;
}

function updateTargetLevel(stepId, boostKey, newValue) {
  const stepIndex = trSteps.findIndex(s => s.id === stepId);
  if (stepIndex === -1) return;

  const step = trSteps[stepIndex];
  const boost = allBoosts.find(b => b.key === boostKey);
  if (!boost) return;

  let minLevel = 0;
  if (boost.permanent && stepIndex > 0) {
    const prevStep = trSteps[stepIndex - 1];
    const prevLevel = prevStep.targetLevels[boostKey] ?? prevStep.stats[boostKey] ?? 0;
    minLevel = Math.max(minLevel, prevLevel);
  }

  let validValue = Math.max(Math.floor(newValue), minLevel);
  const maxValue = getBoostMaxValue(boost, mergedGemData.value);
  if (maxValue !== undefined) validValue = Math.min(validValue, maxValue);

  step.targetLevels[boostKey] = validValue;

  // Für Boon-Level-Änderungen den gesamten targetLevels-Eintrag neu setzen (Reaktivität)
  if (boostKey === 'boonELevel' || boostKey === 'boonHLevel') {
    step.targetLevels = { ...step.targetLevels };
  }

  updateFollowingStepsStats(stepIndex);
}

function toggleBooleanTarget(stepId, boostKey) {
  const stepIndex = trSteps.findIndex(s => s.id === stepId);
  if (stepIndex === -1) return;

  const step = trSteps[stepIndex];
  const boost = allBoosts.find(b => b.key === boostKey);
  if (!boost) return;

  const inheritedVal = !!step.stats[boostKey];
  const currentVal = getTargetBool(stepId, boostKey);
  const newVal = !currentVal;

  // Verhindern, dass permanente aktivierte Boosts deaktiviert werden
  if (boost.permanent && !newVal && stepIndex > 0) {
    for (let i = 0; i < stepIndex; i++) {
      const prevStep = trSteps[i];
      const wasActive = prevStep.targetBools[boostKey] === true ||
        (prevStep.stats[boostKey] && !Object.prototype.hasOwnProperty.call(prevStep.targetBools, boostKey));
      if (wasActive) return;
    }
  }

  // Expliziten Eintrag setzen / entfernen
  if (newVal === inheritedVal) delete step.targetBools[boostKey];
  else step.targetBools[boostKey] = newVal;

  // Stats aktualisieren
  if (!boost.permanent) {
    step.stats[boostKey] = newVal ? 1 : 0;
  } else if (newVal) {
    // Permanente Boosts in allen Folge-TRs aktivieren
    for (let i = stepIndex + 1; i < trSteps.length; i++) {
      trSteps[i].targetBools[boostKey] = true;
      trSteps[i].stats[boostKey] = 1;
    }
  }

  updateFollowingStepsStats(stepIndex);
}

function isPermanentAndActivatedBefore(stepId, boostKey) {
  const stepIndex = trSteps.findIndex(s => s.id === stepId);
  if (stepIndex <= 0) return false;
  const boost = allBoosts.find(b => b.key === boostKey);
  if (!boost?.permanent) return false;
  for (let i = 0; i < stepIndex; i++) {
    const prevStep = trSteps[i];
    if (prevStep.targetBools[boostKey] === true ||
        (prevStep.stats[boostKey] && !Object.prototype.hasOwnProperty.call(prevStep.targetBools, boostKey))) {
      return true;
    }
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════
// CASCADE UPDATE LOGIC
// ═══════════════════════════════════════════════════════════════

function isPermanentBoost(key) {
  const found = allBoosts.find(b => b.key === key);
  return found?.permanent;
}

function updateFollowingStepsStats(modifiedStepIndex) {
  if (modifiedStepIndex >= trSteps.length - 1) return;

  // Referenz auf die Defaults des Haupt-TR
  const mainBoolDefaults = {};
  allBoosts
    .filter(b => b.type === 'boolean' && !b.permanent)
    .forEach(b => { mainBoolDefaults[b.key] = !!trSteps[0].stats[b.key]; });

  // accumulatedStats des modifizierten Steps bilden
  let accumulatedStats = {
    ...trSteps[modifiedStepIndex].stats,
    ...trSteps[modifiedStepIndex].targetLevels
  };
  Object.entries(trSteps[modifiedStepIndex].targetBools).forEach(([k, on]) => {
    accumulatedStats[k] = on ? 1 : 0;
  });

  // Permanente Boolean-Boosts aus früheren TRs sammeln
  const activatedPermanentBoosts = {};
  for (let i = 0; i <= modifiedStepIndex; i++) {
    allBoosts
      .filter(b => b.type === 'boolean' && b.permanent)
      .forEach(b => {
        const key = b.key;
        const step = trSteps[i];
        const isActive = step.targetBools[key] === true ||
          (step.stats[key] && !Object.prototype.hasOwnProperty.call(step.targetBools, key));
        if (isActive) activatedPermanentBoosts[key] = true;
      });
  }

  // Alle Folge-TRs aktualisieren
  for (let i = modifiedStepIndex + 1; i < trSteps.length; i++) {
    const step = trSteps[i];
    const prevStep = trSteps[i - 1];
    const prevGains = getStepOrbGains(prevStep);

    // Basiswerte übernehmen
    const oldFlags = step.stats._orbCalcMaxedBoosts || {};
    step.stats = { ...step.stats, ...accumulatedStats };
    if (Object.keys(oldFlags).length) step.stats._orbCalcMaxedBoosts = oldFlags;

    step.stats.trCount = trCount.value + i;
    step.stats.allTimeOrbs = prevStep.stats.allTimeOrbs + prevGains;

    // Permanente Level nicht unterschreiten
    Object.keys(step.targetLevels).forEach(k => {
      if (isPermanentBoost(k) && step.targetLevels[k] < step.stats[k]) {
        step.targetLevels[k] = step.stats[k];
      }
    });

    // Permanente Boolean-Boosts aus früheren TRs übernehmen
    Object.keys(activatedPermanentBoosts).forEach(key => {
      step.targetBools[key] = true;
      step.stats[key] = 1;
    });

    // Boolean-Status bestimmen
    allBoosts
      .filter(b => b.type === 'boolean' && !b.permanent)
      .forEach(b => {
        const key = b.key;
        const hasTarget = Object.prototype.hasOwnProperty.call(step.targetBools, key);
        const isSelected = step.selectedForNextTR.includes(key);

        if (hasTarget) {
          step.stats[key] = step.targetBools[key] ? 1 : 0;
        } else if (!isSelected) {
          // Prüfe ob Boost in vorherigem TR aktiv war
          let wasActive = false;
          for (let j = 0; j < i; j++) {
            const prev = trSteps[j];
            if (prev.targetBools[key] === true ||
                (prev.stats[key] && !Object.prototype.hasOwnProperty.call(prev.targetBools, key))) {
              wasActive = true;
              break;
            }
          }
          step.stats[key] = wasActive ? 1 : (mainBoolDefaults[key] ? 1 : 0);
        }
      });

    // accumulatedStats für nächste Runde
    accumulatedStats = { ...step.stats, ...step.targetLevels };
    Object.entries(step.targetBools).forEach(([k, on]) => {
      accumulatedStats[k] = on ? 1 : 0;
    });
  }

  /* Reactivity kick */
  nextTick(() => { trSteps.length = trSteps.length; });
}

// ═══════════════════════════════════════════════════════════════
// ORB / FRAG / REQUIREMENT CALCULATION
// ═══════════════════════════════════════════════════════════════

function getStepOrbRequirement(step, stepIndex) {
  if (stepIndex === 0) {
    return calculateOrbRequirement(trCount.value, allTimeOrbs.value);
  }
  let calculatedAllTimeOrbs = allTimeOrbs.value;
  for (let i = 0; i < stepIndex; i++) {
    calculatedAllTimeOrbs += getStepOrbGains(trSteps[i]);
  }
  return calculateOrbRequirement(trCount.value + stepIndex, calculatedAllTimeOrbs);
}

function getStepOrbGains(step) {
  const stepIndex = trSteps.findIndex(s => s.id === step.id);
  const isFollowUpTR = stepIndex > 0;
  const baseStats = { ...step.stats };
  const planStats = { ...step.stats };

  // Numerische Ziele einblenden - mit Inheritance-Prüfung
  Object.entries(step.targetLevels).forEach(([k, v]) => {
    if (isFollowUpTR && !isBoostInherited(stepIndex, k)) {
      const first = trSteps[0];
      planStats[k] = first.targetLevels?.[k] ?? first.stats?.[k] ?? 0;
    } else {
      planStats[k] = v;
    }
  });

  // Boolean-Ziele verarbeiten
  Object.entries(step.targetBools).forEach(([k, active]) => {
    const def = allBoosts.find(b => b.key === k);
    if (def && !def.permanent) {
      baseStats[k] = planStats[k] = active ? 1 : 0;
    } else if (active) {
      planStats[k] = 1;
    }
  });

  // Maximierte Boosts anwenden
  applyMaxedBoostsToStats(planStats);

  // Gem-Daten in Stats einbauen
  const gemData = mergedGemData.value;
  initGemNodesInStats(baseStats, gemData);
  initGemNodesInStats(planStats, gemData);
  planStats.gemData = gemData;

  try {
    return calculateOrbGains(baseStats, planStats, allBoosts.filter(b => b.orbcalc));
  } catch {
    return 0;
  }
}

function getStepFragGains(step) {
  const stepIndex = trSteps.findIndex(s => s.id === step.id);
  const isFollowUpTR = stepIndex > 0;
  const planStats = { ...step.stats };

  // Numerische Ziele - mit Inheritance-Prüfung
  Object.entries(step.targetLevels).forEach(([k, v]) => {
    if (isFollowUpTR && !isBoostInherited(stepIndex, k)) {
      const first = trSteps[0];
      planStats[k] = first.targetLevels?.[k] ?? first.stats?.[k] ?? 0;
    } else {
      planStats[k] = v;
    }
  });

  // Boolean-Ziele (nur aktivieren, baseStats nicht anpassen)
  Object.entries(step.targetBools).forEach(([k, isActive]) => {
    if (isActive) planStats[k] = 1;
  });

  // Maximierte Boosts anwenden
  applyMaxedBoostsToStats(planStats);

  // Gem-Daten
  const gemData = mergedGemData.value;
  const baseStatsWithGems = { ...step.stats };
  initGemNodesInStats(baseStatsWithGems, gemData);
  initGemNodesInStats(planStats, gemData);
  planStats.gemData = gemData;

  try {
    return calculateCampaignFragGains(baseStatsWithGems, planStats, allBoosts.filter(b => b.fragmulti !== undefined));
  } catch {
    return 0;
  }
}

function getStepRequirementMet(step, stepIndex) {
  return getStepOrbGains(step) >= getStepOrbRequirement(step, stepIndex);
}

// ═══════════════════════════════════════════════════════════════
// MULTIPLIER & DISPLAY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function getMultiplierText(boost, step) {
  if (!boost || boost.multiplier === undefined) return null;

  const boostKey = boost.key;
  const targetLevel = step.targetLevels[boostKey] ?? step.stats[boostKey] ?? 0;
  const combinedStats = getCombinedStats(step);

  if (boost.type === 'boolean') {
    const isActive = step.targetBools[boostKey] ?? !!(step.stats[boostKey] || 0);
    if (typeof boost.multiplier === 'number') return isActive ? formatMultiplier(boost.multiplier) : '×1.00';
    return isActive ? formatMultiplier(boost.multiplier(1, combinedStats)) : '×1.00';
  }

  if (boostKey === 'hoursInTR' || boostKey === 'loopMods') {
    try {
      if (typeof boost.multiplier === 'function') return formatMultiplier(boost.multiplier(targetLevel, combinedStats));
      if (boostKey === 'loopMods') {
        const hoursBoost = allBoosts.find(b => b.key === 'hoursInTR');
        if (hoursBoost?.multiplier && typeof hoursBoost.multiplier === 'function') {
          return formatMultiplier(hoursBoost.multiplier(combinedStats.hoursInTR, combinedStats));
        }
      }
      return formatMultiplier(boost.multiplier);
    } catch { return '×1.00'; }
  }

  if (typeof boost.multiplier === 'number') return formatMultiplier(boost.multiplier);
  if (typeof boost.multiplier === 'function') {
    try { return formatMultiplier(boost.multiplier(targetLevel, combinedStats)); }
    catch { return '×1.00'; }
  }
  return null;
}

function getFragMultiplierText(boost, step) {
  if (!boost || boost.fragmulti === undefined) return null;

  const boostKey = boost.key;
  const targetLevel = step.targetLevels[boostKey] ?? step.stats[boostKey] ?? 0;
  const combinedStats = getCombinedStats(step);

  if (boost.type === 'boolean') {
    const isActive = step.targetBools[boostKey] ?? !!(step.stats[boostKey] || 0);
    if (typeof boost.fragmulti === 'number') return isActive ? formatMultiplier(boost.fragmulti) : '×1.00';
    return isActive ? formatMultiplier(boost.fragmulti(1, combinedStats)) : '×1.00';
  }

  // Spezialfall R6
  if (boostKey === 'r6') {
    try {
      return {
        part1: `+${(2.75 * targetLevel).toFixed(2)}`,
        part2: formatMultiplier(Math.pow(1.05, targetLevel))
      };
    } catch { return { part1: '+0.00', part2: '×1.00' }; }
  }

  if (typeof boost.fragmulti === 'number') return formatMultiplier(boost.fragmulti);
  if (typeof boost.fragmulti === 'function') {
    try { return formatMultiplier(boost.fragmulti(targetLevel, combinedStats)); }
    catch { return '×1.00'; }
  }
  return null;
}

function getCupMultiplierText(step) {
  const hoursInTR = step.targetLevels['hoursInTR'] ?? step.stats.hoursInTR ?? 0;
  const enhanced = { ...step.stats, ...step.targetLevels };
  return formatMultiplier(calculateCupMultiplier(hoursInTR, enhanced));
}

function getHoursNeededText(step, stepIndex) {
  try {
    const orbReq = getStepOrbRequirement(step, stepIndex);
    const currentHours = step.targetLevels['hoursInTR'] ?? step.stats.hoursInTR ?? 0;
    const result = calculateMissingHours(
      currentHours, orbReq,
      { ...step.stats, calculatedOrbGains: getStepOrbGains(step) },
      { ...step.stats, ...step.targetLevels },
      allBoosts.filter(b => b.orbcalc), 1000
    );
    if (result > 0) return `+${result}h needed`;
  } catch { /* Fehler ignorieren */ }
}

function calculateUpgradeCost(boost, step) {
  const stepIndex = trSteps.findIndex(s => s.id === step.id);
  if (stepIndex === 0 || !boost || boost.type === 'boolean') return '';

  const currentLevel = step.stats[boost.key] || 0;
  const targetLevel = step.targetLevels[boost.key] ?? currentLevel;
  if (targetLevel <= currentLevel) return '';

  let totalCost = 0;

  if (boost.category === 'relic') {
    for (let level = currentLevel + 1; level <= targetLevel; level++) totalCost += getRelicCost(boost.key, level);
    return formatRelicCost(totalCost);
  }

  if (boost.category === 'inscryption') {
    const inscryptionId = `i${boost.key.replace('i', '')}`;
    for (let level = currentLevel + 1; level <= targetLevel; level++) totalCost += getInscryptionCost(inscryptionId, level);
    return formatInscryptionCost(totalCost);
  }

  if (boost.category === 'gadget') {
    let gadgetType = boost.key;
    if (boost.key === 'oogadget') gadgetType = 'g4';
    if (boost.key === 'campfragdet') gadgetType = 'g14';
    for (let level = currentLevel + 1; level <= targetLevel; level++) totalCost += getGadgetCost(gadgetType, level);
    return formatGadgetCost(totalCost);
  }

  if (boost.key === 'ms0') return calculateM0CostRangeSafe(currentLevel, targetLevel);
  if (boost.key === 'lmConsistency') return getRuleOfConsistencyExponent(targetLevel).toString();

  return '';
}

// ═══════════════════════════════════════════════════════════════
// BOOST SELECTION & NEXT-TR MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function toggleBoostForNextTR(stepId, boostKey) {
  if (boostKey === 'hoursInTR') return;

  const stepIndex = trSteps.findIndex(s => s.id === stepId);
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
      if (!next.selectedForNextTR.includes(boostKey)) next.selectedForNextTR.push(boostKey);
      if (boost.type === 'boolean') {
        if (next.targetBools[boostKey] === undefined) next.targetBools[boostKey] = currentBool;
      } else {
        next.targetLevels[boostKey] = next.stats[boostKey] || 0;
      }
    }
  } else {
    // Entferne den Boost aus allen zukünftigen Schritten
    step.selectedForNextTR.splice(selectedIndex, 1);

    for (let i = stepIndex + 1; i < trSteps.length; i++) {
      const next = trSteps[i];
      const idx = next.selectedForNextTR.indexOf(boostKey);
      if (idx !== -1) next.selectedForNextTR.splice(idx, 1);
      if (boost.type === 'boolean') delete next.targetBools[boostKey];
      else delete next.targetLevels[boostKey];
    }
  }
}

function isBoostSelectedForNextTR(stepId, boostKey) {
  if (boostKey === 'hoursInTR') return true;
  const stepIndex = trSteps.findIndex(s => s.id === stepId);
  return stepIndex !== -1 && trSteps[stepIndex].selectedForNextTR.includes(boostKey);
}

function isBoostAvailable(boost, step) {
  if (boost.minRequirement) {
    const { boost: requiredKey, level: requiredLevel } = boost.minRequirement;
    const orbCalcMaxedBoosts = step.stats._orbCalcMaxedBoosts || {};
    if (!orbCalcMaxedBoosts[requiredKey]) {
      const currentLevel = step.targetLevels[requiredKey] ?? step.stats[requiredKey] ?? 0;
      if (currentLevel < requiredLevel) return false;
    }
  }

  if (boost.unlock) {
    try {
      const gemLevel = mergedGemData.value.levels[boost.unlock] || 0;
      if (gemLevel < (boost.unlock_level || 1)) return false;
      if (boost.unlock_node && mergedGemData.value.activeNodes) {
        const nodeKey = `${boost.unlock}_${boost.unlock_node}`;
        if (!mergedGemData.value.activeNodes[nodeKey]) return false;
      }
    } catch { return true; }
  }

  return true;
}

function getBoostRequirementText(boost) {
  if (!boost.minRequirement) return '';
  const requiredBoost = allBoosts.find(b => b.key === boost.minRequirement.boost);
  return requiredBoost ? `${requiredBoost.label} ${boost.minRequirement.level}` : 'Unknown requirement';
}

// ═══════════════════════════════════════════════════════════════
// TOOLTIP FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function hasTooltipContent(boost, step, value) {
  const combinedStats = getCombinedStats(step);
  const tooltipValue = typeof boost.tooltip === 'function' ? boost.tooltip(value, combinedStats) : boost.tooltip;
  return (tooltipValue && tooltipValue !== '0') || (boost.minRequirement && !isBoostAvailable(boost, step));
}

function getFullTooltipContent(boost, step, value) {
  let content = '';
  const combinedStats = getCombinedStats(step);
  const tooltipValue = typeof boost.tooltip === 'function' ? boost.tooltip(value, combinedStats) : boost.tooltip;
  if (tooltipValue && tooltipValue !== '0') content += tooltipValue;
  if (boost.minRequirement) {
    if (content) content += '<br><br>';
    content += `<span style="color: #EAB308;">⚠️ Requires ${getBoostRequirementText(boost)}</span>`;
  }
  return content;
}

// ═══════════════════════════════════════════════════════════════
// TR STEP MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function createNewTRStep() {
  return {
    id: `step_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    targetLevels: {},
    targetBools: {},
    selectedForNextTR: ['hoursInTR'],
    stats: { ...getLastStepResults() }
  };
}

function getLastStepResults() {
  if (trSteps.length === 0) {
    return { ...props.currentStats, trCount: trCount.value, allTimeOrbs: allTimeOrbs.value };
  }
  const lastStep = trSteps[trSteps.length - 1];
  const stats = { ...lastStep.stats };
  stats.trCount = (stats.trCount || trCount.value) + 1;
  stats.allTimeOrbs = (stats.allTimeOrbs || allTimeOrbs.value) + getStepOrbGains(lastStep);
  Object.entries(lastStep.targetLevels || {}).forEach(([k, v]) => { stats[k] = v; });
  Object.entries(lastStep.targetBools || {}).forEach(([k, v]) => { if (v) stats[k] = 1; });
  return stats;
}

function addTRStep() {
  if (!canAddNextTR.value) return;

  // Sammle ausgewählte Boosts von ALLEN vorherigen TRs
  const selectedBoosts = new Set(['hoursInTR']);
  for (const step of trSteps) step.selectedForNextTR.forEach(k => selectedBoosts.add(k));

  const newStep = createNewTRStep();
  const lastStep = trSteps[trSteps.length - 1];

  // Für jeden vorgemerkten Boost das aktuelle Level als Ziel setzen
  selectedBoosts.forEach(boostKey => {
    const boost = allBoosts.find(b => b.key === boostKey);
    if (!boost) return;
    if (boost.type === 'boolean') {
      newStep.targetBools[boostKey] = lastStep.targetBools[boostKey] || false;
    } else {
      newStep.targetLevels[boostKey] = newStep.stats[boostKey] || 0;
    }
  });

  // Alle aktuell aktiven Boolean-Boosts übernehmen
  allBoosts.forEach(boost => {
    if (boost.type === 'boolean' && (lastStep.targetBools[boost.key] || false) && !selectedBoosts.has(boost.key)) {
      newStep.targetBools[boost.key] = true;
    }
  });

  trSteps.push(newStep);
  updateFollowingStepsStats(trSteps.length - 2);
}

function removeLastTRStep() {
  if (trSteps.length > 1) trSteps.pop();
}

function removeStep(index) {
  if (index > 0 && index < trSteps.length) trSteps.splice(index, 1);
}

// ═══════════════════════════════════════════════════════════════
// ALL-TIME ORBS INPUT
// ═══════════════════════════════════════════════════════════════

function updateAllTimeOrbs(event) {
  allTimeOrbsRawInput.value = event.target.value.trim();
  isEditingAllTimeOrbs.value = true;
}

function finalizeAllTimeOrbsInput() {
  isEditingAllTimeOrbs.value = false;
  const parsed = parseNumberWithSuffix(allTimeOrbsRawInput.value.trim());

  if (parsed !== null) {
    allTimeOrbs.value = parsed;
    allTimeOrbsDisplay.value = formatSuffixWithDecimals(parsed, 2);
    updateAllStepsWithNewAllTimeOrbs(parsed);
  } else {
    allTimeOrbs.value = 0;
    allTimeOrbsDisplay.value = '0.00';
    updateAllStepsWithNewAllTimeOrbs(0);
  }
}

function updateAllStepsWithNewAllTimeOrbs(newVal) {
  if (trSteps.length === 0) return;
  trSteps[0].stats.allTimeOrbs = newVal;
  if (trSteps.length === 1) return;

  let acc = newVal + getStepOrbGains(trSteps[0]);
  for (let i = 1; i < trSteps.length; i++) {
    trSteps[i].stats.allTimeOrbs = acc;
    acc += getStepOrbGains(trSteps[i]);
  }
}

function formatSuffixWithDecimals(value, decimals = 2) {
  if (typeof value !== 'number' || isNaN(value) || value === 0) return '0.' + '0'.repeat(decimals);
  const suffixes = ['', 'k', 'm', 'b', 't', 'qa', 'qu', 'sx', 'sp', 'o', 'n', 'd'];
  const tier = Math.max(0, Math.min(Math.floor(Math.log10(Math.abs(value)) / 3), suffixes.length - 1));
  return `${(value / Math.pow(10, tier * 3)).toFixed(decimals)}${suffixes[tier]}`;
}

// ═══════════════════════════════════════════════════════════════
// DATE/TIME
// ═══════════════════════════════════════════════════════════════

function initDateTimePicker() {
  const now = new Date();
  trStartDate.value = now.toISOString().split('T')[0];
  trStartTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════
// CHANGE TRACKING
// ═══════════════════════════════════════════════════════════════

function captureOriginalState() {
  originalState.value = {
    planName: planName.value,
    trCount: trCount.value,
    allTimeOrbs: allTimeOrbs.value,
    trStartDate: trStartDate.value,
    trStartTime: trStartTime.value,
    trSteps: trSteps.map(step => ({
      targetLevels: { ...step.targetLevels },
      targetBools: { ...step.targetBools },
      selectedForNextTR: [...step.selectedForNextTR]
    }))
  };
  hasUnsavedChanges.value = false;
}

function checkForChanges() {
  if (!originalState.value || !props.isVisible) return;

  const orig = originalState.value;
  if (planName.value !== orig.planName || trCount.value !== orig.trCount ||
      allTimeOrbs.value !== orig.allTimeOrbs || trStartDate.value !== orig.trStartDate ||
      trStartTime.value !== orig.trStartTime || trSteps.length !== orig.trSteps.length) {
    hasUnsavedChanges.value = true;
    return;
  }

  for (let i = 0; i < trSteps.length; i++) {
    const cur = trSteps[i];
    const o = orig.trSteps[i];

    const curLevelKeys = Object.keys(cur.targetLevels);
    const origLevelKeys = Object.keys(o.targetLevels);
    if (curLevelKeys.length !== origLevelKeys.length ||
        curLevelKeys.some(k => cur.targetLevels[k] !== o.targetLevels[k])) {
      hasUnsavedChanges.value = true;
      return;
    }

    const curBoolKeys = Object.keys(cur.targetBools);
    const origBoolKeys = Object.keys(o.targetBools);
    if (curBoolKeys.length !== origBoolKeys.length ||
        curBoolKeys.some(k => cur.targetBools[k] !== o.targetBools[k])) {
      hasUnsavedChanges.value = true;
      return;
    }

    if (cur.selectedForNextTR.length !== o.selectedForNextTR.length ||
        cur.selectedForNextTR.some((v, j) => v !== o.selectedForNextTR[j])) {
      hasUnsavedChanges.value = true;
      return;
    }
  }
  hasUnsavedChanges.value = false;
}

// ═══════════════════════════════════════════════════════════════
// INIT DATA (Import / Edit / New)
// ═══════════════════════════════════════════════════════════════

function initData() {
  try {
    error.value = null;
    trSteps.length = 0;
    initDateTimePicker();

    const baseStats = {
      ...props.currentStats,
      trCount: props.currentStats.trCount || 0,
      allTimeOrbs: props.currentStats.allTimeOrbs || 0
    };

    const plan = props.importedPlanData ||
      (props.editPlanId ? trPlannerStore.getTRPlanById(props.editPlanId) : null);

    if (plan) {
      // ─── Import oder Edit Modus ───
      if (props.editPlanId && !props.importedPlanData && !plan) throw new Error('Plan nicht gefunden');

      planName.value = plan.name || (props.importedPlanData ? 'Imported Plan' : 'Unnamed');
      trStartDate.value = plan.trStartDate || trStartDate.value;
      trStartTime.value = plan.trStartTime || trStartTime.value;

      // Gem Overrides laden
      if (props.importedPlanData?.importedGemContext) {
        const gemOverrides = {};
        const ctx = plan.importedGemContext;
        if (ctx.levels) {
          Object.entries(ctx.levels).forEach(([gemId, level]) => { gemOverrides[`${gemId}Level`] = level; });
        }
        if (ctx.activeNodes) {
          Object.entries(ctx.activeNodes).forEach(([gemId, nodeArray]) => {
            if (Array.isArray(nodeArray)) {
              for (let i = 0; i < 3; i++) gemOverrides[`${gemId}Node${i}`] = nodeArray.includes(i);
            }
          });
        }
        localGemOverrides.value = gemOverrides;
      } else {
        localGemOverrides.value = plan.gemOverrides ? { ...plan.gemOverrides } : {};
      }
      localMaxedBoostsOverrides.value = plan.maxedBoostsOverrides ? { ...plan.maxedBoostsOverrides } : {};

      trCount.value = plan.updatedStats?.trCount ?? baseStats.trCount;
      trCountDisplay.value = String(trCount.value);
      allTimeOrbs.value = plan.updatedStats?.allTimeOrbs ?? baseStats.allTimeOrbs;
      allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);

      const statsWithFlags = { ...baseStats, trCount: trCount.value, allTimeOrbs: allTimeOrbs.value };
      if (plan.updatedStats?._orbCalcMaxedBoosts) {
        statsWithFlags._orbCalcMaxedBoosts = { ...plan.updatedStats._orbCalcMaxedBoosts };
      }

      // Ersten Step erstellen
      const firstStep = {
        id: `step_${Date.now()}`,
        stats: statsWithFlags,
        targetLevels: {},
        targetBools: {},
        selectedForNextTR: Array.isArray(plan.selectedForNextTR)
          ? [...plan.selectedForNextTR]
          : ['hoursInTR']
      };
      if (!firstStep.selectedForNextTR.includes('hoursInTR')) firstStep.selectedForNextTR.push('hoursInTR');

      // Boosts laden
      applyBoostsFromData(firstStep, plan.boosts, { applyToStats: true, extractSelectedForNextTR: true });

      // Zusätzlich globales selectedForNextTR Array berücksichtigen (bei Object-Format)
      if (plan.boosts && !Array.isArray(plan.boosts) && Array.isArray(plan.selectedForNextTR)) {
        plan.selectedForNextTR.forEach(key => {
          if (!firstStep.selectedForNextTR.includes(key)) firstStep.selectedForNextTR.push(key);
        });
      }

      trSteps.push(firstStep);

      // Chain-Schritte laden
      if (Array.isArray(plan.trChain) && plan.trChain.length) {
        let acc = { ...firstStep.stats };
        acc.trCount++;
        acc.allTimeOrbs += getStepOrbGains(firstStep);

        plan.trChain.forEach((chain, idx) => {
          const step = {
            id: `chain_${Date.now()}_${idx}`,
            stats: { ...acc },
            targetLevels: {},
            targetBools: {},
            selectedForNextTR: Array.isArray(chain.selectedForNextTR)
              ? [...chain.selectedForNextTR]
              : ['hoursInTR']
          };
          if (!step.selectedForNextTR.includes('hoursInTR')) step.selectedForNextTR.push('hoursInTR');

          // Boosts laden
          applyBoostsFromData(step, chain.boosts, { applyToStats: true });

          // Boolean-Boosts zu selectedForNextTR ergänzen
          if (Array.isArray(chain.boosts)) {
            chain.boosts
              .filter(b => b.type === 'boolean')
              .forEach(b => {
                if (!step.selectedForNextTR.includes(b.key)) step.selectedForNextTR.push(b.key);
              });
          } else if (chain.boosts && typeof chain.boosts === 'object') {
            Object.entries(chain.boosts).forEach(([key]) => {
              const def = allBoosts.find(x => x.key === key);
              if (def?.type === 'boolean' && !step.selectedForNextTR.includes(key)) {
                step.selectedForNextTR.push(key);
              }
            });
          }

          // Boolean-Reset für unmarkierte, nicht-permanente Boosts
          resetUnselectedBooleans(step, acc);

          trSteps.push(step);

          // Neue akkumulierte Stats
          acc = { ...step.stats };
          acc.trCount++;
          acc.allTimeOrbs += getStepOrbGains(step);
          Object.entries(step.targetLevels).forEach(([k, v]) => acc[k] = v);
          Object.entries(step.targetBools).forEach(([k, v]) => acc[k] = v ? 1 : 0);
        });
      }

      // Import: Permanente Boolean-Boosts in allen Folge-Schritten korrigieren
      if (props.importedPlanData) {
        allBoosts.filter(b => b.type === 'boolean').forEach(boost => {
          let activated = false;
          trSteps.forEach(step => {
            if (step.targetBools[boost.key] === true) activated = true;
            if (activated) {
              step.targetBools[boost.key] = true;
              step.stats[boost.key] = 1;
            }
          });
        });
      }
    } else {
      // ─── Neuer Plan ───
      localGemOverrides.value = {};
      localMaxedBoostsOverrides.value = {};
      const statsWithFlags = { ...baseStats };
      if (props.currentStats?._orbCalcMaxedBoosts) {
        statsWithFlags._orbCalcMaxedBoosts = { ...props.currentStats._orbCalcMaxedBoosts };
      }
      trSteps.push({
        id: `step_${Date.now()}`,
        stats: statsWithFlags,
        targetLevels: {},
        targetBools: {},
        selectedForNextTR: ['hoursInTR']
      });
    }

    searchQuery.value = '';
    nextTick(() => updateFollowingStepsStats(0));
    nextTick(() => captureOriginalState());
  } catch (e) {
    error.value = `Initialization failed: ${e.message}`;
  }
}

// ═══════════════════════════════════════════════════════════════
// SAVE / CREATE PLAN
// ═══════════════════════════════════════════════════════════════

function createPlan() {
  if (!isPlanValid.value) return;

  const firstStep = trSteps[0];
  const updatedStats = { ...props.currentStats, trCount: trCount.value, allTimeOrbs: allTimeOrbs.value };

  if (firstStep.stats._orbCalcMaxedBoosts) {
    updatedStats._orbCalcMaxedBoosts = { ...firstStep.stats._orbCalcMaxedBoosts };
  }

  // Boost-Details aus dem ersten Schritt
  const boostDetails = {};
  Object.entries(firstStep.targetLevels || {}).forEach(([key, targetLevel]) => {
    const boost = allBoosts.find(b => b.key === key);
    if (!boost) return;
    const currentLevel = props.currentStats[key] || 0;
    if (targetLevel > currentLevel) {
      boostDetails[key] = {
        type: 'number', label: boost.label || key,
        currentLevel, targetLevel, remainingLevels: targetLevel - currentLevel
      };
    }
  });
  Object.entries(firstStep.targetBools || {}).forEach(([key, isActive]) => {
    const boost = allBoosts.find(b => b.key === key);
    if (!boost) return;
    boostDetails[key] = {
      type: 'boolean', label: boost.label || key,
      currentState: !!props.currentStats[key], targetState: isActive
    };
  });

  // Ergebnisse für den ersten TR
  const calculatedResults = {
    orbRequirement: getStepOrbRequirement(firstStep, 0),
    orbGains: getStepOrbGains(firstStep),
    campaignFragGains: getStepFragGains(firstStep),
    requirementMet: getStepRequirementMet(firstStep, 0),
    orbsNeeded: getStepRequirementMet(firstStep, 0)
      ? 0 : getStepOrbRequirement(firstStep, 0) - getStepOrbGains(firstStep)
  };

  if (!calculatedResults.requirementMet) {
    showAlert(
      'First TR requirements not met. Please adjust your Stats to meet the requirements. The Plan will not be saved.',
      'Warning', 'warning'
    );
    return;
  }

  // Kette der Folge-TRs aufbauen
  const validChainSteps = [];
  let accOrbs = allTimeOrbs.value + calculatedResults.orbGains;
  let nextTR = trCount.value + 1;

  for (let i = 1; i < trSteps.length; i++) {
    const step = trSteps[i];
    const adjusted = { ...step, stats: { ...step.stats, trCount: nextTR, allTimeOrbs: accOrbs } };
    if (!getStepRequirementMet(adjusted, validChainSteps.length + 1)) break;

    const stepBoosts = {};
    Object.entries(step.targetLevels || {}).forEach(([key, targetLevel]) => {
      const boost = allBoosts.find(b => b.key === key);
      if (!boost) return;
      const prev = validChainSteps.length > 0 ? validChainSteps[validChainSteps.length - 1] : firstStep;
      const prevLevel = prev.targetLevels?.[key] ?? prev.stats?.[key] ?? 0;
      if (key === 'hoursInTR' || !boost.permanent || targetLevel > prevLevel) {
        stepBoosts[key] = {
          type: 'number', label: boost.label || key,
          currentLevel: prevLevel, targetLevel, remainingLevels: targetLevel - prevLevel
        };
      }
    });
    Object.entries(step.targetBools || {}).forEach(([key, isActive]) => {
      const boost = allBoosts.find(b => b.key === key);
      if (!boost) return;
      const prev = validChainSteps.length > 0 ? validChainSteps[validChainSteps.length - 1] : firstStep;
      const prevState = !!prev.targetBools?.[key] || !!prev.stats?.[key];
      stepBoosts[key] = {
        type: 'boolean', label: boost.label || key,
        currentState: prevState, targetState: isActive
      };
    });

    const stepResults = {
      orbRequirement: getStepOrbRequirement(adjusted, validChainSteps.length + 1),
      orbGains: getStepOrbGains(adjusted),
      campaignFragGains: getStepFragGains(adjusted),
      requirementMet: true
    };

    validChainSteps.push({
      trNumber: nextTR, boosts: stepBoosts, results: stepResults,
      selectedForNextTR: Array.isArray(step.selectedForNextTR) ? [...step.selectedForNextTR] : ['hoursInTR']
    });

    accOrbs += stepResults.orbGains;
    nextTR++;
    hasUnsavedChanges.value = false;
  }

  const planData = {
    name: planName.value.trim(),
    trStartDate: trStartDate.value,
    trStartTime: trStartTime.value,
    boosts: boostDetails,
    updatedStats,
    results: calculatedResults,
    trChain: validChainSteps,
    selectedForNextTR: Array.isArray(firstStep.selectedForNextTR) ? [...firstStep.selectedForNextTR] : ['hoursInTR'],
    progress: { completed: false, lastUpdated: new Date().toISOString() },
    gemOverrides: localGemOverrides.value ? { ...localGemOverrides.value } : {},
    maxedBoostsOverrides: localMaxedBoostsOverrides.value ? { ...localMaxedBoostsOverrides.value } : {}
  };

  const planId = props.editPlanId || `trplan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  if (trSteps.length > 1 && validChainSteps.length < trSteps.length - 1) {
    pendingSavePlanId.value = planId;
    pendingSaveData.value = planData;
    showAlert(
      `Only ${validChainSteps.length + 1} of ${trSteps.length} TRs were saved. Invalid TRs have been removed.`,
      'Warning', 'warning'
    );
    return;
  }

  savePlan(planId, planData);
}

function savePlan(planId, planData) {
  if (props.editPlanId) {
    const original = trPlannerStore.getTRPlanById(planId);
    trPlannerStore.updateTRPlan(planId, { ...original, ...planData, updatedAt: new Date().toISOString() });
  } else {
    trPlannerStore.addTRPlan({ id: planId, createdAt: new Date().toISOString(), ...planData });
  }
  emit('save', planId);
  captureOriginalState();
  closeModal();
}

// ═══════════════════════════════════════════════════════════════
// MODAL & DIALOG MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function getButtonText() {
  if (props.importedPlanData) return 'Save Plan';
  return props.editPlanId ? 'Update Plan' : 'Create Plan';
}

function openGemOverrideModal() { showGemOverrideModal.value = true; }
function openMaxedBoostsOverrideModal() { showMaxedBoostsOverrideModal.value = true; }

function clearPlanContext() {
  if (typeof window !== 'undefined') window.__PLAN_CONTEXT__ = null;
}

function closeModal() {
  clearPlanContext();
  emit('close');
}

function cancelAndClose() {
  if (hasUnsavedChanges.value) {
    alertTitle.value = 'Discard changes?';
    alertMessage.value = 'You have unsaved changes in this build. Are you sure you want to discard them?';
    alertType.value = 'warning';
    showAlertDialog.value = true;
  } else {
    closeModal();
  }
}

function showAlert(message, title = 'TR Planner', type = 'info') {
  alertMessage.value = message;
  alertTitle.value = title;
  alertType.value = type;
  showAlertDialog.value = true;
}

function handleAlertClose() {
  showAlertDialog.value = false;
  if (alertTitle.value === 'Discard changes?') {
    closeModal();
  } else if (alertTitle.value === 'Warning' && alertMessage.value.includes('TRs were saved')) {
    if (pendingSavePlanId.value && pendingSaveData.value) {
      savePlan(pendingSavePlanId.value, pendingSaveData.value);
      pendingSavePlanId.value = null;
      pendingSaveData.value = null;
    }
  }
}

function handleAlertCancel() {
  showAlertDialog.value = false;
  if (alertTitle.value === 'Warning' && alertMessage.value.includes('TRs were saved')) {
    pendingSavePlanId.value = null;
  }
}

// ═══════════════════════════════════════════════════════════════
// TR UPDATE MODAL
// ═══════════════════════════════════════════════════════════════

function openTRUpdateModal() {
  if (trSteps[0]) showTRUpdateModal.value = true;
}

function closeTRUpdateModal() { showTRUpdateModal.value = false; }

function handleTRUpdate() {
  const firstStep = trSteps[0];
  const orbGains = getStepOrbGains(firstStep);
  const selectedBoosts = [...firstStep.selectedForNextTR];

  trCount.value += 1;
  trCountDisplay.value = trCount.value.toString();
  allTimeOrbs.value += orbGains;
  allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);

  trSteps.shift();

  for (let i = 0; i < trSteps.length; i++) {
    trSteps[i].stats.trCount = trCount.value + i;
    if (i === 0) {
      trSteps[i].stats.allTimeOrbs = allTimeOrbs.value;
      const unique = new Set([...trSteps[i].selectedForNextTR, ...selectedBoosts]);
      trSteps[i].selectedForNextTR = [...unique];
    } else {
      trSteps[i].stats.allTimeOrbs = trSteps[i - 1].stats.allTimeOrbs + getStepOrbGains(trSteps[i - 1]);
    }
  }

  closeTRUpdateModal();
}

// ═══════════════════════════════════════════════════════════════
// COPY PLAN INITIALIZATION
// ═══════════════════════════════════════════════════════════════

function initializeWithCopyData(copyData) {
  try {
    planName.value = copyData.name || `TR Plan ${new Date().toLocaleDateString()}`;
    trStartDate.value = copyData.trStartDate || new Date().toISOString().split('T')[0];
    trStartTime.value = copyData.trStartTime || new Date().toTimeString().slice(0, 5);
    trCount.value = copyData.trCount || copyData.updatedStats?.trCount || 0;
    trCountDisplay.value = String(trCount.value);
    allTimeOrbs.value = copyData.allTimeOrbs || copyData.updatedStats?.allTimeOrbs || 0;
    allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);

    localGemOverrides.value = copyData.gemOverrides ? { ...copyData.gemOverrides } : {};
    localMaxedBoostsOverrides.value = copyData.maxedBoostsOverrides ? { ...copyData.maxedBoostsOverrides } : {};

    trSteps.length = 0;

    const baseStats = {
      ...props.currentStats, ...copyData,
      trCount: copyData.trCount || 0,
      allTimeOrbs: copyData.allTimeOrbs || 0
    };

    const firstStep = {
      id: `step_copy_${Date.now()}`,
      stats: { ...baseStats },
      targetLevels: {},
      targetBools: {},
      selectedForNextTR: ['hoursInTR']
    };

    if (!copyData.boosts) {
      // OrbCalculatorModal-Format: Boosts direkt aus copyData-Keys
      allBoosts.forEach(boost => {
        const key = boost.key;
        if (key === 'trCount' || key === 'allTimeOrbs' || key.startsWith('_')) return;
        if (copyData[key] === undefined) return;

        if (boost.type === 'boolean') {
          if (copyData[key] === true || copyData[key] === 1) {
            firstStep.targetBools[key] = true;
            firstStep.stats[key] = 1;
          }
        } else if (boost.type === 'number' && copyData[key] > 0) {
          firstStep.targetLevels[key] = copyData[key];
          firstStep.stats[key] = copyData[key];
        }
      });

      if (props.currentStats._orbCalcMaxedBoosts) {
        firstStep.stats._orbCalcMaxedBoosts = { ...props.currentStats._orbCalcMaxedBoosts };
      }
    } else {
      if (Array.isArray(copyData.selectedForNextTR)) {
        firstStep.selectedForNextTR = [...copyData.selectedForNextTR];
        if (!firstStep.selectedForNextTR.includes('hoursInTR')) firstStep.selectedForNextTR.push('hoursInTR');
      }
      applyBoostsFromData(firstStep, copyData.boosts, { applyToStats: true, extractSelectedForNextTR: true });
    }

    trSteps.push(firstStep);

    // Chain-Steps übernehmen
    if (Array.isArray(copyData.trChain)) {
      copyData.trChain.forEach((chainStep) => {
        const step = createNewTRStep();
        if (chainStep.boosts) {
          applyBoostsFromData(step, chainStep.boosts, { extractSelectedForNextTR: true });
        }
        if (Array.isArray(chainStep.selectedForNextTR)) {
          step.selectedForNextTR = [...chainStep.selectedForNextTR];
          if (!step.selectedForNextTR.includes('hoursInTR')) step.selectedForNextTR.push('hoursInTR');
        }
        trSteps.push(step);
      });
    }

    nextTick(() => updateFollowingStepsStats(0));
  } catch {
    initData();
  }
}

// ═══════════════════════════════════════════════════════════════
// SCROLL TRACKING
// ═══════════════════════════════════════════════════════════════

function handleScroll() {
  const container = document.querySelector('.max-h-\\[90vh\\]');
  if (!container) return;
  const modalHeight = container.clientHeight;
  for (let i = 0; i < trSteps.length; i++) {
    const stepEl = document.getElementById(`tr-step-${i}`);
    if (!stepEl) continue;
    const rect = stepEl.getBoundingClientRect();
    if (rect.top < modalHeight / 2 && rect.bottom > modalHeight / 2) {
      currentVisibleStep.value = i;
    }
  }
}

function clearSearch() { searchQuery.value = ''; }

// ═══════════════════════════════════════════════════════════════
// WATCHERS & LIFECYCLE
// ═══════════════════════════════════════════════════════════════

watch(() => [props.editPlanId, props.isVisible], ([, newIsVisible]) => {
  if (newIsVisible) initData();
}, { immediate: true });

watch(() => trSteps.length, () => {
  if (props.isVisible) nextTick(handleScroll);
});

watch(() => props.isVisible, (isVisible) => {
  if (isVisible) {
    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 300);
    hasUnsavedChanges.value = false;
  } else {
    window.removeEventListener('scroll', handleScroll);
  }
});

watch(
  [() => planName.value, () => trCount.value, () => allTimeOrbs.value,
   () => trSteps, () => trStartDate.value, () => trStartTime.value],
  () => { if (props.isVisible && originalState.value) checkForChanges(); },
  { deep: true }
);

// Cascade update wenn allTimeOrbs sich in Steps ändert
watch(
  () => trSteps.map(step => step.stats.allTimeOrbs),
  () => {
    if (!isUpdatingFollowingSteps.value) {
      isUpdatingFollowingSteps.value = true;
      nextTick(() => {
        updateFollowingStepsStats(0);
        setTimeout(() => { isUpdatingFollowingSteps.value = false; }, 0);
      });
    }
  },
  { deep: true }
);

onMounted(() => {
  if (props.isVisible) {
    initData();
    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 300);
  }

  // Kopierte Plandaten laden falls vorhanden
  if (trPlannerStore.copyPlanData) {
    initializeWithCopyData(trPlannerStore.copyPlanData);
    trPlannerStore.setCopyPlanData(null);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// ═══════════════════════════════════════════════════════════════
// EXPOSE
// ═══════════════════════════════════════════════════════════════

defineExpose({
  trSteps, trCount, formatTREndDate,
  getStepOrbRequirement, getStepOrbGains, getStepFragGains, getStepRequirementMet
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
