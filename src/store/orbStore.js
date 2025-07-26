import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { allBoosts } from '@/constants/tr-planner';

/**
 * Store für den TR Planner mit Persistenz im LocalStorage
 */
export const useTRPlannerStore = defineStore('trPlanner', {
  state: () => ({
    // Speichert die Benutzereinstellungen für den TR Planner
    userStats: useStorage('trplanner_userstats', initializeDefaultStats()),
    
    // Speichert die Planner-Konfiguration
    plannerConfig: useStorage('trplanner_config', {
      trCount: 0,
      allTimeOrbs: 0,
      startDate: new Date().toISOString().split('T')[0],
      calculateCampaignFrags: false
    }),
    
    // Speichert die erstellten Shorts
    shorts: useStorage('trplanner_shorts', []),
    
    // Speichert berechnete Ergebnisse für Shorts
    calculatedResults: useStorage('trplanner_results', {}),

    // UI-Einstellungen
    ui: useStorage('trplanner_ui', {
      showAdvancedControls: false,
      lastViewedTab: 'overview'
    }),

    // Neue State-Eigenschaft für TR-Pläne
    trPlans: useStorage('trplanner_plans', []),
    copyPlanData: null,
    targetStatsAsCurrentStats: null,
    planModalShouldOpen: null,
    tempPlanData: null,

    // Import/Export State for plan contexts
    importedPlanContexts: useStorage('trplanner_imported_contexts', {}),

    // OrbCalculator State
    orbCalculator: useStorage('trplanner_orbcalculator', {
      trCount: 0,
      allTimeOrbs: 0,
      currentBoosts: {},
      targetBoosts: {}
    }),

  }),
  
  getters: {
    /**
     * Gibt alle Boosts mit aktiven Multiplikatoren zurück
     */
    activeBoosts: (state) => {
      return allBoosts.filter(boost => {
        if (boost.type === 'boolean') {
          return state.userStats[boost.key] === true;
        } else {
          return state.userStats[boost.key] > 0;
        }
      });
    },
    
    /**
     * Berechnet den aktuellen Gesamtmultiplikator für Orbs
     */
    totalOrbMultiplier: (state) => {
      let multiplier = 1;
      
      allBoosts.forEach(boost => {
        if (!boost.orbcalc) return;
        
        const value = state.userStats[boost.key];
        if (value) {
          if (typeof boost.multiplier === 'function') {
            try {
              multiplier *= boost.multiplier(value, state.userStats);
            } catch (error) {
              console.error(`Error calculating multiplier for ${boost.key}:`, error);
            }
          } else if (typeof boost.multiplier === 'number') {
            if (boost.type === 'boolean' && value === true) {
              multiplier *= boost.multiplier;
            } else if (boost.type === 'number' && value > 0) {
              multiplier *= boost.multiplier;
            }
          }
        }
      });
      
      return multiplier;
    },
    
    /**
     * Berechnet den aktuellen Gesamtmultiplikator für Fragments
     */
    totalFragMultiplier: (state) => {
      let multiplier = 1;
      
      allBoosts.forEach(boost => {
        if (!boost.fragmulti) return;
        
        const value = state.userStats[boost.key];
        if (value) {
          if (typeof boost.fragmulti === 'function') {
            try {
              multiplier *= boost.fragmulti(value, state.userStats);
            } catch (error) {
              console.error(`Error calculating fragmulti for ${boost.key}:`, error);
            }
          } else if (typeof boost.fragmulti === 'number') {
            if (boost.type === 'boolean' && value === true) {
              multiplier *= boost.fragmulti;
            } else if (boost.type === 'number' && value > 0) {
              multiplier *= boost.fragmulti;
            }
          }
        }
      });
      
      return multiplier;
    },
    
    /**
     * Gibt die Anzahl der aktiven Shorts zurück
     */
    shortCount: (state) => state.shorts.length,

    /**
     * Gibt alle TR-Pläne sortiert nach Erstellungsdatum (neueste zuerst) zurück
     */
    sortedTRPlans: (state) => {
      return [...state.trPlans].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    
    /**
     * Gibt die Anzahl der gespeicherten TR-Pläne zurück
     */
    trPlanCount: (state) => state.trPlans.length,
    
    /**
     * Findet einen TR-Plan anhand seiner ID
     */
    getTRPlanById: (state) => (id) => {
      return state.trPlans.find(plan => plan.id === id);
    }
  },
  
  actions: {
    /**
     * Aktualisiert die Benutzerstats
     * @param {Object} newStats - Die neuen Statistiken
     */
    updateUserStats(newStats) {
      this.userStats = { ...this.userStats, ...newStats };
      
      // Aktualisiere auch allTimeOrbs in der plannerConfig
      if (newStats.allTimeOrbs !== undefined) {
        this.plannerConfig.allTimeOrbs = newStats.allTimeOrbs;
      }
    },
    
    /**
     * Aktualisiert die Planner-Konfiguration
     * @param {Object} newConfig - Die neue Konfiguration
     */
    updatePlannerConfig(newConfig) {
      this.plannerConfig = { ...this.plannerConfig, ...newConfig };
    },
    
    /**
     * Fügt einen neuen Short hinzu
     * @param {Object} short - Der neue Short
     */
    addShort(short) {
      // Erstelle eine Kopie mit einer eindeutigen ID
      const newShort = { 
        ...short, 
        id: `short_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString()
      };
      
      this.shorts.push(newShort);
      
      return newShort.id; // Gib die ID zurück für spätere Referenz
    },
    
    /**
     * Aktualisiert einen vorhandenen Short
     * @param {String} shortId - Die ID des Shorts
     * @param {Object} updatedData - Die aktualisierten Daten
     */
    updateShort(shortId, updatedData) {
      const index = this.shorts.findIndex(s => s.id === shortId);
      if (index !== -1) {
        this.shorts[index] = { 
          ...this.shorts[index], 
          ...updatedData,
          updatedAt: new Date().toISOString() 
        };
        return true;
      }
      return false;
    },
    
    /**
     * Löscht einen Short
     * @param {String} shortId - Die ID des Shorts
     */
    deleteShort(shortId) {
      const index = this.shorts.findIndex(s => s.id === shortId);
      if (index !== -1) {
        this.shorts.splice(index, 1);
        
        // Lösche auch berechnete Ergebnisse
        if (this.calculatedResults[shortId]) {
          delete this.calculatedResults[shortId];
        }
        
        return true;
      }
      return false;
    },
    
    /**
     * Speichert berechnete Ergebnisse für einen Short
     * @param {String} shortId - Die ID des Shorts
     * @param {Object} results - Die berechneten Ergebnisse
     */
    saveCalculatedResults(shortId, results) {
      this.calculatedResults[shortId] = {
        ...results,
        calculatedAt: new Date().toISOString()
      };
    },
    
    /**
     * Setzt den gesamten Planner zurück
     */
    resetPlanner() {
      this.shorts = [];
      this.calculatedResults = {};
      this.plannerConfig = {
        trCount: 10,
        allTimeOrbs: this.userStats.allTimeOrbs || 0,
        startDate: new Date().toISOString().split('T')[0],
        calculateCampaignFrags: false
      };
    },
    
    /**
     * Aktualisiert UI-Einstellungen
     * @param {Object} newSettings - Die neuen Einstellungen
     */
    updateUISettings(newSettings) {
      this.ui = { ...this.ui, ...newSettings };
    },

    /**
     * Fügt einen neuen TR-Plan hinzu
     * @param {Object} plan - Der neue TR-Plan
     * @returns {String} Die ID des neuen Plans
     */
    addTRPlan(plan) {
      // Stelle sicher, dass der Plan eine eindeutige ID und ein Erstellungsdatum hat
      const newPlan = {
        ...plan,
        id: plan.id || `trplan_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        createdAt: plan.createdAt || new Date().toISOString()
      };
      
      // Plan zum Array hinzufügen
      this.trPlans.push(newPlan);
      
      // Aktualisiere die gespeicherte Sortierreihenfolge, um den neuen Plan am Ende zu behalten
      const orderedIds = this.trPlans.map(p => p.id);
      localStorage.setItem('trPlanOrderIds', JSON.stringify(orderedIds));
      
      return newPlan.id;
    },
    
    /**
     * Aktualisiert einen vorhandenen TR-Plan
     * @param {String} planId - Die ID des Plans
     * @param {Object} updatedData - Die aktualisierten Daten
     * @returns {Boolean} true, wenn der Plan aktualisiert wurde, sonst false
     */
    updateTRPlan(planId, updatedData) {
      const index = this.trPlans.findIndex(p => p.id === planId);
      if (index !== -1) {
        this.trPlans[index] = {
          ...this.trPlans[index],
          ...updatedData,
          updatedAt: new Date().toISOString()
        };
        return true;
      }
      return false;
    },
    
    /**
     * Löscht einen TR-Plan
     * @param {String} planId - Die ID des Plans
     * @returns {Boolean} true, wenn der Plan gelöscht wurde, sonst false
     */
    deleteTRPlan(planId) {
      const index = this.trPlans.findIndex(p => p.id === planId);
      if (index !== -1) {
        this.trPlans.splice(index, 1);
        return true;
      }
      return false;
    },

    setCopyPlanData(planData) {
      this.copyPlanData = planData;
    },

    setTargetStatsAsCurrentStats(stats) {
      // Speichert die Target-Stats temporär, damit sie als Current-Stats für einen neuen Plan verwendet werden können
      this.targetStatsAsCurrentStats = stats;
    },
    
    /**
     * Löscht alle TR-Pläne
     */
    clearTRPlans() {
      this.trPlans = [];
    },
    
    /**
     * Aktualisiert die Fortschrittsinformationen eines Plans
     * @param {String} planId - Die ID des Plans
     * @param {Object} progressData - Daten zum Fortschritt
     */
    updateTRPlanProgress(planId, progressData) {
      const index = this.trPlans.findIndex(p => p.id === planId);
      if (index !== -1) {
        this.trPlans[index].progress = {
          ...this.trPlans[index].progress || {},
          ...progressData,
          lastUpdated: new Date().toISOString()
        };
        return true;
      }
      return false;
    },

    saveOrderedPlans(orderedPlans) {
      console.log('Speichere geordnete Pläne im Store:', orderedPlans.map(p => p.id));
      
      // IDs der geordneten Pläne speichern
      const orderedIds = orderedPlans.map(plan => plan.id);
      localStorage.setItem('trPlanOrderIds', JSON.stringify(orderedIds));
      
      // Aktualisiere den Store mit den neu geordneten Plänen
      this.trPlans = [...orderedPlans];
    },

    /**
     * Import a TR Plan from encoded data
     * @param {string} encodedData - Base58 encoded plan data
     * @returns {Object} Import result with plan and metadata
     */
    async importTRPlan(encodedData) {
      try {
        // Import the plan data
        const { importTRPlan } = await import('@/utils/trImportExport');
        const importResult = importTRPlan(encodedData);
        
        // Store the gem context for this imported plan
        if (importResult.gemContext) {
          this.importedPlanContexts[importResult.plan.id] = importResult.gemContext;
        }
        
        // Add the plan to our store
        this.trPlans.push(importResult.plan);
        
        // Update the order
        const orderedIds = this.trPlans.map(p => p.id);
        localStorage.setItem('trPlanOrderIds', JSON.stringify(orderedIds));
        
        return {
          success: true,
          plan: importResult.plan,
          requiresGems: importResult.requiresGems,
          isCompatible: importResult.isCompatible,
          warnings: importResult.isCompatible.warnings || []
        };
      } catch (error) {
        console.error('Error importing TR plan:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Export a TR Plan to encoded string
     * @param {string} planId - ID of the plan to export
     * @returns {Object} Export result with encoded data
     */
    async exportTRPlan(planId) {
      try {
        const plan = this.getTRPlanById(planId);
        if (!plan) {
          throw new Error('Plan not found');
        }

        // Get current gem data or imported gem context
        let gemContext = null;
        if (plan.isImported && this.importedPlanContexts[planId]) {
          // Use the imported gem context
          gemContext = this.importedPlanContexts[planId];
        } else {
          // Use current user's gem data
          const { getGemDataFromLocalStorage } = await import('@/utils/gemDataUtils');
          gemContext = getGemDataFromLocalStorage();
        }

        // Export the plan
        const { exportTRPlan } = await import('@/utils/trImportExport');
        const encodedData = exportTRPlan(plan, gemContext);
        
        return {
          success: true,
          encodedData: encodedData,
          planName: plan.name
        };
      } catch (error) {
        console.error('Error exporting TR plan:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * Get gem context for a specific plan
     * @param {string} planId - ID of the plan
     * @returns {Object|null} Gem context or null
     */
    getPlanGemContext(planId) {
      const plan = this.getTRPlanById(planId);
      if (!plan) return null;
      
      if (plan.isImported && this.importedPlanContexts[planId]) {
        return this.importedPlanContexts[planId];
      }
      
      // For local plans, return null (will use local gem data)
      return null;
    },
    
    // Beim Laden der Pläne
    loadTRPlans() {
      console.log('Lade TR Pläne...');
      
      try {
        // Pläne aus dem LocalStorage laden
        const storedPlans = localStorage.getItem('trplanner_plans');
        if (storedPlans) {
          const parsedPlans = JSON.parse(storedPlans);
          if (Array.isArray(parsedPlans)) {
            this.trPlans = [...parsedPlans];
          }
        }
        
        // Plane nach gespeicherter Reihenfolge sortieren
        const orderedIdsStr = localStorage.getItem('trPlanOrderIds');
        if (orderedIdsStr) {
          const orderedIds = JSON.parse(orderedIdsStr);
          console.log('Gefundene Reihenfolge:', orderedIds);
          
          if (Array.isArray(orderedIds)) {
            // Eine Kopie der Pläne erstellen
            const sortedPlans = [];
            
            // Zuerst füge Pläne in der gespeicherten Reihenfolge hinzu
            orderedIds.forEach(id => {
              const plan = this.trPlans.find(p => p.id === id);
              if (plan) {
                sortedPlans.push(plan);
              }
            });
            
            // Dann füge alle Pläne hinzu, die noch nicht in der Reihenfolge sind (neu hinzugefügt)
            this.trPlans.forEach(plan => {
              if (!orderedIds.includes(plan.id)) {
                sortedPlans.push(plan); // Neu hinzugefügte Pläne ans Ende
              }
            });
            
            // Die sortierten Pläne in den Store speichern
            this.trPlans = sortedPlans;
            
            // Aktualisiere die gespeicherte Reihenfolge
            localStorage.setItem('trPlanOrderIds', JSON.stringify(sortedPlans.map(p => p.id)));
            
            console.log('Pläne nach Reihenfolge sortiert:', this.trPlans.map(p => p.id));
          }
        } else {
          // Wenn keine Reihenfolge gespeichert ist, aktuelle Reihenfolge speichern
          localStorage.setItem('trPlanOrderIds', JSON.stringify(this.trPlans.map(p => p.id)));
        }
      } catch (e) {
        console.error('Fehler beim Laden der TR Pläne:', e);
      }
    },

    init() {
      // Pläne aus dem LocalStorage laden und sortieren
      this.loadTRPlans();
    },

    /**
     * OrbCalculator Actions
     */
    updateOrbCalculatorTRCount(trCount) {
      this.orbCalculator.trCount = trCount;
    },

    updateOrbCalculatorAllTimeOrbs(allTimeOrbs) {
      this.orbCalculator.allTimeOrbs = allTimeOrbs;
    },

    updateOrbCalculatorCurrentBoosts(boosts) {
      this.orbCalculator.currentBoosts = { ...boosts };
    },

    updateOrbCalculatorTargetBoosts(boosts) {
      this.orbCalculator.targetBoosts = { ...boosts };
    },

    updateOrbCalculatorCurrentBoost(key, value) {
      this.orbCalculator.currentBoosts[key] = value;
    },

    updateOrbCalculatorTargetBoost(key, value) {
      this.orbCalculator.targetBoosts[key] = value;
    },

    resetOrbCalculator() {
      this.orbCalculator = {
        trCount: 0,
        allTimeOrbs: 0,
        currentBoosts: {},
        targetBoosts: {}
      };
    },

    /**
     * Initialisiert OrbCalculator mit aktuellen User Stats
     */
    initOrbCalculatorFromUserStats() {
      if (!this.userStats) return;
      
      this.orbCalculator.trCount = this.userStats.trCount || 0;
      this.orbCalculator.allTimeOrbs = this.userStats.allTimeOrbs || 0;
      
      // Current boosts aus userStats übernehmen
      const currentBoosts = {};
      allBoosts.forEach(boost => {
        if (this.userStats[boost.key] !== undefined) {
          currentBoosts[boost.key] = this.userStats[boost.key];
        }
      });
      this.orbCalculator.currentBoosts = currentBoosts;
      
      // Target boosts initial gleich current boosts setzen
      this.orbCalculator.targetBoosts = { ...currentBoosts };
    }
  }
});


/**
 * Initialisiert die Standard-Statistiken basierend auf den definierten Boosts
 * @returns {Object} Die Standard-Statistiken
 */
function initializeDefaultStats() {
  const stats = { allTimeOrbs: 0 };
  
  // Füge jeden Boost zur Stats-Objekt hinzu
  allBoosts.forEach(boost => {
    if (boost.type === 'boolean') {
      stats[boost.key] = false;
    } else if (boost.type === 'number') {
      stats[boost.key] = 0;
    }
  });
  
  return stats;
}