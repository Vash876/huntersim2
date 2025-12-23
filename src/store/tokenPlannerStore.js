import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useTokenPlannerStore = defineStore('tokenPlanner', () => {
  // Settings with localStorage persistence
  const meltdown = useStorage('tokenPlanner-meltdown', 0.8);
  const t1MaxLevel = useStorage('tokenPlanner-t1MaxLevel', 0);
  const t2MaxLevel = useStorage('tokenPlanner-t2MaxLevel', 0);
  const t3MaxLevel = useStorage('tokenPlanner-t3MaxLevel', 0);
  
  // UI Settings
  const showDetailedTables = useStorage('tokenPlanner-showDetailedTables', false);
  
  // Excluded upgrades (array of upgrade IDs that should not be included in calculations)
  const excludedUpgrades = useStorage('tokenPlanner-excludedUpgrades', []);

  // Toggle upgrade inclusion
  function toggleUpgrade(upgradeId) {
    const index = excludedUpgrades.value.indexOf(upgradeId);
    if (index === -1) {
      excludedUpgrades.value.push(upgradeId);
    } else {
      excludedUpgrades.value.splice(index, 1);
    }
  }
  
  // Check if upgrade is included
  function isUpgradeIncluded(upgradeId) {
    return !excludedUpgrades.value.includes(upgradeId);
  }

  // Reset function
  function resetSettings() {
    meltdown.value = 0;
    t1MaxLevel.value = 0;
    t2MaxLevel.value = 0;
    t3MaxLevel.value = 0;
    excludedUpgrades.value = [];
  }

  // Export data for backup
  function exportData() {
    return {
      meltdown: meltdown.value,
      t1MaxLevel: t1MaxLevel.value,
      t2MaxLevel: t2MaxLevel.value,
      t3MaxLevel: t3MaxLevel.value,
      showDetailedTables: showDetailedTables.value,
      excludedUpgrades: excludedUpgrades.value
    };
  }

  // Import data from backup
  function importData(data) {
    if (!data) return false;
    try {
      if (data.meltdown !== undefined) meltdown.value = data.meltdown;
      if (data.t1MaxLevel !== undefined) t1MaxLevel.value = data.t1MaxLevel;
      if (data.t2MaxLevel !== undefined) t2MaxLevel.value = data.t2MaxLevel;
      if (data.t3MaxLevel !== undefined) t3MaxLevel.value = data.t3MaxLevel;
      if (data.showDetailedTables !== undefined) showDetailedTables.value = data.showDetailedTables;
      if (data.excludedUpgrades !== undefined) excludedUpgrades.value = data.excludedUpgrades;
      return true;
    } catch (error) {
      console.error('Error importing Token Planner data:', error);
      return false;
    }
  }

  return {
    // State
    meltdown,
    t1MaxLevel,
    t2MaxLevel,
    t3MaxLevel,
    showDetailedTables,
    excludedUpgrades,
    
    // Actions
    resetSettings,
    toggleUpgrade,
    isUpgradeIncluded,
    exportData,
    importData
  };
});
