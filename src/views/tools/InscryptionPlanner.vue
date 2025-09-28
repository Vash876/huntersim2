<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl border border-gray-800 p-4 sm:p-8">
      <!-- Header -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white flex items-center justify-center gap-2">
        Inscryption Planner
      </h2>

      <!-- Hellish-Biomatter Production Box -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <img src="@/assets/borge/loot_mat3.png" class="w-7 h-7 mr-2" alt="Hellish Biomatter" />
            Hellish-Biomatter Production
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
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Reference Build -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Reference Build</div>
              <div class="text-xs text-gray-400 mb-2">Select Borge Build</div>
              <select 
                v-model="selectedBuildId"
                @change="updateFromSelectedBuild"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
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

            <!-- Current HBM -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Current HBM</div>
              <div class="text-xs text-gray-400 mb-2">Amount you have saved</div>
              <SuffixInput
                v-model="currentHBM"
                placeholder="0"
                :focus-ring-class="'focus:ring-red-500'"
                :placeholder-class="'placeholder-red-400'"
                class="w-full text-sm bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <!-- Daily HBM Rate -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Daily HBM Production</div>
              <div class="text-xs text-gray-400 mb-2">Calculated from Build</div>
              <div class="flex items-center bg-gray-800/80 py-2 px-3 rounded-lg border border-gray-700">
                <div class="text-amber-400 text-base font-bold">{{ formatNumber(hellishBiomatterPerDay) }}</div>
                <div>
                  <div v-if="!selectedBuildId" class="ml-2 text-gray-400 text-xs">
                    (select a build)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shopping List Summary -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconChartDots size="18" class="mr-2 text-green-400" />
            Summary
          </h3>
        </div>
        
        <div class="p-2 sm:p-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Total Cost -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Total Cost</div>
              <div class="text-lg font-bold text-yellow-400">
                {{ formatNumber(store.totalShoppingCost) }}
              </div>
            </div>

            <!-- Time to Save -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Time to Save</div>
              <div class="text-lg font-bold text-blue-400">
                {{ formatTimeToSave() }}
              </div>
            </div>

            <!-- Items Count -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Shopping List</div>
              <div class="text-lg font-bold text-white">
                {{ store.shoppingList.length }} Inscryption{{ store.shoppingList.length !== 1 ? 's' : '' }}
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
                ? 'bg-red-700 text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <IconList size="16" />
              <span>Available</span>
              <span class="text-xs bg-red-900/50 px-1.5 py-0.5 rounded">{{ sortedAvailableInscryptions.length }}</span>
            </div>
          </button>
          <button
            @click="activeMobileTab = 'shopping'"
            :class="[
              'flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm',
              activeMobileTab === 'shopping' 
                ? 'bg-blue-700 text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <IconShoppingCart size="16" />
              <span>Shopping</span>
              <span class="text-xs bg-blue-900/50 px-1.5 py-0.5 rounded">{{ store.shoppingList.length }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Content (lg:hidden) -->
      <div class="lg:hidden">
        <!-- Mobile: Available Inscryptions Tab -->
        <div v-if="activeMobileTab === 'available'" class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 p-3 space-y-3 shadow-lg">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-white flex items-center">
              <IconList size="16" class="mr-2 text-red-400" />
              Available Inscryptions
            </h3>
            
            <button 
              @click="showOwnershipModal = true" 
              class="bg-red-700 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconSettings size="12" class="mr-1" />
              Manage
            </button>
          </div>

          <!-- Sort Controls for Mobile -->
          <div class="flex items-center justify-center gap-1 bg-gray-700/50 rounded-lg p-1">
            <button
              @click="sortBy = 'id'"
              :class="[
                'px-2 py-1 text-xs rounded transition-colors flex-1',
                sortBy === 'id' 
                  ? 'bg-red-700 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              ]"
            >
              Sort by ID
            </button>
            <button
              @click="sortBy = 'cost'"
              :class="[
                'px-2 py-1 text-xs rounded transition-colors flex-1',
                sortBy === 'cost' 
                  ? 'bg-red-700 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              ]"
            >
              Sort by Cost
            </button>
            <button
              @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
              class="px-2 py-1 text-xs text-gray-300 hover:text-white transition-colors"
              :title="sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'"
            >
              <IconChevronUp v-if="sortOrder === 'asc'" size="14" />
              <IconChevronDown v-else size="14" />
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="store.isLoading" class="text-center py-6">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-red-400"></div>
            <p class="text-gray-400 mt-2 text-sm">Loading...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="store.error" class="text-center py-6 text-red-400">
            <p class="text-sm">{{ store.error }}</p>
            <button 
              @click="store.loadInscryptionsData()" 
              class="mt-2 px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="sortedAvailableInscryptions.length === 0" class="text-center py-6 text-gray-400">
            <IconList size="32" class="mx-auto mb-3 opacity-50" />
            <p class="text-sm">No inscryptions available</p>
          </div>

          <!-- Inscryptions List - Mobile Compact View -->
          <div v-else class="space-y-2">
            <div 
              v-for="inscryption in sortedAvailableInscryptions"
              :key="`${inscryption.inscryptionId}-${inscryption.rank}`"
              class="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors border border-gray-600/30"
            >
              <!-- Mobile Layout: Icon left, Content right -->
              <div class="flex items-start gap-3">
                <!-- Icon standalone on the left -->
                <div class="w-[50px] h-[50px] bg-gray-600/30 rounded-lg border border-gray-600/50 flex items-center justify-center flex-shrink-0">
                  <img 
                    :src="getInscryptionIconUrl(inscryption.icon || 'default')"
                    :alt="inscryption.description"
                    class="w-[40px] h-[40px] object-contain"
                    @error="$event.target.src = getInscryptionIconUrl('default')"
                  />
                </div>
                
                <!-- Content area -->
                <div class="flex-1 min-w-0">
                  <!-- Header with ID and rank -->
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-mono bg-red-900/50 px-1.5 py-0.5 rounded text-red-300">
                      i{{ inscryption.inscryptionId }}
                    </span>
                    <span class="text-xs bg-gray-600/50 px-1.5 py-0.5 rounded-full text-gray-300 font-mono">
                      {{ inscryption.rank - 1 }}/{{ inscryption.maxRanks }}
                    </span>
                  </div>
                  
                  <!-- Description -->
                  <p class="text-sm font-medium text-white mb-2 leading-tight">
                    {{ inscryption.description }}
                  </p>
                  
                  <!-- Cost and details under description -->
                  <div class="space-y-1">
                    <div class="text-xs text-gray-400">
                      Cost: <span class="text-yellow-400">{{ formatNumber(inscryption.costSci) }}</span>
                    </div>
                    <!-- Hunter-specific Info -->
                    <div v-if="isHunterSpecificInscryption(inscryption.inscryptionId)" class="text-xs text-blue-400 bg-blue-900/20 rounded px-1 py-0.5 inline-block">
                      <IconWorld size="12" class="inline mr-1" />
                    </div>
                    <div v-if="inscryption.buffPerRank" class="text-xs text-green-400">
                      {{ inscryption.buffPerRank }}
                    </div>
                    <div v-if="getShoppingListRanksDisplay(inscryption.inscryptionId)" class="text-xs text-blue-400">
                      In shopping: {{ getShoppingListRanksDisplay(inscryption.inscryptionId) }}
                    </div>
                  </div>
                </div>
                
                <!-- Buy button on the right -->
                <button
                  @click="addToShoppingList(inscryption)"
                  class="text-xs px-2.5 py-1.5 bg-green-700 hover:bg-green-600 rounded transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                >
                  <IconPlus size="12" />
                  Buy {{ inscryption.rank }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: Shopping List Tab -->
        <div v-if="activeMobileTab === 'shopping'" class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 p-3 space-y-3 shadow-lg">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-white flex items-center">
              <IconShoppingCart size="16" class="mr-2 text-blue-400" />
              Shopping List
            </h3>
            
            <button 
              v-if="store.shoppingList.length > 0"
              @click="store.clearShoppingList()" 
              class="bg-red-700 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconTrash size="12" class="mr-1" />
              Clear
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="store.shoppingList.length === 0" class="text-center py-6 text-gray-400">
            <IconShoppingCart size="32" class="mx-auto mb-3 opacity-50" />
            <p class="text-sm">Your shopping list is empty</p>
            <p class="text-xs mt-1">Add inscryptions from the Available tab</p>
          </div>

          <!-- Shopping List Items - Mobile -->
          <div v-else>
            <Draggable
              v-model="store.shoppingList"
              handle=".drag-handle"
              :animation="200"
              @start="onDragStart"
              @end="onShoppingListDragEnd"
              item-key="id"
              class="space-y-2"
            >
              <template #item="{ element: item }">
                <div 
                  class="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50"
                  :class="{
                    'border-2 border-red-500': invalidDragItems.has(item.id),
                    'border border-gray-600/50': !invalidDragItems.has(item.id)
                  }"
                >
                  <!-- Mobile Shopping Item Header -->
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <div class="drag-handle cursor-move text-gray-500 hover:text-gray-400 p-1">
                        <IconGripVertical size="14" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-mono bg-blue-900/50 px-1.5 py-0.5 rounded text-blue-300">
                            i{{ item.inscryptionId }}
                          </span>
                          <span class="text-xs bg-gray-600/50 px-1.5 py-0.5 rounded-full text-gray-300 font-mono">
                            Rank {{ item.rank }}
                          </span>
                        </div>
                        <p class="text-sm font-medium text-white mt-1 leading-tight">
                          {{ truncateDescription(item.description) }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Mobile Shopping Item Details -->
                  <div class="space-y-1">
                    <!-- Cost and Buff in one line -->
                    <div class="flex items-center gap-4 text-xs">
                      <span class="text-gray-400">Cost: <span class="text-yellow-400">{{ formatNumber(item.costSci) }}</span></span>
                      <span v-if="item.buffPerRank" class="text-green-400">{{ item.buffPerRank }}</span>
                    </div>
                    <!-- Hunter-specific Info -->
                    <div v-if="isHunterSpecificInscryption(item.inscryptionId)" class="text-xs text-blue-400 bg-blue-900/20 rounded px-1 py-0.5">
                      <IconWorld size="12" class="inline mr-1" />
                      Automatically updates global Inscryption Rank when purchased
                    </div>
                    
                    <!-- Production Display -->
                    <div v-if="hbmProductionDataMap[item.id]?.currentHBMProduction !== undefined" class="text-xs">
                      <span class="text-gray-400">HBM: </span>
                      <span class="text-blue-400">{{ formatNumber(hbmProductionDataMap[item.id]?.currentHBMProduction) }}/day</span>
                      <span v-if="hbmProductionDataMap[item.id]?.newHBMProduction !== undefined && hbmProductionDataMap[item.id]?.newHBMProduction !== hbmProductionDataMap[item.id]?.currentHBMProduction" class="text-gray-400"> → </span>
                      <span v-if="hbmProductionDataMap[item.id]?.newHBMProduction !== undefined && hbmProductionDataMap[item.id]?.newHBMProduction !== hbmProductionDataMap[item.id]?.currentHBMProduction" class="text-green-400">
                        {{ formatNumber(hbmProductionDataMap[item.id]?.newHBMProduction) }}/day
                      </span>
                    </div>

                    <!-- Evaluation Status -->
                    <div v-if="hbmProductionDataMap[item.id]?.isEvaluating" class="text-xs text-yellow-400 flex items-center gap-1">
                      <div class="animate-spin rounded-full h-3 w-3 border border-yellow-400 border-t-transparent"></div>
                      Evaluating...
                    </div>
                    
                    <div v-else-if="hbmProductionDataMap[item.id]?.needsEvaluation && !hbmProductionDataMap[item.id]?.newHBMProduction" class="text-xs">
                      <button @click="triggerEvaluation(item)" class="text-red-400 hover:text-red-300">
                        Evaluate Impact
                      </button>
                    </div>
                    
                    <!-- Mobile Action Buttons -->
                    <div class="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-700/50">
                      <button
                        @click="markAsPurchased(item)"
                        class="flex items-center gap-1 px-2 py-1 bg-green-700 hover:bg-green-600 rounded text-xs text-white transition-colors"
                        :title="isHunterSpecificInscryption(item.inscryptionId) ? 'Mark as purchased (updates global Hunter level)' : 'Mark as purchased'"
                      >
                        <IconCheck size="12" />
                        <span>Purchased</span>
                      </button>
                      <button
                        @click="store.removeFromShoppingList(item.id)"
                        class="flex items-center gap-1 px-2 py-1 bg-red-700 hover:bg-red-600 rounded text-xs text-white transition-colors"
                        title="Remove from shopping list"
                      >
                        <IconX size="12" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </Draggable>
          </div>
        </div>
      </div>

      <!-- Desktop Content Grid (hidden on mobile) -->
      <div class="hidden lg:grid lg:grid-cols-2 gap-6">
        
        <!-- Available Inscryptions -->
        <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 p-4 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconList size="18" class="mr-2 text-red-400" />
              Available Inscryptions
            </h3>
            
            <div class="flex items-center gap-2">
              <!-- Sort Controls -->
              <div class="flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
                <button
                  @click="sortBy = 'id'"
                  :class="[
                    'px-2 py-1 text-xs rounded transition-colors',
                    sortBy === 'id' 
                      ? 'bg-red-700 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  ]"
                >
                  ID
                </button>
                <button
                  @click="sortBy = 'cost'"
                  :class="[
                    'px-2 py-1 text-xs rounded transition-colors',
                    sortBy === 'cost' 
                      ? 'bg-red-700 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  ]"
                >
                  Cost
                </button>
                <button
                  @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                  class="px-1 py-1 text-xs text-gray-300 hover:text-white transition-colors"
                  :title="sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'"
                >
                  <IconChevronUp v-if="sortOrder === 'asc'" size="14" />
                  <IconChevronDown v-else size="14" />
                </button>
              </div>
              
              <button 
                @click="showOwnershipModal = true" 
                class="bg-red-700 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
              >
                <IconSettings size="12" class="mr-1" />
                Manage Owned
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="store.isLoading" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
            <p class="text-gray-400 mt-2">Loading Inscryption data from Google Sheets...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="store.error" class="text-center py-8 text-red-400">
            <p>{{ store.error }}</p>
            <button 
              @click="store.loadInscryptionsData()" 
              class="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 rounded transition-colors"
            >
              Retry
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="sortedAvailableInscryptions.length === 0" class="text-center py-8 text-gray-400">
            <IconList size="48" class="mx-auto mb-4 opacity-50" />
            <p>No inscryptions available</p>
            <p class="text-sm">All inscryptions are owned or in shopping list</p>
          </div>

          <!-- Inscryptions List -->
          <div v-else class="space-y-2">
            <div 
              v-for="inscryption in sortedAvailableInscryptions"
              :key="`${inscryption.inscryptionId}-${inscryption.rank}`"
              class="bg-gray-700/30 rounded-lg p-3 hover:bg-gray-700/50 transition-colors"
            >
              <div class="flex items-start gap-3">
                <!-- Icon standalone on the left -->
                <div class="w-[35px] h-[35px] flex items-center justify-center flex-shrink-0">
                  <img 
                    :src="getInscryptionIconUrl(inscryption.icon || 'default')"
                    :alt="inscryption.description"
                    class="w-[35px] h-[35px] object-contain"
                    @error="$event.target.src = getInscryptionIconUrl('default')"
                  />
                </div>
                
                <!-- Content area -->
                <div class="flex-1 min-w-0">
                  <!-- Header with ID and Description -->
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-mono bg-red-900/50 px-1.5 py-0.5 rounded text-red-300">
                      i{{ inscryption.inscryptionId }}
                    </span>
                    <span class="text-sm font-medium text-white truncate">
                      {{ inscryption.description }}
                    </span>
                    <span class="text-xs bg-gray-600/50 px-2 py-1 rounded-full text-gray-300 font-mono ml-auto">
                      {{ inscryption.rank - 1 }}/{{ inscryption.maxRanks }}
                    </span>
                  </div>
                  
                  <!-- Cost and details under description -->
                  <div class="flex items-center gap-4 text-xs text-gray-400">
                    <span>Cost: <span class="text-yellow-400">{{ formatNumber(inscryption.costSci) }}</span></span>
                    <!-- Hunter-specific Info -->
                    <span v-if="isHunterSpecificInscryption(inscryption.inscryptionId)" class="text-blue-400 bg-blue-900/20 rounded px-1 py-0.5">
                      <IconWorld size="12" class="inline mr-1" />
                    </span>
                    <span v-if="inscryption.buffPerRank" class="text-green-400">
                      {{ inscryption.buffPerRank }}
                    </span>
                    <span v-if="getShoppingListRanksDisplay(inscryption.inscryptionId)" class="text-blue-400">
                      In cart: {{ getShoppingListRanksDisplay(inscryption.inscryptionId) }}
                    </span>
                  </div>
                </div>

                <!-- Buy Button on the right -->
                <button
                  @click="addToShoppingList(inscryption)"
                  class="text-xs px-3 py-1.5 bg-green-700 hover:bg-green-600 rounded transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0"
                >
                  <IconPlus size="12" />
                  Buy {{ inscryption.rank }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Shopping List -->
        <div class="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-xl border border-gray-700/50 p-4 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconShoppingCart size="18" class="mr-2 text-red-400" />
              Shopping List
              <span class="text-xs text-gray-400 ml-2">({{ store.shoppingList.length }})</span>
            </h3>
            <button 
              v-if="store.shoppingList.length > 0"
              @click="store.clearShoppingList()" 
              class="text-xs px-2 py-1 bg-red-700 hover:bg-red-600 rounded transition-colors"
            >
              Clear All
            </button>
          </div>

          <!-- Empty Shopping List -->
          <div v-if="store.shoppingList.length === 0" class="text-center py-8 text-gray-400">
            <IconShoppingCart size="48" class="mx-auto mb-4 opacity-50" />
            <p>Shopping list is empty</p>
            <p class="text-sm">Add some inscryptions to plan your purchases</p>
          </div>

          <!-- Shopping List Items -->
          <div v-else>
            <Draggable 
              v-model="store.shoppingList"
              tag="div"
              handle=".grip-handle"
              :group="{ name: 'shopping-items' }"
              item-key="id"
              :animation="200"
              ghost-class="ghost"
              chosen-class="chosen"
              drag-class="dragging"
              class="space-y-2"
              @start="onDragStart"
              @end="onShoppingListDragEnd"
            >
              <template #item="{ element: item, index }">
                <div 
                  class="bg-gray-700/30 rounded-lg p-3 transition-all duration-200 hover:bg-gray-700/50"
                  :class="{
                    'border-2 border-red-500': invalidDragItems.has(item.id),
                    'border border-transparent': !invalidDragItems.has(item.id)
                  }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <!-- Grip Handle -->
                      <div class="grip-handle p-1 text-gray-500 hover:text-gray-300 cursor-grab">
                        <IconGripVertical size="16" />
                      </div>
                      
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-xs font-mono bg-red-900/50 px-1.5 py-0.5 rounded text-red-300">
                            i{{ item.inscryptionId }}
                          </span>
                          <span class="text-sm font-medium text-white truncate">
                            {{ truncateDescription(item.description) }}
                          </span>
                          <span class="text-xs bg-blue-900/50 px-1.5 py-0.5 rounded text-blue-300">
                            Rank {{ item.rank }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-400 mb-1">
                          <!-- Hunter-specific Info -->
                          <div v-if="isHunterSpecificInscryption(item.inscryptionId)" class="text-xs text-blue-400 bg-blue-900/20 rounded px-1 py-0.5 mb-1">
                            <IconWorld size="12" class="inline mr-1" />
                            Automatically updates global Inscryption Rank when purchased
                          </div>
                          <span class="text-green-400">{{ item.buffPerRank }}</span>
                        </div>
                        
                        <!-- HBM Production Info -->
                        <div class="text-xs text-gray-500 space-y-1">
                          <div class="flex items-center gap-3">
                            <span>
                              HBM Income: <span class="text-blue-400">{{ formatNumber(hbmProductionDataMap[item.id]?.currentHBMProduction || 0) }}/day</span>
                            </span>
                            
                            <!-- Borge Buff 1 (Simple Multiplier) -->
                            <span v-if="hbmProductionDataMap[item.id]?.hbmMultiplier && !hbmProductionDataMap[item.id]?.needsEvaluation" class="text-green-400">
                              → <span class="text-yellow-400">{{ formatNumber(hbmProductionDataMap[item.id]?.newHBMProduction || 0) }}/day</span>
                            </span>
                            
                            <!-- Borge Buff 2 (Requires Evaluation) -->
                            <span v-if="hbmProductionDataMap[item.id]?.needsEvaluation">
                              <span v-if="hbmProductionDataMap[item.id]?.isEvaluating" class="text-yellow-400 flex items-center gap-1">
                                <div class="inline-block animate-spin rounded-full h-3 w-3 border-b border-yellow-400"></div>
                                {{ hbmProductionDataMap[item.id]?.evaluationProgress || 'Evaluating...' }}
                              </span>
                              <span v-else-if="hbmProductionDataMap[item.id]?.newHBMProduction" class="text-green-400">
                                → <span class="text-yellow-400">{{ formatNumber(hbmProductionDataMap[item.id]?.newHBMProduction || 0) }}/day</span>
                              </span>
                              <button v-else @click="triggerEvaluation(item)" class="text-red-400 hover:text-red-300 text-xs">
                                Evaluate Impact
                              </button>
                            </span>
                          </div>
                          
                          <!-- Enhanced Time Display -->
                          <div class="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-2 pt-2 border-t border-gray-700/50">
                            <!-- Individual item time (if bought alone with current HBM) -->
                            <div 
                              class="bg-blue-700/50 text-blue-200 px-2 py-1 rounded-md text-xs flex items-center gap-1 cursor-help flex-1" 
                              title="Time to afford this item alone with current HBM reserves and production rate"
                            >
                              <IconClock size="12" />
                              <span class="font-medium">Individual:</span>
                              {{ formatItemTimeToSaveWithProduction(item.costSci, hbmProductionDataMap[item.id]?.currentHBMProduction || 0) }}
                            </div>
                            <!-- Cumulative time (considering all previous items in order) -->
                            <div 
                              class="bg-green-700/50 text-green-200 px-2 py-1 rounded-md text-xs flex items-center gap-1 cursor-help flex-1" 
                              title="When this item will be available considering all previous items in shopping queue and production boosts"
                            >
                              <IconChartDots size="12" />
                              <span class="font-medium">In Queue:</span>
                              {{ formatCumulativeTargetDate(index) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Right side: Price + Buttons -->
                    <div class="flex items-center gap-2 ml-4">
                      <div class="text-right">
                        <div class="text-sm font-bold text-yellow-400">
                          {{ formatNumber(item.costSci) }}
                        </div>
                      </div>
                      <button
                        @click="markAsPurchased(item)"
                        class="text-green-400 hover:text-green-300 transition-colors p-1"
                        :title="isHunterSpecificInscryption(item.inscryptionId) ? 'Mark as purchased (updates global Hunter level)' : 'Mark as purchased'"
                      >
                        <IconCheck size="16" />
                      </button>
                      <button
                        @click="store.removeFromShoppingList(item.id)"
                        class="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Remove from shopping list"
                      >
                        <IconX size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </Draggable>

            <!-- Shopping List Summary -->
            <div class="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 mt-4">
              <div class="flex justify-between items-center">
                <span class="font-medium text-white">Total Cost</span>
                <span class="text-lg font-bold text-yellow-400">
                  {{ formatNumber(store.totalShoppingCost) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Credits -->
    <div class="text-center mt-4 pb-2">
      <p class="text-xs text-gray-400">
        Credits to <span class="text-red-300 font-medium">Farns</span> for maintaining the data
      </p>
    </div>

    <!-- Ownership Modal -->
    <InscryptionOwnershipModal
      v-if="showOwnershipModal"
      @close="showOwnershipModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStorage } from '@vueuse/core';
import { 
  IconScript, 
  IconRefresh, 
  IconSettings, 
  IconShoppingCart, 
  IconList, 
  IconPlus, 
  IconX,
  IconChartDots,
  IconClock,
  IconGripVertical,
  IconCheck,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
  IconWorld
} from '@tabler/icons-vue';
import { useInscryptionPlannerStore } from '@/store/inscryptionPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { shouldEvaluate } from '@/services/evaluationCacheService';
import { formatNumber } from '@/composables/format';
import { useBuildEvaluation } from '@/composables/useBuildEvaluation';
import { getInscryptionIconUrl } from '@/utils/inscryptionIconMapping';
import InscryptionOwnershipModal from '@/components/common/inscryption-planner/InscryptionOwnershipModal.vue';
import SuffixInput from '@/composables/SuffixInput.vue';
import Draggable from 'vuedraggable';

const store = useInscryptionPlannerStore();
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();
const showOwnershipModal = ref(false);

// Mobile state
const activeMobileTab = ref('available');

// Sorting state for Available Inscryptions
const sortBy = ref('id'); // 'id' or 'cost'
const sortOrder = ref('asc'); // 'asc' or 'desc'

// New state for HBM production
const cachedResults = ref({});
const selectedBuildId = ref('');
const currentHBM = useStorage('inscryption-planner-current-hbm', 0);

// State for Borge Buff 2 evaluations (similar to UpgradeComparisonModal)
const borgeBuff2Evaluations = ref({});
const evaluatingItems = ref(new Set());
const evaluationProgress = ref({});

// State for visual drag validation warnings
const invalidDragItems = ref(new Set());

// Computed properties for Borge builds
const borgeBuilds = computed(() => {
  return hunterStore.getBuildsForHunter('borge').filter(build => !build.isArchived);
});

const selectedBuild = computed(() => {
  if (!selectedBuildId.value) return null;
  return borgeBuilds.value.find(build => String(build.id) === String(selectedBuildId.value));
});

// Use the build evaluation composable for Borge Buff 2 items (after selectedBuild is defined)
const { 
  evaluateBuildWithParams, 
  isEvaluating
} = useBuildEvaluation({ hunterId: 'borge', buildData: selectedBuild }, () => {});

const hellishBiomatterPerDay = computed(() => {
  if (!selectedBuildId.value) return 0;
  
  const build = selectedBuild.value;
  if (build) {
    const result = cachedResults.value[build.id];
    if (result) {
      const hbmPerRun = result.mat3 || 0;
      const avgRunTimeMinutes = result.avgTime || 120;
      const runsPerDay = 1440 / avgRunTimeMinutes;
      return Math.floor(hbmPerRun * runsPerDay);
    }
  }
  
  return 0;
});

// Sorted Available Inscryptions
const sortedAvailableInscryptions = computed(() => {
  if (!store.availableInscryptions || store.availableInscryptions.length === 0) {
    return [];
  }
  
  const sorted = [...store.availableInscryptions].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy.value === 'cost') {
      comparison = (a.costSci || 0) - (b.costSci || 0);
    } else { // sortBy.value === 'id'
      comparison = (a.inscryptionId || 0) - (b.inscryptionId || 0);
    }
    
    return sortOrder.value === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
});

// Load cached results for Borge builds
async function loadCachedResults() {
  try {
    for (const build of borgeBuilds.value) {
      const cache = await shouldEvaluate({
        hunterId: 'borge',
        buildData: build,
        hunterStore,
        gemPlannerStore
      });
      
      if (cache?.cachedResult) {
        cachedResults.value[build.id] = cache.cachedResult;
      }
    }
  } catch (error) {
    console.error('[InscryptionPlanner] Error loading cached results:', error);
  }
}

// Update from selected build
function updateFromSelectedBuild() {
  if (!selectedBuildId.value) {
    store.settings.hellishBiomatterProduction = 0;
    return;
  }
  
  const build = selectedBuild.value;
  if (build) {
    const result = cachedResults.value[build.id];
    if (result) {
      const hbmPerRun = result.mat3 || 0;
      const avgRunTimeMinutes = result.avgTime || 120;
      const runsPerDay = 1440 / avgRunTimeMinutes;
      const dailyHBM = Math.floor(hbmPerRun * runsPerDay);
      
      store.settings.hellishBiomatterProduction = dailyHBM;
      
      // Save selected build
      localStorage.setItem('inscryption-planner-selectedBuildId', selectedBuildId.value);
    }
  }
}

// Borge Buff 2 Evaluation Functions (similar to UpgradeComparisonModal pattern)
async function evaluateBorgeBuff2Item(item) {
  if (!selectedBuild.value || !item || evaluatingItems.value.has(item.id)) {
    return;
  }

  try {
    evaluatingItems.value.add(item.id);
    evaluationProgress.value[item.id] = 'Preparing evaluation...';

    // Create modified build with this inscryption upgrade - DEEP COPY to avoid modifying original
    const modifiedBuild = JSON.parse(JSON.stringify(selectedBuild.value));
    
    // Apply inscryption upgrade to the build
    if (!modifiedBuild.overrides) {
      modifiedBuild.overrides = {};
    }
    
    // Apply ALL items that come before this item in the shopping list
    const currentItemIndex = store.shoppingList.findIndex(listItem => listItem.id === item.id);
    const previousItems = store.shoppingList.slice(0, currentItemIndex);
    
    // Create a cache key based on actual evaluation parameters, not item.id
    const cacheKeyParts = [
      `i${item.inscryptionId}_rank${item.rank}`,
      ...previousItems
        .filter(prevItem => {
          const prevMetadata = store.inscryptionsData.find(data => data.inscryptionId == prevItem.inscryptionId);
          return prevMetadata && prevMetadata.borgeBuff !== 1; // Only non-multiplier items affect evaluation
        })
        .map(prevItem => `prev_i${prevItem.inscryptionId}_rank${prevItem.rank}`)
    ];
    const evaluationCacheKey = cacheKeyParts.join('|');
    
    // Check if we already have this evaluation cached
    if (borgeBuff2Evaluations.value[evaluationCacheKey]) {
      // Copy cached result to current item's ID for template access
      borgeBuff2Evaluations.value[item.id] = borgeBuff2Evaluations.value[evaluationCacheKey];
      evaluationProgress.value[item.id] = 'Evaluation complete (cached)';
      return;
    }
    
    // Check if any previous Borge Buff 2 items need evaluation first
    const previousBorgeBuff2Items = previousItems.filter(prevItem => {
      const prevMetadata = store.inscryptionsData.find(
        data => data.inscryptionId == prevItem.inscryptionId
      );
      return prevMetadata && prevMetadata.borgeBuff === 2;
    });
    
    // Evaluate missing previous Borge Buff 2 items first
    for (const prevBorgeBuff2Item of previousBorgeBuff2Items) {
      if (!borgeBuff2Evaluations.value[prevBorgeBuff2Item.id] && !evaluatingItems.value.has(prevBorgeBuff2Item.id)) {
        await evaluateBorgeBuff2Item(prevBorgeBuff2Item);
      }
    }
    
    // Don't include Borge Buff 1 items in the evaluation - they're just multipliers we can apply afterwards
    // But DO include other Borge Buff 2 items and non-multiplier inscryptions
    const previousNonMultiplierItems = previousItems.filter(prevItem => {
      const prevMetadata = store.inscryptionsData.find(
        data => data.inscryptionId == prevItem.inscryptionId
      );
      return prevMetadata && prevMetadata.borgeBuff !== 1; // Exclude only Borge Buff 1 (multipliers)
    });
    
    // Apply all previous non-multiplier inscryption upgrades
    previousNonMultiplierItems.forEach((prevItem, prevIndex) => {
      const prevInscryptionKey = `upgrades.inscryptions.i${prevItem.inscryptionId}`;
      let prevCurrentLevel = hunterStore.getUpgradeValue('inscryptions', `i${prevItem.inscryptionId}`) || 0;
      
      // For previous items, we also need to account for any items that came before THEM
      const itemsBeforePrevItem = previousNonMultiplierItems.slice(0, prevIndex);
      const prevSameInscryptionItems = itemsBeforePrevItem.filter(earlierItem => 
        earlierItem.inscryptionId === prevItem.inscryptionId
      );
      
      // Each earlier rank of the same inscryption should increase the level by 1
      prevCurrentLevel += prevSameInscryptionItems.length;
      
      // The target level for this previous item
      const prevTargetLevel = prevCurrentLevel + 1;
      modifiedBuild.overrides[prevInscryptionKey] = prevTargetLevel;
    });
    
    // Use base HBM production for evaluation (no Borge Buff 1 multipliers applied)
    modifiedBuild.overrides['settings.hellishBiomatterProduction'] = store.settings.hellishBiomatterProduction || 0;
    
    // Add the inscryption upgrade (format: upgrades.inscyptions.i{id})
    const inscryptionKey = `upgrades.inscryptions.i${item.inscryptionId}`;
    let currentLevel = hunterStore.getUpgradeValue('inscryptions', `i${item.inscryptionId}`) || 0;
    
    // Check if we've already applied previous ranks of THIS SAME inscryption in the shopping list
    const previousSameInscryptionItems = previousItems.filter(prevItem => 
      prevItem.inscryptionId === item.inscryptionId
    );
    
    // Each previous rank of the same inscryption should increase the level by 1
    currentLevel += previousSameInscryptionItems.length;
    
    // The target level should be: adjusted current level + 1 (for the rank we're buying now)
    const targetLevel = currentLevel + 1;
    modifiedBuild.overrides[inscryptionKey] = targetLevel;

    evaluationProgress.value[item.id] = 'Running evaluation...';

    // Evaluate the modified build
    const evaluationResult = await evaluateBuildWithParams(modifiedBuild);
    
    if (evaluationResult && evaluationResult.mat3) {
      // Store the evaluation result both by cache key (for reuse) and item.id (for template access)
      const resultData = {
        mat3: evaluationResult.mat3,
        avgTime: evaluationResult.avgTime || 120,
        evaluatedAt: Date.now()
      };
      
      borgeBuff2Evaluations.value[evaluationCacheKey] = resultData; // Cache by evaluation params
      borgeBuff2Evaluations.value[item.id] = resultData; // Access by item ID for template
      
      evaluationProgress.value[item.id] = 'Evaluation complete';
    } else {
      throw new Error('Invalid evaluation result');
    }
    
  } catch (error) {
    console.error(`[InscryptionPlanner] Borge Buff 2 evaluation failed for item ${item.id}:`, error);
    evaluationProgress.value[item.id] = 'Evaluation failed';
    
    // Remove failed evaluation after 3 seconds
    setTimeout(() => {
      delete evaluationProgress.value[item.id];
    }, 3000);
  } finally {
    evaluatingItems.value.delete(item.id);
  }
}

// Enhanced shopping list with Borge Buff 2 evaluations
const shoppingListWithAdvancedHBMProduction = computed(() => {
  // Safety check: ensure store data is loaded
  if (!store.shoppingList || store.shoppingList.length === 0) {
    return [];
  }
  
  if (!store.inscryptionsData || store.inscryptionsData.length === 0) {
    return store.shoppingList.map(item => ({ ...item, currentHBMProduction: 0, newHBMProduction: 0 }));
  }

  // Start with base HBM production and calculate everything ourselves
  let currentHBMProduction = store.settings.hellishBiomatterProduction || 0;
  
  return store.shoppingList.map((item, index) => {
    const enhancedItem = { 
      ...item, 
      currentHBMProduction,
      newHBMProduction: currentHBMProduction,
      hbmIncrease: 0
    };
    
    try {
      // Safety check: ensure inscryptions data is available
      if (!store.inscryptionsData || store.inscryptionsData.length === 0) {
        return enhancedItem;
      }
      
      // Find the inscryption metadata (borgeBuff info is in Rank 1)
      const inscryptionMetadata = store.inscryptionsData.find(
        data => data.inscryptionId == item.inscryptionId
      );
      
      // Debug: Log what we're looking for vs what's available
      if (!inscryptionMetadata) {
        return enhancedItem;
      }
      
      if (inscryptionMetadata) {
        // Handle Borge Buff = 1 items (HBM multipliers)
        if (inscryptionMetadata.borgeBuff === 1) {
          const buffString = inscryptionMetadata.buffPerRank || '';
          
          // Find ALL multipliers in the string (e.g., "x1.05;x1.10" should find both 1.05 and 1.10)
          const multiplierMatches = buffString.match(/x?(\d+\.?\d*)/g);
          
          if (multiplierMatches && multiplierMatches.length > 0) {
            // Calculate combined multiplier by multiplying all found multipliers
            let combinedMultiplier = 1.0;
            const individualMultipliers = [];
            
            multiplierMatches.forEach(match => {
              const cleanMatch = match.replace('x', '');
              const multiplier = parseFloat(cleanMatch);
              if (!isNaN(multiplier)) {
                combinedMultiplier *= multiplier;
                individualMultipliers.push(multiplier);
              }
            });
            
            const newHBMProduction = Math.floor(currentHBMProduction * combinedMultiplier);
            
            enhancedItem.newHBMProduction = newHBMProduction;
            enhancedItem.hbmMultiplier = combinedMultiplier;
            enhancedItem.hbmIncrease = newHBMProduction - currentHBMProduction;
            currentHBMProduction = newHBMProduction;
          }
        }
        // Handle Borge Buff = 2 items (require evaluation)
        else if (inscryptionMetadata.borgeBuff === 2) {
          const evaluation = borgeBuff2Evaluations.value[item.id];
          const isEvaluating = evaluatingItems.value.has(item.id);
          const progress = evaluationProgress.value[item.id];
          
          enhancedItem.needsEvaluation = true;
          enhancedItem.isEvaluating = isEvaluating;
          enhancedItem.evaluationProgress = progress;
          
          if (evaluation && !isEvaluating) {
            // Take the mat3 result from evaluation
            let baseMat3 = evaluation.mat3 || 0;
            
            // Find all previous Borge Buff 1 items and calculate their combined multiplier
            const currentItemIndex = store.shoppingList.findIndex(listItem => listItem.id === item.id);
            const previousItems = store.shoppingList.slice(0, currentItemIndex);
            
            let borgeBuff1Multiplier = 1.0;
            previousItems.forEach(prevItem => {
              const prevMetadata = store.inscryptionsData.find(data => data.inscryptionId == prevItem.inscryptionId);
              if (prevMetadata && prevMetadata.borgeBuff === 1) {
                const buffString = prevMetadata.buffPerRank || '';
                const multiplierMatches = buffString.match(/x?(\d+\.?\d*)/g);
                if (multiplierMatches && multiplierMatches.length > 0) {
                  let itemMultiplier = 1.0;
                  multiplierMatches.forEach(match => {
                    const cleanMatch = match.replace('x', '');
                    const multiplier = parseFloat(cleanMatch);
                    if (!isNaN(multiplier)) {
                      itemMultiplier *= multiplier;
                    }
                  });
                  borgeBuff1Multiplier *= itemMultiplier;
                }
              }
            });
            
            // Apply Borge Buff 1 multiplier to the mat3 result
            const boostedMat3 = baseMat3 * borgeBuff1Multiplier;
            
            // Convert to daily HBM production
            const avgRunTimeMinutes = evaluation.avgTime || 120;
            const runsPerDay = 1440 / avgRunTimeMinutes;
            const itemHBMProduction = Math.floor(boostedMat3 * runsPerDay);
            
            // Borge Buff 2 replaces the current production (doesn't add to it)
            enhancedItem.newHBMProduction = itemHBMProduction;
            enhancedItem.hbmIncrease = itemHBMProduction - currentHBMProduction;
            currentHBMProduction = itemHBMProduction;
          } else if (!evaluation && !isEvaluating && selectedBuild.value) {
            // Trigger evaluation for this item with current cumulative HBM
            evaluateBorgeBuff2Item(item);
          }
        }
      }
      
    } catch (error) {
      console.error('Error processing HBM production for item:', item.id, error);
    }
    
    return enhancedItem;
  });
});// Create a map for easier template access
const hbmProductionDataMap = computed(() => {
  try {
    const map = {};
    if (shoppingListWithAdvancedHBMProduction.value && Array.isArray(shoppingListWithAdvancedHBMProduction.value)) {
      shoppingListWithAdvancedHBMProduction.value.forEach((item, index) => {
        if (item && item.id) {
          map[item.id] = item;
        }
      });
    }
    return map;
  } catch (error) {
    console.error('Error creating HBM production data map:', error);
    return {};
  }
});

// Function to manually trigger evaluation for a specific item
function triggerEvaluation(item) {
  evaluateBorgeBuff2Item(item);
}

// Initialize store data
onMounted(async () => {
  // Initialize hunter store for Borge first
  if (!hunterStore.hunterBuilds || !hunterStore.hunterBuilds.borge || hunterStore.hunterBuilds.borge.length === 0) {
    await hunterStore.initHunterConfig('borge');
  }
  
  // Load cached results early (independent of inscryption data)
  await loadCachedResults();
  
  // Load saved build selection early (independent of inscryption data)
  const savedBuildId = localStorage.getItem('inscryption-planner-selectedBuildId');
  if (savedBuildId) {
    const buildExists = borgeBuilds.value.some(build => String(build.id) === String(savedBuildId));
    if (buildExists) {
      selectedBuildId.value = savedBuildId;
      updateFromSelectedBuild();
    }
  }
  
  // Initialize inscryption planner store and sync global inscryptions (can be async)
  // This doesn't need to block the HBM production display
  store.initialize(hunterStore);
});

// Functions
function resetProduction() {
  store.settings.hellishBiomatterProduction = 0;
  selectedBuildId.value = '';
  localStorage.removeItem('inscryption-planner-selectedBuildId');
}

// Truncate description to specified length
function truncateDescription(description, maxLength = 40) {
  if (!description) return '';
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
}

function formatTimeToSave() {
  if (store.shoppingList.length === 0) return 'No items';
  if (hellishBiomatterPerDay.value <= 0) return 'Set production rate';
  
  // Berechne kumulative Zeit basierend auf dynamischen HBM-Produktions-Änderungen
  let cumulativeDays = 0;
  let availableHBM = currentHBM.value || 0;
  let currentDailyProduction = hellishBiomatterPerDay.value;
  
  // Gehe durch alle Items und berechne die benötigte Zeit
  for (let i = 0; i < store.shoppingList.length; i++) {
    const item = store.shoppingList[i];
    if (!item) continue;
    
    // Wie viel HBM brauchen wir noch für dieses Item?
    const remainingCost = Math.max(0, item.costSci - availableHBM);
    
    if (remainingCost > 0) {
      if (currentDailyProduction <= 0) {
        return 'Set production rate';
      }
      
      // Berechne die Tage, die wir warten müssen
      const daysForThisItem = remainingCost / currentDailyProduction;
      cumulativeDays += daysForThisItem;
      
      // Nach dem Warten haben wir genug HBM produziert
      availableHBM += daysForThisItem * currentDailyProduction;
    }
    
    // Nach dem Kauf dieses Items:
    // 1. Verfügbares HBM wird um die Kosten reduziert
    availableHBM -= item.costSci;
    
    // 2. Schaue nach, ob dieses Item die Produktion erhöht (Borge Buff 1 oder 2)
    const itemHBMData = hbmProductionDataMap.value[item.id];
    if (itemHBMData && itemHBMData.newHBMProduction > currentDailyProduction) {
      currentDailyProduction = itemHBMData.newHBMProduction;
    }
  }
  
  if (cumulativeDays === Infinity) return 'Never';
  if (cumulativeDays > 36500) return '☠️';
  if (cumulativeDays <= 0) return 'Available now';
  
  if (cumulativeDays > 365) {
    const years = Math.floor(cumulativeDays / 365);
    const remainingDays = cumulativeDays % 365;
    const months = Math.floor(remainingDays / 30);
    
    if (months === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years}y ${months}mo`;
    }
  }
  
  if (cumulativeDays > 60) {
    return `${Math.floor(cumulativeDays)} days`;
  }
  
  const fullDays = Math.floor(cumulativeDays);
  const hours = Math.round((cumulativeDays - fullDays) * 24);
  
  if (fullDays === 0) {
    return `${hours}h`;
  } else if (hours === 0) {
    return `${fullDays}d`;
  } else {
    return `${fullDays}d ${hours}h`;
  }
}

// Funktion für einzelne Items - Zeit bis zum Sparen
function formatItemTimeToSave(itemCost) {
  const dailyProduction = hellishBiomatterPerDay.value;
  const current = currentHBM.value || 0;
  
  if (itemCost <= 0) return 'Free';
  if (dailyProduction <= 0) return 'Set production';
  
  // Berücksichtige bereits gesammeltes HBM
  const remainingCost = Math.max(0, itemCost - current);
  if (remainingCost <= 0) return 'Available now';
  
  const days = remainingCost / dailyProduction;
  
  if (days === Infinity) return 'Never';
  if (days > 36500) return '☠️';
  
  if (days > 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    
    if (months === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years}y ${months}mo`;
    }
  }
  
  if (days > 60) {
    return `${Math.floor(days)} days`;
  }
  
  const fullDays = Math.floor(days);
  const hours = Math.round((days - fullDays) * 24);
  
  if (fullDays === 0) {
    return `${hours}h`;
  } else if (hours === 0) {
    return `${fullDays}d`;
  } else {
    return `${fullDays}d ${hours}h`;
  }
}

// Funktion für einzelne Items - Ziel-Datum/Zeit
function formatItemTargetDate(itemCost) {
  const dailyProduction = hellishBiomatterPerDay.value;
  const current = currentHBM.value || 0;
  
  if (itemCost <= 0) return 'Available now';
  if (dailyProduction <= 0) return 'Set production rate';
  
  // Berücksichtige bereits gesammeltes HBM
  const remainingCost = Math.max(0, itemCost - current);
  if (remainingCost <= 0) return 'Available now';
  
  const days = remainingCost / dailyProduction;
  
  if (days === Infinity || days > 36500) return 'Never';
  
  const now = new Date();
  const targetDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // Verwende das Browser-Locale des Nutzers
  const userLocale = navigator.language || 'en-US';
  
  // Wenn das Ziel in weniger als 24 Stunden ist, zeige Datum + Uhrzeit
  if (days < 1) {
    return targetDate.toLocaleDateString(userLocale, {
      day: '2-digit',
      month: '2-digit'
    }) + ' ' + targetDate.toLocaleTimeString(userLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Wenn das Ziel in weniger als 7 Tagen ist, zeige Wochentag + Datum + Uhrzeit
  if (days < 7) {
    return targetDate.toLocaleDateString(userLocale, {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    }) + ' ' + targetDate.toLocaleTimeString(userLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Für längere Zeiträume nur das Datum
  return targetDate.toLocaleDateString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function addToShoppingList(inscryption) {
  store.addToShoppingList(inscryption);
}

// Funktionen für Zeitberechnung mit spezifischer HBM Production
function formatItemTimeToSaveWithProduction(itemCost, hbmProduction) {
  const current = currentHBM.value || 0;
  
  if (itemCost <= 0) return 'Free';
  if (hbmProduction <= 0) return 'Set production';
  
  // Berücksichtige bereits gesammeltes HBM
  const remainingCost = Math.max(0, itemCost - current);
  if (remainingCost <= 0) return 'Available now';
  
  const days = remainingCost / hbmProduction;
  
  if (days === Infinity) return 'Never';
  if (days > 36500) return '☠️';
  
  if (days > 365) {
    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    
    if (months === 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${years}y ${months}mo`;
    }
  }
  
  if (days > 60) {
    return `${Math.floor(days)} days`;
  }
  
  const fullDays = Math.floor(days);
  const hours = Math.round((days - fullDays) * 24);
  
  if (fullDays === 0) {
    return `${hours}h`;
  } else if (hours === 0) {
    return `${fullDays}d`;
  } else {
    return `${fullDays}d ${hours}h`;
  }
}

function formatItemTargetDateWithProduction(itemCost, hbmProduction) {
  const current = currentHBM.value || 0;
  
  if (itemCost <= 0) return 'Available now';
  if (hbmProduction <= 0) return 'Set production rate';
  
  // Berücksichtige bereits gesammeltes HBM
  const remainingCost = Math.max(0, itemCost - current);
  if (remainingCost <= 0) return 'Available now';
  
  const days = remainingCost / hbmProduction;
  
  if (days === Infinity || days > 36500) return 'Never';
  
  const now = new Date();
  const targetDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // Verwende das Browser-Locale des Nutzers
  const userLocale = navigator.language || 'en-US';
  
  // Wenn das Ziel in weniger als 24 Stunden ist, zeige Datum + Uhrzeit
  if (days < 1) {
    return targetDate.toLocaleDateString(userLocale, {
      day: '2-digit',
      month: '2-digit'
    }) + ' ' + targetDate.toLocaleTimeString(userLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Wenn das Ziel in weniger als 7 Tagen ist, zeige Wochentag + Datum + Uhrzeit
  if (days < 7) {
    return targetDate.toLocaleDateString(userLocale, {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    }) + ' ' + targetDate.toLocaleTimeString(userLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Für längere Zeiträume nur das Datum
  return targetDate.toLocaleDateString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Berechnet die kumulative Zeit bis ein Item in der Shopping List dran ist
function formatCumulativeTargetDate(itemIndex) {
  let cumulativeDays = 0;
  let availableHBM = currentHBM.value || 0; // Start with current available HBM
  let currentDailyProduction = hellishBiomatterPerDay.value; // Start with base production
  
  // Gehe durch alle Items bis zum gewünschten Index (inklusive)
  for (let i = 0; i <= itemIndex; i++) {
    const item = store.shoppingList[i];
    if (!item) continue;
    
    // Wie viel HBM brauchen wir noch für dieses Item?
    const remainingCost = Math.max(0, item.costSci - availableHBM);
    
    if (remainingCost > 0) {
      if (currentDailyProduction <= 0) {
        return 'Set production rate';
      }
      
      // Berechne die Tage, die wir warten müssen
      const daysForThisItem = remainingCost / currentDailyProduction;
      cumulativeDays += daysForThisItem;
      
      // Nach dem Warten haben wir genug HBM produziert
      availableHBM += daysForThisItem * currentDailyProduction;
    }
    
    // Nach dem Kauf dieses Items:
    // 1. Verfügbares HBM wird um die Kosten reduziert
    availableHBM -= item.costSci;
    
    // 2. Schaue nach, ob dieses Item die Produktion erhöht
    const itemHBMData = hbmProductionDataMap.value[item.id];
    if (itemHBMData && itemHBMData.newHBMProduction > currentDailyProduction) {
      currentDailyProduction = itemHBMData.newHBMProduction;
    }
  }
  
  if (cumulativeDays === Infinity || cumulativeDays > 36500) return 'Never';
  if (cumulativeDays <= 0) return 'Available now';
  
  const now = new Date();
  const targetDate = new Date(now.getTime() + (cumulativeDays * 24 * 60 * 60 * 1000));
  const userLocale = navigator.language || 'en-US';
  
  // Zeige Zeit nur wenn es in weniger als 7 Tagen ist
  if (cumulativeDays < 7) {
    return targetDate.toLocaleDateString(userLocale, {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    }) + ' ' + targetDate.toLocaleTimeString(userLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return targetDate.toLocaleDateString(userLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Handler für "Mark as Purchased" - fügt Item zu owned hinzu und entfernt es aus der Shopping List
function markAsPurchased(item) {
  const inscryptionId = item.inscryptionId;
  const rank = item.rank;
  
  // Prüfe ob es eine hunterspezifische Inscryption ist
  const isHunterSpecific = isHunterSpecificInscryption(inscryptionId);
  
  if (isHunterSpecific) {
    // Für hunterspezifische Inscryptions: Aktualisiere den globalen Hunter Store
    // Das Planner Modal synct automatisch vom Hunter Store
    const currentLevel = hunterStore.getUpgradeValue('inscryptions', `i${inscryptionId}`) || 0;
    const newLevel = Math.max(currentLevel, rank); // Setze auf den höchsten Rang
    hunterStore.updateUpgrade('inscryptions', `i${inscryptionId}`, newLevel);
  } else {
    // Für globale Inscryptions: Aktualisiere den Planner Store wie bisher
    const currentOwnedRanks = store.getOwnedRanksForInscryption(inscryptionId);
    
    if (!currentOwnedRanks.includes(rank)) {
      const updatedOwnedRanks = [...currentOwnedRanks, rank].sort((a, b) => a - b);
      
      // Aktualisiere die owned inscryptions
      const newOwnership = { 
        ...store.ownedInscryptions, 
        [inscryptionId]: updatedOwnedRanks 
      };
      store.updateOwnedInscryptions(newOwnership);
    }
  }
  
  // Entferne das Item aus der Shopping List
  store.removeFromShoppingList(item.id);
}

// Hilfsfunktion um zu prüfen ob eine Inscryption hunterspezifisch ist
function isHunterSpecificInscryption(inscryptionId) {
  // Diese Inscryptions sind hunterspezifisch basierend auf den Konstanten
  const hunterSpecificInscryptions = [
    3, 4, 11, 13, 14, 23, 24, 27,    // Borge
    31, 32, 33, 36, 37, 40,          // Ozzy  
    44, 60, 80, 81, 84, 86, 87, 88, 89, 91, 92, // Borge/Ozzy mix
    103, 104, 105                    // Borge/Ozzy/Knox
  ];
  
  return hunterSpecificInscryptions.includes(parseInt(inscryptionId));
}

// Backup der ursprünglichen Liste vor dem Drag
let dragBackup = [];

// Handler für Drag-Start - speichere die ursprüngliche Reihenfolge
function onDragStart(evt) {
  dragBackup = [...store.shoppingList];
}

// Validiert ob die aktuelle Reihenfolge für jede Inscryption korrekt ist
function validateInscryptionOrder() {
  const inscryptionGroups = {};
  const invalidItems = new Set();
  
  // Gruppiere Items nach Inscryption ID
  store.shoppingList.forEach((item, index) => {
    if (!inscryptionGroups[item.inscryptionId]) {
      inscryptionGroups[item.inscryptionId] = [];
    }
    inscryptionGroups[item.inscryptionId].push({ item, index });
  });
  
  // Prüfe jede Gruppe
  for (const [inscryptionId, items] of Object.entries(inscryptionGroups)) {
    if (items.length > 1) {
      // Sortiere nach Position in der Liste
      items.sort((a, b) => a.index - b.index);
      
      // Prüfe ob die Ranks in aufsteigender Reihenfolge sind
      for (let i = 1; i < items.length; i++) {
        const prevRank = items[i - 1].item.rank;
        const currentRank = items[i].item.rank;
        
        if (currentRank <= prevRank) {
          // Markiere beide betroffenen Items als invalid
          invalidItems.add(items[i - 1].item.id);
          invalidItems.add(items[i].item.id);
        }
      }
    }
  }
  
  return { isValid: invalidItems.size === 0, invalidItems };
}

// Handler für das Drag-Ende-Event der Shopping List
function onShoppingListDragEnd() {
  
  // Validiere die neue Reihenfolge
  const validation = validateInscryptionOrder();
  
  if (!validation.isValid) {
    
    // Zeige visuelle Warnung für betroffene Items
    invalidDragItems.value = validation.invalidItems;
    
    // Stelle die ursprüngliche Reihenfolge wieder her
    store.shoppingList.splice(0, store.shoppingList.length, ...dragBackup);
    
    // Entferne die visuelle Warnung nach 1 Sekunde
    setTimeout(() => {
      invalidDragItems.value.clear();
    }, 1000);
    
    return;
  }
  
  
  // Clear all Borge Buff 2 evaluations since the order changed
  borgeBuff2Evaluations.value = {};
  evaluatingItems.value.clear();
  evaluationProgress.value = {};
  
  // Force reactivity update
  const updatedList = shoppingListWithAdvancedHBMProduction.value;
}

function getOwnedRanksDisplay(inscryptionId) {
  const ownedRanks = store.getOwnedRanksForInscryption(inscryptionId);
  if (ownedRanks.length === 0) return '';
  
  // Sort and format ranks
  const sortedRanks = [...ownedRanks].sort((a, b) => a - b);
  
  // Group consecutive ranks
  const groups = [];
  let start = sortedRanks[0];
  let end = start;
  
  for (let i = 1; i < sortedRanks.length; i++) {
    if (sortedRanks[i] === end + 1) {
      end = sortedRanks[i];
    } else {
      groups.push(start === end ? `${start}` : `${start}-${end}`);
      start = end = sortedRanks[i];
    }
  }
  groups.push(start === end ? `${start}` : `${start}-${end}`);
  
  return groups.join(', ');
}

function getShoppingListRanksDisplay(inscryptionId) {
  const shoppingRanks = store.shoppingList
    .filter(item => item.inscryptionId === inscryptionId)
    .map(item => item.rank)
    .sort((a, b) => a - b);
    
  if (shoppingRanks.length === 0) return '';
  
  // Group consecutive ranks
  const groups = [];
  let start = shoppingRanks[0];
  let end = start;
  
  for (let i = 1; i < shoppingRanks.length; i++) {
    if (shoppingRanks[i] === end + 1) {
      end = shoppingRanks[i];
    } else {
      groups.push(start === end ? `${start}` : `${start}-${end}`);
      start = end = shoppingRanks[i];
    }
  }
  groups.push(start === end ? `${start}` : `${start}-${end}`);
  
  return groups.join(', ');
}

// Handle ESC key for modal
function handleKeydown(event) {
  if (event.key === 'Escape' && showOwnershipModal.value) {
    showOwnershipModal.value = false;
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

/* Draggable Animations */
.flip-list-move {
  transition: transform 0.5s;
}

.flip-list-enter-active, 
.flip-list-leave-active {
  transition: all 0.5s;
}

.flip-list-enter-from, 
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.ghost {
  opacity: 0.5;
  background-color: rgba(51, 51, 51, 0.3) !important;
  border: 1px dashed rgba(156, 163, 175, 0.7) !important;
}

.chosen {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.dragging {
  opacity: 0.8;
}

.grip-handle {
  cursor: grab;
}

.grip-handle:active {
  cursor: grabbing;
}
</style>
