<template>
  <div class="p-0 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8 border border-gray-800/80">
      <!-- Überschrift -->
  <h2 class="text-3xl font-bold mb-6 text-center text-white">Diamond Ultima Calculator</h2>
      
      <!-- TR Count und Total Levels mit responsiver Anpassung -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <!-- TR Count - immer in der ersten Zeile -->
          <div class="flex items-center gap-6 mb-3 sm:mb-0">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <IconAbacus size="20" class="mr-2 text-blue-400" />
              TR Count
            </h3>
            
            <div class="flex items-center space-x-3">
              <!-- TR Count TRValueControls -->
              <TRValueControls
                :value="trCount"
                :maxValue="999"
                :minValue="1"
                :step="1"
                :fastStep="10"
                :showFastControls="true"
                @update:value="updateTrCount"
              />
            </div>
          </div>
          
          <!-- Total Levels - auf Mobilgeräten in zweiter Zeile -->
          <div class="flex items-center justify-start sm:justify-end gap-3">
            <div class="text-gray-400 text-sm">Total Levels:</div>
            <div class="flex items-center">
              <span class="text-white font-bold">{{ totalLevels }}</span>
              <span class="text-gray-500 mx-1">/</span>
              <span class="text-gray-400">{{ nextMilestone }}</span>
            </div>
            <div class="w-24 bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div class="bg-blue-600 h-full" :style="{ width: `${totalLevelsProgress}%` }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Upgrades Tabelle -->
      <div class="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden shadow-lg mb-4">
        <div class="header p-3 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-white flex items-center">
            <IconArrowUpCircle size="20" class="mr-2 text-green-400" />
            Ultima Upgrades
          </h3>
          
          <div class="flex space-x-2">            
            <button 
              @click="resetForm"
              class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 text-xs rounded-lg flex items-center transition-colors"
            >
              <IconRefresh size="16" class="mr-1.5" />
              Reset
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto md:overflow-visible">
          <div class="min-w-[1000px]"> <!-- Mindestbreite für die Tabelle festlegen -->
            <table class="w-full bg-gray-900/70">
              <colgroup>
                <col class="w-[9%]">  <!-- Type -->
                <col class="w-[17%]"> <!-- Current -->
                <col class="w-[17%]"> <!-- Target -->
                <col class="w-[9%]">  <!-- Cost -->
                <col class="w-[6%]">  <!-- Cap -->
                <col class="w-[13%]"> <!-- Current Bonus -->
                <col class="w-[13%]"> <!-- Target Bonus -->
                <col class="w-[16%]"> <!-- Gain at Target -->
              </colgroup>
              <thead>
                <tr class="text-xs text-gray-400 uppercase">
                  <th class="px-4 py-3 text-left">Type</th>
                  <th class="px-4 py-3 text-center">Current</th>
                  <th class="px-4 py-3 text-center">Target</th>
                  <th class="px-4 py-3 text-center">Cost</th>
                  <th class="px-4 py-3 text-center">Cap</th>
                  <th class="px-4 py-3 text-center">Current Bonus</th>
                  <th class="px-4 py-3 text-center">Target Bonus</th>
                  <th class="px-4 py-3 text-center">Gain at Target</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                <!-- Rows für jedes Upgrade -->
                <tr 
                  v-for="(upgradeInfo, upgradeType) in upgradesList" 
                  :key="upgradeType"
                  :class="{ 
                    'bg-gray-800/50': upgradeType === 'loot',
                    'bg-gray-900/80': upgradeType !== 'loot',
                    'opacity-50': isUpgradeLocked(upgradeType)
                  }"
                >
                  <td class="px-4 py-3">
                    <span class="font-medium text-white">{{ upgradeInfo.label }}</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div>
                      <!-- Current Level TRValueControls -->
                      <TRValueControls
                        :value="currentLevels[upgradeType]"
                        :maxValue="typeof upgradeCaps[upgradeType] === 'number' ? upgradeCaps[upgradeType] : 999"
                        :minValue="0"
                        :step="1"
                        :fastStep="10"
                        :disabled="isUpgradeLocked(upgradeType)"
                        :tabIndex="getTabIndexForCurrentLevel(upgradeType)"
                        @update:value="(newVal) => updateCurrentLevel(upgradeType, newVal)"
                        :autoEdit="true"
                        class="mx-auto"
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <div>
                      <!-- Target Level TRValueControls -->
                      <TRValueControls
                        :value="targetLevels[upgradeType]"
                        :maxValue="typeof upgradeCaps[upgradeType] === 'number' ? upgradeCaps[upgradeType] : 999"
                        :minValue="0"  
                        :buttonMinValue="currentLevels[upgradeType]" 
                        :step="1"
                        :fastStep="10"
                        :disabled="isUpgradeLocked(upgradeType)"
                        :tabIndex="getTabIndexForTargetLevel(upgradeType)"
                        @update:value="(newVal) => updateTargetLevel(upgradeType, newVal)"
                        @blur="finalizeTargetLevel(upgradeType)"
                        :valueClass="targetLevels[upgradeType] > currentLevels[upgradeType] ? 'text-green-400' : 'text-white'"
                        :autoEdit="true"
                        :disableDecrement="targetLevels[upgradeType] <= currentLevels[upgradeType]"
                        class="mx-auto"
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span 
                      :class="{ 
                        'text-amber-400': typeof upgradeCosts[upgradeType] === 'number' && upgradeCosts[upgradeType] > 0,
                        'text-gray-500': upgradeCosts[upgradeType] === 0 || upgradeCosts[upgradeType] === 'MAX',
                        'text-red-400': upgradeCosts[upgradeType] === 'LOCKED'
                      }"
                    >
                      {{ formatCost(upgradeCosts[upgradeType]) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span 
                      :class="{
                        'text-green-400': typeof upgradeCaps[upgradeType] === 'number',
                        'text-red-400': upgradeCaps[upgradeType] === 'LOCKED'
                      }"
                    >
                      {{ upgradeCaps[upgradeType] }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="text-blue-400">
                      {{ formatBonus(currentBonuses[upgradeType]) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span 
                      :class="{
                        'text-green-400': targetBonuses[upgradeType] > currentBonuses[upgradeType],
                        'text-blue-400': targetBonuses[upgradeType] === currentBonuses[upgradeType]
                      }"
                    >
                      {{ formatBonus(targetBonuses[upgradeType]) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span 
                      :class="{
                        'text-green-400': bonusGains[upgradeType] > 1,
                        'text-gray-400': bonusGains[upgradeType] === 1
                      }"
                    >
                      {{ formatFactor(bonusGains[upgradeType]) }}
                    </span>
                  </td>
                </tr>
                
                <!-- Totals Row -->
                <tr class="bg-gray-800 font-medium">
                  <td colspan="3" class="px-4 py-3 text-right text-white">
                    Total Diamond Cost:
                  </td>
                  <td class="px-4 py-3 text-center text-amber-400 font-bold">
                    {{ formatCost(totalCost) }}
                  </td>
                  <td colspan="5" class="px-4 py-3">
                    <!-- Leer lassen -->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useUltimaStore } from '@/store/ultimaStore';
import { 
  IconSettingsAutomation, 
  IconAbacus, 
  IconArrowUpCircle,
  IconDeviceGamepad,
  IconRefresh,
  IconMinus,
  IconPlus,
  IconChartDots,
  IconBulb,
  IconInfoCircle
} from '@tabler/icons-vue';
import TRValueControls from '@/composables/TRValueControls.vue';

// Store
const ultimaStore = useUltimaStore();

// UI State
const trCount = ref(ultimaStore.trCount);
const currentLevels = ref({ ...ultimaStore.currentLevels });
const targetLevels = ref({ ...ultimaStore.targetLevels });

// Computed Properties aus dem Store
const upgradeCaps = computed(() => ultimaStore.upgradeCaps);
const upgradeCosts = computed(() => ultimaStore.upgradeCosts);
const currentBonuses = computed(() => ultimaStore.currentBonuses);
const targetBonuses = computed(() => ultimaStore.targetBonuses);
const bonusGains = computed(() => ultimaStore.bonusGains);
const totalCost = computed(() => ultimaStore.totalCost);
const tempTargetInputs = ref({});

// Berechnung der Gesamtlevel und Meilensteine
const totalLevels = computed(() => {
  let sum = 0;
  for (const type in currentLevels.value) {
    sum += currentLevels.value[type];
  }
  return sum;
});

const nextMilestone = computed(() => {
  return Math.ceil(totalLevels.value / 50) * 50;
});

const totalLevelsProgress = computed(() => {
  const current = totalLevels.value % 50;
  return current === 0 ? 100 : (current / 50) * 100;
});

const levelsToNextMilestone = computed(() => {
  return nextMilestone.value - totalLevels.value;
});

// Loot Progress-Prozentsatz
const lootProgressPercent = computed(() => {
  if (typeof currentBonuses.value.loot !== 'number') return 0;
  
  const baseLoot = 1; // Basis-Multiplier
  const maxLootMulti = 1 + (0.003 * upgradeCaps.value.loot) * 
                       getMilestoneBonusFactor(true);
  
  const currentProgress = currentBonuses.value.loot - baseLoot;
  const maxProgress = maxLootMulti - baseLoot;
  
  return (currentProgress / maxProgress) * 100;
});

// Next Best Upgrades bis zum nächsten Milestone
const nextBestUpgrades = computed(() => {
  if (levelsToNextMilestone.value <= 0) return [];
  
  const upgradesToConsider = [];
  
  // Sammle alle möglichen Upgrades und deren Kosten
  for (const type in upgradesList) {
    if (isUpgradeLocked(type)) continue;
    
    const currentLevel = currentLevels.value[type];
    const cap = typeof upgradeCaps.value[type] === 'number' ? upgradeCaps.value[type] : Infinity;
    
    if (currentLevel >= cap) continue;
    
    // Berechne Kosten für ein einzelnes Level-Up
    const costForOneLevel = ultimaStore.calculateCostForLevel(type, currentLevel, currentLevel + 1);
    
    if (typeof costForOneLevel !== 'number' || costForOneLevel <= 0) continue;
    
    // Füge dieses Upgrade mit seinen Kosten hinzu
    upgradesToConsider.push({
      type,
      costPerLevel: costForOneLevel,
      currentLevel,
      cap
    });
  }
  
  // Sortiere nach Kosten (aufsteigend)
  upgradesToConsider.sort((a, b) => a.costPerLevel - b.costPerLevel);
  
  // Verteile die benötigten Level auf die günstigsten Upgrades
  const result = [];
  let remainingLevels = levelsToNextMilestone.value;
  
  for (const upgrade of upgradesToConsider) {
    if (remainingLevels <= 0) break;
    
    // Maximale Anzahl an Levels, die wir zu diesem Upgrade hinzufügen können
    const maxLevelsForThisUpgrade = Math.min(
      remainingLevels,
      upgrade.cap - upgrade.currentLevel
    );
    
    if (maxLevelsForThisUpgrade > 0) {
      result.push({
        type: upgrade.type,
        count: maxLevelsForThisUpgrade
      });
      
      remainingLevels -= maxLevelsForThisUpgrade;
    }
  }
  
  return result;
});

// Berechne die Gesamtkosten für die nächsten empfohlenen Upgrades
const nextBestUpgradesTotalCost = computed(() => {
  let totalCost = 0;
  
  for (const upgrade of nextBestUpgrades.value) {
    const currentLevel = currentLevels.value[upgrade.type];
    const targetLevel = currentLevel + upgrade.count;
    const cost = ultimaStore.calculateCostForLevel(upgrade.type, currentLevel, targetLevel);
    
    if (typeof cost === 'number') {
      totalCost += cost;
    }
  }
  
  return totalCost;
});

// Liste aller Upgrades für die Tabelle
const upgradesList = {
  cells: { label: 'Cells', base: 100, baseIncrease: 2 },
  mp: { label: 'MP', base: 200, baseIncrease: 2 },
  shards: { label: 'Shards', base: 200, baseIncrease: 2 },
  rp: { label: 'RP', base: 200, baseIncrease: 2 },
  ap: { label: 'AP', base: 200, baseIncrease: 2 },
  mats: { label: 'Mats', base: 300, baseIncrease: 3 },
  loot: { label: 'Loot', base: 800, baseIncrease: 8 }
};

// Methoden
function updateTrCount(newValue) {
  // Stelle sicher, dass der Wert zwischen 1 und 999 liegt
  newValue = Math.max(1, Math.min(999, newValue));
  
  trCount.value = newValue;
  updateStore();
}

function updateCurrentLevel(type, newValue) {
  const cap = typeof upgradeCaps.value[type] === 'number' ? upgradeCaps.value[type] : 999;
  
  // Stelle sicher, dass der Wert nicht negativ ist und das Cap nicht überschreitet
  newValue = Math.max(0, Math.min(cap, newValue));
  
  // Aktualisiere den aktuellen Level
  currentLevels.value[type] = newValue;
  
  // Wenn der Ziellevel niedriger ist als der aktuelle, passe ihn an
  if (targetLevels.value[type] < newValue) {
    targetLevels.value[type] = newValue;
  }
  
  updateStore();
}

function updateTargetLevel(type, newValue) {
  // Wenn der Wert über der Buttons-Untergrenze (currentLevels) liegt oder
  // wenn wir im Edit-Modus sind und der Benutzer tippt gerade
  if (newValue >= currentLevels.value[type] || document.activeElement.classList.contains('value-display')) {
    // Speichere den Wert direkt, ohne Validierung
    targetLevels.value[type] = newValue;
    ultimaStore.updateTargetLevel(type, newValue);
  } else {
    // Benutzer hat auf Minus-Button geklickt, aber Wert wäre unter Current
    // Wert auf Current begrenzen
    targetLevels.value[type] = currentLevels.value[type];
    ultimaStore.updateTargetLevel(type, currentLevels.value[type]);
  }
}

// Und eine neue Funktion für die Validierung 
// (wird von TRValueControls über finalize:value aufgerufen)
function finalizeTargetLevel(type) {
  // Bei Fokus-Verlust oder Enter-Taste validieren
  const currentValue = currentLevels.value[type];
  const cap = typeof upgradeCaps.value[type] === 'number' ? upgradeCaps.value[type] : 999;
  
  // Validiere den Wert nicht unter dem aktuellen Level
  targetLevels.value[type] = Math.max(currentValue, Math.min(cap, targetLevels.value[type]));
  
  // Update the store with the validated value
  ultimaStore.updateTargetLevel(type, targetLevels.value[type]);
}

function updateStore() {
  ultimaStore.updateTRCount(trCount.value);
  
  for (const type in currentLevels.value) {
    ultimaStore.updateCurrentLevel(type, currentLevels.value[type]);
  }
  
  for (const type in targetLevels.value) {
    ultimaStore.updateTargetLevel(type, targetLevels.value[type]);
  }
}

function getMilestoneBonusFactor(isLoot = false) {
  // Alle 50 Level gibt es einen x1.05 Bonus (für Loot x1.02)
  const milestoneCount = Math.floor(totalLevels.value / 50);
  
  if (isLoot) {
    return Math.pow(1.02, milestoneCount);
  } else {
    return Math.pow(1.05, milestoneCount);
  }
}

function applyTargetLevels() {
  ultimaStore.applyTargetLevels();
  // UI-State aktualisieren
  for (const type in ultimaStore.currentLevels) {
    currentLevels.value[type] = ultimaStore.currentLevels[type];
  }
}

// Tab-Index Hilfsfunktionen
function getTabIndexForCurrentLevel(upgradeType) {
  // Bestimme die Position des Upgrade-Typs in der Liste
  const types = Object.keys(upgradesList);
  const index = types.indexOf(upgradeType);
  // Weisen wir Current-Feldern Indizes 1-7 zu (basierend auf der Anzahl der Upgrades)
  return index + 1;
}

function getTabIndexForTargetLevel(upgradeType) {
  // Bestimme die Position des Upgrade-Typs in der Liste
  const types = Object.keys(upgradesList);
  const index = types.indexOf(upgradeType);
  // Wir weisen Target-Feldern Indizes 8-14 zu (nach allen Current-Feldern)
  return types.length + index + 1;
}

function resetForm() {
  // Für jedes Upgrade den Target-Level auf den Current-Level zurücksetzen
  for (const type in currentLevels.value) {
    targetLevels.value[type] = currentLevels.value[type];
    // Store aktualisieren
    ultimaStore.updateTargetLevel(type, currentLevels.value[type]);
  }
}

function isUpgradeLocked(type) {
  return ultimaStore.isUpgradeLocked(type);
}

// Format-Funktionen
function formatCost(cost) {
  if (typeof cost !== 'number') return cost;
  if (cost >= 1000000) return Math.floor(cost / 10000) / 100 + 'M';
  if (cost >= 10000) return Math.floor(cost / 100) / 10 + 'K';
  return cost;
}

function formatBonus(bonus) {
  if (typeof bonus !== 'number') return bonus;
  
  // Für Loot-Bonus 4 Nachkommastellen, für alle anderen 2
  if (bonus === currentBonuses.value.loot || bonus === targetBonuses.value.loot) {
    return 'x' + bonus.toFixed(4);
  } else {
    return 'x' + bonus.toFixed(2);
  }
}

function formatFactor(factor) {
  if (typeof factor !== 'number') return factor;
  return 'x' + factor.toFixed(4);
}


// Initialisierung
onMounted(() => {
  // Initialisierung
});
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
}

/* Scrollbare Tabelle mit fixierten Headers */
table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed; /* Wichtig für gleichmäßige Spaltenbreiten */
  width: 100%;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: rgba(17, 24, 39, 0.95);
}

/* Verbesserte Zentrierung für die Zellen */
td.text-center {
  text-align: center;
}

/* Container für die ValueControls innerhalb der Zellen */
td.text-center > div {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Anpassungen für TRValueControls in der Tabelle */
:deep(.value-controls) {
  height: 2rem;
  width: 5.5rem;
  margin: 0 auto;
  display: inline-flex; /* Wichtig für die Zentrierung */
}

:deep(.value-controls .value-display) {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}

:deep(.value-controls .control-button) {
  width: 1.75rem;
  height: 1.75rem;
}

@media (max-width: 640px) {
  :deep(.value-controls) {
    height: 1.75rem;
    width: 4.5rem;
  }
  
  :deep(.value-controls .value-display) {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
  }
  
  :deep(.value-controls .control-button) {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>