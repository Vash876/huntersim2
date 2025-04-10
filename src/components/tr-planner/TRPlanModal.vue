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
          Create a new TR Plan by setting target levels for Stats. Stats that are already at maximum level are not shown here but will be included in the Calculation.  
          Click on the gray indicators on the left edge of each Stat to turn them green and include those Stats in future TRs.
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
      
      <!-- Search Field -->
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
      </div>

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
                      
                      <!-- Target Controls - rechts auf gleicher Höhe wie Multiplier -->
                      <div class="flex-shrink-0 ml-2">
                        <!-- Boolean Type Controls -->
                        <div v-if="boost.type === 'boolean'" class="flex justify-end min-w-[40px]">
                          <button 
                            @click.stop="toggleBooleanTarget(step.id, boost.key)"
                            class="text-xs px-1.5 py-0.5 rounded-sm"
                            :class="getTargetBool(step.id, boost.key) ? 'bg-green-700 text-green-100' : 'bg-gray-700 hover:bg-green-800/50 text-white'"
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
                            :step="1"
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
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useNow } from '@vueuse/core';
import { allBoosts, boostsByCategory, generalStats } from '@/constants/tr-planner';
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
  IconCheck
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

const emit = defineEmits(['close', 'save', 'openUpdate']);

// Pinia Store als ref einrichten
const trPlannerStore = useTRPlannerStore();

// State
const error = ref(null);
const planName = ref(`TR Plan ${new Date().toLocaleDateString()}`);
const searchQuery = ref('');

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
  if (stepIndex !== -1) {
    const step = trSteps[stepIndex];
    const selectedIndex = step.selectedForNextTR.indexOf(boostKey);
    
    if (selectedIndex === -1) {
      step.selectedForNextTR.push(boostKey);
      
      // Für bestehende TR Steps: Prüfe bei allen nachfolgenden TRs, ob wir dort den Boost
      // automatisch mit dem aktuellen Zustand hinzufügen müssen
      const currentState = step.targetBools[boostKey] || false;
      
      // Füge den Boost zu allen nachfolgenden TR-Steps hinzu
      for (let i = stepIndex + 1; i < trSteps.length; i++) {
        // Wenn dieser Boost noch nicht in selectedForNextTR ist, füge ihn hinzu
        if (!trSteps[i].selectedForNextTR.includes(boostKey)) {
          trSteps[i].selectedForNextTR.push(boostKey);
        }
        
        // Setze den initialen Zustand gemäß dem Zustand vom ersten TR
        if (trSteps[i].targetBools[boostKey] === undefined) {
          trSteps[i].targetBools[boostKey] = currentState;
        }
      }
    } else {
      step.selectedForNextTR.splice(selectedIndex, 1);
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
  // Plan ist gültig wenn Name gesetzt ist und mind. 1 Boost in irgendeinem Schritt verändert wurde
  if (planName.value.trim() === '') return false;
  
  // Prüfe, ob mindestens ein Schritt Änderungen enthält
  return trSteps.some(step => {
    const numericBoostsSelected = Object.keys(step.targetLevels).length > 0;
    const booleanBoostsSelected = Object.values(step.targetBools).some(v => v);
    return numericBoostsSelected || booleanBoostsSelected;
  });
});

// Gefilterte Boosts nach Kategorien
function getFilteredBoostsByCategory(step) {
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
  
  return boostsByCategory.map(category => {
    // Die Kategorie kopieren
    const newCategory = { ...category };
    
    // Stats für diesen Schritt ermitteln
    const stepStats = step.stats;
    
    // Alle Boosts filtern
    newCategory.boosts = category.boosts.filter(boost => {
      // Wenn es ein Folge-TR ist und dieser Boost nicht in irgendeinem vorherigen TR ausgewählt wurde, ausfiltern
      // Ausnahme: hoursInTR wird immer angezeigt
      if (isFollowUpTR && !selectedBoostsForTR.includes(boost.key) && boost.key !== 'hoursInTR') {
        return false;
      }
      
      // Aktuellen Level/Status aus den Step-Stats auslesen
      const currentValue = stepStats[boost.key] || 0;
      
      // BOOLEAN BOOSTS: Nur ausfiltern, wenn es KEINE Folge-TR ist ODER der Boost nicht ausgewählt ist
      if (boost.type === 'boolean' && currentValue && 
          (!isFollowUpTR || (isFollowUpTR && !selectedBoostsForTR.includes(boost.key)))) {
        return false;
      }
      
      // NUMERISCHE BOOSTS: Wenn der Boost ein max hat UND wir das Maximum erreicht haben, ausfiltern
      // Ausnahme: In Folge-TRs zeigen wir ausgewählte Boosts immer an, auch wenn sie am Maximum sind
      if (boost.type === 'number' && boost.max !== undefined && currentValue >= boost.max &&
          (!isFollowUpTR || (isFollowUpTR && !selectedBoostsForTR.includes(boost.key)))) {
        return false;
      }
      
      // Nach Suchbegriff filtern, falls vorhanden
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        return boost.label.toLowerCase().includes(query) || 
               boost.key.toLowerCase().includes(query);
      }
      
      // Alle anderen Boosts behalten
      return true;
    });
    
    return newCategory;
  }).filter(category => category.boosts.length > 0); // Leere Kategorien entfernen
}

