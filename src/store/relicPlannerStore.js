import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';

export const useRelicPlannerStore = defineStore('relicPlanner', () => {
  const settings = useStorage('relic-planner-settings', {
    fragmentsPerDay: 0,
    currentFragments: { value: 0, timestamp: Date.now() },
    autoUpdateFragments: true,
  });

  const currentLevels = useStorage('relic-planner-current-levels', {});
  const shoppingList = useStorage('relic-planner-shopping-list', []);

  const totalShoppingCost = computed(() =>
    shoppingList.value.reduce((acc, i) => acc + (i.totalCost || 0), 0)
  );

  function updateCurrentFragments(v) {
    settings.value.currentFragments = { value: Math.max(0, v), timestamp: Date.now() };
  }

  function getCurrentFragmentsWithProduction() {
    const cf = settings.value.currentFragments;
    if (!cf || typeof cf !== 'object' || !cf.timestamp) {
      settings.value.currentFragments = { value: typeof cf === 'number' ? cf : 0, timestamp: Date.now() };
      return settings.value.currentFragments.value;
    }
    const elapsedDays = (Date.now() - cf.timestamp) / 86400000;
    const rate = settings.value.autoUpdateFragments !== false ? (settings.value.fragmentsPerDay || 0) : 0;
    return Math.max(0, cf.value + elapsedDays * rate);
  }

  function resetFragmentsTimestamp() {
    const current = getCurrentFragmentsWithProduction();
    settings.value.currentFragments = { value: current, timestamp: Date.now() };
  }

  function updateFragmentsPerDay(rate) {
    settings.value.fragmentsPerDay = Math.max(0, rate);
  }

  function updateCurrentLevel(relicId, level) {
    currentLevels.value[relicId] = Math.max(0, level);
  }

  function addToShoppingList(item) {
    shoppingList.value.push({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ...item,
      addedAt: Date.now(),
    });
  }

  function removeFromShoppingList(itemId) {
    const idx = shoppingList.value.findIndex(i => i.id === itemId);
    if (idx !== -1) shoppingList.value.splice(idx, 1);
  }

  function markAsPurchased(itemId) {
    const item = shoppingList.value.find(i => i.id === itemId);
    if (item) {
      updateCurrentLevel(item.relicId, item.toLevel);
      removeFromShoppingList(itemId);
    }
  }

  function clearShoppingList() {
    shoppingList.value = [];
  }

  function updateShoppingListOrder(newOrder) {
    shoppingList.value = newOrder;
  }

  function resetAll() {
    currentLevels.value = {};
    shoppingList.value = [];
    settings.value.fragmentsPerDay = 0;
    settings.value.currentFragments = { value: 0, timestamp: Date.now() };
  }

  function exportData() {
    return {
      settings: settings.value,
      currentLevels: currentLevels.value,
      shoppingList: shoppingList.value,
      exportedAt: Date.now(),
    };
  }

  function importData(data) {
    if (!data) return false;
    try {
      if (data.settings) {
        if (data.settings.fragmentsPerDay !== undefined)
          settings.value.fragmentsPerDay = data.settings.fragmentsPerDay;
        if (data.settings.currentFragments !== undefined)
          settings.value.currentFragments = data.settings.currentFragments;
        if (data.settings.autoUpdateFragments !== undefined)
          settings.value.autoUpdateFragments = data.settings.autoUpdateFragments;
      }
      if (data.currentLevels) currentLevels.value = data.currentLevels;
      if (data.shoppingList) shoppingList.value = data.shoppingList;
      return true;
    } catch (e) {
      console.error('Failed to import Relic Planner data:', e);
      return false;
    }
  }

  return {
    settings,
    currentLevels,
    shoppingList,
    totalShoppingCost,
    updateCurrentFragments,
    getCurrentFragmentsWithProduction,
    resetFragmentsTimestamp,
    updateFragmentsPerDay,
    updateCurrentLevel,
    addToShoppingList,
    removeFromShoppingList,
    markAsPurchased,
    clearShoppingList,
    updateShoppingListOrder,
    resetAll,
    exportData,
    importData,
  };
});
