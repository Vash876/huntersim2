<template>
  <!-- Min-height in pixels - adjust MIN_HEIGHT_PX value as needed -->
  <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden flex flex-col" :style="{ minHeight: MIN_HEIGHT_PX + 'px' }">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-700 to-gray-800 p-2.5 border-b border-gray-600">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-white flex items-center">
          <IconAdjustments size="16" class="mr-2 text-purple-400" />
          Mission Modifiers
        </h2>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-gray-800/80 border-b border-gray-700/50 flex-shrink-0">
      <div class="flex overflow-x-auto">
        <button
          @click="activeTab = 'gameProgress'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] border-b-2 whitespace-nowrap"
          :class="activeTab === 'gameProgress' 
            ? 'bg-gray-700/50 text-white border-white shadow-[0_0_8px_rgba(255,255,255,0.2)]' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30 hover:border-gray-400/50 border-transparent'"
        >
          Progress
        </button>
        <button
          @click="activeTab = 'relics'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] border-b-2 whitespace-nowrap"
          :class="activeTab === 'relics' 
            ? 'bg-purple-900/30 text-purple-400 border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]' 
            : 'text-gray-400 hover:text-purple-300 hover:bg-purple-900/20 hover:border-purple-500/50 border-transparent'"
        >
          Relics
        </button>
        <button
          @click="activeTab = 'badges'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] border-b-2 whitespace-nowrap"
          :class="activeTab === 'badges' 
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]' 
            : 'text-gray-400 hover:text-yellow-300 hover:bg-yellow-900/20 hover:border-yellow-500/50 border-transparent'"
        >
          Badges
        </button>
        <button
          @click="activeTab = 'boons'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] border-b-2 whitespace-nowrap"
          :class="activeTab === 'boons' 
            ? 'bg-red-900/30 text-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]' 
            : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20 hover:border-red-500/50 border-transparent'"
        >
          Boons
        </button>
        <button
          @click="activeTab = 'inscryptions'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] border-b-2 whitespace-nowrap"
          :class="activeTab === 'inscryptions' 
            ? 'bg-rose-900/30 text-rose-400 border-rose-500 shadow-[0_0_8px_rgba(251,113,133,0.3)]' 
            : 'text-gray-400 hover:text-rose-300 hover:bg-rose-900/20 hover:border-rose-500/50 border-transparent'"
        >
          Inscryptions
        </button>
        <button
          @click="activeTab = 'gadgets'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] border-b-2 whitespace-nowrap"
          :class="activeTab === 'gadgets' 
            ? 'bg-sky-900/30 text-sky-400 border-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.3)]' 
            : 'text-gray-400 hover:text-sky-300 hover:bg-sky-900/20 hover:border-sky-400/50 border-transparent'"
        >
          Gadgets
        </button>
        <button
          @click="activeTab = 'gems'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] border-b-2 whitespace-nowrap"
          :class="activeTab === 'gems' 
            ? 'bg-blue-900/30 text-blue-500 border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]' 
            : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 hover:border-blue-500/50 border-transparent'"
        >
          Gems
        </button>
        <button
          @click="activeTab = 'other'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] border-b-2 whitespace-nowrap"
          :class="activeTab === 'other' 
            ? 'bg-gray-700/50 text-gray-300 border-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.2)]' 
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30 hover:border-gray-400/50 border-transparent'"
        >
          Other
        </button>
      </div>
    </div>

    <!-- Content Area - Scrollable Modifier Inputs -->
    <div class="flex-1 overflow-y-auto p-2 min-h-0">
      <!-- Modifier Inputs -->
      <div>
        <!-- Game Progress Tab -->
        <div v-if="activeTab === 'gameProgress'" class="space-y-0.5">
            <div v-for="(modifier, index) in modifiers.gameProgress" :key="modifier.id" 
              class="flex items-center justify-between py-1.5 px-2 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <div class="flex flex-col min-w-0">
                <label class="text-xs text-gray-300 flex items-center gap-1.5">
                  <!-- Icon: Tabler Icon -->
                  <IconPlus v-if="modifier.icon === 'IconPlus'" size="14" class="text-red-500" />
                  <!-- Icon: Image path -->
                  <img v-else-if="modifier.icon && !modifier.icon.startsWith('Icon')" :src="getModifierIconUrl(modifier.icon)" class="w-3.5 h-3.5" />
                  {{ modifier.name }}
                </label>
                <!-- +Ultima Cost-Benefit Row -->
                <div v-if="modifier.id === 'plus_ultima' && getPlusUltimaBenefit()" 
                  class="flex items-center text-[11px] mt-0.5 font-mono">
                  <template v-if="getPlusUltimaBenefit().canAffordNewLevels">
                    <span class="text-green-400">+{{ formatNumber(getPlusUltimaBenefit().deltaFragsPerDay) }}/d</span>
                  </template>
                  <template v-else>
                    <span class="text-gray-500 text-[10px]">MP zu niedrig</span>
                  </template>
                </div>
              </div>
              <ToolValueControls
                class="w-[160px]"
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="modifier.control || 1"
                :fast-step="modifier.fastControls || 10"
                :show-fast-controls="true"
                :tab-index="index + 1"
                :auto-edit="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Space Academy Relics Tab -->
          <div v-if="activeTab === 'relics'" class="space-y-0.5">
            <div v-for="(modifier, index) in modifiers.relics" :key="modifier.id" 
              class="flex items-center justify-between py-1.5 px-2 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <div class="flex flex-col min-w-0">
                <label class="text-xs text-gray-300">{{ modifier.name }}</label>
                <!-- Cost-Benefit Row for farm-affecting relics (R3, R5, T2R8) -->
                <div v-if="isRelicFarmAffecting(modifier.id) && missionPlannerStore.modifierValues[modifier.id] < getRelicModifierMaxLevel(modifier.id) && getRelicCostBenefit(modifier.id)" 
                  class="flex items-center text-[11px] mt-0.5 font-mono">
                  <span class="text-yellow-400 w-[58px] text-right">{{ getFormattedRelicNextLevelCost(modifier.id) }}</span>
                  <span class="text-gray-500 px-1">→</span>
                  <span class="text-green-400 w-[72px] text-right">+{{ formatNumber(getRelicCostBenefit(modifier.id).deltaFragsPerDay) }}/d</span>
                  <span class="text-gray-500 px-1">|</span>
                  <span :class="getRelicEfficiencyColorClass(modifier.id)" class="w-[58px] text-right">{{ formatRelicEfficiency(modifier.id) }}</span>
                </div>
              </div>
              <ToolValueControls
                class="w-[160px]"
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="getRelicModifierMaxLevel(modifier.id)"
                :step="modifier.control || 1"
                :fast-step="modifier.fastControls || 10"
                :show-fast-controls="true"
                :tab-index="index + 1"
                :auto-edit="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Badges Tab -->
          <div v-if="activeTab === 'badges'" class="space-y-0.5">
            <div v-for="(modifier, index) in modifiers.badges" :key="modifier.id" 
              class="flex items-center py-1.5 px-2 rounded cursor-pointer"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
              @click="updateModifier(modifier.id, !missionPlannerStore.modifierValues[modifier.id])"
            >
              <!-- Toggle Switch -->
              <div class="relative w-8 h-4 rounded-full transition-colors duration-200 mr-2 flex-shrink-0"
                :class="missionPlannerStore.modifierValues[modifier.id] 
                  ? 'bg-green-600' 
                  : 'bg-gray-600'"
              >
                <div class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200"
                  :class="missionPlannerStore.modifierValues[modifier.id] ? 'translate-x-4' : 'translate-x-0'"
                ></div>
              </div>
              <label class="text-xs text-gray-300 cursor-pointer select-none flex-1">
                {{ modifier.name }}
              </label>
            </div>
          </div>

          <!-- Boons Tab -->
          <div v-if="activeTab === 'boons'" class="space-y-0.5">
            <div v-for="(modifier, index) in modifiers.mods" :key="modifier.id" 
              class="flex items-center justify-between py-1.5 px-2 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <label class="text-xs text-gray-300">{{ modifier.name }}</label>
              <ToolValueControls
                class="w-[160px]"
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="modifier.control || 1"
                :fast-step="modifier.fastControls || 10"
                :show-fast-controls="true"
                :tab-index="index + 1"
                :auto-edit="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Inscryptions Tab -->
          <div v-if="activeTab === 'inscryptions'" class="space-y-0.5">
            <div v-for="(modifier, index) in modifiers.inscryptions" :key="modifier.id" 
              class="flex items-center justify-between py-1.5 px-2 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <div class="flex flex-col min-w-0">
                <label class="text-xs text-gray-300">{{ modifier.name }}</label>
                <!-- Cost-Benefit Row mit festen Spaltenbreiten -->
                <div v-if="missionPlannerStore.modifierValues[modifier.id] < modifier.max && getInscryptionCostBenefit(modifier.id)" 
                  class="flex items-center text-[11px] mt-0.5 font-mono">
                  <span class="text-yellow-400 w-[58px] text-right">{{ getFormattedNextLevelCost(modifier.id) }}</span>
                  <span class="text-gray-500 px-1">→</span>
                  <span class="text-green-400 w-[72px] text-right">+{{ formatNumber(getInscryptionCostBenefit(modifier.id).deltaFragsPerDay) }}/d</span>
                  <span class="text-gray-500 px-1">|</span>
                  <span :class="getEfficiencyColorClass(modifier.id)" class="w-[58px] text-right">{{ formatEfficiency(modifier.id) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <ToolValueControls
                  class="w-[160px]"
                  :value="missionPlannerStore.modifierValues[modifier.id]"
                  :min-value="modifier.min"
                  :max-value="modifier.max"
                  :step="modifier.control || 1"
                  :fast-step="modifier.fastControls || 10"
                  :show-fast-controls="true"
                  :tab-index="index + 1"
                  :auto-edit="true"
                  @update:value="updateModifier(modifier.id, $event)"
                />
              </div>
            </div>
          </div>

          <!-- Gadgets Tab -->
          <div v-if="activeTab === 'gadgets'" class="space-y-0.5">
            <div v-for="(modifier, index) in modifiers.gadgets" :key="modifier.id" 
              class="flex items-center justify-between py-1.5 px-2 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <div class="flex flex-col min-w-0">
                <label class="text-xs text-gray-300">{{ modifier.name }}</label>
                <!-- Cost-Benefit Row for Local Fragment Magnet (G12) -->
                <template v-if="modifier.id === 'local_fragment_magnet'">
                  <!-- +1 Level -->
                  <div v-if="getGadgetCostBenefit(modifier.id, 1)" 
                    class="flex items-center text-[11px] mt-0.5 font-mono">
                    <span class="text-gray-500 w-[20px]">+1:</span>
                    <span class="text-yellow-400 w-[58px] text-right">{{ getFormattedGadgetCost(modifier.id, 1) }}</span>
                    <span class="text-gray-500 px-1">→</span>
                    <span class="text-green-400 w-[72px] text-right">+{{ formatNumber(getGadgetCostBenefit(modifier.id, 1).deltaFragsPerDay) }}/d</span>
                    <span class="text-gray-500 px-1">|</span>
                    <span :class="getGadgetEfficiencyColorClass(modifier.id, 1)" class="w-[58px] text-right">{{ formatGadgetEfficiency(modifier.id, 1) }}</span>
                  </div>
                  <!-- +10 Levels -->
                  <div v-if="getGadgetCostBenefit(modifier.id, 10)" 
                    class="flex items-center text-[11px] mt-0.5 font-mono">
                    <span class="text-gray-500 w-[20px]">+10:</span>
                    <span class="text-yellow-400 w-[58px] text-right">{{ getFormattedGadgetCost(modifier.id, 10) }}</span>
                    <span class="text-gray-500 px-1">→</span>
                    <span class="text-green-400 w-[72px] text-right">+{{ formatNumber(getGadgetCostBenefit(modifier.id, 10).deltaFragsPerDay) }}/d</span>
                    <span class="text-gray-500 px-1">|</span>
                    <span :class="getGadgetEfficiencyColorClass(modifier.id, 10)" class="w-[58px] text-right">{{ formatGadgetEfficiency(modifier.id, 10) }}</span>
                  </div>
                </template>
              </div>
              <ToolValueControls
                class="w-[160px]"
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="modifier.control || 1"
                :fast-step="modifier.fastControls || 10"
                :show-fast-controls="true"
                :tab-index="index + 1"
                :auto-edit="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Other Tab -->
          <div v-if="activeTab === 'other'" class="space-y-0.5">
            <!-- Boolean modifiers (toggles) -->
            <template v-for="(modifier, index) in modifiers.other" :key="modifier.id">
              <div v-if="modifier.type === 'boolean'" 
                class="flex items-center py-1.5 px-2 rounded cursor-pointer"
                :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
                @click="updateModifier(modifier.id, !missionPlannerStore.modifierValues[modifier.id])"
              >
                <!-- Toggle Switch -->
                <div class="relative w-8 h-4 rounded-full transition-colors duration-200 mr-2 flex-shrink-0"
                  :class="missionPlannerStore.modifierValues[modifier.id] 
                    ? 'bg-green-600' 
                    : 'bg-gray-600'"
                >
                  <div class="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200"
                    :class="missionPlannerStore.modifierValues[modifier.id] ? 'translate-x-4' : 'translate-x-0'"
                  ></div>
                </div>
                <label class="text-xs text-gray-300 cursor-pointer select-none flex-1">
                  {{ modifier.name }}
                </label>
              </div>
              
              <!-- Readonly modifier (Eternal Milestone) -->
              <div v-else-if="modifier.type === 'readonly'" 
                class="flex items-center justify-between py-1.5 px-2 rounded"
                :class="isEternalMilestoneUnlocked ? 'bg-gray-800/50' : 'bg-gray-800/30 opacity-60'"
              >
                <div class="flex items-center space-x-1">
                  <div class="w-1.5 h-1.5 rounded-full" 
                    :class="isEternalMilestoneUnlocked && eternalMilestoneLevel > 0 ? 'bg-green-500' : 'bg-gray-600'"></div>
                  <span class="text-xs" :class="isEternalMilestoneUnlocked ? 'text-white' : 'text-gray-500'">
                    {{ modifier.name }}
                  </span>
                  <span v-if="!isEternalMilestoneUnlocked" class="text-[9px] text-red-400">
                    🔒 Lv{{ attractionGemLevel }}/3
                  </span>
                </div>
                <div v-if="isEternalMilestoneUnlocked" class="flex items-center space-x-1">
                  <span class="text-[10px] font-mono text-blue-400">Lv{{ eternalMilestoneLevel }}</span>
                </div>
              </div>
            </template>
          </div>

          <!-- Gems Tab -->
          <div v-if="activeTab === 'gems'" class="space-y-2">
            <p class="text-[10px] text-gray-400 mb-2">
              Gem nodes from Gem Overview. Only special inputs editable.
            </p>

            <!-- Grouped by Gem Type -->
            <div class="space-y-2">
              <!-- Attraction Gem -->
              <div class="bg-gray-800/30 rounded p-2 border-l-2 border-blue-500/50">
                <h5 class="text-xs font-semibold mb-1 flex items-center text-blue-400">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 bg-blue-500"></span>
                  Attraction Gem
                </h5>
                <div class="flex flex-wrap gap-1">
                  <div v-for="modifier in gemsByType.attraction" :key="modifier.id" 
                    class="px-1.5 py-0.5 rounded text-[10px]"
                    :class="isGemNodeActive(modifier.id) ? 'bg-blue-900/50 text-white shadow-[0_0_6px_rgba(59,130,246,0.4)] border border-blue-500/30' : 'bg-gray-800/50 text-gray-500'"
                  >
                    <span class="w-1 h-1 rounded-full inline-block mr-0.5" 
                      :class="isGemNodeActive(modifier.id) ? 'bg-green-400' : 'bg-gray-600'"></span>
                    {{ modifier.name }}
                  </div>
                </div>
              </div>

              <!-- Creation Gem -->
              <div class="bg-gray-800/30 rounded p-2 border-l-2 border-orange-500/50">
                <h5 class="text-xs font-semibold mb-1 flex items-center text-orange-400">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 bg-orange-500"></span>
                  Creation Gem
                </h5>
                <div class="space-y-1">
                  <div class="flex flex-wrap gap-1">
                    <div v-for="modifier in gemsByType.creation" :key="modifier.id" 
                      class="px-1.5 py-0.5 rounded text-[10px]"
                      :class="isGemNodeActive(modifier.id) ? 'bg-orange-900/50 text-white shadow-[0_0_6px_rgba(249,115,22,0.4)] border border-orange-500/30' : 'bg-gray-800/50 text-gray-500'"
                    >
                      <span class="w-1 h-1 rounded-full inline-block mr-0.5" 
                        :class="isGemNodeActive(modifier.id) ? 'bg-green-400' : 'bg-gray-600'"></span>
                      {{ modifier.name }}
                    </div>
                  </div>
                  <!-- Mechs Owned Input -->
                  <div v-if="isGemNodeActive('creation_node_5')" 
                    class="flex items-center justify-between bg-gray-800/50 rounded p-1.5"
                  >
                    <div class="flex items-center space-x-1">
                      <label class="text-[10px] text-gray-400">Mechs:</label>
                      <span class="text-[10px] font-mono" style="color: #f97316;">
                        ×{{ (1.001 ** (missionPlannerStore.modifierValues.creation_node_5_mechs || 0)).toFixed(4) }}
                      </span>
                    </div>
                    <ToolValueControls
                      class="w-[160px]"
                      :value="missionPlannerStore.modifierValues.creation_node_5_mechs || 0"
                      :min-value="0"
                      :max-value="100000"
                      :step="1"
                      :show-fast-controls="true"
                      :tab-index="1"
                      :auto-edit="true"
                      @update:value="updateModifier('creation_node_5_mechs', $event)"
                    />
                  </div>
                </div>
              </div>

              <!-- Exodus Gem -->
              <div class="bg-gray-800/30 rounded p-2 border-l-2 border-purple-500/50">
                <h5 class="text-xs font-semibold mb-1 flex items-center text-purple-400">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 bg-purple-500"></span>
                  Exodus Gem
                </h5>
                <div class="space-y-1">
                  <div class="flex flex-wrap gap-1">
                    <div v-for="modifier in gemsByType.exodus" :key="modifier.id" 
                      class="px-1.5 py-0.5 rounded text-[10px]"
                      :class="isGemNodeActive(modifier.id) ? 'bg-purple-900/50 text-white shadow-[0_0_6px_rgba(139,92,246,0.4)] border border-purple-500/30' : 'bg-gray-800/50 text-gray-500'"
                    >
                      <span class="w-1 h-1 rounded-full inline-block mr-0.5" 
                        :class="isGemNodeActive(modifier.id) ? 'bg-green-400' : 'bg-gray-600'"></span>
                      {{ modifier.name }}
                    </div>
                  </div>
                  <!-- Loopmods Owned Input -->
                  <div v-if="isGemNodeActive('exodus_node_2')" 
                    class="flex items-center justify-between bg-gray-800/50 rounded p-1.5"
                  >
                    <div class="flex items-center space-x-1">
                      <label class="text-[10px] text-gray-400">Loopmods:</label>
                      <span class="text-[10px] font-mono" style="color: #8b5cf6;">
                        +{{ (Math.floor((missionPlannerStore.modifierValues.exodus_node_2_loopmods || 0) / 10000)).toFixed(0) }}%
                      </span>
                    </div>
                    <ToolValueControls
                      class="w-[160px]"
                      :value="missionPlannerStore.modifierValues.exodus_node_2_loopmods || 0"
                      :min-value="0"
                      :max-value="10000000"
                      :step="10000"
                      :fast-step="100000"
                      :show-fast-controls="true"
                      :tab-index="2"
                      :auto-edit="true"
                      @update:value="updateModifier('exodus_node_2_loopmods', $event)"
                    />
                  </div>
                  <!-- Exodus Node 3: Relic Max Level Bonus -->
                  <div v-if="isGemNodeActive('exodus_node_3')" 
                    class="flex items-center justify-between bg-gray-800/50 rounded p-1.5"
                  >
                    <div class="flex items-center space-x-1">
                      <label class="text-[10px] text-gray-400">Relic Max Lv:</label>
                      <span class="text-[10px] font-mono" style="color: #8b5cf6;">
                        +{{ missionPlannerStore.modifierValues.exodus_node_3_level || 0 }}
                      </span>
                    </div>
                    <ToolValueControls
                      class="w-[160px]"
                      :value="missionPlannerStore.modifierValues.exodus_node_3_level || 0"
                      :min-value="0"
                      :max-value="5"
                      :step="1"
                      :show-fast-controls="true"
                      :tab-index="3"
                      :auto-edit="true"
                      @update:value="updateModifier('exodus_node_3_level', $event)"
                    />
                  </div>
                </div>
              </div>

              <!-- Power Gem -->
              <div class="bg-gray-800/30 rounded p-2 border-l-2 border-violet-500/50">
                <h5 class="text-xs font-semibold mb-1 flex items-center text-violet-400">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5 bg-violet-500"></span>
                  Power Gem
                </h5>
                <div class="flex flex-wrap gap-1">
                  <div v-for="modifier in gemsByType.power" :key="modifier.id" 
                    class="px-1.5 py-0.5 rounded text-[10px]"
                    :class="isGemNodeActive(modifier.id) ? 'bg-violet-900/50 text-white shadow-[0_0_6px_rgba(139,92,246,0.4)] border border-violet-500/30' : 'bg-gray-800/50 text-gray-500'"
                  >
                    <span class="w-1 h-1 rounded-full inline-block mr-0.5" 
                      :class="isGemNodeActive(modifier.id) ? 'bg-green-400' : 'bg-gray-600'"></span>
                    {{ modifier.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Bottom: Effects Summary (fixed at bottom) -->
    <div class="flex-shrink-0 p-2 pt-0">
      <div class="bg-gray-900/70 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3 shadow-lg">
          <h3 class="text-sm font-bold text-white mb-3 flex items-center">
            <div class="w-1 h-4 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-r mr-2"></div>
            Modifier Effects
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <!-- Personnel Section -->
            <div class="space-y-2">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Personnel</h4>
              
              <!-- Personnel Table -->
              <div class="bg-gray-800/70 rounded overflow-hidden border border-gray-700/30">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-gray-700/50 bg-gray-700/30">
                      <th class="text-left text-gray-400 font-semibold py-1.5 px-2">Type</th>
                      <th class="text-right text-gray-400 font-semibold py-1.5 px-2">Count</th>
                      <th class="text-right text-gray-400 font-semibold py-1.5 px-2">Ind. Pwr</th>
                      <th class="text-right text-gray-400 font-semibold py-1.5 px-2">Total Pwr</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30">
                      <td class="py-1.5 px-2 text-gray-300"><span class="text-red-400 font-semibold">T1</span> Mining Pod</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono">{{ calculatedEffects.t1Count }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-300 font-mono">{{ calculatedEffects.t1PowerPerUnit }}</td>
                      <td class="py-1.5 px-2 text-right text-white font-mono font-semibold">{{ calculatedEffects.t1Power }}</td>
                    </tr>
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30">
                      <td class="py-1.5 px-2 text-gray-300"><span class="text-orange-400 font-semibold">T2</span> Fireteam</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono">{{ calculatedEffects.t2Count }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-300 font-mono">{{ calculatedEffects.t2PowerPerUnit }}</td>
                      <td class="py-1.5 px-2 text-right text-white font-mono font-semibold">{{ calculatedEffects.t2Power }}</td>
                    </tr>
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30">
                      <td class="py-1.5 px-2 text-gray-300"><span class="text-yellow-400 font-semibold">T3</span> Titan</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono">{{ calculatedEffects.t3Count }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-300 font-mono">{{ calculatedEffects.t3PowerPerUnit }}</td>
                      <td class="py-1.5 px-2 text-right text-white font-mono font-semibold">{{ calculatedEffects.t3Power }}</td>
                    </tr>
                    <tr class="hover:bg-gray-700/30">
                      <td class="py-1.5 px-2 text-gray-300"><span class="text-green-400 font-semibold">T4</span> Corvette</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono">{{ calculatedEffects.t4Count }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-300 font-mono">{{ calculatedEffects.t4PowerPerUnit }}</td>
                      <td class="py-1.5 px-2 text-right text-white font-mono font-semibold">{{ calculatedEffects.t4Power }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-700/50 border-t border-gray-600">
                      <td class="py-1.5 px-2 text-white font-semibold">Total</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono font-semibold">{{ calculatedEffects.totalCount }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-400">-</td>
                      <td class="py-1.5 px-2 text-right text-green-400 font-mono font-bold">{{ calculatedEffects.totalPower }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Mission Effects Section -->
            <div class="space-y-2">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mission Effects</h4>
              
              <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-300 flex items-center gap-1.5">
                    <IconBrandSpeedtest size="16" class="text-green-400" />
                    Mission Speed
                  </span>
                  <span class="text-green-400 font-mono">{{ calculatedEffects.missionSpeed }}%</span>
                </div>
              </div>

              <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-300 flex items-center gap-1.5">
                    <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
                    Farm Fragments
                  </span>
                  <span class="text-cyan-400 font-mono">{{ calculatedEffects.farmFragmentsValue }}</span>
                </div>
              </div>

              <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-300 flex items-center gap-1.5">
                    <img src="@/assets/general/fragments.png" alt="Fragments" class="w-4 h-4" />
                    Campaign Fragments
                  </span>
                  <span class="text-purple-400 font-mono">{{ calculatedEffects.campaignFragmentsValue }}</span>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IconAdjustments, IconBrandSpeedtest, IconPlus } from '@tabler/icons-vue';
import { MODIFIERS } from '@/views/tools/mission-planner/constants/modifiers';
import { getRelicMaxLevel as getRelicMaxLevelFromData } from '@/views/tools/mission-planner/constants/relics';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import { getNextLevelCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, calcGadgetCostDifference, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { formatNumber } from '@/composables/format';
import { RELIC_COSTS } from '@/views/tools/mission-planner/constants/relics';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// Import modifier icons (required for Vite/Netlify production builds)
import cellsIcon from '@/assets/general/cells.png';
import mpIcon from '@/assets/general/mp.png';
import rpIcon from '@/assets/general/rp.png';

// ============================================
// CONFIGURATION - Adjust this value as needed
// ============================================
const MIN_HEIGHT_PX = 717; // Minimum height in pixels

// Store
const missionPlannerStore = useMissionPlannerStore();
const gemPlannerStore = useGemPlannerStore();
const hunterStore = useHunterStore();

// Local state
const modifiers = MODIFIERS;
const activeTab = ref('gameProgress');

// Eternal Milestone from hunterStore (read-only)
const eternalMilestoneLevel = computed(() => {
  return hunterStore.getUpgradeValue('shardmilestones', 'm0') || 0;
});

// Attraction Gem Level (required Level 3 to unlock Eternal Milestone)
const attractionGemLevel = computed(() => {
  return gemPlannerStore.gemStates?.attraction?.level || 0;
});

// Check if Eternal Milestone is unlocked (Attraction Gem Level 3+)
const isEternalMilestoneUnlocked = computed(() => {
  return attractionGemLevel.value >= 3;
});

// Gem nodes grouped by type
const gemsByType = computed(() => {
  const gems = modifiers.gems || [];
  const readonlyGems = gems.filter(m => m.type === 'readonly');
  return {
    attraction: readonlyGems.filter(m => m.id.startsWith('attraction_')),
    creation: readonlyGems.filter(m => m.id.startsWith('creation_')),
    exodus: readonlyGems.filter(m => m.id.startsWith('exodus_')),
    power: readonlyGems.filter(m => m.id.startsWith('power_'))
  };
});

// Map gem node IDs to gemPlannerStore format
const GEM_NODE_MAPPING = {
  'attraction_node_1': { gemId: 'attraction', nodeIndex: 0 },
  'attraction_node_4': { gemId: 'attraction', nodeIndex: 3 },
  'creation_node_5': { gemId: 'creation', nodeIndex: 4 },
  'exodus_node_2': { gemId: 'exodus', nodeIndex: 1 },
  'exodus_node_3': { gemId: 'exodus', nodeIndex: 2 },
  'power_node_1': { gemId: 'power', nodeIndex: 0 },
  'power_node_2': { gemId: 'power', nodeIndex: 1 },
  'power_node_3': { gemId: 'power', nodeIndex: 2 },
  'power_node_4': { gemId: 'power', nodeIndex: 3 },
  'power_node_5': { gemId: 'power', nodeIndex: 4 }
};

// Icon mapping for modifier icons (required for Vite/Netlify production builds)
const MODIFIER_ICON_MAP = {
  'src/assets/general/cells.png': cellsIcon,
  'src/assets/general/mp.png': mpIcon,
  'src/assets/general/rp.png': rpIcon,
};

// Get the correct URL for a modifier icon
function getModifierIconUrl(iconPath) {
  return MODIFIER_ICON_MAP[iconPath] || '';
}

// Check if a gem node is active
function isGemNodeActive(modifierId) {
  const mapping = GEM_NODE_MAPPING[modifierId];
  if (!mapping) return false;
  
  const gemState = gemPlannerStore.gemStates?.[mapping.gemId];
  if (!gemState || !gemState.nodes) return false;
  
  return gemState.nodes[mapping.nodeIndex] === true;
}

// Get dynamic max level for a relic modifier (includes Exodus Node 3 bonus)
// Modifier ID format: 'relic_3' -> relicId 'r3', 't2r8' -> relicId 't2r8'
function getRelicModifierMaxLevel(modifierId) {
  // Handle Tier 2 relics (t2rX format)
  if (modifierId.startsWith('t2r')) {
    const baseMax = getRelicMaxLevelFromData(modifierId);
    return baseMax || 100;
  }
  
  // Extract relic number from modifier ID (e.g., 'relic_3' -> '3')
  const match = modifierId.match(/relic_(\d+)/);
  if (!match) return 100; // Default fallback
  
  const relicId = `r${match[1]}`;
  const baseMax = getRelicMaxLevelFromData(relicId);
  
  // Exodus Node 3 bonus: +1 max level per level (except R14, R5 gets +2)
  const exodusNode3Level = missionPlannerStore.modifierValues.exodus_node_3_level || 0;
  
  if (exodusNode3Level <= 0) return baseMax;
  
  // R14 is excluded from the bonus
  if (relicId === 'r14') return baseMax;
  
  // R5 gets +2 max level per exodus node 3 level
  if (relicId === 'r5') return baseMax + (exodusNode3Level * 2);
  
  // All other Tier 1 relics get +1 max level per exodus node 3 level
  return baseMax + exodusNode3Level;
}

// Computed effects from store
const calculatedEffects = computed(() => {
  const effects = missionPlannerStore.calculatedEffects;
  const personnel = effects.personnel;
  
  return {
    t1Power: personnel.formatted.t1Power,
    t1PowerPerUnit: personnel.t1.powerPerUnit.toFixed(1),
    t1Count: personnel.t1.count,
    t2Power: personnel.formatted.t2Power,
    t2PowerPerUnit: personnel.t2.powerPerUnit.toFixed(1),
    t2Count: personnel.t2.count,
    t3Power: personnel.formatted.t3Power,
    t3PowerPerUnit: personnel.t3.powerPerUnit.toFixed(1),
    t3Count: personnel.t3.count,
    t4Power: personnel.formatted.t4Power,
    t4PowerPerUnit: personnel.t4.powerPerUnit.toFixed(1),
    t4Count: personnel.t4.count,
    totalCount: personnel.totalCount,
    totalPower: personnel.formatted.totalPower,
    missionSpeed: effects.missionSpeed,
    farmFragmentsValue: effects.farmFragments.formatted,
    campaignFragmentsValue: effects.campaignFragments.formatted,
  };
});

// Update store when modifier value changes
function updateModifier(modifierId, value) {
  missionPlannerStore.updateModifier(modifierId, value);
}

// Get inscryption ID from modifier ID (e.g., 'inscryption_106' -> 'i106')
function getInscryptionId(modifierId) {
  const match = modifierId.match(/inscryption_(\d+)/);
  return match ? `i${match[1]}` : null;
}

// Get formatted cost for next inscryption level
function getFormattedNextLevelCost(modifierId) {
  const inscryptionId = getInscryptionId(modifierId);
  if (!inscryptionId) return null;
  
  const currentLevel = missionPlannerStore.modifierValues[modifierId] || 0;
  const cost = getNextLevelCost(inscryptionId, currentLevel);
  
  if (cost === null) return null;
  return formatInscryptionCost(cost);
}

// Get cost-benefit analysis for an inscryption
function getInscryptionCostBenefit(modifierId) {
  const inscryptionId = getInscryptionId(modifierId);
  if (!inscryptionId) return null;
  
  const currentLevel = missionPlannerStore.modifierValues[modifierId] || 0;
  const cost = getNextLevelCost(inscryptionId, currentLevel);
  
  if (cost === null) return null;
  
  return missionPlannerStore.getInscryptionCostBenefit(modifierId, cost);
}

// Format efficiency ratio with dynamic unit (cost/frags per day)
// Zeigt wie viel Kosten pro Frag-Gewinn anfallen, normalisiert auf 1-10 Bereich
function formatEfficiency(modifierId) {
  const benefit = getInscryptionCostBenefit(modifierId);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return '∞';
  }
  
  const cost = benefit.cost;
  const fragsPerDay = benefit.deltaFragsPerDay;
  
  // Berechne das Rohverhältnis (Kosten pro Frag/Tag)
  const rawRatio = cost / fragsPerDay;
  
  // Finde die passende Einheit, sodass der Wert zwischen 1-999 liegt
  const suffixes = ['', 'k', 'm', 'b', 't', 'qa', 'qu', 'sx', 'sp', 'o', 'n', 'd'];
  
  if (rawRatio < 1) {
    return rawRatio.toFixed(2);
  }
  
  // Berechne den Tier basierend auf der Größenordnung
  const tier = Math.max(0, Math.min(Math.floor(Math.log10(rawRatio) / 3), suffixes.length - 1));
  
  if (rawRatio >= 1e36) {
    const exponent = Math.floor(Math.log10(rawRatio));
    const mantissa = rawRatio / Math.pow(10, exponent);
    return `${mantissa.toFixed(1)}e${exponent}`;
  }
  
  const suffix = suffixes[tier];
  const scaledValue = rawRatio / Math.pow(10, tier * 3);
  
  return `${scaledValue.toFixed(1)}${suffix}`;
}

// Get raw efficiency value for color comparison
function getRawEfficiency(modifierId) {
  const benefit = getInscryptionCostBenefit(modifierId);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return Infinity;
  }
  return benefit.cost / benefit.deltaFragsPerDay;
}

// Calculate all efficiency values for comparison and return color class
// 10 Farbtöne von Grün (beste) über Gelb/Orange nach Rot (schlechteste)
function getEfficiencyColorClass(modifierId) {
  // Sammle alle Effizienzwerte der sichtbaren Inscryptions
  const allEfficiencies = [];
  
  for (const modifier of modifiers.inscryptions) {
    const currentLevel = missionPlannerStore.modifierValues[modifier.id] || 0;
    if (currentLevel < modifier.max) {
      const efficiency = getRawEfficiency(modifier.id);
      if (efficiency !== Infinity) {
        allEfficiencies.push({ id: modifier.id, efficiency });
      }
    }
  }
  
  // Wenn keine oder nur eine Inscryption, Standard-Farbe
  if (allEfficiencies.length <= 1) {
    return 'text-green-400';
  }
  
  // Sortiere nach Effizienz (niedrigster = bester)
  allEfficiencies.sort((a, b) => a.efficiency - b.efficiency);
  
  // Finde Position dieser Inscryption
  const currentEfficiency = getRawEfficiency(modifierId);
  const position = allEfficiencies.findIndex(e => e.id === modifierId);
  
  if (position === -1 || currentEfficiency === Infinity) {
    return 'text-gray-500';
  }
  
  // Berechne relative Position (0 = beste, 1 = schlechteste)
  const relativePosition = position / (allEfficiencies.length - 1);
  
  // 10 Farbtöne von Grün nach Rot
  // Grün → Lime → Gelb → Amber → Orange → Rot
  const colorClasses = [
    'text-green-400',      // 0.0 - 0.1 (beste)
    'text-green-500',      // 0.1 - 0.2
    'text-lime-400',       // 0.2 - 0.3
    'text-lime-500',       // 0.3 - 0.4
    'text-yellow-400',     // 0.4 - 0.5
    'text-yellow-500',     // 0.5 - 0.6
    'text-amber-400',      // 0.6 - 0.7
    'text-orange-400',     // 0.7 - 0.8
    'text-orange-500',     // 0.8 - 0.9
    'text-red-400',        // 0.9 - 1.0 (schlechteste)
  ];
  
  const colorIndex = Math.min(Math.floor(relativePosition * 10), 9);
  return colorClasses[colorIndex];
}

// ============================================
// RELIC COST-BENEFIT FUNCTIONS
// ============================================

// Relics that affect farm frags (R3=speed, R5=frags additive, T2R8=multiplier)
// R6 and R11 are campaign-only, so excluded
const FARM_AFFECTING_RELICS = ['relic_3', 'relic_5', 't2r8'];

// Check if a relic affects farm frags
function isRelicFarmAffecting(modifierId) {
  return FARM_AFFECTING_RELICS.includes(modifierId);
}

// Get relic ID from modifier ID (e.g., 'relic_3' -> 'r3', 't2r8' -> 't2r8')
function getRelicIdFromModifier(modifierId) {
  if (modifierId.startsWith('t2r')) {
    return modifierId;
  }
  const match = modifierId.match(/relic_(\d+)/);
  return match ? `r${match[1]}` : null;
}

// Get cost for next relic level
function getRelicNextCost(modifierId) {
  const relicId = getRelicIdFromModifier(modifierId);
  if (!relicId) return null;
  
  const costFn = RELIC_COSTS[relicId];
  if (!costFn) return null;
  
  const currentLevel = missionPlannerStore.modifierValues[modifierId] || 0;
  const cost = costFn(currentLevel);
  
  // Return null if cost is 0, Infinity, or invalid (formula not available)
  if (!cost || cost <= 0 || cost === Infinity) return null;
  
  return cost;
}

// Get formatted cost for next relic level
function getFormattedRelicNextLevelCost(modifierId) {
  const cost = getRelicNextCost(modifierId);
  if (cost === null) return null;
  return formatNumber(cost);
}

// Get cost-benefit analysis for a relic
function getRelicCostBenefit(modifierId) {
  const cost = getRelicNextCost(modifierId);
  if (cost === null) return null;
  
  return missionPlannerStore.getRelicCostBenefit(modifierId, cost);
}

// Get raw efficiency value for color comparison (for relics)
function getRelicRawEfficiency(modifierId) {
  const benefit = getRelicCostBenefit(modifierId);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return Infinity;
  }
  return benefit.cost / benefit.deltaFragsPerDay;
}

// Format relic efficiency ratio
function formatRelicEfficiency(modifierId) {
  const benefit = getRelicCostBenefit(modifierId);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return '∞';
  }
  
  const cost = benefit.cost;
  const fragsPerDay = benefit.deltaFragsPerDay;
  const rawRatio = cost / fragsPerDay;
  
  const suffixes = ['', 'k', 'm', 'b', 't', 'qa', 'qu', 'sx', 'sp', 'o', 'n', 'd'];
  
  if (rawRatio < 1) {
    return rawRatio.toFixed(2);
  }
  
  const tier = Math.max(0, Math.min(Math.floor(Math.log10(rawRatio) / 3), suffixes.length - 1));
  
  if (rawRatio >= 1e36) {
    const exponent = Math.floor(Math.log10(rawRatio));
    const mantissa = rawRatio / Math.pow(10, exponent);
    return `${mantissa.toFixed(1)}e${exponent}`;
  }
  
  const suffix = suffixes[tier];
  const scaledValue = rawRatio / Math.pow(10, tier * 3);
  
  return `${scaledValue.toFixed(1)}${suffix}`;
}

// Calculate color class for relic efficiency (comparing only farm-affecting relics)
function getRelicEfficiencyColorClass(modifierId) {
  const allEfficiencies = [];
  
  for (const modifier of modifiers.relics) {
    if (!isRelicFarmAffecting(modifier.id)) continue;
    
    const currentLevel = missionPlannerStore.modifierValues[modifier.id] || 0;
    const maxLevel = getRelicModifierMaxLevel(modifier.id);
    if (currentLevel < maxLevel) {
      const efficiency = getRelicRawEfficiency(modifier.id);
      if (efficiency !== Infinity) {
        allEfficiencies.push({ id: modifier.id, efficiency });
      }
    }
  }
  
  if (allEfficiencies.length <= 1) {
    return 'text-green-400';
  }
  
  allEfficiencies.sort((a, b) => a.efficiency - b.efficiency);
  
  const currentEfficiency = getRelicRawEfficiency(modifierId);
  const position = allEfficiencies.findIndex(e => e.id === modifierId);
  
  if (position === -1 || currentEfficiency === Infinity) {
    return 'text-gray-500';
  }
  
  const relativePosition = position / (allEfficiencies.length - 1);
  
  const colorClasses = [
    'text-green-400',
    'text-green-500',
    'text-lime-400',
    'text-lime-500',
    'text-yellow-400',
    'text-yellow-500',
    'text-amber-400',
    'text-orange-400',
    'text-orange-500',
    'text-red-400',
  ];
  
  const colorIndex = Math.min(Math.floor(relativePosition * 10), 9);
  return colorClasses[colorIndex];
}

// ============================================
// GADGET COST-BENEFIT FUNCTIONS
// ============================================

// Get the cost for next gadget levels (1 or 10)
function getGadgetNextCost(gadgetId, levelDelta = 1) {
  if (gadgetId !== 'local_fragment_magnet') return null;
  
  const currentLevel = missionPlannerStore.modifierValues[gadgetId] || 0;
  
  // Use calcGadgetCostDifference to sum up costs from currentLevel+1 to currentLevel+levelDelta
  return calcGadgetCostDifference('g12', currentLevel, currentLevel + levelDelta);
}

// Get formatted cost for gadget
function getFormattedGadgetCost(gadgetId, levelDelta = 1) {
  const cost = getGadgetNextCost(gadgetId, levelDelta);
  if (cost === null || cost === 0) return '-';
  return formatGadgetCost(cost);
}

// Get cost-benefit analysis for a gadget
function getGadgetCostBenefit(gadgetId, levelDelta = 1) {
  const cost = getGadgetNextCost(gadgetId, levelDelta);
  if (cost === null || cost <= 0) return null;
  
  return missionPlannerStore.getGadgetCostBenefit(gadgetId, cost, levelDelta);
}

// Get raw efficiency value for color comparison (for gadgets)
function getGadgetRawEfficiency(gadgetId, levelDelta = 1) {
  const benefit = getGadgetCostBenefit(gadgetId, levelDelta);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return Infinity;
  }
  return benefit.cost / benefit.deltaFragsPerDay;
}

// Format gadget efficiency ratio
function formatGadgetEfficiency(gadgetId, levelDelta = 1) {
  const benefit = getGadgetCostBenefit(gadgetId, levelDelta);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return '∞';
  }
  
  const cost = benefit.cost;
  const fragsPerDay = benefit.deltaFragsPerDay;
  const rawRatio = cost / fragsPerDay;
  
  const suffixes = ['', 'k', 'm', 'b', 't', 'qa', 'qu', 'sx', 'sp', 'o', 'n', 'd'];
  
  if (rawRatio < 1) {
    return rawRatio.toFixed(2);
  }
  
  const tier = Math.max(0, Math.min(Math.floor(Math.log10(rawRatio) / 3), suffixes.length - 1));
  
  if (rawRatio >= 1e36) {
    const exponent = Math.floor(Math.log10(rawRatio));
    const mantissa = rawRatio / Math.pow(10, exponent);
    return `${mantissa.toFixed(1)}e${exponent}`;
  }
  
  const suffix = suffixes[tier];
  const scaledValue = rawRatio / Math.pow(10, tier * 3);
  
  return `${scaledValue.toFixed(1)}${suffix}`;
}

