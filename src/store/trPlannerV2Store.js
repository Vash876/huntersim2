import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';

/**
 * TR Planner V2 Store
 * Clean implementation without legacy code
 */
export const useTRPlannerV2Store = defineStore('trPlannerV2', () => {
  // ============================================
  // STATE
  // ============================================

  /**
   * User's global boost values (maxed boosts)
   * These are the baseline values that apply to all plans
   */
  const globalBoosts = useStorage('trplanner_v2_global_boosts', {});

  /**
   * User's global gem configuration
   * Which gems are active and at what level
   */
  const globalGems = useStorage('trplanner_v2_global_gems', {
    // Format: { gemId: { level: number, nodes: boolean[], upgrades: {} } }
  });

  /**
   * All TR Plans
   */
  const plans = useStorage('trplanner_v2_plans', []);

  /**
   * Plan order (array of plan IDs)
   */
  const planOrder = useStorage('trplanner_v2_plan_order', []);

  /**
   * UI State (not persisted)
   */
  const ui = ref({
    showSidePanel: true,
    activeModal: null, // 'plan' | 'stats' | 'gems' | null
    editingPlanId: null,
    selectedPlanId: null,
  });

  // ============================================
  // GETTERS
  // ============================================

  /**
   * Plans sorted by user-defined order
   */
  const sortedPlans = computed(() => {
    if (planOrder.value.length === 0) {
      return plans.value;
    }
    
    const ordered = [];
    // Add plans in saved order
    planOrder.value.forEach(id => {
      const plan = plans.value.find(p => p.id === id);
      if (plan) ordered.push(plan);
    });
    // Add any new plans not in order yet
    plans.value.forEach(plan => {
      if (!planOrder.value.includes(plan.id)) {
        ordered.push(plan);
      }
    });
    return ordered;
  });

  /**
   * Get a plan by ID
   */
  const getPlanById = computed(() => (id) => {
    return plans.value.find(p => p.id === id);
  });

  /**
   * Total number of plans
   */
  const planCount = computed(() => plans.value.length);

  /**
   * Active gems (level > 0)
   */
  const activeGems = computed(() => {
    const active = {};
    Object.entries(globalGems.value).forEach(([gemId, gemData]) => {
      if (gemData && gemData.level > 0) {
        active[gemId] = gemData;
      }
    });
    return active;
  });

  // ============================================
  // ACTIONS - Plans
  // ============================================

  /**
   * Create a new plan
   */
  function createPlan(planData) {
    const newPlan = {
      id: generateId(),
      name: planData.name || 'New Plan',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // TR Configuration
      startDate: planData.startDate || new Date().toISOString().split('T')[0],
      startTime: planData.startTime || '12:00',
      
      // Starting values for this plan
      trCount: planData.trCount || 0,
      allTimeOrbs: planData.allTimeOrbs || 0,
      
      // TR Steps - each step is one TR
      steps: planData.steps || [{
        hoursInTR: 24,
        targetBoosts: {}, // { boostKey: targetValue }
        enabledGemBoosts: [], // Array of boost keys that are enabled for this step
      }],
      
      // Overrides for this plan (deviate from global settings)
      overrides: {
        gems: {}, // { gemId: { level, nodes, upgrades } } - overrides globalGems
        boosts: {}, // { boostKey: value } - overrides globalBoosts
      },
      
      // Plan metadata
      notes: planData.notes || '',
      isArchived: false,
    };

    plans.value.push(newPlan);
    planOrder.value.push(newPlan.id);
    
    return newPlan.id;
  }

  /**
   * Update an existing plan
   */
  function updatePlan(planId, updates) {
    const index = plans.value.findIndex(p => p.id === planId);
    if (index === -1) return false;

    plans.value[index] = {
      ...plans.value[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return true;
  }

  /**
   * Delete a plan
   */
  function deletePlan(planId) {
    const index = plans.value.findIndex(p => p.id === planId);
    if (index === -1) return false;

    plans.value.splice(index, 1);
    
    // Remove from order
    const orderIndex = planOrder.value.indexOf(planId);
    if (orderIndex !== -1) {
      planOrder.value.splice(orderIndex, 1);
    }
    
    return true;
  }

  /**
   * Duplicate a plan
   */
  function duplicatePlan(planId) {
    const original = plans.value.find(p => p.id === planId);
    if (!original) return null;

    const copy = JSON.parse(JSON.stringify(original));
    copy.id = generateId();
    copy.name = `${original.name} (Copy)`;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();

    plans.value.push(copy);
    planOrder.value.push(copy.id);
    
    return copy.id;
  }

  /**
   * Reorder plans
   */
  function reorderPlans(newOrder) {
    planOrder.value = newOrder;
  }

  // ============================================
  // ACTIONS - Steps
  // ============================================

  /**
   * Add a step to a plan
   */
  function addStep(planId, stepData = {}) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;

    const newStep = {
      hoursInTR: stepData.hoursInTR || 24,
      targetBoosts: stepData.targetBoosts || {},
      enabledGemBoosts: stepData.enabledGemBoosts || [],
    };

    plan.steps.push(newStep);
    plan.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Update a step
   */
  function updateStep(planId, stepIndex, updates) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan || !plan.steps[stepIndex]) return false;

    plan.steps[stepIndex] = {
      ...plan.steps[stepIndex],
      ...updates,
    };
    plan.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Remove a step
   */
  function removeStep(planId, stepIndex) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan || plan.steps.length <= 1) return false; // Keep at least 1 step

    plan.steps.splice(stepIndex, 1);
    plan.updatedAt = new Date().toISOString();
    return true;
  }

  // ============================================
  // ACTIONS - Global Settings
  // ============================================

  /**
   * Update global boost values
   */
  function updateGlobalBoosts(boosts) {
    globalBoosts.value = { ...globalBoosts.value, ...boosts };
  }

  /**
   * Set a single global boost
   */
  function setGlobalBoost(key, value) {
    globalBoosts.value[key] = value;
  }

  /**
   * Update global gem configuration
   */
  function updateGlobalGems(gems) {
    globalGems.value = { ...globalGems.value, ...gems };
  }

  /**
   * Set a single gem's configuration
   */
  function setGlobalGem(gemId, config) {
    globalGems.value[gemId] = config;
  }

  // ============================================
  // ACTIONS - Plan Overrides
  // ============================================

  /**
   * Set gem override for a plan
   */
  function setPlanGemOverride(planId, gemId, config) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;

    if (!plan.overrides.gems) plan.overrides.gems = {};
    plan.overrides.gems[gemId] = config;
    plan.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Remove gem override for a plan
   */
  function removePlanGemOverride(planId, gemId) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan || !plan.overrides.gems) return false;

    delete plan.overrides.gems[gemId];
    plan.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Set boost override for a plan
   */
  function setPlanBoostOverride(planId, boostKey, value) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;

    if (!plan.overrides.boosts) plan.overrides.boosts = {};
    plan.overrides.boosts[boostKey] = value;
    plan.updatedAt = new Date().toISOString();
    return true;
  }

  /**
   * Get effective gems for a plan (global + overrides)
   */
  function getEffectiveGems(planId) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return { ...globalGems.value };

    return {
      ...globalGems.value,
      ...plan.overrides?.gems,
    };
  }

  /**
   * Get effective boosts for a plan (global + overrides)
   */
  function getEffectiveBoosts(planId) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return { ...globalBoosts.value };

    return {
      ...globalBoosts.value,
      ...plan.overrides?.boosts,
    };
  }

  // ============================================
  // ACTIONS - UI
  // ============================================

  function openModal(modalName, planId = null) {
    ui.value.activeModal = modalName;
    if (planId) {
      ui.value.editingPlanId = planId;
    }
  }

  function closeModal() {
    ui.value.activeModal = null;
    ui.value.editingPlanId = null;
  }

  function selectPlan(planId) {
    ui.value.selectedPlanId = planId;
  }

  function toggleSidePanel() {
    ui.value.showSidePanel = !ui.value.showSidePanel;
  }

  // ============================================
  // ACTIONS - Import/Export
  // ============================================

  /**
   * Export all data for backup
   */
  function exportData() {
    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      globalBoosts: globalBoosts.value,
      globalGems: globalGems.value,
      plans: plans.value,
      planOrder: planOrder.value,
    };
  }

  /**
   * Import data from backup
   */
  function importData(data) {
    if (data.version !== 2) {
      console.warn('Importing data from different version:', data.version);
    }

    if (data.globalBoosts) {
      globalBoosts.value = data.globalBoosts;
    }
    if (data.globalGems) {
      globalGems.value = data.globalGems;
    }
    if (data.plans) {
      plans.value = data.plans;
    }
    if (data.planOrder) {
      planOrder.value = data.planOrder;
    }
  }

  /**
   * Export a single plan as shareable code
   */
  function exportPlan(planId) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return null;

    const exportData = {
      v: 2, // Version
      p: plan, // Plan data
      g: getEffectiveGems(planId), // Effective gems for context
    };

    // Encode to base58 (will be implemented in utils)
    return btoa(JSON.stringify(exportData));
  }

  /**
   * Import a plan from shareable code
   */
  function importPlan(code) {
    try {
      const data = JSON.parse(atob(code));
      
      if (data.v !== 2) {
        console.warn('Importing plan from different version:', data.v);
      }

      const plan = data.p;
      plan.id = generateId(); // New ID
      plan.name = `${plan.name} (Imported)`;
      plan.createdAt = new Date().toISOString();
      plan.updatedAt = new Date().toISOString();
      
      // Store the gem context as override
      if (data.g) {
        plan.overrides = plan.overrides || {};
        plan.overrides.gems = data.g;
      }

      plans.value.push(plan);
      planOrder.value.push(plan.id);

      return { success: true, planId: plan.id };
    } catch (error) {
      console.error('Failed to import plan:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  function generateId() {
    return `trp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    globalBoosts,
    globalGems,
    plans,
    planOrder,
    ui,

    // Getters
    sortedPlans,
    getPlanById,
    planCount,
    activeGems,

    // Actions - Plans
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    reorderPlans,

    // Actions - Steps
    addStep,
    updateStep,
    removeStep,

    // Actions - Global Settings
    updateGlobalBoosts,
    setGlobalBoost,
    updateGlobalGems,
    setGlobalGem,

    // Actions - Plan Overrides
    setPlanGemOverride,
    removePlanGemOverride,
    setPlanBoostOverride,
    getEffectiveGems,
    getEffectiveBoosts,

    // Actions - UI
    openModal,
    closeModal,
    selectPlan,
    toggleSidePanel,

    // Actions - Import/Export
    exportData,
    importData,
    exportPlan,
    importPlan,
  };
});
