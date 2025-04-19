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
            <span class=""> - Boost Overview</span>
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
              <div v-for="boost in category.boosts" :key="boost.key" class="grid grid-cols-8 text-[12px]">
                <div class="col-span-4 text-gray-300 truncate pr-1">{{ boost.label }}:</div>
                
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

                <!-- Separator -->
                <div class="text-gray-500 text-center">/</div>

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
                
                <!-- Max Value -->
                <div class="text-gray-200 text-right text-[10px] hidden sm:block" v-if="boost.max">
                  /{{ boost.max }}
                </div>
                <div v-else></div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
import { ref, computed } from 'vue';
import { allBoosts, boostCategories } from '@/constants/tr-planner';
import { formatNumber } from '@/composables/format';
import { calculateOrbRequirement, calculateOrbGainsCalc } from '@/composables/calculations';
import { IconX, IconCopy } from '@tabler/icons-vue';

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
  return {
    ...maxLevelStats.value,
    ...props.currentStats
  };
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

// Returns a CSS class based on the value
function getValueClass(boost, value) {
  if (boost.type === 'boolean') {
    return value ? 'text-green-400' : 'text-gray-400';
  }
  
  // For numeric boosts
  if (boost.max !== undefined) {
    if (value >= boost.max) return 'text-yellow-400'; // Max reached
    if (value > 0) return 'text-green-400'; // Partial
    return 'text-gray-400'; // Nothing
  }
  
  return value > 0 ? 'text-green-400' : 'text-gray-400';
}

// Copy content to clipboard
async function copyToClipboard() {
  if (!printableContent.value) return;
  
  try {
    // Create a text representation of boosts
    let text = "=== Boost Overview ===\n";
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