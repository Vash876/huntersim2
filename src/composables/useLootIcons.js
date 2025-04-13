import { ref, computed, watch } from 'vue';

/**
 * Composable zum dynamischen Laden von Hunter-spezifischen Loot-Icons
 */
export function useLootIcons(hunterId) {
  const lootIcons = ref({
    mat1: null,
    mat2: null,
    mat3: null,
    xp: null
  });
  
  // Dynamisch Icons laden basierend auf dem Hunter
  const loadIcons = async (id) => {
    try {
      // Dynamisch das Modul für den spezifizierten Hunter importieren
      const hunterModule = await import(`../constants/${id}.js`);
      
      // Icons aus dem Modul extrahieren, falls vorhanden
      if (hunterModule.LOOT_ICONS) {
        lootIcons.value = hunterModule.LOOT_ICONS;
      }
    } catch (error) {
      console.warn(`Could not load loot icons for hunter ${id}:`, error);
    }
  };
  
  // Initial laden
  if (hunterId) {
    loadIcons(hunterId.value || hunterId);
  }
  
  // Wenn hunterId ein Ref ist, auf Änderungen reagieren
  if (hunterId.value !== undefined) {
    watch(hunterId, (newId) => {
      loadIcons(newId);
    });
  }
  
  // Icon URLs als computed properties bereitstellen
  const iconUrls = computed(() => ({
    mat1: lootIcons.value.mat1 || null,
    mat2: lootIcons.value.mat2 || null,
    mat3: lootIcons.value.mat3 || null,
    xp: lootIcons.value.xp || null
  }));
  
  // Prüfen, ob ein Icon verfügbar ist
  const hasIcon = (type) => !!lootIcons.value[type];
  
  return {
    icons: iconUrls,
    hasIcon
  };
}