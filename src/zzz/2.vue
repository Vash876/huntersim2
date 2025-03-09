import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useButtonControls } from './useButtonControls';
import { storeToRefs } from 'pinia';
import { useUpgradeStore } from '@/store/upgradeStore'
import { logger } from '@/utils/logger';
import { STATS } from '@/constants/borge/stats'
import { UPGRADE_LABELS } from '@/constants/upgradeLabels'

/**
 * Utility-Funktion zum Extrahieren von Werten aus verschachtelten Objekten mit Pfad-Notation
 * @param {Object} obj Das Quellobjekt
 * @param {String} path Der Pfad zum gewünschten Wert (z.B. "relics.r19")
 * @returns {*} Der Wert am angegebenen Pfad oder undefined
 */
export function getValueFromPath(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Hilfsfunktion zum Abrufen von Upgrade-Werten aus der gemeinsamen Upgrade-Struktur
 * @param {Object} upgrades Die globale Upgrade-Struktur
 * @param {String} category Die Kategorie des Upgrades (relics, inscryptions, etc.)
 * @param {String} id Die ID des Upgrades innerhalb der Kategorie
 * @returns {*} Der Wert des Upgrades oder undefined
 */
export function getUpgradeValue(upgrades, category, id) {
  if (!upgrades || !category || !id) return undefined;
  
  // Für einfache Kategorien wie relics, inscryptions
  if (upgrades[category] && typeof upgrades[category] === 'object') {
    if (typeof upgrades[category][id] !== 'undefined') {
      return upgrades[category][id];
    }
  }
  
  // Für verschachtelte Strukturen wie gems.attraction.nodes.catchUp
  const fullPath = `${category}.${id}`;
  return getValueFromPath(upgrades, fullPath);
}

/**
 * Hilfsfunktion zum Abrufen von Hunter-spezifischen Upgrade-Werten
 * @param {Object} upgrades Die globale Upgrade-Struktur
 * @param {String} hunterType Der Hunter-Typ (borge, ozzy, knox)
 * @param {Object} upgradeConfig Die Upgrade-Konfiguration aus constants
 * @returns {Object} Ein Objekt mit allen relevanten Upgrade-Werten für diesen Hunter
 */
export function getHunterUpgrades(upgrades, hunterType, upgradeConfig = {}) {
  if (!upgrades || !hunterType) return {};
  
  const result = {};
  
  // Iteriere über alle Kategorien in der Upgrade-Struktur
  Object.keys(upgrades).forEach(category => {
    // Für einfache Kategorien (keine verschachtelten Objekte)
    if (typeof upgrades[category] === 'object' && !Array.isArray(upgrades[category])) {
      Object.keys(upgrades[category]).forEach(id => {
        // Prüfe, ob dieses Upgrade für den aktuellen Hunter gilt
        const configItem = upgradeConfig[category]?.find(item => item.id === id);
        
        // Wenn keine Konfiguration gefunden wurde oder wenn das Upgrade für alle oder diesen Hunter gilt
        if (!configItem || configItem.hunter === 'all' || configItem.hunter.includes(hunterType)) {
          result[`${category}.${id}`] = upgrades[category][id];
        }
      });
    }
  });
  
  // Spezielle Behandlung für Gems wegen der verschachtelten Struktur
  if (upgrades.gems) {
    Object.keys(upgrades.gems).forEach(gemType => {
      // Gem Level
      result[`gems.${gemType}.level`] = upgrades.gems[gemType].level;
      
      // Gem Nodes
      if (upgrades.gems[gemType].nodes) {
        Object.keys(upgrades.gems[gemType].nodes).forEach(nodeId => {
          const configNode = upgradeConfig.gems?.find(gem => gem.id === gemType)?.nodes?.find(node => node.id === nodeId);
          
          // Wenn keine Konfiguration gefunden wurde oder wenn der Node für alle oder diesen Hunter gilt
          if (!configNode || configNode.hunter === 'all' || configNode.hunter.includes(hunterType)) {
            result[`gems.${gemType}.nodes.${nodeId}`] = upgrades.gems[gemType].nodes[nodeId];
          }
        });
      }
    });
  }
  
  // Spezielle Behandlung für research81 wegen der Tier-Struktur
  if (upgrades.researches && upgrades.researches.research81) {
    const research81Level = upgrades.researches.research81;
    const research81Config = upgradeConfig.researches?.find(r => r.id === 'research81');
    
    result['researches.research81'] = research81Level;
    
    // Wenn zusätzlich eine Konfiguration vorhanden ist, auch die Multiplikatoren extrahieren
    if (research81Config && research81Config.tiers) {
      const tierInfo = research81Config.tiers.find(tier => tier.level === research81Level);
      if (tierInfo && tierInfo.multipliers[hunterType]) {
        result['researches.research81.multiplier'] = tierInfo.multipliers[hunterType];
      }
    }
  }
  
  // Behandlung für spezielle booleschen Werte und Level-Werte
  if (upgrades.loopmods) {
    if (hunterType === 'borge') {
      // Borge-spezifische Upgrades
      if ('trample' in upgrades.loopmods) result['loopmods.trample'] = upgrades.loopmods.trample;
      if ('scavenger' in upgrades.loopmods) result['loopmods.scavenger'] = upgrades.loopmods.scavenger;
    }
    
    if (hunterType === 'ozzy') {
      // Ozzy-spezifische Upgrades
      if ('scavenger2' in upgrades.loopmods) result['loopmods.scavenger2'] = upgrades.loopmods.scavenger2;
    }
    
    // Für weitere Hunter oder generische Loop-Mods
    Object.keys(upgrades.loopmods).forEach(id => {
      if (id !== 'trample' && id !== 'scavenger' && id !== 'scavenger2') {
        const configItem = upgradeConfig.loopmods?.find(item => item.id === id);
        if (!configItem || configItem.hunter === 'all' || configItem.hunter.includes(hunterType)) {
          result[`loopmods.${id}`] = upgrades.loopmods[id];
        }
      }
    });
  }
  
  // IAP und Ultima betreffen alle Hunter
  if (upgrades.iap) {
    Object.keys(upgrades.iap).forEach(id => {
      result[`iap.${id}`] = upgrades.iap[id];
    });
  }
  
  if (upgrades.ultima) {
    Object.keys(upgrades.ultima).forEach(id => {
      result[`ultima.${id}`] = upgrades.ultima[id];
    });
  }
  
  // Diamond Cards & Diamond Special
  if (upgrades.diamondcards) {
    // Für Borge
    if (hunterType === 'borge' && 'gaiden' in upgrades.diamondcards) {
      result['diamondcards.gaiden'] = upgrades.diamondcards.gaiden;
    }
    // Für Ozzy
    if (hunterType === 'ozzy' && 'iridian' in upgrades.diamondcards) {
      result['diamondcards.iridian'] = upgrades.diamondcards.iridian;
    }
    // Für zukünftige Diamond Cards
    Object.keys(upgrades.diamondcards).forEach(id => {
      if (id !== 'gaiden' && id !== 'iridian') {
        const configItem = upgradeConfig.diamondcards?.find(item => item.id === id);
        if (!configItem || configItem.hunter === 'all' || configItem.hunter.includes(hunterType)) {
          result[`diamondcards.${id}`] = upgrades.diamondcards[id];
        }
      }
    });
  }
  
  // Diamond Special gilt für alle Hunter
  if (upgrades.diamondspecials) {
    Object.keys(upgrades.diamondspecials).forEach(id => {
      result[`diamondspecials.${id}`] = upgrades.diamondspecials[id];
    });
  }
  
  // Gadgets sind hunterspezifisch
  if (upgrades.gadgets) {
    if (hunterType === 'borge' && 'wrench_of_gore' in upgrades.gadgets) {
      result['gadgets.wrench_of_gore'] = upgrades.gadgets.wrench_of_gore;
    }
    if (hunterType === 'ozzy' && 'zaptron_533_bio_repair_tool' in upgrades.gadgets) {
      result['gadgets.zaptron_533_bio_repair_tool'] = upgrades.gadgets.zaptron_533_bio_repair_tool;
    }
    if (hunterType === 'knox' && 'anchor_of_ages' in upgrades.gadgets) {
      result['gadgets.anchor_of_ages'] = upgrades.gadgets.anchor_of_ages;
    }
  }
  
  // Shardmilestones gelten für alle oder spezifische Hunter
  if (upgrades.shardmilestones) {
    Object.keys(upgrades.shardmilestones).forEach(id => {
      const configItem = upgradeConfig.shardmilestones?.find(item => item.id === id);
      if (!configItem || configItem.hunter === 'all' || configItem.hunter.includes(hunterType)) {
        result[`shardmilestones.${id}`] = upgrades.shardmilestones[id];
      }
    });
  }
  
  return result;
}

/**
 * Gemeinsame Build-Funktionen für alle Hunter-Build-Komponenten
 * 
 * @param {Object} options Konfigurationsoptionen
 * @param {Object} options.localBuild Ref zum lokalen Build-Objekt
 * @param {Array} options.TALENTS Array mit Talent-Definitionen
 * @param {Array} options.ATTRIBUTES Array mit Attribut-Definitionen
 * @param {Object} options.ATTRIBUTE_DEPENDENCIES Abhängigkeiten zwischen Attributen
 * @param {Object} options.ATTRIBUTE_MIN_VALUE Mindestwerte für Attribute
 * @param {Object} options.hunterStore Store des jeweiligen Hunters
 * @param {String} options.hunterType Typ des Hunters (borge, ozzy, knox)
 * @param {Object} options.globalUpgrades Globale Upgrade-Struktur (optional)
 * @param {Object} options.upgradeConfig Upgrade-Konfiguration aus constants (optional)
 */
export function useBuildFunctions({
  localBuild,
  TALENTS,
  ATTRIBUTES,
  ATTRIBUTE_DEPENDENCIES = {},
  ATTRIBUTE_MIN_VALUE = {},
  hunterStore = null,
  hunterType = '',
  UPGRADES,
  globalUpgrades = null,
  upgradeConfig = {},
  upgradeStore
}) {
  const router = useRouter();
  const { upgrades } = storeToRefs(upgradeStore);
  const { stats } = storeToRefs(hunterStore);

  // Berechnete Eigenschaften für Punkte und Level
  const usedTalentPoints = computed(() =>
    localBuild.value ? Object.values(localBuild.value.talents).reduce((sum, val) => sum + val, 0) : 0
  );

  const usedAttributePoints = computed(() => {
    if (!localBuild.value?.attributes || !ATTRIBUTES) return 0;
    
    return Object.entries(localBuild.value.attributes).reduce((sum, [key, val]) => {
      const attribute = ATTRIBUTES.find(a => a.key === key);
      if (!attribute) return sum;
      return sum + (val * (attribute.cost || 1));
    }, 0);
  });

  const calculatedLevel = computed(() => {
    const talentLevel = usedTalentPoints.value;
    const attributeLevel = Math.ceil(usedAttributePoints.value / 3);
    return Math.max(talentLevel, attributeLevel);
  });

  const maxTalentPoints = computed(() => calculatedLevel.value);
  const maxAttributePoints = computed(() => calculatedLevel.value * 3);

  // Funktion zum Abrufen von Hunter-spezifischen Upgrade-Werten
  function getHunterSpecificUpgrades() {
    if (!globalUpgrades || !hunterType) return {};
    
    return getHunterUpgrades(globalUpgrades, hunterType, upgradeConfig);
  }
  
  // Attribut-Management-Funktionen
  function canIncreaseAttribute(attribute) {
    if (!localBuild.value || !attribute?.key) {
      return false;
    }

    // Dependencies prüfen
    const deps = ATTRIBUTE_DEPENDENCIES[attribute.key] || [];
    if (deps.length) {
      const hasDepsAllocated = deps.every(dep => localBuild.value.attributes[dep] > 0);
      if (!hasDepsAllocated) return false;
    }

    // Min-Wert-Logik (bezogen auf die Gesamtpunktzahl)
    const attrMin = ATTRIBUTE_MIN_VALUE[attribute.key] || 0;
    if (attrMin > 0 && usedAttributePoints.value < attrMin) {
      return false;
    }

    // Prüfe, ob das Attribut bereits das Maximum erreicht hat
    if (localBuild.value.attributes[attribute.key] >= attribute.max) {
      return false;
    }

    return true;
  }

  function propagateAttributeDependencyChange(changedKey, processedKeys = new Set()) {
    // Avoid infinite loops by tracking processed keys
    if (processedKeys.has(changedKey)) return;
    processedKeys.add(changedKey);

    logger.debug("[propagateAttributeDependencyChange] changedKey:", changedKey);

    // Find all attributes that depend on the changed key
    Object.entries(ATTRIBUTE_DEPENDENCIES).forEach(([attrKey, dependencies]) => {
      if (dependencies.includes(changedKey)) {
        const attrMin = ATTRIBUTE_MIN_VALUE[attrKey] || 0;
        logger.debug("[propagateAttributeDependencyChange] Abhängiges Attribut:", attrKey, "Mindestwert:", attrMin);
        
        // Check if the attribute needs to be set to 0
        if (localBuild.value.attributes[attrKey] !== 0 &&
            (localBuild.value.attributes[changedKey] === 0 || usedAttributePoints.value < attrMin)) {
          logger.debug("[propagateAttributeDependencyChange] Setze Attribut auf 0:", attrKey);
          localBuild.value.attributes[attrKey] = 0;
          
          // Recursively propagate the change to dependent attributes
          propagateAttributeDependencyChange(attrKey, processedKeys);
        }
      }
    });

    // Check if attributes are below their minimum value requirement
    Object.keys(localBuild.value.attributes).forEach(attrKey => {
      const attrMin = ATTRIBUTE_MIN_VALUE[attrKey] || 0;
      logger.debug("[propagateAttributeDependencyChange] Prüfe Attribut:", attrKey, "Mindestwert:", attrMin);
      
      if (attrMin > 0) {
        let previousAttributesSum = 0;
        for (const attribute of ATTRIBUTES) {
          if (ATTRIBUTE_MIN_VALUE[attribute.key] < attrMin) {
            previousAttributesSum += (localBuild.value.attributes[attribute.key] || 0) * attribute.cost;
          }
        }
        logger.debug("[propagateAttributeDependencyChange] Summe der vorherigen Attribute:", previousAttributesSum);

        if (previousAttributesSum < attrMin && localBuild.value.attributes[attrKey] !== 0) {
          logger.debug("[propagateAttributeDependencyChange] Setze Attribut auf 0:", attrKey);
          localBuild.value.attributes[attrKey] = 0;
          
          // Recursively propagate the change to dependent attributes
          propagateAttributeDependencyChange(attrKey, processedKeys);
        }
      }
    });
  }

  // Talent-spezifische Funktionen
  function getTalentItemForControl(talent) {
    return {
      id: talent.key,
      maxLevel: talent.max || Infinity
    };
  }

  function getTalentLevelAsFunction(item) {
    return localBuild.value?.talents?.[item.id] || 0;
  }

  function updateTalentLevel(talentKey, newLevel) {
    if (!localBuild.value?.talents) return;
    
    const talent = TALENTS.find(t => t.key === talentKey);
    if (!talent) return;
    
    const max = talent.max ?? Infinity;
    localBuild.value.talents[talentKey] = Math.min(Math.max(0, newLevel), max);
  }

  // Attribute-spezifische Funktionen
  function getAttributeItemForControl(attribute) {
    return {
      id: attribute.key,
      maxLevel: attribute.max || Infinity
    };
  }

  function getAttributeLevelAsFunction(item) {
    return localBuild.value?.attributes?.[item.id] || 0;
  }

  function updateAttributeLevel(attrKey, newLevel) {
    if (!localBuild.value?.attributes) return;
    
    const attribute = ATTRIBUTES.find(a => a.key === attrKey);
    if (!attribute) return;
    
    const max = attribute.max ?? Infinity;
    const oldValue = localBuild.value.attributes[attrKey];
    const newValue = Math.min(Math.max(0, newLevel), max);
    
    // Spezialfall: Wenn wir versuchen, ein Attribut zu erhöhen, das wir nicht erhöhen können
    if (newValue > oldValue && !canIncreaseAttribute(attribute)) {
      return;
    }
    
    localBuild.value.attributes[attrKey] = newValue;
    
    // Abhängigkeiten aktualisieren
    propagateAttributeDependencyChange(attrKey);
  }

  // Stats-spezifische Funktionen
  function getStatItemForControl(stat) {
    return {
      id: stat.key,
      maxLevel: stat.max || Infinity
    };
  }

  function getStatLevelAsFunction(item) {
    return localBuild.value?.modifiedStats?.[item.id] || 0;
  }

  function updateStatLevel(statKey, newLevel, statArray) {
    if (!localBuild.value?.modifiedStats) return;
    
    const stat = statArray.find(s => s.key === statKey);
    if (!stat) return;
    
    const max = stat.max ?? Infinity;
    localBuild.value.modifiedStats[statKey] = Math.min(Math.max(0, newLevel), max);
  }

  // Neue Modified Stats Funktionen hinzufügen
  function getModifiedStatItemForControl(key) {
    return {
      id: `modified_${key}`, // Wichtig: Eindeutige ID hinzufügen
      key,
      type: 'modifiedStat',
      max: getMaxValueForUpgrade(key),
      increment: function() {
        const current = localBuild.value.modifiedStats[key] || 0;
        updateModifiedStatLevel(key, current + 1);
      },
      decrement: function() {
        const current = localBuild.value.modifiedStats[key] || 0;
        updateModifiedStatLevel(key, current - 1);
      },
      incrementFast: function() {
        const current = localBuild.value.modifiedStats[key] || 0;
        updateModifiedStatLevel(key, current + 10);
      },
      decrementFast: function() {
        const current = localBuild.value.modifiedStats[key] || 0;
        updateModifiedStatLevel(key, current - 10);
      }
    };
  }

  function updateControlFunction(item, newLevel) {
    if (item.type === 'modifiedStat') {
      updateModifiedStatLevel(item.key, newLevel);
      return;
    }
    // Bestehende Logik für andere Item-Typen...
  }

  function getModifiedStatLevelAsFunction() {
    return (item) => {
      if (!localBuild.value.modifiedStats) {
        return 0;
      }
      return parseInt(localBuild.value.modifiedStats[item.key]) || 0;
    };
  }

  function updateModifiedStatLevel(key, newLevel) {
    if (!localBuild.value.modifiedStats) {
      localBuild.value.modifiedStats = {};
    }
    
    const max = getMaxValueForUpgrade(key);
    newLevel = Math.max(0, Math.min(newLevel, max));
    localBuild.value.modifiedStats[key] = newLevel;
  }

  // Helper function für Modified Stats
// Helper function für Modified Stats
// Korrigierte Funktion getMaxValueForUpgrade
function getMaxValueForUpgrade(key) {
  if (!key.includes('.')) {
    // Für basic stats
    const stat = STATS.find(s => s.key === key);
    return stat?.max ?? Infinity;
  }

  // Für Upgrades in der flachen Liste
  const upgradeData = UPGRADES.find(u => u.key === key);
  
  if (upgradeData) {
    // Wenn es ein boolean Typ ist
    if (upgradeData.type === 'boolean') {
      return 1;
    }
    
    // Wenn ein expliziter max-Wert definiert ist
    if (upgradeData.max !== undefined) {
      return upgradeData.max;
    }
  }
  
  // Fallbacks für verschiedene Kategorien
  const [category, id, ...rest] = key.split('.');
  
  switch (category) {
    case 'relics':
      return 100;
    case 'inscryptions':
      return 10;
    case 'loopmods':
      return 25;
    case 'gadgets':
      return 1000;
    case 'shardmilestones':
      return Infinity;
    case 'diamondcards':
    case 'iap':
      return 1;
    case 'diamondspecials':
      return 10;
    case 'gems':
      if (rest[0] === 'level') {
        return 3;
      }
      if (rest[0] === 'nodes') {
        return 50;
      }
      return Infinity;
    default:
      return 100;
  }
}

// Helper Funktion für Basic-Stats und Modifikatoren im modal
function getStatMax(key) {
  if (!key.includes('.')) {
    // Für basic stats
    const stat = STATS.find(s => s.key === key);
    return stat?.max ?? Infinity;
  }
  
  // Für Upgrades verwenden wir getMaxValueForUpgrade
  return getMaxValueForUpgrade(key);
}

function getBaseStat(key) {
  if (!key.includes('.')) {
    // For basic stats, get from hunterStore
    return stats.value?.[key] ?? 0;
  }

  const [category, id, ...rest] = key.split('.');
  
  // Handle different upgrade types
  switch (category) {
    case 'gems':
      if (rest[0] === 'level') {
        return upgrades.value?.gems?.[id]?.level || 0;
      }
      if (rest[0] === 'nodes' && rest[1]) {
        return upgrades.value?.gems?.[id]?.nodes?.[rest[1]] || 0;
      }
      return 0;

    case 'relics':
    case 'inscryptions':
    case 'researches':
    case 'shardmilestones':
    case 'diamondspecials':
    case 'gadgets':
      return upgrades.value?.[category]?.[id] || 0;

    case 'loopmods':
      // Spezieller Fall für loopmods - kann boolean oder numeric sein
      const loopmodValue = upgrades.value?.loopmods?.[id];
      if (typeof loopmodValue === 'boolean') {
        return loopmodValue ? 1 : 0;
      }
      return loopmodValue || 0;

    case 'diamondcards':
    case 'iap':
      // Boolean-Werte als 0/1 zurückgeben
      return upgrades.value?.[category]?.[id] ? 1 : 0;

    default:
      return 0;
  }
}

  // Helper Functions für Stats
  function isBooleanStat(key) {
    if (!key.includes('.')) {
      return false;
    }
  
    // Prüfen, ob es als boolean-Typ in UPGRADES definiert ist
    const upgradeData = UPGRADES.find(u => u.key === key);
    if (upgradeData?.type === 'boolean') {
      return true;
    }
  
    const [category, id, ...rest] = key.split('.');
    
    // Kategorien, die immer boolean sind
    if (category === 'diamondcards' || category === 'iap') {
      return true;
    }
    
    // Speziell für loopmods
    if (category === 'loopmods') {
      // Bei 'trample' wissen wir, dass es ein boolean ist
      if (id === 'trample') {
        return true;
      }
      
      // Wir könnten auch den Wert im Store prüfen
      const val = upgrades.value?.loopmods?.[id];
      if (typeof val === 'boolean') {
        return true;
      }
    }
    
    // Gems prüfen
    if (category === 'gems' && rest[0] === 'nodes') {
      // Nodes mit "gem" im Namen sind meist boolean
      if (rest[1]?.includes('gem')) {
        return true;
      }
    }
    
    return false;
  }

  function getStatLabel(key) {
    if (!key.includes('.')) {
      // Für basic stats
      const stat = STATS.find(s => s.key === key);
      return stat?.label || key;
    }

    // Für Upgrades
    return UPGRADE_LABELS[key] || key;
  }

  function shouldShowDifference(key) {
    if (!localBuild.value?.modifiedStats) {
      return false;
    }

    const currentValue = localBuild.value.modifiedStats[key];
    const baseValue = getBaseStat(key);

    return currentValue !== baseValue;
  }

  // Zentrale Button-Control-Funktionen mit useButtonControls
  const {
    handleStart,
    handleEnd,
    handleTouchMove,
    increment,
    decrement,
    incrementFast,
    decrementFast,
  } = useButtonControls({
    getLevel: (item) => {
      if (item.type === 'modifiedStat') {
        return getModifiedStatLevelAsFunction()(item);
      }
      else if (item.id.startsWith('talent_')) {
        return getTalentLevelAsFunction({ id: item.id.substring(7) });
      } 
      else if (item.id.startsWith('attr_')) {
        return getAttributeLevelAsFunction({ id: item.id.substring(5) });
      }
      else if (TALENTS.some(t => t.key === item.id)) {
        return getTalentLevelAsFunction(item);
      } 
      else if (ATTRIBUTES.some(a => a.key === item.id)) {
        return getAttributeLevelAsFunction(item);
      }
      else {
        return getStatLevelAsFunction(item);
      }
    },
    updateLevel: (item, newLevel) => {
      if (item.type === 'modifiedStat') {
        updateModifiedStatLevel(item.key, newLevel);
        return;
      }
      else if (item.id.startsWith('talent_')) {
        updateTalentLevel(item.id.substring(7), newLevel);
      } 
      else if (item.id.startsWith('attr_')) {
        updateAttributeLevel(item.id.substring(5), newLevel);
      }
      else if (TALENTS.some(t => t.key === item.id)) {
        updateTalentLevel(item.id, newLevel);
      } 
      else if (ATTRIBUTES.some(a => a.key === item.id)) {
        updateAttributeLevel(item.id, newLevel);
      }
      else {
        updateStatLevel(item.id, newLevel, []);
      }
    }
  });

  // Build-Management-Funktionen
  function saveBuild(builds, activeBuildIndex, isNewBuild, route, hunterPath) {
    if (!localBuild.value.name.trim()) {
      localBuild.value.name = "Unnamed";
    }
    
    localBuild.value.level = calculatedLevel.value;
    
    if (isNewBuild.value) {
      builds.value.push(JSON.parse(JSON.stringify(localBuild.value)));
      activeBuildIndex.value = builds.value.length - 1;
    } else if (route.query.id) {
      const id = route.query.id;
      const index = builds.value.findIndex(b => String(b.id) === String(id));
      if (index !== -1) {
        builds.value[index] = JSON.parse(JSON.stringify(localBuild.value));
      } else {
        builds.value.push(JSON.parse(JSON.stringify(localBuild.value)));
        activeBuildIndex.value = builds.value.length - 1;
      }
    }
    
    return router.push(hunterPath);
  }

  function cancelBuild(hunterPath) {
    return router.push(hunterPath);
  }

  return {
    // Talent-Funktionen
    getTalentItemForControl,
    getTalentLevelAsFunction,
    updateTalentLevel,
    
    // Attribute-Funktionen
    getAttributeItemForControl,
    getAttributeLevelAsFunction,
    updateAttributeLevel,
    canIncreaseAttribute,
    propagateAttributeDependencyChange,
    
    // Stats-Funktionen
    getStatItemForControl,
    getStatLevelAsFunction,
    getBaseStat,
    updateStatLevel,
    
    // Button-Controls
    handleStart,
    handleEnd,
    handleTouchMove,
    increment,
    decrement,
    incrementFast,
    decrementFast,
    
    // Berechnete Eigenschaften
    usedTalentPoints,
    usedAttributePoints,
    calculatedLevel,
    maxTalentPoints,
    maxAttributePoints,
    
    // Build-Management
    saveBuild,
    cancelBuild,
    
    // Neue Upgrade-Hilfsfunktionen
    getValueFromPath,
    getUpgradeValue,
    getHunterUpgrades,
    getHunterSpecificUpgrades,

    // Modified Stats Funktionen
    getModifiedStatItemForControl,
    getModifiedStatLevelAsFunction,
    updateModifiedStatLevel,
    getMaxValueForUpgrade,

    // Helper Functions für Stats
    isBooleanStat,
    getStatLabel,
    shouldShowDifference
  };
}