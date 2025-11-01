<template>
  <div>
    <div class="p-0 sm:p-4 max-w-[1440px] mx-auto">
  <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8 border border-gray-800/80">
        <!-- Header -->
        <h2 class="text-xl sm:text-2xl font-bold mb-3 text-center text-white">
          <span>Trait Sphere Planner</span>
        </h2>
        
        <!-- Milestone & Core Settings -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-3">
          <div class="header p-3 flex justify-between items-center">
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Start of TR Milestones -->
              <div class="bg-gray-900/60 rounded-lg border border-gray-700/50 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-900/40 to-blue-800/30 px-3 py-2 border-b border-gray-700/50">
                  <span class="font-semibold text-white text-sm">Start of TR Milestones</span>
                </div>
                
                <div class="p-2">
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
              </div>
              
              <!-- Current Milestones -->
              <div class="bg-gray-900/60 rounded-lg border border-gray-700/50 overflow-hidden">
                <div class="bg-gradient-to-r from-green-900/40 to-green-800/30 px-3 py-2 border-b border-gray-700/50">
                  <span class="font-semibold text-white text-sm">Current Milestones</span>
                </div>
                
                <div class="p-2">
                  <!-- Cell Milestone -->
                  <div class="flex flex-col sm:flex-row sm:items-center mb-1.5">
                  <!-- Desktop: rechtsbündig -->
                  <div class="hidden sm:flex items-center justify-between w-full">
                    <div class="flex items-center">
                      <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                        <img src="@/assets/general/cells.png" alt="Cells" class="w-4 h-4" />
                      </div>
                      <span class="text-xs sm:text-sm text-gray-300">Cell Milestones</span>
                    </div>
                    <div class="flex items-center">
                      <div v-if="currentCellMilestones < 99" class="text-xs text-gray-300 min-w-[120px] mr-2 text-right">
                        Next Cost: <span class="text-green-400 ml-1">1e{{ nextCellMilestoneCost }}</span>
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
                      />
                    </div>
                  </div>
                  <!-- Mobile: Controls rechts -->
                  <div class="flex sm:hidden items-center justify-between w-full">
                    <div class="flex items-center">
                      <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                        <img src="@/assets/general/cells.png" alt="Cells" class="w-4 h-4" />
                      </div>
                      <span class="text-xs text-gray-300">Cell Milestones</span>
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
                  <!-- Mobile: Cost unten -->
                  <div v-if="currentCellMilestones < 99" class="text-xs text-gray-300 mt-1 sm:hidden">
                    Next Cost: <span class="text-green-400">1e{{ nextCellMilestoneCost }}</span>
                  </div>
                </div>
                
                <!-- MP Milestone -->
                <div class="flex flex-col sm:flex-row sm:items-center mb-1.5">
                  <!-- Desktop: rechtsbündig -->
                  <div class="hidden sm:flex items-center justify-between w-full">
                    <div class="flex items-center">
                      <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                        <img src="@/assets/general/mp.png" alt="MP" class="w-4 h-4" />
                      </div>
                      <span class="text-xs sm:text-sm text-gray-300">MP Milestones</span>
                    </div>
                    <div class="flex items-center">
                      <div v-if="currentMPMilestones < 99" class="text-xs text-gray-300 min-w-[120px] mr-2 text-right">
                        Next Cost: <span class="text-red-400 ml-1">1e{{ nextMPMilestoneCost }}</span>
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
                      />
                    </div>
                  </div>
                  <!-- Mobile: Controls rechts -->
                  <div class="flex sm:hidden items-center justify-between w-full">
                    <div class="flex items-center">
                      <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                        <img src="@/assets/general/mp.png" alt="MP" class="w-4 h-4" />
                      </div>
                      <span class="text-xs text-gray-300">MP Milestones</span>
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
                  <!-- Mobile: Cost unten -->
                  <div v-if="currentMPMilestones < 99" class="text-xs text-gray-300 mt-1 sm:hidden">
                    Next Cost: <span class="text-red-400">1e{{ nextMPMilestoneCost }}</span>
                  </div>
                </div>
                
                <!-- RP Milestone -->
                <div class="flex flex-col sm:flex-row sm:items-center">
                  <!-- Desktop: rechtsbündig -->
                  <div class="hidden sm:flex items-center justify-between w-full">
                    <div class="flex items-center">
                      <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                        <img src="@/assets/general/rp.png" alt="RP" class="w-4 h-4" />
                      </div>
                      <span class="text-xs sm:text-sm text-gray-300">RP Milestones</span>
                    </div>
                    <div class="flex items-center">
                      <div v-if="currentRPMilestones < 99" class="text-xs text-gray-300 min-w-[120px] mr-2 text-right">
                        Next Cost: <span class="text-amber-400 ml-1">1e{{ nextRPMilestoneCost }}</span>
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
                      />
                    </div>
                  </div>
                  <!-- Mobile: Controls rechts -->
                  <div class="flex sm:hidden items-center justify-between w-full">
                    <div class="flex items-center">
                      <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                        <img src="@/assets/general/rp.png" alt="RP" class="w-4 h-4" />
                      </div>
                      <span class="text-xs text-gray-300">RP Milestones</span>
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
                  <!-- Mobile: Cost unten -->
                  <div v-if="currentRPMilestones < 99" class="text-xs text-gray-300 mt-1 sm:hidden">
                    Next Cost: <span class="text-amber-400">1e{{ nextRPMilestoneCost }}</span>
                  </div>
                </div>
                </div>
              </div>
            </div>
            
            <!-- Boon of Juncture - SEPARATES DIV -->
            <div class="mt-3 bg-gray-900/60 rounded-lg p-2 border border-gray-700/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-5 h-5 flex items-center justify-center rounded-full mr-1.5">
                    <IconTarget size="16" class="text-red-400" />
                  </div>
                  <span class="text-xs sm:text-sm text-gray-300">Boon of Ouroboros: Juncture</span>
                  <span class="text-xs text-gray-500 ml-2">(+1 AMC)</span>
                </div>
                <div class="flex items-center">
                  <!-- Toggle Switch -->
                  <div 
                    @click="boonOfJuncture = !boonOfJuncture" 
                    class="relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    :class="{
                      'bg-red-600': boonOfJuncture,
                      'bg-gray-600': !boonOfJuncture
                    }"
                    role="switch"
                    :aria-checked="boonOfJuncture"
                  >
                    <span 
                      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                      :class="{
                        'translate-x-5': boonOfJuncture,
                        'translate-x-0': !boonOfJuncture
                      }"
                    ></span>
                  </div>
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
          <!-- Floating Point Hint Banner -->
          <div 
            v-if="!store.settings.hideFloatingPointHint"
            class="bg-yellow-900/30 border-b border-yellow-700/50 p-3 flex items-start justify-between"
          >
            <div class="flex items-start">
              <IconInfoCircle size="18" class="text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-sm text-yellow-200 font-medium mb-1">
                  Floating Points
                </p>
                <p class="text-xs text-yellow-300/90">
                  <strong>Long press</strong> (hold for 0.5s) on any Trait Sphere to mark it yellow. 
                  This lets you plan ahead for TS you want to purchase in your TR without selecting them now.
                </p>
              </div>
            </div>
            <button 
              @click="store.settings.hideFloatingPointHint = true"
              class="ml-3 p-1 rounded hover:bg-yellow-800/30 transition-colors flex-shrink-0"
            >
              <IconX size="16" class="text-yellow-400" />
            </button>
          </div>
          
          <div class="header p-3">
            <!-- Single Row: Title, Stats, Floating Points, Buttons -->
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
              <!-- Left: Title -->
              <h3 class="text-base sm:text-lg font-semibold text-white flex items-center">
                <IconCircle size="16" class="mr-1.5 text-purple-400" />
                Trait Spheres
              </h3>
              
              <!-- Center: Stats Group -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <!-- Cores Used -->
                <div class="flex items-center gap-1.5 px-2 py-1 rounded border bg-purple-900/20 border-purple-700/50">
                  <IconCircle size="12" class="text-purple-400" />
                  <span class="text-xs text-purple-300 font-medium">
                    Cores Used: {{ usedCores }} / {{ currentCores }}
                  </span>
                </div>
                
                <!-- Floating Points (immer sichtbar) -->
                <div class="flex items-center gap-1.5 px-2 py-1 rounded border" :class="[
                  store.settings.floatingPointSpheres.length > 0 
                    ? 'bg-yellow-900/20 border-yellow-700/50' 
                    : 'bg-gray-800/50 border-gray-700/30'
                ]">
                  <IconTarget size="12" :class="[
                    store.settings.floatingPointSpheres.length > 0 
                      ? 'text-yellow-400' 
                      : 'text-gray-500'
                  ]" />
                  <span class="text-xs" :class="[
                    store.settings.floatingPointSpheres.length > 0 
                      ? 'text-yellow-300 font-medium' 
                      : 'text-gray-500'
                  ]">
                    Floating Points: {{ remainingCores }}
                  </span>
                  <span v-if="store.settings.floatingPointSpheres.length > 0" class="text-xs text-gray-400">
                    |
                  </span>
                  <span v-if="store.settings.floatingPointSpheres.length > 0" class="text-xs" :class="[
                    store.floatingPointCost > 0 
                      ? 'text-yellow-400 font-medium' 
                      : 'text-green-400 font-medium'
                  ]">
                    {{ store.floatingPointCost > 0 ? `${store.floatingPointCost} more needed` : 'Affordable now!' }}
                  </span>
                </div>
              </div>
              
              <!-- Right: Buttons -->
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
                
                <!-- Import Button -->
                <button 
                  @click="showImportModal = true"
                  class="bg-green-700 hover:bg-green-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
                >
                  <IconFileImport size="12" class="mr-1" />
                  Import
                </button>
                
                <!-- Presets Button -->
                <button 
                  @click="showPresetsModal = true"
                  class="bg-purple-700 hover:bg-purple-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
                >
                  <IconStar size="12" class="mr-1" />
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
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <!-- TS Descriptions Panel (Links) -->
              <div class="bg-gray-900/60 rounded-lg border border-gray-700/50 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-900/40 to-purple-800/30 px-3 py-2 border-b border-gray-700/50">
                  <h4 class="text-sm font-semibold text-white flex items-center">
                    <IconCircle size="14" class="mr-1.5 text-purple-400" />
                    Trait Sphere Effects
                  </h4>
                </div>
                
                <div class="p-3 space-y-0.5">
                  <div 
                    v-for="sphere in availableTraitSpheres" 
                    :key="sphere.id"
                    :class="[
                      'p-1.5 rounded border transition-all duration-200 cursor-pointer',
                      hoveredSphereId === sphere.id
                        ? store.isSelected(sphere.id)
                          ? 'bg-purple-800/70 border-purple-400 shadow-lg ring-2 ring-purple-400/50'
                          : store.isFloatingPoint(sphere.id)
                            ? 'bg-yellow-800/70 border-yellow-400 shadow-lg ring-2 ring-yellow-400/50'
                            : 'bg-gray-600/60 border-gray-400 shadow-lg ring-2 ring-gray-400/40'
                        : store.isSelected(sphere.id) 
                          ? 'bg-purple-900/50 border-purple-500/50 shadow-md'
                          : store.isFloatingPoint(sphere.id)
                            ? 'bg-yellow-700/50 border-yellow-600/60 shadow-md'
                            : 'bg-gray-800/30 border-gray-600/30 hover:border-gray-500/50'
                    ]"
                    @mousedown="handleMouseDown(sphere)"
                    @mouseup="handleMouseUp(); handleSphereClick(sphere)"
                    @mouseenter="handleSphereHover(sphere.id)"
                    @mouseleave="handleSphereMouseLeave"
                  >
                    <div class="grid grid-cols-16 gap-2 items-center">
                      <!-- TS# Column -->
                      <div class="col-span-2 flex items-center">
                        <span :class="[
                          'text-xs font-medium',
                          store.isSelected(sphere.id) ? 'text-purple-300' : 'text-gray-300'
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
                          store.isSelected(sphere.id) ? 'text-gray-200' : 'text-gray-400'
                        ]">
                          {{ sphere.description }}
                        </p>
                      </div>
                      
                      <!-- Price Column -->
                      <div class="col-span-2 flex items-center justify-end">
                        <span v-if="sphere.price > 0" :class="[
                          'text-xs font-medium mr-0.5',
                          store.isSelected(sphere.id) ? 'text-purple-300' : 'text-gray-400'
                        ]">
                          {{ sphere.price }}
                        </span>
                        <IconHexagon v-if="sphere.price > 0" size="6" :class="[
                          store.isSelected(sphere.id) ? 'text-purple-400' : 'text-gray-500'
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
                  <div class="grid grid-cols-7 gap-1.5">
                    <template v-for="row in 7" :key="`row-${row}`">
                      <template v-for="col in 7" :key="`cell-${row}-${col}`">
                        <!-- Only render if there's a sphere or if it's not empty -->
                        <template v-if="getSphereAtPosition(col-1, row-1)">
                          <div 
                            v-if="getSphereAtPosition(col-1, row-1).id >= 0"
                            :class="sphereClasses(getSphereAtPosition(col-1, row-1))"
                            @mousedown="handleMouseDown(getSphereAtPosition(col-1, row-1))"
                            @mouseup="handleMouseUp(); handleSphereClick(getSphereAtPosition(col-1, row-1))"
                            @mouseenter="handleSphereHover(getSphereAtPosition(col-1, row-1).id)"
                            @mouseleave="handleSphereMouseLeave"
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
              <div class="bg-gray-900/60 rounded-lg border border-gray-700/50 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-900/40 to-purple-800/30 px-3 py-2 border-b border-gray-700/50">
                  <h4 class="text-sm font-semibold text-white flex items-center">
                    <img src="@/assets/general/lp.png" alt="LP" class="w-4 h-4 mr-2" />
                    LP Statistics
                  </h4>
                </div>
                
                <div class="p-3">
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
                          <th class="text-right pr-1 py-1">LP</th>
                          <th class="text-right pr-1 py-1">Multi</th>
                          <th v-if="evolutionGemNode2Active" class="text-right py-1">RP Multi</th>
                        </tr>
                      </thead>
                      <tbody class="space-y-1">
                        <!-- TS#2 -->
                        <tr :class="store.isSelected(2) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            store.isSelected(2) ? 'text-yellow-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#2
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            store.isSelected(2) ? 'text-yellow-300 font-medium' : 'text-yellow-300'
                          ]">
                            +{{ lpFromPlayerLevel }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.7rem]',
                            store.isSelected(2) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromPlayerLevelMultiplier) }}
                          </td>
                          <td v-if="evolutionGemNode2Active" :class="[
                            'text-right py-0.5 px-1 text-[0.7rem]',
                            store.isSelected(2) ? 'text-orange-400' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(rpFromPlayerLevelMultiplier) }}
                          </td>
                        </tr>
                        
                        <!-- TS#8 -->
                        <tr :class="store.isSelected(8) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            store.isSelected(8) ? 'text-blue-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#8 
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            store.isSelected(8) ? 'text-blue-300 font-medium' : 'text-blue-300'
                          ]">
                            +{{ lpFromResearch }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.7rem]',
                            store.isSelected(8) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromResearchMultiplier) }}
                          </td>
                          <td v-if="evolutionGemNode2Active" :class="[
                            'text-right py-0.5 px-1 text-[0.7rem]',
                            store.isSelected(8) ? 'text-orange-400' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(rpFromResearchMultiplier) }}
                          </td>
                        </tr>
                        
                        <!-- TS#15 -->
                        <tr :class="store.isSelected(15) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            store.isSelected(15) ? 'text-purple-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#15 
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            store.isSelected(15) ? 'text-purple-300 font-medium' : 'text-purple-300'
                          ]">
                            +{{ lpFromShipEvolutions }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.7rem]',
                            store.isSelected(15) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromShipEvolutionsMultiplier) }}
                          </td>
                          <td v-if="evolutionGemNode2Active" :class="[
                            'text-right py-0.5 px-1 text-[0.7rem]',
                            store.isSelected(15) ? 'text-orange-400' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(rpFromShipEvolutionsMultiplier) }}
                          </td>
                        </tr>
                        
                        <!-- TS#16 -->
                        <tr :class="store.isSelected(16) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'py-0.5 px-1',
                            store.isSelected(16) ? 'text-green-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#16 
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1',
                            store.isSelected(16) ? 'text-green-300 font-medium' : 'text-green-300'
                          ]">
                            +{{ lpFromAchievements }}
                          </td>
                          <td :class="[
                            'text-right py-0.5 px-1 text-[0.7rem]',
                            store.isSelected(16) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromAchievementsMultiplier) }}
                          </td>
                          <td v-if="evolutionGemNode2Active" :class="[
                            'text-right py-0.5 px-1 text-[0.7rem]',
                            store.isSelected(16) ? 'text-orange-400' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(rpFromAchievementsMultiplier) }}
                          </td>
                        </tr>
                        
                        <!-- TS#19 -->
                        <tr :class="store.isSelected(19) ? 'bg-purple-900/30 rounded' : ''">
                          <td :class="[
                            'pt-0.5 pb-1.5 px-1',
                            store.isSelected(19) ? 'text-yellow-300 font-medium' : 'text-gray-400'
                          ]">
                            TS#19 
                          </td>
                          <td :class="[
                            'text-right pt-0.5 pb-1.5 px-1',
                            store.isSelected(19) ? 'text-yellow-300 font-medium' : 'text-yellow-300'
                          ]">
                            +{{ lpFromPlayerLevelTS19 }}
                          </td>
                          <td :class="[
                            'text-right pt-0.5 pb-1.5 px-1 text-[0.7rem]',
                            store.isSelected(19) ? 'text-green-400 font-medium' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(lpFromPlayerLevelTS19Multiplier) }}
                          </td>
                          <td v-if="evolutionGemNode2Active" :class="[
                            'text-right pt-0.5 pb-1.5 px-1 text-[0.7rem]',
                            store.isSelected(19) ? 'text-orange-400' : 'text-gray-400'
                          ]">
                            x{{ formatMultiplier(rpFromPlayerLevelTS19Multiplier) }}
                          </td>
                        </tr>
                        
                        <!-- Total Row mit Trennstrich -->
                        <tr class="border-t border-gray-600">
                          <td class="text-white py-1.5 px-1 font-medium">Total</td>
                          <td class="text-yellow-400 text-right py-1.5 px-1 font-medium">+{{ totalLPSelected }}</td>
                          <td class="text-green-400 text-right py-1.5 px-1 font-medium">x{{ formatMultiplier(combinedMultiplierSelected) }}</td>
                          <td v-if="evolutionGemNode2Active" class="text-orange-400 text-right py-1.5 px-1 font-medium">x{{ formatMultiplier(combinedRPMultiplier) }}</td>
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
      :currentCellMilestones="startCellMilestones"
      :currentMPMilestones="startMPMilestones"
      :currentRPMilestones="startRPMilestones"
      :availableCores="currentCores"
      @close="showPresetsModal = false"
      @select-preset="applyPreset"
    />

    <!-- Import Modal -->
    <div 
      v-if="showImportModal" 
      class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
      @click.self="showImportModal = false"
    >
      <div 
        class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-4 border-b border-gray-600 flex justify-between items-center">
          <h2 class="text-xl font-bold text-white flex items-center">
            <IconFileImport size="20" class="mr-2 text-green-400" />
            Import Trait Spheres
          </h2>
          <button 
            @click="showImportModal = false"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
          >
            <IconX size="18" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-5">
          <p class="text-sm text-gray-300 mb-4">
            Paste a comma-separated list of Trait Sphere IDs to select them.
          </p>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Trait Sphere IDs
            </label>
            <textarea
              v-model="importInput"
              placeholder="e.g., 1,2,4,5,7,8,9,12,14,16"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows="3"
            ></textarea>
          </div>

          <div v-if="importError" class="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
            <p class="text-sm text-red-300">{{ importError }}</p>
          </div>

          <div class="flex justify-end gap-2">
            <button
              @click="showImportModal = false"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="importSelection"
              :disabled="!importInput.trim()"
              :class="[
                'px-4 py-2 rounded-lg transition-colors',
                importInput.trim()
                  ? 'bg-green-700 hover:bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              ]"
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import { 
  IconSettings, 
  IconRefresh, 
  IconTrash,
  IconCircle,
  IconHexagon,
  IconLock,
  IconCopy,
  IconTarget,
  IconStar,
  IconFileImport,
  IconX,
  IconInfoCircle
} from '@tabler/icons-vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import PresetsModal from '@/components/common/ts-planner/PresetsModal.vue';
import { 
  traitSpheres, 
  getTraitSphereAtPosition
} from '@/constants/ts-planner';
import { useTSStore } from '@/store/tsStore.js';

