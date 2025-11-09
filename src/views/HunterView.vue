<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/HunterView.vue -->
<template>
  <div class="px-0.5 py-4 container mx-auto">
    <!-- Top Section mit integriertem Header und Aktionsleiste -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <!-- Header mit Farb-Gradient -->
      <div :class="`bg-gradient-to-r ${getGradientColors()} px-5 py-5 sm:py-0.5 border-b border-gray-600`">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <!-- Hunter-Bild -->
            <div class="hidden sm:flex items-center justify-center">
              <img 
                :src="hunterImage" 
                :alt="currentHunter.name" 
                class="object-contain rounded-lg select-none"
                style="filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));"
                @click="handleHunterImageClick"
                draggable="false"
              />
            </div>
            
            <!-- Titel und Beschreibung -->
            <div>
              <h1 class="text-2xl font-bold mb-1 text-shadow-lg/40">{{ currentHunter.name }} Simulator</h1>
              <p class="text-sm text-gray-300 text-shadow-lg/30">Compare builds and optimize your performance</p>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="flex flex-row flex-wrap justify-end gap-2">
            <!-- Stats -->
            <button
              @click="openStatsModal"
              class="flex items-center space-x-1 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconChartArrowsVertical size="16" />
              <span>{{ currentHunter.name }} Stats</span>
            </button>

            <!-- New Build -->
            <button
              @click="openBuildModal"
              class="flex items-center space-x-1 px-3 py-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconPlus size="16" />
              <span>New Build</span>
            </button>

            <!-- Import -->
            <button
              @click="openBuildCodeModal"
              class="flex items-center space-x-1 px-3 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold shadow-lg transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconDownload size="16" />
              <span>Import</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Settings Bar -->
      <div class="bg-gray-800 py-3 px-4 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400">Settings:</span>
          
          <!-- Iterations -->
          <button
            class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
            @click="openIterationsModal"
          >
            <IconRepeat size="14" class="text-blue-400" />
            <span>{{ iterationValue }} iterations</span>
          </button>
          
          <!-- Manage Categories Button -->
          <button 
            @click="openCategoryManagementModal"
            class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
          >
            <IconFolder size="14" class="text-blue-400" />
            <span>Manage Categories</span>
          </button>
          
          <!-- Statistics -->
          <div class="hidden md:flex items-center gap-2">
            <button
              @click="setDisplayMode('Vertical')"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors"
              :class="displaySettings.displayMode === 'Vertical' ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'"
              title="Vertical View"
            >
              <IconLayoutDistributeVertical size="14" class="text-blue-400" />
              <span>Vertical</span>
            </button>
            <button
              @click="setDisplayMode('Horizontal')"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors"
              :class="displaySettings.displayMode === 'Horizontal' ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'"
              title="Horizontal View"
            >
              <IconLayoutDistributeHorizontal size="14" class="text-blue-400" />
              <span>Horizontal</span>
            </button>
          </div>
        </div>
        
        <!-- Build Filter Switch -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <!-- Temporary Upgrades Dropdown - Mobile: eigene Zeile, Desktop: inline -->
          <div class="w-full sm:w-auto">
            <TemporaryUpgradesDropdown 
              :hunterId="currentHunter?.id"
              @upgradeChanged="handleUpgradeChanged"
            />
          </div>
          
          <!-- View Controls -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button 
              @click="showLootFilterModal = true"
              class="md:hidden flex items-center space-x-1 px-3 py-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors duration-200 text-xs sm:text-sm"
            >
              <IconFilter size="14" class="text-blue-400" />
              <span>Loot Filter</span>
            </button>        
          </div>
        </div>
      </div>
    </div>
    
    <!-- Category Tabs - Horizontal Scrollable -->
    <div v-if="builds.length > 0 && buildFilterMode === 'active'" class="mb-4">
      <!-- Main Categories -->
      <div class="flex items-stretch bg-gray-900 border-b border-gray-700 rounded-t-lg overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <!-- System Categories -->
        <template v-for="category in systemCategories" :key="category.id">
          <div
            @drop="onCategoryDrop($event, category.id)"
            @dragover="onCategoryDragOver($event, category.id)"
            @dragenter="onCategoryDragEnter($event, category.id)"
            @dragleave="onCategoryDragLeave($event, category.id)"
            class="category-drop-zone relative flex-shrink-0"
            :data-category-id="category.id"
          >
            <!-- Drag Action Indicators -->
            <div v-if="draggedBuildId && dropTargetCategoryId === category.id" class="absolute inset-0 flex pointer-events-none z-20">
              <!-- Left Half - Move -->
              <div class="w-1/2 flex items-center justify-center">
                <div v-if="dragAction === 'move'" class="bg-blue-500/90 text-white px-2 py-1 rounded shadow-lg flex items-center gap-1">
                  <IconArrowBarToDown size="14" />
                  <span class="font-semibold text-xs">Move</span>
                </div>
              </div>
              <!-- Right Half - Copy -->
              <div class="w-1/2 flex items-center justify-center">
                <div v-if="dragAction === 'copy'" class="bg-green-500/90 text-white px-2 py-1 rounded shadow-lg flex items-center gap-1">
                  <IconCopy size="14" />
                  <span class="font-semibold text-xs">Copy</span>
                </div>
              </div>
            </div>
            
            <button
              @click="selectCategory(category.id)"
              class="relative px-4 py-3 font-semibold text-sm transition-all duration-200 border-r border-gray-800 group whitespace-nowrap"
              :class="selectedCategoryId === category.id || getSubCategories(category.id).some(sub => sub.id === selectedCategoryId)
                ? `bg-gray-800 text-white` 
                : `text-gray-500 hover:text-gray-300 hover:bg-${category.color}-900/20`"
            >
              <div class="flex items-center gap-2">
                <IconFolder 
                  size="18" 
                  :class="selectedCategoryId === category.id || getSubCategories(category.id).some(sub => sub.id === selectedCategoryId) 
                    ? `text-${category.color}-400` 
                    : 'text-gray-600 group-hover:text-gray-500'" 
                />
                <span>{{ category.name }}</span>
                <div 
                  class="ml-2 px-2.5 py-0.5 text-xs font-bold rounded-md"
                  :class="selectedCategoryId === category.id || getSubCategories(category.id).some(sub => sub.id === selectedCategoryId)
                    ? `bg-${category.color}-500/20 text-${category.color}-300 border border-${category.color}-500/30` 
                    : 'bg-gray-800 text-gray-600 border border-gray-700'"
                >
                  {{ getCategoryBuildCount(category.id) }}
                </div>
              </div>
              
              <!-- Bottom accent line -->
              <div 
                v-if="selectedCategoryId === category.id || getSubCategories(category.id).some(sub => sub.id === selectedCategoryId)"
                class="absolute bottom-0 left-0 right-0 h-1 rounded-t-sm"
                :class="`bg-${category.color}-500`"
              ></div>
            </button>
          </div>
        </template>
        
        <!-- Spacer -->
        <div v-if="customRootCategories.length > 0" class="w-px bg-gray-700"></div>
        
        <!-- Custom Categories -->
        <template v-for="category in customRootCategories" :key="category.id">
          <div
            @drop="onCategoryDrop($event, category.id)"
            @dragover="onCategoryDragOver($event, category.id)"
            @dragenter="onCategoryDragEnter($event, category.id)"
            @dragleave="onCategoryDragLeave($event, category.id)"
            class="category-drop-zone relative flex-shrink-0"
            :data-category-id="category.id"
          >
            <!-- Drag Action Indicators -->
            <div v-if="draggedBuildId && dropTargetCategoryId === category.id" class="absolute inset-0 flex pointer-events-none z-20">
              <!-- Left Half - Move -->
              <div class="w-1/2 flex items-center justify-center">
                <div v-if="dragAction === 'move'" class="bg-blue-500/90 text-white px-2 py-1 rounded shadow-lg flex items-center gap-1">
                  <IconArrowBarToDown size="14" />
                  <span class="font-semibold text-xs">Move</span>
                </div>
              </div>
              <!-- Right Half - Copy -->
              <div class="w-1/2 flex items-center justify-center">
                <div v-if="dragAction === 'copy'" class="bg-green-500/90 text-white px-2 py-1 rounded shadow-lg flex items-center gap-1">
                  <IconCopy size="14" />
                  <span class="font-semibold text-xs">Copy</span>
                </div>
              </div>
            </div>
            
            <button
              @click="selectCategory(category.id)"
              class="relative px-4 py-3 font-semibold text-sm transition-all duration-200 border-r border-gray-800 group whitespace-nowrap"
              :class="selectedCategoryId === category.id || getSubCategories(category.id).some(sub => sub.id === selectedCategoryId)
                ? `bg-gray-800 text-white` 
                : `text-gray-500 hover:text-gray-300 hover:bg-${category.color}-900/20`"
            >
              <div class="flex items-center gap-2">
                <IconFolder 
                  size="18" 
                  :class="selectedCategoryId === category.id || getSubCategories(category.id).some(sub => sub.id === selectedCategoryId) 
                    ? `text-${category.color}-400` 
                    : 'text-gray-600 group-hover:text-gray-500'" 
                />
                <span>{{ category.name }}</span>
                <div 
                  class="ml-2 px-2.5 py-0.5 text-xs font-bold rounded-md"
                  :class="selectedCategoryId === category.id || getSubCategories(category.id).some(sub => sub.id === selectedCategoryId)
                    ? `bg-${category.color}-500/20 text-${category.color}-300 border border-${category.color}-500/30` 
                    : 'bg-gray-800 text-gray-600 border border-gray-700'"
                >
                  {{ getCategoryBuildCount(category.id) }}
                </div>
                
                <!-- Override Icon -->
                <button
                  @click.stop="openCategoryOverrideModal(category)"
                  class="ml-auto p-1 rounded hover:bg-gray-700/50 transition-colors"
                  :title="`Category Overrides for ${category.name}`"
                >
                  <IconAdjustmentsHorizontal 
                    size="14" 
                    :class="categoryHasOverrides(category.id) ? 'text-purple-400' : 'text-gray-500'"
                  />
                </button>
              </div>
              
              <!-- Bottom accent line -->
              <div 
                v-if="selectedCategoryId === category.id || getSubCategories(category.id).some(sub => sub.id === selectedCategoryId)"
                class="absolute bottom-0 left-0 right-0 h-1 rounded-t-sm"
                :class="`bg-${category.color}-500`"
              ></div>
            </button>
          </div>
        </template>
        
        <!-- Flex spacer -->
        <div class="flex-1 bg-gray-900"></div>
      </div>
      
      <!-- Sub-Categories (only when parent selected and has direct children) -->
      <div 
        v-if="selectedParentCategory && getDirectChildCategories(selectedParentCategory.id).length > 0" 
        class="flex items-stretch bg-gray-850 border-b border-gray-800 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-850"
      >
        <div class="flex items-stretch">
          <div
            v-for="subCat in getDirectChildCategories(selectedParentCategory.id)"
            :key="subCat.id"
            @drop="onCategoryDrop($event, subCat.id)"
            @dragover="onCategoryDragOver($event, subCat.id)"
            @dragenter="onCategoryDragEnter($event, subCat.id)"
            @dragleave="onCategoryDragLeave($event, subCat.id)"
            class="category-drop-zone relative flex-shrink-0"
            :data-category-id="subCat.id"
          >
            <!-- Drag Action Indicators -->
            <div v-if="draggedBuildId && dropTargetCategoryId === subCat.id" class="absolute inset-0 flex pointer-events-none z-20">
              <!-- Left Half - Move -->
              <div class="w-1/2 flex items-center justify-center">
                <div v-if="dragAction === 'move'" class="bg-blue-500/90 text-white px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1">
                  <IconArrowBarToDown size="12" />
                  <span class="font-semibold text-xs">Move</span>
                </div>
              </div>
              <!-- Right Half - Copy -->
              <div class="w-1/2 flex items-center justify-center">
                <div v-if="dragAction === 'copy'" class="bg-green-500/90 text-white px-1.5 py-0.5 rounded shadow-lg flex items-center gap-1">
                  <IconCopy size="12" />
                  <span class="font-semibold text-xs">Copy</span>
                </div>
              </div>
            </div>
            
            <button
              @click="selectCategory(subCat.id)"
              class="relative px-4 py-2.5 font-semibold text-sm transition-all duration-200 border-r border-gray-800 group whitespace-nowrap"
              :class="(selectedCategoryId === subCat.id || getSubCategories(subCat.id).some(sub => sub.id === selectedCategoryId))
                ? `bg-gray-800 text-white` 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'"
            >
              <div class="flex items-center gap-2">
                <IconFolder 
                  size="16" 
                  :class="(selectedCategoryId === subCat.id || getSubCategories(subCat.id).some(sub => sub.id === selectedCategoryId))
                    ? `text-${subCat.color}-400` 
                    : 'text-gray-600 group-hover:text-gray-500'" 
                />
                <span>{{ subCat.name }}</span>
                <div 
                  class="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-md"
                  :class="(selectedCategoryId === subCat.id || getSubCategories(subCat.id).some(sub => sub.id === selectedCategoryId))
                    ? `bg-${subCat.color}-500/20 text-${subCat.color}-300 border border-${subCat.color}-500/30` 
                    : 'bg-gray-800 text-gray-600 border border-gray-700'"
                >
                  {{ getCategoryBuildCount(subCat.id) }}
                </div>
              </div>
              
              <!-- Bottom accent line -->
              <div 
                v-if="selectedCategoryId === subCat.id || getSubCategories(subCat.id).some(sub => sub.id === selectedCategoryId)"
                class="absolute bottom-0 left-0 right-0 h-1 rounded-t-sm"
                :class="`bg-${subCat.color}-500`"
              ></div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Sub-Sub-Categories (only when sub-category selected and has children) -->
      <div 
        v-if="selectedSubCategory && getDirectChildCategories(selectedSubCategory.id).length > 0" 
        class="flex items-stretch bg-gray-800 border-b border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        <div class="flex items-stretch">
          <div
            v-for="subSubCat in getDirectChildCategories(selectedSubCategory.id)"
            :key="subSubCat.id"
            @drop="onCategoryDrop($event, subSubCat.id)"
            @dragover="onCategoryDragOver($event, subSubCat.id)"
            @dragenter="onCategoryDragEnter($event, subSubCat.id)"
            @dragleave="onCategoryDragLeave($event, subSubCat.id)"
            class="category-drop-zone relative flex-shrink-0"
            :data-category-id="subSubCat.id"
          >
            <!-- Drag Action Indicators -->
            <div v-if="draggedBuildId && dropTargetCategoryId === subSubCat.id" class="absolute inset-0 flex pointer-events-none z-20">
              <!-- Left Half - Move -->
              <div class="w-1/2 flex items-center justify-center">
                <div v-if="dragAction === 'move'" class="bg-blue-500/90 text-white px-1 py-0.5 rounded shadow-lg flex items-center gap-0.5">
                  <IconArrowBarToDown size="10" />
                  <span class="font-semibold" style="font-size: 10px;">Move</span>
                </div>
              </div>
              <!-- Right Half - Copy -->
              <div class="w-1/2 flex items-center justify-center">
                <div v-if="dragAction === 'copy'" class="bg-green-500/90 text-white px-1 py-0.5 rounded shadow-lg flex items-center gap-0.5">
                  <IconCopy size="10" />
                  <span class="font-semibold" style="font-size: 10px;">Copy</span>
                </div>
              </div>
            </div>
            
            <button
              @click="selectCategory(subSubCat.id)"
              class="relative px-3 py-2 font-medium text-xs transition-all duration-200 border-r border-gray-700 group whitespace-nowrap"
              :class="selectedCategoryId === subSubCat.id 
                ? `bg-gray-750 text-white` 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-750'"
            >
              <div class="flex items-center gap-1.5">
                <IconFolder 
                  size="14" 
                  :class="selectedCategoryId === subSubCat.id 
                    ? `text-${subSubCat.color}-400` 
                    : 'text-gray-600 group-hover:text-gray-500'" 
                />
                <span>{{ subSubCat.name }}</span>
                <div 
                  class="ml-1 px-1.5 py-0.5 text-xs font-bold rounded"
                  :class="selectedCategoryId === subSubCat.id 
                    ? `bg-${subSubCat.color}-500/20 text-${subSubCat.color}-300 border border-${subSubCat.color}-500/30` 
                    : 'bg-gray-700 text-gray-600 border border-gray-700'"
                >
                  {{ getCategoryBuildCount(subSubCat.id) }}
                </div>
              </div>
              
              <!-- Bottom accent line -->
              <div 
                v-if="selectedCategoryId === subSubCat.id"
                class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-sm"
                :class="`bg-${subSubCat.color}-500`"
              ></div>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Active/Archived Builds View -->
    <div v-if="builds.length > 0">
  <!-- Nur auf Desktop anzeigen: Vertikale Ansicht oder Horizontale Ansicht -->
  <div class="hidden md:block">
    <!-- Transition wrapper für smooth category switch -->
    <Transition name="build-list-fade" mode="out-in">
      <div :key="selectedCategoryId || buildFilterMode">
        <!-- Vertikale Ansicht Draggable -->
        <Draggable 
          v-if="displaySettings.displayMode === 'Vertical'"
          v-model="visibleBuilds"
          :componentData="{
            tag: 'div',
            type: 'transition-group',
            name: 'flip-list',
            class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          }"
          handle=".grip-handle"
          :group="{ name: 'builds' }"
          itemKey="id"
          :animation="200"
          :scroll="true"
          :scrollSensitivity="100"
          :scrollSpeed="20"
          ghostClass="ghost"
          chosenClass="chosen"
          dragClass="dragging"
          @end="onDragEnd"
        >
      <template #item="{ element, index }">
        <div 
          class="build-card-wrapper"
          :style="{ viewTransitionName: getBuildTransitionName(element.id) }"
          @dragstart="onBuildDragStart($event, element.id)"
          @dragend="onBuildDragEnd"
        >
          <BuildCardVertical 
            :build-id="element.id"
            :hunter-id="element.hunterId || route.params.hunterId"
            :build-data="element"
            :index="index"
            :is-reference-build="element.id === referenceBuildId"
            @name-changed="handleNameChanged"
            @edit="editBuild"
            @clone="cloneBuild"
            @archive="archiveBuild"
            @delete="deleteBuild"
            @evaluated="handleBuildEvaluated"
            @overridesBuild="openOverrideModal"
            @reevaluate="handleBuildReevaluate"
          />
        </div>
      </template>
    </Draggable>

    <!-- Horizontale Ansicht Draggable -->
    <Draggable 
      v-else
      v-model="visibleBuilds"
      :componentData="{
        tag: 'div',
        type: 'transition-group',
        name: 'flip-list',
        class: 'space-y-2'
      }"
      handle=".grip-handle"
      :group="{ name: 'builds' }"
      itemKey="id"
      :animation="200"
      :scroll="true"
      :scrollSensitivity="100"
      :scrollSpeed="20"
      ghostClass="ghost"
      chosenClass="chosen"
      dragClass="dragging"
      @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div 
          class="build-compact-wrapper"
          :style="{ viewTransitionName: getBuildTransitionName(element.id) }"
          @dragstart="onBuildDragStart($event, element.id)"
          @dragend="onBuildDragEnd"
        >
          <BuildCardHorizontal 
            :build-id="element.id"
            :hunter-id="element.hunterId || route.params.hunterId"
            :build-data="element"
            :auto-evaluate="true"
            :index="index"
            :is-reference-build="element.id === referenceBuildId"
            :reference-results="referenceBuildResults"
            :result-labels="resultLabels"
            :results="evaluationResults[element.id]?.results"
            :is-loading="evaluationResults[element.id]?.isLoading"
            :has-error="evaluationResults[element.id]?.hasError"
            :progress-iteration="evaluationResults[element.id]?.progressIteration || 0"
            :total-iterations="hunterIterations"
            @name-changed="handleNameChanged"
            @edit="editBuild"
            @clone="cloneBuild"
            @archive="archiveBuild"
            @delete="deleteBuild"
            @evaluated="handleBuildEvaluated"
            @overridesBuild="openOverrideModal"
            @reevaluate="handleBuildReevaluate"
          />
        </div>
      </template>
    </Draggable>
      </div>
    </Transition>
  </div>

  <!-- Mobile Ansicht: Immer die Mobile-Karte anzeigen -->
  <div class="md:hidden">
    <Draggable 
      v-model="visibleBuilds"
      :componentData="{
        tag: 'div',
        type: 'transition-group',
        name: 'flip-list',
        class: 'space-y-3'
      }"
      handle=".grip-handle"
      :group="{ name: 'builds' }"
      itemKey="id"
      :animation="200"
      :scroll="true"
      :scrollSensitivity="100"
      :scrollSpeed="20"
      ghostClass="ghost"
      chosenClass="chosen"
      dragClass="dragging"
      @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div 
          class="build-mobile-wrapper"
          :style="{ viewTransitionName: getBuildTransitionName(element.id) }"
          @dragstart="onBuildDragStart($event, element.id)"
          @dragend="onBuildDragEnd"
        >
          <BuildCardMobile
            :build-id="element.id"
            :hunter-id="element.hunterId || route.params.hunterId"
            :build-data="element"
            :auto-evaluate="true"
            :index="index"
            :is-reference-build="element.id === referenceBuildId"
            :reference-results="referenceBuildResults"
            :result-labels="resultLabels"
            :results="evaluationResults[element.id]?.results"
            :is-loading="evaluationResults[element.id]?.isLoading"
            :has-error="evaluationResults[element.id]?.hasError"
            :progress-iteration="evaluationResults[element.id]?.progressIteration || 0"
            :total-iterations="hunterIterations"
            @name-changed="handleNameChanged"
            @edit="editBuild"
            @clone="cloneBuild"
            @archive="archiveBuild"
            @delete="deleteBuild"
            @evaluated="handleBuildEvaluated"
            @overridesBuild="openOverrideModal"
            @reevaluate="handleBuildReevaluate"
          />
        </div>
      </template>
    </Draggable>
  </div>
