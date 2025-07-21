/**
 * Database Service für CIFI Tools
 * Simplified Cloud Sync using Backup/Restore functionality
 * Development: Uses Mock localStorage service
 * Production: Uses Netlify Functions API
 */

export class DatabaseService {
  constructor() {
    // API URL für Netlify Dev (Port 8888) oder Production
    this.apiBaseUrl = import.meta.env.VITE_API_URL || '/.netlify/functions';
    this.useLocalStorage = false;
    
    console.log('DatabaseService: Using API at', this.apiBaseUrl);
    this.clientId = this.generateClientId();
  }

  generateClientId() {
    // Unique identifier für dieses Device/Browser
    const stored = localStorage.getItem('cifi-client-id');
    if (stored) return stored;
    
    // Fallback UUID generator für alle Browser
    const clientId = this.generateUUID();
    localStorage.setItem('cifi-client-id', clientId);
    return clientId;
  }

  generateUUID() {
    // Moderne Browser: crypto.getRandomValues
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15);
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    
    // Letzter Fallback mit Math.random (weniger sicher aber funktioniert überall)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Get auth headers for API requests
  async getAuthHeaders() {
    // Versuche einen echten Stack Auth Token zu bekommen
    try {
      // Import Stack Auth dynamisch um zirkuläre Dependencies zu vermeiden
      const { stackClientApp } = await import('./stackAuth.js');
      
      // Versuche aktuellen User und Token zu bekommen
      const currentUser = await stackClientApp.getUser();
      if (currentUser) {
        // Erstelle Token im erwarteten Format: Base64-kodiert "stack-auth:userId"
        const tokenPayload = `stack-auth:${currentUser.id}`;
        const userToken = btoa(tokenPayload);
        
        console.log('Generated auth token for user:', currentUser.id);
        console.log('Token payload:', tokenPayload);
        console.log('Encoded token:', userToken);
        
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
          'X-User-ID': currentUser.id
        };
      }
    } catch (error) {
      console.warn('Could not get Stack Auth token:', error);
    }
    
