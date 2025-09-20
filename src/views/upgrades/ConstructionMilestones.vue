<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-3xl font-bold mb-8 text-center text-white">Construction Milestones</h2>

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
              
              <!-- Fallback für andere numerische Milestones -->
              <div 
                v-else-if="milestone.type !== 'boolean'"
                class="flex justify-between items-center py-1"
              >
                <span class="text-gray-400 text-sm">{{ milestone.description || milestone.multitext || 'Current Level' }}</span>
                <span class="font-medium text-sm">
                  {{ getMilestoneLevel({ id: milestone.id }) }}
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
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für Milestone-Status (aktiv/inaktiv)
function getMilestoneLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Milestone Level aktualisieren (für numerische Milestones)
function updateMilestoneLevel(item, newLevel) {
  // Finde das Milestone-Objekt um Limits zu prüfen
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
  return 'purple'; // Lila für Construction Milestones
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