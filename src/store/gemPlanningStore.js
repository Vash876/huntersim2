import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Helper function to generate unique IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// IndexedDB Configuration
const DB_NAME = 'GemPlanningDB';
const DB_VERSION = 1;
const STORES = {
  orbSpendingPlans: 'orbSpendingPlans',
  gemPlans: 'gemPlans',
  settings: 'settings'
};

// IndexedDB Utility Class
class GemPlanningDB {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('GemPlanningDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains(STORES.orbSpendingPlans)) {
          const orbStore = db.createObjectStore(STORES.orbSpendingPlans, { keyPath: 'id' });
          orbStore.createIndex('createdAt', 'createdAt', { unique: false });
          orbStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          orbStore.createIndex('trPlanId', 'trPlanId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.gemPlans)) {
          const gemStore = db.createObjectStore(STORES.gemPlans, { keyPath: 'id' });
          gemStore.createIndex('createdAt', 'createdAt', { unique: false });
          gemStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.settings)) {
          db.createObjectStore(STORES.settings, { keyPath: 'key' });
        }

        console.log('IndexedDB object stores created');
      };
    });
  }

  async getAll(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(storeName, data) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}

// Create singleton DB instance
const gemPlanningDB = new GemPlanningDB();

export const useGemPlanningStore = defineStore('gemPlanning', () => {
  // State
  const orbSpendingPlans = ref([]);
  const gemPlans = ref([]);
  const activeOrbSpendingPlan = ref(null);
  const activeTRPlanData = ref(null);
  const isInitialized = ref(false);
  const isLoading = ref(false);

  // Computed
  const hasOrbSpendingPlans = computed(() => orbSpendingPlans.value.length > 0);
  const hasGemPlans = computed(() => gemPlans.value.length > 0);

  // Initialize the store
  async function init() {
    if (isInitialized.value) return;
    
    console.log('Initializing Gem Planning Store...');
    isLoading.value = true;
    
    try {
      await gemPlanningDB.init();
      await loadAllData();
      isInitialized.value = true;
      console.log('Gem Planning Store initialized successfully');
    } catch (error) {
      console.error('Error initializing Gem Planning Store:', error);
    } finally {
      isLoading.value = false;
    }
  }

  // Load all data from IndexedDB
  async function loadAllData() {
    try {
      const [orbPlans, plans, settings] = await Promise.all([
        gemPlanningDB.getAll(STORES.orbSpendingPlans),
        gemPlanningDB.getAll(STORES.gemPlans),
        gemPlanningDB.getAll(STORES.settings)
      ]);

      orbSpendingPlans.value = orbPlans.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      gemPlans.value = plans.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // Load settings
      const activeOrbPlanSetting = settings.find(s => s.key === 'activeOrbSpendingPlan');
      if (activeOrbPlanSetting?.value) {
        const activePlan = orbSpendingPlans.value.find(p => p.id === activeOrbPlanSetting.value);
        if (activePlan) {
          activeOrbSpendingPlan.value = activePlan;
        }
      }

      const activeTRPlanSetting = settings.find(s => s.key === 'activeTRPlanData');
      if (activeTRPlanSetting?.value) {
        activeTRPlanData.value = activeTRPlanSetting.value;
      }

      console.log(`Loaded ${orbPlans.length} orb spending plans and ${plans.length} gem plans from IndexedDB`);
    } catch (error) {
      console.error('Error loading data from IndexedDB:', error);
    }
  }

  // Save setting to IndexedDB
  async function saveSetting(key, value) {
    try {
      await gemPlanningDB.put(STORES.settings, { key, value });
    } catch (error) {
      console.error(`Error saving setting ${key}:`, error);
    }
  }

  // Orb Spending Plans Functions
  async function createOrbSpendingPlan(name, trPlanId = null, initialBudget = 0, trCount = 1) {
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
    
    try {
      await gemPlanningDB.put(STORES.orbSpendingPlans, plan);
      orbSpendingPlans.value.unshift(plan); // Add to beginning for newest first
      console.log('Orb spending plan created:', plan.name);
      return plan;
    } catch (error) {
      console.error('Error creating orb spending plan:', error);
      throw error;
    }
  }

  async function updateOrbSpendingPlan(planId, updates) {
    const planIndex = orbSpendingPlans.value.findIndex(p => p.id === planId);
    if (planIndex === -1) return null;

    const updatedPlan = {
      ...orbSpendingPlans.value[planIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    try {
      await gemPlanningDB.put(STORES.orbSpendingPlans, updatedPlan);
      orbSpendingPlans.value[planIndex] = updatedPlan;
      
      // Update active plan if it's the same
      if (activeOrbSpendingPlan.value?.id === planId) {
        activeOrbSpendingPlan.value = updatedPlan;
      }
      
      console.log('Orb spending plan updated:', updatedPlan.name);
      return updatedPlan;
    } catch (error) {
      console.error('Error updating orb spending plan:', error);
      throw error;
    }
  }

  async function deleteOrbSpendingPlan(planId) {
    try {
      await gemPlanningDB.delete(STORES.orbSpendingPlans, planId);
      const index = orbSpendingPlans.value.findIndex(p => p.id === planId);
      
      if (index !== -1) {
        orbSpendingPlans.value.splice(index, 1);
      }
      
      if (activeOrbSpendingPlan.value?.id === planId) {
        activeOrbSpendingPlan.value = null;
        await saveSetting('activeOrbSpendingPlan', null);
      }
      
      console.log('Orb spending plan deleted:', planId);
      return true;
    } catch (error) {
      console.error('Error deleting orb spending plan:', error);
      throw error;
    }
  }

  async function loadOrbSpendingPlan(planId) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (plan) {
      activeOrbSpendingPlan.value = plan;
      await saveSetting('activeOrbSpendingPlan', planId);
      console.log('Orb spending plan loaded:', plan.name);
      return plan;
    }
    return null;
  }

  async function duplicateOrbSpendingPlan(planId) {
    const originalPlan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!originalPlan) return null;

    const newPlan = {
      ...JSON.parse(JSON.stringify(originalPlan)),
      id: generateId(),
      name: `${originalPlan.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await gemPlanningDB.put(STORES.orbSpendingPlans, newPlan);
      orbSpendingPlans.value.unshift(newPlan);
      console.log('Orb spending plan duplicated:', newPlan.name);
      return newPlan;
    } catch (error) {
      console.error('Error duplicating orb spending plan:', error);
      throw error;
    }
  }

  function getOrbSpendingPlanById(planId) {
    return orbSpendingPlans.value.find(p => p.id === planId) || null;
  }

  // Plan-specific Gem Functions
  async function initializePlanGemState(planId, trIndex, gemId, maxLevel, upgrades) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return false;
    
    if (!plan.trSteps[trIndex].gemStates[gemId]) {
      plan.trSteps[trIndex].gemStates[gemId] = {
        level: 0,
        upgrades: {},
        nodes: [false, false, false]
      };
      
      // Initialize upgrade levels
      if (upgrades && Array.isArray(upgrades)) {
        upgrades.forEach(upgrade => {
          plan.trSteps[trIndex].gemStates[gemId].upgrades[upgrade.id] = 0;
        });
      }
      
      await updateOrbSpendingPlan(planId, plan);
    }
    
    return true;
  }

  function getPlanGemState(planId, trIndex, gemId) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return null;
    
    return plan.trSteps[trIndex].gemStates[gemId] || null;
  }

  async function updatePlanGemLevel(planId, trIndex, gemId, level) {
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
    await updateOrbSpendingPlan(planId, plan);
    
    return true;
  }

  async function updatePlanUpgradeLevel(planId, trIndex, gemId, upgradeId, level) {
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
    await updateOrbSpendingPlan(planId, plan);
    
    return true;
  }

  async function togglePlanGemNode(planId, trIndex, gemId, nodeIndex) {
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
    await updateOrbSpendingPlan(planId, plan);
    
    return plan.trSteps[trIndex].gemStates[gemId].nodes[nodeIndex];
  }

  async function updatePlanOrbSpending(planId, trIndex, gemId, upgradeId, cost) {
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
        totalSpent += Math.max(0, upgradeSpent);
      });
    });
    plan.trSteps[trIndex].spentOrbs = totalSpent;
    
    await updateOrbSpendingPlan(planId, plan);
    
    return true;
  }

  async function clearPlanTRSpending(planId, trIndex) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex]) return false;
    
    plan.trSteps[trIndex].orbSpending = {};
    plan.trSteps[trIndex].spentOrbs = 0;
    await updateOrbSpendingPlan(planId, plan);
    
    return true;
  }

  function calculatePlanSpentOrbs(planId, trIndex) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (!plan || !plan.trSteps[trIndex] || !plan.trSteps[trIndex].orbSpending) return 0;
    
    let total = 0;
    Object.values(plan.trSteps[trIndex].orbSpending).forEach(gemSpending => {
      Object.values(gemSpending).forEach(upgradeSpent => {
        total += Math.max(0, upgradeSpent);
      });
    });
    
    return total;
  }

  async function updateOrbSpendingPlanTRStep(planId, trIndex, updates) {
    const plan = orbSpendingPlans.value.find(p => p.id === planId);
    if (plan && plan.trSteps[trIndex]) {
      plan.trSteps[trIndex] = {
        ...plan.trSteps[trIndex],
        ...updates
      };
      await updateOrbSpendingPlan(planId, plan);
      return plan.trSteps[trIndex];
    }
    return null;
  }

  // Gem Plans Functions
  async function createGemPlan(planData) {
    const newPlan = {
      id: generateId(),
      name: planData.name || `Plan ${gemPlans.value.length + 1}`,
      description: planData.description || '',
      gameStats: planData.gameStats || {},
      weights: planData.weights || {},
      gemStates: planData.gemStates || {},
      currentStats: planData.currentStats || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await gemPlanningDB.put(STORES.gemPlans, newPlan);
      gemPlans.value.unshift(newPlan);
      console.log('Gem plan created:', newPlan.name);
      return newPlan;
    } catch (error) {
      console.error('Error creating gem plan:', error);
      throw error;
    }
  }

  async function updateGemPlan(planId, planData) {
    const planIndex = gemPlans.value.findIndex(plan => plan.id === planId);
    if (planIndex === -1) return false;

    const updatedPlan = {
      ...gemPlans.value[planIndex],
      ...planData,
      updatedAt: new Date().toISOString()
    };

    try {
      await gemPlanningDB.put(STORES.gemPlans, updatedPlan);
      gemPlans.value[planIndex] = updatedPlan;
      console.log('Gem plan updated:', updatedPlan.name);
      return true;
    } catch (error) {
      console.error('Error updating gem plan:', error);
      throw error;
    }
  }

  async function deleteGemPlan(planId) {
    try {
      await gemPlanningDB.delete(STORES.gemPlans, planId);
      const planIndex = gemPlans.value.findIndex(plan => plan.id === planId);
      
      if (planIndex !== -1) {
        gemPlans.value.splice(planIndex, 1);
      }
      
      console.log('Gem plan deleted:', planId);
      return true;
    } catch (error) {
      console.error('Error deleting gem plan:', error);
      throw error;
    }
  }

  function getGemPlanById(planId) {
    return gemPlans.value.find(plan => plan.id === planId) || null;
  }

  async function duplicateGemPlan(planId) {
    const plan = gemPlans.value.find(plan => plan.id === planId);
    if (!plan) return false;

    const duplicatedPlan = {
      ...JSON.parse(JSON.stringify(plan)),
      id: generateId(),
      name: `${plan.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await gemPlanningDB.put(STORES.gemPlans, duplicatedPlan);
      gemPlans.value.unshift(duplicatedPlan);
      console.log('Gem plan duplicated:', duplicatedPlan.name);
      return duplicatedPlan;
    } catch (error) {
      console.error('Error duplicating gem plan:', error);
      throw error;
    }
  }

  // TR Plan Integration Functions
  async function setActiveTRPlan(trPlanData) {
    activeTRPlanData.value = {
      plan: trPlanData.plan,
      trIndex: trPlanData.trIndex || 0,
      timestamp: Date.now()
    };
    
    await saveSetting('activeTRPlanData', activeTRPlanData.value);
    console.log('TR Plan data set in gem planning store:', activeTRPlanData.value);
  }

  function getActiveTRPlan() {
    return activeTRPlanData.value;
  }

  async function clearActiveTRPlan() {
    activeTRPlanData.value = null;
    await saveSetting('activeTRPlanData', null);
  }

  // Utility Functions
  async function clearAllData() {
    try {
      await Promise.all([
        gemPlanningDB.clear(STORES.orbSpendingPlans),
        gemPlanningDB.clear(STORES.gemPlans),
        gemPlanningDB.clear(STORES.settings)
      ]);
      
      orbSpendingPlans.value = [];
      gemPlans.value = [];
      activeOrbSpendingPlan.value = null;
      activeTRPlanData.value = null;
      
      console.log('All gem planning data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Export/Import Functions
  async function exportData() {
    return {
      orbSpendingPlans: orbSpendingPlans.value,
      gemPlans: gemPlans.value,
      activeOrbSpendingPlan: activeOrbSpendingPlan.value,
      activeTRPlanData: activeTRPlanData.value,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  }

  async function importData(data) {
    try {
      if (data.orbSpendingPlans && Array.isArray(data.orbSpendingPlans)) {
        for (const plan of data.orbSpendingPlans) {
          await gemPlanningDB.put(STORES.orbSpendingPlans, plan);
        }
        orbSpendingPlans.value = data.orbSpendingPlans;
      }

      if (data.gemPlans && Array.isArray(data.gemPlans)) {
        for (const plan of data.gemPlans) {
          await gemPlanningDB.put(STORES.gemPlans, plan);
        }
        gemPlans.value = data.gemPlans;
      }

      if (data.activeOrbSpendingPlan) {
        activeOrbSpendingPlan.value = data.activeOrbSpendingPlan;
        await saveSetting('activeOrbSpendingPlan', data.activeOrbSpendingPlan.id);
      }

      if (data.activeTRPlanData) {
        activeTRPlanData.value = data.activeTRPlanData;
        await saveSetting('activeTRPlanData', data.activeTRPlanData);
      }

      console.log('Gem planning data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing gem planning data:', error);
      return false;
    }
  }

  // Return store interface
  return {
    // State
    orbSpendingPlans,
    gemPlans,
    activeOrbSpendingPlan,
    activeTRPlanData,
    isInitialized,
    isLoading,

    // Computed
    hasOrbSpendingPlans,
    hasGemPlans,

    // Methods
    init,
    loadAllData,

    // Orb Spending Plans
    createOrbSpendingPlan,
    updateOrbSpendingPlan,
    deleteOrbSpendingPlan,
    loadOrbSpendingPlan,
    duplicateOrbSpendingPlan,
    getOrbSpendingPlanById,

    // Plan-specific Gem Functions
    initializePlanGemState,
    getPlanGemState,
    updatePlanGemLevel,
    updatePlanUpgradeLevel,
    togglePlanGemNode,
    updatePlanOrbSpending,
    clearPlanTRSpending,
    calculatePlanSpentOrbs,
    updateOrbSpendingPlanTRStep,

    // Gem Plans
    createGemPlan,
    updateGemPlan,
    deleteGemPlan,
    getGemPlanById,
    duplicateGemPlan,

    // TR Plan Integration
    setActiveTRPlan,
    getActiveTRPlan,
    clearActiveTRPlan,

    // Utilities
    clearAllData,

    // Export/Import
    exportData,
    importData
  };
});
