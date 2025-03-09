<!-- filepath: /c:/Users/igorn/projects/huntersim2/src/views/upgrades/GemsView.vue -->
<template>
  <div class="p-4 sm:p-6 max-w-[1440px] mx-auto">
    <div class="bg-gray-900/95 rounded-xl p-4 sm:p-8">
      <!-- Überschrift -->
      <h2 class="text-3xl font-bold mb-6 text-center text-white">Gems</h2>
      
      <!-- Loading Indicator -->
      <div v-if="loading" class="flex justify-center items-center p-12">
        <div class="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <!-- Gems Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div 
          v-for="gem in gems" 
          :key="gem.id"
          class="bg-gray-800/30 p-4 rounded-lg border border-gray-700 flex flex-col"
          :class="{
            'border-red-800/50': gem.color === 'red',
            'border-blue-800/50': gem.color === 'blue',
            'border-purple-800/50': gem.color === 'purple',
            'border-yellow-800/50': gem.color === 'yellow',
            'border-gray-800/50': !gem.color || gem.color === 'gray'
          }"
        >
          <!-- Gem Header -->
          <div class="px-4 py-3">
            <UpgradeHeader 
              :name="gem.name"
              :level="getGemLevel(gem)"
              :max-level="gem.maxLevel"
              :color="gem.color"
              :compact="true"
            />
          </div>
          
          <!-- Gem Body -->
          <div class="p-4">
            <!-- Gem Level -->
            <div class="mb-5">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-300 text-sm">Gem Level</span>
                <div class="flex items-center">
                  <button 
                    @click="decreaseGemLevel(gem)"
                    class="flex justify-center items-center p-1.5 bg-gray-900 hover:bg-gray-800 rounded-l border-r border-gray-700"
                    :disabled="getGemLevel(gem) <= 0"
                    :class="{ 'opacity-30 cursor-not-allowed': getGemLevel(gem) <= 0 }"
                  >
                    <IconChevronLeft size="16" />
                  </button>
                  
                  <div class="px-4 py-1.5 bg-gray-900 text-center min-w-[48px]">
                    {{ getGemLevel(gem) }}
                  </div>
                  
                  <button 
                    @click="increaseGemLevel(gem)"
                    class="flex justify-center items-center p-1.5 bg-gray-900 hover:bg-gray-800 rounded-r border-l border-gray-700"
                    :disabled="getGemLevel(gem) >= gem.maxLevel"
                    :class="{ 'opacity-30 cursor-not-allowed': getGemLevel(gem) >= gem.maxLevel }"
                  >
                    <IconChevronRight size="16" />
                  </button>
                </div>
              </div>
              
              <!-- Level Progress Bar -->
              <div class="w-full bg-gray-900 rounded-full h-2 mt-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300 ease-out"
                  :class="`bg-${gem.color}-500`"
                  :style="`width: ${(getGemLevel(gem) / gem.maxLevel) * 100}%`"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>Max: {{ gem.maxLevel }}</span>
              </div>
            </div>
            
            <!-- Nodes Section -->
            <div v-if="gem.nodes && gem.nodes.length > 0" class="space-y-4 mt-6">
              <h4 class="text-white text-sm font-medium mb-2 border-b border-gray-700/40 pb-1">
                Gem Nodes
              </h4>
              
              <!-- Boolean Nodes -->
              <div 
                v-for="node in gem.nodes.filter(n => n.type === 'boolean')"
                :key="`${gem.id}-${node.id}`"
                class="flex justify-between items-center bg-gray-900/60 rounded-md p-3"
              >
                <div>
                  <div class="text-sm font-medium text-white">{{ node.name }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ node.effect }}</div>
                </div>
                
                <!-- Toggle Switch -->
                <div class="flex items-center">
                  <button
                    @click="toggleGemNode(gem, node)"
                    class="relative inline-flex items-center cursor-pointer"
                    :disabled="getGemLevel(gem) <= 0"
                    :class="{ 'opacity-30 cursor-not-allowed': getGemLevel(gem) <= 0 }"
                  >
                    <div
                      class="w-11 h-6 rounded-full transition-colors duration-200"
                      :class="getNodeValue(gem, node) ? `bg-${gem.color}-600` : 'bg-gray-700'"
                    ></div>
                    <div
                      class="absolute inset-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out"
                      :class="getNodeValue(gem, node) ? 'translate-x-5' : ''"
                    ></div>
                  </button>
                </div>
              </div>
              
              <!-- Level Nodes -->
              <div
                v-for="node in gem.nodes.filter(n => n.type === 'level')"
                :key="`${gem.id}-${node.id}`"
                class="bg-gray-900/60 rounded-md p-3"
              >
                <div class="flex justify-between items-center mb-2">
                  <div>
                    <div class="text-sm font-medium text-white">{{ node.name }}</div>
                    <div class="text-xs text-gray-400 mt-0.5">{{ node.effect }}</div>
                  </div>
                  
                  <!-- Level Controls -->
                  <div class="flex items-center">
                    <button
                      @click="decreaseNodeLevel(gem, node)"
                      class="flex justify-center items-center p-1 bg-gray-800 rounded-l border-r border-gray-700"
                      :disabled="getNodeValue(gem, node) <= 0 || getGemLevel(gem) <= 0"
                      :class="{ 'opacity-30 cursor-not-allowed': getNodeValue(gem, node) <= 0 || getGemLevel(gem) <= 0 }"
                    >
                      <IconChevronLeft size="16" />
                    </button>
                    
                    <div class="px-3 py-1 bg-gray-800 text-center text-sm min-w-[40px]">
                      {{ getNodeValue(gem, node) }}
                    </div>
                    
                    <button
                      @click="increaseNodeLevel(gem, node)"
                      class="flex justify-center items-center p-1 bg-gray-800 rounded-r border-l border-gray-700"
                      :disabled="getNodeValue(gem, node) >= node.maxLevel || getGemLevel(gem) <= 0"
                      :class="{ 'opacity-30 cursor-not-allowed': getNodeValue(gem, node) >= node.maxLevel || getGemLevel(gem) <= 0 }"
                    >
                      <IconChevronRight size="16" />
                    </button>
                  </div>
                </div>
                
                <!-- Node Progress Bar -->
                <div class="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                  <div
                    class="h-1.5 rounded-full transition-all duration-300 ease-out"
                    :class="`bg-${gem.color}-500`"
                    :style="`width: ${(getNodeValue(gem, node) / node.maxLevel) * 100}%`"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>Max: {{ node.maxLevel }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHunterStore } from '@/store/hunterStore';
