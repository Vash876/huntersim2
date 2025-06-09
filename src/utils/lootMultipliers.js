// src/utils/lootMultipliers.js

/**
 * Berechnet die Loot-Multiplikatoren für Borge
 */
export function calculateBorgeLootMultipliers(storeData, buildData, hunterId = 'borge') {
  // Helper function für Parameter-Extraktion
  function getParam(param) {
    // Overrides haben Priorität
    if (buildData?.overrides && param in buildData.overrides) {
      if (param === 'upgrades.diamondspecials.hunterloot') {
        const level = buildData.overrides[param] || 0;
        return 1 + level * 0.025;
      }
      return buildData.overrides[param];
    }
    
    // Standard-Extraktion aus Store
    if (param.startsWith('upgrades.')) {
      const parts = param.split('.');
      if (parts.length === 3) {
        const [_, category, key] = parts;
        
        if (category === 'diamondspecials' && key === 'hunterloot') {
          const level = storeData.upgrades?.[category]?.[key] || 0;
          return 1 + level * 0.025;
        }
        
        return storeData.upgrades?.[category]?.[key] || 0;
      }
    }
    
    return 0;
  }
  
  // Current values extrahieren
  const attr = storeData.hunterStats?.[hunterId]?.upgrades?.gems?.attraction || 0;
  const currentMaxStage = storeData.hunterStats?.[hunterId]?.stage || 0;
  
  // XP-spezifische Multiplikatoren
  const attrGN2 = storeData.upgrades?.gems_nodes?.attraction_gem2 || 0;
  const r19 = getParam('upgrades.relics.r19');
  const excludedXpMultis = (attrGN2 ? 1.5 : 1) * 
                          Math.pow(2, Math.floor((currentMaxStage - 1) / 100)) * 
                          Math.pow(2, r19);
  
  // Allgemeine Loot-Multiplikatoren
  const special = getParam('upgrades.diamondspecials.hunterloot');
  const iap = getParam('upgrades.iap.travpack');
  const ultima = getParam('upgrades.ultima.ulti');
  const scavengers = getParam('upgrades.loopmods.scavenger');
  const attrGN3 = getParam('upgrades.gems_nodes.attraction_gem3');
  const lootgu = getParam('upgrades.gems_nodes.attraction_lootBorge');
  const i14 = getParam('upgrades.inscryptions.i14');
  const i80 = getParam('upgrades.inscryptions.i80');
  const i44 = getParam('upgrades.inscryptions.i44');
  const research81 = getParam('upgrades.researches.res81');
  const cm46 = getParam('upgrades.cms.cm46');
  const cm47 = getParam('upgrades.cms.cm47');
  const cm48 = getParam('upgrades.cms.cm48');
  const cm51 = getParam('upgrades.cms.cm51');
  
  const excludedMultis = Math.max(special, 1) * 
                        (iap ? 1.25 : 1) * 
                        Math.max(ultima, 1) * 
                        Math.pow(1.05, scavengers) * 
                        (attrGN3 ? 1.25 : 1) * 
                        Math.pow(Math.pow(1.07, lootgu), 1 + attr * 0.1 - 0.1) * 
                        Math.pow(1.1, i14) * 
                        Math.pow(1.1, i80) * 
                        Math.pow(1.08, i44) * 
                        (research81 >= 1 ? 1.1 : 1) * 
                        (research81 >= 4 ? 1.2 : 1) * 
                        (cm46 > 0 ? 1.03 : 1) * 
                        (cm47 > 0 ? 1.02 : 1) * 
                        (cm48 > 0 ? 1.07 : 1) * 
                        (cm51 > 0 ? 1.05 : 1);
  
  return {
    lootMultiplier: excludedMultis,
    xpMultiplier: excludedMultis * excludedXpMultis,
    // Aufschlüsselung für Debugging
    breakdown: {
      special, iap, ultima, scavengers, attrGN3, lootgu,
      i14, i80, i44, research81, cm46, cm47, cm48, cm51,
      attrGN2, r19, attr, currentMaxStage
    }
  };
}