<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/RelicsView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-3xl font-bold mb-8 text-center text-white">Relics</h2>

      <!-- Grid mit Upgrades -->
      <UpgradeGrid :loading="loading" :columns="3">
        <UpgradeCard
          v-for="relic in relics"
          :key="relic.id"
          :item="relic"
          :color="getUpgradeColor(relic, category)"
          :getLevel="getRelicLevel"
          :handleStart="handleStart"
          :handleEnd="handleEnd"
          :handleTouchMove="handleTouchMove"
          :increment="increment"
          :decrement="decrement"
          :incrementFast="incrementFast"
          :decrementFast="decrementFast"
        >
          <!-- Effekt-Box mit einer Zeile pro Hunter -->
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            <div 
              v-for="hunter in getHuntersForItem(relic)"
              :key="`${relic.id}-${hunter.id}`"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ hunter.name }} {{ relic.multitext || 'Bonus' }}
              </span>
              <span 
                class="text-white font-medium text-sm"
                :class="{
                  'text-red-300': hunter.color === 'red',
                  'text-green-300': hunter.color === 'green',
                  'text-blue-300': hunter.color === 'blue'
                }"
              >
                {{ formatRelicValue(relic, getRelicLevel({ id: relic.id })) }}
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
  getAllUpgradesWithHunterInfo, 
  getHuntersForUpgrade, 
  getUpgradeColor, 
  formatUpgradeValue 
} from '@/utils/upgradeUtils';
import { useButtonControls } from '@/utils/useButtonControls.js';
import { HUNTERS } from '@/constants/hunters';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();

// Relics aus den Konstanten laden
const relics = ref([]);
const loading = ref(true);
const category = 'relics'; // Die Kategorie dieser View

// Beim Mounten die Relics laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Relics mit Hunter-Informationen laden (asynchron)
    relics.value = await getAllUpgradesWithHunterInfo(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für Relic-Level
function getRelicLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Relic aktualisieren
function updateRelicLevel(item, newLevel) {
  // Finde das Relic-Objekt um Limits zu prüfen
  const relic = relics.value.find(r => r.id === item.id);
  if (!relic) return;
  
  // Stelle sicher, dass der neue Wert innerhalb der Grenzen liegt
  const max = relic.maxLevel ?? Infinity;
  const value = Math.min(Math.max(0, newLevel), max);
  
  // Update im Store
  hunterStore.updateUpgrade(category, item.id, value);
}

/**
 * Gibt betroffene Hunter-Objekte für ein Item zurück
 */
function getHuntersForItem(item) {
  // Hole die Hunter-IDs für dieses Item
  const hunterIds = getHuntersForUpgrade(item.id, category);
  
  // Wenn keine Hunter gefunden, verwende alle Hunter (Fallback)
  if (!hunterIds || hunterIds.length === 0) {
    return HUNTERS;
  }
  
  // Wandle die IDs in Hunter-Objekte um
  return hunterIds.map(id => 
    HUNTERS.find(h => h.id === id)
  ).filter(Boolean);
}

/**
 * Formatiert den Wert eines Relic-Upgrades mit korrigierter Berechnung
 */
function formatRelicValue(relic, level) {
  // Verwende die korrigierte Utility-Funktion
  return formatUpgradeValue(relic, level);
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
  getLevel: getRelicLevel,
  updateLevel: updateRelicLevel
});
</script>