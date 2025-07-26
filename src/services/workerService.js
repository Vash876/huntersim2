import * as Comlink from 'comlink';

/**
 * Worker-Pool für parallele Build-Evaluierungen
 */
class WorkerPool {
  constructor(poolSize = undefined) {
    // Wenn poolSize nicht definiert ist, verwende alle verfügbaren Kerne
    const maxCores = navigator.hardwareConcurrency || 4;
    
    // Wenn poolSize definiert ist, begrenzen, ansonsten alle Kerne verwenden
    this.poolSize = poolSize ? Math.max(1, Math.min(poolSize, maxCores)) : maxCores;
    
    this.workers = [];
    this.apis = [];
    this.busyWorkers = new Set();
    this.initialize();
  }

  initialize() {    
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(new URL('../workers/evaluationWorker.js', import.meta.url), { type: 'module' });
      const api = Comlink.wrap(worker);
      
      this.workers.push(worker);
      this.apis.push(api);
    }
  }

  async getAvailableWorker() {
    // Versuche einen nicht beschäftigten Worker zu finden
    for (let i = 0; i < this.workers.length; i++) {
      if (!this.busyWorkers.has(i)) {
        this.busyWorkers.add(i);
        return {
          index: i,
          worker: this.workers[i],
          api: this.apis[i],
          release: () => this.releaseWorker(i)
        };
      }
    }

    // Wenn alle Worker beschäftigt sind, warte bis einer frei wird
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        for (let i = 0; i < this.workers.length; i++) {
          if (!this.busyWorkers.has(i)) {
            clearInterval(checkInterval);
            this.busyWorkers.add(i);
            resolve({
              index: i,
              worker: this.workers[i],
              api: this.apis[i],
              release: () => this.releaseWorker(i)
            });
            return;
          }
        }
      }, 100);
    });
  }

  releaseWorker(index) {
    this.busyWorkers.delete(index);
  }

  cleanup() {
    for (const worker of this.workers) {
      if (worker && worker.terminate) {
        worker.terminate();
      }
    }
    this.workers = [];
    this.apis = [];
    this.busyWorkers.clear();
  }
}

// Erstelle den Worker-Pool mit Anzahl der CPU-Kerne oder 4 als Fallback
const workerPool = new WorkerPool();

/**
 * Bereinigt reaktive Daten für die Übergabe an Worker
 */
function sanitizeForWorker(obj) {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForWorker(item));
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  const result = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'object' && value !== null) {
        result[key] = sanitizeForWorker(value);
      } else if (typeof value !== 'function') {
        result[key] = value;
      }
    }
  }
  
  return result;
}

/**
 * Evaluiert einen Build mit Hilfe eines Web Workers und unterstützt Fortschrittsanzeigen
 * @param {string} hunterId - ID des Hunters
 * @param {Object} buildData - Build-Daten
 * @param {Object} store - Store-Daten
 * @param {Function} progressCallback - Callback für Fortschrittsänderungen
 */
export async function evaluateBuildWithWorker(hunterId, buildData, store, progressCallback = null) {
  // Hole einen verfügbaren Worker aus dem Pool
  const { worker, api, release } = await workerPool.getAvailableWorker();
  
  try {
    if (!buildData) {
      throw new Error("BuildData is undefined or null");
    }
    
    const sanitizedBuildData = sanitizeForWorker(buildData);
    
    if (!sanitizedBuildData) {
      throw new Error("Sanitized BuildData is undefined or null");
    }
    
    const storeData = {
      hunterStats: sanitizeForWorker(store?.hunterStats || {}),
      upgrades: sanitizeForWorker(store?.upgrades || {}),
      hunterIterations: sanitizeForWorker(store?.hunterIterations || {}),
      hunterSeedSettings: sanitizeForWorker(store?.hunterSeedSettings || {})
    };

    // Die Iterations-Informationen
    const iterations = storeData.hunterIterations[hunterId] || 1000;
    let lastProgressIteration = 0;
    
    // Wenn ein Fortschritts-Callback vorhanden ist
    if (progressCallback && typeof progressCallback === 'function') {
      // Initialen Fortschritt mit 0 senden
      progressCallback({
        iteration: 0,
        total: iterations
      });
      
      // Event-Listener für Fortschrittsupdates
      const messageHandler = (event) => {
        if (event.data && event.data.type === 'progress' && event.data.progress) {
          lastProgressIteration = event.data.progress.iteration;
          progressCallback(event.data.progress);
        }
      };
      
      // Event-Listener registrieren
      worker.addEventListener('message', messageHandler);
      
      try {
        // Die eigentliche Evaluierung starten
        const result = await api.evaluate(hunterId, sanitizedBuildData, storeData);
        
        // 100% Fortschritt zum Abschluss melden
        // Nur senden wenn nicht schon 100%
        if (lastProgressIteration < iterations) {
          progressCallback({
            iteration: iterations,
            total: iterations
          });
        }
        
        return result;
      } finally {
        // Event-Listener entfernen, wenn wir fertig sind
        worker.removeEventListener('message', messageHandler);
      }
    }
    else {
      // Wenn kein Callback vorhanden ist, einfach normal evaluieren
      const result = await api.evaluate(hunterId, sanitizedBuildData, storeData);

      return result;
    }
  } catch (error) {
    console.error(`Error in worker evaluation for ${buildData.name || 'unnamed build'}:`, error);
    throw error;
  } finally {
    // Worker zurück in den Pool geben
    release();
  }
}

/**
 * Bereinigt die Worker-Ressourcen (beim App-Shutdown)
 */
export function cleanupWorkers() {
  workerPool.cleanup();
}

/**
 * Gibt die Anzahl der aktiven Worker im Pool zurück
 */
export function getWorkerPoolSize() {
  return workerPool.poolSize;
}

/**
 * Gibt die Anzahl der derzeit beschäftigten Worker zurück
 */
export function getBusyWorkersCount() {
  return workerPool.busyWorkers.size;
}