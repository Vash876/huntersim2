// Utility-Funktionen für Gem-Daten ohne Store-Abhängigkeiten
export function getGemDataFromLocalStorage() {
  try {
    const userStats = JSON.parse(localStorage.getItem('trplanner_userstats') || '{}');
    if (userStats.gemData && userStats.gemData.levels) {
      return userStats.gemData;
    }
    return getDefaultGemData();
  } catch (error) {
    console.warn('Could not load gem data from localStorage:', error);
    return getDefaultGemData();
  }
}

export function getDefaultGemData() {
  return {
    levels: {
      exodus: 0,
      temporal: 0,
      innovation: 0,
      attraction: 0,
      power: 0,
      creation: 0,
      evolution: 0
    },
    activeNodes: {
      temporal: [],
      innovation: [],
      attraction: [],
      power: [],
      creation: [],
      evolution: []
    },
    upgrades: {
      temporal: {},
      innovation: {},
      attraction: {},
      power: {},
      creation: {},
      evolution: {}
    }
  };
}

// Event-System für Gem-Data-Änderungen
const GEM_DATA_CHANGED_EVENT = 'gemDataChanged';

export function notifyGemDataChanged() {
  // Custom Event für Gem-Daten-Änderungen
  const event = new CustomEvent(GEM_DATA_CHANGED_EVENT, {
    detail: { timestamp: Date.now() }
  });
  window.dispatchEvent(event);
}

export function saveGemDataToLocalStorage(gemData) {
  try {
    const currentStats = JSON.parse(localStorage.getItem('trplanner_userstats') || '{}');
    currentStats.gemData = gemData;
    localStorage.setItem('trplanner_userstats', JSON.stringify(currentStats));
    
    // Benachrichtige alle Listener über die Änderung
    notifyGemDataChanged();
    
    // WICHTIG: Event auch für maxLevelStats-Änderungen auslösen
    window.dispatchEvent(new CustomEvent('maxLevelStatsChanged', {
      detail: currentStats
    }));
    
    return true;
  } catch (error) {
    console.error('Error saving gem data:', error);
    return false;
  }
}