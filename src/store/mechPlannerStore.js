import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Decimal from 'break_infinity.js';

/**
 * MechPlanner Store
 * 
 * Verwaltet alle Einstellungen und Daten für den Mech Planner:
 * - Vectid Crystal Production Settings (Build-Auswahl, aktuelle Crystals)
 * - Global Settings (Relics, Equipment)
 * - Mech-spezifische Settings (owned, upgrades, current output)
 * - Auto-Update Timestamps für Current Output
 */
export const useMechPlannerStore = defineStore('mechPlanner', () => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  // Vectid Crystal Production Settings
  const selectedBuildId = ref('');
  const currentVectidCrystals = ref(0);
  
  // Global Settings - Relics & Equipment
  const coorsRelic = ref(0);
  const tulsandstofKit = ref(0);
  const mechEngineerToolPants = ref(0);
  const transmissionAmplifierTier = ref(0);
  const transmissionAmplifierLevel = ref(0);
  
  // Mech-spezifische Settings
  // Struktur: { mechKey: { owned: 0, timeUpgrades: 0, multiUpgrades: 0 } }
  const mechSettings = ref({});
  
  // Current Output Multiplier pro Mech
  // Struktur: { mechKey: Decimal }
  const currentOutputMultiplier = ref({});
  
  // Current Output Input Strings (für Display)
  // Struktur: { mechKey: '1e100' }
  const currentOutputMultiplierInput = ref({});
  
  // Timestamps für Auto-Update
  // Struktur: { mechKey: timestamp }
  const currentOutputTimestamps = ref({});
  
  // Initialization Flag
  const isInitialized = ref(false);
  
  // ============================================================================
  // COMPUTED
  // ============================================================================
  
  const hasAnyMechData = computed(() => {
    return Object.keys(mechSettings.value).length > 0;
  });
  
  const totalMechsOwned = computed(() => {
    return Object.values(mechSettings.value).reduce((sum, settings) => {
      return sum + (settings.owned || 0);
    }, 0);
  });
  
  // ============================================================================
  // METHODS
  // ============================================================================
  
  /**
   * Initialisiert den Store (lädt Daten aus localStorage)
   */
  function init() {
    if (isInitialized.value) {
      console.log('MechPlanner Store already initialized');
      return;
    }
    
    console.log('🔧 Initializing MechPlanner Store...');
    loadFromStorage();
    isInitialized.value = true;
  }
  
  /**
   * Lädt alle Daten aus localStorage
   */
  function loadFromStorage() {
    try {
      // Load main settings
      const savedSettings = localStorage.getItem('mechPlanner_settings');
      if (savedSettings) {
        const data = JSON.parse(savedSettings);
        
        // Global Settings
        if (data.coorsRelic !== undefined) coorsRelic.value = data.coorsRelic;
        if (data.tulsandstofKit !== undefined) tulsandstofKit.value = data.tulsandstofKit;
        if (data.mechEngineerToolPants !== undefined) mechEngineerToolPants.value = data.mechEngineerToolPants;
        if (data.transmissionAmplifierTier !== undefined) transmissionAmplifierTier.value = data.transmissionAmplifierTier;
        if (data.transmissionAmplifierLevel !== undefined) transmissionAmplifierLevel.value = data.transmissionAmplifierLevel;
        
        // Mech Settings
        if (data.mechSettings) {
          mechSettings.value = data.mechSettings;
        }
        
        // Current Output Multiplier (konvertiere Strings zurück zu Decimal)
        if (data.currentOutputMultiplier) {
          Object.keys(data.currentOutputMultiplier).forEach(key => {
            try {
              currentOutputMultiplier.value[key] = new Decimal(data.currentOutputMultiplier[key]);
            } catch (error) {
              console.error(`Error converting ${key}:`, error);
              currentOutputMultiplier.value[key] = new Decimal(1);
            }
          });
        }
        
        // Current Output Input Strings
        if (data.currentOutputMultiplierInput) {
          currentOutputMultiplierInput.value = data.currentOutputMultiplierInput;
        }
        
        // Timestamps
        if (data.currentOutputTimestamps) {
          currentOutputTimestamps.value = data.currentOutputTimestamps;
        }
      }
      
      // Load Vectid Crystal settings (separate keys for backward compatibility)
      const savedBuildId = localStorage.getItem('mechPlanner_selectedBuildId');
      if (savedBuildId) {
        selectedBuildId.value = savedBuildId;
      }
      
      const savedCrystals = localStorage.getItem('mechPlanner_currentVectidCrystals');
      if (savedCrystals !== null) {
        currentVectidCrystals.value = Number(savedCrystals) || 0;
      }
      
      console.log('✅ MechPlanner Store loaded from storage');
    } catch (error) {
      console.error('❌ Error loading MechPlanner Store:', error);
    }
  }
  
  /**
   * Speichert alle Daten in localStorage
   */
  function saveToStorage() {
    try {
      // Konvertiere Decimal-Werte zu Strings
      const currentOutputMultiplierForSave = {};
      Object.keys(currentOutputMultiplier.value).forEach(key => {
        currentOutputMultiplierForSave[key] = currentOutputMultiplier.value[key].toString();
      });
      
      // Save main settings
      const dataToSave = {
        coorsRelic: coorsRelic.value,
        tulsandstofKit: tulsandstofKit.value,
        mechEngineerToolPants: mechEngineerToolPants.value,
        transmissionAmplifierTier: transmissionAmplifierTier.value,
        transmissionAmplifierLevel: transmissionAmplifierLevel.value,
        mechSettings: mechSettings.value,
        currentOutputMultiplier: currentOutputMultiplierForSave,
        currentOutputMultiplierInput: currentOutputMultiplierInput.value,
        currentOutputTimestamps: currentOutputTimestamps.value
      };
      
      localStorage.setItem('mechPlanner_settings', JSON.stringify(dataToSave));
      
      // Save Vectid Crystal settings separately (for backward compatibility)
      localStorage.setItem('mechPlanner_selectedBuildId', selectedBuildId.value);
      localStorage.setItem('mechPlanner_currentVectidCrystals', String(currentVectidCrystals.value || 0));
      
    } catch (error) {
      console.error('Error saving MechPlanner Store:', error);
    }
  }
  
  /**
   * Setzt Global Settings auf Default zurück
   */
  function resetGlobalSettings() {
    coorsRelic.value = 0;
    tulsandstofKit.value = 0;
    mechEngineerToolPants.value = 0;
    transmissionAmplifierTier.value = 0;
    transmissionAmplifierLevel.value = 0;
    saveToStorage();
  }
  
  /**
   * Setzt Vectid Crystal Production auf Default zurück
   */
  function resetProduction() {
    selectedBuildId.value = '';
    currentVectidCrystals.value = 0;
    localStorage.removeItem('mechPlanner_selectedBuildId');
    localStorage.removeItem('mechPlanner_currentVectidCrystals');
  }
  
  /**
   * Setzt alle Settings zurück
   */
  function resetAll() {
    // Reset all state
    selectedBuildId.value = '';
    currentVectidCrystals.value = 0;
    coorsRelic.value = 0;
    tulsandstofKit.value = 0;
    mechEngineerToolPants.value = 0;
    transmissionAmplifierTier.value = 0;
    transmissionAmplifierLevel.value = 0;
    mechSettings.value = {};
    currentOutputMultiplier.value = {};
    currentOutputMultiplierInput.value = {};
    currentOutputTimestamps.value = {};
    
    // Clear localStorage
    localStorage.removeItem('mechPlanner_settings');
    localStorage.removeItem('mechPlanner_selectedBuildId');
    localStorage.removeItem('mechPlanner_currentVectidCrystals');
  }
  
  /**
   * Update Mech Settings
   */
  function updateMechSettings(mechKey, settings) {
    if (!mechSettings.value[mechKey]) {
      mechSettings.value[mechKey] = {};
    }
    mechSettings.value[mechKey] = { ...mechSettings.value[mechKey], ...settings };
    saveToStorage();
  }
  
  /**
   * Update Current Output Multiplier
   */
  function updateCurrentOutput(mechKey, value, inputString) {
    currentOutputMultiplier.value[mechKey] = value instanceof Decimal ? value : new Decimal(value);
    currentOutputMultiplierInput.value[mechKey] = inputString;
    currentOutputTimestamps.value[mechKey] = Date.now();
    saveToStorage();
  }
  
  /**
   * Update nur den Timestamp (ohne den Wert zu ändern)
   */
  function updateTimestamp(mechKey) {
    currentOutputTimestamps.value[mechKey] = Date.now();
    saveToStorage();
  }
  
  /**
   * Get Current Output als Decimal
   */
  function getCurrentOutput(mechKey) {
    return currentOutputMultiplier.value[mechKey] || new Decimal(1);
  }
  
  /**
   * Get Current Output Input String
   */
  function getCurrentOutputInput(mechKey) {
    return currentOutputMultiplierInput.value[mechKey] || '1';
  }
  
  /**
   * Get Timestamp
   */
  function getTimestamp(mechKey) {
    return currentOutputTimestamps.value[mechKey] || Date.now();
  }
  
  /**
   * Initialize Mech Settings für einen Mech
   */
  function initializeMechSettings(mechKey) {
    if (!mechSettings.value[mechKey]) {
      mechSettings.value[mechKey] = {
        owned: 0,
        timeUpgrades: 0,
        multiUpgrades: 0
      };
    }
    
    if (!currentOutputMultiplier.value[mechKey]) {
      currentOutputMultiplier.value[mechKey] = new Decimal(1);
    }
    
    if (!currentOutputMultiplierInput.value[mechKey]) {
      currentOutputMultiplierInput.value[mechKey] = '1';
    }
  }
  
  // ============================================================================
  // RETURN (Public API)
  // ============================================================================
  
  return {
    // State
    selectedBuildId,
    currentVectidCrystals,
    coorsRelic,
    tulsandstofKit,
    mechEngineerToolPants,
    transmissionAmplifierTier,
    transmissionAmplifierLevel,
    mechSettings,
    currentOutputMultiplier,
    currentOutputMultiplierInput,
    currentOutputTimestamps,
    isInitialized,
    
    // Computed
    hasAnyMechData,
    totalMechsOwned,
    
    // Methods
    init,
    loadFromStorage,
    saveToStorage,
    resetGlobalSettings,
    resetProduction,
    resetAll,
    updateMechSettings,
    updateCurrentOutput,
    updateTimestamp,
    getCurrentOutput,
    getCurrentOutputInput,
    getTimestamp,
    initializeMechSettings
  };
});