</div>
    
    <!-- Leerer State wenn keine Builds vorhanden -->
    <div 
      v-if="filteredBuilds.length === 0" 
      class="col-span-full p-8 text-center bg-gray-800 border border-gray-700 rounded-lg"
    >
      <IconRobot size="75" class="mx-auto mb-4 text-gray-600" />
      <h3 class="text-xl font-semibold mb-2">No builds found</h3>
      <p class="text-gray-400 mb-4">
        {{ buildFilterMode === 'active' ? 'You don\'t have any active builds for this hunter yet.' : 'You don\'t have any archived builds for this hunter.' }}
      </p>
      <button
        v-if="buildFilterMode === 'active'"
        @click="openBuildModal"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Create your first build
      </button>
      <button
        v-else
        @click="buildFilterMode = 'active'"
        class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
      >
        Back to active builds
      </button>
    </div>
    
    <!-- Stats Modal -->
    <StatsModal 
      v-if="showStatsModal" 
      :isVisible="showStatsModal" 
      :hunterType="route.params.hunterId"
      @close="showStatsModal = false" 
      @evaluateAll="evaluateAllBuilds"
    />

    <!-- Iterations Modal ersetzen durch die neue Komponente -->
    <IterationsModal
      :isVisible="isIterationsModalOpen"
      :hunterType="route.params.hunterId"
      :currentIterations="iterationValue"
      @close="closeIterationsModal"
      @update:iterations="updateIterationValue"
    />

    <!-- Statistics Modal -->
    <StatisticsDisplayModal
      :isVisible="isStatisticsModalOpen"
      :hunterType="route.params.hunterId"
      @close="closeStatisticsModal"
      @update:displaySettings="onDisplaySettingsUpdated"
    />
    
    <!-- Build Code Modal -->
    <BuildImportModal
      :show="isBuildCodeModalOpen"
      :prefilled-code="importCodeFromUrl"
      @close="closeBuildCodeModal"
      @import-build="importBuild"
    />
    
    <!-- Toast Notification -->
    <Transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white flex items-center"
        :class="{ 
          'bg-green-600': toast.type === 'success',
          'bg-red-600': toast.type === 'error',
          'bg-blue-600': toast.type === 'info'
        }"
      >
        <div v-if="toast.type === 'success'">
          <IconCircleCheck size="20" class="mr-2" />
        </div>
        <div v-else-if="toast.type === 'error'">
          <IconAlertCircle size="20" class="mr-2" />
        </div>
        <div v-else>
          <IconInfoCircle size="20" class="mr-2" />
        </div>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Build Modal -->
    <BuildModal 
      :isVisible="isBuildModalOpen"
      :hunterType="route.params.hunterId"
      :buildToEdit="buildToEdit"
      :currentCategoryId="selectedCategoryId"
      @close="closeBuildModal"
      @buildCreated="onBuildCreated"
      @buildUpdated="onBuildUpdated"
    />

    <OverrideModal
      :isVisible="isOverrideModalOpen"
      :hunterType="route.params.hunterId"
      :hunterColor="hunterColor"
      :buildName="selectedBuildForOverrides?.name || ''"
      :buildId="selectedBuildForOverrides?.id"
      :currentOverrides="selectedBuildForOverrides?.overrides || {}"
      @close="closeOverrideModal"
      @overridesUpdated="onOverridesUpdated"
    />

    <!-- MobileLootFilterModal -->
    <MobileLootFilterModal
      :isVisible="showLootFilterModal"
      :filters="lootFilters"
      :hunterId="route.params.hunterId"
      @close="showLootFilterModal = false"
      @update:filters="updateLootFilters"
    />

    <!-- Gadgets Cost Modal -->
    <GadgetsCostModal
      :isVisible="isGadgetCostModalOpen"
      :builds="builds"
      @close="closeGadgetCostModal"
    />

    <!-- Category Management Modal -->
    <CategoryManagementModal
      :show="isCategoryModalOpen"
      :hunterId="route.params.hunterId"
      @close="closeCategoryManagementModal"
    />
    
    <!-- Category Override Modal -->
    <OverrideModal
      v-if="selectedCategoryForOverrides"
      :isVisible="isCategoryOverrideModalOpen"
      :mode="'category'"
      :hunterType="route.params.hunterId"
      :hunterColor="hunterColor"
      :categoryName="selectedCategoryForOverrides.name"
      :categoryId="selectedCategoryForOverrides.id"
      :currentOverrides="hunterStore.getCategoryOverrides(route.params.hunterId, selectedCategoryForOverrides.id)"
      @close="closeCategoryOverrideModal"
      @categoryOverridesUpdated="onCategoryOverridesUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, provide, watchEffect, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NAVIGATION } from '../constants/navigation';