// Boolean Boost für einen bestimmten Schritt togglen
function toggleBooleanTarget(stepId, boostKey) {
  const stepIndex = trSteps.findIndex(step => step.id === stepId);
  if (stepIndex !== -1) {
    const step = trSteps[stepIndex];
    step.targetBools[boostKey] = !step.targetBools[boostKey];
    
    // NEU: Aktualisiere alle nachfolgenden TR-Steps mit den neuen akkumulierten Stats
    updateFollowingStepsStats(stepIndex);
  }
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
  // Wenn der letzte TR-Schritt geändert wurde, gibt es keine Folge-Schritte
  if (modifiedStepIndex >= trSteps.length - 1) return;

  // 1) Orb-Gewinne im gerade veränderten Schritt berechnen
  const modifiedStep = trSteps[modifiedStepIndex];
  const orbGains = getStepOrbGains(modifiedStep);

  // 2) Nimm eine Kopie der (alten) Stats des modifizierten Schritts
  let accumulatedStats = { ...modifiedStep.stats };

  // Target-Levels und -Bools vom modifizierten Schritt einrechnen
  Object.entries(modifiedStep.targetLevels).forEach(([key, value]) => {
    accumulatedStats[key] = value;
  });
  
  Object.entries(modifiedStep.targetBools).forEach(([key, boolVal]) => {
    const boost = allBoosts.find(b => b.key === key);
    
    if (boolVal) {
      accumulatedStats[key] = 1;
    } else if (boost && !boost.permanent) {
      accumulatedStats[key] = 0;
    }
  });

  // 3) Jetzt durch alle folgenden TR-Schritte iterieren und aktualisieren
  for (let i = modifiedStepIndex + 1; i < trSteps.length; i++) {
    const nextStep = trSteps[i];
    // Kopie seiner Stats
    let newStats = { ...nextStep.stats };
    
    // EXPLIZIT setzen des trCount-Werts
    // Der TR-Count für den Schritt i sollte sein: Basis-TR-Count + i
    newStats.trCount = trCount.value + i;
    
    // EXPLIZIT setzen des allTimeOrbs-Werts
    // Die All-Time Orbs sollten eine Akkumulation aus dem vorherigen Schritt sein
    if (i === modifiedStepIndex + 1) {
      // Erster Folgeschritt: Nimm die Orbs aus dem modifizierten Schritt + seine Gains
      newStats.allTimeOrbs = (modifiedStep.stats.allTimeOrbs || allTimeOrbs.value) + getStepOrbGains(modifiedStep);
    } else {
      // Spätere Folgeschritte: Nimm die Orbs aus dem vorherigen Schritt + seine Gains
      const prevStep = trSteps[i-1];
      newStats.allTimeOrbs = prevStep.stats.allTimeOrbs + getStepOrbGains(prevStep);
    }

    // 3a) Stats jedes Folgeschritts anpassen
    Object.keys(accumulatedStats).forEach(key => {
      // 1) Sachen, die immer aktualisiert werden
      if (alwaysUpdateKeys.includes(key)) {
        newStats[key] = accumulatedStats[key];
      }
      // 2) Wenn der Boost permanent ist ODER nicht via Checkbox "gesperrt"
      else if (isPermanentBoost(key) || !nextStep.selectedForNextTR.includes(key)) {
        newStats[key] = accumulatedStats[key];
      }
      // 3) Wenn NICHT permanent und in selectedForNextTR, lassen wir den Wert in Ruhe
    });

    // 3b) Zielwerte (targetLevels) erzwingen für permanente Boosts
    let newTargetLevels = { ...nextStep.targetLevels };
    Object.keys(newTargetLevels).forEach(boostKey => {
      if (isPermanentBoost(boostKey)) {
        if (newTargetLevels[boostKey] < newStats[boostKey]) {
          newTargetLevels[boostKey] = newStats[boostKey];
        }
      }
    });

    // WICHTIG: Wir setzen den neuen TR-Step mit den angepassten Werten
    trSteps[i] = {
      ...nextStep,
      stats: newStats,
      targetLevels: newTargetLevels
    };

    // 4) Für den nächsten Schritt: prepare Stats
    if (i < trSteps.length - 1) {
      // Aktualisiere die akkumulierten Stats mit den Zielen des aktuellen Schritts
      Object.entries(trSteps[i].targetLevels).forEach(([key, value]) => {
        accumulatedStats[key] = value;
      });
      
      Object.entries(trSteps[i].targetBools).forEach(([key, boolVal]) => {
        if (boolVal) accumulatedStats[key] = 1;
      });

      // Inkrementiere TR-Count und addiere Orb-Gains
      accumulatedStats.trCount = newStats.trCount + 1;
      accumulatedStats.allTimeOrbs = newStats.allTimeOrbs + getStepOrbGains(trSteps[i]);
    }
  }

  // 5) WICHTIG: Explizit Array neu zuweisen, damit Vue die Änderungen erkennt
  nextTick(() => {
    const newTrSteps = [...trSteps];
    trSteps.splice(0, trSteps.length, ...newTrSteps);
  });
}


