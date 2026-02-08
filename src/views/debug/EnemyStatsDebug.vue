<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold" :class="hunterTitleClass">{{ activeHunter }} Enemy Stats</h1>
      </div>

      <!-- Hunter Tabs -->
      <div class="flex gap-1 mb-1">
        <button
          v-for="hunter in hunters"
          :key="hunter.id"
          @click="activeHunter = hunter.id"
          class="px-4 py-2 rounded-t-lg font-semibold transition-colors"
          :class="activeHunter === hunter.id 
            ? `${hunter.bgActive} ${hunter.textActive}` 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'"
        >
          {{ hunter.id }}
        </button>
      </div>

      <!-- Filter Controls -->
      <div class="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label class="text-sm text-gray-400 block mb-1">From Stage</label>
          <ToolValueControls
            :value="fromStage"
            :minValue="0"
            :maxValue="500"
            :step="10"
            :fastStep="100"
            @update:value="fromStage = $event"
          />
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">To Stage</label>
          <ToolValueControls
            :value="toStage"
            :minValue="1"
            :maxValue="500"
            :step="10"
            :fastStep="100"
            @update:value="toStage = $event"
          />
        </div>
        <div v-if="activeHunter === 'Knox'">
          <label class="text-sm text-gray-400 block mb-1">Presence of a God Level</label>
          <ToolValueControls
            :value="knoxPogLevel"
            :minValue="0"
            :maxValue="10"
            :step="1"
            :fastStep="5"
            @update:value="knoxPogLevel = $event"
          />
        </div>
      </div>

      <!-- Stats Table -->
      <div class="overflow-auto bg-gray-800 rounded-lg max-h-[75vh]">
        <table class="w-full text-sm">
          <thead class="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th class="px-3 py-2 text-left bg-gray-700">Stage</th>
              <th class="px-3 py-2 text-left bg-gray-700">Type</th>
              <th class="px-3 py-2 text-right bg-gray-700">HP</th>
              <th class="px-3 py-2 text-right bg-gray-700">ATK</th>
              <th class="px-3 py-2 text-right bg-gray-700">Regen</th>
              <th class="px-3 py-2 text-right bg-gray-700">DR%</th>
              <th class="px-3 py-2 text-right bg-gray-700">Evade%</th>
              <th class="px-3 py-2 text-right bg-gray-700">Effect%</th>
              <th class="px-3 py-2 text-right bg-gray-700">Crit%</th>
              <th class="px-3 py-2 text-right bg-gray-700">CritDmg</th>
              <th class="px-3 py-2 text-right bg-gray-700">AtkSpd</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="enemy in filteredEnemies" 
              :key="enemy.stage"
              :class="getRowClass(enemy)"
              class="border-b border-gray-700 hover:bg-gray-750"
            >
              <td class="px-3 py-2 font-mono" :class="enemy.isBoss ? 'font-bold' : ''">
                {{ enemy.stage }}
              </td>
              <td class="px-3 py-2">
                <span :class="getTypeClass(enemy)">{{ enemy.type }}</span>
              </td>
              <td class="px-3 py-2 text-right font-mono text-pink-400">{{ formatNumber(enemy.hp, 3) }}</td>
              <td class="px-3 py-2 text-right font-mono text-red-400">{{ formatNumber(enemy.atk, 3) }}</td>
              <td class="px-3 py-2 text-right font-mono text-green-400">{{ formatNumber(enemy.regen) }}</td>
              <td class="px-3 py-2 text-right font-mono text-amber-600">{{ ((1 - enemy.dr) * 100).toFixed(1) }}%</td>
              <td class="px-3 py-2 text-right font-mono text-yellow-200">{{ (enemy.evade * 100).toFixed(2) }}%</td>
              <td class="px-3 py-2 text-right font-mono text-blue-400">{{ (enemy.effect * 100).toFixed(1) }}%</td>
              <td class="px-3 py-2 text-right font-mono text-yellow-500">{{ (enemy.critRate * 100).toFixed(2) }}%</td>
              <td class="px-3 py-2 text-right font-mono text-orange-400">{{ enemy.critDmg.toFixed(2) }}x</td>
              <td class="px-3 py-2 text-right font-mono text-gray-300">{{ enemy.atkSpd.toFixed(3) }}s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ToolValueControls from '@/composables/ToolValueControls.vue';

// Hunter tabs
const hunters = [
  { id: 'Borge', bgActive: 'bg-red-900', textActive: 'text-red-400' },
  { id: 'Ozzy', bgActive: 'bg-green-900', textActive: 'text-green-400' },
  { id: 'Knox', bgActive: 'bg-blue-900', textActive: 'text-blue-400' }
];
const activeHunter = ref('Borge');

