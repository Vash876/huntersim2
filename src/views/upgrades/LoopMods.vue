<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/LoopModsView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">Loop Modifiers</h2>

      <!-- Grid mit Upgrades -->
      <UpgradeGrid :loading="loading" :columns="3">
        <!-- Boolean-Upgrades -->
        <UpgradeCard
          v-for="mod in booleanMods"
          :key="mod.id"
          :item="mod"
          :color="getUpgradeColor(mod, category)"
          :getLevel="getModLevel"
          :toggleBoolean="toggleModBoolean"
        >
          <!-- Effekt-Box mit Status-Anzeige -->
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            <div 
              v-for="hunter in getHuntersForItem(mod)"
              :key="`${mod.id}-${hunter.id}`"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ hunter.name }} {{ mod.description || 'Effect' }}
              </span>
              <span 
                class="text-sm font-medium px-2 py-0.5 rounded"
                :class="{
                  'text-green-300 bg-green-900/30': getModLevel({ id: mod.id }) > 0,
                  'text-red-300 bg-red-900/30': getModLevel({ id: mod.id }) <= 0
                }"
              >
                {{ getModLevel({ id: mod.id }) > 0 ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </UpgradeCard>

        <!-- Level-Upgrades -->
        <UpgradeCard
          v-for="mod in levelMods"
          :key="mod.id"
          :item="mod"
          :color="getUpgradeColor(mod, category)"
          :getLevel="getModLevel"
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
              v-for="hunter in getHuntersForItem(mod)"
              :key="`${mod.id}-${hunter.id}`"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ hunter.name }} {{ mod.description || 'Bonus' }}
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
                {{ formatModValue(mod, getModLevel({ id: mod.id })) }}
              </span>
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
  getAllUpgradesWithHunterInfo, 
  getHuntersForUpgrade, 
  getUpgradeColor, 
  formatUpgradeValue, 
  toggleBooleanUpgrade 
} from '@/utils/upgradeUtils';
import { useButtonControls } from '@/utils/useButtonControls.js';
import { HUNTERS } from '@/constants/hunters';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Loop Mods aus den Konstanten laden
const allLoopmods = ref([]);
const loading = ref(true);
const category = 'loopmods'; // Die Kategorie dieser View

// Beim Mounten die Loop Mods laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Loop Mods mit Hunter-Informationen laden (asynchron)
    allLoopmods.value = await getAllUpgradesWithHunterInfo(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Computed für verfügbare Loop Mods basierend auf Gem-Leveln
const loopmods = computed(() => {
  return allLoopmods.value.filter(mod => {
    // Prüfe ob das Loop Mod Gem-Anforderungen hat
    if (mod.unlock_gem && mod.unlock_lvl) {
      const gemState = gemPlannerStore.getGemState(mod.unlock_gem);
      const currentGemLevel = gemState?.level || 0;
      
      // Verstecke das Loop Mod wenn das erforderliche Gem-Level nicht erreicht ist
      if (currentGemLevel < mod.unlock_lvl) {
        return false;
      }
    }
    
    // Zeige das Loop Mod an, wenn keine Gem-Anforderungen oder Anforderungen erfüllt sind
    return true;
  });
});

// Getrennte Listen für boolean und level Mods
const booleanMods = computed(() => 
  loopmods.value.filter(mod => mod.type === 'boolean')
);

const levelMods = computed(() => 
  loopmods.value.filter(mod => mod.type === 'level')
);

// Getter für Mod-Level
function getModLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Mod aktualisieren
function updateModLevel(item, newLevel) {
  // Finde das Mod-Objekt um Limits zu prüfen
  const mod = allLoopmods.value.find(m => m.id === item.id);
  if (!mod) return;
  
  // Stelle sicher, dass der neue Wert innerhalb der Grenzen liegt
  const max = mod.maxLevel ?? Infinity;
  const value = Math.min(Math.max(0, newLevel), max);
  
  // Update im Store
  hunterStore.updateUpgrade(category, item.id, value);
}

// Boolean-Toggle-Funktion für Boolean-Upgrades - wichtig: diese Funktion muss genau so heißen wie die Prop in UpgradeCard!
function toggleModBoolean(item) {
  const currentValue = getModLevel(item);
  const newValue = currentValue > 0 ? 0 : 1;
  hunterStore.updateUpgrade(category, item.id, newValue);
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
 * Formatiert den Wert eines Loop Mod-Upgrades
 */
function formatModValue(mod, level) {
  if (mod.type === 'boolean') {
    return level > 0 ? 'Active' : 'Inactive';
  }
  return formatUpgradeValue(mod, level);
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
  getLevel: getModLevel,
  updateLevel: updateModLevel
});
</script>