// Target Boolean für einen Schritt abrufen
function getTargetBool(stepId, boostKey) {
  const stepIndex = trSteps.findIndex(step => step.id === stepId);
  if (stepIndex !== -1) {
    return trSteps[stepIndex].targetBools[boostKey] || false;
  }
  return false;
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
  // TR-Count für diesen Schritt korrekt berechnen
  // Für den ersten Schritt: Aktuelle TR
  // Für weitere Schritte: TR aus den stats des Steps
  const currentTR = stepIndex === 0 ? 
    trCount.value : 
    (step.stats.trCount || 0);
  
  // All-Time Orbs bis zu diesem Punkt
  const stepAllTimeOrbs = stepIndex === 0 ? 
    allTimeOrbs.value : 
    step.stats.allTimeOrbs || 0;
  
  console.log(`Calculating requirement for Step ${stepIndex}, Current TR ${currentTR}, Next TR ${currentTR + 1}, AllTimeOrbs: ${stepAllTimeOrbs}`);
  
  // Immer für die NÄCHSTE TR berechnen (currentTR + 1)
  return calculateOrbRequirement(currentTR, stepAllTimeOrbs);
}

// Orb Gains für einen Schritt berechnen
function getStepOrbGains(step) {
  // Plan Stats für diesen Schritt zusammenstellen
  const planStats = { ...step.stats };
  
  // Numerische Boosts aus targetLevels
  Object.keys(step.targetLevels).forEach(key => {
    planStats[key] = step.targetLevels[key];
  });
  
  // Boolean Boosts aus targetBools
  // Hier müssen wir zwischen permanenten und nicht-permanenten Boosts unterscheiden
  Object.entries(step.targetBools).forEach(([key, isActive]) => {
    const boost = allBoosts.find(b => b.key === key);
    
    // Wenn der Boost nicht permanent ist und in diesem Step deaktiviert wurde,
    // dann explizit auf 0 setzen (auch wenn er in früheren TRs aktiviert war)
    if (boost && !boost.permanent) {
      planStats[key] = isActive ? 1 : 0;
    } 
    // Sonst normal verarbeiten (permanente Boosts oder aktive Boosts)
    else if (isActive) {
      planStats[key] = 1;
    }
  });
  
  // Orb-relevante Boosts filtern
  const orbCalcBoosts = allBoosts.filter(b => b.orbcalc);
  
  // Orb-Gewinne berechnen
  return calculateOrbGains(step.stats, planStats, orbCalcBoosts);
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
  
  // Detaillierte Logging-Informationen
  console.log(`%c[TR${stepIndex + 1} Requirement Check]`, 'background: #3e4c59; color: white; padding: 2px 5px; border-radius: 3px;');
  console.log(`  TR #${step.stats.trCount || trCount.value + stepIndex} (Step Index: ${stepIndex})`);
  console.log(`  Orb Requirement: ${orbReq.toLocaleString()}`);
  console.log(`  Orb Gains: ${orbGains.toLocaleString()}`);
  console.log(`  All-Time Orbs: ${(step.stats.allTimeOrbs || 0).toLocaleString()}`);
  console.log(`  Hours in TR: ${(step.targetLevels['hoursInTR'] || step.stats.hoursInTR || 0)}`);
  console.group('  Boost Levels:');
  
  // Alle relevanten Orb-Boosts loggen
  const orbCalcBoosts = allBoosts.filter(b => b.orbcalc);
  orbCalcBoosts.forEach(boost => {
    const key = boost.key;
    const targetLevel = step.targetLevels[key] !== undefined ? step.targetLevels[key] : step.stats[key] || 0;
    const multiplier = getBoostMultiplier(boost, targetLevel, {...step.stats, ...step.targetLevels});
    
    if (boost.type === 'boolean') {
      const isActive = step.targetBools[key] !== undefined ? step.targetBools[key] : !!(step.stats[key] || 0);
      console.log(`    - ${key}: ${isActive ? 'ON' : 'OFF'} (${multiplier ? '×' + multiplier.toFixed(2) : 'N/A'})`);
    } else {
      console.log(`    - ${key}: ${targetLevel} (${multiplier ? '×' + multiplier.toFixed(2) : 'N/A'})`);
    }
  });
  console.groupEnd();
  
  // Ergebnis der Prüfung
  const meetsRequirement = orbGains >= orbReq;
  console.log(`  Result: ${meetsRequirement ? '✅ MEETS REQUIREMENT' : '❌ DOES NOT MEET REQUIREMENT'} (Difference: ${(orbGains - orbReq).toLocaleString()})`);
  console.log('\n'); // Leerzeile für bessere Lesbarkeit

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

// Funktion zum Laden eines existierenden Plans
function initData() {
  try {
    error.value = null;
    
    // Zuerst alle Targets zurücksetzen
    trSteps.length = 0; // Leere die Steps-Liste
    
    // Datum und Zeit initialisieren
    initDateTimePicker();
    
    // Wenn wir im Edit-Modus sind, existierenden Plan laden
    if (props.editPlanId) {
      const existingPlan = trPlannerStore.getTRPlanById(props.editPlanId);
      
      if (existingPlan) {
        // Plan-Namen setzen
        planName.value = existingPlan.name;
        
        // Wenn TR Start-Zeit im Plan gespeichert ist, diese laden
        if (existingPlan.trStartDate) {
          trStartDate.value = existingPlan.trStartDate;
        }
        
        if (existingPlan.trStartTime) {
          trStartTime.value = existingPlan.trStartTime;
        }
        
        // TR-Count und AllTimeOrbs aus dem gespeicherten Plan übernehmen
        trCount.value = existingPlan.updatedStats?.trCount ?? props.currentStats?.trCount ?? 0;
        trCountDisplay.value = (existingPlan.updatedStats?.trCount ?? props.currentStats?.trCount ?? 0).toString();
        
        allTimeOrbs.value = existingPlan.updatedStats?.allTimeOrbs ?? props.currentStats?.allTimeOrbs ?? 0;
        allTimeOrbsDisplay.value = formatSuffixNotation(existingPlan.updatedStats?.allTimeOrbs ?? props.currentStats?.allTimeOrbs ?? 0);
        
        // Erster TR-Step mit den Basis-Daten
        const firstStep = {
          id: `step_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          targetLevels: {},
          targetBools: {},
          selectedForNextTR: existingPlan.selectedForNextTR ? 
                          [...existingPlan.selectedForNextTR] : 
                          ['hoursInTR'], // hoursInTR ist standardmäßig ausgewählt
          stats: { ...props.currentStats, trCount: trCount.value, allTimeOrbs: allTimeOrbs.value }
        };
        
        // Sicherstellen, dass hoursInTR immer in der Liste ist
        if (!firstStep.selectedForNextTR.includes('hoursInTR')) {
          firstStep.selectedForNextTR.push('hoursInTR');
        }
        
        // Target-Levels aus dem Plan übernehmen
        existingPlan.boosts.forEach(boost => {
          if (boost.type === 'number') {
            firstStep.targetLevels[boost.key] = boost.targetLevel;
          } else if (boost.type === 'boolean') {
            firstStep.targetBools[boost.key] = boost.targetState || true;
          }
        });
        
        // Step zur Liste hinzufügen
        trSteps.push(firstStep);
        
        // Falls TR-Chain vorhanden ist, diese auch laden
        if (existingPlan.trChain && Array.isArray(existingPlan.trChain) && existingPlan.trChain.length > 0) {
          // Schrittweise TR Chain laden und dabei fortlaufende Stats aufbauen
          let accumulatedStats = { ...firstStep.stats };
          
          // Ziellevel des ersten Schritts auch zu den akkumulierten Stats hinzufügen
          Object.entries(firstStep.targetLevels).forEach(([key, value]) => {
            accumulatedStats[key] = value;
          });
          
          // Boolean-Werte aus dem ersten Schritt übernehmen
          Object.entries(firstStep.targetBools).forEach(([key, value]) => {
            if (value) accumulatedStats[key] = 1;
          });
          
          // Erste TR-Orbs hinzufügen
          accumulatedStats.trCount += 1;
          accumulatedStats.allTimeOrbs += getStepOrbGains(firstStep);
          
          // Jetzt für jeden Folgeschritt in der Chain
          existingPlan.trChain.forEach((chainStep, index) => {
            // Neuen Schritt erstellen mit den akkumulierten Stats als Basis
            const newStep = {
              id: `step_chain_${Date.now()}_${Math.floor(Math.random() * 1000)}_${index}`,
              targetLevels: {},
              targetBools: {},
              selectedForNextTR: chainStep.selectedForNextTR || ['hoursInTR'],
              stats: { ...accumulatedStats } // Wichtig: Die progressiv aufgebauten Stats verwenden
            };
            
            // Sicherstellen, dass hoursInTR immer in der Liste ist
            if (!newStep.selectedForNextTR.includes('hoursInTR')) {
              newStep.selectedForNextTR.push('hoursInTR');
            }
            
            // Boosts aus der Chain übernehmen
            chainStep.boosts.forEach(boost => {
              if (boost.type === 'number') {
                newStep.targetLevels[boost.key] = boost.targetLevel;
              } else if (boost.type === 'boolean') {
                newStep.targetBools[boost.key] = boost.targetState || true;
              }
            });
            
            // Step zur Liste hinzufügen
            trSteps.push(newStep);
            
            // Für den nächsten Schritt: Stats aktualisieren
            Object.entries(newStep.targetLevels).forEach(([key, value]) => {
              accumulatedStats[key] = value;
            });
            
            Object.entries(newStep.targetBools).forEach(([key, value]) => {
              if (value) accumulatedStats[key] = 1;
            });
            
            // TR-Orbs für den nächsten Schritt hinzufügen
            accumulatedStats.trCount += 1;
            accumulatedStats.allTimeOrbs += getStepOrbGains(newStep);
          });
        }
      }
    } else {
      // Bei Neuanlage Standardwerte setzen
      planName.value = `TR Plan ${new Date().toLocaleDateString()}`;
      trCount.value = props.currentStats?.trCount || 0;
      trCountDisplay.value = (props.currentStats?.trCount || 0).toString();
      allTimeOrbs.value = props.currentStats?.allTimeOrbs || 0;
      allTimeOrbsDisplay.value = formatSuffixNotation(props.currentStats?.allTimeOrbs || 0);
      
      // Erster TR-Step mit den Basis-Daten
      const firstStep = {
        id: `step_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        targetLevels: {},
        targetBools: {},
        selectedForNextTR: ['hoursInTR'], // hoursInTR ist immer vorausgewählt
        stats: { ...props.currentStats, trCount: trCount.value, allTimeOrbs: allTimeOrbs.value }
      };
      
      // Step zur Liste hinzufügen
      trSteps.push(firstStep);
    }
    
    searchQuery.value = '';
  } catch (err) {
    console.error('Error initializing plan data:', err);
    error.value = `Failed to initialize: ${err.message}`;
  }
}

// Korrektur in der createPlan-Funktion
function createPlan() {
  if (!isPlanValid.value) return;
  
  // Wir nehmen den ersten TR-Step als Basis für den Plan
  const firstStep = trSteps[0];
  
  // Aktualisierte Stats für den Plan
  const updatedStats = {
    ...props.currentStats,
    trCount: trCount.value,
    allTimeOrbs: allTimeOrbs.value
  };
  
  const boostDetails = [];
  
  // Numerische Boosts aus dem ersten Schritt
  Object.keys(firstStep.targetLevels || {}).forEach(key => {
    const boost = allBoosts.find(b => b.key === key);
    if (!boost) return;
    
    const currentLevel = props.currentStats[key] || 0;
    const targetLevel = firstStep.targetLevels[key];
    
    // Nur Boosts mit tatsächlicher Änderung hinzufügen
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
  
  // Boolean Boosts aus dem ersten Schritt
  Object.entries(firstStep.targetBools || {}).forEach(([key, isActive]) => {
    // WICHTIG: Auch Boosts hinzufügen, die bereits aktiv sind
    if (!isActive) return; // Nur aktive Boosts berücksichtigen
    
    const boost = allBoosts.find(b => b.key === key);
    if (!boost) return;
    
    const currentState = !!(props.currentStats[key] || 0);
    
    // ÄNDERUNG: ALLE aktiven Boolean-Boosts hinzufügen, unabhängig vom aktuellen Zustand
    boostDetails.push({
      key,
      type: 'boolean',
      label: boost.label || key,
      currentState,
      targetState: true
    });
  });
  
  // Ergebnisse der Berechnung hinzufügen
  const calculatedResults = {
    orbRequirement: getStepOrbRequirement(firstStep, 0),
    orbGains: getStepOrbGains(firstStep),
    campaignFragGains: getStepFragGains(firstStep),
    requirementMet: getStepRequirementMet(firstStep, 0),
    orbsNeeded: getStepRequirementMet(firstStep, 0) ? 0 : getStepOrbRequirement(firstStep, 0) - getStepOrbsAvailable(firstStep)
  };
  
  // Der erste TR muss immer gültig sein
  if (!getStepRequirementMet(firstStep, 0)) {
    showAlert("First TR requirements not met. Please adjust your Stats to meet the requirements.", 'Warning', 'warning');
    return;
  }
  
  // Finde nur die gültigen TR-Schritte für die Chain
  const validChainSteps = [];
  let allRequirementsMet = true;
  let validOrbsAccumulated = allTimeOrbs.value + calculatedResults.orbGains;
  let validTrCount = trCount.value + 1;
  
  // Prüfe jeden Schritt in der Chain
  if (trSteps.length > 1) {
    for (let i = 1; i < trSteps.length; i++) {
      // Wenn vorherige TRs nicht erfüllt waren, brechen wir ab
      if (!allRequirementsMet) break;
      
      const step = trSteps[i];
      
      // Sicherstellen, dass step.stats existiert
      if (!step || !step.stats) {
        console.error(`Step ${i} or its stats are undefined`, step);
        allRequirementsMet = false;
        break;
      }
      
      // Aktualisiere die Stats für diesen Schritt basierend auf den gültigen vorherigen TRs
      const adjustedStep = {
        ...step,
        stats: {
          ...step.stats,
          trCount: validTrCount,
          allTimeOrbs: validOrbsAccumulated
        }
      };
      
      // Prüfe ob dieser Schritt mit den angepassten Stats gültig ist
      const stepIsValid = getStepRequirementMet(adjustedStep, validChainSteps.length + 1);
      
      if (stepIsValid) {
        // Boosts für diesen Schritt zusammenstellen
        const stepBoosts = [];
        
        // Numerische Boosts
        Object.keys(step.targetLevels || {}).forEach(key => {
          const boost = allBoosts.find(b => b.key === key);
          if (!boost) return;
          
          try {
            // Der vorherige Schritt kann entweder der letzte gültige Schritt in der Chain 
            // oder der erste Schritt sein
            const prevStep = validChainSteps.length > 0 
              ? validChainSteps[validChainSteps.length - 1] 
              : firstStep;
            
            // Sicherstellen, dass prevStep und seine Eigenschaften existieren
            if (!prevStep) {
              console.error('Previous step is undefined');
              return;
            }
            
            // Sicherstellen dass targetLevels und stats existieren
            const prevStepTargetLevels = prevStep.targetLevels || {};
            const prevStepStats = prevStep.stats || {};
            const prevStepLevel = prevStepTargetLevels[key] || prevStepStats[key] || 0;
            const targetLevel = step.targetLevels[key] || 0;
            
            // hoursInTR immer speichern, auch wenn der Wert gleich bleibt
            if (key === 'hoursInTR') {
              stepBoosts.push({
                key,
                type: 'number',
                label: boost.label || key,
                currentLevel: prevStepLevel,
                targetLevel,
                remainingLevels: targetLevel - prevStepLevel
              });
            }
            // Für alle anderen numerischen Boosts nur speichern, wenn sie sich erhöht haben
            else if (targetLevel > prevStepLevel) {
              stepBoosts.push({
                key,
                type: 'number',
                label: boost.label || key,
                currentLevel: prevStepLevel,
                targetLevel,
                remainingLevels: targetLevel - prevStepLevel
              });
            }
          } catch (e) {
            console.error(`Error processing numeric boost ${key}:`, e);
          }
        });
        
        // Boolean Boosts
        Object.entries(step.targetBools || {}).forEach(([key, isActive]) => {
          if (!isActive) return;
          
          const boost = allBoosts.find(b => b.key === key);
          if (!boost) return;
          
          try {
            // Der vorherige Schritt kann entweder der letzte gültige Schritt in der Chain 
            // oder der erste Schritt sein
            const prevStep = validChainSteps.length > 0 
              ? validChainSteps[validChainSteps.length - 1] 
              : firstStep;
            
            // Sicherstellen, dass prevStep und seine Eigenschaften existieren
            if (!prevStep) {
              console.error('Previous step is undefined');
              return;
            }
            
            // Boolean-Boosts korrekt hinzufügen
            const prevStepBoolean = prevStep.targetBools[key] || false;
            
            // WICHTIG: ALLE aktiven Boolean-Boosts hinzufügen - das ist der Fix
            stepBoosts.push({
              key,
              type: 'boolean',  // Typ muss 'boolean' sein, nicht 'number'
              label: boost.label || key,
              currentState: prevStepBoolean,
              targetState: true  // Immer auf true setzen, wenn isActive true ist
            });
          } catch (e) {
            console.error(`Error processing boolean boost ${key}:`, e);
          }
        });
        
        // Ergebnisse für diesen Schritt
        const stepResults = {
          orbRequirement: getStepOrbRequirement(adjustedStep, validChainSteps.length + 1),
          orbGains: getStepOrbGains(adjustedStep),
          campaignFragGains: getStepFragGains(adjustedStep),
          requirementMet: true // Der Schritt ist gültig, also sind die Anforderungen erfüllt
        };
        
        // Schritt zur Chain hinzufügen mit alle notwendigen Eigenschaften
        const validChainStep = {
          trNumber: validTrCount,
          boosts: stepBoosts,
          results: stepResults,
          selectedForNextTR: Array.isArray(step.selectedForNextTR) ? [...step.selectedForNextTR] : ['hoursInTR']
        };
        
        validChainSteps.push(validChainStep);
        
        // Stats für den nächsten Schritt aktualisieren
        validOrbsAccumulated += stepResults.orbGains;
        validTrCount += 1;
      } else {
        // Wenn ein Schritt nicht gültig ist, brechen wir ab
        allRequirementsMet = false;
        break;
      }
    }
  }
  
  // Plan-Objekt erstellen mit Datums-/Zeitinformationen und selectedForNextTR
  const planData = {
    name: planName.value.trim(),
    trStartDate: trStartDate.value,
    trStartTime: trStartTime.value,
    boosts: boostDetails,
    updatedStats: updatedStats,
    results: calculatedResults,
    trChain: validChainSteps,  // Nur gültige TRs speichern
    selectedForNextTR: Array.isArray(firstStep.selectedForNextTR) ? 
                       [...firstStep.selectedForNextTR] : 
                       ['hoursInTR'], // Sicherstellen dass selectedForNextTR immer ein Array ist
    progress: {
      completed: false,
      lastUpdated: new Date().toISOString()
    }
  };
  
  let planId;
  
  // Bei Edit: bestehenden Plan aktualisieren
  if (props.editPlanId) {
    // Originalplan holen, um unveränderte Daten zu erhalten
    const originalPlan = trPlannerStore.getTRPlanById(props.editPlanId);
    
    // Neuen Plan erstellen, der den Original-Plan um die geänderten Daten erweitert
    const updatedPlan = {
      ...originalPlan,
      ...planData,
      updatedAt: new Date().toISOString()
    };
    
    // Plan im Store aktualisieren
    trPlannerStore.updateTRPlan(props.editPlanId, updatedPlan);
    planId = props.editPlanId;
  } 
  // Neuen Plan erstellen
  else {
    planId = `trplan_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newPlan = {
      id: planId,
      createdAt: new Date().toISOString(),
      ...planData
    };
    
    // Im Store speichern
    trPlannerStore.addTRPlan(newPlan);
  }
  
  // Wenn eine Warnung angezeigt werden soll, dass nicht alle TRs gültig waren
  if (trSteps.length > 1 && validChainSteps.length < trSteps.length - 1) {
    showAlert(
      `Only ${validChainSteps.length + 1} of ${trSteps.length} TRs were saved. Invalid TRs have been removed from the plan.`, 
      'Warning', 
      'warning'
    );
    
    // Event emittieren
    emit('save', planId);

    return; 
  }

  // Nur wenn keine Warnung angezeigt wird, direkt schließen
  emit('save', planId);
  cancelAndClose();
}

function cancelAndClose() {
  emit('close');
}

function handleAlertClose() {
  showAlertDialog.value = false;
  
  // Prüfen, ob wir uns im Speichervorgang befinden
  if (alertType.value === 'warning' && alertTitle.value === 'Warning') {
    // Hier das Modal schließen
    cancelAndClose();
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
    // Name setzen
    planName.value = copyData.name;
    
    // Datum/Zeit setzen
    trStartDate.value = copyData.trStartDate || '';
    trStartTime.value = copyData.trStartTime || '';
    
    // TR-Count und AllTimeOrbs aus dem kopierten Plan übernehmen
    trCount.value = copyData.updatedStats?.trCount ?? props.currentStats?.trCount ?? 0;
    trCountDisplay.value = (copyData.updatedStats?.trCount ?? props.currentStats?.trCount ?? 0).toString();
    
    allTimeOrbs.value = copyData.updatedStats?.allTimeOrbs ?? props.currentStats?.allTimeOrbs ?? 0;
    allTimeOrbsDisplay.value = formatSuffixNotation(copyData.updatedStats?.allTimeOrbs ?? props.currentStats?.allTimeOrbs ?? 0);
    
    // Zuerst alle vorherigen Steps löschen
    trSteps.length = 0;
    
    // Erster TR-Step mit den Basis-Daten
    const firstStep = {
      id: `step_copy_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      targetLevels: {},
      targetBools: {},
      // WICHTIG: Hier die selectedForNextTR korrekt übernehmen
      selectedForNextTR: copyData.selectedForNextTR && Array.isArray(copyData.selectedForNextTR) 
        ? [...copyData.selectedForNextTR] 
        : ['hoursInTR'],
      stats: { ...props.currentStats, trCount: trCount.value, allTimeOrbs: allTimeOrbs.value }
    };
    
    // Sicherstellen, dass hoursInTR immer in der Liste ist
    if (!firstStep.selectedForNextTR.includes('hoursInTR')) {
      firstStep.selectedForNextTR.push('hoursInTR');
    }
    
    // Target-Levels aus dem kopierten Plan übernehmen
    if (copyData.boosts && Array.isArray(copyData.boosts)) {
      copyData.boosts.forEach(boost => {
        if (boost.type === 'number') {
          firstStep.targetLevels[boost.key] = boost.targetLevel;
        } else if (boost.type === 'boolean') {
          firstStep.targetBools[boost.key] = boost.targetState || true;
        }
      });
    }
    
    // Step zur Liste hinzufügen
    trSteps.push(firstStep);
    
    // Falls TR-Chain vorhanden ist, diese auch laden
    if (copyData.trChain && Array.isArray(copyData.trChain) && copyData.trChain.length > 0) {
      // Schrittweise TR Chain laden und dabei fortlaufende Stats aufbauen
      let accumulatedStats = { ...firstStep.stats };
      
      // Ziellevel des ersten Schritts auch zu den akkumulierten Stats hinzufügen
      Object.entries(firstStep.targetLevels).forEach(([key, value]) => {
        accumulatedStats[key] = value;
      });
      
      // Boolean-Werte aus dem ersten Schritt übernehmen
      Object.entries(firstStep.targetBools).forEach(([key, value]) => {
        if (value) accumulatedStats[key] = 1;
      });
      
      // Erste TR-Orbs hinzufügen
      accumulatedStats.trCount += 1;
      accumulatedStats.allTimeOrbs += getStepOrbGains(firstStep);
      
      // Jetzt für jeden Folgeschritt in der Chain
      copyData.trChain.forEach((chainStep, index) => {
        // Neuen Schritt erstellen mit den akkumulierten Stats als Basis
        const newStep = {
          id: `step_chain_copy_${Date.now()}_${Math.floor(Math.random() * 1000)}_${index}`,
          targetLevels: {},
          targetBools: {},
          // WICHTIG: Hier die selectedForNextTR korrekt übernehmen
          selectedForNextTR: chainStep.selectedForNextTR && Array.isArray(chainStep.selectedForNextTR) 
            ? [...chainStep.selectedForNextTR] 
            : ['hoursInTR'],
          stats: { ...accumulatedStats } // Wichtig: Die progressiv aufgebauten Stats verwenden
        };
        
        // Sicherstellen, dass hoursInTR immer in der Liste ist
        if (!newStep.selectedForNextTR.includes('hoursInTR')) {
          newStep.selectedForNextTR.push('hoursInTR');
        }
        
        // Boosts aus der Chain übernehmen
        if (chainStep.boosts && Array.isArray(chainStep.boosts)) {
          chainStep.boosts.forEach(boost => {
            if (boost.type === 'number') {
              newStep.targetLevels[boost.key] = boost.targetLevel;
            } else if (boost.type === 'boolean') {
              newStep.targetBools[boost.key] = boost.targetState || true;
            }
          });
        }
        
        // Step zur Liste hinzufügen
        trSteps.push(newStep);
        
        // Für den nächsten Schritt: Stats aktualisieren
        Object.entries(newStep.targetLevels).forEach(([key, value]) => {
          accumulatedStats[key] = value;
        });
        
        Object.entries(newStep.targetBools).forEach(([key, value]) => {
          if (value) accumulatedStats[key] = 1;
        });
        
        // TR-Orbs für den nächsten Schritt hinzufügen
        accumulatedStats.trCount += 1;
        accumulatedStats.allTimeOrbs += getStepOrbGains(newStep);
      });
    }
    
    console.log('Copy data initialized successfully', {
      steps: trSteps.length,
      firstStepTargets: Object.keys(trSteps[0]?.targetLevels || {}).length,
      selectedForNextTR: trSteps[0]?.selectedForNextTR
    });
  } catch (error) {
    console.error('Error initializing copy data:', error);
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

function showAlert(message, title = 'TR Planner', type = 'info') {
  alertMessage.value = message;
  alertTitle.value = title;
  alertType.value = type;
  showAlertDialog.value = true;
}

watch(trSteps, () => {
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
</style>