import { useHunterStore } from '../store/hunterStore';
import { useGemPlannerStore } from '../store/gemPlannerStore';
import { getHunterById } from '../constants/hunters'; 
import { 
  IconChartBar, 
  IconPlus, 
  IconFileBarcode, 
  IconRepeat, 
  IconChartDonut,
  IconAdjustmentsHorizontal,
  IconFolderOff,
  IconDownload,
  IconRobot,
  IconChartArrowsVertical,
  // Neue Icons für die Toast-Nachrichten
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconLayoutDistributeVertical,
  IconLayoutDistributeHorizontal,
  IconFilter,
  IconCalculator,
  IconSeedling,
  IconFolder,
  IconArrowBarToDown,
  IconCopy
} from '@tabler/icons-vue';

import StatsModal from '../components/common/StatsModal.vue';
import BuildModal from '@/components/common/BuildModal.vue';
import IterationsModal from '@/components/common/IterationsModal.vue';
import Draggable from 'vuedraggable';
import OverrideModal from '../components/common/OverrideModal.vue';
import BuildImportModal from '@/components/builds/BuildImportModal.vue';
import CategoryManagementModal from '@/components/builds/CategoryManagementModal.vue';
import StatisticsDisplayModal from '@/components/common/StatisticsDisplayModal.vue';
import BuildCardVertical from '@/components/builds/Views/verticalView/BuildCardVertical.vue'; 
import BuildCardHorizontal from '@/components/builds/Views/horizontalView/BuildCardHorizontal.vue';
import BuildCardMobile from '@/components/builds/Views/mobileView/BuildCardMobile.vue';
import MobileLootFilterModal from '@/components/common/MobileLootFilterModal.vue';
import GadgetsCostModal from '@/components/common/GadgetsCostModal.vue';
import SeedToggle from '@/components/common/SeedToggle.vue';
import TemporaryUpgradesDropdown from '@/components/common/TemporaryUpgradesDropdown.vue';

