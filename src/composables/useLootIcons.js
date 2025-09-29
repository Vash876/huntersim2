import { ref, computed, watch } from 'vue';
// Importiere das Fragments-Icon
import fragmentsIcon from '@/assets/general/fragments.png';

/**
 * Composable zum dynamischen Laden von Hunter-spezifischen Loot-Icons
 */
export function useLootIcons(hunterId) {
  const lootIcons = ref({
    mat1: null,
    mat2: null,
    mat3: null,
    xp: null,
    // Füge das Fragments-Icon als Standard hinzu
    frags: fragmentsIcon
  });
  
  // Dynamisch Icons laden basierend auf dem Hunter
  const loadIcons = async (id) => {
    try {
      // Dynamisch das Modul für den spezifizierten Hunter importieren
      const hunterModule = await import(`../constants/${id}.js`);
      
      // Icons aus dem Modul extrahieren, falls vorhanden
      if (hunterModule.LOOT_ICONS) {
        // Merge die geladenen Icons mit dem Standard-Fragment-Icon
        lootIcons.value = {
          ...lootIcons.value,
          ...hunterModule.LOOT_ICONS
        };
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
    hbm: lootIcons.value.hbm || null, // HBM Icon hinzufügen
    xp: lootIcons.value.xp || null,
    frags: lootIcons.value.frags // Füge das Fragment-Icon hinzu
  }));
  
  // Prüfen, ob ein Icon verfügbar ist
  const hasIcon = (type) => {
    // Fragment-Icon ist immer vorhanden
    if (type === 'frags') return true;
    // HBM-Icon explizit prüfen
    if (type === 'hbm') return !!lootIcons.value.hbm;
    return !!lootIcons.value[type];
  };
  
  return {
    icons: iconUrls,
    hasIcon
  };
}