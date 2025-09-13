import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getDefaultStatsValues } from '@/constants/gem-planner/stats.js';

// Helper function to generate unique IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Default weights configuration
const DEFAULT_WEIGHTS = {
  cells: 1,
  mp: 20,
  shards: 15,
  rp: 10,
  ap: 12,
  mats: 100,
  orbs: 10000,
  borge: 10000,
  ozzy: 1000,
  knox: 10000,
  meltdown: 0.500
};

export const useGemPlannerStore = defineStore('gemPlanner', () => {
  // State
  const gameStats = ref(getDefaultStatsValues());
  const weights = ref({ ...DEFAULT_WEIGHTS });
  const gemStates = ref({});
  const currentStats = ref({
    availableOO: 0
  });
  const gemPlans = ref([]); // For saving/loading different plans
  const orbSpendingPlans = ref([]); // For saving/loading orb spending plans
  const activeOrbSpendingPlan = ref(null);
  const baseGemStates = ref({}); // Base stats that never get reset
  const isInitialized = ref(false);
  const activeTRPlanData = ref(null); // For TR Planner integration data

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
        
        // Load weights with defaults fallback - ensure all default weights are present
        weights.value = { ...DEFAULT_WEIGHTS, ...(data.weights || {}) };
        
        // Load gem states
        gemStates.value = data.gemStates || {};
        
        // Load current stats
        currentStats.value = { availableOO: 0, ...(data.currentStats || {}) };
        
        // Load saved plans
        gemPlans.value = data.gemPlans || [];
        
        // Load orb spending plans
        orbSpendingPlans.value = data.orbSpendingPlans || [];
        
        // Load active orb spending plan
        if (data.activeOrbSpendingPlan) {
          activeOrbSpendingPlan.value = data.activeOrbSpendingPlan;
        }
        
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
        gemPlans: gemPlans.value,
        orbSpendingPlans: orbSpendingPlans.value,
        activeOrbSpendingPlan: activeOrbSpendingPlan.value,
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

  // TR Plan Integration Functions
  function setActiveTRPlan(trPlanData) {
    activeTRPlanData.value = {
      plan: trPlanData.plan,
      trIndex: trPlanData.trIndex || 0,
      timestamp: Date.now()
    };
    console.log('TR Plan data set in gem planner store:', activeTRPlanData.value);
  }

  function getActiveTRPlan() {
    return activeTRPlanData.value;
  }

  function clearActiveTRPlan() {
    activeTRPlanData.value = null;
  }

  // Orb Spending Plans Functions
  function createOrbSpendingPlan(name, trPlanId = null, initialBudget = 0, trCount = 1) {
    const plan = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trPlanId, // Associated TR plan (optional)
      trCount, // Number of TRs in this plan
      initialBudget, // Starting budget
      trSteps: [] // Array of TR steps with gem states
    };
    
    // Initialize TR steps
    for (let i = 0; i < trCount; i++) {
      plan.trSteps.push({
        trIndex: i,
        budget: initialBudget,
        spentOrbs: 0,
        gemStates: {}, // Gem states for this TR
        orbSpending: {} // Spending tracking for this TR
      });
    }
    
    orbSpendingPlans.value.push(plan);
    saveToStorage();
    return plan;
  }

  function updateOrbSpendingPlan(planId, updates) {
    const planIndex = orbSpendingPlans.value.findIndex(p => p.id === planId);
    if (planIndex !== -1) {
      orbSpendingPlans.value[planIndex] = {
        ...orbSpendingPlans.value[planIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      saveToStorage();
      return orbSpendingPlans.value[planIndex];
    }
    return null;
  }

  function deleteOrbSpendingPlan(planId) {
    const index = orbSpendingPlans.value.findIndex(p => p.id === planId);
    if (index !== -1) {
      orbSpendingPlans.value.splice(index, 1);
      if (activeOrbSpendingPlan.value?.id === planId) {
        activeOrbSpendingPlan.value = null;
      }
      saveToStorage();
      return true;
    }
    return false;
  }

  function loadOrbSpendingPlan(planId) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (plan) {
      activeOrbSpendingPlan.value = plan;
      saveToStorage();
      return plan;
    }
    return null;
  }

  function duplicateOrbSpendingPlan(planId) {
    const originalPlan = orbSpendingPlans.value.find(p => p.id === planId);
    if (originalPlan) {
      const newPlan = {
        ...JSON.parse(JSON.stringify(originalPlan)),
        id: generateId(),
        name: `${originalPlan.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      orbSpendingPlans.value.push(newPlan);
      saveToStorage();
      return newPlan;
    }
    return null;
  }

  function getOrbSpendingPlanById(planId) {
    return orbSpendingPlans.value.find(p => p.id === planId) || null;
  }

  // Plan-specific Gem Functions
  function initializePlanGemState(planId, trIndex, gemId, maxLevel, upgrades) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return false;
    
    if (!plan.trSteps[trIndex].gemStates[gemId]) {
      plan.trSteps[trIndex].gemStates[gemId] = {
        level: 0,
        upgrades: {},
        nodes: [false, false, false] // Initialize as array like global gem states
      };
      
      // Initialize upgrade levels
      if (upgrades && Array.isArray(upgrades)) {
        upgrades.forEach(upgrade => {
          plan.trSteps[trIndex].gemStates[gemId].upgrades[upgrade.id] = 0;
        });
      }
    }
    
    saveToStorage();
    return true;
  }

  function getPlanGemState(planId, trIndex, gemId) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return null;
    
    return plan.trSteps[trIndex].gemStates[gemId] || null;
  }

  function updatePlanGemLevel(planId, trIndex, gemId, level) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return false;
    
    // Auto-initialize if gem state doesn't exist
    if (!plan.trSteps[trIndex].gemStates[gemId]) {
      plan.trSteps[trIndex].gemStates[gemId] = {
        level: 0,
        upgrades: {},
        nodes: [false, false, false]
      };
    }
    
    plan.trSteps[trIndex].gemStates[gemId].level = level;
    plan.updatedAt = new Date().toISOString();
    saveToStorage();
    
    return true;
  }

  function updatePlanUpgradeLevel(planId, trIndex, gemId, upgradeId, level) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return false;
    
    // Auto-initialize if gem state doesn't exist
    if (!plan.trSteps[trIndex].gemStates[gemId]) {
      plan.trSteps[trIndex].gemStates[gemId] = {
        level: 0,
        upgrades: {},
        nodes: [false, false, false]
      };
    }
    
    plan.trSteps[trIndex].gemStates[gemId].upgrades[upgradeId] = level;
    plan.updatedAt = new Date().toISOString();
    saveToStorage();
    
    return true;
  }

  function togglePlanGemNode(planId, trIndex, gemId, nodeIndex) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return false;
    
    // Auto-initialize if gem state doesn't exist
    if (!plan.trSteps[trIndex].gemStates[gemId]) {
      plan.trSteps[trIndex].gemStates[gemId] = {
        level: 0,
        upgrades: {},
        nodes: [false, false, false]
      };
    }
    
    plan.trSteps[trIndex].gemStates[gemId].nodes[nodeIndex] = !plan.trSteps[trIndex].gemStates[gemId].nodes[nodeIndex];
    plan.updatedAt = new Date().toISOString();
    saveToStorage();
    
    return plan.trSteps[trIndex].gemStates[gemId].nodes[nodeIndex];
  }

  function updatePlanOrbSpending(planId, trIndex, gemId, upgradeId, cost) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return false;
    
    if (!plan.trSteps[trIndex].orbSpending) {
      plan.trSteps[trIndex].orbSpending = {};
    }
    if (!plan.trSteps[trIndex].orbSpending[gemId]) {
      plan.trSteps[trIndex].orbSpending[gemId] = {};
    }
    if (!plan.trSteps[trIndex].orbSpending[gemId][upgradeId]) {
      plan.trSteps[trIndex].orbSpending[gemId][upgradeId] = 0;
    }
    
    plan.trSteps[trIndex].orbSpending[gemId][upgradeId] += cost;
    
    // Ensure spending can't go below 0 (for refunds)
    plan.trSteps[trIndex].orbSpending[gemId][upgradeId] = Math.max(0, 
      plan.trSteps[trIndex].orbSpending[gemId][upgradeId]);
    
    // Update spent orbs for this TR
    let totalSpent = 0;
    Object.values(plan.trSteps[trIndex].orbSpending).forEach(gemSpending => {
      Object.values(gemSpending).forEach(upgradeSpent => {
        totalSpent += Math.max(0, upgradeSpent); // Ensure no negative values
      });
    });
    plan.trSteps[trIndex].spentOrbs = totalSpent;
    
    plan.updatedAt = new Date().toISOString();
    saveToStorage();
    
    return true;
  }

  function clearPlanTRSpending(planId, trIndex) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return false;
    
    plan.trSteps[trIndex].orbSpending = {};
    plan.trSteps[trIndex].spentOrbs = 0;
    plan.updatedAt = new Date().toISOString();
    saveToStorage();
    
    return true;
  }

  function calculatePlanSpentOrbs(planId, trIndex) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex] || !plan.trSteps[trIndex].orbSpending) return 0;
    
    let total = 0;
    Object.values(plan.trSteps[trIndex].orbSpending).forEach(gemSpending => {
      Object.values(gemSpending).forEach(upgradeSpent => {
        total += Math.max(0, upgradeSpent); // Ensure no negative values
      });
    });
    
    return total;
  }

  function updateOrbSpendingPlanTRStep(planId, trIndex, updates) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (plan && plan.trSteps[trIndex]) {
      plan.trSteps[trIndex] = {
        ...plan.trSteps[trIndex],
        ...updates
      };
      plan.updatedAt = new Date().toISOString();
      saveToStorage();
      return plan.trSteps[trIndex];
    }
    return null;
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

  // Gem Plans Methods (for save/load functionality)
  function createGemPlan(planData) {
    const newPlan = {
      id: generateId(),
      name: planData.name || `Plan ${gemPlans.value.length + 1}`,
      description: planData.description || '',
      gameStats: { ...gameStats.value },
      weights: { ...weights.value },
      gemStates: JSON.parse(JSON.stringify(gemStates.value)), // Deep copy
      currentStats: { ...currentStats.value },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    gemPlans.value.push(newPlan);
    saveToStorage();
    return newPlan;
  }

  function updateGemPlan(planId, planData) {
    const planIndex = gemPlans.value.findIndex(plan => plan.id === planId);
    if (planIndex === -1) return false;

    gemPlans.value[planIndex] = {
      ...gemPlans.value[planIndex],
      ...planData,
      updatedAt: new Date().toISOString()
    };

    saveToStorage();
    return true;
  }

  function deleteGemPlan(planId) {
    const planIndex = gemPlans.value.findIndex(plan => plan.id === planId);
    if (planIndex === -1) return false;

    gemPlans.value.splice(planIndex, 1);
    saveToStorage();
    return true;
  }

  function loadGemPlan(planId) {
    const plan = gemPlans.value.find(plan => plan.id === planId);
    if (!plan) return false;

    gameStats.value = { ...plan.gameStats };
    weights.value = { ...plan.weights };
    gemStates.value = JSON.parse(JSON.stringify(plan.gemStates)); // Deep copy
    currentStats.value = { ...plan.currentStats };

    saveToStorage();
    return true;
  }

  function duplicateGemPlan(planId) {
    const plan = gemPlans.value.find(plan => plan.id === planId);
    if (!plan) return false;

    const duplicatedPlan = {
      ...plan,
      id: generateId(),
      name: `${plan.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    gemPlans.value.push(duplicatedPlan);
    saveToStorage();
    return duplicatedPlan;
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
    gemPlans,
    orbSpendingPlans,
    activeOrbSpendingPlan,
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

    // Plan-specific Gem Functions
    initializePlanGemState,
    getPlanGemState,
    updatePlanGemLevel,
    updatePlanUpgradeLevel,
    togglePlanGemNode,
    updatePlanOrbSpending,
    clearPlanTRSpending,
    calculatePlanSpentOrbs,

    // Base Gem States (never reset)
    updateBaseGemLevel,
    updateBaseUpgradeLevel,
    updateBaseGemNode,
    getBaseGemState,

    // Current Stats
    updateCurrentStats,
    updateAvailableOO,

    // TR Plan Integration
    setActiveTRPlan,
    getActiveTRPlan,
    clearActiveTRPlan,

    // Gem Plans
    createGemPlan,
    updateGemPlan,
    deleteGemPlan,
    loadGemPlan,
    duplicateGemPlan,

    // Orb Spending Plans
    createOrbSpendingPlan,
    updateOrbSpendingPlan,
    deleteOrbSpendingPlan,
    loadOrbSpendingPlan,
    duplicateOrbSpendingPlan,
    getOrbSpendingPlanById,
    updateOrbSpendingPlanTRStep,

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
