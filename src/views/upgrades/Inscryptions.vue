<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">Inscryptions</h2>

      <!-- Filter-Leiste mit Hunter-Filter und Hide Maxed Toggle -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <!-- Leerer Platzhalter links für Balance -->
        <div class="w-1/4 hidden md:block"></div>
        
        <!-- Hunter-Filter als Segmented Control -->
        <div class="inline-flex bg-gray-800/60 rounded-xl p-1 gap-1 md:w-auto">
          <button
            v-for="hunter in hunters"
            :key="hunter.id"
            @click="selectedHunter = hunter.id"
            class="relative px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
            :class="[
              selectedHunter === hunter.id 
                ? hunterActiveClass(hunter.color) 
                : hunterInactiveClass(hunter.color)
            ]"
          >
            {{ hunter.name }}
          </button>
        </div>
        
        <!-- Toggle für "Hide Maxed" rechts -->
        <div class="flex justify-end items-center md:w-1/4">
          <div class="bg-gray-800/40 rounded-lg border border-gray-700/40 px-3 py-2">
            <div class="flex items-center gap-3">
              <span class="text-gray-400 text-sm">Hide Maxed</span>
              <button 
                @click="hideMaxed = !hideMaxed" 
                class="relative inline-flex h-5 w-11 items-center rounded-full transition-all duration-300 focus:outline-none"
                :class="hideMaxed 
                  ? 'bg-gradient-to-r from-green-700 to-green-500 border border-green-400/30 shadow-sm shadow-green-500/25' 
                  : 'bg-gray-700/60 border border-gray-600/40'"
              >
                <span
                  v-if="hideMaxed"
                  class="absolute h-3 w-3 rounded-full transition-all duration-300 blur-[5px] translate-x-[1.45rem] bg-green-400"
                ></span>
                <span 
                  class="relative inline-block h-3.5 w-3.5 transform rounded-full transition-all duration-300"
                  :class="hideMaxed 
                    ? 'translate-x-[1.4rem] bg-white shadow-md' 
                    : 'translate-x-1 bg-gray-500 shadow-sm'"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid mit Upgrades -->
      <UpgradeGrid :loading="loading" :columns="4">
        <UpgradeCard
          v-for="inscryption in finalFilteredInscryptions" 
          :key="inscryption.id"
          :item="inscryption"
          :color="inscryption.color"
          :getLevel="getUpgradeLevel"
          :handleStart="handleStart"
          :handleEnd="handleEnd"
          :handleTouchMove="handleTouchMove"
          :increment="increment"
          :decrement="decrement"
          :incrementFast="incrementFast"
          :decrementFast="decrementFast"
        >
          <!-- Effekt-Box -->
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            <!-- Standard-Inscryption -->
            <div 
              v-if="inscryption.id !== 'i60'" 
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ inscryption.description }}
              </span>
              <span 
                class="text-white font-medium text-sm"
                :class="{
                  'text-red-300': inscryption.color === 'red',
                  'text-green-300': inscryption.color === 'green',
                  'text-blue-300': inscryption.color === 'blue',
                  'text-purple-300': inscryption.color === 'purple',
                  'text-gray-300': !inscryption.color || inscryption.color === 'gray'
                }"
              >
                {{ formatValue(inscryption, getUpgradeLevel({ id: inscryption.id })) }}
              </span>
            </div>

            <!-- Kosten für nächstes Level -->
            <div v-if="getNextLevelCostForInscryption(inscryption)" class="flex justify-between items-center py-1 border-t border-gray-700/50 mt-2 pt-2">
              <span class="text-gray-500 text-xs">Next Level Cost:</span>
              <span class="text-yellow-400 text-xs font-medium">
                {{ getNextLevelCostForInscryption(inscryption) }}
              </span>
            </div>

            <!-- Spezieller Fall für i60 Multi-Power -->
            <div v-else>
              <div 
                v-for="(bonusName, index) in inscryption.bonusNames" 
                :key="index"
                class="flex justify-between items-center py-1 pl-2"
              >
                <span class="text-gray-400 text-sm">{{ bonusName }}</span>
                <span 
                  class="font-medium text-sm"
                >
                  x{{ (1 + inscryption.baseBonus * getUpgradeLevel({ id: inscryption.id })).toFixed(2) }}
                </span>
              </div>
              
              <!-- Kosten für nächstes Level bei i60 -->
              <div v-if="getNextLevelCostForInscryption(inscryption)" class="flex justify-between items-center py-1 border-t border-gray-700/50 mt-2 pt-2 pl-2">
                <span class="text-gray-500 text-xs">Next Level Cost:</span>
                <span class="text-orange-400 text-xs font-medium">
                  {{ getNextLevelCostForInscryption(inscryption) }}
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
import { ref, computed, onMounted, watch } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { getAllUpgradesWithHunterInfo } from '@/utils/upgradeUtils';
import { HUNTERS } from '@/constants/hunters';
import { useButtonControls } from '@/utils/useButtonControls.js';
import { getNextLevelCost, formatInscryptionCost, INSCRYPTION_CONFIGS } from '@/utils/inscryptionCostUtils.js';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();

