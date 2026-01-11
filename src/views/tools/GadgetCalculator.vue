<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8 border border-gray-800/80">
      <!-- Header -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white">
        <span>Gadget Planner</span>
      </h2>
      
      <!-- Tesseract Production Box -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <img src="@/assets/knox/loot_mat3.png" class="w-7 h-7 mr-2" alt="Tesseracts" />
            Tesseract Production
          </h3>
          
          <div class="flex items-center gap-2">            
            <button 
              @click="resetProduction" 
              class="bg-gray-700 hover:bg-gray-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconRefresh size="14" class="mr-1" />
              Reset
            </button>
          </div>
        </div>
        
        <div class="p-2 sm:p-4">
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <!-- Reference Build -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Reference Build</div>
              <div class="text-xs text-gray-400 mb-2">Select Knox Build</div>
              
              <select 
                v-model="selectedBuildId" 
                @change="updateFromSelectedBuild"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a build...</option>
                <option v-for="build in knoxBuilds" :key="build.id" :value="build.id">
                  {{ build.name }}
                </option>
              </select>
            </div>

            <!-- Current Tesseracts -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1 flex items-center gap-1">
                Current Tesseracts
                <InfoTooltip 
                  content="<strong>Auto-updating Tesseracts:</strong><br/>• Grows automatically based on daily production<br/>• Updates live<br/>• Deducted automatically when marking items as purchased"
                  placement="top"
                />
              </div>
              <div class="text-xs text-gray-400 mb-2">Amount you have saved</div>
              
              <SuffixInput
                v-model="currentTesseracts"
                placeholder="0"
                :focus-ring-class="'focus:ring-blue-500'"
                :placeholder-class="'placeholder-blue-400'"
                class="w-full text-sm bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <!-- Hours in TR -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1 flex items-center gap-1">
                Hours in TR
                <InfoTooltip 
                  content="<strong>Hours in TR:</strong><br/>• Tracks your current hours in this TR<br/>• Auto-increments in real time<br/>• Used to calculate @Hour for shopping list items<br/>• Shared across all tools"
                  placement="top"
                />
              </div>
              <div class="text-xs text-gray-400 mb-2">Current hours in TR</div>
              
              <HoursInTRInput
                :model-value="gemPlannerStore.hoursInTR?.value || 0"
                :timestamp="gemPlannerStore.hoursInTR?.timestamp"
                :live-update="true"
                :show-live-indicator="true"
                focus-ring-class="focus:ring-cyan-500"
                @update:model-value="gemPlannerStore.updateHoursInTR($event)"
              />
            </div>     
            
            <!-- Daily Tesseract Rate -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Tesseracts per Day</div>
              <div class="text-xs text-gray-400 mb-2">Calculated from Build</div>

              <div class="flex items-center bg-gray-800/80 py-2 px-3 rounded-lg border border-gray-700">
                <div class="text-amber-400 text-base font-bold">{{ formatGadgetCost(tessarectsPerDay) }}</div>
                <div v-if="!selectedBuildId" class="ml-2 text-gray-400 text-xs">
                  (select a build)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Box -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconChartDots size="18" class="mr-2 text-green-400" />
            Summary
          </h3>
          <button 
            @click="showSummaryModal = true" 
            class="bg-cyan-700 hover:bg-cyan-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
          >
            <IconShare size="14" class="mr-1" />
            Summary
          </button>
        </div>
        
        <div class="p-2 sm:p-4">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <!-- Total Cost -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Total Cost</div>
              <div class="text-lg font-bold text-amber-400">
                {{ formatGadgetCost(store.totalShoppingCost) }}
              </div>
            </div>

            <!-- Time to Save -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Time to Save</div>
              <div class="text-lg font-bold text-cyan-400">
                {{ formatTimeToSave() }}
              </div>
            </div>

            <!-- @Hour (when complete) -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">@Hour</div>
              <div class="text-lg font-bold text-cyan-400">
                {{ formatTotalHoursInTR() }}
              </div>
            </div>

            <!-- Items Count -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Shopping List</div>
              <div class="text-lg font-bold text-white">
                {{ shoppingList.length }} Gadget{{ shoppingList.length !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Tab Navigation (lg:hidden) -->
      <div class="lg:hidden mb-4">
        <div class="bg-gray-800/50 rounded-xl border border-gray-700/50 p-1 flex">
          <button
            @click="activeMobileTab = 'available'"
            :class="[
              'flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm',
              activeMobileTab === 'available' 
                ? 'bg-cyan-700 text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <IconList size="16" />
              <span>Available</span>
              <span class="text-xs bg-cyan-900/50 px-1.5 py-0.5 rounded">{{ GADGETS.length }}</span>
            </div>
          </button>
          <button
            @click="activeMobileTab = 'shopping'"
            :class="[
              'flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm',
              activeMobileTab === 'shopping' 
                ? 'bg-green-700 text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <IconShoppingCart size="16" />
              <span>Shopping</span>
              <span class="text-xs bg-green-900/50 px-1.5 py-0.5 rounded">{{ shoppingList.length }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Content (lg:hidden) -->
      <div class="lg:hidden">
        <!-- Mobile: Available Gadgets Tab -->
        <div v-if="activeMobileTab === 'available'" class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="header p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconList size="20" class="mr-2 text-cyan-400" />
              Available Gadgets
            </h3>
            <button 
              @click="showLevelsModal = true" 
              class="bg-cyan-700 hover:bg-cyan-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconSettings size="14" class="mr-1" />
              Manage Levels
            </button>
          </div>
          
          <div class="p-4 space-y-2">
            <!-- Loading State -->
            <div v-if="isLoading" class="p-8 flex flex-col items-center justify-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-l-2 border-blue-500 mb-4"></div>
              <p class="text-gray-400 text-sm">Loading gadget data...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="loadError" class="p-4 text-center">
              <IconAlertCircle size="24" class="text-red-500 mx-auto mb-2" />
              <p class="text-red-400 text-sm">{{ loadError }}</p>
              <button 
                @click="loadGadgetData" 
                class="mt-3 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm"
              >
                Retry
              </button>
            </div>

            <!-- Gadget Cards -->
            <div v-else class="space-y-2">
              <div 
                v-for="gadget in GADGETS" 
                :key="gadget.id"
                class="bg-gray-700/30 rounded-lg p-2.5 hover:bg-gray-700/50 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <!-- Icon -->
                  <div class="w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                    <img 
                      v-if="getGadgetImageUrl(gadget.id)"
                      :src="getGadgetImageUrl(gadget.id)"
                      :alt="gadget.label"
                      class="w-[32px] h-[32px] object-contain"
                    />
                  </div>
                  
                  <!-- Content: Name + Effects -->
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-white truncate max-w-[140px]">
                      {{ gadget.label }}
                    </div>
                    <div class="text-[10px] text-gray-400 truncate mt-0.5">
                      {{ gadget.boost.map(b => b.description).join(', ') }}
                    </div>
                  </div>
                  
                  <!-- Level Badge + Buy Buttons -->
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <!-- Level Badge -->
                    <div class="text-[11px] bg-gray-600/50 px-1 py-1 rounded text-gray-300 font-mono self-start">
                      {{ getCurrentLevel(gadget.id) }}
                    </div>
                    
                    <!-- +1 Button -->
                    <div class="flex flex-col items-center gap-0.5">
                      <button
                        @click="addGadgetToListWithLevels(gadget, 1)"
                        @mouseenter="hoveredButton = { gadgetId: gadget.id, levels: 1 }"
                        @mouseleave="hoveredButton = null"
                        class="text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-500 rounded transition-colors text-white font-semibold w-11"
                      >
                        +1
                      </button>
                      <div class="text-center">
                        <div class="text-[9px] text-amber-400 whitespace-nowrap">
                          {{ formatGadgetCost(calculateUpgradeCost(gadget.id, getCurrentLevel(gadget.id), getCurrentLevel(gadget.id) + 1)) }}
                        </div>
                        <div class="text-[9px] text-cyan-400 whitespace-nowrap">
                          {{ formatTimeToAfford(calculateTimeToAfford(gadget.id, 1)) }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- +10 Button -->
                    <div class="flex flex-col items-center gap-0.5">
                      <button
                        @click="addGadgetToListWithLevels(gadget, 10)"
                        @mouseenter="hoveredButton = { gadgetId: gadget.id, levels: 10 }"
                        @mouseleave="hoveredButton = null"
                        class="text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-500 rounded transition-colors text-white font-semibold w-11"
                      >
                        +10
                      </button>
                      <div class="text-center">
                        <div class="text-[9px] text-amber-400 whitespace-nowrap">
                          {{ formatGadgetCost(calculateUpgradeCost(gadget.id, getCurrentLevel(gadget.id), getCurrentLevel(gadget.id) + 10)) }}
                        </div>
                        <div class="text-[9px] text-cyan-400 whitespace-nowrap">
                          {{ formatTimeToAfford(calculateTimeToAfford(gadget.id, 10)) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: Shopping List Tab -->
        <div v-if="activeMobileTab === 'shopping'" class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="header p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconShoppingCart size="20" class="mr-2 text-green-400" />
              Shopping List
            </h3>
            
            <button 
              @click="store.clearShoppingList()" 
              class="bg-cyan-700 hover:bg-cyan-600 text-white px-2 py-1 text-xs rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div class="p-4">
            <div v-if="shoppingList.length === 0" class="text-center py-8">
              <IconShoppingCartOff size="48" class="mx-auto text-gray-600 mb-2" />
              <p class="text-gray-500">No items in shopping list</p>
            </div>

            <Draggable 
              v-else
              :modelValue="shoppingList" 
              @update:modelValue="store.updateShoppingListOrder($event)"
              handle=".grip-handle"
              :animation="200"
              item-key="id"
              class="space-y-2"
            >
              <template #item="{ element: item }">
                <div class="bg-gray-700/40 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-all">
                  <div class="p-3">
                    <div class="flex items-center gap-3">
                      <div class="grip-handle cursor-move text-gray-500 hover:text-gray-300 transition-colors">
                        <IconGripVertical size="16" />
                      </div>
                      
                      <div class="w-8 h-8 flex-shrink-0">
                        <img 
                          v-if="getGadgetImageUrl(item.gadgetId)"
                          :src="getGadgetImageUrl(item.gadgetId)"
                          :alt="item.gadgetName"
                          class="w-8 h-8 object-contain"
                        />
                      </div>
                      
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-white truncate">{{ item.gadgetName }}</div>
                        <div class="text-xs text-gray-400">
                          Level {{ item.fromLevel }} → {{ item.toLevel }}
                        </div>
                        <!-- Mobile: Tess: WERT @Hours Datum -->
                        <div class="flex flex-col gap-0.5 text-[10px] mt-0.5">
                          <template v-if="item.evaluation && item.evaluation.tesseractsPerDay">
                            <span class="text-green-400">
                              Tess: {{ formatGadgetCost(item.evaluation.previousProduction || tessarectsPerDay) }}/d → {{ formatGadgetCost(item.evaluation.tesseractsPerDay) }}/d
                            </span>
                          </template>
                          <template v-else-if="getProductionAtIndex(index) > 0">
                            <span class="text-gray-400">Tess: {{ formatGadgetCost(getProductionAtIndex(index)) }}/d</span>
                          </template>
                          <span v-else class="text-gray-500">Tess: -</span>
                          <span class="text-cyan-400">{{ formatItemHours(item) }}</span>
                          <span v-if="formatAvailabilityDate(item)" class="text-purple-400 text-[9px] flex items-center gap-1">
                            <IconCalendar size="10" />
                            {{ formatAvailabilityDate(item) }}
                          </span>
                        </div>
                      </div>
                      
                      <div class="text-right flex-shrink-0">
                        <div class="text-sm font-semibold text-amber-400">{{ formatGadgetCost(item.totalCost) }}</div>
                      </div>
                      
                      <div class="flex gap-1 flex-shrink-0">
                        <button 
                          @click="markAsPurchased(item.id)" 
                          class="text-green-400 hover:text-green-300 p-0.5"
                          title="Mark as Purchased"
                        >
                          <IconCheck size="14" />
                        </button>
                        <button 
                          @click="removeItem(item.id)" 
                          class="text-red-400 hover:text-red-300 p-0.5"
                          title="Remove"
                        >
                          <IconX size="14" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Draggable>
          </div>
        </div>
      </div>

      <!-- Desktop Content Grid (hidden on mobile) -->
      <div class="hidden lg:grid lg:grid-cols-2 gap-4">
        <!-- LEFT: Available Gadgets -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconList size="20" class="mr-2 text-cyan-400" />
              Available Gadgets
            </h3>
            <button 
              @click="showLevelsModal = true" 
              class="bg-cyan-700 hover:bg-cyan-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconSettings size="14" class="mr-1" />
              Manage Levels
            </button>
          </div>
          
          <div class="p-4 space-y-2">
            <!-- Loading State -->
            <div v-if="isLoading" class="p-8 flex flex-col items-center justify-center">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-l-2 border-blue-500 mb-4"></div>
              <p class="text-gray-400 text-sm">Loading gadget data...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="loadError" class="p-4 text-center">
              <IconAlertCircle size="24" class="text-red-500 mx-auto mb-2" />
              <p class="text-red-400 text-sm">{{ loadError }}</p>
              <button 
                @click="loadGadgetData" 
                class="mt-3 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-sm"
              >
                Retry
              </button>
            </div>

            <!-- Gadget Cards -->
            <div v-else class="space-y-2">
              <div 
                v-for="gadget in GADGETS" 
                :key="gadget.id"
                class="bg-gray-700/30 rounded-lg p-2.5 hover:bg-gray-700/50 transition-colors"
              >
                <div class="flex items-center gap-2">
                  <!-- Icon -->
                  <div class="w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                    <img 
                      v-if="getGadgetImageUrl(gadget.id)"
                      :src="getGadgetImageUrl(gadget.id)"
                      :alt="gadget.label"
                      class="w-[32px] h-[32px] object-contain"
                    />
                  </div>
                  
                  <!-- Content: Name + Effects -->
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-white truncate">
                      {{ gadget.label }}
                    </div>
                    <div class="text-[10px] text-gray-400 truncate mt-0.5">
                      {{ gadget.boost.map(b => b.description).join(', ') }}
                    </div>
                  </div>
                  
                  <!-- Level Badge + Buy Buttons -->
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <!-- Level Badge -->
                    <div class="text-[11px] bg-gray-600/50 px-1.5 py-1 rounded text-gray-300 font-mono self-start">
                      Lvl {{ getCurrentLevel(gadget.id) }}
                    </div>
                    
                    <!-- +1 Button -->
                    <div class="flex flex-col items-center gap-0.5 relative">
                      <button
                        @click="addGadgetToListWithLevels(gadget, 1)"
                        @mouseenter="hoveredButton = { gadgetId: gadget.id, levels: 1 }"
                        @mouseleave="hoveredButton = null"
                        class="text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-500 rounded transition-colors text-white font-semibold w-11"
                      >
                        +1
                      </button>
                      <div class="text-center">
                        <div class="text-[9px] text-amber-400 whitespace-nowrap">
                          {{ formatGadgetCost(calculateUpgradeCost(gadget.id, getCurrentLevel(gadget.id), getCurrentLevel(gadget.id) + 1)) }}
                        </div>
                        <div class="text-[9px] text-cyan-400 whitespace-nowrap">
                          {{ formatTimeToAfford(calculateTimeToAfford(gadget.id, 1)) }}
                        </div>
                      </div>
                      
                      <!-- Tooltip for +1 -->
                      <div 
                        v-if="hoveredButton?.gadgetId === gadget.id && hoveredButton?.levels === 1 && !isMobile"
                        class="absolute bottom-full mb-2 right-0 bg-gray-900 border border-gray-600 rounded-lg p-2 shadow-xl z-50 min-w-[160px] tooltip-arrow"
                      >
                        <div class="text-[10px] text-gray-400 mb-1 font-semibold">Improvements:</div>
                        <div class="space-y-0.5">
                          <div 
                            v-for="improvement in calculateBoostImprovements(gadget, getCurrentLevel(gadget.id), getCurrentLevel(gadget.id) + 1)" 
                            :key="improvement.description"
                            class="flex justify-between items-center gap-2"
                          >
                            <span class="text-gray-300 text-[10px]">{{ improvement.description }}</span>
                            <span class="text-green-400 font-semibold text-[10px]">+{{ improvement.percentChange }}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- +10 Button -->
                    <div class="flex flex-col items-center gap-0.5 relative">
                      <button
                        @click="addGadgetToListWithLevels(gadget, 10)"
                        @mouseenter="hoveredButton = { gadgetId: gadget.id, levels: 10 }"
                        @mouseleave="hoveredButton = null"
                        class="text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-500 rounded transition-colors text-white font-semibold w-11"
                      >
                        +10
                      </button>
                      <div class="text-center">
                        <div class="text-[9px] text-amber-400 whitespace-nowrap">
                          {{ formatGadgetCost(calculateUpgradeCost(gadget.id, getCurrentLevel(gadget.id), getCurrentLevel(gadget.id) + 10)) }}
                        </div>
                        <div class="text-[9px] text-cyan-400 whitespace-nowrap">
                          {{ formatTimeToAfford(calculateTimeToAfford(gadget.id, 10)) }}
                        </div>
                      </div>
                      
                      <!-- Tooltip for +10 -->
                      <div 
                        v-if="hoveredButton?.gadgetId === gadget.id && hoveredButton?.levels === 10 && !isMobile"
                        class="absolute bottom-full mb-2 right-0 bg-gray-900 border border-gray-600 rounded-lg p-2 shadow-xl z-50 min-w-[160px] tooltip-arrow"
                      >
                        <div class="text-[10px] text-gray-400 mb-1 font-semibold">Improvements:</div>
                        <div class="space-y-0.5">
                          <div 
                            v-for="improvement in calculateBoostImprovements(gadget, getCurrentLevel(gadget.id), getCurrentLevel(gadget.id) + 10)" 
                            :key="improvement.description"
                            class="flex justify-between items-center gap-2"
                          >
                            <span class="text-gray-300 text-[10px]">{{ improvement.description }}</span>
                            <span class="text-green-400 font-semibold text-[10px]">+{{ improvement.percentChange }}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Shopping List -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconShoppingCart size="20" class="mr-2 text-cyan-400" />
              Shopping List
            </h3>
            <button
              v-if="shoppingList.length > 0"
              @click="store.clearShoppingList()"
              class="text-xs px-2 py-1 bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          <!-- Shopping List Items -->
          <div class="p-4 space-y-3 overflow-y-auto">
            <!-- Empty State -->
            <div v-if="shoppingList.length === 0" class="p-12 text-center">
              <IconShoppingCartOff size="48" class="mx-auto text-gray-600 mb-3" />
              <p class="text-gray-400 text-sm">No items in shopping list</p>
              <p class="text-gray-500 text-xs mt-1">Add gadget upgrades from the catalog</p>
            </div>

            <!-- Draggable List -->
            <Draggable 
              v-else
              v-model="shoppingList"
              handle=".grip-handle"
              :animation="200"
              @end="onDragEnd"
              item-key="id"
              class="space-y-2"
            >
              <template #item="{ element: item, index }">
                <div class="bg-gray-700/30 rounded-lg p-2 transition-all duration-200 hover:bg-gray-700/50 border border-transparent">
                  <!-- Main Row: All key info in one line -->
                  <div class="flex items-center gap-2">
                    <div class="grip-handle text-gray-500 hover:text-gray-300 cursor-grab flex-shrink-0">
                      <IconGripVertical size="14" />
                    </div>
                    
                    <img 
                      v-if="getGadgetImageUrl(item.gadgetId)"
                      :src="getGadgetImageUrl(item.gadgetId)"
                      :alt="item.gadgetName"
                      class="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                    
                    <!-- Info Section -->
                    <div class="flex-1 min-w-0">
                      <!-- Top line: Name + Level -->
                      <div class="flex items-center">
                        <span class="text-sm text-white truncate">{{ item.gadgetName }}</span>
                        <span class="text-xs text-gray-400 flex-shrink-0">Lvl {{ item.fromLevel }} → {{ item.toLevel }}</span>
                      </div>
                      <!-- Bottom line: Tess: WERT @Hours Datum -->
                      <div class="flex items-center text-xs mt-0.5">
                        <template v-if="item.evaluation && item.evaluation.tesseractsPerDay">
                          <span class="text-green-400 w-40">
                            Tess: {{ formatGadgetCost(item.evaluation.previousProduction || tessarectsPerDay) }}/d → {{ formatGadgetCost(item.evaluation.tesseractsPerDay) }}/d
                          </span>
                        </template>
                        <template v-else-if="getProductionAtIndex(index) > 0">
                          <span class="text-gray-400 w-40">Tess: {{ formatGadgetCost(getProductionAtIndex(index)) }}/d</span>
                        </template>
                        <span v-else class="text-gray-500 w-40">Tess: -</span>
                        <span class="text-cyan-400 w-20">{{ formatItemHours(item) }}</span>
                        <span v-if="formatAvailabilityDate(item)" class="text-purple-400 flex items-center gap-1">
                          <IconCalendar size="12" />
                          {{ formatAvailabilityDate(item) }}
                        </span>
                      </div>
                    </div>
                    
                    <!-- Right side: Price + Buttons -->
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <span class="text-sm font-bold text-amber-400 w-20 text-right">{{ formatGadgetCost(item.totalCost) }}</span>
                      <button @click="markItemAsPurchased(item.id)" class="text-green-400 hover:text-green-300 p-0.5" title="Mark as purchased">
                        <IconCheck size="16" />
                      </button>
                      <button @click="removeItem(item.id)" class="text-red-400 hover:text-red-300 p-0.5" title="Remove">
                        <IconX size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </Draggable>

            <!-- Shopping List Summary - Total Cost -->
            <div v-if="shoppingList.length > 0" class="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 mt-4">
              <div class="flex justify-between items-center">
                <span class="font-medium text-white">Total Cost</span>
                <span class="text-lg font-bold text-amber-400">
                  {{ formatGadgetCost(totalShoppingCostForSummary) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gadget Summary Modal -->
    <GadgetSummaryModal
      v-if="showSummaryModal"
      :isVisible="showSummaryModal"
      :currentLevels="store.currentLevels"
      :targetLevels="targetLevelsForSummary"
      :totalCost="totalShoppingCostForSummary"
      :daysToSave="daysToSaveForSummary"
      :buildName="selectedBuild?.name || 'None selected'"
      :tessarectsPerDay="tessarectsPerDay"
      :gadgetImages="gadgetImages"
      :currentTesseracts="currentTesseracts"
      :anchorEvaluationEnabled="false"
      :anchorEvaluations="{}"
      :evaluatingAnchor="false"
      @close="showSummaryModal = false"
    />

    <!-- Gadget Levels Modal -->
    <GadgetLevelsModal
      v-if="showLevelsModal"
      :gadgetImages="gadgetImages"
      :gadgets="GADGETS"
      @close="showLevelsModal = false"
    />

    <!-- Confirmation Modal (Mobile) -->
    <div 
      v-if="showConfirmModal && pendingGadget" 
      class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
      @click.self="cancelConfirmModal"
    >
      <div 
        class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-700"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-cyan-900 to-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white flex items-center">
            <IconShoppingCart size="20" class="mr-2 text-cyan-400" />
            Add to Shopping List
          </h3>
          <button @click="cancelConfirmModal" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors">
            <IconX size="18" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-4">
          <!-- Gadget Info -->
          <div class="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3">
            <img 
              v-if="gadgetImages[pendingGadget.id]"
              :src="gadgetImages[pendingGadget.id]"
              :alt="pendingGadget.label"
              class="w-12 h-12 object-contain"
            />
            <div class="flex-1">
              <div class="text-white font-semibold">{{ pendingGadget.label }}</div>
              <div class="text-sm text-gray-400">
                Level {{ getCurrentLevel(pendingGadget.id) }} → {{ getCurrentLevel(pendingGadget.id) + pendingLevels }}
              </div>
            </div>
          </div>

          <!-- Cost -->
          <div class="bg-gray-700/30 rounded-lg p-3">
            <div class="text-sm text-gray-400 mb-1">Cost</div>
            <div class="text-xl font-bold text-amber-400">
              {{ formatGadgetCost(calculateUpgradeCost(pendingGadget.id, getCurrentLevel(pendingGadget.id), getCurrentLevel(pendingGadget.id) + pendingLevels)) }}
            </div>
          </div>

          <!-- Improvements -->
          <div class="bg-gray-700/30 rounded-lg p-3">
            <div class="text-sm text-gray-400 mb-2">Improvements</div>
            <div class="space-y-1">
              <div 
                v-for="improvement in calculateBoostImprovements(pendingGadget, getCurrentLevel(pendingGadget.id), getCurrentLevel(pendingGadget.id) + pendingLevels)" 
                :key="improvement.description"
                class="flex justify-between items-center"
              >
                <span class="text-gray-300 text-sm">{{ improvement.description }}</span>
                <span class="text-green-400 font-semibold">+{{ improvement.percentChange }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-2 p-4 border-t border-gray-700 bg-gray-900/50">
          <button 
            @click="cancelConfirmModal"
            class="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-semibold transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmAddToList(pendingGadget, pendingLevels)"
            class="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <IconPlus size="18" />
            Add to List
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { 
  IconSettings, 
  IconShoppingCart,
  IconShoppingCartOff,
  IconRefresh,
  IconTrash,
  IconX,
  IconCheck,
  IconGripVertical,
  IconArrowUp,
  IconAlertCircle,
  IconList,
  IconChartDots,
  IconShare,
  IconPlus,
  IconCalendar
} from '@tabler/icons-vue';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useGadgetPlannerStore } from '@/store/gadgetPlannerStore';
import { formatGadgetCost, calcGadgetCostDifference } from '@/utils/gadgetCostUtils';
import { useBuildEvaluation } from '@/composables/useBuildEvaluation.js';
import { useIsMobile } from '@/composables/useIsMobile.js';
import SuffixInput from '@/composables/SuffixInput.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import HoursInTRInput from '@/composables/HoursInTRInput.vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import GadgetLevelsModal from '@/components/gadget-calculator/GadgetLevelsModal.vue';
import GadgetSummaryModal from '@/components/gadget-calculator/GadgetSummaryModal.vue';
import Draggable from 'vuedraggable';
import { GADGETS } from '@/constants/gadgets';

// Stores
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();
const store = useGadgetPlannerStore();

// Mobile Detection
const { isMobile } = useIsMobile();

// Local State
const isLoading = ref(false);
const loadError = ref(null);
const buyLevels = ref({}); // { gadgetId: number }
const gadgetImages = ref({});
const showLevelsModal = ref(false);
const showSummaryModal = ref(false);
const showConfirmModal = ref(false);
const pendingGadget = ref(null);
const pendingLevels = ref(0);
const hoveredButton = ref(null); // { gadgetId, levels }
const activeMobileTab = ref('available'); // 'available' or 'shopping'
const cachedResults = ref({}); // Cache for build evaluation results

// Reactive trigger for live updates
const liveUpdateTrigger = ref(0);

// Store-based reactive properties
const shoppingList = computed({
  get: () => store.shoppingList,
  set: (value) => store.updateShoppingListOrder(value)
});
const selectedBuildId = computed({
  get: () => store.settings.selectedBuildId,
  set: (value) => store.updateSelectedBuild(value)
});
const tessarectsPerDay = computed({
  get: () => store.settings.tessarectsPerDay,
  set: (value) => store.updateTesseractsPerDay(value)
});
const evaluatingAnchor = computed(() => store.evaluatingAnchor);

// Computed property for currentTesseracts that auto-updates
const currentTesseracts = computed({
  get() {
    const _ = liveUpdateTrigger.value;
    return store.getCurrentTesseractsWithProduction();
  },
  set(newValue) {
    store.updateCurrentTesseracts(newValue);
  }
});

// Computed properties
const knoxBuilds = computed(() => {
  return hunterStore.getBuildsForHunter('knox').filter(build => !build.isArchived);
});

const selectedBuild = computed(() => {
  if (!selectedBuildId.value) return null;
  return knoxBuilds.value.find(build => String(build.id) === String(selectedBuildId.value));
});

// Use the build evaluation composable
const { 
  evaluateBuildWithParams, 
  isEvaluating
} = useBuildEvaluation({ hunterId: 'knox', buildData: selectedBuild }, () => {});

// Computed properties for Summary Modal
const targetLevelsForSummary = computed(() => {
  const targets = {};
  GADGETS.forEach(gadget => {
    const currentLevel = store.currentLevels[gadget.id] || 0;
    const shoppingListLevels = shoppingList.value
      .filter(item => item.gadgetId === gadget.id)
      .reduce((sum, item) => sum + (item.toLevel - item.fromLevel), 0);
    targets[gadget.id] = currentLevel + shoppingListLevels;
  });
  return targets;
});

const totalShoppingCostForSummary = computed(() => {
  return store.totalShoppingCost;
});

const daysToSaveForSummary = computed(() => {
  if (shoppingList.value.length === 0 || tessarectsPerDay.value <= 0) return 0;
  
  let cumulativeDays = 0;
  let availableTesseracts = store.getCurrentTesseractsWithProduction();
  let currentProduction = tessarectsPerDay.value;
  
  for (const item of shoppingList.value) {
    if (item.gadgetId === 'anchor' && (item.toLevel - item.fromLevel) > 1) {
      for (let level = item.fromLevel; level < item.toLevel; level++) {
        const levelCost = calculateUpgradeCost('anchor', level, level + 1);
        const remainingCost = Math.max(0, levelCost - availableTesseracts);
        
        if (remainingCost > 0 && currentProduction > 0) {
          cumulativeDays += remainingCost / currentProduction;
          availableTesseracts += (remainingCost / currentProduction) * currentProduction;
        }
        
        availableTesseracts -= levelCost;
        currentProduction = calculateAnchorProductionBoost(level, level + 1, currentProduction);
      }
    } else {
      const remainingCost = Math.max(0, item.totalCost - availableTesseracts);
      
      if (remainingCost > 0 && currentProduction > 0) {
        cumulativeDays += remainingCost / currentProduction;
        availableTesseracts += (remainingCost / currentProduction) * currentProduction;
      }
      
      availableTesseracts -= item.totalCost;
      
      if (item.gadgetId === 'anchor' && item.evaluation?.tesseractsPerDay) {
        currentProduction = item.evaluation.tesseractsPerDay;
      }
    }
  }
  
  return cumulativeDays;
});

// Functions
function getCurrentLevel(gadgetId) {
  const baseLevel = store.currentLevels[gadgetId] || 0;
  
  // Add levels from shopping list (temporary increase)
  const shoppingListLevels = shoppingList.value
    .filter(item => item.gadgetId === gadgetId)
    .reduce((sum, item) => sum + (item.toLevel - item.fromLevel), 0);
  
  return baseLevel + shoppingListLevels;
}

// Get cumulative production at a specific index in shopping list
function getProductionAtIndex(index) {
  let production = tessarectsPerDay.value;
  
  // Apply all Anchor boosts from items before this index
  for (let i = 0; i < index; i++) {
    const item = shoppingList.value[i];
    if (item.gadgetId === 'anchor' && item.evaluation?.tesseractsPerDay) {
      production = item.evaluation.tesseractsPerDay;
    }
  }
  
  return production;
}

function calculateUpgradeCost(gadgetId, fromLevel, toLevel) {
  return calcGadgetCostDifference(gadgetId, fromLevel, toLevel);
}

function calculateTimeToAfford(gadgetId, levels) {
  const currentLevel = getCurrentLevel(gadgetId);
  const cost = calculateUpgradeCost(gadgetId, currentLevel, currentLevel + levels);
  const production = tessarectsPerDay.value;
  const availableTesseracts = store.getCurrentTesseractsWithProduction();
  
  if (production <= 0) return null;
  
  const remainingCost = Math.max(0, cost - availableTesseracts);
  if (remainingCost <= 0) return { days: 0, hours: 0 };
  
  const daysNeeded = remainingCost / production;
  const fullDays = Math.floor(daysNeeded);
  const remainingHours = Math.round((daysNeeded - fullDays) * 24);
  
  return { days: fullDays, hours: remainingHours };
}

function formatTimeToAfford(time) {
  if (!time) return '-';
  if (time.days === 0 && time.hours === 0) return 'Now';
  if (time.days === 0) return `${time.hours}h`;
  if (time.hours === 0) return `${time.days}d`;
  return `${time.days}d ${time.hours}h`;
}

function calculateAnchorProductionBoost(fromLevel, toLevel, currentProduction) {
  let totalBoostPercent = 0;
  
  for (let level = fromLevel + 1; level <= toLevel; level++) {
    if (level % 10 === 0) {
      // Milestone level (10, 20, 30, etc.): Gets remaining boost to reach 16% for last 10 levels
      const previousNineLevels = 9 * 0.67;
      const milestoneBonus = 16 - previousNineLevels; // ~9.97%
      totalBoostPercent += milestoneBonus;
    } else {
      // Regular level: 0.67% boost
      totalBoostPercent += 0.67;
    }
  }
  
  const newProduction = currentProduction * (1 + totalBoostPercent / 100);
  return newProduction;
}

function addGadgetToListWithLevels(gadget, levels) {
  if (!levels || levels <= 0) return;

  // On mobile, show confirmation modal first
  if (isMobile.value) {
    pendingGadget.value = gadget;
    pendingLevels.value = levels;
    showConfirmModal.value = true;
    return;
  }

  // Desktop: Add directly
  confirmAddToList(gadget, levels);
}

function confirmAddToList(gadget, levels) {
  // Start from base level + all existing shopping list items for this gadget
  const baseLevel = store.currentLevels[gadget.id] || 0;
  const existingShoppingListLevels = shoppingList.value
    .filter(item => item.gadgetId === gadget.id)
    .reduce((max, item) => Math.max(max, item.toLevel), baseLevel);
  
  const fromLevel = existingShoppingListLevels;
  const toLevel = fromLevel + levels;
  const totalCost = calculateUpgradeCost(gadget.id, fromLevel, toLevel);

  const item = {
    gadgetId: gadget.id,
    gadgetName: gadget.name,
    fromLevel: fromLevel,
    toLevel: toLevel,
    totalCost: totalCost,
    evaluation: null
  };

  // Calculate production boost for Anchor (cumulative from previous items)
  if (gadget.id === 'anchor' && tessarectsPerDay.value > 0) {
    // Get production AFTER all previous anchor items in shopping list
    let currentProduction = tessarectsPerDay.value;
    for (const existingItem of shoppingList.value) {
      if (existingItem.gadgetId === 'anchor' && existingItem.evaluation?.tesseractsPerDay) {
        currentProduction = existingItem.evaluation.tesseractsPerDay;
      }
    }
    
    const newProduction = calculateAnchorProductionBoost(fromLevel, toLevel, currentProduction);
    item.evaluation = {
      tesseractsPerDay: newProduction,
      previousProduction: currentProduction  // Store production BEFORE this item
    };
  }

  store.addToShoppingList(item);
  showConfirmModal.value = false;
}

function calculateBoostImprovements(gadget, fromLevel, toLevel) {
  const improvements = [];
  
  gadget.boost.forEach(boost => {
    const currentMulti = gadget.calculateMultiplier(fromLevel, boost.type);
    const newMulti = gadget.calculateMultiplier(toLevel, boost.type);
    const percentChange = ((newMulti / currentMulti - 1) * 100);
    
    improvements.push({
      description: boost.description,
      percentChange: percentChange.toFixed(2)
    });
  });
  
  return improvements;
}

function cancelConfirmModal() {
  showConfirmModal.value = false;
  pendingGadget.value = null;
  pendingLevels.value = 0;
}

function handleModalKeydown(event) {
  if (event.key === 'Escape' && showConfirmModal.value) {
    cancelConfirmModal();
  }
}



function removeItem(itemId) {
  store.removeFromShoppingList(itemId);
}

function markItemAsPurchased(itemId) {
  const item = shoppingList.value.find(i => i.id === itemId);
  if (!item) return;

  // Deduct cost from current tesseracts
  const currentAmount = store.getCurrentTesseractsWithProduction();
  const remaining = Math.max(0, currentAmount - item.totalCost);
  store.updateCurrentTesseracts(remaining);

  // Update production if it's an anchor upgrade with evaluation
  if (item.gadgetId === 'anchor' && item.evaluation?.tesseractsPerDay) {
    store.updateTesseractsPerDay(item.evaluation.tesseractsPerDay);
  }

  // Mark as purchased (updates level and removes from list)
  store.markAsPurchased(itemId);
}

function onDragEnd() {
  // Order is automatically updated by v-model on Draggable
  console.log('Shopping list reordered');
}

function formatItemHours(item) {
  // Calculate cumulative hours including all previous items
  let cumulativeHours = gemPlannerStore.getCurrentHoursInTR();
  let availableTesseracts = store.getCurrentTesseractsWithProduction();
  let currentProduction = tessarectsPerDay.value;

  // Go through shopping list up to this item
  const itemIndex = shoppingList.value.findIndex(i => i.id === item.id);
  
  for (let i = 0; i <= itemIndex; i++) {
    const listItem = shoppingList.value[i];
    
    // For Anchor items with multiple levels, calculate each level separately
    if (listItem.gadgetId === 'anchor' && (listItem.toLevel - listItem.fromLevel) > 1) {
      // Calculate level by level
      for (let level = listItem.fromLevel; level < listItem.toLevel; level++) {
        const levelCost = calculateUpgradeCost('anchor', level, level + 1);
        const remainingCost = Math.max(0, levelCost - availableTesseracts);
        
        if (remainingCost > 0 && currentProduction > 0) {
          const daysNeeded = remainingCost / currentProduction;
          const hoursNeeded = daysNeeded * 24;
          cumulativeHours += hoursNeeded;
          availableTesseracts += daysNeeded * currentProduction;
        }
        
        availableTesseracts -= levelCost;
        
        // Update production after each level
        currentProduction = calculateAnchorProductionBoost(level, level + 1, currentProduction);
      }
    } else {
      // Normal calculation for non-anchor or single-level items
      const remainingCost = Math.max(0, listItem.totalCost - availableTesseracts);

      if (remainingCost > 0 && currentProduction > 0) {
        const daysNeeded = remainingCost / currentProduction;
        const hoursNeeded = daysNeeded * 24;
        cumulativeHours += hoursNeeded;
        availableTesseracts += daysNeeded * currentProduction;
      }

      availableTesseracts -= listItem.totalCost;

      // Update production if this item increases it
      if (listItem.gadgetId === 'anchor' && listItem.evaluation?.tesseractsPerDay) {
        currentProduction = listItem.evaluation.tesseractsPerDay;
      }
    }
  }
  const hours = Math.round(cumulativeHours);
  return `@${hours}h`;
}

function formatAvailabilityDate(item) {
  if (tessarectsPerDay.value <= 0) return null;
  
  // Calculate cumulative days including all previous items
  let cumulativeDays = 0;
  let availableTesseracts = store.getCurrentTesseractsWithProduction();
  let currentProduction = tessarectsPerDay.value;

  // Go through shopping list up to this item
  const itemIndex = shoppingList.value.findIndex(i => i.id === item.id);
  
  for (let i = 0; i <= itemIndex; i++) {
    const listItem = shoppingList.value[i];
    
    // For Anchor items with multiple levels, calculate each level separately
    if (listItem.gadgetId === 'anchor' && (listItem.toLevel - listItem.fromLevel) > 1) {
      for (let level = listItem.fromLevel; level < listItem.toLevel; level++) {
        const levelCost = calculateUpgradeCost('anchor', level, level + 1);
        const remainingCost = Math.max(0, levelCost - availableTesseracts);
        
        if (remainingCost > 0 && currentProduction > 0) {
          const daysNeeded = remainingCost / currentProduction;
          cumulativeDays += daysNeeded;
          availableTesseracts += daysNeeded * currentProduction;
        }
        
        availableTesseracts -= levelCost;
        currentProduction = calculateAnchorProductionBoost(level, level + 1, currentProduction);
      }
    } else {
      const remainingCost = Math.max(0, listItem.totalCost - availableTesseracts);

      if (remainingCost > 0 && currentProduction > 0) {
        const daysNeeded = remainingCost / currentProduction;
        cumulativeDays += daysNeeded;
        availableTesseracts += daysNeeded * currentProduction;
      }

      availableTesseracts -= listItem.totalCost;

      if (listItem.gadgetId === 'anchor' && listItem.evaluation?.tesseractsPerDay) {
        currentProduction = listItem.evaluation.tesseractsPerDay;
      }
    }
  }
  
  // Calculate the future date
  const now = new Date();
  const availableDate = new Date(now.getTime() + cumulativeDays * 24 * 60 * 60 * 1000);
  
  // Format based on days
  if (cumulativeDays > 2) {
    // Over 2 days: Show only date
    return availableDate.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  } else {
    // Under 2 days: Show date + time
    return availableDate.toLocaleString('de-DE', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
}

function formatTimeToSave() {
  if (shoppingList.value.length === 0) return 'No items';
  if (tessarectsPerDay.value <= 0) return 'Set production rate';

  let cumulativeDays = 0;
  let availableTesseracts = store.getCurrentTesseractsWithProduction();
  let currentProduction = tessarectsPerDay.value;

  for (const item of shoppingList.value) {
    const remainingCost = Math.max(0, item.totalCost - availableTesseracts);

    if (remainingCost > 0 && currentProduction > 0) {
      const daysNeeded = remainingCost / currentProduction;
      cumulativeDays += daysNeeded;
      availableTesseracts += daysNeeded * currentProduction;
    }

    availableTesseracts -= item.totalCost;

    // Update production if item increases it
    if (item.gadgetId === 'anchor' && item.evaluation?.tesseractsPerDay) {
      currentProduction = item.evaluation.tesseractsPerDay;
    }
  }

  const days = Math.floor(cumulativeDays);
  const hours = Math.round((cumulativeDays - days) * 24);

  if (days === 0) return `${hours}h`;
  if (hours === 0) return `${days}d`;
  return `${days}d ${hours}h`;
}

function resetProduction() {
  store.resetAllLevels();
  buyLevels.value = {};
}

async function updateFromSelectedBuild() {
  if (!selectedBuildId.value || !selectedBuild.value) {
    tessarectsPerDay.value = 0;
    return;
  }

  const build = selectedBuild.value;
  
  // Get result directly from cache (no async evaluation needed)
  const result = cachedResults.value[build.id];
  
  if (result && result.mat3) {
    const tesseractsPerRun = result.mat3 || 0;
    const avgRunTimeMinutes = result.avgTime || 120;
    const runsPerDay = 1440 / avgRunTimeMinutes;
    const dailyTesseracts = Math.floor(tesseractsPerRun * runsPerDay);
    
    store.updateTesseractsPerDay(dailyTesseracts);
    console.log(`📊 Loaded production: ${dailyTesseracts} tesseracts/day from build "${build.name}"`);
  } else {
    console.warn(`⚠️ No cached evaluation found for build "${build.name}" (ID: ${build.id})`);
    tessarectsPerDay.value = 0;
  }

  // Update Anchor level from selected build
  updateCurrentAnchorFromBuild(build);
}

function formatTotalHoursInTR() {
  if (shoppingList.value.length === 0) return '-';
  
  let cumulativeHours = gemPlannerStore.getCurrentHoursInTR();
  let availableTesseracts = store.getCurrentTesseractsWithProduction();
  let currentProduction = tessarectsPerDay.value;
  
  for (const item of shoppingList.value) {
    // For Anchor items with multiple levels, calculate each level separately
    if (item.gadgetId === 'anchor' && (item.toLevel - item.fromLevel) > 1) {
      for (let level = item.fromLevel; level < item.toLevel; level++) {
        const levelCost = calculateUpgradeCost('anchor', level, level + 1);
        const remainingCost = Math.max(0, levelCost - availableTesseracts);
        
        if (remainingCost > 0 && currentProduction > 0) {
          const daysNeeded = remainingCost / currentProduction;
          const hoursNeeded = daysNeeded * 24;
          cumulativeHours += hoursNeeded;
          availableTesseracts += daysNeeded * currentProduction;
        }
        
        availableTesseracts -= levelCost;
        currentProduction = calculateAnchorProductionBoost(level, level + 1, currentProduction);
      }
    } else {
      const remainingCost = Math.max(0, item.totalCost - availableTesseracts);
      
      if (remainingCost > 0 && currentProduction > 0) {
        const daysNeeded = remainingCost / currentProduction;
        const hoursNeeded = daysNeeded * 24;
        cumulativeHours += hoursNeeded;
        availableTesseracts += daysNeeded * currentProduction;
      }
      
      availableTesseracts -= item.totalCost;
      
      if (item.gadgetId === 'anchor' && item.evaluation?.tesseractsPerDay) {
        currentProduction = item.evaluation.tesseractsPerDay;
      }
    }
  }
  
  const hours = Math.round(cumulativeHours);
  return `@${hours}h`;
}

function updateCurrentAnchorFromBuild(build) {
  if (!build) return;

  let anchorLevel = 0;

  if (build.overrides && build.overrides['upgrades.gadgets.anchor'] !== undefined) {
    anchorLevel = build.overrides['upgrades.gadgets.anchor'];
  } else if (build.upgrades && build.upgrades.gadgets && build.upgrades.gadgets.anchor !== undefined) {
    anchorLevel = build.upgrades.gadgets.anchor;
  } else {
    const storeUpgrades = hunterStore.upgrades?.gadgets || {};
    anchorLevel = storeUpgrades.anchor || 0;
  }

  store.updateCurrentLevel('anchor', anchorLevel);
}

function getGadgetImageUrl(gadgetId) {
  return gadgetImages.value[gadgetId] || null;
}

async function loadGadgetData() {
  try {
    isLoading.value = true;
    loadError.value = null;

    // Load all gadget images (1-15)
    for (let i = 0; i < GADGETS.length; i++) {
      try {
        const imageNumber = i + 1; // Images are 1.png to 15.png
        const module = await import(`@/assets/gadgets/${imageNumber}.png`);
        const gadget = GADGETS[i];
        if (gadget) {
          gadgetImages.value[gadget.id] = module.default;
        }
      } catch (error) {
        console.warn(`Could not load gadget image ${i + 1}:`, error);
      }
    }

    // Load cached evaluation results
    await loadCachedResults();

    // Initialize Wrench/Zaptron from hunterStore
    const storeUpgrades = hunterStore.upgrades?.gadgets || {};
    if (storeUpgrades.wrench !== undefined && !store.currentLevels.wrench) {
      store.updateCurrentLevel('wrench', storeUpgrades.wrench);
    }
    if (storeUpgrades.zaptron !== undefined && !store.currentLevels.zaptron) {
      store.updateCurrentLevel('zaptron', storeUpgrades.zaptron);
    }

    // Update tesseracts timestamp
    store.resetTesseractsTimestamp();

    // Check if saved build exists and update
    if (store.settings.selectedBuildId) {
      const buildExists = knoxBuilds.value.some(
        build => String(build.id) === String(store.settings.selectedBuildId)
      );
      
      if (buildExists) {
        updateFromSelectedBuild();
      } else {
        store.updateSelectedBuild('');
      }
    }

    isLoading.value = false;
  } catch (error) {
    console.error('Error loading gadget data:', error);
    loadError.value = error.message;
    isLoading.value = false;
  }
}

async function loadCachedResults() {
  try {
    // Import shouldEvaluate from evaluationCacheService
    const { shouldEvaluate } = await import('@/services/evaluationCacheService');
    
    for (const build of knoxBuilds.value) {
      const cache = await shouldEvaluate({
        hunterId: 'knox',
        buildData: build,
        hunterStore,
        gemPlannerStore
      });
      
      if (cache?.cachedResult) {
        cachedResults.value[build.id] = cache.cachedResult;
      }
    }
  } catch (error) {
    console.error('[GadgetCalculator] Error loading cached results:', error);
  }
}

// Live update interval
let tesseractsUpdateInterval = null;

// ESC key handler for modals
function handleKeydown(event) {
  if (event.key === 'Escape') {
    if (showConfirmModal.value) {
      cancelConfirmModal();
    } else if (showSummaryModal.value) {
      showSummaryModal.value = false;
    } else if (showLevelsModal.value) {
      showLevelsModal.value = false;
    }
  }
}

onMounted(async () => {
  await loadGadgetData();
  
  // Start live update interval
  tesseractsUpdateInterval = setInterval(() => {
    liveUpdateTrigger.value++;
  }, 10000);

  // Add ESC key listener
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  if (tesseractsUpdateInterval) {
    clearInterval(tesseractsUpdateInterval);
    tesseractsUpdateInterval = null;
  }

  // Remove ESC key listener
  document.removeEventListener('keydown', handleKeydown);
});

// Watch for build changes
watch(selectedBuildId, (newBuildId) => {
  if (newBuildId && selectedBuild.value) {
    updateCurrentAnchorFromBuild(selectedBuild.value);
  }
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(31, 41, 55, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.8);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.9);
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.tooltip-arrow::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 20px;
  border: 6px solid transparent;
  border-top-color: rgb(31, 41, 55);
}
</style>