const router = useRouter();
const route = useRoute();
const importCodeFromUrl = ref('');

const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Track if we're in an in-page transition (add/delete)
const isInPageTransition = ref(false);

// Generic smooth transition wrapper
function withSmoothTransition(updateFn) {
  if (document.startViewTransition) {
    isInPageTransition.value = true;
    document.documentElement.classList.add('in-page-transition');
    const transition = document.startViewTransition(() => {
      updateFn();
    });
    transition.finished.finally(() => {
      document.documentElement.classList.remove('in-page-transition');
      isInPageTransition.value = false;
    });
  } else {
    updateFn();
  }
}

// Helper to get view transition name only during in-page transitions
function getBuildTransitionName(buildId) {
  // Check if we're in an in-page transition (add/delete), not a route transition
  const hasAttribute = document.documentElement.hasAttribute('data-in-page-transition');
  return (isInPageTransition.value || hasAttribute) ? `build-card-${buildId}` : undefined;
}

// Hunter-spezifische Daten
const hunterIdMap = {
  'borge': 0,
  'ozzy': 1,
  'knox': 2
};

// Aktueller Hunter basierend auf der Route
const currentHunter = computed(() => {
  const hunterId = route.params.hunterId || 'borge';
  const hunterIndex = hunterIdMap[hunterId] || 0;
  return NAVIGATION.hunters[hunterIndex];
});

// Hunter-Information aus zentraler Konfiguration abrufen
const hunterColor = computed(() => currentHunter.value.color);

// UI-Status
const buildFilterMode = ref('active');
const buildCode = ref('');

// Easter Egg State
const clickCount = ref(0);
const showDancingImage = ref(false);

// Durch den neuen Toast-State im selben Format wie in SettingsView
const toast = ref({ show: false, message: '', type: 'info' });

// Füge auch resultLabels und evaluationResults State hinzu, falls noch nicht vorhanden
const resultLabels = ref({});
const evaluationResults = ref({});

const hunterIterations = computed(() => hunterStore.hunterIterations[route.params.hunterId] || 1000);

// Modale Status
const showStatsModal = ref(false);
const isIterationsModalOpen = ref(false);
const isStatisticsModalOpen = ref(false);
const isBuildCodeModalOpen = ref(false);
const isBuildModalOpen = ref(false);
const buildToEdit = ref(null);

// Refs für das Override-Modal
const isOverrideModalOpen = ref(false);
const selectedBuildForOverrides = ref(null);

// Category Management Modal State
const isCategoryModalOpen = ref(false);

// Category Override Modal State
const isCategoryOverrideModalOpen = ref(false);
const selectedCategoryForOverrides = ref(null);

const builds = ref([]);

// Category Selection
const selectedCategoryId = ref(null);

// Sichtbare Builds für Vuedraggable (gefiltert nach Kategorie)
const visibleBuilds = computed({
  get() {
    if (!selectedCategoryId.value) return builds.value;
    
    // Filtere nur die Builds, die direkt in der ausgewählten Kategorie sind
    return builds.value.filter(build => {
      const buildCategoryId = hunterStore.getBuildCategory(route.params.hunterId, build.id);
      return buildCategoryId === selectedCategoryId.value;
    });
  },
  set(newValue) {
    // Wenn Vuedraggable die Reihenfolge ändert, aktualisiere das komplette builds Array
    // Wir müssen die neuen Positionen in das Haupt-Array übertragen
    
    // Erstelle eine Map der neuen Reihenfolge innerhalb der Kategorie
    const newOrder = new Map(newValue.map((build, index) => [build.id, index]));
    
    // Sortiere das gesamte builds Array
    const sorted = [...builds.value].sort((a, b) => {
      const aCat = hunterStore.getBuildCategory(route.params.hunterId, a.id);
      const bCat = hunterStore.getBuildCategory(route.params.hunterId, b.id);
      
      // Beide in der aktuellen Kategorie: Nutze neue Reihenfolge
      if (aCat === selectedCategoryId.value && bCat === selectedCategoryId.value) {
        return (newOrder.get(a.id) ?? 0) - (newOrder.get(b.id) ?? 0);
      }
      
      // Nur a in aktueller Kategorie
      if (aCat === selectedCategoryId.value) return -1;
      
      // Nur b in aktueller Kategorie  
      if (bCat === selectedCategoryId.value) return 1;
      
      // Beide nicht in aktueller Kategorie: Behalte ursprüngliche Reihenfolge
      return builds.value.indexOf(a) - builds.value.indexOf(b);
    });
    
    builds.value = sorted;
  }
});

// Refs für Mobile Filter Modal
const showLootFilterModal = ref(false);
const lootFilters = ref({
  mat1: true,
  mat2: true,
  mat3: true,
  xp: true
});

// Hunter-Bild-URL direkt aus dem hunters.js-Modul
const hunterImage = computed(() => {
  const hunterId = route.params.hunterId || 'borge';
  const hunter = getHunterById(hunterId);
  
  // Zeige Dancing-Bild wenn Easter Egg aktiviert ist
  if (showDancingImage.value && hunter?.easter_egg_image) {
    return hunter.easter_egg_image;
  }
  
  return hunter?.image || ''; // Verwende die Icon-URL aus hunters.js
});

// Override-Modal öffnen
function openOverrideModal(build) {
  selectedBuildForOverrides.value = build;
  isOverrideModalOpen.value = true;
}


// Override-Modal schließen
function closeOverrideModal() {
  isOverrideModalOpen.value = false;
  selectedBuildForOverrides.value = null;
}

// GadgetCostModal 
// ref für Gadget Modal hinzu
const isGadgetCostModalOpen = ref(false);

// Funktion zum Öffnen des Gadget-Kosten-Modals
function openGadgetCostModal() {
  isGadgetCostModalOpen.value = true;
}

// Funktion zum Schließen des Gadget-Kosten-Modals
function closeGadgetCostModal() {
  isGadgetCostModalOpen.value = false;
}

