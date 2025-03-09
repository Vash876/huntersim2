<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/GadgetsView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-3xl font-bold mb-8 text-center text-white">Gadgets</h2>

      <!-- Grid mit Upgrades -->
      <UpgradeGrid :loading="loading" :columns="3">
        <UpgradeCard
          v-for="gadget in gadgets"
          :key="gadget.id"
          :item="gadget"
          :color="getGadgetColor(gadget)"
          :getLevel="getGadgetLevel"
          :handleStart="handleStart"
          :handleEnd="handleEnd"
          :handleTouchMove="handleTouchMove"
          :increment="increment"
          :decrement="decrement"
          :incrementFast="incrementFast"
          :decrementFast="decrementFast"
        >
          <!-- Effekt-Box mit einer Zeile pro Statistik -->
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            <div 
              v-for="(stat, statKey) in gadget.stats" 
              :key="`${gadget.id}-${statKey}`"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ stat.name }}
              </span>
              <span class="text-white font-medium text-sm">
                {{ calculateGadgetValue(gadget, statKey, getGadgetLevel({ id: gadget.id })) }}
              </span>
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
  getUpgradeColor, 
  calculateGadgetValue
} from '@/utils/upgradeUtils';
import { useButtonControls } from '@/utils/useButtonControls.js';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();

// Gadgets aus den Konstanten laden
const gadgets = ref([]);
const loading = ref(true);
const category = 'gadgets'; // Die Kategorie dieser View

// Beim Mounten die Gadgets laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Gadgets laden
    gadgets.value = getUpgrades(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für Gadget-Level
function getGadgetLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Gadget aktualisieren
function updateGadgetLevel(item, newLevel) {
  // Stelle sicher, dass der neue Wert nicht negativ ist
  const value = Math.max(0, newLevel);
  
  // Update im Store
  hunterStore.updateUpgrade(category, item.id, value);
}

/**
 * Bestimmt die Farbe für ein Gadget
 */
function getGadgetColor(gadget) {
  return gadget.color || getUpgradeColor(gadget, category) || 'purple';
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
  getLevel: getGadgetLevel,
  updateLevel: updateGadgetLevel
});
</script>