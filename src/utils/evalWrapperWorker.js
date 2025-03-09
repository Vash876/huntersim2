import { EVALBORGE } from './evalBorge';
import { EVALKNOX } from './evalKnox';
import { EVALOZZY } from './evalOzzy';

// Alle Original-Eval-Funktionen sammeln
const originalEvalFunctions = {
  BORGE: EVALBORGE,
  KNOX: EVALKNOX,
  OZZY: EVALOZZY
};

// Erstellt einen Hook für die Simulation-Funktionen
const stageDistributionCollector = {
  stages: {},
  clearStages: function() {
    this.stages = {};
  },
  addStage: function(stage) {
    if (!this.stages[stage]) {
      this.stages[stage] = 0;
    }
    this.stages[stage]++;
  },
  getDistribution: function(iterations) {
    return Object.entries(this.stages).map(([stage, count]) => ({
      stage: parseInt(stage),
      count: count,
      percentage: (count / iterations) * 100
    })).sort((a, b) => a.stage - b.stage);
  }
};

// Im Worker-Kontext auf 'self' setzen
self.stageDistributionCollector = stageDistributionCollector;
self.window = { stageDistributionCollector };

/**
 * Wandelt das Ergebnis einer Evaluierung um und fügt Statistiken hinzu
 */
function enhanceEvaluator(originalEvalFn) {
  // Hier patchen wir die Funktion, um window -> self zu ersetzen
  const patchedFnStr = originalEvalFn.toString()
    .replace(/window\./g, 'self.')
    .replace(/if\s*\(\s*window\s*\)/g, 'if (self)');
  
  // Erstelle eine Kopie der gepatchten Funktion
  const patchedFn = new Function('return ' + patchedFnStr)();
  
  return function(...args) {
    // Lösche die bisherigen Stage-Daten
    stageDistributionCollector.clearStages();
    
    // Führe die modifizierte Funktion aus und erhalte die Ergebnisse
    const originalResults = patchedFn(...args);
    
    // Extrahiere die Iterationen (letztes Argument)
    const iterations = args[args.length - 1];
    
    // Hole die gesammelten Stage-Daten
    const stageDistribution = stageDistributionCollector.getDistribution(iterations);
    
    // Wende unsere Erweiterungen auf die originalen Ergebnisse an
    const enhancedResults = originalResults.map(result => {
      // Füge die Stage-Verteilung zum originalen Ergebnis hinzu
      return [...result, stageDistribution];
    });
    
    return enhancedResults;
  };
}

// Alle Enhanced-Funktionen dynamisch erstellen
const enhancedFunctions = {};
Object.entries(originalEvalFunctions).forEach(([hunterId, evalFn]) => {
  enhancedFunctions[`EnhancedEVAL${hunterId}`] = enhanceEvaluator(evalFn);
});

// Exportiere alle enhancedFunctions
export const EnhancedEVALBORGE = enhancedFunctions.EnhancedEVALBORGE;
export const EnhancedEVALKNOX = enhancedFunctions.EnhancedEVALKNOX;
export const EnhancedEVALOZZY = enhancedFunctions.EnhancedEVALOZZY;

// Exportiere alle enhancedFunctions für dynamischen Zugriff
export default enhancedFunctions;