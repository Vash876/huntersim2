<template>
  <div class="flex flex-col gap-3">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-700/70 to-gray-800/70 rounded-xl p-2.5 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <IconAdjustments :size="16" class="text-purple-400" />
        <h2 class="text-sm font-bold text-white">Mission Modifiers</h2>
      </div>
      <!-- Profile Selector -->
      <ProfileSelector />
    </div>

    <!-- Tab Pills (Horizontal Scroll) -->
    <div class="flex overflow-x-auto gap-1 pb-1 no-scrollbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
          activeTab === tab.id 
            ? tab.activeClass 
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex flex-col gap-2">
      <!-- Game Progress Tab -->
      <template v-if="activeTab === 'gameProgress'">
        <div 
          v-for="modifier in modifiers.gameProgress" 
          :key="modifier.id"
          class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40"
        >
          <div class="flex items-center justify-between">
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-1.5 text-xs text-gray-300">
                <IconPlus v-if="modifier.icon === 'IconPlus'" :size="14" class="text-red-500" />
                <img v-else-if="modifier.icon && !modifier.icon.startsWith('Icon')" :src="getModifierIconUrl(modifier.icon)" class="w-3.5 h-3.5" />
                {{ modifier.name }}
              </div>
              <!-- Dynamic Benefit Projection for cells, mp, rp, all_time_highest_rp -->
              <div v-if="['cells', 'mp', 'rp', 'all_time_highest_rp'].includes(modifier.id) && getGameProgressBenefit(modifier.id).delta > 0" 
                class="flex flex-col text-[10px] mt-0.5 font-mono">
                <div class="flex items-center">
                  <span class="text-gray-500 w-[40px] text-right">+{{ getGameProgressBenefit(modifier.id).delta }}</span>
                  <span class="text-gray-500 px-0.5">→</span>
                  <span class="text-green-400 w-[60px] text-right">+{{ formatNumber(getGameProgressBenefit(modifier.id).deltaFragsPerDay) }}/d</span>
                </div>
                <!-- Additional +1000 projection for cells -->
                <div v-if="modifier.id === 'cells'" class="flex items-center">
                  <span class="text-gray-500 w-[40px] text-right">+1000</span>
                  <span class="text-gray-500 px-0.5">→</span>
                  <span class="text-green-400 w-[60px] text-right">+{{ formatNumber(getCellsBenefit1000().deltaFragsPerDay) }}/d</span>
                </div>
              </div>
              <div v-else-if="['cells', 'mp', 'rp', 'all_time_highest_rp'].includes(modifier.id)" 
                class="flex items-center text-[9px] mt-0.5 font-mono">
                <span class="text-gray-500 w-[40px] text-right">-</span>
                <span class="text-gray-500 px-0.5"></span>
                <span class="text-gray-500 w-[60px] text-right"></span>
              </div>
              <!-- +Ultima Cost-Benefit Row -->
              <div v-if="modifier.id === 'plus_ultima' && getPlusUltimaBenefit()" 
                class="flex items-center text-[10px] mt-0.5 font-mono">
                <template v-if="getPlusUltimaBenefit().canAffordNewLevels">
                  <span class="text-gray-500 w-[40px] text-right">+1</span>
                  <span class="text-gray-500 px-0.5">→</span>
                  <span class="text-green-400 w-[60px] text-right">+{{ formatNumber(getPlusUltimaBenefit().deltaFragsPerDay) }}/d</span>
                </template>
                <template v-else>
                  <span class="text-gray-500 w-[40px] text-right">-</span>
                  <span class="text-gray-500 px-0.5"></span>
                  <span class="text-gray-500 w-[60px] text-right"></span>
                </template>
              </div>
            </div>
            <ToolValueControls
              class="w-[140px]"
              :value="missionPlannerStore.modifierValues[modifier.id]"
              :min-value="modifier.min"
              :max-value="modifier.max"
              :step="modifier.control || 1"
              :fast-step="modifier.fastControls || 10"
              :show-fast-controls="true"
              :auto-edit="true"
              @update:value="updateModifier(modifier.id, $event)"
            />
          </div>
        </div>
      </template>

      <!-- Relics Tab -->
      <template v-if="activeTab === 'relics'">
        <div 
          v-for="modifier in unlockedRelics" 
          :key="modifier.id"
          class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40"
        >
          <div class="flex items-center justify-between">
            <div class="flex flex-col min-w-0">
              <span class="text-xs text-gray-300">{{ modifier.name }}</span>
              <!-- Cost-Benefit Row for farm-affecting relics -->
              <div v-if="isRelicFarmAffecting(modifier.id) && missionPlannerStore.modifierValues[modifier.id] < getRelicModifierMaxLevel(modifier.id) && getRelicCostBenefit(modifier.id)" 
                class="flex items-center text-[10px] mt-0.5 font-mono">
                <span class="text-yellow-400 w-[52px] text-right">{{ getFormattedRelicNextLevelCost(modifier.id) }}</span>
                <span class="text-gray-500 px-0.5">→</span>
                <span class="text-green-400 w-[60px] text-right">+{{ formatNumber(getRelicCostBenefit(modifier.id).deltaFragsPerDay) }}/d</span>
                <span class="text-gray-500 px-0.5">|</span>
                <span :class="getRelicEfficiencyColorClass(modifier.id)" class="w-[44px] text-right">{{ formatRelicEfficiency(modifier.id) }}</span>
              </div>
            </div>
            <ToolValueControls
              class="w-[140px]"
              :value="missionPlannerStore.modifierValues[modifier.id]"
              :min-value="modifier.min"
              :max-value="getRelicModifierMaxLevel(modifier.id)"
              :step="modifier.control || 1"
              :fast-step="modifier.fastControls || 10"
              :show-fast-controls="true"
              :auto-edit="true"
              @update:value="updateModifier(modifier.id, $event)"
            />
          </div>
        </div>
      </template>

      <!-- Badges Tab -->
      <template v-if="activeTab === 'badges'">
        <div 
          v-for="modifier in modifiers.badges" 
          :key="modifier.id"
          class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40"
          @click="updateModifier(modifier.id, !missionPlannerStore.modifierValues[modifier.id])"
        >
          <div class="flex items-center gap-3">
            <!-- Toggle Switch -->
            <div class="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
              :class="missionPlannerStore.modifierValues[modifier.id] ? 'bg-green-600' : 'bg-gray-600'"
            >
              <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                :class="missionPlannerStore.modifierValues[modifier.id] ? 'translate-x-5' : 'translate-x-0'"
              ></div>
            </div>
            <span class="text-xs text-gray-300">{{ modifier.name }}</span>
          </div>
        </div>
      </template>

      <!-- Boons Tab -->
      <template v-if="activeTab === 'boons'">
        <div 
          v-for="modifier in unlockedMods" 
          :key="modifier.id"
          class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-300">{{ modifier.name }}</span>
            <ToolValueControls
              class="w-[140px]"
              :value="missionPlannerStore.modifierValues[modifier.id]"
              :min-value="modifier.min"
              :max-value="modifier.max"
              :step="modifier.control || 1"
              :fast-step="modifier.fastControls || 10"
              :show-fast-controls="true"
              :auto-edit="true"
              @update:value="updateModifier(modifier.id, $event)"
            />
          </div>
        </div>
      </template>

      <!-- Inscryptions Tab -->
      <template v-if="activeTab === 'inscryptions'">
        <div 
          v-for="modifier in modifiers.inscryptions" 
          :key="modifier.id"
          class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40"
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div class="flex flex-col min-w-0">
                <span class="text-xs text-gray-300">{{ modifier.name }}</span>
                <!-- Cost-Benefit Row -->
                <div v-if="missionPlannerStore.modifierValues[modifier.id] < modifier.max && getInscryptionCostBenefit(modifier.id)" 
                  class="flex items-center text-[10px] mt-0.5 font-mono">
                  <span class="text-yellow-400 w-[52px] text-right">{{ getFormattedNextLevelCost(modifier.id) }}</span>
                  <span class="text-gray-500 px-0.5">→</span>
                  <span class="text-green-400 w-[60px] text-right">+{{ formatNumber(getInscryptionCostBenefit(modifier.id).deltaFragsPerDay) }}/d</span>
                  <span class="text-gray-500 px-0.5">|</span>
                  <span :class="getInscryptionEfficiencyColorClass(modifier.id)" class="w-[44px] text-right">{{ formatInscryptionEfficiency(modifier.id) }}</span>
                </div>
              </div>
              <ToolValueControls
                class="w-[140px]"
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="modifier.control || 1"
                :fast-step="modifier.fastControls || 10"
                :show-fast-controls="true"
                :auto-edit="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Gadgets Tab -->
      <template v-if="activeTab === 'gadgets'">
        <div 
          v-for="modifier in unlockedGadgets" 
          :key="modifier.id"
          class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40"
        >
          <div class="flex items-center justify-between">
            <div class="flex flex-col min-w-0">
              <span class="text-xs text-gray-300">{{ modifier.name }}</span>
              <!-- Cost-Benefit Rows for Local Fragment Magnet (G12) -->
              <template v-if="modifier.id === 'local_fragment_magnet'">
                <!-- +1 Level -->
                <div v-if="getGadgetCostBenefit(modifier.id, 1)" 
                  class="flex items-center text-[10px] mt-0.5 font-mono">
                  <span class="text-gray-500 w-[18px]">+1:</span>
                  <span class="text-yellow-400 w-[48px] text-right">{{ getFormattedGadgetCost(modifier.id, 1) }}</span>
                  <span class="text-gray-500 px-0.5">→</span>
                  <span class="text-green-400 w-[52px] text-right">+{{ formatNumber(getGadgetCostBenefit(modifier.id, 1).deltaFragsPerDay) }}/d</span>
                  <span class="text-gray-500 px-0.5">|</span>
                  <span :class="getGadgetEfficiencyColorClass(modifier.id, 1)" class="w-[40px] text-right">{{ formatGadgetEfficiency(modifier.id, 1) }}</span>
                </div>
                <!-- +10 Levels -->
                <div v-if="getGadgetCostBenefit(modifier.id, 10)" 
                  class="flex items-center text-[10px] mt-0.5 font-mono">
                  <span class="text-gray-500 w-[18px]">+10:</span>
                  <span class="text-yellow-400 w-[48px] text-right">{{ getFormattedGadgetCost(modifier.id, 10) }}</span>
                  <span class="text-gray-500 px-0.5">→</span>
                  <span class="text-green-400 w-[52px] text-right">+{{ formatNumber(getGadgetCostBenefit(modifier.id, 10).deltaFragsPerDay) }}/d</span>
                  <span class="text-gray-500 px-0.5">|</span>
                  <span :class="getGadgetEfficiencyColorClass(modifier.id, 10)" class="w-[40px] text-right">{{ formatGadgetEfficiency(modifier.id, 10) }}</span>
                </div>
              </template>
            </div>
            <ToolValueControls
              class="w-[140px]"
              :value="missionPlannerStore.modifierValues[modifier.id]"
              :min-value="modifier.min"
              :max-value="modifier.max"
              :step="modifier.control || 1"
              :fast-step="modifier.fastControls || 10"
              :show-fast-controls="true"
              :auto-edit="true"
              @update:value="updateModifier(modifier.id, $event)"
            />
          </div>
        </div>
      </template>

      <!-- Gems Tab -->
      <template v-if="activeTab === 'gems'">
        <p class="text-[10px] text-gray-400 px-1">
          Gem nodes from Gem Overview. Only special inputs editable.
        </p>

        <!-- Attraction Gem -->
        <div class="bg-gray-800/60 rounded-lg p-3 border-l-2 border-blue-500/50">
          <h5 class="text-xs font-semibold mb-2 flex items-center text-blue-400">
            <span class="w-2 h-2 rounded-full mr-1.5 bg-blue-500"></span>
            Attraction Gem
          </h5>
          <div class="flex flex-wrap gap-1">
            <div v-for="modifier in gemsByType.attraction" :key="modifier.id" 
              class="px-2 py-1 rounded text-[10px]"
              :class="isGemNodeActive(modifier.id) ? 'bg-blue-900/50 text-white border border-blue-500/30' : 'bg-gray-800/50 text-gray-500'"
            >
              <span class="w-1.5 h-1.5 rounded-full inline-block mr-1" 
                :class="isGemNodeActive(modifier.id) ? 'bg-green-400' : 'bg-gray-600'"></span>
              {{ modifier.name }}
            </div>
          </div>
        </div>

        <!-- Creation Gem -->
        <div class="bg-gray-800/60 rounded-lg p-3 border-l-2 border-orange-500/50">
          <h5 class="text-xs font-semibold mb-2 flex items-center text-orange-400">
            <span class="w-2 h-2 rounded-full mr-1.5 bg-orange-500"></span>
            Creation Gem
          </h5>
          <div class="flex flex-wrap gap-1 mb-2">
            <div v-for="modifier in gemsByType.creation" :key="modifier.id" 
              class="px-2 py-1 rounded text-[10px]"
              :class="isGemNodeActive(modifier.id) ? 'bg-orange-900/50 text-white border border-orange-500/30' : 'bg-gray-800/50 text-gray-500'"
            >
              <span class="w-1.5 h-1.5 rounded-full inline-block mr-1" 
                :class="isGemNodeActive(modifier.id) ? 'bg-green-400' : 'bg-gray-600'"></span>
              {{ modifier.name }}
            </div>
          </div>
          <!-- Mechs Owned Input -->
          <div v-if="isGemNodeActive('creation_node_5')" 
            class="flex items-center justify-between bg-gray-900/50 rounded p-2"
          >
            <div class="flex items-center gap-1">
              <span class="text-[10px] text-gray-400">Mechs:</span>
              <span class="text-[10px] font-mono text-orange-400">
                ×{{ (1.001 ** (missionPlannerStore.modifierValues.creation_node_5_mechs || 0)).toFixed(4) }}
              </span>
            </div>
            <ToolValueControls
              class="w-[120px]"
              :value="missionPlannerStore.modifierValues.creation_node_5_mechs || 0"
              :min-value="0"
              :max-value="100000"
              :step="1"
              :show-fast-controls="true"
              :auto-edit="true"
              @update:value="updateModifier('creation_node_5_mechs', $event)"
            />
          </div>
        </div>

        <!-- Exodus Gem -->
        <div class="bg-gray-800/60 rounded-lg p-3 border-l-2 border-purple-500/50">
          <h5 class="text-xs font-semibold mb-2 flex items-center text-purple-400">
            <span class="w-2 h-2 rounded-full mr-1.5 bg-purple-500"></span>
            Exodus Gem
          </h5>
          <div class="flex flex-wrap gap-1 mb-2">
            <div v-for="modifier in gemsByType.exodus" :key="modifier.id" 
              class="px-2 py-1 rounded text-[10px]"
              :class="isGemNodeActive(modifier.id) ? 'bg-purple-900/50 text-white border border-purple-500/30' : 'bg-gray-800/50 text-gray-500'"
            >
              <span class="w-1.5 h-1.5 rounded-full inline-block mr-1" 
                :class="isGemNodeActive(modifier.id) ? 'bg-green-400' : 'bg-gray-600'"></span>
              {{ modifier.name }}
            </div>
          </div>
          <!-- Loopmods Owned Input -->
          <div v-if="isGemNodeActive('exodus_node_2')" 
            class="flex items-center justify-between bg-gray-900/50 rounded p-2 mb-2"
          >
            <div class="flex items-center gap-1">
              <span class="text-[10px] text-gray-400">Loopmods:</span>
              <span class="text-[10px] font-mono text-purple-400">
                +{{ Math.floor((missionPlannerStore.modifierValues.exodus_node_2_loopmods || 0) / 10000) }}%
              </span>
            </div>
            <ToolValueControls
              class="w-[120px]"
              :value="missionPlannerStore.modifierValues.exodus_node_2_loopmods || 0"
              :min-value="0"
              :max-value="10000000"
              :step="10000"
              :fast-step="100000"
              :show-fast-controls="true"
              :auto-edit="true"
              @update:value="updateModifier('exodus_node_2_loopmods', $event)"
            />
          </div>
          <!-- Exodus Node 3: Relic Max Level Bonus -->
          <div v-if="isGemNodeActive('exodus_node_3')" 
            class="flex items-center justify-between bg-gray-900/50 rounded p-2"
          >
            <div class="flex items-center gap-1">
              <span class="text-[10px] text-gray-400">Relic Max Lv:</span>
              <span class="text-[10px] font-mono text-purple-400">
                +{{ missionPlannerStore.modifierValues.exodus_node_3_level || 0 }}
              </span>
            </div>
            <ToolValueControls
              class="w-[120px]"
              :value="missionPlannerStore.modifierValues.exodus_node_3_level || 0"
              :min-value="0"
              :max-value="5"
              :step="1"
              :show-fast-controls="true"
              :auto-edit="true"
              @update:value="updateModifier('exodus_node_3_level', $event)"
            />
          </div>
        </div>

        <!-- Power Gem -->
        <div class="bg-gray-800/60 rounded-lg p-3 border-l-2 border-violet-500/50">
          <h5 class="text-xs font-semibold mb-2 flex items-center text-violet-400">
            <span class="w-2 h-2 rounded-full mr-1.5 bg-violet-500"></span>
            Power Gem
          </h5>
          <div class="flex flex-wrap gap-1">
            <div v-for="modifier in gemsByType.power" :key="modifier.id" 
              class="px-2 py-1 rounded text-[10px]"
              :class="isGemNodeActive(modifier.id) ? 'bg-violet-900/50 text-white border border-violet-500/30' : 'bg-gray-800/50 text-gray-500'"
            >
              <span class="w-1.5 h-1.5 rounded-full inline-block mr-1" 
                :class="isGemNodeActive(modifier.id) ? 'bg-green-400' : 'bg-gray-600'"></span>
              {{ modifier.name }}
            </div>
          </div>
        </div>
      </template>

      <!-- Other Tab -->
      <template v-if="activeTab === 'other'">
        <template v-for="modifier in unlockedOther" :key="modifier.id">
          <!-- Boolean toggle -->
          <div v-if="modifier.type === 'boolean'" 
            class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40"
            @click="updateModifier(modifier.id, !missionPlannerStore.modifierValues[modifier.id])"
          >
            <div class="flex items-center gap-3">
              <div class="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                :class="missionPlannerStore.modifierValues[modifier.id] ? 'bg-green-600' : 'bg-gray-600'"
              >
                <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  :class="missionPlannerStore.modifierValues[modifier.id] ? 'translate-x-5' : 'translate-x-0'"
                ></div>
              </div>
              <span class="text-xs text-gray-300">{{ modifier.name }}</span>
            </div>
          </div>
          
          <!-- Readonly modifier (Eternal Milestone) - now editable with temporary override -->
          <div v-else-if="modifier.type === 'readonly'" 
            class="bg-gray-800/60 rounded-lg p-3 border border-gray-700/40"
            :class="!isEternalMilestoneUnlocked ? 'opacity-60' : ''"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs" :class="isEternalMilestoneUnlocked ? 'text-white' : 'text-gray-500'">
                  {{ modifier.name }}
                </span>
                <span v-if="!isEternalMilestoneUnlocked" class="text-[9px] text-red-400">
                  🔒 Lv{{ attractionGemLevel }}/3
                </span>
              </div>
              <ToolValueControls
                v-if="isEternalMilestoneUnlocked"
                class="w-[120px]"
                :value="eternalMilestoneLevel"
                :min-value="0"
                :max-value="1000"
                :step="1"
                :fast-step="10"
                :show-fast-controls="true"
                :auto-edit="true"
                @update:value="updateModifier('eternal_milestone_override', $event)"
              />
            </div>
          </div>
        </template>
      </template>
    </div>

    <!-- Effects Summary -->
    <div class="bg-gray-900/70 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
      <h3 class="text-sm font-bold text-white mb-3 flex items-center">
        <div class="w-1 h-4 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-r mr-2"></div>
        Modifier Effects
      </h3>

      <!-- Personnel Summary (Compact Grid) -->
      <div class="mb-3">
        <h4 class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Personnel</h4>
        <div class="grid grid-cols-2 gap-1.5">
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-purple-400 font-semibold">T1</span>
              <span class="text-cyan-400 font-mono">{{ calculatedEffects.t1Count }}</span>
            </div>
            <div class="text-[9px] text-gray-500">Pwr: {{ calculatedEffects.t1Power }}</div>
          </div>
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-cyan-400 font-semibold">T2</span>
              <span class="text-cyan-400 font-mono">{{ calculatedEffects.t2Count }}</span>
            </div>
            <div class="text-[9px] text-gray-500">Pwr: {{ calculatedEffects.t2Power }}</div>
          </div>
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-green-400 font-semibold">T3</span>
              <span class="text-cyan-400 font-mono">{{ calculatedEffects.t3Count }}</span>
            </div>
            <div class="text-[9px] text-gray-500">Pwr: {{ calculatedEffects.t3Power }}</div>
          </div>
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-orange-400 font-semibold">T4</span>
              <span class="text-cyan-400 font-mono">{{ calculatedEffects.t4Count }}</span>
            </div>
            <div class="text-[9px] text-gray-500">Pwr: {{ calculatedEffects.t4Power }}</div>
          </div>
        </div>
        <div class="mt-1.5 bg-gray-700/50 rounded p-2 text-xs flex items-center justify-between">
          <span class="text-gray-300">Total Power</span>
          <span class="text-green-400 font-mono font-bold">{{ calculatedEffects.totalPower }}</span>
        </div>
      </div>

      <!-- Mission Effects -->
      <div>
        <h4 class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Mission Effects</h4>
        <div class="space-y-1.5">
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30 flex items-center justify-between text-xs">
            <span class="text-gray-300 flex items-center gap-1.5">
              <IconBrandSpeedtest :size="14" class="text-green-400" />
              Mission Speed
            </span>
            <span class="text-green-400 font-mono">{{ calculatedEffects.missionSpeed }}%</span>
          </div>
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30 flex items-center justify-between text-xs">
            <span class="text-gray-300 flex items-center gap-1.5">
              <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
              Farm Fragments
            </span>
            <span class="text-cyan-400 font-mono">{{ calculatedEffects.farmFragmentsValue }}</span>
          </div>
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30 flex items-center justify-between text-xs">
            <span class="text-gray-300 flex items-center gap-1.5">
              <img src="@/assets/general/fragments.png" alt="Fragments" class="w-3.5 h-3.5" />
              Campaign Fragments
            </span>
            <span class="text-purple-400 font-mono">{{ calculatedEffects.campaignFragmentsValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { IconAdjustments, IconPlus, IconBrandSpeedtest } from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import { formatNumber } from '@/composables/format';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import ProfileSelector from './ProfileSelector.vue';
import { MODIFIERS } from '../constants/modifiers';
import { ALL_LOOPMODS } from '../constants/loopmods';
import { getNextLevelCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, calcGadgetCostDifference, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { RELIC_COSTS, getRelicMaxLevel as getRelicMaxLevelFromData } from '../constants/relics';

// Import modifier icons (required for Vite/Netlify production builds)
import cellsIcon from '@/assets/general/cells.png';
import mpIcon from '@/assets/general/mp.png';
import rpIcon from '@/assets/general/rp.png';

// Icon mapping for modifier icons
const MODIFIER_ICON_MAP = {
  'src/assets/general/cells.png': cellsIcon,
  'src/assets/general/mp.png': mpIcon,
  'src/assets/general/rp.png': rpIcon,
};

const missionPlannerStore = useMissionPlannerStore();
const gemPlannerStore = useGemPlannerStore();
const hunterStore = useHunterStore();

const activeTab = ref('gameProgress');

// Eternal Milestone from hunterStore (base value)
const eternalMilestoneLevelBase = computed(() => {
  return hunterStore.getUpgradeValue('shardmilestones', 'm0') || 0;
});

// Eternal Milestone - use override if set, otherwise base value
const eternalMilestoneLevel = computed(() => {
  const override = missionPlannerStore.modifierValues?.eternal_milestone_override;
  if (override !== undefined && override !== null) {
    return override;
  }
  return eternalMilestoneLevelBase.value;
});

// Initialize eternal milestone override on mount
onMounted(() => {
  // Set initial override value from hunterStore if not already set
  if (missionPlannerStore.modifierValues?.eternal_milestone_override === undefined) {
    missionPlannerStore.updateModifier('eternal_milestone_override', eternalMilestoneLevelBase.value);
  }
});

// Attraction Gem Level (required Level 3 to unlock Eternal Milestone)
const attractionGemLevel = computed(() => {
  return gemPlannerStore.gemStates?.attraction?.level || 0;
});

// Check if Eternal Milestone is unlocked (Attraction Gem Level 3+)
const isEternalMilestoneUnlocked = computed(() => {
  return attractionGemLevel.value >= 3;
});

const tabs = [
  { id: 'gameProgress', label: 'Progress', activeClass: 'bg-gray-700/50 text-white' },
  { id: 'relics', label: 'Relics', activeClass: 'bg-purple-900/50 text-purple-400' },
  { id: 'badges', label: 'Badges', activeClass: 'bg-yellow-900/50 text-yellow-400' },
  { id: 'boons', label: 'Boons', activeClass: 'bg-red-900/50 text-red-400' },
  { id: 'inscryptions', label: 'Inscryp', activeClass: 'bg-rose-900/50 text-rose-400' },
  { id: 'gadgets', label: 'Gadgets', activeClass: 'bg-sky-900/50 text-sky-400' },
  { id: 'gems', label: 'Gems', activeClass: 'bg-blue-900/50 text-blue-400' },
  { id: 'other', label: 'Other', activeClass: 'bg-gray-700/50 text-gray-300' },
];

// Modifiers data
const modifiers = MODIFIERS;

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

// Gems grouped by type (filter for readonly gem nodes only)
const gemsByType = computed(() => {
  const gems = modifiers.gems || [];
  const readonlyGems = gems.filter(m => m.type === 'readonly' && isModifierUnlocked(m));
  return {
    attraction: readonlyGems.filter(m => m.id.startsWith('attraction_')),
    creation: readonlyGems.filter(m => m.id.startsWith('creation_')),
    exodus: readonlyGems.filter(m => m.id.startsWith('exodus_')),
    power: readonlyGems.filter(m => m.id.startsWith('power_')),
  };
});

// ============================================
// MODIFIER UNLOCK CONDITIONS
// ============================================

/**
 * Check if a modifier is unlocked based on its unlock conditions
 * @param {object} modifier - The modifier object with optional unlock_gem, unlock_lvl, unlock_boon
 * @returns {boolean} - Whether the modifier is unlocked
 */
function isModifierUnlocked(modifier) {
  // If no unlock conditions, it's always unlocked
  if (!modifier.unlock_gem && !modifier.unlock_boon) {
    return true;
  }
  
  // Check gem unlock condition
  if (modifier.unlock_gem && modifier.unlock_lvl !== undefined) {
    const gemLevel = gemPlannerStore.gemStates?.[modifier.unlock_gem]?.level || 0;
    if (gemLevel < modifier.unlock_lvl) {
      return false;
    }
  }
  
  // Check boon unlock condition (requires enough MP to unlock the boon)
  if (modifier.unlock_boon) {
    const boonId = `boon_${modifier.unlock_boon}`;
    const boonData = ALL_LOOPMODS[boonId];
    if (boonData && boonData.levelCosts && boonData.levelCosts.length > 0) {
      const mpThreshold = boonData.levelCosts[0]; // First level cost = MP needed to unlock
      const currentMP = missionPlannerStore.modifierValues?.mp || 0;
      if (currentMP < mpThreshold) {
        return false;
      }
    }
  }
  
  return true;
}

// Filtered modifiers based on unlock conditions
const unlockedRelics = computed(() => modifiers.relics.filter(m => isModifierUnlocked(m)));
const unlockedMods = computed(() => modifiers.mods.filter(m => isModifierUnlocked(m)));
const unlockedGadgets = computed(() => modifiers.gadgets.filter(m => isModifierUnlocked(m)));
const unlockedOther = computed(() => modifiers.other.filter(m => isModifierUnlocked(m)));

// Get dynamic max level for a relic modifier (includes Exodus Node 3 and Power Node 1 bonuses)
// Uses centralized getRelicMaxLevelFromData which handles fixedCosts limits
function getRelicModifierMaxLevel(modifierId) {
  // Handle Tier 2 relics (t2rX format)
  if (modifierId.startsWith('t2r')) {
    return getRelicMaxLevelFromData(modifierId, 0) || 100;
  }
  
  // Extract relic number from modifier ID (e.g., 'relic_3' -> '3')
  const match = modifierId.match(/relic_(\d+)/);
  if (!match) return 100; // Default fallback
  
  const relicId = `r${match[1]}`;
  
  // Exodus Node 3 bonus: +1 max level per level (except R14, R5 gets +2)
  const exodusNode3Level = missionPlannerStore.modifierValues.exodus_node_3_level || 0;
  
  // Power Node 1 bonus: +3 max level for R5 and R6 only
  // Read directly from gemPlannerStore since it's not synced to modifierValues
  const powerNode1Active = gemPlannerStore.gemStates?.power?.nodes?.[0] || false;
  const powerNode1Bonus = powerNode1Active ? 3 : 0;
  
  // R14 is excluded from all bonuses
  if (relicId === 'r14') return getRelicMaxLevelFromData(relicId, 0);
  
  // R5 gets +2 per Exodus Node 3 level AND +3 from Power Node 1
  if (relicId === 'r5') return getRelicMaxLevelFromData(relicId, (exodusNode3Level * 2) + powerNode1Bonus);
  
  // R6 gets +1 per Exodus Node 3 level AND +3 from Power Node 1
  if (relicId === 'r6') return getRelicMaxLevelFromData(relicId, exodusNode3Level + powerNode1Bonus);
  
  // All other Tier 1 relics get +1 max level per Exodus Node 3 level
  return getRelicMaxLevelFromData(relicId, exodusNode3Level);
}

// Check if a gem node is active
function isGemNodeActive(modifierId) {
  const mapping = GEM_NODE_MAPPING[modifierId];
  if (!mapping) return false;
  
  const gemState = gemPlannerStore.gemStates?.[mapping.gemId];
  if (!gemState || !gemState.nodes) return false;
  
  return gemState.nodes[mapping.nodeIndex] === true;
}

// Get the correct URL for a modifier icon
function getModifierIconUrl(iconPath) {
  return MODIFIER_ICON_MAP[iconPath] || '';
}

// Update modifier
function updateModifier(id, value) {
  missionPlannerStore.updateModifier(id, value);
}

// Calculated effects from store
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

// ============================================
// INSCRYPTION COST-BENEFIT FUNCTIONS
// ============================================

// Get the cost for the next inscryption level
function getInscryptionNextLevelCost(modifierId) {
  const inscryptionId = modifierId.replace('inscryption_', 'i');
  const currentLevel = missionPlannerStore.modifierValues[modifierId] || 0;
  return getNextLevelCost(inscryptionId, currentLevel);
}

// Get formatted cost for the next level
function getFormattedNextLevelCost(modifierId) {
  const cost = getInscryptionNextLevelCost(modifierId);
  return formatInscryptionCost(cost);
}

// Get cost-benefit analysis for an inscryption
function getInscryptionCostBenefit(modifierId) {
  const cost = getInscryptionNextLevelCost(modifierId);
  if (cost === null || cost === 0) return null;
  
  return missionPlannerStore.getInscryptionCostBenefit(modifierId, cost);
}

// Format efficiency ratio for inscryptions
function formatInscryptionEfficiency(modifierId) {
  const benefit = getInscryptionCostBenefit(modifierId);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return '∞';
  }
  
  const cost = benefit.cost;
  const fragsPerDay = benefit.deltaFragsPerDay;
  const rawRatio = cost / fragsPerDay;
  
  return formatEfficiencyValue(rawRatio);
}

// Get efficiency color class for inscryptions
function getInscryptionEfficiencyColorClass(modifierId) {
  const allEfficiencies = [];
  
  for (const modifier of modifiers.inscryptions) {
    const currentLevel = missionPlannerStore.modifierValues[modifier.id] || 0;
    if (currentLevel < modifier.max) {
      const benefit = getInscryptionCostBenefit(modifier.id);
      if (benefit && benefit.deltaFragsPerDay > 0) {
        allEfficiencies.push({ id: modifier.id, efficiency: benefit.cost / benefit.deltaFragsPerDay });
      }
    }
  }
  
  if (allEfficiencies.length <= 1) {
    return 'text-green-400';
  }
  
  allEfficiencies.sort((a, b) => a.efficiency - b.efficiency);
  
  const benefit = getInscryptionCostBenefit(modifierId);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return 'text-gray-500';
  }
  
  const currentEfficiency = benefit.cost / benefit.deltaFragsPerDay;
  const position = allEfficiencies.findIndex(e => e.id === modifierId);
  
  if (position === -1) {
    return 'text-gray-500';
  }
  
  const relativePosition = position / (allEfficiencies.length - 1);
  return getColorClassFromPosition(relativePosition);
}

// ============================================
// RELIC COST-BENEFIT FUNCTIONS
// ============================================

const FARM_AFFECTING_RELICS = ['relic_3', 'relic_5', 't2r8'];

function isRelicFarmAffecting(modifierId) {
  return FARM_AFFECTING_RELICS.includes(modifierId);
}

// Get relic ID from modifier ID
function getRelicIdFromModifier(modifierId) {
  if (modifierId === 't2r8') return 't2r8';
  const match = modifierId.match(/relic_(\d+)/);
  return match ? `r${match[1]}` : null;
}

// Get the cost for the next relic level
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

// Get formatted cost for the next relic level
function getFormattedRelicNextLevelCost(modifierId) {
  const cost = getRelicNextCost(modifierId);
  if (cost === null || cost === Infinity) return '-';
  return formatNumber(cost);
}

// Get cost-benefit analysis for a relic
function getRelicCostBenefit(modifierId) {
  const cost = getRelicNextCost(modifierId);
  if (cost === null) return null;
  
  return missionPlannerStore.getRelicCostBenefit(modifierId, cost);
}

// Format relic efficiency ratio
function formatRelicEfficiency(modifierId) {
  const benefit = getRelicCostBenefit(modifierId);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return '∞';
  }
  
  const rawRatio = benefit.cost / benefit.deltaFragsPerDay;
  return formatEfficiencyValue(rawRatio);
}

