/**
 * Migration Service for TR Tracking Data
 * Handles migration from localStorage to IndexedDB
 */

import IndexedDBService from './indexedDBService.js';

class TRDataMigrationService {
  constructor() {
    this.idbService = new IndexedDBService();
    this.migrationKey = 'tr_tracking_migration_completed';
  }

  /**
   * Check if migration has already been completed
   */
  isMigrationCompleted() {
    return localStorage.getItem(this.migrationKey) === 'true';
  }

  /**
   * Mark migration as completed
   */
  markMigrationCompleted() {
    localStorage.setItem(this.migrationKey, 'true');
  }

  /**
   * Check if IndexedDB is available and localStorage has TR data
   */
  async shouldMigrate() {
    // Don't migrate if already completed
    if (this.isMigrationCompleted()) {
      return false;
    }

    // Check if IndexedDB is available
    const idbAvailable = await IndexedDBService.isAvailable();
    if (!idbAvailable) {
      console.warn('IndexedDB not available, staying with localStorage');
      return false;
    }

    // Check if there's TR data in localStorage to migrate
    const hasLocalStorageData = this.hasLocalStorageData();
    
    return hasLocalStorageData;
  }

  /**
   * Check if localStorage contains TR tracking data
   */
  hasLocalStorageData() {
    const keys = [
      'tr_tracking_selected_resources',
      'tr_tracking_tracks',
      'tr_tracking_custom_resources'
    ];

    return keys.some(key => localStorage.getItem(key) !== null);
  }

  /**
   * Load existing data from localStorage
   */
  loadLocalStorageData() {
    try {
      const data = {
        selectedResources: null,
        tracks: null,
        customResources: null
      };

      // Load selected resources
      const savedSelectedResources = localStorage.getItem('tr_tracking_selected_resources');
      if (savedSelectedResources) {
        data.selectedResources = JSON.parse(savedSelectedResources);
      }

      // Load tracks
      const savedTracks = localStorage.getItem('tr_tracking_tracks');
      if (savedTracks) {
        data.tracks = JSON.parse(savedTracks);
      }

      // Load custom resources
      const savedCustomResources = localStorage.getItem('tr_tracking_custom_resources');
      if (savedCustomResources) {
        data.customResources = JSON.parse(savedCustomResources);
      }

      return data;
    } catch (error) {
      console.error('Failed to load localStorage data:', error);
      return null;
    }
  }

  /**
   * Migrate data from localStorage to IndexedDB
   */
  async migrateData() {
    console.log('Starting TR tracking data migration to IndexedDB...');
    
    try {
      // Initialize IndexedDB
      await this.idbService.init();
      
      // Load data from localStorage
      const localData = this.loadLocalStorageData();
      if (!localData) {
        throw new Error('Failed to load localStorage data');
      }

      const migrationResults = {
        selectedResources: false,
        customResources: false,
        tracks: 0,
        entries: 0,
        errors: []
      };

      // Migrate selected resources
      if (localData.selectedResources) {
        try {
          await this.idbService.saveTRSettings('selectedResources', localData.selectedResources);
          migrationResults.selectedResources = true;
          console.log('✅ Migrated selected resources');
        } catch (error) {
          migrationResults.errors.push(`Selected resources: ${error.message}`);
        }
      }

      // Migrate custom resources
      if (localData.customResources) {
        try {
          await this.idbService.saveTRSettings('customResources', localData.customResources);
          migrationResults.customResources = true;
          console.log('✅ Migrated custom resources');
        } catch (error) {
          migrationResults.errors.push(`Custom resources: ${error.message}`);
        }
      }

      // Migrate tracks and entries
      if (localData.tracks && Array.isArray(localData.tracks)) {
        for (const track of localData.tracks) {
          try {
            await this.idbService.saveTRTrack(track);
            migrationResults.tracks++;
            migrationResults.entries += track.entries ? track.entries.length : 0;
            console.log(`✅ Migrated track: ${track.name} (${track.entries?.length || 0} entries)`);
          } catch (error) {
            migrationResults.errors.push(`Track "${track.name}": ${error.message}`);
          }
        }
      }

      // Log migration results
      console.log('Migration completed:', migrationResults);
      
      // Mark migration as completed
      this.markMigrationCompleted();
      
      // Create backup of localStorage data before cleanup
      await this.createLocalStorageBackup(localData);
      
      return {
        success: true,
        results: migrationResults
      };

    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a backup of localStorage data (logging only)
   */
  async createLocalStorageBackup(data) {
    try {
      console.log('📦 localStorage backup data available:', {
        selectedResources: !!data.selectedResources,
        tracks: data.tracks?.length || 0,
        customResources: data.customResources?.length || 0,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to log backup data:', error);
    }
  }

  /**
   * Clean up localStorage data after successful migration
   * (Optional - keeps data as additional backup)
   */
  cleanupLocalStorage() {
    const keysToCleanup = [
      'tr_tracking_selected_resources',
      'tr_tracking_tracks', 
      'tr_tracking_custom_resources'
    ];

    keysToCleanup.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('🧹 Cleaned up localStorage TR tracking data');
  }

  /**
   * Verify migration was successful by comparing data
   */
  async verifyMigration() {
    try {
      const localData = this.loadLocalStorageData();
      if (!localData) return true; // No local data to verify

      // Load migrated data from IndexedDB
      const selectedResources = await this.idbService.loadTRSettings('selectedResources');
      const customResources = await this.idbService.loadTRSettings('customResources');
      const tracks = await this.idbService.loadAllTRTracks();

      // Compare selected resources
      if (localData.selectedResources && !selectedResources) {
        return false;
      }

      // Compare tracks count
      if (localData.tracks && tracks) {
        if (localData.tracks.length !== tracks.length) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Migration verification failed:', error);
      return false;
    }
  }

  /**
   * Rollback migration (restore to localStorage only)
   */
  async rollbackMigration() {
    try {
      // Remove migration completion flag
      localStorage.removeItem(this.migrationKey);
      
      // Close IndexedDB connection
      this.idbService.close();
      
      console.log('🔄 Migration rolled back - using localStorage');
      return true;
    } catch (error) {
      console.error('Rollback failed:', error);
      return false;
    }
  }

  /**
   * Get migration status and statistics
   */
  async getMigrationStatus() {
    const completed = this.isMigrationCompleted();
    const hasLocalData = this.hasLocalStorageData();
    const idbAvailable = await IndexedDBService.isAvailable();
    
    let storageStats = null;
    if (idbAvailable) {
      storageStats = await this.idbService.getStorageStats();
    }

    return {
      completed,
      hasLocalData,
      idbAvailable,
      shouldMigrate: !completed && hasLocalData && idbAvailable,
      storageStats
    };
  }
}

export default TRDataMigrationService;
