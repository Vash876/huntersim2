<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
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
          <div class="bg-gray-750/60 rounded-md p-2 border border-transparent hover:border-gray-600">
            <div class="flex flex-col">
              <label class="text-xs font-medium text-gray-300 mb-1">All-Time Orbs</label>
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
                      <!-- Boost Name -->
                      <div class="flex-grow">
                        <span class="text-xs font-medium text-gray-300">{{ boost.label }}</span>
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

                    <!-- Tooltip (optional) -->
                    <div v-if="boost.tooltip && boost.tooltip !== '0'" class="text-[10px] text-gray-400 mb-1">
                      {{ boost.tooltip }}
                    </div>
                    
                    <!-- Unterer Bereich: Multiplier Info und Controls nebeneinander -->
                    <div class="flex items-center justify-between">
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
                          {{ calculateUpgradeCost(boost, step) }}
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
                            :minValue="stepIndex === 0 ? (boost.permanent ? getCurrentLevel(boost, step) : 0) : (boost.permanent ? getPreviousStepLevel(stepIndex, boost.key) : 0)"  
                            :maxValue="boost.max || 999999"
                            :showFastControls="true"
                            :step="boost.normalControl || 1"
                            :fastStep="boost.fastControl || 10"
                            :valueClass="'text-white'"
                            :autoEdit="true"
                            @update:value="(newVal) => updateTargetLevel(step.id, boost.key, newVal)"
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
    confirmText="OK"
    @confirm="handleAlertClose"
    @cancel="showAlertDialog = false"
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
  @cancel="showAlertDialog = false"
/>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useNow } from '@vueuse/core';
import { allBoosts, boostsByCategory, generalStats, alwaysUpdateKeys } from '@/constants/tr-planner';
import { getRelicCost, formatRelicCost } from '@/utils/relicCostUtils';
import { getInscryptionCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, formatGadgetCost } from '@/utils/gadgetCostUtils';
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
  IconArrowRight
} from '@tabler/icons-vue';

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

const emit = defineEmits(['close', 'save', 'openUpdate', 'openNewPlan']);

// Pinia Store als ref einrichten
const trPlannerStore = useTRPlannerStore();

