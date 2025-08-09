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
   * Reset migration status (for testing)
   */
  resetMigrationStatus() {
    localStorage.removeItem(this.migrationKey);
    console.log('🔄 Migration status reset - will trigger migration on next init');
  }

  /**
   * Check if IndexedDB is available and localStorage has TR data
   */
  async shouldMigrate() {
    // Don't migrate if already completed
    if (this.isMigrationCompleted()) {
      console.log('⏭️ Migration already completed, skipping...');
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
    console.log('🔍 Should migrate?', { hasLocalStorageData, idbAvailable, migrationCompleted: this.isMigrationCompleted() });
    
    return hasLocalStorageData;
  }

  /**
   * Check if localStorage contains TR tracking data
   */
  hasLocalStorageData() {
    // Debug: Log all localStorage keys to see what's available
    console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
    
    const keys = [
      'tr_tracking_selected_resources',
      'tr_tracking_tracks',
      'tr_tracking_custom_resources',
      // Additional possible keys from older versions
      'tr_tracker_resources',
      'tr_tracker_tracks',
      'trTracking_selectedResources',
      'trTracking_tracks',
      'trTracking_customResources'
    ];

    const foundKeys = keys.filter(key => localStorage.getItem(key) !== null);
    console.log('🔍 Found TR tracking keys:', foundKeys);
    
    return foundKeys.length > 0;
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

      // Try multiple possible keys for selected resources
      const resourceKeys = [
        'tr_tracking_selected_resources',
        'tr_tracker_resources', 
        'trTracking_selectedResources'
      ];
      
      for (const key of resourceKeys) {
        const savedSelectedResources = localStorage.getItem(key);
        if (savedSelectedResources) {
          console.log(`📖 Found selected resources in ${key}`);
          data.selectedResources = JSON.parse(savedSelectedResources);
          break;
        }
      }

      // Try multiple possible keys for tracks
      const trackKeys = [
        'tr_tracking_tracks',
        'tr_tracker_tracks',
        'trTracking_tracks'
      ];
      
      for (const key of trackKeys) {
        const savedTracks = localStorage.getItem(key);
        if (savedTracks) {
          console.log(`📖 Found tracks in ${key}`);
          data.tracks = JSON.parse(savedTracks);
          break;
        }
      }

      // Try multiple possible keys for custom resources
      const customResourceKeys = [
        'tr_tracking_custom_resources',
        'tr_tracker_custom_resources',
        'trTracking_customResources'
      ];
      
      for (const key of customResourceKeys) {
        const savedCustomResources = localStorage.getItem(key);
        if (savedCustomResources) {
          console.log(`📖 Found custom resources in ${key}`);
          data.customResources = JSON.parse(savedCustomResources);
          break;
        }
      }

      console.log('📖 Loaded localStorage data summary:', {
        selectedResources: !!data.selectedResources,
        tracks: data.tracks?.length || 0,
        customResources: data.customResources?.length || 0
      });

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
    console.log('🔄 Starting TR tracking data migration to IndexedDB...');
    
    try {
      // Initialize IndexedDB
      await this.idbService.init();
      console.log('✅ IndexedDB initialized successfully');
      
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
          console.log(`🔄 Migrating ${localData.selectedResources.length} selected resources...`);
          await this.idbService.saveTRSettings('selectedResources', localData.selectedResources);
          migrationResults.selectedResources = true;
          console.log('✅ Migrated selected resources');
        } catch (error) {
          console.error('❌ Failed to migrate selected resources:', error);
          migrationResults.errors.push(`Selected resources: ${error.message}`);
        }
      } else {
        console.log('⚠️ No selected resources found to migrate');
      }

      // Migrate custom resources
      if (localData.customResources) {
        try {
          console.log(`🔄 Migrating ${localData.customResources.length} custom resources...`);
          await this.idbService.saveTRSettings('customResources', localData.customResources);
          migrationResults.customResources = true;
          console.log('✅ Migrated custom resources');
        } catch (error) {
          console.error('❌ Failed to migrate custom resources:', error);
          migrationResults.errors.push(`Custom resources: ${error.message}`);
        }
      } else {
        console.log('⚠️ No custom resources found to migrate');
      }

      // Migrate tracks and entries
      if (localData.tracks && Array.isArray(localData.tracks)) {
        console.log(`🔄 Starting migration of ${localData.tracks.length} tracks...`);
        
        for (const track of localData.tracks) {
          try {
            console.log(`🔄 Migrating track: "${track.name}" with ${track.entries?.length || 0} entries`);
            
            // Log track structure for debugging
            console.log('Track structure:', {
              id: track.id,
              name: track.name,
              entriesCount: track.entries?.length || 0,
              hasResourceOrder: !!track.resourceOrder,
              hasInitialValues: !!track.initialValues
            });
            
            await this.idbService.saveTRTrack(track);
            migrationResults.tracks++;
            migrationResults.entries += track.entries ? track.entries.length : 0;
            console.log(`✅ Successfully migrated track: ${track.name} (${track.entries?.length || 0} entries)`);
          } catch (error) {
            console.error(`❌ Failed to migrate track "${track.name}":`, error);
            migrationResults.errors.push(`Track "${track.name}": ${error.message}`);
          }
        }
      } else {
        console.log('⚠️ No tracks found in localStorage data');
      }

      // Log migration results
      console.log('🎉 Migration completed with results:', migrationResults);
      
      // Verify the migration by checking if data exists in IndexedDB
      const verificationResults = await this.verifyMigrationData();
      console.log('🔍 Migration verification:', verificationResults);
      
      // Mark migration as completed
      this.markMigrationCompleted();
      
      // Create backup of localStorage data before cleanup
      await this.createLocalStorageBackup(localData);
      
      return {
        success: true,
        results: migrationResults,
        verification: verificationResults
      };

    } catch (error) {
      console.error('❌ Migration failed:', error);
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
   * Verify migration data exists in IndexedDB
   */
  async verifyMigrationData() {
    try {
      const selectedResources = await this.idbService.loadTRSettings('selectedResources');
      const customResources = await this.idbService.loadTRSettings('customResources');
      const tracks = await this.idbService.loadAllTRTracks();

      const verification = {
        selectedResourcesFound: !!selectedResources,
        selectedResourcesCount: selectedResources?.length || 0,
        customResourcesFound: !!customResources,
        customResourcesCount: customResources?.length || 0,
        tracksFound: !!tracks,
        tracksCount: tracks?.length || 0,
        entriesCount: tracks ? tracks.reduce((sum, track) => sum + (track.entries?.length || 0), 0) : 0
      };

      return verification;
    } catch (error) {
      console.error('❌ Failed to verify migration data:', error);
      return { error: error.message };
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