// Event-Handler für aktualisierte Overrides
function onOverridesUpdated(payload) {
  // Prüfe, ob wir das neue Format mit buildId haben
  if (typeof payload === 'object' && 'buildId' in payload) {
    const { buildId, overrides } = payload;
    
    // Finde den Build in der lokalen Liste
    const buildIndex = builds.value.findIndex(b => b.id === buildId);
    if (buildIndex !== -1) {
      // Aktualisiere nur die Overrides des Builds, NICHT die globalen Werte
      builds.value[buildIndex].overrides = { ...overrides };
      
      // Aktualisiere im Store
      hunterStore.updateBuildOverrides(buildId, overrides);
    }
  } else {
    // Altes Format - direktes Overrides-Objekt
    console.warn("Deprecated format in onOverridesUpdated");
    // Führe keine Aktion aus oder handle den alten Fall anders
  }
}

// Aktualisiere die Anzahl der Builds
const activeBuildsCount = computed(() => {
  const allBuilds = hunterStore.getBuildsForHunter(route.params.hunterId) || [];
  return allBuilds.filter(build => !build.isArchived).length;
});

const archivedBuildsCount = computed(() => {
  const allBuilds = hunterStore.getBuildsForHunter(route.params.hunterId) || [];
  return allBuilds.filter(build => build.isArchived).length;
});

// Hilfsfunktion für den Farbverlauf basierend auf dem Hunter
function getGradientColors() {
  const colorMap = {
    'red': 'from-red-900 to-gray-800',
    'green': 'from-green-900 to-gray-800',
    'blue': 'from-blue-900 to-gray-800'
  };
  return colorMap[currentHunter.value.color] || 'from-gray-800 to-gray-700';
}

// Aktionen

function openStatsModal() {
  showStatsModal.value = true;
}

const iterationValue = computed(() => {
  return hunterStore.getIterations(route.params.hunterId) || 1000;
});

function openIterationsModal() {
  isIterationsModalOpen.value = true;
}

function closeIterationsModal() {
  isIterationsModalOpen.value = false;
}

function updateIterationValue(newValue) {
  // Der Store wird direkt durch das Modal aktualisiert
  // Kein explizites Update notwendig
}

function closeStatisticsModal() {
  isStatisticsModalOpen.value = false;
  // Hier würdest du die neuen Statistik-Einstellungen speichern
}

function openBuildCodeModal() {
  isBuildCodeModalOpen.value = true;
}

function closeBuildCodeModal() {
  isBuildCodeModalOpen.value = false;
  buildCode.value = '';
}

// Build-Import
async function importBuild(build) {
  if (!build) {
    showToastMessage('Error: Invalid build code', 'error');
    return;
  }
  
  // Check if the build is for the correct hunter type
  if (build.hunter !== route.params.hunterId) {
    // Automatically redirect to the correct hunter and import the build there
    const correctHunterPath = `/${build.hunter}`;
    showToastMessage(`Redirecting to ${build.hunter.charAt(0).toUpperCase() + build.hunter.slice(1)} and importing build...`, 'info');
    
    // Store the build data in the hunterStore for cross-navigation transfer
    hunterStore.setPendingBuildImport(build);
    
    // Close current modal first
    closeBuildCodeModal();
    
    // Wait a tick to ensure modal is closed and store is updated
    await nextTick();
    
    // Navigate to the correct hunter - the build will be automatically imported there
    router.push(correctHunterPath);
    return;
  }
  
  // Statt den Build direkt zu speichern, öffnen wir ihn im BuildModal zur Bearbeitung
  buildToEdit.value = {
    ...build,
    hunterId: route.params.hunterId, // Stelle sicher, dass die hunterId gesetzt ist
    // Kein timestamp oder id setzen - das erfolgt erst beim Speichern
  };
  
  // BuildModal öffnen
  isBuildModalOpen.value = true;
  
  // Bestätigung anzeigen
  showToastMessage(`Build imported and ready to edit. Click Save to keep it.`, 'info');
  
  // Import-Modal schließen
  closeBuildCodeModal();
}

function evaluateAllBuilds() {
  showToastMessage('Evaluating all builds...', 'info');
  showStatsModal.value = false;
}

function showToastMessage(message, type = 'success', duration = 3000) {
  toast.value = { show: true, message, type };
  
  setTimeout(() => {
    toast.value.show = false;
  }, duration);
}

// Easter Egg: Hunter Image Click Handler
function handleHunterImageClick() {
  if (showDancingImage.value) return; // Bereits aktiviert
  
  clickCount.value++;
  
  // Easter Egg aktivieren nach 5 Klicks
  if (clickCount.value >= 5) {
    showDancingImage.value = true;
  }
}

// BuildModal öffnen (für neuen Build)
function openBuildModal() {
  buildToEdit.value = null;
  isBuildModalOpen.value = true;
}

// BuildModal zum Bearbeiten eines Builds öffnen
function editBuild(build) {
  buildToEdit.value = build;
  isBuildModalOpen.value = true;
}

// BuildModal schließen
function closeBuildModal() {
  isBuildModalOpen.value = false;
  buildToEdit.value = null;
}

// Category-related computed properties
const availableCategories = computed(() => {
  const hunterId = route.params.hunterId;
  const allCategories = hunterStore.getCategories(hunterId);
  // Only show root categories (no parentId)
  return allCategories.filter(c => !c.parentId);
});

const systemCategories = computed(() => {
  const hunterId = route.params.hunterId;
  const allCategories = hunterStore.getCategories(hunterId);
  // Only show root system categories
  return allCategories.filter(c => c.isSystem && !c.parentId);
});

const customRootCategories = computed(() => {
  const hunterId = route.params.hunterId;
  const allCategories = hunterStore.getCategories(hunterId);
  // Only show root custom categories
  return allCategories.filter(c => !c.isSystem && !c.parentId);
});

const selectedParentCategory = computed(() => {
  if (!selectedCategoryId.value) return null;
  
  const hunterId = route.params.hunterId;
  const allCategories = hunterStore.getCategories(hunterId);
  const selectedCat = allCategories.find(c => c.id === selectedCategoryId.value);
  
  if (!selectedCat) return null;
  
  // Wenn die ausgewählte Kategorie ein Parent (keine parentId) ist, return sie
  if (!selectedCat.parentId) {
    return selectedCat;
  }
  
  // Wenn es eine Sub-Category ist, finde den obersten Parent (ohne parentId)
  let parent = allCategories.find(c => c.id === selectedCat.parentId);
  while (parent && parent.parentId) {
    parent = allCategories.find(c => c.id === parent.parentId);
  }
  return parent;
});

const selectedSubCategory = computed(() => {
  if (!selectedCategoryId.value) return null;
  
  const hunterId = route.params.hunterId;
  const allCategories = hunterStore.getCategories(hunterId);
  const selectedCat = allCategories.find(c => c.id === selectedCategoryId.value);
  
  if (!selectedCat) return null;
  
  // Wenn die ausgewählte Kategorie ein Root ist, keine Sub-Category
  if (!selectedCat.parentId) return null;
  
  // Wenn die ausgewählte Kategorie eine direkte Child des Root ist
  const parent = allCategories.find(c => c.id === selectedCat.parentId);
  if (parent && !parent.parentId) {
    return selectedCat;
  }
  
  // Wenn es eine Sub-Sub-Category ist, finde die Sub-Category (Ebene 2)
  return parent;
});

function getSubCategories(parentId) {
  return hunterStore.getSubCategories(route.params.hunterId, parentId);
}

function getDirectChildCategories(parentId) {
  const hunterId = route.params.hunterId;
  const allCategories = hunterStore.getCategories(hunterId);
  return allCategories.filter(c => c.parentId === parentId);
}

function getCategoryBuildCount(categoryId) {
  // Get builds ONLY in this category (not sub-categories)
  const categoryBuilds = hunterStore.getBuildsByCategory(route.params.hunterId, categoryId, false);
  return categoryBuilds.length;
}

function isBuildInSelectedCategory(build) {
  if (!selectedCategoryId.value) return true;
  
  // Only show builds that are DIRECTLY in the selected category (not in sub-categories)
  const categoryBuilds = hunterStore.getBuildsByCategory(route.params.hunterId, selectedCategoryId.value, false);
  return categoryBuilds.some(b => b.id === build.id);
}

// Event-Handler für erstellten Build
function onBuildCreated(build) {
  // Aktualisiere die lokale Liste der Builds
  // Wichtig: Die Builds müssen manuell aktualisiert werden!
  if (build) {
    const updatedBuilds = hunterStore.getOrderedBuildsForHunter(route.params.hunterId) || [];
    builds.value = updatedBuilds.filter(b => 
      (buildFilterMode.value === 'active' && !b.isArchived) || 
      (buildFilterMode.value === 'archived' && b.isArchived)
    );
  }
  
  showToastMessage(`Build "${build.name}" created`, 'success');
}