// Get efficiency color class for relics
function getRelicEfficiencyColorClass(modifierId) {
  const allEfficiencies = [];
  
  for (const modifier of modifiers.relics) {
    if (!isRelicFarmAffecting(modifier.id)) continue;
    
    const currentLevel = missionPlannerStore.modifierValues[modifier.id] || 0;
    const maxLevel = getRelicModifierMaxLevel(modifier.id);
    if (currentLevel < maxLevel) {
      const benefit = getRelicCostBenefit(modifier.id);
      if (benefit && benefit.deltaFragsPerDay > 0) {
        allEfficiencies.push({ id: modifier.id, efficiency: benefit.cost / benefit.deltaFragsPerDay });
      }
    }
  }
  
  if (allEfficiencies.length <= 1) {
    return 'text-green-400';
  }
  
  allEfficiencies.sort((a, b) => a.efficiency - b.efficiency);
  
  const benefit = getRelicCostBenefit(modifierId);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return 'text-gray-500';
  }
  
  const position = allEfficiencies.findIndex(e => e.id === modifierId);
  
  if (position === -1) {
    return 'text-gray-500';
  }
  
  const relativePosition = position / (allEfficiencies.length - 1);
  return getColorClassFromPosition(relativePosition);
}

// ============================================
// GADGET COST-BENEFIT FUNCTIONS
// ============================================

