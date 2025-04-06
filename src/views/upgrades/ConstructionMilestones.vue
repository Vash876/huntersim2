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
          :toggleBoolean="toggleMilestoneBoolean"
        >
          <!-- Milestone Bonuses -->
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            <div class="flex justify-between items-center py-1">
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
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-400 text-sm">{{ milestone.multitext }}</span>
                <span class="font-medium text-sm">
                  {{ getMilestoneLevel({ id: milestone.id }) > 0 ? formatBonusValue(milestone.value) : '-' }}
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
import { ref, onMounted } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { 
  getUpgrades, 
  getUpgradeColor 
} from '@/utils/upgradeUtils';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();

// Construction Milestones aus den Konstanten laden
const constructionMilestones = ref([]);
const loading = ref(true);
const category = 'cms'; // Die Kategorie dieser View

// Beim Mounten die Construction Milestones laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Construction Milestones laden
    constructionMilestones.value = getUpgrades(category);
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
</script>