// Event-Handler für aktualisierten Build
function onBuildUpdated(build) {  
  // Aktualisiere die lokale Liste der Builds
  if (build) {
    const updatedBuilds = hunterStore.getOrderedBuildsForHunter(route.params.hunterId) || [];
    builds.value = updatedBuilds.filter(b => 
      (buildFilterMode.value === 'active' && !b.isArchived) || 
      (buildFilterMode.value === 'archived' && b.isArchived)
    );
  }
  
  showToastMessage(`Build "${build.name}" updated`, 'success');
}

// Build-Aktionen
function cloneBuild(build) {
  // Erstelle eine tiefe Kopie des Builds
  const clonedBuild = JSON.parse(JSON.stringify(build));
  
  // ID entfernen, damit eine neue generiert wird
  delete clonedBuild.id;
  
  // Zeitstempel aktualisieren
  clonedBuild.timestamp = Date.now();
  
  // Archiviert-Status zurücksetzen (falls der Original-Build archiviert war)
  clonedBuild.isArchived = false;
  
  // Name anpassen mit fortlaufender Nummer
  let baseName = build.name;
  let copyNumber = 1;
  
  // Prüfe, ob der Name bereits "(Copy)" oder "(Copy X)" enthält
  const copyRegex = /\s*\(Copy(?:\s+(\d+))?\)\s*$/;
  const match = baseName.match(copyRegex);
  
  if (match) {
    // Entferne den "(Copy X)" Teil vom Namen
    baseName = baseName.replace(copyRegex, '');
    
    // Wenn eine Zahl in den Klammern war, verwende sie als Startpunkt
    if (match[1]) {
      copyNumber = parseInt(match[1]) + 1;
    } else {
      copyNumber = 2; // Wenn es nur "(Copy)" war, starte mit "(Copy 2)"
    }
  }
  
  // Suche nach existierenden Kopien mit dem gleichen Basisnamen
  const existingCopies = builds.value.filter(b => {
    const existingMatch = b.name.match(new RegExp(`^${escapeRegExp(baseName)}\\s*\\(Copy(?:\\s+(\\d+))?\\)\\s*$`));
    return existingMatch !== null;
  });
  
  // Finde die höchste existierende Kopienummer
  existingCopies.forEach(b => {
    const existingMatch = b.name.match(/\(Copy\s+(\d+)\)/);
    if (existingMatch && existingMatch[1]) {
      const num = parseInt(existingMatch[1]);
      if (num >= copyNumber) {
        copyNumber = num + 1;
      }
    }
  });
  
  // Setze den neuen Namen
  if (copyNumber === 1) {
    clonedBuild.name = `${baseName} (Copy)`;
  } else {
    clonedBuild.name = `${baseName} (Copy ${copyNumber})`;
  }
  
  // Den geklonten Build als zu bearbeitenden Build setzen
  buildToEdit.value = clonedBuild;
  
  // Modal öffnen
  isBuildModalOpen.value = true;
}

// Hilfsfunktion zum Escapen von speziellen Zeichen in RegExp
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function deleteBuild(build) {
  if (!build || !build.id) return;
  
  // Lösche den Build im Store (wird auch die Reihenfolge aktualisieren)
  const success = hunterStore.deleteBuild(route.params.hunterId, build.id);
  
  if (success) {
    showToastMessage(`Build "${build.name}" deleted`, 'success');
    
    // Optional: Aktualisiere die lokale builds-Liste, falls nötig
    builds.value = builds.value.filter(b => b.id !== build.id);
  } else {
    showToastMessage(`Build "${build.name}" deleted`, 'success');
  }
}

function openCategoryManagementModal() {
  isCategoryModalOpen.value = true;
}

function closeCategoryManagementModal() {
  isCategoryModalOpen.value = false;
}

// Category Override Modal Functions
function openCategoryOverrideModal(category) {
  selectedCategoryForOverrides.value = category;
  isCategoryOverrideModalOpen.value = true;
}

function closeCategoryOverrideModal() {
  isCategoryOverrideModalOpen.value = false;
  selectedCategoryForOverrides.value = null;
}

function onCategoryOverridesUpdated(payload) {
  const { categoryId, overrides } = payload;
  
  // Update category overrides in store
  hunterStore.updateCategoryOverrides(route.params.hunterId, categoryId, overrides);
  
  // Show toast
  const category = hunterStore.getCategories(route.params.hunterId).find(c => c.id === categoryId);
  showToastMessage(`Category "${category?.name}" overrides updated`, 'success');
  
  // Force re-evaluation of all builds in this category
  const categoryBuilds = hunterStore.getBuildsByCategory(route.params.hunterId, categoryId, false);
  categoryBuilds.forEach(build => {
    handleBuildReevaluate(build.id);
  });
}

function categoryHasOverrides(categoryId) {
  const overrides = hunterStore.getCategoryOverrides(route.params.hunterId, categoryId);
  return Object.keys(overrides).length > 0;
}


// Reagiere auf Änderungen der Route, um den richtigen Hunter anzuzeigen
watch(
  () => route.params.hunterId,
  (newHunterId) => {
    if (!hunterIdMap.hasOwnProperty(newHunterId)) {
      // Ungültige Hunter-ID, zur Standard-Seite umleiten
      router.replace('/borge');
    }
    
    // Reset Easter Egg state when switching hunters
    clickCount.value = 0;
    showDancingImage.value = false;
  },
  { immediate: true }
);

// Lifecycle hooks
onMounted(async () => {
  await hunterStore.initHunterConfig(route.params.hunterId);
  // Initialisiere Build-Kategorien
  hunterStore.initBuildCategories(route.params.hunterId);
  
  // Wähle standardmäßig "active" Kategorie (für Desktop UND Mobile)
  selectedCategoryId.value = 'active';
  
  // Initialisiere auch den gemPlannerStore
  gemPlannerStore.init();
});

// Bei Wechsel des Hunters die Konfiguration initialisieren
watch(() => route.params.hunterId, async (newHunterId) => {
  await hunterStore.initHunterConfig(newHunterId);
  // Initialisiere Build-Kategorien für den neuen Hunter
  hunterStore.initBuildCategories(newHunterId);
  
  // Wähle standardmäßig "active" Kategorie (für Desktop UND Mobile)
  selectedCategoryId.value = 'active';
  
  // Check for pending build import when hunter changes
  nextTick(() => {
    const pendingBuild = hunterStore.getPendingBuildImport();
    
    if (pendingBuild && pendingBuild.hunter === newHunterId) {
      // Wait another tick to ensure View Transition is complete
      nextTick(() => {
        // Import the pending build
        buildToEdit.value = {
          ...pendingBuild,
          hunterId: newHunterId
        };
        
        // Open build modal
        isBuildModalOpen.value = true;
        
        // Clear the pending import
        hunterStore.clearPendingBuildImport();
        
        // Show success message
        showToastMessage(`Build imported and ready to edit. Click Save to keep it.`, 'info');
      });
    }
  });
});

// Lädt Builds beim Mounting
onMounted(async () => {
  // Hier Builds aus dem Store oder API laden
  // builds.value = await loadBuilds();
});

const sortableOpts = {
  scroll: true,
  scrollSensitivity: 60,
  scrollSpeed: 10
}

onMounted(() => {
  // Prüfe, ob ein code-Parameter in der URL vorhanden ist
  if (route.query.code) {
    // Code für das Modal speichern
    importCodeFromUrl.value = route.query.code;
    
    // Modal öffnen
    isBuildCodeModalOpen.value = true;
    
    // Optional: Code aus der URL entfernen (mit history.replaceState)
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    window.history.replaceState({}, '', url);
  }
  
  // Prüfe, ob ein pending Build Import vorhanden ist
  // Use nextTick to ensure the component is fully mounted after navigation
  nextTick(() => {
    const pendingBuild = hunterStore.getPendingBuildImport();
    
    if (pendingBuild && pendingBuild.hunter === route.params.hunterId) {
      // Wait another tick to ensure View Transition is complete
      nextTick(() => {
        // Import the pending build
        buildToEdit.value = {
          ...pendingBuild,
          hunterId: route.params.hunterId
        };
        
        // Open build modal
        isBuildModalOpen.value = true;
        
        // Clear the pending import
        hunterStore.clearPendingBuildImport();
        
        // Show success message
        showToastMessage(`Build imported and ready to edit. Click Save to keep it.`, 'info');
      });
    }
  });
});

// Weitere Handler für BuildResultCard-Events
function handleNameChanged(data) {
  const buildIndex = builds.value.findIndex(b => b.id === data.buildId);
  if (buildIndex !== -1) {
    // Lokale Liste aktualisieren
    builds.value[buildIndex].name = data.name;
    
    // Im Store speichern (WICHTIG: Diese Zeile fehlt bisher)
    hunterStore.renameBuild(data.buildId, data.name);
    
    // Optional: Erfolgs-Toast anzeigen
    showToastMessage(`Build renamed to "${data.name}"`, 'success');
  }
}

