<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8 border border-gray-800/80">
      <!-- Header -->
      <h2 class="text-2xl font-bold mb-4 text-center text-white md:hidden">
        <span>Relic Planner</span>
      </h2>

      <!-- Fragment Production Box -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <img src="@/assets/general/fragments.png" class="w-7 h-7 mr-2" alt="Fragments" />
            Fragment Production
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

            <!-- Fragments per Day (manual or auto from Mission Planner) -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1 flex items-center gap-1.5">
                Fragments per Day
                <span v-if="mpFragsPerDay > 0" class="text-[10px] bg-purple-800/60 text-purple-300 px-1.5 py-0.5 rounded font-normal">Auto</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">
                <span v-if="mpFragsPerDay > 0">From Mission Planner</span>
                <span v-else>Enter your daily fragment rate</span>
              </div>
              <SuffixInput
                v-model="fragmentsPerDay"
                placeholder="0"
                :focus-ring-class="'focus:ring-purple-500'"
                :disabled="mpFragsPerDay > 0"
                class="w-full text-sm bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Current Fragments -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1 flex items-center gap-1">
                Current Fragments
                <InfoTooltip
                  content="<strong>Auto-updating Fragments:</strong><br/>Grows automatically based on daily production.<br/>Deducted when marking items as purchased."
                  placement="top"
                />
                <button
                  v-if="mpFragsPerDay > 0"
                  @click="addCampaignFragments"
                  class="ml-auto flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white rounded-lg shadow transition-colors whitespace-nowrap border border-purple-500/40"
                  title="Add total TR campaign fragments to current balance"
                >
                  +{{ formatNumber(missionPlannerStore.totalCampaignFragments?.value ?? 0) }} Camp Frags
                </button>
              </div>
              <div class="text-xs text-gray-400 mb-2 flex items-center justify-between">
                <span>Amount you have saved</span>
                <button
                  @click="store.settings.autoUpdateFragments = !store.settings.autoUpdateFragments"
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] font-medium transition-colors',
                    store.settings.autoUpdateFragments
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                  ]"
                >
                  {{ store.settings.autoUpdateFragments ? 'Auto ON' : 'Auto OFF' }}
                </button>
              </div>
              <SuffixInput
                v-model="currentFragments"
                placeholder="0"
                :focus-ring-class="'focus:ring-purple-500'"
                class="w-full text-sm bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <!-- Hours in TR -->
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1 flex items-center gap-1">
                Hours in TR
                <InfoTooltip
                  content="<strong>Hours in TR:</strong><br/>Tracks your current hours in this TR.<br/>Used to calculate @Hour for shopping list items.<br/>Shared across all tools."
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
            class="bg-purple-700 hover:bg-purple-600 text-white px-2 py-0.5 text-xs rounded-lg flex items-center transition-colors"
          >
            <IconShare size="14" class="mr-1" />
            Summary
          </button>
        </div>
        <div class="p-2 sm:p-4">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Total Cost</div>
              <div class="text-lg font-bold text-amber-400">
                {{ formatNumber(store.totalShoppingCost) }}
              </div>
            </div>
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Time to Save</div>
              <div class="text-lg font-bold text-purple-400">
                {{ formatTimeToSave() }}
              </div>
            </div>
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">@Hour</div>
              <div class="text-lg font-bold text-purple-400">
                {{ formatTotalHoursInTR() }}
              </div>
            </div>
            <div class="bg-gray-900/60 rounded-lg p-3 border border-gray-700/50">
              <div class="font-medium text-white text-sm mb-1">Shopping List</div>
              <div class="text-lg font-bold text-white">
                {{ shoppingList.length }} Relic{{ shoppingList.length !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Tab Navigation -->
      <div class="lg:hidden mb-4">
        <div class="bg-gray-800/50 rounded-xl border border-gray-700/50 p-1 flex">
          <button
            @click="activeMobileTab = 'available'"
            :class="[
              'flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm',
              activeMobileTab === 'available'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <IconList size="16" />
              <span>Available</span>
              <span class="text-xs bg-purple-900/50 px-1.5 py-0.5 rounded">{{ allRelics.length }}</span>
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

      <!-- Mobile Content -->
      <div class="lg:hidden">
        <!-- Mobile: Available Relics Tab -->
        <div v-if="activeMobileTab === 'available'" class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="header p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconList size="20" class="mr-2 text-purple-400" />
              Available Relics
            </h3>
            <button
              @click="showLevelsModal = true"
              class="bg-purple-700 hover:bg-purple-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconSettings size="14" class="mr-1" />
              Manage Levels
            </button>
          </div>
          <!-- Sort Mode Buttons (Mobile) -->
          <div class="px-4 pb-2 mt-3 flex gap-1 flex-wrap">
            <button
              v-for="mode in SORT_MODES"
              :key="mode.id"
              @click="sortMode = mode.id"
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-medium transition-colors',
                sortMode === mode.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              ]"
            >{{ mode.label }}</button>
          </div>
          <div class="p-4 space-y-4">
            <!-- Category mode -->
            <template v-if="sortMode === 'category'">
              <div v-for="section in categorySections" :key="section.name">
                <h4 class="text-xs font-semibold text-purple-400 mb-2 border-l-2 border-purple-500/50 pl-2">{{ section.name }}</h4>
                <div class="space-y-2">
                  <div
                    v-for="relic in section.relics"
                    :key="relic.id"
                    class="bg-gray-700/30 rounded-lg p-2.5 hover:bg-gray-700/50 transition-colors"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
                        <img v-if="hasIcon(relic.id)" :src="getIconUrl(relic.id)" :alt="relic.id" class="w-[40px] h-[40px] object-contain" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-[11px] font-semibold text-gray-300">#{{ relic.id.match(/r(\d+)/)?.[1] }}</div>
                        <div class="text-[10px] text-gray-400 truncate mt-0.5">{{ relic.description }}</div>
                      </div>
                      <div class="flex items-center gap-1.5 flex-shrink-0">
                        <div class="flex flex-col items-center gap-0.5">
                          <div class="text-[11px] bg-gray-600/50 px-2 py-1 rounded font-mono whitespace-nowrap">
                            {{ getQueuedLevel(relic.id) }} <span class="text-gray-500">/ {{ getRelicMaxLevel(relic.id) }}</span>
                          </div>
                          <div class="text-[9px] text-purple-400 whitespace-nowrap">{{ formatTimeToAfford(relic, 1) }}</div>
                        </div>
                        <div class="flex flex-col items-center gap-0.5">
                          <button
                            @click="addRelicToList(relic, 1)"
                            :disabled="getQueuedLevel(relic.id) >= getRelicMaxLevel(relic.id) || getRelicCost(relic, 1) === null"
                            class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded transition-colors text-white font-semibold w-16"
                          >Lvl {{ getQueuedLevel(relic.id) + 1 }}</button>
                          <div class="text-[9px] text-amber-400 whitespace-nowrap">{{ getRelicCost(relic, 1) !== null ? formatNumber(getRelicCost(relic, 1)) : '?' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- Tier 1 (id / price sort) -->
            <template v-else>
            <div>
              <h4 class="text-xs font-semibold text-green-400 mb-2 border-l-2 border-green-500/50 pl-2">Tier 1 Relics</h4>
              <div class="space-y-2">
                <div
                  v-for="relic in tier1Relics"
                  :key="relic.id"
                  class="bg-gray-700/30 rounded-lg p-2.5 hover:bg-gray-700/50 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-[40px] h-[40px] flex items-center justify-center flex-shrink-0">
                      <img v-if="hasIcon(relic.id)" :src="getIconUrl(relic.id)" :alt="relic.id" class="w-[40px] h-[40px] object-contain" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-[11px] font-semibold text-gray-300">#{{ relic.id.match(/r(\d+)/)?.[1] }}</div>
                      <div class="text-[10px] text-gray-400 truncate mt-0.5">{{ relic.description }}</div>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <div class="flex flex-col items-center gap-0.5">
                        <div class="text-[11px] bg-gray-600/50 px-2 py-1 rounded font-mono whitespace-nowrap">
                          {{ getQueuedLevel(relic.id) }} <span class="text-gray-500">/ {{ getRelicMaxLevel(relic.id) }}</span>
                        </div>
                        <div class="text-[9px] text-purple-400 whitespace-nowrap">{{ formatTimeToAfford(relic, 1) }}</div>
                      </div>
                      <div class="flex flex-col items-center gap-0.5">
                        <button
                          @click="addRelicToList(relic, 1)"
                          :disabled="getQueuedLevel(relic.id) >= getRelicMaxLevel(relic.id) || getRelicCost(relic, 1) === null"
                          class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded transition-colors text-white font-semibold w-16"
                        >Lvl {{ getQueuedLevel(relic.id) + 1 }}</button>
                        <div class="text-[9px] text-amber-400 whitespace-nowrap">{{ getRelicCost(relic, 1) !== null ? formatNumber(getRelicCost(relic, 1)) : '?' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Tier 2 -->
            <div>
              <h4 class="text-xs font-semibold text-blue-400 mb-2 border-l-2 border-blue-500/50 pl-2">Tier 2 Relics</h4>
              <div v-if="!tier2Unlocked" class="bg-gray-800/40 rounded-lg p-3 border border-blue-900/30 text-center">
                <IconLock size="20" class="mx-auto text-gray-500 mb-1" />
                <p class="text-xs text-gray-400">Requires Power Gem Level 3</p>
                <p v-if="powerGemLevel > 0" class="text-[10px] text-gray-500 mt-0.5">Current: Level {{ powerGemLevel }}</p>
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="relic in tier2Relics"
                  :key="relic.id"
                  class="bg-gray-700/30 rounded-lg p-2.5 hover:bg-gray-700/50 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                      <img v-if="hasIcon(relic.id)" :src="getIconUrl(relic.id)" :alt="relic.id" class="w-[32px] h-[32px] object-contain" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-[11px] font-semibold text-gray-300">#{{ relic.id.match(/r(\d+)/)?.[1] }}</div>
                      <div class="text-[10px] text-gray-400 truncate mt-0.5">{{ relic.description }}</div>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <div class="flex flex-col items-center gap-0.5">
                        <div class="text-[11px] bg-gray-600/50 px-2 py-1 rounded font-mono whitespace-nowrap">
                          {{ getQueuedLevel(relic.id) }} <span class="text-gray-500">/ {{ getRelicMaxLevel(relic.id) }}</span>
                        </div>
                        <div class="text-[9px] text-purple-400 whitespace-nowrap">{{ formatTimeToAfford(relic, 1) }}</div>
                      </div>
                      <div class="flex flex-col items-center gap-0.5">
                        <button
                          @click="addRelicToList(relic, 1)"
                          :disabled="getQueuedLevel(relic.id) >= getRelicMaxLevel(relic.id) || getRelicCost(relic, 1) === null"
                          class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded transition-colors text-white font-semibold w-16"
                        >Lvl {{ getQueuedLevel(relic.id) + 1 }}</button>
                        <div class="text-[9px] text-amber-400 whitespace-nowrap">{{ getRelicCost(relic, 1) !== null ? formatNumber(getRelicCost(relic, 1)) : '?' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Tier 3 -->
            <div>
              <h4 class="text-xs font-semibold text-yellow-400 mb-2 border-l-2 border-yellow-500/50 pl-2">Tier 3 Relics</h4>
              <div class="bg-gray-800/40 rounded-lg p-3 border border-yellow-900/30 text-center">
                <IconLock size="20" class="mx-auto text-gray-500 mb-1" />
                <p class="text-xs text-gray-400">Requires Power Gem Level 5</p>
                <p v-if="powerGemLevel > 0" class="text-[10px] text-gray-500 mt-0.5">Current: Level {{ powerGemLevel }}</p>
              </div>
            </div>
            </template>
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
              class="bg-purple-700 hover:bg-purple-600 text-white px-2 py-1 text-xs rounded-lg transition-colors"
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
              v-model="shoppingListModel"
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
                        <img v-if="hasIcon(item.relicId)" :src="getIconUrl(item.relicId)" :alt="item.relicId" class="w-8 h-8 object-contain" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-white truncate">{{ item.relicName }}</div>
                        <div class="text-xs text-gray-400">Level {{ item.fromLevel }} &rarr; {{ item.toLevel }}</div>
                        <div class="flex flex-col gap-0.5 text-[10px] mt-0.5">
                          <span class="text-purple-400">{{ formatItemHours(item) }}</span>
                          <span v-if="formatAvailabilityDate(item)" class="text-purple-400 flex items-center gap-1">
                            <IconCalendar size="10" />
                            {{ formatAvailabilityDate(item) }}
                          </span>
                        </div>
                      </div>
                      <div class="text-right flex-shrink-0">
                        <div class="text-sm font-semibold text-amber-400">{{ formatNumber(item.totalCost) }}</div>
                      </div>
                      <div class="flex gap-1 flex-shrink-0">
                        <button @click="markItemAsPurchased(item.id)" class="text-green-400 hover:text-green-300 p-0.5" title="Mark as Purchased">
                          <IconCheck size="14" />
                        </button>
                        <button @click="store.removeFromShoppingList(item.id)" class="text-red-400 hover:text-red-300 p-0.5" title="Remove">
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

      <!-- Desktop Content Grid -->
      <div class="hidden lg:grid lg:grid-cols-2 gap-4">

        <!-- LEFT: Available Relics -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconList size="20" class="mr-2 text-purple-400" />
              Available Relics
            </h3>
            <div class="flex items-center gap-2">
              <!-- Sort Mode Buttons (Desktop) -->
              <div class="flex gap-1">
                <button
                  v-for="mode in SORT_MODES"
                  :key="mode.id"
                  @click="sortMode = mode.id"
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] font-medium transition-colors',
                    sortMode === mode.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:text-white'
                  ]"
                >{{ mode.label }}</button>
              </div>
              <button
                @click="showLevelsModal = true"
                class="bg-purple-700 hover:bg-purple-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
              >
                <IconSettings size="14" class="mr-1" />
                Manage Levels
              </button>
            </div>
          </div>
          <div class="p-4 space-y-4">

            <!-- Category mode (Desktop) -->
            <template v-if="sortMode === 'category'">
              <div v-for="section in categorySections" :key="section.name">
                <h4 class="text-xs font-semibold text-purple-400 mb-2 border-l-2 border-purple-500/50 pl-2">{{ section.name }}</h4>
                <div class="space-y-2">
                  <div
                    v-for="relic in section.relics"
                    :key="relic.id"
                    class="bg-gray-700/30 rounded-lg p-2 hover:bg-gray-700/50 transition-colors"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-[45px] h-[45px] flex items-center justify-center flex-shrink-0">
                        <img v-if="hasIcon(relic.id)" :src="getIconUrl(relic.id)" :alt="relic.id" class="w-[45px] h-[45px] object-contain" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-white truncate">{{ relicLabel(relic) }}</div>
                        <div class="text-[10px] text-gray-400 truncate mt-0.5">{{ relic.description }}</div>
                      </div>
                      <div class="flex items-center gap-1.5 flex-shrink-0">
                        <div class="flex flex-col items-center gap-0.5">
                          <div class="text-[11px] bg-gray-600/50 px-2 py-1 rounded font-mono whitespace-nowrap">
                            Lvl {{ getQueuedLevel(relic.id) }} <span class="text-gray-500">/ {{ getRelicMaxLevel(relic.id) }}</span>
                          </div>
                          <div class="whitespace-nowrap text-purple-400" style="font-size: 11px">{{ formatTimeToAfford(relic, 1) }}</div>
                        </div>
                        <div class="flex flex-col items-center gap-0.5">
                          <button
                            @click="addRelicToList(relic, 1)"
                            :disabled="getQueuedLevel(relic.id) >= getRelicMaxLevel(relic.id) || getRelicCost(relic, 1) === null"
                            class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded transition-colors text-white font-semibold w-24"
                          >Buy Lvl {{ getQueuedLevel(relic.id) + 1 }}</button>
                          <div class="text-amber-400 whitespace-nowrap" style="font-size: 11px">{{ getRelicCost(relic, 1) !== null ? formatNumber(getRelicCost(relic, 1)) : '?' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Tier 1 Section (id / price sort) -->
            <template v-else>
            <div>
              <h4 class="text-xs font-semibold text-green-400 mb-2 border-l-2 border-green-500/50 pl-2">Tier 1 Relics</h4>
              <div class="space-y-2">
                <div
                  v-for="relic in tier1Relics"
                  :key="relic.id"
                  class="bg-gray-700/30 rounded-lg p-2 hover:bg-gray-700/50 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-[45px] h-[45px] flex items-center justify-center flex-shrink-0">
                      <img v-if="hasIcon(relic.id)" :src="getIconUrl(relic.id)" :alt="relic.id" class="w-[45px] h-[45px] object-contain" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-white truncate">{{ relicLabel(relic) }}</div>
                      <div class="text-[10px] text-gray-400 truncate mt-0.5">{{ relic.description }}</div>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <div class="flex flex-col items-center gap-0.5">
                        <div class="text-[11px] bg-gray-600/50 px-2 py-1 rounded font-mono whitespace-nowrap">
                          Lvl {{ getQueuedLevel(relic.id) }} <span class="text-gray-500">/ {{ getRelicMaxLevel(relic.id) }}</span>
                        </div>
                        <div class="whitespace-nowrap text-purple-400" style="font-size: 11px">{{ formatTimeToAfford(relic, 1) }}</div>
                      </div>
                      <div class="flex flex-col items-center gap-0.5">
                        <button
                          @click="addRelicToList(relic, 1)"
                          :disabled="getQueuedLevel(relic.id) >= getRelicMaxLevel(relic.id) || getRelicCost(relic, 1) === null"
                          class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded transition-colors text-white font-semibold w-24"
                        >Buy Lvl {{ getQueuedLevel(relic.id) + 1 }}</button>
                        <div class="text-amber-400 whitespace-nowrap" style="font-size: 11px">{{ getRelicCost(relic, 1) !== null ? formatNumber(getRelicCost(relic, 1)) : '?' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tier 2 Section -->
            <div>
              <h4 class="text-xs font-semibold text-blue-400 mb-2 border-l-2 border-blue-500/50 pl-2">Tier 2 Relics</h4>
              <div v-if="!tier2Unlocked" class="bg-gray-800/40 rounded-lg p-3 border border-blue-900/30 text-center">
                <IconLock size="20" class="mx-auto text-gray-500 mb-1" />
                <p class="text-xs text-gray-400">Requires Power Gem Level 3</p>
                <p v-if="powerGemLevel > 0" class="text-[10px] text-gray-500 mt-0.5">Current: Level {{ powerGemLevel }}</p>
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="relic in tier2Relics"
                  :key="relic.id"
                  class="bg-gray-700/30 rounded-lg p-2 hover:bg-gray-700/50 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-[45px] h-[45px] flex items-center justify-center flex-shrink-0">
                      <img v-if="hasIcon(relic.id)" :src="getIconUrl(relic.id)" :alt="relic.id" class="w-[45px] h-[45px] object-contain" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-white truncate">{{ relicLabel(relic) }}</div>
                      <div class="text-[10px] text-gray-400 truncate mt-0.5">{{ relic.description }}</div>
                    </div>
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <div class="flex flex-col items-center gap-0.5">
                        <div class="text-[11px] bg-gray-600/50 px-2 py-1 rounded font-mono whitespace-nowrap">
                          Lvl {{ getQueuedLevel(relic.id) }} <span class="text-gray-500">/ {{ getRelicMaxLevel(relic.id) }}</span>
                        </div>
                        <div class="whitespace-nowrap text-purple-400" style="font-size: 11px">{{ formatTimeToAfford(relic, 1) }}</div>
                      </div>
                      <div class="flex flex-col items-center gap-0.5">
                        <button
                          @click="addRelicToList(relic, 1)"
                          :disabled="getQueuedLevel(relic.id) >= getRelicMaxLevel(relic.id) || getRelicCost(relic, 1) === null"
                          class="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded transition-colors text-white font-semibold w-24"
                        >Buy Lvl {{ getQueuedLevel(relic.id) + 1 }}</button>
                        <div class="text-amber-400 whitespace-nowrap" style="font-size: 11px">{{ getRelicCost(relic, 1) !== null ? formatNumber(getRelicCost(relic, 1)) : '?' }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Tier 3 Section -->
            <div>
              <h4 class="text-xs font-semibold text-yellow-400 mb-2 border-l-2 border-yellow-500/50 pl-2">Tier 3 Relics</h4>
              <div class="bg-gray-800/40 rounded-lg p-3 border border-yellow-900/30 text-center">
                <IconLock size="20" class="mx-auto text-gray-500 mb-1" />
                <p class="text-xs text-gray-400">Requires Power Gem Level 5</p>
                <p v-if="powerGemLevel > 0" class="text-[10px] text-gray-500 mt-0.5">Current: Level {{ powerGemLevel }}</p>
              </div>
            </div>
            </template>

          </div>
        </div>

        <!-- RIGHT: Shopping List -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg">
          <div class="p-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconShoppingCart size="20" class="mr-2 text-purple-400" />
              Shopping List
            </h3>
            <button
              v-if="shoppingList.length > 0"
              @click="store.clearShoppingList()"
              class="text-xs px-2 py-1 bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors text-white"
            >
              Clear All
            </button>
          </div>

          <div class="p-4 space-y-3 overflow-y-auto">
            <div v-if="shoppingList.length === 0" class="p-12 text-center">
              <IconShoppingCartOff size="48" class="mx-auto text-gray-600 mb-3" />
              <p class="text-gray-400 text-sm">No items in shopping list</p>
              <p class="text-gray-500 text-xs mt-1">Add Relics from the catalog</p>
            </div>

            <Draggable
              v-else
              v-model="shoppingListModel"
              handle=".grip-handle"
              :animation="200"
              item-key="id"
              class="space-y-2"
            >
              <template #item="{ element: item }">
                <div class="bg-gray-700/30 rounded-lg p-2 transition-all duration-200 hover:bg-gray-700/50 border border-transparent">
                  <div class="flex items-center gap-2">
                    <div class="grip-handle text-gray-500 hover:text-gray-300 cursor-grab flex-shrink-0">
                      <IconGripVertical size="14" />
                    </div>
                    <img
                      v-if="hasIcon(item.relicId)"
                      :src="getIconUrl(item.relicId)"
                      :alt="item.relicId"
                      class="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1">
                        <span class="text-sm text-white truncate">{{ item.relicName }}</span>
                        <span class="text-xs text-gray-400 flex-shrink-0">Lvl {{ item.fromLevel }} &rarr; {{ item.toLevel }}</span>
                      </div>
                      <div class="flex items-center text-xs mt-0.5">
                        <span class="text-purple-400 w-20">{{ formatItemHours(item) }}</span>
                        <span v-if="formatAvailabilityDate(item)" class="text-purple-400 flex items-center gap-1">
                          <IconCalendar size="12" />
                          {{ formatAvailabilityDate(item) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <span class="text-sm font-bold text-amber-400 w-20 text-right">{{ formatNumber(item.totalCost) }}</span>
                      <button @click="markItemAsPurchased(item.id)" class="text-green-400 hover:text-green-300 p-0.5" title="Mark as purchased">
                        <IconCheck size="16" />
                      </button>
                      <button @click="store.removeFromShoppingList(item.id)" class="text-red-400 hover:text-red-300 p-0.5" title="Remove">
                        <IconX size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </Draggable>

            <div v-if="shoppingList.length > 0" class="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 mt-4">
              <div class="flex justify-between items-center">
                <span class="font-medium text-white">Total Cost</span>
                <span class="text-lg font-bold text-amber-400">
                  {{ formatNumber(store.totalShoppingCost) }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Relic Levels Modal -->
  <RelicLevelsModal
    v-if="showLevelsModal"
    @close="showLevelsModal = false"
  />

  <!-- Relic Summary Modal -->
  <RelicSummaryModal
    v-if="showSummaryModal"
    :targetLevels="targetLevels"
    :totalCost="store.totalShoppingCost"
    @close="showSummaryModal = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import {
  IconRefresh,
  IconShoppingCart,
  IconShoppingCartOff,
  IconList,
  IconX,
  IconCheck,
  IconGripVertical,
  IconCalendar,
  IconChartDots,
  IconSettings,
  IconLock,
  IconShare,
} from '@tabler/icons-vue';
import Draggable from 'vuedraggable';
import RelicLevelsModal from '@/components/relic-planner/RelicLevelsModal.vue';
import RelicSummaryModal from '@/components/relic-planner/RelicSummaryModal.vue';
import { useRelicPlannerStore } from '@/store/relicPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { RELICS, calculateTotalCost, getRelicMaxLevel as getRelicMaxLevelFromData } from '@/views/tools/mission-planner/constants/relics.js';
import { formatNumber } from '@/composables/format';
import SuffixInput from '@/composables/SuffixInput.vue';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import HoursInTRInput from '@/composables/HoursInTRInput.vue';

const store = useRelicPlannerStore();
const gemPlannerStore = useGemPlannerStore();
const hunterStore = useHunterStore();
const missionPlannerStore = useMissionPlannerStore();

// Auto-calculated fragments/day from Mission Planner (> 0 only when MP is actively used)
const mpFragsPerDay = computed(() =>
  (missionPlannerStore.getTotalFarmFragsPerHour?.(missionPlannerStore.missionAssignments) ?? 0) * 24
);

function addCampaignFragments() {
  const amount = missionPlannerStore.totalCampaignFragments?.value ?? 0;
  if (!amount) return;
  const current = store.getCurrentFragmentsWithProduction();
  store.updateCurrentFragments(current + amount);
}

// Relic IDs that are also in upgrades.js (hunter sim)
const HUNTER_RELIC_IDS = ['r4', 'r7', 'r16', 'r17', 'r19', 't2r5', 't2r7'];

// -- Modal state ---------------------------------------------------------------
const showLevelsModal = ref(false);
const showSummaryModal = ref(false);

// -- Power Gem / Tier 2 unlock -------------------------------------------------
const powerGemLevel = computed(() => gemPlannerStore.gemStates?.power?.level || 0);
const tier2Unlocked = computed(() => powerGemLevel.value >= 3);

// -- Dynamic max level (Exodus Node 3 + Power Node 1) -------------------------
function getRelicMaxLevel(relicId) {
  if (relicId.startsWith('t2')) return getRelicMaxLevelFromData(relicId, 0);
  const exodusNode3Active = gemPlannerStore.gemStates?.exodus?.nodes?.[2] || false;
  const powerNode1Active = gemPlannerStore.gemStates?.power?.nodes?.[0] || false;
  const powerNode1Bonus = powerNode1Active ? 3 : 0;
  if (relicId === 'r14') return getRelicMaxLevelFromData(relicId, 0);
  if (relicId === 'r5') return getRelicMaxLevelFromData(relicId, (exodusNode3Active ? 10 : 0) + powerNode1Bonus);
  if (relicId === 'r6') return getRelicMaxLevelFromData(relicId, (exodusNode3Active ? 5 : 0) + powerNode1Bonus);
  return getRelicMaxLevelFromData(relicId, exodusNode3Active ? 5 : 0);
}

//  Icons 
const relicIcons = import.meta.glob('@/assets/relics/*.png', { eager: true, import: 'default' });

function hasIcon(relicId) {
  return Object.keys(relicIcons).some(k => k.endsWith(`/${relicId}.png`));
}
function getIconUrl(relicId) {
  const key = Object.keys(relicIcons).find(k => k.endsWith(`/${relicId}.png`));
  return key ? relicIcons[key] : '';
}

//  Sort mode 
const sortMode = ref('id'); // 'id' | 'category' | 'price-asc' | 'price-desc'

const SORT_MODES = [
  { id: 'id',         label: 'By Number' },
  { id: 'category',   label: 'By Category' },
  { id: 'price-asc',  label: 'Cost ↑' },
  { id: 'price-desc', label: 'Cost ↓' },
];

const RELIC_CATEGORIES = {
  'Main Game':   ['r1','r2','r8','r20','t2r1','t2r2','t2r6','t2r9'],
  'Hunter':      ['r4','r7','r16','r17','r19','t2r5','t2r7'],
  'Zeus & Ouro': ['r3','r5','r6','r9','r10','r11','t2r3','t2r4','t2r8','t2r10'],
  'Other':       ['r12','r13','r14','r15','r18'],
};

function getRelicCategory(relicId) {
  for (const [cat, ids] of Object.entries(RELIC_CATEGORIES)) {
    if (ids.includes(relicId)) return cat;
  }
  return 'Other';
}

//  Relic lists 
const availableRelics = computed(() =>
  Object.values(RELICS).filter(r => {
    if (r.tier === 2 && !tier2Unlocked.value) return false;
    return getQueuedLevel(r.id) < getRelicMaxLevel(r.id);
  })
);

function sortedRelicList(relics) {
  if (sortMode.value === 'id') return relics;
  if (sortMode.value === 'category') {
    const catOrder = Object.keys(RELIC_CATEGORIES);
    return [...relics].sort((a, b) => {
      const catA = catOrder.indexOf(getRelicCategory(a.id));
      const catB = catOrder.indexOf(getRelicCategory(b.id));
      if (catA !== catB) return catA - catB;
      return RELIC_CATEGORIES[getRelicCategory(a.id)]?.indexOf(a.id) - RELIC_CATEGORIES[getRelicCategory(b.id)]?.indexOf(b.id);
    });
  }
  if (sortMode.value === 'price-asc') {
    return [...relics].sort((a, b) => {
      const ca = getRelicCost(a, 1) ?? Infinity;
      const cb = getRelicCost(b, 1) ?? Infinity;
      return ca - cb;
    });
  }
  if (sortMode.value === 'price-desc') {
    return [...relics].sort((a, b) => {
      const ca = getRelicCost(a, 1) ?? -1;
      const cb = getRelicCost(b, 1) ?? -1;
      return cb - ca;
    });
  }
  return relics;
}

const tier1Relics = computed(() => {
  const base = availableRelics.value.filter(r => r.tier === 1);
  return sortMode.value === 'id' ? base : sortedRelicList(base);
});
const tier2Relics = computed(() => {
  const base = availableRelics.value.filter(r => r.tier === 2);
  return sortMode.value === 'id' ? base : sortedRelicList(base);
});
const sortedAllRelics = computed(() => sortedRelicList(availableRelics.value));
const allRelics = computed(() => availableRelics.value);

// Category sections for category sort mode
const categorySections = computed(() => {
  const relics = sortedAllRelics.value;
  const sections = [];
  const catOrder = Object.keys(RELIC_CATEGORIES);
  for (const cat of catOrder) {
    const items = relics.filter(r => getRelicCategory(r.id) === cat);
    if (items.length) sections.push({ name: cat, relics: items });
  }
  return sections;
});

// Target levels for summary modal (current + shopping list)
const targetLevels = computed(() => {
  const targets = {};
  Object.values(RELICS).forEach(relic => {
    targets[relic.id] = store.currentLevels[relic.id] || 0;
  });
  store.shoppingList.forEach(item => {
    targets[item.relicId] = Math.max(targets[item.relicId] || 0, item.toLevel);
  });
  return targets;
});

function relicLabel(relic) {
  const n = relic.id.match(/r(\d+)/)?.[1];
  return `#${n} - ${relic.name || relic.description || relic.id}`;
}

//  Mobile 
const activeMobileTab = ref('available');

//  Level helpers 
function getLevel(relicId) {
  return store.currentLevels[relicId] || 0;
}

// Returns the highest planned level (committed + shopping list)
function getQueuedLevel(relicId) {
  const committed = getLevel(relicId);
  const entries = store.shoppingList.filter(i => i.relicId === relicId);
  if (!entries.length) return committed;
  return Math.max(committed, ...entries.map(i => i.toLevel));
}

function getLevelsToNextTen(relicId) {
  const current = getQueuedLevel(relicId);
  const maxLevel = getRelicMaxLevel(relicId);
  const nextTen = Math.ceil((current + 1) / 10) * 10;
  const capped = Math.min(nextTen, maxLevel);
  return Math.max(1, capped - current);
}

//  Cost helpers 
function getRelicCost(relic, levels) {
  const current = getQueuedLevel(relic.id);
  const maxLevel = getRelicMaxLevel(relic.id);
  if (current >= maxLevel) return 0;
  const to = Math.min(current + levels, maxLevel);
  const cost = calculateTotalCost(relic.id, current, to);
  return isFinite(cost) ? cost : null;
}

function formatTimeToAfford(relic, levels) {
  const rate = store.settings.fragmentsPerDay;
  if (!rate) return '-';
  const avail = store.getCurrentFragmentsWithProduction();
  const cost = getRelicCost(relic, levels);
  if (cost === null) return '-';
  const remaining = Math.max(0, cost - avail);
  if (remaining <= 0) return 'Now';
  const days = remaining / rate;
  if (days > 36500) return 'x';
  const d = Math.floor(days);
  const h = Math.round((days - d) * 24);
  if (d === 0) return `${h}h`;
  if (h === 0) return `${d}d`;
  return `${d}d ${h}h`;
}

//  Shopping list 
const shoppingList = computed(() => store.shoppingList);

const shoppingListModel = computed({
  get: () => store.shoppingList,
  set: v => store.updateShoppingListOrder(v),
});

function addRelicToList(relic, levels) {
  const fromLevel = getQueuedLevel(relic.id);
  const maxLevel = getRelicMaxLevel(relic.id);
  if (fromLevel >= maxLevel) return;
  const toLevel = Math.min(fromLevel + levels, maxLevel);
  const totalCost = calculateTotalCost(relic.id, fromLevel, toLevel);
  if (!isFinite(totalCost)) return;
  store.addToShoppingList({
    relicId: relic.id,
    relicName: relicLabel(relic),
    description: relic.description || '',
    fromLevel,
    toLevel,
    totalCost,
  });
}

function markItemAsPurchased(itemId) {
  const item = store.shoppingList.find(i => i.id === itemId);
  if (!item) return;
  const current = store.getCurrentFragmentsWithProduction();
  store.updateCurrentFragments(Math.max(0, current - item.totalCost));
  store.markAsPurchased(itemId);
  // Sync back to hunterStore if this is a hunter relic
  if (HUNTER_RELIC_IDS.includes(item.relicId)) {
    if (!hunterStore.upgrades.relics) hunterStore.upgrades.relics = {};
    hunterStore.upgrades.relics[item.relicId] = item.toLevel;
  }
}

// Sync relic levels from hunterStore → relicPlannerStore (e.g. changed in Upgrades tab)
function syncRelicLevelsFromHunterStore() {
  const storeRelics = hunterStore.upgrades?.relics || {};
  HUNTER_RELIC_IDS.forEach(relicId => {
    const newLevel = storeRelics[relicId];
    if (newLevel === undefined) return;
    const currentLevel = store.currentLevels[relicId] ?? 0;
    if (newLevel === currentLevel) return;
    store.updateCurrentLevel(relicId, newLevel);
    // Clean up shopping list items that are now obsolete
    if (newLevel > currentLevel) {
      const toRemove = [];
      store.shoppingList.forEach(item => {
        if (item.relicId !== relicId) return;
        if (item.toLevel <= newLevel) {
          toRemove.push(item.id);
        } else if (item.fromLevel < newLevel) {
          item.fromLevel = newLevel;
          item.totalCost = calculateTotalCost(relicId, item.fromLevel, item.toLevel);
        }
      });
      toRemove.forEach(id => store.removeFromShoppingList(id));
    }
  });
}

//  Fragments / production 
const liveUpdateTrigger = ref(0);
let liveInterval = null;

const fragmentsPerDay = computed({
  get: () => store.settings.fragmentsPerDay,
  set: v => store.updateFragmentsPerDay(v),
});

const currentFragments = computed({
  get() {
    const _ = liveUpdateTrigger.value; // eslint-disable-line no-unused-vars
    return store.getCurrentFragmentsWithProduction();
  },
  set(v) {
    store.updateCurrentFragments(v);
  },
});

//  Time / date helpers 
function formatTimeToSave() {
  if (!store.settings.fragmentsPerDay) return 'Set rate';
  if (!store.shoppingList.length) return '-';
  let cumDays = 0;
  let avail = store.getCurrentFragmentsWithProduction();
  const rate = store.settings.fragmentsPerDay;
  for (const item of store.shoppingList) {
    const need = Math.max(0, item.totalCost - avail);
    const days = need / rate;
    cumDays += days;
    avail = avail + days * rate - item.totalCost;
  }
  if (cumDays <= 0) return 'Ready';
  if (cumDays > 36500) return 'x';
  const d = Math.floor(cumDays);
  const h = Math.round((cumDays - d) * 24);
  if (d === 0) return `${h}h`;
  if (h === 0) return `${d}d`;
  return `${d}d ${h}h`;
}

function formatTotalHoursInTR() {
  if (!store.shoppingList.length) return '-';
  let cumulativeHours = gemPlannerStore.getCurrentHoursInTR();
  let avail = store.getCurrentFragmentsWithProduction();
  const rate = store.settings.fragmentsPerDay;
  for (const item of store.shoppingList) {
    if (rate > 0) {
      const need = Math.max(0, item.totalCost - avail);
      const days = need / rate;
      cumulativeHours += days * 24;
      avail = avail + days * rate - item.totalCost;
    }
  }
  return `@${Math.round(cumulativeHours)}h`;
}

function formatItemHours(item) {
  let cumulativeHours = gemPlannerStore.getCurrentHoursInTR();
  let avail = store.getCurrentFragmentsWithProduction();
  const rate = store.settings.fragmentsPerDay;
  for (const i of store.shoppingList) {
    if (rate > 0) {
      const need = Math.max(0, i.totalCost - avail);
      const days = need / rate;
      cumulativeHours += days * 24;
      avail = avail + days * rate - i.totalCost;
    }
    if (i.id === item.id) break;
  }
  return `@${Math.round(cumulativeHours)}h`;
}

function formatAvailabilityDate(item) {
  const rate = store.settings.fragmentsPerDay;
  if (!rate) return null;
  let avail = store.getCurrentFragmentsWithProduction();
  let cumDays = 0;
  for (const i of store.shoppingList) {
    const need = Math.max(0, i.totalCost - avail);
    const days = need / rate;
    cumDays += days;
    avail = avail + days * rate - i.totalCost;
    if (i.id === item.id) break;
  }
  if (cumDays <= 0) return null;
  const d = new Date(Date.now() + cumDays * 86400000);
  const locale = navigator.language || 'en-US';
  if (cumDays > 2) {
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: cumDays > 300 ? 'numeric' : undefined });
  }
  return d.toLocaleString(locale, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

//  Reset 
function resetProduction() {
  store.resetAll();
}

//  Lifecycle 
onMounted(() => {
  store.resetFragmentsTimestamp();
  syncRelicLevelsFromHunterStore();
  liveInterval = setInterval(() => { liveUpdateTrigger.value++; }, 10000);
});

// Watch hunterStore relic levels for changes (e.g. from Upgrades page)
watch(
  () => hunterStore.upgrades?.relics,
  () => syncRelicLevelsFromHunterStore(),
  { deep: true }
);

// Auto-sync Mission Planner fragments/day → Relic Planner (transparent for non-MP users)
watch(mpFragsPerDay, (val) => {
  if (val > 0) store.updateFragmentsPerDay(Math.round(val));
}, { immediate: true });

onUnmounted(() => {
  if (liveInterval) clearInterval(liveInterval);
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

.grip-handle:active {
  cursor: grabbing;
}
</style>