// Initialize TS Store
const store = useTSStore();

// Local UI state (nicht in Store)
const showPresetsModal = ref(false);
const showImportModal = ref(false);
const importInput = ref('');
const importError = ref('');
const copyButtonText = ref('Copy');
const copyTimeoutId = ref(null);

// Long press state for floating point toggle
const longPressTimer = ref(null);
const longPressDuration = 500; // 500ms für long press

// Hover state for highlighting corresponding sphere
const hoveredSphereId = ref(null);

// Computed Shortcuts für Template-Zugriff (direkt vom Store)
const startCellMilestones = computed({
  get: () => store.settings.startCellMilestones,
  set: (value) => {
    store.settings.startCellMilestones = value;
    // Ensure current is never less than start
    if (store.settings.currentCellMilestones < value) {
      store.settings.currentCellMilestones = value;
    }
  }
});

const startMPMilestones = computed({
  get: () => store.settings.startMPMilestones,
  set: (value) => {
    store.settings.startMPMilestones = value;
    // Ensure current is never less than start
    if (store.settings.currentMPMilestones < value) {
      store.settings.currentMPMilestones = value;
    }
  }
});

const startRPMilestones = computed({
  get: () => store.settings.startRPMilestones,
  set: (value) => {
    store.settings.startRPMilestones = value;
    // Ensure current is never less than start
    if (store.settings.currentRPMilestones < value) {
      store.settings.currentRPMilestones = value;
    }
  }
});

