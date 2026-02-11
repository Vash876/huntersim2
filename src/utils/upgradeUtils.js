// Importiere notwendige Abhängigkeiten
import { UPGRADES } from '@/constants/upgrades';
import { HUNTERS } from '@/constants/hunters';

// Importiere Hunter-spezifische Upgrade-Listen
import { HUNTER_UPGRADES as BORGE_UPGRADES } from '@/constants/borge';
import { HUNTER_UPGRADES as OZZY_UPGRADES } from '@/constants/ozzy';
import { HUNTER_UPGRADES as KNOX_UPGRADES } from '@/constants/knox';

// Map für schnellen Zugriff auf Hunter-Upgrades
const HUNTER_UPGRADE_MAP = {
  borge: BORGE_UPGRADES,
  ozzy: OZZY_UPGRADES,
  knox: KNOX_UPGRADES
};

/**
 * Holt alle Upgrades einer bestimmten Kategorie
 */
export function getUpgrades(category) {
  return UPGRADES[category] || [];
}

/**
 * Fügt Hunter-Informationen zu den Upgrades hinzu
 */
export async function getAllUpgradesWithHunterInfo(category) {
  const upgrades = getUpgrades(category);
  
  // Füge Hunter-Info hinzu, wenn nicht schon vorhanden
  return upgrades.map(upgrade => {
    if (!upgrade.hunter) {
      // Finde heraus, welche Hunter dieses Upgrade verwenden
      const hunterIds = getHuntersForUpgrade(upgrade.id, category);
      
      if (hunterIds.length > 0) {
        upgrade.hunter = hunterIds.join(',');
      } else {
        // Fallback: Für alle Hunter verfügbar
        upgrade.hunter = "all";
      }
    }
    return upgrade;
  });
}

/**
 * Prüft, welche Hunter ein bestimmtes Upgrade verwenden
 * @param {string} upgradeId - Die ID des Upgrades
 * @param {string} category - Die Upgrade-Kategorie
 * @returns {Array} - Array mit Hunter-IDs, die dieses Upgrade verwenden
 */
export function getHuntersForUpgrade(upgradeId, category) {
  // Prüfe jeden Hunter, ob er dieses Upgrade verwendet
  const hunterIds = [];
  
  HUNTERS.forEach(hunter => {
    const upgradeMap = HUNTER_UPGRADE_MAP[hunter.id];
    if (upgradeMap && upgradeMap[category] && upgradeMap[category].includes(upgradeId)) {
      hunterIds.push(hunter.id);
    }
  });
  
  return hunterIds;
}

/**
 * Bestimmt die Farbe für ein Upgrade basierend auf den zugeordneten Huntern
 */
export function getUpgradeColor(upgrade, category) {
  // Wenn explizite Farbe definiert, verwende diese
  if (upgrade.color) return upgrade.color;
  
  // Finde heraus, welche Hunter dieses Upgrade verwenden
  let hunterIds = [];
  
  if (upgrade.hunter === 'all') {
    // Wenn explizit für alle Hunter, verwende grau (neutral)
    return 'gray';
  } else if (upgrade.hunter) {
    // Wenn hunter-Info im Upgrade vorhanden
    hunterIds = upgrade.hunter.split(',');
  } else {
    // Ansonsten über die Hunter-Konstanten ermitteln
    hunterIds = getHuntersForUpgrade(upgrade.id, category);
  }
  
  if (hunterIds.length === 1) {
    // Wenn genau ein Hunter, verwende dessen Farbe
    const hunter = HUNTERS.find(h => h.id === hunterIds[0]);
    return hunter ? hunter.color : 'gray';
  } else if (hunterIds.length > 1) {
    // Wenn mehrere Hunter, verwende grau (neutral)
    return 'gray';
  }
  
  // Fallback, wenn keine Hunter gefunden wurden
  return 'gray';
}

/**
 * Funktion zum Umschalten von Boolean-Upgrades
 */
