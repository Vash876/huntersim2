<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">Construction Milestones</h2>

      <!-- Gesamtbonus aller aktiven CMs auf Hunter Loot Rewards -->
      <div class="bg-gray-800/50 rounded-lg p-3 mb-6 border border-gray-700/50 flex items-center justify-between">
        <span class="text-gray-300 text-sm font-medium">Total Hunter Loot Rewards Bonus</span>
        <span class="text-yellow-400 font-bold text-lg">×{{ totalLootBonus.toFixed(3) }}</span>
      </div>

      <!-- Grid mit Milestones -->
      <UpgradeGrid :loading="loading" :columns="3">
        <UpgradeCard
          v-for="milestone in constructionMilestones"
          :key="milestone.id"
          :item="milestone"
          :color="getMilestoneColor(milestone)"
          :getLevel="getMilestoneLevel"
          :handleStart="handleStart"
          :handleEnd="handleEnd"
          :handleTouchMove="handleTouchMove"
          :increment="increment"
          :decrement="decrement"
          :incrementFast="incrementFast"
          :decrementFast="decrementFast"
          :toggleBoolean="milestone.type === 'boolean' ? toggleMilestoneBoolean : undefined"
        >
          <!-- Milestone Bonuses -->
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            <!-- TS#17 Toggle nur für cm_ultima -->
            <div v-if="milestone.id === 'cm_ultimas'" class="flex justify-between items-center py-1 mb-2 border-b border-gray-700/50 pb-2">
              <span class="text-gray-300 text-sm font-medium">TS#17 Activated</span>
              <button
                @click="toggleTs17"
                class="relative inline-flex h-5 w-11 items-center rounded-full transition-all duration-300 focus:outline-none"
                :class="ts17Active
                  ? 'bg-gradient-to-r from-blue-700 to-blue-500 border border-blue-400/30'
                  : 'bg-gray-700/60 border border-gray-600/40'"
              >
                <span
                  class="relative inline-block h-3.5 w-3.5 transform rounded-full transition-all duration-300"
                  :class="ts17Active ? 'translate-x-[1.4rem] bg-white' : 'translate-x-1 bg-gray-500'"
                ></span>
              </button>
            </div>
            <!-- Milestone Status nur für Boolean-Milestones anzeigen -->
            <div 
              v-if="milestone.type === 'boolean'"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-300 text-sm font-medium">Milestone Status:</span>
              <span 
                class="ml-2 text-sm font-medium px-2 py-0.5 rounded"
                :class="getMilestoneLevel({ id: milestone.id }) > 0 
                  ? 'text-green-300 bg-green-900/30' 
                  : 'text-red-300 bg-red-900/30'"
              >
                {{ getMilestoneLevel({ id: milestone.id }) > 0 ? 'Active' : 'Inactive' }}
              </span>
            </div>
            
            <!-- Bonus Values -->
            <div class="mt-3 space-y-1.5">
              <!-- Boolean Milestones: Original Layout -->
              <div 
                v-if="milestone.type === 'boolean'"
                class="flex justify-between items-center py-1"
              >
                <span class="text-gray-400 text-sm">{{ milestone.multitext }}</span>
                <span class="font-medium text-sm">
                  {{ getMilestoneLevel({ id: milestone.id }) > 0 ? formatBonusValue(milestone.value) : '-' }}
                </span>
              </div>
              
              <!-- Numerische Milestones: Hunter-spezifische Anzeige -->
              <div 
                v-else-if="milestone.hunter === 'all'"
                v-for="hunter in HUNTERS"
                :key="`${milestone.id}-${hunter.id}`"
                class="flex justify-between items-center py-1"
              >
                <span class="text-gray-400 text-sm">
                  {{ hunter.name }} {{ milestone.description || milestone.multitext }}
                </span>
                <span 
                  class="text-white font-medium text-sm"
                  :class="{
                    'text-red-300': hunter.color === 'red',
                    'text-green-300': hunter.color === 'green', 
                    'text-blue-300': hunter.color === 'blue',
                    'text-purple-300': hunter.color === 'purple'
                  }"
                >
                  {{ formatMilestoneValue(milestone, getMilestoneLevel({ id: milestone.id })) }}
                </span>
              </div>
              
              <!-- Fallback für andere numerische Milestones (z.B. cm_ultima: value^level) -->
              <div 
                v-else-if="milestone.type !== 'boolean'"
                class="flex justify-between items-center py-1"
              >
                <span class="text-gray-400 text-sm">{{ milestone.multitext || milestone.description || 'Current Level' }}</span>
                <span class="font-medium text-sm text-white">
                  {{ formatNumberMilestoneValue(milestone, getMilestoneLevel({ id: milestone.id })) }}
                </span>
              </div>
            </div>
          </div>
        </UpgradeCard>
      </UpgradeGrid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { 
  getUpgrades, 
  getUpgradeColor 
} from '@/utils/upgradeUtils';
import { useButtonControls } from '@/utils/useButtonControls';
import { HUNTERS } from '@/constants/hunters';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Construction Milestones aus den Konstanten laden
const allConstructionMilestones = ref([]);
const loading = ref(true);
const category = 'cms'; // Die Kategorie dieser View

