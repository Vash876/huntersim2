/**
 * Firebase Auth Service for CIFI Tools
 * Drop-in replacement for the legacy Neon/Stack Auth service
 * Maintains the same API surface for backward compatibility
 */
import { ref, computed } from 'vue';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import {
  doc, updateDoc, collection, query, where, getDocs, serverTimestamp
} from 'firebase/firestore/lite';
import { checkAndCacheSecretAccess } from '../constants/navigation';

class NeonAuthService {
  constructor() {
    // Reactive state
    this.user = ref(null);
    this.isAuthenticated = ref(false);
    this.isLoading = ref(true);
    this.error = ref(null);

    // Google Auth Provider
    this._googleProvider = new GoogleAuthProvider();

    // Event handler callback (set by syncStore)
    this.onAuthStateChanged = null;

    // Setup Firebase auth state listener
    this._setupAuthListener();
  }

  _setupAuthListener() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        this.user.value = this._mapUser(firebaseUser);
        this.isAuthenticated.value = true;
        checkAndCacheSecretAccess(firebaseUser.uid);
      } else {
        this.user.value = null;
        this.isAuthenticated.value = false;
        checkAndCacheSecretAccess(null);
      }

      this.isLoading.value = false;

      // Trigger callback if registered (used by syncStore)
      if (this.onAuthStateChanged) {
        this.onAuthStateChanged(this.user.value);
      }
    });
  }

  /**
   * Map Firebase user to a format compatible with the old Stack Auth user object.
   * Provides compatibility aliases (id, primaryEmail, name) so all consumers
   * continue to work without changes.
   */
  _mapUser(firebaseUser) {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      id: firebaseUser.uid,                // Compatibility alias for syncStore
      email: firebaseUser.email,
      primaryEmail: firebaseUser.email,     // Compatibility alias for old templates
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      name: firebaseUser.displayName        // Compatibility alias
    };
  }

  // Firebase onAuthStateChanged handles initialization automatically
  async init() {}

  async refreshAuthState() {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        await firebaseUser.reload();
        this.user.value = this._mapUser(firebaseUser);
        this.isAuthenticated.value = true;
      } else {
        this.user.value = null;
        this.isAuthenticated.value = false;
      }
      return this.user.value;
    } catch (error) {
      console.error('Auth refresh failed:', error);
      this.error.value = error.message;
      throw error;
    }
  }

  // Primary sign-in method: Google popup
  async signInWithGoogle() {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      const result = await signInWithPopup(auth, this._googleProvider);
      // onAuthStateChanged listener will handle state updates
      return this._mapUser(result.user);
    } catch (error) {
      // Don't treat popup-closed as an error
      if (error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/cancelled-popup-request') {
        this.isLoading.value = false;
        return null;
      }
      console.error('Google sign in failed:', error);
      this.error.value = error.message;
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // signIn() and signUp() both delegate to Google sign-in
  async signIn() {
    return this.signInWithGoogle();
  }

  async signUp() {
    return this.signInWithGoogle();
  }

  async signOut() {
    try {
      this.isLoading.value = true;
      this.error.value = null;
      await firebaseSignOut(auth);
      // onAuthStateChanged listener will handle state updates
      checkAndCacheSecretAccess(null);
      return true;
    } catch (error) {
      console.error('Sign out failed:', error);
      this.error.value = error.message;
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  async updateUserDisplayName(displayName) {
    try {
      this.isLoading.value = true;
      this.error.value = null;

      if (!displayName || !displayName.trim()) {
        throw new Error('Display name cannot be empty');
      }

      const trimmedName = displayName.trim();

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No authenticated user');
      }

      // 1. Update Firebase Auth profile
      await updateProfile(firebaseUser, { displayName: trimmedName });
      this.user.value = this._mapUser(firebaseUser);

      // 2. Update Firestore users/{uid} document
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await updateDoc(userRef, {
          displayName: trimmedName,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Failed to update Firestore user profile (may not exist yet):', err);
      }

      // 3. Update ownerName in all sharedTracks owned by this user
      try {
        const q = query(
          collection(db, 'sharedTracks'),
          where('ownerId', '==', firebaseUser.uid)
        );
        const snap = await getDocs(q);
        const updatePromises = snap.docs.map(d =>
          updateDoc(d.ref, { ownerName: trimmedName, updatedAt: serverTimestamp() })
        );
        await Promise.all(updatePromises);
        if (snap.docs.length > 0) {
          console.log(`Updated ownerName in ${snap.docs.length} shared tracks`);
        }
      } catch (err) {
        console.warn('Failed to update shared tracks ownerName:', err);
      }

      return this.user.value;
    } catch (error) {
      console.error('Update display name failed:', error);
      this.error.value = error.message;
      throw error;
    } finally {
      this.isLoading.value = false;
    }
  }

  // Not applicable for Google-only auth
  async resetPassword() {
    throw new Error('Password reset is not available. Please use Google sign-in.');
  }

  async signInWithGitHub() {
    throw new Error('GitHub sign-in is not available. Please use Google sign-in.');
  }

  // Utility methods
  getCurrentUser() {
    return this.user.value;
  }

  isSignedIn() {
    return this.isAuthenticated.value;
  }

  getUserEmail() {
    return this.user.value?.email || null;
  }

  getUserDisplayName() {
    return this.user.value?.displayName || this.user.value?.email || 'User';
  }

  getUserId() {
    return this.user.value?.uid || null;
  }

  // Computed properties for Vue templates
  get userComputed() {
    return computed(() => this.user.value);
  }

  get isAuthenticatedComputed() {
    return computed(() => this.isAuthenticated.value);
  }

  get isLoadingComputed() {
    return computed(() => this.isLoading.value);
  }

  get errorComputed() {
    return computed(() => this.error.value);
  }

  clearError() {
    this.error.value = null;
  }

  // Alias for backward compatibility
  async initAuth() {
    return await this.init();
  }
}

// Export singleton instance
export const neonAuthService = new NeonAuthService();
export default neonAuthService;
