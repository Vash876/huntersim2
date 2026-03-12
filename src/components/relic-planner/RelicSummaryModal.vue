<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[93vh] overflow-hidden animate-fade-in border border-gray-700 flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-3 border-b border-gray-600 flex justify-between items-center flex-shrink-0">
        <h3 class="text-lg font-bold text-white flex items-center">
          <IconShare size="18" class="mr-2 text-purple-400" />
          Relic Upgrade Summary
        </h3>
        <button @click="emit('close')" class="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
          <IconX size="16" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-3 space-y-3 overflow-y-auto flex-1">

        <!-- Summary Stats -->
        <div class="bg-gray-700/50 rounded-md p-3 border border-gray-600/50">
          <div class="grid grid-cols-3 gap-3">
            <div>
              <div class="text-xs text-gray-400 mb-0.5">TOTAL COST</div>
              <div class="text-sm text-amber-400 font-bold">{{ formatNumber(totalCost) }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 mb-0.5">TIME TO SAVE</div>
              <div class="text-sm font-bold" :class="timeClass">{{ formatTimeToSave }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 mb-0.5">UPGRADES</div>
              <div class="text-sm text-white font-bold">{{ plannedCount }}</div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2">
          <button
            @click="activeTab = 'upgrades'"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="activeTab === 'upgrades' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
          >Upgrades</button>
          <button
            @click="activeTab = 'statistics'"
            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            :class="activeTab === 'statistics' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
          >Statistics</button>
        </div>

        <!-- Grid Content -->
        <div class="bg-gray-700/30 rounded-md border border-gray-600/50 overflow-hidden">

          <!-- Tier 1 -->
          <div class="px-3 py-1 bg-green-900/20 border-b border-green-900/30 text-xs font-semibold text-green-400">Tier 1</div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2">
            <div
              v-for="relic in tier1Data" :key="relic.id"
              class="bg-gray-700/60 rounded-lg p-1 border transition-colors relative overflow-hidden"
              :class="relic.hasChanges && activeTab === 'upgrades' ? 'border-purple-500/50 bg-purple-900/10' : 'border-gray-600/30'"
            >
              <span class="absolute inset-0 flex items-center justify-center text-4xl font-anta text-white/[0.1] select-none pointer-events-none leading-none">{{ relic.label.slice(1) }}</span>
              <div class="flex items-center gap-1 mb-0.5">
                <img v-if="relic.imageUrl" :src="relic.imageUrl" :alt="relic.label" class="w-7 h-7 object-contain flex-shrink-0" />
                <span class="text-[11px] bg-gray-600/50 px-1.5 py-0.5 rounded font-mono flex-shrink-0 whitespace-nowrap ml-auto">
                  {{ relic.current }}<span class="text-gray-400">/{{ relic.max }}</span>
                </span>
              </div>
              <template v-if="activeTab === 'upgrades'">
                <template v-if="relic.hasChanges">
                  <div class="text-[11px] text-green-400 mt-1">→ Lvl {{ relic.target }}</div>
                  <div class="flex items-center justify-between mt-0.5">
                    <span class="text-[11px] text-amber-400">{{ formatNumber(relic.cost) }}</span>
                    <span class="text-[11px] text-blue-400">{{ formatIndividualTime(relic.cost) }}</span>
                  </div>
                </template>
              </template>
              <template v-else>
                <div v-if="relic.current > 0" class="flex items-center justify-between mt-1">
                  <span class="text-[11px] text-amber-400">{{ formatNumber(relic.spent) }}</span>
                  <span class="text-[11px] font-medium" :style="{ color: getPercentageColor(relic.percentage) }">{{ relic.percentage }}%</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Tier 2 -->
          <template v-if="powerGemLevel >= 3">
            <div class="px-3 py-1 bg-blue-900/20 border-y border-blue-900/30 text-xs font-semibold text-blue-400">Tier 2</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2">
              <div
                v-for="relic in tier2Data" :key="relic.id"
                class="bg-gray-700/60 rounded-lg p-1 border transition-colors relative overflow-hidden"
                :class="relic.hasChanges && activeTab === 'upgrades' ? 'border-purple-500/50 bg-purple-900/10' : 'border-gray-600/30'"
              >
                <span class="absolute inset-0 flex items-center justify-center text-4xl font-anta text-white/[0.1] select-none pointer-events-none leading-none">{{ relic.label.slice(1) }}</span>
                <div class="flex items-center gap-1 mb-0.5">
                  <img v-if="relic.imageUrl" :src="relic.imageUrl" :alt="relic.label" class="w-7 h-7 object-contain flex-shrink-0" />
                  <span class="text-[11px] bg-gray-600/50 px-1.5 py-0.5 rounded font-mono flex-shrink-0 whitespace-nowrap ml-auto">
                    {{ relic.current }}<span class="text-gray-400">/{{ relic.max }}</span>
                  </span>
                </div>
                <template v-if="activeTab === 'upgrades'">
                  <template v-if="relic.hasChanges">
                    <div class="text-[11px] text-green-400 mt-1">→ Lvl {{ relic.target }}</div>
                    <div class="flex items-center justify-between mt-0.5">
                      <span class="text-[11px] text-amber-400">{{ formatNumber(relic.cost) }}</span>
                      <span class="text-[11px] text-blue-400">{{ formatIndividualTime(relic.cost) }}</span>
                    </div>
                  </template>
                </template>
                <template v-else>
                  <div v-if="relic.current > 0" class="flex items-center justify-between mt-1">
                    <span class="text-[11px] text-amber-400">{{ formatNumber(relic.spent) }}</span>
                    <span class="text-[11px] font-medium" :style="{ color: getPercentageColor(relic.percentage) }">{{ relic.percentage }}%</span>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="px-3 py-1.5 bg-blue-900/20 border-t border-blue-900/30 text-xs font-semibold text-blue-400 flex items-center gap-2">
              <IconLock size="12" />
              Tier 2 — Requires Power Gem Level 3
            </div>
          </template>

          <!-- Tier 3 always locked -->
          <div class="px-3 py-1.5 bg-yellow-900/20 border-t border-yellow-900/30 text-xs font-semibold text-yellow-400 flex items-center gap-2">
            <IconLock size="12" />
            Tier 3 — Requires Power Gem Level 5
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IconX, IconShare, IconLock } from '@tabler/icons-vue';
import { useRelicPlannerStore } from '@/store/relicPlannerStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { RELICS, calculateTotalCost, getRelicMaxLevel as getRelicMaxLevelFromData } from '@/views/tools/mission-planner/constants/relics.js';
import { formatNumber } from '@/composables/format';

const props = defineProps({
  targetLevels: { type: Object, default: () => ({}) },
  totalCost:    { type: Number, default: 0 },
});

const emit = defineEmits(['close']);
const store = useRelicPlannerStore();
const gemPlannerStore = useGemPlannerStore();

const activeTab = ref('upgrades');

const powerGemLevel = computed(() => gemPlannerStore.gemStates?.power?.level || 0);

// ── Dynamic max level ─────────────────────────────────────────────────────────
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

// ── Icons ─────────────────────────────────────────────────────────────────────
const relicIcons = import.meta.glob('@/assets/relics/*.png', { eager: true, import: 'default' });
function getIconUrl(relicId) {
  const key = Object.keys(relicIcons).find(k => k.endsWith(`/${relicId}.png`));
  return key ? relicIcons[key] : null;
}

// ── Label ─────────────────────────────────────────────────────────────────────
function relicLabel(relic) {
  const match = relic.id.match(/t2r(\d+)/) || relic.id.match(/r(\d+)/);
  return `#${match?.[1] || relic.id}`;
}

// ── Spent fragments (from level 0 to current) ─────────────────────────────────
function spentFragments(relicId, currentLevel) {
  if (currentLevel <= 0) return 0;
  return calculateTotalCost(relicId, 0, currentLevel);
}

// ── Total spent for % calculation ────────────────────────────────────────────
const totalSpent = computed(() => {
  return Object.values(RELICS).reduce((sum, r) => {
    const lvl = store.currentLevels[r.id] || 0;
    return sum + spentFragments(r.id, lvl);
  }, 0);
});

// ── Build relic row data ──────────────────────────────────────────────────────
function buildRelicData(relic) {
  const relicItems = store.shoppingList.filter(i => i.relicId === relic.id);
  const current = store.currentLevels[relic.id] || 0;
  const target = relicItems.length > 0
    ? Math.max(...relicItems.map(i => i.toLevel))
    : current;
  const hasChanges = target > current;
  const cost = hasChanges ? relicItems.reduce((s, i) => s + (i.totalCost || 0), 0) : 0;
  const spent = spentFragments(relic.id, current);
  const percentage = totalSpent.value > 0 ? ((spent / totalSpent.value) * 100).toFixed(1) : '0.0';
  const max = getRelicMaxLevel(relic.id);
  return {
    id: relic.id,
    label: relicLabel(relic),
    imageUrl: getIconUrl(relic.id),
    current,
    target,
    hasChanges,
    cost,
    spent,
    percentage,
    max,
  };
}

const tier1Data = computed(() => Object.values(RELICS).filter(r => r.tier === 1).map(buildRelicData));
const tier2Data = computed(() => Object.values(RELICS).filter(r => r.tier === 2).map(buildRelicData));
const plannedCount = computed(() => [...tier1Data.value, ...tier2Data.value].filter(r => r.hasChanges).length);

// ── Time helpers ──────────────────────────────────────────────────────────────
const fragmentsPerDay = computed(() => store.settings.fragmentsPerDay || 0);

function formatDays(days) {
  if (!isFinite(days) || days > 36500) return '☠️';
  if (days <= 0) return 'Now';
  const d = Math.floor(days);
  const h = Math.round((days - d) * 24);
  if (d === 0) return `${h}h`;
  if (h === 0) return `${d}d`;
  return `${d}d ${h}h`;
}

function formatIndividualTime(cost) {
  if (!fragmentsPerDay.value) return 'N/A';
  const avail = store.getCurrentFragmentsWithProduction();
  const remaining = Math.max(0, cost - avail);
  if (remaining <= 0) return 'Now';
  return formatDays(remaining / fragmentsPerDay.value);
}

const formatTimeToSave = computed(() => {
  if (!fragmentsPerDay.value) return 'Set rate';
  const items = [...tier1Data.value, ...tier2Data.value].filter(r => r.hasChanges);
  if (!items.length) return '-';
  let cumDays = 0;
  let avail = store.getCurrentFragmentsWithProduction();
  for (const item of store.shoppingList) {
    const need = Math.max(0, item.totalCost - avail);
    const days = need / fragmentsPerDay.value;
    cumDays += days;
    avail = Math.max(0, avail - item.totalCost) + days * fragmentsPerDay.value;
  }
  return formatDays(cumDays);
});

const daysToSaveNum = computed(() => {
  if (!fragmentsPerDay.value || !store.shoppingList.length) return 0;
  let cumDays = 0;
  let avail = store.getCurrentFragmentsWithProduction();
  for (const item of store.shoppingList) {
    const need = Math.max(0, item.totalCost - avail);
    const days = need / fragmentsPerDay.value;
    cumDays += days;
    avail = Math.max(0, avail - item.totalCost) + days * fragmentsPerDay.value;
  }
  return cumDays;
});

const timeClass = computed(() => {
  const d = daysToSaveNum.value;
  if (d < 30) return 'text-white';
  if (d < 60) return 'text-yellow-400';
  return 'text-red-400';
});

function getPercentageColor(pct) {
  const p = parseFloat(pct);
  if (p >= 20) return '#f87171';
  if (p >= 10) return '#fb923c';
  if (p >= 5)  return '#facc15';
  return '#4ade80';
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
</style>

