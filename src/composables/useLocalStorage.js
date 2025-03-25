export function useLocalStorage() {
  // Daten im lokalen Speicher speichern
  function saveData(key, data) {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }
  
  // Daten aus dem lokalen Speicher laden
  function loadData(key) {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) return null;
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }
  
  // Daten aus dem lokalen Speicher löschen
  function removeData(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
  
  return {
    saveData,
    loadData,
    removeData
  };
}