import { ref, reactive, computed, watch } from 'vue';
import { useLocalStorage } from './useLocalStorage';
import { useBoostCalculations } from './useBoostCalculations';
import { allBoosts } from '@/constants/tr-planner';

export function useTRPlanner() {
  // Lokaler Speicher
  const { saveData, loadData } = useLocalStorage();
  
  // Boost-Berechnungen
  const { calculateOrbMultiplier, calculateFragMultiplier } = useBoostCalculations();
  
  // Planner-Konfiguration
  const plannerConfig = ref({
    trCount: 10,
    allTimeOrbs: 0,
    startDate: new Date().toISOString().split('T')[0],
    calculateCampaignFrags: false
  });
  
  // Array der Short-Einträge
  const shorts = ref([]);
  
  // Aktuell bearbeiteter Short
  const currentShort = ref(null);
  
  // Konfiguration aktualisieren
  function updateConfig(newConfig) {
    plannerConfig.value = {...newConfig};
  }
  
  // Neuen Short hinzufügen
  function addNewShort() {
    // Startdatum basierend auf dem vorherigen Short oder dem Planner-Startdatum
    const prevShort = shorts.value[shorts.value.length - 1];
    let startDate = plannerConfig.value.startDate;
    
    if (prevShort) {
      const prevEndDate = new Date(prevShort.startDate);
      prevEndDate.setHours(prevEndDate.getHours() + prevShort.duration);
      startDate = prevEndDate.toISOString().split('T')[0];
    }
    
    // Permanente Boosts von vorherigen Shorts übernehmen
    const permanentBoosts = getPermanentBoosts();
    
    // Neuen Short erstellen
    const newShort = {
      id: Date.now().toString(),
      startDate,
      duration: 24,  // Standarddauer
      boosts: {...permanentBoosts},
      orbsRequired: calculateOrbsRequired(shorts.value.length + 1),
      orbsGained: 0
    };
    
    // Short hinzufügen und berechnen
    shorts.value.push(newShort);
    recalculateAll();
  }
  
  // Short bearbeiten
  function editShort(index) {
    currentShort.value = {
      index,
      data: {...shorts.value[index]}
    };
  }
  
  // Short löschen
  function deleteShort(index) {
    shorts.value.splice(index, 1);
    recalculateAll();
  }
  
  // Aktuellen Short speichern
  function saveCurrentShort() {
    if (!currentShort.value) return;
    
    const { index, data } = currentShort.value;
    shorts.value[index] = {...data};
    currentShort.value = null;
    recalculateAll();
  }
  
  // Permanente Boosts aus vorherigen Shorts sammeln
  function getPermanentBoosts() {
    const permanentBoosts = {};
    
    // Alle permanenten Boosts identifizieren
    const permanentBoostKeys = allBoosts
      .filter(boost => boost.permanent)
      .map(boost => boost.key);
    
    // Den letzten Wert für jeden permanenten Boost finden
    if (shorts.value.length > 0) {
      const lastShort = shorts.value[shorts.value.length - 1];
      
      permanentBoostKeys.forEach(key => {
        if (lastShort.boosts[key] !== undefined) {
          permanentBoosts[key] = lastShort.boosts[key];
        }
      });
    }
    
    return permanentBoosts;
  }
  
  // Orb-Anforderungen berechnen
  function calculateOrbsRequired(shortNumber) {
    // Vereinfachte Berechnung der Orb-Kosten für TR
    const baseRequirement = Math.pow(shortNumber, 1.7) * 1000;
    return Math.round(baseRequirement);
  }
  
  // Orb-Gewinne berechnen
  function calculateOrbsGained(shortData) {
    const { duration, boosts } = shortData;
    
    // Basis-Orb-Rate pro Stunde
    const baseOrbRate = 100;
    
    // Orb-Multiplikator aus Boosts berechnen
    const orbMultiplier = calculateOrbMultiplier(boosts);
    
    // Gesamte Orbs
    return Math.round(baseOrbRate * duration * orbMultiplier);
  }
  
  // Kampagnen-Fragment-Gewinne berechnen (vereinfacht)
  function calculateFragsGained(shortData) {
    if (!plannerConfig.value.calculateCampaignFrags) return 0;
    
    const { duration, boosts } = shortData;
    
    // Basis-Fragment-Rate pro Stunde
    const baseFragRate = 10;
    
    // Fragment-Multiplikator aus Boosts berechnen
    const fragMultiplier = calculateFragMultiplier(boosts);
    
    // Gesamte Fragmente
    return Math.round(baseFragRate * duration * fragMultiplier);
  }
  
  // Alle Shorts neu berechnen
  function recalculateAll() {
    let cumulativeOrbs = plannerConfig.value.allTimeOrbs;
    
    shorts.value.forEach((short, index) => {
      // Orbs aus diesem Short
      const orbsGained = calculateOrbsGained(short);
      
      // Benötigte Orbs für diesen TR
      const orbsRequired = calculateOrbsRequired(index + 1);
      
      // Kampagnen-Fragmente berechnen
      const fragsGained = calculateFragsGained(short);
      
      // Short-Daten aktualisieren
      shorts.value[index] = {
        ...short,
        orbsGained,
        orbsRequired,
        fragsGained,
        totalOrbs: cumulativeOrbs + orbsGained
      };
      
      // Kumulative Orbs aktualisieren
      cumulativeOrbs += orbsGained;
    });
  }
  
  // Daten in den lokalen Speicher laden
  function loadFromLocalStorage() {
    const storedData = loadData('shorts-planner');
    
    if (storedData) {
      if (storedData.config) {
        plannerConfig.value = {...storedData.config};
      }
      
      if (Array.isArray(storedData.shorts)) {
        shorts.value = [...storedData.shorts];
      }
      
      recalculateAll();
    }
  }
  
  // Daten in den lokalen Speicher speichern
  function saveToLocalStorage() {
    saveData('shorts-planner', {
      config: plannerConfig.value,
      shorts: shorts.value
    });
  }
  
  // Statistik-Werte berechnen
  const stats = computed(() => {
    if (shorts.value.length === 0) {
      return {
        totalOrbs: plannerConfig.value.allTimeOrbs,
        totalFrags: 0,
        readyShorts: 0,
        pendingShorts: 0,
        estimatedCompletionDate: null
      };
    }
    
    const totalOrbs = shorts.value[shorts.value.length - 1].totalOrbs;
    const totalFrags = shorts.value.reduce((sum, short) => sum + (short.fragsGained || 0), 0);
    
    const readyShorts = shorts.value.filter(short => short.orbsGained >= short.orbsRequired).length;
    const pendingShorts = shorts.value.length - readyShorts;
    
    let estimatedCompletionDate = null;
    if (shorts.value.length > 0) {
      const lastShort = shorts.value[shorts.value.length - 1];
      const lastDate = new Date(lastShort.startDate);
      lastDate.setHours(lastDate.getHours() + lastShort.duration);
      estimatedCompletionDate = lastDate;
    }
    
    return {
      totalOrbs,
      totalFrags,
      readyShorts,
      pendingShorts,
      estimatedCompletionDate
    };
  });
  
  return {
    plannerConfig,
    shorts,
    currentShort,
    stats,
    updateConfig,
    addNewShort,
    editShort,
    deleteShort,
    saveCurrentShort,
    loadFromLocalStorage,
    saveToLocalStorage
  };
}