const currentCellMilestones = computed({
  get: () => store.settings.currentCellMilestones,
  set: (value) => store.settings.currentCellMilestones = value
});

const currentMPMilestones = computed({
  get: () => store.settings.currentMPMilestones,
  set: (value) => store.settings.currentMPMilestones = value
});

const currentRPMilestones = computed({
  get: () => store.settings.currentRPMilestones,
  set: (value) => store.settings.currentRPMilestones = value
});

const boonOfJuncture = computed({
  get: () => store.settings.boonOfJuncture,
  set: (value) => store.settings.boonOfJuncture = value
});

const playerLevel = computed({
  get: () => store.settings.playerLevel,
  set: (value) => store.settings.playerLevel = value
});

const researchLevels = computed({
  get: () => store.settings.researchLevels,
  set: (value) => store.settings.researchLevels = value
});

const lpAchievements = computed({
  get: () => store.settings.lpAchievements,
  set: (value) => store.settings.lpAchievements = value
});

const shipEvolutions = computed({
  get: () => store.settings.shipEvolutions,
  set: (value) => store.settings.shipEvolutions = value
});

// Store Computed durchreichen
const selectedTraitSpheres = computed(() => store.settings.selectedTraitSpheres);
const currentCores = computed(() => store.currentCores);
const totalCores = computed(() => store.totalCores);
const usedCores = computed(() => store.usedCores);
const remainingCores = computed(() => store.remainingCores);
const nextCellMilestoneCost = computed(() => store.nextCellMilestoneCost);
const nextMPMilestoneCost = computed(() => store.nextMPMilestoneCost);
const nextRPMilestoneCost = computed(() => store.nextRPMilestoneCost);