// State
const error = ref(null);
const planName = ref(`Unnamed`);
const searchQuery = ref('');
const hasUnsavedChanges = ref(false);

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
    selectedForNextTR: ['hoursInTR'], // hoursInTR ist immer vorausgewählt
    stats: { ...getLastStepResults() }  // Übernimmt Stats vom letzten Schritt
  };
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
    
    // WICHTIG: Die im OrbCalc gemaxten Boosts identifizieren
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
      const stepStats = step.stats;
      const filteredBoosts = [];
      
      for (const boost of category.boosts) {
        // Wenn es ein Folge-TR ist und dieser Boost nicht in irgendeinem vorherigen TR ausgewählt wurde, ausfiltern
        // Ausnahme: hoursInTR wird immer angezeigt
        if (isFollowUpTR && !selectedBoostsForTR.includes(boost.key) && boost.key !== 'hoursInTR') {
          continue;
        }
        
        // WICHTIG: Spezielle Behandlung für Boolean-Boosts
        if (boost.type === 'boolean') {
          // Prüfe, ob der Boost in maxStats als true markiert ist
          const maxValue = maxStats[boost.key];
          
          // KRITISCH: Wenn der Boost in maxStats=true ist UND NICHT in orbCalcMaxedBoosts markiert ist
          if (maxValue === true && !orbCalcMaxedBoosts[boost.key]) {
            console.log(`### Boolean Boost ${boost.key} ist in maxStats=true und NICHT in orbCalcMaxed markiert - AUSBLENDEN`);
            continue; // Ausblenden
          }
          
          // WICHTIG: Wenn der Boost in orbCalcMaxedBoosts markiert ist, IMMER anzeigen, unabhängig von maxStats
          if (orbCalcMaxedBoosts[boost.key]) {
            console.log(`### Boolean Boost ${boost.key} ist in orbCalcMaxed markiert - ANZEIGEN`);
            filteredBoosts.push(boost);
            continue;
          }
        }
        
        // KRITISCH: Numerische Boosts mit Maximum überprüfen
        if (boost.type === 'number' && boost.max !== undefined) {
          // Prüfe, ob der Boost in maxStats maximal ist
          const maxValue = maxStats[boost.key];
          
          // Wenn der Boost in maxStats maximal ist UND NICHT in orbCalcMaxedBoosts markiert ist
          if (maxValue !== undefined && maxValue >= boost.max && !orbCalcMaxedBoosts[boost.key]) {
            console.log(`### Boost ${boost.key} ist maximal in maxStats und NICHT in orbCalcMaxed markiert - AUSBLENDEN`);
            continue; // Ausblenden
          }
          
          // WICHTIG: Wenn der Boost in orbCalcMaxedBoosts markiert ist, IMMER anzeigen, unabhängig von maxStats
          if (orbCalcMaxedBoosts[boost.key]) {
            console.log(`### Boost ${boost.key} ist in orbCalcMaxed markiert - ANZEIGEN`);
            filteredBoosts.push(boost);
            continue;
          }
        }
        
        // BOOLEAN BOOSTS: Nur ausfiltern, wenn es KEINE Folge-TR ist ODER der Boost nicht ausgewählt ist
        if (boost.type === 'boolean' && stepStats[boost.key] && 
            (!isFollowUpTR || !selectedBoostsForTR.includes(boost.key)) &&
            !step.targetBools[boost.key]) {  // <-- Zusätzliche Bedingung
          continue;
        }
        
        // NUMERISCHE BOOSTS: Wenn der Boost ein max hat UND wir das Maximum erreicht haben, ausfiltern
        // Ausnahme: In Folge-TRs zeigen wir ausgewählte Boosts immer an, auch wenn sie am Maximum sind
        if (boost.type === 'number' && boost.max !== undefined && stepStats[boost.key] >= boost.max &&
            (!isFollowUpTR || !selectedBoostsForTR.includes(boost.key))) {
          continue;
        }
        
        // Nach Suchbegriff filtern, falls vorhanden
        if (searchQuery.value.trim()) {
          const query = searchQuery.value.toLowerCase();
          if (!(boost.label.toLowerCase().includes(query) || boost.key.toLowerCase().includes(query))) {
            continue;
          }
        }
        
        // Wenn kein Filter zugeschlagen hat, behalte den Boost
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
    if (boost.permanent) {
      if (stepIndex === 0) {
        // Im ersten Schritt ist der Minimalwert der aktuelle Stats-Wert
        minLevel = props.currentStats[boostKey] || 0;
      } else {
        // In späteren Schritten ist der Minimalwert das Ergebnis des vorherigen Schritts
        minLevel = trSteps[stepIndex - 1].stats[boostKey] || 0;
        if (trSteps[stepIndex - 1].targetLevels[boostKey] !== undefined) {
          minLevel = trSteps[stepIndex - 1].targetLevels[boostKey];
        }
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

// Orb Gains für einen Schritt berechnen
function getStepOrbGains(step) {
  /* ---------------- Basis‑ und Ziel‑Stats bauen ---------------- */
  const baseStats = { ...step.stats };           // Start in diesem TR
  const planStats = { ...step.stats };           // nach allen Targets

  /* numerische Ziele einblenden */
  Object.entries(step.targetLevels).forEach(([k, v]) => { planStats[k] = v; });

  /* Boolean‑Ziele verarbeiten */
  Object.entries(step.targetBools).forEach(([k, active]) => {
    const def = allBoosts.find(b => b.key === k);

    if (def && !def.permanent) {
      // nicht‑permanent → in BEIDEN Stat‑Sätzen fixieren
      baseStats[k] = planStats[k] = active ? 1 : 0;
    } else if (active) {
      // permanent → nur Ziel‑Stats auf 1 setzen
      planStats[k] = 1;
    }
  });

  /* ---------------- Orb‑Gains berechnen ------------------------ */
  const orbCalcBoosts = allBoosts.filter(b => b.orbcalc);
  return calculateOrbGains(baseStats, planStats, orbCalcBoosts);
}


// Fragment Gains für einen Schritt berechnen
function getStepFragGains(step) {
  // Plan Stats für diesen Schritt zusammenstellen
  const planStats = { ...step.stats };
  
  // Numerische Boosts aus targetLevels
  Object.keys(step.targetLevels).forEach(key => {
    planStats[key] = step.targetLevels[key];
  });
  
  // Boolean Boosts aus targetBools
  Object.entries(step.targetBools).forEach(([key, isActive]) => {
    if (isActive) {
      planStats[key] = 1;
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

// Funktion zum Laden eines existierenden Plans
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

      const statsWithOrbCalcFlags = {
        ...baseStats,
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
                           : ['hoursInTR']
      };
      if (!firstStep.selectedForNextTR.includes('hoursInTR'))
        firstStep.selectedForNextTR.push('hoursInTR');

      // Boosts aus plan.boosts übernehmen
      plan.boosts.forEach(b => {
        if (b.type === 'number') {
          firstStep.targetLevels[b.key] = b.targetLevel;
          firstStep.stats[b.key]        = b.targetLevel;
        } else if (b.type === 'boolean') {
          const boostDef = allBoosts.find(x => x.key === b.key);
          const state = Boolean(b.targetState);
          firstStep.targetBools[b.key] = state;
          firstStep.stats[b.key]       = state ? 1 : (boostDef?.permanent ? firstStep.stats[b.key] || 0 : 0);
        }
      });
    } else {
      // Neuer Plan
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
        selectedForNextTR: ['hoursInTR']
      };
    }

    trSteps.push(firstStep);

    // ───────────────────────── Chain‑Schritte ─────────────────────────
    if (props.editPlanId) {
      const plan = trPlannerStore.getTRPlanById(props.editPlanId);
      if (Array.isArray(plan.trChain) && plan.trChain.length) {
        let acc = { ...firstStep.stats };
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
                               : ['hoursInTR']
          };
          if (!step.selectedForNextTR.includes('hoursInTR'))
            step.selectedForNextTR.push('hoursInTR');

          // ---------------- numerische Boosts ----------------
          chain.boosts
            .filter(b => b.type === 'number')
            .forEach(b => {
              step.targetLevels[b.key] = b.targetLevel;
              step.stats[b.key]        = b.targetLevel;
            });

          // ---------------- Boolean‑Boosts (Fix!) ----------------
          chain.boosts
            .filter(b => b.type === 'boolean')      // KEIN selectedForNextTR‑Filter mehr
            .forEach(b => {
              const def   = allBoosts.find(x => x.key === b.key);
              const state = Boolean(b.targetState);

              step.targetBools[b.key] = state;

              // stats korrekt auf 0/1 setzen
              if (def?.permanent) {
                if (state) step.stats[b.key] = 1;
              } else {
                step.stats[b.key] = state ? 1 : 0;
              }

              // UI‑Merker ergänzen, falls noch nicht vorhanden
              if (!step.selectedForNextTR.includes(b.key)) {
                step.selectedForNextTR.push(b.key);
              }
            });

          // ----- Boolean‑Reset: unmarkierte, nicht‑permanente Boosts sollen
          //       denselben Wert haben wie im Haupt‑TR -------------------------
          allBoosts
            .filter(b => b.type === 'boolean' && !b.permanent)
            .forEach(b => {
              const key             = b.key;
              const isMarked        = step.selectedForNextTR.includes(key);
              const hasExplicitBool = Object.prototype.hasOwnProperty.call(step.targetBools, key);

              if (!isMarked && !hasExplicitBool) {
                // ⇒ graues Kästchen: Wert aus dem Haupt‑TR übernehmen
                const prevBool = acc[key] || 0;    // Wert aus dem vorherigen Step
                step.stats[key] = prevBool;        // nicht aus dem Haupt‑TR!
              }
            });

          trSteps.push(step);

          // neue akkumulierte Stats
          acc = { ...step.stats };
          acc.trCount++;
          acc.allTimeOrbs += getStepOrbGains(step);
        });
      }
    }

    // Suchfeld zurücksetzen
    searchQuery.value = '';

    // Nachladen abhängiger Berechnungen
    nextTick(() => updateFollowingStepsStats(0));
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

  // --- 2) Aktualisierte Basis‑Stats für den Plan ---
  const updatedStats = {
    ...props.currentStats,
    trCount: trCount.value,
    allTimeOrbs: allTimeOrbs.value
  };

  // --- 3) Boost‑Details aus dem ersten Schritt (Plan.boosts) ---
  if (firstStep.stats._orbCalcMaxedBoosts) {
    updatedStats._orbCalcMaxedBoosts = { ...firstStep.stats._orbCalcMaxedBoosts };
    console.log("_orbCalcMaxedBoosts in updatedStats übernommen:", updatedStats._orbCalcMaxedBoosts);
  }
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

  // 3b) Boolean‑Boosts im ersten Schritt
  Object.entries(firstStep.targetBools || {})
    .forEach(([key, isActive]) => {
      const boost = allBoosts.find(b => b.key === key);
      if (!boost) return;
      const currentState = !!props.currentStats[key];
      boostDetails.push({
        key,
        type: 'boolean',
        label: boost.label || key,
        currentState,
        targetState: isActive
      });
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
        : ['hoursInTR']
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
    progress: {
      completed:   false,
      lastUpdated: new Date().toISOString()
    }
  };

  // --- 7) Speichern / Update im Store ---
  let planId;
  if (props.editPlanId) {
    const original = trPlannerStore.getTRPlanById(props.editPlanId);
    const updated  = { ...original, ...planData, updatedAt: new Date().toISOString() };
    trPlannerStore.updateTRPlan(props.editPlanId, updated);
    planId = props.editPlanId;
  } else {
    planId = `trplan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    trPlannerStore.addTRPlan({ id: planId, createdAt: new Date().toISOString(), ...planData });
  }

  // --- 8) Warnung, falls einige TRs herausgefallen sind ---
  if (trSteps.length > 1 && validChainSteps.length < trSteps.length - 1) {
    showAlert(
      `Only ${validChainSteps.length + 1} of ${trSteps.length} TRs were saved. Invalid TRs have been removed.`,
      'Warning',
      'warning'
    );
    emit('save', planId);
    return;
  }

  // --- 9) Abschluss ---
  emit('save', planId);
  cancelAndClose();
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
    // Wenn der Benutzer im "Discard changes"-Dialog bestätigt hat
    emit('close');
  }
  // Andere Alert-Fälle bleiben unverändert
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
    trCount.value = copyData.trCount || 0;
    trCountDisplay.value = String(trCount.value);
    allTimeOrbs.value = copyData.allTimeOrbs || 0;
    allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);

    // 2) Bestehende Schritte löschen
    trSteps.length = 0;

    // 3) Basis‑Stats vom copyData übernehmen
    const baseStats = {
      ...props.currentStats,          // sichere Basis
      ...copyData,                    // alle Werte aus copyData direkt übernehmen
      trCount: copyData.trCount || 0,
      allTimeOrbs: copyData.allTimeOrbs || 0
    };

    // 4) Ersten Schritt anlegen
    const firstStep = {
      id: `step_copy_${Date.now()}`,
      stats: { ...baseStats },        // Kopie der Basis-Stats
      targetLevels: {},
      targetBools: {},
      selectedForNextTR: ['hoursInTR']  // hoursInTR ist immer vorausgewählt
    };

    // 5) Wenn es ein Plan aus dem OrbCalculatorModal ist, hat er keine boosts-Eigenschaft
    // In diesem Fall müssen wir die Werte direkt aus dem copyData in targetLevels/targetBools übernehmen
    if (!copyData.boosts) {
      console.log("Initializing from OrbCalculatorModal data");
      
      // Für jeden Boost prüfen, ob er im copyData existiert und kein Meta-Feld ist
      allBoosts.forEach(boost => {
        const key = boost.key;
        
        // Meta-Felder überspringen
        if (key === 'trCount' || key === 'allTimeOrbs' || key.startsWith('_')) {
          return;
        }
        
        // Wenn der Wert existiert und nicht undefined ist
        if (copyData[key] !== undefined) {
          // Für Boolean-Boosts
          if (boost.type === 'boolean') {
            // Nur auf true setzen, wenn der Wert wahr ist
            if (copyData[key] === true || copyData[key] === 1) {
              firstStep.targetBools[key] = true;
              // Auch in den Stats setzen für korrekte Berechnung
              firstStep.stats[key] = 1;
            }
          } 
          // Für numerische Boosts
          else if (boost.type === 'number') {
            // Nur setzen, wenn der Wert > 0 ist
            if (copyData[key] > 0) {
              firstStep.targetLevels[key] = copyData[key];
              // Auch in den Stats setzen für korrekte Berechnung
              firstStep.stats[key] = copyData[key];
            }
          }
        }
      });
      
      // _orbCalcMaxedBoosts-Information übernehmen, falls vorhanden
      if (copyData._orbCalcMaxedBoosts) {
        firstStep.stats._orbCalcMaxedBoosts = { ...copyData._orbCalcMaxedBoosts };
        console.log("Übernommene _orbCalcMaxedBoosts:", firstStep.stats._orbCalcMaxedBoosts);
      }
    } 
    // 5b) Wenn es ein normaler Plan ist, die Boosts wie gewohnt verarbeiten
    else {
      // Spezieller Fall: selectedForNextTR aus copyData übernehmen
      if (Array.isArray(copyData.selectedForNextTR)) {
        firstStep.selectedForNextTR = [...copyData.selectedForNextTR];
        if (!firstStep.selectedForNextTR.includes('hoursInTR')) {
          firstStep.selectedForNextTR.push('hoursInTR');
        }
      }

      // Boosts aus copyData.boosts übernehmen
      copyData.boosts.forEach(b => {
        const def = allBoosts.find(x => x.key === b.key);
        if (!def) return;
        
        if (b.type === 'number') {
          firstStep.targetLevels[b.key] = b.targetLevel;
          firstStep.stats[b.key] = b.targetLevel;
        } 
        else if (b.type === 'boolean') {
          const state = Boolean(b.targetState);
          firstStep.targetBools[b.key] = state;
          
          // WICHTIG: Nicht‑permanente Booleans immer exakt 0/1 setzen
          firstStep.stats[b.key] = def.permanent
            ? (state ? 1 : (firstStep.stats[b.key] || 0))
            : (state ? 1 : 0);
        }
      });
    }

    trSteps.push(firstStep);

    // 6) Folge‑TRs (trChain) laden, falls vorhanden
    if (copyData.trChain && Array.isArray(copyData.trChain)) {
      copyData.trChain.forEach((chainStep, index) => {
        // Neuen TR-Step erstellen mit den Stats des vorherigen
        const step = createNewTRStep();
        
        // Boosts aus dem Chain-Step kopieren
        if (chainStep.boosts && Array.isArray(chainStep.boosts)) {
          chainStep.boosts.forEach(b => {
            if (b.type === 'boolean') {
              step.targetBools[b.key] = b.targetState;
            } else if (b.type === 'number') {
              step.targetLevels[b.key] = b.targetLevel;
            }
          });
        }
        
        // Wenn selectedForNextTR vorhanden, kopieren (oder sicherstellen, dass hoursInTR enthalten ist)
        if (chainStep.selectedForNextTR && Array.isArray(chainStep.selectedForNextTR)) {
          step.selectedForNextTR = [...chainStep.selectedForNextTR];
          if (!step.selectedForNextTR.includes('hoursInTR')) {
            step.selectedForNextTR.push('hoursInTR');
          }
        }
        
        trSteps.push(step);
      });
    }

    // 7) Reaktivität erzwingen und Folge‑Steps neu berechnen
    nextTick(() => updateFollowingStepsStats(0));

    console.log("Copy data initialized successfully:", trSteps);
  }
  catch (error) {
    console.error('Error initializing copy data:', error);
    // Wenn etwas schiefgeht, Fallback
    initData();
  }
}

// Funktion zum Öffnen des Update-Modals
function openTRUpdateModal() {
  // Der erste TR-Step wird zum Update verwendet
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
  // TR-Count und All-Time-Orbs aus dem ersten TR aktualisieren
  const firstStep = trSteps[0];
  const orbGains = getStepOrbGains(firstStep);
  
  // Wichtig: Speichere die selectedForNextTR-Information des ersten Schritts
  const selectedBoosts = [...firstStep.selectedForNextTR];
  
  // TR-Count erhöhen
  trCount.value += 1;
  trCountDisplay.value = trCount.value.toString();
  
  // All-Time Orbs erhöhen
  allTimeOrbs.value += orbGains;
  allTimeOrbsDisplay.value = formatSuffixNotation(allTimeOrbs.value);
  
  // Ersten TR-Schritt entfernen
  trSteps.shift();
  
  // Aktualisiere die Stats für alle verbleibenden TRs
  for (let i = 0; i < trSteps.length; i++) {
    trSteps[i].stats.trCount = trCount.value + i;
    
    // Wenn es der erste Schritt ist (nach dem Entfernen), aktualisiere All-Time Orbs direkt
    if (i === 0) {
      trSteps[i].stats.allTimeOrbs = allTimeOrbs.value;
      
      // WICHTIG: Füge die gespeicherten ausgewählten Boosts zur selectedForNextTR-Liste hinzu
      // Stelle sicher, dass wir keine Duplikate haben
      const uniqueSelectedBoosts = new Set([...trSteps[i].selectedForNextTR, ...selectedBoosts]);
      trSteps[i].selectedForNextTR = [...uniqueSelectedBoosts];
    }
    // Ansonsten berechne akkumulierte All-Time Orbs
    else {
      trSteps[i].stats.allTimeOrbs = trSteps[i-1].stats.allTimeOrbs + getStepOrbGains(trSteps[i-1]);
    }
  }
  
  // Update-Modal schließen
  closeTRUpdateModal();
}

/**
 * Berechnet die Kosten für die Differenz zwischen aktuellem und Ziel-Level
 * @param {Object} boost - Der Boost, für den die Kosten berechnet werden sollen
 * @param {Object} step - Der TR-Schritt mit den Stats und Zielwerten
 * @returns {string} - Die formatierten Kosten oder einen leeren String
 */
 function calculateUpgradeCost(boost, step) {
  // Finde den Index des Schritts
  const stepIndex = trSteps.findIndex(s => s.id === step.id);
  
  // Wenn es der Haupt-TR (erster Schritt) ist, keine Kosten anzeigen
  if (stepIndex === 0) return '';
  
  if (!boost || boost.type === 'boolean') return '';
  
  const boostKey = boost.key;
  
  // Aktueller Wert und Zielwert ermitteln
  const currentLevel = step.stats[boostKey] || 0;
  const targetLevel = step.targetLevels[boostKey] !== undefined ? 
                      step.targetLevels[boostKey] : 
                      currentLevel;
  
  // Wenn kein Upgrade, keine Kosten anzeigen
  if (targetLevel <= currentLevel) return '';
  
  // Kosten basierend auf Boost-Kategorie berechnen
  let totalCost = 0;
  
  // Für Relics
  if (boost.category === 'relic') {
    const relicId = `r${boost.key.replace('r', '')}`;
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      totalCost += getRelicCost(relicId, level);
    }
    return formatRelicCost(totalCost);
  }
  
  // Für Inscriptions
  else if (boost.category === 'inscryption') {
    const inscryptionId = `i${boost.key.replace('i', '')}`;
    for (let level = currentLevel + 1; level <= targetLevel; level++) {
      totalCost += getInscryptionCost(inscryptionId, level);
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
    // Verhindere rekursive Updates
    if (!isUpdatingFollowingSteps.value) {
      isUpdatingFollowingSteps.value = true;
      nextTick(() => {
        updateFollowingStepsStats(0);
        // Timer setzen, um den Flag zurückzusetzen
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

// Plan mit den aktuellen Werten erstellen
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
  
  allBoosts.forEach(boost => {
    if (boost.max !== undefined && boost.type === 'number') {
      // Prüfe, ob der Boost in CurrentBoosts maximal ist
      const currentValue = currentBoosts.value[boost.key];
      if (currentValue !== undefined && currentValue >= boost.max) {
        // Prüfe, ob der Boost NICHT in maxLevelStats maximal ist
        const maxLevelValue = maxLevelStats.value[boost.key];
        if (maxLevelValue === undefined || maxLevelValue < boost.max) {
          // Diesen Boost als "nur im OrbCalc maximiert" markieren
          currentValues._orbCalcMaxedBoosts[boost.key] = true;
        }
      }
    }
    else if (boost.type === 'boolean') {
      // Prüfe, ob der Boolean-Boost in CurrentBoosts aktiviert ist
      const isActive = currentBoosts.value[boost.key];
      if (isActive === true) {
        // Prüfe, ob der Boost NICHT in maxLevelStats aktiviert ist
        const isMaxedActive = maxLevelStats.value[boost.key];
        if (isMaxedActive !== true) {
          // Diesen Boost als "nur im OrbCalc aktiviert" markieren
          currentValues._orbCalcMaxedBoosts[boost.key] = true;
        }
      }
    }
  });
  
  // Stelle sicher, dass trCount und allTimeOrbs gesetzt sind
  currentValues.trCount = trCount.value;
  currentValues.allTimeOrbs = allTimeOrbs.value;
  
  // NEU: Füge die aktuelle Uhrzeit und das Datum hinzu
  const now = new Date();
  currentValues.trStartDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  currentValues.trStartTime = now.toTimeString().split(' ')[0].slice(0, 5); // Format: HH:MM
  
  // Speichere die Daten in trPlannerStore.tempPlanData
  trPlannerStore.tempPlanData = JSON.parse(JSON.stringify(currentValues));
  
  console.log("Daten für neuen Plan vorbereitet:", trPlannerStore.tempPlanData);
  
  // Modal schließen
  emit('close');
  console.log("1.2. Emitted 'close' event");
  
  // Daten auch in copyPlanData speichern für die Übergabe
  trPlannerStore.setCopyPlanData(JSON.parse(JSON.stringify(currentValues)));
  
  // Setze Flag im Store, dass TRPlanModal geöffnet werden soll
  trPlannerStore.planModalShouldOpen = 'current';
  
  console.log("1.3. Set planModalShouldOpen flag in store:", trPlannerStore.planModalShouldOpen);
}

// Vollständige Funktion createPlanWithTargetValues
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
  
  allBoosts.forEach(boost => {
    if (boost.max !== undefined && boost.type === 'number') {
      // Prüfe, ob der Boost in targetBoosts maximal ist
      const targetValue = targetBoosts.value[boost.key];
      if (targetValue !== undefined && targetValue >= boost.max) {
        // Prüfe, ob der Boost NICHT in maxLevelStats maximal ist
        const maxLevelValue = maxLevelStats.value[boost.key];
        if (maxLevelValue === undefined || maxLevelValue < boost.max) {
          // Diesen Boost als "nur im OrbCalc maximiert" markieren
          targetStats._orbCalcMaxedBoosts[boost.key] = true;
        }
      }
    }
    else if (boost.type === 'boolean') {
      // Prüfe, ob der Boolean-Boost in targetBoosts aktiviert ist
      const isActive = targetBoosts.value[boost.key];
      if (isActive === true) {
        // Prüfe, ob der Boost NICHT in maxLevelStats aktiviert ist
        const isMaxedActive = maxLevelStats.value[boost.key];
        if (isMaxedActive !== true) {
          // Diesen Boost als "nur im OrbCalc aktiviert" markieren
          targetStats._orbCalcMaxedBoosts[boost.key] = true;
        }
      }
    }
  });
  
  // Stelle sicher, dass trCount und allTimeOrbs gesetzt sind
  targetStats.trCount = trCount.value;
  targetStats.allTimeOrbs = allTimeOrbs.value;
  
  // NEU: Füge die aktuelle Uhrzeit und das Datum hinzu
  const now = new Date();
  targetStats.trStartDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  targetStats.trStartTime = now.toTimeString().split(' ')[0].slice(0, 5); // Format: HH:MM
  
  // Speichere die Daten in trPlannerStore.tempPlanData
  trPlannerStore.tempPlanData = JSON.parse(JSON.stringify(targetStats));
  
  console.log("Daten für neuen Plan (Target) vorbereitet:", trPlannerStore.tempPlanData);
  
  // Modal schließen
  emit('close');
  
  // Daten auch in copyPlanData speichern
  trPlannerStore.setCopyPlanData(JSON.parse(JSON.stringify(targetStats)));
  
  // Setze Flag im Store, dass TRPlanModal geöffnet werden soll
  trPlannerStore.planModalShouldOpen = 'target';
  
  console.log("Target plan flag set in store:", trPlannerStore.planModalShouldOpen);
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
    // Wenn das Modal geöffnet und nicht im Initialisierungsprozess ist
    if (props.isVisible && !error.value) {
      hasUnsavedChanges.value = true;
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