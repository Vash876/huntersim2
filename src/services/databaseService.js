/**
 * Database Service für CIFI Tools
 * Firebase Firestore implementation for Cloud Sync
 * Replaces the old Netlify Functions + Neon PostgreSQL backend
 */
import { db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore/lite';

export class DatabaseService {
  /**
   * Save user backup to Firestore
   * @param {string} userId - Firebase User UID
   * @param {string} backupCode - Base64 encoded backup
   * @param {string} appVersion - App version
   */
  async saveUserBackup(userId, backupCode, appVersion) {
    try {
      const docRef = doc(db, 'userBackups', userId);
      await setDoc(docRef, {
        backupCode,
        appVersion,
        updatedAt: serverTimestamp()
      });

      return { user_id: userId, backup_code: backupCode, app_version: appVersion };
    } catch (error) {
      console.error('Failed to save backup to Firestore:', error);
      throw error;
    }
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
      return {
        backup_code: data.backupCode,
        app_version: data.appVersion,
        updated_at: data.updatedAt?.toDate?.()?.toISOString() || null
      };
    } catch (error) {
      console.error('Failed to get backup from Firestore:', error);
      throw error;
    }
  }

  /**
   * Delete user backup from Firestore
   * @param {string} userId - Firebase User UID
   */
  async deleteUserBackup(userId) {
    try {
      const docRef = doc(db, 'userBackups', userId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete backup from Firestore:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
