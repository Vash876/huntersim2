import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getDefaultStatsValues } from '@/constants/gem-planner/stats.js';

// Helper function to generate unique IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Default weights configuration
const DEFAULT_WEIGHTS = {
  cells: 1.0,
  mp: 1.0,
  shards: 1.0,
  rp: 1.0,
  ap: 1.0,
  mats: 1.0,
  borge: 1.0,
  ozzy: 1.0,
  knox: 1.0
};

export const useGemPlannerStore = defineStore('gemPlanner', () => {
  // State
  const gameStats = ref(getDefaultStatsValues());
  const weights = ref({ ...DEFAULT_WEIGHTS });
  const gemStates = ref({});
  const currentStats = ref({
    availableOO: 0
  });
  const baseGemStates = ref({}); // Base stats that never get reset
  const isInitialized = ref(false);

  // Computed
  const totalOOSpent = computed(() => {
    let total = 0;
    Object.values(gemStates.value).forEach(gemState => {
      // Add gem level costs
      if (gemState.level > 0) {
        // Calculate total cost for current level (simplified)
        total += gemState.level * 1000; // Placeholder calculation
      }
      
      // Add upgrade costs
      Object.values(gemState.upgrades || {}).forEach(upgradeLevel => {
        if (upgradeLevel > 0) {
          total += upgradeLevel * 500; // Placeholder calculation
        }
      });
    });
    return total;
  });

  const hasAnyGemProgress = computed(() => {
    return Object.values(gemStates.value).some(gemState => 
      gemState.level > 0 || 
      Object.values(gemState.upgrades || {}).some(level => level > 0)
    );
  });

  // Methods
  function init() {
    if (isInitialized.value) return;
    
    console.log('Initializing Gem Planner Store...');
    loadFromStorage();
    isInitialized.value = true;
  }

  function loadFromStorage() {
    try {
      const storedData = localStorage.getItem('gemPlanner_store');
      if (storedData) {
        const data = JSON.parse(storedData);
        
        // Load game stats with defaults fallback
        gameStats.value = { ...getDefaultStatsValues(), ...(data.gameStats || {}) };
        
        // Load weights with defaults fallback
        weights.value = { ...DEFAULT_WEIGHTS, ...(data.weights || {}) };
        
        // Load gem states
        gemStates.value = data.gemStates || {};
        
        // Load current stats
        currentStats.value = { availableOO: 0, ...(data.currentStats || {}) };
        
        // Load base gem states (never reset)
        baseGemStates.value = data.baseGemStates || {};
        
        console.log('Gem Planner data loaded from storage');
      }
    } catch (error) {
      console.error('Error loading Gem Planner data from storage:', error);
      // Reset to defaults on error
      resetToDefaults();
    }
  }

  function saveToStorage() {
    try {
      const data = {
        gameStats: gameStats.value,
        weights: weights.value,
        gemStates: gemStates.value,
        currentStats: currentStats.value,
        baseGemStates: baseGemStates.value,
        lastSaved: new Date().toISOString()
      };
      
      localStorage.setItem('gemPlanner_store', JSON.stringify(data));
      console.log('Gem Planner data saved to storage');
    } catch (error) {
      console.error('Error saving Gem Planner data to storage:', error);
    }
  }

  // Game Stats Methods
  function updateGameStats(newStats) {
    gameStats.value = { ...gameStats.value, ...newStats };
    saveToStorage();
  }

  function updateGameStat(statId, value) {
    gameStats.value[statId] = value;
    saveToStorage();
  }

  function resetGameStats() {
    gameStats.value = getDefaultStatsValues();
    saveToStorage();
  }

  // Weights Methods
  function updateWeights(newWeights) {
    weights.value = { ...weights.value, ...newWeights };
    saveToStorage();
  }

  function updateWeight(weightId, value) {
    weights.value[weightId] = value;
    saveToStorage();
  }

  function resetWeights() {
    weights.value = { ...DEFAULT_WEIGHTS };
    saveToStorage();
  }

  // Gem State Methods
  function initializeGemState(gemId, maxLevel, upgrades = []) {
    if (!gemStates.value[gemId]) {
      gemStates.value[gemId] = {
        level: 0,
        nodes: [false, false, false],
        upgrades: {}
      };
      
      // Initialize all upgrades to level 0
      upgrades.forEach(upgrade => {
        gemStates.value[gemId].upgrades[upgrade.id] = 0;
      });
      
      saveToStorage();
    }
  }

  function updateGemLevel(gemId, level) {
    if (!gemStates.value[gemId]) return false;
    
    gemStates.value[gemId].level = level;
    saveToStorage();
    
    return true;
  }

  function updateGemNode(gemId, nodeIndex, active) {
    if (!gemStates.value[gemId]) return false;
    
    gemStates.value[gemId].nodes[nodeIndex] = active;
    saveToStorage();
    return true;
  }

  function toggleGemNode(gemId, nodeIndex) {
    if (!gemStates.value[gemId]) return false;
    
    gemStates.value[gemId].nodes[nodeIndex] = !gemStates.value[gemId].nodes[nodeIndex];
    saveToStorage();
    
    return gemStates.value[gemId].nodes[nodeIndex];
  }

  function updateUpgradeLevel(gemId, upgradeId, level) {
    if (!gemStates.value[gemId]) return false;
    
    gemStates.value[gemId].upgrades[upgradeId] = level;
    saveToStorage();
    
    return true;
  }

  // Current Stats Methods
  function updateCurrentStats(newStats) {
    currentStats.value = { ...currentStats.value, ...newStats };
    saveToStorage();
  }

  function updateAvailableOO(amount) {
    currentStats.value.availableOO = amount;
    saveToStorage();
  }

  // TR Plan Integration Functions (kept for backward compatibility)
  function setActiveTRPlan(trPlanData) {
    // This is now handled by gemPlanningStore, but kept for compatibility
    console.log('TR Plan integration moved to gemPlanningStore');
  }

  function getActiveTRPlan() {
    // This is now handled by gemPlanningStore, but kept for compatibility
    return null;
  }

  function clearActiveTRPlan() {
    // This is now handled by gemPlanningStore, but kept for compatibility
    console.log('TR Plan integration moved to gemPlanningStore');
  }

  // Base Gem States Functions (never reset)
  function updateBaseGemLevel(gemId, level) {
    if (!baseGemStates.value[gemId]) {
      baseGemStates.value[gemId] = { level: 0, upgrades: {}, nodes: {} };
    }
    
    // Base stats can only increase, never decrease
    if (level > baseGemStates.value[gemId].level) {
      baseGemStates.value[gemId].level = level;
      saveToStorage();
    }
  }

  function updateBaseUpgradeLevel(gemId, upgradeId, level) {
    if (!baseGemStates.value[gemId]) {
      baseGemStates.value[gemId] = { level: 0, upgrades: {}, nodes: {} };
    }
    
    const currentLevel = baseGemStates.value[gemId].upgrades[upgradeId] || 0;
    // Base stats can only increase, never decrease
    if (level > currentLevel) {
      baseGemStates.value[gemId].upgrades[upgradeId] = level;
      saveToStorage();
    }
  }

  function updateBaseGemNode(gemId, nodeIndex, hasNode) {
    if (!baseGemStates.value[gemId]) {
      baseGemStates.value[gemId] = { level: 0, upgrades: {}, nodes: {} };
    }
    
    // Base nodes can only be gained, never lost
    if (hasNode) {
      baseGemStates.value[gemId].nodes[nodeIndex] = true;
      saveToStorage();
    }
  }

  function getBaseGemState(gemId) {
    return baseGemStates.value[gemId] || { level: 0, upgrades: {}, nodes: {} };
  }

  // Utility Methods
  function resetToDefaults() {
    gameStats.value = getDefaultStatsValues();
    weights.value = { ...DEFAULT_WEIGHTS };
    gemStates.value = {};
    currentStats.value = { availableOO: 0 };
    saveToStorage();
  }

  function resetGemStates() {
    gemStates.value = {};
    saveToStorage();
  }

  function getGemState(gemId) {
    return gemStates.value[gemId] || null;
  }

  function hasGemState(gemId) {
    return !!gemStates.value[gemId];
  }

  // Export/Import Methods (only for current gem data)
  function exportData() {
    return {
      gameStats: gameStats.value,
      weights: weights.value,
      gemStates: gemStates.value,
      currentStats: currentStats.value,
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
  }

  function importData(data) {
    try {
      if (data.gameStats) gameStats.value = { ...getDefaultStatsValues(), ...data.gameStats };
      if (data.weights) weights.value = { ...DEFAULT_WEIGHTS, ...data.weights };
      if (data.gemStates) gemStates.value = data.gemStates;
      if (data.currentStats) currentStats.value = { availableOO: 0, ...data.currentStats };
      
      saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing Gem Planner data:', error);
      return false;
    }
  }
  function resetToDefaults() {
    gameStats.value = getDefaultStatsValues();
    weights.value = { ...DEFAULT_WEIGHTS };
    gemStates.value = {};
    currentStats.value = { availableOO: 0 };
    saveToStorage();
  }

  function resetGemStates() {
    gemStates.value = {};
    saveToStorage();
  }

  function getGemState(gemId) {
    return gemStates.value[gemId] || null;
  }

  function hasGemState(gemId) {
    return !!gemStates.value[gemId];
  }

  // Export/Import Methods
  function exportData() {
    return {
      gameStats: gameStats.value,
      weights: weights.value,
      gemStates: gemStates.value,
      currentStats: currentStats.value,
      gemPlans: gemPlans.value,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  }

  function importData(data) {
    try {
      if (data.gameStats) gameStats.value = { ...getDefaultStatsValues(), ...data.gameStats };
      if (data.weights) weights.value = { ...DEFAULT_WEIGHTS, ...data.weights };
      if (data.gemStates) gemStates.value = data.gemStates;
      if (data.currentStats) currentStats.value = { availableOO: 0, ...data.currentStats };
      if (data.gemPlans) gemPlans.value = data.gemPlans;
      
      saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing Gem Planner data:', error);
      return false;
    }
  }

  // Return store interface
  return {
    // State
    gameStats,
    weights,
    gemStates,
    currentStats,
    baseGemStates,
    isInitialized,

    // Computed
    totalOOSpent,
    hasAnyGemProgress,

    // Methods
    init,
    saveToStorage,
    loadFromStorage,

    // Game Stats
    updateGameStats,
    updateGameStat,
    resetGameStats,

    // Weights
    updateWeights,
    updateWeight,
    resetWeights,

    // Gem States
    initializeGemState,
    updateGemLevel,
    updateGemNode,
    toggleGemNode,
    updateUpgradeLevel,

    // Base Gem States (never reset)
    updateBaseGemLevel,
    updateBaseUpgradeLevel,
    updateBaseGemNode,
    getBaseGemState,

    // Current Stats
    updateCurrentStats,
    updateAvailableOO,

    // TR Plan Integration (for backward compatibility)
    setActiveTRPlan,
    getActiveTRPlan,
    clearActiveTRPlan,

    // Utilities
    resetToDefaults,
    resetGemStates,
    getGemState,
    hasGemState,

    // Export/Import
    exportData,
    importData
  };
});
