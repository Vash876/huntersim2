// Import für Research-Daten
import { researchData_permanent } from '../constants/tr-planner/index.js';

/**
 * Berechnet die benötigten Orbs für den nächsten TR
 * @param {number} trCount - Die aktuelle TR-Anzahl
 * @param {number} allTimeOrbs - Die insgesamt gesammelten Orbs
 * @returns {number} Die benötigte Anzahl an Orbs für den nächsten TR
 */
export function calculateOrbRequirement(trCount, allTimeOrbs) {
  if (trCount === undefined || allTimeOrbs === undefined) {
    return 0;
  }

  // Feste Werte für TR 0 bis TR 11
  const fixedTRValues = [
    1,     // TR 0
    5.6,   // TR 1
    9.4,   // TR 2
    14.6,  // TR 3
    24.9,  // TR 4
    51.2,  // TR 5
    151,   // TR 6
    404,   // TR 7
    734,   // TR 8
    1060,  // TR 9
    1150,  // TR 10
    2600   // TR 11
  ];

  // Falls trCount im festen Wertebereich ist, gib den entsprechenden Wert zurück
  if (trCount >= 0 && trCount < fixedTRValues.length) {
    return fixedTRValues[trCount];
  }

  // Standard-Berechnung für TR > 11
  return (
    (5 * Math.pow(1.2 + trCount * 0.008, trCount) +
      5000 +
      allTimeOrbs * 0.13) *
    Math.pow(1.02, trCount - 11)
  );
}

/**
 * Berechnet den Catch-Up Multiplier basierend auf hoursInTR und Research 109/110
 * @param {number} hoursInTR - Stunden im aktuellen TR
 * @param {Object} allValues - Alle aktuellen Werte für Research-Zugriff (optional)
 * @returns {number} Berechneter Catch-Up Multiplier
 */
export function calculateCupMultiplier(hoursInTR, allValues = {}) {
  // Research 110: Bonus-Stunden hinzufügen (8-48 Stunden je nach Level)
  let effectiveHours = hoursInTR || 0; // Auch bei 0 Stunden weiterrechnen für Research-Boni
  const researchAlltimeValue = allValues.research_alltime || 0;
  
  // Evolution GN #1 prüfen
  let evolutionGN1Active = false;
  try {
    // Plan-Context prüfen (für TR-Plan Overrides)
    if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
      const gemData = window.__PLAN_CONTEXT__.gemData;
      const evolutionLevel = gemData.levels?.evolution || 0;
      const evolutionNodes = gemData.activeNodes?.evolution || [];
      evolutionGN1Active = evolutionLevel >= 1 && evolutionNodes.includes(0);
    } else {
      // Fallback: localStorage
      const userStatsJSON = localStorage.getItem('trplanner_userstats');
      if (userStatsJSON) {
        const userStats = JSON.parse(userStatsJSON);
        const gemData = userStats.gemData;
        if (gemData) {
          const evolutionLevel = gemData.levels?.evolution || 0;
          const evolutionNodes = gemData.activeNodes?.evolution || [];
          evolutionGN1Active = evolutionLevel >= 1 && evolutionNodes.includes(0);
        }
      }
    }
  } catch (e) {
    evolutionGN1Active = false;
  }
  
  // Research 110 & 109 Boni berechnen
  let totalBonusHours = 0;
  let totalSpeedBonus = 0;
  
  if (researchAlltimeValue > 0) {
    // Research 110: Bonus-Stunden (additiv)
    const research110Data = researchData_permanent['110'] || [];
    for (const level of research110Data) {
      if (researchAlltimeValue >= level.price && level.catchupHours) {
        totalBonusHours += level.catchupHours; // Additiv: 8 + 16 + 24 + 32 + 40 + 48 = 168 Stunden
      }
    }
    
    // Research 109: Speed-Bonus (additiv)
    const research109Data = researchData_permanent['109'] || [];
    for (const level of research109Data) {
      if (researchAlltimeValue >= level.price && level.catchupBonus) {
        totalSpeedBonus += level.catchupBonus; // Additiv: 0.02 + 0.03 + 0.05 + 0.08 + 0.13 + 0.21 = 0.52 (52%)
      }
    }
  }
  
  // Effektive Stunden mit Research 110 Bonus
  effectiveHours += totalBonusHours;
  
  // Speed-Multiplikator mit Research 109 Bonus und Evolution GN #1
  let speedMultiplier = 1 + totalSpeedBonus;
  if (evolutionGN1Active) {
    speedMultiplier *= 1.66; // Evolution GN #1: 1.66x schnellerer Catch-Up
  }
  
  // Maximum-Wert basierend auf Evolution GN #1
  const maxCatchUp = evolutionGN1Active ? 4 : 2;
  
  // KORRIGIERTE Catch-Up Formel: 
  // Original: Math.min(2, Math.max(1, (hoursInTR * 0.00024) / 0.25 + 1))
  // Mit Research-Boni und Evolution GN #1: 
  const enhancedRate = 0.00024 * speedMultiplier;
  const result = Math.min(maxCatchUp, Math.max(1, (effectiveHours * enhancedRate) / 0.25 + 1));
  
  // Rückgabe: Mindestens 1.0, auch wenn keine Stunden vorhanden sind
  return Math.max(1, result);
}

