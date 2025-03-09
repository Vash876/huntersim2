<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/DiamondSpecialsView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-3xl font-bold mb-8 text-center text-white">Diamond Specials</h2>

      <!-- Grid mit Upgrades -->
      <UpgradeGrid :loading="loading" :columns="3">
        <UpgradeCard
          v-for="special in diamondSpecials"
          :key="special.id"
          :item="special"
          :color="getUpgradeColor(special, category) || 'purple'"
          :getLevel="getSpecialLevel"
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
              v-for="hunter in getHuntersForItem(special)"
              :key="`${special.id}-${hunter.id}`"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ hunter.name }} {{ special.multitext || special.description || 'Bonus' }}
              </span>
              <span 
                class="text-white font-medium text-sm text-purple-300"
              >
                {{ formatSpecialValue(special, getSpecialLevel({ id: special.id })) }}
              </span>
            </div>
          </div>
          
          <!-- Spezielle Info für Diamond Specials (falls vorhanden) -->
          <div v-if="special.description && !special.multitext" class="text-xs text-gray-400 mt-2 mb-2">
            {{ special.description }}
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
import { useButtonControls } from '@/utils/useButtonControls';
import { HUNTERS } from '@/constants/hunters';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();

// Diamond Specials aus den Konstanten laden
const diamondSpecials = ref([]);
const loading = ref(true);
const category = 'diamondspecials'; // Die Kategorie dieser View

// Beim Mounten die Diamond Specials laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Diamond Specials mit Hunter-Informationen laden (asynchron)
    diamondSpecials.value = await getAllUpgradesWithHunterInfo(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für Diamond Special Level
function getSpecialLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Diamond Special aktualisieren
function updateSpecialLevel(item, newLevel) {
  // Finde das Diamond Special Objekt um Limits zu prüfen
  const special = diamondSpecials.value.find(s => s.id === item.id);
  if (!special) return;
  
  // Stelle sicher, dass der neue Wert innerhalb der Grenzen liegt
  const max = special.maxLevel ?? Infinity;
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
  
  // Wenn keine Hunter gefunden oder 'all' Special, verwende alle Hunter
  if (!hunterIds || hunterIds.length === 0) {
    // Wenn es ein Special für alle Hunter ist, zeige für alle Hunter an
    return HUNTERS;
  }
  
  // Wandle die IDs in Hunter-Objekte um
  return hunterIds.map(id => 
    HUNTERS.find(h => h.id === id)
  ).filter(Boolean);
}

/**
 * Formatiert den Wert eines Diamond Specials
 */
function formatSpecialValue(special, level) {
  // Spezialbehandlung für reviveboost
  if (special.id === 'reviveboost') {
    const seconds = level * Math.abs(special.value);
    return `-${seconds}s`;
  }
  
  // Standard-Formatierung für andere Specials
  return formatUpgradeValue(special, level);
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
  getLevel: getSpecialLevel,
  updateLevel: updateSpecialLevel
});
</script>