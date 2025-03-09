<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/MilestonesView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-3xl font-bold mb-8 text-center text-white">Shard Milestones</h2>

      <!-- Grid mit Milestones -->
      <UpgradeGrid :loading="loading" :columns="3">
        <!-- Level-Upgrades -->
        <UpgradeCard
          v-for="milestone in milestones"
          :key="milestone.id"
          :item="milestone"
          :color="getUpgradeColor(milestone, category)"
          :getLevel="getMilestoneLevel"
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
              v-for="hunter in getHuntersForItem(milestone)"
              :key="`${milestone.id}-${hunter.id}`"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ hunter.name }} {{ milestone.multitext || 'Bonus' }}
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
          </div>
          
          <!-- Zusatzinfos für Milestone -->
          <div v-if="milestone.description" class="text-xs text-gray-400 mt-2 mb-2">
            {{ milestone.description }}
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

// Milestones aus den Konstanten laden
const milestones = ref([]);
const loading = ref(true);
const category = 'shardmilestones'; // Die Kategorie dieser View

// Beim Mounten die Milestones laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Milestones mit Hunter-Informationen laden (asynchron)
    milestones.value = await getAllUpgradesWithHunterInfo(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für Milestone-Level
function getMilestoneLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Milestone aktualisieren
function updateMilestoneLevel(item, newLevel) {
  // Stelle sicher, dass der neue Wert nicht negativ ist
  const mod = milestones.value.find(m => m.id === item.id);
  if (!mod) return;
  
  // Prüfe ob es eine Obergrenze gibt
  const max = mod.maxLevel ?? Infinity;
  const value = Math.min(Math.max(0, newLevel), max);
  
  // Update im Store
  hunterStore.updateUpgrade(category, item.id, value);
}

/**
 * Gibt betroffene Hunter-Objekte für ein Item zurück
 */
function getHuntersForItem(item) {
  // Wenn das Item einen festen Hunter angibt, nutze diesen
  if (item.hunter) {
    if (item.hunter === 'all') {
      return HUNTERS;
    }
    
    // Komma-getrennte Hunter-Liste oder einzelner Hunter
    const hunterIds = item.hunter.split(',').map(id => id.trim());
    return hunterIds.map(id => 
      HUNTERS.find(h => h.id === id)
    ).filter(Boolean);
  }
  
  // Hole die Hunter-IDs für dieses Item aus der Konfig
  const hunterIds = getHuntersForUpgrade(item.id, category);
  
  // Wenn keine Hunter gefunden oder 'all' Milestones, verwende alle Hunter
  if (!hunterIds || hunterIds.length === 0) {
    // Wenn es ein Milestone für alle Hunter ist, zeige für alle Hunter an
    return HUNTERS;
  }
  
  // Wandle die IDs in Hunter-Objekte um
  return hunterIds.map(id => 
    HUNTERS.find(h => h.id === id)
  ).filter(Boolean);
}

/**
 * Formatiert den Wert eines Milestones
 */
function formatMilestoneValue(milestone, level) {
  return formatUpgradeValue(milestone, level);
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