const hunterTitleClass = computed(() => {
  switch (activeHunter.value) {
    case 'Borge': return 'text-red-400';
    case 'Ozzy': return 'text-green-400';
    case 'Knox': return 'text-blue-400';
    default: return 'text-white';
  }
});

// Filter state
const fromStage = ref(400);
const knoxPogLevel = ref(0); // Presence of a God (reduces enemy ATK by 3% per level, max 10)
const toStage = ref(500);
const filterType = ref('all');

// ===== BORGE =====
function borgeMulti(enemyNum) {
  return Math.max(1, 1 +
    Math.max(0, (enemyNum - 149) * 0.006) +
    Math.max(0, (enemyNum - 199) * 0.006) +
    Math.max(0, (enemyNum - 249) * 0.006) +
    Math.max(0, (enemyNum - 299) * 0.006) +
    Math.max(0, (enemyNum - 309) * 0.003) +
    Math.max(0, (enemyNum - 319) * 0.003) +
    Math.max(0, (enemyNum - 329) * 0.004) +
    Math.max(0, (enemyNum - 339) * 0.004) +
    Math.max(0, (enemyNum - 349) * 0.005) +
    Math.max(0, (enemyNum - 359) * 0.005) +
    Math.max(0, (enemyNum - 369) * 0.006) +
    Math.max(0, (enemyNum - 379) * 0.006) +
    Math.max(0, (enemyNum - 389) * 0.007) +
    Math.max(0, (enemyNum - 400) * 0.005) +
    Math.max(0, (enemyNum - 410) * 0.005) +
    Math.max(0, (enemyNum - 420) * 0.005) +
    Math.max(0, (enemyNum - 430) * 0.004) +
    Math.max(0, (enemyNum - 440) * 0.004) +
    Math.max(0, (enemyNum - 450) * 0.004) +
    Math.max(0, (enemyNum - 460) * 0.004) +
    Math.max(0, (enemyNum - 470) * 0.004) +
    Math.max(0, (enemyNum - 480) * 0.004) +
    Math.max(0, (enemyNum - 490) * 0.004)
  ) * Math.pow(1.01, Math.max(0, enemyNum - 350));
}

function calculateBorgeEnemy(enemyNum) {
  const multiVal = borgeMulti(enemyNum);
  const floorDiv = Math.floor(Math.max(0, enemyNum - 1) / 100);
  const isBoss = enemyNum > 0 && enemyNum % 100 === 0;
  const is300 = enemyNum === 300;
  const is400 = enemyNum === 400;
  
  const hp = (9 + 4 * enemyNum) * multiVal * Math.pow(2.85, floorDiv) * (isBoss ? 90 : 1) * (is300 ? 0.9 : 1);
  const atk = (2.5 + 0.7 * enemyNum) * multiVal * Math.pow(2.85, floorDiv) * (isBoss ? 3.63 : 1) * (is300 ? 0.9 : 1);
  
  const critRate = Math.min(0.25, 0.0322 + 0.0004 * enemyNum + (isBoss ? 0.04 : 0));
  const critDmg = Math.min(2.5, 1.212 + 0.008 * enemyNum + (isBoss ? 0.25 : 0));
  
  let dr = 1;
  if (enemyNum >= 200) {
    dr = 1 - (Math.max(0, floorDiv - 2) * 0.02 + 0.04) - (isBoss ? 0.05 : 0);
  } else {
    dr = 1 - (isBoss ? 0.05 : 0);
  }
  
  let evade = 0;
  if (enemyNum >= 100) {
    evade = 0.004 + 0.004 * Math.max(0, floorDiv - 1);
  }
  
  let effect = 0;
  if (enemyNum >= 401) {
    effect = 0.055 + (isBoss ? 0.04 : 0);
  } else if (enemyNum >= 300) {
    effect = 0.04 + 0.01 * Math.max(0, floorDiv - 3) + (isBoss ? 0.04 : 0);
  }
  
  const regen = Math.max(0, 0.08 * Math.max(0, enemyNum - 1) * multiVal * Math.pow(1.052, floorDiv)) * (isBoss ? 1.92 : 1) * (is300 ? 0.9 : 1);
  const atkSpd = (4.526 - 0.006 * enemyNum) * (isBoss ? 2.42 : 1);
  
  let type = 'Normal';
  if (is400) type = 'Boss #400';
  else if (is300) type = 'Boss #300';
  else if (enemyNum === 200) type = 'Boss #200';
  else if (enemyNum === 100) type = 'Boss #100';
  else if (isBoss) type = `Boss #${enemyNum}`;
  
  return { stage: enemyNum, type, isBoss, hp, atk, critRate, critDmg, dr, evade, effect, regen, atkSpd };
}

