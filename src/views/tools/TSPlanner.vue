<template>
  <div>
    <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
      <div class="bg-gray-900/95 rounded-xl p-3 sm:p-5">
        <!-- Header -->
        <h2 class="text-xl sm:text-2xl font-bold mb-3 text-center text-white">
          <span>Trait Sphere Planner</span>
        </h2>
        
        <!-- Milestone & Core Settings -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-3">
          <div class="header p-2 flex justify-between items-center">
            <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
              <IconSettings size="16" class="mr-1.5 text-blue-400" />
              Antimatter Core Settings
            </h3>
            
            <button 
              @click="resetSettings" 
              class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconRefresh size="12" class="mr-1" />
              Reset
            </button>
          </div>
          
          <div class="p-2 sm:p-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <!-- Start of TR Milestones -->
              <div class="bg-gray-900/60 rounded-lg p-2 border border-gray-700/50">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-white text-xs sm:text-sm">Start of TR Milestones</span>
                </div>
                
                <!-- Cell Milestone -->
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                      <img src="@/assets/general/cells.png" alt="Cells" class="w-4 h-4" />
                    </div>
                    <span class="text-xs sm:text-sm text-gray-300">Cell Milestones</span>
                  </div>
                  <ToolValueControls
                    :value="startCellMilestones"
                    @update:value="startCellMilestones = $event"
                    :minValue="0"
                    :maxValue="99"
                    :step="1"
                    :fastStep="5"
                    value-class="text-green-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
                
                <!-- MP Milestone -->
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                      <img src="@/assets/general/mp.png" alt="MP" class="w-4 h-4" />
                    </div>
                    <span class="text-xs sm:text-sm text-gray-300">MP Milestones</span>
                  </div>
                  <ToolValueControls
                    :value="startMPMilestones"
                    @update:value="startMPMilestones = $event"
                    :minValue="0"
                    :maxValue="99"
                    :step="1"
                    :fastStep="5"
                    value-class="text-red-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
                
                <!-- RP Milestone -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                      <img src="@/assets/general/rp.png" alt="RP" class="w-4 h-4" />
                    </div>
                    <span class="text-xs sm:text-sm text-gray-300">RP Milestones</span>
                  </div>
                  <ToolValueControls
                    :value="startRPMilestones"
                    @update:value="startRPMilestones = $event"
                    :minValue="0"
                    :maxValue="99"
                    :step="1"
                    :fastStep="5"
                    value-class="text-amber-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
              </div>
              
              <!-- Current Milestones -->
              <div class="bg-gray-900/60 rounded-lg p-2 border border-gray-700/50">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-white text-xs sm:text-sm">Current Milestones</span>
                </div>
                
                <!-- Cell Milestone -->
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                      <img src="@/assets/general/cells.png" alt="Cells" class="w-4 h-4" />
                    </div>
                    <span class="text-xs sm:text-sm text-gray-300">Cell Milestones</span>
                  </div>
                  <ToolValueControls
                    :value="currentCellMilestones"
                    @update:value="currentCellMilestones = $event"
                    :minValue="startCellMilestones"
                    :maxValue="99"
                    :step="1"
                    :fastStep="5"
                    value-class="text-green-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
                
                <!-- MP Milestone -->
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                      <img src="@/assets/general/mp.png" alt="MP" class="w-4 h-4" />
                    </div>
                    <span class="text-xs sm:text-sm text-gray-300">MP Milestones</span>
                  </div>
                  <ToolValueControls
                    :value="currentMPMilestones"
                    @update:value="currentMPMilestones = $event"
                    :minValue="startMPMilestones"
                    :maxValue="99"
                    :step="1"
                    :fastStep="5"
                    value-class="text-red-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
                
                <!-- RP Milestone -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                      <img src="@/assets/general/rp.png" alt="RP" class="w-4 h-4" />
                    </div>
                    <span class="text-xs sm:text-sm text-gray-300">RP Milestones</span>
                  </div>
                  <ToolValueControls
                    :value="currentRPMilestones"
                    @update:value="currentRPMilestones = $event"
                    :minValue="startRPMilestones"
                    :maxValue="99"
                    :step="1"
                    :fastStep="5"
                    value-class="text-amber-400 font-medium"
                    :autoEdit="true"
                    class="ml-2"
                  />
                </div>
              </div>
            </div>
            
            <!-- Core Summary -->
            <div class="mt-3 bg-purple-900/30 rounded-lg p-2 border border-purple-800/50">
              <div class="flex justify-between items-center">
                <span class="text-xs sm:text-sm text-gray-200">Available Antimatter Cores:</span>
                <div class="flex items-center">
                  <!-- Current Cores (during TR) -->
                  <div class="flex items-center mr-3">
                    <span class="text-xs sm:text-sm text-gray-400 mr-1.5">Current:</span>
                    <span class="text-purple-300 font-medium">{{ currentCores }}</span>
                  </div>
                  
                  <!-- After TR -->
                  <div class="flex items-center">
                    <span class="text-xs sm:text-sm text-gray-400 mr-1.5">After TR:</span>
                    <span class="text-purple-300 font-medium">{{ totalCores }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Trait Sphere Grid -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-3">
          <div class="header p-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div class="flex items-center justify-between w-full sm:w-auto">
              <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
                <IconCircle size="16" class="mr-1.5 text-purple-400" />
                Trait Spheres
              </h3>
              
              <span class="text-xs text-gray-300 sm:hidden">Cores Used: {{ usedCores }} / {{ currentCores }}</span>
            </div>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <span class="text-xs text-gray-300 hidden sm:inline">Cores Used: {{ usedCores }} / {{ currentCores }}</span>
              
              <div class="flex items-center gap-2">
                <!-- Copy Selection Button -->
                <button 
                  @click="copySelection"
                  :disabled="selectedTraitSpheres.length === 0"
                  :class="[
                    'px-2 py-0.5 text-xs rounded-lg flex items-center transition-all duration-200',
                    selectedTraitSpheres.length > 0 
                      ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <IconCopy size="12" class="mr-1" />
                  {{ copyButtonText }}
                </button>
                
                <!-- Presets Button -->
                <button 
                  @click="showPresetsModal = true"
                  class="bg-purple-700 hover:bg-purple-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
                >
                  <IconTarget size="12" class="mr-1" />
                  Presets
                </button>

                <button 
                  @click="clearSelection" 
                  class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
                >
                  <IconTrash size="12" class="mr-1" />
                  Clear
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-2 sm:p-3">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
              <!-- TS Descriptions Panel (Links) -->
              <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
                <h4 class="text-sm font-semibold text-white mb-2 flex items-center">
                  <IconCircle size="14" class="mr-1.5 text-purple-400" />
                  Trait Sphere Effects
                </h4>
                
                <div class="space-y-0.5">
                  <div 
                    v-for="sphere in availableTraitSpheres" 
                    :key="sphere.id"
                    :class="[
                      'p-1.5 rounded border transition-all duration-200 cursor-pointer',
                      isSelected(sphere.id) 
                        ? 'bg-purple-900/50 border-purple-500/50 shadow-md' 
                        : 'bg-gray-800/30 border-gray-600/30 hover:border-gray-500/50'
                    ]"
                    @click="toggleSphere(sphere)"
                  >
                    <div class="grid grid-cols-16 gap-2 items-center">
                      <!-- TS# Column -->
                      <div class="col-span-2 flex items-center">
                        <span :class="[
                          'text-xs font-medium',
                          isSelected(sphere.id) ? 'text-purple-300' : 'text-gray-300'
                        ]">
                          TS#{{ sphere.id }}
                        </span>
                      </div>
                      
                      <!-- Effect Dot Column -->
                      <div class="col-span-1 flex justify-center">
                        <div :class="[
                          'w-1.5 h-1.5 rounded-full',
                          getSphereEffectColorClass(sphere.effect)
                        ]"></div>
                      </div>
                      
                      <!-- Description Column -->
                      <div class="col-span-11">
                        <p :class="[
                          'text-xs leading-tight',
                          isSelected(sphere.id) ? 'text-gray-200' : 'text-gray-400'
                        ]">
                          {{ sphere.description }}
                        </p>
                      </div>
                      
                      <!-- Price Column -->
                      <div class="col-span-2 flex items-center justify-end">
                        <span v-if="sphere.price > 0" :class="[
                          'text-xs font-medium mr-0.5',
                          isSelected(sphere.id) ? 'text-purple-300' : 'text-gray-400'
                        ]">
                          {{ sphere.price }}
                        </span>
                        <IconHexagon v-if="sphere.price > 0" size="6" :class="[
                          isSelected(sphere.id) ? 'text-purple-400' : 'text-gray-500'
                        ]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Trait Sphere Grid (Mitte) -->
              <div class="lg:col-span-2">
                <!-- Container für das Grid mit begrenzter Breite -->
                <div class="max-w-xl mx-auto">
                  <!-- Trait Sphere Grid Layout using our data -->
                  <div class="grid grid-cols-7 gap-1">
                    <template v-for="row in 7" :key="`row-${row}`">
                      <template v-for="col in 7" :key="`cell-${row}-${col}`">
                        <!-- Only render if there's a sphere or if it's not empty -->
                        <template v-if="getSphereAtPosition(col-1, row-1)">
                          <div 
                            v-if="getSphereAtPosition(col-1, row-1).id >= 0"
                            :class="sphereClasses(getSphereAtPosition(col-1, row-1))"
                            @click="toggleSphere(getSphereAtPosition(col-1, row-1))"
                          >
                            <!-- Sphere Icon -->
                            <div :class="sphereIconClasses(getSphereAtPosition(col-1, row-1))">
                              <!-- Lock icon for locked trait spheres -->
                              <template v-if="getSphereAtPosition(col-1, row-1).effect === 'locked'">
                                <IconLock size="14" class="text-gray-400" />
                              </template>
                              <template v-else>
                                <div :class="innerSphereClasses(getSphereAtPosition(col-1, row-1))"></div>
                              </template>
                            </div>
                            
                            <!-- Sphere Info -->
                            <div class="sphere-info mt-1 text-center h-8 flex flex-col justify-center">
                              <div class="text-[0.7rem] text-gray-300">
                                <span>TS#{{ getSphereAtPosition(col-1, row-1).id }}</span>
                              </div>
                              <div class="flex items-center justify-center min-h-[12px]">
                                <template v-if="getSphereAtPosition(col-1, row-1).price > 0">
                                  <span :class="priceTextClasses(getSphereAtPosition(col-1, row-1))">
                                    {{ getSphereAtPosition(col-1, row-1).price }}
                                  </span>
                                  <IconHexagon size="6" :class="hexagonIconClasses(getSphereAtPosition(col-1, row-1))" />
                                </template>
                              </div>
                            </div>
                          </div>
                          <!-- Empty cell (no rendering) -->
                          <div v-else class="empty-cell"></div>
                        </template>
                        <template v-else>
                          <div class="empty-cell"></div>
                        </template>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
              
              <!-- LP Stats Panel (Rechts) -->
              <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
                <h4 class="text-sm font-semibold text-white mb-3 flex items-center">
                  <img src="@/assets/general/lp.png" alt="LP" class="w-4 h-4 mr-2" />
                  LP Statistics
                </h4>
                
                <!-- Player Level -->
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-300">Player Level</span>
                  <ToolValueControls
                    :value="playerLevel"
                    @update:value="playerLevel = $event"
                    :minValue="0"
                    :maxValue="9999"
                    :step="1"
                    :fastStep="10"
                    value-class="text-yellow-400 font-medium text-xs"
                    :autoEdit="true"
                  />
                </div>
                
                <!-- Research Levels -->
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-300">Research Levels</span>
                  <ToolValueControls
                    :value="researchLevels"
                    @update:value="researchLevels = $event"
                    :minValue="0"
                    :maxValue="9999"
                    :step="1"
                    :fastStep="10"
                    value-class="text-blue-400 font-medium text-xs"
                    :autoEdit="true"
                  />
                </div>
                
                <!-- LP Achievements -->
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-300">LP Achievements</span>
                  <ToolValueControls
                    :value="lpAchievements"
                    @update:value="lpAchievements = $event"
                    :minValue="0"
                    :maxValue="9999"
                    :step="1"
                    :fastStep="5"
                    value-class="text-green-400 font-medium text-xs"
                    :autoEdit="true"
                  />
                </div>
                
                <!-- Ship Evolutions -->
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs text-gray-300">Ship Evolutions</span>
                  <ToolValueControls
                    :value="shipEvolutions"
                    @update:value="shipEvolutions = $event"
                    :minValue="0"
                    :maxValue="99"
                    :step="1"
                    :fastStep="5"
                    value-class="text-purple-400 font-medium text-xs"
                    :autoEdit="true"
                  />
                </div>
                
                <!-- LP Calculation Table -->
                <div class="border-t border-gray-600 pt-3">
                  <div class="text-xs text-gray-300 mb-2 font-medium">LP Breakdown:</div>
                  
                  <div class="overflow-hidden">
                    <table class="w-full text-xs">
                      <thead>
                        <tr class="text-gray-400">
                          <th class="text-left py-1">Source</th>
                          <th class="text-right py-1">LP</th>
                          <th class="text-right py-1">Multi</th>
                        </tr>
                      </thead>
                      <tbody class="space-y-1">
                        <!-- TS#2 -->
                        <tr :class="isSelected(2) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            isSelected(2) ? 'text-yellow-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#2
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            isSelected(2) ? 'text-yellow-300 font-medium' : 'text-yellow-300'
                          ]">
                            +{{ lpFromPlayerLevel }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.6rem]',
                            isSelected(2) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromPlayerLevelMultiplier) }}
                          </td>
                        </tr>
                        
                        <!-- TS#8 -->
                        <tr :class="isSelected(8) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            isSelected(8) ? 'text-blue-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#8 
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            isSelected(8) ? 'text-blue-300 font-medium' : 'text-blue-300'
                          ]">
                            +{{ lpFromResearch }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.6rem]',
                            isSelected(8) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromResearchMultiplier) }}
                          </td>
                        </tr>
                        
                        <!-- TS#15 -->
                        <tr :class="isSelected(15) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            isSelected(15) ? 'text-purple-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#15 
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            isSelected(15) ? 'text-purple-300 font-medium' : 'text-purple-300'
                          ]">
                            +{{ lpFromShipEvolutions }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.6rem]',
                            isSelected(15) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromShipEvolutionsMultiplier) }}
                          </td>
                        </tr>
                        
                        <!-- TS#16 -->
                        <tr :class="isSelected(16) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            isSelected(16) ? 'text-green-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#16 
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            isSelected(16) ? 'text-green-300 font-medium' : 'text-green-300'
                          ]">
                            +{{ lpFromAchievements }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.6rem]',
                            isSelected(16) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromAchievementsMultiplier) }}
                          </td>
                        </tr>
                        
                        <!-- TS#19 -->
                        <tr :class="isSelected(19) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            isSelected(19) ? 'text-yellow-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#19 
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            isSelected(19) ? 'text-yellow-300 font-medium' : 'text-yellow-300'
                          ]">
                            +{{ lpFromPlayerLevelTS19 }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.6rem]',
                            isSelected(19) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromPlayerLevelTS19Multiplier) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <!-- Total Section -->
                    <div class="border-t border-gray-600 pt-2 mt-2">
                      <table class="w-full text-xs">
                        <tbody>
                          <tr class="font-medium">
                            <td class="text-white py-0.5">Total LP</td>
                            <td class="text-yellow-400 text-right py-0.5">{{ totalLPSelected }}</td>
                            <td class="text-right py-0.5"></td>
                          </tr>
                          <tr class="font-medium">
                            <td class="text-white py-0.5">Combined Multi</td>
                            <td class="text-right py-0.5"></td>
                            <td class="text-green-400 text-right py-0.5">x{{ formatMultiplier(combinedMultiplierSelected) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Presets Modal -->
    <PresetsModal
      :isVisible="showPresetsModal"
      :availableCores="currentCores"
      @close="showPresetsModal = false"
      @select-preset="applyPreset"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { 
  IconSettings, 
  IconRefresh, 
  IconTrash,
  IconCircle,
  IconHexagon,
  IconLock,
  IconTarget,
  IconCopy,
  IconStar
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import PresetsModal from '@/components/common/ts-planner/PresetsModal.vue';
import { 
  traitSpheres, 
  getTraitSphereById, 
  getTraitSphereAtPosition,
  isAdjacentToAnySelected
} from '@/constants/ts-planner';

// State for milestone settings
const startCellMilestones = ref(0);
const startMPMilestones = ref(0);
const startRPMilestones = ref(0);

const currentCellMilestones = ref(0);
const currentMPMilestones = ref(0);
const currentRPMilestones = ref(0);

const selectedTraitSpheres = ref([1]);

const showPresetsModal = ref(false);

// New LP-related state
const playerLevel = ref(0);
const researchLevels = ref(0);
const lpAchievements = ref(0);
const shipEvolutions = ref(0);

// LP calculations - mit isSelected Bedingungen für aktive Berechnung
const lpFromPlayerLevelActive = computed(() => {
  return isSelected(2) ? Math.floor(playerLevel.value / 10) * 4 : 0;
});

const lpFromResearchActive = computed(() => {
  return isSelected(8) ? researchLevels.value : 0;
});

const lpFromShipEvolutionsActive = computed(() => {
  return isSelected(15) ? shipEvolutions.value * 30 : 0;
});

const lpFromAchievementsActive = computed(() => {
  return isSelected(16) ? (lpAchievements.value + 30) : 0;
});

const lpFromPlayerLevelTS19Active = computed(() => {
  return isSelected(19) ? playerLevel.value : 0;
});

// Total LP nur von ausgewählten TS
const totalLPSelected = computed(() => {
  return lpFromPlayerLevelActive.value + 
         lpFromResearchActive.value + 
         lpFromShipEvolutionsActive.value + 
         lpFromAchievementsActive.value + 
         lpFromPlayerLevelTS19Active.value;
});

// Kombinierter Multiplikator basierend auf ausgewählten TS
const combinedMultiplierSelected = computed(() => {
  return Math.pow(2, Math.floor(totalLPSelected.value / 10));
});

// Die ursprünglichen LP-Berechnungen ohne isSelected Bedingungen für die Anzeige
const lpFromPlayerLevel = computed(() => {
  return Math.floor(playerLevel.value / 10) * 4;
});

const lpFromResearch = computed(() => {
  return researchLevels.value;
});

const lpFromShipEvolutions = computed(() => {
  return shipEvolutions.value * 30;
});

const lpFromAchievements = computed(() => {
  return lpAchievements.value + 30;
});

const lpFromPlayerLevelTS19 = computed(() => {
  return playerLevel.value;
});

// FEHLENDE MULTIPLIKATOR COMPUTED PROPERTIES
const lpFromPlayerLevelMultiplier = computed(() => {
  return Math.pow(2, Math.floor(lpFromPlayerLevel.value / 10));
});

const lpFromResearchMultiplier = computed(() => {
  return Math.pow(2, Math.floor(lpFromResearch.value / 10));
});

const lpFromShipEvolutionsMultiplier = computed(() => {
  return Math.pow(2, Math.floor(lpFromShipEvolutions.value / 10));
});

const lpFromAchievementsMultiplier = computed(() => {
  return Math.pow(2, Math.floor(lpFromAchievements.value / 10));
});

const lpFromPlayerLevelTS19Multiplier = computed(() => {
  return Math.pow(2, Math.floor(lpFromPlayerLevelTS19.value / 10));
});

// Behalte das ursprüngliche totalLP für andere Verwendungen
const totalLP = computed(() => {
  return lpFromPlayerLevel.value + 
         lpFromResearch.value + 
         lpFromShipEvolutions.value + 
         lpFromAchievements.value + 
         lpFromPlayerLevelTS19.value;
});

// Formatierungsfunktion für Multiplikatoren
function formatMultiplier(value) {
  // Sicherheitscheck für undefined/null
  if (value === undefined || value === null || isNaN(value)) {
    return '1';
  }
  
  if (value < 1000) {
    return value.toString();
  } else {
    return value.toExponential(2).replace('e+', 'e');
  }
}

// Kombinierter Multiplikator basierend auf Total LP
const combinedMultiplier = computed(() => {
  return Math.pow(2, Math.floor(totalLP.value / 10));
});

// Color mapping for different sphere effects
const effectColors = {
  lp: {
    borderColor: 'border-purple-500',
    fillColor: 'bg-purple-600/80',
    hoverFill: 'hover:bg-purple-600',
    text: 'text-purple-300',
    icon: 'text-purple-400'
  },
  shards: {
    borderColor: 'border-blue-500',
    fillColor: 'bg-blue-600/80',
    hoverFill: 'hover:bg-blue-600',
    text: 'text-blue-300',
    icon: 'text-blue-400'
  },
  doubler: {
    borderColor: 'border-red-500',
    fillColor: 'bg-red-600/80',
    hoverFill: 'hover:bg-red-600',
    text: 'text-red-300',
    icon: 'text-red-400'
  },
  ultima: {
    borderColor: 'border-green-500',
    fillColor: 'bg-green-600/80',
    hoverFill: 'hover:bg-green-600',
    text: 'text-green-300',
    icon: 'text-green-400'
  },
  tick: {
    borderColor: 'border-yellow-500',
    fillColor: 'bg-yellow-600/80',
    hoverFill: 'hover:bg-yellow-600',
    text: 'text-yellow-300',
    icon: 'text-yellow-400'
  },
  locked: {
    borderColor: 'border-gray-500',
    fillColor: 'bg-gray-600',
    hoverFill: '',
    text: 'text-gray-300',
    icon: 'text-gray-400'
  },
  default: {
    borderColor: 'border-gray-500',
    fillColor: 'bg-gray-600',
    hoverFill: 'hover:bg-gray-500',
    text: 'text-purple-300',
    icon: 'text-purple-400'
  }
};


// Computed properties
const currentCores = computed(() => {
  return startCellMilestones.value * 2 + 
         startMPMilestones.value * 2 + 
         startRPMilestones.value * 2 +
         (currentCellMilestones.value - startCellMilestones.value) +
         (currentMPMilestones.value - startMPMilestones.value) +
         (currentRPMilestones.value - startRPMilestones.value);
});

const totalCores = computed(() => {
  return currentCellMilestones.value * 2 +
         currentMPMilestones.value * 2 +
         currentRPMilestones.value * 2;
});

const usedCores = computed(() => {
  return selectedTraitSpheres.value.reduce((sum, sphereId) => {
    const sphere = getTraitSphereById(sphereId);
    return sum + (sphere?.price || 0);
  }, 0);
});

const remainingCores = computed(() => {
  return totalCores.value - usedCores.value;
});

// Sphere styling functions
function getEffectColors(sphere) {
  return effectColors[sphere.effect] || effectColors.default;
}

function sphereClasses(sphere) {
  const selected = isSelected(sphere.id);
  const selectable = canSelect(sphere);
  const isTS1 = sphere.id === 1;
  
  return [
    'trait-sphere bg-gray-900/80 rounded-lg p-0.5 flex flex-col items-center justify-center aspect-square cursor-pointer transition-all duration-200',
    // Border-Dicke abhängig von Auswahl und Typ
    sphere.effect === 'locked' ? 'border border-gray-700/50' : 
    selected ? 'border-2 border-purple-500' : 'border border-gray-500',
    selected ? 'shadow-lg shadow-purple-900/30' : '',
    // TS#1 bekommt spezielle Behandlung - immer als selectable anzeigen
    (!selectable && !isTS1) ? 'opacity-50 cursor-not-allowed' : [
      'hover:border-purple-400',
      'hover:shadow-md hover:scale-105',
      'hover:shadow-purple-500/20'
    ],
    sphere.effect === 'locked' ? 'cursor-not-allowed' : '',
    // Spezielle Markierung für TS#1 (optional)
    isTS1 ? 'ring-1 ring-yellow-400/30' : ''
  ].flat().filter(Boolean);
}

function sphereIconClasses(sphere) {
  const selected = isSelected(sphere.id);
  
  return [
    'sphere-icon rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200',
    // Hintergrund des äußeren Kreises - immer grau
    'bg-gray-800'
  ].filter(Boolean);
}

function innerSphereClasses(sphere) {
  const colors = getEffectColors(sphere);
  const selected = isSelected(sphere.id);
  const selectable = canSelect(sphere);
  
  if (selected) {
    // Gekauft: Vollständig gefüllt in der Effekt-Farbe
    return [
      'w-4 h-4 rounded-full transition-all duration-200',
      colors.fillColor
    ].filter(Boolean);
  } else {
    // Nicht gekauft: Nur Border in der Effekt-Farbe
    return [
      'w-4 h-4 rounded-full border-2 bg-transparent transition-all duration-200',
      colors.borderColor,
      selectable ? colors.hoverFill : ''
    ].filter(Boolean);
  }
}

function priceTextClasses(sphere) {  
  return [
    'text-[0.7rem] mr-0.5 text-gray-300',
  ].filter(Boolean);
}

function hexagonIconClasses(sphere) {  
  return [
    'text-purple-300'
  ].filter(Boolean);
}

// Methods
function resetSettings() {
  startCellMilestones.value = 0;
  startMPMilestones.value = 0;
  startRPMilestones.value = 0;
  currentCellMilestones.value = 0;
  currentMPMilestones.value = 0;
  currentRPMilestones.value = 0;
  selectedTraitSpheres.value = [1]; // TS#1 immer ausgewählt
  // Reset LP values
  playerLevel.value = 0;
  researchLevels.value = 0;
  lpAchievements.value = 0;
  shipEvolutions.value = 0;
  saveSettings();
}

function clearSelection() {
  selectedTraitSpheres.value = [1]; // Nur TS#1 beibehalten
  saveSettings();
}

function getSphereAtPosition(col, row) {
  return getTraitSphereAtPosition(col, row);
}

function isSelected(sphereId) {
  return sphereId !== undefined && selectedTraitSpheres.value.includes(sphereId);
}

function canSelect(sphere) {
  if (!sphere || sphere.id < 0) return false;
  if (sphere.effect === 'locked') return false;
  
  // TS#1 ist immer ausgewählt und kann nicht abgewählt werden
  if (sphere.id === 1) return true;
  
  // If already selected, can be deselected
  if (isSelected(sphere.id)) return true;

  // Prüfen ob die Trait Sphere zu mindestens einer bereits ausgewählten benachbart ist
  const isAdjacent = isAdjacentToAnySelected(sphere.id, selectedTraitSpheres.value);
  if (!isAdjacent) return false;
  
  // Check if we have enough cores
  return sphere.price <= remainingCores.value;
}

function toggleSphere(sphere) {
  if (!sphere || sphere.id < 0 || sphere.effect === 'locked') return;
  
  // TS#1 kann nicht abgewählt werden
  if (sphere.id === 1) return;
  
  const index = selectedTraitSpheres.value.indexOf(sphere.id);
  
  if (index === -1) {
    // Füge nur hinzu, wenn benachbart zu bereits ausgewählten UND genug Cores vorhanden
    if (isAdjacentToAnySelected(sphere.id, selectedTraitSpheres.value) && 
        sphere.price <= remainingCores.value) {
      selectedTraitSpheres.value.push(sphere.id);
    }
  } else {
    // Entfernen wenn bereits ausgewählt
    // Zusätzliche Prüfung: Wir müssen sicherstellen, dass keine isolierten Spheres entstehen!
    if (willRemovalBreakConnectivity(sphere.id)) {
      // Wenn das Entfernen die Konnektivität zerstören würde, erlauben wir es nicht
      return;
    }
    
    selectedTraitSpheres.value.splice(index, 1);
  }
  
  saveSettings();
}

function willRemovalBreakConnectivity(sphereIdToRemove) {
  // Wenn nur TS#1 oder die zu entfernende Trait Sphere ausgewählt sind, kann nichts isoliert werden
  if (selectedTraitSpheres.value.length <= 2) return false;
  
  // Die zu entfernende Sphere aus der Auswahl herausnehmen
  const remainingSelected = selectedTraitSpheres.value.filter(id => id !== sphereIdToRemove);
  
  // BFS zum Prüfen der Konnektivität von TS#1 aus
  const visited = new Set();
  const queue = [1]; // Starten bei TS#1
  
  while (queue.length > 0) {
    const currentId = queue.shift();
    visited.add(currentId);
    
    // Alle ausgewählten Nachbarn finden und zur Queue hinzufügen
    const neighbors = remainingSelected.filter(id => 
      id !== currentId && isAdjacentToAnySelected(currentId, [id])
    );
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  
  // Wenn wir nicht alle ausgewählten erreichen konnten, würde das Entfernen die Konnektivität brechen
  return visited.size !== remainingSelected.length;
}

const availableTraitSpheres = computed(() => {
  return traitSpheres
    .filter(sphere => sphere.id > 0 && sphere.effect !== 'locked' && sphere.description)
    .sort((a, b) => a.id - b.id);
});

// Funktion für Effekt-Farben der kleinen Dots
function getSphereEffectColorClass(effect) {
  switch (effect) {
    case 'lp': return 'bg-purple-500';
    case 'shards': return 'bg-blue-500';
    case 'doubler': return 'bg-red-500';
    case 'ultima': return 'bg-green-500';
    case 'tick': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
}

function saveSettings() {
  try {
    localStorage.setItem('traitSpherePlanner_settings', JSON.stringify({
      startCellMilestones: startCellMilestones.value,
      startMPMilestones: startMPMilestones.value,
      startRPMilestones: startRPMilestones.value,
      currentCellMilestones: currentCellMilestones.value,
      currentMPMilestones: currentMPMilestones.value,
      currentRPMilestones: currentRPMilestones.value,
      selectedTraitSpheres: selectedTraitSpheres.value,
      // Save LP values
      playerLevel: playerLevel.value,
      researchLevels: researchLevels.value,
      lpAchievements: lpAchievements.value,
      shipEvolutions: shipEvolutions.value
    }));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

function loadSettings() {
  try {
    const savedSettings = JSON.parse(localStorage.getItem('traitSpherePlanner_settings') || '{}');
    
    if (savedSettings.startCellMilestones !== undefined) startCellMilestones.value = savedSettings.startCellMilestones;
    if (savedSettings.startMPMilestones !== undefined) startMPMilestones.value = savedSettings.startMPMilestones;
    if (savedSettings.startRPMilestones !== undefined) startRPMilestones.value = savedSettings.startRPMilestones;
    if (savedSettings.currentCellMilestones !== undefined) currentCellMilestones.value = savedSettings.currentCellMilestones;
    if (savedSettings.currentMPMilestones !== undefined) currentMPMilestones.value = savedSettings.currentMPMilestones;
    if (savedSettings.currentRPMilestones !== undefined) currentRPMilestones.value = savedSettings.currentRPMilestones;
    
    // Load LP values
    if (savedSettings.playerLevel !== undefined) playerLevel.value = savedSettings.playerLevel;
    if (savedSettings.researchLevels !== undefined) researchLevels.value = savedSettings.researchLevels;
    if (savedSettings.lpAchievements !== undefined) lpAchievements.value = savedSettings.lpAchievements;
    if (savedSettings.shipEvolutions !== undefined) shipEvolutions.value = savedSettings.shipEvolutions;
    
    if (savedSettings.selectedTraitSpheres !== undefined) {
      selectedTraitSpheres.value = savedSettings.selectedTraitSpheres;
      if (!selectedTraitSpheres.value.includes(1)) {
        selectedTraitSpheres.value.push(1);
      }
    }
  } catch (error) {
    console.error('Error loading saved settings:', error);
  }
}

// Neue Methode zum Anwenden eines Presets
function applyPreset(preset) {
  // Überprüfe nochmals, ob wir uns das Preset leisten können
  const presetCost = preset.spheres.reduce((total, sphereId) => {
    const sphere = getTraitSphereById(sphereId);
    return total + (sphere?.price || 0);
  }, 0);
  
  if (presetCost <= currentCores.value) {
    selectedTraitSpheres.value = [...preset.spheres];
    saveSettings();
  }
}

// Neue Reactive Variables für Copy-Funktionalität
const copyButtonText = ref('Copy');
const copyTimeoutId = ref(null);

// Watch for changes
watch([
  startCellMilestones, startMPMilestones, startRPMilestones,
  currentCellMilestones, currentMPMilestones, currentRPMilestones,
  selectedTraitSpheres, playerLevel, researchLevels, lpAchievements, shipEvolutions
], () => {
  saveSettings();
});

// Watches für das Minimum der aktuellen Werte
watch(startCellMilestones, (newValue) => {
  if (currentCellMilestones.value < newValue) {
    currentCellMilestones.value = newValue;
  }
});

watch(startMPMilestones, (newValue) => {
  if (currentMPMilestones.value < newValue) {
    currentMPMilestones.value = newValue;
  }
});

watch(startRPMilestones, (newValue) => {
  if (currentRPMilestones.value < newValue) {
    currentRPMilestones.value = newValue;
  }
});

// On component mount
onMounted(() => {
  loadSettings();
});

// Neue Copy-Methode
async function copySelection() {
  if (selectedTraitSpheres.value.length === 0) return;
  
  try {
    // Sortiere die IDs aufsteigend für konsistente Ausgabe
    const sortedSelection = [...selectedTraitSpheres.value].sort((a, b) => a - b);
    const selectionText = sortedSelection.join(', ');
    
    // Verwende die moderne Clipboard API falls verfügbar
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(selectionText);
    } else {
      // Fallback für ältere Browser
      const textArea = document.createElement('textarea');
      textArea.value = selectionText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    
    // Feedback für den Benutzer
    copyButtonText.value = 'Copied!';
    
    // Timeout zurücksetzen falls bereits aktiv
    if (copyTimeoutId.value) {
      clearTimeout(copyTimeoutId.value);
    }
    
    // Nach 2 Sekunden Text zurücksetzen
    copyTimeoutId.value = setTimeout(() => {
      copyButtonText.value = 'Copy';
      copyTimeoutId.value = null;
    }, 2000);
    
    console.log(`Copied to clipboard: ${selectionText}`);
    
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Fehler-Feedback
    copyButtonText.value = 'Error';
    setTimeout(() => {
      copyButtonText.value = 'Copy';
    }, 2000);
  }
}

// Cleanup beim Unmount
onBeforeUnmount(() => {
  if (copyTimeoutId.value) {
    clearTimeout(copyTimeoutId.value);
  }
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

.empty-cell {
  aspect-ratio: 1/1;
}

.sphere-icon {
  transition: all 0.2s ease-in-out;
}

.trait-sphere:hover .sphere-icon {
  transform: scale(1.1);
}
</style>