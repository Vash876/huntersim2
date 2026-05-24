<template>
  <div>
    <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
      <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8 border border-gray-800/80">
        <!-- Header -->
        <h2 class="text-xl sm:text-2xl font-bold mb-4 text-center text-white md:hidden">
          Diamond Ultima Calculator
        </h2>

        <!-- TR Count + Milestone Progress -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
          <div class="bg-gradient-to-r from-gray-700/60 to-gray-800/40 px-3 py-2 border-b border-gray-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-4">
              <h3 class="text-sm font-semibold text-white flex items-center">
                <IconAbacus size="16" class="mr-1.5 text-blue-400" />
                TR Count
              </h3>
              <TRValueControls
                :value="ultimaStore.trCount || 0"
                :maxValue="999"
                :minValue="1"
                :step="1"
                :fastStep="10"
                :showFastControls="true"
                @update:value="updateTrCount"
              />
            </div>

            <!-- Milestone progress + Reset -->
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-400">Total Levels:</span>
              <span class="text-sm font-bold text-white">{{ totalLevels }}</span>
              <span class="text-gray-600">/</span>
              <span class="text-sm text-gray-400">{{ nextMilestone }}</span>
              <div class="w-28 bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div
                  class="bg-blue-500 h-full rounded-full transition-all duration-300"
                  :style="{ width: `${totalLevelsProgress}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500">+{{ nextMilestone - totalLevels }} to milestone</span>
              <button
                @click="resetForm"
                class="ml-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 text-xs rounded-lg flex items-center transition-colors"
              >
                <IconRefresh size="13" class="mr-1" />
                Reset Targets
              </button>
            </div>
          </div>
        </div>

        <!-- Upgrade Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <div
            v-for="(upgradeInfo, upgradeType) in upgradesList"
            :key="upgradeType"
            class="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden shadow-lg flex flex-col"
            :class="[
              isUpgradeLocked(upgradeType) ? 'opacity-40' : '',
              upgradeType === 'loot' ? 'lg:col-start-2' : ''
            ]"
          >
            <!-- Card Header -->
            <div
              class="px-3 py-2.5 border-b border-gray-700/40 flex items-center justify-between"
              :class="upgradeInfo.headerClass"
            >
              <div class="flex items-center gap-2">
                <div
                  v-if="upgradeType === 'loot'"
                  class="w-5 h-5 flex-shrink-0"
                  :style="{
                    backgroundColor: '#CEFF7B',
                    WebkitMask: `url(${getIconUrl(upgradeType)}) no-repeat center`,
                    mask: `url(${getIconUrl(upgradeType)}) no-repeat center`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain'
                  }"
                ></div>
                <img v-else :src="getIconUrl(upgradeType)" :alt="upgradeInfo.label" class="w-5 h-5 flex-shrink-0">
                <span class="font-bold text-sm text-white">{{ upgradeInfo.label }}</span>
              </div>
              <span
                class="text-[10px] font-mono px-1.5 py-0.5 rounded"
                :class="{
                  'bg-gray-800/60 text-gray-400': typeof ultimaStore.upgradeCaps[upgradeType] === 'number',
                  'bg-red-900/50 text-red-400': ultimaStore.upgradeCaps[upgradeType] === 'LOCKED'
                }"
              >Max: {{ ultimaStore.upgradeCaps[upgradeType] }}</span>
            </div>

            <!-- Card Body: Current + Target side by side -->
            <div class="p-3 flex-1">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <div class="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Current</div>
                  <TRValueControls
                    :value="(ultimaStore.currentLevels && ultimaStore.currentLevels[upgradeType]) || 0"
                    :maxValue="typeof ultimaStore.upgradeCaps[upgradeType] === 'number' ? ultimaStore.upgradeCaps[upgradeType] : 999"
                    :minValue="0"
                    :step="1"
                    :fastStep="10"
                    :disabled="ultimaStore.isUpgradeLocked(upgradeType)"
                    @update:value="(newVal) => updateCurrentLevel(upgradeType, newVal)"
                    :autoEdit="true"
                  />
                </div>
                <div>
                  <div class="text-[10px] text-gray-500 uppercase tracking-wide mb-1">Target</div>
                  <TRValueControls
                    :value="(ultimaStore.targetLevels && ultimaStore.targetLevels[upgradeType]) || 0"
                    :maxValue="typeof ultimaStore.upgradeCaps[upgradeType] === 'number' ? ultimaStore.upgradeCaps[upgradeType] : 999"
                    :minValue="0"
                    :buttonMinValue="(ultimaStore.currentLevels && ultimaStore.currentLevels[upgradeType]) || 0"
                    :step="1"
                    :fastStep="10"
                    :disabled="ultimaStore.isUpgradeLocked(upgradeType)"
                    @update:value="(newVal) => updateTargetLevel(upgradeType, newVal)"
                    @blur="finalizeTargetLevel(upgradeType)"
                    :valueClass="((ultimaStore.targetLevels && ultimaStore.targetLevels[upgradeType]) || 0) > ((ultimaStore.currentLevels && ultimaStore.currentLevels[upgradeType]) || 0) ? 'text-green-400' : 'text-white'"
                    :autoEdit="true"
                    :disableDecrement="((ultimaStore.targetLevels && ultimaStore.targetLevels[upgradeType]) || 0) <= ((ultimaStore.currentLevels && ultimaStore.currentLevels[upgradeType]) || 0)"
                  />
                </div>
              </div>
            </div>

            <!-- Card Footer: Bonus + Gain + Cost -->
            <div class="border-t border-gray-700/40 bg-gray-900/40 px-3 py-2 space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Bonus</span>
                <div class="flex items-center gap-1">
                  <span class="text-blue-400">{{ formatBonus(ultimaStore.currentBonuses[upgradeType], upgradeType) }}</span>
                  <template v-if="ultimaStore.targetBonuses[upgradeType] > ultimaStore.currentBonuses[upgradeType]">
                    <span class="text-gray-700">→</span>
                    <span class="text-green-400">{{ formatBonus(ultimaStore.targetBonuses[upgradeType], upgradeType) }}</span>
                  </template>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Gain</span>
                <span
                  :class="{
                    'text-green-400 font-medium': ultimaStore.bonusGains[upgradeType] > 1,
                    'text-gray-500': ultimaStore.bonusGains[upgradeType] === 1
                  }"
                >{{ formatFactor(ultimaStore.bonusGains[upgradeType]) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-700/30">
                <span class="text-gray-500">Cost</span>
                <span
                  :class="{
                    'text-amber-400 font-medium': typeof ultimaStore.upgradeCosts[upgradeType] === 'number' && ultimaStore.upgradeCosts[upgradeType] > 0,
                    'text-gray-600': ultimaStore.upgradeCosts[upgradeType] === 0,
                    'text-gray-500': ultimaStore.upgradeCosts[upgradeType] === 'MAX',
                    'text-red-400': ultimaStore.upgradeCosts[upgradeType] === 'LOCKED'
                  }"
                >{{ formatCost(ultimaStore.upgradeCosts[upgradeType]) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom bar: Total Cost -->
        <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 px-3 py-2.5 flex items-center justify-end">
          <div class="flex items-center gap-3">
            <span class="text-xs text-gray-400 uppercase tracking-wide">Total Diamond Cost</span>
            <span
              class="text-base font-bold"
              :class="ultimaStore.totalCost > 0 ? 'text-amber-400' : 'text-gray-500'"
            >
              {{ formatCost(ultimaStore.totalCost) || '—' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUltimaStore } from '@/store/ultimaStore';
import { 
  IconAbacus, 
  IconArrowUpCircle,
  IconRefresh,
} from '@tabler/icons-vue';
import TRValueControls from '@/composables/TRValueControls.vue';

// Import resource icons
import cellsIcon from '@/assets/general/cells.png';
import mpIcon from '@/assets/general/mp.png';
import shardsIcon from '@/assets/general/shards.png';
import rpIcon from '@/assets/general/rp.png';
import apIcon from '@/assets/general/ap.png';
import matsIcon from '@/assets/general/mats.png';
import lootIcon from '@/assets/general/loot.png';

const ultimaStore = useUltimaStore();

// Milestone tracking
const totalLevels = computed(() => {
  const levels = ultimaStore.currentLevels || {};
  return Object.values(levels).reduce((sum, v) => sum + (v || 0), 0);
});

const nextMilestone = computed(() => Math.ceil((totalLevels.value + 1) / 50) * 50);

const totalLevelsProgress = computed(() => {
  const current = totalLevels.value % 50;
  return current === 0 && totalLevels.value > 0 ? 100 : (current / 50) * 100;
});

// Upgrade list with accent colors and card header gradients per resource
const upgradesList = {
  cells: { label: 'Cells',  accentClass: 'bg-green-500',  headerClass: 'bg-gradient-to-r from-green-900/60 to-gray-800/40'  },
  mp:    { label: 'MP',     accentClass: 'bg-red-500',    headerClass: 'bg-gradient-to-r from-red-900/60 to-gray-800/40'    },
  shards:{ label: 'Shards', accentClass: 'bg-blue-400',   headerClass: 'bg-gradient-to-r from-blue-900/60 to-gray-800/40'   },
  rp:    { label: 'RP',     accentClass: 'bg-amber-500',  headerClass: 'bg-gradient-to-r from-amber-900/60 to-gray-800/40'  },
  ap:    { label: 'AP',     accentClass: 'bg-indigo-500', headerClass: 'bg-gradient-to-r from-indigo-900/60 to-gray-800/40' },
  mats:  { label: 'Mats',   accentClass: 'bg-orange-300', headerClass: 'bg-gradient-to-r from-orange-900/60 to-gray-800/40' },
  loot:  { label: 'Loot',   accentClass: 'bg-lime-400',   headerClass: 'bg-gradient-to-r from-lime-900/60 to-gray-800/40'   },
};

// Actions
function updateTrCount(newValue) {
  ultimaStore.updateTRCount(Math.max(1, Math.min(999, newValue)));
}

function updateCurrentLevel(type, newValue) {
  const cap = typeof ultimaStore.upgradeCaps[type] === 'number' ? ultimaStore.upgradeCaps[type] : 999;
  const clamped = Math.max(0, Math.min(cap, newValue));
  ultimaStore.updateCurrentLevel(type, clamped);
  if ((ultimaStore.targetLevels[type] || 0) < clamped) {
    ultimaStore.updateTargetLevel(type, clamped);
  }
}

function updateTargetLevel(type, newValue) {
  const currentLevel = ultimaStore.currentLevels[type] || 0;
  if (newValue >= currentLevel || document.activeElement.classList.contains('value-display')) {
    ultimaStore.updateTargetLevel(type, newValue);
  } else {
    ultimaStore.updateTargetLevel(type, currentLevel);
  }
}

function finalizeTargetLevel(type) {
  const currentValue = ultimaStore.currentLevels[type] || 0;
  const cap = typeof ultimaStore.upgradeCaps[type] === 'number' ? ultimaStore.upgradeCaps[type] : 999;
  ultimaStore.updateTargetLevel(type, Math.max(currentValue, Math.min(cap, ultimaStore.targetLevels[type] || 0)));
}

function resetForm() {
  Object.keys(upgradesList).forEach(type => {
    ultimaStore.updateTargetLevel(type, ultimaStore.currentLevels[type] || 0);
  });
}

function isUpgradeLocked(type) {
  return ultimaStore.isUpgradeLocked(type);
}

function getIconUrl(upgradeType) {
  const iconMap = { cells: cellsIcon, mp: mpIcon, shards: shardsIcon, rp: rpIcon, ap: apIcon, mats: matsIcon, loot: lootIcon };
  return iconMap[upgradeType] || '';
}

// Tab index helpers
function getTabIndexForCurrentLevel(upgradeType) {
  return Object.keys(upgradesList).indexOf(upgradeType) + 1;
}

function getTabIndexForTargetLevel(upgradeType) {
  const types = Object.keys(upgradesList);
  return types.length + types.indexOf(upgradeType) + 1;
}

// Formatters
function formatCost(cost) {
  if (typeof cost !== 'number') return cost;
  if (cost === 0) return '—';
  if (cost >= 1000000) return (Math.floor(cost / 10000) / 100) + 'm';
  if (cost >= 10000) return (Math.floor(cost / 100) / 10) + 'k';
  return cost;
}

function formatBonus(bonus, upgradeType) {
  if (typeof bonus !== 'number') return bonus;
  return 'x' + bonus.toFixed(upgradeType === 'loot' ? 4 : 2);
}

function formatFactor(factor) {
  if (typeof factor !== 'number') return factor;
  return 'x' + factor.toFixed(4);
}

onMounted(() => {
  ultimaStore.initializeStore();
});
</script>

<style scoped>
:deep(.value-controls) {
  height: 1.9rem;
  width: 5.5rem;
  margin: 0 auto;
  display: inline-flex;
}

:deep(.value-controls .value-display) {
  font-size: 0.875rem;
}

:deep(.value-controls .control-button) {
  width: 1.6rem;
  height: 1.6rem;
}
</style>