<template>
  <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-700 to-gray-800 p-2.5 border-b border-gray-600">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-white flex items-center">
          <IconAdjustments size="16" class="mr-2 text-purple-400" />
          Mission Modifiers
        </h2>
        <button
          @click="resetToDefaults"
          class="text-[10px] text-gray-400 hover:text-white px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Reset
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-gray-800/80 border-b border-gray-700/50 flex-shrink-0">
      <div class="flex overflow-x-auto">
        <button
          @click="activeTab = 'gameProgress'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] transition-colors duration-200 border-b-2 whitespace-nowrap"
          :class="activeTab === 'gameProgress' 
            ? 'bg-gray-700/50 text-white border-white' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
        >
          Progress
        </button>
        <button
          @click="activeTab = 'relics'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] transition-colors duration-200 border-b-2 whitespace-nowrap"
          :class="activeTab === 'relics' 
            ? 'bg-gray-700/50 text-purple-400 border-purple-500' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
        >
          Relics
        </button>
        <button
          @click="activeTab = 'badges'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] transition-colors duration-200 border-b-2 whitespace-nowrap"
          :class="activeTab === 'badges' 
            ? 'bg-gray-700/50 text-yellow-400 border-yellow-500' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
        >
          Badges
        </button>
        <button
          @click="activeTab = 'boons'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] transition-colors duration-200 border-b-2 whitespace-nowrap"
          :class="activeTab === 'boons' 
            ? 'bg-gray-700/50 text-red-500 border-red-500' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
        >
          Boons
        </button>
        <button
          @click="activeTab = 'inscryptions'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] transition-colors duration-200 border-b-2 whitespace-nowrap"
          :class="activeTab === 'inscryptions' 
            ? 'bg-gray-700/50 text-rose-400 border-rose-500' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
        >
          Inscryptions
        </button>
        <button
          @click="activeTab = 'gadgets'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] transition-colors duration-200 border-b-2 whitespace-nowrap"
          :class="activeTab === 'gadgets' 
            ? 'bg-gray-700/50 text-sky-400 border-sky-400' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
        >
          Gadgets
        </button>
        <button
          @click="activeTab = 'gems'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] transition-colors duration-200 border-b-2 whitespace-nowrap"
          :class="activeTab === 'gems' 
            ? 'bg-gray-700/50 text-blue-500 border-blue-500' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
        >
          Gems
        </button>
        <button
          @click="activeTab = 'other'"
          class="flex-1 px-2 py-2 font-semibold text-[11px] transition-colors duration-200 border-b-2 whitespace-nowrap"
          :class="activeTab === 'other' 
            ? 'bg-gray-700/50 text-gray-300 border-gray-400' 
            : 'text-gray-400 hover:text-white hover:bg-gray-700/30 border-transparent'"
        >
          Other
        </button>
      </div>
    </div>

    <!-- Content Area - 2 Column Grid -->
    <div class="flex-1 overflow-y-auto p-2">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
        <!-- Left Side: Effects Summary -->
        <div class="bg-gray-900/50 rounded-lg border border-gray-700/50 p-3">
          <h3 class="text-sm font-bold text-white mb-3 flex items-center">
            <div class="w-1 h-4 bg-indigo-500 rounded-r mr-2"></div>
            Modifier Effects
          </h3>

          <div class="space-y-3">
            <!-- Personnel Section -->
            <div class="space-y-2">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Personnel</h4>
              
              <!-- Personnel Table -->
              <div class="bg-gray-800/50 rounded overflow-hidden">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-gray-700/50">
                      <th class="text-left text-gray-400 font-semibold py-1.5 px-2">Type</th>
                      <th class="text-right text-gray-400 font-semibold py-1.5 px-2">Count</th>
                      <th class="text-right text-gray-400 font-semibold py-1.5 px-2">Ind. Pwr</th>
                      <th class="text-right text-gray-400 font-semibold py-1.5 px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors">
                      <td class="py-1.5 px-2 text-gray-300"><span class="text-red-400 font-semibold">T1</span> Mining Pod</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono">{{ calculatedEffects.t1Count }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-300 font-mono">{{ calculatedEffects.t1PowerPerUnit }}</td>
                      <td class="py-1.5 px-2 text-right text-white font-mono font-semibold">{{ calculatedEffects.t1Power }}</td>
                    </tr>
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors">
                      <td class="py-1.5 px-2 text-gray-300"><span class="text-orange-400 font-semibold">T2</span> Fireteam</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono">{{ calculatedEffects.t2Count }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-300 font-mono">{{ calculatedEffects.t2PowerPerUnit }}</td>
                      <td class="py-1.5 px-2 text-right text-white font-mono font-semibold">{{ calculatedEffects.t2Power }}</td>
                    </tr>
                    <tr class="border-b border-gray-700/30 hover:bg-gray-700/30 transition-colors">
                      <td class="py-1.5 px-2 text-gray-300"><span class="text-yellow-400 font-semibold">T3</span> Titan</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono">{{ calculatedEffects.t3Count }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-300 font-mono">{{ calculatedEffects.t3PowerPerUnit }}</td>
                      <td class="py-1.5 px-2 text-right text-white font-mono font-semibold">{{ calculatedEffects.t3Power }}</td>
                    </tr>
                    <tr class="hover:bg-gray-700/30 transition-colors">
                      <td class="py-1.5 px-2 text-gray-300"><span class="text-green-400 font-semibold">T4</span> Corvette</td>
                      <td class="py-1.5 px-2 text-right text-cyan-400 font-mono">{{ calculatedEffects.t4Count }}</td>
                      <td class="py-1.5 px-2 text-right text-gray-300 font-mono">{{ calculatedEffects.t4PowerPerUnit }}</td>
                      <td class="py-1.5 px-2 text-right text-white font-mono font-semibold">{{ calculatedEffects.t4Power }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="bg-gray-700/40 border-t border-gray-600">
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
            <div class="space-y-2 pt-2 border-t border-gray-700/50">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">Mission Effects</h4>
              
              <div class="bg-gray-800/50 rounded p-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-300">Mission Speed</span>
                  <span class="text-green-400 font-mono">{{ calculatedEffects.missionSpeed }}%</span>
                </div>
              </div>

              <div class="bg-gray-800/50 rounded p-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-300">Farm Fragments</span>
                  <span class="text-blue-400 font-mono">{{ calculatedEffects.farmFragmentsValue }}</span>
                </div>
              </div>

              <div class="bg-gray-800/50 rounded p-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-300">Campaign Fragments</span>
                  <span class="text-purple-400 font-mono">{{ calculatedEffects.campaignFragmentsValue }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Modifier Inputs -->
        <div>
          <!-- Game Progress Tab -->
          <div v-if="activeTab === 'gameProgress'" class="space-y-0.5">
            <div v-for="(modifier, index) in modifiers.gameProgress" :key="modifier.id" 
              class="flex items-center justify-between py-1.5 px-2 rounded"
              :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            >
              <label class="text-xs text-gray-300">{{ modifier.name }}</label>
              <ToolValueControls
                class="w-[160px]"
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="1"
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
              <label class="text-xs text-gray-300">{{ modifier.name }}</label>
              <ToolValueControls
                class="w-[160px]"
                :value="missionPlannerStore.modifierValues[modifier.id]"
                :min-value="modifier.min"
                :max-value="modifier.max"
                :step="1"
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
          <div class="w-3 h-3 rounded border flex items-center justify-center mr-2"
            :class="missionPlannerStore.modifierValues[modifier.id] 
              ? 'bg-green-600 border-green-600' 
              : 'bg-transparent border-gray-600'"
          >
            <span v-if="missionPlannerStore.modifierValues[modifier.id]" class="text-white text-[9px]">✓</span>
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
            :step="1"
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
          <label class="text-xs text-gray-300">{{ modifier.name }}</label>
          <ToolValueControls
            class="w-[160px]"
            :value="missionPlannerStore.modifierValues[modifier.id]"
            :min-value="modifier.min"
            :max-value="modifier.max"
            :step="1"
            :show-fast-controls="true"
            :tab-index="index + 1"
            :auto-edit="true"
            @update:value="updateModifier(modifier.id, $event)"
          />
        </div>
      </div>

      <!-- Gadgets Tab -->
      <div v-if="activeTab === 'gadgets'" class="space-y-0.5">
        <div v-for="(modifier, index) in modifiers.gadgets" :key="modifier.id" 
          class="flex items-center justify-between py-1.5 px-2 rounded"
          :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
        >
          <label class="text-xs text-gray-300">{{ modifier.name }}</label>
          <ToolValueControls
            class="w-[160px]"
            :value="missionPlannerStore.modifierValues[modifier.id]"
            :min-value="modifier.min"
            :max-value="modifier.max"
            :step="1"
            :show-fast-controls="true"
            :tab-index="index + 1"
            :auto-edit="true"
            @update:value="updateModifier(modifier.id, $event)"
          />
        </div>
      </div>

      <!-- Other Tab -->
      <div v-if="activeTab === 'other'" class="space-y-0.5">
        <!-- Boolean modifiers (checkboxes) -->
        <template v-for="(modifier, index) in modifiers.other" :key="modifier.id">
          <div v-if="modifier.type === 'boolean'" 
            class="flex items-center py-1.5 px-2 rounded cursor-pointer"
            :class="index % 2 === 0 ? 'bg-gray-700/40' : ''"
            @click="updateModifier(modifier.id, !missionPlannerStore.modifierValues[modifier.id])"
          >
            <div class="w-3 h-3 rounded border flex items-center justify-center mr-2"
              :class="missionPlannerStore.modifierValues[modifier.id] 
                ? 'bg-green-600 border-green-600' 
                : 'bg-transparent border-gray-600'"
            >
              <span v-if="missionPlannerStore.modifierValues[modifier.id]" class="text-white text-[9px]">✓</span>
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
          <div class="bg-gray-800/30 rounded p-2">
            <h5 class="text-xs font-semibold mb-1 flex items-center" style="color: #3b82f6;">
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: #3b82f6;"></span>
              Attraction Gem
            </h5>
            <div class="flex flex-wrap gap-1">
              <div v-for="modifier in gemsByType.attraction" :key="modifier.id" 
                class="px-1.5 py-0.5 rounded text-[10px]"
                :class="isGemNodeActive(modifier.id) ? 'bg-blue-900/40 text-white' : 'bg-gray-800/50 text-gray-500'"
              >
                <span class="w-1 h-1 rounded-full inline-block mr-0.5" 
                  :class="isGemNodeActive(modifier.id) ? 'bg-green-500' : 'bg-gray-600'"></span>
                {{ modifier.name }}
              </div>
            </div>
          </div>

          <!-- Creation Gem -->
          <div class="bg-gray-800/30 rounded p-2">
            <h5 class="text-xs font-semibold mb-1 flex items-center" style="color: #f97316;">
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: #f97316;"></span>
              Creation Gem
            </h5>
            <div class="space-y-1">
              <div class="flex flex-wrap gap-1">
                <div v-for="modifier in gemsByType.creation" :key="modifier.id" 
                  class="px-1.5 py-0.5 rounded text-[10px]"
                  :class="isGemNodeActive(modifier.id) ? 'bg-orange-900/40 text-white' : 'bg-gray-800/50 text-gray-500'"
                >
                  <span class="w-1 h-1 rounded-full inline-block mr-0.5" 
                    :class="isGemNodeActive(modifier.id) ? 'bg-green-500' : 'bg-gray-600'"></span>
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
          <div class="bg-gray-800/30 rounded p-2">
            <h5 class="text-xs font-semibold mb-1 flex items-center" style="color: #8b5cf6;">
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: #8b5cf6;"></span>
              Exodus Gem
            </h5>
            <div class="space-y-1">
              <div class="flex flex-wrap gap-1">
                <div v-for="modifier in gemsByType.exodus" :key="modifier.id" 
                  class="px-1.5 py-0.5 rounded text-[10px]"
                  :class="isGemNodeActive(modifier.id) ? 'bg-purple-900/40 text-white' : 'bg-gray-800/50 text-gray-500'"
                >
                  <span class="w-1 h-1 rounded-full inline-block mr-0.5" 
                    :class="isGemNodeActive(modifier.id) ? 'bg-green-500' : 'bg-gray-600'"></span>
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
                  :step="1000"
                  :show-fast-controls="true"
                  :tab-index="2"
                  :auto-edit="true"
                  @update:value="updateModifier('exodus_node_2_loopmods', $event)"
                />
              </div>
            </div>
          </div>

          <!-- Power Gem -->
          <div class="bg-gray-800/30 rounded p-2">
            <h5 class="text-xs font-semibold mb-1 flex items-center" style="color: #8b5cf6;">
              <span class="w-1.5 h-1.5 rounded-full mr-1.5" style="background-color: #8b5cf6;"></span>
              Power Gem
            </h5>
            <div class="flex flex-wrap gap-1">
              <div v-for="modifier in gemsByType.power" :key="modifier.id" 
                class="px-1.5 py-0.5 rounded text-[10px]"
                :class="isGemNodeActive(modifier.id) ? 'bg-purple-900/40 text-white' : 'bg-gray-800/50 text-gray-500'"
              >
                <span class="w-1 h-1 rounded-full inline-block mr-0.5" 
                  :class="isGemNodeActive(modifier.id) ? 'bg-green-500' : 'bg-gray-600'"></span>
                {{ modifier.name }}
              </div>
            </div>
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
import { IconAdjustments } from '@tabler/icons-vue';
import { MODIFIERS } from '@/constants/mission-planner/modifiers';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { useHunterStore } from '@/store/hunterStore';
import ToolValueControls from '@/composables/ToolValueControls.vue';

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
  'power_node_1': { gemId: 'power', nodeIndex: 0 },
  'power_node_2': { gemId: 'power', nodeIndex: 1 },
  'power_node_3': { gemId: 'power', nodeIndex: 2 },
  'power_node_4': { gemId: 'power', nodeIndex: 3 },
  'power_node_5': { gemId: 'power', nodeIndex: 4 }
};

// Check if a gem node is active
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

function resetToDefaults() {
  missionPlannerStore.resetModifiers();
}
</script>
