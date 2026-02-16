import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

/**
 * Store for the Miscellaneous tools page.
 * Manages widget visibility, order, and per-widget persistent state.
 */
export const useMiscStore = defineStore('miscellaneous', () => {
  // --- Widget registry ---
  // Each widget: { id, label, icon }
  // Defined in the main view, not here — store only tracks order + visibility.

  // Persistent widget order (array of widget IDs)
  const widgetOrder = useStorage('misc_widgetOrder', []);

  // Persistent widget visibility (object: { widgetId: boolean })
  const widgetVisibility = useStorage('misc_widgetVisibility', {});

  // --- Per-widget persistent inputs ---
  const widgetInputs = useStorage('misc_widgetInputs', {});

  /**
   * Ensure all registered widget IDs are present in order/visibility.
   * Called once on mount with the full list of available widget IDs.
   */
  function initWidgets(allIds) {
    // Add any new widgets not yet in the order
    for (const id of allIds) {
      if (!widgetOrder.value.includes(id)) {
        widgetOrder.value.push(id);
      }
      // Default: visible
      if (widgetVisibility.value[id] === undefined) {
        widgetVisibility.value[id] = true;
      }
    }
    // Remove stale IDs no longer in registry
    widgetOrder.value = widgetOrder.value.filter(id => allIds.includes(id));
  }

  function setOrder(newOrder) {
    widgetOrder.value = [...newOrder];
  }

  function toggleVisibility(id) {
    widgetVisibility.value[id] = !widgetVisibility.value[id];
  }

  function setVisibility(id, visible) {
    widgetVisibility.value[id] = visible;
  }

  function isVisible(id) {
    return widgetVisibility.value[id] !== false;
  }

  // Per-widget input persistence helpers
  function getInputs(widgetId) {
    return widgetInputs.value[widgetId] || {};
  }

  function saveInputs(widgetId, inputs) {
    widgetInputs.value[widgetId] = { ...inputs };
  }

  /**
   * Export all misc store data for backup
   */
  function exportData() {
    return {
      widgetOrder: [...widgetOrder.value],
      widgetVisibility: { ...widgetVisibility.value },
      widgetInputs: JSON.parse(JSON.stringify(widgetInputs.value)),
    };
  }

  /**
   * Import misc store data from backup
   * @param {Object} data - Imported data
   * @returns {boolean} success
   */
  function importData(data) {
    if (!data) return false;
    try {
      if (Array.isArray(data.widgetOrder)) {
        widgetOrder.value = [...data.widgetOrder];
      }
      if (data.widgetVisibility && typeof data.widgetVisibility === 'object') {
        Object.assign(widgetVisibility.value, data.widgetVisibility);
      }
      if (data.widgetInputs && typeof data.widgetInputs === 'object') {
        Object.assign(widgetInputs.value, JSON.parse(JSON.stringify(data.widgetInputs)));
      }
      return true;
    } catch (e) {
      console.error('Failed to import miscellaneous store data:', e);
      return false;
    }
  }

  return {
    widgetOrder,
    widgetVisibility,
    widgetInputs,
    initWidgets,
    setOrder,
    toggleVisibility,
    setVisibility,
    isVisible,
    getInputs,
    saveInputs,
    exportData,
    importData,
  };
});
