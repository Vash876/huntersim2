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
 * Berechnet den Catch-Up Multiplier basierend auf hoursInTR
 * @param {number} hoursInTR - Stunden im aktuellen TR
 * @returns {number} Berechneter Catch-Up Multiplier
 */
export function calculateCupMultiplier(hoursInTR) {
  if (!hoursInTR) return 1; // Standardwert
  return Math.min(2, Math.max(1, (hoursInTR * 0.00024) / 0.25 + 1));
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
      console.error(`Error calculating multiplier for ${boost.key}:`, e);
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
 * @returns {number} Geschätzte Orb-Gewinne
 */
export function calculateOrbGains(currentStats, planStats, boosts = []) {
  // Importiere die Boosts, falls nicht übergeben
  if (!boosts || boosts.length === 0) {
    try {
      // Versuche, die Boosts aus der Konstanten-Datei zu importieren
      const { allBoosts } = require('@/constants/tr-planner');
      boosts = allBoosts.filter(b => b.orbcalc); // Nur Boosts, die für Orb-Berechnung relevant sind
    } catch (e) {
      console.error('Error importing boosts:', e);
      return 0;
    }
  }

  // Basis-Orb-Rate 
  const baseOrbRate = 1; 
  
  let result = baseOrbRate;

  // Catch-Up Multiplier berechnen
  const catchUpMultiplier = calculateCupMultiplier(planStats.hoursInTR || 0);

  // Durch alle relevanten Boosts iterieren und Multiplikatoren anwenden
  boosts.forEach((boost) => {
    if (!boost.orbcalc) return; // Nur Boosts berücksichtigen, die für Orb-Berechnung relevant sind
    
    const value = planStats[boost.key];
    const multiplier = calculateMultiplier(boost, value, planStats);
    result *= multiplier;
  });

  // Catch-Up Multiplier anwenden
  result *= catchUpMultiplier;

  return result;
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
  
  // Hilfsfunktion, um den Fragment-Multiplikator für einen bestimmten Boost zu berechnen
  function getFragMultiplier(boostKey, value, values) {
    if (!value) return 1;
    
    const boost = boosts.find(b => b.key === boostKey);
    if (!boost || boost.fragmulti === undefined) return 1;
    
    if (typeof boost.fragmulti === 'function') {
      try {
        return boost.fragmulti(value, values);
      } catch (e) {
        console.error(`Error calculating fragmulti for ${boostKey}:`, e);
        return 1;
      }
    } else if (typeof boost.fragmulti === 'number') {
      return value ? boost.fragmulti : 1;
    }
    
    return 1;
  }
  
  // Hole die relevanten Werte aus planStats
  const attr3 = planStats.attr3 || 0;
  const m0 = getFragMultiplier("ms0", planStats.ms0, {...planStats, attr3});
  const attr1 = getFragMultiplier("attr1", planStats.attr1, planStats);
  const campfragdet = getFragMultiplier("campfragdet", planStats.campfragdet, planStats);
  const pow2 = getFragMultiplier("pow2", planStats.pow2, planStats);
  const research89 = getFragMultiplier("research89", planStats.research89, planStats);
  const ouroinstalls = getFragMultiplier("ouroinstalls", planStats.ouroinstalls, planStats);
  const campaigns = planStats.campaigns || 0;
  const r6 = planStats.r6 || 0;
  
  // R6 spezifische Berechnungen
  const r6Add = 2.75 * r6;
  const r6Multi = Math.pow(1.05, r6);
  
  let totalFrags = 0;
  
  // Kampagnen-Schleife, wie in deiner Original-Funktion
  for (let i = 0; i < campaigns; i++) {
    let baseFrags = (2.5 + r6Add) * (m0 * attr1 * campfragdet * pow2 * research89 * ouroinstalls * r6Multi);
    
    // Spezielle Multiplikatoren für bestimmte Kampagnen
    let campaignMulti = 1;
    if (i === 35) campaignMulti = 2;
    if (i === 39) campaignMulti = 3;
    if (i === 43) campaignMulti = 13;
    
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
      const initialCupMultiplier = calculateCupMultiplier(currentHours);
      const newCupMultiplier = calculateCupMultiplier(hours);
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