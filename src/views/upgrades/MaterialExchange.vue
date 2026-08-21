<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-6 text-center text-white md:hidden">Material Exchange</h2>

      <!-- Summary Box -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-xs text-gray-400 mb-1">Total Tyscon Drives</div>
          <div class="text-xl font-bold text-white">{{ totalTysconDrives }}</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-gray-400 mb-1">+0.4% Steps (÷75)</div>
          <div class="text-xl font-bold text-blue-400">{{ steps75 }}</div>
          <div class="text-xs text-gray-500">next in {{ nextMilestone75 }} Drives</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-gray-400 mb-1">×1.1 Steps (÷100)</div>
          <div class="text-xl font-bold text-purple-400">{{ steps100 }}</div>
          <div class="text-xs text-gray-500">next in {{ nextMilestone100 }} Drives</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-gray-400 mb-1">Total Loot Bonus</div>
          <div class="text-xl font-bold text-yellow-400">×{{ totalMultiplier.toFixed(3) }}</div>
          <div class="text-xs text-gray-500">+{{ (bonusPct * 100).toFixed(2) }}%</div>
        </div>
      </div>

      <!-- Material Cards -->
      <UpgradeGrid :loading="loading" :columns="3">
        <UpgradeCard
          v-for="mat in materials"
          :key="mat.id"
          :item="mat"
          color="gray"
          :getLevel="getMatLevel"
          :handleStart="handleStart"
          :handleEnd="handleEnd"
          :handleTouchMove="handleTouchMove"
          :increment="increment"
          :decrement="decrement"
          :incrementFast="incrementFast"
          :decrementFast="decrementFast"
        >
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Tyscon Drives per EDC</span>
              <span class="text-blue-300 font-medium text-sm">+{{ mat.value }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Tyscon Drives (total)</span>
              <span class="text-white font-bold text-sm">{{ getMatLevel({ id: mat.id }) * mat.value }}</span>
            </div>
          </div>
        </UpgradeCard>
      </UpgradeGrid>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { getUpgrades } from '@/utils/upgradeUtils';
import { useButtonControls } from '@/utils/useButtonControls';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

const hunterStore = useHunterStore();
const materials = ref([]);
const loading = ref(true);
const category = 'mats_exchange';

onMounted(() => {
  materials.value = getUpgrades(category);
  loading.value = false;
});

function getMatLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

function updateMatLevel(item, newLevel) {
  const mat = materials.value.find(m => m.id === item.id);
  if (!mat) return;
  const max = mat.maxLevel ?? Infinity;
  hunterStore.updateUpgrade(category, item.id, Math.min(Math.max(0, newLevel), max));
}

const totalTysconDrives = computed(() => {
  return materials.value.reduce((sum, mat) => {
    return sum + getMatLevel({ id: mat.id }) * mat.value;
  }, 0);
});

const steps75  = computed(() => Math.floor(totalTysconDrives.value / 75));
const steps100 = computed(() => Math.floor(totalTysconDrives.value / 100));

const nextMilestone75  = computed(() => 75  - (totalTysconDrives.value % 75)  || 75);
const nextMilestone100 = computed(() => 100 - (totalTysconDrives.value % 100) || 100);

// bonus = steps75 * 0.4% then multiplied by 1.1^steps100
const bonusPct = computed(() => steps75.value * 0.004 * Math.pow(1.1, steps100.value));
const totalMultiplier = computed(() => 1 + bonusPct.value);

const {
  handleStart,
  handleEnd,
  handleTouchMove,
  increment,
  decrement,
  incrementFast,
  decrementFast
} = useButtonControls({
  getLevel: getMatLevel,
  updateLevel: updateMatLevel
});
</script>
