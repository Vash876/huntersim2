<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-red-400">🐉 Borge Enemy Stats Debug</h1>
        <router-link to="/" class="text-gray-400 hover:text-white transition-colors">
          ← Zurück
        </router-link>
      </div>

      <!-- Filter Controls -->
      <div class="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label class="text-sm text-gray-400 block mb-1">Von Stage</label>
          <input 
            v-model.number="fromStage" 
            type="number" 
            min="1" 
            max="500"
            class="bg-gray-700 rounded px-3 py-2 w-24 text-white"
          />
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Bis Stage</label>
          <input 
            v-model.number="toStage" 
            type="number" 
            min="1" 
            max="500"
            class="bg-gray-700 rounded px-3 py-2 w-24 text-white"
          />
        </div>
        <div>
          <label class="text-sm text-gray-400 block mb-1">Filter</label>
          <select v-model="filterType" class="bg-gray-700 rounded px-3 py-2 text-white">
            <option value="all">Alle</option>
            <option value="boss">Nur Bosse</option>
            <option value="normal">Nur Normal</option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="exportCSV"
            class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded transition-colors"
          >
            📥 CSV Export
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div class="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 class="text-sm font-semibold text-gray-300 mb-2">Legende:</h3>
        <div class="flex flex-wrap gap-4 text-xs">
          <span class="text-yellow-400">🟡 Boss (jede 100. Stage)</span>
          <span class="text-blue-400">🔵 Boss #200: Bonus Attack</span>
          <span class="text-purple-400">🟣 Boss #300: Demonic Fury</span>
          <span class="text-red-400">🔴 Boss #400: Infernal Bulk + Fury</span>
        </div>
      </div>

      <!-- Stats Table -->
      <div class="overflow-auto bg-gray-800 rounded-lg max-h-[65vh]">
        <table class="w-full text-sm">
          <thead class="bg-gray-700 sticky top-0 z-10">
            <tr>
              <th class="px-3 py-2 text-left bg-gray-700">Stage</th>
              <th class="px-3 py-2 text-left bg-gray-700">Type</th>
              <th class="px-3 py-2 text-right bg-gray-700">HP</th>
              <th class="px-3 py-2 text-right bg-gray-700">ATK</th>
              <th class="px-3 py-2 text-right bg-gray-700">Crit%</th>
              <th class="px-3 py-2 text-right bg-gray-700">CritDmg</th>
              <th class="px-3 py-2 text-right bg-gray-700">DR%</th>
              <th class="px-3 py-2 text-right bg-gray-700">Evade%</th>
              <th class="px-3 py-2 text-right bg-gray-700">Effect%</th>
              <th class="px-3 py-2 text-right bg-gray-700">Regen</th>
              <th class="px-3 py-2 text-right bg-gray-700">AtkSpd</th>
              <th class="px-3 py-2 text-left bg-gray-700">Abilities</th>
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
              <td class="px-3 py-2 text-right font-mono text-green-400">{{ formatNumber(enemy.hp) }}</td>
              <td class="px-3 py-2 text-right font-mono text-red-400">{{ formatNumber(enemy.atk) }}</td>
              <td class="px-3 py-2 text-right font-mono text-yellow-400">{{ (enemy.critRate * 100).toFixed(2) }}%</td>
              <td class="px-3 py-2 text-right font-mono text-orange-400">{{ enemy.critDmg.toFixed(3) }}x</td>
              <td class="px-3 py-2 text-right font-mono text-blue-400">{{ ((1 - enemy.dr) * 100).toFixed(1) }}%</td>
              <td class="px-3 py-2 text-right font-mono text-purple-400">{{ (enemy.evade * 100).toFixed(2) }}%</td>
              <td class="px-3 py-2 text-right font-mono text-pink-400">{{ (enemy.effect * 100).toFixed(1) }}%</td>
              <td class="px-3 py-2 text-right font-mono text-teal-400">{{ formatNumber(enemy.regen) }}</td>
              <td class="px-3 py-2 text-right font-mono text-gray-300">{{ enemy.atkSpd.toFixed(3) }}s</td>
              <td class="px-3 py-2 text-xs">
                <div class="flex flex-wrap gap-1">
                  <span v-if="enemy.hasEnrage" class="bg-orange-600 px-1 rounded">Enrage</span>
                  <span v-if="enemy.hasBonusAttack" class="bg-blue-600 px-1 rounded">BonusAtk</span>
                  <span v-if="enemy.hasDemonicFury" class="bg-purple-600 px-1 rounded">Fury</span>
                  <span v-if="enemy.hasInfernalBulk" class="bg-red-600 px-1 rounded">InfBulk</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Stats Summary -->
      <div class="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">📊 Zusammenfassung (Stage {{ fromStage }} - {{ toStage }})</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="bg-gray-700 p-3 rounded">
            <div class="text-gray-400">Anzahl Enemies</div>
            <div class="text-xl font-bold">{{ filteredEnemies.length }}</div>
          </div>
          <div class="bg-gray-700 p-3 rounded">
            <div class="text-gray-400">Bosse</div>
            <div class="text-xl font-bold text-yellow-400">{{ bossCount }}</div>
          </div>
          <div class="bg-gray-700 p-3 rounded">
            <div class="text-gray-400">Max HP</div>
            <div class="text-xl font-bold text-green-400">{{ formatNumber(maxHp) }}</div>
          </div>
          <div class="bg-gray-700 p-3 rounded">
            <div class="text-gray-400">Max ATK</div>
            <div class="text-xl font-bold text-red-400">{{ formatNumber(maxAtk) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Filter state
const fromStage = ref(1);
const toStage = ref(500);
const filterType = ref('all');

// Multi function (same as evalBorge.ts)
function multi(enemyNum) {
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

// Calculate enemy stats (same formulas as evalBorge.ts)
function calculateEnemy(enemyNum) {
  const multiVal = multi(enemyNum);
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
  if (enemyNum >= 300) {
    effect = 0.04 + 0.01 * Math.max(0, floorDiv - 3) + (isBoss ? 0.04 : 0);
  }
  
  const regen = Math.max(0, 0.08 * Math.max(0, enemyNum - 1) * multiVal * Math.pow(1.052, floorDiv)) * (isBoss ? 1.92 : 1) * (is300 ? 0.9 : 1);
  const atkSpd = (4.526 - 0.006 * enemyNum) * (isBoss ? 2.42 : 1);
  
  // Determine type and abilities
  let type = 'Normal';
  if (is400) type = 'Boss #400';
  else if (is300) type = 'Boss #300';
  else if (enemyNum === 200) type = 'Boss #200';
  else if (enemyNum === 100) type = 'Boss #100';
  else if (isBoss) type = `Boss #${enemyNum}`;
  
  return {
    stage: enemyNum,
    type,
    isBoss,
    hp,
    atk,
    critRate,
    critDmg,
    dr,
    evade,
    effect,
    regen,
    atkSpd,
    hasEnrage: isBoss,
    hasBonusAttack: enemyNum >= 200 && isBoss,
    hasDemonicFury: enemyNum >= 300 && isBoss,
    hasInfernalBulk: enemyNum >= 400 && isBoss
  };
}

// Generate all enemies
const allEnemies = computed(() => {
  const enemies = [];
  for (let i = 1; i <= 500; i++) {
    enemies.push(calculateEnemy(i));
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

// Summary stats
const bossCount = computed(() => filteredEnemies.value.filter(e => e.isBoss).length);
const maxHp = computed(() => Math.max(...filteredEnemies.value.map(e => e.hp)));
const maxAtk = computed(() => Math.max(...filteredEnemies.value.map(e => e.atk)));

// Row class based on enemy type
function getRowClass(enemy) {
  if (enemy.stage === 400) return 'bg-red-900/30';
  if (enemy.stage === 300) return 'bg-purple-900/30';
  if (enemy.stage === 200) return 'bg-blue-900/30';
  if (enemy.stage === 100) return 'bg-yellow-900/30';
  if (enemy.isBoss) return 'bg-yellow-900/20';
  return '';
}

// Type badge class
function getTypeClass(enemy) {
  if (enemy.stage === 400) return 'text-red-400 font-bold';
  if (enemy.stage === 300) return 'text-purple-400 font-bold';
  if (enemy.stage === 200) return 'text-blue-400 font-bold';
  if (enemy.isBoss) return 'text-yellow-400 font-bold';
  return 'text-gray-400';
}

// Number formatting
function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

// CSV Export
function exportCSV() {
  const headers = ['Stage', 'Type', 'HP', 'ATK', 'CritRate', 'CritDmg', 'DR', 'Evade', 'Effect', 'Regen', 'AtkSpd', 'Abilities'];
  const rows = filteredEnemies.value.map(e => [
    e.stage,
    e.type,
    e.hp,
    e.atk,
    e.critRate,
    e.critDmg,
    1 - e.dr,
    e.evade,
    e.effect,
    e.regen,
    e.atkSpd,
    [e.hasEnrage && 'Enrage', e.hasBonusAttack && 'BonusAtk', e.hasDemonicFury && 'Fury', e.hasInfernalBulk && 'InfBulk'].filter(Boolean).join(', ')
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `borge_enemies_${fromStage.value}-${toStage.value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: rgb(55, 65, 81);
}
</style>