// ===== OZZY =====
function ozzyMulti(enemyNum) {
  return Math.max(1, 1 +
    Math.max(0, (enemyNum - 149) * 0.006) +
    Math.max(0, (enemyNum - 199) * 0.006) +
    Math.max(0, (enemyNum - 249) * 0.006) +
    Math.max(0, (enemyNum - 299) * 0.006) +
    Math.max(0, (enemyNum - 309) * 0.003) +
    Math.max(0, (enemyNum - 319) * 0.003) +
    Math.max(0, (enemyNum - 329) * 0.004) +
    Math.max(0, (enemyNum - 339) * 0.004) +
    Math.max(0, (enemyNum - 349) * 0.005) +
    Math.max(0, (enemyNum - 359) * 0.005) +
    Math.max(0, (enemyNum - 369) * 0.006) +
    Math.max(0, (enemyNum - 379) * 0.006) +
    Math.max(0, (enemyNum - 389) * 0.007)
  ) * Math.pow(1.01, Math.max(0, enemyNum - 350));
}

function calculateOzzyEnemy(enemyNum) {
  const multiVal = ozzyMulti(enemyNum);
  const floorDiv = Math.floor(Math.max(0, enemyNum - 1) / 100);
  const isBoss = enemyNum > 0 && enemyNum % 100 === 0;
  const is300 = enemyNum === 300;
  
  const hp = (11 + 6 * enemyNum) * multiVal * Math.pow(2.9, floorDiv) * (isBoss ? 48 : 1) * (is300 ? 0.94 : 1);
  const atk = (1.35 + 0.75 * enemyNum) * multiVal * Math.pow(2.7, floorDiv) * (isBoss ? 3 : 1) * (is300 ? 0.94 : 1);
  
  const critRate = Math.min(0.25, 0.0994 + 0.0006 * enemyNum + (isBoss ? 0.1 : 0));
  const critDmg = Math.min(2.5, 1.03 + 0.008 * enemyNum);
  
  let dr = 1;
  if (enemyNum >= 200) {
    dr = 1 - (Math.max(0, floorDiv - 2) * 0.02 + 0.04) - (isBoss ? 0.05 : 0);
  } else {
    dr = 1 - (isBoss ? 0.05 : 0);
  }
  
  let evade = 0;
  if (enemyNum >= 100) {
    evade = 0.01 + 0.01 * Math.max(0, floorDiv - 1);
  }
  
  let effect = 0;
  if (enemyNum >= 300) {
    effect = 0.08 + 0.01 * Math.max(0, floorDiv - 3);
  }
  
  const regen = Math.max(0, -0.08 + 0.1 * enemyNum * multiVal * Math.pow(1.25, floorDiv)) * (isBoss ? 6 : 1) * (is300 ? 0.97 : 1);
  const atkSpd = (3.2 - 0.004 * enemyNum) * (isBoss ? 2.45 : 1);
  
  let type = 'Normal';
  if (is300) type = 'Boss #300';
  else if (enemyNum === 200) type = 'Boss #200';
  else if (enemyNum === 100) type = 'Boss #100';
  else if (isBoss) type = `Boss #${enemyNum}`;
  
  return { stage: enemyNum, type, isBoss, hp, atk, critRate, critDmg, dr, evade, effect, regen, atkSpd };
}

// ===== KNOX =====
function knoxMulti(enemyNum) {
  return Math.max(1, 1 + (enemyNum - 49) * 0.006 +
    Math.max(0, (enemyNum - 99) * 0.006) +
    Math.max(0, (enemyNum - 119) * 0.01) +
    Math.max(0, (enemyNum - 129) * 0.008) +
    Math.max(0, (enemyNum - 139) * 0.006) +
    Math.max(0, (enemyNum - 149) * 0.006) +
    Math.max(0, (enemyNum - 159) * 0.006) +
    Math.max(0, (enemyNum - 169) * 0.006) +
    Math.max(0, (enemyNum - 179) * 0.006) +
    Math.max(0, (enemyNum - 189) * 0.006) +
    Math.max(0, (enemyNum - 199) * 0.006) +
    Math.max(0, (enemyNum - 219) * 0.02) +
    Math.max(0, (enemyNum - 249) * 0.006) +
    Math.max(0, (enemyNum - 299) * 0.006) +
    Math.max(0, (enemyNum - 309) * 0.003) +
    Math.max(0, (enemyNum - 319) * 0.02) +
    Math.max(0, (enemyNum - 329) * 0.004) +
    Math.max(0, (enemyNum - 339) * 0.004) +
    Math.max(0, (enemyNum - 349) * 0.005) +
    Math.max(0, (enemyNum - 359) * 0.005) +
    Math.max(0, (enemyNum - 369) * 0.006) +
    Math.max(0, (enemyNum - 379) * 0.006) +
    Math.max(0, (enemyNum - 389) * 0.007)
  );
}