// Evolution Gem Nodes
const evolutionGemNode2Active = computed(() => store.evolutionGemNode2Active);
const evolutionGemNode5Active = computed(() => store.evolutionGemNode5Active);

// LP Calculations
const lpFromPlayerLevel = computed(() => store.lpFromPlayerLevel);
const lpFromResearch = computed(() => store.lpFromResearch);
const lpFromShipEvolutions = computed(() => store.lpFromShipEvolutions);
const lpFromAchievements = computed(() => store.lpFromAchievements);
const lpFromPlayerLevelTS19 = computed(() => store.lpFromPlayerLevelTS19);
const totalLPSelected = computed(() => store.totalLPSelected);

// LP Multipliers
const lpFromPlayerLevelMultiplier = computed(() => store.lpFromPlayerLevelMultiplier);
const lpFromResearchMultiplier = computed(() => store.lpFromResearchMultiplier);
const lpFromShipEvolutionsMultiplier = computed(() => store.lpFromShipEvolutionsMultiplier);
const lpFromAchievementsMultiplier = computed(() => store.lpFromAchievementsMultiplier);
const lpFromPlayerLevelTS19Multiplier = computed(() => store.lpFromPlayerLevelTS19Multiplier);
const combinedMultiplierSelected = computed(() => store.combinedMultiplierSelected);

