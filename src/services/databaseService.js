/**
 * Database Service für CIFI Tools
 * Firebase Firestore implementation for Cloud Sync
 * Replaces the old Netlify Functions + Neon PostgreSQL backend
 */
import { db, storage } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { ref as storageRef, uploadString, getBytes, deleteObject } from 'firebase/storage';

export class DatabaseService {
  /**
   * Save user backup to Firestore
   * @param {string} userId - Firebase User UID
   * @param {string} backupCode - Base64 encoded backup
   * @param {string} appVersion - App version
   */
  async saveUserBackup(userId, backupCode, appVersion) {
    try {
      // 1. Upload backup string to Cloud Storage
      const backupRef = storageRef(storage, `backups/${userId}`);
      await uploadString(backupRef, backupCode);

      // 2. Save metadata to Firestore (without the heavy backupCode)
      const docRef = doc(db, 'userBackups', userId);
      await setDoc(docRef, {
        hasStorageBackup: true,
        appVersion,
        updatedAt: serverTimestamp()
      });

      return { user_id: userId, backup_code: backupCode, app_version: appVersion };
    } catch (error) {
      console.error('Failed to save backup to Firestore/Storage:', error);
      throw error;
    }
  }

  /**
   * Get only the metadata (updatedAt, appVersion) without downloading the full backup from storage.
   * Cheap Firestore read — used to display the last cloud save time on any device.
   * @param {string} userId - Firebase User UID
   * @returns {{ updated_at: string|null, app_version: string|null }|null}
   */
  async getBackupMetadata(userId) {
    try {
      const docRef = doc(db, 'userBackups', userId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      const data = docSnap.data();
      return {
        updated_at: data.updatedAt?.toDate?.()?.toISOString() || null,
        app_version: data.appVersion || null,
      };
    } catch (error) {
      console.warn('Failed to get backup metadata:', error);
      return null;
    }
  }

  /**
   * Listen to backup metadata changes in real-time.
   * @param {string} userId - Firebase User UID
   * @param {function} callback - Called with metadata object when it changes
   * @returns {function} Unsubscribe function
   */
  subscribeToBackupMetadata(userId, callback) {
    const docRef = doc(db, 'userBackups', userId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          updated_at: data.updatedAt?.toDate?.()?.toISOString() || null,
          app_version: data.appVersion || null,
        });
      } else {
        callback(null);
      }
    }, (error) => {
      console.warn('Backup metadata listener error:', error);
    });
  }

  /**
   * Get user backup from Firestore
   * @param {string} userId - Firebase User UID
   * @returns {Object|null} Backup object with backup_code, app_version, updated_at
   */
  async getUserBackup(userId) {
    try {
      const docRef = doc(db, 'userBackups', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      let backupCode = data.backupCode; // Fallback for old backups still in Firestore

      // If migrated to storage, fetch from there
      if (data.hasStorageBackup || !backupCode) {
        try {
          const backupRef = storageRef(storage, `backups/${userId}`);
          // Use getBytes instead of getDownloadURL + fetch to avoid CORS issues
          const arrayBuffer = await getBytes(backupRef);
          const decoder = new TextDecoder('utf-8');
          backupCode = decoder.decode(arrayBuffer);
        } catch (storageErr) {
          console.warn('Could not fetch backup from storage, falling back to Firestore if available', storageErr);
          if (!backupCode) throw storageErr; // If we don't have a fallback, throw
        }
      }

      return {
        backup_code: backupCode,
        app_version: data.appVersion,
        updated_at: data.updatedAt?.toDate?.()?.toISOString() || null
      };
    } catch (error) {
      console.error('Failed to get backup from Firestore/Storage:', error);
      throw error;
    }
  }

  /**
   * Delete user backup from Firestore
   * @param {string} userId - Firebase User UID
   */
  async deleteUserBackup(userId) {
    try {
      // 1. Delete from Storage
      try {
        const backupRef = storageRef(storage, `backups/${userId}`);
        await deleteObject(backupRef);
      } catch (storageErr) {
        // Ignore 404 errors if the file doesn't exist in storage yet
        if (storageErr.code !== 'storage/object-not-found') {
          console.warn('Error deleting from storage:', storageErr);
        }
      }

      // 2. Delete from Firestore
      const docRef = doc(db, 'userBackups', userId);
      await deleteDoc(docRef);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete backup from Firestore/Storage:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
