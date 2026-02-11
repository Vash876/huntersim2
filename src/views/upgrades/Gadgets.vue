<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/GadgetsView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <h2 class="text-3xl font-bold mb-8 text-center text-white md:hidden">Gadgets</h2>

      <!-- Reward Overlay -->
      <div 
        v-if="showReward" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-pointer"
        @click="dismissReward"
      >
        <img :src="rewardImg" class="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl" />
      </div>

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
import { ref, onMounted, computed, watch } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { useGemPlannerStore } from '@/store/gemPlannerStore';
import { 
  getUpgrades, 
  getUpgradeColor, 
  calculateGadgetValue
} from '@/utils/upgradeUtils';
import { useButtonControls } from '@/utils/useButtonControls.js';
import UpgradeGrid from '@/components/upgrades/UpgradeGrid.vue';
import UpgradeCard from '@/components/upgrades/UpgradeCard.vue';
import rewardImg from '@/assets/meme/1.png';

// Store für Upgrades
const hunterStore = useHunterStore();
const gemPlannerStore = useGemPlannerStore();

// Gadgets aus den Konstanten laden
const allGadgets = ref([]);
const loading = ref(true);
const category = 'gadgets'; // Die Kategorie dieser View

// Completion reward state
const showReward = ref(false);

const isFullyCompleted = computed(() => {
  if (!allGadgets.value.length) return false;
  return allGadgets.value.every(g => hunterStore.getUpgradeValue(category, g.id) >= 1000);
});

watch(isFullyCompleted, (val) => {
  if (val) showReward.value = true;
}, { immediate: false });

function dismissReward() {
  showReward.value = false;
}

// Computed für verfügbare Gadgets basierend auf Gem-Leveln
const gadgets = computed(() => {
  return allGadgets.value.filter(gadget => {
    // Prüfe ob das Gadget Gem-Anforderungen hat
    if (gadget.unlock_gem && gadget.unlock_lvl) {
      const gemState = gemPlannerStore.getGemState(gadget.unlock_gem);
      const currentGemLevel = gemState?.level || 0;
      
      // Verstecke das Gadget wenn das erforderliche Gem-Level nicht erreicht ist
      if (currentGemLevel < gadget.unlock_lvl) {
        return false;
      }
    }
    
    // Zeige das Gadget an, wenn keine Gem-Anforderungen oder Anforderungen erfüllt sind
    return true;
  });
});

// Beim Mounten die Gadgets laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Gadgets laden (ungefiltert)
    allGadgets.value = getUpgrades(category);
  } catch (error) {
    console.error(`Fehler beim Laden der ${category}:`, error);
  } finally {
    loading.value = false;
    // Check completion state on mount
    if (isFullyCompleted.value) showReward.value = true;
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
  return gadget.color || getUpgradeColor(gadget, category) || 'gray';
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