// RP Multipliers
const rpFromPlayerLevelMultiplier = computed(() => store.rpFromPlayerLevelMultiplier);
const rpFromResearchMultiplier = computed(() => store.rpFromResearchMultiplier);
const rpFromShipEvolutionsMultiplier = computed(() => store.rpFromShipEvolutionsMultiplier);
const rpFromAchievementsMultiplier = computed(() => store.rpFromAchievementsMultiplier);
const rpFromPlayerLevelTS19Multiplier = computed(() => store.rpFromPlayerLevelTS19Multiplier);
const combinedRPMultiplier = computed(() => store.combinedRPMultiplier);

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

// Sphere styling functions
function getEffectColors(sphere) {
  return effectColors[sphere.effect] || effectColors.default;
}

function sphereClasses(sphere) {
  const selected = store.isSelected(sphere.id);
  const selectable = store.canSelect(sphere);
  const isTS1 = sphere.id === 1;
  const isFloating = store.isFloatingPoint(sphere.id);
  const isHovered = hoveredSphereId.value === sphere.id;
  
  return [
    'trait-sphere bg-gray-900/80 rounded-lg p-0.5 flex flex-col items-center justify-center aspect-square cursor-pointer transition-all duration-200',
    // Border-Dicke abhängig von Auswahl und Typ
    sphere.effect === 'locked' ? 'border border-gray-700/50' : 
    isHovered && selected ? 'border-2 border-purple-400 ring-2 ring-purple-400/60 shadow-xl' :
    isHovered && isFloating ? 'border-2 border-yellow-400 ring-2 ring-yellow-400/60 shadow-xl' :
    isHovered && !selected && !isFloating ? 'border-2 border-gray-300 ring-2 ring-gray-300/50 shadow-xl' :
    isFloating ? 'border-2 border-yellow-500' : // Floating Points - gelber Border
    selected ? 'border-2 border-purple-500' : 'border border-gray-500',
    selected && !isHovered ? 'shadow-lg shadow-purple-900/30' : '',
    isFloating ? 'shadow-lg shadow-yellow-500/20' : '', // Floating Points - gelber Schatten
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
  const selected = store.isSelected(sphere.id);
  
  return [
    'sphere-icon rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200',
    // Hintergrund des äußeren Kreises - immer grau
    'bg-gray-800'
  ].filter(Boolean);
}

function innerSphereClasses(sphere) {
  const colors = getEffectColors(sphere);
  const selected = store.isSelected(sphere.id);
  const selectable = store.canSelect(sphere);
  
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
  store.resetSettings();
}

function clearSelection() {
  store.clearSelection();
  saveSettings();
}

function getSphereAtPosition(col, row) {
  return getTraitSphereAtPosition(col, row);
}

const availableTraitSpheres = computed(() => store.availableTraitSpheres);

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

// Long press handlers for floating point toggle
let isLongPress = false;

function handleMouseDown(sphere) {
  // Clear any existing timer
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
  }
  
  isLongPress = false;
  
  // Start long press timer
  longPressTimer.value = setTimeout(() => {
    isLongPress = true;
    store.toggleFloatingPoint(sphere);
    longPressTimer.value = null;
  }, longPressDuration);
}

