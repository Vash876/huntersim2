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
      trCount: 10,
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
    })
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
    shortCount: (state) => state.shorts.length
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