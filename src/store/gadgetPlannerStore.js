import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';

export const useGadgetPlannerStore = defineStore('gadgetPlanner', () => {
  // Settings (persistent via localStorage with useStorage)
  const settings = useStorage('gadget-planner-settings', {
    selectedBuildId: '',
    tessarectsPerDay: 0,
    showMultipliers: true,
    autoUpdateTesseracts: true, // Auto-update tesseracts based on production
    // Tesseracts tracking with timestamp (auto-incrementing)
    currentTesseracts: {
      value: 0,
      timestamp: Date.now()
    }
  });

  // Gadget Levels (persistent via localStorage with useStorage)
  const currentLevels = useStorage('gadget-planner-current-levels', {});
  
  // Shopping List (persistent via localStorage with useStorage)
  const shoppingList = useStorage('gadget-planner-shopping-list', []);

  // Anchor of Ages Evaluations (not persistent - recalculated each session)
  const anchorEvaluations = ref({});
  const evaluatingAnchor = ref(false);
  const anchorEvaluationProgress = ref({});
  const anchorEvaluationEnabled = ref(false);

  // Cached evaluation results (not persistent)
  const cachedResults = ref({});

  // Computed Properties
  const hasAnyLevelChanges = computed(() => {
    return shoppingList.value.length > 0;
  });
  
  const totalShoppingCost = computed(() => {
    return shoppingList.value.reduce((total, item) => total + item.totalCost, 0);
  });

  // Tesseracts Management Functions
  /**
   * Update current tesseracts value
   * @param {number} newValue - The new tesseracts amount
   */
  function updateCurrentTesseracts(newValue) {
    settings.value.currentTesseracts = {
      value: Math.max(0, newValue),
      timestamp: Date.now()
    };
  }

  /**
   * Get current tesseracts including production since last update
   * @returns {number} Total tesseracts including elapsed production
   */
  function getCurrentTesseractsWithProduction() {
    // Ensure currentTesseracts is properly structured (backward compatibility)
    if (!settings.value.currentTesseracts || 
        typeof settings.value.currentTesseracts !== 'object' || 
        !settings.value.currentTesseracts.timestamp) {
      settings.value.currentTesseracts = {
        value: typeof settings.value.currentTesseracts === 'number' 
          ? settings.value.currentTesseracts 
          : 0,
        timestamp: Date.now()
      };
      return settings.value.currentTesseracts.value;
    }

    // If auto-update is disabled, return current value without production
    if (!settings.value.autoUpdateTesseracts) {
      return settings.value.currentTesseracts.value;
    }

    const now = Date.now();
    const elapsedMs = now - settings.value.currentTesseracts.timestamp;
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

    const dailyProduction = settings.value.tessarectsPerDay || 0;
    const producedTesseracts = elapsedDays * dailyProduction;

    const totalTesseracts = settings.value.currentTesseracts.value + producedTesseracts;

    return Math.max(0, totalTesseracts);
  }

  /**
   * Reset the tesseracts timestamp to now (used when page loads)
   * This recalculates the value including elapsed production and resets the timestamp
   */
  function resetTesseractsTimestamp() {
    if (!settings.value.currentTesseracts || 
        typeof settings.value.currentTesseracts !== 'object') {
      settings.value.currentTesseracts = {
        value: typeof settings.value.currentTesseracts === 'number' 
          ? settings.value.currentTesseracts 
          : 0,
        timestamp: Date.now()
      };
      return;
    }

    const currentCalculated = getCurrentTesseractsWithProduction();
    settings.value.currentTesseracts = {
      value: currentCalculated,
      timestamp: Date.now()
    };
  }

  /**
   * Reset tesseracts to zero
   */
  function resetTesseracts() {
    settings.value.currentTesseracts = {
      value: 0,
      timestamp: Date.now()
    };
  }

  // Build Settings Functions
  /**
   * Update selected build ID
   * @param {string} buildId - The Knox build ID
   */
  function updateSelectedBuild(buildId) {
    settings.value.selectedBuildId = buildId;
  }

  /**
   * Update daily tesseracts production rate
   * @param {number} rate - Tesseracts per day
   */
  function updateTesseractsPerDay(rate) {
    settings.value.tessarectsPerDay = Math.max(0, rate);
  }

  /**
   * Toggle multipliers display
   * @param {boolean} show - Whether to show multipliers
   */
  function updateShowMultipliers(show) {
    settings.value.showMultipliers = show;
  }



  // Level Management Functions
  /**
   * Update current level for a gadget
   * @param {string} gadgetId - The gadget identifier
   * @param {number} level - The current level
   */
  function updateCurrentLevel(gadgetId, level) {
    currentLevels.value[gadgetId] = Math.max(0, level);
  }

  // Shopping List Functions
  /**
   * Add gadget upgrade to shopping list
   * @param {Object} item - Shopping list item
   */
  function addToShoppingList(item) {
    const newItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      gadgetId: item.gadgetId,
      gadgetName: item.gadgetName,
      fromLevel: item.fromLevel,
      toLevel: item.toLevel,
      levels: item.toLevel - item.fromLevel,
      costPerLevel: item.costPerLevel || {},
      totalCost: item.totalCost,
      addedAt: Date.now(),
      evaluation: item.evaluation || null
    };
    
    shoppingList.value.push(newItem);
  }

  /**
   * Remove item from shopping list
   * @param {string} itemId - Item ID to remove
   */
  function removeFromShoppingList(itemId) {
    const index = shoppingList.value.findIndex(item => item.id === itemId);
    if (index !== -1) {
      shoppingList.value.splice(index, 1);
    }
  }

  /**
   * Mark item as purchased and update current level
   * @param {string} itemId - Item ID to mark as purchased
   */
  function markAsPurchased(itemId) {
    const item = shoppingList.value.find(i => i.id === itemId);
    if (item) {
      // Update current level to the target level
      updateCurrentLevel(item.gadgetId, item.toLevel);
      
      // Remove from shopping list
      removeFromShoppingList(itemId);
    }
  }

  /**
   * Clear entire shopping list
   */
  function clearShoppingList() {
    shoppingList.value = [];
  }

  /**
   * Update shopping list order (for drag & drop)
   * @param {Array} newOrder - New shopping list array
   */
  function updateShoppingListOrder(newOrder) {
    shoppingList.value = newOrder;
  }

  /**
   * Reset all gadget levels to zero
   */
  function resetAllLevels() {
    currentLevels.value = {};
    shoppingList.value = [];
    settings.value.tessarectsPerDay = 0;
    settings.value.selectedBuildId = '';
    resetTesseracts();
  }

  /**
   * Apply levels from a preset
   * @param {Object} preset - Preset data with currentLevels and targetLevels
   */
  function applyPreset(preset) {
    if (preset.currentLevels) {
      currentLevels.value = { ...preset.currentLevels };
    }
    if (preset.shoppingList) {
      shoppingList.value = [...preset.shoppingList];
    }
  }

  // Anchor of Ages Evaluation Functions
  /**
   * Store evaluation result for an Anchor of Ages level
   * @param {number} level - The anchor level
   * @param {Object} evaluation - Evaluation data
   */
  function storeAnchorEvaluation(level, evaluation) {
    anchorEvaluations.value[level] = evaluation;
  }

  /**
   * Clear all anchor evaluations
   */
  function clearAnchorEvaluations() {
    anchorEvaluations.value = {};
    anchorEvaluationProgress.value = {};
  }

  /**
   * Set anchor evaluation progress
   * @param {number} level - The anchor level
   * @param {string} status - Progress status
   */
  function setAnchorProgress(level, status) {
    anchorEvaluationProgress.value[level] = status;
  }

  /**
   * Set evaluating state
   * @param {boolean} isEvaluating - Whether currently evaluating
   */
  function setEvaluatingAnchor(isEvaluating) {
    evaluatingAnchor.value = isEvaluating;
  }

  /**
   * Toggle anchor evaluation feature
   * @param {boolean} enabled - Whether feature is enabled
   */
  function setAnchorEvaluationEnabled(enabled) {
    anchorEvaluationEnabled.value = enabled;
  }

  // Cache Management
  /**
   * Store cached evaluation result
   * @param {string} key - Cache key
   * @param {Object} result - Evaluation result
   */
  function storeCachedResult(key, result) {
    cachedResults.value[key] = result;
  }

  /**
   * Get cached evaluation result
   * @param {string} key - Cache key
   * @returns {Object|null} Cached result or null
   */
  function getCachedResult(key) {
    return cachedResults.value[key] || null;
  }

  /**
   * Clear all cached results
   */
  function clearCache() {
    cachedResults.value = {};
  }

  // Export/Import Functions
  /**
   * Export all data for backup/sync
   * @returns {Object} All store data
   */
  function exportData() {
    return {
      settings: settings.value,
      currentLevels: currentLevels.value,
      shoppingList: shoppingList.value,
      exportedAt: Date.now(),
      version: '2.0.0'
    };
  }

  /**
   * Import data from backup/sync
   * @param {Object} data - Imported data
   */
  function importData(data) {
    if (!data) return;

    // Import settings
    if (data.settings) {
      // Ensure currentTesseracts has proper structure
      if (data.settings.currentTesseracts) {
        if (typeof data.settings.currentTesseracts === 'number') {
          // Old format - convert to new format
          settings.value.currentTesseracts = {
            value: data.settings.currentTesseracts,
            timestamp: Date.now()
          };
        } else {
          settings.value.currentTesseracts = data.settings.currentTesseracts;
        }
      }

      // Import other settings
      if (data.settings.selectedBuildId !== undefined) {
        settings.value.selectedBuildId = data.settings.selectedBuildId;
      }
      if (data.settings.tessarectsPerDay !== undefined) {
        settings.value.tessarectsPerDay = data.settings.tessarectsPerDay;
      }
      if (data.settings.showMultipliers !== undefined) {
        settings.value.showMultipliers = data.settings.showMultipliers;
      }
    }

    // Import levels
    if (data.currentLevels) {
      currentLevels.value = data.currentLevels;
    }
    
    // Import shopping list (backward compatibility with targetLevels)
    if (data.shoppingList) {
      shoppingList.value = data.shoppingList;
    } else if (data.targetLevels) {
      // Convert old targetLevels to shopping list
      shoppingList.value = [];
      // Migration logic if needed
    }
  }

  /**
   * Reset all data to defaults
   */
  function resetToDefaults() {
    settings.value = {
      selectedBuildId: '',
      tessarectsPerDay: 0,
      showMultipliers: true,
      currentTesseracts: {
        value: 0,
        timestamp: Date.now()
      }
    };
    currentLevels.value = {};
    shoppingList.value = [];
    clearCache();
    clearAnchorEvaluations();
  }

  return {
    // State
    settings,
    currentLevels,
    shoppingList,
    anchorEvaluations,
    evaluatingAnchor,
    anchorEvaluationProgress,
    anchorEvaluationEnabled,
    cachedResults,

    // Computed
    hasAnyLevelChanges,
    totalShoppingCost,

    // Tesseracts Functions
    updateCurrentTesseracts,
    getCurrentTesseractsWithProduction,
    resetTesseractsTimestamp,
    resetTesseracts,

    // Build Settings
    updateSelectedBuild,
    updateTesseractsPerDay,
    updateShowMultipliers,

    // Level Management
    updateCurrentLevel,
    resetAllLevels,
    applyPreset,
    
    // Shopping List
    addToShoppingList,
    removeFromShoppingList,
    markAsPurchased,
    clearShoppingList,
    updateShoppingListOrder,

    // Anchor Evaluation
    storeAnchorEvaluation,
    clearAnchorEvaluations,
    setAnchorProgress,
    setEvaluatingAnchor,
    setAnchorEvaluationEnabled,

    // Cache
    storeCachedResult,
    getCachedResult,
    clearCache,

    // Export/Import
    exportData,
    importData,
    resetToDefaults
  };
});
