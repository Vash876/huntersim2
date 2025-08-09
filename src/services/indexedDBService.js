/**
 * IndexedDB Service for TR Tracking Data
 * Provides a modern storage solution with migration from localStorage
 */

class IndexedDBService {
  constructor(dbName = 'CIFI-Tools-DB', version = 2) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  /**
   * Initialize IndexedDB connection
   */
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores under trTracker namespace
        if (!db.objectStoreNames.contains('trTracker_tracks')) {
          const trackStore = db.createObjectStore('trTracker_tracks', { keyPath: 'id' });
          trackStore.createIndex('isActive', 'isActive', { unique: false });
          trackStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('trTracker_settings')) {
          db.createObjectStore('trTracker_settings', { keyPath: 'key' });
        }

        if (!db.objectStoreNames.contains('trTracker_entries')) {
          const entryStore = db.createObjectStore('trTracker_entries', { keyPath: 'id' });
          entryStore.createIndex('trackId', 'trackId', { unique: false });
          entryStore.createIndex('date', 'date', { unique: false });
        }
      };
    });
  }

  /**
   * Save TR tracking settings (selected resources, custom resources)
   */
  async saveTRSettings(key, data) {
    await this.init();
    
    const transaction = this.db.transaction(['trTracker_settings'], 'readwrite');
    const store = transaction.objectStore('trTracker_settings');
    
    // Serialize data to remove Vue proxy objects
    const serializedData = JSON.parse(JSON.stringify(data));
    
    return new Promise((resolve, reject) => {
      const request = store.put({ 
        key, 
        data: serializedData, 
        updatedAt: new Date().toISOString() 
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to save TR settings: ${key}`));
    });
  }

  /**
   * Load TR tracking settings
   */
  async loadTRSettings(key) {
    await this.init();
    
    const transaction = this.db.transaction(['trTracker_settings'], 'readonly');
    const store = transaction.objectStore('trTracker_settings');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result ? request.result.data : null);
      };
      request.onerror = () => reject(new Error(`Failed to load TR settings: ${key}`));
    });
  }

  /**
   * Save a TR track (without entries - they're stored separately)
   */
  async saveTRTrack(track) {
    await this.init();
    
    // Separate entries from track data
    const { entries, ...trackData } = track;
    
    const transaction = this.db.transaction(['trTracker_tracks', 'trTracker_entries'], 'readwrite');
    const trackStore = transaction.objectStore('trTracker_tracks');
    const entryStore = transaction.objectStore('trTracker_entries');
    
    // Serialize trackData to remove Vue proxy objects
    const serializedTrackData = JSON.parse(JSON.stringify({
      ...trackData,
      updatedAt: new Date().toISOString()
    }));
    
    // Save track metadata first
    await new Promise((resolve, reject) => {
      const trackRequest = trackStore.put(serializedTrackData);
      trackRequest.onsuccess = () => resolve(trackRequest.result);
      trackRequest.onerror = () => reject(new Error('Failed to save TR track'));
    });
    
    // Save entries separately for better performance
    if (entries && entries.length > 0) {
      await this.saveTrackEntries(track.id, entries, entryStore);
    }
    
    return serializedTrackData;
  }

  /**
   * Save track entries in batch
   */
  async saveTrackEntries(trackId, entries, entryStore = null) {
    if (!entryStore) {
      await this.init();
      const transaction = this.db.transaction(['trTracker_entries'], 'readwrite');
      entryStore = transaction.objectStore('trTracker_entries');
    }

    const promises = entries.map(entry => {
      return new Promise((resolve, reject) => {
        // Serialize entry data to remove Vue proxy objects
        const serializedEntry = JSON.parse(JSON.stringify({
          ...entry,
          trackId,
          updatedAt: new Date().toISOString()
        }));
        
        const request = entryStore.put(serializedEntry);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to save entry'));
      });
    });

    return Promise.all(promises);
  }

  /**
   * Load a TR track with its entries
   */
  async loadTRTrack(trackId) {
    await this.init();
    
    const transaction = this.db.transaction(['trTracker_tracks', 'trTracker_entries'], 'readonly');
    const trackStore = transaction.objectStore('trTracker_tracks');
    const entryStore = transaction.objectStore('trTracker_entries');
    
    // Load track metadata
    const trackPromise = new Promise((resolve, reject) => {
      const request = trackStore.get(trackId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to load TR track'));
    });

    // Load track entries
    const entriesPromise = new Promise((resolve, reject) => {
      const index = entryStore.index('trackId');
      const request = index.getAll(trackId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to load track entries'));
    });

    const [track, entries] = await Promise.all([trackPromise, entriesPromise]);
    
    if (!track) return null;
    
    return {
      ...track,
      entries: entries || []
    };
  }

  /**
   * Load all TR tracks with their entries
   */
  async loadAllTRTracks() {
    await this.init();
    
    const transaction = this.db.transaction(['trTracker_tracks', 'trTracker_entries'], 'readonly');
    const trackStore = transaction.objectStore('trTracker_tracks');
    const entryStore = transaction.objectStore('trTracker_entries');
    
    // Load all tracks
    const tracksPromise = new Promise((resolve, reject) => {
      const request = trackStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to load TR tracks'));
    });

    // Load all entries
    const entriesPromise = new Promise((resolve, reject) => {
      const request = entryStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to load track entries'));
    });

    const [tracks, allEntries] = await Promise.all([tracksPromise, entriesPromise]);
    
    // Group entries by trackId
    const entriesByTrack = {};
    allEntries.forEach(entry => {
      if (!entriesByTrack[entry.trackId]) {
        entriesByTrack[entry.trackId] = [];
      }
      entriesByTrack[entry.trackId].push(entry);
    });

    // Combine tracks with their entries
    return tracks.map(track => ({
      ...track,
      entries: entriesByTrack[track.id] || []
    }));
  }

  /**
   * Delete a TR track and all its entries
   */
  async deleteTRTrack(trackId) {
    await this.init();
    
    const transaction = this.db.transaction(['trTracker_tracks', 'trTracker_entries'], 'readwrite');
    const trackStore = transaction.objectStore('trTracker_tracks');
    const entryStore = transaction.objectStore('trTracker_entries');
    
    // Delete track
    const deleteTrackPromise = new Promise((resolve, reject) => {
      const request = trackStore.delete(trackId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(new Error('Failed to delete TR track'));
    });

    // Delete all entries for this track
    const deleteEntriesPromise = new Promise((resolve, reject) => {
      const index = entryStore.index('trackId');
      const request = index.getAllKeys(trackId);
      
      request.onsuccess = () => {
        const entryIds = request.result;
        const deletePromises = entryIds.map(entryId => {
          return new Promise((resolve, reject) => {
            const deleteRequest = entryStore.delete(entryId);
            deleteRequest.onsuccess = () => resolve(true);
            deleteRequest.onerror = () => reject(new Error('Failed to delete entry'));
          });
        });
        
        Promise.all(deletePromises).then(() => resolve(true)).catch(reject);
      };
      
      request.onerror = () => reject(new Error('Failed to find entries to delete'));
    });

    await Promise.all([deleteTrackPromise, deleteEntriesPromise]);
    return true;
  }

  /**
   * Add or update a track entry
   */
  async saveTrackEntry(trackId, entry) {
    await this.init();
    
    const transaction = this.db.transaction(['trTracker_entries'], 'readwrite');
    const store = transaction.objectStore('trTracker_entries');
    
    // Serialize entry data to remove Vue proxy objects
    const serializedEntry = JSON.parse(JSON.stringify({
      ...entry,
      trackId,
      updatedAt: new Date().toISOString()
    }));
    
    return new Promise((resolve, reject) => {
      const request = store.put(serializedEntry);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to save track entry'));
    });
  }

  /**
   * Delete a track entry
   */
  async deleteTrackEntry(entryId) {
    await this.init();
    
    const transaction = this.db.transaction(['trTracker_entries'], 'readwrite');
    const store = transaction.objectStore('trTracker_entries');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(entryId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(new Error('Failed to delete track entry'));
    });
  }

  /**
   * Check if IndexedDB is available and working
   */
  static async isAvailable() {
    if (!window.indexedDB) return false;
    
    try {
      const testDB = 'test-availability';
      const request = indexedDB.open(testDB, 1);
      
      return new Promise((resolve) => {
        request.onerror = () => resolve(false);
        request.onsuccess = () => {
          request.result.close();
          indexedDB.deleteDatabase(testDB);
          resolve(true);
        };
        request.onupgradeneeded = () => {
          // This is expected for a new database
        };
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats() {
    if (!navigator.storage || !navigator.storage.estimate) {
      return { quota: 0, usage: 0, available: false };
    }

    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        available: true,
        percentUsed: estimate.quota ? (estimate.usage / estimate.quota) * 100 : 0
      };
    } catch (error) {
      return { quota: 0, usage: 0, available: false };
    }
  }

  /**
   * Clear all TR tracking data
   */
  async clearAllTRData() {
    await this.init();
    
    const transaction = this.db.transaction(['trTracker_tracks', 'trTracker_entries', 'trTracker_settings'], 'readwrite');
    const trackStore = transaction.objectStore('trTracker_tracks');
    const entryStore = transaction.objectStore('trTracker_entries');
    const settingsStore = transaction.objectStore('trTracker_settings');
    
    return Promise.all([
      new Promise((resolve, reject) => {
        const request = trackStore.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error('Failed to clear TR tracks'));
      }),
      new Promise((resolve, reject) => {
        const request = entryStore.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error('Failed to clear TR entries'));
      }),
      new Promise((resolve, reject) => {
        const request = settingsStore.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(new Error('Failed to clear TR settings'));
      })
    ]);
  }

  /**
   * Close the database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export default IndexedDBService;
