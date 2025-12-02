<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="closeModal"
  >
    <div
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white flex items-center">
            <IconAdjustments size="18" class="mr-2 text-purple-400" />
            Mission Modifiers
          </h2>
          <button
            @click="closeModal"
            class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            title="Close"
          >
            <IconX size="16" />
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="bg-gray-800/80 border-b border-gray-700/50">
        <div class="flex overflow-x-auto">
          <button
            @click="activeTab = 'gameProgress'"
            class="flex-1 px-4 py-2.5 font-semibold text-xs transition-colors duration-200 border-b-2 whitespace-nowrap"
            :class="activeTab === 'gameProgress' 
              ? 'bg-gray-700/50 text-white border-white' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
          >
            Game Progress
          </button>
          <button
            @click="activeTab = 'relics'"
            class="flex-1 px-4 py-2.5 font-semibold text-xs transition-colors duration-200 border-b-2 whitespace-nowrap"
            :class="activeTab === 'relics' 
              ? 'bg-gray-700/50 text-purple-400 border-purple-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
          >
            Relics
          </button>
          <button
            @click="activeTab = 'badges'"
            class="flex-1 px-4 py-2.5 font-semibold text-xs transition-colors duration-200 border-b-2 whitespace-nowrap"
            :class="activeTab === 'badges' 
              ? 'bg-gray-700/50 text-yellow-400 border-yellow-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
          >
            Badges
          </button>
          <button
            @click="activeTab = 'boons'"
            class="flex-1 px-4 py-2.5 font-semibold text-xs transition-colors duration-200 border-b-2 whitespace-nowrap"
            :class="activeTab === 'boons' 
              ? 'bg-gray-700/50 text-red-500 border-red-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
          >
            Boons
          </button>
          <button
            @click="activeTab = 'inscryptions'"
            class="flex-1 px-4 py-2.5 font-semibold text-xs transition-colors duration-200 border-b-2 whitespace-nowrap"
            :class="activeTab === 'inscryptions' 
              ? 'bg-gray-700/50 text-rose-400 border-rose-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
          >
            Inscryptions
          </button>
          <button
            @click="activeTab = 'gadgets'"
            class="flex-1 px-4 py-2.5 font-semibold text-xs transition-colors duration-200 border-b-2 whitespace-nowrap"
            :class="activeTab === 'gadgets' 
              ? 'bg-gray-700/50 text-sky-400 border-sky-400' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
          >
            Gadgets
          </button>
          <button
            @click="activeTab = 'gems'"
            class="flex-1 px-4 py-2.5 font-semibold text-xs transition-colors duration-200 border-b-2 whitespace-nowrap"
            :class="activeTab === 'gems' 
              ? 'bg-gray-700/50 text-blue-500 border-blue-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
          >
            Gems
          </button>
          <button
            @click="activeTab = 'other'"
            class="flex-1 px-4 py-2.5 font-semibold text-xs transition-colors duration-200 border-b-2 whitespace-nowrap"
            :class="activeTab === 'other' 
              ? 'bg-gray-700/50 text-gray-300 border-gray-400' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
          >
            Other
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 sm:p-4 min-h-[400px]">
        <!-- Left Side: Modifier Inputs -->
        <div class="space-y-4">
          <!-- Game Progress Tab -->
          <div v-if="activeTab === 'gameProgress'" class="space-y-1">
            <div v-for="(modifier, index) in modifiers.gameProgress" :key="modifier.id" 
              class="flex items-center justify-between py-2 px-3 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <label class="text-xs text-gray-300">{{ modifier.name }}</label>
              <ToolValueControls
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="1"
                :show-fast-controls="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Space Academy Relics Tab -->
          <div v-if="activeTab === 'relics'" class="space-y-1">
            <div v-for="(modifier, index) in modifiers.relics" :key="modifier.id" 
              class="flex items-center justify-between py-2 px-3 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <label class="text-xs text-gray-300">{{ modifier.name }}</label>
              <ToolValueControls
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="1"
                :show-fast-controls="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Badges Tab -->
          <div v-if="activeTab === 'badges'" class="space-y-1">
            <div v-for="(modifier, index) in modifiers.badges" :key="modifier.id" 
              class="flex items-center py-2 px-3 rounded cursor-pointer"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
              @click="updateModifier(modifier.id, !missionPlannerStore.modifierValues[modifier.id])"
            >
              <div class="w-4 h-4 rounded border flex items-center justify-center mr-3"
                :class="missionPlannerStore.modifierValues[modifier.id] 
                  ? 'bg-green-600 border-green-600' 
                  : 'bg-transparent border-gray-600'"
              >
                <span v-if="missionPlannerStore.modifierValues[modifier.id]" class="text-white text-[10px]">✓</span>
              </div>
              <label class="text-xs text-gray-300 cursor-pointer select-none flex-1">
                {{ modifier.name }}
              </label>
            </div>
          </div>

          <!-- Boons Tab -->
          <div v-if="activeTab === 'boons'" class="space-y-1">
            <p class="text-[10px] text-gray-500 mb-2 px-1">Boon levels are calculated from MP</p>
            <div v-for="(modifier, index) in modifiers.mods" :key="modifier.id" 
              class="flex items-center justify-between py-2 px-3 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <label class="text-xs text-gray-300">{{ modifier.name }}</label>
              <ToolValueControls
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="1"
                :show-fast-controls="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Inscryptions Tab -->
          <div v-if="activeTab === 'inscryptions'" class="space-y-1">
            <div v-for="(modifier, index) in modifiers.inscryptions" :key="modifier.id" 
              class="flex items-center justify-between py-2 px-3 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <label class="text-xs text-gray-300">{{ modifier.name }}</label>
              <ToolValueControls
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="1"
                :show-fast-controls="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Gadgets Tab -->
          <div v-if="activeTab === 'gadgets'" class="space-y-1">
            <div v-for="(modifier, index) in modifiers.gadgets" :key="modifier.id" 
              class="flex items-center justify-between py-2 px-3 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <label class="text-xs text-gray-300">{{ modifier.name }}</label>
              <ToolValueControls
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="1"
                :show-fast-controls="true"
                @update:value="updateModifier(modifier.id, $event)"
              />
            </div>
          </div>

          <!-- Other Tab -->
          <div v-if="activeTab === 'other'" class="space-y-1">
            <!-- Boolean modifiers (checkboxes) -->
            <template v-for="(modifier, index) in modifiers.other" :key="modifier.id">
              <div v-if="modifier.type === 'boolean'" 
                class="flex items-center py-2 px-3 rounded cursor-pointer"
                :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
                @click="updateModifier(modifier.id, !missionPlannerStore.modifierValues[modifier.id])"
              >
                <div class="w-4 h-4 rounded border flex items-center justify-center mr-3"
                  :class="missionPlannerStore.modifierValues[modifier.id] 
                    ? 'bg-green-600 border-green-600' 
                    : 'bg-transparent border-gray-600'"
                >
                  <span v-if="missionPlannerStore.modifierValues[modifier.id]" class="text-white text-[10px]">✓</span>
                </div>
                <label class="text-xs text-gray-300 cursor-pointer select-none flex-1">
                  {{ modifier.name }}
                </label>
              </div>
              
              <!-- Readonly modifier (Eternal Milestone) - only show when Attraction Gem is Level 3+ -->
              <div v-else-if="modifier.type === 'readonly'" 
                class="flex items-center justify-between py-2 px-3 rounded"
                :class="isEternalMilestoneUnlocked ? 'bg-gray-800/50' : 'bg-gray-800/30 opacity-60'"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 rounded-full" 
                    :class="isEternalMilestoneUnlocked && eternalMilestoneLevel > 0 ? 'bg-green-500' : 'bg-gray-600'"></div>
                  <span class="text-xs" :class="isEternalMilestoneUnlocked ? 'text-white' : 'text-gray-500'">
                    {{ modifier.name }}
                  </span>
                  <span v-if="!isEternalMilestoneUnlocked" class="text-[10px] text-red-400 ml-2">
                    🔒 Attraction Gem Lv{{ attractionGemLevel }}/3
                  </span>
                </div>
                <div v-if="isEternalMilestoneUnlocked" class="flex items-center space-x-3">
                  <span class="text-xs text-gray-400">Level:</span>
                  <span class="text-sm font-mono text-blue-400">{{ eternalMilestoneLevel }}</span>
                </div>
                <div v-else class="text-xs text-gray-500 font-mono">
                  ×1.0000
                </div>
              </div>
            </template>
            
            <p class="text-[10px] text-gray-500 mt-2 px-1 italic">
              * Eternal Milestone requires Attraction Gem Level 3 to unlock
            </p>
          </div>

          <!-- Gems Tab -->
          <div v-if="activeTab === 'gems'" class="space-y-3">
            <p class="text-xs text-gray-400 mb-3">
              Gem node states are read from Gem Planner. Only special inputs can be edited here.
            </p>

            <!-- Grouped by Gem Type -->
            <div class="space-y-4">
              <!-- Attraction Gem (Blue #3b82f6) -->
              <div class="bg-gray-800/30 rounded-lg p-3">
                <h5 class="text-xs font-semibold mb-2 flex items-center" style="color: #3b82f6;">
                  <span class="w-2 h-2 rounded-full mr-2" style="background-color: #3b82f6;"></span>
                  Attraction Gem
                </h5>
                <div class="flex flex-wrap gap-1">
                  <div v-for="modifier in gemsByType.attraction" :key="modifier.id" 
                    class="px-2 py-1 rounded text-xs"
                    :class="isGemNodeActive(modifier.id) ? 'bg-blue-900/40 text-white' : 'bg-gray-800/50 text-gray-500'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full inline-block mr-1" 
                      :class="isGemNodeActive(modifier.id) ? 'bg-green-500' : 'bg-gray-600'"></span>
                    {{ modifier.name }}
                  </div>
                </div>
              </div>

              <!-- Creation Gem (Orange #f97316) -->
              <div class="bg-gray-800/30 rounded-lg p-3">
                <h5 class="text-xs font-semibold mb-2 flex items-center" style="color: #f97316;">
                  <span class="w-2 h-2 rounded-full mr-2" style="background-color: #f97316;"></span>
                  Creation Gem
                </h5>
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-1">
                    <div v-for="modifier in gemsByType.creation" :key="modifier.id" 
                      class="px-2 py-1 rounded text-xs"
                      :class="isGemNodeActive(modifier.id) ? 'bg-orange-900/40 text-white' : 'bg-gray-800/50 text-gray-500'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full inline-block mr-1" 
                        :class="isGemNodeActive(modifier.id) ? 'bg-green-500' : 'bg-gray-600'"></span>
                      {{ modifier.name }}
                    </div>
                  </div>
                  <!-- Mechs Owned Input for Creation Node 5 -->
                  <div v-if="isGemNodeActive('creation_node_5')" 
                    class="flex items-center justify-between bg-gray-800/50 rounded p-2"
                  >
                    <div class="flex items-center space-x-2">
                      <label class="text-xs text-gray-400">Mechs Owned:</label>
                      <span class="text-xs font-mono" style="color: #f97316;">
                        ×{{ (1.001 ** (missionPlannerStore.modifierValues.creation_node_5_mechs || 0)).toFixed(4) }}
                      </span>
                    </div>
                    <ToolValueControls
                      :value="missionPlannerStore.modifierValues.creation_node_5_mechs || 0"
                      :min-value="0"
                      :max-value="100000"
                      :step="1"
                      :show-fast-controls="true"
                      @update:value="updateModifier('creation_node_5_mechs', $event)"
                    />
                  </div>
                </div>
              </div>

              <!-- Exodus Gem (Purple #8b5cf6) -->
              <div class="bg-gray-800/30 rounded-lg p-3">
                <h5 class="text-xs font-semibold mb-2 flex items-center" style="color: #8b5cf6;">
                  <span class="w-2 h-2 rounded-full mr-2" style="background-color: #8b5cf6;"></span>
                  Exodus Gem
                </h5>
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-1">
                    <div v-for="modifier in gemsByType.exodus" :key="modifier.id" 
                      class="px-2 py-1 rounded text-xs"
                      :class="isGemNodeActive(modifier.id) ? 'bg-purple-900/40 text-white' : 'bg-gray-800/50 text-gray-500'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full inline-block mr-1" 
                        :class="isGemNodeActive(modifier.id) ? 'bg-green-500' : 'bg-gray-600'"></span>
                      {{ modifier.name }}
                    </div>
                  </div>
                  <!-- Loopmods Owned Input for Exodus Node 2 -->
                  <div v-if="isGemNodeActive('exodus_node_2')" 
                    class="flex items-center justify-between bg-gray-800/50 rounded p-2"
                  >
                    <div class="flex items-center space-x-2">
                      <label class="text-xs text-gray-400">Loopmods Owned:</label>
                      <span class="text-xs font-mono" style="color: #8b5cf6;">
                        +{{ (Math.floor((missionPlannerStore.modifierValues.exodus_node_2_loopmods || 0) / 10000)).toFixed(0) }}%
                      </span>
                    </div>
                    <ToolValueControls
                      :value="missionPlannerStore.modifierValues.exodus_node_2_loopmods || 0"
                      :min-value="0"
                      :max-value="10000000"
                      :step="1000"
                      :show-fast-controls="true"
                      @update:value="updateModifier('exodus_node_2_loopmods', $event)"
                    />
                  </div>
                </div>
              </div>

              <!-- Power Gem (Purple #8b5cf6) -->
              <div class="bg-gray-800/30 rounded-lg p-3">
                <h5 class="text-xs font-semibold mb-2 flex items-center" style="color: #8b5cf6;">
                  <span class="w-2 h-2 rounded-full mr-2" style="background-color: #8b5cf6;"></span>
                  Power Gem
                </h5>
                <div class="flex flex-wrap gap-1">
                  <div v-for="modifier in gemsByType.power" :key="modifier.id" 
                    class="px-2 py-1 rounded text-xs"
                    :class="isGemNodeActive(modifier.id) ? 'bg-purple-900/40 text-white' : 'bg-gray-800/50 text-gray-500'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full inline-block mr-1" 
                      :class="isGemNodeActive(modifier.id) ? 'bg-green-500' : 'bg-gray-600'"></span>
                    {{ modifier.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Effects Display -->
        <div class="bg-gray-900/50 rounded-lg border border-gray-700/50 p-4">
          <h3 class="text-sm font-bold text-white mb-4 flex items-center">
            <div class="w-1 h-5 bg-indigo-500 rounded-r mr-2"></div>
            Modifier Effects
          </h3>

          <div class="space-y-3">
            <!-- Personnel Section - Table Layout -->
            <div class="space-y-2">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Personnel</h4>
              
              <!-- Personnel Table -->
              <div class="bg-gray-800/50 rounded overflow-hidden">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-gray-700/50">
                      <th class="text-left text-gray-400 font-semibold py-2 px-3">Type</th>
                      <th class="text-right text-gray-400 font-semibold py-2 px-3">Count</th>
                      <th class="text-right text-gray-400 font-semibold py-2 px-3">Ind. Power</th>
                      <th class="text-right text-gray-400 font-semibold py-2 px-3">Total Power</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- T1 Mining Pod -->
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors">
                      <td class="py-2 px-3 text-gray-300">
                        <span class="text-cyan-400 font-semibold">T1</span> Mining Pod
                      </td>
                      <td class="py-2 px-3 text-right text-cyan-400 font-mono">{{ calculatedEffects.t1Count }}</td>
                      <td class="py-2 px-3 text-right text-gray-300 font-mono">{{ calculatedEffects.t1PowerPerUnit }}</td>
                      <td class="py-2 px-3 text-right text-white font-mono font-semibold">{{ calculatedEffects.t1Power }}</td>
                    </tr>
                    <!-- T2 Fireteam Carrier -->
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors">
                      <td class="py-2 px-3 text-gray-300">
                        <span class="text-green-400 font-semibold">T2</span> Fireteam Carrier
                      </td>
                      <td class="py-2 px-3 text-right text-cyan-400 font-mono">{{ calculatedEffects.t2Count }}</td>
                      <td class="py-2 px-3 text-right text-gray-300 font-mono">{{ calculatedEffects.t2PowerPerUnit }}</td>
                      <td class="py-2 px-3 text-right text-white font-mono font-semibold">{{ calculatedEffects.t2Power }}</td>
                    </tr>
                    <!-- T3 Titan Hauler -->
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors">
                      <td class="py-2 px-3 text-gray-300">
                        <span class="text-yellow-400 font-semibold">T3</span> Titan Hauler
                      </td>
                      <td class="py-2 px-3 text-right text-cyan-400 font-mono">{{ calculatedEffects.t3Count }}</td>
                      <td class="py-2 px-3 text-right text-gray-300 font-mono">{{ calculatedEffects.t3PowerPerUnit }}</td>
                      <td class="py-2 px-3 text-right text-white font-mono font-semibold">{{ calculatedEffects.t3Power }}</td>
                    </tr>
                    <!-- T4 Combat Corvette -->
                    <tr class="hover:bg-gray-700/30 transition-colors">
                      <td class="py-2 px-3 text-gray-300">
                        <span class="text-purple-400 font-semibold">T4</span> Combat Corvette
                      </td>
                      <td class="py-2 px-3 text-right text-cyan-400 font-mono">{{ calculatedEffects.t4Count }}</td>
                      <td class="py-2 px-3 text-right text-gray-300 font-mono">{{ calculatedEffects.t4PowerPerUnit }}</td>
                      <td class="py-2 px-3 text-right text-white font-mono font-semibold">{{ calculatedEffects.t4Power }}</td>
                    </tr>
                  </tbody>
                  <!-- Total Row -->
                  <tfoot>
                    <tr class="bg-gray-700/40 border-t border-gray-600">
                      <td class="py-2 px-3 text-white font-semibold">Total</td>
                      <td class="py-2 px-3 text-right text-cyan-400 font-mono font-semibold">{{ calculatedEffects.totalCount }}</td>
                      <td class="py-2 px-3 text-right text-gray-400">-</td>
                      <td class="py-2 px-3 text-right text-green-400 font-mono font-bold">{{ calculatedEffects.totalPower }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Mission Effects Section -->
            <div class="space-y-2 pt-3 border-t border-gray-700/50">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Mission Effects</h4>
              
              <div class="bg-gray-800/50 rounded p-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-300">Mission Speed</span>
                  <span class="text-green-400 font-mono">{{ calculatedEffects.missionSpeed }}%</span>
                </div>
              </div>

              <div class="bg-gray-800/50 rounded p-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-300">Farm Fragments</span>
                  <span class="text-blue-400 font-mono">{{ calculatedEffects.farmFragmentsValue }}</span>
                </div>
              </div>

              <div class="bg-gray-800/50 rounded p-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-gray-300">Campaign Fragments</span>
                  <span class="text-purple-400 font-mono">{{ calculatedEffects.campaignFragmentsValue }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug Section -->
      <div class="p-3 border-t border-gray-700 bg-gray-900/80 max-h-[50vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-xs font-bold text-red-400">🔧 DEBUG: Detailed Breakdown</h4>
          <button 
            @click="debugExpanded = !debugExpanded"
            class="text-[10px] text-gray-400 hover:text-white px-2 py-1 bg-gray-700 rounded"
          >
            {{ debugExpanded ? 'Collapse' : 'Expand All' }}
          </button>
        </div>
        
        <!-- Summary Row -->
        <div class="grid grid-cols-3 gap-2 text-[10px] font-mono mb-3 bg-gray-800 p-2 rounded">
          <div>
            <span class="text-blue-400 font-bold">Farm Frags:</span>
            <span class="text-white ml-1">{{ calculatedEffects.farmFragmentsValue }}</span>
            <span class="text-gray-500 ml-1">(base 0.001)</span>
          </div>
          <div>
            <span class="text-purple-400 font-bold">Campaign Frags:</span>
            <span class="text-white ml-1">{{ calculatedEffects.campaignFragmentsValue }}</span>
            <span class="text-gray-500 ml-1">(base 2.5)</span>
          </div>
          <div>
            <span class="text-green-400 font-bold">Mission Speed:</span>
            <span class="text-white ml-1">{{ calculatedEffects.missionSpeed }}%</span>
          </div>
        </div>

        <!-- Boons Detail -->
        <div class="mb-3">
          <div 
            class="flex items-center justify-between bg-gray-800 p-2 rounded-t cursor-pointer hover:bg-gray-700"
            @click="toggleSection('loopmods')"
          >
            <span class="text-red-400 font-bold text-[10px]">📦 LOOPMODS (MP: {{ missionPlannerStore.modifierValues.mp }})</span>
            <div class="flex items-center space-x-2 text-[9px]">
              <span class="text-blue-300">Farm: ×{{ calculatedEffects.breakdowns?.loopmod?.farmFragsMultiplier?.toFixed(4) }}</span>
              <span class="text-purple-300">Camp: ×{{ calculatedEffects.breakdowns?.loopmod?.campaignFragsMultiplier?.toFixed(4) }}</span>
              <span class="text-green-300">Speed: ×{{ calculatedEffects.breakdowns?.loopmod?.missionSpeedMultiplier?.toFixed(4) }}</span>
              <span class="text-gray-400">{{ expandedSections.loopmods ? '▼' : '▶' }}</span>
            </div>
          </div>
          <div v-if="expandedSections.loopmods" class="bg-gray-800/50 p-2 rounded-b border-t border-gray-700">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-1 text-[9px]">
              <template v-for="detail in calculatedEffects.breakdowns?.loopmod?.details" :key="detail.id">
                <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                  <span class="text-gray-400 truncate mr-1">{{ detail.name }}</span>
                  <div class="flex items-center space-x-2">
                    <span :class="detail.level > 0 ? 'text-cyan-400' : 'text-gray-600'">Lv{{ detail.level }}/{{ detail.maxLevel }}</span>
                    <span v-if="detail.level > 0" class="text-yellow-400">
                      <template v-if="detail.effectType === 'personnel_power'">→ +{{ (detail.level * 0.1).toFixed(1) }} {{ detail.target }} Pwr</template>
                      <template v-else-if="detail.effectType === 'personnel_count'">→ +{{ detail.target === 'ALL' ? detail.level * 10 : detail.level * 5 }} {{ detail.target }}</template>
                      <template v-else-if="detail.effectType === 'mission_speed_and_personnel'">→ ×{{ Math.pow(1.1, detail.level).toFixed(2) }} Spd, +{{ detail.level * 20 * 4 }} All</template>
                      <template v-else-if="detail.effectType === 'mission_speed'">→ ×{{ Math.pow(1.0311, detail.level).toFixed(4) }} Spd</template>
                      <template v-else-if="detail.effectType === 'farm_fragments'">→ ×{{ Math.pow(1.04, detail.level).toFixed(4) }} Farm</template>
                      <template v-else-if="detail.effectType === 'campaign_fragments'">→ Boon</template>
                    </span>
                  </div>
                </div>
              </template>
            </div>
            <div class="mt-2 text-[9px] text-gray-400 border-t border-gray-700 pt-2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div class="bg-gray-900/50 px-2 py-1 rounded">
                  <span class="text-yellow-400">Boon Eternity:</span> 
                  Lv{{ calculatedEffects.breakdowns?.loopmod?.loopmodLevels?.boon_eternity || 0 }}
                  × {{ missionPlannerStore.modifierValues.completed_campaigns || 0 }} campaigns
                  <span class="text-purple-400 ml-1">
                    → ×{{ Math.pow(1.03, (calculatedEffects.breakdowns?.loopmod?.loopmodLevels?.boon_eternity || 0) * (missionPlannerStore.modifierValues.completed_campaigns || 0)).toFixed(4) }}
                  </span>
                </div>
                <div class="bg-gray-900/50 px-2 py-1 rounded">
                  <span class="text-yellow-400">Boon Hegemony:</span> 
                  Lv{{ calculatedEffects.breakdowns?.loopmod?.loopmodLevels?.boon_hegemony || 0 }}
                  × {{ missionPlannerStore.modifierValues.ship_installs || 0 }} installs
                  <span class="text-purple-400 ml-1">
                    → ×{{ Math.pow(1.01, (calculatedEffects.breakdowns?.loopmod?.loopmodLevels?.boon_hegemony || 0) * (missionPlannerStore.modifierValues.ship_installs || 0)).toFixed(4) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Research Detail -->
        <div class="mb-3">
          <div 
            class="flex items-center justify-between bg-gray-800 p-2 rounded-t cursor-pointer hover:bg-gray-700"
            @click="toggleSection('research')"
          >
            <span class="text-cyan-400 font-bold text-[10px]">🔬 RESEARCH (RP: {{ missionPlannerStore.modifierValues.rp }}, ATH: {{ missionPlannerStore.modifierValues.all_time_highest_rp }})</span>
            <div class="flex items-center space-x-2 text-[9px]">
              <span class="text-blue-300">Farm: ×{{ calculatedEffects.breakdowns?.research?.farmFragsBonuses?.multiplier?.toFixed(4) }} +{{ calculatedEffects.breakdowns?.research?.farmFragsBonuses?.additive?.toFixed(4) }}</span>
              <span class="text-purple-300">Camp: ×{{ calculatedEffects.breakdowns?.research?.campaignFragsBonuses?.multiplier?.toFixed(4) }}</span>
              <span class="text-green-300">Speed: ×{{ calculatedEffects.breakdowns?.research?.missionSpeedMultiplier?.toFixed(4) }}</span>
              <span class="text-gray-400">{{ expandedSections.research ? '▼' : '▶' }}</span>
            </div>
          </div>
          <div v-if="expandedSections.research" class="bg-gray-800/50 p-2 rounded-b border-t border-gray-700">
            <div class="grid grid-cols-1 gap-1 text-[9px]">
              <template v-for="(detail, id) in calculatedEffects.breakdowns?.research?.researchDetails" :key="id">
                <div v-if="detail.unlockedLevels > 0" class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                  <span class="text-gray-400 truncate mr-1">{{ id }} ({{ detail.unlockedLevels }}/{{ detail.maxLevel }})</span>
                  <div class="flex items-center space-x-2">
                    <!-- Speed -->
                    <span v-if="detail.effects?.speedMult > 1" class="text-green-400">
                      Spd ×{{ detail.effects.speedMult.toFixed(2) }}
                    </span>
                    <!-- Farm Add -->
                    <span v-if="detail.effects?.farmAdd > 0" class="text-blue-400">
                      Farm +{{ detail.effects.farmAdd.toFixed(4) }}
                    </span>
                    <!-- Farm Mult -->
                    <span v-if="detail.effects?.farmMult > 1" class="text-blue-300">
                      Farm ×{{ detail.effects.farmMult.toFixed(4) }}
                    </span>
                    <!-- Camp Mult -->
                    <span v-if="detail.effects?.campMult > 1" class="text-purple-400">
                      Camp ×{{ detail.effects.campMult.toFixed(4) }}
                    </span>
                    <!-- Personnel -->
                    <span v-if="detail.effects?.personnel?.T1 > 0 || detail.effects?.personnel?.T2 > 0 || detail.effects?.personnel?.T3 > 0" class="text-yellow-400">
                      Pers: 
                      <template v-if="detail.effects.personnel.T1 > 0">T1+{{ detail.effects.personnel.T1 }}</template>
                      <template v-if="detail.effects.personnel.T2 > 0"> T2+{{ detail.effects.personnel.T2 }}</template>
                      <template v-if="detail.effects.personnel.T3 > 0"> T3+{{ detail.effects.personnel.T3 }}</template>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Relics Detail -->
        <div class="mb-3">
          <div 
            class="flex items-center justify-between bg-gray-800 p-2 rounded-t cursor-pointer hover:bg-gray-700"
            @click="toggleSection('relic')"
          >
            <span class="text-amber-400 font-bold text-[10px]">⚱️ RELICS</span>
            <div class="flex items-center space-x-2 text-[9px]">
              <span class="text-blue-300">Farm: +{{ calculatedEffects.breakdowns?.relic?.farmFragsAdditive?.toFixed(4) }}</span>
              <span class="text-purple-300">Camp: ×{{ calculatedEffects.breakdowns?.relic?.campaignFragsMultiplier?.toFixed(4) }} +{{ calculatedEffects.breakdowns?.relic?.campaignFragsAdditive?.toFixed(4) }}</span>
              <span class="text-green-300">Speed: ×{{ calculatedEffects.breakdowns?.relic?.missionSpeedMultiplier?.toFixed(4) }}</span>
              <span class="text-gray-400">{{ expandedSections.relic ? '▼' : '▶' }}</span>
            </div>
          </div>
          <div v-if="expandedSections.relic" class="bg-gray-800/50 p-2 rounded-b border-t border-gray-700 text-[9px]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">Relic 3 (Speed +3%/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.relic_3 || 0 }} → <span class="text-green-400">×{{ (1 + (missionPlannerStore.modifierValues.relic_3 || 0) * 0.03).toFixed(2) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">Relic 5 (Farm +0.001/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.relic_5 || 0 }} → <span class="text-blue-400">+{{ ((missionPlannerStore.modifierValues.relic_5 || 0) * 0.001).toFixed(4) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">Relic 6 (Camp +2.75 & ×1.05/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.relic_6 || 0 }} → <span class="text-purple-400">+{{ ((missionPlannerStore.modifierValues.relic_6 || 0) * 2.75).toFixed(2) }} ×{{ Math.pow(1.05, missionPlannerStore.modifierValues.relic_6 || 0).toFixed(4) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">Relic 11 (Max Crew +50%/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.relic_11 || 0 }} → <span class="text-yellow-400">×{{ (1 + (missionPlannerStore.modifierValues.relic_11 || 0) * 0.5).toFixed(2) }}</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges Detail -->
        <div class="mb-3">
          <div 
            class="flex items-center justify-between bg-gray-800 p-2 rounded-t cursor-pointer hover:bg-gray-700"
            @click="toggleSection('badge')"
          >
            <span class="text-green-400 font-bold text-[10px]">🎖️ BADGES</span>
            <div class="flex items-center space-x-2 text-[9px]">
              <span class="text-blue-300">Farm: ×{{ calculatedEffects.breakdowns?.badge?.farmFragsMultiplier?.toFixed(4) }}</span>
              <span class="text-green-300">Speed: ×{{ calculatedEffects.breakdowns?.badge?.missionSpeedMultiplier?.toFixed(4) }}</span>
              <span class="text-gray-400">{{ expandedSections.badge ? '▼' : '▶' }}</span>
            </div>
          </div>
          <div v-if="expandedSections.badge" class="bg-gray-800/50 p-2 rounded-b border-t border-gray-700 text-[9px]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">Engineering Badge:</span>
                <span :class="missionPlannerStore.modifierValues.engineering_badge ? 'text-green-400' : 'text-gray-600'">
                  {{ missionPlannerStore.modifierValues.engineering_badge ? '✓ → ×1.25 Speed' : '✗' }}
                </span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">Fragmentation Badge:</span>
                <span :class="missionPlannerStore.modifierValues.fragmentation_badge ? 'text-green-400' : 'text-gray-600'">
                  {{ missionPlannerStore.modifierValues.fragmentation_badge ? '✓ → ×2.0 Farm' : '✗' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Inscryptions Detail -->
        <div class="mb-3">
          <div 
            class="flex items-center justify-between bg-gray-800 p-2 rounded-t cursor-pointer hover:bg-gray-700"
            @click="toggleSection('inscryption')"
          >
            <span class="text-purple-400 font-bold text-[10px]">📜 INSCRYPTIONS</span>
            <div class="flex items-center space-x-2 text-[9px]">
              <span class="text-blue-300">Farm: ×{{ calculatedEffects.breakdowns?.inscryption?.farmFragsMultiplier?.toFixed(4) }} +{{ calculatedEffects.breakdowns?.inscryption?.farmFragsAdditive?.toFixed(4) }}</span>
              <span class="text-purple-300">Camp: ×{{ calculatedEffects.breakdowns?.inscryption?.campaignFragsMultiplier?.toFixed(4) }}</span>
              <span class="text-gray-400">{{ expandedSections.inscryption ? '▼' : '▶' }}</span>
            </div>
          </div>
          <div v-if="expandedSections.inscryption" class="bg-gray-800/50 p-2 rounded-b border-t border-gray-700 text-[9px]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">I58 (Headstart +5 max/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.inscryption_58 || 0 }} → <span class="text-yellow-400">+{{ ((missionPlannerStore.modifierValues.inscryption_58 || 0) * 5) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">I102 (Farm +0.003/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.inscryption_102 || 0 }} → <span class="text-blue-400">+{{ ((missionPlannerStore.modifierValues.inscryption_102 || 0) * 0.003).toFixed(4) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">I106 (T1 Pwr +0.8/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.inscryption_106 || 0 }} → <span class="text-yellow-400">+{{ ((missionPlannerStore.modifierValues.inscryption_106 || 0) * 0.8).toFixed(1) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">I107 (T2 Pwr +1.2/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.inscryption_107 || 0 }} → <span class="text-yellow-400">+{{ ((missionPlannerStore.modifierValues.inscryption_107 || 0) * 1.2).toFixed(1) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">I108 (T3 Pwr +1.6/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.inscryption_108 || 0 }} → <span class="text-yellow-400">+{{ ((missionPlannerStore.modifierValues.inscryption_108 || 0) * 1.6).toFixed(1) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">I109 (T4 Pwr +2.0/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.inscryption_109 || 0 }} → <span class="text-yellow-400">+{{ ((missionPlannerStore.modifierValues.inscryption_109 || 0) * 2.0).toFixed(1) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">I110 (All Frags ×1.04/lv):</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.inscryption_110 || 0 }} → <span class="text-yellow-400">×{{ Math.pow(1.04, missionPlannerStore.modifierValues.inscryption_110 || 0).toFixed(4) }}</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gadgets Detail -->
        <div class="mb-3">
          <div 
            class="flex items-center justify-between bg-gray-800 p-2 rounded-t cursor-pointer hover:bg-gray-700"
            @click="toggleSection('gadget')"
          >
            <span class="text-orange-400 font-bold text-[10px]">🔧 GADGETS</span>
            <div class="flex items-center space-x-2 text-[9px]">
              <span class="text-blue-300">Farm: +{{ calculatedEffects.breakdowns?.gadget?.farmFragsAdditive?.toFixed(6) }}</span>
              <span class="text-purple-300">Camp: ×{{ calculatedEffects.breakdowns?.gadget?.campaignFragsMultiplier?.toFixed(4) }}</span>
              <span class="text-gray-400">{{ expandedSections.gadget ? '▼' : '▶' }}</span>
            </div>
          </div>
          <div v-if="expandedSections.gadget" class="bg-gray-800/50 p-2 rounded-b border-t border-gray-700 text-[9px]">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">Local Frag Magnet:</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.local_fragment_magnet || 0 }} → <span class="text-blue-400">+{{ calculatedEffects.breakdowns?.gadget?.farmFragsAdditive?.toFixed(4) }}</span></span>
              </div>
              <div class="flex justify-between bg-gray-900/50 px-2 py-1 rounded">
                <span class="text-gray-400">Galactic Frag Magnet:</span>
                <span class="text-cyan-400">Lv{{ missionPlannerStore.modifierValues.galactic_fragment_magnet || 0 }} → <span class="text-purple-400">×{{ calculatedEffects.breakdowns?.gadget?.campaignFragsMultiplier?.toFixed(4) }}</span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Other & Gems Detail -->
        <div class="mb-3">
          <div 
            class="flex items-center justify-between bg-gray-800 p-2 rounded-t cursor-pointer hover:bg-gray-700"
            @click="toggleSection('other')"
          >
            <span class="text-yellow-400 font-bold text-[10px]">✨ OTHER & GEMS</span>
            <div class="flex items-center space-x-2 text-[9px]">
              <span class="text-blue-300">Farm: ×{{ calculatedEffects.breakdowns?.other?.farmFragsMultiplier?.toFixed(4) }} | Gem: ×{{ calculatedEffects.breakdowns?.gem?.farmFragsMultiplier?.toFixed(4) }}</span>
              <span class="text-purple-300">Camp: ×{{ calculatedEffects.breakdowns?.other?.campaignFragsMultiplier?.toFixed(4) }} | Gem: ×{{ calculatedEffects.breakdowns?.gem?.campaignFragsMultiplier?.toFixed(4) }}</span>
              <span class="text-gray-400">{{ expandedSections.other ? '▼' : '▶' }}</span>
            </div>
          </div>
          <div v-if="expandedSections.other" class="bg-gray-800/50 p-2 rounded-b border-t border-gray-700 text-[9px]">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-yellow-400 font-bold mb-1">Other:</div>
                <div>TS07: <span :class="missionPlannerStore.modifierValues.trait_sphere_07 ? 'text-green-400' : 'text-gray-600'">{{ missionPlannerStore.modifierValues.trait_sphere_07 ? '✓ (×2 Farm)' : '✗' }}</span></div>
                <div>Frag Pack: <span :class="missionPlannerStore.modifierValues.fragmentation_pack ? 'text-green-400' : 'text-gray-600'">{{ missionPlannerStore.modifierValues.fragmentation_pack ? '✓ (×1.1 All)' : '✗' }}</span></div>
                <div>Eternal M0: <span :class="isEternalMilestoneUnlocked ? 'text-yellow-400' : 'text-gray-600'">Lv{{ eternalMilestoneLevel }} {{ isEternalMilestoneUnlocked ? `(×${eternalMilestoneMultiplier.toFixed(4)})` : '🔒' }}</span></div>
              </div>
              <div>
                <div class="text-cyan-400 font-bold mb-1">Gems (Attraction Lv{{ attractionGemLevel }}):</div>
                <div>Mechs: <span class="text-cyan-400">{{ missionPlannerStore.modifierValues.creation_node_5_mechs || 0 }}</span></div>
                <div>Loopmods: <span class="text-cyan-400">{{ missionPlannerStore.modifierValues.exodus_node_2_loopmods || 0 }}</span></div>
                <div>Farm Add: <span class="text-blue-300">+{{ calculatedEffects.breakdowns?.gem?.farmFragsAdditive?.toFixed(4) }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Final Calculation Formula -->
        <div class="bg-gray-800 p-2 rounded text-[9px] font-mono">
          <div class="text-white font-bold mb-1">📊 CALCULATION FORMULAS:</div>
          <div class="text-blue-400 mb-1">
            Farm = 0.001 × ({{ calculatedEffects.debug?.combinedFarmFragsMultiplier?.toFixed(4) }}) + {{ calculatedEffects.debug?.combinedFarmFragsAdditive?.toFixed(6) }} = <span class="text-white">{{ calculatedEffects.farmFragmentsValue }}</span>
          </div>
          <div class="text-purple-400 mb-1">
            Campaign = 2.5 × ({{ calculatedEffects.debug?.combinedCampaignFragsMultiplier?.toFixed(4) }}) + {{ calculatedEffects.debug?.combinedCampaignFragsAdditive?.toFixed(6) }} = <span class="text-white">{{ calculatedEffects.campaignFragmentsValue }}</span>
          </div>
          <div class="text-green-400">
            Speed = 100% × {{ calculatedEffects.debug?.combinedMissionSpeedMultiplier?.toFixed(4) }} = <span class="text-white">{{ calculatedEffects.missionSpeed }}%</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between pt-2 border-t border-gray-700 px-3 pb-3">
        <button
          @click="resetToDefaults"
          class="text-gray-400 hover:text-white transition-colors text-sm"
        >
          Reset
        </button>
        <button
          @click="closeModal"
          class="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import { IconAdjustments, IconX } from '@tabler/icons-vue';
import { MODIFIERS } from '@/constants/mission-planner/modifiers';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import ToolValueControls from '@/composables/ToolValueControls.vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

// Store
const missionPlannerStore = useMissionPlannerStore();
const gemPlannerStore = useGemPlannerStore();
const hunterStore = useHunterStore();

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

const eternalMilestoneMultiplier = computed(() => {
  if (!isEternalMilestoneUnlocked.value) return 1.0;
  const level = eternalMilestoneLevel.value;
  if (level <= 0) return 1.0;
  return Math.pow(1.011, level);
});

// Local references for template
const modifiers = MODIFIERS;
const activeTab = ref('gameProgress');

// Debug section state
const debugExpanded = ref(false);
const expandedSections = ref({
  loopmods: false,
  research: false,
  relic: false,
  badge: false,
  inscryption: false,
  gadget: false,
  other: false,
});

function toggleSection(section) {
  expandedSections.value[section] = !expandedSections.value[section];
}

// Expand/collapse all
watch(debugExpanded, (expanded) => {
  Object.keys(expandedSections.value).forEach(key => {
    expandedSections.value[key] = expanded;
  });
});

// Gem nodes grouped by type (only readonly nodes, not the input fields)
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
  'power_node_1': { gemId: 'power', nodeIndex: 0 },
  'power_node_2': { gemId: 'power', nodeIndex: 1 },
  'power_node_3': { gemId: 'power', nodeIndex: 2 },
  'power_node_4': { gemId: 'power', nodeIndex: 3 },
  'power_node_5': { gemId: 'power', nodeIndex: 4 }
};

// Check if a gem node is active based on gemPlannerStore
function isGemNodeActive(modifierId) {
  const mapping = GEM_NODE_MAPPING[modifierId];
  if (!mapping) return false;
  
  const gemState = gemPlannerStore.gemStates?.[mapping.gemId];
  if (!gemState || !gemState.nodes) return false;
  
  return gemState.nodes[mapping.nodeIndex] === true;
}

// Computed effects from store
const calculatedEffects = computed(() => {
  const effects = missionPlannerStore.calculatedEffects;
  const personnel = effects.personnel;
  
  return {
    // Personnel
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
    
    // Mission Effects
    missionSpeed: effects.missionSpeed,
    farmFragmentsValue: effects.farmFragments.formatted,
    campaignFragmentsValue: effects.campaignFragments.formatted,
    
    // Loopmod levels
    loopmodLevels: effects.loopmodLevels,
    
    // Full breakdowns for debug section
    breakdowns: effects.breakdowns,
    
    // Debug info
    debug: {
      // Loopmod effects
      loopmodFarmFragsMultiplier: effects.breakdowns.loopmod.farmFragsMultiplier,
      loopmodCampaignFragsMultiplier: effects.breakdowns.loopmod.campaignFragsMultiplier,
      loopmodMissionSpeedMultiplier: effects.breakdowns.loopmod.missionSpeedMultiplier,
      
      // Research effects
      researchFarmFragsMultiplier: effects.breakdowns.research.farmFragsBonuses.multiplier,
      researchFarmFragsAdditive: effects.breakdowns.research.farmFragsBonuses.additive,
      researchCampaignFragsMultiplier: effects.breakdowns.research.campaignFragsBonuses.multiplier,
      researchCampaignFragsAdditive: effects.breakdowns.research.campaignFragsBonuses.additive,
      researchMissionSpeedMultiplier: effects.breakdowns.research.missionSpeedMultiplier,
      
      // Relic effects
      relicFarmFragsAdditive: effects.breakdowns.relic.farmFragsAdditive,
      relicCampaignFragsMultiplier: effects.breakdowns.relic.campaignFragsMultiplier,
      relicCampaignFragsAdditive: effects.breakdowns.relic.campaignFragsAdditive,
      relicMissionSpeedMultiplier: effects.breakdowns.relic.missionSpeedMultiplier,
      
      // Badge effects
      badgeFarmFragsMultiplier: effects.breakdowns.badge.farmFragsMultiplier,
      badgeMissionSpeedMultiplier: effects.breakdowns.badge.missionSpeedMultiplier,
      
      // Inscryption effects
      inscryptionFarmFragsMultiplier: effects.breakdowns.inscryption.farmFragsMultiplier,
      inscryptionFarmFragsAdditive: effects.breakdowns.inscryption.farmFragsAdditive,
      inscryptionCampaignFragsMultiplier: effects.breakdowns.inscryption.campaignFragsMultiplier,
      
      // Gadget effects
      gadgetFarmFragsAdditive: effects.breakdowns.gadget.farmFragsAdditive,
      gadgetCampaignFragsMultiplier: effects.breakdowns.gadget.campaignFragsMultiplier,
      
      // Other effects
      otherFarmFragsMultiplier: effects.breakdowns.other.farmFragsMultiplier,
      otherCampaignFragsMultiplier: effects.breakdowns.other.campaignFragsMultiplier,
      
      // Gem effects
      gemFarmFragsMultiplier: effects.breakdowns.gem?.farmFragsMultiplier || 1.0,
      gemFarmFragsAdditive: effects.breakdowns.gem?.farmFragsAdditive || 0,
      gemCampaignFragsMultiplier: effects.breakdowns.gem?.campaignFragsMultiplier || 1.0,
      gemPersonnelT1: effects.breakdowns.gem?.personnelBonuses?.T1 || 0,
      gemPersonnelT2: effects.breakdowns.gem?.personnelBonuses?.T2 || 0,
      gemPersonnelT3: effects.breakdowns.gem?.personnelBonuses?.T3 || 0,
      gemPersonnelT4: effects.breakdowns.gem?.personnelBonuses?.T4 || 0,
      gemPowerT1: effects.breakdowns.gem?.powerBonuses?.T1 || 0,
      gemPowerT2: effects.breakdowns.gem?.powerBonuses?.T2 || 0,
      gemPowerT3: effects.breakdowns.gem?.powerBonuses?.T3 || 0,
      gemPowerT4: effects.breakdowns.gem?.powerBonuses?.T4 || 0,
      gemMechCount: effects.breakdowns.gem?.mechCount || 0,
      gemLoopmodsOwned: effects.breakdowns.gem?.loopmodsOwned || 0,
      
      // Combined totals
      combinedFarmFragsMultiplier: effects.farmFragments.multiplier,
      combinedFarmFragsAdditive: effects.farmFragments.additive,
      combinedCampaignFragsMultiplier: effects.campaignFragments.multiplier,
      combinedCampaignFragsAdditive: effects.campaignFragments.additive,
      combinedMissionSpeedMultiplier: effects.missionSpeedMultiplier,
    },
  };
});

// Update store when modifier value changes
function updateModifier(modifierId, value) {
  missionPlannerStore.updateModifier(modifierId, value);
}

// Get modifier value from store
function getModifierValue(modifierId) {
  return missionPlannerStore.modifierValues[modifierId];
}

function closeModal() {
  emit('close');
}

function resetToDefaults() {
  missionPlannerStore.resetModifiers();
}

// Handle ESC key
function handleKeydown(event) {
  if (event.key === 'Escape' && props.show) {
    closeModal();
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
