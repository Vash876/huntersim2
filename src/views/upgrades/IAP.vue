<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/IAPView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">In-App Purchases</h2>

      <!-- Grid mit IAPs -->
      <UpgradeGrid :loading="loading" :columns="3">
        <UpgradeCard
          v-for="purchase in iaps"
          :key="purchase.id"
          :item="purchase"
          :color="'gray'"
          :getLevel="getIAPValue"
          :toggleBoolean="toggleIAPBoolean"
        >
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            <div class="flex justify-between items-center py-1">
              <span class="text-gray-300 text-sm font-medium">IAP Status:</span>
              <span 
                class="ml-2 text-sm font-medium px-2 py-0.5 rounded"
                :class="getIAPValue({ id: purchase.id }) > 0 
                  ? 'text-green-300 bg-green-900/30' 
                  : 'text-red-300 bg-red-900/30'"
              >
                {{ getIAPValue({ id: purchase.id }) > 0 ? 'Purchased' : 'Not Purchased' }}
              </span>
            </div>

            <div class="mt-3 space-y-1.5">
              <div 
                v-for="hunter in HUNTERS"
                :key="`${purchase.id}-${hunter.id}`"
                class="flex justify-between items-center py-1"
              >
                <span class="text-gray-400 text-sm">
                  {{ hunter.name }} {{ purchase.multitext || 'Bonus' }}
                </span>
                <span 
                  class="font-medium text-sm"
                >
                  {{ getIAPValue({ id: purchase.id }) > 0 ? formatIAPValue(purchase) : '-' }}
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
import { getUpgrades } from '@/utils/upgradeUtils';
import { HUNTERS } from '@/constants/hunters';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();

// IAPs aus den Konstanten laden
const iaps = ref([]);
const loading = ref(true);
const category = 'iap'; // Die Kategorie dieser View

// Beim Mounten die IAPs laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle IAPs laden
    iaps.value = getUpgrades(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für IAP-Status (gekauft/nicht gekauft)
function getIAPValue(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

/**
 * Boolean-Toggle für IAPs (an/aus)
 */
function toggleIAPBoolean(item) {
  const currentValue = getIAPValue(item);
  const newValue = currentValue > 0 ? 0 : 1;
  hunterStore.updateUpgrade(category, item.id, newValue);
}

/**
 * Formatiert den Wert eines IAP-Items für die Anzeige
 */
function formatIAPValue(iap) {
  // Die meisten IAPs sind Multiplikatoren
  if (iap.value && iap.value >= 1) {
    return `x${iap.value.toFixed(2)}`;
  } 
  // Prozentuale Werte
  else if (iap.value && iap.value < 1) {
    return `+${(iap.value * 100).toFixed(0)}%`;
  }
  // Fallback
  return 'Active';
}
</script>