// Weitere Handler für Edit, Clone, Archive, Delete...
function archiveBuild(build) {
  if (!build || !build.id) return;
  
  const hunterId = route.params.hunterId;
  const newIsArchived = !build.isArchived;
  
  // Toggle the archived status
  const updatedBuild = {
    ...build,
    isArchived: newIsArchived
  };
  
  // Update the build in the store
  hunterStore.updateBuild(updatedBuild);
  
  // WICHTIG: Auch die Kategorie aktualisieren!
  // Wenn archiviert → 'archived' Kategorie
  // Wenn unarchiviert → 'active' Kategorie
  const newCategoryId = newIsArchived ? 'archived' : 'active';
  hunterStore.moveBuildToCategory(hunterId, build.id, newCategoryId);
  
  // Reload builds mit der neuen Reihenfolge
  builds.value = [...hunterStore.getOrderedBuildsForHunter(hunterId) || []];
  
  // Show toast message
  showToastMessage(newIsArchived ? 
    `Build "${build.name}" archived` : 
    `Build "${build.name}" unarchived`, 
    'success'
  );
}

// Computed Properties für die gefilterten Builds
const filteredBuilds = computed(() => {
  const allBuilds = hunterStore.getOrderedBuildsForHunter(route.params.hunterId) || [];
  
  // Im Category-System (wenn eine Kategorie ausgewählt ist): zeige ALLE Builds
  // Die Filterung erfolgt über isBuildInSelectedCategory() im Template
  if (selectedCategoryId.value) {
    return allBuilds;
  }
  
  // Im Active/Archived-Modus (alte Buttons): filtere nach isArchived Flag
  return allBuilds.filter(build => 
    (buildFilterMode.value === 'active' && !build.isArchived) || 
    (buildFilterMode.value === 'archived' && build.isArchived)
  );
});

// Wenn auf Active/Archived Button geklickt wird, deselektiere die Kategorie
function switchToBuildFilterMode(mode) {
  // Direkter Update ohne View Transition API
  buildFilterMode.value = mode;
  selectedCategoryId.value = null; // Deaktiviere Category-System
}


function updateLootFilters(newFilters) {
  lootFilters.value = newFilters;
  
  // Speichere die Filter im localStorage für Persistenz
  localStorage.setItem(`lootFilters_${route.params.hunterId}`, JSON.stringify(newFilters));
  
  showToastMessage('Loot filter updated', 'success', 1500);
}

provide('lootFilters', lootFilters);

// Synchronisiere builds nur, wenn sich filteredBuilds tatsächlich geändert hat (nicht nach drag)
// Vor der Übergabe an draggable, stelle sicher, dass alle Builds die hunterId haben
watch(filteredBuilds, (newFilteredBuilds) => {
  builds.value = newFilteredBuilds.map(build => ({
    ...build,
    hunterId: build.hunterId || route.params.hunterId // Sicherheitsmaßnahme
  }));
}, { immediate: true });

// Referenz-Build-Tracking
const evaluationCache = ref({});
const referenceBuildId = ref(null);
const referenceBuildResults = ref({});
// Neuer Zähler, der erhöht wird, wenn sich der Referenzbuild ändert
const referenceUpdateCounter = ref(0);

provide('evaluationCache', evaluationCache);
provide('referenceBuildId', referenceBuildId);
provide('referenceBuildResults', referenceBuildResults);
// Stelle den Zähler bereit
provide('referenceUpdateCounter', referenceUpdateCounter);

// Computed: Erster Build in der aktuellen Kategorie ist Reference Build
const categoryReferenceBuildId = computed(() => {
  // Finde den ersten SICHTBAREN Build (nach Filterung durch isBuildInSelectedCategory)
  const visibleBuilds = builds.value.filter(build => isBuildInSelectedCategory(build));
  
  // Erster sichtbarer Build ist Reference
  return visibleBuilds.length > 0 ? visibleBuilds[0].id : null;
});

// Synchronisiere referenceBuildId mit categoryReferenceBuildId
watch(categoryReferenceBuildId, (newRefId) => {
  if (newRefId && referenceBuildId.value !== newRefId) {
    referenceBuildId.value = newRefId;
    
    // Suche nach Ergebnissen für den neuen Referenz-Build im Cache
    const refBuildKey = Object.keys(evaluationCache.value).find(key => {
      try {
        const cachedData = JSON.parse(key);
        return cachedData.buildId === newRefId;
      } catch {
        return false;
      }
    });
    
    if (refBuildKey && evaluationCache.value[refBuildKey]) {
      referenceBuildResults.value = { ...evaluationCache.value[refBuildKey] };
    } else {
      referenceBuildResults.value = {};
    }
    
    // Erhöhe den Zähler, wenn sich der Referenzbuild ändert
    referenceUpdateCounter.value++;
  }
}, { immediate: true });

// Handler für das Drag-Ende-Event - aktualisiert
function onDragEnd(event) {

  // Stelle sicher, dass alle Builds nach dem Drag & Drop die hunterId haben
  builds.value = builds.value.map(build => {
    if (!build.hunterId) {
      return {
        ...build,
        hunterId: route.params.hunterId
      };
    }
    return build;
  });
  
  // Speichere die neue Reihenfolge im Store und localStorage
  hunterStore.saveBuildsOrder(route.params.hunterId, builds.value);
  
  // Der Reference Build wird automatisch durch categoryReferenceBuildId aktualisiert
  // Triggere eine Neuberechnung
  referenceUpdateCounter.value++;
}

// Der Handler für das evaluated Event
function handleBuildEvaluated({ buildId, results, isReference }) {
  // Speichere Ergebnis im Cache unter einem ID-basierten Key
  const cacheKey = JSON.stringify({ buildId });
  evaluationCache.value[cacheKey] = results;
  
  // Wenn dies der Referenz-Build ist, aktualisiere seine Ergebnisse
  if (isReference || buildId === referenceBuildId.value) {
    referenceBuildResults.value = { ...results };
    // Erhöhe den Zähler, damit alle anderen Builds aktualisiert werden
    referenceUpdateCounter.value++;
  }
}

function handleBuildReevaluate(buildId) {
  // Finde den Build-Namen für die Toast-Message
  const build = builds.value.find(b => b.id === buildId);
  const buildName = build?.name || 'unnamed';
  
  // Aktualisiere den Evaluation-State
  evaluationResults.value = {
    ...evaluationResults.value,
    [buildId]: {
      ...evaluationResults.value[buildId],
      isLoading: true,
      hasError: false,
      progressIteration: 0
    }
  };
  
  // Toast Message anzeigen
  showToastMessage(`Build "${buildName}" re-evaluated`, 'success');
}

// Füge auch die Funktion zum Aktualisieren der Display-Einstellungen hinzu
function onDisplaySettingsUpdated(settings) {
  // Hier kannst du auf Änderungen reagieren, z.B. alle Karten neu rendern
  // Oder den aktuellen Anzeigemodus aktualisieren
  
  // Optional: Toast-Nachricht anzeigen
  showToastMessage('Display settings updated', 'success');
}

// Stelle displaySettings als reactive Wert bereit
const displaySettings = computed(() => {
  return hunterStore.getDisplaySettings(route.params.hunterId) || {
    displayMode: 'Vertical',
    enabledStats: ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'],
    chartStyle: 'bar'
  };
});

// Funktion zum Umschalten der Anzeigemodi
function setDisplayMode(mode) {
  // Aktuelle Einstellungen abrufen
  const currentSettings = hunterStore.getDisplaySettings(route.params.hunterId) || {
    displayMode: 'Vertical',
    enabledStats: ['lootPerMin', 'avgStage', 'avgTime', 'stageDistribution'],
    chartStyle: 'bar'
  };
  
  // Neue Einstellungen mit aktualisiertem Anzeigemodus erstellen
  const updatedSettings = { 
    ...currentSettings,
    displayMode: mode 
  };
  
  // Im Store speichern
  hunterStore.saveDisplaySettings(route.params.hunterId, updatedSettings);
  
  // Optional: Toast-Nachricht anzeigen
  showToastMessage(`Display mode changed to ${mode}`, 'info', 1500);
}

// Füge die onBuildReevaluate-Funktion hinzu, falls sie fehlt
function onBuildReevaluate(buildId) {
  evaluationResults.value = {
    ...evaluationResults.value,
    [buildId]: {
      ...evaluationResults.value[buildId],
      isLoading: true,
      hasError: false,
      progressIteration: 0
    }
  };
}

