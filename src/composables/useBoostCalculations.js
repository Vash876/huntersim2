import { allBoosts } from '@/constants/tr-planner';



export function useBoostCalculations() {
  // Multiplikator-Wert für einen einzelnen Boost berechnen
  function calculateMultiplierValue(boost, values) {
    if (!boost || !boost.multiplier) return 1;
    
    if (typeof boost.multiplier === 'function') {
      return boost.multiplier(values[boost.key], values);
    }
    
    if (typeof boost.multiplier === 'number') {
      return (boost.type === 'boolean' && values[boost.key]) ? boost.multiplier : 1;
    }
    
    return 1;
  }
  
  // Orb-Multiplikator aus allen aktiven Boosts berechnen
  function calculateOrbMultiplier(boostValues) {
    let multiplier = 1;
    
    allBoosts.forEach(boost => {
      if (boost.orbcalc && boostValues[boost.key] !== undefined) {
        multiplier *= calculateMultiplierValue(boost, boostValues);
      }
    });
    
    return multiplier;
  }
  
  // Fragment-Multiplikator aus allen aktiven Boosts berechnen
  function calculateFragMultiplier(boostValues) {
    let multiplier = 1;
    
    allBoosts.forEach(boost => {
      if (boost.fragmulti && boostValues[boost.key] !== undefined) {
        if (typeof boost.fragmulti === 'function') {
          multiplier *= boost.fragmulti(boostValues[boost.key], boostValues);
        } else if (typeof boost.fragmulti === 'number') {
          if (boost.type === 'boolean' && boostValues[boost.key]) {
            multiplier *= boost.fragmulti;
          }
        }
      }
    });
    
    return multiplier;
  }
  
  return {
    calculateMultiplierValue,
    calculateOrbMultiplier,
    calculateFragMultiplier
  };
}