/**
 * Berechnet den Multiplikator für einen bestimmten Boost
 * @param {Object} boost - Boost-Objekt mit multiplier Funktion oder Wert
 * @param {number|boolean} value - Aktueller Wert des Boosts
 * @param {Object} allValues - Alle aktuellen Werte für die Berechnung
 * @returns {number} Berechneter Multiplikator
 */
export function calculateMultiplier(boost, value, allValues) {
  // Wenn kein Boost oder kein Multiplikator definiert ist
  if (!boost || boost.multiplier === undefined) return 1;
  
  // Wenn der Boost deaktiviert ist (für Boolean-Boosts)
  if (boost.type === 'boolean' && !value) return 1;
  
  // Wenn es sich um einen numerischen Boost handelt
  if (typeof boost.multiplier === 'function') {
    try {
      return boost.multiplier(value, allValues);
    } catch (e) {
      return 1;
    }
  } else if (typeof boost.multiplier === 'number') {
    // Für Boolean-Boosts: Wenn aktiv, Multiplikator anwenden
    if (boost.type === 'boolean') {
      return value ? boost.multiplier : 1;
    }
    
    // Für numerische Boosts mit festem Multiplikator
    return boost.multiplier;
  }
  
  return 1;
}

/**
 * Berechnet die Orb-Gewinne basierend auf den Plan-Stats
 * @param {Object} currentStats - Die aktuellen Stats
 * @param {Object} planStats - Die geplanten Stats
 * @returns {number} Orb-Gewinne
 */
export function calculateOrbGains(currentStats, planStats, boosts = []) {
  // Stunden im TR abrufen
  const hoursInTR = planStats.hoursInTR || 0;
  
  // Basis-Orb-Rate 
  const baseOrbRate = 1; 
  
  let result = baseOrbRate;

  // Catch-Up Multiplier berechnen
  const catchUpMultiplier = calculateCupMultiplier(hoursInTR, planStats);

  // Durch alle relevanten Boosts iterieren und Multiplikatoren anwenden
  boosts.forEach((boost) => {
    if (!boost.orbcalc) return; // Nur Boosts berücksichtigen, die für Orb-Berechnung relevant sind
    
    // Prüfen, ob der Boost aufgrund von Gem-Anforderungen verfügbar ist
    const isAvailable = isBoostAvailable(boost, planStats);
    if (!isAvailable) {
      // Wenn der Boost nicht verfügbar ist, überspringen wir ihn ohne Multiplikation mit 0
      return;
    }
    
    const value = planStats[boost.key];
    let multiplier = 1; // Neutraler Wert als Standardfall
    
    try {
      if (boost.type === 'boolean') {
        // Boolean Boosts
        if (value) {
          if (typeof boost.multiplier === 'number') {
            multiplier = boost.multiplier;
          } else if (typeof boost.multiplier === 'function') {
            multiplier = boost.multiplier(1, planStats);
          }
        }
      } else if (value > 0) {
        // Numerische Boosts
        if (typeof boost.multiplier === 'number') {
          multiplier = boost.multiplier;
        } else if (typeof boost.multiplier === 'function') {
          multiplier = boost.multiplier(value, planStats);
        }
      }
      
      // Sicherheitscheck gegen ungültige Werte
      if (isNaN(multiplier) || !isFinite(multiplier)) {
        // Ungültiger Multiplikator, überspringen
      } else {
        result *= multiplier;
      }
    } catch (e) {
      // Bei einem Fehler: neutralen Wert (1) verwenden
    }
  });

  // Catch-Up Multiplier anwenden
  result *= catchUpMultiplier;

  return result;
}

