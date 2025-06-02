<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header-Bereich -->
    <div class="mb-6 rounded-lg overflow-hidden shadow-lg">
      <div class="bg-gradient-to-r from-purple-900 to-gray-800 p-4 sm:p-5 border-b border-gray-600">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold">Gem Planner</h1>
            <p class="text-sm text-gray-300">Plan and optimize your Gem Upgrades</p>
          </div>
          
          <div class="flex space-x-2">
            <button 
              @click="showStatsModal = true"
              class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
            >
              Stats
            </button>
            
            <button 
              @click="resetPlanner"
              class="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors shadow-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gem-Diagramm -->
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
            :x1="circleCenter.x" 
            :y1="circleCenter.y" 
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
        
        <!-- Exodus Gem im Zentrum -->
        <div 
          v-if="getGemById('exodus')"
          @click="selectedGem = getGemById('exodus')" 
          class="gem exodus-gem"
        >
          <div class="gem-icon !bg-gradient-to-br !from-blue-700 !to-purple-400 p-2 rounded-lg shadow-glow transition-all duration-300" :class="{'active-gem': isGemActive('exodus')}">
            <div class="flex flex-col items-center justify-center h-full">
              <span class="text-xl font-bold">E</span>
              <span class="text-[8px] sm:text-[10px] text-gray-200 mt-0">{{ gemLevels.exodus }}/{{ getGemById('exodus')?.maxLevel || 4 }}</span>
            </div>
          </div>
          <div class="gem-name">EXODUS</div>
        </div>

        <!-- Andere Gems im Kreis -->
        <div 
          v-for="gem in gems.filter(g => g && g.id !== 'exodus')" 
          :key="gem.id"
          @click="selectedGem = gem" 
          class="gem"
          :class="[
            `gem-${gem.id}`
          ]"
          :style="getGemPositionStyle(gem.position?.angle, gem.position?.distanceFromCenter)"
        >
          <div class="gem-icon" :class="{'active-gem': isGemActive(gem.id)}">
            <div class="flex flex-col items-center justify-center h-full">
              <span class="text-lg sm:text-xl font-bold leading-none">{{ gem.letter }}</span>
              <span class="text-[8px] sm:text-[10px] text-gray-300 leading-none mt-0.5">{{ gemLevels[gem.id] }}/{{ gem.maxLevel }}</span>
            </div>
          </div>
          <div class="gem-name" :class="`text-${gem.color}-300`">{{ gem.name.toUpperCase() }}</div>
        </div>

        <!-- Nodes -->
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
    
    <!-- Gem-Detail Modal -->
    <div 
      v-if="selectedGem"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      @click="selectedGem = null"
    >
      <div 
        class="bg-gray-800 rounded-lg max-w-lg w-full shadow-xl"
        @click.stop
      >
        <!-- Modal Header -->
        <div :class="`bg-gradient-to-r from-${selectedGem.color}-900 to-gray-800 p-4 rounded-t-lg`">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">{{ selectedGem.name }} Gem</h2>
            <button @click="selectedGem = null" class="text-gray-400 hover:text-white">×</button>
          </div>
        </div>

        <!-- Gem-Beschreibung -->
        <div class="p-4 border-b border-gray-700">
          <p class="text-sm text-gray-300">{{ selectedGem.description }}</p>
        </div>

        <!-- Gem-Level-Kontrollen -->
        <div class="p-4 border-b border-gray-700">
          <div class="flex justify-between items-center">
            <span>Gem-Level:</span>
            <span>{{ gemLevels[selectedGem.id] }}/{{ selectedGem.maxLevel }}</span>
          </div>
          
          <div class="mt-4 flex justify-between">
            <button 
              @click="decrementGemLevel(selectedGem.id)"
              :disabled="gemLevels[selectedGem.id] <= 0"
              class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50"
            >
              -
            </button>
            
            <div class="text-lg font-semibold">{{ gemLevels[selectedGem.id] }}</div>
            
            <button 
              @click="incrementGemLevel(selectedGem.id)"
              :disabled="gemLevels[selectedGem.id] >= selectedGem.maxLevel"
              class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        <!-- Gem-Upgrades -->
        <div class="p-4 max-h-80 overflow-y-auto">
          <h3 class="text-lg font-medium mb-3">Upgrades</h3>
          <div class="space-y-2">
            <div 
              v-for="(upgrade, index) in gemUpgrades[selectedGem.id]" 
              :key="`upgrade-${index}`"
              class="bg-gray-750 rounded p-3 border border-gray-700"
            >
              <div class="flex justify-between">
                <div>
                  <div class="font-semibold">{{ upgrade.name }}</div>
                  <div class="text-xs text-gray-400">
                    {{ upgrade.type?.toUpperCase() || '' }}: ×{{ formatMultiplier(upgrade.multiplier) }}
                  </div>
                </div>
                <div class="text-amber-400">
                  {{ formatNumber(upgrade.cost) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-750 p-4 rounded-b-lg flex justify-end">
          <button 
            @click="selectedGem = null"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>

    <!-- Stats-Modal (Platzhalter) -->
    <div 
      v-if="showStatsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      @click="showStatsModal = false"
    >
      <div 
        class="bg-gray-800 rounded-lg max-w-lg w-full shadow-xl"
        @click.stop
      >
        <div class="p-4 border-b border-gray-700">
          <h2 class="text-xl font-bold">Stats einstellen</h2>
        </div>
        <div class="p-4">
          <p class="text-gray-300 mb-4">
            Trage hier deine aktuellen Stats ein, um die Bonuswerte genau zu berechnen.
          </p>
          <!-- Hier würde später ein richtiges Formular kommen -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm mb-1">RP Multiplikator</label>
              <input type="number" v-model="userStats.rpMultiplier" step="0.01" class="w-full bg-gray-700 rounded p-2" />
            </div>
            <div>
              <label class="block text-sm mb-1">MP Multiplikator</label>
              <input type="number" v-model="userStats.mpMultiplier" step="0.01" class="w-full bg-gray-700 rounded p-2" />
            </div>
          </div>
        </div>
        <div class="bg-gray-750 p-4 rounded-b-lg flex justify-end">
          <button 
            @click="showStatsModal = false"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { gemTypes, gemUpgrades, gemNodes, getAllGemData } from '@/constants/gem-planner/index.js';

// Gem-Daten laden - mit sicherer Initialisierung
const gems = ref([]);

// Zustand
const selectedGem = ref(null);
const showStatsModal = ref(false);
const circleCenter = ref({ x: 300, y: 300 });

// Gem-Levels und aktive Nodes initialisieren
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

// Benutzerstatistiken
const userStats = reactive({
  rpMultiplier: 1.0,
  mpMultiplier: 1.0,
  cellsMultiplier: 1.0,
  shardsMultiplier: 1.0
});

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


// Hilfsfunktionen
function getGemById(id) {
  return (gems.value || []).find(gem => gem && gem.id === id) || null;
}

function getGemPosition(angle = 0, distance = 0) {
  const container = document.querySelector('.gem-diagram');
  if (!container) return { x: 0, y: 0 };
  
  const rect = container.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  const defaultSize = 600; // Desktop-Größe
  const scaleFactor = size / defaultSize;
  
  // **MOBILE-SPEZIFISCHE ANPASSUNG FÜR ALLE GEMS**
  const isMobile = window.innerWidth <= 768;
  let adjustedDistance = distance;
  
  if (isMobile) {
    // **HIER ÄNDERN**: Alle Gems 20% näher zur Mitte auf Mobile
    adjustedDistance = distance * 0.9; // 0.8 = 20% näher, 0.6 = 40% näher, etc.
  }
  
  const scaledDistance = adjustedDistance * scaleFactor;
  
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = circleCenter.value.x + scaledDistance * Math.cos(rad);
  const y = circleCenter.value.y + scaledDistance * Math.sin(rad);
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
  
  // **VEREINHEITLICHTE SKALIERUNGSLOGIK WIE BEI GEMS**
  const container = document.querySelector('.gem-diagram');
  if (!container) return {};
  
  const rect = container.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  const defaultSize = 600; // Desktop-Größe (gleich wie bei Gems)
  const scaleFactor = size / defaultSize;
  
  const isMobile = window.innerWidth <= 768;
  let nodeRadius;
  
  if (isMobile) {
    // **GLEICHE LOGIK WIE BEI GEMS**: Basis-Radius für Mobile
    nodeRadius = 307; // Angepasster Radius für Mobile
  } else {
    // Desktop: Standard-Radius
    nodeRadius = 280;
  }
  
  // **WICHTIG**: Wende die gleiche Mobile-Anpassung an wie bei Gems
  let adjustedNodeRadius = nodeRadius;
  if (isMobile) {
    adjustedNodeRadius = nodeRadius * 0.9; // Gleicher Faktor wie bei Gems
  }
  
  const scaledRadius = adjustedNodeRadius * scaleFactor;
  
  // Berechne Position mit dem gleichen Zentrum wie die Gems
  const rad = ((node.angle - 90) * Math.PI) / 180;
  const x = circleCenter.value.x + scaledRadius * Math.cos(rad);
  const y = circleCenter.value.y + scaledRadius * Math.sin(rad);
  
  // **MOBILE-SPEZIFISCHE KORREKTUR**
  const mobileOffsetX = isMobile ? 3 : 0;
  const mobileOffsetY = isMobile ? 3 : 0;

  return {
    top: `${y + mobileOffsetY}px`,
    left: `${x + mobileOffsetX}px`,
    transform: 'translate(-50%, -50%)'
  };
}

function isGemActive(gemId) {
  return gemLevels[gemId] > 0;
}

function isNodeActive(gemId, nodeId) {
  return activeNodes[gemId]?.includes(nodeId) || false;
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
}

function incrementGemLevel(gemId) {
  const gem = getGemById(gemId);
  if (gem && gemLevels[gemId] < gem.maxLevel) {
    gemLevels[gemId]++;
  }
}

function decrementGemLevel(gemId) {
  if (gemLevels[gemId] > 0) {
    gemLevels[gemId]--;
  }
}

function getGemLevelClass(gemId) {
  const gem = getGemById(gemId);
  return gem ? `gem-level-${gem.color}` : '';
}

function getNodeColorClass(gemId, nodeId) {
  const isActive = isNodeActive(gemId, nodeId);
  const gem = getGemById(gemId);
  if (!gem) return '';
  
  return isActive ? `bg-${gem.color}-800 border-${gem.color}-400` : 'bg-gray-700 border-gray-600';
}

function resetPlanner() {
  if (confirm('Möchtest du wirklich alle Einstellungen zurücksetzen?')) {
    Object.keys(gemLevels).forEach(key => {
      gemLevels[key] = 0;
    });
    
    Object.keys(activeNodes).forEach(key => {
      activeNodes[key] = [];
    });
  }
}

function getNodePositionFromAngle(angle) {
  const container = document.querySelector('.gem-diagram');
  if (!container) return { x: 0, y: 0 };
  
  const rect = container.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  const defaultSize = 600;
  const scaleFactor = size / defaultSize;
  
  const isMobile = window.innerWidth <= 768;
  let nodeRadius;
  
  if (isMobile) {
    nodeRadius = 307;
  } else {
    nodeRadius = 280; // ❌ Das ist der Fehler - sollte größer sein!
  }
  
  // Verwende die gleiche Anpassung wie in getNodePositionStyle
  let adjustedNodeRadius = nodeRadius;
  if (isMobile) {
    adjustedNodeRadius = nodeRadius * 0.9;
  }
  
  const scaledRadius = adjustedNodeRadius * scaleFactor;
  
  const rad = ((angle - 90) * Math.PI) / 180;
  const x = circleCenter.value.x + scaledRadius * Math.cos(rad);
  const y = circleCenter.value.y + scaledRadius * Math.sin(rad);

  return {
    x: x,
    y: y 
  };
}

// Berechnungen
function calculateTotalGemCost() {
  let cost = 0;
  
  // Kosten für Exodus-Gem berechnen
  const exodusUpgrades = gemUpgrades['exodus'] || [];
  for (let i = 0; i < gemLevels.exodus; i++) {
    if (exodusUpgrades[i]) {
      cost += exodusUpgrades[i].cost;
    }
  }
  
  // Kosten für andere Gems berechnen
  Object.entries(gemLevels).forEach(([gemId, level]) => {
    if (gemId !== 'exodus') {
      const upgrades = gemUpgrades[gemId] || [];
      for (let i = 0; i < level && i < upgrades.length; i++) {
        cost += upgrades[i].cost;
      }
    }
  });
  
  return cost;
}

function calculateTotalNodeCost() {
  let cost = 0;
  
  Object.entries(activeNodes).forEach(([gemId, nodeIds]) => {
    nodeIds.forEach(nodeId => {
      const nodeList = gemNodes[gemId] || [];
      const node = nodeList.find(n => n && n.id === nodeId);
      if (node) {
        cost += node.cost;
      }
    });
  });
  
  return cost;
}

function calculateTotalRPBonus() {
  let bonus = 1.0;
  
  // Bonus von Gems
  Object.entries(gemLevels).forEach(([gemId, level]) => {
    if (level > 0) {
      const upgrades = gemUpgrades[gemId] || [];
      upgrades.forEach(upgrade => {
        if (upgrade && upgrade.type === 'rp' && upgrade.unlockLvl <= level) {
          bonus *= upgrade.multiplier;
        }
      });
    }
  });
  
  // Bonus von Nodes
  Object.entries(activeNodes).forEach(([gemId, nodeIds]) => {
    if (!nodeIds) return;
    
    nodeIds.forEach(nodeId => {
      const nodeList = gemNodes[gemId] || [];
      const node = nodeList.find(n => n && n.id === nodeId);
      if (node && node.bonusType === 'rp') {
        bonus *= node.bonus;
      }
    });
  });
  
  return bonus;
}

function calculateTotalMPBonus() {
  let bonus = 1.0;
  
  // Bonus von Gems
  Object.entries(gemLevels).forEach(([gemId, level]) => {
    if (level > 0) {
      const upgrades = gemUpgrades[gemId] || [];
      upgrades.forEach(upgrade => {
        if (upgrade && upgrade.type === 'mp' && upgrade.unlockLvl <= level) {
          bonus *= upgrade.multiplier;
        }
      });
    }
  });
  
  // Bonus von Nodes
  Object.entries(activeNodes).forEach(([gemId, nodeIds]) => {
    if (!nodeIds) return;
    
    nodeIds.forEach(nodeId => {
      const nodeList = gemNodes[gemId] || [];
      const node = nodeList.find(n => n && n.id === nodeId);
      if (node && node.bonusType === 'mp') {
        bonus *= node.bonus;
      }
    });
  });
  
  return bonus;
}

function calculateTotalShardBonus() {
  let bonus = 1.0;
  
  // Bonus von Gems
  Object.entries(gemLevels).forEach(([gemId, level]) => {
    if (level > 0) {
      const upgrades = gemUpgrades[gemId] || [];
      upgrades.forEach(upgrade => {
        if (upgrade && upgrade.type === 'shards' && upgrade.unlockLvl <= level) {
          bonus *= upgrade.multiplier;
        }
      });
    }
  });
  
  // Bonus von Nodes
  Object.entries(activeNodes).forEach(([gemId, nodeIds]) => {
    if (!nodeIds) return;
    
    nodeIds.forEach(nodeId => {
      const nodeList = gemNodes[gemId] || [];
      const node = nodeList.find(n => n && n.id === nodeId);
      if (node && node.bonusType === 'shards') {
        bonus *= node.bonus;
      }
    });
  });
  
  return bonus;
}

// Formatierungsfunktionen
function formatNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 't';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'b';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'm';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'k';
  return num.toLocaleString();
}

function formatMultiplier(num) {
  return num.toFixed(2);
}

// Komponenten-Lifecycle
function updateCircleCenter() {
  const container = document.querySelector('.gem-diagram');
  if (container) {
    const rect = container.getBoundingClientRect();
    
    // **MOBILE-SPEZIFISCHE ZENTRUMS-BERECHNUNG**
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Auf Mobile: Verwende die tatsächliche Größe des Containers
      const containerParent = document.querySelector('.gem-diagram-container');
      const parentRect = containerParent ? containerParent.getBoundingClientRect() : rect;
      
      // Das Zentrum ist die Hälfte der kleineren Dimension (sollte quadratisch sein)
      const size = Math.min(parentRect.width, parentRect.height);
      circleCenter.value = { 
        x: size / 2,
        y: size / 2
      };
    } else {
      // Desktop: Wie vorher
      circleCenter.value = { 
        x: rect.width / 2,
        y: rect.height / 2
      };
    }
    
    console.log("Circle center updated:", circleCenter.value, "isMobile:", isMobile);
  }
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


function initializeGems() {
  try {
    gems.value = getAllGemData() || [];
    console.log("Gems initialized:", gems.value);
  } catch (error) {
    console.error("Error loading gem data:", error);
    gems.value = [];
  }
}

onMounted(() => {
  initializeGems();
  
  // Warte bis DOM gerendert
  setTimeout(() => {
    updateCircleCenter();
  }, 50);
  
  // Orientierungsänderung auf Mobilgeräten erkennen
  window.addEventListener('resize', updateCircleCenter);
  window.addEventListener('orientationchange', () => {
    // Kurze Verzögerung für Orientierungsänderungen
    setTimeout(updateCircleCenter, 100);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCircleCenter);
  window.removeEventListener('orientationchange', updateCircleCenter);
});
</script>

<style scoped>
.bg-gray-850 {
  background-color: rgba(26, 29, 36, 1);
}

.bg-gray-750 {
  background-color: rgba(42, 46, 53, 0.8);
}

/* Gem-Diagramm mit responsiver Polar-Koordinaten-Darstellung */
.gem-diagram-container {
  width: 100%;
  position: relative;
  margin: 0 auto;
}

/* Desktop: Feste Größe */
@media (min-width: 769px) {
  .gem-diagram-container {
    width: 600px;
    height: 600px;
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
}

/* Mobile: Responsive mit padding-bottom trick */
@media (max-width: 768px) {
  .gem-diagram-container {
    padding-bottom: 100%;
    height: 0;
    max-width: 400px;
    /* **WICHTIG: Stelle sicher, dass der Container zentriert ist** */
    margin: 0 auto;
    position: relative;
  }
  
  .gem-diagram {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(12,20,36,0.95) 0%, rgba(5,8,20,1) 95%);
    box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.6), 0 0 10px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(55,65,81,0.4);
    overflow: visible;
    /* **ZUSÄTZLICHE ZENTRIERUNG** */
    margin: auto;
  }
}

/* Verbindungslinien */
.gem-connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

/* SVG-Linien auf bestimmte Klassen wie stroke-blue-500/80 */
.stroke-red-500\/80 {
  stroke: rgba(239, 68, 68, 0.8);
}

.stroke-lime-500\/80 {
  stroke: rgba(132, 204, 22, 0.8);
}

.stroke-cyan-500\/80 {
  stroke: rgba(6, 182, 212, 0.8);
}

.stroke-purple-500\/80 {
  stroke: rgba(168, 85, 247, 0.8);
}

.stroke-orange-500\/80 {
  stroke: rgba(249, 115, 22, 0.8);
}

.stroke-green-500\/80 {
  stroke: rgba(34, 197, 94, 0.8);
}

.stroke-gray-600\/30 {
  stroke: rgba(75, 85, 99, 0.3);
}

/* Gems und Knoten Styling */
.gem {
  position: absolute;
  width: 60px;
  height: 60px;
  z-index: 5;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.gem:hover {
  transform: translate(-50%, -50%) scale(1.1) !important;
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

.exodus-gem {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.exodus-gem .gem-icon {
  background: radial-gradient(circle, rgba(147,51,234,1) 0%, rgba(126,34,206,1) 100%);
  border-color: rgba(192,132,252,0.8);
}

.gem-level {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  background-color: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.5);
  color: white;
  white-space: nowrap;
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
}

.active-gem {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.locked-gem {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Gem-spezifische Stile - vereinfachte Version die mit deinen Konstanten arbeitet */
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

/* Gem-Level-Farben */
.gem-level-red {
  background-color: rgba(220,38,38,0.7);
  border-color: rgba(252,165,165,0.5);
}

.gem-level-lime {
  background-color: rgba(132,204,22,0.7);
  border-color: rgba(190,242,100,0.5);
}

.gem-level-cyan {
  background-color: rgba(8,145,178,0.7);
  border-color: rgba(125,211,252,0.5);
}

.gem-level-purple {
  background-color: rgba(124,58,237,0.7);
  border-color: rgba(167,139,250,0.5);
}

.gem-level-orange {
  background-color: rgba(234,88,12,0.7);
  border-color: rgba(253,186,116,0.5);
}

.gem-level-green {
  background-color: rgba(22,163,74,0.7);
  border-color: rgba(134,239,172,0.5);
}

.gem-level-pink {
  background-color: rgba(219,39,119,0.7);
  border-color: rgba(249,168,212,0.5);
}

.gem-level-gray {
  background-color: rgba(71,85,105,0.7);
  border-color: rgba(148,163,184,0.5);
}

.gem-level-exodus {
  background-color: rgba(124,58,237,0.7);
  border-color: rgba(192,132,252,0.5);
}

/* Nodes */
.node {
  position: absolute;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 3;
  transition: transform 0.2s ease;
}

.node:hover {
  transform: scale(1.15);
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

.active-node .node-circle {
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

/* Stile für spezifische Nodes basierend auf Gem-Farbe */
.bg-red-800 {
  background-color: rgba(153,27,27,1);
}
.border-red-400 {
  border-color: rgba(248,113,113,1); 
}
.bg-lime-800 {
  background-color: rgba(77,124,15,1);
}
.border-lime-400 {
  border-color: rgba(163,230,53,1);
}
.bg-cyan-800 {
  background-color: rgba(14,116,144,1);
}
.border-cyan-400 {
  border-color: rgba(34,211,238,1);
}
.bg-purple-800 {
  background-color: rgba(107,33,168,1);
}
.border-purple-400 {
  border-color: rgba(192,132,252,1);
}
.bg-orange-800 {
  background-color: rgba(154,52,18,1);
}
.border-orange-400 {
  border-color: rgba(251,146,60,1);
}
.bg-pink-800 {
  background-color: rgba(157,23,77,1);
}
.border-pink-400 {
  border-color: rgba(244,114,182,1);
}

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

/* Mobile Anpassungen */
@media (max-width: 768px) {
  .gem {
    width: 50px; /* Kleinere Gems auf Mobilgeräten */
    height: 50px;
  }
  
  .gem-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .node-circle {
    width: 22px;
    height: 22px;
    font-size: 10px;
  }
  
  .gem-level {
    bottom: -18px;
    font-size: 10px;
    padding: 1px 8px;
  }
  
  .gem-name {
    top: -18px;
    font-size: 9px;
  }
}
</style>