// Calculate color class for gadget efficiency
// Compares +1 vs +10 - lower is better (green), higher is worse (red)
function getGadgetEfficiencyColorClass(gadgetId, levelDelta = 1) {
  const efficiency1 = getGadgetRawEfficiency(gadgetId, 1);
  const efficiency10 = getGadgetRawEfficiency(gadgetId, 10);
  
  // If only one value available, return green
  if (efficiency1 === Infinity && efficiency10 === Infinity) {
    return 'text-gray-500';
  }
  if (efficiency1 === Infinity || efficiency10 === Infinity) {
    return 'text-green-400';
  }
  
  // Compare +1 vs +10 efficiency
  // Usually +10 has better efficiency (lower cost/frag) due to milestone bonuses
  const currentEfficiency = levelDelta === 1 ? efficiency1 : efficiency10;
  const betterEfficiency = Math.min(efficiency1, efficiency10);
  const worseEfficiency = Math.max(efficiency1, efficiency10);
  
  // If same, return green
  if (betterEfficiency === worseEfficiency) {
    return 'text-green-400';
  }
  
  // If current is the better one
  if (currentEfficiency === betterEfficiency) {
    return 'text-green-400';
  }
  
  // Calculate how much worse the current efficiency is
  const ratio = currentEfficiency / betterEfficiency;
  
  // The worse the ratio, the more red
  if (ratio <= 1.1) return 'text-green-500';
  if (ratio <= 1.25) return 'text-lime-400';
  if (ratio <= 1.5) return 'text-yellow-400';
  if (ratio <= 2.0) return 'text-orange-400';
  return 'text-red-400';
}

// ============================================
// +ULTIMA COST-BENEFIT FUNCTIONS
// ============================================

// Get cost-benefit analysis for +Ultima
function getPlusUltimaBenefit() {
  return missionPlannerStore.getPlusUltimaCostBenefit();
}
</script>
