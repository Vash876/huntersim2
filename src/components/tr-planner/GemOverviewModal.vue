<template>
  <div 
    v-if="isVisible"
    class="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 flex items-center justify-center p-2 sm:p-4 pb-[70px] pt-[50px] sm:py-0"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in border border-gray-700"
      @click.stop="closeDropdowns"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-2.5 border-b border-gray-600 sticky top-0 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-base sm:text-lg font-bold text-white truncate mr-2">
            <span class="text-purple-400">TR Planner</span>
            <span class=""> - Gem Overview</span>
          </h2>
          <div class="flex items-center gap-2">
            <button 
              @click="maxAll" 
              class="px-2 py-1 sm:px-3 bg-green-600 hover:bg-green-500 text-xs sm:text-sm text-white rounded-md transition-colors"
            >
              Max All
            </button>
            <button 
              @click="selectAllNodes" 
              class="px-2 py-1 sm:px-3 bg-blue-600 hover:bg-blue-500 text-xs sm:text-sm text-white rounded-md transition-colors"
            >
              Select All Nodes
            </button>
            <button 
              @click="resetAll" 
              class="px-2 py-1 sm:px-3 bg-gray-600 hover:bg-gray-500 text-xs sm:text-sm text-white rounded-md transition-colors"
            >
              Reset
            </button>
            <button 
              @click="$emit('close')"
              class="p-1.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              <IconX size="16" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Description Area -->
      <div class="p-3 bg-gray-750/60 border-b border-gray-700">
        <p class="text-xs text-gray-300 mb-1">
          Set your current gem levels and active nodes for accurate TR calculations.
        </p>
        <p class="text-xs text-gray-400">
          This page helps track your player progress and only shows relevant boosts based on your current gem levels. This prevents new players from being overwhelmed or spoiled by seeing boosts they don't have access to yet.
        </p>
      </div>

      <!-- Gem-Diagramm mit Scroll-Container für Mobile -->
      <div class="p-6">
        <div class="gem-diagram-scroll-container">
          <div class="gem-diagram-container">
            <div class="gem-diagram">
              <!-- Hintergrundkreis -->
              <div class="gem-wheel-bg"></div>

              <!-- Verbindungslinien -->
              <svg class="gem-connection-lines">
                <!-- Linien von äußeren Gems zum Zentrum -->
                <line 
                  v-for="gem in gems.filter(g => g && g.id !== 'exodus' && g.position)" 
                  :key="`connection-${gem.id}`"
                  :x1="getCircleCenter().x" 
                  :y1="getCircleCenter().y" 
                  :x2="getGemPosition(gem.position.angle, gem.position.distanceFromCenter).x" 
                  :y2="getGemPosition(gem.position.angle, gem.position.distanceFromCenter).y"
                  :stroke="isGemActive(gem.id) ? getGemStrokeColor(gem.color) : 'rgba(75, 85, 99, 0.8)'"
                  stroke-width="2"
                  stroke-linecap="round"
                  :class="isGemActive(gem.id) ? `glow-${gem.color}` : ''"
                />

                <!-- Linien von Gems zu ihren Nodes -->
                <line 
                  v-for="line in gemNodeLines" 
                  :key="line.id"
                  :x1="getGemPosition(line.gem.position.angle, line.gem.position.distanceFromCenter).x"
                  :y1="getGemPosition(line.gem.position.angle, line.gem.position.distanceFromCenter).y"
                  :x2="getNodePositionFromAngle(line.node.angle).x"
                  :y2="getNodePositionFromAngle(line.node.angle).y"
                  :stroke="isNodeActive(line.gemId, line.node.id) ? getGemStrokeColor(line.gem.color) : 'rgba(156, 163, 175, 0.6)'"
                  :stroke-width="isNodeActive(line.gemId, line.node.id) ? '2' : '1'"
                  stroke-linecap="round"
                  :opacity="isNodeActive(line.gemId, line.node.id) ? '0.8' : '0.4'"
                  :class="isNodeActive(line.gemId, line.node.id) ? `glow-${line.gem.color}` : ''"
                />
              </svg>
              
              <!-- Exodus Gem im Zentrum with Custom Dropdown -->
              <div 
                v-if="getGemById('exodus')"
                class="gem exodus-gem"
              >
                <div class="gem-icon !bg-gradient-to-br !from-blue-700 !to-purple-400 p-2 rounded-lg shadow-glow transition-all duration-300" :class="{'active-gem': isGemActive('exodus')}">
                  <div class="flex flex-col items-center justify-center h-full">
                    <!-- Custom Dropdown für Exodus -->
                    <div class="custom-dropdown">
                      <div 
                        class="dropdown-trigger exodus-trigger"
                        @click="toggleDropdown('exodus')"
                      >
                        {{ gemLevels.exodus }}
                      </div>
                      <div 
                        v-if="openDropdown === 'exodus'"
                        class="dropdown-menu exodus-menu"
                      >
                        <div 
                          v-for="level in (getGemById('exodus')?.maxLevel + 1)" 
                          :key="level - 1"
                          class="dropdown-option exodus-option"
                          @click="selectLevel('exodus', level - 1)"
                        >
                          {{ level - 1 }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="gem-name exodus-name">EXODUS</div>
              </div>

              <!-- Andere Gems im Kreis mit Custom Dropdown -->
              <div 
                v-for="gem in gems.filter(g => g && g.id !== 'exodus')" 
                :key="gem.id"
                class="gem"
                :class="[`gem-${gem.id}`]"
                :style="getGemPositionStyle(gem.position?.angle, gem.position?.distanceFromCenter)"
              >
                <div class="gem-icon" :class="{'active-gem': isGemActive(gem.id)}">
                  <div class="flex flex-col items-center justify-center h-full">
                    <!-- Custom Dropdown für jedes Gem -->
                    <div class="custom-dropdown">
                      <div 
                        :class="`dropdown-trigger gem-trigger gem-trigger-${gem.color}`"
                        @click="toggleDropdown(gem.id)"
                      >
                        {{ gemLevels[gem.id] }}
                      </div>
                      <div 
                        v-if="openDropdown === gem.id"
                        :class="`dropdown-menu gem-menu gem-menu-${gem.color}`"
                      >
                        <div 
                          v-for="level in (gem.maxLevel + 1)" 
                          :key="level - 1"
                          :class="`dropdown-option gem-option gem-option-${gem.color}`"
                          @click="selectLevel(gem.id, level - 1)"
                        >
                          {{ level - 1 }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="gem-name" :style="getGemNameStyle(gem.color)">{{ gem.name.toUpperCase() }}</div>
              </div>

              <!-- Nodes (klickbar zum Togglen) -->
              <template v-for="gem in gems.filter(g => g && g.id !== 'exodus')" :key="`nodes-${gem.id}`">
                <div 
                  v-if="gemNodes[gem.id]"
                  v-for="node in gemNodes[gem.id]" 
                  :key="`${gem.id}-node-${node.id}`"
                  class="node"
                  :style="getNodePositionStyle(gem.id, node.id)"
                  :class="{'active-node': isNodeActive(gem.id, node.id)}"
                  @click.stop="toggleNode(gem.id, node.id)"
                >
                  <div class="node-circle" :class="getNodeColorClass(gem.id, node.id)">
                    {{ node.id + 1 }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Footer -->
      <div class="bg-gray-800 p-3 border-t border-gray-700 sticky bottom-0 z-10">
        <div class="flex justify-between items-center">
          <div class="text-xs text-gray-300">
          </div>
          <div class="flex space-x-2">
            <button 
              @click="$emit('close')"
              class="px-2 py-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-md text-xs"
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Auto-Deactivation Notification -->
  <div 
    v-if="showNotification"
    class="fixed top-4 right-4 z-[60] bg-blue-900/90 border border-blue-700 rounded-lg p-3 shadow-lg animate-fade-in max-w-sm"
  >
    <div class="flex items-start">
      <IconCircleCheck size="16" class="text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <p class="text-blue-200 text-xs font-medium mb-1">Maxed Boosts Updated</p>
        <p class="text-blue-300 text-xs">{{ notificationMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { gemTypes, gemNodes, getAllGemData } from '@/constants/tr-planner/gems.js';
import { useTRPlannerStore } from '@/store/orbStore';
import { IconX, IconCircleCheck } from '@tabler/icons-vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const trPlannerStore = useTRPlannerStore();

// Gem-Daten laden
const gems = ref([]);
const circleCenter = ref({ x: 300, y: 300 });

// Gem-Levels und aktive Nodes - mit Store-Integration
const gemLevels = reactive({
  exodus: 0,
  temporal: 0,
  innovation: 0,
  attraction: 0,
  power: 0,
  creation: 0,
  evolution: 0
});

const activeNodes = reactive({
  temporal: [],
  innovation: [],
  attraction: [],
  power: [],
  creation: [],
  evolution: []
});

// Computed für Node-Linien
const gemNodeLines = computed(() => {
  const lines = [];
  
  gems.value.forEach(gem => {
    if (gem && gem.id !== 'exodus' && gem.position) {
      const nodes = gemNodes[gem.id] || [];
      nodes.forEach(node => {
        if (node && typeof node.angle === 'number') {
          lines.push({
            id: `${gem.id}-node-${node.id}`,
            gemId: gem.id,
            gem: gem,
            node: node
          });
        }
      });
    }
  });
  
  return lines;
});

// Computed
const activeGemsCount = computed(() => {
  return Object.values(gemLevels).filter(level => level > 0).length;
});

const activeNodesCount = computed(() => {
  return Object.values(activeNodes).reduce((total, nodes) => total + nodes.length, 0);
});

// Hilfsfunktionen mit Mobile-Skalierung
function getGemById(id) {
  return (gems.value || []).find(gem => gem && gem.id === id) || null;
}

function isMobile() {
  return window.innerWidth <= 768;
}

function getScaleFactor() {
  return isMobile() ? 0.5 : 1;
}

function getCircleCenter() {
  const scale = getScaleFactor();
  return {
    x: 300 * scale,
    y: 300 * scale
  };
}

function getGemPosition(angle = 0, distance = 0) {
  const scale = getScaleFactor();
  const rad = ((angle - 90) * Math.PI) / 180;
  const center = getCircleCenter();
  const x = center.x + (distance * scale) * Math.cos(rad);
  const y = center.y + (distance * scale) * Math.sin(rad);
  return { x, y };
}

function getGemPositionStyle(angle = 0, distance = 0) {
  const position = getGemPosition(angle, distance);
  return {
    top: `${position.y}px`,
    left: `${position.x}px`,
    transform: 'translate(-50%, -50%)'
  };
}

function getNodePositionStyle(gemId, nodeId) {
  const gem = getGemById(gemId);
  if (!gem) return {};
  
  const nodeList = gemNodes[gemId] || [];
  const node = nodeList.find(n => n && n.id === nodeId);
  if (!node) return {};
  
  const scale = getScaleFactor();
  const nodeRadius = 280 * scale;
  const rad = ((node.angle - 90) * Math.PI) / 180;
  const center = getCircleCenter();
  const x = center.x + nodeRadius * Math.cos(rad);
  const y = center.y + nodeRadius * Math.sin(rad);

  return {
    top: `${y}px`,
    left: `${x}px`,
    transform: 'translate(-50%, -50%)'
  };
}

function updateCircleCenter() {
  circleCenter.value = getCircleCenter();
}

function getNodePositionFromAngle(angle) {
  const scale = getScaleFactor();
  const nodeRadius = 280 * scale;
  const rad = ((angle - 90) * Math.PI) / 180;
  const center = getCircleCenter();
  const x = center.x + nodeRadius * Math.cos(rad);
  const y = center.y + nodeRadius * Math.sin(rad);
  return { x: x, y: y };
}

function isGemActive(gemId) {
  return gemLevels[gemId] > 0;
}

function isNodeActive(gemId, nodeId) {
  return activeNodes[gemId]?.includes(nodeId) || false;
}

function getGemStrokeColor(color) {
  const colorMap = {
    'red': 'rgba(239, 68, 68, 0.8)',
    'lime': 'rgba(132, 204, 22, 0.8)',
    'cyan': 'rgba(6, 182, 212, 0.8)',
    'purple': 'rgba(168, 85, 247, 0.8)',
    'orange': 'rgba(249, 115, 22, 0.8)',
    'green': 'rgba(34, 197, 94, 0.8)',
    'pink': 'rgba(244, 114, 182, 0.8)'
  };
  return colorMap[color] || 'rgba(75, 85, 99, 0.3)';
}

function getGemNameStyle(color) {
  const colorMap = {
    'red': '#fca5a5',      // text-red-300
    'lime': '#bef264',     // text-lime-300  
    'cyan': '#67e8f9',     // text-cyan-300
    'purple': '#c4b5fd',   // text-purple-300
    'orange': '#fdba74',   // text-orange-300
    'green': '#86efac',    // text-green-300
    'pink': '#f9a8d4'      // text-pink-300
  };
  
  return {
    color: colorMap[color] || '#d1d5db' // text-gray-300 als fallback
  };
}

function getNodeColorClass(gemId, nodeId) {
  const isActive = isNodeActive(gemId, nodeId);
  const gem = getGemById(gemId);
  if (!gem) return '';
  
  if (!isActive) {
    return 'bg-gray-700 border-gray-600';
  }
  
  // Explizite Zuordnung für alle Gem-Farben
  const colorClassMap = {
    'red': 'bg-red-800 border-red-400',
    'lime': 'bg-lime-800 border-lime-400', 
    'cyan': 'bg-cyan-800 border-cyan-400',
    'purple': 'bg-purple-800 border-purple-400',
    'orange': 'bg-orange-800 border-orange-400',
    'green': 'bg-green-800 border-green-400',
    'pink': 'bg-pink-800 border-pink-400'
  };
  
  return colorClassMap[gem.color] || 'bg-gray-700 border-gray-600';
}

// Store-Integration
function updateGemLevel(gemId, newLevel) {
  gemLevels[gemId] = parseInt(newLevel);
  saveToStore();
}

function toggleNode(gemId, nodeId) {
  if (!activeNodes[gemId]) {
    activeNodes[gemId] = [];
  }
  
  const index = activeNodes[gemId].indexOf(nodeId);
  if (index === -1) {
    activeNodes[gemId].push(nodeId);
  } else {
    activeNodes[gemId].splice(index, 1);
  }
  saveToStore();
}

function selectAllNodes() {
  gems.value.forEach(gem => {
    if (gem && gem.id !== 'exodus' && gemLevels[gem.id] > 0) {
      const nodes = gemNodes[gem.id] || [];
      activeNodes[gem.id] = nodes.map(node => node.id);
    }
  });
  saveToStore();
}

// Watch für Gem-Level-Änderungen um maxed boosts automatisch zu deaktivieren
watch(() => ({ ...gemLevels }), (newLevels, oldLevels) => {
  // Prüfe welche Gems von > 0 auf 0 gesetzt wurden oder Level reduziert wurden
  const changedGems = [];
  
  Object.keys(newLevels).forEach(gemId => {
    const oldLevel = oldLevels ? oldLevels[gemId] : 0;
    const newLevel = newLevels[gemId];
    
    // Gem wurde zurückgesetzt oder Level reduziert
    if (oldLevel > newLevel) {
      changedGems.push({ gemId, oldLevel, newLevel });
    }
  });
  
  // Wenn Gems zurückgesetzt/reduziert wurden, automatisch entsprechende maxed boosts deaktivieren
  if (changedGems.length > 0) {
    autoDeactivateMaxedBoosts(changedGems);
  }
}, { deep: true });

// Automatische Deaktivierung basierend auf Boost-Definitionen aus index.js
let boostDependencies = null;

async function loadBoostDependencies() {
  if (!boostDependencies) {
    const { allBoosts } = await import('@/constants/tr-planner/index.js');
    
    // Erstelle eine Map: gemId -> [abhängige Boosts]
    boostDependencies = {};
    
    allBoosts.forEach(boost => {
      if (boost.unlock && boost.unlock_level !== undefined) {
        if (!boostDependencies[boost.unlock]) {
          boostDependencies[boost.unlock] = [];
        }
        boostDependencies[boost.unlock].push({
          key: boost.key,
          requiredLevel: boost.unlock_level,
          type: boost.type,
          label: boost.label
        });
      }
    });
  }
  
  return boostDependencies;
}

// Optimierte Auto-Deaktivierung
async function autoDeactivateMaxedBoosts(changedGems) {
  try {
    const currentStats = JSON.parse(localStorage.getItem('trplanner_userstats') || '{}');
    const orbCalcMaxedBoosts = currentStats._orbCalcMaxedBoosts || {};
    
    let hasChanges = false;
    const deactivatedBoosts = [];
    
    // Lade Boost-Abhängigkeiten
    const dependencies = await loadBoostDependencies();
    
    changedGems.forEach(({ gemId, oldLevel, newLevel }) => {
      const dependentBoosts = dependencies[gemId] || [];
      
      dependentBoosts.forEach(boost => {
        // Deaktiviere nur wenn neues Level unter Required-Level liegt
        if (boost.requiredLevel > newLevel && orbCalcMaxedBoosts[boost.key] === true) {
          delete orbCalcMaxedBoosts[boost.key];
          hasChanges = true;
          deactivatedBoosts.push({ key: boost.key, label: boost.label });
          
          // Reset boost value
          if (currentStats[boost.key] !== undefined) {
            if (boost.type === 'boolean') {
              currentStats[boost.key] = false;
            } else if (boost.type === 'number') {
              currentStats[boost.key] = 0;
            }
          }
        }
      });
    });
    
    // Speichere Änderungen
    if (hasChanges) {
      currentStats._orbCalcMaxedBoosts = orbCalcMaxedBoosts;
      localStorage.setItem('trplanner_userstats', JSON.stringify(currentStats));
      
      // Detailliertes User-Feedback
      if (deactivatedBoosts.length > 0) {
        const changedGemNames = changedGems.map(({ gemId }) => {
          const gem = getGemById(gemId);
          return gem ? gem.name : gemId;
        }).join(', ');
        
        const boostNames = deactivatedBoosts.map(b => b.label).join(', ');
        
        console.log(`Auto-deactivated maxed boosts:`, {
          changedGems: changedGemNames,
          deactivatedBoosts: boostNames,
          count: deactivatedBoosts.length
        });
        
        showAutoDeactivationNotification(deactivatedBoosts.length, changedGemNames);
      }
    }
    
  } catch (error) {
    console.error('Error auto-deactivating maxed boosts:', error);
  }
}

// Optional: Notification System
const showNotification = ref(false);
const notificationMessage = ref('');

function showAutoDeactivationNotification(count, gemNames) {
  notificationMessage.value = `Auto-deactivated ${count} maxed boosts due to ${gemNames} level changes`;
  showNotification.value = true;
  
  // Auto-hide nach 4 Sekunden
  setTimeout(() => {
    showNotification.value = false;
  }, 4000);
}

// Reset All Button erweitern
function resetAll() {
  if (confirm('Reset all gem levels and nodes? This will also deactivate related maxed boosts.')) {
    // Speichere alte Levels für Comparison
    const oldLevels = { ...gemLevels };
    
    // Reset Gems
    Object.keys(gemLevels).forEach(key => {
      gemLevels[key] = 0;
    });
    
    Object.keys(activeNodes).forEach(key => {
      activeNodes[key] = [];
    });
    
    saveToStore();
    
    // Auto-deactivate alle gem-abhängigen maxed boosts
    const changedGems = Object.keys(oldLevels)
      .filter(gemId => oldLevels[gemId] > 0)
      .map(gemId => ({ gemId, oldLevel: oldLevels[gemId], newLevel: 0 }));
    
    if (changedGems.length > 0) {
      autoDeactivateMaxedBoosts(changedGems);
    }
  }
}

// Max All Button erweitern (um versehentliche Deaktivierungen zu vermeiden)
function maxAll() {
  if (confirm('Set all gems to maximum level?')) {
    gems.value.forEach(gem => {
      if (gem && gem.id && gem.maxLevel !== undefined) {
        gemLevels[gem.id] = gem.maxLevel;
      }
    });
    saveToStore();
    // Bei Max All keine Deaktivierung, da Levels nur erhöht werden
  }
}

// Custom Dropdown State
const openDropdown = ref(null);

function toggleDropdown(gemId) {
  openDropdown.value = openDropdown.value === gemId ? null : gemId;
}

function selectLevel(gemId, level) {
  gemLevels[gemId] = level;
  openDropdown.value = null;
  updateGemLevel(gemId, level);
}

// Close dropdown when clicking outside
function closeDropdowns(event) {
  // Prüfe ob der Click von einem Dropdown-Element kommt
  if (event && (
    event.target.closest('.dropdown-trigger') || 
    event.target.closest('.dropdown-menu')
  )) {
    return; // Dropdown nicht schließen
  }
  
  openDropdown.value = null;
}

function initializeGems() {
  try {
    const allGemData = getAllGemData();
    gems.value = allGemData || [];
  } catch (error) {
    console.error('Error initializing gems:', error);
    gems.value = [];
  }
}

function loadFromStore() {
  try {
    const userStats = trPlannerStore.userStats;
    if (userStats && userStats.gemData) {
      const gemData = userStats.gemData;
      
      // Lade Gem-Levels
      if (gemData.levels) {
        Object.keys(gemLevels).forEach(gemId => {
          if (gemData.levels[gemId] !== undefined) {
            gemLevels[gemId] = gemData.levels[gemId];
          }
        });
      }
      
      // Lade aktive Nodes
      if (gemData.activeNodes) {
        Object.keys(activeNodes).forEach(gemId => {
          if (gemData.activeNodes[gemId]) {
            activeNodes[gemId] = [...gemData.activeNodes[gemId]];
          }
        });
      }
    }
  } catch (error) {
    console.error('Error loading gem data from store:', error);
  }
}

function saveToStore() {
  try {
    const gemData = {
      levels: { ...gemLevels },
      activeNodes: { ...activeNodes }
    };
    
    trPlannerStore.updateUserStats({ gemData });
    
    // Auch in localStorage speichern für Backup
    const currentStats = JSON.parse(localStorage.getItem('trplanner_userstats') || '{}');
    currentStats.gemData = gemData;
    localStorage.setItem('trplanner_userstats', JSON.stringify(currentStats));
    
  } catch (error) {
    console.error('Error saving gem data to store:', error);
  }
}

// onMounted korrigieren - doppelte onMounted zusammenführen
onMounted(async () => {
  // Gems initialisieren
  initializeGems();
  
  // Boost-Abhängigkeiten laden
  await loadBoostDependencies();
  
  if (props.isVisible) {
    loadFromStore();
    setTimeout(() => {
      updateCircleCenter();
    }, 50);
  }
  
  window.addEventListener('resize', updateCircleCenter);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCircleCenter);
  // window.removeEventListener('click', closeDropdowns);
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

/* Scroll-Container für Mobile */
.gem-diagram-scroll-container {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .gem-diagram-scroll-container {
    /* Mobile: Scrollbares Container */
    max-height: 70vh;
    overflow: auto;
    border: 1px solid rgba(75, 85, 99, 0.3);
    border-radius: 8px;
    background: rgba(17, 24, 39, 0.5);
  }
}

/* Gem-Diagramm - Responsiv */
.gem-diagram-container {
  position: relative;
  margin: 0 auto;
}

/* Desktop */
@media (min-width: 769px) {
  .gem-diagram-container {
    width: 600px;
    height: 600px;
    min-width: 600px;
    min-height: 600px;
  }
}

/* Mobile - Halbe Größe */
@media (max-width: 768px) {
  .gem-diagram-container {
    width: 300px;
    height: 300px;
    min-width: 300px;
    min-height: 300px;
  }
}

.gem-diagram {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(12,20,36,0.95) 0%, rgba(5,8,20,1) 95%);
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(55,65,81,0.4);
  overflow: visible;
}

.gem-connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

/* Desktop Gem Größen */
@media (min-width: 769px) {
  .gem {
    position: absolute;
    width: 60px;
    height: 60px;
    z-index: 5;
    text-align: center;
    transition: transform 0.2s ease;
  }

  .gem:hover {
    transform: scale(1.1);
    z-index: 15;
  }

  .gem-icon {
    width: 48px;
    height: 48px;
    border-radius: 15%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: bold;
    color: white;
    background: rgba(50, 50, 50, 0.8);
    border: 2px solid rgba(200, 200, 200, 0.3);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease;
  }

  .gem:hover .gem-icon {
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.4);
  }

  .gem-name {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .gem:hover .gem-name {
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  }

  .node {
    position: absolute;
    width: 30px;
    height: 30px;
    cursor: pointer;
    z-index: 3;
    transition: transform 0.2s ease;
  }

  .node-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 12px;
    color: white;
    background-color: rgba(31, 41, 55, 0.8);
    border: 2px solid rgba(75, 85, 99, 0.6);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  }
}

/* Mobile Gem Größen - Halbe Größe */
@media (max-width: 768px) {
  .gem {
    position: absolute;
    width: 30px;
    height: 30px;
    z-index: 5;
    text-align: center;
    transition: transform 0.2s ease;
  }

  .gem:hover {
    transform: scale(1.15);
    z-index: 15;
  }

  .gem-icon {
    width: 24px;
    height: 24px;
    border-radius: 15%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
    color: white;
    background: rgba(50, 50, 50, 0.8);
    border: 1px solid rgba(200, 200, 200, 0.3);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease;
  }

  .gem:hover .gem-icon {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
  }

  .gem-name {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 6px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .gem:hover .gem-name {
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
  }

  .node {
    position: absolute;
    width: 15px;
    height: 15px;
    cursor: pointer;
    z-index: 3;
    transition: transform 0.2s ease;
  }

  .node-circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 6px;
    color: white;
    background-color: rgba(31, 41, 55, 0.8);
    border: 1px solid rgba(75, 85, 99, 0.6);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  }
}

.exodus-gem {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  transition: transform 0.2s ease;
}

.exodus-gem:hover {
  transform: translate(-50%, -50%) scale(1.1);
  z-index: 15;
}

.exodus-gem:hover .gem-icon {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
}

.exodus-gem:hover .exodus-name {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 8px rgba(168, 85, 247, 0.8));
}

.exodus-name {
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  text-shadow: none;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  transition: all 0.2s ease;
}

/* Fallback für Browser die background-clip: text nicht unterstützen */
@supports not (-webkit-background-clip: text) {
  .exodus-name {
    color: #a855f7; /* Fallback auf lila */
    background: none;
  }
}

.exodus-gem .gem-icon {
  background: radial-gradient(circle, rgba(147,51,234,1) 0%, rgba(126,34,206,1) 100%);
  border-color: rgba(192,132,252,0.8);
  transition: all 0.2s ease;
}

.active-gem {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.active-node .node-circle {
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

.node:hover {
  transform: scale(1.15);
}

/* Gem-spezifische Stile */
.gem-temporal .gem-icon {
  background: radial-gradient(circle, rgba(239,68,68,1) 0%, rgba(185,28,28,1) 100%);
  border-color: rgba(252,165,165,0.8);
}

.gem-innovation .gem-icon {
  background: radial-gradient(circle, rgb(115, 187, 0) 0%, rgb(0, 85, 7) 100%);
  border-color: rgba(190,242,100,0.8);
}

.gem-attraction .gem-icon {
  background: radial-gradient(circle, rgba(34,211,238,1) 0%, rgba(14,116,144,1) 100%);
  border-color: rgba(125,211,252,0.8);
}

.gem-power .gem-icon {
  background: radial-gradient(circle, rgb(174, 106, 238) 0%, rgba(126,34,206,1) 100%);
  border-color: rgba(192,132,252,0.8);
}

.gem-creation .gem-icon {
  background: radial-gradient(circle, rgba(251,146,60,1) 0%, rgba(194,65,12,1) 100%);
  border-color: rgba(253,186,116,0.8);
}

.gem-evolution .gem-icon {
  background: radial-gradient(circle, rgba(34,197,94,1) 0%, rgba(22,101,52,1) 100%);
  border-color: rgba(134,239,172,0.8);
}

/* Custom Dropdown Styles - Kein Browser-Standard mehr */
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  font-size: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  background: transparent;
  border: none;
  outline: none;
  text-align: center;
  min-width: 24px;
  transition: all 0.2s ease;
  user-select: none;
}

/* Mobile kleinere Schrift */
@media (max-width: 768px) {
  .dropdown-trigger {
    font-size: 11px;
    min-width: 16px;
    padding: 1px 3px;
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  min-width: 40px;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .dropdown-menu {
    min-width: 28px;
    margin-top: 2px;
  }
}

.dropdown-option {
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: normal;
  color: white;
  transition: background-color 0.2s ease;
  text-align: center;
}

@media (max-width: 768px) {
  .dropdown-option {
    padding: 3px 6px;
    font-size: 10px;
  }
}

.dropdown-option:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Gem-spezifische Custom Dropdown Styles */
.gem-trigger-red:focus,
.gem-menu-red {
  background-color: rgb(127, 29, 29);
  border-color: rgb(248, 113, 113);
}

.gem-option-red {
  background-color: rgb(127, 29, 29);
}

.gem-option-red:hover {
  background-color: rgb(153, 27, 27);
}

.gem-trigger-lime:focus,
.gem-menu-lime {
  background-color: rgb(77, 124, 15);
  border-color: rgb(163, 230, 53);
}

.gem-option-lime {
  background-color: rgb(77, 124, 15);
}

.gem-option-lime:hover {
  background-color: rgb(65, 105, 15);
}

.gem-trigger-cyan:focus,
.gem-menu-cyan {
  background-color: rgb(14, 116, 144);
  border-color: rgb(34, 211, 238);
}

.gem-option-cyan {
  background-color: rgb(14, 116, 144);
}

.gem-option-cyan:hover {
  background-color: rgb(21, 94, 117);
}

.gem-trigger-purple:focus,
.gem-menu-purple {
  background-color: rgb(126, 34, 206);
  border-color: rgb(192, 132, 252);
}

.gem-option-purple {
  background-color: rgb(126, 34, 206);
}

.gem-option-purple:hover {
  background-color: rgb(107, 33, 168);
}

.gem-trigger-orange:focus,
.gem-menu-orange {
  background-color: rgb(194, 65, 12);
  border-color: rgb(251, 146, 60);
}

.gem-option-orange {
  background-color: rgb(194, 65, 12);
}

.gem-option-orange:hover {
  background-color: rgb(154, 52, 18);
}

.gem-trigger-green:focus,
.gem-menu-green {
  background-color: rgb(21, 128, 61);
  border-color: rgb(34, 197, 94);
}

.gem-option-green {
  background-color: rgb(21, 128, 61);
}

.gem-option-green:hover {
  background-color: rgb(22, 101, 52);
}

/* Exodus Custom Dropdown */
.exodus-trigger:focus,
.exodus-menu {
  background-color: rgb(126, 34, 206);
  border-color: rgb(192, 132, 252);
}

.exodus-option {
  background-color: rgb(126, 34, 206);
}

.exodus-option:hover {
  background-color: rgb(107, 33, 168);
}

/* Color-specific node states - Vollständige Liste */
.bg-red-800 { 
  background-color: rgba(153,27,27,1) !important; 
}
.border-red-400 { 
  border-color: rgba(248,113,113,1) !important; 
}

.bg-lime-800 { 
  background-color: rgba(77,124,15,1) !important; 
}
.border-lime-400 { 
  border-color: rgba(163,230,53,1) !important; 
}

.bg-cyan-800 { 
  background-color: rgba(14,116,144,1) !important; 
}
.border-cyan-400 { 
  border-color: rgba(34,211,238,1) !important; 
}

.bg-purple-800 { 
  background-color: rgba(107,33,168,1) !important; 
}
.border-purple-400 { 
  border-color: rgba(192,132,252,1) !important; 
}

.bg-orange-800 { 
  background-color: rgba(154,52,18,1) !important; 
}
.border-orange-400 { 
  border-color: rgba(251,146,60,1) !important; 
}

.bg-green-800 { 
  background-color: rgba(22,101,52,1) !important; 
}
.border-green-400 { 
  border-color: rgba(34,197,94,1) !important; 
}

.bg-pink-800 { 
  background-color: rgba(157,23,77,1) !important; 
}
.border-pink-400 { 
  border-color: rgba(244,114,182,1) !important; 
}

/* Gray fallback for inactive nodes */
.bg-gray-700 { 
  background-color: rgba(55,65,81,1) !important; 
}
.border-gray-600 { 
  border-color: rgba(75,85,99,1) !important; 
}

/* Glow-Effekte für Connection Lines */
.gem-connection-lines line.glow-red {
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 1)) drop-shadow(0 0 15px rgba(239, 68, 68, 0.5));
}

.gem-connection-lines line.glow-lime {
  filter: drop-shadow(0 0 8px rgba(132, 204, 22, 1)) drop-shadow(0 0 15px rgba(132, 204, 22, 0.5));
}

.gem-connection-lines line.glow-cyan {
  filter: drop-shadow(0 0 8px rgba(6, 182, 212, 1)) drop-shadow(0 0 15px rgba(6, 182, 212, 0.5));
}

.gem-connection-lines line.glow-purple {
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 1)) drop-shadow(0 0 15px rgba(168, 85, 247, 0.5));
}

.gem-connection-lines line.glow-orange {
  filter: drop-shadow(0 0 8px rgba(249, 115, 22, 1)) drop-shadow(0 0 15px rgba(249, 115, 22, 0.5));
}

.gem-connection-lines line.glow-green {
  filter: drop-shadow(0 0 8px rgba(34, 197, 94, 1)) drop-shadow(0 0 15px rgba(34, 197, 94, 0.5));
}

.gem-connection-lines line.glow-pink {
  filter: drop-shadow(0 0 8px rgba(244, 114, 182, 1)) drop-shadow(0 0 15px rgba(244, 114, 182, 0.5));
}

/* Entferne alle Standard Select Styles */
select {
  display: none !important;
}
</style>