// Get the cost for next gadget levels (1 or 10)
function getGadgetNextCost(gadgetId, levelDelta = 1) {
  if (gadgetId !== 'local_fragment_magnet') return null;
  
  const currentLevel = missionPlannerStore.modifierValues[gadgetId] || 0;
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

// Format gadget efficiency ratio
function formatGadgetEfficiency(gadgetId, levelDelta = 1) {
  const benefit = getGadgetCostBenefit(gadgetId, levelDelta);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return '∞';
  }
  
  const rawRatio = benefit.cost / benefit.deltaFragsPerDay;
  return formatEfficiencyValue(rawRatio);
}

// Calculate color class for gadget efficiency
function getGadgetEfficiencyColorClass(gadgetId, levelDelta = 1) {
  const efficiency1 = getGadgetRawEfficiency(gadgetId, 1);
  const efficiency10 = getGadgetRawEfficiency(gadgetId, 10);
  
  if (efficiency1 === Infinity && efficiency10 === Infinity) {
    return 'text-gray-500';
  }
  if (efficiency1 === Infinity || efficiency10 === Infinity) {
    return 'text-green-400';
  }
  
  const currentEfficiency = levelDelta === 1 ? efficiency1 : efficiency10;
  const betterEfficiency = Math.min(efficiency1, efficiency10);
  
  if (currentEfficiency === betterEfficiency) {
    return 'text-green-400';
  }
  
  const ratio = currentEfficiency / betterEfficiency;
  
  if (ratio <= 1.1) return 'text-green-500';
  if (ratio <= 1.25) return 'text-lime-400';
  if (ratio <= 1.5) return 'text-yellow-400';
  if (ratio <= 2.0) return 'text-orange-400';
  return 'text-red-400';
}