// Category-Wechsel mit Smooth Transition
function selectCategory(categoryId) {
  // WICHTIG: Keine View Transition API für Category-Wechsel
  // Das führt zu Layout-Problemen bei gefilterten Builds
  // Stattdessen: Direkter Update mit CSS-Transitions
  selectedCategoryId.value = categoryId;
}

// Handler für temporäre Upgrade-Änderungen
function handleUpgradeChanged(changeData) {
  // Prüfe ob eine Neuevaluierung ausgelöst werden soll
  if (changeData.triggerReevaluation) {
    // Triggere Neuberechnung aller Builds
    builds.value.forEach(build => {
      handleBuildReevaluate(build.id);
    });
  }
  // Wenn triggerReevaluation false ist, keine Aktion - nur Store-Update wurde bereits gemacht
}

// Lade gespeicherte Filter beim Start
onMounted(() => {
  const savedFilters = localStorage.getItem(`lootFilters_${route.params.hunterId}`);
  if (savedFilters) {
    try {
      lootFilters.value = JSON.parse(savedFilters);
    } catch (e) {
      console.error('Error parsing saved loot filters:', e);
    }
  }
});

// Aktualisiere die Filter, wenn sich der Hunter ändert
watch(() => route.params.hunterId, (newHunterId) => {
  const savedFilters = localStorage.getItem(`lootFilters_${newHunterId}`);
  if (savedFilters) {
    try {
      lootFilters.value = JSON.parse(savedFilters);
    } catch (e) {
      console.error('Error parsing saved loot filters:', e);
    }
  } else {
    // Setze auf Standardwerte zurück, wenn keine gespeicherten Filter vorhanden sind
    lootFilters.value = {
      mat1: true,
      mat2: true,
      mat3: true,
      xp: true
    };
  }
});

// Stelle displaySettings zur Verfügung (provide/inject Pattern)
provide('displaySettings', displaySettings);

// Neue reactive ref für die Seed-Einstellung
const useSeededEvaluation = computed({
  get: () => hunterStore.getHunterSeedSetting(route.params.hunterId),
  set: (value) => {
    hunterStore.saveHunterSeedSetting(route.params.hunterId, value);
    showToastMessage(`Evaluation mode changed to ${value ? 'Seeded' : 'Random'}`, 'info', 1500);
  }
});

// Stelle den Wert über provide/inject bereit
provide('useSeededEvaluation', useSeededEvaluation);

// Category Drag & Drop State
const draggedBuildId = ref(null);
const dropTargetCategoryId = ref(null);
const dragAction = ref(null); // 'move' oder 'copy'

// Category Drag & Drop Handlers
function onBuildDragStart(event, buildId) {
  draggedBuildId.value = buildId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', buildId);
}

function onCategoryDragEnter(event, categoryId) {
  if (draggedBuildId.value) {
    dropTargetCategoryId.value = categoryId;
    event.currentTarget.classList.add('category-drag-over');
  }
}

function onCategoryDragOver(event, categoryId) {
  event.preventDefault();
  
  if (!draggedBuildId.value) return;
  
  // Berechne ob Maus in linker oder rechter Hälfte ist
  const rect = event.currentTarget.getBoundingClientRect();
  const midpoint = rect.left + rect.width / 2;
  const isLeftHalf = event.clientX < midpoint;
  
  // Setze die Aktion basierend auf der Position
  const action = isLeftHalf ? 'move' : 'copy';
  dragAction.value = action;
  
  // Setze data-attribute für CSS styling
  event.currentTarget.dataset.dragAction = action;
}

function onCategoryDragLeave(event, categoryId) {
  // Nur entfernen, wenn wir das Element wirklich verlassen (nicht nur zu einem Kind)
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  
  if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
    event.currentTarget.classList.remove('category-drag-over');
    delete event.currentTarget.dataset.dragAction;
    dragAction.value = null;
    if (dropTargetCategoryId.value === categoryId) {
      dropTargetCategoryId.value = null;
    }
  }
}

function onCategoryDrop(event, categoryId) {
  event.preventDefault();
  event.currentTarget.classList.remove('category-drag-over');
  delete event.currentTarget.dataset.dragAction;
  
  if (!draggedBuildId.value) return;
  
  const buildId = draggedBuildId.value;
  const hunterId = route.params.hunterId;
  const action = dragAction.value || 'move'; // Fallback auf move
  
  const categoryName = hunterStore.getCategories(hunterId).find(c => c.id === categoryId)?.name;
  
  if (action === 'copy') {
    // Build kopieren
    hunterStore.copyBuildToCategory(hunterId, buildId, categoryId);
    
    // WICHTIG: Force reactivity mit neuem Array und nextTick
    nextTick(() => {
      const orderedBuilds = hunterStore.getOrderedBuildsForHunter(hunterId) || [];
      builds.value = [...orderedBuilds];
    });
    
    showToastMessage(`Build copied to ${categoryName}`, 'success', 2000);
  } else {
    // Build verschieben
    hunterStore.moveBuildToCategory(hunterId, buildId, categoryId);
    
    // WICHTIG: Force reactivity mit neuem Array und nextTick
    nextTick(() => {
      const orderedBuilds = hunterStore.getOrderedBuildsForHunter(hunterId) || [];
      builds.value = [...orderedBuilds];
      
      console.log('UI builds updated to:', builds.value.map((b, i) => {
        const cat = hunterStore.getBuildCategory(hunterId, b.id);
        return `[${i}] ${b.name} (${cat})`;
      }));
    });
    
    showToastMessage(`Build moved to ${categoryName}`, 'success', 2000);
  }
  
  // Reset state
  draggedBuildId.value = null;
  dropTargetCategoryId.value = null;
  dragAction.value = null;
  
  // Triggere Reference Build Update (auch nach nextTick)
  nextTick(() => {
    referenceUpdateCounter.value++;
  });
}

function onBuildDragEnd() {
  draggedBuildId.value = null;
  dropTargetCategoryId.value = null;
  dragAction.value = null;
  
  // Alle drag-over Klassen und data-attributes entfernen
  document.querySelectorAll('.category-drag-over').forEach(el => {
    el.classList.remove('category-drag-over');
    delete el.dataset.dragAction;
  });
}
</script>

<style scoped>
/* Bestehende Grid-Styles... */

/* Category Drop Zone Styles */
.category-drop-zone {
  position: relative;
  transition: all 0.2s ease;
}

.category-drop-zone.category-drag-over {
  background: rgba(59, 130, 246, 0.1);
  outline: 2px dashed rgba(59, 130, 246, 0.5);
  outline-offset: -2px;
}

.category-drop-zone.category-drag-over button {
  opacity: 0.8;
}

/* Split Zone Indicators - Move (Left) and Copy (Right) */
.category-drop-zone[data-drag-action="move"]::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.2), transparent);
  border: 2px solid rgba(59, 130, 246, 0.6);
  border-right: none;
  pointer-events: none;
  z-index: 10;
}

.category-drop-zone[data-drag-action="copy"]::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50%;
  background: linear-gradient(to left, rgba(34, 197, 94, 0.2), transparent);
  border: 2px solid rgba(34, 197, 94, 0.6);
  border-left: none;
  pointer-events: none;
  z-index: 10;
}

/* Smooth fade transition for category switches */
.build-list-fade-enter-active,
.build-list-fade-leave-active {
  transition: opacity 0.2s ease;
}

.build-list-fade-enter-from,
.build-list-fade-leave-to {
  opacity: 0;
}

/* Neue Animation-Klassen für vuedraggable 4.x */
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

/* Disable Vue transitions during View Transitions to prevent conflicts */
html.in-page-transition .flip-list-enter-active,
html.in-page-transition .flip-list-leave-active {
  transition: none !important;
}

html.in-page-transition .flip-list-enter-from,
html.in-page-transition .flip-list-leave-to {
  opacity: 1 !important;
  transform: none !important;
}

/* CRITICAL: Disable transition-all on build cards during View Transitions */
html.in-page-transition .build-card-wrapper *,
html.in-page-transition .build-compact-wrapper *,
html.in-page-transition .build-mobile-wrapper * {
  transition: none !important;
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

/* Build Card Wrappers - Performance optimization for transitions */
.build-card-wrapper,
.build-compact-wrapper,
.build-mobile-wrapper {
  contain: layout;
}

/* Force build cards to maintain their size during View Transitions */
html.in-page-transition .build-card-wrapper,
html.in-page-transition .build-compact-wrapper,
html.in-page-transition .build-mobile-wrapper {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
}

/* Prevent overflow-hidden from clipping content during View Transition */
html.in-page-transition .build-card-wrapper > *,
html.in-page-transition .build-compact-wrapper > *,
html.in-page-transition .build-mobile-wrapper > * {
  overflow: visible !important;
}

/* Toast Animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>