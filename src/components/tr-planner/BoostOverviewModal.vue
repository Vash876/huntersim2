<template>
  <div 
    v-if="isVisible" 
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4"
    @click.self="emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base font-bold text-white truncate mr-2">
            <span class="text-blue-400">Orb Calculator</span>
            <span class=""> - TR Overview</span>
          </h2>
          <div class="flex items-center">
            <button 
              @click="emit('close')"
              class="p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- General Info Summary -->
      <div class="p-2 bg-gray-750/60 border-b border-gray-700">
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div>
            <span class="text-gray-400">TR Count:</span>
            <span class="text-white ml-1">{{ trCount }}</span>
          </div>
          <div>
            <span class="text-gray-400">All-Time Orbs:</span>
            <span class="text-white ml-1">{{ formatNumber(allTimeOrbs) }}</span>
          </div>
          <div>
            <span class="text-gray-400">Requirement:</span>
            <span class="text-white ml-1">{{ formatNumber(orbRequirement) }}</span>
          </div>
          <div>
            <span class="text-gray-400">Current Gain:</span>
            <span class="text-white ml-1">{{ formatNumber(orbGain) }}</span>
          </div>
          <div>
            <span class="text-gray-400">Target Gain:</span>
            <span :class="targetOrbGain >= orbRequirement ? 'text-green-400' : 'text-red-400'" class="ml-1">{{ formatNumber(targetOrbGain) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Boost Categories in Compact View -->
      <div class="p-1.5" ref="printableContent">
        <div class="grid grid-cols-2 gap-1.5">
          <div 
            v-for="category in categoryGroups" 
            :key="category.id" 
            class="bg-gray-750 border border-gray-700 rounded p-1"
          >
            <h3 class="text-xs font-medium text-blue-400 mb-0.5 border-b border-gray-700/50 pb-0.5">{{ category.label }}</h3>
            <div class="grid grid-cols-1 gap-0.5">
              <!-- Boost-Zeile mit mobiloptimiertem Layout -->
              <div v-for="boost in category.boosts" :key="boost.key" 
                   class="text-[12px] items-center border-gray-700/30 last:border-b-0 py-0.5">
                <!-- Mobile-Layout: Boost-Name links, Werte rechts -->
                <div class="sm:hidden flex justify-between items-center">
                  <!-- Boost-Name -->
                  <div class="text-gray-300 truncate">{{ boost.label }}:</div>
                  
                  <!-- Werte rechtsbündig -->
                  <div class="flex items-center">
                    <!-- Current Value -->
                    <div class="text-right">
                      <template v-if="boost.type === 'boolean'">
                        <span :class="combinedCurrentStats[boost.key] ? 'text-white' : 'text-red-400'">
                          {{ combinedCurrentStats[boost.key] ? 'ON' : 'OFF' }}
                        </span>
                      </template>
                      <template v-else>
                        <span :class="combinedCurrentStats[boost.key] > 0 ? 'text-white' : 'text-gray-400'">
                          {{ combinedCurrentStats[boost.key] || 0 }}
                        </span>
                      </template>
                    </div>
                    
                    <!-- Pfeil statt Separator -->
                    <div class="text-gray-500 px-1"><IconArrowRight size="12" class="text-green-500" /></div>
                    
                    <!-- Target Value -->
                    <div class="text-left">
                      <template v-if="boost.type === 'boolean'">
                        <span :class="{
                          'text-green-400': targetStats[boost.key] && !combinedCurrentStats[boost.key],
                          'text-white': targetStats[boost.key] && combinedCurrentStats[boost.key],
                          'text-red-400': !targetStats[boost.key] && !combinedCurrentStats[boost.key]
                        }">
                          {{ (targetStats[boost.key] || combinedCurrentStats[boost.key]) ? 'ON' : 'OFF' }}
                        </span>
                      </template>
                      <template v-else>
                        <span :class="{
                          'text-green-400': (targetStats[boost.key] || 0) > (combinedCurrentStats[boost.key] || 0),
                          'text-white': (targetStats[boost.key] || 0) <= (combinedCurrentStats[boost.key] || 0) && (combinedCurrentStats[boost.key] > 0),
                          'text-gray-400': (targetStats[boost.key] || 0) <= (combinedCurrentStats[boost.key] || 0) && (combinedCurrentStats[boost.key] <= 0)
                        }">
                          {{ Math.max(targetStats[boost.key] || 0, combinedCurrentStats[boost.key] || 0) }}
                        </span>
                      </template>
                    </div>
                  </div>
                </div>
                
                <!-- Desktop-Layout mit Grid-System -->
                <div class="hidden sm:grid grid-cols-12 items-center">
                  <div class="col-span-5 text-gray-300 truncate pr-1">{{ boost.label }}:</div>
                  
                  <!-- Current Value -->
                  <div class="text-right pr-1">
                    <template v-if="boost.type === 'boolean'">
                      <span :class="combinedCurrentStats[boost.key] ? 'text-white' : 'text-red-400'">
                        {{ combinedCurrentStats[boost.key] ? 'ON' : 'OFF' }}
                      </span>
                    </template>
                    <template v-else>
                      <span :class="combinedCurrentStats[boost.key] > 0 ? 'text-white' : 'text-gray-400'">
                        {{ combinedCurrentStats[boost.key] || 0 }}
                      </span>
                    </template>
                  </div>

                  <!-- Separator für Desktop -->
                  <div class="text-gray-500 text-center"><IconArrowRight size="12" class="text-green-500" /></div>

                  <!-- Target Value -->
                  <div class="text-left pl-1">
                    <template v-if="boost.type === 'boolean'">
                      <span :class="{
                        'text-green-400': targetStats[boost.key] && !combinedCurrentStats[boost.key],
                        'text-white': targetStats[boost.key] && combinedCurrentStats[boost.key],
                        'text-red-400': !targetStats[boost.key] && !combinedCurrentStats[boost.key]
                      }">
                        {{ (targetStats[boost.key] || combinedCurrentStats[boost.key]) ? 'ON' : 'OFF' }}
                      </span>
                    </template>
                    <template v-else>
                      <span :class="{
                        'text-green-400': (targetStats[boost.key] || 0) > (combinedCurrentStats[boost.key] || 0),
                        'text-white': (targetStats[boost.key] || 0) <= (combinedCurrentStats[boost.key] || 0) && (combinedCurrentStats[boost.key] > 0),
                        'text-gray-400': (targetStats[boost.key] || 0) <= (combinedCurrentStats[boost.key] || 0) && (combinedCurrentStats[boost.key] <= 0)
                      }">
                        {{ Math.max(targetStats[boost.key] || 0, combinedCurrentStats[boost.key] || 0) }}
                      </span>
                    </template>
                  </div>
                  
                  <!-- Cost Display für Desktop -->
                  <div class="col-span-4 text-right text-amber-400">
                    {{ boost.type !== 'boolean' && 
                       targetStats[boost.key] > combinedCurrentStats[boost.key] && 
                       getBoostCost(boost, combinedCurrentStats[boost.key] || 0, targetStats[boost.key]) ? 
                       getBoostCost(boost, combinedCurrentStats[boost.key] || 0, targetStats[boost.key]).formattedValue : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug Panel - direkt vor dem Footer einfügen 
      <div class="bg-gray-900 p-2 border-t border-gray-600" v-if="showDebugPanel">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xs font-bold text-yellow-400">LocalStorage Debug</h3>
          <button @click="refreshDebugData" class="text-xs px-2 py-0.5 bg-blue-700 hover:bg-blue-600 rounded">
            Refresh
          </button>
        </div>
        
        <div class="bg-black/50 p-2 rounded text-[10px] font-mono max-h-64 overflow-y-auto">
          <template v-if="debugStorageData.length > 0">
            <div v-for="(item, index) in debugStorageData" :key="index" class="mb-1">
              <div class="text-blue-300">{{ item.key }}:</div>
              <div class="pl-2 text-green-300 break-all whitespace-pre-wrap">{{ item.value }}</div>
            </div>
          </template>
          <div v-else class="text-red-400">No local storage data found</div>
        </div>
      </div>-->

      <!-- Footer buttons -->
      <div class="bg-gray-800 p-2 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <button
            @click="copyToClipboard"
            class="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center"
          >
            <IconCopy size="14" class="mr-1" />
            Copy to clipboard
          </button>
          <button 
            @click="emit('close')"
            class="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { allBoosts, boostCategories } from '@/constants/tr-planner';
import { formatNumber } from '@/composables/format';
import { getRelicCost, formatRelicCost } from '@/utils/relicCostUtils';
import { getInscryptionCost, formatInscryptionCost } from '@/utils/inscryptionCostUtils';
import { getGadgetCost, formatGadgetCost } from '@/utils/gadgetCostUtils';
import { getM0Cost, formatM0Cost, calculateM0CostRangeSafe } from '@/utils/m0CostUtils';
import { LOOP_MODS, getLoopModCost, formatLoopModCost, calculateLoopModCostRangeSafe } from '@/utils/loopModCostUtils';
import { IconX, IconCopy, IconArrowRight } from '@tabler/icons-vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  currentStats: {
    type: Object,
    default: () => ({})
  },
  targetStats: {
    type: Object,
    default: () => ({})
  },
  trCount: {
    type: Number,
    default: 0
  },
  allTimeOrbs: {
    type: Number,
    default: 0
  },
  orbRequirement: {
    type: Number,
    default: 0
  },
  orbGain: {
    type: Number,
    default: 0
  },
  targetOrbGain: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close']);
const printableContent = ref(null);

const maxLevelStats = computed(() => {
  try {
    const storedStats = localStorage.getItem('trplanner_userstats');
    if (storedStats) {
      return JSON.parse(storedStats);
    }
  } catch (e) {
    console.error("Error reading maxLevelStats from localStorage:", e);
  }
  return {};
});

// Kombiniere die Stats für die vollständige Anzeige
const combinedCurrentStats = computed(() => {
  const combined = { ...props.currentStats };
  
  // Für maxed boosts die Werte aus maxLevelStats übernehmen
  for (const [key, value] of Object.entries(maxLevelStats.value)) {
    const boost = allBoosts.find(b => b.key === key);
    if (!boost) continue;
    
    if (boost.type === 'boolean' && value === true) {
      combined[key] = true;
    } else if (typeof value === 'number' && boost.max !== undefined && value >= boost.max) {
      combined[key] = value;
    }
  }
  
  return combined;
});

const categoryGroups = computed(() => {
  const result = [];
  
  // Für jede Kategorie nur Boosts mit orbcalc: true anzeigen
  for (const category of boostCategories) {
    // Nur Boosts mit orbcalc: true einbeziehen
    const boostsInCategory = allBoosts.filter(boost => 
      boost.category === category.id && boost.orbcalc === true
    );
    
    if (boostsInCategory.length > 0) {
      result.push({
        id: category.id,
        label: category.label,
        boosts: boostsInCategory.sort((a, b) => {
          // Then alphabetically by label
          return a.label.localeCompare(b.label);
        })
      });
    }
  }
  
  return result;
});

// Copy content to clipboard
async function copyToClipboard() {
  if (!printableContent.value) return;
  
  try {
    // Create a text representation of boosts
    let text = "=== TR Overview ===\n";
    text += `TR Count: ${props.trCount}\n`;  // Direct prop access
    text += `All-Time Orbs: ${formatNumber(props.allTimeOrbs)}\n`;  // Direct prop access
    text += `Orb Requirement: ${formatNumber(props.orbRequirement)}\n`;  // Direct prop access
    text += `Current Gain: ${formatNumber(props.orbGain)}\n\n`;  // Direct prop access
    text += `Target Gain: ${formatNumber(props.targetOrbGain)}\n\n`;
    
    for (const category of categoryGroups.value) {
      text += `--- ${category.label} ---\n`;
      for (const boost of category.boosts) {
        // Hier kombinierte Stats verwenden!
        const currentValue = combinedCurrentStats.value[boost.key] || 0;
        const targetValue = props.targetStats[boost.key] || 0;
        let valueText;
        
        if (boost.type === 'boolean') {
          const current = currentValue ? 'ON' : 'OFF';
          const target = targetValue ? 'ON' : 'OFF';
          valueText = `${current} → ${target}`;
        } else {
          valueText = `${currentValue} → ${targetValue}`;
          if (boost.max) valueText += ` (max: ${boost.max})`;
        }
        
        text += `${boost.label}: ${valueText}\n`;
      }
      text += "\n";
    }
    
    await navigator.clipboard.writeText(text);
    alert("Boost overview copied to clipboard!");
  } catch (e) {
    console.error("Failed to copy to clipboard:", e);
    alert("Error copying to clipboard.");
  }
}

// Berechnet die Kosten für einen Boost
// Berechnet die Kosten für einen Boost
function getBoostCost(boost, currentValue, targetValue) {
  if (targetValue <= currentValue) return null; // Keine Kosten wenn kein Upgrade
  if (boost.type === 'boolean') return null; // Boolean-Boosts haben keine direkten Kosten
  
  // Bestimme den Boost-Typ basierend auf der Kategorie
  const category = boost.category;
  let totalCost = 0;
  
  try {
    // Spezialfall für Milestone #0
    if (boost.key === 'ms0') {
      return {
        value: "m0-special",
        formattedValue: calculateM0CostRangeSafe(currentValue, targetValue),
        type: 'orbs'
      };
    }
    
    // Spezialfall für Loop Mods
    if (boost.key === 'lmConsistency') {
      return {
        value: "loopmod-special",
        formattedValue: calculateLoopModCostRangeSafe(LOOP_MODS.RULE_OF_CONSISTENCY, targetValue-1, targetValue),
        type: 'loopmod'
      };
    }

    switch(category) {
      case 'relic':
        // Berechne Relic-Kosten für jedes Level einzeln (T1 und T2 Relics)
        for (let level = currentValue + 1; level <= targetValue; level++) {
          totalCost += getRelicCost(boost.key, level);
        }
        return {
          value: totalCost,
          formattedValue: formatRelicCost(totalCost),
          type: 'fragments'
        };
        
      case 'inscryption':
        // Berechne Inscryption-Kosten für jedes Level einzeln
        if (boost.key.startsWith('i')) {
          for (let level = currentValue + 1; level <= targetValue; level++) {
            totalCost += getInscryptionCost(boost.key, level);
          }
          return {
            value: totalCost,
            formattedValue: formatInscryptionCost(totalCost),
            type: 'hellishBiomatter'
          };
        }
        break;
        
      case 'gadget':
        // Berechne Gadget-Kosten für jedes Level einzeln
        if (boost.key.startsWith('g') || boost.key === 'oogadget' || boost.key === 'campfragdet') {
          // Gadget-Typ ermitteln
          let gadgetType = boost.key;
          // Spezielle Mapping für bestimmte Gadgets
          if (boost.key === 'oogadget') gadgetType = 'g4';
          if (boost.key === 'campfragdet') gadgetType = 'g14';
          
          for (let level = currentValue + 1; level <= targetValue; level++) {
            totalCost += getGadgetCost(gadgetType, level);
          }
          
          return {
            value: totalCost,
            formattedValue: formatGadgetCost(totalCost),
            type: 'tessarects'
          };
        }
        break;
    }
  } catch (e) {
    console.error(`Fehler bei der Kostenberechnung für ${boost.key}:`, e);
  }
  
  return null;
}

// Debug-Panel State
const showDebugPanel = ref(true); // Auf false setzen, um standardmäßig zu verstecken
const debugStorageData = ref([]);

// Funktion zum Laden der localStorage-Daten
function refreshDebugData() {
  const data = [];
  
  try {
    // Alle trplanner-bezogenen Einträge sammeln
    Object.keys(localStorage)
      .filter(key => key.includes('trplanner'))
      .forEach(key => {
        data.push({
          key,
          value: localStorage.getItem(key)
        });
      });
    
    // Auch die maxLevelStats und combinedCurrentStats anzeigen
    data.push({
      key: '⚠️ maxLevelStats (computed)',
      value: JSON.stringify(maxLevelStats.value, null, 2)
    });
    
    data.push({
      key: '⚠️ combinedCurrentStats (computed)',
      value: JSON.stringify(combinedCurrentStats.value, null, 2)
    });
    
    debugStorageData.value = data;
  } catch (e) {
    console.error("Error loading debug data:", e);
    debugStorageData.value = [{ key: 'ERROR', value: e.toString() }];
  }
}

// Debug-Daten beim Laden des Modals initialisieren
onMounted(() => {
  if (props.isVisible) {
    refreshDebugData();
  }
});

// Debug-Daten aktualisieren, wenn das Modal angezeigt wird
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    refreshDebugData();
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}
</style>