export function toggleBooleanUpgrade(store, category, itemId) {
  const currentValue = store.getUpgradeValue(category, itemId);
  const newValue = currentValue > 0 ? 0 : 1;
  store.updateUpgrade(category, itemId, newValue);
}

/**
 * Hook für Boolean-Toggle-Funktionalität
 */
export function useBooleanToggle(store, category) {
  function toggleBoolean(item) {
    toggleBooleanUpgrade(store, category, item.id);
  }

  return { toggleBoolean };
}

/**
 * Formatiert den Wert eines Upgrades basierend auf dem Typ und Format
 */
export function formatUpgradeValue(upgrade, level) {
  // Frühe Rückgabe für Level 0 oder nicht-numerische Level
  if (level === 0 || isNaN(level)) return '-';
  
  // Für Boolean-Upgrades
  if (upgrade.type === 'boolean') {
    return level > 0 ? 'Enabled' : 'Disabled';
  }
  
  // Für Gadget-Statistiken
  if (upgrade.upgradeType === 'compound') {
    // Compound-Berechnung für Gadgets
    const base = Math.pow(1 + upgrade.baseValue, level);
    const tier = Math.pow(upgrade.tierMultiplier, Math.floor(level / upgrade.tierStep));
    return `x${(1 * base * tier).toFixed(3)}`;
  }
  
  // Für Upgrades mit dem neuen Schema
  if (upgrade.upgradeType) {
    if (upgrade.upgradeType === 'additive') {
      // Additive Upgrades: 1 + (level * value)
      const value = 1 + (level * upgrade.value);
      return `x${value.toFixed(2)}`;
    } 
    else if (upgrade.upgradeType === 'multiplicative') {
      // Multiplikative Upgrades: value^level
      const value = Math.pow(upgrade.value, level);
      return `x${value.toFixed(2)}`;
    }
  }
  
  // Legacy-Support für die alte Struktur
  // Multiplier-Wert formatieren
  if (upgrade.multiplier) {
    const value = Math.pow(upgrade.multiplier, level);
    return `x${value.toFixed(2)}`;
  }
  
  // Add-Wert formatieren
  if (upgrade.add !== undefined) {
    // Prüfe, ob es ein multiplikator-Format ist
    if (upgrade.format === 'multiplier') {
      // Für multiplier format: (1 + (level * add))
      const value = 1 + (upgrade.add * level);
      return `x${value.toFixed(2)}`;
    } else {
      // Für normale Additionswerte
      const value = upgrade.add * level;
      
      if (upgrade.format === 'percent') {
        return `+${value.toFixed(2)}%`;
      } else if (upgrade.format === 'seconds') {
        return `+${value.toFixed(2)}s`;
      } else {
        return `+${Math.round(value)}`;
      }
    }
  }
  
  // Spezielle Formate
  if (upgrade.format === 'specialMultiplier' && upgrade.baseBonus) {
    if (upgrade.id === 'i60') {
      // Spezialfall für i60
      return upgrade.bonusNames.map(name => 
        `${name}: x${(1 + upgrade.baseBonus * level).toFixed(2)}`
      ).join(', ');
    }
    const bonus = upgrade.baseBonus * level;
    return `+${(bonus * 100).toFixed(0)}%`;
  }
  
  return level;
}

/**
 * Berechnet den Wert eines Gadget-Stats
 */
export function calculateGadgetValue(gadget, statKey, level) {
  if (!gadget || !gadget.stats || !gadget.stats[statKey]) return '-';
  
  const statInfo = gadget.stats[statKey];
  
  if (statInfo.upgradeType === 'compound') {
    // Neue Struktur verwenden
    const base = Math.pow(1 + statInfo.baseValue, level);
    const tier = Math.pow(statInfo.tierMultiplier, Math.floor(level / statInfo.tierStep));
    return `x${(1 * base * tier).toFixed(3)}`;
  } else if (statInfo.calculation) {
    // Legacy-Unterstützung für benutzerdefinierte Berechnungen
    return statInfo.calculation(level);
  }
  
  return '-';
}