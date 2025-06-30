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

      <!-- Game-like Battle Interface -->
      <div v-if="gameState && !isLoading" class="battle-interface">
        <!-- Top Status Bar - Game Style -->
        <div class="top-status-bar bg-gradient-to-r from-gray-800 to-gray-900 p-3 rounded-lg mb-4 border border-gray-600">
          <div class="flex justify-between items-center">
            <!-- Stage & Enemy Counter -->
            <div class="stage-info">
              <div class="text-sm text-gray-400 uppercase tracking-wide">Stage</div>
              <div class="text-2xl font-bold text-white">{{ gameState.enemy.stage }}</div>
            </div>
            
            <!-- Kills Counter -->
            <div class="kills-info text-center">
              <div class="text-sm text-gray-400 uppercase tracking-wide">Kills</div>
              <div class="text-2xl font-bold text-red-400">{{ gameState.enemy.enemyNum }}</div>
            </div>
            
            <!-- Time Display -->
            <div class="time-info text-right">
              <div class="text-sm text-gray-400 uppercase tracking-wide">Time</div>
              <div class="text-lg font-bold text-blue-400">{{ formatTime(gameState.timing?.currentTime || 0) }}</div>
            </div>
          </div>
        </div>

        <!-- Battle Arena - Two Column Layout like the game -->
        <div class="battle-arena grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          <!-- Left Side - Player (Borge) -->
          <div class="player-side">
            <!-- Player Character Card -->
            <div class="character-card bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border-2 border-blue-500 overflow-hidden">
              <!-- Character Header -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="character-avatar w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span class="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 class="text-white font-bold text-lg">{{ hunterDisplayName }}</h3>
                    <div class="text-blue-200 text-sm">Level {{ buildData.level || 0 }}</div>
                  </div>
                </div>
                <div class="debuffs-indicator text-right">
                  <!-- Shield Break Debuff Badge -->
                  <div 
                    v-if="gameState.borge.shieldBreakStacks > 0" 
                    class="shield-break-badge bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse mb-1"
                    :title="`Shield Break: ${gameState.borge.shieldBreakStacks} stacks reducing DR by ${(gameState.borge.shieldBreakDrLoss * 100).toFixed(1)}%`"
                  >
                    ⚡ Shield Break x{{ gameState.borge.shieldBreakStacks }}
                  </div>
                  
                  <div class="text-blue-200 text-xs uppercase">Revives</div>
                  <div class="text-white font-bold">{{ gameState.borge?.revives || 0 }}</div>
                </div>
              </div>

              <!-- Player HP Bar -->
              <div class="hp-section p-4 pb-2">
                <div class="hp-bar-container">
                  <div class="hp-bar-game">
                    <div 
                      class="hp-fill-game bg-gradient-to-r from-green-500 to-green-400"
                      :style="{ width: correctedHpPercentage + '%' }"
                    ></div>
                    <div class="hp-text-game">
                      <span class="hp-current">{{ formatNumber(gameState.borge.hp) }}</span>
                      <span class="hp-separator">/</span>
                      <span class="hp-max">{{ formatNumber(correctedMaxHp) }}</span>
                    </div>
                  </div>
                  <div class="hp-percentage text-center text-sm text-green-400 mt-1 font-semibold">
                    {{ correctedHpPercentage.toFixed(1) }}% HP
                  </div>
                </div>
              </div>

              <!-- Player Stats Grid -->
              <div class="player-stats p-4 pt-2">
                <div class="stats-grid-game grid grid-cols-2 gap-2 text-sm">
                  <!-- Attack -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">⚔️</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">ATK Power</div>
                      <div class="stat-value text-red-400 font-bold">
                        {{ liveBuildStats?.atk ? formatNumber(liveBuildStats.atk) : formatNumber(gameState.borge?.atk || 0) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- HP Regen -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">💚</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">HP Regen</div>
                      <div class="stat-value text-green-400 font-bold">
                        {{ liveBuildStats?.regen ? liveBuildStats.regen.toFixed(1) : formatNumber(gameState.borge?.regen || 0) }}/s
                      </div>
                    </div>
                  </div>
                  
                  <!-- Damage Reduction -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">🛡️</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">DMG Reduction</div>
                      <div class="stat-value text-orange-400 font-bold">
                        {{ liveBuildStats?.dr ? (liveBuildStats.dr * 100).toFixed(1) : ((gameState.borge?.dr || 0) * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Evade -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">💨</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Evade Chance</div>
                      <div class="stat-value text-yellow-400 font-bold">
                        {{ liveBuildStats?.evade ? (liveBuildStats.evade * 100).toFixed(1) : ((gameState.borge?.evade || 0) * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Effect -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">✨</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Effect Chance</div>
                      <div class="stat-value text-blue-400 font-bold">
                        {{ liveBuildStats?.effect ? (liveBuildStats.effect * 100).toFixed(1) : ((gameState.borge?.effect || 0) * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Crit Rate -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">💥</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Crit Chance</div>
                      <div class="stat-value text-yellow-400 font-bold">
                        {{ liveBuildStats?.critRate ? (liveBuildStats.critRate * 100).toFixed(1) : ((gameState.borge?.critRate || 0) * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Crit Power -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Crit Power</div>
                      <div class="stat-value text-orange-400 font-bold">
                        x{{ liveBuildStats?.critPower ? liveBuildStats.critPower.toFixed(2) : (gameState.borge?.critPower || 1).toFixed(2) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- ATK Speed -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">ATK Speed</div>
                      <div class="stat-value text-cyan-400 font-bold">
                        {{ liveBuildStats?.reload ? liveBuildStats.reload.toFixed(2) : (gameState.borge?.reload || 0).toFixed(2) }}s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - Enemy -->
          <div class="enemy-side">
            <!-- Enemy Character Card -->
            <div class="character-card bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border-2 overflow-hidden"
                 :class="gameState.enemy.isBoss ? 'border-yellow-500' : 'border-red-500'">
              
              <!-- Enemy Header -->
              <div class="character-header p-4"
                   :class="gameState.enemy.isBoss ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' : 'bg-gradient-to-r from-red-600 to-red-700'">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="character-avatar w-12 h-12 rounded-full flex items-center justify-center mr-3"
                         :class="gameState.enemy.isBoss ? 'bg-yellow-500' : 'bg-red-500'">
                      <span class="text-2xl">{{ gameState.enemy.isBoss ? '👑' : '👹' }}</span>
                    </div>
                    <div>
                      <h3 class="text-white font-bold text-lg">
                        {{ gameState.enemy.isBoss ? `Boss ${gameState.enemy.stage}` : `Enemy ${gameState.enemy.enemyNum}` }}
                      </h3>
                      <div class="text-red-200 text-sm">
                        {{ gameState.enemy.isBoss ? 'Stage Boss' : 'Regular Enemy' }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- NEU: Boss Features mit Enrage und Fury -->
                  <div v-if="gameState.enemy.isBoss" class="boss-features text-right space-y-1">
                    <!-- Fury Indicator -->
                    <div v-if="gameState.effects.furyEnabled" 
                         class="fury-badge bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse"
                         title="Fury: 3x Attack Speed">
                      🔥 FURY ACTIVE
                    </div>
                    
                    <!-- Enrage Level -->
                    <div v-if="gameState.enemy.enrage > 0"
                         class="enrage-badge bg-red-600 text-white px-2 py-1 rounded text-xs font-bold"
                         :class="{ 'animate-pulse': gameState.enemy.enrage >= 10 }"
                         :title="`Enrage Level ${gameState.enemy.enrage}: ${gameState.enemy.enrageSpeedReduction.toFixed(2)}s speed reduction`">
                      ⚡ ENRAGE x{{ gameState.enemy.enrage }}
                    </div>
                    
                    <!-- Combo Badge wenn beides aktiv -->
                    <div v-if="gameState.effects.furyEnabled && gameState.enemy.enrage >= 5"
                         class="combo-badge bg-gradient-to-r from-red-600 to-orange-500 text-white px-2 py-1 rounded text-xs font-bold animate-bounce"
                         title="DANGER: Fury + High Enrage = Maximum Speed">
                      💀 DANGER ZONE
                    </div>
                  </div>
                </div>
              </div>

              <!-- Enemy HP Bar -->
              <div class="hp-section p-4 pb-2">
                <div class="hp-bar-container">
                  <div class="hp-bar-game">
                    <div 
                      class="hp-fill-game"
                      :class="gameState.enemy.isBoss ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-red-400'"
                      :style="{ width: enemyHpPercentage + '%' }"
                    ></div>
                    <div class="hp-text-game">
                      <span class="hp-current">{{ formatNumber(gameState.enemy.hp) }}</span>
                      <span class="hp-separator">/</span>
                      <span class="hp-max">{{ formatNumber(gameState.enemy.maxHp) }}</span>
                    </div>
                  </div>
                  <div class="hp-percentage text-center text-sm font-semibold mt-1"
                       :class="gameState.enemy.isBoss ? 'text-yellow-400' : 'text-red-400'">
                    {{ enemyHpPercentage.toFixed(1) }}% HP
                  </div>
                </div>
              </div>

              <!-- Enemy Stats Grid  -->
              <div class="enemy-stats p-4 pt-2">
                <div class="stats-grid-game grid grid-cols-2 gap-2 text-sm">
                  <!-- Enemy ATK Power -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">⚔️</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">ATK Power</div>
                      <div class="stat-value text-red-400 font-bold">
                        {{ formatEnemyNumber(gameState.enemy.atk) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enemy HP Regen -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">💚</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">HP Regen</div>
                      <div class="stat-value text-green-400 font-bold">
                        {{ formatEnemyNumber(gameState.enemy.regen) }}/s
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enemy DMG Reduction -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">🛡️</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">DMG Reduction</div>
                      <div class="stat-value text-orange-400 font-bold">
                        {{ ((1 - gameState.enemy.dr) * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enemy Evade -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">💨</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Evade Chance</div>
                      <div class="stat-value text-yellow-400 font-bold">
                        {{ (gameState.enemy.evade * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enemy Effect -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">✨</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Effect Chance</div>
                      <div class="stat-value text-blue-400 font-bold">
                        {{ (gameState.enemy.effect * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enemy Crit -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">💥</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Crit Chance</div>
                      <div class="stat-value text-yellow-400 font-bold">
                        {{ (gameState.enemy.critRate * 100).toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enemy Crit Power -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Crit Power</div>
                      <div class="stat-value text-orange-400 font-bold">
                        x{{ gameState.enemy.critDmg.toFixed(2) }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Enemy ATK Speed -->
                  <div class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">ATK Speed</div>
                      <div class="stat-value text-cyan-400 font-bold">
                        {{ gameState.enemy.atkSpd.toFixed(2) }}s
                      </div>
                    </div>
                  </div>
                  
                  <!-- NEU: Enrage Level (nur für Bosse) -->
                  <div v-if="gameState.enemy.isBoss" class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Enrage Level</div>
                      <div class="stat-value font-bold" 
                           :class="gameState.enemy.enrage >= 10 ? 'text-red-400' : (gameState.enemy.enrage >= 5 ? 'text-orange-400' : 'text-white')">
                        {{ gameState.enemy.enrage }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- NEU: Effective Attack Speed (zeigt Enrage + Fury Effekt) -->
                  <div v-if="gameState.enemy.isBoss" class="stat-item-game bg-gray-800/50 rounded p-2">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-info">
                      <div class="stat-label text-gray-400">Effective Speed</div>
                      <div class="stat-value font-bold"
                           :class="effectiveAttackSpeed <= 1.0 ? 'text-red-400' : (effectiveAttackSpeed <= 2.0 ? 'text-orange-400' : 'text-white')">
                        {{ effectiveAttackSpeed.toFixed(2) }}s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Panel - Events & Combat Log -->
        <div class="bottom-panel grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          <!-- Next Events Panel -->
          <div class="events-panel bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
            <div :class="`bg-gradient-to-r from-${hunterColor}-600 to-${hunterColor}-700 p-3 border-b border-gray-600`">
              <h4 class="text-white font-bold flex items-center">
                <IconClock size="18" class="mr-2" />
                Next Events
              </h4>
            </div>
            
            <div class="p-3">
              <div class="event-timeline max-h-40 overflow-y-auto">
                <div 
                  v-for="(time, event) in sortedNextEvents" 
                  :key="event"
                  class="event-item flex items-center justify-between p-2 bg-gray-800/50 rounded mb-2 text-sm"
                  :class="{ 
                    'bg-blue-600/50 font-medium': event === nextEventType,
                    'bg-orange-600/50': event === 'fury',
                    'bg-red-600/50': event === 'bossBonusAtk'
                  }"
                >
                  <span class="flex items-center gap-2">
                    <span class="text-lg">{{ getEventIcon(event) }}</span>
                    <span>{{ formatEventName(event) }}</span>
                  </span>
                  <span class="text-gray-400 text-xs font-mono">
                    {{ formatTime(time - gameState.timing.currentTime) }}
                  </span>
                </div>
                
                <div v-if="Object.keys(sortedNextEvents).length === 0" class="text-gray-500 text-center py-4 text-sm">
                  No upcoming events
                </div>
              </div>
            </div>
          </div>

          <!-- Combat Log -->
          <div class="combat-log bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
            <div :class="`bg-gradient-to-r from-${hunterColor}-600 to-${hunterColor}-700 p-3 border-b border-gray-600 flex justify-between items-center`">
              <h4 class="text-white font-bold flex items-center">
                <IconLogs size="18" class="mr-2" />
                Combat Log
              </h4>
              <button @click="clearEventLog" class="text-sm text-gray-200 hover:text-white transition-colors">
                Clear
              </button>
            </div>
            
            <div class="log-container p-3 h-40 overflow-y-auto">
              <div 
                v-for="event in eventLog.slice(0, 30)" 
                :key="event.id"
                class="log-item flex items-start gap-2 p-1.5 rounded mb-1 text-sm"
                :class="getLogItemClass(event.type)"
              >
                <span class="text-xs text-gray-500 min-w-12 font-mono mt-0.5">{{ formatTime(event.gameTime) }}</span>
                <span class="w-5 text-center mt-0.5">{{ getEventIcon(event.type) }}</span>
                <span class="flex-1 text-gray-200">{{ event.text }}</span>
              </div>
              
              <div v-if="eventLog.length === 0" class="text-gray-500 text-center py-8 text-sm italic">
                No combat events yet - start the simulation to see battle actions
              </div>
            </div>
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
  IconAlertCircle, IconRefresh, IconClock, IconLogs
} from '@tabler/icons-vue';
import { getHunterById } from '@/constants/hunters';
import { LiveSimulationWASM } from '@/workers/wasmLiveSimulation';
import { EVAL_PARAMS as BORGE_PARAMS } from '@/constants/borge';
import { useHunterStore } from '@/store/hunterStore';

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

// Store verwenden für komplette Datenstruktur
const hunterStore = useHunterStore();

// Build Stats aus BuildData extrahieren
const buildStats = computed(() => {
  return props.buildData?.results?.buildStats || null;
});

const mainBuildStats = computed(() => {
  if (!buildStats.value) return [];
  
  const mainStatLabels = [
    'Max HP', 'Attack', 'Regen', 'Damage Reduction', 
    'Evade', 'Effect', 'Crit Rate', 'Crit Power', 'Reload'
  ];
  
  return buildStats.value.filter(stat => 
    mainStatLabels.includes(stat.label)
  );
});

// Build Stats in Live Stats umwandeln
const liveBuildStats = computed(() => {
  if (!buildStats.value) return null;
  
  const statMapping = {
    'Max HP': 'maxHp',
    'Attack': 'atk', 
    'Regen': 'regen',
    'Damage Reduction': 'dr',
    'Evade': 'evade',
    'Effect': 'effect',
    'Crit Rate': 'critRate',
    'Crit Power': 'critPower',
    'Reload': 'reload'
  };
  
  const result = {};
  
  buildStats.value.forEach(stat => {
    const liveStatKey = statMapping[stat.label];
    if (liveStatKey) {
      let value = stat.value;
      
      if (stat.multiplier) {
        value *= stat.multiplier;
      }
      
      result[liveStatKey] = value;
    }
  });
  
  return result;
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

// Korrigierte HP Berechnungen mit Build Stats
const correctedMaxHp = computed(() => {
  if (liveBuildStats.value?.maxHp) {
    return liveBuildStats.value.maxHp;
  }
  return gameState.value?.borge?.maxHp || 0;
});

const correctedHpPercentage = computed(() => {
  if (!gameState.value || !correctedMaxHp.value) return 0;
  return Math.max(0, (gameState.value.borge.hp / correctedMaxHp.value) * 100);
});

// NEU: Computed für effective attack speed
const effectiveAttackSpeed = computed(() => {
  if (!gameState.value || !gameState.value.enemy.isBoss) return 0;
  
  let baseSpeed = gameState.value.enemy.atkSpd;
  let currentSpeed = baseSpeed;
  
  // Enrage Reduction
  if (gameState.value.enemy.enrage > 0) {
    const enrageReduction = gameState.value.enemy.enrageSpeedReduction;
    currentSpeed = Math.max(0.5, baseSpeed - enrageReduction);
  }
  
  // Fury 3x Speed
  if (gameState.value.effects.furyEnabled) {
    currentSpeed = currentSpeed / 3;
  }
  
  return currentSpeed;
});

// Erweitere sortedNextEvents für Boss Bonus Attacks
const sortedNextEvents = computed(() => {
  if (!gameState.value) return {};
  
  const events = {
    attack: gameState.value.timing.nextAtk,
    enemyAtk: gameState.value.timing.nextEnemAtk,
    regen: gameState.value.timing.nextRegen,
    athena: gameState.value.timing.nextAthena,
    fury: gameState.value.timing.nextFury
  };
  
  // Boss Bonus Attack nur wenn es ein Boss ist
  if (gameState.value.enemy.isBoss && gameState.value.timing.nextBossBonusAtk < 999999) {
    events.bossBonusAtk = gameState.value.timing.nextBossBonusAtk;
  }
  
  const filteredEvents = Object.fromEntries(
    Object.entries(events).filter(([, time]) => time < 999999)
  );
  
  return Object.fromEntries(
    Object.entries(filteredEvents).sort(([,a], [,b]) => a - b).slice(0, 6)
  );
});

const nextEventType = computed(() => {
  const sorted = sortedNextEvents.value;
  return Object.keys(sorted)[0] || null;
});

// KORRIGIERTE Parameter-Extraktion - EXAKT wie evaluationWorker.js
function extractParamValue(storeData, hunterId, buildData, param) {
  console.log(`Live Sim - Extracting param: ${param}`);
  
  // Spezielle Behandlung für useSeeded-Parameter
  if (param === 'useSeeded') {    
    const seedSetting = storeData.hunterSeedSettings?.[hunterId];
    if (seedSetting === false) {
      return false;
    }
    return true;
  }

  // Override-Werte haben höchste Priorität
  if (buildData?.overrides && param in buildData.overrides) {
    // Spezielle Behandlung für diamondspecials.hunterloot in Overrides
    if (param === 'upgrades.diamondspecials.hunterloot') {
      const level = buildData.overrides[param] || 0;
      console.log(`  -> Override hunterloot: ${level} -> ${1 + level * 0.025}`);
      return 1 + level * 0.025; // Level 10 = 1.25
    } else if (param === 'upgrades.diamondspecials.reviveboost') {
      const level = buildData.overrides[param] || 0;
      console.log(`  -> Override reviveboost: ${level} -> ${level * 3}`);
      return level * 3; // Level 10 = 30
    }
    console.log(`  -> Override: ${buildData.overrides[param]}`);
    return buildData.overrides[param];
  }

  // Spezielle Parameter behandeln
  if (param === 'iterations') {
    return 1; // Für Live Sim immer 1
  }
  if (param === 'lvl') {
    const level = buildData.level || 0;
    console.log(`  -> Level: ${level}`);
    return level;
  }
  if (param === 'stage' || param === 'maxStage') {
    const stage = storeData.hunterStats?.[hunterId]?.stage || 0;
    console.log(`  -> Stage: ${stage}`);
    return stage;
  }

  // Build-spezifische Parameter (talents oder attributes)
  if (buildData?.talents && param in buildData.talents) {
    const value = buildData.talents[param];
    console.log(`  -> Talent ${param}: ${value}`);
    return value;
  }
  if (buildData?.attributes && param in buildData.attributes) {
    const value = buildData.attributes[param];
    console.log(`  -> Attribute ${param}: ${value}`);
    return value;
  }

  // Hunter-Stats aus dem Store
  if (storeData.hunterStats?.[hunterId] && param in storeData.hunterStats[hunterId]) {
    const value = storeData.hunterStats[hunterId][param];
    console.log(`  -> HunterStats ${param}: ${value}`);
    return value;
  }

  // Verbesserte Upgrades-Extraktion mit Mappings für verschiedene Formate
  if (param.startsWith('upgrades.')) {
    const parts = param.split('.');
    
    let value;
    
    // Format: upgrades.category.key (z.B. upgrades.relics.r17)
    if (parts.length === 3) {
      const [_, category, key] = parts;
      
      // Spezielle Behandlung für diamondspecials.hunterloot
      if (category === 'diamondspecials' && key === 'hunterloot') {
        const level = storeData.upgrades?.[category]?.[key] || 0;
        const result = 1 + level * 0.025;
        console.log(`  -> Upgrade hunterloot: level ${level} -> ${result}`);
        return result; // Level 10 = 1.25
      } else if (category === 'diamondspecials' && key === 'reviveboost') {
        const level = storeData.upgrades?.[category]?.[key] || 0;
        const result = level * 3;
        console.log(`  -> Upgrade reviveboost: level ${level} -> ${result}`);
        return result;
      }
      
      value = storeData.upgrades?.[category]?.[key];
      
      // Versuche alternative Formate, wenn nichts gefunden wurde
      if (value === undefined) {
        // Format für Relics könnte anders sein
        if (category === 'relics' && key.startsWith('r')) {
          value = storeData.upgrades?.relics?.[key.substring(1)]; // "r17" -> "17"
        }
        
        // Format für Inscryptions 
        if (category === 'inscryptions' && key.startsWith('i')) {
          value = storeData.upgrades?.inscryptions?.[key.substring(1)]; // "i31" -> "31"
          // Oder möglicherweise als "inscryp31"
          if (value === undefined) {
            value = storeData.upgrades?.inscryptions?.[`inscryp${key.substring(1)}`]; // "i31" -> "inscryp31"
          }
        }
        
        // Format für gems_nodes
        if (category === 'gems_nodes') {
          // Beispiel: "attraction_gem3" -> "attraction.nodes.gem3"
          const nodeParts = key.split('_');
          if (nodeParts.length === 2) {
            value = storeData.upgrades?.gems?.[nodeParts[0]]?.nodes?.[nodeParts[1]];
          }
        }
      }
      
      console.log(`  -> Upgrade ${category}.${key}: ${value || 0}`);
      return value || 0;
    }
    // Format: upgrades.category.subcategory.key (z.B. upgrades.gems.attraction.level)
    else if (parts.length === 4) {
      const [_, category, subcategory, key] = parts;
      const value = storeData.upgrades?.[category]?.[subcategory]?.[key] || 0;
      console.log(`  -> Upgrade ${category}.${subcategory}.${key}: ${value}`);
      return value;
    }
  }

  // Fallback - für alle sonstigen Parameter
  console.log(`Live Sim - Parameter ${param} nicht gefunden, verwende 0`);
  return 0;
}

// Event Functions
function addEvent(text, type = 'info', gameTime = 0) {
  eventLog.value.unshift({
    id: Date.now() + Math.random(),
    text,
    type,
    gameTime,
    timestamp: new Date().toLocaleTimeString()
  });
  
  if (eventLog.value.length > 100) {
    eventLog.value.pop();
  }
}

// Simulation Control Methods
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
    const canContinue = liveSimulation.step();
    
    if (!canContinue) {
      pauseSimulation();
      const finalStage = gameState.value.enemy.stage;
      addEvent(`🏁 Simulation ended! Final stage: ${finalStage}`, 'death', gameState.value.timing.currentTime);
      return;
    }
    
    const newState = liveSimulation.getState();
    
    if (newState.lastEvent && newState.lastEvent.type && newState.lastEvent.type !== gameState.value?.lastEvent?.type) {
      addEvent(
        formatEventText(newState.lastEvent), 
        newState.lastEvent.type,
        newState.timing.currentTime
      );
    }
    
    gameState.value = newState;
    totalSteps.value++;
    
    stepsPerSecond.value = 1000 / Math.max(simulationSpeed.value, 16);
    
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

async function initializeSimulation() {
  if (!props.buildData) {
    throw new Error('Build data is required for simulation');
  }

  await liveSimulation.initialize();
  
  console.log('=== LIVE SIMULATION PARAMETER EXTRACTION (KORRIGIERT) ===');
  console.log('Build Data:', props.buildData);
  console.log('Hunter Store Data:', hunterStore.$state);
  
  // Store Data Struktur exakt wie in evaluationWorker.js
  const storeData = {
    hunterStats: hunterStore.hunterStats,
    upgrades: hunterStore.upgrades,
    hunterIterations: hunterStore.hunterIterations,
    hunterSeedSettings: hunterStore.hunterSeedSettings
  };
  
  console.log('Store Data Structure:', storeData);
  
  // Parameter extrahieren mit der GLEICHEN Funktion wie evaluationWorker.js
  const params = BORGE_PARAMS.map((param, index) => {
    const value = extractParamValue(
      storeData,
      props.hunterId, 
      props.buildData, 
      param
    );
    console.log(`[${index}] ${param}: ${value}`);
    return value;
  });
  
  console.log('=== FINAL PARAMETERS FOR LIVE SIMULATION WASM ===');
  console.log('Parameters Array:', params);
  console.log('Parameters Length:', params.length);
  console.log('Expected Length:', BORGE_PARAMS.length);
  console.log('BORGE_PARAMS:', BORGE_PARAMS);
  
  liveSimulation.initSimulation(params);
  
  gameState.value = liveSimulation.getState();
  console.log('=== INITIAL GAME STATE (KORRIGIERT) ===');
  console.log('Borge Stats:', gameState.value.borge);
  
  addEvent('🚀 Simulation started', 'info', 0);
  totalSteps.value = 0;
}

async function retryInit() {
  initError.value = '';
  await initializeSimulation();
}

// Helper Functions
function formatEventText(event) {
  console.log('Formatting event:', event);
  
  switch (event.type) {
    case 'bonusAttack':
      return `Boss bonus attack for ${formatNumber(event.damage)} damage (Enrage +1)`;
      
    case 'furyStart':
      return `🔥 Boss FURY activated! (3x attack speed)`;
    
    case 'furyEnd':
      return `❄️ Boss fury ended (normal speed restored)`;
      
    case 'enemyAttack':
      let attackText = `Enemy attacked for ${formatNumber(event.damage)} damage`;
      
      // Zeige Enrage Info wenn Boss
      if (gameState.value?.enemy?.isBoss && gameState.value?.enemy?.enrage > 0) {
        attackText += ` (Enrage x${gameState.value.enemy.enrage})`;
      }
      
      if (gameState.value?.borge?.shieldBreakStacks > 0) {
        attackText += ` (Shield Break applied!)`;
      }
      
      return attackText;
      
    case 'attack':
      return `Attack dealt ${formatNumber(event.damage)} damage`;
    
    case 'athena':
      return `Athena strike dealt ${formatNumber(event.damage)} damage`;
      
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
    
    case 'death':
      return `Character died`;
    
    default:
      console.warn(`Unknown event type: ${event.type}`);
      return `Unknown event: ${event.type}`;
  }
}

function formatEventName(event) {
  const names = {
    attack: 'Attack',
    enemyAtk: 'Enemy Attack',
    regen: 'Regeneration',
    athena: 'Athena Strike',
    fury: 'Fury Toggle',
    bossBonusAtk: 'Boss Bonus Attack' // NEU
  };
  return names[event] || event;
}

function getEventIcon(eventType) {
  const icons = {
    attack: '⚔️',
    enemyAtk: '💥',
    enemyAttack: '💥',
    bonusAttack: '💥💥',
    bossBonusAtk: '💥💥', // NEU
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
    bonusAttack: 'bg-red-900/50', // Intensiver für Bonus Attacks
    regen: 'bg-green-900/20',
    revive: 'bg-purple-900/30',
    stageComplete: 'bg-blue-900/30',
    bossKill: 'bg-yellow-900/30',
    furyStart: 'bg-orange-900/40', // Intensiver für Fury
    furyEnd: 'bg-gray-900/30',
    death: 'bg-red-900/40',
    info: 'bg-gray-900/20'
  };
  return classes[eventType] || 'bg-gray-900/20';
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
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

function formatStatValue(stat) {
  if (!stat || stat.value === undefined) return '0';
  
  let value = stat.value;
  
  if (stat.multiplier) {
    value *= stat.multiplier;
  }
  
  if (stat.roundDigits !== undefined) {
    return value.toFixed(stat.roundDigits);
  }
  
  return typeof value === 'number' ? value.toLocaleString('en-US') : String(value || '0');
}

// NEU: Enemy Stats Formatierung
function formatEnemyNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  return Math.floor(num).toString();
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
  padding: 0.5rem 1rem;
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

.battle-interface {
  font-family: 'Inter', sans-serif;
}

.top-status-bar {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.battle-arena {
  gap: 2rem;
}

.character-card {
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
}

.character-header {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.character-avatar {
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.hp-bar-game {
  position: relative;
  height: 32px;
  background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.1);
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
}

.hp-fill-game {
  height: 100%;
  transition: width 0.5s ease-out;
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.2);
}

.hp-text-game {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.hp-current {
  color: #fbbf24;
}

.hp-separator {
  color: #9ca3af;
}

.hp-max {
  color: #d1d5db;
}

.stats-grid-game {
  gap: 0.5rem;
}

.stat-item-game {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(55,65,81,0.8) 0%, rgba(31,41,55,0.8) 100%);
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s ease;
}

.stat-item-game:hover {
  background: linear-gradient(135deg, rgba(75,85,99,0.8) 0%, rgba(55,65,81,0.8) 100%);
  border-color: rgba(255,255,255,0.1);
}

.stat-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  line-height: 1;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 0.125rem;
}

.fury-badge {
  animation: pulse-fury 1s infinite;
}

@keyframes pulse-fury {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.bottom-panel {
  margin-top: 1.5rem;
}

.event-timeline, .log-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.event-timeline::-webkit-scrollbar, .log-container::-webkit-scrollbar {
  width: 6px;
}

.event-timeline::-webkit-scrollbar-track, .log-container::-webkit-scrollbar-track {
  background: transparent;
}

.event-timeline::-webkit-scrollbar-thumb, .log-container::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .battle-arena {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stats-grid-game {
    grid-template-columns: 1fr;
  }
  
  .bottom-panel {
    grid-template-columns: 1fr;
  }
}

/* Animation für HP bars */
.hp-fill-game {
  animation: hp-fill 0.5s ease-out;
}

@keyframes hp-fill {
  from { width: 0%; }
}

/* Glowing effects für boss */
.border-yellow-500 {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}

.border-red-500 {
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
}

.border-blue-500 {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
}

/* NEU: Enrage und Fury Animationen */
.enrage-badge {
  border: 1px solid rgba(255,255,255,0.3);
}

.fury-badge {
  border: 1px solid rgba(255,255,255,0.3);
  animation: pulse-fury 1.5s infinite;
}

.combo-badge {
  border: 1px solid rgba(255,255,255,0.5);
  animation: danger-pulse 1s infinite;
}

@keyframes pulse-fury {
  0%, 100% { 
    opacity: 1; 
    box-shadow: 0 0 8px rgba(251, 146, 60, 0.6);
  }
  50% { 
    opacity: 0.8; 
    box-shadow: 0 0 15px rgba(251, 146, 60, 0.8);
  }
}

@keyframes danger-pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.8);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(239, 68, 68, 1);
  }
}

/* Enrage Level Color Coding */
.stat-value.text-red-400 {
  text-shadow: 0 0 4px rgba(239, 68, 68, 0.6);
}

.stat-value.text-orange-400 {
  text-shadow: 0 0 4px rgba(251, 146, 60, 0.6);
}

/* Boss Feature Badges Stacking */
.boss-features {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

/* Event Timeline Colors für Boss Events */
.event-item.bg-orange-600\/50 {
  border-left: 3px solid #ea580c;
}

.event-item.bg-red-600\/50 {
  border-left: 3px solid #dc2626;
}
</style>