function forceRefreshGemData() {
  try {
    // Direkt aus localStorage ohne Caching
    const userStatsJSON = localStorage.getItem('trplanner_userstats');
    if (userStatsJSON) {
      const userStats = JSON.parse(userStatsJSON);
      if (userStats.gemData && userStats.gemData.levels) {
        return userStats.gemData.levels;
      }
    }
    
    // Fallback: Alle Gems auf Level 0
    return {
      exodus: 0,
      temporal: 0,
      innovation: 0,
      attraction: 0,
      power: 0,
      creation: 0,
      evolution: 0
    };
  } catch (e) {
    return {};
  }
}

/**
 * Prüft, ob ein Boost basierend auf Gem-Anforderungen verfügbar ist
 * @param {Object} boost - Der zu prüfende Boost
 * @param {Object} stats - Die aktuellen Stats mit Gem-Daten
 * @returns {boolean} - Ist der Boost verfügbar
 */
function isBoostAvailable(boost, stats) {
  // Wenn keine Gem-Anforderungen definiert sind, ist der Boost immer verfügbar
  if (!boost.unlock || !boost.unlock_level) {
    return true;
  }
  
  // KORRIGIERT: Verwende Plan-Context Gem-Daten wenn verfügbar, sonst localStorage
  let gemLevels = {};
  
  // Prüfe zuerst auf Plan-Context (für TR-Plan Overrides)
  if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
    gemLevels = window.__PLAN_CONTEXT__.gemData.levels || {};
  } else {
    // Fallback: Normale localStorage Gem-Daten
    gemLevels = forceRefreshGemData();
  }
  
  // Prüfe, ob das erforderliche Gem-Level erreicht ist
  const requiredGem = boost.unlock;
  const requiredLevel = boost.unlock_level || 0;
  const currentLevel = gemLevels[requiredGem] || 0;
  
  const isAvailable = currentLevel >= requiredLevel;
  
  return isAvailable;
}

/**
 * Berechnet die Orb-Gewinne basierend auf den Plan-Stats (alternative Implementierung)
 * @param {Object} currentStats - Die aktuellen Stats
 * @param {Object} planStats - Die geplanten Stats
 * @returns {number} Orb-Gewinne
 */
export function calculateOrbGainsCalc(currentStats, planStats, boosts = []) {
  // Basis-Orb-Rate 
  const baseOrbRate = 1; 
  
  let result = baseOrbRate;

  // Catch-Up Multiplier berechnen
  const hoursInTR = planStats.hoursInTR || 0;
  const catchUpMultiplier = calculateCupMultiplier(hoursInTR, planStats);

  // Array für aktive Boosts sammeln
  const activeBoosts = [];
  const skippedBoosts = [];

  // Durch alle relevanten Boosts iterieren und Multiplikatoren anwenden
  for (const boost of boosts) {
    if (!boost.orbcalc) {
      skippedBoosts.push({
        name: boost.label,
        key: boost.key,
        reason: 'Not orbcalc relevant'
      });
      continue;
    }
    
    // Prüfen, ob der Boost verfügbar ist
    if (!isBoostAvailable(boost, planStats)) {
      skippedBoosts.push({
        name: boost.label,
        key: boost.key,
        reason: 'Gem requirement not met'
      });
      continue;
    }
    
    const value = planStats[boost.key];
    
    // KORRIGIERT: Boolean-Boosts richtig behandeln
    if (boost.type === 'boolean') {
      // Für Boolean-Boosts: Prüfe explizit auf true
      if (value !== true) {
        skippedBoosts.push({
          name: boost.label,
          key: boost.key,
          reason: `Boolean not active (value: ${value})`
        });
        continue;
      }
    } else {
      // Für numerische Boosts: Prüfe auf > 0
      if (!value || value <= 0) {
        skippedBoosts.push({
          name: boost.label,
          key: boost.key,
          reason: `No value (${value})`
        });
        continue;
      }
    }
    
    try {
      let multiplier = 1; // Neutraler Standardwert
      
      if (boost.type === 'boolean') {
        // Boolean-Boost: value ist bereits true (siehe oben)
        if (typeof boost.multiplier === 'number') {
          multiplier = boost.multiplier;
        } else if (typeof boost.multiplier === 'function') {
          multiplier = boost.multiplier(1, planStats);
        }
      } else if (value > 0) {
        // Numerischer Boost
        if (typeof boost.multiplier === 'number') {
          multiplier = Math.pow(boost.multiplier, value);
        } else if (typeof boost.multiplier === 'function') {
          multiplier = boost.multiplier(value, planStats);
        }
      }
      
      // Schutz vor NaN und Infinity
      if (isNaN(multiplier) || !isFinite(multiplier)) {
        skippedBoosts.push({
          name: boost.label,
          key: boost.key,
          reason: `Invalid multiplier: ${multiplier}`
        });
      } else {
        const oldResult = result;
        result *= multiplier;
        
        // Sammle aktive Boosts für detaillierte Ausgabe
        activeBoosts.push({
          name: boost.label,
          key: boost.key,
          type: boost.type,
          value: value,
          multiplier: multiplier,
          resultBefore: oldResult,
          resultAfter: result,
          contribution: ((result / oldResult - 1) * 100).toFixed(2) + '%'
        });
      }
    } catch (e) {
      skippedBoosts.push({
        name: boost.label,
        key: boost.key,
        reason: `Calculation error: ${e.message}`
      });
    }
  }

  // Catch-Up Multiplier anwenden
  const beforeCatchUp = result;
  result *= catchUpMultiplier;

  return isNaN(result) ? 0 : result;
}