    // Fallback für Development
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer dev-token'
    };
  }

  /**
   * User Management
   * Note: Mit Stack Auth brauchen wir keine eigene User-Verwaltung mehr
   * Stack Auth verwaltet die Benutzer für uns
   */
  async getUser(stackUserId) {
    try {
      // Development: Mock-Antwort
      if (this.useLocalStorage) {
        console.log(`DEV MODE: Mock getUser for Stack Auth ID: ${stackUserId}`);
        return {
          id: stackUserId,
          provider: 'stack-auth',
          created_at: new Date().toISOString()
        };
      }

      // Production: API Call (falls benötigt für erweiterte User-Metadaten)
      const response = await fetch(`${this.apiBaseUrl}/users/${stackUserId}`);
      if (!response.ok) throw new Error('Failed to get user');
      return await response.json();
    } catch (error) {
      console.error('Database: Get user failed:', error);
      throw error;
    }
  }

  /**
   * Generic Data Storage
   */
  async saveUserData(userId, dataType, dataValue, dataKey = null) {
    try {
      console.log(`API: Saving user data - ${dataType}:`, dataValue);
      
      // API Call
      const response = await fetch(`${this.apiBaseUrl}/api`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ userId, dataType, dataValue, dataKey })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to save user data: ${response.status} - ${errorData}`);
      }
      
      const result = await response.json();
      console.log(`API: Saved user data for ${dataType}`, result);
      return result;
    } catch (error) {
      console.error('Database: Save user data failed:', error);
      throw error;
    }
  }

  async getUserData(userId, dataType, dataKey = null) {
    try {
      console.log(`API: Getting user data - ${dataType}`, dataKey);
      
      // Build query parameters
      const params = new URLSearchParams({ userId });
      if (dataType) params.append('dataType', dataType);
      if (dataKey) params.append('dataKey', dataKey);
      
      // API Call
      const url = `${this.apiBaseUrl}/api?${params}`;
      console.log('API: Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });
      
      console.log('API: Response status:', response.status);
      console.log('API: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API: Error response:', errorData);
        throw new Error(`Failed to get user data: ${response.status} - ${errorData}`);
      }
      
      const responseText = await response.text();
      console.log('API: Raw response:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('API: JSON parse failed. Raw response:', responseText);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }
      
      console.log(`API: Retrieved user data for ${dataType}`, result);
      
      // Return in the same format as localStorage version
      if (Array.isArray(result)) {
        return result.map(item => ({
          ...item,
          data_value: typeof item.data_value === 'string' ? JSON.parse(item.data_value) : item.data_value
        }));
      } else if (result) {
        return {
          ...result,
          data_value: typeof result.data_value === 'string' ? JSON.parse(result.data_value) : result.data_value
        };
      }
      
      return result;
    } catch (error) {
      console.error('Database: Get user data failed:', error);
      throw error;
    }
  }

  async getAllUserData(userId) {
    try {
      console.log('API: Getting all user data for:', userId);
      
      // API Call - get all data for this user
      const response = await fetch(`${this.apiBaseUrl}/api?userId=${userId}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to get all user data: ${response.status} - ${errorData}`);
      }
      
      const result = await response.json();
      console.log('API: Retrieved all user data:', result);
      
      // Group by data_type for easier consumption
      const grouped = {};
      if (Array.isArray(result)) {
        result.forEach(item => {
          if (!grouped[item.data_type]) {
            grouped[item.data_type] = {};
          }
          const key = item.data_key || 'default';
          grouped[item.data_type][key] = typeof item.data_value === 'string' ? JSON.parse(item.data_value) : item.data_value;
        });
      }
      
      return grouped;
    } catch (error) {
      console.error('Database: Get all user data failed:', error);
      throw error;
    }
  }

  /**
   * Development Helper Methods
   */
  clearLocalData(userId = null) {
    // This method is kept for backward compatibility but does nothing now
    console.log('Clear local data called (no-op in API mode)');
  }

  listLocalData() {
    // This method is kept for backward compatibility but does nothing now
    console.log('List local data called (no-op in API mode)');
    return [];
  }

  /**
   * Tools-specific convenience methods
   */
  async saveToolsData(userId, toolsData) {
    return this.saveUserData(userId, 'tools_data', toolsData);
  }

  async getToolsData(userId) {
    try {
      const result = await this.getUserData(userId, 'tools_data');
      
      // Return the data_value directly for tools data
      if (Array.isArray(result) && result.length > 0) {
        return result[0].data_value;
      } else if (result && result.data_value) {
        return result.data_value;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get tools data:', error);
      return null;
    }
  }

  /**
   * Cleanup old database entries to save space
   * Keeps only the latest 3 versions per user/dataType combination
   */
  async cleanupOldEntries() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ action: 'cleanup' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Database cleanup completed:', result);
      return result;
    } catch (error) {
      console.error('Database cleanup failed:', error);
      throw error;
    }
  }

  /**
   * SIMPLIFIED BACKUP CLOUD SYNC
   * Uses the existing backup/restore functionality from Settings
   */

  /**
   * Save user backup to cloud
   * @param {string} userId - Stack Auth User ID
   * @param {string} backupCode - Base64 encoded backup from createBackup()
   * @param {string} appVersion - App version (e.g. "2.7.0")
   */
  async saveUserBackup(userId, backupCode, appVersion) {
    try {
      console.log('Saving user backup to cloud:', { userId, appVersion, backupCodeLength: backupCode.length });

      // Development: Mock save
      if (this.useLocalStorage) {
        const mockBackup = {
          user_id: userId,
          backup_code: backupCode,
          app_version: appVersion,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(`cifi_cloud_backup_${userId}`, JSON.stringify(mockBackup));
        console.log('DEV MODE: Backup saved to localStorage');
        return mockBackup;
      }

      // Production: API Call
      const response = await fetch(`${this.apiBaseUrl}/save-backup`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          userId: userId,
          backupCode: backupCode,
          appVersion: appVersion
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save backup: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Backup saved successfully:', result);
      return result.data; // Return the data object

    } catch (error) {
      console.error('Failed to save user backup:', error);
      throw error;
    }
  }

  /**
   * Get user backup from cloud
   * @param {string} userId - Stack Auth User ID
   * @returns {Object|null} Backup object with backup_code, app_version, etc.
   */
  async getUserBackup(userId) {
    try {
      console.log('Loading user backup from cloud:', userId);

      // Development: Mock load
      if (this.useLocalStorage) {
        const stored = localStorage.getItem(`cifi_cloud_backup_${userId}`);
        if (stored) {
          const backup = JSON.parse(stored);
          console.log('DEV MODE: Backup loaded from localStorage');
          return backup;
        }
        console.log('DEV MODE: No backup found in localStorage');
        return null;
      }

      // Production: API Call
      const response = await fetch(`${this.apiBaseUrl}/get-backup?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: await this.getAuthHeaders()
      });

      if (response.status === 404) {
        console.log('No backup found for user');
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to get backup: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Backup loaded successfully:', result);
      return result.data; // Return the data object with backup_code, etc.

    } catch (error) {
      console.error('Failed to get user backup:', error);
      throw error;
    }
  }

  /**
   * Delete user backup from cloud
   * @param {string} userId - Stack Auth User ID
   */
  async deleteUserBackup(userId) {
    try {
      console.log('Deleting user backup from cloud:', userId);

      // Development: Mock delete
      if (this.useLocalStorage) {
        localStorage.removeItem(`cifi_cloud_backup_${userId}`);
        console.log('DEV MODE: Backup deleted from localStorage');
        return { success: true };
      }

      // Production: API Call
      const response = await fetch(`${this.apiBaseUrl}/delete-backup`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          userId: userId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete backup: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Backup deleted successfully:', result);
      return result;

    } catch (error) {
      console.error('Failed to delete user backup:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();