<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/DiamondCardsView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">Diamond Cards</h2>

      <!-- Grid mit Cards -->
      <UpgradeGrid :loading="loading" :columns="3">
        <UpgradeCard
          v-for="card in diamondCards"
          :key="card.id"
          :item="card"
          :color="getCardColor(card)"
          :getLevel="getCardLevel"
          :toggleBoolean="toggleCardBoolean"
        >
          <!-- Card Bonuses -->
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            <div class="flex justify-between items-center py-1">
              <span class="text-gray-300 text-sm font-medium">Card Status:</span>
              <span 
                class="ml-2 text-sm font-medium px-2 py-0.5 rounded"
                :class="getCardLevel({ id: card.id }) > 0 
                  ? 'text-green-300 bg-green-900/30' 
                  : 'text-red-300 bg-red-900/30'"
              >
                {{ getCardLevel({ id: card.id }) > 0 ? 'Active' : 'Inactive' }}
              </span>
            </div>
            
            <!-- Bonus Values -->
            <div class="mt-3 space-y-1.5">
              <div 
                v-for="(bonus, index) in card.bonuses" 
                :key="`${card.id}-bonus-${index}`"
                class="flex justify-between items-center py-1"
              >
                <span class="text-gray-400 text-sm">{{ bonus.stat }}</span>
                <span 
                  class=" font-medium text-sm"
                >
                  {{ getCardLevel({ id: card.id }) > 0 ? formatBonusValue(bonus.value) : '-' }}
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

// Diamond Cards aus den Konstanten laden
const diamondCards = ref([]);
const loading = ref(true);
const category = 'diamondcards'; // Die Kategorie dieser View

// Beim Mounten die Diamond Cards laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Diamond Cards laden
    diamondCards.value = getUpgrades(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für Card-Status (aktiv/inaktiv)
function getCardLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

/**
 * Boolean-Toggle für Diamond Cards
 */
function toggleCardBoolean(item) {
  const currentValue = getCardLevel(item);
  const newValue = currentValue > 0 ? 0 : 1;
  hunterStore.updateUpgrade(category, item.id, newValue);
}

/**
 * Liefert die visuelle Farbe für eine Card
 */
function getCardColor(card) {
  return card.color || 'purple'; // Standard: Lila für Premium
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