/**
 * Berechnet die Fragment-Gewinne aus Kampagnen
 * @param {Object} currentStats - Die aktuellen Stats
 * @param {Object} planStats - Die geplanten Stats
 * @param {Array} boosts - Array mit allen verfügbaren Boosts
 * @returns {number} Geschätzte Fragment-Gewinne
 */
export function calculateCampaignFragGains(currentStats, planStats, boosts = []) {
  // Wenn keine Kampagnen definiert sind, keine Berechnung möglich
  if (planStats.campaigns === undefined) {
    return 0;
  }
  
  // Store-Integration: Gem-Daten direkt laden
  function getGemDataFromStore() {
    try {
      // First check for plan context (for overrides in TR plans)
      if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.gemData) {
        return window.__PLAN_CONTEXT__.gemData;
      }
      
      // Prüfe ob wir im Browser-Kontext sind und der Store verfügbar ist
      if (typeof window !== 'undefined' && window.__PINIA__) {
        // Versuche über globales Pinia-Instance auf den Store zuzugreifen
        const stores = window.__PINIA__.state.value;
        const trPlannerStoreData = stores.trPlannerStore || stores.orbStore;
        
        if (trPlannerStoreData && trPlannerStoreData.userStats && trPlannerStoreData.userStats.gemData) {
          const gemData = trPlannerStoreData.userStats.gemData;
          
          return {
            levels: gemData.levels || {
              exodus: 0,
              temporal: 0,
              innovation: 0,
              attraction: 0,
              power: 0,
              creation: 0,
              evolution: 0
            },
            activeNodes: gemData.activeNodes || {
              temporal: [],
              innovation: [],
              attraction: [],
              power: [],
              creation: [],
              evolution: []
            }
          };
        }
      }
      
      // Fallback: Versuche über localStorage
      const localStorageData = localStorage.getItem('trplanner_userstats');
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        const gemData = parsedData.gemData;
        
        if (gemData) {
          return {
            levels: gemData.levels || {
              exodus: 0,
              temporal: 0,
              innovation: 0,
              attraction: 0,
              power: 0,
              creation: 0,
              evolution: 0
            },
            activeNodes: gemData.activeNodes || {
              temporal: [],
              innovation: [],
              attraction: [],
              power: [],
              creation: [],
              evolution: []
            }
          };
        }
      }
      
      // Wenn nichts gefunden wird, Standard-Werte zurückgeben
      throw new Error('No gem data found');
      
    } catch (error) {
      return {
        levels: { exodus: 0, temporal: 0, innovation: 0, attraction: 0, power: 0, creation: 0, evolution: 0 },
        activeNodes: { temporal: [], innovation: [], attraction: [], power: [], creation: [], evolution: [] }
      };
    }
  }
  
  // Get maxed boosts data from plan context or localStorage
  function getMaxedBoostsFromStore() {
    try {
      // First check for plan context (for overrides in TR plans)
      if (typeof window !== 'undefined' && window.__PLAN_CONTEXT__ && window.__PLAN_CONTEXT__.maxedBoosts) {
        return window.__PLAN_CONTEXT__.maxedBoosts;
      }
      
      // Fallback: Try localStorage
      const localStorageData = localStorage.getItem('trplanner_userstats');
      if (localStorageData) {
        const parsedData = JSON.parse(localStorageData);
        return parsedData._orbCalcMaxedBoosts || {};
      }
      
      return {};
    } catch (error) {
      return {};
    }
  }
  
  // Hilfsfunktion, um den Fragment-Multiplikator für einen bestimmten Boost zu berechnen
  function getFragMultiplier(boostKey, value, values) {
    if (!value) return 1;
    
    const boost = boosts.find(b => b.key === boostKey);
    if (!boost || boost.fragmulti === undefined) return 1;
    
    if (typeof boost.fragmulti === 'function') {
      try {
        return boost.fragmulti(value, values);
      } catch (e) {
        return 1;
      }
    } else if (typeof boost.fragmulti === 'number') {
      return value ? boost.fragmulti : 1;
    }
    
    return 1;
  }
  
  // Gem-Daten aus Store laden
  const gemData = getGemDataFromStore();
  const attractionLevel = gemData.levels.attraction || 0;
  const attractionNodes = gemData.activeNodes.attraction || [];
  const powerLevel = gemData.levels.power || 0;
  const powerNodes = gemData.activeNodes.power || [];
  
  // Hole die relevanten Werte aus planStats
  const campaigns = planStats.campaigns || 0;
  const r6 = planStats.r6 || 0;
  
  // Fragment-Multiplikatoren berechnen
  let m0 = getFragMultiplier("ms0", planStats.ms0, planStats);
  let attr1 = 1; // Attraction GN #1 direkt aus Store
  let campfragdet = getFragMultiplier("campfragdet", planStats.campfragdet, planStats);
  let pow2 = 1; // Power GN #2 direkt aus Store
  let research_alltime = getFragMultiplier("research_alltime", planStats.research_alltime, planStats);
  let ouroinstalls = getFragMultiplier("ouroinstalls", planStats.ouroinstalls, planStats);
  
  // Store-basierte Gem-Node-Checks
  // Attraction GN #1 (Node Index 0) - erfordert Attraction Level 1+
  if (attractionLevel >= 1 && attractionNodes.includes(0)) {
    attr1 = 1.5; // Attraction GN #1 Fragment-Multiplier
  }
  
  // Power GN #2 (Node Index 1) - erfordert Power Level 1+
  if (powerLevel >= 1 && powerNodes.includes(1)) {
    pow2 = 2; // Power GN #2 Fragment-Multiplier
  }
  
  // R6 spezifische Berechnungen
  const r6Add = 2.75 * r6;
  const r6Multi = Math.pow(1.05, r6);
  
  let totalFrags = 0;
  
  // Kampagnen-Schleife
  for (let i = 0; i < campaigns; i++) {
    let baseFrags = (2.5 + r6Add) * (m0 * attr1 * campfragdet * pow2 * research_alltime * ouroinstalls * r6Multi);
    
    // Spezielle Multiplikatoren für bestimmte Kampagnen
    let campaignMulti = 1;
    if (i === 35) campaignMulti = 2;
    if (i === 39) campaignMulti = 3;
    if (i === 43) campaignMulti = 13;
    if (i === 47) campaignMulti = 19;
    
    // Skalierung und Gesamtfragmente berechnen
    const fragGain = baseFrags * campaignMulti * Math.pow(1.03, i);
    totalFrags += fragGain;
  }
  
  return totalFrags;
}

