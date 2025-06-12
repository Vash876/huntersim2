<!-- filepath: c:\Users\igorn\projects\huntersim2\src\components\LiveSimulation.vue -->
<template>
  <div class="live-simulation-container">
    <!-- Error State -->
    <div v-if="initError" class="error-state">
      <IconAlertCircle size="48" :class="`text-${hunterColor}-400 mx-auto mb-4`" />
      <h3 class="text-lg font-bold text-white mb-2">Initialization Error</h3>
      <p class="text-gray-400 mb-4">{{ initError }}</p>
      <button @click="retryInit" :class="`btn-retry bg-${hunterColor}-600 hover:bg-${hunterColor}-700`">
        <IconRefresh size="16" class="mr-2" />
        Retry
      </button>
    </div>
    
    <!-- Main Content -->
    <div v-else class="simulation-content">
      <!-- Controls Panel -->
      <div class="controls-panel bg-gray-700 rounded-lg p-3 border border-gray-600 mb-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <!-- Control Buttons -->
          <div class="flex items-center gap-2">
            <button 
              @click="startSimulation" 
              :disabled="isRunning || isLoading" 
              :class="`btn-primary bg-${hunterColor}-600 hover:bg-${hunterColor}-700 disabled:bg-gray-600`"
            >
              <IconPlayerPlay v-if="!isRunning" size="16" class="mr-2" />
              <IconPlayerPause v-else size="16" class="mr-2" />
              {{ isLoading ? 'Loading...' : (isRunning ? 'Running' : 'Start') }}
            </button>
            
            <button 
              @click="pauseSimulation" 
              :disabled="!isRunning" 
              class="btn-secondary"
            >
              <IconPlayerPause size="16" class="mr-2" />
              Pause
            </button>
            
            <button 
              @click="stepForward" 
              :disabled="isRunning || isLoading" 
              class="btn-secondary"
            >
              <IconPlayerTrackNext size="16" class="mr-2" />
              Step
            </button>
            
            <button 
              @click="resetSimulation" 
              :disabled="isLoading" 
              class="btn-secondary"
            >
              <IconRotate size="16" class="mr-2" />
              Reset
            </button>
          </div>
          
          <!-- Speed & Performance -->
          <div class="flex items-center gap-3 text-sm">
            <div class="flex items-center gap-2">
              <label class="text-gray-300">Speed:</label>
              <select v-model="simulationSpeed" class="speed-select">
                <option value="1">Ultra Fast (1ms)</option>
                <option value="50">Very Fast (50ms)</option>
                <option value="100">Fast (100ms)</option>
                <option value="250">Normal (250ms)</option>
                <option value="500">Slow (500ms)</option>
                <option value="1000">Very Slow (1s)</option>
              </select>
            </div>
            
            <div class="performance-info flex items-center gap-4 text-gray-400">
              <span>{{ stepsPerSecond.toFixed(1) }} SPS</span>
              <span>{{ actualFps.toFixed(1) }} FPS</span>
              <span>{{ totalSteps }} steps</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Game State Grid -->
      <div v-if="gameState && !isLoading" class="game-state-grid grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <!-- Character Panel -->
        <div class="character-panel bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
          <div :class="`bg-gradient-to-r from-${hunterColor}-600 to-${hunterColor}-700 p-3 border-b border-gray-600`">
            <div class="flex justify-between items-center">
              <h3 class="text-white font-bold flex items-center">
                🛡️ {{ hunterDisplayName }}
              </h3>
              <div class="text-sm text-gray-200">Level {{ buildData.level || 0 }}</div>
            </div>
          </div>
          
          <div class="p-3">
            <!-- HP Bar -->
            <div class="hp-section mb-3">
              <div class="hp-bar">
                <div 
                  :class="`hp-fill bg-gradient-to-r from-${hunterColor}-500 to-${hunterColor}-400`"
                  :style="{ width: hpPercentage + '%' }"
                ></div>
                <span class="hp-text">
                  {{ formatNumber(gameState.borge.hp) }} / {{ formatNumber(gameState.borge.maxHp) }}
                </span>
              </div>
              <div class="text-center text-sm text-gray-400 mt-1">
                {{ hpPercentage.toFixed(1) }}% HP
              </div>
            </div>
            
            <!-- Stats Grid -->
            <div class="stats-grid grid grid-cols-2 gap-2 text-sm">
              <div class="stat-item flex justify-between p-2 bg-gray-800 rounded">
                <span class="text-gray-400">⚔️ Attack</span>
                <span class="text-white font-medium">{{ formatNumber(gameState.borge.atk) }}</span>
              </div>
              <div class="stat-item flex justify-between p-2 bg-gray-800 rounded">
                <span class="text-gray-400">🔄 Revives</span>
                <span class="text-white font-medium">{{ gameState.borge.revives }}</span>
              </div>
              <div class="stat-item flex justify-between p-2 bg-gray-800 rounded col-span-2">
                <span class="text-gray-400">⏱️ Time</span>
                <span class="text-white font-medium">{{ formatTime(gameState.timing.currentTime) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enemy Panel -->
        <div class="enemy-panel bg-gray-700 rounded-lg border border-gray-600 overflow-hidden" 
             :class="{ 'border-yellow-500': gameState.enemy.isBoss }">
          <div class="bg-gradient-to-r from-red-600 to-red-700 p-3 border-b border-gray-600"
               :class="{ 'from-yellow-600 to-yellow-700': gameState.enemy.isBoss }">
            <div class="flex justify-between items-center">
              <h3 class="text-white font-bold">
                {{ gameState.enemy.isBoss ? '👑 BOSS' : '👹 Enemy' }} #{{ gameState.enemy.enemyNum }}
              </h3>
              <div class="text-sm text-gray-200">Stage {{ gameState.enemy.stage }}</div>
            </div>
          </div>
          
          <div class="p-3">
            <!-- Enemy HP Bar -->
            <div class="hp-section mb-3">
              <div class="enemy-hp-bar">
                <div 
                  class="enemy-hp-fill"
                  :class="gameState.enemy.isBoss ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'"
                  :style="{ width: enemyHpPercentage + '%' }"
                ></div>
                <span class="hp-text">
                  {{ formatNumber(gameState.enemy.hp) }} / {{ formatNumber(gameState.enemy.maxHp) }}
                </span>
              </div>
              <div class="text-center text-sm text-gray-400 mt-1">
                {{ enemyHpPercentage.toFixed(1) }}% HP
              </div>
            </div>
            
            <!-- Boss Features -->
            <div v-if="gameState.enemy.isBoss" class="boss-features">
              <div class="boss-indicator bg-gradient-to-r from-yellow-500 to-yellow-400 text-white text-center py-2 rounded font-bold text-sm mb-2">
                👑 BOSS FIGHT
              </div>
              <div v-if="gameState.effects.furyEnabled" 
                   class="fury-indicator bg-gradient-to-r from-red-500 to-red-400 text-white text-center py-2 rounded font-bold text-sm animate-pulse">
                🔥 FURY ACTIVE
              </div>
            </div>
          </div>
        </div>

        <!-- Events & Performance Panel -->
        <div class="events-panel bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
          <div :class="`bg-gradient-to-r from-${hunterColor}-600 to-${hunterColor}-700 p-3 border-b border-gray-600`">
            <h4 class="text-white font-bold">⏰ Next Events</h4>
          </div>
          
          <div class="p-3">
            <!-- Event Timeline -->
            <div class="event-timeline mb-4 max-h-32 overflow-y-auto">
              <div 
                v-for="(time, event) in sortedNextEvents" 
                :key="event"
                class="event-item flex items-center justify-between p-2 bg-gray-800 rounded mb-1 text-sm"
                :class="{ 'bg-blue-600 text-white font-medium': event === nextEventType }"
              >
                <span class="flex items-center gap-2">
                  <span>{{ getEventIcon(event) }}</span>
                  <span>{{ formatEventName(event) }}</span>
                </span>
                <span class="text-gray-400 text-xs">
                  {{ formatTime(time - gameState.timing.currentTime) }}
                </span>
              </div>
              
              <div v-if="Object.keys(sortedNextEvents).length === 0" class="text-gray-500 text-center py-2 text-sm">
                No upcoming events
              </div>
            </div>
            
            <!-- Performance Stats -->
            <div class="performance-stats">
              <div class="text-white font-medium mb-2 text-sm">📊 Performance</div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex justify-between p-1.5 bg-gray-800 rounded">
                  <span class="text-gray-400">Steps</span>
                  <span class="text-white">{{ totalSteps }}</span>
                </div>
                <div class="flex justify-between p-1.5 bg-gray-800 rounded">
                  <span class="text-gray-400">FPS</span>
                  <span class="text-white">{{ actualFps.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Log -->
      <div class="event-log bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
        <div :class="`bg-gradient-to-r from-${hunterColor}-600 to-${hunterColor}-700 p-3 border-b border-gray-600 flex justify-between items-center`">
          <h4 class="text-white font-bold">📜 Combat Log</h4>
          <button @click="clearEventLog" class="text-sm text-gray-200 hover:text-white transition-colors">
            Clear
          </button>
        </div>
        
        <div class="log-container p-3 h-48 overflow-y-auto">
          <div 
            v-for="event in eventLog.slice(0, 50)" 
            :key="event.id"
            class="log-item flex items-center gap-2 p-1.5 rounded mb-1 text-sm"
            :class="getLogItemClass(event.type)"
          >
            <span class="text-xs text-gray-500 min-w-12">{{ formatTime(event.gameTime) }}</span>
            <span class="w-5 text-center">{{ getEventIcon(event.type) }}</span>
            <span class="flex-1 text-gray-200">{{ event.text }}</span>
          </div>
          
          <div v-if="eventLog.length === 0" class="text-gray-500 text-center py-8 text-sm italic">
            No events yet - start the simulation to see combat actions
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { 
  IconPlayerPlay, IconPlayerPause, IconPlayerTrackNext, IconRotate,
  IconAlertCircle, IconRefresh
} from '@tabler/icons-vue';
import { getHunterById } from '@/constants/hunters';
import { LiveSimulationWASM } from '@/workers/wasmLiveSimulation';
import { EVAL_PARAMS as BORGE_PARAMS } from '@/constants/borge';

const props = defineProps({
  hunterId: {
    type: String,
    default: 'borge'
  },
  buildData: {
    type: Object,
    required: true
  },
  currentStage: {
    type: Number,
    required: true
  },
  upgrades: {
    type: Object,
    required: true
  },
  hunterColor: {
    type: String,
    default: 'blue'
  }
});

// Hunter-Information aus zentraler Konfiguration abrufen
const hunterInfo = computed(() => getHunterById(props.hunterId));
const hunterDisplayName = computed(() => hunterInfo.value.name);

// State
const gameState = ref(null);
const eventLog = ref([]);
const isRunning = ref(false);
const isLoading = ref(false);
const initError = ref('');
const simulationSpeed = ref(100);
const totalSteps = ref(0);
const stepsPerSecond = ref(0);
const actualFps = ref(0);

// Live Simulation Instance
const liveSimulation = new LiveSimulationWASM();
let intervalId = null;
let fpsCounter = 0;
let fpsStartTime = 0;

// Computed Properties
const hpPercentage = computed(() => 
  gameState.value ? Math.max(0, (gameState.value.borge.hp / gameState.value.borge.maxHp) * 100) : 0
);

const enemyHpPercentage = computed(() => 
  gameState.value ? Math.max(0, (gameState.value.enemy.hp / gameState.value.enemy.maxHp) * 100) : 0
);

const sortedNextEvents = computed(() => {
  if (!gameState.value) return {};
  
  const events = {
    attack: gameState.value.timing.nextAtk,
    enemyAtk: gameState.value.timing.nextEnemAtk,
    regen: gameState.value.timing.nextRegen,
    athena: gameState.value.timing.nextAthena,
    fury: gameState.value.timing.nextFury
  };
  
  // Filtere unendliche Werte heraus
  const filteredEvents = Object.fromEntries(
    Object.entries(events).filter(([, time]) => time < 999999)
  );
  
  return Object.fromEntries(
    Object.entries(filteredEvents).sort(([,a], [,b]) => a - b).slice(0, 5)
  );
});

const nextEventType = computed(() => {
  const sorted = sortedNextEvents.value;
  return Object.keys(sorted)[0] || null;
});

// ✅ FEHLENDE addEvent Funktion hinzufügen
function addEvent(text, type = 'info', gameTime = 0) {
  eventLog.value.unshift({
    id: Date.now() + Math.random(),
    text,
    type,
    gameTime,
    timestamp: new Date().toLocaleTimeString()
  });
  
  // Nur letzten 100 Events behalten
  if (eventLog.value.length > 100) {
    eventLog.value.pop();
  }
}

// Methods
async function startSimulation() {
  if (isLoading.value) return;
  
  try {
    isLoading.value = true;
    initError.value = '';
    
    if (!gameState.value) {
      await initializeSimulation();
    }
    
    isLoading.value = false;
    isRunning.value = true;
    
    // Performance Tracking
    fpsStartTime = performance.now();
    fpsCounter = 0;
    
    intervalId = setInterval(() => {
      stepForward();
    }, simulationSpeed.value);
    
  } catch (error) {
    console.error('Fehler beim Starten der Live-Simulation:', error);
    initError.value = error.message || 'Failed to initialize simulation';
    isLoading.value = false;
  }
}

function pauseSimulation() {
  isRunning.value = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function stepForward() {
  if (!gameState.value || isLoading.value) return;
  
  try {
    // Ein Schritt in der WASM Simulation
    const canContinue = liveSimulation.step();
    
    if (!canContinue) {
      // Simulation beendet
      pauseSimulation();
      const finalStage = gameState.value.enemy.stage;
      addEvent(`🏁 Simulation ended! Final stage: ${finalStage}`, 'death', gameState.value.timing.currentTime);
      return;
    }
    
    // Neuen State holen
    const newState = liveSimulation.getState();
    
    // Event Log aktualisieren
    if (newState.lastEvent && newState.lastEvent.type && newState.lastEvent.type !== gameState.value?.lastEvent?.type) {
      addEvent(
        formatEventText(newState.lastEvent), 
        newState.lastEvent.type,
        newState.timing.currentTime
      );
    }
    
    gameState.value = newState;
    totalSteps.value++;
    
    // Performance Update
    stepsPerSecond.value = 1000 / Math.max(simulationSpeed.value, 16);
    
    // FPS Tracking
    fpsCounter++;
    const now = performance.now();
    if (now - fpsStartTime >= 1000) {
      actualFps.value = fpsCounter / ((now - fpsStartTime) / 1000);
      fpsCounter = 0;
      fpsStartTime = now;
    }
    
  } catch (error) {
    console.error('Fehler beim Simulation Step:', error);
    pauseSimulation();
    initError.value = 'Simulation error: ' + error.message;
  }
}

function resetSimulation() {
  pauseSimulation();
  gameState.value = null;
  eventLog.value = [];
  totalSteps.value = 0;
  stepsPerSecond.value = 0;
  actualFps.value = 0;
  initError.value = '';
}

function clearEventLog() {
  eventLog.value = [];
}

// Helper Functions
function extractParamValue(hunterId, buildData, currentStage, upgrades, param) {
  // Build-spezifische Overrides haben Priorität
  if (buildData?.overrides && param in buildData.overrides) {
    return buildData.overrides[param];
  }
  
  if (param === 'iterations') {
    return 1; // Für Live Sim nicht relevant
  }
  
  if (param === 'lvl') {
    return buildData?.level || 0;
  }
  
  if (param === 'stage' || param === 'maxStage') {
    return currentStage;
  }
  
  // Talents aus buildData
  if (buildData?.talents && param in buildData.talents) {
    return buildData.talents[param];
  }
  
  // Attributes aus buildData
  if (buildData?.attributes && param in buildData.attributes) {
    return buildData.attributes[param];
  }
  
  // Upgrades aus upgrades Parameter
  if (param.startsWith('upgrades.')) {
    const parts = param.split('.');
    if (parts.length === 3) {
      const [_, category, key] = parts;
      return upgrades?.[category]?.[key] || 0;
    }
  }
  
  return 0;
}

async function initializeSimulation() {
  // Prüfe Props vor Verwendung
  if (!props.buildData) {
    throw new Error('Build data is required for simulation');
  }

  // WASM initialisieren
  await liveSimulation.initialize();
  
  // Parameter extrahieren mit neuen Props
  const params = BORGE_PARAMS.map(param => 
    extractParamValue(
      props.hunterId, 
      props.buildData, 
      props.currentStage, 
      props.upgrades, 
      param
    )
  );
  
  console.log('Live Simulation: Initialisiere mit Parametern:', params);
  console.log('Live Simulation: Current Stage:', props.currentStage);
  console.log('Live Simulation: Upgrades:', props.upgrades);
  console.log('Live Simulation: BuildData:', props.buildData);
  
  // WASM Simulation initialisieren
  liveSimulation.initSimulation(params);
  
  // Initial State holen
  gameState.value = liveSimulation.getState();
  
  // ✅ addEvent wird jetzt definiert aufgerufen
  addEvent('🚀 Simulation started', 'info', 0);
  totalSteps.value = 0;
}

async function retryInit() {
  initError.value = '';
  await initializeSimulation();
}

function formatEventText(event) {
  switch (event.type) {
    case 'attack':
      return `Attack dealt ${formatNumber(event.damage)} damage`;
    case 'athena':
      return `Athena strike dealt ${formatNumber(event.damage)} damage`;
    case 'enemyAttack':
      return `Enemy attacked for ${formatNumber(event.damage)} damage`;
    case 'bonusAttack':
      return `Boss bonus attack dealt ${formatNumber(event.damage)} damage`;
    case 'regen':
      return `Regenerated ${formatNumber(event.healing)} HP`;
    case 'revive':
      return `Revived with ${formatNumber(event.healing)} HP`;
    case 'stageComplete':
      return `Stage ${event.stage} completed!`;
    case 'bossKill':
      return `Boss defeated! Stage ${event.stage} complete!`;
    case 'furyStart':
      return `Fury activated!`;
    case 'furyEnd':
      return `Fury ended`;
    default:
      return `Unknown event: ${event.type}`;
  }
}

function formatEventName(event) {
  const names = {
    attack: 'Attack',
    enemyAtk: 'Enemy Attack',
    regen: 'Regeneration',
    athena: 'Athena Strike',
    fury: 'Fury Toggle'
  };
  return names[event] || event;
}

function getEventIcon(eventType) {
  const icons = {
    attack: '⚔️',
    enemyAtk: '💥',
    enemyAttack: '💥',
    bonusAttack: '💥💥',
    regen: '💚',
    athena: '⚡',
    fury: '🔥',
    furyStart: '🔥',
    furyEnd: '❄️',
    revive: '🔄',
    stageComplete: '🎯',
    bossKill: '👑',
    death: '💀',
    info: 'ℹ️'
  };
  return icons[eventType] || '•';
}

function getLogItemClass(eventType) {
  const classes = {
    attack: 'bg-green-900/30',
    athena: 'bg-blue-900/30',
    enemyAttack: 'bg-red-900/30',
    bonusAttack: 'bg-red-900/40',
    regen: 'bg-green-900/20',
    revive: 'bg-purple-900/30',
    stageComplete: 'bg-blue-900/30',
    bossKill: 'bg-yellow-900/30',
    furyStart: 'bg-orange-900/30',
    furyEnd: 'bg-gray-900/30',
    death: 'bg-red-900/40',
    info: 'bg-gray-900/20'
  };
  return classes[eventType] || 'bg-gray-900/20';
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return Math.floor(num).toString();
}

function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(0);
  return `${minutes}:${remainingSeconds.padStart(2, '0')}`;
}

// Lifecycle
onMounted(() => {
  console.log('Live Simulation Component mounted für:', props.hunterId);
  console.log('Props received:', {
    hunterId: props.hunterId,
    buildData: props.buildData,
    currentStage: props.currentStage,
    upgrades: props.upgrades,
    hunterColor: props.hunterColor
  });
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// Watch for speed changes
watch(simulationSpeed, (newSpeed) => {
  if (isRunning.value && intervalId) {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      stepForward();
    }, newSpeed);
  }
});
</script>

<style scoped>
.live-simulation-container {
  min-height: 600px;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.btn-retry, .btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary {
  background: #374151;
  color: #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
  color: white;
}

.btn-secondary:disabled {
  color: #6b7280;
}

.speed-select {
  padding: 0.25rem 0.5rem;
  background: #374151;
  color: white;
  border: 1px solid #4b5563;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.hp-bar, .enemy-hp-bar {
  position: relative;
  height: 24px;
  background: #374151;
  border-radius: 12px;
  overflow: hidden;
}

.hp-fill, .enemy-hp-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.hp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 0.75rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}
</style>