function handleMouseUp() {
  // Clear timer if still running
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
}

function handleSphereMouseLeave() {
  // Cancel long press if mouse leaves the sphere
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
  isLongPress = false;
  
  // Clear hover
  hoveredSphereId.value = null;
}

function handleSphereClick(sphere) {
  // Only trigger normal toggle if it wasn't a long press
  if (!isLongPress) {
    store.toggleSphere(sphere);
  }
  isLongPress = false;
}

// Hover handlers for cross-highlighting
function handleSphereHover(sphereId) {
  hoveredSphereId.value = sphereId;
}

// Methode zum Anwenden eines Presets
function applyPreset(preset) {
  store.applyPreset(preset);
}

// Import Selection Methode
function importSelection() {
  importError.value = '';
  
  try {
    // Parse den Input (komma-getrennt)
    const input = importInput.value.trim();
    if (!input) {
      importError.value = 'Please enter at least one Trait Sphere ID.';
      return;
    }
    
    // Split und parse die IDs
    const ids = input.split(',').map(id => {
      const parsed = parseInt(id.trim());
      if (isNaN(parsed)) {
        throw new Error(`Invalid ID: "${id.trim()}"`);
      }
      return parsed;
    });
    
    // Validiere dass alle IDs existieren
    const validIds = [];
    const invalidIds = [];
    
    ids.forEach(id => {
      const sphere = traitSpheres.find(s => s.id === id);
      if (sphere && sphere.id >= 0) {
        validIds.push(id);
      } else {
        invalidIds.push(id);
      }
    });
    
    if (invalidIds.length > 0) {
      importError.value = `Invalid Trait Sphere IDs: ${invalidIds.join(', ')}`;
      return;
    }
    
    // Setze die Selection im Store
    store.settings.selectedTraitSpheres = validIds;
    
    // Schließe Modal und reset Input
    showImportModal.value = false;
    importInput.value = '';
    importError.value = '';
    
  } catch (error) {
    importError.value = error.message || 'Failed to import selection. Please check your input.';
  }
}

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
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
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
</style>