import { getUpgrades } from '@/utils/upgradeUtils';
import UpgradeHeader from '@/components/upgrades/UpgradeHeader.vue';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconMinus, 
  IconPlus 
} from '@tabler/icons-vue';

// Store für Upgrades
const hunterStore = useHunterStore();

// Gems und Status
const gems = ref([]);
const loading = ref(true);
const category = 'gems';

// Beim Mounten die Gems laden
onMounted(async () => {
  loading.value = true;
  try {
    // Alle Gems laden
    gems.value = getUpgrades(category);
  } catch (error) {
    console.error(`Error loading ${category}:`, error);
  } finally {
    loading.value = false;
  }
});

// Helper-Funktionen
function getGemLevel(gem) {
  return hunterStore.getUpgradeValue(category, gem.id) || 0;
}

function getNodeValue(gem, node) {
  return hunterStore.getUpgradeValue(`${category}_nodes`, `${gem.id}_${node.id}`) || 0;
}

function increaseGemLevel(gem) {
  const currentLevel = getGemLevel(gem);
  if (currentLevel < gem.maxLevel) {
    hunterStore.updateUpgrade(category, gem.id, currentLevel + 1);
  }
}

function decreaseGemLevel(gem) {
  const currentLevel = getGemLevel(gem);
  if (currentLevel > 0) {
    hunterStore.updateUpgrade(category, gem.id, currentLevel - 1);
  }
}

function toggleGemNode(gem, node) {
  if (getGemLevel(gem) <= 0) return; // Gem muss aktiviert sein
  
  const currentValue = getNodeValue(gem, node);
  const newValue = currentValue > 0 ? 0 : 1;
  hunterStore.updateUpgrade(`${category}_nodes`, `${gem.id}_${node.id}`, newValue);
}

function increaseNodeLevel(gem, node) {
  if (getGemLevel(gem) <= 0) return; // Gem muss aktiviert sein

  const currentLevel = getNodeValue(gem, node);
  if (currentLevel < node.maxLevel) {
    hunterStore.updateUpgrade(`${category}_nodes`, `${gem.id}_${node.id}`, currentLevel + 1);
  }
}

function decreaseNodeLevel(gem, node) {
  if (getGemLevel(gem) <= 0) return; // Gem muss aktiviert sein
  
  const currentLevel = getNodeValue(gem, node);
  if (currentLevel > 0) {
    hunterStore.updateUpgrade(`${category}_nodes`, `${gem.id}_${node.id}`, currentLevel - 1);
  }
}
</script>

<style scoped>
/* Safe Tailwind classes für dynamische Farben */
.border-red-800\/50,
.border-blue-800\/50,
.border-purple-800\/50,
.border-yellow-800\/50,
.border-gray-800\/50,
.bg-red-500,
.bg-green-500,
.bg-blue-500,
.bg-purple-500,
.bg-yellow-500,
.bg-gray-500,
.bg-red-600,
.bg-green-600,
.bg-blue-600,
.bg-purple-600,
.bg-yellow-600 {
  /* Diese Klassen sind leer, werden aber von Tailwind erkannt */
}
</style>