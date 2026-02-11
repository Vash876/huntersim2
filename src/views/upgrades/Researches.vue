<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/ResearchesView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">Researches</h2>

      <!-- Grid mit Upgrades -->
      <UpgradeGrid :loading="loading" :columns="3">
        <UpgradeCard
          v-for="research in researches"
          :key="research.id"
          :item="research"
          :color="getUpgradeColor(research, category)"
          :getLevel="getResearchLevel"
          :handleStart="handleStart"
          :handleEnd="handleEnd"
          :handleTouchMove="handleTouchMove"
          :increment="increment"
          :decrement="decrement"
          :incrementFast="incrementFast"
          :decrementFast="decrementFast"
        >
          <!-- Effekt-Box mit Hunter-Multiplikatoren -->
          <div class="bg-gray-900/50 p-3 rounded-md w-full mb-4">
            
            <!-- Hunter-spezifische Multiplikatoren -->
            <div 
              v-for="hunter in HUNTERS"
              :key="`${research.id}-${hunter.id}`"
              class="flex justify-between items-center py-1"
            >
              <span class="text-gray-400 text-sm">
                {{ hunter.name }} {{ research.multitext || 'Bonus' }}
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
                {{ formatResearchValue(research, getResearchLevel({ id: research.id }), hunter.id) }}
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
  getUpgrades, 
  getUpgradeColor 
} from '@/utils/upgradeUtils';
import { useButtonControls } from '@/utils/useButtonControls';
import { HUNTERS } from '@/constants/hunters';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';

// Store für Upgrades
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Researches aus den Konstanten laden
const allResearches = ref([]);
const loading = ref(true);
const category = 'researches'; // Die Kategorie dieser View

// Computed für verfügbare Researches basierend auf Gem-Leveln
const researches = computed(() => {
  return allResearches.value.filter(research => {
    // Prüfe ob das Research Gem-Anforderungen hat
    if (research.unlock_gem && research.unlock_lvl) {
      const gemState = gemPlannerStore.getGemState(research.unlock_gem);
      const currentGemLevel = gemState?.level || 0;
      
      // Verstecke das Research wenn das erforderliche Gem-Level nicht erreicht ist
      if (currentGemLevel < research.unlock_lvl) {
        return false;
      }
      
      // Prüfe auch unlock_node wenn vorhanden
      if (research.unlock_node !== undefined) {
        const hasRequiredNode = gemState?.nodes?.[research.unlock_node - 1] || false;
        if (!hasRequiredNode) {
          return false;
        }
      }
    }
    
    // Zeige das Research an, wenn keine Gem-Anforderungen oder Anforderungen erfüllt sind
    return true;
  });
});

// Beim Mounten die Researches laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Researches laden (ungefiltert)
    allResearches.value = getUpgrades(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Getter für Research-Level
function getResearchLevel(item) {
  return hunterStore.getUpgradeValue(category, item.id);
}

// Research aktualisieren
function updateResearchLevel(item, newLevel) {
  // Finde das Research-Objekt um Limits zu prüfen
  const research = allResearches.value.find(r => r.id === item.id);
  if (!research) return;
  
  // Stelle sicher, dass der neue Wert innerhalb der Grenzen liegt
  const max = research.maxLevel ?? Infinity;
  const value = Math.min(Math.max(0, newLevel), max);
  
  // Update im Store
  hunterStore.updateUpgrade(category, item.id, value);
}

/**
 * Formatiert den Wert eines Research-Upgrade für einen bestimmten Hunter
 * @param {Object} research - Das Research-Objekt
 * @param {number} level - Das aktuelle Level des Research
 * @param {string} hunterId - Die ID des Hunters
 * @returns {string} - Formatierter Wert
 */
function formatResearchValue(research, level, hunterId) {
  // Wenn kein Level oder kein Research, zeige Standardwert
  if (level === 0 || !research || !research.tiers) {
    return 'x1.00';
  }
  
  // Finde den Tier-Eintrag für dieses Level
  const tier = research.tiers.find(t => t.level === level);
  
  // Wenn kein Tier gefunden, zeige Standardwert
  if (!tier || !tier.multipliers || !tier.multipliers[hunterId]) {
    return 'x1.00';
  }
  
  // Hole den Hunter-spezifischen Multiplikator
  const value = tier.multipliers[hunterId];
  
  // Formatiere den Wert mit x-Präfix
  return `x${value.toFixed(2)}`;
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
  getLevel: getResearchLevel,
  updateLevel: updateResearchLevel
});
</script>