// Computed für verfügbare Construction Milestones basierend auf Gem-Leveln
const constructionMilestones = computed(() => {
  return allConstructionMilestones.value.filter(milestone => {
    // Prüfe ob das Milestone Unlock-Bedingungen hat
    if (!milestone.unlock_gem || !milestone.unlock_lvl) {
      return true; // Zeige Milestones ohne Unlock-Bedingungen immer an
    }

    // Hole den Gem-Status
    const gemState = gemPlannerStore.getGemState(milestone.unlock_gem);
    if (!gemState) {
      return false; // Gem existiert nicht
    }

    // Prüfe Gem-Level
    if (gemState.level < milestone.unlock_lvl) {
      return false; // Gem-Level zu niedrig
    }

    // Prüfe Gem-Node (falls angegeben)
    if (milestone.unlock_node !== undefined) {
      const nodeIndex = milestone.unlock_node - 1; // Node 4 = Index 3
      if (!gemState.nodes || !gemState.nodes[nodeIndex]) {
        return false; // Node nicht aktiviert
      }
    }

    return true; // Alle Bedingungen erfüllt
  });
});

// Beim Mounten die Construction Milestones laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Construction Milestones laden (ungefiltert)
    allConstructionMilestones.value = getUpgrades(category);
    try {
      const saved = JSON.parse(localStorage.getItem('cm_ultima_ts17'));
      if (saved !== null) ts17Active.value = saved;
    } catch (e) {}
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Gesamtbonus aller aktiven Loot-Reward-CMs
const totalLootBonus = computed(() => {
  let bonus = 1;
  for (const milestone of constructionMilestones.value) {
    if (milestone.multitext !== 'Hunter Loot Rewards') continue;
    if (milestone.id === 'cm_ultimas') continue;
    const level = getMilestoneLevel({ id: milestone.id });
    if (milestone.type === 'boolean' && level > 0 && milestone.value) {
      bonus *= milestone.value;
    } else if (milestone.type === 'number' && level > 0 && milestone.value) {
      bonus *= Math.pow(milestone.value, level);
    }
  }
  return bonus;
});

// Getter für Milestone-Status (aktiv/inaktiv)
function getMilestoneLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

const ts17Active = ref(false);

function toggleTs17() {
  ts17Active.value = !ts17Active.value;
  if (!ts17Active.value) {
    hunterStore.updateUpgrade(category, 'cm_ultimas', 0);
  }
  try { localStorage.setItem('cm_ultima_ts17', JSON.stringify(ts17Active.value)); } catch (e) {}
}

// Milestone Level aktualisieren (für numerische Milestones)
function updateMilestoneLevel(item, newLevel) {
  if (item.id === 'cm_ultimas' && !ts17Active.value) return;
  const milestone = allConstructionMilestones.value.find(m => m.id === item.id);
  if (!milestone) return;
  
  // Stelle sicher, dass der neue Wert innerhalb der Grenzen liegt
  const max = milestone.maxLevel ?? Infinity;
  const value = Math.min(Math.max(0, newLevel), max);
  
  // Update im Store
  hunterStore.updateUpgrade(category, item.id, value);
}

/**
 * Boolean-Toggle für Construction Milestones
 */
function toggleMilestoneBoolean(item) {
  const currentValue = getMilestoneLevel(item);
  const newValue = currentValue > 0 ? 0 : 1;
  hunterStore.updateUpgrade(category, item.id, newValue);
}

/**
 * Liefert die visuelle Farbe für ein Milestone
 */
function getMilestoneColor(milestone) {
  return 'gray'; // Grau für Construction Milestones (neutral)
}

/**
 * Formatiert den Bonuswert für die Anzeige
 */
function formatBonusValue(value) {
  if (value >= 1) {
    // Multiplikator: x1.05, x1.03 usw.
    return `x${value.toFixed(2)}`;
  } else {
    // Andere Werte als Prozent anzeigen
    return `+${(value * 100).toFixed(0)}%`;
  }
}

/**
 * Formatiert den Wert eines Construction Milestone
 * @param {Object} milestone - Das Milestone-Objekt
 * @param {number} level - Das aktuelle Level des Milestone
 * @returns {string} - Formatierter Wert
 */
function formatMilestoneValue(milestone, level) {
  if (level === 0) {
    return '-0.00';
  }
  
  // Pro 3 Milestones -0.01 Attack Speed
  const totalReduction = Math.floor(level / 3) * 0.01;
  return `-${totalReduction.toFixed(2)}`;
}

// value^level Multiplikator für numerische Milestones wie cm_ultima
function formatNumberMilestoneValue(milestone, level) {
  if (level <= 0) return '-';
  if (milestone.value) return `x${Math.pow(milestone.value, level).toFixed(3)}`;
  return level;
}

// useButtonControls initialisieren mit den richtigen Funktions-Signaturen
const {
  handleStart,
  handleEnd,
  handleTouchMove,
  increment,
  decrement,
  incrementFast,
  decrementFast
} = useButtonControls({
  getLevel: getMilestoneLevel,
  updateLevel: updateMilestoneLevel
});
</script>