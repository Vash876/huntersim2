<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/Trinkets.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">Trinkets</h2>

      <!-- Grid mit Trinkets -->
      <UpgradeGrid :loading="loading" :columns="3">
        <!-- Level-Upgrades -->
        <UpgradeCard
          v-for="trinket in unlockedTrinkets"
          :key="trinket.id"
          :item="trinket"
          :color="getUpgradeColor(trinket, category)"
          :getLevel="getTrinketLevel"
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
              v-for="hunter in getHuntersForItem(trinket)"
              :key="`${trinket.id}-${hunter.id}`"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ hunter.name }} Max HP
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
                {{ formatTrinketValue(trinket, getTrinketLevel({ id: trinket.id })) }}
              </span>
            </div>
          </div>
        </UpgradeCard>

        <!-- Gesamt-HP-Bonus Anzeige -->
        <div class="col-span-full grid grid-cols-3 gap-4">
          <!-- Leerer Div links -->
          <div></div>
          
          <!-- Zentrierte Anzeige -->
          <div class="bg-gray-800/30 p-4 rounded-lg border border-white">
            <!-- Header -->
            <h3 class="font-semibold text-white text-lg mb-3 text-center">Total HP Bonus</h3>
            
            <!-- Multiplier-Anzeige für alle Hunter -->
            <div class="bg-gray-900/50 p-3 rounded-md">
              <div 
                v-for="hunter in allHunters"
                :key="`total-${hunter.id}`"
                class="flex justify-between items-center py-1"
              >
                <span class="text-gray-400 text-xs">
                  {{ hunter.name }} Max HP
                </span>
                <span 
                  class="text-white font-medium text-xs"
                  :class="{
                    'text-red-300': hunter.color === 'red',
                    'text-green-300': hunter.color === 'green',
                    'text-blue-300': hunter.color === 'blue',
                    'text-purple-300': hunter.color === 'purple'
                  }"
                >
                  {{ formatTotalHPBonus() }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Leerer Div rechts -->
          <div></div>
        </div>
      </UpgradeGrid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
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
const gemPlannerStore = useGemPlannerStore();

// Trinkets aus den Konstanten laden
const trinkets = ref([]);
const loading = ref(true);
const category = 'trinkets'; // Die Kategorie dieser View
const allHunters = HUNTERS;

// Computed property für gefilterte Trinkets basierend auf Unlock-Bedingungen
const unlockedTrinkets = computed(() => {
  return trinkets.value.filter(trinket => {
    // Prüfe ob das Trinket Unlock-Bedingungen hat
    if (!trinket.unlock_gem || !trinket.unlock_lvl) {
      return true; // Zeige Trinkets ohne Unlock-Bedingungen immer an
    }

    // Hole den Gem-Status
    const gemState = gemPlannerStore.getGemState(trinket.unlock_gem);
    if (!gemState) {
      return false; // Gem existiert nicht
    }

    // Prüfe Gem-Level
    if (gemState.level < trinket.unlock_lvl) {
      return false; // Gem-Level zu niedrig
    }

    // Prüfe Gem-Node (falls angegeben)
    if (trinket.unlock_node !== undefined) {
      const nodeIndex = trinket.unlock_node - 1; // Node 5 = Index 4
      if (!gemState.nodes || !gemState.nodes[nodeIndex]) {
        return false; // Node nicht aktiviert
      }
    }

    return true; // Alle Bedingungen erfüllt
  });
});

// Beim Mounten die Trinkets laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Trinkets mit Hunter-Informationen laden (asynchron)
    trinkets.value = await getAllUpgradesWithHunterInfo(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für Trinket-Level
function getTrinketLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Trinket aktualisieren
function updateTrinketLevel(item, newLevel) {
  // Stelle sicher, dass der neue Wert nicht negativ ist
  const trinket = trinkets.value.find(t => t.id === item.id);
  if (!trinket) return;
  
  // Prüfe ob es eine Obergrenze gibt
  const max = trinket.maxLevel ?? Infinity;
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
  
  // Wenn keine Hunter gefunden oder 'all' Trinkets, verwende alle Hunter
  if (!hunterIds || hunterIds.length === 0) {
    // Wenn es ein Trinket für alle Hunter ist, zeige für alle Hunter an
    return HUNTERS;
  }
  
  // Wandle die IDs in Hunter-Objekte um
  return hunterIds.map(id => 
    HUNTERS.find(h => h.id === id)
  ).filter(Boolean);
}

/**
 * Formatiert den Wert eines Trinkets (in Prozent, da 0.001 = 0.1%)
 */
function formatTrinketValue(trinket, level) {
  if (!trinket.value || level === 0) return '+0%';
  
  // Trinket value ist 0.001, also 0.1% pro Level
  const percentage = trinket.value * level * 100;
  return `+${percentage.toFixed(1)}%`;
}

/**
 * Berechnet den Gesamt-HP-Bonus von allen freigeschalteten Trinkets
 * Formel: (1 + Anzahl aller Level von den Upgrades * 0.001)
 */
function formatTotalHPBonus() {
  let totalLevels = 0;
  
  // Summiere alle Level aller freigeschalteten Trinkets
  unlockedTrinkets.value.forEach(trinket => {
    totalLevels += getTrinketLevel({ id: trinket.id });
  });
  
  // Berechne den Multiplikator: 1 + (totalLevels * 0.001)
  const multiplier = 1 + (totalLevels * 0.001);
  
  // Formatiere als Multiplikator (z.B. "x1.050")
  return `x${multiplier.toFixed(3)}`;
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
  getLevel: getTrinketLevel,
  updateLevel: updateTrinketLevel
});
</script>