// Inscryptions aus den Konstanten laden
const inscryptions = ref([]);
const loading = ref(true);
const category = 'inscryptions'; // Die Kategorie dieser View

// Hunter auswählen
const selectedHunter = ref('borge');
const hunters = HUNTERS;

const hideMaxed = ref(false);

// Hunter-Tab aktive Klasse
function hunterActiveClass(color) {
  const map = {
    'red': 'bg-gradient-to-b from-red-500/90 to-red-700/90 text-white shadow-sm',
    'green': 'bg-gradient-to-b from-green-500/90 to-green-700/90 text-white shadow-sm',
    'blue': 'bg-gradient-to-b from-blue-500/90 to-blue-700/90 text-white shadow-sm',
    'purple': 'bg-gradient-to-b from-purple-500/90 to-purple-700/90 text-white shadow-sm',
  };
  return map[color] || 'bg-gray-700 text-white shadow-sm';
}

function hunterInactiveClass(color) {
  const map = {
    'red': 'text-gray-500 hover:text-red-400 hover:bg-red-500/10',
    'green': 'text-gray-500 hover:text-green-400 hover:bg-green-500/10',
    'blue': 'text-gray-500 hover:text-blue-400 hover:bg-blue-500/10',
    'purple': 'text-gray-500 hover:text-purple-400 hover:bg-purple-500/10',
  };
  return map[color] || 'text-gray-500 hover:text-gray-300';
}

// Gefilterte Inscryptions basierend auf ausgewähltem Hunter
const filteredInscryptions = computed(() => {
  return inscryptions.value.filter(
    inscryption => inscryption.hunter === selectedHunter.value || 
                  inscryption.hunter?.includes(selectedHunter.value) ||
                  inscryption.hunter === 'all'
  );
});

// Getter für Upgrade-Level
function getUpgradeLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Upgrade aktualisieren
function updateUpgradeLevel(item, newLevel) {
  // Finde das Upgrade-Objekt um Limits zu prüfen
  const upgrade = inscryptions.value.find(i => i.id === item.id);
  if (!upgrade) return;
  
  // Stelle sicher, dass der neue Wert innerhalb der Grenzen liegt
  const max = upgrade.maxLevel ?? Infinity;
  const value = Math.min(Math.max(0, newLevel), max);
  
  // Update im Store
  hunterStore.updateUpgrade(category, item.id, value);
}

