<template>
  <div class="flex flex-col gap-3">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-700/70 to-gray-800/70 rounded-xl p-2.5 flex items-center gap-2">
      <IconAdjustments :size="16" class="text-purple-400" />
      <h2 class="text-sm font-bold text-white">Mission Modifiers</h2>
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
            <div class="flex items-center gap-1.5 text-xs text-gray-300">
              <IconPlus v-if="modifier.icon === 'IconPlus'" :size="14" class="text-red-500" />
              <img v-else-if="modifier.icon && !modifier.icon.startsWith('Icon')" :src="getModifierIconUrl(modifier.icon)" class="w-3.5 h-3.5" />
              {{ modifier.name }}
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
          v-for="modifier in modifiers.relics" 
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
          v-for="modifier in modifiers.mods" 
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
        </div>
      </template>

      <!-- Gadgets Tab -->
      <template v-if="activeTab === 'gadgets'">
        <div 
          v-for="modifier in modifiers.gadgets" 
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
        <template v-for="modifier in modifiers.other" :key="modifier.id">
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
              <span class="text-red-400 font-semibold">T1</span>
              <span class="text-cyan-400 font-mono">{{ calculatedEffects.t1Count }}</span>
            </div>
            <div class="text-[9px] text-gray-500">Pwr: {{ calculatedEffects.t1Power }}</div>
          </div>
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-orange-400 font-semibold">T2</span>
              <span class="text-cyan-400 font-mono">{{ calculatedEffects.t2Count }}</span>
            </div>
            <div class="text-[9px] text-gray-500">Pwr: {{ calculatedEffects.t2Power }}</div>
          </div>
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-yellow-400 font-semibold">T3</span>
              <span class="text-cyan-400 font-mono">{{ calculatedEffects.t3Count }}</span>
            </div>
            <div class="text-[9px] text-gray-500">Pwr: {{ calculatedEffects.t3Power }}</div>
          </div>
          <div class="bg-gray-800/70 rounded p-2 border border-gray-700/30">
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-green-400 font-semibold">T4</span>
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
import { ref, computed } from 'vue';
import { IconAdjustments, IconPlus, IconBrandSpeedtest } from '@tabler/icons-vue';
import { useMissionPlannerStore } from '@/store/missionPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { formatNumber } from '@/composables/format';
import ToolValueControls from '@/composables/ToolValueControls.vue';
import { MODIFIERS } from '../constants/modifiers';

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

const activeTab = ref('gameProgress');

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

// Gems grouped by type (filter for readonly gem nodes only)
const gemsByType = computed(() => {
  const gems = modifiers.gems || [];
  const readonlyGems = gems.filter(m => m.type === 'readonly');
  return {
    attraction: readonlyGems.filter(m => m.id.startsWith('attraction_')),
    creation: readonlyGems.filter(m => m.id.startsWith('creation_')),
    exodus: readonlyGems.filter(m => m.id.startsWith('exodus_')),
    power: readonlyGems.filter(m => m.id.startsWith('power_')),
  };
});

// Check if gem node is active
function isGemNodeActive(nodeId) {
  return missionPlannerStore.modifierValues[nodeId] === true;
}

// Get the correct URL for a modifier icon
function getModifierIconUrl(iconPath) {
  return MODIFIER_ICON_MAP[iconPath] || '';
}

// Update modifier
function updateModifier(id, value) {
  missionPlannerStore.updateModifier(id, value);
}

// Default breakdown values
const defaultBreakdown = {
  t1: { count: 0, powerPerUnit: 0, totalPower: 0 },
  t2: { count: 0, powerPerUnit: 0, totalPower: 0 },
  t3: { count: 0, powerPerUnit: 0, totalPower: 0 },
  t4: { count: 0, powerPerUnit: 0, totalPower: 0 },
  total: { count: 0, totalPower: 0 }
};

// Calculated effects from store
const calculatedEffects = computed(() => {
  const effects = missionPlannerStore.calculatedEffects || {};
  const breakdown = missionPlannerStore.personnelBreakdown || defaultBreakdown;
  
  return {
    t1Count: formatNumber(breakdown.t1?.count || 0),
    t1PowerPerUnit: (breakdown.t1?.powerPerUnit || 0).toFixed(1),
    t1Power: formatNumber(breakdown.t1?.totalPower || 0),
    t2Count: formatNumber(breakdown.t2?.count || 0),
    t2PowerPerUnit: (breakdown.t2?.powerPerUnit || 0).toFixed(1),
    t2Power: formatNumber(breakdown.t2?.totalPower || 0),
    t3Count: formatNumber(breakdown.t3?.count || 0),
    t3PowerPerUnit: (breakdown.t3?.powerPerUnit || 0).toFixed(1),
    t3Power: formatNumber(breakdown.t3?.totalPower || 0),
    t4Count: formatNumber(breakdown.t4?.count || 0),
    t4PowerPerUnit: (breakdown.t4?.powerPerUnit || 0).toFixed(1),
    t4Power: formatNumber(breakdown.t4?.totalPower || 0),
    totalCount: formatNumber(breakdown.total?.count || 0),
    totalPower: formatNumber(breakdown.total?.totalPower || 0),
    missionSpeed: formatNumber((effects.missionSpeedMultiplier || 0) * 100),
    farmFragmentsValue: formatNumber(effects.farmFragments || 0),
    campaignFragmentsValue: formatNumber(effects.campaignFragments || 0),
  };
});
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