/**
 * Berechnet die zusätzlichen Stunden, die im TR verbracht werden müssen, um das Requirement zu erfüllen
 * @param {number} currentHours - Aktuelle Stunden im TR
 * @param {number} trRequirement - TR Requirement (Orbs benötigt)
 * @param {Object} baseStats - Objekt mit Basis-Statistiken und ggf. calculatedOrbGains
 * @param {Object} planStats - Geplante Statistiken für den aktuellen Schritt
 * @param {Array} boosts - Liste der relevanten Boosts für die Berechnung
 * @param {number} maxIterations - Maximale Anzahl von Iterationen (Stunden)
 * @returns {number} Anzahl der benötigten zusätzlichen Stunden
 */
export function calculateMissingHours(
  currentHours,
  trRequirement,
  baseStats,
  planStats,
  boosts,
  maxIterations = 1000
) {
  // Finde den hoursInTR Boost für die Multiplikatorberechnung
  const hoursInTRBoost = boosts.find(b => b.key === 'hoursInTR');
  
  // Hilfsfunktion für die Berechnung der Orbs bei bestimmten Stunden
  const calculateOrbsForHours = (hours) => {
    // Optimierungsfall: Wenn vorgefertigte Orb-Produktion verfügbar ist
    if (baseStats?.calculatedOrbGains !== undefined) {
      // Berechnung des Stundenmultiplikator-Verhältnisses
      let hourMultiRatio = 1;
      
      if (hoursInTRBoost && typeof hoursInTRBoost.multiplier === 'function') {
        // Vorbereitung der Werte für die Multiplikatorberechnung
        const baseValues = { ...planStats, hoursInTR: currentHours };
        const newValues = { ...planStats, hoursInTR: hours };
        
        // Berechnung der Multiplikatoren für beide Stundenwerte
        const baseMultiplier = hoursInTRBoost.multiplier(currentHours, baseValues);
        const newMultiplier = hoursInTRBoost.multiplier(hours, newValues);
        
        // Verhältnis der Multiplikatoren
        hourMultiRatio = newMultiplier / baseMultiplier;
      }
      
      // Berechnung des Cup-Multiplikator-Verhältnisses
      const baseValues = { ...planStats, hoursInTR: currentHours };
      const newValues = { ...planStats, hoursInTR: hours };
      const initialCupMultiplier = calculateCupMultiplier(currentHours, baseValues);
      const newCupMultiplier = calculateCupMultiplier(hours, newValues);
      const cupMultiRatio = newCupMultiplier / initialCupMultiplier;
      
      // Kombination beider Multiplikator-Verhältnisse
      const totalMultiRatio = hourMultiRatio * cupMultiRatio;
      
      // Anwendung des kombinierten Multiplikators auf die Basisproduktion
      return baseStats.calculatedOrbGains * totalMultiRatio;
    }
    
    // Standardfall: Direkte Berechnung mit aktualisierten Stunden
    const updatedStats = {
      ...baseStats,
      ...planStats,
      hoursInTR: hours
    };
    
    return calculateOrbGains(updatedStats, boosts);
  };
  
  // Initialisierung
  let additionalHours = 0;
  let generatedOrbs = calculateOrbsForHours(currentHours);
  
  // Frühzeitiger Return, wenn bereits genug Orbs produziert werden
  if (generatedOrbs >= trRequirement) {
    return 0;
  }
  
  // Phase 1: Suche mit 10-Stunden-Schritten
  // Ziel: Schnell einen Bereich finden, in dem das Requirement erfüllt wird
  let phase1Counter = 0;
  while (generatedOrbs < trRequirement && additionalHours < maxIterations) {
    additionalHours += 10;
    generatedOrbs = calculateOrbsForHours(currentHours + additionalHours);
    
    // Sicherheitsmechanismus gegen unendliche Schleifen
    if (++phase1Counter >= 100) {
      break;
    }
  }
  
  // Phase 2: Verfeinerung mit 1-Stunden-Schritten
  // Ziel: Die minimale Stundenzahl finden, die das Requirement erfüllt
  while (generatedOrbs >= trRequirement && additionalHours > 0) {
    additionalHours -= 1;
    generatedOrbs = calculateOrbsForHours(currentHours + additionalHours);
  }
  
  // Korrektur: Wenn der letzte Test das Requirement nicht erfüllt hat,
  // muss eine Stunde hinzugefügt werden, um wieder über dem Requirement zu liegen
  if (generatedOrbs < trRequirement) {
    additionalHours += 1;
  }
  
  return additionalHours;
}