// ====== BALANCING VARIABLE ======
// Boss 200 Stat Reduction (0.1 = 10% weaker, 0.2 = 20% weaker, etc.)
const KNOX_BOSS_200_STAT_REDUCTION = 0;
// ================================

function calculateKnoxEnemy(enemyNum, pogLevel = 0) {
  const multiVal = knoxMulti(enemyNum);
  const floorDiv = Math.floor(Math.max(0, enemyNum - 1) / 100);
  const isBoss = enemyNum > 0 && enemyNum % 100 === 0;
  const is200 = enemyNum === 200;
  const boss200Mult = is200 ? (1 - KNOX_BOSS_200_STAT_REDUCTION) : 1;
  
  const hp = (7 + 9 * enemyNum) * multiVal * Math.pow(3.2, floorDiv) * (isBoss ? 120 : 1) * boss200Mult;
  const baseAtk = (2.4 + 1.4 * enemyNum) * multiVal * Math.pow(2.7, floorDiv) * (isBoss ? 4 : 1) * boss200Mult;
  const atk = baseAtk * (1 - pogLevel * 0.03); // Presence of a God: -3% ATK per level
  
  const critRate = Math.min(0.25, 0.0994 + 0.0006 * enemyNum + (isBoss ? 0.1 : 0));
  const critDmg = Math.min(2.5, 1.032 + 0.008 * enemyNum);
  
  let dr = 1;
  if (enemyNum >= 200) {
    dr = 1 - (Math.max(0, floorDiv - 2) * 0.02 + 0.04) - (isBoss ? 0.05 : 0);
  } else {
    dr = 1 - (isBoss ? 0.05 : 0);
  }
  
  const evade = 0.01;
  
  const regen = 0.04 * enemyNum * multiVal * Math.pow(1.4, floorDiv) * (isBoss ? 2 : 1) * boss200Mult;
  const atkSpd = (6.005 - 0.005 * enemyNum) * (isBoss ? 2.85 : 1);
  
  let type = 'Normal';
  if (enemyNum === 200) type = 'Boss #200';
  else if (enemyNum === 100) type = 'Boss #100';
  else if (isBoss) type = `Boss #${enemyNum}`;
  
  // Knox has no effect stat
  return { stage: enemyNum, type, isBoss, hp, atk, critRate, critDmg, dr, evade, effect: 0, regen, atkSpd };
}

// Generate enemies based on active hunter
const allEnemies = computed(() => {
  const enemies = [];
  
  for (let i = 1; i <= 500; i++) {
    if (activeHunter.value === 'Borge') {
      enemies.push(calculateBorgeEnemy(i));
    } else if (activeHunter.value === 'Ozzy') {
      enemies.push(calculateOzzyEnemy(i));
    } else {
      enemies.push(calculateKnoxEnemy(i, knoxPogLevel.value));
    }
  }
  return enemies;
});

// Filtered enemies
const filteredEnemies = computed(() => {
  return allEnemies.value.filter(e => {
    if (e.stage < fromStage.value || e.stage > toStage.value) return false;
    if (filterType.value === 'boss' && !e.isBoss) return false;
    if (filterType.value === 'normal' && e.isBoss) return false;
    return true;
  });
});

// Row class based on enemy type
function getRowClass(enemy) {
  if (enemy.isBoss) return 'bg-yellow-900/20';
  return '';
}

// Type badge class
function getTypeClass(enemy) {
  if (enemy.isBoss) return 'text-yellow-400 font-bold';
  return 'text-gray-400';
}

// Number formatting
function formatNumber(value, decimals = 2) {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }
  
  if (Math.abs(value) < 0.01) {
    return '0';
  }
  
  if (Math.abs(value) < 1) {
    return value.toFixed(decimals);
  }
  
  const absValue = Math.abs(value);
  const suffixes = ['','k','m','b','t','qa','qu','sx','sp','o','n','d'];
  
  let tier = Math.max(0, Math.min(Math.floor(Math.log10(absValue) / 3), suffixes.length - 1));
  
  if (absValue >= 1e36) {
    const exponent = Math.floor(Math.log10(absValue));
    const mantissa = value / Math.pow(10, exponent);
    return `${mantissa.toFixed(decimals)}e${exponent}`;
  }
  
  if (tier === 0) {
    return value.toFixed(decimals);
  }
  
  const suffix = suffixes[tier];
  const scaledValue = value / Math.pow(10, tier * 3);
  
  return `${scaledValue.toFixed(decimals)}${suffix}`;
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgb(55, 65, 81);
}
</style>
