import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';

/**
 * TR Planner Store (New Version)
 * 
 * Clean store for TR Planner with:
 * - User modifiers (global settings)
 * - Plans (saved configurations)
 * - UI state
 */
export const useTRPlannerStore = defineStore('trPlannerNew', () => {
  // ==========================================
  // STATE: User Modifiers (Global Settings)
  // ==========================================
  
  const modifiers = useStorage('trplanner_modifiers', {
    // Current boost values - keyed by boost ID
    boosts: {},
    
    // Target boost values - for planning
    targetBoosts: {},
    
    // Research levels
    researches: {},
    
    // Loop Mods
    loopMods: {
      count: 0
    },
    
    // Global settings
    settings: {
      trCount: 0,
      allTimeOrbs: 0,
      defaultHours: 1
    }
  });
  
  // ==========================================
  // STATE: Target Steps (Direct without plans)
  // ==========================================
  
  const steps = useStorage('trplanner_steps', []);
  
  // ==========================================
  // STATE: Plans
  // ==========================================
  
  const plans = useStorage('trplanner_plans', []);
  
  // Currently selected plan ID
  const selectedPlanId = ref(null);
  
  // ==========================================
  // STATE: UI
  // ==========================================
  
  const ui = ref({
    activeTab: 'gems',
    isEditing: false,
    showGemOverrideModal: false
  });
  
  // ==========================================
  // GETTERS
  // ==========================================
  
  const selectedPlan = computed(() => {
    if (!selectedPlanId.value) return null;
    return plans.value.find(p => p.id === selectedPlanId.value) || null;
  });
  
  const planNames = computed(() => {
    return plans.value.map(p => ({ id: p.id, name: p.name }));
  });
  
  const hasPlan = computed(() => plans.value.length > 0);
  
  // ==========================================
  // ACTIONS: Modifiers
  // ==========================================
  
  function setBoostValue(boostKey, value) {
    modifiers.value.boosts[boostKey] = value;
  }
  
  function getBoostValue(boostKey) {
    return modifiers.value.boosts[boostKey] ?? 0;
  }
  
  function setTargetBoostValue(boostKey, value) {
    if (!modifiers.value.targetBoosts) {
      modifiers.value.targetBoosts = {};
    }
    modifiers.value.targetBoosts[boostKey] = value;
  }
  
  function getTargetBoostValue(boostKey) {
    return modifiers.value.targetBoosts?.[boostKey] ?? getBoostValue(boostKey);
  }
  
  function setResearchLevel(researchKey, level) {
    modifiers.value.researches[researchKey] = level;
  }
  
  function getResearchLevel(researchKey) {
    return modifiers.value.researches[researchKey] ?? 0;
  }
  
  function setLoopModCount(count) {
    modifiers.value.loopMods.count = Math.max(0, count);
  }
  
  function setTRCount(count) {
    modifiers.value.settings.trCount = Math.max(0, count);
  }
  
  function setAllTimeOrbs(orbs) {
    modifiers.value.settings.allTimeOrbs = Math.max(0, orbs);
  }
  
  function setDefaultHoursInTR(hours) {
    modifiers.value.settings.defaultHours = Math.max(0.1, hours);
  }
  
  function updateSetting(key, value) {
    if (key in modifiers.value.settings) {
      modifiers.value.settings[key] = value;
    }
  }
  
  function resetToDefaults() {
    modifiers.value.boosts = {};
    modifiers.value.targetBoosts = {};
    modifiers.value.settings.trCount = 0;
    modifiers.value.settings.allTimeOrbs = 0;
    modifiers.value.settings.defaultHours = 1;
  }
  
  // ==========================================
  // ACTIONS: Direct Steps (without plans)
  // ==========================================
  
  function addStep(stepData) {
    steps.value.push(stepData);
  }
  
  function updateStepBoost(stepId, boostKey, value) {
    const step = steps.value.find(s => s.id === stepId);
    if (step) {
      if (!step.boostOverrides) step.boostOverrides = {};
      step.boostOverrides[boostKey] = value;
    }
  }
  
  function removeStepBoost(stepId, boostKey) {
    const step = steps.value.find(s => s.id === stepId);
    if (step && step.boostOverrides) {
      delete step.boostOverrides[boostKey];
    }
  }
  
  function updateStepGemOverrides(stepId, overrides) {
    const step = steps.value.find(s => s.id === stepId);
    if (step) {
      step.gemOverrides = overrides;
    }
  }
  
  function removeStep(stepId) {
    const index = steps.value.findIndex(s => s.id === stepId);
    if (index >= 0) {
      steps.value.splice(index, 1);
    }
  }
  
  // ==========================================
  // ACTIONS: Plans
  // ==========================================
  
  function createPlan(name) {
    const now = new Date().toISOString();
    const newPlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name || `Plan ${plans.value.length + 1}`,
      createdAt: now,
      updatedAt: now,
      
      // Plan settings (can override global)
      settings: {
        hoursInTR: modifiers.value.settings.defaultHoursInTR
      },
      
      // TR Steps
      steps: [],
      
      // Overrides (plan-specific changes to gems/boosts)
      overrides: {
        gems: {},      // gemId -> level
        boosts: {}     // boostKey -> value
      },
      
      // Results (cached calculation results)
      results: {
        orbMultiplier: 1,
        fragMultiplier: 1,
        totalOrbs: 0
      }
    };
    
    plans.value.push(newPlan);
    selectedPlanId.value = newPlan.id;
    
    return newPlan;
  }
  
  function updatePlan(planId, updates) {
    const index = plans.value.findIndex(p => p.id === planId);
    if (index === -1) return false;
    
    plans.value[index] = {
      ...plans.value[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return true;
  }
  
  function deletePlan(planId) {
    const index = plans.value.findIndex(p => p.id === planId);
    if (index === -1) return false;
    
    plans.value.splice(index, 1);
    
    // Clear selection if deleted plan was selected
    if (selectedPlanId.value === planId) {
      selectedPlanId.value = plans.value.length > 0 ? plans.value[0].id : null;
    }
    
    return true;
  }
  
  function duplicatePlan(planId) {
    const original = plans.value.find(p => p.id === planId);
    if (!original) return null;
    
    const now = new Date().toISOString();
    const newPlan = {
      ...JSON.parse(JSON.stringify(original)),
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now
    };
    
    plans.value.push(newPlan);
    selectedPlanId.value = newPlan.id;
    
    return newPlan;
  }
  
  function renamePlan(planId, newName) {
    return updatePlan(planId, { name: newName });
  }
  
  function selectPlan(planId) {
    if (plans.value.some(p => p.id === planId)) {
      selectedPlanId.value = planId;
      return true;
    }
    return false;
  }
  
  // ==========================================
  // ACTIONS: Plan Steps
  // ==========================================
  
  function addStep(planId, stepData = {}) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return null;
    
    const newStep = {
      id: `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      hoursInTR: stepData.hoursInTR || plan.settings.hoursInTR,
      targetBoosts: stepData.targetBoosts || [],
      notes: stepData.notes || '',
      order: plan.steps.length
    };
    
    plan.steps.push(newStep);
    plan.updatedAt = new Date().toISOString();
    
    return newStep;
  }
  
  function updateStep(planId, stepId, updates) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;
    
    const stepIndex = plan.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return false;
    
    plan.steps[stepIndex] = {
      ...plan.steps[stepIndex],
      ...updates
    };
    plan.updatedAt = new Date().toISOString();
    
    return true;
  }
  
  function deleteStep(planId, stepId) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;
    
    const stepIndex = plan.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return false;
    
    plan.steps.splice(stepIndex, 1);
    
    // Re-order remaining steps
    plan.steps.forEach((step, idx) => {
      step.order = idx;
    });
    
    plan.updatedAt = new Date().toISOString();
    
    return true;
  }
  
  function reorderSteps(planId, fromIndex, toIndex) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;
    
    const [movedStep] = plan.steps.splice(fromIndex, 1);
    plan.steps.splice(toIndex, 0, movedStep);
    
    // Update order indices
    plan.steps.forEach((step, idx) => {
      step.order = idx;
    });
    
    plan.updatedAt = new Date().toISOString();
    
    return true;
  }
  
  // ==========================================
  // ACTIONS: Overrides
  // ==========================================
  
  function setGemOverride(planId, gemId, level) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;
    
    if (level === null || level === undefined) {
      delete plan.overrides.gems[gemId];
    } else {
      plan.overrides.gems[gemId] = level;
    }
    
    plan.updatedAt = new Date().toISOString();
    return true;
  }
  
  function setBoostOverride(planId, boostKey, value) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;
    
    if (value === null || value === undefined) {
      delete plan.overrides.boosts[boostKey];
    } else {
      plan.overrides.boosts[boostKey] = value;
    }
    
    plan.updatedAt = new Date().toISOString();
    return true;
  }
  
  function clearOverrides(planId) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;
    
    plan.overrides = { gems: {}, boosts: {} };
    plan.updatedAt = new Date().toISOString();
    
    return true;
  }
  
  // ==========================================
  // ACTIONS: Results
  // ==========================================
  
  function updatePlanResults(planId, results) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return false;
    
    plan.results = {
      ...plan.results,
      ...results
    };
    
    return true;
  }
  
  // ==========================================
  // ACTIONS: UI
  // ==========================================
  
  function setActiveTab(tabId) {
    ui.value.activeTab = tabId;
  }
  
  function setEditing(isEditing) {
    ui.value.isEditing = isEditing;
  }
  
  function toggleGemOverrideModal(show) {
    ui.value.showGemOverrideModal = show ?? !ui.value.showGemOverrideModal;
  }
  
  // ==========================================
  // ACTIONS: Import/Export
  // ==========================================
  
  function exportPlan(planId) {
    const plan = plans.value.find(p => p.id === planId);
    if (!plan) return null;
    
    // Create export data with current modifiers
    const exportData = {
      version: 1,
      plan: JSON.parse(JSON.stringify(plan)),
      modifiers: JSON.parse(JSON.stringify(modifiers.value))
    };
    
    // TODO: Encode to Base58 or similar
    return JSON.stringify(exportData);
  }
  
  function importPlan(importString) {
    try {
      // TODO: Decode from Base58
      const importData = JSON.parse(importString);
      
      if (!importData.plan) {
        throw new Error('Invalid import data');
      }
      
      const now = new Date().toISOString();
      const newPlan = {
        ...importData.plan,
        id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${importData.plan.name} (Imported)`,
        createdAt: now,
        updatedAt: now
      };
      
      plans.value.push(newPlan);
      selectedPlanId.value = newPlan.id;
      
      return newPlan;
    } catch (error) {
      console.error('Failed to import plan:', error);
      return null;
    }
  }
  
  function exportAllData() {
    return JSON.stringify({
      version: 1,
      modifiers: modifiers.value,
      plans: plans.value
    });
  }
  
  function importAllData(importString) {
    try {
      const data = JSON.parse(importString);
      
      if (data.modifiers) {
        modifiers.value = data.modifiers;
      }
      
      if (data.plans) {
        plans.value = data.plans;
        selectedPlanId.value = data.plans.length > 0 ? data.plans[0].id : null;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
  
  // ==========================================
  // ACTIONS: Reset
  // ==========================================
  
  function resetModifiers() {
    modifiers.value = {
      boosts: {},
      researches: {},
      loopMods: { count: 0 },
      settings: {
        trCount: 0,
        allTimeOrbs: 0,
        defaultHoursInTR: 1
      }
    };
  }
  
  function resetAllData() {
    resetModifiers();
    plans.value = [];
    selectedPlanId.value = null;
    ui.value = {
      activeTab: 'gems',
      isEditing: false,
      showGemOverrideModal: false
    };
  }
  
  // ==========================================
  // RETURN
  // ==========================================
  
  return {
    // State
    modifiers,
    plans,
    steps,
    selectedPlanId,
    ui,
    
    // Getters
    selectedPlan,
    planNames,
    hasPlan,
    
    // Modifier Actions
    setBoostValue,
    getBoostValue,
    setTargetBoostValue,
    getTargetBoostValue,
    setResearchLevel,
    getResearchLevel,
    setLoopModCount,
    setTRCount,
    setAllTimeOrbs,
    setDefaultHoursInTR,
    updateSetting,
    resetToDefaults,
    
    // Direct Step Actions
    addStep: addStep,
    updateStepBoost,
    removeStepBoost,
    updateStepGemOverrides,
    removeStep,
    
    // Plan Actions
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    renamePlan,
    selectPlan,
    
    // Plan Step Actions (renamed to avoid conflict)
    addPlanStep: addStep,
    updatePlanStep: updateStep,
    deletePlanStep: deleteStep,
    reorderSteps,
    
    // Override Actions
    setGemOverride,
    setBoostOverride,
    clearOverrides,
    
    // Results Actions
    updatePlanResults,
    
    // UI Actions
    setActiveTab,
    setEditing,
    toggleGemOverrideModal,
    
    // Import/Export
    exportPlan,
    importPlan,
    exportAllData,
    importAllData,
    
    // Reset
    resetModifiers,
    resetAllData
  };
});