/**
 * Formatiert den Wert eines Inscryption-Upgrades basierend auf dem Format
 */
 function formatValue(inscryption, level) {
  if (level === 0) return '-';
  
  switch (inscryption.format) {
    case 'value':
      const valueResult = Math.round(inscryption.add * level);
      return inscryption.add ? `+${valueResult}` : `+${valueResult}`;
      
    case 'percent':
      const percentResult = (inscryption.add * level).toFixed(2);
      return inscryption.add ? `+${percentResult}%` : `+${percentResult}%`;
      
    case 'multiplier':
      return `x${Math.pow(inscryption.multiplier, level).toFixed(2)}`;
      
    case 'seconds':
      const secondsResult = (inscryption.add * level).toFixed(2);
      return inscryption.add ? `-${secondsResult}s` : `${secondsResult}s`;
      
    case 'fixedPercent':
      return inscryption.fixedValue;
      
    case 'specialMultiplier':
      // Spezieller Fall für i60
      if (inscryption.id === 'i60') {
        const bonus = 1 + inscryption.baseBonus * level;
        return inscryption.bonusNames.map(name => 
          `${name}: x${bonus.toFixed(2)}`
        ).join('<br>');
      }
      // Für andere specialMultiplier
      const bonus = inscryption.baseBonus * level;
      return `+${(bonus * 100).toFixed(0)}%`;
      
    default:
      return level;
  }
}

/**
 * Berechnet die Kosten für das nächste Level einer Inscryption
 */
function getNextLevelCostForInscryption(inscryption) {
  const currentLevel = getUpgradeLevel({ id: inscryption.id });
  const maxLevel = inscryption.maxLevel ?? Infinity;
  
  // Wenn schon auf Max-Level, keine Kosten anzeigen
  if (currentLevel >= maxLevel) {
    return null;
  }
  
  // Prüfe ob die Inscryption in INSCRYPTION_CONFIGS vorhanden ist
  if (!INSCRYPTION_CONFIGS[inscryption.id]) {
    return null;
  }
  
  const nextLevelCost = getNextLevelCost(inscryption.id, currentLevel);
  
  if (nextLevelCost === null || nextLevelCost === 0) {
    return null;
  }
  
  return formatInscryptionCost(nextLevelCost);
}

// Speichern und Laden des Filter-Status
function saveFilterSettings() {
  try {
    localStorage.setItem('inscryptions_hideMaxed', JSON.stringify(hideMaxed.value));
  } catch (error) {
    console.error('Fehler beim Speichern der Filter-Einstellungen:', error);
  }
}

// Beim Mounten die Inscryptions laden und Filter-Einstellungen
onMounted(async () => {
  loading.value = true;
  try {
    // Lade Filter-Einstellungen
    try {
      const savedHideMaxed = JSON.parse(localStorage.getItem('inscryptions_hideMaxed'));
      if (savedHideMaxed !== null) {
        hideMaxed.value = savedHideMaxed;
      }
    } catch (e) {
      console.error('Fehler beim Laden der Filter-Einstellungen:', e);
    }
    
    // Alle Inscryptions mit Hunter-Informationen laden (asynchron)
    inscryptions.value = await getAllUpgradesWithHunterInfo(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Watcher für hideMaxed um Einstellungen zu speichern
watch(hideMaxed, () => {
  saveFilterSettings();
});

// Erweiterte gefilterte Inscryptions mit Hide-Maxed-Filter
const finalFilteredInscryptions = computed(() => {
  // Zuerst nach Hunter filtern
  const hunterFiltered = filteredInscryptions.value;
  
  // Dann eventuell gemaxte Inscryptions ausblenden
  if (!hideMaxed.value) {
    return hunterFiltered;
  }
  
  // Filtere gemaxte Upgrades heraus
  return hunterFiltered.filter(inscryption => {
    const currentLevel = getUpgradeLevel({ id: inscryption.id });
    const maxLevel = inscryption.maxLevel ?? Infinity;
    return currentLevel < maxLevel;
  });
});

// useButtonControls initialisieren
const {
  handleStart,
  handleEnd,
  handleTouchMove,
  increment,
  decrement,
  incrementFast,
  decrementFast
} = useButtonControls({
  getLevel: getUpgradeLevel,
  updateLevel: updateUpgradeLevel
});
</script>