function getGadgetRawEfficiency(gadgetId, levelDelta = 1) {
  const benefit = getGadgetCostBenefit(gadgetId, levelDelta);
  if (!benefit || !benefit.deltaFragsPerDay || benefit.deltaFragsPerDay <= 0) {
    return Infinity;
  }
  return benefit.cost / benefit.deltaFragsPerDay;
}

// ============================================
// SHARED HELPER FUNCTIONS
// ============================================

// Format efficiency value with suffixes
function formatEfficiencyValue(rawRatio) {
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

// Get color class from relative position (0 = best/green, 1 = worst/red)
function getColorClassFromPosition(relativePosition) {
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
// +ULTIMA COST-BENEFIT FUNCTIONS
// ============================================

// Get cost-benefit analysis for +Ultima
function getPlusUltimaBenefit() {
  return missionPlannerStore.getPlusUltimaCostBenefit();
}

// ============================================
// GAME PROGRESS DYNAMIC BENEFIT PROJECTION
// ============================================

// Cache for game progress benefit calculations to avoid recalculating on every render
const gameProgressBenefitCache = ref({});

// Get benefit projection for next threshold of game progress modifiers
// For MP/RP/AllTimeHighestRP: calculates delta to next loopmod/research
// For Cells: uses fixed +100 delta
function getGameProgressBenefit(modifierId) {
  // Check cache first
  const cacheKey = `${modifierId}_${missionPlannerStore.modifierValues[modifierId]}`;
  if (gameProgressBenefitCache.value[cacheKey] !== undefined) {
    return gameProgressBenefitCache.value[cacheKey];
  }
  
  // Calculate and cache
  const result = missionPlannerStore.calculateGameProgressBenefit(modifierId);
  gameProgressBenefitCache.value[cacheKey] = result;
  return result;
}

// Get benefit projection for cells with +1000 delta
function getCellsBenefit1000() {
  const cacheKey = `cells_1000_${missionPlannerStore.modifierValues.cells}`;
  if (gameProgressBenefitCache.value[cacheKey] !== undefined) {
    return gameProgressBenefitCache.value[cacheKey];
  }
  
  const result = missionPlannerStore.calculateGameProgressBenefitWithDelta('cells', 1000);
  gameProgressBenefitCache.value[cacheKey] = result;
  return result;
}

// Clear cache when optimization runs
watch(() => missionPlannerStore.optimizationRun, () => {
  gameProgressBenefitCache.value = {};
});

// Clear cache when ANY modifier changes (since they can affect each other's projections)
// MP changes affect missionSpeed which affects all other projections
watch(() => missionPlannerStore.modifierValues, () => {
  gameProgressBenefitCache.value = {};
}, { deep: true });
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
